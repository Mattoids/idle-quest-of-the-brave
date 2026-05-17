<?php
declare(strict_types=1);

namespace App\Auth;

use App\Bootstrap;
use App\Http\HttpException;
use App\Storage\FileStore;
use App\Storage\SaveRepository;
use App\Util\Random;
use App\Util\Uuid;
use App\Game\Defaults;

/**
 * 设备账户体系
 *
 * - 注册：服务端生成 device_id（UUID v4） + recovery_code，返回给客户端持有
 * - 登录：客户端凭 device_id 登录（弱凭证），获得 token；可附加 recovery_code 加强
 * - 恢复：仅凭 recovery_code 即可在新设备上拿回 device_id
 *
 * 文件结构：
 *   data/auth/devices/<hash[0..1]>/<device_hash>.json    设备主索引
 *   data/auth/recoveries/<hash[0..1]>/<recovery_hash>.json  恢复码反查（{device_hash, ...}）
 *
 * 哈希策略：sha256(device_id + salt) 与 sha256(recovery_code + salt)，不存原文
 */
final class AuthService
{
    private FileStore $files;
    private TokenStore $tokens;
    private SaveRepository $saves;
    private string $salt;
    private string $authDir;

    public function __construct(
        ?FileStore $files = null,
        ?TokenStore $tokens = null,
        ?SaveRepository $saves = null
    ) {
        $this->files  = $files  ?? new FileStore();
        $this->tokens = $tokens ?? new TokenStore();
        $this->saves  = $saves  ?? new SaveRepository();
        $this->salt   = (string) Bootstrap::config('auth.device_salt', '');
        $this->authDir = (string) Bootstrap::config('data_dir') . '/auth';
    }

    /**
     * 注册新设备：创建 device + recovery + token + 默认存档
     *
     * @return array{device_id:string, recovery_code:string, token:string}
     */
    public function register(?array $meta = null): array
    {
        $deviceId      = Uuid::v4();
        $deviceHash    = $this->hashDevice($deviceId);
        $recoveryCode  = Random::recoveryCode((int) Bootstrap::config('auth.recovery_length', 24));
        $recoveryHash  = $this->hashRecovery($recoveryCode);
        $now           = time();

        $deviceRecord = [
            'device_hash'   => $deviceHash,
            'recovery_hash' => $recoveryHash,
            'created_at'    => $now,
            'last_login_at' => $now,
            'meta'          => $meta ?? [],
        ];
        $this->files->writeJson($this->devicePath($deviceHash), $deviceRecord);

        $recoveryRecord = [
            'recovery_hash' => $recoveryHash,
            'device_hash'   => $deviceHash,
            'created_at'    => $now,
        ];
        $this->files->writeJson($this->recoveryPath($recoveryHash), $recoveryRecord);

        // 初始化默认存档
        if (!$this->saves->exists($deviceHash)) {
            $this->saves->create($deviceHash, Defaults::player(), Defaults::world());
        }

        $token = $this->tokens->issue($deviceHash);

        return [
            'device_id'     => $deviceId,
            'recovery_code' => $recoveryCode,
            'token'         => $token,
        ];
    }

    /**
     * 凭 device_id 登录（可选附 recovery_code 做双因素核验）
     *
     * @return array{device_id:string, token:string}
     */
    public function login(string $deviceId, ?string $recoveryCode = null): array
    {
        if (!Uuid::isValid($deviceId)) {
            throw HttpException::badRequest('invalid_device_id');
        }
        $deviceHash = $this->hashDevice($deviceId);
        $record = $this->files->readJson($this->devicePath($deviceHash));
        if (!$record) {
            throw HttpException::unauthorized('device_not_found');
        }
        if ($recoveryCode !== null && $recoveryCode !== '') {
            $rh = $this->hashRecovery($recoveryCode);
            if (!hash_equals((string) ($record['recovery_hash'] ?? ''), $rh)) {
                throw HttpException::unauthorized('recovery_mismatch');
            }
        }
        // 刷新 last_login_at
        $record['last_login_at'] = time();
        $this->files->writeJson($this->devicePath($deviceHash), $record);

        $token = $this->tokens->issue($deviceHash);
        return ['device_id' => $deviceId, 'token' => $token];
    }

    /**
     * 凭 recovery_code 恢复账号（迁移设备）
     *
     * @return array{device_hash:string, token:string}
     */
    public function recover(string $recoveryCode): array
    {
        $recoveryCode = trim($recoveryCode);
        if ($recoveryCode === '') {
            throw HttpException::badRequest('empty_recovery_code');
        }
        $rh = $this->hashRecovery($recoveryCode);
        $record = $this->files->readJson($this->recoveryPath($rh));
        if (!$record || empty($record['device_hash'])) {
            throw HttpException::unauthorized('recovery_invalid');
        }
        $deviceHash = (string) $record['device_hash'];
        $token = $this->tokens->issue($deviceHash);
        return [
            'device_hash' => $deviceHash,
            'token'       => $token,
        ];
    }

    /**
     * 重新生成恢复码（旧的失效），通过当前 token 调用
     */
    public function rotateRecovery(string $deviceHash): string
    {
        $devicePath = $this->devicePath($deviceHash);
        $record = $this->files->readJson($devicePath);
        if (!$record) {
            throw HttpException::notFound('device_not_found');
        }
        $oldHash = $record['recovery_hash'] ?? null;
        $newCode = Random::recoveryCode((int) Bootstrap::config('auth.recovery_length', 24));
        $newHash = $this->hashRecovery($newCode);

        $record['recovery_hash'] = $newHash;
        $record['rotated_at']    = time();
        $this->files->writeJson($devicePath, $record);

        // 写新反查
        $this->files->writeJson($this->recoveryPath($newHash), [
            'recovery_hash' => $newHash,
            'device_hash'   => $deviceHash,
            'created_at'    => time(),
        ]);
        // 删除旧反查
        if ($oldHash && $oldHash !== $newHash) {
            $this->files->delete($this->recoveryPath($oldHash));
        }
        return $newCode;
    }

    public function logout(string $token): void
    {
        $this->tokens->revoke($token);
    }

    public function hashDevice(string $deviceId): string
    {
        return hash('sha256', $deviceId . '|' . $this->salt);
    }

    public function hashRecovery(string $recovery): string
    {
        // 移除连字符（人类输入容错），再哈希
        $normalized = strtoupper(str_replace(['-', ' '], '', $recovery));
        return hash('sha256', $normalized . '|recovery|' . $this->salt);
    }

    public function devicePath(string $deviceHash): string
    {
        if (!preg_match('/^[a-f0-9]{32,128}$/', $deviceHash)) {
            throw new \InvalidArgumentException('invalid device hash');
        }
        return $this->authDir . '/devices/' . substr($deviceHash, 0, 2) . '/' . $deviceHash . '.json';
    }

    public function recoveryPath(string $recoveryHash): string
    {
        if (!preg_match('/^[a-f0-9]{32,128}$/', $recoveryHash)) {
            throw new \InvalidArgumentException('invalid recovery hash');
        }
        return $this->authDir . '/recoveries/' . substr($recoveryHash, 0, 2) . '/' . $recoveryHash . '.json';
    }
}

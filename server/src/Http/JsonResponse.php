<?php
declare(strict_types=1);

namespace App\Http;

/**
 * JSON 响应：统一 {ok, data} / {ok:false, error, ...}
 */
final class JsonResponse extends Response
{
    public static function ok($data = null, int $status = 200): self
    {
        return self::raw(['ok' => true, 'data' => $data], $status);
    }

    public static function error(string $error, int $status = 400, ?array $details = null): self
    {
        $payload = ['ok' => false, 'error' => $error];
        if ($details !== null) {
            $payload['details'] = $details;
        }
        return self::raw($payload, $status);
    }

    public static function raw(array $payload, int $status = 200): self
    {
        $body = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        if ($body === false) {
            $body = json_encode(['ok' => false, 'error' => 'json_encode_failed']);
            $status = 500;
        }
        return new self($body, $status, ['Content-Type' => 'application/json; charset=utf-8']);
    }
}

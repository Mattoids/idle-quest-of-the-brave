<?php
declare(strict_types=1);

namespace App\Http;

use Exception;

/**
 * HTTP 异常：携带 status code 与可选 details
 */
class HttpException extends Exception
{
    private int $statusCode;
    private ?array $details;

    public function __construct(string $message, int $statusCode = 400, ?array $details = null)
    {
        parent::__construct($message);
        $this->statusCode = $statusCode;
        $this->details = $details;
    }

    public function getStatusCode(): int
    {
        return $this->statusCode;
    }

    public function getDetails(): ?array
    {
        return $this->details;
    }

    public static function badRequest(string $msg = 'bad_request', ?array $details = null): self
    {
        return new self($msg, 400, $details);
    }

    public static function unauthorized(string $msg = 'unauthorized'): self
    {
        return new self($msg, 401);
    }

    public static function forbidden(string $msg = 'forbidden'): self
    {
        return new self($msg, 403);
    }

    public static function notFound(string $msg = 'not_found'): self
    {
        return new self($msg, 404);
    }

    public static function conflict(string $msg = 'conflict', ?array $details = null): self
    {
        return new self($msg, 409, $details);
    }

    public static function tooMany(string $msg = 'too_many_requests', ?array $details = null): self
    {
        return new self($msg, 429, $details);
    }

    public static function serviceUnavailable(string $msg = 'service_unavailable', ?array $details = null): self
    {
        return new self($msg, 503, $details);
    }
}

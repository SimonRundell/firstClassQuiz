<?php
/**
 * response.php
 *
 * Small helper for emitting a JSON response with a given HTTP status code.
 *
 * @param mixed $data
 * @param int   $code
 * @return void
 */
function json_response($data, int $code = 200)
{
    http_response_code($code);
    echo json_encode($data);
    exit();
}

/**
 * Reads and JSON-decodes the raw request body.
 *
 * @return array
 */
function json_body(): array
{
    $raw = file_get_contents('php://input');
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

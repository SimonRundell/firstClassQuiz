<?php
/**
 * db.php
 *
 * Reads DB credentials from api/.config.json (git-ignored; copy from
 * .config.example.json) and returns a shared PDO connection. The file is
 * protected from direct HTTP access by api/.htaccess.
 *
 * @return PDO
 */
require_once __DIR__ . '/lib/log.php';

function get_db()
{
    static $pdo = null;

    if ($pdo !== null) {
        return $pdo;
    }

    $configPath = __DIR__ . '/.config.json';
    if (!file_exists($configPath)) {
        http_response_code(500);
        echo json_encode(['error' => 'Missing api/.config.json - copy .config.example.json and fill in DB credentials.']);
        exit();
    }

    $config = json_decode(file_get_contents($configPath), true);
    if (!is_array($config) || !isset($config['db'])) {
        log_error('api/.config.json is not valid JSON or has no "db" section');
        http_response_code(500);
        echo json_encode(['error' => 'Invalid api/.config.json']);
        exit();
    }
    $config = $config['db'];

    $dsn = "mysql:host={$config['host']};dbname={$config['name']};charset=utf8mb4";
    $pdo = new PDO($dsn, $config['user'], $config['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    return $pdo;
}

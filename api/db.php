<?php
/**
 * db.php
 *
 * Reads DB credentials from config.php (git-ignored; copy from
 * config.example.php) and returns a shared PDO connection. Credentials
 * live in a .php file (returning a plain array) rather than a .json file
 * so a direct HTTP request to it executes as PHP and returns nothing,
 * instead of the web server serving the raw secrets as static text.
 *
 * @return PDO
 */
function get_db()
{
    static $pdo = null;

    if ($pdo !== null) {
        return $pdo;
    }

    $configPath = __DIR__ . '/config.php';
    if (!file_exists($configPath)) {
        http_response_code(500);
        echo json_encode(['error' => 'Missing api/config.php - copy config.example.php and fill in DB credentials.']);
        exit();
    }

    $config = require $configPath;
    $config = $config['db'];

    $dsn = "mysql:host={$config['host']};dbname={$config['name']};charset=utf8mb4";
    $pdo = new PDO($dsn, $config['user'], $config['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    return $pdo;
}

<?php
/**
 * log.php
 *
 * Error logging for the API. Writes to api/logs/error.log (git-ignored and
 * blocked from direct HTTP access by api/.htaccess), and installs handlers
 * so uncaught exceptions and PHP errors are logged instead of being shown
 * to the client. Included from response.php and db.php, so every endpoint
 * gets it.
 */

/**
 * Returns the directory used for log files, creating it if needed.
 *
 * @return string Absolute path, no trailing slash.
 */
function log_dir(): string
{
    $dir = __DIR__ . '/../logs';
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
    return $dir;
}

/**
 * Appends one line to the error log.
 *
 * @param string $message Short description of what went wrong.
 * @param array  $context Optional extra detail, JSON-encoded onto the line.
 * @return void
 */
function log_error(string $message, array $context = []): void
{
    $line = sprintf(
        "[%s] %s %s %s%s\n",
        date('Y-m-d H:i:s'),
        $_SERVER['REQUEST_METHOD'] ?? 'CLI',
        $_SERVER['REQUEST_URI'] ?? '',
        $message,
        $context ? ' ' . json_encode($context) : ''
    );
    @file_put_contents(log_dir() . '/error.log', $line, FILE_APPEND | LOCK_EX);
}

if (!defined('FCQ_LOG_HANDLERS')) {
    define('FCQ_LOG_HANDLERS', true);

    ini_set('display_errors', '0');

    set_exception_handler(function ($e) {
        log_error(get_class($e) . ': ' . $e->getMessage(), ['file' => $e->getFile(), 'line' => $e->getLine()]);
        if (!headers_sent()) {
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
        }
        echo json_encode(['error' => 'Internal server error']);
        exit();
    });

    set_error_handler(function ($severity, $message, $file, $line) {
        if (!(error_reporting() & $severity)) {
            return false;
        }
        log_error("PHP error: $message", ['file' => $file, 'line' => $line]);
        return true;
    });
}

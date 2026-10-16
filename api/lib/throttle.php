<?php
/**
 * throttle.php
 *
 * Tiny file-based failure counter used to rate-limit login attempts
 * without needing a schema change. State lives in api/logs/ (blocked from
 * HTTP access by api/.htaccess).
 */
require_once __DIR__ . '/log.php';

const THROTTLE_MAX_FAILURES = 5;
const THROTTLE_WINDOW_SECONDS = 900;

/**
 * @param string $key
 * @return string Path of the state file for a throttle key.
 */
function throttle_path(string $key): string
{
    return log_dir() . '/throttle_' . hash('sha256', $key) . '.json';
}

/**
 * Counts failures for a key that fall within the window.
 *
 * @param string $key
 * @return int[] Unix timestamps of recent failures.
 */
function throttle_recent(string $key): array
{
    $path = throttle_path($key);
    $times = is_file($path) ? json_decode((string)@file_get_contents($path), true) : [];
    $cutoff = time() - THROTTLE_WINDOW_SECONDS;

    return array_values(array_filter(is_array($times) ? $times : [], function ($t) use ($cutoff) {
        return $t > $cutoff;
    }));
}

/**
 * @param string $key
 * @return bool True when the key has too many recent failures.
 */
function throttle_blocked(string $key): bool
{
    return count(throttle_recent($key)) >= THROTTLE_MAX_FAILURES;
}

/**
 * Records one failure against a key.
 *
 * @param string $key
 * @return void
 */
function throttle_fail(string $key): void
{
    $times = throttle_recent($key);
    $times[] = time();
    @file_put_contents(throttle_path($key), json_encode($times), LOCK_EX);
}

/**
 * Clears a key's failures (after a successful login).
 *
 * @param string $key
 * @return void
 */
function throttle_clear(string $key): void
{
    @unlink(throttle_path($key));
}

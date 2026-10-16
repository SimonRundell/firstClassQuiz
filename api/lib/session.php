<?php
/**
 * session.php
 *
 * Single place that starts the admin PHP session with safe cookie flags
 * (HttpOnly, SameSite=Lax, and Secure when served over HTTPS).
 */

/**
 * Starts the session if it is not already running.
 *
 * @return void
 */
function start_admin_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');

    session_set_cookie_params(0, '/', '', $https, true);
    ini_set('session.cookie_samesite', 'Lax');
    ini_set('session.use_strict_mode', '1');
    session_start();
}

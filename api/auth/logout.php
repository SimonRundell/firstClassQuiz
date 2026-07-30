<?php
/**
 * POST /api/auth/logout.php
 *
 * Destroys the current admin session.
 */
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../lib/response.php';

ini_set('session.cookie_samesite', 'Lax');
session_start();
$_SESSION = [];
session_destroy();

json_response(['ok' => true]);

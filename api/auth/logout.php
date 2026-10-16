<?php
/**
 * POST /api/auth/logout.php
 *
 * Destroys the current admin session.
 */
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../lib/response.php';
require_once __DIR__ . '/../lib/session.php';

start_admin_session();
$_SESSION = [];
session_destroy();

json_response(['ok' => true]);

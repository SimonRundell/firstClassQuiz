<?php
/**
 * require_admin.php
 *
 * Include after cors.php/db.php in any endpoint that requires an
 * authenticated admin. Starts (or resumes) the PHP session and 401s if
 * no admin is logged in. On success, $_SESSION['admin_id'] is available.
 */
require_once __DIR__ . '/lib/response.php';

ini_set('session.cookie_samesite', 'Lax');
session_start();

if (empty($_SESSION['admin_id'])) {
    json_response(['error' => 'Not authenticated'], 401);
}

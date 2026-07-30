<?php
/**
 * One-off CLI script to seed an admin account, since there is no public
 * admin signup endpoint.
 *
 * Usage: php create_admin.php <username> <password> <display name>
 */
require_once __DIR__ . '/../db.php';

if (php_sapi_name() !== 'cli') {
    die("This script must be run from the command line.\n");
}

if ($argc < 4) {
    die("Usage: php create_admin.php <username> <password> <display name>\n");
}

[, $username, $password, $displayName] = $argv;

$stmt = get_db()->prepare('INSERT INTO firstclassquiz_admins (username, password_hash, display_name) VALUES (?, ?, ?)');
$stmt->execute([$username, password_hash($password, PASSWORD_DEFAULT), $displayName]);

echo "Admin '$username' created.\n";

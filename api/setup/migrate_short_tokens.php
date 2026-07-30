<?php
/**
 * One-off migration: shrinks quizzes.public_token from the original
 * 32-character hex token to the new 6-character shareable code, and
 * regenerates a token for every existing quiz.
 *
 * Usage: php migrate_short_tokens.php
 */
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/token.php';

if (php_sapi_name() !== 'cli') {
    die("This script must be run from the command line.\n");
}

$db = get_db();

$ids = $db->query('SELECT id FROM quizzes')->fetchAll(PDO::FETCH_COLUMN);
$updateStmt = $db->prepare('UPDATE quizzes SET public_token = ? WHERE id = ?');

foreach ($ids as $id) {
    $token = generate_quiz_token($db);
    $updateStmt->execute([$token, $id]);
    echo "Quiz $id -> $token\n";
}

$db->exec('ALTER TABLE quizzes MODIFY public_token CHAR(6) NOT NULL');

echo "Done. " . count($ids) . " quiz(zes) updated and column shrunk to CHAR(6).\n";

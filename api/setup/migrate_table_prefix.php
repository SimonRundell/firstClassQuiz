<?php
/**
 * One-off migration: renames every firstClassQuiz table to be prefixed
 * with firstclassquiz_, so this app's tables can safely coexist inside a
 * shared/multi-purpose database alongside other projects' tables.
 *
 * Safe to run against a database that still has the old, unprefixed
 * table names - RENAME TABLE preserves all data, indexes, and foreign
 * key constraints. Running it a second time is a no-op error (the old
 * table names won't exist any more) rather than doing anything harmful.
 *
 * Usage: php migrate_table_prefix.php
 */
require_once __DIR__ . '/../db.php';

if (php_sapi_name() !== 'cli') {
    die("This script must be run from the command line.\n");
}

$renames = [
    'admins' => 'firstclassquiz_admins',
    'quizzes' => 'firstclassquiz_quizzes',
    'question_sets' => 'firstclassquiz_question_sets',
    'questions' => 'firstclassquiz_questions',
    'submissions' => 'firstclassquiz_submissions',
    'responses' => 'firstclassquiz_responses',
];

$db = get_db();

$existing = $db->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);

$clauses = [];
foreach ($renames as $from => $to) {
    if (!in_array($from, $existing, true)) {
        echo "Skipping $from -> $to (table '$from' not found, already migrated?)\n";
        continue;
    }
    $clauses[] = "`$from` TO `$to`";
}

if (empty($clauses)) {
    echo "Nothing to rename.\n";
    exit();
}

$db->exec('RENAME TABLE ' . implode(', ', $clauses));

foreach ($renames as $from => $to) {
    if (in_array($from, $existing, true)) {
        echo "Renamed $from -> $to\n";
    }
}

echo "Done.\n";

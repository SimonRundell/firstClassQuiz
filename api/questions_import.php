<?php
/**
 * POST /api/questions_import.php
 * Body: { quizId, rows: [ { setTitle, type, prompt, required, config }, ... ] }
 *
 * Bulk-creates question sets (matched case-insensitively by title, or
 * created if no set with that title exists yet on this quiz) and their
 * questions from a parsed CSV import. Runs as a single transaction -
 * either everything is created or nothing is.
 *
 * Requires an authenticated admin.
 */
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/require_admin.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Method not allowed'], 405);
}

$body = json_body();
$quizId = (int)($body['quizId'] ?? 0);
$rows = $body['rows'] ?? [];
$validTypes = ['text', 'likert', 'choice'];

if (!$quizId || !is_array($rows) || empty($rows)) {
    json_response(['error' => 'quizId and a non-empty rows array are required'], 400);
}

$db = get_db();

$setStmt = $db->prepare('SELECT id, title, sort_order FROM firstclassquiz_question_sets WHERE quiz_id = ?');
$setStmt->execute([$quizId]);
$existingSets = $setStmt->fetchAll();

$setIdByTitle = [];
$nextSetOrder = 0;
foreach ($existingSets as $s) {
    $setIdByTitle[mb_strtolower(trim($s['title']))] = (int)$s['id'];
    $nextSetOrder = max($nextSetOrder, (int)$s['sort_order'] + 1);
}

$nextQuestionOrder = [];
$setsCreated = 0;
$questionsCreated = 0;

try {
    $db->beginTransaction();

    $insertSetStmt = $db->prepare('INSERT INTO firstclassquiz_question_sets (quiz_id, title, sort_order) VALUES (?, ?, ?)');
    $orderStmt = $db->prepare('SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_order FROM firstclassquiz_questions WHERE set_id = ?');
    $insertQuestionStmt = $db->prepare(
        'INSERT INTO firstclassquiz_questions (set_id, sort_order, type, prompt, required, config) VALUES (?, ?, ?, ?, ?, ?)'
    );

    foreach ($rows as $row) {
        $setTitle = trim($row['setTitle'] ?? '');
        $type = $row['type'] ?? '';
        $prompt = $row['prompt'] ?? '';

        if ($setTitle === '' || !in_array($type, $validTypes, true) || trim(strip_tags($prompt)) === '') {
            throw new InvalidArgumentException('setTitle, a valid type, and prompt are required for every row.');
        }

        $key = mb_strtolower($setTitle);
        if (!isset($setIdByTitle[$key])) {
            $insertSetStmt->execute([$quizId, $setTitle, $nextSetOrder]);
            $setIdByTitle[$key] = (int)$db->lastInsertId();
            $nextSetOrder++;
            $setsCreated++;
        }

        $setId = $setIdByTitle[$key];

        if (!isset($nextQuestionOrder[$setId])) {
            $orderStmt->execute([$setId]);
            $nextQuestionOrder[$setId] = (int)$orderStmt->fetch()['next_order'];
        }

        $insertQuestionStmt->execute([
            $setId,
            $nextQuestionOrder[$setId],
            $type,
            $prompt,
            !empty($row['required']) ? 1 : 0,
            json_encode($row['config'] ?? new stdClass()),
        ]);
        $nextQuestionOrder[$setId]++;
        $questionsCreated++;
    }

    $db->commit();
} catch (Exception $e) {
    $db->rollBack();
    json_response(['error' => 'Import failed: ' . $e->getMessage()], 400);
}

json_response(['ok' => true, 'setsCreated' => $setsCreated, 'questionsCreated' => $questionsCreated], 201);

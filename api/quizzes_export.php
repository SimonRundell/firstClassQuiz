<?php
/**
 * GET /api/quizzes_export.php?ids=1,2,3
 *
 * Exports one or more quizzes (or every quiz, if `ids` is omitted) as a
 * single nested JSON structure - title, description, active status, and
 * every question set and question in order. Deliberately excludes ids,
 * the public link token, and admin/timestamp metadata, since importing
 * this file always creates fresh quizzes rather than overwriting
 * anything.
 *
 * Requires an authenticated admin.
 */
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/require_admin.php';

$db = get_db();
$idsParam = trim($_GET['ids'] ?? '');

if ($idsParam !== '') {
    $ids = array_values(array_filter(array_map('intval', explode(',', $idsParam))));
    if (empty($ids)) {
        json_response(['error' => 'ids must be a comma-separated list of quiz ids'], 400);
    }
    $placeholders = implode(',', array_fill(0, count($ids), '?'));
    $quizStmt = $db->prepare("SELECT id, title, description, is_active FROM firstclassquiz_quizzes WHERE id IN ($placeholders) ORDER BY created_at DESC");
    $quizStmt->execute($ids);
} else {
    $quizStmt = $db->query('SELECT id, title, description, is_active FROM firstclassquiz_quizzes ORDER BY created_at DESC');
}

$quizzes = $quizStmt->fetchAll();

$setStmt = $db->prepare('SELECT id, title FROM firstclassquiz_question_sets WHERE quiz_id = ? ORDER BY sort_order, id');
$questionStmt = $db->prepare(
    'SELECT type, prompt, required, config FROM firstclassquiz_questions WHERE set_id = ? ORDER BY sort_order, id'
);

$export = array_map(function ($quiz) use ($setStmt, $questionStmt) {
    $setStmt->execute([$quiz['id']]);
    $sets = $setStmt->fetchAll();

    return [
        'title' => $quiz['title'],
        'description' => $quiz['description'],
        'isActive' => (bool)$quiz['is_active'],
        'sets' => array_map(function ($set) use ($questionStmt) {
            $questionStmt->execute([$set['id']]);

            return [
                'title' => $set['title'],
                'questions' => array_map(function ($q) {
                    return [
                        'type' => $q['type'],
                        'prompt' => $q['prompt'],
                        'required' => (bool)$q['required'],
                        'config' => json_decode($q['config'], true),
                    ];
                }, $questionStmt->fetchAll()),
            ];
        }, $sets),
    ];
}, $quizzes);

json_response([
    'exportedAt' => date('c'),
    'quizzes' => $export,
]);

<?php
/**
 * GET /api/search_questions.php?q=
 *
 * Returns the ids of every quiz that has at least one question whose
 * prompt contains the search text. Used to let the quiz list be
 * filtered by question content, not just quiz title.
 *
 * Requires an authenticated admin.
 */
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/require_admin.php';

$query = trim($_GET['q'] ?? '');

if ($query === '') {
    json_response([]);
}

$db = get_db();
$stmt = $db->prepare(
    'SELECT DISTINCT qz.id
     FROM firstclassquiz_quizzes qz
     JOIN firstclassquiz_question_sets qs ON qs.quiz_id = qz.id
     JOIN firstclassquiz_questions q ON q.set_id = qs.id
     WHERE q.prompt LIKE ?'
);
$stmt->execute(['%' . addcslashes($query, '%_\\') . '%']);

json_response(array_map('intval', $stmt->fetchAll(PDO::FETCH_COLUMN)));

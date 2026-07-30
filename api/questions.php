<?php
/**
 * /api/questions.php
 *
 * GET    ?set_id= - list questions for a set
 * POST             - create a question  body: { setId, type, prompt, required, config }
 * PUT    ?id=      - update a question   body: { type, prompt, required, config, sortOrder }
 * DELETE ?id=      - delete a question
 *
 * `config` is a JSON object whose shape depends on `type`:
 *   text:   {}
 *   likert: { points: 5, labels: ["...", ...] }
 *   choice: { options: ["...", ...], allowMultiple: false }
 *
 * All methods require an authenticated admin.
 */
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/require_admin.php';

$db = get_db();
$method = $_SERVER['REQUEST_METHOD'];
$validTypes = ['text', 'likert', 'choice'];

function format_question($row)
{
    return [
        'id' => (int)$row['id'],
        'setId' => (int)$row['set_id'],
        'sortOrder' => (int)$row['sort_order'],
        'type' => $row['type'],
        'prompt' => $row['prompt'],
        'required' => (bool)$row['required'],
        'config' => json_decode($row['config'], true),
    ];
}

if ($method === 'GET') {
    $setId = (int)($_GET['set_id'] ?? 0);
    if (!$setId) {
        json_response(['error' => 'set_id is required'], 400);
    }

    $stmt = $db->prepare(
        'SELECT id, set_id, sort_order, type, prompt, required, config FROM firstclassquiz_questions WHERE set_id = ? ORDER BY sort_order, id'
    );
    $stmt->execute([$setId]);

    json_response(array_map('format_question', $stmt->fetchAll()));
}

if ($method === 'POST') {
    $body = json_body();
    $setId = (int)($body['setId'] ?? 0);
    $type = $body['type'] ?? '';
    $prompt = $body['prompt'] ?? '';

    if (!$setId || !in_array($type, $validTypes, true) || trim(strip_tags($prompt)) === '') {
        json_response(['error' => 'setId, a valid type, and prompt are required'], 400);
    }

    $stmt = $db->prepare('SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_order FROM firstclassquiz_questions WHERE set_id = ?');
    $stmt->execute([$setId]);
    $nextOrder = (int)$stmt->fetch()['next_order'];

    $stmt = $db->prepare(
        'INSERT INTO firstclassquiz_questions (set_id, sort_order, type, prompt, required, config) VALUES (?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $setId,
        $nextOrder,
        $type,
        $prompt,
        !empty($body['required']) ? 1 : 0,
        json_encode($body['config'] ?? new stdClass()),
    ]);

    json_response(['id' => (int)$db->lastInsertId()], 201);
}

if ($method === 'PUT') {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) {
        json_response(['error' => 'id is required'], 400);
    }

    $body = json_body();
    $stmt = $db->prepare(
        'UPDATE firstclassquiz_questions SET type = ?, prompt = ?, required = ?, config = ?, sort_order = ? WHERE id = ?'
    );
    $stmt->execute([
        $body['type'] ?? 'text',
        trim($body['prompt'] ?? ''),
        !empty($body['required']) ? 1 : 0,
        json_encode($body['config'] ?? new stdClass()),
        (int)($body['sortOrder'] ?? 0),
        $id,
    ]);

    json_response(['ok' => true]);
}

if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) {
        json_response(['error' => 'id is required'], 400);
    }

    $db->prepare('DELETE FROM firstclassquiz_questions WHERE id = ?')->execute([$id]);
    json_response(['ok' => true]);
}

json_response(['error' => 'Method not allowed'], 405);

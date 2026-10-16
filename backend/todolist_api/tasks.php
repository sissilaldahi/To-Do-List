<?php
require 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $user_id = $_GET['user_id'] ?? null;
        if (!$user_id) {
            http_response_code(400);
            echo json_encode(["error" => "User ID required"]);
            exit();
        }
        $stmt = $pdo->prepare("SELECT * FROM tasks WHERE user_id = ? ORDER BY due_date ASC");
        $stmt->execute([$user_id]);
        echo json_encode($stmt->fetchAll());
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['user_id'], $data['title'])) {
            http_response_code(400);
            echo json_encode(["error" => "User ID and title are required"]);
            exit();
        }
        $stmt = $pdo->prepare("INSERT INTO tasks (user_id, title, description, due_date, priority, category) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['user_id'],
            $data['title'],
            $data['description'] ?? '',
            $data['due_date'] ?? null,
            $data['priority'] ?? 'Medium',
            $data['category'] ?? 'General'
        ]);
        echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['id'])) {
            http_response_code(400);
            echo json_encode(["error" => "Task ID required"]);
            exit();
        }
        $stmt = $pdo->prepare("UPDATE tasks SET title = ?, description = ?, due_date = ?, priority = ?, category = ?, is_completed = ? WHERE id = ?");
        $stmt->execute([
            $data['title'],
            $data['description'],
            $data['due_date'],
            $data['priority'],
            $data['category'],
            $data['is_completed'],
            $data['id']
        ]);
        echo json_encode(["success" => true]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(["error" => "Task ID required"]);
            exit();
        }
        $stmt = $pdo->prepare("DELETE FROM tasks WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
        break;
}
?>
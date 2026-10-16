<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['username']) || !isset($data['email']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(["error" => "All fields are required"]);
    exit();
}

$username = trim($data['username']);
$email = trim($data['email']);
$password = password_hash($data['password'], PASSWORD_BCRYPT);

try {
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
    $stmt->execute([$username, $email, $password]);
    echo json_encode(["success" => true, "message" => "User registered successfully"]);
} catch (\PDOException $e) {
    http_response_code(409);
    echo json_encode(["error" => "Username or email already exists"]);
}
?>
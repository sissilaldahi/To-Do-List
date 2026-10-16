<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(["error" => "Email and password are required"]);
    exit();
}

$email = trim($data['email']);
$password = $data['password'];

$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if ($user && password_verify($password, $user['password'])) {
    echo json_encode([
        "success" => true,
        "user" => [
            "id" => $user['id'],
            "username" => $user['username'],
            "email" => $user['email']
        ]
    ]);
} else {
    http_response_code(401);
    echo json_encode(["error" => "Invalid email or password"]);
}
?>
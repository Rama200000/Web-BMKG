<?php
require_once '../config/database.php';
setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

switch ($method) {
    case 'GET':
        getUsers($db);
        break;
    case 'POST':
        createUser($db);
        break;
    case 'PUT':
        updateUser($db);
        break;
    case 'DELETE':
        deleteUser($db);
        break;
    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Method not allowed"]);
        break;
}

function getUsers($db) {
    try {
        $stmt = $db->query("SELECT id, nip, email, nama, role, is_active, created_at FROM users ORDER BY created_at DESC");
        $users = $stmt->fetchAll();
        echo json_encode(["success" => true, "data" => $users]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
}

function createUser($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (empty($data['nip']) || empty($data['email']) || empty($data['nama']) || empty($data['password'])) {
        echo json_encode(["success" => false, "message" => "Semua field wajib diisi."]);
        return;
    }

    try {
        // Cek nip / email unik
        $check = $db->prepare("SELECT id FROM users WHERE nip = ? OR email = ?");
        $check->execute([$data['nip'], $data['email']]);
        if ($check->rowCount() > 0) {
            echo json_encode(["success" => false, "message" => "NIP atau Email sudah digunakan."]);
            return;
        }

        $password = password_hash($data['password'], PASSWORD_DEFAULT);
        $role = $data['role'] ?? 'admin';
        $is_active = isset($data['is_active']) ? $data['is_active'] : 1;

        $stmt = $db->prepare("INSERT INTO users (nip, email, nama, password, role, is_active) VALUES (?, ?, ?, ?, ?, ?)");
        
        if ($stmt->execute([$data['nip'], $data['email'], $data['nama'], $password, $role, $is_active])) {
            echo json_encode(["success" => true, "message" => "User berhasil ditambahkan."]);
        } else {
            echo json_encode(["success" => false, "message" => "Gagal menambahkan user."]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
}

function updateUser($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (empty($data['id']) || empty($data['nip']) || empty($data['email']) || empty($data['nama'])) {
        echo json_encode(["success" => false, "message" => "Data tidak lengkap."]);
        return;
    }

    try {
        // Cek nip / email unik (selain user ini)
        $check = $db->prepare("SELECT id FROM users WHERE (nip = ? OR email = ?) AND id != ?");
        $check->execute([$data['nip'], $data['email'], $data['id']]);
        if ($check->rowCount() > 0) {
            echo json_encode(["success" => false, "message" => "NIP atau Email sudah digunakan oleh akun lain."]);
            return;
        }

        $role = $data['role'] ?? 'admin';
        $is_active = isset($data['is_active']) ? $data['is_active'] : 1;
        $id = $data['id'];

        if (!empty($data['password'])) {
            $password = password_hash($data['password'], PASSWORD_DEFAULT);
            $stmt = $db->prepare("UPDATE users SET nip=?, email=?, nama=?, password=?, role=?, is_active=? WHERE id=?");
            $success = $stmt->execute([$data['nip'], $data['email'], $data['nama'], $password, $role, $is_active, $id]);
        } else {
            $stmt = $db->prepare("UPDATE users SET nip=?, email=?, nama=?, role=?, is_active=? WHERE id=?");
            $success = $stmt->execute([$data['nip'], $data['email'], $data['nama'], $role, $is_active, $id]);
        }

        if ($success) {
            echo json_encode(["success" => true, "message" => "User berhasil diupdate."]);
        } else {
            echo json_encode(["success" => false, "message" => "Gagal mengupdate user."]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
}

function deleteUser($db) {
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    
    if (!$id) {
        echo json_encode(["success" => false, "message" => "ID tidak diberikan."]);
        return;
    }

    try {
        $stmt = $db->prepare("DELETE FROM users WHERE id = ?");
        
        if ($stmt->execute([$id])) {
            echo json_encode(["success" => true, "message" => "User berhasil dihapus."]);
        } else {
            echo json_encode(["success" => false, "message" => "Gagal menghapus user."]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
}
?>

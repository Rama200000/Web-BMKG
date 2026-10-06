<?php
require_once __DIR__ . '/../config/database.php';
setCorsHeaders();

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT id, nama, created_at FROM schools ORDER BY nama ASC");
        $schools = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'data' => $schools
        ]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['nama'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Nama sekolah diperlukan']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("INSERT INTO schools (nama) VALUES (?)");
            $stmt->execute([$data['nama']]);
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Gagal menambah sekolah: ' . $e->getMessage()]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['id']) || !isset($data['nama'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID dan Nama sekolah diperlukan']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("UPDATE schools SET nama = ? WHERE id = ?");
            $stmt->execute([$data['nama'], $data['id']]);
            echo json_encode(['success' => true, 'message' => 'Sekolah berhasil diupdate']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Gagal mengupdate sekolah: ' . $e->getMessage()]);
        }
        break;

    case 'DELETE':
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID tidak ditemukan']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM schools WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true, 'message' => 'Sekolah berhasil dihapus']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Gagal menghapus sekolah: ' . $e->getMessage()]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['id']) || !isset($data['nama'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Data tidak lengkap']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("UPDATE schools SET nama = ? WHERE id = ?");
            $stmt->execute([$data['nama'], $data['id']]);
            echo json_encode(['success' => true, 'message' => 'Sekolah berhasil diperbarui']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Gagal memperbarui sekolah: ' . $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Metode tidak diizinkan']);
        break;
}

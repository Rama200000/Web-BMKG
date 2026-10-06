<?php
require_once __DIR__ . '/../config/database.php';
setCorsHeaders();

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sekolah_id = isset($_GET['sekolah_id']) ? $_GET['sekolah_id'] : null;
        
        if ($sekolah_id) {
            $stmt = $pdo->prepare("SELECT id, sekolah_id, nama, created_at FROM classes WHERE sekolah_id = ? ORDER BY nama ASC");
            $stmt->execute([$sekolah_id]);
        } else {
            $stmt = $pdo->query("SELECT id, sekolah_id, nama, created_at FROM classes ORDER BY nama ASC");
        }
        
        $classes = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'data' => $classes
        ]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['nama']) || !isset($data['sekolah_id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Data tidak lengkap']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("INSERT INTO classes (sekolah_id, nama) VALUES (?, ?)");
            $stmt->execute([$data['sekolah_id'], $data['nama']]);
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Gagal menambah kelas: ' . $e->getMessage()]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['id']) || !isset($data['nama'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID dan Nama kelas diperlukan']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("UPDATE classes SET nama = ? WHERE id = ?");
            $stmt->execute([$data['nama'], $data['id']]);
            echo json_encode(['success' => true, 'message' => 'Kelas berhasil diperbarui']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Gagal memperbarui kelas: ' . $e->getMessage()]);
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
            $stmt = $pdo->prepare("DELETE FROM classes WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true, 'message' => 'Kelas berhasil dihapus']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Gagal menghapus kelas: ' . $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Metode tidak diizinkan']);
        break;
}

<?php
require_once __DIR__ . '/../config/database.php';
setCorsHeaders();

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("
            SELECT m.id, m.judul, m.deskripsi, m.is_active, m.created_at, COUNT(q.id) as jumlah_soal 
            FROM modules m
            LEFT JOIN questions q ON m.id = q.modul_id
            GROUP BY m.id
            ORDER BY m.id DESC
        ");
        $modules = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'data' => $modules
        ]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['judul'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Judul modul diperlukan']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("INSERT INTO modules (judul, deskripsi, is_active) VALUES (?, ?, ?)");
            $stmt->execute([
                $data['judul'],
                isset($data['deskripsi']) ? $data['deskripsi'] : '',
                isset($data['is_active']) ? $data['is_active'] : 1
            ]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Modul berhasil ditambahkan',
                'id' => $pdo->lastInsertId()
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Gagal menyimpan data: ' . $e->getMessage()]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['id']) || !isset($data['judul'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Data tidak lengkap']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("UPDATE modules SET judul = ?, deskripsi = ?, is_active = ? WHERE id = ?");
            $stmt->execute([
                $data['judul'],
                isset($data['deskripsi']) ? $data['deskripsi'] : '',
                isset($data['is_active']) ? $data['is_active'] : 1,
                $data['id']
            ]);
            
            echo json_encode(['success' => true, 'message' => 'Data modul berhasil diperbarui']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Gagal memperbarui data: ' . $e->getMessage()]);
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
            $stmt = $pdo->prepare("DELETE FROM modules WHERE id = ?");
            $stmt->execute([$id]);
            
            echo json_encode(['success' => true, 'message' => 'Modul berhasil dihapus']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Gagal menghapus data: ' . $e->getMessage()]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Metode tidak diizinkan']);
        break;
}

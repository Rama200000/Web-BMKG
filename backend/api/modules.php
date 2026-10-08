<?php
require_once __DIR__ . '/../config/database.php';
setCorsHeaders();

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("
            SELECT m.id, m.judul, m.deskripsi, m.kategori, m.is_active, m.created_at, m.file_path, COUNT(q.id) as jumlah_soal 
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
        if (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'multipart/form-data') !== false) {
            $data = $_POST;
        } else {
            $data = json_decode(file_get_contents("php://input"), true);
        }
        
        if (!isset($data['judul'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Judul modul diperlukan']);
            exit;
        }

        $file_path = null;
        if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
            $upload_dir = __DIR__ . '/../uploads/modules/';
            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }
            $file_name = time() . '_' . preg_replace("/[^a-zA-Z0-9.]+/", "_", basename($_FILES['file']['name']));
            $target_path = $upload_dir . $file_name;
            if (move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
                $file_path = 'uploads/modules/' . $file_name;
            }
        }

        try {
            $stmt = $pdo->prepare("INSERT INTO modules (judul, deskripsi, kategori, is_active, file_path) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['judul'],
                isset($data['deskripsi']) ? $data['deskripsi'] : '',
                isset($data['kategori']) ? $data['kategori'] : 'Klimatologi & Pemanasan Global',
                isset($data['is_active']) ? $data['is_active'] : 1,
                $file_path
            ]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Modul berhasil ditambahkan',
                'id' => $pdo->lastInsertId(),
                'file_path' => $file_path
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
            $stmt = $pdo->prepare("UPDATE modules SET judul = ?, deskripsi = ?, kategori = ?, is_active = ? WHERE id = ?");
            $stmt->execute([
                $data['judul'],
                isset($data['deskripsi']) ? $data['deskripsi'] : '',
                isset($data['kategori']) ? $data['kategori'] : 'Klimatologi & Pemanasan Global',
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

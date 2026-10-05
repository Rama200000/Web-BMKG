<?php
require_once '../config/database.php';
setCorsHeaders();

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Get all students with their school and class names
        $stmt = $pdo->query("
            SELECT 
                s.id, 
                s.nama, 
                s.no_hp, 
                s.sekolah_id, 
                sch.nama as sekolah, 
                s.kelas_id, 
                c.nama as kelas,
                s.is_active, 
                s.created_at 
            FROM students s
            LEFT JOIN schools sch ON s.sekolah_id = sch.id
            LEFT JOIN classes c ON s.kelas_id = c.id
            ORDER BY s.id DESC
        ");
        $students = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'data' => $students
        ]);
        break;

    case 'POST':
        // Create new student
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['nama']) || !isset($data['no_hp']) || !isset($data['sekolah_id']) || !isset($data['kelas_id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Data tidak lengkap']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("INSERT INTO students (nama, no_hp, sekolah_id, kelas_id, is_active) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['nama'],
                $data['no_hp'],
                $data['sekolah_id'],
                $data['kelas_id'],
                isset($data['is_active']) ? $data['is_active'] : 1
            ]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Siswa berhasil ditambahkan',
                'id' => $pdo->lastInsertId()
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Gagal menyimpan data: ' . $e->getMessage()]);
        }
        break;

    case 'PUT':
        // Update student
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID tidak ditemukan']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("UPDATE students SET nama = ?, no_hp = ?, sekolah_id = ?, kelas_id = ?, is_active = ? WHERE id = ?");
            $stmt->execute([
                $data['nama'],
                $data['no_hp'],
                $data['sekolah_id'],
                $data['kelas_id'],
                isset($data['is_active']) ? $data['is_active'] : 1,
                $data['id']
            ]);
            
            echo json_encode(['success' => true, 'message' => 'Data siswa berhasil diperbarui']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Gagal memperbarui data: ' . $e->getMessage()]);
        }
        break;

    case 'DELETE':
        // Delete student
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID tidak ditemukan']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM students WHERE id = ?");
            $stmt->execute([$id]);
            
            echo json_encode(['success' => true, 'message' => 'Siswa berhasil dihapus']);
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

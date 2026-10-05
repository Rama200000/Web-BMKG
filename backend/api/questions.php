<?php
require_once '../config/database.php';
setCorsHeaders();

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $modul_id = isset($_GET['modul_id']) ? $_GET['modul_id'] : null;
        
        if ($modul_id) {
            $stmt = $pdo->prepare("SELECT q.*, m.judul as modul_judul FROM questions q JOIN modules m ON q.modul_id = m.id WHERE q.modul_id = ? ORDER BY q.id ASC");
            $stmt->execute([$modul_id]);
        } else {
            $stmt = $pdo->query("SELECT q.*, m.judul as modul_judul FROM questions q JOIN modules m ON q.modul_id = m.id ORDER BY q.id ASC");
        }
        $questions = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'data' => $questions
        ]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['modul_id']) || !isset($data['pertanyaan']) || !isset($data['opsi_a']) || !isset($data['kunci_jawaban'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Data soal tidak lengkap']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("INSERT INTO questions (modul_id, pertanyaan, opsi_a, opsi_b, opsi_c, opsi_d, opsi_e, kunci_jawaban, pembahasan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['modul_id'],
                $data['pertanyaan'],
                $data['opsi_a'],
                $data['opsi_b'],
                $data['opsi_c'],
                $data['opsi_d'],
                isset($data['opsi_e']) ? $data['opsi_e'] : null,
                $data['kunci_jawaban'],
                isset($data['pembahasan']) ? $data['pembahasan'] : ''
            ]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Soal berhasil ditambahkan',
                'id' => $pdo->lastInsertId()
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Gagal menyimpan data: ' . $e->getMessage()]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID tidak ditemukan']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("UPDATE questions SET modul_id=?, pertanyaan=?, opsi_a=?, opsi_b=?, opsi_c=?, opsi_d=?, opsi_e=?, kunci_jawaban=?, pembahasan=? WHERE id=?");
            $stmt->execute([
                $data['modul_id'],
                $data['pertanyaan'],
                $data['opsi_a'],
                $data['opsi_b'],
                $data['opsi_c'],
                $data['opsi_d'],
                isset($data['opsi_e']) ? $data['opsi_e'] : null,
                $data['kunci_jawaban'],
                isset($data['pembahasan']) ? $data['pembahasan'] : '',
                $data['id']
            ]);
            
            echo json_encode(['success' => true, 'message' => 'Data soal berhasil diperbarui']);
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
            $stmt = $pdo->prepare("DELETE FROM questions WHERE id = ?");
            $stmt->execute([$id]);
            
            echo json_encode(['success' => true, 'message' => 'Soal berhasil dihapus']);
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

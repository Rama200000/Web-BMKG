<?php
require_once '../config/database.php';
setCorsHeaders();

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['no_hp'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Nomor HP tidak boleh kosong']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("
            SELECT s.id, s.nama, s.no_hp, s.sekolah_id, sch.nama as sekolah, s.kelas_id, c.nama as kelas, s.is_active 
            FROM students s
            LEFT JOIN schools sch ON s.sekolah_id = sch.id
            LEFT JOIN classes c ON s.kelas_id = c.id
            WHERE s.no_hp = ?
        ");
        $stmt->execute([$data['no_hp']]);
        $student = $stmt->fetch();

        if ($student) {
            if ($student['is_active'] == 1) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Login berhasil',
                    'data' => $student
                ]);
            } else {
                http_response_code(403);
                echo json_encode(['success' => false, 'message' => 'Akun Anda dinonaktifkan. Hubungi Admin.']);
            }
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Nomor HP tidak terdaftar.']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Terjadi kesalahan pada server.']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Metode tidak diizinkan']);
}

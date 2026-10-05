<?php
require_once '../config/database.php';
setCorsHeaders();

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Retrieve all scores for Leaderboard / Hasil Skor
        $stmt = $pdo->query("
            SELECT 
                s.id, 
                st.nama as siswa, 
                st.no_hp as hp, 
                sch.nama as sekolah, 
                c.nama as kelas, 
                m.judul as modul, 
                s.pre_test_score, 
                s.post_test_score,
                s.pre_test_time_seconds,
                s.post_test_time_seconds
            FROM scores s
            JOIN students st ON s.student_id = st.id
            JOIN schools sch ON st.sekolah_id = sch.id
            JOIN classes c ON st.kelas_id = c.id
            JOIN modules m ON s.modul_id = m.id
            ORDER BY s.post_test_score DESC, s.post_test_time_seconds ASC
        ");
        $scores = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'data' => $scores
        ]);
        break;

    case 'POST':
        // Submit a new score (either pre-test or post-test)
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['student_id']) || !isset($data['modul_id']) || !isset($data['test_type']) || !isset($data['score'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Data tidak lengkap']);
            exit;
        }

        try {
            // Check if record exists
            $stmt = $pdo->prepare("SELECT id FROM scores WHERE student_id = ? AND modul_id = ?");
            $stmt->execute([$data['student_id'], $data['modul_id']]);
            $existing = $stmt->fetch();

            if ($existing) {
                // Update
                if ($data['test_type'] == 'pre_test') {
                    $upd = $pdo->prepare("UPDATE scores SET pre_test_score = ?, pre_test_time_seconds = ? WHERE id = ?");
                    $upd->execute([$data['score'], $data['time'], $existing['id']]);
                } else {
                    $upd = $pdo->prepare("UPDATE scores SET post_test_score = ?, post_test_time_seconds = ? WHERE id = ?");
                    $upd->execute([$data['score'], $data['time'], $existing['id']]);
                }
            } else {
                // Insert
                if ($data['test_type'] == 'pre_test') {
                    $ins = $pdo->prepare("INSERT INTO scores (student_id, modul_id, pre_test_score, pre_test_time_seconds) VALUES (?, ?, ?, ?)");
                    $ins->execute([$data['student_id'], $data['modul_id'], $data['score'], $data['time']]);
                } else {
                    $ins = $pdo->prepare("INSERT INTO scores (student_id, modul_id, post_test_score, post_test_time_seconds) VALUES (?, ?, ?, ?)");
                    $ins->execute([$data['student_id'], $data['modul_id'], $data['score'], $data['time']]);
                }
            }
            
            echo json_encode(['success' => true, 'message' => 'Skor berhasil disimpan']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Gagal menyimpan skor: ' . $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Metode tidak diizinkan']);
        break;
}

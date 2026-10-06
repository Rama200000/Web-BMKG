<?php
require_once __DIR__ . '/../config/database.php';
setCorsHeaders();

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Retrieve all scores for Leaderboard / Hasil Skor
        $sekolah_id = isset($_GET['sekolah_id']) ? $_GET['sekolah_id'] : null;
        
        $sql = "
            SELECT 
                s.id, 
                st.id as student_id,
                st.nama as siswa, 
                st.no_hp as hp, 
                st.sekolah_id,
                sch.nama as sekolah, 
                c.nama as kelas, 
                m.judul as modul, 
                s.pre_test_score, 
                s.post_test_score,
                s.pre_test_time_seconds,
                s.post_test_time_seconds,
                CASE 
                    WHEN s.post_test_score >= 100 THEN 100 
                    ELSE ((IFNULL(s.post_test_score,0) - IFNULL(s.pre_test_score,0)) / (100 - IFNULL(s.post_test_score,0))) * 100
                END AS final_score
            FROM scores s
            LEFT JOIN students st ON s.student_id = st.id
            LEFT JOIN schools sch ON st.sekolah_id = sch.id
            LEFT JOIN classes c ON st.kelas_id = c.id
            LEFT JOIN modules m ON s.modul_id = m.id
        ";
        
        if ($sekolah_id) {
            $sql .= " WHERE st.sekolah_id = :sekolah_id";
        }
        
        $sql .= " ORDER BY final_score DESC, s.post_test_time_seconds ASC";
        
        $stmt = $pdo->prepare($sql);
        if ($sekolah_id) {
            $stmt->bindParam(':sekolah_id', $sekolah_id);
        }
        $stmt->execute();
        
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
            $pdo->beginTransaction();

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
            
            // Save detailed answers if provided
            if (isset($data['answers']) && is_array($data['answers'])) {
                // Remove old answers for this test type to avoid duplicates
                $del = $pdo->prepare("DELETE FROM student_answers WHERE student_id = ? AND modul_id = ? AND test_type = ?");
                $del->execute([$data['student_id'], $data['modul_id'], $data['test_type']]);

                // Insert new answers
                $insAns = $pdo->prepare("INSERT INTO student_answers (student_id, modul_id, question_id, test_type, selected_option, is_correct) VALUES (?, ?, ?, ?, ?, ?)");
                foreach ($data['answers'] as $ans) {
                    $insAns->execute([
                        $data['student_id'],
                        $data['modul_id'],
                        $ans['question_id'],
                        $data['test_type'],
                        $ans['selected_option'],
                        $ans['is_correct']
                    ]);
                }
            }

            $pdo->commit();
            echo json_encode(['success' => true, 'message' => 'Skor dan jawaban berhasil disimpan']);
        } catch (PDOException $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Gagal menyimpan skor: ' . $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Metode tidak diizinkan']);
        break;
}

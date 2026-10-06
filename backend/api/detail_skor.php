<?php
require_once __DIR__ . '/../config/database.php';
setCorsHeaders();

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $student_id = isset($_GET['student_id']) ? intval($_GET['student_id']) : null;
    
    if (!$student_id) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "student_id diperlukan"]);
        exit;
    }
    
    try {
        // Get student info
        $stmt = $pdo->prepare("
            SELECT st.id, st.nama, st.no_hp, sch.nama as sekolah, c.nama as kelas
            FROM students st
            LEFT JOIN schools sch ON st.sekolah_id = sch.id
            LEFT JOIN classes c ON st.kelas_id = c.id
            WHERE st.id = ?
        ");
        $stmt->execute([$student_id]);
        $student = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$student) {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Siswa tidak ditemukan"]);
            exit;
        }

        // Get scores
        $stmt = $pdo->prepare("SELECT pre_test_score, post_test_score FROM scores WHERE student_id = ?");
        $stmt->execute([$student_id]);
        $score = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $pre_test_score = $score ? intval($score['pre_test_score']) : 0;
        $post_test_score = $score ? intval($score['post_test_score']) : 0;

        // Fetch detailed answers
        $stmt = $pdo->prepare("
            SELECT sa.test_type, sa.question_id, sa.selected_option, sa.is_correct,
                   q.pertanyaan, q.opsi_a, q.opsi_b, q.opsi_c, q.opsi_d, q.opsi_e, q.kunci_jawaban
            FROM student_answers sa
            JOIN questions q ON sa.question_id = q.id
            WHERE sa.student_id = ?
            ORDER BY q.id ASC
        ");
        $stmt->execute([$student_id]);
        $answers = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $pre_test_answers = [];
        $post_test_answers = [];
        
        $pre_benar = 0; $pre_salah = 0;
        $post_benar = 0; $post_salah = 0;
        
        foreach ($answers as $idx => $ans) {
            $formatted_ans = [
                'id' => $ans['question_id'],
                'no' => 0, // will assign later
                'question' => $ans['pertanyaan'],
                'selected' => $ans['selected_option'],
                'correct' => $ans['kunci_jawaban'],
                'isCorrect' => (bool)$ans['is_correct'],
                'options' => [
                    'A' => $ans['opsi_a'],
                    'B' => $ans['opsi_b'],
                    'C' => $ans['opsi_c'],
                    'D' => $ans['opsi_d'],
                    'E' => $ans['opsi_e']
                ]
            ];
            
            if ($ans['test_type'] === 'pretest' || $ans['test_type'] === 'pre_test') {
                $pre_test_answers[] = $formatted_ans;
                if ($ans['is_correct']) $pre_benar++; else $pre_salah++;
            } else {
                $post_test_answers[] = $formatted_ans;
                if ($ans['is_correct']) $post_benar++; else $post_salah++;
            }
        }
        
        // assign numbers
        foreach ($pre_test_answers as $idx => &$a) $a['no'] = $idx + 1;
        foreach ($post_test_answers as $idx => &$a) $a['no'] = $idx + 1;
        
        echo json_encode([
            "success" => true,
            "data" => [
                "student" => $student,
                "pre-test" => [
                    "score" => $pre_test_score,
                    "benar" => $pre_benar,
                    "salah" => $pre_salah,
                    "answers" => $pre_test_answers
                ],
                "post-test" => [
                    "score" => $post_test_score,
                    "benar" => $post_benar,
                    "salah" => $post_salah,
                    "answers" => $post_test_answers
                ]
            ]
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
    }
}

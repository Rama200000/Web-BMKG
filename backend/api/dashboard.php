<?php
require_once __DIR__ . '/../config/database.php';
setCorsHeaders();

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        // 1. Total Siswa
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM students");
        $totalSiswa = $stmt->fetch()['total'];

        // 2. Total Modul Aktif
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM modules WHERE is_active = 1");
        $totalModul = $stmt->fetch()['total'];

        // 3. Rata-rata Skor & Jumlah yang sudah dinilai
        // Assuming post_test_score is used for final average
        $stmt = $pdo->query("
            SELECT 
                COUNT(*) as total_dinilai,
                AVG(post_test_score) as avg_skor
            FROM scores 
            WHERE post_test_score IS NOT NULL
        ");
        $scoreStats = $stmt->fetch();
        $totalDinilai = $scoreStats['total_dinilai'];
        $avgSkor = $scoreStats['avg_skor'] ? round($scoreStats['avg_skor'], 1) : 0;

        // 4. Data Sekolah (Jumlah siswa per sekolah untuk chart/tabel)
        $stmt = $pdo->query("
            SELECT sch.id, sch.nama, COUNT(s.id) as jumlah_siswa 
            FROM schools sch
            LEFT JOIN students s ON sch.id = s.sekolah_id
            GROUP BY sch.id, sch.nama
            ORDER BY jumlah_siswa DESC
        ");
        $sekolahList = $stmt->fetchAll();

        // 5. Data Chart: Rata-rata Pretest & Posttest per Sekolah
        $stmt = $pdo->query("
            SELECT 
                sch.nama as nama_sekolah,
                AVG(sc.pre_test_score) as avg_pretest,
                AVG(sc.post_test_score) as avg_posttest
            FROM schools sch
            JOIN students s ON sch.id = s.sekolah_id
            JOIN scores sc ON s.id = sc.student_id
            GROUP BY sch.nama
        ");
        $chartData = $stmt->fetchAll();

        echo json_encode([
            'success' => true,
            'data' => [
                'totalSiswa' => $totalSiswa,
                'totalModul' => $totalModul,
                'totalDinilai' => $totalDinilai,
                'avgSkor' => $avgSkor,
                'sekolahList' => $sekolahList,
                'chartData' => $chartData
            ]
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Metode tidak diizinkan']);
}

<?php
/**
 * API Settings (Pengaturan Sistem) - Si Iklim Muda BMKG
 * 
 * Endpoints:
 * GET  /api/settings.php -> Ambil pengaturan
 * POST /api/settings.php -> Simpan pengaturan
 */

require_once __DIR__ . '/../config/database.php';
setCorsHeaders();

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

// Pastikan tabel settings selalu ada (auto-create jika belum ada)
try {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS settings (
            `key_name` VARCHAR(50) PRIMARY KEY,
            `value_text` TEXT,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
    ");
} catch (Exception $e) {
    // ignore
}

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT `key_name`, `value_text` FROM settings");
        $rows = $stmt->fetchAll();
        
        $settings = [
            'durasi_ujian_menit' => 15,
            'mulai_ujian' => '08:00',
            'selesai_ujian' => '09:00'
        ];
        
        foreach ($rows as $row) {
            $key = $row['key_name'];
            $val = $row['value_text'];
            if ($key === 'durasi_ujian_menit') {
                $settings[$key] = (int)$val;
            } else {
                $settings[$key] = $val;
            }
        }
        
        echo json_encode([
            'success' => true,
            'data' => $settings
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Gagal mengambil pengaturan: ' . $e->getMessage()
        ]);
    }
    exit;
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Data tidak valid']);
        exit;
    }
    
    try {
        $stmt = $pdo->prepare("
            INSERT INTO settings (`key_name`, `value_text`) 
            VALUES (:k, :v)
            ON DUPLICATE KEY UPDATE `value_text` = VALUES(`value_text`)
        ");
        
        if (isset($input['durasi_ujian_menit']) || isset($input['durasi'])) {
            $durasi = (int)($input['durasi_ujian_menit'] ?? $input['durasi']);
            if ($durasi > 0) {
                $stmt->execute([':k' => 'durasi_ujian_menit', ':v' => (string)$durasi]);
            }
        }
        
        if (isset($input['mulai_ujian']) || isset($input['mulai'])) {
            $mulai = trim($input['mulai_ujian'] ?? $input['mulai']);
            $stmt->execute([':k' => 'mulai_ujian', ':v' => $mulai]);
        }
        
        if (isset($input['selesai_ujian']) || isset($input['selesai'])) {
            $selesai = trim($input['selesai_ujian'] ?? $input['selesai']);
            $stmt->execute([':k' => 'selesai_ujian', ':v' => $selesai]);
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Pengaturan berhasil diperbarui.'
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Gagal menyimpan pengaturan: ' . $e->getMessage()
        ]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Metode tidak diizinkan']);

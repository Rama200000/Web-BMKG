<?php
require_once __DIR__ . '/../config/database.php';
setCorsHeaders();

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

// Pastikan tabel categories ada & terisi default data (Self-healing)
try {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nama VARCHAR(100) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
    ");

    $count = $pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn();
    if ($count == 0) {
        $stmtSeed = $pdo->prepare("INSERT IGNORE INTO categories (nama) VALUES (?)");
        $stmtSeed->execute(['Klimatologi & Pemanasan Global']);
        $stmtSeed->execute(['Meteorologi Dasar']);

        // Masukkan juga kategori yang mungkin sudah ada di tabel modules
        try {
            $existing = $pdo->query("SELECT DISTINCT kategori FROM modules WHERE kategori IS NOT NULL AND kategori != ''")->fetchAll(PDO::FETCH_COLUMN);
            foreach ($existing as $kat) {
                if (!empty(trim($kat))) {
                    $stmtSeed->execute([trim($kat)]);
                }
            }
        } catch (Exception $ignored) {}
    }
} catch (PDOException $e) {
    // Abaikan jika error permisson atau tabel sudah ada
}

switch ($method) {
    case 'GET':
        try {
            $stmt = $pdo->query("SELECT id, nama, created_at FROM categories ORDER BY nama ASC");
            $categories = $stmt->fetchAll();
            
            echo json_encode([
                'success' => true,
                'data' => $categories
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Gagal mengambil data kategori: ' . $e->getMessage()
            ]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $nama = isset($data['nama']) ? trim($data['nama']) : '';

        if (empty($nama)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Nama kategori tidak boleh kosong']);
            exit;
        }

        try {
            // Cek apakah kategori sudah ada
            $check = $pdo->prepare("SELECT id, nama FROM categories WHERE LOWER(nama) = LOWER(?) LIMIT 1");
            $check->execute([$nama]);
            $existingCat = $check->fetch();

            if ($existingCat) {
                // Kategori sudah ada, langsung return kategori yang ada
                echo json_encode([
                    'success' => true, 
                    'message' => 'Kategori sudah tersedia',
                    'data' => $existingCat
                ]);
                exit;
            }

            $stmt = $pdo->prepare("INSERT INTO categories (nama) VALUES (?)");
            $stmt->execute([$nama]);
            $newId = $pdo->lastInsertId();

            echo json_encode([
                'success' => true,
                'message' => 'Kategori berhasil ditambahkan',
                'data' => [
                    'id' => $newId,
                    'nama' => $nama
                ]
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Gagal menambah kategori: ' . $e->getMessage()]);
        }
        break;

    case 'DELETE':
        $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID kategori tidak ditemukan']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM categories WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true, 'message' => 'Kategori berhasil dihapus']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Gagal menghapus kategori: ' . $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Metode HTTP tidak diizinkan']);
        break;
}

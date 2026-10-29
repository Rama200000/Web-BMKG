<?php
/**
 * Auto-Setup / Migrasi Database Si Iklim Muda BMKG
 * Akses file ini via browser untuk membuat semua tabel dan akun admin secara otomatis
 * URL: https://staklim-lampung.devbmkg.my.id/backend/api/setup_db.php
 */

require_once __DIR__ . '/../config/database.php';
setCorsHeaders();

try {
    $pdo = getDB();

    // 1. Tabel Users
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nip VARCHAR(50) NOT NULL UNIQUE,
            email VARCHAR(100) NOT NULL UNIQUE,
            nama VARCHAR(150) NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('superadmin', 'admin', 'operator') DEFAULT 'operator',
            is_active TINYINT(1) DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
    ");

    // 2. Insert atau Reset Password Super Admin default ke 'admin123'
    $adminHash = password_hash('admin123', PASSWORD_BCRYPT);
    $stmtCheck = $pdo->prepare("SELECT id FROM users WHERE nip = ? OR email = ?");
    $stmtCheck->execute(['198503152010', 'admin@bmkg.go.id']);
    $existingAdmin = $stmtCheck->fetch();

    if ($existingAdmin) {
        // Reset password admin ke hash 'admin123' yang valid
        $stmtUpdate = $pdo->prepare("UPDATE users SET password = ?, is_active = 1, role = 'superadmin' WHERE id = ?");
        $stmtUpdate->execute([$adminHash, $existingAdmin['id']]);
    } else {
        $stmtAdmin = $pdo->prepare("
            INSERT INTO users (nip, email, nama, password, role, is_active)
            VALUES (?, ?, ?, ?, ?, 1)
        ");
        $stmtAdmin->execute([
            '198503152010',
            'admin@bmkg.go.id',
            'Admin BMKG',
            $adminHash,
            'superadmin'
        ]);
    }

    // 3. Tabel Schools
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS schools (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nama VARCHAR(150) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
    ");

    // 4. Tabel Classes
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS classes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            sekolah_id INT NOT NULL,
            nama VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (sekolah_id) REFERENCES schools(id) ON DELETE CASCADE
        ) ENGINE=InnoDB;
    ");

    // 5. Tabel Students
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS students (
            id INT AUTO_INCREMENT PRIMARY KEY,
            no_hp VARCHAR(20) NOT NULL UNIQUE,
            nama VARCHAR(150) NOT NULL,
            sekolah_id INT NOT NULL,
            jurusan VARCHAR(100) DEFAULT NULL,
            kelas_id INT NOT NULL,
            is_active TINYINT(1) DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (sekolah_id) REFERENCES schools(id) ON DELETE CASCADE,
            FOREIGN KEY (kelas_id) REFERENCES classes(id) ON DELETE CASCADE
        ) ENGINE=InnoDB;
    ");

    // 6. Tabel Modules
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS modules (
            id INT AUTO_INCREMENT PRIMARY KEY,
            judul VARCHAR(255) NOT NULL,
            deskripsi TEXT,
            kategori VARCHAR(100) DEFAULT 'Klimatologi & Pemanasan Global',
            file_path VARCHAR(255) DEFAULT NULL,
            is_active TINYINT(1) DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
    ");

    // 7. Tabel Questions
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS questions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            modul_id INT NOT NULL,
            pertanyaan TEXT NOT NULL,
            opsi_a VARCHAR(255) NOT NULL,
            opsi_b VARCHAR(255) NOT NULL,
            opsi_c VARCHAR(255) NOT NULL,
            opsi_d VARCHAR(255) NOT NULL,
            opsi_e VARCHAR(255) DEFAULT NULL,
            kunci_jawaban ENUM('A', 'B', 'C', 'D', 'E') NOT NULL,
            pembahasan TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (modul_id) REFERENCES modules(id) ON DELETE CASCADE
        ) ENGINE=InnoDB;
    ");

    // 8. Tabel Scores
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS scores (
            id INT AUTO_INCREMENT PRIMARY KEY,
            student_id INT NOT NULL,
            modul_id INT NOT NULL,
            pre_test_score DECIMAL(5,2) DEFAULT NULL,
            post_test_score DECIMAL(5,2) DEFAULT NULL,
            pre_test_time_seconds INT DEFAULT NULL,
            post_test_time_seconds INT DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
            FOREIGN KEY (modul_id) REFERENCES modules(id) ON DELETE CASCADE
        ) ENGINE=InnoDB;
    ");

    // 9. Tabel Student Answers
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS student_answers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            student_id INT NOT NULL,
            modul_id INT NOT NULL,
            question_id INT NOT NULL,
            test_type ENUM('pre_test', 'post_test') NOT NULL,
            selected_option ENUM('A', 'B', 'C', 'D', 'E') DEFAULT NULL,
            is_correct TINYINT(1) DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
            FOREIGN KEY (modul_id) REFERENCES modules(id) ON DELETE CASCADE,
            FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
        ) ENGINE=InnoDB;
    ");

    echo json_encode([
        'success' => true,
        'message' => 'Luar biasa! Semua 8 tabel database berhasil dibuat & akun Super Admin BMKG berhasil diaktifkan.',
        'admin_credentials' => [
            'nip' => '198503152010',
            'email' => 'admin@bmkg.go.id',
            'password' => 'admin123',
            'role' => 'superadmin'
        ],
        'tables_created' => [
            'users', 'schools', 'classes', 'students', 'modules', 'questions', 'scores', 'student_answers'
        ]
    ], JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Gagal membuat tabel: ' . $e->getMessage()
    ], JSON_PRETTY_PRINT);
}

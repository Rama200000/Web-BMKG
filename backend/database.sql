-- ============================================
-- Database: bmkg_si_iklim_muda
-- Jalankan script ini di phpMyAdmin atau MySQL CLI
-- ============================================

CREATE DATABASE IF NOT EXISTS bmkg_si_iklim_muda
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE bmkg_si_iklim_muda;

-- ============================================
-- Tabel Users
-- ============================================
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

-- ============================================
-- User demo untuk testing
-- Password: admin123 (hashed dengan password_hash)
-- ============================================
INSERT INTO users (nip, email, nama, password, role, is_active)
VALUES (
    '198503152010',
    'admin@bmkg.go.id',
    'Admin BMKG',
    '$2y$10$t3J5F/M9d8213YpB.s2YquDOPKOf1O6hQGjG5R8nS3i2K.q5Y0zYW', -- Hash for 'admin123'
    'superadmin',
    1
);

-- ============================================
-- Tabel Schools (Sekolah)
-- ============================================
CREATE TABLE IF NOT EXISTS schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(150) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================
-- Tabel Classes (Kelas)
-- ============================================
CREATE TABLE IF NOT EXISTS classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sekolah_id INT NOT NULL,
    nama VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sekolah_id) REFERENCES schools(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- Tabel Students (Siswa)
-- ============================================
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

-- ============================================
-- Tabel Modules (Modul)
-- ============================================
CREATE TABLE IF NOT EXISTS modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    kategori VARCHAR(100) DEFAULT 'Klimatologi & Pemanasan Global',
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================
-- Tabel Questions (Soal)
-- ============================================
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

-- ============================================
-- Tabel Scores (Hasil Skor)
-- ============================================
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

-- ============================================
-- Tabel Student Answers (Detail Jawaban)
-- ============================================
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

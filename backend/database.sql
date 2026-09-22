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
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'superadmin',
    1
);

<?php
/**
 * Konfigurasi Database
 * Sesuaikan dengan pengaturan database Anda
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'bmkg_si_iklim_muda');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

/**
 * Konfigurasi Aplikasi
 */
define('APP_NAME', 'Si Iklim Muda BMKG');
define('APP_ENV', 'development'); // development | production
define('JWT_SECRET', 'ganti_dengan_secret_key_anda_yang_aman');
define('CORS_ORIGIN', 'http://localhost:5173'); // URL frontend React

/**
 * Koneksi Database menggunakan PDO
 */
function getDB() {
    static $pdo = null;
    
    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Koneksi database gagal: ' . $e->getMessage()
            ]);
            exit;
        }
    }
    
    return $pdo;
}

/**
 * Set CORS Headers
 * Memungkinkan frontend React berkomunikasi dengan backend PHP
 */
function setCorsHeaders() {
    header('Access-Control-Allow-Origin: ' . CORS_ORIGIN);
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Credentials: true');
    header('Content-Type: application/json; charset=utf-8');
    
    // Handle preflight request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

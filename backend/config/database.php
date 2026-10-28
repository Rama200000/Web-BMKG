<?php
/**
 * Konfigurasi Database
 * Sesuaikan dengan pengaturan database Anda
 */

// Muat file .env jika ada (opsional)
$envPath = __DIR__ . '/../.env';
if (file_exists($envPath)) {
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) continue;
        if (strpos($line, '=') !== false) {
            [$k, $v] = explode('=', $line, 2);
            $k = trim($k);
            $v = trim($v, " \t\n\r\0\x0B\"'");
            putenv("$k=$v");
            $_ENV[$k] = $v;
        }
    }
}

define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'bmkg_si_iklim_muda');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') !== false ? getenv('DB_PASS') : '');
define('DB_CHARSET', getenv('DB_CHARSET') ?: 'utf8mb4');

/**
 * Konfigurasi Aplikasi
 */
define('APP_NAME', getenv('APP_NAME') ?: 'Si Iklim Muda BMKG');
define('APP_ENV', getenv('APP_ENV') ?: 'development'); // development | production
define('JWT_SECRET', getenv('JWT_SECRET') ?: 'ganti_dengan_secret_key_anda_yang_aman');
define('CORS_ORIGIN', getenv('CORS_ORIGIN') ?: 'http://localhost:5173'); // URL frontend React

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
    // Ambil Origin dari browser jika ada (mendukung port 5173 dev, 4173 preview, HTTPS, dan IP LAN)
    $origin = $_SERVER['HTTP_ORIGIN'] ?? CORS_ORIGIN;
    
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Allow-Credentials: true');
    header('Content-Type: application/json; charset=utf-8');
    
    // Handle preflight request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

<?php
/**
 * Konfigurasi Database
 * Sesuaikan dengan pengaturan database Anda
 */

// Muat file .env jika ada (mencari di folder backend/ atau di root)
$envConfig = [];
$envPaths = [
    __DIR__ . '/../.env',
    __DIR__ . '/../../.env'
];

foreach ($envPaths as $envPath) {
    if (file_exists($envPath)) {
        $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#')) continue;
            if (strpos($line, '=') !== false) {
                [$k, $v] = explode('=', $line, 2);
                $k = trim($k);
                $v = trim($v, " \t\n\r\0\x0B\"'");
                $envConfig[$k] = $v;
                $_ENV[$k] = $v;
                $_SERVER[$k] = $v;
                if (function_exists('putenv')) {
                    @putenv("$k=$v");
                }
            }
        }
        break;
    }
}

// Helper aman membaca nilai environment tanpa bergantung ke getenv() yang sering didisable di server
if (!function_exists('getEnvVal')) {
    function getEnvVal($key, $default = '') {
        global $envConfig;
        if (isset($envConfig[$key])) return $envConfig[$key];
        if (isset($_ENV[$key])) return $_ENV[$key];
        if (isset($_SERVER[$key])) return $_SERVER[$key];
        if (function_exists('getenv')) {
            $val = @getenv($key);
            if ($val !== false) return $val;
        }
        return $default;
    }
}

define('DB_HOST', getEnvVal('DB_HOST', 'localhost'));
define('DB_NAME', getEnvVal('DB_NAME', 'bmkg_si_iklim_muda'));
define('DB_USER', getEnvVal('DB_USER', 'bmkg_si_iklim_muda'));
define('DB_PASS', getEnvVal('DB_PASS', '12345678'));
define('DB_CHARSET', getEnvVal('DB_CHARSET', 'utf8mb4'));

/**
 * Konfigurasi Aplikasi
 */
define('APP_NAME', getEnvVal('APP_NAME', 'Si Iklim Muda BMKG'));
define('APP_ENV', getEnvVal('APP_ENV', 'production'));
define('JWT_SECRET', getEnvVal('JWT_SECRET', 'bmkg_staklim_lampung_iklim_muda_2026_secure_key_x89f72b9'));
define('CORS_ORIGIN', getEnvVal('CORS_ORIGIN', 'https://staklim-lampung.devbmkg.my.id')); // URL frontend React

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

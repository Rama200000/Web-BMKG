<?php
/**
 * API Login - Si Iklim Muda BMKG
 * 
 * Endpoint: POST /api/login.php
 * Body: { "nip": "...", "password": "...", "remember": true/false }
 */

require_once __DIR__ . '/../config/database.php';
setCorsHeaders();

// Hanya terima metode POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Metode tidak diizinkan. Gunakan POST.'
    ]);
    exit;
}

// Ambil data dari request body
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Data request tidak valid.'
    ]);
    exit;
}

$nip = trim($input['nip'] ?? '');
$password = $input['password'] ?? '';
$remember = $input['remember'] ?? false;

// Validasi input
if (empty($nip) || empty($password)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'NIP/Surel dan Kata Sandi wajib diisi.'
    ]);
    exit;
}

try {
    $db = getDB();
    
    // Cari user berdasarkan NIP atau email
    $stmt = $db->prepare("
        SELECT id, nip, email, nama, password, role, is_active 
        FROM users 
        WHERE (nip = :nip OR email = :email) AND is_active = 1
        LIMIT 1
    ");
    $stmt->execute([
        ':nip' => $nip,
        ':email' => $nip  // Bisa login pakai NIP atau email
    ]);
    
    $user = $stmt->fetch();
    
    if (!$user) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Akun tidak ditemukan atau tidak aktif.'
        ]);
        exit;
    }
    
    // Verifikasi password
    if (!password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Kata sandi salah. Silakan coba lagi.'
        ]);
        exit;
    }
    
    // Login berhasil - buat session token sederhana
    $token = bin2hex(random_bytes(32));
    
    // Simpan token ke database (opsional)
    // $stmt = $db->prepare("UPDATE users SET token = :token WHERE id = :id");
    // $stmt->execute([':token' => $token, ':id' => $user['id']]);
    
    // Response sukses
    echo json_encode([
        'success' => true,
        'message' => 'Login berhasil! Selamat datang, ' . $user['nama'],
        'data' => [
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'nip' => $user['nip'],
                'email' => $user['email'],
                'nama' => $user['nama'],
                'role' => $user['role']
            ]
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Terjadi kesalahan server: ' . (APP_ENV === 'development' ? $e->getMessage() : 'Internal Server Error')
    ]);
}

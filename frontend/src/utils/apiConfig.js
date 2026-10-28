/**
 * Konfigurasi Endpoint API Backend
 * Diambil dari file .env (VITE_API_BASE_URL) dengan fallback ke http://10.21.224.6:8181/api
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://10.21.224.6:8181/api';

// Base URL server backend tanpa prefix '/api' (untuk path file upload modul, dll)
export const BACKEND_URL = API_BASE_URL.replace(/\/api\/?$/, '');

export default API_BASE_URL;

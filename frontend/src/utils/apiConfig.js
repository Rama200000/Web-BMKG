/**
 * Konfigurasi Endpoint API Backend
 * Diambil dari file .env (VITE_API_BASE_URL) dengan fallback ke https://staklim-lampung.devbmkg.my.id/backend/api
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://staklim-lampung.devbmkg.my.id/backend/api';

// Base URL server backend tanpa prefix '/api' (untuk path file upload modul, dll)
export const BACKEND_URL = API_BASE_URL.replace(/\/api\/?$/, '');

export default API_BASE_URL;

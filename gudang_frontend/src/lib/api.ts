import axios from 'axios';

// Pastikan backend Anda berjalan (misal: php artisan serve)
const API_URL = 'http://localhost:8000';// URL Backend Laravel Anda

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // PENTING untuk Sanctum
    headers: {
        'Accept': 'application/json',
    }
});

// Fungsi untuk mengambil CSRF cookie (wajib untuk Sanctum)
export const getCsrfCookie = () => api.get('/sanctum/csrf-cookie');

export default api;
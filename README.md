# Sistem Manajemen Inventaris Gudang (Full-Stack (diutamakan Backend) )

Ini adalah proyek latihan (*dummy project*) full-stack untuk mengelola inventaris gudang. Aplikasi ini memungkinkan admin untuk mengelola produk, mencatat stok masuk, stok keluar, dan melihat rekap inventaris.

Proyek ini dibangun menggunakan arsitektur terpisah (*decoupled*):
* **Backend:** API RESTful menggunakan Laravel 11.
* **Frontend:** Aplikasi Single Page Application (SPA) menggunakan React (Vite).


## 💻 Tech Stack

**Backend (di folder `gudang_backend/`)**
* PHP 8.2+
* Laravel 11
* Breeze / Sanctum (untuk autentikasi API berbasis Cookie/Sesi)
* MySQL / PostgreSQL

**Frontend (di folder `gudang_frontend/`)**
* Vite
* React 18
* TypeScript
* Tailwind CSS
* Headless UI (untuk modal/pop-up)
* Axios (untuk HTTP client)
* React Router (untuk navigasi)

## ✨ Fitur Utama

* Autentikasi Admin (Login & Logout).
* Dashboard rekap jumlah produk dan total stok.
* **CRUD (Create, Read, Update, Delete)** untuk Produk.
* Manajemen Stok (Stok Masuk & Stok Keluar) dengan validasi stok.
* Log/Riwayat Pergerakan Stok (di database).
* Pencarian Produk (dengan *debounce*).
* Paginasi.
* Modal (pop-up) modern untuk semua aksi form.

---

## 🚀 Instruksi Setup & Instalasi

Proyek ini terdiri dari dua bagian (`gudang_backend` dan `gudang_frontend`). Anda harus melakukan setup untuk **keduanya** secara terpisah.

### 1. Backend Setup (`gudang_backend`)

1.  Buka terminal dan masuk ke folder backend:
    ```bash
    cd gudang_backend
    ```

2.  Install semua dependensi PHP:
    ```bash
    composer install
    ```

3.  Salin file `.env.example` menjadi `.env`:
    ```bash
    cp .env.example .env
    ```

4.  Generate kunci aplikasi Laravel:
    ```bash
    php artisan key:generate
    ```

5.  Buka file `.env` dan atur koneksi database Anda:
    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=gudang_db 
    DB_USERNAME=root
    DB_PASSWORD=
    ```

6.  Jalankan migrasi (untuk membuat tabel) dan seeder (untuk mengisi data dummy):
    ```bash
    php artisan migrate --seed --class=ProductSeeder
    ```
    *(Perintah ini akan membuat tabel dan 1 akun admin default)*

### 2. Frontend Setup (`gudang_frontend`)

1.  Buka terminal **baru** (biarkan terminal backend tetap di foldernya).
2.  Masuk ke folder frontend:
    ```bash
    cd gudang_frontend
    ```

3.  Install semua dependensi JavaScript/Node.js:
    ```bash
    npm install
    ```

4.  **PENTING:** Pastikan URL API di frontend sudah benar. Buka file:
    `gudang-frontend/src/lib/api.ts`
    
    Pastikan variabel `API_URL` menunjuk ke alamat server backend Anda (default: `http://localhost:8000`).

---

## ⚡ Menjalankan Aplikasi

Anda harus menjalankan **dua server** secara bersamaan.

### Terminal 1: Menjalankan Backend
```bash
cd gudang_backend
php artisan serve

### Terminal 2: Menjalankan Frontend
```bash
cd gudang_Frontend
npm run dev

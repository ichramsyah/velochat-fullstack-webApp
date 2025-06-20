# VeloChat - Frontend ⚛️

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-22534F?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDBDNS4zNzI1OCA2LjkwNzY1IDAgMTIgMCAxMkwxMiAyNEwyNCAxMkMxMiAxMiAxOC42Mjc0IDYuOTA3NjUgMTIgMCIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4K&logoColor=white)](https://zustand-bear.pmnd.rs/)
[![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/docs/v4/client-api/)
[![Google OAuth](https://img.shields.io/badge/Google_OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://developers.google.com/identity/oauth2/web/guides/use-token-model)
[![React Hot Toast](https://img.shields.io/badge/React_Hot_Toast-000000?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://react-hot-toast.com/)
[![React Loading Skeleton](https://img.shields.io/badge/Loading_Skeleton-60A5FA?style=for-the-badge&logo=react&logoColor=white)](https://www.npmjs.com/package/react-loading-skeleton)
[![date-fns](https://img.shields.io/badge/date--fns-243A5A?style=for-the-badge&logo=date-fns&logoColor=white)](https://date-fns.org/)

Selamat datang di direktori frontend untuk aplikasi VeloChat. Bagian ini bertanggung jawab untuk semua antarmuka pengguna (UI) dan pengalaman interaksi (UX) yang dilihat dan digunakan oleh pengguna.

Aplikasi ini dibangun sebagai **Single-Page Application (SPA)** menggunakan **React** dan **Vite** untuk memastikan proses development yang cepat dan hasil build yang optimal.

## Daftar Isi

- [Fitur Utama Frontend](#fitur-utama-frontend)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Konsep yang Diterapkan](#konsep-yang-diterapkan)
- [Struktur Proyek](#struktur-proyek)
- [Setup Variabel Environment](#setup-variabel-environment-env)
- [Instalasi & Menjalankan](#instalasi--menjalankan)

## Fitur Utama Frontend

- **Antarmuka Autentikasi:** Menyediakan halaman Login dan Register dengan validasi input, serta tombol untuk "Login dengan Google".
- **Halaman Chat Utama:** Layout dua kolom yang responsif, menampilkan daftar percakapan di satu sisi dan area chat aktif di sisi lain.
- **Manajemen Pertemanan:**
  - Modal pop-up untuk mencari pengguna baru berdasarkan email.
  - Tombol untuk mengirim permintaan pertemanan.
  - Popover notifikasi untuk menampilkan daftar permintaan pertemanan yang masuk, lengkap dengan tombol "Terima" dan "Tolak".
- **Interaksi Chat Real-time:**
  - Menampilkan pesan baru secara instan tanpa perlu me-refresh halaman.
  - Menampilkan dan menyembunyikan indikator "typing..." secara akurat.
  - Menampilkan badge notifikasi pada percakapan dengan pesan yang belum dibaca.
  - Menampilkan status pesan (terkirim/dilihat) secara real-time.
- **Manajemen Profil:**
  - Halaman khusus bagi pengguna untuk mengubah nama dan password.
  - Antarmuka untuk memilih, melihat pratinjau, dan mengunggah foto profil baru.
- **Pengalaman Pengguna (UX):**
  - Penggunaan notifikasi **Toast** untuk feedback (sukses/error).
  - Penggunaan **Skeleton Loaders** saat memuat data untuk pengalaman yang lebih mulus.
  - Routing yang terproteksi, memastikan hanya pengguna terautentikasi yang dapat mengakses halaman utama.

## Teknologi yang Digunakan

- **Framework Inti:** [**React**](https://reactjs.org/) (dengan Vite)
- **Routing:** [**React Router DOM**](https://reactrouter.com/)
- **Styling:** [**Tailwind CSS**](https://tailwindcss.com/)
- **State Management:** [**Zustand**](https://github.com/pmndrs/zustand)
- **Komunikasi & Data:** [**Axios**](https://axios-http.com/), [**Socket.IO Client**](https://socket.io/)
- **Autentikasi:** [**@react-oauth/google**](https://www.npmjs.com/package/@react-oauth/google)
- **UI & UX:** [**React Hot Toast**](https://react-hot-toast.com/), [**React Loading Skeleton**](https://www.npmjs.com/package/react-loading-skeleton)
- **Utilitas:** [**date-fns**](https://date-fns.org/)

## Konsep yang Diterapkan

- **Component-Based Architecture:** Membangun UI dari komponen-komponen yang dapat digunakan kembali dan terisolasi (contoh: `Header`, `ChatBox`, `SearchModal`).
- **Single-Page Application (SPA):** Menggunakan React Router untuk navigasi di sisi klien, menciptakan pengalaman yang cepat tanpa me-refresh halaman secara penuh.
- **State Management Terpusat:** Memanfaatkan Zustand untuk mengelola state global seperti informasi pengguna (`userStore`) dan data chat (`chatStore`), sehingga data mudah diakses dari komponen manapun.
- **React Hooks:** Penggunaan ekstensif dari hook seperti `useState`, `useEffect`, `useCallback`, dan `useRef` untuk mengelola state lokal, side effects (seperti panggilan API dan listener socket), dan memoization.
- **"Lifting State Up" Pattern:** Memusatkan state dan logika yang kompleks (seperti koneksi socket dan daftar chat) di komponen induk (`ChatPage`) dan meneruskannya ke komponen anak sebagai props.
- **Asynchronous Operations:** Menangani panggilan API dan operasi yang memakan waktu menggunakan sintaks `async/await` untuk kode yang lebih bersih.
- **Protected Routes:** Menerapkan komponen pembungkus (`ProtectedRoute`, `PublicRoute`) untuk mengatur hak akses ke halaman tertentu berdasarkan status autentikasi pengguna.

## Struktur Proyek

Struktur folder utama di dalam `/src` diatur sebagai berikut:

```
/frontend
└── /src
    ├── /api         # Fungsi terpusat untuk interaksi dengan API (authAPI, userAPI, dll)
    ├── /components  # Komponen UI yang bisa dipakai ulang (Header, ChatBox, SearchModal, dll)
    ├── /pages       # Komponen utama yang berfungsi sebagai halaman (LoginPage, ChatPage, dll)
    ├── /store       # Konfigurasi state management global (userStore, chatStore)
    ├── App.jsx
    └── main.jsx     # Titik masuk utama aplikasi, konfigurasi routing dan provider
```

## Setup Variabel Environment (`.env`)

Buat sebuah file bernama `.env` di dalam direktori root `/frontend`. File ini dibutuhkan untuk menyimpan Client ID Google yang bersifat publik.

Isi file `.env` dengan variabel berikut:

```env
# Ganti dengan Client ID dari Google Cloud Platform Anda
VITE_GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com
```

## Instalasi & Menjalankan

1.  **Navigasi ke Folder**
    Dari direktori root proyek, masuk ke folder frontend:

    ```bash
    cd frontend
    ```

2.  **Install Dependensi**

    ```bash
    npm install
    ```

3.  **Jalankan Server Development**
    ```bash
    npm run dev
    ```
    Aplikasi akan berjalan di **http://localhost:5173** (atau port lain jika 5173 sudah terpakai).

### Skrip yang Tersedia

- `npm run dev`: Menjalankan aplikasi dalam mode development.
- `npm run build`: Mem-build aplikasi untuk mode produksi ke dalam folder `/dist`.
- `npm run preview`: Menjalankan hasil build produksi secara lokal untuk pengujian.

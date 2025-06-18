# VeloChat - Backend 🖥️

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)](https://jwt.io/)
[![Passport.js](https://img.shields.io/badge/Passport.js-336699?style=for-the-badge&logo=passport&logoColor=white)](http://www.passportjs.org/)
[![Mongoose](https://img.shields.io/badge/Mongoose-800000?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongoosejs.com/)
[![Bcrypt.js](https://img.shields.io/badge/Bcrypt.js-000000?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/bcryptjs)
[![Multer](https://img.shields.io/badge/Multer-000000?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://www.npmjs.com/package/multer)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Express Session](https://img.shields.io/badge/Express_Session-000000?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://www.npmjs.com/package/express-session)
[![Dotenv](https://img.shields.io/badge/Dotenv-000000?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/dotenv)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/cloud/atlas)
[![Google Cloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)](https://cloud.google.com/)

Selamat datang di direktori backend untuk aplikasi VeloChat. Bagian ini bertanggung jawab untuk semua logika sisi server, manajemen database, REST API, dan komunikasi real-time menggunakan Socket.IO.

Backend ini dibangun dengan Node.js dan framework Express.js, dengan fokus pada skalabilitas, keamanan, dan efisiensi.

## Daftar Isi

- [Fitur Utama Backend](#fitur-utama-backend)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Konsep yang Diterapkan](#konsep-yang-diterapkan)
- [Struktur Proyek](#struktur-proyek)
- [Daftar Endpoint API](#daftar-endpoint-api)
- [Setup Variabel Environment](#setup-variabel-environment-env)
- [Instalasi & Menjalankan](#instalasi--menjalankan)

## Fitur Utama Backend

- **Manajemen Pengguna & Autentikasi:**
  - API untuk registrasi pengguna baru dengan validasi domain email.
  - API untuk login manual dengan perbandingan password yang di-hash.
  - Alur autentikasi pihak ketiga menggunakan **Google OAuth 2.0** via Passport.js.
  - Pembuatan dan verifikasi **JSON Web Token (JWT)** untuk mengamankan endpoint.
  - API untuk memperbarui profil pengguna (nama, password).
  - API untuk mencari pengguna lain dan mengambil daftar kontak.
- **Sistem Sosial & Pertemanan:**
  - API untuk mengirim, melihat, dan merespon (menerima/menolak) permintaan pertemanan.
  - Logika untuk secara otomatis memperbarui daftar kontak kedua pengguna saat permintaan diterima.
- **API Chat & Real-time:**
  - API untuk membuat atau mengakses ruang percakapan (chat).
  - API untuk mengambil riwayat pesan dari sebuah chat.
  - Server Socket.IO yang menangani:
    - Koneksi dan otentikasi user.
    - Pengiriman pesan secara real-time ke room yang spesifik.
    - Penyiaran status "typing..." dan "stop typing...".
    - Pembaruan status "pesan dibaca" (read receipts).
    - Notifikasi real-time untuk permintaan pertemanan baru dan penerimaan pertemanan.
- **Penanganan File:**
  - Endpoint untuk menerima unggahan file gambar.
  - Middleware (`multer`) untuk memvalidasi dan memproses file.
  - Integrasi dengan **Cloudinary** untuk menyimpan foto profil di cloud.

## Teknologi yang Digunakan

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB dengan **Mongoose** sebagai ODM (Object Data Modeling).
- **Real-time:** Socket.IO
- **Autentikasi:**
  - `jsonwebtoken` untuk JWT.
  - `bcryptjs` untuk hashing password.
  - `passport` & `passport-google-oauth20` untuk Google OAuth.
  - `express-session` sebagai prasyarat Passport.
- **Penanganan File:**
  - `multer` untuk menangani `multipart/form-data`.
  - `cloudinary` untuk berinteraksi dengan Cloudinary API.
- **Environment Variables:** `dotenv`

## Konsep yang Diterapkan

Proyek ini dibangun di atas beberapa konsep dan pola arsitektur perangkat lunak yang penting:

- **RESTful API Design:** Mendesain endpoint berdasarkan sumber daya (resources) seperti `users`, `chats`, `messages`.
- **Pola MVC (Model-View-Controller):** Diterapkan dengan memisahkan:
  - **Model:** Skema Mongoose di dalam folder `/models`.
  - **View:** (Dalam konteks API) Didefinisikan oleh Rute di dalam folder `/routes`.
  - **Controller:** Logika bisnis yang menjembatani model dan rute, di dalam folder `/controllers`.
- **Middleware:** Penggunaan middleware secara ekstensif untuk autentikasi (`protect`), validasi file (`upload`), dan fungsi lainnya.
- **Keamanan:**
  - **Password Hashing:** Menyimpan password pengguna dengan aman.
  - **Stateless Authentication:** Menggunakan JWT untuk otorisasi permintaan tanpa perlu menyimpan sesi di server.
- **Komunikasi Real-time:** Menggunakan arsitektur berbasis event dengan Socket.IO, termasuk penggunaan _rooms_ untuk menargetkan siaran ke klien yang spesifik.

## Struktur Proyek

```
/backend
├── /config             # File konfigurasi (database, passport, cloudinary)
│   ├── cloudinary.js
│   ├── db.js
│   └── passport-setup.js
├── /controllers        # Logika bisnis untuk setiap rute API
│   ├── authController.js
│   ├── chatController.js
│   ├── ...
├── /middleware         # Middleware kustom (auth, upload)
│   ├── authMiddleware.js
│   └── uploadMiddleware.js
├── /models             # Skema database Mongoose
│   ├── userModel.js
│   ├── chatModel.js
│   ├── ...
├── /routes             # Definisi rute-rute API
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── ...
├── .env                # (Contoh) File variabel environment (tidak di-commit)
├── .gitignore
├── package.json
└── server.js           # File utama server Express
```

## Daftar Endpoint API

| Method | Path                               | Deskripsi                               | Terproteksi? |
| :----- | :--------------------------------- | :-------------------------------------- | :----------- |
| `POST` | `/api/users/register`              | Mendaftarkan pengguna baru.             | Tidak        |
| `POST` | `/api/users/login`                 | Login pengguna manual.                  | Tidak        |
| `GET`  | `/api/users`                       | Mencari pengguna berdasarkan email.     | Ya           |
| `GET`  | `/api/users/me`                    | Mendapatkan detail pengguna yang login. | Ya           |
| `GET`  | `/api/users/contacts`              | Mendapatkan daftar kontak/teman.        | Ya           |
| `PUT`  | `/api/users/profile`               | Memperbarui nama/password profil.       | Ya           |
| `PUT`  | `/api/users/profile/picture`       | Mengunggah foto profil baru.            | Ya           |
| `GET`  | `/api/users/public-key/:userId`    | Mengambil public key seorang pengguna.  | Ya           |
| `POST` | `/api/auth/google`                 | Memulai alur login Google.              | Tidak        |
| `GET`  | `/api/auth/google/callback`        | Callback setelah login Google berhasil. | Tidak        |
| `POST` | `/api/chat`                        | Membuat atau mengakses chat 1-on-1.     | Ya           |
| `GET`  | `/api/chat`                        | Mengambil semua percakapan pengguna.    | Ya           |
| `POST` | `/api/message`                     | Mengirim pesan baru.                    | Ya           |
| `GET`  | `/api/message/:chatId`             | Mengambil semua pesan dari sebuah chat. | Ya           |
| `POST` | `/api/friend-requests`             | Mengirim permintaan pertemanan.         | Ya           |
| `GET`  | `/api/friend-requests/pending`     | Mengambil permintaan pertemanan masuk.  | Ya           |
| `PUT`  | `/api/friend-requests/:id/respond` | Menerima atau menolak permintaan.       | Ya           |

## Setup Variabel Environment (`.env`)

Buat file `.env` di direktori root backend dan isi dengan variabel berikut:

```
MONGO_URI=
JWT_SECRET=
PORT=5000
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Instalasi & Menjalankan

1.  Dari direktori root proyek, masuk ke folder backend: `cd backend`
2.  Install semua dependensi: `npm install`
3.  Pastikan file `.env` sudah diisi dengan benar.
4.  Jalankan server development: `npm run dev`
5.  Server akan berjalan di `http://localhost:5000` (atau port yang didefinisikan di `.env`).

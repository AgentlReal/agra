## Daftar Perintah (Available Scripts)

Semua perintah di bawah ini dapat dijalankan menggunakan `npm run <command>` di root direktori project:

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server Next.js di mode development (`http://localhost:3000`). |
| `npm run build` | Melakukan compile dan build aplikasi Next.js untuk production. |
| `npm run start` | Menjalankan aplikasi hasil build production. |
| `npm run lint` | Menjalankan ESLint untuk mengecek kualitas dan error pada kode. |
| `npm run migrate` | Mengeksekusi file-file migrasi `.sql` dari folder `migrations/` ke database MySQL. |
| `npm run db:reset` | Menghapus (*DROP*) seluruh tabel di database untuk memulai migrasi dari awal. |
| `npm run mock` | Menjalankan Prism Mock API Server berbasis kontrak OpenAPI `openapi/API.yaml` (`http://127.0.0.1:4010`). |
| `npm run dev:mock` | Menjalankan Next.js dev server dan Prism Mock server secara bersamaan. |

---

## Panduan Penggunaan Command

### 1. Development & Build
- **Menjalankan App di Lokal:**
  ```bash
  npm run dev
  ```
  Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

- **Build untuk Production:**
  ```bash
  npm run build
  npm run start
  ```

- **Menjalankan App Bersama Mock Server:**
  ```bash
  npm run dev:mock
  ```
  Menjalankan frontend Next.js (`http://localhost:3000`) dan Prism Mock Server (`http://127.0.0.1:4010`) secara bersamaan.

---

### 2. Database Management
Pastikan konfigurasi database di file `.env` sudah diisi sesuai dengan credential server MySQL Anda.

- **Menjalankan Migrasi Database:**
  Mengeksekusi semua file `.sql` di folder `migrations/` secara berurutan:
  ```bash
  npm run migrate
  ```

- **Reset / Hapus Semua Tabel Database:**
  Menghapus (*DROP*) semua tabel di database (aman dari foreign key constraints):
  ```bash
  npm run db:reset
  ```

- **Hanya Mengosongkan Data (*TRUNCATE*):**
  Jika hanya ingin mengosongkan isi data tabel tanpa menghapus strukturnya:
  ```bash
  npm run db:reset -- --truncate
  ```

---

### 3. Mock API Server (Prism OpenAPI)
Digunakan oleh tim Frontend untuk menguji integrasi endpoint dan respon API tanpa harus menjalankan database MySQL atau backend secara penuh.

- **Menjalankan Server Mock API:**
  ```bash
  npm run mock
  ```
  - **Base URL:** `http://127.0.0.1:4010`
  - **Spesifikasi Kontrak:** [`openapi/API.yaml`](./openapi/API.yaml)
  - Endpoint otomatis memvalidasi request dan mengembalikan respons mock sesuai spesifikasi OpenAPI 3.0.

### Login mock dengan cookie

Buka `http://localhost:3000/login.html` setelah menjalankan `npm run dev` atau `npm run dev:mock`. Gunakan `user` / `Belajar1!` (email `user@example.com`) atau `tim_kurikulum` / `Belajar1!` (email `tim@example.com`).

Halaman login memakai endpoint `/api/mock/auth/sign-in/username` atau `/api/mock/auth/sign-in/email` pada origin Next.js yang sama. Respons menyetel cookie `agra_mock_session` dengan `HttpOnly`, `SameSite=Lax`, dan `Secure` saat HTTPS. Opsi **Ingat saya** memberi cookie `Max-Age` tujuh hari; tanpa opsi itu browser memakai session cookie. Halaman lalu memanggil `/api/mock/auth/get-session` untuk memastikan cookie dikirim kembali. Tombol **Keluar** memanggil `/api/mock/auth/sign-out` dan menghapus cookie.

Mock auth hanya aktif dalam mode development dan tidak memakai database. Cookie mock terpisah dari `better-auth.session_token`, sehingga tidak memberi akses ke endpoint aplikasi yang memerlukan sesi Better Auth asli. Prism di port 4010 tetap digunakan untuk respons API lain, tetapi tidak menyimpan sesi login.

---

## Konfigurasi Environment (`.env`)

Duplikasi file `.env.example` menjadi `.env` lalu sesuaikan isinya:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_db_name

# Better Auth Configuration
BETTER_AUTH_SECRET=your_generated_secret_key
BETTER_AUTH_URL=http://localhost:3000
```

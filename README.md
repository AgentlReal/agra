## 🛠️ Daftar Perintah (Available Scripts)

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

## 📖 Panduan Penggunaan Command

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

---

## ⚙️ Konfigurasi Environment (`.env`)

Duplikasi file `.env.example` menjadi `.env` lalu sesuaikan isinya:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_db_name

# Better Auth Secret Key
BETTER_AUTH_SECRET=your_generated_secret_key
```

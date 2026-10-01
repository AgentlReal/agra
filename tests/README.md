# Ruang Kerja Tim QA (Quality Assurance) - Project AGRA

Direktori ini (`agra/tests/`) adalah ruang kerja resmi tim QA pada branch `QA`. Semua artefak pengujian, dokumen master test case, skenario pengujian, serta runner otomatis dikelola di sini dan disinkronkan secara ketat dengan kontrak resmi backend [`openapi/API.yaml`](../openapi/API.yaml) v2.0.0.

---

## 1. Berkas Utama Pengujian
* **[`QA Test Case - BIG DATA.xlsx`](../../QA%20Test%20Case%20-%20BIG%20DATA.xlsx)** (Lokasi Master: Root Folder `Bikin Aplikasi/`):
  Master Test Case Spreadsheet terintegrasi resmi (366+ Total Test Cases):
  1. **Summary Dashboard**: Visualisasi KPI, metrik pass rate dinamis, dan distribusi status eksekusi per modul dan level teknis.
  2. **API Integration Test (334 Test Cases - `TC-API-001` s.d. `TC-API-334`)**: Spesifikasi lengkap pengujian backend mencakup Positive Cases, Negative Validation (400/422), Security RBAC (401/403), dan Boundary Cases di 10 modul resmi.
  3. **E2E & UI Test (70 Test Cases - `TC-UC01-001` s.d. `TC-UC07-xxx`)**: Meliputi alur perjalanan pengguna (User Journey Siswa & Tim Kurikulum) serta validasi komponen antarmuka Figma.

* **[`api.test.ts`](./api.test.ts)**:
  Test runner otomatis resmi dan terpadu (TypeScript) yang disinkronkan langsung dengan kode ID master `TC-API-xxx`. Menguji **105 skenario pengujian komprehensif** (54 Happy Path endpoint OpenAPI v2.0.0 + 51 Unhappy Path: Validasi Zod 400/422, Keamanan RBAC 401/403, Boundary Analysis, dan 404 Not Found):
  ```bash
  npm test
  # atau
  npm run test:full
  ```

* **[`e2e.test.ts`](./e2e.test.ts)**:
  Test runner otomatis skenario perjalanan pengguna (User Journey & E2E) yang disinkronkan dengan tab `E2E & UI Test` (skenario `TC-UC01` s.d. `TC-UC07`, `TC-NFR`, dan `TC-UI`):
  ```bash
  npm run test:e2e
  ```

---

## 2. Standar Penamaan & Penyelarasan Dokumen
Berdasarkan hasil audit mendalam terhadap seluruh dokumen NonTek (SRS 2.0-FINAL, Use Case Specification UCS-Final) dan BackEnd (`openapi/API.yaml` v2.0.0):

1. **Modul Asesmen Awal**:
   * Nama Resmi: **Recall Kemampuanmu** (menggantikan seluruh istilah lama *Pretest* dan kekeliruan *Recall Materi*).
   * Parameter Status: `is_recall_passed` (Boolean).
   * Error Codes: `RECALL_NOT_PASSED` (HTTP 403) dan `RECALL_ALREADY_PASSED` (HTTP 409).
2. **Autentikasi (Better Auth Multi-Identifier)**:
   * Registrasi Siswa: `POST /api/auth/sign-up/email`
   * Login Username: `POST /api/auth/sign-in/username`
   * Login Email: `POST /api/auth/sign-in/email`
   * Ganti Password: `POST /api/auth/change-password`
   * Reset Password: `POST /api/auth/request-password-reset` & `POST /api/auth/reset-password`
   * Session & Logout: `GET /api/auth/get-session` & `POST /api/auth/sign-out`
3. **Privasi & Keamanan Anak (UU PDP 2022 & COPPA)**:
   * Fitur Leaderboard (Papan Peringkat) resmi ditiadakan (`Deprecated`).
   * Foto wajah lokal ditiadakan, digantikan oleh preset avatar terkurasi (`GET /api/v1/avatars`).

---

## 3. Lingkungan Pengujian (Testing Environment)

### A. Pengujian Menggunakan Prism Mock Server (OpenAPI v2.0.0)
Untuk pengujian integrasi API tanpa memerlukan koneksi database MySQL:
```bash
# Jalankan dari root folder repo agra:
npm run mock
```
* **Base URL:** `http://127.0.0.1:4010`
* **Spesifikasi:** `openapi/API.yaml`
* Seluruh 43 endpoint API dapat diuji menggunakan Postman, Newman, atau HTTP client lain terhadap endpoint ini.

### B. Pengujian Aplikasi Lengkap (Next.js + Mock Auth)
```bash
npm run dev:mock
```
* **Frontend App:** `http://localhost:3000`
* **Halaman Login Mock:** `http://localhost:3000/login.html`
* **Kredensial Akun Dummy:**
  * Siswa: `user` / `Belajar1!` (email `user@example.com`)
  * Tim Kurikulum: `tim_kurikulum` / `Belajar1!` (email `tim@example.com`)

### C. Pengujian Terhadap Backend & Database Nyata (MySQL)
Untuk pengujian integrasi penuh terhadap server Next.js dan database MySQL asli:
```bash
# 1. Pastikan migrasi skema dan seed data precondition terpasang:
npm run migrate
npm run seed:test

# 2. Jalankan server Next.js (terminal 1):
npm run dev

# 3. Jalankan automated test suite (terminal 2):
npm test
```
* **Akun Penguji Siswa**: `siswabaru2026` / `Belajar1!` (role `SISWA`)
* **Akun Penguji Tim Kurikulum**: `tim_kurikulum` / `Belajar1!` (role `TIM_KURIKULUM`)
* **Dual-Session Runner**: Secara otomatis mengotentikasi sesi siswa dan admin, mengeksekusi 105 skenario API resmi `TC-API-xxx` (54 Happy Path + 51 Unhappy/Negative/RBAC Path), dan mengembalikan status ke keadaan bersih (*idempotent teardown*).
* **Tingkat Kelulusan**: **105 / 105 (100.0% Pass Rate)**.
# Ruang Kerja Tim QA (Quality Assurance) - Project AGRA

Direktori ini (`agra/tests/`) adalah ruang kerja resmi tim QA pada branch `QA`. Semua artefak pengujian, dokumen master test case, skenario pengujian, serta runner otomatis dikelola di sini dan disinkronkan secara ketat dengan kontrak resmi backend [`openapi/API.yaml`](../openapi/API.yaml) v2.0.0.

---

## 1. Berkas Utama Pengujian
* **[`QA Test Case - BIG DATA.xlsx`](../../QA%20Test%20Case%20-%20BIG%20DATA.xlsx)** (Lokasi Master: Root Folder `Bikin Aplikasi/`):
  Master Test Case Spreadsheet terintegrasi berisi:
  1. **Summary Dashboard**: Visualisasi KPI, metrik pass rate dinamis (100% API Pass Rate), dan distribusi status eksekusi.
  2. **API Integration Test (172 Test Cases)**: Meliputi seluruh endpoint unik (100% OpenAPI v2.0.0 & Better Auth).
  3. **E2E & UI Test (70 Test Cases)**: Meliputi alur siswa Fase D (Recall Kemampuanmu, Latihan Level, CBT Simulasi) dan Admin Portal.

* **[`api.test.ts`](./api.test.ts)**:
  Test runner otomatis resmi (TypeScript) untuk memvalidasi kontrak 54 endpoint API secara instan:
  ```bash
  npm test
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
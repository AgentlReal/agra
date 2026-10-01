-- =============================================================================
-- PEMBENIHAN DATA PENGGUNA (SEED USERS): TIM KURIKULUM (ADMINISTRATIF)
-- Arsitektur ERD Versi: 6.0 FINAL
-- Dokumen Acuan: TKA-DOC-08 (Spesifikasi Autentikasi, Pengelolaan Akun & Privasi)
-- Bagian: Bab 3 (Provisi Administratif Akun Tim Kurikulum)
-- File: Migration/009_seed_curriculum_users.sql
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. PEMBENIHAN AKUN PENGGUNA (TABEL: users)
-- Ketentuan DOC-08:
-- - Tidak ada registrasi publik untuk Tim Kurikulum (Hanya provisi backend/seeding)
-- - Username permanen 3-16 karakter, lowercase, angka, _
-- - Display Name resmi (3-30 karakter)
-- - Email dinas unik (@bimbel-tka.sch.id)
-- - emailVerified = TRUE (Akun resmi instansi terverifikasi langsung)
-- - role = 'TIM_KURIKULUM'
-- - TIDAK MEMILIKI entri di user_profiles (Tanpa XP, Badge, atau Riwayat Belajar Siswa)
-- -----------------------------------------------------------------------------

INSERT INTO `users` (
    `id`,
    `username`,
    `name`,
    `email`,
    `emailVerified`,
    `image`,
    `role`,
    `createdAt`,
    `updatedAt`
) VALUES
(
    'c0000000-0000-4000-a000-000000000001',
    'kurikulum_pusat',
    'Koordinator Kurikulum TKA',
    'kurikulum@bimbel-tka.sch.id',
    TRUE,
    'https://ui-avatars.com/api/?name=Kurikulum+Pusat&background=1E3A8A&color=fff',
    'TIM_KURIKULUM',
    NOW(),
    NOW()
),
(
    'c0000000-0000-4000-a000-000000000002',
    'kurikulum_mat',
    'Tim Kurikulum Matematika',
    'kurikulum.mat@bimbel-tka.sch.id',
    TRUE,
    'https://ui-avatars.com/api/?name=Kurikulum+Matematika&background=0D9488&color=fff',
    'TIM_KURIKULUM',
    NOW(),
    NOW()
),
(
    'c0000000-0000-4000-a000-000000000003',
    'kurikulum_bin',
    'Tim Kurikulum Bhs Indonesia',
    'kurikulum.bin@bimbel-tka.sch.id',
    TRUE,
    'https://ui-avatars.com/api/?name=Kurikulum+Indonesia&background=D97706&color=fff',
    'TIM_KURIKULUM',
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE
    `username` = VALUES(`username`),
    `name` = VALUES(`name`),
    `emailVerified` = VALUES(`emailVerified`),
    `image` = VALUES(`image`),
    `role` = VALUES(`role`),
    `updatedAt` = NOW();

-- -----------------------------------------------------------------------------
-- 2. PEMBENIHAN KREDENSIAL AUTENTIKASI (TABEL: accounts)
-- Standar Keamanan: Argon2id (RFC 9106 / Better Auth Default)
-- Password Default Seed: KurikulumTKA2026!
-- Provider ID: 'credential'
-- -----------------------------------------------------------------------------

INSERT INTO `accounts` (
    `id`,
    `accountId`,
    `providerId`,
    `userId`,
    `password`,
    `createdAt`,
    `updatedAt`
) VALUES
(
    'a0000000-0000-4000-a000-000000000001',
    'kurikulum@bimbel-tka.sch.id',
    'credential',
    'c0000000-0000-4000-a000-000000000001',
    '$argon2id$v=19$m=19456,t=2,p=1$2aVR9T4c8ZDtoRkXt7o0KQ$f4dRrT/vmsVMIC3SJLEYbPHRkEFnjmZpDb7GIj3MFbI',
    NOW(),
    NOW()
),
(
    'a0000000-0000-4000-a000-000000000002',
    'kurikulum.mat@bimbel-tka.sch.id',
    'credential',
    'c0000000-0000-4000-a000-000000000002',
    '$argon2id$v=19$m=19456,t=2,p=1$JYDFufYJH6Hk8WhfrOeuvA$ft2ye7zhj8AhgRwA1ueqjl7E/Pt8ZefEVRR52vzNjDs',
    NOW(),
    NOW()
),
(
    'a0000000-0000-4000-a000-000000000003',
    'kurikulum.bin@bimbel-tka.sch.id',
    'credential',
    'c0000000-0000-4000-a000-000000000003',
    '$argon2id$v=19$m=19456,t=2,p=1$2EGJqFr7nA9hcAgpJrOkzA$J1UvEdrIuVs4z3JGqvblVB/QDsC8ys3kEAZ9rO3j8Mo',
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE
    `accountId` = VALUES(`accountId`),
    `providerId` = VALUES(`providerId`),
    `password` = VALUES(`password`),
    `updatedAt` = NOW();

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- SELESAI: 3 Akun Tim Kurikulum (users & accounts) berhasil dibenihkan.
-- Akun 1: kurikulum_pusat (Koordinator Kurikulum TKA)
-- Akun 2: kurikulum_mat (Tim Kurikulum Matematika)
-- Akun 3: kurikulum_bin (Tim Kurikulum Bhs Indonesia)
-- Password Default: KurikulumTKA2026!
-- =============================================================================

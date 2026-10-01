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
-- 2. PEMBENIHAN KREDENSIAL AUTENTIKASI (TABEL: account)
-- Standar Keamanan: Scrypt (Better Auth Default: <salt_hex>:<key_hex>)
-- Password Default Seed: KurikulumTKA2026!
-- Provider ID: 'credential'
-- -----------------------------------------------------------------------------

INSERT INTO `account` (
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
    'c0000000-0000-4000-a000-000000000001',
    'credential',
    'c0000000-0000-4000-a000-000000000001',
    '88d1f750a8214898a9775af6d33cafda:9910764ea3b6915dec63a1539632cdc32e876d0f7ca2458d2a2a36c871507f5ef8318045259e965c9351e09ed368de735cb5f1cf13f95f57241fcefffcccbc51',
    NOW(),
    NOW()
),
(
    'a0000000-0000-4000-a000-000000000002',
    'c0000000-0000-4000-a000-000000000002',
    'credential',
    'c0000000-0000-4000-a000-000000000002',
    'c1c3d740431abc3274ccadcab3fa913f:acaa3914e8020d1e00961fc67e4bd10b7c15cd003e50e79b99d4cdf61e300ef6a22c69aea78892a15310430d4c00cfe5539fe674ba388b0980b16d2448d74620',
    NOW(),
    NOW()
),
(
    'a0000000-0000-4000-a000-000000000003',
    'c0000000-0000-4000-a000-000000000003',
    'credential',
    'c0000000-0000-4000-a000-000000000003',
    'b83993c053f163135ea4c8de8b2ed888:2691b3692adea74767ceb61ae8416fef1a20b9edb565b8b707438a6dacc3965a5aa2a1971925bd84d8893737960b84d70d35ddeb8aa386c28d0427eb93aef3b7',
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
-- SELESAI: 3 Akun Tim Kurikulum (users & account) berhasil dibenihkan.
-- Akun 1: kurikulum_pusat (Koordinator Kurikulum TKA)
-- Akun 2: kurikulum_mat (Tim Kurikulum Matematika)
-- Akun 3: kurikulum_bin (Tim Kurikulum Bhs Indonesia)
-- Password Default: KurikulumTKA2026!
-- =============================================================================

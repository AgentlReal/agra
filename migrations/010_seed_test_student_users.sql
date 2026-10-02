-- =============================================================================
-- PEMBENIHAN DATA PENGGUNA SISWA UJI COBA (SEED TEST STUDENT USERS)
-- Arsitektur ERD Versi: 6.0 FINAL (Tanpa CTT, 3 Level Kognitif Murni Kemendikdasmen)
-- Dokumen Acuan: TKA-DOC-02 (SRS), TKA-DOC-06 (Gamifikasi), TKA-DOC-07 (Simulasi CBT),
--                TKA-DOC-08 (Auth & Privasi), TKA-DOC-12 (Mastery)
-- File: migrations/010_seed_test_student_users.sql
-- =============================================================================
-- Menyediakan 3 akun siswa dengan variasi state kesiapan belajar berbeda:
-- 1. siswa_pretest : Siswa baru yang belum lulus pretest (Recall Kemampuanmu)
--                    Materi & Simulasi terkunci. Khusus uji coba alur awal.
-- 2. siswa_aktif   : Siswa yang sudah lulus pretest, sedang latihan submateri.
--                    Level Exercises terbuka bertahap, Simulasi masih terkunci.
-- 3. siswa_master  : Siswa Jawara TKA (Puncak). Lulus pretest & tuntas 16 submateri.
--                    Simulasi CBT 75 Menit TERBUKA PENUH (100% Eligible).
-- Kredensial Umum:
-- - Password Default: siswa123 (Better Auth Scrypt Hash)
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. PEMBENIHAN AKUN PENGGUNA (TABEL: users)
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
    's0000000-0000-4000-a000-000000000001',
    'siswa_pretest',
    'Siswa Baru (Pretest)',
    'siswa.pretest@bimbel-tka.sch.id',
    TRUE,
    'https://ui-avatars.com/api/?name=Siswa+Pretest&background=64748B&color=fff',
    'SISWA',
    NOW(),
    NOW()
),
(
    's0000000-0000-4000-a000-000000000002',
    'siswa_aktif',
    'Siswa Aktif (Progres)',
    'siswa.aktif@bimbel-tka.sch.id',
    TRUE,
    'https://ui-avatars.com/api/?name=Siswa+Aktif&background=0284C7&color=fff',
    'SISWA',
    NOW(),
    NOW()
),
(
    's0000000-0000-4000-a000-000000000003',
    'siswa_master',
    'Siswa Jawara (Master TKA)',
    'siswa.master@bimbel-tka.sch.id',
    TRUE,
    'https://ui-avatars.com/api/?name=Siswa+Master&background=EAB308&color=000',
    'SISWA',
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
-- Password Default Seed: siswa123
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
    'b0000000-0000-4000-a000-000000000001',
    's0000000-0000-4000-a000-000000000001',
    'credential',
    's0000000-0000-4000-a000-000000000001',
    '84364f4614ea55f7d76584431209d670:9ce3d1bcfab5877c64b95af95aa914014085e63b6608b192b71d67d578d91f00c65c03d23ffcddaaf1e5faff04259a3a5703c7db67ad2799fb7d3ff0227546d4',
    NOW(),
    NOW()
),
(
    'b0000000-0000-4000-a000-000000000002',
    's0000000-0000-4000-a000-000000000002',
    'credential',
    's0000000-0000-4000-a000-000000000002',
    '84364f4614ea55f7d76584431209d670:9ce3d1bcfab5877c64b95af95aa914014085e63b6608b192b71d67d578d91f00c65c03d23ffcddaaf1e5faff04259a3a5703c7db67ad2799fb7d3ff0227546d4',
    NOW(),
    NOW()
),
(
    'b0000000-0000-4000-a000-000000000003',
    's0000000-0000-4000-a000-000000000003',
    'credential',
    's0000000-0000-4000-a000-000000000003',
    '84364f4614ea55f7d76584431209d670:9ce3d1bcfab5877c64b95af95aa914014085e63b6608b192b71d67d578d91f00c65c03d23ffcddaaf1e5faff04259a3a5703c7db67ad2799fb7d3ff0227546d4',
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE
    `accountId` = VALUES(`accountId`),
    `providerId` = VALUES(`providerId`),
    `password` = VALUES(`password`),
    `updatedAt` = NOW();

-- -----------------------------------------------------------------------------
-- 3. PEMBENIHAN PROFIL PEDAGOGIS SISWA (TABEL: user_profiles)
-- -----------------------------------------------------------------------------
INSERT INTO `user_profiles` (
    `user_id`,
    `preset_avatar_id`,
    `current_milestone_tier_id`,
    `total_xp`,
    `is_recall_passed`,
    `created_at`,
    `updated_at`
) VALUES
-- Akun 1: Siswa Pretest (0 XP, Tier 1 Perintis Belajar, Pretest Belum Lulus)
(
    's0000000-0000-4000-a000-000000000001',
    1, -- Ksatria Buku
    1, -- Tier 1: Perintis Belajar (0 - 499 XP)
    0,
    FALSE,
    NOW(),
    NOW()
),
-- Akun 2: Siswa Aktif (1.200 XP, Tier 2 Penjelajah Konsep, Pretest Lulus, Progres Berjalan)
(
    's0000000-0000-4000-a000-000000000002',
    2, -- Penjelajah Galaksi
    2, -- Tier 2: Penjelajah Konsep (500 - 1499 XP)
    1200,
    TRUE,
    NOW(),
    NOW()
),
-- Akun 3: Siswa Master (7.600 XP, Tier 5 Jawara TKA, Seluruh 16 Submateri Tuntas)
(
    's0000000-0000-4000-a000-000000000003',
    6,  -- Lemon Bright
    5,  -- Tier 5: Jawara TKA (Puncak 5000+ XP)
    7600,
    TRUE,
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE
    `preset_avatar_id` = VALUES(`preset_avatar_id`),
    `current_milestone_tier_id` = VALUES(`current_milestone_tier_id`),
    `total_xp` = VALUES(`total_xp`),
    `is_recall_passed` = VALUES(`is_recall_passed`),
    `updated_at` = NOW();

-- -----------------------------------------------------------------------------
-- 4. PEMBENIHAN PROGRES KETUNTASAN SUBMATERI (TABEL: student_sub_material_progress)
-- -----------------------------------------------------------------------------

-- A. Untuk Akun 2: siswa_aktif (Progres Nyata Sebagian Materi)
INSERT INTO `student_sub_material_progress` (
    `user_id`, `sub_material_id`,
    `level_1_status`, `level_2_status`, `level_3_status`,
    `level_1_score`, `level_2_score`, `level_3_score`,
    `total_cumulative_score`, `is_mastered`, `is_xp_awarded`,
    `progress_state`, `mastered_at`, `updated_at`
) VALUES
-- M-01 Bilangan Real (Mastered)
('s0000000-0000-4000-a000-000000000002', 1, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 9.00, 29.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
-- M-02 Persamaan & Pertidaksamaan Linier (In Progress - L1 Selesai, L2 Terbuka)
('s0000000-0000-4000-a000-000000000002', 2, 'COMPLETED', 'AVAILABLE', 'LOCKED', 9.00, 0.00, 0.00, 9.00, FALSE, FALSE, 'IN_PROGRESS', NULL, NOW()),
-- B-01 Pemahaman Tekstual Teks Informasi (Mastered)
('s0000000-0000-4000-a000-000000000002', 11, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 9.50, 9.50, 29.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
-- B-02 Pemahaman Inferensial Teks Informasi (In Progress - L1 Selesai, L2 Terbuka)
('s0000000-0000-4000-a000-000000000002', 12, 'COMPLETED', 'AVAILABLE', 'LOCKED', 9.50, 0.00, 0.00, 9.50, FALSE, FALSE, 'IN_PROGRESS', NULL, NOW())
ON DUPLICATE KEY UPDATE
    `level_1_status` = VALUES(`level_1_status`),
    `level_2_status` = VALUES(`level_2_status`),
    `level_3_status` = VALUES(`level_3_status`),
    `level_1_score` = VALUES(`level_1_score`),
    `level_2_score` = VALUES(`level_2_score`),
    `level_3_score` = VALUES(`level_3_score`),
    `total_cumulative_score` = VALUES(`total_cumulative_score`),
    `is_mastered` = VALUES(`is_mastered`),
    `is_xp_awarded` = VALUES(`is_xp_awarded`),
    `progress_state` = VALUES(`progress_state`),
    `mastered_at` = VALUES(`mastered_at`),
    `updated_at` = NOW();

-- B. Untuk Akun 3: siswa_master (TUNTAS SELURUH 16 SUBMATERI -> MEMENUHI SYARAT SIMULASI)
INSERT INTO `student_sub_material_progress` (
    `user_id`, `sub_material_id`,
    `level_1_status`, `level_2_status`, `level_3_status`,
    `level_1_score`, `level_2_score`, `level_3_score`,
    `total_cumulative_score`, `is_mastered`, `is_xp_awarded`,
    `progress_state`, `mastered_at`, `updated_at`
) VALUES
-- 10 Submateri Matematika
('s0000000-0000-4000-a000-000000000003', 1, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000003', 2, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000003', 3, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000003', 4, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000003', 5, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000003', 6, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000003', 7, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000003', 8, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000003', 9, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000003', 10, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
-- 6 Submateri Bahasa Indonesia
('s0000000-0000-4000-a000-000000000003', 11, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000003', 12, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000003', 13, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000003', 14, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000003', 15, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000003', 16, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW())
ON DUPLICATE KEY UPDATE
    `level_1_status` = VALUES(`level_1_status`),
    `level_2_status` = VALUES(`level_2_status`),
    `level_3_status` = VALUES(`level_3_status`),
    `level_1_score` = VALUES(`level_1_score`),
    `level_2_score` = VALUES(`level_2_score`),
    `level_3_score` = VALUES(`level_3_score`),
    `total_cumulative_score` = VALUES(`total_cumulative_score`),
    `is_mastered` = VALUES(`is_mastered`),
    `is_xp_awarded` = VALUES(`is_xp_awarded`),
    `progress_state` = VALUES(`progress_state`),
    `mastered_at` = VALUES(`mastered_at`),
    `updated_at` = NOW();

-- -----------------------------------------------------------------------------
-- 5. PEMBENIHAN MUTASI XP (TABEL: xp_transactions)
-- Menjaga Single Source of Truth audit log transaksi poin XP formatif
-- -----------------------------------------------------------------------------

-- Mutasi untuk siswa_aktif (Total 1.200 XP):
INSERT INTO `xp_transactions` (`user_id`, `sub_material_id`, `simulation_id`, `session_id`, `milestone_tier_id`, `transaction_type`, `xp_amount`, `description`, `created_at`) VALUES
('s0000000-0000-4000-a000-000000000002', 1, NULL, NULL, NULL, 'LEVEL_COMPLETION', 50, 'Menyelesaikan Level 1 Pemahaman M-01 Bilangan Real', NOW()),
('s0000000-0000-4000-a000-000000000002', 1, NULL, NULL, NULL, 'LEVEL_COMPLETION', 75, 'Menyelesaikan Level 2 Pengaplikasian M-01 Bilangan Real', NOW()),
('s0000000-0000-4000-a000-000000000002', 1, NULL, NULL, NULL, 'LEVEL_COMPLETION', 100, 'Menyelesaikan Level 3 Penalaran M-01 Bilangan Real', NOW()),
('s0000000-0000-4000-a000-000000000002', 1, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) M-01 Bilangan Real', NOW()),
('s0000000-0000-4000-a000-000000000002', 2, NULL, NULL, NULL, 'LEVEL_COMPLETION', 50, 'Menyelesaikan Level 1 Pemahaman M-02 Persamaan Linier', NOW()),
('s0000000-0000-4000-a000-000000000002', 11, NULL, NULL, NULL, 'LEVEL_COMPLETION', 50, 'Menyelesaikan Level 1 Informasi Relevan B-01', NOW()),
('s0000000-0000-4000-a000-000000000002', 11, NULL, NULL, NULL, 'LEVEL_COMPLETION', 75, 'Menyelesaikan Level 2 Analisis Istilah B-01', NOW()),
('s0000000-0000-4000-a000-000000000002', 11, NULL, NULL, NULL, 'LEVEL_COMPLETION', 100, 'Menyelesaikan Level 3 Susun Kerangka B-01', NOW()),
('s0000000-0000-4000-a000-000000000002', 11, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) B-01 Pemahaman Tekstual', NOW()),
('s0000000-0000-4000-a000-000000000002', 12, NULL, NULL, NULL, 'LEVEL_COMPLETION', 50, 'Menyelesaikan Level 1 Penjelasan B-02', NOW()),
('s0000000-0000-4000-a000-000000000002', NULL, NULL, NULL, 2, 'LEVEL_COMPLETION', 150, 'Pencapaian Milestone Tier 2 Penjelajah Konsep', NOW());

-- Mutasi untuk siswa_master (16 Submateri x 250 XP Mastery = 4000 XP, 16 x 225 Level XP = 3600 XP -> Total 7.600 XP):
INSERT INTO `xp_transactions` (`user_id`, `sub_material_id`, `simulation_id`, `session_id`, `milestone_tier_id`, `transaction_type`, `xp_amount`, `description`, `created_at`) VALUES
('s0000000-0000-4000-a000-000000000003', 1, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-01', NOW()),
('s0000000-0000-4000-a000-000000000003', 2, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-02', NOW()),
('s0000000-0000-4000-a000-000000000003', 3, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-03', NOW()),
('s0000000-0000-4000-a000-000000000003', 4, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-04', NOW()),
('s0000000-0000-4000-a000-000000000003', 5, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-05', NOW()),
('s0000000-0000-4000-a000-000000000003', 6, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-06', NOW()),
('s0000000-0000-4000-a000-000000000003', 7, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-07', NOW()),
('s0000000-0000-4000-a000-000000000003', 8, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-08', NOW()),
('s0000000-0000-4000-a000-000000000003', 9, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-09', NOW()),
('s0000000-0000-4000-a000-000000000003', 10, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-10', NOW()),
('s0000000-0000-4000-a000-000000000003', 11, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri B-01', NOW()),
('s0000000-0000-4000-a000-000000000003', 12, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri B-02', NOW()),
('s0000000-0000-4000-a000-000000000003', 13, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri B-03', NOW()),
('s0000000-0000-4000-a000-000000000003', 14, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri B-04', NOW()),
('s0000000-0000-4000-a000-000000000003', 15, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri B-05', NOW()),
('s0000000-0000-4000-a000-000000000003', 16, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri B-06', NOW()),
('s0000000-0000-4000-a000-000000000003', NULL, NULL, NULL, NULL, 'LEVEL_COMPLETION', 3600, 'Akumulasi kelulusan seluruh Level 1, 2, dan 3 pada 16 Submateri (16 x 225 XP)', NOW());

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- SELESAI: 3 Akun Siswa Uji Coba Berhasil Dibenihkan.
-- 1. siswa_pretest (Recall = FALSE, Total XP = 0, Tier 1)
-- 2. siswa_aktif   (Recall = TRUE, Total XP = 1200, Tier 2, 2 Submateri Mastered)
-- 3. siswa_master  (Recall = TRUE, Total XP = 7600, Tier 5 Jawara TKA, 16/16 Mastered)
-- Password Default: siswa123
-- =============================================================================

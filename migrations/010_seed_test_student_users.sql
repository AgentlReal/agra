-- =============================================================================
-- PEMBENIHAN DATA PENGGUNA SISWA UJI COBA (SEED TEST STUDENT USERS)
-- Arsitektur ERD Versi: 6.0 FINAL (Tanpa CTT, 3 Level Kognitif Murni Kemendikdasmen)
-- Dokumen Acuan: TKA-DOC-02 (SRS), TKA-DOC-06 (Gamifikasi), TKA-DOC-07 (Simulasi CBT),
--                TKA-DOC-08 (Auth & Privasi), TKA-DOC-12 (Mastery)
-- File: migrations/010_seed_test_student_users.sql
-- =============================================================================
-- Menyediakan 7 akun siswa dengan variasi state kesiapan belajar lengkap:
-- 1. siswa_pretest  : Belum lulus pretest (Recall Kemampuanmu). Materi & Simulasi terkunci.
-- 2. siswa_aktif    : Lulus pretest, progres 2 submateri Mastered & 2 In-Progress (1.200 XP).
-- 3. siswa_master   : Lulus pretest, tuntas 16 submateri Mastered (7.600 XP). Simulasi Terbuka Penuh.
-- 4. siswa_remedial : Lulus pretest, Submateri 1 Level 3 Remedial (6.00), materi berikutnya terkunci.
-- 5. siswa_boundary : Lulus pretest, 15/16 Submateri Mastered, 1 belum tuntas (Boundary Test).
-- 6. siswa_post_exam: 16/16 Mastered, 1 Sesi Simulasi COMPLETED (Skor 93.33, log 30 butir tersimpan).
-- 7. siswa_tier_mid : Lulus pretest, Total 2.200 XP, Milestone Tier 3 (Pejuang Penalaran).
--
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
),
(
    's0000000-0000-4000-a000-000000000004',
    'siswa_remedial',
    'Siswa Remedial (Butuh Penguatan)',
    'siswa.remedial@bimbel-tka.sch.id',
    TRUE,
    'https://ui-avatars.com/api/?name=Siswa+Remedial&background=F59E0B&color=fff',
    'SISWA',
    NOW(),
    NOW()
),
(
    's0000000-0000-4000-a000-000000000005',
    'siswa_boundary',
    'Siswa Batas (Boundary Test)',
    'siswa.boundary@bimbel-tka.sch.id',
    TRUE,
    'https://ui-avatars.com/api/?name=Siswa+Batas&background=8B5CF6&color=fff',
    'SISWA',
    NOW(),
    NOW()
),
(
    's0000000-0000-4000-a000-000000000006',
    'siswa_post_exam',
    'Siswa Pasca Ujian (Post-Exam)',
    'siswa.post_exam@bimbel-tka.sch.id',
    TRUE,
    'https://ui-avatars.com/api/?name=Siswa+PostExam&background=10B981&color=fff',
    'SISWA',
    NOW(),
    NOW()
),
(
    's0000000-0000-4000-a000-000000000007',
    'siswa_tier_mid',
    'Siswa Tier Menengah (Pejuang)',
    'siswa.tier_mid@bimbel-tka.sch.id',
    TRUE,
    'https://ui-avatars.com/api/?name=Siswa+TierMid&background=3B82F6&color=fff',
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
),
(
    'b0000000-0000-4000-a000-000000000004',
    's0000000-0000-4000-a000-000000000004',
    'credential',
    's0000000-0000-4000-a000-000000000004',
    '84364f4614ea55f7d76584431209d670:9ce3d1bcfab5877c64b95af95aa914014085e63b6608b192b71d67d578d91f00c65c03d23ffcddaaf1e5faff04259a3a5703c7db67ad2799fb7d3ff0227546d4',
    NOW(),
    NOW()
),
(
    'b0000000-0000-4000-a000-000000000005',
    's0000000-0000-4000-a000-000000000005',
    'credential',
    's0000000-0000-4000-a000-000000000005',
    '84364f4614ea55f7d76584431209d670:9ce3d1bcfab5877c64b95af95aa914014085e63b6608b192b71d67d578d91f00c65c03d23ffcddaaf1e5faff04259a3a5703c7db67ad2799fb7d3ff0227546d4',
    NOW(),
    NOW()
),
(
    'b0000000-0000-4000-a000-000000000006',
    's0000000-0000-4000-a000-000000000006',
    'credential',
    's0000000-0000-4000-a000-000000000006',
    '84364f4614ea55f7d76584431209d670:9ce3d1bcfab5877c64b95af95aa914014085e63b6608b192b71d67d578d91f00c65c03d23ffcddaaf1e5faff04259a3a5703c7db67ad2799fb7d3ff0227546d4',
    NOW(),
    NOW()
),
(
    'b0000000-0000-4000-a000-000000000007',
    's0000000-0000-4000-a000-000000000007',
    'credential',
    's0000000-0000-4000-a000-000000000007',
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
    2, -- Tier 2: Penjelajah Konsep (500 - 1.499 XP)
    1200,
    TRUE,
    NOW(),
    NOW()
),
-- Akun 3: Siswa Master (7.600 XP, Tier 5 Jawara TKA, Seluruh 16 Submateri Tuntas)
(
    's0000000-0000-4000-a000-000000000003',
    6,  -- Lemon Bright
    5,  -- Tier 5: Jawara TKA (Puncak 5.000+ XP)
    7600,
    TRUE,
    NOW(),
    NOW()
),
-- Akun 4: Siswa Remedial (125 XP, Tier 1 Perintis Belajar, Submateri 1 Level 3 Perlu Remedial)
(
    's0000000-0000-4000-a000-000000000004',
    3, -- Rubah Cerdik
    1, -- Tier 1: Perintis Belajar (0 - 499 XP)
    125,
    TRUE,
    NOW(),
    NOW()
),
-- Akun 5: Siswa Boundary (7.175 XP, Tier 5 Jawara TKA, 15/16 Submateri Mastered, Nilai Batas)
(
    's0000000-0000-4000-a000-000000000005',
    4, -- Burung Hantu Bijak
    5, -- Tier 5: Jawara TKA (5.000+ XP)
    7175,
    TRUE,
    NOW(),
    NOW()
),
-- Akun 6: Siswa Pasca Ujian (8.100 XP, Tier 5 Jawara TKA, 1 Sesi Simulasi COMPLETED Skor 93.33)
(
    's0000000-0000-4000-a000-000000000006',
    5, -- Singa Tangguh
    5, -- Tier 5: Jawara TKA (5.000+ XP)
    8100,
    TRUE,
    NOW(),
    NOW()
),
-- Akun 7: Siswa Tier Menengah (2.200 XP, Tier 3 Pejuang Penalaran, 4 Mastered + 2 Progres)
(
    's0000000-0000-4000-a000-000000000007',
    2, -- Penjelajah Galaksi
    3, -- Tier 3: Pejuang Penalaran (1.500 - 2.999 XP)
    2200,
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

-- C. Untuk Akun 4: siswa_remedial (M-01 Level 3 Remedial / Skor 6.00, M-02 Terkunci)
INSERT INTO `student_sub_material_progress` (
    `user_id`, `sub_material_id`,
    `level_1_status`, `level_2_status`, `level_3_status`,
    `level_1_score`, `level_2_score`, `level_3_score`,
    `total_cumulative_score`, `is_mastered`, `is_xp_awarded`,
    `progress_state`, `mastered_at`, `updated_at`
) VALUES
-- M-01 Bilangan Real: L1=10.00, L2=9.00, L3=6.00 (<70% -> NEEDS_REMEDIAL), Belum Mastered
('s0000000-0000-4000-a000-000000000004', 1, 'COMPLETED', 'COMPLETED', 'NEEDS_REMEDIAL', 10.00, 9.00, 6.00, 25.00, FALSE, FALSE, 'IN_PROGRESS', NULL, NOW()),
-- M-02 Persamaan Linier: Masih terkunci karena M-01 belum tuntas
('s0000000-0000-4000-a000-000000000004', 2, 'LOCKED', 'LOCKED', 'LOCKED', 0.00, 0.00, 0.00, 0.00, FALSE, FALSE, 'LOCKED', NULL, NOW())
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

-- D. Untuk Akun 5: siswa_boundary (15/16 Submateri Mastered, B-06 Belum Tuntas -> Simulasi Terkunci)
INSERT INTO `student_sub_material_progress` (
    `user_id`, `sub_material_id`,
    `level_1_status`, `level_2_status`, `level_3_status`,
    `level_1_score`, `level_2_score`, `level_3_score`,
    `total_cumulative_score`, `is_mastered`, `is_xp_awarded`,
    `progress_state`, `mastered_at`, `updated_at`
) VALUES
-- 10 Submateri Matematika (10/10 Mastered)
('s0000000-0000-4000-a000-000000000005', 1, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000005', 2, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000005', 3, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000005', 4, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000005', 5, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000005', 6, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000005', 7, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000005', 8, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000005', 9, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000005', 10, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
-- 5 Submateri Bahasa Indonesia Mastered (B-01 s.d B-05)
('s0000000-0000-4000-a000-000000000005', 11, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000005', 12, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000005', 13, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000005', 14, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000005', 15, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
-- 1 Submateri Tersisa Belum Tuntas: B-06 (L1 Selesai, L2 Terbuka, L3 Terkunci -> Nilai Batas Boundary)
('s0000000-0000-4000-a000-000000000005', 16, 'COMPLETED', 'AVAILABLE', 'LOCKED', 9.00, 0.00, 0.00, 9.00, FALSE, FALSE, 'IN_PROGRESS', NULL, NOW())
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

-- E. Untuk Akun 6: siswa_post_exam (TUNTAS SELURUH 16 SUBMATERI & TELAH IKUT SIMULASI)
INSERT INTO `student_sub_material_progress` (
    `user_id`, `sub_material_id`,
    `level_1_status`, `level_2_status`, `level_3_status`,
    `level_1_score`, `level_2_score`, `level_3_score`,
    `total_cumulative_score`, `is_mastered`, `is_xp_awarded`,
    `progress_state`, `mastered_at`, `updated_at`
) VALUES
-- 10 Submateri Matematika
('s0000000-0000-4000-a000-000000000006', 1, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000006', 2, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000006', 3, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000006', 4, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000006', 5, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000006', 6, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000006', 7, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000006', 8, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000006', 9, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000006', 10, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
-- 6 Submateri Bahasa Indonesia
('s0000000-0000-4000-a000-000000000006', 11, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000006', 12, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000006', 13, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000006', 14, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000006', 15, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000006', 16, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW())
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

-- F. Untuk Akun 7: siswa_tier_mid (4 Mastered + 2 In-Progress -> Total 2.200 XP, Tier 3)
INSERT INTO `student_sub_material_progress` (
    `user_id`, `sub_material_id`,
    `level_1_status`, `level_2_status`, `level_3_status`,
    `level_1_score`, `level_2_score`, `level_3_score`,
    `total_cumulative_score`, `is_mastered`, `is_xp_awarded`,
    `progress_state`, `mastered_at`, `updated_at`
) VALUES
-- 4 Submateri Matematika Mastered (M-01 s.d M-04 -> 4 x 475 XP = 1.900 XP)
('s0000000-0000-4000-a000-000000000007', 1, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000007', 2, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000007', 3, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
('s0000000-0000-4000-a000-000000000007', 4, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW(), NOW()),
-- Submateri 5 (M-05 Barisan & Deret): L1 & L2 Selesai, L3 Belum (50 + 75 = 125 XP)
('s0000000-0000-4000-a000-000000000007', 5, 'COMPLETED', 'COMPLETED', 'AVAILABLE', 10.00, 10.00, 0.00, 20.00, FALSE, FALSE, 'IN_PROGRESS', NULL, NOW()),
-- Submateri 11 (B-01 Pemahaman Tekstual Teks Informasi): L1 & L2 Selesai, L3 Belum (50 + 75 = 125 XP)
('s0000000-0000-4000-a000-000000000007', 11, 'COMPLETED', 'COMPLETED', 'AVAILABLE', 10.00, 9.50, 0.00, 19.50, FALSE, FALSE, 'IN_PROGRESS', NULL, NOW())
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
-- 5. PEMBENIHAN SESI UJIAN SIMULASI SISWA (TABEL: learning_sessions)
-- Khusus Akun 6: siswa_post_exam (Sesi Selesai / COMPLETED, Skor 93.33)
-- -----------------------------------------------------------------------------
INSERT INTO `learning_sessions` (
    `id`,
    `user_id`,
    `subject_id`,
    `session_type`,
    `sub_material_id`,
    `cognitive_level_id`,
    `simulation_id`,
    `attempt_number`,
    `is_remedial`,
    `status`,
    `submission_type`,
    `total_questions`,
    `correct_answers`,
    `score`,
    `is_passed`,
    `remaining_time_seconds`,
    `current_question_order`,
    `start_time`,
    `resumed_at`,
    `end_time`
) VALUES
(
    9001,
    's0000000-0000-4000-a000-000000000006',
    1, -- Matematika
    'SIMULATION',
    NULL,
    NULL,
    1, -- Simulasi TKA Matematika - Paket 01
    1,
    FALSE,
    'COMPLETED',
    'MANUAL',
    30,
    28.00,
    93.33,
    TRUE,
    0,
    30,
    DATE_SUB(NOW(), INTERVAL 70 MINUTE),
    NULL,
    DATE_SUB(NOW(), INTERVAL 5 MINUTE)
)
ON DUPLICATE KEY UPDATE
    `user_id` = VALUES(`user_id`),
    `subject_id` = VALUES(`subject_id`),
    `session_type` = VALUES(`session_type`),
    `simulation_id` = VALUES(`simulation_id`),
    `attempt_number` = VALUES(`attempt_number`),
    `status` = VALUES(`status`),
    `submission_type` = VALUES(`submission_type`),
    `total_questions` = VALUES(`total_questions`),
    `correct_answers` = VALUES(`correct_answers`),
    `score` = VALUES(`score`),
    `is_passed` = VALUES(`is_passed`),
    `remaining_time_seconds` = VALUES(`remaining_time_seconds`),
    `current_question_order` = VALUES(`current_question_order`),
    `start_time` = VALUES(`start_time`),
    `end_time` = VALUES(`end_time`);

-- -----------------------------------------------------------------------------
-- 6. PEMBENIHAN LEMBAR SOAL SESI SIMULASI (TABEL: session_questions)
-- Khusus Sesi 9001 (Paket 01 Matematika, 30 Butir Soal Terurut)
-- -----------------------------------------------------------------------------
INSERT INTO `session_questions` (`id`, `session_id`, `question_id`, `question_order`) VALUES
(90001, 9001, 1, 1),
(90002, 9001, 2, 2),
(90003, 9001, 3, 3),
(90004, 9001, 4, 4),
(90005, 9001, 5, 5),
(90006, 9001, 6, 6),
(90007, 9001, 7, 7),
(90008, 9001, 8, 8),
(90009, 9001, 9, 9),
(90010, 9001, 10, 10),
(90011, 9001, 11, 11),
(90012, 9001, 12, 12),
(90013, 9001, 13, 13),
(90014, 9001, 14, 14),
(90015, 9001, 15, 15),
(90016, 9001, 16, 16),
(90017, 9001, 17, 17),
(90018, 9001, 18, 18),
(90019, 9001, 19, 19),
(90020, 9001, 20, 20),
(90021, 9001, 21, 21),
(90022, 9001, 22, 22),
(90023, 9001, 23, 23),
(90024, 9001, 24, 24),
(90025, 9001, 25, 25),
(90026, 9001, 26, 26),
(90027, 9001, 27, 27),
(90028, 9001, 28, 28),
(90029, 9001, 29, 29),
(90030, 9001, 30, 30)
ON DUPLICATE KEY UPDATE
    `session_id` = VALUES(`session_id`),
    `question_id` = VALUES(`question_id`),
    `question_order` = VALUES(`question_order`);

-- -----------------------------------------------------------------------------
-- 7. PEMBENIHAN LOG JAWABAN SISWA (TABEL: student_answers)
-- Soal 1..28 Benar (Skor 1.00), Soal 29..30 Salah (Skor 0.00) -> 28 Benar (93.33%)
-- -----------------------------------------------------------------------------
INSERT INTO `student_answers` (`id`, `session_question_id`, `score`, `is_correct`, `is_flagged`, `is_skipped`, `time_spent_seconds`, `answered_at`) VALUES
(90001, 90001, 1.00, TRUE, FALSE, FALSE, 110, DATE_SUB(NOW(), INTERVAL 68 MINUTE)),
(90002, 90002, 1.00, TRUE, FALSE, FALSE, 95,  DATE_SUB(NOW(), INTERVAL 66 MINUTE)),
(90003, 90003, 1.00, TRUE, FALSE, FALSE, 140, DATE_SUB(NOW(), INTERVAL 64 MINUTE)),
(90004, 90004, 1.00, TRUE, FALSE, FALSE, 120, DATE_SUB(NOW(), INTERVAL 62 MINUTE)),
(90005, 90005, 1.00, TRUE, FALSE, FALSE, 130, DATE_SUB(NOW(), INTERVAL 60 MINUTE)),
(90006, 90006, 1.00, TRUE, FALSE, FALSE, 105, DATE_SUB(NOW(), INTERVAL 58 MINUTE)),
(90007, 90007, 1.00, TRUE, FALSE, FALSE, 150, DATE_SUB(NOW(), INTERVAL 55 MINUTE)),
(90008, 90008, 1.00, TRUE, FALSE, FALSE, 135, DATE_SUB(NOW(), INTERVAL 53 MINUTE)),
(90009, 90009, 1.00, TRUE, FALSE, FALSE, 125, DATE_SUB(NOW(), INTERVAL 50 MINUTE)),
(90010, 90010, 1.00, TRUE, FALSE, FALSE, 115, DATE_SUB(NOW(), INTERVAL 48 MINUTE)),
(90011, 90011, 1.00, TRUE, FALSE, FALSE, 120, DATE_SUB(NOW(), INTERVAL 46 MINUTE)),
(90012, 90012, 1.00, TRUE, FALSE, FALSE, 100, DATE_SUB(NOW(), INTERVAL 44 MINUTE)),
(90013, 90013, 1.00, TRUE, FALSE, FALSE, 145, DATE_SUB(NOW(), INTERVAL 41 MINUTE)),
(90014, 90014, 1.00, TRUE, FALSE, FALSE, 130, DATE_SUB(NOW(), INTERVAL 39 MINUTE)),
(90015, 90015, 1.00, TRUE, FALSE, FALSE, 125, DATE_SUB(NOW(), INTERVAL 37 MINUTE)),
(90016, 90016, 1.00, TRUE, FALSE, FALSE, 110, DATE_SUB(NOW(), INTERVAL 35 MINUTE)),
(90017, 90017, 1.00, TRUE, FALSE, FALSE, 140, DATE_SUB(NOW(), INTERVAL 32 MINUTE)),
(90018, 90018, 1.00, TRUE, FALSE, FALSE, 115, DATE_SUB(NOW(), INTERVAL 30 MINUTE)),
(90019, 90019, 1.00, TRUE, FALSE, FALSE, 150, DATE_SUB(NOW(), INTERVAL 27 MINUTE)),
(90020, 90020, 1.00, TRUE, FALSE, FALSE, 105, DATE_SUB(NOW(), INTERVAL 25 MINUTE)),
(90021, 90021, 1.00, TRUE, FALSE, FALSE, 135, DATE_SUB(NOW(), INTERVAL 23 MINUTE)),
(90022, 90022, 1.00, TRUE, FALSE, FALSE, 120, DATE_SUB(NOW(), INTERVAL 21 MINUTE)),
(90023, 90023, 1.00, TRUE, FALSE, FALSE, 100, DATE_SUB(NOW(), INTERVAL 19 MINUTE)),
(90024, 90024, 1.00, TRUE, FALSE, FALSE, 130, DATE_SUB(NOW(), INTERVAL 17 MINUTE)),
(90025, 90025, 1.00, TRUE, FALSE, FALSE, 115, DATE_SUB(NOW(), INTERVAL 15 MINUTE)),
(90026, 90026, 1.00, TRUE, FALSE, FALSE, 125, DATE_SUB(NOW(), INTERVAL 13 MINUTE)),
(90027, 90027, 1.00, TRUE, FALSE, FALSE, 140, DATE_SUB(NOW(), INTERVAL 11 MINUTE)),
(90028, 90028, 1.00, TRUE, FALSE, FALSE, 135, DATE_SUB(NOW(), INTERVAL 9 MINUTE)),
(90029, 90029, 0.00, FALSE, FALSE, FALSE, 145, DATE_SUB(NOW(), INTERVAL 7 MINUTE)),
(90030, 90030, 0.00, FALSE, FALSE, FALSE, 130, DATE_SUB(NOW(), INTERVAL 5 MINUTE))
ON DUPLICATE KEY UPDATE
    `session_question_id` = VALUES(`session_question_id`),
    `score` = VALUES(`score`),
    `is_correct` = VALUES(`is_correct`),
    `is_flagged` = VALUES(`is_flagged`),
    `is_skipped` = VALUES(`is_skipped`),
    `time_spent_seconds` = VALUES(`time_spent_seconds`),
    `answered_at` = VALUES(`answered_at`);

-- -----------------------------------------------------------------------------
-- 8. PEMBENIHAN PILIHAN OPSI SISWA (TABEL: student_answer_options)
-- Terhubung ke ID opsi riil di question_options (Paket 01 Matematika)
-- -----------------------------------------------------------------------------
INSERT INTO `student_answer_options` (`id`, `student_answer_id`, `selected_option_id`) VALUES
-- Soal 1 (Q1, Option A: 1)
(90001, 90001, 1),
-- Soal 2 (Q2, Option C: 7)
(90002, 90002, 7),
-- Soal 3 (Q3 PGK, Option A & B: 9, 10)
(90003, 90003, 9),
(90004, 90003, 10),
-- Soal 4 (Q4, Option A: 13)
(90005, 90004, 13),
-- Soal 5 (Q5, Option C: 19)
(90006, 90005, 19),
-- Soal 6 (Q6, Option B: 22)
(90007, 90006, 22),
-- Soal 7 (Q7 PGK, Option A & D: 25, 28)
(90008, 90007, 25),
(90009, 90007, 28),
-- Soal 8 (Q8 PGK, Option A & B: 29, 30)
(90010, 90008, 29),
(90011, 90008, 30),
-- Soal 9 (Q9 PGK, Option A & B: 33, 34)
(90012, 90009, 33),
(90013, 90009, 34),
-- Soal 10 (Q10, Option A: 37)
(90014, 90010, 37),
-- Soal 11 (Q11, Option B: 42)
(90015, 90011, 42),
-- Soal 12 (Q12, Option C: 47)
(90016, 90012, 47),
-- Soal 13 (Q13 PGK, Option A & B: 49, 50)
(90017, 90013, 49),
(90018, 90013, 50),
-- Soal 14 (Q14 PGK, Option A & B: 53, 54)
(90019, 90014, 53),
(90020, 90014, 54),
-- Soal 15 (Q15, Option C: 59)
(90021, 90015, 59),
-- Soal 16 (Q16, Option B: 62)
(90022, 90016, 62),
-- Soal 17 (Q17 PGK, Option A & B: 65, 66)
(90023, 90017, 65),
(90024, 90017, 66),
-- Soal 18 (Q18, Option C: 71)
(90025, 90018, 71),
-- Soal 19 (Q19 PGK, Option A & B: 73, 74)
(90026, 90019, 73),
(90027, 90019, 74),
-- Soal 20 (Q20, Option B: 78)
(90028, 90020, 78),
-- Soal 21 (Q21 PGK, Option A & B: 81, 82)
(90029, 90021, 81),
(90030, 90021, 82),
-- Soal 22 (Q22, Option B: 86)
(90031, 90022, 86),
-- Soal 23 (Q23, Option B: 90)
(90032, 90023, 90),
-- Soal 24 (Q24, Option C: 95)
(90033, 90024, 95),
-- Soal 25 (Q25, Option C: 99)
(90034, 90025, 99),
-- Soal 26 (Q26, Option B: 102)
(90035, 90026, 102),
-- Soal 27 (Q27 PGK, Option A & B: 105, 106)
(90036, 90027, 105),
(90037, 90027, 106),
-- Soal 28 (Q28 PGK, Option A & B: 109, 110)
(90038, 90028, 109),
(90039, 90028, 110),
-- Soal 29 Salah (Q29 PGK, Siswa memilih Option C yang salah: 115)
(90040, 90029, 115),
-- Soal 30 Salah (Q30 PGK, Siswa memilih Option B yang salah: 118)
(90041, 90030, 118)
ON DUPLICATE KEY UPDATE
    `student_answer_id` = VALUES(`student_answer_id`),
    `selected_option_id` = VALUES(`selected_option_id`);

-- -----------------------------------------------------------------------------
-- 9. PEMBENIHAN MUTASI XP (TABEL: xp_transactions)
-- Menjaga Single Source of Truth audit log transaksi poin XP formatif
-- -----------------------------------------------------------------------------

-- A. Mutasi untuk siswa_aktif (Total 1.200 XP):
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

-- B. Mutasi untuk siswa_master (16 Submateri x 250 XP Mastery = 4000 XP, 16 x 225 Level XP = 3600 XP -> Total 7.600 XP):
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

-- C. Mutasi untuk siswa_remedial (Level 1 + Level 2 = 125 XP, Mastery Bonus ditahan):
INSERT INTO `xp_transactions` (`user_id`, `sub_material_id`, `simulation_id`, `session_id`, `milestone_tier_id`, `transaction_type`, `xp_amount`, `description`, `created_at`) VALUES
('s0000000-0000-4000-a000-000000000004', 1, NULL, NULL, NULL, 'LEVEL_COMPLETION', 50, 'Menyelesaikan Level 1 Pemahaman M-01 Bilangan Real', NOW()),
('s0000000-0000-4000-a000-000000000004', 1, NULL, NULL, NULL, 'LEVEL_COMPLETION', 75, 'Menyelesaikan Level 2 Pengaplikasian M-01 Bilangan Real', NOW());

-- D. Mutasi untuk siswa_boundary (15 Mastered + Level 1 B-06 = 7.175 XP):
INSERT INTO `xp_transactions` (`user_id`, `sub_material_id`, `simulation_id`, `session_id`, `milestone_tier_id`, `transaction_type`, `xp_amount`, `description`, `created_at`) VALUES
('s0000000-0000-4000-a000-000000000005', 1, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-01', NOW()),
('s0000000-0000-4000-a000-000000000005', 2, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-02', NOW()),
('s0000000-0000-4000-a000-000000000005', 3, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-03', NOW()),
('s0000000-0000-4000-a000-000000000005', 4, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-04', NOW()),
('s0000000-0000-4000-a000-000000000005', 5, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-05', NOW()),
('s0000000-0000-4000-a000-000000000005', 6, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-06', NOW()),
('s0000000-0000-4000-a000-000000000005', 7, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-07', NOW()),
('s0000000-0000-4000-a000-000000000005', 8, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-08', NOW()),
('s0000000-0000-4000-a000-000000000005', 9, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-09', NOW()),
('s0000000-0000-4000-a000-000000000005', 10, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-10', NOW()),
('s0000000-0000-4000-a000-000000000005', 11, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri B-01', NOW()),
('s0000000-0000-4000-a000-000000000005', 12, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri B-02', NOW()),
('s0000000-0000-4000-a000-000000000005', 13, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri B-03', NOW()),
('s0000000-0000-4000-a000-000000000005', 14, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri B-04', NOW()),
('s0000000-0000-4000-a000-000000000005', 15, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri B-05', NOW()),
('s0000000-0000-4000-a000-000000000005', NULL, NULL, NULL, NULL, 'LEVEL_COMPLETION', 3375, 'Akumulasi kelulusan seluruh Level 1, 2, dan 3 pada 15 Submateri (15 x 225 XP)', NOW()),
('s0000000-0000-4000-a000-000000000005', 16, NULL, NULL, NULL, 'LEVEL_COMPLETION', 50, 'Menyelesaikan Level 1 Cari Informasi B-06 Evaluasi Fiksi', NOW());

-- E. Mutasi untuk siswa_post_exam (16 Mastered = 7.600 XP + Bonus Simulasi 500 XP = 8.100 XP):
INSERT INTO `xp_transactions` (`user_id`, `sub_material_id`, `simulation_id`, `session_id`, `milestone_tier_id`, `transaction_type`, `xp_amount`, `description`, `created_at`) VALUES
('s0000000-0000-4000-a000-000000000006', 1, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-01', NOW()),
('s0000000-0000-4000-a000-000000000006', 2, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-02', NOW()),
('s0000000-0000-4000-a000-000000000006', 3, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-03', NOW()),
('s0000000-0000-4000-a000-000000000006', 4, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-04', NOW()),
('s0000000-0000-4000-a000-000000000006', 5, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-05', NOW()),
('s0000000-0000-4000-a000-000000000006', 6, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-06', NOW()),
('s0000000-0000-4000-a000-000000000006', 7, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-07', NOW()),
('s0000000-0000-4000-a000-000000000006', 8, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-08', NOW()),
('s0000000-0000-4000-a000-000000000006', 9, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-09', NOW()),
('s0000000-0000-4000-a000-000000000006', 10, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-10', NOW()),
('s0000000-0000-4000-a000-000000000006', 11, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri B-01', NOW()),
('s0000000-0000-4000-a000-000000000006', 12, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri B-02', NOW()),
('s0000000-0000-4000-a000-000000000006', 13, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri B-03', NOW()),
('s0000000-0000-4000-a000-000000000006', 14, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri B-04', NOW()),
('s0000000-0000-4000-a000-000000000006', 15, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri B-05', NOW()),
('s0000000-0000-4000-a000-000000000006', 16, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri B-06', NOW()),
('s0000000-0000-4000-a000-000000000006', NULL, NULL, NULL, NULL, 'LEVEL_COMPLETION', 3600, 'Akumulasi kelulusan seluruh Level 1, 2, dan 3 pada 16 Submateri (16 x 225 XP)', NOW()),
('s0000000-0000-4000-a000-000000000006', NULL, 1, 9001, NULL, 'SIMULATION_COMPLETION', 500, 'Bonus Kelulusan Prima Simulasi Ujian TKA (+500 XP)', NOW());

-- F. Mutasi untuk siswa_tier_mid (4 Mastered + 2 In-Progress + Tier 2 Bonus = 2.200 XP):
INSERT INTO `xp_transactions` (`user_id`, `sub_material_id`, `simulation_id`, `session_id`, `milestone_tier_id`, `transaction_type`, `xp_amount`, `description`, `created_at`) VALUES
('s0000000-0000-4000-a000-000000000007', 1, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-01', NOW()),
('s0000000-0000-4000-a000-000000000007', 2, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-02', NOW()),
('s0000000-0000-4000-a000-000000000007', 3, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-03', NOW()),
('s0000000-0000-4000-a000-000000000007', 4, NULL, NULL, NULL, 'SUB_MATERIAL_MASTERY', 250, 'Mastery Bonus (+250 XP) Submateri M-04', NOW()),
('s0000000-0000-4000-a000-000000000007', NULL, NULL, NULL, NULL, 'LEVEL_COMPLETION', 900, 'Akumulasi kelulusan Level 1, 2, dan 3 pada Submateri M-01 s.d M-04 (4 x 225 XP)', NOW()),
('s0000000-0000-4000-a000-000000000007', 5, NULL, NULL, NULL, 'LEVEL_COMPLETION', 50, 'Menyelesaikan Level 1 Pemahaman M-05 Barisan & Deret', NOW()),
('s0000000-0000-4000-a000-000000000007', 5, NULL, NULL, NULL, 'LEVEL_COMPLETION', 75, 'Menyelesaikan Level 2 Pengaplikasian M-05 Barisan & Deret', NOW()),
('s0000000-0000-4000-a000-000000000007', 11, NULL, NULL, NULL, 'LEVEL_COMPLETION', 50, 'Menyelesaikan Level 1 Informasi Relevan B-01 Pemahaman Tekstual', NOW()),
('s0000000-0000-4000-a000-000000000007', 11, NULL, NULL, NULL, 'LEVEL_COMPLETION', 75, 'Menyelesaikan Level 2 Analisis Istilah B-01 Pemahaman Tekstual', NOW()),
('s0000000-0000-4000-a000-000000000007', NULL, NULL, NULL, 2, 'LEVEL_COMPLETION', 50, 'Bonus Pencapaian Milestone Tier 2 Penjelajah Konsep', NOW());

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- SELESAI: 7 Akun Siswa Uji Coba Berhasil Dibenihkan.
-- 1. siswa_pretest  (Recall = FALSE, Total XP = 0, Tier 1 Perintis Belajar)
-- 2. siswa_aktif    (Recall = TRUE, Total XP = 1200, Tier 2 Penjelajah Konsep, 2 Submateri Mastered)
-- 3. siswa_master   (Recall = TRUE, Total XP = 7600, Tier 5 Jawara TKA, 16/16 Mastered)
-- 4. siswa_remedial (Recall = TRUE, Total XP = 125, Tier 1, Submateri 1 Level 3 NEEDS_REMEDIAL)
-- 5. siswa_boundary (Recall = TRUE, Total XP = 7175, Tier 5, 15/16 Mastered, 1 In-Progress)
-- 6. siswa_post_exam(Recall = TRUE, Total XP = 8100, Tier 5, 16/16 Mastered, 1 Sesi COMPLETED 93.33%)
-- 7. siswa_tier_mid (Recall = TRUE, Total XP = 2200, Tier 3 Pejuang Penalaran, 4 Mastered)
-- Password Default: siswa123
-- =============================================================================

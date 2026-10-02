-- =============================================================================
-- PEMBENIHAN MASTER KURIKULUM: SUBJECTS, MATERIALS, & SUB_MATERIALS
-- Platform Pembelajaran & Drill-and-Practice Adaptif TKA SMP (Fase D)
-- Arsitektur ERD Versi: 6.0 FINAL
-- Dokumen Acuan: TKA-DOC-09 (Kurikulum & Kompetensi Fase D)
-- File: Migration/002_seed_subjects_materials_sub_materials.sql
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. PEMBENIHAN MATA PELAJARAN (SUBJECTS)
-- -----------------------------------------------------------------------------
INSERT INTO `subjects` (`id`, `code`, `name`, `description`, `is_active`) VALUES
(1, 'MAT', 'Matematika', 'Domain Asesmen Numerasi Fase D SMP/MTs (Bilangan, Aljabar, Geometri & Pengukuran, Data & Peluang)', TRUE),
(2, 'BIN', 'Bahasa Indonesia', 'Domain Asesmen Literasi Membaca Fase D SMP/MTs (Teks Informasi dan Teks Fiksi)', TRUE)
ON DUPLICATE KEY UPDATE 
    `code` = VALUES(`code`), 
    `name` = VALUES(`name`), 
    `description` = VALUES(`description`), 
    `is_active` = VALUES(`is_active`);

-- -----------------------------------------------------------------------------
-- 2. PEMBENIHAN TAKSONOMI 3 LEVEL KOGNITIF TKA (COGNITIVE_LEVELS)
-- -----------------------------------------------------------------------------
INSERT INTO `cognitive_levels` (`id`, `level_number`, `name`, `target_questions`, `passing_score`, `xp_reward`, `description`) VALUES
(1, 1, 'Pemahaman', 10, 9, 50, 'Level 1: Pemahaman (Knowing / Understanding) - Identifikasi fakta, definisi, konsep dasar, representasi simbol, dan perhitungan rutin.'),
(2, 2, 'Pengaplikasian', 10, 9, 75, 'Level 2: Pengaplikasian (Applying) - Penerapan konsep dalam pemecahan masalah kontekstual rutin, permodelan matematis, dan hubungan kausalitas.'),
(3, 3, 'Penalaran', 10, 9, 100, 'Level 3: Penalaran (Reasoning / HOTS) - Analisis kritis multi-kondisi batas, sintesis argumen, evaluasi validitas data, dan pemecahan masalah non-rutin.')
ON DUPLICATE KEY UPDATE 
    `level_number` = VALUES(`level_number`), 
    `name` = VALUES(`name`), 
    `target_questions` = VALUES(`target_questions`), 
    `passing_score` = VALUES(`passing_score`), 
    `xp_reward` = VALUES(`xp_reward`), 
    `description` = VALUES(`description`);

-- -----------------------------------------------------------------------------
-- 3. PEMBENIHAN 6 MATERI POKOK / BAB (MATERIALS)
-- -----------------------------------------------------------------------------
INSERT INTO `materials` (`id`, `subject_id`, `prerequisite_material_id`, `title`, `order_index`, `is_active`) VALUES
-- 4 Bab Pokok Matematika (Numerasi)
(1, 1, NULL, 'Bilangan', 1, TRUE),
(2, 1, 1, 'Aljabar', 2, TRUE),
(3, 1, 2, 'Geometri & Pengukuran', 3, TRUE),
(4, 1, 3, 'Data & Peluang', 4, TRUE),

-- 2 Bab Pokok Bahasa Indonesia (Literasi Membaca)
(5, 2, NULL, 'Teks Informasi', 1, TRUE),
(6, 2, 5, 'Teks Fiksi', 2, TRUE)
ON DUPLICATE KEY UPDATE 
    `subject_id` = VALUES(`subject_id`), 
    `prerequisite_material_id` = VALUES(`prerequisite_material_id`), 
    `title` = VALUES(`title`), 
    `order_index` = VALUES(`order_index`), 
    `is_active` = VALUES(`is_active`);

-- -----------------------------------------------------------------------------
-- 4. PEMBENIHAN 16 SUBMATERI / TOPIK (SUB_MATERIALS)
-- -----------------------------------------------------------------------------
INSERT INTO `sub_materials` (
    `id`, `material_id`, `prerequisite_sub_material_id`, `code`, `title`,
    `level_1_name`, `level_2_name`, `level_3_name`,
    `order_index`, `passing_threshold`, `xp_reward`, `is_active`
) VALUES
-- 10 Submateri Matematika
-- 1. Bilangan
(1, 1, NULL, 'M-01', 'Bilangan Real', 'Pemahaman', 'Pengaplikasian', 'Penalaran', 1, 90.00, 250, TRUE),

-- 2. Aljabar
(2, 2, 1, 'M-02', 'Persamaan & Pertidaksamaan Linier', 'Pemahaman', 'Pengaplikasian', 'Penalaran', 1, 90.00, 250, TRUE),
(3, 2, 2, 'M-03', 'Bentuk Aljabar', 'Pemahaman', 'Pengaplikasian', 'Penalaran', 2, 90.00, 250, TRUE),
(4, 2, 3, 'M-04', 'Relasi dan Fungsi', 'Pemahaman', 'Pengaplikasian', 'Penalaran', 3, 90.00, 250, TRUE),
(5, 2, 4, 'M-05', 'Barisan dan Deret', 'Pemahaman', 'Pengaplikasian', 'Penalaran', 4, 90.00, 250, TRUE),

-- 3. Geometri & Pengukuran
(6, 3, 5, 'M-06', 'Objek Geometri', 'Pemahaman', 'Pengaplikasian', 'Penalaran', 1, 90.00, 250, TRUE),
(7, 3, 6, 'M-07', 'Transformasi Geometri', 'Pemahaman', 'Pengaplikasian', 'Penalaran', 2, 90.00, 250, TRUE),
(8, 3, 7, 'M-08', 'Pengukuran', 'Pemahaman', 'Pengaplikasian', 'Penalaran', 3, 90.00, 250, TRUE),

-- 4. Data & Peluang
(9, 4, 8, 'M-09', 'Data (Statistika)', 'Pemahaman', 'Pengaplikasian', 'Penalaran', 1, 90.00, 250, TRUE),
(10, 4, 9, 'M-10', 'Peluang (Probabilitas)', 'Pemahaman', 'Pengaplikasian', 'Penalaran', 2, 90.00, 250, TRUE),

-- 6 Submateri Bahasa Indonesia
-- 5. Teks Informasi
(11, 5, NULL, 'B-01', 'Pemahaman Tekstual (Teks Informasi)', 'Informasi Relevan', 'Analisis Istilah', 'Susun Kerangka', 1, 90.00, 250, TRUE),
(12, 5, 11, 'B-02', 'Pemahaman Inferensial (Teks Informasi)', 'Penjelasan', 'Prediksi', 'Rumusan Kesimpulan', 2, 90.00, 250, TRUE),
(13, 5, 12, 'B-03', 'Evaluasi dan Apresiasi (Teks Informasi)', 'Kesesuaian', 'Relevansi', 'Responsif', 3, 90.00, 250, TRUE),

-- 6. Teks Fiksi
(14, 6, 13, 'B-04', 'Pemahaman Tekstual (Teks Fiksi)', 'Cari Informasi', 'Analisis Istilah', 'Susun Kerangka', 1, 90.00, 250, TRUE),
(15, 6, 14, 'B-05', 'Pemahaman Inferensial (Teks Fiksi)', 'Penjelasan', 'Prediksi', 'Rumusan Kesimpulan', 2, 90.00, 250, TRUE),
(16, 6, 15, 'B-06', 'Evaluasi dan Apresiasi (Teks Fiksi)', 'Kesesuaian', 'Relevansi', 'Responsif', 3, 90.00, 250, TRUE)
ON DUPLICATE KEY UPDATE 
    `material_id` = VALUES(`material_id`), 
    `prerequisite_sub_material_id` = VALUES(`prerequisite_sub_material_id`), 
    `code` = VALUES(`code`), 
    `title` = VALUES(`title`), 
    `level_1_name` = VALUES(`level_1_name`), 
    `level_2_name` = VALUES(`level_2_name`), 
    `level_3_name` = VALUES(`level_3_name`), 
    `order_index` = VALUES(`order_index`), 
    `passing_threshold` = VALUES(`passing_threshold`), 
    `xp_reward` = VALUES(`xp_reward`), 
    `is_active` = VALUES(`is_active`);

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- SELESAI: Pembenihan master kurikulum (subjects, materials, sub_materials) berhasil.
-- =============================================================================

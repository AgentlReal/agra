-- =============================================================================
-- PEMBENIHAN DATA AWAL (SEED MASTER DATA): KURIKULUM & GAMIFIKASI TKA SMP
-- Arsitektur ERD Versi: 6.0 FINAL
-- Dokumen Acuan: TKA-DOC-06 (Gamifikasi), TKA-DOC-08 (Auth), TKA-DOC-09 (Kurikulum)
-- File: Migration/002_seed_initial_master_data_v6.sql
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. PEMBENIHAN MASTER PRESET AVATAR RAMAH ANAK (12 Preset Resmi - COPPA & UU PDP)
-- -----------------------------------------------------------------------------
INSERT INTO `preset_avatars` (`id`, `name`, `image_url`, `is_active`) VALUES
(1, 'Ksatria Buku', '/assets/avatars/ksatria_buku.svg', TRUE),
(2, 'Penjelajah Galaksi', '/assets/avatars/penjelajah_galaksi.svg', TRUE),
(3, 'Peneliti Cilik', '/assets/avatars/peneliti_cilik.svg', TRUE),
(4, 'Penjelajah Waktu', '/assets/avatars/penjelajah_waktu.svg', TRUE),
(5, 'Ahli Logika', '/assets/avatars/ahli_logika.svg', TRUE),
(6, 'Detektif Bahasa', '/assets/avatars/detektif_bahasa.svg', TRUE),
(7, 'Petualang Rimba', '/assets/avatars/petualang_rimba.svg', TRUE),
(8, 'Sahabat Bintang', '/assets/avatars/sahabat_bintang.svg', TRUE),
(9, 'Penerbang Cita', '/assets/avatars/penerbang_cita.svg', TRUE),
(10, 'Pelukis Mimpi', '/assets/avatars/pelukis_mimpi.svg', TRUE),
(11, 'Nakhoda Samudra', '/assets/avatars/nakhoda_samudra.svg', TRUE),
(12, 'Jawara TKA', '/assets/avatars/jawara_tka.svg', TRUE)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `image_url` = VALUES(`image_url`), `is_active` = VALUES(`is_active`);

-- -----------------------------------------------------------------------------
-- 2. PEMBENIHAN 5 TINGKATAN PENCAPAIAN (MILESTONE TIER - DOC-06)
-- -----------------------------------------------------------------------------
INSERT INTO `milestone_tiers` (`id`, `tier_number`, `title`, `min_xp`, `max_xp`, `badge_icon_url`, `philosophical_meaning`) VALUES
(1, 1, 'Perintis Belajar', 0, 499, '/assets/badges/tier_1_perintis.svg', 'Langkah awal memulai penjelajahan kompetensi dan menuntaskan asesmen pembuka.'),
(2, 2, 'Penjelajah Konsep', 500, 1499, '/assets/badges/tier_2_penjelajah.svg', 'Telah menguasai beberapa submateri awal dan menunjukkan konsistensi belajar.'),
(3, 3, 'Pejuang Penalaran', 1500, 2999, '/assets/badges/tier_3_pejuang.svg', 'Telah menuntaskan sebagian besar submateri pokok dan terbiasa dengan tantangan level 3.'),
(4, 4, 'Pakar Fase D', 3000, 4999, '/assets/badges/tier_4_pakar.svg', 'Mendekati penguasaan penuh seluruh materi kurikulum dan siap menghadapi simulasi ujian.'),
(5, 5, 'Jawara TKA', 5000, NULL, '/assets/badges/tier_5_jawara.svg', 'Telah menuntaskan seluruh submateri dan meraih skor prima pada simulasi ujian TKA.')
ON DUPLICATE KEY UPDATE `tier_number` = VALUES(`tier_number`), `title` = VALUES(`title`), `min_xp` = VALUES(`min_xp`), `max_xp` = VALUES(`max_xp`), `badge_icon_url` = VALUES(`badge_icon_url`), `philosophical_meaning` = VALUES(`philosophical_meaning`);

-- -----------------------------------------------------------------------------
-- 3. PEMBENIHAN MATA PELAJARAN (SUBJECTS - MAT & BIN)
-- -----------------------------------------------------------------------------
INSERT INTO `subjects` (`id`, `code`, `name`, `description`, `is_active`) VALUES
(1, 'MAT', 'Matematika', 'Domain Asesmen Numerasi Fase D SMP/MTs (Bilangan, Aljabar, Geometri & Pengukuran, Data & Peluang)', TRUE),
(2, 'BIN', 'Bahasa Indonesia', 'Domain Asesmen Literasi Membaca Fase D SMP/MTs (Teks Informasi dan Teks Fiksi)', TRUE)
ON DUPLICATE KEY UPDATE `code` = VALUES(`code`), `name` = VALUES(`name`), `description` = VALUES(`description`), `is_active` = VALUES(`is_active`);

-- -----------------------------------------------------------------------------
-- 4. PEMBENIHAN TAKSONOMI 3 LEVEL KOGNITIF TKA (COGNITIVE LEVELS)
-- -----------------------------------------------------------------------------
INSERT INTO `cognitive_levels` (`id`, `level_number`, `name`, `target_questions`, `passing_score`, `xp_reward`, `description`) VALUES
(1, 1, 'Pemahaman', 10, 9, 50, 'Level 1: Pemahaman (Knowing / Understanding) - Identifikasi fakta, definisi, konsep dasar, representasi simbol, dan perhitungan rutin.'),
(2, 2, 'Pengaplikasian', 10, 9, 75, 'Level 2: Pengaplikasian (Applying) - Penerapan konsep dalam pemecahan masalah kontekstual rutin, permodelan matematis, dan hubungan kausalitas.'),
(3, 3, 'Penalaran', 10, 9, 100, 'Level 3: Penalaran (Reasoning / HOTS) - Analisis kritis multi-kondisi batas, sintesis argumen, evaluasi validitas data, dan pemecahan masalah non-rutin.')
ON DUPLICATE KEY UPDATE `level_number` = VALUES(`level_number`), `name` = VALUES(`name`), `target_questions` = VALUES(`target_questions`), `passing_score` = VALUES(`passing_score`), `xp_reward` = VALUES(`xp_reward`), `description` = VALUES(`description`);

-- -----------------------------------------------------------------------------
-- 5. PEMBENIHAN 6 MATERI POKOK (MATERIALS)
-- -----------------------------------------------------------------------------
INSERT INTO `materials` (`id`, `subject_id`, `prerequisite_material_id`, `title`, `order_index`, `is_active`) VALUES
(1, 1, NULL, 'Bilangan', 1, TRUE),
(2, 1, 1, 'Aljabar', 2, TRUE),
(3, 1, 2, 'Geometri & Pengukuran', 3, TRUE),
(4, 1, 3, 'Data & Peluang', 4, TRUE),
(5, 2, NULL, 'Teks Informasi', 1, TRUE),
(6, 2, 5, 'Teks Fiksi', 2, TRUE)
ON DUPLICATE KEY UPDATE `subject_id` = VALUES(`subject_id`), `prerequisite_material_id` = VALUES(`prerequisite_material_id`), `title` = VALUES(`title`), `order_index` = VALUES(`order_index`), `is_active` = VALUES(`is_active`);

-- -----------------------------------------------------------------------------
-- 6. PEMBENIHAN 16 SUBMATERI FASE D (SUB_MATERIALS - 10 MAT & 6 BIN)
-- -----------------------------------------------------------------------------
INSERT INTO `sub_materials` (`id`, `material_id`, `prerequisite_sub_material_id`, `code`, `title`, `order_index`, `passing_threshold`, `xp_reward`, `is_active`) VALUES
-- Matematika: Bilangan
(1, 1, NULL, 'M-01', 'Bilangan Real', 1, 90.00, 250, TRUE),

-- Matematika: Aljabar
(2, 2, 1, 'M-02', 'Persamaan & Pertidaksamaan Linier', 1, 90.00, 250, TRUE),
(3, 2, 2, 'M-03', 'Bentuk Aljabar', 2, 90.00, 250, TRUE),
(4, 2, 3, 'M-04', 'Relasi dan Fungsi', 3, 90.00, 250, TRUE),
(5, 2, 4, 'M-05', 'Barisan dan Deret', 4, 90.00, 250, TRUE),

-- Matematika: Geometri & Pengukuran
(6, 3, 5, 'M-06', 'Objek Geometri', 1, 90.00, 250, TRUE),
(7, 3, 6, 'M-07', 'Transformasi Geometri', 2, 90.00, 250, TRUE),
(8, 3, 7, 'M-08', 'Pengukuran', 3, 90.00, 250, TRUE),

-- Matematika: Data & Peluang
(9, 4, 8, 'M-09', 'Data (Statistika)', 1, 90.00, 250, TRUE),
(10, 4, 9, 'M-10', 'Peluang (Probabilitas)', 2, 90.00, 250, TRUE),

-- Bahasa Indonesia: Teks Informasi
(11, 5, NULL, 'B-01', 'Pemahaman Tekstual (Teks Informasi)', 1, 90.00, 250, TRUE),
(12, 5, 11, 'B-02', 'Pemahaman Inferensial (Teks Informasi)', 2, 90.00, 250, TRUE),
(13, 5, 12, 'B-03', 'Evaluasi dan Apresiasi (Teks Informasi)', 3, 90.00, 250, TRUE),

-- Bahasa Indonesia: Teks Fiksi
(14, 6, 13, 'B-04', 'Pemahaman Tekstual (Teks Fiksi)', 1, 90.00, 250, TRUE),
(15, 6, 14, 'B-05', 'Pemahaman Inferensial (Teks Fiksi)', 2, 90.00, 250, TRUE),
(16, 6, 15, 'B-06', 'Evaluasi dan Apresiasi (Teks Fiksi)', 3, 90.00, 250, TRUE)
ON DUPLICATE KEY UPDATE `material_id` = VALUES(`material_id`), `prerequisite_sub_material_id` = VALUES(`prerequisite_sub_material_id`), `code` = VALUES(`code`), `title` = VALUES(`title`), `order_index` = VALUES(`order_index`), `passing_threshold` = VALUES(`passing_threshold`), `xp_reward` = VALUES(`xp_reward`), `is_active` = VALUES(`is_active`);

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- SELESAI: Pembenihan data master kurikulum & gamifikasi berhasil dilakukan.
-- =============================================================================

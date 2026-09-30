-- =============================================================================
-- ROLLBACK MIGRASI BASIS DATA: PLATFORM PEMBELAJARAN TKA SMP
-- Arsitektur ERD Versi: 6.0 FINAL
-- Dialek Target: MySQL 8.0+ / MariaDB 10.5+
-- File: Migration/001_rollback_bimbel_tka_schema_v6.sql
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- Penghapusan 23 Tabel Relasional dalam Urutan Terbalik Dependensi (Reverse Topological Order)
-- -----------------------------------------------------------------------------

-- 7. Domain Log Jawaban & Opsi Siswa
DROP TABLE IF EXISTS `student_answer_options`;
DROP TABLE IF EXISTS `student_answers`;

-- 6. Domain Mutasi XP, Lembar Soal Sesi & Sesi Pembelajaran
DROP TABLE IF EXISTS `xp_transactions`;
DROP TABLE IF EXISTS `session_questions`;
DROP TABLE IF EXISTS `learning_sessions`;

-- 5. Domain Pemetaan Paket Simulasi & Paket Simulasi
DROP TABLE IF EXISTS `simulation_questions`;
DROP TABLE IF EXISTS `simulations`;

-- 4. Domain Pembahasan, Opsi Soal, Master Bank Soal & Stimuli Wacana
DROP TABLE IF EXISTS `question_explanations`;
DROP TABLE IF EXISTS `question_options`;
DROP TABLE IF EXISTS `student_sub_material_progress`;
DROP TABLE IF EXISTS `question_banks`;
DROP TABLE IF EXISTS `stimuli`;

-- 3. Domain Kurikulum & Taksonomi Asesmen
DROP TABLE IF EXISTS `cognitive_levels`;
DROP TABLE IF EXISTS `sub_materials`;
DROP TABLE IF EXISTS `materials`;
DROP TABLE IF EXISTS `subjects`;

-- 2. Domain Profil Siswa, Gamifikasi & Preset Avatar
DROP TABLE IF EXISTS `user_profiles`;
DROP TABLE IF EXISTS `milestone_tiers`;
DROP TABLE IF EXISTS `preset_avatars`;

-- 1. Domain Autentikasi Better Auth & Akun Pengguna
DROP TABLE IF EXISTS `verifications`;
DROP TABLE IF EXISTS `sessions`;
DROP TABLE IF EXISTS `accounts`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- SELESAI: Seluruh 23 tabel skema V6.0 berhasil di-rollback.
-- =============================================================================

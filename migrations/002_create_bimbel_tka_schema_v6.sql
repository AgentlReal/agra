-- =============================================================================
-- MIGRASI BASIS DATA: PLATFORM PEMBELAJARAN & DRILL-AND-PRACTICE ADAPTIF TKA SMP
-- Arsitektur ERD Versi: 6.0 FINAL (Tanpa CTT, 3 Level Kognitif Murni Kemendikdasmen)
-- Dialek Target: MySQL 8.0+ / MariaDB 10.5+ (Engine InnoDB, utf8mb4_unicode_ci)
-- File: Migration/001_create_bimbel_tka_schema_v6.sql
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =============================================================================
-- 1. DOMAIN: PROFIL SISWA & PRESET AVATAR
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tabel 1: preset_avatars (12 Galeri Avatar Kartun Ramah Anak)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `preset_avatars` (
    `id` INT AUTO_INCREMENT NOT NULL COMMENT 'Identifier preset avatar',
    `name` VARCHAR(100) NOT NULL COMMENT 'Nama karakter avatar (misal: Ksatria Buku, Penjelajah Galaksi)',
    `image_url` VARCHAR(255) NOT NULL COMMENT 'URL aset visual kartun ramah anak (12 Preset Resmi)',
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Status ketersediaan avatar di galeri preset',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='12 Preset avatar kurasi aman COPPA dan UU PDP';

-- -----------------------------------------------------------------------------
-- Tabel 2: milestone_tiers (5 Tingkatan Capaian Prestasi Formatif)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `milestone_tiers` (
    `id` INT AUTO_INCREMENT NOT NULL COMMENT 'Identifier milestone tier',
    `tier_number` INT NOT NULL COMMENT 'Tingkatan tier resmi: 1 s.d. 5',
    `title` VARCHAR(50) NOT NULL COMMENT 'Gelar prestasi siswa: Perintis, Penjelajah, Pejuang, Pakar, Jawara',
    `min_xp` INT NOT NULL DEFAULT 0 COMMENT 'Batas bawah akumulasi XP: 0, 500, 1500, 3000, 5000',
    `max_xp` INT NULL COMMENT 'Batas atas akumulasi XP: 499, 1499, 2999, 4999, NULL untuk tier puncak',
    `badge_icon_url` VARCHAR(255) NULL COMMENT 'URL aset visual medali milestone tier',
    `philosophical_meaning` TEXT NULL COMMENT 'Makna filosofis capaian belajar (DOC-06)',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_milestone_tier_number` (`tier_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Master 5 tingkatan milestone tier non-kompetitif';

-- -----------------------------------------------------------------------------
-- Tabel 3: user_profiles (Profil Pedagogis Siswa)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_profiles` (
    `id` BIGINT AUTO_INCREMENT NOT NULL COMMENT 'Identifier unik profil siswa',
    `user_id` VARCHAR(36) NOT NULL COMMENT 'Relasi 1-to-1 unik ke users.id (khusus role SISWA)',
    `preset_avatar_id` INT NULL COMMENT 'Relasi ke 12 galeri avatar aman (tanpa upload mandiri)',
    `current_milestone_tier_id` INT NOT NULL DEFAULT 1 COMMENT 'Relasi ke 5 milestone tier saat ini',
    `total_xp` BIGINT NOT NULL DEFAULT 0 COMMENT 'Total akumulasi poin XP siswa (murni capaian formatif)',
    `is_recall_passed` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Status kelulusan asesmen pembuka Recall Kemampuanmu',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Waktu pembuatan profil siswa',
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Waktu pembaruan profil',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_up_user_id` (`user_id`),
    KEY `idx_up_preset_avatar` (`preset_avatar_id`),
    KEY `idx_up_milestone_tier` (`current_milestone_tier_id`),
    CONSTRAINT `fk_up_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_up_preset_avatar` FOREIGN KEY (`preset_avatar_id`) REFERENCES `preset_avatars` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_up_milestone_tier` FOREIGN KEY (`current_milestone_tier_id`) REFERENCES `milestone_tiers` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Profil pedagogis dan gamifikasi siswa';


-- =============================================================================
-- 2. DOMAIN: STRUKTUR KURIKULUM & TAKSONOMI ASESMEN (FASE D)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tabel 4: subjects (Mata Pelajaran: Matematika & Bahasa Indonesia)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `subjects` (
    `id` INT AUTO_INCREMENT NOT NULL COMMENT 'Identifier mata pelajaran',
    `code` VARCHAR(10) NOT NULL COMMENT 'Kode mata pelajaran resmi: MAT atau BIN',
    `name` VARCHAR(50) NOT NULL COMMENT 'Nama mata pelajaran: Matematika / Bahasa Indonesia',
    `description` TEXT NULL COMMENT 'Deskripsi cakupan asesmen kurikulum',
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Status aktif kurikulum',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_subjects_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Master mata pelajaran asesmen TKA Fase D';

-- -----------------------------------------------------------------------------
-- Tabel 5: materials (Materi Pokok / Bab Pembelajaran)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `materials` (
    `id` INT AUTO_INCREMENT NOT NULL COMMENT 'Identifier materi pokok atau bab',
    `subject_id` INT NOT NULL COMMENT 'Relasi ke mata pelajaran',
    `prerequisite_material_id` INT NULL COMMENT 'Materi prasyarat untuk unlock sekuensial',
    `title` VARCHAR(100) NOT NULL COMMENT 'Judul bab: Bilangan, Aljabar, Geometri, Data, Teks Informasi, Teks Sastra',
    `order_index` INT NOT NULL DEFAULT 1 COMMENT 'Urutan pembelajaran materi',
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Status aktif materi',
    PRIMARY KEY (`id`),
    KEY `idx_materials_subject` (`subject_id`),
    KEY `idx_materials_prerequisite` (`prerequisite_material_id`),
    CONSTRAINT `fk_materials_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_materials_prerequisite` FOREIGN KEY (`prerequisite_material_id`) REFERENCES `materials` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Materi pokok pembelajaran Fase D';

-- -----------------------------------------------------------------------------
-- Tabel 6: sub_materials (16 Submateri / Topik Pembelajaran Fase D)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `sub_materials` (
    `id` INT AUTO_INCREMENT NOT NULL COMMENT 'Identifier submateri atau topik (16 Submateri Fase D)',
    `material_id` INT NOT NULL COMMENT 'Relasi ke materi pokok induk',
    `prerequisite_sub_material_id` INT NULL COMMENT 'Submateri prasyarat untuk unlock sekuensial mutlak',
    `code` VARCHAR(20) NOT NULL COMMENT 'Kode submateri resmi: M-01 s.d. M-10, B-01 s.d. B-06',
    `title` VARCHAR(100) NOT NULL COMMENT 'Judul topik submateri',
    `order_index` INT NOT NULL DEFAULT 1 COMMENT 'Urutan belajar dalam materi pokok',
    `passing_threshold` DECIMAL(5,2) NOT NULL DEFAULT 90.00 COMMENT 'Ambang batas ketuntasan submateri: 90.00%',
    `xp_reward` INT NOT NULL DEFAULT 250 COMMENT 'Bonus puncak XP saat Mastered (+250 XP)',
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Status ketersediaan submateri',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_sm_code` (`code`),
    KEY `idx_sm_material` (`material_id`),
    KEY `idx_sm_prerequisite` (`prerequisite_sub_material_id`),
    CONSTRAINT `fk_sm_material` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_sm_prerequisite` FOREIGN KEY (`prerequisite_sub_material_id`) REFERENCES `sub_materials` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='16 Topik submateri Fase D dengan ambang kelulusan 90%';

-- -----------------------------------------------------------------------------
-- Tabel 7: cognitive_levels (Master 3 Tingkatan Berpikir Kognitif TKA)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `cognitive_levels` (
    `id` INT AUTO_INCREMENT NOT NULL COMMENT 'Identifier level kognitif',
    `level_number` INT NOT NULL COMMENT 'Level 1: Pemahaman, Level 2: Pengaplikasian, Level 3: Penalaran',
    `name` VARCHAR(50) NOT NULL COMMENT 'Nama tingkatan berpikir kognitif: Pemahaman, Pengaplikasian, Penalaran',
    `target_questions` INT NOT NULL DEFAULT 10 COMMENT 'Jumlah butir soal standar per sesi: 10 butir',
    `passing_score` DECIMAL(4,2) NOT NULL DEFAULT 9.00 COMMENT 'Ambang batas minimal akumulasi skor: 9.00 dari 10 butir (90%)',
    `xp_reward` INT NOT NULL COMMENT 'Nominal reward XP kelulusan level: 50, 75, atau 100 XP',
    `description` TEXT NULL COMMENT 'Definisi operasional dan kata kerja operasional (KKO)',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_cog_level_number` (`level_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Taksonomi 3 level kognitif TKA Kemendikdasmen';


-- =============================================================================
-- 3. DOMAIN: BANK SOAL & WACANA BERSAMA (STIMULI)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tabel 8: stimuli (Teks Wacana / Bacaan Bersama untuk Soal Berangkai)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `stimuli` (
    `id` BIGINT AUTO_INCREMENT NOT NULL COMMENT 'Identifier teks wacana atau stimulus bersama',
    `subject_id` INT NOT NULL COMMENT 'Relasi ke mata pelajaran',
    `title` VARCHAR(255) NOT NULL COMMENT 'Judul wacana stimulus bacaan atau konteks wacana',
    `stimulus_text` TEXT NOT NULL COMMENT 'Teks lengkap wacana bacaan atau narasi informasi',
    `stimulus_image_url` VARCHAR(255) NULL COMMENT 'Tautan aset gambar/diagram pendukung wacana jika ada',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Waktu penambahan stimulus wacana',
    PRIMARY KEY (`id`),
    KEY `idx_stimuli_subject` (`subject_id`),
    CONSTRAINT `fk_stimuli_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Wacana bacaan bersama untuk soal berangkai literasi';

-- -----------------------------------------------------------------------------
-- Tabel 9: question_banks (Master Butir Soal 3 Kategori Terisolasi)
-- Catatan V6.0: Bersih dari metrik CTT empiris (pure read-heavy static content).
-- sub_material_id & cognitive_level_id bernilai NULL khusus butir Bank Recall.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `question_banks` (
    `id` BIGINT AUTO_INCREMENT NOT NULL COMMENT 'Identifier butir soal',
    `subject_id` INT NOT NULL COMMENT 'Relasi ke mata pelajaran',
    `sub_material_id` INT NULL COMMENT 'Relasi ke submateri (NULL jika butir soal Bank Recall fondasi SD)',
    `cognitive_level_id` INT NULL COMMENT 'Relasi ke level kognitif (1: Pemahaman, 2: Aplikasi, 3: Penalaran; NULL jika Bank Recall)',
    `stimulus_id` BIGINT NULL COMMENT 'Relasi ke wacana bersama jika ada (Soal Berurutan Literasi)',
    `bank_type` ENUM('RECALL', 'LEVEL_EXERCISE', 'SIMULATION') NOT NULL COMMENT 'Pemisahan 3 Bank Terisolasi: RECALL, LEVEL_EXERCISE, SIMULATION',
    `question_format` ENUM('SINGLE_CHOICE', 'COMPLEX_CHOICE') NOT NULL DEFAULT 'SINGLE_CHOICE' COMMENT 'Format butir soal: 4 opsi tunggal atau majemuk',
    `question_text` TEXT NOT NULL COMMENT 'Teks pertanyaan atau formula matematika LaTeX',
    `stimulus_image_url` VARCHAR(255) NULL COMMENT 'Tautan aset stimulus visual individual jika ada',
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Status keaktifan butir soal (sakelar CMS kurikulum)',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Waktu pembuatan butir soal',
    PRIMARY KEY (`id`),
    KEY `idx_qb_subject` (`subject_id`),
    KEY `idx_qb_sub_material` (`sub_material_id`),
    KEY `idx_qb_cognitive_level` (`cognitive_level_id`),
    KEY `idx_qb_stimulus` (`stimulus_id`),
    KEY `idx_qb_fetch` (`bank_type`, `sub_material_id`, `cognitive_level_id`, `is_active`),
    CONSTRAINT `fk_qb_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_qb_sub_material` FOREIGN KEY (`sub_material_id`) REFERENCES `sub_materials` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_qb_cognitive_level` FOREIGN KEY (`cognitive_level_id`) REFERENCES `cognitive_levels` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_qb_stimulus` FOREIGN KEY (`stimulus_id`) REFERENCES `stimuli` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Master bank soal 3 kategori terisolasi (V6.0 Tanpa CTT)';

-- -----------------------------------------------------------------------------
-- Tabel 10: question_options (Pilihan Opsi Jawaban Butir Soal)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `question_options` (
    `id` BIGINT AUTO_INCREMENT NOT NULL COMMENT 'Identifier pilihan opsi jawaban',
    `question_id` BIGINT NOT NULL COMMENT 'Relasi ke butir soal induk',
    `option_label` VARCHAR(5) NOT NULL COMMENT 'Label posisi asli: A, B, C, atau D (maksimal tepat 4 opsi)',
    `option_text` TEXT NOT NULL COMMENT 'Konten teks atau formula pilihan jawaban',
    `is_correct` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Indikator kunci jawaban benar',
    PRIMARY KEY (`id`),
    KEY `idx_qo_question` (`question_id`),
    CONSTRAINT `fk_qo_question` FOREIGN KEY (`question_id`) REFERENCES `question_banks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Opsi jawaban A-D dengan indikator kunci benar';

-- -----------------------------------------------------------------------------
-- Tabel 11: question_explanations (Pembahasan Logis Pasca-Sesi 1-to-1)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `question_explanations` (
    `id` BIGINT AUTO_INCREMENT NOT NULL COMMENT 'Identifier pembahasan pasca-sesi',
    `question_id` BIGINT NOT NULL COMMENT 'Relasi 1-to-1 unik ke butir soal master',
    `explanation_text` TEXT NOT NULL COMMENT 'Pembahasan logis komprehensif pasca-sesi (F04, NFR02)',
    `reasoning_guide` TEXT NULL COMMENT 'Panduan alur nalar untuk safe-to-fail feedback',
    `reference_url` VARCHAR(255) NULL COMMENT 'Tautan pustaka kurikulum resmi Kemendikdasmen',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_qe_question_id` (`question_id`),
    CONSTRAINT `fk_qe_question` FOREIGN KEY (`question_id`) REFERENCES `question_banks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Pembahasan jawaban dan alur nalar safe-to-fail';


-- =============================================================================
-- 4. DOMAIN: CAPSTONE SIMULASI UJIAN TKA (75 MENIT KETAT)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tabel 12: simulations (Paket Ujian Simulasi CBT 75 Menit Baku)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `simulations` (
    `id` INT AUTO_INCREMENT NOT NULL COMMENT 'Identifier paket simulasi TKA',
    `subject_id` INT NOT NULL COMMENT 'Relasi ke mata pelajaran (terbuka independen per mapel)',
    `title` VARCHAR(100) NOT NULL COMMENT 'Nama paket simulasi (misal: Simulasi CBT Paket A)',
    `package_code` VARCHAR(50) NOT NULL COMMENT 'Kode paket variasi: SET_A, SET_B (UCS-11)',
    `duration_minutes` INT NOT NULL DEFAULT 75 COMMENT 'Alokasi durasi ujian: baku 75 menit (DOC-07)',
    `total_questions` INT NOT NULL DEFAULT 30 COMMENT 'Jumlah butir soal simulasi: baku 30 butir',
    `passing_score` DECIMAL(5,2) NOT NULL DEFAULT 90.00 COMMENT 'Ambang batas skor kelulusan simulasi: 90.00 (27 benar)',
    `xp_reward` INT NOT NULL DEFAULT 500 COMMENT 'Reward bonus XP kelulusan prima simulasi: +500 XP (DOC-06)',
    `status` ENUM('DRAFT', 'ACTIVE', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT' COMMENT 'Status paket kurikulum: DRAFT, ACTIVE, ARCHIVED',
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Status ketersediaan paket bagi siswa',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Waktu rilis simulasi oleh Tim Kurikulum',
    PRIMARY KEY (`id`),
    KEY `idx_sim_subject` (`subject_id`),
    CONSTRAINT `fk_sim_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Paket simulasi CBT 75 menit (30 butir soal seimbang)';

-- -----------------------------------------------------------------------------
-- Tabel 13: simulation_questions (Pemetaan Butir Soal ke Paket Simulasi)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `simulation_questions` (
    `id` BIGINT AUTO_INCREMENT NOT NULL COMMENT 'Identifier butir dalam paket simulasi',
    `simulation_id` INT NOT NULL COMMENT 'Relasi ke paket simulasi induk',
    `question_id` BIGINT NOT NULL COMMENT 'Relasi ke butir soal di Bank Simulasi',
    `question_order` INT NOT NULL COMMENT 'Urutan nomor soal acuan dalam paket simulasi',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_sim_question` (`simulation_id`, `question_id`),
    UNIQUE KEY `uk_sim_order` (`simulation_id`, `question_order`),
    KEY `idx_sq_question` (`question_id`),
    CONSTRAINT `fk_sq_simulation` FOREIGN KEY (`simulation_id`) REFERENCES `simulations` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_sq_question` FOREIGN KEY (`question_id`) REFERENCES `question_banks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Daftar 30 butir soal terstruktur dalam paket simulasi';


-- =============================================================================
-- 5. DOMAIN: SESI PEMBELAJARAN, LOG JAWABAN & EVALUASI ADAPTIF
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tabel 14: learning_sessions (Rekam Jejak Sesi Pengerjaan Siswa)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `learning_sessions` (
    `id` BIGINT AUTO_INCREMENT NOT NULL COMMENT 'Identifier unik sesi pengerjaan',
    `user_id` VARCHAR(36) NOT NULL COMMENT 'Relasi ke users.id siswa pengerja',
    `subject_id` INT NULL COMMENT 'Relasi ke mapel (NULL khusus sesi terpadu Recall, terisi untuk Latihan & Simulasi)',
    `session_type` ENUM('RECALL', 'LEVEL_EXERCISE', 'SIMULATION') NOT NULL COMMENT 'Tipe sesi evaluasi adaptif',
    `sub_material_id` INT NULL COMMENT 'Relasi ke submateri (khusus LEVEL_EXERCISE; NULL saat RECALL & SIMULATION)',
    `cognitive_level_id` INT NULL COMMENT 'Relasi ke level kognitif aktif (khusus LEVEL_EXERCISE; NULL saat RECALL & SIMULATION)',
    `simulation_id` INT NULL COMMENT 'Relasi ke paket simulasi (hanya terisi saat session_type = SIMULATION)',
    `attempt_number` INT NOT NULL DEFAULT 1 COMMENT 'Nomor percobaan untuk melacak frekuensi remedial',
    `is_remedial` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Penanda apakah sesi ini merupakan sesi remedial teracak',
    `status` ENUM('IN_PROGRESS', 'PAUSED', 'COMPLETED', 'ABANDONED') NOT NULL DEFAULT 'IN_PROGRESS' COMMENT 'Status siklus hidup sesi',
    `submission_type` ENUM('MANUAL', 'TIMEOUT') NULL COMMENT 'Metode submit jawaban: MANUAL (klik selesai) atau TIMEOUT (waktu 75m habis)',
    `total_questions` INT NOT NULL DEFAULT 10 COMMENT 'Jumlah butir soal dalam sesi (10 level / 30 recall / 30 simulasi)',
    `correct_answers` DECIMAL(4,2) NOT NULL DEFAULT 0.00 COMMENT 'Akumulasi poin benar dalam sesi (mendukung nilai parsial 0.50)',
    `score` DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Skor persentase akhir sesi evaluasi (0.00 - 100.00)',
    `is_passed` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Status pemenuhan syarat kelulusan sesi (>=90%)',
    `remaining_time_seconds` INT NULL COMMENT 'Sisa waktu hitung mundur server-side untuk simulasi 75m (NULL jika untimed)',
    `current_question_order` INT NOT NULL DEFAULT 1 COMMENT 'Nomor urut soal aktif untuk ketahanan sesi reconnect',
    `start_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Waktu mulai sesi pengerjaan',
    `resumed_at` TIMESTAMP NULL COMMENT 'Waktu sesi dilanjutkan kembali pasca-reconnect',
    `end_time` TIMESTAMP NULL COMMENT 'Waktu penyelesaian sesi pengerjaan',
    PRIMARY KEY (`id`),
    KEY `idx_ls_user` (`user_id`),
    KEY `idx_ls_subject` (`subject_id`),
    KEY `idx_ls_sub_material` (`sub_material_id`),
    KEY `idx_ls_cognitive_level` (`cognitive_level_id`),
    KEY `idx_ls_simulation` (`simulation_id`),
    KEY `idx_ls_lookup` (`user_id`, `session_type`, `status`),
    CONSTRAINT `fk_ls_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_ls_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_ls_sub_material` FOREIGN KEY (`sub_material_id`) REFERENCES `sub_materials` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_ls_cognitive_level` FOREIGN KEY (`cognitive_level_id`) REFERENCES `cognitive_levels` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_ls_simulation` FOREIGN KEY (`simulation_id`) REFERENCES `simulations` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Rekam jejak pengerjaan sesi latihan, remedial, recall, dan simulasi';

-- -----------------------------------------------------------------------------
-- Tabel 15: session_questions (Lembar Butir Soal Teracak dalam Sesi)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `session_questions` (
    `id` BIGINT AUTO_INCREMENT NOT NULL COMMENT 'Identifier lembar soal dalam sesi',
    `session_id` BIGINT NOT NULL COMMENT 'Relasi ke sesi pengerjaan induk',
    `question_id` BIGINT NOT NULL COMMENT 'Relasi ke butir soal master',
    `question_order` INT NOT NULL COMMENT 'Nomor urut soal teracak pada sesi terkait (Unseen / LRU)',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_sessq_order` (`session_id`, `question_order`),
    KEY `idx_sessq_session` (`session_id`),
    KEY `idx_sessq_question` (`question_id`),
    CONSTRAINT `fk_sessq_session` FOREIGN KEY (`session_id`) REFERENCES `learning_sessions` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_sessq_question` FOREIGN KEY (`question_id`) REFERENCES `question_banks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Daftar urutan butir soal individual per sesi pengerjaan';

-- -----------------------------------------------------------------------------
-- Tabel 16: student_answers (Log Jawaban Siswa per Butir Soal)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `student_answers` (
    `id` BIGINT AUTO_INCREMENT NOT NULL COMMENT 'Identifier log pengerjaan butir soal',
    `session_question_id` BIGINT NOT NULL COMMENT 'Relasi 1-to-1 unik ke lembar butir soal sesi',
    `score` DECIMAL(3,2) NOT NULL DEFAULT 0.00 COMMENT 'Poin butir: 0.00 (salah), 0.50 (parsial 1 benar 1 salah), 1.00 (2 benar utuh)',
    `is_correct` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Indikator kebenaran penuh (TRUE jika score = 1.00)',
    `is_flagged` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Penanda ragu-ragu butir soal di antarmuka CBT',
    `is_skipped` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Penanda apakah butir soal dilewati sementara',
    `time_spent_seconds` INT NOT NULL DEFAULT 0 COMMENT 'Durasi waktu pengerjaan butir soal dalam detik',
    `answered_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Waktu pengiriman jawaban siswa',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_sa_session_question` (`session_question_id`),
    CONSTRAINT `fk_sa_session_question` FOREIGN KEY (`session_question_id`) REFERENCES `session_questions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Log audit jawaban dan evaluasi ketepatan per soal';

-- -----------------------------------------------------------------------------
-- Tabel 17: student_answer_options (Pilihan Opsi Siswa - Single / Multi Choice PGK)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `student_answer_options` (
    `id` BIGINT AUTO_INCREMENT NOT NULL COMMENT 'Identifier opsi yang dipilih siswa',
    `student_answer_id` BIGINT NOT NULL COMMENT 'Relasi ke log jawaban butir soal',
    `selected_option_id` BIGINT NOT NULL COMMENT 'Relasi ke opsi jawaban (mendukung MCMA multi-opsi)',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_sao_answer_option` (`student_answer_id`, `selected_option_id`),
    KEY `idx_sao_student_answer` (`student_answer_id`),
    KEY `idx_sao_selected_option` (`selected_option_id`),
    CONSTRAINT `fk_sao_student_answer` FOREIGN KEY (`student_answer_id`) REFERENCES `student_answers` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_sao_option` FOREIGN KEY (`selected_option_id`) REFERENCES `question_options` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Opsi yang dipilih siswa (Mendukung PG biasa dan PGK multi-opsi)';


-- =============================================================================
-- 6. DOMAIN: PROGRES KETUNTASAN & GAMIFIKASI NON-KOMPETITIF
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tabel 18: student_sub_material_progress (Dual-Condition Mastery Tracking)
-- Kriteria Tuntas: Lulus 3 Level Kognitif DAN Total Akumulasi Benar >= 27/30 (90%)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `student_sub_material_progress` (
    `id` BIGINT AUTO_INCREMENT NOT NULL COMMENT 'Identifier rekam progres submateri',
    `user_id` VARCHAR(36) NOT NULL COMMENT 'Relasi ke users.id akun siswa',
    `sub_material_id` INT NOT NULL COMMENT 'Relasi ke submateri terkait (16 submateri Fase D)',
    `level_1_status` ENUM('LOCKED', 'AVAILABLE', 'COMPLETED', 'NEEDS_REMEDIAL') NOT NULL DEFAULT 'AVAILABLE' COMMENT 'Status Level 1',
    `level_2_status` ENUM('LOCKED', 'AVAILABLE', 'COMPLETED', 'NEEDS_REMEDIAL') NOT NULL DEFAULT 'LOCKED' COMMENT 'Status Level 2',
    `level_3_status` ENUM('LOCKED', 'AVAILABLE', 'COMPLETED', 'NEEDS_REMEDIAL') NOT NULL DEFAULT 'LOCKED' COMMENT 'Status Level 3',
    `level_1_score` DECIMAL(4,2) NOT NULL DEFAULT 0.00 COMMENT 'Skor terbaik benar Level 1 (syarat minimal 9.00 dari 10)',
    `level_2_score` DECIMAL(4,2) NOT NULL DEFAULT 0.00 COMMENT 'Skor terbaik benar Level 2 (syarat minimal 9.00 dari 10)',
    `level_3_score` DECIMAL(4,2) NOT NULL DEFAULT 0.00 COMMENT 'Skor terbaik benar Level 3 (syarat minimal 9.00 dari 10)',
    `total_cumulative_score` DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Akumulasi skor submateri (syarat minimal 27 dari 30)',
    `is_mastered` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Dual-Condition Mastery: 3 Level Lulus DAN Total Benar >= 27',
    `is_xp_awarded` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Anti-Farming: Flag bonus +250 XP hanya diberikan 1x seumur hidup',
    `progress_state` ENUM('LOCKED', 'IN_PROGRESS', 'MASTERED') NOT NULL DEFAULT 'IN_PROGRESS' COMMENT 'Status tampilan dasbor submateri',
    `mastered_at` TIMESTAMP NULL COMMENT 'Waktu resmi pemenuhan Dual-Condition Mastery',
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Waktu pembaruan progres',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_ssmp_user_sub_material` (`user_id`, `sub_material_id`),
    KEY `idx_ssmp_user` (`user_id`),
    KEY `idx_ssmp_sub_material` (`sub_material_id`),
    CONSTRAINT `fk_ssmp_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_ssmp_sub_material` FOREIGN KEY (`sub_material_id`) REFERENCES `sub_materials` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Agregat penguasaan submateri dengan Dual-Condition Mastery';

-- -----------------------------------------------------------------------------
-- Tabel 19: xp_transactions (Buku Besar Mutasi XP Formatif & Anti-Farming)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `xp_transactions` (
    `id` BIGINT AUTO_INCREMENT NOT NULL COMMENT 'Identifier mutasi transaksi XP',
    `user_id` VARCHAR(36) NOT NULL COMMENT 'Relasi ke users.id akun siswa penerima XP',
    `sub_material_id` INT NULL COMMENT 'Relasi langsung jika reward ketuntasan submateri (+250 XP)',
    `simulation_id` INT NULL COMMENT 'Relasi langsung jika reward simulasi prima (+500 XP)',
    `session_id` BIGINT NULL COMMENT 'Relasi langsung jika reward kelulusan level (+50, +75, +100 XP)',
    `milestone_tier_id` INT NULL COMMENT 'Relasi ke milestone tier yang dicapai jika ada kenaikan tier',
    `transaction_type` ENUM('LEVEL_COMPLETION', 'SUB_MATERIAL_MASTERY', 'SIMULATION_COMPLETION') NOT NULL COMMENT 'Tipe transaksi perolehan XP',
    `xp_amount` INT NOT NULL COMMENT 'Nominal mutasi penambahan XP baku: 50, 75, 100, 250, atau 500',
    `description` VARCHAR(255) NOT NULL COMMENT 'Keterangan mutasi poin (Single Source of Truth mutasi XP)',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Waktu pencatatan mutasi transaksi',
    PRIMARY KEY (`id`),
    KEY `idx_xpt_user` (`user_id`),
    KEY `idx_xpt_sub_material` (`sub_material_id`),
    KEY `idx_xpt_simulation` (`simulation_id`),
    KEY `idx_xpt_session` (`session_id`),
    KEY `idx_xpt_milestone_tier` (`milestone_tier_id`),
    KEY `idx_xpt_type` (`transaction_type`),
    CONSTRAINT `fk_xpt_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_xpt_sub_material` FOREIGN KEY (`sub_material_id`) REFERENCES `sub_materials` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_xpt_simulation` FOREIGN KEY (`simulation_id`) REFERENCES `simulations` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_xpt_session` FOREIGN KEY (`session_id`) REFERENCES `learning_sessions` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_xpt_milestone_tier` FOREIGN KEY (`milestone_tier_id`) REFERENCES `milestone_tiers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Buku besar mutasi penambahan poin XP siswa (audit log formatif)';

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- SELESAI: Skema basis data 19 tabel relasional berhasil dibentuk.
-- =============================================================================

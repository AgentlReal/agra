import mysql, { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config();

async function seedTestingPreconditions() {
  console.log("===============================================================================");
  console.log("          AGRA QA DATABASE PRECONDITION & SEEDING SCRIPT                      ");
  console.log("===============================================================================\n");

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "agra",
    multipleStatements: true,
  });

  try {
    console.log("1. Memeriksa & Mengaktifkan User Siswa dan Admin...");
    const studentUserId = "5LQISz4rdvDD6LRel5ClL9zk7ku2GKAS"; // ID siswabaru2026
    const adminUserId = "admin_kurikulum_001"; // ID tim_kurikulum
    const pwdHash = "efc22380734729ae0974525d9d31f740:0b85624760cd9e79fe157a84bdad9d5726c80f8134f6a84626e2a1145e6f7a82cb1d932ad7398a3527b4ea4a1494b6dee1add06414547edc26c531e219dbd6ad"; // Belajar1!

    // Pastikan user siswa ada
    await conn.query(`
      INSERT INTO users (id, name, email, emailVerified, image, createdAt, updatedAt, role, username)
      VALUES (?, 'Siswa Baru', 'siswa_baru@example.com', 1, NULL, NOW(), NOW(), 'SISWA', 'siswabaru2026')
      ON DUPLICATE KEY UPDATE role = 'SISWA', name = 'Siswa Baru'
    `, [studentUserId]);

    // Pastikan password siswa Belajar1!
    await conn.query(`
      INSERT INTO account (id, accountId, providerId, userId, password, createdAt, updatedAt)
      VALUES (?, ?, 'credential', ?, ?, NOW(), NOW())
      ON DUPLICATE KEY UPDATE password = VALUES(password)
    `, ["account_student_001", studentUserId, studentUserId, pwdHash]);

    // Pastikan admin tim_kurikulum ada
    await conn.query(`
      INSERT INTO users (id, name, email, emailVerified, image, createdAt, updatedAt, role, username)
      VALUES (?, 'Tim Kurikulum', 'tim_kurikulum@example.com', 1, NULL, NOW(), NOW(), 'TIM_KURIKULUM', 'tim_kurikulum')
      ON DUPLICATE KEY UPDATE role = 'TIM_KURIKULUM', name = 'Tim Kurikulum'
    `, [adminUserId]);

    await conn.query(`
      INSERT INTO account (id, accountId, providerId, userId, password, createdAt, updatedAt)
      VALUES (?, ?, 'credential', ?, ?, NOW(), NOW())
      ON DUPLICATE KEY UPDATE password = VALUES(password)
    `, ["account_admin_001", adminUserId, adminUserId, pwdHash]);

    console.log("   ✓ User 'siswabaru2026' (SISWA) dan 'tim_kurikulum' (TIM_KURIKULUM) siap.");

    // 2. User Profile Precondition (Fase D Grade 7, is_recall_passed = 1, XP = 1500)
    console.log("2. Menyiapkan User Profile Siswa (is_recall_passed = TRUE)...");
    await conn.query(`
      INSERT INTO user_profiles (user_id, grade, preset_avatar_id, current_milestone_tier_id, total_xp, is_recall_passed)
      VALUES (?, 7, 1, 3, 1500, TRUE)
      ON DUPLICATE KEY UPDATE 
        is_recall_passed = TRUE, 
        grade = 7, 
        total_xp = 1500, 
        preset_avatar_id = 1,
        current_milestone_tier_id = 3
    `, [studentUserId]);
    console.log("   ✓ Profil siswa diaktifkan dengan status kelulusan Recall = TRUE.");

    // 3. Submaterial Progress (Semua 16 Submateri MASTERED agar lolos syarat Simulasi CBT)
    console.log("3. Menyiapkan Ketuntasan Materi Siswa (Seluruh Submateri MASTERED)...");
    for (let smId = 1; smId <= 16; smId++) {
      await conn.query(`
        INSERT INTO student_sub_material_progress 
          (user_id, sub_material_id, level_1_status, level_2_status, level_3_status, level_1_score, level_2_score, level_3_score, total_cumulative_score, is_mastered, progress_state, mastered_at)
        VALUES 
          (?, ?, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10, 10, 10, 30.00, TRUE, 'MASTERED', NOW())
        ON DUPLICATE KEY UPDATE
          level_1_status = 'COMPLETED',
          level_2_status = 'COMPLETED',
          level_3_status = 'COMPLETED',
          is_mastered = TRUE,
          progress_state = 'MASTERED'
      `, [studentUserId, smId]);
    }
    console.log("   ✓ 16 Submateri (10 MAT + 6 BIN) berstatus MASTERED (Syarat Simulasi Terpenuhi).");

    // 4. Seeding Bank Soal (30 Recall, 20 Latihan, 30 Simulasi)
    console.log("4. Memeriksa & Mengisi Bank Soal (Recall, Latihan Level, Simulasi)...");
    
    // Fungsi helper insert question
    async function insertQuestion(
      subjectId: number,
      subMaterialId: number | null,
      cognitiveLevelId: number | null,
      bankType: "RECALL" | "LEVEL_EXERCISE" | "SIMULATION",
      qText: string,
      explanationText: string
    ): Promise<number> {
      const [res] = await conn.execute<ResultSetHeader>(`
        INSERT INTO question_banks 
          (subject_id, sub_material_id, cognitive_level_id, bank_type, question_format, question_text, is_active)
        VALUES (?, ?, ?, ?, 'SINGLE_CHOICE', ?, TRUE)
      `, [subjectId, subMaterialId, cognitiveLevelId, bankType, qText]);
      const qId = res.insertId;

      // Insert 4 opsi jawaban (A, B, C, D)
      await conn.execute(`
        INSERT INTO question_options (question_id, option_label, option_text, is_correct)
        VALUES 
          (?, 'A', 'Pilihan A (Benar)', TRUE),
          (?, 'B', 'Pilihan B (Salah)', FALSE),
          (?, 'C', 'Pilihan C (Salah)', FALSE),
          (?, 'D', 'Pilihan D (Salah)', FALSE)
      `, [qId, qId, qId, qId]);

      // Insert pembahasan
      await conn.execute(`
        INSERT INTO question_explanations (question_id, explanation_text, reasoning_guide)
        VALUES (?, ?, 'Alur nalar logika deduktif Fase D.')
      `, [qId, explanationText]);

      return qId;
    }

    // A. 15 Soal Recall Matematika (subject_id = 1)
    const [matRecallRows] = await conn.query<RowDataPacket[]>(
      "SELECT id FROM question_banks WHERE bank_type = 'RECALL' AND subject_id = 1"
    );
    const neededMatRecall = 15 - matRecallRows.length;
    for (let i = 0; i < neededMatRecall; i++) {
      await insertQuestion(
        1, null, null, "RECALL",
        `[Recall MAT #${matRecallRows.length + i + 1}] Berapakah nilai dari operasi dasar hitung aljabar ${i + 5} x 2?`,
        "Perhitungan dilakukan dengan perkalian skalar dasar aritmetika."
      );
    }

    // B. 15 Soal Recall Bahasa Indonesia (subject_id = 2)
    const [binRecallRows] = await conn.query<RowDataPacket[]>(
      "SELECT id FROM question_banks WHERE bank_type = 'RECALL' AND subject_id = 2"
    );
    const neededBinRecall = 15 - binRecallRows.length;
    for (let i = 0; i < neededBinRecall; i++) {
      await insertQuestion(
        2, null, null, "RECALL",
        `[Recall BIN #${binRecallRows.length + i + 1}] Manakah ide pokok paragraf wacana berita ke-${i + 1}?`,
        "Ide pokok dapat ditemukan pada kalimat utama deduktif paragraf pembuka."
      );
    }
    console.log("   ✓ 30 Butir Soal Asesmen Recall (15 MAT + 15 BIN) siap di bank_type = 'RECALL'.");

    // C. 10 Soal Latihan Level Kognitif untuk Submateri 14 (BIN) Level 1
    const [lrnRows] = await conn.query<RowDataPacket[]>(
      "SELECT id FROM question_banks WHERE bank_type = 'LEVEL_EXERCISE' AND sub_material_id = 14 AND cognitive_level_id = 1"
    );
    const neededLrn = 10 - lrnRows.length;
    for (let i = 0; i < neededLrn; i++) {
      await insertQuestion(
        2, 14, 1, "LEVEL_EXERCISE",
        `[Latihan L1 Submateri 14 #${lrnRows.length + i + 1}] Analisis teks sastra puisi level pemahaman butir ${i + 1}.`,
        "Pemahaman makna tersurat bait puisi pada tataran harfiah."
      );
    }
    console.log("   ✓ 10 Butir Soal Latihan Level Kognitif (Submateri 14, Level 1) siap.");

    // D. 30 Soal Simulasi CBT Matematika (subject_id = 1)
    const [simRows] = await conn.query<RowDataPacket[]>(
      "SELECT id FROM question_banks WHERE bank_type = 'SIMULATION' AND subject_id = 1"
    );
    const neededSim = 30 - simRows.length;
    for (let i = 0; i < neededSim; i++) {
      await insertQuestion(
        1, 1, 3, "SIMULATION",
        `[Simulasi CBT MAT #${simRows.length + i + 1}] Soal pemecahan masalah kontekstual numerasi butir ${i + 1}.`,
        "Penyelesaian masalah numerasi multi-langkah menggunakan pemodelan aljabar."
      );
    }
    console.log("   ✓ 30 Butir Soal Bank Simulasi CBT siap.");

    // 5. Paket Simulasi Ujian CBT (id = 1)
    console.log("5. Menyiapkan Paket Simulasi Ujian CBT (id = 1)...");
    await conn.query(`
      INSERT INTO simulations 
        (id, subject_id, title, package_code, duration_minutes, total_questions, passing_score, xp_reward, status, is_active)
      VALUES 
        (1, 1, 'Paket Simulasi CBT Mandiri 1', 'SIM-MAT-01', 75, 30, 90.00, 500, 'ACTIVE', TRUE)
      ON DUPLICATE KEY UPDATE 
        status = 'ACTIVE', 
        is_active = TRUE,
        subject_id = 1,
        title = 'Paket Simulasi CBT Mandiri 1'
    `);

    // Hubungkan 30 soal simulasi ke paket 1
    const [allSimQuestions] = await conn.query<RowDataPacket[]>(
      "SELECT id FROM question_banks WHERE bank_type = 'SIMULATION' AND subject_id = 1 ORDER BY id ASC LIMIT 30"
    );
    for (let i = 0; i < allSimQuestions.length; i++) {
      const qId = allSimQuestions[i].id;
      await conn.query(`
        INSERT INTO simulation_questions (simulation_id, question_id, question_order)
        VALUES (1, ?, ?)
        ON DUPLICATE KEY UPDATE question_order = VALUES(question_order)
      `, [qId, i + 1]);
    }
    console.log("   ✓ Paket Simulasi 1 aktif dengan susunan 30 butir soal terpetakan.");

    console.log("\n===============================================================================");
    console.log("       ✓ SEMUA PRECONDITION TESTING BERHASIL DISIAPKAN DI DATABASE!           ");
    console.log("===============================================================================\n");
  } catch (err) {
    console.error("❌ Terjadi kesalahan saat seeding precondition:", err);
    process.exitCode = 1;
  } finally {
    await conn.end();
  }
}

seedTestingPreconditions();

import mysql, { RowDataPacket, ResultSetHeader, Pool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config();

interface TargetUser {
    id: string;
    name: string;
    email: string;
    username: string;
    role: string;
}

function parseCliArgs() {
    const args = process.argv.slice(2);
    const flags: {
        all: boolean;
        recall: boolean;
        level: boolean;
        allLevels: boolean;
        simulation: boolean;
        email?: string;
        username?: string;
        userId?: string;
        help: boolean;
    } = {
        all: false,
        recall: false,
        level: false,
        allLevels: false,
        simulation: false,
        help: false,
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === "--all") flags.all = true;
        else if (arg === "--recall") flags.recall = true;
        else if (arg === "--level" || arg === "--rekognisi") flags.level = true;
        else if (arg === "--all-levels" || arg === "--mastery") flags.allLevels = true;
        else if (arg === "--simulation" || arg === "--simulasi") flags.simulation = true;
        else if (arg === "--help" || arg === "-h") flags.help = true;
        else if (arg === "--email" && i + 1 < args.length) flags.email = args[++i];
        else if (arg.startsWith("--email=")) flags.email = arg.slice(8);
        else if (arg === "--username" && i + 1 < args.length) flags.username = args[++i];
        else if (arg.startsWith("--username=")) flags.username = arg.slice(11);
        else if (arg === "--user" && i + 1 < args.length) flags.userId = args[++i];
        else if (arg.startsWith("--user=")) flags.userId = arg.slice(7);
        else if (!arg.startsWith("-")) {
            // Argumen posisional fallback: jika npm menelan `--username` atau user mengetik `npm run complete:recall user`
            if (!flags.username && !flags.email && !flags.userId) {
                if (arg.includes("@")) {
                    flags.email = arg;
                } else {
                    flags.username = arg;
                }
            }
        }
    }

    // Default to --all if no specific action specified
    if (!flags.recall && !flags.level && !flags.allLevels && !flags.simulation) {
        flags.all = true;
    }

    return flags;
}

function printHelp() {
    console.log(`
=============================================================================
AGRA - Script Otomasi Penyelesaian Asesmen Siswa (Recall, Level, Simulasi)
=============================================================================

Penggunaan:
  npx tsx scripts/complete-assessment.ts [opsi]

Opsi Tindakan:
  --all            Selesaikan Recall, Level Rekognisi, dan Simulasi TKA (Default)
  --recall         Selesaikan asesmen pembuka 'Recall Kemampuanmu'
  --level          Selesaikan Level Rekognisi (Level 1: Pemahaman) seluruh submateri
  --all-levels     Selesaikan seluruh Level Kognitif (Level 1, 2, 3) hingga Mastered
  --simulation     Selesaikan ujian Simulasi TKA CBT (semua paket simulasi)
  --help, -h       Tampilkan panduan bantuan ini

Opsi Target Pengguna:
  --email <email>        Pilih akun siswa berdasarkan email
  --username <username>  Pilih akun siswa berdasarkan username
  --user <id>            Pilih akun siswa berdasarkan user ID

Contoh:
  npm run complete
  npm run complete:recall
  npm run complete:level
  npm run complete:simulasi
  npx tsx scripts/complete-assessment.ts --all --email user@example.com
`);
}

async function getDbPool(): Promise<Pool> {
    if (!process.env.DB_NAME) {
        throw new Error("DB_NAME tidak ditemukan pada environment variables (.env).");
    }

    return mysql.createPool({
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        decimalNumbers: true,
        multipleStatements: false,
    });
}

async function resolveStudentUser(
    pool: Pool,
    filter: { email?: string; username?: string; userId?: string }
): Promise<TargetUser> {
    if (filter.userId) {
        const [rows] = await pool.query<Array<RowDataPacket & TargetUser>>(
            "SELECT id, name, email, username, role FROM users WHERE id = ?",
            [filter.userId]
        );
        if (rows.length > 0) return rows[0];
        throw new Error(`Pengguna dengan ID '${filter.userId}' tidak ditemukan.`);
    }

    if (filter.email) {
        const [rows] = await pool.query<Array<RowDataPacket & TargetUser>>(
            "SELECT id, name, email, username, role FROM users WHERE email = ?",
            [filter.email]
        );
        if (rows.length > 0) return rows[0];
        throw new Error(`Pengguna dengan email '${filter.email}' tidak ditemukan.`);
    }

    if (filter.username) {
        const [rows] = await pool.query<Array<RowDataPacket & TargetUser>>(
            "SELECT id, name, email, username, role FROM users WHERE username = ?",
            [filter.username]
        );
        if (rows.length > 0) return rows[0];
        throw new Error(`Pengguna dengan username '${filter.username}' tidak ditemukan.`);
    }

    // Default: Cari akun siswa pertama di database
    const [students] = await pool.query<Array<RowDataPacket & TargetUser>>(
        "SELECT id, name, email, username, role FROM users WHERE role = 'SISWA' ORDER BY createdAt ASC LIMIT 1"
    );

    if (students.length > 0) {
        return students[0];
    }

    // Jika belum ada siswa sama sekali, buatkan akun demo otomatis
    console.log("ℹ Belum ada akun SISWA di database. Membuat akun siswa default (siswa@example.com)...");
    const demoId = "siswa-demo-" + Date.now().toString(36);
    await pool.execute(
        `INSERT INTO users (id, name, email, username, role, emailVerified, createdAt, updatedAt)
         VALUES (?, 'Siswa Demo', 'siswa@example.com', 'siswa_demo', 'SISWA', TRUE, NOW(), NOW())`,
        [demoId]
    );

    await pool.execute(
        `INSERT INTO user_profiles (user_id, preset_avatar_id, current_milestone_tier_id, total_xp, is_recall_passed)
         VALUES (?, 1, 1, 0, FALSE)
         ON DUPLICATE KEY UPDATE updated_at = NOW()`,
        [demoId]
    );

    return {
        id: demoId,
        name: "Siswa Demo",
        email: "siswa@example.com",
        username: "siswa_demo",
        role: "SISWA",
    };
}

async function ensureUserProfile(pool: Pool, userId: string) {
    await pool.execute(
        `INSERT INTO user_profiles (user_id, preset_avatar_id, current_milestone_tier_id, total_xp, is_recall_passed)
         VALUES (?, 1, 1, 0, FALSE)
         ON DUPLICATE KEY UPDATE updated_at = NOW()`,
        [userId]
    );
}

/**
 * 1. MENYELESAIKAN RECALL KEMAMPUANMU
 */
async function completeRecall(pool: Pool, userId: string): Promise<void> {
    console.log("\n------------------------------------------------------------");
    console.log("▶ [1/3] Memproses Penyelesaian Recall Kemampuanmu...");
    console.log("------------------------------------------------------------");

    // Ambil bank soal recall aktif (maksimal 30 butir)
    const [questions] = await pool.query<Array<RowDataPacket & { id: number; question_text: string }>>(
        `SELECT id, question_text FROM question_banks 
         WHERE bank_type = 'RECALL' AND is_active = TRUE 
         ORDER BY id ASC LIMIT 30`
    );

    if (questions.length === 0) {
        console.warn("⚠ Peringatan: Tidak ada butir soal di Bank Soal RECALL. Pastikan seed database sudah dieksekusi.");
        return;
    }

    // Hitung nomor attempt berikutnya
    const [attRows] = await pool.query<Array<RowDataPacket & { next_attempt: number }>>(
        `SELECT COALESCE(MAX(attempt_number), 0) + 1 AS next_attempt 
         FROM learning_sessions WHERE user_id = ? AND session_type = 'RECALL'`,
        [userId]
    );
    const attemptNumber = attRows[0]?.next_attempt || 1;
    const totalQuestions = questions.length;
    const correctAnswers = totalQuestions;
    const score = 100.00;

    // Buat session recall COMPLETED
    const [sessIns] = await pool.execute<ResultSetHeader>(
        `INSERT INTO learning_sessions 
           (user_id, subject_id, session_type, attempt_number, is_remedial, status, submission_type, total_questions, correct_answers, score, is_passed, current_question_order, start_time, end_time)
         VALUES 
           (?, NULL, 'RECALL', ?, FALSE, 'COMPLETED', 'MANUAL', ?, ?, ?, TRUE, ?, NOW(), NOW())`,
        [userId, attemptNumber, totalQuestions, correctAnswers, score, totalQuestions]
    );
    const sessionId = sessIns.insertId;

    // Pasangkan session_questions dan student_answers dengan kunci jawaban benar
    for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const questionOrder = i + 1;

        const [sqIns] = await pool.execute<ResultSetHeader>(
            `INSERT INTO session_questions (session_id, question_id, question_order)
             VALUES (?, ?, ?)`,
            [sessionId, q.id, questionOrder]
        );
        const sessionQuestionId = sqIns.insertId;

        const [saIns] = await pool.execute<ResultSetHeader>(
            `INSERT INTO student_answers (session_question_id, score, is_correct, is_flagged, is_skipped, time_spent_seconds, answered_at)
             VALUES (?, 1.00, TRUE, FALSE, FALSE, 25, NOW())`,
            [sessionQuestionId]
        );
        const studentAnswerId = saIns.insertId;

        // Ambil opsi jawaban benar dari question_options
        const [correctOptions] = await pool.query<Array<RowDataPacket & { id: number }>>(
            `SELECT id FROM question_options WHERE question_id = ? AND is_correct = TRUE`,
            [q.id]
        );

        if (correctOptions.length > 0) {
            for (const opt of correctOptions) {
                await pool.execute(
                    `INSERT INTO student_answer_options (student_answer_id, selected_option_id)
                     VALUES (?, ?)`,
                    [studentAnswerId, opt.id]
                );
            }
        }
    }

    // Set status kelulusan recall pada profil siswa
    await pool.execute(
        `UPDATE user_profiles SET is_recall_passed = TRUE WHERE user_id = ?`,
        [userId]
    );

    console.log(`✓ Sesi Recall Selesai: Attempt ID #${sessionId}`);
    console.log(`  - Jumlah Soal Terjawab: ${totalQuestions}/${totalQuestions} Benar`);
    console.log(`  - Skor Evaluasi       : ${score.toFixed(2)}% (LULUS)`);
    console.log(`  - Status Profil       : is_recall_passed = TRUE (Akses materi kurikulum TERBUKA)`);
}

/**
 * 2. MENYELESAIKAN LEVEL REKOGNISI / LEVEL KOGNITIF LATIHAN
 */
async function completeLevelRekognisi(pool: Pool, userId: string, _allLevels: boolean = true): Promise<void> {
    console.log("\n------------------------------------------------------------");
    console.log("▶ [2/3] Memproses Penyelesaian Level Kognitif (Level 1, 2, 3 - Skor 100% Tuntas)...");
    console.log("------------------------------------------------------------");

    // Pastikan status profil recall lulus agar akses kurikulum terbuka
    await pool.execute(
        `UPDATE user_profiles SET is_recall_passed = TRUE WHERE user_id = ?`,
        [userId]
    );

    const [submaterials] = await pool.query<Array<RowDataPacket & { id: number; code: string; title: string; material_id: number }>>(
        `SELECT id, code, title, material_id FROM sub_materials WHERE is_active = TRUE ORDER BY order_index ASC`
    );

    if (submaterials.length === 0) {
        console.warn("⚠ Peringatan: Tidak ada data submateri aktif di database.");
        return;
    }

    const levelsToComplete = [1, 2, 3];
    let totalCompletedSessions = 0;
    let totalXpEarned = 0;

    for (const sm of submaterials) {
        for (const levelNum of levelsToComplete) {
            // Ambil info level kognitif
            const [cogRows] = await pool.query<Array<RowDataPacket & { id: number; name: string; xp_reward: number }>>(
                `SELECT id, name, xp_reward FROM cognitive_levels WHERE level_number = ?`,
                [levelNum]
            );
            const cogLevel = cogRows[0] || { id: levelNum, name: levelNum === 1 ? "Pemahaman" : levelNum === 2 ? "Pengaplikasian" : "Penalaran", xp_reward: levelNum === 1 ? 50 : levelNum === 2 ? 75 : 100 };

            // Ambil soal level exercise untuk submateri dan cognitive level ini
            const [questions] = await pool.query<Array<RowDataPacket & { id: number }>>(
                `SELECT id FROM question_banks 
                 WHERE bank_type = 'LEVEL_EXERCISE' AND sub_material_id = ? AND cognitive_level_id = ? AND is_active = TRUE
                 ORDER BY id ASC LIMIT 10`,
                [sm.id, cogLevel.id]
            );

            // Tentukan nomor attempt berikutnya
            const [attRows] = await pool.query<Array<RowDataPacket & { next_attempt: number }>>(
                `SELECT COALESCE(MAX(attempt_number), 0) + 1 AS next_attempt 
                 FROM learning_sessions 
                 WHERE user_id = ? AND session_type = 'LEVEL_EXERCISE' AND sub_material_id = ? AND cognitive_level_id = ?`,
                [userId, sm.id, cogLevel.id]
            );
            const attemptNumber = attRows[0]?.next_attempt || 1;
            const totalQuestions = questions.length > 0 ? questions.length : 10;
            const correctAnswers = totalQuestions;
            const score = 100.00;

            // Buat record session latihan dengan skor 100%
            const [sessIns] = await pool.execute<ResultSetHeader>(
                `INSERT INTO learning_sessions 
                   (user_id, subject_id, session_type, sub_material_id, cognitive_level_id, attempt_number, is_remedial, status, submission_type, total_questions, correct_answers, score, is_passed, current_question_order, start_time, end_time)
                 VALUES 
                   (?, NULL, 'LEVEL_EXERCISE', ?, ?, ?, FALSE, 'COMPLETED', 'MANUAL', ?, ?, ?, TRUE, ?, NOW(), NOW())`,
                [userId, sm.id, cogLevel.id, attemptNumber, totalQuestions, correctAnswers, score, totalQuestions]
            );
            const sessionId = sessIns.insertId;

            // Buat session questions & answers jika ada bank soalnya
            for (let i = 0; i < questions.length; i++) {
                const qId = questions[i].id;
                const [sqIns] = await pool.execute<ResultSetHeader>(
                    `INSERT INTO session_questions (session_id, question_id, question_order)
                     VALUES (?, ?, ?)`,
                    [sessionId, qId, i + 1]
                );
                const sessionQuestionId = sqIns.insertId;

                const [saIns] = await pool.execute<ResultSetHeader>(
                    `INSERT INTO student_answers (session_question_id, score, is_correct, is_flagged, is_skipped, time_spent_seconds, answered_at)
                     VALUES (?, 1.00, TRUE, FALSE, FALSE, 20, NOW())`,
                    [sessionQuestionId]
                );
                const studentAnswerId = saIns.insertId;

                const [correctOptions] = await pool.query<Array<RowDataPacket & { id: number }>>(
                    `SELECT id FROM question_options WHERE question_id = ? AND is_correct = TRUE`,
                    [qId]
                );
                for (const opt of correctOptions) {
                    await pool.execute(
                        `INSERT INTO student_answer_options (student_answer_id, selected_option_id)
                         VALUES (?, ?)`,
                        [studentAnswerId, opt.id]
                    );
                }
            }

            // Catat transaksi XP kelulusan level
            const xpAmount = cogLevel.xp_reward;
            await pool.execute(
                `INSERT INTO xp_transactions (user_id, session_id, sub_material_id, transaction_type, xp_amount, description, created_at)
                 VALUES (?, ?, ?, 'LEVEL_COMPLETION', ?, ?, NOW())`,
                [userId, sessionId, sm.id, xpAmount, `Menyelesaikan Level ${levelNum} (${sm.code} - ${sm.title})`]
            );
            totalXpEarned += xpAmount;
            totalCompletedSessions++;
        }

        // Perbarui student_sub_material_progress ke status MASTERED dan skor 100% (10/10)
        await pool.execute(
            `INSERT INTO student_sub_material_progress 
               (user_id, sub_material_id, level_1_status, level_2_status, level_3_status, level_1_score, level_2_score, level_3_score, total_cumulative_score, is_mastered, is_xp_awarded, progress_state, mastered_at)
             VALUES 
               (?, ?, 'COMPLETED', 'COMPLETED', 'COMPLETED', 10.00, 10.00, 10.00, 30.00, TRUE, TRUE, 'MASTERED', NOW())
             ON DUPLICATE KEY UPDATE 
               level_1_status = 'COMPLETED', level_2_status = 'COMPLETED', level_3_status = 'COMPLETED',
               level_1_score = 10.00, level_2_score = 10.00, level_3_score = 10.00, total_cumulative_score = 30.00,
               is_mastered = TRUE, is_xp_awarded = TRUE, progress_state = 'MASTERED', mastered_at = NOW()`,
            [userId, sm.id]
        );

        // Tambahkan XP bonus mastery
        await pool.execute(
            `INSERT INTO xp_transactions (user_id, sub_material_id, transaction_type, xp_amount, description, created_at)
             VALUES (?, ?, 'SUB_MATERIAL_MASTERY', 250, ?, NOW())`,
            [userId, sm.id, `Bonus Ketuntasan Submateri (${sm.code} - ${sm.title})`]
        );
        totalXpEarned += 250;
    }

    console.log(`✓ Selesai ${totalCompletedSessions} Sesi Latihan pada ${submaterials.length} Submateri:`);
    console.log(`  - Tingkatan Selesai   : Level 1, 2, dan 3 (Skor 100% - Tuntas / Mastered)`);
    console.log(`  - Status Lanjutan     : Seluruh 16 Submateri Tuntas (MASTERED) & Semua Materi Terbuka`);
    console.log(`  - Total XP Didapatkan : +${totalXpEarned} XP`);
}

/**
 * 3. MENYELESAIKAN SIMULASI UJIAN TKA (75 MENIT CBT)
 */
async function completeSimulasiTka(pool: Pool, userId: string): Promise<void> {
    console.log("\n------------------------------------------------------------");
    console.log("▶ [3/3] Memproses Penyelesaian Ujian Simulasi TKA...");
    console.log("------------------------------------------------------------");

    const [packages] = await pool.query<Array<RowDataPacket & {
        id: number;
        title: string;
        package_code: string;
        subject_id: number;
        total_questions: number;
        xp_reward: number;
    }>>(
        `SELECT id, title, package_code, subject_id, total_questions, xp_reward 
         FROM simulations WHERE is_active = TRUE ORDER BY id ASC`
    );

    if (packages.length === 0) {
        console.warn("⚠ Peringatan: Tidak ada paket simulasi aktif di database.");
        return;
    }

    let totalSimSessions = 0;
    let totalSimXp = 0;

    for (const pkg of packages) {
        const [attRows] = await pool.query<Array<RowDataPacket & { next_attempt: number }>>(
            `SELECT COALESCE(MAX(attempt_number), 0) + 1 AS next_attempt 
             FROM learning_sessions 
             WHERE user_id = ? AND session_type = 'SIMULATION' AND simulation_id = ?`,
            [userId, pkg.id]
        );
        const attemptNumber = attRows[0]?.next_attempt || 1;
        const totalQuestions = pkg.total_questions || 30;
        const correctAnswers = totalQuestions;
        const score = 100.00;

        // Buat record session simulasi
        const [sessIns] = await pool.execute<ResultSetHeader>(
            `INSERT INTO learning_sessions 
               (user_id, subject_id, session_type, simulation_id, attempt_number, is_remedial, status, submission_type, total_questions, correct_answers, score, is_passed, remaining_time_seconds, current_question_order, start_time, end_time)
             VALUES 
               (?, ?, 'SIMULATION', ?, ?, FALSE, 'COMPLETED', 'MANUAL', ?, ?, ?, TRUE, 0, ?, NOW(), NOW())`,
            [userId, pkg.subject_id, pkg.id, attemptNumber, totalQuestions, correctAnswers, score, totalQuestions]
        );
        const sessionId = sessIns.insertId;

        // Ambil soal yang terpetakan di simulation_questions
        const [simQuestions] = await pool.query<Array<RowDataPacket & { question_id: number; question_order: number }>>(
            `SELECT question_id, question_order FROM simulation_questions 
             WHERE simulation_id = ? ORDER BY question_order ASC`,
            [pkg.id]
        );

        for (const sq of simQuestions) {
            const [sqIns] = await pool.execute<ResultSetHeader>(
                `INSERT INTO session_questions (session_id, question_id, question_order)
                 VALUES (?, ?, ?)`,
                [sessionId, sq.question_id, sq.question_order]
            );
            const sessionQuestionId = sqIns.insertId;

            const [saIns] = await pool.execute<ResultSetHeader>(
                `INSERT INTO student_answers (session_question_id, score, is_correct, is_flagged, is_skipped, time_spent_seconds, answered_at)
                 VALUES (?, 1.00, TRUE, FALSE, FALSE, 35, NOW())`,
                [sessionQuestionId]
            );
            const studentAnswerId = saIns.insertId;

            const [correctOptions] = await pool.query<Array<RowDataPacket & { id: number }>>(
                `SELECT id FROM question_options WHERE question_id = ? AND is_correct = TRUE`,
                [sq.question_id]
            );
            for (const opt of correctOptions) {
                await pool.execute(
                    `INSERT INTO student_answer_options (student_answer_id, selected_option_id)
                     VALUES (?, ?)`,
                    [studentAnswerId, opt.id]
                );
            }
        }

        // Catat transaksi XP Simulasi (+500 XP)
        const xpAmount = pkg.xp_reward || 500;
        await pool.execute(
            `INSERT INTO xp_transactions (user_id, simulation_id, session_id, transaction_type, xp_amount, description, created_at)
             VALUES (?, ?, ?, 'SIMULATION_COMPLETION', ?, ?, NOW())`,
            [userId, pkg.id, sessionId, xpAmount, `Menyelesaikan ${pkg.title} (${pkg.package_code})`]
        );

        totalSimXp += xpAmount;
        totalSimSessions++;
        console.log(`  ✓ Paket Simulasi Selesai: [${pkg.package_code}] ${pkg.title} (Skor: 100% - LULUS, +${xpAmount} XP)`);
    }

    console.log(`✓ Selesai ${totalSimSessions} Paket Simulasi TKA (Total XP Didapatkan: +${totalSimXp} XP)`);
}

/**
 * 4. KALKULASI & SINKRONISASI TOTAL XP SERTA TIER PRESTASI SISWA
 */
async function syncMilestoneTier(pool: Pool, userId: string): Promise<void> {
    console.log("\n------------------------------------------------------------");
    console.log("▶ [Sinkronisasi] Memperbarui Akumulasi XP dan Milestone Tier...");
    console.log("------------------------------------------------------------");

    // Hitung total mutasi XP resmi dari buku besar
    const [xpRows] = await pool.query<Array<RowDataPacket & { total_xp: number }>>(
        `SELECT COALESCE(SUM(xp_amount), 0) AS total_xp FROM xp_transactions WHERE user_id = ?`,
        [userId]
    );
    const totalXp = Number(xpRows[0]?.total_xp || 0);

    // Cari tier tertinggi yang telah dipenuhi syarat min_xp-nya
    const [tiers] = await pool.query<Array<RowDataPacket & { id: number; tier_number: number; title: string; min_xp: number }>>(
        `SELECT id, tier_number, title, min_xp FROM milestone_tiers 
         WHERE min_xp <= ? 
         ORDER BY tier_number DESC LIMIT 1`,
        [totalXp]
    );

    const activeTier = tiers[0] || { id: 1, tier_number: 1, title: "Perintis", min_xp: 0 };

    await pool.execute(
        `UPDATE user_profiles 
         SET total_xp = ?, current_milestone_tier_id = ? 
         WHERE user_id = ?`,
        [totalXp, activeTier.id, userId]
    );

    console.log(`✓ Sinkronisasi Profil Berhasil:`);
    console.log(`  - Akumulasi Total XP : ${totalXp.toLocaleString()} XP`);
    console.log(`  - Milestone Tier     : Tier ${activeTier.tier_number} - "${activeTier.title}"`);
}

async function main() {
    const flags = parseCliArgs();

    if (flags.help) {
        printHelp();
        process.exit(0);
    }

    let pool: Pool | null = null;
    try {
        pool = await getDbPool();

        console.log("============================================================");
        console.log("🚀 AGRA - Script Penyelesaian Asesmen Siswa (Automation)");
        console.log("============================================================");

        const targetUser = await resolveStudentUser(pool, {
            email: flags.email,
            username: flags.username,
            userId: flags.userId,
        });

        console.log(`Akun Siswa Terpilih:`);
        console.log(`  • ID       : ${targetUser.id}`);
        console.log(`  • Nama     : ${targetUser.name}`);
        console.log(`  • Email    : ${targetUser.email}`);
        console.log(`  • Username : ${targetUser.username || "-"}`);
        console.log(`  • Role     : ${targetUser.role}`);

        await ensureUserProfile(pool, targetUser.id);

        if (flags.all || flags.recall) {
            await completeRecall(pool, targetUser.id);
        }

        if (flags.all || flags.level || flags.allLevels) {
            await completeLevelRekognisi(pool, targetUser.id, flags.allLevels);
        }

        if (flags.all || flags.simulation) {
            await completeSimulasiTka(pool, targetUser.id);
        }

        await syncMilestoneTier(pool, targetUser.id);

        console.log("\n============================================================");
        console.log("🎉 SEMUA TINDAKAN BERHASIL DISELESAIKAN DENGAN SUKSES!");
        console.log("============================================================");
        console.log("Silakan buka aplikasi dan lakukan pengecekan pada:");
        console.log("  1. Dashboard Siswa: http://localhost:3000/dashboard");
        console.log("  2. Status Recall   : http://localhost:3000/recall");
        console.log("  3. Kurikulum Materi: http://localhost:3000/curriculum");
        console.log("  4. Simulasi CBT    : http://localhost:3000/simulations\n");
    } catch (error) {
        console.error("\n❌ Terjadi kesalahan saat mengeksekusi script:", error);
        process.exit(1);
    } finally {
        if (pool) {
            await pool.end();
        }
    }
}

main();

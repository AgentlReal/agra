/**
 * AGRA QA AUTOMATED API TEST SUITE
 * -------------------------------------------------------------
 * Menguji seluruh endpoint API pada kontrak resmi openapi/API.yaml v2.0.0
 * Target: Prism Mock Server (http://127.0.0.1:4010) atau App Server (http://localhost:3000)
 *
 * Jalankan dengan:
 *   npx tsx tests/api.test.ts
 *   atau
 *   npm test
 */

const BASE_URL = process.env.API_BASE_URL || "http://127.0.0.1:4010";
const AUTH_COOKIE = "better-auth.session_token=mock_session_token_valid_12345";

interface TestCase {
  id: string;
  module: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  description: string;
  expectedStatus: number[];
  body?: any;
  headers?: Record<string, string>;
  isPublic?: boolean;
  isFormData?: boolean;
}

// 48 Endpoints terpetakan ke seluruh modul OpenAPI v2.0.0
const testCases: TestCase[] = [
  // ==========================================================
  // 1. AUTH MURID & KURIKULUM (Better Auth)
  // ==========================================================
  {
    id: "TC-AUTH-001",
    module: "Auth Murid & Kurikulum",
    method: "POST",
    path: "/api/auth/sign-up/email",
    description: "Registrasi akun siswa baru dengan email dan password",
    body: {
      email: "siswa_baru@example.com",
      password: "Belajar1!",
      name: "Siswa Baru",
      username: "siswabaru2026"
    },
    expectedStatus: [200, 201],
    isPublic: true
  },
  {
    id: "TC-AUTH-002",
    module: "Auth Murid & Kurikulum",
    method: "POST",
    path: "/api/auth/sign-in/username",
    description: "Login akun siswa menggunakan USERNAME dan password",
    body: {
      username: "siswabaru2026",
      password: "Belajar1!"
    },
    expectedStatus: [200],
    isPublic: true
  },
  {
    id: "TC-AUTH-003",
    module: "Auth Murid & Kurikulum",
    method: "POST",
    path: "/api/auth/sign-in/email",
    description: "Login akun siswa menggunakan ALAMAT EMAIL dan password",
    body: {
      email: "siswa_baru@example.com",
      password: "Belajar1!"
    },
    expectedStatus: [200],
    isPublic: true
  },
  {
    id: "TC-AUTH-004",
    module: "Auth Murid & Kurikulum",
    method: "GET",
    path: "/api/auth/get-session",
    description: "Mengambil data sesi dan identitas user yang sedang login",
    expectedStatus: [200]
  },
  {
    id: "TC-AUTH-005",
    module: "Auth Murid & Kurikulum",
    method: "POST",
    path: "/api/auth/change-password",
    description: "Mengubah kata sandi akun siswa dengan kata sandi lama",
    body: {
      currentPassword: "Belajar1!",
      newPassword: "Rahasia1!"
    },
    expectedStatus: [200]
  },
  {
    id: "TC-AUTH-006",
    module: "Auth Murid & Kurikulum",
    method: "POST",
    path: "/api/auth/request-password-reset",
    description: "Meminta tautan pemulihan kata sandi via email",
    body: {
      email: "siswa_baru@example.com"
    },
    expectedStatus: [200],
    isPublic: true
  },
  {
    id: "TC-AUTH-007",
    module: "Auth Murid & Kurikulum",
    method: "POST",
    path: "/api/auth/reset-password",
    description: "Mereset kata sandi menggunakan token valid (6-12 chars)",
    body: {
      token: "valid-reset-token-12345",
      newPassword: "Rahasia1!"
    },
    expectedStatus: [200],
    isPublic: true
  },
  {
    id: "TC-AUTH-008",
    module: "Auth Murid & Kurikulum",
    method: "POST",
    path: "/api/auth/sign-out",
    description: "Keluar dari sesi akun aktif dan invalidasi cookie",
    expectedStatus: [200]
  },

  // ==========================================================
  // 2. PROFIL SISWA
  // ==========================================================
  {
    id: "TC-PROF-001",
    module: "Profil Siswa",
    method: "POST",
    path: "/api/v1/profile/complete",
    description: "Inisialisasi profil siswa baru dengan memilih jenjang kelas Fase D (Grade 7)",
    body: {
      grade: 7
    },
    expectedStatus: [200, 201]
  },
  {
    id: "TC-PROF-002",
    module: "Profil Siswa",
    method: "GET",
    path: "/api/v1/profile",
    description: "Mengambil data profil siswa (nama, kelas, total XP, status Recall)",
    expectedStatus: [200]
  },
  {
    id: "TC-PROF-003",
    module: "Profil Siswa",
    method: "PATCH",
    path: "/api/v1/profile",
    description: "Mengubah Display Name profil siswa (3-30 karakter)",
    body: {
      name: "Budi Satria"
    },
    expectedStatus: [200]
  },
  {
    id: "TC-PROF-004",
    module: "Profil Siswa",
    method: "GET",
    path: "/api/v1/avatars",
    description: "Mengambil galeri daftar preset avatar resmi yang diizinkan sistem",
    expectedStatus: [200]
  },
  {
    id: "TC-PROF-005",
    module: "Profil Siswa",
    method: "PUT",
    path: "/api/v1/profile/avatar",
    description: "Mengganti avatar profil siswa dengan presetAvatarId valid",
    body: {
      avatarId: 2
    },
    expectedStatus: [200]
  },
  {
    id: "TC-PROF-006",
    module: "Profil Siswa",
    method: "GET",
    path: "/api/v1/profile/xp-transactions",
    description: "Mengambil riwayat transaksi perolehan reward XP siswa",
    expectedStatus: [200]
  },

  // ==========================================================
  // 3. DASHBOARD SISWA
  // ==========================================================
  {
    id: "TC-DASH-001",
    module: "Dashboard Siswa",
    method: "GET",
    path: "/api/v1/dashboard",
    description: "Mengambil ringkasan dasbor kompetensi dan rekomendasi belajar siswa",
    expectedStatus: [200]
  },

  // ==========================================================
  // 4. RECALL KEMAMPUANMU
  // ==========================================================
  {
    id: "TC-REC-001",
    module: "Recall Kemampuanmu",
    method: "GET",
    path: "/api/v1/recall/status",
    description: "Mengecek status kelulusan asesmen awal Recall Kemampuanmu (is_recall_passed)",
    expectedStatus: [200]
  },
  {
    id: "TC-REC-002",
    module: "Recall Kemampuanmu",
    method: "POST",
    path: "/api/v1/recall/attempts",
    description: "Memulai sesi pengerjaan asesmen pembuka Recall Kemampuanmu (30 butir)",
    expectedStatus: [200, 201]
  },
  {
    id: "TC-REC-003",
    module: "Recall Kemampuanmu",
    method: "GET",
    path: "/api/v1/recall/attempts/1",
    description: "Mengambil status lembar pengerjaan sesi Recall dan daftar 30 butir soal",
    expectedStatus: [200]
  },
  {
    id: "TC-REC-004",
    module: "Recall Kemampuanmu",
    method: "PUT",
    path: "/api/v1/recall/attempts/1/answers/1",
    description: "Menyimpan jawaban (Autosave) pada lembar Recall Kemampuanmu",
    body: {
      selectedOptionIds: [1],
      isSkipped: false
    },
    expectedStatus: [200]
  },
  {
    id: "TC-REC-005",
    module: "Recall Kemampuanmu",
    method: "POST",
    path: "/api/v1/recall/attempts/1/submit",
    description: "Submit finalisasi evaluasi 30 butir soal Recall Kemampuanmu",
    expectedStatus: [200]
  },
  {
    id: "TC-REC-006",
    module: "Recall Kemampuanmu",
    method: "GET",
    path: "/api/v1/recall/attempts/1/result",
    description: "Mengambil laporan nilai skor evaluasi Recall dan capaian passing grade (>=90%)",
    expectedStatus: [200]
  },
  {
    id: "TC-REC-007",
    module: "Recall Kemampuanmu",
    method: "GET",
    path: "/api/v1/recall/attempts/1/review",
    description: "Mengambil pembahasan nalar komprehensif atas 30 soal Recall Kemampuanmu",
    expectedStatus: [200]
  },

  // ==========================================================
  // 5. KURIKULUM SISWA
  // ==========================================================
  {
    id: "TC-KUR-001",
    module: "Kurikulum Siswa",
    method: "GET",
    path: "/api/v1/subjects",
    description: "Mengambil daftar mata pelajaran kurikulum Fase D (Matematika & Bahasa Indonesia)",
    expectedStatus: [200],
    isPublic: true
  },
  {
    id: "TC-KUR-002",
    module: "Kurikulum Siswa",
    method: "GET",
    path: "/api/v1/subjects/1/curriculum",
    description: "Mengambil pohon kurikulum mata pelajaran (Materi -> Submateri -> Level Kognitif)",
    expectedStatus: [200]
  },
  {
    id: "TC-KUR-003",
    module: "Kurikulum Siswa",
    method: "GET",
    path: "/api/v1/submaterials/1/progress",
    description: "Mengambil capaian penguasaan submateri (status locked/in progress/mastered)",
    expectedStatus: [200]
  },

  // ==========================================================
  // 6. LATIHAN LEVEL KOGNITIF (Drill & Practice)
  // ==========================================================
  {
    id: "TC-LRN-001",
    module: "Latihan Level Kognitif",
    method: "POST",
    path: "/api/v1/learning/levels/1/attempts",
    description: "Memulai sesi latihan level kognitif baru (L1/L2/L3 - 10 butir soal)",
    body: {
      sub_material_id: 14
    },
    expectedStatus: [200, 201]
  },
  {
    id: "TC-LRN-002",
    module: "Latihan Level Kognitif",
    method: "GET",
    path: "/api/v1/learning/attempts/1",
    description: "Mengambil status sesi latihan, 10 butir soal, dan progres pengerjaan",
    expectedStatus: [200]
  },
  {
    id: "TC-LRN-003",
    module: "Latihan Level Kognitif",
    method: "PUT",
    path: "/api/v1/learning/attempts/1/answers/1",
    description: "Autosave pilihan jawaban latihan level per butir soal",
    body: {
      selected_option_ids: [1],
      is_skipped: false,
      time_spent_seconds: 15
    },
    expectedStatus: [200]
  },
  {
    id: "TC-LRN-004",
    module: "Latihan Level Kognitif",
    method: "POST",
    path: "/api/v1/learning/attempts/1/submit",
    description: "Finalisasi submit pengerjaan latihan 10 butir soal level kognitif",
    expectedStatus: [200]
  },
  {
    id: "TC-LRN-005",
    module: "Latihan Level Kognitif",
    method: "GET",
    path: "/api/v1/learning/attempts/1/result",
    description: "Mengambil skor evaluasi latihan level, status mastery, dan reward XP",
    expectedStatus: [200]
  },
  {
    id: "TC-LRN-006",
    module: "Latihan Level Kognitif",
    method: "GET",
    path: "/api/v1/learning/attempts/1/review",
    description: "Mengambil pembahasan nalar dan kunci jawaban 10 butir soal latihan level",
    expectedStatus: [200]
  },

  // ==========================================================
  // 7. SIMULASI TKA (CBT Mode)
  // ==========================================================
  {
    id: "TC-SIM-001",
    module: "Simulasi TKA",
    method: "GET",
    path: "/api/v1/simulations/1/eligibility",
    description: "Pengecekan kelayakan pembukaan modul Simulasi TKA per mata pelajaran",
    expectedStatus: [200]
  },
  {
    id: "TC-SIM-002",
    module: "Simulasi TKA",
    method: "POST",
    path: "/api/v1/simulations/1/attempts",
    description: "Memulai sesi simulasi ujian CBT TKA (75 menit, 30 butir soal)",
    expectedStatus: [200, 201]
  },
  {
    id: "TC-SIM-003",
    module: "Simulasi TKA",
    method: "GET",
    path: "/api/v1/simulation-attempts/1",
    description: "Mengambil lembar ujian CBT, 30 butir soal, dan sisa timer server",
    expectedStatus: [200]
  },
  {
    id: "TC-SIM-004",
    module: "Simulasi TKA",
    method: "PUT",
    path: "/api/v1/simulation-attempts/1/answers/1",
    description: "Autosave jawaban dan flag status ragu-ragu butir soal simulasi",
    body: {
      selected_option_ids: [1],
      is_doubtful: false,
      time_spent_seconds: 25
    },
    expectedStatus: [200]
  },
  {
    id: "TC-SIM-005",
    module: "Simulasi TKA",
    method: "POST",
    path: "/api/v1/simulation-attempts/1/submit",
    description: "Submit finalisasi ujian simulasi CBT TKA",
    expectedStatus: [200]
  },
  {
    id: "TC-SIM-006",
    module: "Simulasi TKA",
    method: "GET",
    path: "/api/v1/simulation-attempts/1/result",
    description: "Mengambil kartu laporan nilai simulasi, metrik speed vs accuracy, dan XP",
    expectedStatus: [200]
  },
  {
    id: "TC-SIM-007",
    module: "Simulasi TKA",
    method: "GET",
    path: "/api/v1/simulation-attempts/1/review",
    description: "Mengambil pembahasan nalar komprehensif atas 30 soal simulasi CBT",
    expectedStatus: [200]
  },

  // ==========================================================
  // 8. PROFIL TIM KURIKULUM (Admin)
  // ==========================================================
  {
    id: "TC-ADM-001",
    module: "Profil Tim Kurikulum",
    method: "GET",
    path: "/api/v1/admin/profile",
    description: "Mengambil data profil akun Tim Kurikulum",
    expectedStatus: [200]
  },
  {
    id: "TC-ADM-002",
    module: "Profil Tim Kurikulum",
    method: "PATCH",
    path: "/api/v1/admin/profile",
    description: "Mengubah nama tampilan profil Tim Kurikulum",
    body: {
      name: "Tim Kurikulum Pusat"
    },
    expectedStatus: [200]
  },

  // ==========================================================
  // 9. BANK SOAL (Admin)
  // ==========================================================
  {
    id: "TC-BNK-001",
    module: "Bank Soal",
    method: "GET",
    path: "/api/v1/admin/question-banks",
    description: "Mengambil ringkasan informasi 3 bank soal (Practice, Recall, Simulation)",
    expectedStatus: [200]
  },
  {
    id: "TC-BNK-002",
    module: "Bank Soal",
    method: "GET",
    path: "/api/v1/admin/question-banks/stock",
    description: "Monitoring stok dan kecukupan kuota butir soal",
    expectedStatus: [200]
  },
  {
    id: "TC-BNK-003",
    module: "Bank Soal",
    method: "GET",
    path: "/api/v1/admin/questions",
    description: "Mengambil daftar butir soal dengan pagination dan filter",
    expectedStatus: [200]
  },
  {
    id: "TC-BNK-004",
    module: "Bank Soal",
    method: "POST",
    path: "/api/v1/admin/questions",
    description: "Membuat butir soal baru (stimulus, opsi jawaban, pembahasan nalar)",
    body: {
      submaterialId: 1,
      cognitiveLevel: 1,
      questionText: "Berapa hasil dari 5 + 3?",
      solutionDiscussion: "5 + 3 = 8",
      options: [
        { key: "A", content: "8", isCorrect: true },
        { key: "B", content: "7", isCorrect: false }
      ]
    },
    expectedStatus: [200, 201]
  },
  {
    id: "TC-BNK-005",
    module: "Bank Soal",
    method: "GET",
    path: "/api/v1/admin/questions/1",
    description: "Mengambil detail lengkap butir soal",
    expectedStatus: [200]
  },
  {
    id: "TC-BNK-006",
    module: "Bank Soal",
    method: "PATCH",
    path: "/api/v1/admin/questions/1",
    description: "Mengedit konten stimulus atau kunci jawaban butir soal",
    body: {
      question_text: "Berapa hasil dari 5 + 5?"
    },
    expectedStatus: [200]
  },
  {
    id: "TC-BNK-007",
    module: "Bank Soal",
    method: "PATCH",
    path: "/api/v1/admin/questions/1/status",
    description: "Mengubah status aktif / nonaktif butir soal",
    body: {
      is_active: false
    },
    expectedStatus: [200]
  },
  {
    id: "TC-BNK-008",
    module: "Bank Soal",
    method: "POST",
    path: "/api/v1/admin/question-images",
    description: "Upload gambar pendukung stimulus soal (multipart/form-data)",
    isFormData: true,
    expectedStatus: [200, 201]
  },

  // ==========================================================
  // 10. PAKET SIMULASI (Admin)
  // ==========================================================
  {
    id: "TC-PKT-001",
    module: "Paket Simulasi",
    method: "GET",
    path: "/api/v1/admin/simulation-packages",
    description: "Mengambil daftar paket simulasi ujian TKA terdaftar",
    expectedStatus: [200]
  },
  {
    id: "TC-PKT-002",
    module: "Paket Simulasi",
    method: "POST",
    path: "/api/v1/admin/simulation-packages",
    description: "Membuat paket simulasi baru (paket 30 butir soal)",
    body: {
      subject_id: 1,
      title: "Paket Simulasi Mandiri 1",
      package_code: "SIM-MAT-01",
      questions: Array.from({ length: 30 }, (_, i) => ({
        question_id: i + 1,
        question_order: i + 1
      }))
    },
    expectedStatus: [200, 201]
  },
  {
    id: "TC-PKT-003",
    module: "Paket Simulasi",
    method: "GET",
    path: "/api/v1/admin/simulation-packages/1",
    description: "Mengambil detail paket simulasi dan susunan butir soal",
    expectedStatus: [200]
  },
  {
    id: "TC-PKT-004",
    module: "Paket Simulasi",
    method: "PATCH",
    path: "/api/v1/admin/simulation-packages/1",
    description: "Mengubah konfigurasi paket simulasi",
    body: {
      name: "Paket Simulasi Matematika Revisi"
    },
    expectedStatus: [200]
  },
  {
    id: "TC-PKT-005",
    module: "Paket Simulasi",
    method: "PATCH",
    path: "/api/v1/admin/simulation-packages/1/status",
    description: "Mengubah status publish / nonaktif paket simulasi",
    body: {
      isPublished: true
    },
    expectedStatus: [200]
  },
  {
    id: "TC-PKT-006",
    module: "Paket Simulasi",
    method: "GET",
    path: "/api/v1/admin/simulation-packages/1/stats",
    description: "Mengambil statistik jumlah peserta dan rata-rata nilai paket simulasi",
    expectedStatus: [200]
  }
];

// ==========================================================
// TEST EXECUTION RUNNER
// ==========================================================
async function runTestSuite() {
  console.log("===============================================================================");
  console.log("             AGRA AUTOMATED API TEST RUNNER - OPENAPI v2.0.0                  ");
  console.log("===============================================================================");
  console.log(` Target Server : ${BASE_URL}`);
  console.log(` Total Cases   : ${testCases.length} API Endpoints`);
  console.log(` Auth Header   : Cookie (Better Auth Session Token)`);
  console.log(` Timestamp     : ${new Date().toISOString()}`);
  console.log("-------------------------------------------------------------------------------\n");

  let passCount = 0;
  let failCount = 0;
  const startTime = Date.now();

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const url = `${BASE_URL}${tc.path}`;
    const tStart = Date.now();

    const fetchHeaders: Record<string, string> = {
      "Accept": "application/json",
      ...(tc.headers || {})
    };

    if (!tc.isFormData) {
      fetchHeaders["Content-Type"] = "application/json";
    }

    // Attach auth session cookie for protected endpoints
    if (!tc.isPublic) {
      fetchHeaders["Cookie"] = AUTH_COOKIE;
    }

    const fetchOptions: RequestInit = {
      method: tc.method,
      headers: fetchHeaders
    };

    if (tc.isFormData) {
      const formData = new FormData();
      const dummyPng = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
      formData.append("image", new Blob([dummyPng], { type: "image/png" }), "stimulus.png");
      fetchOptions.body = formData;
    } else if (tc.body && ["POST", "PUT", "PATCH"].includes(tc.method)) {
      fetchOptions.body = JSON.stringify(tc.body);
    }

    try {
      const response = await fetch(url, fetchOptions);
      const latency = Date.now() - tStart;
      const isPassed = tc.expectedStatus.includes(response.status);

      if (isPassed) {
        passCount++;
        console.log(
          ` \x1b[32m[PASS]\x1b[0m ${tc.id.padEnd(12)} | ${tc.method.padEnd(6)} ${tc.path.padEnd(52)} | HTTP ${response.status} (${latency}ms)`
        );
      } else {
        failCount++;
        let errSnippet = "";
        try {
          const bodyTxt = await response.text();
          errSnippet = bodyTxt.substring(0, 100).replace(/\n/g, " ");
        } catch (_) {}
        console.log(
          ` \x1b[31m[FAIL]\x1b[0m ${tc.id.padEnd(12)} | ${tc.method.padEnd(6)} ${tc.path.padEnd(52)} | HTTP ${response.status} (Expected: ${tc.expectedStatus.join("/")}) | ${errSnippet}`
        );
      }
    } catch (err: any) {
      failCount++;
      const latency = Date.now() - tStart;
      console.log(
        ` \x1b[31m[ERR ]\x1b[0m ${tc.id.padEnd(12)} | ${tc.method.padEnd(6)} ${tc.path.padEnd(52)} | Error: ${err.message} (${latency}ms)`
      );
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  const passRate = ((passCount / testCases.length) * 100).toFixed(1);

  console.log("\n===============================================================================");
  console.log("                           TEST EXECUTION SUMMARY                              ");
  console.log("===============================================================================");
  console.log(` Total Executed : ${testCases.length}`);
  console.log(` Passed         : \x1b[32m${passCount}\x1b[0m`);
  console.log(` Failed         : \x1b[31m${failCount}\x1b[0m`);
  console.log(` Pass Rate      : \x1b[36m${passRate}%\x1b[0m`);
  console.log(` Duration       : ${duration}s`);
  console.log("===============================================================================\n");

  if (failCount > 0) {
    process.exitCode = 1;
  }
}

runTestSuite();

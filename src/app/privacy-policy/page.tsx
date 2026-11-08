import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ShieldCheck, ArrowLeft, Lock, Database, Globe, UserCheck, Mail, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi (Privacy Policy) - AGRA Platform',
  description: 'Kebijakan Privasi Resmi AGRA Platform Asesmen & Bimbel TKA Jenjang SMP/MTs. Perlindungan data siswa dan kepatuhan Google OAuth.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col">
      <Navbar />

      <main className="flex-1 py-10 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb & Navigation */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke Beranda</span>
            </Link>
          </div>

          {/* Document Header Card */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-sm mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100/80 px-3 py-1 text-xs font-bold text-blue-700 mb-4">
              <ShieldCheck className="h-4 w-4" />
              <span>Dokumen Kepatuhan & Privasi Resmi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-3">
              Kebijakan Privasi (Privacy Policy)
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Komitmen <strong>AGRA Platform</strong> dalam menjaga kerahasiaan, integritas, dan keamanan data pribadi siswa, guru, serta tenaga kependidikan dalam pelaksanaan asesmen dan pembelajaran mandiri berbasis kurikulum terstandar.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-4 border-t border-slate-100">
              <div><strong>Terakhir Diperbarui:</strong> 8 November 2026</div>
              <div>&bull;</div>
              <div><strong>Versi:</strong> 1.2 (Fase D SMP/MTs)</div>
            </div>
          </div>

          {/* Document Content */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-sm space-y-8 text-sm leading-relaxed text-slate-700">
            
            {/* Section 1 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5 text-base font-bold text-slate-900">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-extrabold text-xs">
                  1
                </div>
                <h2>Pendahuluan & Ruang Lingkup</h2>
              </div>
              <p>
                Selamat datang di <strong>AGRA Platform</strong> (&quot;kami&quot;, &quot;platform&quot;). AGRA adalah sistem pembelajaran mandiri dan Computer-Based Testing (CBT) adaptif yang dirancang untuk mendukung persiapan Tes Kemampuan Akademik (TKA) jenjang SMP/MTs (Fase D).
              </p>
              <p>
                Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi data pribadi Anda saat menggunakan situs web dan layanan kami. Dengan mengakses atau mendaftar di AGRA Platform, Anda menyetujui pengumpulan dan penggunaan informasi sesuai dengan kebijakan ini.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2.5 text-base font-bold text-slate-900">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-extrabold text-xs">
                  2
                </div>
                <h2>Informasi yang Kami Kumpulkan</h2>
              </div>
              <p>Kami hanya mengumpulkan informasi yang esensial untuk kebutuhan pembelajaran dan evaluasi asesmen akademik:</p>
              
              <div className="grid gap-3.5 sm:grid-cols-2 pt-2">
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 text-xs">
                    <UserCheck className="h-4 w-4 text-blue-600" />
                    <span>A. Data Identitas Akun</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    <li>Nama lengkap siswa / nama tampilan.</li>
                    <li>Alamat surat elektronik (email).</li>
                    <li>Username unik & kata sandi terenkripsi (hash).</li>
                    <li>Preset avatar profil yang dipilih.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 text-xs">
                    <Globe className="h-4 w-4 text-emerald-600" />
                    <span>B. Data Autentikasi Google</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    <li>Nama profil akun Google Anda.</li>
                    <li>Alamat email Google terverifikasi.</li>
                    <li>ID pengguna unik Google (Google Subject ID).</li>
                    <li><em>Catatan: Kami tidak pernah meminta kata sandi akun Google Anda.</em></li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 text-xs">
                    <Database className="h-4 w-4 text-indigo-600" />
                    <span>C. Data Pembelajaran & Asesmen CBT</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    <li>Lembar jawaban butir soal (Recall & Simulasi CBT).</li>
                    <li>Waktu pengerjaan dan pencatatan durasi ujian.</li>
                    <li>Skor penguasaan materi, level kognitif, XP, dan medali.</li>
                    <li>Riwayat dan status kelulusan submateri.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 text-xs">
                    <Lock className="h-4 w-4 text-amber-600" />
                    <span>D. Data Teknis & Sesi Login</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    <li>Cookie sesi terenkripsi (HTTP-Only).</li>
                    <li>Alamat IP dan data browser (User-Agent).</li>
                    <li>Digunakan untuk mencegah pembajakan akun dan login ganda (Single-Session Control).</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 - Google API Disclosure */}
            <section className="space-y-3 pt-6 border-t border-slate-100 bg-blue-50/40 p-5 rounded-xl border-blue-100">
              <div className="flex items-center gap-2 text-base font-bold text-blue-900">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                <h2>Kepatuhan Khusus Terhadap Kebijakan Data Pengguna Google API</h2>
              </div>
              <p className="text-xs sm:text-sm text-blue-950/90 leading-relaxed">
                Penggunaan informasi yang diterima AGRA Platform dari Google APIs sepenuhnya mematuhi{' '}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-700 underline hover:text-blue-800"
                >
                  Kebijakan Data Pengguna Layanan Google API (Google API Services User Data Policy)
                </a>
                , termasuk ketentuan <strong>Penggunaan Terbatas (Limited Use Requirements)</strong>:
              </p>
              <ul className="text-xs sm:text-sm text-blue-950/90 space-y-1.5 list-disc list-inside pt-1 font-medium">
                <li>Kami <strong>TIDAK PERNAH</strong> menjual, menyewakan, atau memperdagangkan data akun Google Anda kepada pihak ketiga.</li>
                <li>Kami <strong>TIDAK MENGGUNAKAN</strong> data Google untuk tujuan periklanan komersial atau profiling perilaku belanja.</li>
                <li>Data dari Google hanya digunakan semata-mata untuk memverifikasi identitas Anda agar Anda dapat masuk ke platform dengan aman.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-3 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2.5 text-base font-bold text-slate-900">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-extrabold text-xs">
                  3
                </div>
                <h2>Penggunaan Informasi</h2>
              </div>
              <p>Informasi yang kami kumpulkan digunakan secara eksklusif untuk:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Menyediakan layanan login, registrasi, dan pengelolaan sesi belajar Anda.</li>
                <li>Menyajikan soal ujian, mengoreksi lembar jawaban, dan mengalkulasi skor TKA secara akurat.</li>
                <li>Menghasilkan laporan kemajuan belajar individual (Dashboard Kompetensi & Tier Milestone).</li>
                <li>Mengirimkan email transaksional penting (verifikasi alamat email dan tautan pemulihan kata sandi).</li>
                <li>Menjaga integritas akademik ujian dari upaya kecurangan atau manipulasi teknis.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-3 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2.5 text-base font-bold text-slate-900">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-extrabold text-xs">
                  4
                </div>
                <h2>Penyimpanan dan Keamanan Data</h2>
              </div>
              <p>
                Keamanan data Anda adalah prioritas utama kami. Kami menerapkan langkah-langkah teknis dan organisasional berstandar industri:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li><strong>Enkripsi Transport (In-Transit):</strong> Seluruh pertukaran data dilindungi protokol HTTPS / TLS 1.3 modern.</li>
                <li><strong>Enkripsi Database:</strong> Database cloud terisolasi dalam jaringan privat dengan koneksi terenkripsi SSL.</li>
                <li><strong>Single-Session Concurrency Control:</strong> Sistem otomatis mencabut sesi login lama jika akun dibuka di perangkat baru secara bersamaan.</li>
                <li><strong>Hashing Kata Sandi:</strong> Kata sandi akun disimpan dalam bentuk hash kriptografi satu arah yang tidak dapat dibaca oleh staf pengelola sekali pun.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="space-y-3 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2.5 text-base font-bold text-slate-900">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-extrabold text-xs">
                  5
                </div>
                <h2>Hak dan Kendali Pengguna</h2>
              </div>
              <p>Anda memiliki hak penuh atas data pribadi Anda:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li><strong>Akses & Pembaruan:</strong> Anda dapat melihat dan memperbarui nama serta avatar profil kapan saja melalui menu Pengaturan Profil.</li>
                <li><strong>Penghapusan Akun & Data (Right to be Forgotten):</strong> Siswa atau pihak sekolah dapat mengajukan permohonan penghapusan akun dan seluruh rekaman asesmen secara permanen dengan menghubungi pengelola.</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="space-y-3 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2.5 text-base font-bold text-slate-900">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-extrabold text-xs">
                  6
                </div>
                <h2>Kontak Resmi Layanan Privasi</h2>
              </div>
              <p>
                Jika Anda memiliki pertanyaan, klarifikasi, atau permintaan penghapusan data seputar Kebijakan Privasi ini, silakan hubungi tim kami:
              </p>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-600 shrink-0" />
                <div className="text-xs sm:text-sm">
                  <div className="font-bold text-slate-900">Tim Dukungan AGRA Platform</div>
                  <div className="text-slate-600">Email: <a href="mailto:support@agra.sch.id" className="text-blue-600 underline">support@agra.sch.id</a> / <a href="mailto:admin@agra.sch.id" className="text-blue-600 underline">admin@agra.sch.id</a></div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

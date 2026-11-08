import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FileText, ArrowLeft, ShieldAlert, Award, Scale, CheckCircle2, Mail, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Ketentuan Layanan (Terms of Service) - AGRA Platform',
  description: 'Syarat dan Ketentuan Layanan Resmi Penggunaan AGRA Platform Asesmen & Bimbel TKA Jenjang SMP/MTs.',
};

export default function TermsOfServicePage() {
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
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100/80 px-3 py-1 text-xs font-bold text-indigo-700 mb-4">
              <Scale className="h-4 w-4" />
              <span>Syarat & Tata Tertib Penggunaan Platform</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-3">
              Ketentuan Layanan (Terms of Service)
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Perjanjian hukum yang mengikat antara pengguna (siswa, guru, dan sekolah) dengan <strong>AGRA Platform</strong> mengenai hak, kewajiban, dan tata tertib pelaksanaan asesmen akademik mandiri.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-4 border-t border-slate-100">
              <div><strong>Terakhir Diperbarui:</strong> 8 November 2026</div>
              <div>&bull;</div>
              <div><strong>Versi Ketentuan:</strong> 1.2 (Fase D SMP/MTs)</div>
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
                <h2>Penerimaan Ketentuan Layanan</h2>
              </div>
              <p>
                Dengan mendaftar, mengakses, atau menggunakan layanan pada <strong>AGRA Platform</strong> (&quot;Layanan&quot;), Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui untuk terikat oleh Ketentuan Layanan ini serta Kebijakan Privasi kami.
              </p>
              <p>
                Jika Anda berusia di bawah 18 tahun (siswa jenjang SMP/MTs), Anda menyatakan bahwa pendaftaran dan penggunaan platform ini telah diketahui dan disetujui oleh orang tua, wali, atau pihak sekolah/guru pembimbing Anda.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2.5 text-base font-bold text-slate-900">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-extrabold text-xs">
                  2
                </div>
                <h2>Pendaftaran Akun & Tanggung Jawab Keamanan</h2>
              </div>
              <ul className="list-disc list-inside space-y-2 text-slate-600">
                <li>
                  <strong>Keabsahan Data:</strong> Anda wajib memberikan informasi nama dan alamat email yang akurat dan aktif saat melakukan pendaftaran (baik melalui formulir pendaftaran maupun Single Sign-On Google).
                </li>
                <li>
                  <strong>Kerahasiaan Akun:</strong> Anda bertanggung jawab penuh untuk menjaga kerahasiaan kata sandi akun Anda. Anda dilarang memberikan, meminjamkan, atau menjual akun Anda kepada pihak mana pun.
                </li>
                <li>
                  <strong>Aturan Sesi Tunggal (Single-Session Rule):</strong> Untuk menjaga integritas data dan keamanan, sistem AGRA membatasi satu akun hanya dapat aktif pada satu sesi perangkat dalam satu waktu. Membuka akun di perangkat baru akan otomatis mengakhiri sesi di perangkat lama.
                </li>
                <li>
                  <strong>Pemberitahuan Pelanggaran:</strong> Anda wajib segera memberi tahu tim pengelola jika mencurigai adanya penggunaan tidak sah atas akun Anda.
                </li>
              </ul>
            </section>

            {/* Section 3 - CBT Rules */}
            <section className="space-y-3 pt-6 border-t border-slate-100 bg-amber-50/40 p-5 rounded-xl border border-amber-200/80">
              <div className="flex items-center gap-2 text-base font-bold text-amber-900">
                <ShieldAlert className="h-5 w-5 text-amber-600" />
                <h2>Tata Tertib & Kejujuran Akademik Ujian CBT</h2>
              </div>
              <p className="text-xs sm:text-sm text-amber-950/90 leading-relaxed">
                Platform AGRA dirancang untuk mengukur kompetensi akademik riil siswa secara objektif. Setiap peserta ujian wajib mematuhi kode etik berikut:
              </p>
              <ul className="text-xs sm:text-sm text-amber-950/90 space-y-1.5 list-disc list-inside pt-1 font-medium">
                <li><strong>Pengerjaan Mandiri:</strong> Seluruh soal ujian asesmen diagnostik, latihan level kognitif, dan simulasi CBT wajib dikerjakan secara mandiri tanpa bantuan pihak lain.</li>
                <li><strong>Larangan Alat Bantu Tidak Sah:</strong> Dilarang menggunakan alat kecerdasan buatan (AI), mesin pencari jawaban, bot otomatisasi, atau skrip manipulasi peramban selama simulasi berlangsung.</li>
                <li><strong>Larangan Pembocoran Soal:</strong> Dilarang mengambil tangkapan layar (screenshot), merekam video, menyalin teks soal atau stimulus bacaan untuk disebarluaskan ke pihak luar.</li>
                <li><strong>Sanksi Pelanggaran:</strong> Pelanggaran terhadap tata tertib ini berakibat pada pembatalan skor asesmen, reset progres capaian level, hingga penangguhan permanen akun siswa.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-3 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2.5 text-base font-bold text-slate-900">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-extrabold text-xs">
                  3
                </div>
                <h2>Hak Kekayaan Intelektual</h2>
              </div>
              <p>
                Seluruh materi yang terdapat di dalam AGRA Platform—termasuk namun tidak terbatas pada teks soal, stimulus bacaan, formula matematika (KaTeX), grafik kurikulum, logo AGRA, kode sumber, dan antarmuka pengguna—adalah hak milik eksklusif AGRA Platform dan/atau dilindungi oleh undang-undang hak cipta Republik Indonesia.
              </p>
              <p>
                Anda hanya diberikan hak terbatas, non-eksklusif, dan tidak dapat dipindahtangankan untuk mengakses materi semata-mata untuk keperluan belajar mandiri non-komersial.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-3 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2.5 text-base font-bold text-slate-900">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-extrabold text-xs">
                  4
                </div>
                <h2>Ketersediaan Layanan & Batasan Tanggung Jawab</h2>
              </div>
              <ul className="list-disc list-inside space-y-2 text-slate-600">
                <li>
                  <strong>Ketersediaan Sistem:</strong> Kami berupaya menjaga ketersediaan sistem 24/7. Namun, kami tidak menjamin bahwa Layanan akan selalu bebas dari gangguan teknis, perawatan server mendadak, atau masalah jaringan penyedia internet pengguna.
                </li>
                <li>
                  <strong>Penyimpanan Jawaban (Autosave):</strong> Sistem dilengkapi mekanisme autosave otomatis tiap butir soal. Pengguna disarankan memastikan koneksi internet stabil selama sesi ujian berlangsung.
                </li>
                <li>
                  <strong>Pembaruan Kurikulum:</strong> Materi soal dan struktur submateri dapat diperbarui secara berkala sesuai perkembangan standar kurikulum Kemendikdasmen tanpa pemberitahuan sebelumnya.
                </li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="space-y-3 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2.5 text-base font-bold text-slate-900">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-extrabold text-xs">
                  5
                </div>
                <h2>Perubahan Ketentuan Layanan</h2>
              </div>
              <p>
                Kami berhak untuk mengubah atau memperbarui Ketentuan Layanan ini sewaktu-waktu. Perubahan akan berlaku efektif segera setelah dipublikasikan pada halaman ini dengan tanggal pembaruan yang tercantum. Penggunaan berkelanjutan atas Layanan setelah perubahan dianggap sebagai persetujuan Anda terhadap ketentuan yang baru.
              </p>
            </section>

            {/* Section 7 */}
            <section className="space-y-3 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2.5 text-base font-bold text-slate-900">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-extrabold text-xs">
                  6
                </div>
                <h2>Hubungi Kami</h2>
              </div>
              <p>
                Jika Anda memiliki pertanyaan mengenai Ketentuan Layanan ini, silakan hubungi tim administrasi kami:
              </p>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                <Mail className="h-5 w-5 text-indigo-600 shrink-0" />
                <div className="text-xs sm:text-sm">
                  <div className="font-bold text-slate-900">Administrasi AGRA Platform</div>
                  <div className="text-slate-600">Email: <a href="mailto:admin@agra.sch.id" className="text-indigo-600 underline">admin@agra.sch.id</a> / <a href="mailto:legal@agra.sch.id" className="text-indigo-600 underline">legal@agra.sch.id</a></div>
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

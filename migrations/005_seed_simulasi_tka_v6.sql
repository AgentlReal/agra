-- =============================================================================
-- SEEDING PAKET SIMULASI TKA: MATEMATIKA & BAHASA INDONESIA (ERD V6.0)
-- Berkas: Migration/003_seed_simulasi_tka_v6.sql
-- Cakupan: 4 Paket Simulasi, 24 Stimuli, 120 Soal Master, 480 Opsi, 120 Pembahasan
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. PEMBENIHAN 4 PAKET SIMULASI RESMI (SIMULATIONS)
-- -----------------------------------------------------------------------------
INSERT INTO `simulations` (`id`, `subject_id`, `title`, `package_code`, `duration_minutes`, `total_questions`, `passing_score`, `xp_reward`, `status`, `is_active`) VALUES
(1, 1, 'Simulasi TKA Matematika - Paket 01', 'MAT-SIM-01', 75, 30, 90.00, 500, 'ACTIVE', TRUE),
(2, 1, 'Simulasi TKA Matematika - Paket 02', 'MAT-SIM-02', 75, 30, 90.00, 500, 'ACTIVE', TRUE),
(3, 2, 'Simulasi TKA Bahasa Indonesia - Paket 01', 'BIN-SIM-01', 75, 30, 90.00, 500, 'ACTIVE', TRUE),
(4, 2, 'Simulasi TKA Bahasa Indonesia - Paket 02', 'BIN-SIM-02', 75, 30, 90.00, 500, 'ACTIVE', TRUE)
ON DUPLICATE KEY UPDATE `subject_id` = VALUES(`subject_id`), `title` = VALUES(`title`), `package_code` = VALUES(`package_code`), `duration_minutes` = VALUES(`duration_minutes`), `total_questions` = VALUES(`total_questions`), `passing_score` = VALUES(`passing_score`), `xp_reward` = VALUES(`xp_reward`), `status` = VALUES(`status`), `is_active` = VALUES(`is_active`);

-- -----------------------------------------------------------------------------
-- 2. PEMBENIHAN WACANA BACAAN BERSAMA LITERASI (STIMULI - 24 Wacana)
-- -----------------------------------------------------------------------------
INSERT INTO `stimuli` (`id`, `subject_id`, `title`, `stimulus_text`, `stimulus_image_url`) VALUES
(1, 2, 'Kebun sekolah hemat air', 'Di kebun sekolah, warga dan siswa menjalankan program untuk menanam sayuran tanpa memboroskan air. Sebelumnya, mereka melihat bahwa kebiasaan kecil sering menimbulkan masalah yang lebih besar. Karena itu, pengurus mengajak peserta membicarakan kebutuhan bersama sebelum memilih langkah. Mereka mencatat keadaan awal, menentukan tugas, lalu menyepakati waktu kegiatan. Cara ini membuat setiap orang tahu alasan program tersebut dilakukan. Mereka juga memahami bahwa keberhasilan tidak hanya bergantung pada alat, tetapi pada kebiasaan yang dijalankan secara konsisten.

Langkah pertama ialah air hujan ditampung dalam drum tertutup. Setelah itu, peserta siswa memasang mulsa dari daun kering, sedangkan penyiraman dilakukan pagi hari. Pembagian tugas tersebut membuat pekerjaan lebih mudah dipantau. Selama kegiatan, pengurus mengumpulkan catatan sederhana agar perubahan dapat dibandingkan. Hasil pengamatan menunjukkan bahwa tanah tetap lembap dan tanaman tumbuh baik. Meski begitu, kegiatan belum selesai setelah hasil awal terlihat. Peserta masih perlu memeriksa keadaan secara berkala dan memperbaiki langkah yang kurang tepat. Dengan begitu, keputusan berikutnya didasarkan pada keadaan nyata, bukan dugaan semata.

Program ini juga mengajarkan bahwa perawatan bersama membuat kebun lebih teratur. Sebagai tindak lanjut, kelompok kebun mencatat jumlah air setiap pekan. Warga dapat menyampaikan saran jika menemukan kendala, lalu pengurus membahasnya bersama. Kegiatan tersebut tidak menuntut perubahan besar dalam satu hari. Kebiasaan yang mudah dilakukan justru lebih mungkin bertahan. Jika semua pihak ikut merawat hasilnya, manfaat program dapat dirasakan lebih lama. Pengalaman ini menunjukkan bahwa kerja sama, pencatatan, dan kepedulian saling melengkapi dalam menyelesaikan persoalan di lingkungan sekitar.', NULL),
(2, 2, 'Perpustakaan keliling', 'Di lapangan desa, warga dan siswa menjalankan program untuk mendekatkan bacaan kepada anak-anak. Sebelumnya, mereka melihat bahwa kebiasaan kecil sering menimbulkan masalah yang lebih besar. Karena itu, pengurus mengajak peserta membicarakan kebutuhan bersama sebelum memilih langkah. Mereka mencatat keadaan awal, menentukan tugas, lalu menyepakati waktu kegiatan. Cara ini membuat setiap orang tahu alasan program tersebut dilakukan. Mereka juga memahami bahwa keberhasilan tidak hanya bergantung pada alat, tetapi pada kebiasaan yang dijalankan secara konsisten.

Langkah pertama ialah sepeda motor membawa kotak buku. Setelah itu, peserta petugas mencatat peminjaman pada kartu, sedangkan anak dapat memilih buku selama dua pekan. Pembagian tugas tersebut membuat pekerjaan lebih mudah dipantau. Selama kegiatan, pengurus mengumpulkan catatan sederhana agar perubahan dapat dibandingkan. Hasil pengamatan menunjukkan bahwa jumlah peminjam bertambah setelah jadwal diumumkan. Meski begitu, kegiatan belum selesai setelah hasil awal terlihat. Peserta masih perlu memeriksa keadaan secara berkala dan memperbaiki langkah yang kurang tepat. Dengan begitu, keputusan berikutnya didasarkan pada keadaan nyata, bukan dugaan semata.

Program ini juga mengajarkan bahwa akses bacaan yang mudah mendorong kebiasaan membaca. Sebagai tindak lanjut, warga membantu menjaga buku tetap bersih. Warga dapat menyampaikan saran jika menemukan kendala, lalu pengurus membahasnya bersama. Kegiatan tersebut tidak menuntut perubahan besar dalam satu hari. Kebiasaan yang mudah dilakukan justru lebih mungkin bertahan. Jika semua pihak ikut merawat hasilnya, manfaat program dapat dirasakan lebih lama. Pengalaman ini menunjukkan bahwa kerja sama, pencatatan, dan kepedulian saling melengkapi dalam menyelesaikan persoalan di lingkungan sekitar.', NULL),
(3, 2, 'Bank sampah kelas', 'Di ruang belakang sekolah, warga dan siswa menjalankan program untuk mengurangi sampah yang tercampur. Sebelumnya, mereka melihat bahwa kebiasaan kecil sering menimbulkan masalah yang lebih besar. Karena itu, pengurus mengajak peserta membicarakan kebutuhan bersama sebelum memilih langkah. Mereka mencatat keadaan awal, menentukan tugas, lalu menyepakati waktu kegiatan. Cara ini membuat setiap orang tahu alasan program tersebut dilakukan. Mereka juga memahami bahwa keberhasilan tidak hanya bergantung pada alat, tetapi pada kebiasaan yang dijalankan secara konsisten.

Langkah pertama ialah siswa memilah kertas, botol, dan kaleng. Setelah itu, peserta setiap jenis disimpan dalam wadah berbeda, sedangkan petugas menimbang sampah setiap Jumat. Pembagian tugas tersebut membuat pekerjaan lebih mudah dipantau. Selama kegiatan, pengurus mengumpulkan catatan sederhana agar perubahan dapat dibandingkan. Hasil pengamatan menunjukkan bahwa hasil penjualan dipakai membeli bibit tanaman. Meski begitu, kegiatan belum selesai setelah hasil awal terlihat. Peserta masih perlu memeriksa keadaan secara berkala dan memperbaiki langkah yang kurang tepat. Dengan begitu, keputusan berikutnya didasarkan pada keadaan nyata, bukan dugaan semata.

Program ini juga mengajarkan bahwa kebiasaan memilah lebih berguna daripada sekadar mengumpulkan. Sebagai tindak lanjut, catatan berat membantu kelas melihat perubahan. Warga dapat menyampaikan saran jika menemukan kendala, lalu pengurus membahasnya bersama. Kegiatan tersebut tidak menuntut perubahan besar dalam satu hari. Kebiasaan yang mudah dilakukan justru lebih mungkin bertahan. Jika semua pihak ikut merawat hasilnya, manfaat program dapat dirasakan lebih lama. Pengalaman ini menunjukkan bahwa kerja sama, pencatatan, dan kepedulian saling melengkapi dalam menyelesaikan persoalan di lingkungan sekitar.', NULL),
(4, 2, 'Jalur aman ke sekolah', 'Di jalan utama kampung, warga dan siswa menjalankan program untuk membantu murid berjalan dengan aman. Sebelumnya, mereka melihat bahwa kebiasaan kecil sering menimbulkan masalah yang lebih besar. Karena itu, pengurus mengajak peserta membicarakan kebutuhan bersama sebelum memilih langkah. Mereka mencatat keadaan awal, menentukan tugas, lalu menyepakati waktu kegiatan. Cara ini membuat setiap orang tahu alasan program tersebut dilakukan. Mereka juga memahami bahwa keberhasilan tidak hanya bergantung pada alat, tetapi pada kebiasaan yang dijalankan secara konsisten.

Langkah pertama ialah warga menandai jalur pejalan kaki. Setelah itu, peserta pengendara diminta melambat dekat gerbang, sedangkan relawan berjaga saat jam masuk. Pembagian tugas tersebut membuat pekerjaan lebih mudah dipantau. Selama kegiatan, pengurus mengumpulkan catatan sederhana agar perubahan dapat dibandingkan. Hasil pengamatan menunjukkan bahwa jumlah kendaraan yang berhenti sembarangan menurun. Meski begitu, kegiatan belum selesai setelah hasil awal terlihat. Peserta masih perlu memeriksa keadaan secara berkala dan memperbaiki langkah yang kurang tepat. Dengan begitu, keputusan berikutnya didasarkan pada keadaan nyata, bukan dugaan semata.

Program ini juga mengajarkan bahwa keselamatan perlu kerja sama warga dan pengguna jalan. Sebagai tindak lanjut, murid tetap berjalan berpasangan. Warga dapat menyampaikan saran jika menemukan kendala, lalu pengurus membahasnya bersama. Kegiatan tersebut tidak menuntut perubahan besar dalam satu hari. Kebiasaan yang mudah dilakukan justru lebih mungkin bertahan. Jika semua pihak ikut merawat hasilnya, manfaat program dapat dirasakan lebih lama. Pengalaman ini menunjukkan bahwa kerja sama, pencatatan, dan kepedulian saling melengkapi dalam menyelesaikan persoalan di lingkungan sekitar.', NULL),
(5, 2, 'Kantin tanpa sisa', 'Di kantin sekolah, warga dan siswa menjalankan program untuk mengurangi makanan yang terbuang. Sebelumnya, mereka melihat bahwa kebiasaan kecil sering menimbulkan masalah yang lebih besar. Karena itu, pengurus mengajak peserta membicarakan kebutuhan bersama sebelum memilih langkah. Mereka mencatat keadaan awal, menentukan tugas, lalu menyepakati waktu kegiatan. Cara ini membuat setiap orang tahu alasan program tersebut dilakukan. Mereka juga memahami bahwa keberhasilan tidak hanya bergantung pada alat, tetapi pada kebiasaan yang dijalankan secara konsisten.

Langkah pertama ialah kantin menyediakan porsi kecil dan sedang. Setelah itu, peserta murid boleh menambah nasi bila masih lapar, sedangkan sisa makanan ditimbang setelah istirahat. Pembagian tugas tersebut membuat pekerjaan lebih mudah dipantau. Selama kegiatan, pengurus mengumpulkan catatan sederhana agar perubahan dapat dibandingkan. Hasil pengamatan menunjukkan bahwa sisa harian berkurang selama satu bulan. Meski begitu, kegiatan belum selesai setelah hasil awal terlihat. Peserta masih perlu memeriksa keadaan secara berkala dan memperbaiki langkah yang kurang tepat. Dengan begitu, keputusan berikutnya didasarkan pada keadaan nyata, bukan dugaan semata.

Program ini juga mengajarkan bahwa pilihan porsi membantu murid mengambil makanan secukupnya. Sebagai tindak lanjut, petugas kantin tetap menjaga kebersihan. Warga dapat menyampaikan saran jika menemukan kendala, lalu pengurus membahasnya bersama. Kegiatan tersebut tidak menuntut perubahan besar dalam satu hari. Kebiasaan yang mudah dilakukan justru lebih mungkin bertahan. Jika semua pihak ikut merawat hasilnya, manfaat program dapat dirasakan lebih lama. Pengalaman ini menunjukkan bahwa kerja sama, pencatatan, dan kepedulian saling melengkapi dalam menyelesaikan persoalan di lingkungan sekitar.', NULL),
(6, 2, 'Peta mata air desa', 'Di lereng desa, warga dan siswa menjalankan program untuk menjaga sumber air yang dipakai warga. Sebelumnya, mereka melihat bahwa kebiasaan kecil sering menimbulkan masalah yang lebih besar. Karena itu, pengurus mengajak peserta membicarakan kebutuhan bersama sebelum memilih langkah. Mereka mencatat keadaan awal, menentukan tugas, lalu menyepakati waktu kegiatan. Cara ini membuat setiap orang tahu alasan program tersebut dilakukan. Mereka juga memahami bahwa keberhasilan tidak hanya bergantung pada alat, tetapi pada kebiasaan yang dijalankan secara konsisten.

Langkah pertama ialah tim mencatat lokasi mata air dan jalur menuju sana. Setelah itu, peserta warga memasang papan larangan membuang sampah, sedangkan pemeriksaan dilakukan setiap awal bulan. Pembagian tugas tersebut membuat pekerjaan lebih mudah dipantau. Selama kegiatan, pengurus mengumpulkan catatan sederhana agar perubahan dapat dibandingkan. Hasil pengamatan menunjukkan bahwa air mengalir lebih jernih setelah area dibersihkan. Meski begitu, kegiatan belum selesai setelah hasil awal terlihat. Peserta masih perlu memeriksa keadaan secara berkala dan memperbaiki langkah yang kurang tepat. Dengan begitu, keputusan berikutnya didasarkan pada keadaan nyata, bukan dugaan semata.

Program ini juga mengajarkan bahwa data lokasi memudahkan warga merawat sumber air. Sebagai tindak lanjut, peta dibagikan kepada pengurus dusun. Warga dapat menyampaikan saran jika menemukan kendala, lalu pengurus membahasnya bersama. Kegiatan tersebut tidak menuntut perubahan besar dalam satu hari. Kebiasaan yang mudah dilakukan justru lebih mungkin bertahan. Jika semua pihak ikut merawat hasilnya, manfaat program dapat dirasakan lebih lama. Pengalaman ini menunjukkan bahwa kerja sama, pencatatan, dan kepedulian saling melengkapi dalam menyelesaikan persoalan di lingkungan sekitar.', NULL),
(7, 2, 'Ruang baca di halte', 'Di halte bus kota, warga dan siswa menjalankan program untuk mengisi waktu tunggu dengan kegiatan bermanfaat. Sebelumnya, mereka melihat bahwa kebiasaan kecil sering menimbulkan masalah yang lebih besar. Karena itu, pengurus mengajak peserta membicarakan kebutuhan bersama sebelum memilih langkah. Mereka mencatat keadaan awal, menentukan tugas, lalu menyepakati waktu kegiatan. Cara ini membuat setiap orang tahu alasan program tersebut dilakukan. Mereka juga memahami bahwa keberhasilan tidak hanya bergantung pada alat, tetapi pada kebiasaan yang dijalankan secara konsisten.

Langkah pertama ialah rak kecil berisi buku cerita dan majalah. Setelah itu, peserta pengunjung membaca di tempat, sedangkan relawan mengganti bacaan setiap dua minggu. Pembagian tugas tersebut membuat pekerjaan lebih mudah dipantau. Selama kegiatan, pengurus mengumpulkan catatan sederhana agar perubahan dapat dibandingkan. Hasil pengamatan menunjukkan bahwa halte terasa lebih nyaman bagi penumpang. Meski begitu, kegiatan belum selesai setelah hasil awal terlihat. Peserta masih perlu memeriksa keadaan secara berkala dan memperbaiki langkah yang kurang tepat. Dengan begitu, keputusan berikutnya didasarkan pada keadaan nyata, bukan dugaan semata.

Program ini juga mengajarkan bahwa fasilitas sederhana dapat memperkaya ruang umum. Sebagai tindak lanjut, papan aturan menjaga buku tetap rapi. Warga dapat menyampaikan saran jika menemukan kendala, lalu pengurus membahasnya bersama. Kegiatan tersebut tidak menuntut perubahan besar dalam satu hari. Kebiasaan yang mudah dilakukan justru lebih mungkin bertahan. Jika semua pihak ikut merawat hasilnya, manfaat program dapat dirasakan lebih lama. Pengalaman ini menunjukkan bahwa kerja sama, pencatatan, dan kepedulian saling melengkapi dalam menyelesaikan persoalan di lingkungan sekitar.', NULL),
(8, 2, 'Kompos dari daun', 'Di halaman sekolah, warga dan siswa menjalankan program untuk memanfaatkan daun gugur sebagai pupuk. Sebelumnya, mereka melihat bahwa kebiasaan kecil sering menimbulkan masalah yang lebih besar. Karena itu, pengurus mengajak peserta membicarakan kebutuhan bersama sebelum memilih langkah. Mereka mencatat keadaan awal, menentukan tugas, lalu menyepakati waktu kegiatan. Cara ini membuat setiap orang tahu alasan program tersebut dilakukan. Mereka juga memahami bahwa keberhasilan tidak hanya bergantung pada alat, tetapi pada kebiasaan yang dijalankan secara konsisten.

Langkah pertama ialah daun dicacah lalu dimasukkan ke wadah kompos. Setelah itu, peserta siswa mengaduk bahan dan menjaga kelembapannya, sedangkan kompos matang setelah beberapa pekan. Pembagian tugas tersebut membuat pekerjaan lebih mudah dipantau. Selama kegiatan, pengurus mengumpulkan catatan sederhana agar perubahan dapat dibandingkan. Hasil pengamatan menunjukkan bahwa pupuk digunakan pada tanaman kelas. Meski begitu, kegiatan belum selesai setelah hasil awal terlihat. Peserta masih perlu memeriksa keadaan secara berkala dan memperbaiki langkah yang kurang tepat. Dengan begitu, keputusan berikutnya didasarkan pada keadaan nyata, bukan dugaan semata.

Program ini juga mengajarkan bahwa pengolahan tepat mengubah sampah organik menjadi berguna. Sebagai tindak lanjut, bau berkurang karena bahan ditutup. Warga dapat menyampaikan saran jika menemukan kendala, lalu pengurus membahasnya bersama. Kegiatan tersebut tidak menuntut perubahan besar dalam satu hari. Kebiasaan yang mudah dilakukan justru lebih mungkin bertahan. Jika semua pihak ikut merawat hasilnya, manfaat program dapat dirasakan lebih lama. Pengalaman ini menunjukkan bahwa kerja sama, pencatatan, dan kepedulian saling melengkapi dalam menyelesaikan persoalan di lingkungan sekitar.', NULL),
(9, 2, 'Peringatan cuaca warga', 'Di balai kampung, warga dan siswa menjalankan program untuk membantu warga bersiap menghadapi hujan lebat. Sebelumnya, mereka melihat bahwa kebiasaan kecil sering menimbulkan masalah yang lebih besar. Karena itu, pengurus mengajak peserta membicarakan kebutuhan bersama sebelum memilih langkah. Mereka mencatat keadaan awal, menentukan tugas, lalu menyepakati waktu kegiatan. Cara ini membuat setiap orang tahu alasan program tersebut dilakukan. Mereka juga memahami bahwa keberhasilan tidak hanya bergantung pada alat, tetapi pada kebiasaan yang dijalankan secara konsisten.

Langkah pertama ialah relawan memantau informasi cuaca resmi. Setelah itu, peserta pesan dikirim melalui pengeras suara dan grup warga, sedangkan keluarga menyiapkan lampu serta dokumen penting. Pembagian tugas tersebut membuat pekerjaan lebih mudah dipantau. Selama kegiatan, pengurus mengumpulkan catatan sederhana agar perubahan dapat dibandingkan. Hasil pengamatan menunjukkan bahwa warga punya waktu lebih untuk mengamankan barang. Meski begitu, kegiatan belum selesai setelah hasil awal terlihat. Peserta masih perlu memeriksa keadaan secara berkala dan memperbaiki langkah yang kurang tepat. Dengan begitu, keputusan berikutnya didasarkan pada keadaan nyata, bukan dugaan semata.

Program ini juga mengajarkan bahwa informasi jelas membantu keputusan cepat. Sebagai tindak lanjut, pesan singkat menyebut waktu dan wilayah terdampak. Warga dapat menyampaikan saran jika menemukan kendala, lalu pengurus membahasnya bersama. Kegiatan tersebut tidak menuntut perubahan besar dalam satu hari. Kebiasaan yang mudah dilakukan justru lebih mungkin bertahan. Jika semua pihak ikut merawat hasilnya, manfaat program dapat dirasakan lebih lama. Pengalaman ini menunjukkan bahwa kerja sama, pencatatan, dan kepedulian saling melengkapi dalam menyelesaikan persoalan di lingkungan sekitar.', NULL),
(10, 2, 'Pasar hasil kebun', 'Di aula desa, warga dan siswa menjalankan program untuk mempertemukan petani dengan pembeli setempat. Sebelumnya, mereka melihat bahwa kebiasaan kecil sering menimbulkan masalah yang lebih besar. Karena itu, pengurus mengajak peserta membicarakan kebutuhan bersama sebelum memilih langkah. Mereka mencatat keadaan awal, menentukan tugas, lalu menyepakati waktu kegiatan. Cara ini membuat setiap orang tahu alasan program tersebut dilakukan. Mereka juga memahami bahwa keberhasilan tidak hanya bergantung pada alat, tetapi pada kebiasaan yang dijalankan secara konsisten.

Langkah pertama ialah petani membawa sayur yang dipanen pagi. Setelah itu, peserta harga dan asal kebun ditulis pada label, sedangkan pembeli dapat bertanya langsung kepada petani. Pembagian tugas tersebut membuat pekerjaan lebih mudah dipantau. Selama kegiatan, pengurus mengumpulkan catatan sederhana agar perubahan dapat dibandingkan. Hasil pengamatan menunjukkan bahwa lebih banyak hasil kebun terjual pada hari pasar. Meski begitu, kegiatan belum selesai setelah hasil awal terlihat. Peserta masih perlu memeriksa keadaan secara berkala dan memperbaiki langkah yang kurang tepat. Dengan begitu, keputusan berikutnya didasarkan pada keadaan nyata, bukan dugaan semata.

Program ini juga mengajarkan bahwa hubungan langsung membuat informasi produk lebih terbuka. Sebagai tindak lanjut, kemasan digunakan kembali oleh pengunjung. Warga dapat menyampaikan saran jika menemukan kendala, lalu pengurus membahasnya bersama. Kegiatan tersebut tidak menuntut perubahan besar dalam satu hari. Kebiasaan yang mudah dilakukan justru lebih mungkin bertahan. Jika semua pihak ikut merawat hasilnya, manfaat program dapat dirasakan lebih lama. Pengalaman ini menunjukkan bahwa kerja sama, pencatatan, dan kepedulian saling melengkapi dalam menyelesaikan persoalan di lingkungan sekitar.', NULL),
(11, 2, 'Pojok isi ulang air', 'Di koridor sekolah, warga dan siswa menjalankan program untuk mengurangi penggunaan botol sekali pakai. Sebelumnya, mereka melihat bahwa kebiasaan kecil sering menimbulkan masalah yang lebih besar. Karena itu, pengurus mengajak peserta membicarakan kebutuhan bersama sebelum memilih langkah. Mereka mencatat keadaan awal, menentukan tugas, lalu menyepakati waktu kegiatan. Cara ini membuat setiap orang tahu alasan program tersebut dilakukan. Mereka juga memahami bahwa keberhasilan tidak hanya bergantung pada alat, tetapi pada kebiasaan yang dijalankan secara konsisten.

Langkah pertama ialah murid membawa botol minum sendiri. Setelah itu, peserta petugas memeriksa kebersihan dispenser, sedangkan air tersedia saat jam istirahat. Pembagian tugas tersebut membuat pekerjaan lebih mudah dipantau. Selama kegiatan, pengurus mengumpulkan catatan sederhana agar perubahan dapat dibandingkan. Hasil pengamatan menunjukkan bahwa sampah botol di kelas berkurang. Meski begitu, kegiatan belum selesai setelah hasil awal terlihat. Peserta masih perlu memeriksa keadaan secara berkala dan memperbaiki langkah yang kurang tepat. Dengan begitu, keputusan berikutnya didasarkan pada keadaan nyata, bukan dugaan semata.

Program ini juga mengajarkan bahwa fasilitas baik perlu dirawat secara rutin. Sebagai tindak lanjut, jadwal pembersihan ditempel dekat dispenser. Warga dapat menyampaikan saran jika menemukan kendala, lalu pengurus membahasnya bersama. Kegiatan tersebut tidak menuntut perubahan besar dalam satu hari. Kebiasaan yang mudah dilakukan justru lebih mungkin bertahan. Jika semua pihak ikut merawat hasilnya, manfaat program dapat dirasakan lebih lama. Pengalaman ini menunjukkan bahwa kerja sama, pencatatan, dan kepedulian saling melengkapi dalam menyelesaikan persoalan di lingkungan sekitar.', NULL),
(12, 2, 'Lampu tenaga surya', 'Di taman lingkungan, warga dan siswa menjalankan program untuk menerangi jalan kecil pada malam hari. Sebelumnya, mereka melihat bahwa kebiasaan kecil sering menimbulkan masalah yang lebih besar. Karena itu, pengurus mengajak peserta membicarakan kebutuhan bersama sebelum memilih langkah. Mereka mencatat keadaan awal, menentukan tugas, lalu menyepakati waktu kegiatan. Cara ini membuat setiap orang tahu alasan program tersebut dilakukan. Mereka juga memahami bahwa keberhasilan tidak hanya bergantung pada alat, tetapi pada kebiasaan yang dijalankan secara konsisten.

Langkah pertama ialah panel menangkap cahaya matahari siang. Setelah itu, peserta baterai menyimpan energi untuk lampu, sedangkan warga membersihkan panel setiap pekan. Pembagian tugas tersebut membuat pekerjaan lebih mudah dipantau. Selama kegiatan, pengurus mengumpulkan catatan sederhana agar perubahan dapat dibandingkan. Hasil pengamatan menunjukkan bahwa jalan lebih mudah dilalui setelah gelap. Meski begitu, kegiatan belum selesai setelah hasil awal terlihat. Peserta masih perlu memeriksa keadaan secara berkala dan memperbaiki langkah yang kurang tepat. Dengan begitu, keputusan berikutnya didasarkan pada keadaan nyata, bukan dugaan semata.

Program ini juga mengajarkan bahwa pemilihan lokasi menentukan manfaat fasilitas. Sebagai tindak lanjut, lampu dipasang pada titik yang disepakati. Warga dapat menyampaikan saran jika menemukan kendala, lalu pengurus membahasnya bersama. Kegiatan tersebut tidak menuntut perubahan besar dalam satu hari. Kebiasaan yang mudah dilakukan justru lebih mungkin bertahan. Jika semua pihak ikut merawat hasilnya, manfaat program dapat dirasakan lebih lama. Pengalaman ini menunjukkan bahwa kerja sama, pencatatan, dan kepedulian saling melengkapi dalam menyelesaikan persoalan di lingkungan sekitar.', NULL),
(13, 2, 'Surat di dalam buku', 'Pada suatu sore, Nara berada di perpustakaan sekolah. Saat itu, ia menemukan bahwa sebuah surat lama terselip di buku pinjaman. Keadaan tersebut membuatnya berpikir tentang langkah yang harus dipilih. Ia ingin segera menyelesaikannya karena ia ingin mengembalikan surat kepada pemiliknya. Namun, Nara berhenti sejenak dan memperhatikan keadaan di sekelilingnya. Ia teringat pesan orang dewasa agar tidak bertindak terburu-buru. Di dekatnya ada beberapa orang yang mungkin dapat membantu. Meski merasa cemas, ia mencoba menenangkan diri dan menyusun rencana.

Mula-mula, Nara mencoba mencari tahu penyebab masalah. Kemudian, Nara bertanya kepada penjaga dan menelusuri cap tanggal. Proses itu tidak langsung berhasil; ada bagian yang perlu diulang dan ada pendapat yang harus didengarkan. Nara akhirnya memahami bahwa meminta bantuan bukan tanda kelemahan. Setelah semua bekerja sama, pemilik surat ditemukan sebagai Bu Ratih, guru yang dulu mengajar ibunya. Orang-orang di sekitarnya ikut merasa lega. Nara menyerahkan surat dengan hati-hati. Peristiwa tersebut membuat Nara menilai kembali sikapnya sebelum masalah muncul. Ia menyadari bahwa keputusan yang baik perlu mempertimbangkan akibat bagi orang lain.

Setelah kejadian itu, Nara menceritakannya kepada keluarga dan teman. Ia tidak menyombongkan diri karena semuanya berhasil berkat bantuan bersama. Sebaliknya, ia mengingat bagian yang sempat membuatnya ragu. Pengalaman itu mengubah cara pandangnya: ia memahami bahwa benda kecil dapat menyimpan kenangan besar. Sejak hari tersebut, ia berusaha lebih teliti saat menghadapi persoalan baru. Ia juga belajar bahwa rasa takut atau kecewa boleh muncul, tetapi keduanya tidak harus menentukan tindakan. Yang terpenting ialah memilih langkah yang bertanggung jawab dan mau belajar dari hasilnya.', NULL),
(14, 2, 'Layangan yang putus', 'Pada suatu sore, Bima berada di lapangan dekat rumah. Saat itu, ia menemukan bahwa layangan buatan adiknya tersangkut di pohon. Keadaan tersebut membuatnya berpikir tentang langkah yang harus dipilih. Ia ingin segera menyelesaikannya karena Bima semula ingin memanjat sendiri agar cepat selesai. Namun, Bima berhenti sejenak dan memperhatikan keadaan di sekelilingnya. Ia teringat pesan orang dewasa agar tidak bertindak terburu-buru. Di dekatnya ada beberapa orang yang mungkin dapat membantu. Meski merasa cemas, ia mencoba menenangkan diri dan menyusun rencana.

Mula-mula, Bima mencoba mencari tahu penyebab masalah. Kemudian, ia meminta bantuan tetangga membawa galah panjang. Proses itu tidak langsung berhasil; ada bagian yang perlu diulang dan ada pendapat yang harus didengarkan. Bima akhirnya memahami bahwa meminta bantuan bukan tanda kelemahan. Setelah semua bekerja sama, layangan turun tanpa merusak dahan. Orang-orang di sekitarnya ikut merasa lega. Bima meminta maaf karena tadi hampir bertindak gegabah. Peristiwa tersebut membuat Bima menilai kembali sikapnya sebelum masalah muncul. Ia menyadari bahwa keputusan yang baik perlu mempertimbangkan akibat bagi orang lain.

Setelah kejadian itu, Bima menceritakannya kepada keluarga dan teman. Ia tidak menyombongkan diri karena semuanya berhasil berkat bantuan bersama. Sebaliknya, ia mengingat bagian yang sempat membuatnya ragu. Pengalaman itu mengubah cara pandangnya: ia belajar bahwa keberanian juga berarti memilih cara aman. Sejak hari tersebut, ia berusaha lebih teliti saat menghadapi persoalan baru. Ia juga belajar bahwa rasa takut atau kecewa boleh muncul, tetapi keduanya tidak harus menentukan tindakan. Yang terpenting ialah memilih langkah yang bertanggung jawab dan mau belajar dari hasilnya.', NULL),
(15, 2, 'Kursi kosong di pentas', 'Pada suatu sore, Laras berada di aula sekolah. Saat itu, ia menemukan bahwa pemain utama pementasan tiba-tiba sakit. Keadaan tersebut membuatnya berpikir tentang langkah yang harus dipilih. Ia ingin segera menyelesaikannya karena Laras takut menggantikan teman karena belum hafal semua dialog. Namun, Laras berhenti sejenak dan memperhatikan keadaan di sekelilingnya. Ia teringat pesan orang dewasa agar tidak bertindak terburu-buru. Di dekatnya ada beberapa orang yang mungkin dapat membantu. Meski merasa cemas, ia mencoba menenangkan diri dan menyusun rencana.

Mula-mula, Laras mencoba mencari tahu penyebab masalah. Kemudian, ia berlatih bersama kelompok dan meminta tanda adegan. Proses itu tidak langsung berhasil; ada bagian yang perlu diulang dan ada pendapat yang harus didengarkan. Laras akhirnya memahami bahwa meminta bantuan bukan tanda kelemahan. Setelah semua bekerja sama, pentas berjalan lancar karena teman-teman saling membantu. Orang-orang di sekitarnya ikut merasa lega. Laras mengucapkan terima kasih setelah pertunjukan. Peristiwa tersebut membuat Laras menilai kembali sikapnya sebelum masalah muncul. Ia menyadari bahwa keputusan yang baik perlu mempertimbangkan akibat bagi orang lain.

Setelah kejadian itu, Laras menceritakannya kepada keluarga dan teman. Ia tidak menyombongkan diri karena semuanya berhasil berkat bantuan bersama. Sebaliknya, ia mengingat bagian yang sempat membuatnya ragu. Pengalaman itu mengubah cara pandangnya: ia menyadari kerja sama lebih penting daripada tampil sempurna. Sejak hari tersebut, ia berusaha lebih teliti saat menghadapi persoalan baru. Ia juga belajar bahwa rasa takut atau kecewa boleh muncul, tetapi keduanya tidak harus menentukan tindakan. Yang terpenting ialah memilih langkah yang bertanggung jawab dan mau belajar dari hasilnya.', NULL),
(16, 2, 'Kucing di bawah jembatan', 'Pada suatu sore, Dito berada di jalan kecil dekat sungai. Saat itu, ia menemukan bahwa seekor kucing terjebak saat hujan mulai turun. Keadaan tersebut membuatnya berpikir tentang langkah yang harus dipilih. Ia ingin segera menyelesaikannya karena Dito ingin menolong tetapi arus air semakin deras. Namun, Dito berhenti sejenak dan memperhatikan keadaan di sekelilingnya. Ia teringat pesan orang dewasa agar tidak bertindak terburu-buru. Di dekatnya ada beberapa orang yang mungkin dapat membantu. Meski merasa cemas, ia mencoba menenangkan diri dan menyusun rencana.

Mula-mula, Dito mencoba mencari tahu penyebab masalah. Kemudian, ia memanggil orang dewasa dan mengambil kardus kering. Proses itu tidak langsung berhasil; ada bagian yang perlu diulang dan ada pendapat yang harus didengarkan. Dito akhirnya memahami bahwa meminta bantuan bukan tanda kelemahan. Setelah semua bekerja sama, kucing berhasil dipindahkan ke tempat aman. Orang-orang di sekitarnya ikut merasa lega. Dito membuat tempat singgah bersama warga. Peristiwa tersebut membuat Dito menilai kembali sikapnya sebelum masalah muncul. Ia menyadari bahwa keputusan yang baik perlu mempertimbangkan akibat bagi orang lain.

Setelah kejadian itu, Dito menceritakannya kepada keluarga dan teman. Ia tidak menyombongkan diri karena semuanya berhasil berkat bantuan bersama. Sebaliknya, ia mengingat bagian yang sempat membuatnya ragu. Pengalaman itu mengubah cara pandangnya: kepedulian perlu disertai pertimbangan keselamatan. Sejak hari tersebut, ia berusaha lebih teliti saat menghadapi persoalan baru. Ia juga belajar bahwa rasa takut atau kecewa boleh muncul, tetapi keduanya tidak harus menentukan tindakan. Yang terpenting ialah memilih langkah yang bertanggung jawab dan mau belajar dari hasilnya.', NULL),
(17, 2, 'Benih untuk halaman', 'Pada suatu sore, Sita berada di rumah nenek di pinggir kota. Saat itu, ia menemukan bahwa benih bunga yang ditanam belum juga tumbuh. Keadaan tersebut membuatnya berpikir tentang langkah yang harus dipilih. Ia ingin segera menyelesaikannya karena Sita hampir membuang pot karena mengira benihnya gagal. Namun, Sita berhenti sejenak dan memperhatikan keadaan di sekelilingnya. Ia teringat pesan orang dewasa agar tidak bertindak terburu-buru. Di dekatnya ada beberapa orang yang mungkin dapat membantu. Meski merasa cemas, ia mencoba menenangkan diri dan menyusun rencana.

Mula-mula, Sita mencoba mencari tahu penyebab masalah. Kemudian, nenek menunjukkan catatan penyiraman dan posisi cahaya. Proses itu tidak langsung berhasil; ada bagian yang perlu diulang dan ada pendapat yang harus didengarkan. Sita akhirnya memahami bahwa meminta bantuan bukan tanda kelemahan. Setelah semua bekerja sama, tunas muncul beberapa hari kemudian. Orang-orang di sekitarnya ikut merasa lega. Sita menandai pot dan merawatnya dengan sabar. Peristiwa tersebut membuat Sita menilai kembali sikapnya sebelum masalah muncul. Ia menyadari bahwa keputusan yang baik perlu mempertimbangkan akibat bagi orang lain.

Setelah kejadian itu, Sita menceritakannya kepada keluarga dan teman. Ia tidak menyombongkan diri karena semuanya berhasil berkat bantuan bersama. Sebaliknya, ia mengingat bagian yang sempat membuatnya ragu. Pengalaman itu mengubah cara pandangnya: hasil baik kadang memerlukan waktu dan perhatian. Sejak hari tersebut, ia berusaha lebih teliti saat menghadapi persoalan baru. Ia juga belajar bahwa rasa takut atau kecewa boleh muncul, tetapi keduanya tidak harus menentukan tindakan. Yang terpenting ialah memilih langkah yang bertanggung jawab dan mau belajar dari hasilnya.', NULL),
(18, 2, 'Peta yang tertukar', 'Pada suatu sore, Rafi berada di museum kota. Saat itu, ia menemukan bahwa peta tugas kelompok tertukar dengan peta pengunjung. Keadaan tersebut membuatnya berpikir tentang langkah yang harus dipilih. Ia ingin segera menyelesaikannya karena Rafi merasa malu dan takut dimarahi teman. Namun, Rafi berhenti sejenak dan memperhatikan keadaan di sekelilingnya. Ia teringat pesan orang dewasa agar tidak bertindak terburu-buru. Di dekatnya ada beberapa orang yang mungkin dapat membantu. Meski merasa cemas, ia mencoba menenangkan diri dan menyusun rencana.

Mula-mula, Rafi mencoba mencari tahu penyebab masalah. Kemudian, ia mengikuti petunjuk nomor ruang dan bertanya kepada petugas. Proses itu tidak langsung berhasil; ada bagian yang perlu diulang dan ada pendapat yang harus didengarkan. Rafi akhirnya memahami bahwa meminta bantuan bukan tanda kelemahan. Setelah semua bekerja sama, kedua peta kembali kepada pemilik masing-masing. Orang-orang di sekitarnya ikut merasa lega. kelompok memperbaiki label sebelum melanjutkan tugas. Peristiwa tersebut membuat Rafi menilai kembali sikapnya sebelum masalah muncul. Ia menyadari bahwa keputusan yang baik perlu mempertimbangkan akibat bagi orang lain.

Setelah kejadian itu, Rafi menceritakannya kepada keluarga dan teman. Ia tidak menyombongkan diri karena semuanya berhasil berkat bantuan bersama. Sebaliknya, ia mengingat bagian yang sempat membuatnya ragu. Pengalaman itu mengubah cara pandangnya: kesalahan dapat diperbaiki dengan jujur dan tenang. Sejak hari tersebut, ia berusaha lebih teliti saat menghadapi persoalan baru. Ia juga belajar bahwa rasa takut atau kecewa boleh muncul, tetapi keduanya tidak harus menentukan tindakan. Yang terpenting ialah memilih langkah yang bertanggung jawab dan mau belajar dari hasilnya.', NULL),
(19, 2, 'Suara dari loteng', 'Pada suatu sore, Mira berada di rumah tua milik keluarga. Saat itu, ia menemukan bahwa bunyi berulang dari loteng membuat Mira penasaran. Keadaan tersebut membuatnya berpikir tentang langkah yang harus dipilih. Ia ingin segera menyelesaikannya karena ia membayangkan ada sesuatu yang menakutkan. Namun, Mira berhenti sejenak dan memperhatikan keadaan di sekelilingnya. Ia teringat pesan orang dewasa agar tidak bertindak terburu-buru. Di dekatnya ada beberapa orang yang mungkin dapat membantu. Meski merasa cemas, ia mencoba menenangkan diri dan menyusun rencana.

Mula-mula, Mira mencoba mencari tahu penyebab masalah. Kemudian, Mira mengajak kakaknya memeriksa dengan senter. Proses itu tidak langsung berhasil; ada bagian yang perlu diulang dan ada pendapat yang harus didengarkan. Mira akhirnya memahami bahwa meminta bantuan bukan tanda kelemahan. Setelah semua bekerja sama, bunyi ternyata berasal dari jendela yang tertiup angin. Orang-orang di sekitarnya ikut merasa lega. mereka memasang pengait lalu tertawa lega. Peristiwa tersebut membuat Mira menilai kembali sikapnya sebelum masalah muncul. Ia menyadari bahwa keputusan yang baik perlu mempertimbangkan akibat bagi orang lain.

Setelah kejadian itu, Mira menceritakannya kepada keluarga dan teman. Ia tidak menyombongkan diri karena semuanya berhasil berkat bantuan bersama. Sebaliknya, ia mengingat bagian yang sempat membuatnya ragu. Pengalaman itu mengubah cara pandangnya: rasa takut berkurang ketika fakta diperiksa. Sejak hari tersebut, ia berusaha lebih teliti saat menghadapi persoalan baru. Ia juga belajar bahwa rasa takut atau kecewa boleh muncul, tetapi keduanya tidak harus menentukan tindakan. Yang terpenting ialah memilih langkah yang bertanggung jawab dan mau belajar dari hasilnya.', NULL),
(20, 2, 'Sepatu untuk lomba', 'Pada suatu sore, Arman berada di halaman sekolah. Saat itu, ia menemukan bahwa sepatu Arman rusak menjelang lomba lari. Keadaan tersebut membuatnya berpikir tentang langkah yang harus dipilih. Ia ingin segera menyelesaikannya karena ia ingin meminjam sepatu baru milik temannya. Namun, Arman berhenti sejenak dan memperhatikan keadaan di sekelilingnya. Ia teringat pesan orang dewasa agar tidak bertindak terburu-buru. Di dekatnya ada beberapa orang yang mungkin dapat membantu. Meski merasa cemas, ia mencoba menenangkan diri dan menyusun rencana.

Mula-mula, Arman mencoba mencari tahu penyebab masalah. Kemudian, pelatih menyarankan memperbaiki sol dan berlatih dengan nyaman. Proses itu tidak langsung berhasil; ada bagian yang perlu diulang dan ada pendapat yang harus didengarkan. Arman akhirnya memahami bahwa meminta bantuan bukan tanda kelemahan. Setelah semua bekerja sama, sepatu lama dapat dipakai setelah diperbaiki. Orang-orang di sekitarnya ikut merasa lega. Arman menyelesaikan lomba tanpa mengejar juara. Peristiwa tersebut membuat Arman menilai kembali sikapnya sebelum masalah muncul. Ia menyadari bahwa keputusan yang baik perlu mempertimbangkan akibat bagi orang lain.

Setelah kejadian itu, Arman menceritakannya kepada keluarga dan teman. Ia tidak menyombongkan diri karena semuanya berhasil berkat bantuan bersama. Sebaliknya, ia mengingat bagian yang sempat membuatnya ragu. Pengalaman itu mengubah cara pandangnya: usaha dan sikap sportif lebih penting daripada perlengkapan mahal. Sejak hari tersebut, ia berusaha lebih teliti saat menghadapi persoalan baru. Ia juga belajar bahwa rasa takut atau kecewa boleh muncul, tetapi keduanya tidak harus menentukan tindakan. Yang terpenting ialah memilih langkah yang bertanggung jawab dan mau belajar dari hasilnya.', NULL),
(21, 2, 'Jaket berwarna kuning', 'Pada suatu sore, Tika berada di halte saat pulang sekolah. Saat itu, ia menemukan bahwa Tika menemukan jaket tertinggal di bangku. Keadaan tersebut membuatnya berpikir tentang langkah yang harus dipilih. Ia ingin segera menyelesaikannya karena ia takut pemiliknya sudah jauh pergi. Namun, Tika berhenti sejenak dan memperhatikan keadaan di sekelilingnya. Ia teringat pesan orang dewasa agar tidak bertindak terburu-buru. Di dekatnya ada beberapa orang yang mungkin dapat membantu. Meski merasa cemas, ia mencoba menenangkan diri dan menyusun rencana.

Mula-mula, Tika mencoba mencari tahu penyebab masalah. Kemudian, Tika menyerahkan jaket kepada petugas halte. Proses itu tidak langsung berhasil; ada bagian yang perlu diulang dan ada pendapat yang harus didengarkan. Tika akhirnya memahami bahwa meminta bantuan bukan tanda kelemahan. Setelah semua bekerja sama, pemilik datang kembali setelah mencari ke beberapa tempat. Orang-orang di sekitarnya ikut merasa lega. petugas mengembalikan jaket setelah cirinya cocok. Peristiwa tersebut membuat Tika menilai kembali sikapnya sebelum masalah muncul. Ia menyadari bahwa keputusan yang baik perlu mempertimbangkan akibat bagi orang lain.

Setelah kejadian itu, Tika menceritakannya kepada keluarga dan teman. Ia tidak menyombongkan diri karena semuanya berhasil berkat bantuan bersama. Sebaliknya, ia mengingat bagian yang sempat membuatnya ragu. Pengalaman itu mengubah cara pandangnya: kejujuran menjaga kepercayaan orang lain. Sejak hari tersebut, ia berusaha lebih teliti saat menghadapi persoalan baru. Ia juga belajar bahwa rasa takut atau kecewa boleh muncul, tetapi keduanya tidak harus menentukan tindakan. Yang terpenting ialah memilih langkah yang bertanggung jawab dan mau belajar dari hasilnya.', NULL),
(22, 2, 'Bintang di atap', 'Pada suatu sore, Yusuf berada di atap rumah pada malam cerah. Saat itu, ia menemukan bahwa Yusuf ingin mengamati bintang untuk tugas kelas. Keadaan tersebut membuatnya berpikir tentang langkah yang harus dipilih. Ia ingin segera menyelesaikannya karena awan menutupi langit dan membuatnya kecewa. Namun, Yusuf berhenti sejenak dan memperhatikan keadaan di sekelilingnya. Ia teringat pesan orang dewasa agar tidak bertindak terburu-buru. Di dekatnya ada beberapa orang yang mungkin dapat membantu. Meski merasa cemas, ia mencoba menenangkan diri dan menyusun rencana.

Mula-mula, Yusuf mencoba mencari tahu penyebab masalah. Kemudian, ayah mengajaknya mencatat bentuk awan sambil menunggu. Proses itu tidak langsung berhasil; ada bagian yang perlu diulang dan ada pendapat yang harus didengarkan. Yusuf akhirnya memahami bahwa meminta bantuan bukan tanda kelemahan. Setelah semua bekerja sama, langit terbuka menjelang malam larut. Orang-orang di sekitarnya ikut merasa lega. Yusuf mendapat catatan tambahan tentang perubahan cuaca. Peristiwa tersebut membuat Yusuf menilai kembali sikapnya sebelum masalah muncul. Ia menyadari bahwa keputusan yang baik perlu mempertimbangkan akibat bagi orang lain.

Setelah kejadian itu, Yusuf menceritakannya kepada keluarga dan teman. Ia tidak menyombongkan diri karena semuanya berhasil berkat bantuan bersama. Sebaliknya, ia mengingat bagian yang sempat membuatnya ragu. Pengalaman itu mengubah cara pandangnya: rencana dapat berubah tanpa membuat kegiatan kehilangan makna. Sejak hari tersebut, ia berusaha lebih teliti saat menghadapi persoalan baru. Ia juga belajar bahwa rasa takut atau kecewa boleh muncul, tetapi keduanya tidak harus menentukan tindakan. Yang terpenting ialah memilih langkah yang bertanggung jawab dan mau belajar dari hasilnya.', NULL),
(23, 2, 'Kartu ucapan untuk penjaga', 'Pada suatu sore, Ayu berada di gerbang sekolah. Saat itu, ia menemukan bahwa penjaga sekolah akan pindah tugas. Keadaan tersebut membuatnya berpikir tentang langkah yang harus dipilih. Ia ingin segera menyelesaikannya karena Ayu ingin mengucapkan terima kasih tetapi malu berbicara. Namun, Ayu berhenti sejenak dan memperhatikan keadaan di sekelilingnya. Ia teringat pesan orang dewasa agar tidak bertindak terburu-buru. Di dekatnya ada beberapa orang yang mungkin dapat membantu. Meski merasa cemas, ia mencoba menenangkan diri dan menyusun rencana.

Mula-mula, Ayu mencoba mencari tahu penyebab masalah. Kemudian, ia membuat kartu bersama teman-teman sekelas. Proses itu tidak langsung berhasil; ada bagian yang perlu diulang dan ada pendapat yang harus didengarkan. Ayu akhirnya memahami bahwa meminta bantuan bukan tanda kelemahan. Setelah semua bekerja sama, penjaga tersenyum membaca pesan mereka. Orang-orang di sekitarnya ikut merasa lega. Ayu akhirnya menyampaikan terima kasih secara langsung. Peristiwa tersebut membuat Ayu menilai kembali sikapnya sebelum masalah muncul. Ia menyadari bahwa keputusan yang baik perlu mempertimbangkan akibat bagi orang lain.

Setelah kejadian itu, Ayu menceritakannya kepada keluarga dan teman. Ia tidak menyombongkan diri karena semuanya berhasil berkat bantuan bersama. Sebaliknya, ia mengingat bagian yang sempat membuatnya ragu. Pengalaman itu mengubah cara pandangnya: perhatian sederhana dapat menguatkan hubungan. Sejak hari tersebut, ia berusaha lebih teliti saat menghadapi persoalan baru. Ia juga belajar bahwa rasa takut atau kecewa boleh muncul, tetapi keduanya tidak harus menentukan tindakan. Yang terpenting ialah memilih langkah yang bertanggung jawab dan mau belajar dari hasilnya.', NULL),
(24, 2, 'Bola di kebun tetangga', 'Pada suatu sore, Fajar berada di kebun sayur sebelah lapangan. Saat itu, ia menemukan bahwa bola Fajar jatuh di antara tanaman warga. Keadaan tersebut membuatnya berpikir tentang langkah yang harus dipilih. Ia ingin segera menyelesaikannya karena ia tergoda masuk diam-diam mengambilnya. Namun, Fajar berhenti sejenak dan memperhatikan keadaan di sekelilingnya. Ia teringat pesan orang dewasa agar tidak bertindak terburu-buru. Di dekatnya ada beberapa orang yang mungkin dapat membantu. Meski merasa cemas, ia mencoba menenangkan diri dan menyusun rencana.

Mula-mula, Fajar mencoba mencari tahu penyebab masalah. Kemudian, Fajar meminta izin dan menunggu pemilik kebun. Proses itu tidak langsung berhasil; ada bagian yang perlu diulang dan ada pendapat yang harus didengarkan. Fajar akhirnya memahami bahwa meminta bantuan bukan tanda kelemahan. Setelah semua bekerja sama, bola diambil tanpa merusak tanaman. Orang-orang di sekitarnya ikut merasa lega. pemilik kebun mengingatkan batas lapangan dengan ramah. Peristiwa tersebut membuat Fajar menilai kembali sikapnya sebelum masalah muncul. Ia menyadari bahwa keputusan yang baik perlu mempertimbangkan akibat bagi orang lain.

Setelah kejadian itu, Fajar menceritakannya kepada keluarga dan teman. Ia tidak menyombongkan diri karena semuanya berhasil berkat bantuan bersama. Sebaliknya, ia mengingat bagian yang sempat membuatnya ragu. Pengalaman itu mengubah cara pandangnya: mengakui kesalahan lebih baik daripada menambah masalah. Sejak hari tersebut, ia berusaha lebih teliti saat menghadapi persoalan baru. Ia juga belajar bahwa rasa takut atau kecewa boleh muncul, tetapi keduanya tidak harus menentukan tindakan. Yang terpenting ialah memilih langkah yang bertanggung jawab dan mau belajar dari hasilnya.', NULL)
ON DUPLICATE KEY UPDATE `subject_id` = VALUES(`subject_id`), `title` = VALUES(`title`), `stimulus_text` = VALUES(`stimulus_text`);

-- -----------------------------------------------------------------------------
-- 3. PEMBENIHAN MASTER BANK SOAL SIMULASI (QUESTION_BANKS - 120 Butir Soal)
-- -----------------------------------------------------------------------------
INSERT INTO `question_banks` (`id`, `subject_id`, `sub_material_id`, `cognitive_level_id`, `stimulus_id`, `bank_type`, `question_format`, `question_text`, `stimulus_image_url`, `is_active`) VALUES
(1, 1, 1, 1, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Manakah bilangan yang termasuk bilangan irasional?', NULL, TRUE),
(2, 1, 1, 1, NULL, 'SIMULATION', 'COMPLEX_CHOICE', 'Pilih semua pernyataan yang benar tentang bilangan −3, 0, dan 5/2.', NULL, TRUE),
(3, 1, 1, 1, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Urutan bilangan dari yang terkecil ke terbesar yang tepat adalah ….', NULL, TRUE),
(4, 1, 1, 1, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Nilai dari |−8| adalah ….', NULL, TRUE),
(5, 1, 1, 1, NULL, 'SIMULATION', 'COMPLEX_CHOICE', 'Pilih semua bilangan yang nilainya sama dengan 0,4.', NULL, TRUE),
(6, 1, 1, 2, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Suhu di kota P −3°C. Pada siang hari suhu naik 8°C. Berapa suhu siang hari?', NULL, TRUE),
(7, 1, 1, 2, NULL, 'SIMULATION', 'COMPLEX_CHOICE', 'Rina memiliki pita 3,6 m. Ia memakai 1,25 m lalu membeli lagi 0,8 m. Pilih semua pernyataan yang benar.', NULL, TRUE),
(8, 1, 1, 2, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Sebuah resep membutuhkan 3/4 kg tepung. Jika akan membuat 2 resep, banyak tepung yang diperlukan adalah ….', NULL, TRUE),
(9, 1, 1, 2, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Sebuah barang berharga Rp80.000 mendapat diskon 15%. Harga setelah diskon adalah ….', NULL, TRUE),
(10, 1, 1, 2, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Bak penampung berisi 2,4 liter air. Lalu dituangkan 3/5 liter ke gelas dan ditambah 450 mL air. Berapa banyak air di bak sekarang?', NULL, TRUE),
(11, 1, 1, 3, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Tanpa menghitung panjang, manakah yang lebih besar: √50 atau 7?', NULL, TRUE),
(12, 1, 1, 3, NULL, 'SIMULATION', 'COMPLEX_CHOICE', 'Pilih semua pernyataan yang selalu benar untuk bilangan real x.', NULL, TRUE),
(13, 1, 1, 3, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Nilai n adalah bilangan bulat. Jika −2 < n/3 < 1, nilai n yang mungkin adalah ….', NULL, TRUE),
(14, 1, 1, 3, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Tiga pecahan berikut dibandingkan: 5/8, 2/3, dan 3/5. Pecahan terbesar adalah ….', NULL, TRUE),
(15, 1, 1, 3, NULL, 'SIMULATION', 'COMPLEX_CHOICE', 'Sebuah bilangan real x memenuhi 1 < x < 2. Pilih semua kesimpulan yang pasti benar.', NULL, TRUE),
(16, 1, 2, 1, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Jika 3x + 5 = 20, nilai x adalah ….', NULL, TRUE),
(17, 1, 2, 2, NULL, 'SIMULATION', 'COMPLEX_CHOICE', 'Doni membeli 3 buku tulis seharga sama dan sebuah pensil Rp4.000. Total belanja Rp25.000. Pilih pernyataan yang benar.', NULL, TRUE),
(18, 1, 2, 3, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Panjang persegi panjang 3 cm lebih dari lebarnya. Kelilingnya 30 cm. Lebarnya adalah ….', NULL, TRUE),
(19, 1, 2, 1, NULL, 'SIMULATION', 'COMPLEX_CHOICE', 'Pilih semua nilai x yang memenuhi 2x − 1 ≤ 5.', NULL, TRUE),
(20, 1, 3, 1, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Bentuk sederhana dari 4a + 3a − 2 adalah ….', NULL, TRUE),
(21, 1, 3, 2, NULL, 'SIMULATION', 'COMPLEX_CHOICE', 'Diketahui p = 2 dan q = −3. Pilih semua pernyataan yang benar.', NULL, TRUE),
(22, 1, 3, 3, NULL, 'SIMULATION', 'COMPLEX_CHOICE', 'Sederhanakan 2(3x − 4) − (x + 5).', NULL, TRUE),
(23, 1, 3, 2, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Harga 1 roti adalah x rupiah. Harga 4 roti dan biaya kantong Rp2.000 dinyatakan dengan ….', NULL, TRUE),
(24, 1, 4, 1, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Jika f(x)=2x+1, maka f(3) adalah ….', NULL, TRUE),
(25, 1, 4, 2, NULL, 'SIMULATION', 'COMPLEX_CHOICE', 'Sebuah mesin mengubah masukan x menjadi keluaran f(x)=3x−2. Pilih semua pasangan masukan dan keluaran yang benar.', NULL, TRUE),
(26, 1, 4, 3, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Fungsi g(x)=ax+4 memenuhi g(2)=10. Nilai g(5) adalah ….', NULL, TRUE),
(27, 1, 4, 1, NULL, 'SIMULATION', 'COMPLEX_CHOICE', 'Diberikan fungsi h(x)=x². Pilih semua pernyataan yang benar.', NULL, TRUE),
(28, 1, 5, 1, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Tiga suku berikutnya dari barisan 4, 7, 10, 13, … adalah ….', NULL, TRUE),
(29, 1, 5, 2, NULL, 'SIMULATION', 'COMPLEX_CHOICE', 'Mira menabung Rp5.000 pada minggu pertama dan menambah tabungan mingguan sebesar Rp2.000 setiap minggu. Pilih pernyataan benar untuk minggu ke-4.', NULL, TRUE),
(30, 1, 5, 3, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Pola 2, 6, 18, 54, … berlanjut dengan mengalikan setiap suku dengan 3. Suku ke-6 adalah ….', NULL, TRUE),
(31, 1, 6, 1, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Jumlah sudut dalam sebuah segitiga adalah ….', NULL, TRUE),
(32, 1, 6, 2, NULL, 'SIMULATION', 'COMPLEX_CHOICE', 'Segitiga memiliki sudut 48° dan 67°. Pilih semua pernyataan benar.', NULL, TRUE),
(33, 1, 6, 3, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Dua garis sejajar dipotong sebuah garis. Jika salah satu sudut sehadap 112°, sudut sehadap pasangannya adalah ….', NULL, TRUE),
(34, 1, 6, 1, NULL, 'SIMULATION', 'COMPLEX_CHOICE', 'Pilih semua bangun yang memiliki tepat 4 sisi.', NULL, TRUE),
(35, 1, 6, 2, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Sebuah persegi memiliki panjang sisi 9 cm. Kelilingnya adalah ….', NULL, TRUE),
(36, 1, 7, 1, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Titik P(2,−3) dicerminkan terhadap sumbu-x. Bayangan titik P adalah ….', NULL, TRUE),
(37, 1, 7, 2, NULL, 'SIMULATION', 'COMPLEX_CHOICE', 'Titik A(−1,4) ditranslasikan oleh (3,−2). Pilih pernyataan benar.', NULL, TRUE),
(38, 1, 7, 3, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Titik (−2,5) diputar 180° terhadap pusat O(0,0). Koordinat bayangannya adalah ….', NULL, TRUE),
(39, 1, 7, 1, NULL, 'SIMULATION', 'COMPLEX_CHOICE', 'Pilih semua transformasi yang mempertahankan bentuk dan ukuran bangun.', NULL, TRUE),
(40, 1, 7, 2, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Segitiga dengan titik A(1,1), B(3,1), C(1,4) dicerminkan pada sumbu-y. Koordinat A′ adalah ….', NULL, TRUE),
(41, 1, 8, 1, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Luas persegi panjang berukuran 8 cm × 5 cm adalah ….', NULL, TRUE),
(42, 1, 8, 2, NULL, 'SIMULATION', 'COMPLEX_CHOICE', 'Sebuah taman berbentuk persegi panjang berukuran 12 m × 7 m. Pilih semua pernyataan benar.', NULL, TRUE),
(43, 1, 8, 3, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Sebuah kubus memiliki panjang rusuk 4 cm. Volume dan luas permukaannya berturut-turut adalah ….', NULL, TRUE),
(44, 1, 8, 1, NULL, 'SIMULATION', 'COMPLEX_CHOICE', 'Pilih semua konversi yang benar.', NULL, TRUE),
(45, 1, 8, 2, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Sebuah tabung berjari-jari 7 cm dan tinggi 10 cm. Gunakan π=22/7. Volumenya adalah ….', NULL, TRUE),
(46, 1, 9, 1, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Data nilai: 6, 7, 7, 8, 9. Modus data tersebut adalah ….', NULL, TRUE),
(47, 1, 9, 2, NULL, 'SIMULATION', 'COMPLEX_CHOICE', 'Data banyak buku yang dibaca lima siswa adalah 2, 4, 3, 5, dan 6. Pilih semua pernyataan benar.', NULL, TRUE),
(48, 1, 9, 3, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Rata-rata dari 4, 6, 8, dan x adalah 7. Nilai x adalah ….', NULL, TRUE),
(49, 1, 9, 1, NULL, 'SIMULATION', 'COMPLEX_CHOICE', 'Pilih semua pernyataan yang benar tentang diagram batang.', NULL, TRUE),
(50, 1, 9, 2, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Data pengunjung perpustakaan Senin hingga Kamis berturut-turut 20, 25, 15, dan 30 orang. Jumlah pengunjung selama empat hari adalah ….', NULL, TRUE),
(51, 1, 9, 3, NULL, 'SIMULATION', 'COMPLEX_CHOICE', 'Nilai ulangan adalah 70, 75, 80, 85. Satu nilai ditambahkan dan rata-rata lima nilai menjadi 80. Pilih semua pernyataan benar.', NULL, TRUE),
(52, 1, 9, 1, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Nilai tengah dari data terurut 3, 5, 6, 8, 10 adalah ….', NULL, TRUE),
(53, 1, 9, 2, NULL, 'SIMULATION', 'COMPLEX_CHOICE', 'Diagram lingkaran menunjukkan 40% siswa memilih sepak bola, 25% memilih bulu tangkis, 20% memilih basket, dan sisanya memilih renang. Jika ada 200 siswa, pilih pernyataan benar.', NULL, TRUE),
(54, 1, 10, 1, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Sebuah dadu bersisi enam dilempar sekali. Peluang muncul angka genap adalah ….', NULL, TRUE),
(55, 1, 10, 2, NULL, 'SIMULATION', 'COMPLEX_CHOICE', 'Dalam kantong ada 3 kelereng merah, 2 biru, dan 5 kuning. Satu kelereng diambil acak. Pilih pernyataan benar.', NULL, TRUE),
(56, 1, 10, 3, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Sebuah koin dilempar dua kali. Peluang muncul tepat satu gambar adalah ….', NULL, TRUE),
(57, 1, 10, 1, NULL, 'SIMULATION', 'COMPLEX_CHOICE', 'Kotak berisi kartu bernomor 1 sampai 8. Satu kartu diambil acak. Pilih semua kejadian yang berpeluang 1/2.', NULL, TRUE),
(58, 1, 10, 2, NULL, 'SIMULATION', 'SINGLE_CHOICE', 'Roda putar dibagi menjadi 8 bagian sama besar: 3 merah, 2 biru, dan 3 hijau. Peluang jarum berhenti di warna biru adalah ….', NULL, TRUE),
(59, 1, 10, 3, NULL, 'SIMULATION', 'COMPLEX_CHOICE', 'Di kelas ada 12 siswa laki-laki dan 18 siswa perempuan. Seorang siswa dipilih acak. Pilih semua kesimpulan benar.', NULL, TRUE),
(60, 1, 10, 3, NULL, 'SIMULATION', 'COMPLEX_CHOICE', 'Dua dadu bersisi enam dilempar bersamaan. Pilih semua jumlah mata dadu yang peluangnya sama besar.', NULL, TRUE),
(61, 2, 11, 1, 1, 'SIMULATION', 'SINGLE_CHOICE', 'Dalam bacaan “Kebun sekolah hemat air”, frasa “keadaan awal” paling tepat merujuk pada ...', NULL, TRUE),
(62, 2, 11, 2, 1, 'SIMULATION', 'COMPLEX_CHOICE', 'Informasi penting yang sesuai dengan bacaan tentang kebun sekolah hemat air adalah ...

Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(63, 2, 11, 3, 1, 'SIMULATION', 'SINGLE_CHOICE', 'Kerangka informasi yang paling sesuai untuk bacaan “Kebun sekolah hemat air” adalah ...', NULL, TRUE),
(64, 2, 11, 1, 2, 'SIMULATION', 'COMPLEX_CHOICE', 'Dalam bacaan “Perpustakaan keliling”, frasa “keadaan awal” paling tepat merujuk pada ...

Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(65, 2, 11, 2, 2, 'SIMULATION', 'SINGLE_CHOICE', 'Informasi penting yang sesuai dengan bacaan tentang perpustakaan keliling adalah ...', NULL, TRUE),
(66, 2, 11, 3, 2, 'SIMULATION', 'COMPLEX_CHOICE', 'Kerangka informasi yang paling sesuai untuk bacaan “Perpustakaan keliling” adalah ...

Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(67, 2, 11, 1, 3, 'SIMULATION', 'SINGLE_CHOICE', 'Dalam bacaan “Bank sampah kelas”, frasa “keadaan awal” paling tepat merujuk pada ...', NULL, TRUE),
(68, 2, 11, 2, 3, 'SIMULATION', 'COMPLEX_CHOICE', 'Informasi penting yang sesuai dengan bacaan tentang bank sampah kelas adalah ...

Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(69, 2, 11, 3, 3, 'SIMULATION', 'SINGLE_CHOICE', 'Kerangka informasi yang paling sesuai untuk bacaan “Bank sampah kelas” adalah ...', NULL, TRUE),
(70, 2, 11, 1, 4, 'SIMULATION', 'COMPLEX_CHOICE', 'Dalam bacaan “Jalur aman ke sekolah”, frasa “keadaan awal” paling tepat merujuk pada ...

Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(71, 2, 12, 1, 5, 'SIMULATION', 'SINGLE_CHOICE', 'Kesimpulan tersirat yang paling tepat dari bacaan “Kantin tanpa sisa” adalah ...', NULL, TRUE),
(72, 2, 12, 2, 5, 'SIMULATION', 'COMPLEX_CHOICE', 'Hubungan antara pencatatan dan keputusan dalam bacaan tersebut adalah ...

Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(73, 2, 12, 3, 5, 'SIMULATION', 'SINGLE_CHOICE', 'Jika program kantin tanpa sisa diteruskan tanpa evaluasi, kemungkinan yang paling masuk akal adalah ...', NULL, TRUE),
(74, 2, 12, 1, 6, 'SIMULATION', 'COMPLEX_CHOICE', 'Kesimpulan tersirat yang paling tepat dari bacaan “Peta mata air desa” adalah ...

Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(75, 2, 12, 2, 6, 'SIMULATION', 'SINGLE_CHOICE', 'Hubungan antara pencatatan dan keputusan dalam bacaan tersebut adalah ...', NULL, TRUE),
(76, 2, 12, 3, 6, 'SIMULATION', 'COMPLEX_CHOICE', 'Jika program peta mata air desa diteruskan tanpa evaluasi, kemungkinan yang paling masuk akal adalah ...

Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(77, 2, 12, 1, 7, 'SIMULATION', 'SINGLE_CHOICE', 'Kesimpulan tersirat yang paling tepat dari bacaan “Ruang baca di halte” adalah ...', NULL, TRUE),
(78, 2, 12, 2, 7, 'SIMULATION', 'COMPLEX_CHOICE', 'Hubungan antara pencatatan dan keputusan dalam bacaan tersebut adalah ...

Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(79, 2, 12, 3, 7, 'SIMULATION', 'SINGLE_CHOICE', 'Jika program ruang baca di halte diteruskan tanpa evaluasi, kemungkinan yang paling masuk akal adalah ...', NULL, TRUE),
(80, 2, 12, 1, 8, 'SIMULATION', 'COMPLEX_CHOICE', 'Kesimpulan tersirat yang paling tepat dari bacaan “Kompos dari daun” adalah ...

Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(81, 2, 13, 1, 9, 'SIMULATION', 'SINGLE_CHOICE', 'Tindakan sehari-hari yang paling relevan dengan pesan bacaan “Peringatan cuaca warga” adalah ...', NULL, TRUE),
(82, 2, 13, 2, 9, 'SIMULATION', 'COMPLEX_CHOICE', 'Pilih semua penilaian yang sesuai dengan cara penyajian informasi pada bacaan.

Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(83, 2, 13, 3, 9, 'SIMULATION', 'SINGLE_CHOICE', 'Setelah membaca “Peringatan cuaca warga”, respons pembaca yang paling sesuai adalah ...', NULL, TRUE),
(84, 2, 13, 1, 10, 'SIMULATION', 'COMPLEX_CHOICE', 'Tindakan sehari-hari yang paling relevan dengan pesan bacaan “Pasar hasil kebun” adalah ...

Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(85, 2, 13, 2, 10, 'SIMULATION', 'SINGLE_CHOICE', 'Pilih semua penilaian yang sesuai dengan cara penyajian informasi pada bacaan.', NULL, TRUE),
(86, 2, 13, 3, 10, 'SIMULATION', 'COMPLEX_CHOICE', 'Setelah membaca “Pasar hasil kebun”, respons pembaca yang paling sesuai adalah ...

Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(87, 2, 13, 1, 11, 'SIMULATION', 'SINGLE_CHOICE', 'Tindakan sehari-hari yang paling relevan dengan pesan bacaan “Pojok isi ulang air” adalah ...', NULL, TRUE),
(88, 2, 13, 2, 11, 'SIMULATION', 'COMPLEX_CHOICE', 'Pilih semua penilaian yang sesuai dengan cara penyajian informasi pada bacaan.

Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(89, 2, 13, 3, 11, 'SIMULATION', 'SINGLE_CHOICE', 'Setelah membaca “Pojok isi ulang air”, respons pembaca yang paling sesuai adalah ...', NULL, TRUE),
(90, 2, 13, 1, 12, 'SIMULATION', 'COMPLEX_CHOICE', 'Tindakan sehari-hari yang paling relevan dengan pesan bacaan “Lampu tenaga surya” adalah ...

Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(91, 2, 14, 1, 13, 'SIMULATION', 'SINGLE_CHOICE', 'Keterangan yang paling tepat untuk mengenali latar cerita “Surat di dalam buku” adalah ...', NULL, TRUE),
(92, 2, 14, 2, 13, 'SIMULATION', 'COMPLEX_CHOICE', 'Informasi yang disebutkan secara langsung dalam cerita “Surat di dalam buku” adalah ...

Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(93, 2, 14, 3, 13, 'SIMULATION', 'SINGLE_CHOICE', 'Kerangka peristiwa yang paling sesuai untuk cerita “Surat di dalam buku” adalah ...', NULL, TRUE),
(94, 2, 14, 1, 14, 'SIMULATION', 'COMPLEX_CHOICE', 'Keterangan yang paling tepat untuk mengenali latar cerita “Layangan yang putus” adalah ...

Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(95, 2, 14, 2, 14, 'SIMULATION', 'SINGLE_CHOICE', 'Informasi yang disebutkan secara langsung dalam cerita “Layangan yang putus” adalah ...', NULL, TRUE),
(96, 2, 14, 3, 14, 'SIMULATION', 'COMPLEX_CHOICE', 'Kerangka peristiwa yang paling sesuai untuk cerita “Layangan yang putus” adalah ...

Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(97, 2, 14, 1, 15, 'SIMULATION', 'SINGLE_CHOICE', 'Keterangan yang paling tepat untuk mengenali latar cerita “Kursi kosong di pentas” adalah ...', NULL, TRUE),
(98, 2, 14, 2, 15, 'SIMULATION', 'COMPLEX_CHOICE', 'Informasi yang disebutkan secara langsung dalam cerita “Kursi kosong di pentas” adalah ...

Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(99, 2, 14, 3, 15, 'SIMULATION', 'SINGLE_CHOICE', 'Kerangka peristiwa yang paling sesuai untuk cerita “Kursi kosong di pentas” adalah ...', NULL, TRUE),
(100, 2, 14, 1, 16, 'SIMULATION', 'COMPLEX_CHOICE', 'Keterangan yang paling tepat untuk mengenali latar cerita “Kucing di bawah jembatan” adalah ...

Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(101, 2, 15, 1, 17, 'SIMULATION', 'SINGLE_CHOICE', 'Kesimpulan yang dapat ditarik dari cerita “Benih untuk halaman” adalah ...', NULL, TRUE),
(102, 2, 15, 2, 17, 'SIMULATION', 'COMPLEX_CHOICE', 'Hubungan tindakan Sita dengan penyelesaian konflik adalah ...

Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(103, 2, 15, 3, 17, 'SIMULATION', 'SINGLE_CHOICE', 'Jika Sita memilih diam dan tidak melakukan apa pun, kemungkinan yang paling masuk akal adalah ...', NULL, TRUE),
(104, 2, 15, 1, 18, 'SIMULATION', 'COMPLEX_CHOICE', 'Kesimpulan yang dapat ditarik dari cerita “Peta yang tertukar” adalah ...

Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(105, 2, 15, 2, 18, 'SIMULATION', 'SINGLE_CHOICE', 'Hubungan tindakan Rafi dengan penyelesaian konflik adalah ...', NULL, TRUE),
(106, 2, 15, 3, 18, 'SIMULATION', 'COMPLEX_CHOICE', 'Jika Rafi memilih diam dan tidak melakukan apa pun, kemungkinan yang paling masuk akal adalah ...

Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(107, 2, 15, 1, 19, 'SIMULATION', 'SINGLE_CHOICE', 'Kesimpulan yang dapat ditarik dari cerita “Suara dari loteng” adalah ...', NULL, TRUE),
(108, 2, 15, 2, 19, 'SIMULATION', 'COMPLEX_CHOICE', 'Hubungan tindakan Mira dengan penyelesaian konflik adalah ...

Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(109, 2, 15, 3, 19, 'SIMULATION', 'SINGLE_CHOICE', 'Jika Mira memilih diam dan tidak melakukan apa pun, kemungkinan yang paling masuk akal adalah ...', NULL, TRUE),
(110, 2, 15, 1, 20, 'SIMULATION', 'COMPLEX_CHOICE', 'Kesimpulan yang dapat ditarik dari cerita “Sepatu untuk lomba” adalah ...

Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(111, 2, 16, 1, 21, 'SIMULATION', 'SINGLE_CHOICE', 'Pengalaman tokoh paling relevan diterapkan ketika kita ...', NULL, TRUE),
(112, 2, 16, 2, 21, 'SIMULATION', 'COMPLEX_CHOICE', 'Pilih semua penilaian yang sesuai dengan hubungan peristiwa dan amanat cerita “Jaket berwarna kuning”.

Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(113, 2, 16, 3, 21, 'SIMULATION', 'SINGLE_CHOICE', 'Respons emosional yang paling wajar terhadap akhir cerita “Jaket berwarna kuning” adalah ...', NULL, TRUE),
(114, 2, 16, 1, 22, 'SIMULATION', 'COMPLEX_CHOICE', 'Pengalaman tokoh paling relevan diterapkan ketika kita ...

Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(115, 2, 16, 2, 22, 'SIMULATION', 'SINGLE_CHOICE', 'Pilih semua penilaian yang sesuai dengan hubungan peristiwa dan amanat cerita “Bintang di atap”.', NULL, TRUE),
(116, 2, 16, 3, 22, 'SIMULATION', 'COMPLEX_CHOICE', 'Respons emosional yang paling wajar terhadap akhir cerita “Bintang di atap” adalah ...

Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(117, 2, 16, 1, 23, 'SIMULATION', 'SINGLE_CHOICE', 'Pengalaman tokoh paling relevan diterapkan ketika kita ...', NULL, TRUE),
(118, 2, 16, 2, 23, 'SIMULATION', 'COMPLEX_CHOICE', 'Pilih semua penilaian yang sesuai dengan hubungan peristiwa dan amanat cerita “Kartu ucapan untuk penjaga”.

Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(119, 2, 16, 3, 23, 'SIMULATION', 'SINGLE_CHOICE', 'Respons emosional yang paling wajar terhadap akhir cerita “Kartu ucapan untuk penjaga” adalah ...', NULL, TRUE),
(120, 2, 16, 1, 24, 'SIMULATION', 'COMPLEX_CHOICE', 'Pengalaman tokoh paling relevan diterapkan ketika kita ...

Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE)
ON DUPLICATE KEY UPDATE `subject_id` = VALUES(`subject_id`), `sub_material_id` = VALUES(`sub_material_id`), `cognitive_level_id` = VALUES(`cognitive_level_id`), `stimulus_id` = VALUES(`stimulus_id`), `bank_type` = VALUES(`bank_type`), `question_format` = VALUES(`question_format`), `question_text` = VALUES(`question_text`), `is_active` = VALUES(`is_active`);

-- -----------------------------------------------------------------------------
-- 4. PEMBENIHAN PILIHAN JAWABAN (QUESTION_OPTIONS - 480 Opsi A-D)
-- -----------------------------------------------------------------------------
INSERT INTO `question_options` (`id`, `question_id`, `option_label`, `option_text`, `is_correct`) VALUES
(1, 1, 'A', '0,75', FALSE),
(2, 1, 'B', '√49', FALSE),
(3, 1, 'C', '√18', TRUE),
(4, 1, 'D', '−4', FALSE),
(5, 2, 'A', '−3 adalah bilangan bulat', TRUE),
(6, 2, 'B', '0 bukan bilangan rasional', FALSE),
(7, 2, 'C', '5/2 adalah bilangan rasional', TRUE),
(8, 2, 'D', 'Ketiganya bilangan irasional', FALSE),
(9, 3, 'A', '−2, −1/2, 0, 1,5', TRUE),
(10, 3, 'B', '−1/2, −2, 0, 1,5', FALSE),
(11, 3, 'C', '0, −2, −1/2, 1,5', FALSE),
(12, 3, 'D', '−2, 0, −1/2, 1,5', FALSE),
(13, 4, 'A', '−8', FALSE),
(14, 4, 'B', '0', FALSE),
(15, 4, 'C', '8', TRUE),
(16, 4, 'D', '16', FALSE),
(17, 5, 'A', '2/5', TRUE),
(18, 5, 'B', '40%', TRUE),
(19, 5, 'C', '4/100', FALSE),
(20, 5, 'D', '0,40', TRUE),
(21, 6, 'A', '−11°C', FALSE),
(22, 6, 'B', '−5°C', FALSE),
(23, 6, 'C', '5°C', TRUE),
(24, 6, 'D', '11°C', FALSE),
(25, 7, 'A', 'Sisa pita setelah dipakai adalah 2,35 m', TRUE),
(26, 7, 'B', 'Setelah membeli, pita Rina berjumlah 3,15 m', TRUE),
(27, 7, 'C', 'Setelah membeli, pita Rina berjumlah 3,25 m', FALSE),
(28, 7, 'D', 'Panjang pita awal sama dengan 360 cm', TRUE),
(29, 8, 'A', '1 1/4 kg', FALSE),
(30, 8, 'B', '1 1/2 kg', TRUE),
(31, 8, 'C', '2 1/4 kg', FALSE),
(32, 8, 'D', '3 kg', FALSE),
(33, 9, 'A', 'Rp12.000', FALSE),
(34, 9, 'B', 'Rp65.000', FALSE),
(35, 9, 'C', 'Rp68.000', TRUE),
(36, 9, 'D', 'Rp92.000', FALSE),
(37, 10, 'A', '1,8 liter', FALSE),
(38, 10, 'B', '2,1 liter', FALSE),
(39, 10, 'C', '2,25 liter', TRUE),
(40, 10, 'D', '2,85 liter', FALSE),
(41, 11, 'A', '√50, karena 50 lebih besar dari 49', TRUE),
(42, 11, 'B', '7, karena 7 lebih besar dari 5', FALSE),
(43, 11, 'C', 'Keduanya sama', FALSE),
(44, 11, 'D', 'Tidak dapat dibandingkan', FALSE),
(45, 12, 'A', '|x| ≥ 0', TRUE),
(46, 12, 'B', 'x² ≥ 0', TRUE),
(47, 12, 'C', 'Jika x < 0, maka |x| = x', FALSE),
(48, 12, 'D', 'Jika x = −a dengan a > 0, maka |x| = a', TRUE),
(49, 13, 'A', '−7', FALSE),
(50, 13, 'B', '−6', FALSE),
(51, 13, 'C', '0', TRUE),
(52, 13, 'D', '4', FALSE),
(53, 14, 'A', '5/8', FALSE),
(54, 14, 'B', '2/3', TRUE),
(55, 14, 'C', '3/5', FALSE),
(56, 14, 'D', 'Ketiganya sama', FALSE),
(57, 15, 'A', 'x² > 1', TRUE),
(58, 15, 'B', 'x + 3 < 5', TRUE),
(59, 15, 'C', '1/x > 1', FALSE),
(60, 15, 'D', '2x berada di antara 2 dan 4', TRUE),
(61, 16, 'A', '3', FALSE),
(62, 16, 'B', '5', TRUE),
(63, 16, 'C', '7', FALSE),
(64, 16, 'D', '25', FALSE),
(65, 17, 'A', 'Jika harga satu buku x, modelnya 3x + 4.000 = 25.000', TRUE),
(66, 17, 'B', 'Harga satu buku Rp7.000', TRUE),
(67, 17, 'C', 'Harga satu buku Rp9.000', FALSE),
(68, 17, 'D', 'Modelnya x + 4.000 = 25.000', FALSE),
(69, 18, 'A', '5 cm', FALSE),
(70, 18, 'B', '6 cm', TRUE),
(71, 18, 'C', '9 cm', FALSE),
(72, 18, 'D', '12 cm', FALSE),
(73, 19, 'A', '−1', TRUE),
(74, 19, 'B', '0', TRUE),
(75, 19, 'C', '3', TRUE),
(76, 19, 'D', '4', FALSE),
(77, 20, 'A', '7a − 2', TRUE),
(78, 20, 'B', '7a + 2', FALSE),
(79, 20, 'C', '5a', FALSE),
(80, 20, 'D', '9a − 2', FALSE),
(81, 21, 'A', 'p + q = −1', TRUE),
(82, 21, 'B', '2p − q = 1', FALSE),
(83, 21, 'C', 'pq = −6', TRUE),
(84, 21, 'D', 'p² + q = 1', TRUE),
(85, 22, 'A', '5x − 13', TRUE),
(86, 22, 'B', '5x − 3', FALSE),
(87, 22, 'C', '7x − 13', FALSE),
(88, 22, 'D', '7x − 3', FALSE),
(89, 23, 'A', '4 + x + 2.000', FALSE),
(90, 23, 'B', '4x + 2.000', TRUE),
(91, 23, 'C', '4(x + 2.000)', FALSE),
(92, 23, 'D', 'x + 8.000', FALSE),
(93, 24, 'A', '5', FALSE),
(94, 24, 'B', '6', FALSE),
(95, 24, 'C', '7', TRUE),
(96, 24, 'D', '9', FALSE),
(97, 25, 'A', 'x=0 menghasilkan −2', TRUE),
(98, 25, 'B', 'x=1 menghasilkan 1', TRUE),
(99, 25, 'C', 'x=2 menghasilkan 5', FALSE),
(100, 25, 'D', 'x=−1 menghasilkan 1', FALSE),
(101, 26, 'A', '13', FALSE),
(102, 26, 'B', '16', FALSE),
(103, 26, 'C', '19', TRUE),
(104, 26, 'D', '29', FALSE),
(105, 27, 'A', 'h(−2)=4', TRUE),
(106, 27, 'B', 'h(0)=0', TRUE),
(107, 27, 'C', 'h(3)=6', FALSE),
(108, 27, 'D', 'h(1)=1', TRUE),
(109, 28, 'A', '14, 15, 16', FALSE),
(110, 28, 'B', '16, 19, 22', TRUE),
(111, 28, 'C', '15, 18, 21', FALSE),
(112, 28, 'D', '17, 21, 25', FALSE),
(113, 29, 'A', 'Tabungan minggu ke-2 Rp7.000', TRUE),
(114, 29, 'B', 'Tabungan minggu ke-3 Rp9.000', TRUE),
(115, 29, 'C', 'Tabungan minggu ke-4 Rp11.000', TRUE),
(116, 29, 'D', 'Jumlah tabungan selama 4 minggu Rp32.000', FALSE),
(117, 30, 'A', '162', FALSE),
(118, 30, 'B', '324', FALSE),
(119, 30, 'C', '486', TRUE),
(120, 30, 'D', '648', FALSE),
(121, 31, 'A', '90°', FALSE),
(122, 31, 'B', '180°', TRUE),
(123, 31, 'C', '270°', FALSE),
(124, 31, 'D', '360°', FALSE),
(125, 32, 'A', 'Sudut ketiga 65°', TRUE),
(126, 32, 'B', 'Segitiga itu lancip', TRUE),
(127, 32, 'C', 'Jumlah dua sudut yang diketahui 115°', TRUE),
(128, 32, 'D', 'Sudut ketiga 75°', FALSE),
(129, 33, 'A', '68°', FALSE),
(130, 33, 'B', '78°', FALSE),
(131, 33, 'C', '112°', TRUE),
(132, 33, 'D', '180°', FALSE),
(133, 34, 'A', 'Persegi', TRUE),
(134, 34, 'B', 'Segitiga', FALSE),
(135, 34, 'C', 'Trapesium', TRUE),
(136, 34, 'D', 'Segi lima', FALSE),
(137, 35, 'A', '18 cm', FALSE),
(138, 35, 'B', '27 cm', FALSE),
(139, 35, 'C', '36 cm', TRUE),
(140, 35, 'D', '81 cm', FALSE),
(141, 36, 'A', '(−2,−3)', FALSE),
(142, 36, 'B', '(2,3)', TRUE),
(143, 36, 'C', '(−2,3)', FALSE),
(144, 36, 'D', '(3,2)', FALSE),
(145, 37, 'A', 'Koordinat x bayangan adalah 2', TRUE),
(146, 37, 'B', 'Koordinat y bayangan adalah 2', TRUE),
(147, 37, 'C', 'Bayangan A adalah (2,2)', TRUE),
(148, 37, 'D', 'Jarak titik ke bayangannya 5 satuan', FALSE),
(149, 38, 'A', '(2,−5)', TRUE),
(150, 38, 'B', '(−5,2)', FALSE),
(151, 38, 'C', '(2,5)', FALSE),
(152, 38, 'D', '(−2,−5)', FALSE),
(153, 39, 'A', 'Translasi', TRUE),
(154, 39, 'B', 'Rotasi', TRUE),
(155, 39, 'C', 'Dilatasi faktor 2', FALSE),
(156, 39, 'D', 'Refleksi', TRUE),
(157, 40, 'A', '(1,−1)', FALSE),
(158, 40, 'B', '(−1,1)', TRUE),
(159, 40, 'C', '(−1,−1)', FALSE),
(160, 40, 'D', '(1,1)', FALSE),
(161, 41, 'A', '13 cm²', FALSE),
(162, 41, 'B', '26 cm²', FALSE),
(163, 41, 'C', '40 cm²', TRUE),
(164, 41, 'D', '80 cm²', FALSE),
(165, 42, 'A', 'Luasnya 84 m²', TRUE),
(166, 42, 'B', 'Kelilingnya 38 m', TRUE),
(167, 42, 'C', 'Panjang pagar satu putaran 38 m', TRUE),
(168, 42, 'D', 'Luasnya 19 m²', FALSE),
(169, 43, 'A', '16 cm³ dan 64 cm²', FALSE),
(170, 43, 'B', '64 cm³ dan 96 cm²', TRUE),
(171, 43, 'C', '64 cm³ dan 16 cm²', FALSE),
(172, 43, 'D', '96 cm³ dan 64 cm²', FALSE),
(173, 44, 'A', '2,5 m = 250 cm', TRUE),
(174, 44, 'B', '1,2 kg = 1.200 g', TRUE),
(175, 44, 'C', '3 jam = 180 menit', TRUE),
(176, 44, 'D', '450 cm = 45 m', FALSE),
(177, 45, 'A', '440 cm³', FALSE),
(178, 45, 'B', '1.540 cm³', TRUE),
(179, 45, 'C', '3.080 cm³', FALSE),
(180, 45, 'D', '4.400 cm³', FALSE),
(181, 46, 'A', '6', FALSE),
(182, 46, 'B', '7', TRUE),
(183, 46, 'C', '8', FALSE),
(184, 46, 'D', '9', FALSE),
(185, 47, 'A', 'Rata-ratanya 4', TRUE),
(186, 47, 'B', 'Mediannya 4', TRUE),
(187, 47, 'C', 'Jangkauannya 4', TRUE),
(188, 47, 'D', 'Modusnya 3', FALSE),
(189, 48, 'A', '8', FALSE),
(190, 48, 'B', '9', FALSE),
(191, 48, 'C', '10', TRUE),
(192, 48, 'D', '12', FALSE),
(193, 49, 'A', 'Tinggi batang dapat menunjukkan banyak data', TRUE),
(194, 49, 'B', 'Setiap batang harus selalu memiliki tinggi sama', FALSE),
(195, 49, 'C', 'Kategori biasanya ditulis pada sumbu mendatar', TRUE),
(196, 49, 'D', 'Diagram batang cocok untuk membandingkan kategori', TRUE),
(197, 50, 'A', '75 orang', FALSE),
(198, 50, 'B', '80 orang', FALSE),
(199, 50, 'C', '90 orang', TRUE),
(200, 50, 'D', '100 orang', FALSE),
(201, 51, 'A', 'Jumlah lima nilai adalah 400', TRUE),
(202, 51, 'B', 'Nilai tambahan adalah 90', TRUE),
(203, 51, 'C', 'Nilai tambahan lebih besar daripada nilai tertinggi sebelumnya', TRUE),
(204, 51, 'D', 'Median lima nilai adalah 85', FALSE),
(205, 52, 'A', '5', FALSE),
(206, 52, 'B', '6', TRUE),
(207, 52, 'C', '7', FALSE),
(208, 52, 'D', '8', FALSE),
(209, 53, 'A', '80 siswa memilih sepak bola', TRUE),
(210, 53, 'B', '50 siswa memilih bulu tangkis', TRUE),
(211, 53, 'C', '30 siswa memilih renang', TRUE),
(212, 53, 'D', '50 siswa memilih basket', FALSE),
(213, 54, 'A', '1/6', FALSE),
(214, 54, 'B', '1/3', FALSE),
(215, 54, 'C', '1/2', TRUE),
(216, 54, 'D', '2/3', FALSE),
(217, 55, 'A', 'Peluang mengambil merah adalah 3/10', TRUE),
(218, 55, 'B', 'Peluang mengambil biru adalah 1/5', TRUE),
(219, 55, 'C', 'Peluang mengambil kuning adalah 1/2', TRUE),
(220, 55, 'D', 'Peluang mengambil bukan kuning adalah 2/5', FALSE),
(221, 56, 'A', '1/4', FALSE),
(222, 56, 'B', '1/2', TRUE),
(223, 56, 'C', '3/4', FALSE),
(224, 56, 'D', '1', FALSE),
(225, 57, 'A', 'Mendapat angka ganjil', TRUE),
(226, 57, 'B', 'Mendapat angka lebih dari 4', TRUE),
(227, 57, 'C', 'Mendapat angka prima yang lebih dari 3', FALSE),
(228, 57, 'D', 'Mendapat angka kurang dari 5', TRUE),
(229, 58, 'A', '1/8', FALSE),
(230, 58, 'B', '1/4', TRUE),
(231, 58, 'C', '3/8', FALSE),
(232, 58, 'D', 'Peluang jarum berhenti di warna biru adalah 1/2', FALSE),
(233, 59, 'A', 'Peluang terpilih siswa perempuan adalah 3/5', TRUE),
(234, 59, 'B', 'Peluang terpilih siswa laki-laki adalah 2/5', FALSE),
(235, 59, 'C', 'Peluang terpilih bukan laki-laki adalah 3/5', TRUE),
(236, 59, 'D', 'Siswa perempuan lebih mungkin terpilih daripada laki-laki', TRUE),
(237, 60, 'A', 'Jumlah 2', TRUE),
(238, 60, 'B', 'Jumlah 3', FALSE),
(239, 60, 'C', 'Jumlah 7', FALSE),
(240, 60, 'D', 'Jumlah 12', TRUE),
(241, 61, 'A', 'hasil akhir setelah semua kegiatan selesai', FALSE),
(242, 61, 'B', 'pendapat yang belum diperiksa', FALSE),
(243, 61, 'C', 'jadwal kegiatan pada masa mendatang', FALSE),
(244, 61, 'D', 'kondisi sebelum program dijalankan', TRUE),
(245, 62, 'A', 'peserta tidak membagi tugas', FALSE),
(246, 62, 'B', 'hasil kegiatan hanya ditentukan oleh satu orang', FALSE),
(247, 62, 'C', 'tanah tetap lembap dan tanaman tumbuh baik', TRUE),
(248, 62, 'D', 'program dihentikan sebelum dicoba', FALSE),
(249, 63, 'A', 'masalah pribadi – perjalanan – kejutan', FALSE),
(250, 63, 'B', 'tujuan program – langkah kegiatan – hasil dan tindak lanjut', TRUE),
(251, 63, 'C', 'hasil akhir – tokoh – konflik – penyelesaian', FALSE),
(252, 63, 'D', 'daftar pendapat – percakapan – lelucon', FALSE),
(253, 64, 'A', 'kondisi sebelum program dijalankan', TRUE),
(254, 64, 'B', 'hasil akhir setelah semua kegiatan selesai', FALSE),
(255, 64, 'C', 'pendapat yang belum diperiksa', FALSE),
(256, 64, 'D', 'jadwal kegiatan pada masa mendatang', FALSE),
(257, 65, 'A', 'program dihentikan sebelum dicoba', FALSE),
(258, 65, 'B', 'peserta tidak membagi tugas', FALSE),
(259, 65, 'C', 'hasil kegiatan hanya ditentukan oleh satu orang', FALSE),
(260, 65, 'D', 'jumlah peminjam bertambah setelah jadwal diumumkan', TRUE),
(261, 66, 'A', 'daftar pendapat – percakapan – lelucon', FALSE),
(262, 66, 'B', 'masalah pribadi – perjalanan – kejutan', FALSE),
(263, 66, 'C', 'tujuan program – langkah kegiatan – hasil dan tindak lanjut', TRUE),
(264, 66, 'D', 'hasil akhir – tokoh – konflik – penyelesaian', FALSE),
(265, 67, 'A', 'jadwal kegiatan pada masa mendatang', FALSE),
(266, 67, 'B', 'kondisi sebelum program dijalankan', TRUE),
(267, 67, 'C', 'hasil akhir setelah semua kegiatan selesai', FALSE),
(268, 67, 'D', 'pendapat yang belum diperiksa', FALSE),
(269, 68, 'A', 'hasil penjualan dipakai membeli bibit tanaman', TRUE),
(270, 68, 'B', 'program dihentikan sebelum dicoba', FALSE),
(271, 68, 'C', 'peserta tidak membagi tugas', FALSE),
(272, 68, 'D', 'hasil kegiatan hanya ditentukan oleh satu orang', FALSE),
(273, 69, 'A', 'hasil akhir – tokoh – konflik – penyelesaian', FALSE),
(274, 69, 'B', 'daftar pendapat – percakapan – lelucon', FALSE),
(275, 69, 'C', 'masalah pribadi – perjalanan – kejutan', FALSE),
(276, 69, 'D', 'tujuan program – langkah kegiatan – hasil dan tindak lanjut', TRUE),
(277, 70, 'A', 'pendapat yang belum diperiksa', FALSE),
(278, 70, 'B', 'jadwal kegiatan pada masa mendatang', FALSE),
(279, 70, 'C', 'kondisi sebelum program dijalankan', TRUE),
(280, 70, 'D', 'hasil akhir setelah semua kegiatan selesai', FALSE),
(281, 71, 'A', 'catatan tidak berguna dalam mengambil keputusan', FALSE),
(282, 71, 'B', 'program akan lebih bertahan jika dilakukan konsisten dan dikerjakan bersama', TRUE),
(283, 71, 'C', 'alat yang mahal selalu menjadi syarat utama keberhasilan', FALSE),
(284, 71, 'D', 'perubahan harus selesai dalam satu hari', FALSE),
(285, 72, 'A', 'catatan membantu keputusan didasarkan pada keadaan nyata', TRUE),
(286, 72, 'B', 'catatan membuat peserta tidak perlu mengamati', FALSE),
(287, 72, 'C', 'keputusan harus dibuat sebelum kegiatan dimulai', FALSE),
(288, 72, 'D', 'catatan hanya berfungsi sebagai pengumuman', FALSE),
(289, 73, 'A', 'semua masalah pasti hilang dengan sendirinya', FALSE),
(290, 73, 'B', 'catatan program otomatis menjadi lebih lengkap', FALSE),
(291, 73, 'C', 'peserta tidak lagi membutuhkan pembagian tugas', FALSE),
(292, 73, 'D', 'kendala yang sama dapat terulang karena langkah tidak diperbaiki', TRUE),
(293, 74, 'A', 'perubahan harus selesai dalam satu hari', FALSE),
(294, 74, 'B', 'catatan tidak berguna dalam mengambil keputusan', FALSE),
(295, 74, 'C', 'program akan lebih bertahan jika dilakukan konsisten dan dikerjakan bersama', TRUE),
(296, 74, 'D', 'alat yang mahal selalu menjadi syarat utama keberhasilan', FALSE),
(297, 75, 'A', 'catatan hanya berfungsi sebagai pengumuman', FALSE),
(298, 75, 'B', 'catatan membantu keputusan didasarkan pada keadaan nyata', TRUE),
(299, 75, 'C', 'catatan membuat peserta tidak perlu mengamati', FALSE),
(300, 75, 'D', 'keputusan harus dibuat sebelum kegiatan dimulai', FALSE),
(301, 76, 'A', 'kendala yang sama dapat terulang karena langkah tidak diperbaiki', TRUE),
(302, 76, 'B', 'semua masalah pasti hilang dengan sendirinya', FALSE),
(303, 76, 'C', 'catatan program otomatis menjadi lebih lengkap', FALSE),
(304, 76, 'D', 'peserta tidak lagi membutuhkan pembagian tugas', FALSE),
(305, 77, 'A', 'alat yang mahal selalu menjadi syarat utama keberhasilan', FALSE),
(306, 77, 'B', 'perubahan harus selesai dalam satu hari', FALSE),
(307, 77, 'C', 'catatan tidak berguna dalam mengambil keputusan', FALSE),
(308, 77, 'D', 'program akan lebih bertahan jika dilakukan konsisten dan dikerjakan bersama', TRUE),
(309, 78, 'A', 'keputusan harus dibuat sebelum kegiatan dimulai', FALSE),
(310, 78, 'B', 'catatan hanya berfungsi sebagai pengumuman', FALSE),
(311, 78, 'C', 'catatan membantu keputusan didasarkan pada keadaan nyata', TRUE),
(312, 78, 'D', 'catatan membuat peserta tidak perlu mengamati', FALSE),
(313, 79, 'A', 'peserta tidak lagi membutuhkan pembagian tugas', FALSE),
(314, 79, 'B', 'kendala yang sama dapat terulang karena langkah tidak diperbaiki', TRUE),
(315, 79, 'C', 'semua masalah pasti hilang dengan sendirinya', FALSE),
(316, 79, 'D', 'catatan program otomatis menjadi lebih lengkap', FALSE),
(317, 80, 'A', 'program akan lebih bertahan jika dilakukan konsisten dan dikerjakan bersama', TRUE),
(318, 80, 'B', 'alat yang mahal selalu menjadi syarat utama keberhasilan', FALSE),
(319, 80, 'C', 'perubahan harus selesai dalam satu hari', FALSE),
(320, 80, 'D', 'catatan tidak berguna dalam mengambil keputusan', FALSE),
(321, 81, 'A', 'menunggu orang lain menyelesaikan semua pekerjaan', FALSE),
(322, 81, 'B', 'mengabaikan data karena sudah memiliki dugaan', FALSE),
(323, 81, 'C', 'mengubah aturan tanpa berdiskusi', FALSE),
(324, 81, 'D', 'membagi tugas dan mengecek hasil kegiatan bersama', TRUE),
(325, 82, 'A', 'Teks hanya berisi pendapat tanpa contoh kegiatan.', FALSE),
(326, 82, 'B', 'Tindak lanjut program disebutkan.', TRUE),
(327, 82, 'C', 'Langkah dan hasil dijelaskan secara berurutan.', TRUE),
(328, 82, 'D', 'Ada alasan mengapa program dilakukan.', TRUE),
(329, 83, 'A', 'menyimpulkan bahwa hanya alat mahal yang berguna', FALSE),
(330, 83, 'B', 'terdorong menerapkan kebiasaan bersama yang dijelaskan dalam bacaan', TRUE),
(331, 83, 'C', 'menganggap semua masalah dapat selesai tanpa tindakan', FALSE),
(332, 83, 'D', 'menolak memeriksa hasil kegiatan', FALSE),
(333, 84, 'A', 'membagi tugas dan mengecek hasil kegiatan bersama', TRUE),
(334, 84, 'B', 'menunggu orang lain menyelesaikan semua pekerjaan', FALSE),
(335, 84, 'C', 'mengabaikan data karena sudah memiliki dugaan', FALSE),
(336, 84, 'D', 'mengubah aturan tanpa berdiskusi', FALSE),
(337, 85, 'A', 'Ada alasan mengapa program dilakukan.', TRUE),
(338, 85, 'B', 'Teks hanya berisi pendapat tanpa contoh kegiatan.', FALSE),
(339, 85, 'C', 'Tindak lanjut program disebutkan.', TRUE),
(340, 85, 'D', 'Langkah dan hasil dijelaskan secara berurutan.', TRUE),
(341, 86, 'A', 'menolak memeriksa hasil kegiatan', FALSE),
(342, 86, 'B', 'menyimpulkan bahwa hanya alat mahal yang berguna', FALSE),
(343, 86, 'C', 'terdorong menerapkan kebiasaan bersama yang dijelaskan dalam bacaan', TRUE),
(344, 86, 'D', 'menganggap semua masalah dapat selesai tanpa tindakan', FALSE),
(345, 87, 'A', 'mengubah aturan tanpa berdiskusi', FALSE),
(346, 87, 'B', 'membagi tugas dan mengecek hasil kegiatan bersama', TRUE),
(347, 87, 'C', 'menunggu orang lain menyelesaikan semua pekerjaan', FALSE),
(348, 87, 'D', 'mengabaikan data karena sudah memiliki dugaan', FALSE),
(349, 88, 'A', 'Langkah dan hasil dijelaskan secara berurutan.', TRUE),
(350, 88, 'B', 'Ada alasan mengapa program dilakukan.', TRUE),
(351, 88, 'C', 'Teks hanya berisi pendapat tanpa contoh kegiatan.', FALSE),
(352, 88, 'D', 'Tindak lanjut program disebutkan.', TRUE),
(353, 89, 'A', 'menganggap semua masalah dapat selesai tanpa tindakan', FALSE),
(354, 89, 'B', 'menolak memeriksa hasil kegiatan', FALSE),
(355, 89, 'C', 'menyimpulkan bahwa hanya alat mahal yang berguna', FALSE),
(356, 89, 'D', 'terdorong menerapkan kebiasaan bersama yang dijelaskan dalam bacaan', TRUE),
(357, 90, 'A', 'mengabaikan data karena sudah memiliki dugaan', FALSE),
(358, 90, 'B', 'mengubah aturan tanpa berdiskusi', FALSE),
(359, 90, 'C', 'membagi tugas dan mengecek hasil kegiatan bersama', TRUE),
(360, 90, 'D', 'menunggu orang lain menyelesaikan semua pekerjaan', FALSE),
(361, 91, 'A', 'pantai di luar negeri', FALSE),
(362, 91, 'B', 'perpustakaan sekolah', TRUE),
(363, 91, 'C', 'pasar pada tengah malam', FALSE),
(364, 91, 'D', 'ruang kelas saat ujian', FALSE),
(365, 92, 'A', 'Nara menghadapi keadaan bahwa sebuah surat lama terselip di buku pinjaman', TRUE),
(366, 92, 'B', 'semua masalah selesai sebelum ia bertindak', FALSE),
(367, 92, 'C', 'tokoh tidak berbicara dengan siapa pun', FALSE),
(368, 92, 'D', 'peristiwa terjadi tanpa melibatkan tokoh lain', FALSE),
(369, 93, 'A', 'tokoh berangkat – menemukan harta – pindah rumah', FALSE),
(370, 93, 'B', 'percakapan lucu – perlombaan – pengumuman', FALSE),
(371, 93, 'C', 'akhir cerita – pengenalan tokoh – awal masalah', FALSE),
(372, 93, 'D', 'masalah muncul – tokoh mencari jalan keluar – masalah selesai – tokoh belajar', TRUE),
(373, 94, 'A', 'ruang kelas saat ujian', FALSE),
(374, 94, 'B', 'pantai di luar negeri', FALSE),
(375, 94, 'C', 'lapangan dekat rumah', TRUE),
(376, 94, 'D', 'pasar pada tengah malam', FALSE),
(377, 95, 'A', 'peristiwa terjadi tanpa melibatkan tokoh lain', FALSE),
(378, 95, 'B', 'Bima menghadapi keadaan bahwa layangan buatan adiknya tersangkut di pohon', TRUE),
(379, 95, 'C', 'semua masalah selesai sebelum ia bertindak', FALSE),
(380, 95, 'D', 'tokoh tidak berbicara dengan siapa pun', FALSE),
(381, 96, 'A', 'masalah muncul – tokoh mencari jalan keluar – masalah selesai – tokoh belajar', TRUE),
(382, 96, 'B', 'tokoh berangkat – menemukan harta – pindah rumah', FALSE),
(383, 96, 'C', 'percakapan lucu – perlombaan – pengumuman', FALSE),
(384, 96, 'D', 'akhir cerita – pengenalan tokoh – awal masalah', FALSE),
(385, 97, 'A', 'pasar pada tengah malam', FALSE),
(386, 97, 'B', 'ruang kelas saat ujian', FALSE),
(387, 97, 'C', 'pantai di luar negeri', FALSE),
(388, 97, 'D', 'aula sekolah', TRUE),
(389, 98, 'A', 'tokoh tidak berbicara dengan siapa pun', FALSE),
(390, 98, 'B', 'peristiwa terjadi tanpa melibatkan tokoh lain', FALSE),
(391, 98, 'C', 'Laras menghadapi keadaan bahwa pemain utama pementasan tiba-tiba sakit', TRUE),
(392, 98, 'D', 'semua masalah selesai sebelum ia bertindak', FALSE),
(393, 99, 'A', 'akhir cerita – pengenalan tokoh – awal masalah', FALSE),
(394, 99, 'B', 'masalah muncul – tokoh mencari jalan keluar – masalah selesai – tokoh belajar', TRUE),
(395, 99, 'C', 'tokoh berangkat – menemukan harta – pindah rumah', FALSE),
(396, 99, 'D', 'percakapan lucu – perlombaan – pengumuman', FALSE),
(397, 100, 'A', 'jalan kecil dekat sungai', TRUE),
(398, 100, 'B', 'pasar pada tengah malam', FALSE),
(399, 100, 'C', 'ruang kelas saat ujian', FALSE),
(400, 100, 'D', 'pantai di luar negeri', FALSE),
(401, 101, 'A', 'masalah selalu selesai tanpa usaha', FALSE),
(402, 101, 'B', 'meminta bantuan berarti gagal', FALSE),
(403, 101, 'C', 'perasaan tokoh tidak berubah sepanjang cerita', FALSE),
(404, 101, 'D', 'hasil baik kadang memerlukan waktu dan perhatian', TRUE),
(405, 102, 'A', 'penyelesaian terjadi sebelum masalah muncul', FALSE),
(406, 102, 'B', 'tokoh lain tidak memberi pengaruh apa pun', FALSE),
(407, 102, 'C', 'tindakannya membantu mengatasi masalah dengan mempertimbangkan keadaan', TRUE),
(408, 102, 'D', 'tindakannya membuat konflik tidak berhubungan dengan akhir cerita', FALSE),
(409, 103, 'A', 'peristiwa awal tidak pernah terjadi', FALSE),
(410, 103, 'B', 'masalah dapat berlanjut atau bantuan datang terlambat', TRUE),
(411, 103, 'C', 'penyelesaian pasti terjadi lebih cepat', FALSE),
(412, 103, 'D', 'semua tokoh langsung mengetahui jawabannya', FALSE),
(413, 104, 'A', 'kesalahan dapat diperbaiki dengan jujur dan tenang', TRUE),
(414, 104, 'B', 'masalah selalu selesai tanpa usaha', FALSE),
(415, 104, 'C', 'meminta bantuan berarti gagal', FALSE),
(416, 104, 'D', 'perasaan tokoh tidak berubah sepanjang cerita', FALSE),
(417, 105, 'A', 'tindakannya membuat konflik tidak berhubungan dengan akhir cerita', FALSE),
(418, 105, 'B', 'penyelesaian terjadi sebelum masalah muncul', FALSE),
(419, 105, 'C', 'tokoh lain tidak memberi pengaruh apa pun', FALSE),
(420, 105, 'D', 'tindakannya membantu mengatasi masalah dengan mempertimbangkan keadaan', TRUE),
(421, 106, 'A', 'semua tokoh langsung mengetahui jawabannya', FALSE),
(422, 106, 'B', 'peristiwa awal tidak pernah terjadi', FALSE),
(423, 106, 'C', 'masalah dapat berlanjut atau bantuan datang terlambat', TRUE),
(424, 106, 'D', 'penyelesaian pasti terjadi lebih cepat', FALSE),
(425, 107, 'A', 'perasaan tokoh tidak berubah sepanjang cerita', FALSE),
(426, 107, 'B', 'rasa takut berkurang ketika fakta diperiksa', TRUE),
(427, 107, 'C', 'masalah selalu selesai tanpa usaha', FALSE),
(428, 107, 'D', 'meminta bantuan berarti gagal', FALSE),
(429, 108, 'A', 'tindakannya membantu mengatasi masalah dengan mempertimbangkan keadaan', TRUE),
(430, 108, 'B', 'tindakannya membuat konflik tidak berhubungan dengan akhir cerita', FALSE),
(431, 108, 'C', 'penyelesaian terjadi sebelum masalah muncul', FALSE),
(432, 108, 'D', 'tokoh lain tidak memberi pengaruh apa pun', FALSE),
(433, 109, 'A', 'penyelesaian pasti terjadi lebih cepat', FALSE),
(434, 109, 'B', 'semua tokoh langsung mengetahui jawabannya', FALSE),
(435, 109, 'C', 'peristiwa awal tidak pernah terjadi', FALSE),
(436, 109, 'D', 'masalah dapat berlanjut atau bantuan datang terlambat', TRUE),
(437, 110, 'A', 'meminta bantuan berarti gagal', FALSE),
(438, 110, 'B', 'perasaan tokoh tidak berubah sepanjang cerita', FALSE),
(439, 110, 'C', 'usaha dan sikap sportif lebih penting daripada perlengkapan mahal', TRUE),
(440, 110, 'D', 'masalah selalu selesai tanpa usaha', FALSE),
(441, 111, 'A', 'bertindak cepat tanpa melihat keadaan', FALSE),
(442, 111, 'B', 'memikirkan akibat tindakan dan meminta bantuan saat diperlukan', TRUE),
(443, 111, 'C', 'menyembunyikan kesalahan agar tidak diketahui', FALSE),
(444, 111, 'D', 'menyalahkan orang lain sebelum mencari fakta', FALSE),
(445, 112, 'A', 'Tindakan tokoh membantu mengarah pada penyelesaian konflik.', TRUE),
(446, 112, 'B', 'Pelajaran cerita didukung oleh pengalaman tokoh.', TRUE),
(447, 112, 'C', 'Latar cerita tidak berkaitan dengan peristiwa apa pun.', FALSE),
(448, 112, 'D', 'Akhir cerita menunjukkan perubahan atau pemahaman tokoh.', TRUE),
(449, 113, 'A', 'marah karena tokoh selalu memilih tindakan gegabah', FALSE),
(450, 113, 'B', 'bosan karena konflik tidak pernah diselesaikan', FALSE),
(451, 113, 'C', 'takut karena cerita berakhir tanpa penjelasan', FALSE),
(452, 113, 'D', 'merasa lega dan ikut menghargai usaha tokoh', TRUE),
(453, 114, 'A', 'menyalahkan orang lain sebelum mencari fakta', FALSE),
(454, 114, 'B', 'bertindak cepat tanpa melihat keadaan', FALSE),
(455, 114, 'C', 'memikirkan akibat tindakan dan meminta bantuan saat diperlukan', TRUE),
(456, 114, 'D', 'menyembunyikan kesalahan agar tidak diketahui', FALSE),
(457, 115, 'A', 'Akhir cerita menunjukkan perubahan atau pemahaman tokoh.', TRUE),
(458, 115, 'B', 'Tindakan tokoh membantu mengarah pada penyelesaian konflik.', TRUE),
(459, 115, 'C', 'Pelajaran cerita didukung oleh pengalaman tokoh.', TRUE),
(460, 115, 'D', 'Latar cerita tidak berkaitan dengan peristiwa apa pun.', FALSE),
(461, 116, 'A', 'merasa lega dan ikut menghargai usaha tokoh', TRUE),
(462, 116, 'B', 'marah karena tokoh selalu memilih tindakan gegabah', FALSE),
(463, 116, 'C', 'bosan karena konflik tidak pernah diselesaikan', FALSE),
(464, 116, 'D', 'takut karena cerita berakhir tanpa penjelasan', FALSE),
(465, 117, 'A', 'menyembunyikan kesalahan agar tidak diketahui', FALSE),
(466, 117, 'B', 'menyalahkan orang lain sebelum mencari fakta', FALSE),
(467, 117, 'C', 'bertindak cepat tanpa melihat keadaan', FALSE),
(468, 117, 'D', 'memikirkan akibat tindakan dan meminta bantuan saat diperlukan', TRUE),
(469, 118, 'A', 'Latar cerita tidak berkaitan dengan peristiwa apa pun.', FALSE),
(470, 118, 'B', 'Akhir cerita menunjukkan perubahan atau pemahaman tokoh.', TRUE),
(471, 118, 'C', 'Tindakan tokoh membantu mengarah pada penyelesaian konflik.', TRUE),
(472, 118, 'D', 'Pelajaran cerita didukung oleh pengalaman tokoh.', TRUE),
(473, 119, 'A', 'takut karena cerita berakhir tanpa penjelasan', FALSE),
(474, 119, 'B', 'merasa lega dan ikut menghargai usaha tokoh', TRUE),
(475, 119, 'C', 'marah karena tokoh selalu memilih tindakan gegabah', FALSE),
(476, 119, 'D', 'bosan karena konflik tidak pernah diselesaikan', FALSE),
(477, 120, 'A', 'memikirkan akibat tindakan dan meminta bantuan saat diperlukan', TRUE),
(478, 120, 'B', 'menyembunyikan kesalahan agar tidak diketahui', FALSE),
(479, 120, 'C', 'menyalahkan orang lain sebelum mencari fakta', FALSE),
(480, 120, 'D', 'bertindak cepat tanpa melihat keadaan', FALSE)
ON DUPLICATE KEY UPDATE `question_id` = VALUES(`question_id`), `option_label` = VALUES(`option_label`), `option_text` = VALUES(`option_text`), `is_correct` = VALUES(`is_correct`);

-- -----------------------------------------------------------------------------
-- 5. PEMBENIHAN PEMBAHASAN JAWABAN (QUESTION_EXPLANATIONS - 120 Pembahasan)
-- -----------------------------------------------------------------------------
INSERT INTO `question_explanations` (`id`, `question_id`, `explanation_text`, `reasoning_guide`, `reference_url`) VALUES
(1, 1, 'Bilangan irasional tidak dapat ditulis sebagai pecahan dua bilangan bulat. √18 = 3√2, dan √2 tidak dapat dinyatakan sebagai pecahan tepat. Sementara itu, 0,75 = 3/4, √49 = 7, dan −4 semuanya rasional.', NULL, NULL),
(2, 2, 'Bilangan bulat mencakup bilangan negatif, nol, dan positif tanpa bagian pecahan, jadi −3 termasuk bilangan bulat. Bilangan 0 rasional karena dapat ditulis 0/1. Demikian pula 5/2 sudah berbentuk perbandingan dua bilangan bulat. Jadi A dan C benar.', NULL, NULL),
(3, 3, 'Pada garis bilangan, bilangan yang lebih ke kiri nilainya lebih kecil. Di antara bilangan negatif, −2 lebih kecil daripada −1/2. Setelah itu ada 0, lalu 1,5. Maka urutan A yang benar.', NULL, NULL),
(4, 4, 'Nilai mutlak menunjukkan jarak suatu bilangan dari nol, sehingga hasilnya tidak negatif. Jarak −8 ke 0 adalah 8 satuan. Jadi |−8| = 8.', NULL, NULL),
(5, 5, 'Ubah semuanya ke desimal: 2/5 = 0,4, 40% = 40/100 = 0,4, dan 0,40 juga sama dengan 0,4 karena nol di belakang koma tidak mengubah nilai. Adapun 4/100 = 0,04. Jadi A, B, dan D benar.', NULL, NULL),
(6, 6, 'Kenaikan suhu berarti menambahkan 8 pada suhu awal: −3 + 8 = 5. Kita dapat membayangkan mulai dari −3 lalu bergerak 8 langkah ke kanan pada garis bilangan. Suhu siang hari adalah 5°C.', NULL, NULL),
(7, 7, 'Pita setelah dipakai: 3,6 − 1,25 = 2,35 m. Setelah membeli lagi: 2,35 + 0,8 = 3,15 m, jadi pernyataan B benar dan C salah. Panjang awal 3,6 m sama dengan 360 cm. Maka A, B, dan D benar.', NULL, NULL),
(8, 8, 'Dua resep berarti kebutuhan dikalikan 2: 2 × 3/4 = 6/4 = 3/2 = 1 1/2 kg. Jadi pilihan B tepat.', NULL, NULL),
(9, 9, 'Diskon 15% dari Rp80.000 adalah 0,15 × 80.000 = Rp12.000. Harga yang dibayar = 80.000 − 12.000 = Rp68.000. Diskon mengurangi harga, jadi pilihan C benar.', NULL, NULL),
(10, 10, 'Ubah 3/5 liter menjadi 0,6 liter. Sesudah dituangkan, tersisa 2,4 − 0,6 = 1,8 liter. Tambahkan 450 mL = 0,45 liter: 1,8 + 0,45 = 2,25 liter. Jadi jawabannya C.', NULL, NULL),
(11, 11, 'Karena kedua bilangan positif, kita boleh membandingkan kuadratnya. 7² = 49, sedangkan 50 > 49, jadi √50 > √49 = 7. Pilihan A benar.', NULL, NULL),
(12, 12, 'Jarak dari nol tidak pernah negatif, jadi |x| ≥ 0. Kuadrat bilangan juga tidak negatif. Jika x < 0, nilai mutlaknya justru −x, bukan x, sehingga C salah. Untuk x = −a dan a positif, |−a| = a. Maka A, B, dan D benar.', NULL, NULL),
(13, 13, 'Kalikan semua bagian pertidaksamaan dengan 3 (tandanya tetap karena 3 positif): −6 < n < 3. Bilangan bulat yang memenuhi ialah −5 sampai 2. Dari pilihan yang tersedia, hanya 0 yang termasuk.', NULL, NULL),
(14, 14, 'Samakan penyebut menjadi 120: 5/8 = 75/120, 2/3 = 80/120, dan 3/5 = 72/120. Pembilang terbesar adalah 80, sehingga 2/3 merupakan pecahan terbesar.', NULL, NULL),
(15, 15, 'Karena 1 < x < 2 dan semua bilangan positif, menguadratkan memberi 1 < x² < 4. Menambah 3 memberi 4 < x+3 < 5, jadi pernyataan B (x+3 < 5) benar. Membagi 1 dengan x menghasilkan nilai di antara 1/2 dan 1, bukan lebih dari 1. Mengalikan dengan 2 memberi 2 < 2x < 4. Jadi A, B, D benar.', NULL, NULL),
(16, 16, 'Kurangi kedua ruas dengan 5 sehingga 3x = 15. Lalu bagi kedua ruas dengan 3: x = 5. Substitusi kembali memberi 3(5)+5 = 20, cocok dengan persamaan.', NULL, NULL),
(17, 17, 'Misalkan harga satu buku x rupiah. Tiga buku dan satu pensil menghasilkan 3x + 4.000 = 25.000. Kurangi 4.000, didapat 3x = 21.000, sehingga x = 7.000. Maka A dan B benar.', NULL, NULL),
(18, 18, 'Misalkan lebar w cm, maka panjangnya w+3. Keliling 2(panjang+lebar)=30, sehingga 2((w+3)+w)=30. Jadi 4w+6=30, 4w=24, dan w=6 cm.', NULL, NULL),
(19, 19, 'Tambahkan 1 pada kedua ruas: 2x ≤ 6. Bagi dengan 2 sehingga x ≤ 3. Nilai −1, 0, dan 3 memenuhi; 4 tidak. Jawaban A, B, dan C.', NULL, NULL),
(20, 20, 'Suku sejenis yang memuat a dapat dijumlahkan: 4a+3a=7a. Bilangan −2 tetap karena bukan suku sejenis dengan a. Jadi bentuk sederhananya 7a−2.', NULL, NULL),
(21, 21, 'Substitusikan p=2 dan q=−3. p+q=−1, 2p−q=4−(−3)=7 (bukan 1), pq=−6, dan p²+q=4−3=1. Jadi A, C, dan D benar.', NULL, NULL),
(22, 22, 'Kalikan 2 ke dalam kurung pertama: 6x−8. Tanda minus di depan kurung kedua mengubah tandanya menjadi −x−5. Gabungkan suku sejenis: 6x−x=5x dan −8−5=−13. Hasilnya 5x−13.', NULL, NULL),
(23, 23, 'Empat roti berharga 4 kali harga satu roti, yaitu 4x. Biaya kantong ditambahkan sekali, jadi totalnya 4x+2.000. Pilihan B memodelkan situasi dengan benar.', NULL, NULL),
(24, 24, 'f(3) berarti mengganti setiap x dengan 3: f(3)=2(3)+1=6+1=7. Jadi jawabannya C.', NULL, NULL),
(25, 25, 'Masukkan nilai ke aturan 3x−2. Untuk x=0 hasilnya −2; x=1 hasilnya 1; x=2 hasilnya 4 (bukan 5); dan x=−1 hasilnya −5 (bukan 1). Jadi A dan B benar.', NULL, NULL),
(26, 26, 'Dari g(2)=10 diperoleh 2a+4=10, maka a=3. Jadi g(x)=3x+4 dan g(5)=15+4=19. Jawaban yang benar C.', NULL, NULL),
(27, 27, 'Aturan h(x)=x² berarti setiap masukan dikuadratkan. Maka h(−2)=4, h(0)=0, h(3)=9 (bukan 6), dan h(1)=1. Jadi A, B, dan D benar.', NULL, NULL),
(28, 28, 'Selisih setiap suku adalah 3. Tambahkan 3 berturut-turut pada 13: 16, 19, lalu 22. Jadi pilihan B benar.', NULL, NULL),
(29, 29, 'Barisannya 5.000, 7.000, 9.000, 11.000. Jumlah empat minggu adalah 5.000+7.000+9.000+11.000=32.000. Jadi A, B, dan C benar, sedangkan D salah.', NULL, NULL),
(30, 30, 'Setiap suku dikalikan 3: suku ke-5 = 54×3=162 dan suku ke-6=162×3=486. Jadi pilihan C benar.', NULL, NULL),
(31, 31, 'Ketiga sudut dalam segitiga selalu berjumlah 180°. Misalnya, jika dua sudutnya diketahui, sudut ketiga diperoleh dengan mengurangi jumlah 180° dengan dua sudut tersebut.', NULL, NULL),
(32, 32, 'Sudut ketiga = 180°−48°−67°=65°. Ketiga sudutnya kurang dari 90°, jadi segitiga lancip. Jumlah dua sudut yang diketahui 115°. Maka A, B, dan C benar.', NULL, NULL),
(33, 33, 'Pada dua garis sejajar, sudut sehadap besarnya sama. Karena sudut pertama 112°, pasangannya juga 112°. Sudut yang berpelurus dengannya memang 68°, tetapi yang ditanyakan sudut sehadap.', NULL, NULL),
(34, 34, 'Persegi mempunyai empat sisi. Trapesium juga segi empat, meskipun bentuk sisi sejajarnya berbeda. Segitiga punya tiga sisi dan segi lima punya lima sisi. Jadi A dan C.', NULL, NULL),
(35, 35, 'Keliling persegi adalah 4 kali panjang sisinya. Jadi 4×9=36 cm. Nilai 81 cm² adalah luasnya, bukan kelilingnya.', NULL, NULL),
(36, 36, 'Pencerminan terhadap sumbu-x mempertahankan koordinat x dan mengubah tanda koordinat y: (x,y) menjadi (x,−y). Maka P(2,−3) menjadi (2,3).', NULL, NULL),
(37, 37, 'Translasi (3,−2) berarti menambah 3 pada x dan mengurangi 2 pada y. Jadi A′=(−1+3,4−2)=(2,2). Jaraknya √(3²+(−2)²)=√13, bukan 5. Maka A, B, C benar.', NULL, NULL),
(38, 38, 'Rotasi 180° terhadap titik pusat mengubah (x,y) menjadi (−x,−y). Jadi (−2,5) berpindah ke (2,−5).', NULL, NULL),
(39, 39, 'Translasi, rotasi, dan refleksi adalah transformasi yang mempertahankan jarak, sehingga bentuk dan ukurannya tetap. Dilatasi faktor 2 mengubah ukuran menjadi dua kali panjang semula. Jawaban A, B, D.', NULL, NULL),
(40, 40, 'Pencerminan terhadap sumbu-y mengubah (x,y) menjadi (−x,y). Maka A(1,1) menjadi A′(−1,1).', NULL, NULL),
(41, 41, 'Luas persegi panjang = panjang × lebar. Jadi 8×5=40 cm². Satuan luas memakai cm² karena dua ukuran panjang dikalikan.', NULL, NULL),
(42, 42, 'Luas = 12×7=84 m². Keliling=2(12+7)=38 m, sehingga panjang pagar satu putaran juga 38 m. Jadi A, B, dan C benar.', NULL, NULL),
(43, 43, 'Volume kubus = s³ = 4³ = 64 cm³. Luas permukaan = 6s² = 6×16=96 cm². Jadi pasangan yang tepat adalah pilihan B.', NULL, NULL),
(44, 44, 'Satu meter = 100 cm, jadi 2,5 m=250 cm. Satu kilogram=1.000 g, maka 1,2 kg=1.200 g. Satu jam=60 menit, sehingga 3 jam=180 menit. 450 cm justru 4,5 m, bukan 45 m. Maka A, B, C benar.', NULL, NULL),
(45, 45, 'Volume tabung = πr²t. Masukkan nilai: (22/7)×7²×10 = 22×7×10 = 1.540 cm³. Jadi jawabannya B.', NULL, NULL),
(46, 46, 'Modus adalah nilai yang paling sering muncul. Nilai 7 muncul dua kali, sementara nilai lain hanya sekali. Jadi modusnya 7.', NULL, NULL),
(47, 47, 'Jumlah data 2+4+3+5+6=20, dibagi 5 menghasilkan rata-rata 4. Urutkan 2,3,4,5,6 sehingga median 4. Jangkauan = 6−2=4. Semua nilai berbeda sehingga tidak ada modus. Jadi A, B, C.', NULL, NULL),
(48, 48, 'Empat data dengan rata-rata 7 memiliki jumlah 4×7=28. Tiga data yang diketahui berjumlah 4+6+8=18. Jadi x=28−18=10.', NULL, NULL),
(49, 49, 'Diagram batang memakai tinggi batang untuk menunjukkan jumlah atau nilai. Kategori sering ditulis pada sumbu mendatar dan diagram ini memudahkan perbandingan antarkategori. Tinggi batang tentu dapat berbeda. Maka A, C, dan D benar.', NULL, NULL),
(50, 50, 'Jumlahkan semua data: 20+25+15+30=90. Jadi jumlah pengunjung selama empat hari adalah 90 orang.', NULL, NULL),
(51, 51, 'Agar rata-ratanya 80, jumlah lima nilai harus 5×80=400. Empat nilai awal berjumlah 310, jadi nilai tambahan adalah 90. Nilai itu lebih tinggi daripada 85. Urutan lengkap 70,75,80,85,90 memiliki median 80, bukan 85. Jadi A, B, dan C benar.', NULL, NULL),
(52, 52, 'Ada lima data, jadi median adalah data yang berada tepat di posisi ketiga setelah diurutkan. Data ketiga adalah 6.', NULL, NULL),
(53, 53, 'Persentase renang =100%−(40%+25%+20%)=15%. Dari 200 siswa, sepak bola 80, bulu tangkis 50, basket 40, dan renang 30. Jadi A, B, dan C benar; D salah.', NULL, NULL),
(54, 54, 'Angka genap pada dadu adalah 2, 4, dan 6, ada 3 hasil yang diinginkan dari 6 hasil sama mungkin. Peluangnya 3/6=1/2.', NULL, NULL),
(55, 55, 'Jumlah kelereng 10. Peluang merah=3/10, biru=2/10=1/5, dan kuning=5/10=1/2. Bukan kuning berarti merah atau biru, peluangnya 5/10=1/2, bukan 2/5. Jadi A, B, dan C benar.', NULL, NULL),
(56, 56, 'Kemungkinan hasilnya GG, GA, AG, AA dan semuanya sama mungkin. Tepat satu gambar terjadi pada GA atau AG, yaitu 2 dari 4 kemungkinan. Peluangnya 2/4=1/2.', NULL, NULL),
(57, 57, 'Ada 8 kartu. Angka ganjil ada 4, angka lebih dari 4 ada 4, dan angka kurang dari 5 ada 4; masing-masing berpeluang 4/8=1/2. Angka prima yang lebih dari 3 hanya 5 dan 7, yaitu 2 dari 8 kartu. Jadi A, B, dan D benar.', NULL, NULL),
(58, 58, 'Dua dari delapan bagian berwarna biru. Peluangnya 2/8 yang disederhanakan menjadi 1/4.', NULL, NULL),
(59, 59, 'Jumlah siswa 30. Peluang perempuan=18/30=3/5; peluang laki-laki=12/30=2/5. Bukan laki-laki berarti perempuan, jadi peluangnya 3/5. Karena 3/5 lebih besar dari 2/5, perempuan lebih mungkin terpilih. A, C, D benar.', NULL, NULL),
(60, 60, 'Ada 36 pasangan hasil yang sama mungkin. Jumlah 2 hanya terjadi sebagai (1,1), sedangkan jumlah 12 hanya sebagai (6,6), jadi masing-masing berpeluang 1/36. Jumlah 3 memiliki dua pasangan, dan jumlah 7 memiliki enam pasangan. Karena itu A dan D benar.', NULL, NULL),
(61, 61, 'Bacaan menjelaskan bahwa peserta mencatat keadaan sebelum memilih langkah. Jadi, “keadaan awal” berarti kondisi sebelum program berjalan, bukan hasil akhir atau dugaan.', NULL, NULL),
(62, 62, 'Bacaan menyatakan bahwa tanah tetap lembap dan tanaman tumbuh baik. Pilihan lain berlawanan dengan isi teks yang menjelaskan pembagian tugas dan pemantauan bersama.', NULL, NULL),
(63, 63, 'Teks informasi ini bergerak dari tujuan, berlanjut ke langkah yang dilakukan, lalu menjelaskan hasil dan tindak lanjut. Urutan itu merangkum susunan gagasan bacaan dengan tepat.', NULL, NULL),
(64, 64, 'Bacaan menjelaskan bahwa peserta mencatat keadaan sebelum memilih langkah. Jadi, “keadaan awal” berarti kondisi sebelum program berjalan, bukan hasil akhir atau dugaan.', NULL, NULL),
(65, 65, 'Bacaan menyatakan bahwa jumlah peminjam bertambah setelah jadwal diumumkan. Pilihan lain berlawanan dengan isi teks yang menjelaskan pembagian tugas dan pemantauan bersama.', NULL, NULL),
(66, 66, 'Teks informasi ini bergerak dari tujuan, berlanjut ke langkah yang dilakukan, lalu menjelaskan hasil dan tindak lanjut. Urutan itu merangkum susunan gagasan bacaan dengan tepat.', NULL, NULL),
(67, 67, 'Bacaan menjelaskan bahwa peserta mencatat keadaan sebelum memilih langkah. Jadi, “keadaan awal” berarti kondisi sebelum program berjalan, bukan hasil akhir atau dugaan.', NULL, NULL),
(68, 68, 'Bacaan menyatakan bahwa hasil penjualan dipakai membeli bibit tanaman. Pilihan lain berlawanan dengan isi teks yang menjelaskan pembagian tugas dan pemantauan bersama.', NULL, NULL),
(69, 69, 'Teks informasi ini bergerak dari tujuan, berlanjut ke langkah yang dilakukan, lalu menjelaskan hasil dan tindak lanjut. Urutan itu merangkum susunan gagasan bacaan dengan tepat.', NULL, NULL),
(70, 70, 'Bacaan menjelaskan bahwa peserta mencatat keadaan sebelum memilih langkah. Jadi, “keadaan awal” berarti kondisi sebelum program berjalan, bukan hasil akhir atau dugaan.
Pemahaman Inferensial', NULL, NULL),
(71, 71, 'Bacaan menekankan kebiasaan konsisten, kerja sama, dan penggunaan catatan. Dari petunjuk itu dapat disimpulkan bahwa keberhasilan tidak hanya bergantung pada alat.', NULL, NULL),
(72, 72, 'Pengurus membandingkan keadaan awal dengan perubahan yang terjadi. Informasi itulah yang membantu mereka memperbaiki langkah secara masuk akal.', NULL, NULL),
(73, 73, 'Teks menjelaskan perlunya pemeriksaan berkala dan perbaikan langkah. Tanpa evaluasi, kendala berisiko tidak diketahui dan kembali terjadi.', NULL, NULL),
(74, 74, 'Bacaan menekankan kebiasaan konsisten, kerja sama, dan penggunaan catatan. Dari petunjuk itu dapat disimpulkan bahwa keberhasilan tidak hanya bergantung pada alat.', NULL, NULL),
(75, 75, 'Pengurus membandingkan keadaan awal dengan perubahan yang terjadi. Informasi itulah yang membantu mereka memperbaiki langkah secara masuk akal.', NULL, NULL),
(76, 76, 'Teks menjelaskan perlunya pemeriksaan berkala dan perbaikan langkah. Tanpa evaluasi, kendala berisiko tidak diketahui dan kembali terjadi.', NULL, NULL),
(77, 77, 'Bacaan menekankan kebiasaan konsisten, kerja sama, dan penggunaan catatan. Dari petunjuk itu dapat disimpulkan bahwa keberhasilan tidak hanya bergantung pada alat.', NULL, NULL),
(78, 78, 'Pengurus membandingkan keadaan awal dengan perubahan yang terjadi. Informasi itulah yang membantu mereka memperbaiki langkah secara masuk akal.', NULL, NULL),
(79, 79, 'Teks menjelaskan perlunya pemeriksaan berkala dan perbaikan langkah. Tanpa evaluasi, kendala berisiko tidak diketahui dan kembali terjadi.', NULL, NULL),
(80, 80, 'Bacaan menekankan kebiasaan konsisten, kerja sama, dan penggunaan catatan. Dari petunjuk itu dapat disimpulkan bahwa keberhasilan tidak hanya bergantung pada alat.
Evaluasi dan Apresiasi', NULL, NULL),
(81, 81, 'Bacaan menunjukkan bahwa pembagian tugas, pencatatan, dan kerja sama membantu program berjalan. Kebiasaan itu dapat diterapkan dalam kegiatan kelas atau rumah.', NULL, NULL),
(82, 82, 'Bacaan memaparkan tujuan, langkah, hasil pengamatan, dan tindak lanjut. Karena itu A, B, dan D sesuai, sedangkan C keliru sebab teks memberi contoh tindakan konkret.', NULL, NULL),
(83, 83, 'Bacaan menunjukkan manfaat dari tindakan yang dilakukan bersama dan dievaluasi. Pembaca dapat merespons dengan ingin menerapkan kebiasaan serupa dalam lingkungannya.', NULL, NULL),
(84, 84, 'Bacaan menunjukkan bahwa pembagian tugas, pencatatan, dan kerja sama membantu program berjalan. Kebiasaan itu dapat diterapkan dalam kegiatan kelas atau rumah.', NULL, NULL),
(85, 85, 'Bacaan memaparkan tujuan, langkah, hasil pengamatan, dan tindak lanjut. Karena itu A, B, dan D sesuai, sedangkan C keliru sebab teks memberi contoh tindakan konkret.', NULL, NULL),
(86, 86, 'Bacaan menunjukkan manfaat dari tindakan yang dilakukan bersama dan dievaluasi. Pembaca dapat merespons dengan ingin menerapkan kebiasaan serupa dalam lingkungannya.', NULL, NULL),
(87, 87, 'Bacaan menunjukkan bahwa pembagian tugas, pencatatan, dan kerja sama membantu program berjalan. Kebiasaan itu dapat diterapkan dalam kegiatan kelas atau rumah.', NULL, NULL),
(88, 88, 'Bacaan memaparkan tujuan, langkah, hasil pengamatan, dan tindak lanjut. Karena itu A, B, dan D sesuai, sedangkan C keliru sebab teks memberi contoh tindakan konkret.', NULL, NULL),
(89, 89, 'Bacaan menunjukkan manfaat dari tindakan yang dilakukan bersama dan dievaluasi. Pembaca dapat merespons dengan ingin menerapkan kebiasaan serupa dalam lingkungannya.', NULL, NULL),
(90, 90, 'Bacaan menunjukkan bahwa pembagian tugas, pencatatan, dan kerja sama membantu program berjalan. Kebiasaan itu dapat diterapkan dalam kegiatan kelas atau rumah.
Teks Fiksi
Pemahaman Tekstual', NULL, NULL),
(91, 91, 'Cerita secara langsung menempatkan Nara di perpustakaan sekolah. Keterangan ini menunjukkan latar tempat yang sesuai.', NULL, NULL),
(92, 92, 'Pada bagian awal, cerita menyebutkan bahwa sebuah surat lama terselip di buku pinjaman. Itulah informasi tersurat; pilihan lain tidak diceritakan.', NULL, NULL),
(93, 93, 'Cerita dimulai dengan masalah, menampilkan usaha Nara, lalu menyelesaikan konflik dan menunjukkan pelajaran yang diperoleh. Itulah urutan kerangka yang tepat.', NULL, NULL),
(94, 94, 'Cerita secara langsung menempatkan Bima di lapangan dekat rumah. Keterangan ini menunjukkan latar tempat yang sesuai.', NULL, NULL),
(95, 95, 'Pada bagian awal, cerita menyebutkan bahwa layangan buatan adiknya tersangkut di pohon. Itulah informasi tersurat; pilihan lain tidak diceritakan.', NULL, NULL),
(96, 96, 'Cerita dimulai dengan masalah, menampilkan usaha Bima, lalu menyelesaikan konflik dan menunjukkan pelajaran yang diperoleh. Itulah urutan kerangka yang tepat.', NULL, NULL),
(97, 97, 'Cerita secara langsung menempatkan Laras di aula sekolah. Keterangan ini menunjukkan latar tempat yang sesuai.', NULL, NULL),
(98, 98, 'Pada bagian awal, cerita menyebutkan bahwa pemain utama pementasan tiba-tiba sakit. Itulah informasi tersurat; pilihan lain tidak diceritakan.', NULL, NULL),
(99, 99, 'Cerita dimulai dengan masalah, menampilkan usaha Laras, lalu menyelesaikan konflik dan menunjukkan pelajaran yang diperoleh. Itulah urutan kerangka yang tepat.', NULL, NULL),
(100, 100, 'Cerita secara langsung menempatkan Dito di jalan kecil dekat sungai. Keterangan ini menunjukkan latar tempat yang sesuai.
Pemahaman Inferensial', NULL, NULL),
(101, 101, 'Peristiwa dan perubahan sikap tokoh mendukung pesan bahwa hasil baik kadang memerlukan waktu dan perhatian. Kesimpulan ini menghubungkan tindakan tokoh dengan pengalaman yang dialaminya.', NULL, NULL),
(102, 102, 'Tindakan Sita menjadi jembatan antara masalah dan penyelesaian. Cerita memperlihatkan bahwa proses yang dipilih tokoh berpengaruh pada hasil.', NULL, NULL),
(103, 103, 'Cerita menyelesaikan masalah melalui langkah yang diambil tokoh. Jika langkah itu tidak dilakukan, masalah mungkin tetap ada atau bantuan terlambat.', NULL, NULL),
(104, 104, 'Peristiwa dan perubahan sikap tokoh mendukung pesan bahwa kesalahan dapat diperbaiki dengan jujur dan tenang. Kesimpulan ini menghubungkan tindakan tokoh dengan pengalaman yang dialaminya.', NULL, NULL),
(105, 105, 'Tindakan Rafi menjadi jembatan antara masalah dan penyelesaian. Cerita memperlihatkan bahwa proses yang dipilih tokoh berpengaruh pada hasil.', NULL, NULL),
(106, 106, 'Cerita menyelesaikan masalah melalui langkah yang diambil tokoh. Jika langkah itu tidak dilakukan, masalah mungkin tetap ada atau bantuan terlambat.', NULL, NULL),
(107, 107, 'Peristiwa dan perubahan sikap tokoh mendukung pesan bahwa rasa takut berkurang ketika fakta diperiksa. Kesimpulan ini menghubungkan tindakan tokoh dengan pengalaman yang dialaminya.', NULL, NULL),
(108, 108, 'Tindakan Mira menjadi jembatan antara masalah dan penyelesaian. Cerita memperlihatkan bahwa proses yang dipilih tokoh berpengaruh pada hasil.', NULL, NULL),
(109, 109, 'Cerita menyelesaikan masalah melalui langkah yang diambil tokoh. Jika langkah itu tidak dilakukan, masalah mungkin tetap ada atau bantuan terlambat.', NULL, NULL),
(110, 110, 'Peristiwa dan perubahan sikap tokoh mendukung pesan bahwa usaha dan sikap sportif lebih penting daripada perlengkapan mahal. Kesimpulan ini menghubungkan tindakan tokoh dengan pengalaman yang dialaminya.
Evaluasi dan Apresiasi', NULL, NULL),
(111, 111, 'Pengalaman Tika mengajarkan sikap yang dapat dipakai dalam kehidupan sehari-hari: berpikir, bertanggung jawab, dan bekerja sama.', NULL, NULL),
(112, 112, 'Peristiwa, penyelesaian, dan pelajaran saling berkaitan. Pilihan A, B, dan D sesuai dengan alur cerita, sedangkan C tidak tepat karena latar membantu membangun peristiwa.', NULL, NULL),
(113, 113, 'Akhir cerita menyelesaikan masalah dan memperlihatkan pelajaran yang diperoleh tokoh. Karena itu, pembaca wajar merasa lega serta menghargai usaha dan perubahan sikapnya.', NULL, NULL),
(114, 114, 'Pengalaman Yusuf mengajarkan sikap yang dapat dipakai dalam kehidupan sehari-hari: berpikir, bertanggung jawab, dan bekerja sama.', NULL, NULL),
(115, 115, 'Peristiwa, penyelesaian, dan pelajaran saling berkaitan. Pilihan A, B, dan D sesuai dengan alur cerita, sedangkan C tidak tepat karena latar membantu membangun peristiwa.', NULL, NULL),
(116, 116, 'Akhir cerita menyelesaikan masalah dan memperlihatkan pelajaran yang diperoleh tokoh. Karena itu, pembaca wajar merasa lega serta menghargai usaha dan perubahan sikapnya.', NULL, NULL),
(117, 117, 'Pengalaman Ayu mengajarkan sikap yang dapat dipakai dalam kehidupan sehari-hari: berpikir, bertanggung jawab, dan bekerja sama.', NULL, NULL),
(118, 118, 'Peristiwa, penyelesaian, dan pelajaran saling berkaitan. Pilihan A, B, dan D sesuai dengan alur cerita, sedangkan C tidak tepat karena latar membantu membangun peristiwa.', NULL, NULL),
(119, 119, 'Akhir cerita menyelesaikan masalah dan memperlihatkan pelajaran yang diperoleh tokoh. Karena itu, pembaca wajar merasa lega serta menghargai usaha dan perubahan sikapnya.', NULL, NULL),
(120, 120, 'Pengalaman Fajar mengajarkan sikap yang dapat dipakai dalam kehidupan sehari-hari: berpikir, bertanggung jawab, dan bekerja sama.
Acuan
Dokumen Kurikulum (Bahasa Indonesia).md dan Dokumen Kurikulum (format output).md yang diberikan sebagai acuan penyusunan.
Kerangka Asesmen TKA Bahasa Indonesia SMP, Pusat Asesmen Pendidikan: https://pusmendik.kemendikdasmen.go.id/tka/tka/view/mata-pelajaran-wajib/smp/Bahasa-Indonesia', NULL, NULL)
ON DUPLICATE KEY UPDATE `question_id` = VALUES(`question_id`), `explanation_text` = VALUES(`explanation_text`);

-- -----------------------------------------------------------------------------
-- 6. PEMETAAN BUTIR SOAL KE PAKET SIMULASI (SIMULATION_QUESTIONS - 120 Relasi)
-- -----------------------------------------------------------------------------
INSERT INTO `simulation_questions` (`id`, `simulation_id`, `question_id`, `question_order`) VALUES
(1, 1, 1, 1),
(2, 1, 2, 2),
(3, 1, 3, 3),
(4, 1, 6, 4),
(5, 1, 7, 5),
(6, 1, 8, 6),
(7, 1, 11, 7),
(8, 1, 12, 8),
(9, 1, 16, 9),
(10, 1, 17, 10),
(11, 1, 20, 11),
(12, 1, 21, 12),
(13, 1, 24, 13),
(14, 1, 26, 14),
(15, 1, 29, 15),
(16, 1, 31, 16),
(17, 1, 32, 17),
(18, 1, 33, 18),
(19, 1, 36, 19),
(20, 1, 38, 20),
(21, 1, 41, 21),
(22, 1, 42, 22),
(23, 1, 43, 23),
(24, 1, 46, 24),
(25, 1, 47, 25),
(26, 1, 48, 26),
(27, 1, 52, 27),
(28, 1, 54, 28),
(29, 1, 55, 29),
(30, 1, 56, 30),
(31, 2, 4, 1),
(32, 2, 5, 2),
(33, 2, 9, 3),
(34, 2, 10, 4),
(35, 2, 13, 5),
(36, 2, 14, 6),
(37, 2, 15, 7),
(38, 2, 18, 8),
(39, 2, 19, 9),
(40, 2, 22, 10),
(41, 2, 23, 11),
(42, 2, 25, 12),
(43, 2, 27, 13),
(44, 2, 28, 14),
(45, 2, 30, 15),
(46, 2, 34, 16),
(47, 2, 35, 17),
(48, 2, 37, 18),
(49, 2, 39, 19),
(50, 2, 40, 20),
(51, 2, 44, 21),
(52, 2, 45, 22),
(53, 2, 49, 23),
(54, 2, 50, 24),
(55, 2, 51, 25),
(56, 2, 53, 26),
(57, 2, 57, 27),
(58, 2, 58, 28),
(59, 2, 59, 29),
(60, 2, 60, 30),
(61, 3, 61, 1),
(62, 3, 62, 2),
(63, 3, 63, 3),
(64, 3, 64, 4),
(65, 3, 65, 5),
(66, 3, 66, 6),
(67, 3, 71, 7),
(68, 3, 72, 8),
(69, 3, 73, 9),
(70, 3, 74, 10),
(71, 3, 75, 11),
(72, 3, 76, 12),
(73, 3, 81, 13),
(74, 3, 82, 14),
(75, 3, 83, 15),
(76, 3, 91, 16),
(77, 3, 92, 17),
(78, 3, 93, 18),
(79, 3, 94, 19),
(80, 3, 95, 20),
(81, 3, 96, 21),
(82, 3, 101, 22),
(83, 3, 102, 23),
(84, 3, 103, 24),
(85, 3, 104, 25),
(86, 3, 105, 26),
(87, 3, 106, 27),
(88, 3, 111, 28),
(89, 3, 112, 29),
(90, 3, 113, 30),
(91, 4, 67, 1),
(92, 4, 68, 2),
(93, 4, 69, 3),
(94, 4, 70, 4),
(95, 4, 77, 5),
(96, 4, 78, 6),
(97, 4, 79, 7),
(98, 4, 80, 8),
(99, 4, 84, 9),
(100, 4, 85, 10),
(101, 4, 86, 11),
(102, 4, 87, 12),
(103, 4, 88, 13),
(104, 4, 89, 14),
(105, 4, 90, 15),
(106, 4, 97, 16),
(107, 4, 98, 17),
(108, 4, 99, 18),
(109, 4, 100, 19),
(110, 4, 107, 20),
(111, 4, 108, 21),
(112, 4, 109, 22),
(113, 4, 110, 23),
(114, 4, 114, 24),
(115, 4, 115, 25),
(116, 4, 116, 26),
(117, 4, 117, 27),
(118, 4, 118, 28),
(119, 4, 119, 29),
(120, 4, 120, 30)
ON DUPLICATE KEY UPDATE `simulation_id` = VALUES(`simulation_id`), `question_id` = VALUES(`question_id`), `question_order` = VALUES(`question_order`);

SET FOREIGN_KEY_CHECKS = 1;
-- =============================================================================
-- SELESAI: 4 Paket Simulasi TKA berhasil dibenihkan ke database.
-- =============================================================================
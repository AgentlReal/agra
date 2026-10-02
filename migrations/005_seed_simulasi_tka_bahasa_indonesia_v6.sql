-- =============================================================================
-- SEEDING PAKET SIMULASI TKA: BAHASA INDONESIA (PAKET 01 & PAKET 02)
-- Berkas: migrations/005_seed_simulasi_tka_bahasa_indonesia_v6.sql
-- Sumber: docs/Simulasi TKA/Bahasa Indonesia/ (simulasitka_bahasaindonesia_paket1.docx & paket2.docx)
-- Cakupan: 2 Paket Simulasi, 24 Stimulus Wacana, 60 Soal Master, 240 Opsi Jawaban, 60 Pembahasan
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. PEMBENIHAN PAKET SIMULASI BAHASA INDONESIA (SIMULATIONS)
-- -----------------------------------------------------------------------------
INSERT INTO `simulations` (`id`, `subject_id`, `title`, `package_code`, `duration_minutes`, `total_questions`, `passing_score`, `xp_reward`, `status`, `is_active`) VALUES
(3, 2, 'Simulasi TKA Bahasa Indonesia - Paket 01', 'BIN-SIM-01', 75, 30, 90.00, 500, 'ACTIVE', TRUE),
(4, 2, 'Simulasi TKA Bahasa Indonesia - Paket 02', 'BIN-SIM-02', 75, 30, 90.00, 500, 'ACTIVE', TRUE)
ON DUPLICATE KEY UPDATE `subject_id` = VALUES(`subject_id`), `title` = VALUES(`title`), `package_code` = VALUES(`package_code`), `duration_minutes` = VALUES(`duration_minutes`), `total_questions` = VALUES(`total_questions`), `passing_score` = VALUES(`passing_score`), `xp_reward` = VALUES(`xp_reward`), `status` = VALUES(`status`), `is_active` = VALUES(`is_active`);

-- -----------------------------------------------------------------------------
-- 2. PEMBENIHAN TEKS BACAAN / WACANA BERSAMA (STIMULI - 24 Stimulus)
-- -----------------------------------------------------------------------------
INSERT INTO `stimuli` (`id`,`subject_id`,`title`,`stimulus_text`,`stimulus_image_url`) VALUES
(1,2,'Kebun sekolah hemat air','Di kebun sekolah, warga dan siswa menjalankan program untuk menanam sayuran tanpa memboroskan air. Sebelumnya, mereka melihat bahwa kebiasaan kecil sering menimbulkan masalah yang lebih besar. Karena itu, pengurus mengajak peserta membicarakan kebutuhan bersama sebelum memilih langkah. Mereka mencatat keadaan awal, menentukan tugas, lalu menyepakati waktu kegiatan. Cara ini membuat setiap orang tahu alasan program tersebut dilakukan. Mereka juga memahami bahwa keberhasilan tidak hanya bergantung pada alat, tetapi pada kebiasaan yang dijalankan secara konsisten.

Langkah pertama ialah air hujan ditampung dalam drum tertutup. Setelah itu, peserta siswa memasang mulsa dari daun kering, sedangkan penyiraman dilakukan pagi hari. Pembagian tugas tersebut membuat pekerjaan lebih mudah dipantau. Selama kegiatan, pengurus mengumpulkan catatan sederhana agar perubahan dapat dibandingkan. Hasil pengamatan menunjukkan bahwa tanah tetap lembap dan tanaman tumbuh baik. Meski begitu, kegiatan belum selesai setelah hasil awal terlihat. Peserta masih perlu memeriksa keadaan secara berkala dan memperbaiki langkah yang kurang tepat. Dengan begitu, keputusan berikutnya didasarkan pada keadaan nyata, bukan dugaan semata.

Program ini juga mengajarkan bahwa perawatan bersama membuat kebun lebih teratur. Sebagai tindak lanjut, kelompok kebun mencatat jumlah air setiap pekan. Warga dapat menyampaikan saran jika menemukan kendala, lalu pengurus membahasnya bersama. Kegiatan tersebut tidak menuntut perubahan besar dalam satu hari. Kebiasaan yang mudah dilakukan justru lebih mungkin bertahan. Jika semua pihak ikut merawat hasilnya, manfaat program dapat dirasakan lebih lama. Pengalaman ini menunjukkan bahwa kerja sama, pencatatan, dan kepedulian saling melengkapi dalam menyelesaikan persoalan di lingkungan sekitar.',NULL),
(2,2,'Perpustakaan keliling','Di lapangan desa, warga dan siswa menjalankan program untuk mendekatkan bacaan kepada anak-anak. Sebelumnya, mereka melihat bahwa kebiasaan kecil sering menimbulkan masalah yang lebih besar. Karena itu, pengurus mengajak peserta membicarakan kebutuhan bersama sebelum memilih langkah. Mereka mencatat keadaan awal, menentukan tugas, lalu menyepakati waktu kegiatan. Cara ini membuat setiap orang tahu alasan program tersebut dilakukan. Mereka juga memahami bahwa keberhasilan tidak hanya bergantung pada alat, tetapi pada kebiasaan yang dijalankan secara konsisten.

Langkah pertama ialah sepeda motor membawa kotak buku. Setelah itu, peserta petugas mencatat peminjaman pada kartu, sedangkan anak dapat memilih buku selama dua pekan. Pembagian tugas tersebut membuat pekerjaan lebih mudah dipantau. Selama kegiatan, pengurus mengumpulkan catatan sederhana agar perubahan dapat dibandingkan. Hasil pengamatan menunjukkan bahwa jumlah peminjam bertambah setelah jadwal diumumkan. Meski begitu, kegiatan belum selesai setelah hasil awal terlihat. Peserta masih perlu memeriksa keadaan secara berkala dan memperbaiki langkah yang kurang tepat. Dengan begitu, keputusan berikutnya didasarkan pada keadaan nyata, bukan dugaan semata.

Program ini juga mengajarkan bahwa akses bacaan yang mudah mendorong kebiasaan membaca. Sebagai tindak lanjut, warga membantu menjaga buku tetap bersih. Warga dapat menyampaikan saran jika menemukan kendala, lalu pengurus membahasnya bersama. Kegiatan tersebut tidak menuntut perubahan besar dalam satu hari. Kebiasaan yang mudah dilakukan justru lebih mungkin bertahan. Jika semua pihak ikut merawat hasilnya, manfaat program dapat dirasakan lebih lama. Pengalaman ini menunjukkan bahwa kerja sama, pencatatan, dan kepedulian saling melengkapi dalam menyelesaikan persoalan di lingkungan sekitar.',NULL),
(3,2,'Bank sampah kelas','Di ruang belakang sekolah, warga dan siswa menjalankan program untuk mengurangi sampah yang tercampur. Sebelumnya, mereka melihat bahwa kebiasaan kecil sering menimbulkan masalah yang lebih besar. Karena itu, pengurus mengajak peserta membicarakan kebutuhan bersama sebelum memilih langkah. Mereka mencatat keadaan awal, menentukan tugas, lalu menyepakati waktu kegiatan. Cara ini membuat setiap orang tahu alasan program tersebut dilakukan. Mereka juga memahami bahwa keberhasilan tidak hanya bergantung pada alat, tetapi pada kebiasaan yang dijalankan secara konsisten.

Langkah pertama ialah siswa memilah kertas, botol, dan kaleng. Setelah itu, peserta setiap jenis disimpan dalam wadah berbeda, sedangkan petugas menimbang sampah setiap Jumat. Pembagian tugas tersebut membuat pekerjaan lebih mudah dipantau. Selama kegiatan, pengurus mengumpulkan catatan sederhana agar perubahan dapat dibandingkan. Hasil pengamatan menunjukkan bahwa hasil penjualan dipakai membeli bibit tanaman. Meski begitu, kegiatan belum selesai setelah hasil awal terlihat. Peserta masih perlu memeriksa keadaan secara berkala dan memperbaiki langkah yang kurang tepat. Dengan begitu, keputusan berikutnya didasarkan pada keadaan nyata, bukan dugaan semata.

Program ini juga mengajarkan bahwa kebiasaan memilah lebih berguna daripada sekadar mengumpulkan. Sebagai tindak lanjut, catatan berat membantu kelas melihat perubahan. Warga dapat menyampaikan saran jika menemukan kendala, lalu pengurus membahasnya bersama. Kegiatan tersebut tidak menuntut perubahan besar dalam satu hari. Kebiasaan yang mudah dilakukan justru lebih mungkin bertahan. Jika semua pihak ikut merawat hasilnya, manfaat program dapat dirasakan lebih lama. Pengalaman ini menunjukkan bahwa kerja sama, pencatatan, dan kepedulian saling melengkapi dalam menyelesaikan persoalan di lingkungan sekitar.',NULL),
(4,2,'Jalur aman ke sekolah','Di jalan utama kampung, warga dan siswa menjalankan program untuk membantu murid berjalan dengan aman. Sebelumnya, mereka melihat bahwa kebiasaan kecil sering menimbulkan masalah yang lebih besar. Karena itu, pengurus mengajak peserta membicarakan kebutuhan bersama sebelum memilih langkah. Mereka mencatat keadaan awal, menentukan tugas, lalu menyepakati waktu kegiatan. Cara ini membuat setiap orang tahu alasan program tersebut dilakukan. Mereka juga memahami bahwa keberhasilan tidak hanya bergantung pada alat, tetapi pada kebiasaan yang dijalankan secara konsisten.

Langkah pertama ialah warga menandai jalur pejalan kaki. Setelah itu, peserta pengendara diminta melambat dekat gerbang, sedangkan relawan berjaga saat jam masuk. Pembagian tugas tersebut membuat pekerjaan lebih mudah dipantau. Selama kegiatan, pengurus mengumpulkan catatan sederhana agar perubahan dapat dibandingkan. Hasil pengamatan menunjukkan bahwa jumlah kendaraan yang berhenti sembarangan menurun. Meski begitu, kegiatan belum selesai setelah hasil awal terlihat. Peserta masih perlu memeriksa keadaan secara berkala dan memperbaiki langkah yang kurang tepat. Dengan begitu, keputusan berikutnya didasarkan pada keadaan nyata, bukan dugaan semata.

Program ini juga mengajarkan bahwa keselamatan perlu kerja sama warga dan pengguna jalan. Sebagai tindak lanjut, murid tetap berjalan berpasangan. Warga dapat menyampaikan saran jika menemukan kendala, lalu pengurus membahasnya bersama. Kegiatan tersebut tidak menuntut perubahan besar dalam satu hari. Kebiasaan yang mudah dilakukan justru lebih mungkin bertahan. Jika semua pihak ikut merawat hasilnya, manfaat program dapat dirasakan lebih lama. Pengalaman ini menunjukkan bahwa kerja sama, pencatatan, dan kepedulian saling melengkapi dalam menyelesaikan persoalan di lingkungan sekitar.',NULL),
(5,2,'Kantin tanpa sisa','Di kantin sekolah, warga dan siswa menjalankan program untuk mengurangi makanan yang terbuang. Sebelumnya, mereka melihat bahwa kebiasaan kecil sering menimbulkan masalah yang lebih besar. Karena itu, pengurus mengajak peserta membicarakan kebutuhan bersama sebelum memilih langkah. Mereka mencatat keadaan awal, menentukan tugas, lalu menyepakati waktu kegiatan. Cara ini membuat setiap orang tahu alasan program tersebut dilakukan. Mereka juga memahami bahwa keberhasilan tidak hanya bergantung pada alat, tetapi pada kebiasaan yang dijalankan secara konsisten.

Langkah pertama ialah kantin menyediakan porsi kecil dan sedang. Setelah itu, peserta murid boleh menambah nasi bila masih lapar, sedangkan sisa makanan ditimbang setelah istirahat. Pembagian tugas tersebut membuat pekerjaan lebih mudah dipantau. Selama kegiatan, pengurus mengumpulkan catatan sederhana agar perubahan dapat dibandingkan. Hasil pengamatan menunjukkan bahwa sisa harian berkurang selama satu bulan. Meski begitu, kegiatan belum selesai setelah hasil awal terlihat. Peserta masih perlu memeriksa keadaan secara berkala dan memperbaiki langkah yang kurang tepat. Dengan begitu, keputusan berikutnya didasarkan pada keadaan nyata, bukan dugaan semata.

Program ini juga mengajarkan bahwa pilihan porsi membantu murid mengambil makanan secukupnya. Sebagai tindak lanjut, petugas kantin tetap menjaga kebersihan. Warga dapat menyampaikan saran jika menemukan kendala, lalu pengurus membahasnya bersama. Kegiatan tersebut tidak menuntut perubahan besar dalam satu hari. Kebiasaan yang mudah dilakukan justru lebih mungkin bertahan. Jika semua pihak ikut merawat hasilnya, manfaat program dapat dirasakan lebih lama. Pengalaman ini menunjukkan bahwa kerja sama, pencatatan, dan kepedulian saling melengkapi dalam menyelesaikan persoalan di lingkungan sekitar.',NULL),
(6,2,'Peta mata air desa','Di lereng desa, warga dan siswa menjalankan program untuk menjaga sumber air yang dipakai warga. Sebelumnya, mereka melihat bahwa kebiasaan kecil sering menimbulkan masalah yang lebih besar. Karena itu, pengurus mengajak peserta membicarakan kebutuhan bersama sebelum memilih langkah. Mereka mencatat keadaan awal, menentukan tugas, lalu menyepakati waktu kegiatan. Cara ini membuat setiap orang tahu alasan program tersebut dilakukan. Mereka juga memahami bahwa keberhasilan tidak hanya bergantung pada alat, tetapi pada kebiasaan yang dijalankan secara konsisten.

Langkah pertama ialah tim mencatat lokasi mata air dan jalur menuju sana. Setelah itu, peserta warga memasang papan larangan membuang sampah, sedangkan pemeriksaan dilakukan setiap awal bulan. Pembagian tugas tersebut membuat pekerjaan lebih mudah dipantau. Selama kegiatan, pengurus mengumpulkan catatan sederhana agar perubahan dapat dibandingkan. Hasil pengamatan menunjukkan bahwa air mengalir lebih jernih setelah area dibersihkan. Meski begitu, kegiatan belum selesai setelah hasil awal terlihat. Peserta masih perlu memeriksa keadaan secara berkala dan memperbaiki langkah yang kurang tepat. Dengan begitu, keputusan berikutnya didasarkan pada keadaan nyata, bukan dugaan semata.

Program ini juga mengajarkan bahwa data lokasi memudahkan warga merawat sumber air. Sebagai tindak lanjut, peta dibagikan kepada pengurus dusun. Warga dapat menyampaikan saran jika menemukan kendala, lalu pengurus membahasnya bersama. Kegiatan tersebut tidak menuntut perubahan besar dalam satu hari. Kebiasaan yang mudah dilakukan justru lebih mungkin bertahan. Jika semua pihak ikut merawat hasilnya, manfaat program dapat dirasakan lebih lama. Pengalaman ini menunjukkan bahwa kerja sama, pencatatan, dan kepedulian saling melengkapi dalam menyelesaikan persoalan di lingkungan sekitar.',NULL),
(7,2,'Ruang baca di halte','Di halte bus kota, warga dan siswa menjalankan program untuk mengisi waktu tunggu dengan kegiatan bermanfaat. Sebelumnya, mereka melihat bahwa kebiasaan kecil sering menimbulkan masalah yang lebih besar. Karena itu, pengurus mengajak peserta membicarakan kebutuhan bersama sebelum memilih langkah. Mereka mencatat keadaan awal, menentukan tugas, lalu menyepakati waktu kegiatan. Cara ini membuat setiap orang tahu alasan program tersebut dilakukan. Mereka juga memahami bahwa keberhasilan tidak hanya bergantung pada alat, tetapi pada kebiasaan yang dijalankan secara konsisten.

Langkah pertama ialah rak kecil berisi buku cerita dan majalah. Setelah itu, peserta pengunjung membaca di tempat, sedangkan relawan mengganti bacaan setiap dua minggu. Pembagian tugas tersebut membuat pekerjaan lebih mudah dipantau. Selama kegiatan, pengurus mengumpulkan catatan sederhana agar perubahan dapat dibandingkan. Hasil pengamatan menunjukkan bahwa halte terasa lebih nyaman bagi penumpang. Meski begitu, kegiatan belum selesai setelah hasil awal terlihat. Peserta masih perlu memeriksa keadaan secara berkala dan memperbaiki langkah yang kurang tepat. Dengan begitu, keputusan berikutnya didasarkan pada keadaan nyata, bukan dugaan semata.

Program ini juga mengajarkan bahwa fasilitas sederhana dapat memperkaya ruang umum. Sebagai tindak lanjut, papan aturan menjaga buku tetap rapi. Warga dapat menyampaikan saran jika menemukan kendala, lalu pengurus membahasnya bersama. Kegiatan tersebut tidak menuntut perubahan besar dalam satu hari. Kebiasaan yang mudah dilakukan justru lebih mungkin bertahan. Jika semua pihak ikut merawat hasilnya, manfaat program dapat dirasakan lebih lama. Pengalaman ini menunjukkan bahwa kerja sama, pencatatan, dan kepedulian saling melengkapi dalam menyelesaikan persoalan di lingkungan sekitar.',NULL),
(8,2,'Kompos dari daun','Di halaman sekolah, warga dan siswa menjalankan program untuk memanfaatkan daun gugur sebagai pupuk. Sebelumnya, mereka melihat bahwa kebiasaan kecil sering menimbulkan masalah yang lebih besar. Karena itu, pengurus mengajak peserta membicarakan kebutuhan bersama sebelum memilih langkah. Mereka mencatat keadaan awal, menentukan tugas, lalu menyepakati waktu kegiatan. Cara ini membuat setiap orang tahu alasan program tersebut dilakukan. Mereka juga memahami bahwa keberhasilan tidak hanya bergantung pada alat, tetapi pada kebiasaan yang dijalankan secara konsisten.

Langkah pertama ialah daun dicacah lalu dimasukkan ke wadah kompos. Setelah itu, peserta siswa mengaduk bahan dan menjaga kelembapannya, sedangkan kompos matang setelah beberapa pekan. Pembagian tugas tersebut membuat pekerjaan lebih mudah dipantau. Selama kegiatan, pengurus mengumpulkan catatan sederhana agar perubahan dapat dibandingkan. Hasil pengamatan menunjukkan bahwa pupuk digunakan pada tanaman kelas. Meski begitu, kegiatan belum selesai setelah hasil awal terlihat. Peserta masih perlu memeriksa keadaan secara berkala dan memperbaiki langkah yang kurang tepat. Dengan begitu, keputusan berikutnya didasarkan pada keadaan nyata, bukan dugaan semata.

Program ini juga mengajarkan bahwa pengolahan tepat mengubah sampah organik menjadi berguna. Sebagai tindak lanjut, bau berkurang karena bahan ditutup. Warga dapat menyampaikan saran jika menemukan kendala, lalu pengurus membahasnya bersama. Kegiatan tersebut tidak menuntut perubahan besar dalam satu hari. Kebiasaan yang mudah dilakukan justru lebih mungkin bertahan. Jika semua pihak ikut merawat hasilnya, manfaat program dapat dirasakan lebih lama. Pengalaman ini menunjukkan bahwa kerja sama, pencatatan, dan kepedulian saling melengkapi dalam menyelesaikan persoalan di lingkungan sekitar.',NULL),
(9,2,'Peringatan cuaca warga','Di balai kampung, warga dan siswa menjalankan program untuk membantu warga bersiap menghadapi hujan lebat. Sebelumnya, mereka melihat bahwa kebiasaan kecil sering menimbulkan masalah yang lebih besar. Karena itu, pengurus mengajak peserta membicarakan kebutuhan bersama sebelum memilih langkah. Mereka mencatat keadaan awal, menentukan tugas, lalu menyepakati waktu kegiatan. Cara ini membuat setiap orang tahu alasan program tersebut dilakukan. Mereka juga memahami bahwa keberhasilan tidak hanya bergantung pada alat, tetapi pada kebiasaan yang dijalankan secara konsisten.

Langkah pertama ialah relawan memantau informasi cuaca resmi. Setelah itu, peserta pesan dikirim melalui pengeras suara dan grup warga, sedangkan keluarga menyiapkan lampu serta dokumen penting. Pembagian tugas tersebut membuat pekerjaan lebih mudah dipantau. Selama kegiatan, pengurus mengumpulkan catatan sederhana agar perubahan dapat dibandingkan. Hasil pengamatan menunjukkan bahwa warga punya waktu lebih untuk mengamankan barang. Meski begitu, kegiatan belum selesai setelah hasil awal terlihat. Peserta masih perlu memeriksa keadaan secara berkala dan memperbaiki langkah yang kurang tepat. Dengan begitu, keputusan berikutnya didasarkan pada keadaan nyata, bukan dugaan semata.

Program ini juga mengajarkan bahwa informasi jelas membantu keputusan cepat. Sebagai tindak lanjut, pesan singkat menyebut waktu dan wilayah terdampak. Warga dapat menyampaikan saran jika menemukan kendala, lalu pengurus membahasnya bersama. Kegiatan tersebut tidak menuntut perubahan besar dalam satu hari. Kebiasaan yang mudah dilakukan justru lebih mungkin bertahan. Jika semua pihak ikut merawat hasilnya, manfaat program dapat dirasakan lebih lama. Pengalaman ini menunjukkan bahwa kerja sama, pencatatan, dan kepedulian saling melengkapi dalam menyelesaikan persoalan di lingkungan sekitar.',NULL),
(10,2,'Pasar hasil kebun','Di aula desa, warga dan siswa menjalankan program untuk mempertemukan petani dengan pembeli setempat. Sebelumnya, mereka melihat bahwa kebiasaan kecil sering menimbulkan masalah yang lebih besar. Karena itu, pengurus mengajak peserta membicarakan kebutuhan bersama sebelum memilih langkah. Mereka mencatat keadaan awal, menentukan tugas, lalu menyepakati waktu kegiatan. Cara ini membuat setiap orang tahu alasan program tersebut dilakukan. Mereka juga memahami bahwa keberhasilan tidak hanya bergantung pada alat, tetapi pada kebiasaan yang dijalankan secara konsisten.

Langkah pertama ialah petani membawa sayur yang dipanen pagi. Setelah itu, peserta harga dan asal kebun ditulis pada label, sedangkan pembeli dapat bertanya langsung kepada petani. Pembagian tugas tersebut membuat pekerjaan lebih mudah dipantau. Selama kegiatan, pengurus mengumpulkan catatan sederhana agar perubahan dapat dibandingkan. Hasil pengamatan menunjukkan bahwa lebih banyak hasil kebun terjual pada hari pasar. Meski begitu, kegiatan belum selesai setelah hasil awal terlihat. Peserta masih perlu memeriksa keadaan secara berkala dan memperbaiki langkah yang kurang tepat. Dengan begitu, keputusan berikutnya didasarkan pada keadaan nyata, bukan dugaan semata.

Program ini juga mengajarkan bahwa hubungan langsung membuat informasi produk lebih terbuka. Sebagai tindak lanjut, kemasan digunakan kembali oleh pengunjung. Warga dapat menyampaikan saran jika menemukan kendala, lalu pengurus membahasnya bersama. Kegiatan tersebut tidak menuntut perubahan besar dalam satu hari. Kebiasaan yang mudah dilakukan justru lebih mungkin bertahan. Jika semua pihak ikut merawat hasilnya, manfaat program dapat dirasakan lebih lama. Pengalaman ini menunjukkan bahwa kerja sama, pencatatan, dan kepedulian saling melengkapi dalam menyelesaikan persoalan di lingkungan sekitar.',NULL),
(11,2,'Pojok isi ulang air','Di koridor sekolah, warga dan siswa menjalankan program untuk mengurangi penggunaan botol sekali pakai. Sebelumnya, mereka melihat bahwa kebiasaan kecil sering menimbulkan masalah yang lebih besar. Karena itu, pengurus mengajak peserta membicarakan kebutuhan bersama sebelum memilih langkah. Mereka mencatat keadaan awal, menentukan tugas, lalu menyepakati waktu kegiatan. Cara ini membuat setiap orang tahu alasan program tersebut dilakukan. Mereka juga memahami bahwa keberhasilan tidak hanya bergantung pada alat, tetapi pada kebiasaan yang dijalankan secara konsisten.

Langkah pertama ialah murid membawa botol minum sendiri. Setelah itu, peserta petugas memeriksa kebersihan dispenser, sedangkan air tersedia saat jam istirahat. Pembagian tugas tersebut membuat pekerjaan lebih mudah dipantau. Selama kegiatan, pengurus mengumpulkan catatan sederhana agar perubahan dapat dibandingkan. Hasil pengamatan menunjukkan bahwa sampah botol di kelas berkurang. Meski begitu, kegiatan belum selesai setelah hasil awal terlihat. Peserta masih perlu memeriksa keadaan secara berkala dan memperbaiki langkah yang kurang tepat. Dengan begitu, keputusan berikutnya didasarkan pada keadaan nyata, bukan dugaan semata.

Program ini juga mengajarkan bahwa fasilitas baik perlu dirawat secara rutin. Sebagai tindak lanjut, jadwal pembersihan ditempel dekat dispenser. Warga dapat menyampaikan saran jika menemukan kendala, lalu pengurus membahasnya bersama. Kegiatan tersebut tidak menuntut perubahan besar dalam satu hari. Kebiasaan yang mudah dilakukan justru lebih mungkin bertahan. Jika semua pihak ikut merawat hasilnya, manfaat program dapat dirasakan lebih lama. Pengalaman ini menunjukkan bahwa kerja sama, pencatatan, dan kepedulian saling melengkapi dalam menyelesaikan persoalan di lingkungan sekitar.',NULL),
(12,2,'Lampu tenaga surya','Di taman lingkungan, warga dan siswa menjalankan program untuk menerangi jalan kecil pada malam hari. Sebelumnya, mereka melihat bahwa kebiasaan kecil sering menimbulkan masalah yang lebih besar. Karena itu, pengurus mengajak peserta membicarakan kebutuhan bersama sebelum memilih langkah. Mereka mencatat keadaan awal, menentukan tugas, lalu menyepakati waktu kegiatan. Cara ini membuat setiap orang tahu alasan program tersebut dilakukan. Mereka juga memahami bahwa keberhasilan tidak hanya bergantung pada alat, tetapi pada kebiasaan yang dijalankan secara konsisten.

Langkah pertama ialah panel menangkap cahaya matahari siang. Setelah itu, peserta baterai menyimpan energi untuk lampu, sedangkan warga membersihkan panel setiap pekan. Pembagian tugas tersebut membuat pekerjaan lebih mudah dipantau. Selama kegiatan, pengurus mengumpulkan catatan sederhana agar perubahan dapat dibandingkan. Hasil pengamatan menunjukkan bahwa jalan lebih mudah dilalui setelah gelap. Meski begitu, kegiatan belum selesai setelah hasil awal terlihat. Peserta masih perlu memeriksa keadaan secara berkala dan memperbaiki langkah yang kurang tepat. Dengan begitu, keputusan berikutnya didasarkan pada keadaan nyata, bukan dugaan semata.

Program ini juga mengajarkan bahwa pemilihan lokasi menentukan manfaat fasilitas. Sebagai tindak lanjut, lampu dipasang pada titik yang disepakati. Warga dapat menyampaikan saran jika menemukan kendala, lalu pengurus membahasnya bersama. Kegiatan tersebut tidak menuntut perubahan besar dalam satu hari. Kebiasaan yang mudah dilakukan justru lebih mungkin bertahan. Jika semua pihak ikut merawat hasilnya, manfaat program dapat dirasakan lebih lama. Pengalaman ini menunjukkan bahwa kerja sama, pencatatan, dan kepedulian saling melengkapi dalam menyelesaikan persoalan di lingkungan sekitar.',NULL),
(13,2,'Surat di dalam buku','Pada suatu sore, Nara berada di perpustakaan sekolah. Saat itu, ia menemukan bahwa sebuah surat lama terselip di buku pinjaman. Keadaan tersebut membuatnya berpikir tentang langkah yang harus dipilih. Ia ingin segera menyelesaikannya karena ia ingin mengembalikan surat kepada pemiliknya. Namun, Nara berhenti sejenak dan memperhatikan keadaan di sekelilingnya. Ia teringat pesan orang dewasa agar tidak bertindak terburu-buru. Di dekatnya ada beberapa orang yang mungkin dapat membantu. Meski merasa cemas, ia mencoba menenangkan diri dan menyusun rencana.

Mula-mula, Nara mencoba mencari tahu penyebab masalah. Kemudian, Nara bertanya kepada penjaga dan menelusuri cap tanggal. Proses itu tidak langsung berhasil; ada bagian yang perlu diulang dan ada pendapat yang harus didengarkan. Nara akhirnya memahami bahwa meminta bantuan bukan tanda kelemahan. Setelah semua bekerja sama, pemilik surat ditemukan sebagai Bu Ratih, guru yang dulu mengajar ibunya. Orang-orang di sekitarnya ikut merasa lega. Nara menyerahkan surat dengan hati-hati. Peristiwa tersebut membuat Nara menilai kembali sikapnya sebelum masalah muncul. Ia menyadari bahwa keputusan yang baik perlu mempertimbangkan akibat bagi orang lain.

Setelah kejadian itu, Nara menceritakannya kepada keluarga dan teman. Ia tidak menyombongkan diri karena semuanya berhasil berkat bantuan bersama. Sebaliknya, ia mengingat bagian yang sempat membuatnya ragu. Pengalaman itu mengubah cara pandangnya: ia memahami bahwa benda kecil dapat menyimpan kenangan besar. Sejak hari tersebut, ia berusaha lebih teliti saat menghadapi persoalan baru. Ia juga belajar bahwa rasa takut atau kecewa boleh muncul, tetapi keduanya tidak harus menentukan tindakan. Yang terpenting ialah memilih langkah yang bertanggung jawab dan mau belajar dari hasilnya.',NULL),
(14,2,'Layangan yang putus','Pada suatu sore, Bima berada di lapangan dekat rumah. Saat itu, ia menemukan bahwa layangan buatan adiknya tersangkut di pohon. Keadaan tersebut membuatnya berpikir tentang langkah yang harus dipilih. Ia ingin segera menyelesaikannya karena Bima semula ingin memanjat sendiri agar cepat selesai. Namun, Bima berhenti sejenak dan memperhatikan keadaan di sekelilingnya. Ia teringat pesan orang dewasa agar tidak bertindak terburu-buru. Di dekatnya ada beberapa orang yang mungkin dapat membantu. Meski merasa cemas, ia mencoba menenangkan diri dan menyusun rencana.

Mula-mula, Bima mencoba mencari tahu penyebab masalah. Kemudian, ia meminta bantuan tetangga membawa galah panjang. Proses itu tidak langsung berhasil; ada bagian yang perlu diulang dan ada pendapat yang harus didengarkan. Bima akhirnya memahami bahwa meminta bantuan bukan tanda kelemahan. Setelah semua bekerja sama, layangan turun tanpa merusak dahan. Orang-orang di sekitarnya ikut merasa lega. Bima meminta maaf karena tadi hampir bertindak gegabah. Peristiwa tersebut membuat Bima menilai kembali sikapnya sebelum masalah muncul. Ia menyadari bahwa keputusan yang baik perlu mempertimbangkan akibat bagi orang lain.

Setelah kejadian itu, Bima menceritakannya kepada keluarga dan teman. Ia tidak menyombongkan diri karena semuanya berhasil berkat bantuan bersama. Sebaliknya, ia mengingat bagian yang sempat membuatnya ragu. Pengalaman itu mengubah cara pandangnya: ia belajar bahwa keberanian juga berarti memilih cara aman. Sejak hari tersebut, ia berusaha lebih teliti saat menghadapi persoalan baru. Ia juga belajar bahwa rasa takut atau kecewa boleh muncul, tetapi keduanya tidak harus menentukan tindakan. Yang terpenting ialah memilih langkah yang bertanggung jawab dan mau belajar dari hasilnya.',NULL),
(15,2,'Kursi kosong di pentas','Pada suatu sore, Laras berada di aula sekolah. Saat itu, ia menemukan bahwa pemain utama pementasan tiba-tiba sakit. Keadaan tersebut membuatnya berpikir tentang langkah yang harus dipilih. Ia ingin segera menyelesaikannya karena Laras takut menggantikan teman karena belum hafal semua dialog. Namun, Laras berhenti sejenak dan memperhatikan keadaan di sekelilingnya. Ia teringat pesan orang dewasa agar tidak bertindak terburu-buru. Di dekatnya ada beberapa orang yang mungkin dapat membantu. Meski merasa cemas, ia mencoba menenangkan diri dan menyusun rencana.

Mula-mula, Laras mencoba mencari tahu penyebab masalah. Kemudian, ia berlatih bersama kelompok dan meminta tanda adegan. Proses itu tidak langsung berhasil; ada bagian yang perlu diulang dan ada pendapat yang harus didengarkan. Laras akhirnya memahami bahwa meminta bantuan bukan tanda kelemahan. Setelah semua bekerja sama, pentas berjalan lancar karena teman-teman saling membantu. Orang-orang di sekitarnya ikut merasa lega. Laras mengucapkan terima kasih setelah pertunjukan. Peristiwa tersebut membuat Laras menilai kembali sikapnya sebelum masalah muncul. Ia menyadari bahwa keputusan yang baik perlu mempertimbangkan akibat bagi orang lain.

Setelah kejadian itu, Laras menceritakannya kepada keluarga dan teman. Ia tidak menyombongkan diri karena semuanya berhasil berkat bantuan bersama. Sebaliknya, ia mengingat bagian yang sempat membuatnya ragu. Pengalaman itu mengubah cara pandangnya: ia menyadari kerja sama lebih penting daripada tampil sempurna. Sejak hari tersebut, ia berusaha lebih teliti saat menghadapi persoalan baru. Ia juga belajar bahwa rasa takut atau kecewa boleh muncul, tetapi keduanya tidak harus menentukan tindakan. Yang terpenting ialah memilih langkah yang bertanggung jawab dan mau belajar dari hasilnya.',NULL),
(16,2,'Kucing di bawah jembatan','Pada suatu sore, Dito berada di jalan kecil dekat sungai. Saat itu, ia menemukan bahwa seekor kucing terjebak saat hujan mulai turun. Keadaan tersebut membuatnya berpikir tentang langkah yang harus dipilih. Ia ingin segera menyelesaikannya karena Dito ingin menolong tetapi arus air semakin deras. Namun, Dito berhenti sejenak dan memperhatikan keadaan di sekelilingnya. Ia teringat pesan orang dewasa agar tidak bertindak terburu-buru. Di dekatnya ada beberapa orang yang mungkin dapat membantu. Meski merasa cemas, ia mencoba menenangkan diri dan menyusun rencana.

Mula-mula, Dito mencoba mencari tahu penyebab masalah. Kemudian, ia memanggil orang dewasa dan mengambil kardus kering. Proses itu tidak langsung berhasil; ada bagian yang perlu diulang dan ada pendapat yang harus didengarkan. Dito akhirnya memahami bahwa meminta bantuan bukan tanda kelemahan. Setelah semua bekerja sama, kucing berhasil dipindahkan ke tempat aman. Orang-orang di sekitarnya ikut merasa lega. Dito membuat tempat singgah bersama warga. Peristiwa tersebut membuat Dito menilai kembali sikapnya sebelum masalah muncul. Ia menyadari bahwa keputusan yang baik perlu mempertimbangkan akibat bagi orang lain.

Setelah kejadian itu, Dito menceritakannya kepada keluarga dan teman. Ia tidak menyombongkan diri karena semuanya berhasil berkat bantuan bersama. Sebaliknya, ia mengingat bagian yang sempat membuatnya ragu. Pengalaman itu mengubah cara pandangnya: kepedulian perlu disertai pertimbangan keselamatan. Sejak hari tersebut, ia berusaha lebih teliti saat menghadapi persoalan baru. Ia juga belajar bahwa rasa takut atau kecewa boleh muncul, tetapi keduanya tidak harus menentukan tindakan. Yang terpenting ialah memilih langkah yang bertanggung jawab dan mau belajar dari hasilnya.',NULL),
(17,2,'Benih untuk halaman','Pada suatu sore, Sita berada di rumah nenek di pinggir kota. Saat itu, ia menemukan bahwa benih bunga yang ditanam belum juga tumbuh. Keadaan tersebut membuatnya berpikir tentang langkah yang harus dipilih. Ia ingin segera menyelesaikannya karena Sita hampir membuang pot karena mengira benihnya gagal. Namun, Sita berhenti sejenak dan memperhatikan keadaan di sekelilingnya. Ia teringat pesan orang dewasa agar tidak bertindak terburu-buru. Di dekatnya ada beberapa orang yang mungkin dapat membantu. Meski merasa cemas, ia mencoba menenangkan diri dan menyusun rencana.

Mula-mula, Sita mencoba mencari tahu penyebab masalah. Kemudian, nenek menunjukkan catatan penyiraman dan posisi cahaya. Proses itu tidak langsung berhasil; ada bagian yang perlu diulang dan ada pendapat yang harus didengarkan. Sita akhirnya memahami bahwa meminta bantuan bukan tanda kelemahan. Setelah semua bekerja sama, tunas muncul beberapa hari kemudian. Orang-orang di sekitarnya ikut merasa lega. Sita menandai pot dan merawatnya dengan sabar. Peristiwa tersebut membuat Sita menilai kembali sikapnya sebelum masalah muncul. Ia menyadari bahwa keputusan yang baik perlu mempertimbangkan akibat bagi orang lain.

Setelah kejadian itu, Sita menceritakannya kepada keluarga dan teman. Ia tidak menyombongkan diri karena semuanya berhasil berkat bantuan bersama. Sebaliknya, ia mengingat bagian yang sempat membuatnya ragu. Pengalaman itu mengubah cara pandangnya: hasil baik kadang memerlukan waktu dan perhatian. Sejak hari tersebut, ia berusaha lebih teliti saat menghadapi persoalan baru. Ia juga belajar bahwa rasa takut atau kecewa boleh muncul, tetapi keduanya tidak harus menentukan tindakan. Yang terpenting ialah memilih langkah yang bertanggung jawab dan mau belajar dari hasilnya.',NULL),
(18,2,'Peta yang tertukar','Pada suatu sore, Rafi berada di museum kota. Saat itu, ia menemukan bahwa peta tugas kelompok tertukar dengan peta pengunjung. Keadaan tersebut membuatnya berpikir tentang langkah yang harus dipilih. Ia ingin segera menyelesaikannya karena Rafi merasa malu dan takut dimarahi teman. Namun, Rafi berhenti sejenak dan memperhatikan keadaan di sekelilingnya. Ia teringat pesan orang dewasa agar tidak bertindak terburu-buru. Di dekatnya ada beberapa orang yang mungkin dapat membantu. Meski merasa cemas, ia mencoba menenangkan diri dan menyusun rencana.

Mula-mula, Rafi mencoba mencari tahu penyebab masalah. Kemudian, ia mengikuti petunjuk nomor ruang dan bertanya kepada petugas. Proses itu tidak langsung berhasil; ada bagian yang perlu diulang dan ada pendapat yang harus didengarkan. Rafi akhirnya memahami bahwa meminta bantuan bukan tanda kelemahan. Setelah semua bekerja sama, kedua peta kembali kepada pemilik masing-masing. Orang-orang di sekitarnya ikut merasa lega. kelompok memperbaiki label sebelum melanjutkan tugas. Peristiwa tersebut membuat Rafi menilai kembali sikapnya sebelum masalah muncul. Ia menyadari bahwa keputusan yang baik perlu mempertimbangkan akibat bagi orang lain.

Setelah kejadian itu, Rafi menceritakannya kepada keluarga dan teman. Ia tidak menyombongkan diri karena semuanya berhasil berkat bantuan bersama. Sebaliknya, ia mengingat bagian yang sempat membuatnya ragu. Pengalaman itu mengubah cara pandangnya: kesalahan dapat diperbaiki dengan jujur dan tenang. Sejak hari tersebut, ia berusaha lebih teliti saat menghadapi persoalan baru. Ia juga belajar bahwa rasa takut atau kecewa boleh muncul, tetapi keduanya tidak harus menentukan tindakan. Yang terpenting ialah memilih langkah yang bertanggung jawab dan mau belajar dari hasilnya.',NULL),
(19,2,'Suara dari loteng','Pada suatu sore, Mira berada di rumah tua milik keluarga. Saat itu, ia menemukan bahwa bunyi berulang dari loteng membuat Mira penasaran. Keadaan tersebut membuatnya berpikir tentang langkah yang harus dipilih. Ia ingin segera menyelesaikannya karena ia membayangkan ada sesuatu yang menakutkan. Namun, Mira berhenti sejenak dan memperhatikan keadaan di sekelilingnya. Ia teringat pesan orang dewasa agar tidak bertindak terburu-buru. Di dekatnya ada beberapa orang yang mungkin dapat membantu. Meski merasa cemas, ia mencoba menenangkan diri dan menyusun rencana.

Mula-mula, Mira mencoba mencari tahu penyebab masalah. Kemudian, Mira mengajak kakaknya memeriksa dengan senter. Proses itu tidak langsung berhasil; ada bagian yang perlu diulang dan ada pendapat yang harus didengarkan. Mira akhirnya memahami bahwa meminta bantuan bukan tanda kelemahan. Setelah semua bekerja sama, bunyi ternyata berasal dari jendela yang tertiup angin. Orang-orang di sekitarnya ikut merasa lega. mereka memasang pengait lalu tertawa lega. Peristiwa tersebut membuat Mira menilai kembali sikapnya sebelum masalah muncul. Ia menyadari bahwa keputusan yang baik perlu mempertimbangkan akibat bagi orang lain.

Setelah kejadian itu, Mira menceritakannya kepada keluarga dan teman. Ia tidak menyombongkan diri karena semuanya berhasil berkat bantuan bersama. Sebaliknya, ia mengingat bagian yang sempat membuatnya ragu. Pengalaman itu mengubah cara pandangnya: rasa takut berkurang ketika fakta diperiksa. Sejak hari tersebut, ia berusaha lebih teliti saat menghadapi persoalan baru. Ia juga belajar bahwa rasa takut atau kecewa boleh muncul, tetapi keduanya tidak harus menentukan tindakan. Yang terpenting ialah memilih langkah yang bertanggung jawab dan mau belajar dari hasilnya.',NULL),
(20,2,'Sepatu untuk lomba','Pada suatu sore, Arman berada di halaman sekolah. Saat itu, ia menemukan bahwa sepatu Arman rusak menjelang lomba lari. Keadaan tersebut membuatnya berpikir tentang langkah yang harus dipilih. Ia ingin segera menyelesaikannya karena ia ingin meminjam sepatu baru milik temannya. Namun, Arman berhenti sejenak dan memperhatikan keadaan di sekelilingnya. Ia teringat pesan orang dewasa agar tidak bertindak terburu-buru. Di dekatnya ada beberapa orang yang mungkin dapat membantu. Meski merasa cemas, ia mencoba menenangkan diri dan menyusun rencana.

Mula-mula, Arman mencoba mencari tahu penyebab masalah. Kemudian, pelatih menyarankan memperbaiki sol dan berlatih dengan nyaman. Proses itu tidak langsung berhasil; ada bagian yang perlu diulang dan ada pendapat yang harus didengarkan. Arman akhirnya memahami bahwa meminta bantuan bukan tanda kelemahan. Setelah semua bekerja sama, sepatu lama dapat dipakai setelah diperbaiki. Orang-orang di sekitarnya ikut merasa lega. Arman menyelesaikan lomba tanpa mengejar juara. Peristiwa tersebut membuat Arman menilai kembali sikapnya sebelum masalah muncul. Ia menyadari bahwa keputusan yang baik perlu mempertimbangkan akibat bagi orang lain.

Setelah kejadian itu, Arman menceritakannya kepada keluarga dan teman. Ia tidak menyombongkan diri karena semuanya berhasil berkat bantuan bersama. Sebaliknya, ia mengingat bagian yang sempat membuatnya ragu. Pengalaman itu mengubah cara pandangnya: usaha dan sikap sportif lebih penting daripada perlengkapan mahal. Sejak hari tersebut, ia berusaha lebih teliti saat menghadapi persoalan baru. Ia juga belajar bahwa rasa takut atau kecewa boleh muncul, tetapi keduanya tidak harus menentukan tindakan. Yang terpenting ialah memilih langkah yang bertanggung jawab dan mau belajar dari hasilnya.',NULL),
(21,2,'Jaket berwarna kuning','Pada suatu sore, Tika berada di halte saat pulang sekolah. Saat itu, ia menemukan bahwa Tika menemukan jaket tertinggal di bangku. Keadaan tersebut membuatnya berpikir tentang langkah yang harus dipilih. Ia ingin segera menyelesaikannya karena ia takut pemiliknya sudah jauh pergi. Namun, Tika berhenti sejenak dan memperhatikan keadaan di sekelilingnya. Ia teringat pesan orang dewasa agar tidak bertindak terburu-buru. Di dekatnya ada beberapa orang yang mungkin dapat membantu. Meski merasa cemas, ia mencoba menenangkan diri dan menyusun rencana.

Mula-mula, Tika mencoba mencari tahu penyebab masalah. Kemudian, Tika menyerahkan jaket kepada petugas halte. Proses itu tidak langsung berhasil; ada bagian yang perlu diulang dan ada pendapat yang harus didengarkan. Tika akhirnya memahami bahwa meminta bantuan bukan tanda kelemahan. Setelah semua bekerja sama, pemilik datang kembali setelah mencari ke beberapa tempat. Orang-orang di sekitarnya ikut merasa lega. petugas mengembalikan jaket setelah cirinya cocok. Peristiwa tersebut membuat Tika menilai kembali sikapnya sebelum masalah muncul. Ia menyadari bahwa keputusan yang baik perlu mempertimbangkan akibat bagi orang lain.

Setelah kejadian itu, Tika menceritakannya kepada keluarga dan teman. Ia tidak menyombongkan diri karena semuanya berhasil berkat bantuan bersama. Sebaliknya, ia mengingat bagian yang sempat membuatnya ragu. Pengalaman itu mengubah cara pandangnya: kejujuran menjaga kepercayaan orang lain. Sejak hari tersebut, ia berusaha lebih teliti saat menghadapi persoalan baru. Ia juga belajar bahwa rasa takut atau kecewa boleh muncul, tetapi keduanya tidak harus menentukan tindakan. Yang terpenting ialah memilih langkah yang bertanggung jawab dan mau belajar dari hasilnya.',NULL),
(22,2,'Bintang di atap','Pada suatu sore, Yusuf berada di atap rumah pada malam cerah. Saat itu, ia menemukan bahwa Yusuf ingin mengamati bintang untuk tugas kelas. Keadaan tersebut membuatnya berpikir tentang langkah yang harus dipilih. Ia ingin segera menyelesaikannya karena awan menutupi langit dan membuatnya kecewa. Namun, Yusuf berhenti sejenak dan memperhatikan keadaan di sekelilingnya. Ia teringat pesan orang dewasa agar tidak bertindak terburu-buru. Di dekatnya ada beberapa orang yang mungkin dapat membantu. Meski merasa cemas, ia mencoba menenangkan diri dan menyusun rencana.

Mula-mula, Yusuf mencoba mencari tahu penyebab masalah. Kemudian, ayah mengajaknya mencatat bentuk awan sambil menunggu. Proses itu tidak langsung berhasil; ada bagian yang perlu diulang dan ada pendapat yang harus didengarkan. Yusuf akhirnya memahami bahwa meminta bantuan bukan tanda kelemahan. Setelah semua bekerja sama, langit terbuka menjelang malam larut. Orang-orang di sekitarnya ikut merasa lega. Yusuf mendapat catatan tambahan tentang perubahan cuaca. Peristiwa tersebut membuat Yusuf menilai kembali sikapnya sebelum masalah muncul. Ia menyadari bahwa keputusan yang baik perlu mempertimbangkan akibat bagi orang lain.

Setelah kejadian itu, Yusuf menceritakannya kepada keluarga dan teman. Ia tidak menyombongkan diri karena semuanya berhasil berkat bantuan bersama. Sebaliknya, ia mengingat bagian yang sempat membuatnya ragu. Pengalaman itu mengubah cara pandangnya: rencana dapat berubah tanpa membuat kegiatan kehilangan makna. Sejak hari tersebut, ia berusaha lebih teliti saat menghadapi persoalan baru. Ia juga belajar bahwa rasa takut atau kecewa boleh muncul, tetapi keduanya tidak harus menentukan tindakan. Yang terpenting ialah memilih langkah yang bertanggung jawab dan mau belajar dari hasilnya.',NULL),
(23,2,'Kartu ucapan untuk penjaga','Pada suatu sore, Ayu berada di gerbang sekolah. Saat itu, ia menemukan bahwa penjaga sekolah akan pindah tugas. Keadaan tersebut membuatnya berpikir tentang langkah yang harus dipilih. Ia ingin segera menyelesaikannya karena Ayu ingin mengucapkan terima kasih tetapi malu berbicara. Namun, Ayu berhenti sejenak dan memperhatikan keadaan di sekelilingnya. Ia teringat pesan orang dewasa agar tidak bertindak terburu-buru. Di dekatnya ada beberapa orang yang mungkin dapat membantu. Meski merasa cemas, ia mencoba menenangkan diri dan menyusun rencana.

Mula-mula, Ayu mencoba mencari tahu penyebab masalah. Kemudian, ia membuat kartu bersama teman-teman sekelas. Proses itu tidak langsung berhasil; ada bagian yang perlu diulang dan ada pendapat yang harus didengarkan. Ayu akhirnya memahami bahwa meminta bantuan bukan tanda kelemahan. Setelah semua bekerja sama, penjaga tersenyum membaca pesan mereka. Orang-orang di sekitarnya ikut merasa lega. Ayu akhirnya menyampaikan terima kasih secara langsung. Peristiwa tersebut membuat Ayu menilai kembali sikapnya sebelum masalah muncul. Ia menyadari bahwa keputusan yang baik perlu mempertimbangkan akibat bagi orang lain.

Setelah kejadian itu, Ayu menceritakannya kepada keluarga dan teman. Ia tidak menyombongkan diri karena semuanya berhasil berkat bantuan bersama. Sebaliknya, ia mengingat bagian yang sempat membuatnya ragu. Pengalaman itu mengubah cara pandangnya: perhatian sederhana dapat menguatkan hubungan. Sejak hari tersebut, ia berusaha lebih teliti saat menghadapi persoalan baru. Ia juga belajar bahwa rasa takut atau kecewa boleh muncul, tetapi keduanya tidak harus menentukan tindakan. Yang terpenting ialah memilih langkah yang bertanggung jawab dan mau belajar dari hasilnya.',NULL),
(24,2,'Bola di kebun tetangga','Pada suatu sore, Fajar berada di kebun sayur sebelah lapangan. Saat itu, ia menemukan bahwa bola Fajar jatuh di antara tanaman warga. Keadaan tersebut membuatnya berpikir tentang langkah yang harus dipilih. Ia ingin segera menyelesaikannya karena ia tergoda masuk diam-diam mengambilnya. Namun, Fajar berhenti sejenak dan memperhatikan keadaan di sekelilingnya. Ia teringat pesan orang dewasa agar tidak bertindak terburu-buru. Di dekatnya ada beberapa orang yang mungkin dapat membantu. Meski merasa cemas, ia mencoba menenangkan diri dan menyusun rencana.

Mula-mula, Fajar mencoba mencari tahu penyebab masalah. Kemudian, Fajar meminta izin dan menunggu pemilik kebun. Proses itu tidak langsung berhasil; ada bagian yang perlu diulang dan ada pendapat yang harus didengarkan. Fajar akhirnya memahami bahwa meminta bantuan bukan tanda kelemahan. Setelah semua bekerja sama, bola diambil tanpa merusak tanaman. Orang-orang di sekitarnya ikut merasa lega. pemilik kebun mengingatkan batas lapangan dengan ramah. Peristiwa tersebut membuat Fajar menilai kembali sikapnya sebelum masalah muncul. Ia menyadari bahwa keputusan yang baik perlu mempertimbangkan akibat bagi orang lain.

Setelah kejadian itu, Fajar menceritakannya kepada keluarga dan teman. Ia tidak menyombongkan diri karena semuanya berhasil berkat bantuan bersama. Sebaliknya, ia mengingat bagian yang sempat membuatnya ragu. Pengalaman itu mengubah cara pandangnya: mengakui kesalahan lebih baik daripada menambah masalah. Sejak hari tersebut, ia berusaha lebih teliti saat menghadapi persoalan baru. Ia juga belajar bahwa rasa takut atau kecewa boleh muncul, tetapi keduanya tidak harus menentukan tindakan. Yang terpenting ialah memilih langkah yang bertanggung jawab dan mau belajar dari hasilnya.',NULL);

-- -----------------------------------------------------------------------------
-- 3. PEMBENIHAN MASTER BANK SOAL SIMULASI BAHASA INDONESIA (QUESTION_BANKS - 60 Butir Soal)
-- ID: 61 - 120 (Offset +60 dari Matematika)
-- -----------------------------------------------------------------------------
INSERT INTO `question_banks` (`id`, `subject_id`, `sub_material_id`, `cognitive_level_id`, `stimulus_id`, `bank_type`, `question_format`, `question_text`, `question_image_url`, `is_active`) VALUES
(61, 2, 11, 1, 1, 'SIMULATION', 'COMPLEX_CHOICE', 'Informasi penting yang sesuai dengan bacaan tentang kebun sekolah hemat air adalah ... Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(62, 2, 11, 1, 2, 'SIMULATION', 'COMPLEX_CHOICE', 'Dalam bacaan “Perpustakaan keliling”, frasa “keadaan awal” paling tepat merujuk pada ... Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(63, 2, 11, 3, 2, 'SIMULATION', 'COMPLEX_CHOICE', 'Kerangka informasi yang paling sesuai untuk bacaan “Perpustakaan keliling” adalah ... Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(64, 2, 11, 1, 3, 'SIMULATION', 'COMPLEX_CHOICE', 'Informasi penting yang sesuai dengan bacaan tentang bank sampah kelas adalah ... Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(65, 2, 11, 1, 4, 'SIMULATION', 'COMPLEX_CHOICE', 'Dalam bacaan “Jalur aman ke sekolah”, frasa “keadaan awal” paling tepat merujuk pada ... Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(66, 2, 12, 2, 6, 'SIMULATION', 'COMPLEX_CHOICE', 'Kesimpulan tersirat yang paling tepat dari bacaan “Peta mata air desa” adalah ... Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(67, 2, 12, 3, 6, 'SIMULATION', 'SINGLE_CHOICE', 'Hubungan antara pencatatan dan keputusan dalam bacaan tersebut adalah ...', NULL, TRUE),
(68, 2, 12, 2, 8, 'SIMULATION', 'COMPLEX_CHOICE', 'Kesimpulan tersirat yang paling tepat dari bacaan “Kompos dari daun” adalah ... Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(69, 2, 13, 1, 9, 'SIMULATION', 'SINGLE_CHOICE', 'Tindakan sehari-hari yang paling relevan dengan pesan bacaan “Peringatan cuaca warga” adalah ...', NULL, TRUE),
(70, 2, 13, 3, 10, 'SIMULATION', 'COMPLEX_CHOICE', 'Pilih semua penilaian yang sesuai dengan cara penyajian informasi pada bacaan.', NULL, TRUE),
(71, 2, 13, 1, 11, 'SIMULATION', 'SINGLE_CHOICE', 'Tindakan sehari-hari yang paling relevan dengan pesan bacaan “Pojok isi ulang air” adalah ...', NULL, TRUE),
(72, 2, 13, 2, 11, 'SIMULATION', 'SINGLE_CHOICE', 'Setelah membaca “Pojok isi ulang air”, respons pembaca yang paling sesuai adalah ...', NULL, TRUE),
(73, 2, 14, 1, 14, 'SIMULATION', 'COMPLEX_CHOICE', 'Keterangan yang paling tepat untuk mengenali latar cerita “Layangan yang putus” adalah ... Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(74, 2, 14, 2, 14, 'SIMULATION', 'SINGLE_CHOICE', 'Informasi yang disebutkan secara langsung dalam cerita “Layangan yang putus” adalah ...', NULL, TRUE),
(75, 2, 14, 3, 14, 'SIMULATION', 'COMPLEX_CHOICE', 'Kerangka peristiwa yang paling sesuai untuk cerita “Layangan yang putus” adalah ... Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(76, 2, 14, 3, 15, 'SIMULATION', 'SINGLE_CHOICE', 'Kerangka peristiwa yang paling sesuai untuk cerita “Kursi kosong di pentas” adalah ...', NULL, TRUE),
(77, 2, 14, 1, 16, 'SIMULATION', 'COMPLEX_CHOICE', 'Keterangan yang paling tepat untuk mengenali latar cerita “Kucing di bawah jembatan” adalah ... Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(78, 2, 15, 1, 17, 'SIMULATION', 'SINGLE_CHOICE', 'Jika Sita memilih diam dan tidak melakukan apa pun, kemungkinan yang paling masuk akal adalah ...', NULL, TRUE),
(79, 2, 15, 2, 18, 'SIMULATION', 'COMPLEX_CHOICE', 'Kesimpulan yang dapat ditarik dari cerita “Peta yang tertukar” adalah ... Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(80, 2, 15, 3, 18, 'SIMULATION', 'SINGLE_CHOICE', 'Hubungan tindakan Rafi dengan penyelesaian konflik adalah ...', NULL, TRUE),
(81, 2, 15, 1, 18, 'SIMULATION', 'COMPLEX_CHOICE', 'Jika Rafi memilih diam dan tidak melakukan apa pun, kemungkinan yang paling masuk akal adalah ... Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(82, 2, 15, 3, 19, 'SIMULATION', 'COMPLEX_CHOICE', 'Hubungan tindakan Mira dengan penyelesaian konflik adalah ... Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(83, 2, 15, 1, 19, 'SIMULATION', 'SINGLE_CHOICE', 'Jika Mira memilih diam dan tidak melakukan apa pun, kemungkinan yang paling masuk akal adalah ...', NULL, TRUE),
(84, 2, 15, 2, 20, 'SIMULATION', 'COMPLEX_CHOICE', 'Kesimpulan yang dapat ditarik dari cerita “Sepatu untuk lomba” adalah ... Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(85, 2, 16, 1, 21, 'SIMULATION', 'SINGLE_CHOICE', 'Pengalaman tokoh paling relevan diterapkan ketika kita ...', NULL, TRUE),
(86, 2, 16, 2, 21, 'SIMULATION', 'SINGLE_CHOICE', 'Respons emosional yang paling wajar terhadap akhir cerita “Jaket berwarna kuning” adalah ...', NULL, TRUE),
(87, 2, 16, 3, 22, 'SIMULATION', 'COMPLEX_CHOICE', 'Pilih semua penilaian yang sesuai dengan hubungan peristiwa dan amanat cerita “Bintang di atap”.', NULL, TRUE),
(88, 2, 16, 1, 23, 'SIMULATION', 'SINGLE_CHOICE', 'Pengalaman tokoh paling relevan diterapkan ketika kita ...', NULL, TRUE),
(89, 2, 16, 3, 23, 'SIMULATION', 'COMPLEX_CHOICE', 'Pilih semua penilaian yang sesuai dengan hubungan peristiwa dan amanat cerita “Kartu ucapan untuk penjaga”. Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(90, 2, 16, 2, 23, 'SIMULATION', 'SINGLE_CHOICE', 'Respons emosional yang paling wajar terhadap akhir cerita “Kartu ucapan untuk penjaga” adalah ...', NULL, TRUE),
(91, 2, 11, 1, 1, 'SIMULATION', 'SINGLE_CHOICE', 'Dalam bacaan “Kebun sekolah hemat air”, frasa “keadaan awal” paling tepat merujuk pada ...', NULL, TRUE),
(92, 2, 11, 3, 1, 'SIMULATION', 'SINGLE_CHOICE', 'Kerangka informasi yang paling sesuai untuk bacaan “Kebun sekolah hemat air” adalah ...', NULL, TRUE),
(93, 2, 11, 1, 2, 'SIMULATION', 'SINGLE_CHOICE', 'Informasi penting yang sesuai dengan bacaan tentang perpustakaan keliling adalah ...', NULL, TRUE),
(94, 2, 11, 1, 3, 'SIMULATION', 'SINGLE_CHOICE', 'Dalam bacaan “Bank sampah kelas”, frasa “keadaan awal” paling tepat merujuk pada ...', NULL, TRUE),
(95, 2, 11, 3, 3, 'SIMULATION', 'SINGLE_CHOICE', 'Kerangka informasi yang paling sesuai untuk bacaan “Bank sampah kelas” adalah ...', NULL, TRUE),
(96, 2, 12, 2, 5, 'SIMULATION', 'SINGLE_CHOICE', 'Kesimpulan tersirat yang paling tepat dari bacaan “Kantin tanpa sisa” adalah ...', NULL, TRUE),
(97, 2, 12, 3, 5, 'SIMULATION', 'COMPLEX_CHOICE', 'Hubungan antara pencatatan dan keputusan dalam bacaan tersebut adalah ... Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(98, 2, 12, 1, 5, 'SIMULATION', 'SINGLE_CHOICE', 'Jika program kantin tanpa sisa diteruskan tanpa evaluasi, kemungkinan yang paling masuk akal adalah ...', NULL, TRUE),
(99, 2, 12, 1, 6, 'SIMULATION', 'COMPLEX_CHOICE', 'Jika program peta mata air desa diteruskan tanpa evaluasi, kemungkinan yang paling masuk akal adalah ... Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(100, 2, 12, 2, 7, 'SIMULATION', 'SINGLE_CHOICE', 'Kesimpulan tersirat yang paling tepat dari bacaan “Ruang baca di halte” adalah ...', NULL, TRUE),
(101, 2, 12, 3, 7, 'SIMULATION', 'COMPLEX_CHOICE', 'Hubungan antara pencatatan dan keputusan dalam bacaan tersebut adalah ... Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(102, 2, 12, 1, 7, 'SIMULATION', 'SINGLE_CHOICE', 'Jika program ruang baca di halte diteruskan tanpa evaluasi, kemungkinan yang paling masuk akal adalah ...', NULL, TRUE),
(103, 2, 13, 3, 9, 'SIMULATION', 'COMPLEX_CHOICE', 'Pilih semua penilaian yang sesuai dengan cara penyajian informasi pada bacaan. Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(104, 2, 13, 2, 9, 'SIMULATION', 'SINGLE_CHOICE', 'Setelah membaca “Peringatan cuaca warga”, respons pembaca yang paling sesuai adalah ...', NULL, TRUE),
(105, 2, 13, 1, 10, 'SIMULATION', 'COMPLEX_CHOICE', 'Tindakan sehari-hari yang paling relevan dengan pesan bacaan “Pasar hasil kebun” adalah ... Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(106, 2, 13, 2, 10, 'SIMULATION', 'COMPLEX_CHOICE', 'Setelah membaca “Pasar hasil kebun”, respons pembaca yang paling sesuai adalah ... Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(107, 2, 13, 3, 11, 'SIMULATION', 'COMPLEX_CHOICE', 'Pilih semua penilaian yang sesuai dengan cara penyajian informasi pada bacaan. Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(108, 2, 13, 1, 12, 'SIMULATION', 'COMPLEX_CHOICE', 'Tindakan sehari-hari yang paling relevan dengan pesan bacaan “Lampu tenaga surya” adalah ... Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(109, 2, 14, 1, 13, 'SIMULATION', 'SINGLE_CHOICE', 'Keterangan yang paling tepat untuk mengenali latar cerita “Surat di dalam buku” adalah ...', NULL, TRUE),
(110, 2, 14, 2, 13, 'SIMULATION', 'COMPLEX_CHOICE', 'Informasi yang disebutkan secara langsung dalam cerita “Surat di dalam buku” adalah ... Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(111, 2, 14, 3, 13, 'SIMULATION', 'SINGLE_CHOICE', 'Kerangka peristiwa yang paling sesuai untuk cerita “Surat di dalam buku” adalah ...', NULL, TRUE),
(112, 2, 14, 1, 15, 'SIMULATION', 'SINGLE_CHOICE', 'Keterangan yang paling tepat untuk mengenali latar cerita “Kursi kosong di pentas” adalah ...', NULL, TRUE),
(113, 2, 14, 2, 15, 'SIMULATION', 'COMPLEX_CHOICE', 'Informasi yang disebutkan secara langsung dalam cerita “Kursi kosong di pentas” adalah ... Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(114, 2, 15, 2, 17, 'SIMULATION', 'SINGLE_CHOICE', 'Kesimpulan yang dapat ditarik dari cerita “Benih untuk halaman” adalah ...', NULL, TRUE),
(115, 2, 15, 3, 17, 'SIMULATION', 'COMPLEX_CHOICE', 'Hubungan tindakan Sita dengan penyelesaian konflik adalah ... Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(116, 2, 15, 2, 19, 'SIMULATION', 'SINGLE_CHOICE', 'Kesimpulan yang dapat ditarik dari cerita “Suara dari loteng” adalah ...', NULL, TRUE),
(117, 2, 16, 3, 21, 'SIMULATION', 'COMPLEX_CHOICE', 'Pilih semua penilaian yang sesuai dengan hubungan peristiwa dan amanat cerita “Jaket berwarna kuning”. Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(118, 2, 16, 1, 22, 'SIMULATION', 'COMPLEX_CHOICE', 'Pengalaman tokoh paling relevan diterapkan ketika kita ... Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(119, 2, 16, 2, 22, 'SIMULATION', 'COMPLEX_CHOICE', 'Respons emosional yang paling wajar terhadap akhir cerita “Bintang di atap” adalah ... Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE),
(120, 2, 16, 1, 24, 'SIMULATION', 'COMPLEX_CHOICE', 'Pengalaman tokoh paling relevan diterapkan ketika kita ... Pilih semua jawaban yang benar. Jawaban benar berjumlah satu sampai tiga pilihan.', NULL, TRUE);

-- -----------------------------------------------------------------------------
-- 4. PEMBENIHAN OPSI JAWABAN (QUESTION_OPTIONS - 240 Opsi Jawaban)
-- ID: 241 - 480 (Offset +240 dari Matematika), Relasi question_id: 61 - 120
-- -----------------------------------------------------------------------------
INSERT INTO `question_options` (`id`, `question_id`, `option_label`, `option_text`, `is_correct`) VALUES
(241, 61, 'A', 'peserta tidak membagi tugas', FALSE),
(242, 61, 'B', 'hasil kegiatan hanya ditentukan oleh satu orang', FALSE),
(243, 61, 'C', 'tanah tetap lembap dan tanaman tumbuh baik', TRUE),
(244, 61, 'D', 'program dihentikan sebelum dicoba', FALSE),
(245, 62, 'A', 'kondisi sebelum program dijalankan', TRUE),
(246, 62, 'B', 'hasil akhir setelah semua kegiatan selesai', FALSE),
(247, 62, 'C', 'pendapat yang belum diperiksa', FALSE),
(248, 62, 'D', 'jadwal kegiatan pada masa mendatang', FALSE),
(249, 63, 'A', 'daftar pendapat – percakapan – lelucon', FALSE),
(250, 63, 'B', 'masalah pribadi – perjalanan – kejutan', FALSE),
(251, 63, 'C', 'tujuan program – langkah kegiatan – hasil dan tindak lanjut', TRUE),
(252, 63, 'D', 'hasil akhir – tokoh – konflik – penyelesaian', FALSE),
(253, 64, 'A', 'hasil penjualan dipakai membeli bibit tanaman', TRUE),
(254, 64, 'B', 'program dihentikan sebelum dicoba', FALSE),
(255, 64, 'C', 'peserta tidak membagi tugas', FALSE),
(256, 64, 'D', 'hasil kegiatan hanya ditentukan oleh satu orang', FALSE),
(257, 65, 'A', 'pendapat yang belum diperiksa', FALSE),
(258, 65, 'B', 'jadwal kegiatan pada masa mendatang', FALSE),
(259, 65, 'C', 'kondisi sebelum program dijalankan', TRUE),
(260, 65, 'D', 'hasil akhir setelah semua kegiatan selesai', FALSE),
(261, 66, 'A', 'perubahan harus selesai dalam satu hari', FALSE),
(262, 66, 'B', 'catatan tidak berguna dalam mengambil keputusan', FALSE),
(263, 66, 'C', 'program akan lebih bertahan jika dilakukan konsisten dan dikerjakan bersama', TRUE),
(264, 66, 'D', 'alat yang mahal selalu menjadi syarat utama keberhasilan', FALSE),
(265, 67, 'A', 'catatan hanya berfungsi sebagai pengumuman', FALSE),
(266, 67, 'B', 'catatan membantu keputusan didasarkan pada keadaan nyata', TRUE),
(267, 67, 'C', 'catatan membuat peserta tidak perlu mengamati', FALSE),
(268, 67, 'D', 'keputusan harus dibuat sebelum kegiatan dimulai', FALSE),
(269, 68, 'A', 'program akan lebih bertahan jika dilakukan konsisten dan dikerjakan bersama', TRUE),
(270, 68, 'B', 'alat yang mahal selalu menjadi syarat utama keberhasilan', FALSE),
(271, 68, 'C', 'perubahan harus selesai dalam satu hari', FALSE),
(272, 68, 'D', 'catatan tidak berguna dalam mengambil keputusan', FALSE),
(273, 69, 'A', 'menunggu orang lain menyelesaikan semua pekerjaan', FALSE),
(274, 69, 'B', 'mengabaikan data karena sudah memiliki dugaan', FALSE),
(275, 69, 'C', 'mengubah aturan tanpa berdiskusi', FALSE),
(276, 69, 'D', 'membagi tugas dan mengecek hasil kegiatan bersama', TRUE),
(277, 70, 'A', 'Ada alasan mengapa program dilakukan.', TRUE),
(278, 70, 'B', 'Teks hanya berisi pendapat tanpa contoh kegiatan.', FALSE),
(279, 70, 'C', 'Tindak lanjut program tidak disebutkan.', FALSE),
(280, 70, 'D', 'Langkah dan hasil dijelaskan secara berurutan.', TRUE),
(281, 71, 'A', 'mengubah aturan tanpa berdiskusi', FALSE),
(282, 71, 'B', 'membagi tugas dan mengecek hasil kegiatan bersama', TRUE),
(283, 71, 'C', 'menunggu orang lain menyelesaikan semua pekerjaan', FALSE),
(284, 71, 'D', 'mengabaikan data karena sudah memiliki dugaan', FALSE),
(285, 72, 'A', 'menganggap semua masalah dapat selesai tanpa tindakan', FALSE),
(286, 72, 'B', 'menolak memeriksa hasil kegiatan', FALSE),
(287, 72, 'C', 'menyimpulkan bahwa hanya alat mahal yang berguna', FALSE),
(288, 72, 'D', 'terdorong menerapkan kebiasaan bersama yang dijelaskan dalam bacaan', TRUE),
(289, 73, 'A', 'ruang kelas saat ujian', FALSE),
(290, 73, 'B', 'pantai di luar negeri', FALSE),
(291, 73, 'C', 'lapangan dekat rumah', TRUE),
(292, 73, 'D', 'pasar pada tengah malam', FALSE),
(293, 74, 'A', 'peristiwa terjadi tanpa melibatkan tokoh lain', FALSE),
(294, 74, 'B', 'Bima menghadapi keadaan bahwa layangan buatan adiknya tersangkut di', TRUE),
(295, 74, 'C', 'semua masalah selesai sebelum ia bertindak', FALSE),
(296, 74, 'D', 'tokoh tidak berbicara dengan siapa pun', FALSE),
(297, 75, 'A', 'masalah muncul – tokoh mencari jalan keluar – masalah selesai – tokoh', TRUE),
(298, 75, 'B', 'tokoh berangkat – menemukan harta – pindah rumah', FALSE),
(299, 75, 'C', 'percakapan lucu – perlombaan – pengumuman', FALSE),
(300, 75, 'D', 'akhir cerita – pengenalan tokoh – awal masalah', FALSE),
(301, 76, 'A', 'akhir cerita – pengenalan tokoh – awal masalah', FALSE),
(302, 76, 'B', 'masalah muncul – tokoh mencari jalan keluar – masalah selesai – tokoh', TRUE),
(303, 76, 'C', 'tokoh berangkat – menemukan harta – pindah rumah', FALSE),
(304, 76, 'D', 'percakapan lucu – perlombaan – pengumuman', FALSE),
(305, 77, 'A', 'jalan kecil dekat sungai', TRUE),
(306, 77, 'B', 'pasar pada tengah malam', FALSE),
(307, 77, 'C', 'ruang kelas saat ujian', FALSE),
(308, 77, 'D', 'pantai di luar negeri', FALSE),
(309, 78, 'A', 'peristiwa awal tidak pernah terjadi', FALSE),
(310, 78, 'B', 'masalah dapat berlanjut atau bantuan datang terlambat', TRUE),
(311, 78, 'C', 'penyelesaian pasti terjadi lebih cepat', FALSE),
(312, 78, 'D', 'semua tokoh langsung mengetahui jawabannya', FALSE),
(313, 79, 'A', 'kesalahan dapat diperbaiki dengan jujur dan tenang', TRUE),
(314, 79, 'B', 'masalah selalu selesai tanpa usaha', FALSE),
(315, 79, 'C', 'meminta bantuan berarti gagal', FALSE),
(316, 79, 'D', 'perasaan tokoh tidak berubah sepanjang cerita', FALSE),
(317, 80, 'A', 'tindakannya membuat konflik tidak berhubungan dengan akhir cerita', FALSE),
(318, 80, 'B', 'penyelesaian terjadi sebelum masalah muncul', FALSE),
(319, 80, 'C', 'tokoh lain tidak memberi pengaruh apa pun', FALSE),
(320, 80, 'D', 'tindakannya membantu mengatasi masalah dengan mempertimbangkan', TRUE),
(321, 81, 'A', 'semua tokoh langsung mengetahui jawabannya', FALSE),
(322, 81, 'B', 'peristiwa awal tidak pernah terjadi', FALSE),
(323, 81, 'C', 'masalah dapat berlanjut atau bantuan datang terlambat', TRUE),
(324, 81, 'D', 'penyelesaian pasti terjadi lebih cepat', FALSE),
(325, 82, 'A', 'tindakannya membantu mengatasi masalah dengan mempertimbangkan', TRUE),
(326, 82, 'B', 'tindakannya membuat konflik tidak berhubungan dengan akhir cerita', FALSE),
(327, 82, 'C', 'penyelesaian terjadi sebelum masalah muncul', FALSE),
(328, 82, 'D', 'tokoh lain tidak memberi pengaruh apa pun', FALSE),
(329, 83, 'A', 'penyelesaian pasti terjadi lebih cepat', FALSE),
(330, 83, 'B', 'semua tokoh langsung mengetahui jawabannya', FALSE),
(331, 83, 'C', 'peristiwa awal tidak pernah terjadi', FALSE),
(332, 83, 'D', 'masalah dapat berlanjut atau bantuan datang terlambat', TRUE),
(333, 84, 'A', 'meminta bantuan berarti gagal', FALSE),
(334, 84, 'B', 'perasaan tokoh tidak berubah sepanjang cerita', FALSE),
(335, 84, 'C', 'usaha dan sikap sportif lebih penting daripada perlengkapan mahal', TRUE),
(336, 84, 'D', 'masalah selalu selesai tanpa usaha', FALSE),
(337, 85, 'A', 'bertindak cepat tanpa melihat keadaan', FALSE),
(338, 85, 'B', 'memikirkan akibat tindakan dan meminta bantuan saat diperlukan', TRUE),
(339, 85, 'C', 'menyembunyikan kesalahan agar tidak diketahui', FALSE),
(340, 85, 'D', 'menyalahkan orang lain sebelum mencari fakta', FALSE),
(341, 86, 'A', 'marah karena tokoh selalu memilih tindakan gegabah', FALSE),
(342, 86, 'B', 'bosan karena konflik tidak pernah diselesaikan', FALSE),
(343, 86, 'C', 'takut karena cerita berakhir tanpa penjelasan', FALSE),
(344, 86, 'D', 'merasa lega dan ikut menghargai usaha tokoh', TRUE),
(345, 87, 'A', 'Akhir cerita tidak menunjukkan perubahan atau pemahaman tokoh.', FALSE),
(346, 87, 'B', 'Tindakan tokoh membantu mengarah pada penyelesaian konflik.', TRUE),
(347, 87, 'C', 'Pelajaran cerita didukung oleh pengalaman tokoh.', TRUE),
(348, 87, 'D', 'Latar cerita tidak berkaitan dengan peristiwa apa pun.', FALSE),
(349, 88, 'A', 'menyembunyikan kesalahan agar tidak diketahui', FALSE),
(350, 88, 'B', 'menyalahkan orang lain sebelum mencari fakta', FALSE),
(351, 88, 'C', 'bertindak cepat tanpa melihat keadaan', FALSE),
(352, 88, 'D', 'memikirkan akibat tindakan dan meminta bantuan saat diperlukan', TRUE),
(353, 89, 'A', 'Latar cerita tidak berkaitan dengan peristiwa apa pun.', FALSE),
(354, 89, 'B', 'Akhir cerita tidak menunjukkan perubahan sikap tokoh.', FALSE),
(355, 89, 'C', 'Tindakan tokoh membantu mengarah pada penyelesaian konflik.', TRUE),
(356, 89, 'D', 'Pelajaran cerita didukung oleh pengalaman tokoh.', TRUE),
(357, 90, 'A', 'takut karena cerita berakhir tanpa penjelasan', FALSE),
(358, 90, 'B', 'merasa lega dan ikut menghargai usaha tokoh', TRUE),
(359, 90, 'C', 'marah karena tokoh selalu memilih tindakan gegabah', FALSE),
(360, 90, 'D', 'bosan karena konflik tidak pernah diselesaikan', FALSE),
(361, 91, 'A', 'hasil akhir setelah semua kegiatan selesai', FALSE),
(362, 91, 'B', 'pendapat yang belum diperiksa', FALSE),
(363, 91, 'C', 'jadwal kegiatan pada masa mendatang', FALSE),
(364, 91, 'D', 'kondisi sebelum program dijalankan', TRUE),
(365, 92, 'A', 'masalah pribadi – perjalanan – kejutan', FALSE),
(366, 92, 'B', 'tujuan program – langkah kegiatan – hasil dan tindak lanjut', TRUE),
(367, 92, 'C', 'hasil akhir – tokoh – konflik – penyelesaian', FALSE),
(368, 92, 'D', 'daftar pendapat – percakapan – lelucon', FALSE),
(369, 93, 'A', 'program dihentikan sebelum dicoba', FALSE),
(370, 93, 'B', 'peserta tidak membagi tugas', FALSE),
(371, 93, 'C', 'hasil kegiatan hanya ditentukan oleh satu orang', FALSE),
(372, 93, 'D', 'jumlah peminjam bertambah setelah jadwal diumumkan', TRUE),
(373, 94, 'A', 'jadwal kegiatan pada masa mendatang', FALSE),
(374, 94, 'B', 'kondisi sebelum program dijalankan', TRUE),
(375, 94, 'C', 'hasil akhir setelah semua kegiatan selesai', FALSE),
(376, 94, 'D', 'pendapat yang belum diperiksa', FALSE),
(377, 95, 'A', 'hasil akhir – tokoh – konflik – penyelesaian', FALSE),
(378, 95, 'B', 'daftar pendapat – percakapan – lelucon', FALSE),
(379, 95, 'C', 'masalah pribadi – perjalanan – kejutan', FALSE),
(380, 95, 'D', 'tujuan program – langkah kegiatan – hasil dan tindak lanjut', TRUE),
(381, 96, 'A', 'catatan tidak berguna dalam mengambil keputusan', FALSE),
(382, 96, 'B', 'program akan lebih bertahan jika dilakukan konsisten dan dikerjakan bersama', TRUE),
(383, 96, 'C', 'alat yang mahal selalu menjadi syarat utama keberhasilan', FALSE),
(384, 96, 'D', 'perubahan harus selesai dalam satu hari', FALSE),
(385, 97, 'A', 'catatan membantu keputusan didasarkan pada keadaan nyata', TRUE),
(386, 97, 'B', 'catatan membuat peserta tidak perlu mengamati', FALSE),
(387, 97, 'C', 'keputusan harus dibuat sebelum kegiatan dimulai', FALSE),
(388, 97, 'D', 'catatan hanya berfungsi sebagai pengumuman', FALSE),
(389, 98, 'A', 'semua masalah pasti hilang dengan sendirinya', FALSE),
(390, 98, 'B', 'catatan program otomatis menjadi lebih lengkap', FALSE),
(391, 98, 'C', 'peserta tidak lagi membutuhkan pembagian tugas', FALSE),
(392, 98, 'D', 'kendala yang sama dapat terulang karena langkah tidak diperbaiki', TRUE),
(393, 99, 'A', 'kendala yang sama dapat terulang karena langkah tidak diperbaiki', TRUE),
(394, 99, 'B', 'semua masalah pasti hilang dengan sendirinya', FALSE),
(395, 99, 'C', 'catatan program otomatis menjadi lebih lengkap', FALSE),
(396, 99, 'D', 'peserta tidak lagi membutuhkan pembagian tugas', FALSE),
(397, 100, 'A', 'alat yang mahal selalu menjadi syarat utama keberhasilan', FALSE),
(398, 100, 'B', 'perubahan harus selesai dalam satu hari', FALSE),
(399, 100, 'C', 'catatan tidak berguna dalam mengambil keputusan', FALSE),
(400, 100, 'D', 'program akan lebih bertahan jika dilakukan konsisten dan dikerjakan bersama', TRUE),
(401, 101, 'A', 'keputusan harus dibuat sebelum kegiatan dimulai', FALSE),
(402, 101, 'B', 'catatan hanya berfungsi sebagai pengumuman', FALSE),
(403, 101, 'C', 'catatan membantu keputusan didasarkan pada keadaan nyata', TRUE),
(404, 101, 'D', 'catatan membuat peserta tidak perlu mengamati', FALSE),
(405, 102, 'A', 'peserta tidak lagi membutuhkan pembagian tugas', FALSE),
(406, 102, 'B', 'kendala yang sama dapat terulang karena langkah tidak diperbaiki', TRUE),
(407, 102, 'C', 'semua masalah pasti hilang dengan sendirinya', FALSE),
(408, 102, 'D', 'catatan program otomatis menjadi lebih lengkap', FALSE),
(409, 103, 'A', 'Teks hanya berisi pendapat tanpa contoh kegiatan.', FALSE),
(410, 103, 'B', 'Tindak lanjut program tidak disebutkan dalam bacaan.', FALSE),
(411, 103, 'C', 'Langkah dan hasil dijelaskan secara berurutan.', TRUE),
(412, 103, 'D', 'Ada alasan mengapa program dilakukan.', TRUE),
(413, 104, 'A', 'menyimpulkan bahwa hanya alat mahal yang berguna', FALSE),
(414, 104, 'B', 'terdorong menerapkan kebiasaan bersama yang dijelaskan dalam bacaan', TRUE),
(415, 104, 'C', 'menganggap semua masalah dapat selesai tanpa tindakan', FALSE),
(416, 104, 'D', 'menolak memeriksa hasil kegiatan', FALSE),
(417, 105, 'A', 'membagi tugas dan mengecek hasil kegiatan bersama', TRUE),
(418, 105, 'B', 'menunggu orang lain menyelesaikan semua pekerjaan', FALSE),
(419, 105, 'C', 'mengabaikan data karena sudah memiliki dugaan', FALSE),
(420, 105, 'D', 'mengubah aturan tanpa berdiskusi', FALSE),
(421, 106, 'A', 'menolak memeriksa hasil kegiatan', FALSE),
(422, 106, 'B', 'menyimpulkan bahwa hanya alat mahal yang berguna', FALSE),
(423, 106, 'C', 'terdorong menerapkan kebiasaan bersama yang dijelaskan dalam bacaan', TRUE),
(424, 106, 'D', 'menganggap semua masalah dapat selesai tanpa tindakan', FALSE),
(425, 107, 'A', 'Langkah dan hasil dijelaskan secara berurutan.', TRUE),
(426, 107, 'B', 'Ada alasan mengapa program dilakukan.', TRUE),
(427, 107, 'C', 'Teks hanya berisi pendapat tanpa contoh kegiatan.', FALSE),
(428, 107, 'D', 'Tindak lanjut program tidak disebutkan dalam bacaan.', FALSE),
(429, 108, 'A', 'mengabaikan data karena sudah memiliki dugaan', FALSE),
(430, 108, 'B', 'mengubah aturan tanpa berdiskusi', FALSE),
(431, 108, 'C', 'membagi tugas dan mengecek hasil kegiatan bersama', TRUE),
(432, 108, 'D', 'menunggu orang lain menyelesaikan semua pekerjaan', FALSE),
(433, 109, 'A', 'pantai di luar negeri', FALSE),
(434, 109, 'B', 'perpustakaan sekolah', TRUE),
(435, 109, 'C', 'pasar pada tengah malam', FALSE),
(436, 109, 'D', 'ruang kelas saat ujian', FALSE),
(437, 110, 'A', 'Nara menghadapi keadaan bahwa sebuah surat lama terselip di buku pinjaman', TRUE),
(438, 110, 'B', 'semua masalah selesai sebelum ia bertindak', FALSE),
(439, 110, 'C', 'tokoh tidak berbicara dengan siapa pun', FALSE),
(440, 110, 'D', 'peristiwa terjadi tanpa melibatkan tokoh lain', FALSE),
(441, 111, 'A', 'tokoh berangkat – menemukan harta – pindah rumah', FALSE),
(442, 111, 'B', 'percakapan lucu – perlombaan – pengumuman', FALSE),
(443, 111, 'C', 'akhir cerita – pengenalan tokoh – awal masalah', FALSE),
(444, 111, 'D', 'masalah muncul – tokoh mencari jalan keluar – masalah selesai – tokoh', TRUE),
(445, 112, 'A', 'pasar pada tengah malam', FALSE),
(446, 112, 'B', 'ruang kelas saat ujian', FALSE),
(447, 112, 'C', 'pantai di luar negeri', FALSE),
(448, 112, 'D', 'aula sekolah', TRUE),
(449, 113, 'A', 'tokoh tidak berbicara dengan siapa pun', FALSE),
(450, 113, 'B', 'peristiwa terjadi tanpa melibatkan tokoh lain', FALSE),
(451, 113, 'C', 'Laras menghadapi keadaan bahwa pemain utama pementasan tiba-tiba sakit', TRUE),
(452, 113, 'D', 'semua masalah selesai sebelum ia bertindak', FALSE),
(453, 114, 'A', 'masalah selalu selesai tanpa usaha', FALSE),
(454, 114, 'B', 'meminta bantuan berarti gagal', FALSE),
(455, 114, 'C', 'perasaan tokoh tidak berubah sepanjang cerita', FALSE),
(456, 114, 'D', 'hasil baik kadang memerlukan waktu dan perhatian', TRUE),
(457, 115, 'A', 'penyelesaian terjadi sebelum masalah muncul', FALSE),
(458, 115, 'B', 'tokoh lain tidak memberi pengaruh apa pun', FALSE),
(459, 115, 'C', 'tindakannya membantu mengatasi masalah dengan mempertimbangkan', TRUE),
(460, 115, 'D', 'tindakannya membuat konflik tidak berhubungan dengan akhir cerita', FALSE),
(461, 116, 'A', 'perasaan tokoh tidak berubah sepanjang cerita', FALSE),
(462, 116, 'B', 'rasa takut berkurang ketika fakta diperiksa', TRUE),
(463, 116, 'C', 'masalah selalu selesai tanpa usaha', FALSE),
(464, 116, 'D', 'meminta bantuan berarti gagal', FALSE),
(465, 117, 'A', 'Tindakan tokoh membantu mengarah pada penyelesaian konflik.', TRUE),
(466, 117, 'B', 'Pelajaran cerita didukung oleh pengalaman tokoh.', TRUE),
(467, 117, 'C', 'Latar cerita tidak berkaitan dengan peristiwa apa pun.', FALSE),
(468, 117, 'D', 'Akhir cerita tidak menunjukkan perubahan pemahaman tokoh.', FALSE),
(469, 118, 'A', 'menyalahkan orang lain sebelum mencari fakta', FALSE),
(470, 118, 'B', 'bertindak cepat tanpa melihat keadaan', FALSE),
(471, 118, 'C', 'memikirkan akibat tindakan dan meminta bantuan saat diperlukan', TRUE),
(472, 118, 'D', 'menyembunyikan kesalahan agar tidak diketahui', FALSE),
(473, 119, 'A', 'merasa lega dan ikut menghargai usaha tokoh', TRUE),
(474, 119, 'B', 'marah karena tokoh selalu memilih tindakan gegabah', FALSE),
(475, 119, 'C', 'bosan karena konflik tidak pernah diselesaikan', FALSE),
(476, 119, 'D', 'takut karena cerita berakhir tanpa penjelasan', FALSE),
(477, 120, 'A', 'memikirkan akibat tindakan dan meminta bantuan saat diperlukan', TRUE),
(478, 120, 'B', 'menyembunyikan kesalahan agar tidak diketahui', FALSE),
(479, 120, 'C', 'menyalahkan orang lain sebelum mencari fakta', FALSE),
(480, 120, 'D', 'bertindak cepat tanpa melihat keadaan', FALSE);

-- -----------------------------------------------------------------------------
-- 5. PEMBENIHAN PEMBAHASAN SOAL (QUESTION_EXPLANATIONS - 60 Pembahasan)
-- ID: 61 - 120 (Offset +60 dari Matematika), Relasi question_id: 61 - 120
-- -----------------------------------------------------------------------------
INSERT INTO `question_explanations` (`id`, `question_id`, `explanation_text`, `reasoning_guide`, `reference_url`) VALUES
(61, 61, 'Bacaan menyatakan bahwa tanah tetap lembap dan tanaman tumbuh baik. Pilihan lain berlawanan dengan isi teks yang menjelaskan pembagian tugas dan pemantauan bersama.', NULL, NULL),
(62, 62, 'Bacaan menjelaskan bahwa peserta mencatat keadaan sebelum memilih langkah. Jadi, “keadaan awal” berarti kondisi sebelum program berjalan, bukan hasil akhir', NULL, NULL),
(63, 63, 'Teks informasi ini bergerak dari tujuan, berlanjut ke langkah yang dilakukan, lalu menjelaskan hasil dan tindak lanjut. Urutan itu merangkum susunan gagasan bacaan dengan tepat.', NULL, NULL),
(64, 64, 'Bacaan menyatakan bahwa hasil penjualan dipakai membeli bibit tanaman. Pilihan lain berlawanan dengan isi teks yang menjelaskan pembagian tugas dan pemantauan bersama.', NULL, NULL),
(65, 65, 'Bacaan menjelaskan bahwa peserta mencatat keadaan sebelum memilih langkah. Jadi, “keadaan awal” berarti kondisi sebelum program berjalan, bukan hasil akhir atau dugaan. Pemahaman Inferensial', NULL, NULL),
(66, 66, 'Bacaan menekankan kebiasaan konsisten, kerja sama, dan penggunaan catatan. Dari petunjuk itu dapat disimpulkan bahwa keberhasilan tidak hanya bergantung pada alat.', NULL, NULL),
(67, 67, 'Pengurus membandingkan keadaan awal dengan perubahan yang terjadi. Informasi itulah yang membantu mereka memperbaiki langkah secara masuk akal.', NULL, NULL),
(68, 68, 'Bacaan menekankan kebiasaan konsisten, kerja sama, dan penggunaan catatan. Dari petunjuk itu dapat disimpulkan bahwa keberhasilan tidak hanya bergantung pada alat. Evaluasi dan Apresiasi', NULL, NULL),
(69, 69, 'Bacaan menunjukkan bahwa pembagian tugas, pencatatan, dan kerja sama membantu program berjalan. Kebiasaan itu dapat diterapkan dalam kegiatan kelas atau rumah.', NULL, NULL),
(70, 70, 'Bacaan memaparkan tujuan, langkah, hasil pengamatan, dan tindak lanjut. Pilihan A dan D sesuai dengan isi bacaan. Pilihan B keliru karena teks memuat contoh kegiatan konkret, sedangkan pilihan C keliru karena teks secara jelas menyebutkan tindak lanjut program.', NULL, NULL),
(71, 71, 'Bacaan menunjukkan bahwa pembagian tugas, pencatatan, dan kerja sama membantu program berjalan. Kebiasaan itu dapat diterapkan dalam kegiatan kelas atau rumah.', NULL, NULL),
(72, 72, 'Bacaan menunjukkan manfaat dari tindakan yang dilakukan bersama dan dievaluasi. Pembaca dapat merespons dengan ingin menerapkan kebiasaan serupa', NULL, NULL),
(73, 73, 'Cerita secara langsung menempatkan Bima di lapangan dekat rumah. Keterangan', NULL, NULL),
(74, 74, 'Pada bagian awal, cerita menyebutkan bahwa layangan buatan adiknya tersangkut di pohon. Itulah informasi tersurat; pilihan lain tidak diceritakan.', NULL, NULL),
(75, 75, 'Cerita dimulai dengan masalah, menampilkan usaha Bima, lalu menyelesaikan konflik dan menunjukkan pelajaran yang diperoleh. Itulah urutan kerangka yang tepat.', NULL, NULL),
(76, 76, 'Cerita dimulai dengan masalah, menampilkan usaha Laras, lalu menyelesaikan konflik dan menunjukkan pelajaran yang diperoleh. Itulah urutan kerangka yang tepat.', NULL, NULL),
(77, 77, 'Cerita secara langsung menempatkan Dito di jalan kecil dekat sungai. Keterangan ini menunjukkan latar tempat yang sesuai. Pemahaman Inferensial', NULL, NULL),
(78, 78, 'Cerita menyelesaikan masalah melalui langkah yang diambil tokoh. Jika langkah itu tidak dilakukan, masalah mungkin tetap ada atau bantuan terlambat.', NULL, NULL),
(79, 79, 'Peristiwa dan perubahan sikap tokoh mendukung pesan bahwa kesalahan dapat diperbaiki dengan jujur dan tenang. Kesimpulan ini menghubungkan tindakan tokoh dengan pengalaman yang dialaminya.', NULL, NULL),
(80, 80, 'Tindakan Rafi menjadi jembatan antara masalah dan penyelesaian. Cerita memperlihatkan bahwa proses yang dipilih tokoh berpengaruh pada hasil.', NULL, NULL),
(81, 81, 'Cerita menyelesaikan masalah melalui langkah yang diambil tokoh. Jika langkah itu tidak dilakukan, masalah mungkin tetap ada atau bantuan terlambat.', NULL, NULL),
(82, 82, 'Tindakan Mira menjadi jembatan antara masalah dan penyelesaian. Cerita memperlihatkan bahwa proses yang dipilih tokoh berpengaruh pada hasil.', NULL, NULL),
(83, 83, 'Cerita menyelesaikan masalah melalui langkah yang diambil tokoh. Jika langkah itu tidak dilakukan, masalah mungkin tetap ada atau bantuan terlambat.', NULL, NULL),
(84, 84, 'Peristiwa dan perubahan sikap tokoh mendukung pesan bahwa usaha dan sikap sportif lebih penting daripada perlengkapan mahal. Kesimpulan ini menghubungkan tindakan tokoh dengan pengalaman yang dialaminya. Evaluasi dan Apresiasi', NULL, NULL),
(85, 85, 'Pengalaman Tika mengajarkan sikap yang dapat dipakai dalam kehidupan sehari- hari: berpikir, bertanggung jawab, dan bekerja sama.', NULL, NULL),
(86, 86, 'Akhir cerita menyelesaikan masalah dan memperlihatkan pelajaran yang diperoleh tokoh. Karena itu, pembaca wajar merasa lega serta menghargai usaha dan perubahan sikapnya.', NULL, NULL),
(87, 87, 'Peristiwa, penyelesaian, dan pelajaran saling berkaitan. Pilihan B dan C sesuai dengan alur cerita. Pilihan A keliru karena akhir cerita memperlihatkan perubahan pemahaman tokoh, sedangkan pilihan D tidak tepat karena latar membantu membangun peristiwa cerita.', NULL, NULL),
(88, 88, 'Pengalaman Ayu mengajarkan sikap yang dapat dipakai dalam kehidupan sehari- hari: berpikir, bertanggung jawab, dan bekerja sama.', NULL, NULL),
(89, 89, 'Peristiwa, penyelesaian, dan pelajaran saling berkaitan. Pilihan C dan D sesuai dengan jalannya cerita. Pilihan A keliru karena latar cerita berkaitan erat dengan peristiwa, sedangkan pilihan B keliru karena cerita justru memperlihatkan perubahan dan pemahaman tokoh.', NULL, NULL),
(90, 90, 'Akhir cerita menyelesaikan masalah dan memperlihatkan pelajaran yang diperoleh tokoh. Karena itu, pembaca wajar merasa lega serta menghargai usaha dan perubahan sikapnya.', NULL, NULL),
(91, 91, 'Bacaan menjelaskan bahwa peserta mencatat keadaan sebelum memilih langkah. Jadi, “keadaan awal” berarti kondisi sebelum program berjalan, bukan hasil akhir atau dugaan.', NULL, NULL),
(92, 92, 'Teks informasi ini bergerak dari tujuan, berlanjut ke langkah yang dilakukan, lalu menjelaskan hasil dan tindak lanjut. Urutan itu merangkum susunan gagasan bacaan dengan tepat.', NULL, NULL),
(93, 93, 'Bacaan menyatakan bahwa jumlah peminjam bertambah setelah jadwal diumumkan. Pilihan lain berlawanan dengan isi teks yang menjelaskan pembagian tugas dan pemantauan bersama.', NULL, NULL),
(94, 94, 'Bacaan menjelaskan bahwa peserta mencatat keadaan sebelum memilih langkah. Jadi, “keadaan awal” berarti kondisi sebelum program berjalan, bukan hasil akhir atau dugaan.', NULL, NULL),
(95, 95, 'Teks informasi ini bergerak dari tujuan, berlanjut ke langkah yang dilakukan, lalu menjelaskan hasil dan tindak lanjut. Urutan itu merangkum susunan gagasan bacaan dengan tepat.', NULL, NULL),
(96, 96, 'Bacaan menekankan kebiasaan konsisten, kerja sama, dan penggunaan catatan. Dari petunjuk itu dapat disimpulkan bahwa keberhasilan tidak hanya bergantung pada alat.', NULL, NULL),
(97, 97, 'Pengurus membandingkan keadaan awal dengan perubahan yang terjadi. Informasi itulah yang membantu mereka memperbaiki langkah secara masuk akal.', NULL, NULL),
(98, 98, 'Teks menjelaskan perlunya pemeriksaan berkala dan perbaikan langkah. Tanpa evaluasi, kendala berisiko tidak diketahui dan kembali terjadi.', NULL, NULL),
(99, 99, 'Teks menjelaskan perlunya pemeriksaan berkala dan perbaikan langkah. Tanpa evaluasi, kendala berisiko tidak diketahui dan kembali terjadi.', NULL, NULL),
(100, 100, 'Bacaan menekankan kebiasaan konsisten, kerja sama, dan penggunaan catatan. Dari petunjuk itu dapat disimpulkan bahwa keberhasilan tidak hanya bergantung pada alat.', NULL, NULL),
(101, 101, 'Pengurus membandingkan keadaan awal dengan perubahan yang terjadi. Informasi itulah yang membantu mereka memperbaiki langkah secara masuk akal.', NULL, NULL),
(102, 102, 'Teks menjelaskan perlunya pemeriksaan berkala dan perbaikan langkah. Tanpa evaluasi, kendala berisiko tidak diketahui dan kembali terjadi.', NULL, NULL),
(103, 103, 'Bacaan memaparkan tujuan, langkah, hasil pengamatan, dan tindak lanjut. Pilihan C dan D sesuai dengan penyajian informasi pada bacaan. Pilihan A keliru karena teks memuat contoh kegiatan konkret, sedangkan pilihan B keliru karena tindak lanjut program secara jelas dicantumkan.', NULL, NULL),
(104, 104, 'Bacaan menunjukkan manfaat dari tindakan yang dilakukan bersama dan dievaluasi. Pembaca dapat merespons dengan ingin menerapkan kebiasaan serupa dalam lingkungannya.', NULL, NULL),
(105, 105, 'Bacaan menunjukkan bahwa pembagian tugas, pencatatan, dan kerja sama membantu program berjalan. Kebiasaan itu dapat diterapkan dalam kegiatan kelas atau rumah.', NULL, NULL),
(106, 106, 'Bacaan menunjukkan manfaat dari tindakan yang dilakukan bersama dan dievaluasi. Pembaca dapat merespons dengan ingin menerapkan kebiasaan serupa dalam lingkungannya.', NULL, NULL),
(107, 107, 'Bacaan memaparkan tujuan, langkah, hasil pengamatan, dan tindak lanjut. Pilihan A dan B sesuai dengan cara penyajian informasi pada bacaan. Pilihan C keliru karena teks memuat kegiatan nyata, sedangkan pilihan D keliru karena teks secara rinci menyebutkan tindak lanjut program.', NULL, NULL),
(108, 108, 'Bacaan menunjukkan bahwa pembagian tugas, pencatatan, dan kerja sama membantu program berjalan. Kebiasaan itu dapat diterapkan dalam kegiatan kelas atau rumah. Teks Fiksi Pemahaman Tekstual', NULL, NULL),
(109, 109, 'Cerita secara langsung menempatkan Nara di perpustakaan sekolah. Keterangan ini menunjukkan latar tempat yang sesuai.', NULL, NULL),
(110, 110, 'Pada bagian awal, cerita menyebutkan bahwa sebuah surat lama terselip di buku pinjaman. Itulah informasi tersurat; pilihan lain tidak diceritakan.', NULL, NULL),
(111, 111, 'Cerita dimulai dengan masalah, menampilkan usaha Nara, lalu menyelesaikan konflik dan menunjukkan pelajaran yang diperoleh. Itulah urutan kerangka yang tepat.', NULL, NULL),
(112, 112, 'Cerita secara langsung menempatkan Laras di aula sekolah. Keterangan ini menunjukkan latar tempat yang sesuai.', NULL, NULL),
(113, 113, 'Pada bagian awal, cerita menyebutkan bahwa pemain utama pementasan tiba-tiba sakit. Itulah informasi tersurat; pilihan lain tidak diceritakan.', NULL, NULL),
(114, 114, 'Peristiwa dan perubahan sikap tokoh mendukung pesan bahwa hasil baik kadang memerlukan waktu dan perhatian. Kesimpulan ini menghubungkan tindakan tokoh dengan pengalaman yang dialaminya.', NULL, NULL),
(115, 115, 'Tindakan Sita menjadi jembatan antara masalah dan penyelesaian. Cerita memperlihatkan bahwa proses yang dipilih tokoh berpengaruh pada hasil.', NULL, NULL),
(116, 116, 'Peristiwa dan perubahan sikap tokoh mendukung pesan bahwa rasa takut berkurang ketika fakta diperiksa. Kesimpulan ini menghubungkan tindakan tokoh dengan pengalaman yang dialaminya.', NULL, NULL),
(117, 117, 'Peristiwa, penyelesaian, dan pelajaran saling berkaitan. Pilihan A dan B sesuai dengan alur cerita “Jaket berwarna kuning”. Pilihan C tidak tepat karena latar halte mendukung jalannya peristiwa, sedangkan pilihan D keliru karena akhir cerita memperlihatkan perubahan dan kedewasaan sikap tokoh.', NULL, NULL),
(118, 118, 'Pengalaman Yusuf mengajarkan sikap yang dapat dipakai dalam kehidupan sehari-hari: berpikir, bertanggung jawab, dan bekerja sama.', NULL, NULL),
(119, 119, 'Akhir cerita menyelesaikan masalah dan memperlihatkan pelajaran yang diperoleh tokoh. Karena itu, pembaca wajar merasa lega serta menghargai usaha dan perubahan sikapnya.', NULL, NULL),
(120, 120, 'Pengalaman Fajar mengajarkan sikap yang dapat dipakai dalam kehidupan sehari-hari: berpikir, bertanggung jawab, dan bekerja sama. Acuan Dokumen Kurikulum (Bahasa Indonesia).md dan Dokumen Kurikulum (format output).md yang diberikan sebagai acuan penyusunan. Kerangka Asesmen TKA Bahasa Indonesia SMP, Pusat Asesmen Pendidikan: https://pusmendik.kemendikdasmen.go.id/tka/tka/view/mata-pelajaran-wajib/ smp/Bahasa-Indonesia', NULL, NULL);

-- -----------------------------------------------------------------------------
-- 6. PEMETAAN BUTIR SOAL KE PAKET SIMULASI (SIMULATION_QUESTIONS - 60 Pemetaan)
-- ID: 61 - 120 (Offset +60 dari Matematika)
-- Paket 01: simulation_id = 3, question_id = 61..90 (order 1..30)
-- Paket 02: simulation_id = 4, question_id = 91..120 (order 1..30)
-- -----------------------------------------------------------------------------
INSERT INTO `simulation_questions` (`id`, `simulation_id`, `question_id`, `question_order`) VALUES
(61, 3, 61, 1),
(62, 3, 62, 2),
(63, 3, 63, 3),
(64, 3, 64, 4),
(65, 3, 65, 5),
(66, 3, 66, 6),
(67, 3, 67, 7),
(68, 3, 68, 8),
(69, 3, 69, 9),
(70, 3, 70, 10),
(71, 3, 71, 11),
(72, 3, 72, 12),
(73, 3, 73, 13),
(74, 3, 74, 14),
(75, 3, 75, 15),
(76, 3, 76, 16),
(77, 3, 77, 17),
(78, 3, 78, 18),
(79, 3, 79, 19),
(80, 3, 80, 20),
(81, 3, 81, 21),
(82, 3, 82, 22),
(83, 3, 83, 23),
(84, 3, 84, 24),
(85, 3, 85, 25),
(86, 3, 86, 26),
(87, 3, 87, 27),
(88, 3, 88, 28),
(89, 3, 89, 29),
(90, 3, 90, 30),
(91, 4, 91, 1),
(92, 4, 92, 2),
(93, 4, 93, 3),
(94, 4, 94, 4),
(95, 4, 95, 5),
(96, 4, 96, 6),
(97, 4, 97, 7),
(98, 4, 98, 8),
(99, 4, 99, 9),
(100, 4, 100, 10),
(101, 4, 101, 11),
(102, 4, 102, 12),
(103, 4, 103, 13),
(104, 4, 104, 14),
(105, 4, 105, 15),
(106, 4, 106, 16),
(107, 4, 107, 17),
(108, 4, 108, 18),
(109, 4, 109, 19),
(110, 4, 110, 20),
(111, 4, 111, 21),
(112, 4, 112, 22),
(113, 4, 113, 23),
(114, 4, 114, 24),
(115, 4, 115, 25),
(116, 4, 116, 26),
(117, 4, 117, 27),
(118, 4, 118, 28),
(119, 4, 119, 29),
(120, 4, 120, 30);

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- SELESAI: 2 Paket Simulasi Bahasa Indonesia Berhasil Dibenihkan
-- Total: 2 Paket (BIN-SIM-01 & BIN-SIM-02), 24 Stimulus, 60 Soal, 240 Opsi, 60 Pembahasan
-- =============================================================================

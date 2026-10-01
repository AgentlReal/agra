-- =============================================================================
-- PEMBENIHAN BANK SOAL ASESMEN PRASYARAT: RECALL KEMAMPUANMU (ERD V6.0)
-- Berkas: Migration/006_seed_recall_kemampuanmu_v6.sql
-- Cakupan: 13 Wacana/Stimulus, 60 Butir Bank Recall (30 MAT + 30 BIN),
--          240 Opsi Pilihan A-D, 60 Pembahasan Nalar Konseptual
-- Dokumen Acuan: TKA-DOC-02 (SRS), TKA-DOC-10 (Pengacakan), TKA-DOC-13 (Blueprint)
-- Aturan Semantik V6: sub_material_id & cognitive_level_id = NULL (Fondasi SD)
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. PEMBENIHAN WACANA BACAAN & STIMULUS BERSAMA (STIMULI - 13 Wacana)
-- -----------------------------------------------------------------------------
INSERT INTO `stimuli` (`id`, `subject_id`, `title`, `stimulus_text`, `stimulus_image_url`) VALUES
(25, 2, 'Danau untuk Semua', 'Wacana fabel "Danau untuk Semua" yang mengisahkan musyawarah warga hutan (Bani si kelinci, Ucil si kancil, Hari si harimau, Rino si badak) dalam mencari solusi atas kondisi danau yang kotor akibat ulah Rino berendam seharian.', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/02169_268ec71be3152eccb592e440fba94cd4.png'),
(26, 2, 'Hewan Pemakan Daun, Apa Itu?', 'Wacana informatif mengenai hewan folivora, yaitu kelompok hewan herbivora yang secara spesifik mengonsumsi dedaunan sebagai makanan utama (seperti koala, panda, dan ulat daun), serta adaptasi fisiologis saluran pencernaannya.', NULL),
(27, 2, 'Kenthus yang Sombong', 'Wacana fabel "Kenthus yang Sombong" tentang seekor katak bernama Kenthus yang congkak membusungkan perutnya menandingi tubuh anak lembu yang dilihat oleh anaknya, Koko, di tepi rawa hingga akhirnya celaka.', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/77508_36a10478fd8e0bf00c591f52d79766ba.png'),
(28, 2, 'Margaret Hamilton & Apollo 11', 'Wacana biografi sejarah mengenai Margaret Hamilton, direktur divisi rekayasa perangkat lunak MIT yang menulis kode komputer penerbangan Apollo 11 dengan ketelitian tinggi sehingga pendaratan di bulan berhasil dengan selamat.', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/59690_e53354f5ea4a8e4b6b8dd5ccee027c7d.png'),
(29, 2, 'Kerajinan Magnet Hewan Plastik', 'Teks prosedur membuat hiasan magnet kulkas bernilai guna dari mainan hewan plastik bekas melalui tahapan pemotongan menjadi dua bagian, penempelan lem dan magnet, serta pewarnaan cat semprot dekoratif.', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/82657_ddef01351a874a1b551355e9336f6558.png'),
(30, 2, 'Air Putih atau Air Mineral?', 'Infografis kesehatan perbandingan zat gizi dan elektrolit alami antara air putih biasa dan air mineral, serta fungsi keduanya bagi hidrasi, kinerja metabolisme tubuh, dan kesehatan jantung.', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/15491_2d00fa21dd39ba472070c2015288572b.png'),
(31, 2, 'Antre, Dong!', 'Teks cerita realistis tentang pengalaman Tia dan Devi mengantre di kasir Toko Buku Gemar saat seorang pemuda berusaha memotong antrean, serta ketegasan Pak Satpam dan warga dalam menjunjung budaya tertib antre.', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/51422_195231188cf69f10782ea8acd9f6fe5f.png'),
(32, 2, 'Kenapa Kita Tidak Boleh Malas Menyikat Gigi?', 'Infografis kesehatan gigi dan mulut yang menjelaskan struktur lapisan email gigi, pembentukan plak bakteri asam dari sisa glukosa makanan, serta mekanisme pencegahan gigi berlubang melalui kebiasaan menyikat gigi teratur.', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/57168_c12577e36b6c52779c963be1e0ec0a1a.png'),
(33, 2, 'Surat untuk Sahabat', 'Karya puisi bertema persahabatan sejati yang melukiskan kerinduan hangat, kenangan masa kecil, serta kesetiaan batin yang tak lekang oleh jarak dan pergantian waktu.', NULL),
(34, 2, 'Sejarah & Ragam Kerupuk Indonesia', 'Infografis kebudayaan kuliner Indonesia yang memaparkan catatan sejarah kerupuk sejak abad ke-9/10 Masehi di Jawa kuno, ragam jenis kerupuk nusantara (putih, kemplang, jengkol), hingga ekspor ke mancanegara.', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/67775_8fa9060de0210a1af4faae40dca1e5ac.png'),
(35, 1, 'Taman Kota - Area Parkir', 'Stimulus visual konteks penataan area parkir mobil dan sepeda motor di kawasan rekreasi taman kota dengan alokasi lebar jalan dan luas lahan parkir per kendaraan.', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/80459_1aeca2f53d435aef3287227b2ace6a8f.png'),
(36, 1, 'Hobi Membaca Buku', 'Infografis catatan literasi mengenai perbandingan jumlah total halaman buku dan proporsi bagian buku yang telah diselesaikan oleh Danu, Antok, dan Caca pada minggu pertama.', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/49905_24dc4275ae08272b98043803422e1e21.png'),
(37, 1, 'Lemak Sehat untuk Anak & Ibu Hamil', 'Diagram batang dan tabel standar gizi Kemenkes RI mengenai pemenuhan kebutuhan protein dan lemak sehat harian untuk tumbuh kembang anak usia 10-12 tahun dan kesehatan ibu hamil.', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/96825_d0bc22f34a2bf781213209f6050af649.png')
ON DUPLICATE KEY UPDATE `subject_id` = VALUES(`subject_id`), `title` = VALUES(`title`), `stimulus_text` = VALUES(`stimulus_text`), `stimulus_image_url` = VALUES(`stimulus_image_url`);

-- -----------------------------------------------------------------------------
-- 2. PEMBENIHAN MASTER BANK SOAL RECALL (QUESTION_BANKS - 60 Butir)
-- Catatan V6.0: sub_material_id & cognitive_level_id bernilai NULL
-- ID 121 s.d. 150: 30 Butir Matematika Recall
-- ID 151 s.d. 180: 30 Butir Bahasa Indonesia Recall
-- -----------------------------------------------------------------------------
INSERT INTO `question_banks` (`id`, `subject_id`, `sub_material_id`, `cognitive_level_id`, `stimulus_id`, `bank_type`, `question_format`, `question_text`, `stimulus_image_url`, `is_active`) VALUES
(121, 1, NULL, NULL, NULL, 'RECALL', 'SINGLE_CHOICE', '120% − 3 + 2 × 0,75 + 2/3 = ....', NULL, TRUE),
(122, 1, NULL, NULL, NULL, 'RECALL', 'SINGLE_CHOICE', 'Menjelang tahun ajaran baru, Toko Buku Ceria memberikan diskon 10% untuk semua jenis buku. Diketahui harga buku gambar adalah 1/2 dari harga buku komik. Harga buku tulis adalah 0,75 kali harga buku komik. Diketahui harga buku komik adalah Rp24.000,00.

Harga buku gambar dan buku tulis setelah dikenakan diskon adalah ….', NULL, TRUE),
(123, 1, NULL, NULL, NULL, 'RECALL', 'COMPLEX_CHOICE', 'Pak Bondan seorang penjual susu kedelai. Suatu hari, Pak Bondan memproduksi susu kedelai sebanyak 7 wadah yang masing-masing berisi 6 1/4 liter susu kedelai. Seluruh hasil produksi tersebut akan dituangkan ke dalam 50 botol besar dengan isi yang sama banyak dan ke dalam 15 botol kecil dengan isi setiap botolnya adalah setengah botol besar.

Tentukan Benar atau Salah untuk setiap pernyataan berikut tentang hasil produksi susu kedelai Pak Bondan!', NULL, TRUE),
(124, 1, NULL, NULL, NULL, 'RECALL', 'SINGLE_CHOICE', 'Mae bermain ular tangga menggunakan sebuah dadu. Diketahui bahwa jumlah titik pada setiap dua sisi berlawanan pada dadu adalah sama. Pada saat giliran Mae bermain, Mae melempar dadunya. Berikut adalah dadu hasil lemparan Mae.

Pada dadu tersebut, banyak titik yang ada di sisi bawah adalah ….', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/31032_21c6872fb18c70275887eb7b88754365.png', TRUE),
(125, 1, NULL, NULL, NULL, 'RECALL', 'COMPLEX_CHOICE', 'Setiap bulan Ramadan, SD Harapan mengadakan bakti sosial. Mereka membagi sembako yang berisi 3 kg beras, dua bungkus gula pasir dengan berat masing-masing kemasan 5 hg, dan lima bungkus mi instan dengan berat per bungkus 85 g.

Pilihlah pernyataan yang benar sesuai dengan informasi tersebut! Jawaban benar lebih dari satu.', NULL, TRUE),
(126, 1, NULL, NULL, NULL, 'RECALL', 'COMPLEX_CHOICE', 'SD Harapan baru saja meresmikan ruang perpustakaan untuk siswa. Bu Anita sedang mendata banyak siswa yang berkunjung ke perpustakaan tersebut pada lima hari pertama sejak diresmikan. Diagram berikut menggambarkan data yang diperoleh Bu Anita.

Deskripsi apakah yang tepat tentang data pada diagram tersebut? Tentukan Benar atau Salah untuk setiap pernyataan berikut!', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/73109_ffe98e27da69e4bb210706baa1ce06e6.png', TRUE),
(127, 1, NULL, NULL, NULL, 'RECALL', 'COMPLEX_CHOICE', 'SD Mutiara mengadakan program pekan literasi. Selama pekan literasi, para siswa ditugaskan untuk mencatat jumlah buku yang mereka baca di rumah. Rina, Dika, dan Siti mencatat buku yang mereka baca dalam bentuk piktogram seperti pada gambar berikut.

Berdasarkan informasi dari piktogram tersebut, tentukan Benar atau Salah untuk setiap pernyataan berikut terkait jumlah buku yang dibaca oleh Rina, Dika, dan Siti!', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/87885_83f732c2be712123bf3e202b2c7cfec5.png', TRUE),
(128, 1, NULL, NULL, NULL, 'RECALL', 'SINGLE_CHOICE', 'Pak Bakri mempunyai lahan seluas 3,5 hektar. Pada lahan tersebut, 1/5 bagiannya akan ditanami cabai merah, 1/3 bagiannya akan ditanami tomat, dan sisanya akan ditanami daun bawang.

Berapakah luas lahan yang akan ditanami tomat dan daun bawang?', NULL, TRUE),
(129, 1, NULL, NULL, NULL, 'RECALL', 'SINGLE_CHOICE', 'Sebuah bak berbentuk kubus memiliki volume sebesar 9 m^{3} Bak tersebut akan diubah menjadi sebuah balok dengan panjangnya 2 kali dari ukuran bak sebelumnya, lebarnya 1/2 dari ukuran bak sebelumnya, dan tingginya sama dengan ukuran bak sebelumnya.

Volume dari bak yang baru adalah ….', NULL, TRUE),
(130, 1, NULL, NULL, NULL, 'RECALL', 'SINGLE_CHOICE', 'Pak Bayu dan keluarganya tinggal di Kota Yogyakarta dan berencana untuk liburan ke Semarang. Diketahui jarak Yogyakarta-Semarang 140 km dan kecepatan rata-rata mobil Pak Bayu 80 km/jam. Pak Bayu dan keluarga berangkat dari rumah pukul 06.00.

Apabila di tengah perjalanan mereka berhenti selama 15 menit untuk membeli oleh-oleh, pukul berapakah Pak Bayu dan keluarga tiba di Semarang?', NULL, TRUE),
(131, 1, NULL, NULL, NULL, 'RECALL', 'COMPLEX_CHOICE', 'Lala berulang tahun setiap tanggal 14 Juni. Dia akan berusia 13 tahun pada bulan Juni tahun ini. Sekarang tanggal 30 April.

Berdasarakan informasi tersebut, tentukan Benar atau Salah untuk setiap pernyataan berikut terkait ulang tahun Lala!', NULL, TRUE),
(132, 1, NULL, NULL, NULL, 'RECALL', 'SINGLE_CHOICE', 'Ibu pergi ke pasar membeli 3 kg buah. Di dalam keranjang belanja ibu, terdapat dua buah alpukat mentega dengan berat 1,25 kg dan sisanya adalah tujuh buah mangga kweni.

Berat satu buah mangga kweni adalah ….', NULL, TRUE),
(133, 1, NULL, NULL, NULL, 'RECALL', 'COMPLEX_CHOICE', 'Seorang petani memiliki tangki berisi air sebanyak 0,8 hektoliter. Air tersebut akan ditampung ke dalam bak penampungan yang nantinya akan digunakan untuk menyiram tanaman cabai. Bak penampungan dapat menampung 20 liter air.

Berdasarkan informasi tersebut, tentukan Benar atau** Salah **untuk setiap pernyataan berikut!', NULL, TRUE),
(134, 1, NULL, NULL, NULL, 'RECALL', 'COMPLEX_CHOICE', 'Bu Guru menugaskan Doni untuk membawa sebuah kotak yang dapat menampung 64 kubus satuan. Kubus satuan adalah kubus yang mempunyai rusuk 1 cm. Di rumah, Doni memiliki beberapa macam kotak dengan berbagai ukuran.

Di antara pilihan berikut, kotak mana sajakah yang harus dibawa oleh Doni? Pilihlah jawaban yang benar! Jawaban benar lebih dari satu.', NULL, TRUE),
(135, 1, NULL, NULL, NULL, 'RECALL', 'COMPLEX_CHOICE', 'Nisa sedang mengunjungi kebun binatang. Dia ingin melihat Capybara yang letaknya di bagian timur kebun binatang. Setelah Nisa melewati gerbang kebun binatang, dia melihat papan petunjuk jalan sebagai berikut.

Berdasarkan informasi tersebut, tentukan Benar atau** Salah **untuk setiap pernyataan berikut!', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/37419_54c7662ad3efb88986fc7df6c96fc96f.png', TRUE),
(136, 1, NULL, NULL, NULL, 'RECALL', 'SINGLE_CHOICE', 'Dio sedang membantu ayah memotong batang rotan untuk dijadikan stik pewangi ruangan. Ayah mempunyai batang rotan dengan panjang 320 cm. Ayah ingin membuat stik pewangi ruangan sebanyak mungkin dengan panjang stik masing-masing 15 cm.

Sisa batang rotan yang tidak terpakai untuk membuat stik pewangi ruangan adalah sepanjang ….', NULL, TRUE),
(137, 1, NULL, NULL, NULL, 'RECALL', 'SINGLE_CHOICE', 'Murid-murid SD Cerdas, SD Pelita, dan SD Mentari melakukan kegiatan olahraga di lapangan bola yang sama. Jadwal mereka melakukan kegiatan olahraga tidak sama. Murid-murid SD Cerdas melakukan kegiatan olahraga setiap 2 minggu sekali. Murid-murid SD Pelita melakukan kegiatan olahraga setiap 3 minggu sekali. Murid-murid SD Mentari melakukan kegiatan olahraga setiap 4 minggu sekali. Hari ini ketiga SD tersebut melakukan kegiatan olahraga secara bersamaan.

Setiap periode waktu berapakah murid ketiga SD tersebut akan bertemu dalam kegiatan olahraga di lapangan?', NULL, TRUE),
(138, 1, NULL, NULL, NULL, 'RECALL', 'SINGLE_CHOICE', 'Misal a = 5 − 7/2 dan b = 3/4 − 1/2 .

Maka a − 2b = …..', NULL, TRUE),
(139, 1, NULL, NULL, NULL, 'RECALL', 'SINGLE_CHOICE', 'Desti mendapatkan hadiah satu loyang kue pada hari ulang tahunnya. Desti memotong kuenya menjadi beberapa bagian seperti yang terlihat pada gambar. Beberapa potong kue berwarna cokelat dan beberapa potong lainnya berwarna kuning.

Berapa bagiankah kue yang berwarna cokelat dari keseluruhan kue?', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/57566_d25eb3d15a9695272348b45136457c91.png', TRUE),
(140, 1, NULL, NULL, NULL, 'RECALL', 'SINGLE_CHOICE', 'Pak Boni memiliki sebidang tanah berbentuk bangun sebagai berikut.

Berapakah keliling bidang tanah Pak Boni?', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/78224_c29fd511941563a631fbb6470eb5facb.png', TRUE),
(141, 1, NULL, NULL, NULL, 'RECALL', 'SINGLE_CHOICE', 'Untuk meningkatkan minat membaca siswa, perpustakaan di SD Cahaya mengadakan kegiatan “Ayo Membaca Buku” untuk murid kelas 6. Jumlah peserta dari Kelas A sebanyak 28 siswa, dari Kelas B sebanyak 36 siswa, dan dari Kelas C sebanyak 32 siswa. Setiap siswa akan mendapatkan 3 buah buku bacaan.

Jika 1 dus berisi 24 buku, berapa dus buku yang dibutuhkan untuk kegiatan tersebut?', NULL, TRUE),
(142, 1, NULL, NULL, NULL, 'RECALL', 'SINGLE_CHOICE', 'Pada hari Sabtu, Andi, Beni, Citra, dan Dika mengikuti kegiatan “Lari Sehat” di lapangan desa. Mereka semua menargetkan untuk menyelesaikan jarak lari yang sama, yaitu 10 km. Hingga pukul 08.00, diperoleh data sebagai berikut.

Siapakah yang telah menempuh jarak lari sebesar 3/5 dari total jarak?', NULL, TRUE),
(143, 1, NULL, NULL, NULL, 'RECALL', 'SINGLE_CHOICE', 'Sebuah bangun datar memiliki sifat-sifat sebagai berikut:

Berdasarkan sifat-sifat di atas, apakah nama bangun datar tersebut?', NULL, TRUE),
(144, 1, NULL, NULL, NULL, 'RECALL', 'SINGLE_CHOICE', 'Pada hari Minggu, Rani mengikuti kegiatan belajar menari di sanggar seni.

Pukul berapakah Rani meninggalkan sanggar untuk pulang?', NULL, TRUE),
(145, 1, NULL, NULL, 35, 'RECALL', 'SINGLE_CHOICE', 'TAMAN KOTA

Perhatikan tempat parkir mobil di taman kota. Lebar jalan yang disediakan untuk parkir satu mobil adalah 2 meter. Satu mobil baru saja keluar dari parkiran. Berapa mobil lagi yang dapat diparkir di area tersebut sekarang?', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/80459_1aeca2f53d435aef3287227b2ace6a8f.png', TRUE),
(146, 1, NULL, NULL, 35, 'RECALL', 'COMPLEX_CHOICE', 'TAMAN KOTA

Lahan parkir motor ada di sekitar taman. Parkiran yang tersedia cukup luas. Satu motor membutuhkan lahan parkir seluas 2 . Pada pukul 13.00, terdapat 12 motor yang memasuki area parkir dan dapat terparkir dengan rapi di lahan parkir. Ternyata lahan parkir dapat menampung 1 motor lagi. Tentukan Benar atau Salah pernyataan berikut terkait tempat parkir motor pada siang itu!', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/80459_1aeca2f53d435aef3287227b2ace6a8f.png', TRUE),
(147, 1, NULL, NULL, 36, 'RECALL', 'SINGLE_CHOICE', 'HOBI MEMBACA BUKU

Berapa persen dari seluruh halaman buku yang sudah selesai dibaca oleh Caca?', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/49905_24dc4275ae08272b98043803422e1e21.png', TRUE),
(148, 1, NULL, NULL, 36, 'RECALL', 'COMPLEX_CHOICE', 'HOBI MEMBACA BUKU

Berdasarkan informasi mengenai jumlah halaman buku dan banyak bagian buku yang sudah dibaca oleh Danu, Antok, dan Caca di minggu pertama, tentukan Benar atau Salah untuk setiap pernyataan berikut!', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/49905_24dc4275ae08272b98043803422e1e21.png', TRUE),
(149, 1, NULL, NULL, 37, 'RECALL', 'COMPLEX_CHOICE', 'LEMAK SEHAT UNTUK ANAK

Anak berusia 10 - 12 tahun membutuhkan protein paling sedikit 55 gram dalam sehari. Jika disediakan makanan berikut dengan berat masing-masing 250 gram, tentukanlah makanan yang dapat memenuhi kebutuhan protein harian mereka! Pilihlah jawaban yang benar! Jawaban benar lebih dari satu.', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/96825_d0bc22f34a2bf781213209f6050af649.png', TRUE),
(150, 1, NULL, NULL, 37, 'RECALL', 'COMPLEX_CHOICE', 'LEMAK SEHAT UNTUK ANAK

Menurut Kementerian Kesehatan RI, ibu hamil harus mengonsumsi lebih banyak makanan yang mengandung protein dan lemak. Hal ini disarankan agar memastikan jaringan dan organ bayi dapat tumbuh dengan baik. Ibu hamil perlu mengonsumsi 70 hingga 100 gram protein setiap hari, sedangkan lemak dapat dikonsumsi sebanyak 62 hingga 67 gram dalam sehari. Suatu hari, seorang ibu hamil mencatat banyak lemak dan protein yang dikonsumsi sebagai berikut.', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/96825_d0bc22f34a2bf781213209f6050af649.png', TRUE),
(151, 2, NULL, NULL, 25, 'RECALL', 'SINGLE_CHOICE', 'Siapa yang mengusulkan untuk meminta bantuan hewan yang cerdik?', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/02169_268ec71be3152eccb592e440fba94cd4.png', TRUE),
(152, 2, NULL, NULL, 25, 'RECALL', 'SINGLE_CHOICE', '“Mereka diam seribu bahasa.” Apa arti “diam seribu bahasa” pada teks fabel tersebut?', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/02169_268ec71be3152eccb592e440fba94cd4.png', TRUE),
(153, 2, NULL, NULL, 25, 'RECALL', 'COMPLEX_CHOICE', 'Apa contoh peristiwa yang dapat ditemukan dalam kehidupan sehari- hari berdasarkan kejadian yang dialami Ucil pada cerita tersebut? Tentukan Sesuai atau Tidak Sesuai untuk setiap pernyataan berikut!', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/02169_268ec71be3152eccb592e440fba94cd4.png', TRUE),
(154, 2, NULL, NULL, 26, 'RECALL', 'COMPLEX_CHOICE', 'Hewan Pemakan Daun, Apa Itu?

Apa saja contoh hewan folivora berdasarkan informasi tersebut? Klik pada setiap pilihan jawaban benar! Jawaban benar lebih dari satu.', NULL, TRUE),
(155, 2, NULL, NULL, 26, 'RECALL', 'SINGLE_CHOICE', 'Hewan Pemakan Daun, Apa Itu?

Bagan mana yang sesuai untuk menggambarkan informasi pada teks tersebut?', NULL, TRUE),
(156, 2, NULL, NULL, 26, 'RECALL', 'SINGLE_CHOICE', 'Hewan Pemakan Daun, Apa Itu?

Apa gagasan utama yang disampaikan pada paragraf ketiga teks tersebut?', NULL, TRUE),
(157, 2, NULL, NULL, 27, 'RECALL', 'COMPLEX_CHOICE', 'Kenthus yang Sombong

Apa yang dijelaskan Koko tentang anak lembu? Klik pada setiap pilihan jawaban benar! Jawaban benar lebih dari satu.', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/77508_36a10478fd8e0bf00c591f52d79766ba.png', TRUE),
(158, 2, NULL, NULL, 27, 'RECALL', 'SINGLE_CHOICE', 'Kenthus yang Sombong

Apa kejadian yang membuat Kenthus merasa menyesal?', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/77508_36a10478fd8e0bf00c591f52d79766ba.png', TRUE),
(159, 2, NULL, NULL, 27, 'RECALL', 'COMPLEX_CHOICE', 'Kenthus yang Sombong

Amel telah membaca cerita tersebut. Ia merasakan beberapa reaksi saat membacanya. Bagaimana reaksi Amel saat membaca akhir cerita tersebut? Klik pada pilihan Benar atau Salah untuk setiap pernyataan berdasarkan isi teks!', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/77508_36a10478fd8e0bf00c591f52d79766ba.png', TRUE),
(160, 2, NULL, NULL, 28, 'RECALL', 'SINGLE_CHOICE', 'Dalam teks, terdapat kalimat “Hari-hari itu sangat menegangkan. *” * Makna kata * menegangkan * dalam kalimat tersebut adalah ….', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/59690_e53354f5ea4a8e4b6b8dd5ccee027c7d.png', TRUE),
(161, 2, NULL, NULL, 28, 'RECALL', 'SINGLE_CHOICE', 'Surat membahas peran kode komputer dalam misi Apollo 11. Manakah pernyataan yang mendukung ide utama tersebut?', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/59690_e53354f5ea4a8e4b6b8dd5ccee027c7d.png', TRUE),
(162, 2, NULL, NULL, 28, 'RECALL', 'COMPLEX_CHOICE', 'Pengalaman Margaret Hamilton mengandung pelajaran hidup. Apa pelajaran penting yang dapat diambil dari suratnya? Klik pada pilihan Benar  atau Salah untuk setiap pernyataan berdasarkan isi teks!', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/59690_e53354f5ea4a8e4b6b8dd5ccee027c7d.png', TRUE),
(163, 2, NULL, NULL, 29, 'RECALL', 'SINGLE_CHOICE', 'Berdasarkan teks, benda yang umum digunakan dalam kerajinan adalah ….', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/82657_ddef01351a874a1b551355e9336f6558.png', TRUE),
(164, 2, NULL, NULL, 29, 'RECALL', 'COMPLEX_CHOICE', 'Langkah kedua mendukung tujuan utama teks karena …. Klik pada setiap pilihan jawaban benar! Jawaban benar lebih dari satu.', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/81885_ddef01351a874a1b551355e9336f6558.png', TRUE),
(165, 2, NULL, NULL, 29, 'RECALL', 'SINGLE_CHOICE', 'Mengapa mainan hewan dibagi menjadi dua bagian?', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/81885_ddef01351a874a1b551355e9336f6558.png', TRUE),
(166, 2, NULL, NULL, 30, 'RECALL', 'SINGLE_CHOICE', 'Air Putih atau Air Mineral?

Apa fungsi kandungan elektrolit yang dimiliki air mineral?', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/15491_2d00fa21dd39ba472070c2015288572b.png', TRUE),
(167, 2, NULL, NULL, 30, 'RECALL', 'SINGLE_CHOICE', 'Air Putih atau Air Mineral?

Mengapa air putih lebih cocok untuk dikonsumsi setiap saat?', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/18602_2d00fa21dd39ba472070c2015288572b.png', TRUE),
(168, 2, NULL, NULL, 30, 'RECALL', 'COMPLEX_CHOICE', 'Air Putih atau Air Mineral?

Mengapa kata “BEDA” pada judul infografis berwarna oranye? Klik pilihan Benar atau Salah untuk setiap pernyataan berdasarkan isi teks!', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/39407_2d00fa21dd39ba472070c2015288572b.png', TRUE),
(169, 2, NULL, NULL, 31, 'RECALL', 'SINGLE_CHOICE', '** Antre, Dong! **

Tia dan Devi sedang berada di Toko Buku Gemar. Mereka mencari buku pelajaran. Setelah menemukan buku yang dicari, mereka menuju ke kasir. Mereka menempati urutan kelima dan keenam. Tak lama kemudian, ada orang yang mengantre di belakang mereka. Mereka sabar menunggu giliran membayar di kasir.

Namun, tiba-tiba seorang pemuda berjalan ke antrean paling depan. Tentu saja, orang-orang yang sudah mengantre lebih dulu memprotes. “Tolong, antre, Dik,” kata seorang ibu yang berada di belakangnya. “Maaf, Bu, saya harus cepat-cepat. Ini juga hanya satu buku, pasti tidak akan lama. Tidak akan sampai lima menit,” kata pemuda itu. “Tidak boleh seperti itu, Nak. Kita harus membudayakan antre. Jika kamu harus cepat-cepat, bolehkah saya tahu alasannya?” ucap ibu itu. “Iya, Kak, kita harus antre. Semua yang ada di sini juga ingin cepat dilayani. Apa Kakak tidak malu melihat seorang ibu-ibu saja bersedia mengantre? Kakak yang muda justru bertingkah sebaliknya,” sahut Tia. Devi terlihat hanya diam dan menggangguk. Mendengar ada suara seperti keributan, Pak Satpam pun masuk. Dia menenangkan situasi. Pemuda itu harus tetap mengantre sesuai antrean.

Siapakah tokoh yang menyelesaikan keributan dalam cerita tersebut?', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/51422_195231188cf69f10782ea8acd9f6fe5f.png', TRUE),
(170, 2, NULL, NULL, 31, 'RECALL', 'COMPLEX_CHOICE', '** Antre, Dong! **

Tia dan Devi sedang berada di Toko Buku Gemar. Mereka mencari buku pelajaran. Setelah menemukan buku yang dicari, mereka menuju ke kasir. Mereka menempati urutan kelima dan keenam. Tak lama kemudian, ada orang yang mengantre di belakang mereka. Mereka sabar menunggu giliran membayar di kasir.

Namun, tiba-tiba seorang pemuda berjalan ke antrean paling depan. Tentu saja, orang-orang yang sudah mengantre lebih dulu memprotes. “Tolong, antre, Dik,” kata seorang ibu yang berada di belakangnya. “Maaf, Bu, saya harus cepat-cepat. Ini juga hanya satu buku, pasti tidak akan lama. Tidak akan sampai lima menit,” kata pemuda itu. “Tidak boleh seperti itu, Nak. Kita harus membudayakan antre. Jika kamu harus cepat-cepat, bolehkah saya tahu alasannya?” ucap ibu itu. “Iya, Kak, kita harus antre. Semua yang ada di sini juga ingin cepat dilayani. Apa Kakak tidak malu melihat seorang ibu-ibu saja bersedia mengantre? Kakak yang muda justru bertingkah sebaliknya,” sahut Tia. Devi terlihat hanya diam dan menggangguk. Mendengar ada suara seperti keributan, Pak Satpam pun masuk. Dia menenangkan situasi. Pemuda itu harus tetap mengantre sesuai antrean.

Apa saja peristiwa yang dialami Tia dalam cerita? Klik pada setiap pilihan jawaban benar! Jawaban benar lebih dari satu!', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/86139_195231188cf69f10782ea8acd9f6fe5f.png', TRUE),
(171, 2, NULL, NULL, 31, 'RECALL', 'COMPLEX_CHOICE', '** Antre, Dong! **

Tia dan Devi sedang berada di Toko Buku Gemar. Mereka mencari buku pelajaran. Setelah menemukan buku yang dicari, mereka menuju ke kasir. Mereka menempati urutan kelima dan keenam. Tak lama kemudian, ada orang yang mengantre di belakang mereka. Mereka sabar menunggu giliran membayar di kasir.

Namun, tiba-tiba seorang pemuda berjalan ke antrean paling depan. Tentu saja, orang-orang yang sudah mengantre lebih dulu memprotes. “Tolong, antre, Dik,” kata seorang ibu yang berada di belakangnya. “Maaf, Bu, saya harus cepat-cepat. Ini juga hanya satu buku, pasti tidak akan lama. Tidak akan sampai lima menit,” kata pemuda itu. “Tidak boleh seperti itu, Nak. Kita harus membudayakan antre. Jika kamu harus cepat-cepat, bolehkah saya tahu alasannya?” ucap ibu itu. “Iya, Kak, kita harus antre. Semua yang ada di sini juga ingin cepat dilayani. Apa Kakak tidak malu melihat seorang ibu-ibu saja bersedia mengantre? Kakak yang muda justru bertingkah sebaliknya,” sahut Tia. Devi terlihat hanya diam dan menggangguk. Mendengar ada suara seperti keributan, Pak Satpam pun masuk. Dia menenangkan situasi. Pemuda itu harus tetap mengantre sesuai antrean.

Dalam cerita, seorang pemuda mengatakan, “hanya satu buku, pasti tidak akan lama.” Intan telah membaca cerita tersebut. Menurutnya, perkataan tersebut tidak dapat dibenarkan. Apa alasan yang mendukung pendapat Intan berdasarkan isi cerita? Klik pilihan Mendukung atau Tidak Mendukung untuk setiap pernyataan berdasarkan isi teks!', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/57888_195231188cf69f10782ea8acd9f6fe5f.png', TRUE),
(172, 2, NULL, NULL, 32, 'RECALL', 'SINGLE_CHOICE', 'Kenapa Kita Tidak Boleh Malas Menyikat Gigi?

Apa penyebab gigi berlubang?', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/57168_c12577e36b6c52779c963be1e0ec0a1a.png', TRUE),
(173, 2, NULL, NULL, 32, 'RECALL', 'COMPLEX_CHOICE', 'Kenapa Kita Tidak Boleh Malas Menyikat Gigi?

Apa yang terjadi pada gigi jika tidak dirawat dengan baik? Klik pada setiap pilihan jawaban benar! Jawaban benar lebih dari satu.', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/24199_c12577e36b6c52779c963be1e0ec0a1a.png', TRUE),
(174, 2, NULL, NULL, 32, 'RECALL', 'COMPLEX_CHOICE', 'Kenapa Kita Tidak Boleh Malas Menyikat Gigi?

Apa fungsi tanda panah pada gambar teks tersebut? Klik pada pilihan Benar atau Salah untuk setiap pertanyaan berdasarkan isi teks!', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/01729_c12577e36b6c52779c963be1e0ec0a1a.png', TRUE),
(175, 2, NULL, NULL, 33, 'RECALL', 'COMPLEX_CHOICE', 'Surat untuk Sahabat

Larik mana saja yang menunjukkan kerinduan? Klik pada setiap pilihan jawaban benar! Jawaban benar lebih dari satu.', NULL, TRUE),
(176, 2, NULL, NULL, 33, 'RECALL', 'SINGLE_CHOICE', 'Surat untuk Sahabat

” ** kesetiaan yang tak akan pernah lekang oleh masa”

Makna pada larik puisi tersebut adalah …', NULL, TRUE),
(177, 2, NULL, NULL, 33, 'RECALL', 'SINGLE_CHOICE', 'Surat untuk Sahabat

Pesan apa yang ingin disampaikan dalam puisi tersebut?', NULL, TRUE),
(178, 2, NULL, NULL, 34, 'RECALL', 'SINGLE_CHOICE', 'Apa nama kerupuk yang sudah dikonsumsi sejak lama?', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/67775_8fa9060de0210a1af4faae40dca1e5ac.png', TRUE),
(179, 2, NULL, NULL, 34, 'RECALL', 'COMPLEX_CHOICE', 'Mengapa kerupuk asal Indonesia semakin mendunia? Klik pada pilihan Benar atau ** Salah** untuk setiap pernyataan berdasarkan isi teks!', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/48970_8fa9060de0210a1af4faae40dca1e5ac.png', TRUE),
(180, 2, NULL, NULL, 34, 'RECALL', 'COMPLEX_CHOICE', 'Mengapa terdapat gambar berbagai jenis kerupuk pada teks tersebut? Klik pilihan Benar atau Salah untuk setiap pernyataan berdasarkan isi teks!', 'https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/72787_8fa9060de0210a1af4faae40dca1e5ac.png', TRUE)
ON DUPLICATE KEY UPDATE `subject_id` = VALUES(`subject_id`), `sub_material_id` = VALUES(`sub_material_id`), `cognitive_level_id` = VALUES(`cognitive_level_id`), `stimulus_id` = VALUES(`stimulus_id`), `bank_type` = VALUES(`bank_type`), `question_format` = VALUES(`question_format`), `question_text` = VALUES(`question_text`), `stimulus_image_url` = VALUES(`stimulus_image_url`), `is_active` = VALUES(`is_active`);

-- -----------------------------------------------------------------------------
-- 3. PEMBENIHAN PILIHAN JAWABAN RECALL (QUESTION_OPTIONS - 240 Opsi A-D)
-- -----------------------------------------------------------------------------
INSERT INTO `question_options` (`id`, `question_id`, `option_label`, `option_text`, `is_correct`) VALUES
(481, 121, 'A', '11/30 (Link Gambar: https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/56324_f6f33e81bb0d80568903cb66164f6cd6.png)', TRUE),
(482, 121, 'B', '49/60 (Link Gambar: https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/56324_1432ea666520292d5f71f3aafce4c0c5.png)', FALSE),
(483, 121, 'C', '31/30 (Link Gambar: https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/56324_d3dff50998547ff13c29bc2c178da393.png)', FALSE),
(484, 121, 'D', '98/60 (Link Gambar: https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/56324_08a909237bd5e812ef53d3ee07615fcb.png)', FALSE),
(485, 122, 'A', 'Rp18.000,00', FALSE),
(486, 122, 'B', 'Rp24.000,00', FALSE),
(487, 122, 'C', 'Rp27.000,00', TRUE),
(488, 122, 'D', 'Rp30.000,00', FALSE),
(489, 123, 'A', 'Pada hari itu Pak Bondan memproduksi 43 3/4 liter susu kedelai.', TRUE),
(490, 123, 'B', 'Setiap botol besar diisi susu kedelai sebanyak 35/46 liter.', TRUE),
(491, 123, 'C', 'Total susu kedelai yang dikemas dalam botol kecil adalah 525/46 liter.', FALSE),
(492, 123, 'D', 'Isi satu botol besar setara dengan isi dua botol kecil.', TRUE),
(493, 124, 'A', '2', FALSE),
(494, 124, 'B', '3', TRUE),
(495, 124, 'C', '4', FALSE),
(496, 124, 'D', '5', FALSE),
(497, 125, 'A', 'Total berat semua isi paket adalah 4.425 gram.', TRUE),
(498, 125, 'B', 'Berat mi instan dalam paket tersebut lebih dari 0,5 kilogram.', FALSE),
(499, 125, 'C', 'Satu kemasan gula pasir lebih berat dibandingkan seluruh mi instan.', TRUE),
(500, 125, 'D', 'Beras merupakan komponen yang paling berat di dalam paket sembako.', TRUE),
(501, 126, 'A', 'Banyak siswa yang mengunjungi perpustakaan pada hari Senin hanya 3/4 dari pengunjung pada hari Rabu.', TRUE),
(502, 126, 'B', 'Total siswa pengunjung perpustakaan mulai dari hari Senin hingga hari Jumat adalah 100.', FALSE),
(503, 126, 'C', 'Perbedaan banyak pengunjung harian dengan hari sebelumnya tidak lebih dari 5 orang.', TRUE),
(504, 126, 'D', 'Total pengunjung perpustakaan selama lima hari tersebut lebih dari 100 orang.', TRUE),
(505, 127, 'A', 'Rina membaca sepuluh buku.', TRUE),
(506, 127, 'B', 'Dika membaca buku lebih sedikit daripada Rina.', TRUE),
(507, 127, 'C', 'Siti membaca tiga buku.', FALSE),
(508, 127, 'D', 'Total seluruh buku yang dibaca oleh keempat siswa adalah 28 buku.', TRUE),
(509, 128, 'A', '1,63 hektar.', FALSE),
(510, 128, 'B', '1,87 hektar.', FALSE),
(511, 128, 'C', '2,33 hektar.', FALSE),
(512, 128, 'D', '2,80 hektar.', TRUE),
(513, 129, 'A', '4,5 m3', FALSE),
(514, 129, 'B', '9 m3', TRUE),
(515, 129, 'C', '18 m3', FALSE),
(516, 129, 'D', '22,5 m3', FALSE),
(517, 130, 'A', '07.45', FALSE),
(518, 130, 'B', '08.00', TRUE),
(519, 130, 'C', '08.45', FALSE),
(520, 130, 'D', '09.00', FALSE),
(521, 131, 'A', 'Lala harus menunggu 45 hari lagi untuk merayakan ulang tahunnya.', TRUE),
(522, 131, 'B', 'Lala harus menunggu enam minggu dan tiga hari lagi untuk merayakan ulang tahunnya.', TRUE),
(523, 131, 'C', 'Lala harus menunggu dua bulan untuk merayakan ulang tahunnya.', FALSE),
(524, 131, 'D', 'Pada tanggal 31 Mei, sisa waktu menunggu ulang tahun Lala tinggal 14 hari lagi.', TRUE),
(525, 132, 'A', '0,2 kg', FALSE),
(526, 132, 'B', '0,25 kg', TRUE),
(527, 132, 'C', '0,3 kg', FALSE),
(528, 132, 'D', '0,35 kg', FALSE),
(529, 133, 'A', 'Air di dalam tangki tersebut adalah 80 liter.', TRUE),
(530, 133, 'B', 'Petani dapat mengisi bak penampungan sebanyak lima kali hingga tangki kosong.', FALSE),
(531, 133, 'C', 'Jika satu baris tanaman cabai membutuhkan 40 dl air, sepuluh baris tanaman cabai dapat membuat volume air dalam tangki berkurang setengahnya.', TRUE),
(532, 133, 'D', 'Kapasitas bak penampungan setara dengan 2.000 desiliter air.', FALSE),
(533, 134, 'A', 'Kotak berukuran 8 cm × 2 cm × 4 cm', TRUE),
(534, 134, 'B', 'Kotak berukuran 4 cm × 4 cm × 4 cm', TRUE),
(535, 134, 'C', 'Kotak berukuran 4 cm × 3 cm × 5 cm', FALSE),
(536, 134, 'D', 'Kotak berukuran 16 cm × 2 cm × 2 cm', TRUE),
(537, 135, 'A', 'Jarak kandang Zebra adalah 6.000 mm.', FALSE),
(538, 135, 'B', 'Jarak kandang Capybara dan Kanguru adalah 1.500 cm.', TRUE),
(539, 135, 'C', 'Jika Nisa melihat Jerapah, kemudian dia ingin melihat Kanguru, maka Nisa harus berjalan sejauh 0,11 km.', TRUE),
(540, 135, 'D', 'Kandang Capybara merupakan kandang yang letaknya paling jauh dari gerbang kebun binatang.', FALSE),
(541, 136, 'A', '4 cm', FALSE),
(542, 136, 'B', '5 cm', FALSE),
(543, 136, 'C', '6 cm', TRUE),
(544, 136, 'D', '7 cm', FALSE),
(545, 137, 'A', '4 minggu', FALSE),
(546, 137, 'B', '6 minggu', FALSE),
(547, 137, 'C', '12 minggu', TRUE),
(548, 137, 'D', '18 minggu', FALSE),
(549, 138, 'A', '1', FALSE),
(550, 138, 'B', '1 1/4 (Link Gambar: https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/21541_907c5e9275f2a949ff19a0734b0ce73d.png)', TRUE),
(551, 138, 'C', '2', FALSE),
(552, 138, 'D', '2 1/4 (Link Gambar: https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/21541_2645b6283de281750a2772363bdf23b2.png)', FALSE),
(553, 139, 'A', '1/8 (Link Gambar: https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/57566_8c8f344169b622ed7f12b7bb9ac998c2.png)', FALSE),
(554, 139, 'B', '1/4 (Link Gambar: https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/57566_4c241b0ebd7e4719258715f91a8f5f3a.png)', TRUE),
(555, 139, 'C', '1/2 (Link Gambar: https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/57566_073c96b387453cf6c3a75752302c655b.png)', FALSE),
(556, 139, 'D', '3/4 (Link Gambar: https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/57566_553a4f740a7e508c0ea1af324c690683.png)', FALSE),
(557, 140, 'A', '58 m', FALSE),
(558, 140, 'B', '68 m', FALSE),
(559, 140, 'C', '72 m', TRUE),
(560, 140, 'D', '96 m', FALSE),
(561, 141, 'A', '8 dus', FALSE),
(562, 141, 'B', '10 dus', TRUE),
(563, 141, 'C', '12 dus', FALSE),
(564, 141, 'D', '24 dus', FALSE),
(565, 142, 'A', 'Andi', FALSE),
(566, 142, 'B', 'Beni', TRUE),
(567, 142, 'C', 'Citra', FALSE),
(568, 142, 'D', 'Dika', FALSE),
(569, 143, 'A', 'Persegi', TRUE),
(570, 143, 'B', 'Persegi panjang', FALSE),
(571, 143, 'C', 'Belah ketupat', FALSE),
(572, 143, 'D', 'Layang-layang', FALSE),
(573, 144, 'A', '09.45', FALSE),
(574, 144, 'B', '10.00', FALSE),
(575, 144, 'C', '10.05', TRUE),
(576, 144, 'D', '10.25', FALSE),
(577, 145, 'A', '9', FALSE),
(578, 145, 'B', '10', TRUE),
(579, 145, 'C', '12', FALSE),
(580, 145, 'D', '14', FALSE),
(581, 146, 'A', 'Terdapat 4 motor yang sudah keluar dari lahan parkir sebelum pukul 13.00.', TRUE),
(582, 146, 'B', 'Sebelum 12 motor memasuki lahan parkir, lahan parkir sudah terisi oleh 8 motor.', FALSE),
(583, 146, 'C', 'Pada pukul 13.00 lahan parkir terisi oleh 20 motor.', FALSE),
(584, 146, 'D', 'Luas total kedua petak lahan parkir motor pada denah tersebut adalah 40 meter persegi.', TRUE),
(585, 147, 'A', '34%', FALSE),
(586, 147, 'B', '50%', FALSE),
(587, 147, 'C', '66%', TRUE),
(588, 147, 'D', '75%', FALSE),
(589, 148, 'A', 'Danu sudah membaca 219 halaman.', TRUE),
(590, 148, 'B', 'Antok sudah membaca 170 halaman.', TRUE),
(591, 148, 'C', 'Caca sudah membaca 287 halaman.', FALSE),
(592, 148, 'D', 'Buku yang dibaca oleh Caca memiliki jumlah halaman paling banyak.', TRUE),
(593, 149, 'A', 'Daging sapi', TRUE),
(594, 149, 'B', 'Telur ayam', FALSE),
(595, 149, 'C', 'Ikan', TRUE),
(596, 149, 'D', 'Susu sapi', FALSE),
(597, 150, 'A', 'Ibu hamil dapat menambah konsumsi 50 gram ikan untuk memenuhi kebutuhan protein.', FALSE),
(598, 150, 'B', 'Ibu hamil dapat menambah konsumsi 50 gram keju untuk memenuhi kebutuhan lemak.', TRUE),
(599, 150, 'C', 'Ibu hamil dapat menambah konsumsi 50 gram daging sapi untuk memenuhi kebutuhan protein.', TRUE),
(600, 150, 'D', 'Kekurangan asupan lemak ibu hamil saat ini lebih sedikit daripada kekurangan asupan proteinnya.', FALSE),
(601, 151, 'A', 'Bani.', FALSE),
(602, 151, 'B', 'Ucil.', FALSE),
(603, 151, 'C', 'Rino.', FALSE),
(604, 151, 'D', 'Hari.', TRUE),
(605, 152, 'A', 'Para binatang di hutan tidak mampu melakukan sesuatu.', FALSE),
(606, 152, 'B', 'Semua binatang di hutan menahan untuk tidak berkomentar.', TRUE),
(607, 152, 'C', 'Penghuni hutan tidak mau mendengarkan pendapat orang lain.', FALSE),
(608, 152, 'D', 'Binatang-binatang di hutan tidak mengetahui masalah yang terjadi.', FALSE),
(609, 153, 'A', 'Tita memberi ide cemerlang yang dapat dilakukan oleh teman-teman di kelas.', FALSE),
(610, 153, 'B', 'Jani menghargai kepercayaan yang diberikan teman-teman sekelas kepada dirinya.', TRUE),
(611, 153, 'C', 'Nina bertanggung jawab dalam menjalankan tugas yang dipercayakan kepadanya.', TRUE),
(612, 153, 'D', 'Rudi mengabaikan ajakan musyawarah dari teman-teman kelompoknya.', FALSE),
(613, 154, 'A', 'Sapi.', FALSE),
(614, 154, 'B', 'Koala.', TRUE),
(615, 154, 'C', 'Panda.', TRUE),
(616, 154, 'D', 'Ulat daun.', TRUE),
(617, 155, 'A', '(Link: https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/11859_30d5a86f3ec182f4f016b58537f59b2a.png)', FALSE),
(618, 155, 'B', '(Link: https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/11859_bf36fb9bc0fcbb11330bde4a5ff318b8.png)', FALSE),
(619, 155, 'C', '(Link: https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/11859_28bb3025230f602ee069b342057523de.png)', FALSE),
(620, 155, 'D', '(Link: https://pusmendik.kemendikdasmen.go.id/tka/cbt_images/11859_ab76ff523441f11fa1efdd7fc398b468.png)', TRUE),
(621, 156, 'A', 'Jenis daun yang cocok untuk hewan folivora.', FALSE),
(622, 156, 'B', 'Pembagian hewan berdasarkan makanan mereka.', FALSE),
(623, 156, 'C', 'Cara khusus tubuh hewan folivora mencerna daun.', TRUE),
(624, 156, 'D', 'Peranan penting hutan bagi kehidupan hewan folivora.', FALSE),
(625, 157, 'A', 'Makhluk itu sangat sombong.', FALSE),
(626, 157, 'B', 'Anak lembu tidak jahat.', TRUE),
(627, 157, 'C', 'Lembu tidak makan katak.', TRUE),
(628, 157, 'D', 'Anak lembu hanya memakan rumput di tepi rawa.', TRUE),
(629, 158, 'A', 'Kenthus hendak ditelan anak lembu di padang rumput.', FALSE),
(630, 158, 'B', 'Kenthus berlari ke tepi kolam hingga terengah-engah.', TRUE),
(631, 158, 'C', 'Kenthus mengembang terlalu besar hingga jatuh lemas.', FALSE),
(632, 158, 'D', 'Kenthus dimarahi Koko karena terlalu menggebu-gebu.', FALSE),
(633, 159, 'A', 'Terharu karena Kenthus mau mengakui kesalahannya.', FALSE),
(634, 159, 'B', 'Bahagia karena Kenthus berbaikan dengan anak lembu.', FALSE),
(635, 159, 'C', 'Antusias karena Kenthus bisa membuktikan kekuatannya.', FALSE),
(636, 159, 'D', 'Prihatin karena kesombongan Kenthus berujung pada celaka bagi dirinya sendiri.', TRUE),
(637, 160, 'A', 'membuat orang terus waspada dalam bekerja', TRUE),
(638, 160, 'B', 'menyebabkan orang kehilangan fokus saat bekerja', FALSE),
(639, 160, 'C', 'membuat suasana menjadi serius dan penuh ketakutan', FALSE),
(640, 160, 'D', 'menimbulkan rasa khawatir karena situasi yang genting', FALSE),
(641, 161, 'A', 'Kode komputer mengantar para manusia ke bulan dan Venus.', FALSE),
(642, 161, 'B', 'Kode komputer dibahas dalam rapat setelah misi utama selesai.', TRUE),
(643, 161, 'C', 'Kode komputer membuat astronaut dapat mendarat dengan aman.', FALSE),
(644, 161, 'D', 'Kode komputer mengirim pesan kesalahan saat proses pendaratan.', FALSE),
(645, 162, 'A', 'Ketelitian bekerja sangat penting agar tidak terjadi kesalahan.', TRUE),
(646, 162, 'B', 'Bekerja di proyek luar angkasa dapat memotivasi orang lain', FALSE),
(647, 162, 'C', 'Tanggung jawab terhadap tugas membuat seseorang tetap fokus.', TRUE),
(648, 162, 'D', 'Keberanian mencoba hal baru dan pantang menyerah saat menghadapi kendala rumit.', TRUE),
(649, 163, 'A', 'mainan plastik', TRUE),
(650, 163, 'B', 'cat semprot', FALSE),
(651, 163, 'C', 'magnet', FALSE),
(652, 163, 'D', 'gunting', FALSE),
(653, 164, 'A', 'membuat permukaan mainan tertutup rapi', TRUE),
(654, 164, 'B', 'memudahkan anak mewarnai mainan hewan', FALSE),
(655, 164, 'C', 'menutup lubang agar magnet bisa menempel', TRUE),
(656, 164, 'D', 'memperkuat sambungan kardus agar tidak mudah terlepas', TRUE),
(657, 165, 'A', 'Supaya ukuran mainan lebih besar dan menarik.', FALSE),
(658, 165, 'B', 'Agar mainan bisa menempel di permukaan kulkas.', FALSE),
(659, 165, 'C', 'Karena mainan perlu diwarnai menggunakan cat semprot.', TRUE),
(660, 165, 'D', 'Untuk memudahkan pemberian lem tembak pada mainan.', FALSE),
(661, 166, 'A', 'Menjaga tekanan darah normal.', FALSE),
(662, 166, 'B', 'Meningkatkan fungsi jantung.', TRUE),
(663, 166, 'C', 'Membantu mencegah dehidrasi.', FALSE),
(664, 166, 'D', 'Mempermudah sistem metabolisme tubuh.', FALSE),
(665, 167, 'A', 'Sumber air putih mudah ditemukan.', FALSE),
(666, 167, 'B', 'Kandungan air putih sangat banyak.', FALSE),
(667, 167, 'C', 'Pengolahan air putih melalui proses alami.', TRUE),
(668, 167, 'D', 'Kandungan pH dalam air putih lebih tinggi.', FALSE),
(669, 168, 'A', 'Menekankan pokok utama yang ingin disampaikan dalam infografis.', TRUE),
(670, 168, 'B', 'Menonjolkan informasi penting yang sedang dibahas dalam infografis.', TRUE),
(671, 168, 'C', 'Menyesuaikan warna yang mungkin akan disukai pembaca infografis.', FALSE),
(672, 168, 'D', 'Membantu pembaca membedakan perbandingan antara air putih dan air mineral secara cepat.', TRUE),
(673, 169, 'A', 'Tia.', TRUE),
(674, 169, 'B', 'Devi.', FALSE),
(675, 169, 'C', 'Kasir.', FALSE),
(676, 169, 'D', 'Pak Satpam.', FALSE),
(677, 170, 'A', 'Mencari dan membeli buku bersama Devi.', TRUE),
(678, 170, 'B', 'Dinasihati oleh seorang ibu untuk antre.', FALSE),
(679, 170, 'C', 'Ikut menegur pemuda yang menyerobot antrean.', TRUE),
(680, 170, 'D', 'Mengingatkan pemuda agar malu melihat seorang ibu yang tetap sabar mengantre.', TRUE),
(681, 171, 'A', 'Semua orang yang mengantre juga ingin cepat dilayani.', TRUE),
(682, 171, 'B', 'Mengantre membutuhkan kesabaran setiap orang.', FALSE),
(683, 171, 'C', 'Aturan antrean harus dihormati oleh semua orang.', TRUE),
(684, 171, 'D', 'Mendahulukan orang yang membeli barang sedikit adalah hak istimewa yang wajar.', FALSE),
(685, 172, 'A', 'Rusaknya enamel pada gigi.', FALSE),
(686, 172, 'B', 'Enamel gigi tidak sekuat tulang.', TRUE),
(687, 172, 'C', 'Pembuluh darah dan saraf sensitif.', FALSE),
(688, 172, 'D', 'Bakteri melepaskan zat asam pada gigi.', FALSE),
(689, 173, 'A', 'Gigi akan menjadi rusak dan bolong.', TRUE),
(690, 173, 'B', 'Gigi akan mengunyah makanan lebih lama.', FALSE),
(691, 173, 'C', 'Gigi akan ditumbuhi oleh bakteri sisa makanan.', TRUE),
(692, 173, 'D', 'Terjadinya penumpukan plak dan peradangan pada gusi.', TRUE),
(693, 174, 'A', 'Mempermudah melihat perbedaan kondisi gigi tiap orang.', FALSE),
(694, 174, 'B', 'Menunjukkan lapisan-lapisan gigi yang sedang dijelaskan.', TRUE),
(695, 174, 'C', 'Menggambarkan bentuk dan fungsi dari setiap gigi manusia.', FALSE),
(696, 174, 'D', 'Menunjukkan posisi bagian email, dentin, dan saraf gigi secara berurutan.', TRUE),
(697, 175, 'A', 'Senyum itu enggan lepas dari bibirmu.', TRUE),
(698, 175, 'B', 'Uluran tanganmu menyambutku.', TRUE),
(699, 175, 'C', 'Maafmu selalu terbuka untukku.', FALSE),
(700, 175, 'D', 'Kuingat kembali tawa riang kita di bawah pohon rindang.', TRUE),
(701, 176, 'A', 'Simbol penerimaan, dukungan, dan rasa aman dalam persahabatan.', FALSE),
(702, 176, 'B', 'Ungkapan kebahagiaan saat bertemu seseorang yang lama tidak bertemu.', FALSE),
(703, 176, 'C', 'Penghargaan dan rasa syukur sebagai hal yang berkesan dalam persahabatan.', TRUE),
(704, 176, 'D', 'Lambang hubungan abadi, tetap kuat meski waktu atau jarak memisahkan.', FALSE),
(705, 177, 'A', 'Persahabatan membuat seseorang harus mengalah demi menjaga hubungan.', TRUE),
(706, 177, 'B', 'Persahabatan harus selalu diutamakan di atas hubungan dengan keluarga.', FALSE),
(707, 177, 'C', 'Persahabatan membutuhkan pengertian, kesetiaan, dan saling menghargai.', FALSE),
(708, 177, 'D', 'Persahabatan sering diuji oleh konflik sehingga tidak selalu bertahan.', FALSE),
(709, 178, 'A', 'Rengginang.', FALSE),
(710, 178, 'B', 'Melarat.', FALSE),
(711, 178, 'C', 'Rambak.', TRUE),
(712, 178, 'D', 'Gendar.', FALSE),
(713, 179, 'A', 'Memiliki nilai jual ke luar negeri hingga puluhan juta dolar.', TRUE),
(714, 179, 'B', 'Sudah ada di Indonesia sejak abad ke-9 dan ke-10.', FALSE),
(715, 179, 'C', 'Dikirim ke luar negeri lebih dari 20 juta kilogram.', TRUE),
(716, 179, 'D', 'Negara-negara di berbagai benua menjadi tujuan ekspor kerupuk Indonesia.', TRUE),
(717, 180, 'A', 'Menggambarkan aneka ragam kerupuk yang terdapat di Indonesia.', TRUE),
(718, 180, 'B', 'Menginformasikan macam-macam kerupuk yang dikenal di Indonesia.', TRUE),
(719, 180, 'C', 'Memberikan informasi tentang bahan-bahan kerupuk di Indonesia.', FALSE),
(720, 180, 'D', 'Membantu pembaca mengenali bentuk fisik aneka jenis kerupuk nusantara.', TRUE)
ON DUPLICATE KEY UPDATE `question_id` = VALUES(`question_id`), `option_label` = VALUES(`option_label`), `option_text` = VALUES(`option_text`), `is_correct` = VALUES(`is_correct`);

-- -----------------------------------------------------------------------------
-- 4. PEMBENIHAN PEMBAHASAN NALAR KONSEPTUAL (QUESTION_EXPLANATIONS - 60 Pembahasan)
-- -----------------------------------------------------------------------------
INSERT INTO `question_explanations` (`id`, `question_id`, `explanation_text`, `reasoning_guide`, `reference_url`) VALUES
(121, 121, 'Untuk menyelesaikan soal operasi campuran ini, ingat prinsip urutan hitung: selesaikan perkalian terlebih dahulu sebelum penjumlahan dan pengurangan.
Mula-mula kita hitung perkaliannya:
2×0,75=1,5=3/2
Selanjutnya, kita ubah seluruh bilangan ke bentuk pecahan biasa: - Bentuk persen: 120%=120/100=6/5 - Bilangan bulat: 3=3/1 - Hasil kali tadi: 1,5=3/2 - Pecahan biasa: 2/3
Persamaannya menjadi:
6/5−3/1+3/2+2/3
Sekarang kita samakan penyebutnya menggunakan KPK dari 5, 1, 2, dan 3, yaitu 30:
36/30−90/30+45/30+20/30
Tinggal kita hitung berurutan dari kiri ke kanan:
36−90+45+20/30=−54+45+20/30=−9+20/30=11/30
Jadi, jawaban yang tepat adalah A (11/30).', NULL, NULL),
(122, 122, 'Mari kita cari harga masing-masing buku sebelum diskon: - Harga buku komik sudah diketahui: Rp24.000,00. - Harga buku gambar adalah 1/2 dari harga komik: 1/2×Rp24.000,00=Rp12.000,00. - Harga buku tulis adalah 0,75 kali harga komik: 0,75×Rp24.000,00=3/4×Rp24.000,00=Rp18.000,00.
Total harga buku gambar dan buku tulis sebelum diskon:
Total=Rp12.000,00+Rp18.000,00=Rp30.000,00
Karena toko memberikan diskon sebesar 10%, maka pembeli hanya perlu membayar 90% dari harga total:
Harga setelah diskon=90%×Rp30.000,00=90/100×Rp30.000,00=Rp27.000,00
Jadi, harga buku gambar dan buku tulis setelah diskon adalah Rp27.000,00 (Pilihan C).', NULL, NULL),
(123, 123, 'Yuk, kita bedah satu per satu data produksi susu kedelai Pak Bondan:
Total produksi susu kedelai: Pak Bondan punya 7 wadah, masing-masing berisi 6 1/4 liter.
Total=7×6 1/4=7×25/4=175/4=43 3/4 liter
Jadi, Pernyataan A Benar.
Isi botol besar dan botol kecil: Diketahui isi 1 botol kecil (K) adalah setengah dari botol besar (B), artinya K=1/2B atau B=2K. Seluruh susu (43 3/4 liter) dituangkan ke 50 botol besar dan 15 botol kecil:
50B+151/2B=175/4
50B+7,5B=57,5B=115/2B=175/4
B=175/4×2/115=350/460=35/46 liter
Maka, setiap botol besar memang berisi 35/46 liter. Jadi, Pernyataan B Benar.
Total susu dalam botol kecil: Isi 1 botol kecil adalah K=1/2×35/46=35/92 liter. Untuk 15 botol kecil:
Total=15×35/92=525/92 liter
Pada pernyataan C tertulis 525/46 liter (penyebutnya keliru). Jadi, Pernyataan C Salah.
Perbandingan isi botol (Pernyataan D): Karena 1 botol kecil adalah setengah dari botol besar, maka isi 1 botol besar jelas setara dengan 2 botol kecil (B=2K). Jadi, Pernyataan D Benar.', NULL, NULL),
(124, 124, 'Ingat aturan baku pada dadu bersisi enam: jumlah titik pada dua sisi yang saling berlawanan (berhadapan) selalu sama dengan 7. - Sisi 1 berlawanan dengan sisi 6 (1+6=7) - Sisi 2 berlawanan dengan sisi 5 (2+5=7) - Sisi 3 berlawanan dengan sisi 4 (3+4=7)
Pada gambar lemparan Mae, sisi bagian atas dadu menunjukkan 4 titik. Karena sisi bawah berhadapan langsung dengan sisi atas:
Banyak titik sisi bawah=7−4=3 titik
Jadi, banyak titik pada sisi bawah dadu Mae adalah 3 (Pilihan B).', NULL, NULL),
(125, 125, 'Supaya mudah membandingkan berat sembako, mari kita ubah semua satuan ke dalam gram: - Beras: 3 kg=3×1.000=3.000 gram - Gula pasir: 2 bungkus @ 5 hg=10 hg=1.000 gram (artinya 1 bungkus gula berbobot 500 gram) - Mi instan: 5 bungkus @ 85 g=425 gram
Sekarang kita periksa setiap pernyataan: - Pernyataan A: Berat total =3.000+1.000+425=4.425 gram. Ini persis sesuai hitungan kita, jadi Pernyataan A Benar. - Pernyataan B: Berat seluruh mi instan adalah 425 gram=0,425 kg. Karena 0,425<0,5, berat mi instan tidak melebihi 0,5 kg. Jadi Pernyataan B Salah. - Pernyataan C: Satu bungkus gula beratnya 500 gram, sedangkan seluruh mi instan beratnya 425 gram. Jelas 500 g>425 g, sehingga Pernyataan C Benar. - Pernyataan D: Beras memiliki berat 3.000 gram, jauh lebih berat daripada gula (1.000 gram) maupun mi instan (425 gram). Jadi, Pernyataan D Benar.', NULL, NULL),
(126, 126, 'Mari kita cermati diagram garis jumlah pengunjung perpustakaan: - Senin: 20 siswa - Selasa: 25 siswa - Rabu: 35 siswa - Kamis: 30 siswa - Jumat: 20 siswa
Uji setiap pernyataan: - Pernyataan A (Benar): Titik tertinggi pada diagram berada pada hari Rabu dengan 35 siswa, sehingga hari Rabu merupakan hari dengan pengunjung terbanyak. - Pernyataan B (Salah): Dari hari Selasa (25 siswa) ke hari Rabu (35 siswa) grafiknya naik, artinya terjadi kenaikan jumlah pengunjung, bukan penurunan. - Pernyataan C (Benar): Pada hari Senin ada 20 siswa dan hari Jumat juga ada 20 siswa, jadi jumlahnya sama banyak. - Pernyataan D (Benar): Total pengunjung selama lima hari adalah 20+25+35+30+20=130 siswa. Karena 130>100, pernyataan ini benar.', NULL, NULL),
(127, 127, 'Ingat petunjuk piktogram: 1 simbol buku mewakili 2 buku. Mari kita hitung buku yang dibaca masing-masing siswa: - Rina: 5 simbol →5×2=10 buku - Dika: 4 simbol →4×2=8 buku - Siti: 3 simbol →3×2=6 buku - Budi: 2 simbol →2×2=4 buku
Mari kita cek pernyataannya: - Pernyataan A (Benar): Rina membaca 10 buku, paling banyak dibanding teman-temannya. - Pernyataan B (Benar): Selisih buku Rina dan Budi adalah 10−4=6 buku. - Pernyataan C (Salah): Buku Dika dan Siti jika dijumlahkan adalah 8+6=14 buku. Jumlah ini tidak sama dengan buku Rina (10 buku). - Pernyataan D (Benar): Jumlah seluruh buku adalah 10+8+6+4=28 buku.', NULL, NULL),
(128, 128, 'Pak Burhan memiliki lahan seluas 4,8 hektar dan membaginya untuk tiga keperluan: 1. Kolam ikan lele: 1/6 bagian →1/6×4,8=0,8 hektar. 2. Kolam ikan nila: 25% bagian →25/100×4,8=0,25×4,8=1,2 hektar. 3. Kebun sayur: sisa dari seluruh lahan.
Untuk mencari luas kebun sayur, kita kurangkan luas total lahan dengan luas kedua kolam:
Luas kebun sayur=4,8−(0,8+1,2)=4,8−2,0=2,80 hektar
Jadi, luas kebun sayur Pak Burhan adalah 2,80 hektar (Pilihan D).', NULL, NULL),
(129, 129, 'Mari kita cari harga 1 buah pulpen dan 1 buah pensil: - Harga Pulpen: Pak Deni membeli 1 lusin (12 buah) pulpen seharga Rp36.000,00.
Harga 1 pulpen=Rp36.000,00/12=Rp3.000,00
- Harga Pensil: Pak Deni membeli 8 buah pensil seharga Rp16.000,00.
Harga 1 pensil=Rp16.000,00/8=Rp2.000,00
Sekarang kita bandingkan harga keduanya:
Perbandingan pulpen : pensil=Rp3.000,00:Rp2.000,00=3:2
Jadi, rasio harga pulpen terhadap pensil adalah 3 : 2 (Pilihan B).', NULL, NULL),
(130, 130, 'Kita hitung dulu berapa lama perjalanan Pak Bayu: - Jarak tempuh: 120 km - Kecepatan rata-rata: 60 km/jam
Waktu berkendara=Jarak/Kecepatan=120/60=2 jam
Karena di perjalanan sempat istirahat selama 15 menit, maka total durasi perjalanan menjadi:
Total waktu=2 jam+15 menit=2 jam 15 menit
Pak Bayu berangkat pukul 07.30. Maka waktu kedatangannya adalah:
07.30+02.15=09.45
Jadi, Pak Bayu dan keluarga tiba di Semarang pada pukul 09.45 (Pilihan B).', NULL, NULL),
(131, 131, 'Kita cari tahu berapa lama jarak dari tanggal 30 April sampai 14 Juni: - Hari di bulan Mei yang dilewati: bulan Mei punya 31 hari penuh →31 hari. - Hari di bulan Juni sampai tanggal ulang tahun: 14 hari →14 hari. - Total hari tunggu: 31+14=45 hari.
Uji setiap pernyataan: - Pernyataan A (Benar): Lala memang harus menunggu 45 hari lagi. - Pernyataan B (Benar): Kita ubah 45 hari ke minggu: 45:7=6 sisa 3 hari. Jadi tepat 6 minggu dan 3 hari. - Pernyataan C (Salah): Dua bulan penuh biasanya sekitar 60–61 hari, padahal Lala hanya menunggu 45 hari (kurang dari 2 bulan). - Pernyataan D (Benar): Dari tanggal 31 Mei menuju 14 Juni tersisa tepat 14 hari lagi.', NULL, NULL),
(132, 132, 'Pekerja membuat pondasi berbentuk segitiga siku-siku dengan panjang sisi tegak 6 m dan sisi mendatar 8 m. Pertama, kita hitung sisi miring segitiga menggunakan rumus Pythagoras:
Sisi miring=sqrt(6^{2}+8^{2})=sqrt(36+64)=sqrt(100)=10 meter
Keliling satu buah pondasi segitiga adalah:
Keliling=6+8+10=24 meter
Karena kawat dipasang mengelilingi pondasi sebanyak 3 putaran, maka total panjang kawat yang dibutuhkan:
Panjang kawat=3×24 m=72 meter
Jadi, panjang kawat yang dibutuhkan adalah 72 meter (Pilihan B).', NULL, NULL),
(133, 133, 'Kita samakan dulu satuan volumenya: - Tangki air berisi 0,8 hektoliter (hl). Karena 1 hl=100 liter, maka isi tangki =0,8×100=80 liter. - Bak penampungan muat 20 liter.
Mari kita uji setiap pernyataan: - Pernyataan A (Benar): Isi air dalam tangki memang tepat 80 liter. - Pernyataan B (Salah): Untuk mengosongkan tangki berkapasitas 80 liter dengan bak 20 liter, pengisian yang dilakukan adalah 80:20=4 kali, bukan 5 kali. - Pernyataan C (Benar): Kebutuhan 10 baris tanaman cabai adalah 10×40 dl=400 dl=40 liter. Karena 40 liter adalah persis setengah dari 80 liter, volume air tangki memang berkurang setengahnya. - Pernyataan D (Salah): Bak penampungan berisi 20 liter=20×10=200 desiliter (dl), bukan 2.000 dl.', NULL, NULL),
(134, 134, 'Karena 1 kubus satuan berukuran 1 cm×1 cm×1 cm=1 cm^{3}, maka kotak yang dicari harus memiliki volume tepat 64 cm^{3} agar muat 64 kubus satuan.
Mari kita hitung volume masing-masing kotak: - Kotak A: 8 cm×2 cm×4 cm=64 cm^{3} (Tepat muat 64 kubus satuan) → Benar. - Kotak B: 4 cm×4 cm×4 cm=64 cm^{3} (Tepat muat 64 kubus satuan) → Benar. - Kotak C: 4 cm×3 cm×5 cm=60 cm^{3} (Hanya muat 60 kubus satuan) → Salah. - Kotak D: 16 cm×2 cm×2 cm=64 cm^{3} (Tepat muat 64 kubus satuan) → Benar.
Jadi, kotak yang dapat dibawa Doni adalah kotak A, B, dan D.', NULL, NULL),
(135, 135, 'Perhatikan petunjuk arah dan jarak dari gerbang kebun binatang: - Arah Barat (kiri): Jerapah (75 m), Zebra (60 m). - Arah Timur (kanan): Capybara (50 m), Kanguru (35 m).
Mari kita uji setiap pernyataan: - Pernyataan A (Salah): Jarak kandang Zebra adalah 60 m=60×1.000=60.000 mm, bukan 6.000 mm. - Pernyataan B (Benar): Capybara (50 m) dan Kanguru (35 m) berada di arah yang sama (Timur). Selisih jaraknya =50−35=15 m=1.500 cm. - Pernyataan C (Benar): Dari kandang Jerapah (75 m Barat) ke kandang Kanguru (35 m Timur), Nisa harus berjalan kembali melewati gerbang: 75+35=110 m=0,11 km. - Pernyataan D (Salah): Kandang yang paling jauh dari gerbang adalah kandang Jerapah (75 m), bukan Capybara (50 m).', NULL, NULL),
(136, 136, 'Siti ingin membungkus kotak kado berbentuk balok dengan kertas kado. Ukuran kotak kado: panjang p=20 cm, lebar l=15 cm, dan tinggi t=10 cm.
Luas kertas kado minimal yang dibutuhkan sama dengan luas permukaan balok:
Luas Permukaan=2×(p×l+p×t+l×t)
Luas Permukaan=2×(20×15+20×10+15×10)
Luas Permukaan=2×(300+200+150)=2×650=1.300 cm^{2}
Jadi, luas kertas kado yang dibutuhkan Siti adalah 1.300 cm² (Pilihan C).', NULL, NULL),
(137, 137, 'Sebuah drum minyak berbentuk tabung memiliki jari-jari alas r=35 cm dan tinggi t=100 cm. Rumus volume tabung adalah V=πr^{2}t. Dengan π=22/7:
V=22/7×35×35×100
V=22×5×35×100=110×3.500=385.000 cm^{3}
Ingat konversi satuan: 1 liter=1 dm^{3}=1.000 cm^{3}. Maka volume drum dalam liter adalah:
Volume=385.000/1.000=385 liter
Jadi, volume minyak di dalam drum tersebut adalah 385 liter (Pilihan C).', NULL, NULL),
(138, 138, 'Mari kita sederhanakan nilai a dan nilai b terlebih dahulu: - Nilai a:
a=5−7/2=10/2−7/2=3/2
- Nilai b:
b=2−15/8=16/8−15/8=1/8
Yang ditanyakan pada soal adalah nilai dari a−2b:
a−2b=3/2−21/8=3/2−2/8=3/2−1/4
Samakan penyebutnya ke 4:
a−2b=6/4−1/4=5/4=1 1/4
Jadi, hasil akhirnya adalah 1 1/4 (Pilihan B).', NULL, NULL),
(139, 139, 'Perhatikan gambar potongan kue ulang tahun Desti: - Keseluruhan kue dipotong menjadi 8 bagian sama besar (masing-masing bernilai 1/8). - Dari 8 bagian tersebut, terdapat 2 bagian yang berwarna cokelat.
Maka pecahan yang menunjukkan bagian kue cokelat dari keseluruhan kue adalah:
2/8
Jika kita sederhanakan dengan membagi pembilang dan penyebut dengan 2:
2:2/8:2=1/4
Jadi, kue berwarna cokelat adalah 1/4 bagian dari keseluruhan kue (Pilihan B).', NULL, NULL),
(140, 140, 'Keliling bangun datar adalah jumlah seluruh panjang sisi terluar yang membatasinya. Mari kita telusuri sisi-sisi luar bidang tanah Pak Boni: - Sisi atas mendatar =12 m - Sisi kanan tegak =8 m - Sisi bawah mendatar =16 m - Sisi tegak kiri dan sisi lekukan dalam (total tinggi =8 m dan selisih panjang =16−12=4 m)
Menjumlahkan seluruh keliling luar:
Keliling=12+8+16+4+4+4=48 meter
Jadi, keliling bidang tanah Pak Boni adalah 48 meter (Pilihan C).', NULL, NULL),
(141, 141, 'Mari kita hitung rata-rata nilai matematika 5 siswa: Data nilai: 75, 80, 85, 90, 70.
Rata-rata=75+80+85+90+70/5=400/5=80
Siswa yang mendapatkan nilai di atas rata-rata (nilai > 80) adalah: 1. Siswa dengan nilai 85 2. Siswa dengan nilai 90
Nilai 80 tidak dihitung karena sama dengan rata-rata, bukan di atas rata-rata. Jadi, ada 2 siswa yang nilainya di atas rata-rata (Pilihan B).', NULL, NULL),
(142, 142, 'Pak Arman memiliki sepetak sawah berbentuk persegi panjang dengan perbandingan panjang dan lebar 5:3. Jika lebarnya adalah 18 meter, kita dapat mencari panjangnya:
Panjang=5/3×18 m=30 meter
Luas sawah Pak Arman:
Luas=Panjang×Lebar=30 m×18 m=540 m^{2}
Jadi, luas sawah Pak Arman adalah 540 m² (Pilihan B).', NULL, NULL),
(143, 143, 'Sebuah bak mandi berbentuk kubus memiliki volume 512 liter. Ingat bahwa 1 liter=1 dm^{3}, maka volume bak =512 dm^{3}.
Karena volume kubus adalah V=s^{3}, kita cari panjang rusuk dalamnya:
s=sqrt[3](512)=8 dm
Ubahlah satuan desimeter ke sentimeter (1 dm=10 cm):
s=8×10=80 cm
Jadi, kedalaman bak mandi tersebut adalah 80 cm (Pilihan A).', NULL, NULL),
(144, 144, 'Data berat badan (dalam kg) dari 9 anak adalah: 32,35,30,34,36,32,33,32,35.
Modus adalah nilai data yang paling sering muncul (frekuensi terbanyak): - Berat 30 kg muncul 1 kali - Berat 32 kg muncul 3 kali - Berat 33 kg muncul 1 kali - Berat 34 kg muncul 1 kali - Berat 35 kg muncul 2 kali - Berat 36 kg muncul 1 kali
Karena angka 32 muncul paling sering (3 kali), maka modusnya adalah 32 kg (Pilihan C).', NULL, NULL),
(145, 145, 'Berdasarkan denah taman kota, kita perhatikan petak lahan parkir motor: - Ukuran 1 petak parkir motor =10 m×2 m=20 m^{2}. - Karena di taman kota tersedia 2 petak parkir motor, maka luas keseluruhan =20+20=40 m^{2}. - Setiap motor membutuhkan area seluas 2 m^{2}.
Maka kapasitas daya tampung maksimal parkir motor adalah:
Kapasitas=40 m^{2}/2 m^{2}/motor=20 motor
Jadi, lahan parkir motor tersebut dapat menampung paling banyak 20 motor (Pilihan B).', NULL, NULL),
(146, 146, 'Mari kita amati denah taman kota: - Terdapat 2 petak parkir motor berukuran 10 m×2 m=20 m^{2} per petak. - Luas total lahan parkir motor =20+20=40 m^{2}. - Karena 1 motor butuh 2 m^{2}, maka kapasitas maksimum adalah 40:2=20 motor.
Uji setiap pernyataan: - Pernyataan A (Benar): Lahan parkir sempat terisi penuh (20 motor). Saat 12 motor baru masuk, hanya ada 4 motor yang keluar sebelum pukul 13.00 sehingga menyisakan tempat yang pas. - Pernyataan B (Salah): Sebelum 12 motor masuk, sisa motor yang ada adalah 8 motor (bukan lahan baru terisi 8). - Pernyataan C (Salah): Pada pukul 13.00 kondisi parkir tidak terisi 20 motor penuh melainkan berkurang karena pergerakan keluar-masuk kendaraan. - Pernyataan D (Benar): Luas total kedua petak lahan parkir adalah 20 m^{2}+20 m^{2}=40 m^{2}.', NULL, NULL),
(147, 147, 'Pada denah area rekreasi keluarga, terdapat dua kolam renang anak berbentuk lingkaran dengan diameter 7 meter. Luas satu kolam lingkaran dengan jari-jari r=3,5 m=7/2 m:
Luas 1 kolam=πr^{2}=22/7×7/2×7/2=77/2=38,5 m^{2}
Karena ada dua kolam renang anak yang identik:
Luas total 2 kolam=2×38,5=77 m^{2}
Jadi, luas total kedua kolam renang anak tersebut adalah 77 m² (Pilihan C).', NULL, NULL),
(148, 148, 'Mari kita hitung halaman buku yang sudah dibaca oleh masing-masing anak: - Danu (Buku Biru - 329 halaman): Membaca 2/3 bagian →2/3×329≈219 halaman. - Antok (Buku Hijau - 340 halaman): Membaca 50% bagian →0,5×340=170 halaman. - Caca (Buku Merah - 382 halaman): Membaca 3/4 bagian →3/4×382=286,5 halaman (atau sekitar 286 halaman, bukan 287 halaman utuh).
Uji setiap pernyataan: - Pernyataan A (Benar): Danu memang sudah membaca sekitar 219 halaman. - Pernyataan B (Benar): Antok sudah membaca tepat 170 halaman. - Pernyataan C (Salah): Caca membaca 286,5 halaman, bukan 287 halaman. - Pernyataan D (Benar): Buku Merah yang dibaca Caca memiliki 382 halaman, paling tebal di antara Buku Hijau (340 halaman) dan Buku Biru (329 halaman).', NULL, NULL),
(149, 149, 'Anak usia 10–12 tahun memerlukan asupan protein minimal 55 gram per hari. Pada grafik, disajikan kandungan protein per 100 gram makanan: - Daging sapi =26 gram - Telur ayam =13 gram - Ikan =22 gram - Susu sapi =3,2 gram
Jika porsi makanan yang disediakan adalah 250 gram, faktor pengalinya adalah 250/100=2,5. Mari kita hitung protein untuk porsi 250 gram: - A. Daging Sapi: 2,5×26 g=65 gram (Memenuhi, karena 65≥55). - B. Telur Ayam: 2,5×13 g=32,5 gram (Tidak memenuhi, karena 32,5<55). - C. Ikan: 2,5×22 g=55 gram (Memenuhi, pas 55 gram). - D. Susu Sapi: 2,5×3,2 g=8 gram (Sangat kurang dari 55 gram).
Jadi, makanan yang dapat mencukupi kebutuhan protein minimal harian dalam satu porsi adalah Daging sapi (A) dan Ikan (C).', NULL, NULL),
(150, 150, 'Mari kita lihat target kebutuhan gizi harian ibu hamil: - Protein: 70 sampai 100 gram - Lemak: 62 sampai 67 gram
Konsumsi saat ini (dari diagram): - Protein baru tercukupi: 58 gram (masih kurang minimal 70−58=12 gram). - Lemak baru tercukupi: 46 gram (masih kurang minimal 62−46=16 gram).
Jika ibu hamil menambah 50 gram makanan (artinya dikali 0,5 dari data grafik per 100 g): - Pernyataan A (Salah): Tambah 50 g ikan → protein bertambah 0,5×22=11 g. Total protein =58+11=69 g. Karena 69<70, kebutuhan minimal belum terpenuhi. - Pernyataan B (Benar): Tambah 50 g keju → lemak bertambah 0,5×33=16,5 g. Total lemak =46+16,5=62,5 g. Nilai ini pas berada di rentang ideal (62−67 g). - Pernyataan C (Benar): Tambah 50 g daging sapi → protein bertambah 0,5×26=13 g. Total protein =58+13=71 g. Nilai ini sudah masuk batas aman minimal (70−100 g). - Pernyataan D (Salah): Kekurangan lemak adalah 16 gram, sedangkan kekurangan protein adalah 12 gram. Jadi kekurangan lemak justru lebih banyak, bukan lebih sedikit.', NULL, NULL),
(151, 151, 'Jawaban yang tepat adalah D (Hari).
Pada fabel “Danau untuk Semua” paragraf ketiga, diceritakan bahwa para penghuni hutan merasa cemas dan kesal karena air danau menjadi kotor akibat ulah Rino si badak yang berendam seharian. Saat semua binatang berkumpul untuk bermusyawarah, Hari si harimau mengusulkan ide untuk meminta pertolongan kepada Ucil si kancil yang cerdik.
Pilihan lainnya kurang tepat: - A (Bani) adalah kelinci yang hanya mengeluhkan kondisi danau. - B (Ucil) adalah tokoh yang dimintai bantuan, bukan yang mengusulkan. - C (Rino) adalah badak yang menjadi sumber masalah di danau.', NULL, NULL),
(152, 152, 'Jawaban yang tepat adalah B.
Dalam wacana terdapat kalimat: “Namun, mereka takut menegur Rino karena badannya besar dan bercula. Mereka diam seribu bahasa.”
Ungkapan diam seribu bahasa adalah ungkapan kiasan bahasa Indonesia yang menggambarkan situasi seseorang yang sama sekali tidak berbicara atau menahan diri untuk tidak mengeluarkan sepatah kata pun, biasanya karena merasa takut, segan, atau terkejut. Pada cerita ini, para binatang memilih bungkam dan tidak berani menegur Rino secara langsung.', NULL, NULL),
(153, 153, 'Dalam cerita “Danau untuk Semua”, Ucil si kancil diberi amanah dan kepercayaan oleh seluruh binatang di hutan untuk menyelesaikan persoalan danau yang kotor. Ucil menyambut kepercayaan itu dengan penuh tanggung jawab dan kecerdikan.
Mari kita cocokkan dengan peristiwa sehari-hari: - Pernyataan A (Tidak Sesuai): Tita yang memberi ide mencerminkan tokoh Hari si harimau (yang mengusulkan meminta bantuan Ucil), bukan mencerminkan peran Ucil. - Pernyataan B (Sesuai): Jani menghargai kepercayaan teman-temannya mencerminkan sikap Ucil yang mau menerima tugas dari warga hutan. - Pernyataan C (Sesuai): Nina bertanggung jawab menyelesaikan tugas mencerminkan Ucil yang berhasil menuntaskan misinya berbicara dengan Rino. - Pernyataan D (Tidak Sesuai): Mengabaikan musyawarah bertolak belakang dengan nilai kebersamaan dan musyawarah yang dijunjung tinggi oleh para binatang dalam cerita.', NULL, NULL),
(154, 154, 'Berdasarkan teks “Hewan Pemakan Daun, Apa Itu?”, hewan folivora adalah kelompok hewan herbivora yang secara khusus mengonsumsi dedaunan sebagai makanan utamanya.
Mari kita periksa pilihannya: - A (Sapi): Kurang tepat, sapi tergolong hewan pemakan rumput (grazer), bukan pemakan daun khusus (folivora). - B (Koala): Tepat, koala adalah contoh utama hewan folivora yang memakan daun eukaliptus. - C (Panda): Tepat, panda secara khusus memakan daun dan tunas bambu. - D (Ulat daun): Tepat, ulat daun secara khusus memakan daun tanaman hingga bermetamorfosis.
Jadi, contoh hewan folivora yang tepat adalah B, C, dan D.', NULL, NULL),
(155, 155, 'Jawaban yang tepat adalah D.
Mari kita cermati struktur alur wacana “Hewan Pemakan Daun, Apa Itu?” dari awal sampai akhir: 1. Paragraf 1: Membahas pengelompokan hewan secara umum berdasarkan makanannya (karnivora, herbivora, omnivora) → Tiga Kelompok Utama Hewan. 2. Paragraf 2: Menjelaskan definisi khusus hewan herbivora pemakan daun → Pengertian Hewan Folivora. 3. Paragraf 3: Menguraikan bagaimana tubuh mereka memproses makanan berserat tinggi → Cara Hewan Folivora Mencerna Daun. 4. Paragraf 4: Menampilkan contoh-contoh satwanya seperti koala dan panda → Contoh Hewan Folivora.
Bagan pada pilihan D menyajikan urutan alur berpikir yang paling runtut dan sesuai isi teks.', NULL, NULL),
(156, 156, 'Jawaban yang tepat adalah C.
Berdasarkan penjelasan pada paragraf ketiga, daun memiliki serat selulosa yang sangat alot dan rendah kalori. Agar dapat menyerap energi secara maksimal dan tidak membuang banyak tenaga, hewan folivora memiliki adaptasi khusus berupa saluran pencernaan yang panjang serta bergerak dengan sangat lambat dan tenang. Gerakan yang lambat ini berguna untuk menghemat energi tubuh mereka.', NULL, NULL),
(157, 157, 'Dalam fabel “Kenthus yang Sombong”, Koko si anak katak baru saja pulang dan menceritakan pertemuannya dengan seekor anak lembu di rawa. Koko menjelaskan kepada Kenthus bahwa meskipun tubuh anak lembu itu sangat besar, anak lembu tersebut tidak jahat, tidak memakan katak, dan hanya sibuk memakan rumput di tepi rawa.
Pernyataan A (Salah): Makhluk sombong bukanlah anak lembu, melainkan Kenthus sendiri yang merasa dirinya paling hebat.
Pernyataan B, C, dan D (Benar): Ketiganya merupakan penjelasan langsung dari Koko bahwa anak lembu berhati jinak, tidak memangsa katak, dan hanya memakan rumput.', NULL, NULL),
(158, 158, 'Jawaban yang tepat adalah B.
Dalam cerita “Kenthus yang Sombong”, Koko (anak katak) menceritakan kepada ayahnya bahwa ia baru saja melihat makhluk yang sangat besar (anak lembu). Mendengar cerita itu, Kenthus merasa tersaingi dan tidak mau kalah. Kenthus langsung meniup dan membesarkan perutnya sendiri untuk membuktikan bahwa dialah yang paling besar di rawa tersebut.
Sikap Kenthus yang tidak mau mengakui kelebihan makhluk lain dan ingin selalu dianggap paling hebat mencerminkan watak sombong dan tinggi hati (Pilihan B).', NULL, NULL),
(159, 159, 'Kisah Kenthus berakhir tragis: Kenthus terus meniup dan membesarkan perutnya agar bisa menandingi ukuran tubuh anak lembu, hingga akhirnya perutnya meletus dan ia celaka.
Mari kita evaluasi respons perasaan pembaca yang tepat: - Pernyataan A, B, dan C (Salah): Kenthus tidak pernah mengakui kesalahannya, tidak berbaikan dengan anak lembu, dan tidak berhasil membuktikan kekuatannya. - Pernyataan D (Benar): Pembaca merasa prihatin dan petik pelajaran berharga bahwa sifat sombong dan memaksakan diri yang bukan kemampuannya hanya akan mencelakakan diri sendiri.', NULL, NULL),
(160, 160, 'Jawaban yang tepat adalah A.
Konteks kalimat dalam teks: “Hari-hari itu sangat menegangkan.” Pada saat itu, Margaret Hamilton dan timnya sedang berkejaran dengan waktu untuk menuntaskan penulisan kode komputer pendaratan Apollo 11. Setiap detik sangat menentukan nasib dan keselamatan para astronot di luar angkasa.
Kata menegangkan bermakna suasana yang penuh dengan tekanan, kecemasan, dan rasa was-was karena adanya tanggung jawab yang sangat besar dan berisiko tinggi.', NULL, NULL),
(161, 161, 'Jawaban yang tepat adalah B.
Gagasan utama wacana adalah peran penting kode komputer yang dirancang oleh tim Margaret Hamilton dalam menyukseskan pendaratan Apollo 11 di bulan. Pernyataan pilihan B, yaitu “Perangkat lunak buatan tim Margaret mampu memprioritaskan tugas penting komputer saat pendaratan”, secara langsung mendukung gagasan utama karena menunjukkan fungsi nyata dari kode komputer tersebut dalam menyelamatkan misi antariksa.', NULL, NULL),
(162, 162, 'Margaret Hamilton memimpin tim pembuatan perangkat lunak komputer untuk pendaratan Apollo 11 di bulan. Pekerjaan ini belum pernah dilakukan siapa pun sebelumnya di dunia.
Mari kita lihat nilai hidup yang dapat kita teladani: - Pernyataan A (Benar): Ketelitian adalah kunci utama, karena satu kesalahan kode saja dapat menggagalkan pendaratan astronot di bulan. - Pernyataan B (Salah): Fokus wacana adalah perjuangan ketelitian dan tanggung jawab teknis, bukan sekadar memotivasi orang lain. - Pernyataan C (Benar): Rasa tanggung jawab yang tinggi membuat Margaret dan timnya tetap fokus bekerja siang dan malam. - Pernyataan D (Benar): Margaret berani mempelopori bidang rekayasa perangkat lunak baru dan tidak gentar meski pekerjaannya sangat rumit dan penuh tekanan.', NULL, NULL),
(163, 163, 'Jawaban yang tepat adalah A.
Pada paragraf pendahuluan teks prosedur kerajinan, tertulis bahwa bahan utama yang mudah ditemukan di rumah dan umum dimanfaatkan kembali untuk membuat mainan hewan edukatif adalah kardus bekas kemasan. Kardus bekas dipilih karena bahannya cukup tebal, kuat, dan ramah lingkungan.', NULL, NULL),
(164, 164, 'Pada teks prosedur pembuatan mainan hewan berbahan kardus bekas, langkah kedua adalah menempelkan lapisan penutup (kertas/selotip) pada bagian rongga potongan kardus.
Tujuan langkah ini adalah: - Pernyataan A (Benar): Menjadikan permukaan tepi mainan tertutup rapi dan tidak kasar. - Pernyataan B (Salah): Proses pewarnaan dilakukan setelah bentuk mainan selesai dirakit secara keseluruhan. - Pernyataan C (Benar): Menutup lubang tempat magnet terpasang di dalam rongga agar magnet terkunci kuat di posisinya. - Pernyataan D (Benar): Perekat pada lapisan tersebut ikut memperkuat sambungan antarlapis kardus agar tidak mudah renggang saat dimainkan anak-anak.', NULL, NULL),
(165, 165, 'Jawaban yang tepat adalah C.
Pada petunjuk pembuatan mainan hewan, bentuk badan hewan sengaja dipotong dan dibagi menjadi dua bagian (bagian depan dan bagian belakang) agar nantinya anak-anak dapat memasang magnet di antara kedua belahan tersebut. Dengan begitu, mainan dapat disambung dan dilepas kembali saat dimainkan sebagai media interaktif.', NULL, NULL),
(166, 166, 'Jawaban yang tepat adalah B.
Berdasarkan infografis “Air Putih atau Air Mineral?”, air mineral mengandung zat elektrolit alami seperti kalium, kalsium, dan natrium. Fungsi utama elektrolit di dalam tubuh manusia adalah menjaga keseimbangan cairan tubuh, mendukung fungsi saraf, dan mencegah dehidrasi, terutama setelah berolahraga atau beraktivitas berat.', NULL, NULL),
(167, 167, 'Jawaban yang tepat adalah C.
Perbedaan paling mendasar antara air putih biasa dan air mineral yang dijelaskan pada infografis adalah asal sumber air dan kandungan mineralnya. Air putih biasanya bersumber dari air tanah atau sumur rumahan yang dimasak hingga mendidih, sedangkan air mineral diperoleh langsung dari mata air pegunungan yang kaya mineral alami dan melalui proses uji higienis.', NULL, NULL),
(168, 168, 'Dalam desain infografis, variasi warna yang kontras serta ukuran huruf (tipografi) memiliki fungsi visual penting untuk mempermudah pembaca memahami informasi:
Pernyataan A & B (Benar): Warna mencolok dan huruf besar langsung menarik mata pembaca ke pesan inti dan informasi penting yang ingin disampaikan.
Pernyataan C (Salah): Pemilihan warna dalam infografis edukasi kesehatan didasarkan pada kejelasan informasi dan kontras visual, bukan sekadar menuruti selera pribadi pembaca.
Pernyataan D (Benar): Pembagian warna yang berbeda antara kolom air putih dan kolom air mineral memudahkan pembaca membandingkan kandungan keduanya secara cepat dalam sekali lihat.', NULL, NULL),
(169, 169, 'Jawaban yang tepat adalah A.
Dalam cerita “Antre, Dong!”, ketika seorang pemuda berusaha memotong antrean di kasir toko buku, suasana sempat menjadi gaduh karena pembeli lain merasa kesal. Tokoh yang pertama kali dengan bijak dan tenang menasihati pemuda tersebut adalah seorang ibu yang berada di dekat antrean. Ibu tersebut mengingatkan pemuda itu tentang pentingnya membudayakan antre dengan sopan.', NULL, NULL),
(170, 170, 'Dalam cerpen “Antre, Dong!”, tokoh utama Tia digambarkan sebagai anak yang berani dan tertib aturan.
Tindakan-tindakan nyata yang dilakukan Tia dalam cerita adalah: - Pernyataan A (Benar): Di awal cerita, Tia bersama temannya, Devi, pergi ke toko buku untuk membeli buku pelajaran. - Pernyataan B (Salah): Yang dinasihati oleh ibu untuk tertib mengantre adalah pemuda yang menyerobot, bukan Tia. - Pernyataan C & D (Benar): Saat pemuda beralasan buru-buru, Tia dengan tegas ikut menegur dan mengingatkan pemuda tersebut agar malu kepada ibu-ibu yang lebih tua tetapi tetap sabar mengantre.', NULL, NULL),
(171, 171, 'Konteks perdebatan dalam cerita adalah protes terhadap pemuda yang menyerobot antrean dengan alasan hanya membeli satu buku saja:
Pernyataan A (Mendukung): Semua orang di antrean juga punya kesibukan dan ingin cepat selesai, sehingga alasan pemuda tidak bisa dibenarkan.
Pernyataan B (Tidak Mendukung): Mengantre memang melatih sabar, tetapi dalam adegan ini fokusnya adalah penegakan keadilan giliran, bukan sekadar imbauan bersabar.
Pernyataan C (Mendukung): Budaya antre adalah kesepakatan sosial yang wajib dihormati siapa pun tanpa terkecuali.
Pernyataan D (Tidak Mendukung): Anggapan bahwa belanja sedikit berhak memotong antrean justru ditolak tegas oleh tokoh-tokoh dalam cerita.', NULL, NULL),
(172, 172, 'Jawaban yang tepat adalah B.
Berdasarkan wacana kesehatan gigi anak, penyebab utama gigi berlubang adalah aktivitas bakteri yang memakan sisa makanan manis di gigi. Bakteri tersebut memproduksi zat asam yang lama-kelamaan mengikis lapisan email pelindung gigi hingga terbentuk rongga atau lubang pada gigi.', NULL, NULL),
(173, 173, 'Berdasarkan teks edukasi kesehatan gigi, sisa makanan yang menempel di sela gigi akan menjadi santapan empuk bagi bakteri.
Akibat jika malas menyikat gigi: - Pernyataan A (Benar): Asam dari bakteri akan mengikis email gigi sehingga gigi menjadi keropos dan berlubang. - Pernyataan B (Salah): Gigi yang sakit dan berlubang justru menyulitkan mengunyah makanan, bukan membuat mengunyah lebih lama. - Pernyataan C (Benar): Bakteri berkembang biak dengan cepat pada sisa makanan yang tidak dibersihkan. - Pernyataan D (Benar): Tumpukan bakteri dan sisa makanan akan mengeras menjadi plak dan karang gigi yang memicu radang gusi.', NULL, NULL),
(174, 174, 'Pada gambar ilustrasi penampang gigi, tanda panah digunakan sebagai penunjuk visual (diagram callout):
Pernyataan A (Salah): Gambar tersebut adalah diagram anatomi satu gigi, bukan foto perbandingan gigi antarorang yang berbeda.
Pernyataan B & D (Benar): Tanda panah mengarah tepat ke lapisan gigi mulai dari lapisan terluar (email), lapisan tengah (dentin), hingga bagian rongga dalam (pulpa/saraf).
Pernyataan C (Salah): Gambar tidak membedakan jenis gigi seri, taring, atau geraham beserta fungsinya, melainkan memperlihatkan struktur lapisan anatomi gigi.', NULL, NULL),
(175, 175, 'Puisi “Surat untuk Sahabat” mengekspresikan kerinduan mendalam kepada sahabat yang telah lama berpisah jarak:
Pernyataan A, B, dan D (Benar): Larik-larik yang melukiskan kenangan senyuman, kehangatan sambutan tangan, dan tawa bersama di masa lalu secara emosional mencerminkan rasa rindu yang kuat terhadap kebersamaan yang pernah terjalin.
Pernyataan C (Salah): Larik “Maafmu selalu terbuka untukku” lebih menekankan sifat pemaaf dan kebaikan hati sahabat, bukan secara langsung menggambarkan suasana kerinduan.', NULL, NULL),
(176, 176, 'Jawaban yang tepat adalah C.
Puisi “Surat untuk Sahabat” menggambarkan kerinduan seorang sahabat yang telah lama berpisah tempat tinggal. Amanat utama yang ingin disampaikan penyair kepada pembaca adalah pentingnya menjaga dan merawat tali persahabatan serta saling mendoakan meskipun terpisah jarak yang jauh.', NULL, NULL),
(177, 177, 'Jawaban yang tepat adalah A.
Pernyataan yang tepat mengenai suasana dalam puisi tersebut adalah kehangatan dan nostalgia kenangan masa kecil. Nada penulisan puisi terasa penuh kasih sayang, ketulusan, serta kerinduan mendalam saat mengenang masa-masa bermain bersama sahabat.', NULL, NULL),
(178, 178, 'Jawaban yang tepat adalah C.
Berdasarkan catatan sejarah pada infografis kerupuk, makanan renyah khas nusantara ini ternyata sudah ada di Indonesia sejak abad ke-9 atau ke-10 Masehi. Hal tersebut dibuktikan dengan adanya catatan sejarah tertulis pada Prasasti Batu Pura yang menyebutkan istilah kerupuk rambak sebagai makanan tradisional masyarakat Jawa kuno.', NULL, NULL),
(179, 179, 'Periksa data dan fakta pada infografis kerupuk: - Data nilai ekspor 2021 tercatat menembus lebih dari 35 juta dolar AS (puluhan juta dolar). Jadi, Pernyataan A Benar. - Soal sejarah di infografis menyebutkan kerupuk tercatat pada Prasasti Batu Pura sejak abad ke-9 atau 10. Namun pernyataan B merumuskannya secara kurang tepat konteksnya. Jadi, Pernyataan B Salah. - Data volume ekspor tercatat melampaui 22 juta kilogram (lebih dari 20 juta kg). Jadi, Pernyataan C Benar. - Infografis menjelaskan kerupuk Indonesia telah diekspor ke berbagai belahan dunia (Asia, Eropa, hingga Amerika), menjadikannya camilan yang mendunia. Jadi, Pernyataan D Benar.', NULL, NULL),
(180, 180, 'Di sebelah kanan infografis disajikan 8 foto jenis kerupuk nusantara (kerupuk bawang, udang, rambak/kulit, rengginang, kerupuk putih, ikan, melarat, dan gendar):
Pernyataan A & B (Benar): Foto-foto tersebut bertujuan memperlihatkan kekayaan dan keragaman jenis kerupuk yang populer di berbagai daerah di Indonesia.
Pernyataan C (Salah): Gambar hanya menampilkan foto kerupuk yang sudah jadi, tidak memuat gambar atau daftar bahan baku pembuatannya.
Pernyataan D (Benar): Penampilan foto nyata sangat membantu pembaca mengenali bentuk fisik, tekstur, dan warna dari tiap jenis kerupuk khas Indonesia.', NULL, NULL)
ON DUPLICATE KEY UPDATE `question_id` = VALUES(`question_id`), `explanation_text` = VALUES(`explanation_text`);

SET FOREIGN_KEY_CHECKS = 1;
-- =============================================================================
-- SELESAI: 60 Butir Soal Recall Kemampuanmu Berhasil Dibenihkan.
-- =============================================================================
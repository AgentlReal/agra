-- =============================================================================
-- PEMBENIHAN BANK SOAL RECALL KEMAMPUAN: MATEMATIKA (FASE D)
-- Platform Pembelajaran & Drill-and-Practice Adaptif TKA SMP (Fase D)
-- Arsitektur ERD Versi: 6.0 FINAL (Tanpa CTT, 3 Level Kognitif Murni Kemendikdasmen)
-- Dokumen Acuan: TKA-DOC-02 (SRS), TKA-DOC-09 (Kurikulum), TKA-DOC-11 (Bank Soal),
--                TKA-DOC-12 (Penilaian Mastery), TKA-DOC-13 (Blueprint Asesmen)
-- File: migrations/006_seed_recall_kemampuan_matematika_v6.sql
-- Total: 30 Butir Soal Master (ID 151-180), 120 Pilihan Jawaban (ID 601-720),
--        30 Pembahasan Pasca-Sesi (ID 151-180)
-- Bank Type: RECALL (Terisolasi dari LEVEL_EXERCISE dan SIMULATION)
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. PEMBENIHAN MASTER BANK SOAL RECALL MATEMATIKA (QUESTION_BANKS - 30 Butir)
-- -----------------------------------------------------------------------------
INSERT INTO `question_banks` (`id`, `subject_id`, `sub_material_id`, `cognitive_level_id`, `stimulus_id`, `bank_type`, `question_format`, `question_text`, `question_image_url`, `is_active`) VALUES
(151, 1, 1, 2, NULL, 'RECALL', 'SINGLE_CHOICE', 'Hasil dari $120\\% - 3 + 2 \\times 0{,}75 + \\frac{2}{3}$ adalah ….', NULL, TRUE),
(152, 1, 1, 2, NULL, 'RECALL', 'SINGLE_CHOICE', 'Menjelang tahun ajaran baru, Toko Buku Ceria memberikan diskon 10% untuk semua jenis buku. Diketahui harga buku gambar adalah $\\frac{1}{2}$ dari harga buku komik. Harga buku tulis adalah $0{,}75$ kali harga buku komik. Diketahui harga buku komik adalah Rp24.000,00. Harga buku gambar dan buku tulis setelah dikenakan diskon adalah ….', NULL, TRUE),
(153, 1, 1, 3, NULL, 'RECALL', 'COMPLEX_CHOICE', 'Pak Bondan seorang penjual susu kedelai. Suatu hari, Pak Bondan memproduksi susu kedelai sebanyak 7 wadah yang masing-masing berisi $6\\frac{1}{4}$ liter susu kedelai. Seluruh hasil produksi tersebut akan dituangkan ke dalam 50 botol besar dengan isi yang sama banyak dan ke dalam 15 botol kecil dengan isi setiap botolnya adalah setengah botol besar. Pilihlah semua pernyataan yang benar tentang hasil produksi susu kedelai Pak Bondan!', NULL, TRUE),
(154, 1, 6, 1, NULL, 'RECALL', 'SINGLE_CHOICE', 'Mae bermain ular tangga menggunakan sebuah dadu. Diketahui bahwa jumlah titik pada setiap dua sisi berlawanan pada dadu adalah sama. Pada saat giliran Mae bermain, Mae melempar dadunya. Berikut adalah dadu hasil lemparan Mae. Pada dadu tersebut, banyak titik yang ada di sisi bawah adalah ….', '/assets/image_soal/recall_kemampuan/matematika/recall_kemampuan_matematika_nomer_4.png', TRUE),
(155, 1, 8, 2, NULL, 'RECALL', 'COMPLEX_CHOICE', 'Setiap bulan Ramadan, SD Harapan mengadakan bakti sosial. Mereka membagi sembako yang berisi 3 kg beras, dua bungkus gula pasir dengan berat masing-masing kemasan 5 hg, dan lima bungkus mi instan dengan berat per bungkus 85 g. Pilihlah pernyataan yang benar sesuai dengan informasi tersebut! Jawaban benar lebih dari satu.', NULL, TRUE),
(156, 1, 9, 3, NULL, 'RECALL', 'COMPLEX_CHOICE', 'SD Harapan baru saja meresmikan ruang perpustakaan untuk siswa. Bu Anita sedang mendata banyak siswa yang berkunjung ke perpustakaan tersebut pada lima hari pertama sejak diresmikan. Diagram berikut menggambarkan data yang diperoleh Bu Anita. Deskripsi apakah yang tepat tentang data pada diagram tersebut? Pilihlah semua pernyataan yang benar!', '/assets/image_soal/recall_kemampuan/matematika/recall_kemampuan_matematika_nomer_6.png', TRUE),
(157, 1, 9, 1, NULL, 'RECALL', 'COMPLEX_CHOICE', 'SD Mutiara mengadakan program pekan literasi. Selama pekan literasi, para siswa ditugaskan untuk mencatat jumlah buku yang mereka baca di rumah. Rina, Dika, dan Siti mencatat buku yang mereka baca dalam bentuk piktogram seperti pada gambar berikut. Berdasarkan informasi dari piktogram tersebut, pilihlah semua pernyataan yang benar terkait jumlah buku yang dibaca oleh Rina, Dika, dan Siti!', '/assets/image_soal/recall_kemampuan/matematika/recall_kemampuan_matematika_nomer_7.png', TRUE),
(158, 1, 8, 2, NULL, 'RECALL', 'SINGLE_CHOICE', 'Pak Bakri mempunyai lahan seluas 3,5 hektar. Pada lahan tersebut, $\\frac{1}{5}$ bagiannya akan ditanami cabai merah, $\\frac{1}{3}$ bagiannya akan ditanami tomat, dan sisanya akan ditanami daun bawang. Berapakah luas lahan yang akan ditanami tomat dan daun bawang?', NULL, TRUE),
(159, 1, 8, 2, NULL, 'RECALL', 'SINGLE_CHOICE', 'Sebuah bak berbentuk kubus memiliki volume sebesar $9\\ \\text{m}^{3}$. Bak tersebut akan diubah menjadi sebuah balok dengan panjangnya 2 kali dari ukuran bak sebelumnya, lebarnya $\\frac{1}{2}$ dari ukuran bak sebelumnya, dan tingginya sama dengan ukuran bak sebelumnya. Volume dari bak yang baru adalah ….', NULL, TRUE),
(160, 1, 8, 2, NULL, 'RECALL', 'SINGLE_CHOICE', 'Pak Bayu dan keluarganya tinggal di Kota Yogyakarta dan berencana untuk liburan ke Semarang. Diketahui jarak Yogyakarta-Semarang 140 km dan kecepatan rata-rata mobil Pak Bayu 80 km/jam. Pak Bayu dan keluarga berangkat dari rumah pukul 06.00. Apabila di tengah perjalanan mereka berhenti selama 15 menit untuk membeli oleh-oleh, pukul berapakah Pak Bayu dan keluarga tiba di Semarang?', NULL, TRUE),
(161, 1, 8, 1, NULL, 'RECALL', 'COMPLEX_CHOICE', 'Lala berulang tahun setiap tanggal 14 Juni. Dia akan berusia 13 tahun pada bulan Juni tahun ini. Sekarang tanggal 30 April. Berdasarkan informasi tersebut, pilihlah semua pernyataan yang benar terkait ulang tahun Lala!', NULL, TRUE),
(162, 1, 8, 2, NULL, 'RECALL', 'SINGLE_CHOICE', 'Ibu pergi ke pasar membeli 3 kg buah. Di dalam keranjang belanja ibu, terdapat dua buah alpukat mentega dengan berat 1,25 kg dan sisanya adalah tujuh buah mangga kweni. Berat satu buah mangga kweni adalah ….', NULL, TRUE),
(163, 1, 8, 3, NULL, 'RECALL', 'COMPLEX_CHOICE', 'Seorang petani memiliki tangki berisi air sebanyak 0,8 hektoliter. Air tersebut akan ditampung ke dalam bak penampungan yang nantinya akan digunakan untuk menyiram tanaman cabai. Bak penampungan dapat menampung 20 liter air. Berdasarkan informasi tersebut, pilihlah semua pernyataan yang benar!', NULL, TRUE),
(164, 1, 8, 2, NULL, 'RECALL', 'COMPLEX_CHOICE', 'Bu Guru menugaskan Doni untuk membawa sebuah kotak yang dapat menampung 64 kubus satuan. Kubus satuan adalah kubus yang mempunyai rusuk 1 cm. Di rumah, Doni memiliki beberapa macam kotak dengan berbagai ukuran. Di antara pilihan berikut, kotak mana sajakah yang harus dibawa oleh Doni? Pilihlah jawaban yang benar! Jawaban benar lebih dari satu.', NULL, TRUE),
(165, 1, 8, 2, NULL, 'RECALL', 'COMPLEX_CHOICE', 'Nisa sedang mengunjungi kebun binatang. Dia ingin melihat Capybara yang letaknya di bagian timur kebun binatang. Setelah Nisa melewati gerbang kebun binatang, dia melihat papan petunjuk jalan sebagai berikut. Berdasarkan informasi tersebut, pilihlah semua pernyataan yang benar!', '/assets/image_soal/recall_kemampuan/matematika/recall_kemampuan_matematika_nomer_15.png', TRUE),
(166, 1, 1, 1, NULL, 'RECALL', 'SINGLE_CHOICE', 'Dio sedang membantu ayah memotong batang rotan untuk dijadikan stik pewangi ruangan. Ayah mempunyai batang rotan dengan panjang 320 cm. Ayah ingin membuat stik pewangi ruangan sebanyak mungkin dengan panjang stik masing-masing 15 cm. Sisa batang rotan yang tidak terpakai untuk membuat stik pewangi ruangan adalah sepanjang ….', NULL, TRUE),
(167, 1, 1, 2, NULL, 'RECALL', 'SINGLE_CHOICE', 'Murid-murid SD Cerdas, SD Pelita, dan SD Mentari melakukan kegiatan olahraga di lapangan bola yang sama. Jadwal mereka melakukan kegiatan olahraga tidak sama. Murid-murid SD Cerdas melakukan kegiatan olahraga setiap 2 minggu sekali. Murid-murid SD Pelita melakukan kegiatan olahraga setiap 3 minggu sekali. Murid-murid SD Mentari melakukan kegiatan olahraga setiap 4 minggu sekali. Hari ini ketiga SD tersebut melakukan kegiatan olahraga secara bersamaan. Setiap periode waktu berapakah murid ketiga SD tersebut akan bertemu dalam kegiatan olahraga di lapangan?', NULL, TRUE),
(168, 1, 3, 2, NULL, 'RECALL', 'SINGLE_CHOICE', 'Misal $a = 5 - \\frac{7}{2}$ dan $b = \\frac{3}{4} - \\frac{1}{2}$. Maka $a - 2b =$ …..', NULL, TRUE),
(169, 1, 1, 1, NULL, 'RECALL', 'SINGLE_CHOICE', 'Desti mendapatkan hadiah satu loyang kue pada hari ulang tahunnya. Desti memotong kuenya menjadi beberapa bagian seperti yang terlihat pada gambar. Beberapa potong kue berwarna cokelat dan beberapa potong lainnya berwarna kuning. Berapa bagiankah kue yang berwarna cokelat dari keseluruhan kue?', '/assets/image_soal/recall_kemampuan/matematika/recall_kemampuan_matematika_nomer_19.png', TRUE),
(170, 1, 8, 2, NULL, 'RECALL', 'SINGLE_CHOICE', 'Pak Boni memiliki sebidang tanah berbentuk bangun sebagai berikut. Berapakah keliling bidang tanah Pak Boni?', '/assets/image_soal/recall_kemampuan/matematika/recall_kemampuan_matematika_nomer_20.png', TRUE),
(171, 1, 1, 2, NULL, 'RECALL', 'SINGLE_CHOICE', 'Untuk meningkatkan minat membaca siswa, perpustakaan di SD Cahaya mengadakan kegiatan “Ayo Membaca Buku” untuk murid kelas 6. Jumlah peserta dari Kelas A sebanyak 28 siswa, dari Kelas B sebanyak 36 siswa, dan dari Kelas C sebanyak 32 siswa. Setiap siswa akan mendapatkan 3 buah buku bacaan. Jika 1 dus berisi 24 buku, berapa dus buku yang dibutuhkan untuk kegiatan tersebut?', NULL, TRUE),
(172, 1, 1, 1, NULL, 'RECALL', 'SINGLE_CHOICE', 'Pada hari Sabtu, Andi, Beni, Citra, dan Dika mengikuti kegiatan “Lari Sehat” di lapangan desa. Mereka semua menargetkan untuk menyelesaikan jarak lari yang sama, yaitu 10 km. Hingga pukul 08.00, diperoleh data sebagai berikut:
- Andi telah menempuh 0,4 bagian dari total jarak.
- Beni telah menempuh 60% dari total jarak.
- Citra telah menempuh $\\frac{1}{3}$ bagian dari total jarak.
- Dika telah menempuh 5,5 km dari total jarak.

Siapakah yang telah menempuh jarak lari sebesar $\\frac{3}{5}$ dari total jarak?', NULL, TRUE),
(173, 1, 6, 1, NULL, 'RECALL', 'SINGLE_CHOICE', 'Sebuah bangun datar memiliki sifat-sifat sebagai berikut:
- Memiliki 4 sisi yang sama panjang ($AB = BC = CD = DA$).
- Memiliki 4 sudut siku-siku ($90^\\circ$).
- Kedua diagonalnya sama panjang, saling berpotongan di titik tengah, dan saling tegak lurus ($AC \\perp BD$).

Berdasarkan sifat-sifat di atas dan gambar yang diberikan, apakah nama bangun datar tersebut?', '/assets/image_soal/recall_kemampuan/matematika/recall_kemampuan_matematika_nomer_23.jpg', TRUE),
(174, 1, 8, 2, NULL, 'RECALL', 'SINGLE_CHOICE', 'Pada hari Minggu, Rani mengikuti kegiatan belajar menari di sanggar seni. Rani berangkat dari rumah pukul 07.25. Perjalanan menuju sanggar memerlukan waktu 45 menit. Kegiatan belajar menari berlangsung selama 1 jam 35 menit. Setelah kegiatan selesai, Rani beristirahat di sanggar selama 20 menit sebelum pulang. Pukul berapakah Rani meninggalkan sanggar untuk pulang?', NULL, TRUE),
(175, 1, 8, 2, NULL, 'RECALL', 'SINGLE_CHOICE', 'Perhatikan tempat parkir mobil di taman kota pada gambar berikut. Lebar jalan yang disediakan untuk parkir satu mobil adalah 2 meter. Satu mobil baru saja keluar dari parkiran. Berapa mobil lagi yang dapat diparkir di area tersebut sekarang?', '/assets/image_soal/recall_kemampuan/matematika/recall_kemampuan_matematika_nomer_25.png', TRUE),
(176, 1, 8, 3, NULL, 'RECALL', 'COMPLEX_CHOICE', 'Lahan parkir motor ada di sekitar taman kota (perhatikan denah pada gambar). Parkiran yang tersedia cukup luas. Satu motor membutuhkan lahan parkir seluas $2\\ \\text{m}^{2}$. Pada pukul 13.00, terdapat 12 motor yang memasuki area parkir dan dapat terparkir dengan rapi di lahan parkir. Ternyata lahan parkir dapat menampung 1 motor lagi. Pilihlah semua pernyataan yang benar terkait tempat parkir motor pada siang itu!', '/assets/image_soal/recall_kemampuan/matematika/recall_kemampuan_matematika_nomer_25.png', TRUE),
(177, 1, 1, 2, NULL, 'RECALL', 'SINGLE_CHOICE', 'Perhatikan gambar buku bacaan dan bagian yang sudah dibaca oleh Danu, Antok, dan Caca. Berapa persen dari seluruh halaman buku yang sudah selesai dibaca oleh Caca?', '/assets/image_soal/recall_kemampuan/matematika/recall_kemampuan_matematika_nomer_27_28.png', TRUE),
(178, 1, 1, 3, NULL, 'RECALL', 'COMPLEX_CHOICE', 'Berdasarkan informasi mengenai jumlah halaman buku dan banyak bagian buku yang sudah dibaca oleh Danu, Antok, dan Caca di minggu pertama pada gambar, pilihlah semua pernyataan yang benar!', '/assets/image_soal/recall_kemampuan/matematika/recall_kemampuan_matematika_nomer_27_28.png', TRUE),
(179, 1, 9, 3, NULL, 'RECALL', 'COMPLEX_CHOICE', 'Anak berusia 10 - 12 tahun membutuhkan protein paling sedikit 55 gram dalam sehari. Jika disediakan makanan berikut dengan berat masing-masing 250 gram (perhatikan grafik kandungan nutrisi pada gambar), tentukanlah makanan yang dapat memenuhi kebutuhan protein harian mereka! Pilihlah jawaban yang benar! Jawaban benar lebih dari satu.', '/assets/image_soal/recall_kemampuan/matematika/recall_kemampuan_matematika_nomer_29_30.png', TRUE),
(180, 1, 9, 3, NULL, 'RECALL', 'COMPLEX_CHOICE', 'Menurut Kementerian Kesehatan RI, ibu hamil harus mengonsumsi lebih banyak makanan yang mengandung protein dan lemak. Hal ini disarankan agar memastikan jaringan dan organ bayi dapat tumbuh dengan baik. Ibu hamil perlu mengonsumsi 70 hingga 100 gram protein setiap hari, sedangkan lemak dapat dikonsumsi sebanyak 62 hingga 67 gram dalam sehari. Suatu hari, seorang ibu hamil mencatat banyak lemak dan protein yang telah dikonsumsi sebagaimana tampak pada grafik kedua di gambar berikut. Pilihlah semua pernyataan yang benar!', '/assets/image_soal/recall_kemampuan/matematika/recall_kemampuan_matematika_nomer_30.png', TRUE)
ON DUPLICATE KEY UPDATE
    `subject_id` = VALUES(`subject_id`),
    `sub_material_id` = VALUES(`sub_material_id`),
    `cognitive_level_id` = VALUES(`cognitive_level_id`),
    `stimulus_id` = VALUES(`stimulus_id`),
    `bank_type` = VALUES(`bank_type`),
    `question_format` = VALUES(`question_format`),
    `question_text` = VALUES(`question_text`),
    `question_image_url` = VALUES(`question_image_url`),
    `is_active` = VALUES(`is_active`);

-- -----------------------------------------------------------------------------
-- 2. PEMBENIHAN OPSI JAWABAN RECALL MATEMATIKA (QUESTION_OPTIONS - 120 Opsi)
-- -----------------------------------------------------------------------------
INSERT INTO `question_options` (`id`, `question_id`, `option_label`, `option_text`, `is_correct`) VALUES
(601, 151, 'A', '$\\frac{11}{30}$', TRUE),
(602, 151, 'B', '$\\frac{49}{60}$', FALSE),
(603, 151, 'C', '$\\frac{31}{30}$', FALSE),
(604, 151, 'D', '$\\frac{98}{60}$', FALSE),
(605, 152, 'A', 'Rp18.000,00', FALSE),
(606, 152, 'B', 'Rp24.000,00', FALSE),
(607, 152, 'C', 'Rp27.000,00', TRUE),
(608, 152, 'D', 'Rp30.000,00', FALSE),
(609, 153, 'A', 'Pada hari itu Pak Bondan memproduksi $43\\frac{3}{4}$ liter susu kedelai.', TRUE),
(610, 153, 'B', 'Setiap botol besar diisi susu kedelai sebanyak $\\frac{35}{46}$ liter.', TRUE),
(611, 153, 'C', 'Total susu kedelai yang dikemas dalam botol kecil adalah $\\frac{525}{46}$ liter.', FALSE),
(612, 153, 'D', 'Isi satu botol besar setara dengan isi tiga botol kecil.', FALSE),
(613, 154, 'A', '2', FALSE),
(614, 154, 'B', '3', TRUE),
(615, 154, 'C', '4', FALSE),
(616, 154, 'D', '5', FALSE),
(617, 155, 'A', 'Total berat semua isi paket adalah 4.425 gram.', TRUE),
(618, 155, 'B', 'Berat mi instan dalam paket tersebut lebih dari 0,5 kilogram.', FALSE),
(619, 155, 'C', 'Satu kemasan gula pasir lebih berat dibandingkan seluruh mi instan.', TRUE),
(620, 155, 'D', 'Gula pasir merupakan komponen yang paling berat di dalam paket sembako.', FALSE),
(621, 156, 'A', 'Banyak siswa yang mengunjungi perpustakaan pada hari Senin hanya $\\frac{3}{4}$ dari pengunjung pada hari Rabu.', TRUE),
(622, 156, 'B', 'Total siswa pengunjung perpustakaan mulai dari hari Senin hingga hari Jumat adalah 100.', FALSE),
(623, 156, 'C', 'Perbedaan banyak pengunjung harian dengan hari sebelumnya tidak lebih dari 5 orang.', TRUE),
(624, 156, 'D', 'Total pengunjung perpustakaan selama lima hari tersebut lebih dari 100 orang.', FALSE),
(625, 157, 'A', 'Rina membaca sepuluh buku.', TRUE),
(626, 157, 'B', 'Dika membaca buku lebih sedikit daripada Rina.', TRUE),
(627, 157, 'C', 'Siti membaca tiga buku.', FALSE),
(628, 157, 'D', 'Total seluruh buku yang dibaca oleh keempat siswa adalah 28 buku.', FALSE),
(629, 158, 'A', '1,63 hektar.', FALSE),
(630, 158, 'B', '1,87 hektar.', FALSE),
(631, 158, 'C', '2,33 hektar.', FALSE),
(632, 158, 'D', '2,80 hektar.', TRUE),
(633, 159, 'A', '$4{,}5\\ \\text{m}^{3}$', FALSE),
(634, 159, 'B', '$9\\ \\text{m}^{3}$', TRUE),
(635, 159, 'C', '$18\\ \\text{m}^{3}$', FALSE),
(636, 159, 'D', '$22{,}5\\ \\text{m}^{3}$', FALSE),
(637, 160, 'A', '07.45', FALSE),
(638, 160, 'B', '08.00', TRUE),
(639, 160, 'C', '08.45', FALSE),
(640, 160, 'D', '09.00', FALSE),
(641, 161, 'A', 'Lala harus menunggu 45 hari lagi untuk merayakan ulang tahunnya.', TRUE),
(642, 161, 'B', 'Lala harus menunggu enam minggu dan tiga hari lagi untuk merayakan ulang tahunnya.', TRUE),
(643, 161, 'C', 'Lala harus menunggu dua bulan untuk merayakan ulang tahunnya.', FALSE),
(644, 161, 'D', 'Pada tanggal 31 Mei, sisa waktu menunggu ulang tahun Lala tinggal 15 hari lagi.', FALSE),
(645, 162, 'A', '0,2 kg', FALSE),
(646, 162, 'B', '0,25 kg', TRUE),
(647, 162, 'C', '0,3 kg', FALSE),
(648, 162, 'D', '0,35 kg', FALSE),
(649, 163, 'A', 'Air di dalam tangki tersebut adalah 80 liter.', TRUE),
(650, 163, 'B', 'Petani dapat mengisi bak penampungan sebanyak lima kali hingga tangki kosong.', FALSE),
(651, 163, 'C', 'Jika satu baris tanaman cabai membutuhkan $40\\ \\text{dl}$ air, sepuluh baris tanaman cabai dapat membuat volume air dalam tangki berkurang setengahnya.', TRUE),
(652, 163, 'D', 'Kapasitas bak penampungan setara dengan 2.000 desiliter air.', FALSE),
(653, 164, 'A', 'Kotak berukuran $8\\ \\text{cm} \\times 2\\ \\text{cm} \\times 4\\ \\text{cm}$', TRUE),
(654, 164, 'B', 'Kotak berukuran $4\\ \\text{cm} \\times 4\\ \\text{cm} \\times 4\\ \\text{cm}$', TRUE),
(655, 164, 'C', 'Kotak berukuran $4\\ \\text{cm} \\times 3\\ \\text{cm} \\times 5\\ \\text{cm}$', FALSE),
(656, 164, 'D', 'Kotak berukuran $16\\ \\text{cm} \\times 2\\ \\text{cm} \\times 1\\ \\text{cm}$', FALSE),
(657, 165, 'A', 'Jarak kandang Zebra adalah 6.000 mm.', FALSE),
(658, 165, 'B', 'Jarak kandang Capybara dan Kanguru adalah 1.500 cm.', TRUE),
(659, 165, 'C', 'Jika Nisa melihat Jerapah, kemudian dia ingin melihat Kanguru, maka Nisa harus berjalan sejauh 0,11 km.', TRUE),
(660, 165, 'D', 'Kandang Capybara merupakan kandang yang letaknya paling jauh dari gerbang kebun binatang.', FALSE),
(661, 166, 'A', '4 cm', FALSE),
(662, 166, 'B', '5 cm', TRUE),
(663, 166, 'C', '6 cm', FALSE),
(664, 166, 'D', '7 cm', FALSE),
(665, 167, 'A', '4 minggu', FALSE),
(666, 167, 'B', '6 minggu', FALSE),
(667, 167, 'C', '12 minggu', TRUE),
(668, 167, 'D', '18 minggu', FALSE),
(669, 168, 'A', '1', TRUE),
(670, 168, 'B', '$1\\frac{1}{4}$', FALSE),
(671, 168, 'C', '2', FALSE),
(672, 168, 'D', '$2\\frac{1}{4}$', FALSE),
(673, 169, 'A', '$\\frac{1}{8}$', FALSE),
(674, 169, 'B', '$\\frac{1}{4}$', TRUE),
(675, 169, 'C', '$\\frac{1}{2}$', FALSE),
(676, 169, 'D', '$\\frac{3}{4}$', FALSE),
(677, 170, 'A', '58 m', FALSE),
(678, 170, 'B', '68 m', TRUE),
(679, 170, 'C', '72 m', FALSE),
(680, 170, 'D', '96 m', FALSE),
(681, 171, 'A', '8 dus', FALSE),
(682, 171, 'B', '10 dus', FALSE),
(683, 171, 'C', '12 dus', TRUE),
(684, 171, 'D', '24 dus', FALSE),
(685, 172, 'A', 'Andi', FALSE),
(686, 172, 'B', 'Beni', TRUE),
(687, 172, 'C', 'Citra', FALSE),
(688, 172, 'D', 'Dika', FALSE),
(689, 173, 'A', 'Persegi', TRUE),
(690, 173, 'B', 'Persegi panjang', FALSE),
(691, 173, 'C', 'Belah ketupat', FALSE),
(692, 173, 'D', 'Layang-layang', FALSE),
(693, 174, 'A', '09.45', FALSE),
(694, 174, 'B', '10.00', FALSE),
(695, 174, 'C', '10.05', TRUE),
(696, 174, 'D', '10.25', FALSE),
(697, 175, 'A', '9', FALSE),
(698, 175, 'B', '10', TRUE),
(699, 175, 'C', '12', FALSE),
(700, 175, 'D', '14', FALSE),
(701, 176, 'A', 'Terdapat 4 motor yang sudah keluar dari lahan parkir sebelum pukul 13.00.', TRUE),
(702, 176, 'B', 'Sebelum 12 motor memasuki lahan parkir, lahan parkir sudah terisi oleh 8 motor.', FALSE),
(703, 176, 'C', 'Pada pukul 13.00 lahan parkir terisi oleh 20 motor.', FALSE),
(704, 176, 'D', 'Luas total kedua petak lahan parkir motor pada denah tersebut adalah 40 meter persegi.', TRUE),
(705, 177, 'A', '34%', FALSE),
(706, 177, 'B', '50%', FALSE),
(707, 177, 'C', '66%', FALSE),
(708, 177, 'D', '75%', TRUE),
(709, 178, 'A', 'Danu sudah membaca 219 halaman.', TRUE),
(710, 178, 'B', 'Antok sudah membaca 170 halaman.', TRUE),
(711, 178, 'C', 'Caca sudah membaca 287 halaman.', FALSE),
(712, 178, 'D', 'Buku yang dibaca oleh Antok memiliki jumlah halaman paling banyak.', FALSE),
(713, 179, 'A', 'Daging sapi', TRUE),
(714, 179, 'B', 'Telur ayam', FALSE),
(715, 179, 'C', 'Ikan', TRUE),
(716, 179, 'D', 'Susu sapi', FALSE),
(717, 180, 'A', 'Ibu hamil dapat menambah konsumsi 50 gram ikan untuk memenuhi kebutuhan protein.', FALSE),
(718, 180, 'B', 'Ibu hamil dapat menambah konsumsi 50 gram keju untuk memenuhi kebutuhan lemak.', TRUE),
(719, 180, 'C', 'Ibu hamil dapat menambah konsumsi 50 gram daging sapi untuk memenuhi kebutuhan protein.', TRUE),
(720, 180, 'D', 'Kekurangan asupan lemak ibu hamil saat ini lebih sedikit daripada kekurangan asupan proteinnya.', FALSE)
ON DUPLICATE KEY UPDATE
    `question_id` = VALUES(`question_id`),
    `option_label` = VALUES(`option_label`),
    `option_text` = VALUES(`option_text`),
    `is_correct` = VALUES(`is_correct`);

-- -----------------------------------------------------------------------------
-- 3. PEMBENIHAN PEMBAHASAN PASCA-SESI RECALL MATEMATIKA (QUESTION_EXPLANATIONS - 30)
-- -----------------------------------------------------------------------------
INSERT INTO `question_explanations` (`id`, `question_id`, `explanation_text`, `reasoning_guide`, `reference_url`) VALUES
(151, 151, 'Untuk menyelesaikan operasi hitung campuran, dahulukan operasi perkalian, kemudian penjumlahan dan pengurangan dari kiri ke kanan:
1. Perkalian:
$$2 \\times 0{,}75 = 2 \\times \\frac{3}{4} = \\frac{6}{4} = \\frac{3}{2}$$
2. Samakan penyebut seluruh bilangan ke KPK dari 100, 1, 2, dan 3 yaitu 30:
- $120\\% = \\frac{120}{100} = \\frac{6}{5} = \\frac{36}{30}$
- $3 = \\frac{90}{30}$
- $\\frac{3}{2} = \\frac{45}{30}$
- $\\frac{2}{3} = \\frac{20}{30}$
3. Hitung hasil akhirnya:
$$\\frac{36}{30} - \\frac{90}{30} + \\frac{45}{30} + \\frac{20}{30} = \\frac{36 - 90 + 45 + 20}{30} = \\frac{11}{30}$$
Jadi, hasil dari operasi hitung campuran tersebut adalah $\\frac{11}{30}$ (Pilihan A).', 'Fokus penguasaan: Menghitung operasi campuran pecahan, desimal, dan persen sesuai kaidah prioritas operasi matematika.', 'Pusmendik / BSKAP Kemendikdasmen - Numerasi Fase D'),
(152, 152, 'Mari kita cari harga masing-masing buku sebelum diskon:
1. Harga buku komik sudah diketahui: $\\text{Rp}24.000,00$.
2. Harga buku gambar adalah $\\frac{1}{2}$ dari harga komik:
$$\\text{Harga buku gambar} = \\frac{1}{2} \\times \\text{Rp}24.000,00 = \\text{Rp}12.000,00$$
3. Harga buku tulis adalah $0{,}75$ kali harga komik:
$$\\text{Harga buku tulis} = 0{,}75 \\times \\text{Rp}24.000,00 = \\text{Rp}18.000,00$$
4. Total harga buku gambar dan buku tulis sebelum diskon:
$$\\text{Total harga awal} = \\text{Rp}12.000,00 + \\text{Rp}18.000,00 = \\text{Rp}30.000,00$$
5. Diskon yang diberikan adalah $10\\%$:
$$\\text{Potongan harga} = 10\\% \\times \\text{Rp}30.000,00 = \\text{Rp}3.000,00$$
$$\\text{Harga setelah diskon} = \\text{Rp}30.000,00 - \\text{Rp}3.000,00 = \\text{Rp}27.000,00$$
Jadi, total harga buku gambar dan buku tulis setelah diskon adalah Rp27.000,00 (Pilihan C).', 'Fokus penguasaan: Menghitung persentase diskon dan operasi perbandingan harga bertingkat dalam aritmetika sosial.', 'Pusmendik / BSKAP Kemendikdasmen - Numerasi Fase D'),
(153, 153, 'Mari kita analisis data produksi susu kedelai Pak Bondan:
1. Total volume produksi susu kedelai:
$$\\text{Total volume} = 7 \\times 6\\frac{1}{4}\\text{ liter} = 7 \\times \\frac{25}{4} = \\frac{175}{4} = 43\\frac{3}{4}\\text{ liter}$$
(Pernyataan A Benar).
2. Menghitung kapasitas botol:
Misalkan isi satu botol besar adalah $x$ liter, maka isi satu botol kecil adalah $\\frac{1}{2}x$ liter.
Seluruh susu dituangkan ke 50 botol besar dan 15 botol kecil:
$$50x + 15\\left(\\frac{1}{2}x\\right) = \\frac{175}{4}$$
$$50x + 7{,}5x = 57{,}5x = \\frac{115}{2}x = \\frac{175}{4}$$
$$x = \\frac{175}{4} \\times \\frac{2}{115} = \\frac{350}{460} = \\frac{35}{46}\\text{ liter}$$
Jadi isi setiap botol besar adalah $\\frac{35}{46}$ liter (Pernyataan B Benar).
3. Total susu dalam 15 botol kecil:
$$\\text{Total botol kecil} = 15 \\times \\left(\\frac{1}{2} \\times \\frac{35}{46}\\right) = 15 \\times \\frac{35}{92} = \\frac{525}{92}\\text{ liter}$$
(Pernyataan C Salah, karena penyebutnya 92 bukan 46).
4. Hubungan botol besar dan kecil: 1 botol besar setara dengan 2 botol kecil, bukan 3 botol kecil (Pernyataan D Salah).
Jadi, pernyataan yang benar adalah A dan B.', 'Fokus penguasaan: Memodelkan dan menyelesaikan masalah pecahan dan proporsi pembagian wadah bertingkat.', 'Pusmendik / BSKAP Kemendikdasmen - Numerasi Fase D'),
(154, 154, 'Ingat aturan baku pada dadu standar berenam sisi: jumlah titik pada dua sisi yang saling berhadapan (berlawanan) selalu bernilai tetap, yaitu $7$ ($1+6=7, 2+5=7, 3+4=7$).
Pada gambar dadu yang dilempar Mae, sisi bagian atas menunjukkan $4$ titik.
Maka banyak titik pada sisi bawah yang berlawanan langsung dengannya adalah:
$$7 - 4 = 3\\text{ titik}$$
Jadi, banyak titik yang ada di sisi bawah dadu adalah 3 (Pilihan B).', 'Fokus penguasaan: Menalar sifat geometris spasial dan pola invariansi sisi dadu berenam sisi.', 'Pusmendik / BSKAP Kemendikdasmen - Numerasi Fase D'),
(155, 155, 'Mari kita konversikan seluruh satuan berat komponen paket sembako ke dalam gram:
1. Beras: $3\\text{ kg} = 3 \\times 1.000\\text{ g} = 3.000\\text{ gram}$.
2. Gula pasir: 2 bungkus $\\times 5\\text{ hg} = 10\\text{ hg} = 10 \\times 100\\text{ g} = 1.000\\text{ gram}$ (1 bungkus $= 500\\text{ gram}$).
3. Mi instan: 5 bungkus $\\times 85\\text{ g} = 425\\text{ gram} = 0{,}425\\text{ kg}$.
Mari kita uji setiap pernyataan:
- Pernyataan A (Benar): Total berat isi paket $= 3.000 + 1.000 + 425 = 4.425\\text{ gram}$.
- Pernyataan B (Salah): Berat seluruh mi instan adalah $425\\text{ gram} = 0{,}425\\text{ kg}$, yang bernilai kurang dari $0{,}5\\text{ kg}$ ($500\\text{ g}$).
- Pernyataan C (Benar): Satu kemasan gula pasir seberat $500\\text{ gram}$, lebih berat dibandingkan total seluruh mi instan ($425\\text{ gram}$).
- Pernyataan D (Salah): Komponen paling berat di dalam paket adalah beras ($3.000\\text{ gram}$), bukan gula pasir.
Jadi, pernyataan yang benar adalah A dan C.', 'Fokus penguasaan: Mengonversi dan membandingkan besaran satuan massa baku (kg, hg, g) dalam konteks kehidupan sehari-hari.', 'Pusmendik / BSKAP Kemendikdasmen - Numerasi Fase D'),
(156, 156, 'Mari kita baca data jumlah pengunjung perpustakaan dari diagram batang:
- Senin: 15 siswa
- Selasa: 18 siswa
- Rabu: 20 siswa
- Kamis: 24 siswa
- Jumat: 20 siswa
Mari kita uji setiap pernyataan:
- Pernyataan A (Benar): Perbandingan pengunjung Senin terhadap Rabu adalah $\\frac{15}{20} = \\frac{3}{4}$.
- Pernyataan B & D (Salah): Total pengunjung $= 15 + 18 + 20 + 24 + 20 = 97\\text{ orang}$ (kurang dari 100 orang).
- Pernyataan C (Benar): Selisih pengunjung antar-hari berurutan:
  * Selasa - Senin = $18 - 15 = 3\\text{ orang}$ ($\\le 5$)
  * Rabu - Selasa = $20 - 18 = 2\\text{ orang}$ ($\\le 5$)
  * Kamis - Rabu = $24 - 20 = 4\\text{ orang}$ ($\\le 5$)
  * |Jumat - Kamis| = $|20 - 24| = 4\\text{ orang}$ ($\\le 5$)
  Seluruh selisih tidak melebihi 5 orang.
Jadi, pernyataan yang tepat adalah A dan C.', 'Fokus penguasaan: Menafsirkan, menghitung total, rasio, dan tren perubahan data pada diagram batang vertikal.', 'Pusmendik / BSKAP Kemendikdasmen - Numerasi Fase D'),
(157, 157, 'Perhatikan petunjuk piktogram pada gambar: 1 simbol gambar buku mewakili 2 buku fisik.
Mari kita hitung buku yang dibaca oleh masing-masing siswa:
- Rina: $5\\text{ simbol} \\times 2 = 10\\text{ buku}$.
- Dika: $4\\text{ simbol} \\times 2 = 8\\text{ buku}$.
- Siti: $3\\text{ simbol} \\times 2 = 6\\text{ buku}$.
Mari kita evaluasi setiap pernyataan:
- Pernyataan A (Benar): Rina memang membaca 10 buku.
- Pernyataan B (Benar): Dika membaca 8 buku, yang lebih sedikit dibandingkan Rina (10 buku).
- Pernyataan C (Salah): Siti membaca 6 buku, bukan 3 buku (angka 3 hanyalah jumlah simbol gambar).
- Pernyataan D (Salah): Siswa yang didata hanya ada 3 orang dengan total buku $10 + 8 + 6 = 24\\text{ buku}$.
Jadi, pernyataan yang benar adalah A dan B.', 'Fokus penguasaan: Membaca representasi piktogram dengan faktor skala pengali kuantitas data.', 'Pusmendik / BSKAP Kemendikdasmen - Numerasi Fase D'),
(158, 158, 'Luas total lahan Pak Bakri adalah $3{,}5\\text{ hektar}$.
Lahan tersebut hanya dialokasikan untuk tiga jenis tanaman: cabai merah, tomat, dan daun bawang.
Oleh karena itu, luas lahan yang ditanami tomat dan daun bawang sama dengan luas total lahan dikurangi luas lahan cabai merah:
1. Menghitung luas lahan cabai merah ($\\frac{1}{5}$ bagian):
$$\\text{Luas cabai merah} = \\frac{1}{5} \\times 3{,}5\\text{ hektar} = 0{,}70\\text{ hektar}$$
2. Menghitung luas lahan tomat dan daun bawang:
$$\\text{Luas} = 3{,}5\\text{ ha} - 0{,}70\\text{ ha} = 2{,}80\\text{ hektar}$$
Atau secara fraksional:
$$1 - \\frac{1}{5} = \\frac{4}{5}\\text{ bagian} \\implies \\frac{4}{5} \\times 3{,}5 = 0{,}8 \\times 3{,}5 = 2{,}80\\text{ hektar}$$
Jadi, luas lahan yang akan ditanami tomat dan daun bawang adalah 2,80 hektar (Pilihan D).', 'Fokus penguasaan: Menghitung pecahan komplemen dan perkalian desimal pada masalah nyata luas lahan pertanian.', 'Pusmendik / BSKAP Kemendikdasmen - Numerasi Fase D'),
(159, 159, 'Misalkan panjang rusuk bak kubus mula-mula adalah $s$ meter.
Maka volume bak kubus adalah:
$$V_{\\text{lama}} = s \\times s \\times s = s^3 = 9\\ \\text{m}^3$$
Ukuran balok yang baru setelah diubah:
- Panjang ($p$) $= 2 \\times s = 2s$
- Lebar ($l$) $= \\frac{1}{2} \\times s = \\frac{1}{2}s$
- Tinggi ($t$) $= s$
Maka volume balok baru adalah hasil kali panjang, lebar, dan tinggi:
$$V_{\\text{baru}} = p \\times l \\times t = (2s) \\times \\left(\\frac{1}{2}s\\right) \\times s = \\left(2 \\times \\frac{1}{2}\\right) \\times s^3 = 1 \\times s^3 = s^3$$
Karena $s^3 = 9\\ \\text{m}^3$, maka:
$$V_{\\text{baru}} = 9\\ \\text{m}^3$$
Jadi, volume dari bak yang baru adalah $9\\ \\text{m}^{3}$ (Pilihan B).', 'Fokus penguasaan: Menalar perubahan volume balok akibat penskalaan faktor linier panjang, lebar, dan tinggi.', 'Pusmendik / BSKAP Kemendikdasmen - Numerasi Fase D'),
(160, 160, 'Mari kita hitung durasi waktu perjalanan Pak Bayu:
1. Waktu tempuh berkendara murni:
$$t = \\frac{\\text{Jarak}}{\\text{Kecepatan}} = \\frac{140\\text{ km}}{80\\text{ km/jam}} = 1{,}75\\text{ jam}$$
Ubah $1{,}75\\text{ jam}$ menjadi jam dan menit:
$$1{,}75\\text{ jam} = 1\\text{ jam} + (0{,}75 \\times 60\\text{ menit}) = 1\\text{ jam } 45\\text{ menit}$$
2. Total durasi perjalanan ditambah waktu istirahat 15 menit:
$$\\text{Total waktu} = 1\\text{ jam } 45\\text{ menit} + 15\\text{ menit} = 2\\text{ jam}$$
3. Waktu kedatangan di Semarang:
$$\\text{Waktu tiba} = 06.00 + 02.00 = 08.00$$
Jadi, Pak Bayu dan keluarga tiba di Semarang pada pukul 08.00 (Pilihan B).', 'Fokus penguasaan: Menghitung hubungan jarak, waktu, dan kecepatan dengan penambahan waktu henti sementara.', 'Pusmendik / BSKAP Kemendikdasmen - Numerasi Fase D'),
(161, 161, 'Mari kita hitung rentang hari dari tanggal 30 April hingga 14 Juni:
- Hari di bulan Mei yang dilewati: bulan Mei memiliki 31 hari penuh $\\rightarrow 31\\text{ hari}$.
- Hari di bulan Juni hingga tanggal 14: $\\rightarrow 14\\text{ hari}$.
- Total hari menunggu: $31 + 14 = 45\\text{ hari}$.
Mari kita uji setiap pernyataan:
- Pernyataan A (Benar): Lala memang harus menunggu 45 hari lagi.
- Pernyataan B (Benar): Konversi ke minggu: $45 \\div 7 = 6\\text{ minggu}$ sisa $3\\text{ hari}$.
- Pernyataan C (Salah): Dua bulan penuh berkisar 60-61 hari, sedangkan Lala hanya menunggu 45 hari.
- Pernyataan D (Salah): Dari tanggal 31 Mei ke 14 Juni tersisa tepat $14 - 0 = 14\\text{ hari}$ lagi, bukan 15 hari.
Jadi, pernyataan yang benar adalah A dan B.', 'Fokus penguasaan: Mengonversi dan menghitung durasi kalender waktu baku (hari, minggu, bulan).', 'Pusmendik / BSKAP Kemendikdasmen - Numerasi Fase D'),
(162, 162, 'Mari kita hitung berat buah mangga kweni:
1. Total belanjaan buah Ibu adalah $3\\text{ kg}$.
2. Berat dua buah alpukat mentega adalah $1{,}25\\text{ kg}$.
3. Berat total 7 buah mangga kweni adalah selisihnya:
$$\\text{Berat 7 mangga} = 3\\text{ kg} - 1{,}25\\text{ kg} = 1{,}75\\text{ kg}$$
4. Berat satu buah mangga kweni (dengan asumsi berat masing-masing sama):
$$\\text{Berat 1 mangga} = \\frac{1{,}75\\text{ kg}}{7} = 0{,}25\\text{ kg}$$
Jadi, berat satu buah mangga kweni adalah 0,25 kg (Pilihan B).', 'Fokus penguasaan: Menghitung pembagian dan pengurangan bilangan desimal satuan berat baku.', 'Pusmendik / BSKAP Kemendikdasmen - Numerasi Fase D'),
(163, 163, 'Mari kita samakan seluruh satuan volume ke dalam liter dan desiliter:
- Tangki air berisi $0{,}8\\text{ hektoliter (hl)}$. Karena $1\\text{ hl} = 100\\text{ liter}$, maka volume tangki $= 0{,}8 \\times 100 = 80\\text{ liter}$.
- Bak penampungan berkapasitas $20\\text{ liter} = 20 \\times 10 = 200\\text{ desiliter (dl)}$.
Mari kita uji setiap pernyataan:
- Pernyataan A (Benar): Volume air di dalam tangki tepat 80 liter.
- Pernyataan B (Salah): Pengisian bak penampungan hingga tangki kosong adalah $80 \\div 20 = 4\\text{ kali}$, bukan 5 kali.
- Pernyataan C (Benar): Kebutuhan 10 baris tanaman cabai $= 10 \\times 40\\text{ dl} = 400\\text{ dl} = 40\\text{ liter}$. Karena 40 liter adalah tepat setengah dari 80 liter, volume air tangki berkurang setengahnya.
- Pernyataan D (Salah): Kapasitas bak adalah $20\\text{ liter} = 200\\text{ dl}$, bukan 2.000 dl.
Jadi, pernyataan yang benar adalah A dan C.', 'Fokus penguasaan: Menghitung konversi satuan volume metrik (hl, l, dl) dan penalaran konsumsi proporsional.', 'Pusmendik / BSKAP Kemendikdasmen - Numerasi Fase D'),
(164, 164, 'Volume satu kubus satuan berukuran $1\\text{ cm} \\times 1\\text{ cm} \\times 1\\text{ cm} = 1\\text{ cm}^3$.
Agar kotak dapat menampung tepat 64 kubus satuan, kotak tersebut harus memiliki volume total $64\\text{ cm}^3$.
Mari kita hitung volume tiap pilihan kotak:
- Kotak A: $8\\text{ cm} \\times 2\\text{ cm} \\times 4\\text{ cm} = 64\\text{ cm}^3$ (Tepat menampung 64 kubus satuan) $\\rightarrow$ Benar.
- Kotak B: $4\\text{ cm} \\times 4\\text{ cm} \\times 4\\text{ cm} = 64\\text{ cm}^3$ (Tepat menampung 64 kubus satuan) $\\rightarrow$ Benar.
- Kotak C: $4\\text{ cm} \\times 3\\text{ cm} \\times 5\\text{ cm} = 60\\text{ cm}^3$ (Hanya memuat 60 kubus satuan) $\\rightarrow$ Salah.
- Kotak D: $16\\text{ cm} \\times 2\\text{ cm} \\times 1\\text{ cm} = 32\\text{ cm}^3$ (Hanya memuat 32 kubus satuan) $\\rightarrow$ Salah.
Jadi, kotak yang harus dibawa oleh Doni adalah kotak A dan B.', 'Fokus penguasaan: Menghitung volume balok dan kubus satuan berdimensi $1\\text{ cm}^3$.', 'Pusmendik / BSKAP Kemendikdasmen - Numerasi Fase D'),
(165, 165, 'Perhatikan petunjuk arah dan jarak dari gerbang kebun binatang pada papan petunjuk:
- Arah Barat (kiri gerbang): Jerapah (75 m), Zebra (60 m).
- Arah Timur (kanan gerbang): Capybara (50 m), Kanguru (35 m).
Mari kita uji setiap pernyataan:
- Pernyataan A (Salah): Jarak kandang Zebra adalah $60\\text{ m} = 60 \\times 1.000 = 60.000\\text{ mm}$, bukan $6.000\\text{ mm}$.
- Pernyataan B (Benar): Capybara ($50\\text{ m}$) dan Kanguru ($35\\text{ m}$) berada pada arah yang sama (Timur). Selisih jarak keduanya $= 50 - 35 = 15\\text{ m} = 1.500\\text{ cm}$.
- Pernyataan C (Benar): Dari Jerapah ($75\\text{ m}$ Barat) ke Kanguru ($35\\text{ m}$ Timur), Nisa harus berjalan kembali melewati gerbang: $75 + 35 = 110\\text{ m} = 0{,}11\\text{ km}$.
- Pernyataan D (Salah): Kandang yang paling jauh dari gerbang adalah kandang Jerapah ($75\\text{ m}$), bukan Capybara ($50\\text{ m}$).
Jadi, pernyataan yang benar adalah B dan C.', 'Fokus penguasaan: Menghitung operasi jarak pada garis bilangan dan konversi satuan metrik panjang (km, m, cm, mm).', 'Pusmendik / BSKAP Kemendikdasmen - Numerasi Fase D'),
(166, 166, 'Untuk mengetahui sisa batang rotan yang tidak terpakai, kita hitung pembagian bulat antara total panjang rotan dengan panjang satu buah stik:
1. Hitung banyak stik yang dapat dihasilkan:
$$320 \\div 15 = 21{,}33\\dots$$
Artinya Ayah dapat membuat sebanyak $21\\text{ stik}$ utuh.
2. Hitung total panjang rotan yang terpakai untuk 21 stik:
$$21 \\times 15\\text{ cm} = 315\\text{ cm}$$
3. Hitung sisa batang rotan yang tidak terpakai:
$$\\text{Sisa rotan} = 320\\text{ cm} - 315\\text{ cm} = 5\\text{ cm}$$
Jadi, sisa batang rotan yang tidak terpakai adalah sepanjang 5 cm (Pilihan B).', 'Fokus penguasaan: Menentukan hasil bagi bulat dan sisa pembagian (modulo) dalam masalah pengukuran bahan nyata.', 'Pusmendik / BSKAP Kemendikdasmen - Numerasi Fase D'),
(167, 167, 'Waktu pertemuan serentak berkala ketiga sekolah dihitung menggunakan Kelipatan Persekutuan Terkecil (KPK) dari periode jadwal masing-masing SD:
- SD Cerdas: $2\\text{ minggu} = 2$
- SD Pelita: $3\\text{ minggu} = 3$
- SD Mentari: $4\\text{ minggu} = 2^2$
KPK diperoleh dengan mengalikan semua faktor prima dengan pangkat tertinggi:
$$\\text{KPK}(2, 3, 4) = 2^2 \\times 3 = 4 \\times 3 = 12\\text{ minggu}$$
Jadi, murid ketiga SD tersebut akan bertemu bersama dalam kegiatan olahraga di lapangan setiap 12 minggu sekali (Pilihan C).', 'Fokus penguasaan: Menentukan Kelipatan Persekutuan Terkecil (KPK) pada persoalan jadwal berkala bersama.', 'Pusmendik / BSKAP Kemendikdasmen - Numerasi Fase D'),
(168, 168, 'Mari kita hitung nilai $a$ dan nilai $b$ terlebih dahulu:
1. Menghitung nilai $a$:
$$a = 5 - \\frac{7}{2} = \\frac{10}{2} - \\frac{7}{2} = \\frac{3}{2}$$
2. Menghitung nilai $b$:
$$b = \\frac{3}{4} - \\frac{1}{2} = \\frac{3}{4} - \\frac{2}{4} = \\frac{1}{4}$$
3. Menghitung nilai dari $a - 2b$:
$$a - 2b = \\frac{3}{2} - 2\\left(\\frac{1}{4}\\right) = \\frac{3}{2} - \\frac{2}{4} = \\frac{3}{2} - \\frac{1}{2} = \\frac{2}{2} = 1$$
Jadi, nilai dari $a - 2b$ adalah 1 (Pilihan A).', 'Fokus penguasaan: Menyederhanakan nilai variabel pecahan dan mengoperasikan substitusi aljabar sederhana.', 'Pusmendik / BSKAP Kemendikdasmen - Numerasi Fase D'),
(169, 169, 'Perhatikan gambar potongan kue ulang tahun Desti:
1. Keseluruhan kue dipotong menjadi 8 potongan juring yang sama besar.
2. Dari 8 potongan tersebut, terdapat 2 potongan yang berwarna cokelat.
3. Nilai pecahan bagian kue berwarna cokelat terhadap keseluruhan kue adalah:
$$\\text{Bagian cokelat} = \\frac{2}{8}$$
Menyederhanakan pecahan dengan membagi pembilang dan penyebut dengan 2:
$$\\frac{2 \\div 2}{8 \\div 2} = \\frac{1}{4}$$
Jadi, kue yang berwarna cokelat adalah $\\frac{1}{4}$ bagian dari keseluruhan kue (Pilihan B).', 'Fokus penguasaan: Menentukan representasi pecahan biasa dari visual bagian bidang lingkaran.', 'Pusmendik / BSKAP Kemendikdasmen - Numerasi Fase D'),
(170, 170, 'Keliling bangun datar adalah jumlah seluruh panjang sisi terluar yang membatasinya.
Mari kita telusuri panjang setiap sisi luar berdasarkan tanda dan ukuran pada gambar:
1. Sisi tegak kiri: memiliki tanda garis ganda ($==$) dengan ukuran $8\\text{ m}$.
2. Sisi mendatar atas bagian kiri: memiliki tanda garis ganda ($==$), sehingga panjangnya $= 8\\text{ m}$.
3. Sisi tegak tengah (ke atas): bertanda garis tunggal ($-$), sama panjang dengan sisi horizontal atas trapesium yang juga bertanda garis tunggal ($-$) dan berukuran $6\\text{ m}$. Maka sisi tegak tengah $= 6\\text{ m}$.
4. Sisi mendatar atas trapesium: berukuran $6\\text{ m}$.
5. Sisi miring trapesium: dihitung menggunakan teorema Pythagoras. Alas segitiga siku-siku di bawah sisi miring adalah panjang garis putus-putus dikurangi sisi mendatar atas ($14\\text{ m} - 6\\text{ m} = 8\\text{ m}$) dan tingginya adalah $6\\text{ m}$:
$$\\text{Sisi miring} = \\sqrt{8^2 + 6^2} = \\sqrt{64 + 36} = \\sqrt{100} = 10\\text{ m}$$
6. Sisi tegak kanan: setinggi persegi panjang bagian bawah $= 8\\text{ m}$.
7. Sisi mendatar bawah: total panjang sisi mendatar kiri ditambah garis putus-putus $= 8\\text{ m} + 14\\text{ m} = 22\\text{ m}$.
Menjumlahkan seluruh sisi luar:
$$\\text{Keliling} = 8 + 8 + 6 + 6 + 10 + 8 + 22 = 68\\text{ meter}$$
Jadi, keliling bidang tanah Pak Boni adalah 68 meter (Pilihan B).', 'Fokus penguasaan: Menghitung keliling bangun gabungan poligon tidak beraturan dengan teorema Pythagoras.', 'Pusmendik / BSKAP Kemendikdasmen - Numerasi Fase D'),
(171, 171, 'Mari kita selesaikan secara bertahap:
1. Hitung total seluruh siswa kelas 6 peserta kegiatan:
$$\\text{Total siswa} = 28 + 36 + 32 = 96\\text{ siswa}$$
2. Hitung total buku bacaan yang dibagikan (masing-masing siswa menerima 3 buku):
$$\\text{Total buku} = 96 \\times 3 = 288\\text{ buku}$$
3. Hitung banyak dus yang diperlukan jika 1 dus memuat 24 buku:
$$\\text{Banyak dus} = \\frac{288\\text{ buku}}{24\\text{ buku/dus}} = 12\\text{ dus}$$
Jadi, dus buku yang dibutuhkan untuk kegiatan tersebut adalah 12 dus (Pilihan C).', 'Fokus penguasaan: Menyelesaikan operasi hitung campuran bilangan bulat (penjumlahan, perkalian, dan pembagian) kontekstual.', 'Pusmendik / BSKAP Kemendikdasmen - Numerasi Fase D'),
(172, 172, 'Total target jarak lari bersama adalah $10\\text{ km}$.
Pertama, kita ubah pecahan $\\frac{3}{5}$ ke dalam bentuk persentase dan kilometer:
$$\\frac{3}{5} \\times 100\\% = 60\\% \\quad \\text{atau} \\quad \\frac{3}{5} \\times 10\\text{ km} = 6\\text{ km}$$
Mari kita periksa jarak tempuh masing-masing anak:
- Andi: $0{,}4 \\times 10\\text{ km} = 4\\text{ km}$ ($40\\%$).
- Beni: $60\\% \\times 10\\text{ km} = 6\\text{ km}$.
- Citra: $\\frac{1}{3} \\times 10\\text{ km} \\approx 3{,}33\\text{ km}$.
- Dika: $5{,}5\\text{ km}$ ($55\\%$). 
Terlihat jelas bahwa peserta yang telah menempuh tepat $60\\%$ atau setara $\\frac{3}{5}$ dari total jarak adalah Beni.
Jadi, yang telah menempuh jarak lari sebesar $\\frac{3}{5}$ dari total jarak adalah Beni (Pilihan B).', 'Fokus penguasaan: Menentukan kesetaraan nilai antara pecahan biasa, desimal, dan persen pada perbandingan jarak.', 'Pusmendik / BSKAP Kemendikdasmen - Numerasi Fase D'),
(173, 173, 'Mari kita analisis sifat-sifat bangun datar tersebut:
1. Keempat sisinya sama panjang ($s$): sifat ini dimiliki oleh **Persegi** dan **Belah Ketupat**.
2. Keempat sudutnya adalah sudut siku-siku ($90^\\circ$): sifat ini dimiliki oleh **Persegi** dan **Persegi Panjang**.
3. Kedua diagonalnya sama panjang dan berpotongan saling tegak lurus: sifat ini dimiliki oleh **Persegi**.
Bangun datar segiempat teratur yang memiliki empat sisi sama panjang dan empat sudut siku-siku adalah **Persegi**.
Jadi, nama bangun datar tersebut adalah Persegi (Pilihan A).', 'Fokus penguasaan: Mengidentifikasi karakteristik bangun datar segiempat berdasarkan relasi sisi, sudut, dan diagonal.', 'Pusmendik / BSKAP Kemendikdasmen - Numerasi Fase D'),
(174, 174, 'Mari kita hitung akumulasi waktu aktivitas Rani secara berurutan:
1. Waktu berangkat dari rumah: pukul $07.25$.
2. Waktu tiba di sanggar setelah 45 menit perjalanan:
$$07.25 + 45\\text{ menit} = 07.70 = 08.10$$
3. Waktu selesai latihan menari (durasi 1 jam 35 menit):
$$08.10 + 1\\text{ jam } 35\\text{ menit} = 09.45$$
4. Waktu meninggalkan sanggar setelah istirahat 20 menit:
$$09.45 + 20\\text{ menit} = 09.65 = 10.05$$
Jadi, Rani meninggalkan sanggar untuk pulang pada pukul 10.05 (Pilihan C).', 'Fokus penguasaan: Menghitung operasi penambahan satuan waktu (jam dan menit) dalam urutan kejadian kontekstual.', 'Pusmendik / BSKAP Kemendikdasmen - Numerasi Fase D'),
(175, 175, 'Berdasarkan denah taman kota pada bagian parkir mobil:
1. Lebar area parkir mobil adalah $4\\text{ meter}$.
2. Panjang area parkir mobil tertulis: “24 m lebih besar daripada lebarnya”, sehingga:
$$\\text{Panjang area parkir} = 4\\text{ m} + 24\\text{ m} = 28\\text{ meter}$$
3. Setiap mobil membutuhkan lebar ruang parkir $2\\text{ meter}$. Maka kapasitas total parkir mobil adalah:
$$\\text{Kapasitas total} = \\frac{28\\text{ m}}{2\\text{ m/mobil}} = 14\\text{ mobil}$$
4. Pada gambar mula-mula terdapat $5\\text{ mobil}$ yang parkir. Karena $1\\text{ mobil}$ baru saja keluar, maka mobil yang sedang parkir tersisa:
$$5 - 1 = 4\\text{ mobil}$$
5. Sisa mobil lagi yang dapat diparkir sekarang adalah:
$$\\text{Sisa kapasitas} = 14 - 4 = 10\\text{ mobil}$$
Jadi, mobil lagi yang dapat diparkir di area tersebut sekarang adalah 10 mobil (Pilihan B).', 'Fokus penguasaan: Menghitung panjang dan kapasitas daya tampung linier area parkir berdasarkan data selisih dan pengurangan objek.', 'Pusmendik / BSKAP Kemendikdasmen - Numerasi Fase D'),
(176, 176, 'Mari kita amati denah taman kota pada bagian lahan parkir motor:
1. Terdapat 2 petak parkir motor berukuran $10\\text{ m} \\times 2\\text{ m} = 20\\text{ m}^2$ per petak.
Maka luas total lahan parkir motor adalah:
$$\\text{Luas total} = 20\\text{ m}^2 + 20\\text{ m}^2 = 40\\text{ m}^2$$
(Sehingga Pernyataan D Benar).
2. Daya tampung maksimal parkir motor ($1\\text{ motor} = 2\\text{ m}^2$):
$$\\text{Kapasitas maksimal} = \\frac{40\\text{ m}^2}{2\\text{ m}^2/\\text{motor}} = 20\\text{ motor}$$
3. Pada pukul 13.00, setelah 12 motor masuk, parkiran masih dapat menampung 1 motor lagi. Artinya, total motor yang ada di parkiran pada pukul 13.00 adalah:
$$\\text{Motor pada pukul 13.00} = 20 - 1 = 19\\text{ motor}$$
(Sehingga Pernyataan C Salah, karena terisi 19 motor bukan 20 motor).
4. Sebelum 12 motor baru masuk, motor yang sudah ada di parkiran adalah:
$$19 - 12 = 7\\text{ motor}$$
(Sehingga Pernyataan B Salah, karena terisi 7 motor bukan 8 motor).
5. Pada denah mula-mula terlihat ada 11 motor. Jika tersisa 7 motor sebelum 12 motor baru masuk pada pukul 13.00, maka motor yang sudah keluar sebelum pukul 13.00 adalah $11 - 7 = 4\\text{ motor}$ (Sehingga Pernyataan A Benar).
Jadi, pernyataan yang benar adalah A dan D.', 'Fokus penguasaan: Menganalisis luas area, kapasitas daya tampung, dan dinamika perubahan kendaraan keluar masuk parkir.', 'Pusmendik / BSKAP Kemendikdasmen - Numerasi Fase D'),
(177, 177, 'Berdasarkan infografis pada gambar:
- Danu membaca $\\frac{2}{3}$ bagian buku (setara $\\approx 66{,}67\\%$).\\n- Antok membaca $50\\%$ bagian buku.\\n- Caca membaca $\\frac{3}{4}$ bagian buku.\\n\\nUntuk mengubah pecahan biasa $\\frac{3}{4}$ ke dalam bentuk persen, kalikan dengan $100\\%$:
$$\\text{Persentase} = \\frac{3}{4} \\times 100\\% = 75\\%$$
Jadi, persentase seluruh halaman buku yang sudah selesai dibaca oleh Caca adalah 75% (Pilihan D).', 'Fokus penguasaan: Mengonversi bentuk pecahan biasa ke persentase berdasarkan data infografis.', 'Pusmendik / BSKAP Kemendikdasmen - Numerasi Fase D'),
(178, 178, 'Mari kita hitung banyak halaman yang telah diselesaikan masing-masing anak:
1. Danu (Buku Biru - 329 halaman): membaca $\\frac{2}{3}$ bagian:
$$\\text{Halaman Danu} = \\frac{2}{3} \\times 329 = \\frac{658}{3} \\approx 219{,}33 \\approx 219\\text{ halaman}$$
(Pernyataan A Benar).
2. Antok (Buku Hijau - 340 halaman): membaca $50\\%$ bagian:
$$\\text{Halaman Antok} = 50\\% \\times 340 = 0{,}5 \\times 340 = 170\\text{ halaman}$$
(Pernyataan B Benar).
3. Caca (Buku Merah - 382 halaman): membaca $\\frac{3}{4}$ bagian:
$$\\text{Halaman Caca} = \\frac{3}{4} \\times 382 = 286{,}5\\text{ halaman}$$
(Pernyataan C Salah, karena diperoleh 286,5 halaman, bukan 287 halaman bulat).
4. Buku paling tebal adalah Buku Merah (382 halaman, dibaca Caca), bukan Buku Hijau (340 halaman, dibaca Antok) (Pernyataan D Salah).
Jadi, pernyataan yang benar adalah A dan B.', 'Fokus penguasaan: Menghitung nilai bagian pecahan dan persen dari kuantitas total halaman buku nyata.', 'Pusmendik / BSKAP Kemendikdasmen - Numerasi Fase D'),
(179, 179, 'Anak usia 10–12 tahun memerlukan asupan protein minimal $55\\text{ gram}$ per hari.
Pada grafik disajikan kandungan protein per $100\\text{ gram}$ makanan:
- Daging sapi: $26\\text{ gram}$
- Keju: $25\\text{ gram}$
- Ikan: $22\\text{ gram}$
- Telur ayam: $13\\text{ gram}$
- Alpukat / Susu sapi: $2\\text{ gram}$ / $\\approx 3{,}2\\text{ gram}$
Jika porsi makanan yang disediakan adalah $250\\text{ gram}$, maka faktor pengalinya adalah $\\frac{250}{100} = 2{,}5$.
Mari kita hitung asupan protein untuk porsi $250\\text{ gram}$:
- A. Daging Sapi: $2{,}5 \\times 26\\text{ g} = 65\\text{ gram}$ (Memenuhi, karena $65 \\ge 55$) $\\rightarrow$ Benar.
- B. Telur Ayam: $2{,}5 \\times 13\\text{ g} = 32{,}5\\text{ gram}$ (Tidak memenuhi, karena $32{,}5 < 55$) $\\rightarrow$ Salah.
- C. Ikan: $2{,}5 \\times 22\\text{ g} = 55\\text{ gram}$ (Memenuhi, pas $55\\text{ gram}$) $\\rightarrow$ Benar.
- D. Susu Sapi: $2{,}5 \\times 3{,}2\\text{ g} = 8\\text{ gram}$ (Sangat kurang dari 55 gram) $\\rightarrow$ Salah.
Jadi, makanan yang dapat mencukupi kebutuhan protein minimal harian dalam satu porsi adalah Daging sapi (A) dan Ikan (C).', 'Fokus penguasaan: Menghitung proporsi nilai gizi berdasarkan faktor skala porsi massa makanan dari diagram batang.', 'Pusmendik / BSKAP Kemendikdasmen - Numerasi Fase D'),
(180, 180, 'Target kebutuhan gizi harian ibu hamil:
- Protein: $70\\text{ sampai } 100\\text{ gram}$
- Lemak: $62\\text{ sampai } 67\\text{ gram}$
Konsumsi saat ini (dari grafik kedua):
- Lemak baru tercapai: $46\\text{ gram}$ (kurang minimal $62 - 46 = 16\\text{ gram}$).
- Protein baru tercapai: $58\\text{ gram}$ (kurang minimal $70 - 58 = 12\\text{ gram}$).
Jika ibu hamil menambah $50\\text{ gram}$ makanan, faktor pengalinya adalah $\\frac{50}{100} = 0{,}5$ dari grafik pertama:
- Pernyataan A (Salah): Tambah 50 g ikan $\\rightarrow$ protein bertambah $0{,}5 \\times 22 = 11\\text{ g}$. Total protein $= 58 + 11 = 69\\text{ gram}$. Karena $69 < 70$, kebutuhan minimal belum terpenuhi.
- Pernyataan B (Benar): Tambah 50 g keju $\\rightarrow$ lemak bertambah $0{,}5 \\times 33 = 16{,}5\\text{ g}$. Total lemak $= 46 + 16{,}5 = 62{,}5\\text{ gram}$. Nilai ini pas berada di rentang ideal (62–67 gram).
- Pernyataan C (Benar): Tambah 50 g daging sapi $\\rightarrow$ protein bertambah $0{,}5 \\times 26 = 13\\text{ g}$. Total protein $= 58 + 13 = 71\\text{ gram}$. Nilai ini sudah masuk batas aman minimal (70–100 gram).
- Pernyataan D (Salah): Kekurangan lemak adalah 16 gram, sedangkan kekurangan protein adalah 12 gram. Jadi kekurangan lemak justru lebih banyak, bukan lebih sedikit.
Jadi, pernyataan yang benar adalah B dan C.', 'Fokus penguasaan: Mengombinasikan data multi-diagram untuk menguji kecukupan nilai gizi harian proporsional.', 'Pusmendik / BSKAP Kemendikdasmen - Numerasi Fase D')
ON DUPLICATE KEY UPDATE
    `question_id` = VALUES(`question_id`),
    `explanation_text` = VALUES(`explanation_text`),
    `reasoning_guide` = VALUES(`reasoning_guide`),
    `reference_url` = VALUES(`reference_url`);

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- SELESAI: Pembenihan Bank Soal Recall Kemampuan Matematika 30 Butir Berhasil.
-- =============================================================================

-- =============================================================================
-- PEMBENIHAN BANK SOAL RECALL KEMAMPUAN: BAHASA INDONESIA (FASE D)
-- Platform Pembelajaran & Drill-and-Practice Adaptif TKA SMP (Fase D)
-- Arsitektur ERD Versi: 6.0 FINAL (Tanpa CTT, 3 Level Kognitif Murni Kemendikdasmen)
-- Dokumen Acuan: TKA-DOC-02 (SRS), TKA-DOC-09 (Kurikulum), TKA-DOC-11 (Bank Soal),
--                TKA-DOC-12 (Penilaian Mastery), TKA-DOC-13 (Blueprint Asesmen)
-- File: Migration 1/Migration 1/006_seed_recall_kemampuan_bahasa_indonesia_v6.sql
-- Total: 10 Stimuli Wacana (ID 25-34), 30 Butir Soal Master (ID 121-150),
--        120 Pilihan Jawaban (ID 481-600), 30 Pembahasan Pasca-Sesi (ID 121-150)
-- Bank Type: RECALL (Terisolasi dari LEVEL_EXERCISE dan SIMULATION)
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. PEMBENIHAN WACANA BACAAN BERSAMA LITERASI RECALL (STIMULI - 10 Wacana)
-- -----------------------------------------------------------------------------
INSERT INTO `stimuli` (`id`, `subject_id`, `title`, `stimulus_text`, `stimulus_image_url`) VALUES
(25, 2, 'Fabel: Danau untuk Semua', 'Di hutan ada sebuah danau tempat semua binatang minum. Suatu pagi, air danau menjadi kotor karena Rino si badak berendam di dalamnya. Binatang-binatang lain jadi tidak bisa minum. Namun, mereka takut menegur Rino karena badannya besar dan bercula. Mereka diam seribu bahasa. Rino malah merasa bangga karena jadi pusat perhatian.

Esoknya, Rino masih berendam. Binatang-binatang makin kehausan.
“Aduh, bagaimana ini?” ujar Bani si kelinci. Hewan lain juga mulai gelisah.
Binatang-binatang hutan pun berkumpul dan bermusyawarah. Hari si harimau mengusulkan agar meminta bantuan Ucil si kancil.
“Setuju!!” semua binatang berteriak antusias.

Ucil menemui Rino.
“Selamat siang. Maaf mengganggu Tuan. Ada kabar penting,” kata Ucil dengan lembut.
Rino segera bangun. Ia merasa tersanjung dengan ucapan Ucil.
“Kabar penting? Cepat bicara!” kata Rino.
“Hamba kasihan kepada Tuan. Badan besar berendam di danau kecil. Tidak pantas, Tuan. Oh ya, ada makhluk yang menutup jalan air supaya tidak mengalir. Sayang, makhluk itu tidak kelihatan oleh mata kita, dia makhluk gaib,” lanjut Ucil.

Rino mengerutkan dahinya.
“Percayalah, Tuan,” bujuk Ucil.
Rino segera berjalan menuju pohon nangka. Ia pun mengawasi pohon itu selama setengah hari. Sementara itu, binatang yang lain bergantian datang untuk minum air danau.

Rino selesai mengawasi pohon nangka. Ia kembali menuju danau. Sementara, binatang lainnya sudah meninggalkan danau. Mereka sudah tidak haus lagi.', '/assets/image_soal/recall_kemampuan/bahasa_indonesia/recall_kemampuan_bahasa_indonesia_nomer_1_2_3.png'),
(26, 2, 'Hewan Pemakan Daun, Apa Itu?', 'Hewan Pemakan Daun, Apa Itu?

Berdasarkan jenis makanannya, hewan secara umum dikelompokkan menjadi tiga kelompok utama, yaitu karnivora (hewan pemakan daging), herbivora (hewan pemakan tumbuhan), dan omnivora (hewan pemakan segala). Di antara kelompok pemakan tumbuhan, terdapat pengelompokan yang lebih khusus berdasarkan bagian tumbuhan yang dikonsumsinya.

Salah satu kelompok khusus tersebut adalah folivora. Hewan folivora adalah kelompok hewan herbivora yang secara khusus mengonsumsi dedaunan sebagai sumber makanan utamanya. Daun yang dipilih biasanya daun-daun muda yang masih segar dan kaya akan kandungan air serta nutrisi.

Mencerna daun bukanlah hal yang mudah bagi hewan karena daun memiliki serat selulosa yang sangat alot dan bernilai energi relatif rendah. Agar dapat menyerap energi secara maksimal dan tidak membuang banyak tenaga, hewan folivora memiliki adaptasi khusus berupa saluran pencernaan yang panjang serta gerak tubuh yang lambat dan tenang. Gerakan lambat ini sangat berguna untuk menghemat energi tubuh mereka.

Beberapa contoh satwa folivora yang terkenal di dunia antara lain koala dan panda. Koala adalah hewan khas Australia yang hampir seluruh makanannya berupa daun eukaliptus, sedangkan panda di Asia sangat gemar memakan daun dan tunas bambu muda.', NULL),
(27, 2, 'Fabel: Kenthus yang Sombong', 'Kenthus yang Sombong

Di tepi sebuah rawa yang luas, hiduplah seekor katak bernama Kenthus bersama saudaranya, Koko. Kenthus adalah katak yang selalu membanggakan diri dan merasa dirinya paling hebat dan paling kuat di antara seluruh penghuni rawa.

Suatu hari, Koko melompat-lompat pulang ke sarangnya dengan napas terengah-engah. Dengan mata membulat, Koko menceritakan bahwa ia baru saja melihat seekor makhluk luar biasa besar di padang rumput tepi rawa, yaitu seekor anak lembu. Koko menjelaskan kepada Kenthus bahwa meskipun tubuh anak lembu itu sangat besar, makhluk itu sama sekali tidak jahat, tidak memakan katak, dan hanya sibuk memakan rumput di tepi rawa.

Mendengar penuturan Koko, rasa iri dan sombong Kenthus langsung muncul. Ia tidak mau kalah dan merasa tersaingi. Kenthus berkata dengan nada meremehkan bahwa ia juga bisa menjadi sebesar anak lembu itu. Kenthus kemudian mulai menarik napas dalam-dalam dan meniupkan udara ke dalam perutnya. Tubuhnya mulai membesar seperti balon.

Koko yang cemas segera mengingatkan Kenthus agar berhenti, namun Kenthus tidak memedulikannya. Kenthus terus meniup dan mengembangkan perutnya lebih besar lagi agar bisa menandingi ukuran anak lembu. Hingga akhirnya, terdengar suara letupan keras. Perut Kenthus mengembang melampaui batas kemampuannya, pecah, dan ia pun jatuh lemas tak berdaya menanggung akibat dari kesombongannya.', NULL),
(28, 2, 'Surat Margaret Hamilton: Misi Apollo 11', '8 Agustus 1969

Dear Sahabatku Jill Tarter,

Saat kau membaca ini, aku sedang liburan bersama Lauren. Aku baru menyelesaikan rapat terakhir dengan tim pendaratan Apollo 11. Seperti yang pernah kuceritakan kepadamu. Aku memimpin tim penyusun kode pemrograman komputer untuk pesawat itu. Pada 20 Juli lalu, Apollo 11 berhasil mendarat di bulan. Kamu pasti sudah tahu itu!

Hari-hari itu sangat menegangkan. Komputer sempat mengirim pesan salah. Itu terjadi saat para astronaut—Neil Armstrong dan Edwin Aldrin—hampir gagal mendarat di Bumi! Untungnya, aku telah menyusun banyak kode komputer di pesawat itu. Aku melakukan itu agar mereka fokus pada misi utama dan tetap bisa mendarat. Empat hari kemudian, mereka kembali dengan selamat ke Samudra Pasifik.

Neil sempat bercerita sebelum rapat. Bulan sangat dingin, lebih dari Kutub Utara. Permukaannya penuh kawah, tanpa angin dan cuaca. Neil dan Edwin membawa pulang pasir bulan untuk diteliti. Tak ada makhluk yang mereka temui.
Aku bersyukur kode-kodeku bisa mengantar manusia ke bulan. Semoga suatu hari bisa juga ke Venus. Lauren menitipkan salam untukmu, dia bilang matamu seperti bintang Polaris yang ia lihat lewat teleskop pemberianmu.

Salam hangat,
Margaret Hamilton', '/assets/image_soal/recall_kemampuan/bahasa_indonesia/recall_kemampuan_bahasa_indonesia_nomer_10_11_12.png'),
(29, 2, 'Petunjuk: Cara Membuat Magnet Kulkas dari Mainan Hewan Plastik', 'CARA MEMBUAT MAGNET KULKAS DARI MAINAN HEWAN PLASTIK

Apakah kamu punya mainan hewan plastik bekas? Ternyata, mainan bekas bisa dimanfaatkan kembali. Yuk, ikuti petunjuknya!

Bahan dan alat:
• Mainan hewan plastik
• Cat semprot (tambahan)
• Tanah liat
• Gunting atau cutter
• Lem tembak
• Magnet

Langkah pembuatan:
1. Potong mainan hewan menjadi dua bagian. Pastikan meminta bantuan orang dewasa ya untuk keamanan.
2. Periksa bagian-bagian mainan. Jika ada bagian yang berlubang, isilah dengan tanah liat.
3. Warnai mainan hewan dengan cat semprot agar menarik. Namun, kamu juga boleh melewati langkah ini.
4. Tempelkan magnet pada bagian yang rata dengan lem tembak.
5. Tunggu beberapa menit hingga lem mengering.
6. Magnet kulkas dari mainan hewan sudah siap ditempel!', '/assets/image_soal/recall_kemampuan/bahasa_indonesia/recall_kemampuan_bahasa_indonesia_nomer_13_14_15.png'),
(30, 2, 'Infografis: Beda Air Putih dan Air Mineral', 'BEDA AIR PUTIH DAN AIR MINERAL

Walaupun wujud, warna, dan rasanya cenderung mirip, air mineral dan air putih tidaklah sama. Keduanya memiliki perbedaan dari segi sumber, proses pengolahan, maupun kandungannya.

AIR PUTIH:
• Didapatkan dari sungai, danau, sumur, atau dari keran rumah.
• Harus direbus dulu, sebab terdapat bakteri dan parasit dari kotoran manusia/hewan.
• Derajat keasaman (pH) antara 5–7,5.
• Kandungan nutrisi: Natrium dan Kalium (membantu sistem metabolisme tubuh, menyerap dan mengedarkan vitamin dalam tubuh).

AIR MINERAL:
• Diambil dari sumber mata air pegunungan vulkanik yang kaya akan mineral alami.
• Derajat keasaman (pH) antara 6–8,5.
• Kandungan nutrisi alami:
  - Potassium: Membantu fungsi kerja jantung.
  - Magnesium: Menjaga tekanan darah normal, meningkatkan kesehatan tulang, dan membantu kinerja otot.
  - Elektrolit: Mencegah terjadinya dehidrasi tubuh.
  - Sulfat: Membantu mencerna makanan menjadi lebih baik.', '/assets/image_soal/recall_kemampuan/bahasa_indonesia/recall_kemampuan_bahasa_indonesia_nomer_16_17_18.png'),
(31, 2, 'Cerpen: Antre, Dong! (Toko Buku Gemar)', 'Tia dan Devi sedang berada di Toko Buku Gemar. Mereka mencari buku pelajaran. Setelah menemukan buku yang dicari, mereka menuju ke kasir. Mereka menempati urutan kelima dan keenam. Tak lama kemudian, ada orang yang mengantre di belakang mereka. Mereka sabar menunggu giliran membayar di kasir.

Namun, tiba-tiba seorang pemuda berjalan ke antrean paling depan. Tentu saja, orang-orang yang sudah mengantre lebih dulu memprotes. “Tolong, antre, Dik,” kata seorang ibu yang berada di belakangnya.
“Maaf, Bu, saya harus cepat-cepat. Ini juga hanya satu buku, pasti tidak akan lama. Tidak akan sampai lima menit,” kata pemuda itu.
“Tidak boleh seperti itu, Nak. Kita harus membudayakan antre. Jika kamu harus cepat-cepat, bolehkah saya tahu alasannya?” ucap ibu itu.
“Iya, Kak, kita harus antre. Semua yang ada di sini juga ingin cepat dilayani. Apa Kakak tidak malu melihat seorang ibu-ibu saja bersedia mengantre? Kakak yang muda justru bertingkah sebaliknya,” sahut Tia.

Devi terlihat hanya diam dan mengangguk. Mendengar ada suara seperti keributan, Pak Satpam pun masuk. Dia menenangkan situasi. Pemuda itu harus tetap mengantre sesuai antrean.', '/assets/image_soal/recall_kemampuan/bahasa_indonesia/recall_kemampuan_bahasa_indonesia_nomer_19_20_21.png'),
(32, 2, 'Diagram: Struktur Lapisan Gigi', 'STRUKTUR LAPISAN GIGI

• Enamel:
  Lapisan terluar gigi berupa cangkang keras. Lapisan ini sangat kuat bahkan melebihi kekuatan tulang. Namun, jika enamel mengalami kerusakan atau terkikis, ia tidak memiliki sel hidup sehingga tidak bisa memperbaiki dirinya sendiri secara alami.

• Dentin:
  Lapisan di bawah enamel yang berisi lubang-lubang mikroskopis kecil. Saluran lubang tersebut terhubung langsung dengan saraf gigi. Jika lapisan enamel rusak atau berlubang, suhu makanan/minuman panas atau dingin bisa langsung masuk ke dentin sehingga menimbulkan rasa sakit atau sensasi ngilu nyut-nyutan.

• Pulpa:
  Bagian terdalam dan merupakan inti gigi yang sangat sensitif. Di dalam rongga pulpa terdapat jaringan pembuluh darah penyuplai nutrisi dan serabut saraf gigi.', '/assets/image_soal/recall_kemampuan/bahasa_indonesia/recall_kemampuan_bahasa_indonesia_nomer_22_23_24.png'),
(33, 2, 'Puisi: Surat untuk Sahabat', 'Surat untuk Sahabat

Senyum itu enggan lepas dari bibirmu
Ketika kau melihat kedatanganku
Uluran tanganmu menyambutku
Untuk selalu bersama dan saling berpegang erat
Menghadapi segala suka maupun duka

Bila sesekali kau marah
Itu karena aku tak mau memahamimu
Bila sesekali aku berbuat salah
Maafmu selalu terbuka untukku

Kata terima kasih kuanggap lebih manis daripada kata maaf
untuk segala keceriaan yang selalu kau bagi
untuk segala ketulusan hati yang selalu kau beri
dan untuk kesetiaan yang tak akan pernah lekang oleh masa

Bila kita dewasa nanti
dan jarak juga waktu memisahkan kita
Satu harapku dalam hati
Kata persahabatan tidak akan pernah menjadi sebuah kenangan', NULL),
(34, 2, 'Infografis: Kerupuk, Pelengkap Makanan yang Mendunia', 'KERUPUK, PELENGKAP MAKANAN YANG MENDUNIA

• Kerupuk bukan hal asing bagi masyarakat Indonesia.
• Kerupuk adalah pelengkap makanan, bahkan menjadi bahan utama di hidangan nusantara.
• Tekstur renyah, rasa gurih, dan harga yang relatif murah menjadi alasan mengapa kerupuk sangat disukai.
• Kerupuk sudah ada sejak abad ke-9 atau ke-10 masehi, sebagaimana tertulis di Prasasti Batu Pura.
• Kerupuk yang paling tua dan sudah lama dikonsumsi di Indonesia adalah kerupuk rambak (kulit).
• Kerupuk buatan Indonesia juga digemari di luar negeri! Nilai jual ekspor ke mancanegara pada tahun 2021 tercatat lebih dari 35 juta dolar Amerika Serikat.
• Volume ekspor kerupuk Indonesia mencapai lebih dari 22 juta kilogram. Oleh karena itu, kerupuk asal nusantara kini semakin mendunia.

Berbagai Jenis Kerupuk Nusantara:
1. Kerupuk Bawang
2. Kerupuk Udang
3. Kerupuk Kulit / Rambak
4. Rengginang
5. Kerupuk Putih
6. Kerupuk Ikan
7. Kerupuk Melarat
8. Kerupuk Gendar', '/assets/image_soal/recall_kemampuan/bahasa_indonesia/recall_kemampuan_bahasa_indonesia_nomer_28_29_30.png')
ON DUPLICATE KEY UPDATE 
    `subject_id` = VALUES(`subject_id`), 
    `title` = VALUES(`title`), 
    `stimulus_text` = VALUES(`stimulus_text`), 
    `stimulus_image_url` = VALUES(`stimulus_image_url`);

-- -----------------------------------------------------------------------------
-- 2. PEMBENIHAN MASTER BANK SOAL RECALL BAHASA INDONESIA (QUESTION_BANKS - 30 Butir Soal)
-- ID: 121 - 150 (Melanjutkan urutan ID dari paket Simulasi 1-120)
-- -----------------------------------------------------------------------------
INSERT INTO `question_banks` (`id`, `subject_id`, `sub_material_id`, `cognitive_level_id`, `stimulus_id`, `bank_type`, `question_format`, `question_text`, `question_image_url`, `is_active`) VALUES
(121, 2, 14, 1, 25, 'RECALL', 'SINGLE_CHOICE', 'Siapa yang mengusulkan untuk meminta bantuan hewan yang cerdik?', NULL, TRUE),
(122, 2, 15, 2, 25, 'RECALL', 'SINGLE_CHOICE', '“Mereka diam seribu bahasa.” Apa arti “diam seribu bahasa” pada teks fabel tersebut?', NULL, TRUE),
(123, 2, 16, 3, 25, 'RECALL', 'COMPLEX_CHOICE', 'Apa contoh peristiwa yang dapat ditemukan dalam kehidupan sehari-hari berdasarkan kejadian yang dialami Ucil pada cerita tersebut? Pilihlah semua pernyataan yang sesuai!', NULL, TRUE),
(124, 2, 11, 1, 26, 'RECALL', 'COMPLEX_CHOICE', 'Apa saja contoh hewan folivora berdasarkan informasi tersebut? Klik pada setiap pilihan jawaban benar! Jawaban benar lebih dari satu.', NULL, TRUE),
(125, 2, 11, 2, 26, 'RECALL', 'SINGLE_CHOICE', 'Pernyataan mana yang benar dari informasi pada teks di atas?', NULL, TRUE),
(126, 2, 12, 2, 26, 'RECALL', 'SINGLE_CHOICE', 'Apa gagasan utama yang disampaikan pada paragraf ketiga teks tersebut?', NULL, TRUE),
(127, 2, 14, 1, 27, 'RECALL', 'COMPLEX_CHOICE', 'Apa yang dijelaskan Koko tentang anak lembu? Klik pada setiap pilihan jawaban benar! Jawaban benar lebih dari satu.', NULL, TRUE),
(128, 2, 15, 2, 27, 'RECALL', 'SINGLE_CHOICE', 'Apa kejadian yang membuat Kenthus merasa menyesal?', NULL, TRUE),
(129, 2, 16, 3, 27, 'RECALL', 'COMPLEX_CHOICE', 'Amel telah membaca cerita tersebut. Ia merasakan beberapa reaksi saat membacanya. Bagaimana reaksi Amel saat membaca akhir cerita tersebut? Pilihlah semua pernyataan yang benar berdasarkan isi teks!', NULL, TRUE),
(130, 2, 11, 1, 28, 'RECALL', 'SINGLE_CHOICE', 'Dalam teks, terdapat kalimat “Hari-hari itu sangat menegangkan.” Makna kata menegangkan dalam kalimat tersebut adalah ….', NULL, TRUE),
(131, 2, 12, 2, 28, 'RECALL', 'SINGLE_CHOICE', 'Surat membahas peran kode komputer dalam misi Apollo 11. Manakah pernyataan yang mendukung ide utama tersebut?', NULL, TRUE),
(132, 2, 13, 3, 28, 'RECALL', 'COMPLEX_CHOICE', 'Pengalaman Margaret Hamilton mengandung pelajaran hidup. Apa pelajaran penting yang dapat diambil dari suratnya? Pilihlah semua pernyataan yang benar berdasarkan isi teks!', NULL, TRUE),
(133, 2, 11, 1, 29, 'RECALL', 'SINGLE_CHOICE', 'Berdasarkan teks, benda yang umum digunakan dalam kerajinan adalah ….', NULL, TRUE),
(134, 2, 12, 2, 29, 'RECALL', 'COMPLEX_CHOICE', 'Langkah kedua mendukung tujuan utama teks karena …. Klik pada setiap pilihan jawaban benar! Jawaban benar lebih dari satu.', NULL, TRUE),
(135, 2, 12, 2, 29, 'RECALL', 'SINGLE_CHOICE', 'Mengapa mainan hewan dibagi menjadi dua bagian?', NULL, TRUE),
(136, 2, 11, 1, 30, 'RECALL', 'SINGLE_CHOICE', 'Apa fungsi kandungan elektrolit yang dimiliki air mineral?', NULL, TRUE),
(137, 2, 12, 2, 30, 'RECALL', 'SINGLE_CHOICE', 'Mengapa air putih lebih cocok untuk dikonsumsi setiap saat?', NULL, TRUE),
(138, 2, 13, 3, 30, 'RECALL', 'COMPLEX_CHOICE', 'Mengapa kata “BEDA” pada judul infografis berwarna oranye? Pilihlah semua pernyataan yang benar berdasarkan isi teks!', NULL, TRUE),
(139, 2, 14, 1, 31, 'RECALL', 'SINGLE_CHOICE', 'Siapakah tokoh yang menyelesaikan keributan dalam cerita tersebut?', NULL, TRUE),
(140, 2, 15, 2, 31, 'RECALL', 'COMPLEX_CHOICE', 'Apa saja peristiwa yang dialami Tia dalam cerita? Klik pada setiap pilihan jawaban benar! Jawaban benar lebih dari satu!', NULL, TRUE),
(141, 2, 16, 3, 31, 'RECALL', 'COMPLEX_CHOICE', 'Dalam cerita, seorang pemuda mengatakan, "hanya satu buku, pasti tidak akan lama." Intan telah membaca cerita tersebut. Menurutnya, perkataan tersebut tidak dapat dibenarkan. Apa alasan yang mendukung pendapat Intan berdasarkan isi cerita? Pilihlah semua pernyataan yang mendukung berdasarkan isi teks!', NULL, TRUE),
(142, 2, 11, 1, 32, 'RECALL', 'SINGLE_CHOICE', 'Apa penyebab gigi berlubang?', NULL, TRUE),
(143, 2, 12, 2, 32, 'RECALL', 'COMPLEX_CHOICE', 'Apa yang terjadi pada gigi jika tidak dirawat dengan baik? Klik pada setiap pilihan jawaban benar! Jawaban benar lebih dari satu.', NULL, TRUE),
(144, 2, 13, 3, 32, 'RECALL', 'COMPLEX_CHOICE', 'Apa fungsi tanda panah pada gambar teks tersebut? Pilihlah semua pernyataan yang benar berdasarkan isi teks!', NULL, TRUE),
(145, 2, 14, 1, 33, 'RECALL', 'COMPLEX_CHOICE', 'Larik mana saja yang menunjukkan kerinduan? Klik pada setiap pilihan jawaban benar! Jawaban benar lebih dari satu.', NULL, TRUE),
(146, 2, 15, 2, 33, 'RECALL', 'SINGLE_CHOICE', '“kesetiaan yang tak akan pernah lekang oleh masa” Makna pada larik puisi tersebut adalah …', NULL, TRUE),
(147, 2, 15, 2, 33, 'RECALL', 'SINGLE_CHOICE', 'Pesan apa yang ingin disampaikan dalam puisi tersebut?', NULL, TRUE),
(148, 2, 11, 1, 34, 'RECALL', 'SINGLE_CHOICE', 'Apa nama kerupuk yang sudah dikonsumsi sejak lama?', NULL, TRUE),
(149, 2, 12, 2, 34, 'RECALL', 'COMPLEX_CHOICE', 'Mengapa kerupuk asal Indonesia semakin mendunia? Pilihlah semua pernyataan yang benar berdasarkan isi teks!', NULL, TRUE),
(150, 2, 13, 3, 34, 'RECALL', 'COMPLEX_CHOICE', 'Mengapa terdapat gambar berbagai jenis kerupuk pada teks tersebut? Pilihlah semua pernyataan yang benar berdasarkan isi teks!', NULL, TRUE)
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
-- 3. PEMBENIHAN OPSI JAWABAN RECALL BAHASA INDONESIA (QUESTION_OPTIONS - 120 Opsi)
-- ID: 481 - 600 (Melanjutkan urutan ID Opsi dari paket Simulasi 1-480)
-- -----------------------------------------------------------------------------
INSERT INTO `question_options` (`id`, `question_id`, `option_label`, `option_text`, `is_correct`) VALUES
(481, 121, 'A', 'Bani.', FALSE),
(482, 121, 'B', 'Ucil.', FALSE),
(483, 121, 'C', 'Rino.', FALSE),
(484, 121, 'D', 'Hari.', TRUE),
(485, 122, 'A', 'Para binatang di hutan tidak mampu melakukan sesuatu.', FALSE),
(486, 122, 'B', 'Semua binatang di hutan menahan untuk tidak berkomentar.', TRUE),
(487, 122, 'C', 'Penghuni hutan tidak mau mendengarkan pendapat orang lain.', FALSE),
(488, 122, 'D', 'Binatang-binatang di hutan tidak mengetahui masalah yang terjadi.', FALSE),
(489, 123, 'A', 'Tita memberi ide cemerlang yang dapat dilakukan oleh teman-teman di kelas.', FALSE),
(490, 123, 'B', 'Jani menghargai kepercayaan yang diberikan teman-teman sekelas kepada dirinya.', TRUE),
(491, 123, 'C', 'Nina bertanggung jawab dalam menjalankan tugas yang dipercayakan kepadanya.', TRUE),
(492, 123, 'D', 'Rudi mengabaikan ajakan musyawarah dari teman-teman kelompoknya.', FALSE),
(493, 124, 'A', 'Sapi.', FALSE),
(494, 124, 'B', 'Koala.', TRUE),
(495, 124, 'C', 'Panda.', TRUE),
(496, 124, 'D', 'Singa.', FALSE),
(497, 125, 'A', 'Hewan folivora bergerak sangat cepat dan aktif untuk mencari dedaunan di hutan.', FALSE),
(498, 125, 'B', 'Daun yang sudah tua lebih disukai hewan folivora karena mengandung banyak kalori.', FALSE),
(499, 125, 'C', 'Koala dan panda digolongkan ke dalam kelompok karnivora pemakan daging.', FALSE),
(500, 125, 'D', 'Hewan folivora memiliki usus yang panjang dan bakteri baik untuk mencerna daun.', TRUE),
(501, 126, 'A', 'Jenis daun yang cocok untuk hewan folivora.', FALSE),
(502, 126, 'B', 'Pembagian hewan berdasarkan makanan mereka.', FALSE),
(503, 126, 'C', 'Cara khusus tubuh hewan folivora mencerna daun.', TRUE),
(504, 126, 'D', 'Peranan penting hutan bagi kehidupan hewan folivora.', FALSE),
(505, 127, 'A', 'Makhluk itu sangat sombong.', FALSE),
(506, 127, 'B', 'Anak lembu sangat jahat.', FALSE),
(507, 127, 'C', 'Lembu tidak makan katak.', TRUE),
(508, 127, 'D', 'Anak lembu hanya memakan rumput di tepi rawa.', TRUE),
(509, 128, 'A', 'Kenthus hendak ditelan anak lembu di padang rumput.', FALSE),
(510, 128, 'B', 'Kenthus berlari ke tepi kolam hingga terengah-engah.', FALSE),
(511, 128, 'C', 'Kenthus mengembang terlalu besar hingga jatuh lemas.', TRUE),
(512, 128, 'D', 'Kenthus dimarahi Koko karena terlalu menggebu-gebu.', FALSE),
(513, 129, 'A', 'Terharu karena Kenthus mau mengakui kesalahannya.', FALSE),
(514, 129, 'B', 'Bahagia karena Kenthus berbaikan dengan anak lembu.', FALSE),
(515, 129, 'C', 'Menyayangkan karena Kenthus memaksakan diri menandingi ukuran tubuh anak lembu.', TRUE),
(516, 129, 'D', 'Prihatin karena kesombongan Kenthus berujung pada celaka bagi dirinya sendiri.', TRUE),
(517, 130, 'A', 'membuat orang terus waspada dalam bekerja', TRUE),
(518, 130, 'B', 'menyebabkan orang kehilangan fokus saat bekerja', FALSE),
(519, 130, 'C', 'membuat suasana menjadi serius dan penuh ketakutan', FALSE),
(520, 130, 'D', 'menimbulkan rasa khawatir karena situasi yang genting', FALSE),
(521, 131, 'A', 'Kode komputer mengantar para manusia ke bulan dan Venus.', FALSE),
(522, 131, 'B', 'Kode komputer dibahas dalam rapat setelah misi utama selesai.', TRUE),
(523, 131, 'C', 'Kode komputer membuat astronaut dapat mendarat dengan aman.', FALSE),
(524, 131, 'D', 'Kode komputer mengirim pesan kesalahan saat proses pendaratan.', FALSE),
(525, 132, 'A', 'Ketelitian bekerja sangat penting agar tidak terjadi kesalahan.', TRUE),
(526, 132, 'B', 'Bekerja di proyek luar angkasa dapat memotivasi orang lain', FALSE),
(527, 132, 'C', 'Tanggung jawab terhadap tugas membuat seseorang tetap fokus.', TRUE),
(528, 132, 'D', 'Pekerjaan yang belum pernah dikerjakan siapa pun sebaiknya dihindari agar tidak ada risiko.', FALSE),
(529, 133, 'A', 'mainan plastik', TRUE),
(530, 133, 'B', 'cat semprot', FALSE),
(531, 133, 'C', 'magnet', FALSE),
(532, 133, 'D', 'gunting', FALSE),
(533, 134, 'A', 'membuat permukaan mainan tertutup rapi', TRUE),
(534, 134, 'B', 'memudahkan anak mewarnai mainan hewan', FALSE),
(535, 134, 'C', 'menutup lubang agar magnet bisa menempel', TRUE),
(536, 134, 'D', 'memperkuat sambungan kardus agar tidak mudah terlepas', FALSE),
(537, 135, 'A', 'Supaya ukuran mainan lebih besar dan menarik.', FALSE),
(538, 135, 'B', 'Agar mainan bisa menempel di permukaan kulkas.', FALSE),
(539, 135, 'C', 'Karena mainan perlu diwarnai menggunakan cat semprot.', TRUE),
(540, 135, 'D', 'Untuk memudahkan pemberian lem tembak pada mainan.', FALSE),
(541, 136, 'A', 'Menjaga tekanan darah normal.', FALSE),
(542, 136, 'B', 'Meningkatkan fungsi jantung.', TRUE),
(543, 136, 'C', 'Membantu mencegah dehidrasi.', FALSE),
(544, 136, 'D', 'Mempermudah sistem metabolisme tubuh.', FALSE),
(545, 137, 'A', 'Sumber air putih mudah ditemukan.', FALSE),
(546, 137, 'B', 'Kandungan air putih sangat banyak.', FALSE),
(547, 137, 'C', 'Pengolahan air putih melalui proses alami.', TRUE),
(548, 137, 'D', 'Kandungan pH dalam air putih lebih tinggi.', FALSE),
(549, 138, 'A', 'Menekankan pokok utama yang ingin disampaikan dalam infografis.', TRUE),
(550, 138, 'B', 'Menandai bahwa kata tersebut merupakan nama produk air mineral tertentu.', FALSE),
(551, 138, 'C', 'Menyesuaikan warna yang mungkin akan disukai pembaca infografis.', FALSE),
(552, 138, 'D', 'Membantu pembaca membedakan perbandingan antara air putih dan air mineral secara cepat.', TRUE),
(553, 139, 'A', 'Tia.', TRUE),
(554, 139, 'B', 'Devi.', FALSE),
(555, 139, 'C', 'Kasir.', FALSE),
(556, 139, 'D', 'Pak Satpam.', FALSE),
(557, 140, 'A', 'Mencari dan membeli buku bersama Devi.', TRUE),
(558, 140, 'B', 'Dinasihati oleh seorang ibu untuk antre.', FALSE),
(559, 140, 'C', 'Ikut menegur pemuda yang menyerobot antrean.', TRUE),
(560, 140, 'D', 'Menenangkan situasi dan meminta pemuda itu kembali mengantre.', FALSE),
(561, 141, 'A', 'Semua orang yang mengantre juga ingin cepat dilayani.', TRUE),
(562, 141, 'B', 'Mengantre membutuhkan kesabaran setiap orang.', FALSE),
(563, 141, 'C', 'Aturan antrean harus dihormati oleh semua orang.', TRUE),
(564, 141, 'D', 'Mendahulukan orang yang membeli barang sedikit adalah hak istimewa yang wajar.', FALSE),
(565, 142, 'A', 'Rusaknya enamel pada gigi.', FALSE),
(566, 142, 'B', 'Enamel gigi tidak sekuat tulang.', TRUE),
(567, 142, 'C', 'Pembuluh darah dan saraf sensitif.', FALSE),
(568, 142, 'D', 'Bakteri melepaskan zat asam pada gigi.', FALSE),
(569, 143, 'A', 'Gigi akan menjadi rusak dan bolong.', TRUE),
(570, 143, 'B', 'Gigi akan mengunyah makanan lebih lama.', FALSE),
(571, 143, 'C', 'Gigi akan menjadi lebih kuat karena sisa makanan yang menempel.', FALSE),
(572, 143, 'D', 'Terjadinya penumpukan plak dan peradangan pada gusi.', TRUE),
(573, 144, 'A', 'Mempermudah melihat perbedaan kondisi gigi tiap orang.', FALSE),
(574, 144, 'B', 'Menunjukkan lapisan-lapisan gigi yang sedang dijelaskan.', TRUE),
(575, 144, 'C', 'Menggambarkan bentuk dan fungsi dari setiap gigi manusia.', FALSE),
(576, 144, 'D', 'Menunjukkan posisi bagian email, dentin, dan saraf gigi secara berurutan.', TRUE),
(577, 145, 'A', 'Senyum itu enggan lepas dari bibirmu.', TRUE),
(578, 145, 'B', 'Uluran tanganmu menyambutku.', FALSE),
(579, 145, 'C', 'Maafmu selalu terbuka untukku.', FALSE),
(580, 145, 'D', 'Kuingat kembali tawa riang kita di bawah pohon rindang.', TRUE),
(581, 146, 'A', 'Simbol penerimaan, dukungan, dan rasa aman dalam persahabatan.', FALSE),
(582, 146, 'B', 'Ungkapan kebahagiaan saat bertemu seseorang yang lama tidak bertemu.', FALSE),
(583, 146, 'C', 'Penghargaan dan rasa syukur sebagai hal yang berkesan dalam persahabatan.', TRUE),
(584, 146, 'D', 'Lambang hubungan abadi, tetap kuat meski waktu atau jarak memisahkan.', FALSE),
(585, 147, 'A', 'Persahabatan membuat seseorang harus mengalah demi menjaga hubungan.', FALSE),
(586, 147, 'B', 'Persahabatan harus selalu diutamakan di atas hubungan dengan keluarga.', FALSE),
(587, 147, 'C', 'Persahabatan membutuhkan pengertian, kesetiaan, dan saling menghargai.', TRUE),
(588, 147, 'D', 'Persahabatan sering diuji oleh konflik sehingga tidak selalu bertahan.', FALSE),
(589, 148, 'A', 'Rengginang.', FALSE),
(590, 148, 'B', 'Melarat.', FALSE),
(591, 148, 'C', 'Rambak.', TRUE),
(592, 148, 'D', 'Gendar.', FALSE),
(593, 149, 'A', 'Memiliki nilai jual ke luar negeri hingga puluhan juta dolar.', TRUE),
(594, 149, 'B', 'Sudah ada di Indonesia sejak abad ke-9 dan ke-10.', FALSE),
(595, 149, 'C', 'Dikirim ke luar negeri lebih dari 20 juta kilogram.', TRUE),
(596, 149, 'D', 'Negara-negara di berbagai benua menjadi tujuan ekspor kerupuk Indonesia.', FALSE),
(597, 150, 'A', 'Menggambarkan aneka ragam kerupuk yang terdapat di Indonesia.', TRUE),
(598, 150, 'B', 'Menunjukkan harga jual setiap jenis kerupuk di pasar luar negeri.', FALSE),
(599, 150, 'C', 'Memberikan informasi tentang bahan-bahan kerupuk di Indonesia.', FALSE),
(600, 150, 'D', 'Membantu pembaca mengenali bentuk fisik aneka jenis kerupuk nusantara.', TRUE)
ON DUPLICATE KEY UPDATE 
    `question_id` = VALUES(`question_id`), 
    `option_label` = VALUES(`option_label`), 
    `option_text` = VALUES(`option_text`), 
    `is_correct` = VALUES(`is_correct`);

-- -----------------------------------------------------------------------------
-- 4. PEMBENIHAN PEMBAHASAN RECALL PASCA-SESI (QUESTION_EXPLANATIONS - 30 Pembahasan)
-- ID: 121 - 150 (Relasi 1-to-1 Unik dengan question_banks.id)
-- -----------------------------------------------------------------------------
INSERT INTO `question_explanations` (`id`, `question_id`, `explanation_text`, `reasoning_guide`, `reference_url`) VALUES
(121, 121, 'Jawaban yang tepat adalah D (Hari). Pada fabel “Danau untuk Semua” paragraf ketiga, diceritakan bahwa para penghuni hutan merasa cemas dan kesal karena air danau menjadi kotor akibat ulah Rino si badak yang berendam seharian. Saat semua binatang berkumpul untuk bermusyawarah, Hari si harimau mengusulkan ide untuk meminta pertolongan kepada Ucil si kancil yang cerdik. Pilihan lainnya kurang tepat:
- A (Bani) adalah kelinci yang hanya mengeluhkan kondisi danau.
- B (Ucil) adalah tokoh yang dimintai bantuan, bukan yang mengusulkan.
- C (Rino) adalah badak yang menjadi sumber masalah di danau.', 'Fokus penguasaan: Menelaah Pemahaman Tekstual (Informasi Tersurat) pada tingkat Level 1 Pemahaman. Analisis: Jawaban yang tepat adalah D (Hari).', 'Pusmendik / BSKAP Kemendikdasmen - Literasi Membaca Fase D'),
(122, 122, 'Jawaban yang tepat adalah B. Dalam wacana terdapat kalimat: “Namun, mereka takut menegur Rino karena badannya besar dan bercula. Mereka diam seribu bahasa.” Ungkapan diam seribu bahasa adalah ungkapan kiasan bahasa Indonesia yang menggambarkan situasi seseorang yang sama sekali tidak berbicara atau menahan diri untuk tidak mengeluarkan sepatah kata pun, biasanya karena merasa takut, segan, atau terkejut. Pada cerita ini, para binatang memilih bungkam dan tidak berani menegur Rino secara langsung.', 'Fokus penguasaan: Menelaah Pemahaman Inferensial (Makna Ungkapan/Kiasan) pada tingkat Level 2 Aplikasi. Analisis: Jawaban yang tepat adalah B.', 'Pusmendik / BSKAP Kemendikdasmen - Literasi Membaca Fase D'),
(123, 123, 'Dalam cerita “Danau untuk Semua”, Ucil si kancil diberi amanah dan kepercayaan oleh seluruh binatang di hutan untuk menyelesaikan persoalan danau yang kotor. Ucil menyambut kepercayaan itu dengan penuh tanggung jawab dan kecerdikan. Mari kita cocokkan dengan peristiwa sehari-hari:
- Pernyataan A (Tidak Sesuai): Tita yang memberi ide mencerminkan tokoh Hari si harimau (yang mengusulkan meminta bantuan Ucil), bukan mencerminkan peran Ucil.
- Pernyataan B (Sesuai): Jani menghargai kepercayaan teman-temannya mencerminkan sikap Ucil yang mau menerima tugas dari warga hutan.
- Pernyataan C (Sesuai): Nina bertanggung jawab menyelesaikan tugas mencerminkan Ucil yang berhasil menuntaskan misinya berbicara dengan Rino.
- Pernyataan D (Tidak Sesuai): Mengabaikan musyawarah bertolak belakang dengan nilai kebersamaan dan musyawarah yang dijunjung tinggi oleh para binatang dalam cerita.', 'Fokus penguasaan: Menelaah Evaluasi dan Apresiasi (Relevansi Cerita dengan Kehidupan Nyata) pada tingkat Level 3 Penalaran. Analisis: Dalam cerita “Danau untuk Semua”, Ucil si kancil diberi amanah dan kepercayaan oleh seluruh binatang di hutan untuk menyelesaikan persoalan danau yang kotor.', 'Pusmendik / BSKAP Kemendikdasmen - Literasi Membaca Fase D'),
(124, 124, 'Berdasarkan teks “Hewan Pemakan Daun, Apa Itu?”, hewan folivora adalah kelompok hewan herbivora yang secara khusus mengonsumsi dedaunan sebagai makanan utamanya. Mari kita periksa pilihannya:
- A (Sapi): Kurang tepat, sapi tergolong hewan pemakan rumput (grazer), bukan pemakan daun khusus (folivora).
- B (Koala): Tepat, koala adalah contoh utama hewan folivora yang memakan daun eukaliptus.
- C (Panda): Tepat, panda secara khusus memakan daun dan tunas bambu.
- D (Singa): Kurang tepat, singa tergolong karnivora (pemakan daging), bukan pemakan daun khusus (folivora). Jadi, contoh hewan folivora yang tepat adalah B dan C.', 'Fokus penguasaan: Menelaah Pemahaman Tekstual (Informasi Tersurat) pada tingkat Level 1 Pemahaman. Analisis: Berdasarkan teks “Hewan Pemakan Daun, Apa Itu?”, hewan folivora adalah kelompok hewan herbivora yang secara khusus mengonsumsi dedaunan sebagai makanan utamanya.', 'Pusmendik / BSKAP Kemendikdasmen - Literasi Membaca Fase D'),
(125, 125, 'Jawaban yang tepat adalah D. Sesuai penjelasan pada paragraf ketiga wacana “Hewan Pemakan Daun, Apa Itu?”, hewan folivora memiliki usus yang panjang agar makanan dapat diproses lebih lama serta dibantu oleh bakteri baik di dalam perut untuk mencerna serat selulosa daun yang alot.', 'Fokus penguasaan: Menelaah Pemahaman Tekstual (Informasi Tersurat Teks Informasi) pada tingkat Level 2 Aplikasi. Analisis: Jawaban yang tepat adalah D.', 'Pusmendik / BSKAP Kemendikdasmen - Literasi Membaca Fase D'),
(126, 126, 'Jawaban yang tepat adalah C. Berdasarkan penjelasan pada paragraf ketiga, daun memiliki serat selulosa yang sangat alot dan rendah kalori. Agar dapat menyerap energi secara maksimal dan tidak membuang banyak tenaga, hewan folivora memiliki adaptasi khusus berupa saluran pencernaan yang panjang serta bergerak dengan sangat lambat dan tenang. Gerakan yang lambat ini berguna untuk menghemat energi tubuh mereka.', 'Fokus penguasaan: Menelaah Pemahaman Inferensial (Ide Pokok Paragraf) pada tingkat Level 2 Aplikasi. Analisis: Jawaban yang tepat adalah C.', 'Pusmendik / BSKAP Kemendikdasmen - Literasi Membaca Fase D'),
(127, 127, 'Dalam fabel “Kenthus yang Sombong”, Koko si anak katak baru saja pulang dan menceritakan pertemuannya dengan seekor anak lembu di rawa. Koko menjelaskan kepada Kenthus bahwa meskipun tubuh anak lembu itu sangat besar, anak lembu tersebut tidak jahat, tidak memakan katak, dan hanya sibuk memakan rumput di tepi rawa.
Pernyataan A dan B (Salah): Makhluk sombong bukanlah anak lembu, melainkan Kenthus sendiri yang merasa dirinya paling hebat. Selain itu, Koko justru menjelaskan bahwa anak lembu tidak jahat.
Pernyataan C dan D (Benar): Keduanya merupakan penjelasan langsung dari Koko bahwa anak lembu tidak memangsa katak dan hanya memakan rumput.', 'Fokus penguasaan: Menelaah Pemahaman Tekstual (Informasi Tersurat Teks Fiksi) pada tingkat Level 1 Pemahaman. Analisis: Dalam fabel “Kenthus yang Sombong”, Koko si anak katak baru saja pulang dan menceritakan pertemuannya dengan seekor anak lembu di rawa.', 'Pusmendik / BSKAP Kemendikdasmen - Literasi Membaca Fase D'),
(128, 128, 'Jawaban yang tepat adalah C (Kenthus mengembang terlalu besar hingga jatuh lemas). Dalam fabel “Kenthus yang Sombong”, Kenthus memaksakan diri mengembungkan tubuhnya secara berlebihan demi membuktikan kesombongannya bahwa ia dapat menandingi ukuran anak lembu. Perbuatannya tersebut mengakibatkan perutnya sakit parah hingga ia jatuh lemas. Kejadian menyakitkan dan memalukan inilah yang membuat Kenthus akhirnya tersadar, menyesal, serta meminta maaf kepada kakaknya karena telah mengabaikan peringatannya.', 'Fokus penguasaan: Menelaah Pemahaman Inferensial (Amanat dan Nilai Moral) pada tingkat Level 2 Aplikasi. Analisis: Jawaban yang tepat adalah C.', 'Pusmendik / BSKAP Kemendikdasmen - Literasi Membaca Fase D'),
(129, 129, 'Kisah Kenthus berakhir tragis: Kenthus terus meniup dan membesarkan perutnya agar bisa menandingi ukuran tubuh anak lembu, hingga akhirnya perutnya meletus dan ia celaka. Mari kita evaluasi respons perasaan pembaca yang tepat:
- Pernyataan A dan B (Salah): Kenthus tidak pernah mengakui kesalahannya dan tidak berbaikan dengan anak lembu.
- Pernyataan C (Benar): Pembaca menyayangkan sikap Kenthus yang memaksakan diri menandingi ukuran tubuh anak lembu hingga perutnya meletus.
- Pernyataan D (Benar): Pembaca merasa prihatin dan petik pelajaran berharga bahwa sifat sombong dan memaksakan diri yang bukan kemampuannya hanya akan mencelakakan diri sendiri.', 'Fokus penguasaan: Menelaah Evaluasi dan Apresiasi (Respons Emosional terhadap Teks) pada tingkat Level 3 Penalaran. Analisis: Kisah Kenthus berakhir tragis: Kenthus terus meniup dan membesarkan perutnya agar bisa menandingi ukuran tubuh anak lembu, hingga akhirnya perutnya meletus dan ia celaka.', 'Pusmendik / BSKAP Kemendikdasmen - Literasi Membaca Fase D'),
(130, 130, 'Jawaban yang tepat adalah A. Konteks kalimat dalam teks: “Hari-hari itu sangat menegangkan.” Pada saat itu, Margaret Hamilton dan timnya sedang berkejaran dengan waktu untuk menuntaskan penulisan kode komputer pendaratan Apollo 11. Setiap detik sangat menentukan nasib dan keselamatan para astronot di luar angkasa. Kata menegangkan bermakna suasana yang penuh dengan tekanan, kecemasan, dan rasa was-was karena adanya tanggung jawab yang sangat besar dan berisiko tinggi.', 'Fokus penguasaan: Menelaah Pemahaman Tekstual (Kosakata Bidang Khusus) pada tingkat Level 1 Pemahaman. Analisis: Jawaban yang tepat adalah A.', 'Pusmendik / BSKAP Kemendikdasmen - Literasi Membaca Fase D'),
(131, 131, 'Jawaban yang tepat adalah B. Gagasan utama wacana adalah peran penting kode komputer yang dirancang oleh tim Margaret Hamilton dalam menyukseskan pendaratan Apollo 11 di bulan. Pernyataan pilihan B, yaitu “Perangkat lunak buatan tim Margaret mampu memprioritaskan tugas penting komputer saat pendaratan”, secara langsung mendukung gagasan utama karena menunjukkan fungsi nyata dari kode komputer tersebut dalam menyelamatkan misi antariksa.', 'Fokus penguasaan: Menelaah Pemahaman Inferensial (Simpulan Ide Pokok Surat) pada tingkat Level 2 Aplikasi. Analisis: Jawaban yang tepat adalah B.', 'Pusmendik / BSKAP Kemendikdasmen - Literasi Membaca Fase D'),
(132, 132, 'Margaret Hamilton memimpin tim pembuatan perangkat lunak komputer untuk pendaratan Apollo 11 di bulan. Pekerjaan ini belum pernah dilakukan siapa pun sebelumnya di dunia. Mari kita lihat nilai hidup yang dapat kita teladani:
- Pernyataan A (Benar): Ketelitian adalah kunci utama, karena satu kesalahan kode saja dapat menggagalkan pendaratan astronot di bulan.
- Pernyataan B (Salah): Fokus wacana adalah perjuangan ketelitian dan tanggung jawab teknis, bukan sekadar memotivasi orang lain.
- Pernyataan C (Benar): Rasa tanggung jawab yang tinggi membuat Margaret dan timnya tetap fokus bekerja siang dan malam.
- Pernyataan D (Salah): Pekerjaan yang belum pernah dikerjakan siapa pun justru dihadapi Margaret dengan sungguh-sungguh sampai pendaratan berhasil, bukan dihindari.', 'Fokus penguasaan: Menelaah Evaluasi dan Apresiasi (Relevansi Pelajaran Hidup) pada tingkat Level 3 Penalaran. Analisis: Margaret Hamilton memimpin tim pembuatan perangkat lunak komputer untuk pendaratan Apollo 11 di bulan.', 'Pusmendik / BSKAP Kemendikdasmen - Literasi Membaca Fase D'),
(133, 133, 'Jawaban yang tepat adalah A. Pada paragraf pendahuluan teks prosedur kerajinan, tertulis bahwa bahan utama yang mudah ditemukan di rumah dan umum dimanfaatkan kembali untuk membuat mainan hewan edukatif adalah kardus bekas kemasan. Kardus bekas dipilih karena bahannya cukup tebal, kuat, dan ramah lingkungan.', 'Fokus penguasaan: Menelaah Pemahaman Tekstual (Informasi Tersurat Teks Prosedur) pada tingkat Level 1 Pemahaman. Analisis: Jawaban yang tepat adalah A.', 'Pusmendik / BSKAP Kemendikdasmen - Literasi Membaca Fase D'),
(134, 134, 'Teks tersebut berjudul “Cara Membuat Magnet Kulkas dari Mainan Hewan Plastik”, sehingga tujuan utamanya adalah menghasilkan magnet kulkas dari mainan hewan plastik bekas. Langkah kedua berbunyi: “Periksa bagian-bagian mainan. Jika ada bagian yang berlubang, isilah dengan tanah liat.” Mari kita periksa pilihannya:
- Pernyataan A (Benar): Lubang yang diisi tanah liat membuat permukaan mainan tertutup rapi dan rata.
- Pernyataan B (Salah): Langkah kedua tidak berkaitan dengan pewarnaan. Pewarnaan dilakukan pada langkah berikutnya dan boleh dilewati.
- Pernyataan C (Benar): Menutup bagian yang berlubang membuat permukaan rata, sehingga magnet dapat menempel kuat pada langkah selanjutnya.
- Pernyataan D (Salah): Bahan yang digunakan adalah mainan hewan plastik, bukan kardus, sehingga tidak ada sambungan kardus yang perlu diperkuat. Jadi, jawaban yang tepat adalah A dan C.', 'Fokus penguasaan: Menelaah Pemahaman Inferensial (Tujuan dan Fungsi Langkah) pada tingkat Level 2 Aplikasi. Analisis: Teks tersebut berjudul “Cara Membuat Magnet Kulkas dari Mainan Hewan Plastik”, sehingga tujuan utamanya adalah menghasilkan magnet kulkas dari mainan hewan plastik bekas.', 'Pusmendik / BSKAP Kemendikdasmen - Literasi Membaca Fase D'),
(135, 135, 'Jawaban yang tepat adalah C. Pada petunjuk pembuatan mainan hewan, bentuk badan hewan sengaja dipotong dan dibagi menjadi dua bagian (bagian depan dan bagian belakang) agar nantinya anak-anak dapat memasang magnet di antara kedua belahan tersebut. Dengan begitu, mainan dapat disambung dan dilepas kembali saat dimainkan sebagai media interaktif.', 'Fokus penguasaan: Menelaah Pemahaman Inferensial (Perubahan Karakteristik Objek) pada tingkat Level 2 Aplikasi. Analisis: Jawaban yang tepat adalah C.', 'Pusmendik / BSKAP Kemendikdasmen - Literasi Membaca Fase D'),
(136, 136, 'Jawaban yang tepat adalah B. Berdasarkan infografis “Air Putih atau Air Mineral?”, air mineral mengandung zat elektrolit alami seperti kalium, kalsium, dan natrium. Fungsi utama elektrolit di dalam tubuh manusia adalah menjaga keseimbangan cairan tubuh, mendukung fungsi saraf, dan mencegah dehidrasi, terutama setelah berolahraga atau beraktivitas berat.', 'Fokus penguasaan: Menelaah Pemahaman Tekstual (Informasi Tersurat Infografis) pada tingkat Level 1 Pemahaman. Analisis: Jawaban yang tepat adalah B.', 'Pusmendik / BSKAP Kemendikdasmen - Literasi Membaca Fase D'),
(137, 137, 'Jawaban yang tepat adalah C. Perbedaan paling mendasar antara air putih biasa dan air mineral yang dijelaskan pada infografis adalah asal sumber air dan kandungan mineralnya. Air putih biasanya bersumber dari air tanah atau sumur rumahan yang dimasak hingga mendidih, sedangkan air mineral diperoleh langsung dari mata air pegunungan yang kaya mineral alami dan melalui proses uji higienis.', 'Fokus penguasaan: Menelaah Pemahaman Inferensial (Simpulan Perbandingan) pada tingkat Level 2 Aplikasi. Analisis: Jawaban yang tepat adalah C.', 'Pusmendik / BSKAP Kemendikdasmen - Literasi Membaca Fase D'),
(138, 138, 'Dalam desain infografis, variasi warna yang kontras serta ukuran huruf (tipografi) memiliki fungsi visual penting untuk mempermudah pembaca memahami informasi:
Pernyataan A (Benar): Warna mencolok dan huruf besar langsung menarik mata pembaca ke pesan inti yang ingin disampaikan, yaitu perbedaan air putih dan air mineral.
Pernyataan B (Salah): Kata “BEDA” adalah bagian dari judul infografis, bukan nama produk air mineral tertentu.
Pernyataan C (Salah): Pemilihan warna dalam infografis edukasi kesehatan didasarkan pada kejelasan informasi dan kontras visual, bukan sekadar menuruti selera pribadi pembaca.
Pernyataan D (Benar): Pembagian warna yang berbeda antara kolom air putih dan kolom air mineral memudahkan pembaca membandingkan kandungan keduanya secara cepat dalam sekali lihat.', 'Fokus penguasaan: Menelaah Evaluasi dan Apresiasi (Kesesuaian Ilustrasi dengan Teks) pada tingkat Level 3 Penalaran. Analisis: Dalam desain infografis, variasi warna yang kontras serta ukuran huruf (tipografi) memiliki fungsi visual penting untuk mempermudah pembaca memahami informasi:
Pernyataan A (Benar): Warna mencolok dan huruf besar langsung menarik mata pembaca ke pesan inti yang ingin disampaikan, yaitu perbedaan air putih dan air mineral.', 'Pusmendik / BSKAP Kemendikdasmen - Literasi Membaca Fase D'),
(139, 139, 'Jawaban yang tepat adalah A. Dalam cerita “Antre, Dong!”, ketika seorang pemuda berusaha memotong antrean di kasir toko buku, suasana sempat menjadi gaduh karena pembeli lain merasa kesal. Tokoh yang pertama kali dengan bijak dan tenang menasihati pemuda tersebut adalah seorang ibu yang berada di dekat antrean. Ibu tersebut mengingatkan pemuda itu tentang pentingnya membudayakan antre dengan sopan.', 'Fokus penguasaan: Menelaah Pemahaman Tekstual (Informasi Tersurat Cerita) pada tingkat Level 1 Pemahaman. Analisis: Jawaban yang tepat adalah A.', 'Pusmendik / BSKAP Kemendikdasmen - Literasi Membaca Fase D'),
(140, 140, 'Dalam cerpen “Antre, Dong!”, tokoh utama Tia digambarkan sebagai anak yang berani dan tertib aturan. Tindakan-tindakan nyata yang dilakukan Tia dalam cerita adalah:
- Pernyataan A (Benar): Di awal cerita, Tia bersama temannya, Devi, pergi ke toko buku untuk membeli buku pelajaran.
- Pernyataan B (Salah): Yang dinasihati oleh ibu untuk tertib mengantre adalah pemuda yang menyerobot, bukan Tia.
- Pernyataan C (Benar): Saat pemuda beralasan buru-buru, Tia dengan tegas ikut menegur pemuda yang menyerobot antrean.
- Pernyataan D (Salah): Yang menenangkan situasi dan meminta pemuda tetap mengantre adalah Pak Satpam, bukan Tia.', 'Fokus penguasaan: Menelaah Pemahaman Inferensial (Nilai Moral dan Sikap Tokoh) pada tingkat Level 2 Aplikasi. Analisis: Dalam cerpen “Antre, Dong!”, tokoh utama Tia digambarkan sebagai anak yang berani dan tertib aturan.', 'Pusmendik / BSKAP Kemendikdasmen - Literasi Membaca Fase D'),
(141, 141, 'Konteks perdebatan dalam cerita adalah protes terhadap pemuda yang menyerobot antrean dengan alasan hanya membeli satu buku saja:
Pernyataan A (Mendukung): Semua orang di antrean juga punya kesibukan dan ingin cepat selesai, sehingga alasan pemuda tidak bisa dibenarkan.
Pernyataan B (Tidak Mendukung): Mengantre memang melatih sabar, tetapi dalam adegan ini fokusnya adalah penegakan keadilan giliran, bukan sekadar imbauan bersabar.
Pernyataan C (Mendukung): Budaya antre adalah kesepakatan sosial yang wajib dihormati siapa pun tanpa terkecuali.
Pernyataan D (Tidak Mendukung): Anggapan bahwa belanja sedikit berhak memotong antrean justru ditolak tegas oleh tokoh-tokoh dalam cerita.', 'Fokus penguasaan: Menelaah Evaluasi dan Apresiasi (Relevansi Budaya Antre) pada tingkat Level 3 Penalaran. Analisis: Konteks perdebatan dalam cerita adalah protes terhadap pemuda yang menyerobot antrean dengan alasan hanya membeli satu buku saja:
Pernyataan A (Mendukung): Semua orang di antrean juga punya kesibukan dan ingin cepat selesai, sehingga alasan pemuda tidak bisa dibenarkan.', 'Pusmendik / BSKAP Kemendikdasmen - Literasi Membaca Fase D'),
(142, 142, 'Jawaban yang tepat adalah B. Berdasarkan wacana kesehatan gigi anak, penyebab utama gigi berlubang adalah aktivitas bakteri yang memakan sisa makanan manis di gigi. Bakteri tersebut memproduksi zat asam yang lama-kelamaan mengikis lapisan email pelindung gigi hingga terbentuk rongga atau lubang pada gigi.', 'Fokus penguasaan: Menelaah Pemahaman Tekstual (Informasi Tersurat Lapisan Gigi) pada tingkat Level 1 Pemahaman. Analisis: Jawaban yang tepat adalah B.', 'Pusmendik / BSKAP Kemendikdasmen - Literasi Membaca Fase D'),
(143, 143, 'Berdasarkan teks edukasi kesehatan gigi, sisa makanan yang menempel di sela gigi akan menjadi santapan empuk bagi bakteri. Akibat jika malas menyikat gigi:
- Pernyataan A (Benar): Asam dari bakteri akan mengikis email gigi sehingga gigi menjadi keropos dan berlubang.
- Pernyataan B (Salah): Gigi yang sakit dan berlubang justru menyulitkan mengunyah makanan, bukan membuat mengunyah lebih lama.
- Pernyataan C (Salah): Sisa makanan yang menempel justru menjadi makanan bagi bakteri dan merusak gigi, bukan membuat gigi lebih kuat.
- Pernyataan D (Benar): Tumpukan bakteri dan sisa makanan akan mengeras menjadi plak dan karang gigi yang memicu radang gusi.', 'Fokus penguasaan: Menelaah Pemahaman Inferensial (Sebab-Akibat Kerusakan Gigi) pada tingkat Level 2 Aplikasi. Analisis: Berdasarkan teks edukasi kesehatan gigi, sisa makanan yang menempel di sela gigi akan menjadi santapan empuk bagi bakteri.', 'Pusmendik / BSKAP Kemendikdasmen - Literasi Membaca Fase D'),
(144, 144, 'Pada gambar ilustrasi penampang gigi, tanda panah digunakan sebagai penunjuk visual (diagram callout):
Pernyataan A (Salah): Gambar tersebut adalah diagram anatomi satu gigi, bukan foto perbandingan gigi antarorang yang berbeda.
Pernyataan B & D (Benar): Tanda panah mengarah tepat ke lapisan gigi mulai dari lapisan terluar (email), lapisan tengah (dentin), hingga bagian rongga dalam (pulpa/saraf).
Pernyataan C (Salah): Gambar tidak membedakan jenis gigi seri, taring, atau geraham beserta fungsinya, melainkan memperlihatkan struktur lapisan anatomi gigi.', 'Fokus penguasaan: Menelaah Evaluasi dan Apresiasi (Kesesuaian Antarunsur Informasi) pada tingkat Level 3 Penalaran. Analisis: Pada gambar ilustrasi penampang gigi, tanda panah digunakan sebagai penunjuk visual (diagram callout):
Pernyataan A (Salah): Gambar tersebut adalah diagram anatomi satu gigi, bukan foto perbandingan gigi antarorang yang berbeda.', 'Pusmendik / BSKAP Kemendikdasmen - Literasi Membaca Fase D'),
(145, 145, 'Puisi “Surat untuk Sahabat” mengekspresikan kerinduan mendalam kepada sahabat yang telah lama berpisah jarak:
Pernyataan A dan D (Benar): Larik yang melukiskan kenangan senyuman sahabat dan tawa riang bersama di masa lalu secara emosional mencerminkan rasa rindu yang kuat terhadap kebersamaan yang pernah terjalin.
Pernyataan B (Salah): Larik “Uluran tanganmu menyambutku” lebih menggambarkan sambutan hangat saat bertemu, bukan secara langsung menggambarkan suasana kerinduan.
Pernyataan C (Salah): Larik “Maafmu selalu terbuka untukku” lebih menekankan sifat pemaaf dan kebaikan hati sahabat, bukan secara langsung menggambarkan suasana kerinduan.', 'Fokus penguasaan: Menelaah Pemahaman Tekstual (Larik Puisi Bertema Kerinduan) pada tingkat Level 1 Pemahaman. Analisis: Puisi “Surat untuk Sahabat” mengekspresikan kerinduan mendalam kepada sahabat yang telah lama berpisah jarak:
Pernyataan A dan D (Benar): Larik yang melukiskan kenangan senyuman sahabat dan tawa riang bersama di masa lalu secara emosional mencerminkan rasa rindu yang kuat terhadap kebersamaan yang pernah terjalin.', 'Pusmendik / BSKAP Kemendikdasmen - Literasi Membaca Fase D'),
(146, 146, 'Jawaban yang tepat adalah C. Puisi “Surat untuk Sahabat” menggambarkan kerinduan seorang sahabat yang telah lama berpisah tempat tinggal. Amanat utama yang ingin disampaikan penyair kepada pembaca adalah pentingnya menjaga dan merawat tali persahabatan serta saling mendoakan meskipun terpisah jarak yang jauh.', 'Fokus penguasaan: Menelaah Pemahaman Inferensial (Makna Larik Kiasan) pada tingkat Level 2 Aplikasi. Analisis: Jawaban yang tepat adalah C.', 'Pusmendik / BSKAP Kemendikdasmen - Literasi Membaca Fase D'),
(147, 147, 'Jawaban yang tepat adalah C (Persahabatan membutuhkan pengertian, kesetiaan, dan saling menghargai). Puisi “Surat untuk Sahabat” secara mendalam menyampaikan pesan inti bahwa persahabatan sejati membutuhkan sikap saling memahami saat marah, saling memaafkan ketika terjadi kesalahan, ketulusan hati yang tulus, serta kesetiaan yang tak lekang oleh jarak dan berlalunya waktu.', 'Fokus penguasaan: Menelaah Pemahaman Inferensial (Amanat dan Pesan Puisi) pada tingkat Level 2 Aplikasi. Analisis: Jawaban yang tepat adalah C.', 'Pusmendik / BSKAP Kemendikdasmen - Literasi Membaca Fase D'),
(148, 148, 'Jawaban yang tepat adalah C. Berdasarkan catatan sejarah pada infografis kerupuk, makanan renyah khas nusantara ini ternyata sudah ada di Indonesia sejak abad ke-9 atau ke-10 Masehi. Hal tersebut dibuktikan dengan adanya catatan sejarah tertulis pada Prasasti Batu Pura yang menyebutkan istilah kerupuk rambak sebagai makanan tradisional masyarakat Jawa kuno.', 'Fokus penguasaan: Menelaah Pemahaman Tekstual (Informasi Tersurat Sejarah Kerupuk) pada tingkat Level 1 Pemahaman. Analisis: Jawaban yang tepat adalah C.', 'Pusmendik / BSKAP Kemendikdasmen - Literasi Membaca Fase D'),
(149, 149, 'Periksa data dan fakta pada infografis kerupuk:
- Nilai ekspor kerupuk Indonesia pada tahun 2021 tercatat lebih dari 35 juta dolar AS (puluhan juta dolar). Jadi, Pernyataan A Benar.
- Kerupuk memang sudah ada sejak abad ke-9 atau ke-10 menurut Prasasti Batu Pura, tetapi itu fakta sejarah, bukan alasan kerupuk semakin mendunia. Jadi, Pernyataan B Salah.
- Volume ekspor tercatat lebih dari 22 juta kilogram (lebih dari 20 juta kg). Jadi, Pernyataan C Benar.
- Infografis tidak menyebutkan negara atau benua tujuan ekspor. Jadi, Pernyataan D Salah.', 'Fokus penguasaan: Menelaah Pemahaman Inferensial (Ide Pokok dan Fakta Infografis) pada tingkat Level 2 Aplikasi. Analisis: Periksa data dan fakta pada infografis kerupuk:
- Nilai ekspor kerupuk Indonesia pada tahun 2021 tercatat lebih dari 35 juta dolar AS (puluhan juta dolar).', 'Pusmendik / BSKAP Kemendikdasmen - Literasi Membaca Fase D'),
(150, 150, 'Di sebelah kanan infografis disajikan 8 foto jenis kerupuk nusantara (kerupuk bawang, udang, rambak/kulit, rengginang, kerupuk putih, ikan, melarat, dan gendar):
Pernyataan A (Benar): Foto-foto tersebut bertujuan memperlihatkan kekayaan dan keragaman jenis kerupuk yang populer di berbagai daerah di Indonesia.
Pernyataan B (Salah): Infografis tidak memuat harga jual kerupuk, baik di dalam maupun di luar negeri, melainkan hanya menampilkan foto jenis-jenis kerupuk.
Pernyataan C (Salah): Gambar hanya menampilkan foto kerupuk yang sudah jadi, tidak memuat gambar atau daftar bahan baku pembuatannya.
Pernyataan D (Benar): Penampilan foto nyata sangat membantu pembaca mengenali bentuk fisik, tekstur, dan warna dari tiap jenis kerupuk khas Indonesia.', 'Fokus penguasaan: Menelaah Evaluasi dan Apresiasi (Kesesuaian Ilustrasi Jenis Kerupuk) pada tingkat Level 3 Penalaran. Analisis: Di sebelah kanan infografis disajikan 8 foto jenis kerupuk nusantara (kerupuk bawang, udang, rambak/kulit, rengginang, kerupuk putih, ikan, melarat, dan gendar):
Pernyataan A (Benar): Foto-foto tersebut bertujuan memperlihatkan kekayaan dan keragaman jenis kerupuk yang populer di berbagai daerah di Indonesia.', 'Pusmendik / BSKAP Kemendikdasmen - Literasi Membaca Fase D')
ON DUPLICATE KEY UPDATE 
    `question_id` = VALUES(`question_id`), 
    `explanation_text` = VALUES(`explanation_text`), 
    `reasoning_guide` = VALUES(`reasoning_guide`), 
    `reference_url` = VALUES(`reference_url`);

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- SELESAI: Pembenihan Bank Soal Recall Kemampuan Bahasa Indonesia 30 Butir Berhasil.
-- =============================================================================

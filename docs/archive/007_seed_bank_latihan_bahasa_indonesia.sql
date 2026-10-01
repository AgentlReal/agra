-- =============================================================================
-- SEEDING TKA: BANK SOAL LATIHAN (LEVEL_EXERCISE) - BAHASA INDONESIA
-- ERD Version: v6.0 (Clean Schema, No CTT, No difficulty_level)
-- Source: Kumpulan Soal/Bahasa Indonesia (361 Butir Soal Terkalibrasi)
-- Re-indexed & Re-validated:
--   - stimuli: ID 38 s.d. 200 (163 Stimulus)
--   - question_banks: ID 181 s.d. 541 (361 Soal)
--   - question_options: ID 721 s.d. 2144 (1424 Opsi Jawaban)
--   - question_explanations: ID 181 s.d. 541 (361 Pembahasan)
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. PEMBENIHAN TEKS STIMULUS (STIMULI - 163 Stimulus, ID 38..200)
-- -----------------------------------------------------------------------------
INSERT INTO `stimuli` (`id`, `subject_id`, `title`, `stimulus_text`, `stimulus_image_url`) VALUES
(38, 2, 'Perkembangan teknologi kecerdasan buatan (AI) saat ini semak', 'Perkembangan teknologi kecerdasan buatan (AI) saat ini semakin pesat dan merambah hampir ke seluruh aspek kehidupan manusia. Banyak perusahaan skala besar maupun menengah kini mulai menggunakan algoritma khusus untuk memproses big data dan meningkatkan efisiensi kerja di berbagai divisi. Otomatisasi dalam berbagai bidang industri, mulai dari pabrik perakitan otomotif yang digerakkan oleh robot hingga layanan pelanggan daring, menjadi bukti nyata dari inovasi ini. Pekerjaan repetitif yang sebelumnya membutuhkan waktu berhari-hari kini dapat diselesaikan hanya dalam hitungan menit.
Namun, hal ini juga menuntut pekerja untuk terus beradaptasi dengan sistem baru agar tidak tertinggal oleh kemajuan zaman. Para pekerja diimbau untuk mempelajari keterampilan baru yang tidak mudah digantikan oleh mesin, seperti kemampuan negosiasi, pemikiran kritis, dan kepemimpinan. Perusahaan juga diharapkan memberikan pelatihan rutin bagi karyawannya agar transisi teknologi ini tidak memicu pemutusan hubungan kerja secara massal akibat disrupsi digital.
Lebih lanjut, penggunaan sistem komputasi ini harus tetap diawasi secara ketat. Walaupun teknologi mampu bekerja secara cepat dan tanpa lelah, keputusan akhir yang berkaitan dengan etika moral dan empati tetap membutuhkan campur tangan manusia. Oleh karena itu, sinergi yang harmonis antara kecerdasan buatan dan kecerdasan manusia adalah kunci utama. Kolaborasi ini akan menciptakan lingkungan kerja yang produktif, adaptif, dan tetap menjunjung tinggi nilai kemanusiaan.', NULL),
(39, 2, 'Pengolahan limbah rumah tangga sebenarnya bisa dilakukan den', 'Pengolahan limbah rumah tangga sebenarnya bisa dilakukan dengan cara yang sangat sederhana di lingkungan tempat tinggal kita sendiri, salah satunya adalah dengan membuat kompos. Sampah organik, seperti sisa sayuran segar, cangkang telur, dan kulit buah-buahan, sangat mudah terdegradasi oleh mikroorganisme yang ada di dalam tanah. Proses alami ini tidak membutuhkan peralatan yang mahal atau teknologi tinggi, melainkan hanya membutuhkan ketelatenan dan kesadaran dari setiap anggota keluarga untuk mulai memilah sampah dari dapur.
Metode pengolahan sampah organik ini terbukti sangat ramah lingkungan dan membawa banyak manfaat bagi ekosistem sekitar. Dengan melakukan pengomposan, kita dapat secara signifikan mengurangi volume tumpukan sampah yang berakhir di tempat pembuangan akhir. Selain itu, proses pembusukan alami ini pada akhirnya akan menghasilkan pupuk organik berkualitas tinggi. Pupuk alami ini sangat baik untuk menyuburkan tanah di pekarangan rumah, membuat tanaman hias maupun tanaman sayur tumbuh lebih rimbun.
Bagi masyarakat perkotaan yang memiliki lahan terbatas, metode pembuatan kompos bisa dilakukan menggunakan wadah tertutup atau komposter mini yang tidak menimbulkan bau menyengat. Kesadaran kolektif dalam mengelola sisa konsumsi harian ini merupakan langkah kecil namun berdampak besar bagi kelestarian lingkungan. Jika setiap rumah tangga rutin melakukan praktik ini, permasalahan penumpukan sampah di perkotaan dapat diatasi secara berkelanjutan.', NULL),
(40, 2, 'Menjaga imunitas tubuh sangatlah penting, terutama saat kita', 'Menjaga imunitas tubuh sangatlah penting, terutama saat kita sedang menghadapi peralihan musim atau yang sering disebut sebagai musim pancaroba. Pada masa ini, perubahan cuaca yang ekstrem dari panas terik ke hujan deras dapat membuat tubuh rentan terhadap berbagai serangan virus maupun bakteri. Tubuh manusia sangat membutuhkan asupan nutrisi yang seimbang setiap harinya untuk memperlancar metabolisme serta membangun perisai pertahanan alami yang kuat. Tanpa asupan gizi dan metabolisme yang baik, fungsi organ-organ vital akan rentan mengalami penurunan performa secara drastis.
Oleh sebab itu, pakar kesehatan dan ahli gizi sangat menyarankan kita untuk rutin mengonsumsi sumber protein nabati maupun hewani secara proporsional. Konsumsi ikan, telur, daging tanpa lemak, serta aneka kacang-kacangan dan tahu tempe harus diatur porsinya agar tidak berlebihan namun tetap memenuhi kebutuhan harian. Pola makan yang teratur dan porsi yang seimbang ini menjadi kunci utama agar tubuh tetap bugar dan penuh energi dalam menjalani rutinitas harian.
Selain mengatur pola makan, istirahat yang cukup dan pengelolaan stres juga tidak boleh diabaikan. Tidur malam minimal tujuh hingga delapan jam akan memberikan waktu bagi sel-sel tubuh untuk melakukan regenerasi diri. Ditambah dengan olahraga ringan seperti berjalan kaki atau bersepeda setiap pagi, sirkulasi darah akan menjadi lebih lancar. Kombinasi gaya hidup sehat inilah yang akan menjamin ketahanan fisik bekerja secara maksimal.', NULL),
(41, 2, 'Lidah buaya adalah tanaman dengan banyak sekali manfaat', 'Lidah buaya adalah tanaman dengan banyak sekali manfaat. Tanaman berduri ini sangat mudah ditanam di pekarangan. Daun lidah buaya memiliki daging tebal berair bening. Banyak orang menyebut tanaman ini dengan Aloe vera. Kandungan air di dalam daunnya sangat melimpah sekali. Lendir pada daun tersebut mengandung berbagai macam vitamin. Tanaman ini sudah digunakan sejak zaman nenek moyang. Masyarakat memanfaatkan lidah buaya untuk ramuan obat tradisional.
Manfaat paling terkenal adalah untuk menyuburkan rambut kepala. Lendir lidah buaya membuat rambut menjadi hitam lebat. Tanaman ini juga sangat bagus untuk kesehatan kulit. Getah beningnya bisa mengobati luka bakar yang ringan. Banyak produk kecantikan menggunakan ekstrak lidah buaya asli. Sabun cuci muka dari lidah buaya sangat menyegarkan. Kulit wajah menjadi lembap dan bebas jerawat membandel. Tanaman herbal ini memang memiliki khasiat luar biasa.
Selain untuk luar, lidah buaya bisa dikonsumsi langsung. Daging daun lidah buaya sering dijadikan minuman segar. Minuman lidah buaya sangat cocok diminum saat siang. Rasa minuman ini sangat manis dan juga menyegarkan. Konsumsi lidah buaya bisa meredakan gejala panas dalam. Sistem pencernaan manusia juga menjadi sehat dan lancar. Cara mengolah lidah buaya cukup mudah untuk dipraktikkan. Cuci bersih daging daun untuk membuang getah pahit. Rebus sebentar daging daun sebelum dicampur dengan sirup.', NULL),
(42, 2, 'Kenaikan harga barang pokok dan jasa secara terus-menerus da', 'Kenaikan harga barang pokok dan jasa secara terus-menerus dalam rentang waktu tertentu di dalam ilmu ekonomi sering dikenal dengan istilah inflasi. Kondisi ekonomi yang meresahkan masyarakat ini tidak jarang dipicu oleh adanya fluktuasi atau ketidakstabilan harga bahan bakar minyak bumi di pasar internasional. Ketika harga minyak mentah dunia melonjak tajam, biaya operasional pabrik dan ongkos distribusi barang logistik secara otomatis akan membengkak, yang pada akhirnya dampaknya akan dibebankan kepada konsumen akhir melalui kenaikan harga jual produk di pasaran.
Akibat langsung dari rentetan kejadian sistemik ini adalah daya beli masyarakat, khususnya di kalangan menengah ke bawah, yang mengalami penurunan sangat drastis. Dengan jumlah pendapatan upah bulanan yang cenderung stagnan atau tetap sama, masyarakat terpaksa harus mengurangi porsi konsumsi harian mereka karena nilai tukar uang merosot. Kebutuhan dasar seperti beras, minyak goreng, dan telur mendadak terasa sangat mahal dan sulit dijangkau oleh sebagian besar keluarga yang berpenghasilan rendah.
Untuk mengatasi krisis yang berpotensi memicu masalah kesenjangan sosial ini, pemerintah pun harus segera turun tangan melakukan intervensi pasar secara masif. Langkah yang biasanya diambil adalah mendistribusikan cadangan pangan nasional atau memberikan subsidi bantuan langsung demi menjaga stabilisasi perekonomian. Kebijakan strategis tersebut diharapkan mampu meredam gejolak harga komoditas pokok dan mengembalikan kesejahteraan finansial masyarakat.', NULL),
(43, 2, 'Saat langit malam sangat cerah tanpa terhalang awan mendung,', 'Saat langit malam sangat cerah tanpa terhalang awan mendung, kita bisa melihat hamparan bintang di angkasa luas dengan mata telanjang. Sejak zaman dahulu, peradaban manusia telah memetakan berbagai rasi bintang atau yang secara ilmiah disebut sebagai konstelasi. Gugusan bintang ini membentuk pola-pola unik yang sering digunakan sebagai kalender pertanian atau petunjuk arah oleh para pelaut kuno saat mengarungi samudra. Kini, pengamatan astronomi telah berkembang pesat menggunakan teleskop super canggih untuk memetakan objek langit yang jaraknya jutaan tahun cahaya dari bumi.
Sementara itu, di sistem tata surya kita sendiri, planet-planet terus bergerak secara teratur mengelilingi matahari pada lintasan melingkar yang disebut orbit. Fenomena pergerakan yang sangat stabil ini bisa terjadi karena adanya gaya gravitasi yang dihasilkan oleh matahari sebagai pusat tata surya. Gaya tarik-menarik massa yang sangat kuat ini berfungsi untuk menahan planet-planet, termasuk bumi, agar tidak terlempar bebas dan hilang ke ruang angkasa yang hampa udara dan bersuhu beku.
Lebih jauh dari batas tata surya kita, galaksi tempat kita bermukim, yakni Bima Sakti, ternyata hanyalah satu dari miliaran galaksi lain di alam semesta. Bima Sakti masih menyimpan jutaan misteri kosmik yang terus diteliti oleh para ilmuwan dari berbagai badan antariksa dunia. Eksplorasi luar angkasa ini membuktikan bahwa batas pengetahuan manusia tentang semesta akan terus berkembang seiring kemajuan teknologi sains.', NULL),
(44, 2, 'Pertunjukan musik orkestra simfoni malam itu berlangsung den', 'Pertunjukan musik orkestra simfoni malam itu berlangsung dengan sangat megah dan berhasil memukau seluruh penonton yang memenuhi aula utama. Berbagai jenis instrumen, mulai dari alat musik gesek seperti biola dan selo hingga alat musik tiup seperti seruling dan terompet, dimainkan secara serentak. Penyatuan berbagai variasi instrumen ini menghasilkan sebuah harmoni yang sangat indah, selaras, dan mampu menyentuh relung hati para pendengar. Suasana syahdu tersebut seketika membuat seluruh penonton terhanyut dalam setiap bait nada klasik yang dilantunkan.
Di atas panggung, pertunjukan luar biasa ini berada di bawah kendali penuh dan arahan tangan sang maestro yang sangat berpengalaman. Tokoh ahli di bidang seni musik ini memimpin puluhan pemusik dengan gerakan tongkatnya yang penuh wibawa, ekspresif, dan memiliki presisi ketukan tinggi. Ruangan gedung konser yang memiliki desain arsitektur akustik luar biasa turut mendukung kesuksesan acara tersebut. Resonansi suara alat musik terdengar sangat jernih, tajam, dan memanjakan telinga, bahkan hingga ke barisan kursi penonton paling belakang.
Pada akhirnya, pertunjukan yang berlangsung selama lebih dari dua jam tersebut ditutup dengan tepuk tangan meriah yang bergemuruh dari seluruh penjuru ruangan. Apresiasi penonton yang berdiri memberikan standing ovation membuktikan bahwa seni musik klasik masih memiliki tempat istimewa di hati masyarakat modern. Kolaborasi antara keahlian musisi, kepiawaian pemimpin orkestra, dan kualitas akustik ruangan benar-benar menciptakan malam mahakarya.', NULL),
(45, 2, 'Di bawah cahaya lampu jalanan kota yang remang dan tertutup', 'Di bawah cahaya lampu jalanan kota yang remang dan tertutup kabut tipis, suasana malam itu terasa sangat mencekam dan penuh teka-teki. Dari kejauhan, tampak sebuah siluet pria berpostur tinggi yang mengenakan mantel panjang serta topi fedora berwarna gelap. Bayangan hitam tanpa bentuk wajah yang jelas tersebut bergerak mengendap-endap secara mencurigakan di sekitar gang sempit di belakang gedung museum sejarah. Sosok misterius itu kemudian perlahan menunduk, memeriksa keadaan sekitar dengan waspada, dan dengan sigap memungut secarik kertas yang jatuh tertiup angin malam.
Detektif Arya, yang sejak awal malam sudah mengintai dari balik semak belukar di seberang jalan, terus memperhatikan setiap gerak-gerik sosok tersebut. Ia memegang kamera dengan lensa jarak jauh, lalu dengan hati-hati merekam kejadian singkat itu dan mencatatnya sebagai petunjuk baru yang sangat krusial. Selama berminggu-minggu, Arya telah dikerahkan menyelidiki kasus pencurian permata legendaris yang hilang dari brankas museum tanpa meninggalkan jejak sidik jari atau kerusakan fisik sedikit pun.
Berkat kejadian tak terduga pada malam berkabut itu, benang merah dari kasus pencurian permata bernilai miliaran rupiah ini perlahan-lahan mulai terkuak kebenarannya. Kertas yang dipungut oleh tersangka ternyata berisi rincian peta denah museum, letak sensor alarm, dan rute pelarian yang telah direncanakan dengan matang. Penemuan petunjuk ini menjadi titik terang bagi kepolisian untuk segera membongkar sindikat kejahatan tersebut.', NULL),
(46, 2, 'Setelah berbulan-bulan menunjukkan tanda-tanda peningkatan a', 'Setelah berbulan-bulan menunjukkan tanda-tanda peningkatan aktivitas berupa gemuruh vulkanik, gunung berapi yang terletak di perbatasan kabupaten itu akhirnya meletus. Pada pertengahan malam yang sunyi, gunung tersebut mengalami erupsi dahsyat yang melontarkan material pijar sejauh puluhan kilometer ke udara. Muntahan magma yang sangat panas disertai awan panas dan abu vulkanik pekat menyebar dengan cepat, kemudian mengalir deras menerjang kawasan lembah terdekat. Pemandangan langit seketika berubah menjadi merah menyala akibat pantulan cahaya lava yang menyala di tengah kegelapan malam.
Beruntung, beberapa jam sebelum letusan besar sungguhan terjadi, alat seismograf digital yang berada di pos pemantauan telah mencatat lonjakan aktivitas kegempaan yang tidak wajar. Berdasarkan data akurat tersebut, tim penyelamat gabungan dari pemerintah daerah segera melakukan langkah mitigasi yang sangat cepat dan terukur. Tindakan pengurangan risiko bencana ini dilakukan dengan membunyikan sirine peringatan dini berkali-kali dan mengevakuasi seluruh penduduk desa yang berada di zona bahaya ke tempat pengungsian.
Keesokan harinya, meskipun letusan utama telah mereda perlahan, hujan abu vulkanik masih terus mengguyur wilayah di sekitar lereng pegunungan hingga menyelimuti atap-atap rumah warga. Pemerintah dibantu oleh relawan medis kini berfokus penuh pada penyaluran logistik, persediaan air bersih, dan pembagian masker untuk melindungi pernapasan para pengungsi dari partikel debu yang sangat berbahaya bagi paru-paru.', NULL),
(47, 2, 'Atlet lari maraton nasional yang mewakili Indonesia itu menu', 'Atlet lari maraton nasional yang mewakili Indonesia itu menunjukkan performa yang sangat gemilang dalam perlombaan tingkat Asia yang diselenggarakan di bawah cuaca terik. Ia memperlihatkan stamina yang luar biasa tangguh, mampu menjaga daya tahan fisik dan ritme pernapasan meskipun harus menempuh lintasan aspal sepanjang puluhan kilometer. Berdasarkan analisis pelatih, ia rupanya menerapkan strategi khusus dengan berlari pada kecepatan yang sangat stabil di sepuluh kilometer pertama, murni untuk menyimpan cadangan energi hingga mendekati garis akhir perlombaan.
Meskipun persaingan di lintasan lari tersebut sangat ketat dan menguras banyak keringat, suasana pertandingan secara keseluruhan tetap berlangsung dengan damai dan saling menghargai. Semua peserta dari berbagai negara tetap menjunjung tinggi sportivitas yang menjadi napas dan landasan moral utama dari setiap kejuaraan olahraga. Para atlet tidak segan-segan untuk saling memberikan semangat, menghindari perbuatan curang dengan tidak saling jegal, dan dengan jujur mengakui keunggulan strategi yang diterapkan pesaingnya.
Pada puncaknya, memasuki kilometer terakhir menjelang garis finis, persaingan semakin memanas antara pelari Indonesia dan atlet asal Kenya. Dengan sisa tenaga yang ada, atlet dari Kenya melakukan sprint kejutan yang luar biasa cepat sehingga berhasil menyalip barisan terdepan, berhak membawa pulang medali emas. Meski hanya finis di urutan kedua, atlet nasional kita tetap tersenyum bangga dan memberikan pelukan selamat secara langsung.', NULL),
(48, 2, 'Candi Borobudur adalah candi Buddha terbesar di seluruh duni', 'Candi Borobudur adalah candi Buddha terbesar di seluruh dunia. Bangunan megah ini terletak di wilayah Magelang, Jawa Tengah. Candi bersejarah ini dibangun pada masa pemerintahan Dinasti Syailendra. Pembangunan monumen suci ini terjadi sekitar abad kedelapan Masehi. Borobudur memiliki sembilan teras bertumpuk yang sangat indah sekali. Enam teras di bagian bawah memiliki bentuk bujur sangkar. Tiga teras di bagian atas dibangun dengan bentuk bundar. Pada bagian puncak candi terdapat sebuah stupa sangat besar.
Stupa utama tersebut dikelilingi oleh tujuh puluh dua stupa. Stupa yang berukuran lebih kecil itu memiliki banyak lubang. Di dalam setiap lubang terdapat arca Buddha duduk bersila. Dinding candi dihiasi relief tentang ajaran suci agama Buddha. Banyak wisatawan asing datang untuk melihat keindahan candi ini. Mereka sangat kagum melihat ukiran batu yang sangat detail. Pemerintah selalu berusaha menjaga kelestarian warisan budaya dunia ini. Pengunjung tidak boleh membuang sampah sembarangan di area candi.
Kita semua harus bangga memiliki bangunan bersejarah sangat megah. Keindahan candi ini terlihat paling jelas saat matahari terbit. Sinar matahari pagi membuat batu candi tampak bersinar terang. Banyak fotografer mengabadikan momen indah itu dari atas candi. Berada di Candi Borobudur memberikan pengalaman yang sangat berkesan. Mari kita terus merawat peninggalan leluhur bangsa Indonesia ini. Candi Borobudur akan selalu menjadi kebanggaan bagi seluruh rakyat.', NULL),
(49, 2, 'Gunung Bromo merupakan sebuah gunung berapi sangat aktif', 'Gunung Bromo merupakan sebuah gunung berapi sangat aktif. Gunung ini terletak di wilayah provinsi Jawa Timur. Lokasi gunung mencakup empat wilayah kabupaten yang berbeda. Gunung ini berada di dalam taman nasional besar. Nama taman nasional itu adalah Bromo Tengger Semeru. Ketinggian Gunung Bromo mencapai ribuan meter dari laut. Bentuk tubuh gunung ini bertautan dengan lembah luas. Sebuah kaldera besar mengelilingi kawasan gunung berapi ini.
Hamparan lautan pasir luas menjadi daya tarik utama. Pasir hitam tersebut membentang sangat jauh memanjakan mata. Para pengunjung biasanya menyewa mobil jip untuk berkeliling. Kawah Gunung Bromo juga selalu mengeluarkan asap putih. Asap putih tersebut berbau belerang yang sangat menyengat. Pengunjung harus menaiki ratusan anak tangga menuju kawah. Anak tangga itu terbuat dari beton yang kuat. Pemandangan dari atas bibir kawah terlihat sangat menakjubkan. Suhu udara di sekitar kawasan ini sangat dingin.
Gunung Bromo adalah destinasi wisata favorit di Indonesia. Turis lokal maupun mancanegara sering berkunjung ke sana. Momen matahari terbit adalah pemandangan yang paling dicari. Banyak orang rela bangun pagi untuk melihatnya langsung. Penduduk asli sekitar gunung disebut sebagai Suku Tengger. Suku Tengger memiliki kebudayaan yang masih sangat terjaga. Mereka rutin mengadakan upacara adat pada waktu tertentu. Upacara adat itu bertujuan sebagai bentuk rasa syukur. Kawasan wisata Bromo wajib dijaga kelestariannya oleh semua.', NULL),
(50, 2, 'Hutan mangrove memiliki peran penting bagi ekosistem daerah', 'Hutan mangrove memiliki peran penting bagi ekosistem daerah pesisir. Pohon mangrove memiliki akar kuat yang masuk ke lumpur. Akar tanaman ini mampu menahan abrasi air laut ganas. Hutan mangrove dapat memecah gelombang besar dari arah laut. Bencana alam seperti tsunami dapat diredam oleh pepohonan ini. Selain itu, mangrove menjadi habitat bagi berbagai jenis hewan. Banyak jenis ikan kecil bersembunyi di sela akar pohon.
Kepiting juga hidup dan mencari makan di daerah tersebut. Burung bangau sering bertengger di atas dahan pohon mangrove. Mereka selalu bersiap untuk menangkap ikan di permukaan air. Hutan mangrove sangat bermanfaat bagi kelangsungan hidup para nelayan. Sayangnya, banyak hutan mangrove kini rusak akibat ulah manusia. Lahan hutan mangrove sering diubah menjadi area tambak ikan. Kerusakan ini membuat lingkungan pesisir menjadi sangat rentan sekali. Gelombang laut dapat langsung menghantam permukiman warga di pesisir.
Kita harus segera bertindak untuk menyelamatkan sisa hutan mangrove. Kegiatan menanam bibit mangrove baru harus rutin kita lakukan. Pemerintah wajib melarang perusakan hutan di seluruh wilayah pesisir. Warga setempat harus menjaga kelestarian alam demi masa depan. Mangrove yang lebat akan menjaga keseimbangan lingkungan pantai kita. Udara di sekitar pantai juga menjadi lebih sejuk segar. Mari lestarikan hutan mangrove untuk melindungi bumi tercinta ini.', NULL),
(51, 2, 'Pemanasan global merupakan peningkatan suhu rata-rata pada a', 'Pemanasan global merupakan peningkatan suhu rata-rata pada atmosfer bumi. Suhu permukaan laut dan daratan juga ikut menjadi panas. Fenomena alam ini sangat berbahaya bagi kelangsungan makhluk hidup. Salah satu penyebab utama masalah ini adalah emisi karbon. Gas karbon ini menciptakan efek rumah kaca yang parah. Banyak kendaraan bermotor menghasilkan asap gas buang yang beracun. Aktivitas industri pabrik juga menambah jumlah polusi udara harian.
Dampak dari pemanasan global sudah mulai terasa saat ini. Es di wilayah kutub utara dan selatan perlahan mencair. Hal ini menyebabkan naiknya permukaan air laut setiap tahun. Pulau kecil di tengah lautan terancam tenggelam secara perlahan. Perubahan cuaca yang sangat ekstrem juga sering terjadi sekarang. Musim kemarau menjadi sangat panjang dan menyebabkan kekeringan parah. Curah hujan tinggi dapat memicu banjir bandang yang merusak.
Kita semua harus berupaya untuk mengurangi dampak pemanasan global. Menggunakan transportasi umum adalah langkah kecil yang sangat berarti. Kita juga harus rajin menanam pohon di lingkungan sekitar. Pohon rindang mampu menyerap polusi gas karbon dioksida berbahaya. Penghematan energi listrik juga wajib dilakukan di setiap rumah. Matikan semua peralatan elektronik saat tidak digunakan oleh keluarga. Menjaga bumi adalah tugas bersama seluruh umat manusia sekarang. Mari wujudkan lingkungan yang sehat untuk generasi masa depan. Langkah kecil kita akan menyelamatkan bumi dari kerusakan parah.', NULL),
(52, 2, 'Pemerintah kota mulai menggalakkan aturan baru kantong belan', 'Pemerintah kota mulai menggalakkan aturan baru kantong belanja kain. Tujuan utama program sosial ini adalah menjaga kebersihan lingkungan. Volume tumpukan sampah plastik harus segera dikurangi mulai sekarang. Sampah berbahan plastik sangat sulit hancur di dalam tanah. Tumpukan sampah plastik bisa membuat kondisi tanah menjadi rusak. Banyak pasar swalayan besar mulai menerapkan kebijakan pelestarian lingkungan. Kantong belanja plastik kini tidak diberikan secara cuma-cuma lagi.
Para pembeli harus selalu membawa tas belanja dari rumah. Jika pembeli ternyata lupa membawa tas kain dari rumah. Pembeli tersebut wajib membayar uang untuk membeli kantong plastik. Harga eceran kantong plastik sengaja dibuat menjadi cukup mahal. Tujuannya agar para warga merasa enggan membeli kantong plastik. Kebijakan tegas dari pemerintah kota ini dinilai sangat efektif. Sampah berbahan plastik dari rumah tangga mulai banyak berkurang. Target penurunan volume sampah kota adalah empat puluh persen.
Target persentase besar tersebut harus tercapai dalam satu tahun. Warga kota kini mulai terbiasa membawa tas kain sendiri. Tas belanja kain ini bisa digunakan secara berulang kali. Tas berbahan kain tebal juga sangat kuat membawa barang. Lingkungan wilayah kota kita menjadi bersih dari sampah plastik. Saluran air kini tidak mudah tersumbat oleh tumpukan sampah. Bencana banjir tahunan dapat dicegah dengan langkah sangat sederhana. Mari kita dukung program pemerintah demi kebaikan lingkungan bersama.', NULL),
(53, 2, 'Pisang merupakan salah satu buah tropis paling populer', 'Pisang merupakan salah satu buah tropis paling populer. Buah manis ini sangat mudah ditemukan di Indonesia. Tanaman pisang dapat tumbuh subur di berbagai tempat. Harga buah pisang di pasar juga sangat terjangkau. Warna kulit pisang akan berubah kuning saat matang. Daging buahnya memiliki tekstur yang sangat lembut sekali. Rasa manis alami membuat buah ini banyak disukai. Orang biasa memakan buah ini secara langsung saja.
Buah pisang mengandung sangat banyak nutrisi yang penting. Kandungan kalium di dalam buah pisang sangat tinggi. Kalium berfungsi untuk menjaga kesehatan organ jantung manusia. Pisang juga menjadi sumber karbohidrat alami yang baik. Karbohidrat tersebut memberikan energi tambahan bagi tubuh kita. Banyak atlet mengonsumsi buah pisang sebelum mulai bertanding. Buah ini juga kaya akan kandungan serat pencernaan. Serat buah membantu melancarkan sistem pencernaan di perut. Vitamin dalam pisang membantu meningkatkan daya tahan tubuh.
Pisang dapat diolah menjadi berbagai macam jenis makanan. Orang sering membuat keripik pisang sebagai camilan gurih. Pisang goreng adalah makanan ringan favorit masyarakat kita. Buah ini juga cocok dicampur ke dalam sereal. Daun tanaman pisang sering dimanfaatkan sebagai pembungkus makanan. Jantung pisang juga bisa dimasak menjadi sayur lezat. Hampir semua bagian tanaman ini memberikan banyak manfaat. Mengonsumsi buah pisang setiap hari sangat dianjurkan ahli. Tubuh manusia akan menjadi lebih sehat dan bugar.', NULL),
(54, 2, 'Sarapan pagi merupakan waktu makan yang sangat paling pentin', 'Sarapan pagi merupakan waktu makan yang sangat paling penting. Makanan bergizi pada pagi hari memberikan sangat banyak manfaat. Tubuh manusia selalu membutuhkan pasokan energi untuk memulai aktivitas. Otak kita juga butuh asupan nutrisi agar tetap fokus. Mengonsumsi makanan sehat setiap pagi sangat dianjurkan oleh ahli. Anak usia sekolah wajib menikmati sarapan pada setiap pagi. Siswa yang rajin menyantap sarapan terbukti menjadi lebih pintar.
Tingkat konsentrasi belajar siswa di dalam kelas menjadi baik. Materi penjelasan pelajaran dapat diserap dengan sangat mudah sekali. Siswa yang rutin makan sarapan jarang merasa sangat mengantuk. Mereka juga tidak merasa lemas saat sedang mengikuti pelajaran. Anak yang sering melewatkan makan sarapan terlihat sangat pucat. Kondisi perut kosong membuat anak sulit menjaga konsentrasi penuh. Anak tersebut bisa mudah jatuh sakit jika dibiarkan terus. Oleh karena alasan itu sarapan pagi adalah kegiatan wajib.
Menu hidangan sarapan setiap pagi harus selalu diperhatikan saksama. Makanan sehat tersebut harus mengandung unsur karbohidrat yang kompleks. Contoh utama sumber karbohidrat baik adalah nasi atau roti. Protein nabati hewani juga sangat penting bagi kesehatan tubuh. Telur ayam dan susu segar adalah sumber protein terbaik. Serat alami dari buah manis juga sangat dibutuhkan tubuh. Porsi makan sarapan pagi tidak perlu dibuat terlalu banyak. Hal paling penting adalah komposisi kandungan gizi makanan tersebut.', NULL),
(55, 2, 'Proses terjadinya hujan selalu diawali dengan penguapan air', 'Proses terjadinya hujan selalu diawali dengan penguapan air bumi. Air laut dan sungai menguap karena sengatan panas matahari. Proses naiknya uap air bumi ini sering disebut evaporasi. Uap air hangat tersebut kemudian perlahan naik menuju atmosfer. Suhu pada lapisan atmosfer atas bumi terasa sangat dingin. Di tempat sangat dingin tersebut uap air mengalami kondensasi. Proses perubahan uap kondensasi ini sering disebut sebagai pengembunan.
Hasil proses pengembunan uap air itu perlahan membentuk awan. Angin kencang lalu membawa awan berkumpul menjadi lebih besar. Awan yang berkumpul tersebut perlahan berubah menjadi sangat berat. Awan tebal tersebut tidak lagi mampu menampung titik air. Saat hal berat itu terjadi maka terjadilah proses presipitasi. Proses presipitasi adalah jatuhnya titik air ke permukaan bumi. Titik air yang jatuh membasahi bumi sering disebut hujan. Air hujan segar membasahi daratan tanah dan tanaman hijau.
Genangan air hujan akan mengalir menuju badan sungai besar. Sungai tersebut membawa air terus mengalir kembali menuju laut. Siklus perputaran air bumi ini akan berulang secara terus-menerus. Ketersediaan pasokan air bersih di bumi menjadi selalu terjaga. Semua jenis makhluk hidup pasti sangat membutuhkan air hujan. Tanaman liar juga bisa tumbuh subur karena air hujan. Turunnya air hujan adalah anugerah alam yang luar biasa. Siklus hidrologi alam ini menyeimbangkan kondisi cuaca di bumi.', NULL),
(56, 2, 'Peristiwa Sumpah Pemuda berawal dari kegiatan Kongres Pemuda', 'Peristiwa Sumpah Pemuda berawal dari kegiatan Kongres Pemuda Indonesia. Kongres bersejarah ini digagas oleh sekumpulan pelajar yang hebat. Mereka tergabung dalam organisasi Perhimpunan Pelajar Pelajar seluruh Indonesia. Kongres pemuda nasional ini sengaja diadakan dalam tiga rapat. Setiap sesi rapat penting diselenggarakan di gedung yang berbeda. Rapat pertama dilaksanakan tepat pada tanggal dua puluh tujuh. Bulan Oktober tahun seribu sembilan ratus dua puluh delapan.
Lokasi sesi rapat pertama berada di Gedung Pemuda Katolik. Rapat hari pertama ini membahas arti penting sebuah persatuan. Rapat kedua kemudian diadakan keesokan harinya pada waktu pagi. Tanggal pelaksanaan adalah dua puluh delapan di bulan Oktober. Lokasi acara rapat kedua bertempat di Gedung Bioskop Jawa. Agenda utama rapat kedua adalah membahas tentang masalah pendidikan. Rapat ketiga langsung dilaksanakan pada malam hari yang sama. Rapat terakhir ini menjadi puncak seluruh acara kongres pemuda.
Lokasi acara rapat ketiga berada di Gedung Klub Indonesia. Rapat sangat bersejarah ini menghasilkan sebuah rumusan Sumpah Pemuda. Naskah suci Sumpah Pemuda dibacakan dengan suara sangat lantang. Tokoh pemuda hebat bernama Soegondo Djojopoespito membacakan naskah bersejarah. Semua pemuda peserta kongres merasa sangat bangga dan terharu. Lagu kebangsaan Indonesia Raya ikut dikumandangkan pada acara tersebut. Momen ini menjadi tonggak sejarah persatuan bagi bangsa Indonesia. Semangat menjaga persatuan para pemuda ini sangat patut ditiru.', NULL),
(57, 2, 'Membuat olahan telur asin ternyata sangatlah mudah sekali', 'Membuat olahan telur asin ternyata sangatlah mudah sekali. Langkah pertama adalah menyiapkan beberapa butir telur bebek. Pastikan telur bebek tersebut masih dalam keadaan mentah. Cuci semua permukaan cangkang telur bebek hingga bersih. Hilangkan semua kotoran yang menempel pada kulit telur. Langkah kedua adalah mengamplas kulit telur secara perlahan. Proses ini bertujuan agar pori cangkang menjadi terbuka. Langkah ketiga adalah membuat adonan pembungkus telur asin.
Siapkan bahan campuran berupa bubuk abu gosok hitam. Tambahkan butiran garam kasar ke dalam wadah abu. Tuangkan sedikit air bersih ke dalam campuran tersebut. Aduk perlahan hingga adonan bertekstur kental seperti pasta. Langkah keempat adalah membalut seluruh bagian permukaan telur. Gunakan adonan abu gosok untuk menutupi seluruh cangkang. Ketebalan balutan abu disarankan sekitar satu sentimeter saja.
Langkah kelima adalah tahap menyimpan butiran telur bebek. Simpan semua telur ke dalam sebuah wadah tertutup. Biarkan proses pengasinan berlangsung selama empat belas hari. Proses maksimal dapat dilakukan hingga dua puluh hari. Tahap terakhir adalah proses membersihkan seluruh balutan abu. Cuci kembali butiran telur bebek menggunakan air bersih. Rebus butiran telur asin tersebut hingga benar-benar matang. Telur asin rebus sudah siap untuk disajikan bersama.', NULL),
(58, 2, 'Daur hidup serangga ini merupakan sebuah contoh metamorfosis', 'Daur hidup serangga ini merupakan sebuah contoh metamorfosis. Proses pertumbuhan serangga ini sering disebut metamorfosis sempurna. Fase pertama selalu dimulai dari sebuah butiran telur. Induk betina meletakkan telur pada bagian permukaan daun. Butiran telur kecil tersebut menempel sangat kuat sekali. Setelah lewat beberapa hari telur akan menetas perlahan. Fase kedua dimulai saat telur berubah menjadi larva. Larva serangga ini lebih sering disebut sebagai ulat.
Ulat kecil tersebut biasanya sangat rakus memakan dedaunan. Mereka makan terus untuk mengumpulkan banyak energi tubuh. Ukuran tubuh ulat akan mencapai batas tumbuh maksimal. Setelah besar ulat mulai mencari tempat paling aman. Ulat bersiap memasuki fase ketiga yaitu menjadi kepompong. Fase diam ini juga sering disebut istilah pupa. Dalam fase ini ulat membungkus rapat tubuhnya sendiri.
Hewan ini berpuasa selama berada di dalam cangkang. Ulat beristirahat panjang selama waktu belasan hari penuh. Seluruh bentuk tubuh ulat mengalami proses perubahan total. Setelah waktu selesai cangkang kepompong perlahan mulai terbuka. Fase keempat dimulai saat wujud serangga mulai keluar. Serangga bersayap indah keluar dari dalam cangkang kepompong. Serangga cantik ini mulai dikenal sebagai hewan dewasa. Hewan bersayap yang sangat menawan ini disebut imago.', NULL),
(59, 2, 'Daur hidup kupu-kupu merupakan contoh metamorfosis sempurna', 'Daur hidup kupu-kupu merupakan contoh metamorfosis sempurna. Fase pertama dimulai dari telur yang biasanya menempel pada daun. Setelah beberapa hari, telur menetas menjadi larva atau ulat yang sangat rakus memakan dedaunan. Setelah ukuran ulat mencapai maksimal, ulat akan mencari tempat aman untuk berubah menjadi pupa atau kepompong. Dalam fase kepompong, ulat berpuasa dan beristirahat selama belasan hari. Daur hidup serangga ini merupakan sebuah contoh metamorfosis. Proses pertumbuhan serangga ini sering disebut metamorfosis sempurna. Fase pertama selalu dimulai dari sebuah butiran telur. Induk betina meletakkan telur pada bagian permukaan daun. Butiran telur kecil tersebut menempel sangat kuat sekali. Setelah lewat beberapa hari telur akan menetas perlahan. Fase kedua dimulai saat telur berubah menjadi larva. Larva serangga ini lebih sering disebut sebagai ulat.
Ulat kecil tersebut biasanya sangat rakus memakan dedaunan. Mereka makan terus untuk mengumpulkan banyak energi tubuh. Ukuran tubuh ulat akan mencapai batas tumbuh maksimal. Setelah besar ulat mulai mencari tempat paling aman. Ulat bersiap memasuki fase ketiga yaitu menjadi kepompong. Fase diam ini juga sering disebut istilah pupa. Dalam fase ini ulat membungkus rapat tubuhnya sendiri.
Hewan ini berpuasa selama berada di dalam cangkang. Ulat beristirahat panjang selama waktu belasan hari penuh. Seluruh bentuk tubuh ulat mengalami proses perubahan total. Setelah waktu selesai cangkang kepompong perlahan mulai terbuka. Fase keempat dimulai saat wujud serangga mulai keluar. Serangga bersayap indah keluar dari dalam cangkang kepompong. Serangga cantik ini mulai dikenal sebagai hewan dewasa. Hewan bersayap yang sangat menawan ini disebut imago.', NULL),
(60, 2, 'Taman Mini Indonesia Indah merupakan destinasi wisata nasion', 'Taman Mini Indonesia Indah merupakan destinasi wisata nasional. Tempat rekreasi ini memiliki kerangka pembagian area unik. Area bagian depan dikhususkan untuk lokasi anjungan daerah. Anjungan tersebut mewakili seluruh bangunan arsitektur tradisional nusantara. Pengunjung bisa melihat berbagai rumah adat dari provinsi. Rumah adat tersebut dibangun menyerupai bentuk bangunan aslinya. Setiap bangunan adat menyimpan banyak benda bersejarah daerah. Wisatawan dapat mempelajari budaya lokal di setiap anjungan.
Bergerak ke area tengah pengunjung akan menemukan danau. Danau buatan berukuran besar tersebut terlihat sangat indah. Di bagian tengah danau terdapat miniatur kepulauan nusantara. Pulau kecil buatan itu dibentuk menyerupai peta negara. Pemandangan pulau tersebut sangat cantik dilihat dari atas. Pengunjung bisa menyewa perahu untuk mengelilingi danau buatan. Angin sejuk berhembus pelan di sekitar area perairan.
Perjalanan berlanjut menuju wilayah area belakang taman wisata. Di lokasi ini terdapat banyak sekali bangunan museum. Museum tematik didirikan untuk menyimpan benda koleksi berharga. Contoh museum populer adalah bangunan khusus ilmu transportasi. Ada juga museum fauna yang berbentuk hewan komodo. Wahana rekreasi keluarga juga tersedia di area belakang. Anak kecil bisa bermain dengan aman di sana. Taman ini sangat cocok untuk tujuan liburan keluarga.', NULL),
(61, 2, 'Langkah mencuci bagian tangan harus sesuai standar kesehatan', 'Langkah mencuci bagian tangan harus sesuai standar kesehatan. Standar kesehatan mengatur tahapan cuci tangan secara berurutan. Mulailah dengan membasahi kedua permukaan telapak tangan anda. Gunakan air bersih mengalir dari lubang keran wastafel. Setelah tangan basah tuangkan sabun cair secukupnya saja. Gosok seluruh permukaan telapak tangan dengan gerakan memutar. Jangan lupa menggosok bagian punggung tangan secara bergantian. Bersihkan juga semua kotoran pada area sela jari.
Langkah berikutnya adalah membersihkan bagian kuku ujung jari. Posisikan kedua tangan saling mengunci secara erat bergantian. Gerakan saling mengunci ini akan membuang sisa kuman. Setelah itu bersihkan bagian ibu jari tangan anda. Gosok ibu jari menggunakan sebuah gerakan memutar perlahan. Pastikan bagian pangkal ibu jari juga ikut digosok. Sabun akan membunuh semua bakteri jahat di tangan.
Tahap paling akhir adalah membilas sisa busa sabun. Bilas kedua tangan menggunakan air bersih yang mengalir. Pastikan tidak ada sisa sabun tertinggal di kulit. Tutup keran wastafel secara hati hati setelah selesai. Segera keringkan kedua tangan anda menggunakan tisu bersih. Anda juga bisa memakai handuk kering yang bersih. Jangan mengusap tangan basah pada bagian pakaian anda. Tangan anda sekarang sudah bersih dari ancaman kuman.', NULL),
(62, 2, 'Struktur Candi Borobudur ternyata mencerminkan ajaran agama', 'Struktur Candi Borobudur ternyata mencerminkan ajaran agama Buddha. Bangunan candi ini menggambarkan tingkatan alam semesta raya. Terdapat tiga tingkatan utama pada bangunan candi ini. Tingkatan paling bawah pada bangunan candi disebut Kamadhatu. Bagian Kamadhatu ini melambangkan kondisi alam kehidupan dunia. Manusia pada alam ini masih terikat hawa nafsu. Mereka masih sangat memikirkan urusan duniawi setiap hari. Bagian dasar candi ditutupi oleh batuan fondasi kuat.
Setelah menaiki tangga kita sampai pada tingkatan tengah. Tingkatan tengah bangunan suci candi ini dinamakan Rupadhatu. Bagian Rupadhatu melambangkan sebuah proses alam masa peralihan. Di alam ini manusia mulai meninggalkan urusan duniawi. Hawa nafsu jahat manusia perlahan mulai bisa dikendalikan. Namun jiwa manusia masih terikat pada wujud nyata. Dinding candi tingkatan ini dipenuhi pahatan relief indah.
Perjalanan berlanjut menuju tingkatan candi yang paling atas. Tingkatan suci paling tinggi ini sering disebut Arupadhatu. Arupadhatu melambangkan alam suci yang paling tinggi sekali. Di alam suci ini jiwa terbebas dari duniawi. Jiwa manusia tidak lagi terikat pada wujud rupa. Hal ini ditandai dengan hadirnya stupa berbentuk bundar. Dinding batu stupa bundar tidak lagi berukir relief. Kemegahan struktur candi ini mengandung nilai filosofi tinggi.', NULL),
(63, 2, 'STIMULUS 1 – Kebun Sekolah dan Suhu Lingkungan', 'Sejak awal semester, SMP Harapan Jaya mengubah halaman belakang sekolah yang sebelumnya dipenuhi paving menjadi kebun kecil. Siswa menanam cabai, tomat, bayam, dan beberapa tanaman obat. Setiap kelas mendapat jadwal merawat tanaman dua kali seminggu. Guru IPA mencatat bahwa bagian halaman yang ditanami terasa lebih sejuk pada siang hari dibandingkan area yang masih tertutup paving. Daun tanaman juga membantu menahan percikan air ketika hujan deras sehingga tanah tidak cepat terkikis. Pada bulan pertama, beberapa tanaman mati karena penyiraman tidak teratur. Setelah dibuat jadwal piket yang lebih jelas, kondisi tanaman membaik. Sekolah kemudian memasang papan informasi yang menjelaskan nama tanaman dan manfaatnya. Saat istirahat, sejumlah siswa terlihat duduk di sekitar kebun karena tempat itu dianggap lebih nyaman daripada koridor yang panas. Kepala sekolah berencana memperluas kebun pada semester berikutnya, tetapi ia meminta guru dan siswa mengevaluasi terlebih dahulu tanaman mana yang paling mudah dirawat dan paling sesuai dengan kondisi halaman. Pada kegiatan refleksi, siswa diminta mencatat perubahan yang mereka rasakan sejak kebun dibuat. Sebagian siswa menyebut halaman belakang kini lebih nyaman digunakan untuk membaca atau berdiskusi. Guru juga mengingatkan bahwa kebun tidak boleh mengganggu jalur berjalan dan harus tetap dirawat bersama. Karena itu, manfaat kebun dipandang berkaitan dengan pengelolaan, bukan sekadar jumlah tanaman.', NULL),
(64, 2, 'STIMULUS 2 – Gerakan Membawa Tumbler', 'Kantin SMP Nusantara mulai mengurangi penggunaan gelas plastik sekali pakai. Pada awalnya, pengelola kantin menyediakan potongan harga kecil bagi siswa yang membawa tumbler. Sekolah juga memasang dua titik pengisian air minum sehingga siswa tidak perlu membeli minuman kemasan setiap kali haus. Tiga bulan kemudian, petugas kebersihan mencatat jumlah gelas plastik yang dikumpulkan setelah jam istirahat turun hampir setengah dibandingkan sebelum program dimulai. Namun, sampah plastik belum hilang sepenuhnya karena beberapa siswa masih membeli minuman dalam kemasan ketika lupa membawa tumbler. Pengelola kantin tidak menghapus minuman kemasan secara langsung. Menurutnya, perubahan kebiasaan perlu dilakukan secara bertahap agar siswa memiliki waktu untuk menyesuaikan diri. Dalam rapat evaluasi, OSIS mengusulkan agar kampanye tidak hanya berupa poster, tetapi juga menggunakan pengumuman singkat dan contoh dari pengurus kelas. Guru pembina OSIS menilai usulan tersebut lebih mudah diterapkan karena siswa dapat melihat kebiasaan baru secara langsung. Sekolah berencana mengevaluasi kembali jumlah sampah setelah satu semester. OSIS mencatat bahwa siswa yang lupa membawa tumbler masih menjadi bagian yang perlu diperhatikan. Karena itu, pengurus mengusulkan agar tempat pengisian air mudah terlihat dan tersedia di lokasi yang dekat dengan kegiatan siswa. Pengelola kantin menyetujui evaluasi berkala agar kebijakan pengurangan sampah tetap realistis dan dapat dijalankan oleh warga sekolah. Evaluasi tersebut dilakukan agar perubahan kebiasaan dapat dipantau dari waktu ke waktu.', NULL),
(65, 2, 'STIMULUS 3 – Perpustakaan Digital Desa', 'Perpustakaan Desa Sukamaju menyediakan layanan peminjaman buku digital bagi pelajar. Warga dapat menggunakan ponsel untuk membaca buku melalui aplikasi yang dikelola perpustakaan. Pada bulan pertama, jumlah pengguna belum banyak karena sebagian siswa belum mengetahui cara mengakses koleksi. Pengelola kemudian mengadakan pelatihan singkat di balai desa dan membuat panduan bergambar. Setelah itu, jumlah peminjaman meningkat, terutama untuk buku pengetahuan umum dan cerita anak. Meskipun demikian, layanan tersebut masih menghadapi kendala. Sinyal internet di beberapa bagian desa tidak stabil, sedangkan tidak semua keluarga memiliki perangkat yang dapat digunakan bergantian. Untuk mengatasi masalah itu, perpustakaan membuka ruang baca dengan jaringan internet pada sore hari. Pengelola juga mengatur jadwal agar siswa yang tidak memiliki perangkat dapat menggunakan tablet milik perpustakaan. Kepala desa mengatakan bahwa keberhasilan program tidak cukup diukur dari jumlah buku yang tersedia. Menurutnya, akses dan kemampuan warga menggunakan layanan juga perlu diperhatikan. Pada akhir semester, pengelola akan membandingkan data peminjaman dan jumlah pengguna aktif untuk menentukan layanan yang perlu diperbaiki. Pengelola menyadari bahwa peningkatan peminjaman belum tentu berarti semua pengguna sudah mahir menggunakan layanan. Beberapa siswa masih meminta bantuan saat mengunduh buku atau mengatur aplikasi. Oleh sebab itu, pelatihan lanjutan dan pendampingan tetap disiapkan. Program tersebut diarahkan agar teknologi benar-benar memperluas kesempatan membaca, bukan hanya menambah jumlah koleksi digital.', NULL),
(66, 2, 'STIMULUS 4 – Kantin dan Sisa Makanan', 'Kantin SMP Cendekia mencatat banyak makanan tersisa setelah jam makan siang. Sebagian siswa membeli makanan lebih banyak daripada yang mampu mereka habiskan. Kondisi itu membuat petugas harus membuang nasi, sayur, dan lauk yang masih layak beberapa jam sebelumnya. Untuk mengetahui penyebabnya, OSIS melakukan pengamatan selama dua minggu. Mereka menemukan bahwa makanan paling sering tersisa pada hari ketika kantin menyediakan porsi besar dengan harga sedikit lebih murah. Beberapa siswa mengatakan mereka tertarik membeli karena harganya terjangkau, tetapi kemudian tidak sanggup menghabiskan seluruh porsi. Berdasarkan hasil pengamatan, kantin menawarkan dua ukuran porsi dan tetap mempertahankan pilihan makanan yang sama. Siswa juga diperbolehkan meminta porsi kecil tanpa dikenai biaya tambahan. Sebulan kemudian, jumlah sisa makanan berkurang. Pengelola kantin mengatakan bahwa perubahan tersebut bukan berarti siswa harus makan lebih sedikit, melainkan memilih porsi sesuai kebutuhan. Guru IPS menggunakan hasil pengamatan itu sebagai contoh bahwa kebiasaan konsumsi dapat memengaruhi jumlah sampah. Sekolah berencana membuat papan informasi yang mengajak siswa mempertimbangkan kebutuhan sebelum membeli makanan. Guru mengajak siswa membandingkan jumlah makanan yang dibeli dengan jumlah yang tersisa tanpa menyalahkan kelompok tertentu. Dari kegiatan itu, siswa belajar bahwa keputusan sederhana sebelum membeli dapat berpengaruh pada jumlah sampah. Pengelola juga tetap memperhatikan kenyamanan siswa sehingga pilihan porsi tidak dipandang sebagai pembatasan, melainkan cara mengurangi makanan yang terbuang.', NULL),
(67, 2, 'STIMULUS 5 – Lampu Jalan Tenaga Surya', 'Di sebuah desa pesisir, pemerintah daerah memasang lampu jalan bertenaga surya di jalur yang menghubungkan permukiman dengan dermaga. Sebelumnya, beberapa bagian jalan gelap setelah matahari terbenam sehingga warga harus menggunakan senter ketika berjalan. Lampu baru menyimpan energi dari panel surya pada siang hari dan menggunakannya untuk penerangan malam. Pada minggu pertama, warga menyambut pemasangan tersebut karena jalan menjadi lebih terang. Namun, setelah beberapa hari hujan berturut-turut, sebagian lampu menyala lebih redup daripada biasanya. Petugas menjelaskan bahwa kinerja lampu dipengaruhi oleh energi yang tersimpan dan kondisi panel menerima cahaya matahari. Setelah panel dibersihkan dan sistem diperiksa, penerangan kembali membaik. Pemerintah daerah kemudian memasang jadwal pemeriksaan berkala. Warga juga diminta melaporkan apabila panel tertutup kotoran atau lampu tidak menyala. Ketua RT menilai bahwa teknologi baru tetap membutuhkan perawatan agar manfaatnya dapat bertahan. Pemerintah daerah sedang mempertimbangkan pemasangan lampu serupa di jalan lain, tetapi akan melihat data penggunaan dan biaya perawatan terlebih dahulu. Selain pemeriksaan teknis, pemerintah daerah meminta warga ikut menjaga area sekitar lampu agar panel tidak mudah tertutup kotoran. Data gangguan dan waktu perbaikan akan dicatat sebagai bahan evaluasi. Dengan demikian, keputusan memperluas penggunaan lampu tidak hanya berdasarkan kesan bahwa jalan lebih terang, tetapi juga berdasarkan pengalaman penggunaan dan kemampuan pemeliharaan.', NULL),
(68, 2, 'STIMULUS 1 – Embung untuk Musim Kemarau', 'Kelompok tani di Desa Wanasari membuat embung kecil untuk menampung air hujan. Sebelum embung dibangun, petani sering mengandalkan sumur dangkal untuk menyiram tanaman pada awal musim kemarau. Ketika hujan berhenti lebih lama, permukaan air sumur turun sehingga sebagian lahan tidak dapat ditanami. Setelah embung selesai, air hujan yang biasanya mengalir begitu saja ke saluran desa dapat ditampung dan digunakan ketika persediaan air mulai berkurang. Petani tetap diminta mengatur penggunaan air karena kapasitas embung terbatas. Pada musim kemarau pertama, beberapa petani membuka saluran air terlalu sering sehingga persediaan turun lebih cepat. Kelompok tani kemudian membuat jadwal pengambilan air berdasarkan luas lahan dan jenis tanaman. Setelah aturan diterapkan, penurunan volume air menjadi lebih terkendali. Ketua kelompok tani menjelaskan bahwa embung bukan sumber air tanpa batas, melainkan cadangan yang harus dikelola bersama. Ia juga mengingatkan bahwa keberhasilan program bergantung pada kebiasaan petani dalam menggunakan air secara hemat. Pemerintah desa berencana memperbaiki saluran masuk embung agar lebih banyak air hujan dapat tertampung pada musim berikutnya. Aturan tersebut juga membuat petani dapat memperkirakan kebutuhan air sebelum mengambilnya. Jika persediaan dipakai tanpa perencanaan, petani yang mengambil air lebih banyak dapat mengurangi kesempatan petani lain memperoleh bagian yang cukup. Karena itu, pengelolaan embung tidak hanya berkaitan dengan jumlah air, tetapi juga dengan cara membagi sumber daya yang terbatas.', NULL),
(69, 2, 'STIMULUS 2 – Baterai dari Sampah Organik', 'Tim siswa sebuah SMP melakukan percobaan sederhana membuat sumber listrik dari bahan organik yang mudah ditemukan di rumah. Mereka menggunakan beberapa jenis buah dengan tingkat kematangan berbeda dan memasang elektroda pada setiap buah. Tegangan yang dihasilkan tidak sama. Buah yang lebih asam cenderung menghasilkan tegangan lebih besar pada percobaan mereka, tetapi hasil juga dipengaruhi oleh ukuran buah dan kondisi elektroda. Pada percobaan pertama, beberapa kelompok memperoleh hasil berbeda meskipun menggunakan jenis buah yang sama. Guru meminta mereka memeriksa kembali cara memasang elektroda dan memastikan alat ukur digunakan dengan benar. Setelah prosedur diseragamkan, perbedaan hasil menjadi lebih kecil. Guru menjelaskan bahwa percobaan tersebut bukan bertujuan menggantikan baterai rumah tangga, melainkan membantu siswa memahami bahwa reaksi kimia dapat menghasilkan energi listrik. Siswa kemudian membandingkan hasil setiap buah dan mencatat faktor yang mungkin memengaruhinya. Mereka menyadari bahwa kesimpulan dari percobaan perlu didukung oleh pengukuran yang konsisten. Pada akhir kegiatan, kelompok menyusun laporan yang memisahkan hasil pengamatan dari dugaan penyebab perbedaan. Guru menekankan bahwa hasil percobaan tidak boleh diperlakukan sebagai angka yang pasti berlaku untuk semua keadaan. Kondisi buah, elektroda, suhu, dan cara pengukuran dapat memengaruhi hasil. Dengan membandingkan beberapa percobaan dan mencatat prosedurnya, siswa dapat menjelaskan temuan secara lebih hati-hati. Kegiatan tersebut sekaligus melatih mereka membedakan bukti dari dugaan.', NULL),
(70, 2, 'STIMULUS 3 – Jalur Sepeda ke Sekolah', 'Beberapa siswa SMP Mutiara mulai bersepeda ke sekolah setelah pemerintah kota membuat jalur sepeda di ruas jalan dekat sekolah. Pada minggu pertama, jumlah pesepeda belum banyak karena sebagian orang tua masih khawatir dengan kondisi lalu lintas. Sekolah kemudian mengatur titik berkumpul dan meminta siswa menggunakan helm serta mengikuti rute yang telah ditentukan. Guru juga bekerja sama dengan warga sekitar untuk mengingatkan pengendara kendaraan bermotor agar tidak menggunakan jalur sepeda sebagai tempat berhenti. Setelah beberapa minggu, lebih banyak siswa terlihat menggunakan sepeda, terutama mereka yang tinggal tidak terlalu jauh dari sekolah. Namun, ketika hujan deras turun pada pagi hari, jumlah pesepeda kembali menurun. Sekolah tidak menganggap penurunan tersebut sebagai kegagalan program. Menurut guru pembina, pilihan transportasi dipengaruhi oleh keamanan, jarak, cuaca, dan kesiapan keluarga. Sekolah berencana memperbaiki tempat parkir sepeda dan menambah sosialisasi keselamatan. Orang tua juga diminta memberikan izin berdasarkan kondisi perjalanan anak masing-masing. Dengan demikian, program bersepeda tidak hanya dipandang sebagai kegiatan olahraga, tetapi sebagai pilihan transportasi yang memerlukan dukungan lingkungan. Sekolah juga menyadari bahwa tidak semua siswa memiliki kondisi perjalanan yang sama. Siswa yang tinggal sangat dekat mungkin lebih mudah bersepeda, sedangkan siswa yang tinggal jauh membutuhkan pilihan lain. Karena itu, keberhasilan program tidak hanya dilihat dari banyaknya pesepeda, tetapi dari sejauh mana lingkungan mendukung perjalanan yang aman dan realistis.', NULL),
(71, 2, 'STIMULUS 4 – Ikan Asing di Kolam Desa', 'Warga Desa Mekarsari menemukan ikan dengan bentuk yang tidak biasa di kolam yang selama ini digunakan untuk memelihara ikan lokal. Beberapa warga ingin segera memasukkan ikan tersebut ke kolam budidaya karena ukurannya cepat besar. Namun, penyuluh perikanan meminta mereka tidak terburu-buru. Ia menjelaskan bahwa ikan yang berasal dari luar lingkungan setempat dapat membawa risiko jika berkembang tanpa pengawasan. Untuk memastikan jenisnya, sampel ikan diperiksa dan dibandingkan dengan informasi dari dinas perikanan. Hasil pemeriksaan menunjukkan bahwa ikan tersebut memang bukan jenis yang biasa dibudidayakan warga. Setelah itu, warga sepakat memisahkan ikan tersebut dari kolam utama sambil menunggu petunjuk lebih lanjut. Penyuluh juga meminta warga tidak membuang ikan ke sungai atau danau karena tindakan tersebut dapat membuat ikan menyebar ke lingkungan lain. Sebagian warga awalnya menganggap langkah itu berlebihan karena ikan terlihat sehat. Namun, penyuluh menekankan bahwa kondisi satu atau dua ikan tidak cukup untuk menentukan dampak terhadap ekosistem. Desa kemudian membuat pengumuman agar warga melaporkan temuan serupa. Keputusan akhir mengenai pemanfaatan ikan akan dibuat setelah identifikasi dan penilaian lebih lanjut. Keputusan untuk memisahkan ikan menunjukkan bahwa tindakan pencegahan dapat dilakukan sebelum dampak benar-benar terlihat. Warga tidak diminta langsung memusnahkan ikan, tetapi juga tidak diperbolehkan menyebarkannya. Pendekatan tersebut memberi waktu bagi pihak yang berwenang untuk mengumpulkan informasi dan menentukan langkah berdasarkan identifikasi yang lebih pasti.', NULL),
(72, 2, 'STIMULUS 5 – Mikroplastik pada Air Hujan', 'Sebuah kelompok peneliti sekolah melakukan pengamatan sederhana terhadap air hujan yang ditampung di tiga lokasi berbeda. Mereka menemukan partikel kecil pada sebagian sampel setelah air diperiksa menggunakan alat pembesar. Hasil tersebut belum langsung dianggap sebagai bukti bahwa semua partikel berasal dari plastik. Peneliti siswa mencatat lokasi, waktu pengambilan, arah angin, dan kondisi wadah. Mereka menyadari bahwa wadah yang terbuka dapat menerima debu atau kotoran dari lingkungan sekitar. Karena itu, sampel berikutnya diambil dengan wadah yang lebih terlindungi dan prosedur yang sama di setiap lokasi. Hasil pengamatan kedua menunjukkan jumlah partikel yang berbeda dari pengamatan pertama. Guru pembimbing meminta siswa tidak menarik kesimpulan terlalu jauh dari data tersebut. Menurutnya, penelitian sederhana tetap harus memperhatikan kemungkinan sumber kesalahan. Siswa kemudian membandingkan sampel dan mencatat bagian yang belum dapat dipastikan. Mereka juga mencari informasi tentang metode identifikasi mikroplastik yang digunakan dalam penelitian ilmiah. Kegiatan tersebut membuat siswa memahami bahwa menemukan partikel kecil bukan berarti mereka langsung mengetahui asal, jenis, atau dampaknya. Kesimpulan perlu disusun berdasarkan bukti yang cukup dan metode yang sesuai. Guru kemudian meminta siswa menyusun tabel yang membedakan fakta, dugaan, dan pertanyaan yang belum terjawab. Misalnya, keberadaan partikel merupakan hasil pengamatan, sedangkan dugaan tentang asal partikel masih memerlukan pemeriksaan. Cara tersebut membantu siswa memahami bahwa penelitian tidak hanya menghasilkan jawaban, tetapi juga dapat menunjukkan batas pengetahuan yang tersedia.', NULL),
(73, 2, 'STIMULUS 1 – Atap Hijau di Sekolah', 'SMP Bina Karya sedang menguji penggunaan sebagian atap gedung sebagai taman atap. Pada tahap awal, sekolah menanam beberapa jenis tanaman yang tahan panas dan membutuhkan sedikit air. Tim pengelola mengukur suhu permukaan atap dan mencatat jumlah air yang digunakan setiap minggu. Setelah dua bulan, area yang ditanami menunjukkan suhu permukaan yang lebih rendah dibandingkan bagian atap yang tidak ditanami. Namun, tanaman pada sisi yang terkena angin kuat tumbuh lebih lambat. Pengelola kemudian memasang pelindung sederhana dan memilih tanaman yang lebih sesuai. Sekolah belum berencana mengubah seluruh atap karena biaya pemasangan dan perawatan masih dihitung. Jika hasil pengamatan berikutnya menunjukkan bahwa tanaman dapat bertahan dengan penggunaan air yang wajar, sekolah akan mempertimbangkan memperluas area taman atap. Guru IPA juga mengusulkan agar data suhu dikumpulkan sepanjang musim berbeda karena kondisi cuaca dapat memengaruhi hasil. Siswa dilibatkan dalam pencatatan dan perawatan agar mereka memahami proses pengamatan. Keputusan perluasan akan dibuat setelah sekolah memiliki data yang cukup tentang kondisi tanaman, kebutuhan air, dan biaya perawatan. Tim sekolah juga harus memastikan konstruksi atap mampu menahan beban tambahan dan sistem drainase tidak terganggu. Hal tersebut menjadi bagian dari pemeriksaan sebelum perluasan. Dengan begitu, keputusan tidak hanya didasarkan pada penurunan suhu, tetapi juga pada keamanan bangunan dan kemampuan sekolah merawat taman dalam jangka lebih panjang.', NULL),
(74, 2, 'STIMULUS 2 – Bus Sekolah dan Kemacetan', 'Sebuah sekolah di pusat kota mencoba layanan bus antar-jemput bagi siswa yang tinggal di beberapa kawasan sekitar. Pada bulan pertama, bus hanya digunakan oleh sebagian siswa karena jadwal belum sesuai dengan waktu keberangkatan mereka. Sekolah kemudian mengumpulkan masukan dari orang tua dan siswa. Rute diubah agar beberapa titik penjemputan lebih dekat dengan permukiman. Setelah perubahan, jumlah penumpang meningkat. Kepala sekolah juga mencatat bahwa kendaraan pribadi yang masuk ke halaman sekolah pada pagi hari berkurang. Namun, bus membutuhkan biaya operasional dan harus berangkat tepat waktu agar tidak mengganggu jadwal pelajaran. Ketika satu bus mengalami kerusakan, beberapa siswa terlambat karena kendaraan pengganti belum tersedia. Sekolah kini mempertimbangkan penambahan satu kendaraan cadangan, tetapi keputusan tersebut bergantung pada jumlah pengguna tetap dan biaya yang diperlukan. Pengelola juga berencana menggunakan data ketepatan waktu untuk mengevaluasi rute. Jika layanan terbukti digunakan secara konsisten dan mampu mengurangi kendaraan yang masuk ke sekolah, sekolah akan mempertimbangkan mempertahankan atau memperluas layanan tersebut. Orang tua masih dapat memilih menggunakan kendaraan lain ketika kondisi perjalanan tidak aman. Sekolah juga tidak ingin menambah kendaraan jika bus yang ada belum dimanfaatkan secara optimal. Karena itu, data jumlah penumpang, ketepatan waktu, dan biaya akan menjadi dasar untuk menentukan apakah perubahan layanan benar-benar diperlukan. Sekolah juga akan meninjau kembali jadwal perjalanan berdasarkan data penggunaan.', NULL),
(75, 2, 'STIMULUS 3 – Program Membaca Lima Belas Menit', 'SMP Pelita Bangsa menjalankan program membaca selama lima belas menit sebelum pelajaran pertama. Pada awal pelaksanaan, sebagian siswa membaca dengan antusias, tetapi sebagian lainnya hanya membuka buku tanpa benar-benar membaca. Guru kemudian meminta siswa menuliskan satu kalimat tentang bagian yang mereka baca setiap beberapa hari. Sekolah tidak mewajibkan jenis buku tertentu karena siswa memiliki minat yang berbeda. Setelah beberapa minggu, guru melihat lebih banyak siswa membawa buku sendiri dan beberapa siswa mulai saling bertukar rekomendasi bacaan. Namun, guru juga menemukan bahwa sebagian siswa memilih bacaan yang sangat tipis agar cepat selesai ketika diminta menuliskan ringkasan. Untuk mengatasi hal itu, sekolah berencana menilai kebiasaan membaca melalui catatan sederhana, bukan jumlah halaman atau jumlah buku yang selesai. Perpustakaan juga akan membuat rak rekomendasi berdasarkan tema agar siswa lebih mudah memilih bacaan. Kepala sekolah mengatakan bahwa tujuan utama program bukan mengejar banyaknya buku, tetapi membangun kebiasaan membaca yang berlangsung secara konsisten. Pada akhir semester, sekolah akan membandingkan catatan partisipasi dan hasil survei minat baca siswa untuk melihat perubahan yang terjadi. Guru berharap catatan sederhana tidak berubah menjadi tugas yang membuat siswa kehilangan minat. Karena itu, bentuk catatan akan dibuat singkat dan berkala. Jika cara tersebut membantu siswa mempertahankan kebiasaan membaca tanpa menambah beban yang berlebihan, sekolah dapat menggunakan pola yang sama pada semester berikutnya.', NULL),
(76, 2, 'STIMULUS 4 – Kebun Hidroponik dan Air', 'OSIS SMP Tunas Bangsa membuat kebun hidroponik di halaman sempit belakang laboratorium. Sistem tersebut memungkinkan tanaman ditanam tanpa tanah dalam jumlah besar. Pada percobaan awal, selada tumbuh cukup baik, tetapi penggunaan air lebih banyak daripada yang diperkirakan karena sebagian air harus diganti secara berkala. Tim siswa kemudian memeriksa kebocoran pipa dan menemukan sambungan yang kurang rapat. Setelah diperbaiki, kehilangan air berkurang. Mereka juga mulai mencatat jumlah air yang ditambahkan setiap hari. Guru pembimbing meminta siswa membandingkan penggunaan air hidroponik dengan kebutuhan penyiraman tanaman di kebun tanah, tetapi perbandingan harus dilakukan pada luas tanam yang setara. Sekolah belum memutuskan apakah sistem hidroponik akan diperluas. Selain kebutuhan air, siswa perlu menghitung biaya listrik untuk pompa dan biaya perawatan. Jika hasil perhitungan menunjukkan bahwa sistem dapat dikelola dengan biaya dan penggunaan air yang wajar, sekolah akan menambah beberapa instalasi. Sebaliknya, jika kebutuhan perawatan terlalu tinggi, sistem akan tetap digunakan sebagai proyek pembelajaran dalam skala kecil. Tim siswa juga akan memperhatikan apakah tanaman tumbuh sehat dalam jangka waktu lebih panjang. Hasil yang baik dalam beberapa minggu belum tentu menunjukkan sistem mudah dirawat sepanjang tahun. Oleh karena itu, keputusan perluasan kemungkinan baru dibuat setelah data air, listrik, perawatan, dan kondisi tanaman terkumpul secara cukup. Catatan tersebut akan digunakan untuk melihat perubahan kebutuhan dari waktu ke waktu.', NULL),
(77, 2, 'STIMULUS 5 – Papan Informasi Banjir', 'Di sebuah kelurahan yang sering mengalami genangan setelah hujan deras, warga memasang papan informasi tinggi muka air di dekat saluran utama. Papan tersebut diberi beberapa tanda ketinggian agar warga dapat melihat perubahan air dari jarak tertentu. Pada awalnya, warga hanya menggunakan papan untuk mengetahui apakah air sedang naik atau turun. Setelah terjadi hujan deras pada malam hari, ketua RT meminta warga mencatat ketinggian air pada waktu yang sama setiap tiga puluh menit. Catatan tersebut kemudian dibandingkan dengan waktu mulai hujan dan kondisi saluran. Warga menemukan bahwa kenaikan air berlangsung lebih cepat ketika saluran tersumbat oleh sampah. Setelah saluran dibersihkan, kenaikan air pada hujan berikutnya berlangsung lebih lambat, meskipun curah hujan tidak persis sama. Kelurahan kemudian berencana membuat catatan rutin dan menempatkan nomor kontak petugas pada papan. Namun, ketua RT mengingatkan bahwa papan bukan alat untuk memastikan banjir akan terjadi. Papan hanya membantu warga memantau kondisi sehingga mereka dapat lebih cepat mengetahui perubahan dan mengambil tindakan sesuai situasi. Jika pencatatan rutin menghasilkan pola yang jelas, kelurahan akan mempertimbangkan memasang papan serupa di titik lain. Warga juga diingatkan bahwa informasi dari papan harus dibaca bersama kondisi lapangan. Misalnya, perubahan ketinggian air yang cepat perlu segera dilaporkan, tetapi keputusan keselamatan tetap mengikuti arahan petugas. Dengan pemantauan yang konsisten, data dari papan dapat menjadi salah satu sumber informasi untuk memahami pola genangan di lingkungan tersebut.', NULL),
(78, 2, 'Bacalah wacana berikut!', 'Sisa makanan rumah tangga seringkali berakhir di tempat pembuangan akhir dan menghasilkan gas metana yang berbahaya bagi lingkungan. Pengolahan sampah organik menjadi pupuk kompos mandiri di rumah dapat mengurangi volume sampah secara signifikan sekaligus menyuburkan tanaman.', NULL),
(79, 2, 'Bacalah wacana berikut!', 'Penggunaan transportasi publik, seperti bus kota dan kereta komuter, terbukti dapat memangkas waktu tempuh akibat kemacetan serta menurunkan tingkat polusi udara di pusat perkotaan.', NULL),
(80, 2, 'Bacalah wacana berikut!', 'Membaca label nutrisi pada kemasan makanan sangat penting untuk mengontrol asupan gula, garam, dan lemak harian. Hal ini bertujuan untuk mencegah risiko penyakit tidak menular seperti diabetes dan hipertensi sejak dini.', NULL),
(81, 2, 'Bacalah wacana berikut!', 'Erosi pantai akibat abrasi air laut dapat dicegah dengan menanam pohon bakau di sepanjang garis pantai. Akar bakau yang kokoh mampu menahan gelombang laut dan menjaga ekosistem pesisir tetap seimbang.', NULL),
(82, 2, 'Bacalah wacana berikut!', 'Transfers uang elektronik dan transaksi nirkontak kini makin diminati karena dinilai praktis, cepat, dan mengurangi risiko kehilangan uang tunai saat beraktivitas di luar rumah.', NULL),
(83, 2, 'Bacalah wacana berikut!', 'Paparan sinar biru dari layar gawai menjelang tidur dapat mengganggu produksi hormon melatonin, sehingga menyebabkan kualitas tidur menurun dan tubuh terasa lelah saat bangun pagi.', NULL),
(84, 2, 'Bacalah wacana berikut!', 'Penggunaan air secara bijak, seperti mematikan keran saat menggosok gigi dan memanfaatkan air bekas cucian beras untuk menyiram tanaman, dapat menjaga ketersediaan air bersih lokal.', NULL),
(85, 2, 'Bacalah wacana berikut!', 'Konsumsi sayuran lokal organik tidak hanya menjamin kesehatan tubuh dari paparan pestisida, tetapi juga membantu perekonomian petani di daerah sekitar.', NULL),
(86, 2, 'Bacalah wacana berikut!', 'Aktivitas fisik teratur selama 30 menit sehari dapat meningkatkan daya tahan tubuh, memperkuat otot, dan mengurangi risiko stres pada remaja sekolah.', NULL),
(87, 2, 'Bacalah wacana berikut!', 'Pemilahan sampah berdasarkan jenisnya (organik, anorganik, dan B3) memudahkan proses daur ulang di bank sampah serta meminimalkan penumpukan limbah berbahaya.', NULL),
(88, 2, 'Bacalah wacana berikut!', 'Membawa tas belanja ramah lingkungan sendiri saat berbelanja dapat menurunkan penggunaan kantong plastik sekali pakai yang sulit terurai di alam.', NULL),
(89, 2, 'Bacalah wacana berikut!', 'Literasi digital memberikan kemampuan untuk menyaring informasi berita sebelum dibagikan, sehingga masyarakat dapat terhindar dari bahaya hoaks dan provokasi online.', NULL),
(90, 2, 'Bacalah wacana berikut!', 'Penghijauan di pekarangan rumah menggunakan tanaman obat keluarga (TOGA) seperti jahe, kunyit, dan temulawak membantu penyediaan pertolongan pertama alami untuk kesehatan keluarga.', NULL),
(91, 2, 'Bacalah wacana berikut!', 'Menjaga kebersihan saluran air dan got secara berkala dapat mencegah munculnya genangan air yang menjadi tempat berkembang biak nyamuk Aedes aegypti pembawa demam berdarah.', NULL),
(92, 2, 'Bacalah wacana berikut!', 'Penggunaan sarana penerangan LED hemat energi mampu mengurangi konsumsi listrik rumah tangga hingga 60% dibandingkan lampu pijar konvensional.', NULL),
(93, 2, 'Bacalah wacana berikut!', 'Mencuci tangan menggunakan sabun dan air mengalir selama minimal 20 detik merupakan langkah paling efektif untuk membasmi kuman dan mencegah penularan penyakit saluran pencernaan.', NULL),
(94, 2, 'Bacalah wacana berikut!', 'Eksploitasi kertas yang berlebihan berdampak langsung pada penebangan pohon di hutan. Memanipulasi dokumen menjadi bentuk digital (paperless) membantu menjaga kelestarian hutan alam.', NULL),
(95, 2, 'Bacalah wacana berikut!', 'Pencemaran suara dari knalpot tidak standar (brong) dapat meningkatkan level stres dan mengganggu konsentrasi belajar serta waktu istirahat warga di lingkungan permukiman.', NULL),
(96, 2, 'Bacalah wacana berikut!', 'Diversifikasi pangan lokal dengan memanfaatkan singkong, ubi jalar, dan jagung dapat mengurangi ketergantungan masyarakat terhadap beras serta memperkuat ketahanan pangan nasional.', NULL),
(97, 2, 'Bacalah wacana berikut!', 'Olahraga rutin bersama anggota keluarga dapat mempererat ikatan emosional sekaligus menjaga kebugaran fisik bersama di pertambahan usia.', NULL),
(98, 2, 'Bacalah dua teks berikut!', 'Teks 1: Teh hijau kaya akan antioksidan katekin yang berfungsi melembabkan kulit dan menangkal radikal bebas dari sinar matahari.

Teks 2: Konsumsi teh hijau secara teratur membantu menjaga kesehatan kulit karena kandungan antioksidannya dapat melindungi jaringan sel dari kerusakan akibat radiasi UV.', NULL),
(99, 2, 'Bacalah dua teks berikut!', 'Teks A: Perpustakaan digital sekolah menyediakan ribuan judul buku yang dapat diakses kapan saja melalui jaringan internet.

Teks B: Pengunjung perpustakaan fisik sekolah mengalami penurunan karena siswa lebih memilih mengunduh e-book dari platform perpustakaan digital.', NULL),
(100, 2, 'Bacalah teks berikut!', 'Pemerintah daerah meresmikan taman kota baru yang dilengkapi dengan jalur joging, area bermain anak, dan fasilitas Wi-Fi gratis. Namun, jumlah tempat sampah di kawasan tersebut masih sangat terbatas sehingga beberapa sudut taman mulai dipenuhi sampah.', NULL),
(101, 2, 'Bacalah paragraf berikut!', 'Bencana banjir yang melanda kawasan permukiman tersebut disebabkan oleh tingginya curah hujan. Selain faktor alam, penyumbatan saluran air oleh sampah plastik turut memperparah luapan air ke rumah-rumah warga.', NULL),
(102, 2, 'Bacalah dua teks berikut!', 'Teks 1: Tanaman lidah buaya memiliki gel alami yang efektif mendinginkan kulit terbakar matahari dan mempercepat penyembuhan luka gores ringan.

Teks 2: Lidah buaya umum digunakan dalam produk kecantikan karena kandungan nutrisinya dapat menjaga kelembapan rambut dan mengatasi ketombe.', NULL),
(103, 2, 'Bacalah cuplikan teks berikut!', 'Sistem transportasi Moda Raya Terpadu (MRT) mengoperasikan rangkaian kereta bertenaga listrik. Sarana ini mampu mengangkut ribuan penumpang per hari tanpa menghasilkan emisi gas buang langsung di jalan raya.', NULL),
(104, 2, 'Bacalah dua tabel data informasi berikut!', 'Teks A: Produksi sampah plastik di Kota X mencapai 500 ton per hari, dengan tingkat daur ulang hanya sebesar 10%.

Teks B: Kota X berhasil mendaur ulang 50 ton sampah plastik setiap harinya dari total seluruh sampah plastik yang dihasilkan masyarakat.', NULL),
(105, 2, 'Bacalah wacana berikut!', 'Museum Nasional menyimpan beragam benda cagar budaya bertema sejarah. Koleksi tersebut dirawat dengan teknik khusus agar keaslian bahannya tidak rusak oleh kelembapan udara.', NULL),
(106, 2, 'Bacalah wacana berikut!', 'Pembangkit listrik tenaga surya (PLTS) memanfaatkan panel fotovoltaik untuk mengubah sinar matahari menjadi energi listrik. Teknologi ini sangat ramah lingkungan karena tidak menghasilkan emisi karbon.', NULL),
(107, 2, 'Bacalah dua kalimat berikut!', '(1) Hutan mangrove berfungsi menahan gelombang pasang air laut.

(2) Akan tetapi, keberadaan hutan mangrove kini terancam oleh alih fungsi lahan menjadi kawasan tambak.', NULL),
(108, 2, 'Bacalah dua Teks Informasi berikut!', 'Teks 1: Kampanye penggunaan sepeda ke sekolah berhasil menurunkan tingkat emisi karbon di sekitar area sekolah sebesar 15% dalam tiga bulan.

Teks 2: Program bersepeda bersama ke sekolah yang digelar setiap Jumat memicu siswa untuk lebih aktif berolahraga sekaligus menjaga kebersihan udara sekolah.', NULL),
(109, 2, 'Bacalah wacana singkat berikut!', 'Diversifikasi tanaman pangan dapat dilakukan dengan metode tumpang sari. Metode ini memanfaatkan satu areal lahan untuk menanam dua atau lebih jenis tanaman yang berbeda secara bersamaan.', NULL),
(110, 2, 'Bacalah teks berikut!', 'Penggunaan pupuk organik secara kontinyu mampu mengembalikan kesuburan tanah yang rusak akibat pemakaian pupuk kimia jangka panjang. Tanah menjadi lebih gembur dan mikroorganisme baik dapat berkembang kembali.', NULL),
(111, 2, 'Bacalah dua kutipan berita berikut!', 'Berita A: Gempa magnitudo 5,6 mengguncang kota Y pada pukul 08.00 WIB. Tidak ada potensi tsunami akibat gempa dangkal ini.

Berita B: Gempa bumi tektonik mengguncang wilayah kota Y pagi ini. BMKG mengonfirmasi bahwa masyarakat tidak perlu panik terhadap ancaman gelombang tsunami.', NULL),
(112, 2, 'Bacalah wacana berikut!', 'Gerakan literasi sekolah mewajibkan siswa membaca buku nonpelajaran selama 15 menit sebelum kegiatan belajar dimulakan. Hal ini bertujuan membentuk budaya membaca dan memperluas wawasan siswa.', NULL),
(113, 2, 'Bacalah teks berikut!', 'Penggunaan plastik sekali pakai pada pembungkus makanan berkontribusi besar terhadap tumpukan limbah laut. Sebaliknya, wadah berbahan kaca atau baja tahan karat dapat digunakan berulang kali sehingga lebih ramah lingkungan.', NULL),
(114, 2, 'Bacalah dua teks berikut!', 'Teks 1: Vaksinasi memperkuat sistem imun tubuh dengan membentuk antibodi untuk melawan infeksi virus berbahaya.

Teks 2: Dengan menerima vaksinasi, risiko mengalami gejala berat akibat paparan virus dapat ditekan secara signifikan.', NULL),
(115, 2, 'Bacalah teks berikut!', 'Restorasi lahan gambut dilakukan melalui pembasahan kembali (rewetting), penyekatan parit, dan penanaman vegetasi asli. Langkah ini penting untuk mencegah kebakaran hutan saat musim kemarau panjang.', NULL),
(116, 2, 'Bacalah wacana berikut!', 'Eksplorasi luar angkasa membutuhkan teknologi roket berkecakapan tinggi untuk menembus atmosfer bumi. Bahan bakar cair sering digunakan karena menghasilkan dorongan yang stabil dan kuat.', NULL),
(117, 2, 'Bacalah dua teks berikut!', 'Teks A: Penggunaan kantong belanja kain menurunkan volume sampah plastik rumah tangga hingga 40% di Desa Z.

Teks B: Warga Desa Z kini terbiasa membawa kantong kain sendiri, sehingga lingkungan desa tampak lebih bersih dari ceceran plastik.', NULL),
(118, 2, 'Bacalah teks informasi berikut!', 'Setiap tahun, ratusan ton sampah plastik beracun mencemari ekosistem lautan. Penyu dan penyu hijau sering kali mengira kantong plastik mengapung sebagai ubur-ubur, lalu memakannya hingga saluran pencernaan mereka tersumbat parah dan berujung pada kematian yang menyiksa.', NULL),
(119, 2, 'Bacalah teks informasi berikut!', 'Tim relawan muda berhasil mendirikan perpustakaan keliling dengan mengayuh sepeda tua menembus jalanan terjal di pelosok desa. Berkat aksi tulus ini, anak-anak di daerah terisolasi kini dapat menikmati ratusan buku bacaan secara gratis setiap minggunya.', NULL),
(120, 2, 'Bacalah teks informasi berikut!', 'Bencana banjir bandang yang menerjang Pemukiman X menghanyutkan puluhan rumah warga dalam sekejap. Ratusan kepala keluarga kini terpaksa mengungsi di tenda-tenda darurat dengan keterbatasan bahan makanan dan air bersih di tengah cuaca dingin.', NULL),
(121, 2, 'Bacalah teks informasi berikut!', 'Seorang remaja disabilitas berusia 15 tahun berhasil menciptakan alat pemurni air sederhana berbahan barang bekas untuk membantunya mendapatkan air bersih di kawasan tempat tinggalnya yang kusam.', NULL),
(122, 2, 'Bacalah teks informasi berikut!', 'Maraknya aksi cyberbullying atau perundungan siber di media sosial telah menyebabkan banyak remaja mengalami depresi berat, kehilangan rasa percaya diri, hingga menarik diri dari lingkungan sosialnya.', NULL),
(123, 2, 'Bacalah teks informasi berikut!', 'Praktek pembalakan liar yang tak terkendali mengancam habitat asli orang utan di Hutan Kalimantan. Jika terus dibiarkan, satwa langka kebanggaan Indonesia ini diperkirakan akan punah dalam kurun waktu beberapa dekade mendatang.', NULL),
(124, 2, 'Bacalah teks informasi berikut!', 'Berkat gotong royong warga desa selama tiga bulan, saluran irigasi yang sebelumnya tersumbat kini dapat mengalirkan air bersih ke ribuan hektar sawah. Musim panen kali ini disambut dengan tawa dan rasa syukur oleh seluruh petani.', NULL),
(125, 2, 'Bacalah teks informasi berikut!', 'Penggunaan bahasa vulgar dan caci maki dalam komentar media sosial kini kian marak terjadi pada ruang publik digital. Hal ini dinilai merusak etika kesantunan berbahasa dan menurunkan nilai kesopanan generasi muda.', NULL),
(126, 2, 'Bacalah teks informasi berikut!', 'Data menunjukkan bahwa penderita gangguan penglihatan pada anak usia sekolah meningkat 30% akibat paparan layar gawai (gadget) tanpa jeda istirahat dan jarak pandang yang tidak memadai.', NULL),
(127, 2, 'Bacalah teks informasi berikut!', 'Program "Satu Hari Tanpa Sampah Plastik" di pasar tradisional berhasil menghemat penggunaan lebih dari 10.000 kantong plastik dalam sehari. Keberhasilan ini terwujud berkat kesadaran tinggi dari para pedagang dan pembeli.', NULL),
(128, 2, 'Bacalah teks informasi berikut!', 'Krisis air bersih melanda daerah X selama musim kemarau panjang. Warga setempat, termasuk lansia dan anak-anak, harus berjalan kaki sejauh 5 kilometer setiap pagi demi mendapatkan seember air bersih.', NULL),
(129, 2, 'Bacalah teks informasi berikut!', 'Sejumlah inovator muda menciptakan alat pendeteksi gempa murah berbasis sensor sederhana. Inovasi ini ditujukan bagi warga kurang mampu di daerah rawan bencana agar mendapat peringatan dini secara cepat.', NULL),
(130, 2, 'Bacalah teks informasi berikut!', 'Penyebaran informasi bohong (hoaks) terkait isu kesehatan membuat banyak masyarakat menolak melakukan vaksinasi, yang pada akhirnya memicu kembali lonjakan kasus penyakit menular di beberapa daerah.', NULL),
(131, 2, 'Bacalah teks informasi berikut!', 'Aksi penanaman sejuta pohon mangrove di wilayah pesisir pantai tidak hanya mencegah abrasi, tetapi juga berhasil mengembalikan habitat burung-burung langka yang sempat menghilang selama bertahun-tahun.', NULL),
(132, 2, 'Bacalah teks informasi berikut!', 'Banyak atlet Indonesia berusia muda berhasil meraih medali emas di ajang kejuaraan internasional meski berlatih dengan fasilitas olahraga yang sangat terbatas di daerah asal mereka.', NULL),
(133, 2, 'Bacalah teks informasi berikut!', 'Penumpukan sampah makanan (food waste) di tempat pembuangan akhir tidak hanya membuang nutrisi berharga, tetapi juga menghasilkan gas rumah kaca yang memicu pemanasan global saat masih banyak masyarakat kurang mampu kekurangan gizi.', NULL),
(134, 2, 'Bacalah teks informasi berikut!', 'Gerakan "Dapur Komunitas" yang didirikan sukarelawan berhasil menyediakan ribuan porsi makanan gizi seimbang setiap hari secara gratis bagi warga miskin kota yang terdampak pemutusan hubungan kerja.', NULL),
(135, 2, 'Bacalah teks informasi berikut!', 'Penggunaan istilah asing berlebihan dalam artikel berita tanpa disertai padanan bahasa Indonesia yang tepat dapat menyulitkan masyarakat awam dalam memahami isi pesan penting berita tersebut.', NULL),
(136, 2, 'Bacalah teks informasi berikut!', 'Komunitas pecinta alam lokal berhasil membersihkan 5 ton sampah plastik dari dasar danau dalam waktu dua hari melalui aksi penyelaman sukarela tanpa dibayar sedikit pun.', NULL),
(137, 2, 'Bacalah teks informasi berikut!', 'Aksi pembukaan lahan baru dengan cara membakar hutan telah menyebabkan asap pekat menyelimuti pemukiman. Ribuan anak-anak mengidap penyakit Infeksi Saluran Pernapasan Akut (ISPA) dan sekolah terpaksa diliburkan.', NULL),
(138, 2, 'Kebun Mini di Halaman Rumah', 'Lahan sempit bukan halangan untuk berkebun. Banyak keluarga menanam sayur di pot bekas. Pot itu diletakkan di teras atau pagar. Cara ini cocok untuk halaman kecil dan hemat biaya. Pekarangan sempit pun dapat menjadi hijau. Tanaman hijau juga membuat rumah terasa sejuk.

Langkah pertama adalah menyiapkan media tanam. Media tanam adalah bahan tempat akar tumbuh. Biasanya berupa campuran tanah dan pupuk kandang. Campuran itu harus gembur agar akar mudah berkembang. Pot perlu memiliki lubang di bagian bawah. Lubang itu mengalirkan kelebihan air.

Setelah itu, taburkan benih di atas media tanam. Benih sawi mulai bertunas setelah tiga hari. Siram tanaman setiap pagi dan sore. Tanah harus tetap lembap, tetapi tidak becek. Air sisa cucian beras dapat dipakai menyiram. Jangan menyiram terlalu banyak karena akar bisa membusuk. Letakkan pot di tempat yang terkena sinar matahari.

Sawi biasanya siap dipanen setelah empat minggu. Pemanenan sebaiknya dilakukan pada pagi hari. Petik daun yang sudah lebar terlebih dahulu. Daun yang muda dibiarkan tumbuh lagi. Dengan begitu, panen dapat dilakukan berulang kali.

Selain hemat, berkebun mini menyehatkan keluarga. Sayuran segar bebas dari bahan kimia berlebihan. Hasil panen bisa dimasak untuk makan bersama. Kegiatan ini juga mengisi waktu luang dengan bermanfaat. Anak-anak belajar mencintai tanaman sejak dini. Keluarga pun makin akrab saat berkebun bersama.', NULL),
(139, 2, 'Sepeda Tua Raka', 'Pagi itu Raka mengayuh sepeda tuanya. Rantainya berbunyi keras di sepanjang jalan. Jalanan desa masih lembap oleh embun. Embun masih menempel di daun pinggir jalan. Teman-temannya melaju dengan sepeda baru. Raka menunduk dan mempercepat kayuhannya. Wajahnya terasa panas menahan malu.

Ia teringat kejadian dua tahun lalu. Waktu itu Bapak membawa pulang sepeda ini. Uang Bapak hanya cukup untuk sepeda bekas. Catnya sudah kusam dan berkarat. "Sepeda ini tua, tetapi kuat," kata Bapak. Setiap sore Bapak membersihkan dan meminyaki rantainya. Raka hanya diam mengamati dari teras.

Di tengah jalan, hujan turun dengan deras. Air hujan mengalir dari rambut Raka. Sepeda baru Dodi tiba-tiba mogok. Ban depannya bocor terkena paku. Dodi berdiri kebingungan di pinggir jalan. Ia tampak cemas karena takut terlambat. Raka berhenti dan menatap sepedanya sendiri.

"Naiklah, Dod! Kita berboncengan saja," ajak Raka. Dodi ragu, lalu duduk di boncengan. Sepeda tua itu tetap melaju menembus hujan. Air hujan membasahi seragam mereka berdua. Rantainya masih berbunyi keras seperti tadi. Namun, Raka tidak lagi merasa malu. Ia justru tersenyum mengingat pesan Bapak.

Sesampainya di sekolah, Dodi mengucapkan terima kasih. Katanya, "Sepedamu hebat sekali, Ka!" Raka hanya tertawa kecil sambil mengangguk. Bel sekolah berbunyi tepat saat mereka tiba. Dalam hati, ia berjanji merawat sepeda itu. Sepeda tua itu kini terasa berharga.', NULL),
(140, 2, 'Lebah Kelulut, Lebah Tanpa Sengat', 'Lebah kelulut adalah lebah kecil tanpa sengat. Ukuran tubuhnya hanya sekitar lima milimeter. Karena kecil, lebah ini mudah masuk celah sempit. Lebah ini banyak dipelihara di daerah tropis. Lebah ini hidup dalam koloni. Koloni adalah kelompok lebah yang tinggal bersama. Satu koloni dipimpin oleh seekor ratu.

Sarang lebah kelulut biasanya dibuat di lubang kayu. Peternak memindahkannya ke kotak kayu bernama stup. Stup diletakkan di tempat yang teduh. Kotak itu melindungi lebah dari hujan. Peternak dapat memeriksa kondisi sarang dengan aman.

Lebah kelulut menghasilkan madu dan propolis. Madunya berasa asam segar dan sedikit manis. Satu koloni hanya menghasilkan sedikit madu. Karena itu, harga madunya cukup mahal. Propolis adalah getah tanaman yang dikumpulkan lebah. Lebah memakainya untuk menutup celah sarang. Manusia memanfaatkan propolis sebagai bahan obat tradisional.

Lebah ini juga membantu penyerbukan bunga. Penyerbukan adalah perpindahan serbuk sari ke putik. Proses itu membuat bunga dapat menjadi buah. Tanpa penyerbukan, banyak bunga akan gugur. Karena itu, kebun buah membutuhkan kehadiran lebah.

Merawat lebah kelulut tidak sulit. Peternak cukup menjaga kebersihan stup. Peternak juga rajin memeriksa sarang setiap minggu. Musuh alami lebah, seperti semut, perlu dijauhkan. Bunga di sekitar kebun perlu ditanam. Bunga itu menjadi sumber makanan lebah. Dengan begitu, lebah tidak mudah pergi jauh.', NULL),
(141, 2, 'Menunggu di Dermaga', 'Senja mulai turun di Pelabuhan Sendang. Langit berwarna jingga bercampur ungu. Ayu duduk sendirian di ujung dermaga. Ia sudah menunggu sejak sore tadi. Angin laut meniup rambutnya yang panjang. Burung camar terbang rendah di atas air. Ia menatap cakrawala dengan gelisah.

Sudah tiga hari Ayah belum pulang. Kapal Ayah berangkat sebelum badai datang. Setiap malam Ibu menyalakan pelita di jendela. Katanya, cahaya itu penunjuk jalan pulang. Ibu berusaha tenang di depan adik-adik Ayu. Namun, Ayu tahu Ibu juga sangat cemas. Mata Ibu sering menatap ke arah laut.

Dari kejauhan, mercusuar berkedip pelan. Cahayanya menyapu permukaan laut yang gelap. Satu per satu perahu nelayan telah bersandar. Hanya kapal Ayah yang belum kembali. Suasana dermaga terasa sangat sunyi malam itu. Ombak menghantam tiang dermaga berulang kali. Udara malam mulai terasa dingin dan lembap. Ayu memeluk lututnya erat-erat sambil berdoa.

Tiba-tiba, sebuah titik cahaya muncul di ujung laut. Titik itu tampak makin besar. Ayu berdiri dan menajamkan pandangannya. Ayu menahan napas dan tidak berkedip. Cahaya itu bergerak pelan mendekati pelabuhan. Jantungnya berdebar sangat kencang di dadanya.

Itu benar-benar kapal Ayah! Suara mesinnya terdengar lirih, tetapi pasti. Para nelayan berlarian menyambut di dermaga. Seorang nelayan tua menepuk pundak Ayu. Ayu melambaikan tangan sambil menangis lega. Di kejauhan, Ibu tersenyum di depan jendela.', NULL),
(142, 2, 'Terumbu Karang yang Memutih', 'Terumbu karang adalah rumah bagi banyak biota laut. Ikan, kepiting, dan penyu bergantung pada karang. Meski luasnya kecil, karang menopang banyak kehidupan. Karena itu, karang disebut ekosistem yang penting. Wisatawan pun tertarik menyelam untuk melihatnya. Kerusakan karang dapat memengaruhi seluruh kehidupan laut.

Karang hidup bersama alga yang sangat kecil. Alga memberi makanan dan warna pada karang. Karang tampak indah karena warna alga itu. Sebaliknya, karang memberi tempat tinggal bagi alga. Hubungan itu bersifat saling menguntungkan.

Suhu laut yang terlalu panas membuat alga keluar. Karang pun kehilangan warna dan tampak putih. Karang yang putih tampak pucat dan rapuh. Peristiwa ini disebut pemutihan karang. Karang yang memutih belum tentu mati. Namun, karang akan mati jika pemutihan berlangsung lama. Kenaikan suhu satu atau dua derajat berbahaya. Kejadian ini makin sering muncul tiap tahun.

Aktivitas manusia juga merusak terumbu karang. Penangkapan ikan dengan bom mematahkan karang. Jangkar kapal dapat menyeret dan merusak karang. Limbah dari daratan membuat air laut keruh. Sampah plastik juga menutupi permukaan karang. Akibatnya, cahaya matahari sulit menembus air.

Para peneliti kini menanam karang buatan. Bibit karang ditempelkan pada rangka besi. Rangka itu ditenggelamkan di perairan dangkal. Dalam beberapa tahun, karang mulai tumbuh kembali. Cara ini sudah dicoba di beberapa pulau. Hasilnya cukup menggembirakan bagi para peneliti.', NULL),
(143, 2, 'Surat untuk Nadia', 'Hujan gerimis turun di halaman rumah Nadia. Ia duduk di beranda sambil memegang sepucuk surat. Amplopnya sedikit basah di bagian ujung. Tulisan tangan Kakak terlihat sangat rapi. Nadia menantikan surat ini selama berminggu-minggu.

Setahun lalu Kakak pergi merantau ke Kalimantan. Kakak adalah anak sulung di keluarga mereka. Sejak Ayah sakit, penghasilan keluarga berkurang. Ia bekerja di pabrik kayu agar adik-adiknya tetap bersekolah. Nadia menangis ketika mengantar Kakak ke terminal. Hatinya terasa berat melepas kepergian itu.

Dalam surat itu, Kakak bercerita tentang pekerjaannya. Tulisannya panjang dan berisi banyak cerita. Ia menulis bahwa pekerjaannya sangat melelahkan. Meski begitu, ia tidak pernah mengeluh. Ia juga menitipkan sedikit uang di amplop. Uang itu untuk membeli buku Nadia. "Kakak ingin kalian menjadi anak yang pintar," tulisnya.

Nadia teringat sifat Kakak yang kepala batu. Kakak tidak mau menerima bantuan siapa pun. Ia tidak suka dikasihani oleh orang lain. Kakak selalu bilang bisa mengatasi semuanya sendiri. Nadia sering menasihatinya agar mau beristirahat. Sifat itu membuat Nadia kesal sekaligus kagum.

Nadia melipat surat itu dengan hati-hati. Ia membaca surat itu sampai tiga kali. Ia menyimpannya di dalam laci meja belajar. Besok Nadia akan membalas surat itu. Ia berjanji akan belajar lebih tekun. Di langit, awan kelabu perlahan menepi. Seberkas cahaya sore menembus sela-sela genting.', NULL),
(144, 2, 'Listrik dari Sinar Matahari', 'Desa Tanjung belum dialiri listrik selama puluhan tahun. Warga memakai lampu minyak untuk penerangan. Sebelumnya, malam di desa itu sangat gelap. Anak-anak sulit belajar setelah matahari terbenam. Pada tahun 2023, desa itu menerima panel surya. Panel surya adalah alat penangkap sinar matahari.

Panel surya mengubah cahaya menjadi listrik. Proses itu disebut konversi energi. Karena itu, desa memasang dua puluh panel. Panel dipasang di atap balai desa. Listrik yang dihasilkan disimpan dalam baterai. Baterai itu diletakkan di ruangan yang kering. Dengan baterai, listrik tetap tersedia pada malam hari.

Sinar matahari termasuk energi terbarukan. Energi terbarukan tidak akan habis dipakai. Sumber energi ini tersedia setiap hari. Selama matahari bersinar, listrik terus dihasilkan. Sifatnya berbeda dengan bahan bakar fosil seperti batu bara. Batu bara terbentuk selama jutaan tahun.

Kini warga dapat belajar dan bekerja pada malam hari. Anak-anak membaca dengan lampu yang terang. Ibu-ibu menjahit hingga larut malam. Suasana malam di desa kini lebih hidup. Balai desa kini ramai oleh kegiatan warga. Toko kecil pun dapat berjualan lebih lama.

Namun, panel surya membutuhkan perawatan rutin. Debu di permukaan panel harus dibersihkan. Baterai yang rusak perlu diganti secepatnya. Karena itu, desa membentuk tim perawat khusus. Tim itu terdiri atas lima pemuda desa. Mereka berlatih selama dua minggu di kota.', NULL),
(145, 2, 'Teks 1: Layang-Layang Kakek (Teks Fiksi)', '[1] Sore itu, Bima duduk termenung di beranda. Angin bertiup kencang dari arah sawah. Suara jangkrik mulai terdengar dari kebun. Kakek Jaya keluar membawa gulungan benang. "Ayo, kita buat layang-layang," ajak Kakek. Bima menoleh dengan wajah murung. Ia baru saja kalah dalam lomba lari. Hatinya masih terasa berat dan kesal. Ia enggan menjawab ajakan itu.

[2] Kakek mengambil bambu dan kertas warna merah. Ia membelah bambu menjadi bilah tipis. Bima membantu menyerut ujung bilah itu. Mereka merekatkan kertas dengan lem nasi. Ruang tamu penuh serpihan bambu dan kertas. Sambil bekerja, Kakek bercerita tentang masa kecilnya. Dulu, Kakek sering jatuh saat memanjat pohon. Namun, ia selalu bangkit dan mencoba lagi.

[3] Layang-layang itu selesai menjelang magrib. Bima berlari ke lapangan sambil memegang benang. Angin mengangkat layang-layang ke langit jingga. Warna merahnya tampak indah di langit. Namun, benangnya tiba-tiba putus. Layang-layang terbang jauh ke tepi hutan. Bima terdiam dan hampir menangis. Kakek menepuk pundaknya dengan lembut.

[4] "Kita bisa membuat yang baru," kata Kakek. Bima menghapus air matanya dengan lengan baju. Keesokan harinya, mereka membuat layang-layang biru. Kali ini Bima mengikat benang lebih kuat. Layang-layang itu terbang tinggi dan stabil. Kakek tertawa senang melihat cucunya bangkit. Bima tersenyum lebar menatap langit. Ia tidak lagi sedih karena kekalahannya.', NULL),
(146, 2, 'Teks 2: Hadiah untuk Bu Ningsih (Teks Fiksi)', '[1] Pagi itu, Laras tiba di sekolah lebih awal. Udara pagi terasa sejuk dan segar. Ia membawa kotak kecil berbungkus kertas kuning. Isinya sebuah bros berbentuk bunga matahari. Bros itu ia buat sendiri selama seminggu. Hari ini Bu Ningsih berulang tahun. Laras ingin memberi kejutan untuk wali kelasnya. Jantungnya berdebar karena gugup.

[2] Di kelas, Laras bertemu Yoga dan Maya. Mereka juga membawa hadiah untuk Bu Ningsih. Teman-temannya tertawa riang di dekat jendela. Yoga membawa buku catatan bersampul biru. Maya membawa sekuntum mawar dari kebunnya. Laras merasa hadiahnya paling sederhana. Ia menyembunyikan kotaknya di dalam tas. Wajahnya berubah murung dan malu.

[3] Bu Ningsih masuk kelas dengan senyum ramah. Semua murid menyanyikan lagu selamat ulang tahun. Yoga dan Maya maju memberikan hadiah mereka. Kelas menjadi riuh dan penuh tepuk tangan. Bu Ningsih berterima kasih dengan gembira. Laras tetap duduk dan menunduk. Tiba-tiba Bu Ningsih memanggil namanya. "Laras, ada apa dengan tasmu?" tanyanya lembut.

[4] Laras akhirnya mengeluarkan kotak kuning itu. Bu Ningsih membukanya perlahan. Matanya berkaca-kaca melihat bros bunga matahari. "Ibu belum pernah dapat hadiah seindah ini," katanya. Ia langsung menyematkan bros itu di bajunya. Bros itu dipakai Bu Ningsih sepanjang hari. Laras tersenyum lega dan bahagia. Sejak hari itu, ia lebih percaya diri.

[1] Subuh itu, Ari mengikuti ayahnya ke pantai. Angin laut bertiup dingin di kulitnya. Ombak kecil memecah di tepi pasir. Pak Darto menyiapkan jaring di perahu kecil. Ari membawa termos berisi teh hangat. Ini pertama kalinya ia melaut. Hatinya berdebar antara senang dan takut. Ia teringat cerita kakeknya tentang laut. Cerita itu membuatnya penasaran.

[2] Perahu mereka meluncur pelan ke tengah laut. Matahari muncul dari balik cakrawala. Langit berubah jingga keemasan. Burung camar terbang rendah di atas air. Pak Darto menebar jaring dengan cekatan. Ari memperhatikan setiap gerakan ayahnya. Tangannya ingin ikut membantu. Namun, ia masih ragu untuk mencoba. Udara pagi terasa segar dan asin. Perahu bergoyang pelan mengikuti arus.

[3] Tiba-tiba ombak besar menghantam perahu. Jaring tersangkut karang dan tidak bisa ditarik. Pak Darto mengerutkan dahi. "Ari, pegang tali ini kuat-kuat," katanya. Ari menggenggam tali dengan kedua tangan. Mereka menarik bersama sekuat tenaga. Akhirnya jaring terlepas dari karang.

[4] Pak Darto tersenyum lebar pada anaknya. "Kamu sudah seperti nelayan sungguhan," ujarnya. Wajah Ari memerah karena bangga. Hasil tangkapan hari itu tidak banyak. Namun, Ari merasa lebih berani dari sebelumnya. Ia bertekad ikut melaut lagi besok. Perahu pun kembali ke tepi pantai. Sepanjang jalan, Ari bercerita dengan riang. Pak Darto mendengarkannya sambil tertawa. Mereka pulang dengan hati gembira.', NULL),
(147, 2, 'Teks 4: Sudut Baca Bu Wati (Teks Fiksi)', '[1] Dimas berjalan cepat menuju perpustakaan desa. Bangunan itu kecil dan bercat putih. Rak-raknya penuh buku yang mulai lusuh. Bunyi kipas tua berdengung pelan. Bu Wati, penjaga perpustakaan, menyambutnya ramah. Setiap Sabtu, Dimas datang paling awal. Ia gemar membaca buku tentang luar angkasa. Buku-buku baru jarang datang ke sana. Karena itu, ia merawat setiap buku.

[2] Hari itu, Dimas mencari buku tentang planet. Namun, buku itu tidak ada di rak. Bu Wati mengatakan buku itu sedang dipinjam. Peminjamnya adalah Tika, teman sekelas Dimas. Dimas merasa sedikit kecewa. Ia lalu duduk di sudut ruangan. Di sana ia membaca kamus bergambar. Waktu terasa berjalan lambat.

[3] Tak lama kemudian, Tika datang membawa buku itu. Buku itu bersampul biru tua. "Aku sudah selesai membaca," kata Tika. "Kamu boleh membacanya sekarang." Mata Dimas berbinar mendengarnya. Mereka lalu membaca buku itu bersama-sama. Tika menunjuk gambar planet berwarna biru. Dimas menjelaskan bahwa planet itu bernama Neptunus. Suasana perpustakaan menjadi hangat. Tawa mereka terdengar sampai halaman.

[4] Sejak hari itu, mereka sering membaca bersama. Bu Wati pun membuat sudut baca kecil. Ia memasang tikar dan dua bantal di sana. Anak-anak lain mulai ikut bergabung. Kegiatan itu berlangsung setiap akhir pekan. Perpustakaan yang sepi kini menjadi ramai. Dimas senang karena banyak kawan baru. Ia berharap perpustakaan itu terus hidup.', NULL),
(148, 2, 'Teks 5: Anak Kucing di Pasar (Teks Fiksi)', '[1] Wulan berjalan bersama ibunya di pasar pagi. Suasana ramai dan penuh suara pedagang. Bau ikan asin dan buah menyengat hidung. Ibu sibuk memilih sayur di lapak. Keranjang belanja ibu sudah hampir penuh. Wulan menunggu sambil memandang sekeliling. Tiba-tiba terdengar suara mengeong lemah.

[2] Wulan mencari asal suara itu. Ia berjongkok pelan agar tidak menakutinya. Ia menemukan anak kucing di bawah meja. Bulunya kotor dan tubuhnya gemetar. Tidak ada yang tampak memiliki kucing itu. Wulan menggendongnya dengan hati-hati. Ia lalu menunjukkannya kepada ibu.

[3] Ibu menyarankan Wulan bertanya pada pedagang. Mereka mendatangi lapak ikan, buah, dan jajanan. Semua pedagang menggeleng tidak tahu. Wulan mulai putus asa. Langkah kaki mereka terasa semakin lelah. Kucing itu mengeong sambil menempel di dadanya. Wulan tidak tega melepaskannya.

[4] Di ujung pasar, seorang nenek berteriak. "Mimi! Itu kucingku!" serunya sambil berlari. Nenek itu memeluk anak kucing tersebut. Wajah nenek tampak lega dan bahagia. Ia berkata kucingnya kabur sejak pagi. Nenek berterima kasih berkali-kali kepada Wulan. Wulan tersenyum walau agak sedih berpisah.

[5] Nenek memberi Wulan sebungkus kue pisang. Kue itu masih hangat dan harum. Wulan menolaknya dengan sopan. Namun, nenek tetap memaksa dengan ramah. Dalam perjalanan pulang, Wulan merasa bahagia. Ibu mengusap kepalanya dengan bangga. Wulan belajar bahwa menolong itu menyenangkan.', NULL),
(149, 2, 'Teks 6: Sepeda Hijau untuk Ayah (Teks Fiksi)', '[1] Kiki menabung setiap hari selama tiga bulan. Kadang ia menahan diri saat ingin jajan. Uangnya ia simpan di celengan ayam. Ia ingin membelikan ayahnya sepeda baru. Sepeda tua ayah sering rusak di jalan. Ayah bekerja mengantar koran setiap pagi. Kiki tidak tega melihat ayahnya kelelahan. Ia percaya usaha kecil akan membuahkan hasil.

[2] Suatu sore, celengan itu akhirnya penuh. Kiki memecahkannya di depan ibu. Uangnya berjumlah cukup untuk sebuah sepeda bekas. Ibu terharu dan memeluk Kiki. Mereka lalu pergi ke toko sepeda. Toko itu berada di dekat terminal. Kiki memeriksa setiap sepeda dengan teliti. Pemilik toko menunjukkan sepeda hijau yang kokoh. Sepeda itu tampak bersih dan mengilap.

[3] Namun, harga sepeda itu lebih mahal. Uang Kiki kurang seratus ribu rupiah. Hujan gerimis mulai turun di luar. Kiki tertunduk lesu di depan toko. Tiba-tiba pemilik toko tersenyum.', NULL),
(150, 2, 'Teks 7: Kebun Nenek di Atas Kertas (Teks Fiksi)', '[1] Sinta duduk diam di depan kertas kosong. Suasana aula terasa riuh dan tegang. Lomba melukis dimulai lima menit lalu. Teman-temannya sudah mulai mewarnai. Tangan Sinta terasa dingin dan gemetar. Ia takut hasilnya tidak bagus. Jantungnya berdetak semakin kencang. Ia menggigit bibir bawahnya. Waktu terus berjalan tanpa henti. Guru pendamping tersenyum menyemangati dari sudut aula.

[2] Sinta teringat pesan neneknya minggu lalu. "Gambarlah apa yang kamu cintai," kata nenek. Ia lalu memejamkan mata sejenak. Bayangan kebun nenek muncul di pikirannya. Bunga melati tumbuh subur di sana. Kupu-kupu beterbangan di antara daunnya. Senyum kecil muncul di wajah Sinta. Rasa takutnya perlahan menghilang. Napasnya mulai teratur kembali.

[3] Sinta mulai menggoreskan pensilnya dengan yakin. Ia melukis kebun nenek dengan warna cerah. Warna hijau dan putih mendominasi lukisannya. Waktu berlalu tanpa ia sadari. Beberapa peserta melirik karyanya dengan kagum. Saat bel berbunyi, lukisannya baru selesai. Ia menyerahkan karyanya kepada juri. Lalu ia menunggu pengumuman dengan cemas. Ia menikmati setiap goresan warna. Tangannya tak lagi gemetar.

[4] Nama Sinta disebut sebagai juara kedua. Ia hampir tidak percaya mendengarnya. Piala kecil diserahkan ke tangannya. Sinta berlari memeluk neneknya yang menunggu. "Nenek benar," bisiknya sambil terisak bahagia. Nenek mengusap kepala cucunya dengan lembut. Mulai hari itu, Sinta tidak takut lagi. Semua peserta bertepuk tangan meriah.', NULL),
(151, 2, 'Teks 8: Malam Banjir di Kampung Rafi (Teks Fiksi)', '[1] Hujan deras mengguyur kampung Rafi sejak sore. Petir menyambar di kejauhan. Air sungai naik dengan cepat. Lampu di kampung padam mendadak. Warga mulai cemas melihatnya. Pak RT memukul kentongan berkali-kali. Semua orang diminta berkumpul di balai desa. Rafi ikut berlari bersama ibunya. Ibu menggenggam tangannya erat-erat. Air mulai masuk ke halaman rumah.

[2] Di balai desa, warga saling membantu. Suasana terasa hangat meski penuh kecemasan. Ibu-ibu menyiapkan nasi bungkus dan teh hangat. Bapak-bapak mengangkut barang ke tempat tinggi. Rafi membagikan selimut kepada para lansia. Tiba-tiba ia menyadari adiknya hilang. Wajahnya pucat dan tangannya gemetar. Semua orang berusaha tetap tenang.

[3] Rafi berlari keluar dan menerobos hujan. Jalanan licin dan gelap gulita. Ia mencari adiknya di sekitar warung. Akhirnya ia menemukan Dita di bawah pohon. Adiknya menangis sambil memeluk kucingnya. Rafi menggendong Dita dan kembali cepat. Ibu menyambut mereka sambil menangis lega. Ia terus memanggil nama adiknya. Suaranya bercampur dengan derasnya hujan.

[4] Keesokan harinya, air mulai surut. Matahari bersinar cerah setelah semalaman gelap. Warga bergotong royong membersihkan lumpur. Rafi dan Dita ikut menyapu jalan. Kucing kecil itu bermain di dekat mereka. Pak RT memuji keberanian Rafi. Rafi hanya tersenyum malu-malu. Ia belajar bahwa keluarga adalah hal terpenting. Anak-anak tertawa riang di tengah genangan lumpur.

Ia mengenal ayah Kiki sebagai pengantar koran. "Kekurangannya tidak perlu dibayar," katanya. Kiki hampir tidak percaya mendengarnya.

[4] Malam itu, Kiki menaruh sepeda di teras. Ayah pulang dan terdiam melihatnya. Matanya basah oleh air mata bahagia. Ia memeluk Kiki dengan erat. Keesokan paginya, ayah mengantar koran dengan riang. Kiki melambaikan tangan dari depan pagar. Kiki tidur nyenyak dengan hati lega. Sepeda hijau itu melaju di jalan kampung.', NULL),
(152, 2, 'Teks 1 – Sepeda Biru Milik Laras', 'Laras menerima sepeda biru dari kakaknya. Cat sepeda itu sudah mengelupas. Rantainya berkarat dan joknya robek di sudut. Teman-temannya bersepeda dengan sepeda baru yang mengilap. Laras hanya menunduk setiap kali mereka lewat.
Suatu sore, ayah memanggil Laras ke bengkel kecil di belakang rumah. Di sana, ayah sudah menyiapkan kaleng cat, kain lap, dan minyak pelumas. "Ayo, kita rawat bersama," ajak ayah. Laras ragu, tetapi ia tetap mengambil kuas.
Mereka bekerja sampai lampu teras menyala. Laras mengampelas karat dengan sabar. Ia mengecat ulang setiap bagian dengan hati-hati. Sesekali ia berhenti untuk mengelap keringat. Ayah hanya tersenyum melihat ketekunan putrinya.
Keesokan harinya, sepeda itu tampak berbeda. Warna birunya cerah seperti langit pagi. Laras mengayuhnya pelan melewati lapangan. Teman-temannya menoleh dan bertanya-tanya. "Kamu beli di mana?" tanya Dinda. Laras menepuk sadel sambil tersenyum lebar. "Ini sepedaku sendiri. Kami memperbaikinya kemarin," jawabnya.', NULL),
(153, 2, 'Teks 2 – Pulang Sebelum Badai', 'Langit di atas dermaga mulai menghitam. Angin bertiup kencang dari arah laut. Perahu-perahu kecil bergoyang keras di tambatannya. Pak Hasan, kakek Bayu, berdiri di ujung dermaga sambil menatap cakrawala. Di sampingnya, Bayu memeluk jaket tipisnya erat-erat.
"Ayah belum pulang," bisik Bayu. Ia menggigit bibir bawahnya. Pak Hasan menepuk bahunya dan tidak berkata apa-apa. Sejak siang, ia sudah tiga kali memeriksa radio di pos jaga. Suara yang terdengar hanya desis panjang.
Para nelayan lain berkumpul membawa lampu petromaks. Mereka berbicara pelan dan bergantian menatap laut. Ibu Sari membagikan teh hangat kepada semua orang. Tak seorang pun mau pulang lebih dulu.
Menjelang tengah malam, setitik cahaya muncul jauh di tengah ombak. Cahaya itu bergerak naik turun. Bayu meloncat dan berteriak nyaring. "Itu lampu perahu Ayah!" Semua orang bersorak. Beberapa nelayan segera berlari menyiapkan tali tambat.', NULL),
(154, 2, 'Teks 3 – Dompet di Bangku Halte', 'Dimas duduk menunggu bus di halte sekolah. Hujan gerimis turun sejak siang. Di bangku sebelahnya tergeletak sebuah dompet cokelat. Ia mengamatinya sebentar lalu membukanya. Isinya beberapa lembar uang dan sebuah kartu identitas.
Perut Dimas berbunyi keras. Sejak pagi ia belum sempat makan. Uang di dompet itu cukup untuk membeli sepiring nasi, bahkan sekantong jajanan. Ia menelan ludah. Namun, foto seorang ibu di kartu identitas itu membuatnya terdiam. Wajah itu mirip ibunya sendiri.
Dimas membayangkan ibu itu kebingungan mencari dompetnya. Ia pun berdiri dan menyusuri jalan menuju alamat di kartu. Sepatunya basah oleh genangan. Setelah dua puluh menit, ia sampai di sebuah warung kecil. Seorang ibu sedang mengaduk-aduk laci dengan wajah pucat.
"Permisi, Bu. Ini dompet Ibu?" tanya Dimas. Ibu itu terperangah lalu memeluknya. "Terima kasih, Nak. Itu uang untuk membayar sekolah anakku," katanya terbata-bata. Dimas hanya mengangguk. Perutnya masih lapar, tetapi hatinya terasa hangat.', NULL),
(155, 2, 'Teks 4 – Ladang Terakhir Pak Sarman', 'Di ujung desa, hanya tersisa satu ladang jagung. Pemiliknya, Pak Sarman, sudah menggarapnya selama empat puluh tahun. Sawah-sawah lain telah berganti pagar seng dan gudang pabrik. Setiap pagi, truk-truk besar melintas dan meninggalkan debu.
Suatu hari, seorang pria berjas datang membawa map tebal. Ia menawarkan harga yang sangat tinggi. "Bapak bisa hidup nyaman seumur hidup," katanya. Pak Sarman menatap map itu lama sekali, lalu menggeleng pelan.
Wahyu, putranya, tak habis pikir. "Kenapa tidak dijual saja, Pak?" tanyanya. Pak Sarman mengambil segenggam tanah dan mengusapnya di telapak tangan. "Tanah ini yang menyekolahkanmu," jawabnya. "Aku tidak menjual yang menghidupi kita."
Malam itu Wahyu tidak bisa tidur. Ia teringat masa kecilnya di antara batang jagung. Esok harinya ia bangun lebih pagi dari ayahnya. Tanpa disuruh, ia mengambil cangkul dan berjalan ke ladang.', NULL),
(156, 2, 'Teks 5 – Pelajaran Terakhir Bu Wening', 'Bu Wening akan pensiun akhir bulan ini. Selama tiga puluh tahun, ia mengajar di sekolah dasar yang sama. Murid-muridnya menyayanginya, meski ia dikenal sangat tegas. Ia tidak pernah membiarkan pekerjaan rumah dikerjakan asal-asalan.
Pada hari terakhir, kelas enam tampak berbeda. Meja-meja disusun melingkar. Di tengahnya ada kue sederhana dengan lilin kecil. Bu Wening terkejut dan berdiri terpaku di ambang pintu. Matanya berkaca-kaca.
Rian, ketua kelas, maju sambil membawa selembar kertas. "Bu, dulu kami sebal dengan PR yang banyak," katanya sambil tersenyum. "Sekarang kami sadar, itu cara Ibu menyiapkan kami." Beberapa anak mengusap pipi mereka. Bu Wening menarik napas panjang.
"Ibu tidak pernah merasa mengajar sendirian," ujarnya pelan. "Kalian yang mengajari Ibu bersabar." Ia lalu membuka tasnya dan mengeluarkan penghapus papan tulis yang sudah aus. Benda itu ia letakkan di meja Rian. "Simpanlah. Suatu hari kalian akan mengerti."', NULL),
(157, 2, 'Teks 6 – Rahasia Jam Saku Kakek Wiryo', 'Di sudut lemari tua kamar kakek, tersimpan sebuah kotak beludru merah kusam. Ardi sering melihat kakek mengusap kotak itu setiap malam sebelum tidur. Rasa penasaran mendorong Ardi mendekati meja saat sang kakek sedang menyiram tanaman di pekarangan. Di dalam kotak itu, terbaring sebuah jam saku perak dengan kaca retak halus dan jarum detik yang tak lagi berputar.
"Kek, kenapa jam mati ini selalu Kakek simpan dengan rapi?" tanya Ardi ketika kakek melangkah masuk ke kamar. Kakek Wiryo tersenyum teduh. Beliau duduk di tepi dipan lalu menepuk pundak cucunya perlahan.
"Jam ini pemberian buyutmu saat kakek pertama kali merantau tanpa bekal uang sepeser pun," ujar kakek lirih. "Retakan ini terjadi saat kakek terjatuh saat bekerja keras membangun usaha pertama. Jarumnya memang berhenti berdetak, tetapi setiap kali memandangnya, kakek selalu teringat bahwa waktu perjuangan tidak boleh disia-siakan."
Ardi terdiam memandangi jam saku berdebu itu. Kini ia mengerti, barang rusak tak selalu menjadi sampah tak berguna, melainkan bisa menjadi pengingat abadi tentang ketabahan meniti kehidupan.', NULL),
(158, 2, 'Teks 7 – Jembatan Bambu Desa Karang', 'Hujan deras semalam suntuk meluapkan Sungai Cikaso dan menghanyutkan jembatan bambu penghubung Dusun Karang dengan sekolah. Pagi itu, puluhan anak berseragam putih-biru berdiri gamang di tepian sungai yang berarus deras dan keruh. Jika memutar melewati jembatan beton jalan raya kabupaten, mereka harus berjalan kaki sejauh delapan kilometer.
Pak Danu, seorang perajin bambu paruh baya, segera keluar dari rumahnya sambil memanggul sebilah parang tajam dan tambang kelapa. "Ayo kumpulkan batang bambu tua dari kebun belakang! Sebelum bel sekolah berbunyi, jembatan darurat harus sudah terpasang!" serunya lantang.
Mendengar seruan tersebut, para pemuda dan warga desa bergegas membawa bambu, pasak kayu, dan anyaman kawat. Mereka bahu-membahu menancapkan tiang penyangga di dasar sungai yang licin, mengabaikan dinginnya air pagi. Tepat pukul tujuh kurang lima belas menit, sebatang jembatan titian ganda kokoh selesai terbentang. Wajah-wajah tegang anak-anak seketika berganti senyum riang saat mereka melangkah menyeberang tepat pada waktunya.', NULL),
(159, 2, 'Teks 8 – Layang-Layang Arman', 'Arman membuat layang-layang dari kertas bekas. Rangkanya dari bilah bambu yang ia serut sendiri. Ekornya panjang, terbuat dari sobekan kain lurik. Ia bangga pada hasil karyanya. Sore itu ia berlari ke tanah lapang.
Angin bertiup sedang. Layang-layang itu naik perlahan, lalu melambung tinggi. Arman melepas benang sedikit demi sedikit. Hatinya ikut terbang bersama layangan itu. Namun, tiba-tiba benang terasa ringan. Layang-layang itu meliuk-liuk lalu jatuh di atas atap rumah Pak Kades.
Arman terdiam. Wajahnya memerah menahan tangis. Benangnya putus karena tergores kaca di atas pagar. Pak Kades keluar dan mengambil layangan itu dengan tangga. "Ini punyamu, Nak?" tanyanya. Arman mengangguk lesu.
"Sayang sekali, ya. Tapi lihat, kerangkanya masih utuh," kata Pak Kades. Ia menyerahkan layangan sambil tersenyum. "Cukup ganti benangnya, ia bisa terbang lagi." Arman menerimanya dengan mata berbinar. Semangatnya kembali menyala seperti api yang ditiup.', NULL),
(160, 2, 'Teks 9 – Warung Bu Tini', 'Warung Bu Tini selalu ramai sejak subuh. Aroma bawang goreng menyebar sampai ke ujung gang. Para pekerja pabrik singgah untuk membeli nasi bungkus. Harganya murah, porsinya pun besar. Bu Tini melayani semua pembeli dengan ramah.
Pada suatu hari, harga beras naik tajam. Bu Tini menghitung ulang modalnya di buku lusuh. Keningnya berkerut dalam. Jika harga nasi dinaikkan, pelanggannya bisa pergi. Jika tidak, ia akan merugi setiap hari.
Malam itu ia berunding dengan suaminya. Pak Damar menyarankan agar porsi nasi dikurangi sedikit. Bu Tini menggeleng. "Mereka bekerja keras, Pak. Perut lapar tak bisa dibohongi," ujarnya. Akhirnya ia memilih memangkas keuntungan dan menambah menu sayur murah.
Sebulan kemudian, warungnya justru makin ramai. Pelanggan lama membawa teman-teman baru. Mereka membicarakan kejujuran Bu Tini sepanjang jalan. Buku lusuh itu kini penuh catatan pemasukan yang stabil.', NULL),
(161, 2, 'Teks 10 – Tugas Kelompok Sinta', 'Guru memberi tugas membuat maket rumah adat. Sinta satu kelompok dengan Beni, Cahya, dan Farhan. Mereka sepakat berkumpul di rumah Sinta pada hari Sabtu. Sinta sudah menyiapkan lem, gunting, dan karton bekas.
Sabtu pagi, hanya Cahya yang datang. Beni mengirim pesan bahwa ia harus membantu ibunya. Farhan tidak memberi kabar sama sekali. Sinta menghela napas panjang. Ia mulai mengerjakan bagian dasar maket bersama Cahya.
Menjelang siang, Farhan muncul dengan wajah penuh sesal. Ia mengaku ketiduran karena semalam menjaga adiknya yang demam. Sinta hampir marah, tetapi ia menahannya. Ia teringat wajah letih Farhan di sekolah kemarin.
"Tidak apa-apa. Bagianmu membuat atap," kata Sinta sambil menyodorkan bambu. Farhan mengangguk penuh semangat. Sore itu, atap limasan buatannya menjadi bagian paling rapi. Kelompok mereka mendapat nilai tertinggi di kelas.', NULL),
(162, 2, 'Teks 11 – Seruling Kakek', 'Setiap senja, Kakek duduk di beranda sambil meniup seruling bambu. Nadanya lirih dan panjang. Suara itu mengalir pelan melewati sawah dan menyentuh atap-atap rumah. Anak-anak berhenti bermain untuk mendengarkannya. Bahkan burung-burung tampak enggan pulang ke sarang.
Kirana, cucunya, sangat menyukai suara itu. Ia sering duduk di lantai beranda dan memeluk lututnya. "Kek, ajari aku," pintanya suatu hari. Kakek tersenyum dan menyerahkan seruling kecil dari laci.
Latihan pertama terdengar seperti pekikan kucing terjepit. Kirana tertawa geli, tetapi ia terus mencoba. Berhari-hari ia berlatih hingga bibirnya pegal. Kakek hanya membetulkan letak jarinya dan bersabar.
Ketika musim panen tiba, Kakek jatuh sakit dan tak sanggup meniup seruling. Sore itu, Kirana duduk di beranda dan memainkan tembang yang sama. Nadanya belum sempurna, tetapi terasa hangat. Dari dalam kamar, Kakek memejamkan mata dan tersenyum. Baginya, tembang itu terasa seperti pelukan yang lembut.', NULL),
(163, 2, 'Teks 12 – Surat untuk Bu Ratmi', 'Pak Joko sudah dua puluh tahun menjadi tukang pos di desa itu. Ia hafal setiap nama dan belokan jalan. Pagi itu, tasnya berisi satu surat yang tampak aneh. Amplopnya menguning dan pinggirannya rapuh. Alamatnya tertulis dengan tinta yang mulai pudar.
Surat itu ditujukan kepada Bu Ratmi, penjahit tua di ujung desa. Pak Joko mengetuk pintu rumahnya dengan hati-hati. Bu Ratmi membuka amplop dengan tangan gemetar. Ia membaca isinya pelan-pelan, lalu menutup mulutnya.
Surat itu ditulis oleh suaminya lima puluh tahun lalu. Sang suami berlayar dan tak pernah kembali. Surat itu ternyata tersimpan di kantor pos lama yang baru dibongkar. Air mata Bu Ratmi jatuh membasahi kertas rapuh itu.
"Terima kasih sudah mengantarnya, Nak," ujarnya lirih. Pak Joko hanya menunduk. Tenggorokannya terasa tercekat. Sore itu ia pulang lebih lambat dari biasanya. Ia berjalan sambil mengenang orang-orang yang pernah menunggu kabar darinya.', NULL),
(164, 2, 'Teks 13 – Perahu Kertas di Selokan Hujan', 'Gerimis deras menderu di atas seng atap rumah Gani. Dari teras depan, Gani dan adiknya, Fajar, asyik melipat lembaran kertas kalender menjadi dua buah perahu kecil. Fajar memberi garis merah pada perahunya, sementara perahu Gani berwarna biru tua.
"Ayo kita luncurkan di parit depan!" ajak Fajar dengan mata berbinar-binar. Air selokan mengalir deras mengikis lumut pembatas jalan. Kedua perahu kertas itu meluncur laju bersisian, menari-nari di atas buih air kecokelatan.
Namun, baru berjalan sepuluh meter, perahu Fajar tersangkut di antara jeratan kantong plastik dan botol bekas yang menyumbat gorong-gorong. Air mendesak dinding kertas tipis itu hingga terlipat dan tenggelam perlahan ke dasar lumpur. Senyum Fajar mendadak padam. Matanya berawan mendung menatap bangkai perahunya yang karam.
Gani merangkul pundak sang adik lalu menariknya menepi. "Bukan perahumu yang salah, Jar. Selokan kita yang sedang sakit karena tertimbun sampah manusia."', NULL),
(165, 2, 'Teks 14 – Aroma Roti Pagi Hari', 'Kala azan subuh baru saja usai berkumandang, semerbak harum mentega bakar dan vanila hangat telah menyelinap melalui celah ventilasi kamar Raka. Aroma manis yang mengelus indra penciuman itu selalu berasal dari oven pemanggang toko roti Pak Johan di sudut persimpangan gang.
Raka segera mencuci muka dan melangkah keluar rumah. Di depan toko, sebuah mobil bak terbuka sedang menurunkan pasokan bahan pokok. Melihat Pak Johan yang berambut memutih membungkuk mengangkat karung gandum seberat dua puluh kilogram, Raka bergegas mendekat.
"Biar saya bantu angkat karung gula dan menteganya ke gudang, Pak," tawar Raka seraya menyingsingkan lengan kemeja seragamnya. Pak Johan menyeka peluh di dahinya, lalu tersenyum lebar hingga garis-garis keriput di sudut matanya terlihat jelas.
Setelah semua karung tertata rapi di rak kayu, Pak Johan menyodorkan sepotong roti isi selai cokelat yang masih mengepul hangat. Rasa legit cokelat lumer di lidah Raka, menghadirkan kehangatan luar biasa sebelum melangkahkan kaki menuju gerbang sekolah.', NULL),
(166, 2, 'Teks 15 – Tendangan Penentu', 'Skor akhir pertandingan masih imbang satu sama. Waktu tersisa tinggal dua menit. Rio berdiri di dekat garis tengah dengan napas terengah-engah. Kakinya terasa berat karena berlari sejak awal babak. Di pinggir lapangan, pelatih berteriak menyuruhnya menjaga posisi.
Bola tiba-tiba melambung ke arahnya. Rio menahannya dengan dada, lalu menggiringnya ke depan. Dua pemain lawan menghadang dari kiri dan kanan. Ia melirik ke sisi kanan. Di sana, Ilham sudah berlari bebas tanpa penjaga.
Sebulan lalu, Rio pernah gagal memberi umpan pada Ilham. Bola itu terlalu keras dan melewati sasaran. Sejak saat itu, ia lebih sering menembak sendiri. Kini kesempatan yang sama datang lagi. Gawang lawan terlihat begitu dekat.
Rio menarik napas dalam-dalam. Ia menatap Ilham sekali lagi. Kakinya mulai bersiap mengayun. Penonton berdiri menahan napas. Peluit wasit belum berbunyi.', NULL),
(167, 2, 'Teks 16 – Pohon Mangga di Halaman', 'Bimo menanam bibit mangga di halaman sekolah. Guru memintanya merawat bibit itu sampai berbuah. Ia menyiram setiap pagi sebelum bel berbunyi. Teman-temannya menertawakan kegigihannya. "Tanaman itu baru berbuah lima tahun lagi," ejek mereka.
Bimo tidak menghiraukannya. Ia membuat pagar bambu kecil di sekeliling bibit. Ia juga mengumpulkan daun kering untuk pupuk. Kadang ia membersihkan gulma sambil bersenandung. Bibit itu tumbuh tegak dengan daun hijau mengilap.
Beberapa bulan kemudian, kemarau panjang datang. Tanah sekolah mengering dan retak-retak. Banyak tanaman layu dan meranggas. Sumur sekolah pun nyaris kering. Kepala sekolah mengumumkan bahwa air harus dihemat.
Pagi itu Bimo datang membawa dua botol bekas berisi air. Ia sengaja menyisihkan air minum di rumah. Ia menuang perlahan di sekitar akar bibit. Teman-temannya memandangnya dari jauh. Kini tak seorang pun yang tertawa.', NULL),
(168, 2, 'Teks 17 – Kotak Bekal Nadia', 'Nadia membuka kotak bekalnya dengan riang. Ibunya membuatkan nasi goreng dengan telur mata sapi. Aromanya membuat perut teman-teman berbunyi. Di ujung bangku, Tomi hanya menatap selembar roti tawar. Ia berpura-pura sibuk membaca buku.
Nadia memperhatikan Tomi selama beberapa hari. Setiap istirahat, bekalnya selalu sama. Tomi tidak pernah membeli jajanan di kantin. Ia juga menolak setiap kali diajak. Alasannya selalu sama, "Aku masih kenyang."
Hari ini Nadia sengaja membawa bekal dua kali lipat. Ia mengaduk nasi gorengnya sambil melirik Tomi. Tangannya sempat ragu memegang sendok. Ia khawatir Tomi tersinggung jika ditawari langsung. Ia lalu tersenyum kecil seolah menemukan gagasan.
"Tom, tolong bantu aku," kata Nadia sambil menyodorkan kotak bekalnya. "Ibuku membuat terlalu banyak. Aku tidak sanggup menghabiskannya." Tomi menatap kotak itu lama. Perutnya berbunyi pelan.', NULL),
(169, 2, 'Teks 18 – Suara dari Gudang Tua', 'Sore itu langit kelabu tanpa matahari. Arif, Yuda, dan Salsa bermain di dekat gudang tua. Gudang itu sudah lama ditinggalkan pemiliknya. Pintunya berderit saat tertiup angin. Kata warga, tempat itu sering terdengar bunyi aneh.
Tiba-tiba terdengar bunyi lirih dari dalam. Bunyi itu seperti rintihan kecil yang berulang. Yuda mundur selangkah dengan wajah pucat. Salsa justru mendekat dan menempelkan telinga di dinding. Arif memegang senter dengan tangan gemetar.
"Kayaknya bukan hantu," bisik Salsa. "Itu seperti suara anak kucing." Ia mendorong pintu perlahan. Cahaya senter menyapu sudut gelap yang berdebu. Di balik tumpukan karung, sesuatu tampak bergerak-gerak.
Arif menelan ludah dan melangkah maju. Tiba-tiba hujan turun deras di luar. Atap seng berbunyi nyaring seperti tabuhan. Sesuatu di balik karung itu mengeong makin keras. Ketiga anak itu saling berpandangan.', NULL),
(170, 2, 'Teks 19 – Panggung Pertama Elsa', 'Elsa sudah berlatih piano selama tiga bulan. Setiap malam jarinya menari di atas tuts. Kini ia harus tampil pada pentas seni sekolah. Hatinya berdebar sejak pagi. Telapak tangannya dingin dan basah.
Di balik tirai, ia mengintip ratusan penonton yang duduk berderet. Ruang aula terasa penuh dan riuh. Elsa menggenggam lembaran not lagunya erat-erat. Nama peserta sebelumnya dipanggil satu per satu. Sebentar lagi giliran Elsa.
"Tarik napas dalam, Nak," bisik Bu Guru di sampingnya. "Kamu sudah siap." Elsa mengangguk kaku. Kakinya terasa lemas ketika melangkah ke panggung. Lampu sorot menyilaukan matanya.
Ia duduk di depan piano besar itu. Aula mendadak hening. Elsa menaruh jarinya di atas tuts. Bayangan lupa nada menyergap pikirannya. Ia memejamkan mata sejenak dan mengingat ibunya di kursi barisan depan.', NULL),
(171, 2, 'Teks 20 – Sepatu Lari Pandu', 'Babak final lari cepat 100 meter antar-SMP akan dimulai dalam lima belas menit. Pandu melakukan pemanasan ringan di lintasan kedua. Namun naas, saat melakukan hentakan awalan balok start, sol sepatu lari kanannya robek menganga. Pandu terhenyak lesu di rumput tepi lintasan. Ia tidak membawa sepatu cadangan, sementara toko olahraga terdekat berjarak tempuh tiga puluh menit.
Riki, rival terberat Pandu dari sekolah tetangga, mendekat seraya menenteng tas perlengkapannya. Riki baru saja menyelesaikan nomor lompat jauh dan melihat kepanikan Pandu.
"Pakai sepatuku ini, Ndu. Ukuran kaki kita sama-sama empat puluh dua," tawar Riki sambil menyodorkan sepasang sepatu berduri oranye miliknya. Pandu terperangah menatap wajah saingannya itu. "Tapi ini sepatu andalanmu untuk final estafet nanti sore, Rik?"
"Final estafet masih empat jam lagi. Kemenangan sejati adalah bertanding melawan kemampuan terbaikmu, bukan menang karena sepatumu jebol," jawab Riki tegas seraya menepuk bahu Pandu. Pandu menghela napas, rasa haru seketika menjalari dadanya.
────────────────────────────────────────', NULL),
(172, 2, 'Teks 20 – Sepatu Lari Pandu', 'Babak final lari cepat 100 meter antar-SMP akan dimulai dalam lima belas menit. Pandu melakukan pemanasan ringan di lintasan kedua. Namun naas, saat melakukan hentakan awalan balok start, sol sepatu lari kanannya robek menganga. Pandu terhenyak lesu di rumput tepi lintasan. Ia tidak membawa sepatu cadangan, sementara toko olahraga terdekat berjarak tempuh tiga puluh menit.
Riki, rival terberat Pandu dari sekolah tetangga, mendekat seraya menenteng tas perlengkapannya. Riki baru saja menyelesaikan nomor lompat jauh dan melihat kepanikan Pandu.
"Pakai sepatuku ini, Ndu. Ukuran kaki kita sama-sama empat puluh dua," tawar Riki sambil menyodorkan sepasang sepatu berduri oranye miliknya. Pandu terperangah menatap wajah saingannya itu. "Tapi ini sepatu andalanmu untuk final estafet nanti sore, Rik?"
"Final estafet masih empat jam lagi. Kemenangan sejati adalah bertanding melawan kemampuan terbaikmu, bukan menang karena sepatumu jebol," jawab Riki tegas seraya menepuk bahu Pandu. Pandu menghela napas, rasa haru seketika menjalari dadanya.', NULL),
(173, 2, 'Teks 21 – Layar Terkembang di Teluk Sunyi', 'Perahu kayu milik Hendra melaju tenang membelah perairan Teluk Sunyi. Nelayan muda itu tersenyum puas menyaksikan jaring penariknya mulai dipenuhi ikan tongkol berkilat perak. Hasil tangkapan hari ini berpotensi menjadi rekor terbaiknya sepanjang musim melaut.
Akan tetapi, saat hendak menebar jaring kedua, pandangan Hendra tertumbuk pada gumpalan awan kumulonimbus raksasa yang membubung pekat di batas cakrawala barat daya. Angin laut mendadak berbalik arah menjadi dingin dan menyengat, diiringi gulungan riak ombak yang meninggi.
Hendra teringat pesan mendiang ayahnya: jangan pernah menantang keangkuhan badai hanya demi ambisi memenuhi palka perahu. Jika memaksakan menebar jaring lagi, ia membutuhkan waktu minimal satu jam untuk menariknya kembali ke atas geladak.
Hendra menatap tumpukan jaring di tangannya, lalu beralih menatap langit barat yang kian menggelap pekat. Tanpa ragu lagi, tangannya mencengkeram tuas kemudi dan mulai menarik tali layar utama.', NULL),
(174, 2, '"Pesan yang Belum Selesai"', 'Raka menerima pesan di grup kelas bahwa sekolah akan diliburkan selama tiga hari karena ada perbaikan listrik. Ia hampir langsung meneruskannya kepada teman-temannya. Namun, ia teringat bahwa sebelumnya pernah beredar pesan palsu di grup tersebut. Raka kemudian bertanya kepada ketua kelas dan memeriksa pengumuman resmi sekolah. Ternyata, informasi itu benar, tetapi hanya untuk satu hari. Raka segera memberi tahu teman-temannya bahwa pesan sebelumnya tidak sepenuhnya benar.', NULL),
(175, 2, '"Poster Lomba"', 'Mira dan Sinta ditugaskan membuat poster untuk lomba kebersihan kelas. Mira ingin segera menyelesaikannya sendiri karena merasa idenya paling bagus. Sinta mengingatkan bahwa tugas itu diberikan kepada mereka berdua. Setelah berdiskusi, mereka membagi pekerjaan. Mira membuat ilustrasi, sedangkan Sinta menyusun informasi lomba. Poster selesai tepat waktu dan keduanya sepakat bahwa hasilnya lebih baik karena dikerjakan bersama.', NULL),
(176, 2, '"Suara dari Belakang Kelas"', 'Ketika presentasi berlangsung, Danu salah mengucapkan sebuah istilah. Beberapa teman menertawakannya. Danu sempat menunduk, tetapi kemudian memperbaiki ucapannya setelah mendapat masukan dari guru. Seusai presentasi, seorang teman meminta maaf karena ikut menertawakannya. Danu menerima permintaan maaf itu dan berkata bahwa kesalahan saat belajar merupakan hal yang wajar selama seseorang mau memperbaikinya.', NULL),
(177, 2, '"Suara dari Belakang Kelas"', 'Ketika presentasi berlangsung, Danu salah mengucapkan sebuah istilah. Beberapa teman menertawakannya. Danu sempat menunduk, tetapi kemudian memperbaiki ucapannya setelah mendapat masukan dari guru. Seusai presentasi, seorang teman meminta maaf karena ikut menertawakannya. Danu menerima permintaan maaf itu dan berkata bahwa kesalahan saat belajar merupakan hal yang wajar.', NULL),
(178, 2, '"Bangku Taman"', 'Setiap istirahat, siswa kelas VIII duduk di taman sekolah. Suatu hari mereka melihat beberapa bangku penuh coretan. Lani mengusulkan agar mereka melaporkannya kepada guru, bukan mencoret bagian lain untuk membalas. Setelah itu, kelas mereka membuat kegiatan sederhana untuk membersihkan taman dan memasang tulisan, “Gunakan dan Jaga Bersama.” Mereka berharap siswa lain ikut menjaga fasilitas sekolah.', NULL),
(179, 2, '"Bangku Taman"', 'Setiap istirahat, siswa kelas VIII duduk di taman sekolah. Suatu hari mereka melihat beberapa bangku penuh coretan. Lani mengusulkan agar mereka melaporkannya kepada guru, bukan mencoret bagian lain untuk membalas. Setelah itu, kelas mereka membuat kegiatan sederhana untuk membersihkan taman dan memasang tulisan, “Gunakan dan Jaga Bersama.” Mereka berharap siswa lain ikut menjaga fasilitas sekolah', NULL),
(180, 2, '"Dompet di Lapangan"', 'Sepulang olahraga, Bima menemukan dompet di dekat lapangan. Di dalamnya terdapat sejumlah uang dan kartu pelajar. Beberapa teman menyarankan agar uang itu digunakan untuk membeli makanan dan dompetnya dibuang. Bima menolak. Ia menyerahkan dompet tersebut kepada guru piket. Tidak lama kemudian, pemilik dompet datang dengan wajah lega karena uang itu akan digunakan untuk membayar kebutuhan sekolah.', NULL),
(181, 2, '"Pesan yang Belum Selesai"', 'Raka menerima pesan di grup kelas bahwa sekolah akan diliburkan selama tiga hari karena ada perbaikan listrik. Ia hampir langsung meneruskannya kepada teman-temannya. Namun, ia teringat bahwa sebelumnya pernah beredar pesan palsu di grup tersebut. Raka kemudian bertanya kepada ketua kelas dan memeriksa pengumuman resmi sekolah. Ternyata, informasi itu benar, tetapi hanya untuk satu hari. Raka segera memberi tahu teman-temannya bahwa pesan sebelumnya tidak sepenuhnya benar.

"Poster Lomba"

Mira dan Sinta ditugaskan membuat poster untuk lomba kebersihan kelas. Mira ingin segera menyelesaikannya sendiri karena merasa idenya paling bagus. Sinta mengingatkan bahwa tugas itu diberikan kepada mereka berdua. Setelah berdiskusi, mereka membagi pekerjaan. Mira membuat ilustrasi, sedangkan Sinta menyusun informasi lomba. Poster selesai tepat waktu dan keduanya sepakat bahwa hasilnya lebih baik karena dikerjakan bersama.

"Suara dari Belakang Kelas"

Ketika presentasi berlangsung, Danu salah mengucapkan sebuah istilah. Beberapa teman menertawakannya. Danu sempat menunduk, tetapi kemudian memperbaiki ucapannya setelah mendapat masukan dari guru. Seusai presentasi, seorang teman meminta maaf karena ikut menertawakannya. Danu menerima permintaan maaf itu dan berkata bahwa kesalahan saat belajar merupakan hal yang wajar selama seseorang mau memperbaikinya.

"Bangku Taman"

Setiap istirahat, siswa kelas VIII duduk di taman sekolah. Suatu hari mereka melihat beberapa bangku penuh coretan. Lani mengusulkan agar mereka melaporkannya kepada guru, bukan mencoret bagian lain untuk membalas. Setelah itu, kelas mereka membuat kegiatan sederhana untuk membersihkan taman dan memasang tulisan, “Gunakan dan Jaga Bersama.” Mereka berharap siswa lain ikut menjaga fasilitas sekolah

"Dompet di Lapangan"

Sepulang olahraga, Bima menemukan dompet di dekat lapangan. Di dalamnya terdapat sejumlah uang dan kartu pelajar. Beberapa teman menyarankan agar uang itu digunakan untuk membeli makanan dan dompetnya dibuang. Bima menolak. Ia menyerahkan dompet tersebut kepada guru piket. Tidak lama kemudian, pemilik dompet datang dengan wajah lega karena uang itu akan digunakan untuk membayar kebutuhan sekolah', NULL),
(182, 2, '"Pesan yang Belum Selesai"', 'Raka menerima pesan di grup kelas bahwa sekolah akan diliburkan selama tiga hari karena ada perbaikan listrik. Ia hampir langsung meneruskannya kepada teman-temannya. Namun, ia teringat bahwa sebelumnya pernah beredar pesan palsu di grup tersebut. Raka kemudian bertanya kepada ketua kelas dan memeriksa pengumuman resmi sekolah. Ternyata, informasi itu benar, tetapi hanya untuk satu hari. Raka segera memberi tahu teman-temannya bahwa pesan sebelumnya tidak sepenuhnya benar.

"Bangku Taman"

Setiap istirahat, siswa kelas VIII duduk di taman sekolah. Suatu hari mereka melihat beberapa bangku penuh coretan. Lani mengusulkan agar mereka melaporkannya kepada guru, bukan mencoret bagian lain untuk membalas. Setelah itu, kelas mereka membuat kegiatan sederhana untuk membersihkan taman dan memasang tulisan, “Gunakan dan Jaga Bersama.” Mereka berharap siswa lain ikut menjaga fasilitas sekolah', NULL),
(183, 2, 'P1 “Sepeda Tua” Nara menemukan sepeda tua milik ayahnya di g', 'P1 “Sepeda Tua” Nara menemukan sepeda tua milik ayahnya di gudang. Walaupun catnya mengelupas, sepeda itu masih dapat digunakan. Nara membersihkannya dan mengganti rantai yang rusak. Ia kemudian menggunakan sepeda tersebut ke perpustakaan.

P1 “Sepatu Lama” Reno menemukan sepatu olahraga lama di lemari. Solnya sudah sedikit terlepas, tetapi bagian lainnya masih baik. Ia memperbaikinya dengan bantuan ayahnya. Sepatu itu kemudian dipakai Reno untuk latihan.', NULL),
(184, 2, 'P2 “Hujan di Halaman” Hujan turun sejak sore', 'P2 “Hujan di Halaman” Hujan turun sejak sore. Sari berdiri di teras sambil memperhatikan halaman yang mulai dipenuhi genangan. Ia kemudian mengambil sapu lidi dan membersihkan saluran air yang tersumbat daun.

P2 “Pagi Berawan” Sejak pagi langit terlihat gelap. Dimas melihat beberapa daun memenuhi selokan di depan rumah. Ia mengambil tongkat kecil dan membersihkan saluran tersebut sebelum berangkat sekolah.', NULL),
(185, 2, 'P3 “Lukisan Rani” Rani kecewa ketika warna pada lukisannya b', 'P3 “Lukisan Rani” Rani kecewa ketika warna pada lukisannya bercampur. Ia hampir membuang kertas itu. Namun, setelah melihat kembali lukisannya, ia menemukan bahwa campuran warna tersebut justru membentuk bayangan yang menarik. Rani akhirnya melanjutkan lukisan itu.

P3 “Cerita Fajar” Fajar lupa memasukkan salah satu tokoh ketika menulis cerita. Ia sempat ingin menghapus seluruh tulisannya. Setelah membaca kembali cerita tersebut, ia menemukan cara memasukkan tokoh itu tanpa mengubah alur utama.', NULL),
(186, 2, 'P4 “Jembatan” Dara menyeberangi jembatan kecil setiap pulang', 'P4 “Jembatan” Dara menyeberangi jembatan kecil setiap pulang sekolah. Suatu hari jembatan itu rusak. Dara tidak memaksakan diri melewatinya. Ia memilih menggunakan jalan lain yang lebih jauh.

P4 “Jalan Licin” Bayu melihat jalan di depan rumahnya licin setelah hujan. Ia sebenarnya ingin segera pergi, tetapi memilih berjalan lebih lambat dan menggunakan jalan yang memiliki pegangan.', NULL),
(187, 2, 'P5 “Surat untuk Ibu” Aku menulis surat untuk Ibu malam ini', 'P5 “Surat untuk Ibu” Aku menulis surat untuk Ibu malam ini. Tidak panjang, hanya beberapa baris. Namun setiap kata terasa berat, sebab rindu ternyata tidak mudah ditulis.

P5 “Pesan Pagi” Pagi datang membawa cahaya. Aku membuka jendela dan tersenyum. Hari ini terasa ringan, seolah semua harapan kembali tumbuh.', NULL),
(188, 2, 'Pasangan P1', 'P1 “Sepeda Tua” Nara menemukan sepeda tua milik ayahnya di gudang. Walaupun catnya mengelupas, sepeda itu masih dapat digunakan. Nara membersihkannya dan mengganti rantai yang rusak. Ia kemudian menggunakan sepeda tersebut ke perpustakaan.

P1 “Sepatu Lama” Reno menemukan sepatu olahraga lama di lemari. Solnya sudah sedikit terlepas, tetapi bagian lainnya masih baik. Ia memperbaikinya dengan bantuan ayahnya. Sepatu itu kemudian dipakai Reno untuk latihan.', NULL),
(189, 2, 'Pasangan P2', 'P2 “Hujan di Halaman” Hujan turun sejak sore. Sari berdiri di teras sambil memperhatikan halaman yang mulai dipenuhi genangan. Ia kemudian mengambil sapu lidi dan membersihkan saluran air yang tersumbat daun.

P2 “Pagi Berawan” Sejak pagi langit terlihat gelap. Dimas melihat beberapa daun memenuhi selokan di depan rumah. Ia mengambil tongkat kecil dan membersihkan saluran tersebut sebelum berangkat sekolah.

Pasangan P4

P4 “Jembatan” Dara menyeberangi jembatan kecil setiap pulang sekolah. Suatu hari jembatan itu rusak. Dara tidak memaksakan diri melewatinya. Ia memilih menggunakan jalan lain yang lebih jauh.

P4 “Jalan Licin” Bayu melihat jalan di depan rumahnya licin setelah hujan. Ia sebenarnya ingin segera pergi, tetapi memilih berjalan lebih lambat dan menggunakan jalan yang memiliki pegangan.', NULL),
(190, 2, 'Pasangan P3', 'P3 “Lukisan Rani” Rani kecewa ketika warna pada lukisannya bercampur. Ia hampir membuang kertas itu. Namun, setelah melihat kembali lukisannya, ia menemukan bahwa campuran warna tersebut justru membentuk bayangan yang menarik. Rani akhirnya melanjutkan lukisan itu.

P3 “Cerita Fajar” Fajar lupa memasukkan salah satu tokoh ketika menulis cerita. Ia sempat ingin menghapus seluruh tulisannya. Setelah membaca kembali cerita tersebut, ia menemukan cara memasukkan tokoh itu tanpa mengubah alur utama.

Pasangan P4

P4 “Jembatan” Dara menyeberangi jembatan kecil setiap pulang sekolah. Suatu hari jembatan itu rusak. Dara tidak memaksakan diri melewatinya. Ia memilih menggunakan jalan lain yang lebih jauh.

P4 “Jalan Licin” Bayu melihat jalan di depan rumahnya licin setelah hujan. Ia sebenarnya ingin segera pergi, tetapi memilih berjalan lebih lambat dan menggunakan jalan yang memiliki pegangan.', NULL),
(191, 2, 'Pasangan P1', 'P1 “Sepeda Tua” Nara menemukan sepeda tua milik ayahnya di gudang. Walaupun catnya mengelupas, sepeda itu masih dapat digunakan. Nara membersihkannya dan mengganti rantai yang rusak. Ia kemudian menggunakan sepeda tersebut ke perpustakaan.

P1 “Sepatu Lama” Reno menemukan sepatu olahraga lama di lemari. Solnya sudah sedikit terlepas, tetapi bagian lainnya masih baik. Ia memperbaikinya dengan bantuan ayahnya. Sepatu itu kemudian dipakai Reno untuk latihan.

Pasangan P3

P3 “Lukisan Rani” Rani kecewa ketika warna pada lukisannya bercampur. Ia hampir membuang kertas itu. Namun, setelah melihat kembali lukisannya, ia menemukan bahwa campuran warna tersebut justru membentuk bayangan yang menarik. Rani akhirnya melanjutkan lukisan itu.

P3 “Cerita Fajar” Fajar lupa memasukkan salah satu tokoh ketika menulis cerita. Ia sempat ingin menghapus seluruh tulisannya. Setelah membaca kembali cerita tersebut, ia menemukan cara memasukkan tokoh itu tanpa mengubah alur utama.', NULL),
(192, 2, '"Kursi Kosong"', 'Sejak pagi, kursi di sebelah Arga tetap kosong. Biasanya, Rian selalu duduk di sana dan mengajaknya berbicara sebelum pelajaran dimulai. Hari itu Arga baru mengetahui bahwa Rian harus pindah mengikuti orang tuanya ke kota lain. Sepulang sekolah, Arga memandang kursi tersebut beberapa saat. Ia tersenyum kecil ketika menemukan secarik kertas di bawah meja: “Jangan berhenti bercerita. Suatu hari kita akan bertemu lagi.”

Respons emosional yang paling sesuai setelah membaca Teks', NULL),
(193, 2, '"Kursi Kosong"', 'Sejak pagi, kursi di sebelah Arga tetap kosong. Biasanya, Rian selalu duduk di sana dan mengajaknya berbicara sebelum pelajaran dimulai. Hari itu Arga baru mengetahui bahwa Rian harus pindah mengikuti orang tuanya ke kota lain. Sepulang sekolah, Arga memandang kursi tersebut beberapa saat. Ia tersenyum kecil ketika menemukan secarik kertas di bawah meja: “Jangan berhenti bercerita. Suatu hari kita akan bertemu lagi.”', NULL),
(194, 2, '"Kursi Kosong"', 'Sejak pagi, kursi di sebelah Arga tetap kosong. Biasanya, Rian selalu duduk di sana dan mengajaknya berbicara sebelum pelajaran dimulai. Hari itu Arga baru mengetahui bahwa Rian harus pindah mengikuti orang tuanya ke kota lain. Sepulang sekolah, Arga memandang kursi tersebut beberapa saat. Ia tersenyum kecil ketika menemukan secarik kertas di bawah meja: “Jangan berhenti bercerita. Suatu hari kita akan bertemu lagi.”

Respons emosional yang dapat muncul secara wajar setelah', NULL),
(195, 2, '"Lampu di Rumah Nenek"', 'Malam itu listrik di kampung padam. Sinta membawa lampu kecil ke rumah neneknya yang tinggal sendirian. Nenek awalnya menolak karena tidak ingin merepotkan cucunya. Sinta tetap tinggal sampai listrik menyala kembali. Ketika lampu rumah akhirnya menyala, nenek menggenggam tangan Sinta sambil berkata, “Kamu membuat malam ini tidak terasa panjang.”

Respons emosional yang tepat terhadap tindakan Sinta dalam', NULL),
(196, 2, '"Lampu di Rumah Nenek"', 'Malam itu listrik di kampung padam. Sinta membawa lampu kecil ke rumah neneknya yang tinggal sendirian. Nenek awalnya menolak karena tidak ingin merepotkan cucunya. Sinta tetap tinggal sampai listrik menyala kembali. Ketika lampu rumah akhirnya menyala, nenek menggenggam tangan Sinta sambil berkata, “Kamu membuat malam ini tidak terasa panjang.”', NULL),
(197, 2, '"Burung dalam Sangkar"', 'Seekor burung kecil selalu bernyanyi di dalam sangkar milik seorang anak. Suatu hari, anak itu membuka pintu sangkar. Burung tersebut tidak langsung terbang. Ia berdiri di ambang pintu seolah ragu. Setelah beberapa saat, burung itu mengepakkan sayap dan terbang menuju pohon di halaman. Anak itu memandangnya sampai burung tersebut tidak terlihat lagi.', NULL),
(198, 2, 'Puisi “Pagi Setelah Hujan”', 'Hujan telah pergi, meninggalkan kaca yang bening. Di ujung daun, cahaya menggantung, dan jalan basah memantulkan langit. Aku membuka jendela perlahan, menghirup udara yang baru, seolah hari memberiku kesempatan untuk memulai lagi.', NULL),
(199, 2, '"Pilihan Naya"', 'Naya melihat dua temannya berselisih karena salah memahami sebuah pesan. Keduanya meminta Naya memilih pihak. Naya membaca kembali pesan tersebut dan menyadari bahwa kata-katanya memang dapat ditafsirkan berbeda. Ia mengajak kedua temannya berbicara langsung. Setelah mengetahui maksud sebenarnya, keduanya menyadari bahwa pertengkaran itu tidak perlu terjadi.', NULL),
(200, 2, '"Kursi Kosong"', 'Sejak pagi, kursi di sebelah Arga tetap kosong. Biasanya, Rian selalu duduk di sana dan mengajaknya berbicara sebelum pelajaran dimulai. Hari itu Arga baru mengetahui bahwa Rian harus pindah mengikuti orang tuanya ke kota lain. Sepulang sekolah, Arga memandang kursi tersebut beberapa saat. Ia tersenyum kecil ketika menemukan secarik kertas di bawah meja: “Jangan berhenti bercerita. Suatu hari kita akan bertemu lagi.”

"Pilihan Naya"

Naya melihat dua temannya berselisih karena salah memahami sebuah pesan. Keduanya meminta Naya memilih pihak. Naya membaca kembali pesan tersebut dan menyadari bahwa kata-katanya memang dapat ditafsirkan berbeda. Ia mengajak kedua temannya berbicara langsung. Setelah mengetahui maksud sebenarnya, keduanya menyadari bahwa pertengkaran itu tidak perlu terjadi.', NULL)
ON DUPLICATE KEY UPDATE 
    `subject_id` = VALUES(`subject_id`), 
    `title` = VALUES(`title`), 
    `stimulus_text` = VALUES(`stimulus_text`), 
    `stimulus_image_url` = VALUES(`stimulus_image_url`);

-- -----------------------------------------------------------------------------
-- 2. PEMBENIHAN BANK SOAL (QUESTION_BANKS - 361 Soal, ID 181..541)
-- -----------------------------------------------------------------------------
INSERT INTO `question_banks` (`id`, `subject_id`, `sub_material_id`, `cognitive_level_id`, `stimulus_id`, `bank_type`, `question_format`, `question_text`, `stimulus_image_url`, `is_active`) VALUES
(181, 2, 11, 1, 38, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Makna istilah \'algoritma\' pada teks tersebut adalah...', NULL, TRUE),
(182, 2, 11, 1, 38, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Kata \'efisiensi\' bersinonim dengan kata...', NULL, TRUE),
(183, 2, 11, 1, 39, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Apa makna kata \'limbah\' pada kalimat pertama?', NULL, TRUE),
(184, 2, 11, 1, 39, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Makna kata \'terdegradasi\' sesuai konteks kalimat adalah...', NULL, TRUE),
(185, 2, 11, 1, 40, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Kata \'imunitas\' memiliki arti...', NULL, TRUE),
(186, 2, 11, 1, 40, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Arti kata \'proporsional\' pada kalimat terakhir adalah...', NULL, TRUE),
(187, 2, 11, 1, 41, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Makna istilah "ekstrak" yang digunakan pada paragraf tersebut adalah...', NULL, TRUE),
(188, 2, 11, 1, 41, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Istilah "khasiat" pada kalimat terakhir di teks tersebut bersinonim atau memiliki arti yang sama dengan kata...', NULL, TRUE),
(189, 2, 11, 1, 42, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Istilah \'inflasi\' dalam teks memiliki arti...', NULL, TRUE),
(190, 2, 11, 1, 42, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Frasa \'daya beli\' pada teks tersebut merujuk pada...', NULL, TRUE),
(191, 2, 11, 1, 43, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Arti dari kata \'konstelasi\' adalah...', NULL, TRUE),
(192, 2, 11, 1, 43, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Kata \'gravitasi\' dalam kalimat bermakna...', NULL, TRUE),
(193, 2, 11, 1, 44, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Istilah \'harmoni\' dalam konteks musik bermakna...', NULL, TRUE),
(194, 2, 11, 1, 44, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Makna kata \'maestro\' pada teks tersebut adalah...', NULL, TRUE),
(195, 2, 11, 1, 45, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Makna kata \'siluet\' pada kalimat pertama adalah...', NULL, TRUE),
(196, 2, 11, 1, 45, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Kata \'terkuak\' pada kalimat terakhir memiliki arti...', NULL, TRUE),
(197, 2, 11, 1, 46, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Istilah \'erupsi\' berarti...', NULL, TRUE),
(198, 2, 11, 1, 46, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Makna istilah \'mitigasi\' pada kalimat terakhir adalah...', NULL, TRUE),
(199, 2, 11, 1, 47, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Kata \'stamina\' dalam kalimat tersebut merujuk pada...', NULL, TRUE),
(200, 2, 11, 1, 47, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Istilah \'sportivitas\' mengandung makna...', NULL, TRUE),
(201, 2, 11, 2, 48, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Di kota manakah Candi Borobudur berada berdasarkan teks?', NULL, TRUE),
(202, 2, 11, 2, 48, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Pada abad ke berapakah Candi Borobudur dibangun?', NULL, TRUE),
(203, 2, 11, 2, 48, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Siapa yang membangun Candi Borobudur menurut teks?', NULL, TRUE),
(204, 2, 11, 2, 49, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Di provinsi manakah letak Gunung Bromo berdasarkan teks tersebut?', NULL, TRUE),
(205, 2, 11, 2, 49, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Kendaraan apa yang biasanya disewa oleh para pengunjung untuk berkeliling di lautan pasir?', NULL, TRUE),
(206, 2, 11, 2, 49, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Siapakah nama suku asli yang mendiami wilayah sekitar Gunung Bromo?', NULL, TRUE),
(207, 2, 11, 2, 50, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Fungsi utama akar hutan mangrove menurut teks adalah...', NULL, TRUE),
(208, 2, 11, 2, 50, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Bencana alam apa yang gelombangnya dapat dipecah oleh mangrove?', NULL, TRUE),
(209, 2, 11, 2, 50, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Hewan apa saja yang menjadikan hutan mangrove sebagai habitatnya?', NULL, TRUE),
(210, 2, 11, 2, 51, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Apa yang dimaksud dengan pemanasan global menurut teks?', NULL, TRUE),
(211, 2, 11, 2, 51, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Salah satu penyebab utama pemanasan global adalah...', NULL, TRUE),
(212, 2, 11, 2, 51, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Berikut ini yang merupakan dampak pemanasan global sesuai teks, KECUALI...', NULL, TRUE),
(213, 2, 11, 2, 52, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Kebijakan apa yang sedang digalakkan oleh pemerintah kota berdasarkan teks?', NULL, TRUE),
(214, 2, 11, 2, 52, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Apa tujuan utama dari kebijakan penggunaan tas kain tersebut?', NULL, TRUE),
(215, 2, 11, 2, 52, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Apa yang terjadi jika pembeli tidak membawa tas sendiri di pasar swalayan saat ini?', NULL, TRUE),
(216, 2, 11, 2, 53, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Apa yang terjadi pada warna kulit buah pisang ketika sudah matang?', NULL, TRUE),
(217, 2, 11, 2, 53, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Berdasarkan teks, apa fungsi utama dari tingginya kandungan kalium pada buah pisang?', NULL, TRUE),
(218, 2, 11, 2, 53, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Bagian dari tanaman pisang yang sering dimanfaatkan sebagai pembungkus makanan adalah...', NULL, TRUE),
(219, 2, 11, 2, 54, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Mengapa sarapan disebut sebagai waktu makan paling penting?', NULL, TRUE),
(220, 2, 11, 2, 54, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Apa manfaat rutin sarapan bagi anak-anak sekolah?', NULL, TRUE),
(221, 2, 11, 3, 55, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Jika proses pada teks di atas dibuat menjadi bagan alur, urutan yang tepat adalah...', NULL, TRUE),
(222, 2, 11, 3, 55, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Tahapan yang menempati kotak kedua dalam kerangka proses siklus air tersebut adalah...', NULL, TRUE),
(223, 2, 11, 3, 55, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Kerangka gagasan pokok dari teks tersebut secara berurutan adalah...', NULL, TRUE),
(224, 2, 11, 3, 56, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Kerangka waktu berurutan peristiwa Kongres Pemuda II adalah...', NULL, TRUE),
(225, 2, 11, 3, 56, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Jika disusun dalam bagan topik rapat, urutan yang tepat dari rapat pertama hingga ketiga adalah...', NULL, TRUE),
(226, 2, 11, 3, 56, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Topik yang menempati urutan kerangka bagian tengah (rapat kedua) adalah...', NULL, TRUE),
(227, 2, 11, 3, 57, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Jika instruksi di atas dibuat bagan langkah-langkah, tahapan pertama dan kedua secara berurutan adalah...', NULL, TRUE),
(228, 2, 11, 3, 57, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Berdasarkan kerangka prosedur, apa langkah yang harus dilakukan setelah membalut telur dengan adonan?', NULL, TRUE),
(229, 2, 11, 3, 57, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Langkah persiapan bahan (membuat adonan abu) berada pada urutan ke berapa dalam teks?', NULL, TRUE),
(230, 2, 11, 3, 58, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Bagan daur hidup kupu-kupu yang benar berdasarkan teks adalah...', NULL, TRUE),
(231, 2, 11, 3, 58, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Dalam kerangka teks, informasi yang dijelaskan setelah fase larva (ulat) adalah...', NULL, TRUE),
(232, 2, 11, 3, 59, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Jika dibuat kerangka waktu, fase di mana hewan tersebut \'berpuasa dan beristirahat\' berada pada tahap ke...', NULL, TRUE),
(233, 2, 11, 3, 60, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Kerangka spasial (keruangan) pembagian area TMII dari depan ke belakang adalah...', NULL, TRUE),
(234, 2, 11, 3, 60, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Jika Anda menyusun bagan wisata, objek wisata apa yang berada di area tengah?', NULL, TRUE),
(235, 2, 11, 3, 60, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Bagian penutup dari kerangka deskripsi area TMII menjelaskan tentang...', NULL, TRUE),
(236, 2, 11, 3, 61, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Berdasarkan teks, urutan menggosok tangan yang tepat setelah memakai sabun adalah...', NULL, TRUE),
(237, 2, 11, 3, 61, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Dalam kerangka panduan, apa yang harus dilakukan sebelum membilas dengan air?', NULL, TRUE),
(238, 2, 11, 3, 61, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Langkah paling akhir (penutup alur) dalam proses mencuci tangan tersebut adalah...', NULL, TRUE),
(239, 2, 11, 3, 62, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Susunan tingkatan Candi Borobudur dari bawah ke atas adalah...', NULL, TRUE),
(240, 2, 11, 3, 62, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Jika dibuat kerangka gagasan, makna tingkatan tengah (Rupadhatu) adalah...', NULL, TRUE),
(241, 2, 12, 1, 63, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Simpulan yang paling tepat untuk menggambarkan keseluruhan isi teks adalah …', NULL, TRUE),
(242, 2, 12, 1, 63, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Informasi manakah yang paling kuat mendukung kesimpulan bahwa manfaat kebun tidak hanya berasal dari keberadaan tanaman, tetapi juga dari cara kebun dikelola?', NULL, TRUE),
(243, 2, 12, 1, 63, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'PGK MCMA. Pilih semua pernyataan yang dapat disimpulkan secara tersirat dari teks.', NULL, TRUE),
(244, 2, 12, 1, 63, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Jika sekolah mengabaikan jadwal perawatan setelah kebun diperluas, kesimpulan yang paling logis berdasarkan pengalaman pada teks adalah …', NULL, TRUE),
(245, 2, 12, 1, 64, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Simpulan yang paling tepat tentang program membawa tumbler adalah …', NULL, TRUE),
(246, 2, 12, 1, 64, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Gagasan tersirat yang dapat disimpulkan dari keputusan tidak langsung menghapus minuman kemasan adalah …', NULL, TRUE),
(247, 2, 12, 1, 64, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'PGK MCMA. Pernyataan yang dapat disimpulkan dari teks adalah …', NULL, TRUE),
(248, 2, 12, 1, 64, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Kesimpulan yang paling tepat mengenai rencana evaluasi setelah satu semester adalah …', NULL, TRUE),
(249, 2, 12, 1, 65, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Simpulan utama yang paling tepat dari teks perpustakaan digital adalah …', NULL, TRUE),
(250, 2, 12, 1, 65, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Mengapa peningkatan jumlah peminjaman belum dapat langsung disimpulkan sebagai tanda bahwa layanan sudah berhasil sepenuhnya?', NULL, TRUE),
(251, 2, 12, 1, 65, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'PGK MCMA. Kesimpulan yang dapat ditarik dari teks adalah …', NULL, TRUE),
(252, 2, 12, 1, 65, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Jika pelatihan lanjutan dihentikan sementara, kesimpulan yang paling masuk akal adalah …', NULL, TRUE),
(253, 2, 12, 1, 66, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Simpulan yang paling tepat tentang upaya mengurangi sisa makanan adalah …', NULL, TRUE),
(254, 2, 12, 1, 66, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Apa gagasan tersirat yang menjelaskan mengapa porsi kecil dapat menjadi solusi?', NULL, TRUE),
(255, 2, 12, 1, 66, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'PGK MCMA. Pernyataan yang dapat disimpulkan adalah …', NULL, TRUE),
(256, 2, 12, 1, 66, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Jika kantin kembali menyediakan hanya porsi besar, prediksi kesimpulan yang paling logis adalah …', NULL, TRUE),
(257, 2, 12, 1, 67, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Simpulan paling tepat dari penggunaan lampu jalan tenaga surya dalam teks adalah …', NULL, TRUE),
(258, 2, 12, 1, 67, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Mengapa pemerintah daerah belum langsung memasang lampu serupa di semua jalan?', NULL, TRUE),
(259, 2, 12, 1, 67, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'PGK MCMA. Kesimpulan yang dapat ditarik dari pengalaman pemasangan lampu adalah …', NULL, TRUE),
(260, 2, 12, 1, 67, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Jika data menunjukkan biaya perawatan jauh lebih tinggi daripada perkiraan, kesimpulan yang paling mungkin diambil pemerintah adalah …', NULL, TRUE),
(261, 2, 12, 2, 68, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Mengapa penurunan volume air embung menjadi lebih terkendali setelah kelompok tani membuat jadwal pengambilan air?', NULL, TRUE),
(262, 2, 12, 2, 68, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Apa hubungan logis antara kapasitas embung yang terbatas dan aturan pembagian air?', NULL, TRUE),
(263, 2, 12, 2, 68, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'PGK MCMA. Pernyataan yang menjelaskan hubungan sebab-akibat dalam teks adalah …', NULL, TRUE),
(264, 2, 12, 2, 68, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Jika petani kembali mengambil air tanpa perencanaan, hubungan yang paling mungkin terjadi adalah …', NULL, TRUE),
(265, 2, 12, 2, 69, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Mengapa guru meminta prosedur pemasangan elektroda dan penggunaan alat ukur diperiksa kembali?', NULL, TRUE),
(266, 2, 12, 2, 69, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Apa hubungan antara prosedur yang diseragamkan dan kesimpulan yang lebih hati-hati?', NULL, TRUE),
(267, 2, 12, 2, 69, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'PGK MCMA. Hubungan logis yang dapat dijelaskan dari teks adalah …', NULL, TRUE),
(268, 2, 12, 2, 69, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Mengapa laporan siswa perlu memisahkan hasil pengamatan dari dugaan penyebab?', NULL, TRUE),
(269, 2, 12, 2, 70, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Mengapa jumlah pesepeda meningkat setelah titik berkumpul dan aturan keselamatan dibuat?', NULL, TRUE),
(270, 2, 12, 2, 70, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Apa hubungan antara hujan deras dan menurunnya jumlah pesepeda?', NULL, TRUE),
(271, 2, 12, 2, 70, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'PGK MCMA. Pilih pernyataan yang menjelaskan hubungan logis dalam teks.', NULL, TRUE),
(272, 2, 12, 2, 70, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Mengapa sekolah tidak menganggap turunnya jumlah pesepeda saat hujan sebagai kegagalan program?', NULL, TRUE),
(273, 2, 12, 2, 71, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Mengapa penyuluh meminta warga tidak langsung memasukkan ikan asing ke kolam budidaya?', NULL, TRUE),
(274, 2, 12, 2, 71, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Apa hubungan antara pemeriksaan jenis ikan dan keputusan warga memisahkannya dari kolam utama?', NULL, TRUE),
(275, 2, 12, 2, 71, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'PGK MCMA. Hubungan logis yang sesuai dengan teks adalah …', NULL, TRUE),
(276, 2, 12, 2, 71, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Mengapa warga tidak diminta langsung memusnahkan ikan tersebut?', NULL, TRUE),
(277, 2, 12, 2, 72, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Mengapa peneliti mengubah cara pengambilan sampel setelah menemukan partikel pada air hujan?', NULL, TRUE),
(278, 2, 12, 2, 72, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Apa hubungan antara metode identifikasi yang sesuai dan kesimpulan tentang mikroplastik?', NULL, TRUE),
(279, 2, 12, 2, 72, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'PGK MCMA. Pernyataan yang menjelaskan hubungan logis dalam teks adalah …', NULL, TRUE),
(280, 2, 12, 2, 72, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Mengapa guru meminta siswa membedakan fakta, dugaan, dan pertanyaan yang belum terjawab?', NULL, TRUE),
(281, 2, 12, 3, 73, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Jika hasil pengamatan berikutnya menunjukkan tanaman tetap tumbuh baik dengan penggunaan air yang wajar, tindakan yang paling mungkin dilakukan sekolah adalah …', NULL, TRUE),
(282, 2, 12, 3, 73, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Jika data dari beberapa musim tetap menunjukkan suhu area taman lebih rendah, prediksi yang paling logis adalah …', NULL, TRUE),
(283, 2, 12, 3, 73, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'PGK MCMA. Prediksi yang didukung oleh informasi dalam teks adalah …', NULL, TRUE),
(284, 2, 12, 3, 73, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Jika biaya perawatan ternyata terlalu tinggi meskipun suhu atap menurun, keputusan yang paling mungkin adalah …', NULL, TRUE),
(285, 2, 12, 3, 74, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Jika jumlah pengguna bus tetap meningkat dan ketepatan waktu membaik, apa yang paling mungkin dipertimbangkan sekolah?', NULL, TRUE),
(286, 2, 12, 3, 74, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Jika satu bus kembali mengalami kerusakan dan tidak tersedia kendaraan cadangan, kemungkinan dampak yang paling masuk akal adalah …', NULL, TRUE),
(287, 2, 12, 3, 74, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'PGK MCMA. Prediksi yang didukung teks adalah …', NULL, TRUE),
(288, 2, 12, 3, 74, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Jika rute baru ternyata membuat waktu perjalanan lebih lama bagi sebagian besar siswa, tindakan yang paling mungkin dilakukan adalah …', NULL, TRUE),
(289, 2, 12, 3, 75, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Jika catatan membaca singkat membuat siswa tetap membaca secara konsisten tanpa merasa terbebani, apa yang paling mungkin dilakukan sekolah?', NULL, TRUE),
(290, 2, 12, 3, 75, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Jika hasil survei menunjukkan minat baca meningkat tetapi partisipasi dalam program menurun, langkah yang paling logis adalah …', NULL, TRUE),
(291, 2, 12, 3, 75, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'PGK MCMA. Prediksi yang masuk akal berdasarkan teks adalah …', NULL, TRUE),
(292, 2, 12, 3, 75, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Jika catatan ringkas justru membuat siswa merasa terbebani, perubahan yang paling mungkin dilakukan sekolah adalah …', NULL, TRUE),
(293, 2, 12, 3, 76, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Jika data menunjukkan penggunaan air hidroponik wajar, biaya listrik terjangkau, dan tanaman tetap sehat dalam jangka panjang, apa yang paling mungkin dilakukan sekolah?', NULL, TRUE),
(294, 2, 12, 3, 76, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Jika kebutuhan perawatan ternyata terlalu tinggi, prediksi yang paling tepat adalah …', NULL, TRUE),
(295, 2, 12, 3, 76, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'PGK MCMA. Prediksi yang didukung oleh teks adalah …', NULL, TRUE),
(296, 2, 12, 3, 76, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Jika kebocoran pipa muncul kembali setelah beberapa bulan, tindakan yang paling mungkin dilakukan tim adalah …', NULL, TRUE),
(297, 2, 12, 3, 77, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Jika pencatatan rutin menunjukkan pola kenaikan air yang serupa di titik lain, apa yang paling mungkin dilakukan kelurahan?', NULL, TRUE),
(298, 2, 12, 3, 77, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Jika saluran kembali tersumbat sebelum hujan berikutnya, peristiwa yang paling mungkin terjadi berdasarkan pola dalam teks adalah …', NULL, TRUE),
(299, 2, 12, 3, 77, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'PGK MCMA. Prediksi yang didukung oleh teks adalah …', NULL, TRUE),
(300, 2, 12, 3, 77, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Jika pencatatan dilakukan tidak konsisten, dampak yang paling mungkin terhadap evaluasi kelurahan adalah …', NULL, TRUE),
(301, 2, 13, 1, 78, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Manakah tindakan dalam kehidupan sehari-hari yang paling relevan dengan isi teks di atas?', NULL, TRUE),
(302, 2, 13, 1, 79, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Berdasarkan wacana tersebut, manakah perilaku masyarakat perkotaan yang mencerminkan penerapan isi teks? (Pilih semua jawaban yang benar)', NULL, TRUE),
(303, 2, 13, 1, 80, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Sikap seorang siswa yang relevan dengan pesan teks tersebut adalah ...', NULL, TRUE),
(304, 2, 13, 1, 81, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Peristiwa dalam kehidupan sehari-hari yang relevan dengan upaya penyelesaian masalah pada teks adalah ...', NULL, TRUE),
(305, 2, 13, 1, 82, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Manakah kejadian sehari-hari yang relevan dengan isi teks di atas? (Pilih semua jawaban yang benar)', NULL, TRUE),
(306, 2, 13, 1, 83, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Kebiasaan sehari-hari yang paling tepat diubah berdasarkan informasi tersebut adalah ...', NULL, TRUE),
(307, 2, 13, 1, 84, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Manakah perilaku di lingkungan sekolah yang relevan dengan prinsip efisiensi air dalam teks?', NULL, TRUE),
(308, 2, 13, 1, 85, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Manakah tindakan yang relevan dengan informasi tersebut? (Pilih semua jawaban yang benar)', NULL, TRUE),
(309, 2, 13, 1, 86, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Manakah kegiatan siswa di luar jam sekolah yang sesuai dengan rekomendasi teks?', NULL, TRUE),
(310, 2, 13, 1, 87, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Tindakan di rumah yang paling mendukung penerapan sistem dalam teks adalah ...', NULL, TRUE),
(311, 2, 13, 1, 88, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Manakah kebiasaan masyarakat yang sesuai dengan ajakan teks di atas? (Pilih semua jawaban yang benar)', NULL, TRUE),
(312, 2, 13, 1, 89, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Tindakan yang paling relevan dilakukan saat menerima pesan berantai di grup media sosial adalah ...', NULL, TRUE),
(313, 2, 13, 1, 90, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Manakah aktivitas warga desa yang sangat sesuai dengan teks tersebut?', NULL, TRUE),
(314, 2, 13, 1, 91, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Manakah kegiatan masyarakat yang relevan untuk menanggulangi bahaya tersebut? (Pilih semua jawaban yang benar)', NULL, TRUE),
(315, 2, 13, 1, 92, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Langkah nyata yang paling sesuai dengan teks di atas dalam kehidupan rumah tangga adalah ...', NULL, TRUE),
(316, 2, 13, 1, 93, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Kebiasaan sekolah yang paling relevan dengan pesan kesehatan wacana tersebut adalah ...', NULL, TRUE),
(317, 2, 13, 1, 94, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Manakah penerapan di sekolah yang mendukung gerakan paperless tersebut? (Pilih semua jawaban yang benar)', NULL, TRUE),
(318, 2, 13, 1, 95, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Perilaku remaja yang menunjukkan kepedulian terhadap isu dalam teks adalah ...', NULL, TRUE),
(319, 2, 13, 1, 96, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Manakah menu sarapan di rumah yang relevan dengan ide diversifikasi pangan tersebut?', NULL, TRUE),
(320, 2, 13, 1, 97, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Aktivitas akhir pekan yang relevan dengan isi wacana di atas adalah ... (Pilih semua jawaban yang benar)', NULL, TRUE),
(321, 2, 13, 2, 98, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Berdasarkan perbandingan kedua teks, kesamaan informasi yang paling akurat adalah ...', NULL, TRUE),
(322, 2, 13, 2, 99, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Manakah pernyataan yang sesuai dengan perbandingan kedua teks di atas? (Pilih semua jawaban yang benar)', NULL, TRUE),
(323, 2, 13, 2, 100, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Manakah evaluasi yang paling tepat terkait ketidaksesuaian fasilitas di taman tersebut?', NULL, TRUE),
(324, 2, 13, 2, 101, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Penggunaan konjungsi antarparagraf/antarkalimat penekanan dalam teks di atas sudah sesuai karena ...', NULL, TRUE),
(325, 2, 13, 2, 102, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Manakah kesimpulan analisis kesesuaian isi kedua teks di atas? (Pilih semua jawaban yang benar)', NULL, TRUE),
(326, 2, 13, 2, 103, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Manakah makna denotatif yang paling tepat untuk istilah teknis "emisi" dalam teks informasi tersebut?', NULL, TRUE),
(327, 2, 13, 2, 104, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Bagaimanakah tingkat keakuratan informasi antara Teks A dan Teks B?', NULL, TRUE),
(328, 2, 13, 2, 105, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Manakah unsur kebahasaan yang sesuai dengan ciri teks informasi di atas? (Pilih semua jawaban yang benar)', NULL, TRUE),
(329, 2, 13, 2, 106, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Penilaian yang tepat terhadap kesesuaian judul wacana jika judul yang diberikan adalah "Cara Merawat Panel Surya di Rumah" adalah ...', NULL, TRUE),
(330, 2, 13, 2, 107, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Bagaimanakah kesesuaian fungsi konjungsi antarkalimat "Akan tetapi" pada kalimat (2)?', NULL, TRUE),
(331, 2, 13, 2, 108, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Manakah pernyataan kesesuaian fakta yang benar berdasarkan kedua teks di atas? (Pilih semua jawaban yang benar)', NULL, TRUE),
(332, 2, 13, 2, 109, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Manakah ilustrasi pelaksanaan yang paling sesuai dengan penjelasan metode dalam teks?', NULL, TRUE),
(333, 2, 13, 2, 110, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Keakuratan informasi tersebut didukung oleh argumen bahwa ...', NULL, TRUE),
(334, 2, 13, 2, 111, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Manakah poin kesesuaian antara Berita A dan Berita B? (Pilih semua jawaban yang benar)', NULL, TRUE),
(335, 2, 13, 2, 112, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Manakah pernyataan yang tidak sesuai dengan isi wacana di atas?', NULL, TRUE),
(336, 2, 13, 2, 113, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Penggunaan kata hubung "Sebaliknya" dalam wacana di atas sudah tepat karena berfungsi ...', NULL, TRUE),
(337, 2, 13, 2, 114, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Manakah pernyataan kesesuaian hubungan antar teks yang benar? (Pilih semua jawaban yang benar)', NULL, TRUE),
(338, 2, 13, 2, 115, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Manakah istilah teknis dan definisinya yang sesuai berdasarkan teks di atas?', NULL, TRUE),
(339, 2, 13, 2, 116, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Manakah informasi yang paling akurat sesuai wacana tersebut?', NULL, TRUE),
(340, 2, 13, 2, 117, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Manakah bentuk kesesuaian antara Teks A dan Teks B? (Pilih semua jawaban yang benar)', NULL, TRUE),
(341, 2, 13, 3, 118, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Respons emosional yang paling dominan muncul pada diri pembaca setelah membaca fakta dalam teks informasi tersebut adalah ...', NULL, TRUE),
(342, 2, 13, 3, 119, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Manakah respons emosional dan afektif pembaca yang sesuai saat membaca informasi di atas? (Pilih semua jawaban yang benar)', NULL, TRUE),
(343, 2, 13, 3, 120, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Perasaan yang terunggah pada pembaca saat mengapresiasi berita musibah dalam teks informasi tersebut adalah ...', NULL, TRUE),
(344, 2, 13, 3, 121, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Bagaimanakah respons emosional yang tepat dari pembaca terhadap kabar berita tersebut?', NULL, TRUE),
(345, 2, 13, 3, 122, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Manakah respons emosional dan kepedulian yang muncul pada pembaca melihat fenomena dalam teks informasi tersebut? (Pilih semua jawaban yang benar)', NULL, TRUE),
(346, 2, 13, 3, 123, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Dampak emosional yang dirasakan pembaca saat memahami konsekuensi dari teks informasi di atas adalah ...', NULL, TRUE),
(347, 2, 13, 3, 124, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Kesan emosional positif yang didapatkan pembaca dari wacana keberhasilan tersebut adalah ...', NULL, TRUE),
(348, 2, 13, 3, 125, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Manakah bentuk respons afektif pembaca yang tepat dalam menyikapi fenomena kebahasaan teks di atas? (Pilih semua jawaban yang benar)', NULL, TRUE),
(349, 2, 13, 3, 126, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Respons emosional yang paling tepat saat menyadari fakta kesehatan pada teks informasi tersebut adalah ...', NULL, TRUE),
(350, 2, 13, 3, 127, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Apresiasi emosional dan afektif yang dirasakan pembaca atas pencapaian program tersebut adalah ...', NULL, TRUE),
(351, 2, 13, 3, 128, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Manakah respons empati pembaca yang sesuai dengan situasi wacana di atas? (Pilih semua jawaban yang benar)', NULL, TRUE),
(352, 2, 13, 3, 129, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Bagaimana respons afektif pembaca terhadap informasi karya inovasi ini?', NULL, TRUE),
(353, 2, 13, 3, 130, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Sikap afektif dan emosional yang wajar dirasakan pembaca terhadap bahaya penyebaran hoaks tersebut adalah ...', NULL, TRUE),
(354, 2, 13, 3, 131, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Manakah bentuk perasaan dan apresiasi pembaca terhadap berita pemulihan lingkungan tersebut? (Pilih semua jawaban mengenai keberhasilan)', NULL, TRUE),
(355, 2, 13, 3, 132, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Respons emosional yang muncul dalam diri pembaca melihat perjuangan para atlet tersebut adalah ...', NULL, TRUE),
(356, 2, 13, 3, 133, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Tanggapan afektif pembaca terkait kontradiksi fakta pada teks informasi tersebut adalah ...', NULL, TRUE),
(357, 2, 13, 3, 134, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Manakah respons afektif yang tepat dari pembaca terhadap keberadaan dapur komunitas? (Pilih semua jawaban yang benar)', NULL, TRUE),
(358, 2, 13, 3, 135, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Kesan afektif pembaca terhadap penggunaan kebahasaan pada artikel berita tersebut adalah ...', NULL, TRUE),
(359, 2, 13, 3, 136, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Perasaan yang paling dominan dirasakan pembaca terhadap aksi komunitas tersebut adalah ...', NULL, TRUE),
(360, 2, 13, 3, 137, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Manakah respons emosional dan penolakan yang muncul pada pembaca melihat kenyataan wacana di atas? (Pilih semua jawaban yang benar)', NULL, TRUE),
(361, 2, 14, 1, 138, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Media tanam pada paragraf kedua adalah ...', NULL, TRUE),
(362, 2, 14, 1, 138, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Tanaman yang dijadikan contoh dalam teks tersebut adalah ...', NULL, TRUE),
(363, 2, 14, 1, 138, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Kata pemanenan pada paragraf keempat bermakna ...', NULL, TRUE),
(364, 2, 14, 1, 139, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Latar tempat pada awal cerita adalah ...', NULL, TRUE),
(365, 2, 14, 1, 139, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Kata atau frasa yang menunjukkan bahwa sepeda Raka sudah lama dipakai adalah ... Pilihlah semua jawaban yang benar!', NULL, TRUE),
(366, 2, 14, 1, 139, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Kata kusam pada paragraf kedua bermakna ...', NULL, TRUE),
(367, 2, 14, 1, 140, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Stup pada paragraf kedua adalah ...', NULL, TRUE),
(368, 2, 14, 1, 140, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Pernyataan yang sesuai dengan penggunaan istilah propolis dalam teks adalah ... Pilihlah semua jawaban yang benar!', NULL, TRUE),
(369, 2, 14, 1, 140, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Kata penyerbukan pada paragraf keempat bermakna ...', NULL, TRUE),
(370, 2, 14, 1, 141, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Kata cakrawala pada paragraf pertama bermakna ...', NULL, TRUE),
(371, 2, 14, 1, 141, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Latar tempat yang disebutkan langsung dalam cerita adalah ... Pilihlah semua jawaban yang benar!', NULL, TRUE),
(372, 2, 14, 1, 141, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Kata lirih pada paragraf kelima bermakna ...', NULL, TRUE),
(373, 2, 14, 1, 142, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Istilah ekosistem pada paragraf pertama paling tepat bermakna ...', NULL, TRUE),
(374, 2, 14, 1, 142, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Pernyataan yang sesuai dengan penggunaan istilah pemutihan karang dalam teks adalah ... Pilihlah semua jawaban yang benar!', NULL, TRUE),
(375, 2, 14, 1, 142, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Frasa saling menguntungkan pada paragraf kedua menunjukkan hubungan antara karang dan alga yang ...', NULL, TRUE),
(376, 2, 14, 1, 143, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Kata merantau pada paragraf kedua bermakna ...', NULL, TRUE),
(377, 2, 14, 1, 143, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Ungkapan yang menggunakan makna kias dalam cerita adalah ... Pilihlah semua jawaban yang benar!', NULL, TRUE),
(378, 2, 14, 1, 143, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Kata menepi pada kalimat "awan kelabu perlahan menepi" bermakna ...', NULL, TRUE),
(379, 2, 14, 1, 144, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Istilah konversi energi pada paragraf kedua bermakna ...', NULL, TRUE),
(380, 2, 14, 1, 144, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Pernyataan yang sesuai dengan penggunaan istilah energi terbarukan dalam teks adalah ... Pilihlah semua jawaban yang benar!', NULL, TRUE),
(381, 2, 14, 2, 145, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Apa yang dibawa Kakek Jaya saat menemui Bima di beranda?', NULL, TRUE),
(382, 2, 14, 2, 145, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Mengapa Bima merasa murung pada sore itu?', NULL, TRUE),
(383, 2, 14, 2, 145, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Apa yang terjadi pada layang-layang pertama yang dibuat Bima dan Kakek?', NULL, TRUE),
(384, 2, 14, 2, 145, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Pilihlah semua bahan atau alat yang dipakai Bima dan Kakek untuk membuat layang-layang! (Jawaban benar lebih dari satu)', NULL, TRUE),
(385, 2, 14, 2, 145, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Tentukan benar atau salah setiap pernyataan berikut berdasarkan Teks 1!', NULL, TRUE),
(386, 2, 14, 2, 146, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Apa hadiah yang dibawa Laras untuk Bu Ningsih?', NULL, TRUE),
(387, 2, 14, 2, 146, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Mengapa Laras menyembunyikan kotaknya di dalam tas?', NULL, TRUE),
(388, 2, 14, 2, 146, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Apa yang dibawa Maya untuk Bu Ningsih?', NULL, TRUE),
(389, 2, 14, 2, 146, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Apa yang dibawa Ari saat mengikuti ayahnya ke pantai?', NULL, TRUE),
(390, 2, 14, 2, 146, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Kapan Ari dan ayahnya berangkat ke pantai?', NULL, TRUE),
(391, 2, 14, 2, 147, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Apa yang diminta Pak Darto kepada Ari ketika ombak besar menghantam perahu?', NULL, TRUE),
(392, 2, 14, 2, 147, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Apa yang dilakukan Ari dan ayahnya agar jaring terlepas dari karang?', NULL, TRUE),
(393, 2, 14, 2, 147, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Tentukan benar atau salah setiap pernyataan berikut berdasarkan Teks 3!', NULL, TRUE),
(394, 2, 14, 2, 147, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Siapa yang menjaga perpustakaan desa dalam Teks 4?', NULL, TRUE),
(395, 2, 14, 2, 147, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Mengapa Dimas tidak menemukan buku tentang planet di rak?', NULL, TRUE),
(396, 2, 14, 2, 147, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Apa yang dibaca Dimas setelah tahu bukunya sedang dipinjam?', NULL, TRUE),
(397, 2, 14, 2, 147, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Pilihlah semua benda yang dipasang Bu Wati di sudut baca kecil! (Jawaban benar lebih dari satu)', NULL, TRUE),
(398, 2, 14, 2, 147, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Planet berwarna biru yang ditunjuk Tika bernama ...', NULL, TRUE),
(399, 2, 14, 2, 146, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Apa hadiah yang dibawa Yoga untuk Bu Ningsih pada hari ulang tahunnya?', NULL, TRUE),
(400, 2, 14, 2, 146, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Bagaimana respons Bu Ningsih saat menerima hadiah bros bunga matahari dari Laras?', NULL, TRUE),
(401, 2, 14, 3, 148, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Ide pokok paragraf 1 Teks 5 adalah ...', NULL, TRUE),
(402, 2, 14, 3, 148, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Urutan peristiwa yang benar dalam Teks 5 adalah ...', NULL, TRUE),
(403, 2, 14, 3, 148, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Perhatikan kerangka Teks 5 berikut.
Paragraf 1: Wulan dan ibu di pasar
Paragraf 2: Wulan menemukan anak kucing
Paragraf 3: ...
Paragraf 4: Pemilik kucing muncul
Paragraf 5: Nenek memberi kue dan pelajaran bagi Wulan
Bagian yang tepat untuk melengkapi paragraf 3 adalah ...', NULL, TRUE),
(404, 2, 14, 3, 148, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Pilihlah semua kejadian yang terdapat pada paragraf 4! (Jawaban benar lebih dari satu)', NULL, TRUE),
(405, 2, 14, 3, 148, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Tentukan benar atau salah setiap pernyataan tentang isi paragraf Teks 5 berikut!', NULL, TRUE),
(406, 2, 14, 3, 149, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Perhatikan kerangka Teks 6 berikut.
I. Kiki menabung untuk membelikan sepeda ayah (paragraf 1)
II. ... (paragraf 2)
III. Uang Kiki kurang dan pemilik toko membantu (paragraf 3)
IV. Ayah menerima sepeda (paragraf 4)
Bagian II yang tepat adalah ...', NULL, TRUE),
(407, 2, 14, 3, 149, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Urutan peristiwa pada paragraf 3 yang benar adalah ...', NULL, TRUE),
(408, 2, 14, 3, 149, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Masalah atau konflik yang dihadapi Kiki mulai muncul pada paragraf ...', NULL, TRUE),
(409, 2, 14, 3, 149, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Tentukan benar atau salah setiap pernyataan tentang isi paragraf Teks 6 berikut!', NULL, TRUE),
(410, 2, 14, 3, 150, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Ide pokok paragraf 2 Teks 7 adalah ...', NULL, TRUE),
(411, 2, 14, 3, 150, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Urutan peristiwa yang benar dalam Teks 7 adalah ...', NULL, TRUE),
(412, 2, 14, 3, 150, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Penyelesaian cerita dalam Teks 7 terdapat pada paragraf ...', NULL, TRUE),
(413, 2, 14, 3, 150, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Pilihlah semua peristiwa yang terjadi setelah Sinta memejamkan mata dan membayangkan kebun nenek! (Jawaban benar lebih dari satu)', NULL, TRUE),
(414, 2, 14, 3, 150, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Tentukan benar atau salah setiap pernyataan tentang isi paragraf Teks 7 berikut!', NULL, TRUE),
(415, 2, 14, 3, 151, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Ide pokok paragraf 1 Teks 8 adalah ...', NULL, TRUE),
(416, 2, 14, 3, 151, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Urutan peristiwa yang benar dalam Teks 8 adalah ...', NULL, TRUE),
(417, 2, 14, 3, 151, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Perhatikan alur Teks 8 berikut.
Paragraf 1: Awal (hujan dan warga berkumpul)
Paragraf 2: Munculnya masalah (adik Rafi hilang)
Paragraf 3: ...
Paragraf 4: Penyelesaian
Bagian yang tepat untuk paragraf 3 adalah ...', NULL, TRUE),
(418, 2, 14, 3, 151, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Ide pokok paragraf 4 Teks 8 adalah ...', NULL, TRUE),
(419, 2, 14, 3, 151, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Pilihlah semua kegiatan warga di balai desa yang disebutkan pada paragraf 2! (Jawaban benar lebih dari satu)', NULL, TRUE),
(420, 2, 14, 3, 149, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Ide pokok paragraf 2 Teks 6 adalah ...', NULL, TRUE),
(421, 2, 15, 1, 152, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Berdasarkan paragraf pertama, simpulan yang tepat mengenai perasaan Laras terhadap sepedanya adalah ….', NULL, TRUE),
(422, 2, 15, 1, 152, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Berdasarkan cerita di atas, tentukan nilai-nilai karakter dan pesan moral yang dapat disimpulkan dari tindakan tokoh! (Pilihlah jawaban yang benar! jawaban benar lebih dari satu])', NULL, TRUE),
(423, 2, 15, 1, 152, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Tentukan kebenaran simpulan-simpulan berikut berdasarkan isi cerita \'Sepeda Biru Milik Laras\'!', NULL, TRUE),
(424, 2, 15, 1, 153, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Berdasarkan rincian kejadian pada awal cerita, simpulan suasana yang terbangun di dermaga adalah ….', NULL, TRUE),
(425, 2, 15, 1, 153, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Berdasarkan teks di atas, simpulan yang tepat mengenai ikatan sosial masyarakat nelayan di dermaga adalah …. (Pilihlah jawaban yang benar! jawaban benar lebih dari satu)', NULL, TRUE),
(426, 2, 15, 1, 153, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Tentukan kebenaran simpulan-simpulan berikut berdasarkan isi cerita \'Pulang Sebelum Badai\'!', NULL, TRUE),
(427, 2, 15, 1, 154, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Berdasarkan cerita tersebut, simpulan mengenai konflik batin utama yang dialami tokoh Dimas adalah pergulatan antara ….', NULL, TRUE),
(428, 2, 15, 1, 154, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Berdasarkan tindakan tokoh Dimas dalam teks di atas, simpulan watak dan nilai budi pekerti yang tepat adalah …. (Pilihlah jawaban yang benar! jawaban benar lebih dari satu)', NULL, TRUE),
(429, 2, 15, 1, 154, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Tentukan kebenaran simpulan-simpulan berikut berdasarkan teks \'Dompet di Bangku Halte\'!', NULL, TRUE),
(430, 2, 15, 1, 155, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Simpulan watak tokoh Pak Sarman yang paling menonjol berdasarkan penolakannya terhadap tawaran pria berjas adalah ….', NULL, TRUE),
(431, 2, 15, 1, 155, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Berdasarkan isi teks cerita di atas, simpulan mengenai kondisi latar sosial dan pesan cerita yang tepat adalah …. (Pilihlah jawaban yang benar! jawaban benar lebih dari satu)', NULL, TRUE),
(432, 2, 15, 1, 155, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Tentukan kebenaran simpulan-simpulan berikut berdasarkan teks \'Ladang Terakhir Pak Sarman\'!', NULL, TRUE),
(433, 2, 15, 1, 156, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Simpulan yang paling tepat mengenai karakter dan metode mendidik Bu Wening selama mengajar adalah ….', NULL, TRUE),
(434, 2, 15, 1, 156, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Berdasarkan teks di atas, simpulan mengenai makna simbolis pemberian penghapus aus dan dinamika kelas adalah …. (Pilihlah jawaban yang benar! jawaban benar lebih dari satu)', NULL, TRUE),
(435, 2, 15, 1, 156, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Tentukan kebenaran simpulan-simpulan berikut berdasarkan teks \'Pelajaran Terakhir Bu Wening\'!', NULL, TRUE),
(436, 2, 15, 1, 157, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Simpulan ide pokok yang mendasari percakapan antara Kakek Wiryo dan Ardi pada paragraf ketiga adalah ….', NULL, TRUE),
(437, 2, 15, 1, 157, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Simpulan nilai kehidupan yang dapat dipetik pembaca dari renungan tokoh Ardi di akhir cerita adalah ….', NULL, TRUE),
(438, 2, 15, 1, 157, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Berdasarkan sikap Kakek Wiryo terhadap jam saku dan cucunya, simpulan watak tokoh kakek yang paling tepat adalah ….', NULL, TRUE),
(439, 2, 15, 1, 158, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Simpulan latar suasana yang terbangun ketika warga desa bahu-membahu menancapkan tiang jembatan adalah ….', NULL, TRUE),
(440, 2, 15, 1, 158, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Simpulan pesan amanat utama yang ingin disampaikan oleh pengarang melalui cerita tersebut adalah ….', NULL, TRUE),
(441, 2, 15, 2, 159, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Berdasarkan teks di atas, peristiwa yang menjelaskan penyebab layang-layang Arman mendadak meliuk-liuk lalu jatuh di atas genting rumah Pak Kades adalah ….', NULL, TRUE),
(442, 2, 15, 2, 159, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Berdasarkan teks \'Layang-Layang Arman\', tentukan penjelasan yang tepat mengenai gaya bahasa (ungkapan dan citraan) yang digunakan pengarang! (Pilihlah jawaban yang benar! jawaban benar lebih dari satu)', NULL, TRUE),
(443, 2, 15, 2, 159, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Tentukan kebenaran penjelasan kelogisan hubungan peristiwa berikut berdasarkan isi teks \'Layang-Layang Arman\'!', NULL, TRUE),
(444, 2, 15, 2, 160, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Penjelasan yang paling logis mendasari penolakan Bu Tini terhadap saran suaminya untuk mengurangi porsi nasi adalah ….', NULL, TRUE),
(445, 2, 15, 2, 160, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Berdasarkan teks \'Warung Bu Tini\', tentukan penjelasan sebab-akibat dan bahasa yang tepat! (Pilihlah jawaban yang benar! jawaban benar lebih dari satu)', NULL, TRUE),
(446, 2, 15, 2, 160, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Tentukan kebenaran penjelasan hubungan antargagasan berikut berdasarkan teks \'Warung Bu Tini\'!', NULL, TRUE),
(447, 2, 15, 2, 161, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Penjelasan yang tepat mengapa Sinta mengurungkan amarahnya ketika Farhan datang terlambat ke rumahnya adalah ….', NULL, TRUE),
(448, 2, 15, 2, 161, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Berdasarkan cerita di atas, tentukan penjelasan kelogisan hubungan antarperistiwa yang mengantarkan kelompok Sinta memperoleh nilai tertinggi! (Pilihlah jawaban yang benar! jawaban benar lebih dari satu)', NULL, TRUE),
(449, 2, 15, 2, 161, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Tentukan kebenaran penjelasan mengenai watak dan bahasa berikut berdasarkan teks \'Tugas Kelompok Sinta\'!', NULL, TRUE),
(450, 2, 15, 2, 162, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Penjelasan makna kias yang paling tepat dari kalimat "Suara itu mengalir pelan melewati sawah dan menyentuh atap-atap rumah" adalah ….', NULL, TRUE),
(451, 2, 15, 2, 162, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Berdasarkan teks \'Seruling Kakek\', tentukan penjelasan penggunaan bahasa kias dan citraan yang sesuai! (Pilihlah dua jawaban yang benar dengan memberi tanda centang [✓])', NULL, TRUE),
(452, 2, 15, 2, 162, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Tentukan kebenaran penjelasan kelogisan peristiwa berikut berdasarkan teks \'Seruling Kakek\'!', NULL, TRUE),
(453, 2, 15, 2, 163, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Penjelasan penyebab Bu Ratmi tertegun menutup mulutnya dan meneteskan air mata saat membaca surat tua tersebut adalah ….', NULL, TRUE),
(454, 2, 15, 2, 163, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Berdasarkan cerita \'Surat untuk Bu Ratmi\', tentukan penjelasan penggunaan bahasa dan peristiwa yang tepat! (Pilihlah jawaban yang benar! jawaban benar lebih dari satu)', NULL, TRUE),
(455, 2, 15, 2, 163, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Tentukan kebenaran penjelasan kelogisan cerita berikut berdasarkan teks \'Surat untuk Bu Ratmi\'!', NULL, TRUE),
(456, 2, 15, 2, 164, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Berdasarkan teks di atas, penjelasan sebab-akibat yang logis atas karamnya perahu kertas milik tokoh Fajar adalah ….', NULL, TRUE),
(457, 2, 15, 2, 164, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Makna ungkapan "Matanya berawan mendung" pada tokoh Fajar setelah perahunya karam menjelaskan bahwa tokoh sedang ….', NULL, TRUE),
(458, 2, 15, 2, 164, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Kalimat pembuka cerita "Gerimis deras menderu di atas seng atap rumah Gani" secara dominan memanfaatkan citraan ….', NULL, TRUE),
(459, 2, 15, 2, 165, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Penjelasan kelogisan sikap Pak Johan memberikan sepotong roti hangat kepada Raka di akhir cerita adalah sebagai ….', NULL, TRUE),
(460, 2, 15, 2, 165, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Kalimat "Rasa legit cokelat lumer di lidah Raka, menghadirkan kehangatan luar biasa..." menggunakan perpaduan citraan ….', NULL, TRUE),
(461, 2, 15, 3, 166, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Berdasarkan rincian situasi di lapangan dan pergerakan pemain, tindakan Rio selanjutnya yang paling mungkin terjadi adalah ….', NULL, TRUE),
(462, 2, 15, 3, 166, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Jika operan bola Rio berhasil sampai tepat di kaki Ilham, prediksi dampak yang paling logis terhadap jalannya pertandingan dan kondisi tim adalah …. (Pilihlah jawaban yang benar! jawaban benar lebih dari satu)', NULL, TRUE),
(463, 2, 15, 3, 166, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Tentukan kebenaran prediksi-prediksi berikut berdasarkan akhir cerita \'Tendangan Penentu\'!', NULL, TRUE),
(464, 2, 15, 3, 167, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Berdasarkan perubahan sikap teman-teman Bimo pada paragraf terakhir, prediksi tindakan mereka selanjutnya terhadap tanaman di sekolah adalah ….', NULL, TRUE),
(465, 2, 15, 3, 167, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Berdasarkan ketekunan Bimo dan kondisi kemarau, prediksi keadaan bibit mangga dan lingkungan sekolah pada akhir musim kemarau adalah …. (Pilihlah jawaban yang benar! jawaban benar lebih dari satu)', NULL, TRUE),
(466, 2, 15, 3, 167, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Tentukan kebenaran prediksi-prediksi berikut berdasarkan teks \'Pohon Mangga di Halaman\'!', NULL, TRUE),
(467, 2, 15, 3, 168, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Berdasarkan respons fisik dan situasi percakapan di akhir teks, reaksi Tomi selanjutnya yang paling mungkin terjadi adalah ….', NULL, TRUE),
(468, 2, 15, 3, 168, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Berdasarkan interaksi tersebut, prediksi perkembangan hubungan sosial antara Tomi dan Nadia di masa mendatang adalah …. (Pilihlah jawaban yang benar! jawaban benar lebih dari satu)', NULL, TRUE),
(469, 2, 15, 3, 168, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Tentukan kebenaran prediksi-prediksi berikut berdasarkan teks \'Kotak Bekal Nadia\'!', NULL, TRUE),
(470, 2, 15, 3, 169, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Berdasarkan arah gerak anak-anak dan kondisi cuaca di luar, tindakan ketiga anak itu selanjutnya yang paling mungkin adalah ….', NULL, TRUE),
(471, 2, 15, 3, 169, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Jika anak-anak menceritakan fakta sebenarnya kepada warga kampung, prediksi tanggapan masyarakat dan kondisi gudang tua adalah …. (Pilihlah dua jawaban yang benar dengan memberi tanda centang [Pilihlah jawaban yang benar! jawaban benar lebih dari satu)', NULL, TRUE),
(472, 2, 15, 3, 169, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Tentukan kebenaran prediksi-prediksi berikut berdasarkan teks \'Suara dari Gudang Tua\'!', NULL, TRUE),
(473, 2, 15, 3, 170, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Berdasarkan tindakan Elsa memejamkan mata dan mengingat ibunya di barisan depan, tindakan Elsa selanjutnya yang paling mungkin adalah ….', NULL, TRUE),
(474, 2, 15, 3, 170, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Berdasarkan bekal latihan intensif selama tiga bulan, prediksi jalannya penampilan dan akhir pentas seni Elsa adalah …. (Pilihlah jawaban yang benar! jawaban benar lebih dari satu)', NULL, TRUE),
(475, 2, 15, 3, 170, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Tentukan kebenaran prediksi psikologis tokoh berikut berdasarkan teks \'Panggung Pertama Elsa\'!', NULL, TRUE),
(476, 2, 15, 3, 171, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Berdasarkan kepepetan waktu dan prinsip sportivitas yang disampaikan Riki, keputusan Pandu selanjutnya yang paling mungkin adalah ….', NULL, TRUE),
(477, 2, 15, 3, 172, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Prediksi pengaruh tindakan luhur Riki terhadap performa dan mental bertanding Pandu di babak final adalah ….', NULL, TRUE),
(478, 2, 15, 3, 172, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Prediksi dinamika relasi persahabatan antara Pandu dan Riki setelah ajang kejuaraan atletik berakhir adalah ….', NULL, TRUE),
(479, 2, 15, 3, 173, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Berdasarkan tanda-tanda alam dan prinsip pesan almarhum ayahnya, tindakan Hendra selanjutnya yang paling mungkin terjadi adalah ….', NULL, TRUE),
(480, 2, 15, 3, 173, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Prediksi tanggapan sesepuh nelayan dan keluarga saat menyambut kepulangan Hendra di pangkalan pendaratan ikan adalah ….', NULL, TRUE),
(481, 2, 16, 1, 174, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Berdasarkan Teks "Pesan yang Belum Selesai", tindakan Raka yang paling relevan diterapkan dalam kehidupan sehari-hari adalah ....', NULL, TRUE),
(482, 2, 16, 1, 174, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Peristiwa dalam Teks "Pesan yang Belum Selesai" paling relevan dengan situasi ....', NULL, TRUE),
(483, 2, 16, 1, 174, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Tindakan berikut yang sesuai dengan nilai yang ditunjukkan Raka dalam Teks "Pesan yang Belum Selesai" adalah ....', NULL, TRUE),
(484, 2, 16, 1, 175, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Jika masalah seperti dalam Teks "Poster Lomba" terjadi dalam tugas kelompok, tindakan yang paling relevan adalah ....', NULL, TRUE),
(485, 2, 16, 1, 175, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Nilai utama dari Teks "Poster Lomba" yang paling relevan dengan kehidupan siswa adalah ....', NULL, TRUE),
(486, 2, 16, 1, 175, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Nilai utama dari Teks "Poster Lomba" yang paling relevan dengan kehidupan siswa adalah ....', NULL, TRUE),
(487, 2, 16, 1, 175, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Perilaku yang dapat diterapkan siswa berdasarkan Teks "Poster Lomba" adalah ....', NULL, TRUE),
(488, 2, 16, 1, 176, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Peristiwa Danu dalam Teks "Suara dari Belakang Kelas" relevan dengan kehidupan sehari-hari karena ....', NULL, TRUE),
(489, 2, 16, 1, 176, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Sikap Danu yang paling tepat diterapkan ketika seorang siswa melakukan kesalahan adalah ....', NULL, TRUE),
(490, 2, 16, 1, 177, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Sikap yang sesuai dengan nilai Teks "Suara dari Belakang Kelas" dalam kehidupan sekolah adalah ....', NULL, TRUE),
(491, 2, 16, 1, 178, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Tindakan Lani dalam Teks "Bangku Taman" dapat diterapkan di sekolah dengan cara ....', NULL, TRUE),
(492, 2, 16, 1, 179, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Tulisan “Gunakan dan Jaga Bersama” pada Teks "Bangku Taman" paling relevan dengan kebiasaan ....', NULL, TRUE),
(493, 2, 16, 1, 179, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Tindakan berikut yang sesuai dengan nilai Teks "Bangku Taman" adalah ....', NULL, TRUE),
(494, 2, 16, 1, 180, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Keputusan Bima dalam Teks "Dompet di Lapangan" paling relevan diterapkan ketika seseorang ....', NULL, TRUE),
(495, 2, 16, 1, 180, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Jika seorang siswa menemukan telepon genggam di kelas, tindakan yang paling sesuai dengan Teks "Dompet di Lapangan" adalah ....', NULL, TRUE),
(496, 2, 16, 1, 180, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Nilai Teks "Dompet di Lapangan" dapat diterapkan dalam kehidupan sehari-hari melalui tindakan ....', NULL, TRUE),
(497, 2, 16, 1, 180, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Alasan Bima menolak saran teman-temannya menunjukkan bahwa dalam kehidupan sehari-hari ....', NULL, TRUE),
(498, 2, 16, 1, 180, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Dampak positif tindakan Bima yang paling mungkin terjadi dalam kehidupan nyata adalah ....', NULL, TRUE),
(499, 2, 16, 1, 180, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Jika nilai dalam Teks "Pesan yang Belum Selesai" diterapkan secara luas dalam masyarakat, kemungkinan yang terjadi adalah ....', NULL, TRUE),
(500, 2, 16, 1, 181, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Perilaku berikut mencerminkan nilai dari beberapa teks Di atas adalah ....', NULL, TRUE),
(501, 2, 16, 1, 182, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Situasi berikut yang paling tepat menunjukkan penerapan nilai Teks "Pesan yang Belum Selesai" dan Teks "bangku taman" adalah ....', NULL, TRUE),
(502, 2, 16, 2, 183, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Persamaan watak tokoh utama dalam P1 adalah ....', NULL, TRUE),
(503, 2, 16, 2, 183, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Pernyataan yang paling tepat tentang alur P1 adalah ....', NULL, TRUE),
(504, 2, 16, 2, 183, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Pernyataan yang benar berdasarkan pasangan teks P1 adalah ....', NULL, TRUE),
(505, 2, 16, 2, 184, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Persamaan tindakan tokoh dalam kedua teks P2 adalah ....', NULL, TRUE),
(506, 2, 16, 2, 184, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Perbedaan latar waktu kedua teks P2 adalah ....', NULL, TRUE),
(507, 2, 16, 2, 184, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Pernyataan yang didukung kedua teks P2 adalah ....', NULL, TRUE),
(508, 2, 16, 2, 185, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Persamaan konflik masing masing teks P3 adalah ....', NULL, TRUE),
(509, 2, 16, 2, 185, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Simpulan yang paling akurat berdasarkan pasangan P3 adalah ....', NULL, TRUE),
(510, 2, 16, 2, 185, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Pernyataan yang benar berdasarkan pasangan P3 adalah ....', NULL, TRUE),
(511, 2, 16, 2, 186, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Perbedaan cara tokoh menghadapi masalah dalam pasangan P4 adalah ....', NULL, TRUE),
(512, 2, 16, 2, 186, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Pernyataan yang tepat tentang latar pasangan P4 adalah ....', NULL, TRUE),
(513, 2, 16, 2, 186, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Persamaan sikap tokoh dalam pasangan P4 adalah ....', NULL, TRUE),
(514, 2, 16, 2, 187, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Perbedaan suasana P5 yang paling tepat adalah ....', NULL, TRUE),
(515, 2, 16, 2, 187, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Diksi “berat” dalam Teks I paling tepat dimaknai sebagai ....', NULL, TRUE),
(516, 2, 16, 2, 187, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Pernyataan yang tepat berdasarkan Pasangan P5 adalah ....', NULL, TRUE),
(517, 2, 16, 2, 187, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Sudut pandang kedua teks puisi Pasangan P5 dapat disebut ....', NULL, TRUE),
(518, 2, 16, 2, 188, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Perbedaan penyelesaian konflik P1 yang paling tepat adalah ....', NULL, TRUE),
(519, 2, 16, 2, 189, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Pernyataan yang menunjukkan perbedaan P2 dan P4 adalah ....', NULL, TRUE),
(520, 2, 16, 2, 190, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Simpulan yang paling tepat dari perbandingan P3 dan P4 adalah ....', NULL, TRUE),
(521, 2, 16, 2, 191, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Pernyataan yang paling akurat berdasarkan seluruh pasangan teks adalah ....', NULL, TRUE),
(522, 2, 16, 3, 192, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Respons emosional yang paling sesuai setelah membaca "Kursi Kosong" adalah ....', NULL, TRUE),
(523, 2, 16, 3, 193, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Perasaan Arga terhadap kepergian Rian dapat disimpulkan sebagai ....', NULL, TRUE),
(524, 2, 16, 3, 194, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'membaca Teks "Kursi Kosong" adalah ....', NULL, TRUE),
(525, 2, 16, 3, 193, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Bagian yang paling kuat menimbulkan rasa haru dalam Teks "Kursi Kosong" adalah ....', NULL, TRUE),
(526, 2, 16, 3, 195, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Teks "Lampu di Rumah Nenek" adalah ....', NULL, TRUE),
(527, 2, 16, 3, 196, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Kalimat “Kamu membuat malam ini tidak terasa panjang” menunjukkan bahwa nenek ....', NULL, TRUE),
(528, 2, 16, 3, 196, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Respons emosional yang didukung oleh Teks "Lampu di Rumah Nenek" adalah ....', NULL, TRUE),
(529, 2, 16, 3, 197, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Perasaan yang paling mungkin muncul ketika burung dalam Teks "Burung dalam Sangkar" akhirnya terbang adalah ....', NULL, TRUE),
(530, 2, 16, 3, 197, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Keraguan burung sebelum terbang dapat menimbulkan respons pembaca berupa ....', NULL, TRUE),
(531, 2, 16, 3, 197, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Respons yang sesuai terhadap akhir Teks "Burung dalam Sangkar" adalah ....', NULL, TRUE),
(532, 2, 16, 3, 198, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Suasana emosional dominan dalam Teks Puisi “Pagi Setelah Hujan” adalah ....', NULL, TRUE),
(533, 2, 16, 3, 198, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Respons emosional paling tepat terhadap larik “seolah hari memberiku kesempatan / untuk memulai lagi” adalah ....', NULL, TRUE),
(534, 2, 16, 3, 198, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Diksi yang mendukung respons tenang dan penuh harapan dalam Teks Puisi “Pagi Setelah Hujan” adalah ....', NULL, TRUE),
(535, 2, 16, 3, 198, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Perubahan suasana dalam Teks Puisi “Pagi Setelah Hujan” dapat membuat pembaca merasa ....', NULL, TRUE),
(536, 2, 16, 3, 199, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Respons emosional yang paling tepat terhadap keputusan Naya dalam Teks "Pilihan Naya" adalah ....', NULL, TRUE),
(537, 2, 16, 3, 199, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Setelah membaca Teks "Pilihan Naya", pembaca paling mungkin merasa ....', NULL, TRUE),
(538, 2, 16, 3, 199, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Respons emosional yang sesuai terhadap Teks "Pilihan Naya" adalah ....', NULL, TRUE),
(539, 2, 16, 3, 199, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Unsur yang paling kuat membangun rasa lega pada akhir Teks "Pilihan Naya" adalah ....', NULL, TRUE),
(540, 2, 16, 3, 200, 'LEVEL_EXERCISE', 'COMPLEX_CHOICE', 'Jika Teks "Kursi Kosong" dan Teks "Pilihan Naya" dibandingkan, respons emosional yang tepat adalah ....', NULL, TRUE),
(541, 2, 16, 3, 200, 'LEVEL_EXERCISE', 'SINGLE_CHOICE', 'Berdasarkan keseluruhan Teks "Kursi Kosong"–Teks "Pilihan Naya", simpulan respons emosional yang paling tepat adalah ....', NULL, TRUE)
ON DUPLICATE KEY UPDATE 
    `subject_id` = VALUES(`subject_id`), 
    `sub_material_id` = VALUES(`sub_material_id`), 
    `cognitive_level_id` = VALUES(`cognitive_level_id`), 
    `stimulus_id` = VALUES(`stimulus_id`), 
    `bank_type` = VALUES(`bank_type`), 
    `question_format` = VALUES(`question_format`), 
    `question_text` = VALUES(`question_text`), 
    `stimulus_image_url` = VALUES(`stimulus_image_url`), 
    `is_active` = VALUES(`is_active`);

-- -----------------------------------------------------------------------------
-- 3. PEMBENIHAN PILIHAN JAWABAN (QUESTION_OPTIONS - 1424 Opsi, ID 721..2144)
-- -----------------------------------------------------------------------------
INSERT INTO `question_options` (`id`, `question_id`, `option_label`, `option_text`, `is_correct`) VALUES
(721, 181, 'A', 'Perangkat keras pada komputer', FALSE),
(722, 181, 'B', 'Prosedur atau langkah-langkah logis pemecahan masalah', TRUE),
(723, 181, 'C', 'Sistem operasi pada telepon pintar', FALSE),
(724, 181, 'D', 'Bahasa pemrograman desain grafis', FALSE),
(725, 182, 'A', 'Kecepatan yang sangat tinggi', FALSE),
(726, 182, 'B', 'Pengeluaran biaya yang mahal', FALSE),
(727, 182, 'C', 'Ketepatan waktu dan penghematan tenaga', TRUE),
(728, 182, 'D', 'Kerumitan sebuah sistem kerja', FALSE),
(729, 183, 'A', 'Barang baru yang belum dipakai', FALSE),
(730, 183, 'B', 'Sisa proses produksi atau sampah', TRUE),
(731, 183, 'C', 'Bahan baku utama pabrik', FALSE),
(732, 183, 'D', 'Produk unggulan hasil industri', FALSE),
(733, 184, 'A', 'Berubah menjadi lebih keras', FALSE),
(734, 184, 'B', 'Meningkat kualitasnya', FALSE),
(735, 184, 'C', 'Terurai atau mengalami penurunan wujud', TRUE),
(736, 184, 'D', 'Bercampur dengan udara kotor', FALSE),
(737, 185, 'A', 'Kelemahan otot', FALSE),
(738, 185, 'B', 'Kekebalan tubuh terhadap penyakit', TRUE),
(739, 185, 'C', 'Gangguan pencernaan', FALSE),
(740, 185, 'D', 'Kelelahan yang berkepanjangan', FALSE),
(741, 186, 'A', 'Berlebihan', FALSE),
(742, 186, 'B', 'Sangat sedikit', FALSE),
(743, 186, 'C', 'Seimbang atau sesuai takaran proporsi', TRUE),
(744, 186, 'D', 'Setiap saat tanpa henti', FALSE),
(745, 187, 'A', 'Sari pati yang diambil dari suatu bahan alami', TRUE),
(746, 187, 'B', 'Cairan kimia buatan yang ditambahkan zat pewarna', FALSE),
(747, 187, 'C', 'Ampas sisa kotoran dari hasil olahan pabrik', FALSE),
(748, 187, 'D', 'Potongan daun yang dijemur hingga menjadi kering', FALSE),
(749, 188, 'A', 'Kerugian', FALSE),
(750, 188, 'B', 'Efek samping', FALSE),
(751, 188, 'C', 'Manfaat', TRUE),
(752, 188, 'D', 'Kelemahan', FALSE),
(753, 189, 'A', 'Peningkatan nilai mata uang', FALSE),
(754, 189, 'B', 'Kenaikan harga barang dan kemerosotan nilai uang', TRUE),
(755, 189, 'C', 'Penurunan harga barang secara drastis', FALSE),
(756, 189, 'D', 'Kondisi ekonomi yang sangat kaya', FALSE),
(757, 190, 'A', 'Minat masyarakat menonton iklan', FALSE),
(758, 190, 'B', 'Harga pokok barang di pasar', FALSE),
(759, 190, 'C', 'Kemampuan masyarakat untuk membayar dan membeli barang', TRUE),
(760, 190, 'D', 'Kekuatan fisik saat membawa barang belanjaan', FALSE),
(761, 191, 'A', 'Gugusan pulau kecil', FALSE),
(762, 191, 'B', 'Kumpulan atau rasi bintang', TRUE),
(763, 191, 'C', 'Pergerakan awan tebal', FALSE),
(764, 191, 'D', 'Cahaya bulan purnama', FALSE),
(765, 192, 'A', 'Gaya dorong yang kuat', FALSE),
(766, 192, 'B', 'Gaya tarik-menarik', TRUE),
(767, 192, 'C', 'Energi panas dan cahaya', FALSE),
(768, 192, 'D', 'Kecepatan cahaya', FALSE),
(769, 193, 'A', 'Kebisingan suara', FALSE),
(770, 193, 'B', 'Keselarasan bunyi', TRUE),
(771, 193, 'C', 'Kesalahan nada', FALSE),
(772, 193, 'D', 'Alat pengeras suara', FALSE),
(773, 194, 'A', 'Pembuat alat musik', FALSE),
(774, 194, 'B', 'Penonton konser musik', FALSE),
(775, 194, 'C', 'Orang yang sangat ahli di bidang seni', TRUE),
(776, 194, 'D', 'Penjaga gedung pertunjukan', FALSE),
(777, 195, 'A', 'Wajah yang sangat jelas', FALSE),
(778, 195, 'B', 'Bayangan hitam atau bentuk profil benda/orang', TRUE),
(779, 195, 'C', 'Cahaya yang sangat terang menyilaukan', FALSE),
(780, 195, 'D', 'Topeng yang menutupi wajah', FALSE),
(781, 196, 'A', 'Tertutup rapat', FALSE),
(782, 196, 'B', 'Semakin kacau', FALSE),
(783, 196, 'C', 'Terbongkar atau terungkap', TRUE),
(784, 196, 'D', 'Dilupakan orang', FALSE),
(785, 197, 'A', 'Gempa bumi tektonik', FALSE),
(786, 197, 'B', 'Letusan gunung berapi', TRUE),
(787, 197, 'C', 'Tanah longsor di tebing', FALSE),
(788, 197, 'D', 'Angin topan badai', FALSE),
(789, 198, 'A', 'Tindakan mengurangi risiko atau dampak bencana', TRUE),
(790, 198, 'B', 'Pembagian bantuan makanan', FALSE),
(791, 198, 'C', 'Wawancara dengan korban bencana', FALSE),
(792, 198, 'D', 'Pembangunan kembali gedung yang hancur', FALSE),
(793, 199, 'A', 'Kecepatan berlari maksimal', FALSE),
(794, 199, 'B', 'Daya tahan fisik atau kekuatan tubuh', TRUE),
(795, 199, 'C', 'Ukuran sepatu atlet', FALSE),
(796, 199, 'D', 'Suasana hati saat bertanding', FALSE),
(797, 200, 'A', 'Sikap adil, jujur, dan mengakui keunggulan lawan', TRUE),
(798, 200, 'B', 'Keinginan kuat untuk menghancurkan musuh', FALSE),
(799, 200, 'C', 'Keluhan atas keputusan juri', FALSE),
(800, 200, 'D', 'Sikap menolak hadiah', FALSE),
(801, 201, 'A', 'Yogyakarta', FALSE),
(802, 201, 'B', 'Magelang', TRUE),
(803, 201, 'C', 'Solo', FALSE),
(804, 201, 'D', 'Semarang', FALSE),
(805, 202, 'A', 'Abad ke-6 Masehi', FALSE),
(806, 202, 'B', 'Abad ke-7 Masehi', FALSE),
(807, 202, 'C', 'Abad ke-8 Masehi', TRUE),
(808, 202, 'D', 'Abad ke-9 Masehi', FALSE),
(809, 203, 'A', 'Pemerintah kolonial', FALSE),
(810, 203, 'B', 'Dinasti Syailendra', TRUE),
(811, 203, 'C', 'Kerajaan Majapahit', FALSE),
(812, 203, 'D', 'Kerajaan Sriwijaya', FALSE),
(813, 204, 'A', 'Jawa Tengah', FALSE),
(814, 204, 'B', 'Bali', FALSE),
(815, 204, 'C', 'Jawa Timur', TRUE),
(816, 204, 'D', 'Nusa Tenggara Barat', FALSE),
(817, 205, 'A', 'Kuda', FALSE),
(818, 205, 'B', 'Mobil jip', TRUE),
(819, 205, 'C', 'Sepeda motor', FALSE),
(820, 205, 'D', 'Bus pariwisata', FALSE),
(821, 206, 'A', 'Suku Baduy', FALSE),
(822, 206, 'B', 'Suku Asmat', FALSE),
(823, 206, 'C', 'Suku Dayak', FALSE),
(824, 206, 'D', 'Suku Tengger', TRUE),
(825, 207, 'A', 'Menyaring kotoran dari sungai', FALSE),
(826, 207, 'B', 'Menahan abrasi laut dan memecah gelombang', TRUE),
(827, 207, 'C', 'Menjadi bahan bangunan warga', FALSE),
(828, 207, 'D', 'Mencegah banjir di perkotaan', FALSE),
(829, 208, 'A', 'Gempa bumi', FALSE),
(830, 208, 'B', 'Tsunami', TRUE),
(831, 208, 'C', 'Tanah longsor', FALSE),
(832, 208, 'D', 'Angin puting beliung', FALSE),
(833, 209, 'A', 'Gajah, harimau, dan badak', FALSE),
(834, 209, 'B', 'Ikan, kepiting, dan burung bangau', TRUE),
(835, 209, 'C', 'Ular sanca dan kera hitam', FALSE),
(836, 209, 'D', 'Buaya dan beruang madu', FALSE),
(837, 210, 'A', 'Penurunan suhu laut drastis', FALSE),
(838, 210, 'B', 'Peningkatan suhu rata-rata atmosfer, laut, dan daratan Bumi', TRUE),
(839, 210, 'C', 'Perubahan musim hujan menjadi kemarau', FALSE),
(840, 210, 'D', 'Peningkatan curah hujan di daerah tropis', FALSE),
(841, 211, 'A', 'Efek rumah kaca dari emisi karbon', TRUE),
(842, 211, 'B', 'Penebangan hutan liar', FALSE),
(843, 211, 'C', 'Banyaknya sampah plastik', FALSE),
(844, 211, 'D', 'Limbah cair pabrik tekstil', FALSE),
(845, 212, 'A', 'Mencairnya es di kutub', FALSE),
(846, 212, 'B', 'Naiknya permukaan air laut', FALSE),
(847, 212, 'C', 'Menurunnya suhu pegunungan', TRUE),
(848, 212, 'D', 'Perubahan cuaca yang ekstrem', FALSE),
(849, 213, 'A', 'Penggunaan kendaraan umum', FALSE),
(850, 213, 'B', 'Penggunaan kantong belanja kain', TRUE),
(851, 213, 'C', 'Penanaman pohon di pinggir jalan', FALSE),
(852, 213, 'D', 'Pemisahan sampah organik dan anorganik', FALSE),
(853, 214, 'A', 'Mengurangi volume sampah plastik', TRUE),
(854, 214, 'B', 'Meningkatkan pendapatan pasar swalayan', FALSE),
(855, 214, 'C', 'Memajukan industri tekstil lokal', FALSE),
(856, 214, 'D', 'Memudahkan pembeli membawa barang', FALSE),
(857, 215, 'A', 'Barang belanjaannya disita', FALSE),
(858, 215, 'B', 'Tidak diizinkan masuk ke swalayan', FALSE),
(859, 215, 'C', 'Harus membayar untuk mendapatkan kantong plastik', TRUE),
(860, 215, 'D', 'Diberikan kardus secara gratis', FALSE),
(861, 216, 'A', 'Berubah menjadi hijau tua', FALSE),
(862, 216, 'B', 'Berubah menjadi cokelat', FALSE),
(863, 216, 'C', 'Berubah menjadi kuning', TRUE),
(864, 216, 'D', 'Berubah menjadi merah', FALSE),
(865, 217, 'A', 'Menjaga kesehatan organ jantung manusia', TRUE),
(866, 217, 'B', 'Melancarkan sistem pencernaan di perut', FALSE),
(867, 217, 'C', 'Meningkatkan daya tahan tubuh manusia', FALSE),
(868, 217, 'D', 'Memberikan energi tambahan bagi otot', FALSE),
(869, 218, 'A', 'Jantung pisang', FALSE),
(870, 218, 'B', 'Batang pisang', FALSE),
(871, 218, 'C', 'Daun pisang', TRUE),
(872, 218, 'D', 'Akar pisang', FALSE),
(873, 219, 'A', 'Karena makanan di pagi hari lebih enak', FALSE),
(874, 219, 'B', 'Memberikan energi bagi tubuh dan otak untuk beraktivitas', TRUE),
(875, 219, 'C', 'Mencegah penyakit maag pada anak', FALSE),
(876, 219, 'D', 'Membuat anak mudah tidur di kelas', FALSE),
(877, 220, 'A', 'Tubuh menjadi lebih tinggi', FALSE),
(878, 220, 'B', 'Mudah menghafal buku pelajaran', FALSE),
(879, 220, 'C', 'Memiliki tingkat konsentrasi yang lebih baik di kelas', TRUE),
(880, 220, 'D', 'Menghindari jajanan di kantin sekolah', FALSE),
(881, 221, 'A', 'Kondensasi -> Evaporasi -> Presipitasi', FALSE),
(882, 221, 'B', 'Evaporasi -> Kondensasi -> Presipitasi', TRUE),
(883, 221, 'C', 'Presipitasi -> Evaporasi -> Kondensasi', FALSE),
(884, 221, 'D', 'Evaporasi -> Presipitasi -> Kondensasi', FALSE),
(885, 222, 'A', 'Penguapan air laut', FALSE),
(886, 222, 'B', 'Turunnya hujan', FALSE),
(887, 222, 'C', 'Terbentuknya awan dari uap air', TRUE),
(888, 222, 'D', 'Air mengalir ke sungai', FALSE),
(889, 223, 'A', 'Penguapan air, pembentukan awan, turunnya hujan', TRUE),
(890, 223, 'B', 'Panas matahari, angin kencang, banjir', FALSE),
(891, 223, 'C', 'Air laut, atmosfer, bumi', FALSE),
(892, 223, 'D', 'Sungai, atmosfer dingin, awan berat', FALSE),
(893, 224, 'A', '27 Okt pagi, 27 Okt malam, 28 Okt pagi', FALSE),
(894, 224, 'B', '27 Okt, 28 Okt pagi, 28 Okt malam', TRUE),
(895, 224, 'C', '28 Okt pagi, 28 Okt siang, 28 Okt malam', FALSE),
(896, 224, 'D', '26 Okt, 27 Okt, 28 Okt', FALSE),
(897, 225, 'A', 'Pendidikan -> Persatuan -> Sumpah Pemuda', FALSE),
(898, 225, 'B', 'Persatuan -> Pendidikan -> Sumpah Pemuda', TRUE),
(899, 225, 'C', 'Sumpah Pemuda -> Persatuan -> Pendidikan', FALSE),
(900, 225, 'D', 'Pendidikan -> Sumpah Pemuda -> Persatuan', FALSE),
(901, 226, 'A', 'Rumusan Sumpah Pemuda', FALSE),
(902, 226, 'B', 'Masalah pendidikan', TRUE),
(903, 226, 'C', 'Arti persatuan', FALSE),
(904, 226, 'D', 'Pembentukan PPPI', FALSE),
(905, 227, 'A', 'Cuci telur dan balut dengan adonan', FALSE),
(906, 227, 'B', 'Cuci telur dan amplas kulit telur', TRUE),
(907, 227, 'C', 'Amplas kulit dan buat adonan abu', FALSE),
(908, 227, 'D', 'Buat adonan abu dan balut telur', FALSE),
(909, 228, 'A', 'Mengamplas kulit telur', FALSE),
(910, 228, 'B', 'Membuat adonan abu gosok', FALSE),
(911, 228, 'C', 'Menyimpan telur selama 14-21 hari', TRUE),
(912, 228, 'D', 'Merebus telur hingga matang', FALSE),
(913, 229, 'A', 'Pertama', FALSE),
(914, 229, 'B', 'Kedua', FALSE),
(915, 229, 'C', 'Ketiga', TRUE),
(916, 229, 'D', 'Keempat', FALSE),
(917, 230, 'A', 'Telur -> Kepompong -> Ulat -> Kupu-kupu', FALSE),
(918, 230, 'B', 'Telur -> Ulat -> Kepompong -> Kupu-kupu', TRUE),
(919, 230, 'C', 'Ulat -> Telur -> Kupu-kupu -> Kepompong', FALSE),
(920, 230, 'D', 'Kepompong -> Ulat -> Telur -> Kupu-kupu', FALSE),
(921, 231, 'A', 'Fase bertelur', FALSE),
(922, 231, 'B', 'Fase mencari nektar', FALSE),
(923, 231, 'C', 'Fase kepompong (pupa)', TRUE),
(924, 231, 'D', 'Fase imago (kupu-kupu)', FALSE),
(925, 232, 'A', 'Pertama', FALSE),
(926, 232, 'B', 'Kedua', FALSE),
(927, 232, 'C', 'Ketiga', TRUE),
(928, 232, 'D', 'Keempat', FALSE),
(929, 233, 'A', 'Anjungan daerah -> Museum tematik -> Danau buatan', FALSE),
(930, 233, 'B', 'Danau buatan -> Anjungan daerah -> Museum tematik', FALSE),
(931, 233, 'C', 'Anjungan daerah -> Danau buatan -> Museum tematik', TRUE),
(932, 233, 'D', 'Museum tematik -> Danau buatan -> Anjungan daerah', FALSE),
(933, 234, 'A', 'Wahana rekreasi keluarga', FALSE),
(934, 234, 'B', 'Miniatur kepulauan Indonesia di danau', TRUE),
(935, 234, 'C', 'Anjungan rumah adat', FALSE),
(936, 234, 'D', 'Museum Transportasi', FALSE),
(937, 235, 'A', 'Area depan dan pintu masuk', FALSE),
(938, 235, 'B', 'Danau buatan di tengah', FALSE),
(939, 235, 'C', 'Wahana kereta gantung', FALSE),
(940, 235, 'D', 'Museum tematik dan rekreasi keluarga', TRUE),
(941, 236, 'A', 'Ujung jari -> Ibu jari -> Telapak/punggung tangan', FALSE),
(942, 236, 'B', 'Telapak/punggung tangan -> Ujung jari -> Ibu jari', TRUE),
(943, 236, 'C', 'Ibu jari -> Telapak/punggung tangan -> Ujung jari', FALSE),
(944, 236, 'D', 'Ibu jari -> Ujung jari -> Telapak/punggung tangan', FALSE),
(945, 237, 'A', 'Membasahi telapak tangan', FALSE),
(946, 237, 'B', 'Mengeringkan tangan', FALSE),
(947, 237, 'C', 'Menggosok ibu jari memutar', TRUE),
(948, 237, 'D', 'Menutup keran air', FALSE),
(949, 238, 'A', 'Menggosok telapak tangan', FALSE),
(950, 238, 'B', 'Membilas dengan air mengalir', FALSE),
(951, 238, 'C', 'Mematikan keran', FALSE),
(952, 238, 'D', 'Mengeringkan menggunakan tisu/handuk', TRUE),
(953, 239, 'A', 'Arupadhatu -> Rupadhatu -> Kamadhatu', FALSE),
(954, 239, 'B', 'Rupadhatu -> Kamadhatu -> Arupadhatu', FALSE),
(955, 239, 'C', 'Kamadhatu -> Rupadhatu -> Arupadhatu', TRUE),
(956, 239, 'D', 'Kamadhatu -> Arupadhatu -> Rupadhatu', FALSE),
(957, 240, 'A', 'Alam tanpa wujud dan rupa', FALSE),
(958, 240, 'B', 'Alam yang masih terikat hawa nafsu', FALSE),
(959, 240, 'C', 'Alam suci para dewa', FALSE),
(960, 240, 'D', 'Alam peralihan (mulai meninggalkan duniawi namun terikat wujud)', TRUE),
(961, 241, 'A', 'Kebun sekolah terutama dibuat agar siswa memiliki tempat baru untuk beristirahat.', FALSE),
(962, 241, 'B', 'Kebun sekolah bermanfaat bagi lingkungan dan kegiatan siswa, tetapi manfaatnya bergantung pada perawatan serta pengelolaan yang tepat.', TRUE),
(963, 241, 'C', 'Perluasan kebun merupakan cara utama untuk membuat halaman sekolah lebih sejuk.', FALSE),
(964, 241, 'D', 'Tanaman di sekolah akan tumbuh baik selama seluruh halaman ditanami.', FALSE),
(965, 242, 'A', 'Siswa menanam cabai, tomat, bayam, dan tanaman obat.', FALSE),
(966, 242, 'B', 'Sekolah memasang papan informasi tentang nama tanaman.', FALSE),
(967, 242, 'C', 'Tanaman sempat mati ketika penyiraman tidak teratur, lalu kondisinya membaik setelah jadwal piket diperjelas.', TRUE),
(968, 242, 'D', 'Beberapa siswa menggunakan kebun untuk membaca atau berdiskusi.', FALSE),
(969, 243, 'A', 'Perluasan kebun sebaiknya dilakukan setelah sekolah memiliki data tentang tanaman yang sesuai.', TRUE),
(970, 243, 'B', 'Kebun yang dikelola tanpa pembagian tanggung jawab berisiko tidak memberikan manfaat secara optimal.', TRUE),
(971, 243, 'C', 'Keberadaan kebun membuat semua kegiatan siswa harus dipindahkan ke halaman belakang.', FALSE),
(972, 243, 'D', 'Kenyamanan yang dirasakan siswa menjadi salah satu manfaat tambahan dari perubahan halaman.', TRUE),
(973, 244, 'A', 'Kebun tetap pasti berkembang karena jumlah tanaman bertambah.', FALSE),
(974, 244, 'B', 'Manfaat kebun berpotensi menurun karena kondisi tanaman dapat kembali memburuk.', TRUE),
(975, 244, 'C', 'Suhu halaman akan selalu meningkat tanpa dipengaruhi kondisi tanaman.', FALSE),
(976, 244, 'D', 'Siswa tidak akan lagi menggunakan kebun untuk berdiskusi.', FALSE),
(977, 245, 'A', 'Program berhasil menghapus seluruh sampah plastik di sekolah.', FALSE),
(978, 245, 'B', 'Pengurangan sampah dapat terjadi ketika fasilitas dan perubahan kebiasaan siswa berjalan bersama, meskipun hasilnya belum sempurna.', TRUE),
(979, 245, 'C', 'Potongan harga merupakan satu-satunya faktor yang membuat siswa mengurangi penggunaan plastik.', FALSE),
(980, 245, 'D', 'Minuman kemasan harus segera dilarang agar program berhasil.', FALSE),
(981, 246, 'A', 'Sekolah menganggap sampah plastik tidak perlu dikurangi.', FALSE),
(982, 246, 'B', 'Pengelola memilih perubahan bertahap agar kebiasaan warga sekolah dapat menyesuaikan diri.', TRUE),
(983, 246, 'C', 'Minuman kemasan lebih ramah lingkungan daripada tumbler.', FALSE),
(984, 246, 'D', 'Siswa tidak diperbolehkan membawa tumbler ke sekolah.', FALSE),
(985, 247, 'A', 'Fasilitas pengisian air dapat membantu siswa mengurangi ketergantungan pada minuman kemasan.', TRUE),
(986, 247, 'B', 'Perubahan kebiasaan siswa masih menjadi bagian penting dari keberlanjutan program.', TRUE),
(987, 247, 'C', 'Program sudah tidak perlu dievaluasi karena jumlah gelas plastik telah turun.', FALSE),
(988, 247, 'D', 'Kampanye melalui contoh dari pengurus kelas berpotensi membantu pembentukan kebiasaan baru.', TRUE),
(989, 248, 'A', 'Evaluasi diperlukan untuk mengetahui apakah pengurangan sampah dapat dipertahankan dan diperbaiki.', TRUE),
(990, 248, 'B', 'Evaluasi dilakukan untuk menentukan siswa yang paling sering membeli minuman kemasan.', FALSE),
(991, 248, 'C', 'Evaluasi bertujuan menghapus seluruh pilihan minuman dari kantin.', FALSE),
(992, 248, 'D', 'Evaluasi hanya diperlukan jika jumlah sampah meningkat.', FALSE),
(993, 249, 'A', 'Menambah koleksi digital otomatis membuat semua warga mampu membaca secara daring.', FALSE),
(994, 249, 'B', 'Keberhasilan layanan digital bergantung bukan hanya pada koleksi, tetapi juga pada akses, perangkat, dan kemampuan pengguna.', TRUE),
(995, 249, 'C', 'Pelatihan pengguna tidak diperlukan jika perpustakaan menyediakan aplikasi.', FALSE),
(996, 249, 'D', 'Perpustakaan digital hanya bermanfaat bagi siswa yang memiliki ponsel pribadi.', FALSE),
(997, 250, 'A', 'Semua buku digital ternyata tidak dibaca.', FALSE),
(998, 250, 'B', 'Sebagian pengguna masih membutuhkan bantuan dan akses internet maupun perangkat belum merata.', TRUE),
(999, 250, 'C', 'Pengelola tidak mencatat jumlah pengguna aktif.', FALSE),
(1000, 250, 'D', 'Buku pengetahuan umum tidak diminati siswa.', FALSE),
(1001, 251, 'A', 'Pelatihan dapat meningkatkan kemampuan pengguna memanfaatkan layanan digital.', TRUE),
(1002, 251, 'B', 'Ketimpangan akses perangkat dapat memengaruhi kesempatan warga menggunakan perpustakaan digital.', TRUE),
(1003, 251, 'C', 'Jumlah koleksi merupakan satu-satunya ukuran keberhasilan program.', FALSE),
(1004, 251, 'D', 'Pendampingan masih diperlukan meskipun jumlah peminjaman meningkat.', TRUE),
(1005, 252, 'A', 'Semua pengguna akan tetap dapat menggunakan aplikasi tanpa kesulitan.', FALSE),
(1006, 252, 'B', 'Sebagian pengguna yang masih membutuhkan bantuan berpotensi mengalami kesulitan mengakses layanan.', TRUE),
(1007, 252, 'C', 'Jumlah buku digital akan otomatis berkurang.', FALSE),
(1008, 252, 'D', 'Sinyal internet di desa akan menjadi lebih stabil.', FALSE),
(1009, 253, 'A', 'Mengurangi ukuran porsi selalu membuat siswa makan lebih sedikit.', FALSE),
(1010, 253, 'B', 'Penyesuaian porsi berdasarkan kebutuhan dapat mengurangi makanan terbuang tanpa menghilangkan pilihan makanan.', TRUE),
(1011, 253, 'C', 'Harga murah merupakan penyebab utama semua jenis sampah di sekolah.', FALSE),
(1012, 253, 'D', 'Siswa harus dilarang membeli makanan dalam jumlah banyak.', FALSE),
(1013, 254, 'A', 'Siswa yang mengambil porsi sesuai kebutuhan lebih kecil kemungkinannya menyisakan makanan.', TRUE),
(1014, 254, 'B', 'Semua siswa lebih menyukai makanan dengan porsi kecil.', FALSE),
(1015, 254, 'C', 'Porsi kecil membuat harga seluruh makanan menjadi lebih murah.', FALSE),
(1016, 254, 'D', 'Kantin tidak lagi perlu menyediakan makanan dalam jumlah banyak.', FALSE),
(1017, 255, 'A', 'Keputusan sebelum membeli makanan dapat memengaruhi jumlah sampah yang dihasilkan.', TRUE),
(1018, 255, 'B', 'Pengurangan sisa makanan dapat dilakukan tanpa menyalahkan kelompok siswa tertentu.', TRUE),
(1019, 255, 'C', 'Menyediakan hanya satu ukuran porsi merupakan cara yang paling sesuai.', FALSE),
(1020, 255, 'D', 'Pengamatan selama dua minggu membantu kantin menentukan perubahan yang dilakukan.', TRUE),
(1021, 256, 'A', 'Sisa makanan berpotensi meningkat karena kondisi yang sebelumnya berkaitan dengan banyaknya sisa muncul kembali.', TRUE),
(1022, 256, 'B', 'Sisa makanan pasti menjadi nol karena siswa sudah mengetahui masalahnya.', FALSE),
(1023, 256, 'C', 'Harga makanan otomatis menjadi lebih mahal.', FALSE),
(1024, 256, 'D', 'Semua siswa akan berhenti membeli makanan.', FALSE),
(1025, 257, 'A', 'Teknologi tenaga surya dapat memberi manfaat penerangan, tetapi keberlanjutannya memerlukan pemantauan dan perawatan.', TRUE),
(1026, 257, 'B', 'Lampu tenaga surya selalu bekerja dengan terang tanpa dipengaruhi cuaca.', FALSE),
(1027, 257, 'C', 'Pemasangan lebih banyak lampu pasti lebih penting daripada biaya perawatan.', FALSE),
(1028, 257, 'D', 'Warga tidak perlu terlibat setelah lampu dipasang.', FALSE),
(1029, 258, 'A', 'Lampu yang sudah dipasang tidak memberikan manfaat.', FALSE),
(1030, 258, 'B', 'Pemerintah ingin mempertimbangkan data penggunaan dan biaya perawatan sebelum memperluas program.', TRUE),
(1031, 258, 'C', 'Warga menolak penggunaan energi surya.', FALSE),
(1032, 258, 'D', 'Panel surya hanya dapat digunakan di jalan menuju dermaga.', FALSE),
(1033, 259, 'A', 'Kondisi panel dapat memengaruhi kinerja penerangan.', TRUE),
(1034, 259, 'B', 'Teknologi baru tetap membutuhkan pemeliharaan.', TRUE),
(1035, 259, 'C', 'Gangguan penggunaan tidak perlu dicatat karena dapat diperbaiki kapan saja.', FALSE),
(1036, 259, 'D', 'Keterlibatan warga dapat membantu menjaga keberlanjutan penggunaan lampu.', TRUE),
(1037, 260, 'A', 'Perluasan lampu sebaiknya dipertimbangkan kembali setelah evaluasi.', TRUE),
(1038, 260, 'B', 'Semua lampu yang ada harus segera dilepas.', FALSE),
(1039, 260, 'C', 'Data biaya tidak perlu diperhatikan karena jalan sudah terang.', FALSE),
(1040, 260, 'D', 'Warga harus mengganti panel surya dengan senter.', FALSE),
(1041, 261, 'A', 'Jadwal membuat kapasitas embung bertambah.', FALSE),
(1042, 261, 'B', 'Pengambilan air disesuaikan dengan kebutuhan sehingga penggunaan tidak dilakukan secara berlebihan.', TRUE),
(1043, 261, 'C', 'Petani tidak lagi membutuhkan air untuk tanaman.', FALSE),
(1044, 261, 'D', 'Jadwal membuat hujan turun lebih sering.', FALSE),
(1045, 262, 'A', 'Karena kapasitas terbatas, penggunaan perlu diatur agar cadangan tidak cepat habis dan tetap dapat dibagi.', TRUE),
(1046, 262, 'B', 'Karena kapasitas terbatas, petani tidak boleh menggunakan air sama sekali.', FALSE),
(1047, 262, 'C', 'Aturan dibuat agar embung selalu penuh setiap saat.', FALSE),
(1048, 262, 'D', 'Kapasitas terbatas menyebabkan semua lahan memperoleh air dalam jumlah sama.', FALSE),
(1049, 263, 'A', 'Penggunaan air terlalu sering menyebabkan persediaan embung turun lebih cepat.', TRUE),
(1050, 263, 'B', 'Jadwal pengambilan membantu mengendalikan penurunan volume air.', TRUE),
(1051, 263, 'C', 'Perbaikan saluran masuk membuat petani tidak perlu lagi menghemat air.', FALSE),
(1052, 263, 'D', 'Pembagian air yang terencana membantu menjaga kesempatan petani lain memperoleh air.', TRUE),
(1053, 264, 'A', 'Persediaan air berpotensi turun lebih cepat dan pembagian kepada petani lain menjadi lebih sulit.', TRUE),
(1054, 264, 'B', 'Kapasitas embung otomatis meningkat.', FALSE),
(1055, 264, 'C', 'Semua lahan memperoleh air lebih banyak.', FALSE),
(1056, 264, 'D', 'Kebutuhan air tanaman menjadi berkurang.', FALSE),
(1057, 265, 'A', 'Karena perbedaan prosedur dapat menyebabkan hasil pengukuran berbeda sehingga perbandingan kurang dapat dipercaya.', TRUE),
(1058, 265, 'B', 'Karena buah tidak dapat menghasilkan energi listrik.', FALSE),
(1059, 265, 'C', 'Karena semua buah harus memiliki ukuran yang sama.', FALSE),
(1060, 265, 'D', 'Karena alat ukur hanya boleh digunakan sekali.', FALSE),
(1061, 266, 'A', 'Prosedur yang seragam membuat hasil lebih mudah dibandingkan sehingga dugaan dapat dipisahkan dari bukti.', TRUE),
(1062, 266, 'B', 'Prosedur seragam membuat semua buah menghasilkan tegangan yang sama.', FALSE),
(1063, 266, 'C', 'Prosedur seragam membuktikan bahwa suhu tidak memengaruhi hasil.', FALSE),
(1064, 266, 'D', 'Prosedur seragam membuat percobaan tidak memerlukan pengukuran.', FALSE),
(1065, 267, 'A', 'Kondisi buah dapat memengaruhi tegangan yang dihasilkan.', TRUE),
(1066, 267, 'B', 'Ketidakkonsistenan prosedur dapat memperbesar perbedaan hasil.', TRUE),
(1067, 267, 'C', 'Satu kali percobaan cukup untuk menetapkan angka yang berlaku pada semua keadaan.', FALSE),
(1068, 267, 'D', 'Pencatatan prosedur membantu siswa menilai temuan secara lebih hati-hati.', TRUE),
(1069, 268, 'A', 'Agar pembaca dapat membedakan informasi yang benar-benar diukur dari penafsiran yang masih perlu dibuktikan.', TRUE),
(1070, 268, 'B', 'Agar laporan menjadi lebih panjang.', FALSE),
(1071, 268, 'C', 'Agar semua dugaan dianggap sebagai fakta.', FALSE),
(1072, 268, 'D', 'Agar hasil yang berbeda dapat dihapus dari laporan.', FALSE),
(1073, 269, 'A', 'Dukungan tersebut membuat perjalanan lebih terarah dan aman bagi siswa yang memilih bersepeda.', TRUE),
(1074, 269, 'B', 'Semua siswa diwajibkan menggunakan sepeda.', FALSE),
(1075, 269, 'C', 'Jalur sepeda membuat jarak rumah siswa menjadi lebih dekat.', FALSE),
(1076, 269, 'D', 'Hujan menjadi lebih jarang turun.', FALSE),
(1077, 270, 'A', 'Hujan menjadi salah satu kondisi yang memengaruhi keamanan dan kesiapan perjalanan.', TRUE),
(1078, 270, 'B', 'Hujan membuat jalur sepeda hilang.', FALSE),
(1079, 270, 'C', 'Hujan menyebabkan semua siswa tinggal lebih jauh dari sekolah.', FALSE),
(1080, 270, 'D', 'Hujan membuktikan program bersepeda tidak bermanfaat.', FALSE),
(1081, 271, 'A', 'Dukungan lingkungan dapat mendorong penggunaan sepeda.', TRUE),
(1082, 271, 'B', 'Kondisi cuaca dapat memengaruhi pilihan transportasi.', TRUE),
(1083, 271, 'C', 'Banyaknya pesepeda menjadi satu-satunya ukuran keberhasilan program.', FALSE),
(1084, 271, 'D', 'Jarak tempat tinggal dapat memengaruhi kemudahan siswa bersepeda.', TRUE),
(1085, 272, 'A', 'Karena pilihan transportasi dipengaruhi kondisi yang berubah, sehingga satu kondisi cuaca tidak cukup untuk menilai keseluruhan program.', TRUE),
(1086, 272, 'B', 'Karena siswa sebenarnya tidak menggunakan sepeda.', FALSE),
(1087, 272, 'C', 'Karena hujan hanya terjadi di luar jam sekolah.', FALSE),
(1088, 272, 'D', 'Karena sekolah tidak mencatat jumlah pesepeda.', FALSE),
(1089, 273, 'A', 'Karena ikan tersebut belum pasti aman dan dapat membawa risiko jika berkembang tanpa pengawasan.', TRUE),
(1090, 273, 'B', 'Karena semua ikan asing pasti berukuran kecil.', FALSE),
(1091, 273, 'C', 'Karena ikan lokal tidak dapat hidup di kolam.', FALSE),
(1092, 273, 'D', 'Karena warga dilarang memelihara ikan.', FALSE),
(1093, 274, 'A', 'Hasil pemeriksaan menunjukkan ikan bukan jenis yang biasa dibudidayakan, sehingga pemisahan menjadi langkah pencegahan sambil menunggu penilaian lebih lanjut.', TRUE),
(1094, 274, 'B', 'Pemeriksaan membuktikan ikan tersebut pasti berbahaya.', FALSE),
(1095, 274, 'C', 'Pemeriksaan membuat ikan tidak dapat hidup di air.', FALSE),
(1096, 274, 'D', 'Pemisahan dilakukan karena ikan berukuran terlalu besar.', FALSE),
(1097, 275, 'A', 'Ketidakpastian tentang dampak menjadi alasan untuk melakukan pencegahan.', TRUE),
(1098, 275, 'B', 'Identifikasi yang lebih pasti diperlukan sebelum keputusan akhir dibuat.', TRUE),
(1099, 275, 'C', 'Ikan yang terlihat sehat pasti tidak berisiko bagi ekosistem.', FALSE),
(1100, 275, 'D', 'Larangan menyebarkan ikan membantu mencegah perluasan ke lingkungan lain.', TRUE),
(1101, 276, 'A', 'Karena pihak berwenang masih membutuhkan informasi untuk menentukan langkah berdasarkan identifikasi yang lebih pasti.', TRUE),
(1102, 276, 'B', 'Karena ikan tersebut sudah terbukti aman.', FALSE),
(1103, 276, 'C', 'Karena ikan tidak dapat dipindahkan.', FALSE),
(1104, 276, 'D', 'Karena semua ikan asing harus dipelihara.', FALSE),
(1105, 277, 'A', 'Untuk mengurangi kemungkinan debu atau kotoran dari wadah memengaruhi hasil pengamatan.', TRUE),
(1106, 277, 'B', 'Untuk memastikan semua partikel berasal dari plastik.', FALSE),
(1107, 277, 'C', 'Untuk membuat jumlah partikel selalu lebih banyak.', FALSE),
(1108, 277, 'D', 'Untuk menghilangkan kebutuhan membandingkan sampel.', FALSE),
(1109, 278, 'A', 'Metode yang tepat diperlukan agar keberadaan partikel dapat dibedakan dari dugaan tentang asal atau jenisnya.', TRUE),
(1110, 278, 'B', 'Metode yang tepat membuat semua partikel pasti berasal dari plastik.', FALSE),
(1111, 278, 'C', 'Metode yang tepat membuat hasil penelitian tidak perlu dibandingkan.', FALSE),
(1112, 278, 'D', 'Metode yang tepat menghilangkan semua ketidakpastian penelitian.', FALSE),
(1113, 279, 'A', 'Wadah terbuka dapat menjadi salah satu sumber kesalahan pengamatan.', TRUE),
(1114, 279, 'B', 'Prosedur yang sama membantu membandingkan hasil dari lokasi berbeda.', TRUE),
(1115, 279, 'C', 'Menemukan partikel langsung membuktikan bahwa semua partikel adalah mikroplastik.', FALSE),
(1116, 279, 'D', 'Bukti yang terbatas membuat peneliti perlu membatasi kesimpulan.', TRUE),
(1117, 280, 'A', 'Agar hubungan antara bukti dan kesimpulan tetap jelas dan siswa tidak menyatakan dugaan sebagai fakta.', TRUE),
(1118, 280, 'B', 'Agar semua pertanyaan penelitian dapat langsung dijawab.', FALSE),
(1119, 280, 'C', 'Agar jumlah data yang dikumpulkan berkurang.', FALSE),
(1120, 280, 'D', 'Agar hasil penelitian terlihat lebih meyakinkan meskipun belum terbukti.', FALSE),
(1121, 281, 'A', 'Mempertimbangkan perluasan taman atap setelah pemeriksaan keamanan dan biaya.', TRUE),
(1122, 281, 'B', 'Menghentikan pengukuran suhu.', FALSE),
(1123, 281, 'C', 'Mengganti seluruh tanaman dengan paving.', FALSE),
(1124, 281, 'D', 'Mengabaikan kondisi konstruksi atap.', FALSE),
(1125, 282, 'A', 'Data tersebut dapat memperkuat pertimbangan sekolah terhadap manfaat taman atap.', TRUE),
(1126, 282, 'B', 'Sekolah pasti memperluas seluruh atap tanpa pemeriksaan lain.', FALSE),
(1127, 282, 'C', 'Tanaman tidak lagi membutuhkan perawatan.', FALSE),
(1128, 282, 'D', 'Biaya perawatan otomatis menjadi nol.', FALSE),
(1129, 283, 'A', 'Sekolah kemungkinan mengumpulkan data tambahan sebelum memutuskan perluasan.', TRUE),
(1130, 283, 'B', 'Jenis tanaman yang kurang sesuai dapat diganti atau disesuaikan.', TRUE),
(1131, 283, 'C', 'Keputusan perluasan hanya akan didasarkan pada penurunan suhu.', FALSE),
(1132, 283, 'D', 'Keamanan konstruksi dan drainase kemungkinan diperiksa sebelum perluasan.', TRUE),
(1133, 284, 'A', 'Sekolah menunda atau meninjau kembali perluasan taman atap.', TRUE),
(1134, 284, 'B', 'Sekolah mengabaikan biaya karena suhu lebih rendah.', FALSE),
(1135, 284, 'C', 'Sekolah langsung menutup seluruh atap dengan tanaman.', FALSE),
(1136, 284, 'D', 'Sekolah menghentikan semua kegiatan pencatatan.', FALSE),
(1137, 285, 'A', 'Mempertahankan atau memperluas layanan berdasarkan data yang terkumpul.', TRUE),
(1138, 285, 'B', 'Menghapus rute yang paling sering digunakan.', FALSE),
(1139, 285, 'C', 'Menghentikan pencatatan biaya operasional.', FALSE),
(1140, 285, 'D', 'Mewajibkan semua orang tua menggunakan bus.', FALSE),
(1141, 286, 'A', 'Sebagian siswa berpotensi terlambat karena kapasitas layanan berkurang.', TRUE),
(1142, 286, 'B', 'Jumlah penumpang otomatis meningkat.', FALSE),
(1143, 286, 'C', 'Biaya operasional menjadi nol.', FALSE),
(1144, 286, 'D', 'Rute bus menjadi lebih dekat dengan semua permukiman.', FALSE),
(1145, 287, 'A', 'Data jumlah penumpang akan digunakan untuk menilai kebutuhan kendaraan tambahan.', TRUE),
(1146, 287, 'B', 'Ketepatan waktu menjadi salah satu pertimbangan evaluasi rute.', TRUE),
(1147, 287, 'C', 'Jika penggunaan rendah, sekolah pasti menambah bus.', FALSE),
(1148, 287, 'D', 'Jika layanan konsisten dan membantu mengurangi kendaraan pribadi, sekolah dapat mempertimbangkan perluasan.', TRUE),
(1149, 288, 'A', 'Mengevaluasi kembali rute menggunakan data perjalanan dan masukan pengguna.', TRUE),
(1150, 288, 'B', 'Mempertahankan rute tanpa melihat data.', FALSE),
(1151, 288, 'C', 'Menghapus seluruh layanan bus pada hari berikutnya.', FALSE),
(1152, 288, 'D', 'Menganggap jumlah penumpang tidak penting.', FALSE),
(1153, 289, 'A', 'Menggunakan pola catatan tersebut pada semester berikutnya.', TRUE),
(1154, 289, 'B', 'Menghapus program membaca.', FALSE),
(1155, 289, 'C', 'Menentukan keberhasilan hanya dari jumlah halaman.', FALSE),
(1156, 289, 'D', 'Mewajibkan semua siswa membaca buku yang sama.', FALSE),
(1157, 290, 'A', 'Meninjau kembali pelaksanaan program karena peningkatan minat belum tentu berarti partisipasi program berjalan baik.', TRUE),
(1158, 290, 'B', 'Menyimpulkan program pasti berhasil sepenuhnya.', FALSE),
(1159, 290, 'C', 'Menghapus perpustakaan sekolah.', FALSE),
(1160, 290, 'D', 'Mengukur keberhasilan hanya dari ketebalan buku.', FALSE),
(1161, 291, 'A', 'Sekolah kemungkinan mempertahankan catatan membaca yang singkat jika tidak mengurangi minat siswa.', TRUE),
(1162, 291, 'B', 'Perpustakaan kemungkinan menambah rak rekomendasi berdasarkan tema.', TRUE),
(1163, 291, 'C', 'Sekolah kemungkinan menetapkan jumlah halaman sebagai ukuran utama karena tujuan program adalah membaca sebanyak mungkin.', FALSE),
(1164, 291, 'D', 'Data partisipasi dan survei minat baca kemungkinan digunakan dalam evaluasi akhir semester.', TRUE),
(1165, 292, 'A', 'Menyederhanakan atau menyesuaikan bentuk catatan agar tujuan membangun kebiasaan membaca tetap tercapai.', TRUE),
(1166, 292, 'B', 'Menambah jumlah tugas menulis setiap hari.', FALSE),
(1167, 292, 'C', 'Mengukur keberhasilan hanya dari jumlah buku selesai.', FALSE),
(1168, 292, 'D', 'Menghentikan semua kegiatan membaca tanpa evaluasi.', FALSE),
(1169, 293, 'A', 'Menambah beberapa instalasi hidroponik.', TRUE),
(1170, 293, 'B', 'Menghentikan pencatatan penggunaan air.', FALSE),
(1171, 293, 'C', 'Mengurangi luas tanam.', FALSE),
(1172, 293, 'D', 'Mengabaikan biaya perawatan.', FALSE),
(1173, 294, 'A', 'Sistem kemungkinan tetap digunakan dalam skala kecil sebagai proyek pembelajaran.', TRUE),
(1174, 294, 'B', 'Sekolah pasti menambah seluruh instalasi.', FALSE),
(1175, 294, 'C', 'Semua tanaman akan dipindahkan ke atap sekolah.', FALSE),
(1176, 294, 'D', 'Data perawatan tidak lagi dicatat.', FALSE),
(1177, 295, 'A', 'Sekolah kemungkinan menunggu data yang cukup sebelum memperluas hidroponik.', TRUE),
(1178, 295, 'B', 'Perbandingan penggunaan air perlu mempertimbangkan luas tanam yang setara.', TRUE),
(1179, 295, 'C', 'Pertumbuhan baik selama beberapa minggu pasti cukup untuk membuktikan sistem mudah dirawat sepanjang tahun.', FALSE),
(1180, 295, 'D', 'Biaya listrik dan perawatan kemungkinan menjadi bagian dari keputusan perluasan.', TRUE),
(1181, 296, 'A', 'Memeriksa sistem dan memperbaiki bagian yang bocor sebelum menilai kembali penggunaan air.', TRUE),
(1182, 296, 'B', 'Menganggap peningkatan penggunaan air tidak berkaitan dengan kebocoran.', FALSE),
(1183, 296, 'C', 'Menambah instalasi baru tanpa pemeriksaan.', FALSE),
(1184, 296, 'D', 'Menghentikan pencatatan air.', FALSE),
(1185, 297, 'A', 'Mempertimbangkan memasang papan informasi serupa di titik tersebut.', TRUE),
(1186, 297, 'B', 'Menghapus papan yang sudah ada.', FALSE),
(1187, 297, 'C', 'Menghentikan pencatatan ketinggian air.', FALSE),
(1188, 297, 'D', 'Menyimpulkan banjir pasti terjadi setiap hujan.', FALSE),
(1189, 298, 'A', 'Kenaikan muka air dapat berlangsung lebih cepat dibandingkan ketika saluran telah dibersihkan.', TRUE),
(1190, 298, 'B', 'Air pasti tidak akan naik karena papan informasi sudah terpasang.', FALSE),
(1191, 298, 'C', 'Curah hujan otomatis menjadi lebih rendah.', FALSE),
(1192, 298, 'D', 'Warga tidak perlu memantau kondisi saluran.', FALSE),
(1193, 299, 'A', 'Data rutin dapat digunakan untuk memahami pola genangan.', TRUE),
(1194, 299, 'B', 'Papan serupa dapat dipertimbangkan jika pola di titik lain juga jelas.', TRUE),
(1195, 299, 'C', 'Papan dapat memastikan kapan banjir pasti terjadi.', FALSE),
(1196, 299, 'D', 'Perubahan muka air yang cepat kemungkinan akan dilaporkan kepada petugas.', TRUE),
(1197, 300, 'A', 'Pola kenaikan air akan lebih sulit dikenali karena data tidak lengkap.', TRUE),
(1198, 300, 'B', 'Papan otomatis memberikan peringatan yang lebih akurat.', FALSE),
(1199, 300, 'C', 'Saluran akan lebih cepat bersih.', FALSE),
(1200, 300, 'D', 'Curah hujan dapat diketahui tanpa pengamatan.', FALSE),
(1201, 301, 'A', 'Membeli pupuk kimia di toko untuk menyuburkan tanaman hias di halaman.', FALSE),
(1202, 301, 'B', 'Memisahkan sisa sayuran dapur untuk diolah menjadi kompos tanaman.', TRUE),
(1203, 301, 'C', 'Membakar seluruh sampah rumah tangga di pekarangan belakang rumah.', FALSE),
(1204, 301, 'D', 'Mengurangi konsumsi makanan olahan agar sampah plastik berkurang.', FALSE),
(1205, 302, 'A', 'Menggunakan kereta komuter untuk berangkat kerja sehari-hari.', TRUE),
(1206, 302, 'B', 'Membeli kendaraan pribadi baru agar perjalanan terasa lebih nyaman.', FALSE),
(1207, 302, 'C', 'Memanfaatkan layanan bus kota saat berpergian ke pusat kota.', TRUE),
(1208, 302, 'D', 'Mengendarai sepeda motor pribadi untuk menghindari kemacetan.', FALSE),
(1209, 303, 'A', 'Mengonsumsi camilan kemasan tanpa melihat kandungan gizinya.', FALSE),
(1210, 303, 'B', 'Memeriksa kadar gula pada kemasan minuman sebelum membelinya di kantin.', TRUE),
(1211, 303, 'C', 'Menghindari semua jenis makanan yang dijual di supermarket.', FALSE),
(1212, 303, 'D', 'Memilih makanan berdasarkan warna kemasan yang menarik.', FALSE),
(1213, 304, 'A', 'Kegiatan warga pesisir bergotong royong menanam bibit mangrove di tepi pantai.', TRUE),
(1214, 304, 'B', 'Penambangan pasir pantai secara masif untuk bahan bangunan rumah.', FALSE),
(1215, 304, 'C', 'Pembangunan tanggul beton tinggi di sepanjang permukiman warga.', FALSE),
(1216, 304, 'D', 'Pembersihan sampah plastik yang mengapung di lautan lepas.', FALSE),
(1217, 305, 'A', 'Budi membayar belanjaan di minimarket menggunakan pemindaian kode QR.', TRUE),
(1218, 305, 'B', 'Ani mengambil seluruh uangnya di ATM untuk disimpan di dompet.', FALSE),
(1219, 305, 'C', 'Pedagang kantin menyediakan metode pembayaran nontunai bagi pembeli.', TRUE),
(1220, 305, 'D', 'Ayah selalu menyimpan uang kertas dalam jumlah banyak saat bepergian.', FALSE),
(1221, 306, 'A', 'Mematikan lampu kamar saat tidur malam.', FALSE),
(1222, 306, 'B', 'Menjauhkan ponsel satu jam sebelum tidur.', TRUE),
(1223, 306, 'C', 'Menggunakan ponsel sambil mengisi daya baterai.', FALSE),
(1224, 306, 'D', 'Mengatur kecerahan layar gawai di siang hari.', FALSE),
(1225, 307, 'A', 'Membiarkan keran wastafel sekolah terbuka sedikit agar air tetap mengalir.', FALSE),
(1226, 307, 'B', 'Menutup rapat keran air di toilet sekolah setelah selesai menggunakannya.', TRUE),
(1227, 307, 'C', 'Menyiram halaman sekolah yang luas menggunakan air bersih selang setiap jam.', FALSE),
(1228, 307, 'D', 'Menggunakan air minum kemasan untuk mencuci tangan di kelas.', FALSE),
(1229, 308, 'A', 'Membeli sayuran segar langsung dari petani di pasar tradisional setempat.', TRUE),
(1230, 308, 'B', 'Mengimpor buah dan sayur dari luar negeri untuk konsumsi harian.', FALSE),
(1231, 308, 'C', 'Mengonsumsi hasil panen kebun organik tetangga di sekitar rumah.', TRUE),
(1232, 308, 'D', 'Mengandalkan makanan cepat saji berbasis daging olahan.', FALSE),
(1233, 309, 'A', 'Bermain gim daring di kamar seharian penuh.', FALSE),
(1234, 309, 'B', 'Berjalan kaki atau berolahraga ringan di sore hari.', TRUE),
(1235, 309, 'C', 'Tidur siang berlebihan hingga malam hari.', FALSE),
(1236, 309, 'D', 'Duduk membaca komik tanpa jeda istirahat.', FALSE),
(1237, 310, 'A', 'Menyediakan tempat sampah terpisah untuk plastik dan sisa makanan.', TRUE),
(1238, 310, 'B', 'Mencampur seluruh jenis sampah ke dalam satu kantong plastik besar.', FALSE),
(1239, 310, 'C', 'Membuang baterai bekas langsung ke selokan depan rumah.', FALSE),
(1240, 310, 'D', 'Mengumpulkan sampah kertas untuk dibakar di halaman.', FALSE),
(1241, 311, 'A', 'Menyimpan tas kain di dalam bagasi motor untuk dipakai saat belanja.', TRUE),
(1242, 311, 'B', 'Meminta kantong plastik berlapis saat membeli barang-barang kecil.', FALSE),
(1243, 311, 'C', 'Menolak penggunaan kantong plastik tambahan di minimarket.', TRUE),
(1244, 311, 'D', 'Membuang kantong plastik langsung ke sungai setelah dipakai.', FALSE),
(1245, 312, 'A', 'Langsung meneruskan pesan tersebut ke seluruh kontak tanpa membaca.', FALSE),
(1246, 312, 'B', 'Memeriksa kebenaran berita melalui situs resmi atau media terpercaya.', TRUE),
(1247, 312, 'C', 'Menyebarkan pesan tersebut jika judulnya terlihat sangat heboh.', FALSE),
(1248, 312, 'D', 'Menghapus akun media sosial agar tidak menerima berita apapun.', FALSE),
(1249, 313, 'A', 'Menanami pot-pot kosong di teras rumah dengan rimpang jahe dan kunyit.', TRUE),
(1250, 313, 'B', 'Mengganti seluruh tanaman obat di pekarangan dengan rumput sintetis.', FALSE),
(1251, 313, 'C', 'Membeli obat kimia sintetis tanpa resep dokter untuk setiap gejala sakit.', FALSE),
(1252, 313, 'D', 'Membiarkan pekarangan ditumbuhi rumput liar yang mengganggu.', FALSE),
(1253, 314, 'A', 'Kerja bakti membersihkan sampah di saluran air desa setiap akhir pekan.', TRUE),
(1254, 314, 'B', 'Menguras dan menutup tempat penampungan air secara teratur.', TRUE),
(1255, 314, 'C', 'Membiarkan kaleng bekas berisi air hujan menumpuk di pekarangan.', FALSE),
(1256, 314, 'D', 'Menutup saluran pembuangan air menggunakan papan kayu permanently.', FALSE),
(1257, 315, 'A', 'Membiarkan lampu pijar terus menyala sepanjang hari.', FALSE),
(1258, 315, 'B', 'Mengganti bohlam lama di rumah dengan lampu LED hemat energi.', TRUE),
(1259, 315, 'C', 'Menambah jumlah titik lampu pijar di setiap sudut ruangan.', FALSE),
(1260, 315, 'D', 'Menggunakan lilin sebagai penerangan utama di dalam rumah.', FALSE),
(1261, 316, 'A', 'Mencuci tangan hanya memakai air kobokan sebelum makan siang.', FALSE),
(1262, 316, 'B', 'Mengelap tangan di celana/rok sebelum menyantap makanan.', FALSE),
(1263, 316, 'C', 'Mencuci tangan memakai sabun di wastafel sekolah sebelum makan.', TRUE),
(1264, 316, 'D', 'Menggunakan tisu basah harum tanpa membilasnya dengan air.', FALSE),
(1265, 317, 'A', 'Mengumpulkan tugas sekolah melalui platform dalam jaringan (daring).', TRUE),
(1266, 317, 'B', 'Mencetak seluruh buku teks ke dalam lembaran kertas baru.', FALSE),
(1267, 317, 'C', 'Menggunakan media ujian berbasis komputer atau gawai.', TRUE),
(1268, 317, 'D', 'Memfotokopi materi pelajaran berlembar-lembar untuk setiap siswa.', FALSE),
(1269, 318, 'A', 'Mengganti knalpot motor dengan jenis knalpot brong bersuara nyaring.', FALSE),
(1270, 318, 'B', 'Menggunakan knalpot standar pabrik dan tidak menggeber motor di permukiman.', TRUE),
(1271, 318, 'C', 'Mengendarai sepeda motor dengan kecepatan tinggi di lorong sempit.', FALSE),
(1272, 318, 'D', 'Membunyikan klakson secara berulang-ulang di depan tempat ibadah.', FALSE),
(1273, 319, 'A', 'Menikmati olahan singkong rebus dan ubi kukus pengganti nasi.', TRUE),
(1274, 319, 'B', 'Mengonsumsi nasi goreng dengan pelengkap mi instan goreng.', FALSE),
(1275, 319, 'C', 'Membeli roti gandum impor setiap pagi untuk seluruh keluarga.', FALSE),
(1276, 319, 'D', 'Menghindari segala jenis bahan pangan karbohidrat lokal.', FALSE),
(1277, 320, 'A', 'Bersepeda bersama keluarga di area bebas kendaraan bermotor.', TRUE),
(1278, 320, 'B', 'Masing-masing anggota keluarga sibuk bermain gawai di kamar.', FALSE),
(1279, 320, 'C', 'Jalan santai bersama seluruh anggota keluarga di taman kota.', TRUE),
(1280, 320, 'D', 'Ayah dan ibu pergi berlibur tanpa mengajak anak-anak.', FALSE),
(1281, 321, 'A', 'Teh hijau mengandung katekin yang membakar lemak tubuh secara cepat.', FALSE),
(1282, 321, 'B', 'Teh hijau memiliki antioksidan yang bermanfaat untuk kesehatan kulit.', TRUE),
(1283, 321, 'C', 'Sinar matahari merupakan satu-satunya penyebab kerusakan jaringan sel kulit.', FALSE),
(1284, 321, 'D', 'Teh hijau harus diminum bersama makanan berlemak tinggi.', FALSE),
(1285, 322, 'A', 'Kedua teks membahas tentang pemanfaatan perpustakaan digital sekolah.', TRUE),
(1286, 322, 'B', 'Teks B menjelaskan dampak perpustakaan digital terhadap kunjungan perpustakaan fisik.', TRUE),
(1287, 322, 'C', 'Teks A menyatakan bahwa buku fisik tidak lagi diproduksi oleh sekolah.', FALSE),
(1288, 322, 'D', 'Kedua teks menyebutkan bahwa e-book hanya bisa dibaca pada malam hari.', FALSE),
(1289, 323, 'A', 'Taman kota tersebut sudah sempurna karena memiliki fasilitas Wi-Fi gratis.', FALSE),
(1290, 323, 'B', 'Fasilitas rekreasi yang lengkap tidak diimbangi dengan jumlah tempat sampah yang memadai.', TRUE),
(1291, 323, 'C', 'Pengunjung taman tidak memanfaatkan jalur joging dengan maksimal.', FALSE),
(1292, 323, 'D', 'Area bermain anak seharusnya diganti menjadi lahan parkir kendaraan.', FALSE),
(1293, 324, 'A', 'Kata "selain" menghubungkan dua kalimat yang bertentangan.', FALSE),
(1294, 324, 'B', 'Kata "selain faktor alam" memperkuat/menambahkan alasan penyebab banjir selain curah hujan.', TRUE),
(1295, 324, 'C', 'Kata "sebab" diletakkan di awal kalimat untuk menyimpulkan isi wacana.', FALSE),
(1296, 324, 'D', 'Kata "turut" digunakan untuk membandingkan dua bencana yang berbeda.', FALSE),
(1297, 325, 'A', 'Kedua teks mengulas manfaat tanaman lidah buaya bagi tubuh.', TRUE),
(1298, 325, 'B', 'Teks 1 berfokus pada manfaat lidah buaya untuk kulit, sedangkan Teks 2 untuk rambut.', TRUE),
(1299, 325, 'C', 'Teks 1 dan Teks 2 menyebutkan bahwa lidah buaya berbahaya jika dioleskan.', FALSE),
(1300, 325, 'D', 'Kedua teks sepakat bahwa lidah buaya hanya bisa tumbuh di daerah gurun.', FALSE),
(1301, 326, 'A', 'Penyerapan zat beracun oleh tumbuhan hijau.', FALSE),
(1302, 326, 'B', 'Pancaran atau pengeluaran sisa pembakaran gas ke udara.', TRUE),
(1303, 326, 'C', 'Pengendapan limbah padat di dalam tanah.', FALSE),
(1304, 326, 'D', 'Pembentukan energi baru dari aliran air.', FALSE),
(1305, 327, 'A', 'Informasi kedua teks saling bertentangan secara kuantitatif.', FALSE),
(1306, 327, 'B', 'Informasi kedua teks saling cocok dan akurat (10% dari 500 ton adalah 50 ton).', TRUE),
(1307, 327, 'C', 'Teks A tidak akurat karena jumlah sampah plastik terlalu sedikit.', FALSE),
(1308, 327, 'D', 'Teks B tidak akurat karena daur ulang seharusnya mencapai 100%.', FALSE),
(1309, 328, 'A', 'Menggunakan istilah teknis seperti "cagar budaya" dan "kelembapan".', TRUE),
(1310, 328, 'B', 'Memakai makna denotatif untuk memberikan fakta yang jelas.', TRUE),
(1311, 328, 'C', 'Menggunakan gaya bahasa kiasan dan majas hiperbola secara dominan.', FALSE),
(1312, 328, 'D', 'Menggunakan alur cerita rekaan berbentuk dongeng.', FALSE),
(1313, 329, 'A', 'Judul sangat sesuai karena menjelaskan panduan perawatan panel surya.', FALSE),
(1314, 329, 'B', 'Judul tidak sesuai karena isi teks menjelaskan prinsip kerja dan keunggulan PLTS.', TRUE),
(1315, 329, 'C', 'Judul cukup sesuai karena sama-sama membahas masalah kelistrikan.', FALSE),
(1316, 329, 'D', 'Judul sangat sesuai karena berfokus pada teknologi ramah lingkungan.', FALSE),
(1317, 330, 'A', 'Sesuai, karena menghubungkan dua pernyataan yang bertentangan atau mempertentangkan keadaan.', TRUE),
(1318, 330, 'B', 'Tidak sesuai, karena seharusnya memakai konjungsi penambahan seperti "lagipula".', FALSE),
(1319, 330, 'C', 'Sesuai, karena berfungsi menyimpulkan isi dari kalimat pertama.', FALSE),
(1320, 330, 'D', 'Tidak sesuai, karena kalimat kedua menunjukkan hubungan sebab-akibat langsung.', FALSE),
(1321, 331, 'A', 'Kedua teks membahas dampak positif dari penggunaan sepeda oleh siswa sekolah.', TRUE),
(1322, 331, 'B', 'Teks 1 menyajikan data kuantitatif penurunan emisi karbon.', TRUE),
(1323, 331, 'C', 'Teks 2 menyatakan bahwa bersepeda menyebabkan kemacetan di gerbang sekolah.', FALSE),
(1324, 331, 'D', 'Kedua teks melarang siswa berjalan kaki ke sekolah.', FALSE),
(1325, 332, 'A', 'Menanam padi di seluruh petak sawah tanpa ada tanaman lain.', FALSE),
(1326, 332, 'B', 'Menanam jagung dan kacang tanah secara berselang-seling pada satu bidang tanah.', TRUE),
(1327, 332, 'C', 'Mengubah lahan pertanian menjadi kawasan pabrik industri.', FALSE),
(1328, 332, 'D', 'Menanam pohon kelapa sawit di lahan perkebunan secara berurutan.', FALSE),
(1329, 333, 'A', 'Pupuk organik merusak struktur tanah dalam waktu singkat.', FALSE),
(1330, 333, 'B', 'Pupuk organik memberi nutrisi alami dan memulihkan ekosistem tanah.', TRUE),
(1331, 333, 'C', 'Pupuk kimia adalah satu-satunya sumber hara bagi semua jenis tanaman.', FALSE),
(1332, 333, 'D', 'Mikroorganisme tanah tidak membutuhkan bahan organik untuk hidup.', FALSE),
(1333, 334, 'A', 'Lokasi peristiwa gempa berada di Kota Y.', TRUE),
(1334, 334, 'B', 'Waktu terjadinya gempa adalah pada malam hari.', FALSE),
(1335, 334, 'C', 'Kedua berita menyatakan gempa tidak berpotensi tsunami.', TRUE),
(1336, 334, 'D', 'Gempa mengakibatkan timbulnya gelombang air laut tinggi.', FALSE),
(1337, 335, 'A', 'Membaca dilakukan sebelum kegiatan belajar mengajar dimulai.', FALSE),
(1338, 335, 'B', 'Durasi membaca yang ditentukan dalam gerakan tersebut adalah 15 menit.', FALSE),
(1339, 335, 'C', 'Buku yang dibaca harus berupa buku pelajaran matematika dan sains.', TRUE),
(1340, 335, 'D', 'Tujuannya adalah menumbuhkan budaya membaca di kalangan siswa.', FALSE),
(1341, 336, 'A', 'Menunjukkan urutan waktu kejadian dari masa lalu ke masa depan.', FALSE),
(1342, 336, 'B', 'Mempertentangkan dua hal yang memiliki sifat berlawanan (plastik sekali pakai vs wadah berulang kali).', TRUE),
(1343, 336, 'C', 'Menjelaskan hubungan sebab-akibat antar paragraf.', FALSE),
(1344, 336, 'D', 'Memberikan penekanan pada jenis limbah laut.', FALSE),
(1345, 337, 'A', 'Teks 2 menjelaskan manfaat lanjutan dari mekanisme imun yang dibentuk pada Teks 1.', TRUE),
(1346, 337, 'B', 'Kedua teks mendukung pentingnya pemberian vaksinasi.', TRUE),
(1347, 337, 'C', 'Teks 1 menolak gagasan bahwa vaksin dapat membentuk antibodi.', FALSE),
(1348, 337, 'D', 'Teks 2 menyatakan bahwa vaksin menyebabkan tubuh menjadi rentan penyakit.', FALSE),
(1349, 338, 'A', 'Restorasi = Kegiatan merusak lahan secara permanen.', FALSE),
(1350, 338, 'B', 'Vegetasi = Tanaman atau pepohonan penutup tanah.', TRUE),
(1351, 338, 'C', 'Kemarau = Musim hujan yang berlangsung lama.', FALSE),
(1352, 338, 'D', 'Penyekatan = Pembuatan saluran air baru agar kering.', FALSE),
(1353, 339, 'A', 'Bahan bakar padat lebih disukai untuk roket luar angkasa.', FALSE),
(1354, 339, 'B', 'Penembusan atmosfer bumi tidak membutuhkan teknologi roket tinggi.', FALSE),
(1355, 339, 'C', 'Kestabilan dan kekuatan dorongan menjadi keunggulan bahan bakar cair.', TRUE),
(1356, 339, 'D', 'Roket luar angkasa bekerja tanpa menggunakan bahan bakar apapun.', FALSE),
(1357, 340, 'A', 'Teks A menyajikan data statistik angka penurunan sampah.', TRUE),
(1358, 340, 'B', 'Teks B mendeskripsikan perubahan kebiasaan warga dan kondisi lingkungan.', TRUE),
(1359, 340, 'C', 'Kedua teks melaporkan situasi yang terjadi di Desa Z.', TRUE),
(1360, 340, 'D', 'Teks A dan Teks B bertentangan mengenai manfaat kantong kain.', FALSE),
(1361, 341, 'A', 'Merasa kagum atas kebiasaan penyu mencari makan di laut bebas.', FALSE),
(1362, 341, 'B', 'Merasa sedih dan prihatin atas penderitaan satwa laut akibat sampah plastik.', TRUE),
(1363, 341, 'C', 'Merasa gembira karena produksi kantong plastik terus meningkat.', FALSE),
(1364, 341, 'D', 'Merasa bangga dengan kebersihan ekosistem lautan saat ini.', FALSE),
(1365, 342, 'A', 'Terharu dan kagum terhadap ketulusan perjuangan para relawan muda.', TRUE),
(1366, 342, 'B', 'Terinspirasi untuk ikut berkontribusi dalam kegiatan sosial pendidikan.', TRUE),
(1367, 342, 'C', 'Kecewa karena anak-anak desa diberi buku bacaan gratis.', FALSE),
(1368, 342, 'D', 'Marah terhadap relawan yang menggunakan sepeda tua.', FALSE),
(1369, 343, 'A', 'Tergerak rasa empati dan iba melihat penderitaan para korban bencana.', TRUE),
(1370, 343, 'B', 'Merasa tenang karena banjir bandang adalah kejadian alam biasa.', FALSE),
(1371, 343, 'C', 'Puas melihat kerusakan rumah warga di area pemukiman.', FALSE),
(1372, 343, 'D', 'Gembira karena para korban dapat tinggal di dalam tenda darurat.', FALSE),
(1373, 344, 'A', 'Merasa takjub dan terinspirasi oleh kreativitas serta keterbatasan yang tak menghalangi karya.', TRUE),
(1374, 344, 'B', 'Ragu dan meremehkan alat pemurni air buatan remaja tersebut.', FALSE),
(1375, 344, 'C', 'Kecewa karena remaja tersebut memakai bahan barang bekas.', FALSE),
(1376, 344, 'D', 'Biasa saja karena inovasi teknologi sudah sangat banyak.', FALSE),
(1377, 345, 'A', 'Geram dan prihatin terhadap maraknya aksi perundungan siber.', TRUE),
(1378, 345, 'B', 'Simpati mendalam terhadap kesehatan mental para korban perundungan.', TRUE),
(1379, 345, 'C', 'Merasa terhibur oleh komentar-komentar pedas di media sosial.', FALSE),
(1380, 345, 'D', 'Bangga atas tindakan perundung yang berhasil membuat korban depresi.', FALSE),
(1381, 346, 'A', 'Rasa cemas dan khawatir akan kelestarian satwa langka Indonesia.', TRUE),
(1382, 346, 'B', 'Perasaan bangga terhadap perkembangan industri kayu saat ini.', FALSE),
(1383, 346, 'C', 'Rasa gembira karena area hutan dapat dialihfungsikan.', FALSE),
(1384, 346, 'D', 'Sikap tidak peduli terhadap kepunahan satwa liar.', FALSE),
(1385, 347, 'A', 'Kekecewaan atas usaha warga desa yang sia-sia.', FALSE),
(1386, 347, 'B', 'Perasaan lega, senang, dan terikut dalam suasana kebersamaan warga.', TRUE),
(1387, 347, 'C', 'Rasa iri terhadap hasil panen yang didapatkan para petani.', FALSE),
(1388, 347, 'D', 'Kecemasan akan kegagalan saluran irigasi di masa depan.', FALSE),
(1389, 348, 'A', 'Merasa prihatin atas kemunduran etika berbahasa di media sosial.', TRUE),
(1390, 348, 'B', 'Resah terhadap pudarnya budaya kesantunan di kalangan remaja.', TRUE),
(1391, 348, 'C', 'Merasa bangga dan terhibur melihat caci maki di internet.', FALSE),
(1392, 348, 'D', 'Menganggap bahasa caci maki sebagai bentuk kebebasan berbahasa yang baik.', FALSE),
(1393, 349, 'A', 'Khawatir dan terdorong untuk lebih waspada dalam mengontrol durasi penggunaan gawai.', TRUE),
(1394, 349, 'B', 'Acuh tak acuh karena gangguan penglihatan mudah disembuhkan.', FALSE),
(1395, 349, 'C', 'Gembira karena anak-anak makin lancar menggunakan teknologi gawai.', FALSE),
(1396, 349, 'D', 'Merasa bangga dengan angka peningkatan 30% tersebut.', FALSE),
(1397, 350, 'A', 'Merasa bangga dan optimistis terhadap perubahan perilaku menjaga lingkungan.', TRUE),
(1398, 350, 'B', 'Kecewa karena pembeli harus membawa kantong belanja sendiri.', FALSE),
(1399, 350, 'C', 'Sedih karena penggunaan plastik berkurang drastis.', FALSE),
(1400, 350, 'D', 'Ragu akan kebersihan barang belanjaan di pasar.', FALSE),
(1401, 351, 'A', 'Merasa terenyuh melihat perjuangan berat warga mendapatkan air bersih.', TRUE),
(1402, 351, 'B', 'Kecewa terhadap lambatnya bantuan krisis air bersih ke daerah tersebut.', TRUE),
(1403, 351, 'C', 'Merasa gembira karena warga mendapatkan kesempatan berolahraga jalan kaki.', FALSE),
(1404, 351, 'D', 'Puas melihat penderitaan warga lansia di daerah kering.', FALSE),
(1405, 352, 'A', 'Merasa kagum dan mendukung aksi kepedulian sosial para inovator muda.', TRUE),
(1406, 352, 'B', 'Menilai alat tersebut berbahaya dan tidak berguna.', FALSE),
(1407, 352, 'C', 'Merasa kesal karena harga alat tersebut dibuat terlalu murah.', FALSE),
(1408, 352, 'D', 'Tidak tertarik karena bencana gempa bumi jarang terjadi.', FALSE),
(1409, 353, 'A', 'Geram dan resah atas dampak buruk berita hoaks yang merugikan kesehatan publik.', TRUE),
(1410, 353, 'B', 'Merasa gembira karena kasus penyakit menular kembali melonjak.', FALSE),
(1411, 353, 'C', 'Bangga terhadap penyebar hoaks yang berhasil memengaruhi warga.', FALSE),
(1412, 353, 'D', 'Tenang dan santai tanpa mengkhawatirkan dampaknya.', FALSE),
(1413, 354, 'A', 'Merasa sukacita melihat kembalinya habitat alami satwa langka.', TRUE),
(1414, 354, 'B', 'Puas dan optimistis terhadap keberhasilan gerakan penghijauan.', TRUE),
(1415, 354, 'C', 'Marah karena pantai menjadi penuh dengan pepohonan mangrove.', FALSE),
(1416, 354, 'D', 'Sedih karena burung langka kembali ke wilayah pesisir.', FALSE),
(1417, 355, 'A', 'Kebanggaan nasionalisme dan rasa haru atas perjuangan keras para atlet.', TRUE),
(1418, 355, 'B', 'Rasa malu karena atlet menggunakan fasilitas yang terbatas.', FALSE),
(1419, 355, 'C', 'Kecewa terhadap pencapaian medali emas yang diraih.', FALSE),
(1420, 355, 'D', 'Sikap biasa saja karena kompetisi internasional selalu ada.', FALSE),
(1421, 356, 'A', 'Prihatin dan terdorong untuk lebih bijak serta tidak membuang-buang makanan.', TRUE),
(1422, 356, 'B', 'Gembira karena sisa makanan ditumpuk di tempat pembuangan akhir.', FALSE),
(1423, 356, 'C', 'Merasa puas melihat pemanasan global makin terakselerasi.', FALSE),
(1424, 356, 'D', 'Tidak peduli dengan fenomena food waste di sekitar.', FALSE),
(1425, 357, 'A', 'Merasa tersentuh oleh tingginya rasa kepedulian antar sesama.', TRUE),
(1426, 357, 'B', 'Bersyukur atas adanya aksi nyata bantuan porsi makanan gratis.', TRUE),
(1427, 357, 'C', 'Menolak bantuan karena dinilai memanjakan warga miskin.', FALSE),
(1428, 357, 'D', 'Marah terhadap sukarelawan yang membagikan makanan.', FALSE),
(1429, 358, 'A', 'Merasa jengkel dan bingung akibat hambatan pemahaman istilah asing.', TRUE),
(1430, 358, 'B', 'Bangga karena bahasa asing membuat berita terlihat sangat keren.', FALSE),
(1431, 358, 'C', 'Puas karena artikel menjadi sulit dipahami oleh masyarakat umum.', FALSE),
(1432, 358, 'D', 'Senang karena tidak perlu belajar bahasa Indonesia lagi.', FALSE),
(1433, 359, 'A', 'Kagum dan hormat atas dedikasi tanpa pamrih menjaga kebersihan alam.', TRUE),
(1434, 359, 'B', 'Kecewa karena aksi pembersihan dilakukan sukarela tanpa dibayar.', FALSE),
(1435, 359, 'C', 'Cemas kalau danau akan kembali kotor dalam sekejap.', FALSE),
(1436, 359, 'D', 'Benci terhadap para penyelam yang mengambil sampah.', FALSE),
(1437, 360, 'A', 'Geram dan mengecam keras tindakan pembakaran hutan secara sembarangan.', TRUE),
(1438, 360, 'B', 'Sedih dan kasihan terhadap kondisi anak-anak yang terkena ISPA.', TRUE),
(1439, 360, 'C', 'Merasa gembira karena anak-anak diliburkan dari sekolah.', FALSE),
(1440, 360, 'D', 'Bangga terhadap pelaku pembakaran lahan baru.', FALSE),
(1441, 361, 'A', 'wadah untuk menanam benih', FALSE),
(1442, 361, 'B', 'alat untuk menyiram tanaman', FALSE),
(1443, 361, 'C', 'bahan tempat akar tumbuh', TRUE),
(1444, 361, 'D', 'tempat menyimpan hasil panen', FALSE),
(1445, 362, 'A', 'bayam', FALSE),
(1446, 362, 'B', 'kangkung', FALSE),
(1447, 362, 'C', 'cabai', FALSE),
(1448, 362, 'D', 'sawi', TRUE),
(1449, 363, 'A', 'kegiatan memetik hasil tanaman', TRUE),
(1450, 363, 'B', 'kegiatan menyiram tanaman', FALSE),
(1451, 363, 'C', 'kegiatan menaburkan benih', FALSE),
(1452, 363, 'D', 'kegiatan menyiapkan media tanam', FALSE),
(1453, 364, 'A', 'halaman sekolah', FALSE),
(1454, 364, 'B', 'jalan desa menuju sekolah', TRUE),
(1455, 364, 'C', 'teras rumah Raka', FALSE),
(1456, 364, 'D', 'tempat perbaikan sepeda', FALSE),
(1457, 365, 'A', 'berkarat', TRUE),
(1458, 365, 'B', 'menembus hujan', FALSE),
(1459, 365, 'C', 'kusam', TRUE),
(1460, 365, 'D', 'sepeda bekas', TRUE),
(1461, 366, 'A', 'baru dicat ulang', FALSE),
(1462, 366, 'B', 'penuh coretan', FALSE),
(1463, 366, 'C', 'tidak cerah dan tidak mengilap', TRUE),
(1464, 366, 'D', 'berwarna terang', FALSE),
(1465, 367, 'A', 'lubang kayu tempat sarang alami', FALSE),
(1466, 367, 'B', 'tempat menyimpan madu', FALSE),
(1467, 367, 'C', 'alat untuk memanen propolis', FALSE),
(1468, 367, 'D', 'kotak kayu tempat sarang dipindahkan', TRUE),
(1469, 368, 'A', 'Propolis berasal dari getah tanaman.', TRUE),
(1470, 368, 'B', 'Propolis adalah kotak tempat sarang lebah.', FALSE),
(1471, 368, 'C', 'Propolis dipakai lebah untuk menutup celah sarang.', TRUE),
(1472, 368, 'D', 'Propolis dapat dimanfaatkan sebagai obat tradisional.', TRUE),
(1473, 369, 'A', 'penyebaran biji ke tanah', FALSE),
(1474, 369, 'B', 'perpindahan serbuk sari ke putik', TRUE),
(1475, 369, 'C', 'pembentukan buah dari bunga', FALSE),
(1476, 369, 'D', 'perpindahan lebah ke bunga baru', FALSE),
(1477, 370, 'A', 'garis batas tempat langit dan laut tampak bertemu', TRUE),
(1478, 370, 'B', 'permukaan laut yang tenang', FALSE),
(1479, 370, 'C', 'langit yang berawan', FALSE),
(1480, 370, 'D', 'daratan di seberang laut', FALSE),
(1481, 371, 'A', 'Pelabuhan Sendang', TRUE),
(1482, 371, 'B', 'hutan bakau', FALSE),
(1483, 371, 'C', 'ujung dermaga', TRUE),
(1484, 371, 'D', 'jendela tempat Ibu menyalakan pelita', TRUE),
(1485, 372, 'A', 'keras dan bising', FALSE),
(1486, 372, 'B', 'cepat dan bergetar', FALSE),
(1487, 372, 'C', 'pelan dan hampir tak terdengar', TRUE),
(1488, 372, 'D', 'berat dan berdengung', FALSE),
(1489, 373, 'A', 'tempat berkumpulnya ikan dan penyu', FALSE),
(1490, 373, 'B', 'kumpulan karang yang telah mati', FALSE),
(1491, 373, 'C', 'makhluk hidup yang tinggal di dasar laut', FALSE),
(1492, 373, 'D', 'kesatuan makhluk hidup dan lingkungan tempat tinggalnya', TRUE),
(1493, 374, 'A', 'Peristiwa karang kehilangan warna dan tampak putih.', TRUE),
(1494, 374, 'B', 'Selalu menyebabkan karang mati seketika.', FALSE),
(1495, 374, 'C', 'Terjadi ketika alga keluar dari karang.', TRUE),
(1496, 374, 'D', 'Dipicu oleh suhu laut yang terlalu panas.', TRUE),
(1497, 375, 'A', 'karang bergantung pada alga saja', FALSE),
(1498, 375, 'B', 'keduanya memperoleh manfaat dari yang lain', TRUE),
(1499, 375, 'C', 'alga mengambil makanan dari karang', FALSE),
(1500, 375, 'D', 'keduanya hidup tanpa saling membutuhkan', FALSE),
(1501, 376, 'A', 'berlibur ke tempat yang jauh', FALSE),
(1502, 376, 'B', 'pindah rumah bersama keluarga', FALSE),
(1503, 376, 'C', 'pergi ke daerah lain untuk mencari nafkah', TRUE),
(1504, 376, 'D', 'bersekolah di kota lain', FALSE),
(1505, 377, 'A', 'Hujan gerimis', FALSE),
(1506, 377, 'B', 'Hatinya terasa berat', TRUE),
(1507, 377, 'C', 'Amplopnya sedikit basah', FALSE),
(1508, 377, 'D', 'kepala batu', TRUE),
(1509, 378, 'A', 'bergeser ke pinggir dan menjauh', TRUE),
(1510, 378, 'B', 'jatuh ke bumi', FALSE),
(1511, 378, 'C', 'berkumpul di tengah', FALSE),
(1512, 378, 'D', 'berubah menjadi hitam', FALSE),
(1513, 379, 'A', 'penyimpanan energi ke dalam baterai', FALSE),
(1514, 379, 'B', 'perubahan bentuk energi menjadi bentuk lain', TRUE),
(1515, 379, 'C', 'pembelian energi dari luar desa', FALSE),
(1516, 379, 'D', 'penghematan pemakaian energi', FALSE),
(1517, 380, 'A', 'Batu bara termasuk energi terbarukan.', FALSE),
(1518, 380, 'B', 'Sinar matahari termasuk energi terbarukan.', TRUE),
(1519, 380, 'C', 'Energi terbarukan tidak akan habis dipakai.', TRUE),
(1520, 380, 'D', 'Energi terbarukan berbeda dengan bahan bakar fosil.', TRUE),
(1521, 381, 'A', 'Bambu dan kertas warna', FALSE),
(1522, 381, 'B', 'Gulungan benang', TRUE),
(1523, 381, 'C', 'Lem nasi', FALSE),
(1524, 381, 'D', 'Layang-layang yang sudah jadi', FALSE),
(1525, 382, 'A', 'Layang-layangnya putus', FALSE),
(1526, 382, 'B', 'Ia dimarahi oleh Kakek', FALSE),
(1527, 382, 'C', 'Ia kalah dalam lomba lari', TRUE),
(1528, 382, 'D', 'Ia dilarang bermain ke lapangan', FALSE),
(1529, 383, 'A', 'Robek terkena ranting pohon', FALSE),
(1530, 383, 'B', 'Jatuh ke tengah sawah', FALSE),
(1531, 383, 'C', 'Diambil oleh anak lain', FALSE),
(1532, 383, 'D', 'Benangnya putus dan layang-layang terbang ke tepi hutan', TRUE),
(1533, 384, 'A', 'Bambu', TRUE),
(1534, 384, 'B', 'Kertas warna', TRUE),
(1535, 384, 'C', 'Lem nasi', TRUE),
(1536, 384, 'D', 'Plastik
E. Kawat', FALSE),
(1537, 385, 'A', 'Kakek bercerita bahwa dulu ia sering jatuh saat memanjat pohon.
( )( )', TRUE),
(1538, 385, 'B', 'Layang-layang pertama selesai dibuat pada pagi hari.
( )( )', FALSE),
(1539, 385, 'C', 'Layang-layang kedua yang dibuat berwarna merah.
( )( )', FALSE),
(1540, 386, 'A', 'Bros berbentuk bunga matahari', TRUE),
(1541, 386, 'B', 'Buku catatan bersampul biru', FALSE),
(1542, 386, 'C', 'Sekuntum mawar', FALSE),
(1543, 386, 'D', 'Kotak pensil', FALSE),
(1544, 387, 'A', 'Ia takut hadiahnya hilang', FALSE),
(1545, 387, 'B', 'Ia merasa hadiahnya paling sederhana', TRUE),
(1546, 387, 'C', 'Ia ingin memberikannya di rumah', FALSE),
(1547, 387, 'D', 'Ia tidak jadi memberi hadiah', FALSE),
(1548, 388, 'A', 'Buku catatan bersampul biru', FALSE),
(1549, 388, 'B', 'Bros bunga matahari', FALSE),
(1550, 388, 'C', 'Kotak berbungkus kertas kuning', FALSE),
(1551, 388, 'D', 'Sekuntum mawar dari kebunnya', TRUE),
(1552, 389, 'A', 'Buku catatan', FALSE),
(1553, 389, 'B', 'Jaring cadangan', FALSE),
(1554, 389, 'C', 'Bekal nasi', FALSE),
(1555, 389, 'D', 'Termos berisi teh hangat', TRUE),
(1556, 390, 'A', 'Subuh', TRUE),
(1557, 390, 'B', 'Siang hari', FALSE),
(1558, 390, 'C', 'Sore hari', FALSE),
(1559, 390, 'D', 'Tengah malam', FALSE),
(1560, 391, 'A', 'Menyalakan mesin perahu', FALSE),
(1561, 391, 'B', 'Memegang tali kuat-kuat', TRUE),
(1562, 391, 'C', 'Melompat ke laut', FALSE),
(1563, 391, 'D', 'Mengayuh dayung lebih cepat', FALSE),
(1564, 392, 'A', 'Memotong jaring dengan pisau', FALSE),
(1565, 392, 'B', 'Berhenti dan menunggu ombak tenang', FALSE),
(1566, 392, 'C', 'Menarik tali bersama sekuat tenaga', TRUE),
(1567, 392, 'D', 'Meminta bantuan nelayan lain', FALSE),
(1568, 393, 'A', 'Ari sudah sering melaut bersama ayahnya.
( )( )', FALSE),
(1569, 393, 'B', 'Pak Darto memuji Ari seperti nelayan sungguhan.
( )( )', TRUE),
(1570, 393, 'C', 'Ari bertekad ikut melaut lagi keesokan harinya.
( )( )', TRUE),
(1571, 394, 'A', 'Tika', FALSE),
(1572, 394, 'B', 'Bu Wati', TRUE),
(1573, 394, 'C', 'Nenek Dimas', FALSE),
(1574, 394, 'D', 'Ibu Dimas', FALSE),
(1575, 395, 'A', 'Buku itu sudah rusak', FALSE),
(1576, 395, 'B', 'Buku itu hilang', FALSE),
(1577, 395, 'C', 'Buku itu sedang dipinjam Tika', TRUE),
(1578, 395, 'D', 'Bu Wati menyimpannya di lemari', FALSE),
(1579, 396, 'A', 'Majalah anak', FALSE),
(1580, 396, 'B', 'Kamus bergambar', TRUE),
(1581, 396, 'C', 'Buku cerita', FALSE),
(1582, 396, 'D', 'Ensiklopedia hewan', FALSE),
(1583, 397, 'A', 'Tikar', TRUE),
(1584, 397, 'B', 'Dua bantal', TRUE),
(1585, 397, 'C', 'Lampu meja', FALSE),
(1586, 397, 'D', 'Rak buku baru', FALSE),
(1587, 398, 'A', 'Mars', FALSE),
(1588, 398, 'B', 'Venus', FALSE),
(1589, 398, 'C', 'Jupiter', FALSE),
(1590, 398, 'D', 'Neptunus', TRUE),
(1591, 399, 'A', 'Buku catatan bersampul biru', TRUE),
(1592, 399, 'B', 'Sekuntum mawar dari kebun', FALSE),
(1593, 399, 'C', 'Bros berbentuk bunga matahari', FALSE),
(1594, 399, 'D', 'Kamus bergambar tentang luar angkasa', FALSE),
(1595, 400, 'A', 'Menolak hadiah tersebut karena bentuknya sangat sederhana', FALSE),
(1596, 400, 'B', 'Menyimpan kotak kuning tersebut di lemari tanpa membukanya', FALSE),
(1597, 400, 'C', 'Matanya berkaca-kaca lalu langsung menyematkan dan memakai bros itu sepanjang hari', TRUE),
(1598, 400, 'D', 'Meminta Laras mengganti hadiahnya dengan buku catatan seperti milik Yoga', FALSE),
(1599, 401, 'A', 'Wulan tersesat di tengah pasar', FALSE),
(1600, 401, 'B', 'Wulan dan ibunya berada di pasar lalu mendengar suara mengeong lemah', TRUE),
(1601, 401, 'C', 'Ibu membeli ikan dan buah', FALSE),
(1602, 401, 'D', 'Wulan bertemu dengan seorang nenek', FALSE),
(1603, 402, 'A', 'Bertanya kepada pedagang - menemukan kucing - nenek datang - menerima kue', FALSE),
(1604, 402, 'B', 'Menemukan kucing - nenek datang - bertanya kepada pedagang - menerima kue', FALSE),
(1605, 402, 'C', 'Menemukan kucing - bertanya kepada pedagang - nenek datang - menerima kue', TRUE),
(1606, 402, 'D', 'Menemukan kucing - bertanya kepada pedagang - menerima kue - nenek datang', FALSE),
(1607, 403, 'A', 'Wulan menggendong anak kucing', FALSE),
(1608, 403, 'B', 'Wulan dan ibu bertanya kepada para pedagang', TRUE),
(1609, 403, 'C', 'Nenek memeluk anak kucing', FALSE),
(1610, 403, 'D', 'Wulan menolak pemberian kue', FALSE),
(1611, 404, 'A', 'Seorang nenek berteriak mengaku sebagai pemilik kucing', TRUE),
(1612, 404, 'B', 'Nenek memeluk anak kucing itu', TRUE),
(1613, 404, 'C', 'Nenek berterima kasih berkali-kali kepada Wulan', TRUE),
(1614, 404, 'D', 'Nenek memberi sebungkus kue pisang
E. Wulan menemukan anak kucing di bawah meja', FALSE),
(1615, 405, 'A', 'Paragraf 2 menceritakan Wulan menemukan anak kucing.
( )( )', TRUE),
(1616, 405, 'B', 'Paragraf 5 menceritakan Wulan bertanya kepada para pedagang.
( )( )', FALSE),
(1617, 405, 'C', 'Paragraf 1 memperkenalkan latar dan awal peristiwa.
( )( )', TRUE),
(1618, 406, 'A', 'Ayah pulang dan terharu', FALSE),
(1619, 406, 'B', 'Pemilik toko membebaskan kekurangan bayar', FALSE),
(1620, 406, 'C', 'Celengan penuh dan Kiki pergi ke toko sepeda', TRUE),
(1621, 406, 'D', 'Ayah mengantar koran dengan riang', FALSE),
(1622, 407, 'A', 'Uang kurang - Kiki tertunduk lesu - pemilik toko tersenyum dan mengenal ayah Kiki - kekurangan tidak perlu dibayar', TRUE),
(1623, 407, 'B', 'Kiki tertunduk lesu - pemilik toko tersenyum - kekurangan tidak perlu dibayar - uang kurang', FALSE),
(1624, 407, 'C', 'Pemilik toko tersenyum - uang kurang - Kiki tertunduk lesu - kekurangan tidak perlu dibayar', FALSE),
(1625, 407, 'D', 'Uang kurang - kekurangan tidak perlu dibayar - Kiki tertunduk lesu - pemilik toko tersenyum', FALSE),
(1626, 408, 'A', '1', FALSE),
(1627, 408, 'B', '2', FALSE),
(1628, 408, 'C', '3', TRUE),
(1629, 408, 'D', '4', FALSE),
(1630, 409, 'A', 'Paragraf 1 menceritakan alasan Kiki menabung.
( )( )', TRUE),
(1631, 409, 'B', 'Paragraf 3 menceritakan celengan Kiki dipecahkan.
( )( )', FALSE),
(1632, 409, 'C', 'Paragraf 4 menceritakan ayah menerima sepeda dan bahagia.
( )( )', TRUE),
(1633, 410, 'A', 'Sinta ragu mengikuti lomba', FALSE),
(1634, 410, 'B', 'Sinta kehilangan alat lukis', FALSE),
(1635, 410, 'C', 'Sinta teringat pesan nenek dan membayangkan kebun yang menenangkannya', TRUE),
(1636, 410, 'D', 'Sinta meminta bantuan temannya', FALSE),
(1637, 411, 'A', 'Sinta melukis - duduk diam ketakutan - teringat pesan nenek - diumumkan juara', FALSE),
(1638, 411, 'B', 'Sinta duduk diam ketakutan - teringat pesan nenek - melukis kebun nenek - diumumkan juara kedua', TRUE),
(1639, 411, 'C', 'Sinta teringat pesan nenek - diumumkan juara - melukis - duduk diam ketakutan', FALSE),
(1640, 411, 'D', 'Sinta diumumkan juara - melukis - teringat pesan nenek - duduk diam ketakutan', FALSE),
(1641, 412, 'A', '1', FALSE),
(1642, 412, 'B', '2', FALSE),
(1643, 412, 'C', '3', FALSE),
(1644, 412, 'D', '4', TRUE),
(1645, 413, 'A', 'Sinta mulai menggoreskan pensil dengan yakin', TRUE),
(1646, 413, 'B', 'Sinta menyerahkan lukisannya kepada juri', TRUE),
(1647, 413, 'C', 'Sinta duduk diam di depan kertas kosong', FALSE),
(1648, 413, 'D', 'Lomba melukis dimulai lima menit lalu', FALSE),
(1649, 414, 'A', 'Paragraf 1 memaparkan perasaan takut Sinta menjelang lomba.
( )( )', TRUE),
(1650, 414, 'B', 'Paragraf 3 menceritakan Sinta menerima pesan dari nenek.
( )( )', FALSE),
(1651, 414, 'C', 'Paragraf 4 menceritakan hasil lomba dan akhir cerita.
( )( )', TRUE),
(1652, 415, 'A', 'Hujan deras membuat air sungai naik dan warga berkumpul di balai desa', TRUE),
(1653, 415, 'B', 'Rafi berlari mencari adiknya yang hilang', FALSE),
(1654, 415, 'C', 'Pak RT membagikan makanan kepada warga', FALSE),
(1655, 415, 'D', 'Lampu padam karena kerusakan listrik', FALSE),
(1656, 416, 'A', 'Rafi menemukan Dita - Pak RT memukul kentongan - warga membersihkan lumpur - Rafi sadar adiknya hilang', FALSE),
(1657, 416, 'B', 'Warga membersihkan lumpur - Pak RT memukul kentongan - Rafi sadar adiknya hilang - Rafi menemukan Dita', FALSE),
(1658, 416, 'C', 'Rafi sadar adiknya hilang - Pak RT memukul kentongan - Rafi menemukan Dita - warga membersihkan lumpur', FALSE),
(1659, 416, 'D', 'Pak RT memukul kentongan - Rafi sadar adiknya hilang - Rafi menemukan Dita - warga membersihkan lumpur', TRUE),
(1660, 417, 'A', 'Warga berkumpul di balai desa', FALSE),
(1661, 417, 'B', 'Rafi membagikan selimut kepada lansia', FALSE),
(1662, 417, 'C', 'Rafi menerobos hujan dan menemukan Dita', TRUE),
(1663, 417, 'D', 'Warga memuji keberanian Rafi', FALSE),
(1664, 418, 'A', 'Air sungai kembali naik dengan cepat', FALSE),
(1665, 418, 'B', 'Setelah banjir surut, warga bergotong royong dan Rafi memahami arti keluarga', TRUE),
(1666, 418, 'C', 'Kucing kecil itu hilang lagi', FALSE),
(1667, 418, 'D', 'Pak RT menegur Rafi karena keluar rumah', FALSE),
(1668, 419, 'A', 'Ibu-ibu menyiapkan nasi bungkus dan teh hangat', TRUE),
(1669, 419, 'B', 'Bapak-bapak mengangkut barang ke tempat tinggi', TRUE),
(1670, 419, 'C', 'Rafi membagikan selimut kepada para lansia', TRUE),
(1671, 419, 'D', 'Warga membersihkan lumpur di jalan', FALSE),
(1672, 420, 'A', 'Kiki kehilangan celengannya', FALSE),
(1673, 420, 'B', 'Celengan Kiki penuh lalu ia dan ibu pergi ke toko sepeda', TRUE),
(1674, 420, 'C', 'Kiki dimarahi oleh ibunya', FALSE),
(1675, 420, 'D', 'Ayah membeli sepeda baru', FALSE),
(1676, 421, 'A', 'bangga karena sepeda itu merupakan pemberian dari kakaknya', FALSE),
(1677, 421, 'B', 'minder karena kondisi sepedanya kalah bagus dibandingkan sepeda milik temannya', TRUE),
(1678, 421, 'C', 'marah karena sepedanya mengalami kerusakan cukup parah di bagian jok', FALSE),
(1679, 421, 'D', 'bosan karena sudah terlalu lama menggunakan sepeda yang sama', FALSE),
(1680, 422, 'A', 'Rasa percaya diri dapat tumbuh kembali melalui usaha merawat dan menghargai barang milik sendiri.', TRUE),
(1681, 422, 'B', 'Barang pemberian saudara lama-kelamaan pasti akan rusak sehingga wajib diganti dengan barang baru.', TRUE),
(1682, 422, 'C', 'Peran orang tua sangat berarti dalam membimbing anak menghadapi rasa minder melalui kerja nyata bersama.', TRUE),
(1683, 422, 'D', 'Pengakuan dan pujian dari teman sebaya merupakan satu-satunya tujuan utama dalam menyelesaikan masalah.', TRUE),
(1684, 423, 'A', 'Laras pada awalnya merasa malu dan tidak percaya diri dengan kondisi sepedanya.', TRUE),
(1685, 423, 'B', 'Ayah mengajak Laras memperbaiki sepeda karena tidak sanggup membelikan sepeda baru.', FALSE),
(1686, 423, 'C', 'Ucapan \'Ini sepedaku sendiri\' menyimpulkan kebanggaan atas jerih payah merawat barang sendiri.', TRUE),
(1687, 424, 'A', 'sunyi dan membosankan karena ketiadaan kegiatan nelayan', FALSE),
(1688, 424, 'B', 'meriah dan penuh canda tawa para warga pesisir', FALSE),
(1689, 424, 'C', 'tegang dan diliputi kecemasan menantikan kepulangan perahu', TRUE),
(1690, 424, 'D', 'ricuh akibat pertengkaran antarwarga desa nelayan', FALSE),
(1691, 425, 'A', 'Masyarakat pesisir memiliki solidaritas dan rasa setia kawan yang sangat tinggi saat menghadapi musibah.', TRUE),
(1692, 425, 'B', 'Warga berkumpul di dermaga hanya untuk menyaksikan fenomena badai laut dari jarak dekat.', TRUE),
(1693, 425, 'C', 'Kehadiran dan kepedulian warga sekitar terbukti mampu meringankan beban kecemasan keluarga yang tertimpa masalah.', TRUE),
(1694, 425, 'D', 'Para nelayan enggan pulang ke rumah karena takut dimarahi oleh pengurus pos jaga pelabuhan.', TRUE),
(1695, 426, 'A', 'Pak Hasan bersikap acuh tak acuh dan tidak peduli terhadap nasib anaknya di tengah laut.', FALSE),
(1696, 426, 'B', 'Tindakan Pak Hasan menepuk bahu Bayu menyimpulkan upayanya memberi ketenangan batin pada cucunya.', TRUE),
(1697, 426, 'C', 'Sorak gembira dan gerakan warga menyiapkan tali tambat menyimpulkan bahwa ayah Bayu berhasil selamat tiba di pantai.', TRUE),
(1698, 427, 'A', 'keinginan segera pulang ke rumah atau tetap berteduh di halte sekolah', FALSE),
(1699, 427, 'B', 'rasa takut kehujanan dan kekhawatiran tertinggal bus kota', FALSE),
(1700, 427, 'C', 'godaan memanfaatkan uang temuan untuk mengatasi rasa lapar dan dorongan berbuat jujur', TRUE),
(1701, 427, 'D', 'keinginan memberikan dompet kepada guru atau menyerahkannya ke kantor polisi', FALSE),
(1702, 428, 'A', 'Dimas adalah pribadi yang mudah dipengaruhi oleh imbalan materi saat menolong sesama.', FALSE),
(1703, 428, 'B', 'Dimas memiliki kepekaan rasa empati yang mendalam terhadap penderitaan dan kesulitan orang lain.', TRUE),
(1704, 428, 'C', 'Dimas selalu mengutamakan kepentingan pribadinya di atas kepentingan keselamatan orang lain.', FALSE),
(1705, 428, 'D', 'Dimas berintegritas tinggi karena rela berkorban menempuh hujan demi mengembalikan hak orang lain.', TRUE),
(1706, 429, 'A', 'Dimas memutuskan mengembalikan dompet karena takut akan ditangkap oleh aparat keamanan.', FALSE),
(1707, 429, 'B', 'Uang di dalam dompet tersebut sangat krusial bagi kelangsungan pendidikan anak sang pemilik warung.', TRUE),
(1708, 429, 'C', 'Kalimat terakhir menyimpulkan bahwa kebahagiaan berbuat kebajikan mampu melampaui rasa lapar fisik.', TRUE),
(1709, 430, 'A', 'sombong dan meremehkan tawaran pihak pengusaha pabrik', FALSE),
(1710, 430, 'B', 'malas beradaptasi dengan kemajuan teknologi perkotaan', FALSE),
(1711, 430, 'C', 'teguh pendirian serta memiliki rasa syukur mendalam pada tanah yang menghidupinya', TRUE),
(1712, 430, 'D', 'egois karena mengabaikan masa depan dan kemakmuran putranya', FALSE),
(1713, 431, 'A', 'Cerita menggambarkan fenomena alih fungsi lahan pertanian produktif menjadi kawasan perindustrian pabrik.', TRUE),
(1714, 431, 'B', 'Pak Sarman berencana membangun industri penggilingan jagung modern di atas ladangnya.', FALSE),
(1715, 431, 'C', 'Wahyu membenci ayahnya dan bertekad kabur dari desa untuk mencari pekerjaan di kota.', FALSE),
(1716, 431, 'D', 'Warisan tanah bukan sekadar komoditas finansial, melainkan simbol martabat dan nilai luhur keluarga.', TRUE),
(1717, 432, 'A', 'Wahyu awalnya memandang ladang jagung murni dari sudut pandang keuntungan materiil.', TRUE),
(1718, 432, 'B', 'Pria berjas memaksa Pak Sarman menandatangani surat jual beli dengan ancaman kekerasan.', FALSE),
(1719, 432, 'C', 'Tindakan Wahyu membawa cangkul di pagi hari menyimpulkan ia telah memahami nilai perjuangan ayahnya.', TRUE),
(1720, 433, 'A', 'sosok guru yang pendendam dan suka mempermalukan murid di depan umum', FALSE),
(1721, 433, 'B', 'pengajar yang tidak peduli pada penguasaan materi pelajaran murid-muridnya', FALSE),
(1722, 433, 'C', 'sosok pendidik yang berdisiplin tinggi demi mempersiapkan ketangguhan murid di masa depan', TRUE),
(1723, 433, 'D', 'guru yang gemar memberikan hadiah materi agar disayangi oleh murid kelas enam', FALSE),
(1724, 434, 'A', 'Murid kelas enam merasa bahagia karena Bu Wening pensiun sehingga beban PR mereka hilang sepenuhnya.', FALSE),
(1725, 434, 'B', 'Penghapus papan tulis yang aus menyimbolkan dedikasi panjang guru dalam mengikis ketidaktahuan murid.', TRUE),
(1726, 434, 'C', 'Rasa kesal murid di masa lalu bermetamorfosis menjadi rasa hormat dan terima kasih yang tulus.', TRUE),
(1727, 434, 'D', 'Bu Wening menolak hadiah kue dari murid karena merasa tidak pantas menerima penghormatan.', FALSE),
(1728, 435, 'A', 'Mata Bu Wening berkaca-kaca di pintu menyimpulkan keharuan atas kasih sayang para muridnya.', TRUE),
(1729, 435, 'B', 'Bu Wening memberikan penghapus aus karena bermaksud menyuruh Rian membeli penghapus baru.', FALSE),
(1730, 435, 'C', 'Hubungan antara guru dan murid dalam teks didasari rasa saling belajar dan menghargai proses.', TRUE),
(1731, 436, 'A', 'rencana Kakek Wiryo untuk segera menjual jam saku perak tersebut ke pasar barang antik', FALSE),
(1732, 436, 'B', 'nilai historis dan pengingat filosofis perjuangan hidup di balik sebuah jam saku tua', TRUE),
(1733, 436, 'C', 'kekecewaan kakek terhadap kualitas jam perak buatan masa lalu yang mudah retak', FALSE),
(1734, 436, 'D', 'penyesalan Kakek Wiryo karena telah merantau tanpa modal uang sepeser pun', FALSE),
(1735, 437, 'A', 'Nilai berharga suatu benda terletak pada kenangan dan makna perjuangan yang disandangnya, bukan pada kondisi fisiknya semata.', TRUE),
(1736, 437, 'B', 'Menyimpan barang lama di dalam lemari hanya akan memenuhi ruangan dan merusak pemandangan kamar tidur.', FALSE),
(1737, 437, 'C', 'Keberhasilan dalam membangun usaha ditentukan oleh seberapa mewah jam saku yang dimiliki seseorang.', FALSE),
(1738, 437, 'D', 'Rasa ingin tahu terhadap barang pribadi orang tua harus dihindari agar tidak menimbulkan salah paham.', FALSE),
(1739, 438, 'A', 'pemurung dan selalu meratapi nasib masa mudanya', FALSE),
(1740, 438, 'B', 'kikir dan enggan membagikan barang koleksi kepada cucunya', FALSE),
(1741, 438, 'C', 'tegas, pendiam, dan tertutup terhadap anggota keluarganya', FALSE),
(1742, 438, 'D', 'bijaksana, menghargai proses kehidupan, dan penyayang', TRUE),
(1743, 439, 'A', 'ricuh dan saling menyalahkan akibat kelalaian penjaga pintu air sungai', FALSE),
(1744, 439, 'B', 'santai dan lamban karena menganggap sekolah anak-anak tidak terlalu mendesak', FALSE),
(1745, 439, 'C', 'guyub, bersemangat, dan diliputi rasa tanggung jawab demi kepentingan bersama', TRUE),
(1746, 439, 'D', 'tegang dan ketakutan karena banjir susulan menerjang permukiman penduduk', FALSE),
(1747, 440, 'A', 'Pemerintah daerah berkewajiban membangun jembatan beton di seluruh penjuru pelosok desa.', FALSE),
(1748, 440, 'B', 'Rintangan berat dapat diatasi secara cepat manakala masyarakat mengedepankan kepedulian dan kerja sama nyata.', TRUE),
(1749, 440, 'C', 'Anak-anak sebaiknya meliburkan diri saat terjadi bencana banjir melanda lingkungan tempat tinggal.', FALSE),
(1750, 440, 'D', 'Kayu dan anyaman bambu merupakan material terbaik pengganti jembatan penghubung permanen.', FALSE),
(1751, 441, 'A', 'hembusan angin kencang yang mematahkan rangka bambu layangan di udara', FALSE),
(1752, 441, 'B', 'Arman sengaja melepaskan gulungan benang karena kelelahan berlari', FALSE),
(1753, 441, 'C', 'benang layangan putus akibat tergores pecahan kaca di atas pagar pekarangan', TRUE),
(1754, 441, 'D', 'berat ekor kain lurik yang basah terkena tetesan air hujan', FALSE),
(1755, 442, 'A', 'Ungkapan \'Hatinya ikut terbang bersama layangan\' menjelaskan luapan kegembiraan dan kepuasan batin tokoh.', TRUE),
(1756, 442, 'B', 'Kalimat \'Layang-layang itu meliuk-liuk lalu jatuh\' dominan memanfaatkan citraan pendengaran untuk menegaskan kesedihan.', TRUE),
(1757, 442, 'C', 'Perbandingan \'Semangatnya kembali menyala seperti api yang ditiup\' menjelaskan bangkitnya kembali harapan tokoh secara tiba-tiba.', TRUE),
(1758, 442, 'D', 'Frasa \'Wajahnya memerah menahan tangis\' menjelaskan rasa amarah Arman kepada Pak Kades yang mengambil layangannya.', TRUE),
(1759, 443, 'A', 'Penjelasan Pak Kades sangat logis karena kekuatan layang-layang terletak pada keutuhan kerangkanya.', TRUE),
(1760, 443, 'B', 'Arman kembali bersemangat karena Pak Kades menjanjikan hadiah layang-layang pabrikan yang mahal.', FALSE),
(1761, 443, 'C', 'Deskripsi benang terasa ringan menjelaskan hilangnya tarikan angin sesaat setelah benang terputus.', TRUE),
(1762, 444, 'A', 'kepedulian tulus terhadap kebutuhan stamina buruh pabrik yang membutuhkan asupan kenyang saat bekerja', TRUE),
(1763, 444, 'B', 'kekhawatiran stok beras di gudang akan membusuk jika porsinya dikurangi', FALSE),
(1764, 444, 'C', 'keinginan Bu Tini untuk bersaing secara tidak sehat dengan warung makan lain', FALSE),
(1765, 444, 'D', 'sikap keras kepala Bu Tini yang enggan mendengarkan masukan dari anggota keluarga', FALSE),
(1766, 445, 'A', 'Warung Bu Tini makin ramai karena pihak pabrik menaikkan tunjangan makan seluruh pekerjanya.', TRUE),
(1767, 445, 'B', 'Kalimat \'Aroma bawang goreng menyebar sampai ke ujung gang\' menggunakan citraan penciuman untuk menggambarkan daya pikat masakan.', TRUE),
(1768, 445, 'C', 'Pertambahan pelanggan terjadi berkat efek getok tular (rekomendasi lisan) atas integritas dan konsistensi pelayanan Bu Tini.', TRUE),
(1769, 445, 'D', 'Makna ungkapan \'perut lapar tak bisa dibohongi\' menjelaskan bahwa orang miskin cenderung gemar berpura-pura kenyang.', TRUE),
(1770, 446, 'A', 'Keputusan memangkas keuntungan merupakan solusi etis Bu Tini untuk mempertahankan pelanggan tanpa menipu takaran.', TRUE),
(1771, 446, 'B', 'Kening berkerut dalam pada paragraf kedua menjelaskan kepasrahan Bu Tini dalam menghadapi kebangkrutan.', FALSE),
(1772, 446, 'C', 'Pemasukan yang stabil di akhir cerita membuktikan bahwa kejujuran berbisnis berbuah loyalitas konsumen.', TRUE),
(1773, 447, 'A', 'rasa empati yang muncul saat teringat wajah letih Farhan yang kelelahan menjaga adik sakit', TRUE),
(1774, 447, 'B', 'teguran dari Cahya yang mengingatkan Sinta agar tidak membuat keributan di rumah', FALSE),
(1775, 447, 'C', 'kedatangan guru pembimbing yang secara mendadak mengawasi kerja kelompok mereka', FALSE),
(1776, 447, 'D', 'kekhawatiran Sinta bahwa Farhan akan merusak maket rumah adat yang sudah dikerjakan', FALSE),
(1777, 448, 'A', 'Sikap penerimaan dan pembagian tugas yang tepat dari Sinta memacu motivasi kerja Farhan secara maksimal.', TRUE),
(1778, 448, 'B', 'Guru memberikan nilai tertinggi karena merasa kasihan terhadap kondisi adik Farhan yang sakit panas.', TRUE),
(1779, 448, 'C', 'Ketidakhadiran Beni membuat pembagian porsi bahan karton maket menjadi lebih luas dan tidak terbuang sia-sia.', TRUE),
(1780, 448, 'D', 'Keterampilan dan kerapian Farhan dalam menyelesaikan struktur atap limasan menyempurnakan kualitas maket kelompok.', TRUE),
(1781, 449, 'A', 'Frasa \'wajah penuh sesal\' menjelaskan bahasa tubuh tokoh yang menyadari kelalaiannya tanpa berniat mencari alasan palsu.', TRUE),
(1782, 449, 'B', 'Tindakan Sinta menghela napas panjang menjelaskan keputusasaannya dan niat membatalkan tugas maket.', FALSE),
(1783, 449, 'C', 'Hubungan antarperistiwa dalam teks membuktikan bahwa kerja sama positif mampu menuntaskan kendala keterbatasan anggota.', TRUE),
(1784, 450, 'A', 'Kakek meniup serulingnya dari atas genting rumah warga di pinggir sawah', FALSE),
(1785, 450, 'B', 'aliran air saluran irigasi sawah mengeluarkan gemercik yang merdu di sore hari', FALSE),
(1786, 450, 'C', 'alunan tiupan seruling terdengar sangat halus, merdu, dan menjangkau seantero perkampungan', TRUE),
(1787, 450, 'D', 'hembusan angin kencang menghempaskan seruling kakek hingga mengenai atap rumah penduduk', FALSE),
(1788, 451, 'A', 'Ungkapan \'seperti pekikan kucing terjepit\' menjelaskan kemerduan nada seruling Kirana yang berhasil memikat burung di beranda.', TRUE),
(1789, 451, 'B', 'Frasa \'seperti pekikan kucing terjepit\' memanfaatkan perbandingan asosiatif untuk menjelaskan nada latihan awal yang masih sumbang dan melengking ganjil.', TRUE),
(1790, 451, 'C', 'Kiasan \'terasa seperti pelukan yang lembut\' menjelaskan getaran afeksi dan keharuan kakek saat mendengar cucunya melestarikan kebiasaannya.', TRUE),
(1791, 451, 'D', 'Citraan perabaan dalam kalimat \'bibirnya pegal\' menjelaskan kemarahan Kakek yang memaksa Kirana berlatih tanpa henti.', TRUE),
(1792, 452, 'A', 'Ketekunan Kirana berlatih berhari-hari secara logis menjelaskan bagaimana ia akhirnya mampu memainkan tembang untuk menghibur sang kakek.', TRUE),
(1793, 452, 'B', 'Burung-burung enggan pulang ke sarang menjelaskan ketakutan satwa liar terhadap bunyi seruling bambu kakek.', FALSE),
(1794, 452, 'C', 'Senyum dan mata terpejam kakek di dalam kamar menjelaskan perasaan damai serta rasa bangga terhadap bakti cucunya.', TRUE),
(1795, 453, 'A', 'kerinduan dan kepedihan mendalam yang kembali bergolak atas pesan tertulis dari almarhum suami yang hilang setengah abad silam', TRUE),
(1796, 453, 'B', 'kemarahan besar karena kantor pos mengenakan denda pengiriman yang sangat mahal', FALSE),
(1797, 453, 'C', 'ketakutan terhadap ancaman yang tertulis di dalam kertas surat lusuh tersebut', FALSE),
(1798, 453, 'D', 'kekecewaan karena isi surat tersebut ternyata salah alamat dan bukan ditujukan kepadanya', FALSE),
(1799, 454, 'A', 'Kalimat \'Amplopnya menguning dan pinggirannya rapuh\' menggunakan citraan perabaan untuk menegaskan mahalnya harga amplop.', FALSE),
(1800, 454, 'B', 'Kalimat \'Amplopnya menguning dan pinggirannya rapuh\' dominan menggunakan citraan penglihatan untuk menjelaskan usia dokumen yang sudah sangat tua.', TRUE),
(1801, 454, 'C', 'Alasan surat tersebut baru terkirim setelah lima dekade adalah karena Pak Joko sering lupa menuntaskan tugas posnya.', TRUE),
(1802, 454, 'D', 'Ungkapan \'Tenggorokannya terasa tercekat\' menjelaskan keharuan mendalam yang membuat Pak Joko tak mampu mengucapkan kata-kata penghiburan.', TRUE),
(1803, 455, 'A', 'Tindakan Pak Joko mengantarkan surat rapuh tersebut membuktikan integritas dan dedikasi luhur profesinya sebagai juru pos.', TRUE),
(1804, 455, 'B', 'Alasan Pak Joko pulang lebih lambat dari biasanya adalah karena ia tersesat mencari alamat Bu Ratmi.', FALSE),
(1805, 455, 'C', 'Penjelasan ditemukannya surat di gedung pos lama yang dibongkar memberikan landasan peristiwa yang masuk akal bagi alur cerita.', TRUE),
(1806, 456, 'A', 'ketebalan kertas kalender yang terlalu kaku sehingga tidak seimbang di atas air deras', FALSE),
(1807, 456, 'B', 'perahu tersangkut timbunan sampah plastik di mulut gorong-gorong sehingga tertekan arus air yang meluap', TRUE),
(1808, 456, 'C', 'perahu Gani menabrak bagian lambung perahu Fajar hingga terbalik dan terendam lumpur', FALSE),
(1809, 456, 'D', 'tetesan air hujan dari langit yang terlalu lebat langsung meremukkan moncong perahu kertas', FALSE),
(1810, 457, 'A', 'merasa sangat sedih dan menahan air mata kekecewaan', TRUE),
(1811, 457, 'B', 'menatap awan gelap di langit untuk memeriksa cuaca hujan', FALSE),
(1812, 457, 'C', 'marah besar kepada kakaknya karena tidak menolong perahunya', FALSE),
(1813, 457, 'D', 'mengalami gangguan penglihatan akibat terkena cipratan air kotor', FALSE),
(1814, 458, 'A', 'penglihatan', FALSE),
(1815, 458, 'B', 'penciuman', FALSE),
(1816, 458, 'C', 'pendengaran', TRUE),
(1817, 458, 'D', 'perabaan', FALSE),
(1818, 459, 'A', 'taktik promosi agar Raka mempromosikan toko rotinya kepada guru dan teman di sekolah', FALSE),
(1819, 459, 'B', 'wujud rasa terima kasih dan apresiasi yang tulus atas kerelaan Raka membantu meringankan kerja fisiknya', TRUE),
(1820, 459, 'C', 'upaya membuang stok roti sisa kemarin sebelum toko resmi dibuka untuk umum', FALSE),
(1821, 459, 'D', 'pembayaran upah kerja paksa karena Raka telah mengangkat beban berat ke gudang', FALSE),
(1822, 460, 'A', 'pendengaran dan penglihatan', FALSE),
(1823, 460, 'B', 'penciuman dan pendengaran', FALSE),
(1824, 460, 'C', 'penglihatan dan gerak', FALSE),
(1825, 460, 'D', 'pencecapan dan perabaan', TRUE),
(1826, 461, 'A', 'memaksakan diri menembak langsung ke gawang meski dihalangi dua pemain lawan', FALSE),
(1827, 461, 'B', 'menendang bola ke luar lapangan agar pertandingan berakhir imbang', FALSE),
(1828, 461, 'C', 'menghentikan permainan dan terduduk di lapangan karena napas terengah-engah', FALSE),
(1829, 461, 'D', 'mengoper umpan terobosan matang kepada Ilham yang berdiri bebas tanpa penjagaan', TRUE),
(1830, 462, 'A', 'Wasit akan memberikan kartu kuning kepada Rio karena mengulur waktu pertandingan.', TRUE),
(1831, 462, 'B', 'Ilham memiliki peluang emas mencetak gol kemenangan sebelum peluit panjang berbunyi.', TRUE),
(1832, 462, 'C', 'Kepercayaan diri dan rasa saling percaya antaranggota tim sepak bola Rio akan semakin solid pulih.', TRUE),
(1833, 462, 'D', 'Pelatih akan langsung menarik keluar Rio karena dinilai melanggar instruksi menjaga posisi.', TRUE),
(1834, 463, 'A', 'Jika Rio memaksakan menembak sendiri, kemungkinan besar bola membentur badan lawan yang menghadang.', TRUE),
(1835, 463, 'B', 'Kedua tim diprediksi akan langsung menerima skor imbang tanpa ada serangan penutup.', FALSE),
(1836, 463, 'C', 'Keputusan mengumpan kepada Ilham merupakan opsi paling rasional untuk mengunci kemenangan tim.', TRUE),
(1837, 464, 'A', 'terus mengejek dan merusak pagar bambu buatan Bimo secara diam-diam', FALSE),
(1838, 464, 'B', 'mulai menaruh rasa hormat kepada Bimo dan tergerak untuk ikut membantu merawat tanaman', TRUE),
(1839, 464, 'C', 'melarang Bimo mendekati area kebun sekolah karena dianggap boros air', FALSE),
(1840, 464, 'D', 'mencabut bibit mangga tersebut dan memindahkannya ke luar gerbang sekolah', FALSE),
(1841, 465, 'A', 'Bibit pohon mangga memiliki peluang bertahan hidup paling tinggi dibanding tanaman lain berkat perawatan konsisten.', TRUE),
(1842, 465, 'B', 'Pohon mangga tersebut diprediksi akan langsung menghasilkan buah manis dalam waktu seminggu ke depan.', TRUE),
(1843, 465, 'C', 'Kepala sekolah akan menghukum Bimo karena membawa botol air minum dari rumah ke sekolah.', TRUE),
(1844, 465, 'D', 'Keteladanan Bimo berpotensi memicu gerakan peduli penghijauan lingkungan bagi siswa dan guru di sekolah.', TRUE),
(1845, 466, 'A', 'Jika kemarau berkepanjangan, Bimo diprediksi akan tetap konsisten berkorban menyisihkan bekal air minumnya.', TRUE),
(1846, 466, 'B', 'Teman-teman yang dulu mengejek diprediksi akan semakin gencar menertawakan Bimo di depan umum.', FALSE),
(1847, 466, 'C', 'Bibit mangga yang dirawat Bimo diprediksi tumbuh menjadi pohon rindang peneduh halaman sekolah di masa depan.', TRUE),
(1848, 467, 'A', 'menyambut ajakan Nadia dan memakan bekal nasi goreng tersebut dengan rasa malu bercampur syukur', TRUE),
(1849, 467, 'B', 'membanting kotak bekal tersebut karena merasa harga dirinya direndahkan di hadapan teman kelas', FALSE),
(1850, 467, 'C', 'langsung beranjak pergi keluar kelas untuk menghindari Nadia', FALSE),
(1851, 467, 'D', 'melaporkan tindakan Nadia kepada wali kelas karena merasa dipaksa menerima makanan', FALSE),
(1852, 468, 'A', 'Hubungan mereka akan renggang karena Tomi merasa terbebani oleh utang budi makanan.', FALSE),
(1853, 468, 'B', 'Jalinan persahabatan mereka akan menjadi lebih akrab dan Tomi tidak lagi canggung berkomunikasi.', TRUE),
(1854, 468, 'C', 'Tomi diprediksi akan menjadi anak yang gemar meminta-minta makanan kepada seluruh teman sekelasnya.', FALSE),
(1855, 468, 'D', 'Tomi secara bertahap akan lebih terbuka dan merasa memiliki teman yang benar-benar peduli padanya.', TRUE),
(1856, 469, 'A', 'Nadia diprediksi akan menceritakan kondisi kekurangan Tomi kepada seluruh murid di kelas.', FALSE),
(1857, 469, 'B', 'Nadia diprediksi akan kembali membawa bekal lebih di hari berikutnya untuk dinikmati bersama Tomi.', TRUE),
(1858, 469, 'C', 'Sikap halus Nadia membuktikan bahwa kepedulian yang dibarengi adab mampu mencegah timbulnya ketersinggungan.', TRUE),
(1859, 470, 'A', 'mendekati karung, memeriksa dan menolong anak kucing yang kedinginan, lalu membawanya pulang setelah hujan reda', TRUE),
(1860, 470, 'B', 'lari berhamburan ke luar gudang menembus hujan lebat karena mengira ada hantu', FALSE),
(1861, 470, 'C', 'mengunci pintu gudang dari luar agar anak kucing tersebut tidak bisa keluar lagi', FALSE),
(1862, 470, 'D', 'berteriak memanggil aparat desa untuk membakar gudang berhantu tersebut', FALSE),
(1863, 471, 'A', 'Mitos seram dan kabar burung tentang gudang berhantu perlahan-lahan akan sirna dari perbincangan warga.', TRUE),
(1864, 471, 'B', 'Warga kampung akan semakin melarang anak-anak mendekati gudang karena dianggap keramat.', FALSE),
(1865, 471, 'C', 'Masyarakat akan menyadari bahwa rintihan misterius selama ini hanyalah suara kucing liar yang bersarang.', TRUE),
(1866, 471, 'D', 'Warga desa akan menggelar upacara penolak bala untuk mengusir roh halus penunggu gudang.', FALSE),
(1867, 472, 'A', 'Yuda diprediksi merasa lega sekaligus malu karena ketakutannya ternyata hanya dipicu oleh anak kucing.', TRUE),
(1868, 472, 'B', 'Salsa diprediksi melarikan diri meninggalkan Arif dan Yuda sendirian di dalam gudang gelap.', FALSE),
(1869, 472, 'C', 'Keberanian menelusuri sumber suara membuktikan bahwa prasangka takut dapat diatasi dengan pembuktian nyata.', TRUE),
(1870, 473, 'A', 'bangkit berdiri dan berlari meninggalkan panggung karena tak kuasa menahan malu', FALSE),
(1871, 473, 'B', 'menarik napas dalam, memantapkan ketenangan batin, lalu mulai menekan tuts memainkan melodi lagunya', TRUE),
(1872, 473, 'C', 'menangis tersedu-sedu di hadapan penonton sambil meminta maaf', FALSE),
(1873, 473, 'D', 'memanggil ibunya untuk naik ke atas panggung mendampinginya bermain piano', FALSE),
(1874, 474, 'A', 'Permainan jarinya yang awalnya sedikit kaku akan berangsur-angsur mengalir lancar mengikuti memori motorik latihannya.', TRUE),
(1875, 474, 'B', 'Elsa diprediksi akan pingsan di tengah lagu akibat sorotan lampu panggung yang terlalu panas.', FALSE),
(1876, 474, 'C', 'Penonton aula akan menyoraki Elsa dengan kata-kata ejekan karena menghentikan ketukan lagu.', FALSE),
(1877, 474, 'D', 'Penonton dan ibunya akan menyambut tuntasnya penampilan Elsa dengan tepuk tangan meriah yang penuh apresiasi.', TRUE),
(1878, 475, 'A', 'Setelah berhasil menyelesaikan lagu, perasaan Elsa diprediksi berubah dari rasa takut menjadi rasa lega dan bangga.', TRUE),
(1879, 475, 'B', 'Pengalaman tampil di panggung pertama ini diprediksi membuat Elsa jera dan berhenti bermain musik selamanya.', FALSE),
(1880, 475, 'C', 'Dukungan guru dan kehadiran ibu di kursi penonton menjadi faktor krusial yang menguatkan mentalitas Elsa.', TRUE),
(1881, 476, 'A', 'menerima pinjaman sepatu duri dari Riki dengan rasa terima kasih lalu segera bersiap di garis start', TRUE),
(1882, 476, 'B', 'menolak pinjaman sepatu tersebut karena mencurigai Riki telah memasang jebakan paku', FALSE),
(1883, 476, 'C', 'memilih berlari tanpa menggunakan alas kaki sama sekali di atas lintasan sintetis', FALSE),
(1884, 476, 'D', 'mengundurkan diri dari perlombaan dan langsung pulang meninggalkan stadion', FALSE),
(1885, 477, 'A', 'Pandu akan sengaja berlari lambat agar gelar juara jatuh ke tangan atlet dari sekolah lain', FALSE),
(1886, 477, 'B', 'Pandu akan merasa rendah diri dan tertekan karena harus berutang budi pada saingannya', FALSE),
(1887, 477, 'C', 'Pandu akan terdorong berlari sekuat tenaga demi menghormati sportivitas dan kebaikan hati sang sahabat', TRUE),
(1888, 477, 'D', 'Pandu akan kehilangan konsentrasi karena memikirkan nasib sepatu Riki di babak estafet sore nanti', FALSE),
(1889, 478, 'A', 'mereka akan saling bermusuhan karena saling iri atas catatan waktu lari masing-masing', FALSE),
(1890, 478, 'B', 'ikatan persahabatan dan saling menghargai antarkeduanya akan terjalin erat melampaui sekat rivalitas sekolah', TRUE),
(1891, 478, 'C', 'mereka akan memutuskan pensiun dini dari cabang olahraga atletik lari cepat', FALSE),
(1892, 478, 'D', 'Riki akan menuntut kompensasi uang sewa sepatu yang sangat mahal kepada pihak sekolah Pandu', FALSE),
(1893, 479, 'A', 'tetap menebar jaring kedua demi mengejar target rekor tangkapan ikan tertinggi', FALSE),
(1894, 479, 'B', 'segera memutar haluan perahu, mengembangkan layar, dan berlayar kembali menuju dermaga demi keselamatan jiwa', TRUE),
(1895, 479, 'C', 'membuang seluruh ikan hasil tangkapan pertama ke laut agar perahu menjadi lebih ringan saat diterjang badai', FALSE),
(1896, 479, 'D', 'melompat dari perahu dan berenang menuju pulau karang terdekat untuk bersembunyi', FALSE),
(1897, 480, 'A', 'memuji kedewasaan dan ketepatan keputusan Hendra yang mengutamakan keselamatan daripada keserakahan', TRUE),
(1898, 480, 'B', 'mencemooh Hendra karena pulang terlalu awal sebelum seluruh ruang palka terisi penuh', FALSE),
(1899, 480, 'C', 'mendenda Hendra karena tidak menuntaskan waktu melaut sesuai tradisi desa nelayan', FALSE),
(1900, 480, 'D', 'memaksa Hendra untuk segera bertolak kembali ke laut menerjang gelombang badai', FALSE),
(1901, 481, 'A', 'meneruskan semua pesan agar informasi cepat tersebar', FALSE),
(1902, 481, 'B', 'memeriksa kebenaran informasi sebelum menyebarkannya', TRUE),
(1903, 481, 'C', 'meminta teman memilih informasi yang dianggap paling benar', FALSE),
(1904, 481, 'D', 'menghapus pesan yang belum diketahui asalnya', FALSE),
(1905, 482, 'A', 'siswa menerima informasi tugas melalui buku pelajaran', FALSE),
(1906, 482, 'B', 'siswa memperoleh berita dari media sosial dan perlu mengeceknya', TRUE),
(1907, 482, 'C', 'siswa memilih teman untuk mengerjakan tugas kelompok', FALSE),
(1908, 482, 'D', 'siswa mengikuti kegiatan sekolah tanpa membaca pengumuman', FALSE),
(1909, 483, 'A', 'mengecek informasi melalui sumber resmi', TRUE),
(1910, 483, 'B', 'membagikan berita sebelum mengetahui kebenarannya', FALSE),
(1911, 483, 'C', 'memperbaiki informasi setelah mengetahui adanya kekeliruan', TRUE),
(1912, 483, 'D', 'menganggap semua pesan grup pasti benar', FALSE),
(1913, 484, 'A', 'membiarkan satu anggota mengerjakan semuanya', FALSE),
(1914, 484, 'B', 'memilih ide anggota yang paling dominan', FALSE),
(1915, 484, 'C', 'membagi pekerjaan berdasarkan kesepakatan', TRUE),
(1916, 484, 'D', 'menghindari diskusi agar pekerjaan cepat selesai', FALSE),
(1917, 485, 'A', 'persaingan untuk menunjukkan kemampuan', FALSE),
(1918, 485, 'B', 'kerja sama untuk mencapai hasil bersama', TRUE),
(1919, 485, 'C', 'kebebasan mengabaikan pembagian tugas', FALSE),
(1920, 485, 'D', 'keberanian mempertahankan pendapat sendiri', FALSE),
(1921, 486, 'A', 'persaingan untuk menunjukkan kemampuan', FALSE),
(1922, 486, 'B', 'kerja sama untuk mencapai hasil bersama', TRUE),
(1923, 486, 'C', 'kebebasan mengabaikan pembagian tugas', FALSE),
(1924, 486, 'D', 'keberanian mempertahankan pendapat sendiri', FALSE),
(1925, 487, 'A', 'mendiskusikan pembagian pekerjaan', TRUE),
(1926, 487, 'B', 'mengambil seluruh pekerjaan karena merasa paling mampu', FALSE),
(1927, 487, 'C', 'menghargai kontribusi anggota kelompok', TRUE),
(1928, 487, 'D', 'menyelesaikan tugas tanpa mempertimbangkan anggota lain', FALSE),
(1929, 488, 'A', 'setiap siswa selalu berhasil dalam presentasi', FALSE),
(1930, 488, 'B', 'kesalahan dapat terjadi ketika seseorang sedang belajar', TRUE),
(1931, 488, 'C', 'kesalahan harus selalu ditertawakan agar tidak terulang', FALSE),
(1932, 488, 'D', 'siswa sebaiknya tidak menerima masukan dari teman', FALSE),
(1933, 489, 'A', 'menghindari siswa tersebut', FALSE),
(1934, 489, 'B', 'mempermalukannya di depan kelas', FALSE),
(1935, 489, 'C', 'memberikan kesempatan untuk memperbaiki kesalahan', TRUE),
(1936, 489, 'D', 'membiarkan kesalahan tanpa memberikan masukan', FALSE),
(1937, 490, 'A', 'meminta maaf setelah mengejek teman', TRUE),
(1938, 490, 'B', 'menolak semua kritik agar tidak malu', FALSE),
(1939, 490, 'C', 'menerima masukan untuk memperbaiki kesalahan', TRUE),
(1940, 490, 'D', 'menjadikan kesalahan teman sebagai bahan candaan', FALSE),
(1941, 491, 'A', 'membalas coretan dengan membuat coretan baru', FALSE),
(1942, 491, 'B', 'melaporkan kerusakan dan ikut menjaga fasilitas', TRUE),
(1943, 491, 'C', 'membiarkan fasilitas rusak karena bukan milik pribadi', FALSE),
(1944, 491, 'D', 'meminta petugas sekolah menyelesaikan semua masalah', FALSE),
(1945, 492, 'A', 'menjaga barang milik sendiri saja', FALSE),
(1946, 492, 'B', 'menggunakan fasilitas umum secara bertanggung jawab', TRUE),
(1947, 492, 'C', 'menghindari fasilitas sekolah agar tidak rusak', FALSE),
(1948, 492, 'D', 'menyerahkan seluruh tanggung jawab kepada petugas', FALSE),
(1949, 493, 'A', 'melaporkan kerusakan fasilitas', TRUE),
(1950, 493, 'B', 'mencoret fasilitas untuk membalas tindakan orang lain', FALSE),
(1951, 493, 'C', 'ikut membersihkan lingkungan sekolah', TRUE),
(1952, 493, 'D', 'membiarkan kerusakan karena bukan tanggung jawab pribadi', FALSE),
(1953, 494, 'A', 'menemukan barang milik orang lain', TRUE),
(1954, 494, 'B', 'mendapatkan hadiah dari teman', FALSE),
(1955, 494, 'C', 'kehilangan barang pribadi', FALSE),
(1956, 494, 'D', 'menerima uang saku dari orang tua.', FALSE),
(1957, 495, 'A', 'menggunakan telepon tersebut sementara', FALSE),
(1958, 495, 'B', 'menyimpannya sampai pemilik mencari sendiri', FALSE),
(1959, 495, 'C', 'menyerahkannya kepada guru atau pihak sekolah', TRUE),
(1960, 495, 'D', 'menghapus data agar tidak diketahui pemilik', FALSE),
(1961, 496, 'A', 'mengembalikan barang yang bukan milik sendiri', TRUE),
(1962, 496, 'B', 'menggunakan barang temuan sebelum mengembalikannya', FALSE),
(1963, 496, 'C', 'menyerahkan barang kepada pihak yang dapat membantu menemukan pemilik', TRUE),
(1964, 496, 'D', 'mengambil uang dalam barang temuan jika tidak ada yang melihat', FALSE),
(1965, 497, 'A', 'pendapat teman selalu harus ditolak', FALSE),
(1966, 497, 'B', 'keputusan perlu mempertimbangkan benar dan salah', TRUE),
(1967, 497, 'C', 'uang merupakan hal yang tidak penting', FALSE),
(1968, 497, 'D', 'siswa tidak boleh mempercayai temannya', FALSE),
(1969, 498, 'A', 'pemilik barang merasa lebih khawatir', FALSE),
(1970, 498, 'B', 'pemilik barang dapat memperoleh kembali barangnya', TRUE),
(1971, 498, 'C', 'teman Bima mendapat uang tambahan', FALSE),
(1972, 498, 'D', 'guru tidak perlu mengetahui barang temuan', FALSE),
(1973, 499, 'A', 'informasi semakin cepat menyebar tanpa pemeriksaan', FALSE),
(1974, 499, 'B', 'masyarakat lebih berhati-hati menerima informasi', TRUE),
(1975, 499, 'C', 'semua informasi dianggap salah', FALSE),
(1976, 499, 'D', 'masyarakat berhenti menggunakan media digital', FALSE),
(1977, 500, 'A', 'memeriksa informasi sebelum membagikannya', TRUE),
(1978, 500, 'B', 'menyelesaikan tugas bersama melalui pembagian pekerjaan', TRUE),
(1979, 500, 'C', 'menertawakan teman yang melakukan kesalahan', FALSE),
(1980, 500, 'D', 'mengambil barang temuan karena tidak diketahui pemiliknya', FALSE),
(1981, 501, 'A', 'mengecek pengumuman sekolah sebelum meneruskannya', TRUE),
(1982, 501, 'B', 'Bersikap acuh karena takut terlibat', FALSE),
(1983, 501, 'C', 'mempermalukan teman yang salah menjawab', FALSE),
(1984, 501, 'D', 'melaporkan fasilitas sekolah yang rusak', TRUE),
(1985, 502, 'A', 'keduanya mudah membuang barang lama', FALSE),
(1986, 502, 'B', 'keduanya berusaha memanfaatkan barang yang masih dapat digunakan', TRUE),
(1987, 502, 'C', 'keduanya lebih menyukai barang baru', FALSE),
(1988, 502, 'D', 'keduanya menggunakan barang lama untuk dijual', FALSE),
(1989, 503, 'A', 'kedua teks dimulai dengan konflik besar dan berakhir tragis', FALSE),
(1990, 503, 'B', 'kedua teks menunjukkan masalah kecil yang diselesaikan melalui tindakan', TRUE),
(1991, 503, 'C', 'Teks I berakhir tanpa penyelesaian, sedangkan Teks II selesai', FALSE),
(1992, 503, 'D', 'Teks I menggunakan alur mundur, sedangkan Teks II alur campuran', FALSE),
(1993, 504, 'A', 'Nara memperbaiki sepeda sebelum menggunakannya.', TRUE),
(1994, 504, 'B', 'Reno membuang sepatu yang rusak.', FALSE),
(1995, 504, 'C', 'Kedua tokoh memperoleh bantuan dalam memperbaiki barang.', TRUE),
(1996, 504, 'D', 'Kedua barang masih memiliki bagian yang dapat digunakan.', FALSE),
(1997, 505, 'A', 'menghindari saluran air yang tersumbat', FALSE),
(1998, 505, 'B', 'membersihkan saluran air yang dipenuhi daun', TRUE),
(1999, 505, 'C', 'menunggu orang lain membersihkan selokan', FALSE),
(2000, 505, 'D', 'memindahkan genangan ke halaman tetangga', FALSE),
(2001, 506, 'A', 'Teks I berlangsung sore, sedangkan Teks II pagi', TRUE),
(2002, 506, 'B', 'Teks I berlangsung pagi, sedangkan Teks II sore', FALSE),
(2003, 506, 'C', 'keduanya berlangsung pada malam hari', FALSE),
(2004, 506, 'D', 'keduanya berlangsung pada siang hari', FALSE),
(2005, 507, 'A', 'cuaca memengaruhi keadaan lingkungan', TRUE),
(2006, 507, 'B', 'tokoh menemukan daun di saluran air', TRUE),
(2007, 507, 'C', 'kedua tokoh memilih membiarkan saluran tersumbat', FALSE),
(2008, 507, 'D', 'kedua tokoh pergi bermain setelah membersihkan saluran', FALSE),
(2009, 508, 'A', 'tokoh kehilangan barang berharga', FALSE),
(2010, 508, 'B', 'tokoh menghadapi hasil pekerjaan yang tidak sesuai rencana', TRUE),
(2011, 508, 'C', 'tokoh berselisih dengan keluarganya', FALSE),
(2012, 508, 'D', 'tokoh harus memilih antara sekolah dan rumah', FALSE),
(2013, 509, 'A', 'kesalahan selalu membuat seseorang gagal', FALSE),
(2014, 509, 'B', 'masalah dalam proses berkarya dapat menghasilkan solusi baru', TRUE),
(2015, 509, 'C', 'karya yang baik harus dibuat tanpa kesalahan', FALSE),
(2016, 509, 'D', 'seseorang harus membuang karya ketika terjadi kesalahan', FALSE),
(2017, 510, 'A', 'keduanya berhenti berkarya setelah mengalami masalah.', FALSE),
(2018, 510, 'B', 'Fajar langsung menghapus seluruh ceritanya.', FALSE),
(2019, 510, 'C', 'keduanya meninjau kembali karya sebelum mengambil keputusan.', TRUE),
(2020, 510, 'D', 'keduanya menemukan solusi terhadap masalahnya.', TRUE),
(2021, 511, 'A', 'Dara mencari jalan lain, sedangkan Bayu tetap berjalan tetapi lebih berhati-hati', TRUE),
(2022, 511, 'B', 'Dara mengabaikan bahaya, sedangkan Bayu berlari', FALSE),
(2023, 511, 'C', 'Dara meminta bantuan, sedangkan Bayu memperbaiki jalan', FALSE),
(2024, 511, 'D', 'keduanya tetap menggunakan jalan yang berbahaya', FALSE),
(2025, 512, 'A', 'kedua tokoh menghadapi kondisi jalan yang berpotensi membahayakan', TRUE),
(2026, 512, 'B', 'kedua tokoh berada di dalam sekolah', FALSE),
(2027, 512, 'C', 'hanya Dara yang menghadapi masalah keselamatan', FALSE),
(2028, 512, 'D', 'hanya Bayu yang menghindari risiko', FALSE),
(2029, 513, 'A', 'mempertimbangkan keselamatan', TRUE),
(2030, 513, 'B', 'memaksakan diri menghadapi kondisi berbahaya', FALSE),
(2031, 513, 'C', 'memilih cara yang lebih aman', TRUE),
(2032, 513, 'D', 'mengabaikan kondisi lingkungan E. menyesuaikan tindakan dengan keadaan', FALSE),
(2033, 514, 'A', 'Teks I menunjukkan kerinduan, sedangkan Teks II menunjukkan keceriaan dan harapan', TRUE),
(2034, 514, 'B', 'Teks I menunjukkan kemarahan, sedangkan Teks II menunjukkan ketakutan', FALSE),
(2035, 514, 'C', 'keduanya menunjukkan kesedihan yang mendalam', FALSE),
(2036, 514, 'D', 'keduanya menunjukkan suasana menegangkan', FALSE),
(2037, 515, 'A', 'surat tersebut memiliki banyak halaman', FALSE),
(2038, 515, 'B', 'penulis merasa sulit mengungkapkan rasa rindu', TRUE),
(2039, 515, 'C', 'surat tersebut sulit dibawa', FALSE),
(2040, 515, 'D', 'penulis tidak mengetahui cara menulis surat', FALSE),
(2041, 516, 'A', 'Teks I menggunakan kata yang menunjukkan kerinduan.', TRUE),
(2042, 516, 'B', 'Teks II menggunakan kata yang menunjukkan harapan.', TRUE),
(2043, 516, 'C', 'Kedua teks memiliki suasana emosional yang sama.', FALSE),
(2044, 516, 'D', 'Teks I menggambarkan perasaan yang lebih berat.', TRUE),
(2045, 517, 'A', 'orang pertama karena menggunakan kata “aku”', TRUE),
(2046, 517, 'B', 'orang kedua karena menggunakan kata “kamu”', FALSE),
(2047, 517, 'C', 'orang ketiga karena menggunakan nama tokoh', FALSE),
(2048, 517, 'D', 'campuran karena menggunakan “aku” dan “dia”', FALSE),
(2049, 518, 'A', 'Nara memperbaiki sepeda sendiri, sedangkan Reno dibantu ayahnya', TRUE),
(2050, 518, 'B', 'Nara membuang sepeda, sedangkan Reno membeli sepatu baru', FALSE),
(2051, 518, 'C', 'keduanya menjual barang lama', FALSE),
(2052, 518, 'D', 'keduanya tidak menggunakan barang lama', FALSE),
(2053, 519, 'A', 'tokoh dalam semua teks memilih mengabaikan masalah', FALSE),
(2054, 519, 'B', 'P4 menampilkan tindakan menghindari atau mengurangi risiko.', TRUE),
(2055, 519, 'C', 'kedua pasangan teks sama-sama berlatar hujan secara eksplisit.', FALSE),
(2056, 519, 'D', 'P2 berfokus pada saluran air, sedangkan P4 berfokus pada jalan.', TRUE),
(2057, 520, 'A', 'semua masalah harus dihadapi dengan cara yang sama', FALSE),
(2058, 520, 'B', 'tindakan tokoh disesuaikan dengan jenis masalah yang dihadapi', TRUE),
(2059, 520, 'C', 'tokoh dalam kedua pasangan selalu menghindari masalah', FALSE),
(2060, 520, 'D', 'masalah dalam cerita tidak membutuhkan keputusan', FALSE),
(2061, 521, 'A', 'tokoh-tokoh dalam teks menunjukkan kemampuan mengambil keputusan.', TRUE),
(2062, 521, 'B', 'semua masalah diselesaikan dengan meminta bantuan orang lain.', FALSE),
(2063, 521, 'C', 'beberapa tokoh memperbaiki atau memanfaatkan kembali sesuatu.', TRUE),
(2064, 521, 'D', 'semua teks menggunakan suasana yang sama.', FALSE),
(2065, 522, 'A', 'geli karena Arga kehilangan teman', FALSE),
(2066, 522, 'B', 'haru karena persahabatan Arga dan Rian tetap bermakna', TRUE),
(2067, 522, 'C', 'marah karena Rian tidak membawa Arga pergi', FALSE),
(2068, 522, 'D', 'takut karena kursi Arga kosong', FALSE),
(2069, 523, 'A', 'tidak peduli', FALSE),
(2070, 523, 'B', 'sedih tetapi tetap memiliki harapan', TRUE),
(2071, 523, 'C', 'marah dan kecewa', FALSE),
(2072, 523, 'D', 'takut dan bingung', FALSE),
(2073, 524, 'A', 'merasa takut terhadap Rian', FALSE),
(2074, 524, 'B', 'merasa terharu', TRUE),
(2075, 524, 'C', 'merasa geli karena peristiwa lucu', FALSE),
(2076, 524, 'D', 'merasa hangat karena persahabatan', TRUE),
(2077, 525, 'A', 'Arga datang ke sekolah sejak pagi', FALSE),
(2078, 525, 'B', 'Rian biasanya mengajak Arga berbicara', FALSE),
(2079, 525, 'C', 'Arga menemukan pesan bahwa mereka akan bertemu lagi', TRUE),
(2080, 525, 'D', 'kursi berada di sebelah Arga', FALSE),
(2081, 526, 'A', 'kagum karena Sinta menunjukkan kepedulian', TRUE),
(2082, 526, 'B', 'takut karena listrik padam', FALSE),
(2083, 526, 'C', 'kecewa karena nenek tinggal sendiri', FALSE),
(2084, 526, 'D', 'marah karena Sinta datang malam hari', FALSE),
(2085, 527, 'A', 'merasa terganggu oleh Sinta', FALSE),
(2086, 527, 'B', 'merasa terbantu dan ditemani', TRUE),
(2087, 527, 'C', 'merasa takut kepada Sinta', FALSE),
(2088, 527, 'D', 'ingin Sinta segera pulang', FALSE),
(2089, 528, 'A', 'merasa hangat melihat kepedulian Sinta', TRUE),
(2090, 528, 'B', 'merasa tersentuh oleh hubungan cucu dan nenek', TRUE),
(2091, 528, 'C', 'merasa geli terhadap keadaan nenek', FALSE),
(2092, 528, 'D', 'merasa kagum terhadap kesediaan Sinta menemani nenek E. merasa marah karena listrik padam', TRUE),
(2093, 529, 'A', 'lega karena burung memperoleh kebebasan', TRUE),
(2094, 529, 'B', 'takut karena burung meninggalkan anak', FALSE),
(2095, 529, 'C', 'marah karena sangkar menjadi kosong', FALSE),
(2096, 529, 'D', 'bosan karena cerita berakhir', FALSE),
(2097, 530, 'A', 'rasa ingin memahami keputusan burung', TRUE),
(2098, 530, 'B', 'rasa benci kepada burung', FALSE),
(2099, 530, 'C', 'rasa geli terhadap anak', FALSE),
(2100, 530, 'D', 'rasa marah kepada pohon', FALSE),
(2101, 531, 'A', 'merasa lega karena burung bebas', TRUE),
(2102, 531, 'B', 'merasa kecewa karena anak mengejar burung', FALSE),
(2103, 531, 'C', 'merasa kagum terhadap pilihan kebebasan', TRUE),
(2104, 531, 'D', 'merasa takut karena burung berada di pohon', FALSE),
(2105, 532, 'A', 'muram dan penuh ketakutan', FALSE),
(2106, 532, 'B', 'tenang dan penuh harapan', TRUE),
(2107, 532, 'C', 'tegang dan penuh kemarahan', FALSE),
(2108, 532, 'D', 'lucu dan menghibur', FALSE),
(2109, 533, 'A', 'optimistis', TRUE),
(2110, 533, 'B', 'putus asa', FALSE),
(2111, 533, 'C', 'marah', FALSE),
(2112, 533, 'D', 'takut', FALSE),
(2113, 534, 'A', '“pergi”', FALSE),
(2114, 534, 'B', '“cahaya”', TRUE),
(2115, 534, 'C', '“perlahan”', FALSE),
(2116, 534, 'D', '“kesempatan”', TRUE),
(2117, 535, 'A', 'dari tegang menuju lega', TRUE),
(2118, 535, 'B', 'dari sedih menuju marah', FALSE),
(2119, 535, 'C', 'dari bahagia menuju takut', FALSE),
(2120, 535, 'D', 'dari marah menuju kecewa', FALSE),
(2121, 536, 'A', 'kagum karena Naya berusaha menyelesaikan konflik secara adil', TRUE),
(2122, 536, 'B', 'marah karena Naya tidak memilih salah satu teman', FALSE),
(2123, 536, 'C', 'takut karena Naya membaca pesan', FALSE),
(2124, 536, 'D', 'geli karena kedua temannya bertengkar', FALSE),
(2125, 537, 'A', 'puas karena konflik dapat diselesaikan melalui komunikasi', TRUE),
(2126, 537, 'B', 'kecewa karena konflik semakin besar', FALSE),
(2127, 537, 'C', 'takut karena Naya kehilangan teman', FALSE),
(2128, 537, 'D', 'sedih karena tidak ada penyelesaian', FALSE),
(2129, 538, 'A', 'lega karena kesalahpahaman terselesaikan', TRUE),
(2130, 538, 'B', 'kecewa karena Naya memperkeruh masalah', FALSE),
(2131, 538, 'C', 'menghargai keputusan Naya untuk mempertemukan kedua pihak', TRUE),
(2132, 538, 'D', 'takut karena pesan tidak dapat dipahami', FALSE),
(2133, 539, 'A', 'kedua teman meminta Naya memilih pihak', FALSE),
(2134, 539, 'B', 'pesan dapat ditafsirkan berbeda', FALSE),
(2135, 539, 'C', 'kedua teman menyadari pertengkaran mereka tidak perlu terjadi', TRUE),
(2136, 539, 'D', 'Naya membaca pesan tersebut', FALSE),
(2137, 540, 'A', 'kedua teks tidak memiliki unsur emosional.', FALSE),
(2138, 540, 'B', 'Teks "Pilihan Naya" dapat menimbulkan rasa lega karena konflik selesai.', TRUE),
(2139, 540, 'C', 'kedua teks sama-sama berakhir dengan ketakutan.', FALSE),
(2140, 540, 'D', 'kedua teks dapat menimbulkan penghargaan terhadap hubungan antarmanusia.', TRUE),
(2141, 541, 'A', 'teks-teks tersebut cenderung membangun emosi melalui hubungan, kepedulian, kebebasan, harapan, dan penyelesaian masalah', TRUE),
(2142, 541, 'B', 'teks-teks tersebut hanya bertujuan menimbulkan rasa takut', FALSE),
(2143, 541, 'C', 'seluruh tokoh mengalami konflik tanpa penyelesaian', FALSE),
(2144, 541, 'D', 'semua teks memiliki suasana sedih yang sama', FALSE)
ON DUPLICATE KEY UPDATE 
    `question_id` = VALUES(`question_id`), 
    `option_label` = VALUES(`option_label`), 
    `option_text` = VALUES(`option_text`), 
    `is_correct` = VALUES(`is_correct`);

-- -----------------------------------------------------------------------------
-- 4. PEMBENIHAN PEMBAHASAN JAWABAN (QUESTION_EXPLANATIONS - 361 Pembahasan, ID 181..541)
-- -----------------------------------------------------------------------------
INSERT INTO `question_explanations` (`id`, `question_id`, `explanation_text`, `reasoning_guide`, `reference_url`) VALUES
(181, 181, 'Jawaban: BJawaban B benar karena algoritma dalam konteks teknologi berarti prosedur atau langkah-langkah logis yang digunakan untuk memecahkan masalah.', NULL, NULL),
(182, 182, 'Jawaban: CJawaban C benar karena efisiensi berkaitan dengan penggunaan waktu dan tenaga secara tepat sehingga pekerjaan dapat dilakukan dengan lebih hemat.', NULL, NULL),
(183, 183, 'Jawaban: BJawaban B benar karena limbah adalah sisa proses atau sampah yang sudah tidak digunakan, termasuk sampah rumah tangga dalam bacaan.', NULL, NULL),
(184, 184, 'Jawaban: CJawaban C benar karena terdegradasi berarti mengalami penguraian atau perubahan menjadi bentuk yang lebih sederhana, seperti sampah organik yang diuraikan mikroorganisme.', NULL, NULL),
(185, 185, 'Jawaban: BJawaban B benar karena imunitas berarti kekebalan tubuh yang membantu tubuh menghadapi penyakit.', NULL, NULL),
(186, 186, 'Jawaban: CJawaban C benar karena proporsional berarti sesuai dengan perbandingan atau takaran yang seimbang, sehingga asupan protein tidak berlebihan maupun terlalu sedikit.', NULL, NULL),
(187, 187, 'Jawaban yang benar adalah: Sari pati yang diambil dari suatu bahan alami
Penjelasan: Berdasarkan konteks teks, produk kecantikan menggunakan bahan yang diambil langsung dari sari lidah buaya asli. Oleh karena itu, istilah ekstrak bermakna sari pati suatu bahan.', NULL, NULL),
(188, 188, 'Jawaban yang benar adalah: Manfaat
Penjelasan: Dalam paragraf tersebut, kata "khasiat" merujuk pada kebaikan atau kegunaan luar biasa dari tanaman lidah buaya untuk rambut dan kulit, sehingga makna yang paling tepat dan sepadan adalah manfaat.', NULL, NULL),
(189, 189, 'Jawaban: BJawaban B benar karena inflasi dalam bacaan ditunjukkan melalui kenaikan harga barang secara terus-menerus yang berdampak pada nilai uang dan daya beli.', NULL, NULL),
(190, 190, 'Jawaban: CJawaban C benar karena daya beli menunjukkan kemampuan masyarakat untuk membayar dan membeli barang atau jasa.', NULL, NULL),
(191, 191, 'Jawaban: BJawaban B benar karena konstelasi adalah kumpulan atau rasi bintang yang tampak membentuk pola tertentu di langit.', NULL, NULL),
(192, 192, 'Jawaban: BJawaban B benar karena gravitasi merupakan gaya tarik-menarik yang, dalam bacaan, menjaga planet tetap berada pada lintasannya mengelilingi matahari.', NULL, NULL),
(193, 193, 'Jawaban: BJawaban B benar karena harmoni dalam musik berarti keselarasan bunyi dari berbagai nada atau instrumen yang dimainkan bersama.', NULL, NULL),
(194, 194, 'Jawaban: CJawaban C benar karena maestro merujuk pada orang yang sangat ahli atau memiliki kemampuan tinggi dalam bidang seni, khususnya musik.', NULL, NULL),
(195, 195, 'Jawaban: BJawaban B benar karena siluet adalah bayangan atau bentuk profil seseorang atau benda yang terlihat terutama karena adanya cahaya dari belakang.', NULL, NULL),
(196, 196, 'Jawaban: CJawaban C benar karena terkuak berarti mulai terbongkar atau terungkap. Dalam bacaan, kebenaran kasus pencurian mulai diketahui.', NULL, NULL),
(197, 197, 'Jawaban: BJawaban B benar karena erupsi adalah peristiwa letusan gunung berapi yang dapat mengeluarkan magma, abu, dan material vulkanik.', NULL, NULL),
(198, 198, 'Jawaban: AJawaban A benar karena mitigasi merupakan tindakan untuk mengurangi risiko atau dampak yang dapat ditimbulkan oleh bencana.', NULL, NULL),
(199, 199, 'Jawaban: BJawaban B benar karena stamina berarti daya tahan fisik atau kemampuan tubuh untuk mempertahankan aktivitas dalam waktu tertentu.', NULL, NULL),
(200, 200, 'Jawaban: AJawaban A benar karena sportivitas berarti bersikap adil dan jujur serta menghargai atau mengakui keunggulan lawan dalam pertandingan.', NULL, NULL),
(201, 201, 'Kunci Jawaban: BJawaban yang benar adalah: MagelangPenjelasan: Jawaban B merupakan informasi relevan yang terdapat di dalam teks bacaan tersebut.', NULL, NULL),
(202, 202, 'Kunci Jawaban: CJawaban yang benar adalah: Abad ke-8 MasehiPenjelasan: Jawaban C merupakan informasi relevan yang terdapat di dalam teks bacaan tersebut.', NULL, NULL),
(203, 203, 'Kunci Jawaban: BJawaban yang benar adalah: Dinasti SyailendraPenjelasan: Jawaban B merupakan informasi relevan yang terdapat di dalam teks bacaan tersebut.', NULL, NULL),
(204, 204, 'Jawaban yang benar adalah: Jawa Timur
Penjelasan: Jawaban C merupakan informasi relevan yang terdapat secara tersurat di dalam paragraf teks bacaan tersebut.', NULL, NULL),
(205, 205, 'Jawaban yang benar adalah: Mobil jip
Penjelasan: Jawaban B merupakan informasi relevan yang terdapat secara tersurat di dalam paragraf teks bacaan tersebut.', NULL, NULL),
(206, 206, 'Jawaban yang benar adalah: Suku Tengger
Penjelasan: Jawaban D merupakan informasi relevan yang terdapat secara tersurat di dalam paragraf teks bacaan tersebut.', NULL, NULL),
(207, 207, 'Kunci Jawaban: BJawaban yang benar adalah: Menahan abrasi laut dan memecah gelombangPenjelasan: Jawaban B merupakan informasi relevan yang terdapat di dalam teks bacaan tersebut.', NULL, NULL),
(208, 208, 'Kunci Jawaban: BJawaban yang benar adalah: TsunamiPenjelasan: Jawaban B merupakan informasi relevan yang terdapat di dalam teks bacaan tersebut.', NULL, NULL),
(209, 209, 'Kunci Jawaban: BJawaban yang benar adalah: Ikan, kepiting, dan burung bangauPenjelasan: Jawaban B merupakan informasi relevan yang terdapat di dalam teks bacaan tersebut.', NULL, NULL),
(210, 210, 'Kunci Jawaban: BJawaban yang benar adalah: Peningkatan suhu rata-rata atmosfer, laut, dan daratan BumiPenjelasan: Jawaban B merupakan informasi relevan yang terdapat di dalam teks bacaan tersebut.', NULL, NULL),
(211, 211, 'Kunci Jawaban: AJawaban yang benar adalah: Efek rumah kaca dari emisi karbonPenjelasan: Jawaban A merupakan informasi relevan yang terdapat di dalam teks bacaan tersebut.', NULL, NULL),
(212, 212, 'Kunci Jawaban: CJawaban yang benar adalah: Menurunnya suhu pegununganPenjelasan: Jawaban C merupakan informasi relevan yang terdapat di dalam teks bacaan tersebut.', NULL, NULL),
(213, 213, 'Kunci Jawaban: BJawaban yang benar adalah: Penggunaan kantong belanja kainPenjelasan: Jawaban B merupakan informasi relevan yang terdapat di dalam teks bacaan tersebut.', NULL, NULL),
(214, 214, 'Kunci Jawaban: AJawaban yang benar adalah: Mengurangi volume sampah plastikPenjelasan: Jawaban A merupakan informasi relevan yang terdapat di dalam teks bacaan tersebut.', NULL, NULL),
(215, 215, 'Kunci Jawaban: CJawaban yang benar adalah: Harus membayar untuk mendapatkan kantong plastikPenjelasan: Jawaban C merupakan informasi relevan yang terdapat di dalam teks bacaan tersebut.', NULL, NULL),
(216, 216, 'Jawaban yang benar adalah: Berubah menjadi kuning
Penjelasan: Jawaban C merupakan informasi relevan yang terdapat secara tersurat di dalam paragraf teks bacaan tersebut.', NULL, NULL),
(217, 217, 'Jawaban yang benar adalah: Menjaga kesehatan organ jantung manusia
Penjelasan: Jawaban A merupakan informasi relevan yang terdapat secara tersurat di dalam paragraf teks bacaan tersebut.', NULL, NULL),
(218, 218, 'Jawaban yang benar adalah: Daun pisang
Penjelasan: Jawaban C merupakan informasi relevan yang terdapat secara tersurat di dalam paragraf teks bacaan tersebut.', NULL, NULL),
(219, 219, 'Kunci Jawaban: BJawaban yang benar adalah: Memberikan energi bagi tubuh dan otak untuk beraktivitasPenjelasan: Jawaban B merupakan informasi relevan yang terdapat di dalam teks bacaan tersebut.', NULL, NULL),
(220, 220, 'Kunci Jawaban: CJawaban yang benar adalah: Memiliki tingkat konsentrasi yang lebih baik di kelasPenjelasan: Jawaban C merupakan informasi relevan yang terdapat di dalam teks bacaan tersebut.', NULL, NULL),
(221, 221, 'Kunci Jawaban: BJawaban yang benar adalah: Evaporasi -> Kondensasi -> PresipitasiPenjelasan: Jawaban B merupakan urutan kerangka informasi yang tepat sesuai dengan rincian di dalam teks bacaan.', NULL, NULL),
(222, 222, 'Kunci Jawaban: CJawaban yang benar adalah: Terbentuknya awan dari uap airPenjelasan: Jawaban C merupakan urutan kerangka informasi yang tepat sesuai dengan rincian di dalam teks bacaan.', NULL, NULL),
(223, 223, 'Kunci Jawaban: AJawaban yang benar adalah: Penguapan air, pembentukan awan, turunnya hujanPenjelasan: Jawaban A merupakan urutan kerangka informasi yang tepat sesuai dengan rincian di dalam teks bacaan.', NULL, NULL),
(224, 224, 'Kunci Jawaban: BJawaban yang benar adalah: 27 Okt, 28 Okt pagi, 28 Okt malamPenjelasan: Jawaban B merupakan urutan kerangka informasi yang tepat sesuai dengan rincian di dalam teks bacaan.', NULL, NULL),
(225, 225, 'Kunci Jawaban: BJawaban yang benar adalah: Persatuan -> Pendidikan -> Sumpah PemudaPenjelasan: Jawaban B merupakan urutan kerangka informasi yang tepat sesuai dengan rincian di dalam teks bacaan.', NULL, NULL),
(226, 226, 'Kunci Jawaban: BJawaban yang benar adalah: Masalah pendidikanPenjelasan: Jawaban B merupakan urutan kerangka informasi yang tepat sesuai dengan rincian di dalam teks bacaan.', NULL, NULL),
(227, 227, 'Kunci Jawaban: BJawaban yang benar adalah: Cuci telur dan amplas kulit telurPenjelasan: Jawaban B merupakan urutan kerangka informasi yang tepat sesuai dengan rincian di dalam teks bacaan.', NULL, NULL),
(228, 228, 'Kunci Jawaban: CJawaban yang benar adalah: Menyimpan telur selama 14-21 hariPenjelasan: Jawaban C merupakan urutan kerangka informasi yang tepat sesuai dengan rincian di dalam teks bacaan.', NULL, NULL),
(229, 229, 'Kunci Jawaban: CJawaban yang benar adalah: KetigaPenjelasan: Jawaban C merupakan urutan kerangka informasi yang tepat sesuai dengan rincian di dalam teks bacaan.', NULL, NULL),
(230, 230, 'Kunci Jawaban: BJawaban yang benar adalah: Telur -> Ulat -> Kepompong -> Kupu-kupuPenjelasan: Jawaban B merupakan urutan kerangka informasi yang tepat sesuai dengan rincian di dalam teks bacaan.', NULL, NULL),
(231, 231, 'Kunci Jawaban: CJawaban yang benar adalah: Fase kepompong (pupa)Penjelasan: Jawaban C merupakan urutan kerangka informasi yang tepat sesuai dengan rincian di dalam teks bacaan.', NULL, NULL),
(232, 232, 'Kunci Jawaban: CJawaban yang benar adalah: KetigaPenjelasan: Jawaban C merupakan urutan kerangka informasi yang tepat sesuai dengan rincian di dalam teks bacaan.', NULL, NULL),
(233, 233, 'Kunci Jawaban: CJawaban yang benar adalah: Anjungan daerah -> Danau buatan -> Museum tematikPenjelasan: Jawaban C merupakan urutan kerangka informasi yang tepat sesuai dengan rincian di dalam teks bacaan.', NULL, NULL),
(234, 234, 'Kunci Jawaban: BJawaban yang benar adalah: Miniatur kepulauan Indonesia di danauPenjelasan: Jawaban B merupakan urutan kerangka informasi yang tepat sesuai dengan rincian di dalam teks bacaan.', NULL, NULL),
(235, 235, 'Kunci Jawaban: DJawaban yang benar adalah: Museum tematik dan rekreasi keluargaPenjelasan: Jawaban D merupakan urutan kerangka informasi yang tepat sesuai dengan rincian di dalam teks bacaan.', NULL, NULL),
(236, 236, 'Kunci Jawaban: BJawaban yang benar adalah: Telapak/punggung tangan -> Ujung jari -> Ibu jariPenjelasan: Jawaban B merupakan urutan kerangka informasi yang tepat sesuai dengan rincian di dalam teks bacaan.', NULL, NULL),
(237, 237, 'Kunci Jawaban: CJawaban yang benar adalah: Menggosok ibu jari memutarPenjelasan: Jawaban C merupakan urutan kerangka informasi yang tepat sesuai dengan rincian di dalam teks bacaan.', NULL, NULL),
(238, 238, 'Kunci Jawaban: DJawaban yang benar adalah: Mengeringkan menggunakan tisu/handukPenjelasan: Jawaban D merupakan urutan kerangka informasi yang tepat sesuai dengan rincian di dalam teks bacaan.', NULL, NULL),
(239, 239, 'Kunci Jawaban: CJawaban yang benar adalah: Kamadhatu -> Rupadhatu -> ArupadhatuPenjelasan: Jawaban C merupakan urutan kerangka informasi yang tepat sesuai dengan rincian di dalam teks bacaan.', NULL, NULL),
(240, 240, 'Kunci Jawaban: DJawaban yang benar adalah: Alam peralihan (mulai meninggalkan duniawi namun terikat wujud)Penjelasan: Jawaban D merupakan urutan kerangka informasi yang tepat sesuai dengan rincian di dalam teks bacaan.', NULL, NULL),
(241, 241, 'Jawaban: B
Pembahasan: Kesimpulan B menggabungkan beberapa informasi: halaman lebih sejuk, tanah lebih terlindungi, siswa merasa nyaman, tetapi tanaman memerlukan perawatan dan pengelolaan.', NULL, NULL),
(242, 242, 'Jawaban: C
Pembahasan: Hubungan antara penyiraman yang tidak teratur, perbaikan jadwal, dan kondisi tanaman menunjukkan bahwa pengelolaan menentukan keberlanjutan manfaat kebun.', NULL, NULL),
(243, 243, 'Jawaban: A dan B dan D
Pembahasan: Teks menunjukkan evaluasi sebelum perluasan, pentingnya jadwal perawatan, dan kenyamanan siswa. Pernyataan C tidak didukung.', NULL, NULL),
(244, 244, 'Jawaban: B
Pembahasan: Pengalaman awal menunjukkan tanaman memburuk saat penyiraman tidak teratur. Karena itu, mengabaikan perawatan berpotensi mengurangi manfaat kebun.', NULL, NULL),
(245, 245, 'Jawaban: B
Pembahasan: Jumlah gelas plastik turun setelah tersedia insentif dan fasilitas air, tetapi sampah masih muncul ketika siswa lupa membawa tumbler. Jadi perubahan perlu didukung kebiasaan dan fasilitas.', NULL, NULL),
(246, 246, 'Jawaban: B
Pembahasan: Alasan pengelola adalah perubahan kebiasaan perlu dilakukan bertahap. Hal itu menunjukkan pendekatan yang realistis dan bertahap.', NULL, NULL),
(247, 247, 'Jawaban: A dan B dan D
Pembahasan: Teks menghubungkan fasilitas dengan pengurangan pembelian kemasan, mencatat masalah siswa yang lupa membawa tumbler, dan mendukung contoh kebiasaan baru.', NULL, NULL),
(248, 248, 'Jawaban: A
Pembahasan: Pengelola menyetujui evaluasi berkala agar kebijakan tetap realistis dan dapat dijalankan.', NULL, NULL),
(249, 249, 'Jawaban: B
Pembahasan: Teks menyebut koleksi, pelatihan, jaringan, perangkat, ruang baca, dan pendampingan sebagai bagian dari keberhasilan layanan.', NULL, NULL),
(250, 250, 'Jawaban: B
Pembahasan: Jumlah peminjaman meningkat, tetapi masih ada pengguna yang membutuhkan bantuan dan kendala akses. Karena itu, keberhasilan tidak cukup diukur dari jumlah peminjaman.', NULL, NULL),
(251, 251, 'Jawaban: A dan B dan D
Pembahasan: Ketiga pernyataan tersebut didukung oleh rangkaian masalah dan solusi dalam teks. C justru bertentangan dengan penjelasan kepala desa.', NULL, NULL),
(252, 252, 'Jawaban: B
Pembahasan: Teks menyebut beberapa siswa masih meminta bantuan. Menghentikan pendampingan berpotensi mempertahankan kendala tersebut.', NULL, NULL),
(253, 253, 'Jawaban: B
Pembahasan: Dua ukuran porsi dan pilihan porsi kecil diikuti penurunan sisa makanan. Teks juga menegaskan bahwa pilihan makanan tetap tersedia.', NULL, NULL),
(254, 254, 'Jawaban: A
Pembahasan: Teks menghubungkan porsi besar dengan makanan yang tersisa dan kemudian menunjukkan penurunan sisa setelah pilihan porsi disesuaikan.', NULL, NULL),
(255, 255, 'Jawaban: A dan B dan D
Pembahasan: Teks menyatakan pengaruh keputusan sebelum membeli, pendekatan tanpa menyalahkan, dan penggunaan hasil pengamatan untuk mengubah ukuran porsi.', NULL, NULL),
(256, 256, 'Jawaban: A
Pembahasan: Teks menunjukkan bahwa sisa makanan banyak terjadi ketika porsi besar tersedia dan berkurang setelah pilihan porsi disesuaikan.', NULL, NULL),
(257, 257, 'Jawaban: A
Pembahasan: Teks menunjukkan manfaat penerangan sekaligus gangguan setelah hujan, perbaikan panel, jadwal pemeriksaan, dan evaluasi biaya.', NULL, NULL),
(258, 258, 'Jawaban: B
Pembahasan: Teks secara jelas menyebut data penggunaan dan biaya perawatan sebagai bahan pertimbangan perluasan.', NULL, NULL),
(259, 259, 'Jawaban: A dan B dan D
Pembahasan: Hujan dan kotoran memengaruhi kinerja, pemeriksaan diperlukan, dan warga diminta melaporkan serta menjaga area sekitar lampu.', NULL, NULL),
(260, 260, 'Jawaban: A
Pembahasan: Keputusan perluasan dalam teks bergantung pada pengalaman penggunaan dan kemampuan pemeliharaan, sehingga biaya tinggi menjadi alasan untuk mengevaluasi kembali.', NULL, NULL),
(261, 261, 'Jawaban: B
Pembahasan: Jadwal mengatur pengambilan berdasarkan luas lahan dan jenis tanaman. Hubungan itu membuat penggunaan air lebih terencana.', NULL, NULL),
(262, 262, 'Jawaban: A
Pembahasan: Keterbatasan sumber daya menjadi alasan perlunya aturan agar pemakaian tidak merugikan pengguna lain.', NULL, NULL),
(263, 263, 'Jawaban: A dan B dan D
Pembahasan: Ketiganya merupakan hubungan logis yang dijelaskan dalam teks. C bertentangan dengan gagasan bahwa air tetap merupakan sumber terbatas.', NULL, NULL),
(264, 264, 'Jawaban: A
Pembahasan: Teks memberi contoh bahwa pengambilan tanpa pengaturan mempercepat penurunan persediaan dan dapat mengurangi kesempatan petani lain.', NULL, NULL),
(265, 265, 'Jawaban: A
Pembahasan: Hasil awal berbeda meskipun jenis buah sama. Setelah prosedur diseragamkan, perbedaan mengecil; ini menunjukkan prosedur memengaruhi hasil.', NULL, NULL),
(266, 266, 'Jawaban: A
Pembahasan: Perbandingan yang lebih konsisten membantu siswa menilai hasil berdasarkan bukti, bukan perbedaan cara pengukuran.', NULL, NULL),
(267, 267, 'Jawaban: A dan B dan D
Pembahasan: Teks menyebut kematangan buah, prosedur pemasangan, dan pentingnya pencatatan. C bertentangan dengan peringatan guru.', NULL, NULL),
(268, 268, 'Jawaban: A
Pembahasan: Pemisahan fakta dan dugaan membuat kesimpulan lebih sesuai dengan bukti yang tersedia.', NULL, NULL),
(269, 269, 'Jawaban: A
Pembahasan: Teks menunjukkan sekolah mengatur titik berkumpul, penggunaan helm, rute, dan dukungan warga. Faktor itu membuat pilihan bersepeda lebih terarah.', NULL, NULL),
(270, 270, 'Jawaban: A
Pembahasan: Teks menyatakan pilihan transportasi dipengaruhi cuaca, keamanan, jarak, dan kesiapan keluarga.', NULL, NULL),
(271, 271, 'Jawaban: A dan B dan D
Pembahasan: Ketiga faktor tersebut disebut langsung atau disimpulkan dari uraian. Teks justru menolak jumlah pesepeda sebagai satu-satunya ukuran.', NULL, NULL),
(272, 272, 'Jawaban: A
Pembahasan: Teks menekankan bahwa keamanan, jarak, cuaca, dan kondisi keluarga memengaruhi pilihan transportasi.', NULL, NULL),
(273, 273, 'Jawaban: A
Pembahasan: Identifikasi belum selesai dan dampak terhadap lingkungan belum diketahui. Karena itu, tindakan pencegahan diperlukan.', NULL, NULL),
(274, 274, 'Jawaban: A
Pembahasan: Teks tidak menyatakan ikan pasti berbahaya. Pemeriksaan hanya memastikan bahwa ikan bukan jenis biasa, sehingga tindakan pencegahan dipilih.', NULL, NULL),
(275, 275, 'Jawaban: A dan B dan D
Pembahasan: Teks menekankan ketidakpastian, identifikasi, dan pencegahan penyebaran. C bertentangan dengan pernyataan penyuluh.', NULL, NULL),
(276, 276, 'Jawaban: A
Pembahasan: Teks memilih tindakan pencegahan sambil menunggu petunjuk lebih lanjut, bukan keputusan akhir sebelum informasi cukup.', NULL, NULL),
(277, 277, 'Jawaban: A
Pembahasan: Peneliti menyadari wadah terbuka dapat menerima partikel dari lingkungan. Wadah lebih terlindungi membantu mengurangi sumber kesalahan tersebut.', NULL, NULL),
(278, 278, 'Jawaban: A
Pembahasan: Teks membedakan fakta pengamatan dari dugaan asal partikel dan menekankan perlunya metode yang sesuai.', NULL, NULL),
(279, 279, 'Jawaban: A dan B dan D
Pembahasan: Ketiganya sesuai dengan penjelasan tentang sumber kesalahan, prosedur konsisten, dan batas kesimpulan. C ditolak oleh teks.', NULL, NULL),
(280, 280, 'Jawaban: A
Pembahasan: Pemisahan tersebut membantu siswa memahami batas pengetahuan dan menyusun kesimpulan berdasarkan bukti yang cukup.', NULL, NULL),
(281, 281, 'Jawaban: A
Pembahasan: Teks menyatakan hasil tanaman dan penggunaan air yang baik menjadi salah satu syarat untuk mempertimbangkan perluasan, bersama pemeriksaan keamanan dan biaya.', NULL, NULL),
(282, 282, 'Jawaban: A
Pembahasan: Data lintas musim yang konsisten akan memperkuat dasar pertimbangan, tetapi teks tetap mensyaratkan pemeriksaan lain.', NULL, NULL),
(283, 283, 'Jawaban: A dan B dan D
Pembahasan: Teks menyebut pengumpulan data, pemilihan tanaman, serta pemeriksaan konstruksi dan drainase. C bertentangan dengan teks.', NULL, NULL),
(284, 284, 'Jawaban: A
Pembahasan: Keputusan perluasan mempertimbangkan biaya perawatan selain suhu, sehingga biaya tinggi dapat membuat sekolah meninjau kembali rencana.', NULL, NULL),
(285, 285, 'Jawaban: A
Pembahasan: Teks menyatakan penggunaan yang konsisten dan pengurangan kendaraan menjadi dasar mempertahankan atau memperluas layanan.', NULL, NULL),
(286, 286, 'Jawaban: A
Pembahasan: Teks memberi contoh sebelumnya bahwa kerusakan bus tanpa kendaraan pengganti menyebabkan beberapa siswa terlambat.', NULL, NULL),
(287, 287, 'Jawaban: A dan B dan D
Pembahasan: Ketiganya sesuai dengan rencana evaluasi. C berlawanan dengan logika penggunaan optimal dan biaya.', NULL, NULL),
(288, 288, 'Jawaban: A
Pembahasan: Teks menyebut pengelola akan menggunakan data ketepatan waktu untuk mengevaluasi rute dan mengumpulkan masukan pengguna.', NULL, NULL),
(289, 289, 'Jawaban: A
Pembahasan: Teks menyatakan sekolah dapat menggunakan pola yang sama jika catatan membantu kebiasaan membaca tanpa menambah beban.', NULL, NULL),
(290, 290, 'Jawaban: A
Pembahasan: Sekolah merencanakan perbandingan data partisipasi dan survei. Dua data itu perlu dibaca bersama untuk memahami hasil program.', NULL, NULL),
(291, 291, 'Jawaban: A dan B dan D
Pembahasan: Teks secara eksplisit merencanakan catatan singkat, rak rekomendasi, serta evaluasi melalui data partisipasi dan survei.', NULL, NULL),
(292, 292, 'Jawaban: A
Pembahasan: Guru sudah mengkhawatirkan beban tugas dan berencana membuat catatan singkat. Jika beban meningkat, penyesuaian bentuk catatan adalah respons yang paling sesuai.', NULL, NULL),
(293, 293, 'Jawaban: A
Pembahasan: Teks menyatakan hasil yang baik pada penggunaan air, biaya, perawatan, dan kesehatan tanaman menjadi dasar penambahan instalasi.', NULL, NULL),
(294, 294, 'Jawaban: A
Pembahasan: Teks secara langsung menyebut bahwa jika perawatan terlalu tinggi, sistem tetap digunakan sebagai proyek pembelajaran skala kecil.', NULL, NULL),
(295, 295, 'Jawaban: A dan B dan D
Pembahasan: Teks menekankan data yang cukup, perbandingan setara, dan biaya. C bertentangan dengan peringatan bahwa hasil beberapa minggu belum cukup.', NULL, NULL),
(296, 296, 'Jawaban: A
Pembahasan: Sebelumnya tim menemukan kebocoran dan memperbaikinya sehingga kehilangan air berkurang. Pola itu menjadi dasar prediksi tindakan berikutnya.', NULL, NULL),
(297, 297, 'Jawaban: A
Pembahasan: Teks menyatakan bahwa jika pencatatan menghasilkan pola yang jelas, kelurahan akan mempertimbangkan pemasangan papan serupa.', NULL, NULL),
(298, 298, 'Jawaban: A
Pembahasan: Teks menemukan bahwa kenaikan air lebih cepat ketika saluran tersumbat. Prediksi tersebut mengikuti pola yang diamati.', NULL, NULL),
(299, 299, 'Jawaban: A dan B dan D
Pembahasan: Teks menempatkan papan sebagai alat pemantauan, bukan alat memastikan banjir. Data dan pelaporan menjadi bagian dari tindak lanjut.', NULL, NULL),
(300, 300, 'Jawaban: A
Pembahasan: Pemantauan konsisten diperlukan untuk menghasilkan pola. Data yang tidak lengkap akan menyulitkan penarikan pola tersebut.', NULL, NULL),
(301, 301, 'Jawaban: B
Pembahasan: Teks mengulas tentang pengolahan sisa makanan (sampah organik) menjadi kompos mandiri. Tindakan yang paling relevan dalam kehidupan sehari-hari adalah memisahkan sisa sayuran dapur untuk diolah menjadi kompos.', NULL, NULL),
(302, 302, 'Jawaban: Pernyataan 1 dan Pernyataan 3
Pembahasan: Penerapan relevan dari teks adalah beralih dari kendaraan pribadi ke transportasi umum seperti kereta komuter dan bus kota.', NULL, NULL),
(303, 303, 'Jawaban: B
Pembahasan: Tindakan memeriksa kadar gula pada label kemasan minuman secara langsung mencerminkan pesan teks untuk memperhatikan label nutrisi.', NULL, NULL),
(304, 304, 'Jawaban: A
Pembahasan: Bakau sama artinya dengan mangrove. Kegiatan menanam bibit mangrove relevan dengan solusi pencegahan abrasi yang dijelaskan pada teks.', NULL, NULL),
(305, 305, 'Jawaban: Pernyataan 1 dan Pernyataan 3
Pembahasan: Membayar dengan kode QR dan penyediaan pembayaran nontunai merupakan contoh nyata transaksi elektronik/nirkontak.', NULL, NULL),
(306, 306, 'Jawaban: B
Pembahasan: Teks menjelaskan bahaya paparan sinar gawai menjelang tidur, sehingga kebiasaan yang relevan untuk diubah adalah menjauhkan ponsel sebelum tidur.', NULL, NULL),
(307, 307, 'Jawaban: B
Pembahasan: Menutup rapat keran toilet sekolah merupakan wujud penghematan air yang relevan dengan gagasan teks.', NULL, NULL),
(308, 308, 'Jawaban: Pernyataan 1 dan Pernyataan 3
Pembahasan: Membeli dari petani lokal dan mengonsumsi hasil panen organik lokal relevan dengan dua manfaat yang disebutkan pada teks.', NULL, NULL),
(309, 309, 'Jawaban: B
Pembahasan: Berjalan kaki atau berolahraga ringan merupakan bentuk aktivitas fisik teratur yang disarankan pada wacana.', NULL, NULL),
(310, 310, 'Jawaban: A
Pembahasan: Menyediakan wadah terpisah sesuai jenis sampah merupakan bentuk nyata dari pemilahan sampah.', NULL, NULL),
(311, 311, 'Jawaban: Pernyataan 1 dan Pernyataan 3
Pembahasan: Membawa tas kain sendiri dan menolak kantong plastik sekali pakai sesuai dengan pesan penghematan plastik pada teks.', NULL, NULL),
(312, 312, 'Jawaban: B
Pembahasan: Memeriksa kebenaran berita terlebih dahulu merupakan bentuk penerapan literasi digital untuk mencegah penyebaran hoaks.', NULL, NULL),
(313, 313, 'Jawaban: A
Pembahasan: Menanam jahe dan kunyit di pot pekarangan secara langsung merealisasikan konsep tanaman obat keluarga (TOGA).', NULL, NULL),
(314, 314, 'Jawaban: Pernyataan 1 dan Pernyataan 2
Pembahasan: Membersihkan got/saluran air dan menguras penampungan air mencegah perkembangbiakan nyamuk pembawa demam berdarah.', NULL, NULL),
(315, 315, 'Jawaban: B
Pembahasan: Mengganti bohlam lama menjadi LED adalah langkah konkret penerapan penghematan energi sesuai wacana.', NULL, NULL),
(316, 316, 'Jawaban: C
Pembahasan: Mencuci tangan dengan sabun dan air mengalir di wastafel sekolah secara langsung mencerminkan arahan teks.', NULL, NULL),
(317, 317, 'Jawaban: Pernyataan 1 dan Pernyataan 3
Pembahasan: Pengumpulan tugas daring dan ujian berbasis komputer meminimalkan penggunaan kertas (paperless).', NULL, NULL),
(318, 318, 'Jawaban: B
Pembahasan: Menggunakan knalpot standar pabrik mengurangi pencemaran suara yang dikeluhkan pada wacana.', NULL, NULL),
(319, 319, 'Jawaban: A
Pembahasan: Mengonsumsi singkong dan ubi kukus merupakan penerapan nyata diversifikasi/penganekaragaman pangan lokal pengganti nasi.', NULL, NULL),
(320, 320, 'Jawaban: Pernyataan 1 dan Pernyataan 3
Pembahasan: Bersepeda bersama dan jalan santai bersama keluarga memadukan unsur olahraga dan interaksi emosional keluarga.', NULL, NULL),
(321, 321, 'Jawaban: B
Pembahasan: Kedua teks secara konsisten menyatakan bahwa teh hijau mengandung antioksidan yang bermanfaat menjaga/melindungi kesehatan kulit dari sinar radiasi/UV.', NULL, NULL),
(322, 322, 'Jawaban: Pernyataan 1 dan Pernyataan 2Pembahasan: Pernyataan 1 benar karena kedua teks berfokus pada perpustakaan digital. Pernyataan 2 benar karena Teks B menyinggung penurunan pengunjung perpustakaan fisik akibat e-book.', NULL, NULL),
(323, 323, 'Jawaban: B
Pembahasan: Teks menunjukkan pertentangan antara kelengkapan fasilitas hiburan (joging, bermain, Wi-Fi) dengan keterbatasan jumlah tempat sampah.', NULL, NULL),
(324, 324, 'Jawaban: B
Pembahasan: Kata penanda "selain..." memberikan intensifikasi/penekanan tambahan pada faktor penyebab luapan air (yaitu sampah plastik).', NULL, NULL),
(325, 325, 'Jawaban: Pernyataan 1 dan Pernyataan 2
Pembahasan: Kedua teks membicarakan manfaat lidah buaya, dengan spesifikasi Teks 1 untuk kulit dan Teks 2 untuk rambut/kecantikan.', NULL, NULL),
(326, 326, 'Jawaban: B
Pembahasan: Secara denotatif dalam ilmu lingkungan, istilah "emisi" merujuk pada pemancaran/pengeluaran zat, gas, atau radiasi (sisa pembakaran) ke udara.', NULL, NULL),
(327, 327, 'Jawaban: B
Pembahasan: Keduanya konsisten secara matematis/kuantitatif; 10% dari total 500 ton sampah pada Teks A persis senilai dengan 50 ton pada Teks B.', NULL, NULL),
(328, 328, 'Jawaban: Pernyataan 1 dan Pernyataan 2
Pembahasan: Ciri teks informasi SMP adalah memakai istilah teknis ("cagar budaya", "kelembapan") dan menggunakan makna denotatif (sebenarnya).', NULL, NULL),
(329, 329, 'Jawaban: B
Pembahasan: Judul tidak sesuai karena isi teks menguraikan prinsip kerja dan keramahan lingkungan dari PLTS, bukan tata cara perawatannya.', NULL, NULL),
(330, 330, 'A. Sesuai, karena menghubungkan dua pernyataan yang bertentangan atau mempertentangkan keadaan.
B. Tidak sesuai, karena seharusnya memakai konjungsi penambahan seperti "lagipula".
C. Sesuai, karena berfungsi menyimpulkan isi dari kalimat pertama.
D. Tidak sesuai, karena kalimat kedua menunjukkan hubungan sebab-akibat langsung.', NULL, NULL),
(331, 331, 'Jawaban: Pernyataan 1 dan Pernyataan 2
Pembahasan: Pernyataan 1 benar (dampak positif sepeda) dan Pernyataan 2 benar (Teks 1 menyantumkan angka 15%).', NULL, NULL),
(332, 332, 'Jawaban: B
Pembahasan: Menanam jagung dan kacang tanah pada satu lahan secara bersamaan tepat menggambarkan penjelasan metode tumpang sari.', NULL, NULL),
(333, 333, 'Jawaban: B
Pembahasan: Argumen pilihan B akurat mendukung teks karena menjelaskan alasan tanah menjadi gembur dan mikroorganisme berkembang.', NULL, NULL),
(334, 334, 'Jawaban: Pernyataan 1 dan Pernyataan 3
Pembahasan: Kedua berita sama-sama menyebutkan lokasi di Kota Y dan mengonfirmasi bahwa gempa tersebut tidak berpotensi tsunami.', NULL, NULL),
(335, 335, 'Jawaban: C
Pembahasan: Pernyataan C bertentangan dengan teks, karena teks menyebutkan bahwa buku yang dibaca adalah buku nonpelajaran.', NULL, NULL),
(336, 336, 'Jawaban: B
Pembahasan: Konjungsi "Sebaliknya" dengan tepat mempertentangkan dampak buruk plastik sekali pakai dan keunggulan wadah kaca/baja.', NULL, NULL),
(337, 337, 'Jawaban: Pernyataan 1 dan Pernyataan 2
Pembahasan: Teks 1 (mekanisme antibodi) berkolaborasi logis dengan Teks 2 (manfaat penurunan risiko gejala berat), dan keduanya bernada mendukung vaksinasi.', NULL, NULL),
(338, 338, 'Jawaban: B
Pembahasan: Istilah teknis "vegetasi" memiliki makna denotatif yang tepat yaitu dunia tumbuh-tumbuhan atau pepohonan penutup tanah.', NULL, NULL),
(339, 339, 'Jawaban: C
Pembahasan: Informasi pada C akurat secara eksplisit sesuai kalimat kedua wacana.', NULL, NULL),
(340, 340, 'Jawaban: Pernyataan 1, Pernyataan 2, dan Pernyataan 3
Pembahasan: Teks A memberikan persentase (40%), Teks B memberikan penggambaran kondisi/kebiasaan warga, dan keduanya berlokasi di Desa Z dengan nada informasi yang selaras.', NULL, NULL),
(341, 341, 'Jawaban: B
Pembahasan: Fakta mengenai penyu yang mati tersumbat plastik secara emosional memicu rasa sedih, iba, dan keprihatinan pembaca terhadap dampak buruk pencemaran lingkungan.', NULL, NULL),
(342, 342, 'Jawaban: Pernyataan 1 dan Pernyataan 2
Pembahasan: Informasi tentang aksi tulus relawan menginspirasi dan menimbulkan rasa terharu serta kagum atas kepedulian sosial mereka.', NULL, NULL),
(343, 343, 'Jawaban: A
Pembahasan: Penderitaan para korban di pengungsian secara alamiah membangkitkan empati, iba, dan kepedulian afektif dari pembaca.', NULL, NULL),
(344, 344, 'Jawaban: A
Pembahasan: Keberhasilan remaja disabilitas berinovasi memunculkan apresiasi positif berupa kekaguman (takjub) dan inspirasi bagi pembaca.', NULL, NULL),
(345, 345, 'Jawaban: Pernyataan 1 dan Pernyataan 2
Pembahasan: Dampak buruk cyberbullying menimbulkan respons berupa kekesalan/prihatin terhadap pelaku serta simpati terhadap korban.', NULL, NULL),
(346, 346, 'Jawaban: A
Pembahasan: Berita ancaman kepunahan satwa endemic memicu respons emosional berupa kecemasan dan kekhawatiran atas kerusakan alam.', NULL, NULL),
(347, 347, 'Jawaban: B
Pembahasan: Berita keberhasilan gotong royong dan rasa syukur warga menghadirkan dampak afektif lega dan senang bagi pembaca.', NULL, NULL),
(348, 348, 'Jawaban: Pernyataan 1 dan Pernyataan 2
Pembahasan: Penurunan etika berbahasa memicu keresahan dan keprihatinan afektif pada diri pembaca yang peduli norma kesantunan.', NULL, NULL),
(349, 349, 'Jawaban: A
Pembahasan: Fakta peningkatan angka gangguan mata anak memicu rasa khawatir sekaligus kewaspadaan dalam penggunaan gawai harian.', NULL, NULL),
(350, 350, 'Jawaban: A
Pembahasan: Angka keberhasilan pengurangan sampah plastik membangkitkan rasa bangga serta optimisme atas kesadaran lingkungan masyarakat.', NULL, NULL),
(351, 351, 'Jawaban: Pernyataan 1 dan Pernyataan 2
Pembahasan: Penderitaan warga berjalan jauh demi air memicu emosi terenyuh (iba) dan keprihatinan atas lambatnya bantuan.', NULL, NULL),
(352, 352, 'Jawaban: A
Pembahasan: Inovasi murah berorientasi sosial menghadirkan kekaguman dan dukungan afektif dari pembaca.', NULL, NULL),
(353, 353, 'Jawaban: A
Pembahasan: Kerugian publik akibat berita hoaks memicu keresahan serta kekesalan (geram) afektif bagi pembaca.', NULL, NULL),
(354, 354, 'Jawaban: Pernyataan 1 dan Pernyataan 2
Pembahasan: Berita pemulihan lingkungan dan kembalinya satwa langka mendatangkan kebahagiaan (sukacita) dan rasa puas bagi pembaca.', NULL, NULL),
(355, 355, 'Jawaban: A
Pembahasan: Prestasi internasional di tengah keterbatasan sarana membakar rasa bangga dan haru pembaca atas perjuangan atlet tanah air.', NULL, NULL),
(356, 356, 'Jawaban: A
Pembahasan: Ketimpangan antara buang-buang makanan dan pemanasan global memicu rasa prihatin dan kesadaran untuk bertindak bijak.', NULL, NULL),
(357, 357, 'Jawaban: Pernyataan 1 dan Pernyataan 2
Pembahasan: Aksi kemanusiaan sukarelawan membangkitkan rasa tersentuh dan rasa syukur atas keberadaan solidaritas sosial.', NULL, NULL),
(358, 358, 'Jawaban: A
Pembahasan: Hambatan komunikasi akibat bahasa yang tidak komunikatif memunculkan kebingungan dan kekesalan (jengkel) pada pembaca awam.', NULL, NULL),
(359, 359, 'Jawaban: APembahasan: Dedikasi tanpa pamrih membersihkan danau secara afektif mengundang rasa kagum dan rasa hormat dari pembaca.', NULL, NULL),
(360, 360, 'Jawaban: Pernyataan 1 dan Pernyataan 2
Pembahasan: Bencana asap buatan manusia yang merugikan anak-anak secara emosional memunculkan kecaman/kemarahan pada pelaku serta rasa kasihan pada korban anak.', NULL, NULL),
(361, 361, '- Kunci Jawaban: C
- Pembahasan: Paragraf kedua menyatakan bahwa media tanam adalah bahan tempat akar tumbuh, sehingga opsi C benar. Opsi A keliru karena wadah tanam dalam teks adalah pot. Opsi B dan D tidak berkaitan dengan media tanam; menyiram dan menyimpan hasil panen adalah kegiatan lain.', NULL, NULL),
(362, 362, '- Kunci Jawaban: D
- Pembahasan: Teks menyebut sawi sebagai contoh tanaman: benih sawi mulai bertunas setelah tiga hari dan sawi siap dipanen setelah empat minggu. Bayam, kangkung, dan cabai tidak disebut dalam teks.', NULL, NULL),
(363, 363, '- Kunci Jawaban: A
- Pembahasan: Kata pemanenan dibentuk dari kata dasar panen dengan imbuhan pe-an, yang berarti kegiatan memetik hasil tanaman. Paragraf keempat menjelaskan cara memetik daun sawi. Opsi B, C, dan D adalah kegiatan lain yang dibahas pada paragraf kedua dan ketiga.', NULL, NULL),
(364, 364, '- Kunci Jawaban: B
- Pembahasan: Kalimat "Rantainya berbunyi keras di sepanjang jalan" dan "Jalanan desa masih lembap oleh embun" menunjukkan bahwa cerita dimulai di jalan desa. Opsi A hanya muncul di akhir cerita, opsi C hanya muncul dalam kilas balik, dan opsi D tidak disebut.', NULL, NULL),
(365, 365, '- Kunci Jawaban: A, C, D
- Pembahasan: Kata berkarat dan kusam terdapat pada kalimat "Catnya sudah kusam dan berkarat", sedangkan frasa sepeda bekas terdapat pada kalimat "Uang Bapak hanya cukup untuk sepeda bekas". Ketiganya menunjukkan sepeda sudah lama dipakai. Opsi B keliru karena menembus hujan menunjukkan ketangguhan sepeda, bukan lamanya dipakai.', NULL, NULL),
(366, 366, '- Kunci Jawaban: C
- Pembahasan: Kata kusam pada kalimat "Catnya sudah kusam dan berkarat" menggambarkan cat yang pudar, tidak cerah, dan tidak mengilap. Opsi A dan D bertentangan dengan keadaan sepeda yang tua, sedangkan opsi B tidak disebut dalam teks.', NULL, NULL),
(367, 367, '- Kunci Jawaban: D
- Pembahasan: Paragraf kedua menyebut bahwa peternak memindahkan sarang ke kotak kayu bernama stup, sehingga opsi D benar. Opsi A adalah sarang alami sebelum dipindahkan. Opsi B dan C tidak disebut sebagai fungsi stup; teks hanya menyebut stup melindungi lebah dari hujan.', NULL, NULL),
(368, 368, '- Kunci Jawaban: A, C, D
- Pembahasan: Paragraf ketiga menyatakan bahwa propolis adalah getah tanaman yang dikumpulkan lebah (A), dipakai untuk menutup celah sarang (C), dan dimanfaatkan manusia sebagai bahan obat tradisional (D). Opsi B keliru karena kotak tempat sarang lebah bernama stup.', NULL, NULL),
(369, 369, '- Kunci Jawaban: B
- Pembahasan: Paragraf keempat menjelaskan bahwa penyerbukan adalah perpindahan serbuk sari ke putik, sehingga opsi B benar. Opsi C adalah akibat dari penyerbukan, bukan artinya. Opsi A dan D tidak sesuai dengan isi teks.', NULL, NULL),
(370, 370, '- Kunci Jawaban: A
- Pembahasan: Cakrawala adalah garis batas tempat langit dan laut tampak bertemu. Ayu menatapnya sambil menunggu kapal Ayah yang belum terlihat. Opsi B, C, dan D tidak sesuai dengan makna kata tersebut dan konteks kalimatnya.', NULL, NULL),
(371, 371, '- Kunci Jawaban: A, C, D
- Pembahasan: Pelabuhan Sendang dan ujung dermaga disebut pada paragraf pertama, sedangkan jendela tempat Ibu menyalakan pelita disebut pada paragraf kedua. Hutan bakau (opsi B) tidak disebut dalam cerita.', NULL, NULL),
(372, 372, '- Kunci Jawaban: C
- Pembahasan: Kalimat "Suara mesinnya terdengar lirih, tetapi pasti" menggambarkan suara mesin kapal yang masih jauh sehingga pelan dan hampir tak terdengar. Opsi A bertentangan dengan makna lirih. Opsi B dan D tidak sesuai dengan konteks kalimat.', NULL, NULL),
(373, 373, '- Kunci Jawaban: D
- Pembahasan: Ekosistem adalah kesatuan makhluk hidup dengan lingkungan tempat tinggalnya. Teks menyebut terumbu karang sebagai rumah bagi ikan, kepiting, dan penyu yang bergantung padanya, sehingga membentuk kesatuan tersebut. Opsi A hanya menyebut tempat berkumpul, sedangkan opsi B dan C tidak sesuai dengan teks.', NULL, NULL),
(374, 374, '- Kunci Jawaban: A, C, D
- Pembahasan: Paragraf ketiga menyatakan bahwa suhu laut yang terlalu panas membuat alga keluar (C, D), karang kehilangan warna dan tampak putih (A), dan peristiwa itu disebut pemutihan karang. Opsi B keliru karena teks menyatakan karang yang memutih belum tentu mati.', NULL, NULL),
(375, 375, '- Kunci Jawaban: B
- Pembahasan: Kalimat-kalimat sebelumnya menyebut alga memberi makanan dan warna pada karang, sedangkan karang memberi tempat tinggal bagi alga. Artinya kedua pihak sama-sama memperoleh manfaat. Opsi A dan C hanya menyebut satu pihak, sedangkan opsi D bertentangan dengan teks.', NULL, NULL),
(376, 376, '- Kunci Jawaban: C
- Pembahasan: Kakak pergi merantau ke Kalimantan dan bekerja di pabrik kayu agar adik-adiknya tetap bersekolah, sehingga merantau berarti pergi ke daerah lain untuk mencari nafkah. Opsi A dan D tidak sesuai dengan tujuan Kakak, dan opsi B keliru karena Nadia dan keluarganya tetap tinggal di rumah.', NULL, NULL),
(377, 377, '- Kunci Jawaban: B, D
- Pembahasan: Hatinya terasa berat bermakna sedih melepas kepergian, dan kepala batu bermakna keras kepala; keduanya bukan makna sebenarnya. Hujan gerimis dan amplopnya sedikit basah menggunakan makna sebenarnya.', NULL, NULL),
(378, 378, '- Kunci Jawaban: A
- Pembahasan: Awan kelabu yang perlahan menepi digambarkan bergeser ke pinggir langit sehingga seberkas cahaya sore dapat menembus genting. Awan tidak jatuh, tidak berkumpul di tengah, dan tidak menghitam, sehingga opsi B, C, dan D salah.', NULL, NULL),
(379, 379, '- Kunci Jawaban: B
- Pembahasan: Kalimat sebelum istilah tersebut menyatakan bahwa panel surya mengubah cahaya menjadi listrik, dan proses itu disebut konversi energi. Jadi maknanya adalah perubahan bentuk energi menjadi bentuk lain. Opsi A adalah tahap sesudahnya, sedangkan opsi C dan D tidak disebut dalam teks.', NULL, NULL),
(380, 380, '- Kunci Jawaban: B, C, D
- Pembahasan: Paragraf ketiga menyatakan bahwa sinar matahari termasuk energi terbarukan (B), energi terbarukan tidak akan habis dipakai (C), dan sifatnya berbeda dengan bahan bakar fosil seperti batu bara (D). Opsi A keliru karena batu bara adalah contoh bahan bakar fosil.', NULL, NULL),
(381, 381, '- Kunci Jawaban: B
- Pembahasan: Paragraf 1 menyebutkan Kakek Jaya keluar membawa gulungan benang. Bambu, kertas, dan lem nasi baru dipakai pada paragraf 2, sedangkan layang-layang belum dibuat.', NULL, NULL),
(382, 382, '- Kunci Jawaban: C
- Pembahasan: Paragraf 1 menyebutkan Bima baru saja kalah dalam lomba lari. Putusnya layang-layang terjadi kemudian (paragraf 3), dan opsi B serta D tidak disebutkan.', NULL, NULL),
(383, 383, '- Kunci Jawaban: D
- Pembahasan: Paragraf 3 menyebutkan benang tiba-tiba putus sehingga layang-layang terbang jauh ke tepi hutan.', NULL, NULL),
(384, 384, '- Kunci Jawaban: A, B, C
- Pembahasan: Paragraf 2 menyebutkan bambu, kertas warna, dan lem nasi. Plastik dan kawat tidak disebutkan dalam teks.', NULL, NULL),
(385, 385, '- Kunci Jawaban: 1 = Benar; 2 = Salah; 3 = Salah
- Pembahasan: (1) Benar, sesuai paragraf 2. (2) Salah, paragraf 3 menyebut layang-layang selesai menjelang magrib. (3) Salah, paragraf 4 menyebut layang-layang kedua berwarna biru.', NULL, NULL),
(386, 386, '- Kunci Jawaban: A
- Pembahasan: Paragraf 1 menyebutkan isi kotak Laras adalah bros berbentuk bunga matahari. Buku catatan dibawa Yoga, dan mawar dibawa Maya.', NULL, NULL),
(387, 387, '- Kunci Jawaban: B
- Pembahasan: Paragraf 2 menyebutkan Laras merasa hadiahnya paling sederhana, lalu menyembunyikan kotaknya di dalam tas.', NULL, NULL),
(388, 388, '- Kunci Jawaban: D
- Pembahasan: Paragraf 2 menyebutkan Maya membawa sekuntum mawar dari kebunnya. Opsi A dibawa Yoga, sedangkan opsi B dan C milik Laras.', NULL, NULL),
(389, 389, '- Kunci Jawaban: D
- Pembahasan: Paragraf 1 menyebutkan Ari membawa termos berisi teh hangat. Jaring disiapkan oleh Pak Darto, sedangkan buku catatan dan bekal nasi tidak disebutkan.', NULL, NULL),
(390, 390, '- Kunci Jawaban: A
- Pembahasan: Kalimat pertama paragraf 1 menyebutkan bahwa mereka berangkat subuh.', NULL, NULL),
(391, 391, '- Kunci Jawaban: B
- Pembahasan: Paragraf 3 memuat ucapan Pak Darto, "Ari, pegang tali ini kuat-kuat." Opsi lain tidak disebutkan dalam teks.', NULL, NULL),
(392, 392, '- Kunci Jawaban: C
- Pembahasan: Paragraf 3 menyebutkan mereka menarik tali bersama sekuat tenaga sampai jaring terlepas dari karang.', NULL, NULL),
(393, 393, '- Kunci Jawaban: 1 = Salah; 2 = Benar; 3 = Benar
- Pembahasan: (1) Salah. Paragraf 1 menyebut ini pertama kalinya Ari melaut. (2) Benar, sesuai paragraf 4. (3) Benar, sesuai paragraf 4.', NULL, NULL),
(394, 394, '- Kunci Jawaban: B
- Pembahasan: Paragraf 1 menyebut Bu Wati sebagai penjaga perpustakaan. Tika adalah teman sekelas Dimas.', NULL, NULL),
(395, 395, '- Kunci Jawaban: C
- Pembahasan: Paragraf 2 menyebut Bu Wati mengatakan buku itu sedang dipinjam oleh Tika.', NULL, NULL),
(396, 396, '- Kunci Jawaban: B
- Pembahasan: Paragraf 2 menyebutkan bahwa Dimas duduk di sudut ruangan dan membaca kamus bergambar.', NULL, NULL),
(397, 397, '- Kunci Jawaban: A, B
- Pembahasan: Paragraf 4 menyebutkan Bu Wati memasang tikar dan dua bantal. Lampu meja dan rak buku baru tidak disebutkan.', NULL, NULL),
(398, 398, '- Kunci Jawaban: D
- Pembahasan: Paragraf 3 menyebutkan Dimas menjelaskan bahwa planet berwarna biru itu bernama Neptunus.', NULL, NULL),
(399, 399, 'Pada paragraf 2 teks "Hadiah untuk Bu Ningsih" disebutkan secara tersurat bahwa Yoga membawa buku catatan bersampul biru untuk Bu Ningsih.', NULL, NULL),
(400, 400, 'Pada paragraf 4 teks "Hadiah untuk Bu Ningsih" dijelaskan bahwa mata Bu Ningsih berkaca-kaca melihat bros bunga matahari dan langsung menyematkannya di bajunya serta memakainya sepanjang hari.', NULL, NULL),
(401, 401, '- Kunci Jawaban: B
- Pembahasan: Paragraf 1 memperkenalkan latar (pasar pagi), tokoh (Wulan dan ibu), dan awal peristiwa (suara mengeong lemah). Opsi A tidak disebutkan, sedangkan opsi C dan D bukan gagasan utama.', NULL, NULL),
(402, 402, '- Kunci Jawaban: C
- Pembahasan: Menurut paragraf 2 sampai 5, Wulan menemukan kucing, bertanya kepada pedagang, lalu nenek datang mengaku sebagai pemilik, dan terakhir memberi kue pisang.', NULL, NULL),
(403, 403, '- Kunci Jawaban: B
- Pembahasan: Paragraf 3 menceritakan Ibu dan Wulan mendatangi lapak ikan, buah, dan jajanan untuk bertanya kepada pedagang.', NULL, NULL),
(404, 404, '- Kunci Jawaban: A, B, C
- Pembahasan: Opsi A, B, dan C tertulis di paragraf 4. Opsi D ada di paragraf 5, dan opsi E ada di paragraf 2.', NULL, NULL),
(405, 405, '- Kunci Jawaban: 1 = Benar; 2 = Salah; 3 = Benar
- Pembahasan: (1) Benar. (2) Salah, bertanya kepada pedagang ada di paragraf 3; paragraf 5 tentang pemberian kue dan pelajaran. (3) Benar.', NULL, NULL),
(406, 406, '- Kunci Jawaban: C
- Pembahasan: Paragraf 2 menceritakan celengan yang penuh dan perjalanan Kiki bersama ibu ke toko sepeda.', NULL, NULL),
(407, 407, '- Kunci Jawaban: A
- Pembahasan: Paragraf 3 diawali harga yang lebih mahal sehingga uang kurang, Kiki lesu, pemilik toko tersenyum karena mengenal ayah Kiki, lalu membebaskan kekurangan bayar.', NULL, NULL),
(408, 408, '- Kunci Jawaban: C
- Pembahasan: Masalah muncul di paragraf 3, yaitu harga sepeda lebih mahal sehingga uang Kiki kurang seratus ribu rupiah.', NULL, NULL),
(409, 409, '- Kunci Jawaban: 1 = Benar; 2 = Salah; 3 = Benar
- Pembahasan: (1) Benar. (2) Salah, celengan dipecahkan di paragraf 2; paragraf 3 tentang uang yang kurang. (3) Benar.', NULL, NULL),
(410, 410, '- Kunci Jawaban: C
- Pembahasan: Paragraf 2 menceritakan Sinta teringat pesan nenek, memejamkan mata, dan membayangkan kebun nenek sehingga ia tersenyum.', NULL, NULL),
(411, 411, '- Kunci Jawaban: B
- Pembahasan: Cerita bergerak dari rasa takut di paragraf 1, kenangan pesan nenek di paragraf 2, proses melukis di paragraf 3, hingga pengumuman juara di paragraf 4.', NULL, NULL),
(412, 412, '- Kunci Jawaban: D
- Pembahasan: Paragraf 4 memuat hasil lomba dan perubahan sikap Sinta yang tidak takut lagi, yaitu akhir atau penyelesaian cerita.', NULL, NULL),
(413, 413, '- Kunci Jawaban: A, B
- Pembahasan: Opsi A dan B terjadi di paragraf 3, setelah bayangan kebun nenek muncul di paragraf 2. Opsi C dan D terjadi sebelumnya di paragraf 1.', NULL, NULL),
(414, 414, '- Kunci Jawaban: 1 = Benar; 2 = Salah; 3 = Benar
- Pembahasan: (1) Benar. (2) Salah, pesan nenek diingat di paragraf 2; paragraf 3 menceritakan proses melukis. (3) Benar.', NULL, NULL),
(415, 415, '- Kunci Jawaban: A
- Pembahasan: Paragraf 1 memaparkan hujan deras, naiknya air sungai, dan ajakan Pak RT agar warga berkumpul di balai desa. Opsi B ada di paragraf 3, dan opsi C dan D bukan gagasan utama.', NULL, NULL),
(416, 416, '- Kunci Jawaban: D
- Pembahasan: Kentongan dipukul di paragraf 1, Rafi sadar adiknya hilang di paragraf 2, ia menemukan Dita di paragraf 3, dan warga membersihkan lumpur di paragraf 4.', NULL, NULL),
(417, 417, '- Kunci Jawaban: C
- Pembahasan: Paragraf 3 menceritakan puncak cerita, yaitu Rafi menerobos hujan dan menemukan Dita. Opsi A dan B ada di awal cerita, opsi D di paragraf 4.', NULL, NULL),
(418, 418, '- Kunci Jawaban: B
- Pembahasan: Paragraf 4 menceritakan surutnya air, kerja bakti warga, pujian Pak RT, dan pelajaran yang didapat Rafi tentang keluarga.', NULL, NULL),
(419, 419, '- Kunci Jawaban: A, B, C
- Pembahasan: Opsi A, B, dan C tertulis di paragraf 2. Opsi D terjadi keesokan harinya pada paragraf 4.', NULL, NULL),
(420, 420, '- Kunci Jawaban: B
- Pembahasan: Paragraf 2 menceritakan celengan yang penuh, dipecahkan di depan ibu, lalu Kiki dan ibu pergi ke toko sepeda. Opsi A, C, dan D tidak sesuai isi paragraf.', NULL, NULL),
(421, 421, 'Kunci: B. Pada paragraf pertama dijelaskan bahwa Laras menerima sepeda dengan cat mengelupas, rantai berkarat, dan jok robek, sementara teman-temannya menaiki sepeda baru yang mengilap. Respons Laras yang selalu \'menunduk setiap kali mereka lewat\' secara inferensial menyiratkan rasa rendah diri (minder), bukan rasa bangga, marah, ataupun bosan.', NULL, NULL),
(422, 422, '- Pernyataan A benar karena Laras yang semula minder dan menunduk menjadi tersenyum bangga setelah tekun mengecat serta memperbaiki sepedanya sendiri.
- Pernyataan C benar karena sang ayah tidak mencela atau langsung membelikan baru, melainkan membimbing Laras secara sabar di bengkel kecil.
- Pilihan B dan D tidak sesuai dengan nilai moral yang terkandung di dalam teks.', NULL, NULL),
(423, 423, '- Pernyataan B (Salah): Teks tidak menyatakan motif ekonomi ayah, melainkan menekankan keteladanan ayah dalam mengajari anak merawat barang (\'Ayo, kita rawat bersama\').
- Pernyataan C (Benar): Senyuman lebar dan tepukan di sadel membuktikan kebanggaan Laras atas usaha perbaikan yang dilakukannya.', NULL, NULL),
(424, 424, 'Kunci: C. Detail langit menghitam, angin kencang bertiup, perahu terombang-ambing keras, Bayu menggigit bibir, dan radio pos jaga hanya mendesis secara inferensial membangun atmosfer yang tegang dan penuh kecemasan.', NULL, NULL),
(425, 425, '- Pernyataan A benar karena para nelayan membawa lentera, Ibu Sari membagikan teh, dan tak ada yang mau pulang lebih dahulu sebelum perahu ayah Bayu kembali.
- Pernyataan C benar karena kebersamaan warga menjadi penopang emosional bagi Bayu dan Pak Hasan.
- Pernyataan B dan D menyimpang dari maksud tersirat teks.', NULL, NULL),
(426, 426, '- Pernyataan B (Benar): Menepuk bahu tanpa banyak kata merupakan gestur menenangkan dan menguatkan anak yang ketakutan.
- Pernyataan C (Benar): Titik cahaya lampu perahu dan sorak gembira warga menyimpulkan kepulangan perahu yang selamat dari terpaan badai.', NULL, NULL),
(427, 427, 'Kunci: C. Perut Dimas berbunyi lapar dan uang di dompet sangat menggiurkan untuk membeli makanan, namun bayangan foto pemilik dompet yang mirip ibunya mendorong nuraninya untuk berlaku jujur dan mengembalikan uang tersebut.', NULL, NULL),
(428, 428, '- Pernyataan B benar karena Dimas tergerak membayangkan kesedihan ibu pemilik dompet yang mengingatkannya pada sang ibu.
- Pernyataan D benar karena Dimas menembus gerimis selama 20 menit dalam keadaan perut lapar demi mengembalikan dompet utuh kepada pemiliknya.', NULL, NULL),
(429, 429, '- Pernyataan B (Benar): Ibu pemilik dompet mengatakan \'Itu uang untuk membayar sekolah anakku\'.
- Pernyataan C (Benar): \'Perutnya masih lapar, tetapi hatinya terasa hangat\' menyimpulkan kepuasan spiritual dan moralitas atas tindakan terpuji.', NULL, NULL),
(430, 430, 'Kunci: C. Pak Sarman menggeleng pelan menolak uang banyak dan berujar \'Tanah ini yang menyekolahkanmu. Aku tidak menjual yang menghidupi kita\'. Sikap ini menunjukkan prinsip hidup yang teguh dan penghargaan mendalam pada ladang kehidupannya.', NULL, NULL),
(431, 431, '- Pernyataan A benar karena sawah-sawah tetangga telah berubah menjadi pagar seng dan gudang pabrik.
- Pernyataan D benar karena Pak Sarman mempertahankan tanah bukan semata karena nilai uang, melainkan karena sejarah perjuangan dan sumber nafkah keluarga yang bermartabat.', NULL, NULL),
(432, 432, '- Pernyataan B (Salah): Pria berjas hanya membujuk dengan janji hidup nyaman, tidak ada kekerasan fisik.
- Pernyataan C (Benar): Wahyu bangkit pagi-pagi membawa cangkul tanpa disuruh menandakan kesadarannya untuk melanjutkan pelestarian ladang keluarga.', NULL, NULL),
(433, 433, 'Kunci: C. Bu Wening tidak pernah membiarkan PR dikerjakan asal-asalan, yang semula terasa berat bagi murid namun pada akhirnya disadari sebagai cara beliau melatih kedisiplinan dan masa depan siswa.', NULL, NULL),
(434, 434, '- Pernyataan B benar karena penghapus yang aus melambangkan proses pengabdian 30 tahun mendidik dan menghapus kebodohan.
- Pernyataan C benar karena penuturan Rian menegaskan peralihan dari rasa sebal menjadi rasa syukur yang mendalam atas bimbingan guru.', NULL, NULL),
(435, 435, '- Pernyataan B (Salah): Penghapus aus diberikan sebagai warisan simbolis kenang-kenangan perjuangan mengajar, bukan suruhan belanja.
- Pernyataan C (Benar): Bu Wening berujar \'Kalian yang mengajari Ibu bersabar\' membuktikan hubungan edukatif timbal balik.', NULL, NULL),
(436, 436, 'Kunci: B. Percakapan kakek menerangkan bahwa jam saku tersebut adalah pemberian buyut dan retakannya saksi perjuangan masa merantau. Jam itu bukan sekadar penunjuk waktu mati, melainkan lambang pengingat filosofis agar pantang menyia-nyiakan waktu.', NULL, NULL),
(437, 437, 'Kunci: A. Kalimat \'barang rusak tak selalu menjadi sampah tak berguna, melainkan bisa menjadi pengingat abadi tentang ketabahan meniti kehidupan\' secara lugas menegaskan nilai moral bahwa makna batiniah melampaui bentuk fisik.', NULL, NULL),
(438, 438, 'Kunci: D. Kakek tersenyum teduh, menepuk pundak cucunya dengan hangat, serta menuturkan pelajaran hidup dengan bijak tanpa marah saat barang pribadinya dibuka.', NULL, NULL),
(439, 439, 'Kunci: C. Warga mengabaikan dinginnya air pagi, membawa bahan bangunan bersama-sama, dan kompak bekerja mengejar batas waktu masuk sekolah anak-anak. Hal ini mencerminkan keguyuban dan etos gotong royong.', NULL, NULL),
(440, 440, 'Kunci: B. Keberhasilan membentangkan titian dalam waktu singkat berkat inisiatif Pak Danu dan kerja cepat seluruh warga membuktikan kekuatan gotong royong dalam menyelesaikan kebuntuan darurat.', NULL, NULL),
(441, 441, 'Kunci: C. Hubungan sebab-akibat secara eksplisit dan inferensial dijelaskan pada paragraf kedua dan ketiga: benang terasa ringan karena putus tergores pecahan kaca di atas pagar, sehingga daya kendali hilang dan layang-layang meliuk jatuh ke atap.', NULL, NULL),
(442, 442, '- Pernyataan A benar karena ungkapan tersebut merupakan metafora perasaan bahagia membuncah saat karyanya berhasil terbang tinggi.
- Pernyataan C benar karena majas asosiasi (seperti api yang ditiup) menjelaskan kobaran antusiasme baru setelah dihibur Pak Kades.
- Pernyataan B salah (meliuk-liuk adalah citraan gerak/visual) dan D salah (wajah memerah menahan sedih/kecewa, bukan marah pada Pak Kades).', NULL, NULL),
(443, 443, '- Pernyataan B (Salah): Semangat Arman bangkit murni karena layangan buatannya masih bisa diselamatkan, bukan karena janji materi.
- Pernyataan C (Benar): Tarikan layangan terhadap tangan seketika lenyap begitu benang putus di udara sehingga terasa ringan.', NULL, NULL),
(444, 444, 'Kunci: A. Alasan Bu Tini menolak saran suami tertera pada ucapannya \'Mereka bekerja keras, Pak. Perut lapar tak bisa dibohongi\'. Hal ini menjelaskan empati moral bahwa para buruh pabrik menggantungkan tenaganya pada porsi makanan yang mengenyangkan.', NULL, NULL),
(445, 445, '- Pernyataan B benar karena kata \'aroma\' merangsang indra penciuman pembaca.
- Pernyataan C benar karena teks menyebut \'Pelanggan lama membawa teman-teman baru. Mereka membicarakan kejujuran Bu Tini sepanjang jalan\'.
- Pilihan A dan D tidak sesuai dengan fakta teks.', NULL, NULL),
(446, 446, '- Pernyataan B (Salah): Kening berkerut menjelaskan proses berpikir mendalam dan kebingungan menghadapi dilema biaya produksi, bukan sikap pasrah menyerah.
- Pernyataan C (Benar): Hasil akhir buku lusuh yang penuh catatan pemasukan stabil membuktikan hubungan logis antara integritas dan keberhasilan jangka panjang.', NULL, NULL),
(447, 447, 'Kunci: A. Sinta hampir marah, tetapi menahannya karena teringat wajah letih Farhan di sekolah kemarin dan pengakuan Farhan yang tulus semalaman menjaga adiknya yang demam. Hal ini menjelaskan kepekaan perasaan tokoh.', NULL, NULL),
(448, 448, '- Pernyataan A benar karena alih-alih memarahi, Sinta langsung menyodorkan bambu dan memberi peran jelas (\'Bagianmu membuat atap\').
- Pernyataan D benar karena atap limasan buatan Farhan menjadi bagian paling rapi sehingga mendongkrak penilaian karya kelompok.
- Pilihan B dan C sama sekali tidak berdasar pada isi teks.', NULL, NULL),
(449, 449, '- Pernyataan B (Salah): Menghela napas panjang mencerminkan rasa kecewa sesaat, tetapi Sinta tetap langsung bekerja membuat dasar maket bersama Cahya.
- Pernyataan C (Benar): Meski hanya dikerjakan oleh tiga orang, koordinasi yang rukun menghasilkan karya terbaik di kelas.', NULL, NULL),
(450, 450, 'Kunci: C. Kalimat menggunakan majas personifikasi (\'mengalir\' dan \'menyentuh\'). Ini menjelaskan bagaimana kualitas akustik seruling bambu yang lembut merambat di udara tenang pedesaan hingga dapat dinikmati warga di rumah-rumah mereka.', NULL, NULL),
(451, 451, '- Pernyataan B benar karena bunyi kucing terjepit merupakan perumpamaan bunyi sumbang yang belum terkontrol saat pertama kali belajar seruling.
- Pernyataan C benar karena perumpamaan pelukan lembut menjelaskan respons emosional kakek yang merasa diayomi dan bahagia di tengah sakitnya.
- Pilihan A bertolak belakang, dan D salah karena kakek melatih dengan sabar bukan marah.', NULL, NULL),
(452, 452, '- Pernyataan B (Salah): Enggan pulang ke sarang merupakan hiperbola puitis untuk melukiskan bagaimana alunan seruling begitu memikat pendengarnya.
- Pernyataan C (Benar): Reaksi kakek menunjukkan kedamaian batin mendengar tradisi senja keluarganya tetap hidup melalui Kirana.', NULL, NULL),
(453, 453, 'Kunci: A. Surat tersebut ditulis lima puluh tahun silam oleh suaminya sebelum berlayar dan hilang tanpa kabar. Membaca kembali tulisan tangan orang terkasih setelah 50 tahun membangkitkan luapan rasa haru, rindu, dan kepedihan batin tak terbendung.', NULL, NULL),
(454, 454, '- Pernyataan B benar karena warna menguning dan bentuk fisik rapuh merangsang visual pembaca membayangkan artefak masa lalu.
- Pernyataan D benar karena tenggorokan tercekat adalah reaksi psiko-fisik saat seseorang menahan tangis dan rasa haru empati.
- Pernyataan C salah karena surat tertinggal di gedung kantor pos lama yang baru saja dibongkar, bukan karena kelalaian Pak Joko.', NULL, NULL),
(455, 455, '- Pernyataan B (Salah): Teks menjelaskan Pak Joko hafal semua jalan; ia pulang lambat karena larut dalam perenungan emosional tentang makna kabar dan penantian manusia.
- Pernyataan C (Benar): Pembongkaran gedung lama menjelaskan secara logis mengapa sebuah surat bisa terselip puluhan tahun tanpa terkirim.', NULL, NULL),
(456, 456, 'Kunci: B. Hubungan sebab-akibat diterangkan pada paragraf ketiga: perahu Fajar tersangkut jeratan kantong plastik dan botol bekas di gorong-gorong, lalu desakan arus air menekan dinding kertasnya hingga terlipat dan tenggelam ke dasar lumpur.', NULL, NULL),
(457, 457, 'Kunci: A. Kiasan \'matanya berawan mendung\' merupakan metafora kondisi emosional kesedihan yang mendalam di mana mata berkaca-kaca menahan tangis, sejalan dengan hilangnya senyum Fajar saat menatap perahu buatannya tenggelam.', NULL, NULL),
(458, 458, 'Kunci: C. Kata \'menderu di atas seng atap\' merangsang indra pendengaran (auditori) pembaca untuk mengimajinasikan bunyi dentuman tetesan hujan deras yang menimpa lembaran seng atap rumah.', NULL, NULL),
(459, 459, 'Kunci: B. Raka secara sukarela membantu Pak Johan yang sudah tua mengangkat karung gandum dan gula tanpa meminta bayaran. Hadiah sepotong roti hangat yang baru matang secara logis merupakan bentuk rasa terima kasih dan kasih sayang tulus dari Pak Johan.', NULL, NULL),
(460, 460, 'Kunci: D. Kata \'rasa legit lumer di lidah\' merangsang indra pencecapan (gustatori), sedangkan rasa sensasi \'kehangatan luar biasa\' merangsang indra perabaan/perasa suhu (taktil/termal).', NULL, NULL),
(461, 461, 'Kunci: D. Prediksi didasarkan pada petunjuk teks: Rio dihadang dua bek, Ilham berlari bebas tanpa penjaga, \'kesempatan yang sama datang lagi\' untuk menebus kegagalan masa lalu, dan Rio menatap Ilham sekali lagi sebelum mengayunkan kaki. Semua petunjuk mengarah pada tindakan mengumpan bola ke Ilham.', NULL, NULL),
(462, 462, '- Pernyataan B logis karena Ilham tanpa penjaga dan gawang lawan sudah sangat dekat di sisa waktu 2 menit.
- Pernyataan C logis karena keberhasilan umpan ini mematahkan trauma kegagalan sebulan lalu dan memupuk kembali kerja sama tim.
- Pilihan A dan D tidak masuk akal dalam konteks permainan.', NULL, NULL),
(463, 463, '- Pernyataan B (Salah): Situasi serangan balik cepat di detik-detik akhir memicu terjadinya peluang gol penentu, bukan pasrah imbang.
- Pernyataan C (Benar): Memanfaatkan rekan yang bebas tanpa kawalan merupakan strategi terbaik mencetak angka kemenangan.', NULL, NULL),
(464, 464, 'Kunci: B. Kalimat \'Kini tak seorang pun yang tertawa\' saat menyaksikan Bimo rela menyisihkan air minum demi bibit mangga menjadi petunjuk inferensial kuat bahwa teman-temannya menyadari keteladanan Bimo dan akan berubah sikap menjadi menghargai serta terinspirasi membantu.', NULL, NULL),
(465, 465, '- Pernyataan A logis karena proteksi pagar bambu, pupuk kompos daun, dan siraman air teratur menjaga akar tetap lembap selama kemarau.
- Pernyataan D logis karena tindakan nyata Bimo disaksikan seluruh warga sekolah saat tanaman lain mengering, sehingga menumbuhkan kesadaran kolektif.
- Pernyataan B mustahil secara biologis (mangga baru berbuah tahunan), dan C bertentangan dengan apresiasi moral.', NULL, NULL),
(466, 466, '- Pernyataan B (Salah): Teks sudah menegaskan bahwa tawa ejekan mereka telah terhenti digantikan rasa takjub dan segan.
- Pernyataan C (Benar): Bibit yang tegak dengan daun hijau mengilap menandakan tanaman memiliki fondasi vegetatif kuat untuk tumbuh besar.', NULL, NULL),
(467, 467, 'Kunci: A. Perut Tomi yang lapar berbunyi pelan, ia memandangi kotak bekal lama, dan Nadia menyampaikan tawaran dengan sangat cerdas (\'tolong bantu aku menghabiskannya\'). Cara ini menjaga martabat Tomi sehingga diprediksi ia akan menerima bekal tersebut.', NULL, NULL),
(468, 468, '- Pernyataan B dan D merupakan konsekuensi psikologis yang sangat logis ketika empati yang santun mampu mencairkan sikap tertutup seseorang tanpa melukai rasa percaya dirinya.', NULL, NULL),
(469, 469, '- Pernyataan B (Benar): Keberhasilan rencana ini mendorong Nadia meneruskan kebiasaan baiknya secara wajar.
- Pernyataan C (Benar): Pendekatan \'meminta tolong dibantu makan\' terbukti efektif menghormati harga diri orang yang dibantu.', NULL, NULL),
(470, 470, 'Kunci: A. Salsa sudah menyadari sumber suara adalah rintihan anak kucing (\'bukan hantu\'), Arif sudah melangkah maju dengan senter, dan di luar sedang hujan deras. Tindakan paling masuk akal adalah menolong anak kucing yang terjebak di balik karung.', NULL, NULL),
(471, 471, '- Pernyataan A dan C logis karena bukti riil berupa anak kucing membongkar prasangka tahayul warga bahwa bunyi aneh selama ini berasal dari makhluk halus.', NULL, NULL),
(472, 472, '- Pernyataan B (Salah): Salsa adalah sosok yang paling penasaran dan berani mendekati dinding dan mendorong pintu.
- Pernyataan C (Benar): Fakta di lapangan mengalahkan rumor mistis yang beredar.', NULL, NULL),
(473, 473, 'Kunci: B. Elsa telah berlatih keras selama 3 bulan dan mengingat ibunya adalah mekanisme mencari ketenangan afeksi. Setelah menenangkan diri, ia diprediksi akan mulai memainkan lagunya di aula yang telah hening.', NULL, NULL),
(474, 474, '- Pernyataan A logis karena memori latihan 3 bulan setiap malam akan mengambil alih ketegangan begitu nada awal dimainkan.
- Pernyataan D logis karena penonton yang menunggu dengan hening akan memberikan penghargaan atas persembahan tulus sang penampil.', NULL, NULL),
(475, 475, '- Pernyataan B (Salah): Pengalaman sukses pertama justru akan menjadi pijakan berharga bagi penampilan-penampilan berikutnya.
- Pernyataan C (Benar): Bisikan Bu Guru (\'kamu sudah siap\') dan tatapan ibu menjadi jangkar penguat ketenangan Elsa.', NULL, NULL),
(476, 476, 'Kunci: A. Pandu tak punya waktu mencari sepatu lain dan ucapan Riki sangat tulus menjunjung sportivitas murni (\'kemenangan sejati adalah melawan kemampuan terbaikmu\'). Pandu diprediksi akan memakai sepatu Riki agar tetap dapat berlaga.', NULL, NULL),
(477, 477, 'Kunci: C. Rasa haru yang menjalari dada Pandu serta dorongan moral atas sportivitas Riki akan melipatgandakan motivasinya untuk mengeluarkan segenap daya terbaik di lintasan lari.', NULL, NULL),
(478, 478, 'Kunci: B. Peristiwa pinjam sepatu ini menunjukkan kematangan watak kedua atlet di mana nilai persaudaraan dan sportivitas berada di atas sekadar medali, sehingga persahabatan mereka diprediksi semakin erat.', NULL, NULL),
(479, 479, 'Kunci: B. Hendra mengingat wejangan ayahnya bahwa jangan menantang badai demi ambisi muatan, langit barat kian gelap, dan tangannya sudah mencengkeram tuas kemudi serta menarik tali layar. Hal ini memprediksi tindakannya untuk memutar haluan kembali ke pelabuhan.', NULL, NULL),
(480, 480, 'Kunci: A. Masyarakat nelayan yang berpengalaman sangat memahami bahaya awan kumulonimbus dan badai laut. Keputusan Hendra pulang tepat waktu dengan hasil tangkapan yang sudah ada diprediksi akan dipuji sebagai tindakan bijak dan matang.', NULL, NULL),
(481, 481, 'Raka tidak langsung menyebarkan pesan, tetapi memeriksa pengumuman resmi sekolah. Sikap tersebut relevan dalam kehidupan sehari-hari, terutama ketika menerima informasi melalui media digital. A tidak tepat karena semua pesan belum tentu benar; C menyerahkan verifikasi kepada orang lain; D tidak selalu menyelesaikan masalah.', NULL, NULL),
(482, 482, 'Konflik Teks "Pesan yang Belum Selesai" berpusat pada kebenaran informasi yang beredar melalui grup. Hal ini serupa dengan kehidupan sehari-hari ketika siswa menerima informasi digital. Pilihan lain tidak berkaitan langsung dengan peristiwa utama.', NULL, NULL),
(483, 483, 'A sesuai dengan tindakan Raka yang melakukan verifikasi. C sesuai karena Raka segera mengoreksi informasi yang sebelumnya kurang tepat. B dan D bertentangan dengan sikap kritis Raka.', NULL, NULL),
(484, 484, 'Dalam Teks "Poster Lomba", Mira dan Sinta menyelesaikan pekerjaan dengan pembagian tugas. Cara tersebut dapat diterapkan pada tugas kelompok di sekolah. A, B, dan D tidak mencerminkan kerja sama yang ditunjukkan tokoh.', NULL, NULL),
(485, 485, 'Bukti dalam teks adalah Mira dan Sinta membagi pekerjaan sehingga poster selesai tepat waktu. Nilai yang paling relevan adalah kerja sama.', NULL, NULL),
(486, 486, 'Bukti dalam teks adalah Mira dan Sinta membagi pekerjaan sehingga poster selesai tepat waktu. Nilai yang paling relevan adalah kerja sama.', NULL, NULL),
(487, 487, 'Kedua pilihan tersebut sesuai dengan kerja sama Mira dan Sinta. B dan D bertentangan dengan prinsip pembagian tugas yang dilakukan dalam teks.', NULL, NULL),
(488, 488, 'Danu melakukan kesalahan dalam mengucapkan istilah, kemudian memperbaikinya. Peristiwa tersebut realistis dalam proses belajar.', NULL, NULL),
(489, 489, 'Dalam Teks "Suara dari Belakang Kelas", Danu memperbaiki ucapannya setelah mendapat masukan guru. Peristiwa tersebut menunjukkan pentingnya kesempatan memperbaiki kesalahan.', NULL, NULL),
(490, 490, 'Keduanya sesuai dengan perilaku tokoh. A mencerminkan teman Danu yang meminta maaf; C sesuai dengan Danu yang memperbaiki kesalahannya;', NULL, NULL),
(491, 491, 'Lani mengusulkan pelaporan dan ikut menjaga taman. Hal tersebut menunjukkan tanggung jawab terhadap fasilitas bersama.', NULL, NULL),
(492, 492, 'Tulisan tersebut menekankan tanggung jawab bersama terhadap fasilitas yang digunakan bersama.', NULL, NULL),
(493, 493, 'A dan C sejalan dengan tindakan Lani dan teman-temannya. B dan D bertentangan dengan kepedulian terhadap fasilitas bersama.', NULL, NULL),
(494, 494, 'Bima menemukan dompet milik orang lain dan mengembalikannya melalui guru. Situasi yang sepadan adalah ketika seseorang menemukan barang milik orang lain.', NULL, NULL),
(495, 495, 'Bima menyerahkan dompet kepada guru piket. Situasi tersebut dapat diterapkan pada barang temuan lain.', NULL, NULL),
(496, 496, 'Kedua tindakan tersebut sesuai dengan kejujuran dan tanggung jawab Bima. B dan D bertentangan dengan nilai tersebut.', NULL, NULL),
(497, 497, 'Bima mempertimbangkan bahwa dompet tersebut bukan miliknya sehingga tidak mengambil uang di dalamnya.', NULL, NULL),
(498, 498, 'Dalam Teks "Dompet di Lapangan", pemilik dompet datang dengan wajah lega. Hal ini menunjukkan dampak positif dari kejujuran Bima.', NULL, NULL),
(499, 499, 'Raka memeriksa informasi sebelum menyebarkannya. Jika kebiasaan itu diterapkan, masyarakat akan lebih berhati-hati terhadap informasi.', NULL, NULL),
(500, 500, 'A berasal dari Teks "Pesan yang Belum Selesai", dan B dari Teks "Poster Lomba". C bertentangan dengan Teks "Suara dari Belakang Kelas", sedangkan D bertentangan dengan Teks "Dompet di Lapangan".', NULL, NULL),
(501, 501, 'A dan D, masing-masing sesuai dengan nilai utama Teks "Pesan yang Belum Selesai", dan Teks "Bangku Taman".', NULL, NULL),
(502, 502, 'Kedua teks dimulai dengan penemuan barang lama, kemudian tokoh memperbaikinya dan menggunakannya kembali.', NULL, NULL),
(503, 503, 'Kedua teks dimulai dengan penemuan barang lama, kemudian tokoh memperbaikinya dan menggunakannya kembali.', NULL, NULL),
(504, 504, 'A benar berdasarkan tindakan Nara mengganti rantai. C benar karena Reno dibantu ayahnya dan konteks Nara juga menunjukkan proses perbaikan. D benar karena kedua barang masih dapat digunakan. B tidak didukung teks.', NULL, NULL),
(505, 505, 'Sari membersihkan saluran yang tersumbat daun, sedangkan Dimas membersihkan selokan yang dipenuhi daun.', NULL, NULL),
(506, 506, 'Teks I menyebut “sejak sore”, sedangkan Teks II menyebut “sejak pagi”.', NULL, NULL),
(507, 507, 'Kedua teks menunjukkan kondisi cuaca, daun yang menyumbat saluran, dan tindakan tokoh membersihkannya. C tidak sesuai isi.', NULL, NULL),
(508, 508, 'Rani menghadapi warna lukisan yang bercampur, sedangkan Fajar lupa memasukkan tokoh dalam cerita. Keduanya mengalami masalah dalam karya yang sedang dibuat.', NULL, NULL),
(509, 509, 'Rani menemukan efek warna yang menarik, sedangkan Fajar menemukan cara memasukkan tokoh tanpa mengubah alur.', NULL, NULL),
(510, 510, 'C terlihat ketika kedua tokoh melihat kembali hasil pekerjaan. D benar karena keduanya menemukan solusi. B dan E bertentangan dengan teks.', NULL, NULL),
(511, 511, 'Dara memilih jalan lain ketika jembatan rusak. Bayu tetap melewati jalan tersebut dengan lebih lambat dan menggunakan pegangan.', NULL, NULL),
(512, 512, 'Jembatan rusak dalam Teks I dan jalan licin dalam Teks II sama-sama mengandung risiko.', NULL, NULL),
(513, 513, 'Dara memilih jalan alternatif, sedangkan Bayu memperlambat langkah dan menggunakan pegangan. Keduanya mempertimbangkan kondisi lingkungan dan keselamatan.', NULL, NULL),
(514, 514, 'Kata “rindu” dan “berat” pada Teks I menunjukkan suasana haru/rindu. Teks II menggunakan “tersenyum”, “ringan”, dan “harapan” yang menunjukkan suasana positif.', NULL, NULL),
(515, 515, 'Konteks “rindu ternyata tidak mudah ditulis” menunjukkan bahwa “berat” bersifat kiasan dan berkaitan dengan beban emosional.', NULL, NULL),
(516, 516, '“Rindu” dan “berat” mendukung A dan D. “Harapan” dan “tersenyum” mendukung B. C tidak sesuai.', NULL, NULL),
(517, 517, 'Kedua puisi menggunakan kata “aku” sebagai pihak yang mengalami atau menyampaikan perasaan.', NULL, NULL),
(518, 518, 'Teks I menyebut Nara membersihkan dan mengganti rantai sepeda. Teks II secara eksplisit menyebut Reno dibantu ayahnya.', NULL, NULL),
(519, 519, 'P2 berfokus pada saluran air dan kepedulian lingkungan. P4 berfokus pada keselamatan saat menghadapi jalan/jembatan bermasalah.', NULL, NULL),
(520, 520, 'Dalam P3, tokoh mengolah kesalahan dalam karya menjadi solusi. Dalam P4, tokoh menyesuaikan tindakan demi keselamatan.', NULL, NULL),
(521, 521, 'A didukung oleh keputusan para tokoh. C terlihat jelas pada P1 dan P3.', NULL, NULL),
(522, 522, 'Arga merasa kehilangan Rian, tetapi menemukan pesan yang menunjukkan bahwa persahabatan mereka tetap berlanjut. Situasi tersebut menimbulkan rasa haru.', NULL, NULL),
(523, 523, 'Arga memandangi "Kursi Kosong", menunjukkan kesedihan. Senyum kecil dan pesan Rian menunjukkan adanya harapan untuk bertemu kembali.', NULL, NULL),
(524, 524, '"Kursi Kosong" dan kepergian Rian mendukung rasa kehilangan. Pesan Rian dapat menimbulkan keharuan dan rasa hangat terhadap persahabatan. C dan E tidak didukung teks.', NULL, NULL),
(525, 525, 'Pesan tersebut menjadi penutup emosional yang memberikan harapan setelah perpisahan.', NULL, NULL),
(526, 526, 'Sinta membawa lampu dan menemani nenek sampai listrik menyala. Tindakan tersebut wajar menimbulkan rasa kagum atau hangat.', NULL, NULL),
(527, 527, 'Pernyataan nenek menunjukkan bahwa kehadiran Sinta membuatnya merasa lebih nyaman.', NULL, NULL),
(528, 528, 'Ketiga respons tersebut sesuai dengan hubungan Sinta dan nenek. Listrik padam hanya menjadi latar konflik sehingga C dan E tidak menjadi respons utama terhadap unsur emosional teks.', NULL, NULL),
(529, 529, 'Anak membuka sangkar dan membiarkan burung memilih. Kepergian burung menunjukkan kebebasan sehingga rasa lega merupakan respons yang didukung teks.', NULL, NULL),
(530, 530, 'Burung berdiri di ambang pintu seolah ragu. Hal itu dapat membuat pembaca penasaran dan ingin memahami pilihannya', NULL, NULL),
(531, 531, 'Anak membebaskan burung dan tidak mengejarnya. Hal tersebut mendukung rasa lega, tersentuh, dan kagum terhadap kebebasan.', NULL, NULL),
(532, 532, 'Diksi “cahaya”, “bening”, “udara yang baru”, dan “kesempatan untuk memulai lagi” membangun suasana tenang dan penuh harapan.', NULL, NULL),
(533, 533, 'Ungkapan “kesempatan untuk memulai lagi” menunjukkan harapan dan optimisme.', NULL, NULL),
(534, 534, '“cahaya”, dan “kesempatan” mendukung suasana positif. “Pergi” sendiri merujuk pada hujan yang telah berlalu, sedangkan “perlahan” lebih menunjukkan cara tindakan dilakukan.', NULL, NULL),
(535, 535, 'Hujan telah berakhir, kemudian muncul cahaya, udara baru, dan kesempatan memulai kembali. Perubahan tersebut paling tepat dibaca sebagai peralihan menuju rasa lega.', NULL, NULL),
(536, 536, 'Naya tidak terburu-buru memilih pihak. Ia membaca pesan dan mempertemukan kedua teman sehingga masalah dapat diselesaikan.', NULL, NULL),
(537, 537, 'Konflik berakhir setelah kedua tokoh mengetahui maksud sebenarnya. Penyelesaian tersebut mendukung rasa puas atau lega.', NULL, NULL),
(538, 538, 'Naya membaca pesan, menyadari adanya kemungkinan tafsir berbeda, lalu mengajak kedua pihak berbicara. Hal ini mendukung A, dan C.', NULL, NULL),
(539, 539, 'Kesadaran kedua teman bahwa konflik tidak perlu terjadi menjadi penyelesaian yang memberikan rasa lega.', NULL, NULL),
(540, 540, 'Teks "Kursi Kosong" berpusat pada perpisahan Arga dan Rian sehingga menimbulkan keharuan. Teks "Pilihan Naya" berakhir dengan penyelesaian konflik sehingga menimbulkan kelegaan. Keduanya juga menampilkan nilai hubungan antarmanusia.', NULL, NULL),
(541, 541, 'Teks "Kursi Kosong" menghadirkan haru dan harapan, Teks "Lampu di Rumah Nenek" kepedulian dan kehangatan, Teks "Burung dalam Sangkar" kebebasan, Teks Puisi “Pagi Setelah Hujan” harapan, dan Teks "Pilihan Naya" kelegaan setelah konflik terselesaikan. Jadi A paling mencakup keseluruhan bukti teks.', NULL, NULL)
ON DUPLICATE KEY UPDATE 
    `question_id` = VALUES(`question_id`), 
    `explanation_text` = VALUES(`explanation_text`), 
    `reasoning_guide` = VALUES(`reasoning_guide`), 
    `reference_url` = VALUES(`reference_url`);

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- SELESAI: Pembenihan Bank Soal Latihan Bahasa Indonesia (361 Soal, 1424 Opsi) berhasil.
-- =============================================================================

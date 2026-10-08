import { GrammarItem } from '../types';

export const GRAMMAR_DATA: GrammarItem[] = [
  // N5
  // =========================================================================
  // JLPT N5 GRAMMAR
  // =========================================================================
  {
    id: 'g-n5-1',
    title: '〜は〜です (~ wa ~ desu)',
    level: 'N5',
    structure: '[Subjek] は [Kata Benda / Sifat] です',
    meaningId: '[Subjek] adalah [Predikat]',
    explanationId: 'Partikel は (dibaca "wa") menandai topik kalimat, dan です berfungsi sebagai kopula penegas sopan (to be). Bentuk negatifnya adalah 〜ではありません (dewa arimasen) atau 〜じゃありません (ja arimasen).',
    examples: [
      { jp: '私は学生です。', romaji: 'Watashi wa gakusei desu.', id: 'Saya adalah seorang murid/mahasiswa.' },
      { jp: '田中さんは日本人ではありません。', romaji: 'Tanaka-san wa nihonjin dewa arimasen.', id: 'Tuan Tanaka bukan orang Jepang.' },
    ],
  },
  {
    id: 'g-n5-2',
    title: '〜か (Partikel Tanya ~ ka)',
    level: 'N5',
    structure: 'Kalimat + か',
    meaningId: 'Apakah ... ?',
    explanationId: 'Diletakkan di akhir kalimat untuk mengubah kalimat menjadi pertanyaan tanpa perlu tanda tanya.',
    examples: [
      { jp: 'あなたは日本人ですか。', romaji: 'Anata wa nihonjin desu ka.', id: 'Apakah Anda orang Jepang?' },
      { jp: 'これは本ですか。', romaji: 'Kore wa hon desu ka.', id: 'Apakah ini buku?' },
    ],
  },
  {
    id: 'g-n5-3',
    title: '〜の (Partikel Kepemilikan & Keterangan ~ no)',
    level: 'N5',
    structure: 'Kata Benda 1 + の + Kata Benda 2',
    meaningId: 'Milik / Bagian dari / Menjelaskan',
    explanationId: 'Menghubungkan dua kata benda. Kata benda pertama menerangkan atau memiliki kata benda kedua.',
    examples: [
      { jp: 'これは私の本です。', romaji: 'Kore wa watashi no hon desu.', id: 'Ini adalah buku milik saya.' },
      { jp: '日本語の先生に会いました。', romaji: 'Nihongo no sensei ni aimashita.', id: 'Saya bertemu dengan guru bahasa Jepang.' },
    ],
  },
  {
    id: 'g-n5-4',
    title: '〜を (Partikel Objek Langsung ~ o)',
    level: 'N5',
    structure: 'Kata Benda (Objek) + を + Kata Kerja Transitif',
    meaningId: 'Menandai sasaran objek penderita kata kerja',
    explanationId: 'Huruf を (dibaca "o") hanya digunakan sebagai partikel tatabahasa untuk menandai objek yang dikenai perbuatan/tindakan langsung.',
    examples: [
      { jp: 'ご飯を食べます。', romaji: 'Gohan o tabemasu.', id: 'Makan nasi.' },
      { jp: '水を飲みます。', romaji: 'Mizu o nomimasu.', id: 'Minum air.' },
    ],
  },
  {
    id: 'g-n5-5',
    title: '〜に / 〜へ (Partikel Tujuan Gerak ~ ni / ~ e)',
    level: 'N5',
    structure: 'Tempat Tujuan + に / へ + 行きます / 来ます / 帰ります',
    meaningId: 'Ke / Menuju (tempat)',
    explanationId: 'Menandai tempat arah tujuan perjalanan. へ (dibaca "e") fokus pada arah tujuan gerak, sedangkan に fokus pada titik tujuan akhir.',
    examples: [
      { jp: '明日、東京へ行きます。', romaji: 'Ashita, Toukyou e ikimasu.', id: 'Besok, saya pergi ke Tokyo.' },
      { jp: '家に帰ります。', romaji: 'Ie ni kaerimasu.', id: 'Pulang ke rumah.' },
    ],
  },
  {
    id: 'g-n5-6',
    title: '〜に (Partikel Waktu Spesifik ~ ni)',
    level: 'N5',
    structure: 'Waktu Bersurat Angka (Jam, Tanggal, Hari) + に + Kata Kerja',
    meaningId: 'Pada (jam/waktu tertentu)',
    explanationId: 'Dipakai di belakang kata waktu yang spesifik ada angkanya (seperti jam 7, hari Senin). Tidak dipakai pada kata waktu relatif seperti ashita (besok) atau kyou (hari ini).',
    examples: [
      { jp: '毎朝、七時に起きます。', romaji: 'Maiasa, shichi-ji ni okimasu.', id: 'Setiap pagi, saya bangun pada jam 7.' },
      { jp: '日曜日に買い物します。', romaji: 'Nichiyoubi ni kaimono shimasu.', id: 'Pada hari Minggu saya berbelanja.' },
    ],
  },
  {
    id: 'g-n5-7',
    title: '〜で (Partikel Tempat Aktivitas & Sarana ~ de)',
    level: 'N5',
    structure: 'Tempat / Alat / Bahasa + で + Kata Kerja',
    meaningId: 'Di (tempat aktivitas) / Dengan / Naik (alat/transportasi)',
    explanationId: 'Menunjukkan tempat terjadinya suatu aktivitas (berbeda dengan に yang menunjukkan keberadaan), atau alat/sarana/bahasa yang dipakai.',
    examples: [
      { jp: '図書館で勉強します。', romaji: 'Toshokan de benkyou shimasu.', id: 'Belajar di perpustakaan.' },
      { jp: '電車で会社へ行きます。', romaji: 'Densha de kaisha e ikimasu.', id: 'Pergi ke kantor dengan/naik kereta.' },
    ],
  },
  {
    id: 'g-n5-8',
    title: '〜も (Partikel Juga / Pun ~ mo)',
    level: 'N5',
    structure: 'Kata Benda + も',
    meaningId: 'Juga / Pun',
    explanationId: 'Menggantikan partikel は (wa), が (ga), atau を (o) untuk menyatakan kesamaan perlakuan atau sifat.',
    examples: [
      { jp: '私も学生です。', romaji: 'Watashi mo gakusei desu.', id: 'Saya juga seorang mahasiswa/pelajar.' },
      { jp: 'これも美味しいです。', romaji: 'Kore mo oishii desu.', id: 'Ini juga enak.' },
    ],
  },
  {
    id: 'g-n5-9',
    title: '〜と (Partikel Dan / Bersama ~ to)',
    level: 'N5',
    structure: 'Kata Benda + と + Kata Benda / Orang + と + Kata Kerja',
    meaningId: 'Dan (menghubungkan benda) / Bersama (orang)',
    explanationId: 'Menghubungkan kata benda secara tuntas (lengkap), atau menunjukkan rekan/mitra yang menyertai aktivitas.',
    examples: [
      { jp: '机の上にペンとノートがあります。', romaji: 'Tsukue no ue ni pen to nooto ga arimasu.', id: 'Di atas meja ada pulpen dan buku catatan.' },
      { jp: '友達と映画を見ました。', romaji: 'Tomodachi to eiga o mimashita.', id: 'Saya menonton film bersama teman.' },
    ],
  },
  {
    id: 'g-n5-10',
    title: '〜から 〜まで (~ kara ~ made)',
    level: 'N5',
    structure: 'Waktu/Tempat 1 + から + Waktu/Tempat 2 + まで',
    meaningId: 'Dari ... sampai ...',
    explanationId: 'Menyatakan rentang awal dan akhir, baik berupa waktu (jam/hari) maupun jarak geografis.',
    examples: [
      { jp: '九時から五時まで働きます。', romaji: 'Ku-ji kara go-ji made hatarakimasu.', id: 'Bekerja dari jam 9 sampai jam 5.' },
      { jp: '東京から京都まで新幹線で行きます。', romaji: 'Toukyou kara Kyouto made shinkansen de ikimasu.', id: 'Dari Tokyo sampai Kyoto naik kereta Shinkansen.' },
    ],
  },
  {
    id: 'g-n5-11',
    title: '〜があります / います (Keberadaan ~ ga arimasu / imasu)',
    level: 'N5',
    structure: '[Tempat] に [Benda/Makhluk] が あります/います',
    meaningId: 'Ada (benda mati/tumbuhan vs makhluk hidup)',
    explanationId: 'あります (arimasu) digunakan untuk benda mati atau hal tak bergerak, sedangkan います (imasu) khusus untuk manusia dan hewan.',
    examples: [
      { jp: '部屋にテレビがあります。', romaji: 'Heya ni terebi ga arimasu.', id: 'Di kamar ada televisi.' },
      { jp: '庭に猫がいます。', romaji: 'Niwa ni neko ga imasu.', id: 'Di halaman ada kucing.' },
    ],
  },
  {
    id: 'g-n5-12',
    title: '〜が好きです / 嫌いです (~ ga suki desu / kirai desu)',
    level: 'N5',
    structure: 'Kata Benda + が + 好きです / 嫌いです',
    meaningId: 'Suka / Benci / Tidak suka terhadap ...',
    explanationId: 'Dalam bahasa Jepang, kata "suka" (suki) dan "benci" (kirai) berstatus Kata Sifat-Na, sehingga objek kesukaannya ditandai partikel が (ga), bukan を (o).',
    examples: [
      { jp: '私は日本料理が好きです。', romaji: 'Watashi wa nihon ryouri ga suki desu.', id: 'Saya suka masakan Jepang.' },
      { jp: '辛い食べ物が嫌いです。', romaji: 'Karai tabemono ga kirai desu.', id: 'Saya tidak suka/benci makanan pedas.' },
    ],
  },
  {
    id: 'g-n5-13',
    title: '〜たいです (~ tai desu)',
    level: 'N5',
    structure: 'Kata Kerja (Bentuk Masu tanpa masu) + たいです',
    meaningId: 'Ingin / Mau melakukan (keinginan pembicara)',
    explanationId: 'Menyatakan keinginan diri sendiri (orang pertama) untuk melakukan suatu tindakan. Bentuk negatifnya: 〜たくないです (~ taku nai desu).',
    examples: [
      { jp: '日本へ行きたいです。', romaji: 'Nihon e ikitai desu.', id: 'Saya ingin pergi ke Jepang.' },
      { jp: '今日は何も食べたくないです。', romaji: 'Kyou wa nani mo tabetaku nai desu.', id: 'Hari ini saya tidak ingin makan apa-apa.' },
    ],
  },
  {
    id: 'g-n5-14',
    title: '〜てください (~ te kudasai)',
    level: 'N5',
    structure: 'Kata Kerja Bentuk-て + ください',
    meaningId: 'Tolong / Silakan ...',
    explanationId: 'Pola kalimat untuk meminta bantuan atau memberi instruksi sopan.',
    examples: [
      { jp: '日本語で話してください。', romaji: 'Nihongo de hanashite kudasai.', id: 'Tolong berbicara dalam bahasa Jepang.' },
      { jp: 'ここに座ってください。', romaji: 'Koko ni suwatte kudasai.', id: 'Silakan duduk di sini.' },
    ],
  },
  {
    id: 'g-n5-15',
    title: '〜ています (~ te imasu)',
    level: 'N5',
    structure: 'Kata Kerja Bentuk-て + います',
    meaningId: 'Sedang melakukan / Kondisi yang berlanjut',
    explanationId: 'Dapat bermakna perbuatan yang sedang berlangsung saat ini (present continuous), atau status/kondisi yang bertahan (seperti sudah menikah, tinggal di kota X, dll).',
    examples: [
      { jp: '今、日本語を勉強しています。', romaji: 'Ima, nihongo o benkyou shite imasu.', id: 'Sekarang saya sedang belajar bahasa Jepang.' },
      { jp: '東京に住んでいます。', romaji: 'Toukyou ni sunde imasu.', id: 'Saya tinggal di Tokyo.' },
    ],
  },
  {
    id: 'g-n5-16',
    title: '〜てもいいですか (~ te mo ii desu ka)',
    level: 'N5',
    structure: 'Kata Kerja Bentuk-て + もいいですか',
    meaningId: 'Bolehkah saya ...? (Meminta izin)',
    explanationId: 'Digunakan saat meminta izin kepada lawan bicara untuk melakukan sesuatu.',
    examples: [
      { jp: '写真を撮ってもいいですか。', romaji: 'Shashin o totte mo ii desu ka.', id: 'Bolehkah saya mengambil foto?' },
      { jp: 'ここでタバコを吸ってもいいですか。', romaji: 'Koko de tabako o sutte mo ii desu ka.', id: 'Bolehkah merokok di sini?' },
    ],
  },
  {
    id: 'g-n5-17',
    title: '〜てはいけません (~ te wa ikemasen)',
    level: 'N5',
    structure: 'Kata Kerja Bentuk-て + はいけません',
    meaningId: 'Tidak boleh / Dilarang ...',
    explanationId: 'Digunakan untuk menyatakan larangan tegas atau peraturan resmi.',
    examples: [
      { jp: 'ここで写真を撮ってはいけません。', romaji: 'Koko de shashin o totte wa ikemasen.', id: 'Tidak boleh mengambil foto di sini.' },
      { jp: 'テスト中に話してはいけません。', romaji: 'Tesuto-chuu ni hanashite wa ikemasen.', id: 'Tidak boleh berbicara saat ujian berlangsung.' },
    ],
  },
  {
    id: 'g-n5-18',
    title: '〜ないでください (~ naide kudasai)',
    level: 'N5',
    structure: 'Kata Kerja Bentuk-ない + でください',
    meaningId: 'Tolong jangan ...',
    explanationId: 'Permintaan sopan agar lawan bicara tidak melakukan suatu tindakan.',
    examples: [
      { jp: '心配しないでください。', romaji: 'Shinpai shinaide kudasai.', id: 'Tolong jangan khawatir.' },
      { jp: '名前を忘れないでください。', romaji: 'Namae o wasurenaide kudasai.', id: 'Tolong jangan lupa namanya.' },
    ],
  },
  {
    id: 'g-n5-19',
    title: '〜まえに / 〜あとで (~ mae ni / ~ ato de)',
    level: 'N5',
    structure: 'Kata Kerja Kamus + まえに / Kata Kerja Bentuk-た + あとで',
    meaningId: 'Sebelum ... / Sesudah ...',
    explanationId: 'Menunjukkan urutan dua aktivitas yang saling berurutan.',
    examples: [
      { jp: '寝る前に、本を読みます。', romaji: 'Neru mae ni, hon o yomimasu.', id: 'Sebelum tidur, saya membaca buku.' },
      { jp: 'ご飯を食べたあとで、薬を飲みます。', romaji: 'Gohan o tabeta ato de, kusuri o nomimasu.', id: 'Sesudah makan nasi, saya meminum obat.' },
    ],
  },
  {
    id: 'g-n5-20',
    title: '〜から (Alasan / Sebab ~ kara)',
    level: 'N5',
    structure: 'Kalimat Alasan + から、+ Kalimat Akibat',
    meaningId: 'Karena / Sebab ...',
    explanationId: 'Menyatakan alasan atau sebab terjadinya sesuatu dalam kalimat majemuk.',
    examples: [
      { jp: '時間がありませんから、タクシーで行きましょう。', romaji: 'Jikan ga arimasen kara, takushii de ikimashou.', id: 'Karena tidak ada waktu, mari pergi naik taksi.' },
      { jp: '暑いですから、窓を開けてください。', romaji: 'Atsui desu kara, mado o akete kudasai.', id: 'Karena panas, tolong buka jendelanya.' },
    ],
  },

  // N4
  {
    id: 'g-n4-1',
    title: '〜たら (~ tara)',
    level: 'N4',
    structure: 'Bentuk Lampau (た-form) + ら',
    meaningId: 'Kalau / Jika / Setelah ...',
    explanationId: 'Pola pengandaian kondisi atau urutan kejadian yang pasti terjadi di masa depan.',
    examples: [
      { jp: '日本に着いたら、電話します。', romaji: 'Nihon ni tsuitara, denwa shimasu.', id: 'Setelah tiba di Jepang, saya akan menelepon.' },
      { jp: '雨が降ったら、行きません。', romaji: 'Ame ga futtara, ikimasen.', id: 'Kalau hujan turun, saya tidak pergi.' },
    ],
  },

  // N3
  {
    id: 'g-n3-1',
    title: '〜わけにはいかない (~ wake ni wa ikanai)',
    level: 'N3',
    structure: 'Kata Kerja (Bentuk Kamus / Nai) + わけにはいかない',
    meaningId: 'Tidak mungkin / Tidak bisa dilakukan (karena alasan moral, sosial, atau etika)',
    explanationId: 'Menyatakan bahwa pembicara tidak bisa melakukan sesuatu bukan karena ketidakmampuan fisik, melainkan karena norma sosial atau pertimbangan moral.',
    examples: [
      { jp: '大事な会議があるので、休むわけにはいかない。', romaji: 'Daiji na kaigi ga aru node, yasumu wake ni wa ikanai.', id: 'Karena ada rapat penting, saya tidak mungkin bolos/libur.' },
    ],
  },

  // N2
  {
    id: 'g-n2-1',
    title: '〜に際して (~ ni saishite)',
    level: 'N2',
    structure: 'Kata Benda / Kata Kerja Kamus + に際して',
    meaningId: 'Dalam rangka / Menjelang / Saat dimulainya...',
    explanationId: 'Digunakan dalam situasi formal saat memulai acara khusus atau peristiwa penting.',
    examples: [
      { jp: '新年度を迎えるに際して、一言ご挨拶申し上げます。', romaji: 'Shinnendo o mukaeru ni saishite, hitokoto go-aisatsu moushiagemasu.', id: 'Menjelang tahun ajaran baru, izinkan saya menyampaikan sepatah kata.' },
    ],
  },

  // N1
  {
    id: 'g-n1-1',
    title: '〜を皮切りに（して） (~ o kawakiri ni shite)',
    level: 'N1',
    structure: 'Kata Benda + を皮切りに / を皮切りにして',
    meaningId: 'Diawali dengan... lalu berturut-turut diikuti aksi serupa',
    explanationId: 'Menunjukkan bahwa suatu peristiwa awal memicu serangkaian peristiwa serupa yang berkembang luas.',
    examples: [
      { jp: '東京公演を皮切りに、全国ツアーがスタートした。', romaji: 'Toukyou kouen o kawakiri ni, zenkoku tsuaa ga sutaato shita.', id: 'Diawali dengan penampilan di Tokyo, tur keliling seluruh negeri pun dimulai.' },
    ],
  },
];

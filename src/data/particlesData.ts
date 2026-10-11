import { ParticleQuestion } from '../types';

export const PARTICLE_QUESTIONS: ParticleQuestion[] = [
  {
    "id": "pq-01",
    "level": "N5",
    "sentenceWithBlank": "わたし___ たなかです。はじめまして。",
    "sentenceComplete": "わたしは たなかです。はじめまして。",
    "translationId": "Saya adalah Tanaka. Senang berkenalan dengan Anda.",
    "correctParticle": "は",
    "options": [
      "は",
      "が",
      "を",
      "に"
    ],
    "explanation": "Partikel [は] (dibaca \"wa\") berfungsi sebagai penanda TOPIK utama kalimat (\"Mengenai saya...\"). Bukan partikel [が] karena kita sedang memperkenalkan topik baru dalam percakapan.",
    "audioText": "わたしは たなかです。はじめまして。"
  },
  {
    "id": "pq-02",
    "level": "N5",
    "sentenceWithBlank": "だれ___ きましたか。",
    "sentenceComplete": "だれが きましたか。",
    "translationId": "Siapa yang datang?",
    "correctParticle": "が",
    "options": [
      "が",
      "は",
      "を",
      "で"
    ],
    "explanation": "Kaidah Emas N5: Kata tanya (だれ, なに, どこ, いつ) yang berposisi sebagai subjek TIDAK BISA diikuti partikel [は], melainkan WAJIB menggunakan partikel [が] untuk menegaskan fokus informasi baru.",
    "audioText": "だれが きましたか。"
  },
  {
    "id": "pq-03",
    "level": "N5",
    "sentenceWithBlank": "わたしは すし___ すきです。",
    "sentenceComplete": "わたしは すしが すきです。",
    "translationId": "Saya suka sushi.",
    "correctParticle": "が",
    "options": [
      "が",
      "を",
      "に",
      "で"
    ],
    "explanation": "Kata sifat kesukaan / potensi (すき, きらい, じょうず, へた, ほしい) menandai target/objeknya dengan partikel [が], bukan [を].",
    "audioText": "わたしは すしが すきです。"
  },
  {
    "id": "pq-04",
    "level": "N5",
    "sentenceWithBlank": "あさごはん___ たべました。",
    "sentenceComplete": "あさごはんを たべました。",
    "translationId": "Saya sudah sarapan (makan pagi).",
    "correctParticle": "を",
    "options": [
      "を",
      "は",
      "が",
      "に"
    ],
    "explanation": "Partikel [を] (dibaca \"o\") adalah penanda OBJEK LANGSUNG dari kata kerja transitif (sarapan adalah objek tindakan dari kata kerja makan/たべました).",
    "audioText": "あさごはんを たべました。"
  },
  {
    "id": "pq-05",
    "level": "N5",
    "sentenceWithBlank": "まいあさ ７じ___ おきます。",
    "sentenceComplete": "まいあさ ７じに おきます。",
    "translationId": "Setiap pagi saya bangun jam 7.",
    "correctParticle": "に",
    "options": [
      "に",
      "で",
      "を",
      "へ"
    ],
    "explanation": "Waktu yang memiliki angka spesifik (jam 7, hari Senin, tanggal 5) ditandai dengan partikel titik waktu [に]. Waktu relatif (seperti まいにち, きょう) tidak menggunakan partikel.",
    "audioText": "まいあさ ７じに おきます。"
  },
  {
    "id": "pq-06",
    "level": "N5",
    "sentenceWithBlank": "としょかん___ ほんを よみます。",
    "sentenceComplete": "としょかんで ほんを よみます。",
    "translationId": "Saya membaca buku di perpustakaan.",
    "correctParticle": "で",
    "options": [
      "で",
      "に",
      "へ",
      "を"
    ],
    "explanation": "Perbedaan krusial に vs で: Partikel [で] digunakan untuk tempat terjadinya AKSI/AKTIVITAS dinamis (membaca, makan, belajar). Sedangkan [に] untuk keberadaan benda statis (berada/tinggal).",
    "audioText": "としょかんで ほんを よみます。"
  },
  {
    "id": "pq-07",
    "level": "N5",
    "sentenceWithBlank": "へやに ねこ___ います。",
    "sentenceComplete": "へやに ねこが います。",
    "translationId": "Ada kucing di dalam kamar.",
    "correctParticle": "が",
    "options": [
      "が",
      "を",
      "は",
      "で"
    ],
    "explanation": "Pola keberadaan [Subjek が います/あります]: Subjek yang \"ada\" ditandai dengan [が]. Karena kucing adalah makhluk hidup bernyawa, kata kerjanya adalah [います].",
    "audioText": "へやに ねこが います。"
  },
  {
    "id": "pq-08",
    "level": "N5",
    "sentenceWithBlank": "つくえの うえ___ ほんが あります。",
    "sentenceComplete": "つくえの うえに ほんが あります。",
    "translationId": "Ada buku di atas meja.",
    "correctParticle": "に",
    "options": [
      "に",
      "で",
      "を",
      "と"
    ],
    "explanation": "Partikel [に] digunakan untuk menandai TEMPAT KEBERADAAN benda berpasangan dengan kata kerja statis [あります / います].",
    "audioText": "つくえの うえに ほんが あります。"
  },
  {
    "id": "pq-09",
    "level": "N5",
    "sentenceWithBlank": "らいしゅう にほん___ いきます。",
    "sentenceComplete": "らいしゅう にほんへ いきます。",
    "translationId": "Minggu depan saya pergi ke Jepang.",
    "correctParticle": "へ",
    "options": [
      "へ",
      "で",
      "を",
      "から"
    ],
    "explanation": "Partikel [へ] (dibaca \"e\") menunjukkan ARAH PERJALANAN / TITIK TUJUAN fisik dari kata kerja perpindahan (いきます, きます, かえります).",
    "audioText": "らいしゅう にほんへ いきます。"
  },
  {
    "id": "pq-10",
    "level": "N5",
    "sentenceWithBlank": "バス___ えきまで いきました。",
    "sentenceComplete": "バスで えきまで いきました。",
    "translationId": "Saya pergi sampai stasiun naik bus.",
    "correctParticle": "で",
    "options": [
      "で",
      "に",
      "を",
      "と"
    ],
    "explanation": "Partikel [で] digunakan untuk menandai SARANA/ALAT TRANSPORTASI (\"dengan/naik bus\", \"dengan kereta\", \"dengan taksi\").",
    "audioText": "バスで えきまで いきました。"
  },
  {
    "id": "pq-11",
    "level": "N5",
    "sentenceWithBlank": "きのう ともだち___ えいがを みました。",
    "sentenceComplete": "きのう ともだちと えいがを みました。",
    "translationId": "Kemarin saya menonton film bersama teman.",
    "correctParticle": "と",
    "options": [
      "と",
      "に",
      "で",
      "を"
    ],
    "explanation": "Partikel [と] berfungsi sebagai \"bersama dengan\" saat melakukan suatu aktivitas berpasangan dengan orang lain ([Orang] + と).",
    "audioText": "きのう ともだちと えいがを みました。"
  },
  {
    "id": "pq-12",
    "level": "N5",
    "sentenceWithBlank": "りんご___ みかんを かいました。",
    "sentenceComplete": "りんごと みかんを かいました。",
    "translationId": "Saya membeli apel dan jeruk.",
    "correctParticle": "と",
    "options": [
      "と",
      "や",
      "も",
      "に"
    ],
    "explanation": "Partikel [と] menggabungkan kata benda secara DEFINITIF LENGKAP (hanya apel dan jeruk, tidak ada benda lain). Bandingkan dengan [や] yang menyiratkan masih ada barang lain.",
    "audioText": "りんごと みかんを かいました。"
  },
  {
    "id": "pq-13",
    "level": "N5",
    "sentenceWithBlank": "かいぎは ９じ___ ５じまでです。",
    "sentenceComplete": "かいぎは ９じから ５じまでです。",
    "translationId": "Rapatnya dari jam 9 sampai jam 5.",
    "correctParticle": "から",
    "options": [
      "から",
      "まで",
      "に",
      "で"
    ],
    "explanation": "Pasangan [から〜まで] menandai TITIK AWAL [から] (dari) dan TITIK AKHIR [まで] (sampai/hingga), baik untuk waktu maupun tempat.",
    "audioText": "かいぎは ９じから ５じまでです。"
  },
  {
    "id": "pq-14",
    "level": "N5",
    "sentenceWithBlank": "たなかさんは がくせいです。わたし___ がくせいです。",
    "sentenceComplete": "たなかさんは がくせいです。わたしも がくせいです。",
    "translationId": "Tanaka adalah mahasiswa. Saya juga mahasiswa.",
    "correctParticle": "も",
    "options": [
      "も",
      "は",
      "が",
      "と"
    ],
    "explanation": "Partikel [も] menggantikan partikel [は] atau [が] untuk menyatakan kesamaan predikat (\"juga / pun\").",
    "audioText": "たなかさんは がくせいです。わたしも がくせいです。"
  },
  {
    "id": "pq-15",
    "level": "N5",
    "sentenceWithBlank": "これは にほんご___ じしょです。",
    "sentenceComplete": "これは にほんごの じしょです。",
    "translationId": "Ini adalah kamus bahasa Jepang.",
    "correctParticle": "の",
    "options": [
      "の",
      "は",
      "で",
      "に"
    ],
    "explanation": "Partikel [の] menghubungkan kata benda 1 yang memodifikasi/menerangkan jenis kata benda 2 (kamus mengenai bahasa Jepang).",
    "audioText": "これは にほんごの じしょです。"
  },
  {
    "id": "pq-16",
    "level": "N5",
    "sentenceWithBlank": "はし___ ごはんを たべます。",
    "sentenceComplete": "はしで ごはんを たべます。",
    "translationId": "Makan nasi dengan/menggunakan sumpit.",
    "correctParticle": "で",
    "options": [
      "で",
      "を",
      "に",
      "と"
    ],
    "explanation": "Partikel [で] menandai ALAT / INSTRUMEN yang digunakan untuk melakukan aktivitas (\"dengan sumpit\", \"dengan sendok\", \"dengan pena\").",
    "audioText": "はしで ごはんを たべます。"
  },
  {
    "id": "pq-17",
    "level": "N5",
    "sentenceWithBlank": "あした いっしょに いちばへ いきませんか。いいです___。",
    "sentenceComplete": "あした いっしょに いちばへ いきませんか。いいですね。",
    "translationId": "Besok mau ke pasar bersama? Boleh juga ya (ide bagus).",
    "correctParticle": "ね",
    "options": [
      "ね",
      "よ",
      "か",
      "わ"
    ],
    "explanation": "Partikel akhir kalimat [ね] digunakan untuk menyetujui, meminta konfirmasi, atau mencari kesepakatan simpati dengan lawan bicara (\"ya / kan\").",
    "audioText": "いいですね。"
  },
  {
    "id": "pq-18",
    "level": "N5",
    "sentenceWithBlank": "これは だれ___ かばんですか。",
    "sentenceComplete": "これは だれの かばんですか。",
    "translationId": "Ini tas milik siapa?",
    "correctParticle": "の",
    "options": [
      "の",
      "は",
      "が",
      "に"
    ],
    "explanation": "Partikel [の] menghubungkan kata benda dengan kata benda lainnya, dalam konteks ini menyatakan HUBUNGAN KEPEMILIKAN (\"tas milik siapa\").",
    "audioText": "これは だれの かばんですか。"
  },
  {
    "id": "pq-19",
    "level": "N5",
    "sentenceWithBlank": "にほんご___ てがみを かきました。",
    "sentenceComplete": "にほんごで てがみを かきました。",
    "translationId": "Saya menulis surat dalam bahasa Jepang.",
    "correctParticle": "で",
    "options": [
      "で",
      "に",
      "を",
      "の"
    ],
    "explanation": "Bahasa yang digunakan sebagai media pengantar ekspresi atau komunikasi ditandai dengan partikel [で] (\"dalam / menggunakan bahasa Jepang\").",
    "audioText": "にほんごで てがみを かきました。"
  },
  {
    "id": "pq-20",
    "level": "N5",
    "sentenceWithBlank": "まいあさ ７じはん___ いえを でます。",
    "sentenceComplete": "まいあさ ７じはんに いえを でます。",
    "translationId": "Setiap pagi saya keluar rumah pada jam 7:30.",
    "correctParticle": "に",
    "options": [
      "に",
      "で",
      "から",
      "を"
    ],
    "explanation": "Titik waktu berangka spesifik [７じはん / 7:30] ditandai dengan partikel [に]. (Catatan: kata kerja 出ます menggunakan [を] untuk tempat yang ditinggalkan).",
    "audioText": "まいあさ ７じはんに いえを でます。"
  },
  {
    "id": "pq-21",
    "level": "N5",
    "sentenceWithBlank": "ジュース___ おちゃを のみます。",
    "sentenceComplete": "ジュースか おちゃを のみます。",
    "translationId": "Saya akan minum jus atau teh.",
    "correctParticle": "か",
    "options": [
      "か",
      "と",
      "も",
      "で"
    ],
    "explanation": "Partikel [か] di antara dua kata benda bermakna \"atau\" (menyatakan pilihan alternatif).",
    "audioText": "ジュースか おちゃを のみます。"
  },
  {
    "id": "pq-22",
    "level": "N5",
    "sentenceWithBlank": "いま きょうしつに せんせい___ いません。",
    "sentenceComplete": "いま きょうしつに せんせいは いません。",
    "translationId": "Sekarang di dalam kelas, guru sedang tidak ada.",
    "correctParticle": "は",
    "options": [
      "は",
      "を",
      "で",
      "へ"
    ],
    "explanation": "Dalam kalimat negatif [いません / ありません], partikel [は] sering dipakai menggantikan [が] untuk menegaskan kontras (\"Kalau guru, saat ini tidak ada\").",
    "audioText": "いま きょうしつに せんせいは いません。"
  },
  {
    "id": "pq-23",
    "level": "N5",
    "sentenceWithBlank": "この りょうりは とても おいしいです___！",
    "sentenceComplete": "この りょうりは とても おいしいですよ！",
    "translationId": "Masakan ini enak sekali lho!",
    "correctParticle": "よ",
    "options": [
      "よ",
      "ね",
      "か",
      "も"
    ],
    "explanation": "Partikel akhir kalimat [よ] digunakan untuk memberikan informasi baru atau meyakinkan lawan bicara (\"lho / tahu tidak\"). Berbeda dengan [ね] yang mencari konfirmasi/kesepakatan.",
    "audioText": "この りょうりは とても おいしいですよ！"
  },
  {
    "id": "pq-24",
    "level": "N5",
    "sentenceWithBlank": "つくえの うえに ペン___ ノートなどが あります。",
    "sentenceComplete": "つくえの うえに ペンや ノートなどが あります。",
    "translationId": "Di atas meja ada pena, buku catatan, dan lain-lain.",
    "correctParticle": "や",
    "options": [
      "や",
      "と",
      "も",
      "に"
    ],
    "explanation": "Partikel [や] digunakan untuk mendaftar contoh kata benda secara NON-EKSKLUSIF (masih ada benda lain yang tidak disebutkan), sering berpasangan dengan など.",
    "audioText": "つくえの うえに ペンや ノートなどが あります。"
  },
  {
    "id": "pq-25",
    "level": "N5",
    "sentenceWithBlank": "きょうは あめですから、どこ___ いきません。",
    "sentenceComplete": "きょうは あめですから、どこへも いきません。",
    "translationId": "Hari ini hujan, jadi saya tidak pergi ke mana pun.",
    "correctParticle": "へも",
    "options": [
      "へも",
      "へは",
      "でも",
      "には"
    ],
    "explanation": "Pola negasi total arah: [どこ + へ + も + Negatif] bermakna \"tidak ke mana pun\". Kombinasi partikel arah [へ] dan penegas [も] menolak semua tujuan tujuan.",
    "audioText": "きょうは あめですから、どこへも いきません。"
  },
  {
    "id": "pq-26",
    "level": "N4",
    "sentenceWithBlank": "さいふの なかに １００えん___ ありません。",
    "sentenceComplete": "さいふの なかに １００えんしか ありません。",
    "translationId": "Di dalam dompet hanya ada 100 yen (tidak ada selain itu).",
    "correctParticle": "しか",
    "options": [
      "しか",
      "だけ",
      "ばかり",
      "ほど"
    ],
    "explanation": "Partikel [しか] WAJIB berpasangan dengan predikat NEGATIF (ありません) untuk menyatakan \"hanya/cuma\" dengan nuansa kekurangan. Jika positif (あります), gunakan [だけ].",
    "audioText": "さいふの なかに １００えんしか ありません。"
  },
  {
    "id": "pq-27",
    "level": "N4",
    "sentenceWithBlank": "きょうの テストで まちがえたのは １もん___でした。",
    "sentenceComplete": "きょうの テストで まちがえたのは １もんだけでした。",
    "translationId": "Pada tes hari ini, yang salah cuma 1 nomor saja.",
    "correctParticle": "だけ",
    "options": [
      "だけ",
      "しか",
      "ほど",
      "までに"
    ],
    "explanation": "Partikel [だけ] menyatakan batasan eksklusif (\"hanya/cuma\") dan dapat berpasangan dengan kalimat POSITIF maupun penegasan biasa.",
    "audioText": "きょうの テストで まちがえたのは １もんだけでした。"
  },
  {
    "id": "pq-28",
    "level": "N4",
    "sentenceWithBlank": "レポートは あすの ５じ___ だしてください。",
    "sentenceComplete": "レポートは あすの ５じまでに だしてください。",
    "translationId": "Tolong kumpulkan laporannya paling lambat sebelum jam 5 besok.",
    "correctParticle": "までに",
    "options": [
      "までに",
      "まで",
      "から",
      "に"
    ],
    "explanation": "Perbedaan krusial まで vs までに: [までに] menandai BATAS AKHIR / DEADLINE (\"paling lambat sebelum\"), sedangkan [まで] menandai durasi aktivitas berlanjut sampai saat itu.",
    "audioText": "レポートは あすの ５じまでに だしてください。"
  },
  {
    "id": "pq-29",
    "level": "N4",
    "sentenceWithBlank": "この アニメ___ ついて どう おもいますか。",
    "sentenceComplete": "この アニメに ついて どう おもいますか。",
    "translationId": "Bagaimana pendapatmu tentang anime ini?",
    "correctParticle": "に",
    "options": [
      "に",
      "で",
      "を",
      "と"
    ],
    "explanation": "Pola tata bahasa partikel komposit [〜について]: Menggunakan partikel [に] sebelum ついて untuk menyatakan \"tentang / mengenai suatu topik bahasan\".",
    "audioText": "この アニメに ついて どう おもいますか。"
  },
  {
    "id": "pq-30",
    "level": "N4",
    "sentenceWithBlank": "わたし___ とって かぞくが いちばん たいせつです。",
    "sentenceComplete": "わたしに とって かぞくが いちばん たいせつです。",
    "translationId": "Bagi saya, keluarga adalah yang paling berharga.",
    "correctParticle": "に",
    "options": [
      "に",
      "で",
      "を",
      "から"
    ],
    "explanation": "Pola [〜にとって]: Menggunakan partikel [に] sebelum とって untuk menyatakan sudut pandang atau evaluasi subjektif dari seseorang (\"bagi/menurut si X\").",
    "audioText": "わたしに とって かぞくが いちばん たいせつです。"
  },
  {
    "id": "pq-31",
    "level": "N4",
    "sentenceWithBlank": "てんき___ よって よていが かわります。",
    "sentenceComplete": "てんきに よって よていが かわります。",
    "translationId": "Rencana akan berubah bergantung pada cuaca.",
    "correctParticle": "に",
    "options": [
      "に",
      "で",
      "を",
      "へ"
    ],
    "explanation": "Pola [〜によって]: Menggunakan partikel [に] sebelum よって untuk menyatakan variasi / ketergantungan kondisi (\"bergantung pada / sesuai dengan\").",
    "audioText": "てんきに よって よていが かわります。"
  },
  {
    "id": "pq-32",
    "level": "N4",
    "sentenceWithBlank": "おとうとは ゲーム___ ばかり しています。",
    "sentenceComplete": "おとうとは ゲームばかり しています。",
    "translationId": "Adik laki-lakiku kerjanya bermain game melulu.",
    "correctParticle": "ばかり",
    "options": [
      "ばかり",
      "しか",
      "ほど",
      "など"
    ],
    "explanation": "Partikel [ばかり] menyatakan tindakan atau objek yang dilakukan terus-menerus hingga berlebihan (\"melulu / melulu itu saja\"), sering bernuansa evaluasi kritis.",
    "audioText": "おとうとは ゲームばかり しています。"
  },
  {
    "id": "pq-33",
    "level": "N4",
    "sentenceWithBlank": "ことしの ふゆは きょねん___ さむくないです。",
    "sentenceComplete": "ことしの ふゆは きょねんほど さむくないです。",
    "translationId": "Musim dingin tahun ini tidak sedingin tahun lalu.",
    "correctParticle": "ほど",
    "options": [
      "ほど",
      "より",
      "くらい",
      "だけ"
    ],
    "explanation": "Pola komparasi negatif [A は B ほど + Negatif]: Menyatakan bahwa A tingkatannya tidak menyamai B (\"A tidak se-derajat B\").",
    "audioText": "ことしの ふゆは きょねんほど さむくないです。"
  },
  {
    "id": "pq-34",
    "level": "N4",
    "sentenceWithBlank": "えきまで あるいて １５ふん___ かかります。",
    "sentenceComplete": "えきまで あるいて １５ふんぐらい かかります。",
    "translationId": "Jalan kaki sampai stasiun memakan waktu sekitar 15 menit.",
    "correctParticle": "ぐらい",
    "options": [
      "ぐらい",
      "しか",
      "までに",
      "ばかり"
    ],
    "explanation": "Partikel penunjuk perkiraan [くらい / ぐらい] melekat langsung pada angka atau durasi untuk menyatakan perkiraan jumlah (\"kira-kira / sekitar\").",
    "audioText": "えきまで あるいて １５ふんぐらい かかります。"
  },
  {
    "id": "pq-35",
    "level": "N4",
    "sentenceWithBlank": "きゃく___ たいして ていねいに はなします。",
    "sentenceComplete": "きゃくに たいして ていねいに はなします。",
    "translationId": "Berbicara dengan sopan terhadap pelanggan.",
    "correctParticle": "に",
    "options": [
      "に",
      "で",
      "を",
      "へ"
    ],
    "explanation": "Pola [〜に対して / にたいして]: Diawali partikel [に] untuk menandai target atau sasaran sikap dan tindakan (\"terhadap pihak X\").",
    "audioText": "きゃくに たいして ていねいに はなします。"
  },
  {
    "id": "pq-36",
    "level": "N4",
    "sentenceWithBlank": "けんこうの___ まいにち はしっています。",
    "sentenceComplete": "けんこうの ために まいにち はしっています。",
    "translationId": "Demi kesehatan, saya berlari setiap hari.",
    "correctParticle": "ために",
    "options": [
      "ために",
      "ように",
      "までに",
      "とおりに"
    ],
    "explanation": "Pola tujuan [Kata Benda + の + ために]: Digunakan untuk menyatakan tujuan yang disengaja (\"demi / demi kepentingan X\").",
    "audioText": "けんこうの ために まいにち はしっています。"
  },
  {
    "id": "pq-37",
    "level": "N4",
    "sentenceWithBlank": "じかんを まちがえない___ メモを しました。",
    "sentenceComplete": "じかんを まちがえない ように メモを しました。",
    "translationId": "Saya mencatat agar tidak salah waktu.",
    "correctParticle": "ように",
    "options": [
      "ように",
      "ために",
      "ばかりに",
      "はずで"
    ],
    "explanation": "Pola [Bentuk Negatif / Potensial + ように]: Menyatakan tujuan harapan atau pencegahan kondisi yang di luar kontrol langsung (\"supaya / agar tidak X\").",
    "audioText": "じかんを まちがえない ように メモを しました。"
  },
  {
    "id": "pq-38",
    "level": "N4",
    "sentenceWithBlank": "わたしは いぬ___ こわいです。",
    "sentenceComplete": "わたしは いぬが こわいです。",
    "translationId": "Saya takut pada anjing.",
    "correctParticle": "が",
    "options": [
      "が",
      "を",
      "に",
      "で"
    ],
    "explanation": "Objek dari kata sifat emosi perasaan (こわい = takut, うれしい = senang, はずかしい = malu) selalu ditandai dengan partikel [が], bukan [を].",
    "audioText": "わたしは いぬが こわいです。"
  },
  {
    "id": "pq-39",
    "level": "N4",
    "sentenceWithBlank": "きょうは にほんご___ えいごも べんきょうしました。",
    "sentenceComplete": "きょうは にほんごだけでなく えいごも べんきょうしました。",
    "translationId": "Hari ini saya tidak hanya belajar bahasa Jepang, tetapi bahasa Inggris juga.",
    "correctParticle": "だけでなく",
    "options": [
      "だけでなく",
      "だけより",
      "しかなく",
      "ばかりで"
    ],
    "explanation": "Pola partikel komposit [〜だけでなく ... も]: Bermakna \"tidak hanya X, melainkan Y juga\".",
    "audioText": "きょうは にほんごだけでなく えいごも べんきょうしました。"
  },
  {
    "id": "pq-40",
    "level": "N4",
    "sentenceWithBlank": "でんしゃ___ おりて、バスに のりかえます。",
    "sentenceComplete": "でんしゃを おりて、バスに のりかえます。",
    "translationId": "Turun dari kereta, lalu pindah naik bus.",
    "correctParticle": "を",
    "options": [
      "を",
      "に",
      "で",
      "から"
    ],
    "explanation": "Kata kerja perpindahan turun (おります) atau keluar (でます) menandai titik asal pemisahan dengan partikel [を] (\"turun dari kereta\"). Sedangkan naik kendaraan memakai [に].",
    "audioText": "でんしゃを おりて、バスに のりかえます。"
  },
  {
    "id": "pq-41",
    "level": "N4",
    "sentenceWithBlank": "この へやは しずか___ べんきょうしやすいです。",
    "sentenceComplete": "この へやは しずかで べんきょうしやすいです。",
    "translationId": "Kamar ini tenang sehingga mudah untuk belajar.",
    "correctParticle": "で",
    "options": [
      "で",
      "に",
      "な",
      "と"
    ],
    "explanation": "Bentuk sambung (te-form) dari Na-adjective (しずか) adalah [しずかで], berfungsi menghubungkan alasan atau sifat yang sejajar.",
    "audioText": "この へやは しずかで べんきょうしやすいです。"
  },
  {
    "id": "pq-42",
    "level": "N4",
    "sentenceWithBlank": "いっしょうけんめい べんきょうした___、テストに おちました。",
    "sentenceComplete": "いっしょうけんめい べんきょうしたのに、テストに おちました。",
    "translationId": "Padahal sudah belajar mati-matian, tetapi gagal dalam ujian.",
    "correctParticle": "のに",
    "options": [
      "のに",
      "ので",
      "から",
      "ても"
    ],
    "explanation": "Partikel perlawanan [のに] menyatakan kontras dengan nuansa kekecewaan, kejutan, atau rasa sesal (\"padahal... namun kenyataannya...\").",
    "audioText": "いっしょうけんめい べんきょうしたのに、テストに おちました。"
  },
  {
    "id": "pq-43",
    "level": "N4",
    "sentenceWithBlank": "あめが ふっている___、かさを さしていません。",
    "sentenceComplete": "あめが ふっているのに、かさを さしていません。",
    "translationId": "Padahal hujan sedang turun, dia tidak memakai payung.",
    "correctParticle": "のに",
    "options": [
      "のに",
      "ので",
      "から",
      "なら"
    ],
    "explanation": "Partikel [のに] mengungkapkan situasi yang bertentangan dengan ekspektasi normal (\"padahal hujan, kok tidak berpayung\").",
    "audioText": "あめが ふっているのに、かさを さしていません。"
  },
  {
    "id": "pq-44",
    "level": "N4",
    "sentenceWithBlank": "やすみの日には そうじ___ せんたく___ します。",
    "sentenceComplete": "やすみの日には そうじとか せんたくとか します。",
    "translationId": "Pada hari libur saya melakukan hal seperti bersih-bersih atau mencuci.",
    "correctParticle": "とか",
    "options": [
      "とか",
      "から",
      "まで",
      "ほど"
    ],
    "explanation": "Partikel bahasa lisan [〜とか 〜とか] digunakan untuk mendaftar contoh aktivitas santai secara bebas (\"seperti ini atau seperti itu\").",
    "audioText": "やすみの日には そうじとか せんたくとか します。"
  },
  {
    "id": "pq-45",
    "level": "N4",
    "sentenceWithBlank": "おちゃ___ のみませんか。",
    "sentenceComplete": "おちゃでも のみませんか。",
    "translationId": "Bagaimana kalau kita minum teh atau semacamnya?",
    "correctParticle": "でも",
    "options": [
      "でも",
      "しか",
      "ほど",
      "ばかり"
    ],
    "explanation": "Partikel penawar santai [〜でも]: Mengajukan salah satu opsi representatif tanpa membatasi pilihan semata-mata pada hal itu (\"misalnya minum teh atau semacamnya\").",
    "audioText": "おちゃでも のみませんか。"
  },
  {
    "id": "pq-46",
    "level": "N4",
    "sentenceWithBlank": "わたしは ピアノ___ ひくことが できます。",
    "sentenceComplete": "わたしは ピアノを ひくことが できます。",
    "translationId": "Saya bisa memainkan piano.",
    "correctParticle": "を",
    "options": [
      "を",
      "が",
      "に",
      "で"
    ],
    "explanation": "Dalam pola nominalisasi [〜こと]: Objek di dalam klausa sebelum こと terikat pada kata kerjanya (ピアノを ひく), baru kemudian diikuti [が できます].",
    "audioText": "わたしは ピアノを ひくことが できます。"
  },
  {
    "id": "pq-47",
    "level": "N4",
    "sentenceWithBlank": "しんごうが あか___ なりました。",
    "sentenceComplete": "しんごうが あかに なりました。",
    "translationId": "Lampu lalu lintas berubah menjadi merah.",
    "correctParticle": "に",
    "options": [
      "に",
      "で",
      "を",
      "と"
    ],
    "explanation": "Pola perubahan keadaan [Kata Benda / Na-adj + に なります]: Menggunakan partikel [に] untuk menandai hasil akhir perubahan kondisi.",
    "audioText": "しんごうが あかに なりました。"
  },
  {
    "id": "pq-48",
    "level": "N4",
    "sentenceWithBlank": "にほんごが じょうず___ なるように まいにち れんしゅうします。",
    "sentenceComplete": "にほんごが じょうずに なるように まいにち れんしゅうします。",
    "translationId": "Saya berlatih setiap hari agar menjadi mahir berbahasa Jepang.",
    "correctParticle": "に",
    "options": [
      "に",
      "な",
      "で",
      "を"
    ],
    "explanation": "Kata sifat-Na (じょうず) jika bergabung dengan naru (menjadi) berubah menjadi bentuk adverbial dengan partikel [に] (じょうずに なります).",
    "audioText": "にほんごが じょうずに なるように まいにち れんしゅうします。"
  },
  {
    "id": "pq-49",
    "level": "N4",
    "sentenceWithBlank": "テストの けっか___ よって クラスが きまります。",
    "sentenceComplete": "テストの けっかに よって クラスが きまります。",
    "translationId": "Kelas ditentukan berdasarkan hasil ujian.",
    "correctParticle": "に",
    "options": [
      "に",
      "で",
      "を",
      "から"
    ],
    "explanation": "Pola [〜によって]: Menandai dasar penentu atau kriteria pembagian (\"berdasarkan hasil tes\"). Menggunakan partikel [に].",
    "audioText": "テストの けっかに よって クラスが きまります。"
  },
  {
    "id": "pq-50",
    "level": "N4",
    "sentenceWithBlank": "この はこは おもすぎて、ひとり___ もてません。",
    "sentenceComplete": "この はこは おもすぎて、ひとりでは もてません。",
    "translationId": "Kotak ini terlalu berat, kalau sendirian tidak bisa diangkat.",
    "correctParticle": "では",
    "options": [
      "では",
      "には",
      "へは",
      "とは"
    ],
    "explanation": "Partikel pembatas kondisi kuantitas orang: [ひとりで] (sendirian) ditambah partikel [は] menjadi [ひとりでは] untuk menegaskan syarat negatif pada kalimat pembatasan.",
    "audioText": "この はこは おもすぎて、ひとりでは もてません。"
  },
  {
    "id": "pq-51",
    "level": "N3",
    "sentenceWithBlank": "かれは りゅうがくせい___ 日本へ やってきました。",
    "sentenceComplete": "かれは りゅうがくせいとして 日本へ やってきました。",
    "translationId": "Dia datang ke Jepang sebagai mahasiswa asing.",
    "correctParticle": "として",
    "options": [
      "として",
      "にとって",
      "に対して",
      "につれて"
    ],
    "explanation": "Pola partikel peran [〜として]: Melekat pada status, peran, kualifikasi, atau kapasitas seseorang (\"sebagai / dalam kapasitas sebagai X\").",
    "audioText": "かれは りゅうがくせいとして 日本へ やってきました。"
  },
  {
    "id": "pq-52",
    "level": "N3",
    "sentenceWithBlank": "たとえ しっぱいした___、あきらめません。",
    "sentenceComplete": "たとえ しっぱいしたとしても、あきらめません。",
    "translationId": "Sekalipun seandainya gagal, saya tidak akan menyerah.",
    "correctParticle": "としても",
    "options": [
      "としても",
      "にしては",
      "につれて",
      "とともに"
    ],
    "explanation": "Pola pengandaian konsesif [たとえ〜としても]: Bermakna \"bahkan seandainya / sekalipun...\", mengasumsikan kemungkinan terburuk tapi keputusan tidak goyah.",
    "audioText": "たとえ しっぱいしたとしても、あきらめません。"
  },
  {
    "id": "pq-53",
    "level": "N3",
    "sentenceWithBlank": "時間の けいか___ つれて、かなしみが うすれていった。",
    "sentenceComplete": "時間の けいかに つれて、かなしみが うすれていった。",
    "translationId": "Seiring berjalannya waktu, rasa sedih pun perlahan memudar.",
    "correctParticle": "に",
    "options": [
      "に",
      "で",
      "を",
      "と"
    ],
    "explanation": "Pola perubahan simultan proksimal [〜につれて]: Menggunakan partikel [に] sebelum つれて untuk menyatakan satu hal berubah seiring perubahan hal lain secara alami.",
    "audioText": "時間の けいかに つれて、かなしみが うすれていった。"
  },
  {
    "id": "pq-54",
    "level": "N3",
    "sentenceWithBlank": "きそく___ したがって、ただしく こうどうしてください。",
    "sentenceComplete": "きそくに したがって、ただしく こうどうしてください。",
    "translationId": "Tolong bertindaklah dengan benar sesuai/mengikuti peraturan.",
    "correctParticle": "に",
    "options": [
      "に",
      "で",
      "を",
      "へ"
    ],
    "explanation": "Pola kepatuhan / kesesuaian [〜にしたがって]: Menggunakan partikel [に] sebelum したがって bermakna \"mematuhi / mengikuti instruksi atau aturan\".",
    "audioText": "きそくに したがって、ただしく こうどうしてください。"
  },
  {
    "id": "pq-55",
    "level": "N3",
    "sentenceWithBlank": "とうきょう___ おいて、こくさいかいぎが ひらかれます。",
    "sentenceComplete": "とうきょうに おいて、こくさいかいぎが ひらかれます。",
    "translationId": "Konferensi internasional akan diselenggarakan di Tokyo.",
    "correctParticle": "に",
    "options": [
      "に",
      "で",
      "を",
      "から"
    ],
    "explanation": "Pola formal lokatif [〜において / における]: Merupakan ragam baku/formal dari partikel [で], digunakan dalam pidato, berita, atau laporan tertulis resmi.",
    "audioText": "とうきょうに おいて、こくさいかいぎが ひらかれます。"
  },
  {
    "id": "pq-56",
    "level": "N3",
    "sentenceWithBlank": "この もんだい___ かんして、ごいけんが ありますか。",
    "sentenceComplete": "この もんだいに かんして、ごいけんが ありますか。",
    "translationId": "Apakah ada pendapat berkenaan dengan masalah ini?",
    "correctParticle": "に",
    "options": [
      "に",
      "で",
      "を",
      "と"
    ],
    "explanation": "Pola formal topik bahasan [〜に関して / にかんして]: Bentuk lebih formal dan akademis dari [〜について], selalu diawali partikel [に].",
    "audioText": "この もんだいに かんして、ごいけんが ありますか。"
  },
  {
    "id": "pq-57",
    "level": "N3",
    "sentenceWithBlank": "たいふうの えいきょうは ３にちかん___ わたって つづきました。",
    "sentenceComplete": "たいふうの えいきょうは ３にちかんに わたって つづきました。",
    "translationId": "Pengaruh badai taifun berlangsung membentang selama 3 hari penuh.",
    "correctParticle": "に",
    "options": [
      "に",
      "で",
      "を",
      "から"
    ],
    "explanation": "Pola cakupan rentang [〜にわたって]: Menggunakan partikel [に] sebelum わたって untuk menandai rentang waktu atau skala area luas (\"membentang sepanjang X\").",
    "audioText": "たいふうの えいきょうは ３にちかんに わたって つづきました。"
  },
  {
    "id": "pq-58",
    "level": "N3",
    "sentenceWithBlank": "インターネット___ つうじて、せかいじゅうの ニュースを しる。",
    "sentenceComplete": "インターネットを つうじて、せかいじゅうの ニュースを しる。",
    "translationId": "Mengetahui berita seluruh dunia melalui internet.",
    "correctParticle": "を",
    "options": [
      "を",
      "に",
      "で",
      "と"
    ],
    "explanation": "Pola perantara mediasi [〜を通じて / をつうじて]: Menggunakan partikel objek [を] sebelum つうじて untuk menyatakan \"melalui perantara / media X\".",
    "audioText": "インターネットを つうじて、せかいじゅうの ニュースを しる。"
  },
  {
    "id": "pq-59",
    "level": "N3",
    "sentenceWithBlank": "こころ___ こめて、プレゼントを えらびました。",
    "sentenceComplete": "こころを こめて、プレゼントを えらびました。",
    "translationId": "Saya memilih hadiah dengan mencurahkan sepenuh hati.",
    "correctParticle": "を",
    "options": [
      "を",
      "に",
      "で",
      "から"
    ],
    "explanation": "Ekspresi idiomatik emosi [〜を込めて / をこめて]: Menggunakan partikel [を] sebelum こめて (こころをこめて = dengan sepenuh hati, あいをこめて = dengan cinta).",
    "audioText": "こころを こめて、プレゼントを えらびました。"
  },
  {
    "id": "pq-60",
    "level": "N3",
    "sentenceWithBlank": "アニメ___ はじめ、にほんの ぶんかは せかいで にんきが あります。",
    "sentenceComplete": "アニメを はじめ、にほんの ぶんかは せかいで にんきが あります。",
    "translationId": "Mulai dari anime dan yang lainnya, kebudayaan Jepang populer di dunia.",
    "correctParticle": "を",
    "options": [
      "を",
      "に",
      "で",
      "から"
    ],
    "explanation": "Pola pemulaan contoh representatif [〜をはじめ]: Menggunakan partikel [を] untuk menyebutkan contoh utama paling representatif (\"mulai dari X sebagai contoh primer\").",
    "audioText": "アニメを はじめ、にほんの ぶんかは せかいで にんきが あります。"
  },
  {
    "id": "pq-61",
    "level": "N3",
    "sentenceWithBlank": "きょねん___ くらべて、ことしの うりあげは ２ばいに なった。",
    "sentenceComplete": "きょねんに くらべて、ことしの うりあげは ２ばいに なった。",
    "translationId": "Dibandingkan tahun lalu, omset penjualan tahun ini menjadi dua kali lipat.",
    "correctParticle": "に",
    "options": [
      "に",
      "で",
      "を",
      "と"
    ],
    "explanation": "Pola komparasi eksplisit [〜に比べて / にくらべて]: Menggunakan partikel [に] sebelum くらべて untuk membandingkan dua subjek secara proporsional.",
    "audioText": "きょねんに くらべて、ことしの うりあげは ２ばいに なった。"
  },
  {
    "id": "pq-62",
    "level": "N3",
    "sentenceWithBlank": "この しょうひんは わかもの___ むけに つくられました。",
    "sentenceComplete": "この しょうひんは わかものむけに つくられました。",
    "translationId": "Produk ini dibuat khusus ditujukan bagi kalangan anak muda.",
    "correctParticle": "むけに",
    "options": [
      "むけに",
      "むきに",
      "ように",
      "ために"
    ],
    "explanation": "Pola target peruntukan [〜向けに / むけに]: Digunakan saat suatu barang, program, atau fasilitas sengaja dirancang dan ditargetkan untuk kelompok sasaran tertentu.",
    "audioText": "この しょうひんは わかものむけに つくられました。"
  },
  {
    "id": "pq-63",
    "level": "N3",
    "sentenceWithBlank": "いそがしい とき___ かぎって、トラブルが おきる。",
    "sentenceComplete": "いそがしい ときに かぎって、トラブルが おきる。",
    "translationId": "Justru di saat sedang sibuk-sibuknya, masalah selalu saja muncul.",
    "correctParticle": "に",
    "options": [
      "に",
      "で",
      "を",
      "は"
    ],
    "explanation": "Pola ironi nasib [〜に限って / にかぎって]: Menggunakan partikel [に] untuk menegaskan kekecewaan saat peristiwa sial terjadi persis di waktu yang paling tidak diinginkan.",
    "audioText": "いそがしい ときに かぎって、トラブルが おきる。"
  },
  {
    "id": "pq-64",
    "level": "N3",
    "sentenceWithBlank": "こども___ かぎらず、おとなも この アニメを たのしめる。",
    "sentenceComplete": "こどもに かぎらず、おとなも この アニメを たのしめる。",
    "translationId": "Tidak terbatas hanya anak-anak, orang dewasa pun bisa menikmati anime ini.",
    "correctParticle": "に",
    "options": [
      "に",
      "で",
      "を",
      "から"
    ],
    "explanation": "Pola perluasan inklusif [〜に限らず / にかぎらず]: Menggunakan partikel [に] untuk menegaskan bahwa hal tersebut berlaku luas, tidak cuma terbatas pada lingkup X.",
    "audioText": "こどもに かぎらず、おとなも この アニメを たのしめる。"
  },
  {
    "id": "pq-65",
    "level": "N3",
    "sentenceWithBlank": "けいざいの はってん___ ともなって、かんきょうもんだいが しんこく化した。",
    "sentenceComplete": "けいざいの はってんに ともなって、かんきょうもんだいが しんこく化した。",
    "translationId": "Seiring berjalannya perkembangan ekonomi, masalah lingkungan menjadi kian serius.",
    "correctParticle": "に",
    "options": [
      "に",
      "で",
      "を",
      "と"
    ],
    "explanation": "Pola perubahan simultan formal [〜に伴って / にともなって]: Menggunakan partikel [に] untuk menggambarkan konsekuensi yang timbul bersamaan dengan perubahan besar.",
    "audioText": "けいざいの はってんに ともなって、かんきょうもんだいが しんこく化した。"
  },
  {
    "id": "pq-66",
    "level": "N3",
    "sentenceWithBlank": "じじつ___ もとづいて、きじを かかなければならない。",
    "sentenceComplete": "じじつに もとづいて、きじを かかなければならない。",
    "translationId": "Harus menulis artikel berita berdasarkan fakta empiris.",
    "correctParticle": "に",
    "options": [
      "に",
      "で",
      "を",
      "から"
    ],
    "explanation": "Pola landasan dasar [〜に基づいて / にもとづいて]: Menggunakan partikel [に] sebelum もとづいて untuk menandai landasan teori, data, atau fakta yang dijadikan pijakan.",
    "audioText": "じじつに もとづいて、きじを かかなければならない。"
  },
  {
    "id": "pq-67",
    "level": "N3",
    "sentenceWithBlank": "じこを きっかけ___、あんぜんたいさくを みなおした。",
    "sentenceComplete": "じこを きっかけに、あんぜんたいさくを みなおした。",
    "translationId": "Bermula dari insiden kecelakaan tersebut, kami meninjau ulang langkah keselamatan.",
    "correctParticle": "に",
    "options": [
      "に",
      "で",
      "を",
      "へ"
    ],
    "explanation": "Pola pemicu momentum [〜をきっかけに]: Menggunakan gabungan partikel [を] + きっかけ + [に] untuk menandai momen titik balik yang memicu perubahan.",
    "audioText": "じこを きっかけに、あんぜんたいさくを みなおした。"
  },
  {
    "id": "pq-68",
    "level": "N3",
    "sentenceWithBlank": "かれは ゆうのうだが、しんせつか と いう___ そうではない。",
    "sentenceComplete": "かれは ゆうのうだが、しんせつか と いうと そうではない。",
    "translationId": "Dia memang kompeten, namun kalau dibilang ramah tidaklah demikian.",
    "correctParticle": "と",
    "options": [
      "と",
      "に",
      "で",
      "を"
    ],
    "explanation": "Pola [〜かというと / といえば]: Menyatakan konfirmasi kualifikasi (\"kalau ditanya apakah begitu... ternyata tidak selalu\").",
    "audioText": "かれは ゆうのうだが、しんせつか と いうと そうではない。"
  },
  {
    "id": "pq-69",
    "level": "N3",
    "sentenceWithBlank": "やすい___ いって、ひんしつが わるいとは かぎらない。",
    "sentenceComplete": "やすいからと いって、ひんしつが わるいとは かぎらない。",
    "translationId": "Hanya karena murah, belum tentu kualitasnya jelek.",
    "correctParticle": "からと",
    "options": [
      "からと",
      "だから",
      "なのに",
      "としても"
    ],
    "explanation": "Pola penolakan generalisasi [〜からといって]: Menolak asumsi umum (\"hanya semata-mata karena alasan A, bukan berarti kesimpulan B pasti benar\").",
    "audioText": "やすいからと いって、ひんしつが わるいとは かぎらない。"
  },
  {
    "id": "pq-70",
    "level": "N3",
    "sentenceWithBlank": "この まちは やちんが たかい。それ___ たいして、となりまちは やすい。",
    "sentenceComplete": "この まちは やちんが たかい。それに たいして、となりまちは やすい。",
    "translationId": "Kota ini sewa rumahnya mahal. Berbanding terbalik dengan itu, kota tetangga murah.",
    "correctParticle": "に",
    "options": [
      "に",
      "で",
      "を",
      "へ"
    ],
    "explanation": "Pola kontras perbandingan [〜に対して / にたいして]: Menghadapkan dua kondisi yang bertolak belakang secara kontras.",
    "audioText": "それに たいして、となりまちは やすい。"
  },
  {
    "id": "pq-71",
    "level": "N3",
    "sentenceWithBlank": "うれしい___、なみだが でてきた。",
    "sentenceComplete": "うれしいことに、なみだが でてきた。",
    "translationId": "Betapa membahagiakannya, sampai-sampai air mata menetes.",
    "correctParticle": "ことに",
    "options": [
      "ことに",
      "ように",
      "ために",
      "わけに"
    ],
    "explanation": "Pola penegas emosi pembuka [Kata Sifat + ことに]: Menyatakan perasaan mendalam pembicara di awal tuturan (\"betapa menggembirakannya...\").",
    "audioText": "うれしいことに、なみだが でてきた。"
  },
  {
    "id": "pq-72",
    "level": "N3",
    "sentenceWithBlank": "かれは びょうきの___、かいぎを けっせきした。",
    "sentenceComplete": "かれは びょうきの ために、かいぎを けっせきした。",
    "translationId": "Karena sakit, dia tidak menghadiri rapat.",
    "correctParticle": "ために",
    "options": [
      "ために",
      "ように",
      "だけに",
      "せいで"
    ],
    "explanation": "Pola sebab-akibat objektif netral [Kata Benda + のために]: Digunakan dalam tuturan formal untuk menyatakan alasan objektif timbulnya suatu konsekuensi.",
    "audioText": "かれは びょうきの ために、かいぎを けっせきした。"
  },
  {
    "id": "pq-73",
    "level": "N3",
    "sentenceWithBlank": "この アプリは つかいやすい___、むりょうで つかえる。",
    "sentenceComplete": "この アプリは つかいやすい上に、むりょうで つかえる。",
    "translationId": "Aplikasi ini mudah digunakan, ditambah lagi bisa dipakai gratis.",
    "correctParticle": "上に",
    "options": [
      "上に",
      "中に",
      "下に",
      "前に"
    ],
    "explanation": "Pola penambahan kumulatif [〜上に / うえに]: Bermakna \"ditambah lagi / selain itu...\", menumpuk poin plus atau poin minus yang searah.",
    "audioText": "この アプリは つかいやすい上に、むりょうで つかえる。"
  },
  {
    "id": "pq-74",
    "level": "N3",
    "sentenceWithBlank": "にほんごが じょうずになる___、たくさん はなすことが たいせつだ。",
    "sentenceComplete": "にほんごが じょうずになるためには、たくさん はなすことが たいせつだ。",
    "translationId": "Demi menjadi mahir berbahasa Jepang, penting untuk banyak berbicara.",
    "correctParticle": "ためには",
    "options": [
      "ためには",
      "ように",
      "につれて",
      "にしては"
    ],
    "explanation": "Pola prasyarat mutlak [Kata Kerja Kamus + ためには]: Menegaskan bahwa untuk mencapai target impian tersebut, tindakan berikutnya adalah keharusan.",
    "audioText": "にほんごが じょうずになるためには、たくさん はなすことが たいせつだ。"
  },
  {
    "id": "pq-75",
    "level": "N3",
    "sentenceWithBlank": "かれは ほんきで おこっている___ みえる。",
    "sentenceComplete": "かれは ほんきで おこっているように みえる。",
    "translationId": "Dia kelihatannya sedang benar-benar marah.",
    "correctParticle": "ように",
    "options": [
      "ように",
      "そうに",
      "らしく",
      "みたい"
    ],
    "explanation": "Pola kesan visual [〜ように見える]: Menggabungkan partikel [ように] dengan [見える] untuk menyatakan kesimpulan impresi berdasarkan pengamatan luar.",
    "audioText": "かれは ほんきで おこっているように みえる。"
  }
];

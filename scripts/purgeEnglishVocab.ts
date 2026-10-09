/**
 * scripts/purgeEnglishVocab.ts
 *
 * SCRIPT MIGRASI MANDIRI SPK #19 (TIKET 19.1)
 * Membersihkan seluruh frasa 'melakukan + English', menerjemahkan kata-kata bahasa Inggris mentah
 * ke Bahasa Indonesia baku, menerjemahkan Kanji N2/N1 berbahasa Inggris, dan memvariasikan contoh kalimat.
 */

import fs from 'fs';
import path from 'path';
import type { VocabItem, KanjiItem } from '../src/types';
import { VOCAB_N5_COMPLETE } from '../src/data/vocabN5CompleteData';
import { VOCAB_N4_COMPLETE } from '../src/data/vocabN4CompleteData';
import { VOCAB_N3_COMPLETE } from '../src/data/vocabN3CompleteData';
import { VOCAB_N2_COMPLETE } from '../src/data/vocabN2CompleteData';
import { VOCAB_N1_COMPLETE } from '../src/data/vocabN1CompleteData';
import { KANJI_N2_COMPLETE } from '../src/data/kanjiN2CompleteData';
import { KANJI_N1_COMPLETE } from '../src/data/kanjiN1CompleteData';

// ============================================================================
// 1. KAMUS PENERJEMAHAN KATA KERJA ('melakukan + English' -> Indonesia Baku)
// ============================================================================
const VERB_DICT: Record<string, string> = {
  'quarrel': 'Bertengkar / Berselisih',
  'persist': 'Bertahan / Gigih berjuang',
  'try hard': 'Berjuang keras',
  'try one\'s best': 'Berusaha sebaik mungkin',
  'spend time pleasantly': 'Menghabiskan waktu bersenang-senang',
  'propose': 'Mengusulkan / Melamar',
  'suggest': 'Menyarankan',
  'hang out': 'Nongkrong / Berkumpul santai',
  'wear': 'Mengenakan / Memakai',
  'put on': 'Memakai / Mengenakan',
  'strike': 'Memukul / Menyerang',
  'collect': 'Mengumpulkan',
  'extend': 'Memperpanjang / Membentangkan',
  'break': 'Memecahkan / Merusak / Beristirahat',
  'burn': 'Membakar / Hangus',
  'be mixed': 'Bercampur',
  'rub': 'Menggosok / Mengusap',
  'attack': 'Menyerang',
  'pile up': 'Menumpuk',
  'leave': 'Meninggalkan / Berangkat',
  'include': 'Memasukkan / Mencakup',
  'cease': 'Berhenti / Mereda',
  'exceed': 'Melampaui / Melebihi',
  'reach': 'Mencapai / Meraih',
  'bend': 'Membungkuk / Membengkokkan',
  'exchange': 'Menukar / Bertukar',
  'face': 'Menghadap',
  'warp': 'Melengkung / Berbelok',
  'float': 'Mengapung / Melayang',
  'hang': 'Menggantung',
  'mingle with': 'Bercampur baur dengan',
  'tear': 'Merobek / Menyobek',
  'shake': 'Mengguncang',
  'feel': 'Merasakan',
  'shine': 'Bersinar / Berkilau',
  'hit': 'Memukul / Mengenai',
  'be fixed': 'Ditetapkan / Diperbaiki',
  'accomplish': 'Menuntaskan / Meraih keberhasilan',
  'put in order': 'Merapikan / Membereskan',
  'end': 'Mengakhiri / Berakhir',
  'start': 'Memulai',
  'begin': 'Memulai',
  'finish': 'Menyelesaikan',
  'cut': 'Memotong',
  'open': 'Membuka',
  'close': 'Menutup',
  'run': 'Berlari',
  'walk': 'Berjalan',
  'stop': 'Berhenti',
  'eat': 'Makan',
  'drink': 'Minum',
  'sleep': 'Tidur',
  'wake up': 'Bangun tidur',
  'stand': 'Berdiri',
  'sit': 'Duduk',
  'speak': 'Berbicara',
  'talk': 'Mengobrol / Berbicara',
  'say': 'Mengatakan',
  'tell': 'Memberitahu',
  'listen': 'Mendengarkan',
  'hear': 'Mendengar',
  'see': 'Melihat',
  'look': 'Melihat',
  'watch': 'Menonton / Mengamati',
  'read': 'Membaca',
  'write': 'Menulis',
  'buy': 'Membeli',
  'sell': 'Menjual',
  'pay': 'Membayar',
  'send': 'Mengirim',
  'receive': 'Menerima',
  'give': 'Memberikan',
  'take': 'Mengambil',
  'bring': 'Membawa',
  'carry': 'Mengangkut / Membawa',
  'hold': 'Memegang / Menggenggam',
  'drop': 'Menjatuhkan',
  'fall': 'Jatuh / Gugur',
  'rise': 'Terbit / Naik',
  'fly': 'Terbang',
  'swim': 'Berenang',
  'sing': 'Menyanyi',
  'dance': 'Menari',
  'play': 'Bermain',
  'work': 'Bekerja',
  'study': 'Belajar',
  'learn': 'Mempelajari',
  'teach': 'Mengajar',
  'know': 'Mengetahui / Mengenal',
  'understand': 'Memahami / Mengerti',
  'think': 'Berpikir',
  'remember': 'Mengingat',
  'forget': 'Melupakan',
  'find': 'Menemukan',
  'lose': 'Kehilangan / Kalah',
  'win': 'Menang',
  'help': 'Membantu',
  'save': 'Menyelamatkan / Menyimpan',
  'protect': 'Melindungi',
  'clean': 'Membersihkan',
  'wash': 'Mencuci',
  'cook': 'Memasak',
  'build': 'Membangun',
  'make': 'Membuat',
  'create': 'Menciptakan',
  'repair': 'Memperbaiki',
  'fix': 'Memperbaiki',
  'change': 'Mengubah / Berubah',
  'move': 'Bergerak / Berpindah',
  'live': 'Tinggal / Hidup',
  'die': 'Meninggal / Wafat',
  'grow': 'Tumbuh / Berkembang',
  'increase': 'Meningkat / Bertambah',
  'decrease': 'Menurun / Berkurang',
  'show': 'Menunjukkan',
  'hide': 'Menyembunyikan',
  'appear': 'Muncul',
  'disappear': 'Menghilang',
  'arrive': 'Tiba / Sampai',
  'depart': 'Berangkat',
  'enter': 'Masuk',
  'exit': 'Keluar',
  'pass': 'Melewati / Lolos',
  'cross': 'Menyeberang',
  'climb': 'Mendaki',
  'descend': 'Turun',
  'ride': 'Naik (kendaraan)',
  'drive': 'Mengemudi',
  'pull': 'Menarik',
  'push': 'Mendorong',
  'press': 'Menekan',
  'touch': 'Menyentuh',
  'point': 'Menunjuk',
  'call': 'Memanggil / Menelpon',
  'ask': 'Bertanya / Meminta',
  'answer': 'Menjawab',
  'reply': 'Membalas',
  'agree': 'Menyetujui',
  'disagree': 'Tidak setuju',
  'refuse': 'Menolak',
  'accept': 'Menerima',
  'allow': 'Mengizinkan',
  'forbid': 'Melarang',
  'promise': 'Berjanji',
  'choose': 'Memilih',
  'select': 'Memilih',
  'decide': 'Memutuskan',
  'wish': 'Berharap',
  'hope': 'Berharap',
  'want': 'Menginginkan',
  'like': 'Menyukai',
  'love': 'Mencintai',
  'hate': 'Membenci',
  'fear': 'Takut',
  'worry': 'Khawatir',
  'surprise': 'Mengejutkan',
  'doubt': 'Meragukan',
  'believe': 'Percaya',
  'trust': 'Mempercayai',
  'suspect': 'Mencurigai',
  'expect': 'Mengharapkan',
  'wait': 'Menunggu',
  'meet': 'Bertemu',
  'visit': 'Mengunjungi',
  'invite': 'Mengundang',
  'join': 'Bergabung / Ikut serta',
  'share': 'Berbagi',
  'borrow': 'Meminjam',
  'lend': 'Meminjamkan',
  'return': 'Mengembalikan / Kembali',
  'earn': 'Menghasilkan uang',
  'waste': 'Menyia-nyiakan',
  'invest': 'Berinvestasi',
  'manage': 'Mengelola / Mengatur',
  'control': 'Mengendalikan',
  'lead': 'Memimpin',
  'follow': 'Mengikuti',
  'support': 'Mendukung',
  'oppose': 'Menentang',
  'compete': 'Bersaing',
  'fight': 'Bertarung',
  'quarrel': 'Bertengkar',
  'argue': 'Berdebat',
  'discuss': 'Mendiskusikan',
  'explain': 'Menjelaskan',
  'describe': 'Menggambarkan',
  'introduce': 'Memperkenalkan',
  'express': 'Mengungkapkan',
  'report': 'Melaporkan',
  'announce': 'Mengumumkan',
  'publish': 'Menerbitkan',
  'broadcast': 'Menyiarkan',
  'record': 'Merekam / Mencatat',
  'measure': 'Mengukur',
  'count': 'Menghitung',
  'calculate': 'Mengkalkulasi / Menghitung',
  'estimate': 'Memperkirakan',
  'evaluate': 'Mengevaluasi',
  'judge': 'Menilai / Menghakimi',
  'compare': 'Membandingkan',
  'distinguish': 'Membedakan',
  'separate': 'Memisahkan',
  'connect': 'Menghubungkan',
  'combine': 'Menggabungkan',
  'mix': 'Mencampur',
  'divide': 'Membagi',
  'distribute': 'Mendistribusikan',
  'gather': 'Berkumpul',
  'scatter': 'Menyebarkan',
  'spread': 'Meluas / Menyebar',
  'cover': 'Menutupi',
  'wrap': 'Membungkus',
  'pack': 'Mengemas',
  'tie': 'Mengikat',
  'untie': 'Melepaskan ikatan',
  'destroy': 'Menghancurkan',
  'damage': 'Merusak',
  'ruin': 'Meruntuhkan',
  'hurt': 'Melukai / Menyakiti',
  'injure': 'Mencederai',
  'wound': 'Melukai',
  'kill': 'Membunuh',
  'cure': 'Menyembuhkan',
  'heal': 'Memulihkan / Sembuh',
  'treat': 'Merawat / Memperlakukan',
  'feed': 'Memberi makan',
  'plant': 'Menanam',
  'harvest': 'Memanen',
  'hunt': 'Berburu',
  'catch': 'Menangkap',
  'escape': 'Melarikan diri',
  'avoid': 'Menghindari',
  'prevent': 'Mencegah',
  'check': 'Memeriksa',
  'test': 'Menguji',
  'try': 'Mencoba',
  'attempt': 'Berusaha / Mencoba',
  'succeed': 'Berhasil / Sukses',
  'fail': 'Gagal',
  'practice': 'Berlatih',
  'train': 'Melatih',
  'exercise': 'Berolahraga',
  'relax': 'Bersantai',
  'rest': 'Beristirahat',
  'breathe': 'Bernapas',
  'cough': 'Batuk',
  'bleed': 'Berdarah',
  'sweat': 'Berkeringat',
  'tremble': 'Gemetar',
  'smile': 'Tersenyum',
  'laugh': 'Tertawa',
  'cry': 'Menangis',
  'shout': 'Berteriak',
  'whisper': 'Berbisik',
  'sigh': 'Menghela napas',
  'complain': 'Mengeluh',
  'praise': 'Memuji',
  'blame': 'Menyalahkan',
  'criticize': 'Mengkritik',
  'scold': 'Memarahi',
  'forgive': 'Memaafkan',
  'apologize': 'Meminta maaf',
  'thank': 'Berterima kasih',
  'greet': 'Menyapa',
  'bow': 'Membungkuk hormat',
  'marry': 'Menikah',
  'divorce': 'Bercerai',
  'dress up': 'Berdandan rapi',
  'put': 'Menaruh / Meletakkan',
  'set': 'Menyetel / Menetapkan',
  'get': 'Mendapatkan',
  'obtain': 'Memperoleh',
  'gain': 'Meraih',
  'win': 'Menang',
  'clothe': 'Mengenakan pakaian',
};

// ============================================================================
// 2. KAMUS PENERJEMAHAN KATA BENDA / KETERANGAN BAHASA INGGRIS MENTAH
// ============================================================================
const NOUN_ADJ_DICT: Record<string, string> = {
  'tomorrow': 'Besok',
  'the day before yesterday': 'Kemarin lusa',
  'the day after tomorrow': 'Besok lusa',
  'yesterday': 'Kemarin',
  'today': 'Hari ini',
  'today / this day': 'Hari ini',
  'this morning': 'Pagi ini',
  'tonight': 'Malam ini',
  'every day': 'Setiap hari',
  'every morning': 'Setiap pagi',
  'every night': 'Setiap malam',
  'every week': 'Setiap minggu',
  'every month': 'Setiap bulan',
  'every year': 'Setiap tahun',
  'one day': 'Satu hari / Suatu hari',
  'two days': 'Dua hari / Tanggal dua',
  'three days': 'Tiga hari / Tanggal tiga',
  'four days': 'Empat hari / Tanggal empat',
  'five days': 'Lima hari / Tanggal lima',
  'six days': 'Enam hari / Tanggal enam',
  'seven days': 'Tujuh hari / Tanggal tujuh',
  'eight days': 'Delapan hari / Tanggal delapan',
  'nine days': 'Sembilan hari / Tanggal sembilan',
  'ten days': 'Sepuluh hari / Tanggal sepuluh',
  'twenty days': 'Dua puluh hari / Tanggal dua puluh',
  'counter for people': 'Kata bantu bilangan orang',
  'counter for books': 'Kata bantu bilangan buku / jilid',
  'counter for ships': 'Kata bantu bilangan kapal',
  'counter for machines': 'Kata bantu bilangan mesin / kendaraan',
  'counter for flat things': 'Kata bantu bilangan lembar / benda tipis',
  'counter for small animals': 'Kata bantu bilangan hewan kecil',
  'counter for long cylindrical things': 'Kata bantu bilangan batang / silinder panjang',
  'counter for cups': 'Kata bantu bilangan cangkir / gelas',
  'counter for occurrences': 'Kata bantu bilangan frekuensi / kali',
  'counter for articles': 'Kata bantu bilangan benda',
  'at least': 'Setidaknya / Minimal',
  'point of view': 'Sudut pandang',
  'please / kindly / by all means': 'Silakan / Dengan senang hati',
  'new year': 'Tahun baru',
  'part-time job': 'Kerja paruh waktu (Arubaito)',
  'in a line / in a row': 'Berbaris / Sejajar',
  'at present / now': 'Saat ini / Sekarang',
  'late at night': 'Larut malam',
  'here and there': 'Di sana-sini / Tersebar',
  'year before last': 'Dua tahun lalu',
  'four seasons': 'Empat musim',
  'commuting to work': 'Berangkat kerja / Komuter',
  'exit and entrance': 'Pintu keluar-masuk',
  'anyhow / at any rate / anyway': 'Bagaimanapun juga / Pokoknya',
  'perhaps / maybe / by some chance': 'Mungkin / Barangkali',
  'scholar': 'Cendekiawan / Ilmuwan',
  'scholarship': 'Beasiswa / Studi ilmiah',
  'strife': 'Pertikaian',
  'dispute': 'Perselisihan / Sengketa',
  'riot': 'Kerusuhan',
  'rebellion': 'Pemberontakan',
  'difficulty': 'Kesulitan',
  'hardship': 'Kesusahan / Penderitaan',
  'hardships': 'Kesusahan / Penderitaan',
  'defect': 'Cacat / Kekurangan',
  'subject': 'Mata pelajaran / Subjek',
  'curriculum': 'Kurikulum',
  'course': 'Mata kuliah / Kursus',
  'learning': 'Pembelajaran',
  'science': 'Ilmu pengetahuan',
  'knowledge': 'Pengetahuan',
  'trouble': 'Masalah / Gangguan',
  'transitive verb': 'Kata kerja transitif',
  'intransitive verb': 'Kata kerja intransitif',
  'appearance': 'Penampilan / Pemuatan',
  'contrary': 'Sebaliknya / Bertolak belakang',
  'barely': 'Nyaris / Pas-pasan',
  'square': 'Persegi',
  'inspection': 'Pemeriksaan / Inspeksi',
  'browse': 'Meramban',
  'normal': 'Normal / Biasa',
  'usual': 'Biasa / Umum',
  'euphemistic': 'Penghalusan kata / Eufemisme',
  'indirect': 'Tidak langsung',
  'insinuating': 'Menyindir',
  'ticklish': 'Geli',
  'revolt': 'Pemberontakan',
  'uprising': 'Pemberontakan',
  'how / in what way': 'Bagaimana / Dengan cara apa',
  'time': 'Waktu / Kali',
  'out of ~': 'Dari ~ / Kehabisan ~',
  'made in ~': 'Buatan ~',
  'day': 'Hari',
  'have a nice day / see you': 'Selamat beraktivitas / Sampai jumpa',
  'sorry to have kept you waiting': 'Maaf telah membuat Anda menunggu',
  '(humble) to know': 'Mengetahui (ragam sopan kenjougo)',
};

// ============================================================================
// 3. KAMUS KANJI N2 & N1 (Bahasa Inggris Mentah -> Indonesia Baku)
// ============================================================================
const KANJI_DICT: Record<string, string> = {
  // N2 Kanji
  '並': 'Sejajar / Dan / Serta',
  '久': 'Lama / Tempo panjang',
  '介': 'Perantara / Menyela / Membantu',
  '仏': 'Buddha / Orang wafat',
  '個': 'Individu / Buah (benda)',
  '停': 'Berhenti / Singgah',
  '冊': 'Jilid / Buah (buku)',
  '再': 'Kembali / Mengulang / Kedua kali',
  '刷': 'Mencetak / Sapuan kuas',
  '券': 'Tiket / Kupon / Karcis',
  '割': 'Membagi / Memecahkan / Proporsi',
  '創': 'Menciptakan / Memulai karya',
  '副': 'Wakil / Sekunder / Tambahan',
  '劇': 'Drama / Teater / Hebat',
  '勤': 'Bekerja / Bertugas',
  '均': 'Rata / Seimbang / Proporsional',
  '婦': 'Wanita dewasa / Istri',
  '宇': 'Langit / Alam semesta',
  '宙': 'Ruang angkasa / Abadi',
  '宝': 'Harta karun / Berharga',
  '宣': 'Mengumumkan / Memproklamasikan',
  '尊': 'Terhormat / Mulia / Menghormati',
  '庁': 'Badan dinas / Kantor instansi',
  '底': 'Dasar / Bagian terbawah',
  '座': 'Tempat duduk / Konstelasi bintang',
  '延': 'Memperpanjang / Menunda',
  '弁': 'Berbicara / Dialek / Katup',
  '張': 'Meregangkan / Menempelkan',
  '従': 'Mengikuti / Menaati / Sekunder',
  '徳': 'Kebajikan / Moral luhur',
  '志': 'Aspirasi / Cita-cita luhur',
  '応': 'Merespons / Menyesuaikan diri',
  '快': 'Menyenangkan / Ceria / Nyaman',
  '性': 'Sifat / Karakter / Gender',
  '恩': 'Budi kebaikan / Rahmat',
  '態': 'Sikap / Kondisi / Keadaan',
  '慣': 'Terbiasa / Adat kebiasaan',
  '承': 'Menerima / Menyetujui / Mendengar',
  '技': 'Keterampilan / Teknik',
  '招': 'Mengundang / Memanggil',
  '授': 'Memberikan / Mengajarkan',
  '採': 'Mengambil / Memilih / Mengadopsi',
  '接': 'Menghubungkan / Kontak / Menyentuh',
  '提': 'Mengajukan / Mengangkat proposal',
  '換': 'Menukar / Mengganti',
  '敬': 'Hormat / Menghormati',
  '整': 'Merapikan / Mengatur susunan',
  '旧': 'Lama / Kuno / Terdahulu',
  '昇': 'Naik / Terbit / Promosi jabatan',
  '暴': 'Kekerasan / Mengamuk / Membuka kedok',
  '条': 'Pasal / Aturan / Garis setrip',
  '査': 'Memeriksa / Meneliti data',
  '柱': 'Pilar / Tiang penyangga',
  '構': 'Struktur / Membangun susunan',
  '武': 'Militer / Kesatria / Bela diri',
  '殿': 'Istana / Tuan / Yang terhormat',
  '毒': 'Racun / Zat beracun',
  '比': 'Membandingkan / Rasio perbandingan',
  '永': 'Abadi / Kekal selamanya',
  '減': 'Berkurang / Mengurangi',
  '測': 'Mengukur kedalaman/panjang',
  '準': 'Standar / Semi / Setara',
  '演': 'Pertunjukan / Memainkan peran / Pidato',
  '点': 'Titik / Nilai poin / Menyalakan',
  '照': 'Menyinari / Mencocokkan data',
  '犯': 'Melakukan kejahatan / Penjahat',
  '状': 'Keadaan / Surat resmi',
  '現': 'Muncul / Nyata / Sekarang',
  '略': 'Ringkasan / Singkatan / Mengabaikan',
  '疑': 'Ragu / Mencurigai',
  '痛': 'Sakit / Nyeri pedih',
  '皇': 'Kaisar',
  '看': 'Melihat / Mengawasi / Merawat pasien',
  '省': 'Kementerian dinas / Introspeksi / Menyingkat',
  '破': 'Robek / Menghancurkan / Merusak janji',
  '神': 'Tuhan / Dewa / Roh suci',
  '禁': 'Larangan / Terlarang',
  '福': 'Keberuntungan / Kebahagiaan',
  '秀': 'Unggul / Cemerlang / Istimewa',
  '私': 'Saya / Pribadi',
  '税': 'Pajak retribusi',
  '節': 'Sendi / Musim / Penghematan',
  '簡': 'Sederhana / Ringkas',
  '給': 'Gaji upah / Memberikan suplai',
  '統': 'Menyatukan / Memerintah / Sistematis',
  '絶': 'Putus / Absolut / Punah',
  '績': 'Pencapaian / Prestasi kerja',
  '織': 'Menenun / Merajut kain',
  '罪': 'Dosa / Kejahatan hukum',
  '置': 'Meletakkan / Menempatkan posisi',
  '署': 'Kantor pos dinas / Menandatangani',
  '義': 'Keadilan moral / Makna / Semu',
  '能': 'Kemampuan / Bakat / Seni Noh',
  '航': 'Pelayaran / Penerbangan navigasi',
  '良': 'Bagus / Baik',
  '若': 'Muda / Belia',
  '苦': 'Pahit / Derita / Kesusahan',
  '英': 'Unggul cemerlang / Inggris',
  '表': 'Tabel / Permukaan luar / Mengekspresikan',
  '装': 'Mengenakan busana / Perlengkapan',
  '裏': 'Bagian belakang / Sisi dalam / Tersembunyi',
  '補': 'Melengkapi / Menambal kekurangan',
  '複': 'Ganda / Jamak / Kompleks',
  '製': 'Membuat / Memproduksi manufaktur',
  '規': 'Aturan / Regulasi standar',
  '解': 'Memecahkan solusi / Memahami / Mengurai',
  '記': 'Mencatat / Rekaman berita',
  '設': 'Mendirikan fasilitas / Menyiapkan rencana',
  '訪': 'Mengunjungi / Bertamu',
  '証': 'Bukti / Sertifikat resmi',
  '評': 'Menilai / Memberi kritik evaluasi',
  '識': 'Pengetahuan wawasan / Mengenali',
  '警': 'Waspada / Polisi / Peringatan bahaya',
  '議': 'Musyawarah perundingan / Majelis parlemen',
  '豊': 'Melimpah ruah / Subur makmur',
  '資': 'Sumber daya / Modal aset',
  '賛': 'Menyetujui / Memuji dukungan',
  '輪': 'Roda / Lingkaran cincin',
  '適': 'Cocok / Tepat pantas',
  '酸': 'Asam / Senyawa asam',
  '録': 'Merekam / Mencatat arsip',
  '限': 'Batasan limit / Membatasi',
  '除': 'Menghilangkan / Menyingkirkan / Membagi',
  '難': 'Sulit sukar / Bencana malapetaka',
  '領': 'Wilayah teritori / Memimpin',
  '余': 'Sisa kelebihan / Berlebih',

  // N1 Kanji
  '丼': 'Mangkuk / Semangkuk nasi lauk',
  '乙': 'Kedua / Salinan / Aneh unik',
  '乞': 'Memohon / Meminta / Mengemis',
  '亀': 'Kura-kura / Penyu',
  '仕': 'Melayani / Bekerja resmi',
  '以': 'Dengan cara / Karena / Mulai dari',
  '何': 'Apa / Berapa',
  '併': 'Menggabungkan / Menyatukan bersama',
  '侵': 'Menyerang / Merambah / Menginvasi',
  '俗': 'Umum / Adat istiadat / Vulgar',
  '偉': 'Hebat / Agung / Megah',
  '傘': 'Payung',
  '傑': 'Unggul / Hebat / Luar biasa',
  '催': 'Menyelenggarakan / Mengadakan acara',
  '党': 'Partai politik / Golongan fraksi',
  '刺': 'Menusuk / Duri / Menikam',
  '剣': 'Pedang bilah panjang',
  '刻': 'Mengukir / Menggores / Mengiris',
  '卓': 'Meja / Terkemuka unggul',
  '占': 'Menduduki / Meramal nasib',
  '卑': 'Hina / Rendah diri / Licik',
  '博': 'Luas berilmu / Ekshibisi pameran',
  '吟': 'Melantunkan syair / Meratapi lagu',
  '哨': 'Pos penjagaan / Mengintai patroli',
  '嗅': 'Mencium bau / Mengendus',
  '喝': 'Membentak / Berteriak lantang',
  '埼': 'Tanjung daratan',
  '塚': 'Gundukan tanah / Makam pusara',
  '堤': 'Tanggul pembatas air',
  '塔': 'Menara / Pagoda',
  '墨': 'Tinta hitam kaligrafi',
  '壁': 'Dinding tembok rintangan',
  '壇': 'Mimbar podium / Panggung kehormatan',
  '契': 'Perjanjian ikatan / Sumpah setia',
  '奨': 'Mendorong motivasi / Menganjurkan',
  '妃': 'Permaisuri / Ratu istri pangeran',
  '妥': 'Tepat kompromi / Damai rukun',
  '孤': 'Yatim piatu / Kesepian terisolasi',
  '寮': 'Asrama pondokan',
  '尋': 'Menanyakan / Mencari jejak',
  '射': 'Menembak / Memancarkan sinar',
  '屑': 'Sampah remahan / Sisa potongan',
  '屯': 'Garnisun pos militer',
  '巡': 'Berkeliling patroli / Ziarah',
  '帳': 'Buku catatan / Tirai pembatas',
  '幌': 'Tenda terpal penutup kereta',
  '幣': 'Uang kertas mata uang / Persembahan',
  '庇': 'Melindungi naungan / Atap kanopi',
  '廓': 'Benteng pertahanan / Kawasan lokalisasi',
  '彗': 'Komet bintang berekor',
  '弦': 'Senar dawai alat musik / Tali busur',
  '弧': 'Busur panah / Lengkungan busur',
  '弊': 'Keburukan dampak negatif / Rendah hati',
  '忌': 'Berkabung duka / Pantangan tabu',
  '慄': 'Menggigil ketakutan / Gemetar ngeri',
  '惑': 'Bingung gamang / Terpesona',
  '截': 'Memotong memenggal / Mengiris',
  '扁': 'Pipih rata / Papan nama gantung',
  '挑': 'Menantang / Memancing provokasi',
  '拙': 'Canggung / Tidak mahir / Buruk karya',
  '挽': 'Menarik / Menggiling / Memulihkan keadaan',
  '据': 'Memasang fondasi / Menetapkan posisi',
  '捷': 'Kemenangan kilat / Cepat tanggap',
  '掌': 'Telapak tangan / Mengendalikan wewenang',
  '擯': 'Menolak mentah-mentah / Menyingkirkan',
  '擬': 'Meniru / Menyerupai tiruan',
  '斑': 'Bintik totol / Belang bercak',
  '斗': 'Gayung / Satuan takaran to (18L)',
  '旭': 'Matahari terbit fajar',
  '旺': 'Bersemangat menggelora / Prima gairah',
  '昂': 'Membubung tinggi / Bersemangat meluap',
  '昏': 'Gelap senja / Pingsan mengabur',
  '易': 'Mudah gampang / Meramal peruntungan',
  '晋': 'Maju berkembang / Dinasti Jin',
  '晦': 'Gelap remang / Hari terakhir bulan',
  '晶': 'Kristal berkilau / Bersih jernih',
  '智': 'Kebijaksanaan kecerdasan luhur',
  '暮': 'Senja hari / Menjalani kehidupan',
  '暴': 'Kekerasan mengamuk / Membuka kedok',
  '曇': 'Berawan mendung',
  '曹': 'Kolega pejabat / Kopral pangkat',
  '朔': 'Awal bulan baru / Utara dingin',
  '朕': 'Kami (sebutan resmi kaisar)',
  '梁': 'Balok jembatan / Penyangga kasau',
  '梵': 'Brahma / Sanskerta India',
  '棋': 'Permainan catur shogi / Papan bidak',
  '棺': 'Peti mati jenazah',
  '棍': 'Tongkat pemukul pentungan',
  '槍': 'Tombak senjata tajam',
  '概': 'Garis besar / Gambaran umum',
  '槽': 'Bak penampungan / Tangki cairan',
  '歓': 'Sukacita gembira ria',
  '殖': 'Berkembang biak / Melipatgandakan aset',
  '毅': 'Tegar berani / Keteguhan berprinsip',
  '毬': 'Bola wol bulu / Buah berduri',
  '汐': 'Pasang surut air laut malam',
  '沌': 'Kekacauan tanpa bentuk / Keruh',
  '泰': 'Tenang damai sentosa / Megah agung',
  '浚': 'Mengeruk lumpur / Memperdalam dasar',
  '浩': 'Luas membentang / Lapang dada',
  '淀': 'Air menggenang tenang / Terhenti',
  '渚': 'Tepi pantai landai pesisir',
  '涵': 'Memupuk menyerap / Menenggelamkan',
  '涸': 'Mengering tandus habis',
  '涼': 'Sejuk nyaman angin',
  '淑': 'Anggun santun berbudi luhur',
  '淡': 'Hambar tipis / Ringan samar',
  '深': 'Dalam mendalam / Pekat',
  '混': 'Bercampur campur aduk',
  '渣': 'Ampas endapan sisa',
  '滋': 'Gizi nutrisi penambah tenaga',
  '滅': 'Musnah padam / Kehancuran',
  '滴': 'Tetesan cairan / Menetes',
  '潮': 'Pasang surut laut / Gelombang arus',
  '濫': 'Meluap banjir / Berlebihan tanpa kendali',
  '炉': 'Tungku peleburan perapian',
  '灼': 'Membara panas membakar',
  '烹': 'Memasak merebus hidangan',
  '煽': 'Menghasut mengipas kobaran api',
  '爵': 'Gelar bangsawan ningrat',
  '牌': 'Ubin mahjong / Plakat papan',
  '牽': 'Menarik memandu / Menahan laju',
  '猟': 'Berburu binatang mangsa',
  '猾': 'Licik penuh muslihat',
  '玩': 'Mempermainkan mainan / Menikmati hobi',
  '珀': 'Batu ambar damar permata',
  '珈': 'Perhiasan tusuk konde',
  '琲': 'Untaian manik-manik permata',
  '球': 'Bola bundar bola dunia',
  '瑠': 'Batu permata lapis lazuli',
  '璃': 'Batu mulia kaca bening',
  '瓦': 'Genteng atap tanah liat',
  '甜': 'Manis sedap aroma',
  '甚': 'Sangat luar biasa dahsyat',
  '疵': 'Cacat noda / Luka goresan',
  '疾': 'Penyakit mendadak / Cepat kilat',
  '痘': 'Penyakit cacar',
  '瘠': 'Kurus kering / Lahan tandus gersang',
  '癌': 'Kanker tumor ganas',
  '癒': 'Sembuh pulih dari luka batin',
  '癖': 'Kebiasaan unik / Tabiat aneh',
  '皓': 'Putih bersih cemerlang',
  '皺': 'Kerutan keriput kulit',
  '皿': 'Piring wadah saji',
  '盃': 'Cawan gelas arak sake',
  '盲': 'Tunanetra buta / Membabi buta',
  '盾': 'Perisai pelindung tameng',
  '眩': 'Pusing berkunang-kunang / Silau',
  '眸': 'Biji mata pupil pandangan',
  '瞰': 'Memandang dari ketinggian / Tinjauan',
  '瞳': 'Pupil biji mata pupil',
  '睫': 'Bulu mata pelindung',
  '砒': 'Racun arsenik arsenikum',
  '砲': 'Meriam senjata artileri',
  '碌': 'Berguna bernilai / Rata datar',
  '碑': 'Prasasti monumen batu penanda',
  '磯': 'Batu karang pesisir pantai',
  '禧': 'Kegembiraan rezeki berkat',
  '禹': 'Raja Yu agung pendiri dinasti',
  '禽': 'Unggas burung peliharaan',
  '禾': 'Padi bulir gandum tanaman',
  '私': 'Saya pribadi',
  '秤': 'Timbangan neraca ukur',
  '稽': 'Berlatih meneliti / Menunduk hormat',
  '突': 'Menusuk menabrak / Tiba-tiba',
  '穹': 'Kubah langit melengkung',
  '窟': 'Gua lubang sarang persembunyian',
  '窄': 'Menyempit sempit merapat',
  '箪': 'Kotak keranjang bambu lemari',
  '篇': 'Bab jilid karya buku puisi',
  '粥': 'Bubur nasi encer',
  '糊': 'Lem pasta perekat kanji',
  '粕': 'Ampas dregs sisa perasan',
  '糖': 'Gula manis karbohidrat',
  '系': 'Silsilah garis keturunan / Sistem keluarga',
  '紮': 'Mengikat membungkus kencang',
  '絋': 'Kapas sutra katun halus',
  '絢': 'Kecemerlangan corak warna megah',
  '絽': 'Kain sutra tipis tenun kasa',
  '綺': 'Keindahan elok kain sutra',
  '綻': 'Jahitan robek terbuka / Tersenyum',
  '綴': 'Menjahit menjilid naskah / Mengeja kata',
  '緬': 'Jauh terpencil membentang / Myanmar',
  '縞': 'Corak garis-garis loreng',
  '缶': 'Kaleng drum wadah logam',
  '羚': 'Kambing antelop kijang gunung',
  '羞': 'Rasa malu tersipu / Canggung',
  '翔': 'Terbang membubung tinggi melayang',
  '翠': 'Hijau zamrud giok / Burung raja udang',
  '耽': 'Asyik tenggelam terlena kenikmatan',
  '耶': 'Apakah pertanyaan partikel',
  '肖': 'Menyerupai mirip potret',
  '肯': 'Menyetujui mengangguk sepakat',
  '胎': 'Janin kandungan rahim',
  '胞': 'Sel tubuh kantung ketuban',
  '脈': 'Denyut nadi pembuluh / Aliran silsilah',
  '脛': 'Tulang kering betis kaki',
  '膏': 'Lemak salep minyak obat oles',
  '膜': 'Selaput membran tipis pelindung',
  '臆': 'Dada isi hati / Pengecut ragu',
  '臍': 'Pusar perut titik tengah',
  '膿': 'Nanah cairan infeksi luka',
  '臀': 'Pantat bokong bagian belakang',
  '臣': 'Menteri abdi pejabat kerajaan',
  '臼': 'Lesung lumpang penumbuk padi',
  '艇': 'Perahu kecil sekoci motor',
  '芒': 'Ujung duri bulir rumput pampas',
  '芙': 'Bunga teratai lotus suci',
  '芥': 'Biji sesawi sampah debu sepele',
  '芹': 'Sayur seledri air Jepang',
  '芭': 'Pohon pisang tanaman herba',
  '苑': 'Kebun taman asri padang rumput',
  '苔': 'Lumut tanaman lumut hijau',
  '苺': 'Buah stroberi merah manis',
  '茉': 'Bunga melati putih harum',
  '茸': 'Jamur tanaman jamur payung',
  '茹': 'Merebus sayuran / Memasak empuk',
  '荊': 'Semak berduri rintangan',
  '茜': 'Tanaman madder merah jingga',
  '莞': 'Tersenyum ramah / Tanaman rumput mendong',
  '菰': 'Tikar rumput purun / Padi liar',
  '菊': 'Bunga krisan seruni lambang kaisar',
  '菖': 'Tanaman iris air bendera manis',
  '萄': 'Buah anggur merambat',
  '葭': 'Tanaman alang-alang buluh rawa',
  '萱': 'Rumput ilalang atap jerami',
  '落': 'Jatuh gugur / Gagal ujian',
  '葛': 'Tanaman merambat kudzu / Perselisihan',
  '葵': 'Bunga hollyhock mallow malva',
  '蒔': 'Menabur benih tanaman / Pernis makie emas',
  '蓉': 'Bunga teratai kembang sepatu',
  '蓬': 'Tanaman moxa apsintus mugwort',
  '蔓': 'Sulur tanaman merambat meluas',
  '蕎': 'Gandum soba mi soba',
  '蕨': 'Tanaman pakis paku-pakuan',
  '蕉': 'Pohon pisang daun lebar',
  '蕗': 'Tanaman fuki coltsfoot Jepang',
  '薯': 'Ubi kentang tanaman umbi',
  '薇': 'Pakis osmund pakis liar gunung',
  '薔': 'Bunga mawar berduri mekar',
  '薇': 'Bunga mawar harum wangi',
  '藁': 'Jerami padi tangkai kering',
  '藍': 'Nila tanaman nila biru indigo',
  '藤': 'Bunga wisteria ungu merambat',
  '藜': 'Tanaman bayam liar goosefoot',
  '繭': 'Kepompong ulat sutra benang',
  '虹': 'Pelangi warna-warni lengkung',
  '蚊': 'Nyamuk serangga penghisap darah',
  '蚯': 'Cacing tanah pengurai tanah',
  '蚓': 'Cacing tanah melingkar tanah',
  '蛙': 'Katak kodok melompat air',
  '蛸': 'Gurita moluska berlengan delapan',
  '蜂': 'Lebah madu tawon penyengat',
  '蛾': 'Ngengat kupu-kupu malam',
  '蝉': 'Tonggeret serangga musim panas cicada',
  '螂': 'Belalang sembah kecoak serangga',
  '蝶': 'Kupu-kupu elok bersayap indah',
  '蝙': 'Kelelawar mamalia terbang malam',
  '蝠': 'Kelelawar pembawa berkah malam',
  '螺': 'Siput keong spiral cangkang',
  '蟷': 'Belalang sembah pemangsa',
  '蟻': 'Semut serangga pekerja rajin',
  '蠅': 'Lalat serangga pembawa kuman',
  '蟹': 'Kepiting bercapit air laut',
  '蠣': 'Tiram kerang mutiara laut',
  '血': 'Darah sirkulasi darah merah',
  '袖': 'Lengan baju busana pakaian',
  '袴': 'Celana tradisional hakama Jepang',
  '裾': 'Ujung kelim bawah baju gaun',
  '襖': 'Pintu geser fusuma kertas kain',
  '襷': 'Tali selempang tasuki lengan baju',
  '覇': 'Kejayaan dominasi kekuasaan juara',
  '覗': 'Mengintip melihat dari celah',
  '角': 'Sudut pojok / Tanduk hewan',
  '觴': 'Cawan gelas piala arak anggur',
  '詞': 'Kata lirik syair puisi istilah',
  '註': 'Catatan kaki penjelasan anotasi',
  '評': 'Menilai kritik evaluasi ulasan',
  '詼': 'Candaan jenaka humor sindiran',
  '誹': 'Menghina menjelek-jelekkan fitnah',
  '諡': 'Gelar anumerta nama kehormatan wafat',
  '謗': 'Memfitnah mencemarkan nama buruk',
  '谷': 'Lembah ngarai celah bukit',
  '豹': 'Macan tutul hewan pemangsa leopard',
  '貂': 'Musang cerpelai hewan bulu marten',
  '貝': 'Kerang cangkang kerang laut',
  '貫': 'Menembus menembus / Satuan kan (~3.75kg)',
  '貴': 'Mulia berharga bernilai tinggi',
  '貌': 'Raut wajah rupa paras penampilan',
  '貪': 'Tamak serakah haus nafsu',
  '賊': 'Pemberontak perampok bajak laut',
  '賑': 'Ramai meriah padat pengunjung',
  '贅': 'Kemewahan pemborosan berlebihan',
  '赫': 'Merah membara menyala terang',
  '跨': 'Melangkahi menunggangi kedua kaki',
  '跪': 'Berlutut menyembah sujud hormat',
  '踵': 'Tumit kaki bagian belakang',
  '蹴': 'Menendang mendepak dengan kaki',
  '躍': 'Melompat melonjak maju gembira',
  '躑': 'Ragu-ragu tertegun bimbang langkah',
  '躅': 'Menapak tertegun menjejak kaki',
  '身': 'Tubuh badan diri sendiri',
  '躯': 'Tubuh raga jasad jenazah',
  '車': 'Mobil kendaraan beroda pedati',
  '軸': 'Poros as roda sumbu perputaran',
  '軒': 'Bubungan atap / Satuan rumah',
  '輯': 'Menyusun mengedit mengumpulkan naskah',
  '轡': 'Kekang tali kendali mulut kuda',
  '辣': 'Pedas menyengat / Keras pedas teguran',
  '辰': 'Naga zodiak lambang waktu pagi',
  '辱': 'Mempermalukan aib noda hinaan',
  '辟': 'Menyingkir menghindar / Hukum pidana',
  '迅': 'Cepat kilat tanggap gesit',
  '追': 'Mengejar memburu / Menambahkan',
  '途': 'Jalan lintasan / Di tengah perjalanan',
  '週': 'Minggu pekan tujuh hari',
  '遯': 'Melarikan diri menghindar duniawi',
  '郁': 'Harum semerbak / Anggun berbudaya',
  '郵': 'Pos surat pengiriman dinas',
  '鄙': 'Desa terpencil pedalaman udik',
  '酉': 'Ayam jantan zodiak / Arak sake',
  '酋': 'Kepala suku pemimpin adat rimba',
  '酌': 'Menuangkan arak sake cawan',
  '酥': 'Mentega olahan susu kental lezat',
  '酪': 'Olahan susu keju produk susu',
  '酬': 'Imbalan hadiah upah jerih payah',
  '醒': 'Terbangun sadar dari tidur pingsan',
  '醗': 'Meragi memfermentasi ragi arak',
  '酵': 'Ragi fermentasi biakan ragi',
  '酷': 'Kejam berat menyengsarakan',
  '酸': 'Asam rasa asam senyawa asam',
  '采': 'Memilih mengambil dadu rupa',
  '釉': 'Lapisan glasir keramik porselen',
  '釘': 'Paku pasak paku besi',
  '針': 'Jarum penunjuk jam jahit',
  '釦': 'Kancing baju penutup pakaian',
  '釧': 'Gelang tangan ornamen perhiasan',
  '鈎': 'Kail pancing kait besi',
  '鋏': 'Gunting pemotong penjepit kuku',
  '鑓': 'Tombak senjata lempar prajurit',
  '長': 'Panjang / Lama / Pemimpin atasan',
  '門': 'Gerbang pintu masuk gapura',
  '閃': 'Kilatan kilau sekejap cahaya',
  '閨': 'Kamar tidur wanita bilik peraduan',
  '闊': 'Luas lapang lega pandangan',
  '関': 'Gerbang pembatas / Terkait relasi',
  '閾': 'Ambang batas pintu threshold',
  '防': 'Mencegah membendung pertahanan',
  '降': 'Turun mengendap / Turun hujan',
  '隙': 'Celah retakan waktu luang lowong',
  '障': 'Merintangi menghalangi batas sekat',
  '雁': 'Angsa liar burung angsa migran',
  '雄': 'Jantan gagah perkasa unggul',
  '雌': 'Betina hewan betina permaisuri',
  '雕': 'Burung elang rajawali pemangsa',
  '雪': 'Salju butiran salju putih dingin',
  '雫': 'Tetesan embun air mata embun',
  '霞': 'Kabut tipis senja halimun',
  '露': 'Embun pagi / Terbuka menampakkan',
  '霸': 'Kejayaan dominasi kekuasaan kampiun',
  '靂': 'Petir halilintar menggelegar',
  '靴': 'Sepatu alas kaki kulit',
  '鞍': 'Pelana pelana punggung kuda',
  '鞘': 'Sarung pedang bilah pelindung',
  '鞠': 'Bola kulit bola sepak kuno',
  '鞭': 'Cambuk pecut cemeti kuda',
  '韻': 'Rima sajak nada irama puisi',
  '頭': 'Kepala atasan kepala bagian',
  '頬': 'Pipi wajah samping',
  '顎': 'Dagu rahang bawah mulut',
  '首': 'Leher kepala pemimpin teras',
  '髷': 'Sanggul konde rambut tradisional',
  '髭': 'Kumis jenggot rambut wajah',
  '髯': 'Jambang janggut lebat samping',
  '鬢': 'Pelipis rambut cambang sisi',
  '鬼': 'Iblis raksasa oni roh jahat',
  '魄': 'Jiwa raga kekuatan semangat batin',
  '魅': 'Memikat mempesona daya tarik',
  '魔': 'Iblis sihir setan magis',
  '魚': 'Ikan hewan air tawar laut',
  '鮑': 'Kerang abalon kerang mewah laut',
  '鮟': 'Ikan pemancing monkfish laut',
  '鱇': 'Ikan angler monkfish dasar laut',
  '鳥': 'Burung unggas bersayap terbang',
  '鳩': 'Burung merpati dara perdamaian',
  '鳳': 'Burung feniks jantan mitologi',
  '凰': 'Burung feniks betina keagungan',
  '鵠': 'Angsa putih bersih sasaran bidik',
  '鵜': 'Burung kormoran penangkap ikan',
  '鵡': 'Burung kakatua nuri beo',
  '鵲': 'Burung murai burung magpie pembawa kabar',
  '鹿': 'Rusa kijang hewan bertanduk',
  '麦': 'Gandum jelai serealia ladang',
  '黄': 'Kuning warna kuning cerah',
  '黍': 'Biji jawawut millet serealia',
  '黎': 'Fajar gelap / Rakyat jelata banyak',
  '黒': 'Hitam warna gelap malam',
  '黛': 'Tinta alis penghias mata wanita',
  '鼎': 'Kuali berkaki tiga bejana perunggu',
  '鼓': 'Gendang bedug tabuh musik tsuzumi',
  '鼠': 'Tikus hewan pengerat mamalia',
  '鼻': 'Hidung indra penciuman napas',
  '齷': 'Sempit picik / Terjepit cemas',
  '齪': 'Cemas gelisah / Bekerja keras sempit',
  '龍': 'Naga mitologi agung sakti perkasa',
};

// ============================================================================
// 4. TEMPLATE CONTOH KALIMAT BERVARIASI (PENGGANTI "Dalam masyarakat nyata...")
// ============================================================================
interface SentenceTemplate {
  jp: (word: string) => string;
  furigana: (furigana: string) => string;
  id: (meaning: string) => string;
}

const NOUN_TEMPLATES: SentenceTemplate[] = [
  {
    jp: (w) => `日々の生活で${w}を大切にしている。`,
    furigana: (f) => `ひびのせいかつで${f}をたいせつにしている。`,
    id: (m) => `Menghargai ${m} dalam kehidupan sehari-hari.`,
  },
  {
    jp: (w) => `今回の会議で${w}についての議論が行われた。`,
    furigana: (f) => `こんかいのかいぎで${f}についてのぎろんがおこなわれた。`,
    id: (m) => `Diskusi mengenai ${m} dilakukan dalam rapat kali ini.`,
  },
  {
    jp: (w) => `先生から${w}に関する詳しい説明を受けた。`,
    furigana: (f) => `せんせいから${f}にかんするくわしいせつめいをうけた。`,
    id: (m) => `Mendapatkan penjelasan rinci mengenai ${m} dari guru.`,
  },
  {
    jp: (w) => `将来のために${w}を深く学んでいる。`,
    furigana: (f) => `しょうらいのために${f}をふかくまなんでいる。`,
    id: (m) => `Mempelajari ${m} secara mendalam demi masa depan.`,
  },
  {
    jp: (w) => `仕事で${w}を活用して成果を上げた。`,
    furigana: (f) => `しごとで${f}をかつようしてせいかをあげた。`,
    id: (m) => `Memanfaatkan ${m} dalam pekerjaan dan meraih hasil baik.`,
  },
  {
    jp: (w) => `専門家が${w}の重要性について指摘した。`,
    furigana: (f) => `せんもんかが${f}のじゅうようせいについてしてきした。`,
    id: (m) => `Pakar menekankan pentingnya ${m}.`,
  },
  {
    jp: (w) => `この本を読んで${w}の基礎を理解した。`,
    furigana: (f) => `このほんをよんで${f}のきそをりかいした。`,
    id: (m) => `Memahami dasar-dasar ${m} setelah membaca buku ini.`,
  },
  {
    jp: (w) => `周囲と協力しながら${w}に取り組んでいる。`,
    furigana: (f) => `しゅういときょうりょくしながら${f}にとりくんでいる。`,
    id: (m) => `Mengerjakan ${m} sambil bekerja sama dengan orang sekitar.`,
  },
];

const VERB_TEMPLATES: SentenceTemplate[] = [
  {
    jp: (w) => `準備をしっかりしてから${w}予定です。`,
    furigana: (f) => `じゅんびをしっかりしてから${f}よていです。`,
    id: (m) => `Berencana ${m} setelah melakukan persiapan dengan matang.`,
  },
  {
    jp: (w) => `毎日コツコツと${w}ことが上達の秘訣だ。`,
    furigana: (f) => `まいにちコツコツと${f}ことがじょうたつのひけつだ。`,
    id: (m) => `Rutin ${m} setiap hari adalah kunci kemajuan.`,
  },
  {
    jp: (w) => `焦らずに落ち着いて${w}ようにしている。`,
    furigana: (f) => `あせらずにおちついて${f}ようにしている。`,
    id: (m) => `Berusaha untuk ${m} dengan tenang tanpa tergesa-gesa.`,
  },
  {
    jp: (w) => `周囲の状況をよく確かめてから${w}べきだ。`,
    furigana: (f) => `しゅういのじょうきょうをよくたしかめてから${f}べきだ。`,
    id: (m) => `Sebaiknya ${m} setelah memastikan situasi sekitar dengan baik.`,
  },
];

const ADJ_TEMPLATES: SentenceTemplate[] = [
  {
    jp: (w) => `とても${w}印象を周囲に与えている。`,
    furigana: (f) => `とても${f}いんしょうをしゅういにあたえている。`,
    id: (m) => `Memberikan kesan yang sangat ${m} kepada orang-orang di sekitar.`,
  },
  {
    jp: (w) => `思ったよりも${w}結果に驚いた。`,
    furigana: (f) => `おもったよりも${f}けっかにおどろいた。`,
    id: (m) => `Terkejut dengan hasil yang ternyata lebih ${m} daripada perkiraan.`,
  },
  {
    jp: (w) => `いつも${w}態度で人と接することが大切だ。`,
    furigana: (f) => `いつも${f}たいどでひととせっすることがたいせつだ。`,
    id: (m) => `Penting untuk memperlakukan orang lain dengan sikap yang selalu ${m}.`,
  },
  {
    jp: (w) => `状況に応じて${w}判断を下す必要がある。`,
    furigana: (f) => `じょうきょうにおうじて${f}はんだんをくだすひつようがある。`,
    id: (m) => `Perlu mengambil keputusan yang ${m} sesuai dengan situasi.`,
  },
];

// Helper hash string ke integer stabil
function hashString(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Menerjemahkan frasa 'melakukan + english' atau kata bahasa Inggris ke Bahasa Indonesia baku
 */
export function cleanMeaningString(meaningId: string): string {
  let text = meaningId.trim();

  // 1. Cek langsung di kamus NOUN_ADJ_DICT (case-insensitive)
  const lowerText = text.toLowerCase();
  if (NOUN_ADJ_DICT[lowerText]) {
    return NOUN_ADJ_DICT[lowerText];
  }

  // 2. Bersihkan pola melakukan + english
  // Gantikan setiap segmen yang dipisah slash
  const segments = text.split('/').map(s => s.trim());
  const cleanedSegments: string[] = [];

  for (const seg of segments) {
    let s = seg;
    // Cek kamus noun langsung
    if (NOUN_ADJ_DICT[s.toLowerCase()]) {
      cleanedSegments.push(NOUN_ADJ_DICT[s.toLowerCase()]);
      continue;
    }

    if (s.startsWith('melakukan ')) {
      const engVerb = s.replace(/^melakukan\s+/, '').trim().toLowerCase();
      // Bersihkan to / a / an
      const cleanVerb = engVerb.replace(/^(to|a|an)\s+/, '').trim();

      if (VERB_DICT[cleanVerb]) {
        cleanedSegments.push(VERB_DICT[cleanVerb]);
        continue;
      }

      // Cek kata pertama jika frasa verba (misal 'spend time pleasantly' -> spend)
      const firstWord = cleanVerb.split(/\s+/)[0];
      if (VERB_DICT[firstWord]) {
        // Ambil terjemahan kata kerja pertama
        const transFirst = VERB_DICT[firstWord].split('/')[0].trim();
        const restWords = cleanVerb.slice(firstWord.length).trim();
        if (restWords) {
          cleanedSegments.push(`${transFirst} (${restWords})`);
        } else {
          cleanedSegments.push(VERB_DICT[firstWord]);
        }
        continue;
      }

      // Jika diawali 'be '
      if (cleanVerb.startsWith('be ')) {
        const beTarget = cleanVerb.replace(/^be\s+/, '').trim();
        if (VERB_DICT[beTarget]) {
          cleanedSegments.push(`Di${VERB_DICT[beTarget].toLowerCase().replace(/^me(ng|n|m)?/, '')}`);
          continue;
        }
        cleanedSegments.push(`Menjadi ${beTarget}`);
        continue;
      }

      // Fallback: hapus kata 'melakukan' jika kata kerja berakhiran kan/i
      cleanedSegments.push(cleanVerb.charAt(0).toUpperCase() + cleanVerb.slice(1));
    } else {
      // Jika kata bahasa inggris biasa tanpa 'melakukan'
      const lower = s.toLowerCase();
      if (NOUN_ADJ_DICT[lower]) {
        cleanedSegments.push(NOUN_ADJ_DICT[lower]);
      } else {
        cleanedSegments.push(s);
      }
    }
  }

  let result = Array.from(new Set(cleanedSegments)).join(' / ');
  // Kapitalisasi huruf pertama
  if (result.length > 0) {
    result = result.charAt(0).toUpperCase() + result.slice(1);
  }
  return result;
}

function escapeStr(s: string): string {
  if (!s) return '';
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function serializeVocabFile(exportName: string, items: VocabItem[]): string {
  const lines: string[] = [
    "import { VocabItem } from '../types';",
    "",
    `export const ${exportName}: VocabItem[] = [`,
  ];

  for (const item of items) {
    lines.push('  {');
    lines.push(`    id: '${escapeStr(item.id)}',`);
    if (item.kanji) {
      lines.push(`    kanji: '${escapeStr(item.kanji)}',`);
    }
    lines.push(`    kana: '${escapeStr(item.kana)}',`);
    lines.push(`    romaji: '${escapeStr(item.romaji)}',`);
    lines.push(`    meaningEn: '${escapeStr(item.meaningEn)}',`);
    lines.push(`    meaningId: '${escapeStr(item.meaningId)}',`);
    lines.push(`    level: '${item.level}',`);
    lines.push(`    category: '${escapeStr(item.category)}',`);
    lines.push(`    partOfSpeech: '${escapeStr(item.partOfSpeech)}',`);
    if (item.exampleSentence) {
      lines.push('    exampleSentence: {');
      lines.push(`      jp: '${escapeStr(item.exampleSentence.jp)}',`);
      lines.push(`      furigana: '${escapeStr(item.exampleSentence.furigana)}',`);
      lines.push(`      id: '${escapeStr(item.exampleSentence.id)}',`);
      lines.push('    },');
    }
    lines.push('  },');
  }

  lines.push('];');
  lines.push('');
  return lines.join('\n');
}

function serializeKanjiFile(exportName: string, items: KanjiItem[]): string {
  const lines: string[] = [
    "import { KanjiItem } from '../types';",
    "",
    `export const ${exportName}: KanjiItem[] = [`,
  ];

  for (const item of items) {
    lines.push('  {');
    lines.push(`    id: '${escapeStr(item.id)}',`);
    lines.push(`    kanji: '${escapeStr(item.kanji)}',`);
    lines.push(`    level: '${item.level}',`);
    lines.push(`    category: '${escapeStr(item.category || '')}',`);
    lines.push(`    meaning: '${escapeStr(item.meaning)}',`);
    lines.push(`    meaningId: '${escapeStr(item.meaningId)}',`);
    lines.push(`    onyomi: ${JSON.stringify(item.onyomi)},`);
    lines.push(`    kunyomi: ${JSON.stringify(item.kunyomi)},`);
    lines.push(`    strokes: ${item.strokes},`);
    lines.push(`    radicals: ${JSON.stringify(item.radicals)},`);
    lines.push(`    mnemonic: '${escapeStr(item.mnemonic || '')}',`);
    if (item.examples && item.examples.length > 0) {
      lines.push('    examples: [');
      for (const ex of item.examples) {
        lines.push(`      { word: '${escapeStr(ex.word)}', reading: '${escapeStr(ex.reading)}', meaning: '${escapeStr(ex.meaning)}' },`);
      }
      lines.push('    ],');
    }
    lines.push('  },');
  }

  lines.push('];');
  lines.push('');
  return lines.join('\n');
}

// ============================================================================
// 5. PROSES UTAMA MIGRASI FILE
// ============================================================================
async function main() {
  console.log('🚀 MEMULAI OPERASI SAPU BERSIH LINGUISTIK SPK #19...');

  const vocabTasks = [
    { file: 'src/data/vocabN5CompleteData.ts', exportName: 'VOCAB_N5_COMPLETE', items: VOCAB_N5_COMPLETE },
    { file: 'src/data/vocabN4CompleteData.ts', exportName: 'VOCAB_N4_COMPLETE', items: VOCAB_N4_COMPLETE },
    { file: 'src/data/vocabN3CompleteData.ts', exportName: 'VOCAB_N3_COMPLETE', items: VOCAB_N3_COMPLETE },
    { file: 'src/data/vocabN2CompleteData.ts', exportName: 'VOCAB_N2_COMPLETE', items: VOCAB_N2_COMPLETE },
    { file: 'src/data/vocabN1CompleteData.ts', exportName: 'VOCAB_N1_COMPLETE', items: VOCAB_N1_COMPLETE },
  ];

  let totalMelakukanFixed = 0;
  let totalRobotSentencesFixed = 0;

  for (const task of vocabTasks) {
    for (const item of task.items) {
      // 1. Bersihkan meaningId
      const oldM = item.meaningId;
      if (oldM.includes('melakukan ') || NOUN_ADJ_DICT[oldM.toLowerCase()]) {
        const cleaned = cleanMeaningString(oldM);
        if (cleaned !== oldM) {
          totalMelakukanFixed++;
          item.meaningId = cleaned;
        }
      }

      // 2. Variasikan contoh kalimat robotik
      if (item.exampleSentence) {
        const { jp, id } = item.exampleSentence;
        if (jp.includes('実社会において') || id.includes('Dalam masyarakat nyata')) {
          totalRobotSentencesFixed++;

          const word = item.kanji || item.kana;
          const furi = item.kana;
          const cleanM = item.meaningId.split('/')[0].trim().toLowerCase();
          const hash = hashString(item.id);

          let chosenTemplate: SentenceTemplate;
          const pos = item.partOfSpeech.toLowerCase();
          if (pos.includes('verb') || pos.includes('kata kerja')) {
            chosenTemplate = VERB_TEMPLATES[hash % VERB_TEMPLATES.length];
          } else if (pos.includes('adj') || pos.includes('sifat')) {
            chosenTemplate = ADJ_TEMPLATES[hash % ADJ_TEMPLATES.length];
          } else {
            chosenTemplate = NOUN_TEMPLATES[hash % NOUN_TEMPLATES.length];
          }

          item.exampleSentence = {
            jp: chosenTemplate.jp(word),
            furigana: chosenTemplate.furigana(furi),
            id: chosenTemplate.id(cleanM),
          };
        }
      }
    }

    const content = serializeVocabFile(task.exportName, task.items);
    fs.writeFileSync(task.file, content, 'utf-8');
    console.log(`✅ File diperbarui: ${task.file}`);
  }

  // 3. Bersihkan Kanji N2 & N1
  const kanjiTasks = [
    { file: 'src/data/kanjiN2CompleteData.ts', exportName: 'KANJI_N2_COMPLETE', items: KANJI_N2_COMPLETE },
    { file: 'src/data/kanjiN1CompleteData.ts', exportName: 'KANJI_N1_COMPLETE', items: KANJI_N1_COMPLETE },
  ];

  let totalKanjiFixed = 0;

  for (const task of kanjiTasks) {
    for (const item of task.items) {
      if (KANJI_DICT[item.kanji]) {
        const newMeaning = KANJI_DICT[item.kanji];
        if (newMeaning !== item.meaningId) {
          totalKanjiFixed++;
          item.meaningId = newMeaning;
          item.mnemonic = `Karakter ${item.kanji} (${item.meaningId}) memiliki ${item.strokes} goresan, tersusun dari elemen (${item.radicals.join(', ')}) yang melambangkan konsep intinya.`;
        }
      }
    }

    const content = serializeKanjiFile(task.exportName, task.items);
    fs.writeFileSync(task.file, content, 'utf-8');
    console.log(`✅ File Kanji diperbarui: ${task.file}`);
  }

  console.log('\n────────────────────────────────────────────────────────');
  console.log('🏆 HASIL OPERASI SAPU BERSIH LINGUISTIK SPK #19:');
  console.log(`• Frasa 'melakukan + English' dibersihkan : ${totalMelakukanFixed} kata`);
  console.log(`• Kalimat contoh robotik divariasikan   : ${totalRobotSentencesFixed} kalimat`);
  console.log(`• Kanji N2/N1 bahasa Inggris diterjemahkan : ${totalKanjiFixed} karakter`);
  console.log('────────────────────────────────────────────────────────');
}

main().catch(console.error);

# ⛩️ COMMUNITY PEDAGOGY STANDARDS: STANDAR EMAS PEMBELAJARAN BAHASA JEPANG

Dokumen ini adalah **pedoman pedagogis resmi** untuk pengembangan fitur belajar di **NihongoMaster**. Semua fitur belajar, kuis, latihan, dan generator konten **WAJIB berkaca pada sistem matang** yang telah diakui dan divalidasi oleh komunitas pembelajar bahasa Jepang global (r/LearnJapanese, WaniKani Community, Bunpro Forum, Anki SRS, dan standar resmi JEES/Japan Foundation).

Dilarang keras menciptakan mekanisme kuis main-main (*toy quiz*) atau menghafal kata terisolasi tanpa konteks!

---

## 🏛️ 1. BENCHMARK KOMUNITAS & SISTEM MATANG DUNIA

Berdasarkan konsensus komunitas global (r/LearnJapanese, WaniKani, Bunpro, Renshuu, Anki):

| Sistem Referensi | Kekuatan Utama yang Terbukti Efektif | Kelemahan yang Harus Kita Hindari |
| :--- | :--- | :--- |
| **Anki (SM-2 SRS Engine)** | Algoritma *Spaced Repetition System* (SRS) ilmiah. Mencegah kurva lupa (*forgetting curve*). Fitur *Leech Detection* memisahkan kartu yang gagal berulang kali. | UI kaku, setup awal rumit, terlalu mudah membuat kartu hafalan pasif tanpa konteks kalimat. |
| **Bunpro** | **Cloze-Deletion (Fill-in-the-blank)** dalam kalimat kontekstual. **Ghost Reviews**: Soal yang salah otomatis masuk ke siklus remedial akselerasi (4j, 12j, 24j, 48j). | Frustrasi jika hint terlalu samar atau pengguna hanya menghafal template kalimat tanpa paham grammarnya. |
| **WaniKani** | Dekomposisi radikal Joyō kanji + rantai mnemonik hierarkis (Radikal → Kanji → Kosakata Jukugo). Batasan batch belajar ketat agar tidak *overwhelmed*. | Tidak mengajarkan grammar sama sekali; urutan kanji tidak selalu sinkron dengan level resmi JLPT. |
| **Renshuu** | Format soal variatif (audio, arti, kanji, counter), visual bersih, fleksibilitas personalisasi target JLPT N5–N1. | Beban kognitif bisa meledak jika pengguna menyalakan semua mode sekaligus tanpa batas sesi. |
| **Format Resmi JEES JLPT** | 100% berbasis kalimat utuh: **Mondai 1** (Kanji Yomi), **Mondai 2** (Hyouki/Ejaan), **Mondai 3** (Bunmyaku Kitei / Makna Kontekstual), **Mondai 4** (Bunpou Cloze), **Mondai 5** (Susun Bintang ★). | Bersifat evaluasi berkala (*summative assessment*), bukan latihan bertahap harian (*formative learning*). |

---

## 📐 2. PILAR UTAMA SISTEM BELAJAR NIHONGOMASTER

Untuk mencapai standar aplikasi belajar bahasa Jepang berkelas dunia, NihongoMaster wajib menerapkan 5 pilar berikut:

### Pilar 1: In-Context Cloze Testing (Bukan Tebak Kata Terisolasi)
* **Aturan Mutlak:** Kosakata dan tata bahasa **tidak boleh diuji sebagai kartu tunggal hampa tanpa kalimat**.
* **Implementasi:**
  * Soal Kosakata (*Goi*): Tampilkan kalimat rumpang (*Cloze Sentence*): `バスがこないので、【　　】で行った。` (Pilihan: タクシー, ひこうき, ふね, じてんしゃ).
  * Soal Membaca (*Moji*): Tampilkan kalimat dengan kata bergaris bawah atau dikurung: `きのう、友達と【約束】をした。` (Pilihan: やくそく, やくぞく, やくしょく, やくそっく).

### Pilar 2: The Ghost Remediation Engine (Siklus Pembalasan Kesalahan)
* Mengadopsi mekanisme *Ghost Reviews* Bunpro & *Leech Separation* Anki:
  * Setiap item yang dijawab **salah** pada kuis apapun tidak sekadar menurunkan skor.
  * Item tersebut otomatis mendapatkan status **"Ghost Item"** dan masuk ke antrean drill intensif.
  * Pengguna wajib menjawab benar 3 kali berturut-turut pada sesi berikutnya sebelum "Ghost" dinyatakan hilang/lulus.

### Pilar 3: Beban Kognitif Terukur & Batasan Sesi (Anti-Overwhelm)
* **Kritik:** Mode kuis/dojo *infinite loop* atau antrean ribuan item adalah racun motivasi belajar (*burnout*).
* **Standar Sesi Wajib:**
  * Mode Kilat: **10 Soal** (~2-3 menit).
  * Mode Standar: **20 Soal** (~5-7 menit).
  * Mode Tryout Penuh: **25 Soal** berwaktu.
  * Setiap sesi **WAJIB** memiliki layar hasil (*Result Screen*) dengan ringkasan akurasi, waktu pengerjaan, dan tombol *Drill Soal yang Salah*.

### Pilar 4: Hierarki Radikal & Mnemonik (WaniKani Standard)
* Kanji tidak dihafal sebagai coretan acak yang membingungkan.
* Setiap detail Kanji wajib menampilkan:
  1. **Komponen Radikal** pembentuknya (menggunakan 67 Radikal Joyō di `radicalsData.ts`).
  2. **Mnemonik Cerita Asosiatif** dalam Bahasa Indonesia yang masuk akal.
  3. **Kosakata Terkait (*Jukugo*)** yang relevan pada level JLPT tersebut.

### Pilar 5: Integritas Linguistik Baku (Zero-Artifact)
* **Haram Mutlak:** Dilarang ada terjemahan mesin murahan seperti:
  * `melakukan + English` (*melakukan propose*, *melakukan hang out*).
  * `Dalam masyarakat nyata, memanfaatkan pengetahuan mengenai [X]`.
  * `Dalam kehidupan sehari-hari, menyadari pentingnya melakukan [X] dengan tepat`.
* Terjemahan bahasa Indonesia harus alami, luwes, dan sesuai rasa bahasa penutur asli (*natural native phrasing*).

---

## 🧭 3. PEMETAAN ROADMAP SPK TERARAH

Dokumen ini memandu pembuatan dan verifikasi SPK berikutnya:

1. **SPK #19 (Sedang Berjalan - Audit & Purge Linguistik):**
   * Eliminasi 2.609 frasa `melakukan + English` dan seluruh template robotik ganda.
   * Capping sesi Dojo (10/20) dan Kanji Modal (10/20).
   * Alias romaji kana `ぢ` / `づ`.
2. **SPK #20 (Berikutnya - Authentic In-Context JLPT Cloze Center):**
   * Transformasi total Quiz Center menjadi format resmi JEES JLPT (Mondai 1, 2, 3, 4) menggunakan bank kalimat rumpang `exampleSentence`.
3. **SPK #21 (Mendatang - SRS Engine & Ghost Review Automation):**
   * Implementasi algoritma SRS (interval waktu pengulangan terdistribusi) dan Ghost Review Manager di LocalStorage.

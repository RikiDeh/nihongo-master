# 🌸 NihongoMaster — Belajar Bahasa Jepang dari 0 Hingga N1

Aplikasi belajar bahasa Jepang interaktif modern yang menyempurnakan konsep **Tofugu Kana Quiz** serta dilengkapi jalur kurikulum terstruktur dari pemula total (Kana) hingga tingkat mahir (**JLPT N1**).

---

## ✨ Fitur Unggulan yang Ditingkatkan dari Tofugu

1. **Multi-Pilihan Simultan (Hiragana + Katakana Sekaligus):**
   * Tidak perlu memilih satu per satu seperti di Tofugu. Kamu bisa memilih Hiragana dan Katakana bersamaan dalam satu sesi kuis.
   * Mendukung penuh varian **Gojūon (Dasar 46)**, **Dakuten & Handakuten (ga, za, da, ba, pa)**, serta **Kombinasi Yōon (kya, sha, chu, pyo, dsb.)**.
   * Dilengkapi pintasan cepat (*Preset Selector*): Pilih Semua, Hanya Hiragana, Hanya Katakana, Hanya Dakuten, Hanya Kombinasi.

2. **Evaluasi Hasil Kuis & Penampil Romaji di Bawah Huruf:**
   * Setiap huruf yang sempat salah dijawab langsung ditampilkan secara jelas di bagian atas hasil kuis.
   * **Romaji resmi ditampilkan tepat di bawah masing-masing karakter**, lengkap dengan riwayat ketikan salahmu dan tombol dengar suara asli.
   * Tombol **"Latih Ulang Huruf yang Salah Saja"** untuk mengulang hanya karakter yang belum kamu kuasai.

3. **Sistem Antrean Penguasaan (Mastery Re-queuing):**
   * Huruf yang salah dijawab tidak langsung hilang, melainkan dimasukkan kembali ke antrean kuis sampai kamu menjawabnya dengan benar 100%.

4. **Efek Suara Sintesis & Audio Asli:**
   * Menggunakan Web Audio API untuk efek suara lonceng (*chime*) dan penanda kesalahan.
   * Menggunakan Web Speech API (`ja-JP`) untuk melafalkan suara native Jepang setiap kali menjawab atau mengklik tombol speaker.

---

## 🗺️ Modul Kurikulum 0 ke N1

* **Level 0 (Kana Gateway):** Kuis kecepatan dan ketepatan membaca Hiragana & Katakana.
* **JLPT N5 (Dasar):** ~100 Kanji, ~800 Kosakata, Partikel esensial (`は`, `が`, `を`, `に`, `で`) & kalimat sopan (`〜です`, `〜てください`).
* **JLPT N4 (Menengah Bawah):** Kalimat pengandaian (`〜たら`), Keigo dasar, kosakata kegiatan sehari-hari.
* **JLPT N3 (Jembatan Menengah):** Nuansa tata bahasa (`〜わけにはいかない`), transitif-intransitif, artikel berita ringan.
* **JLPT N2 (Bisnis & Media):** Dokumen formal (`〜に際して`), kosakata korporat dan opini publik.
* **JLPT N1 (Kelancaran Penutur Asli):** Sastra klasik, idiom 4 huruf (*Yojijukugo* seperti 一目瞭然), dan tata bahasa tingkat tinggi (`〜を皮切りに`).

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi dijalankan menggunakan runtime super cepat **Bun**:

```bash
# 1. Masuk ke direktori proyek
cd /home/shikideh/Projects/nihongo-master

# 2. Jalankan development server
~/.bun/bin/bun run dev
```

Buka URL lokal yang muncul di browser (biasanya `http://localhost:5173`).

---

## 🛠️ Struktur Direktori Proyek

```
nihongo-master/
├── src/
│   ├── components/
│   │   ├── KanaQuiz/
│   │   │   ├── KanaSelector.tsx    # Pemilih karakter simultan Hiragana + Katakana + Dakuten + Yoon
│   │   │   ├── KanaQuizSession.tsx # Layar kuis ketik cepat ala Tofugu + re-queue kesalahan
│   │   │   └── KanaResults.tsx     # Layar evaluasi dengan Romaji di bawah huruf salah
│   │   ├── KanjiModule/            # Modul eksplorasi & radikal Kanji N5 - N1
│   │   ├── VocabModule/            # Modul kosakata & mode flashcard balik kartu
│   │   ├── GrammarModule/          # Modul rumus pola tata bahasa & contoh kalimat
│   │   ├── Roadmap/                # Visualisasi peta jalan dari 0 hingga N1
│   │   └── Navbar.tsx              # Navigasi antar modul
│   ├── data/
│   │   ├── kanaData.ts             # Dataset lengkap Hiragana & Katakana (Gojuuon, Dakuten, Yoon)
│   │   ├── kanjiData.ts            # Dataset Kanji N5 - N1
│   │   ├── vocabData.ts            # Dataset Vocab N5 - N1
│   │   └── grammarData.ts          # Dataset Grammar N5 - N1
│   ├── utils/
│   │   └── audio.ts                # Sintesis Web Audio & pelafalan SpeechSynthesis ja-JP
│   ├── types/
│   │   └── index.ts                # TypeScript interface lengkap
│   ├── App.tsx
│   └── main.tsx
```

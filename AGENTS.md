# 🌸 NihongoMaster — Agent Instructions & Project Guidelines

Dokumen ini adalah pedoman operasional dan standar pengembangan untuk agen AI yang bekerja di repositori **NihongoMaster**.

---

## 1. ⚙️ Environment, Perintah & Tooling

* **Runtime & Package Manager**: **Bun** (Wajib). Jangan gunakan `npm`, `npx`, `yarn`, atau `pnpm`.
* **Perintah Penting**:
  * Development server: `bun run dev`
  * Linting: `bun run lint` (menggunakan `oxlint`)
  * Type-checking & Build: `bun run build` (`tsc -b && vite build`)
* **Tech Stack Utama**:
  * React 19 (`react`, `react-dom`)
  * TypeScript (strict typing)
  * Vite
  * Tailwind CSS v4 (`@tailwindcss/vite`)
  * Icons: `lucide-react`
  * Efek: `canvas-confetti`

---

## 2. 🗂️ Arsitektur & Struktur Folder

```text
src/
├── components/          # Komponen UI terisolasi berdasarkan modul fitur
│   ├── KanaQuiz/        # Kuis membaca & mengetik Hiragana/Katakana
│   ├── KanjiModule/     # Eksplorasi Kanji, Radikal & Mnemonic
│   ├── VocabModule/     # Flashcard & tabel kosakata
│   ├── GrammarModule/   # Pola tata bahasa & contoh kalimat
│   ├── QuizModule/      # Sesi ujian & latihan soal pilihan ganda
│   ├── Roadmap/         # Visualisasi progres jalur 0 -> N1
│   └── Navbar.tsx       # Navigasi utama aplikasi
├── data/                # Dataset statis bahasa Jepang (Single Source of Data)
├── types/index.ts       # Definisi interface TypeScript (Single Source of Truth)
├── utils/audio.ts       # Web Audio API (chime/error) & SpeechSynthesis (ja-JP)
├── App.tsx              # Root router & view switching
└── main.tsx
```

### Aturan Modul & Komponen:
1. **Prinsip Modular**: Setiap fitur baru harus dibuatkan folder modulnya sendiri di `src/components/<NamaModul>/`. Jangan menumpuk komponen di luar modulnya.
2. **Audio Centralized**: Untuk efek suara (sound chime/buzz) atau pelafalan native Jepang, **selalu gunakan fungsi di `src/utils/audio.ts`**. Jangan membuat inisialisasi `speechSynthesis` atau `AudioContext` baru di dalam komponen.
3. **Styling**: Gunakan utility classes Tailwind v4 yang sudah terpasang. Jaga estetika UI tetap bersih, ramah mata, modern, dan bernuansa Jepang kontemporer.

---

## 3. 🇯🇵 Standar Data & Linguistik Bahasa Jepang

Semua data baru yang ditambahkan ke `src/data/` **wajib mematuhi interface di `src/types/index.ts`**.

### Aturan Khusus Bahasa Jepang:
1. **Wajib Lokalisasi Bahasa Indonesia (`meaningId`)**:
   * Setiap entri Kanji, Kosakata, dan Grammar wajib memiliki terjemahan/penjelasan Bahasa Indonesia (`meaningId`, `explanationId`, dsb).
   * Jangan hanya menyediakan bahasa Inggris.

2. **Schema & Kontrak Data**:
   * **Kanji (`KanjiItem`)**:
     * Wajib ada: `kanji`, `level` (`N5`..`N1`), `meaningId`, `onyomi` (Katakana), `kunyomi` (Hiragana), `strokes`, `radicals`, `examples`.
     * Sertakan `mnemonic` (cerita jembatan keledai dalam Bahasa Indonesia) untuk mempermudah ingatan pengguna.
   * **Kosakata (`VocabItem`)**:
     * Wajib ada: `kana`, `romaji`, `meaningId`, `level`, `partOfSpeech`.
     * Jika kanji ada, sertakan `kanji` dan `exampleSentence` (`jp`, `furigana`, `id`).
   * **Tata Bahasa (`GrammarItem`)**:
     * Wajib ada: `title`, `level`, `structure` (rumus sambungan), `meaningId`, `explanationId`, serta minimal 2 contoh kalimat (`jp`, `romaji`, `id`).

3. **Validasi Jawaban Kana/Romaji**:
   * Selalu dukung alternatif ejaan Romaji resmi (Hepburn vs Kunrei-shiki) pada data Kana:
     * Contoh: `shi` dan `si` untuk し, `tsu` dan `tu` untuk つ, `fu` dan `hu` untuk ふ, `ji` dan `zi` untuk じ.

4. **Furigana & Tipografi**:
   * Bila menampilkan teks Kanji dengan bacaan di atasnya, gunakan tag HTML semantik:
     `<ruby>漢字<rt>かんじ</rt></ruby>`.

---

## 4. 🛡️ Kualitas Kode & Workflow Agen

1. **Jaga Integritas TypeScript**:
   * Jangan menggunakan tipe `any` sembarangan. Manfaatkan union type yang sudah ada (misal `JLPTLevel`, `KanaType`).
2. **Verifikasi Setelah Perubahan**:
   * Setelah menambahkan data atau memodifikasi komponen logika, selalu jalankan `bun run lint` dan `bun run build` untuk memastikan tidak ada lint error atau type mismatch.
3. **Preservasi Logika Eksisting**:
   * Jangan menghapus atau mengubah fungsionalitas yang sudah berjalan (seperti algoritma *re-queuing* salah jawab pada `KanaQuizSession` atau preset filter pada `KanaSelector`) kecuali diminta secara eksplisit oleh pengguna.

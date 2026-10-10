# 📜 SURAT PERINTAH KERJA (SPK) #22
## PROYEK: NIHONGO MASTER
### TARGET: AUTHENTIC JAPANESE ZEN & EDITORIAL UI/UX OVERHAUL

---

### 📌 Ringkasan Eksekutif & Amanat Mandor
Platform **Nihongo Master** telah mencapai kematangan fungsional dan logis sebesar ~75% (2.000+ Kanji, 9.000+ Kosakata, 6 konjugasi Dojo, simulasi Mock Exam 5 Mondai, dan Engine Spaced Repetition WaniKani-style). Namun secara visual, antarmuka saat ini masih terjangkit pola klise template generator AI (*neon cyberpunk slate-950, glowing gradient pills, card-ception, dan banjir emoji kartun di seluruh judul/tombol*).

Berdasarkan keputusan Big Boss dan spesifikasi baku dalam **`DESIGN.md`**, Developer diinstruksikan untuk merombak total antarmuka menjadi **Japanese Zen & Editorial Craftsmanship**:
* Kanvas kertas hangat (*Washi Paper* `#FAF8F5` di mode terang dan *Sumi Charcoal* `#18181B` di mode gelap).
* Tipografi kuas kaligrafi otentik (*Noto Serif JP* `font-serif-jp`) untuk Kanji dan heading utama.
* Sudut tombol tegas bersahaja (`rounded-lg` 8px) dengan warna stempel *Hanko Vermilion* (`#C84B31`) atau garis pensil halus 1px.
* **0% EMOJI LIAR**: Seluruh emoji kartun di navigasi, header, dan tombol dihapus total.
* **0% BREAKING CHANGES**: Logika kuis, SRS engine, LocalStorage, dan 24 unit tests wajib tetap berjalan 100% tanpa cela.

---

### 📋 Rincian Tiket Pengerjaan

#### 🛠️ TIKET 22.1: Fondasi Token Desain, Palet Kertas/Tinta & Tipografi
**Target File:** `src/index.css`, `index.html`, `src/App.tsx`

1. **Konfigurasi Token Warna & CSS Variables (`src/index.css`):**
   * Terapkan token yang telah ditetapkan di `DESIGN.md`:
     ```css
     :root {
       --color-washi-canvas: #faf8f5;
       --color-pure-paper: #ffffff;
       --color-paper-wash: #f4f0e8;
       --color-hairline-mist: #e7e5e4;
       --color-border-strong: #d6d3d1;
       --color-sumi-ink: #1c1917;
       --color-ash-stone: #78716c;
       --color-hanko-vermilion: #c84b31;
       --color-aizome-indigo: #1e3a8a;
       --color-matcha-bamboo: #2e7d32;
     }
     .dark {
       --color-washi-canvas: #18181b;
       --color-pure-paper: #1f1f23;
       --color-hairline-mist: #27272a;
       --color-sumi-ink: #f4f4f5;
       --color-ash-stone: #a1a1aa;
       --color-hanko-vermilion: #e05d44;
     }
     ```
2. **Pembersihan Background Global (`App.tsx` & `index.html`):**
   * Ganti `bg-slate-950 text-slate-100` pada wrapper utama `App.tsx` dengan kanvas dinamis yang mendukung tema Washi / Sumi Dark (`bg-[#faf8f5] dark:bg-[#18181b] text-[#1c1917] dark:text-[#f4f4f5]`).
   * Pastikan utility class `font-serif-jp` (Noto Serif JP) dan `font-sans` (Plus Jakarta Sans) terpetakan dengan benar dan siap dipakai di seluruh komponen.

---

#### 🏛️ TIKET 22.2: Rombak Navbar, Header, Footer & Pembersihan Total Emoji Liar
**Target File:** `src/components/Navbar.tsx`, `src/App.tsx` (Footer)

1. **Purge Total Emoji Liar:**
   * Hapus seluruh emoji dari navbar desktop dan mobile: `📚`, `🔥`, `✨`, `⚔️`, `🏆`, dll.
   * Tombol SRS: Ganti label `🔥 X Review Siap` menjadi label tenang dengan ikon monoline Lucide (`Flame` tipis atau stempel kanji `[復習] X`).
   * Indikator Streak: Tampilkan hitungan streak bersih (`X Hari`) tanpa teks kartun berlebih.
2. **Logo & Brand Identitas:**
   * Ganti kotak gradien ungu/pink disko dengan stempel cap kayu tradisional Jepang (*Hanko Stamp*): kotak merah bersahaja `bg-[#c84b31]` dengan aksara kanji putih `[日]` berfont serif otentik.
3. **Navigasi Tab:**
   * Ganti tombol kapsul ungu terang dengan gaya tab minimalis bergaris tipis atau subtle indicator.
   * Active state: subtle underline indigo `#1e3a8a` atau background tipis `#f4f0e8` (`#27272a` di dark mode) dengan border hairline 1px.
4. **Footer:**
   * Ganti footer gelap slate-950 dengan footer bernuansa kertas editorial dan border hairline 1px.

---

#### 🥋 TIKET 22.3: Rombak Komponen Presentasi Inti (Quiz, Kanji, Vocab, Dojo, SRS)
**Target File:**
- `src/components/QuizModule/` (`N5QuizCenter.tsx`, `N5QuizSession.tsx`, `N5QuizResults.tsx`)
- `src/components/KanjiModule/` (`KanjiExplorer.tsx`, `KanjiCard.tsx`, `KanjiDetailModal.tsx`)
- `src/components/VocabModule/` (`VocabExplorer.tsx`, `VocabCard.tsx`)
- `src/components/ConjugationModule/` (`ConjugationDojo.tsx`)
- `src/components/SrsModule/` (`SrsReviewSession.tsx`)

1. **JLPT Quiz Center & Mock Exam:**
   * **Pertanyaan Soal:** Kalimat bahasa Jepang wajib menggunakan `font-serif-jp` (Noto Serif JP) dengan line-height yang lapang (1.5).
   * **Pilihan Ganda:** Ubah tombol pill menjadi baris horizontal rapi bergaris 1px (*Hairline Card*), dilengkapi kotak nomor monospace `[1]`, `[2]`, `[3]`, `[4]` di sisi kiri.
   * **Tombol Aksi Kuis:** Gunakan `rounded-lg` (8px), warna solid Hanko Vermilion (`#c84b31`) atau Sumi Ink (`#1c1917`), dengan efek tekan `active:translate-y-px`.
2. **Kanji & Vocab Explorer:**
   * **Display Kanji:** Karakter kanji ditampilkan besar dan berwibawa menggunakan `font-serif-jp`, memberikan visual guratan kuas kaligrafi nyata.
   * **Badge Kategori:** Ganti kapsul pelangi dengan *Hanko Seal Badge* kotak presisi 4px radius (`border border-stone-200 dark:border-zinc-800 text-[11px] font-mono [漢] N5`, `[訓]`, `[音]`).
   * **Filter & Pencarian:** Input pencarian bergaris pensil tipis 1px tanpa glowing border.
3. **Conjugation Dojo:**
   * Buang aura game cyberpunk. Jadikan dojo sebagai studio latihan konjugasi formal yang tenang dan berwibawa.
4. **SRS Review Session:**
   * Kartu flashcard berlatar kertas bersih dengan border hairline 1px.
   * Tombol keputusan: "Lupa / Salah" (outline halus) vs "Ingat / Benar" (vermilion solid).

---

#### 🧪 TIKET 22.4: Quality Gate & Verifikasi 0-Breaking Changes
**Target Checklist:**
1. **Unit Tests:**
   * Jalankan `bun test`.
   * **Wajib:** 24 pass, 0 fail, 75.000+ expect() calls tetap hijau 100%.
2. **Linting:**
   * Jalankan `bun run lint` (oxlint).
   * **Wajib:** 0 errors, 0 warnings.
3. **Production Build:**
   * Jalankan `bun run build` (`tsc -b && vite build`).
   * **Wajib:** 0 compile error TypeScript, built in < 1.5 detik.

---

### 🛡️ Kriteria Selesai (Definition of Done)
1. Seluruh 4 tiket terselesaikan tanpa ada komponen yang terlewat.
2. 0% emoji liar tersisa di tombol, badge, dan navbar.
3. Seluruh pedoman di `DESIGN.md` dipatuhi secara ketat.
4. Kode ter-commit dengan pesan:
   `feat(ui): overhaul design to authentic Japanese Zen Editorial system (SPK 22)`

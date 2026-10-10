# Nihongo Master — Style Reference
> Scholar's warm parchment desk, sumi brushwork, and hairline ink craft

**Theme:** light (default) & dark (sumi night)

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

Nihongo Master treats the interface like a curated scholar's study in Kyoto: a warm Washi paper canvas (#faf8f5) that eliminates screen glare during hours of intensive kanji reading, tactile sumi-black typography that honors the physical brush stroke, and color deployed with deliberate Japanese restraint (Nihon no Dentousoku). A single vermilion seal hue (Shu-iro #c84b31) anchors primary action moments like a traditional artist's Hanko stamp, while indigo (Aizome #1e3a8a) guides navigation and deep forest moss (Matcha #2e7d32) quietly marks mastery and completed habits. Cards and panels sit on the canvas with 1px hairline borders and 10–12px corners — zero glowing shadows, zero floating blur, zero cartoonish neon — behaving like ruled section sheets in a bound Japanese notebook.

---

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Washi Canvas | `#faf8f5` | `--color-washi-canvas` | Main page canvas (light mode) — warm off-white organic paper that prevents study fatigue |
| Pure Paper | `#ffffff` | `--color-pure-paper` | Card surfaces, interactive option panels, elevated study trays on the washi canvas |
| Paper Wash | `#f4f0e8` | `--color-paper-wash` | Secondary background wash for quiz prompt containers, mnemonics, and example sentence boxes |
| Hairline Mist | `#e7e5e4` | `--color-hairline-mist` | 1px hairline borders on cards, table dividers, and quiz buttons — reads as a fine pencil stroke |
| Border Strong | `#d6d3d1` | `--color-border-strong` | Active, hover, or keyboard-focused border state on cards and inputs |
| Sumi Ink | `#1c1917` | `--color-sumi-ink` | Primary kanji glyphs, headings, and primary body text — deep charcoal-black with warm organic undertone |
| Ash Stone | `#78716c` | `--color-ash-stone` | Secondary helper text, romaji readings, English glosses, and inactive navigation labels |
| Faded Whisper | `#a8a29e` | `--color-faded-whisper` | Low-emphasis metadata, stroke count labels, and disabled states |
| Hanko Vermilion | `#c84b31` | `--color-hanko-vermilion` | Primary CTA button fill, Hanko seal badge borders, critical alerts, and kanji radical highlights |
| Aizome Indigo | `#1e3a8a` | `--color-aizome-indigo` | Navigational accents, active tab underlines, grammar rule links, and vocabulary classification |
| Matcha Bamboo | `#2e7d32` | `--color-matcha-bamboo` | Correct quiz answers, completed SRS daily streak count, and JLPT mastery progress badges |
| Sumi Charcoal (Dark) | `#18181b` | `--color-sumi-dark` | Dark mode page canvas — warm iron charcoal ink, never harsh pure OLED black |
| Night Surface (Dark) | `#1f1f23` | `--color-surface-dark` | Dark mode card surface, slightly elevated above the sumi dark canvas |
| Night Border (Dark) | `#27272a` | `--color-border-dark` | Dark mode 1px hairline border |
| Night Text (Dark) | `#f4f4f5` | `--color-text-dark` | Dark mode primary text — soft ivory-white that is gentle on nocturnal eyes |

---

## Tokens — Typography

### Noto Serif JP — Authentic Japanese Brush & Display
Display headlines, Kanji cards, JLPT question prompts, and section titles — an authentic calligraphic serif that reflects traditional woodblock printing and brush strokes. Gives the app its academic, dignified voice.
- **Weights:** 600 (SemiBold), 700 (Bold), 900 (Black)
- **Sizes:** 20px, 24px, 32px, 48px, 64px, 72px
- **Line height:** 1.25 to 1.40
- **Letter spacing:** 0.0200em (generous breathing room for complex strokes)
- **Token:** `--font-serif-jp`
- **Substitute:** Shippori Mincho, Yu Mincho, Hiragino Mincho ProN, serif

### Plus Jakarta Sans — Modern Clean UI & Body
Body paragraphs, grammar breakdowns, Indonesian/English explanations, and interactive control labels — a balanced geometric grotesque that stays legible at dense sizes while letting weight 600 carry clear emphasis.
- **Weights:** 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Sizes:** 12px, 13px, 14px, 15px, 16px, 18px
- **Line height:** 1.40 to 1.60
- **Letter spacing:** -0.0100em
- **Token:** `--font-sans`
- **Substitute:** Noto Sans JP, Inter, system-ui, sans-serif

### JetBrains Mono — Technical Codes & Hanko Badges
Monospace metadata: JLPT level stamps (`[N5]`), Onyomi/Kunyomi tags (`[音]`, `[訓]`), question numbers (`04/15`), keyboard hints (`[1]`, `[Enter]`), and SRS intervals (`4h`, `72h`).
- **Weights:** 500, 600
- **Sizes:** 10px, 11px, 12px, 13px
- **Line height:** 1.20
- **Token:** `--font-mono`

---

## Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing | Token |
|------|--------|--------|------|-------------|----------------|-------|
| badge-micro | JetBrains Mono | 600 | 11px | 1.20 | 0.0500em | `--text-badge-micro` |
| caption | Plus Jakarta Sans | 500 | 12px | 1.35 | -0.0050em | `--text-caption` |
| nav-label | Plus Jakarta Sans | 600 | 13px | 1.30 | 0.0200em | `--text-nav-label` |
| body-sm | Plus Jakarta Sans | 400 | 14px | 1.45 | -0.0100em | `--text-body-sm` |
| body | Plus Jakarta Sans | 400 | 15px | 1.55 | -0.0100em | `--text-body` |
| prompt-text | Noto Serif JP | 600 | 18px | 1.50 | 0.0150em | `--text-prompt` |
| subheading | Noto Serif JP | 700 | 20px | 1.35 | 0.0100em | `--text-subheading` |
| heading-sm | Noto Serif JP | 700 | 24px | 1.30 | 0.0000em | `--text-heading-sm` |
| heading-lg | Noto Serif JP | 700 | 32px | 1.25 | -0.0100em | `--text-heading-lg` |
| kanji-display | Noto Serif JP | 900 | 64px | 1.10 | 0.0200em | `--text-kanji-display` |
| kanji-hero | Noto Serif JP | 900 | 80px | 1.05 | 0.0200em | `--text-kanji-hero` |

---

## Tokens — Spacing & Shapes

**Base unit:** 4px  
**Density:** Academic Comfortable (Generous white space, clear margins)

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |

### Border Radius

| Element | Value | Penjelasan |
|---------|-------|------------|
| hanko-badges | 4px | Sudut kotak presisi mirip stempel cap kayu |
| buttons | 8px | Sudut tegas berwibawa, bukan kapsul lonjong |
| inputs / options | 8px | Baris pilihan kuis yang kokoh |
| cards | 12px | Sudut lembar buku catatan Moleskine |
| modals | 16px | Panel dialog fokus |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 40px to 64px
- **Card padding:** 16px (mobile) to 24px (desktop)
- **Hairline border:** strictly 1px solid

---

## Components

### 1. Primary Hanko Action Button
**Role:** Tombol aksi utama (e.g., "Mulai Kuis", "Periksa Jawaban", "Review Selesai")
- **Fill:** `#c84b31` (Hanko Vermilion)
- **Text:** `#ffffff`, Plus Jakarta Sans 600 at 13px uppercase with 0.0500em tracking
- **Border:** None (warna vermilion membawa bobot aksi)
- **Radius:** 8px (`rounded-lg`)
- **Padding:** 10px vertical, 20px horizontal
- **Interaction:** `hover:opacity-95`, `active:translate-y-px` (flat tactile feedback)

### 2. Secondary Outline Ink Button
**Role:** Tombol alternatif kedua (e.g., "Kembali", "Ganti Kategori", "Lihat Riwayat")
- **Fill:** Transparent or `#ffffff`
- **Text:** `#1c1917` (Sumi Ink), Plus Jakarta Sans 600 at 13px
- **Border:** 1px solid `#d6d3d1`
- **Radius:** 8px
- **Padding:** 10px vertical, 18px horizontal
- **Interaction:** `hover:border-stone-400 hover:bg-stone-50/50`, `active:translate-y-px`

### 3. Hanko Seal Badge
**Role:** Label materi & status tradisional (e.g., `[漢] N5`, `[音]`, `[訓]`, `[動詞]`)
- **Fill:** `#faf8f5` (light) / `#18181b` (dark)
- **Text:** `#1c1917` or `#c84b31`, JetBrains Mono 600 at 11px
- **Border:** 1px solid `#e7e5e4` (light) / `#27272a` (dark)
- **Radius:** 4px
- **Padding:** 2px vertical, 6px horizontal

### 4. JLPT Quiz Option Row
**Role:** Baris opsi pilihan ganda pada kuis & ujian (Mondai 1 s/d 5)
- **Fill:** `#ffffff` (light) / `#1f1f23` (dark)
- **Border:** 1px solid `#e7e5e4` (light) / `#27272a` (dark)
- **Radius:** 8px
- **Padding:** 14px vertical, 16px horizontal
- **Left Index:** Kotak 20x20px border 1px dengan angka monospace (`1`, `2`, `3`, `4`)
- **Text:** Noto Serif JP 600 at 16px (Japanese text) + Plus Jakarta Sans at 12px (Romaji/Arti)
- **State Selected:** Border `#c84b31` (Vermilion), wash background `#c84b31`/5, ring 1px `#c84b31`
- **State Correct:** Border `#2e7d32`, wash background `#2e7d32`/8, label text "正解 (Benar)"
- **State Wrong:** Border `#dc2626`, wash background `#dc2626`/8

### 5. Kanji Master Exhibition Card
**Role:** Kartu kanji di Kanji Explorer & Detail Dialog
- **Fill:** `#ffffff` (light) / `#1f1f23` (dark)
- **Border:** 1px solid `#e7e5e4`
- **Radius:** 12px
- **Kanji Glyph:** Noto Serif JP 900 at 64px, centered with generous padding
- **Metadata Tray:** Divider 1px hairline, label `音読み` (Onyomi) & `訓読み` (Kunyomi) dengan font serif

### 6. SRS Spaced-Repetition Tray
**Role:** Container review SRS dan kartu memori bertahap
- **Fill:** `#ffffff` with subtle wash `#f4f0e8` in prompt zone
- **Border:** 1px solid `#e7e5e4`
- **Stage Pill:** Monospace badge bergaya stempel cap: `Stage 4: Guru (3 hari)`
- **Action Split:** 2 tombol lebar — "Lupa / Salah" (outline merah halus) vs "Ingat / Benar" (vermilion solid)

---

## Do's and Don'ts

### Do
- **Gunakan `#c84b31` (Hanko Vermilion)** sebagai satu-satunya warna primer untuk status konversi/aksi penting; warna ini melambangkan stempel kuil dan cap seniman Jepang.
- **Wajib gunakan `font-serif-jp` (Noto Serif JP)** untuk setiap tampilan kanji, heading judul modul, dan kalimat soal kuis JLPT.
- **Terapkan border 1px tipis (`#e7e5e4`)** pada setiap card dan pembatas; kesan "kertas buku catatan bersahaja" berasal dari garis pensil halus ini.
- **Gunakan SVG monoline 16–18px (Lucide)** untuk seluruh kebutuhan ikon (speaker suara, panah, refresh, checkmark).
- **Pertahankan kanvas `#faf8f5` (Washi)** sebagai latar belakang default; kecerahan hangatnya melindungi mata pengguna saat belajar berjam-jam.

### Don't
- **Haram menyisipkan emoji kartun** (`🔥`, `🚀`, `✨`, `🧠`, `🥋`, `🎯`, `💡`) pada judul halaman, tombol aksi, maupun label badge.
- **Haram membuat tombol kapsul lonjong `rounded-full`** dengan gradasi ungu-pink neon (`from-indigo-500 to-rose-500`).
- **Haram memasang efek bayangan glow neon** (`shadow-[0_0_25px_...]`) atau latar hitam pekat OLED (`#000000` / `slate-950`).
- **Haram memberi warna-warni pelangi yang tidak perlu** pada badge; gunakan palet tenang Washi, Sumi, Vermilion, dan Indigo.
- **Haram merusak logika atau 24 unit test yang ada** saat mengganti styling tampilan presentasi.

---

## Surfaces

| Level | Name | Value (Light) | Value (Dark) | Purpose |
|-------|------|---------------|--------------|---------|
| 0 | Washi Canvas | `#faf8f5` | `#18181b` | Base page canvas — fondasi seluruh halaman |
| 1 | Paper Sheet | `#ffffff` | `#1f1f23` | Permukaan kartu, panel navigasi, modal container |
| 2 | Paper Wash | `#f4f0e8` | `#27272a` | Container contoh kalimat, rumpang soal, input background |
| 3 | Vermilion Stamp | `#c84b31` | `#e05d44` | Permukaan stempel aksi tombol primary |

---

## Imagery & Iconography

- **Philosophy:** Ketiadaan ornamen berlebih (Zen Minimalism). Konten aksara Jepang (Kanji, Kana, Romaji) adalah visual utama itu sendiri.
- **Iconography:** Monoline stroke SVGs berbobot 1.5–1.75px dari Lucide Icons (e.g. `Volume2`, `RotateCcw`, `Check`, `ChevronRight`, `BookOpen`, `Award`, `Settings`). Seluruh ikon berukuran 16px hingga 20px.
- **Stamps:** Stempel teks aksara kanji bergaya Hanko (`[漢]`, `[語]`, `[文]`, `[音]`, `[訓]`) yang dicetak di atas border kotak 4px radius.

---

## Agent Prompt Guide

Quick Color Reference:
- text (primary/kanji): `#1c1917` (light) / `#f4f4f5` (dark)
- text (secondary/romaji): `#78716c` (light) / `#a1a1aa` (dark)
- background (canvas): `#faf8f5` (light) / `#18181b` (dark)
- background (surface): `#ffffff` (light) / `#1f1f23` (dark)
- border (hairline): `#e7e5e4` (light) / `#27272a` (dark)
- accent (primary CTA/hanko): `#c84b31`
- accent (indigo nav): `#1e3a8a`
- accent (matcha correct): `#2e7d32`

Example Component Rules:
- Primary CTA: `<button className="px-5 py-2.5 rounded-lg bg-[#c84b31] hover:bg-[#b03d25] text-white text-xs font-semibold uppercase tracking-wider transition-all active:translate-y-px">`
- Hairline Card: `<div className="p-6 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#1f1f23] shadow-sm">`
- Japanese Prompt Text: `<div className="font-serif-jp text-2xl font-bold text-stone-900 dark:text-stone-100 leading-relaxed">`

---

## Similar Brands

- **WaniKani** — Content-first kanji learning with distinct radical/kanji/vocab color discipline and readable sans/serif contrast
- **Tofugu** — Warm paper-editorial Japanese educational articles with zero visual noise and high typographic clarity
- **Bunpro** — Serious JLPT grammar studio on clean neutral surfaces with hairline dividers
- **Satori Reader** — Warm parchment reading interface optimized for continuous Japanese reading comprehension
- **Notion & Perplexity AI** — Restrained warm-paper canvas with hairline borders and single-chromatic navigation anchors

---

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors — Light Mode (Washi & Sumi) */
  --color-washi-canvas: #faf8f5;
  --color-pure-paper: #ffffff;
  --color-paper-wash: #f4f0e8;
  --color-hairline-mist: #e7e5e4;
  --color-border-strong: #d6d3d1;
  --color-sumi-ink: #1c1917;
  --color-ash-stone: #78716c;
  --color-faded-whisper: #a8a29e;
  --color-hanko-vermilion: #c84b31;
  --color-aizome-indigo: #1e3a8a;
  --color-matcha-bamboo: #2e7d32;

  /* Typography — Font Families */
  --font-serif-jp: 'Noto Serif JP', 'Shippori Mincho', 'Yu Mincho', serif;
  --font-sans: 'Plus Jakarta Sans', 'Noto Sans JP', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Typography — Scale */
  --text-badge-micro: 11px;
  --text-caption: 12px;
  --text-nav-label: 13px;
  --text-body-sm: 14px;
  --text-body: 15px;
  --text-prompt: 18px;
  --text-subheading: 20px;
  --text-heading-sm: 24px;
  --text-heading-lg: 32px;
  --text-kanji-display: 64px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;

  /* Border Radius */
  --radius-badge: 4px;
  --radius-button: 8px;
  --radius-card: 12px;
  --radius-modal: 16px;
}

.dark {
  /* Colors — Dark Mode (Sumi Charcoal) */
  --color-washi-canvas: #18181b;
  --color-pure-paper: #1f1f23;
  --color-paper-wash: #27272a;
  --color-hairline-mist: #27272a;
  --color-border-strong: #3f3f46;
  --color-sumi-ink: #f4f4f5;
  --color-ash-stone: #a1a1aa;
  --color-faded-whisper: #71717a;
  --color-hanko-vermilion: #e05d44;
}
```

### Tailwind v4 Theme Configuration

```css
@theme {
  /* Colors */
  --color-washi: #faf8f5;
  --color-paper: #ffffff;
  --color-paper-wash: #f4f0e8;
  --color-hairline: #e7e5e4;
  --color-sumi: #1c1917;
  --color-ash: #78716c;
  --color-hanko: #c84b31;
  --color-aizome: #1e3a8a;
  --color-matcha: #2e7d32;

  /* Dark mode variants */
  --color-sumi-dark: #18181b;
  --color-surface-dark: #1f1f23;
  --color-hairline-dark: #27272a;
  --color-text-dark: #f4f4f5;

  /* Typography */
  --font-serif-jp: 'Noto Serif JP', 'Shippori Mincho', 'Yu Mincho', serif;
  --font-sans: 'Plus Jakarta Sans', 'Noto Sans JP', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Border Radii */
  --radius-hanko: 4px;
  --radius-btn: 8px;
  --radius-card: 12px;
  --radius-modal: 16px;
}
```

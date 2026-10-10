# Nihongo Master — Style Reference & Design System (`DESIGN.md`)
> Scholar's warm parchment desk, sumi brushwork, and hairline ink craft.

**Themes:** Light (Washi Canvas `#FAF8F5`) & Dark (Sumi Charcoal `#18181B`)  
**Design Paradigm:** Authentic Japanese Zen & Editorial Craftsmanship (Refero-inspired)

---

## 🚫 The 4 Inviolable Anti-AI Slop Laws

1. **Haram Emoji Liar (The Zero-Emoji Law):**
   * **DILARANG KERAS** menempatkan emoji kartun (`🔥`, `🚀`, `✨`, `🧠`, `🥋`, `🎯`, `💡`, `📚`, `🏆`) di judul halaman, tombol aksi, badge materi, dan navigasi navbar.
   * **Wajib Menggunakan:**
     - Ikon SVG monoline tipis 16px–18px (Lucide: `Volume2`, `RotateCcw`, `Check`, `BookOpen`, `Award`, `Compass`, `Settings`).
     - Stempel kanji tradisional (*Hanko Seal Badges*): `[漢] N5`, `[語]`, `[文]`, `[訓]`, `[音]`.

2. **Haram Tombol Pill Neon (No Glow/Pill Gradient Law):**
   * **DILARANG KERAS** menggunakan tombol kapsul lonjong `rounded-full` bergradasi neon (`from-indigo-500 to-rose-500 shadow-indigo-500/30`).
   * **Bentuk Wajib:** Sudut tegas bersahaja (`rounded-lg` / `rounded-xl` 8px–12px), warna solid atau subtle border 1px, *flat tactile press* (`active:translate-y-px`).

3. **Haram Cyberpunk / Neon Glow (No Glow Law):**
   * Hapus seluruh `shadow-[0_0_20px_...]`, border gradien neon, dan latar belakang hitam pekat OLED `slate-950` yang menyilaukan.
   * Ganti dengan kanvas kertas hangat (*Warm Parchment*) atau arang tinta (*Sumi Charcoal*) dengan garis pembatas tipis (*1px hairline border*).

4. **Keterbacaan Aksara Jepang Nomor Satu (Typography-First):**
   * Seluruh karakter Kanji dan Heading utama **WAJIB** menggunakan font kaligrafi kuas otentik `Noto Serif JP` (`font-serif-jp`).
   * Body text dan UI menggunakan font sans modern yang lapang dan jernih (`font-sans`).

---

## 🎨 Tokens — Colors

### Light Mode (Default — Washi Desk)
| Token | Hex | Role | Penjelasan Arsitektural |
|---|---|---|---|
| `--color-canvas` | `#FAF8F5` | Page Background | Kertas *Washi* hangat yang nyaman di mata berjam-jam tanpa fatik visual. |
| `--color-surface` | `#FFFFFF` | Card & Modal Surface | Permukaan kartu utama, bersih dengan border 1px. |
| `--color-surface-subtle` | `#F4F1EA` | Secondary Surface | Permukaan sekunder untuk input atau container contoh kalimat. |
| `--color-border-hairline` | `#E7E5E4` | 1px Hairline Border | Garis tipis seperti guratan pensil halus di atas kertas. |
| `--color-text-primary` | `#1C1917` | Sumi Ink (Teks Utama) | Tinta hitam arang pekat (bukan #000 mati), kontras tinggi dan tajam. |
| `--color-text-muted` | `#78716C` | Stone / Ash (Teks Redup) | Teks sekunder, terjemahan romaji, dan metadata soal. |
| `--color-accent-hanko` | `#C84B31` | Shu-iro / Vermilion | Merah stempel Hanko tradisional Jepang untuk tombol utama dan status penting. |
| `--color-accent-indigo` | `#1E3A8A` | Aizome Indigo | Biru indigo klasik untuk navigasi aktif dan state fokus. |
| `--color-accent-matcha` | `#2E7D32` | Matcha / Uguisu | Hijau zen untuk status tuntas, jawaban benar, dan daily streak. |

### Dark Mode (Sumi Charcoal & Night Atelier)
| Token | Hex | Role | Penjelasan Arsitektural |
|---|---|---|---|
| `--color-canvas-dark` | `#18181B` | Dark Page Background | Arang tinta (*Sumi Charcoal*), hangat dan tenang, bukan OLED hitam mati. |
| `--color-surface-dark` | `#1F1F23` | Dark Card Surface | Permukaan kartu gelap dengan kontras lembut. |
| `--color-border-dark` | `#27272A` | Dark Hairline Border | Pembatas kartu 1px yang bersih tanpa glow neon. |
| `--color-text-primary-dark` | `#F4F4F5` | Dark Primary Text | Teks putih gading yang lembut di mata malam hari. |
| `--color-text-muted-dark` | `#A1A1AA` | Dark Muted Text | Teks bantuan abu-abu netral. |
| `--color-accent-hanko-dark` | `#E05D44` | Vermilion Night | Aksen merah stempel yang disesuaikan untuk latar gelap. |

---

## ✒️ Tokens — Typography

| Keluarga Font | CSS Variable / Class | Kegunaan Wajib |
|---|---|---|
| **Noto Serif JP** | `font-serif-jp` (serif) | Seluruh karakter Kanji (`桜`, `約束`, dll.), Heading modul, dan teks soal utama JLPT. Memberikan guratan kuas kaligrafi otentik. |
| **Plus Jakarta Sans / Noto Sans JP** | `font-sans` (sans-serif) | Body text, penjelasan tata bahasa, romaji, terjemahan Indonesia/Inggris, dan label tombol. |
| **JetBrains Mono** | `font-mono` (monospace) | Stempel badge (`[N5]`, `[訓]`, `[音]`), penomoran soal (`04/15`), timer, dan statistik interval SRS (`4h`, `72h`). |

---

## 📐 Tokens — Spacing & Components

### 1. Tombol (Buttons)
* **Primary Action (`btn-primary`):**
  - Latar belakang: `#C84B31` (Vermilion Hanko) atau `#1C1917` (Sumi Ink).
  - Teks: Putih bersih, font-semibold, ukuran `text-xs` atau `text-sm`, uppercase tracking-wider tipis.
  - Sudut: `rounded-lg` (8px).
  - Hover: Opacity 90%, active: `translate-y-px` (tactile micro-interaction).
* **Secondary / Outline (`btn-outline`):**
  - Latar belakang: Transparan / `#FFFFFF`.
  - Border: 1px hairline (`border-stone-300` / `border-zinc-700`).
  - Teks: `#1C1917` (light) / `#F4F4F5` (dark).
  - Sudut: `rounded-lg`.

### 2. Kartu (Cards)
* **Bukan Kapsul / Bukan Bento Glow:**
  - Border tipis 1px (`border-stone-200` di light mode, `border-zinc-800` di dark mode).
  - Sudut `rounded-xl` (12px).
  - Shadow: Sangat lembut (`shadow-sm`) atau flat tanpa shadow.
  - Padding proporsional (`p-4` hingga `p-6`).

### 3. Badge Stempel (Hanko Badges)
* Gantikan kapsul pelangi dengan stempel bergaya cap Jepang:
  ```html
  <span class="px-2 py-0.5 rounded border border-stone-300 dark:border-zinc-700 text-[11px] font-mono text-stone-700 dark:text-zinc-300">
    [漢] JLPT N5
  </span>
  ```

### 4. Pilihan Ganda Kuis (Quiz Options)
* Format baris horizontal bersih dengan nomor soal monospace kotak kecil:
  ```html
  <button class="w-full p-3.5 rounded-lg border border-stone-200 dark:border-zinc-800 text-left flex items-center justify-between hover:border-stone-400">
    <div class="flex items-center gap-3">
      <span class="w-5 h-5 rounded border border-current/30 flex items-center justify-center text-xs font-mono">1</span>
      <span class="font-serif-jp text-base font-semibold">病院 (びょういん)</span>
      <span class="text-xs text-stone-400">(Rumah Sakit)</span>
    </div>
  </button>
  ```

---

## 🎯 Target Implementasi (Quality Gate Checklist)
- [ ] 0% emoji liar di seluruh navigasi dan tombol.
- [ ] 100% karakter Kanji menggunakan `font-serif-jp` (*Noto Serif JP*).
- [ ] Seluruh gradien neon disko dihilangkan.
- [ ] 24/24 unit test tetap **PASS 100%**.
- [ ] 0 error TypeScript compiler (`bun run build`).
- [ ] 0 peringatan linter (`bun run lint`).

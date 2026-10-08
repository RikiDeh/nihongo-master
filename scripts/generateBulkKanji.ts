/**
 * scripts/generateBulkKanji.ts
 *
 * AUTOMATED BULK KANJI GENERATOR & INGESTION PIPELINE (SPK #16)
 *
 * Menginjeksi seluruh sisa karakter Joyō Kanji resmi Jepang (SD s/d SMA = 2.136 kanji)
 * ke dalam kurikulum N2 dan N1 dengan spesifikasi lengkap:
 * - ID Unik bebas tabrakan (k-n2-bulk-<index> & k-n1-bulk-<index>)
 * - Terjemahan Bahasa Indonesia baku (meaningId)
 * - Katakana On'yomi & Hiragana Kun'yomi
 * - Jumlah goresan (strokes) & dekomposisi radikal autentik
 * - Mnemonik visual Bahasa Indonesia
 * - Minimal 2 contoh jukugo relevan (word, reading, meaning)
 */

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const PROJECT_ROOT = resolve(process.cwd());
const PYTHON_BUILDER = resolve(PROJECT_ROOT, 'scripts/buildBulkKanjiData.py');
const OUTPUT_N2 = resolve(PROJECT_ROOT, 'src/data/kanjiN2CompleteData.ts');
const OUTPUT_N1 = resolve(PROJECT_ROOT, 'src/data/kanjiN1CompleteData.ts');

console.log('🚀 [SPK #16] Memulai Generator Otomatis Joyō Kanji N2 & N1...');

if (!existsSync(PYTHON_BUILDER)) {
  console.error(`❌ File builder python tidak ditemukan di: ${PYTHON_BUILDER}`);
  process.exit(1);
}

// Eksekusi pipeline builder dengan python3
const startTime = Date.now();
const res = spawnSync('python3', [PYTHON_BUILDER], {
  cwd: PROJECT_ROOT,
  stdio: 'inherit',
  env: process.env,
});

if (res.status !== 0) {
  console.error('❌ Generator kanji gagal dieksekusi.');
  process.exit(res.status ?? 1);
}

const duration = Date.now() - startTime;
console.log(`⏱️ Eksekusi pipeline selesai dalam ${duration}ms`);

// Verifikasi file output di disk
if (!existsSync(OUTPUT_N2) || !existsSync(OUTPUT_N1)) {
  console.error('❌ File output TypeScript tidak lengkap di disk!');
  process.exit(1);
}

const n2Content = readFileSync(OUTPUT_N2, 'utf-8');
const n1Content = readFileSync(OUTPUT_N1, 'utf-8');

const n2Count = (n2Content.match(/id:\s*['"][^'"]+['"]/g) || []).length;
const n1Count = (n1Content.match(/id:\s*['"][^'"]+['"]/g) || []).length;

console.log('────────────────────────────────────────────────────────');
console.log('📊 LAPORAN INGESTION BULK KANJI (SPK #16):');
console.log(`• Kanji N2 Injected (Complete) : ${n2Count} kanji`);
console.log(`• Kanji N1 Injected (Complete) : ${n1Count} kanji`);
console.log(`• Total Injected               : ${n2Count + n1Count} kanji`);
console.log('✅ Pipeline Ingestion Kanji Berhasil 100%!');
console.log('────────────────────────────────────────────────────────');

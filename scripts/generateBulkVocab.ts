/**
 * scripts/generateBulkVocab.ts
 * 
 * AUTOMATED BULK VOCABULARY GENERATOR (SPK #14)
 * 
 * Fitur Utama:
 * 1. Membaca corpus leksikon terstruktur JLPT N5, N4, N3 dari `scripts/data/*.json`.
 * 2. Memetakan data leksikon secara otomatis ke interface VocabItem:
 *    - Format ID bebas tabrakan: `v-<level>-bulk-<index>`
 *    - Menyediakan meaningId (Bahasa Indonesia), romaji, partOfSpeech, category.
 *    - Menghasilkan struktur exampleSentence { jp, furigana, id } lengkap.
 * 3. Menulis langsung ke disk:
 *    - src/data/vocabN5CompleteData.ts
 *    - src/data/vocabN4CompleteData.ts
 *    - src/data/vocabN3CompleteData.ts
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { VocabItem, JLPTLevel } from '../src/types';

interface LexiconEntry {
  kanji?: string;
  kana: string;
  romaji: string;
  meaningEn: string;
  meaningId: string;
  level: JLPTLevel;
  category: string;
  partOfSpeech: string;
  exampleSentence?: {
    jp: string;
    furigana: string;
    id: string;
  };
}

function escapeStr(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function generateTsFile(exportName: string, items: VocabItem[]): string {
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

export function runBulkGeneration(): void {
  console.log('🚀 [SPK #14] Memulai Automated Bulk Vocabulary Generator via Bun...\n');

  const cwd = process.cwd();
  const dataDir = resolve(cwd, 'scripts/data');
  const targetDir = resolve(cwd, 'src/data');

  const datasets: { level: JLPTLevel; jsonFile: string; tsFile: string; exportName: string }[] = [
    {
      level: 'N5',
      jsonFile: resolve(dataDir, 'n5_lexicon.json'),
      tsFile: resolve(targetDir, 'vocabN5CompleteData.ts'),
      exportName: 'VOCAB_N5_COMPLETE',
    },
    {
      level: 'N4',
      jsonFile: resolve(dataDir, 'n4_lexicon.json'),
      tsFile: resolve(targetDir, 'vocabN4CompleteData.ts'),
      exportName: 'VOCAB_N4_COMPLETE',
    },
    {
      level: 'N3',
      jsonFile: resolve(dataDir, 'n3_lexicon.json'),
      tsFile: resolve(targetDir, 'vocabN3CompleteData.ts'),
      exportName: 'VOCAB_N3_COMPLETE',
    },
  ];

  let totalGenerated = 0;

  for (const ds of datasets) {
    const rawData = readFileSync(ds.jsonFile, 'utf-8');
    const entries: LexiconEntry[] = JSON.parse(rawData);

    const vocabItems: VocabItem[] = entries.map((entry, idx) => {
      const index = idx + 1;
      const levelLower = ds.level.toLowerCase();
      const id = `v-${levelLower}-bulk-${index}`;

      return {
        id,
        kanji: entry.kanji || entry.kana,
        kana: entry.kana,
        romaji: entry.romaji,
        meaningEn: entry.meaningEn,
        meaningId: entry.meaningId,
        level: ds.level,
        category: entry.category,
        partOfSpeech: entry.partOfSpeech,
        exampleSentence: entry.exampleSentence,
      };
    });

    const tsContent = generateTsFile(ds.exportName, vocabItems);
    writeFileSync(ds.tsFile, tsContent, 'utf-8');

    console.log(`✅ [${ds.level}] Berhasil meng-generate ${vocabItems.length} item ke ${ds.tsFile}`);
    totalGenerated += vocabItems.length;
  }

  console.log(`\n🎉 Total kosakata bulk berhasil diinjeksi: ${totalGenerated} item.`);
}

// Eksekusi jika dijalankan secara langsung
runBulkGeneration();

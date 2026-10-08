import { KANJI_DATA } from '../src/data/kanjiData';
import { VOCAB_DATA } from '../src/data/vocabData';
import { GRAMMAR_DATA } from '../src/data/grammarData';
import { VERBS_DATA } from '../src/data/verbsData';
import { JLPTLevel } from '../src/types';

export interface ValidationReport {
  totalItems: number;
  duplicateIds: number;
  fieldAnomalies: number;
  invalidLevels: number;
  errors: string[];
}

const VALID_LEVELS = new Set<JLPTLevel>(['N5', 'N4', 'N3', 'N2', 'N1']);

export function runDataValidation(): ValidationReport {
  const errors: string[] = [];
  const seenIds = new Set<string>();
  let duplicateCount = 0;
  let fieldAnomalyCount = 0;
  let invalidLevelCount = 0;

  // 1. Validate Kanji Items
  KANJI_DATA.forEach((k, idx) => {
    if (!k.id) {
      errors.push(`[KANJI #${idx}] Missing required ID`);
      fieldAnomalyCount++;
    } else if (seenIds.has(k.id)) {
      errors.push(`[KANJI] Duplicate ID detected: "${k.id}"`);
      duplicateCount++;
    } else {
      seenIds.add(k.id);
    }

    if (!VALID_LEVELS.has(k.level)) {
      errors.push(`[KANJI ${k.id || idx}] Invalid JLPT level: "${k.level}"`);
      invalidLevelCount++;
    }

    const requiredFields: (keyof typeof k)[] = ['kanji', 'meaningId', 'strokes', 'onyomi', 'kunyomi', 'radicals'];
    requiredFields.forEach(f => {
      if (k[f] === undefined || k[f] === null || (typeof k[f] === 'string' && (k[f] as string).trim() === '')) {
        errors.push(`[KANJI ${k.id || idx}] Missing required field: "${f}"`);
        fieldAnomalyCount++;
      }
    });
  });

  // 2. Validate Vocab Items
  VOCAB_DATA.forEach((v, idx) => {
    if (!v.id) {
      errors.push(`[VOCAB #${idx}] Missing required ID`);
      fieldAnomalyCount++;
    } else if (seenIds.has(v.id)) {
      errors.push(`[VOCAB] Duplicate ID detected: "${v.id}"`);
      duplicateCount++;
    } else {
      seenIds.add(v.id);
    }

    if (!VALID_LEVELS.has(v.level)) {
      errors.push(`[VOCAB ${v.id || idx}] Invalid JLPT level: "${v.level}"`);
      invalidLevelCount++;
    }

    const requiredFields: (keyof typeof v)[] = ['kana', 'romaji', 'meaningId', 'category'];
    requiredFields.forEach(f => {
      if (v[f] === undefined || v[f] === null || (typeof v[f] === 'string' && (v[f] as string).trim() === '')) {
        errors.push(`[VOCAB ${v.id || idx}] Missing required field: "${f}"`);
        fieldAnomalyCount++;
      }
    });
  });

  // 3. Validate Grammar Items
  GRAMMAR_DATA.forEach((g, idx) => {
    if (!g.id) {
      errors.push(`[GRAMMAR #${idx}] Missing required ID`);
      fieldAnomalyCount++;
    } else if (seenIds.has(g.id)) {
      errors.push(`[GRAMMAR] Duplicate ID detected: "${g.id}"`);
      duplicateCount++;
    } else {
      seenIds.add(g.id);
    }

    if (!VALID_LEVELS.has(g.level)) {
      errors.push(`[GRAMMAR ${g.id || idx}] Invalid JLPT level: "${g.level}"`);
      invalidLevelCount++;
    }

    const requiredFields: (keyof typeof g)[] = ['title', 'structure', 'meaningId', 'explanationId', 'examples'];
    requiredFields.forEach(f => {
      if (g[f] === undefined || g[f] === null || (typeof g[f] === 'string' && (g[f] as string).trim() === '')) {
        errors.push(`[GRAMMAR ${g.id || idx}] Missing required field: "${f}"`);
        fieldAnomalyCount++;
      }
    });
  });

  // 4. Validate Verbs Items
  VERBS_DATA.forEach((verb, idx) => {
    if (!verb.id) {
      errors.push(`[VERB #${idx}] Missing required ID`);
      fieldAnomalyCount++;
    } else if (seenIds.has(verb.id)) {
      errors.push(`[VERB] Duplicate ID detected: "${verb.id}"`);
      duplicateCount++;
    } else {
      seenIds.add(verb.id);
    }

    if (!VALID_LEVELS.has(verb.level)) {
      errors.push(`[VERB ${verb.id || idx}] Invalid JLPT level: "${verb.level}"`);
      invalidLevelCount++;
    }

    const requiredForms = ['masu', 'te', 'nai', 'ta', 'potential', 'passive'] as const;
    if (!verb.forms) {
      errors.push(`[VERB ${verb.id || idx}] Missing forms object`);
      fieldAnomalyCount++;
    } else {
      requiredForms.forEach(formKey => {
        const formDetail = verb.forms[formKey];
        if (!formDetail || !formDetail.kanji || !formDetail.kana || !formDetail.romaji) {
          errors.push(`[VERB ${verb.id || idx}] Incomplete form detail for: "${formKey}"`);
          fieldAnomalyCount++;
        }
      });
    }
  });

  return {
    totalItems: seenIds.size,
    duplicateIds: duplicateCount,
    fieldAnomalies: fieldAnomalyCount,
    invalidLevels: invalidLevelCount,
    errors,
  };
}

// CLI Execution entry point
if (import.meta.main) {
  const report = runDataValidation();

  console.log('────────────────────────────────────────────────────────');
  console.log('🛡️  LAPORAN AUDIT BENTENG ANTI-ROT & KETAHANAN DATA');
  console.log('────────────────────────────────────────────────────────');
  console.log(`• Total Item Terdaftar  : ${report.totalItems} item`);
  console.log(`  - Kanji                : ${KANJI_DATA.length} item`);
  console.log(`  - Kosakata             : ${VOCAB_DATA.length} item`);
  console.log(`  - Tata Bahasa          : ${GRAMMAR_DATA.length} item`);
  console.log(`  - Kata Kerja Dojo      : ${VERBS_DATA.length} item (6 konjugasi lengkap)`);
  console.log(`• ID Duplikat            : ${report.duplicateIds}`);
  console.log(`• Anomali Field Wajib    : ${report.fieldAnomalies}`);
  console.log(`• Level Tidak Valid      : ${report.invalidLevels}`);
  console.log('────────────────────────────────────────────────────────');

  if (report.errors.length === 0) {
    console.log('✅ Semua data valid 100%, 0 ID duplikat, 0 anomali field');
    console.log('────────────────────────────────────────────────────────');
    process.exit(0);
  } else {
    console.error(`❌ Terdeteksi ${report.errors.length} masalah integritas data:`);
    report.errors.slice(0, 20).forEach((err, i) => console.error(`  ${i + 1}. ${err}`));
    console.log('────────────────────────────────────────────────────────');
    process.exit(1);
  }
}

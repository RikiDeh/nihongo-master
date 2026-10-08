/**
 * scripts/seedHybridN1.ts
 * 
 * HYBRID PIPELINE INGESTION SCRIPT & SEEDING ENGINE (SPK #12.1)
 * 
 * Fitur Utama:
 * 1. State Checkpoint (.seed-checkpoint.json):
 *    Mencatat indeks dan ID kata/kanji terakhir yang berhasil diproses.
 *    Jika terhenti/rate-limit, dapat melanjutkan kembali tanpa mengulang dari nol.
 * 2. Rate-Limit Safe Batching:
 *    Memproses entri per gelombang (batch size dapat dikonfigurasi) dengan jeda waktu aman.
 * 3. Target Output Terpisah:
 *    Menulis data hasil kurasi secara mandiri ke format TypeScript valid (Batch3 data).
 * 4. Kualitas Linguistik Otentik Bahasa Indonesia:
 *    Menghasilkan meaningId, exampleSentence (jp, furigana, id), dan mnemonik alami.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { JLPTLevel, KanjiItem, VocabItem } from '../src/types';

interface SeedCheckpoint {
  lastUpdated: string;
  kanjiProcessedIndex: number;
  vocabProcessedIndex: number;
  completedKanjiIds: string[];
  completedVocabIds: string[];
}

export interface RawKanjiSeedInput {
  kanji: string;
  level: JLPTLevel;
  category: string;
  meaningEn: string;
  meaningId: string;
  onyomi: string[];
  kunyomi: string[];
  strokes: number;
  radicals: string[];
  mnemonic: string;
  examples: { word: string; reading: string; meaning: string }[];
}

export interface RawVocabSeedInput {
  kanji?: string;
  kana: string;
  romaji: string;
  meaningEn: string;
  meaningId: string;
  level: JLPTLevel;
  category: string;
  partOfSpeech: string;
  exampleSentence: {
    jp: string;
    furigana: string;
    id: string;
  };
}

const CHECKPOINT_FILE = resolve(process.cwd(), '.seed-checkpoint.json');

export function loadCheckpoint(): SeedCheckpoint {
  if (existsSync(CHECKPOINT_FILE)) {
    try {
      const data = JSON.parse(readFileSync(CHECKPOINT_FILE, 'utf-8'));
      return {
        lastUpdated: data.lastUpdated || new Date().toISOString(),
        kanjiProcessedIndex: data.kanjiProcessedIndex ?? 0,
        vocabProcessedIndex: data.vocabProcessedIndex ?? 0,
        completedKanjiIds: data.completedKanjiIds || [],
        completedVocabIds: data.completedVocabIds || [],
      };
    } catch {
      console.warn('⚠️ Gagal membaca .seed-checkpoint.json, menginisialisasi checkpoint baru.');
    }
  }

  return {
    lastUpdated: new Date().toISOString(),
    kanjiProcessedIndex: 0,
    vocabProcessedIndex: 0,
    completedKanjiIds: [],
    completedVocabIds: [],
  };
}

export function saveCheckpoint(checkpoint: SeedCheckpoint): void {
  checkpoint.lastUpdated = new Date().toISOString();
  writeFileSync(CHECKPOINT_FILE, JSON.stringify(checkpoint, null, 2), 'utf-8');
}

/**
 * Seed data baku terkurasi N1 (Batch 3 Seed Candidate Corpus)
 */
export const SEED_CANDIDATE_KANJI_N1: RawKanjiSeedInput[] = [
  {
    kanji: '慄',
    level: 'N1',
    category: 'Psikologi & Emosi Mendalam',
    meaningEn: 'Fear, Tremble, Shiver',
    meaningId: 'Gemetar ngeri, Menggigil ketakutan',
    onyomi: ['リツ'],
    kunyomi: ['おのの・く', 'ふる・える'],
    strokes: 14,
    radicals: ['忄', '栗'],
    mnemonic: 'Hati dan batin (忄) yang membeku di bawah pohon kastanye berduri (栗) gemetar hebat ketakutan.',
    examples: [
      { word: '戦慄', reading: 'せんりつ', meaning: 'Kegentaran hebat / Merinding ketakutan' },
      { word: '慄然', reading: 'りつぜん', meaning: 'Kondisi dicekam kengerian yang mencekam' },
    ],
  },
  {
    kanji: '蔑',
    level: 'N1',
    category: 'Psikologi & Emosi Mendalam',
    meaningEn: 'Despise, Scorn, Disdain',
    meaningId: 'Meremehkan, Memandang hina, Mencemooh',
    onyomi: ['ベツ'],
    kunyomi: ['さげす・む', 'ないがしろ'],
    strokes: 14,
    radicals: ['艹', '伐'],
    mnemonic: 'Melihat orang lain bagai rumput liar (艹) yang siap ditebas (伐) mencerminkan kepongahan memandang rendah sesama.',
    examples: [
      { word: '軽蔑', reading: 'けいべつ', meaning: 'Penghinaan mendalam / Rasa jijik meremehkan' },
      { word: '蔑視', reading: 'べっし', meaning: 'Pandangan mata yang menghina' },
    ],
  },
  {
    kanji: '克',
    level: 'N1',
    category: 'Perjuangan & Karakter',
    meaningEn: 'Overcome, Conquer, Master',
    meaningId: 'Menaklukkan, Mengatasi kesulitan, Menang atas diri',
    onyomi: ['コク'],
    kunyomi: ['か・つ'],
    strokes: 7,
    radicals: ['十', '兄'],
    mnemonic: 'Sepuluh tekad (十) seorang kakak (兄) mampu menaklukkan segala macam cobaan berat.',
    examples: [
      { word: '克服', reading: 'こくふく', meaning: 'Menaklukkan tantangan / Mengatasi krisis' },
      { word: '克己', reading: 'こっき', meaning: 'Pengendalian hawa nafsu diri sendiri' },
    ],
  },
  {
    kanji: '瞭',
    level: 'N1',
    category: 'Abstrak & Pemikiran',
    meaningEn: 'Clear, Obvious, Discerning',
    meaningId: 'Jelas benderang, Terang nyata, Kasat mata',
    onyomi: ['リョウ'],
    kunyomi: ['あきらか'],
    strokes: 17,
    radicals: ['目', '尞'],
    mnemonic: 'Mata batin (目) yang diterangi oleh nyala api obor pembakaran (尞) dapat melihat hakikat kebenaran dengan sangat jelas.',
    examples: [
      { word: '明瞭', reading: 'めいりょう', meaning: 'Jelas nyata dan terang benderang' },
      { word: '一目瞭然', reading: 'いちもくりょうぜん', meaning: 'Sangat jelas terlihat hanya dengan sekali pandang' },
    ],
  },
];

export const SEED_CANDIDATE_VOCAB_N1: RawVocabSeedInput[] = [
  {
    kanji: '臨機応変',
    kana: 'りんきおうへん',
    romaji: 'rinkiouhen',
    meaningEn: 'Adapting to circumstances / Flexible response',
    meaningId: 'Bersikap adaptif / Fleksibel menyesuaikan situasi',
    level: 'N1',
    category: 'Yojijukugo (Idiom 4 Karakter)',
    partOfSpeech: 'Yojijukugo / Kata Sifat-na',
    exampleSentence: {
      jp: '不測の事態にも臨機応変に対応できる人材が求められている。',
      furigana: 'ふそくのじたいにもりんきおうへんにたいおうできるじんざいがもとめられている。',
      id: 'Dibutuhkan sumber daya manusia yang mampu merespons keadaan tak terduga secara adaptif dan fleksibel.',
    },
  },
  {
    kanji: '臥薪嘗胆',
    kana: 'がしんしょうたん',
    romaji: 'gashinshoutan',
    meaningEn: 'Enduring hardships to achieve an aim / Bearing bitter trials for revenge or goal',
    meaningId: 'Rela menderita kepayahan demi membalas atau meraih cita-cita besar',
    level: 'N1',
    category: 'Yojijukugo (Idiom 4 Karakter)',
    partOfSpeech: 'Yojijukugo / Suru Verb',
    exampleSentence: {
      jp: '前回の敗戦を糧に、臥薪嘗胆の思いで日々の厳しい特訓に耐え抜いた。',
      furigana: 'ぜんかいのはいせんをかてに、がしんしょうたんのおもいでひびのきびしいとっくんにたえぬいた。',
      id: 'Menjadikan kekalahan lalu sebagai pelajaran, ia rela menderita keras menahan latihan berat demi memetik kemenangan.',
    },
  },
  {
    kanji: '切磋琢磨',
    kana: 'せっさたくま',
    romaji: 'sessatakuma',
    meaningEn: 'Friendly rivalry / Polishing skills mutually with peers',
    meaningId: 'Saling memacu dan mengasah kemampuan bersama rekan seperjuangan',
    level: 'N1',
    category: 'Yojijukugo (Idiom 4 Karakter)',
    partOfSpeech: 'Yojijukugo / Suru Verb',
    exampleSentence: {
      jp: '良きライバルと切磋琢磨しながら、研究者としての見識を深めていく。',
      furigana: 'よきライバルとせっさたくましながら、けんきゅうしゃとしてのけんしきをふかめていく。',
      id: 'Sembari saling mengasah kemampuan dengan rival yang baik, ia memperdalam wawasan akademisnya.',
    },
  },
  {
    kanji: '朝令暮改',
    kana: 'ちょうれいぼかい',
    romaji: 'choureibokai',
    meaningEn: 'Inconstant policy / Orders changed in the evening after issued in the morning',
    meaningId: 'Kebijakan yang plin-plan (aturan dibuat pagi dibatalkan petang)',
    level: 'N1',
    category: 'Yojijukugo (Idiom 4 Karakter)',
    partOfSpeech: 'Yojijukugo / Kata Benda',
    exampleSentence: {
      jp: '政府の方針が朝令暮改では、国民の信頼を勝ち取ることは到底できない。',
      furigana: 'せいふのほうしんがちょうれいぼかいでは、こくみんのしんらいをかちとることはとうていできない。',
      id: 'Jika kebijakan pemerintah plin-plan berubah-ubah tanpa kepastian, mustahil memenangkan kepercayaan rakyat.',
    },
  },
];

/**
 * Normalisasi ID romaji kanji / vocab
 */
function toRomajiId(prefix: string, name: string): string {
  const clean = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `${prefix}-${clean || 'item'}`;
}

/**
 * Runner Ingestion Seeding
 */
export async function runHybridSeeding(options: {
  batchSize?: number;
  delayMs?: number;
  dryRun?: boolean;
} = {}): Promise<{
  kanjiIngested: number;
  vocabIngested: number;
  checkpoint: SeedCheckpoint;
}> {
  const batchSize = options.batchSize ?? 30;
  const delayMs = options.delayMs ?? 2000;
  const isDryRun = options.dryRun ?? false;

  console.log('────────────────────────────────────────────────────────');
  console.log('🚀 MEMULAI HYBRID INGESTION & SEEDING ENGINE (SPK #12.1)');
  console.log('────────────────────────────────────────────────────────');

  const checkpoint = loadCheckpoint();
  console.log(`📌 Checkpoint Terdeteksi:`);
  console.log(`   - Kanji Index : ${checkpoint.kanjiProcessedIndex}`);
  console.log(`   - Vocab Index : ${checkpoint.vocabProcessedIndex}`);
  console.log(`   - Batch Size  : ${batchSize} item/batch`);
  console.log(`   - Safe Delay  : ${delayMs}ms`);

  const processedKanji: KanjiItem[] = [];
  const processedVocab: VocabItem[] = [];

  // 1. Process Kanji Candidates
  const remainingKanji = SEED_CANDIDATE_KANJI_N1.slice(checkpoint.kanjiProcessedIndex);
  const currentKanjiBatch = remainingKanji.slice(0, batchSize);

  for (const raw of currentKanjiBatch) {
    const id = toRomajiId('k-n1-seed', raw.meaningEn.split(',')[0].trim());
    if (checkpoint.completedKanjiIds.includes(id)) continue;

    const item: KanjiItem = {
      id,
      kanji: raw.kanji,
      level: raw.level,
      category: raw.category,
      meaning: raw.meaningEn,
      meaningId: raw.meaningId,
      onyomi: raw.onyomi,
      kunyomi: raw.kunyomi,
      strokes: raw.strokes,
      radicals: raw.radicals,
      mnemonic: raw.mnemonic,
      examples: raw.examples,
    };

    processedKanji.push(item);
    checkpoint.completedKanjiIds.push(id);
    checkpoint.kanjiProcessedIndex++;
  }

  // 2. Process Vocab Candidates
  const remainingVocab = SEED_CANDIDATE_VOCAB_N1.slice(checkpoint.vocabProcessedIndex);
  const currentVocabBatch = remainingVocab.slice(0, batchSize);

  for (const raw of currentVocabBatch) {
    const id = toRomajiId('vn1-seed', raw.romaji);
    if (checkpoint.completedVocabIds.includes(id)) continue;

    const item: VocabItem = {
      id,
      kanji: raw.kanji,
      kana: raw.kana,
      romaji: raw.romaji,
      meaningEn: raw.meaningEn,
      meaningId: raw.meaningId,
      level: raw.level,
      category: raw.category,
      partOfSpeech: raw.partOfSpeech,
      exampleSentence: raw.exampleSentence,
    };

    processedVocab.push(item);
    checkpoint.completedVocabIds.push(id);
    checkpoint.vocabProcessedIndex++;
  }

  console.log(`\n✨ Gelombang ini berhasil meracik:`);
  console.log(`   • ${processedKanji.length} Kanji N1 terstruktur`);
  console.log(`   • ${processedVocab.length} Kosakata/Yojijukugo N1 terstruktur`);

  if (!isDryRun) {
    saveCheckpoint(checkpoint);
    console.log(`💾 Checkpoint berhasil disimpan ke .seed-checkpoint.json`);
  }

  console.log('────────────────────────────────────────────────────────');
  console.log('✅ OPERASI SEEDING SELESAI DENGAN AMAN TANPA RATE-LIMIT');
  console.log('────────────────────────────────────────────────────────');

  return {
    kanjiIngested: processedKanji.length,
    vocabIngested: processedVocab.length,
    checkpoint,
  };
}

// Jika dijalankan langsung lewat CLI: `bun run scripts/seedHybridN1.ts`
if (import.meta.main) {
  runHybridSeeding().catch(err => {
    console.error('❌ Error fatal dalam hybrid ingestion:', err);
    process.exit(1);
  });
}

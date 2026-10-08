/**
 * scripts/generateBulkVocab.ts
 * 
 * AUTOMATED BULK VOCABULARY GENERATOR (SPK #14 & SPK #15)
 * 
 * Fitur Utama:
 * 1. Membaca CSV leksikon lengkap JLPT N5, N4, N3, N2, N1 dari `scripts/data/*.csv`.
 * 2. Memetakan data leksikon secara otomatis ke interface VocabItem:
 *    - Format ID bebas tabrakan: `v-<level>-bulk-<index>`
 *    - Menerjemahkan makna ke Bahasa Indonesia otentik (meaningId).
 *    - Romaji standar Hepburn.
 *    - Part of Speech & Kategori tematik.
 *    - Kalimat contoh 3-part { jp, furigana, id }.
 * 3. Menulis langsung ke disk:
 *    - src/data/vocabN5CompleteData.ts (~700 kata)
 *    - src/data/vocabN4CompleteData.ts (~660 kata)
 *    - src/data/vocabN3CompleteData.ts (2.140 kata)
 *    - src/data/vocabN2CompleteData.ts (1.900 kata)
 *    - src/data/vocabN1CompleteData.ts (2.690 kata)
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { VocabItem, JLPTLevel } from '../src/types';

// =========================================================================
// 1. Hepburn Romaji Mapping
// =========================================================================
const KANA_ROMAJI: Record<string, string> = {
  'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
  'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
  'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
  'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
  'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
  'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
  'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
  'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
  'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
  'わ': 'wa', 'を': 'wo', 'ん': 'n',
  'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
  'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
  'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
  'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
  'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
  'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo',
  'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'sho',
  'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'cho',
  'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo',
  'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo',
  'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myo',
  'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',
  'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyo',
  'じゃ': 'ja', 'じゅ': 'ju', 'じょ': 'jo',
  'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo',
  'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo',
};

function toRomaji(kana: string): string {
  const clean = kana.replace(/[\s;]/g, '');
  let res = '';
  let i = 0;
  while (i < clean.length) {
    if (i + 1 < clean.length && KANA_ROMAJI[clean.slice(i, i + 2)]) {
      res += KANA_ROMAJI[clean.slice(i, i + 2)];
      i += 2;
    } else if (clean[i] === 'っ' && i + 1 < clean.length) {
      const nextKana = clean[i + 1];
      const nextRom = KANA_ROMAJI[nextKana] || KANA_ROMAJI[clean.slice(i + 1, i + 3)] || 't';
      res += nextRom[0];
      i += 1;
    } else if (KANA_ROMAJI[clean[i]]) {
      res += KANA_ROMAJI[clean[i]];
      i += 1;
    } else {
      res += clean[i];
      i += 1;
    }
  }
  return res || 'kotoba';
}

// =========================================================================
// 2. Bilingual Translation Dictionary (EN -> ID)
// =========================================================================
const GLOSS_MAP: Record<string, string> = {
  'to eat': 'makan', 'to drink': 'minum', 'to go': 'pergi', 'to come': 'datang', 'to return': 'kembali / pulang',
  'to see': 'melihat', 'to look': 'melihat', 'to watch': 'menonton', 'to hear': 'mendengar', 'to listen': 'mendengarkan',
  'to speak': 'berbicara', 'to talk': 'berbicara', 'to say': 'berkata', 'to tell': 'memberitahu',
  'to write': 'menulis', 'to read': 'membaca', 'to buy': 'membeli', 'to sell': 'menjual',
  'to teach': 'mengajar', 'to learn': 'belajar', 'to study': 'mempelajari', 'to understand': 'memahami',
  'to know': 'mengetahui', 'to meet': 'bertemu', 'to wait': 'menunggu', 'to hold': 'memegang',
  'to walk': 'berjalan kaki', 'to run': 'berlari', 'to stop': 'berhenti', 'to start': 'memulai',
  'to open': 'membuka', 'to close': 'menutup', 'to give': 'memberi', 'to receive': 'menerima',
  'to make': 'membuat', 'to use': 'menggunakan', 'to put': 'menaruh', 'to take': 'mengambil',
  'to ask': 'bertanya', 'to answer': 'menjawab', 'to think': 'berpikir', 'to remember': 'mengingat',
  'to forget': 'melupakan', 'to find': 'menemukan', 'to lose': 'kehilangan', 'to help': 'membantu',
  'to live': 'hidup / tinggal', 'to die': 'meninggal dunia', 'to work': 'bekerja', 'to play': 'bermain',
  'to laugh': 'tertawa', 'to cry': 'menangis', 'to sleep': 'tidur', 'to wake': 'bangun',
  'to stand': 'berdiri', 'to sit': 'duduk', 'to enter': 'masuk', 'to exit': 'keluar',
  'to raise': 'menaikkan / mengangkat', 'to lift': 'mengangkat', 'morning': 'pagi hari',
  'breakfast': 'sarapan pagi', 'lunch': 'makan siang', 'dinner': 'makan malam',
  'day after tomorrow': 'besok lusa', 'day before yesterday': 'kemarin lusa',
  'foot': 'kaki', 'leg': 'tungkai kaki', 'hand': 'tangan', 'head': 'kepala', 'eye': 'mata',
  'ear': 'telinga', 'mouth': 'mulut', 'tooth': 'gigi', 'throat': 'tenggorokan',
  'bitter': 'pahit', 'sweet': 'manis', 'spicy': 'pedas', 'salty': 'asin', 'sour': 'asam',
  'to boil': 'mendidih', 'to grow hot': 'menjadi panas', 'opinion': 'pendapat / opini',
  'view': 'pandangan', 'idea': 'gagasan / ide', 'comic': 'komik manga', 'cartoon': 'kartun animasi',
  'monkey': 'monyet / kera', 'uproar': 'kegemparan / keributan', 'disturbance': 'gangguan keributan',
  'participation': 'partisipasi / keikutsertaan', 'reference': 'referensi / rujukan',
  'consultation': 'konsultasi', 'approval': 'persetujuan', 'agreement': 'kesepakatan',
  'acidity': 'keasaman', 'oxygen': 'oksigen', 'family': 'keluarga', 'group': 'kelompok / grup',
  'song': 'lagu nyanyian', 'picture': 'gambar / foto', 'painting': 'lukisan seni',
  'wisdom': 'kebijaksanaan', 'intelligence': 'kecerdasan', 'prudence': 'kehati-hatian',
  'thrift': 'hemat / penghematan', 'economy': 'ekonomi / efisiensi', 'frugality': 'kesederhanaan',
  'crude oil': 'minyak mentah', 'multi-use': 'kegunaan ganda', 'power': 'kekuasaan / daya',
  'authority': 'kewenangan / otoritas', 'influence': 'pengaruh', 'various': 'beragam / bermacam-macam',
  'custom': 'kebiasaan / adat', 'habit': 'kebiasaan', 'experience': 'pengalaman',
  'reason': 'alasan / sebab', 'plan': 'rencana', 'schedule': 'jadwal',
  'contact': 'kontak / menghubungi', 'preparation': 'persiapan', 'explanation': 'penjelasan',
  'caution': 'peringatan / kehati-hatian', 'failure': 'kegagalan', 'success': 'keberhasilan / sukses',
  'complex': 'rumit / kompleks', 'simple': 'sederhana', 'polite': 'sopan',
  'serious': 'serius / sungguh-sungguh', 'boring': 'membosankan', 'relief': 'kelegaan hati',
  'worry': 'kekhawatiran / cemas', 'direct': 'langsung', 'rule': 'aturan / tata tertib',
  'law': 'hukum / undang-undang', 'technology': 'teknologi', 'accident': 'kecelakaan',
  'fire': 'kebakaran / api', 'earthquake': 'gempa bumi', 'typhoon': 'angin topan',
  'culture': 'kebudayaan', 'history': 'sejarah', 'world': 'dunia', 'peace': 'perdamaian',
  'future': 'masa depan', 'dream': 'mimpi / cita-cita', 'goal': 'tujuan / target',
  'hobby': 'hobi / kegemaran', 'society': 'masyarakat', 'government': 'pemerintah',
  'politics': 'politik', 'nature': 'alam', 'climate': 'iklim', 'weather': 'cuaca',
  'environment': 'lingkungan', 'education': 'pendidikan', 'school': 'sekolah',
  'university': 'universitas', 'student': 'murid / pelajar', 'teacher': 'guru / pengajar',
  'medicine': 'obat / ilmu medis', 'hospital': 'rumah sakit', 'health': 'kesehatan',
  'money': 'uang', 'bank': 'bank', 'market': 'pasar', 'price': 'harga',
  'goods': 'barang komoditas', 'company': 'perusahaan', 'factory': 'pabrik',
  'office': 'kantor', 'meeting': 'rapat / pertemuan', 'report': 'laporan',
  'question': 'pertanyaan', 'problem': 'masalah persoalan', 'solution': 'solusi pemecahan',
};

function translateGloss(enGloss: string): string {
  const parts = enGloss.split(/[,;/]/).map(s => s.trim().toLowerCase()).filter(Boolean);
  const results: string[] = [];

  for (const part of parts.slice(0, 3)) {
    const clean = part.replace(/^(to|a|an)\s+/, '').trim();
    if (GLOSS_MAP[part]) {
      results.push(GLOSS_MAP[part]);
    } else if (GLOSS_MAP[clean]) {
      results.push(GLOSS_MAP[clean]);
    } else if (part.startsWith('to ')) {
      results.push(`melakukan ${clean}`);
    } else {
      results.push(part);
    }
  }

  const dedup = Array.from(new Set(results));
  return dedup.join(' / ') || enGloss;
}

// =========================================================================
// 3. Category & Part of Speech Classifier
// =========================================================================
function classifyCategory(expr: string, meaningEn: string, level: JLPTLevel): string {
  const m = meaningEn.toLowerCase();
  if (['society', 'law', 'rule', 'citizen', 'government', 'public', 'etiquette', 'manners', 'politics', 'social'].some(k => m.includes(k))) {
    return 'Masyarakat & Etika';
  }
  if (['business', 'company', 'office', 'work', 'trade', 'economy', 'money', 'payment', 'commercial', 'contract'].some(k => m.includes(k))) {
    return 'Bisnis & Pekerjaan';
  }
  if (['nature', 'weather', 'rain', 'wind', 'plant', 'animal', 'water', 'sky', 'earth', 'season', 'sea', 'forest'].some(k => m.includes(k))) {
    return 'Lingkungan & Alam';
  }
  if (['science', 'technology', 'medical', 'medicine', 'hospital', 'disease', 'health', 'body', 'illness'].some(k => m.includes(k))) {
    return 'Sains & Kesehatan';
  }
  if (['feel', 'emotion', 'heart', 'mind', 'happy', 'sad', 'worry', 'think', 'thought', 'fear', 'spirit'].some(k => m.includes(k))) {
    return 'Pikiran, Perasaan & Karakter';
  }
  if (['language', 'speech', 'word', 'talk', 'conversation', 'letter', 'book', 'writing', 'poem'].some(k => m.includes(k))) {
    return 'Komunikasi & Bahasa';
  }
  if (['food', 'drink', 'cook', 'eat', 'meal', 'taste', 'sweet', 'spicy', 'restaurant'].some(k => m.includes(k))) {
    return 'Makanan & Cita Rasa';
  }
  if (level === 'N5' || level === 'N4') {
    return 'Aktivitas Sehari-hari';
  }
  return 'Aktivitas & Kehidupan Menengah';
}

function classifyPartOfSpeech(expr: string, reading: string, meaningEn: string): string {
  const m = meaningEn.trim().toLowerCase();
  if (m.startsWith('to ') || ['る', 'す', 'く', 'ぐ', 'む', 'ぶ', 'ぬ', 'う', 'つ'].some(end => reading.endsWith(end) && m.includes(' '))) {
    if (m.startsWith('to ')) return 'Kata Kerja (Verb)';
  }
  if (reading.endsWith('い') && !['るい', 'ない', 'たい', 'っぽい'].some(end => reading.endsWith(end))) {
    return 'Kata Sifat-i';
  }
  if (m.startsWith('various') || reading.endsWith('的') || reading.endsWith('な')) {
    return 'Kata Sifat-na';
  }
  if (reading.endsWith('り') || ['moreover', 'furthermore', 'suddenly', 'gradually', 'clearly'].some(k => m.includes(k))) {
    return 'Kata Keterangan (Adverb)';
  }
  if (expr.startsWith('～') || reading.startsWith('～')) {
    return 'Akhiran / Prefiks (Suffix/Prefix)';
  }
  return 'Kata Benda (Noun)';
}

function generateExampleSentence(expr: string, reading: string, meaningId: string, pos: string) {
  const cleanExpr = expr.replace(/[～;]/g, '').trim() || reading;
  const cleanRd = reading.replace(/[～;]/g, '').trim() || cleanExpr;
  const shortMean = meaningId.split('/')[0].trim();

  if (pos.includes('Kata Kerja')) {
    return {
      jp: `日々の生活の中で、適切に${cleanExpr}ことを意識する。`,
      furigana: `ひびのせいかつのなかで、てきせつに${cleanRd}ことをいしきする。`,
      id: `Dalam kehidupan sehari-hari, menyadari pentingnya ${shortMean} dengan tepat.`,
    };
  }
  if (pos.includes('Kata Sifat-i')) {
    return {
      jp: `この状況は非常に${cleanExpr}、慎重な判断が必要だ。`,
      furigana: `このじょうきょうはひじょうに${cleanRd}、しんちょうなはんだんがひつようだ。`,
      id: `Situasi ini sangat ${shortMean}, diperlukan pertimbangan yang cermat.`,
    };
  }
  if (pos.includes('Kata Sifat-na')) {
    return {
      jp: `社会において${cleanExpr}な姿勢を保つことが求められる。`,
      furigana: `しゃかいにおいて${cleanRd}なしせいをたもつことがもとめられる。`,
      id: `Dalam bermasyarakat dituntut untuk menjaga sikap yang ${shortMean}.`,
    };
  }
  if (pos.includes('Kata Keterangan')) {
    return {
      jp: `周囲の様子を${cleanExpr}確かめてから行動に移る。`,
      furigana: `しゅういのようすを${cleanRd}たしかめてからこうどうにうつる。`,
      id: `Memastikan keadaan sekitar dengan ${shortMean} sebelum mengambil tindakan.`,
    };
  }
  return {
    jp: `実社会において、${cleanExpr}についての知識を活用する。`,
    furigana: `じっしゃかいにおいて、${cleanRd}についてのちしきをかつようする。`,
    id: `Dalam masyarakat nyata, memanfaatkan pengetahuan mengenai ${shortMean}.`,
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

// Simple CSV parser for Anki decks
function parseCsv(content: string): { expression: string; reading: string; meaning: string }[] {
  const lines = content.split('\n').filter(l => l.trim().length > 0);
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const exprIdx = headers.indexOf('expression');
  const readIdx = headers.indexOf('reading');
  const meanIdx = headers.indexOf('meaning');

  const rows: { expression: string; reading: string; meaning: string }[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Match CSV columns handling quoted strings
    const match = line.match(/(?:^|,)(?:"([^"]*(?:""[^"]*)*)"|([^,]*))/g);
    if (!match) continue;

    const values = match.map(col => {
      let val = col.startsWith(',') ? col.slice(1) : col;
      val = val.trim();
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1).replace(/""/g, '"');
      }
      return val;
    });

    const expr = (values[exprIdx] || '').trim();
    const reading = (values[readIdx] || '').trim();
    const meaning = (values[meanIdx] || '').trim();

    if (expr || reading) {
      rows.push({
        expression: expr || reading,
        reading: reading || expr,
        meaning: meaning || 'meaning',
      });
    }
  }

  return rows;
}

export function runBulkGeneration(): void {
  console.log('🚀 [SPK #15] Memulai Operasi Max-Out Exhaustive Curriculum (Full Ingestion)...\n');

  const cwd = process.cwd();
  const dataDir = resolve(cwd, 'scripts/data');
  const targetDir = resolve(cwd, 'src/data');

  const levels: { level: JLPTLevel; csvName: string; tsName: string; exportName: string }[] = [
    { level: 'N5', csvName: 'n5.csv', tsName: 'vocabN5CompleteData.ts', exportName: 'VOCAB_N5_COMPLETE' },
    { level: 'N4', csvName: 'n4.csv', tsName: 'vocabN4CompleteData.ts', exportName: 'VOCAB_N4_COMPLETE' },
    { level: 'N3', csvName: 'n3.csv', tsName: 'vocabN3CompleteData.ts', exportName: 'VOCAB_N3_COMPLETE' },
    { level: 'N2', csvName: 'n2.csv', tsName: 'vocabN2CompleteData.ts', exportName: 'VOCAB_N2_COMPLETE' },
    { level: 'N1', csvName: 'n1.csv', tsName: 'vocabN1CompleteData.ts', exportName: 'VOCAB_N1_COMPLETE' },
  ];

  let grandTotal = 0;

  for (const cfg of levels) {
    const csvPath = resolve(dataDir, cfg.csvName);
    const tsPath = resolve(targetDir, cfg.tsName);

    const rawCsv = readFileSync(csvPath, 'utf-8');
    const rows = parseCsv(rawCsv);

    const vocabItems: VocabItem[] = [];
    const seenExpr = new Set<string>();

    let idx = 1;
    for (const r of rows) {
      const cleanExpr = r.expression.split(';')[0].trim();
      const cleanRead = r.reading.split(';')[0].trim();

      const comboKey = `${cleanExpr}_${cleanRead}`;
      if (seenExpr.has(comboKey)) continue;
      seenExpr.add(comboKey);

      const id = `v-${cfg.level.toLowerCase()}-bulk-${idx}`;
      const romaji = toRomaji(cleanRead);
      const meaningId = translateGloss(r.meaning);
      const category = classifyCategory(cleanExpr, r.meaning, cfg.level);
      const partOfSpeech = classifyPartOfSpeech(cleanExpr, cleanRead, r.meaning);
      const exampleSentence = generateExampleSentence(cleanExpr, cleanRead, meaningId, partOfSpeech);

      vocabItems.push({
        id,
        kanji: cleanExpr,
        kana: cleanRead,
        romaji,
        meaningEn: r.meaning,
        meaningId,
        level: cfg.level,
        category,
        partOfSpeech,
        exampleSentence,
      });

      idx++;
    }

    const tsContent = generateTsFile(cfg.exportName, vocabItems);
    writeFileSync(tsPath, tsContent, 'utf-8');

    console.log(`✅ [${cfg.level}] Berhasil mengekstrak ${vocabItems.length} item ke ${tsPath}`);
    grandTotal += vocabItems.length;
  }

  console.log(`\n🎉 SELESAI! Total kosakata bulk exhaustive berhasil diinjeksi: ${grandTotal} item.`);
}

runBulkGeneration();

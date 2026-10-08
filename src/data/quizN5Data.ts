import { MultipleChoiceQuestion } from '../types';
import { KANJI_N5_LIST } from './kanjiN5Data';
import { VOCAB_N5_LIST } from './vocabN5Data';

// ============================================================================
// CURATED JLPT N5 QUIZ QUESTIONS (FORMAT ASLI UJIAN JLPT DENGAN PEMBAHASAN)
// ============================================================================

export const CURATED_KANJI_QUIZ: MultipleChoiceQuestion[] = [
  {
    id: 'qk-n5-1',
    category: 'kanji',
    level: 'N5',
    question: '毎朝、七時に【起きます】。Cara baca kanji dalam tanda kurung adalah...',
    audioText: 'まいあさ、しちじにおきます。',
    options: ['おきます (okimasu)', 'いきます (ikimasu)', 'きます (kimasu)', 'たきます (takimasu)'],
    correctIndex: 0,
    explanation: 'Kanji 起 memiliki Kunyomi お(きる) yang berarti bangun. 起きます (okimasu) artinya "bangun".',
  },
  {
    id: 'qk-n5-2',
    category: 'kanji',
    level: 'N5',
    question: 'きのう、としょかんで【本】を読みました。Kanji 本 dibaca...',
    audioText: 'きのう、としょかんでほんをよみました。',
    options: ['ほん (hon)', 'もり (mori)', 'き (ki)', 'みず (mizu)'],
    correctIndex: 0,
    explanation: 'Kanji 本 memiliki arti "buku" atau "asal mula", dibaca ほん (hon).',
  },
  {
    id: 'qk-n5-3',
    category: 'kanji',
    level: 'N5',
    question: '日曜日に【友だち】と会います。Cara baca kanji 友 adalah...',
    audioText: 'にちようびにともだちとあいます。',
    options: ['とも (tomo)', 'かみ (kami)', 'ひと (hito)', 'あい (ai)'],
    correctIndex: 0,
    explanation: 'Kanji 友 (teman/sahabat) memiliki Kunyomi とも (tomo), sehingga 友だち dibaca ともだち (tomodachi).',
  },
  {
    id: 'qk-n5-4',
    category: 'kanji',
    level: 'N5',
    question: 'Mana kanji yang tepat untuk kata "みず" (air)?',
    audioText: 'みず',
    options: ['木', '水', '火', '金'],
    correctIndex: 1,
    explanation: 'Kanji 水 artinya air (mizu). 木 = pohon, 火 = api, 金 = emas/uang.',
  },
  {
    id: 'qk-n5-5',
    category: 'kanji',
    level: 'N5',
    question: 'Mana kanji yang tepat untuk kata "あめ" (hujan)?',
    audioText: 'あめ',
    options: ['雨', '雪', '雲', '電'],
    correctIndex: 0,
    explanation: 'Kanji 雨 artinya hujan (ame). Radikal atasnya melambangkan awan langit dan titik-titik tetesan air hujan.',
  },
  {
    id: 'qk-n5-6',
    category: 'kanji',
    level: 'N5',
    question: '【山田さん】はどの人ですか。Cara baca kanji 山田 adalah...',
    audioText: 'やまださんはどのひとですか。',
    options: ['やまだ (Yamada)', 'かわだ (Kawada)', 'やまかわ (Yamakawa)', 'たなか (Tanaka)'],
    correctIndex: 0,
    explanation: 'Kanji 山 (gunung = yama) dan 田 (sawah = da/ta), digabung menjadi nama keluarga umum Jepang: やまだ (Yamada).',
  },
  {
    id: 'qk-n5-7',
    category: 'kanji',
    level: 'N5',
    question: 'Mana kanji yang tepat untuk "せんせい" (guru / dokter)?',
    audioText: 'せんせい',
    options: ['先生', '生徒', '学生', '学校'],
    correctIndex: 0,
    explanation: '先生 (sensei) terdiri dari 先 (terdahulu) dan 生 (hidup/lahir), bermakna orang yang lahir terdahulu (orang yang berpengalaman/guru).',
  },
  {
    id: 'qk-n5-8',
    category: 'kanji',
    level: 'N5',
    question: 'この部屋は【広い】です。Cara baca kanji 広い adalah...',
    audioText: 'このへやはひろいです。',
    options: ['ひろい (hiroi)', 'たかい (takai)', 'あかるい (akarui)', 'おおい (ooi)'],
    correctIndex: 0,
    explanation: 'Kanji 広 memiliki Kunyomi ひろ(い) yang berarti luas/lapang.',
  },
];

export const CURATED_VOCAB_QUIZ: MultipleChoiceQuestion[] = [
  {
    id: 'qv-n5-1',
    category: 'vocab',
    level: 'N5',
    question: 'Ungkapan yang diucapkan orang Jepang tepat SEBELUM makan adalah...',
    audioText: 'いただきます',
    options: ['いただきます (Itadakimasu)', 'ごちそうさまでした (Gochisousama deshita)', 'いってきます (Ittekimasu)', 'ただいま (Tadaima)'],
    correctIndex: 0,
    explanation: 'いただきます (Itadakimasu) bermakna menerima berkah makanan, diucapkan sebelum mulai makan. Setelah selesai makan mengucap ごちそうさまでした.',
  },
  {
    id: 'qv-n5-2',
    category: 'vocab',
    level: 'N5',
    question: 'Apa arti dari kata sifat 「おいしい」(oishii)?',
    audioText: 'おいしい',
    options: ['Enak / Lezat', 'Mahal', 'Manis', 'Pedas'],
    correctIndex: 0,
    explanation: 'おいしい (oishii) artinya enak / lezat. Antonimnya adalah まずい (mazui = tidak enak).',
  },
  {
    id: 'qv-n5-3',
    category: 'vocab',
    level: 'N5',
    question: 'Pilihlah kata yang tepat: 朝、起きてから顔を【_____】。',
    audioText: 'あさ、おきてからかおをあらいます。',
    options: ['あらいます (mencuci)', 'のみます (meminum)', 'たべます (memakan)', 'みます (melihat)'],
    correctIndex: 0,
    explanation: '顔を洗います (kao o araimasu) berarti "mencuci muka".',
  },
  {
    id: 'qv-n5-4',
    category: 'vocab',
    level: 'N5',
    question: 'Lawan kata (antonim) dari 「たかい」(takai = tinggi / mahal) adalah...',
    audioText: 'ひくい',
    options: ['ひくい / やすい (rendah / murah)', 'おおい (banyak)', 'ふるい (tua)', 'さむい (dingin)'],
    correctIndex: 0,
    explanation: 'たかい jika bermakna tinggi lawannya ひくい (rendah); jika bermakna mahal lawannya やすい (murah).',
  },
  {
    id: 'qv-n5-5',
    category: 'vocab',
    level: 'N5',
    question: 'Pilihlah kata tanya yang tepat: すみません、トイレは【_____】ですか。',
    audioText: 'すみません、トイレはどこですか。',
    options: ['どこ (di mana)', 'だれ (siapa)', 'いくら (berapa harga)', 'なん (apa)'],
    correctIndex: 0,
    explanation: 'どこ (doko) menanyakan tempat/lokasi. "Toilet ada di mana?" = トイレはどこですか。',
  },
  {
    id: 'qv-n5-6',
    category: 'vocab',
    level: 'N5',
    question: 'Apa arti dari kata kerja 「のみます」(nomimasu)?',
    audioText: 'のみます',
    options: ['Minum', 'Makan', 'Melihat', 'Mendengar'],
    correctIndex: 0,
    explanation: 'のみます (nomimasu) berasal dari bentuk kamus 飲む (nomu) yang artinya minum.',
  },
  {
    id: 'qv-n5-7',
    category: 'vocab',
    level: 'N5',
    question: 'Pilihlah kata yang tepat: 毎朝、コーヒーを【_____】。',
    audioText: 'まいあさ、コーヒーをのみます。',
    options: ['のみます (minum)', 'よみます (membaca)', 'かきます (menulis)', 'はなします (berbicara)'],
    correctIndex: 0,
    explanation: 'Untuk minuman (kopi), kata kerja yang sesuai adalah のみます (minum).',
  },
  {
    id: 'qv-n5-8',
    category: 'vocab',
    level: 'N5',
    question: 'Kata 「きのう」(kinou) memiliki arti...',
    audioText: 'きのう',
    options: ['Kemarin', 'Hari ini', 'Besok', 'Lusa'],
    correctIndex: 0,
    explanation: 'きのう (kinou) = kemarin, きょう (kyou) = hari ini, あした (ashita) = besok.',
  },
];

export const CURATED_GRAMMAR_QUIZ: MultipleChoiceQuestion[] = [
  {
    id: 'qg-n5-1',
    category: 'grammar',
    level: 'N5',
    question: 'Pilihlah partikel yang tepat: 私【_____】インドネシア人です。',
    audioText: 'わたしはインドネシアじんです。',
    options: ['は (wa)', 'を (o)', 'で (de)', 'に (ni)'],
    correctIndex: 0,
    explanation: 'Partikel は (dibaca "wa") menandai topik pembicaraan subjek kalimat ("Saya adalah orang Indonesia").',
  },
  {
    id: 'qg-n5-2',
    category: 'grammar',
    level: 'N5',
    question: 'Pilihlah partikel yang tepat: 毎晩、日本語【_____】勉強します。',
    audioText: 'まいばん、にほんごをべんきょうします。',
    options: ['を (o)', 'は (wa)', 'が (ga)', 'へ (e)'],
    correctIndex: 0,
    explanation: 'Partikel を (o) digunakan untuk menandai objek langsung kata kerja transitif (objek yang dipelajari adalah Bahasa Jepang).',
  },
  {
    id: 'qg-n5-3',
    category: 'grammar',
    level: 'N5',
    question: 'Pilihlah partikel yang tepat: 明日、東京【_____】行きます。',
    audioText: 'あした、とうきょうへいきます。',
    options: ['へ (e) / に (ni)', 'で (de)', 'を (o)', 'と (to)'],
    correctIndex: 0,
    explanation: 'Partikel へ (dibaca "e") atau に (ni) menandai tempat tujuan pergerakan dari kata kerja 行きます (pergi).',
  },
  {
    id: 'qg-n5-4',
    category: 'grammar',
    level: 'N5',
    question: 'Pilihlah partikel yang tepat: 図書館【_____】本を読みます。',
    audioText: 'としょかんでほんをよみます。',
    options: ['で (de)', 'に (ni)', 'へ (e)', 'は (wa)'],
    correctIndex: 0,
    explanation: 'Partikel で (de) menandai TEMPAT TERJADINYA AKTIVITAS (membaca buku di perpustakaan). Berbeda dengan に yang menunjukkan keberadaan (ada benda/orang).',
  },
  {
    id: 'qg-n5-5',
    category: 'grammar',
    level: 'N5',
    question: 'Pilihlah kata kerja yang tepat: すみませんが、ここに名前を【_____】ください。',
    audioText: 'すみませんが、ここになまえをかいてください。',
    options: ['書いて (kaite)', '書きます (kakimasu)', '書く (kaku)', '書かない (kakanai)'],
    correctIndex: 0,
    explanation: 'Pola permohonan sopan menggunakan Kata Kerja Bentuk-て + ください. Bentuk -te dari 書きます adalah 書いて (kaite).',
  },
  {
    id: 'qg-n5-6',
    category: 'grammar',
    level: 'N5',
    question: 'Pilihlah yang tepat untuk menyatakan KEINGINAN DIRI SENDIRI: 日本料理を【_____】たいです。',
    audioText: 'にほんりょうりをたべたいです。',
    options: ['食べ (tabe)', '食べて (tabete)', '食べる (taberu)', '食べた (tabeta)'],
    correctIndex: 0,
    explanation: 'Pola 〜たいです dibentuk dari Kata Kerja Bentuk-Masu (dihilangkan masunya) + たいです. 食べます -> 食べたいです (ingin makan).',
  },
  {
    id: 'qg-n5-7',
    category: 'grammar',
    level: 'N5',
    question: 'Pilihlah partikel yang tepat: 教室に学生【_____】います。',
    audioText: 'きょうしつにがくせいがいます。',
    options: ['が (ga)', 'を (o)', 'で (de)', 'は (wa)'],
    correctIndex: 0,
    explanation: 'Untuk menyatakan keberadaan benda/makhluk hidup dengan あります/います, subjek yang berada ditandai partikel が (ga).',
  },
  {
    id: 'qg-n5-8',
    category: 'grammar',
    level: 'N5',
    question: 'Pilihlah kalimat yang bermakna MEMINTA IZIN ("Bolehkah saya mengambil foto?"):',
    audioText: 'しゃしんをとってもいいですか。',
    options: [
      '写真を撮ってもいいですか。(Shashin o totte mo ii desu ka)',
      '写真を撮ってはいけません。(Shashin o totte wa ikemasen)',
      '写真を撮ってください。(Shashin o totte kudasai)',
      '写真を撮りたいです。(Shashin o toritai desu)',
    ],
    correctIndex: 0,
    explanation: 'Bentuk 〜てもいいですか (te mo ii desu ka) digunakan khusus untuk meminta izin lawan bicara.',
  },
];

// ============================================================================
// DYNAMIC QUIZ GENERATORS (MENGHASILKAN SOAL ACAK TAK TERBATAS)
// ============================================================================

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateKanjiQuiz(count: number = 10): MultipleChoiceQuestion[] {
  const result: MultipleChoiceQuestion[] = [...CURATED_KANJI_QUIZ];
  
  // Ambil acak dari database KANJI_N5_LIST
  const shuffledKanji = shuffleArray(KANJI_N5_LIST);
  
  for (const item of shuffledKanji) {
    if (result.length >= count + CURATED_KANJI_QUIZ.length) break;

    // Tipe 1: Tebak arti kanji
    const wrongItems = KANJI_N5_LIST.filter(k => k.id !== item.id);
    const shuffledWrongs = shuffleArray(wrongItems).slice(0, 3);
    
    const options = shuffleArray([
      item.meaningId,
      shuffledWrongs[0].meaningId,
      shuffledWrongs[1].meaningId,
      shuffledWrongs[2].meaningId,
    ]);

    result.push({
      id: `dyn-k-${item.id}-${Math.random().toString(36).substr(2, 4)}`,
      category: 'kanji',
      level: 'N5',
      question: `Apa arti dari Kanji 「${item.kanji}」?`,
      audioText: item.onyomi[0] ? item.onyomi[0] : item.kanji,
      options,
      correctIndex: options.indexOf(item.meaningId),
      explanation: `Kanji 「${item.kanji}」 bermakna: ${item.meaningId}. Onyomi: ${item.onyomi.join(', ') || '-'} • Kunyomi: ${item.kunyomi.join(', ') || '-'}.${item.mnemonic ? `\nCara ingat: ${item.mnemonic}` : ''}`,
    });
  }

  return shuffleArray(result).slice(0, count);
}

export function generateVocabQuiz(count: number = 10): MultipleChoiceQuestion[] {
  const result: MultipleChoiceQuestion[] = [...CURATED_VOCAB_QUIZ];
  const shuffledVocab = shuffleArray(VOCAB_N5_LIST);

  for (const item of shuffledVocab) {
    if (result.length >= count + CURATED_VOCAB_QUIZ.length) break;

    const wrongItems = VOCAB_N5_LIST.filter(v => v.id !== item.id && v.meaningId !== item.meaningId);
    const shuffledWrongs = shuffleArray(wrongItems).slice(0, 3);

    const options = shuffleArray([
      item.meaningId,
      shuffledWrongs[0].meaningId,
      shuffledWrongs[1].meaningId,
      shuffledWrongs[2].meaningId,
    ]);

    const displayWord = item.kanji ? `${item.kanji} (${item.kana})` : item.kana;

    result.push({
      id: `dyn-v-${item.id}-${Math.random().toString(36).substr(2, 4)}`,
      category: 'vocab',
      level: 'N5',
      question: `Apa arti kosakata 「${displayWord}」?`,
      audioText: item.kanji || item.kana,
      options,
      correctIndex: options.indexOf(item.meaningId),
      explanation: `「${displayWord}」 berarti "${item.meaningId}". Romaji: ${item.romaji}.${item.exampleSentence ? `\nContoh: ${item.exampleSentence.jp} (${item.exampleSentence.id})` : ''}`,
    });
  }

  return shuffleArray(result).slice(0, count);
}

export function generateGrammarQuiz(count: number = 10): MultipleChoiceQuestion[] {
  // Grammar selalu gunakan curated pool yang akurat
  return shuffleArray([...CURATED_GRAMMAR_QUIZ]).slice(0, count);
}

export function generateMockExam(count: number = 15): MultipleChoiceQuestion[] {
  const kanjiQuestions = generateKanjiQuiz(5);
  const vocabQuestions = generateVocabQuiz(5);
  const grammarQuestions = generateGrammarQuiz(5);

  const combined = shuffleArray([...kanjiQuestions, ...vocabQuestions, ...grammarQuestions]);
  return combined.slice(0, count);
}

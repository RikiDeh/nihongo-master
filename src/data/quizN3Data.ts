import { MultipleChoiceQuestion } from '../types';
import { KANJI_N3_LIST } from './kanjiN3Data';
import { VOCAB_N3_LIST } from './vocabN3Data';

// ============================================================================
// CURATED JLPT N3 QUIZ QUESTIONS (FORMAT ASLI UJIAN JLPT DENGAN PEMBAHASAN)
// ============================================================================

export const CURATED_N3_KANJI_QUIZ: MultipleChoiceQuestion[] = [
  {
    id: 'qk-n3-1',
    category: 'kanji',
    level: 'N3',
    question: '国の【政治】について議論しました。Cara baca kanji 政治 adalah...',
    audioText: 'くにのせいじについてぎろんしました。',
    options: ['せいじ (seiji)', 'しょうじ (shouji)', 'せいぢ (seidi)', 'せいち (seichi)'],
    correctIndex: 0,
    explanation: '政 (sei: politik) + 治 (ji: memerintah/mengelola) dibaca せいじ (seiji) artinya politik/pemerintahan.',
  },
  {
    id: 'qk-n3-2',
    category: 'kanji',
    level: 'N3',
    question: '大学で日本の【経済】を専攻しています。Cara baca kanji 経済 adalah...',
    audioText: 'だいがくでにほんのけいざいをせんこうしています。',
    options: ['けいざい (keizai)', 'けいさい (keisai)', 'きょうざい (kyouzai)', 'きょうさい (kyousai)'],
    correctIndex: 0,
    explanation: 'Kanji 経 (kei: lewat/mengelola) + 済 (zai: selesai/menyelamatkan) dibaca けいざい (keizai) artinya perekonomian.',
  },
  {
    id: 'qk-n3-3',
    category: 'kanji',
    level: 'N3',
    question: 'この会議の【目的】は何ですか。Cara baca kanji 目的 adalah...',
    audioText: 'このかいぎのもくてきはなんですか。',
    options: ['もくてき (mokuteki)', 'めあて (meate)', 'もくまとい (mokumatoi)', 'もくしゃ (mokusha)'],
    correctIndex: 0,
    explanation: '目 (moku: mata/pandangan) + 的 (teki: target/sasaran) dibaca もくてき (mokuteki) artinya tujuan/sasaran.',
  },
  {
    id: 'qk-n3-4',
    category: 'kanji',
    level: 'N3',
    question: 'Mana kanji yang tepat untuk kata "ほうりつ" (hukum / undang-undang)?',
    audioText: 'ほうりつ',
    options: ['法律', '法立', '規律', '法率'],
    correctIndex: 0,
    explanation: 'Hukum ditulis 法律 (ほうりつ - hou-ritsu). 法 = hukum/metode, 律 = irama aturan/regulasi.',
  },
  {
    id: 'qk-n3-5',
    category: 'kanji',
    level: 'N3',
    question: 'Mana kanji yang tepat untuk kata "こくさい" (internasional)?',
    audioText: 'こくさい',
    options: ['国際', '国裁', '国再', '国催'],
    correctIndex: 0,
    explanation: 'Internasional ditulis 国際 (こくさい - koku-sai). 際 bermakna batas antar negara / hubungan.',
  },
  {
    id: 'qk-n3-6',
    category: 'kanji',
    level: 'N3',
    question: '実験がついに【成功】しました。Cara baca kanji 成功 adalah...',
    audioText: 'じっけんがついにせいこうしました。',
    options: ['せいこう (seikou)', 'しょうこう (shoukou)', 'じょうこう (joukou)', 'せいぎょう (seigyou)'],
    correctIndex: 0,
    explanation: '成 (sei: terwujud) + 功 (kou: prestasi/jasa) dibaca せいこう (seikou) yang artinya keberhasilan / sukses.',
  },
  {
    id: 'qk-n3-7',
    category: 'kanji',
    level: 'N3',
    question: 'この機械の使い方はとても【複雑】です。Cara baca kanji 複雑 adalah...',
    audioText: 'このきかいのつかいかたはとてもふくざつです。',
    options: ['ふくざつ (fukuzatsu)', 'ふくさつ (fukusatsu)', 'ふくぞう (fukuzou)', 'ふくしゅう (fukushuu)'],
    correctIndex: 0,
    explanation: '複 (fuku: berlapis) + 雑 (zatsu: campur aduk) dibaca ふくざつ (fukuzatsu) artinya rumit atau kompleks.',
  },
  {
    id: 'qk-n3-8',
    category: 'kanji',
    level: 'N3',
    question: 'Mana kanji yang tepat untuk kata "ほうこく" (laporan)?',
    audioText: 'ほうこく',
    options: ['報告', '告報', '報国', '放告'],
    correctIndex: 0,
    explanation: 'Laporan ditulis 報告 (ほうこく - hou-koku). 報 = kabar berita, 告 = memberitahukan.',
  },
  {
    id: 'qk-n3-9',
    category: 'kanji',
    level: 'N3',
    question: '自分の行動に【責任】を持ちなさい。Cara baca kanji 責任 adalah...',
    audioText: 'じぶんのこうどうにせきにんをもちなさい。',
    options: ['せきにん (sekinin)', 'しゃきにん (shakinin)', 'せきじん (sekijin)', 'さきにん (sakinin)'],
    correctIndex: 0,
    explanation: '責 (seki: memikul beban moral) + 任 (nin: tugas/amanah) dibaca せきにん (sekinin) artinya tanggung jawab.',
  },
  {
    id: 'qk-n3-10',
    category: 'kanji',
    level: 'N3',
    question: 'Mana kanji yang tepat untuk kata "じゅんび" (persiapan)?',
    audioText: 'じゅんび',
    options: ['準備', '準美', '順備', '進備'],
    correctIndex: 0,
    explanation: 'Persiapan ditulis 準備 (じゅんび - jun-bi). 準 = standar/ancang-ancang, 備 = melengkapi perlengkapan.',
  },
];

export const CURATED_N3_VOCAB_QUIZ: MultipleChoiceQuestion[] = [
  {
    id: 'qv-n3-1',
    category: 'vocab',
    level: 'N3',
    question: '「【たとえば】、寿司や天ぷらです」。Kata sambung "たとえば" berarti...',
    audioText: 'たとえば、すしやてんぷらです。',
    options: ['Misalnya / Sebagai contoh', 'Oleh karena itu', 'Meskipun demikian', 'Sebenarnya'],
    correctIndex: 0,
    explanation: '「例えば (たとえば - tatoeba)」 digunakan untuk memberikan contoh konkret dalam penjelasan wacana.',
  },
  {
    id: 'qv-n3-2',
    category: 'vocab',
    level: 'N3',
    question: '「大雨が降りました。【したがって】、試合は中止になりました」。Arti kata "したがって" adalah...',
    audioText: 'おおあめがふりました。したがって、しあいはちゅうしになりました。',
    options: ['Oleh karena itu / Sebagai akibatnya', 'Tetapi / Namun', 'Atau', 'Lagipula'],
    correctIndex: 0,
    explanation: '「従って (したがって - shitagatte)」 adalah konjungsi formal untuk menyatakan kesimpulan logis (sebab → akibat langsung).',
  },
  {
    id: 'qv-n3-3',
    category: 'vocab',
    level: 'N3',
    question: '熱がありました。【それにもかかわらず】、出勤しました。Makna kata sambung tersebut adalah...',
    audioText: 'ねつがありました。それにもかかわらず、しゅっきんしました。',
    options: ['Meskipun demikian / Walaupun begitu', 'Karena itulah', 'Jika memungkinkan', 'Tentu saja'],
    correctIndex: 0,
    explanation: '「それにもかかわらず (sore ni mo kakawarazu)」 menyatakan kontradiksi yang mengejutkan (meskipun kondisi X, aksi Y tetap dilakukan).',
  },
  {
    id: 'qv-n3-4',
    category: 'vocab',
    level: 'N3',
    question: '双方の話し合いによって問題が【解決】した。Arti kata "解決" adalah...',
    audioText: 'そうほうのはなしあいによってもんだいが生かいけつした。',
    options: ['Solusi / Terselesaikan', 'Memburuk kondisinya', 'Tertunda', 'Dibatalkan'],
    correctIndex: 0,
    explanation: '「解決 (かいけつ - kaiketsu)」 artinya penyelesaian masalah hingga tuntas beres.',
  },
  {
    id: 'qv-n3-5',
    category: 'vocab',
    level: 'N3',
    question: '親の言動は子供に大きな【影響】を与える。Arti kata "影響" adalah...',
    audioText: 'おやのげんどうはこどもにおおきなえいきょうをあたえる。',
    options: ['Pengaruh / Efek', 'Kekhawatiran', 'Bantuan keuangan', 'Larangan'],
    correctIndex: 0,
    explanation: '「影響 (えいきょう - eikyou)」 berarti imbas, dampak, atau pengaruh terhadap hal lain.',
  },
  {
    id: 'qv-n3-6',
    category: 'vocab',
    level: 'N3',
    question: '進路について先生に【相談】しました。Arti kata "相談" adalah...',
    audioText: 'しんろについてせんせいにそうだんしました。',
    options: ['Konsultasi / Berdiskusi meminta saran', 'Mengeluh / Protes', 'Berpamitan', 'Meminta maaf'],
    correctIndex: 0,
    explanation: '「相談 (そうだん - soudan)」 berarti konsultasi atau curhat membicarakan masalah untuk mendapat masukan.',
  },
  {
    id: 'qv-n3-7',
    category: 'vocab',
    level: 'N3',
    question: '彼の失礼な【態度】に腹が立った。Arti kata "態度" adalah...',
    audioText: 'かれのしつれいなたいどにはらがたった。',
    options: ['Sikap / Perilaku', 'Pakaian', 'Gaya rambut', 'Penjelasan'],
    correctIndex: 0,
    explanation: '「態度 (たいど - taido)」 berarti sikap pembawaan diri atau tingkah laku seseorang.',
  },
  {
    id: 'qv-n3-8',
    category: 'vocab',
    level: 'N3',
    question: '提案に対して【反対】の意見が出された。Lawan kata dari "反対 (hantai)" adalah...',
    audioText: 'ていあんにたいしてはんたいのいけんがだされた。',
    options: ['賛成 (さんせい - setuju)', '決定 (けってい - keputusan)', '関係 (かんけい - hubungan)', '注意 (ちゅうい - perhatian)'],
    correctIndex: 0,
    explanation: 'Lawan dari 反対 (hantai = menentang/menolak) adalah 賛成 (sansei = menyetujui).',
  },
  {
    id: 'qv-n3-9',
    category: 'vocab',
    level: 'N3',
    question: '母の兄、【すなわち】私のおじです。Arti kata sambung "すなわち" adalah...',
    audioText: 'ははのあに、すなわちわたしのおじです。',
    options: ['Yaitu / Dengan kata lain', 'Atau', 'Tetapi', 'Sebelumnya'],
    correctIndex: 0,
    explanation: '「すなわち (sunawachi)」 berfungsi untuk memperjelas atau memberi padanan yang sama maknanya (yaitu / dengan kata lain).',
  },
  {
    id: 'qv-n3-10',
    category: 'vocab',
    level: 'N3',
    question: '風が強くなり、【さらに】雨も激しくなった。Arti kata "さらに" adalah...',
    audioText: 'かぜがつよくなり、さらにあめもはげしくなった。',
    options: ['Terlebih lagi / Semakin bertambah', 'Tiba-tiba', 'Perlahan-lahan', 'Sama sekali tidak'],
    correctIndex: 0,
    explanation: '「さらに (sarani)」 menyatakan peningkatan tingkatan atau penambahan kondisi yang semakin mendalam.',
  },
];

export const CURATED_N3_GRAMMAR_QUIZ: MultipleChoiceQuestion[] = [
  {
    id: 'qg-n3-1',
    category: 'grammar',
    level: 'N3',
    question: '大事な会議があるので、仕事を【　　】。Pilihan yang tepat untuk menyatakan ketidakmungkinan karena norma etika/kewajiban adalah...',
    audioText: 'だいじなかいぎがあるので、しごとを休むわけにはいかない。',
    options: ['休むわけにはいかない (yasumu wake ni wa ikanai)', '休むわけがない (yasumu wake ga nai)', '休むはずがない (yasumu hazu ga nai)', '休むおそれがある (yasumu osore ga aru)'],
    correctIndex: 0,
    explanation: 'Pola 「〜わけにはいかない」 berarti tidak mungkin bisa libur/bolos karena alasan moral, kewajiban sosial, atau etika tanggung jawab pekerjaan.',
  },
  {
    id: 'qg-n3-2',
    category: 'grammar',
    level: 'N3',
    question: 'あんなに一生懸命勉強した彼が、試験に【　　】。Pilihan untuk menyatakan kemustahilan logis mutlak adalah...',
    audioText: 'あんなにいっしょうけんめいべんきょうしたかれが、しけんにおちるわけがない。',
    options: ['落ちるわけがない (ochiru wake ga nai)', '落ちるわけにはいかない (ochiru wake ni wa ikanai)', '落ちるべきではない (ochiru beki dewa nai)', '落ちるようになった (ochiru you ni natta)'],
    correctIndex: 0,
    explanation: 'Pola 「〜わけがない」 menyatakan penolakan logis mutlak bahwa sesuatu "mustahil terjadi" (mustahil dia tidak lulus setelah belajar sekeras itu).',
  },
  {
    id: 'qg-n3-3',
    category: 'grammar',
    level: 'N3',
    question: '健康のために、毎朝野菜ジュースを【　　】。Pilihan untuk menyatakan kedisiplinan/usaha sadar yang terus diupayakan adalah...',
    audioText: 'けんこうのために、まいあさやさいジュースをのむようにしています。',
    options: ['飲むようにしています (nomu you ni shite imasu)', '飲むようになりました (nomu you ni narimashita)', '飲むばかりです (nomu bakari desu)', '飲むべきです (nomu beki desu)'],
    correctIndex: 0,
    explanation: 'Pola 「〜ようにする (you ni suru)」 menyatakan ikhtiar atau usaha sadar untuk membiasakan diri melakukan sesuatu.',
  },
  {
    id: 'qg-n3-4',
    category: 'grammar',
    level: 'N3',
    question: '窓を開けた【　　】、冷たい風が入ってきた。Pilihan yang tepat untuk "tepat seketika saat aksi terjadi" adalah...',
    audioText: 'まどをあけたとたん、つめたいかぜがはいってきた。',
    options: ['とたん（に） (totan ni)', 'ばかり (bakari)', 'とおりに (toori ni)', 'ために (tame ni)'],
    correctIndex: 0,
    explanation: 'Pola 「KK Bentuk-た + とたん（に）」 menyatakan aksi kedua terjadi seketika itu juga secara mendadak/tak terduga tepat setelah aksi pertama selesai.',
  },
  {
    id: 'qg-n3-5',
    category: 'grammar',
    level: 'N3',
    question: '弟は勉強もしないで、ゲームをして【　　】。Pilihan yang menyatakan "melulu/hanya itu-itu saja terus" (konotasi negatif) adalah...',
    audioText: 'おとうとはべんきょうもしないで、ゲームをしてばかりいる。',
    options: ['ばかりいる (bakari iru)', 'べきだ (beki da)', 'おそれがある (osore ga aru)', 'わけがない (wake ga nai)'],
    correctIndex: 0,
    explanation: 'Pola 「〜てばかりいる」 menyatakan kebiasaan seseorang melakukan hal yang sama secara berlebihan hingga mengabaikan hal penting lain.',
  },
  {
    id: 'qg-n3-6',
    category: 'grammar',
    level: 'N3',
    question: '人との約束は絶対に【　　】。Pilihan untuk menyatakan kewajiban moral/akal sehat yang semestinya ditepati adalah...',
    audioText: 'ひととのやくそくはぜったいにまもるべきだ。',
    options: ['守るべきだ (mamoru beki da)', '守るわけがない (mamoru wake ga nai)', '守るおそれがある (mamoru osore ga aru)', '守るばかりだ (mamoru bakari da)'],
    correctIndex: 0,
    explanation: 'Pola 「〜べきだ (beki da)」 digunakan untuk menyatakan tuntutan moral, etika, atau akal sehat bahwa sesuatu seharusnya/sepatutnya dilakukan.',
  },
  {
    id: 'qg-n3-7',
    category: 'grammar',
    level: 'N3',
    question: '部屋の電気がついているから、彼は家に【　　】。Pilihan keyakinan kuat 100% "pasti tidak salah lagi" adalah...',
    audioText: 'へやのでんきがついているから、かれはいえにいるにちがいない。',
    options: ['いるに違いない (iru ni chigainai)', 'いるおそれがある (iru osore ga aru)', 'いるべきだ (iru beki da)', 'いるわけにはいかない (iru wake ni wa ikanai)'],
    correctIndex: 0,
    explanation: 'Pola 「〜に違いない (ni chigainai)」 menyatakan keyakinan kuat pembicara berdasarkan bukti visual di depan mata (lampu menyala → pasti di rumah).',
  },
  {
    id: 'qg-n3-8',
    category: 'grammar',
    level: 'N3',
    question: '台風が近づいているため、洪水が起こる【　　】。Pilihan resmi untuk peringatan "ada bahaya/risiko buruk" adalah...',
    audioText: 'たいふうがちかづいているため、こうずいがおこるおそれがあります。',
    options: ['おそれがあります (osore ga arimasu)', 'わけがありません (wake ga arimasen)', 'べきではありません (beki dewa arimasen)', 'ようにします (you ni shimasu)'],
    correctIndex: 0,
    explanation: 'Pola 「〜おそれがある (osore ga aru)」 adalah pola formal yang lazim dipakai berita/laporan cuaca untuk memperingatkan risiko musibah/bahaya.',
  },
  {
    id: 'qg-n3-9',
    category: 'grammar',
    level: 'N3',
    question: '環境問題【　　】、レポートを書きました。Pilihan formal untuk "berkenaan dengan topik..." adalah...',
    audioText: 'かんきょうもんだいにかんして、レポートをかきました。',
    options: ['に関して (ni kanshite)', 'をとたんに (o totan ni)', 'をわけに (o wake ni)', 'をべきに (o beki ni)'],
    correctIndex: 0,
    explanation: 'Pola 「〜に関して (ni kanshite)」 adalah bentuk resmi yang berarti "mengenai / berkenaan dengan subjek/topik".',
  },
  {
    id: 'qg-n3-10',
    category: 'grammar',
    level: 'N3',
    question: '東京【　　】全国でイベントが開催される。Pilihan yang menyatakan "berpusat pada / fokus poros pada..." adalah...',
    audioText: 'とうきょうをちゅうしんにぜんこくでイベントがかいさいされる。',
    options: ['を中心に (o chuushin ni)', 'をおそれて (o osorete)', 'をちがいに (o chigai ni)', 'をわけに (o wake ni)'],
    correctIndex: 0,
    explanation: 'Pola 「〜を中心に (o chuushin ni)」 berarti "berpusat pada..." tempat atau kelompok tertentu sebagai penggerak utamanya.',
  },
];

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateN3KanjiQuiz(count: number = 10): MultipleChoiceQuestion[] {
  const result: MultipleChoiceQuestion[] = [...CURATED_N3_KANJI_QUIZ];
  const shuffledKanji = shuffleArray(KANJI_N3_LIST);

  for (const item of shuffledKanji) {
    if (result.length >= count + CURATED_N3_KANJI_QUIZ.length) break;

    const wrongItems = KANJI_N3_LIST.filter(k => k.id !== item.id && k.meaningId !== item.meaningId);
    const shuffledWrongs = shuffleArray(wrongItems).slice(0, 3);

    const options = shuffleArray([
      item.meaningId,
      shuffledWrongs[0].meaningId,
      shuffledWrongs[1].meaningId,
      shuffledWrongs[2].meaningId,
    ]);

    result.push({
      id: `dyn-n3-k-${item.id}-${Math.random().toString(36).substr(2, 4)}`,
      category: 'kanji',
      level: 'N3',
      question: `Apa arti dari Kanji JLPT N3 「${item.kanji}」?`,
      audioText: item.onyomi[0] ? item.onyomi[0] : item.kanji,
      options,
      correctIndex: options.indexOf(item.meaningId),
      explanation: `Kanji 「${item.kanji}」 bermakna: ${item.meaningId}. Onyomi: ${item.onyomi.join(', ') || '-'} • Kunyomi: ${item.kunyomi.join(', ') || '-'}.${item.mnemonic ? `\nCara ingat: ${item.mnemonic}` : ''}`,
    });
  }

  return shuffleArray(result).slice(0, count);
}

export function generateN3VocabQuiz(count: number = 10): MultipleChoiceQuestion[] {
  const result: MultipleChoiceQuestion[] = [...CURATED_N3_VOCAB_QUIZ];
  const shuffledVocab = shuffleArray(VOCAB_N3_LIST);

  for (const item of shuffledVocab) {
    if (result.length >= count + CURATED_N3_VOCAB_QUIZ.length) break;

    const wrongItems = VOCAB_N3_LIST.filter(v => v.id !== item.id && v.meaningId !== item.meaningId);
    const shuffledWrongs = shuffleArray(wrongItems).slice(0, 3);

    const options = shuffleArray([
      item.meaningId,
      shuffledWrongs[0].meaningId,
      shuffledWrongs[1].meaningId,
      shuffledWrongs[2].meaningId,
    ]);

    const displayWord = item.kanji ? `${item.kanji} (${item.kana})` : item.kana;

    result.push({
      id: `dyn-n3-v-${item.id}-${Math.random().toString(36).substr(2, 4)}`,
      category: 'vocab',
      level: 'N3',
      question: `Apa arti kosakata JLPT N3 「${displayWord}」?`,
      audioText: item.kanji || item.kana,
      options,
      correctIndex: options.indexOf(item.meaningId),
      explanation: `「${displayWord}」 berarti "${item.meaningId}". Romaji: ${item.romaji}.${item.exampleSentence ? `\nContoh: ${item.exampleSentence.jp} (${item.exampleSentence.id})` : ''}`,
    });
  }

  return shuffleArray(result).slice(0, count);
}

export function generateN3GrammarQuiz(count: number = 10): MultipleChoiceQuestion[] {
  return shuffleArray([...CURATED_N3_GRAMMAR_QUIZ]).slice(0, count);
}

export function generateN3MockExam(count: number = 15): MultipleChoiceQuestion[] {
  const kanjiQuestions = generateN3KanjiQuiz(5);
  const vocabQuestions = generateN3VocabQuiz(5);
  const grammarQuestions = generateN3GrammarQuiz(5);

  const combined = shuffleArray([...kanjiQuestions, ...vocabQuestions, ...grammarQuestions]);
  return combined.slice(0, count);
}

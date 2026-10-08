import { MultipleChoiceQuestion } from '../types';
import { KANJI_N4_LIST } from './kanjiN4Data';
import { VOCAB_N4_LIST } from './vocabN4Data';

// ============================================================================
// CURATED JLPT N4 QUIZ QUESTIONS (FORMAT ASLI UJIAN JLPT DENGAN PEMBAHASAN)
// ============================================================================

export const CURATED_N4_KANJI_QUIZ: MultipleChoiceQuestion[] = [
  {
    id: 'qk-n4-1',
    category: 'kanji',
    level: 'N4',
    question: '図書館で本を【借りました】。Cara baca kanji dalam tanda kurung adalah...',
    audioText: 'としょかんでほんをかりました。',
    options: ['かりました (karimashita)', 'かしました (kashimashita)', 'とりました (torimashita)', 'おりました (orimashita)'],
    correctIndex: 0,
    explanation: 'Kanji 借 memiliki Kunyomi か(りる) yang berarti meminjam. 借りました = "telah meminjam". Lawan katanya adalah 貸す (kasu = meminjamkan).',
  },
  {
    id: 'qk-n4-2',
    category: 'kanji',
    level: 'N4',
    question: '妹に英語を【教えて】あげました。Cara baca kanji 教 adalah...',
    audioText: 'いもうとにえいごをおしえてあげました。',
    options: ['おしえて (oshiete)', 'ならって (naratte)', 'おぼえて (oboete)', 'つたえて (tsutaete)'],
    correctIndex: 0,
    explanation: 'Kanji 教 bermakna mengajar (Kunyomi: おし・える). 教えてあげました = "mengajarkan untuk adik".',
  },
  {
    id: 'qk-n4-3',
    category: 'kanji',
    level: 'N4',
    question: 'この部屋はとても【暗い】ですね。Cara baca kanji 暗 adalah...',
    audioText: 'このへやはとてもくらいですね。',
    options: ['くらい (kurai)', 'あかるい (akarui)', 'あぶない (abunai)', 'ひろい (hiroi)'],
    correctIndex: 0,
    explanation: 'Kanji 暗 (gelap) dibaca くらい (kurai). Lawan katanya adalah 明るい (akarui = terang).',
  },
  {
    id: 'qk-n4-4',
    category: 'kanji',
    level: 'N4',
    question: 'Mana kanji yang tepat untuk kata "うんてん" (mengemudi /運転)?',
    audioText: 'うんてん',
    options: ['運転', '運進', '運転', '動転'],
    correctIndex: 0,
    explanation: 'Mengemudi ditulis 運転 (うんてん - un-ten). 運 = mengangkut/keberuntungan, 転 = berputar/berguling.',
  },
  {
    id: 'qk-n4-5',
    category: 'kanji',
    level: 'N4',
    question: 'Mana kanji yang tepat untuk kata "たいせつ" (berharga / penting)?',
    audioText: 'たいせつ',
    options: ['大切', '大急', '特切', '親切'],
    correctIndex: 0,
    explanation: 'Taisetsu ditulis 大切 (大 = besar, 切 = memotong/mendesak). 親切 (shinsetsu) artinya ramah/baik hati.',
  },
  {
    id: 'qk-n4-6',
    category: 'kanji',
    level: 'N4',
    question: 'あの人はとても【親切】な人です。Cara baca kanji 親切 adalah...',
    audioText: 'あのひとはとてもしんせつなひとです。',
    options: ['しんせつ (shinsetsu)', 'しんせき (shinseki)', 'たいせつ (taisetsu)', 'べんり (benri)'],
    correctIndex: 0,
    explanation: '親 (orang tua/akrab) + 切 (mendesak) dibaca しんせつ (shinsetsu) yang berarti ramah, baik hati.',
  },
  {
    id: 'qk-n4-7',
    category: 'kanji',
    level: 'N4',
    question: '【旅行】の準備をします。Cara baca kanji 旅行 adalah...',
    audioText: 'りょこうのじゅんびをします。',
    options: ['りょこう (ryokou)', 'りょうり (ryouri)', 'よこう (yokou)', 'りょくこう (ryokukou)'],
    correctIndex: 0,
    explanation: 'Kanji 旅 (perjalanan: ryo) + 行 (pergi: kou) dibaca りょこう (ryokou) artinya wisata/bepergian.',
  },
  {
    id: 'qk-n4-8',
    category: 'kanji',
    level: 'N4',
    question: 'Mana kanji yang tepat untuk kata "おわる" (selesai)?',
    audioText: 'おわる',
    options: ['終わる', '始る', '落ちる', '送る'],
    correctIndex: 0,
    explanation: 'Selesai/berakhir adalah 終わる (owaru). 始まる = mulai, 落ちる = jatuh, 送る = mengirim.',
  },
  {
    id: 'qk-n4-9',
    category: 'kanji',
    level: 'N4',
    question: '明日までに宿題を【集めて】ください。Cara baca kanji 集 adalah...',
    audioText: 'あしたまでにしゅくだいをあつめてください。',
    options: ['あつめて (atsumete)', 'はじめて (hajimete)', 'まとめて (matomete)', 'たのんで (tanonde)'],
    correctIndex: 0,
    explanation: 'Kanji 集 (kumpul) memiliki Kunyomi あつ(める) yang berarti mengumpulkan.',
  },
  {
    id: 'qk-n4-10',
    category: 'kanji',
    level: 'N4',
    question: 'Mana kanji yang tepat untuk kata "べんきょう" (belajar)?',
    audioText: 'べんきょう',
    options: ['勉強', '勉教', '勉業', '弁強'],
    correctIndex: 0,
    explanation: 'Belajar ditulis 勉強 (勉 = berusaha keras, 強 = kuat).',
  },
];

export const CURATED_N4_VOCAB_QUIZ: MultipleChoiceQuestion[] = [
  {
    id: 'qv-n4-1',
    category: 'vocab',
    level: 'N4',
    question: '部屋が暗いので、電気を【つけて】ください。Arti kata "つけて" adalah...',
    audioText: 'へやがくらいので、でんきをつけてください。',
    options: ['Nyalakan', 'Matikan', 'Buka', 'Tutup'],
    correctIndex: 0,
    explanation: '「つける (tsukeru)」 berarti menyalakan (lampu/elektronik). Lawan katanya adalah 「消す (kesu = mematikan)」.',
  },
  {
    id: 'qv-n4-2',
    category: 'vocab',
    level: 'N4',
    question: '電車が混んでいたので、【すっかり】疲れました。Arti kata "すっかり" adalah...',
    audioText: 'でんしゃがこんでいたので、すっかりつかれました。',
    options: ['Benar-benar / Sama sekali', 'Kadang-kadang', 'Tiba-tiba', 'Paling'],
    correctIndex: 0,
    explanation: '「すっかり (sukkari)」 adalah kata keterangan (adverb) yang menyatakan keadaan yang menyeluruh atau sepenuhnya (benar-benar tuntas).',
  },
  {
    id: 'qv-n4-3',
    category: 'vocab',
    level: 'N4',
    question: '風邪が治ったので、【すっかり】元気になりました。Pilihan kata yang semakna dengan "治る (naoru)" adalah...',
    audioText: 'かぜがなおったので、すっかりげんきになりました。',
    options: ['Sembuh dari sakit', 'Memperbaiki barang', 'Memburuk kondisinya', 'Tertular penyakit'],
    correctIndex: 0,
    explanation: '「治る (naoru)」 berarti sembuh (dari penyakit). Jika kanji 直る (naoru) berarti barang rusak menjadi betul/kembali normal.',
  },
  {
    id: 'qv-n4-4',
    category: 'vocab',
    level: 'N4',
    question: '友達と映画に行く【約束】をしました。Arti kata "約束" adalah...',
    audioText: 'ともだちとえいがにいくやくそくをしました。',
    options: ['Janji / Kesepakatan', 'Rencana liburan', 'Izin', 'Perpisahan'],
    correctIndex: 0,
    explanation: '「約束 (yakusoku)」 berarti janji atau janjian pertemuan.',
  },
  {
    id: 'qv-n4-5',
    category: 'vocab',
    level: 'N4',
    question: '「ドアが【あいています】」。Kalimat ini menggunakan kata kerja...',
    audioText: 'ドアがあいています。',
    options: ['Intransitif (Pintu terbuka dengan sendirinya/kondisi terbuka)', 'Transitif (Seseorang membuka pintu)', 'Perintah (Tolong buka pintu)', 'Keinginan (Ingin membuka pintu)'],
    correctIndex: 0,
    explanation: '「開く (aku)」 adalah kata kerja intransitif (terbuka), menggunakan partikel が: ドアが開いています (Pintu sedang terbuka). Lawan transitifnya: ドアを開ける (membuka pintu).',
  },
  {
    id: 'qv-n4-6',
    category: 'vocab',
    level: 'N4',
    question: '駅の案内所で道を【たずねました】。Arti kata "たずねる" adalah...',
    audioText: 'えきのあんないしょでみちをたずねました。',
    options: ['Bertanya / Menanyakan', 'Mengunjungi', 'Memberitahu', 'Menemukan'],
    correctIndex: 0,
    explanation: '「尋ねる (tazuneru)」 artinya menanyakan / bertanya. (Beda dengan 訪ねる yang artinya berkunjung).',
  },
  {
    id: 'qv-n4-7',
    category: 'vocab',
    level: 'N4',
    question: 'パスポートを【なくして】しまいました。Arti kata "なくす" adalah...',
    audioText: 'パスポートをなくしてしまいました。',
    options: ['Menghilangkan', 'Merusakkan', 'Menemukan', 'Menyimpan'],
    correctIndex: 0,
    explanation: '「なくす (nakusu)」 artinya menghilangkan atau kehilangan barang milik.',
  },
  {
    id: 'qv-n4-8',
    category: 'vocab',
    level: 'N4',
    question: 'この部屋の窓は【しまっています】。Arti kalimat tersebut adalah...',
    audioText: 'このへやのまどはしまっています。',
    options: ['Jendela ruangan ini tertutup', 'Jendela ruangan ini rusak', 'Jendela ruangan ini terbuka', 'Jendela ruangan ini kotor'],
    correctIndex: 0,
    explanation: '「閉まる (shimaru)」 adalah kata kerja intransitif (tertutup). しまっています = sedang dalam kondisi tertutup.',
  },
  {
    id: 'qv-n4-9',
    category: 'vocab',
    level: 'N4',
    question: '「【とうとう】夢が叶いました」。Arti kata keterangan "とうとう" adalah...',
    audioText: 'とうとうゆめがかないました。',
    options: ['Akhirnya (setelah proses panjang)', 'Tiba-tiba', 'Pasti', 'Sering kali'],
    correctIndex: 0,
    explanation: '「とうとう (toutou)」 berarti akhirnya / pada akhirnya (setelah penantian atau perjuangan lama).',
  },
  {
    id: 'qv-n4-10',
    category: 'vocab',
    level: 'N4',
    question: '会議の予定を【しらべて】ください。Arti kata "しらべる" adalah...',
    audioText: 'かいぎのよていをしらべてください。',
    options: ['Periksalah / Cari tahu', 'Batalkanlah', 'Buatlah', 'Ikutilah'],
    correctIndex: 0,
    explanation: '「調べる (shiraberu)」 bermakna mencari tahu, menyelidiki, atau memeriksa informasi.',
  },
];

export const CURATED_N4_GRAMMAR_QUIZ: MultipleChoiceQuestion[] = [
  {
    id: 'qg-n4-1',
    category: 'grammar',
    level: 'N4',
    question: '雨が【　　】、ピクニックに行きません。Pilihan yang tepat untuk menyatakan pengandaian kondisi (jika) adalah...',
    audioText: 'あめがふったら、ピクニックにいきません。',
    options: ['降ったら (futtara)', '降ると (furu to)', '降るなら (furu nara)', '降ればいい (fureba ii)'],
    correctIndex: 0,
    explanation: 'Pola 「〜たら (tara)」 berasal dari bentuk lampau + ら (降った + ら = 降ったら). Digunakan untuk pengandaian "jika hujan turun, tidak pergi".',
  },
  {
    id: 'qg-n4-2',
    category: 'grammar',
    level: 'N4',
    question: '私は漢字が【　　】。Pilihan bentuk potensial (bisa membaca) yang tepat adalah...',
    audioText: 'わたしはかんじがよめます。',
    options: ['読めます (yomemasu)', '読みられます (yomiraremasu)', '読まれます (yomaremasu)', '読させます (yosasemasu)'],
    correctIndex: 0,
    explanation: 'Kata kerja Grup 1 (読む - yomu) bentuk potensialnya diubah dari vokal u ke e + ru (よむ → よめる → 読めます). Partikel objek berubah dari を ke が.',
  },
  {
    id: 'qg-n4-3',
    category: 'grammar',
    level: 'N4',
    question: '田中さんが私の重い荷物を【　　】。Pilihan yang tepat saat orang lain berbuat kebaikan untuk saya adalah...',
    audioText: 'たなかさんがわたしのおもいにもつをもってくださいました。',
    options: ['持ってくれました (motte kuremashita)', '持ってあげました (motte agemashita)', '持ってもらいました (motte moraimashita)', '持ってやりました (motte yarimashita)'],
    correctIndex: 0,
    explanation: 'Pola 「〜てくれる」 dipakai ketika orang lain (subjek: Tanaka-san) melakukan perbuatan baik demi kepentingan pembicara (saya).',
  },
  {
    id: 'qg-n4-4',
    category: 'grammar',
    level: 'N4',
    question: 'うっかり宿題を忘れて【　　】。Pilihan yang tepat untuk menyatakan penyesalan mendalam adalah...',
    audioText: 'うっかりしゅくだいをわすれてしまいました。',
    options: ['しまいました (shimaimashita)', 'おきました (okimashita)', 'みました (mimashita)', 'いきました (ikimashita)'],
    correctIndex: 0,
    explanation: 'Pola 「〜てしまう」 menyatakan bahwa sesuatu yang tidak diharapkan/disesalkan telah terlanjur terjadi (lupa membawa PR).',
  },
  {
    id: 'qg-n4-5',
    category: 'grammar',
    level: 'N4',
    question: '空が暗くなって、今にも雨が【　　】ですね。Pilihan yang tepat untuk menyatakan tanda-tanda visual (tampaknya akan) adalah...',
    audioText: 'そらがくらくなって、いまにもあめがふりそうですね。',
    options: ['降りそう (furisou)', '降るそう (furusou)', '降ったそう (futtasou)', '降るよう (furu you)'],
    correctIndex: 0,
    explanation: 'Pola 「Masu-stem + そうだ」 menyatakan dugaan berdasarkan penampakan visual saat itu (降り＋そう = tampaknya mau turun hujan).',
  },
  {
    id: 'qg-n4-6',
    category: 'grammar',
    level: 'N4',
    question: '試験に合格できる【　　】、毎日一生懸命勉強しています。Pilihan tujuan/harapan yang tepat adalah...',
    audioText: 'しけんにごうかくできるように、まいにちいっしょうけんめいべんきょうしています。',
    options: ['ように (you ni)', 'ために (tame ni)', 'ので (node)', 'のに (noni)'],
    correctIndex: 0,
    explanation: 'Untuk kata kerja bentuk potensial (合格できる - bisa lulus) atau kondisi tanpa kehendak langsung, harus dipasangkan dengan 「〜ように」 (supaya bisa lulus).',
  },
  {
    id: 'qg-n4-7',
    category: 'grammar',
    level: 'N4',
    question: 'この薬はとても苦くて【　　】です。Pilihan yang tepat untuk "sulit diminum" adalah...',
    audioText: 'このくすりはとてもにがくてのみにくいです。',
    options: ['飲みにくい (nominikui)', '飲みやすい (nomiyasui)', '飲むにくい (nomu nikui)', '飲まないにくい (nomanai nikui)'],
    correctIndex: 0,
    explanation: 'Masu-stem + にくい menyatakan sesuatu sukar/sulit dikerjakan karena sifat fisiknya: 飲み＋にくい = sulit diminum.',
  },
  {
    id: 'qg-n4-8',
    category: 'grammar',
    level: 'N4',
    question: '京都へ【　　】、新幹線が一番早くて便利ですよ。Pilihan saran/rekomendasi topik adalah...',
    audioText: 'きょうとへいくなら、しんかんせんがいちばんはやくてべんりですよ。',
    options: ['行くなら (iku nara)', '行ったら (ittara)', '行けば (ikeba)', '行くと (iku to)'],
    correctIndex: 0,
    explanation: 'Pola 「〜なら (nara)」 digunakan untuk menanggapi topik rencana seseorang dan memberikan saran ("Kalau mau pergi ke Kyoto, ...").',
  },
  {
    id: 'qg-n4-9',
    category: 'grammar',
    level: 'N4',
    question: 'お金が【　　】、新しいパソコンを買いたいです。Bentuk syarat pengandaian (kalau ada) adalah...',
    audioText: 'おかねがあれば、あたらしいパソコンをかいたいです。',
    options: ['あれば (areba)', 'あるば (aruba)', 'あったらば (attaraba)', 'ありれば (arireba)'],
    correctIndex: 0,
    explanation: 'Bentuk kondisional 〜ば dari ある adalah あれば (areba) yang bermakna "jikalau ada uang".',
  },
  {
    id: 'qg-n4-10',
    category: 'grammar',
    level: 'N4',
    question: '日本語の先生に作文を【　　】。Pilihan saat kita meminta dan menerima kebaikan dari guru adalah...',
    audioText: 'にほんごのせんせいにさくぶんをなおしてもらいました。',
    options: ['直してもらいました (naoshite moraimashita)', '直してあげました (naoshite agemashita)', '直してくれました (naoshite kuremashita)', '直してやりました (naoshite yarimashita)'],
    correctIndex: 0,
    explanation: 'Partikel 「先生に」 menunjukkan sumber pemberi bantuan, sehingga kalimat menggunakan 「〜てもらう」 (saya menerima bantuan koreksi dari guru). Jika memakai くれました, partikel guru harus が (先生が...直してくれました).',
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

export function generateN4KanjiQuiz(count: number = 10): MultipleChoiceQuestion[] {
  const result: MultipleChoiceQuestion[] = [...CURATED_N4_KANJI_QUIZ];
  const shuffledKanji = shuffleArray(KANJI_N4_LIST);

  for (const item of shuffledKanji) {
    if (result.length >= count + CURATED_N4_KANJI_QUIZ.length) break;

    const wrongItems = KANJI_N4_LIST.filter(k => k.id !== item.id && k.meaningId !== item.meaningId);
    const shuffledWrongs = shuffleArray(wrongItems).slice(0, 3);

    const options = shuffleArray([
      item.meaningId,
      shuffledWrongs[0].meaningId,
      shuffledWrongs[1].meaningId,
      shuffledWrongs[2].meaningId,
    ]);

    result.push({
      id: `dyn-n4-k-${item.id}-${Math.random().toString(36).substr(2, 4)}`,
      category: 'kanji',
      level: 'N4',
      question: `Apa arti dari Kanji JLPT N4 「${item.kanji}」?`,
      audioText: item.onyomi[0] ? item.onyomi[0] : item.kanji,
      options,
      correctIndex: options.indexOf(item.meaningId),
      explanation: `Kanji 「${item.kanji}」 bermakna: ${item.meaningId}. Onyomi: ${item.onyomi.join(', ') || '-'} • Kunyomi: ${item.kunyomi.join(', ') || '-'}.${item.mnemonic ? `\nCara ingat: ${item.mnemonic}` : ''}`,
    });
  }

  return shuffleArray(result).slice(0, count);
}

export function generateN4VocabQuiz(count: number = 10): MultipleChoiceQuestion[] {
  const result: MultipleChoiceQuestion[] = [...CURATED_N4_VOCAB_QUIZ];
  const shuffledVocab = shuffleArray(VOCAB_N4_LIST);

  for (const item of shuffledVocab) {
    if (result.length >= count + CURATED_N4_VOCAB_QUIZ.length) break;

    const wrongItems = VOCAB_N4_LIST.filter(v => v.id !== item.id && v.meaningId !== item.meaningId);
    const shuffledWrongs = shuffleArray(wrongItems).slice(0, 3);

    const options = shuffleArray([
      item.meaningId,
      shuffledWrongs[0].meaningId,
      shuffledWrongs[1].meaningId,
      shuffledWrongs[2].meaningId,
    ]);

    const displayWord = item.kanji ? `${item.kanji} (${item.kana})` : item.kana;

    result.push({
      id: `dyn-n4-v-${item.id}-${Math.random().toString(36).substr(2, 4)}`,
      category: 'vocab',
      level: 'N4',
      question: `Apa arti kosakata JLPT N4 「${displayWord}」?`,
      audioText: item.kanji || item.kana,
      options,
      correctIndex: options.indexOf(item.meaningId),
      explanation: `「${displayWord}」 berarti "${item.meaningId}". Romaji: ${item.romaji}.${item.exampleSentence ? `\nContoh: ${item.exampleSentence.jp} (${item.exampleSentence.id})` : ''}`,
    });
  }

  return shuffleArray(result).slice(0, count);
}

export function generateN4GrammarQuiz(count: number = 10): MultipleChoiceQuestion[] {
  return shuffleArray([...CURATED_N4_GRAMMAR_QUIZ]).slice(0, count);
}

export function generateN4MockExam(count: number = 15): MultipleChoiceQuestion[] {
  const kanjiQuestions = generateN4KanjiQuiz(5);
  const vocabQuestions = generateN4VocabQuiz(5);
  const grammarQuestions = generateN4GrammarQuiz(5);

  const combined = shuffleArray([...kanjiQuestions, ...vocabQuestions, ...grammarQuestions]);
  return combined.slice(0, count);
}

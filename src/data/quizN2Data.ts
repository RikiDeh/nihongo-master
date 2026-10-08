import { MultipleChoiceQuestion } from '../types';
import { KANJI_N2_LIST } from './kanjiN2Data';
import { VOCAB_N2_LIST } from './vocabN2Data';

// ============================================================================
// CURATED JLPT N2 QUIZ QUESTIONS (FORMAT ASLI UJIAN JLPT DENGAN PEMBAHASAN)
// ============================================================================

export const CURATED_N2_KANJI_QUIZ: MultipleChoiceQuestion[] = [
  {
    id: 'qk-n2-1',
    category: 'kanji',
    level: 'N2',
    question: '多くの中小【企業】が参加した。Cara baca kanji 企業 adalah...',
    audioText: 'おおくのちゅうしょうきぎょうがさんかした。',
    options: ['きぎょう (kigyou)', 'きごう (kigou)', 'しぎょう (shigyou)', 'けいぎょう (keigyou)'],
    correctIndex: 0,
    explanation: '企 (ki: merancang/gagasan) + 業 (gyou: industri/bisnis) dibaca きぎょう (kigyou) artinya perusahaan/korporasi.',
  },
  {
    id: 'qk-n2-2',
    category: 'kanji',
    level: 'N2',
    question: '契約書にサインする前に内容をよく【把握】してください。Cara baca kanji 把握 adalah...',
    audioText: 'けいやくしょにサインするまえにないようをよくはあくしてください。',
    options: ['はあく (haaku)', 'ばあく (baaku)', 'はわく (hawaku)', 'ほあく (hoaku)'],
    correctIndex: 0,
    explanation: '把 (ha: menggenggam) + 握 (aku: memegang kendali) dibaca はあく (haaku) artinya memahami sepenuhnya / menguasai situasi.',
  },
  {
    id: 'qk-n2-3',
    category: 'kanji',
    level: 'N2',
    question: '世界的な【規模】で環境問題が深刻化している。Cara baca kanji 規模 adalah...',
    audioText: 'せかいてきなきぼでかんきょうもんだいがしんこくかしている。',
    options: ['きぼ (kibo)', 'きも (kimo)', 'きほう (kihou)', 'きぶ (kibu)'],
    correctIndex: 0,
    explanation: '規 (ki: regulasi/patokan) + 模 (bo: pola model) dibaca きぼ (kibo) artinya skala / dimensi ukuran.',
  },
  {
    id: 'qk-n2-4',
    category: 'kanji',
    level: 'N2',
    question: '若者の読書離れの【傾向】が見られる。Cara baca kanji 傾向 adalah...',
    audioText: 'わかもののどくしょばなれのけいこうがみられる。',
    options: ['けいこう (keikou)', 'けいごう (keigou)', 'きょうこう (kyoukou)', 'けんこう (kenkou)'],
    correctIndex: 0,
    explanation: '傾 (kei: condong/miring) + 向 (kou: menghadap arah) dibaca けいこう (keikou) artinya tren kecenderungan.',
  },
  {
    id: 'qk-n2-5',
    category: 'kanji',
    level: 'N2',
    question: 'Mana kanji yang tepat untuk kata "ひょうか" (evaluasi / penilaian)?',
    audioText: 'ひょうか',
    options: ['評価', '評価', '表価', '標価'],
    correctIndex: 0,
    explanation: 'Evaluasi ditulis 評価 (ひょうか - hyou-ka). 評 = menimbang/mengulas, 価 = nilai harga.',
  },
  {
    id: 'qk-n2-6',
    category: 'kanji',
    level: 'N2',
    question: '政府の方針に対して激しい【批判】が集まった。Cara baca kanji 批判 adalah...',
    audioText: 'せいふのほうしんにたいしてはげしいひはんがあつまった。',
    options: ['ひはん (hihan)', 'ひばん (hiban)', 'ひたん (hitan)', 'ひらん (hiran)'],
    correctIndex: 0,
    explanation: '批 (hi: meninjau cela) + 判 (han: memutus/mengadili) dibaca ひはん (hihan) artinya kritik/kecaman.',
  },
  {
    id: 'qk-n2-7',
    category: 'kanji',
    level: 'N2',
    question: 'Mana kanji yang tepat untuk kata "けいやく" (kontrak / perjanjian)?',
    audioText: 'けいやく',
    options: ['契約', '契易', '係約', '結約'],
    correctIndex: 0,
    explanation: 'Kontrak ditulis 契約 (けいやく - kei-yaku). 契 = ikatan sumpah, 約 = janji.',
  },
  {
    id: 'qk-n2-8',
    category: 'kanji',
    level: 'N2',
    question: '両国間の【貿易】摩擦が続いている。Cara baca kanji 貿易 adalah...',
    audioText: 'りょうこくかんのぼうえきまさつがつづいている。',
    options: ['ぼうえき (boueki)', 'ぼうゆ (bouyu)', 'ぼうえい (bouei)', 'もうえき (moueki)'],
    correctIndex: 0,
    explanation: '貿 (bou: pertukaran) + 易 (eki: dagang/tukar) dibaca ぼうえき (boueki) artinya perdagangan internasional.',
  },
  {
    id: 'qk-n2-9',
    category: 'kanji',
    level: 'N2',
    question: 'Mana kanji yang tepat untuk kata "たいさく" (penanggulangan / kebijakan mitigasi)?',
    audioText: 'たいさく',
    options: ['対策', '対作', '隊策', '待策'],
    correctIndex: 0,
    explanation: 'Penanggulangan ditulis 対策 (たいさく - tai-saku). 対 = menghadapi, 策 = siasat/strategi kebijakan.',
  },
  {
    id: 'qk-n2-10',
    category: 'kanji',
    level: 'N2',
    question: '多角的な【視点】から分析を行う。Cara baca kanji 視点 adalah...',
    audioText: 'たかくてきなしてんからぶんせきをおこなう。',
    options: ['してん (shiten)', 'みてん (miten)', 'しちょう (shichou)', 'じでん (jiden)'],
    correctIndex: 0,
    explanation: '視 (shi: memandang) + 点 (ten: titik) dibaca してん (shiten) artinya sudut pandang / perspektif.',
  },
];

export const CURATED_N2_VOCAB_QUIZ: MultipleChoiceQuestion[] = [
  {
    id: 'qv-n2-1',
    category: 'vocab',
    level: 'N2',
    question: '「地球【温暖化】の影響で海面が上昇している」。Arti kata "温暖化" adalah...',
    audioText: 'ちきゅうおんだんかのえいきょうでかいめんがじょうしょうしている。',
    options: ['Pemanasan global', 'Pendinginan iklim', 'Pencemaran udara', 'Kekeringan tanah'],
    correctIndex: 0,
    explanation: '「温暖化 (おんだんか - ondanka)」 berarti pemanasan iklim (global warming).',
  },
  {
    id: 'qv-n2-2',
    category: 'vocab',
    level: 'N2',
    question: '「景気の回復にはまだ時間がかかりそうだ」。Arti kata "景気" adalah...',
    audioText: 'けいきのかいふくにはまだじかんがかかりそうだ。',
    options: ['Kondisi iklim ekonomi / Pasar', 'Pemandangan alam', 'Semangat kerja', 'Peraturan kantor'],
    correctIndex: 0,
    explanation: '「景気 (けいき - keiki)」 bermakna kondisi perekonomian atau situasi perputaran bisnis di pasar.',
  },
  {
    id: 'qv-n2-3',
    category: 'vocab',
    level: 'N2',
    question: '就職活動のために専門の【資格】を取得した。Arti kata "資格" adalah...',
    audioText: 'しゅうしょくかつどうのためにせんもんのしかくをしゅとくした。',
    options: ['Kualifikasi / Sertifikasi profesi', 'Izin cuti', 'Pengalaman kerja', 'Gelar sarjana'],
    correctIndex: 0,
    explanation: '「資格 (しかく - shikaku)」 bermakna kualifikasi, lisensi, atau sertifikasi kelayakan keahlian.',
  },
  {
    id: 'qv-n2-4',
    category: 'vocab',
    level: 'N2',
    question: '地域社会の発展に大きく【貢献】した。Arti kata "貢献" adalah...',
    audioText: 'ちいきしゃかいのはってんにおおきくこうけんした。',
    options: ['Kontribusi / Berjasa menyumbang', 'Menentang', 'Mengabaikan', 'Meniru'],
    correctIndex: 0,
    explanation: '「貢献 (こうけん - kouken)」 artinya memberikan kontribusi atau sumbangsih tenaga/jasa bagi masyarakat.',
  },
  {
    id: 'qv-n2-5',
    category: 'vocab',
    level: 'N2',
    question: '当社は顧客との信頼関係を最も【重視】しています。Arti kata "重視" adalah...',
    audioText: 'とうしゃはこきゃくとのしんらいかんけいをもっともじゅうししています。',
    options: ['Memprioritaskan / Menganggap amat penting', 'Mengkhawatirkan', 'Meremehkan', 'Menghindari'],
    correctIndex: 0,
    explanation: '「重視 (じゅうし - juushi)」 bermakna menganggap suatu hal sangat berbobot dan bernilai penting.',
  },
  {
    id: 'qv-n2-6',
    category: 'vocab',
    level: 'N2',
    question: '事故を防ぐための安全【対策】を講じる。Arti kata "対策" adalah...',
    audioText: 'じこをふせぐためのあんぜんたいさくをこうじる。',
    options: ['Kebijakan penanggulangan / Langkah mitigasi', 'Peristiwa darurat', 'Ganti rugi uang', 'Pemeriksaan saksi'],
    correctIndex: 0,
    explanation: '「対策 (たいさく - taisaku)」 berarti langkah strategis penanggulangan atau tindakan preventif mengatasi persoalan.',
  },
  {
    id: 'qv-n2-7',
    category: 'vocab',
    level: 'N2',
    question: '現状を正しく【把握】することが成功の鍵だ。Arti kata "把握" adalah...',
    audioText: 'げんじょうをただしくはあくすることがせいこうのかぎだ。',
    options: ['Memahami situasi secara mendalam / Menguasai keadaan', 'Mengubah peraturan', 'Menolak keputusan', 'Melupakan masalah'],
    correctIndex: 0,
    explanation: '「把握 (はあく - haaku)」 berarti memahami peta situasi fakta secara utuh dan menyeluruh.',
  },
  {
    id: 'qv-n2-8',
    category: 'vocab',
    level: 'N2',
    question: '彼の研究成果は国内外で高く【評価】された。Arti kata "評価" adalah...',
    audioText: 'かれのけんきゅうせいかはこくないがいでたかくひょうかされた。',
    options: ['Dinilai tinggi / Diakui prestasinya', 'Dikecam keras', 'Dirahasiakan', 'Dijual murah'],
    correctIndex: 0,
    explanation: '「評価 (ひょうか - hyouka)」 adalah penilaian evaluatif terhadap mutu atau pencapaian seseorang.',
  },
  {
    id: 'qv-n2-9',
    category: 'vocab',
    level: 'N2',
    question: '状況に応じて冷静に【判断】してください。Arti kata "判断" adalah...',
    audioText: 'じょうきょうにおうじてれいせいはんだんしてください。',
    options: ['Pertimbangkan dan nilailah', 'Batalkanlah', 'Ceritakanlah', 'Tanyakanlah'],
    correctIndex: 0,
    explanation: '「判断 (はんだん - handan)」 adalah proses mempertimbangkan logika dan mengambil penilaian putusan.',
  },
  {
    id: 'qv-n2-10',
    category: 'vocab',
    level: 'N2',
    question: '両国間の【貿易】が活発に行われている。Arti kata "貿易" adalah...',
    audioText: 'りょうこくかんのぼうえきがかっぱつにおこなわれている。',
    options: ['Perdagangan ekspor-impor internasional', 'Perjalanan wisata', 'Pertukaran pelajar', 'Perjanjian militer'],
    correctIndex: 0,
    explanation: '「貿易 (ぼうえき - boueki)」 adalah pertukaran komoditas ekspor dan impor antar negara.',
  },
];

export const CURATED_N2_GRAMMAR_QUIZ: MultipleChoiceQuestion[] = [
  {
    id: 'qg-n2-1',
    category: 'grammar',
    level: 'N2',
    question: '新工場の設立【　　】、地元の皆様にご挨拶申し上げます。Pilihan formal saat momentum dimulainya acara adalah...',
    audioText: 'しんこうじょうのせつりつにあたって、じもとのみなさまにごあいさつもうしあげます。',
    options: ['にあたって (ni atatte)', 'をめぐって (o megutte)', 'にほかならない (ni hoka naranai)', 'にすぎない (ni suginai)'],
    correctIndex: 0,
    explanation: 'Pola 「〜にあたって / 〜に際して」 adalah ragam resmi formal untuk momen istimewa atau peristiwa penting yang akan segera dimulai.',
  },
  {
    id: 'qg-n2-2',
    category: 'grammar',
    level: 'N2',
    question: '消費税の引き上げ【　　】、激しい議論が交わされた。Pilihan untuk menyatakan "seputar perdebatan/pertentangan mengenai..." adalah...',
    audioText: 'しょうひぜいのひきあげをめぐって、はげしいぎろんがかわされた。',
    options: ['をめぐって (o megutte)', 'に基づいて (ni motozuite)', 'に応じて (ni oujite)', 'にこたえて (ni kotaete)'],
    correctIndex: 0,
    explanation: 'Pola 「〜をめぐって」 menyatakan topik sentral yang menjadi perebutan pandangan atau memicu silang pendapat antar banyak pihak.',
  },
  {
    id: 'qg-n2-3',
    category: 'grammar',
    level: 'N2',
    question: '調査結果のデータ【　　】、来期の事業計画を作成した。Pilihan untuk "berdasarkan data fakta/hukum" adalah...',
    audioText: 'ちょうさけっかのデータにもとづいて、らいきのじぎょうけいかくをさくせいした。',
    options: ['に基づいて (ni motozuite)', 'をめぐって (o megutte)', 'にすぎない (ni suginai)', 'ざるを得ない (zaru o enai)'],
    correctIndex: 0,
    explanation: 'Pola 「〜に基づいて」 berarti berlandaskan atau berpijak kokoh pada data, metode, atau asas hukum tertentu.',
  },
  {
    id: 'qg-n2-4',
    category: 'grammar',
    level: 'N2',
    question: 'お客様のご希望【　　】、最適なプランをご提案します。Pilihan fleksibel "menyesuaikan dengan kebutuhan/kondisi" adalah...',
    audioText: 'おきゃくさまのごきぼうにおうじて、さいてきなプランをごていあんします。',
    options: ['に応じて (ni oujite)', 'にほかならない (ni hoka naranai)', 'にすぎない (ni suginai)', 'ざるを得ない (zaru o enai)'],
    correctIndex: 0,
    explanation: 'Pola 「〜に応じて」 berarti fleksibel menyesuaikan sebanding dengan kondisi, usia, anggaran, atau permintaan lawan bicara.',
  },
  {
    id: 'qg-n2-5',
    category: 'grammar',
    level: 'N2',
    question: '市民の強い要望【　　】、新しい図書館が建設された。Pilihan untuk "memenuhi / merespons aspirasi atau harapan" adalah...',
    audioText: 'しみんのつよいようぼうにこたえて、あたらしいとしょかんがけんせつされた。',
    options: ['にこたえて (ni kotaete)', 'に基づいて (ni motozuite)', 'をめぐって (o megutte)', 'つつある (tsutsu aru)'],
    correctIndex: 0,
    explanation: 'Pola 「〜にこたえて」 bermakna bertindak nyata untuk mengabulkan atau menjawab harapan orang lain/masyarakat.',
  },
  {
    id: 'qg-n2-6',
    category: 'grammar',
    level: 'N2',
    question: '今回のプロジェクトの成功は、皆の努力の結果【　　】。Pilihan penegasan mutlak "tidak lain dan tidak bukan adalah..." adalah...',
    audioText: 'こんかいのプロジェクトのせいこうは、みなのどりょくのけっかにほかならない。',
    options: ['にほかならない (ni hoka naranai)', 'にすぎない (ni suginai)', 'ざるを得ない (zaru o enai)', 'つつある (tsutsu aru)'],
    correctIndex: 0,
    explanation: 'Pola 「〜にほかならない」 adalah penegasan logis tegas bahwa hal tersebut mutlak tidak lain dan tidak bukan adalah inti alasannya.',
  },
  {
    id: 'qg-n2-7',
    category: 'grammar',
    level: 'N2',
    question: '大型台風が接近しているため、試合は中止【　　】。Pilihan yang menyatakan "terpaksa/mau tidak mau harus dilakukan" adalah...',
    audioText: 'おおがたたいふうがせっきんしているため、しあいはちゅうしせざるをえない。',
    options: ['せざるを得ない (sezaru o enai)', 'するにすぎない (suru ni suginai)', 'するにほかならない (suru ni hoka naranai)', 'するげだ (suru ge da)'],
    correctIndex: 0,
    explanation: 'Pola 「〜ざるを得ない」 (dari する → せざるを得ない) menyatakan situasi memaksa pembicara tanpa ada pilihan lain.',
  },
  {
    id: 'qg-n2-8',
    category: 'grammar',
    level: 'N2',
    question: 'これはまだ全体の計画のほんの一部【　　】。Pilihan untuk menyatakan "hanya sekadar / tidak lebih dari..." adalah...',
    audioText: 'これはまだぜんたいのけいかくのほんのいちぶにすぎない。',
    options: ['にすぎない (ni suginai)', 'にほかならない (ni hoka naranai)', 'ざるを得ない (zaru o enai)', 'にあたって (ni atatte)'],
    correctIndex: 0,
    explanation: 'Pola 「〜にすぎない」 bermakna membatasi derajat bahwa suatu hal hanyalah hal kecil / sekadar tahap biasa.',
  },
  {
    id: 'qg-n2-9',
    category: 'grammar',
    level: 'N2',
    question: '彼女は【　　】表情で窓の外を見つめていた。Pilihan yang menyiratkan "tampak aura rasa sedih" adalah...',
    audioText: 'かのじょはかなしげなひょうじょうでまどのそとをみつめていた。',
    options: ['悲しげな (kanashige na)', '悲しそうな (kanashisou na)', '悲しいような (kanashii you na)', '悲しみたい (kanashimitai)'],
    correctIndex: 0,
    explanation: 'Pola 「〜げ (ge)」 digabungkan dengan membuang い dari kata sifat: 悲しい → 悲しげな (menyiratkan aura kesedihan pada raut wajah).',
  },
  {
    id: 'qg-n2-10',
    category: 'grammar',
    level: 'N2',
    question: '地球温暖化の影響で、各地の氷河が解け【　　】。Pilihan wacana resmi untuk "sedang dalam proses perubahan terus-menerus" adalah...',
    audioText: 'ちきゅうおんだんかのえいきょうで、かくちのひょうががとけつつある。',
    options: ['つつある (tsutsu aru)', 'ざるを得ない (zaru o enai)', 'にほかならない (ni hoka naranai)', 'にすぎない (ni suginai)'],
    correctIndex: 0,
    explanation: 'Pola 「Masu-stem + つつある」 adalah bentuk tulisan formal untuk menyatakan fenomena alam atau tren yang sedang berproses berubah.',
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

export function generateN2KanjiQuiz(count: number = 10): MultipleChoiceQuestion[] {
  const result: MultipleChoiceQuestion[] = [...CURATED_N2_KANJI_QUIZ];
  const shuffledKanji = shuffleArray(KANJI_N2_LIST);

  for (const item of shuffledKanji) {
    if (result.length >= count + CURATED_N2_KANJI_QUIZ.length) break;

    const wrongItems = KANJI_N2_LIST.filter(k => k.id !== item.id && k.meaningId !== item.meaningId);
    const shuffledWrongs = shuffleArray(wrongItems).slice(0, 3);

    const options = shuffleArray([
      item.meaningId,
      shuffledWrongs[0].meaningId,
      shuffledWrongs[1].meaningId,
      shuffledWrongs[2].meaningId,
    ]);

    result.push({
      id: `dyn-n2-k-${item.id}-${Math.random().toString(36).substr(2, 4)}`,
      category: 'kanji',
      level: 'N2',
      question: `Apa arti dari Kanji JLPT N2 「${item.kanji}」?`,
      audioText: item.onyomi[0] ? item.onyomi[0] : item.kanji,
      options,
      correctIndex: options.indexOf(item.meaningId),
      explanation: `Kanji 「${item.kanji}」 bermakna: ${item.meaningId}. Onyomi: ${item.onyomi.join(', ') || '-'} • Kunyomi: ${item.kunyomi.join(', ') || '-'}.${item.mnemonic ? `\nCara ingat: ${item.mnemonic}` : ''}`,
    });
  }

  return shuffleArray(result).slice(0, count);
}

export function generateN2VocabQuiz(count: number = 10): MultipleChoiceQuestion[] {
  const result: MultipleChoiceQuestion[] = [...CURATED_N2_VOCAB_QUIZ];
  const shuffledVocab = shuffleArray(VOCAB_N2_LIST);

  for (const item of shuffledVocab) {
    if (result.length >= count + CURATED_N2_VOCAB_QUIZ.length) break;

    const wrongItems = VOCAB_N2_LIST.filter(v => v.id !== item.id && v.meaningId !== item.meaningId);
    const shuffledWrongs = shuffleArray(wrongItems).slice(0, 3);

    const options = shuffleArray([
      item.meaningId,
      shuffledWrongs[0].meaningId,
      shuffledWrongs[1].meaningId,
      shuffledWrongs[2].meaningId,
    ]);

    const displayWord = item.kanji ? `${item.kanji} (${item.kana})` : item.kana;

    result.push({
      id: `dyn-n2-v-${item.id}-${Math.random().toString(36).substr(2, 4)}`,
      category: 'vocab',
      level: 'N2',
      question: `Apa arti kosakata JLPT N2 「${displayWord}」?`,
      audioText: item.kanji || item.kana,
      options,
      correctIndex: options.indexOf(item.meaningId),
      explanation: `「${displayWord}」 berarti "${item.meaningId}". Romaji: ${item.romaji}.${item.exampleSentence ? `\nContoh: ${item.exampleSentence.jp} (${item.exampleSentence.id})` : ''}`,
    });
  }

  return shuffleArray(result).slice(0, count);
}

export function generateN2GrammarQuiz(count: number = 10): MultipleChoiceQuestion[] {
  return shuffleArray([...CURATED_N2_GRAMMAR_QUIZ]).slice(0, count);
}

export function generateN2MockExam(count: number = 15): MultipleChoiceQuestion[] {
  const kanjiQuestions = generateN2KanjiQuiz(5);
  const vocabQuestions = generateN2VocabQuiz(5);
  const grammarQuestions = generateN2GrammarQuiz(5);

  const combined = shuffleArray([...kanjiQuestions, ...vocabQuestions, ...grammarQuestions]);
  return combined.slice(0, count);
}

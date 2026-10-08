import { MultipleChoiceQuestion } from '../types';
import { KANJI_N1_LIST } from './kanjiN1Data';
import { VOCAB_N1_LIST } from './vocabN1Data';

// ============================================================================
// CURATED JLPT N1 QUIZ QUESTIONS (FORMAT ASLI UJIAN JLPT DENGAN PEMBAHASAN)
// ============================================================================

export const CURATED_N1_KANJI_QUIZ: MultipleChoiceQuestion[] = [
  {
    id: 'qk-n1-1',
    category: 'kanji',
    level: 'N1',
    question: '景気の回復傾向が【顕著】に現れている。Cara baca kanji 顕著 adalah...',
    audioText: 'けいきのかいふくけいこうがけんちょにあらわれている。',
    options: ['けんちょ (kencho)', 'けんじゃ (kenja)', 'げんちょ (gencho)', 'げんしゃ (gensha)'],
    correctIndex: 0,
    explanation: '顕 (ken: nyata/menonjol) + 著 (cho: nyata/jelas) dibaca けんちょ (kencho) artinya sangat menonjol perubahannya.',
  },
  {
    id: 'qk-n1-2',
    category: 'kanji',
    level: 'N1',
    question: '彼の説明は抽象的で【漠然】としている。Cara baca kanji 漠然 adalah...',
    audioText: 'かれのせつめいはちゅうしょうてきでばくぜんとしている。',
    options: ['ばくぜん (bakuzen)', 'まくぜん (makuzen)', 'ばくねん (bakunen)', 'ぼくぜん (bokuzen)'],
    correctIndex: 0,
    explanation: '漠 (baku: samar/tanpa batas) + 然 (zen: kondisi) dibaca ばくぜん (bakuzen) artinya samar-samar / belum jelas konkretnya.',
  },
  {
    id: 'qk-n1-3',
    category: 'kanji',
    level: 'N1',
    question: '実験は極めて【緻密】な計画のもとで進められた。Cara baca kanji 緻密 adalah...',
    audioText: 'じっけんはきわめてちみつなけいかくのもとですすめられた。',
    options: ['ちみつ (chimitsu)', 'ちびつ (chibitsu)', 'せいみつ (seimitsu)', 'さいみつ (saimitsu)'],
    correctIndex: 0,
    explanation: '緻 (chi: teliti/halus) + 密 (mitsu: rapat/cermat) dibaca ちみつ (chimitsu) artinya sangat cermat dan teliti.',
  },
  {
    id: 'qk-n1-4',
    category: 'kanji',
    level: 'N1',
    question: '美術品をじっくり【鑑賞】した。Cara baca kanji 鑑賞 adalah...',
    audioText: 'びじゅつひんをじっくりかんしょうした。',
    options: ['かんしょう (kanshou)', 'がんしょう (ganshou)', 'かんそう (kansou)', 'けんしょう (kenshou)'],
    correctIndex: 0,
    explanation: '鑑 (kan: cermin/menilai) + 賞 (shou: mengagumi) dibaca かんしょう (kanshou) artinya mengapresiasi dan menikmati keindahan karya seni.',
  },
  {
    id: 'qk-n1-5',
    category: 'kanji',
    level: 'N1',
    question: 'Mana kanji yang tepat untuk kata "くつがえす" (menjungkirbalikkan putusan/teori)?',
    audioText: 'くつがえす',
    options: ['覆す', '倒す', '破す', '傾す'],
    correctIndex: 0,
    explanation: 'Menjungkirbalikkan ditulis 覆す (くつがえす - kutsugaesu). Kanji 覆 bermakna membalikkan atau menutupi.',
  },
  {
    id: 'qk-n1-6',
    category: 'kanji',
    level: 'N1',
    question: '巧妙な手口で人を【欺く】行為は許されない。Cara baca kanji 欺く adalah...',
    audioText: 'こうみょうなてぐちでひとをあざむくこういはゆるされない。',
    options: ['あざむく (azamuku)', 'そむく (somuku)', 'うらぎる (uragiru)', 'おどす (odosu)'],
    correctIndex: 0,
    explanation: 'Kanji 欺 memiliki Kunyomi あざむ(く) yang berarti menipu atau memperdaya dengan muslihat licik.',
  },
  {
    id: 'qk-n1-7',
    category: 'kanji',
    level: 'N1',
    question: 'この調査結果は今後の進路を【示唆】している。Cara baca kanji 示唆 adalah...',
    audioText: 'このちょうさけっかはこんごのしんろをしさしている。',
    options: ['しさ (shisa)', 'じさ (jisa)', 'ししゃ (shisha)', 'きょうさ (kyousa)'],
    correctIndex: 0,
    explanation: '示 (shi: memperlihatkan) + 唆 (sa: menghasut/membisiki) dibaca しさ (shisa) artinya memberi isyarat implikasi atau menyiratkan arahan.',
  },
  {
    id: 'qk-n1-8',
    category: 'kanji',
    level: 'N1',
    question: '国の将来を【憂える】声が上がっている。Cara baca kanji 憂える adalah...',
    audioText: 'くにのしょうらいをうれえるこえがあがっている。',
    options: ['うれえる (ureeru)', 'かなしむ (kanashimu)', 'おそれる (osoreru)', 'なやむ (nayamu)'],
    correctIndex: 0,
    explanation: 'Kanji 憂 memiliki Kunyomi うれ(える) yang berarti mengkhawatirkan dengan duka mendalam / mencemaskan masa depan.',
  },
  {
    id: 'qk-n1-9',
    category: 'kanji',
    level: 'N1',
    question: '幾多の困難を【克服】して頂点に立った。Cara baca kanji 克服 adalah...',
    audioText: 'いくたのこんなんをこくふくしてちょうてんにたった。',
    options: ['こくふく (kokufuku)', 'かっぷく (kappuku)', 'かいふく (kaifuku)', 'こうふく (koufuku)'],
    correctIndex: 0,
    explanation: '克 (koku: menaklukkan) + 服 (fuku: tunduk/menjalani) dibaca こくふく (kokufuku) artinya mengatasi kesulitan hidup.',
  },
  {
    id: 'qk-n1-10',
    category: 'kanji',
    level: 'N1',
    question: 'Mana kanji yang tepat untuk kata "いちもくりょうぜん" (jelas sekali dalam sekali pandang)?',
    audioText: 'いちもくりょうぜん',
    options: ['一目瞭然', '一目領然', '一目量然', '一目料然'],
    correctIndex: 0,
    explanation: 'Ditulis 一目瞭然 (いちもくりょうぜん - ichimoku ryouzen). 瞭 bermakna mata memandang jelas terang benderang.',
  },
];

export const CURATED_N1_VOCAB_QUIZ: MultipleChoiceQuestion[] = [
  {
    id: 'qv-n1-1',
    category: 'vocab',
    level: 'N1',
    question: 'グラフを見れば、売り上げの推移は【一目瞭然】だ。Arti dari ungkapan "一目瞭然" adalah...',
    audioText: 'グラフをみれば、うりあげのすいいはいちもくりょうぜんだ。',
    options: ['Sangat jelas dalam sekali pandang', 'Masih samar-samar', 'Sangat meragukan keabsahannya', 'Memerlukan penelitian ulang'],
    correctIndex: 0,
    explanation: '「一目瞭然 (いちもくりょうぜん)」 adalah idiom empat karakter (Yojijukugo) yang bermakna sesuatu begitu gamblang dan terang benderang sekilas pandang.',
  },
  {
    id: 'qv-n1-2',
    category: 'vocab',
    level: 'N1',
    question: '幾度もの【試行錯誤】を重ねて新薬が完成した。Arti dari "試行錯誤" adalah...',
    audioText: 'いくどもなしこうさくごをかさねてしんやくがかんせいした。',
    options: ['Metode coba-coba (Trial and error)', 'Perdebatan akademis', 'Pemalsuan data', 'Bantuan keuangan sukarela'],
    correctIndex: 0,
    explanation: '「試行錯誤 (しこうさくご)」 adalah Yojijukugo yang berarti melakukan uji coba berulang kali sambil memperbaiki kegagalan (trial and error).',
  },
  {
    id: 'qv-n1-3',
    category: 'vocab',
    level: 'N1',
    question: '予期せぬ緊急事態には【臨機応変】に対処する。Arti kata "臨機応変" adalah...',
    audioText: 'よきせぬきんきゅうじたいにはりんきおうへんにたいしょする。',
    options: ['Fleksibel beradaptasi sesuai situasi', 'Tegas mengikuti peraturan tertulis', 'Menunggu arahan atasan', 'Membatalkan seluruh kegiatan'],
    correctIndex: 0,
    explanation: '「臨機応変 (りんきおうへん)」 bermakna mengambil tindakan fleksibel yang tepat sasaran menyesuaikan perubahan kondisi di lapangan.',
  },
  {
    id: 'qv-n1-4',
    category: 'vocab',
    level: 'N1',
    question: '品質に関しては一切の【妥協】を許さない。Arti kata "妥協" adalah...',
    audioText: 'ひんしつにかんしてはいっさいのだきょうをゆるさない。',
    options: ['Kompromi / Mengalah demi mufakat', 'Peningkatan mutu', 'Keterlambatan waktu', 'Penghematan biaya'],
    correctIndex: 0,
    explanation: '「妥協 (だきょう - dakyou)」 artinya saling mengalah atau menurunkan standar demi mencapai jalan tengah (kompromi).',
  },
  {
    id: 'qv-n1-5',
    category: 'vocab',
    level: 'N1',
    question: '不祥事の事実を【隠蔽】しようとした疑いがある。Arti kata "隠蔽" adalah...',
    audioText: 'ふしょうじのじじつをいんぺいしようとしたうたがいがある。',
    options: ['Menutupi / Menyembunyikan skandal fakta', 'Mengumumkan secara terbuka', 'Memperbaiki kerusakan', 'Menyelidiki kebenaran'],
    correctIndex: 0,
    explanation: '「隠蔽 (いんぺい - inpei)」 adalah istilah resmi hukum/media untuk tindakan menutup-nutupi kesalahan atau menyembunyikan bukti.',
  },
  {
    id: 'qv-n1-6',
    category: 'vocab',
    level: 'N1',
    question: '景気の先行きに対する【懸念】が高まっている。Arti kata "懸念" adalah...',
    audioText: 'けいきのさきゆきにたいするけねんがたかまっている。',
    options: ['Kekhawatiran mendalam / Kecemasan serius', 'Harapan kemakmuran', 'Kepercayaan investor', 'Rencana investasi baru'],
    correctIndex: 0,
    explanation: '「懸念 (けねん - kenen)」 berarti rasa cemas atau kekhawatiran serius terhadap masa depan atau risiko bahaya.',
  },
  {
    id: 'qv-n1-7',
    category: 'vocab',
    level: 'N1',
    question: 'インターネット上には【膨大】な情報が溢れている。Arti kata "膨大" adalah...',
    audioText: 'インターネットじょうにはぼうだいなじょうほうがあふれている。',
    options: ['Sangat masif / Luar biasa besar jumlahnya', 'Sangat rahasia', 'Sangat ringkas', 'Sangat kuno'],
    correctIndex: 0,
    explanation: '「膨大 (ぼうだい - boudai)」 bermakna kuantitas atau skala yang sedemikian mengembang besarnya hingga luar biasa masif.',
  },
  {
    id: 'qv-n1-8',
    category: 'vocab',
    level: 'N1',
    question: '不正が【蔓延る】社会を正さなければならない。Arti kata "蔓延る" adalah...',
    audioText: 'ふせいがはびこるしゃかいをたださなければならない。',
    options: ['Merajalela / Menjalar liar tak terkendali', 'Hilang lenyap', 'Mulai berkurang', 'Baru saja muncul'],
    correctIndex: 0,
    explanation: '「蔓延る (はびこる - habikoru)」 adalah kata sastra/opini yang berarti kejahatan atau gulma tumbuh liar merajalela tanpa kendali.',
  },
  {
    id: 'qv-n1-9',
    category: 'vocab',
    level: 'N1',
    question: '悪天候のため計画の変更を【余儀なくされた】。Arti ekspresi tersebut adalah...',
    audioText: 'あくてんこうのためけいかくのへんこうをよぎなくされた。',
    options: ['Terpaksa harus dilakukan tanpa pilihan lain', 'Berhasil disetujui bersama', 'Ditolak secara sepihak', 'Dapat ditunda sementara'],
    correctIndex: 0,
    explanation: '「余儀なくされる (よぎなくされる - yogi naku sareru)」 adalah ungkapan formal berita bahwa keadaan memaksa seseorang menelan pil pahit.',
  },
  {
    id: 'qv-n1-10',
    category: 'vocab',
    level: 'N1',
    question: '彼は【躊躇】することなく燃え盛る家に飛び込んだ。Arti kata "躊躇" adalah...',
    audioText: 'かれはちゅうちょすることなくもえさかるいえにとびこんだ。',
    options: ['Ragu-ragu / Bimbang melangkah', 'Berteriak keras', 'Menangis sedih', 'Menyesal kemudian'],
    correctIndex: 0,
    explanation: '「躊躇 (ちゅうちょ - chuucho)」 berarti keragu-raguan atau kebimbangan batin sebelum mengambil tindakan.',
  },
];

export const CURATED_N1_GRAMMAR_QUIZ: MultipleChoiceQuestion[] = [
  {
    id: 'qg-n1-1',
    category: 'grammar',
    level: 'N1',
    question: '東京公演【　　】、全国ツアーが華々しくスタートした。Pilihan yang menyatakan "diawali dengan... lalu berturut-turut diikuti aksi serupa" adalah...',
    audioText: 'とうきょうこうえんをかわきりに、ぜんこくツアーがはなばなしくスタートした。',
    options: ['を皮切りに (o kawakiri ni)', 'をもって (o motte)', 'に至るまで (ni itaru made)', 'まみれ (mamire)'],
    correctIndex: 0,
    explanation: 'Pola 「〜を皮切りに（して）」 berarti diawali dengan peristiwa pertama sebagai pemantik rentetan acara berikutnya yang meluas.',
  },
  {
    id: 'qg-n1-2',
    category: 'grammar',
    level: 'N1',
    question: '本日午後５時【　　】、今年度の業務を終了いたします。Pilihan resmi kenegaraan untuk batas akhir waktu resmi adalah...',
    audioText: 'ほんじつごごごじをもちまして、こんねんどのぎょうむをしゅうりょういたします。',
    options: ['をもちまして (o mochimashite)', 'をかわきりに (o kawakiri ni)', 'んばかりに (n bakari ni)', 'ずくめ (zukume)'],
    correctIndex: 0,
    explanation: 'Pola 「〜をもって (sopan: をもちまして)」 digunakan dalam pidato formal resmi untuk menyatakan batas waktu penutupan resmi.',
  },
  {
    id: 'qg-n1-3',
    category: 'grammar',
    level: 'N1',
    question: '子供からお年寄り【　　】、全世代に愛されている。Pilihan untuk "bahkan hingga batas ekstrem/luas..." adalah...',
    audioText: 'こどもからおとしよりにいたるまで、ぜんせだいにあいされている。',
    options: ['に至るまで (ni itaru made)', 'を皮切りに (o kawakiri ni)', '極まりない (kiwamarinai)', 'まみれ (mamire)'],
    correctIndex: 0,
    explanation: 'Pola 「〜に至るまで (ni itaru made)」 menekankan luasnya cakupan hingga menjangkau batas ujung terjauh / hal ekstrem.',
  },
  {
    id: 'qg-n1-4',
    category: 'grammar',
    level: 'N1',
    question: '雨の中サッカーをして、【　　】になって帰ってきた。Pilihan yang tepat untuk menyatakan "berlumuran kotoran fisik" adalah...',
    audioText: 'あめのなかサッカーをして、どろまみれになってかえってきた。',
    options: ['泥まみれ (doro-mamire)', '泥ずくめ (doro-zukume)', '泥極まりない (doro-kiwamarinai)', '泥ならでは (doro-naradeha)'],
    correctIndex: 0,
    explanation: 'Pola 「〜まみれ」 melekat pada kotoran fisik (lumpur, darah, debu, hutang): 泥まみれ = sekujur tubuh berlumuran lumpur kotor.',
  },
  {
    id: 'qg-n1-5',
    category: 'grammar',
    level: 'N1',
    question: '昇進も結婚も決まり、今年は【　　】の一年だった。Pilihan yang menyatakan "seluruhnya serba dipenuhi hal bahagia" adalah...',
    audioText: 'しょうしんもけっこんもきまり、ことしはいいことずくめのいちねんだった。',
    options: ['いいことずくめ (ii koto zukume)', 'いいことまみれ (ii koto mamire)', 'いいこと極まる (ii koto kiwamaru)', 'いいこと相まって (ii koto aimatte)'],
    correctIndex: 0,
    explanation: 'Pola 「〜ずくめ」 menyatakan kondisi yang serba dipenuhi oleh satu hal sepanjang waktu: いいことずくめ = serba dipenuhi kabar baik.',
  },
  {
    id: 'qg-n1-6',
    category: 'grammar',
    level: 'N1',
    question: '彼女は今にも泣き出さ【　　】表情で話した。Pilihan yang menyatakan "seolah-olah hendak / hampir-hampir saja" adalah...',
    audioText: 'かのじょはいまにもなきださんばかりのひょうじょうではなした。',
    options: ['んばかりの (n bakari no)', 'ずくめの (zukume no)', 'まみれの (mamire no)', 'ならではの (naradeha no)'],
    correctIndex: 0,
    explanation: 'Pola 「KK Bentuk-ない + んばかり（に）」 (泣き出さんばかり) melukiskan intensitas gestur seakan-akan hendak meledak menangis saat itu juga.',
  },
  {
    id: 'qg-n1-7',
    category: 'grammar',
    level: 'N1',
    question: '命綱なしで高所に登るのは、【　　】行為だ。Pilihan yang menyatakan "derajat bahaya ekstrem tiada tara" adalah...',
    audioText: 'いのちづななしでこうしょにのぼるのは、きけんきわまりないこういだ。',
    options: ['危険極まりない (kiken kiwamarinai)', '危険まみれの (kiken mamire no)', '危険ずくめの (kiken zukume no)', '危険ならではの (kiken naradeha no)'],
    correctIndex: 0,
    explanation: 'Pola 「〜極まりない / 〜極まる」 menyatakan sifat negatif yang telah melampaui batas kewajaran hingga ekstrem tiada tara.',
  },
  {
    id: 'qg-n1-8',
    category: 'grammar',
    level: 'N1',
    question: '厳しい寒さと不況とが【　　】、生活を苦しめている。Pilihan untuk "bersatu padu saling melipatgandakan dampak" adalah...',
    audioText: 'きびしいさむさとふきょうとがあいまって、せいかつをくるしめている。',
    options: ['相まって (aimatte)', 'まみれて (mamirete)', '極まって (kiwamatte)', '皮切りにして (kawakiri ni shite)'],
    correctIndex: 0,
    explanation: 'Pola 「〜と相まって (to aimatte)」 menyatakan dua faktor bergabung dan saling menguatkan dampaknya berlipat ganda.',
  },
  {
    id: 'qg-n1-9',
    category: 'grammar',
    level: 'N1',
    question: '不慮の事故により、選手生命の引退を【　　】。Pilihan untuk "dipaksa keadaan menelan pil pahit" adalah...',
    audioText: 'ふりょのじこにより、せんしゅせいめいのいんたいをよぎなくされた。',
    options: ['余儀なくされた (yogi naku sareta)', '皮切りにされた (kawakiri ni sareta)', '極まりなくされた (kiwamarinaku sareta)', 'もってされた (motte sareta)'],
    correctIndex: 0,
    explanation: 'Pola 「〜を余儀なくされる」 menyatakan peristiwa buruk eksternal yang memaksa seseorang menelan kepahitan tanpa dapat melawan.',
  },
  {
    id: 'qg-n1-10',
    category: 'grammar',
    level: 'N1',
    question: '手作り【　　】温かみが感じられる料理だ。Pilihan untuk "keistimewaan khas tiada tara yang hanya ada pada..." adalah...',
    audioText: 'てづくりならではのあたたかみがかんじられるりょうりだ。',
    options: ['ならではの (naradeha no)', 'まみれの (mamire no)', 'ずくめの (zukume no)', 'んばかりの (n bakari no)'],
    correctIndex: 0,
    explanation: 'Pola 「〜ならでは（の）」 adalah bentuk sanjungan tinggi yang memuji keunikan khas yang hanya bisa dihasilkan oleh subjek tersebut.',
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

export function generateN1KanjiQuiz(count: number = 10): MultipleChoiceQuestion[] {
  const result: MultipleChoiceQuestion[] = [...CURATED_N1_KANJI_QUIZ];
  const shuffledKanji = shuffleArray(KANJI_N1_LIST);

  for (const item of shuffledKanji) {
    if (result.length >= count + CURATED_N1_KANJI_QUIZ.length) break;

    const wrongItems = KANJI_N1_LIST.filter(k => k.id !== item.id && k.meaningId !== item.meaningId);
    const shuffledWrongs = shuffleArray(wrongItems).slice(0, 3);

    const options = shuffleArray([
      item.meaningId,
      shuffledWrongs[0].meaningId,
      shuffledWrongs[1].meaningId,
      shuffledWrongs[2].meaningId,
    ]);

    result.push({
      id: `dyn-n1-k-${item.id}-${Math.random().toString(36).substr(2, 4)}`,
      category: 'kanji',
      level: 'N1',
      question: `Apa arti dari Kanji JLPT N1 「${item.kanji}」?`,
      audioText: item.onyomi[0] ? item.onyomi[0] : item.kanji,
      options,
      correctIndex: options.indexOf(item.meaningId),
      explanation: `Kanji 「${item.kanji}」 bermakna: ${item.meaningId}. Onyomi: ${item.onyomi.join(', ') || '-'} • Kunyomi: ${item.kunyomi.join(', ') || '-'}.${item.mnemonic ? `\nCara ingat: ${item.mnemonic}` : ''}`,
    });
  }

  return shuffleArray(result).slice(0, count);
}

export function generateN1VocabQuiz(count: number = 10): MultipleChoiceQuestion[] {
  const result: MultipleChoiceQuestion[] = [...CURATED_N1_VOCAB_QUIZ];
  const shuffledVocab = shuffleArray(VOCAB_N1_LIST);

  for (const item of shuffledVocab) {
    if (result.length >= count + CURATED_N1_VOCAB_QUIZ.length) break;

    const wrongItems = VOCAB_N1_LIST.filter(v => v.id !== item.id && v.meaningId !== item.meaningId);
    const shuffledWrongs = shuffleArray(wrongItems).slice(0, 3);

    const options = shuffleArray([
      item.meaningId,
      shuffledWrongs[0].meaningId,
      shuffledWrongs[1].meaningId,
      shuffledWrongs[2].meaningId,
    ]);

    const displayWord = item.kanji ? `${item.kanji} (${item.kana})` : item.kana;

    result.push({
      id: `dyn-n1-v-${item.id}-${Math.random().toString(36).substr(2, 4)}`,
      category: 'vocab',
      level: 'N1',
      question: `Apa arti kosakata JLPT N1 「${displayWord}」?`,
      audioText: item.kanji || item.kana,
      options,
      correctIndex: options.indexOf(item.meaningId),
      explanation: `「${displayWord}」 berarti "${item.meaningId}". Romaji: ${item.romaji}.${item.exampleSentence ? `\nContoh: ${item.exampleSentence.jp} (${item.exampleSentence.id})` : ''}`,
    });
  }

  return shuffleArray(result).slice(0, count);
}

export function generateN1GrammarQuiz(count: number = 10): MultipleChoiceQuestion[] {
  return shuffleArray([...CURATED_N1_GRAMMAR_QUIZ]).slice(0, count);
}

export function generateN1MockExam(count: number = 15): MultipleChoiceQuestion[] {
  const kanjiQuestions = generateN1KanjiQuiz(5);
  const vocabQuestions = generateN1VocabQuiz(5);
  const grammarQuestions = generateN1GrammarQuiz(5);

  const combined = shuffleArray([...kanjiQuestions, ...vocabQuestions, ...grammarQuestions]);
  return combined.slice(0, count);
}

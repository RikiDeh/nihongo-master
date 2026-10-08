import { VocabItem } from '../types';
import { VOCAB_N5_LIST } from './vocabN5Data';

export const VOCAB_DATA: VocabItem[] = [
  // Complete JLPT N5 Vocabulary
  ...VOCAB_N5_LIST,


  // N4 Vocabulary
  {
    id: 'v-n4-1',
    kanji: '案内する',
    kana: 'あんないする',
    romaji: 'annai suru',
    meaningEn: 'To guide / show around',
    meaningId: 'Memandu / Menunjukkan jalan',
    level: 'N4',
    category: 'Kata Kerja (Verbs)',
    partOfSpeech: 'Suru Verb',
    exampleSentence: {
      jp: '町を案内します。',
      furigana: 'まちをあんないします。',
      id: 'Saya akan memandu berkeliling kota.',
    },
  },
  {
    id: 'v-n4-2',
    kanji: '複雑',
    kana: 'ふくざつ',
    romaji: 'fukuzatsu',
    meaningEn: 'Complex / Complicated',
    meaningId: 'Rumit / Kompleks',
    level: 'N4',
    category: 'Kata Sifat (Adjectives)',
    partOfSpeech: 'Na-Adjective',
    exampleSentence: {
      jp: 'この問題は少し複雑です。',
      furigana: 'このもんだいはすこしふくざつです。',
      id: 'Masalah ini agak rumit.',
    },
  },
  {
    id: 'v-n4-3',
    kanji: '約束',
    kana: 'やくそく',
    romaji: 'yakusoku',
    meaningEn: 'Promise / Appointment',
    meaningId: 'Janji / Perjanjian',
    level: 'N4',
    category: 'Kata Benda (Nouns)',
    partOfSpeech: 'Noun',
    exampleSentence: {
      jp: '友達と約束があります。',
      furigana: 'ともだちとやくそくがあります。',
      id: 'Saya ada janji dengan teman.',
    },
  },

  // N3 Vocabulary
  {
    id: 'v-n3-1',
    kanji: '影響',
    kana: 'えいきょう',
    romaji: 'eikyou',
    meaningEn: 'Influence / Effect',
    meaningId: 'Pengaruh / Efek',
    level: 'N3',
    category: 'Sosial & Konsep',
    partOfSpeech: 'Noun / Suru Verb',
    exampleSentence: {
      jp: '天気が健康に影響を与える。',
      furigana: 'てんきがけんこうにえいきょうをあたえる。',
      id: 'Cuaca memberi pengaruh terhadap kesehatan.',
    },
  },
  {
    id: 'v-n3-2',
    kanji: '解決',
    kana: 'かいけつ',
    romaji: 'kaiketsu',
    meaningEn: 'Settlement / Solution',
    meaningId: 'Penyelesaian / Solusi',
    level: 'N3',
    category: 'Aksi & Solusi',
    partOfSpeech: 'Noun / Suru Verb',
    exampleSentence: {
      jp: '問題を早く解決しましょう。',
      furigana: 'もんだいをはやくかいけつしましょう。',
      id: 'Mari selesaikan masalah ini secepatnya.',
    },
  },

  // N2 Vocabulary
  {
    id: 'v-n2-1',
    kanji: '把握',
    kana: 'はあく',
    romaji: 'haaku',
    meaningEn: 'Grasp / Comprehend / Master',
    meaningId: 'Memahami sepenuhnya / Menguasai situasi',
    level: 'N2',
    category: 'Bisnis & Formal',
    partOfSpeech: 'Noun / Suru Verb',
    exampleSentence: {
      jp: '現状を正しく把握することが重要です。',
      furigana: 'げんじょうをただしくはあくすることがじゅうようです。',
      id: 'Sangat penting untuk memahami situasi saat ini dengan benar.',
    },
  },
  {
    id: 'v-n2-2',
    kanji: '貢献',
    kana: 'こうけん',
    romaji: 'kouken',
    meaningEn: 'Contribution / Services',
    meaningId: 'Kontribusi / Jasa',
    level: 'N2',
    category: 'Sosial & Karir',
    partOfSpeech: 'Noun / Suru Verb',
    exampleSentence: {
      jp: '社会に貢献する仕事がしたい。',
      furigana: 'しゃかいにこうけんするしごとがしたい。',
      id: 'Saya ingin melakukan pekerjaan yang berkontribusi pada masyarakat.',
    },
  },

  // N1 Vocabulary
  {
    id: 'v-n1-1',
    kanji: '躊躇',
    kana: 'ちゅうちょ',
    romaji: 'chuucho',
    meaningEn: 'Hesitation / Vacillation',
    meaningId: 'Ragu-ragu / Bimbang',
    level: 'N1',
    category: 'Literatur & Nuansa',
    partOfSpeech: 'Noun / Suru Verb',
    exampleSentence: {
      jp: '躊躇することなく発言した。',
      furigana: 'ちゅうちょすることなくはつげんした。',
      id: 'Dia berbicara tanpa sedikit pun rasa ragu.',
    },
  },
  {
    id: 'v-n1-2',
    kanji: '一目瞭然',
    kana: 'いちもりょうぜん',
    romaji: 'ichimoku ryouzen',
    meaningEn: 'Apparent / Obvious at a single glance',
    meaningId: 'Sangat jelas terlihat sekilas pandang (Yojijukugo)',
    level: 'N1',
    category: 'Yojijukugo (Idiom 4 Huruf)',
    partOfSpeech: 'Idiom / Na-Adjective',
    exampleSentence: {
      jp: 'グラフを見れば結果は一目瞭然だ。',
      furigana: 'ぐらふをみればけっかはいちもりょうぜんだ。',
      id: 'Hasilnya jelas terlihat sekali lihat jika memperhatikan grafik.',
    },
  },
  {
    id: 'v-n1-3',
    kanji: '余儀なくされる',
    kana: 'よぎなくされる',
    romaji: 'yogi naku sareru',
    meaningEn: 'To be forced to / Have no choice but to',
    meaningId: 'Terpaksa / Tak ada pilihan selain',
    level: 'N1',
    category: 'Ekspresi Formal / Berita',
    partOfSpeech: 'Expression',
    exampleSentence: {
      jp: '台風のため計画の変更を余儀なくされた。',
      furigana: 'たいふうのためけいかくのへんこうをよぎなくされた。',
      id: 'Akibat badai taifun, kami terpaksa harus mengubah rencana.',
    },
  },
];

import { VocabItem } from '../types';
import { VOCAB_N5_LIST } from './vocabN5Data';
import { VOCAB_N4_LIST } from './vocabN4Data';
import { VOCAB_N3_LIST } from './vocabN3Data';
import { VOCAB_N2_LIST } from './vocabN2Data';

export const VOCAB_DATA: VocabItem[] = [
  // Complete JLPT N5 Vocabulary
  ...VOCAB_N5_LIST,

  // Complete JLPT N4 Vocabulary
  ...VOCAB_N4_LIST,

  // Complete JLPT N3 Vocabulary
  ...VOCAB_N3_LIST,

  // Complete JLPT N2 Vocabulary
  ...VOCAB_N2_LIST,

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

import { KanjiItem } from '../types';
import { KANJI_N5_LIST } from './kanjiN5Data';
import { KANJI_N4_LIST } from './kanjiN4Data';

export const KANJI_DATA: KanjiItem[] = [
  // JLPT N5 Complete (105 Kanji Resmi)
  ...KANJI_N5_LIST,

  // JLPT N4 Complete
  ...KANJI_N4_LIST,

  // JLPT N3
  {
    id: 'kanji-n3-1',
    kanji: '政',
    level: 'N3',
    meaning: 'Politics, Government',
    meaningId: 'Politik, Pemerintahan',
    onyomi: ['セイ', 'ショウ'],
    kunyomi: ['まつりごと'],
    strokes: 9,
    radicals: ['正', '攵'],
    examples: [
      { word: '政治', reading: 'せいじ', meaning: 'Politik' },
      { word: '政府', reading: 'せいふ', meaning: 'Pemerintah' },
    ],
  },
  {
    id: 'kanji-n3-2',
    kanji: '経',
    level: 'N3',
    meaning: 'Pass through, Manage',
    meaningId: 'Melalui, Mengelola',
    onyomi: ['ケイ', 'キョウ'],
    kunyomi: ['へ・る'],
    strokes: 11,
    radicals: ['糸'],
    examples: [
      { word: '経済', reading: 'けいざい', meaning: 'Ekonomi' },
      { word: '経験', reading: 'けいけん', meaning: 'Pengalaman' },
      { word: '経営', reading: 'けいえい', meaning: 'Manajemen bisnis' },
    ],
  },
  {
    id: 'kanji-n3-3',
    kanji: '際',
    level: 'N3',
    meaning: 'Occasion, Edge',
    meaningId: 'Saat, Batas, Antara',
    onyomi: ['サイ'],
    kunyomi: ['きわ'],
    strokes: 14,
    radicals: ['阝', '祭'],
    examples: [
      { word: '国際', reading: 'こくさい', meaning: 'Internasional' },
      { word: '実際', reading: 'じっさい', meaning: 'Kenyataan / Sebenarnya' },
    ],
  },

  // JLPT N2
  {
    id: 'kanji-n2-1',
    kanji: '資',
    level: 'N2',
    meaning: 'Assets, Resources, Capital',
    meaningId: 'Aset, Modal, Sumber daya',
    onyomi: ['シ'],
    kunyomi: [],
    strokes: 13,
    radicals: ['次', '貝'],
    examples: [
      { word: '資料', reading: 'しりょう', meaning: 'Data / Dokumen' },
      { word: '資源', reading: 'しげん', meaning: 'Sumber daya alam' },
      { word: '資格', reading: 'しかく', meaning: 'Kualifikasi / Sertifikasi' },
    ],
  },
  {
    id: 'kanji-n2-2',
    kanji: '創',
    level: 'N2',
    meaning: 'Create, Originate',
    meaningId: 'Menciptakan, Kreasi',
    onyomi: ['ソウ'],
    kunyomi: ['つく・る'],
    strokes: 12,
    radicals: ['倉', '刂'],
    examples: [
      { word: '創造', reading: 'そうぞう', meaning: 'Penciptaan / Kreasi' },
      { word: '独創的', reading: 'どくそうてき', meaning: 'Orisinal / Kreatif' },
    ],
  },

  // JLPT N1
  {
    id: 'kanji-n1-1',
    kanji: '緻',
    level: 'N1',
    meaning: 'Fine, Minute, Precise',
    meaningId: 'Rinci, Teliti, Halus',
    onyomi: ['チ'],
    kunyomi: [],
    strokes: 15,
    radicals: ['糸', '致'],
    examples: [
      { word: '緻密', reading: 'ちみつ', meaning: 'Teliti / Sangat cermat' },
      { word: '精緻', reading: 'せいち', meaning: 'Presisi / Sempurna' },
    ],
  },
  {
    id: 'kanji-n1-2',
    kanji: '蔑',
    level: 'N1',
    meaning: 'Disdain, Scorn, Despise',
    meaningId: 'Menghina, Meremehkan',
    onyomi: ['ベツ'],
    kunyomi: ['さげす・む'],
    strokes: 14,
    radicals: ['艹', '伐'],
    examples: [
      { word: '蔑視', reading: 'べっし', meaning: 'Memandang rendah / Meremehkan' },
      { word: '蔑称', reading: 'べっしょう', meaning: 'Sebutan bernada merendahkan' },
    ],
  },
  {
    id: 'kanji-n1-3',
    kanji: '綻',
    level: 'N1',
    meaning: 'Rip, Unravel, Burst forth',
    meaningId: 'Robek, Merekah, Runtuh',
    onyomi: ['タン'],
    kunyomi: ['ほころ・びる'],
    strokes: 14,
    radicals: ['糸', '定'],
    examples: [
      { word: '破綻', reading: 'はたん', meaning: 'Kebangkrutan / Keruntuhan rencana' },
      { word: '綻びる', reading: 'ほころびる', meaning: 'Merekah (senyum/bunga)' },
    ],
  },
];

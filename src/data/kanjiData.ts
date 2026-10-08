import { KanjiItem } from '../types';
import { KANJI_N5_LIST } from './kanjiN5Data';
import { KANJI_N4_LIST } from './kanjiN4Data';
import { KANJI_N3_LIST } from './kanjiN3Data';
import { KANJI_N2_LIST } from './kanjiN2Data';

export const KANJI_DATA: KanjiItem[] = [
  // JLPT N5 Complete (105 Kanji Resmi)
  ...KANJI_N5_LIST,

  // JLPT N4 Complete
  ...KANJI_N4_LIST,

  // JLPT N3 Complete
  ...KANJI_N3_LIST,

  // JLPT N2 Complete
  ...KANJI_N2_LIST,

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

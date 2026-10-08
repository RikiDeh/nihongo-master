import { KanjiItem } from '../types';
import { KANJI_N5_LIST } from './kanjiN5Data';
import { KANJI_N4_LIST } from './kanjiN4Data';
import { KANJI_N3_LIST } from './kanjiN3Data';
import { KANJI_N2_LIST } from './kanjiN2Data';
import { KANJI_N1_LIST } from './kanjiN1Data';

export const KANJI_DATA: KanjiItem[] = [
  // JLPT N5 Complete (105 Kanji Resmi)
  ...KANJI_N5_LIST,

  // JLPT N4 Complete
  ...KANJI_N4_LIST,

  // JLPT N3 Complete
  ...KANJI_N3_LIST,

  // JLPT N2 Complete
  ...KANJI_N2_LIST,

  // JLPT N1 Complete
  ...KANJI_N1_LIST,
];

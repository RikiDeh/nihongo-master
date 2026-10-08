import { VocabItem } from '../types';
import { VOCAB_N5_LIST } from './vocabN5Data';
import { VOCAB_N4_LIST } from './vocabN4Data';
import { VOCAB_N3_LIST } from './vocabN3Data';
import { VOCAB_N2_LIST } from './vocabN2Data';
import { VOCAB_N1_LIST } from './vocabN1Data';

export const VOCAB_DATA: VocabItem[] = [
  // Complete JLPT N5 Vocabulary
  ...VOCAB_N5_LIST,

  // Complete JLPT N4 Vocabulary
  ...VOCAB_N4_LIST,

  // Complete JLPT N3 Vocabulary
  ...VOCAB_N3_LIST,

  // Complete JLPT N2 Vocabulary
  ...VOCAB_N2_LIST,

  // Complete JLPT N1 Vocabulary
  ...VOCAB_N1_LIST,
];

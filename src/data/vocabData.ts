import { VocabItem } from '../types';
import { VOCAB_N5_LIST } from './vocabN5Data';
import { VOCAB_N5_COMPLETE } from './vocabN5CompleteData';
import { VOCAB_N4_LIST } from './vocabN4Data';
import { VOCAB_N4_COMPLETE } from './vocabN4CompleteData';
import { VOCAB_N3_LIST } from './vocabN3Data';
import { VOCAB_N3_COMPLETE } from './vocabN3CompleteData';
import { VOCAB_N2_LIST } from './vocabN2Data';
import { VOCAB_N1_LIST } from './vocabN1Data';

export const VOCAB_DATA: VocabItem[] = [
  // Complete JLPT N5 Vocabulary (Core + Bulk Complete)
  ...VOCAB_N5_LIST,
  ...VOCAB_N5_COMPLETE,

  // Complete JLPT N4 Vocabulary (Core + Batches + Bulk Complete)
  ...VOCAB_N4_LIST,
  ...VOCAB_N4_COMPLETE,

  // Complete JLPT N3 Vocabulary (Core + Batches + Bulk Complete)
  ...VOCAB_N3_LIST,
  ...VOCAB_N3_COMPLETE,

  // Complete JLPT N2 Vocabulary
  ...VOCAB_N2_LIST,

  // Complete JLPT N1 Vocabulary
  ...VOCAB_N1_LIST,
];

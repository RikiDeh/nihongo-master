import { VocabItem } from '../types';
import { VOCAB_N5_LIST } from './vocabN5Data';
import { VOCAB_N5_COMPLETE } from './vocabN5CompleteData';
import { VOCAB_N4_LIST } from './vocabN4Data';
import { VOCAB_N4_COMPLETE } from './vocabN4CompleteData';
import { VOCAB_N3_LIST } from './vocabN3Data';
import { VOCAB_N3_COMPLETE } from './vocabN3CompleteData';
import { VOCAB_N2_LIST } from './vocabN2Data';
import { VOCAB_N2_COMPLETE } from './vocabN2CompleteData';
import { VOCAB_N1_LIST } from './vocabN1Data';
import { VOCAB_N1_COMPLETE } from './vocabN1CompleteData';

export const VOCAB_DATA: VocabItem[] = [
  // Complete JLPT N5 Vocabulary (Core + Bulk Exhaustive)
  ...VOCAB_N5_LIST,
  ...VOCAB_N5_COMPLETE,

  // Complete JLPT N4 Vocabulary (Core + Batches + Bulk Exhaustive)
  ...VOCAB_N4_LIST,
  ...VOCAB_N4_COMPLETE,

  // Complete JLPT N3 Vocabulary (Core + Batches + Bulk Exhaustive)
  ...VOCAB_N3_LIST,
  ...VOCAB_N3_COMPLETE,

  // Complete JLPT N2 Vocabulary (Core + Batches + Bulk Exhaustive)
  ...VOCAB_N2_LIST,
  ...VOCAB_N2_COMPLETE,

  // Complete JLPT N1 Vocabulary (Core + Batches + Bulk Exhaustive)
  ...VOCAB_N1_LIST,
  ...VOCAB_N1_COMPLETE,
];

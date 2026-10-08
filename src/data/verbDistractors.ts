import { ConjugationForm } from '../types';

export interface OptionItem {
  kanji: string;
  romaji: string;
}

export const SPECIFIC_DISTRACTORS: Record<string, Record<ConjugationForm, OptionItem[]>> = {
  'v-iku': {
    te: [
      { kanji: '行いて', romaji: 'iite' },
      { kanji: '行きて', romaji: 'ikite' },
      { kanji: '行いで', romaji: 'iide' },
    ],
    ta: [
      { kanji: '行いた', romaji: 'iita' },
      { kanji: '行きた', romaji: 'ikita' },
      { kanji: '行いだ', romaji: 'iida' },
    ],
    nai: [
      { kanji: '行きない', romaji: 'ikinai' },
      { kanji: '行くない', romaji: 'ikunai' },
      { kanji: '行けない', romaji: 'ikenai' },
    ],
    masu: [
      { kanji: '行くます', romaji: 'ikumasu' },
      { kanji: '行かます', romaji: 'ikamasu' },
      { kanji: '行けます', romaji: 'ikemasu' },
    ],
  },
  'v-kaku': {
    te: [
      { kanji: '書って', romaji: 'katte' },
      { kanji: '書きて', romaji: 'kakite' },
      { kanji: '書いで', romaji: 'kaide' },
    ],
    ta: [
      { kanji: '書った', romaji: 'katta' },
      { kanji: '書きた', romaji: 'kakita' },
      { kanji: '書いだ', romaji: 'kaida' },
    ],
    nai: [
      { kanji: '書きない', romaji: 'kakinai' },
      { kanji: '書くない', romaji: 'kakunai' },
      { kanji: '書けない', romaji: 'kakenai' },
    ],
    masu: [
      { kanji: '書くます', romaji: 'kakumasu' },
      { kanji: '書かます', romaji: 'kakamasu' },
      { kanji: '書けます', romaji: 'kakemasu' },
    ],
  },
  'v-kiku': {
    te: [
      { kanji: '聞って', romaji: 'kitte' },
      { kanji: '聞きて', romaji: 'kikite' },
      { kanji: '聞いで', romaji: 'kiide' },
    ],
    ta: [
      { kanji: '聞った', romaji: 'kitta' },
      { kanji: '聞きた', romaji: 'kikita' },
      { kanji: '聞いだ', romaji: 'kiida' },
    ],
    nai: [
      { kanji: '聞きない', romaji: 'kikinai' },
      { kanji: '聞くない', romaji: 'kikunai' },
      { kanji: '聞けない', romaji: 'kikenai' },
    ],
    masu: [
      { kanji: '聞くます', romaji: 'kikumasu' },
      { kanji: '聞かます', romaji: 'kikamasu' },
      { kanji: '聞けます', romaji: 'kikemasu' },
    ],
  },
  'v-oyogu': {
    te: [
      { kanji: '泳いて', romaji: 'oyoite' },
      { kanji: '泳ぎて', romaji: 'oyogite' },
      { kanji: '泳んで', romaji: 'oyonde' },
    ],
    ta: [
      { kanji: '泳いた', romaji: 'oyoita' },
      { kanji: '泳ぎた', romaji: 'oyogita' },
      { kanji: '泳んだ', romaji: 'oyonda' },
    ],
    nai: [
      { kanji: '泳ぎない', romaji: 'oyoginai' },
      { kanji: '泳ぐない', romaji: 'oyogunai' },
      { kanji: '泳げない', romaji: 'oyogenai' },
    ],
    masu: [
      { kanji: '泳ぐます', romaji: 'oyogumasu' },
      { kanji: '泳がます', romaji: 'oyogamasu' },
      { kanji: '泳げます', romaji: 'oyogemasu' },
    ],
  },
  'v-hanasu': {
    te: [
      { kanji: '話いて', romaji: 'hanaite' },
      { kanji: '話って', romaji: 'hanatte' },
      { kanji: '話んで', romaji: 'hanande' },
    ],
    ta: [
      { kanji: '話いた', romaji: 'hanaita' },
      { kanji: '話った', romaji: 'hanatta' },
      { kanji: '話んだ', romaji: 'hananda' },
    ],
    nai: [
      { kanji: '話しない', romaji: 'hanashinai' },
      { kanji: '話すない', romaji: 'hanasunai' },
      { kanji: '話せない', romaji: 'hanasenai' },
    ],
    masu: [
      { kanji: '話すます', romaji: 'hanasumasu' },
      { kanji: '話さます', romaji: 'hanasamasu' },
      { kanji: '話せます', romaji: 'hanasemasu' },
    ],
  },
  'v-matsu': {
    te: [
      { kanji: '待ちて', romaji: 'machite' },
      { kanji: '待んで', romaji: 'mande' },
      { kanji: '待いて', romaji: 'maite' },
    ],
    ta: [
      { kanji: '待ちた', romaji: 'machita' },
      { kanji: '待んだ', romaji: 'manda' },
      { kanji: '待いた', romaji: 'maita' },
    ],
    nai: [
      { kanji: '待ちない', romaji: 'machinai' },
      { kanji: '待つない', romaji: 'matsunai' },
      { kanji: '待てない', romaji: 'matenai' },
    ],
    masu: [
      { kanji: '待つます', romaji: 'matsumasu' },
      { kanji: 'またます', romaji: 'matamasu' },
      { kanji: '待てます', romaji: 'matemasu' },
    ],
  },
  'v-kau': {
    te: [
      { kanji: '買いいて', romaji: 'kaiite' },
      { kanji: '買いで', romaji: 'kaide' },
      { kanji: '買いて', romaji: 'kaite' },
    ],
    ta: [
      { kanji: '買いた', romaji: 'kaita' },
      { kanji: '買いだ', romaji: 'kaida' },
      { kanji: '買んだ', romaji: 'kanda' },
    ],
    nai: [
      { kanji: '買いない', romaji: 'kainai' },
      { kanji: '買うない', romaji: 'kaunai' },
      { kanji: '買あない', romaji: 'kaanai' },
    ],
    masu: [
      { kanji: '買うます', romaji: 'kaumasu' },
      { kanji: '買わます', romaji: 'kawamasu' },
      { kanji: '買えます', romaji: 'kaemasu' },
    ],
  },
  'v-kaeru': {
    te: [
      { kanji: '帰て', romaji: 'kaete' },
      { kanji: '帰りて', romaji: 'kaerite' },
      { kanji: '帰んで', romaji: 'kaende' },
    ],
    ta: [
      { kanji: '帰た', romaji: 'kaeta' },
      { kanji: '帰りた', romaji: 'kaerita' },
      { kanji: '帰んだ', romaji: 'kaenda' },
    ],
    nai: [
      { kanji: '帰ない', romaji: 'kaenai' },
      { kanji: '帰りない', romaji: 'kaerinai' },
      { kanji: '帰るない', romaji: 'kaerunai' },
    ],
    masu: [
      { kanji: '帰ます', romaji: 'kaemasu' },
      { kanji: '帰るます', romaji: 'kaerumasu' },
      { kanji: '帰らます', romaji: 'kaeramasu' },
    ],
  },
  'v-nomu': {
    te: [
      { kanji: '飲んて', romaji: 'nonte' },
      { kanji: '飲みて', romaji: 'nomite' },
      { kanji: '飲って', romaji: 'notte' },
    ],
    ta: [
      { kanji: '飲んた', romaji: 'nonta' },
      { kanji: '飲みた', romaji: 'nomita' },
      { kanji: '飲った', romaji: 'notta' },
    ],
    nai: [
      { kanji: '飲みない', romaji: 'nominai' },
      { kanji: '飲むない', romaji: 'nomunai' },
      { kanji: '飲めない', romaji: 'nomenai' },
    ],
    masu: [
      { kanji: '飲むます', romaji: 'nomumasu' },
      { kanji: '飲まます', romaji: 'nomamasu' },
      { kanji: '飲めます', romaji: 'nomemasu' },
    ],
  },
  'v-asobu': {
    te: [
      { kanji: '遊んて', romaji: 'asonte' },
      { kanji: '遊びて', romaji: 'asobite' },
      { kanji: '遊って', romaji: 'asotte' },
    ],
    ta: [
      { kanji: '遊んた', romaji: 'asonta' },
      { kanji: '遊びた', romaji: 'asobita' },
      { kanji: '遊った', romaji: 'asotta' },
    ],
    nai: [
      { kanji: '遊びない', romaji: 'asobinai' },
      { kanji: '遊ぶない', romaji: 'asobunai' },
      { kanji: '遊べない', romaji: 'asobenai' },
    ],
    masu: [
      { kanji: '遊ぶます', romaji: 'asobumasu' },
      { kanji: '遊ばます', romaji: 'asobamasu' },
      { kanji: '遊べます', romaji: 'asobemasu' },
    ],
  },
  'v-shinu': {
    te: [
      { kanji: '死んて', romaji: 'shinte' },
      { kanji: '死にて', romaji: 'shinite' },
      { kanji: '死って', romaji: 'shitte' },
    ],
    ta: [
      { kanji: '死んた', romaji: 'shinta' },
      { kanji: '死にた', romaji: 'shinita' },
      { kanji: '死った', romaji: 'shitta' },
    ],
    nai: [
      { kanji: '死にない', romaji: 'shininai' },
      { kanji: '死ぬない', romaji: 'shinunai' },
      { kanji: '死ねない', romaji: 'shinenai' },
    ],
    masu: [
      { kanji: '死ぬます', romaji: 'shinumasu' },
      { kanji: '死なます', romaji: 'shinamasu' },
      { kanji: '死ねます', romaji: 'shinemasu' },
    ],
  },
  'v-taberu': {
    te: [
      { kanji: '食べって', romaji: 'tabette' },
      { kanji: '食べんで', romaji: 'tabende' },
      { kanji: '食べいて', romaji: 'tabeite' },
    ],
    ta: [
      { kanji: '食べった', romaji: 'tabetta' },
      { kanji: '食べんだ', romaji: 'tabenda' },
      { kanji: '食べいた', romaji: 'tabeita' },
    ],
    nai: [
      { kanji: '食べらない', romaji: 'taberanai' },
      { kanji: '食べるない', romaji: 'taberunai' },
      { kanji: '食べりない', romaji: 'taberinai' },
    ],
    masu: [
      { kanji: '食べるます', romaji: 'taberumasu' },
      { kanji: '食べります', romaji: 'taberimasu' },
      { kanji: '食べらます', romaji: 'taberamasu' },
    ],
  },
  'v-miru': {
    te: [
      { kanji: '見って', romaji: 'mitte' },
      { kanji: '見んで', romaji: 'minde' },
      { kanji: '見いて', romaji: 'miite' },
    ],
    ta: [
      { kanji: '見った', romaji: 'mitta' },
      { kanji: '見んだ', romaji: 'minda' },
      { kanji: '見いた', romaji: 'miita' },
    ],
    nai: [
      { kanji: '見らない', romaji: 'miranai' },
      { kanji: '見るない', romaji: 'mirunai' },
      { kanji: '見りない', romaji: 'mirinai' },
    ],
    masu: [
      { kanji: '見るます', romaji: 'mirumasu' },
      { kanji: '見ります', romaji: 'mirimasu' },
      { kanji: '見らます', romaji: 'miramasu' },
    ],
  },
  'v-okiru': {
    te: [
      { kanji: '起きって', romaji: 'okitte' },
      { kanji: '起きんで', romaji: 'okinde' },
      { kanji: '起きいて', romaji: 'okiite' },
    ],
    ta: [
      { kanji: '起きった', romaji: 'okitta' },
      { kanji: '起きんだ', romaji: 'okinda' },
      { kanji: '起きいた', romaji: 'okiita' },
    ],
    nai: [
      { kanji: '起きらない', romaji: 'okiranai' },
      { kanji: '起きるない', romaji: 'okirunai' },
      { kanji: '起きりない', romaji: 'okirinai' },
    ],
    masu: [
      { kanji: '起きるます', romaji: 'okirumasu' },
      { kanji: '起きります', romaji: 'okirimasu' },
      { kanji: '起きらます', romaji: 'okiramasu' },
    ],
  },
  'v-neru': {
    te: [
      { kanji: '寝って', romaji: 'nette' },
      { kanji: '寝んで', romaji: 'nende' },
      { kanji: '寝いて', romaji: 'neite' },
    ],
    ta: [
      { kanji: '寝った', romaji: 'netta' },
      { kanji: '寝んだ', romaji: 'nenda' },
      { kanji: '寝いた', romaji: 'neita' },
    ],
    nai: [
      { kanji: '寝らない', romaji: 'neranai' },
      { kanji: '寝るない', romaji: 'nerunai' },
      { kanji: '寝りない', romaji: 'nerinai' },
    ],
    masu: [
      { kanji: '寝るます', romaji: 'nerumasu' },
      { kanji: '寝ります', romaji: 'nerimasu' },
      { kanji: '寝らます', romaji: 'neramasu' },
    ],
  },
  'v-oshieru': {
    te: [
      { kanji: '教えって', romaji: 'oshiette' },
      { kanji: '教えんで', romaji: 'oshiende' },
      { kanji: '教えいて', romaji: 'oshieite' },
    ],
    ta: [
      { kanji: '教えった', romaji: 'oshietta' },
      { kanji: '教えんだ', romaji: 'oshienda' },
      { kanji: '教えいた', romaji: 'oshieita' },
    ],
    nai: [
      { kanji: '教えらない', romaji: 'oshieranai' },
      { kanji: '教えるない', romaji: 'oshierunai' },
      { kanji: '教えりない', romaji: 'oshierinai' },
    ],
    masu: [
      { kanji: '教えるます', romaji: 'oshierumasu' },
      { kanji: '教えります', romaji: 'oshierimasu' },
      { kanji: '教えらます', romaji: 'oshieramasu' },
    ],
  },
  'v-suru': {
    te: [
      { kanji: 'すって', romaji: 'sutte' },
      { kanji: 'すて', romaji: 'sute' },
      { kanji: 'すいて', romaji: 'suite' },
    ],
    ta: [
      { kanji: 'すった', romaji: 'sutta' },
      { kanji: 'すた', romaji: 'suta' },
      { kanji: 'すいた', romaji: 'suita' },
    ],
    nai: [
      { kanji: 'すらない', romaji: 'suranai' },
      { kanji: 'すない', romaji: 'sunai' },
      { kanji: 'さない', romaji: 'sanai' },
    ],
    masu: [
      { kanji: 'するます', romaji: 'surumasu' },
      { kanji: 'すます', romaji: 'sumasu' },
      { kanji: 'せます', romaji: 'semasu' },
    ],
  },
  'v-kuru': {
    te: [
      { kanji: 'きって', romaji: 'kitte' },
      { kanji: 'くって', romaji: 'kutte' },
      { kanji: 'こて', romaji: 'kote' },
    ],
    ta: [
      { kanji: 'きった', romaji: 'kitta' },
      { kanji: 'くった', romaji: 'kutta' },
      { kanji: 'こた', romaji: 'kota' },
    ],
    nai: [
      { kanji: 'きない', romaji: 'kinai' },
      { kanji: 'くるない', romaji: 'kurunai' },
      { kanji: 'くらない', romaji: 'kuranai' },
    ],
    masu: [
      { kanji: 'くます', romaji: 'kumasu' },
      { kanji: 'こます', romaji: 'komasu' },
      { kanji: 'くるます', romaji: 'kurumasu' },
    ],
  },
};

/**
 * Fisher-Yates shuffle murni untuk menghindari statistical bias
 */
export function fisherYatesShuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Mendapatkan 3 opsi pengecoh cerdas yang menguji aturan bunyi target form
 */
export function getDistractorsForVerb(verbId: string, form: ConjugationForm): OptionItem[] {
  // Jika kata suru turunan (misal benkyou suru)
  if (verbId === 'v-benkyou-suru') {
    const suruDistractors = SPECIFIC_DISTRACTORS['v-suru'][form];
    return suruDistractors.map(d => ({
      kanji: '勉強' + d.kanji,
      romaji: 'benkyou ' + d.romaji,
    }));
  }

  if (SPECIFIC_DISTRACTORS[verbId] && SPECIFIC_DISTRACTORS[verbId][form]) {
    return SPECIFIC_DISTRACTORS[verbId][form];
  }

  // Fallback generik jika tidak terdaftar
  switch (form) {
    case 'te':
      return [
        { kanji: '〜って', romaji: '~tte' },
        { kanji: '〜んで', romaji: '~nde' },
        { kanji: '〜いて', romaji: '~ite' },
      ];
    case 'ta':
      return [
        { kanji: '〜った', romaji: '~tta' },
        { kanji: '〜んだ', romaji: '~nda' },
        { kanji: '〜いた', romaji: '~ita' },
      ];
    case 'nai':
      return [
        { kanji: '〜かない', romaji: '~kanai' },
        { kanji: '〜まない', romaji: '~manai' },
        { kanji: '〜らない', romaji: '~ranai' },
      ];
    case 'masu':
      return [
        { kanji: '〜きます', romaji: '~kimasu' },
        { kanji: '〜みます', romaji: '~mimasu' },
        { kanji: '〜ります', romaji: '~rimasu' },
      ];
  }
}

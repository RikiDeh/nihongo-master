import { ConjugationForm } from '../types';
import { VERBS_DATA } from './verbsData';

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
    potential: [
      { kanji: '行かれる', romaji: 'ikareru' },
      { kanji: '行けられる', romaji: 'ikerareru' },
      { kanji: '行られる', romaji: 'ikurareru' },
    ],
    passive: [
      { kanji: '行ける', romaji: 'ikeru' },
      { kanji: '行かせる', romaji: 'ikaseru' },
      { kanji: '行てられる', romaji: 'itterareru' },
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
    potential: [
      { kanji: '書かれる', romaji: 'kakareru' },
      { kanji: '書けられる', romaji: 'kakerareru' },
      { kanji: '書くられる', romaji: 'kakurareru' },
    ],
    passive: [
      { kanji: '書ける', romaji: 'kakeru' },
      { kanji: '書かせる', romaji: 'kakaseru' },
      { kanji: '書いてれる', romaji: 'kaitereru' },
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
    potential: [
      { kanji: '聞かれる', romaji: 'kikareru' },
      { kanji: '聞けられる', romaji: 'kikerareru' },
      { kanji: '聞くられる', romaji: 'kikurareru' },
    ],
    passive: [
      { kanji: '聞ける', romaji: 'kikeru' },
      { kanji: '聞かせる', romaji: 'kikaseru' },
      { kanji: '聞いてれる', romaji: 'kiitereru' },
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
    potential: [
      { kanji: '泳がれる', romaji: 'oyogareru' },
      { kanji: '泳げられる', romaji: 'oyogerareru' },
      { kanji: '泳ぐられる', romaji: 'oyogurareru' },
    ],
    passive: [
      { kanji: '泳げる', romaji: 'oyogeru' },
      { kanji: '泳がせる', romaji: 'oyogaseru' },
      { kanji: '泳いでれる', romaji: 'oyoidereru' },
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
    potential: [
      { kanji: '話される', romaji: 'hanasareru' },
      { kanji: '話せられる', romaji: 'hanaserareru' },
      { kanji: '話すられる', romaji: 'hanasurareru' },
    ],
    passive: [
      { kanji: '話せる', romaji: 'hanaseru' },
      { kanji: '話させる', romaji: 'hanasaseru' },
      { kanji: '話してれる', romaji: 'hanashitereru' },
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
    potential: [
      { kanji: '待たれる', romaji: 'matareru' },
      { kanji: '待てられる', romaji: 'materareru' },
      { kanji: '待ちられる', romaji: 'machirareru' },
    ],
    passive: [
      { kanji: '待てる', romaji: 'materu' },
      { kanji: '待たせる', romaji: 'mataseru' },
      { kanji: '待ってれる', romaji: 'mattereru' },
    ],
  },
  'v-toru': {
    te: [
      { kanji: '取て', romaji: 'tote' },
      { kanji: '取りて', romaji: 'torite' },
      { kanji: '取いで', romaji: 'toide' },
    ],
    ta: [
      { kanji: '取た', romaji: 'tota' },
      { kanji: '取りた', romaji: 'torita' },
      { kanji: '取いだ', romaji: 'toida' },
    ],
    nai: [
      { kanji: '取ない', romaji: 'tonai' },
      { kanji: '取りない', romaji: 'torinai' },
      { kanji: '取れない', romaji: 'torenai' },
    ],
    masu: [
      { kanji: '取くます', romaji: 'tokumasu' },
      { kanji: '取ます', romaji: 'tomasu' },
      { kanji: '取れます', romaji: 'toremasu' },
    ],
    potential: [
      { kanji: '取られる', romaji: 'torareru' },
      { kanji: '取れられる', romaji: 'torerareru' },
      { kanji: '取りられる', romaji: 'torirareru' },
    ],
    passive: [
      { kanji: '取れる', romaji: 'toreru' },
      { kanji: '取らせる', romaji: 'toraseru' },
      { kanji: '取ってれる', romaji: 'tottereru' },
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
    potential: [
      { kanji: '買われる', romaji: 'kawareru' },
      { kanji: '買えられる', romaji: 'kaerareru' },
      { kanji: '買られる', romaji: 'kaurareru' },
    ],
    passive: [
      { kanji: '買あれる', romaji: 'kaareru' },
      { kanji: '買える', romaji: 'kaeru' },
      { kanji: '買わせる', romaji: 'kawaseru' },
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
    potential: [
      { kanji: '帰られる', romaji: 'kaerareru' },
      { kanji: '帰えれる', romaji: 'kaeereru' },
      { kanji: '帰りられる', romaji: 'kaerirareru' },
    ],
    passive: [
      { kanji: '帰れる', romaji: 'kaereru' },
      { kanji: '帰らせる', romaji: 'kaeraseru' },
      { kanji: '帰ってれる', romaji: 'kaettereru' },
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
    potential: [
      { kanji: '飲まれる', romaji: 'nomareru' },
      { kanji: '飲められる', romaji: 'nomerareru' },
      { kanji: '飲みられる', romaji: 'nomirareru' },
    ],
    passive: [
      { kanji: '飲める', romaji: 'nomeru' },
      { kanji: '飲ませる', romaji: 'nomaseru' },
      { kanji: '飲んでれる', romaji: 'nondereru' },
    ],
  },
  'v-yomu': {
    te: [
      { kanji: '読んて', romaji: 'yonte' },
      { kanji: '読みて', romaji: 'yomite' },
      { kanji: '読って', romaji: 'yotte' },
    ],
    ta: [
      { kanji: '読んた', romaji: 'yonta' },
      { kanji: '読みた', romaji: 'yomita' },
      { kanji: '読った', romaji: 'yotta' },
    ],
    nai: [
      { kanji: '読みない', romaji: 'yominai' },
      { kanji: '読むない', romaji: 'yomunai' },
      { kanji: '読めない', romaji: 'yomenai' },
    ],
    masu: [
      { kanji: '読むます', romaji: 'yomumasu' },
      { kanji: '読まます', romaji: 'yomamasu' },
      { kanji: '読めます', romaji: 'yomemasu' },
    ],
    potential: [
      { kanji: '読まれる', romaji: 'yomareru' },
      { kanji: '読められる', romaji: 'yomerareru' },
      { kanji: '読みられる', romaji: 'yomirareru' },
    ],
    passive: [
      { kanji: '読める', romaji: 'yomeru' },
      { kanji: '読ませる', romaji: 'yomaseru' },
      { kanji: '読んでれる', romaji: 'yondereru' },
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
    potential: [
      { kanji: '遊ばれる', romaji: 'asobareru' },
      { kanji: '遊べられる', romaji: 'asoberareru' },
      { kanji: '遊びられる', romaji: 'asobirareru' },
    ],
    passive: [
      { kanji: '遊べる', romaji: 'asoberu' },
      { kanji: '遊ばせる', romaji: 'asobaseru' },
      { kanji: '遊んでれる', romaji: 'asondereru' },
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
    potential: [
      { kanji: '死なれる', romaji: 'shinareru' },
      { kanji: '死ねられる', romaji: 'shinerareru' },
      { kanji: '死にられる', romaji: 'shinirareru' },
    ],
    passive: [
      { kanji: '死ねる', romaji: 'shineru' },
      { kanji: '死なせる', romaji: 'shinaseru' },
      { kanji: '死んでれる', romaji: 'shindereru' },
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
    potential: [
      { kanji: '食べれる', romaji: 'tabereru' },
      { kanji: '食べえる', romaji: 'tabeeru' },
      { kanji: '食べさせる', romaji: 'tabesaseru' },
    ],
    passive: [
      { kanji: '食べれる', romaji: 'tabereru' },
      { kanji: '食べされる', romaji: 'tabesareru' },
      { kanji: '食べわす', romaji: 'tabewasu' },
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
    potential: [
      { kanji: '見れる', romaji: 'mireru' },
      { kanji: '見える', romaji: 'mieru' },
      { kanji: '見せる', romaji: 'miseru' },
    ],
    passive: [
      { kanji: '見れる', romaji: 'mireru' },
      { kanji: '見される', romaji: 'misareru' },
      { kanji: '見らせる', romaji: 'miraseru' },
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
    potential: [
      { kanji: '起きれる', romaji: 'okireru' },
      { kanji: '起きえる', romaji: 'okieru' },
      { kanji: '起きらせる', romaji: 'okiraseru' },
    ],
    passive: [
      { kanji: '起きれる', romaji: 'okireru' },
      { kanji: '起きされる', romaji: 'okisareru' },
      { kanji: '起きわす', romaji: 'okiewasu' },
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
    potential: [
      { kanji: '寝れる', romaji: 'nereru' },
      { kanji: '寝える', romaji: 'neeru' },
      { kanji: '寝らせる', romaji: 'neraseru' },
    ],
    passive: [
      { kanji: '寝れる', romaji: 'nereru' },
      { kanji: '寝される', romaji: 'nesareru' },
      { kanji: '寝わす', romaji: 'newasu' },
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
    potential: [
      { kanji: '教えれる', romaji: 'oshiereru' },
      { kanji: '教えるれる', romaji: 'oshierureru' },
      { kanji: '教えらせる', romaji: 'oshieraseru' },
    ],
    passive: [
      { kanji: '教えれる', romaji: 'oshiereru' },
      { kanji: '教えされる', romaji: 'oshiesareru' },
      { kanji: '教えわす', romaji: 'oshiewasu' },
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
    potential: [
      { kanji: 'される', romaji: 'sareru' },
      { kanji: 'すられる', romaji: 'surareru' },
      { kanji: 'すれる', romaji: 'sureru' },
    ],
    passive: [
      { kanji: 'できる', romaji: 'dekiru' },
      { kanji: 'しられる', romaji: 'shirareru' },
      { kanji: 'すられる', romaji: 'surareru' },
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
    potential: [
      { kanji: 'きられる', romaji: 'kirareru' },
      { kanji: 'くられる', romaji: 'kurareru' },
      { kanji: 'これる', romaji: 'koreru' },
    ],
    passive: [
      { kanji: 'きられる', romaji: 'kirareru' },
      { kanji: 'くられる', romaji: 'kurareru' },
      { kanji: 'こさせる', romaji: 'kosaseru' },
    ],
  },
  'v-shiraberu': {
    te: [
      { kanji: '調べって', romaji: 'shirabette' },
      { kanji: '調べんで', romaji: 'shirabende' },
      { kanji: '調べいて', romaji: 'shirabeite' },
    ],
    ta: [
      { kanji: '調べった', romaji: 'shirabetta' },
      { kanji: '調べんだ', romaji: 'shirabenda' },
      { kanji: '調べいた', romaji: 'shirabeita' },
    ],
    nai: [
      { kanji: '調べらない', romaji: 'shiraberanai' },
      { kanji: '調べるない', romaji: 'shiraberunai' },
      { kanji: '調べりない', romaji: 'shiraberinai' },
    ],
    masu: [
      { kanji: '調べるます', romaji: 'shiraberumasu' },
      { kanji: '調べります', romaji: 'shiraberimasu' },
      { kanji: '調べらます', romaji: 'shiraberamasu' },
    ],
    potential: [
      { kanji: '調べれる', romaji: 'shirabereru' },
      { kanji: '調べえる', romaji: 'shirabeeru' },
      { kanji: '調べさせる', romaji: 'shirabesaseru' },
    ],
    passive: [
      { kanji: '調べれる', romaji: 'shirabereru' },
      { kanji: '調べされる', romaji: 'shirabesareru' },
      { kanji: '調べせられる', romaji: 'shirabeserareru' },
    ],
  },
  'v-todokeru': {
    te: [
      { kanji: '届けって', romaji: 'todokette' },
      { kanji: '届けんで', romaji: 'todokende' },
      { kanji: '届けいて', romaji: 'todokeite' },
    ],
    ta: [
      { kanji: '届けった', romaji: 'todoketta' },
      { kanji: '届けんだ', romaji: 'todokenda' },
      { kanji: '届けいた', romaji: 'todokeita' },
    ],
    nai: [
      { kanji: '届けらない', romaji: 'todokeranai' },
      { kanji: '届けるない', romaji: 'todokerunai' },
      { kanji: '届けりない', romaji: 'todokerinai' },
    ],
    masu: [
      { kanji: '届けるます', romaji: 'todokerumasu' },
      { kanji: '届けります', romaji: 'todokerimasu' },
      { kanji: '届けらます', romaji: 'todokeramasu' },
    ],
    potential: [
      { kanji: '届けれる', romaji: 'todokereru' },
      { kanji: '届けえる', romaji: 'todokeeru' },
      { kanji: '届けさせる', romaji: 'todokesaseru' },
    ],
    passive: [
      { kanji: '届けれる', romaji: 'todokereru' },
      { kanji: '届けされる', romaji: 'todokesareru' },
      { kanji: '届けせられる', romaji: 'todokeserareru' },
    ],
  },
  'v-akirameru': {
    te: [
      { kanji: '諦めって', romaji: 'akiramette' },
      { kanji: '諦めで', romaji: 'akiramende' },
      { kanji: '諦めいて', romaji: 'akirameite' },
    ],
    ta: [
      { kanji: '諦めった', romaji: 'akirametta' },
      { kanji: '諦めんだ', romaji: 'akiramenda' },
      { kanji: '諦めいた', romaji: 'akirameita' },
    ],
    nai: [
      { kanji: '諦めらない', romaji: 'akirameranai' },
      { kanji: '諦めるない', romaji: 'akiramerunai' },
      { kanji: '諦めりない', romaji: 'akiramerinai' },
    ],
    masu: [
      { kanji: '諦めるます', romaji: 'akiramerumasu' },
      { kanji: '諦めります', romaji: 'akiramerimasu' },
      { kanji: '諦めらます', romaji: 'akirameramasu' },
    ],
    potential: [
      { kanji: '諦めれる', romaji: 'akiramereru' },
      { kanji: '諦めえる', romaji: 'akirameeru' },
      { kanji: '諦めさせる', romaji: 'akiramesaseru' },
    ],
    passive: [
      { kanji: '諦めれる', romaji: 'akiramereru' },
      { kanji: '諦めされる', romaji: 'akiramesareru' },
      { kanji: '諦めせられる', romaji: 'akirameserareru' },
    ],
  },
  'v-tsuzukeru': {
    te: [
      { kanji: '続けって', romaji: 'tsuzukette' },
      { kanji: '続けんで', romaji: 'tsuzukende' },
      { kanji: '続けいて', romaji: 'tsuzukeite' },
    ],
    ta: [
      { kanji: '続けった', romaji: 'tsuzuketta' },
      { kanji: '続けんだ', romaji: 'tsuzukenda' },
      { kanji: '続けいた', romaji: 'tsuzukeita' },
    ],
    nai: [
      { kanji: '続けらない', romaji: 'tsuzukeranai' },
      { kanji: '続けるない', romaji: 'tsuzukerunai' },
      { kanji: '続けりない', romaji: 'tsuzukerinai' },
    ],
    masu: [
      { kanji: '続けるます', romaji: 'tsuzukerumasu' },
      { kanji: '続けります', romaji: 'tsuzukerimasu' },
      { kanji: '続けらます', romaji: 'tsuzukeramasu' },
    ],
    potential: [
      { kanji: '続けれる', romaji: 'tsuzukereru' },
      { kanji: '続けえる', romaji: 'tsuzukeeru' },
      { kanji: '続けさせる', romaji: 'tsuzukesaseru' },
    ],
    passive: [
      { kanji: '続けれる', romaji: 'tsuzukereru' },
      { kanji: '続けされる', romaji: 'tsuzukesareru' },
      { kanji: '続けせられる', romaji: 'tsuzukeserareru' },
    ],
  },
  'v-atsumeru': {
    te: [
      { kanji: '集めって', romaji: 'atsumette' },
      { kanji: '集めで', romaji: 'atsumende' },
      { kanji: '集めいて', romaji: 'atsumeite' },
    ],
    ta: [
      { kanji: '集めった', romaji: 'atsumetta' },
      { kanji: '集めんだ', romaji: 'atsumenda' },
      { kanji: '集めいた', romaji: 'atsumeita' },
    ],
    nai: [
      { kanji: '集めらない', romaji: 'atsumeranai' },
      { kanji: '集めるない', romaji: 'atsumerunai' },
      { kanji: '集めりない', romaji: 'atsumerinai' },
    ],
    masu: [
      { kanji: '集めるます', romaji: 'atsumerumasu' },
      { kanji: '集めります', romaji: 'atsumerimasu' },
      { kanji: '集めらます', romaji: 'atsumeramasu' },
    ],
    potential: [
      { kanji: '集めれる', romaji: 'atsumereru' },
      { kanji: '集めえる', romaji: 'atsumeeru' },
      { kanji: '集めさせる', romaji: 'atsumesaseru' },
    ],
    passive: [
      { kanji: '集めれる', romaji: 'atsumereru' },
      { kanji: '集めされる', romaji: 'atsumesareru' },
      { kanji: '集めせられる', romaji: 'atsumeserareru' },
    ],
  },
  'v-torikaeru': {
    te: [
      { kanji: '取り替て', romaji: 'torikaete' },
      { kanji: '取り替りて', romaji: 'torikaerite' },
      { kanji: '取り替んで', romaji: 'torikaende' },
    ],
    ta: [
      { kanji: '取り替た', romaji: 'torikaeta' },
      { kanji: '取り替りた', romaji: 'torikaerita' },
      { kanji: '取り替んだ', romaji: 'torikaenda' },
    ],
    nai: [
      { kanji: '取り替らない', romaji: 'torikaeranai' },
      { kanji: '取り替るない', romaji: 'torikaerunai' },
      { kanji: '取り替ない', romaji: 'torikaenai' },
    ],
    masu: [
      { kanji: '取り替るます', romaji: 'torikaerumasu' },
      { kanji: '取り替ります', romaji: 'torikaerimasu' },
      { kanji: '取り替らます', romaji: 'torikaeramasu' },
    ],
    potential: [
      { kanji: '取り替れる', romaji: 'torikaereru' },
      { kanji: '取り替える', romaji: 'torikaeeru' },
      { kanji: '取り替えさせる', romaji: 'torikaesaseru' },
    ],
    passive: [
      { kanji: '取り替れる', romaji: 'torikaereru' },
      { kanji: '取り替される', romaji: 'torikaesareru' },
      { kanji: '取り替せられる', romaji: 'torikaeserareru' },
    ],
  },
  'v-tsutaeru': {
    te: [
      { kanji: '伝えって', romaji: 'tsutaette' },
      { kanji: '伝えんで', romaji: 'tsutaende' },
      { kanji: '伝えいて', romaji: 'tsutaeite' },
    ],
    ta: [
      { kanji: '伝えった', romaji: 'tsutaetta' },
      { kanji: '伝えんだ', romaji: 'tsutaenda' },
      { kanji: '伝えいた', romaji: 'tsutaeita' },
    ],
    nai: [
      { kanji: '伝えらない', romaji: 'tsutaeranai' },
      { kanji: '伝えるない', romaji: 'tsutaerunai' },
      { kanji: '伝えりない', romaji: 'tsutaerinai' },
    ],
    masu: [
      { kanji: '伝えるます', romaji: 'tsutaerumasu' },
      { kanji: '伝えります', romaji: 'tsutaerimasu' },
      { kanji: '伝えらます', romaji: 'tsutaeramasu' },
    ],
    potential: [
      { kanji: '伝えれる', romaji: 'tsutaereru' },
      { kanji: '伝ええる', romaji: 'tsutaeeru' },
      { kanji: '伝えさせる', romaji: 'tsutaesaseru' },
    ],
    passive: [
      { kanji: '伝えれる', romaji: 'tsutaereru' },
      { kanji: '伝えされる', romaji: 'tsutaesareru' },
      { kanji: '伝えせられる', romaji: 'tsutaeserareru' },
    ],
  },
  'v-kimeru': {
    te: [
      { kanji: '決めって', romaji: 'kimette' },
      { kanji: '決めんで', romaji: 'kimende' },
      { kanji: '決めいて', romaji: 'kimeite' },
    ],
    ta: [
      { kanji: '決めった', romaji: 'kimetta' },
      { kanji: '決めんだ', romaji: 'kimenda' },
      { kanji: '決めいた', romaji: 'kimeita' },
    ],
    nai: [
      { kanji: '決めらない', romaji: 'kimeranai' },
      { kanji: '決めるない', romaji: 'kimerunai' },
      { kanji: '決めりない', romaji: 'kimerinai' },
    ],
    masu: [
      { kanji: '決めるます', romaji: 'kimerumasu' },
      { kanji: '決めります', romaji: 'kimerimasu' },
      { kanji: '決めらます', romaji: 'kimeramasu' },
    ],
    potential: [
      { kanji: '決めれる', romaji: 'kimereru' },
      { kanji: '決めえる', romaji: 'kimeeru' },
      { kanji: '決めさせる', romaji: 'kimesaseru' },
    ],
    passive: [
      { kanji: '決めれる', romaji: 'kimereru' },
      { kanji: '決めされる', romaji: 'kimesareru' },
      { kanji: '決めせられる', romaji: 'kimeserareru' },
    ],
  },
  'v-kangaeru': {
    te: [
      { kanji: '考えって', romaji: 'kangaette' },
      { kanji: '考えんで', romaji: 'kangaende' },
      { kanji: '考えいて', romaji: 'kangaeite' },
    ],
    ta: [
      { kanji: '考えった', romaji: 'kangaetta' },
      { kanji: '考えんだ', romaji: 'kangaenda' },
      { kanji: '考えいた', romaji: 'kangaeita' },
    ],
    nai: [
      { kanji: '考えらない', romaji: 'kangaeranai' },
      { kanji: '考えるない', romaji: 'kangaerunai' },
      { kanji: '考えりない', romaji: 'kangaerinai' },
    ],
    masu: [
      { kanji: '考えるます', romaji: 'kangaerumasu' },
      { kanji: '考えります', romaji: 'kangaerimasu' },
      { kanji: '考えらます', romaji: 'kangaeramasu' },
    ],
    potential: [
      { kanji: '考えれる', romaji: 'kangaereru' },
      { kanji: '考ええる', romaji: 'kangaeeru' },
      { kanji: '考えさせる', romaji: 'kangaesaseru' },
    ],
    passive: [
      { kanji: '考えれる', romaji: 'kangaereru' },
      { kanji: '考えされる', romaji: 'kangaesareru' },
      { kanji: '考えせられる', romaji: 'kangaeserareru' },
    ],
  },
  'v-kanjiru': {
    te: [
      { kanji: '感じって', romaji: 'kanjitte' },
      { kanji: '感じんで', romaji: 'kanjinde' },
      { kanji: '感じいて', romaji: 'kanjiite' },
    ],
    ta: [
      { kanji: '感じった', romaji: 'kanjitta' },
      { kanji: '感じんだ', romaji: 'kanjinda' },
      { kanji: '感じいた', romaji: 'kanjiita' },
    ],
    nai: [
      { kanji: '感じらない', romaji: 'kanjiranai' },
      { kanji: '感じるない', romaji: 'kanjirunai' },
      { kanji: '感じりない', romaji: 'kanjirinai' },
    ],
    masu: [
      { kanji: '感じるます', romaji: 'kanjirumasu' },
      { kanji: '感じります', romaji: 'kanjirimasu' },
      { kanji: '感じらます', romaji: 'kanjiramasu' },
    ],
    potential: [
      { kanji: '感じれる', romaji: 'kanjireru' },
      { kanji: '感じえる', romaji: 'kanjieru' },
      { kanji: '感じさせる', romaji: 'kanjisaseru' },
    ],
    passive: [
      { kanji: '感じれる', romaji: 'kanjireru' },
      { kanji: '感じされる', romaji: 'kanjisareru' },
      { kanji: '感じせられる', romaji: 'kanjiserareru' },
    ],
  },
  'v-mitsukeru': {
    te: [
      { kanji: '見つけって', romaji: 'mitsukette' },
      { kanji: '見つけんで', romaji: 'mitsukende' },
      { kanji: '見つけいて', romaji: 'mitsukeite' },
    ],
    ta: [
      { kanji: '見つけった', romaji: 'mitsuketta' },
      { kanji: '見つけんだ', romaji: 'mitsukenda' },
      { kanji: '見つけいた', romaji: 'mitsukeita' },
    ],
    nai: [
      { kanji: '見つけらない', romaji: 'mitsukeranai' },
      { kanji: '見つけるない', romaji: 'mitsukerunai' },
      { kanji: '見つけりない', romaji: 'mitsukerinai' },
    ],
    masu: [
      { kanji: '見つけるます', romaji: 'mitsukerumasu' },
      { kanji: '見つけります', romaji: 'mitsukerimasu' },
      { kanji: '見つけらます', romaji: 'mitsukeramasu' },
    ],
    potential: [
      { kanji: '見つけれる', romaji: 'mitsukereru' },
      { kanji: '見つけえる', romaji: 'mitsukeeru' },
      { kanji: '見つけさせる', romaji: 'mitsukesaseru' },
    ],
    passive: [
      { kanji: '見つけれる', romaji: 'mitsukereru' },
      { kanji: '見つけされる', romaji: 'mitsukesareru' },
      { kanji: '見つけせられる', romaji: 'mitsukeserareru' },
    ],
  },
  'v-tsukau': {
    te: [
      { kanji: '使いで', romaji: 'tsukaide' },
      { kanji: '使いて', romaji: 'tsukaite' },
      { kanji: '使いいて', romaji: 'tsukaiite' },
    ],
    ta: [
      { kanji: '使いだ', romaji: 'tsukaida' },
      { kanji: '使いた', romaji: 'tsukaita' },
      { kanji: '使んだ', romaji: 'tsukanda' },
    ],
    nai: [
      { kanji: '使いない', romaji: 'tsukainai' },
      { kanji: '使うない', romaji: 'tsukaunai' },
      { kanji: '使あない', romaji: 'tsukaanai' },
    ],
    masu: [
      { kanji: '使うます', romaji: 'tsukaumasu' },
      { kanji: '使わます', romaji: 'tsukawamasu' },
      { kanji: '使えます', romaji: 'tsukaemasu' },
    ],
    potential: [
      { kanji: '使われる', romaji: 'tsukawareru' },
      { kanji: '使えられる', romaji: 'tsukaerareru' },
      { kanji: '使られる', romaji: 'tsukaurareru' },
    ],
    passive: [
      { kanji: '使あれる', romaji: 'tsukaareru' },
      { kanji: '使える', romaji: 'tsukaeru' },
      { kanji: '使わせる', romaji: 'tsukawaseru' },
    ],
  },
  'v-tetsudau': {
    te: [
      { kanji: '手伝いで', romaji: 'tetsudaide' },
      { kanji: '手伝いて', romaji: 'tetsudaite' },
      { kanji: '手伝いいて', romaji: 'tetsudaiite' },
    ],
    ta: [
      { kanji: '手伝いだ', romaji: 'tetsudaida' },
      { kanji: '手伝いた', romaji: 'tetsudaita' },
      { kanji: '手伝んだ', romaji: 'tetsudanda' },
    ],
    nai: [
      { kanji: '手伝いない', romaji: 'tetsudainai' },
      { kanji: '手伝うない', romaji: 'tetsudaunai' },
      { kanji: '手伝あない', romaji: 'tetsudaanai' },
    ],
    masu: [
      { kanji: '手伝うます', romaji: 'tetsudaumasu' },
      { kanji: '手伝わます', romaji: 'tetsudawamasu' },
      { kanji: '手伝えます', romaji: 'tetsudaemasu' },
    ],
    potential: [
      { kanji: '手伝われる', romaji: 'tetsudawareru' },
      { kanji: '手伝えられる', romaji: 'tetsudaerareru' },
      { kanji: '手伝られる', romaji: 'tetsudaurareru' },
    ],
    passive: [
      { kanji: '手伝あれる', romaji: 'tetsudaareru' },
      { kanji: '手伝える', romaji: 'tetsudaeru' },
      { kanji: '手伝わせる', romaji: 'tetsudawaseru' },
    ],
  },
  'v-ugoku': {
    te: [
      { kanji: '動って', romaji: 'ugotte' },
      { kanji: '動きて', romaji: 'ugokite' },
      { kanji: '動いで', romaji: 'ugoide' },
    ],
    ta: [
      { kanji: '動った', romaji: 'ugotta' },
      { kanji: '動きた', romaji: 'ugokita' },
      { kanji: '動いだ', romaji: 'ugoida' },
    ],
    nai: [
      { kanji: '動きない', romaji: 'ugokinai' },
      { kanji: '動くない', romaji: 'ugokunai' },
      { kanji: '動けない', romaji: 'ugokenai' },
    ],
    masu: [
      { kanji: '動くます', romaji: 'ugokumasu' },
      { kanji: '動かます', romaji: 'ugokamasu' },
      { kanji: '動けます', romaji: 'ugokemasu' },
    ],
    potential: [
      { kanji: '動かれる', romaji: 'ugokareru' },
      { kanji: '動けられる', romaji: 'ugokerareru' },
      { kanji: '動くられる', romaji: 'ugokurareru' },
    ],
    passive: [
      { kanji: '動ける', romaji: 'ugokeru' },
      { kanji: '動かせる', romaji: 'ugokaseru' },
      { kanji: '動いてれる', romaji: 'ugoitereru' },
    ],
  },
  'v-odoroku': {
    te: [
      { kanji: '驚って', romaji: 'odorotte' },
      { kanji: '驚きて', romaji: 'odorokite' },
      { kanji: '驚いで', romaji: 'odoroide' },
    ],
    ta: [
      { kanji: '驚った', romaji: 'odorotta' },
      { kanji: '驚きた', romaji: 'odorokita' },
      { kanji: '驚いだ', romaji: 'odoroida' },
    ],
    nai: [
      { kanji: '驚きない', romaji: 'odorokinai' },
      { kanji: '驚くない', romaji: 'odorokunai' },
      { kanji: '驚けない', romaji: 'odorokenai' },
    ],
    masu: [
      { kanji: '驚くます', romaji: 'odorokumasu' },
      { kanji: '驚かます', romaji: 'odorokamasu' },
      { kanji: '驚けます', romaji: 'odorokemasu' },
    ],
    potential: [
      { kanji: '驚かれる', romaji: 'odorokareru' },
      { kanji: '驚けられる', romaji: 'odorokerareru' },
      { kanji: '驚くられる', romaji: 'odorokurareru' },
    ],
    passive: [
      { kanji: '驚ける', romaji: 'odorokeru' },
      { kanji: '驚かせる', romaji: 'odorokaseru' },
      { kanji: '驚いてれる', romaji: 'odoroitereru' },
    ],
  },
  'v-omoidasu': {
    te: [
      { kanji: '思い出って', romaji: 'omoidatte' },
      { kanji: '思いだいて', romaji: 'omoidaite' },
      { kanji: '思い出んで', romaji: 'omoidande' },
    ],
    ta: [
      { kanji: '思い出った', romaji: 'omoidatta' },
      { kanji: '思いだいた', romaji: 'omoidaita' },
      { kanji: '思い出んだ', romaji: 'omoidanda' },
    ],
    nai: [
      { kanji: '思い出しない', romaji: 'omoidashinai' },
      { kanji: '思い出すない', romaji: 'omoidasunai' },
      { kanji: '思い出せない', romaji: 'omoidasenai' },
    ],
    masu: [
      { kanji: '思い出すます', romaji: 'omoidasumasu' },
      { kanji: '思い出さます', romaji: 'omoidasamasu' },
      { kanji: '思い出せます', romaji: 'omoidasemasu' },
    ],
    potential: [
      { kanji: '思い出される', romaji: 'omoidasareru' },
      { kanji: '思い出せられる', romaji: 'omoidaserareru' },
      { kanji: '思い出しられる', romaji: 'omoidashirareru' },
    ],
    passive: [
      { kanji: '思い出せる', romaji: 'omoidaseru' },
      { kanji: '思い出させる', romaji: 'omoidasaseru' },
      { kanji: '思い出している', romaji: 'omoidashiteiru' },
    ],
  },
  'v-kaesu': {
    te: [
      { kanji: '返って', romaji: 'kaette' },
      { kanji: '返いて', romaji: 'kaeite' },
      { kanji: '返んで', romaji: 'kaende' },
    ],
    ta: [
      { kanji: '返った', romaji: 'kaetta' },
      { kanji: '返いた', romaji: 'kaeita' },
      { kanji: '返んだ', romaji: 'kaenda' },
    ],
    nai: [
      { kanji: '返しない', romaji: 'kaeshinai' },
      { kanji: '返すない', romaji: 'kaesunai' },
      { kanji: '返せない', romaji: 'kaesenai' },
    ],
    masu: [
      { kanji: '返すます', romaji: 'kaesumasu' },
      { kanji: '返さます', romaji: 'kaesamasu' },
      { kanji: '返せます', romaji: 'kaesemasu' },
    ],
    potential: [
      { kanji: '返される', romaji: 'kaesareru' },
      { kanji: '返せられる', romaji: 'kaeserareru' },
      { kanji: '返しられる', romaji: 'kaeshirareru' },
    ],
    passive: [
      { kanji: '返せる', romaji: 'kaeseru' },
      { kanji: '返させる', romaji: 'kaesaseru' },
      { kanji: '返している', romaji: 'kaeshiteiru' },
    ],
  },
  'v-erabu': {
    te: [
      { kanji: '選って', romaji: 'eratte' },
      { kanji: '選いて', romaji: 'eraite' },
      { kanji: '選びて', romaji: 'erabite' },
    ],
    ta: [
      { kanji: '選った', romaji: 'eratta' },
      { kanji: '選いた', romaji: 'eraita' },
      { kanji: '選びた', romaji: 'erabita' },
    ],
    nai: [
      { kanji: '選びない', romaji: 'erabinai' },
      { kanji: '選ぶない', romaji: 'erabunai' },
      { kanji: '選べない', romaji: 'erabenai' },
    ],
    masu: [
      { kanji: '選ぶます', romaji: 'erabumasu' },
      { kanji: '選ばます', romaji: 'erabamasu' },
      { kanji: '選べます', romaji: 'erabemasu' },
    ],
    potential: [
      { kanji: '選ばれる', romaji: 'erabareru' },
      { kanji: '選べられる', romaji: 'eraberareru' },
      { kanji: '選びられる', romaji: 'erabirareru' },
    ],
    passive: [
      { kanji: '選べる', romaji: 'eraberu' },
      { kanji: '選ばせる', romaji: 'erabaseru' },
      { kanji: '選んでれる', romaji: 'erandereru' },
    ],
  },
  'v-tanomu': {
    te: [
      { kanji: '頼って', romaji: 'tanotte' },
      { kanji: '頼いて', romaji: 'tanoite' },
      { kanji: '頼みて', romaji: 'tanomite' },
    ],
    ta: [
      { kanji: '頼った', romaji: 'tanotta' },
      { kanji: '頼いた', romaji: 'tanoita' },
      { kanji: '頼みた', romaji: 'tanomita' },
    ],
    nai: [
      { kanji: '頼みない', romaji: 'tanominai' },
      { kanji: '頼むない', romaji: 'tanomunai' },
      { kanji: '頼めない', romaji: 'tanomenai' },
    ],
    masu: [
      { kanji: '頼むます', romaji: 'tanomumasu' },
      { kanji: '頼まます', romaji: 'tanomamasu' },
      { kanji: '頼めます', romaji: 'tanomemasu' },
    ],
    potential: [
      { kanji: '頼まれる', romaji: 'tanomareru' },
      { kanji: '頼められる', romaji: 'tanomerareru' },
      { kanji: '頼みられる', romaji: 'tanomirareru' },
    ],
    passive: [
      { kanji: '頼める', romaji: 'tanomeru' },
      { kanji: '頼ませる', romaji: 'tanomaseru' },
      { kanji: '頼んでれる', romaji: 'tanondereru' },
    ],
  },
  'v-okuru': {
    te: [
      { kanji: '送いて', romaji: 'okuite' },
      { kanji: '送りて', romaji: 'okurite' },
      { kanji: '送んで', romaji: 'okunde' },
    ],
    ta: [
      { kanji: '送いた', romaji: 'okuita' },
      { kanji: '送りた', romaji: 'okurita' },
      { kanji: '送んだ', romaji: 'okunda' },
    ],
    nai: [
      { kanji: '送ない', romaji: 'okunai' },
      { kanji: '送りない', romaji: 'okurinai' },
      { kanji: '送れない', romaji: 'okurenai' },
    ],
    masu: [
      { kanji: '送るます', romaji: 'okurumasu' },
      { kanji: '送ます', romaji: 'okumasu' },
      { kanji: '送れます', romaji: 'okuremasu' },
    ],
    potential: [
      { kanji: '送られる', romaji: 'okurareru' },
      { kanji: '送れられる', romaji: 'okurerareru' },
      { kanji: '送りられる', romaji: 'okurirareru' },
    ],
    passive: [
      { kanji: '送れる', romaji: 'okureru' },
      { kanji: '送らせる', romaji: 'okuraseru' },
      { kanji: '送ってれる', romaji: 'okuttereru' },
    ],
  },
  'v-noru': {
    te: [
      { kanji: '乗いて', romaji: 'noite' },
      { kanji: '乗りて', romaji: 'norite' },
      { kanji: '乗んで', romaji: 'nonde' },
    ],
    ta: [
      { kanji: '乗いた', romaji: 'noita' },
      { kanji: '乗りた', romaji: 'norita' },
      { kanji: '乗んだ', romaji: 'nonda' },
    ],
    nai: [
      { kanji: '乗ない', romaji: 'nonai' },
      { kanji: '乗りない', romaji: 'norinai' },
      { kanji: '乗れない', romaji: 'norenai' },
    ],
    masu: [
      { kanji: '乗るます', romaji: 'norumasu' },
      { kanji: '乗ます', romaji: 'nomasu' },
      { kanji: '乗れます', romaji: 'noremasu' },
    ],
    potential: [
      { kanji: '乗られる', romaji: 'norareru' },
      { kanji: '乗れられる', romaji: 'norerareru' },
      { kanji: '乗りられる', romaji: 'norirareru' },
    ],
    passive: [
      { kanji: '乗れる', romaji: 'noreru' },
      { kanji: '乗らせる', romaji: 'noraseru' },
      { kanji: '乗ってれる', romaji: 'nottereru' },
    ],
  },
  'v-tsukuru': {
    te: [
      { kanji: '作いて', romaji: 'tsukuite' },
      { kanji: '作りて', romaji: 'tsukurite' },
      { kanji: '作んで', romaji: 'tsukunde' },
    ],
    ta: [
      { kanji: '作いた', romaji: 'tsukuita' },
      { kanji: '作りた', romaji: 'tsukurita' },
      { kanji: '作んだ', romaji: 'tsukunda' },
    ],
    nai: [
      { kanji: '作ない', romaji: 'tsukunai' },
      { kanji: '作りない', romaji: 'tsukurinai' },
      { kanji: '作れない', romaji: 'tsukurenai' },
    ],
    masu: [
      { kanji: '作るます', romaji: 'tsukurumasu' },
      { kanji: '作ます', romaji: 'tsukumasu' },
      { kanji: '作れます', romaji: 'tsukuremasu' },
    ],
    potential: [
      { kanji: '作られる', romaji: 'tsukurareru' },
      { kanji: '作れられる', romaji: 'tsukurerareru' },
      { kanji: '作りられる', romaji: 'tsukurirareru' },
    ],
    passive: [
      { kanji: '作れる', romaji: 'tsukureru' },
      { kanji: '作らせる', romaji: 'tsukuraseru' },
      { kanji: '作ってれる', romaji: 'tsukuttereru' },
    ],
  },
};
;

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

  // Fallback cerdas berbasis stem kata kerja asli (bebas placeholder mentah / tilde)
  const targetVerb = VERBS_DATA.find(v => v.id === verbId);
  if (targetVerb) {
    const stemKanji = targetVerb.kanji.slice(0, -1);
    const stemRomaji = targetVerb.romaji.slice(0, -2);
    switch (form) {
      case 'te':
        return [
          { kanji: stemKanji + 'って', romaji: stemRomaji + 'tte' },
          { kanji: stemKanji + 'んで', romaji: stemRomaji + 'nde' },
          { kanji: stemKanji + 'いて', romaji: stemRomaji + 'ite' },
        ];
      case 'ta':
        return [
          { kanji: stemKanji + 'った', romaji: stemRomaji + 'tta' },
          { kanji: stemKanji + 'んだ', romaji: stemRomaji + 'nda' },
          { kanji: stemKanji + 'いた', romaji: stemRomaji + 'ita' },
        ];
      case 'nai':
        return [
          { kanji: stemKanji + 'らない', romaji: stemRomaji + 'ranai' },
          { kanji: stemKanji + 'かない', romaji: stemRomaji + 'kanai' },
          { kanji: stemKanji + 'まない', romaji: stemRomaji + 'manai' },
        ];
      case 'masu':
        return [
          { kanji: stemKanji + 'ります', romaji: stemRomaji + 'rimasu' },
          { kanji: stemKanji + 'きます', romaji: stemRomaji + 'kimasu' },
          { kanji: stemKanji + 'みます', romaji: stemRomaji + 'mimasu' },
        ];
      case 'potential':
        return [
          { kanji: stemKanji + 'れる', romaji: stemRomaji + 'reru' },
          { kanji: stemKanji + 'られる', romaji: stemRomaji + 'rareru' },
          { kanji: stemKanji + 'える', romaji: stemRomaji + 'eru' },
        ];
      case 'passive':
        return [
          { kanji: stemKanji + 'られる', romaji: stemRomaji + 'rareru' },
          { kanji: stemKanji + 'れる', romaji: stemRomaji + 'reru' },
          { kanji: stemKanji + 'される', romaji: stemRomaji + 'sareru' },
        ];
    }
  }

  // Fallback absolut darurat (tanpa karakter ~)
  switch (form) {
    case 'te':
      return [
        { kanji: 'って', romaji: 'tte' },
        { kanji: 'んで', romaji: 'nde' },
        { kanji: 'いて', romaji: 'ite' },
      ];
    case 'ta':
      return [
        { kanji: 'った', romaji: 'tta' },
        { kanji: 'んだ', romaji: 'nda' },
        { kanji: 'いた', romaji: 'ita' },
      ];
    case 'nai':
      return [
        { kanji: 'かない', romaji: 'kanai' },
        { kanji: 'まない', romaji: 'manai' },
        { kanji: 'らない', romaji: 'ranai' },
      ];
    case 'masu':
      return [
        { kanji: 'きます', romaji: 'kimasu' },
        { kanji: 'みます', romaji: 'mimasu' },
        { kanji: 'ります', romaji: 'rimasu' },
      ];
    case 'potential':
      return [
        { kanji: 'られる', romaji: 'rareru' },
        { kanji: 'れる', romaji: 'reru' },
        { kanji: 'える', romaji: 'eru' },
      ];
    case 'passive':
      return [
        { kanji: 'れる', romaji: 'reru' },
        { kanji: 'られる', romaji: 'rareru' },
        { kanji: 'される', romaji: 'sareru' },
      ];
  }
}

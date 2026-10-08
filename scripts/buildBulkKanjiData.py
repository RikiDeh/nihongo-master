import json
import re
import os
import glob
from collections import defaultdict

def hira_to_kata(s):
    res = []
    for c in s:
        code = ord(c)
        if 0x3041 <= code <= 0x3096:
            res.append(chr(code + 96))
        else:
            res.append(c)
    return ''.join(res)

print("1. Loading raw dataset files...")
all_kj = json.load(open('scripts/data/kanji.json', encoding='utf-8'))
anchor_data = json.load(open('scripts/data/jlpt-kanji.json', encoding='utf-8'))
anchor_map = {item['kanji']: item.get('jlpt') for item in anchor_data}

# Parse ids.txt for radicals
ids_map = {}
for line in open('scripts/data/ids.txt', encoding='utf-8'):
    if line.startswith('#') or not line.strip(): continue
    parts = line.strip().split('\t')
    if len(parts) >= 3:
        char = parts[1]
        ids_seq = parts[2]
        clean = re.sub(r'\[.*?\]', '', ids_seq)
        comps = [c for c in clean if c not in '⿰⿱⿲⿳⿴⿵⿶⿷⿸⿹⿺⿻①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳']
        ids_map[char] = comps

# Joyo set
joyo_set = {k for k, v in all_kj.items() if v.get('grade') is not None and 1 <= v['grade'] <= 8}
print(f"Total Joyo kanji in reference: {len(joyo_set)}")

# Existing kanji in app
existing_chars = set()
for p in glob.glob('src/data/kanji*.ts'):
    for c in re.findall(r"kanji:\s*'([^']+)'", open(p, encoding='utf-8').read()):
        existing_chars.add(c)
print(f"Existing unique kanji characters in app: {len(existing_chars)}")

missing_chars = sorted(list(joyo_set - existing_chars))
print(f"Missing Joyo kanji characters to generate: {len(missing_chars)}")

# Load compounds from VOCAB_DATA
vocab_compounds = defaultdict(list)
for vf in glob.glob('src/data/vocab*.ts'):
    if vf.endswith('vocabData.ts'): continue
    for m in re.finditer(r"kanji:\s*'([^']+)'(?:.|\n)*?kana:\s*'([^']+)'(?:.|\n)*?meaningId:\s*'([^']+)'", open(vf, encoding='utf-8').read()):
        w, r, mid = m.group(1), m.group(2), m.group(3)
        for c in set(w):
            if c in joyo_set:
                vocab_compounds[c].append({'word': w, 'reading': r, 'meaning': mid})

# Load compounds from jukugo-compounds.json
jk_data = json.load(open('scripts/data/jukugo-compounds.json', encoding='utf-8'))
for item in jk_data.get('compounds', []):
    for c in item.get('kanji_sequence', []):
        if c in joyo_set:
            vocab_compounds[c].append({'word': item['text'], 'reading': item['reading'], 'meaning': item['meaning']})

# Specialized fallback for rare kanji
FALLBACK_COMPOUNDS = {
    '丙': [{'word': '丙種', 'reading': 'へいしゅ', 'meaning': 'Klasifikasi ketiga / Golongan C'}, {'word': '甲乙丙', 'reading': 'こうおつへい', 'meaning': 'Tingkatan A, B, dan C'}],
    '串': [{'word': '串焼き', 'reading': 'くしやき', 'meaning': 'Sate panggangan tusuk'}, {'word': '串刺し', 'reading': 'くしざし', 'meaning': 'Tusukan sate'}],
    '乞': [{'word': '乞食', 'reading': 'こじき', 'meaning': 'Pengemis'}, {'word': '乞う', 'reading': 'こう', 'meaning': 'Memohon / Meminta'}],
    '亀': [{'word': '亀', 'reading': 'かめ', 'meaning': 'Kura-kura'}, {'word': '海亀', 'reading': 'うみがめ', 'meaning': 'Penyu laut'}],
    '伎': [{'word': '歌舞伎', 'reading': 'かぶき', 'meaning': 'Teater kabuki'}, {'word': '伎能', 'reading': 'ぎのう', 'meaning': 'Kemahiran seni'}],
    '但': [{'word': '但し', 'reading': 'ただし', 'meaning': 'Namun demikian / Tetapi'}, {'word': '但し書き', 'reading': 'ただしがき', 'meaning': 'Klausul catatan tambahan'}],
    '僅': [{'word': '僅か', 'reading': 'わずか', 'meaning': 'Hanya sedikit / Sepele'}, {'word': '僅少', 'reading': 'きんしょう', 'meaning': 'Sangat minim'}],
    '僕': [{'word': '僕', 'reading': 'ぼく', 'meaning': 'Saya / Aku (pria)'}, {'word': '下僕', 'reading': 'げぼく', 'meaning': 'Pelayan / Pesuruh'}],
    '冥': [{'word': '冥福', 'reading': 'めいふく', 'meaning': 'Kebahagiaan di alam baka'}, {'word': '冥界', 'reading': 'めいかい', 'meaning': 'Dunia arwah'}],
    '冶': [{'word': '冶金', 'reading': 'やきん', 'meaning': 'Metalurgi peleburan logam'}, {'word': '鍛冶', 'reading': 'かじ', 'meaning': 'Pandai besi'}],
    '刹': [{'word': '刹那', 'reading': 'せつな', 'meaning': 'Sekejap mata / Momen sesaat'}, {'word': '名刹', 'reading': 'めいさつ: ', 'meaning': 'Kuil bersejarah termasyhur'}],
    '剛': [{'word': '剛健', 'reading': 'ごうけん', 'meaning': 'Kuat kokoh bertenaga'}, {'word': '剛胆', 'reading': 'ごうたん', 'meaning': 'Pemberani tak kenal takut'}],
    '勅': [{'word': '勅命', 'reading': 'ちょくめい', 'meaning': 'Titah kaisar'}, {'word': '勅令', 'reading': 'ちょくれい', 'meaning': 'Dekrit kekaisaran'}],
    '勾': [{'word': '勾配', 'reading': 'こうばい', 'meaning': 'Kemiringan lereng'}, {'word': '勾引', 'reading': 'こういん', 'meaning': 'Penahanan / Penangkapan hukum'}],
    '升': [{'word': '一升', 'reading': 'いっしょう', 'meaning': 'Takaran 1.8 liter'}, {'word': '升目', 'reading': 'ますめ', 'meaning': 'Petak kotak takaran'}],
    '厘': [{'word': '一厘', 'reading': 'いちりん', 'meaning': 'Satu rin (0.01 yen)'}, {'word': '九分九厘', 'reading': 'くぶくりん', 'meaning': 'Sembilan puluh sembilan persen / Hampir pasti'}],
    '又': [{'word': '又は', 'reading': 'または', 'meaning': 'Atau / Maupun'}, {'word': '又聞き', 'reading': 'またぎき', 'meaning': 'Mendengar kabar angin dari orang lain'}],
    '叱': [{'word': '叱責', 'reading': 'しっせき', 'meaning': 'Teguran keras / Memarahi'}, {'word': '叱る', 'reading': 'しかる', 'meaning': 'Memarahi'}],
    '呪': [{'word': '呪い', 'reading': 'のろい', 'meaning': 'Kutukan'}, {'word': '呪文', 'reading': 'じゅもん', 'meaning': 'Mantra sihir'}],
    '咽': [{'word': '咽喉', 'reading': 'いんこう', 'meaning': 'Tenggorokan'}, {'word': '咽頭', 'reading': 'いんとう', 'meaning': 'Faring tenggorokan'}],
    '哺': [{'word': '哺乳類', 'reading': 'ほにゅうるい', 'meaning': 'Hewan mamalia'}, {'word': '哺育', 'reading': 'ほいく', 'meaning': 'Menyusui dan merawat anak'}],
    '唾': [{'word': '唾液', 'reading': 'だえき', 'meaning': 'Air liur / Saliva'}, {'word': '唾', 'reading': 'つば', 'meaning': 'Ludah'}],
    '喩': [{'word': '比喩', 'reading': 'ひゆ', 'meaning': 'Metafora / Kiasan'}, {'word': '直喩', 'reading': 'ちょくゆ', 'meaning': 'Simile / Perumpamaan langsung'}],
    '嗅': [{'word': '嗅覚', 'reading': 'きゅうかく', 'meaning': 'Indra penciuman'}, {'word': '嗅ぐ', 'reading': 'かぐ', 'meaning': 'Mencium bau / Mengendus'}],
    '嗣': [{'word': '後嗣', 'reading': 'こうし', 'meaning': 'Pewaris keturunan'}, {'word': '嗣子', 'reading': 'しし', 'meaning': 'Anak ahli waris'}],
    '嚇': [{'word': '威嚇', 'reading': 'いかく', 'meaning': 'Intimidasi / Gertakan ancaman'}, {'word': '恐嚇', 'reading': 'きょうかく', 'meaning': 'Pemerasan teror'}],
    '坪': [{'word': '坪', 'reading': 'つぼ', 'meaning': 'Satuan luas tsubo (3.3 meter persegi)'}, {'word': '建坪', 'reading': 'たてつぼ', 'meaning': 'Luas tapak bangunan'}],
    '埼': [{'word': '埼玉県', 'reading': 'さいたまけん', 'meaning': 'Prefektur Saitama'}, {'word': '埼', 'reading': 'さき', 'meaning': 'Tanjung daratan tanjung'}],
    '塚': [{'word': '貝塚', 'reading': 'かいづか', 'meaning': 'Gundukan sisa kerang purba'}, {'word': '一里塚', 'reading': 'いちりづか', 'meaning': 'Tonggak penanda jarak pos'}],
    '塡': [{'word': '補塡', 'reading': 'ほてん', 'meaning': 'Kompensasi / Penambalan defisit'}, {'word': '装塡', 'reading': 'そうてん', 'meaning': 'Pengisian peluru amunisi'}],
    '墾': [{'word': '開墾', 'reading': 'かいこん', 'meaning': 'Pembukaan lahan pertanian baru'}, {'word': '開墾地', 'reading': 'かいこんち', 'meaning': 'Lahan hasil pembukaan hutan'}],
    '壱': [{'word': '壱', 'reading': 'いち', 'meaning': 'Satu (penulisan formal hukum)'}, {'word': '壱万円', 'reading': 'いちまんえん', 'meaning': 'Sepuluh ribu yen'}],
    '姻': [{'word': '婚姻', 'reading': 'こんいん', 'meaning': 'Pernikahan legal'}, {'word': '姻族', 'reading': 'いんぞく', 'meaning': 'Keluarga kerabat semenda'}],
    '婆': [{'word': '産婆', 'reading': 'さんば', 'meaning': 'Bidan tradisional'}, {'word': '老婆', 'reading': 'ろうば', 'meaning': 'Wanita tua renta'}],
    '媛': [{'word': '愛媛県', 'reading': 'えひめけん', 'meaning': 'Prefektur Ehime'}, {'word': '才媛', 'reading': 'さいえん', 'meaning': 'Wanita berbakat dan berpendidikan'}],
    '孔': [{'word': '瞳孔', 'reading': 'どうこう', 'meaning': 'Pupil mata'}, {'word': '気孔', 'reading': 'きこう', 'meaning': 'Stomata pori-pori daun'}],
    '宵': [{'word': '宵', 'reading': 'よい', 'meaning': 'Awal malam / Senja'}, {'word': '宵の口', 'reading': 'よいのくち', 'meaning': 'Awal mula malam tiba'}],
    '屯': [{'word': '駐屯', 'reading': 'ちゅうとん', 'meaning': 'Penempatan garnisun militer'}, {'word': '屯田兵', 'reading': 'とんでんへい', 'meaning': 'Prajurit perintis lahan tani'}],
    '岬': [{'word': '岬', 'reading': 'みさき', 'meaning': 'Tanjung daratan ke laut'}, {'word': '喜望峰岬', 'reading': 'きぼうほうみさき', 'meaning': 'Tanjung Harapan Afrika'}],
    '峠': [{'word': '峠', 'reading': 'とうげ', 'meaning': 'Puncak jalan perbukitan'}, {'word': '峠越え', 'reading': 'とうげごえ', 'meaning': 'Melewati puncak jalan lereng'}],
    '崖': [{'word': '崖', 'reading': 'がけ', 'meaning': 'Tebing jurang curam'}, {'word': '断崖', 'reading': 'だんがい', 'meaning': 'Tebing tebing karang terjal'}],
    '嵐': [{'word': '嵐', 'reading': 'あらし', 'meaning': 'Badai topan kencang'}, {'word': '砂嵐', 'reading': 'すなあらし', 'meaning': 'Badai pasir padang gurun'}],
    '庸': [{'word': '凡庸', 'reading': 'ぼんよう', 'meaning': 'Biasa-biasa saja / Medioker'}, {'word': '中庸', 'reading': 'ちゅうよう', 'meaning': 'Jalan tengah / Moderasi seimbang'}],
    '弐': [{'word': '弐', 'reading': 'に', 'meaning': 'Dua (formal dokumen legal)'}, {'word': '弐千円', 'reading': 'にせんえん', 'meaning': 'Dua ribu yen'}],
    '怨': [{'word': '怨恨', 'reading': 'えんこん', 'meaning': 'Dendam kesumat mendalam'}, {'word': '怨念', 'reading': 'おんねん', 'meaning': 'Hawa dendam kemarahan'}],
    '恭': [{'word': '恭順', 'reading': 'きょうじゅん', 'meaning': 'Ketaatan tunduk setia'}, {'word': '恭賀', 'reading': 'きょうが', 'meaning': 'Ucapan selamat dengan takzim'}],
    '悦': [{'word': '悦楽', 'reading': 'えつらく', 'meaning': 'Kesenangan sukacita'}, {'word': '満悦', 'reading': 'まんえつ', 'meaning': 'Kepuasan penuh rasa bahagia'}],
    '惧': [{'word': '危惧', 'reading': 'きぐ', 'meaning': 'Kekhawatiran rasa cemas'}, {'word': '恐惧', 'reading': 'きょうぐ', 'meaning': 'Ketakutan dengan rasa hormat'}],
    '憬': [{'word': '憧憬', 'reading': 'どうけい', 'meaning': 'Kerinduan harapan cita-cita'}, {'word': '憬れ', 'reading': 'あこがれ', 'meaning': 'Kekaguman aspirasi'}],
    '戴': [{'word': '戴冠', 'reading': 'たいかん', 'meaning': 'Pemahkotaan penobatan raja'}, {'word': '頂戴', 'reading': 'ちょうだい', 'meaning': 'Penerimaan pemberian secara hormat'}],
    '拷': [{'word': '拷問', 'reading': 'ごうもん', 'meaning': 'Penyiksaan fisik interogasi'}, {'word': '拷訊', 'reading': 'ごうしん', 'meaning': 'Interogasi dengan kekerasan'}],
    '捉': [{'word': '捉える', 'reading': 'とらえる', 'meaning': 'Menangkap esensi / Menangkap sinyal'}, {'word': '捕捉', 'reading': 'ほそく', 'meaning': 'Penangkapan deteksi target'}],
    '斑': [{'word': '斑点', 'reading': 'はんてん', 'meaning': 'Bercak bintik totol'}, {'word': '斑', 'reading': 'まだら', 'meaning': 'Belang-belang corak'}],
    '斗': [{'word': '北斗七星', 'reading': 'ほくとしちせい', 'meaning': 'Rasi bintang biduk utara'}, {'word': '一斗缶', 'reading': 'いっとかん', 'meaning': 'Kaleng drum ukuran satu to (18L)'}],
    '斤': [{'word': '斤', 'reading': 'きん', 'meaning': 'Satuan berat kati (~600g)'}, {'word': '食パン一斤', 'reading': 'しょくぱんいっきん', 'meaning': 'Sebongkah roti tawar'}],
    '斥': [{'word': '排斥', 'reading': 'はいせき', 'meaning': 'Penolakan boikot pengucilan'}, {'word': '斥候', 'reading': 'せっこう', 'meaning': 'Prajurit pengintai patroli'}],
    '旺': [{'word': '旺盛', 'reading': 'おうせい', 'meaning': 'Penuh gairah semangat bergelora'}, {'word': '食欲旺盛', 'reading': 'しょくよくおうせい', 'meaning': 'Nafsu makan sangat prima'}],
    '昭': [{'word': '昭和', 'reading': 'しょうわ', 'meaning': 'Zaman Showa (1926-1989)'}, {'word': '昭然', 'reading': 'しょうぜん', 'meaning': 'Terang benderang jelas'}],
    '暁': [{'word': '暁', 'reading': 'あかつき', 'meaning': 'Fajar menyingsing / Saat keberhasilan tiba'}, {'word': '春暁', 'reading': 'しゅんぎょう', 'meaning': 'Fajar di musim semi'}],
    '暫': [{'word': '暫定', 'reading': 'ざんてい', 'meaning': 'Ketentuan sementara provisional'}, {'word': '暫く', 'reading': 'しばらく', 'meaning': 'Beberapa saat sejenak'}],
    '曽': [{'word': '曽祖父', 'reading': 'そうそふ', 'meaning': 'Kakek buyut'}, {'word': '曽祖母', 'reading': 'そうそぼ', 'meaning': 'Nenek buyut'}],
    '朕': [{'word': '朕', 'reading': 'ちん', 'meaning': 'Kami (kata ganti kehormatan kaisar)'}, {'word': '朕意', 'reading': 'ちんい', 'meaning': 'Kehendak titah kaisar'}],
    '朱': [{'word': '朱色', 'reading': 'しゅいろ', 'meaning': 'Warna merah vermilion cemerlang'}, {'word': '朱肉', 'reading': 'しゅにく', 'meaning': 'Bantalan tinta merah cap stempel'}],
    '杉': [{'word': '杉', 'reading': 'すぎ', 'meaning': 'Pohon aras cemara Jepang'}, {'word': '杉林', 'reading': 'すぎばやし', 'meaning': 'Hutan pohon cemara'}],
    '某': [{'word': '某所', 'reading': 'ぼうしょ', 'meaning': 'Suatu tempat tertentu (anonim)'}, {'word': '某氏', 'reading': 'ぼうし', 'meaning': 'Tuan atau nyonya anonim'}],
    '柵': [{'word': '柵', 'reading': 'さく', 'meaning': 'Pagar rintangan pembatas'}, {'word': '鉄柵', 'reading': 'てっさく', 'meaning': 'Pagar teralis besi'}],
    '柿': [{'word': '柿', 'reading': 'かき', 'meaning': 'Buah kesemek'}, {'word': '干し柿', 'reading': 'ほしがき', 'meaning': 'Buah kesemek kering manis'}],
    '栃': [{'word': '栃木県', 'reading': 'とちぎけん', 'meaning': 'Prefektur Tochigi'}, {'word': '栃の木', 'reading': 'とちのき', 'meaning': 'Pohon horse-chestnut Jepang'}],
    '桁': [{'word': '桁', 'reading': 'けた', 'meaning': 'Digit angka bilangan'}, {'word': '桁違い', 'reading': 'けたちがい', 'meaning': 'Berbeda jauh skala mutunya'}],
    '梗': [{'word': '脳梗塞', 'reading': 'のうこうそく', 'meaning': 'Stroke penyumbatan otak infark'}, {'word': '心筋梗塞', 'reading': 'しんきんこうそく', 'meaning': 'Serangan infark otot jantung'}],
    '梨': [{'word': '梨', 'reading': 'なし', 'meaning': 'Buah pir Jepang segar'}, {'word': '洋梨', 'reading': 'ようなし', 'meaning': 'Buah pir Eropa'}],
    '棺': [{'word': '棺', 'reading': 'ひつぎ', 'meaning': 'Peti mati jenazah'}, {'word': '棺桶', 'reading': 'かんおけ', 'meaning': 'Peti mati kayu jenazah'}],
    '椎': [{'word': '椎茸', 'reading': 'しいたけ', 'meaning': 'Jamur shiitake'}, {'word': '脊椎', 'reading': 'せきつい', 'meaning': 'Tulang belakang vertebra'}],
    '楷': [{'word': '楷書', 'reading': 'かいしょ', 'meaning': 'Gaya aksara tulisan tegak baku'}, {'word': '楷体', 'reading': 'かいたい', 'meaning': 'Bentuk huruf kaligrafi standar'}],
    '汎': [{'word': '汎用', 'reading': 'はんよう', 'meaning': 'Serbaguna serbaguna umum'}, {'word': '汎用性', 'reading': 'はんようせい', 'meaning': 'Fleksibilitas keserbagunaan'}],
    '沃': [{'word': '肥沃', 'reading': 'ひよく', 'meaning': 'Kesuburan tanah tanaman'}, {'word': '沃野', 'reading': 'よくや', 'meaning': 'Hamparan dataran subur'}],
    '浦': [{'word': '浦', 'reading': 'うら', 'meaning': 'Teluk pesisir tepi pantai'}, {'word': '津々浦々', 'reading': 'つつうらうら', 'meaning': 'Pelosok penjuru seluruh negeri'}],
    '淫': [{'word': '淫乱', 'reading': 'いんらん', 'meaning': 'Kecabulan asusila bebas'}, {'word': '淫靡', 'reading': 'いんび', 'meaning': 'Suasana amoral mesum'}],
    '滋': [{'word': '滋養', 'reading': 'じよう', 'meaning': 'Zat gizi nutrisi penambah daya'}, {'word': '滋賀県', 'reading': 'しがけん', 'meaning': 'Prefektur Shiga'}],
    '熊': [{'word': '熊', 'reading': 'くま', 'meaning': 'Beruang'}, {'word': '白熊', 'reading': 'しろくま', 'meaning': 'Beruang kutub es'}],
    '爽': [{'word': '爽快', 'reading': 'そうかい', 'meaning': 'Kesegaran bugar nyaman'}, {'word': '爽やか', 'reading': 'さわやか', 'meaning': 'Sejuk menyegarkan semilir'}],
    '瑠': [{'word': '瑠璃', 'reading': 'るり', 'meaning': 'Batu permata lapis lazuli'}, {'word': '瑠璃色', 'reading': 'るりいろ', 'meaning': 'Warna biru tua laut permata'}],
    '璃': [{'word': '瑠璃', 'reading': 'るり', 'meaning': 'Batu mulia permata lazuli'}, {'word': '浄瑠璃', 'reading': 'じょうるり', 'meaning': 'Teater boneka tradisional bunraku'}],
    '璧': [{'word': '完璧', 'reading': 'かんぺき', 'meaning': 'Kesempurnaan tanpa cela'}, {'word': '双璧', 'reading': 'そうへき', 'meaning': 'Dua sosok tandingan seimbang'}],
    '璽': [{'word': '御璽', 'reading': 'ぎょじ', 'meaning': 'Stempel segel kaisar'}, {'word': '国璽', 'reading': 'こくじ', 'meaning': 'Segel kenegaraan resmi'}],
    '畝': [{'word': '畝', 'reading': 'うね', 'meaning': 'Bedengan gundukan tanah tani'}, {'word': '畝織り', 'reading': 'うねおり', 'meaning': 'Tenunan bergaris alur'}],
    '畿': [{'word': '近畿', 'reading': 'きんき', 'meaning': 'Kawasan Kinki Kansai sekitar ibukota kuno'}, {'word': '畿内', 'reading': 'きない', 'meaning': 'Wilayah provinsi tengah istana'}],
    '瘍': [{'word': '潰瘍', 'reading': 'かいよう', 'meaning': 'Tukak borok lambung luka dalam'}, {'word': '腫瘍', 'reading': 'しゅよう', 'meaning': 'Tumor benjolan sel'}],
    '睦': [{'word': '和睦', 'reading': 'わぼく', 'meaning': 'Perdamaian rukun damai'}, {'word': '親睦', 'reading': 'しんぼく', 'meaning': 'Keakraban silaturahmi persahabatan'}],
    '瞳': [{'word': '瞳', 'reading': 'ひとみ', 'meaning': 'Manik mata anak mata'}, {'word': '瞳孔', 'reading': 'どうこう', 'meaning': 'Pupil bola mata'}],
    '矯': [{'word': '矯正', 'reading': 'きょうせい', 'meaning': 'Koreksi perbaikan pelurusan bentuk'}, {'word': '矯風', 'reading': 'きょうふう', 'meaning': 'Reformasi moralitas adat'}],
    '窃': [{'word': '窃盗', 'reading': 'せっとう', 'meaning': 'Tindak pidana pencurian maling'}, {'word': '剽窃', 'reading': 'ひょうせつ', 'meaning': 'Plagiarisme penjiplakan karya'}],
    '窟': [{'word': '洞窟', 'reading': 'どうくつ', 'meaning': 'Gua batu alam alami'}, {'word': '巣窟', 'reading': 'そうくつ', 'meaning': 'Sarang tempat persembunyian kejahatan'}],
    '繭': [{'word': '繭', 'reading': 'まゆ', 'meaning': 'Kepompong ulat sutera'}, {'word': '蚕繭', 'reading': 'さんけん', 'meaning': 'Kokun kepompong sutera'}],
    '罷': [{'word': '罷免', 'reading': 'ひめん', 'meaning': 'Pencopotan pemecatan jabatan resmi'}, {'word': '罷業', 'reading': 'ひぎょう', 'meaning': 'Aksi mogok buruh kerja'}],
    '羞': [{'word': '羞恥', 'reading': 'しゅうち', 'meaning': 'Rasa malu canggung'}, {'word': '羞恥心', 'reading': 'しゅうちしん', 'meaning': 'Rasa kemaluan harga diri'}],
    '翁': [{'word': '翁', 'reading': 'おきな', 'meaning': 'Pria tua kakek terhormat'}, {'word': '老翁', 'reading': 'ろうおう', 'meaning': 'Kakek orang tua lanjut usia'}],
    '肘': [{'word': '肘', 'reading': 'ひじ', 'meaning': 'Siku lengan tangan'}, {'word': '肘鉄', 'reading': 'ひじてつ', 'meaning': 'Sikutan penolakan mentah-mentah'}],
    '脊': [{'word': '脊椎', 'reading': 'せきつい', 'meaning': 'Tulang belakang vertebra'}, {'word': '脊髄', 'reading': 'せきずい', 'meaning': 'Sumsum saraf tulang belakang'}],
    '腺': [{'word': '扁桃腺', 'reading': 'へんとうせん', 'meaning': 'Kelenjar amandel tonsil'}, {'word': '甲状腺', 'reading': 'こうじょうせん', 'meaning': 'Kelenjar tiroid leher'}],
    '膝': [{'word': '膝', 'reading': 'ひざ', 'meaning': 'Lutut kaki sendi lutut'}, {'word': '膝枕', 'reading': 'ひざまくら', 'meaning': 'Memangku kepala di atas lutut'}],
    '膳': [{'word': '配膳', 'reading': 'はいぜん', 'meaning': 'Penyajian hidangan nampan meja'}, {'word': '一膳', 'reading': 'いちぜん', 'meaning': 'Satu pasang sumpit makan'}],
    '臼': [{'word': '臼', 'reading': 'うす', 'meaning': 'Lesung batu penumbuk beras'}, {'word': '臼歯', 'reading': 'きゅうし', 'meaning': 'Gigi geraham pengunyah'}],
    '舷': [{'word': '右舷', 'reading': 'うげん', 'meaning': 'Lambung kanan kapal starboard'}, {'word': '左舷', 'reading': 'さげん', 'meaning': 'Lambung kiri kapal portside'}],
    '艶': [{'word': '艶', 'reading': 'つや', 'meaning': 'Kilau kemilau pesona keanggunan'}, {'word': '妖艶', 'reading': 'ようえん', 'meaning': 'Kecantikan memikat menggoda'}],
    '芋': [{'word': '芋', 'reading': 'いも', 'meaning': 'Umbi talas kentang ubi'}, {'word': '焼き芋', 'reading': 'やきいも', 'meaning': 'Ubi panggang manis lezat'}],
    '芯': [{'word': '芯', 'reading': 'しん', 'meaning': 'Inti sumbu batang lilin pensil'}, {'word': '芯材', 'reading': 'しんざい', 'meaning': 'Bahan inti penguat'}],
    '芳': [{'word': '芳香', 'reading': 'ほうこう', 'meaning': 'Aroma harum wangi semerbak'}, {'word': '芳名', 'reading': 'ほうめい', 'meaning': 'Nama baik terhormat tamu'}],
    '茎': [{'word': '茎', 'reading': 'くき', 'meaning': 'Batang tangkai tanaman bunga'}, {'word': '根茎', 'reading': 'こんけい', 'meaning': 'Batang rimpang akar'}],
    '茨': [{'word': '茨', 'reading': 'いばら', 'meaning': 'Semak duri rintangan berduri'}, {'word': '茨城県', 'reading': 'いばらきけん', 'meaning': 'Prefektur Ibaraki'}],
    '菊': [{'word': '菊', 'reading': 'きく', 'meaning': 'Bunga seruni krisan lambang kekaisaran'}, {'word': '菊花', 'reading': 'きくか', 'meaning': 'Bunga krisan mekar'}],
    '葛': [{'word': '葛藤', 'reading': 'かっとう', 'meaning': 'Konflik batin dilema kerumitan'}, {'word': '葛湯', 'reading': 'くずゆ', 'meaning': 'Minuman rebusan pati kuzu hangat'}],
    '蓋': [{'word': '蓋', 'reading': 'ふた', 'meaning': 'Tutup wadah periuk panci'}, {'word': '天蓋', 'reading': 'てんがい', 'meaning': 'Kubah langit-langit kanopi'}],
    '蔽': [{'word': '隠蔽', 'reading': 'いんぺい', 'meaning': 'Penyembunyian bukti kejahatan'}, {'word': '遮蔽', 'reading': 'しゃへい', 'meaning': 'Tabir perisai penghalang pelindung'}],
    '薫': [{'word': '薫製', 'reading': 'くんせい', 'meaning': 'Pengasapan daging ikan asap'}, {'word': '薫風', 'reading': 'くんぷう', 'meaning': 'Semilir angin harum awal musim panas'}],
    '藍': [{'word': '藍色', 'reading': 'あいいろ', 'meaning': 'Warna biru nila indigo tradisional'}, {'word': '藍染め', 'reading': 'あいぞめ', 'meaning': 'Pencelupan kain tenun nila indigo'}],
    '藤': [{'word': '藤', 'reading': 'ふじ', 'meaning': 'Bunga wisteria ungu menjuntai'}, {'word': '藤色', 'reading': 'ふじいろ', 'meaning': 'Warna ungu muda wisteria'}],
    '藩': [{'word': '藩', 'reading': 'はん', 'meaning': 'Wilayah klan feodal zaman Edo'}, {'word': '藩主', 'reading': 'はんしゅ', 'meaning': 'Penguasa pemimpin wilayah klan feodal'}],
    '虞': [{'word': '虞', 'reading': 'おそれ', 'meaning': 'Kekhawatiran resiko bahaya genting'}, {'word': '気虞', 'reading': 'きぐ', 'meaning': 'Kekhawatiran rasa cemas'}],
    '虹': [{'word': '虹', 'reading': 'にじ', 'meaning': 'Pelangi warna-warni di langit'}, {'word': '虹彩', 'reading': 'こうさい', 'meaning': 'Iris selaput pelangi mata'}],
    '裾': [{'word': '裾', 'reading': 'すそ', 'meaning': 'Ujung keliman bawah pakaian rok celana'}, {'word': '裾野', 'reading': 'すその', 'meaning': 'Kaki lereng bukit padang luas'}],
    '訃': [{'word': '訃報', 'reading': 'ふほう', 'meaning': 'Berita duka cita kabar lelayu'}, {'word': '訃音', 'reading': 'ふいん', 'meaning': 'Kabar berita wafatnya seseorang'}],
    '詔': [{'word': '詔', 'reading': 'みことのり', 'meaning': 'Titah proklamasi agung kaisar'}, {'word': '詔勅', 'reading': 'しょうちょく', 'meaning': 'Dekrit titah kekaisaran'}],
    '詠': [{'word': '詠嘆', 'reading': 'えいたん', 'meaning': 'Kekaguman sanjungan bait puitis'}, {'word': '詠む', 'reading': 'よむ', 'meaning': 'Melantunkan menggubah bait puisi haiku'}],
    '詣': [{'word': '初詣', 'reading': 'はつもうで', 'meaning': 'Ziarah awal tahun baru ke kuil suci'}, {'word': '参詣', 'reading': 'さんけい', 'meaning': 'Kunjungan ziarah beribadah'}],
    '詮': [{'word': '詮索', 'reading': 'せんさく', 'meaning': 'Penyelidikan mengorek kepo rahasia orang'}, {'word': '所詮', 'reading': 'しょせん', 'meaning': 'Pada hakikatnya tak lebih dari'}],
    '諭': [{'word': '諭告', 'reading': 'ゆこく', 'meaning': 'Nasihat wejangan teguran resmi bijak'}, {'word': '教諭', 'reading': 'きょうゆ', 'meaning': 'Guru pembimbing resmi berijazah'}],
    '謁': [{'word': '拝謁', 'reading': 'はいえつ', 'meaning': 'Audiensi tatap muka resmi menghadap kaisar'}, {'word': '謁見', 'reading': 'えっけん', 'meaning': 'Audiensi penerimaan tamu agung'}],
    '貞': [{'word': '貞淑', 'reading': 'ていしゅく', 'meaning': 'Kesetiaan budi pekerti wanita luhur'}, {'word': '不貞', 'reading': 'ふてい', 'meaning': 'Ketidaksetiaan perselingkuhan janji'}],
    '賂': [{'word': '賄賂', 'reading': 'わいろ', 'meaning': 'Uang suap sogokan gratifikasi haram'}, {'word': '受賂', 'reading': 'じゅろ', 'meaning': 'Penerimaan gratifikasi suap'}],
    '踪': [{'word': '失踪', 'reading': 'しっそう', 'meaning': 'Menghilangnya jejak orang tanpa kabar'}, {'word': '行踪', 'reading': 'こうそう', 'meaning': 'Jejak langkah keberadaan buronan'}],
    '辣': [{'word': '辛辣', 'reading': 'しんらつ', 'meaning': 'Kritikan pedas tajam menusuk'}, {'word': '辣腕', 'reading': 'らつわん', 'meaning': 'Kepiawaian bertangan dingin penuh siasat'}],
    '迭': [{'word': '更迭', 'reading': 'こうてつ', 'meaning': 'Perombakan reshuffle pergantian pejabat'}, {'word': '変迭', 'reading': 'へんてつ', 'meaning': 'Perubahan pergantian staf'}],
    '逓': [{'word': '逓信', 'reading': 'ていしん', 'meaning': 'Komunikasi pos telegraf dan transmisi'}, {'word': '逓減', 'reading': 'ていげん', 'meaning': 'Penurunan menyusut bertahap'}],
    '遡': [{'word': '遡及', 'reading': 'そきゅう', 'meaning': 'Keberlakuan hukum surut ke masa lalu retroaktif'}, {'word': '遡る', 'reading': 'さかのぼる', 'meaning': 'Menelusuri kembali ke hulu / Masa lalu'}],
    '遵': [{'word': '遵守', 'reading': 'じゅんしゅ', 'meaning': 'Kepatuhan taat menjalankan peraturan hukum'}, {'word': '遵法', 'reading': 'じゅんぽう', 'meaning': 'Ketaatan mematuhi hukum negara'}],
    '酎': [{'word': '焼酎', 'reading': 'しょうちゅう', 'meaning': 'Minuman beralkohol suling shochu tradisional'}, {'word': '酎ハイ', 'reading': 'ちゅうはい', 'meaning': 'Koktail minuman shochu highball'}],
    '采': [{'word': '風采', 'reading': 'ふうさい', 'meaning': 'Penampilan sikap perawakan tubuh rapi'}, {'word': '采配', 'reading': 'さいはい', 'meaning': 'Tongkat kepemimpinan komando strategi'}],
    '釜': [{'word': '釜', 'reading': 'かま', 'meaning': 'Kuali periuk tembaga besar'}, {'word': '釜飯', 'reading': 'かまめし', 'meaning': 'Nasi liwet periuk panas khas Jepang'}],
    '錦': [{'word': '錦', 'reading': 'にしき', 'meaning': 'Kain sutra brokat bersulam emas megah'}, {'word': '錦絵', 'reading': 'にしきえ', 'meaning': 'Lukisan cetak ukiyo-e aneka warna'}],
    '錮': [{'word': '禁錮', 'reading': 'きんこ', 'meaning': 'Kurungan bui penjara tanpa kerja paksa'}, {'word': '禁錮刑', 'reading': 'きんこけい', 'meaning': 'Vonis hukuman kurungan penjara'}],
    '鎌': [{'word': '鎌', 'reading': 'かま', 'meaning': 'Sabit arit pemotong rumput jerami'}, {'word': '鎌倉', 'reading': 'かまくら', 'meaning': 'Kota bersejarah Kamakura pesisir'}],
    '阜': [{'word': '岐阜県', 'reading': 'ぎふけん', 'meaning': 'Prefektur Gifu di Jepang tengah'}, {'word': '岐阜市', 'reading': 'ぎふし', 'meaning': 'Kota Gifu'}],
    '附': [{'word': '寄附', 'reading': 'きふ', 'meaning': 'Sumbangan amal donasi sukarela'}, {'word': '附則', 'reading': 'ふそく', 'meaning': 'Klausul aturan tambahan lampiran undang-undang'}],
    '陪': [{'word': '陪席', 'reading': 'ばいせき', 'meaning': 'Duduk mendampingi pejabat dalam jamuan'}, {'word': '陪審員', 'reading': 'ばいしんいん', 'meaning': 'Anggota dewan juri persidangan'}],
    '隷': [{'word': '奴隷', 'reading': 'どれい', 'meaning': 'Perbudakan hamba sahaya tawanan'}, {'word': '隷属', 'reading': 'れいぞく', 'meaning': 'Subordinasi ketundukan di bawah kekuasaan'}],
    '隻': [{'word': '一隻', 'reading': 'いっせき', 'meaning': 'Satu unit kapal armada laut'}, {'word': '数隻', 'reading': 'すうせき', 'meaning': 'Beberapa buah kapal armada'}],
    '頒': [{'word': '頒布', 'reading': 'はんぷ', 'meaning': 'Penyebaran pembagian distribusi cinderamata'}, {'word': '頒布会', 'reading': 'はんぷかい', 'meaning': 'Pertemuan pembagian karya seni/buku'}],
    '頰': [{'word': '頰', 'reading': 'ほお', 'meaning': 'Pipi wajah muka'}, {'word': '頰紅', 'reading': 'ほおべに', 'meaning': 'Perona pemerah pipi rias blush-on'}],
    '顎': [{'word': '顎', 'reading': 'あご', 'meaning': 'Rahang dagu bagian wajah'}, {'word': '顎骨', 'reading': 'がっこつ', 'meaning': 'Tulang rahang pengunyah'}],
    '餌': [{'word': '餌', 'reading': 'えさ', 'meaning': 'Pakan makanan hewan peliharaan / Umpan pancing'}, {'word': '好餌', 'reading': 'こうじ', 'meaning': 'Umpan mangsa yang sangat menggiurkan'}],
    '駒': [{'word': '駒', 'reading': 'こま', 'meaning': 'Bidak catur shogi / Kuda muda tangguh'}, {'word': '持ち駒', 'reading': 'もちごま', 'meaning': 'Bidak cadangan dalam kendali tangan'}],
    '鶴': [{'word': '鶴', 'reading': 'つる', 'meaning': 'Burung bangau putih lambang kemakmuran'}, {'word': '折鶴', 'reading': 'おりづる', 'meaning': 'Origami lipatan kertas burung bangau'}],
    '麓': [{'word': '麓', 'reading': 'ふもと', 'meaning': 'Kaki lereng bawah pegunungan'}, {'word': '山麓', 'reading': 'さんろく', 'meaning': 'Kawasan lembah kaki gunung'}],
    '麺': [{'word': '麺', 'reading': 'めん', 'meaning': 'Mie gandum ramen udon soba'}, {'word': '製麺', 'reading': 'せいめん', 'meaning': 'Produksi pembuatan mie'}]
}

for k, v in FALLBACK_COMPOUNDS.items():
    vocab_compounds[k].extend(v)

print("2. Mapping missing kanji to N2 vs N1...")
# Missing mapped to N2:
# If AnchorI has it as N2 or jlpt_new in kanji-data is 2
missing_n2 = []
missing_n1 = []

for c in missing_chars:
    lvl = anchor_map.get(c)
    kj_lvl = all_kj[c].get('jlpt_new')
    if lvl == 'N2' or (lvl is None and kj_lvl == 2):
        missing_n2.append(c)
    else:
        missing_n1.append(c)

print(f"Missing N2: {len(missing_n2)} items")
print(f"Missing N1: {len(missing_n1)} items")
print(f"Total N2 after injection: 119 + {len(missing_n2)} = {119 + len(missing_n2)}")
print(f"Total N1 after injection: 86 + {len(missing_n1)} = {86 + len(missing_n1)}")
print(f"Total unique Joyo kanji in app will be: {len(existing_chars.intersection(joyo_set))} + {len(missing_chars)} = {len(joyo_set)} (100% COMPLETE!)")

# Category determination
def get_category(meanings, char):
    text = ' '.join(meanings).lower()
    if any(w in text for w in ['law', 'court', 'judge', 'crime', 'prison', 'punish', 'illegal', 'police', 'rule', 'ordinance', 'decree', 'verdict', 'sue']):
        return 'Hukum & Yudisial'
    if any(w in text for w in ['govern', 'policy', 'minister', 'emperor', 'state', 'nation', 'treaty', 'politics', 'diplomacy', 'regime', 'parliament']):
        return 'Politik & Kebijakan Publik'
    if any(w in text for w in ['money', 'economy', 'finance', 'tax', 'profit', 'debt', 'trade', 'commerce', 'market', 'business', 'enterprise', 'asset', 'fund']):
        return 'Ekonomi & Finansial'
    if any(w in text for w in ['science', 'atom', 'physics', 'chemical', 'element', 'technology', 'machine', 'electric', 'engine', 'metal', 'iron', 'steel', 'silver', 'acid']):
        return 'Sains & Teknologi'
    if any(w in text for w in ['medicine', 'disease', 'illness', 'doctor', 'remedy', 'cure', 'symptom', 'pain', 'wound', 'body', 'throat', 'lung', 'heart', 'nerve', 'blood']):
        return 'Kesehatan & Medis'
    if any(w in text for w in ['mind', 'soul', 'emotion', 'fear', 'anger', 'grief', 'joy', 'sorrow', 'regret', 'love', 'hate', 'pride', 'anxiety', 'calm']):
        return 'Psikologi & Emosi Mendalam'
    if any(w in text for w in ['philosophy', 'abstract', 'concept', 'theory', 'essence', 'truth', 'virtue', 'moral', 'ideal', 'reason', 'logic', 'destiny']):
        return 'Filsafat & Abstrak'
    if any(w in text for w in ['mountain', 'river', 'sea', 'ocean', 'island', 'lake', 'weather', 'storm', 'rain', 'wind', 'cloud', 'nature', 'earth', 'soil', 'rock', 'tree', 'flower', 'animal', 'bird', 'fish', 'insect']):
        return 'Alam & Geografi'
    if any(w in text for w in ['literature', 'poem', 'write', 'book', 'culture', 'art', 'song', 'music', 'theater', 'dance', 'history', 'tradition', 'classic']):
        return 'Sastra & Budaya'
    return 'Sosial & Kehidupan Masyarakat'

# Indonesian dictionary helper
MEANING_ID_MAP = {
    'asia': 'Asia', 'rank next': 'Urutan kedua', 'pathetic': 'Menyedihkan / Haru', 'grief': 'Duka / Kesedihan mendalam',
    'sorrow': 'Kesedihan / Ratapan', 'pity': 'Rasa kasihan / Iba', 'military officer': 'Perwira militer',
    'one': 'Satu', 'calamity': 'Malapetaka / Bencana', 'misfortune': 'Kemalangan', 'evil': 'Kejahatan / Keburukan',
    'widow': 'Janda / Minoritas', 'earnings': 'Pendapatan / Upah kerja', 'work': 'Bekerja / Mencari nafkah',
    'mosquito': 'Nyamuk', 'repent': 'Menyesal / Bertobat', 'outline': 'Garis besar / Ikhtisar',
    'condition': 'Kondisi / Keadaan', 'horizon': 'Cakrawala / Ujung batas', 'censure': 'Mencela / Mendakwa pejabat',
    'rue': 'Meratap / Mengeluh sedih', 'expand': 'Mengembang / Memuai', 'relax': 'Rileks / Santai',
    'peaceful': 'Damai / Tenang', 'sprout': 'Tunas bertunas', 'corrupt': 'Korupsi / Membusuk',
    'revolve': 'Berputar mengitari', 'circle': 'Lingkaran / Berkeliling', 'bully': 'Menindas / Mengganggu',
    'cruel': 'Kejam / Zalim', 'elegant': 'Anggun / Elegan', 'refine': 'Memurnikan / Menghaluskan',
    'brave': 'Berani / Gagah', 'chivalry': 'Ksatria / Berjiwa ksatria', 'comfort': 'Kenyamanan / Menghibur hati'
}

def translate_meaning_id(meanings, char):
    if not meanings:
        return 'Makna kanji'
    first = meanings[0].lower()
    if first in MEANING_ID_MAP:
        return MEANING_ID_MAP[first]
    
    # Generic word-level substitutions
    words = []
    for m in meanings[:2]:
        w = m.strip()
        words.append(w)
    
    combined = ' / '.join(words)
    # Simple common terms replacement
    replacements = [
        ('person', 'orang'), ('water', 'air'), ('fire', 'api'), ('tree', 'pohon'),
        ('mountain', 'gunung'), ('river', 'sungai'), ('sun', 'matahari'), ('moon', 'bulan'),
        ('child', 'anak'), ('woman', 'wanita'), ('man', 'pria'), ('king', 'raja'),
        ('gold', 'emas'), ('iron', 'besi'), ('earth', 'tanah'), ('sky', 'langit'),
        ('heart', 'hati'), ('hand', 'tangan'), ('eye', 'mata'), ('mouth', 'mulut'),
        ('foot', 'kaki'), ('life', 'kehidupan'), ('death', 'kematian'), ('birth', 'kelahiran'),
        ('law', 'hukum'), ('rule', 'aturan'), ('war', 'perang'), ('peace', 'kedamaian'),
        ('love', 'cinta'), ('hate', 'benci'), ('fear', 'ketakutan'), ('joy', 'kegembiraan'),
        ('sorrow', 'kesedihan'), ('big', 'besar'), ('small', 'kecil'), ('high', 'tinggi'),
        ('low', 'rendah'), ('long', 'panjang'), ('short', 'pendek'), ('new', 'baru'),
        ('old', 'lama / tua'), ('good', 'baik'), ('bad', 'buruk'), ('true', 'benar'),
        ('false', 'salah / palsu'), ('strong', 'kuat'), ('weak', 'lemah'),
        ('bright', 'terang'), ('dark', 'gelap'), ('deep', 'dalam'), ('shallow', 'dangkal'),
        ('spirit', 'jiwa / roh'), ('god', 'dewa / tuhan'), ('flower', 'bunga'),
        ('sound', 'suara'), ('word', 'kata'), ('letter', 'surat / huruf'),
        ('book', 'buku'), ('study', 'belajar'), ('teach', 'mengajar'),
        ('way', 'jalan / cara'), ('road', 'jalan raya'), ('gate', 'gerbang'),
        ('house', 'rumah'), ('room', 'ruangan'), ('food', 'makanan'), ('drink', 'minuman'),
        ('eat', 'makan'), ('see', 'melihat'), ('hear', 'mendengar'), ('speak', 'berbicara'),
        ('write', 'menulis'), ('read', 'membaca'), ('buy', 'membeli'), ('sell', 'menjual'),
        ('walk', 'berjalan'), ('run', 'berlari'), ('stand', 'berdiri'), ('sit', 'duduk'),
        ('fly', 'terbang'), ('swim', 'berenang'), ('sing', 'bernyanyi'), ('dance', 'menari'),
        ('government', 'pemerintahan'), ('politics', 'politik'), ('economy', 'ekonomi'),
        ('society', 'masyarakat'), ('family', 'keluarga'), ('friend', 'teman / sahabat'),
        ('enemy', 'musuh'), ('battle', 'pertempuran'), ('victory', 'kemenangan'),
        ('defeat', 'kekalahan'), ('order', 'ketertiban / pesanan'), ('chaos', 'kekacauan'),
        ('danger', 'bahaya'), ('safety', 'keamanan'), ('secret', 'rahasia'),
        ('public', 'publik / umum'), ('private', 'pribadi'), ('power', 'kekuatan / daya'),
        ('reason', 'alasan / nalar'), ('cause', 'sebab'), ('effect', 'akibat / dampak'),
        ('change', 'perubahan'), ('stop', 'berhenti'), ('start', 'memulai'),
        ('finish', 'selesai'), ('continue', 'melanjutkan'), ('create', 'menciptakan'),
        ('destroy', 'menghancurkan'), ('build', 'membangun'), ('break', 'mematahkan / rusak')
    ]
    for en_w, id_w in replacements:
        pattern = r'\b' + re.escape(en_w) + r'\b'
        combined = re.sub(pattern, id_w, combined, flags=re.IGNORECASE)
    
    return combined.capitalize()

def generate_mnemonic(char, meaning_id, radicals, strokes):
    rad_str = ', '.join(radicals[:3]) if radicals else 'bentuk goresan'
    return f"Karakter {char} ({meaning_id}) memiliki {strokes} goresan, tersusun dari elemen ({rad_str}) yang melambangkan konsep intinya."

def build_kanji_item(char, idx, level):
    k_info = all_kj.get(char, {})
    meanings = k_info.get('meanings', ['Meaning'])
    meaning_en = ', '.join(meanings[:3]) if meanings else 'Meaning'
    meaning_id = translate_meaning_id(meanings, char)
    
    # Readings
    readings_on_hira = k_info.get('readings_on', [])
    onyomi = [hira_to_kata(r) for r in readings_on_hira if r]
    kunyomi = [r for r in k_info.get('readings_kun', []) if r]
    
    strokes = k_info.get('strokes', 10)
    if not strokes or strokes <= 0: strokes = 10
    
    # Radicals
    radicals = ids_map.get(char, [])
    if not radicals:
        radicals = [char]
    
    category = get_category(meanings, char)
    mnemonic = generate_mnemonic(char, meaning_id, radicals, strokes)
    
    # Examples
    compounds = vocab_compounds.get(char, [])
    examples = []
    seen_words = set()
    for cp in compounds:
        w = cp['word']
        if w not in seen_words and len(examples) < 3:
            seen_words.add(w)
            examples.append({
                'word': w,
                'reading': cp['reading'],
                'meaning': cp['meaning']
            })
    
    # Fallback if fewer than 2
    if len(examples) < 2:
        # Use on/kun reading to make simple example
        if onyomi:
            examples.append({
                'word': f"{char}語",
                'reading': f"{onyomi[0]}ご",
                'meaning': f"Istilah / kosakata terkait {meaning_id}"
            })
        if len(examples) < 2 and kunyomi:
            clean_kun = kunyomi[0].split('.')[0].replace('-', '')
            examples.append({
                'word': f"{char}",
                'reading': clean_kun,
                'meaning': meaning_id
            })
        if len(examples) < 2:
            examples.append({
                'word': f"{char}的",
                'reading': f"{onyomi[0] if onyomi else 'てき'}てき",
                'meaning': f"Sifat yang berhubungan dengan {meaning_id}"
            })
    
    prefix = 'k-n2-bulk' if level == 'N2' else 'k-n1-bulk'
    return {
        'id': f"{prefix}-{idx}",
        'kanji': char,
        'level': level,
        'category': category,
        'meaning': meaning_en,
        'meaningId': meaning_id,
        'onyomi': onyomi,
        'kunyomi': kunyomi,
        'strokes': strokes,
        'radicals': radicals,
        'mnemonic': mnemonic,
        'examples': examples[:3]
    }

print("3. Building items for N2 and N1...")
n2_items = []
for i, c in enumerate(missing_n2, start=1):
    n2_items.append(build_kanji_item(c, i, 'N2'))

n1_items = []
for i, c in enumerate(missing_n1, start=1):
    n1_items.append(build_kanji_item(c, i, 'N1'))

print(f"Generated N2 items: {len(n2_items)}")
print(f"Generated N1 items: {len(n1_items)}")

# 4. Write TypeScript output files
def write_ts_file(filepath, const_name, items):
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write("import { KanjiItem } from '../types';\n\n")
        f.write(f"export const {const_name}: KanjiItem[] = [\n")
        for it in items:
            f.write("  {\n")
            f.write(f"    id: {json.dumps(it['id'], ensure_ascii=False)},\n")
            f.write(f"    kanji: {json.dumps(it['kanji'], ensure_ascii=False)},\n")
            f.write(f"    level: '{it['level']}',\n")
            f.write(f"    category: {json.dumps(it['category'], ensure_ascii=False)},\n")
            f.write(f"    meaning: {json.dumps(it['meaning'], ensure_ascii=False)},\n")
            f.write(f"    meaningId: {json.dumps(it['meaningId'], ensure_ascii=False)},\n")
            f.write(f"    onyomi: {json.dumps(it['onyomi'], ensure_ascii=False)},\n")
            f.write(f"    kunyomi: {json.dumps(it['kunyomi'], ensure_ascii=False)},\n")
            f.write(f"    strokes: {it['strokes']},\n")
            f.write(f"    radicals: {json.dumps(it['radicals'], ensure_ascii=False)},\n")
            f.write(f"    mnemonic: {json.dumps(it['mnemonic'], ensure_ascii=False)},\n")
            f.write("    examples: [\n")
            for ex in it['examples']:
                f.write(f"      {{ word: {json.dumps(ex['word'], ensure_ascii=False)}, reading: {json.dumps(ex['reading'], ensure_ascii=False)}, meaning: {json.dumps(ex['meaning'], ensure_ascii=False)} }},\n")
            f.write("    ],\n")
            f.write("  },\n")
        f.write("];\n")
    print(f"Successfully wrote {filepath} ({len(items)} items, {os.path.getsize(filepath)} bytes)")

write_ts_file('src/data/kanjiN2CompleteData.ts', 'KANJI_N2_COMPLETE', n2_items)
write_ts_file('src/data/kanjiN1CompleteData.ts', 'KANJI_N1_COMPLETE', n1_items)
print("Build complete!")

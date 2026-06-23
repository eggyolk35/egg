import type { Hexagram, YinYang } from "./types";
import { trigramOf } from "./trigrams";

// 录入用的精简结构：bits 为六爻自下而上的二进制串（1=阳，0=阴）。
// 上卦/下卦由程序自动推导，杜绝手填错误。
interface RawHexagram {
  id: number;
  name: string;
  pinyin: string;
  /** 六爻，自下而上，长度 6，如「111111」 */
  bits: string;
  judgment: string;
  summary: string;
  lineTexts?: string[];
  extraText?: string;
}

// 六十四卦，文王卦序。卦辞为《周易》原文（公有领域）。
// summary 为白话提要，仅供参考。lineTexts（爻辞）按卦逐步录入、校对中。
const RAW: RawHexagram[] = [
  {
    id: 1, name: "乾", pinyin: "qián", bits: "111111",
    judgment: "元，亨，利，贞。",
    summary: "刚健中正，自强不息。大吉大利，宜守正道。",
    lineTexts: [
      "初九：潜龙勿用。",
      "九二：见龙在田，利见大人。",
      "九三：君子终日乾乾，夕惕若厉，无咎。",
      "九四：或跃在渊，无咎。",
      "九五：飞龙在天，利见大人。",
      "上九：亢龙有悔。",
    ],
    extraText: "用九：见群龙无首，吉。",
  },
  {
    id: 2, name: "坤", pinyin: "kūn", bits: "000000",
    judgment: "元亨，利牝马之贞。君子有攸往，先迷后得主，利。西南得朋，东北丧朋。安贞，吉。",
    summary: "厚德载物，柔顺包容。宜随顺守正，不宜抢先。",
    lineTexts: [
      "初六：履霜，坚冰至。",
      "六二：直，方，大，不习无不利。",
      "六三：含章可贞。或从王事，无成有终。",
      "六四：括囊，无咎无誉。",
      "六五：黄裳，元吉。",
      "上六：龙战于野，其血玄黄。",
    ],
    extraText: "用六：利永贞。",
  },
  { id: 3, name: "屯", pinyin: "zhūn", bits: "100010", judgment: "元亨，利贞。勿用有攸往，利建侯。", summary: "万物初生，艰难起步。守正待时，宜立根基。" },
  { id: 4, name: "蒙", pinyin: "méng", bits: "010001", judgment: "亨。匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。利贞。", summary: "蒙昧待启，宜虚心求教，诚则有应。" },
  { id: 5, name: "需", pinyin: "xū", bits: "111010", judgment: "有孚，光亨，贞吉。利涉大川。", summary: "时机未到，宜耐心等待，守诚必通。" },
  { id: 6, name: "讼", pinyin: "sòng", bits: "010111", judgment: "有孚，窒。惕中吉。终凶。利见大人，不利涉大川。", summary: "争讼之象，戒急止争，宜和解求中。" },
  { id: 7, name: "师", pinyin: "shī", bits: "010000", judgment: "贞，丈人，吉无咎。", summary: "兴师用众，须名正帅贤，守正可成。" },
  { id: 8, name: "比", pinyin: "bǐ", bits: "000010", judgment: "吉。原筮，元永贞，无咎。不宁方来，后夫凶。", summary: "亲比相辅，宜及早归附贤明，迟则不利。" },
  { id: 9, name: "小畜", pinyin: "xiǎo chù", bits: "111011", judgment: "亨。密云不雨，自我西郊。", summary: "小有积蓄，力量尚弱，宜养待时。" },
  { id: 10, name: "履", pinyin: "lǚ", bits: "110111", judgment: "履虎尾，不咥人，亨。", summary: "履险如夷，谨慎守礼则无咎。" },
  { id: 11, name: "泰", pinyin: "tài", bits: "111000", judgment: "小往大来，吉亨。", summary: "天地交泰，上下通达，大吉之象。" },
  { id: 12, name: "否", pinyin: "pǐ", bits: "000111", judgment: "否之匪人，不利君子贞，大往小来。", summary: "天地不交，闭塞不通，宜静守待变。" },
  { id: 13, name: "同人", pinyin: "tóng rén", bits: "101111", judgment: "同人于野，亨。利涉大川，利君子贞。", summary: "和同于人，开诚布公，可成大事。" },
  { id: 14, name: "大有", pinyin: "dà yǒu", bits: "111101", judgment: "元亨。", summary: "大有所获，盛大丰收，守德可保。" },
  { id: 15, name: "谦", pinyin: "qiān", bits: "001000", judgment: "亨，君子有终。", summary: "谦逊为德，有始有终，无往不利。" },
  { id: 16, name: "豫", pinyin: "yù", bits: "000100", judgment: "利建侯行师。", summary: "顺时而动，和乐安豫，宜有所立。" },
  { id: 17, name: "随", pinyin: "suí", bits: "100110", judgment: "元亨利贞，无咎。", summary: "随顺时势，择善而从，守正无咎。" },
  { id: 18, name: "蛊", pinyin: "gǔ", bits: "011001", judgment: "元亨，利涉大川。先甲三日，后甲三日。", summary: "积弊待治，宜整顿革新，慎始慎终。" },
  { id: 19, name: "临", pinyin: "lín", bits: "110000", judgment: "元，亨，利，贞。至于八月有凶。", summary: "阳气渐长，居高临下，宜趁势而盛极防衰。" },
  { id: 20, name: "观", pinyin: "guān", bits: "000011", judgment: "盥而不荐，有孚颙若。", summary: "观仰省察，以诚示人，宜静观自省。" },
  { id: 21, name: "噬嗑", pinyin: "shì kè", bits: "100101", judgment: "亨。利用狱。", summary: "如咬合去梗，宜明断除障，刚柔相济。" },
  { id: 22, name: "贲", pinyin: "bì", bits: "101001", judgment: "亨。小利有攸往。", summary: "文饰之美，宜适度修饰，小有所往。" },
  { id: 23, name: "剥", pinyin: "bō", bits: "000001", judgment: "不利有攸往。", summary: "阴盛剥阳，衰落之象，宜静守待复。" },
  { id: 24, name: "复", pinyin: "fù", bits: "100000", judgment: "亨。出入无疾，朋来无咎。反复其道，七日来复，利有攸往。", summary: "一阳来复，生机复返，宜顺势而行。" },
  { id: 25, name: "无妄", pinyin: "wú wàng", bits: "100111", judgment: "元亨，利贞。其匪正有眚，不利有攸往。", summary: "至诚无妄，守正则通，妄动招祸。" },
  { id: 26, name: "大畜", pinyin: "dà chù", bits: "111001", judgment: "利贞，不家食吉，利涉大川。", summary: "大有蓄积，宜养德进贤，可成大业。" },
  { id: 27, name: "颐", pinyin: "yí", bits: "100001", judgment: "贞吉。观颐，自求口实。", summary: "颐养之道，宜慎言节食，自食其力。" },
  { id: 28, name: "大过", pinyin: "dà guò", bits: "011110", judgment: "栋桡，利有攸往，亨。", summary: "非常之时，负重过甚，宜果决以应。" },
  { id: 29, name: "坎", pinyin: "kǎn", bits: "010010", judgment: "习坎，有孚，维心亨，行有尚。", summary: "重险叠至，唯诚心可通，宜持守而行。" },
  { id: 30, name: "离", pinyin: "lí", bits: "101101", judgment: "利贞，亨。畜牝牛，吉。", summary: "光明附丽，宜守正柔顺，依附得宜则吉。" },
  { id: 31, name: "咸", pinyin: "xián", bits: "001110", judgment: "亨，利贞，取女吉。", summary: "交感相应，以虚受人，婚恋之吉象。" },
  { id: 32, name: "恒", pinyin: "héng", bits: "011100", judgment: "亨，无咎，利贞，利有攸往。", summary: "恒久之道，守常持正，可长可久。" },
  { id: 33, name: "遁", pinyin: "dùn", bits: "001111", judgment: "亨，小利贞。", summary: "见几而退，急流勇退，守正得宜。" },
  { id: 34, name: "大壮", pinyin: "dà zhuàng", bits: "111100", judgment: "利贞。", summary: "阳刚壮盛，宜以礼制力，戒躁守正。" },
  { id: 35, name: "晋", pinyin: "jìn", bits: "000101", judgment: "康侯用锡马蕃庶，昼日三接。", summary: "如日东升，进取向上，光明显达。" },
  { id: 36, name: "明夷", pinyin: "míng yí", bits: "101000", judgment: "利艰贞。", summary: "光明受伤，处困之时，宜晦藏守正。" },
  { id: 37, name: "家人", pinyin: "jiā rén", bits: "101011", judgment: "利女贞。", summary: "齐家之道，各正其位，内修则兴。" },
  { id: 38, name: "睽", pinyin: "kuí", bits: "110101", judgment: "小事吉。", summary: "乖离背违，求同存异，小事可成。" },
  { id: 39, name: "蹇", pinyin: "jiǎn", bits: "001010", judgment: "利西南，不利东北。利见大人，贞吉。", summary: "险阻在前，宜见贤思齐，避难就易。" },
  { id: 40, name: "解", pinyin: "xiè", bits: "010100", judgment: "利西南。无所往，其来复吉。有攸往，夙吉。", summary: "险难消解，宜趁早行动，宽以解纷。" },
  { id: 41, name: "损", pinyin: "sǔn", bits: "110001", judgment: "有孚，元吉，无咎，可贞，利有攸往。曷之用，二簋可用享。", summary: "损下益上，损己为公，诚则有得。" },
  { id: 42, name: "益", pinyin: "yì", bits: "100011", judgment: "利有攸往，利涉大川。", summary: "损上益下，利人利己，宜积极进取。" },
  { id: 43, name: "夬", pinyin: "guài", bits: "111110", judgment: "扬于王庭，孚号有厉。告自邑，不利即戎，利有攸往。", summary: "决断除恶，宜光明正大，戒恃强逞武。" },
  { id: 44, name: "姤", pinyin: "gòu", bits: "011111", judgment: "女壮，勿用取女。", summary: "不期而遇，阴长之始，宜防微杜渐。" },
  { id: 45, name: "萃", pinyin: "cuì", bits: "000110", judgment: "亨。王假有庙，利见大人，亨，利贞。用大牲吉，利有攸往。", summary: "荟萃聚合，宜聚贤聚力，守正得吉。" },
  { id: 46, name: "升", pinyin: "shēng", bits: "011000", judgment: "元亨，用见大人，勿恤，南征吉。", summary: "积小成大，循序上升，宜进取无忧。" },
  { id: 47, name: "困", pinyin: "kùn", bits: "010110", judgment: "亨，贞，大人吉，无咎，有言不信。", summary: "处困之时，宜守正自持，言不轻发。" },
  { id: 48, name: "井", pinyin: "jǐng", bits: "011010", judgment: "改邑不改井，无丧无得，往来井井。汔至，亦未繘井，羸其瓶，凶。", summary: "井养不穷，宜修德及人，善始善终。" },
  { id: 49, name: "革", pinyin: "gé", bits: "101110", judgment: "巳日乃孚，元亨利贞，悔亡。", summary: "变革之时，宜顺天应人，诚信而后动。" },
  { id: 50, name: "鼎", pinyin: "dǐng", bits: "011101", judgment: "元吉，亨。", summary: "革故鼎新，养贤纳福，大吉之象。" },
  { id: 51, name: "震", pinyin: "zhèn", bits: "100100", judgment: "亨。震来虩虩，笑言哑哑。震惊百里，不丧匕鬯。", summary: "震动惊惧，处变不惊则吉，宜临危守正。" },
  { id: 52, name: "艮", pinyin: "gèn", bits: "001001", judgment: "艮其背，不获其身，行其庭，不见其人，无咎。", summary: "止其所止，动静合宜，宜知止守静。" },
  { id: 53, name: "渐", pinyin: "jiàn", bits: "001011", judgment: "女归吉，利贞。", summary: "循序渐进，宜按部就班，守正得吉。" },
  { id: 54, name: "归妹", pinyin: "guī mèi", bits: "110100", judgment: "征凶，无攸利。", summary: "处位不当，宜守分慎行，妄进招凶。" },
  { id: 55, name: "丰", pinyin: "fēng", bits: "101100", judgment: "亨，王假之，勿忧，宜日中。", summary: "丰盛之极，宜守成防衰，把握当下。" },
  { id: 56, name: "旅", pinyin: "lǚ", bits: "001101", judgment: "小亨，旅贞吉。", summary: "羁旅在外，宜谦和谨慎，守正小通。" },
  { id: 57, name: "巽", pinyin: "xùn", bits: "011011", judgment: "小亨，利有攸往，利见大人。", summary: "顺从谦逊，宜从善如流，渐进有成。" },
  { id: 58, name: "兑", pinyin: "duì", bits: "110110", judgment: "亨，利贞。", summary: "和悦相处，宜以诚悦人，守正乃通。" },
  { id: 59, name: "涣", pinyin: "huàn", bits: "010011", judgment: "亨。王假有庙，利涉大川，利贞。", summary: "涣散之时，宜聚拢人心，化险为通。" },
  { id: 60, name: "节", pinyin: "jié", bits: "110010", judgment: "亨。苦节不可贞。", summary: "节制有度，宜适可而止，过苦则失。" },
  { id: 61, name: "中孚", pinyin: "zhōng fú", bits: "110011", judgment: "豚鱼吉，利涉大川，利贞。", summary: "诚信中孚，至诚感物，宜守信涉险。" },
  { id: 62, name: "小过", pinyin: "xiǎo guò", bits: "001100", judgment: "亨，利贞。可小事，不可大事。飞鸟遗之音，不宜上宜下，大吉。", summary: "小有过越，宜处小谨慎，不可好高。" },
  { id: 63, name: "既济", pinyin: "jì jì", bits: "101010", judgment: "亨小，利贞。初吉终乱。", summary: "事已成就，宜守成防乱，慎终如始。" },
  { id: 64, name: "未济", pinyin: "wèi jì", bits: "010101", judgment: "亨。小狐汔济，濡其尾，无攸利。", summary: "事未竟成，宜审慎图终，慎终方济。" },
];

function bitsToLines(bits: string): Hexagram["lines"] {
  if (!/^[01]{6}$/.test(bits)) throw new Error(`非法 bits: ${bits}`);
  return bits.split("").map((c) => Number(c) as YinYang) as Hexagram["lines"];
}

// 构建完整的六十四卦数据（含推导出的上下卦）。
export const HEXAGRAMS: Hexagram[] = RAW.map((r) => {
  const lines = bitsToLines(r.bits);
  const lower = trigramOf([lines[0], lines[1], lines[2]]);
  const upper = trigramOf([lines[3], lines[4], lines[5]]);
  return {
    id: r.id,
    name: r.name,
    pinyin: r.pinyin,
    lines,
    lower: lower.name,
    upper: upper.name,
    judgment: r.judgment,
    summary: r.summary,
    lineTexts: r.lineTexts ?? [],
    extraText: r.extraText,
  };
});

// 以「六爻二进制串」为键，便于由卦象反查卦。
const BY_BITS = new Map<string, Hexagram>(
  HEXAGRAMS.map((h) => [h.lines.join(""), h]),
);

/** 由六爻（自下而上）查对应卦。 */
export function hexagramByLines(lines: YinYang[]): Hexagram {
  const key = lines.join("");
  const h = BY_BITS.get(key);
  if (!h) throw new Error(`未找到卦象: ${key}`);
  return h;
}

/** 按卦序（1–64）取卦。 */
export function hexagramById(id: number): Hexagram | undefined {
  return HEXAGRAMS.find((h) => h.id === id);
}

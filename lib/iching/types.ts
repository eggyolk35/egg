// 周易六十四卦 —— 核心类型定义
//
// 约定（非常重要，全项目统一）：
// - 一爻（yáo）非阴即阳：阳爻记为 1（⚊），阴爻记为 0（⚋）。
// - 爻的顺序一律「自下而上」：line[0] 是初爻（最下），line[5] 是上爻（最上）。
// - 一卦六爻 = 下卦（内卦，初/二/三爻）+ 上卦（外卦，四/五/上爻）。

/** 单爻的阴阳：1 = 阳爻，0 = 阴爻 */
export type YinYang = 0 | 1;

/** 起卦时单爻的「老少」状态，决定是否为变爻 */
export type LineKind =
  | "oldYin" // 老阴 ⚏（6）—— 阴极而变，是变爻
  | "youngYang" // 少阳 ⚊（7）—— 不变
  | "youngYin" // 少阴 ⚋（8）—— 不变
  | "oldYang"; // 老阳 ⚌（9）—— 阳极而变，是变爻

/** 八经卦之一 */
export interface Trigram {
  /** 卦名，如「乾」 */
  name: string;
  /** 拼音 */
  pinyin: string;
  /** 自然象征，如「天」 */
  nature: string;
  /** 五行 */
  element: "金" | "木" | "水" | "火" | "土";
  /** 三爻，自下而上 */
  lines: [YinYang, YinYang, YinYang];
  /** Unicode 卦符，如「☰」 */
  symbol: string;
}

/** 六十四别卦之一（含经文） */
export interface Hexagram {
  /** 文王卦序，1–64 */
  id: number;
  /** 卦名，如「乾」 */
  name: string;
  /** 拼音 */
  pinyin: string;
  /** 六爻，自下而上 */
  lines: [YinYang, YinYang, YinYang, YinYang, YinYang, YinYang];
  /** 下卦（内卦）卦名 */
  lower: string;
  /** 上卦（外卦）卦名 */
  upper: string;
  /** 卦辞（《周易》原文） */
  judgment: string;
  /** 一句话白话提要（仅供参考） */
  summary: string;
  /**
   * 六爻爻辞，自下而上，line[0] = 初爻。
   * 待录入/校对阶段可能为空数组。
   */
  lineTexts: string[];
  /** 用九 / 用六 爻辞（仅乾、坤两卦有），可选 */
  extraText?: string;
}

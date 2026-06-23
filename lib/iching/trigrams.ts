import type { Trigram, YinYang } from "./types";

// 八经卦。lines 自下而上（line[0] 为初爻）。
export const TRIGRAMS: Trigram[] = [
  { name: "乾", pinyin: "qián", nature: "天", element: "金", symbol: "☰", lines: [1, 1, 1] },
  { name: "兑", pinyin: "duì", nature: "泽", element: "金", symbol: "☱", lines: [1, 1, 0] },
  { name: "离", pinyin: "lí", nature: "火", element: "火", symbol: "☲", lines: [1, 0, 1] },
  { name: "震", pinyin: "zhèn", nature: "雷", element: "木", symbol: "☳", lines: [1, 0, 0] },
  { name: "巽", pinyin: "xùn", nature: "风", element: "木", symbol: "☴", lines: [0, 1, 1] },
  { name: "坎", pinyin: "kǎn", nature: "水", element: "水", symbol: "☵", lines: [0, 1, 0] },
  { name: "艮", pinyin: "gèn", nature: "山", element: "土", symbol: "☶", lines: [0, 0, 1] },
  { name: "坤", pinyin: "kūn", nature: "地", element: "土", symbol: "☷", lines: [0, 0, 0] },
];

/** 把三爻（自下而上）映射为对应经卦。 */
export function trigramOf(lines: [YinYang, YinYang, YinYang]): Trigram {
  const t = TRIGRAMS.find(
    (tr) => tr.lines[0] === lines[0] && tr.lines[1] === lines[1] && tr.lines[2] === lines[2],
  );
  if (!t) throw new Error(`无法识别的三爻组合: ${lines.join("")}`);
  return t;
}

/** 按卦名取经卦。 */
export function trigramByName(name: string): Trigram {
  const t = TRIGRAMS.find((tr) => tr.name === name);
  if (!t) throw new Error(`未知经卦: ${name}`);
  return t;
}

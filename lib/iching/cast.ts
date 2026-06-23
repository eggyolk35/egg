import type { Hexagram, LineKind, YinYang } from "./types";
import { hexagramByLines } from "./hexagrams";

// 三枚铜钱起卦法。
// 每枚铜钱：阳面记 3，阴面记 2。三枚之和决定该爻：
//   6 = 2+2+2 → 老阴 ⚏（阴爻，变）
//   7 = 2+2+3 → 少阳 ⚊（阳爻，不变）
//   8 = 2+3+3 → 少阴 ⚋（阴爻，不变）
//   9 = 3+3+3 → 老阳 ⚌（阳爻，变）
// 概率 6:7:8:9 = 1:3:3:1，与传统相合。

/** 一次起爻的完整结果 */
export interface LineCast {
  /** 三枚铜钱，true = 阳面（记 3），false = 阴面（记 2） */
  coins: [boolean, boolean, boolean];
  /** 三枚之和，6/7/8/9 */
  value: 6 | 7 | 8 | 9;
  /** 老少阴阳 */
  kind: LineKind;
  /** 本爻阴阳：阳=1，阴=0 */
  yinYang: YinYang;
  /** 是否为变爻（老阴、老阳为变） */
  changing: boolean;
}

/** 一次完整起卦的结果 */
export interface Reading {
  /** 六爻，自下而上 */
  lines: LineCast[];
  /** 本卦 */
  primary: Hexagram;
  /** 变爻位（1–6，自下而上），无变爻则为空 */
  changingPositions: number[];
  /** 变卦；若无变爻则为 null */
  resulting: Hexagram | null;
}

/** 随机函数：返回 [0,1) 的浮点数。默认用 crypto 保证公平。 */
export type Rng = () => number;

const cryptoRng: Rng = () => {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 0x100000000;
};

function tossCoin(rng: Rng): boolean {
  return rng() < 0.5; // true = 阳面（3），false = 阴面（2）
}

function valueToKind(value: 6 | 7 | 8 | 9): { kind: LineKind; yinYang: YinYang; changing: boolean } {
  switch (value) {
    case 6: return { kind: "oldYin", yinYang: 0, changing: true };
    case 7: return { kind: "youngYang", yinYang: 1, changing: false };
    case 8: return { kind: "youngYin", yinYang: 0, changing: false };
    case 9: return { kind: "oldYang", yinYang: 1, changing: true };
  }
}

/** 起单爻 */
export function castLine(rng: Rng = cryptoRng): LineCast {
  const coins: [boolean, boolean, boolean] = [tossCoin(rng), tossCoin(rng), tossCoin(rng)];
  const sum: number = coins.reduce<number>((s, c) => s + (c ? 3 : 2), 0);
  const value = sum as 6 | 7 | 8 | 9;
  const { kind, yinYang, changing } = valueToKind(value);
  return { coins, value, kind, yinYang, changing };
}

/** 起一整卦（六爻），并推算本卦、变爻、变卦 */
export function castReading(rng: Rng = cryptoRng): Reading {
  const lines: LineCast[] = Array.from({ length: 6 }, () => castLine(rng));

  const primaryLines = lines.map((l) => l.yinYang) as YinYang[];
  const primary = hexagramByLines(primaryLines);

  const changingPositions = lines
    .map((l, i) => (l.changing ? i + 1 : 0))
    .filter((p) => p > 0);

  let resulting: Hexagram | null = null;
  if (changingPositions.length > 0) {
    const resultingLines = lines.map((l) =>
      l.changing ? ((l.yinYang === 1 ? 0 : 1) as YinYang) : l.yinYang,
    ) as YinYang[];
    resulting = hexagramByLines(resultingLines);
  }

  return { lines, primary, changingPositions, resulting };
}

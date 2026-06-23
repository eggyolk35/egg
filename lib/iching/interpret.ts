import type { Reading } from "./cast";

// 朱熹《周易本义》「六爻变占」断卦法。
// 依变爻数量，决定以何卦、何爻辞为主要参断对象。

export interface InterpretationGuide {
  /** 简明断法说明 */
  method: string;
  /** 主要参看的爻辞位（1–6，自下而上）；为空表示看卦辞 */
  focusLines: number[];
  /** 主要参看哪一卦的卦辞：'primary' 本卦 / 'resulting' 变卦 / 'none' 不以卦辞为主 */
  focusJudgment: "primary" | "resulting" | "none";
}

export function interpretationGuide(reading: Reading): InterpretationGuide {
  const c = reading.changingPositions; // 自下而上排序
  const n = c.length;
  const primaryName = reading.primary.name;

  switch (n) {
    case 0:
      return {
        method: "六爻皆不变：以「本卦卦辞」为断。",
        focusLines: [],
        focusJudgment: "primary",
      };
    case 1:
      return {
        method: "一爻变：以「本卦该变爻的爻辞」为断。",
        focusLines: [c[0]],
        focusJudgment: "none",
      };
    case 2:
      return {
        method: "二爻变：以「本卦两变爻爻辞」为断，以上爻（位高者）为主。",
        focusLines: c,
        focusJudgment: "none",
      };
    case 3:
      return {
        method: "三爻变：以「本卦与变卦卦辞」并参，本卦为主（贞）、变卦为辅（悔）。",
        focusLines: [],
        focusJudgment: "primary",
      };
    case 4: {
      // 以变卦中「不变的两爻」爻辞断，以下爻为主
      const unchanged = [1, 2, 3, 4, 5, 6].filter((p) => !c.includes(p));
      return {
        method: "四爻变：以「变卦中两不变爻的爻辞」为断，以下爻（位低者）为主。",
        focusLines: unchanged,
        focusJudgment: "none",
      };
    }
    case 5: {
      const unchanged = [1, 2, 3, 4, 5, 6].filter((p) => !c.includes(p));
      return {
        method: "五爻变：以「变卦中唯一不变爻的爻辞」为断。",
        focusLines: unchanged,
        focusJudgment: "none",
      };
    }
    case 6:
      if (primaryName === "乾" || primaryName === "坤") {
        return {
          method: "六爻皆变：乾用「用九」、坤用「用六」之辞为断。",
          focusLines: [],
          focusJudgment: "primary",
        };
      }
      return {
        method: "六爻皆变：以「变卦卦辞」为断。",
        focusLines: [],
        focusJudgment: "resulting",
      };
    default:
      return { method: "", focusLines: [], focusJudgment: "primary" };
  }
}

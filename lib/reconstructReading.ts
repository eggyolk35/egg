import type { LineKind, YinYang } from "./iching/types";
import type { LineCast, Reading } from "./iching/cast";
import { hexagramById } from "./iching/hexagrams";

/** 从已保存的数据重建 Reading，供历史详情展示用。 */
export function reconstructReading(data: {
  lineKinds: LineKind[];
  primaryId: number;
  resultingId: number | null;
  changingPositions: number[];
}): Reading | null {
  const primary = hexagramById(data.primaryId);
  if (!primary) return null;

  const resulting = data.resultingId
    ? (hexagramById(data.resultingId) ?? null)
    : null;

  const lines: LineCast[] = data.lineKinds.map((kind) => {
    const yinYang: YinYang =
      kind === "oldYang" || kind === "youngYang" ? 1 : 0;
    const changing = kind === "oldYang" || kind === "oldYin";
    const value = (
      kind === "oldYin" ? 6 : kind === "youngYang" ? 7 : kind === "youngYin" ? 8 : 9
    ) as 6 | 7 | 8 | 9;
    return {
      coins: [false, false, false] as [boolean, boolean, boolean],
      value,
      kind,
      yinYang,
      changing,
    };
  });

  return { lines, primary, changingPositions: data.changingPositions, resulting };
}

/** 相对时间，中文显示。 */
export function relativeTime(ms: number): string {
  const diff = Date.now() - ms;
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "刚刚";
  if (m < 60) return `${m} 分钟前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} 小时前`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} 天前`;
  return new Date(ms).toLocaleDateString("zh-CN");
}

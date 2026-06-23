import type { YinYang } from "@/lib/iching";

interface Props {
  /** 六爻，自下而上 */
  lines: YinYang[];
  /** 变爻位（1–6，自下而上） */
  changing?: number[];
  /** 已揭示的爻数（自下而上），用于起卦动画逐爻显示；默认全部 */
  revealed?: number;
}

/**
 * 画出一卦的六爻。视觉上「上爻在最上、初爻在最下」，
 * 故渲染时把自下而上的数组倒序排列。
 */
export default function HexagramView({ lines, changing = [], revealed }: Props) {
  const show = revealed ?? lines.length;
  // 由上而下渲染：position 6 → 1
  const rows = [...lines].map((v, i) => ({ v, pos: i + 1 })).reverse();

  return (
    <div className="flex w-28 flex-col gap-2">
      {rows.map(({ v, pos }) => {
        const visible = pos <= show;
        const isChanging = changing.includes(pos);
        return (
          <div
            key={pos}
            className={`yao ${v === 1 ? "yao-yang" : "yao-yin"} ${
              isChanging ? "yao-changing" : ""
            }`}
            style={{ visibility: visible ? "visible" : "hidden" }}
            aria-label={`第${pos}爻 ${v === 1 ? "阳" : "阴"}${isChanging ? " 变" : ""}`}
          >
            {v === 1 ? <span /> : (<><span /><span /></>)}
          </div>
        );
      })}
    </div>
  );
}

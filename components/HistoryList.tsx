"use client";

import { useState } from "react";
import type { LineKind } from "@/lib/iching";
import { reconstructReading, relativeTime } from "@/lib/reconstructReading";
import ReadingResult from "./ReadingResult";

export interface HistoryItem {
  id: number;
  question: string;
  createdAt: number;
  lineKinds: LineKind[];
  primaryId: number;
  primaryName: string;
  resultingId: number | null;
  resultingName: string | null;
  changingCount: number;
  changingPositions: number[];
}

export default function HistoryList({ items }: { items: HistoryItem[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  if (items.length === 0) {
    return (
      <div className="mt-16 flex flex-col items-center gap-4 text-muted">
        <span className="text-4xl">☯</span>
        <p className="tracking-widest">尚无卦象记录</p>
        <p className="text-sm">起卦后记录将自动保存于此</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => {
        const isOpen = expanded === item.id;
        const reading = isOpen
          ? reconstructReading({
              lineKinds: item.lineKinds,
              primaryId: item.primaryId,
              resultingId: item.resultingId,
              changingPositions: item.changingPositions,
            })
          : null;

        return (
          <li
            key={item.id}
            className="rounded-lg border border-line bg-surface/60 overflow-hidden"
          >
            {/* 列表行 */}
            <button
              onClick={() => setExpanded(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/5"
              aria-expanded={isOpen}
            >
              <div className="flex min-w-0 flex-col gap-1">
                {/* 卦名行 */}
                <div className="flex items-center gap-2">
                  <span className="text-base text-gold">{item.primaryName}</span>
                  {item.resultingName && (
                    <>
                      <span className="text-cinnabar">→</span>
                      <span className="text-base text-gold">{item.resultingName}</span>
                    </>
                  )}
                  <span className="text-xs text-muted">
                    {item.changingCount === 0
                      ? "无变爻"
                      : `${item.changingCount} 爻变`}
                  </span>
                </div>
                {/* 问题 + 时间行 */}
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span>{relativeTime(item.createdAt)}</span>
                  {item.question && (
                    <>
                      <span>·</span>
                      <span className="truncate max-w-[18rem]">{item.question}</span>
                    </>
                  )}
                </div>
              </div>
              <span
                className={`shrink-0 text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </button>

            {/* 展开详情 */}
            {isOpen && reading && (
              <div className="border-t border-line px-5 py-6 fade-up">
                {item.question && (
                  <p className="mb-6 text-center text-sm text-muted">
                    所问：<span className="text-foreground">{item.question}</span>
                  </p>
                )}
                <ReadingResult reading={reading} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

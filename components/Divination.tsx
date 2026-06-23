"use client";

import { useState } from "react";
import { castReading, type Reading } from "@/lib/iching";
import HexagramView from "./HexagramView";
import ReadingResult from "./ReadingResult";

type Phase = "idle" | "casting" | "done";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Divination() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [question, setQuestion] = useState("");
  const [reading, setReading] = useState<Reading | null>(null);
  const [revealed, setRevealed] = useState(0);

  async function startCasting() {
    const r = castReading();
    setReading(r);
    setRevealed(0);
    setPhase("casting");
    // 逐爻揭示，自下而上，营造起卦节奏
    for (let i = 1; i <= 6; i++) {
      await sleep(650);
      setRevealed(i);
    }
    await sleep(500);
    setPhase("done");
  }

  function reset() {
    setPhase("idle");
    setReading(null);
    setRevealed(0);
  }

  return (
    <div className="w-full max-w-2xl">
      {phase === "idle" && (
        <div className="fade-up flex flex-col items-center gap-6">
          <label className="w-full">
            <span className="mb-2 block text-center text-sm tracking-widest text-muted">
              静心默念所问之事
            </span>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={2}
              placeholder="例如：近期事业发展如何？（也可不填，心中默念即可）"
              className="w-full resize-none rounded-lg border border-line bg-surface/60 px-4 py-3 text-center text-foreground placeholder:text-muted/60 focus:border-gold focus:outline-none"
            />
          </label>
          <button
            onClick={startCasting}
            className="rounded-full border border-gold bg-gold/10 px-10 py-3 text-lg tracking-widest text-gold transition hover:bg-gold/20"
          >
            诚心起卦
          </button>
          <p className="max-w-md text-center text-xs leading-relaxed text-muted">
            采用传统「三枚铜钱」法，连掷六次成卦。
            <br />
            一事一占，心诚则灵。
          </p>
        </div>
      )}

      {phase === "casting" && reading && (
        <div className="flex flex-col items-center gap-8">
          <p className="text-sm tracking-widest text-muted">铜钱落定，卦象渐成……</p>
          <div className="flex gap-4">
            {reading.lines[Math.min(revealed, 5)].coins.map((c, i) => (
              <div
                key={`${revealed}-${i}`}
                className="coin-spin flex h-12 w-12 items-center justify-center rounded-full border-2 border-gold text-gold"
              >
                {c ? "阳" : "阴"}
              </div>
            ))}
          </div>
          <HexagramView
            lines={reading.lines.map((l) => l.yinYang)}
            changing={reading.changingPositions}
            revealed={revealed}
          />
          <p className="text-sm text-muted">第 {Math.min(revealed, 6)} / 6 爻</p>
        </div>
      )}

      {phase === "done" && reading && (
        <div className="flex flex-col items-center gap-8">
          {question.trim() && (
            <p className="text-center text-muted">
              所问：<span className="text-foreground">{question.trim()}</span>
            </p>
          )}
          <ReadingResult reading={reading} />
          <button
            onClick={reset}
            className="rounded-full border border-line px-8 py-2.5 tracking-widest text-muted transition hover:border-gold hover:text-gold"
          >
            再卜一卦
          </button>
        </div>
      )}
    </div>
  );
}

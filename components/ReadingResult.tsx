import type { Reading } from "@/lib/iching";
import { interpretationGuide } from "@/lib/iching";
import HexagramView from "./HexagramView";

function HexCard({
  title,
  name,
  pinyin,
  upper,
  lower,
  lines,
  changing,
}: {
  title: string;
  name: string;
  pinyin: string;
  upper: string;
  lower: string;
  lines: Reading["primary"]["lines"];
  changing?: number[];
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-sm tracking-widest text-muted">{title}</span>
      <HexagramView lines={lines} changing={changing} />
      <div className="text-center">
        <div className="text-2xl font-semibold text-gold">{name}</div>
        <div className="text-xs text-muted">{pinyin}</div>
        <div className="mt-1 text-sm text-muted">
          上{upper} · 下{lower}
        </div>
      </div>
    </div>
  );
}

export default function ReadingResult({ reading }: { reading: Reading }) {
  const { primary, resulting, changingPositions } = reading;
  const guide = interpretationGuide(reading);

  // 待重点参看的本卦爻辞（仅当 focusJudgment 非 resulting 时，focusLines 指本卦/变卦取决于断法）
  const focusSet = new Set(guide.focusLines);

  return (
    <div className="fade-up flex flex-col gap-8">
      {/* 卦象 */}
      <div className="flex flex-wrap items-start justify-center gap-12">
        <HexCard
          title="本卦"
          name={primary.name}
          pinyin={primary.pinyin}
          upper={primary.upper}
          lower={primary.lower}
          lines={primary.lines}
          changing={changingPositions}
        />
        {resulting && (
          <>
            <div className="self-center text-3xl text-cinnabar">→</div>
            <HexCard
              title="变卦"
              name={resulting.name}
              pinyin={resulting.pinyin}
              upper={resulting.upper}
              lower={resulting.lower}
              lines={resulting.lines}
            />
          </>
        )}
      </div>

      {/* 断卦指引 */}
      <div className="rounded-lg border border-line bg-surface/60 p-5">
        <h3 className="mb-2 text-sm tracking-widest text-gold">断卦指引</h3>
        <p className="text-foreground/90">{guide.method}</p>
        {changingPositions.length > 0 && (
          <p className="mt-2 text-sm text-muted">
            变爻：第 {changingPositions.join("、")} 爻（朱砂红标示）
          </p>
        )}
      </div>

      {/* 本卦详解 */}
      <section className="rounded-lg border border-line bg-surface/60 p-5">
        <h3 className="mb-3 text-lg text-gold">
          本卦 · {primary.name}
          <span className="ml-2 text-sm text-muted">{primary.pinyin}</span>
        </h3>
        <p className="leading-relaxed">
          <span className="text-muted">【卦辞】</span>
          {primary.judgment}
        </p>
        <p className="mt-2 leading-relaxed text-foreground/80">
          <span className="text-muted">【提要】</span>
          {primary.summary}
          <span className="ml-1 text-xs text-muted">（白话提要，仅供参考）</span>
        </p>

        {primary.lineTexts.length === 6 ? (
          <ul className="mt-4 space-y-1.5">
            {primary.lineTexts.map((t, i) => {
              const pos = i + 1;
              const hi = focusSet.has(pos) && guide.focusJudgment === "none";
              return (
                <li
                  key={pos}
                  className={`rounded px-2 py-1 leading-relaxed ${
                    hi ? "bg-cinnabar/15 text-foreground" : "text-foreground/80"
                  }`}
                >
                  {t}
                  {hi && <span className="ml-2 text-xs text-cinnabar">← 重点参看</span>}
                </li>
              );
            })}
            {primary.extraText && changingPositions.length === 6 && (
              <li className="rounded bg-cinnabar/15 px-2 py-1 leading-relaxed">
                {primary.extraText}
                <span className="ml-2 text-xs text-cinnabar">← 重点参看</span>
              </li>
            )}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted">（此卦爻辞正在录入与校对中）</p>
        )}
      </section>

      {/* 变卦详解 */}
      {resulting && (
        <section className="rounded-lg border border-line bg-surface/60 p-5">
          <h3 className="mb-3 text-lg text-gold">
            变卦 · {resulting.name}
            <span className="ml-2 text-sm text-muted">{resulting.pinyin}</span>
          </h3>
          <p className="leading-relaxed">
            <span className="text-muted">【卦辞】</span>
            {resulting.judgment}
          </p>
          <p className="mt-2 leading-relaxed text-foreground/80">
            <span className="text-muted">【提要】</span>
            {resulting.summary}
          </p>
        </section>
      )}

      <p className="text-center text-xs leading-relaxed text-muted">
        本站解读综合《周易》经文与传统断法，意在启发思考，不构成任何决策依据。
        <br />
        心诚则灵，福祸自取，谋事在人。
      </p>
    </div>
  );
}

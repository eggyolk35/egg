// 数据自检：确保六十四卦表无重复、可被起卦引擎正确识别。
import { HEXAGRAMS, castReading } from "../lib/iching";

let errors = 0;
const fail = (msg: string) => {
  console.error("✗", msg);
  errors++;
};

// 1) 卦数应为 64，卦序 1–64 不重不漏
if (HEXAGRAMS.length !== 64) fail(`卦数应为 64，实际 ${HEXAGRAMS.length}`);
const ids = new Set(HEXAGRAMS.map((h) => h.id));
for (let i = 1; i <= 64; i++) if (!ids.has(i)) fail(`缺少卦序 ${i}`);

// 2) 六爻二进制互不重复（64 种组合应全覆盖）
const bitsSet = new Set(HEXAGRAMS.map((h) => h.lines.join("")));
if (bitsSet.size !== 64) fail(`卦象去重后应为 64，实际 ${bitsSet.size}`);

// 3) 卦辞、提要、爻辞完整性
for (const h of HEXAGRAMS) {
  if (!h.judgment) fail(`${h.id} ${h.name} 缺卦辞`);
  if (!h.summary) fail(`${h.id} ${h.name} 缺提要`);
  if (h.lineTexts.length !== 6) {
    fail(`${h.id} ${h.name} 爻辞数应为 6，实际 ${h.lineTexts.length}`);
  }
  h.lineTexts.forEach((t, i) => {
    if (!t.trim()) fail(`${h.id} ${h.name} 第${i + 1}爻爻辞为空`);
  });
}
const withLines = HEXAGRAMS.filter((h) => h.lineTexts.length === 6).length;
console.log(`爻辞完整的卦：${withLines} / 64`);

// 4) 起卦引擎：跑 2000 次，统计 6/7/8/9 概率应接近 1:3:3:1
const tally: Record<number, number> = { 6: 0, 7: 0, 8: 0, 9: 0 };
for (let i = 0; i < 2000; i++) {
  const r = castReading();
  for (const l of r.lines) tally[l.value]++;
  // 变卦逻辑自洽性：有变爻则必有变卦
  if (r.changingPositions.length > 0 && !r.resulting) fail("有变爻却无变卦");
  if (r.changingPositions.length === 0 && r.resulting) fail("无变爻却有变卦");
}
const total = 12000;
console.log("起卦分布（理论 6:7:8:9 ≈ 1:3:3:1）：");
for (const v of [6, 7, 8, 9]) {
  console.log(`  ${v}: ${(100 * tally[v] / total).toFixed(1)}%`);
}

if (errors === 0) {
  console.log("\n✓ 六十四卦数据与起卦引擎自检全部通过");
  process.exit(0);
} else {
  console.error(`\n✗ 自检发现 ${errors} 个问题`);
  process.exit(1);
}

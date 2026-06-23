import Link from "next/link";
import { listReadings } from "@/lib/db";
import { hexagramById } from "@/lib/iching";
import type { LineKind } from "@/lib/iching";
import HistoryList, { type HistoryItem } from "@/components/HistoryList";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "历史记录 · 周易卜卦",
};

export default function HistoryPage() {
  const rows = listReadings(50);

  const items: HistoryItem[] = rows.map((row) => {
    const primary = hexagramById(row.primary_id);
    const resulting = row.resulting_id ? hexagramById(row.resulting_id) : null;
    const changingPositions = JSON.parse(row.changing_positions) as number[];
    return {
      id: row.id,
      question: row.question,
      createdAt: row.created_at,
      lineKinds: JSON.parse(row.line_kinds) as LineKind[],
      primaryId: row.primary_id,
      primaryName: primary?.name ?? "？",
      resultingId: row.resulting_id ?? null,
      resultingName: resulting?.name ?? null,
      changingCount: changingPositions.length,
      changingPositions,
    };
  });

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xl tracking-widest text-gold">历史记录</h2>
        <Link href="/" className="text-sm text-muted transition hover:text-gold">
          ← 返回起卦
        </Link>
      </div>

      {items.length > 0 && (
        <p className="mb-4 text-xs text-muted">共 {items.length} 条记录，最多保留 50 条</p>
      )}

      <HistoryList items={items} />
    </main>
  );
}

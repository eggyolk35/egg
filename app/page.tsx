import Divination from "@/components/Divination";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center px-5 py-10 sm:py-14">
      <header className="mb-10 flex flex-col items-center gap-2 text-center">
        <p className="text-sm tracking-[0.4em] text-muted">六十四卦 · 在线起卦</p>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-foreground/70">
          《周易》者，群经之首，大道之源。
          <br />
          以三枚铜钱起卦，观本卦、察变爻、推变卦，
          <br />
          援卦辞爻辞以明吉凶，启心智以助决断。
        </p>
      </header>

      <Divination />

      <footer className="mt-20 text-center text-xs text-muted">
        卦辞爻辞源出《周易》经文（公有领域）· 解读仅供参考
      </footer>
    </main>
  );
}

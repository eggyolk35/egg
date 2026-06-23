import Link from "next/link";

export default function Nav() {
  return (
    <nav className="flex items-center justify-between border-b border-line px-6 py-4">
      <Link
        href="/"
        className="text-lg tracking-[0.3em] text-gold transition hover:opacity-80"
      >
        周易卜卦
      </Link>
      <Link
        href="/history"
        className="text-sm tracking-widest text-muted transition hover:text-gold"
      >
        历史记录
      </Link>
    </nav>
  );
}

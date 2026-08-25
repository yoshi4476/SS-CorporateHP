"use client";

// 画面右端の固定サイドバー (デスクトップのみ)。
// ページリンク + トップページ全セクションへのリンクを常時表示。
// 現在地はブルーのドットで点灯。

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

const PAGES: { href: string; label: string; external?: boolean }[] = [
  { href: "/", label: "トップ" },
  { href: "/services", label: "事業内容" },
  // 自社プロダクト。契約の入口なので、どのページからでも1クリックで行けるようにする
  { href: "/rakushift", label: "SaaS紹介" },
  { href: "/aio-agent", label: "エージェント紹介" },
  { href: "/company", label: "会社概要" },
  { href: "/news", label: "お知らせ" },
  { href: "/contact", label: "無料相談" },
  { href: site.lpUrl, label: "補助金LP", external: true },
  { href: site.labUrl, label: "AI集客ラボ", external: true },
];

const SECTIONS: { href: string; label: string }[] = [
  { href: "/#vision", label: "ビジョン" },
  { href: "/#services", label: "7つの事業" },
  { href: "/#numbers", label: "数字で見る" },
  { href: "/#data", label: "実践データ" },
  { href: "/#aio", label: "SEO×MEO×AIO" },
  { href: "/#field", label: "現場の実績" },
  { href: "/#process", label: "ご相談の流れ" },
  { href: "/#subsidy", label: "補助金活用" },
  { href: "/#news", label: "最新情報" },
  { href: "/#faq", label: "よくある質問" },
];

function Item({
  href,
  label,
  active,
  external,
  dot,
}: {
  href: string;
  label: string;
  active?: boolean;
  external?: boolean;
  dot?: boolean;
}) {
  const cls = `group flex items-center justify-end gap-2 py-0.5 text-right font-data text-[0.62rem] tracking-[0.12em] transition-colors ${
    active ? "font-bold text-pulse" : "text-slate hover:text-pulse"
  }`;
  const inner = (
    <>
      <span className="transition-transform duration-200 group-hover:-translate-x-0.5">
        {label}
        {external && " ↗"}
      </span>
      <span
        aria-hidden
        className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
          active ? "bg-pulse" : dot ? "bg-aqua" : "bg-ink/20 group-hover:bg-pulse"
        }`}
      />
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls} aria-current={active ? "page" : undefined}>
      {inner}
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="サイドナビゲーション"
      className="fixed right-5 top-1/2 z-40 hidden max-h-[86vh] -translate-y-1/2 flex-col items-end gap-0.5 overflow-y-auto rounded-2xl border border-line bg-paper/80 px-4 py-4 shadow-card backdrop-blur-sm xl:flex"
    >
      <p className="eyebrow mb-1 !text-[0.55rem]">Menu</p>
      {PAGES.map((p) => (
        <Item
          key={p.href}
          href={p.href}
          label={p.label}
          external={p.external}
          dot={p.external}
          active={!p.external && (p.href === "/" ? pathname === "/" : pathname.startsWith(p.href))}
        />
      ))}
      <p className="eyebrow mb-1 mt-3 !text-[0.55rem]">Contents</p>
      {SECTIONS.map((s) => (
        <Item key={s.href} href={s.href} label={s.label} />
      ))}
      <Link
        href="/privacy"
        className={`mt-3 font-data text-[0.58rem] tracking-[0.1em] transition-colors ${
          pathname === "/privacy" ? "font-bold text-pulse" : "text-faint hover:text-pulse"
        }`}
      >
        プライバシーポリシー
      </Link>
    </nav>
  );
}

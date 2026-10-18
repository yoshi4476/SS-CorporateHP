"use client";

// ヘッダー: 白地に罫1本。ロゴ・主な項目・無料相談のボタン。
// 以前は動画の上で白抜きになり、メニューは全画面の紺に大きな番号と「MENU」の白抜き文字を出していた。
// どのページでも同じ形にし、スマホのメニューも白地の一覧にする（DESIGN.md 8）。

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { services } from "@/lib/services";
import { diagnostics, toolsIndex } from "@/lib/aio";
import { site } from "@/lib/site";
import { developer, developerOrg } from "@/lib/developer";

// 診断はあくまで簡易的なもの。過信されないよう、導線のそばに必ず添える。
const DIAGNOSIS_NOTE = "簡易的なチェックのため、正確な情報や詳しい内容をお知りになりたい方はご連絡ください。";

// 検索での表示の約8割は経理ブログの記事（GSC の page 次元で84%・2026-10）なのに、無料ツールは
// AIO・MEO の診断だけだった。自社の経理チェックを先頭に置き、AI集客ラボの診断はその後ろにまとめる
const KEIRI_CHECK = { name: "経理、外に出すべき？5問のセルフチェック", spec: "無料・登録不要", href: "/tools/keiri-check" };

// URLを入れる診断を先頭に。LPの入力欄へ直接飛び、どこから来たかを src で残す
const WEB_CHECKS = [
  { name: "URL診断（サイトの14項目を採点）", spec: "URLだけ・約30秒", href: "https://ai.7senses.co.jp/tools/url-check/?src=corp_header" },
  ...diagnostics,
  { name: "無料ツールの一覧", spec: "AI集客ラボ", href: toolsIndex },
];
const WEB_CHECKS_LABEL = "Web集客・AI検索（AI集客ラボ）";

// 自社プロダクト。契約の入口なので、事業内容のメニューから直接たどれるようにする
const PRODUCTS: { href: string; label: string }[] = [
  { href: "/rakushift", label: "ラクシフトAI (シフト自動作成)" },
  { href: "/aio-agent", label: "AIO（SEO）対策エージェント" },
  { href: "/services/keiri-bpo", label: "経理システム（セルフ版）" },
];

// 自社運営の別サイト。会社概要のとなりに置き、どちらも別タブで開く
const RELATED_SITES: { href: string; label: string; note: string }[] = [
  { href: site.lpUrl, label: "AI導入補助金LP", note: "補助金を使ったAI導入の特設サイト" },
  { href: site.labUrl, label: "AI集客ラボ", note: "AI検索・MEO・SEOの運営メディア" },
];

const MAIN_LINKS: { href: string; label: string }[] = [
  { href: "/", label: "トップ" },
  { href: "/services", label: "事業内容" },
  { href: "/blog", label: "経理BPOブログ" },
  { href: "/news", label: "お知らせ" },
  { href: "/company", label: "会社概要" },
];

const navLink = "text-[15px] font-bold text-ink transition-colors duration-150 hover:text-pulse";
const menuPanel =
  "invisible absolute top-full pt-2 opacity-0 transition-[opacity,visibility] duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100";

function Chevron() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className="mt-0.5 transition-transform duration-200 group-hover:rotate-180">
      <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";
  const here = (href: string) => pathname === href || pathname.startsWith(href + "/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ページが変わったらメニューを閉じる（描画中に前のパスと比べる。effect で閉じると1回余分に描き直す）
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setOpen(false);
  }

  // メニュー展開中は背面スクロールをロック。Esc で閉じる
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    if (open) window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b bg-paper transition-colors duration-200 ${
          scrolled || open ? "border-line" : "border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 md:h-[72px] md:px-8">
          <Link prefetch={false} href="/" className="flex shrink-0 items-center gap-3" aria-label="セブンセンシズ株式会社 トップページ">
            <Image src="/images/logo.png" alt="SEVEN SENSES" width={148} height={56} priority className="h-8 w-auto md:h-10" />
            <span className="hidden border-l border-line pl-3 text-xs font-bold leading-[1.45] text-slate sm:block">
              セブンセンシズ
              <br />
              株式会社
            </span>
          </Link>

          <nav aria-label="ヘッダーナビゲーション" className="hidden items-center gap-7 lg:flex">
            <div className="group relative">
              <Link prefetch={false} href="/services" className={`flex items-center gap-1 py-6 ${navLink}`}>
                <span className="nav-u" aria-current={here("/services") ? "page" : undefined}>事業内容</span>
                <Chevron />
              </Link>
              <div className={`${menuPanel} left-1/2 w-[36rem] -translate-x-1/2`}>
                <div className="max-h-[calc(100vh-6rem)] overflow-y-auto rounded-md border border-line bg-paper p-5 shadow-lift">
                  <div className="grid grid-cols-2 gap-x-6">
                    <div>
                      <Link prefetch={false} href="/services" className="link-u text-sm">
                        事業内容の一覧
                      </Link>
                      <ul className="mt-3 border-t border-line">
                        {services.map((s) => (
                          <li key={s.slug} className="border-b border-line">
                            <Link prefetch={false} href={`/services/${s.slug}`} className="block py-2.5 text-sm text-ink transition-colors hover:text-pulse">
                              {s.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* 自社プロダクト。受託の事業とは性質が違うので列を分ける */}
                    <div>
                      <p className="text-sm font-bold text-slate">自社プロダクト</p>
                      <ul className="mt-3 border-t border-line">
                        {PRODUCTS.map((p) => (
                          <li key={p.href} className="border-b border-line">
                            <Link prefetch={false} href={p.href} className="block py-2.5 text-sm text-ink transition-colors hover:text-pulse">
                              {p.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-5 text-sm font-bold text-slate">運営サイト</p>
                      <ul className="mt-3 border-t border-line">
                        {RELATED_SITES.map((r) => (
                          <li key={r.href} className="border-b border-line">
                            <a href={r.href} target="_blank" rel="noopener" className="block py-2.5 text-sm text-ink transition-colors hover:text-pulse">
                              {r.label} ↗
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {MAIN_LINKS.slice(2).map((l) => (
              <Link prefetch={false} key={l.href} href={l.href} className={navLink}>
                <span className="nav-u" aria-current={here(l.href) ? "page" : undefined}>{l.label}</span>
              </Link>
            ))}
            <div className="group relative">
              {/* 相談の手前の入口。押せる形にして、キーボードでも開けるようにする */}
              <button type="button" className={`flex items-center gap-1 py-6 ${navLink}`} aria-haspopup="true">
                <span className="nav-u">無料セルフチェック</span>
                <Chevron />
              </button>
              <div className={`${menuPanel} right-0 w-[24rem]`}>
                <div className="max-h-[calc(100vh-6rem)] overflow-y-auto rounded-md border border-line bg-paper p-5 shadow-lift">
                  <p className="text-sm font-bold text-gold-deep">経理</p>
                  <Link prefetch={false} href={KEIRI_CHECK.href} className="mt-2 block rounded-sm border border-gold-bright/60 bg-gold-tint px-4 py-3 transition-colors hover:border-gold-bright">
                    <span className="block text-sm font-bold text-ink">{KEIRI_CHECK.name}</span>
                    <span className="text-[13px] text-slate">{KEIRI_CHECK.spec}</span>
                  </Link>
                  <p className="mt-5 text-sm font-bold text-slate">{WEB_CHECKS_LABEL}</p>
                  <ul className="mt-2 border-t border-line">
                    {WEB_CHECKS.map((d) => (
                      <li key={d.name} className="border-b border-line">
                        <a href={d.href} target="_blank" rel="noopener" className="flex items-baseline justify-between gap-3 py-2.5 transition-colors hover:text-pulse">
                          <span className="text-sm">{d.name} ↗</span>
                          <span className="shrink-0 text-[13px] text-slate">{d.spec}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-[13px] leading-6 text-slate">
                    {DIAGNOSIS_NOTE}
                    <Link prefetch={false} href="/contact" className="link-u ml-1">
                      無料相談へ
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            <Link prefetch={false} href="/contact" className="btn btn-primary min-h-11 px-5 text-sm">
              無料相談
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "メニューを閉じる" : "メニューを開く"}
            className="flex h-11 items-center gap-2 rounded-sm border border-ink px-3 text-sm font-bold text-ink lg:hidden"
          >
            <span aria-hidden className="relative block h-3 w-4">
              <span className={`absolute left-0 h-0.5 w-4 bg-current transition-transform duration-200 ${open ? "top-[5px] rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-[5px] h-0.5 w-4 bg-current transition-opacity duration-150 ${open ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 h-0.5 w-4 bg-current transition-transform duration-200 ${open ? "top-[5px] -rotate-45" : "top-[10px]"}`} />
            </span>
            {open ? "閉じる" : "メニュー"}
          </button>
        </div>
      </header>

      {/* スマホのメニュー。白地の一覧 */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-paper transition-[opacity,visibility] duration-200 md:top-[72px] lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav aria-label="メインナビゲーション" data-cta-pos="menu" data-open={open} className="mx-auto max-w-2xl px-5 pb-16 pt-4 md:px-8">
          <ul className="border-t border-ink">
            {MAIN_LINKS.map((l, i) => (
              <li key={l.href} className="menu-item border-b border-line" style={{ "--d": `${40 + i * 35}ms` } as React.CSSProperties}>
                <Link prefetch={false} href={l.href} className="flex min-h-14 items-center text-lg font-bold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link prefetch={false} href="/contact" className="menu-item btn btn-primary mt-6 w-full" style={{ "--d": "240ms" } as React.CSSProperties}>
            無料相談を予約する
          </Link>

          <MenuGroup title="事業内容">
            {services.map((s) => (
              <li key={s.slug}>
                <Link prefetch={false} href={`/services/${s.slug}`} className="tap text-[15px]">
                  {s.name}
                </Link>
              </li>
            ))}
          </MenuGroup>
          <MenuGroup title="自社プロダクト">
            {PRODUCTS.map((p) => (
              <li key={p.href}>
                <Link prefetch={false} href={p.href} className="tap text-[15px]">
                  {p.label}
                </Link>
              </li>
            ))}
          </MenuGroup>
          <MenuGroup title="無料セルフチェック">
            <li>
              <Link prefetch={false} href={KEIRI_CHECK.href} className="tap text-[15px] font-bold text-gold-deep">
                {KEIRI_CHECK.name}（{KEIRI_CHECK.spec}）
              </Link>
            </li>
            <li className="pt-2 text-[13px] font-bold text-slate">{WEB_CHECKS_LABEL}</li>
            {WEB_CHECKS.map((d) => (
              <li key={d.name}>
                <a href={d.href} target="_blank" rel="noopener" className="tap text-[15px]">
                  {d.name}（{d.spec}）↗
                </a>
              </li>
            ))}
            <li className="pt-2 text-[13px] leading-6 text-slate">{DIAGNOSIS_NOTE}</li>
          </MenuGroup>
          <MenuGroup title="運営サイト">
            {RELATED_SITES.map((r) => (
              <li key={r.href}>
                <a href={r.href} target="_blank" rel="noopener" className="tap text-[15px]">
                  {r.label} ↗
                </a>
              </li>
            ))}
          </MenuGroup>
          {/* 当社の顧問 YW のサイト。運営サイトではないので別に置く */}
          <MenuGroup title="開発・事業づくりの相談">
            <li>
              <a href={developerOrg.url} target="_blank" rel="noopener" className="tap text-[15px]">
                {developerOrg.name}（当社顧問 {developer.name}）↗
              </a>
            </li>
          </MenuGroup>

          <p className="mt-8 border-t border-line pt-5 text-sm leading-7 text-slate">
            TEL:{" "}
            <a href={`tel:${site.tel.replaceAll("-", "")}`} className="tap num font-bold text-ink">
              {site.tel}
            </a>
            <br />
            受付時間: {site.hours}
          </p>
          <Link prefetch={false} href="/privacy" className="tap text-[13px] text-slate underline-offset-4 hover:underline">
            プライバシーポリシー
          </Link>
        </nav>
      </div>
    </>
  );
}

function MenuGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <p className="border-b border-line pb-2 text-[13px] font-bold text-slate">{title}</p>
      <ul className="mt-1 grid">{children}</ul>
    </div>
  );
}

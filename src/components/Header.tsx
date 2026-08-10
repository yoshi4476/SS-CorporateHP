"use client";

// ヘッダー: ロゴ + ハンバーガーのみ。
// 全ナビゲーションはフルスクリーンのオーバーレイメニューに集約。
// 開閉で背面スクロールをロックし、項目はスタッガーで立ち上がる。

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { services } from "@/lib/services";
import { diagnostics } from "@/lib/aio";
import { site } from "@/lib/site";

// 診断はあくまで簡易的なもの。過信されないよう、導線のそばに必ず添える。
const DIAGNOSIS_NOTE = "簡易的なチェックのため、正確な情報や詳しい内容をお知りになりたい方はご連絡ください。";

// 自社プロダクト。契約の入口なので、事業内容のメニューから直接たどれるようにする
const PRODUCTS: { href: string; label: string }[] = [
  { href: "/rakushift", label: "ラクシフトAI (シフト自動作成)" },
  { href: "/media-pipeline", label: "SEOオウンドメディア全自動パイプライン" },
];

// 自社運営の別サイト。会社概要のとなりに置き、どちらも別タブで開く
const RELATED_SITES: { href: string; label: string; note: string }[] = [
  { href: site.lpUrl, label: "AI導入補助金LP", note: "補助金を使ったAI導入の特設サイト" },
  { href: site.labUrl, label: "AI集客ラボ", note: "AI検索・MEO・SEOの運営メディア" },
];

const MAIN_LINKS: { href: string; label: string; en: string }[] = [
  { href: "/", label: "トップ", en: "Top" },
  { href: "/services", label: "事業内容", en: "Services" },
  { href: "/company", label: "会社概要", en: "Company" },
  { href: "/blog", label: "経理BPOブログ", en: "Blog" },
  { href: "/news", label: "お知らせ", en: "News" },
  { href: "/contact", label: "無料相談", en: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // メニュー展開中は背面スクロールをロック
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          open
            ? "bg-transparent"
            : scrolled
              ? "bg-paper/85 backdrop-blur-md shadow-[0_1px_0_0_var(--color-line)]"
              : "bg-transparent"
        }`}
      >
        <div className="flex h-16 items-center justify-between pl-5 pr-4 md:h-20 md:pl-8 md:pr-6">
          <Link href="/" className="flex items-center gap-3" aria-label="セブンセンシズ株式会社 トップページ">
            <Image
              src="/images/logo.png"
              alt="SEVEN SENSES"
              width={148}
              height={56}
              priority
              className={`h-9 w-auto transition-all duration-300 md:h-11 ${open ? "logo-invert" : ""}`}
            />
            <span
              className={`hidden text-[0.65rem] leading-4 tracking-widest transition-colors duration-300 sm:block ${
                open ? "text-white/70" : "text-slate"
              }`}
            >
              セブンセンシズ
              <br />
              株式会社
            </span>
          </Link>

          <div className="flex items-center gap-3 md:gap-6">
            {/* インラインナビ (デスクトップのみ・メニュー展開中は非表示) */}
            <nav
              aria-label="ヘッダーナビゲーション"
              className={`hidden items-center gap-6 transition-opacity duration-200 lg:flex ${
                open ? "pointer-events-none opacity-0" : "opacity-100"
              }`}
            >
              <div className="group relative">
                <Link
                  href="/services"
                  className="flex items-center gap-1 py-6 text-sm font-medium text-ink transition-colors hover:text-pulse"
                >
                  事業内容
                  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className="mt-0.5 transition-transform group-hover:rotate-180">
                    <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </Link>
                <div className="invisible absolute left-1/2 top-full w-72 -translate-x-1/2 pt-1 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <ul className="tilt rounded-2xl border border-line bg-raise p-2 shadow-lift">
                    <li>
                      <Link
                        href="/services"
                        className="block rounded-xl px-4 py-2.5 text-sm font-bold text-pulse transition-colors hover:bg-mist"
                      >
                        事業内容一覧 →
                      </Link>
                    </li>
                    {services.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/services/${s.slug}`}
                          className="block rounded-xl px-4 py-2.5 text-sm text-ink transition-colors hover:bg-mist hover:text-pulse"
                        >
                          {s.name}
                        </Link>
                      </li>
                    ))}
                    {/* 自社プロダクト。受託の事業とは性質が違うので線で区切る */}
                    <li className="mt-1 border-t border-line pt-1">
                      <p className="px-4 pb-1 pt-2 font-data text-[0.6rem] uppercase tracking-[0.2em] text-faint">
                        Products
                      </p>
                    </li>
                    {PRODUCTS.map((p) => (
                      <li key={p.href}>
                        <Link
                          href={p.href}
                          className="block rounded-xl px-4 py-2.5 text-sm text-ink transition-colors hover:bg-mist hover:text-pulse"
                        >
                          {p.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <Link href="/blog" className="text-sm font-medium text-ink transition-colors hover:text-pulse">
                経理BPOブログ
              </Link>
              <Link href="/news" className="text-sm font-medium text-ink transition-colors hover:text-pulse">
                お知らせ
              </Link>
              <Link href="/company" className="text-sm font-medium text-ink transition-colors hover:text-pulse">
                会社概要
              </Link>
              {/* 自社で運営している別サイト。別タブで開くことが分かるよう ↗ を添える */}
              {RELATED_SITES.map((r) => (
                <a
                  key={r.href}
                  href={r.href}
                  target="_blank"
                  rel="noopener"
                  className="hidden text-sm font-medium text-slate transition-colors hover:text-pulse xl:block"
                >
                  {r.label} ↗
                </a>
              ))}
              <div className="group relative">
                {/* 相談の手前の入口なので、他の項目より少し目立たせる */}
                <span className="flex cursor-default items-center gap-1.5 rounded-full border border-pulse/35 bg-pulse/5 px-4 py-2 text-sm font-bold text-pulse transition-colors group-hover:border-pulse group-hover:bg-pulse/10">
                  無料セルフチェック
                  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className="mt-0.5 transition-transform group-hover:rotate-180">
                    <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </span>
                <div className="invisible absolute right-0 top-full w-80 pt-1 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <div className="tilt rounded-2xl border border-line bg-raise p-2 shadow-lift">
                    <ul>
                      {diagnostics.map((d) => (
                        <li key={d.name}>
                          <a
                            href={d.href}
                            target="_blank"
                            rel="noopener"
                            className="flex items-baseline justify-between gap-3 rounded-xl px-4 py-2.5 transition-colors hover:bg-mist"
                          >
                            <span className="text-sm text-ink">{d.name} ↗</span>
                            <span className="font-data shrink-0 text-[0.6rem] uppercase tracking-[0.12em] text-slate">
                              {d.spec}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-1 border-t border-line px-4 py-3 text-[0.65rem] leading-5 text-slate">
                      {DIAGNOSIS_NOTE}
                      <Link href="/contact" className="ml-1 font-bold text-pulse hover:underline">
                        無料相談へ
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
              <Link
                href="/contact"
                data-magnetic
                className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white shadow-card transition-colors hover:bg-pulse"
              >
                無料相談
              </Link>
            </nav>

            {/* 色分けされたハンバーガー: 通常=ブルー / 展開時=ライム */}
            <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "メニューを閉じる" : "メニューを開く"}
            data-magnetic
            className={`flex h-12 w-12 flex-col items-center justify-center gap-1.5 rounded-full shadow-card transition-colors duration-300 md:h-14 md:w-14 ${
              open ? "bg-aqua" : "bg-pulse hover:bg-pulse-deep"
            }`}
          >
            <span
              className={`h-0.5 w-5 transition-all duration-300 ${
                open ? "translate-y-1 rotate-45 bg-ink" : "bg-white"
              }`}
            />
            <span className={`h-0.5 w-5 transition-opacity duration-200 ${open ? "opacity-0" : "bg-white"}`} />
            <span
              className={`h-0.5 w-5 transition-all duration-300 ${
                open ? "-translate-y-1.5 -rotate-45 bg-ink" : "bg-white"
              }`}
            />
            </button>
          </div>
        </div>
      </header>

      {/* フルスクリーンオーバーレイ */}
      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-40 transition-all duration-500 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-ink" />
        <div aria-hidden className="grid-field-dark absolute inset-0" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 70% at 80% 15%, rgb(28 63 124 / 0.4), transparent 60%), radial-gradient(ellipse 40% 50% at 8% 90%, rgb(116 199 214 / 0.12), transparent 60%)",
          }}
        />
        <p
          aria-hidden
          className="outline-text-light pointer-events-none absolute -bottom-6 left-0 select-none font-data text-[16vw] font-bold leading-none tracking-tighter"
        >
          MENU
        </p>

        <nav
          aria-label="メインナビゲーション"
          className="relative flex h-full flex-col justify-center overflow-y-auto px-6 pt-20 md:px-16"
        >
          <div className="grid gap-10 md:grid-cols-[1.3fr_1fr] md:gap-16">
            {/* 左: メインリンク */}
            <ul className="grid gap-2 md:gap-4">
              {MAIN_LINKS.map((l, i) => (
                <li
                  key={l.href}
                  style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
                  className={`transition-all duration-500 ${
                    open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                  }`}
                >
                  <Link href={l.href} className="group flex items-baseline gap-4 text-white">
                    <span className={`num text-sm font-bold ${i % 2 === 0 ? "text-glow" : "text-aqua"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-3xl font-black tracking-tight transition-colors group-hover:text-aqua md:text-5xl">
                      {l.label}
                    </span>
                    <span className="font-data hidden text-[0.65rem] uppercase tracking-[0.28em] text-white/60 md:inline">
                      {l.en}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* 右: 事業リンク + 連絡先 */}
            <div
              style={{ transitionDelay: open ? "360ms" : "0ms" }}
              className={`grid content-center gap-8 transition-all duration-500 ${
                open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              <div>
                <p className="eyebrow !text-aqua">Services</p>
                <ul className="mt-2 grid gap-0 md:mt-4 md:gap-2.5">
                  {services.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        className="tap text-sm text-white/70 transition-colors hover:text-white"
                      >
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-white/10 pt-6">
                <p className="eyebrow !text-aqua">Products — 自社プロダクト</p>
                <ul className="mt-2 grid gap-0 md:mt-4 md:gap-2.5">
                  {PRODUCTS.map((p) => (
                    <li key={p.href}>
                      <Link href={p.href} className="tap text-sm text-white/70 transition-colors hover:text-white">
                        {p.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-white/10 pt-6">
                <p className="eyebrow !text-aqua">Free Self-Check — 無料セルフチェック</p>
                <ul className="mt-2 grid gap-0 md:mt-4 md:gap-2.5">
                  {diagnostics.map((d) => (
                    <li key={d.name}>
                      <a
                        href={d.href}
                        target="_blank"
                        rel="noopener"
                        className="tap text-sm text-white/70 transition-colors hover:text-white"
                      >
                        {d.name} ({d.spec}) ↗
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[0.65rem] leading-5 text-white/60">{DIAGNOSIS_NOTE}</p>
              </div>

              <div className="border-t border-white/10 pt-6">
                <p className="eyebrow !text-aqua">Related Sites — 運営サイト</p>
                <ul className="mt-2 grid gap-0 md:mt-4 md:gap-2.5">
                  {RELATED_SITES.map((r) => (
                    <li key={r.href}>
                      <a
                        href={r.href}
                        target="_blank"
                        rel="noopener"
                        className="tap text-sm text-white/70 transition-colors hover:text-white"
                      >
                        {r.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-white/10 pt-6">
                <p className="text-xs leading-6 text-white/50">
                  TEL:{" "}
                  <a href={`tel:${site.tel.replaceAll("-", "")}`} className="tap num text-white hover:text-aqua">
                    {site.tel}
                  </a>
                  <br />
                  受付時間: {site.hours}
                </p>
                <Link href="/privacy" className="tap mt-3 text-[0.65rem] text-white/60 hover:text-white/70">
                  プライバシーポリシー
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}

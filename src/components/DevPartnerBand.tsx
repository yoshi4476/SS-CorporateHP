import Link from "next/link";
import { Reveal } from "@/components/motion";
import { coDeveloper, developer, developerOrg } from "@/lib/developer";

// 開発・事業づくりの相談の入口（2026-10-10 運用者の指示「CONFLUX へのアクセスを良く・目立つように」）。
// 関係は、当社の顧問として AIO 事業とシステム開発事業の責任者を務める YW のサイト（プレスキットと同じ書き方）。
// グループ会社・提携先とは書かない。関係を書いた相互リンクなので、リンクの評価を止める rel は付けない
const PRODUCTS = [
  { name: "ラクシフトAI", href: "/rakushift", co: true },
  { name: "経理システム（セルフ版）", href: "/services/keiri-bpo", co: false },
  { name: "AIO（SEO）対策エージェント", href: "/aio-agent", co: false },
];

const TOPICS = [
  { name: "AI エージェント開発", note: "決まった手順の業務を AI に任せる仕組み", path: "/services/ai-agent-development" },
  { name: "システム開発", note: "業務システム・Web アプリをオーダーメイドで", path: "/services/system-development" },
  { name: "Webサイトの検収チェック", note: "納品されたサイトの公開の設定を14項目で確認", path: "/site-check" },
];

const ARROW = (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
    <path d="M2 7h9M8 3.5L11.5 7 8 10.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

export default function DevPartnerBand() {
  const site = developerOrg.url.replace(/\/$/, "");
  return (
    <section id="partner" className="scroll-mt-24 bg-paper py-20 md:py-28" aria-labelledby="partner-heading">
      <div className="mx-auto max-w-7xl px-5">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-ink text-white shadow-lift">
            <div aria-hidden className="grid-field-dark absolute inset-0" />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse 60% 80% at 90% 10%, rgb(28 63 124 / 0.55), transparent 62%)" }}
            />
            <div className="relative grid gap-10 p-8 md:p-12 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
              <div>
                <p className="eyebrow !text-aqua">開発・事業づくりの相談</p>
                <h2 id="partner-heading" className="mt-4 text-3xl font-black leading-snug tracking-tight md:text-[2.6rem] md:leading-[1.3]">
                  システム開発と事業づくりは、
                  <br className="hidden sm:block" />
                  顧問の{developer.name}へ。
                </h2>
                <p className="mt-6 max-w-xl text-[15px] leading-[1.9] text-white/80 md:text-base">
                  当社の顧問として AIO 事業とシステム開発事業の責任者を務める {developer.name}（{developer.jobTitle}）が手がける{" "}
                  {developerOrg.name} では、オーダーメイドの業務システムや AI エージェントの開発と、経営・AI・開発をまとめた事業の設計の相談を受け付けています。
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <a
                    href={developerOrg.url}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-gold-bright px-6 py-4 text-sm font-bold text-ink shadow-card transition-transform hover:-translate-y-0.5 sm:px-8"
                  >
                    {developerOrg.name} を見る ↗
                  </a>
                  <a
                    href={`${site}/works`}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center justify-center rounded-full border border-white/40 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:border-aqua hover:text-aqua"
                  >
                    開発の実績を見る ↗
                  </a>
                </div>
              </div>

              {/* 図: 当社の3つの製品と、それをつくった開発者のつながり */}
              <figure className="grid content-start gap-4">
                <figcaption className="text-[13px] font-bold tracking-wide text-aqua">当社の製品をつくった開発者です</figcaption>
                <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,0.9fr)] items-center gap-3">
                  <ul className="grid gap-2">
                    {PRODUCTS.map((p) => (
                      <li key={p.href}>
                        <Link
                          href={p.href}
                          className="block rounded-xl border border-white/20 bg-white/[0.06] px-4 py-3 text-sm font-bold text-white transition-colors hover:border-aqua hover:text-aqua"
                        >
                          {p.name}
                          {p.co && <sup className="ml-0.5 text-aqua">*</sup>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <svg width="34" height="120" viewBox="0 0 34 120" aria-hidden className="text-aqua">
                    <path d="M2 20 C 20 20, 18 60, 32 60 M2 60 H32 M2 100 C 20 100, 18 60, 32 60" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                  <div className="rounded-2xl border border-aqua/50 bg-aqua/10 px-4 py-5 text-center">
                    <p className="text-xs text-white/70">開発</p>
                    <p className="mt-1 text-lg font-black">{developer.name}</p>
                    <p className="mt-1 text-xs leading-5 text-white/75">{developerOrg.name}</p>
                  </div>
                </div>
                <p className="text-xs text-white/60">* ラクシフトAI は{coDeveloper.name}との共同開発です。</p>
              </figure>
            </div>

            <ul className="relative grid gap-px border-t border-white/15 bg-white/10 md:grid-cols-3">
              {TOPICS.map((t) => (
                <li key={t.path} className="bg-ink">
                  <a
                    href={`${site}${t.path}`}
                    target="_blank"
                    rel="noopener"
                    className="group flex h-full items-start justify-between gap-4 p-6 transition-colors hover:bg-white/[0.06] md:p-7"
                  >
                    <span>
                      <span className="block font-bold text-white group-hover:text-aqua">{t.name} ↗</span>
                      <span className="mt-1 block text-sm leading-6 text-white/70">{t.note}</span>
                    </span>
                    <span className="mt-1 shrink-0 text-aqua">{ARROW}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

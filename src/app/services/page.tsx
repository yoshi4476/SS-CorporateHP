import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import SenseNetwork from "@/components/SenseNetwork";
import WaveText from "@/components/WaveText";
import { Reveal } from "@/components/motion";
import { CtaBand, SectionHead } from "@/components/ui";
import { services } from "@/lib/services";
import { rakushift } from "@/lib/rakushift";
import { pipeline } from "@/lib/autopipeline";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

// 自社プロダクト。受託の6事業とは性質が違うので別枠で並べる
const PRODUCTS = [
  {
    href: "/rakushift",
    en: "Rakushift AI — SaaS",
    name: rakushift.name,
    catch: rakushift.catch,
    body: "シフト作成を数理最適化AIと生成AIの二段構えで自動化するクラウドサービス。労働基準法を守った配置を数秒で組み上げます。飲食店・小売店・医療介護施設で利用されています。",
    price: "月額3,380円〜",
  },
  {
    href: "/media-pipeline",
    en: `Owned Media Autopilot — ${pipeline.deliverable}`,
    name: pipeline.name,
    catch: pipeline.catch,
    body: "メディアの器と、記事を書いて出し続けるAIエージェントをセットで納品します。キーワード選定から執筆・品質審査・公開・インデックス登録・順位集計まで自動で動きます。",
    price: "個別お見積り",
  },
];

export const metadata: Metadata = {
  title: "事業内容",
  description:
    `セブンセンシズ株式会社の事業内容一覧。AIコンサルティング、システム開発、AI導入補助金支援、AIO運用代行(オウンドメディア×LP)、MEO運用代行(通算3,200店舗)、HP/LP制作の${services.length}事業を一気通貫で提供します。`,
  alternates: { canonical: "/services" },
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "セブンセンシズ株式会社の事業内容",
  itemListElement: services.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: s.name,
    url: `${site.url}/services/${s.slug}`,
  })),
};

export default function ServicesIndexPage() {
  return (
    <>
      <JsonLd
        data={[
          itemListSchema,
          breadcrumbSchema([
            { name: "トップ", path: "/" },
            { name: "事業内容", path: "/services" },
          ]),
        ]}
      />

      {/* ヒーロー */}
      <section className="relative overflow-hidden pt-16 md:pt-20">
        <div aria-hidden className="grid-field absolute inset-0" />
        <WaveText text="SERVICES" className="pointer-events-none absolute -top-2 right-0 select-none text-[13vw] leading-none tracking-tighter opacity-25" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-12 pt-12 md:grid-cols-[1.4fr_1fr] md:pb-16 md:pt-16">
          <div>
            <Reveal>
              <nav aria-label="パンくずリスト" className="text-xs text-slate">
                <ol className="flex flex-wrap items-center gap-2">
                  <li>
                    <Link href="/" className="tap hover:text-pulse">
                      トップ
                    </Link>
                  </li>
                  <li aria-hidden>/</li>
                  <li aria-current="page" className="text-ink">
                    事業内容
                  </li>
                </ol>
              </nav>
              <p className="eyebrow mt-8">Services</p>
              <h1 className="mt-4 text-3xl font-black md:text-6xl">事業内容</h1>
              <p className="mt-7 max-w-2xl text-sm leading-9 text-slate md:text-base">
                戦略 (AIコンサルティング)・実装 (システム開発・HP/LP制作)・集客 (MEO・AIO×オウンドメディア)・資金 (AI導入補助金)。
                <mark className="marker">{services.length}つの事業をひとつのチームで一気通貫</mark>
                に提供するから、窓口はひとつ、責任もひとつ。バラバラに外注したときに起きる「導線の分断」がありません。
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="mx-auto hidden w-full max-w-sm md:block">
            <SenseNetwork className="animate-float h-auto w-full" />
          </Reveal>
        </div>
      </section>

      {/* 各事業の横展開グリッド */}
      <section className="border-t border-line bg-mist py-16 md:py-24" aria-label="事業一覧">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 3) * 0.08}>
                <Link
                  href={`/services/${s.slug}`}
                  className="tilt group flex h-full flex-col rounded-3xl border border-line bg-raise p-7 shadow-card transition-colors duration-500 hover:bg-pulse md:p-8"
                >
                  <div className="flex items-start justify-between">
                    <p className="num text-6xl font-bold text-pulse/30 transition-colors duration-500 group-hover:text-white/25 md:text-7xl" aria-hidden>
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <span className="mt-1 flex h-11 w-11 items-center justify-center rounded-full border border-line transition-all duration-500 group-hover:border-white/40 group-hover:bg-white group-hover:text-pulse">
                      <svg width="16" height="16" viewBox="0 0 14 14" aria-hidden className="transition-transform duration-500 group-hover:-rotate-45">
                        <path d="M2 7h9M8 3.5L11.5 7 8 10.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                      </svg>
                    </span>
                  </div>
                  <p className="font-data mt-3 text-[0.65rem] uppercase tracking-[0.26em] text-pulse transition-colors duration-500 group-hover:text-aqua">
                    {s.en}
                  </p>
                  <h2 className="mt-2 text-xl font-black leading-snug transition-colors duration-500 group-hover:text-white md:text-2xl">
                    {s.name}
                  </h2>
                  <p className="mt-3 text-sm font-bold leading-7 transition-colors duration-500 group-hover:text-white">
                    {s.lead}
                  </p>
                  <p className="mt-2 text-[0.8rem] leading-7 text-slate transition-colors duration-500 group-hover:text-white/75">
                    {s.short}
                  </p>

                  <ul className="mt-4 grid gap-1.5 border-t border-line pt-4 transition-colors duration-500 group-hover:border-white/20">
                    {s.points.slice(0, 3).map((p) => (
                      <li
                        key={p.title}
                        className="flex items-center gap-2 text-[0.78rem] font-medium text-ink transition-colors duration-500 group-hover:text-white/90"
                      >
                        <svg width="11" height="11" viewBox="0 0 14 14" aria-hidden className="shrink-0 text-pulse transition-colors duration-500 group-hover:text-aqua">
                          <path d="M2.5 7.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {p.title}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                    {s.metrics?.[0] ? (
                      <p className="leading-none">
                        <span className="num text-2xl font-bold transition-colors duration-500 group-hover:text-white md:text-3xl">
                          {s.metrics[0].value}
                        </span>
                        <span className="ml-0.5 text-sm font-bold text-pulse transition-colors duration-500 group-hover:text-aqua">
                          {s.metrics[0].suffix}
                        </span>
                        <span className="mt-1.5 block text-[0.6rem] text-slate transition-colors duration-500 group-hover:text-white/60">
                          {s.metrics[0].label}
                        </span>
                      </p>
                    ) : (
                      <span />
                    )}
                    {s.price && (
                      <p className="shrink-0 rounded-full border border-line px-3 py-1.5 text-[0.62rem] font-bold text-slate transition-colors duration-500 group-hover:border-white/30 group-hover:text-white/80">
                        {s.price.split(" /")[0]}
                      </p>
                    )}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* 一気通貫の補足 */}
          <Reveal delay={0.1}>
            <div className="tilt mt-10 grid items-center gap-6 overflow-hidden rounded-3xl bg-ink p-8 text-white md:grid-cols-[1.5fr_1fr] md:p-10">
              <div className="relative">
                <p className="eyebrow !text-aqua">One Team</p>
                <h2 className="mt-3 text-xl font-bold md:text-3xl">
                  {services.length}つの事業は、単品でも。組み合わせれば、もっと。
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-8 text-white/65">
                  「MEOだけ」「補助金だけ」のご依頼も歓迎です。ただ、戦略・実装・集客・資金をひとつのチームで設計すると、施策同士が噛み合い、成果の出る速度が変わります。まずは現状に合う入り口を無料相談でご提案します。
                </p>
              </div>
              <div className="flex flex-col gap-3 md:items-end">
                <Link
                  href="/contact"
                  data-magnetic className="rounded-full bg-aqua px-8 py-4 text-center text-sm font-bold text-ink transition-transform hover:-translate-y-0.5"
                >
                  無料相談で入り口を決める
                </Link>
                <a
                  href={site.lpUrl}
                  target="_blank"
                  rel="noopener"
                  className="text-center text-xs font-bold text-white/60 underline-offset-4 hover:text-white hover:underline md:text-right"
                >
                  AI導入補助金 特設サイト ↗
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 自社プロダクト。受託と違い、そのまま契約できるものをここで並べる */}
      <section className="border-y border-line bg-mist py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            en="Products"
            title="自社で作って、自社で使っているもの"
            lead="受託だけでなく、当社が開発し、自社の現場で毎日動かしているプロダクトがあります。実物を見てからご判断ください。"
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {PRODUCTS.map((p, i) => (
              <Reveal key={p.href} delay={i * 0.08}>
                <Link
                  href={p.href}
                  className="tilt group flex h-full flex-col rounded-3xl border border-line bg-white p-8 shadow-card transition-colors duration-500 hover:border-pulse/40 md:p-10"
                >
                  <p className="font-data text-[0.65rem] uppercase tracking-[0.26em] text-pulse">{p.en}</p>
                  <h3 className="mt-3 text-xl font-black leading-snug group-hover:text-pulse md:text-2xl">
                    {p.name}
                  </h3>
                  <p className="mt-2 text-sm font-bold leading-7 text-ink">{p.catch}</p>
                  <p className="mt-3 flex-1 text-sm leading-8 text-slate">{p.body}</p>
                  <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-5">
                    <span className="rounded-full border border-line px-3 py-1.5 text-[0.62rem] font-bold text-slate">
                      {p.price}
                    </span>
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-pulse">
                      詳しく見る
                      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className="transition-transform group-hover:translate-x-1">
                        <path d="M2 7h9M8 3.5L11.5 7 8 10.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="どの事業から始めるか、一緒に決めましょう。"
        body="現状を伺い、費用対効果の高い順に優先度をつけてご提案します。すべてを一度に始める必要はありません。"
      />
    </>
  );
}

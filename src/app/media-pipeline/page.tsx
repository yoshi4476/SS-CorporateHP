import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { Reveal, CountUp } from "@/components/motion";
import { SectionHead, FaqList, FlowSteps } from "@/components/ui";
import {
  pipeline,
  problems,
  flow,
  running,
  runningNote,
  gate,
  aio,
  includes,
  steps,
  faq,
} from "@/lib/autopipeline";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${pipeline.name}｜LP + AIエージェント`,
  description:
    "オウンドメディアの器と、記事を書いて出し続けるAIエージェントをセットで納品します。キーワード選定から執筆・品質審査・公開・インデックス登録・順位集計まで自動。当社が3サイト・73本を運用中の仕組みです。",
  alternates: { canonical: "/media-pipeline" },
};

export default function MediaPipelinePage() {
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: pipeline.name,
    alternateName: pipeline.nameEn,
    serviceType: "オウンドメディア構築・SEO/AIO運用自動化",
    provider: { "@id": `${site.url}/#organization` },
    areaServed: "JP",
    description: pipeline.summary,
    url: `${site.url}/media-pipeline`,
    offers: { "@type": "Offer", priceCurrency: "JPY", description: "個別お見積り (規模と領域数による)" },
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <JsonLd
        data={[
          serviceLd,
          faqLd,
          breadcrumbSchema([
            { name: "トップ", path: "/" },
            { name: "事業内容", path: "/services" },
            { name: pipeline.name, path: "/media-pipeline" },
          ]),
        ]}
      />

      {/* 看板 */}
      <section className="relative overflow-hidden pt-16 md:pt-20">
        <div aria-hidden className="grid-field absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-10 md:pb-20 md:pt-16">
          <Reveal>
            <nav aria-label="パンくずリスト" className="text-xs text-slate">
              <ol className="flex flex-wrap items-center gap-2">
                <li><Link href="/" className="tap hover:text-pulse">トップ</Link></li>
                <li aria-hidden>/</li>
                <li><Link href="/services" className="tap hover:text-pulse">事業内容</Link></li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="text-ink">{pipeline.name}</li>
              </ol>
            </nav>
            <p className="eyebrow mt-8">Owned Media Autopilot — {pipeline.deliverable}</p>
            <h1 className="mt-4 text-[8vw] font-black leading-[1.24] tracking-tight sm:text-5xl md:text-[3.4rem]">
              書き手を採用せずに、
              <br />
              <span className="text-pulse">メディアを回す。</span>
            </h1>
            <p className="mt-7 max-w-2xl text-sm leading-8 text-slate md:text-base md:leading-9">
              {pipeline.summary}
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/contact"
                data-magnetic
                className="rounded-full bg-pulse px-10 py-4 text-center text-sm font-bold text-white shadow-glow transition-transform hover:-translate-y-0.5"
              >
                無料相談を予約する
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-line-strong px-8 py-4 text-sm font-bold text-ink transition-colors hover:border-pulse hover:text-pulse"
              >
                この仕組みで動いているメディアを見る
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <dl className="mt-12 grid gap-6 border-t border-line pt-8 sm:grid-cols-3">
              {running.map((m) => (
                <div key={m.label}>
                  <dd className="num text-4xl font-bold leading-none text-ink md:text-5xl">
                    <CountUp value={Number(m.value)} />
                    <span className="ml-1 text-base text-pulse">{m.unit}</span>
                  </dd>
                  <dt className="mt-3 text-xs leading-6 text-slate">{m.label}</dt>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-[0.7rem] leading-6 text-faint">{runningNote}</p>
          </Reveal>
        </div>
      </section>

      {/* 課題 */}
      <section className="border-y border-line bg-mist py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            en="Problem"
            title="オウンドメディアは、続かないから効かない"
            lead="記事は積み上がって初めて効きます。止まった時点で、そこまでの投資が回収できなくなります。"
          />
          <ul className="mt-10 grid gap-3 md:grid-cols-2">
            {problems.map((p, i) => (
              <Reveal key={p} delay={i * 0.06}>
                <li className="flex gap-4 rounded-2xl border border-line bg-white px-6 py-5 text-sm leading-7 text-ink-soft shadow-card">
                  <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-pulse" />
                  {p}
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 納品物 */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            en="What you get"
            title="LP と AIエージェントを、セットで納品します"
            lead="器だけ作っても記事が出ません。エージェントだけ渡しても置き場所がありません。両方そろって初めて回ります。"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {includes.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.07}>
                <div className="tilt h-full rounded-3xl border border-line bg-white p-8 shadow-card">
                  <h3 className="text-lg font-bold leading-snug">{c.title}</h3>
                  <p className="mt-4 text-sm leading-8 text-slate">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 毎日動く工程 */}
      <section className="border-y border-line bg-mist py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            en="Pipeline"
            title="毎日、この順番で動いています"
            lead="当社の管制塔が実際に走らせている工程です。人が触るのは、テーマの追加と月次の確認だけです。"
          />
          <ol className="mt-10 grid gap-4">
            {flow.map((f, i) => (
              <Reveal key={f.step} delay={i * 0.05}>
                <li className="grid gap-4 rounded-3xl border border-line bg-white p-7 shadow-card md:grid-cols-[auto_1fr] md:gap-8 md:p-8">
                  <span aria-hidden className="num text-3xl font-bold leading-none text-pulse/30 md:text-4xl">
                    {f.step}
                  </span>
                  <div>
                    <h3 className="text-base font-bold md:text-lg">{f.title}</h3>
                    <p className="mt-3 text-sm leading-8 text-slate">{f.body}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 品質ゲート */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            en="Quality gate"
            title="「AIで量産」と分けているのは、ここです"
            lead="出す前に落とす仕組みがあるかどうかで、メディアの寿命が変わります。"
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {gate.map((g, i) => (
              <Reveal key={g.title} delay={i * 0.08}>
                <div className="h-full rounded-3xl border border-line bg-white p-8 shadow-card">
                  <span aria-hidden className="num text-5xl font-bold text-pulse/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-lg font-bold leading-snug">{g.title}</h3>
                  <p className="mt-4 text-sm leading-8 text-slate">{g.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* AIO */}
      <section className="border-y border-line bg-ink py-16 text-paper md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal>
            <p className="eyebrow !text-aqua">AI Optimization</p>
            <h2 className="mt-4 text-2xl font-black leading-snug md:text-4xl">
              検索結果だけでなく、AIの回答に載るために
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-8 text-paper/70 md:text-base">
              当社はAIO運用代行を事業として提供しています。そこで使っている実装が、そのまま記事に入ります。
            </p>
          </Reveal>
          <ul className="mt-10 grid gap-3 md:grid-cols-2">
            {aio.map((a, i) => (
              <Reveal key={a} delay={i * 0.05}>
                <li className="flex gap-4 rounded-2xl border border-white/12 bg-white/[0.04] px-6 py-5 text-sm leading-7 text-paper/85">
                  <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-aqua" />
                  {a}
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 流れ */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead en="Steps" title="導入の流れ" lead="最初に決めるのは「何を書かないか」です。ここが曖昧だと記事が散らかります。" />
          <div className="mt-10">
            <FlowSteps steps={steps} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-y border-line bg-mist py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-5">
          <SectionHead en="FAQ" title="よくある質問" />
          <div className="mt-10">
            <FaqList items={faq} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-ink py-20 text-paper md:py-28">
        <div aria-hidden className="grid-field-dark absolute inset-0" />
        <div className="relative mx-auto max-w-3xl px-5 text-center">
          <Reveal>
            <p className="eyebrow !text-aqua">Contact</p>
            <h2 className="mt-4 text-2xl font-black leading-snug md:text-4xl">
              この記事も、この仕組みが書いています。
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-paper/70 md:text-base">
              当社の経理BPOブログは、ここで説明した仕組みがそのまま動いています。実物を見てから判断してください。
            </p>
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/contact"
                data-magnetic
                className="rounded-full bg-aqua px-10 py-4 text-sm font-bold text-ink transition-transform hover:-translate-y-0.5"
              >
                無料相談を予約する
              </Link>
              <Link
                href="/blog"
                className="rounded-full border border-paper/30 px-10 py-4 text-sm font-bold text-paper transition-colors hover:border-paper"
              >
                動いているメディアを見る
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

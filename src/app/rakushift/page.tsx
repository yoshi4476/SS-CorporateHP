import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { Reveal, CountUp } from "@/components/motion";
import { SectionHead, FaqList, FlowSteps } from "@/components/ui";
import {
  rakushift,
  problems,
  engine,
  measured,
  measuredNote,
  compliance,
  features,
  industries,
  plans,
  planNote,
  steps,
  faq,
} from "@/lib/rakushift";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${rakushift.name}｜AIシフト自動作成クラウド`,
  description:
    "シフト作成をAIに任せるクラウドサービス。数理最適化と生成AIの二段構えで、労働基準法を守った人員配置を数秒で生成します。飲食店・小売店・医療介護施設向け。月額3,380円から。",
  alternates: { canonical: "/rakushift" },
};

export default function RakushiftPage() {
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: rakushift.name,
    alternateName: rakushift.nameEn,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "シフト管理",
    operatingSystem: "Web",
    url: rakushift.url,
    description: rakushift.summary,
    publisher: { "@id": `${site.url}/#organization` },
    offers: plans.map((p) => ({
      "@type": "Offer",
      name: p.name,
      price: p.priceValue,
      priceCurrency: "JPY",
      description: `${p.limit} / 月額 (税別)`,
      url: rakushift.url,
    })),
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
          appSchema,
          faqLd,
          breadcrumbSchema([
            { name: "トップ", path: "/" },
            { name: "事業内容", path: "/services" },
            { name: rakushift.name, path: "/rakushift" },
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
                <li aria-current="page" className="text-ink">{rakushift.name}</li>
              </ol>
            </nav>
            <p className="eyebrow mt-8">Rakushift AI — 自社SaaS</p>
            <h1 className="mt-4 text-[8vw] font-black leading-[1.24] tracking-tight sm:text-5xl md:text-[3.4rem]">
              シフト作成を、
              <br />
              <span className="text-pulse">AIに任せよう。</span>
            </h1>
            <p className="mt-7 max-w-2xl text-sm leading-8 text-slate md:text-base md:leading-9">
              {rakushift.summary}
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/contact"
                data-magnetic
                className="rounded-full bg-pulse px-10 py-4 text-center text-sm font-bold text-white shadow-glow transition-transform hover:-translate-y-0.5"
              >
                導入について相談する
              </Link>
              <a
                href={rakushift.url}
                target="_blank"
                rel="noopener"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-line-strong px-8 py-4 text-sm font-bold text-ink transition-colors hover:border-pulse hover:text-pulse"
              >
                サービスサイトを見る ↗
              </a>
            </div>
          </Reveal>

          {/* 実測値 */}
          <Reveal delay={0.2}>
            <dl className="mt-12 grid gap-6 border-t border-line pt-8 sm:grid-cols-3">
              {measured.map((m) => (
                <div key={m.label}>
                  <dd className="num text-4xl font-bold leading-none text-ink md:text-5xl">
                    <CountUp value={Number(m.value)} />
                    <span className="ml-1 text-base text-pulse">{m.note === "秒" || m.note === "%" ? m.note : "%"}</span>
                  </dd>
                  <dt className="mt-3 text-xs leading-6 text-slate">{m.label}</dt>
                  {m.note !== "秒" && m.note !== "%" && (
                    <dd className="mt-0.5 text-[0.7rem] font-bold text-pulse">{m.note}</dd>
                  )}
                </div>
              ))}
            </dl>
            <p className="mt-4 text-[0.7rem] leading-6 text-faint">{measuredNote}</p>
          </Reveal>
        </div>
      </section>

      {/* 課題 */}
      <section className="border-y border-line bg-mist py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            en="Problem"
            title="シフト作成は、店長の時間を一番奪う仕事です"
            lead="人が足りない、希望が通らない、法律を守れているか分からない。この3つが同時に起きるから、毎月しんどくなります。"
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

      {/* 仕組み */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            en="How it works"
            title="最適化AIと生成AI、二段構えで組む"
            lead="片方だけでは足りません。条件を満たす配置を数式で解いたうえで、法律の観点から別のAIが確認します。"
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {engine.map((e, i) => (
              <Reveal key={e.step} delay={i * 0.08}>
                <div className="tilt h-full rounded-3xl border border-line bg-white p-8 shadow-card">
                  <span aria-hidden className="num text-5xl font-bold text-pulse/30">{e.step}</span>
                  <h3 className="mt-3 text-lg font-bold leading-snug">{e.title}</h3>
                  <p className="mt-4 text-sm leading-8 text-slate">{e.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 労基法 */}
      <section className="border-y border-line bg-ink py-16 text-paper md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal>
            <p className="eyebrow !text-aqua">Compliance</p>
            <h2 className="mt-4 text-2xl font-black leading-snug md:text-4xl">
              破れない条件として、法律を組み込んでいます
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-8 text-paper/70 md:text-base">
              あとからチェックするのではなく、そもそも違反する配置が解として出てこないように計算しています。
            </p>
          </Reveal>
          <dl className="mt-10 grid gap-4 md:grid-cols-2">
            {compliance.map((c, i) => (
              <Reveal key={c.law} delay={i * 0.06}>
                <div className="rounded-2xl border border-white/12 bg-white/[0.04] px-6 py-5">
                  <dt className="font-data text-[0.65rem] uppercase tracking-[0.2em] text-aqua">{c.law}</dt>
                  <dd className="mt-2 text-sm font-bold leading-7 md:text-base">{c.rule}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* 機能 */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead en="Features" title="現場が毎日使う機能" />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.05}>
                <div className="h-full rounded-2xl border-l-2 border-pulse bg-white py-5 pl-6 pr-5 shadow-card">
                  <h3 className="text-sm font-bold md:text-base">{f.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 業種 */}
      <section className="border-y border-line bg-mist py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead en="Industries" title="こういう現場で使われています" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {industries.map((s, i) => (
              <Reveal key={s.name} delay={i * 0.06}>
                <div className="h-full rounded-2xl border border-line bg-white p-7 shadow-card">
                  <h3 className="text-base font-bold">{s.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 料金 */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead en="Pricing" title="料金" lead="店舗のスタッフ数で選べます。機能はどのプランでも同じです。" />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {plans.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.08}>
                <div
                  className={`tilt relative flex h-full flex-col rounded-3xl p-8 shadow-card ${
                    p.recommended ? "border-2 border-pulse bg-white" : "border border-line bg-white"
                  }`}
                >
                  {p.recommended && (
                    <span className="absolute -top-3 left-8 rounded-full bg-pulse px-4 py-1 text-[0.65rem] font-bold text-white">
                      よく選ばれます
                    </span>
                  )}
                  <p className="font-data text-sm font-bold uppercase tracking-[0.2em] text-pulse">{p.name}</p>
                  <p className="mt-4">
                    <span className="num text-4xl font-bold">{p.price}</span>
                    <span className="ml-1 text-sm text-slate">円 / 月</span>
                  </p>
                  <p className="mt-2 text-sm font-bold text-ink">{p.limit}</p>
                  <p className="mt-4 flex-1 text-sm leading-7 text-slate">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-xs leading-6 text-slate">{planNote}</p>
          <p className="mt-2 text-[0.7rem] leading-6 text-faint">
            契約・解約の条件は
            <a href={rakushift.tokushoho} target="_blank" rel="noopener" className="mx-1 text-pulse underline-offset-4 hover:underline">
              特定商取引法に基づく表記 ↗
            </a>
            をご確認ください。
          </p>
        </div>
      </section>

      {/* 導入の流れ */}
      <section className="border-y border-line bg-mist py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead en="Steps" title="導入の流れ" lead="設定の作り込みは当社で代行します。使い始めるところまで伴走します。" />
          <div className="mt-10">
            <FlowSteps steps={steps} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24">
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
              まず、今のシフトを見せてください。
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-paper/70 md:text-base">
              店舗数・スタッフ数・シフトの組み方を伺えば、そのまま使えるか、設定の作り込みが要るかをその場でお伝えします。
            </p>
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/contact"
                data-magnetic
                className="rounded-full bg-aqua px-10 py-4 text-sm font-bold text-ink transition-transform hover:-translate-y-0.5"
              >
                導入について相談する
              </Link>
              <a
                href={rakushift.url}
                target="_blank"
                rel="noopener"
                className="rounded-full border border-paper/30 px-10 py-4 text-sm font-bold text-paper transition-colors hover:border-paper"
              >
                サービスサイトを見る ↗
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

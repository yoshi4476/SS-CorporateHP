import type { Metadata } from "next";
import Image from "next/image";
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
  useSteps,
  staffRules,
  smart,
  analytics,
  analyticsNote,
  compliance,
  industries,
  plans,
  planNote,
  setupSupport,
  setupSupportItems,
  setupSupportNote,
  steps,
  faq,
} from "@/lib/rakushift";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${rakushift.name}｜AIシフト自動作成クラウド`,
  description:
    "ボタン1つでシフト作成がおわる、AIシフト管理クラウド。数理最適化AIが労働基準法を守ったシフトを数十秒で自動作成します。飲食店・小売店・医療介護施設向け。月額3,380円 (税込)・初期費用0円。",
  alternates: { canonical: "/rakushift" },
};

/** 資料ダウンロードのボタン。ヒーローと末尾の2か所で使う */
function DeckButton({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <a
      href={rakushift.deck}
      download
      className={`inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-bold transition-colors ${
        tone === "dark"
          ? "border border-paper/30 text-paper hover:border-paper"
          : "border border-line-strong text-ink hover:border-pulse hover:text-pulse"
      }`}
    >
      <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden>
        <path d="M8 1.5v9M4.5 7.5L8 11l3.5-3.5M2 13.5h12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      サービス紹介資料 (PDF・{rakushift.deckPages}ページ)
    </a>
  );
}

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
    screenshot: `${site.url}/images/rakushift/shift-table.jpg`,
    offers: plans.map((p) => ({
      "@type": "Offer",
      name: p.name,
      price: p.priceValue,
      priceCurrency: "JPY",
      description: `${p.limit} / 月額 (税込)`,
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
          </Reveal>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
            <div className="min-w-0">
              <Reveal>
                <p className="eyebrow">Rakushift AI — AI × クラウド型シフト管理</p>
                <h1 className="mt-4 text-[8vw] font-black leading-[1.24] tracking-tight sm:text-5xl md:text-[3.2rem]">
                  ボタン1つで、
                  <br />
                  <span className="text-pulse">シフト作成がおわる。</span>
                </h1>
                <p className="mt-7 text-sm leading-8 text-slate md:text-base md:leading-9">
                  {rakushift.summary}
                </p>
                <ul className="mt-7 flex flex-wrap gap-2.5">
                  {["数十秒で自動生成", "労基法を自動遵守", "スマホ完全対応"].map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-pulse/30 bg-pulse/5 px-4 py-2 text-xs font-bold text-pulse"
                    >
                      ✓ {t}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={0.14}>
                <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                  <Link
                    href="/contact"
                    data-magnetic
                    className="rounded-full bg-pulse px-10 py-4 text-center text-sm font-bold text-white shadow-glow transition-transform hover:-translate-y-0.5"
                  >
                    導入について相談する
                  </Link>
                  <DeckButton />
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <figure className="overflow-hidden rounded-3xl border border-line bg-white shadow-lift">
                <Image
                  src="/images/rakushift/dashboard.jpg"
                  alt="ラクシフトAIのダッシュボード画面"
                  width={1600}
                  height={894}
                  priority
                  sizes="(max-width: 1024px) 100vw, 640px"
                  className="h-auto w-full"
                />
              </figure>
            </Reveal>
          </div>

          {/* 導入効果 */}
          <Reveal delay={0.2}>
            <dl className="mt-14 grid gap-8 border-t border-line pt-9 sm:grid-cols-3">
              {measured.map((m) => (
                <div key={m.label}>
                  <dd className="num text-4xl font-bold leading-none text-ink md:text-5xl">
                    <CountUp value={Number(m.value)} />
                    <span className="ml-1 text-base text-pulse">{m.unit}</span>
                  </dd>
                  <dt className="mt-3 text-xs leading-6 text-slate">{m.label}</dt>
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
            title="こんなお悩み、ありませんか?"
            lead="シフト作成は、店長の大きな負担になっています。"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {problems.map((p, i) => (
              <Reveal key={p.no} delay={i * 0.07}>
                <div className="h-full rounded-3xl border border-line bg-white p-8 shadow-card">
                  <span aria-hidden className="num text-4xl font-bold text-pulse/30">{p.no}</span>
                  <h3 className="mt-3 text-lg font-bold">{p.title}</h3>
                  <p className="mt-4 text-sm leading-8 text-slate">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-3xl bg-ink px-8 py-7 text-paper md:flex-row md:items-center md:px-10">
              <p className="text-base font-bold md:text-lg">
                その悩み、<span className="text-aqua">{rakushift.name}</span> がまとめて引き受けます。
              </p>
              <p className="num shrink-0 text-sm text-paper/70">
                シフト作成 月240分 <span className="text-aqua">→ 3分</span>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 使い方3ステップ */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            en="How it works"
            title="使い方は、たった3ステップ"
            lead="むずかしい操作はありません。順番に設定していくだけです。"
          />
          <div className="mt-12 grid gap-14">
            {useSteps.map((s, i) => (
              <Reveal key={s.no} delay={0.05}>
                <div
                  className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${
                    i % 2 === 1 ? "lg:[direction:rtl]" : ""
                  }`}
                >
                  <div className="lg:[direction:ltr]">
                    <p className="font-data text-[0.65rem] uppercase tracking-[0.26em] text-pulse">
                      Step {s.no} — {s.en}
                    </p>
                    <h3 className="mt-3 text-xl font-black md:text-2xl">{s.title}</h3>
                    <p className="mt-5 text-sm leading-8 text-slate md:text-base md:leading-9">{s.body}</p>
                    {s.no === "2" && (
                      <dl className="mt-6 grid gap-2">
                        {staffRules.map((r) => (
                          <div key={r.item} className="flex flex-wrap gap-x-3 gap-y-1 border-b border-line pb-2 text-sm">
                            <dt className="w-40 shrink-0 font-bold text-ink">{r.item}</dt>
                            <dd className="min-w-0 flex-1 text-slate">{r.effect}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </div>
                  <figure className="overflow-hidden rounded-3xl border border-line bg-white shadow-lift lg:[direction:ltr]">
                    <Image
                      src={s.image}
                      alt={s.alt}
                      width={1600}
                      height={894}
                      sizes="(max-width: 1024px) 100vw, 620px"
                      className="h-auto w-full"
                    />
                  </figure>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 完成したシフト表 */}
      <section className="border-y border-line bg-mist py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            en="Output"
            title="完成したシフト表"
            lead="見やすいカレンダー表示。手直しも印刷もPDF保存も自由にできます。"
          />
          <Reveal delay={0.08}>
            <figure className="mt-10 overflow-hidden rounded-3xl border border-line bg-white shadow-lift">
              <Image
                src="/images/rakushift/shift-table.jpg"
                alt="完成したシフト表。スタッフごとに勤務時間がカレンダー形式で並んでいる"
                width={1600}
                height={894}
                sizes="(max-width: 1280px) 100vw, 1200px"
                className="h-auto w-full"
              />
            </figure>
          </Reveal>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {["ドラッグで手直し", "A4印刷 / PDF保存", "並び順ソート", "スマホ対応"].map((t, i) => (
              <Reveal key={t} delay={i * 0.05}>
                <p className="rounded-2xl border border-line bg-white px-6 py-4 text-sm font-bold shadow-card">{t}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 仕組み */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            en="Engine"
            title="なぜ、数十秒で組み上がるのか"
            lead="担当者の勘ではなく、条件を数式に落として解いています。そのうえで別のAIが法令の観点から確認します。"
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

      {/* かしこい機能 */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            en="Smart features"
            title="店長を助ける「かしこい機能」"
            lead="現場のこまかい事情に合わせて、AIがきめ細かく配置します。"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {smart.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.04}>
                <div className="h-full rounded-2xl border-l-2 border-pulse bg-white py-5 pl-6 pr-5 shadow-card">
                  <h3 className="text-sm font-bold md:text-base">{f.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 分析レポート */}
      <section className="border-y border-line bg-mist py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead en="Analytics" title="分析レポートで見える化" lead={analyticsNote} />
          <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
            <ol className="grid gap-3">
              {analytics.map((a, i) => (
                <Reveal key={a} delay={i * 0.06}>
                  <li className="flex gap-4 rounded-2xl border border-line bg-white px-6 py-5 text-sm leading-7 text-ink-soft shadow-card">
                    <span aria-hidden className="num shrink-0 font-bold text-pulse">{i + 1}</span>
                    {a}
                  </li>
                </Reveal>
              ))}
            </ol>
            <Reveal delay={0.1}>
              <figure className="overflow-hidden rounded-3xl border border-line bg-white shadow-lift">
                <Image
                  src="/images/rakushift/report.jpg"
                  alt="分析レポートの画面。人件費・労働時間・スタッフ別構成比のグラフ"
                  width={1600}
                  height={894}
                  sizes="(max-width: 1024px) 100vw, 660px"
                  className="h-auto w-full"
                />
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 業種 */}
      <section className="py-16 md:py-24">
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
      <section className="border-y border-line bg-mist py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            en="Pricing"
            title="料金プラン"
            lead="店舗の規模に合わせて選べる3プラン。税込・初期費用0円です。"
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {plans.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.08}>
                <div
                  className={`tilt relative flex h-full flex-col rounded-3xl p-8 shadow-card ${
                    p.recommended ? "border-2 border-pulse bg-white" : "border border-line bg-white"
                  }`}
                >
                  {p.recommended && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-pulse px-4 py-1 text-[0.65rem] font-bold text-white">
                      ★ 一番人気・おすすめ
                    </span>
                  )}
                  <p className="font-data text-sm font-bold uppercase tracking-[0.2em] text-pulse">{p.name}</p>
                  <p className="mt-1.5 text-xs text-slate">{p.body}</p>
                  <p className="mt-5">
                    <span className="num text-4xl font-bold">{p.price}</span>
                    <span className="ml-1 text-sm text-slate">円 / 月</span>
                  </p>
                  <p className="mt-3 inline-flex self-start rounded-full bg-pulse/10 px-3 py-1 text-xs font-bold text-pulse">
                    {p.limit}
                  </p>
                  <ul className="mt-6 grid flex-1 gap-2.5 border-t border-line pt-5">
                    {p.items.map((it) => (
                      <li key={it} className="flex gap-2.5 text-sm leading-7 text-ink-soft">
                        <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden className="mt-2 shrink-0 text-pulse">
                          <path d="M2.5 7.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-7 text-xs leading-7 text-slate">{planNote}</p>
          <p className="mt-2 text-[0.7rem] leading-6 text-faint">
            契約・解約の条件は
            <a href={rakushift.tokushoho} target="_blank" rel="noopener" className="mx-1 text-pulse underline-offset-4 hover:underline">
              特定商取引法に基づく表記 ↗
            </a>
            をご確認ください。
          </p>
        </div>
      </section>

      {/* 初期設定サポート */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            en="Option"
            title="初期設定サポート"
            lead="面倒な初期設定とスタッフ登録は、まるごと代行できます。"
          />
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
            <ol className="grid gap-3">
              {setupSupportItems.map((c, i) => (
                <Reveal key={c.title} delay={i * 0.06}>
                  <li className="flex gap-5 rounded-2xl border border-line bg-white px-6 py-5 shadow-card">
                    <span aria-hidden className="num shrink-0 text-xl font-bold text-pulse/40">{i + 1}</span>
                    <div>
                      <h3 className="text-sm font-bold md:text-base">{c.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate">{c.body}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
            <Reveal delay={0.1}>
              <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-card">
                <table className="w-full text-sm">
                  <caption className="border-b border-line bg-ink px-6 py-4 text-left text-sm font-bold text-paper">
                    スタッフ数に応じた買い切り (導入時1回のみ)
                  </caption>
                  <tbody>
                    {setupSupport.map((r) => (
                      <tr key={r.staff} className="border-b border-line last:border-0">
                        <th scope="row" className="px-6 py-3.5 text-left font-bold text-ink">{r.staff}</th>
                        <td className="num px-6 py-3.5 text-right font-bold text-pulse">{r.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </div>
          <p className="mt-6 text-xs leading-7 text-slate">{setupSupportNote}</p>
        </div>
      </section>

      {/* 導入の流れ */}
      <section className="border-y border-line bg-mist py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead en="Steps" title="導入の流れ" lead="設定の作り込みは当社で代行できます。使い始めるところまで伴走します。" />
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
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap">
              <Link
                href="/contact"
                data-magnetic
                className="rounded-full bg-aqua px-10 py-4 text-sm font-bold text-ink transition-transform hover:-translate-y-0.5"
              >
                導入について相談する
              </Link>
              <DeckButton tone="dark" />
            </div>
            <a
              href={rakushift.url}
              target="_blank"
              rel="noopener"
              className="mt-6 inline-block text-xs font-bold text-paper/60 underline-offset-4 hover:text-paper hover:underline"
            >
              サービスサイトを見る ↗
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}

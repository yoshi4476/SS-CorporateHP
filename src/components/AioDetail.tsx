import Image from "next/image";
import Link from "next/link";
import { Reveal, CountUp } from "@/components/motion";
import { SectionHead, Rich, FlowSteps } from "@/components/ui";
import {
  glossary,
  layers,
  seoVsAio,
  metrics,
  plans,
  zeroClick,
  ownedMedia,
  approaches,
  tools,
  automation,
  monitored,
  diagnostics,
} from "@/lib/aio";
import { site } from "@/lib/site";

// AIOページ専用の詳細セクション群 (背景データ・用語・実装層・比較・測定・料金)。

export default function AioDetail() {
  return (
    <>
      {/* なぜ今AIOか (ゼロクリック) */}
      <section className="border-t border-line bg-mist py-20 md:py-28" aria-labelledby="why-aio-heading">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            en="Why Now"
            title="検索は「探す」から「AIに聞く」へ"
            lead="検索結果の最上部をAIの回答が占め、クリックせずに答えを得る行動が広がっています。これからの集客は検索順位に加えて、==AIの回答に引用されるか==で決まります。"
          />

          <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-[1fr_1.4fr]">
            <Reveal className="tilt flex flex-col justify-center rounded-3xl border border-line bg-raise p-8 shadow-card md:p-10">
              <p className="font-data text-[0.62rem] uppercase tracking-[0.24em] text-slate">Zero-Click Search</p>
              <p className="mega-num mt-4 text-6xl md:text-7xl">
                <CountUp value={zeroClick.rate} suffix="%" />
              </p>
              <p className="mt-3 text-sm font-bold leading-7">
                の検索が、<mark className="marker">クリックされずに終わる</mark>
              </p>
              <p className="mt-4 text-xs leading-6 text-slate">{zeroClick.note}</p>
              <p className="mt-4 border-t border-line pt-3 text-[0.62rem] text-slate">出典: {zeroClick.source}</p>
            </Reveal>

            {/* SEO vs AIO 比較表 */}
            <Reveal delay={0.1} className="tilt overflow-x-auto rounded-3xl border border-line shadow-card">
              <table className="w-full min-w-[520px] border-collapse bg-raise text-sm">
                <caption className="sr-only">SEOとAIOの違い</caption>
                <thead>
                  <tr className="border-b border-line">
                    <th scope="col" className="w-32 p-5 text-left text-xs font-medium text-slate">比較軸</th>
                    <th scope="col" className="p-5 text-left">
                      <span className="font-data text-base font-bold text-slate">SEO</span>
                    </th>
                    <th scope="col" className="bg-pulse/5 p-5 text-left">
                      <span className="font-data text-base font-bold text-pulse">AIO</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {seoVsAio.map((r) => (
                    <tr key={r.axis} className="border-b border-line last:border-0">
                      <th scope="row" className="p-5 text-left text-xs font-medium text-slate">{r.axis}</th>
                      <td className="p-5 text-xs leading-6 text-slate md:text-sm">{r.seo}</td>
                      <td className="bg-pulse/5 p-5 text-xs font-medium leading-6 text-ink md:text-sm">{r.aio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 引用される構造 */}
      <section className="pt-20 md:pt-28" aria-hidden>
        <div className="mx-auto max-w-7xl px-5">
          <Reveal>
            <Image
              src="/images/aio-citation.png"
              alt="自社サイトの一次情報や構造化データが、AI Overview・ChatGPT・Perplexity・Geminiの回答に引用される流れを示した図"
              width={1200}
              height={660}
              className="h-auto w-full rounded-3xl border border-line shadow-card"
            />
          </Reveal>
        </div>
      </section>

      {/* 用語集 */}
      <section className="py-20 md:py-28" aria-labelledby="glossary-heading">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            en="Glossary"
            title="30秒でわかる、4つの用語"
            lead="AIO・LLMO・SEO・MEO。似ているようで、狙う場所がそれぞれ違います。"
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {glossary.map((g, i) => (
              <Reveal key={g.term} delay={(i % 4) * 0.07}>
                <article className="tilt h-full rounded-2xl border border-line bg-raise p-6 shadow-card">
                  <p className="font-data text-2xl font-bold text-pulse">{g.term}</p>
                  <p className="font-data mt-1 text-[0.6rem] uppercase tracking-[0.16em] text-slate">{g.en}</p>
                  <p className="mt-4 text-xs leading-7 text-slate">{g.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 実装の2層 */}
      <section className="border-y border-line bg-mist py-20 md:py-28" aria-labelledby="layers-heading">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            en="Implementation"
            title="AIOは「技術」と「コンテンツ」の両輪"
            lead="どちらか一方では引用されません。==サイトの構造をAIが読める形に整え==、==引用したくなる中身を用意する==。両方を同時に進めます。"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {layers.map((l, i) => (
              <Reveal key={l.label} delay={i * 0.1}>
                <article className="tilt h-full rounded-3xl border border-line bg-raise p-8 shadow-card">
                  <div className="flex items-baseline gap-3">
                    <span className="num text-3xl font-bold text-pulse/20">0{i + 1}</span>
                    <div>
                      <p className="font-data text-[0.6rem] uppercase tracking-[0.24em] text-pulse">{l.en}</p>
                      <h3 className="mt-1 text-lg font-bold">{l.label}</h3>
                    </div>
                  </div>
                  <ul className="mt-6 grid gap-3 border-t border-line pt-6">
                    {l.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-7">
                        <span aria-hidden className="mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-pulse/10">
                          <svg width="9" height="9" viewBox="0 0 14 14" className="text-pulse">
                            <path d="M2.5 7.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>

          {/* 成果測定 */}
          <Reveal delay={0.15}>
            <div className="tilt mt-6 rounded-3xl border border-line bg-raise p-8 shadow-card">
              <p className="font-data text-[0.6rem] uppercase tracking-[0.24em] text-pulse">Measurement</p>
              <h3 className="mt-2 text-lg font-bold">成果は、4つの指標を併用して測る</h3>
              <p className="mt-3 max-w-3xl text-xs leading-7 text-slate">
                AIOには検索順位のような明確な単一指標がありません。そこで複数の指標を組み合わせ、
                <strong className="font-bold text-ink">単月の数字ではなく傾向で判断</strong>します。
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {metrics.map((m, i) => (
                  <div key={m} className="rounded-xl border border-line bg-mist/60 p-4">
                    <span className="num text-xs font-bold text-pulse">0{i + 1}</span>
                    <p className="mt-1.5 text-xs leading-6">{m}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SEO+AIO運用 / オウンドメディア運用 の使い分け */}
      <section className="py-20 md:py-28" aria-labelledby="owned-media-heading">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            en="Two Approaches"
            title="今あるサイトを直すか、記事で流入をつくるか"
            lead="AIO運用代行には2つの入り口があります。==どちらが上ということはありません==。すでにサイトがあるなら「SEO+AIO運用」、記事で流入そのものをつくるなら「オウンドメディア+LP運用」。両方まとめてお任せいただくこともできます。"
          />

          <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-2">
            {approaches.map((a, i) => (
              <Reveal key={a.key} delay={i * 0.1}>
                <article className="tilt flex h-full flex-col rounded-3xl border border-line bg-raise p-8 shadow-card md:p-10">
                  <div className="flex items-baseline gap-3">
                    <span className="num text-3xl font-bold text-pulse/20">0{i + 1}</span>
                    <div>
                      <p className="font-data text-[0.6rem] uppercase tracking-[0.24em] text-pulse">{a.en}</p>
                      <h3 className="mt-1 text-2xl font-bold">{a.name}</h3>
                    </div>
                  </div>

                  <p className="mt-6 text-lg font-bold leading-8">{a.catch}</p>
                  <p className="mt-3 text-sm leading-8 text-slate">{a.lead}</p>

                  <p className="mt-6 rounded-xl bg-mist px-4 py-3 text-xs font-bold leading-6 text-ink">
                    こんな状態なら: {a.forWhom}
                  </p>

                  <p className="font-data mt-8 text-[0.6rem] uppercase tracking-[0.24em] text-pulse">
                    Scope — 支援内容
                  </p>
                  <ul className="mt-4 grid gap-3 border-t border-line pt-5">
                    {a.scope.map((s) => (
                      <li key={s} className="flex items-start gap-3 text-sm leading-7">
                        <span aria-hidden className="mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-pulse/10">
                          <svg width="9" height="9" viewBox="0 0 14 14" className="text-pulse">
                            <path d="M2.5 7.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        {s}
                      </li>
                    ))}
                  </ul>

                  {a.bonus && (
                    <p className="mt-6 rounded-xl bg-pulse/5 px-4 py-3 text-xs font-bold leading-6 text-pulse">
                      特典: {a.bonus}
                    </p>
                  )}

                  <p className="mt-auto flex items-baseline gap-3 border-t border-line pt-5">
                    <span className="text-xs font-bold text-slate">料金</span>
                    <span className="text-2xl font-bold text-pulse">{a.price}</span>
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          {/* オウンドメディアが機能する理由 */}
          <Reveal delay={0.1}>
            <div className="tilt mt-6 rounded-3xl border border-line bg-mist p-8 shadow-card md:p-10">
              <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
                <div>
                  <p className="font-data text-[0.62rem] uppercase tracking-[0.24em] text-pulse">Why It Works</p>
                  <h3 className="mt-2 text-xl font-bold">{ownedMedia.why.title}</h3>
                  <p className="mt-5 text-sm leading-8 text-slate">
                    <Rich text={ownedMedia.why.body} />
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3 lg:border-l lg:border-line lg:pl-8">
                  {ownedMedia.facts.map((f) => (
                    <div key={f.label}>
                      <p className="leading-none">
                        <span className="num text-3xl font-bold text-ink">{f.value}</span>
                        <span className="ml-1 text-sm font-bold text-pulse">{f.suffix}</span>
                      </p>
                      <p className="mt-2 text-xs font-bold">{f.label}</p>
                      <p className="mt-1 text-[0.65rem] leading-5 text-slate">{f.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* リード獲得までの4段階 */}
          <div className="mt-10">
            <p className="eyebrow">Flow — 記事が問い合わせに変わるまで</p>
            <div className="mt-5">
              <FlowSteps steps={[...ownedMedia.steps]} />
            </div>
          </div>
        </div>
      </section>

      {/* 使用ツール */}
      <section className="border-t border-line bg-mist py-20 md:py-28" aria-labelledby="tools-heading">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            en="Tools"
            title="使用するツール"
            lead="推測ではなく==実測==で運用します。計測はGoogle公式ツールで行い、現在地の把握には自社開発の無料セルフチェックを使います。"
          />

          <div className="mt-12 grid items-start gap-6 lg:grid-cols-[1.15fr_1fr]">
            {/* 計測に使うツール */}
            <Reveal className="tilt overflow-hidden rounded-3xl border border-line bg-raise shadow-card">
              <div className="border-b border-line p-7 md:p-8">
                <p className="font-data text-[0.62rem] uppercase tracking-[0.24em] text-pulse">Measurement</p>
                <h3 className="mt-2 text-lg font-bold">計測・運用に使うツール</h3>
              </div>
              <ul>
                {tools.map((t) => (
                  <li key={t.name} className="border-b border-line p-7 last:border-0 md:p-8">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h4 className="text-base font-bold">{t.name}</h4>
                      <span className="rounded-full bg-pulse/10 px-2.5 py-1 text-[0.62rem] font-bold text-pulse">
                        {t.role}
                      </span>
                    </div>
                    <p className="mt-3 text-xs leading-7 text-slate">{t.detail}</p>
                  </li>
                ))}
              </ul>
              <div className="bg-mist/60 p-7 md:p-8">
                <p className="text-xs font-bold">引用状況を定点観測する対象</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {monitored.map((m) => (
                    <li
                      key={m}
                      className="font-data rounded-full border border-line-strong bg-raise px-3 py-1.5 text-[0.68rem] font-bold text-ink"
                    >
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* 自社の無料診断ツール */}
            <div className="grid gap-4">
              <Reveal delay={0.08}>
                <p className="font-data text-[0.62rem] uppercase tracking-[0.24em] text-pulse">Free Diagnostics</p>
                <h3 className="mt-2 text-lg font-bold">自社開発の無料セルフチェック</h3>
                <p className="mt-3 text-xs leading-7 text-slate">
                  運営メディア「AI集客ラボ」で公開しています。登録不要・その場で結果が出ます。
                </p>
                <p className="mt-3 rounded-xl border border-line bg-raise px-4 py-3 text-xs leading-6 text-slate">
                  簡易的なチェックのため、正確な情報や詳しい内容をお知りになりたい方は
                  <Link href="/contact" className="mx-1 font-bold text-pulse underline-offset-4 hover:underline">
                    ご連絡ください
                  </Link>
                  。無料の現状分析レポートをお渡しします。
                </p>
              </Reveal>
              {diagnostics.map((d, i) => (
                <Reveal key={d.name} delay={0.12 + i * 0.07}>
                  <a
                    href={d.href}
                    target="_blank"
                    rel="noopener"
                    className="tilt group block rounded-2xl border border-line bg-raise p-6 shadow-card transition-colors hover:border-pulse"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <h4 className="text-base font-bold group-hover:text-pulse">{d.name}</h4>
                      <span className="font-data shrink-0 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-slate">
                        {d.spec}
                      </span>
                    </div>
                    <p className="mt-3 text-xs leading-7 text-slate">{d.body}</p>
                    <p className="mt-4 text-[0.68rem] font-bold text-pulse">診断する ↗</p>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>

          {/* 運用を支える自動化 */}
          <div className="mt-10">
            <p className="eyebrow">Automation — 運用を支える自社の仕組み</p>
            <p className="mt-4 max-w-3xl text-sm leading-8 text-slate">
              月60本の記事を、品質を落とさずに出し続けることは手作業では成立しません。
              <mark className="marker">記事の生成から公開まで、問い合わせの受信から記録まで</mark>
              を自社で組んだ仕組みで自動化しているから、この運用量が可能になっています。
            </p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {automation.map((a, i) => (
                <Reveal key={a.name} delay={i * 0.09}>
                  <article className="tilt h-full rounded-2xl border border-line bg-raise p-7 shadow-card">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-data text-xl font-bold text-pulse">{a.name}</h3>
                      <span className="rounded-full bg-pulse/10 px-2.5 py-1 text-[0.62rem] font-bold text-pulse">
                        {a.role}
                      </span>
                    </div>
                    <p className="mt-4 text-xs leading-7 text-slate">{a.detail}</p>
                  </article>
                </Reveal>
              ))}
            </div>
            <p className="mt-5 text-xs leading-7 text-slate">
              ※ このサイト自体が同じ仕組みで動いています。お問い合わせフォームは Google Apps Script で受信し、
              <Link href="/blog" className="mx-1 font-bold text-pulse underline-offset-4 hover:underline">
                経理BPOブログ
              </Link>
              の記事は Python の自動化エンジンが生成・審査して公開しています。
            </p>
          </div>
        </div>
      </section>

      {/* 料金プラン */}
      <section className="py-20 md:py-28" aria-labelledby="plans-heading">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            en="Plans"
            title="診断は無料。まず現在地を知ってから。"
            lead="いきなり運用契約は必要ありません。==サイト診断を無料==で受けて、改善リストだけ持ち帰ることもできます。"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {plans.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.08}>
                <article
                  className={`tilt flex h-full flex-col rounded-3xl border p-7 shadow-card md:p-8 ${
                    p.featured ? "border-pulse bg-pulse text-white" : "border-line bg-raise"
                  }`}
                >
                  {p.featured && (
                    <span className="mb-4 w-fit rounded-full bg-white/20 px-3 py-1 text-[0.6rem] font-bold">
                      おすすめ
                    </span>
                  )}
                  <h3 className={`text-base font-bold ${p.featured ? "text-white" : ""}`}>{p.name}</h3>
                  <p className="mt-4 leading-none">
                    <span className={`num text-4xl font-bold md:text-5xl ${p.featured ? "text-white" : ""}`}>
                      {p.price}
                    </span>
                    <span className={`ml-1 text-sm font-bold ${p.featured ? "text-aqua" : "text-pulse"}`}>
                      {p.unit}
                    </span>
                  </p>
                  <p className={`mt-5 flex-1 text-xs leading-7 ${p.featured ? "text-white/80" : "text-slate"}`}>
                    {p.body}
                  </p>
                  {p.bonus && (
                    <p
                      className={`mt-5 rounded-xl px-4 py-3 text-[0.68rem] font-bold leading-6 ${
                        p.featured ? "bg-white/15 text-white" : "bg-pulse/5 text-pulse"
                      }`}
                    >
                      特典: {p.bonus}
                    </p>
                  )}
                  {p.term && (
                    <p
                      className={`mt-5 border-t pt-4 text-[0.65rem] ${
                        p.featured ? "border-white/20 text-white/70" : "border-line text-slate"
                      }`}
                    >
                      契約期間: {p.term}
                    </p>
                  )}
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/contact"
                data-magnetic
                className="rounded-full bg-pulse px-8 py-4 text-center text-sm font-bold text-white shadow-card transition-transform hover:-translate-y-0.5"
              >
                無料のAIOサイト診断を申し込む
              </Link>
              <a
                href={site.labUrl}
                target="_blank"
                rel="noopener"
                data-magnetic
                className="rounded-full border border-ink/20 px-8 py-4 text-center text-sm font-bold text-ink transition-colors hover:border-pulse hover:text-pulse"
              >
                運営メディア「AI集客ラボ」で学ぶ ↗
              </a>
            </div>
            <p className="mt-5 text-center text-[0.68rem] leading-6 text-slate">
              ※ 料金は2026年7月時点のもので、運営メディア「AI集客ラボ」の集客支援サービスの掲載内容に準じます。
              <br />
              課題も商圏も違うため一律料金にしていません。無料の現状分析の結果をもとに、必要な施策だけを組み合わせてお見積りします。
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}

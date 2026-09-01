import Link from "next/link";
import { Reveal, CountUp } from "@/components/motion";
import { SectionHead } from "@/components/ui";
import { subsidy, eligibility, scheme, cashflow } from "@/lib/subsidy";
import { site } from "@/lib/site";

// 補助金ページ専用の詳細セクション群 (要項・費用シミュレーション・スキーム・お金の流れ)。

export default function SubsidyDetail() {
  const { modelCase } = subsidy;
  const grantRatio = Math.round((modelCase.grant / modelCase.total) * 100);

  return (
    <>
      {/* 取扱いと自社導入。補助金の相談相手を選ぶときに効く事実なので、
          金額の話に入る前に置く */}
      <section className="border-t border-line py-14 md:py-16" aria-labelledby="partner-heading">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal className="rounded-3xl border border-gold/25 bg-gold-tint p-8 shadow-card md:p-10">
            <p className="eyebrow">Partner</p>
            <h2 id="partner-heading" className="mt-3 text-xl font-bold leading-relaxed md:text-2xl">
              当社は<mark className="marker">AXISの代理店登録業者</mark>です
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-8 text-slate md:text-base">
              あわせて当社は「<strong className="font-bold text-ink">AXIS セキュリティパック 端末監視コース</strong>」を
              自社で採用しています。お客様にご案内するものを、まず自社で使っています。
            </p>
            <p className="mt-4 text-xs leading-6 text-faint">
              お取り扱いの範囲と、補助金と組み合わせられるかは、無料相談でご案内します。
            </p>
          </Reveal>
        </div>
      </section>

      {/* 費用シミュレーション */}
      <section className="border-t border-line bg-mist py-20 md:py-28" aria-labelledby="sim-heading">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            en="Simulation"
            title="いくら圧縮できるのか、図で見る"
            lead={`受発注ソフト・会計ソフトを${modelCase.total}万円で導入した場合のモデルケースです (${subsidy.fiscalYear}・${subsidy.asOf})。`}
          />

          <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-[1.5fr_1fr]">
            <Reveal className="rounded-3xl border border-line bg-raise p-7 shadow-card md:p-9">
              <p className="font-data text-[0.62rem] uppercase tracking-[0.24em] text-slate">Model Case</p>

              {/* 積み上げバー */}
              <div className="mt-6">
                <div className="flex items-end justify-between text-xs text-slate">
                  <span>導入費用 (例)</span>
                  <span className="num text-base font-bold text-ink">{modelCase.total}万円</span>
                </div>
                {/* 補助分のバーには白文字を載せるため、グラデーションは濃紺の範囲だけで組む。
                    glow まで伸ばすと明るい側で 3.25:1 まで落ちて基準を割る */}
                <div className="mt-2 flex h-11 overflow-hidden rounded-xl border border-line">
                  <div
                    className="flex items-center justify-center bg-gradient-to-r from-pulse-deep to-pulse text-[0.68rem] font-bold text-white"
                    style={{ width: `${grantRatio}%` }}
                  >
                    補助金 {modelCase.grant}万円
                  </div>
                  <div className="flex flex-1 items-center justify-center bg-mist text-[0.68rem] font-bold text-ink">
                    自己負担 {modelCase.burden}万円
                  </div>
                </div>
                <div className="mt-2 flex justify-between text-[0.62rem] text-slate">
                  <span className="num">{grantRatio}% が補助</span>
                  <span className="num">残り {100 - grantRatio}%</span>
                </div>
              </div>

              <dl className="mt-8 grid gap-4 border-t border-line pt-6 sm:grid-cols-3">
                <div>
                  <dt className="text-[0.65rem] text-slate">導入費用 (例)</dt>
                  <dd className="num mt-1 text-2xl font-bold md:text-3xl">
                    <CountUp value={modelCase.total} />
                    <span className="ml-0.5 text-sm text-slate">万円</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.65rem] text-slate">補助金 (上限)</dt>
                  <dd className="num mt-1 text-2xl font-bold text-pulse md:text-3xl">
                    −<CountUp value={modelCase.grant} />
                    <span className="ml-0.5 text-sm">万円</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.65rem] text-slate">自己負担 (例)</dt>
                  <dd className="num mt-1 text-2xl font-bold md:text-3xl">
                    <CountUp value={modelCase.burden} />
                    <span className="ml-0.5 text-sm text-slate">万円</span>
                  </dd>
                </div>
              </dl>
              <p className="mt-5 text-[0.68rem] leading-6 text-slate">
                ※ 導入費{modelCase.total}万円の場合のモデルケースです。補助額は導入内容と審査結果により変動します
                (補助金は<strong className="font-bold text-ink">精算払い・後払い</strong>です)。
              </p>
            </Reveal>

            {/* 応募要項 4条件 */}
            <Reveal delay={0.1} className="rounded-3xl border border-line bg-raise p-7 shadow-card md:p-9">
              <p className="font-data text-[0.62rem] uppercase tracking-[0.24em] text-slate">Eligibility</p>
              <h3 className="mt-3 text-lg font-bold md:text-xl">対象になる事業者 — 4つの条件</h3>
              <ul className="mt-6 grid gap-4">
                {eligibility.map((e, i) => (
                  <li key={e.label} className="flex gap-4 border-b border-line pb-4 last:border-0 last:pb-0">
                    <span className="num shrink-0 text-sm font-bold text-pulse">0{i + 1}</span>
                    <div>
                      <p className="text-sm font-bold">{e.label}</p>
                      <p className="mt-1 text-xs leading-6 text-slate">{e.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-xl bg-mist p-4 text-[0.68rem] leading-6 text-slate">
                売上が基準に満たない場合も、下位プランでご案内できることがあります。まずはご相談ください。
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* スキーム・期間 */}
      <section className="py-20 md:py-28" aria-labelledby="scheme-heading">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            en="Scheme &amp; Schedule"
            title="申請から着金まで、4フェーズ"
            lead="お客様の事前準備は==合計1.5〜3時間==。申請から着金までは==約2〜3ヶ月==が目安です。"
          />

          {/* 期間バー */}
          <Reveal className="mt-10">
            <div className="overflow-x-auto">
              <div className="flex min-w-[720px] items-stretch gap-1 rounded-xl border border-line bg-raise p-2 shadow-card">
                {[
                  { l: "無料相談", w: 12, tone: "bg-mist" },
                  { l: "準備・申請", w: 20, tone: "bg-pulse/15" },
                  { l: "審査 (約1ヶ月)", w: 30, tone: "bg-pulse/35" },
                  { l: "導入・運用開始", w: 20, tone: "bg-pulse/60" },
                  { l: "実績報告→着金", w: 18, tone: "bg-pulse text-white" },
                ].map((b) => (
                  <div
                    key={b.l}
                    style={{ width: `${b.w}%` }}
                    className={`flex items-center justify-center rounded-lg py-3 text-[0.68rem] font-bold ${b.tone}`}
                  >
                    {b.l}
                  </div>
                ))}
              </div>
              <div className="mt-2 flex min-w-[720px] justify-between text-[0.62rem] text-slate">
                <span className="num">Day 0</span>
                <span className="num">約1ヶ月 — 合格発表</span>
                <span className="num">約2〜3ヶ月 — 着金</span>
              </div>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {scheme.map((s, i) => (
              <Reveal key={s.step} delay={(i % 4) * 0.08}>
                <article className="flex h-full flex-col rounded-2xl border border-line bg-raise p-6 shadow-card">
                  <div className="flex items-baseline justify-between">
                    <span className="num text-3xl font-bold text-gold/40" aria-hidden>{s.step}</span>
                    <span className="rounded-full bg-pulse/10 px-3 py-1 text-[0.6rem] font-bold text-pulse">
                      {s.period}
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-bold">{s.title}</h3>
                  <p className="mt-2 flex-1 text-xs leading-7 text-slate">{s.body}</p>
                  <p className="mt-4 border-t border-line pt-3 text-[0.65rem] text-slate">
                    お客様の作業:{" "}
                    <strong className="font-bold text-ink">{s.client}</strong>
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* お金の流れ */}
      <section className="border-y border-line bg-mist py-20 md:py-28" aria-labelledby="cashflow-heading">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            en="Cash Flow"
            title="お金は、いつ・どちらへ動くのか"
            lead="補助金は==精算払い (後払い)==です。お支払いから着金まで約2〜3ヶ月を見込んだ資金計画をおすすめします。"
          />
          <Reveal delay={0.1} className="mt-10 overflow-x-auto rounded-2xl border border-line shadow-card">
            <table className="w-full min-w-[680px] border-collapse bg-raise text-sm">
              <caption className="sr-only">補助金申請におけるお金の流れ</caption>
              <thead>
                <tr className="border-b border-line bg-mist/60 text-xs text-slate">
                  <th scope="col" className="w-44 p-5 text-left font-medium">タイミング</th>
                  <th scope="col" className="p-5 text-left font-medium">お金の流れ</th>
                  <th scope="col" className="w-40 p-5 text-right font-medium">金額 (例)</th>
                </tr>
              </thead>
              <tbody>
                {cashflow.map((c, i) => (
                  <tr key={c.phase} className="border-b border-line last:border-0">
                    <th scope="row" className="p-5 text-left text-xs font-bold">{c.phase}</th>
                    <td className="p-5 text-xs leading-6 text-slate md:text-sm">{c.flow}</td>
                    <td className={`num p-5 text-right font-bold ${i === 3 ? "text-pulse" : ""}`}>{c.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href={site.lpUrl}
                target="_blank"
                rel="noopener"
                  className="rounded-full bg-pulse px-8 py-4 text-center text-sm font-bold text-white shadow-card transition-transform hover:-translate-y-0.5"
              >
                無料診断で対象か確かめる (8問・3分) ↗
              </a>
              <Link
                href="/contact"
                  className="rounded-full border border-ink/20 px-8 py-4 text-center text-sm font-bold text-ink transition-colors hover:border-pulse hover:text-pulse"
              >
                無料相談を予約する
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

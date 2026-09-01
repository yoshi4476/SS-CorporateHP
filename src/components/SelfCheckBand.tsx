import Link from "next/link";
import { Reveal } from "@/components/motion";
import { diagnostics } from "@/lib/aio";

// 無料セルフチェックへの誘導。
// 「無料相談」はハードルが高いが、その場で終わる自己診断なら踏み出せる。
// 相談前の入口として、目立つ位置に置くための独立セクション。

export default function SelfCheckBand() {
  return (
    <section id="selfcheck" className="relative scroll-mt-24 overflow-hidden border-y border-line bg-ink" aria-labelledby="selfcheck-heading">
      <div
        aria-hidden
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 55% 75% at 82% 15%, rgb(28 63 124 / 0.55), transparent 62%), radial-gradient(ellipse 45% 60% at 10% 92%, rgb(116 199 214 / 0.12), transparent 62%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-5 py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:items-start lg:gap-14">
          <Reveal>
            <p className="font-data text-[0.72rem] uppercase tracking-[0.32em] text-aqua">Free Self-Check</p>
            <h2 id="selfcheck-heading" className="mt-4 text-3xl font-black tracking-tight text-white md:text-5xl">
              相談の前に、
              <br />
              現在地を確かめる。
            </h2>
            <p className="mt-6 max-w-md text-sm leading-8 text-white/70">
              いきなり相談するのは気が重いものです。まずはご自身で、いまの状態を数字で確認してください。
              <strong className="font-bold text-white">登録は不要、その場で結果が出ます。</strong>
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/15 pt-6">
              <span className="font-data text-[0.68rem] uppercase tracking-[0.2em] text-white/50">登録不要</span>
              <span className="font-data text-[0.68rem] uppercase tracking-[0.2em] text-white/50">その場で結果</span>
              <span className="font-data text-[0.68rem] uppercase tracking-[0.2em] text-white/50">費用なし</span>
            </div>
          </Reveal>

          <div className="grid gap-4">
            {diagnostics.map((d, i) => (
              <Reveal key={d.name} delay={0.08 + i * 0.07}>
                <a
                  href={d.href}
                  target="_blank"
                  rel="noopener"
                  className="group flex items-start gap-5 rounded-2xl border border-white/15 bg-white/[0.06] p-6 transition-colors hover:border-aqua/70 hover:bg-white/[0.1] md:p-7"
                >
                  <span className="num shrink-0 pt-0.5 text-sm font-bold text-aqua">0{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-lg font-bold text-white group-hover:text-aqua">{d.name}</span>
                      <span className="font-data rounded-full border border-white/20 px-2.5 py-0.5 text-[0.6rem] uppercase tracking-[0.14em] text-white/60">
                        {d.spec}
                      </span>
                    </span>
                    <span className="mt-2 block text-xs leading-7 text-white/65">{d.body}</span>
                  </span>
                  <span
                    aria-hidden
                    className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 text-white transition-all group-hover:border-aqua group-hover:bg-aqua group-hover:text-ink"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" className="transition-transform group-hover:translate-x-0.5">
                      <path d="M2 7h9M8 3.5L11.5 7 8 10.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  </span>
                </a>
              </Reveal>
            ))}

            <Reveal delay={0.3}>
              <p className="mt-2 text-xs leading-7 text-white/50">
                簡易的なチェックのため、正確な情報や詳しい内容をお知りになりたい方は
                <Link href="/contact" className="mx-1 font-bold text-aqua underline-offset-4 hover:underline">
                  無料相談
                </Link>
                をご利用ください。現状分析レポートをお渡しします。
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

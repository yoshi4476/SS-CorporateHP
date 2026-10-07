import type { CSSProperties } from "react";
import { Reveal } from "@/components/motion";
import { RichLinked } from "@/components/ui";
import type { FlowStep } from "@/lib/services";
import type { Scope } from "@/lib/serviceScope";

// 事業ページの2つの図。どちらも事業のデータ（services.ts の flow・serviceScope.ts）だけから描くので、事業を足せば図も増える。
// 画像にしないのは、図の中の文字を検索とAIに読ませるため（画像の文字は引用されない）。

/** 同じ phase が続く段階を1本の帯にまとめる */
function phaseRuns(steps: FlowStep[]) {
  const runs: { phase: string; start: number; span: number }[] = [];
  steps.forEach((s, i) => {
    if (!s.phase) return;
    const last = runs[runs.length - 1];
    if (last && last.phase === s.phase && last.start + last.span === i) last.span++;
    else runs.push({ phase: s.phase, start: i, span: 1 });
  });
  return runs;
}

/**
 * 進め方の段階図。パソコンでは左から右へ、スマホでは上から下へ、番号の丸を線でつなぐ。
 * 段階のまとまり（phase）があれば、パソコンでは上に帯を出し、スマホでは各段階に小さく添える。
 */
export function StageDiagram({ steps, caption }: { steps: FlowStep[]; caption: string }) {
  const runs = phaseRuns(steps);
  const cols = { "--n": steps.length } as CSSProperties;
  return (
    // 狭い欄で語の途中から折れないよう、文節で折り返す（対応していないブラウザでは今までどおり）
    <figure className="[word-break:auto-phrase]">
      {runs.length > 0 && (
        <div aria-hidden className="mb-4 hidden gap-4 lg:grid lg:grid-cols-[repeat(var(--n),minmax(0,1fr))]" style={cols}>
          {runs.map((r) => (
            <div key={r.start} className="flex items-center gap-3" style={{ gridColumn: `${r.start + 1} / span ${r.span}` }}>
              <span className="shrink-0 text-[13px] font-bold text-gold-deep">{r.phase}</span>
              <span className="h-px flex-1 bg-gold/35" />
            </div>
          ))}
        </div>
      )}
      {/* スマホは段階の間を縦の線でつなぐため、間隔は各段階の下の余白で取る（ol の gap だと線が途切れる） */}
      <ol className="grid lg:grid-cols-[repeat(var(--n),minmax(0,1fr))] lg:gap-4" style={cols}>
        {steps.map((s, i) => {
          const last = i === steps.length - 1;
          return (
            <li key={s.title} className="relative flex gap-4 lg:block">
              {/* 番号の丸と、次の段階へ向かう線（スマホは縦・パソコンは横） */}
              <div aria-hidden className="relative flex w-10 shrink-0 flex-col items-center lg:mb-4 lg:w-full lg:flex-row">
                <span className="num flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pulse text-[15px] font-bold text-white shadow-glow">
                  {i + 1}
                </span>
                {!last && (
                  <>
                    <span className="mt-2 w-px flex-1 bg-line-strong lg:ml-3 lg:mt-0 lg:h-px lg:w-auto" />
                    <svg width="10" height="10" viewBox="0 0 10 10" className="mb-1 rotate-90 text-line-strong lg:mb-0 lg:-ml-1 lg:mr-1 lg:rotate-0">
                      <path d="M2 1.5L7 5 2 8.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </div>
              <div className={`min-w-0 flex-1 rounded-2xl border border-line bg-white p-5 shadow-card md:p-6 lg:h-[calc(100%-3.5rem)] ${last ? "" : "mb-4 lg:mb-0"}`}>
                {s.phase && (
                  <p className="mb-2 text-xs font-bold text-gold-deep lg:sr-only">{s.phase}</p>
                )}
                <h3 className="text-base font-bold leading-relaxed md:text-lg">
                  <span className="sr-only">段階{i + 1}：</span>
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate">{s.body}</p>
                {(s.you || s.out) && (
                  <dl className="mt-4 grid gap-2 border-t border-line pt-4 text-sm leading-6">
                    {s.you && (
                      <div className="flex items-start gap-2.5">
                        <dt className="mt-0.5 shrink-0 rounded-full border border-gold/35 bg-gold-tint px-2.5 py-0.5 text-xs font-bold text-gold-deep">御社</dt>
                        <dd className="text-ink">{s.you}</dd>
                      </div>
                    )}
                    {s.out && (
                      <div className="flex items-start gap-2.5">
                        <dt className="mt-0.5 shrink-0 rounded-full border border-pulse/25 bg-pulse/[0.06] px-2.5 py-0.5 text-xs font-bold text-pulse">受け取るもの</dt>
                        <dd className="text-ink">{s.out}</dd>
                      </div>
                    )}
                  </dl>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <figcaption className="mt-5 text-sm leading-7 text-slate">{caption}</figcaption>
    </figure>
  );
}

/**
 * できること・できないこと。左に引き受けること、右に引き受けないことと代わりに担うところ。
 * 「できないこと」を書くのは、頼んでから「それは対象外」と分かる食い違いを先に消すため。
 */
export function ScopeTable({ name, scope }: { name: string; scope: Scope }) {
  return (
    <Reveal className="grid overflow-hidden rounded-3xl border border-line bg-raise shadow-card [word-break:auto-phrase] md:grid-cols-2">
      <div className="border-t-4 border-t-pulse p-7 md:p-9">
        <h3 className="flex items-center gap-3 text-lg font-bold md:text-xl">
          <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pulse text-white">
            <svg width="14" height="14" viewBox="0 0 14 14">
              <path d="M2.5 7.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          できること
        </h3>
        <p className="mt-2 text-sm leading-7 text-slate">{name}でお引き受けすることです。</p>
        <ul className="mt-5 grid gap-3 border-t border-line pt-5">
          {scope.can.map((c) => (
            <li key={c} className="flex items-start gap-3 text-[15px] leading-7">
              <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" className="mt-[7px] shrink-0 text-pulse">
                <path d="M2.5 7.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {c}
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t-4 border-t-slate bg-mist/70 p-7 md:border-l md:border-l-line md:p-9">
        <h3 className="flex items-center gap-3 text-lg font-bold md:text-xl">
          <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate text-white">
            <svg width="12" height="12" viewBox="0 0 12 12">
              <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          できないこと
        </h3>
        <p className="mt-2 text-sm leading-7 text-slate">このサービスでは行いません。代わりに担うところを添えています。</p>
        <ul className="mt-5 grid gap-4 border-t border-line-strong/60 pt-5">
          {scope.cannot.map((c) => (
            <li key={c.item}>
              <p className="flex items-start gap-3 text-[15px] font-bold leading-7">
                <svg aria-hidden width="12" height="12" viewBox="0 0 12 12" className="mt-[8px] shrink-0 text-slate">
                  <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                {c.item}
              </p>
              <p className="ml-[26px] mt-1 flex items-start gap-2 text-sm leading-7 text-slate">
                <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" className="mt-[7px] shrink-0 text-gold">
                  <path d="M2 7h9M8 3.5L11.5 7 8 10.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                </svg>
                <span>
                  <RichLinked text={c.instead} />
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

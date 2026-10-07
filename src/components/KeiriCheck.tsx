"use client";

// 経理のセルフチェック本体。答えは画面の中だけで持ち、どこにも送らない（個人情報を取らない）。
// 計測は「始めた・結果まで見た・相談へ進んだ」の3つだけ送り、記事→チェック→相談の流れを数える。

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { track } from "@/components/Tracking";
import {
  QUESTIONS,
  RESULTS,
  TOOL_ID,
  firstAnswer,
  fromPath,
  resultOf,
  type ReadLink,
  type ResultKey,
} from "@/lib/keiriCheck";

type Props = {
  /** 結果ごとの次に読む記事。実在する記事だけをページ側で解決して渡す */
  reads: Record<ResultKey, ReadLink[]>;
  lawRead?: ReadLink;
};

export default function KeiriCheck({ reads, lawRead }: Props) {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [shown, setShown] = useState(false);
  const from = useRef("");
  const started = useRef(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // 静的書き出しでは useSearchParams に Suspense 境界が要るため、ContactForm と同じく直接読む
  useEffect(() => {
    from.current = fromPath(window.location.search);
    // 入口で1問目に答えてきた人は、その答えを入れた状態で2問目から始める（同じ問いを2度聞かない）
    const a1 = firstAnswer(window.location.search);
    if (a1 === undefined) return;
    started.current = true;
    track("tool_start", { tool: TOOL_ID, from_path: from.current, via: "entry" });
    const raf = requestAnimationFrame(() => {
      setAnswers({ [QUESTIONS[0].id]: a1 });
      document.getElementById(`q-${QUESTIONS[1].id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const params = () => ({ tool: TOOL_ID, from_path: from.current });
  const answered = QUESTIONS.filter((q) => q.id in answers).length;
  const done = answered === QUESTIONS.length;
  const yesIds = QUESTIONS.filter((q) => answers[q.id]).map((q) => q.id);
  const key = resultOf(yesIds.length);
  const result = RESULTS[key];

  const answer = (id: string, v: boolean) => {
    if (!started.current) {
      started.current = true;
      track("tool_start", params());
    }
    setAnswers((a) => ({ ...a, [id]: v }));
  };

  const showResult = () => {
    setShown(true);
    track("tool_complete", { ...params(), result: key, yes_count: yesIds.length });
    requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const reset = () => {
    setAnswers({});
    setShown(false);
  };

  const links = [...reads[key]];
  if (lawRead && answers.law && !links.some((l) => l.href === lawRead.href)) links.push(lawRead);

  return (
    <div>
      <ol className="grid gap-4">
        {QUESTIONS.map((q, i) => {
          const v = answers[q.id];
          return (
            <li key={q.id} id={`q-${q.id}`} className="scroll-mt-28 rounded-3xl border border-line bg-raise p-6 md:p-7">
              <fieldset>
                <legend className="flex gap-4 text-base font-bold leading-relaxed text-ink">
                  <span className="num shrink-0 text-sm text-pulse">Q{i + 1}</span>
                  <span>{q.q}</span>
                </legend>
                {q.note && <p className="mt-2 pl-9 text-xs leading-6 text-slate">{q.note}</p>}
                <div className="mt-5 flex gap-3 pl-9">
                  {([true, false] as const).map((opt) => {
                    const on = v === opt;
                    return (
                      <button
                        key={String(opt)}
                        type="button"
                        aria-pressed={on}
                        onClick={() => answer(q.id, opt)}
                        className={`tap min-w-24 rounded-full border px-6 py-2.5 text-sm font-bold transition-colors ${
                          on
                            ? "border-pulse bg-pulse text-white"
                            : "border-line-strong bg-white text-ink hover:border-pulse hover:text-pulse"
                        }`}
                      >
                        {opt ? "はい" : "いいえ"}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </li>
          );
        })}
      </ol>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={showResult}
          disabled={!done}
          className="rounded-full bg-pulse px-8 py-4 text-sm font-bold text-white shadow-lift transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          結果を見る
        </button>
        <span className="num text-xs text-slate" aria-live="polite">
          {answered} / {QUESTIONS.length} 問に回答
        </span>
      </div>

      {shown && done && (
        <div ref={resultRef} className="mt-12 scroll-mt-24" aria-live="polite" data-cta-pos="tool-result">
          <div className="rounded-3xl bg-ink px-7 py-8 text-paper md:px-10 md:py-10">
            <p className="text-xs font-bold tracking-widest text-gold-bright">チェックの結果</p>
            <h2 className="mt-3 text-2xl font-black leading-snug md:text-3xl">{result.title}</h2>
            <p className="mt-4 text-sm leading-8 text-paper/75">{result.body}</p>

            {yesIds.length > 0 && (
              <div className="mt-7 border-t border-paper/15 pt-6">
                <p className="text-xs font-bold tracking-widest text-paper/50">「はい」と答えた項目から</p>
                <ul className="mt-3 grid gap-3">
                  {QUESTIONS.filter((q) => answers[q.id]).map((q) => (
                    <li key={q.id} className="flex gap-3 text-sm leading-7 text-paper/80">
                      <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-bright" />
                      <span>{q.ifYes}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/contact?s=keiri-shindan"
                onClick={() => track("tool_to_contact", { ...params(), result: key })}
                className="tap inline-flex items-center rounded-full bg-gold-bright px-6 py-3 text-sm font-bold text-ink transition-transform hover:-translate-y-0.5"
              >
                経理の現状を相談する（無料）
              </Link>
              <button
                type="button"
                onClick={reset}
                className="tap inline-flex items-center rounded-full border border-paper/30 px-6 py-3 text-sm font-bold text-paper transition-colors hover:border-paper"
              >
                もう一度チェックする
              </button>
            </div>
            <p className="mt-4 text-xs leading-6 text-paper/55">
              簡易的なチェックです。どこまで任せられるかは、業務の中身を伺ってから決まります。
            </p>
          </div>

          {links.length > 0 && (
            <div className="mt-8 rounded-3xl border border-line bg-raise p-6 md:p-7">
              <p className="text-xs font-bold tracking-widest text-faint">次に読む記事</p>
              <ul className="mt-4 grid gap-3">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="tap text-sm font-bold leading-relaxed text-pulse underline-offset-4 hover:underline">
                      {l.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


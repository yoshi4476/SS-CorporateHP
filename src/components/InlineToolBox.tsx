"use client";

// 記事の最初の節に置く、セルフチェックへの入口。
// 記事上のCTAは2期間とも0件で、問い合わせしか次の一歩が無かった（2026-10-05）。
// 見えた数と押された数を両方取り、置き場所が読まれているのか・文言が弱いのかを分ける。

import Link from "next/link";
import { useEffect, useRef } from "react";
import { track } from "@/components/Tracking";
import { TOOL_ID } from "@/lib/keiriCheck";

export default function InlineToolBox({ from }: { from: string }) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          track("inline_tool_view", { tool: TOOL_ID });
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Link
      ref={ref}
      href={`/tools/keiri-check?from=${from}`}
      onClick={() => track("inline_tool_click", { tool: TOOL_ID })}
      className="group my-8 flex flex-wrap items-center gap-x-6 gap-y-4 rounded-3xl border border-pulse/20 bg-mist px-6 py-5 transition-colors hover:border-pulse/50 md:px-7"
    >
      <span className="min-w-0 flex-1">
        <span className="block text-base font-black text-ink md:text-lg">経理、外に出すべき？</span>
        <span className="mt-1 block text-sm leading-7 text-slate">5問でわかるセルフチェック（無料・登録不要）</span>
      </span>
      <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-pulse px-5 py-2.5 text-sm font-bold text-white transition-transform group-hover:-translate-y-0.5">
        チェックする
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
          <path d="M2 7h9M8 3.5L11.5 7 8 10.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </span>
    </Link>
  );
}

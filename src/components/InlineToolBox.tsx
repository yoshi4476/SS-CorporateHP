"use client";

// 経理のセルフチェック（/tools/keiri-check）の入口。記事・トップ・経理BPOのページで同じ形を使う。
// 記事に置いていた「経理、外に出すべき？ → チェックする」は、28日で見えた22回・押された0回だった（GA4・2026-10）。
// 押す前に何を聞かれるか分からず、スマホでは見出しが「出すべ/き？」と割れ、記事の要点を読んでいる途中に割り込んでいた。
// 1問目をその場で見せ、「はい・いいえ」を押すとその答えを持ったまま続きの4問へ進む。

import Link from "next/link";
import { useEffect, useRef } from "react";
import { track } from "@/components/Tracking";
import { QUESTIONS, TOOL_ID } from "@/lib/keiriCheck";

type Props = {
  /** 来たページのパス。結果の計測（from_path）に残る */
  from: string;
  /** 記事のときだけ inline_tool_* を送る（管制塔の funnel.py が記事の入口として数えている名前のため） */
  place?: "article" | "top" | "service";
  tone?: "light" | "dark";
};

const Q1 = QUESTIONS[0];

export default function InlineToolBox({ from, place = "article", tone = "light" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const dark = tone === "dark";

  useEffect(() => {
    const el = ref.current;
    if (!el || place !== "article") return;
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
  }, [place]);

  const href = (yes: boolean) => `/tools/keiri-check?from=${encodeURIComponent(from)}&q1=${yes ? 1 : 0}`;
  const onPick = (yes: boolean) => {
    if (place === "article") track("inline_tool_click", { tool: TOOL_ID, answer: yes ? "yes" : "no" });
  };

  return (
    <div
      ref={ref}
      data-cta-pos={place === "article" ? "inline-tool" : undefined}
      className={`rounded-3xl border border-l-4 px-6 py-6 md:px-8 md:py-7 ${
        dark ? "border-white/15 border-l-gold-bright bg-white/[0.06]" : "my-10 border-line border-l-gold bg-raise shadow-card"
      }`}
    >
      <p className={`text-[13px] font-bold tracking-wide ${dark ? "text-gold-bright" : "text-gold-deep"}`}>
        経理のセルフチェック（全5問・無料・登録不要）
      </p>
      <p className={`mt-2 text-[17px] font-black leading-relaxed md:text-lg ${dark ? "text-white" : "text-ink"}`}>
        <span className={`num mr-2 ${dark ? "text-aqua" : "text-pulse"}`}>Q1</span>
        {Q1.q}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {[true, false].map((yes) => (
          <Link
            key={String(yes)}
            href={href(yes)}
            onClick={() => onPick(yes)}
            className={`inline-flex min-h-11 min-w-28 items-center justify-center rounded-full border px-7 py-2.5 text-[15px] font-bold transition-colors ${
              dark
                ? "border-white/40 text-white hover:border-gold-bright hover:bg-gold-bright hover:text-ink"
                : "border-pulse text-pulse hover:bg-pulse hover:text-white"
            }`}
          >
            {yes ? "はい" : "いいえ"}
          </Link>
        ))}
      </div>
      <p className={`mt-4 text-sm leading-7 ${dark ? "text-white/70" : "text-slate"}`}>
        答えると残りの4問へ進み、経理のうち外に出せる範囲の目安が出ます。答えはどこにも送信しません。
      </p>
    </div>
  );
}

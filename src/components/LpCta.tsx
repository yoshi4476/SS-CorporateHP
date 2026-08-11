"use client";

// LPの申し込み導線。
//
// 長いページでは、読み終えるまでCTAが出てこないと申し込みに繋がらない。
// 画面下に追従するバーを出し、最後のCTAが見えたら引っ込める。

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function StickyCta({
  label = "無料相談を予約する",
  note,
}: {
  label?: string;
  note?: string;
}) {
  const [show, setShow] = useState(false);
  const sentinel = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // ヒーローを抜けたら出す。単純なスクロール量ではなく、
    // 目印の要素が画面から外れたかで判定する
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting), { threshold: 0 });
    io.observe(el);

    // 末尾のCTAが見えたら重ねない
    const end = document.getElementById("lp-end-cta");
    let io2: IntersectionObserver | undefined;
    if (end) {
      io2 = new IntersectionObserver(([e]) => { if (e.isIntersecting) setShow(false); }, { threshold: 0.15 });
      io2.observe(end);
    }
    return () => { io.disconnect(); io2?.disconnect(); };
  }, []);

  return (
    <>
      <span ref={sentinel} aria-hidden className="block h-px w-full" />
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 px-4 py-3 shadow-[0_-6px_24px_-18px_rgb(13_20_32/0.4)] backdrop-blur-md transition-transform duration-300 lg:hidden ${
          show ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto flex max-w-md items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.7rem] font-bold text-ink">{note ?? "初期費用0円・相談は無料です"}</p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 rounded-full bg-pulse px-6 py-3 text-xs font-bold text-white shadow-glow"
          >
            {label}
          </Link>
        </div>
      </div>
    </>
  );
}

/** ページ途中に挟む申し込み帯。読み進めた勢いのまま申し込めるようにする */
export function MidCta({
  title,
  body,
  label = "無料相談を予約する",
  sub,
}: {
  title: string;
  body: string;
  label?: string;
  sub?: string;
}) {
  return (
    <section className="border-y border-line bg-ink py-14 text-paper md:py-16">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-7 px-5 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-xl font-black leading-snug md:text-2xl">{title}</h2>
          <p className="mt-3 text-sm leading-8 text-paper/70">{body}</p>
        </div>
        <div className="shrink-0">
          <Link
            href="/contact"
            data-magnetic
            className="inline-block rounded-full bg-aqua px-9 py-4 text-sm font-bold text-ink transition-transform hover:-translate-y-0.5"
          >
            {label}
          </Link>
          {sub && <p className="mt-3 text-center text-[0.7rem] text-paper/50">{sub}</p>}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

// トップの「このページの順番」。ヘッダーの下に止まり、いま読んでいる段に下線が移る。
// 読者が話のどこにいるかを示すための動きで、飾りではない（DESIGN.md 7）。
// スクロールの監視は IntersectionObserver だけ（scroll イベントは使わない）。

export default function StoryNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState<string | null>(null);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).map((e) => e.target.id);
        if (hit.length) setActive(hit[hit.length - 1]);
      },
      // 画面の上から4割の線を越えた段を「いま読んでいる段」とする
      { rootMargin: "-40% 0px -59% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);

  // スマホでは横に流れるので、いまの段を見える位置へ寄せる（ページは動かさない）
  useEffect(() => {
    const ol = list.current;
    const a = active && ol?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!ol || !a) return;
    const left = a.offsetLeft - ol.clientWidth / 2 + a.clientWidth / 2;
    ol.scrollTo({ left, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [active]);

  return (
    <nav aria-label="このページの順番" className="sticky top-16 z-30 border-b border-line bg-paper/95 backdrop-blur-sm md:top-[72px]">
      <ol ref={list} className="mx-auto flex max-w-7xl gap-x-7 overflow-x-auto px-5 text-sm [scrollbar-width:none] md:px-8">
        {items.map((s, i) => {
          const on = active === s.id;
          return (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                data-id={s.id}
                aria-current={on ? "step" : undefined}
                className={`relative flex min-h-12 items-center gap-2 font-bold transition-colors ${on ? "text-ink" : "text-slate hover:text-ink"}`}
              >
                <span className={`num text-[13px] transition-colors ${on ? "text-pulse" : "text-faint"}`}>{i + 1}</span>
                {s.label}
                <span
                  aria-hidden
                  className={`absolute inset-x-0 bottom-0 h-0.5 origin-left bg-pulse transition-transform duration-300 ${on ? "scale-x-100" : "scale-x-0"}`}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

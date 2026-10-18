"use client";

// スクロール連動の横スクロールレール。
// 縦に tall な wrapper の中でパネルを transform でピン留めし、
// 縦スクロール進捗をトラックの横移動 (translateX) に変換する。
// transformのみ使用 = レイアウトシフトなし。慣性スクロールレイヤー内でも動作する。
// タッチ端末・reduced-motion では通常の横スクロール領域にフォールバックする。

import { useEffect, useRef, useState } from "react";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export default function HorizontalRail({
  children,
  heightVh = 320,
}: {
  children: React.ReactNode;
  heightVh?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && !reduce);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const wrap = wrapRef.current;
    const panel = panelRef.current;
    const track = trackRef.current;
    if (!wrap || !panel || !track) return;

    let raf = 0;
    const loop = () => {
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      // ピン留め: wrapper 内でパネルを viewport に固定
      const pin = clamp(-rect.top, 0, rect.height - vh);
      panel.style.transform = `translate3d(0, ${pin}px, 0)`;
      // 進捗 0..1 → 横移動
      const progress = clamp(-rect.top / (rect.height - vh), 0, 1);
      const maxX = Math.max(0, track.scrollWidth - window.innerWidth);
      track.style.transform = `translate3d(${-progress * maxX}px, 0, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [enabled]);

  if (!enabled) {
    return (
      <div className="overflow-x-auto">
        <div className="flex w-max items-stretch gap-6 px-5 py-4">{children}</div>
      </div>
    );
  }

  return (
    <div ref={wrapRef} style={{ height: `${heightVh}vh` }} className="relative">
      <div ref={panelRef} className="flex h-svh items-center overflow-hidden will-change-transform">
        <div ref={trackRef} className="flex w-max items-stretch gap-6 pl-5 pr-24 will-change-transform md:gap-8 md:pl-16">
          {children}
        </div>
      </div>
    </div>
  );
}

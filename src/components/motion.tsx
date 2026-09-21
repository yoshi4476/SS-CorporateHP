"use client";

import { useEffect, useRef, useState } from "react";

// framer-motion をやめた理由: この2部品が ui.tsx 経由で全ページに入り、
// 記事ページでも約120KB（圧縮後41KB）のライブラリを読み、実行に300ms前後かかっていた。
// さらに opacity:0 から始める描画は、JSが動くまで見出しを隠し LCP を遅らせる。
// ここでは「最初の描画では何も隠さず、JSが動いた時点で画面の外にあるものだけを
// 隠して、入ってきたら出す」。見た目の動きは同じで、初回の表示は遅れない。

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight + 80 && r.bottom > -80) return; // 既に見えている＝隠さない
    el.classList.add("rv");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { rootMargin: "-80px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={delay ? { transitionDelay: `${delay}s` } : undefined}>
      {children}
    </div>
  );
}

export function CountUp({
  value,
  suffix = "",
  duration = 1.6,
  className,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const decimals = value % 1 === 0 ? 0 : 1;

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / (duration * 1000), 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay(value * eased);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        setDisplay(0);
        raf = requestAnimationFrame(tick);
      },
      { rootMargin: "-40px 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={`num ${className ?? ""}`}>
      {display.toLocaleString("ja-JP", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

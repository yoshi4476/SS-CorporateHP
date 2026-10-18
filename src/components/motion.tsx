"use client";

import { useEffect, useRef } from "react";

// 区画ごとのフェードインと数字のカウントアップはやめた（DESIGN.md 7）。
// どのページでも同じ入り方が繰り返され、読む前に待たされるだけだった。
// 動かすのは図（棒・線・輪）だけで、画面の外にある図が入ってきたときに1回伸ばす。
// Reveal と CountUp の名前と引数は、管制塔が配る部品（AioResearchData など）が使うので残す。

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const CHART = ".vz-grow, .vz-draw, .vz-ring";

export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  /** 以前の段差の秒数。受け取るが使わない */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || !el.querySelector(CHART)) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return; // 既に見えている図は完成した形のまま
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
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** 数字をそのまま出す。数え上げる動きは、読みたい数字を読ませないだけだった */
export function CountUp({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const decimals = value % 1 === 0 ? 0 : 1;
  return (
    <span className={`num ${className ?? ""}`}>
      {value.toLocaleString("ja-JP", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

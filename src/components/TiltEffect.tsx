"use client";

// サイト全体の3Dチルト。class="tilt" が付いた要素に、
// マウス位置に応じた perspective + rotateX/rotateY を委譲方式で適用する。
// ページ遷移後も再初期化不要。タッチ端末・reduced-motion では無効。

import { useEffect } from "react";

const MAX_DEG = 7;

export default function TiltEffect() {
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    let current: HTMLElement | null = null;

    const reset = () => {
      if (current) {
        current.style.transform = "";
        current = null;
      }
    };

    const onMove = (e: MouseEvent) => {
      const t = (e.target as HTMLElement | null)?.closest?.(".tilt") as HTMLElement | null;
      if (current && current !== t) reset();
      if (!t) return;
      current = t;
      const r = t.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      t.style.transform = `perspective(900px) rotateX(${(-py * MAX_DEG).toFixed(2)}deg) rotateY(${(px * MAX_DEG).toFixed(2)}deg) translateZ(8px)`;
    };

    addEventListener("mousemove", onMove, { passive: true });
    addEventListener("scroll", reset, { passive: true });

    return () => {
      removeEventListener("mousemove", onMove);
      removeEventListener("scroll", reset);
      reset();
    };
  }, []);

  return null;
}

"use client";

// ページ遷移ワイプ: ルートが変わるたびに、インク→ブルーのパネルが
// 画面を下から上へ通過し、中央にロゴマークが一瞬浮かぶ。

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function PageTransition() {
  const pathname = usePathname();
  const first = useRef(true);
  const prev = useRef(pathname);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      prev.current = pathname;
      return;
    }
    if (pathname !== prev.current) {
      prev.current = pathname;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      setTick((t) => t + 1);
    }
  }, [pathname]);

  if (tick === 0) return null;

  return (
    <div key={tick} className="page-wipe is-active" aria-hidden>
      <span className="wipe-mark">
        SEVEN<span style={{ color: "var(--color-aqua)" }}>SENSES</span>
      </span>
    </div>
  );
}

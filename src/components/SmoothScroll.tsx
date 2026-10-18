"use client";

// 慣性スクロール: ネイティブスクロールの上に固定レイヤーを重ね、
// window.scrollY へ lerp で追従させる (transform のみ・レイアウトシフトなし)。
// タッチ端末と prefers-reduced-motion では素通しにする。

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const EASE = 0.09;

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const pathname = usePathname();
  const state = useRef({ current: 0, target: 0 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && !reduce);
  }, []);

  useEffect(() => {
    if (!enabled || !ref.current) return;
    const content = ref.current;
    const html = document.documentElement;
    html.classList.add("has-smooth");

    const setHeight = () => {
      document.body.style.height = `${content.scrollHeight}px`;
    };
    setHeight();
    const ro = new ResizeObserver(setHeight);
    ro.observe(content);

    state.current.current = window.scrollY;
    let raf = 0;
    const loop = () => {
      const s = state.current;
      s.target = window.scrollY;
      s.current += (s.target - s.current) * EASE;
      if (Math.abs(s.target - s.current) < 0.05) s.current = s.target;
      content.style.transform = `translate3d(0, ${-s.current}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      html.classList.remove("has-smooth");
      document.body.style.height = "";
      content.style.transform = "";
    };
  }, [enabled]);

  // ページ遷移時はスクロール位置へ即座にスナップ (遷移アニメの誤差防止)
  useEffect(() => {
    state.current.current = window.scrollY;
  }, [pathname]);

  return (
    <div id="smooth-content" ref={ref}>
      {children}
    </div>
  );
}

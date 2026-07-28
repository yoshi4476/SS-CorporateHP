"use client";

// 初回イントロ: OGPビジュアルを全画面で見せ、カウンター 0→100 の後に上方向へワイプ。
// セッション中は1回のみ。reduced-motion では表示しない。

import Image from "next/image";
import { useEffect, useState } from "react";

const DURATION = 1500; // カウント時間 (ms)

export default function IntroLoader() {
  const [state, setState] = useState<"hidden" | "count" | "done">("hidden");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("ss-intro")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    sessionStorage.setItem("ss-intro", "1");
    setState("count");
    document.documentElement.style.overflow = "hidden";

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / DURATION, 1);
      setCount(Math.round(p * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setState("done");
          document.documentElement.style.overflow = "";
        }, 400);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (state === "hidden") return null;

  return (
    <div className={`intro ${state === "done" ? "is-done" : ""}`} aria-hidden>
      {/* OGPビジュアルを最初の画面として全画面表示 */}
      <Image
        src="/ogp.png"
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      {/* 進捗オーバーレイ */}
      <div className="intro-progress">
        <div className="intro-bar">
          <i style={{ transform: `scaleX(${count / 100})` }} />
        </div>
        <p className="intro-num">
          {String(count).padStart(3, "0")}
          <span>%</span>
        </p>
      </div>
    </div>
  );
}

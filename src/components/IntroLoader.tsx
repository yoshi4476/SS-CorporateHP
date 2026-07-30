"use client";

// 初回イントロ: OGPビジュアルを全画面で見せ、カウンター 0→100 の後に上方向へワイプ。
// セッション中は1回のみ。reduced-motion では表示しない。
//
// カウンターは毎フレーム setState すると React の再描画が60回/秒走り、
// 裏で動く3Dの初期化と重なって画面が固まる。DOMを直接書き換えて再描画を避ける。

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const DURATION = 1500; // カウント時間 (ms)

export default function IntroLoader() {
  const [state, setState] = useState<"hidden" | "count" | "done">("hidden");
  const numRef = useRef<HTMLParagraphElement>(null);
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem("ss-intro")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    sessionStorage.setItem("ss-intro", "1");
    setState("count");
  }, []);

  useEffect(() => {
    if (state !== "count") return;
    document.documentElement.style.overflow = "hidden";

    const start = performance.now();
    let raf = 0;
    let timer = 0;
    let last = -1;

    const tick = (now: number) => {
      const p = Math.min((now - start) / DURATION, 1);
      const n = Math.round(p * 100);
      if (n !== last) {
        last = n;
        if (numRef.current) numRef.current.firstChild!.textContent = String(n).padStart(3, "0");
        if (barRef.current) barRef.current.style.transform = `scaleX(${n / 100})`;
      }
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        timer = window.setTimeout(() => {
          setState("done");
          document.documentElement.style.overflow = "";
        }, 400);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      document.documentElement.style.overflow = "";
    };
  }, [state]);

  if (state === "hidden") return null;

  return (
    <div className={`intro ${state === "done" ? "is-done" : ""}`} aria-hidden>
      {/* OGPビジュアルを最初の画面として全画面表示 */}
      <Image src="/ogp.png" alt="" fill priority className="object-cover" sizes="100vw" />
      {/* 進捗オーバーレイ */}
      <div className="intro-progress">
        <div className="intro-bar">
          <i ref={barRef} style={{ transform: "scaleX(0)" }} />
        </div>
        <p ref={numRef} className="intro-num">
          {"000"}
          <span>%</span>
        </p>
      </div>
    </div>
  );
}

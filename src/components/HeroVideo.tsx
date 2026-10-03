"use client";

// ヒーローの動画。事業ごとの現場（AI検索・経理・店舗集客・住宅・シフト管理・AI導入）が
// ゆっくり動きながら切り替わる、音なしの繰り返し動画。いま映っている事業の名前を、場面の切り替わりに
// 合わせて静かに入れ替える（動画の再生位置から決めるので、遅れてもずれない）。
// 動きを控える設定の人には静止画（最初の場面）だけを出す。動画が読めなくても静止画が残る。

import { useEffect, useRef, useState } from "react";

// 動画の場面と同じ順番・同じ長さ（make_hero_video.py: 1場面5秒・切り替え1秒 → 4秒ごと）
const SCENE_SEC = 4;
const SCENES = [
  { en: "AI Search", ja: "AI検索で、選ばれる会社へ" },
  { en: "Accounting BPO", ja: "経理を、仕組みごと手放す" },
  { en: "Local Marketing", ja: "地域で、見つけてもらう" },
  { en: "Real Estate", ja: "住まい探しの答えに、名前を" },
  { en: "Shift Automation", ja: "シフト作成を、AIに任せる" },
  { en: "AI Adoption", ja: "AI導入を、補助金と一緒に" },
];

export default function HeroVideo({
  className = "",
  objectPosition = "center",
  caption = "none",
}: {
  className?: string;
  objectPosition?: string;
  caption?: "none" | "light" | "dark";
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [still, setStill] = useState(false);
  const [i, setI] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setStill(mq.matches);
      if (mq.matches) ref.current?.pause();
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v || caption === "none") return;
    // 場面が半分ほど入れ替わったところ（切り替えの真ん中）で名前を変える
    const tick = () => setI(Math.floor((v.currentTime + 0.5) / SCENE_SEC) % SCENES.length);
    v.addEventListener("timeupdate", tick);
    return () => v.removeEventListener("timeupdate", tick);
  }, [caption, still]);

  const media = still ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/videos/hero-poster.webp" alt="" className={`h-full w-full object-cover ${className}`} style={{ objectPosition }} />
  ) : (
    <video
      ref={ref}
      className={`h-full w-full object-cover ${className}`}
      style={{ objectPosition }}
      poster="/videos/hero-poster.webp"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
    >
      <source src="/videos/hero.webm" type="video/webm" />
      <source src="/videos/hero.mp4" type="video/mp4" />
    </video>
  );

  if (caption === "none") return media;
  const s = SCENES[i];
  // スマホ（light）は写真の上なので、日本語の一文だけを半透明の帯に載せる（英語を並べると折り返して読めない）
  if (caption === "light") {
    return (
      <>
        {media}
        <div aria-live="off" className="pointer-events-none absolute left-4 top-4 z-[6]">
          <div key={i} className="hero-scene-caption flex items-center gap-2.5 rounded-full bg-ink/55 px-3.5 py-1.5 text-white backdrop-blur-sm">
            <span className="flex gap-1" aria-hidden>
              {SCENES.map((_, n) => (
                <span key={n} className={`h-[3px] rounded-full transition-all duration-700 ${n === i ? "w-4 bg-aqua" : "w-1.5 bg-white/40"}`} />
              ))}
            </span>
            <span className="text-[0.72rem] font-bold tracking-wide">{s.ja}</span>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      {media}
      <div aria-live="off" className="pointer-events-none absolute right-8 top-28 z-[6] lg:right-14">
        <div key={i} className="hero-scene-caption flex items-center gap-3 rounded-full bg-raise/70 px-4 py-2 text-ink shadow-card backdrop-blur-md">
          <span className="flex gap-1" aria-hidden>
            {SCENES.map((_, n) => (
              <span key={n} className={`h-[3px] rounded-full transition-all duration-700 ${n === i ? "w-6 bg-aqua" : "w-2 bg-current opacity-30"}`} />
            ))}
          </span>
          <span className="font-data text-[0.6rem] uppercase tracking-[0.28em] opacity-70">{s.en}</span>
          <span className="text-sm font-bold tracking-wide">{s.ja}</span>
        </div>
      </div>
    </>
  );
}

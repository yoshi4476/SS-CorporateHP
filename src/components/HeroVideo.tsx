"use client";

// ヒーローの全画面動画。ある街の一日（夜明け → 出勤 → オフィス → 商店街 → 夕方の住宅街 → 夜）を
// 実写調の場面でつなぎ、その時間に動いている業種の名前を場面に合わせて入れ替える。
// 名前は動画の再生位置から決めるので、読み込みが遅れても場面とずれない。
// 動きを控える設定の人には静止画（最初の場面）と、全業種の一覧だけを出す。

import { useEffect, useRef, useState } from "react";

// 動画と同じ順番・同じ長さ（make_hero_video3.py: 4.5秒ごとに次の場面へ1.5秒かけて切り替わる）
const SCENE_SEC = 4.5;
const FADE_MID = 0.75;
export const STORY = [
  { time: "05:40", beat: "街が、目を覚ます", industries: ["製造業", "物流", "建設"] },
  { time: "08:30", beat: "人が動き出し、検索も動き出す", industries: ["BtoB・SaaS", "士業", "コンサル"] },
  { time: "10:00", beat: "オフィスで、仕事が始まる", industries: ["経理", "総務", "人事・シフト"] },
  { time: "15:30", beat: "お店に、人が来る", industries: ["飲食店", "美容室", "クリニック", "歯科医院"] },
  { time: "18:00", beat: "帰り道に、住まいを探す", industries: ["不動産", "工務店", "リフォーム"] },
  { time: "21:00", beat: "夜も、仕組みは働き続ける", industries: ["AI検索", "口コミ", "問い合わせ"] },
];

export default function HeroVideo({ objectPosition = "center" }: { objectPosition?: string }) {
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
    if (!v) return;
    const n = STORY.length;
    const tick = () => setI(((Math.floor((v.currentTime - FADE_MID) / SCENE_SEC) % n) + n) % n);
    v.addEventListener("timeupdate", tick);
    return () => v.removeEventListener("timeupdate", tick);
  }, [still]);

  const s = STORY[i];
  return (
    <>
      {still ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/videos/hero-poster.webp" alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition }} />
      ) : (
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover"
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
      )}

      {/* 場面の字幕: 時刻・その時間の出来事・その時間に動いている業種 */}
      {!still && (
        <div aria-hidden className="pointer-events-none absolute bottom-24 right-5 z-[6] max-w-[19rem] text-right text-white md:bottom-24 md:right-10 md:max-w-md lg:right-14">
          <div key={i} className="hero-scene-caption">
            <p className="flex items-center justify-end gap-3">
              <span className="flex gap-1">
                {STORY.map((_, n) => (
                  <span key={n} className={`h-[3px] rounded-full transition-all duration-700 ${n === i ? "w-6 bg-aqua" : "w-2 bg-white/40"}`} />
                ))}
              </span>
              <span className="num text-sm font-bold tracking-[0.2em] text-aqua">{s.time}</span>
            </p>
            <p className="mt-2 text-sm font-bold tracking-wide text-white/85 md:text-base">{s.beat}</p>
            <p className="mt-3 flex flex-wrap justify-end gap-x-4 gap-y-1 text-2xl font-black leading-tight tracking-tight md:text-4xl">
              {s.industries.map((w) => (
                <span key={w} className="[text-shadow:0_2px_24px_rgb(0_0_0/0.45)]">{w}</span>
              ))}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

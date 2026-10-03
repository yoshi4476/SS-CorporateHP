"use client";

// ヒーローの全画面動画。ある街の一日（夜明け → 出勤 → オフィス → 商店街 → 夕方の住宅街 → 夜）を
// 実写調の場面でつなぎ、その現場で当社が引き受けていることと対応業種を、場面に合わせて入れ替える。
// 名前は動画の再生位置から決めるので、読み込みが遅れても場面とずれない。
// 動きを控える設定の人には静止画（最初の場面）と、全業種の一覧だけを出す。

import { useEffect, useRef, useState } from "react";

// 動画と同じ順番・同じ長さ（make_hero_video3.py: 4.5秒ごとに次の場面へ1.5秒かけて切り替わる）
const SCENE_SEC = 4.5;
const FADE_MID = 0.75;
// 場面ごとに「その時間に動いている現場」と「そこで当社が引き受けていること」を対にする。
// 業種だけを並べると何の話か分からなかったため、支援の中身と事業名を必ず添える
export const STORY = [
  { time: "05:40", beat: "街が、目を覚ます", job: "受発注・在庫・日報を、システムで自動に", service: "システム開発", href: "/services/system-development", industries: ["製造業", "卸売業", "物流", "建設"] },
  { time: "08:30", beat: "通勤の間に、比べて調べる", job: "AIの答えに、御社の名前が出るように", service: "AIO運用代行", href: "/services/aio", industries: ["BtoB・SaaS", "士業", "コンサル"] },
  { time: "10:00", beat: "オフィスで、仕事が始まる", job: "記帳・請求・給与を、まとめて代行", service: "経理BPO", href: "/services/keiri-bpo", industries: ["中小企業", "士業事務所", "医療法人"] },
  { time: "15:30", beat: "お店に、人が来る", job: "地図と口コミで、選ばれる店に", service: "MEO運用代行", href: "/services/meo", industries: ["飲食店", "美容室", "クリニック", "歯科医院"] },
  { time: "18:00", beat: "帰り道に、住まいを探す", job: "比べる段階で、名前が挙がる会社に", service: "AIO運用代行・HP制作", href: "/services/aio", industries: ["不動産", "工務店", "リフォーム"] },
  { time: "21:00", beat: "閉店後も、仕組みは働く", job: "AIの導入を、補助金で費用を抑えて", service: "AI導入補助金の支援", href: "/services/ai-subsidy", industries: ["全業種", "その他の業種も全国対応"] },
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

  // 動画はページの読み込みが終わってから読む（最初の画面は軽い静止画で出す）。
  // 全画面の動画を先に読むと、スマホで主要部分が出るまで5秒かかっていた。スマホには小さい動画を渡す
  const [src, setSrc] = useState<{ webm: string; mp4: string } | null>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (still) return;
    const small = window.matchMedia("(max-width: 900px)").matches;
    const pick = () => setSrc(small ? { webm: "/videos/hero-m.webm", mp4: "/videos/hero-m.mp4" } : { webm: "/videos/hero.webm", mp4: "/videos/hero.mp4" });
    const later = () => window.setTimeout(pick, 600);
    if (document.readyState === "complete") later();
    else window.addEventListener("load", later, { once: true });
    return () => window.removeEventListener("load", later);
  }, [still]);
  useEffect(() => {
    const v = ref.current;
    if (!v || !src) return;
    v.load();
    v.play().catch(() => {});
  }, [src]);

  const s = STORY[i];
  return (
    <>
      {/* 最初に出す静止画（主要部分）。スマホは小さい版を読む */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/videos/hero-poster.webp"
        srcSet="/videos/hero-poster-960.webp 960w, /videos/hero-poster.webp 1600w"
        sizes="100vw"
        alt="朝の大阪の街並み"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition }}
      />
      {!still && (
        <video
          ref={ref}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${playing ? "opacity-100" : "opacity-0"}`}
          style={{ objectPosition }}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          onPlaying={() => setPlaying(true)}
        >
          {src && <source src={src.webm} type="video/webm" />}
          {src && <source src={src.mp4} type="video/mp4" />}
        </video>
      )}

      {/* 場面の字幕: 時刻と場面 → その現場で当社が引き受けていること（事業名つき） → 対応業種 */}
      {!still && (
        <div className="absolute bottom-20 right-4 z-[6] w-[min(22rem,calc(100%-2rem))] md:bottom-24 md:right-10 md:w-[25rem] lg:right-14">
          <div key={i} className="hero-scene-caption rounded-2xl border border-white/15 bg-ink/55 p-4 text-white shadow-lift backdrop-blur-md md:p-5">
            <p className="flex items-center gap-3 text-xs">
              <span className="num font-bold tracking-[0.18em] text-aqua">{s.time}</span>
              <span className="font-bold text-white/80">{s.beat}</span>
              <span className="ml-auto flex gap-1" aria-hidden>
                {STORY.map((_, n) => (
                  <span key={n} className={`h-[3px] rounded-full transition-all duration-700 ${n === i ? "w-5 bg-aqua" : "w-1.5 bg-white/35"}`} />
                ))}
              </span>
            </p>
            <p className="mt-3 border-t border-white/15 pt-3 text-[0.62rem] font-bold tracking-[0.18em] text-white/55">この現場で、当社が引き受けていること</p>
            <p className="mt-1.5 text-lg font-black leading-snug md:text-xl">{s.job}</p>
            <a href={s.href} className="mt-1 inline-flex min-h-9 items-center gap-1.5 text-xs font-bold text-aqua hover:underline">
              {s.service}
              <span aria-hidden>→</span>
            </a>
            <p className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-[0.62rem] font-bold text-white/55">対応業種</span>
              {s.industries.map((w) => (
                <span key={w} className="rounded-full bg-white/12 px-2.5 py-1 text-[0.7rem] font-bold">{w}</span>
              ))}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

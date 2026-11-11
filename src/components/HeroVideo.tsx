"use client";

// ヒーローの全画面の写真。ある街の一日（夜明け → 通勤 → 事務所 → 商店街 → 帰り道 → 閉店後）を
// 6 枚の写真でつなぎ、その現場で当社が引き受けていることと対応業種を、場面に合わせて入れ替える。
// 以前は作った動画（夕方の光の映像）を流していたが、作り物に見え、スマホで 1.6MB を読んでいた。
// いまは人の顔と表情が見える写真を 4.5 秒ごとに切り替える（最初の 1 枚だけ先に読み、残りは読み込みの後）。
// 動きを控える設定の人には最初の 1 枚と、全業種の一覧だけを出す。写真はイメージ。

import { useEffect, useState } from "react";

// 場面を切り替える間隔（秒）
const SCENE_SEC = 4.5;
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
  const [still, setStill] = useState(false);
  const [i, setI] = useState(0);
  // 2 枚目からは、ページの読み込みが終わってから読む（最初の画面は 1 枚目だけで出す）
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setStill(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (still) return;
    const later = () => window.setTimeout(() => setReady(true), 600);
    if (document.readyState === "complete") later();
    else window.addEventListener("load", later, { once: true });
    return () => window.removeEventListener("load", later);
  }, [still]);

  useEffect(() => {
    if (still || !ready) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % STORY.length), SCENE_SEC * 1000);
    return () => window.clearInterval(id);
  }, [still, ready]);

  const s = STORY[i];
  return (
    <>
      {STORY.map((scene, n) =>
        n === 0 || (ready && !still) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={scene.time}
            src={`/videos/hero-scene-${n + 1}.webp`}
            srcSet={`/videos/hero-scene-${n + 1}-960.webp 960w, /videos/hero-scene-${n + 1}.webp 1600w`}
            sizes="100vw"
            alt={n === 0 ? "朝の商店街で、届いた荷物を確かめる店主と配達の担当者" : ""}
            aria-hidden={n === 0 ? undefined : true}
            fetchPriority={n === 0 ? "high" : "low"}
            loading={n === 0 ? "eager" : "lazy"}
            decoding={n === 0 ? "sync" : "async"}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ${n === i ? "opacity-100" : "opacity-0"}`}
            style={{ objectPosition }}
          />
        ) : null,
      )}

      {/* 場面の字幕: 時刻と場面 → その現場で当社が引き受けていること（事業名つき） → 対応業種。
          スマホでは見出し・ボタン・数字の下に重なり、最初の画面を詰まらせていたので出さない */}
      {!still && (
        <div className="absolute bottom-24 right-10 z-[6] hidden w-[25rem] md:block lg:right-14">
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
            <p className="mt-3 border-t border-white/15 pt-3 text-xs font-bold tracking-[0.18em] text-white/55">この現場で、当社が引き受けていること</p>
            <p className="mt-1.5 text-lg font-black leading-snug md:text-xl">{s.job}</p>
            <a href={s.href} className="mt-1 inline-flex min-h-9 items-center gap-1.5 text-xs font-bold text-aqua hover:underline">
              {s.service}
              <span aria-hidden>→</span>
            </a>
            <p className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-xs font-bold text-white/55">対応業種</span>
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

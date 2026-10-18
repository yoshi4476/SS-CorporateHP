"use client";

import { useState } from "react";
import { track } from "@/components/Tracking";
import { mapInfo } from "@/lib/site";

/**
 * 地図は押したときだけ読む。Googleマップは1枚で数百KBあり、最初から埋め込むと
 * 会社概要ページの表示が遅くなる。押す前の面は、夜の街区図のような方眼と座標で組む
 * （このサイトの濃紺×アクアの面と揃える）。
 */
export default function MapFacade() {
  const [state, setState] = useState<"idle" | "loading" | "ready">("idle");

  return (
    <div className="map-facade relative isolate min-h-[320px] overflow-hidden rounded-2xl border border-white/10 bg-ink shadow-lift max-md:order-first max-md:min-h-[300px]">
      <div aria-hidden className="map-grid absolute -inset-[20%] -rotate-[9deg]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(60% 55% at 50% 46%, transparent 35%, rgb(13 20 32 / 0.85) 100%)" }}
      />
      <span aria-hidden className="absolute left-4 top-3.5 z-[2] text-[11px] font-bold tracking-[0.2em] text-aqua/80">
        大阪市東成区 神路
      </span>
      <span aria-hidden className="map-pin absolute left-1/2 top-[44%] z-[2] -ml-[9px] -mt-[9px] size-[18px] rounded-full bg-aqua max-md:top-[36%]" />
      <span
        aria-hidden
        className="absolute left-1/2 top-[calc(44%+22px)] z-[2] -translate-x-1/2 whitespace-nowrap rounded-md bg-white/95 px-2.5 py-0.5 text-xs font-bold text-ink max-md:top-[calc(36%+22px)]"
      >
        セブンセンシズ
      </span>

      {state === "idle" && (
        <button
          type="button"
          onClick={() => {
            setState("loading");
            track("map_load");
          }}
          className="absolute bottom-5 left-1/2 z-[3] grid min-h-11 -translate-x-1/2 justify-items-center gap-0.5 rounded-xl border border-white/15 bg-white/95 px-6 py-2.5 text-sm font-bold text-ink backdrop-blur transition-colors hover:text-pulse focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua"
        >
          地図を表示する
          <small className="whitespace-nowrap text-[11px] font-medium text-slate">Googleマップを読み込みます</small>
        </button>
      )}

      {state !== "idle" && (
        <iframe
          src={mapInfo.embed}
          title="セブンセンシズ株式会社の地図（Googleマップ）"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          onLoad={() => setState("ready")}
          className={`absolute inset-0 z-[4] size-full border-0 transition-opacity duration-500 motion-reduce:transition-none ${
            state === "ready" ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}

// 最初の画面の写真。持ち場で働く1人を右に置いた1枚だけを敷く（写真はイメージ）。
// 以前は6枚を4.5秒ごとに切り替え、右下に場面ごとの案内板を出していたが、
// 見出し・ボタンと押す所を取り合い、切り替わるたびに人物の顔が見出しの下に来ていた。
// スマホの縦長の切り抜きでは人物のいない左側を見せる（globals.css の .hero-scene）。

import type { CSSProperties } from "react";

export default function HeroVideo({ objectPosition = "center" }: { objectPosition?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/videos/hero-scene-1.webp"
      srcSet="/videos/hero-scene-1-960.webp 960w, /videos/hero-scene-1.webp 1600w"
      sizes="100vw"
      alt="町工場の事務所で、検品を終えた部品の箱を前に納品書を確かめる人"
      fetchPriority="high"
      loading="eager"
      decoding="sync"
      className="hero-scene absolute inset-0 h-full w-full object-cover"
      style={{ "--hero-pos": objectPosition } as CSSProperties}
    />
  );
}

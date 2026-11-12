// 最初の画面の写真。持ち場で働く1人を右に置いた1枚だけを敷く（写真はイメージ）。
// 以前は6枚を4.5秒ごとに切り替え、右下に場面ごとの案内板を出していたが、
// 見出し・ボタンと押す所を取り合い、切り替わるたびに人物の顔が見出しの下に来ていた。
// スマホでは文字の背景に敷かない（HeroBand）。以前は縦長の切り抜きで人物のいない左側を見せていたが、
// 最初の画面に空の棚と暗い床しか写らず、何の写真か分からなかった。

import type { CSSProperties } from "react";

const SRC = "/videos/hero-scene-1.webp";
const SRCSET = "/videos/hero-scene-1-960.webp 960w, /videos/hero-scene-1.webp 1600w";
const ALT = "町工場の事務所で、検品を終えた部品の箱を前に納品書を確かめる人";

/** パソコン: 最初の画面の全面に敷く */
export default function HeroVideo({ objectPosition = "center" }: { objectPosition?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={SRC}
      srcSet={SRCSET}
      sizes="100vw"
      alt={ALT}
      fetchPriority="high"
      loading="eager"
      decoding="sync"
      className="absolute inset-0 hidden h-full w-full object-cover md:block"
      style={{ objectPosition } as CSSProperties}
    />
  );
}

/** スマホ: 主のボタンの下に、人物が真ん中に来る切り抜きの帯として出す */
export function HeroBand() {
  return (
    <figure className="relative -mx-5 mt-8 aspect-[4/3] overflow-hidden md:hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={SRC}
        srcSet={SRCSET}
        sizes="200vw"
        alt={ALT}
        fetchPriority="high"
        loading="eager"
        className="absolute inset-0 h-full w-full object-cover object-[100%_25%]"
      />
      <figcaption className="absolute bottom-2 left-3 rounded bg-ink/60 px-1.5 py-0.5 text-[11px] text-white/90">※ 写真はイメージです</figcaption>
    </figure>
  );
}

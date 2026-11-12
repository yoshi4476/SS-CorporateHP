"use client";

import { useState } from "react";

// 経理BPOの説明動画。動画の表紙の画像（ai.7senses.co.jp の *-poster.jpg）は2本とも同じ絵で、
// 製品名も「KEIRI 経理クラウド」とページの呼び名（経理システム（セルフ版））が違っていた。
// 表紙はページの側で描き、2本の違いが表紙だけで分かるようにする。押すまで動画は読み込まない。

type Props = { video: string; kind: string; title: string };

export default function KeiriVideo({ video, kind, title }: Props) {
  const [playing, setPlaying] = useState(false);
  if (playing) {
    return (
      <video controls autoPlay preload="auto" className="aspect-video w-full rounded-2xl border border-line bg-ink">
        <source src={`https://ai.7senses.co.jp/videos/${video}.mp4`} type="video/mp4" />
        お使いのブラウザでは動画を再生できません。
      </video>
    );
  }
  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative flex aspect-video w-full flex-col justify-between overflow-hidden rounded-2xl border border-line bg-ink p-5 text-left text-white md:p-7"
      aria-label={`動画を再生する: ${kind}「${title}」`}
    >
      <span aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_70%_90%_at_90%_10%,rgb(28_63_124/0.7),transparent_70%)]" />
      <span className="relative text-xs font-bold text-aqua">{kind}</span>
      <span className="relative text-lg font-black leading-snug md:text-2xl">{title}</span>
      <span className="relative flex items-center gap-3 text-sm font-bold">
        <span aria-hidden className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-bright text-ink transition-transform group-hover:scale-105">
          <svg width="14" height="16" viewBox="0 0 14 16">
            <path d="M1 1.5v13L13 8z" fill="currentColor" />
          </svg>
        </span>
        再生する（約10分）
      </span>
    </button>
  );
}

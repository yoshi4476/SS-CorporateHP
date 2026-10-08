"use client";
// プレスキットの文章をコピーするボタン。同じ「コピー」が並ぶため、何をコピーするかを読み上げ用の名前で区別する。
// 調査ページの CiteCopy.tsx は管制塔が自動で置き直すファイルなので、そちらは触らずに別に持つ。
import { useState } from "react";

export default function CopyButton({ text, name }: { text: string; name: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      aria-label={`${name}をコピー`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 2000);
        } catch {
          setDone(false);
        }
      }}
      className="tap shrink-0 rounded-full border border-pulse px-4 py-1.5 text-sm font-bold text-pulse transition-colors hover:bg-pulse hover:text-white"
    >
      <span aria-live="polite">{done ? "コピーしました" : "コピー"}</span>
    </button>
  );
}

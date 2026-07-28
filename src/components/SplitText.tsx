"use client";

// 文字分割: 単語(.w)→文字(.ch) に分割し、1文字ずつ立ち上げる。
// 元テキストは aria-label で保持。CJK を含む語は改行を許可する。

import { useEffect, useRef } from "react";

const hasCJK = (s: string) => /[　-鿿豈-﫿]/.test(s);

export default function SplitText({
  text,
  className = "",
  delay = 0,
  startIndex = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
  startIndex?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-inview");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("is-inview");
            io.disconnect();
          }
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  let i = startIndex;
  const words = text.split(/(\s+)/).filter(Boolean);

  return (
    <span
      ref={ref}
      className={`split ${className}`}
      aria-label={text}
      style={{ "--d": `${delay}s` } as React.CSSProperties}
    >
      {words.map((word, wi) => {
        if (/^\s+$/.test(word)) return " ";
        return (
          <span key={wi} className="w" style={hasCJK(word) ? { whiteSpace: "normal" } : undefined} aria-hidden>
            {[...word].map((ch, ci) => (
              <span key={ci} className="ch" style={{ "--i": i++ } as React.CSSProperties}>
                {ch}
              </span>
            ))}
          </span>
        );
      })}
    </span>
  );
}

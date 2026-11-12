"use client";

import { useEffect, useRef } from "react";

// framer-motion をやめた理由: この2部品が ui.tsx 経由で全ページに入り、
// 記事ページでも約120KB（圧縮後41KB）のライブラリを読み、実行に300ms前後かかっていた。
// さらに opacity:0 から始める描画は、JSが動くまで見出しを隠し LCP を遅らせる。
// ここでは「最初の描画では何も隠さず、JSが動いた時点で画面の外にあるものだけを
// 隠して、入ってきたら出す」。見た目の動きは同じで、初回の表示は遅れない。

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// 見張りは全部の Reveal で共有し、位置は自分で測らない。
// 以前は部品ごとに getBoundingClientRect で位置を測ってから隠す印を付けていたため、開いた瞬間に
// 「測る → 印を付ける → 次の部品が測る（レイアウトのやり直し）」が部品の数だけ（トップで 25、全体で 180 か所）続いていた。
// いまは 1 つ目の見張り（画面の上下 80px 外まで）が最初の報告で「見えている／いない」を教え、
// 見えていない部品にだけ隠す印を付けて、2 つ目の見張り（画面の内側 80px）に渡す。
let first: IntersectionObserver | null = null;
let enter: IntersectionObserver | null = null;

function watch(el: Element) {
  if (!enter) {
    enter = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          enter?.unobserve(e.target);
        }
      },
      { rootMargin: "-80px 0px" },
    );
  }
  if (!first) {
    first = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          first?.unobserve(e.target);
          if (e.isIntersecting) continue; // 既に見えている＝隠さない
          e.target.classList.add("rv");
          enter?.observe(e.target);
        }
      },
      { rootMargin: "80px 0px" },
    );
  }
  first.observe(el);
}

function unwatch(el: Element) {
  first?.unobserve(el);
  enter?.unobserve(el);
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    watch(el);
    return () => unwatch(el);
  }, []);

  return (
    <div ref={ref} className={className} style={delay ? { transitionDelay: `${delay}s` } : undefined}>
      {children}
    </div>
  );
}

// 数字は数え上げずに確定の値で出す（名前は呼び出し側との互換で残す）。
// 数え上げの途中を見た人・撮った画面に 3,186件・93% のような別の数字が出て、同じページの 3,200件・94% と食い違って見えた
export function CountUp({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const decimals = value % 1 === 0 ? 0 : 1;
  return (
    <span className={`num ${className ?? ""}`}>
      {value.toLocaleString("ja-JP", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

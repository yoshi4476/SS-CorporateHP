"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Hero3DCanvas = dynamic(() => import("./Hero3DCanvas"), {
  ssr: false,
  loading: () => null,
});

export default function Hero3D({
  className,
  offset,
}: {
  className?: string;
  offset?: [number, number, number];
}) {
  // Three.js の読み込みと初期化は重く、ハイドレーション直後に走らせると
  // 初回表示が数秒固まる。手が空いてから積むことで引っ掛かりをなくす。
  const [ready, setReady] = useState(false);

  useEffect(() => {
    type IdleWindow = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const w = window as IdleWindow;
    const start = () => setReady(true);

    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(start, { timeout: 2000 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(start, 600);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className={className} aria-hidden>
      {ready && <Hero3DCanvas offset={offset} />}
    </div>
  );
}

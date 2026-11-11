"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * スマホの画面の下に付いてくる相談のボタン。
 * ページが長く（トップ・事業のページで 26,000px 以上）、途中で相談したくなってもメニューを開くしかなかった。
 * 最初の画面（そこには主のボタンがある）・フォーム・フッターが見えている間と、相談のページでは出さない
 */
export default function MobileCta() {
  const path = usePathname();
  const [past, setPast] = useState(false);
  const [covered, setCovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const seen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) seen.add(e.target);
        else seen.delete(e.target);
      }
      setCovered(seen.size > 0);
    });
    document.querySelectorAll("main form, footer").forEach((el) => io.observe(el));
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, [path]);

  if (path.startsWith("/contact")) return null;
  const show = past && !covered;
  // 経理BPOのページは、ページの中に相談フォームがあるのでそこへ下ろす
  const keiri = /^\/services\/keiri-bpo(\.html)?\/?$/.test(path);
  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur transition-transform duration-300 md:hidden ${
        show ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
    >
      <Link
        href={keiri ? "#consult" : "/contact"}
        tabIndex={show ? 0 : -1}
        data-cta="mobile_sticky"
        className="block rounded-full bg-gold-bright px-6 py-3.5 text-center text-sm font-bold text-ink"
      >
        {keiri ? "経理の外注を無料で相談する" : "無料相談を予約する"}
      </Link>
      <p className="mt-1.5 text-center text-[11px] text-white/65">営業のお電話はしません</p>
    </div>
  );
}

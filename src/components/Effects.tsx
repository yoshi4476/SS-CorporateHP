"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import SmoothScroll from "@/components/SmoothScroll";

// 演出（ページ遷移・慣性スクロール）は、検索から記事に着地した人には要らない。
// 記事・お知らせでは出さず、JSも読まない。会社案内側では ssr:false で後から読む（最初の描画を止めない）。
// 初回の読み込みの幕（IntroLoader）とカーソルを追う丸（Cursor）は外した（2026-11-11 の画面の点検:
// トップの見出しが約3秒隠れ、出来合いの飾りに見えていた。動きは1ページ1つまで）。
const PageTransition = dynamic(() => import("@/components/PageTransition"), { ssr: false });

const PLAIN = ["/blog", "/news"];

export default function Effects({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  if (PLAIN.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return <>{children}</>;
  }
  return (
    <>
      <PageTransition />
      <SmoothScroll>{children}</SmoothScroll>
    </>
  );
}

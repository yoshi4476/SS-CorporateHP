"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import SmoothScroll from "@/components/SmoothScroll";

// 演出（カーソル・ページ遷移・イントロ・慣性スクロール）は、検索から記事に
// 着地した人には要らない。framer-motion ごと約150KBのJSを先に読み、イントロは
// 初回訪問の1.5秒間、画面を覆ってスクロールも止めていた（記事ページの LCP が
// 3秒を超えていた主因）。記事・お知らせでは出さず、JSも読まない。
// 会社案内側では ssr:false で後から読む（最初の描画を止めない）。
const Cursor = dynamic(() => import("@/components/Cursor"), { ssr: false });
const PageTransition = dynamic(() => import("@/components/PageTransition"), { ssr: false });
const IntroLoader = dynamic(() => import("@/components/IntroLoader"), { ssr: false });

const PLAIN = ["/blog", "/news"];

export default function Effects({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  if (PLAIN.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return <>{children}</>;
  }
  return (
    <>
      <Cursor />
      <PageTransition />
      {pathname === "/" && <IntroLoader />}
      <SmoothScroll>{children}</SmoothScroll>
    </>
  );
}

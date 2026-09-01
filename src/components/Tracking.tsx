"use client";

// GA4 には gtag('config') しか入っておらず、page_view しか送られていなかった。
// フォーム送信・資料ダウンロード・電話タップ・外部診断への遷移が1件も
// 計測されていないため、78ページのどれがリードを生んでいるのか分からない。
//
// ページ側に手を入れると数十箇所を触ることになるので、
// クリックを document で1回だけ拾う。

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** GA4へ送る。タグが未読み込み・未設定でも落ちないようにする */
export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", event, { ...params, page_path: window.location.pathname });
}

export default function Tracking() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!(a instanceof HTMLAnchorElement)) return;
      const href = a.getAttribute("href") ?? "";
      const label = (a.textContent ?? "").trim().slice(0, 60);

      if (href.startsWith("tel:")) {
        track("phone_click", { link_text: label });
        return;
      }
      if (href.endsWith(".pdf")) {
        track("file_download", { file_name: href.split("/").pop(), link_text: label });
        return;
      }
      // 自己診断とLPは別ドメインなので、離脱ではなく前進として数える
      if (/^https?:\/\/(ai|lp)\.7senses\.co\.jp/.test(href)) {
        track("diagnosis_click", { link_url: href, link_text: label });
        return;
      }
      // どのページが問い合わせまで運んだかを見るため、遷移も拾う
      if (href.startsWith("/contact")) {
        track("contact_intent", { link_text: label });
      }
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}

"use client";

// GA4 には gtag('config') しか入っておらず、page_view しか送られていなかった。
// フォーム送信・資料ダウンロード・電話タップ・外部診断への遷移が1件も
// 計測されていないため、78ページのどれがリードを生んでいるのか分からない。
//
// ページ側に手を入れると数十箇所を触ることになるので、
// クリックを document で1回だけ拾う。
//
// 入口（相談・資料・ツール・診断）を押したら cta_click を送る。cta_id は「ページの種類_位置_行き先」で、
// どのページのどの場所のボタンが押されたかを分けて数える（以前はボタンの ID が無く、場所を区別できなかった）。
// diagnosis_click は診断の入口だけに送る。以前は AI集客ラボ・補助金LP への単なるサイトリンクも入っていた。
// diagnosis_click は cta_click と同時に飛ぶので、足し合わせない（管制塔の data_sanity.CO_FIRED と同じ扱い）。

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

type Kind = "contact" | "doc" | "tool" | "diagnosis";

/** ページの種類。cta_id の頭に付ける */
function pageKind(path: string): string {
  const seg = path.split("/").filter(Boolean);
  if (!seg.length) return "top";
  if (seg[0] === "services") return seg[1] ? `svc-${seg[1]}` : "services";
  if (seg[0] === "blog") return seg[1] === "theme" ? "blog-theme" : seg[1] ? "article" : "blog";
  if (seg[0] === "tools") return seg[1] ?? "tools";
  return seg[0];
}

/** 押した場所。data-cta-pos を最優先し、無ければヘッダー・フッター・最初の区画（ヒーロー）・区画の id */
function position(el: Element): string {
  const box = el.closest(
    "[data-cta-pos], header, footer, main > section:first-of-type, section[id], aside[id], section[aria-labelledby]",
  );
  if (!box) return "body";
  const tagged = box.getAttribute("data-cta-pos");
  if (tagged) return tagged;
  const tag = box.tagName.toLowerCase();
  if (tag === "header" || tag === "footer") return tag;
  if (box.matches("main > section:first-of-type")) return "hero";
  return box.id || (box.getAttribute("aria-labelledby") ?? "body").replace(/-heading$/, "");
}

const LAB_DIAGNOSES = new Set(["ai-check", "aio-check", "url-check", "meo-check"]);

/** 入口なら [種類, 行き先] を返す。単なるサイト内外のリンクは null（数えない） */
function classify(href: string, text: string): [Kind, string] | null {
  if (href.startsWith("tel:")) return ["contact", "tel"];
  if (href.startsWith("mailto:")) return ["contact", "mail"];
  let u: URL;
  try {
    u = new URL(href, window.location.origin);
  } catch {
    return null;
  }
  const self = u.origin === window.location.origin;
  if (self && u.pathname === "/contact") {
    const s = u.searchParams.get("s");
    return ["contact", s ? `contact-${s}` : "contact"];
  }
  if (u.pathname.endsWith(".pdf")) return ["doc", `pdf-${u.pathname.split("/").pop()!.replace(/\.pdf$/, "")}`];
  if (self && u.pathname === "/tools/keiri-check") {
    const q1 = u.searchParams.get("q1");
    return ["tool", q1 ? `keiri-check-q1-${q1 === "1" ? "yes" : "no"}` : "keiri-check"];
  }
  if (self && u.hash === "#selfcheck") return ["tool", "selfcheck"];
  if (u.hostname === "ai.7senses.co.jp") {
    const m = /^\/tools\/([a-z0-9-]+)\/?$/.exec(u.pathname);
    if (m && LAB_DIAGNOSES.has(m[1])) return ["diagnosis", `lab-${m[1]}`];
    if (m) return ["tool", `lab-${m[1]}`];
    if (/^\/tools\/?$/.test(u.pathname)) return ["tool", "lab-tools"];
    if (/^\/download\/?$/.test(u.pathname)) return ["doc", "lab-checklist"];
    return null;
  }
  // 補助金LPは同じURLでサイトへのリンクと診断の入口の両方に使われている。診断の入口は文言に「診断」がある
  if (u.hostname === "lp.7senses.co.jp" && text.includes("診断")) return ["diagnosis", "subsidy-shindan"];
  return null;
}

function ctaId(el: Element, dest: string): string {
  return el.closest("[data-cta]")?.getAttribute("data-cta") || `${pageKind(window.location.pathname)}_${position(el)}_${dest}`;
}

export default function Tracking() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!(a instanceof HTMLAnchorElement)) return;
      const href = a.getAttribute("href") ?? "";
      const label = (a.textContent ?? "").trim().slice(0, 60);

      const hit = classify(href, label);
      if (hit) {
        const [kind, dest] = hit;
        track("cta_click", { cta_id: ctaId(a, dest), cta_kind: kind, link_url: a.href, link_text: label });
        if (kind === "diagnosis") track("diagnosis_click", { link_url: a.href, link_text: label });
      }

      if (href.startsWith("tel:")) {
        track("phone_click", { link_text: label });
        return;
      }
      if (href.endsWith(".pdf")) {
        track("file_download", { file_name: href.split("/").pop(), link_text: label });
        return;
      }
      // どのページが問い合わせまで運んだかを見るため、遷移も拾う
      if (href.startsWith("/contact")) {
        track("contact_intent", { link_text: label });
      }
    };

    // URLを入れる診断はリンクではなくフォームなので、送信を別に拾う（どの場所から試したか）
    const onSubmit = (e: SubmitEvent) => {
      const f = e.target as HTMLFormElement | null;
      const src = f?.dataset?.scan;
      if (!f || !src) return;
      track("cta_click", { cta_id: ctaId(f, "lab-url-scan"), cta_kind: "diagnosis", link_url: f.action, scan_src: src });
      track("diagnosis_click", { link_url: f.action, link_text: "AIO診断(URL)", scan_src: src });
    };

    document.addEventListener("click", onClick, { capture: true });
    document.addEventListener("submit", onSubmit, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("submit", onSubmit, { capture: true });
    };
  }, []);

  return null;
}

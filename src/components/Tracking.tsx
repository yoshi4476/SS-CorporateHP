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

// 区画の到達（ヒートマップ）: data-area を持つ要素が25%見えたら section_view_<区画> と area_reach を1回送る。
// 名前の規則は AI集客ラボ（管制塔の site/js/site.js）と同じ。GA4 のイベント名は英数字と _ だけ・40字までなので、
// 区画の名前は data-area-id（英字）から slugId で作る（管制塔の report_heat.slug_id・exit_fix が同じ規則で読む）。
// 以前は区画の印が1つも無く、どこで読者が離れるかを測れていなかった（2026-10、section_view_* が0件）。
//
// data-cta を付けたリンクは、行き先が相談・資料・ツールでなくても数える（事業ページへの案内など）。
// 付けていないリンクは前と同じく入口だけを数える。

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { entryOf, saveEntry, withEntry } from "@/lib/entry";

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

/** 管制塔の site/js/site.js の slugId()・scripts/report_heat.py の slug_id() と同じ規則。片方だけ変えないこと */
export function slugId(s: string | null | undefined): string {
  return String(s ?? "").replace(/[^\w]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 30) || "x";
}

type Kind = "contact" | "doc" | "tool" | "diagnosis" | "nav";

/** ページの種類。cta_id の頭に付ける */
function pageKind(path: string): string {
  const seg = path.split("/").filter(Boolean);
  if (!seg.length) return "top";
  if (seg[0] === "services") return seg[1] ? `svc-${seg[1]}` : "services";
  if (seg[0] === "blog") return seg[1] === "theme" ? "blog-theme" : seg[1] ? "article" : "blog";
  if (seg[0] === "tools") return seg[1] ?? "tools";
  return seg[0];
}

/** 押した場所。data-cta-pos を最優先し、次に区画の印（data-area-id）、無ければヘッダー・フッター・最初の区画（ヒーロー）・区画の id */
function position(el: Element): string {
  const box = el.closest(
    "[data-cta-pos], [data-area-id], header, footer, main > section:first-of-type, section[id], aside[id], section[aria-labelledby]",
  );
  if (!box) return "body";
  const tagged = box.getAttribute("data-cta-pos") || box.getAttribute("data-area-id");
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

/** data-cta を付けた、入口でないリンクの行き先の名前（/services/keiri-bpo → svc-keiri-bpo） */
function navDest(href: string): string {
  try {
    const u = new URL(href, window.location.origin);
    if (u.origin !== window.location.origin) return u.hostname.split(".")[0];
    return pageKind(u.pathname);
  } catch {
    return "link";
  }
}

/** ページの中の data-area を見張り、25%見えたら1回だけ到達を送る。ページを移るたびに描かれた区画を拾い直す */
function useAreaReach(path: string) {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const seen = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          // 画面の4倍より長い区画（事業一覧など）は25%が一度に見えることがない。画面の半分を占めたら届いたと数える
          if (!e.isIntersecting) continue;
          if (e.intersectionRatio < 0.25 && e.intersectionRect.height < window.innerHeight * 0.5) continue;
          const el = e.target;
          const name = el.getAttribute("data-area");
          const id = slugId(el.getAttribute("data-area-id") || name);
          track(`section_view_${id}`, { area_name: name });
          track("area_reach", { area_name: name, area_id: id });
          io.unobserve(el);
        }
      },
      { threshold: [0, 0.01, 0.02, 0.05, 0.1, 0.25] },
    );
    const scan = () => {
      document.querySelectorAll("[data-area]").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        io.observe(el);
      });
    };
    scan();
    // ページの切り替えの演出（PageTransition）で、区画が少し遅れて描かれることがある
    const t = window.setTimeout(scan, 1200);
    return () => {
      window.clearTimeout(t);
      io.disconnect();
    };
  }, [path]);
}

export default function Tracking() {
  useAreaReach(usePathname());

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!(a instanceof HTMLAnchorElement)) return;
      const label = (a.textContent ?? "").trim().slice(0, 60);
      // 入口の印（data-entry-*）があれば、行き先のページへ渡し、計測は前と同じ名前（contact-keiri-bpo・keiri-check-q1-yes など）
      const entry = entryOf(a);
      const raw = a.getAttribute("href") ?? "";
      if (entry) saveEntry(entry, raw.split("?")[0]);
      const href = withEntry(raw, entry);

      const hit = classify(href, label) ?? (a.closest("[data-cta]") ? (["nav", navDest(href)] as [Kind, string]) : null);
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

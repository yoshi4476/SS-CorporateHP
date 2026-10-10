"use client";

// ロボットよけ（Cloudflare Turnstile）。お問い合わせはブラウザから管制塔の Apps Script へ直接送る（合言葉を持てない）。
// 機械で大量に送られると台帳が埋まり、管制塔の自動返信で他人のアドレスへ当社のメールを出させられるため、
// 答え（cf-turnstile-response）を添えて送り、管制塔（SS-AIO-LP の contact.hub.gs）が Cloudflare に確かめる。
// 部品は約590KBあるので、フォームに触れた時点で読む（開いた時点では読まない）。見た目は interaction-only。
// 送る直前に答えが無ければ最大6秒待ち、無くても送る（断るかは管制塔が決める。部品が読めない人の問い合わせを止めない）

import { useCallback, useEffect, useRef, type RefObject } from "react";
import { site } from "@/lib/site";

type Turnstile = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
};

declare global {
  interface Window {
    turnstile?: Turnstile;
    ssTsReady?: () => void;
  }
}

const WAIT_MS = 6000;
const HIDE = "position:absolute;width:0;height:0;overflow:hidden";

let loading: Promise<Turnstile | null> | null = null;

function load(): Promise<Turnstile | null> {
  if (loading) return loading;
  loading = new Promise((done) => {
    if (window.turnstile) return done(window.turnstile);
    window.ssTsReady = () => done(window.turnstile ?? null);
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=ssTsReady";
    s.async = true;
    s.onerror = () => done(null);
    document.head.appendChild(s);
  });
  return loading;
}

type State = "" | "wait" | "run" | "ask" | "ok" | "err" | "off";

export function useTurnstile(formRef: RefObject<HTMLFormElement | null>, boxRef: RefObject<HTMLDivElement | null>) {
  const st = useRef<{ state: State; id: string | null }>({ state: "", id: null });

  useEffect(() => {
    const form = formRef.current;
    const box = boxRef.current;
    if (!form || !box || !site.turnstileSiteKey) return;
    box.style.cssText = HIDE;
    const mount = () => {
      if (st.current.state) return;
      st.current.state = "wait";
      load().then((ts) => {
        if (!ts || !box.isConnected) {
          st.current.state = "off";
          return;
        }
        st.current.state = "run";
        try {
          st.current.id = ts.render(box, {
            sitekey: site.turnstileSiteKey,
            appearance: "interaction-only",
            language: "ja",
            action: "corporate",
            callback: () => (st.current.state = "ok"),
            "expired-callback": () => (st.current.state = "run"),
            "error-callback": () => (st.current.state = "err"),
            // 人の操作を求められたときだけ、確認の欄を見える場所に出す
            "before-interactive-callback": () => {
              st.current.state = "ask";
              box.style.cssText = "margin:4px 0";
            },
          });
        } catch {
          st.current.state = "off";
        }
      });
    };
    form.addEventListener("focusin", mount);
    form.addEventListener("pointerdown", mount);
    return () => {
      form.removeEventListener("focusin", mount);
      form.removeEventListener("pointerdown", mount);
    };
  }, [formRef, boxRef]);

  /** 送る直前の答え。まだ無ければ最大6秒待つ。出なければ空（そのまま送る） */
  const token = useCallback(async () => {
    const read = () => boxRef.current?.querySelector<HTMLInputElement>('input[name="cf-turnstile-response"]')?.value ?? "";
    const t0 = Date.now();
    for (;;) {
      const t = read();
      const s = st.current.state;
      if (t || !["wait", "run", "ask"].includes(s) || Date.now() - t0 > WAIT_MS) return t;
      await new Promise((r) => setTimeout(r, 150));
    }
  }, [boxRef]);

  /** 答えは1回きり。送った後は、送り直しのために作り直す */
  const renew = useCallback(() => {
    try {
      if (st.current.id != null && window.turnstile) {
        window.turnstile.reset(st.current.id);
        st.current.state = "run";
      }
    } catch {
      /* 作り直せなくても送信には関係しない */
    }
  }, []);

  return { token, renew };
}

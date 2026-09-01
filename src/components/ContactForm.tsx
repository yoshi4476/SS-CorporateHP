"use client";

// お問い合わせフォーム。Google Apps Script のWebアプリへ直接送信する。
// Content-Type を text/plain にすることでCORSのプリフライトを回避し、
// レスポンス ({"ok":true}) を読んで成功/失敗を判定できる。

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { services } from "@/lib/services";
import { site } from "@/lib/site";
import { track } from "@/components/Tracking";

const inputCls =
  "w-full rounded-xl border border-line bg-mist/50 px-4 py-3 text-sm text-ink placeholder:text-slate/50 focus:border-pulse focus:bg-white focus:outline-none disabled:opacity-60";

function LabelText({ text, required = false }: { text: string; required?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      {text}
      {required && (
        <span className="rounded bg-pulse px-1.5 py-0.5 text-[0.625rem] font-bold leading-none text-white">
          必須
        </span>
      )}
    </span>
  );
}

type State = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  // 記事やLPから ?s=... で来た人は、何の相談かがもう決まっている。
  // 選び直させると1手増えるので、初期値を入れておく。
  useEffect(() => {
    const want = new URLSearchParams(window.location.search).get("s");
    if (!want) return;
    const sel = formRef.current?.elements.namedItem("service");
    if (sel instanceof HTMLSelectElement && [...sel.options].some((o) => o.value === want)) {
      sel.value = want;
    }
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "").trim();

    // ボット除け: 隠しフィールドが埋まっていたら送信せず成功扱い
    if (get("website")) {
      setState("sent");
      return;
    }

    const email = get("email");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("error");
      setErrorMsg("メールアドレスの形式をご確認ください。");
      return;
    }

    setState("sending");
    setErrorMsg("");

    // 受信側には表示名で届ける。選択肢を足したらここも足すこと (漏れると空欄で届く)
    const EXTRA: Record<string, string> = {
      rakushift: "ラクシフトAI (シフト自動作成)",
      "aio-agent": "AIO（SEO）対策エージェント",
      all: "まとめて相談したい",
      other: "その他・まだ決まっていない",
    };
    const slug = get("service");
    const serviceName = services.find((s) => s.slug === slug)?.name ?? EXTRA[slug] ?? "";

    try {
      const res = await fetch(site.gasEndpoint, {
        method: "POST",
        // text/plain にするとプリフライトが発生せずCORSが通る
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          site: "corporate",
          type: "contact",
          formKey: site.formKey,
          name: get("name"),
          company: get("company"),
          email,
          tel: get("tel"),
          service: serviceName,
          message: get("message"),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setState("sent");
        // fetch 送信でページが変わらないため、明示的に送らないと計測されない
        track("generate_lead", { service: serviceName || "未選択" });
      } else {
        setState("error");
        setErrorMsg(data.error ?? "送信に失敗しました。");
        track("form_error", { reason: data.error ?? "unknown" });
      }
    } catch {
      setState("error");
      setErrorMsg("通信エラーが発生しました。");
      track("form_error", { reason: "network" });
    }
  };

  if (state === "sent") {
    return (
      <div className="py-10 text-center">
        <span aria-hidden className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pulse/10">
          <svg width="26" height="26" viewBox="0 0 24 24" className="text-pulse">
            <path d="M4 12.5l5 5L20 6.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="mt-5 text-lg font-bold">お申し込みを受け付けました</p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-8 text-slate">
          担当者より通常1営業日以内にご返信します。
          <br />
          お急ぎの場合はお電話(
          <a href={`tel:${site.tel.replaceAll("-", "")}`} className="num font-bold text-pulse">
            {site.tel}
          </a>
          )にてご連絡ください。
        </p>
      </div>
    );
  }

  const busy = state === "sending";

  return (
    <form ref={formRef} onSubmit={onSubmit} className="grid gap-5">
      {/* ボット除け (視覚・支援技術ともに非表示) */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      {/* 特典の案内。記入欄のすぐ上に置き、書き忘れを防ぐ */}
      <div className="rounded-2xl border border-pulse/30 bg-pulse/5 p-5">
        <p className="text-sm font-bold text-ink">🎁 特典 (MEOスタンダード無料付帯) をご希望の方</p>
        <p className="mt-2 inline-block rounded-full bg-pulse/10 px-3 py-1 text-xs font-bold text-pulse">
          オウンドメディア運営をご契約いただいたお客様専用
        </p>
        <p className="mt-3 flex flex-wrap items-center gap-3 text-sm leading-7 text-slate">
          特典コード
          <span className="num rounded-lg bg-pulse px-4 py-1.5 text-lg font-bold tracking-[0.2em] text-white">
            3010
          </span>
        </p>
        <p className="mt-3 text-xs leading-6 text-slate">
          を、下の「詳細 (任意)」欄に、ご相談内容とあわせてご記入ください。
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-xs font-bold text-ink">
          <LabelText text="お名前" required />
          <input required name="name" autoComplete="name" placeholder="山田 太郎" className={inputCls} disabled={busy} />
        </label>
        <label className="grid gap-2 text-xs font-bold text-ink">
          <LabelText text="会社名・店舗名" required />
          <input required name="company" autoComplete="organization" placeholder="株式会社◯◯" className={inputCls} disabled={busy} />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-xs font-bold text-ink">
          <LabelText text="メールアドレス" required />
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            placeholder="info@example.co.jp"
            className={inputCls}
            disabled={busy}
          />
        </label>
        <label className="grid gap-2 text-xs font-bold text-ink">
          <LabelText text="電話番号" />
          <input type="tel" name="tel" autoComplete="tel" placeholder="06-0000-0000" className={inputCls} disabled={busy} />
        </label>
      </div>

      <label className="grid gap-2 text-xs font-bold text-ink">
        <LabelText text="ご相談内容" required />
        <select required name="service" defaultValue="" className={inputCls} disabled={busy}>
          <option value="" disabled>
            選択してください
          </option>
          {services.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name}
            </option>
          ))}
          {/* 経理BPOは受託の7事業には入れていないが、
              ブログ経由の相談がいちばん多く入る見込みなので選べるようにする */}
          <option value="keiri-bpo">経理BPO・記帳代行</option>
          {/* 自社プロダクト。どちらの問い合わせか受信側で分かるようにする */}
          <option value="rakushift">ラクシフトAI (シフト自動作成)</option>
          <option value="aio-agent">AIO（SEO）対策エージェント</option>
          <option value="all">まとめて相談したい</option>
          <option value="other">その他・まだ決まっていない</option>
        </select>
      </label>

      <label className="grid gap-2 text-xs font-bold text-ink">
        <LabelText text="詳細 (任意)" />
        <textarea
          name="message"
          rows={5}
          placeholder="現在の集客状況やお困りごとをご記入ください"
          className={inputCls}
          disabled={busy}
        />
      </label>

      <label className="flex items-start gap-3 text-xs leading-6 text-slate">
        <input
          required
          type="checkbox"
          name="agree"
          className="mt-1 h-4 w-4 shrink-0 rounded border-line-strong accent-pulse"
          disabled={busy}
        />
        <span>
          <Link href="/privacy" className="font-bold text-pulse underline-offset-4 hover:underline">
            プライバシーポリシー
          </Link>
          に同意する
          <span className="ml-2 rounded bg-pulse px-1.5 py-0.5 text-[0.625rem] font-bold leading-none text-white">
            必須
          </span>
        </span>
      </label>

      {state === "error" && (
        <p role="alert" className="rounded-xl border border-pulse/30 bg-pulse/5 px-4 py-3 text-xs leading-6 text-ink">
          {errorMsg}
          <br />
          お急ぎの場合はお電話(
          <a href={`tel:${site.tel.replaceAll("-", "")}`} className="num font-bold text-pulse">
            {site.tel}
          </a>
          )にてご連絡ください。
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
                  className="mt-2 rounded-full bg-pulse px-8 py-4 text-sm font-bold text-white shadow-lift transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {busy ? "送信しています…" : "無料相談を申し込む (現状分析レポート付き)"}
      </button>
      <p className="text-xs leading-6 text-slate">
        いただいた情報は、相談対応の目的以外には使用しません。
      </p>
    </form>
  );
}

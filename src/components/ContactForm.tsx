"use client";

// お問い合わせフォーム。Google Apps Script のWebアプリへ直接送信する。
// Content-Type を text/plain にすることでCORSのプリフライトを回避し、
// レスポンス ({"ok":true}) を読んで成功/失敗を判定できる。

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { services } from "@/lib/services";
import { sheet } from "@/lib/bpo";
import { site } from "@/lib/site";
import { track } from "@/components/Tracking";

/**
 * 送信後に出す「ご返信までの間に」。以前の完了表示は電話番号だけで、送った人の次の一歩が無かった。
 * 選んだ相談内容に近いもの（ツール・資料・事例）を出す。どれも無料で、相談の準備に使えるものに限る。
 */
type Step = { kind: "ツール" | "資料" | "事例"; title: string; body: string; href: string; download?: boolean; external?: boolean };

const LAB = "https://ai.7senses.co.jp";
const WEB_SLUGS = new Set(["meo", "aio", "web-production", "aio-agent"]);

function caseStep(slug: string): Step {
  // 事業ページに取り組み例があればそこへ。無い事業は会社全体の事例（トップ）へ
  const svc = services.find((s) => s.slug === slug && s.examples?.length);
  return svc
    ? { kind: "事例", title: `${svc.name}の取り組み例`, body: "どんな状況で、何をして、どう変わったかをまとめています。", href: `/services/${svc.slug}#examples` }
    : { kind: "事例", title: "支援の事例（3つの現場）", body: "規模も業種も違う3社で、何をして数字がどう動いたかをまとめています。", href: "/#cases" };
}

function nextSteps(slug: string): Step[] {
  if (WEB_SLUGS.has(slug)) {
    return [
      { kind: "ツール", title: "URL診断（サイトの14項目を採点）", body: "AIと検索にサイトが読まれているかを100点満点で採点し、直す順番まで出します。", href: `${LAB}/tools/url-check/?src=corp_contact_done`, external: true },
      { kind: "資料", title: "AI検索対策チェックリスト（業種別PDF）", body: "歯科医院・クリニック・不動産会社・工務店・士業事務所の5業種。メールアドレスの入力だけで届きます。", href: `${LAB}/download/?src=corp_contact_done`, external: true },
      caseStep(slug),
    ];
  }
  if (slug === "ai-subsidy") {
    return [
      { kind: "ツール", title: "補助金の無料診断（8問・3分）", body: "活用できる制度があるかを、8つの質問で確かめられます。", href: site.lpUrl, external: true },
      caseStep(slug),
    ];
  }
  if (slug === "rakushift") {
    return [
      { kind: "資料", title: "ラクシフトAIのサービス紹介資料（PDF）", body: "打ち合わせの前に、サービスの内容をご確認いただけます。", href: "/docs/rakushift-ai-service.pdf", download: true },
      caseStep(slug),
    ];
  }
  return [
    { kind: "ツール", title: "経理、外に出すべき？5問のセルフチェック", body: "経理のうち外に出せる範囲の目安が、その場で出ます。答えはどこにも送信しません。", href: "/tools/keiri-check" },
    { kind: "資料", title: `${sheet.name}（${sheet.spec}）`, body: "誰が何にどれだけ時間を使っているかを書き出すシートです。書いた状態でお持ちいただくと、初回で話が具体的に進みます。", href: sheet.href, download: true },
    caseStep(slug),
  ];
}

function DoneSteps({ slug }: { slug: string }) {
  return (
    <div className="mt-10 border-t border-line pt-8 text-left" data-cta-pos="contact-done">
      <p className="text-[15px] font-bold text-ink">ご返信までの間に（いずれも無料です）</p>
      <ul className="mt-4 grid gap-3">
        {nextSteps(slug).map((s) => {
          const inner = (
            <>
              <span className="w-16 shrink-0 rounded-full bg-gold-tint py-1 text-center text-[13px] font-bold text-gold-deep">{s.kind}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-bold leading-7 text-ink group-hover:text-pulse">
                  {s.title}
                  {s.external && " ↗"}
                </span>
                <span className="mt-1 block text-sm leading-7 text-slate">{s.body}</span>
              </span>
            </>
          );
          const cls = "group flex items-start gap-4 rounded-2xl border border-line bg-raise px-5 py-4 transition-colors hover:border-pulse";
          return (
            <li key={s.href}>
              {s.external ? (
                <a href={s.href} target="_blank" rel="noopener" className={cls}>{inner}</a>
              ) : s.download ? (
                <a href={s.href} download className={cls}>{inner}</a>
              ) : (
                <Link href={s.href} className={cls}>{inner}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-line bg-mist/50 px-4 py-3 text-sm text-ink placeholder:text-slate/50 focus:border-pulse focus:bg-white focus:outline-none disabled:opacity-60";

function LabelText({ text, required = false }: { text: string; required?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      {text}
      {required && (
        <span className="rounded bg-pulse px-1.5 py-0.5 text-xs font-bold leading-none text-white">
          必須
        </span>
      )}
    </span>
  );
}

type State = "idle" | "sending" | "sent" | "error";

// 選択肢と、受信側へ送る表示名を1つの表で持つ。以前は選択肢と表示名の対応表が別々で、
// 経理の2つ（keiri-self・keiri-shindan）が対応表に無く、選んで送ると「ご相談内容」が空欄で届いていた
const OPTIONS: { value: string; label: string }[] = [
  { value: "keiri-self", label: "経理システム（セルフ版）" },
  { value: "keiri-shindan", label: "経理の現状分析（無料）" },
  ...services.map((s) => ({ value: s.slug, label: s.name })),
  // 自社プロダクト。どちらの問い合わせか受信側で分かるようにする
  { value: "rakushift", label: "ラクシフトAI (シフト自動作成)" },
  { value: "aio-agent", label: "AIO（SEO）対策エージェント" },
  { value: "all", label: "まとめて相談したい" },
  { value: "other", label: "その他・まだ決まっていない" },
];

// ?s= の値が選択肢に無いとき（古い記事・外部からのリンク）に寄せる先。選ばれないまま開くと、
// 必須の選択なので送る前にもう一度選ばされていた。どれにも当たらなければ「その他」を選んでおく
const NEAR: [RegExp, string][] = [
  [/^(keiri|bpo|kicho|accounting)/, "keiri-bpo"],
  [/(subsidy|hojokin)/, "ai-subsidy"],
  [/^(aio|seo|llmo|geo|owned)/, "aio"],
  [/^(meo|map)/, "meo"],
  [/^(web|hp|lp)/, "web-production"],
  [/^(system|dev)/, "system-development"],
  [/consult/, "ai-consulting"],
  [/shift/, "rakushift"],
];

function pickOption(want: string): string {
  if (!want) return "";
  if (OPTIONS.some((o) => o.value === want)) return want;
  return NEAR.find(([re]) => re.test(want))?.[1] ?? "other";
}

export default function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [sentSlug, setSentSlug] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  // 記事やLPから ?s=... で来た人は、何の相談かがもう決まっている。
  // 選び直させると1手増えるので、初期値を入れておく。
  useEffect(() => {
    const pick = pickOption((new URLSearchParams(window.location.search).get("s") ?? "").trim().toLowerCase());
    if (!pick) return;
    const sel = formRef.current?.elements.namedItem("service");
    if (sel instanceof HTMLSelectElement) sel.value = pick;
  }, []);

  // 送らずに離れた人が、どの欄で止まったか（form_abandon・最後に触った欄つき）。
  // 開いた8人のうち送ったのは1人だったが、どこで止まったかが分からず直しようがなかった（2026-10-04）
  // 名前と params は管制塔の site.js（form_start / form_abandon）に揃え、3サイトを同じ集計で読む
  const lastField = useRef("");
  const submitted = useRef(false);
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    let abandoned = false;
    const onFocus = (e: FocusEvent) => {
      const t = e.target as HTMLInputElement | null;
      if (!t || !t.name || t.name === "website" || t.type === "hidden") return;
      // 開いた数（page_view）と、書き始めた数を分けて見るため
      if (!lastField.current) track("form_start", { form_type: "contact" });
      lastField.current = t.name;
    };
    // スマホではタブを閉じても pagehide が来ないことがあるため visibilitychange でも拾い、1回だけ送る
    const abandon = () => {
      if (abandoned || !lastField.current || submitted.current) return;
      abandoned = true;
      track("form_abandon", { form_type: "contact", last_field: lastField.current });
    };
    const onLeave = (e: Event) => {
      if (e.type === "visibilitychange" && document.visibilityState !== "hidden") return;
      abandon();
    };
    form.addEventListener("focusin", onFocus);
    document.addEventListener("visibilitychange", onLeave);
    window.addEventListener("pagehide", onLeave);
    return () => {
      form.removeEventListener("focusin", onFocus);
      document.removeEventListener("visibilitychange", onLeave);
      window.removeEventListener("pagehide", onLeave);
      // ヘッダーのリンクなどサイト内の移動はページを読み直さず、pagehide が来ない
      abandon();
    };
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitted.current = true;
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

    // 受信側には表示名で届ける（選択肢と同じ表から引くので、選べるものは必ず名前が付く）
    const slug = get("service");
    const serviceName = OPTIONS.find((o) => o.value === slug)?.label ?? slug;

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
          contact_way: get("contact_way"),
          contact_when: get("contact_when"),
          // どのページから問い合わせたかを管制塔に残す（記事→問い合わせの対比に使う）
          referer: typeof window !== "undefined" ? window.location.href : "",
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setSentSlug(slug);
        setState("sent");
        // fetch 送信でページが変わらないため、明示的に送らないと計測されない
        track("generate_lead", { service: serviceName || "未選択" });
        // 日次KPIとファネルは3サイト共通で form_submit（送信数）と lead_capture（CV）を数える。
        // 同じ送信で両方飛ぶので、集計側では足さない
        track("form_submit", { form_type: "contact" });
        track("lead_capture", { lead_route: "form", form_type: "contact" });
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
      <div className="py-6 text-center" role="status">
        <span aria-hidden className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pulse/10">
          <svg width="26" height="26" viewBox="0 0 24 24" className="text-pulse">
            <path d="M4 12.5l5 5L20 6.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="mt-5 text-lg font-bold">お申し込みを受け付けました</p>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-[1.9] text-slate">
          担当者より通常1営業日以内にご返信します。
          <br />
          お急ぎの場合はお電話(
          <a href={`tel:${site.tel.replaceAll("-", "")}`} className="num font-bold text-pulse">
            {site.tel}
          </a>
          )にてご連絡ください。
        </p>
        <DoneSteps slug={sentSlug} />
      </div>
    );
  }

  const busy = state === "sending";

  return (
    <form ref={formRef} onSubmit={onSubmit} className="grid gap-5">
      {/* ボット除け (視覚・支援技術ともに非表示) */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-xs font-bold text-ink">
          <LabelText text="お名前" required />
          <input required name="name" autoComplete="name" placeholder="山田 太郎" className={inputCls} disabled={busy} />
        </label>
        <label className="grid gap-2 text-xs font-bold text-ink">
          <LabelText text="会社名・店舗名（任意）" />
          <input name="company" autoComplete="organization" placeholder="株式会社◯◯（個人の方は空欄で構いません）" className={inputCls} disabled={busy} />
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
          {OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
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

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-xs font-bold text-ink">
          <LabelText text="希望の連絡方法 (任意)" />
          <select name="contact_way" defaultValue="" className={inputCls} disabled={busy}>
            <option value="">指定なし</option>
            <option>メール</option>
            <option>電話</option>
            <option>オンライン面談</option>
          </select>
        </label>
        <label className="grid gap-2 text-xs font-bold text-ink">
          <LabelText text="相談したい時期 (任意)" />
          <select name="contact_when" defaultValue="" className={inputCls} disabled={busy}>
            <option value="">指定なし</option>
            <option>すぐに</option>
            <option>1か月以内</option>
            <option>3か月以内</option>
            <option>情報収集中</option>
          </select>
        </label>
      </div>

      <label className="flex items-start gap-3 text-sm leading-7 text-slate">
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
          <span className="ml-2 rounded bg-pulse px-1.5 py-0.5 text-xs font-bold leading-none text-white">
            必須
          </span>
        </span>
      </label>

      {state === "error" && (
        <p role="alert" className="rounded-xl border border-pulse/30 bg-pulse/5 px-4 py-3 text-sm leading-7 text-ink">
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
      <p className="text-sm leading-7 text-slate">
        いただいた情報は、相談対応の目的以外には使用しません。
      </p>
    </form>
  );
}

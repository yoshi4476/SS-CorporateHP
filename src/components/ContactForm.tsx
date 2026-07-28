"use client";

import { useState } from "react";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

// 送信バックエンドは未接続。site.contactEmail 設定後、API連携に差し替えること。

const inputCls =
  "w-full rounded-xl border border-line bg-mist/50 px-4 py-3 text-sm text-ink placeholder:text-slate/50 focus:border-pulse focus:bg-white focus:outline-none";

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

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="py-10 text-center">
        <p className="text-lg font-bold">お問い合わせ内容を受け付けました</p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-8 text-slate">
          現在フォームの自動送信システムは準備中です。お手数ですが、お急ぎの場合はお電話(
          <a href={`tel:${site.tel.replaceAll("-", "")}`} className="num font-bold text-pulse">
            {site.tel}
          </a>
          )にてご連絡ください。
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="grid gap-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-xs font-bold text-ink">
          <LabelText text="お名前" required />
          <input required name="name" autoComplete="name" placeholder="山田 太郎" className={inputCls} />
        </label>
        <label className="grid gap-2 text-xs font-bold text-ink">
          <LabelText text="会社名・店舗名" />
          <input name="company" autoComplete="organization" placeholder="株式会社◯◯" className={inputCls} />
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
          />
        </label>
        <label className="grid gap-2 text-xs font-bold text-ink">
          <LabelText text="電話番号" />
          <input type="tel" name="tel" autoComplete="tel" placeholder="06-0000-0000" className={inputCls} />
        </label>
      </div>
      <label className="grid gap-2 text-xs font-bold text-ink">
        <LabelText text="ご興味のあるサービス" />
        <select name="service" defaultValue="" className={inputCls}>
          <option value="">選択してください(任意)</option>
          {services.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name}
            </option>
          ))}
          <option value="other">その他・まだ決まっていない</option>
        </select>
      </label>
      <label className="grid gap-2 text-xs font-bold text-ink">
        <LabelText text="ご相談内容" required />
        <textarea
          required
          name="message"
          rows={5}
          placeholder="現在の課題やご相談したい内容をご記入ください"
          className={inputCls}
        />
      </label>
      <button
        type="submit"
        data-magnetic className="mt-2 rounded-full bg-pulse px-8 py-4 text-sm font-bold text-white shadow-lift transition-transform hover:-translate-y-0.5"
      >
        この内容で相談する
      </button>
      <p className="text-xs leading-6 text-slate">
        いただいた情報は、お問い合わせへの対応以外の目的では使用しません。
      </p>
    </form>
  );
}

import { NextResponse } from "next/server";
import { services } from "@/lib/services";

// お問い合わせ送信API。
// 受信は Google Apps Script (gas/contact-endpoint.gs) が担当し、
// GmailApp で info.ai@7senses.co.jp へ通知する。
// サーバー経由で中継することで、GASのURLをブラウザに露出させない。
// GAS_ENDPOINT 未設定時は 503 を返し、フォーム側で電話案内にフォールバックする。

type Payload = {
  name?: string;
  company?: string;
  email?: string;
  tel?: string;
  service?: string;
  message?: string;
  website?: string; // ハニーポット (人間は空のまま)
};

export async function POST(req: Request) {
  // 環境変数の登録経路によってはBOMや空白が混入するため取り除く
  const endpoint = process.env.GAS_ENDPOINT?.replace(/^﻿/, "").trim();
  if (!endpoint) {
    return NextResponse.json(
      { error: "メール送信が未設定です。お手数ですがお電話にてご連絡ください。" },
      { status: 503 },
    );
  }

  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "リクエストの形式が不正です。" }, { status: 400 });
  }

  // ボット除け: 隠しフィールドが埋まっていたら成功を装って破棄
  if (body.website) return NextResponse.json({ ok: true });

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "必須項目が入力されていません。" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "メールアドレスの形式をご確認ください。" }, { status: 400 });
  }

  const serviceName =
    services.find((s) => s.slug === body.service)?.name ??
    (body.service === "other" ? "その他・まだ決まっていない" : "");

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        name,
        email,
        message,
        company: (body.company ?? "").trim(),
        tel: (body.tel ?? "").trim(),
        service: serviceName,
      }),
      redirect: "follow",
    });

    if (!res.ok) {
      console.error("GAS responded", res.status);
      return NextResponse.json({ error: "送信に失敗しました。" }, { status: 502 });
    }

    // GAS は JSON を返すが、リダイレクト経由で HTML になる場合もあるため寛容に扱う
    const text = await res.text();
    if (text.includes('"ok":false')) {
      return NextResponse.json({ error: "送信に失敗しました。" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("contact route error", e);
    return NextResponse.json({ error: "送信に失敗しました。" }, { status: 500 });
  }
}

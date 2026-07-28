import { NextResponse } from "next/server";
import { Resend } from "resend";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

// お問い合わせ送信API。
// RESEND_API_KEY 未設定時は 503 を返し、フォーム側で電話案内にフォールバックする。

type Payload = {
  name?: string;
  company?: string;
  email?: string;
  tel?: string;
  service?: string;
  message?: string;
  website?: string; // ハニーポット (人間は空のまま)
};

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

export async function POST(req: Request) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
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
    (body.service === "other" ? "その他・まだ決まっていない" : "未選択");

  const rows: [string, string][] = [
    ["お名前", name],
    ["会社名・店舗名", (body.company ?? "").trim() || "—"],
    ["メールアドレス", email],
    ["電話番号", (body.tel ?? "").trim() || "—"],
    ["ご興味のあるサービス", serviceName],
  ];

  const html = `
    <div style="font-family:sans-serif;line-height:1.9;color:#0b1220">
      <p style="font-size:13px;color:#55637a;margin:0 0 16px">
        ${site.url} のお問い合わせフォームから送信されました。
      </p>
      <table style="border-collapse:collapse;width:100%;max-width:640px">
        ${rows
          .map(
            ([k, v]) => `<tr>
              <th style="text-align:left;padding:10px 14px;background:#eff3f9;border:1px solid #dfe6f0;width:180px;font-size:13px">${k}</th>
              <td style="padding:10px 14px;border:1px solid #dfe6f0;font-size:14px">${escapeHtml(v)}</td>
            </tr>`,
          )
          .join("")}
        <tr>
          <th style="text-align:left;padding:10px 14px;background:#eff3f9;border:1px solid #dfe6f0;vertical-align:top;font-size:13px">ご相談内容</th>
          <td style="padding:10px 14px;border:1px solid #dfe6f0;font-size:14px;white-space:pre-wrap">${escapeHtml(message)}</td>
        </tr>
      </table>
    </div>`;

  const text = [...rows.map(([k, v]) => `${k}: ${v}`), "", "ご相談内容:", message].join("\n");

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      // 独自ドメインをResendで認証後、from を info.ai@7senses.co.jp 等に変更可
      from: process.env.CONTACT_FROM ?? "SEVEN SENSES <onboarding@resend.dev>",
      to: [site.contactEmail],
      replyTo: email,
      subject: `【サイトお問い合わせ】${name} 様${body.company ? ` (${body.company})` : ""}`,
      html,
      text,
    });
    if (error) {
      console.error("resend error", error);
      return NextResponse.json({ error: "送信に失敗しました。" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("contact route error", e);
    return NextResponse.json({ error: "送信に失敗しました。" }, { status: 500 });
  }
}

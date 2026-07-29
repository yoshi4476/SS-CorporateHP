/**
 * セブンセンシズ コーポレートサイト お問い合わせ受信エンドポイント
 * ------------------------------------------------------------------
 * Google Apps Script (GAS) の Web アプリとしてデプロイして使います。
 * メールは GmailApp で送信するため、外部サービスの契約は不要です。
 *
 * 【デプロイ手順】
 * 1. https://script.google.com/ で新しいプロジェクトを作成
 * 2. このファイルの中身をすべて貼り付けて保存
 * 3. 右上「デプロイ」→「新しいデプロイ」
 *      種類  : ウェブアプリ
 *      実行者: 自分 (info.ai@7senses.co.jp のアカウント)
 *      アクセス: 全員
 * 4. 発行された /exec で終わるURLを控える
 * 5. サイト側の環境変数 GAS_ENDPOINT にそのURLを設定
 *
 * 【スプレッドシートにも記録したい場合】
 *   SHEET_ID に対象シートのIDを入れてください (空なら記録しません)。
 */

// ===== 設定 =====
var TO_EMAIL = "info.ai@7senses.co.jp"; // 通知先
var SITE_NAME = "セブンセンシズ コーポレートサイト";
var SHEET_ID = ""; // 例: "1AbCdEf...". 空ならスプレッドシート記録なし
var SHEET_NAME = "contact";

// ===== 受信 =====
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents || "{}");

    // ハニーポット: ボットが埋めていたら成功を装って破棄
    if (data.website) return json({ ok: true });

    var name = String(data.name || "").trim();
    var email = String(data.email || "").trim();
    var message = String(data.message || "").trim();

    if (!name || !email || !message) {
      return json({ ok: false, error: "必須項目が入力されていません。" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ ok: false, error: "メールアドレスの形式をご確認ください。" });
    }

    var company = String(data.company || "").trim();
    var tel = String(data.tel || "").trim();
    var service = String(data.service || "").trim();

    sendMail({
      name: name,
      email: email,
      company: company,
      tel: tel,
      service: service,
      message: message,
    });

    if (SHEET_ID) {
      appendRow([new Date(), name, company, email, tel, service, message]);
    }

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

// 動作確認用 (ブラウザで開くと OK が表示されます)
function doGet() {
  return ContentService.createTextOutput("SEVEN SENSES contact endpoint: OK");
}

// ===== メール送信 =====
function sendMail(d) {
  var subject =
    "【サイトお問い合わせ】" + d.name + " 様" + (d.company ? " (" + d.company + ")" : "");

  var rows = [
    ["お名前", d.name],
    ["会社名・店舗名", d.company || "—"],
    ["メールアドレス", d.email],
    ["電話番号", d.tel || "—"],
    ["ご興味のあるサービス", d.service || "未選択"],
  ];

  var text = rows
    .map(function (r) {
      return r[0] + ": " + r[1];
    })
    .join("\n");
  text += "\n\nご相談内容:\n" + d.message;
  text += "\n\n---\n" + SITE_NAME + " のお問い合わせフォームから送信されました。";

  var html =
    '<div style="font-family:sans-serif;line-height:1.9;color:#0b1220">' +
    '<p style="font-size:13px;color:#55637a;margin:0 0 16px">' +
    SITE_NAME +
    " のお問い合わせフォームから送信されました。</p>" +
    '<table style="border-collapse:collapse;width:100%;max-width:640px">' +
    rows
      .map(function (r) {
        return (
          '<tr><th style="text-align:left;padding:10px 14px;background:#eff3f9;border:1px solid #dfe6f0;width:180px;font-size:13px">' +
          esc(r[0]) +
          '</th><td style="padding:10px 14px;border:1px solid #dfe6f0;font-size:14px">' +
          esc(r[1]) +
          "</td></tr>"
        );
      })
      .join("") +
    '<tr><th style="text-align:left;padding:10px 14px;background:#eff3f9;border:1px solid #dfe6f0;vertical-align:top;font-size:13px">ご相談内容</th>' +
    '<td style="padding:10px 14px;border:1px solid #dfe6f0;font-size:14px;white-space:pre-wrap">' +
    esc(d.message) +
    "</td></tr></table></div>";

  GmailApp.sendEmail(TO_EMAIL, subject, text, {
    htmlBody: html,
    replyTo: d.email, // 受信メールからそのまま返信できます
    name: SITE_NAME,
  });
}

// ===== スプレッドシート記録 (任意) =====
function appendRow(values) {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) {
      sh.appendRow(["受信日時", "お名前", "会社名", "メール", "電話", "サービス", "相談内容"]);
    }
    sh.appendRow(values);
  } catch (err) {
    // 記録に失敗してもメール送信は成立させる
    console.warn("sheet append failed: " + err);
  }
}

// ===== ヘルパー =====
function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

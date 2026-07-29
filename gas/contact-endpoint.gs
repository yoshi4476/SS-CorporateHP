/**
 * セブンセンシズ 共通お問い合わせ受信エンドポイント (マルチサイト対応)
 * ------------------------------------------------------------------
 * Google Apps Script の Web アプリとして1つデプロイすれば、
 * コーポレートサイト・LP・AI集客ラボなど複数サイトの受信を兼用できます。
 * メールは GmailApp で送るため、外部サービスの契約は不要です。
 *
 * 【デプロイ手順】
 * 1. https://script.google.com/ で新規プロジェクトを作成
 * 2. この中身をすべて貼り付けて保存
 * 3. 「デプロイ」→「新しいデプロイ」→ ウェブアプリ
 *      実行者  : 自分 (info.ai@7senses.co.jp のアカウント)
 *      アクセス: 全員
 * 4. 発行された /exec URL を各サイトに設定
 *
 * 【コードを更新したとき】
 *   「デプロイ」→「デプロイを管理」→ 鉛筆アイコン →
 *   バージョンを「新バージョン」にして更新。URLは変わりません。
 *
 * 【送信側が送るJSON】
 *   site    : サイト識別子 (任意。SITES のキー。未指定なら "default")
 *   type    : 種別 (任意。"contact" / "download" など)
 *   name    : お名前            [必須]
 *   email   : メールアドレス    [必須]
 *   message : ご相談内容        [必須]
 *   company / tel / service : 任意
 *   website : ハニーポット (値が入っていたら破棄)
 */

// ===== 設定 =====

/** サイトごとの表示名と通知先。キーが送信側の site の値になります */
var SITES = {
  corporate: { label: "コーポレートサイト", to: "info.ai@7senses.co.jp" },
  lp: { label: "AI導入補助金LP", to: "info.ai@7senses.co.jp" },
  lab: { label: "AI集客ラボ", to: "info.ai@7senses.co.jp" },
  default: { label: "セブンセンシズ", to: "info.ai@7senses.co.jp" },
};

/** スプレッドシートにも記録する場合はシートIDを設定 (空なら記録しない) */
var SHEET_ID = "";
var SHEET_NAME = "contact";

// ===== 受信 =====
function doPost(e) {
  try {
    var raw = (e && e.postData && e.postData.contents) || "{}";
    var data = JSON.parse(raw);

    // ハニーポット: ボットが埋めていたら成功を装って破棄
    if (data.website) return json({ ok: true });

    var name = str(data.name);
    var email = str(data.email);
    var message = str(data.message);

    if (!name || !email || !message) {
      return json({ ok: false, error: "必須項目が入力されていません。" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ ok: false, error: "メールアドレスの形式をご確認ください。" });
    }

    var site = SITES[str(data.site)] || SITES.default;
    var payload = {
      site: site,
      type: str(data.type) || "contact",
      name: name,
      email: email,
      company: str(data.company),
      tel: str(data.tel),
      service: str(data.service),
      message: message,
    };

    sendMail(payload);
    if (SHEET_ID) {
      appendRow([
        new Date(),
        site.label,
        payload.type,
        name,
        payload.company,
        email,
        payload.tel,
        payload.service,
        message,
      ]);
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
    "【" + d.site.label + "】お問い合わせ: " + d.name + " 様" + (d.company ? " (" + d.company + ")" : "");

  var rows = [
    ["受信サイト", d.site.label],
    ["お名前", d.name],
    ["会社名・店舗名", d.company || "—"],
    ["メールアドレス", d.email],
    ["電話番号", d.tel || "—"],
    ["ご興味のあるサービス", d.service || "未選択"],
  ];

  var text =
    rows
      .map(function (r) {
        return r[0] + ": " + r[1];
      })
      .join("\n") +
    "\n\nご相談内容:\n" +
    d.message +
    "\n\n---\n" +
    d.site.label +
    " のお問い合わせフォームから送信されました。";

  var html =
    '<div style="font-family:sans-serif;line-height:1.9;color:#0b1220">' +
    '<p style="font-size:13px;color:#55637a;margin:0 0 16px">' +
    esc(d.site.label) +
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

  GmailApp.sendEmail(d.site.to, subject, text, {
    htmlBody: html,
    replyTo: d.email, // 受信メールからそのまま返信できます
    name: d.site.label,
  });
}

// ===== スプレッドシート記録 (任意) =====
function appendRow(values) {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) {
      sh.appendRow([
        "受信日時",
        "サイト",
        "種別",
        "お名前",
        "会社名",
        "メール",
        "電話",
        "サービス",
        "相談内容",
      ]);
    }
    sh.appendRow(values);
  } catch (err) {
    // 記録に失敗してもメール送信は成立させる
    console.warn("sheet append failed: " + err);
  }
}

// ===== ヘルパー =====
function str(v) {
  return String(v == null ? "" : v).trim();
}

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

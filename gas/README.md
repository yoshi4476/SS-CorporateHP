# GAS お問い合わせエンドポイントの移植ガイド

[contact-endpoint.gs](contact-endpoint.gs) は **1つデプロイすれば複数サイトで共用**できます。
送信するJSONに `site` を含めることで、メールの件名と本文に受信サイト名が入ります。

現在のURL (コーポレートサイトで使用中):

```
https://script.google.com/macros/s/AKfycbzB_RZ1oft6SgZc_UAhLsSEPVy0ppYCYKgImLjw0Xi0DQLzCU9_i4smFf6OUM__wxKvDw/exec
```

---

## パターン1: サーバーがあるサイト (Next.js / Node など) — 推奨

サーバー側から中継すると **GASのURLがブラウザに露出しません**。
このコーポレートサイトはこの方式です ([../src/app/api/contact/route.ts](../src/app/api/contact/route.ts))。

1. 環境変数に `GAS_ENDPOINT` を設定
2. サーバー側から以下のように送信

```js
await fetch(process.env.GAS_ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "text/plain;charset=utf-8" },
  body: JSON.stringify({
    site: "corporate",   // ← SITES のキー
    name, email, message, company, tel, service,
  }),
  redirect: "follow",
});
```

**注意**: `Content-Type` は `text/plain` にしてください。
`application/json` にするとGAS側でプリフライトが必要になり失敗します。

---

## パターン2: 静的サイト (LP・HTMLのみ) — ブラウザから直接

`lp.7senses.co.jp` はこの方式で作られています (ただし現在URLが未設定で**送信されていません**)。

### LPを稼働させる手順

LPのHTML内、`<script>` の先頭にある次の行を書き換えるだけです。

```js
// 変更前
const GAS_ENDPOINT = "";

// 変更後
const GAS_ENDPOINT = "https://script.google.com/macros/s/AKfycbzB_RZ1oft6SgZc_UAhLsSEPVy0ppYCYKgImLjw0Xi0DQLzCU9_i4smFf6OUM__wxKvDw/exec";
```

さらに `sendPayload` に `site` を足すと、どのサイトからの問い合わせか判別できます。

```js
function sendPayload(data){
  const payload = Object.assign(
    { site: "lp", website: form ? form.website.value : "", ts: TS },
    data
  );
  if(!GAS_ENDPOINT) return Promise.resolve();
  return fetch(GAS_ENDPOINT, {
    method: "POST",
    mode: "no-cors",                                  // ← 必須
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(payload),
  });
}
```

### 静的サイトの制約

| 項目 | 内容 |
| --- | --- |
| `mode: "no-cors"` | GASはCORSヘッダーを返さないため必須。**送信は成立するがレスポンスは読めません** |
| 成功/失敗の判定 | ブラウザ側では判定不可。画面は常に「送信しました」と表示する作りになります |
| URLの露出 | HTMLソースにURLが見えます。悪用されると迷惑メールが届く可能性があります |

露出対策として、GAS側に簡易的な合言葉チェックを足すこともできます。

```js
// doPost の先頭に追加
if (str(data.key) !== "7senses-2026") return json({ ok: true });
```
送信側は `key: "7senses-2026"` を含めます (完全な防御ではありませんが、無作為な投稿は防げます)。

---

## パターン3: WordPress サイト

WordPressはPHPでメールを送れるため、**GASは不要**です。
`www.7senses.co.jp` では **MW WP Form** プラグインが稼働しており、そのまま利用できます。

GASに統一したい場合は、`functions.php` から `wp_remote_post()` でGASを叩く形にできます。

---

## 新しいサイトを追加するとき

1. [contact-endpoint.gs](contact-endpoint.gs) の `SITES` にキーを追加

```js
var SITES = {
  corporate: { label: "コーポレートサイト", to: "info.ai@7senses.co.jp" },
  lp:        { label: "AI導入補助金LP",    to: "info.ai@7senses.co.jp" },
  lab:       { label: "AI集客ラボ",        to: "info.ai@7senses.co.jp" },
  newsite:   { label: "新サイト名",        to: "info.ai@7senses.co.jp" }, // 追加
  default:   { label: "セブンセンシズ",    to: "info.ai@7senses.co.jp" },
};
```

サイトごとに通知先を分けたい場合は `to` を変更してください。

2. GASエディタで **デプロイ → デプロイを管理 → 鉛筆アイコン → バージョン「新バージョン」→ デプロイ**
   (URLは変わらないので、既存サイトの設定変更は不要です)

3. 新サイトから `site: "newsite"` を含めて送信

---

## 制限と運用上の注意

- **送信上限**: Gmailの1日あたり送信数 (無料アカウントは約500通)。問い合わせ用途なら十分です
- **初回応答が遅い**: Googleのコールドスタートで10〜20秒かかることがあります
- **スプレッドシート記録**: `SHEET_ID` にシートIDを入れると、全サイトの問い合わせが1枚に蓄積されます
- **迷惑メール対策**: ハニーポット (`website` フィールド) は実装済みです

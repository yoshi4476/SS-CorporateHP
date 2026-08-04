# デプロイ手順 (Cloudflare Pages)

このサイトは Next.js を静的書き出し (`output: "export"`) して、
Cloudflare Pages プロジェクト **`ss-corporate`** に配信します。

サーバー機能を持たない構成にしている理由は、DNSを GMO (お名前.com) に置いたまま
独自ドメインを当てられるようにするためです。DNSを Cloudflare に移管する必要がなく、
**MXレコード (メール) に一切触らずに** サイトだけを差し替えられます。

- 本番URL: https://corp.7senses.co.jp
- Pages URL: https://ss-corporate.pages.dev

`www.7senses.co.jp` から `corp.7senses.co.jp` への移行手順は
[DOMAIN-MIGRATION.md](DOMAIN-MIGRATION.md) にある。以下「2. 独自ドメインの切替」は
www を当てたときの記録で、手順そのものは corp でも同じ。

## 1. ビルドとデプロイ

```bash
npm run cf:deploy
```

中身は `next build` → `node scripts/flatten-segments.mjs` (postbuild) →
`wrangler pages deploy out --project-name=ss-corporate` です。

`scripts/flatten-segments.mjs` は Next.js 16 の静的書き出しの不一致を埋める後処理です。
クライアントルーターは先読みファイルを `company/__next.company.__PAGE__.txt` の形で要求しますが、
`next build` は `company/__next.company/__PAGE__.txt` として出力するため、
そのままではページ遷移ごとに404が出ます。ドット区切りの別名を複製して両方に応答させています。

## 2. 独自ドメインの切替 (www.7senses.co.jp)

DNSは GMO のまま、CNAMEを1本だけ書き換えます。**MXレコードは触らないこと。**

### 2-1. Cloudflare 側 (先にこちら)

[Pages → ss-corporate](https://dash.cloudflare.com/) → **Custom domains** →
**Set up a domain** → `www.7senses.co.jp` を入力して追加。
DNSがまだ向いていないため `Pending` 表示になりますが、正常です。

### 2-2. GMO (お名前.com) 側

DNSレコード設定で `www` のレコードを差し替えます。

| ホスト名 | 種別 | 値 |
| --- | --- | --- |
| `www` | CNAME | `ss-corporate.pages.dev` |

- **既存の `www` A レコード (157.120.209.21) は削除** します (CNAMEとA は共存できません)
- `@` (ネイキッドドメイン) 、`MX`、`SPF/DKIM の TXT` は**変更しない**
- 反映後、Cloudflare 側の Custom domains が `Active` になり、証明書が自動発行されます (数分〜数十分)

同じ方式で `lp.7senses.co.jp` (Pages: `seven-hpunyou`) と
`ai.7senses.co.jp` (Pages: `ss-aio-lp`) が既に稼働しています。

### 2-3. 切替前にやること

旧サイト (WordPress) のバックアップを取得してください。
DNSを戻せば復旧できますが、サーバー側のデータ保全は別問題です。

## 3. お問い合わせフォーム

静的サイトなのでブラウザから Google Apps Script の Web アプリへ直接送信します。
サーバー側の環境変数は使いません。

| 設定 | 場所 |
| --- | --- |
| GASのエンドポイントURL | [src/lib/site.ts](src/lib/site.ts) の `gasEndpoint` |
| 迷惑投稿除けの簡易キー | [src/lib/site.ts](src/lib/site.ts) の `formKey` |
| 受信先メールアドレス | [gas/contact-endpoint.gs](gas/contact-endpoint.gs) の `SITES` |

エンドポイントURLは公開されるため、GAS側で `formKey` の一致とハニーポットを確認しています。
GAS のコードを更新したら「デプロイを管理」→ 鉛筆アイコン → バージョンを**新バージョン**にして
更新してください (URLは変わりません)。

## 4. 旧URLのリダイレクト

静的書き出しでは `next.config.ts` の `redirects()` が無効になるため、
[public/_redirects](public/_redirects) で定義しています。
旧WordPressサイトのURL (`/g-ran/`・`/blog/*`・`/case/*`・終了事業のページ) を
新しいページへ301で転送します。

## ローカルでの確認

```bash
npm run dev          # 開発サーバー
npm run build        # 静的書き出し (out/ が生成される)
npm run cf:preview   # out/ を Pages ランタイムでプレビュー
```

公開後、[src/lib/site.ts](src/lib/site.ts) の `url` が本番ドメインと一致しているか確認してください
(sitemap.xml・OGP・canonical に使用しています)。

# デプロイ手順 (Cloudflare Workers)

このサイトは Next.js を [@opennextjs/cloudflare](https://opennext.js.org/cloudflare) で
Cloudflare Workers 上に配信します。

## 1. GitHub リポジトリ

https://github.com/yoshi4476/SS-CorporateHP

```bash
git push -u origin main
```

## 2. Cloudflare ダッシュボードでの接続

1. [Workers & Pages](https://dash.cloudflare.com/) → **Create** → **Workers** → **Import a repository**
2. `SS-CorporateHP` を選択
3. ビルド設定:

| 項目 | 値 |
| --- | --- |
| Build command | `npm run cf:build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | (空欄) |

## 3. 環境変数 (Settings → Variables and Secrets)

| 変数名 | 種別 | 値 |
| --- | --- | --- |
| `GAS_ENDPOINT` | Secret | Google Apps Script の `/exec` URL |

GASの準備手順は [gas/contact-endpoint.gs](gas/contact-endpoint.gs) の冒頭コメントを参照してください。
`GAS_ENDPOINT` が未設定でもサイトは動作しますが、
お問い合わせフォームは「電話でご連絡ください」の案内になります。

## 4. 独自ドメイン

Workers の **Settings → Domains & Routes** から `www.7senses.co.jp` を追加します。
ドメインが Cloudflare で管理されていれば、DNSは自動設定されます。

公開後、[src/lib/site.ts](src/lib/site.ts) の `url` が本番ドメインと一致しているか確認してください
(sitemap.xml・OGP・canonical に使用しています)。

## ローカルでの確認

```bash
npm run dev          # 開発サーバー
npm run build        # Next.js ビルド
npm run cf:build     # Cloudflare 用ビルド
npm run cf:preview   # Cloudflare ランタイムでプレビュー
```

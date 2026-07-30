<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 管制塔との責任分担

ブログ運用の頭脳は、このリポジトリではなく **SS-AIO-LP (管制塔)** にある。
https://github.com/yoshi4476/SS-AIO-LP

同じ処理をこちらに実装すると二重管理になり、片方だけ更新されて食い違う。
以下は**管制塔の担当なので、このリポジトリに作らない**。

| 領域 | 管制塔側の担当 |
| --- | --- |
| 記事の生成・品質審査 | `scripts/` 一式。JST 13:00 に毎日コーポレート向けを生成 |
| 記事の配信 | `scripts/publish.py` が `src/content/blog/*.json` と `public/images/blog/` を書き込んでpush |
| カテゴリの定義 | `sites/corporate.json` の `categories`。表示名は記事JSONの `categoryName` として届く |
| 扱うテーマの線引き | `sites/corporate.json` の `owns` / `avoid`。AIO・SEO・MEOの手法解説と補助金の手続きは他サイトの担当 |
| カニバリ検査 | `scripts/cannibal_check.py` が3サイト横断で確認 |
| インデックス登録の通知 | `scripts/notify_indexing.py` / `notify_indexnow.py` |
| KPI集計・レポート | `scripts/daily_kpi.py` ほか。コーポレートのGA4プロパティIDも管制塔が保持 |
| 障害・完了通知 | `scripts/notify_slack.py` |

## このリポジトリの担当

- サイトの見た目と構造 (コンポーネント、`src/lib/` の掲載データ)
- 記事JSONを**読んで表示する**だけの処理 (`src/lib/blog.ts`)
- ビルドとCloudflare Pagesへの配信 (`.github/workflows/deploy.yml`)
- お問い合わせフォームと、その受信 (`src/components/ContactForm.tsx`、`gas/contact-endpoint.gs`)

`.github/workflows/deploy.yml` は管制塔が前提としている仕組みである。
管制塔は「他サイトは publish.py が対象リポジトリへpushし、各サイトのビルドが動く」
という設計なので、**このワークフローを止めると記事が公開されなくなる**。

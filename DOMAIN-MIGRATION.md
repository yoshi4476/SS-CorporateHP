# ドメイン移行手順 (www → corp)

新サイトを `corp.7senses.co.jp` に移し、`www.7senses.co.jp` を旧サイト (WordPress) へ戻す作業の手順書。

**順番を守ること。** 逆順にすると、切り替えの途中で新サイトがどこからも見えない時間が生まれる。

## 現状と、終わったあとの状態

| ホスト名 | 今 | 移行後 |
| --- | --- | --- |
| `corp.7senses.co.jp` | 未使用 | **新サイト** (Cloudflare Pages `ss-corporate`) |
| `www.7senses.co.jp` | 新サイト (Pages) | **旧サイト** (WordPress / 157.120.209.21) |
| `7senses.co.jp` (apex) | 旧サーバーが www へ301 | 変更しない |
| `ai.7senses.co.jp` | AI集客ラボ (Pages `ss-aio-lp`) | 変更しない |
| `lp.7senses.co.jp` | AI導入補助金LP (Pages `seven-hpunyou`) | 変更しない |

DNSは GMO (`ns-rs1.gmoserver.jp` / `ns-rs2.gmoserver.jp`) のまま。移管はしない。

> **MX・SPF・DKIM の TXT レコードには一切触らないこと。** 触るとメールが止まる。
> 今回触るのは `corp` と `www` の2本だけ。

---

## フェーズ1 — corp を開通させる

この段階では **www は新サイトのまま**。何も壊れない。

### 1-1. Cloudflare 側 (完了済み)

Pages プロジェクト `ss-corporate` のカスタムドメインに `corp.7senses.co.jp` を登録済み。
DNSがまだ無いので `Pending` 表示。これは正常。

### 1-2. GMO でレコードを1本追加する

DNSレコード設定の画面で、次の1行を**追加**する。既存のレコードは何も消さない。

| ホスト名 | 種別 | 値 | TTL |
| --- | --- | --- | --- |
| `corp` | CNAME | `ss-corporate.pages.dev` | 3600 |

- 入力欄が「ホスト名」なら `corp` だけ。「完全なドメイン名」なら `corp.7senses.co.jp`
- 値の末尾のドット (`.`) は、付ける欄と付けない欄がある。画面の既存レコード (`ai` や `lp`) の書き方に合わせる

### 1-3. 反映を確認する

```bash
# CNAME が引けるか
nslookup -type=CNAME corp.7senses.co.jp 1.1.1.1

# サイトが返るか (証明書の発行まで数分〜十数分かかる)
curl -sI https://corp.7senses.co.jp/ | head -1
```

`HTTP/2 200` が返れば開通。Cloudflare の Custom domains も `Active` に変わる。

---

## フェーズ2 — サイトの中身を corp 向けに切り替える (こちらで実施)

corp が開通してから行う。**開通前にやると、canonical が存在しないURLを指すことになる。**

| 変更するもの | 内容 |
| --- | --- |
| [src/lib/site.ts](src/lib/site.ts) の `url` | canonical・sitemap.xml・OGP・JSON-LD が corp を指すようになる |
| 記事JSON内の内部リンク 12件 | `https://www.7senses.co.jp/blog/…` → `https://corp.7senses.co.jp/blog/…` |
| [scripts/verify-live.mjs](scripts/verify-live.mjs) の `BASE` | デプロイ後の自動確認先 |
| [gas/contact-endpoint.gs](gas/contact-endpoint.gs) の `SITES.corporate.url` | 自動返信メールに載るURL。**GASの再デプロイが必要** |

この時点では www も corp も同じ新サイトを表示する。canonical が corp を向くので、
検索エンジンには corp が正となる。

### 管制塔 (SS-AIO-LP) 側もあわせて直す

記事を書き出しているのは管制塔なので、そちらのサイト定義も変えないと、
次の記事からまた `www.7senses.co.jp` へのリンクが混ざる。

- `sites/corporate.json` の サイトURL を `https://corp.7senses.co.jp` に変更
- 変更しないと、記事内リンク・sitemap通知・インデックス登録通知が旧URLのままになる

---

## フェーズ3 — www を旧サイトへ戻す

corp で新サイトが正常に見えることを確認してから行う。

### 3-1. GMO でレコードを差し替える

| 操作 | ホスト名 | 種別 | 値 |
| --- | --- | --- | --- |
| **削除** | `www` | CNAME | `ss-corporate.pages.dev` |
| **追加** | `www` | A | `157.120.209.21` |

CNAME と A は同じホスト名で共存できないため、**削除してから追加**する。

### 3-2. 反映を確認する

```bash
nslookup -type=A www.7senses.co.jp 1.1.1.1
curl -sS https://www.7senses.co.jp/ | grep -o "<title>[^<]*</title>"
```

旧サイトのタイトル (`店舗集客（MEO）や草刈り・造園・害虫・害獣駆除ならセブンセンシズ株式会社`)
が返れば完了。

### 3-3. Pages から www を外す

DNSが旧サーバーへ向いたことを確認した**あとで**、Pages のカスタムドメインから
`www.7senses.co.jp` を削除する。先に消すと、DNSがまだPagesを向いている間、
訪問者にエラーが出る。

---

## フェーズ4 — 計測とインデックスの引き継ぎ

| やること | 場所 |
| --- | --- |
| `corp.7senses.co.jp` のプロパティを追加 | Google Search Console |
| `https://corp.7senses.co.jp/sitemap.xml` を送信 | Search Console |
| データストリームのURLを corp に変更 | GA4 (測定ID `G-9NCYS5VPHY` はそのまま使える) |

GA4の測定IDは同じなので、ホスト名が変わっても計測は途切れない。
ただしレポート上は別ホストとして記録されるため、比較するときは注意。

---

## 切り戻し

フェーズ3まで進めたあとで元に戻したくなった場合:

1. GMO で `www` の A レコード (`157.120.209.21`) を削除し、CNAME `ss-corporate.pages.dev` を再作成
2. Pages のカスタムドメインに `www.7senses.co.jp` を再登録
3. [src/lib/site.ts](src/lib/site.ts) の `url` を `https://www.7senses.co.jp` に戻して再デプロイ

DNSの反映待ちがあるため、切り戻しにも数十分かかる。

---

## 移行後に起きること (承知しておくこと)

- `https://www.7senses.co.jp/blog/…` の新記事URLは、旧WordPressに同じページが無いため **404** になる。
  記事内リンクをフェーズ2で書き換えるのはこのため
- [public/_redirects](public/_redirects) の301 (旧WordPressのURL → 新ページ、削除した記事7本 → `/blog`) は
  Pages 上でのみ効く。www が旧サーバーへ戻ると、これらは効かなくなる
- 検索結果に出ている `www.7senses.co.jp` の新サイトのページは、順次 corp のものへ置き換わる。
  完全に入れ替わるまで数週間かかる

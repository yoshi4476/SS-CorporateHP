// 配信後、本番が実際に応答するかを確認する。
//
// wrangler が成功しても、実際のページが落ちていることはあり得る。
// ここで確認しておけば、無言で止まる事態を防げる (失敗すればActionsが通知する)。

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const BASE = "https://corp.7senses.co.jp";
const UA = { "User-Agent": "seven-senses-deploy-check" };

// 直近の記事1本を確認対象に含める (記事が実際に公開されたかを見る)
function latestSlug() {
  const dir = join(process.cwd(), "src", "content", "blog");
  const posts = readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(join(dir, f), "utf8")))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts[0]?.slug;
}

const targets = ["/", "/blog", "/sitemap.xml"];
const slug = latestSlug();
if (slug) targets.push(`/blog/${slug}`);

// 配信直後は反映に少し時間がかかることがあるため、数回試す
async function check(path) {
  for (let i = 1; i <= 5; i++) {
    try {
      const res = await fetch(BASE + path, { headers: UA });
      if (res.ok) return { path, status: res.status };
      if (i === 5) return { path, status: res.status, failed: true };
    } catch (e) {
      if (i === 5) return { path, status: String(e), failed: true };
    }
    await new Promise((r) => setTimeout(r, 6000));
  }
}

const results = await Promise.all(targets.map(check));
let failed = false;
for (const r of results) {
  console.log(`${r.failed ? "NG " : "OK "} ${r.status}  ${r.path}`);
  if (r.failed) failed = true;
}

if (failed) {
  console.log("::error::公開後の確認に失敗しました。サイトが更新されていない可能性があります");
  process.exit(1);
}
console.log("公開を確認しました");

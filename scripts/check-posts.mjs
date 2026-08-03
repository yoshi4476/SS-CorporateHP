// 管制塔が書き出した記事JSONを、ビルド前に検査する。
//
// 記事は毎日自動で増えるため、1本壊れただけでビルドが落ちると
// サイト全体の更新が止まる。読めないものはここで隔離し、
// 残りは通常どおり公開する。
//
// 隔離したファイルは .broken を付けて残すので、後から原因を追える。

import { readdirSync, readFileSync, renameSync } from "node:fs";
import { join } from "node:path";

const DIR = join(process.cwd(), "src", "content", "blog");
const REQUIRED = ["slug", "title", "description", "date", "category", "html"];

let ok = 0;
const broken = [];

for (const name of readdirSync(DIR)) {
  if (!name.endsWith(".json")) continue;
  const path = join(DIR, name);
  try {
    const post = JSON.parse(readFileSync(path, "utf8"));
    const missing = REQUIRED.filter((k) => !post[k]);
    if (missing.length) throw new Error(`項目が足りない: ${missing.join(", ")}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date)) throw new Error(`日付の形式が不正: ${post.date}`);
    ok++;
  } catch (e) {
    broken.push({ name, reason: e.message });
    renameSync(path, `${path}.broken`);
  }
}

console.log(`記事の検査: ${ok} 本 OK`);
if (broken.length) {
  console.log("以下は読めないため、今回の公開から除外しました:");
  for (const b of broken) console.log(`  ${b.name} — ${b.reason}`);
  // 除外して公開は続ける。止めない方が損失が小さい
  console.log("::warning::壊れた記事があります。管制塔側の出力を確認してください");
}

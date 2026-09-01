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

// 変換されずに残った生Markdownの痕跡。
// 管制塔が <div> を閉じ忘れると、そこから先がMarkdownのまま届き、
// 段落も見出しも無い1枚の壁のような記事になる (2026-08-04 に発生)。
const RAW_MARKDOWN = [
  { re: /^#{2,3} \S/m, what: "見出し (## …)" },
  { re: /\*\*[^*\n]+\*\*/, what: "強調 (**…**)" },
  { re: /^\|.+\|$/m, what: "表 (| … |)" },
  { re: /\[[^\]\n]+\]\(https?:/, what: "リンク ([…](…))" },
];

// HTMLとして成り立っていない箇所。閉じ忘れとは逆に、
// 開いていないタグを閉じているものが混ざることがある (2026-09-01 に2本 </content>)。
// ブラウザは黙って無視するので、検査しないと気づけない。
// タグ名の一覧で判定すると <details> のような正しい要素まで拾うので、
// 「閉じた回数が開いた回数を上回るもの」だけを見る。
const VOID = new Set(["br", "img", "hr", "input", "meta", "link", "source", "col", "wbr"]);
function strayTags(html) {
  const open = new Map();
  const over = new Set();
  for (const m of html.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g)) {
    const [, close, name, attrs] = m;
    const tag = name.toLowerCase();
    if (VOID.has(tag) || attrs.trimEnd().endsWith("/")) continue;
    const n = open.get(tag) ?? 0;
    if (close) {
      if (n <= 0) over.add(tag);
      else open.set(tag, n - 1);
    } else {
      open.set(tag, n + 1);
    }
  }
  return [...over];
}

let ok = 0;
const broken = [];
const suspect = [];
const stray = [];

for (const name of readdirSync(DIR)) {
  if (!name.endsWith(".json")) continue;
  const path = join(DIR, name);
  try {
    const post = JSON.parse(readFileSync(path, "utf8"));
    const missing = REQUIRED.filter((k) => !post[k]);
    if (missing.length) throw new Error(`項目が足りない: ${missing.join(", ")}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date)) throw new Error(`日付の形式が不正: ${post.date}`);
    // 読めはするので公開は止めない。ただし見つけたら必ず知らせる
    const found = RAW_MARKDOWN.filter((r) => r.re.test(post.html)).map((r) => r.what);
    if (found.length) suspect.push({ name, found });
    const odd = strayTags(post.html);
    if (odd.length) stray.push({ name, odd });
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
if (suspect.length) {
  console.log("以下はMarkdownが変換されずに残っています (管制塔のHTML書き出しを確認):");
  for (const s of suspect) console.log(`  ${s.name} — ${s.found.join(" / ")}`);
  console.log("::warning::Markdownが変換されていない記事があります");
}
if (stray.length) {
  console.log("以下にHTMLではないタグが混ざっています (管制塔の書き出しを確認):");
  for (const s of stray) console.log(`  ${s.name} — <${s.odd.join("> <")}>`);
  console.log("::warning::HTMLではないタグが混ざった記事があります");
}

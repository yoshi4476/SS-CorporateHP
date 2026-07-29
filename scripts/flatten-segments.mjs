// Next.js 16 の静的書き出しは、クライアントルーターが先読みするセグメントファイルを
// 入れ子ディレクトリ (company/__next.company/__PAGE__.txt) として出力するが、
// ブラウザはドット区切り (company/__next.company.__PAGE__.txt) で要求するため404になる。
// 先読みが失敗してもページ遷移自体は成立するが、遷移が毎回フルロードになり
// コンソールが404で埋まるので、ドット区切りの別名を複製して両方に応答できるようにする。

import { readdir, copyFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("../out/", import.meta.url));

let copied = 0;

/** __next.* ディレクトリ配下を辿り、ドット連結した名前で複製する */
async function flatten(dir, prefix, destDir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const name = `${prefix}.${e.name}`;
    if (e.isDirectory()) {
      await flatten(join(dir, e.name), name, destDir);
    } else {
      await copyFile(join(dir, e.name), join(destDir, name));
      copied++;
    }
  }
}

async function walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const full = join(dir, e.name);
    if (e.name.startsWith("__next.")) {
      // 例: __next.services → 拡張子を外した "__next.services" が接頭辞
      await flatten(full, e.name.replace(/\.txt$/, ""), dir);
    } else {
      await walk(full);
    }
  }
}

await walk(OUT);
console.log(`flatten-segments: ${copied} 件のセグメントファイルを複製しました`);

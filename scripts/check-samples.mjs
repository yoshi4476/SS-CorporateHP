// 制作見本（/samples/<名前>/）が見られるかを確かめる。見られなければ終了コード 1（Actions が失敗として知らせる）。
//
//   node check-samples.mjs --files <samples のフォルダ>                  配信の前: 7件の index.html がそろっているか
//   node check-samples.mjs --base https://example.jp --page /cases/      配信の後と毎日: 本番で開けるか・CSP が無いか・
//                                                                         元のページから7件へのリンクがあるか
//
// 2026-11-20 に見本を claude.ai のアーティファクトからサイトの中へ移した。アーティファクトは版を直すたびに共有を
// やり直す必要があり見られなくなった。サイトの中でも、全ページ用の CSP が見本のスクリプトを止めた（リズコム）。
// 見本は CONFLUX PARTNERS・リズコム・セブンセンシズの3サイトに同じものを置いている（どれかを直したら3つともそろえる）。
import { existsSync } from "node:fs";
import { join } from "node:path";

export const NAMES = ["artmake", "india-recruit", "luxury-guide", "kaitori", "seikotsuin", "realestate-satei", "yakiniku"];
const UA = { "User-Agent": "samples-check" };

function arg(name) {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : undefined;
}

// 1件の見本の応答を判定する（理由の一覧。空なら見られる）
export function judgeSample(status, headers, body) {
  const out = [];
  if (status !== 200) out.push(`応答が ${status}`);
  if (headers.get("content-security-policy")) out.push("CSP が付いている（見本のスクリプト・書体が止まる）");
  if (status === 200 && !body.includes("noindex")) out.push("見本のページではない（noindex が無い。別のページが返っている）");
  return out;
}

// 元のページから見本へのリンクが無い名前
export function missingLinks(body) {
  return NAMES.filter((n) => !body.includes(`/samples/${n}/`));
}

async function get(url) {
  // 配信の直後は反映に少し時間がかかるので、数回試す
  let last;
  for (let i = 1; i <= 5; i++) {
    try {
      const res = await fetch(url, { headers: UA, redirect: "follow" });
      last = { status: res.status, headers: res.headers, body: await res.text() };
      if (res.ok) return last;
    } catch (e) {
      last = { status: String(e && e.message), headers: new Headers(), body: "" };
    }
    await new Promise((r) => setTimeout(r, 6000));
  }
  return last;
}

async function main() {
  const fails = [];
  const dir = arg("--files");
  if (dir) {
    for (const n of NAMES) if (!existsSync(join(dir, n, "index.html"))) fails.push(`${n}: ${dir} に index.html が無い`);
  } else {
    const base = arg("--base");
    const page = arg("--page");
    if (!base || !page) throw new Error("--files か、--base と --page を渡してください");
    for (const n of NAMES) {
      const r = await get(`${base}/samples/${n}/`);
      const why = judgeSample(r.status, r.headers, r.body);
      console.log(`${why.length ? "NG" : "OK"}  /samples/${n}/${why.length ? "（" + why.join("・") + "）" : ""}`);
      if (why.length) fails.push(`${n}: ${why.join("・")}`);
    }
    const p = await get(base + page);
    const miss = p.status === 200 ? missingLinks(p.body) : NAMES;
    console.log(`${miss.length ? "NG" : "OK"}  ${page} から見本へのリンク${miss.length ? `（無い: ${miss.join("・")}）` : ""}`);
    if (miss.length) fails.push(`${page} から見本へのリンクが無い: ${miss.join("・")}`);
  }
  if (fails.length) {
    console.error(`制作見本が見られません（${fails.length}件）:\n  ` + fails.join("\n  "));
    process.exit(1);
  }
  console.log("SAMPLES_OK=yes");
}

// 試し（check-samples.test.mjs）は判定の関数だけを読む
if (!process.env.CHECK_SAMPLES_NO_MAIN) await main();

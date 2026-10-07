import fs from "node:fs";
import path from "node:path";

/**
 * 記事の探し方の入口（フッター・ブログの一覧で使う）。
 * 管制塔が置くまとめのページ（比較表・用語集・キーワード別）と調査のページは、どこからもリンクが無く
 * 孤立していた（/research/ai-answers は0本）。ページの一覧は管制塔が書き出す JSON から作り、
 * ファイルが無い回・ページが消えた回は出さない（管制塔の sitemap 雛形と同じく import せずに読む）。
 * ビルド時だけ読む（node:fs）。クライアントのコンポーネントから import しない。
 */
export type ReadingLink = { href: string; label: string };

const AGGREGATE_LABEL: Record<string, string> = {
  compare: "比較表から探す",
  glossary: "用語集",
  // /blog/theme（テーマから探す）と名前が重なるため、キーワードで束ねたことが分かる名前にする
  topics: "キーワード別の記事",
};

function readJson(...seg: string[]): unknown {
  const f = path.join(process.cwd(), "src", "content", ...seg);
  if (!fs.existsSync(f)) return null;
  try {
    return JSON.parse(fs.readFileSync(f, "utf-8"));
  } catch {
    return null;
  }
}

export function readingLinks(): ReadingLink[] {
  const out: ReadingLink[] = [{ href: "/blog/theme", label: "テーマから探す" }];
  const agg = readJson("aggregate", "pages.json") as { pages?: Record<string, { title?: string }> } | null;
  for (const [key, page] of Object.entries(agg?.pages ?? {})) {
    if (key.includes("/")) continue;
    out.push({ href: `/${key}`, label: AGGREGATE_LABEL[key] ?? page.title ?? key });
  }
  if (readJson("research", "ai-answers.json")) {
    out.push({ href: "/research/ai-answers", label: "AIへの聞き取り調査" });
  }
  return out;
}

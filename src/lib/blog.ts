import fs from "node:fs";
import path from "node:path";

/**
 * ブログ記事の読み込み。
 *
 * 記事は自動化エンジン（SS-AIO-LP リポジトリ）が src/content/blog/*.json に書き出す。
 * MarkdownからHTMLへの変換と品質審査はエンジン側（Python）で完了しているため、
 * ここでは出来上がったデータを読むだけにしている（npmパッケージを増やさない方針）。
 *
 * ビルド時にのみ読み込まれる（各記事ページは generateStaticParams で静的生成）。
 */
export type BlogFaq = { q: string; a: string };

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  dateModified: string;
  category: string; // カテゴリのスラッグ
  categoryName: string; // 表示名
  eyecatch?: string;
  html: string; // 本文HTML（エンジンが生成）
  faq?: BlogFaq[];
  readingMinutes: number;
};

export const blogCategories: Record<string, string> = {
  management: "店舗経営",
  hr: "採用・人材育成",
  operation: "オペレーション改善",
  dx: "店舗DX・AI活用",
  case: "導入事例",
};

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "blog");

function readAll(): BlogPost[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const posts: BlogPost[] = [];
  for (const name of fs.readdirSync(CONTENT_DIR)) {
    if (!name.endsWith(".json")) continue;
    try {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, name), "utf8");
      const p = JSON.parse(raw) as BlogPost;
      if (p.slug && p.title && p.html) posts.push(p);
    } catch {
      // 壊れた記事ファイルはサイト全体を落とさず読み飛ばす
    }
  }
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const posts: BlogPost[] = readAll();

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function postsByCategory(category: string) {
  return posts.filter((p) => p.category === category);
}

/** 同カテゴリを優先した関連記事 */
export function relatedPosts(slug: string, limit = 3) {
  const base = getPost(slug);
  if (!base) return [];
  const same = posts.filter((p) => p.slug !== slug && p.category === base.category);
  const others = posts.filter((p) => p.slug !== slug && p.category !== base.category);
  return [...same, ...others].slice(0, limit);
}

/** 2026.07.30 形式の表示用日付 */
export function displayDate(iso: string) {
  return iso.replaceAll("-", ".");
}

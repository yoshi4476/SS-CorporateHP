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
  eyecatchWebp?: string; // 表示用（軽い）。OG画像は eyecatch（PNG）のまま
  photo?: string; // 一覧・記事の頭に出す写真（管制塔の写真の棚から）。無ければ eyecatch を出す
  html: string; // 本文HTML（エンジンが生成）
  faq?: BlogFaq[];
  readingMinutes: number;
  noindex?: boolean; // 検索から外した記事（管制塔の scripts/noindex.py）。ページは作り、一覧・関連・サイトマップには出さない
};

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "blog");

/**
 * 画像パスの補正 (管制塔側の不具合に対する防御)。
 *
 * 管制塔は画像を public/images/blog/<slug>/ に配置する一方、本文HTMLと
 * eyecatch には /images/<slug>/ と書き出してくる (2026-07-30 時点で継続中)。
 * そのままでは記事内の画像がすべて404になるため、読み込み時に直す。
 * 正しいパスに対しては何も起きないので、管制塔が直っても支障はない。
 */
function fixImagePaths(p: BlogPost): BlogPost {
  const from = `/images/${p.slug}/`;
  const to = `/images/blog/${p.slug}/`;
  if (!p.html.includes(from) && !p.eyecatch?.includes(from)) return p;
  return {
    ...p,
    html: p.html.replaceAll(from, to),
    ...(p.eyecatch ? { eyecatch: p.eyecatch.replaceAll(from, to) } : {}),
  };
}

/**
 * 記事本文の自サイトリンクを整える。
 *
 * 管制塔は絶対URL + 末尾スラッシュで書き出すため、
 * 228本すべてが 308 リダイレクトを1回挟んでいた。
 * さらに8本は target="_blank" が付き、自サイトが新しいタブで開いていた。
 * 他ドメイン (ai. / lp.) のリンクは別サイトなので触らない。
 */
function fixInternalLinks(p: BlogPost): BlogPost {
  const origin = "https://corp.7senses.co.jp";
  // 変換されずに残ったMarkdownのリンク記法が、そのまま文字として
  // 画面に出ていた (2026-09-01 に2本)。まずリンクに直してから正規化する。
  const html = p.html
    .replace(/(^|[^!])\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g, '$1<a href="$3">$2</a>')
    .replace(/<a\s[^>]*>/g, (tag) => {
      const m = /href="([^"]*)"/.exec(tag);
      if (!m) return tag;
      const raw = m[1];
      const isSelf = raw.startsWith(origin) || raw.startsWith("/");
      if (!isSelf) return tag;
      // 絶対URLは相対に、末尾スラッシュは落とす。
      // どちらも 308 リダイレクトを1回挟む原因になっていた。
      const path = (raw.startsWith(origin) ? raw.slice(origin.length) : raw).replace(/\/+$/, "") || "/";
      return tag
        .replace(m[0], `href="${path}"`)
        .replace(/\starget="_blank"/g, "")
        .replace(/\srel="[^"]*"/g, "");
    });
  return html === p.html ? p : { ...p, html };
}

/**
 * アイキャッチの補完。
 *
 * 管制塔は画像を書き出しているのに、JSONの eyecatch を空のまま
 * 送ってくることがある。実ファイルがあれば拾って、記事に画像がない
 * 状態を避ける。
 */
function fillEyecatch(p: BlogPost): BlogPost {
  if (p.eyecatch) return p;
  const rel = `/images/blog/${p.slug}/eyecatch.png`;
  const abs = path.join(process.cwd(), "public", rel.replace(/^\//, ""));
  return fs.existsSync(abs) ? { ...p, eyecatch: rel } : p;
}

export type Heading = { id: string; text: string; level: 2 | 3 };

/**
 * 本文の見出しに id を振り、目次用の一覧を返す。
 * 管制塔のHTMLは id を持たないことがあるため、こちらで補う。
 */
/**
 * 本文を1か所で割る。読み進めている途中に差し込みを入れるため。
 *
 * 記事から事業ページへの本文リンクは1本も無く、集めた読者が
 * ブログの中だけを回っていた。末尾のオファーは読み切った人にしか届かない。
 * 3つ目の見出しの手前 (見出しが少なければ2つ目の手前) で割る。
 */
export function splitBody(html: string): [string, string] {
  const at = [...html.matchAll(/<h2[\s>]/g)].map((m) => m.index ?? -1).filter((i) => i >= 0);
  const cut = at[at.length >= 4 ? 2 : 1];
  if (cut === undefined) return [html, ""];
  return [html.slice(0, cut), html.slice(cut)];
}

/**
 * 最初のH2の節で、1文結論の段落の直後で割る。セルフチェックの入口を置くため。
 * 見出しの直後が段落でない記事は、結論の位置が決まらないので割らない（null）。
 * 見出しを越えて次の </h2> まで伸びないよう、最初のH2の中だけを見る。
 */
export function splitAfterLead(html: string): [string, string] | null {
  const start = html.search(/<h2[\s>]/);
  if (start < 0) return null;
  const m = /^<h2[^>]*>(?:(?!<\/h2>)[\s\S])*<\/h2>\s*<p[\s>](?:(?!<\/p>)[\s\S])*<\/p>/.exec(html.slice(start));
  if (!m) return null;
  const end = start + m[0].length;
  return [html.slice(0, end), html.slice(end)];
}

/**
 * 最初の節の終わり（2つ目のH2の手前）で割る。セルフチェックの入口を置くため。
 * 1文結論の直後に置くと、答えを読み始めたところへ割り込んでいた。
 * 2つ目のH2が無い（節が1つ）ときは割らない（null）。
 */
export function splitAfterFirstSection(html: string): [string, string] | null {
  const second = [...html.matchAll(/<h2[\s>]/g)][1]?.index;
  if (second === undefined) return null;
  return [html.slice(0, second), html.slice(second)];
}

// 経理のセルフチェックを置く記事。カテゴリが経理の記事は全部、
// それ以外（バックオフィス効率化など）は題名が経理の作業を扱うものだけ。
// 店舗の事務をAIで減らす記事のような、経理の外注判断と関係の薄い記事には出さない
const KEIRI_CATEGORIES = new Set(["keiri-bpo", "keiri-jitsumu"]);
const KEIRI_TOPIC = /経理|記帳|仕訳|帳簿|請求書|支払|経費|決算|BPO|管理部門|バックオフィス/;

export function wantsKeiriCheck(p: Pick<BlogPost, "category" | "title">): boolean {
  return KEIRI_CATEGORIES.has(p.category) || KEIRI_TOPIC.test(p.title);
}

export function withToc(html: string): { html: string; headings: Heading[] } {
  const headings: Heading[] = [];
  let seq = 0;
  // 記事HTML側のidが重複していることがある。そのままだと目次の2つ目が
  // 1つ目へ飛ぶので、後から来たほうに別のidを振り直す。
  const used = new Set<string>();
  const out = html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/g,
    (whole, lv: string, attrs: string, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, "").trim();
      if (!text) return whole;
      const found = /id="([^"]+)"/.exec(attrs);
      let id = found ? found[1] : `sec-${++seq}`;
      const keep = Boolean(found) && !used.has(id);
      if (!keep) {
        while (used.has(id)) id = `sec-${++seq}`;
        if (!found) id = `sec-${seq || ++seq}`;
      }
      used.add(id);
      headings.push({ id, text, level: Number(lv) as 2 | 3 });
      if (keep) return whole;
      const rest = attrs.replace(/\sid="[^"]*"/, "");
      return `<h${lv}${rest} id="${id}">${inner}</h${lv}>`;
    },
  );
  return { html: out, headings };
}

function readAll(): BlogPost[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const posts: BlogPost[] = [];
  for (const name of fs.readdirSync(CONTENT_DIR)) {
    if (!name.endsWith(".json")) continue;
    try {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, name), "utf8");
      const p = JSON.parse(raw) as BlogPost;
      if (p.slug && p.title && p.html) posts.push(fillEyecatch(fixInternalLinks(fixImagePaths(p))));
    } catch {
      // 壊れた記事ファイルはサイト全体を落とさず読み飛ばす
    }
  }
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// 検索から外した記事（noindex）も記事ページは作る（URL を 404 にしない）。一覧・関連・前後・サイトマップは
// posts（外した記事を除く）を使う。管制塔の scripts/noindex.py が足した行
export const allPosts: BlogPost[] = readAll();
export const posts: BlogPost[] = allPosts.filter((p) => !p.noindex);

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

/** 検索から外した記事も含めて探す（記事ページだけが使う。管制塔の scripts/noindex.py） */
export function getAnyPost(slug: string) {
  return allPosts.find((p) => p.slug === slug);
}

export function postsByCategory(category: string) {
  return posts.filter((p) => p.category === category);
}

/**
 * 記事に実際に付いているカテゴリの一覧。
 *
 * カテゴリの定義は管制塔 (SS-AIO-LP の sites/corporate.json) が持っており、
 * 表示名は各記事のJSONに categoryName として書き込まれてくる。
 * こちら側で一覧を持つと二重管理になり、管制塔でカテゴリを増やしたときに
 * 表示が食い違うため、記事の値だけを見る。
 */
export function usedCategories(): { slug: string; name: string; count: number }[] {
  const map = new Map<string, { name: string; count: number }>();
  for (const p of posts) {
    const cur = map.get(p.category);
    if (cur) cur.count++;
    else map.set(p.category, { name: p.categoryName || p.category, count: 1 });
  }
  return [...map].map(([slug, v]) => ({ slug, ...v }));
}

/** 同カテゴリを優先した関連記事 */
export function relatedPosts(slug: string, limit = 3) {
  const base = getAnyPost(slug);
  if (!base) return [];
  const same = posts.filter((p) => p.slug !== slug && p.category === base.category);
  const others = posts.filter((p) => p.slug !== slug && p.category !== base.category);
  return [...same, ...others].slice(0, limit);
}

/** 前後の記事 (posts は新しい順) */
export function adjacentPosts(slug: string) {
  const i = posts.findIndex((p) => p.slug === slug);
  if (i < 0) return { prev: undefined, next: undefined };
  return { prev: posts[i + 1], next: posts[i - 1] };
}

/** 2026.07.30 形式の表示用日付 */
export function displayDate(iso: string) {
  return iso.replaceAll("-", ".");
}

/** 一覧・記事の頭に出す画像。写真があれば写真、無ければ文字のアイキャッチ */
export function thumbOf(p: { photo?: string; eyecatchWebp?: string; eyecatch?: string }) {
  return p.photo ?? p.eyecatchWebp ?? p.eyecatch;
}

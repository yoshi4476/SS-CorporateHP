import { posts, type BlogPost } from "@/lib/blog";

/**
 * 主題ごとのまとめページ（/blog/theme/<slug>）。
 *
 * 124本が新着順の1つの一覧に並ぶだけで、「請求書のことを順に読みたい」読者の入口が無かった。
 * 記事のURLは変えず、題名で束ねて「まず読む1本」と「掘り下げる記事」に分ける。
 * 1本の記事が複数の主題に入ってよい。5本に満たない主題はページを作らない（薄いページを増やさない）。
 */
export type Theme = {
  slug: string;
  name: string;
  match: RegExp;
  pillar: RegExp; // まず読む1本を題名で選ぶ。当たらなければ一番古い記事
  lead: string;
  photo: string;
};

export const THEMES: Theme[] = [
  {
    slug: "keiri-bpo",
    name: "経理BPO・外注",
    match: /経理BPO|経理代行|外注|アウトソーシング|記帳代行|業務委託|派遣|BPO/,
    pillar: /^経理BPOとは/,
    lead: "経理をどこまで外に出せるか、費用はどう決まるか、契約と引き継ぎで何を確かめるか。外注を考え始めた段階から、依頼先を選ぶまでの記事をまとめています。",
    photo: "/images/shelf/outsource-1.webp",
  },
  {
    slug: "kicho",
    name: "記帳・仕訳",
    match: /記帳|仕訳|帳簿|勘定科目|摘要/,
    pillar: /^記帳代行とは/,
    lead: "日々の記帳と仕訳の付け方、ミスの防ぎ方、自動化できる範囲と人が確かめる範囲。帳簿づけを自社で続けるか任せるかを決める材料をまとめています。",
    photo: "/images/shelf/bookkeeping-1.webp",
  },
  {
    slug: "seikyusho",
    name: "請求書・支払・経費精算",
    match: /請求書|インボイス|支払|売掛|入金|領収|経費精算/,
    pillar: /^請求書処理の効率化とは/,
    lead: "請求書の発行と受け取り、インボイス制度への対応、支払と入金の照合、経費精算のルールづくり。毎月必ず来る処理を止めずに回すための記事をまとめています。",
    photo: "/images/shelf/invoice-1.webp",
  },
  {
    slug: "getsuji",
    name: "月次決算・電子帳簿",
    match: /月次決算|決算|年末調整|試算表|電子帳簿/,
    pillar: /^月次決算とは/,
    lead: "月次決算の進め方と早期化、電子帳簿保存法への対応。経営判断に使える数字を毎月早く出すための記事をまとめています。",
    photo: "/images/shelf/efiling-1.webp",
  },
  {
    slug: "jidoka",
    name: "経理の自動化・ツール",
    match: /自動化|AI|システム|ツール|エクセル|Excel|Python|マクロ|アプリ|freee|Notion|楽楽精算/,
    pillar: /^経理自動化ツールとは/,
    lead: "会計ソフト・経費精算システム・エクセルのマクロ・AIで、経理のどの作業が減らせるか。道具を選ぶ前に確かめることと、人の確認が残る箇所をまとめています。",
    photo: "/images/svc/keiri-bpo-1.webp",
  },
  {
    slug: "zokujin",
    name: "属人化・人手不足",
    match: /属人化|人手不足|業務フロー|マニュアル|引き継ぎ|残業|退職|効率化|業務改善|時給/,
    pillar: /^経理の属人化を解消する/,
    lead: "担当者1人に経理が集まっている、採用しても人が来ない、辞めたら回らない。業務フローとマニュアルで仕事を見える形にし、人に頼りすぎない体制を作るための記事です。",
    photo: "/images/shelf/staffing-1.webp",
  },
  {
    slug: "kojin",
    name: "個人事業主・小規模事業者",
    match: /個人事業主|フリーランス|小規模|個人経営|個人店|飲食店|建設業|農業/,
    pillar: /^経理のやり方とは/,
    lead: "個人事業主・フリーランス・小さな店の経理。帳簿の付け方、青色申告、外注するならいつからか。少人数で回すための記事をまとめています。",
    photo: "/images/shelf/bookkeeping-1.webp",
  },
];

export const MIN_POSTS = 5;

export type ThemeView = Theme & { pillarPost: BlogPost; rest: BlogPost[]; count: number };

export function themeView(t: Theme): ThemeView | undefined {
  const list = posts.filter((p) => t.match.test(p.title));
  if (list.length < MIN_POSTS) return undefined;
  const pillarPost =
    list.find((p) => t.pillar.test(p.title)) ?? [...list].sort((a, b) => (a.date < b.date ? -1 : 1))[0];
  return { ...t, pillarPost, rest: list.filter((p) => p !== pillarPost), count: list.length };
}

export const themes: ThemeView[] = THEMES.map(themeView).filter((t): t is ThemeView => Boolean(t));

export function getTheme(slug: string) {
  return themes.find((t) => t.slug === slug);
}

/** 主題の記事のFAQを集める（新しい文は作らない。記事のFAQそのまま） */
export function themeFaq(t: ThemeView, limit = 6) {
  const seen = new Set<string>();
  const out: { q: string; a: string; slug: string }[] = [];
  for (const p of [t.pillarPost, ...t.rest]) {
    const f = p.faq?.[0];
    if (!f || seen.has(f.q)) continue;
    seen.add(f.q);
    out.push({ ...f, slug: p.slug });
    if (out.length >= limit) break;
  }
  return out;
}

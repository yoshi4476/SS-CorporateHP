// 入口のリンクは、クローラーに見せる行き先をクエリの無い1つの URL にする（/tools/keiri-check・/contact）。
// 出どころ（from）・1問目の答え（q1）・相談の種類（s）は、リンクの data-entry-* に書き、押したときにこのタブの中だけで渡す。
// クエリ付きの行き先（?from=…&q1=…・?s=…）が267通りあり、Search Console で「代替ページ（適切な canonical タグあり）」が
// 53件・クロールの無駄になっていた（2026-10-12）。前からの ?from= などのリンク（外部・ブックマーク）もそのまま読む。

const KEY = "ss_entry";
const FRESH_MS = 10 * 60 * 1000;

export type Entry = { from?: string; q1?: string; s?: string };

/** リンクの data-entry-* から入口の情報を読む（無ければ null） */
export function entryOf(el: Element): Entry | null {
  const e: Entry = {};
  const from = el.getAttribute("data-entry-from");
  const q1 = el.getAttribute("data-entry-q1");
  const s = el.getAttribute("data-entry-s");
  if (from) e.from = from;
  if (q1) e.q1 = q1;
  if (s) e.s = s;
  return Object.keys(e).length ? e : null;
}

/** 押したときに、行き先のページへ入口の情報を渡す（このタブの中だけ・10分まで） */
export function saveEntry(e: Entry, path: string): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ ...e, path, at: Date.now() }));
  } catch {
    // 保存できないブラウザ（プライベートモードなど）は、入口の情報なしで開く
  }
}

/** 行き先のページで読む。URL のクエリがあればそれ（前からのリンク）、無ければ渡された情報を1回だけ使う */
export function entrySearch(path: string): string {
  const q = window.location.search;
  if (q) return q;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return "";
    sessionStorage.removeItem(KEY);
    const d = JSON.parse(raw) as Entry & { path?: string; at?: number };
    if (d.path !== path || !d.at || Date.now() - d.at > FRESH_MS) return "";
    const p = new URLSearchParams();
    for (const k of ["from", "q1", "s"] as const) if (d[k]) p.set(k, String(d[k]));
    return p.toString() ? `?${p}` : "";
  } catch {
    return "";
  }
}

/** 計測の名前を前と同じにするため、印の情報を行き先のクエリとして足した形（計測の中だけで使う） */
export function withEntry(href: string, e: Entry | null): string {
  if (!e) return href;
  const p = new URLSearchParams();
  for (const k of ["from", "q1", "s"] as const) if (e[k]) p.set(k, String(e[k]));
  return p.toString() ? `${href}${href.includes("?") ? "&" : "?"}${p}` : href;
}

// 最初に来たときの流入元と、最初に見たページ（4サイト共通の形）。管制塔（SS-AIO-LP の contact.hub.gs）が
// 台帳の「送信元ページ」に「流入: Google検索｜入口: /記事/｜送信: /contact」と入れる。流入元の名前は管制塔が決める。
// 初めて開いたページの参照元のドメイン・utm・広告のクリックの有無を180日覚える。送るのはドメインとページの場所だけ。
// 覚えられない（プライベートブラウズ・保存の拒否）ときは、そのページを開いた時点の値を送る。どちらでも送信は止めない

const KEY = "ss_first";
const DAYS = 180;

type First = { r: string; u: string; a: string; l: string; t: number };

let cur: First | null = null;

/** 初めて開いたページで1回だけ呼ぶ（FirstTouch）。覚えていれば覚えた値を返す */
export function recordFirstTouch(): First {
  if (cur) return cur;
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "null") as First | null;
    if (v && Date.now() - v.t < DAYS * 864e5) cur = v;
  } catch {
    cur = null;
  }
  if (cur) return cur;
  const q = new URLSearchParams(location.search);
  let ref = "";
  try {
    ref = document.referrer ? new URL(document.referrer).hostname : "";
  } catch {
    ref = "";
  }
  const utm = ["utm_source", "utm_medium", "utm_campaign"].map((k) => (q.get(k) || "").slice(0, 60));
  cur = { r: ref, u: utm.join("") ? utm.join("|") : "", a: q.get("gclid") ? "gclid" : "", l: location.pathname.slice(0, 150), t: Date.now() };
  try {
    localStorage.setItem(KEY, JSON.stringify(cur));
  } catch {
    // 保存できなくても、このページを開いた時点の値を送る
  }
  return cur;
}

/** 問い合わせの送信に添える欄 */
export function firstTouch(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const c = recordFirstTouch();
  const d = new Date(c.t);
  const p = (n: number) => String(n).padStart(2, "0");
  return {
    first_ref: c.r || "",
    first_utm: c.u || "",
    first_ad: c.a || "",
    first_land: c.l || "",
    first_at: `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`,
    send_page: location.pathname.slice(0, 150),
  };
}

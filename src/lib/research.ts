import fs from "node:fs";
import path from "node:path";

/**
 * AIへの聞き取り調査（/research/ai-answers）の要点。ResearchBand が小さなグラフにする。
 * 数字はすべて管制塔が置く src/content/research/ai-answers.json から数える（手で書かない）。
 * ファイルが無い回・形が変わった回は null を返し、帯ごと出さない（reading.ts と同じく import せずに読む）。
 * ビルド時だけ読む（node:fs）。クライアントのコンポーネントから import しない。
 */
export type ResearchSummary = {
  href: string;
  /** 調べた日（表示用。YYYY-MM-DD は「2026年10月4日」にする） */
  period: string;
  engines: string[];
  questions: number;
  /** AIどうしの結論が分かれた問いの数 */
  split: number;
  /** 結論が読み取れた回答の数（JSON の answers） */
  answers: number;
  /** 結論の内訳。はい・条件による・いいえ の順。数え直しが answers と合わなければ null */
  breakdown: { key: "yes" | "depends" | "no"; label: string; count: number }[] | null;
  /** 結果の読み方（JSON の readout_html からタグを外したもの） */
  readout: string;
};

type Raw = {
  period?: string;
  engines?: string[];
  rows?: { answers?: Record<string, { label?: string }> }[];
  split?: number;
  answers?: number;
  readout_html?: string;
};

const KINDS = [
  { key: "yes", label: "はい", test: (l: string) => l.startsWith("はい") },
  { key: "depends", label: "条件による", test: (l: string) => l.startsWith("条件") },
  { key: "no", label: "いいえ", test: (l: string) => l.startsWith("いいえ") },
] as const;

function jpDate(s: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  return m ? `${m[1]}年${Number(m[2])}月${Number(m[3])}日` : s;
}

export function researchSummary(): ResearchSummary | null {
  const f = path.join(process.cwd(), "src", "content", "research", "ai-answers.json");
  if (!fs.existsSync(f)) return null;
  let d: Raw;
  try {
    d = JSON.parse(fs.readFileSync(f, "utf-8"));
  } catch {
    return null;
  }
  const rows = d.rows ?? [];
  if (!rows.length || typeof d.split !== "number" || typeof d.answers !== "number" || !d.period) return null;

  const counts = KINDS.map((k) => ({
    key: k.key,
    label: k.label,
    count: rows.reduce(
      (n, r) => n + Object.values(r.answers ?? {}).filter((a) => k.test(a.label ?? "")).length,
      0,
    ),
  }));
  const total = counts.reduce((n, c) => n + c.count, 0);

  return {
    href: "/research/ai-answers",
    period: jpDate(d.period),
    engines: d.engines ?? [],
    questions: rows.length,
    split: d.split,
    answers: d.answers,
    // 「結論が読み取れず」などを除いた数え直しが、調査の集計（answers）と一致したときだけ内訳を出す
    breakdown: total === d.answers ? counts : null,
    readout: (d.readout_html ?? "").replace(/<[^>]+>/g, "").trim(),
  };
}

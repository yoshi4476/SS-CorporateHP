import Link from "next/link";
import { Reveal } from "@/components/motion";
import { researchSummary } from "@/lib/research";

// AIへの聞き取り調査（/research/ai-answers）の入口。要点を2つの小さなグラフで見せる。
// 数字は調査の JSON から数える（lib/research.ts）。JSON が無い・形が変わった回は何も出さない。
// サーバーで描くだけで、ブラウザに JavaScript を足さない。

const COLORS = {
  light: { yes: "bg-pulse", depends: "bg-line-strong", no: "bg-gold", split: "#a8641a", rest: "#c8cfda" },
  dark: { yes: "bg-aqua", depends: "bg-white/35", no: "bg-gold-bright", split: "#e8a33d", rest: "rgb(255 255 255 / 0.22)" },
};

export default function ResearchBand({ tone = "light", note }: { tone?: "light" | "dark"; note?: string }) {
  const r = researchSummary();
  if (!r) return null;
  const dark = tone === "dark";
  const c = COLORS[tone];

  // 問いを1つずつ四角で並べ、結論が分かれた問いを先頭に色を付ける
  const cols = Math.min(10, Math.ceil(r.questions / 2));
  const rows = Math.ceil(r.questions / cols);
  const S = 16;
  const G = 6;
  const w = cols * S + (cols - 1) * G;
  const h = rows * S + (rows - 1) * G;
  const depends = r.breakdown?.find((b) => b.key === "depends");

  const card = dark ? "border-white/12 bg-white/[0.05]" : "border-line bg-raise shadow-card";
  const muted = dark ? "text-white/70" : "text-slate";

  return (
    <section
      id="research"
      aria-labelledby="research-heading"
      className={`[word-break:auto-phrase] ${dark ? "relative overflow-hidden bg-ink text-white" : "border-y border-line bg-mist"}`}
    >
      {dark && <div aria-hidden className="grid-field-dark absolute inset-0 opacity-60" />}
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 md:py-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14">
        <Reveal>
          <p className={`eyebrow ${dark ? "!text-aqua" : ""}`}>当社の調査</p>
          <h2 id="research-heading" className="mt-3 text-2xl font-black leading-snug md:text-3xl">
            AIに経理の問いを{r.questions}問。
            <br className="hidden sm:block" />
            {r.split}問で、AIどうしの結論が分かれました。
          </h2>
          {depends && (
            <p className={`mt-5 text-[15px] leading-[1.9] ${muted}`}>
              結論が読み取れた{r.answers}回答のうち、「{depends.label}」は{depends.count}回答でした。
              {r.readout}
            </p>
          )}
          {note && <p className={`mt-4 text-[15px] font-bold leading-[1.9] ${dark ? "text-white" : "text-ink"}`}>{note}</p>}
          <Link
            href={r.href}
            className={`mt-7 inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-bold transition-colors ${
              dark ? "border-white/40 text-white hover:border-aqua hover:text-aqua" : "border-pulse text-pulse hover:bg-pulse hover:text-white"
            }`}
          >
            調査の結果を見る（問いごとの答えと根拠）
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path d="M2 7h9M8 3.5L11.5 7 8 10.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </Link>
          <p className={`mt-4 text-xs leading-6 ${dark ? "text-white/60" : "text-slate"}`}>
            当社調べ。{r.period}に{r.engines.join("・")}へ、検索つきで聞いた1回の結果です。
          </p>
        </Reveal>

        <Reveal delay={0.1} className="grid gap-4 sm:grid-cols-2">
          <figure className={`rounded-2xl border p-6 ${card}`}>
            <figcaption className="text-sm font-bold">結論が分かれた問い</figcaption>
            <p className="mt-3 leading-none">
              <span className="num text-5xl font-bold">{r.split}</span>
              <span className={`ml-1.5 text-base font-bold ${muted}`}>/ {r.questions}問</span>
            </p>
            <svg
              viewBox={`0 0 ${w} ${h}`}
              width={w}
              height={h}
              className="mt-5 h-auto max-w-full"
              role="img"
              aria-label={`${r.questions}問のうち${r.split}問で、AIどうしの結論が分かれた`}
            >
              {Array.from({ length: r.questions }, (_, i) => (
                <rect
                  key={i}
                  x={(i % cols) * (S + G)}
                  y={Math.floor(i / cols) * (S + G)}
                  width={S}
                  height={S}
                  rx={4}
                  fill={i < r.split ? c.split : c.rest}
                />
              ))}
            </svg>
            <p className={`mt-4 text-xs leading-6 ${muted}`}>
              <span aria-hidden className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm align-[-1px]" style={{ background: c.split }} />
              分かれた問い
              <span aria-hidden className="ml-4 mr-1.5 inline-block h-2.5 w-2.5 rounded-sm align-[-1px]" style={{ background: c.rest }} />
              分かれなかった問い
            </p>
          </figure>

          {r.breakdown && (
            <figure className={`rounded-2xl border p-6 ${card}`}>
              <figcaption className="text-sm font-bold">結論が読み取れた{r.answers}回答の内訳</figcaption>
              <div
                role="img"
                aria-label={`${r.answers}回答の内訳。${r.breakdown.map((b) => `${b.label}${b.count}回答`).join("、")}`}
                className="vz-grow mt-6 flex h-3.5 gap-0.5 overflow-hidden rounded-full"
              >
                {r.breakdown.map((b) => (
                  <span key={b.key} className={c[b.key]} style={{ width: `${(b.count / r.answers) * 100}%` }} />
                ))}
              </div>
              <ul className="mt-5 grid gap-2.5">
                {r.breakdown.map((b) => (
                  <li key={b.key} className="flex items-center gap-3 text-sm">
                    <span aria-hidden className={`h-2.5 w-2.5 shrink-0 rounded-full ${c[b.key]}`} />
                    <span className="flex-1">{b.label}</span>
                    <span className="num font-bold">{b.count}</span>
                    <span className={`w-8 text-xs ${muted}`}>回答</span>
                  </li>
                ))}
              </ul>
            </figure>
          )}
        </Reveal>
      </div>
    </section>
  );
}

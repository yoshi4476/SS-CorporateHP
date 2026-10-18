import { Reveal } from "@/components/motion";
import { services, areas } from "@/lib/services";
import { meoGrowth } from "@/lib/meo";

// トップの「根拠」の数字。以前は紺の面に同じ形のカードを6枚並べていた。
// 帳簿の行のように、何の数字か・数字・中身が一目で分かる小さな図・注記を罫で区切って並べる。
// 載せる数字は以前と同じ6つ（既存の事実）。新しい数字は足さない。図はサーバーで描き、JavaScript を増やさない。

// 領域ごとの色。名前は services.ts の areas から取る
const GROUP_COLOR: Record<string, string> = { 集客: "bg-pulse", 業務: "bg-gold-bright", 資金: "bg-glow" };

/** 累計の推移（2019〜2026年）の細い折れ線 */
function Spark() {
  const W = 320;
  const H = 72;
  const max = Math.max(...meoGrowth.map((d) => d.total));
  const pts = meoGrowth.map((d, i) => [
    (i / (meoGrowth.length - 1)) * (W - 14) + 4,
    H - 18 - (d.total / max) * (H - 28),
  ]);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const [ex, ey] = pts[pts.length - 1];
  const first = meoGrowth[0];
  const last = meoGrowth[meoGrowth.length - 1];
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full max-w-[20rem]"
      role="img"
      aria-label={`MEO運用の累計支援店舗数は、${first.year}年の${first.total.toLocaleString()}店舗から${last.year}年に${last.total.toLocaleString()}店舗まで増えた`}
    >
      <line x1="4" x2={W - 6} y1={H - 18} y2={H - 18} stroke="var(--color-line-strong)" strokeWidth="1" />
      <path className="vz-draw" d={line} pathLength={1} strokeDasharray="1" fill="none" stroke="var(--color-pulse)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={ex} cy={ey} r="4.5" fill="var(--color-gold-bright)" stroke="var(--color-ink)" strokeWidth="1.5" />
      <text x="4" y={H - 2} fontSize="11" fill="var(--color-slate)" className="num">{first.year}</text>
      <text x={W - 6} y={H - 2} fontSize="11" fill="var(--color-slate)" textAnchor="end" className="num">{last.year}</text>
    </svg>
  );
}

/** 割合の輪 */
function Ring({ value, label }: { value: number; label: string }) {
  const R = 25;
  const C = 2 * Math.PI * R;
  return (
    <svg viewBox="0 0 64 64" width="64" height="64" className="-rotate-90" role="img" aria-label={label}>
      <circle cx="32" cy="32" r={R} fill="none" stroke="var(--color-mist)" strokeWidth="7" />
      <circle
        className="vz-ring"
        cx="32"
        cy="32"
        r={R}
        fill="none"
        stroke="var(--color-pulse)"
        strokeWidth="7"
        strokeDasharray={C}
        strokeDashoffset={C * (1 - value / 100)}
        style={{ "--vz-c": `${C}px`, "--vz-off": `${C * (1 - value / 100)}px` } as React.CSSProperties}
      />
    </svg>
  );
}

/** 横棒（前と後、または全体と削れる分）。値は棒の先に添える */
function Bars({ rows, label }: { rows: { name: string; value: number; max: number; tone: "base" | "accent" | "cut"; tag?: string }[]; label: string }) {
  return (
    <div role="img" aria-label={label} className="grid w-full max-w-[20rem] gap-2">
      {rows.map((r) => (
        <div key={r.name} className="grid grid-cols-[3.4rem_minmax(0,1fr)_2.6rem] items-center gap-2 text-[13px] text-slate">
          <span>{r.name}</span>
          <span className="relative block h-2.5 bg-mist">
            <span
              className={`vz-grow absolute inset-y-0 left-0 ${r.tone === "accent" ? "bg-pulse" : "bg-line-strong"}`}
              style={{ width: `${(r.value / r.max) * 100}%` }}
            />
            {r.tone === "cut" && (
              // 削れる分は斜線で示す（色だけに頼らない）
              <span
                className="absolute inset-y-0 right-0 border border-pulse/60"
                style={{
                  width: `${100 - (r.value / r.max) * 100}%`,
                  background: "repeating-linear-gradient(135deg, rgb(30 58 100 / 0.35) 0 2px, transparent 2px 6px)",
                }}
              />
            )}
          </span>
          <span className="num text-right font-bold text-ink">{r.tag}</span>
        </div>
      ))}
    </div>
  );
}

export default function NumberWall() {
  const groups = areas.map((a) => ({ g: a.group, name: a.name, n: services.filter((s) => s.group === a.group).length }));
  const first = meoGrowth[0];
  const last = meoGrowth[meoGrowth.length - 1];

  const tiles: { value: string; suffix: string; label: string; note: React.ReactNode; figure: React.ReactNode }[] = [
    {
      value: last.total.toLocaleString("ja-JP"),
      suffix: "店舗",
      label: "MEO運用の通算支援",
      note: `${first.year}〜${last.year}年の累計の推移`,
      figure: <Spark />,
    },
    {
      value: "94",
      suffix: "%",
      label: "運用サービスの契約継続率",
      note: "運用サービスの平均",
      figure: <Ring value={94} label="契約継続率94%" />,
    },
    {
      value: "1.8",
      suffix: "倍",
      label: "マップ経由アクションの平均改善",
      note: "運用前を1としたときの平均",
      figure: (
        <Bars
          label="マップ経由アクションは、運用前を1とすると運用後は平均1.8"
          rows={[
            { name: "運用前", value: 1, max: 1.8, tone: "base", tag: "1" },
            { name: "運用後", value: 1.8, max: 1.8, tone: "accent", tag: "1.8" },
          ]}
        />
      ),
    },
    {
      value: String(services.length),
      suffix: "事業",
      label: "ひとつのチームで扱う事業",
      // 色の意味を、色の点と名前で添える（色だけに頼らない）
      note: (
        <span className="flex flex-wrap gap-x-4 gap-y-1">
          {groups.map((x) => (
            <span key={x.g} className="inline-flex items-center gap-1.5">
              <span aria-hidden className={`h-2.5 w-2.5 ${GROUP_COLOR[x.g]}`} />
              {x.name}
              <span className="num font-bold text-ink">{x.n}</span>
            </span>
          ))}
        </span>
      ),
      figure: (
        <div role="img" aria-label={`${services.length}事業の内訳。${groups.map((x) => `${x.name}${x.n}事業`).join("、")}`} className="flex w-full max-w-[20rem] gap-1">
          {groups.flatMap((x) =>
            Array.from({ length: x.n }, (_, i) => <span key={`${x.g}${i}`} className={`h-6 flex-1 ${GROUP_COLOR[x.g]}`} />),
          )}
        </div>
      ),
    },
    {
      value: "30",
      suffix: "%〜",
      label: "AI導入による工数削減の目安",
      note: "斜線が、削減の目安にあたる部分",
      figure: (
        <Bars
          label="AI導入による工数削減の目安は30%から。導入前の工数を100とすると、70以下"
          rows={[
            { name: "導入前", value: 100, max: 100, tone: "base" },
            { name: "導入後", value: 70, max: 100, tone: "cut", tag: "−30%" },
          ]}
        />
      ),
    },
    {
      value: "350",
      suffix: "万円",
      label: "受発注・会計ソフトの補助上限",
      note: "インボイス枠の補助上限",
      figure: (
        <ul aria-label="対象になるソフトの例" className="flex flex-wrap gap-2">
          {["受発注ソフト", "会計ソフト"].map((t) => (
            <li key={t} className="rounded-sm border border-line-strong px-3 py-1 text-[13px] font-bold text-ink">
              {t}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <dl className="grid gap-x-10 [word-break:auto-phrase] md:grid-cols-2">
      {tiles.map((t) => (
        <Reveal key={t.label} className="border-t border-line-strong py-6">
          <dt className="text-sm font-bold text-ink">{t.label}</dt>
          <dd className="mt-2">
            <p className="mega-num text-[2.75rem] text-ink md:text-5xl">
              {t.value}
              <span className="ml-1 text-xl font-bold">{t.suffix}</span>
            </p>
            <div className="mt-4 flex min-h-16 items-end">{t.figure}</div>
            <div className="mt-3 text-[13px] leading-6 text-slate">{t.note}</div>
          </dd>
        </Reveal>
      ))}
    </dl>
  );
}

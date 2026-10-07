import { Reveal, CountUp } from "@/components/motion";
import { services, areas } from "@/lib/services";
import { meoGrowth } from "@/lib/meo";

// トップの「成果は、数字で語る。」の区画。以前は大きな数字と小さな説明だけで、何の数字か・どれくらいかが
// 読み取りにくかった。数字ごとに、その中身が一目で分かる小さな図を添える。
// 載せる数字は以前と同じ6つ（既存の事実）。新しい数字は足さない。図はサーバーで描き、JavaScript を増やさない。
// 紺の面の上に置くため、色は暗い面用（aqua・gold-bright・白の濃淡）で組む。

// 領域ごとの色（暗い面用）。名前は services.ts の areas から取る
const GROUP_COLOR: Record<string, string> = { 集客: "bg-aqua", 業務: "bg-gold-bright", 資金: "bg-glow" };

/** 累計の推移（2019〜2026年）の細い折れ線。枠の幅いっぱいに伸ばす */
function Spark() {
  const W = 320;
  const H = 72;
  const max = Math.max(...meoGrowth.map((d) => d.total));
  const pts = meoGrowth.map((d, i) => [
    (i / (meoGrowth.length - 1)) * (W - 14) + 4,
    H - 18 - (d.total / max) * (H - 28),
  ]);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)},${H - 18} L${pts[0][0].toFixed(1)},${H - 18} Z`;
  const [ex, ey] = pts[pts.length - 1];
  const first = meoGrowth[0];
  const last = meoGrowth[meoGrowth.length - 1];
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label={`MEO運用の累計支援店舗数は、${first.year}年の${first.total.toLocaleString()}店舗から${last.year}年に${last.total.toLocaleString()}店舗まで増えた`}
    >
      <line x1="4" x2={W - 6} y1={H - 18} y2={H - 18} stroke="rgb(255 255 255 / 0.18)" strokeWidth="1" />
      <path d={area} fill="rgb(116 199 214 / 0.14)" />
      <path className="vz-draw" d={line} pathLength={1} strokeDasharray="1" fill="none" stroke="#74c7d6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={ex} cy={ey} r="4.5" fill="#e8a33d" stroke="#0d1420" strokeWidth="2" />
      <text x="4" y={H - 2} fontSize="11" fill="rgb(255 255 255 / 0.6)" className="num">{first.year}</text>
      <text x={W - 6} y={H - 2} fontSize="11" fill="rgb(255 255 255 / 0.6)" textAnchor="end" className="num">{last.year}</text>
    </svg>
  );
}

/** 割合の輪 */
function Ring({ value, label }: { value: number; label: string }) {
  const R = 25;
  const C = 2 * Math.PI * R;
  return (
    <svg viewBox="0 0 64 64" width="72" height="72" className="-rotate-90" role="img" aria-label={label}>
      <circle cx="32" cy="32" r={R} fill="none" stroke="rgb(255 255 255 / 0.14)" strokeWidth="7" />
      <circle
        className="vz-ring"
        cx="32"
        cy="32"
        r={R}
        fill="none"
        stroke="#74c7d6"
        strokeWidth="7"
        strokeLinecap="round"
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
    <div role="img" aria-label={label} className="grid w-full gap-2.5">
      {rows.map((r) => (
        <div key={r.name} className="grid grid-cols-[3.4rem_minmax(0,1fr)_2.6rem] items-center gap-2 text-xs text-white/70">
          <span>{r.name}</span>
          <span className="relative block h-3 overflow-hidden rounded-r">
            <span
              className={`vz-grow absolute inset-y-0 left-0 rounded-r ${r.tone === "accent" ? "bg-gold-bright" : "bg-white/30"}`}
              style={{ width: `${(r.value / r.max) * 100}%` }}
            />
            {r.tone === "cut" && (
              // 削れる分は斜線で示す（色だけに頼らない）
              <span
                className="absolute inset-y-0 right-0 rounded-r border border-gold-bright/70"
                style={{
                  width: `${100 - (r.value / r.max) * 100}%`,
                  background: "repeating-linear-gradient(135deg, rgb(232 163 61 / 0.55) 0 2px, transparent 2px 6px)",
                }}
              />
            )}
          </span>
          <span className="num text-right font-bold text-white/85">{r.tag}</span>
        </div>
      ))}
    </div>
  );
}

export default function NumberWall() {
  const groups = areas.map((a) => ({ g: a.group, name: a.name, n: services.filter((s) => s.group === a.group).length }));
  const first = meoGrowth[0];
  const last = meoGrowth[meoGrowth.length - 1];

  const tiles: { value: number; suffix: string; label: string; note: React.ReactNode; figure: React.ReactNode }[] = [
    {
      value: last.total,
      suffix: "店舗",
      label: "MEO運用の通算支援",
      note: `${first.year}〜${last.year}年の累計の推移`,
      figure: <Spark />,
    },
    {
      value: 94,
      suffix: "%",
      label: "運用サービスの契約継続率",
      note: "運用サービスの平均",
      figure: <Ring value={94} label="契約継続率94%" />,
    },
    {
      value: 1.8,
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
      value: services.length,
      suffix: "事業",
      label: "ひとつのチームで扱う事業",
      // 色の意味を、色の点と名前で添える（色だけに頼らない）
      note: (
        <span className="flex flex-wrap gap-x-4 gap-y-1">
          {groups.map((x) => (
            <span key={x.g} className="inline-flex items-center gap-1.5">
              <span aria-hidden className={`h-2.5 w-2.5 rounded-sm ${GROUP_COLOR[x.g]}`} />
              {x.name}
              <span className="num font-bold text-white/85">{x.n}</span>
            </span>
          ))}
        </span>
      ),
      figure: (
        <div role="img" aria-label={`${services.length}事業の内訳。${groups.map((x) => `${x.name}${x.n}事業`).join("、")}`} className="flex w-full gap-1">
          {groups.flatMap((x) =>
            Array.from({ length: x.n }, (_, i) => <span key={`${x.g}${i}`} className={`h-7 flex-1 rounded-[4px] ${GROUP_COLOR[x.g]}`} />),
          )}
        </div>
      ),
    },
    {
      value: 30,
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
      value: 350,
      suffix: "万円",
      label: "受発注・会計ソフトの補助上限",
      note: "インボイス枠の補助上限",
      figure: (
        <ul aria-label="対象になるソフトの例" className="flex flex-wrap gap-2">
          {["受発注ソフト", "会計ソフト"].map((t) => (
            <li key={t} className="rounded-full border border-white/30 px-3 py-1 text-xs font-bold text-white/85">
              {t}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <div className="mt-14 grid gap-4 [word-break:auto-phrase] sm:grid-cols-2 lg:grid-cols-3">
      {tiles.map((t, i) => (
        <Reveal key={t.label} delay={(i % 3) * 0.08} className="h-full">
          <div className="flex h-full flex-col rounded-2xl border border-white/12 bg-white/[0.04] p-6 md:p-7">
            <p className="text-sm font-bold leading-6 text-white/85">{t.label}</p>
            <p className="mega-num mt-3 text-5xl text-white md:text-6xl">
              <CountUp value={t.value} duration={1.4 + (i % 3) * 0.3} />
              <span className="ml-1 text-2xl text-gold-bright md:text-3xl">{t.suffix}</span>
            </p>
            <div className="mt-6 flex min-h-[4.5rem] items-end">{t.figure}</div>
            <div className="mt-4 border-t border-white/10 pt-3 text-sm leading-6 text-white/65">{t.note}</div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

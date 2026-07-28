// ヒーロー下部: 実績ダッシュボードのカード列 (CSSアニメーションのみ)。

const SPARK = [150, 420, 850, 1350, 1950, 2500, 2950, 3200]; // 累計支援社数 (実績)
const W = 260;
const H = 84;
const MAX = 3500;

function sparkPath() {
  const pts = SPARK.map((v, i) => `${(i / (SPARK.length - 1)) * W},${H - (v / MAX) * H}`);
  return { line: `M${pts.join(" L")}`, area: `M${pts.join(" L")} L${W},${H} L0,${H} Z` };
}

export default function HeroVisual({ className }: { className?: string }) {
  const { line, area } = sparkPath();
  return (
    <div className={className} aria-label="実績ダッシュボード" role="img">
      <div className="flex flex-wrap items-stretch justify-center gap-4 md:gap-6">
        {/* 順位改善 */}
        <div
          className="animate-float w-56 -rotate-2 rounded-2xl border border-line bg-raise/95 p-5 shadow-lift backdrop-blur"
          style={{ animationDelay: "-2s" }}
        >
          <p className="font-data text-[0.6rem] uppercase tracking-[0.24em] text-slate">MEO Ranking</p>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-[0.65rem] text-slate">開始時</p>
              <p className="num text-2xl font-bold text-slate">21位</p>
            </div>
            <svg width="34" height="20" viewBox="0 0 34 20" aria-hidden className="mb-1 text-pulse">
              <path d="M2 10h24M20 4l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <p className="text-[0.65rem] text-slate">90日後</p>
              <p className="num text-3xl font-bold text-pulse">2位</p>
            </div>
          </div>
          <p className="mt-3 rounded-full bg-aqua/60 px-2.5 py-1 text-center text-[0.6rem] font-bold">
            エリア名+居酒屋 (大阪市)
          </p>
        </div>

        {/* 累計支援グラフ */}
        <div className="animate-float w-80 rounded-2xl border border-line bg-raise p-5 shadow-lift">
          <div className="flex items-baseline justify-between">
            <p className="font-data text-[0.6rem] uppercase tracking-[0.24em] text-slate">Total Clients</p>
            <span className="rounded-full bg-pulse/10 px-2.5 py-0.5 font-data text-[0.6rem] font-bold text-pulse">
              2019 — 2026
            </span>
          </div>
          <div className="mt-2 flex items-end justify-between gap-4">
            <div className="shrink-0">
              <p className="num text-4xl font-bold leading-none">
                3,200<span className="ml-0.5 text-xl text-pulse">社</span>
              </p>
              <p className="mt-1.5 text-[0.62rem] text-slate">MEO運用 通算支援実績</p>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-36" aria-hidden>
              <defs>
                <linearGradient id="heroSpark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2b4bff" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2b4bff" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path d={area} fill="url(#heroSpark)" />
              <path d={line} fill="none" stroke="#2b4bff" strokeWidth="3" strokeLinecap="round" />
              <circle cx={W} cy={H - (SPARK[SPARK.length - 1] / MAX) * H} r="6" fill="#22d3ee" stroke="#0b1220" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* 採択率ゲージ */}
        <div
          className="animate-float w-56 rotate-2 rounded-2xl border border-line bg-raise/95 p-5 shadow-lift backdrop-blur"
          style={{ animationDelay: "-4s" }}
        >
          <p className="font-data text-[0.6rem] uppercase tracking-[0.24em] text-slate">Subsidy</p>
          <div className="mt-2 flex items-center gap-4">
            <svg viewBox="0 0 60 60" className="h-14 w-14 -rotate-90" aria-hidden>
              <circle cx="30" cy="30" r="24" fill="none" stroke="#dfe6f0" strokeWidth="7" />
              <circle
                cx="30"
                cy="30"
                r="24"
                fill="none"
                stroke="#2b4bff"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 24 * 0.9} ${2 * Math.PI * 24}`}
              />
            </svg>
            <div>
              <p className="num text-2xl font-bold leading-none">
                90<span className="text-sm text-pulse">%+</span>
              </p>
              <p className="mt-1 text-[0.62rem] leading-4 text-slate">
                補助金 採択通過率
                <br />
                上限<span className="num font-bold text-ink">350万円</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

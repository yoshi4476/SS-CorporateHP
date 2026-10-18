// MEO の実績の図。サーバーで描き、JS を読まない。
// 伸びる動きは globals.css の vz-*（Reveal が画面に入ったときに1回だけ付ける）。

const INDUSTRY: { label: string; value: number }[] = [
  { label: "飲食", value: 32 },
  { label: "美容・サロン", value: 24 },
  { label: "医療・歯科", value: 18 },
  { label: "小売・物販", value: 10 },
  { label: "士業・スクール", value: 9 },
  { label: "その他", value: 7 },
];

export function IndustryBars() {
  const max = Math.max(...INDUSTRY.map((d) => d.value));
  return (
    <figure>
      <figcaption className="text-sm font-bold text-ink">
        MEO支援先の業種構成
        <span className="ml-2 text-[13px] font-normal text-slate">(%)</span>
      </figcaption>
      <div
        className="mt-5 grid gap-3"
        role="img"
        aria-label="支援先の業種構成。飲食32%、美容サロン24%、医療歯科18%、小売10%、士業スクール9%、その他7%"
      >
        {INDUSTRY.map((d) => (
          <div key={d.label} className="grid grid-cols-[7.5rem_1fr_2.5rem] items-center gap-3">
            <span className="text-[13px] text-slate">{d.label}</span>
            <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="h-2.5 w-full" aria-hidden>
              <rect width="100" height="10" fill="var(--color-mist)" />
              <rect className="vz-grow" width={(d.value / max) * 100} height="10" fill="var(--color-pulse)" />
            </svg>
            <span className="num text-right text-sm font-bold text-ink">{d.value}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}

export function GaugeDonut({
  value,
  suffix = "%",
  label,
  sub,
}: {
  value: number;
  suffix?: string;
  label: string;
  sub?: string;
}) {
  const R = 62;
  const C = 2 * Math.PI * R;
  const off = C * (1 - value / 100);
  return (
    <figure className="flex items-center gap-5">
      <div className="relative h-28 w-28 shrink-0">
        <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90" role="img" aria-label={`${label} ${value}${suffix}`}>
          <circle cx="80" cy="80" r={R} fill="none" stroke="var(--color-mist)" strokeWidth="14" />
          <circle
            className="vz-ring"
            cx="80"
            cy="80"
            r={R}
            fill="none"
            stroke="var(--color-pulse)"
            strokeWidth="14"
            strokeDasharray={C}
            strokeDashoffset={off}
            style={{ "--vz-c": C, "--vz-off": off } as React.CSSProperties}
          />
        </svg>
        <p className="num absolute inset-0 flex items-center justify-center text-2xl font-bold">
          {value}
          {suffix}
        </p>
      </div>
      <figcaption className="text-sm font-bold text-ink">
        {label}
        {sub && <span className="mt-1 block text-[13px] font-normal text-slate">{sub}</span>}
      </figcaption>
    </figure>
  );
}

const RANKS: { industry: string; area: string; keyword: string; before: number; after: number }[] = [
  { industry: "飲食(居酒屋)", area: "大阪市", keyword: "エリア名+居酒屋", before: 21, after: 2 },
  { industry: "美容室", area: "神戸市", keyword: "エリア名+美容室", before: 15, after: 3 },
  { industry: "歯科医院", area: "京都市", keyword: "エリア名+歯医者", before: 12, after: 1 },
  { industry: "整体院", area: "堺市", keyword: "エリア名+整体", before: 28, after: 4 },
];

export function RankTable() {
  return (
    <figure className="overflow-x-auto border-t border-ink">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <caption className="sr-only">MEO運用によるGoogleマップ検索順位の改善例</caption>
        <thead>
          <tr className="border-b border-line text-[13px] text-slate">
            <th scope="col" className="py-3 pr-4 text-left font-bold">業種</th>
            <th scope="col" className="p-3 text-left font-bold">エリア</th>
            <th scope="col" className="p-3 text-left font-bold">対策キーワード</th>
            <th scope="col" className="p-3 text-right font-bold">開始時</th>
            <th scope="col" className="py-3 pl-3 text-right font-bold">90日後</th>
          </tr>
        </thead>
        <tbody>
          {RANKS.map((r) => (
            <tr key={r.industry} className="border-b border-line">
              <td className="py-3.5 pr-4 font-bold">{r.industry}</td>
              <td className="p-3.5 text-slate">{r.area}</td>
              <td className="p-3.5 text-slate">{r.keyword}</td>
              <td className="num p-3.5 text-right text-slate">{r.before}位</td>
              <td className="num py-3.5 pl-3 text-right text-base font-bold text-pulse">{r.after}位</td>
            </tr>
          ))}
        </tbody>
      </table>
      <figcaption className="pt-3 text-[13px] text-slate">Googleマップ検索順位の改善例(運用開始から90日間)</figcaption>
    </figure>
  );
}

// 経理を外に任せるときの費用の目安。当社の料金表ではなく、公開されている相場（出典つき）。
// 数字は管制塔の data/price_ranges.json（corporate・2026-11-11 確認）と同じもの。変えるときは両方をそろえる。
// 経理BPO（まるごと）の相場を先に置き、記帳だけの単品の額を経理BPOの相場として見せない（運用者の決定 2026-11-11）。

const SOURCE = {
  name: "ITトレンド「経理アウトソーシングの費用相場」",
  url: "https://it-trend.jp/accounting_outsourcing/article/654-7419",
  note: "2026年6月26日更新・2026年11月11日に確認",
};

const ROWS: { label: string; range: string; note?: string; main?: boolean }[] = [
  {
    label: "経理をまるごと任せる（経理BPO・月次決算まで）",
    range: "月10万〜30万円",
    note: "従業員50名規模で月15万〜25万円。業務の流れを作る初期費用5万〜30万円が、別にかかることが多い",
    main: true,
  },
  { label: "記帳に、振込・給与計算を足して任せる", range: "月3万〜10万円" },
  { label: "記帳だけを任せる", range: "月1万〜3万円", note: "経理BPOではなく、記帳だけを単品で頼む場合の額" },
  { label: "比べる相手: 経理担当の正社員を1人雇う", range: "年400万〜600万円" },
];

export default function KeiriCostGuide() {
  return (
    <figure className="[word-break:auto-phrase]">
      <dl className="grid gap-4 md:grid-cols-3">
        {ROWS.map((r) => (
          <div
            key={r.label}
            className={`rounded-2xl border p-6 shadow-card ${r.main ? "border-pulse/40 bg-pulse/[0.05] md:col-span-3" : "border-line bg-raise"}`}
          >
            <dt className="text-[15px] font-bold leading-7 text-ink">{r.label}</dt>
            <dd className="mt-2">
              <span className={`block font-black tabular-nums ${r.main ? "text-3xl text-pulse md:text-4xl" : "text-2xl text-ink"}`}>{r.range}</span>
              {r.note && <span className="mt-2 block text-sm leading-7 text-slate">{r.note}</span>}
            </dd>
          </div>
        ))}
      </dl>
      <figcaption className="mt-6 text-sm leading-7 text-slate">
        任せる業務を足すほど、費用は加わります。業務の内容によって、追加の費用がかかります。
        <span className="mt-1 block text-xs">
          出典:{" "}
          <a href={SOURCE.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
            {SOURCE.name}
          </a>
          （{SOURCE.note}）
        </span>
      </figcaption>
    </figure>
  );
}

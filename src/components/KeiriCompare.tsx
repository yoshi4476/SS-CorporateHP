// 経理の手を確保する3つの形（自社で担当・派遣/パート・外注）の比較表。
// 比べる軸と中身は、経理BPOのページと記事（経理BPOと人材派遣の違い・管理部門の人手不足の5つの選択肢）に
// すでに書いてある事実だけ。料金と、作った数字・評価（○×や点数）は入れない。
// 各欄は「ひとことの答え（太字）＋補足」。拾い読みでも行ごとの違いが分かるようにする。
// スマホでは表のまま横に並べると読めないので、1行ずつのカードに組み替える（読み上げ用に表の役割は残す）。

const ICON: Record<string, React.ReactNode> = {
  // 1人の社員
  self: (
    <>
      <circle cx="10" cy="6.5" r="3.2" />
      <path d="M3.5 17c.8-3.4 3.4-5.2 6.5-5.2s5.7 1.8 6.5 5.2" />
    </>
  ),
  // 人を足す
  temp: (
    <>
      <circle cx="8" cy="6.5" r="3" />
      <path d="M2.5 17c.7-3.2 3-4.9 5.5-4.9s4.8 1.7 5.5 4.9M15.5 4.5v5M13 7h5" />
    </>
  ),
  // 業務を外へ渡す
  bpo: (
    <>
      <rect x="2.5" y="4.5" width="9" height="11" rx="1.5" />
      <path d="M7.5 10h9.5M14 7l3 3-3 3" />
    </>
  ),
};

const COLS = [
  { key: "self", name: "自社で担当", sub: "社員を採用する" },
  { key: "temp", name: "派遣・パート", sub: "人手を補う" },
  { key: "bpo", name: "外注（経理BPO）", sub: "業務ごと任せる" },
] as const;

type Col = (typeof COLS)[number]["key"];

/** [ひとことの答え, 補足] */
type Cell = [string, string?];

const ROWS: { axis: string; cells: Record<Col, Cell> }[] = [
  {
    axis: "指示を出すのは",
    cells: {
      self: ["自社", "手順を決め、社内で教える"],
      temp: ["自社", "派遣は派遣会社と契約し、日々の指示は自社の担当者が出す"],
      bpo: ["委託先", "進め方を任せ、記帳や月次の報告を受け取る"],
    },
  },
  {
    axis: "手順を持つのは（属人化）",
    cells: {
      self: ["担当者", "1人で回していると、休んだ月に締めが止まる"],
      temp: ["自社", "人を足しても、属人化の解消には効きにくい"],
      bpo: ["委託先", "受ける前に手順を書き起こすので、担当者が代わっても進め方が変わらない"],
    },
  },
  {
    axis: "始めるまで",
    cells: {
      self: ["時間がかかる", "採用と教育が要る"],
      temp: ["短い期間で補える"],
      bpo: ["採用・教育は要らない", "手順を書き起こし、並走期間を置いて切り替える"],
    },
  },
  {
    axis: "繁忙期（決算・年末調整）",
    cells: {
      self: ["間に合わないことがある", "すぐには人を増やせない"],
      temp: ["その時期だけ足せる", "判断の要る業務までは任せにくい"],
      bpo: ["受ける量を調整しやすい"],
    },
  },
  {
    axis: "確認の体制",
    cells: {
      self: ["省かれやすい", "人手が足りないと、確認の工程を飛ばしがちになる"],
      temp: ["自社の担当者が行う"],
      bpo: ["確かめてから帳簿へ", "仕訳の案を担当者が確かめてから帳簿に入れ、月次で報告する"],
    },
  },
  {
    axis: "インボイス・電子帳簿保存法の変更",
    cells: {
      self: ["社内で調べて対応"],
      temp: ["自社がルールを決めて伝える"],
      bpo: ["当社が追従する", "要件に沿った形を保ったまま回す"],
    },
  },
  {
    axis: "向いている場面",
    cells: {
      self: ["ノウハウを社内に残したい", "機密を外に出したくない"],
      temp: ["一時的に人手が足りない", "決算期など。自社のやり方をそのまま続けたい"],
      bpo: ["経理を続けて任せたい", "1人が抜けると止まるのが不安"],
    },
  },
];

export default function KeiriCompare() {
  return (
    <figure className="[word-break:auto-phrase]">
      <table role="table" className="block w-full border-collapse text-left md:table md:overflow-hidden md:rounded-3xl md:border md:border-line md:bg-raise md:shadow-card">
        <caption className="sr-only">経理の手を確保する3つの形（自社で担当・派遣/パート・外注）の比較</caption>
        <thead className="hidden md:table-header-group">
          <tr className="border-b border-line">
            <th scope="col" className="w-[19%] p-5 align-bottom text-xs font-bold text-slate">
              比べること
            </th>
            {COLS.map((c) => (
              <th key={c.key} scope="col" className={`p-5 align-bottom ${c.key === "bpo" ? "bg-pulse/[0.07]" : ""}`}>
                <span
                  aria-hidden
                  className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${
                    c.key === "bpo" ? "bg-pulse text-white" : "bg-mist text-ink-soft"
                  }`}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    {ICON[c.key]}
                  </svg>
                </span>
                <span className={`block text-base font-black ${c.key === "bpo" ? "text-pulse" : "text-ink"}`}>{c.name}</span>
                <span className="mt-1 block text-xs font-medium text-slate">{c.sub}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody role="rowgroup" className="grid gap-4 md:table-row-group">
          {ROWS.map((r) => (
            <tr
              key={r.axis}
              role="row"
              className="grid rounded-2xl border border-line bg-raise p-5 shadow-card md:table-row md:rounded-none md:border-0 md:border-b md:p-0 md:shadow-none md:last:border-b-0"
            >
              <th scope="row" role="rowheader" className="pb-3 text-[15px] font-bold leading-7 md:w-[19%] md:p-5 md:align-top md:text-sm md:text-ink-soft">
                {r.axis}
              </th>
              {COLS.map((c) => {
                const [short, detail] = r.cells[c.key];
                const bpo = c.key === "bpo";
                return (
                  <td
                    key={c.key}
                    role="cell"
                    className={`border-t border-line py-3 text-sm leading-7 md:border-t-0 md:p-5 md:align-top ${
                      bpo ? "-mx-2 rounded-xl border-t-0 bg-pulse/[0.07] px-2 md:mx-0 md:rounded-none" : ""
                    }`}
                  >
                    {/* スマホは見出しの行を隠すので、欄ごとに形の名前を添える */}
                    <span className={`mb-0.5 block text-xs font-bold md:hidden ${bpo ? "text-pulse" : "text-slate"}`}>{c.name}</span>
                    <strong className={`block font-bold ${bpo ? "text-pulse" : "text-ink"}`}>{short}</strong>
                    {detail && <span className="block text-slate">{detail}</span>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <figcaption className="mt-5 text-sm leading-7 text-slate">
        外注の欄のうち「確認の体制」と「インボイス・電子帳簿保存法の変更」は、当社の進め方です。費用は業務の範囲と量で変わるため、この表には載せていません。現状を伺ってからお見積りします。
      </figcaption>
    </figure>
  );
}

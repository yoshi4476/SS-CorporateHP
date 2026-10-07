// 経理BPOのページの「1か月の経理の流れ」。どの作業を当社が引き受け、どこが御社と専門家に残るかを1枚で見せる。
// 中身は事業ページ（services.ts の keiri-bpo）の本文・FAQに書いてある線引きだけ。新しい約束をここで足さない:
//   書類は写真かメールの転送で送る / 仕訳の案は担当者が確かめてから帳簿へ / 支払の承認・お金を動かす操作・
//   与信・値引き・資金繰りは御社 / 税務の申告は税理士・社会保険と労働保険の提出は社会保険労務士。
// パソコンでは担当ごとの横の帯（スイムレーン）、スマホでは段階ごとのカードに組み替える。
// 文字は画像にせずHTMLで書く（検索とAIに読ませるため）。

type Lane = "you" | "us" | "pro";

const LANES: { key: Lane; name: string; role: string; dot: string; cell: string; track: string; badge: string }[] = [
  {
    key: "you",
    name: "御社",
    role: "判断と、お金を動かす操作",
    dot: "bg-gold",
    cell: "border-l-gold bg-gold-tint",
    track: "bg-gold/25",
    badge: "border-gold/35 bg-gold-tint text-gold-deep",
  },
  {
    key: "us",
    name: "当社",
    role: "日々の作業",
    dot: "bg-pulse",
    cell: "border-l-pulse bg-pulse/[0.07]",
    track: "bg-pulse/25",
    badge: "border-pulse bg-pulse text-white",
  },
  {
    key: "pro",
    name: "税理士・社労士",
    role: "申告と届出",
    dot: "bg-slate",
    cell: "border-l-slate bg-mist",
    track: "bg-line-strong",
    badge: "border-line-strong bg-mist text-ink-soft",
  },
];

const STEPS: { name: string; when?: string; tasks: Partial<Record<Lane, string>> }[] = [
  { name: "書類を送る", tasks: { you: "領収書・請求書を、写真かメールの転送で送る" } },
  { name: "記帳", tasks: { us: "仕訳の案を作り、担当者が確かめてから帳簿に入れる" } },
  { name: "請求と入金", tasks: { us: "請求書の発行・送付と、入金の消込", you: "与信・値引きを決める" } },
  { name: "支払", tasks: { us: "支払データを作る", you: "支払を承認し、振り込む" } },
  { name: "給与と経費", tasks: { us: "給与計算まわりの実務と、経費精算のチェック", pro: "社会保険・労働保険の提出（社会保険労務士）" } },
  { name: "月次の締め", tasks: { us: "期日どおりに締め、月次で報告する", you: "報告を読み、資金繰りを決める" } },
  { name: "申告", when: "時期が来たら", tasks: { pro: "税務の申告（税理士）" } },
];

export default function KeiriMonthFlow() {
  return (
    // 欄が細いので、語の途中で折れないよう文節で折り返す（対応していないブラウザでは今までどおり）
    <figure className="[word-break:auto-phrase]">
      <div className="lg:grid lg:grid-cols-[9.5rem_minmax(0,1fr)] lg:grid-rows-[auto_auto_auto_auto] lg:gap-x-3 lg:gap-y-2">
        {/* パソコンだけ: 左の列に担当の名前。各欄の中にも読み上げ用の担当名があるので、ここは読ませない */}
        <div aria-hidden className="hidden lg:block" />
        {LANES.map((l, i) => (
          <div
            key={l.key}
            aria-hidden
            className="hidden lg:flex lg:flex-col lg:justify-center lg:border-r lg:border-line lg:pr-3"
            style={{ gridRow: i + 2 }}
          >
            <span className="flex items-center gap-2 text-[15px] font-bold">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${l.dot}`} />
              {l.name}
            </span>
            <span className="mt-0.5 text-xs leading-5 text-slate">{l.role}</span>
          </div>
        ))}

        <ol className="grid gap-4 md:grid-cols-2 lg:col-start-2 lg:row-span-4 lg:row-start-1 lg:grid-cols-7 lg:grid-rows-subgrid lg:gap-x-2 lg:gap-y-2">
          {STEPS.map((s, i) => (
            <li
              key={s.name}
              className="rounded-2xl border border-line bg-white p-5 shadow-card lg:row-span-4 lg:grid lg:grid-rows-subgrid lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none"
            >
              <p className="flex items-center gap-2.5 lg:flex-col lg:items-start lg:gap-1.5 lg:pb-1">
                <span className="num flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-[15px] font-bold leading-snug">{s.name}</span>
                {s.when && <span className="text-xs font-bold text-slate">（{s.when}）</span>}
              </p>
              {LANES.map((l) => {
                const task = s.tasks[l.key];
                if (!task) {
                  // 担当が無い欄は、帯が続いていることだけを細い線で示す（スマホでは出さない）
                  return (
                    <div key={l.key} aria-hidden className="hidden items-center lg:flex">
                      <span className={`h-0.5 w-full rounded-full ${l.track}`} />
                    </div>
                  );
                }
                return (
                  <div key={l.key} className="mt-3 lg:mt-0 lg:flex">
                    <p className={`w-full rounded-xl border-l-4 px-3.5 py-2.5 text-sm leading-6 text-ink lg:px-3 ${l.cell}`}>
                      {/* スマホでは担当の札として見せ、パソコンでは左の列にあるので読み上げ用にだけ残す */}
                      <span className={`mb-1 mr-2 inline-block rounded-full border px-2 py-px text-xs font-bold lg:sr-only ${l.badge}`}>
                        {l.name}
                        <span className="sr-only">：</span>
                      </span>
                      {task}
                    </p>
                  </div>
                );
              })}
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="mt-5 text-sm leading-7 text-slate">
        1か月の経理の流れと、それぞれの作業の担当。当社がお引き受けするのは日々の作業までで、判断とお金を動かす操作は御社に、申告と届出は専門家に残ります。
      </figcaption>
    </figure>
  );
}

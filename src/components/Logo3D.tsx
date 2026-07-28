// 3Dロゴタイプ: 「SEVEN SENSES」を1文字ずつ独立アニメーション。
// 文字はCSSの多層シャドウで押し出し立体化し、波が通り抜けるように
// 順番に浮き上がって回転する (globals.css の .logo3d 系スタイル)。

const WORD1 = "SEVEN";
const WORD2 = "SENSES";

export default function Logo3D({ className = "" }: { className?: string }) {
  let i = 0;
  const renderWord = (word: string, tone: "ink" | "pulse") => (
    <span className="logo3d-word">
      {[...word].map((ch, k) => (
        <span
          key={k}
          className={`logo3d-ch logo3d-${tone}`}
          style={{ animationDelay: `${(i++) * 0.11}s` }}
        >
          {ch}
        </span>
      ))}
    </span>
  );

  return (
    <div className={`logo3d ${className}`} aria-hidden>
      {renderWord(WORD1, "ink")}
      <span className="logo3d-gap" />
      {renderWord(WORD2, "pulse")}
    </div>
  );
}

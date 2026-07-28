// 波打つアウトライン文字。セクション背景のウォーターマーク用。
// 1文字ずつ独立して浮き沈み・回転する (globals.css の .logo3d-ch を再利用)。

export default function WaveText({
  text,
  className = "",
  tone = "ink",
}: {
  text: string;
  className?: string;
  tone?: "ink" | "light";
}) {
  return (
    <p className={`logo3d ${className}`} aria-hidden>
      {[...text].map((ch, i) => (
        <span
          key={i}
          className={`logo3d-ch ${tone === "light" ? "outline-text-light" : "outline-text"}`}
          style={{ animationDelay: `${i * 0.13}s` }}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </p>
  );
}

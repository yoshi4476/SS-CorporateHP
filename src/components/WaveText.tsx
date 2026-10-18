// 波打つアウトライン文字。セクション背景のウォーターマーク用。
// 1文字ずつ独立して浮き沈み・回転し、文字位置に応じてブルー→シアンへ色が流れる。

export default function WaveText({
  text,
  className = "",
  tone = "ink",
}: {
  text: string;
  className?: string;
  tone?: "ink" | "light";
}) {
  const chars = [...text];
  return (
    <p className={`logo3d ${className}`} aria-hidden>
      {chars.map((ch, i) => (
        <span
          key={i}
          className={`logo3d-ch ${tone === "light" ? "wave-stroke-light" : "wave-stroke"}`}
          style={
            {
              animationDelay: `${i * 0.13}s`,
              // --p: 0(先頭)→1(末尾)。CSS側で色相を補間する
              "--p": chars.length > 1 ? i / (chars.length - 1) : 0,
            } as React.CSSProperties
          }
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </p>
  );
}

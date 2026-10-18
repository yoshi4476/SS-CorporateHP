// 事業を増やすときはこの配列に1行足すだけでよい。座標は円周上に自動で振り直される。
const LABELS: { label: string; sub: string }[] = [
  { label: "AI", sub: "コンサル" },
  { label: "DEV", sub: "開発" },
  { label: "補助金", sub: "ベンダー" },
  { label: "AIO", sub: "メディア×LP" },
  { label: "MEO", sub: "3,200店舗" },
  { label: "HP/LP", sub: "制作" },
];

const CENTER = 260;
const ORBIT = 200;

// 真上を起点に等間隔で配置する
const NODES = LABELS.map((n, i) => {
  const rad = ((-90 + (i * 360) / LABELS.length) * Math.PI) / 180;
  return {
    ...n,
    x: +(CENTER + ORBIT * Math.cos(rad)).toFixed(1),
    y: +(CENTER + ORBIT * Math.sin(rad)).toFixed(1),
  };
});

export default function SenseNetwork({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 520"
      className={className}
      role="img"
      aria-label={`セブンセンシズの${LABELS.length}つの事業がひとつにつながるネットワーク図`}
    >
      <defs>
        <radialGradient id="coreGrad" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#7a8cff" />
          <stop offset="55%" stopColor="#1c3f7c" />
          <stop offset="100%" stopColor="#122b57" />
        </radialGradient>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1c3f7c" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#74c7d6" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* 外周オービット */}
      <g className="animate-orbit">
        <circle
          cx="260"
          cy="260"
          r="238"
          fill="none"
          stroke="#c3d0e4"
          strokeWidth="1"
          strokeDasharray="2 10"
        />
      </g>
      <circle cx="260" cy="260" r="200" fill="none" stroke="#dfe6f0" strokeWidth="1" />

      {/* コアと各ノードを結ぶデータフロー */}
      {NODES.map((n, i) => (
        <line
          key={`l-${i}`}
          x1="260"
          y1="260"
          x2={n.x}
          y2={n.y}
          stroke="url(#lineGrad)"
          strokeWidth="1.5"
          className="animate-flow"
          style={{ animationDelay: `${i * 0.22}s` }}
        />
      ))}

      {/* コア */}
      <circle cx="260" cy="260" r="64" fill="url(#coreGrad)" />
      <circle cx="260" cy="260" r="76" fill="none" stroke="#1c3f7c" strokeOpacity="0.25" strokeWidth="1.5" />
      <text
        x="260"
        y="252"
        textAnchor="middle"
        fill="#fff"
        fontSize="34"
        fontWeight="700"
        fontFamily="var(--font-grotesk)"
      >
        7
      </text>
      <text
        x="260"
        y="278"
        textAnchor="middle"
        fill="#ffffffcc"
        fontSize="11"
        letterSpacing="2"
        fontFamily="var(--font-grotesk)"
      >
        SENSES
      </text>

      {/* 各事業のノード */}
      {NODES.map((n, i) => (
        <g key={`n-${i}`} className="animate-node" style={{ animationDelay: `${i * 0.45}s` }}>
          <circle cx={n.x} cy={n.y} r="38" fill="#ffffff" stroke="#dfe6f0" strokeWidth="1.5" />
          <text
            x={n.x}
            y={n.y - 1}
            textAnchor="middle"
            fill="#0b1220"
            fontSize="13"
            fontWeight="700"
            fontFamily="var(--font-grotesk)"
          >
            {n.label}
          </text>
          <text x={n.x} y={n.y + 15} textAnchor="middle" fill="#55637a" fontSize="9.5">
            {n.sub}
          </text>
        </g>
      ))}
    </svg>
  );
}

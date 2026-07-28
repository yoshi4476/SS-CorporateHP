const NODES: { x: number; y: number; label: string; sub: string }[] = [
  { x: 260, y: 60, label: "AI", sub: "コンサル" },
  { x: 433, y: 160, label: "DEV", sub: "開発" },
  { x: 433, y: 360, label: "補助金", sub: "ベンダー" },
  { x: 260, y: 460, label: "AIO", sub: "メディア×LP" },
  { x: 87, y: 360, label: "MEO", sub: "3,200社" },
  { x: 87, y: 160, label: "HP/LP", sub: "制作" },
];

export default function SenseNetwork({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 520"
      className={className}
      role="img"
      aria-label="セブンセンシズの6つの事業がひとつにつながるネットワーク図"
    >
      <defs>
        <radialGradient id="coreGrad" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#7a8cff" />
          <stop offset="55%" stopColor="#2b4bff" />
          <stop offset="100%" stopColor="#1e36cc" />
        </radialGradient>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2b4bff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.6" />
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
      <circle cx="260" cy="260" r="76" fill="none" stroke="#2b4bff" strokeOpacity="0.25" strokeWidth="1.5" />
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

      {/* 7つの事業ノード */}
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

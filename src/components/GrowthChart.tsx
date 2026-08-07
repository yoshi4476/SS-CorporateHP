"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

// MEO運用 累計支援店舗数の推移 (実績値)
const DATA: { year: string; total: number }[] = [
  { year: "2019", total: 150 },
  { year: "2020", total: 420 },
  { year: "2021", total: 850 },
  { year: "2022", total: 1350 },
  { year: "2023", total: 1950 },
  { year: "2024", total: 2500 },
  { year: "2025", total: 2950 },
  { year: "2026", total: 3200 },
];

const W = 680;
const H = 320;
const PAD = { top: 28, right: 84, bottom: 40, left: 56 };
const MAX = 3500;

const x = (i: number) => PAD.left + (i / (DATA.length - 1)) * (W - PAD.left - PAD.right);
const y = (v: number) => PAD.top + (1 - v / MAX) * (H - PAD.top - PAD.bottom);

export default function GrowthChart() {
  const [hover, setHover] = useState<number | null>(null);
  const reduce = useReducedMotion();

  const linePath = DATA.map((d, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(d.total)}`).join(" ");
  const areaPath = `${linePath} L${x(DATA.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;
  const last = DATA.length - 1;

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((px - PAD.left) / (W - PAD.left - PAD.right)) * (DATA.length - 1));
    setHover(Math.max(0, Math.min(DATA.length - 1, i)));
  };

  return (
    <figure className="w-full">
      <figcaption className="mb-1 text-sm font-bold text-ink">
        MEO運用 累計支援店舗数の推移
        <span className="ml-2 text-xs font-normal text-slate">(社)</span>
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="MEO運用の累計支援店舗数は2019年から増え続け、2026年に通算3,200店舗に到達"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1c3f7c" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#1c3f7c" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* recessive grid */}
        {[0, 1000, 2000, 3000].map((v) => (
          <g key={v}>
            <line x1={PAD.left} y1={y(v)} x2={W - PAD.right} y2={y(v)} stroke="#dfe6f0" strokeWidth="1" />
            <text x={PAD.left - 10} y={y(v) + 4} textAnchor="end" fontSize="11" fill="#55637a" className="num">
              {v.toLocaleString()}
            </text>
          </g>
        ))}
        {DATA.map((d, i) => (
          <text key={d.year} x={x(i)} y={H - 14} textAnchor="middle" fontSize="11" fill="#55637a" className="num">
            {d.year}
          </text>
        ))}

        <motion.path
          d={areaPath}
          fill="url(#areaGrad)"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.6 }}
        />
        <motion.path
          d={linePath}
          fill="none"
          stroke="#1c3f7c"
          strokeWidth="2"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />

        {/* 終点の直接ラベル */}
        <circle cx={x(last)} cy={y(DATA[last].total)} r="5" fill="#1c3f7c" stroke="#fff" strokeWidth="2" />
        <text
          x={x(last) + 12}
          y={y(DATA[last].total) - 8}
          fontSize="15"
          fontWeight="700"
          fill="#0b1220"
          className="num"
        >
          3,200店舗
        </text>
        <text x={x(last) + 12} y={y(DATA[last].total) + 8} fontSize="10" fill="#55637a">
          通算支援
        </text>

        {/* hover crosshair + tooltip */}
        {hover !== null && (
          <g pointerEvents="none">
            <line x1={x(hover)} y1={PAD.top} x2={x(hover)} y2={y(0)} stroke="#0b1220" strokeOpacity="0.25" strokeWidth="1" />
            <circle cx={x(hover)} cy={y(DATA[hover].total)} r="4.5" fill="#fff" stroke="#1c3f7c" strokeWidth="2" />
            <g transform={`translate(${Math.min(x(hover) + 10, W - 150)}, ${Math.max(y(DATA[hover].total) - 52, 6)})`}>
              <rect width="130" height="44" rx="8" fill="#0b1220" />
              <text x="12" y="18" fontSize="11" fill="#ffffffaa">
                {DATA[hover].year}年
              </text>
              <text x="12" y="35" fontSize="14" fontWeight="700" fill="#fff" className="num">
                累計 {DATA[hover].total.toLocaleString()}社
              </text>
            </g>
          </g>
        )}
      </svg>
    </figure>
  );
}

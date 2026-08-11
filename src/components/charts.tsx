"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CountUp } from "@/components/motion";

const INDUSTRY: { label: string; value: number }[] = [
  { label: "飲食", value: 32 },
  { label: "美容・サロン", value: 24 },
  { label: "医療・歯科", value: 18 },
  { label: "小売・物販", value: 10 },
  { label: "士業・スクール", value: 9 },
  { label: "その他", value: 7 },
];

export function IndustryBars() {
  const reduce = useReducedMotion();
  return (
    <figure>
      <figcaption className="text-sm font-bold text-ink">
        MEO支援先の業種構成
        <span className="ml-2 text-xs font-normal text-slate">(%)</span>
      </figcaption>
      <div className="mt-5 grid gap-3.5" role="img" aria-label="支援先の業種構成。飲食32%、美容サロン24%、医療歯科18%、小売10%、士業スクール9%、その他7%">
        {INDUSTRY.map((d, i) => (
          <div key={d.label} className="grid grid-cols-[7.5rem_1fr_2.5rem] items-center gap-3">
            <span className="text-xs font-medium text-slate">{d.label}</span>
            <div className="h-3 overflow-hidden rounded-full bg-mist">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-pulse to-glow"
                initial={reduce ? { width: `${d.value * 3}%` } : { width: 0 }}
                whileInView={{ width: `${d.value * 3}%` }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
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
  const reduce = useReducedMotion();
  const R = 62;
  const C = 2 * Math.PI * R;
  return (
    <figure className="flex flex-col items-center text-center">
      <div className="relative h-40 w-40">
        <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90" role="img" aria-label={`${label} ${value}${suffix}`}>
          <circle cx="80" cy="80" r={R} fill="none" stroke="#dfe6f0" strokeWidth="14" />
          <motion.circle
            cx="80"
            cy="80"
            r={R}
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={C}
            initial={reduce ? { strokeDashoffset: C * (1 - value / 100) } : { strokeDashoffset: C }}
            whileInView={{ strokeDashoffset: C * (1 - value / 100) }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
          <defs>
            <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1c3f7c" />
              <stop offset="100%" stopColor="#7a8cff" />
            </linearGradient>
          </defs>
        </svg>
        <p className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
          <CountUp value={value} suffix={suffix} />
        </p>
      </div>
      <figcaption className="mt-3 text-sm font-bold text-ink">
        {label}
        {sub && <span className="mt-1 block text-xs font-normal text-slate">{sub}</span>}
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
    <figure className="overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <caption className="sr-only">MEO運用によるGoogleマップ検索順位の改善例</caption>
        <thead>
          <tr className="border-b border-line bg-mist/60 text-xs text-slate">
            <th scope="col" className="p-4 text-left font-medium">業種</th>
            <th scope="col" className="p-4 text-left font-medium">エリア</th>
            <th scope="col" className="p-4 text-left font-medium">対策キーワード</th>
            <th scope="col" className="p-4 text-right font-medium">開始時</th>
            <th scope="col" className="p-4 text-right font-medium">90日後</th>
          </tr>
        </thead>
        <tbody>
          {RANKS.map((r) => (
            <tr key={r.industry} className="border-b border-line last:border-0">
              <td className="p-4 font-medium">{r.industry}</td>
              <td className="p-4 text-slate">{r.area}</td>
              <td className="p-4 text-slate">{r.keyword}</td>
              <td className="num p-4 text-right text-slate">{r.before}位</td>
              <td className="p-4 text-right">
                <span className="num inline-flex items-center gap-1.5 rounded-full bg-pulse/10 px-3 py-1 font-bold text-pulse">
                  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                    <path d="M5 8V2M2 4.5L5 1.5l3 3" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                  {r.after}位
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <figcaption className="border-t border-line px-4 py-3 text-xs text-slate">
        Googleマップ検索順位の改善例(運用開始から90日間)
      </figcaption>
    </figure>
  );
}

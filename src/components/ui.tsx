import Link from "next/link";
import { Reveal, CountUp } from "@/components/motion";
import WaveText from "@/components/WaveText";
import type { Metric } from "@/lib/services";

/** ==text== をマーカー、**text** を太字に変換して描画する */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(==[^=]+==|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("==") && p.endsWith("==")) {
          return (
            <mark key={i} className="marker">
              {p.slice(2, -2)}
            </mark>
          );
        }
        if (p.startsWith("**") && p.endsWith("**")) {
          return (
            <strong key={i} className="font-bold text-ink">
              {p.slice(2, -2)}
            </strong>
          );
        }
        return p;
      })}
    </>
  );
}

export function SectionHead({
  en,
  title,
  lead,
  align = "left",
}: {
  en: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal className={align === "center" ? "text-center" : ""}>
      <p className="eyebrow">{en}</p>
      <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">{title}</h2>
      {lead && (
        <p className={`mt-5 max-w-2xl text-sm leading-8 text-slate md:text-base ${align === "center" ? "mx-auto" : ""}`}>
          <Rich text={lead} />
        </p>
      )}
    </Reveal>
  );
}

export function StatTile({ metric, delay = 0 }: { metric: Metric; delay?: number }) {
  const numeric = Number(metric.value.replaceAll(",", ""));
  return (
    <Reveal delay={delay} className="rounded-2xl border border-line bg-white p-6 shadow-card">
      {/* 実績の数字は金で統一。紺の面の中で数字だけが浮き上がる */}
      <p className="text-3xl font-bold text-gold md:text-4xl">
        {Number.isFinite(numeric) ? (
          <CountUp value={numeric} suffix="" />
        ) : (
          <span className="num">{metric.value}</span>
        )}
        {metric.suffix && <span className="ml-1 text-lg">{metric.suffix}</span>}
      </p>
      <p className="mt-2 text-sm font-medium text-slate">{metric.label}</p>
      {metric.note && <p className="mt-1 text-xs text-slate/70">{metric.note}</p>}
    </Reveal>
  );
}

export function FlowSteps({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <ol className="grid gap-4 md:grid-cols-4">
      {steps.map((s, i) => (
        <Reveal key={s.title} delay={i * 0.1}>
          <li className="relative h-full rounded-2xl border border-line bg-white p-6 shadow-card">
            <span className="num text-sm font-bold text-pulse">STEP {i + 1}</span>
            <h3 className="mt-2 text-base font-bold">{s.title}</h3>
            <p className="mt-2 text-sm leading-7 text-slate">{s.body}</p>
            {i < steps.length - 1 && (
              <svg
                aria-hidden
                className="absolute -right-4 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-pulse md:block"
                viewBox="0 0 16 16"
              >
                <path d="M5 2l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            )}
          </li>
        </Reveal>
      ))}
    </ol>
  );
}

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="grid gap-3">
      {items.map((f, i) => (
        <Reveal key={f.q} delay={i * 0.06}>
          <details className="group rounded-2xl border border-line bg-white px-6 py-1 shadow-card open:pb-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-bold md:text-base [&::-webkit-details-marker]:hidden">
              <span className="flex items-start gap-3">
                <span className="font-data text-pulse">Q.</span>
                {f.q}
              </span>
              <svg
                aria-hidden
                width="14"
                height="14"
                viewBox="0 0 14 14"
                className="shrink-0 text-slate transition-transform group-open:rotate-180"
              >
                <path d="M2 4.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </summary>
            <p className="flex items-start gap-3 border-t border-line pt-4 text-sm leading-8 text-slate">
              {/* 明るい面なので、暗い面用の aqua ではなく紺を使う */}
              <span className="font-data font-bold text-pulse">A.</span>
              {f.a}
            </p>
          </details>
        </Reveal>
      ))}
    </div>
  );
}

export function CtaBand({
  title = "まずは、無料相談から。",
  body = "「何から始めればいいか分からない」段階のご相談こそ歓迎です。現状を伺い、貴社に合う打ち手を持ち帰りいただけます。",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink">
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 80% 20%, rgb(28 63 124 / 0.5), transparent 60%), radial-gradient(ellipse 40% 60% at 12% 90%, rgb(116 199 214 / 0.14), transparent 60%)",
        }}
      />
      <WaveText text="CONTACT" tone="light" className="pointer-events-none absolute -bottom-4 left-0 select-none text-[15vw] leading-none tracking-tighter" />
      <div className="relative mx-auto max-w-7xl px-5 py-24 text-center md:py-36">
        <Reveal>
          <p className="eyebrow !text-aqua">Contact</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white md:text-6xl">{title}</h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-white/70 md:text-base">{body}</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
                  className="w-full rounded-full bg-gold-bright px-9 py-4 text-sm font-bold text-ink shadow-lift transition-transform hover:-translate-y-0.5 sm:w-auto"
            >
              無料相談を予約する
            </Link>
            <Link
              href="/company"
                  className="w-full rounded-full border border-white/30 px-9 py-4 text-sm font-bold text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              会社概要を見る
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

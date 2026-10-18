import Link from "next/link";
import type { Metric } from "@/lib/services";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

// 全ページで使う部品。形の決まりは DESIGN.md の 8。
// 区画は罫線で区切り、文章は左揃え。カードの影・ピルのボタン・見出しの上の飾りは使わない。

/** 主ボタンの中の矢印。箱に入れ、触れると矢印だけが少し進む（globals.css の .btn-arrow） */
export function BtnArrow() {
  return (
    <span aria-hidden className="btn-arrow">
      <svg width="13" height="13" viewBox="0 0 14 14">
        <path d="M2 7h9.5M8 3.2L11.8 7 8 10.8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/** ==text== を強調、**text** を太字に変換して描画する */
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

/**
 * Rich と同じ記法だが、**太字** の中に事業名が含まれていればその部分をリンクにする。
 * 用途ブロックは「その用途なら別の事業のほうが合う」と誘導する場所なのに、
 * これまで名前を太字で示すだけで飛べなかった。
 */
const SERVICE_HREF: [string, string][] = services
  .map((s) => [s.name, `/services/${s.slug}`] as [string, string])
  // 短い名前が長い名前の一部を食わないよう、長いものから照合する
  .sort((a, b) => b[0].length - a[0].length);

function linkifyServices(text: string, key: string) {
  const out: React.ReactNode[] = [];
  let rest = text;
  let i = 0;
  while (rest) {
    const hit = SERVICE_HREF.map(([name, href]) => ({ name, href, at: rest.indexOf(name) }))
      .filter((h) => h.at >= 0)
      .sort((a, b) => a.at - b.at)[0];
    if (!hit) {
      out.push(rest);
      break;
    }
    if (hit.at > 0) out.push(rest.slice(0, hit.at));
    out.push(
      <Link key={`${key}-${i++}`} href={hit.href} className="link-u">
        {hit.name}
      </Link>,
    );
    rest = rest.slice(hit.at + hit.name.length);
  }
  return out;
}

export function RichLinked({ text }: { text: string }) {
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
              {linkifyServices(p.slice(2, -2), String(i))}
            </strong>
          );
        }
        return p;
      })}
    </>
  );
}

/** パンくず。最後の項目は現在のページ */
export function Breadcrumb({ items, tone = "light" }: { items: { name: string; href?: string }[]; tone?: "light" | "dark" }) {
  const dim = tone === "dark" ? "text-white/70" : "text-slate";
  return (
    <nav aria-label="パンくずリスト" className={`text-[13px] ${dim}`}>
      <ol className="flex flex-wrap items-center gap-x-2">
        {items.map((it, i) => (
          <li key={it.name} className="flex items-center gap-x-2">
            {i > 0 && <span aria-hidden>/</span>}
            {it.href ? (
              <Link href={it.href} className={`tap underline-offset-4 hover:underline ${tone === "dark" ? "hover:text-white" : "hover:text-pulse"}`}>
                {it.name}
              </Link>
            ) : (
              <span aria-current="page" className={tone === "dark" ? "text-white" : "text-ink"}>
                {it.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** 下層ページの頭。パンくず → h1 → 説明。白地で、下に罫を引く */
export function PageHead({
  crumbs,
  title,
  lead,
  children,
  aside,
}: {
  crumbs: { name: string; href?: string }[];
  title: React.ReactNode;
  lead?: React.ReactNode;
  children?: React.ReactNode;
  /** 右の列（パソコンのみ横に並ぶ） */
  aside?: React.ReactNode;
}) {
  return (
    <section className="border-b border-line pt-16 md:pt-20">
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-8 md:px-8 md:pb-16 md:pt-12">
        <Breadcrumb items={crumbs} />
        <div className={aside ? "mt-8 grid gap-10 lg:grid-cols-12 lg:items-end" : "mt-8"}>
          <div className={aside ? "lg:col-span-7" : ""}>
            <h1 className="text-[2rem] font-bold leading-[1.3] md:text-5xl md:leading-[1.25]">{title}</h1>
            {lead && <div className="mt-5 max-w-[40em] text-base leading-[1.9] text-slate">{lead}</div>}
            {children}
          </div>
          {aside && <div className="lg:col-span-5">{aside}</div>}
        </div>
      </div>
    </section>
  );
}

// 見出しの上の英字（Problem・FAQ など）と金の罫は、情報を持たない飾りだった。上の罫線だけで区画の始まりを示す。
// en と align は受け取るが使わない。管制塔が配る部品（AioResearchData・templates/corporate_aio_data.tsx）が今も渡してくるため、
// 型から外すと次の配信でビルドが落ちる
export function SectionHead({
  title,
  lead,
  id,
  tone = "light",
}: {
  en?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  /** 見出しの id。区画の aria-labelledby から指す */
  id?: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div className={`border-t pt-6 md:pt-8 ${dark ? "border-white/40" : "border-ink"}`}>
      <h2 id={id} className={`text-[1.625rem] font-bold leading-[1.4] md:text-[2.25rem] ${dark ? "text-white" : ""}`}>
        {title}
      </h2>
      {lead && (
        <p className={`mt-4 max-w-[40em] text-base leading-[1.9] ${dark ? "text-white/75" : "text-slate"}`}>
          <Rich text={lead} />
        </p>
      )}
    </div>
  );
}

/**
 * 話の区画（帳票の形）。パソコンでは左の4列に見出しと説明を置いてスクロール中も止め、右の8列に中身を置く。
 * スマホでは縦に積む。
 */
export function StorySection({
  id,
  title,
  lead,
  children,
  tone = "light",
  className = "",
  side,
}: {
  id: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
  tone?: "light" | "mist" | "dark";
  className?: string;
  /** 見出しの下に添えるもの（リンクなど） */
  side?: React.ReactNode;
}) {
  const bg = tone === "dark" ? "bg-ink text-white" : tone === "mist" ? "bg-mist" : "";
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={`scroll-mt-32 py-20 md:py-32 xl:py-36 ${bg} ${className}`}>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHead id={`${id}-heading`} title={title} lead={lead} tone={tone === "dark" ? "dark" : "light"} />
            {side && <div className="mt-6">{side}</div>}
          </div>
        </div>
        <div className="min-w-0 lg:col-span-8">{children}</div>
      </div>
    </section>
  );
}

/** 実績の数字。罫で区切った行に、数字・何の数字か・注記を並べる */
export function StatTile({ metric }: { metric: Metric; delay?: number }) {
  return (
    <div className="border-t border-ink pt-4">
      <p className="text-ink">
        <span className="num text-4xl font-bold md:text-5xl">{metric.value}</span>
        {metric.suffix && <span className="ml-1 text-lg font-bold">{metric.suffix}</span>}
      </p>
      <p className="mt-2 text-sm font-bold text-ink">{metric.label}</p>
      {metric.note && <p className="mt-1 text-sm leading-7 text-slate">{metric.note}</p>}
    </div>
  );
}

/** 進め方。順番があるので番号を出す。パソコンでは横に、スマホでは縦に並ぶ */
export function FlowSteps({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <ol className={`grid gap-0 md:gap-6 ${steps.length === 3 ? "md:grid-cols-3" : steps.length >= 4 ? "md:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-2"}`}>
      {steps.map((s, i) => (
        <li key={s.title} className="grid grid-cols-[2.5rem_1fr] gap-x-3 border-t border-line-strong py-5 md:block md:py-6">
          <span className="num text-sm font-bold text-pulse" aria-hidden>
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="md:mt-3">
            <h3 className="text-lg font-bold leading-snug">{s.title}</h3>
            <p className="mt-2 text-[15px] leading-[1.85] text-slate">{s.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** よくある質問。罫で区切った開閉の行 */
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="rule-close">
      {items.map((f, i) => (
        <details key={f.q} className={`faq group border-line ${i ? "border-t" : "border-t border-t-ink"}`}>
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-base font-bold leading-[1.7] transition-colors hover:text-pulse [&::-webkit-details-marker]:hidden">
            <span>{f.q}</span>
            <span aria-hidden className="faq-sign mt-2 text-pulse" />
          </summary>
          <p className="max-w-[44em] pb-6 text-[15px] leading-[1.9] text-slate">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/** 最後の相談の帯。墨の面に、左揃えの見出しと主ボタン・電話 */
export function CtaBand({
  title = "まずは、無料相談から。",
  body = "「何から始めればいいか分からない」段階のご相談こそ歓迎です。現状を伺い、貴社に合う打ち手を持ち帰りいただけます。",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section data-cta-pos="cta-band" className="bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:px-8 md:py-32 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <h2 className="text-[1.875rem] font-bold leading-[1.35] tracking-[0.005em] md:text-[3rem]">{title}</h2>
          <p className="mt-5 max-w-[36em] text-base leading-[1.9] text-white/75">{body}</p>
        </div>
        <div className="grid gap-5 lg:col-span-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="btn btn-primary sm:flex-1">
              無料相談を予約する
              <BtnArrow />
            </Link>
            <Link href="/company" className="btn btn-ondark sm:flex-1">
              会社概要を見る
            </Link>
          </div>
          <p className="border-t border-white/20 pt-4 text-sm leading-7 text-white/70">
            お電話でも受け付けています。
            <a href={`tel:${site.tel.replaceAll("-", "")}`} className="num ml-2 text-lg font-bold text-white underline-offset-4 hover:underline">
              {site.tel}
            </a>
            <span className="block text-[13px]">受付時間: {site.hours}</span>
          </p>
        </div>
      </div>
    </section>
  );
}

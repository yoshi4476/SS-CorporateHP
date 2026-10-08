// 自動配置（ss-aggregate）: 管制塔の scripts/publish.py（write_aggregate_nextjs）が置く。直接編集しない。
// まとめのページ（比較表・テーマ・エリア・今の時期の特集・業種・用語集・多言語の要約）を、管制塔が書き出した JSON から描く。
// 中身（本文の HTML・構造化データ）は管制塔の aggregate_pages.collect が作る。ここは置くだけ。
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import data from "../content/aggregate/pages.json";

type AggregatePage = {
  title: string;
  description: string;
  html: string;
  jsonld: unknown[];
  lang: string;
  url: string;
  alternates?: Record<string, string>;
};

const pages = (data as unknown as { pages: Record<string, AggregatePage> }).pages;

// サイトの CSS はリセットされている（Tailwind など）ので、ページの枠と最低限の見た目だけここで持つ。
// 上の余白は固定ヘッダー（スマホ 64px・768px 以上 80px）より広くする。48px では h1 がヘッダーの下に潜り、
// スマホではメニューの丸ボタンが h1 に重なっていた（2026-10-08）。一覧・見出しの部品は管制塔の aggregate_pages.CSS を足す
const CSS =
  `
.ss-aggregate{max-width:880px;margin:0 auto;padding:112px 20px 80px;line-height:1.85}
@media (min-width:768px){.ss-aggregate{padding-top:136px}}
.ss-aggregate h1{font-size:1.9rem;font-weight:800;line-height:1.4;margin:0 0 1.2rem}
.ss-aggregate h2{font-size:1.25rem;font-weight:700;margin:2.2rem 0 .8rem}
.ss-aggregate ul,.ss-aggregate ol{padding-left:1.3rem;margin:.6rem 0}
.ss-aggregate ul{list-style:disc}.ss-aggregate ol{list-style:decimal}
.ss-aggregate li{margin:.45rem 0}
.ss-aggregate a{text-decoration:underline}
.ss-aggregate h3{font-size:1.08rem;font-weight:700;margin:1.8rem 0 .6rem}
.ss-aggregate .faq-groups{display:flex;flex-wrap:wrap;gap:.4rem .9rem;margin:1rem 0;font-size:.92rem}
.ss-aggregate .faq-groups span{opacity:.7;margin-left:.3rem}
.ss-aggregate .ss-crumb ol{display:flex;flex-wrap:wrap;gap:.2rem .5rem;list-style:none;padding:0;margin:0 0 1rem;font-size:.82rem;opacity:.8}
.ss-aggregate .ss-crumb li{margin:0}
.ss-aggregate .ss-crumb li+li::before{content:"›";margin-right:.5rem}
` + ".ss-aggregate .latest-block{margin:0 0 2.6rem}.ss-aggregate .cat-head{display:flex;align-items:baseline;gap:.9rem;flex-wrap:wrap;padding-bottom:.7rem;margin:0 0 1.4rem;border-bottom:2px solid rgba(127,127,127,.22)}.ss-aggregate .cat-head h2{margin:0;padding-left:.8rem;border-left:4px solid currentColor;font-size:1.3rem;line-height:1.4}.ss-aggregate .cnt{font-size:.8rem;font-weight:400;opacity:.7}.ss-aggregate .hub-lead{margin:.4rem 0 0;font-size:.92rem;line-height:1.85;opacity:.85}.ss-aggregate .hub-list{list-style:none;margin:1.2rem 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr));gap:.9rem}.ss-aggregate .hub-list li{list-style:none;margin:0;padding:1rem 1.1rem;border:1px solid rgba(127,127,127,.25);border-radius:14px;background:#fff}.ss-aggregate .hub-list li>a{display:flex;align-items:baseline;gap:.6em;text-decoration:none;font-weight:700;line-height:1.6}.ss-aggregate .hub-list li>a strong{font-size:1.05rem}.ss-aggregate .hub-list li>a .cnt{margin-left:auto;white-space:nowrap}.ss-aggregate .hub-list li>.cnt,.ss-aggregate .hub-list .hub-lead{display:block;margin:.4rem 0 0;font-size:.84rem}.ss-aggregate .hub-note{margin:1rem 0 0;font-size:.84rem;opacity:.8}.ss-aggregate .enrich-steps{list-style:none;counter-reset:s;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr));gap:1rem;margin:1.2rem 0 0;padding:0}.ss-aggregate .enrich-steps li{counter-increment:s;list-style:none;margin:0;padding:1.2rem;border:1px solid rgba(127,127,127,.25);border-radius:16px;background:#fff}.ss-aggregate .enrich-steps li::before{content:\"STEP \" counter(s);display:block;margin-bottom:.4rem;font-size:.72rem;font-weight:800;letter-spacing:.14em;opacity:.7}.ss-aggregate .enrich-steps b{display:block;margin-bottom:.35rem}.ss-aggregate .enrich-steps span{font-size:.88rem;line-height:1.85;opacity:.85}.ss-aggregate .gl-toc{display:flex;flex-wrap:wrap;gap:.35rem .5rem;margin:1.2rem 0 1.6rem;padding:1rem;border-radius:14px;background:rgba(127,127,127,.07)}.ss-aggregate .gl-toc a{padding:.25em .7em;border:1px solid rgba(127,127,127,.25);border-radius:999px;background:#fff;font-size:.82rem;text-decoration:none}.ss-aggregate .gl-term{padding:1.4rem 0;border-top:1px solid rgba(127,127,127,.25);scroll-margin-top:96px}.ss-aggregate .gl-term h3{margin:0 0 .7rem}.ss-aggregate .gl-rel,.ss-aggregate .gl-more{margin:.4rem 0 0;font-size:.84rem;opacity:.85}.ss-aggregate .definition-box{margin:.6rem 0;padding:.8rem 1rem;border-left:4px solid rgba(127,127,127,.5);background:rgba(127,127,127,.08)}.ss-aggregate .definition-box .term{font-weight:700}.ss-aggregate .table-wrap{overflow-x:auto;margin:.8rem 0}.ss-aggregate table{border-collapse:collapse;width:100%;font-size:.92rem}.ss-aggregate th,.ss-aggregate td{border:1px solid rgba(127,127,127,.35);padding:.5rem .7rem;text-align:left;vertical-align:top}.ss-aggregate details{margin:.6rem 0;padding:.7rem 1rem;border:1px solid rgba(127,127,127,.35);border-radius:10px}.ss-aggregate summary{font-weight:700;cursor:pointer}";

/** 「compare」のような入口の下にあるページの slug の並び（generateStaticParams 用） */
export function keysUnder(top: string): string[][] {
  return Object.keys(pages)
    .filter((k) => k.startsWith(top + "/"))
    .map((k) => k.slice(top.length + 1).split("/"));
}

export function pageMetadata(key: string): Metadata {
  const p = pages[key];
  if (!p) return {};
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: p.url, ...(p.alternates ? { languages: p.alternates } : {}) },
    openGraph: { title: p.title, description: p.description, url: p.url, type: "website", images: [{ url: "/ogp.png" }] },
  };
}

/** パンくずの階層（入口 › このページ）。入口のページが無い階層は飛ばす */
function crumbs(key: string) {
  const parts = key.split("/");
  return parts
    .map((_, i) => parts.slice(0, i + 1).join("/"))
    .filter((k) => pages[k])
    .map((k) => ({ key: k, title: pages[k].title, url: pages[k].url, path: new URL(pages[k].url).pathname }));
}

export default function SsAggregatePage({ pageKey }: { pageKey: string }) {
  const p = pages[pageKey];
  if (!p) notFound();
  const trail = crumbs(pageKey);
  const crumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ title: "ホーム", url: new URL(p.url).origin + "/" }, ...trail].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.title,
      item: c.url,
    })),
  };
  return (
    <section className="ss-aggregate" lang={p.lang}>
      <style>{CSS}</style>
      <nav className="ss-crumb" aria-label="パンくずリスト">
        <ol>
          <li>
            <a href="/">ホーム</a>
          </li>
          {trail.map((c, i) => (
            <li key={c.key}>
              {i < trail.length - 1 ? <a href={c.path}>{c.title}</a> : <span aria-current="page">{c.title}</span>}
            </li>
          ))}
        </ol>
      </nav>
      <h1>{p.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: p.html }} />
      {[...p.jsonld, crumbLd].map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }}
        />
      ))}
    </section>
  );
}

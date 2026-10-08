import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CopyButton from "@/components/CopyButton";
import JsonLd from "@/components/JsonLd";
import { Reveal } from "@/components/motion";
import { SectionHead } from "@/components/ui";
import { products } from "@/lib/developer";
import { pageMeta } from "@/lib/meta";
import { breadcrumbSchema } from "@/lib/schema";
import { areas, services } from "@/lib/services";
import { site } from "@/lib/site";

// 記事・紹介で当社を書くときにそのまま使える表記・文章・ロゴ。
// 載せるのは会社概要・AI集客ラボの監修者ページですでに公開している事実だけにする。
// 料金・実績の数字（店舗数・継続率など）・お客様の声は持ち込まない（転載先で条件が落ちると誤認を招くため）
export const metadata: Metadata = pageMeta({
  title: "プレスキット",
  description:
    "セブンセンシズ株式会社のプレスキットです。正式な表記、会社紹介文（短・長）、代表取締役 原口 優の略歴（短・中・長）、ロゴ（PNG）を、記事や紹介にそのままお使いいただけます。",
  path: "/press/kit",
});

const AUTHOR_PAGE = "https://ai.7senses.co.jp/author/haraguchi/";
const CONFLUX_KIT = "https://conflux-partners.jp/press/kit";

const foundedMonth = site.founded.replace(/\d+日$/, "");
const serviceNames = areas
  .flatMap((a) => services.filter((s) => s.group === a.group).map((s) => s.name))
  .join("、");
const productNames = Object.values(products)
  .map((p) => `「${p.name}」`)
  .join("");

const FACTS: [string, string][] = [
  ["商号", `${site.name}（${site.nameEn}）`],
  ["法人番号", site.corporateNumber],
  ["所在地", `〒${site.postal} ${site.address}`],
  ["代表者", `代表取締役 ${site.ceo}`],
  ["設立", site.founded],
  ["資本金", site.capital],
  ["電話", site.tel],
  ["URL", `${site.url}/`],
];

const INTROS: { key: string; label: string; text: string }[] = [
  {
    key: "short",
    label: "会社紹介文（短）",
    text: `${site.name}（法人番号：${site.corporateNumber}）は、大阪市東成区のAIコンサルティング・デジタルマーケティング会社です。${areas.map((a) => a.name).join("、")}の${areas.length}つの領域で、大阪から全国の企業・店舗を支援しています。`,
  },
  {
    key: "long",
    label: "会社紹介文（長）",
    text: `${site.name}（本社：大阪市東成区、代表取締役：${site.ceo}、法人番号：${site.corporateNumber}）は、${foundedMonth}に設立したAIコンサルティング・デジタルマーケティング会社です。${areas.map((a) => `「${a.name}」`).join("")}の${areas.length}つの領域で、${serviceNames}の各事業を手がけています。自社プロダクトとして${productNames}を提供し、メディア「AI集客ラボ」「経理BPOブログ」を運営しています。社名の「セブンセンシズ」は、五感を超えた第六感の、さらに先にある「第七感」に由来します。`,
  },
];

// 出どころ: AI集客ラボの監修者プロフィール（AUTHOR_PAGE）。実績の数字は載せない
const bioHead = `${site.ceo}（はらぐち・ゆう）。${site.name} 創業者・代表取締役。`;
const bioCareer = `${foundedMonth}に大阪市で同社を設立し、マップ検索対策（MEO・ローカルSEO）による店舗集客支援サービス「G-ran」を始めた。2026年には、AI検索時代の集客ノウハウを公開するオウンドメディア「AI集客ラボ」を開設し、全記事の監修を担う。`;
const BIOS: { key: string; label: string; text: string }[] = [
  {
    key: "short",
    label: "略歴（短）",
    text: `${bioHead}${foundedMonth}に同社を設立し、店舗・中小企業の集客を支援している。`,
  },
  { key: "medium", label: "略歴（中）", text: `${bioHead}${bioCareer}` },
  {
    key: "long",
    label: "略歴（長）",
    text: `${bioHead}${bioCareer}専門は MEO・SEO・AIO・LLMO で、マップ検索から検索、AI検索まで、見込み客が調べる場所の全域を実務で扱う。信条は「成果から逆算した正攻法の集客」。口コミの代理投稿・購入といったプラットフォームの規約に反する手法は行わない運用方針をとり、AI集客ラボの記事も、事実確認・実務との整合・コンプライアンスの観点で監修している。`,
  },
];

// ロゴはサイトで使っている素材そのもの（PNG・背景透過）。SVG は持っていない
const LOGOS = [
  { src: "/images/logo.png", file: "seven-senses-logo.png", label: "標準（白地用）", w: 372, h: 148, dark: false },
  { src: "/images/logo-jp.png", file: "seven-senses-logo-ja.png", label: "社名入り（白地用）", w: 700, h: 348, dark: false },
  { src: "/images/logo-white.png", file: "seven-senses-logo-white.png", label: "反転（暗い背景用）", w: 372, h: 148, dark: true },
];

const USAGE = [
  `社名は「${site.name}」と表記してください。「株式会社」を社名の前に置くと別の法人の名前になるため、順序を入れ替えず、必要に応じて法人番号（${site.corporateNumber}）を添えてください。`,
  `代表者は「代表取締役 ${site.ceo}」と表記してください。`,
  `当社のサイトとして紹介するときは ${site.url}/ をお使いください。`,
  "ロゴの色・比率・形は変えずにお使いください。暗い背景には反転のロゴをお使いください。",
  "人物の写真は提供していません。",
];

const chars = (s: string) => [...s].length;

function TextBlock({ id, label, text }: { id: string; label: string; text: string }) {
  return (
    <section aria-labelledby={id} className="border-b border-line py-7 last:border-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 id={id} className="text-base font-bold md:text-lg">
          {label}
          <span className="num ml-3 text-sm font-medium text-slate">{chars(text)}字</span>
        </h3>
        <CopyButton text={text} name={label} />
      </div>
      <p className="mt-4 max-w-3xl text-[15px] leading-[1.9] text-ink">{text}</p>
    </section>
  );
}

export default function PressKitPage() {
  const factsText = FACTS.map(([k, v]) => `${k}：${v}`).join("\n");
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "トップ", path: "/" },
          { name: "会社概要", path: "/company" },
          { name: "プレスキット", path: "/press/kit" },
        ])}
      />

      <section className="relative overflow-hidden pt-16 md:pt-20">
        <div aria-hidden className="grid-field absolute inset-0" />
        <div className="relative mx-auto max-w-5xl px-5 pb-12 pt-12 md:pb-16 md:pt-20">
          <Reveal>
            <nav aria-label="パンくずリスト" className="text-xs text-slate">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="tap hover:text-pulse">
                    トップ
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link href="/company" className="tap hover:text-pulse">
                    会社概要
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="text-ink">
                  プレスキット
                </li>
              </ol>
            </nav>
            <p aria-hidden className="eyebrow mt-8" />
            <h1 className="mt-4 text-3xl font-black md:text-5xl">プレスキット</h1>
            <p className="mt-6 max-w-2xl text-[15px] leading-[1.9] text-slate md:text-base">
              記事や紹介で{site.name}を取り上げていただくときに、そのまま使える正式な表記、会社紹介文、代表の略歴、ロゴをまとめています。
            </p>
          </Reveal>
        </div>
      </section>

      <section id="facts" className="py-14 md:py-20" aria-labelledby="facts-heading">
        <div className="mx-auto max-w-5xl px-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHead id="facts-heading" title="正式な表記" />
            <CopyButton text={factsText} name="正式な表記" />
          </div>
          <Reveal delay={0.05} className="mt-8 overflow-hidden rounded-2xl border border-line shadow-card">
            <table className="w-full border-collapse bg-white text-sm">
              <tbody>
                {FACTS.map(([k, v]) => (
                  <tr key={k} className="border-b border-line last:border-0">
                    <th scope="row" className="w-28 bg-mist/60 p-4 text-left align-top text-xs font-bold text-slate md:w-40 md:p-5 md:text-sm">
                      {k}
                    </th>
                    <td className="p-4 leading-7 text-ink [overflow-wrap:anywhere] md:p-5">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      <section id="about" className="bg-mist/50 py-14 md:py-20" aria-labelledby="about-heading">
        <div className="mx-auto max-w-5xl px-5">
          <SectionHead id="about-heading" title="会社紹介文" />
          <div className="mt-6 border-t-2 border-ink">
            {INTROS.map((t) => (
              <TextBlock key={t.key} id={`about-${t.key}`} label={t.label} text={t.text} />
            ))}
          </div>
        </div>
      </section>

      <section id="bio" className="py-14 md:py-20" aria-labelledby="bio-heading">
        <div className="mx-auto max-w-5xl px-5">
          <SectionHead id="bio-heading" title="代表の略歴" />
          <div className="mt-6 border-t-2 border-ink">
            {BIOS.map((t) => (
              <TextBlock key={t.key} id={`bio-${t.key}`} label={t.label} text={t.text} />
            ))}
          </div>
          <p className="mt-6 text-sm leading-7 text-slate">
            経歴と監修記事は、
            <a href={AUTHOR_PAGE} target="_blank" rel="noopener" className="text-pulse underline underline-offset-4 hover:text-pulse-deep">
              AI集客ラボの監修者プロフィール ↗
            </a>
            に載せています。
          </p>
        </div>
      </section>

      <section id="logo" className="bg-mist/50 py-14 md:py-20" aria-labelledby="logo-heading">
        <div className="mx-auto max-w-5xl px-5">
          <SectionHead id="logo-heading" title="ロゴ" lead="背景が透明の PNG です。" />
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {LOGOS.map((l) => (
              <li key={l.file} className="grid gap-3">
                <div className={`grid aspect-[4/3] place-items-center rounded-2xl border border-line p-8 ${l.dark ? "bg-ink" : "bg-white"}`}>
                  <Image src={l.src} alt="" width={l.w} height={l.h} className="h-auto max-h-full w-auto max-w-full" />
                </div>
                <p className="font-bold">{l.label}</p>
                <p className="num text-xs text-slate">
                  PNG・{l.w}×{l.h}px
                </p>
                <a href={l.src} download={l.file} className="w-fit text-sm font-bold text-pulse underline underline-offset-4 hover:text-pulse-deep">
                  PNG をダウンロード
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="usage" className="py-14 md:py-20" aria-labelledby="usage-heading">
        <div className="mx-auto max-w-5xl px-5">
          <SectionHead id="usage-heading" title="使用上のお願い" />
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {USAGE.map((u) => (
              <li key={u} className="flex gap-4 py-5 text-[15px] leading-[1.9] text-ink">
                <span aria-hidden className="mt-[0.75em] size-2 shrink-0 rounded-full bg-gold" />
                {u}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="related" className="bg-mist/50 py-14 md:py-20" aria-labelledby="related-heading">
        <div className="mx-auto grid max-w-5xl gap-10 px-5 md:grid-cols-2">
          <div>
            <h2 id="related-heading" className="text-xl font-black md:text-2xl">
              関連するプレスキット
            </h2>
            <p className="mt-4 text-[15px] leading-[1.9] text-slate">
              当社の顧問として AIO 事業とシステム開発事業の責任者を務める YW（AI × 経営コンサルタント）の略歴とロゴは、CONFLUX PARTNERS のプレスキットに載っています。
            </p>
            <a
              href={CONFLUX_KIT}
              target="_blank"
              rel="noopener"
              className="mt-4 inline-block text-sm font-bold text-pulse underline underline-offset-4 hover:text-pulse-deep"
            >
              CONFLUX PARTNERS のプレスキット ↗
            </a>
          </div>
          <div>
            <h2 className="text-xl font-black md:text-2xl">取材のお問い合わせ</h2>
            <p className="mt-4 text-[15px] leading-[1.9] text-slate">
              取材・掲載のご相談は、
              <Link href="/contact" className="text-pulse underline underline-offset-4 hover:text-pulse-deep">
                お問い合わせフォーム
              </Link>
              、またはお電話（
              <a href={`tel:${site.tel.replaceAll("-", "")}`} className="num whitespace-nowrap text-pulse underline-offset-4 hover:underline">
                {site.tel}
              </a>
              ）でお受けしています。受付時間は {site.hours} です。
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

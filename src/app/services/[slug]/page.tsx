import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { Reveal } from "@/components/motion";
import { SectionHead, StatTile, FlowSteps, FaqList, CtaBand, Rich } from "@/components/ui";
import { IndustryBars, RankTable } from "@/components/charts";
import { services, getService } from "@/lib/services";
import { serviceSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

// 各サービスのヒーロー写真 (旧サイトから取得した素材)
const HERO_IMAGE: Record<string, { src: string; alt: string }> = {
  meo: {
    src: "/images/meo-illust.jpg",
    alt: "スマートフォンの地図検索で店舗を探すユーザーのイメージイラスト",
  },
  "ai-consulting": {
    src: "/images/seminar-1.jpg",
    alt: "経営者向けセミナーでAI・デジタル活用を解説する代表",
  },
  aio: {
    src: "/images/customer.png",
    alt: "スマートフォンで情報を調べる生活者",
  },
  "ai-subsidy": {
    src: "/images/seminar-2.jpg",
    alt: "補助金・AI活用をテーマにした経営者向けセミナーで解説する代表",
  },
  "system-development": {
    src: "/images/dev-hero.png",
    alt: "AIネイティブなシステム開発のイメージ (コードエディタとビルドターミナル)",
  },
  "web-production": {
    src: "/images/web-hero.png",
    alt: "高速表示スコア98のホームページとスマートフォン表示のイメージ",
  },
};

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.name,
    description: `${service.lead} ${service.short}`,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const others = services.filter((s) => s.slug !== service.slug);
  const heroImage = HERO_IMAGE[service.slug];
  const schemas = [
    serviceSchema(service.slug),
    faqSchema(service.faq),
    breadcrumbSchema([
      { name: "トップ", path: "/" },
      { name: "事業内容", path: "/services" },
      { name: service.name, path: `/services/${service.slug}` },
    ]),
  ].filter(Boolean) as object[];

  return (
    <>
      <JsonLd data={schemas} />

      {/* ヒーロー */}
      <section className="relative overflow-hidden pt-16 md:pt-20">
        <div aria-hidden className="grid-field absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-10 md:pb-20 md:pt-16">
          <Reveal>
            <nav aria-label="パンくずリスト" className="text-xs text-slate">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-pulse">
                    トップ
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link href="/services" className="hover:text-pulse">
                    事業内容
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="text-ink">
                  {service.name}
                </li>
              </ol>
            </nav>
          </Reveal>
          <div className={`mt-10 grid items-center gap-10 ${heroImage ? "lg:grid-cols-[1.2fr_1fr]" : ""}`}>
            <div>
              <Reveal delay={0.06}>
                <p className="eyebrow">{service.en}</p>
                <h1 className="mt-4 max-w-3xl text-3xl font-black leading-normal md:text-6xl md:leading-snug">
                  {service.name}
                </h1>
                <p className="mt-7 max-w-2xl text-xl font-bold leading-10 text-ink md:text-2xl md:leading-[1.9]">
                  <mark className="marker">{service.lead}</mark>
                </p>
                <p className="mt-5 max-w-2xl text-sm leading-8 text-slate md:text-base">{service.body}</p>
              </Reveal>
              <Reveal delay={0.14}>
                <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <Link
                    href="/contact"
                    data-magnetic className="rounded-full bg-pulse px-8 py-4 text-center text-sm font-bold text-white shadow-glow transition-transform hover:-translate-y-0.5"
                  >
                    このサービスを相談する
                  </Link>
                  {service.slug === "aio" && (
                    <a
                      href={site.labUrl}
                      target="_blank"
                      rel="noopener"
                      data-magnetic className="rounded-full border border-ink/20 px-8 py-4 text-center text-sm font-bold text-ink transition-colors hover:border-pulse hover:text-pulse"
                    >
                      運営メディア「AI集客ラボ」を見る ↗
                    </a>
                  )}
                  {service.slug === "ai-subsidy" && (
                    <a
                      href={site.lpUrl}
                      target="_blank"
                      rel="noopener"
                      data-magnetic className="rounded-full border border-ink/20 px-8 py-4 text-center text-sm font-bold text-ink transition-colors hover:border-pulse hover:text-pulse"
                    >
                      無料診断LPを見る (8問・3分)
                    </a>
                  )}
                </div>
                {service.price && (
                  <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-raise px-4 py-2 text-xs font-bold shadow-card">
                    <span className="text-slate">料金目安</span>
                    <span className="text-pulse">{service.price}</span>
                  </p>
                )}
              </Reveal>
            </div>
            {heroImage && (
              <Reveal delay={0.18} className="mx-auto w-full max-w-md">
                <Image
                  src={heroImage.src}
                  alt={heroImage.alt}
                  width={905}
                  height={640}
                  className="h-auto w-full rounded-3xl shadow-lift"
                  priority
                />
              </Reveal>
            )}
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-3">
            {service.metrics.map((m, i) => (
              <StatTile key={m.label} metric={m} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* こんなお悩みありませんか */}
      <section className="bg-mist py-20 md:py-24" aria-labelledby="challenges-heading">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead en="Problem" title="こんなお悩みはありませんか?" />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {service.challenges.map((c, i) => (
              <Reveal key={c} delay={i * 0.07}>
                <div className="tilt flex items-start gap-4 rounded-2xl border border-line bg-white p-6 shadow-card">
                  <span aria-hidden className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pulse/10">
                    <svg width="14" height="14" viewBox="0 0 14 14" className="text-pulse">
                      <path d="M2.5 7.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <p className="text-sm font-medium leading-7 md:text-base">「{c}」</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <p className="mt-10 text-center text-lg font-bold md:text-xl">
              ひとつでも当てはまるなら、
              <mark className="marker">{service.name}が解決の近道</mark>
              です。
            </p>
          </Reveal>
        </div>
      </section>

      {/* 特長 */}
      <section className="py-20 md:py-24" aria-labelledby="strength-heading">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead en="Strength" title={`${service.name}の特長`} />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {service.points.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1}>
                <article className="tilt h-full rounded-2xl border border-line bg-white p-7 shadow-card">
                  <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-full bg-pulse/10">
                    <span className="h-3 w-3 rounded-full bg-gradient-to-br from-pulse to-aqua" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold leading-relaxed">{p.title}</h3>
                  <p className="mt-3 text-sm leading-8 text-slate">{p.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 深掘り解説 */}
      <section className="bg-mist py-20 md:py-28" aria-labelledby="insight-heading">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            en="Insight"
            title="プロの視点で、深掘りする"
            lead={`${service.name}で成果を出すために、知っておいてほしいことがあります。`}
          />
          <div className="mt-14 grid gap-14">
            {service.insights.map((ins, i) => (
              <Reveal key={ins.title}>
                <article
                  className={`grid items-start gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.8fr)] md:gap-14 ${
                    i % 2 === 1 ? "md:[direction:rtl]" : ""
                  }`}
                >
                  <div className="md:[direction:ltr]">
                    <p className="num text-6xl font-bold text-pulse/15 md:text-8xl">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-2 border-l-4 border-pulse pl-5 text-xl font-bold leading-relaxed md:text-2xl">
                      {ins.title}
                    </h3>
                  </div>
                  <p className="tilt rounded-2xl border border-line bg-white p-7 text-sm leading-9 text-slate shadow-card md:p-10 md:text-base md:leading-10 md:[direction:ltr]">
                    <Rich text={ins.body} />
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MEOページのみ: 仕組み解説 + 実績データ */}
      {service.slug === "meo" && (
        <section className="py-20 md:py-24" aria-labelledby="meo-data-heading">
          <div className="mx-auto max-w-7xl px-5">
            <SectionHead
              en="How MEO Works"
              title="MEOの仕組みを、図で理解する"
              lead="「地名×キーワード」で検索したとき、マップの==上位3位以内==に表示されること。それがMEOのゴールです。"
            />
            <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-[1.6fr_1fr]">
              <Reveal className="tilt rounded-2xl border border-line bg-white p-6 shadow-card md:p-8">
                <Image
                  src="/images/meo-diagram-1.png"
                  alt="スマートフォンで「大阪 レストラン」と検索すると、Googleマップの検索結果で上位3位以内にお店が表示される仕組みの図解"
                  width={1204}
                  height={343}
                  className="h-auto w-full"
                />
                <p className="mt-4 border-t border-line pt-4 text-xs leading-6 text-slate">
                  「地名×キーワード」検索で、あなたのお店をマップ上位3位以内に表示させる——検索したその場で来店先を決めるユーザーに、最初に見つけてもらえます。
                </p>
              </Reveal>
              <Reveal delay={0.1} className="tilt flex flex-col justify-between rounded-2xl border border-line bg-white p-6 shadow-card md:p-8">
                <Image
                  src="/images/meo-diagram-2.png"
                  alt="マップ検索結果で上位のお店が顧客の目に止まりやすいことを示す図解"
                  width={512}
                  height={287}
                  className="h-auto w-full"
                />
                <p className="mt-4 border-t border-line pt-4 text-xs leading-6 text-slate">
                  マップ枠は検索結果の最上部。<mark className="marker">SEOより先に、顧客の目に入ります。</mark>
                </p>
              </Reveal>
            </div>

            <div className="mt-20">
              <SectionHead
                en="Results"
                title="データで見るMEO運用の成果"
                lead="通算3,200社の運用から得た実践データ。業種を問わず、90日を目安に順位とアクション数の変化を可視化します。"
              />
            </div>
            <div className="mt-12 grid items-start gap-6 lg:grid-cols-[1fr_1.4fr]">
              <Reveal className="tilt rounded-2xl border border-line bg-white p-6 shadow-card md:p-8">
                <IndustryBars />
              </Reveal>
              <Reveal delay={0.1}>
                <RankTable />
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* 進め方 */}
      <section className={`py-20 md:py-24 ${service.slug === "meo" ? "bg-mist" : ""}`} aria-labelledby="flow-heading">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead en="Process" title="ご支援の流れ" />
          <div className="mt-12">
            <FlowSteps steps={service.flow} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={`py-20 md:py-24 ${service.slug === "meo" ? "" : "bg-mist"}`} aria-labelledby="faq-heading">
        <div className="mx-auto max-w-4xl px-5">
          <SectionHead en="FAQ" title="よくあるご質問" align="center" />
          <div className="mt-12">
            <FaqList items={service.faq} />
          </div>
        </div>
      </section>

      {/* 他のサービス */}
      <section className="py-20 md:py-24" aria-labelledby="others-heading">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead en="Other Services" title="他の事業を見る" />
          <div className="mt-10 flex flex-wrap gap-3">
            {others.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink shadow-card transition-colors hover:border-pulse hover:text-pulse"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title={`${service.name}、まずは無料相談から。`}
        body="現状を伺った上で、効果の見込みと費用感を率直にお伝えします。オンラインで全国対応しています。"
      />
    </>
  );
}

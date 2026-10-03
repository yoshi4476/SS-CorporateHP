import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import MediaShowcase from "@/components/MediaShowcase";
import KeiriTwoTracks from "@/components/KeiriTwoTracks";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { Reveal } from "@/components/motion";
import { SectionHead, StatTile, FlowSteps, FaqList, CtaBand, Rich, RichLinked } from "@/components/ui";
import { IndustryBars, RankTable } from "@/components/charts";
import SubsidyDetail from "@/components/SubsidyDetail";
import AioDetail from "@/components/AioDetail";
import AioScan from "@/components/AioScan";
import { services, getService } from "@/lib/services";
import { serviceSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";

/** 掲載内容の見直し時点。生成エンジンは古い情報を引用しない */
function reviewedLabel() {
  const d = new Date();
  return `${d.getFullYear()}年${d.getMonth() + 1}月`;
}
import { site } from "@/lib/site";
import { industryPhoto, svcPhoto } from "@/lib/photos";
import { pageMeta } from "@/lib/meta";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return pageMeta({
    title: service.seoTitle ?? service.name,
    description: `${service.lead} ${service.short}`,
    path: `/services/${service.slug}`,
    image: service.image?.src,
  });
}

/** 近い順に並べるための重み。小さいほど先 */
function rank(s: { group: string }, current: string) {
  if (s.group === current) return 0;
  if (s.group === "資金") return 1;
  return 2;
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  // 同じ用途の事業を先に出す。補助金はどの事業の費用も下げるので、その次。
  const others = services
    .filter((s) => s.slug !== service.slug)
    .sort((a, b) => rank(a, service.group) - rank(b, service.group));
  const sectionImages = service.sectionImage
    ? [service.sectionImage].flat()
    : [];
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
      {/* その事業の現場の写真を全幅に敷く（イメージ写真）。文字は左に寄せ、左側だけを暗くする */}
      <section className="relative overflow-hidden bg-ink text-white">
        <Image src={svcPhoto(service.slug, 1)} alt="" fill priority sizes="100vw" className="object-cover object-[65%_center]" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "linear-gradient(90deg, rgb(8 14 26 / 0.9) 0%, rgb(8 14 26 / 0.72) 45%, rgb(8 14 26 / 0.2) 100%), linear-gradient(180deg, rgb(8 14 26 / 0.55) 0%, transparent 30%)" }}
        />
        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-28 md:pb-24 md:pt-36">
          <Reveal>
            <nav aria-label="パンくずリスト" className="text-xs text-white/60">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="tap hover:text-aqua">
                    トップ
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link href="/services" className="tap hover:text-aqua">
                    事業内容
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="text-white">
                  {service.name}
                </li>
              </ol>
            </nav>
          </Reveal>
          <div className="mt-10">
            <div>
              <Reveal delay={0.06}>
                <p className="eyebrow !text-aqua">{service.en}</p>
                <h1 className="mt-4 max-w-3xl text-3xl font-black leading-normal md:text-6xl md:leading-snug">
                  {service.name}
                </h1>
                <p className="mt-7 max-w-2xl text-xl font-bold leading-10 text-white md:text-2xl md:leading-[1.9]">
                  {service.lead}
                </p>
                {/* body も ==強調== を書ける前提のデータなのに、ここだけ素通しで
                    記号がそのまま出ていた */}
                <p className="hero-rich mt-5 max-w-2xl text-sm leading-8 text-white/75 md:text-base">
                  <Rich text={service.body} />
                </p>
              </Reveal>
              <Reveal delay={0.14}>
                {service.slug === "aio" ? (
                  <div className="mt-9 max-w-xl rounded-3xl border border-line bg-raise p-6 text-ink shadow-card md:p-7">
                    <p className="text-sm font-bold">まず、御社のサイトがAIと検索に読まれているかを測ってください。</p>
                    <div className="mt-4">
                      <AioScan src="corp_aio_hero" />
                    </div>
                    <p className="mt-4 border-t border-line pt-4 text-xs leading-6 text-slate">
                      話を聞いてから決めたい方は
                      <Link href="/contact" className="mx-1 font-bold text-pulse underline-offset-4 hover:underline">
                        無料相談
                      </Link>
                      ／ まず学びたい方は
                      <a href={site.labUrl} target="_blank" rel="noopener" className="mx-1 font-bold text-pulse underline-offset-4 hover:underline">
                        運営メディア「AI集客ラボ」↗
                      </a>
                    </p>
                  </div>
                ) : (
                <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <Link
                    href="/contact"
                  className="rounded-full bg-pulse px-8 py-4 text-center text-sm font-bold text-white shadow-glow transition-transform hover:-translate-y-0.5"
                  >
                    このサービスを相談する
                  </Link>
                  {service.slug === "keiri-bpo" && (
                    <a
                      href="/docs/keiri-tanaoroshi-sheet.pdf"
                      download
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 px-8 py-4 text-center text-sm font-bold text-white transition-colors hover:border-aqua hover:text-aqua"
                    >
                      <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden>
                        <path d="M8 1.5v9M4.5 7.5L8 11l3.5-3.5M2 13.5h12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      棚卸しシートを受け取る (無料)
                    </a>
                  )}
                  {service.slug === "ai-subsidy" && (
                    <a
                      href={site.lpUrl}
                      target="_blank"
                      rel="noopener"
                  className="rounded-full border border-white/35 px-8 py-4 text-center text-sm font-bold text-white transition-colors hover:border-aqua hover:text-aqua"
                    >
                      無料診断LPを見る (8問・3分)
                    </a>
                  )}
                </div>
                )}
                {service.price && (
                  <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur-sm">
                    <span className="text-white/60">料金目安</span>
                    <span className="text-aqua">{service.price}</span>
                  </p>
                )}
              </Reveal>
            </div>
          </div>

        </div>
      </section>

      {service.metrics && (
        <section className="border-b border-line bg-raise py-10 md:py-14" aria-label="実績の数字">
          <div className="mx-auto max-w-7xl px-5">
            <div className="grid gap-5 sm:grid-cols-3">
              {service.metrics.map((m, i) => (
                <StatTile key={m.label} metric={m} delay={i * 0.08} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 用途・依頼内容・適した業種 */}
      {(service.useCase || service.menu || service.industries) && (
        <section className="border-y border-line py-20 md:py-24" aria-labelledby="usecase-heading">
          <div className="mx-auto max-w-7xl px-5">
            <SectionHead
              en="Use Case"
              title="どんなときに使うサービスか"
              lead={`事業によって用途が違います。${service.name}が向いている場面と業種を整理しました。`}
            />

            <div className="mt-12 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
              {service.useCase && (
                <Reveal className="rounded-3xl border border-pulse/30 bg-pulse/5 p-8 shadow-card md:p-10">
                  <p className="font-data text-[0.62rem] uppercase tracking-[0.24em] text-pulse">Purpose</p>
                  <h3 className="mt-2 text-xl font-bold md:text-2xl">{service.useCase.title}</h3>
                  <p className="mt-5 text-sm leading-9 text-slate md:text-base">
                    <RichLinked text={service.useCase.body} />
                  </p>
                </Reveal>
              )}

              {service.menu && (
                <Reveal delay={0.1} className="rounded-3xl border border-line bg-white p-8 shadow-card md:p-10">
                  <p className="font-data text-[0.62rem] uppercase tracking-[0.24em] text-pulse">Menu</p>
                  <h3 className="mt-2 text-xl font-bold">代表的なご依頼内容</h3>
                  <ul className="mt-6 grid gap-3 border-t border-line pt-6">
                    {service.menu.map((m) => (
                      <li key={m} className="flex items-start gap-3 text-sm leading-7">
                        <span aria-hidden className="mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-pulse/10">
                          <svg width="9" height="9" viewBox="0 0 14 14" className="text-pulse">
                            <path d="M2.5 7.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        {m}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}
            </div>

            {sectionImages.length > 0 && (
              <div className={`mt-6 grid gap-6 ${sectionImages.length > 1 ? "lg:grid-cols-2" : ""}`}>
                {sectionImages.map((img, i) => (
                  <Reveal key={img.src} delay={0.12 + i * 0.08}>
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={1200}
                      height={660}
                      className="h-auto w-full rounded-3xl border border-line shadow-card"
                    />
                  </Reveal>
                ))}
              </div>
            )}

            {service.industries && (
              <div className="mt-10">
                <p className="eyebrow">Industries — 適している業種</p>
                <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  {service.industries.map((ind, i) => (
                    <Reveal key={ind.name} delay={(i % 4) * 0.08}>
                      <article className="group h-full overflow-hidden rounded-2xl border border-line bg-white shadow-card">
                        <figure className="relative aspect-[16/10] overflow-hidden">
                          <Image src={industryPhoto(ind.name)} alt="" fill sizes="(min-width: 1280px) 300px, (min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                          <h3 className="absolute inset-x-4 bottom-3 text-base font-bold leading-snug text-white">{ind.name}</h3>
                        </figure>
                        <p className="p-5 text-xs leading-7 text-slate">{ind.body}</p>
                      </article>
                    </Reveal>
                  ))}
                </div>
                <p className="mt-6 text-xs leading-7 text-slate">
                  ※ 写真はイメージです。上記以外の業種でもご相談いただけます。適しているかどうかも含めて、無料相談でお答えします。
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* こんなお悩みありませんか */}
      <section className="bg-mist py-20 md:py-24" aria-labelledby="challenges-heading">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead en="Problem" title="こんなお悩みはありませんか?" />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {service.challenges.map((c, i) => (
              <Reveal key={c} delay={i * 0.07}>
                <div className="flex items-start gap-4 rounded-2xl border border-line bg-white p-6 shadow-card">
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

      {/* 経理BPOだけ: 任せるか自社で使うかを、悩みの直後に選ばせる */}
      {service.slug === "keiri-bpo" && <KeiriTwoTracks />}

      {/* 特長 */}
      <section className="py-20 md:py-24" aria-labelledby="strength-heading">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead en="Strength" title={`${service.name}の特長`} />
          <div className="mt-12 grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            <Reveal className="lg:sticky lg:top-28">
              <figure className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lift">
                <Image src={svcPhoto(service.slug, 2)} alt="" fill sizes="(min-width: 1024px) 520px, 100vw" className="object-cover" />
              </figure>
              <p className="mt-3 text-[0.68rem] text-slate">※ 写真はイメージです。</p>
            </Reveal>
            <ol className="grid gap-4">
              {service.points.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.08}>
                  <li className="flex gap-5 rounded-2xl border border-line bg-white p-6 shadow-card md:p-7">
                    <span aria-hidden className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pulse/10">
                      <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-pulse to-aqua" />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold leading-relaxed">{p.title}</h3>
                      <p className="mt-2 text-sm leading-8 text-slate">{p.body}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 取り組み例 */}
      {service.examples && (
        <section className="border-t border-line py-20 md:py-24" aria-labelledby="examples-heading">
          <div className="mx-auto max-w-7xl px-5">
            <SectionHead
              en="Examples"
              title="実際の取り組み例"
              lead="どんな状況で、何をして、どう変わったか。代表的なケースをご紹介します。"
            />
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {service.examples.map((ex, i) => (
                <Reveal key={ex.situation} delay={i * 0.09}>
                  <article className="flex h-full flex-col rounded-3xl border border-line bg-white p-7 shadow-card md:p-8">
                    <span className="num text-xs font-bold text-pulse">CASE 0{i + 1}</span>
                    <div className="mt-5 grid gap-5">
                      <div>
                        <p className="font-data text-[0.58rem] uppercase tracking-[0.2em] text-faint">Before</p>
                        <p className="mt-2 text-sm font-bold leading-7">{ex.situation}</p>
                      </div>
                      <div className="border-t border-line pt-5">
                        <p className="font-data text-[0.58rem] uppercase tracking-[0.2em] text-pulse">Action</p>
                        <p className="mt-2 text-xs leading-7 text-slate">{ex.action}</p>
                      </div>
                      <div className="rounded-2xl bg-pulse/5 p-5">
                        <p className="font-data text-[0.58rem] uppercase tracking-[0.2em] text-pulse">After</p>
                        <p className="mt-2 text-xs font-medium leading-7 text-ink">{ex.result}</p>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
            <p className="mt-6 text-xs leading-7 text-slate">
              ※ 守秘義務のため、お客様が特定される情報は伏せています。数値での実績は、無料相談の際に該当する事例をご案内します。
            </p>
          </div>
        </section>
      )}

      {/* 深掘り解説 */}
      {/* 白と薄灰が交互に続くだけだと最後まで同じ顔に見える。
          読みどころであるこの節だけ金の淡い面にして、縦のリズムを作る */}
      <section className="border-y border-gold/20 bg-gold-tint py-20 md:py-28" aria-labelledby="insight-heading">
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
                    <p className="num text-6xl font-bold text-gold/40 md:text-8xl" aria-hidden>
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-2 border-l-4 border-pulse pl-5 text-xl font-bold leading-relaxed md:text-2xl">
                      {ins.title}
                    </h3>
                  </div>
                  <p className="rounded-2xl border border-line bg-white p-7 text-sm leading-9 text-slate shadow-card md:p-10 md:text-base md:leading-10 md:[direction:ltr]">
                    <Rich text={ins.body} />
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* AIOページのみ: 背景・用語・実装層・測定・料金 */}
      {service.slug === "aio" && <AioDetail />}

      {/* 補助金ページのみ: 要項・シミュレーション・スキーム・お金の流れ */}
      {service.slug === "ai-subsidy" && <SubsidyDetail />}

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
              <Reveal className="rounded-2xl border border-line bg-white p-6 shadow-card md:p-8">
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
              <Reveal delay={0.1} className="flex flex-col justify-between rounded-2xl border border-line bg-white p-6 shadow-card md:p-8">
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
                lead="通算3,200店舗の運用から得た実践データ。業種を問わず、90日を目安に順位とアクション数の変化を可視化します。"
              />
            </div>
            <div className="mt-12 grid items-start gap-6 lg:grid-cols-[1fr_1.4fr]">
              <Reveal className="rounded-2xl border border-line bg-white p-6 shadow-card md:p-8">
                <IndustryBars />
              </Reveal>
              <Reveal delay={0.1}>
                <RankTable />
              </Reveal>
            </div>
          </div>
        </section>
      )}


      {/* AIO運用代行のみ: 動画2本と資料をまとめた区画 */}
      {service.slug === "aio" && <MediaShowcase />}

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

      <section className="pb-4">
        <div className="mx-auto max-w-7xl px-5">
          <p className="text-xs text-faint">
            このページの内容は{reviewedLabel()}時点のものです。料金・対応範囲は
            ご相談時に最新の内容をご案内します。
          </p>
        </div>
      </section>

      <CtaBand
        title={`${service.name}、まずは無料相談から。`}
        body="現状を伺った上で、効果の見込みと費用感を率直にお伝えします。オンラインで全国対応しています。"
      />
    </>
  );
}

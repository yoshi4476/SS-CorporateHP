import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import MediaShowcase from "@/components/MediaShowcase";
import KeiriTwoTracks from "@/components/KeiriTwoTracks";
import InlineToolBox from "@/components/InlineToolBox";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { Reveal } from "@/components/motion";
import { SectionHead, StatTile, FaqList, CtaBand, Rich, RichLinked } from "@/components/ui";
import { StageDiagram, ScopeTable } from "@/components/ServiceFigures";
import KeiriMonthFlow from "@/components/KeiriMonthFlow";
import KeiriCompare from "@/components/KeiriCompare";
import DeveloperCredit from "@/components/DeveloperCredit";
import { creatorLd } from "@/lib/developer";
import { IndustryBars, RankTable } from "@/components/charts";
import SubsidyDetail from "@/components/SubsidyDetail";
import AioDetail from "@/components/AioDetail";
import AioResearchData from "@/components/AioResearchData";
import AioScan from "@/components/AioScan";
import { services, getService } from "@/lib/services";
import { scopes } from "@/lib/serviceScope";
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
    description: service.metaDescription ?? `${service.lead} ${service.short}`,
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
  const scope = scopes[service.slug];
  const schemas = [
    serviceSchema(service.slug),
    service.slug === "keiri-bpo" && {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "経理システム（セルフ版）",
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "会計・経理",
      operatingSystem: "Web",
      url: `${site.url}/services/keiri-bpo`,
      description: "受け取った書類から仕訳の案を作り、担当者が確認して確定するまでを1か所にまとめた経理システム。給与・賞与・年末調整、請求と入金の消込まで同じ場所で扱える。",
      publisher: { "@id": `${site.url}/#organization` },
      creator: creatorLd("keiri"),
    },
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
        <Image src={svcPhoto(service.slug, 1)} alt={`${service.name}の現場のイメージ`} fill priority sizes="100vw" className="object-cover object-[65%_center]" />
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
                <p aria-hidden className="eyebrow !text-aqua" />
                <h1 className="mt-4 max-w-3xl text-3xl font-black leading-normal md:text-6xl md:leading-snug">
                  {service.name}
                </h1>
                <p className="mt-7 max-w-2xl text-xl font-bold leading-10 text-white md:text-2xl md:leading-[1.9]">
                  {service.lead}
                </p>
                {/* body も ==強調== を書ける前提のデータなのに、ここだけ素通しで
                    記号がそのまま出ていた */}
                <p className="hero-rich mt-5 max-w-2xl text-[15px] leading-[1.9] text-white/75 md:text-base">
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
                    {/* AIからこのページに来る人が最も多い（直近28日で11件）が、問い合わせは0件だった。
                        URLを入れる診断より軽い「AIに自社が出るか」の入口を並べる（2026-10-04） */}
                    <p className="mt-4 text-sm leading-7 text-slate">
                      ChatGPT などに「おすすめは？」と聞いたとき、御社が出てくるかを確かめるなら
                      <a
                        href={`${site.labUrl}tools/ai-check/?utm_source=corp&utm_medium=referral&utm_campaign=corp_aio_hero`}
                        target="_blank"
                        rel="noopener"
                        className="mx-1 font-bold text-pulse underline-offset-4 hover:underline"
                      >
                        AI診断（地域と業種を選ぶだけ・無料）↗
                      </a>
                    </p>
                    <p className="mt-4 border-t border-line pt-4 text-sm leading-7 text-slate">
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
                {/* 相談・資料の手前の入口。経理の記事から来た人が、まず自分で範囲の目安をつけられるようにする */}
                {service.slug === "keiri-bpo" && (
                  <Link
                    href="/tools/keiri-check?from=/services/keiri-bpo"
                    className="mt-6 block w-fit text-[15px] font-bold leading-8 text-white underline decoration-gold-bright decoration-2 underline-offset-[6px] transition-colors hover:text-gold-bright"
                  >
                    まず5問のセルフチェックで、外に出せる範囲を確かめる
                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className="ml-1.5 inline-block align-[-1px]">
                      <path d="M2 7h9M8 3.5L11.5 7 8 10.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  </Link>
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
              id="usecase-heading"
              title="どんなときに使うサービスか"
              lead={`事業によって用途が違います。${service.name}が向いている場面と業種を整理しました。`}
            />

            <div className="mt-12 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
              {service.useCase && (
                <Reveal className="rounded-3xl border border-pulse/30 bg-pulse/5 p-8 shadow-card md:p-10">
                  <h3 className="mt-2 text-xl font-bold md:text-2xl">{service.useCase.title}</h3>
                  <p className="mt-5 text-[15px] leading-[1.9] text-slate md:text-base">
                    <RichLinked text={service.useCase.body} />
                  </p>
                </Reveal>
              )}

              {service.menu && (
                <Reveal delay={0.1} className="rounded-3xl border border-line bg-white p-8 shadow-card md:p-10">
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

              {/* 依頼内容の一覧が無い事業は、右が空かないよう現場の写真（イメージ）を置く */}
              {!service.menu && (
                <Reveal delay={0.1} className="relative min-h-[18rem] overflow-hidden rounded-3xl shadow-card">
                  <Image src={svcPhoto(service.slug, 3)} alt={`${service.name}を使う場面のイメージ`} fill sizes="(min-width: 1024px) 520px, 100vw" className="object-cover" />
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
                <p className="eyebrow">適している業種</p>
                <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  {service.industries.map((ind, i) => (
                    <Reveal key={ind.name} delay={(i % 4) * 0.08}>
                      <article className="group h-full overflow-hidden rounded-2xl border border-line bg-white shadow-card">
                        <figure className="relative aspect-[16/10] overflow-hidden">
                          <Image src={industryPhoto(ind.name)} alt={`${ind.name}の現場のイメージ`} fill sizes="(min-width: 1280px) 300px, (min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                          <h3 className="absolute inset-x-4 bottom-3 text-base font-bold leading-snug text-white">{ind.name}</h3>
                        </figure>
                        <p className="p-5 text-sm leading-7 text-slate">{ind.body}</p>
                      </article>
                    </Reveal>
                  ))}
                </div>
                <p className="mt-6 text-sm leading-7 text-slate">
                  ※ 写真はイメージです。上記以外の業種でもご相談いただけます。適しているかどうかも含めて、無料相談でお答えします。
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 経理BPOだけ: どこまで任せられるか（FAQの1問目）に、1か月の流れの図と「できること・できないこと」で先に答える。
          記事から来る人がいちばん知りたいのはここ */}
      {service.slug === "keiri-bpo" && (
        <section id="scope" className="scroll-mt-24 py-20 md:py-24" aria-labelledby="scope-heading">
          <div className="mx-auto max-w-7xl px-5">
            <SectionHead
              id="scope-heading"
              title="どこまで任せられるか"
              lead="1か月の経理の流れに沿って、当社が引き受ける作業と、御社・専門家に残る作業を分けました。切り分ける軸は==社内にしか無い情報が要るかどうか==です。"
            />
            <Reveal className="mt-12">
              <KeiriMonthFlow />
            </Reveal>
            {scope && (
              <div className="mt-12">
                <ScopeTable name={service.name} scope={scope} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* こんなお悩みありませんか */}
      <section className="bg-mist py-20 md:py-24" aria-labelledby="challenges-heading">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead id="challenges-heading" title="こんなお悩みはありませんか?" />
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
          {/* どこまで外に出せるかは、悩みを読んだ直後がいちばん知りたい */}
          {service.slug === "keiri-bpo" && (
            <div className="mx-auto max-w-3xl">
              <InlineToolBox from="/services/keiri-bpo" place="service" />
            </div>
          )}
        </div>
      </section>

      {/* 経理BPOだけ: 採用・派遣・外注を同じ軸で比べてから、任せるか自社で使うかを選ばせる */}
      {service.slug === "keiri-bpo" && (
        <section id="compare" className="scroll-mt-24 py-20 md:py-24" aria-labelledby="compare-heading">
          <div className="mx-auto max-w-7xl px-5">
            <SectionHead
              id="compare-heading"
              title="採用・派遣・外注を比べる"
              lead="経理の手を確保する方法は、採用だけではありません。自社で担当・派遣やパート・外注の3つを、指示・属人化・繁忙期・確認の体制で比べました。"
            />
            <Reveal className="mt-12">
              <KeiriCompare />
            </Reveal>
          </div>
        </section>
      )}

      {/* 経理BPOだけ: 任せるか自社で使うかを、比較の直後に選ばせる */}
      {service.slug === "keiri-bpo" && <KeiriTwoTracks />}
      {service.slug === "keiri-bpo" && <DeveloperCredit product="keiri" label="経理システム（セルフ版）" />}

      {/* 特長 */}
      <section className="py-20 md:py-24" aria-labelledby="strength-heading">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead id="strength-heading" title={`${service.name}の特長`} />
          {/* 写真は横長で上に1枚、特長はその下に横並び（左に写真・右に縦の一覧だと、一覧の下で左が長く空いた） */}
          <Reveal>
            <figure className="relative mt-12 aspect-[16/9] overflow-hidden rounded-3xl shadow-lift md:aspect-[21/8]">
              <Image src={svcPhoto(service.slug, 2)} alt={`${service.name}を任せた後のイメージ`} fill sizes="(min-width: 1280px) 1240px, 100vw" className="object-cover" />
              <figcaption className="absolute bottom-3 right-4 text-xs text-white/80">※ 写真はイメージです</figcaption>
            </figure>
          </Reveal>
          {/* 4つなら2×2（3列だと1枚だけ次の段に残り、右が空く） */}
          <ol className={`mt-6 grid gap-5 md:grid-cols-2 ${service.points.length === 4 ? "" : "lg:grid-cols-3"}`}>
            {service.points.map((p, i) => (
              <li key={p.title} className="h-full">
                <Reveal delay={i * 0.08} className="h-full">
                <div className="h-full rounded-2xl border border-line bg-white p-7 shadow-card">
                  <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-full bg-pulse/10">
                    <span className="h-3 w-3 rounded-full bg-gradient-to-br from-pulse to-aqua" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold leading-relaxed">{p.title}</h3>
                  <p className="mt-3 text-[15px] leading-[1.9] text-slate">{p.body}</p>
                </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 取り組み例 */}
      {service.examples && (
        <section id="examples" className="scroll-mt-24 border-t border-line py-20 md:py-24" aria-labelledby="examples-heading">
          <div className="mx-auto max-w-7xl px-5">
            <SectionHead
              id="examples-heading"
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
                        <p className="text-[13px] font-bold text-faint">以前の状況</p>
                        <p className="mt-2 text-sm font-bold leading-7">{ex.situation}</p>
                      </div>
                      <div className="border-t border-line pt-5">
                        <p className="text-[13px] font-bold text-pulse">行ったこと</p>
                        <p className="mt-2 text-sm leading-7 text-slate">{ex.action}</p>
                      </div>
                      <div className="rounded-2xl bg-pulse/5 p-5">
                        <p className="text-[13px] font-bold text-pulse">変わったこと</p>
                        <p className="mt-2 text-sm font-medium leading-7 text-ink">{ex.result}</p>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
            <p className="mt-6 text-sm leading-7 text-slate">
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
            id="insight-heading"
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
                  <p className="rounded-2xl border border-line bg-white p-7 text-[15px] leading-[1.9] text-slate shadow-card md:p-10 md:text-base md:leading-10 md:[direction:ltr]">
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
      {service.slug === "aio" && <AioResearchData />}

      {/* 補助金ページのみ: 要項・シミュレーション・スキーム・お金の流れ */}
      {service.slug === "ai-subsidy" && <SubsidyDetail />}

      {/* MEOページのみ: 仕組み解説 + 実績データ */}
      {service.slug === "meo" && (
        <section className="py-20 md:py-24" aria-labelledby="meo-data-heading">
          <div className="mx-auto max-w-7xl px-5">
            <SectionHead
              id="meo-data-heading"
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
                <p className="mt-4 border-t border-line pt-4 text-sm leading-7 text-slate">
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
                <p className="mt-4 border-t border-line pt-4 text-sm leading-7 text-slate">
                  マップ枠は検索結果の最上部。<mark className="marker">SEOより先に、顧客の目に入ります。</mark>
                </p>
              </Reveal>
            </div>

            <div className="mt-20">
              <SectionHead
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

      {/* できること・できないこと（経理BPOは上の「どこまで任せられるか」に置いている）。
          進め方と同じ面にして、範囲 → 進め方 の順で読ませる */}
      {service.slug !== "keiri-bpo" && scope && (
        <section
          id="scope"
          className={`scroll-mt-24 border-t border-line pt-20 md:pt-24 ${service.slug === "meo" ? "bg-mist" : ""}`}
          aria-labelledby="scope-heading"
        >
          <div className="mx-auto max-w-7xl px-5">
            <SectionHead
              id="scope-heading"
              title="できること・できないこと"
              lead={`${service.name}でお引き受けすることと、お引き受けしないことです。頼んでから「それは対象外」と分かる食い違いを、先になくしておきます。`}
            />
            <div className="mt-12">
              <ScopeTable name={service.name} scope={scope} />
            </div>
          </div>
        </section>
      )}

      {/* 進め方（段階図） */}
      <section id="flow" className={`scroll-mt-24 py-20 md:py-24 ${service.slug === "meo" ? "bg-mist" : ""}`} aria-labelledby="flow-heading">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead id="flow-heading" title={service.slug === "keiri-bpo" ? "ご依頼から開始までの流れ" : "ご支援の流れ"} />
          <div className="mt-12">
            <StageDiagram
              steps={service.flow}
              caption={`${service.name}の進め方。${service.flow.map((s) => s.title).join("→")}の${service.flow.length}段階で進めます。`}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={`py-20 md:py-24 ${service.slug === "meo" ? "" : "bg-mist"}`} aria-labelledby="faq-heading">
        {/* ほかの区画と同じ幅・同じ左端。見出しを左、質問を右に並べる（中央寄せの細い列だけ浮いていた） */}
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHead id="faq-heading" title="よくあるご質問" />
          </div>
          <div>
            <FaqList items={service.faq} />
          </div>
        </div>
      </section>

      {/* 他のサービス */}
      <section className="py-20 md:py-24" aria-labelledby="others-heading">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead id="others-heading" title="他の事業を見る" />
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
          <p className="text-sm leading-7 text-faint">
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

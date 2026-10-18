import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import MediaShowcase from "@/components/MediaShowcase";
import KeiriTwoTracks from "@/components/KeiriTwoTracks";
import InlineToolBox from "@/components/InlineToolBox";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { SectionHead, StorySection, StatTile, FaqList, CtaBand, Rich, RichLinked, Breadcrumb } from "@/components/ui";
import { StageDiagram, ScopeTable } from "@/components/ServiceFigures";
import KeiriMonthFlow from "@/components/KeiriMonthFlow";
import KeiriCompare from "@/components/KeiriCompare";
import ResearchBand from "@/components/ResearchBand";
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
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/meta";

/** 掲載内容の見直し時点。生成エンジンは古い情報を引用しない */
function reviewedLabel() {
  const d = new Date();
  return `${d.getFullYear()}年${d.getMonth() + 1}月`;
}

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

// 事業ページの話の順番（トップと同じ）。読者が「困りごと → 原因 → やり方 → 根拠 → 料金と流れ → 相談」と進む
function storyOf(hasEvidence: boolean) {
  return [
    { id: "challenges", label: "困りごと" },
    { id: "insights", label: "つまずく理由" },
    { id: "approach", label: "当社のやり方" },
    ...(hasEvidence ? [{ id: "evidence", label: "根拠" }] : []),
    { id: "flow", label: "料金と流れ" },
    { id: "faq", label: "よくある質問" },
  ];
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  // 同じ用途の事業を先に出す。補助金はどの事業の費用も下げるので、その次。
  const others = services
    .filter((s) => s.slug !== service.slug)
    .sort((a, b) => rank(a, service.group) - rank(b, service.group));
  const sectionImages = service.sectionImage ? [service.sectionImage].flat() : [];
  const scope = scopes[service.slug];
  const isKeiri = service.slug === "keiri-bpo";
  // 根拠の区画: 実績の数字・取り組み例・MEO の実績データ。AIO は業種別の調査、経理BPOは調査の要点が根拠にあたる
  const hasEvidenceBlock = Boolean(service.metrics || service.examples || service.slug === "meo");
  const hasEvidence = hasEvidenceBlock || service.slug === "aio" || isKeiri;
  const story = storyOf(hasEvidence);
  const schemas = [
    serviceSchema(service.slug),
    isKeiri && {
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

      {/* ページの頭。以前は現場のイメージ写真を全幅に敷いて白抜きの文字を載せていた。
          何の事業で、何を約束するのかを白地で先に読ませ、右にこのページの順番を置く */}
      <section className="border-b border-line pt-16 md:pt-[72px]">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-8 md:px-8 md:pb-16 md:pt-12">
          <Breadcrumb
            items={[
              { name: "トップ", href: "/" },
              { name: "事業内容", href: "/services" },
              { name: service.name },
            ]}
          />
          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-8">
              <h1 className="text-[2rem] font-bold leading-[1.3] md:text-5xl md:leading-[1.25]">{service.name}</h1>
              <p className="mt-6 max-w-[30em] text-xl font-bold leading-[1.7] md:text-2xl">{service.lead}</p>
              {/* body も ==強調== を書ける前提のデータ */}
              <p className="mt-5 max-w-[40em] text-base leading-[1.9] text-slate">
                <Rich text={service.body} />
              </p>

              {service.slug === "aio" ? (
                <div className="mt-9 max-w-2xl rounded-md border border-line-strong p-6 md:p-7">
                  <p className="text-[15px] font-bold">まず、御社のサイトがAIと検索に読まれているかを測ってください。</p>
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
                      className="link-u mx-1"
                    >
                      AI診断（地域と業種を選ぶだけ・無料）↗
                    </a>
                  </p>
                  <p className="mt-4 border-t border-line pt-4 text-sm leading-7 text-slate">
                    話を聞いてから決めたい方は
                    <Link href="/contact" className="link-u mx-1">
                      無料相談
                    </Link>
                    ／ まず学びたい方は
                    <a href={site.labUrl} target="_blank" rel="noopener" className="link-u mx-1">
                      運営メディア「AI集客ラボ」↗
                    </a>
                  </p>
                </div>
              ) : (
                <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <Link href="/contact" className="btn btn-primary px-8">
                    このサービスを相談する
                  </Link>
                  {isKeiri && (
                    <a href="/docs/keiri-tanaoroshi-sheet.pdf" download className="btn btn-secondary">
                      <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden>
                        <path d="M8 1.5v9M4.5 7.5L8 11l3.5-3.5M2 13.5h12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      棚卸しシートを受け取る (無料)
                    </a>
                  )}
                  {service.slug === "ai-subsidy" && (
                    <a href={site.lpUrl} target="_blank" rel="noopener" className="btn btn-secondary">
                      無料診断LPを見る (8問・3分)
                    </a>
                  )}
                </div>
              )}
              {/* 相談・資料の手前の入口。経理の記事から来た人が、まず自分で範囲の目安をつけられるようにする */}
              {isKeiri && (
                <Link href="/tools/keiri-check" data-entry-from="/services/keiri-bpo" className="link-u mt-5 inline-flex min-h-11 items-center text-[15px]">
                  まず5問のセルフチェックで、外に出せる範囲を確かめる
                </Link>
              )}
              {service.price && (
                <dl className="mt-6 flex max-w-[40em] flex-wrap gap-x-3 border-t border-line pt-4 text-sm">
                  <dt className="font-bold text-slate">料金目安</dt>
                  <dd className="font-bold text-ink">{service.price}</dd>
                </dl>
              )}
            </div>

            {/* このページの順番 */}
            <nav aria-label="このページの順番" className="lg:col-span-4">
              <p className="text-[13px] font-bold text-slate">このページの順番</p>
              <ol className="mt-2 border-t border-ink">
                {story.map((s, i) => (
                  <li key={s.id} className="border-b border-line">
                    <a href={`#${s.id}`} className="flex min-h-11 items-center gap-3 text-[15px] font-bold transition-colors hover:text-pulse">
                      <span className="num w-5 text-[13px] text-pulse">{i + 1}</span>
                      {s.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      </section>

      {/* 1. 困りごと */}
      <StorySection id="challenges" title="こんなお悩みはありませんか?">
        <ul className="border-b border-line">
          {service.challenges.map((c) => (
            <li key={c} className="flex items-start gap-4 border-t border-line py-4">
              <span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 bg-ink" />
              <p className="text-base font-bold leading-[1.75]">「{c}」</p>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-lg font-bold leading-relaxed">
          ひとつでも当てはまるなら、<mark className="marker">{service.name}が解決の近道</mark>です。
        </p>
        {/* どこまで外に出せるかは、悩みを読んだ直後がいちばん知りたい */}
        {isKeiri && <InlineToolBox from="/services/keiri-bpo" place="service" />}
      </StorySection>

      {/* 2. つまずく理由（プロの視点） */}
      <StorySection
        id="insights"
        tone="mist"
        title="プロの視点で、深掘りする"
        lead={`${service.name}で成果を出すために、知っておいてほしいことがあります。`}
      >
        <div className="border-b border-line-strong">
          {service.insights.map((ins) => (
            <article key={ins.title} className="border-t border-line-strong py-7">
              <h3 className="text-xl font-bold leading-snug md:text-[1.375rem]">{ins.title}</h3>
              <p className="mt-4 max-w-[42em] text-base leading-[1.95] text-slate">
                <Rich text={ins.body} />
              </p>
            </article>
          ))}
        </div>
      </StorySection>

      {/* 3. 当社のやり方 */}
      <StorySection
        id="approach"
        title={`${service.name}の進め方と特長`}
        lead={`事業によって用途が違います。${service.name}が向いている場面と、当社が守っていることです。`}
      >
        {service.useCase && (
          <div className="border-l-2 border-pulse pl-5 md:pl-6">
            <h3 className="text-lg font-bold leading-snug md:text-xl">{service.useCase.title}</h3>
            <p className="mt-3 text-base leading-[1.9] text-slate">
              <RichLinked text={service.useCase.body} />
            </p>
          </div>
        )}

        <ul className={`mt-12 grid gap-x-8 ${service.points.length === 4 ? "md:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-3"}`}>
          {service.points.map((p) => (
            <li key={p.title} className="border-t-2 border-ink py-5">
              <h3 className="text-lg font-bold leading-snug">{p.title}</h3>
              {/* 本文に **太字** がある（経理BPOの4つ目） */}
              <p className="mt-3 text-[15px] leading-[1.9] text-slate">
                <Rich text={p.body} />
              </p>
            </li>
          ))}
        </ul>

        {service.menu && (
          <div className="mt-12">
            <h3 className="text-lg font-bold">代表的なご依頼内容</h3>
            <ul className="mt-4 grid border-t border-line sm:grid-cols-2 sm:gap-x-8">
              {service.menu.map((m) => (
                <li key={m} className="flex items-start gap-3 border-b border-line py-3 text-[15px] leading-7">
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className="mt-1.5 shrink-0 text-pulse">
                    <path d="M2.5 7.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}

        {sectionImages.length > 0 && (
          <div className={`mt-12 grid gap-6 ${sectionImages.length > 1 ? "lg:grid-cols-2" : ""}`}>
            {sectionImages.map((img) => (
              <Image key={img.src} src={img.src} alt={img.alt} width={1200} height={660} className="h-auto w-full rounded-md border border-line" />
            ))}
          </div>
        )}

        {service.industries && (
          <div className="mt-12">
            <h3 className="text-lg font-bold">適している業種</h3>
            <dl className="mt-4 border-b border-line">
              {service.industries.map((ind) => (
                <div key={ind.name} className="grid gap-1 border-t border-line py-4 md:grid-cols-[14rem_1fr] md:gap-6">
                  <dt className="font-bold leading-7">{ind.name}</dt>
                  <dd className="text-[15px] leading-7 text-slate">{ind.body}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm leading-7 text-slate">
              上記以外の業種でもご相談いただけます。適しているかどうかも含めて、無料相談でお答えします。
            </p>
          </div>
        )}
      </StorySection>

      {/* 経理BPOだけ: どこまで任せられるか（FAQの1問目）に、1か月の流れの図と「できること・できないこと」で先に答える */}
      {isKeiri && (
        <section id="scope" className="scroll-mt-20 pb-[72px] md:pb-28" aria-labelledby="scope-heading">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <SectionHead
              id="scope-heading"
              title="どこまで任せられるか"
              lead="1か月の経理の流れに沿って、当社が引き受ける作業と、御社・専門家に残る作業を分けました。切り分ける軸は==社内にしか無い情報が要るかどうか==です。"
            />
            <div className="mt-10">
              <KeiriMonthFlow />
            </div>
            {scope && (
              <div className="mt-12">
                <ScopeTable name={service.name} scope={scope} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* 経理BPOだけ: 採用・派遣・外注を同じ軸で比べてから、任せるか自社で使うかを選ばせる */}
      {isKeiri && (
        <section id="compare" className="scroll-mt-20 pb-[72px] md:pb-28" aria-labelledby="compare-heading">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <SectionHead
              id="compare-heading"
              title="採用・派遣・外注を比べる"
              lead="経理の手を確保する方法は、採用だけではありません。自社で担当・派遣やパート・外注の3つを、指示・属人化・繁忙期・確認の体制で比べました。"
            />
            <div className="mt-10">
              <KeiriCompare />
            </div>
          </div>
        </section>
      )}
      {isKeiri && <KeiriTwoTracks />}
      {isKeiri && <DeveloperCredit product="keiri" label="経理システム（セルフ版）" />}

      {/* AIOページのみ: 背景・用語・実装層・測定・料金 */}
      {service.slug === "aio" && <AioDetail />}

      {/* 補助金ページのみ: 要項・シミュレーション・スキーム・お金の流れ */}
      {service.slug === "ai-subsidy" && <SubsidyDetail />}

      {/* MEOページのみ: 仕組み解説 */}
      {service.slug === "meo" && (
        <section className="pb-[72px] md:pb-28" aria-labelledby="meo-data-heading">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <SectionHead
              id="meo-data-heading"
              title="MEOの仕組みを、図で理解する"
              lead="「地名×キーワード」で検索したとき、マップの==上位3位以内==に表示されること。それがMEOのゴールです。"
            />
            <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-[1.6fr_1fr]">
              <figure className="rounded-md border border-line p-5 md:p-7">
                <Image
                  src="/images/meo-diagram-1.png"
                  alt="スマートフォンで「大阪 レストラン」と検索すると、Googleマップの検索結果で上位3位以内にお店が表示される仕組みの図解"
                  width={1204}
                  height={343}
                  className="h-auto w-full"
                />
                <figcaption className="mt-4 border-t border-line pt-4 text-sm leading-7 text-slate">
                  「地名×キーワード」検索で、あなたのお店をマップ上位3位以内に表示させる——検索したその場で来店先を決めるユーザーに、最初に見つけてもらえます。
                </figcaption>
              </figure>
              <figure className="flex flex-col justify-between rounded-md border border-line p-5 md:p-7">
                <Image
                  src="/images/meo-diagram-2.png"
                  alt="マップ検索結果で上位のお店が顧客の目に止まりやすいことを示す図解"
                  width={512}
                  height={287}
                  className="h-auto w-full"
                />
                <figcaption className="mt-4 border-t border-line pt-4 text-sm leading-7 text-slate">
                  マップ枠は検索結果の最上部。<mark className="marker">SEOより先に、顧客の目に入ります。</mark>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>
      )}

      {/* できること・できないこと（経理BPOは上の「どこまで任せられるか」に置いている） */}
      {!isKeiri && scope && (
        <section id="scope" className="scroll-mt-20 pb-[72px] md:pb-28" aria-labelledby="scope-heading">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <SectionHead
              id="scope-heading"
              title="できること・できないこと"
              lead={`${service.name}でお引き受けすることと、お引き受けしないことです。頼んでから「それは対象外」と分かる食い違いを、先になくしておきます。`}
            />
            <div className="mt-10">
              <ScopeTable name={service.name} scope={scope} />
            </div>
          </div>
        </section>
      )}

      {/* 4. 根拠 */}
      {hasEvidenceBlock && (
        <section id="evidence" className="scroll-mt-20 bg-mist py-[72px] md:py-28" aria-labelledby="evidence-heading">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <SectionHead
              id="evidence-heading"
              title="根拠になる数字と、取り組み例"
              lead={
                service.slug === "meo"
                  ? "通算3,200店舗の運用から得た実践データ。業種を問わず、90日を目安に順位とアクション数の変化を可視化します。"
                  : `${service.name}の実績と、これまでの取り組みです。`
              }
            />

            {service.metrics && (
              <div className="mt-10 grid gap-8 sm:grid-cols-3">
                {service.metrics.map((m) => (
                  <StatTile key={m.label} metric={m} />
                ))}
              </div>
            )}

            {service.slug === "meo" && (
              <div className="mt-12 grid items-start gap-10 lg:grid-cols-[1fr_1.4fr]">
                <IndustryBars />
                <RankTable />
              </div>
            )}

            {service.examples && (
              <div id="examples" className="mt-14 scroll-mt-24">
                <h3 className="text-lg font-bold">実際の取り組み例</h3>
                <p className="mt-2 text-[15px] leading-[1.85] text-slate">どんな状況で、何をして、どう変わったか。代表的なケースをご紹介します。</p>
                <div className="mt-6 border-b border-line-strong">
                  {service.examples.map((ex) => (
                    <article key={ex.situation} className="grid gap-4 border-t border-line-strong py-6 md:grid-cols-3 md:gap-8">
                      <div>
                        <p className="text-[13px] font-bold text-slate">以前の状況</p>
                        <p className="mt-1.5 text-[15px] font-bold leading-7">{ex.situation}</p>
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-slate">行ったこと</p>
                        <p className="mt-1.5 text-[15px] leading-7 text-slate">{ex.action}</p>
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-pulse">変わったこと</p>
                        <p className="mt-1.5 text-[15px] font-bold leading-7">{ex.result}</p>
                      </div>
                    </article>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-7 text-slate">
                  ※ 守秘義務のため、お客様が特定される情報は伏せています。数値での実績は、無料相談の際に該当する事例をご案内します。
                </p>
              </div>
            )}
          </div>
        </section>
      )}
      {/* AIO運用代行のみ: 業種別の調査と、動画2本と資料をまとめた区画 */}
      {service.slug === "aio" && (
        <div id={hasEvidenceBlock ? undefined : "evidence"} className="scroll-mt-20">
          <AioResearchData />
          <MediaShowcase />
        </div>
      )}
      {/* 経理BPOだけ: 調査の要点（AIに聞いても答えが条件で割れる）から、まず現状を伺う流れへつなぐ */}
      {isKeiri && (
        <div id="evidence" className="scroll-mt-20">
          <ResearchBand note="どこまでを外に出せるかも、会社の条件で変わります。当社が範囲を決める前に現状を伺うのは、そのためです。" />
        </div>
      )}

      {/* 5. 料金と流れ */}
      <section id="flow" className="scroll-mt-20 py-[72px] md:py-28" aria-labelledby="flow-heading">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHead
            id="flow-heading"
            title={isKeiri ? "ご依頼から開始までの流れ" : "ご支援の流れ"}
            lead={service.price ? `料金目安: ${service.price}` : "料金は、現状を伺ったうえでお見積りをご提示します。"}
          />
          <div className="mt-10">
            <StageDiagram
              steps={service.flow}
              caption={`${service.name}の進め方。${service.flow.map((s) => s.title).join("→")}の${service.flow.length}段階で進めます。`}
            />
          </div>
        </div>
      </section>

      {/* 6. よくある質問 */}
      <StorySection id="faq" tone="mist" title="よくあるご質問">
        <FaqList items={service.faq} />
      </StorySection>

      {/* 他の事業 */}
      <section className="py-[72px] md:py-24" aria-labelledby="others-heading">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHead id="others-heading" title="他の事業を見る" />
          <ul className="mt-6 grid border-b border-line sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3">
            {others.map((s) => (
              <li key={s.slug} className="border-t border-line">
                <Link href={`/services/${s.slug}`} className="group block py-4">
                  <span className="font-bold text-pulse underline decoration-1 underline-offset-[0.35em] group-hover:decoration-2">{s.name}</span>
                  <span className="mt-1 block text-sm leading-6 text-slate">{s.short}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-[13px] leading-6 text-faint">
            このページの内容は{reviewedLabel()}時点のものです。料金・対応範囲はご相談時に最新の内容をご案内します。
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

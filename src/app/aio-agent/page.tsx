import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { Reveal } from "@/components/motion";
import { SectionHead, FaqList, FlowSteps } from "@/components/ui";
import { StickyCta, MidCta } from "@/components/LpCta";
import {
  pipeline,
  problems,
  flow,
  evidence,
  assurance,
  compare,
  offer,
  report,
  reportNote,
  gate,
  aio,
  includes,
  steps,
  faq,
} from "@/lib/autopipeline";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: `${pipeline.name}｜月60本`,
  description:
    "オウンドメディアの器と、記事を書いて出し続けるAIエージェントをセットで納品します。キーワード選定から執筆・品質審査・公開・インデックス登録・順位集計まで、人の手を介さずに毎日動きます。",
  path: "/aio-agent",
});

export default function MediaPipelinePage() {
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: pipeline.name,
    alternateName: pipeline.nameEn,
    serviceType: "オウンドメディア構築・SEO/AIO運用自動化",
    provider: { "@id": `${site.url}/#organization` },
    areaServed: "JP",
    description: pipeline.summary,
    url: `${site.url}/aio-agent`,
    offers: { "@type": "Offer", priceCurrency: "JPY", description: "個別お見積り (規模と領域数による)" },
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <JsonLd
        data={[
          serviceLd,
          faqLd,
          breadcrumbSchema([
            { name: "トップ", path: "/" },
            { name: "事業内容", path: "/services" },
            { name: pipeline.name, path: "/aio-agent" },
          ]),
        ]}
      />

      {/* 看板 */}
      <section className="relative overflow-hidden pt-16 md:pt-20">
        <div aria-hidden className="grid-field absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-10 md:pb-20 md:pt-16">
          <Reveal>
            <nav aria-label="パンくずリスト" className="text-xs text-slate">
              <ol className="flex flex-wrap items-center gap-2">
                <li><Link href="/" className="tap hover:text-pulse">トップ</Link></li>
                <li aria-hidden>/</li>
                <li><Link href="/services" className="tap hover:text-pulse">事業内容</Link></li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="text-ink">{pipeline.name}</li>
              </ol>
            </nav>
          </Reveal>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.02fr_1fr] lg:gap-14">
            <div className="min-w-0">
              <Reveal>
                <p className="eyebrow">AIO / SEO Agent — {pipeline.deliverable}</p>
                <h1 className="mt-4 text-[8vw] font-black leading-[1.24] tracking-tight sm:text-5xl md:text-[3.2rem]">
                  広告費ではなく、
                  <br />
                  <span className="text-pulse">資産を積む。</span>
                </h1>
                <p className="mt-7 text-sm leading-8 text-slate md:text-base md:leading-9">
                  {pipeline.summary}
                </p>
                {/* 本数は他社と最も差が出るところなので、要約の直後に置く */}
                <p className="mt-7 flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-2xl border border-gold/25 bg-gold-tint px-6 py-4">
                  <span className="text-sm font-bold text-ink">1サイトあたり</span>
                  <span className="num text-3xl font-black leading-none text-gold md:text-4xl">
                    月60
                  </span>
                  {/* 金の淡い面に金の小さい文字は 4.35:1 で基準を割るため、単位は黒に置く */}
                  <span className="text-sm font-bold text-ink">本</span>
                  <span className="text-xs text-slate">
                    毎日2本。外注なら月180〜300万円ぶんの本数です
                  </span>
                </p>
              </Reveal>
              <Reveal delay={0.12}>
                <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                  <Link
                    href="/contact"
                  className="rounded-full bg-pulse px-10 py-4 text-center text-sm font-bold text-white shadow-glow transition-transform hover:-translate-y-0.5"
                  >
                    無料で試算を出してもらう
                  </Link>
                  <Link
                    href="/blog"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-line-strong px-8 py-4 text-sm font-bold text-ink transition-colors hover:border-pulse hover:text-pulse"
                  >
                    動いているメディアを見る
                  </Link>
                </div>
                {/* 申し込みの手前で引っかかる点を、ボタンのすぐ下で外す */}
                <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                  {assurance.map((a) => (
                    <li key={a} className="flex items-center gap-1.5 text-xs font-bold text-slate">
                      <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden className="shrink-0 text-pulse">
                        <path d="M2.5 7.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {a}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {/* ヒーローの絵は画面写真ではなく、毎日エージェントが踏む工程そのもの。
                この製品の価値は画面ではなく「止まらずに回ること」なので、それを見せる */}
            <Reveal delay={0.1}>
              <div className="overflow-hidden rounded-3xl bg-ink shadow-lift">
                <div className="flex items-center gap-2 border-b border-white/10 px-6 py-4">
                  <span aria-hidden className="h-2 w-2 rounded-full bg-aqua" />
                  <p className="font-data text-[0.62rem] uppercase tracking-[0.22em] text-aqua">
                    Agent — 毎日 自動実行
                  </p>
                </div>
                <ol className="divide-y divide-white/8 px-6 py-2">
                  {flow.map((f) => (
                    <li key={f.step} className="flex items-center gap-4 py-3.5">
                      <span aria-hidden className="num text-[0.7rem] font-bold text-white/30">
                        {f.step}
                      </span>
                      <span className="min-w-0 flex-1 text-[0.82rem] font-medium leading-snug text-paper/90">
                        {f.title}
                      </span>
                      <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden className="shrink-0 text-aqua">
                        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.45" />
                        <path d="M5 8.2l2.1 2.1L11 6.4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </li>
                  ))}
                </ol>
                <p className="border-t border-white/10 px-6 py-4 text-[0.7rem] leading-6 text-paper/50">
                  人が触るのは、テーマの追加と月次の確認だけです。
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 課題 */}
      <section className="border-y border-line bg-mist py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            en="Problem"
            title="広告は、止めた月から消える。記事は、残る。"
            lead="広告費は毎月ゼロから買い直しますが、記事は==一度書けば資産として残り続けます==。1本ずつ積み上がるほど、問い合わせが広告予算に左右されなくなります。ただし、積み上がる前に更新が止まれば、資産にはなりません。"
          />
          <ul className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-2">
            {problems.map((p, i) => (
              <Reveal key={p} delay={i * 0.05}>
                <li className="flex h-full items-start gap-4 bg-white px-7 py-6 text-sm leading-8 text-ink-soft">
                  <span aria-hidden className="num shrink-0 text-xs font-bold text-gold/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {p}
                </li>
              </Reveal>
            ))}
            {/* 5件を2列に並べると1セル余り、下地のグレーが矩形で見える。白で埋める */}
            <li aria-hidden className="hidden bg-white md:block" />
          </ul>
        </div>
      </section>

      {/* 紹介動画。課題に共感した直後が、10分の説明を見てもらえる位置。
          動画本体はAI集客ラボ側で配信している（このリポジトリに大きなファイルを持たない） */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-5">
          <SectionHead
            en="Movie"
            title="10分で分かる、AIで集客する仕組み"
            lead="なぜ今AI検索なのか。実際の画面で、記事ができて公開されるまでをご覧いただけます。==人が決めることと、機械に任せることの分担==まで説明しています。"
          />
          <Reveal>
            <video
              controls
              preload="none"
              poster="https://ai.7senses.co.jp/videos/aio-pr-poster.jpg"
              className="mt-10 w-full rounded-3xl border border-line shadow-xl"
            >
              <source src="https://ai.7senses.co.jp/videos/aio-pr.mp4" type="video/mp4" />
              お使いのブラウザでは動画を再生できません。
            </video>
          </Reveal>
          <div className="mt-8 text-center">
            <Link
              href="/contact"
              className="inline-block rounded-full bg-navy px-8 py-4 text-sm font-bold text-white transition hover:opacity-90"
            >
              動画の内容で相談してみる →
            </Link>
            <p className="mt-3 text-xs text-ink-soft">営業のお電話はいたしません。</p>
          </div>
        </div>
      </section>


      {/* サービス資料。料金スライドは掲載しない約束（画像側で除外・塗り消し済み）。
          画像はAI集客ラボ側で配信しているものを参照する */}
      <section className="border-y border-line bg-mist py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-5">
          <SectionHead
            en="Document"
            title="サービス資料"
            lead="ご提案時にお渡ししている資料です。サービスの全体像から==品質を守る仕組み==まで、この場でご覧いただけます。横にスクロールしてページをめくれます。"
          />
          <div className="mt-10">
            <p className="mb-3 text-center text-sm font-bold">資料の説明動画（6分19秒）</p>
            <video
              controls
              preload="none"
              poster="https://ai.7senses.co.jp/videos/doc-guide-poster.jpg"
              className="w-full rounded-2xl border border-line shadow-lg"
            >
              <source src="https://ai.7senses.co.jp/videos/doc-guide.mp4" type="video/mp4" />
              お使いのブラウザでは動画を再生できません。
            </video>
          </div>
          <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
            {Array.from({ length: 15 }, (_, i) => {
              const n = String(i + 1).padStart(2, "0");
              return (
                <img
                  key={n}
                  src={`https://ai.7senses.co.jp/images/proposal/p${n}.jpg`}
                  alt={`サービス資料 ${i + 1}ページ目`}
                  width={1600}
                  height={1131}
                  loading={i < 2 ? "eager" : "lazy"}
                  className="w-[86%] max-w-[720px] shrink-0 snap-center rounded-2xl border border-line shadow-lg"
                />
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/contact"
              className="inline-block rounded-full bg-navy px-8 py-4 text-sm font-bold text-white transition hover:opacity-90"
            >
              この内容で相談してみる →
            </Link>
            <p className="mt-3 text-xs text-ink-soft">料金は御社の状況に合わせてお見積りします。</p>
          </div>
        </div>
      </section>

      {/* 納品物 */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            en="What you get"
            title="LP と AIエージェントを、セットで納品します"
            lead="器だけ作っても記事が出ません。エージェントだけ渡しても置き場所がありません。==両方そろって初めて回ります==。"
          />
          {/* 実物を先に見せてから、含まれるものを列挙する */}
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {evidence.map((e, i) => (
              <Reveal key={e.title} delay={i * 0.08}>
                <Link
                  href={e.href}
                  className="group block h-full overflow-hidden rounded-3xl border border-line bg-white shadow-card transition-colors hover:border-pulse/40"
                >
                  <Image
                    src={e.image}
                    alt={e.alt}
                    width={1600}
                    height={1000}
                    sizes="(max-width: 1024px) 100vw, 620px"
                    className="h-auto w-full border-b border-line"
                  />
                  <div className="p-7 md:p-8">
                    <h3 className="text-lg font-bold leading-snug group-hover:text-pulse">{e.title}</h3>
                    <p className="mt-3 text-sm leading-8 text-slate">{e.body}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-pulse">
                      実物を見る
                      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className="transition-transform group-hover:translate-x-1">
                        <path d="M2 7h9M8 3.5L11.5 7 8 10.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {includes.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.05}>
                <div className="h-full rounded-2xl border-l-2 border-pulse bg-white py-5 pl-6 pr-5 shadow-card">
                  <h3 className="text-sm font-bold md:text-base">{c.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 外注との比較。費用の考え方が変わることを1枚で示す */}
      <section className="border-y border-line bg-mist py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            en="Before / After"
            title="記事を外注する場合と、何が変わるのか"
            lead="1本あたりで払うか、仕組みごと持つか。==本数を増やすほど差が開きます==。"
          />
          <Reveal delay={0.08}>
            <div className="mt-10 overflow-hidden rounded-3xl border border-line bg-white shadow-card">
              <div className="grid grid-cols-[1fr_1fr] gap-px bg-line md:grid-cols-[minmax(0,0.8fr)_1fr_1fr]">
                <div className="hidden bg-ink px-6 py-4 md:block" />
                <div className="bg-ink px-6 py-4">
                  <p className="text-xs font-bold text-paper/60">記事を外注する場合</p>
                </div>
                <div className="bg-pulse px-6 py-4">
                  <p className="text-xs font-bold text-white">AIO（SEO）対策エージェント</p>
                </div>
                {compare.map((c) => (
                  <div key={c.point} className="contents">
                    <div className="col-span-2 bg-mist px-6 py-3 md:col-span-1 md:bg-white md:py-5">
                      <p className="text-xs font-bold text-ink md:text-sm">{c.point}</p>
                    </div>
                    <div className="bg-white px-6 py-4 md:py-5">
                      <p className="text-xs leading-6 text-slate md:text-sm md:leading-7">{c.outsource}</p>
                    </div>
                    <div className="bg-white px-6 py-4 md:py-5">
                      <p className="text-xs font-medium leading-6 text-ink md:text-sm md:leading-7">{c.ours}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <MidCta
        title="いま記事にいくら払っているか、教えてください。"
        body="外注している本数と単価を伺えば、この仕組みに切り替えた場合の試算をお出しします。数字を見てから判断いただけます。"
        label="無料で試算を出してもらう"
        sub="所要30分・オンライン"
      />

      {/* 毎日動く工程 */}
      <section className="border-y border-line bg-mist py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            en="Pipeline"
            title="毎日、この順番で動いています"
            lead="当社の管制塔が実際に走らせている工程です。人が触るのは、==テーマの追加と月次の確認だけ==です。"
          />
          {/* 工程が順に流れることが伝わるよう、縦線で繋いだ時系列にする */}
          <ol className="relative mt-10 grid gap-0 pl-10 md:pl-14">
            <span
              aria-hidden
              className="absolute inset-y-3 left-[0.9rem] w-px bg-gradient-to-b from-pulse via-pulse/30 to-transparent md:left-[1.4rem]"
            />
            {flow.map((f, i) => (
              <Reveal key={f.step} delay={i * 0.04}>
                <li className="relative pb-8 last:pb-0">
                  <span
                    aria-hidden
                    className="absolute -left-10 top-1 grid h-[1.8rem] w-[1.8rem] place-items-center rounded-full border border-line bg-white md:-left-14"
                  >
                    <span className="num text-[0.62rem] font-bold text-pulse">{f.step}</span>
                  </span>
                  <h3 className="text-base font-bold md:text-lg">{f.title}</h3>
                  <p className="mt-2.5 max-w-3xl text-sm leading-8 text-slate">{f.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 品質ゲート */}
      {/* 白・薄灰・紺の3面だけだと縦のリズムが単調になるため、
          品質ゲートだけ金の淡い面にして節目だと分かるようにする */}
      <section className="border-y border-gold/20 bg-gold-tint py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            en="Quality gate"
            title="「AIで量産」と分けているのは、ここです"
            lead="==出す前に落とす仕組み==があるかどうかで、メディアの寿命が変わります。"
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {gate.map((g, i) => (
              <Reveal key={g.title} delay={i * 0.08}>
                <div className="h-full rounded-3xl border border-line bg-white p-8 shadow-card">
                  <span aria-hidden className="num text-5xl font-bold text-gold/35">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-lg font-bold leading-snug">{g.title}</h3>
                  <p className="mt-4 text-sm leading-8 text-slate">{g.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* AIO */}
      <section className="border-y border-line bg-ink py-16 text-paper md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal>
            <p className="eyebrow !text-aqua">AI Optimization</p>
            <h2 className="mt-4 text-2xl font-black leading-snug md:text-4xl">
              検索結果だけでなく、AIの回答に載るために
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-8 text-paper/70 md:text-base">
              当社はAIO運用代行を事業として提供しています。そこで使っている実装が、そのまま記事に入ります。
            </p>
          </Reveal>
          <ul className="mt-10 grid gap-3 md:grid-cols-2">
            {aio.map((a, i) => (
              <Reveal key={a} delay={i * 0.05}>
                <li className="flex gap-4 rounded-2xl border border-white/12 bg-white/[0.04] px-6 py-5 text-sm leading-7 text-paper/85">
                  <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-aqua" />
                  {a}
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 月次コンサルレポート。出し続けるだけでなく、翌月の打ち手まで渡す */}
      <section className="border-y border-line bg-mist py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            en="Monthly report"
            title="毎月1日、次の一手まで書いて渡します"
            lead="記事を出して終わりにしません。どこで離脱しているか、どの記事があと一歩か、来月どのキーワードを書くか。==判断できる形にして毎月お渡しします==。"
          />
          <ol className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-2 xl:grid-cols-4">
            {report.map((r, i) => (
              <Reveal key={r.no} delay={(i % 4) * 0.05}>
                <li className="flex h-full flex-col bg-white p-7">
                  <span aria-hidden className="num text-[0.7rem] font-bold text-pulse">{r.no}</span>
                  <h3 className="mt-2.5 text-sm font-bold leading-snug md:text-base">{r.title}</h3>
                  <p className="mt-3 flex-1 text-xs leading-7 text-slate">{r.body}</p>
                </li>
              </Reveal>
            ))}
            {/* 7件は2列でも4列でも1セル余る。下地のグレーが矩形で出ないよう白で埋める */}
            <li aria-hidden className="hidden bg-white md:block" />
          </ol>
          <p className="mt-6 text-xs leading-7 text-slate">{reportNote}</p>
        </div>
      </section>

      {/* 流れ */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead en="Steps" title="導入の流れ" lead="最初に決めるのは==「何を書かないか」==です。ここが曖昧だと記事が散らかります。" />
          <div className="mt-10">
            <FlowSteps steps={steps} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-y border-line bg-mist py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-5">
          <SectionHead en="FAQ" title="よくある質問" />
          <div className="mt-10">
            <FaqList items={faq} />
          </div>
        </div>
      </section>

      {/* CTA。何をしてもらえるかを出してから申し込ませる */}
      <section id="lp-end-cta" className="relative overflow-hidden bg-ink py-20 text-paper md:py-28">
        <div aria-hidden className="grid-field-dark absolute inset-0" />
        <div className="relative mx-auto max-w-3xl px-5">
          <Reveal>
            <p className="eyebrow !text-aqua text-center">Contact</p>
            <h2 className="mt-4 text-center text-2xl font-black leading-snug md:text-4xl">
              この記事も、この仕組みが書いています。
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-center text-sm leading-8 text-paper/70 md:text-base">
              30分のオンライン相談で、次のことをその場でお答えします。売り込みはしません。
            </p>
            <ul className="mx-auto mt-9 grid max-w-2xl gap-3">
              {offer.map((o) => (
                <li key={o} className="flex gap-3.5 rounded-2xl border border-white/12 bg-white/[0.04] px-6 py-4 text-sm leading-7 text-paper/85">
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className="mt-1.5 shrink-0 text-aqua">
                    <path d="M2.5 7.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {o}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
              <Link
                href="/contact"
                  className="rounded-full bg-gold-bright px-12 py-4 text-base font-bold text-ink transition-transform hover:-translate-y-0.5"
              >
                無料で試算を出してもらう
              </Link>
              <Link
                href="/blog"
                className="rounded-full border border-paper/30 px-10 py-4 text-sm font-bold text-paper transition-colors hover:border-paper"
              >
                動いているメディアを見る
              </Link>
            </div>
            <p className="mt-5 text-center text-[0.72rem] text-paper/50">
              相談は無料 ／ 既存サイトへの追加も可能 ／ いただいた情報は相談対応の目的以外に使用しません
            </p>
          </Reveal>
        </div>
      </section>

      <StickyCta label="無料相談" note="相談は無料・売り込みはしません" />
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BusinessMap from "@/components/BusinessMap";
import NumberWall from "@/components/NumberWall";
import SelfCheckBand from "@/components/SelfCheckBand";
import DevPartnerBand from "@/components/DevPartnerBand";
import JsonLd from "@/components/JsonLd";
import { StorySection, FlowSteps, FaqList, CtaBand, Rich, BtnArrow } from "@/components/ui";
import StoryNav from "@/components/StoryNav";
import { services, areas } from "@/lib/services";
import { news } from "@/lib/news";
import { cases } from "@/lib/cases";
import { faqSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  // og:url が無く、共有・監査でトップのURLが分からなかった（Ahrefs 2026-09-29: OGP不完全）。
  // openGraph は浅くマージされるので、layout.tsx の値を持ち越したうえで url だけ足す
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: site.name,
    url: site.url,
    images: [{ url: "/ogp.png", width: 1200, height: 630 }],
  },
};

const TOP_FAQ = [
  {
    q: "大阪以外の企業でも依頼できますか?",
    a: "可能です。打ち合わせはオンラインで完結できるため、全国の企業・店舗をご支援しています。",
  },
  {
    q: "相談は本当に無料ですか?",
    a: "初回相談・現状診断は無料です。診断の結果、当社のサービスが不要と判断した場合は正直にそうお伝えします。",
  },
  {
    q: "AIO対策とは何ですか?",
    a: "AIO(AI最適化)とは、ChatGPTやAI Overviewsなど生成AIの回答に自社の情報が引用・推薦されるよう最適化する、SEO・MEOに続く新しい検索対策です。当社は構造化データの実装から引用されるコンテンツ設計、AI検索での言及モニタリングまでを一貫して提供しています。",
  },
  {
    q: "どのサービスから始めればよいか分かりません。",
    a: "無料相談で現状を伺い、費用対効果の高い順に優先度をつけてご提案します。すべてを一度に始める必要はありません。",
  },
  {
    q: "費用はどのくらいかかりますか?",
    a: "サービスと規模により異なります。AI導入補助金など、負担を抑える制度の活用もあわせてご提案します。",
  },
];

const COMPARE_ROWS: { label: string; seo: string; meo: string; aio: string }[] = [
  { label: "対策する場所", seo: "検索結果ページ", meo: "Googleマップ", aio: "AIの回答文" },
  { label: "ユーザーの行動", seo: "検索して比較する", meo: "近くの店舗を探す", aio: "AIに直接質問する" },
  { label: "目指す状態", seo: "検索上位に表示", meo: "地図上位で来店獲得", aio: "AIに引用・推薦される" },
  { label: "評価の軸", seo: "被リンク・コンテンツ品質", meo: "口コミ・情報の充実度", aio: "一次情報・構造化・実在性" },
  { label: "当社の対応", seo: "HP制作・メディア運用", meo: "運用代行(通算3,200店舗)", aio: "AIO運用代行" },
];

// 支援している業種。ここに無い業種も全国対応
const INDUSTRIES = [
  "歯科医院", "クリニック", "整骨院・接骨院", "介護", "不動産", "工務店・注文住宅", "リフォーム", "建設",
  "士業", "コンサル", "BtoB・SaaS", "IT企業", "製造業", "卸売業", "物流", "飲食店", "美容室", "小売",
  "ホテル・旅館", "フィットネス", "教室・スクール", "EC",
];

// このページの話の順番。読者が「困りごと → 原因 → やり方 → 根拠 → 料金と流れ → 相談」と進む
const STORY = [
  { id: "problems", label: "困りごと" },
  { id: "causes", label: "止まる理由" },
  { id: "services", label: "当社のやり方" },
  { id: "numbers", label: "根拠" },
  { id: "process", label: "料金と流れ" },
  { id: "selfcheck", label: "相談" },
];

// 止まる理由。各事業のページ・トップに書いてある文から引く（新しい主張は足さない）
const CAUSES: { area: string; title: string; body: string; slug: string }[] = [
  {
    area: "集客",
    title: "探す場所が、検索・地図・AIの3つに分かれた",
    body: "ユーザーはGoogleで調べる前に、ChatGPTに聞き始めています。来店型なら「近くの◯◯」をGoogleマップで探します。==どこで探されているかによって、効く対策が違います==。",
    slug: "aio",
  },
  {
    area: "経理・社内業務",
    title: "1人で回している間は、問題が見えない",
    body: "求人を出しても応募が来ない、採れても引き継ぎで止まる、そもそも1人分の仕事量ではない。1人しかいない状態では、==その人が休んだ月に締めが止まり==、経営判断が丸ごと後ろにずれます。",
    slug: "keiri-bpo",
  },
  {
    area: "補助金",
    title: "制度が複雑で、使う前に諦めてしまう",
    body: "補助金を使いたいが、公募要領が難解で読む気になれない。本業が忙しく、申請の段取りを考える時間がない。==受発注ソフト・会計ソフトを対象とする枠なら、補助上限は350万円==です。",
    slug: "ai-subsidy",
  },
];

// 当社のやり方。トップ・FAQ・事業の説明にある約束を3つに束ねる
const PRINCIPLES: { title: string; body: string }[] = [
  {
    title: "いきなり契約から始めません",
    body: "まず現状を診断し、==効果の見込みを数字で確認==してから進めます。診断の結果、当社のサービスが不要と判断した場合は正直にそうお伝えします。",
  },
  {
    title: "数字で設計し、数字で報告します",
    body: "私たちは「頑張ります」とは言いません。支援実績・継続率・改善率——すべての仕事を数字で設計し、月次レポートで成果を可視化して改善を積み重ねます。",
  },
  {
    title: "窓口は、ひとつのチームです",
    body: `集客・経理と社内業務・補助金の3つの領域に、${services.length}つの事業があります。どれを選んでも、窓口はひとつのチームです。すべてを一度に始める必要はありません。`,
  },
];

export default function Home() {
  const priced = services.filter((s) => s.price);
  return (
    <>
      <JsonLd data={faqSchema(TOP_FAQ)} />

      {/* 最初の画面。左に約束と相談の入口、右に「よくある困りごと → 引き受ける事業」の帳簿。
          以前の全画面の街の動画（約4MB）とその上の白抜きの見出しをやめ、何をしてくれる会社かを最初に読ませる。
          動きはこの画面の1回だけ: 見出しが行ごとに現れ、帳簿の罫が引かれ、行が順に置かれる */}
      <section className="pt-16 md:pt-[72px]">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 pb-16 pt-12 md:px-8 md:pb-20 md:pt-20 lg:min-h-[calc(100svh-121px)] lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-16">
          <div className="lg:col-span-6 xl:col-span-7">
            {/* 「集客も経理も回す。」が最長。320px でも1行に収まる大きさを画面幅から決める */}
            <h1 className="text-[9.4vw] font-bold leading-[1.18] tracking-[-0.01em] sm:text-[3.4rem] lg:text-[3.75rem] xl:text-[4.75rem]">
              <span className="line-mask">
                <span>人を増やさずに、</span>
              </span>
              <span className="line-mask">
                <span style={{ "--d": "90ms" } as React.CSSProperties}>集客も経理も回す。</span>
              </span>
            </h1>
            <p className="enter mt-7 max-w-[32em] text-base leading-[1.95] text-slate md:mt-8 md:text-lg" style={{ "--d": "260ms" } as React.CSSProperties}>
              集客・社内業務・補助金までをひとつのチームで引き受ける、大阪のAIコンサルティング会社です。
            </p>
            <div className="enter mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-7" style={{ "--d": "330ms" } as React.CSSProperties}>
              <Link href="/contact" className="btn btn-primary min-h-14 px-7 text-base">
                無料相談を予約する
                <BtnArrow />
              </Link>
              <Link href="/#selfcheck" className="link-u inline-flex min-h-11 items-center self-start text-[15px] sm:self-auto">
                まず無料のセルフチェック
              </Link>
            </div>
            <span aria-hidden className="ledger-rule mt-12 max-w-xl text-ink" style={{ "--d": "380ms" } as React.CSSProperties} />
            <dl className="grid max-w-xl grid-cols-3">
              {[
                { n: "3,200", unit: "店舗", label: ["MEO運用の", "通算支援"] },
                { n: "350", unit: "万円", label: ["補助上限", "（インボイス枠）"] },
                { n: String(services.length), unit: "事業", label: ["一気通貫で", "支援"] },
              ].map((s, i) => (
                <div
                  key={s.unit}
                  className={`enter flex flex-col pt-4 ${i ? "border-l border-line pl-4" : "pr-4"}`}
                  style={{ "--d": `${440 + i * 60}ms` } as React.CSSProperties}
                >
                  {/* スマホの3列では語の途中で折れていた（「通算支/援」）。折れる位置を決めておく */}
                  <dt className="order-last mt-2 text-[13px] leading-5 text-slate">
                    {s.label.map((l) => (
                      <span key={l} className="inline-block">{l}</span>
                    ))}
                  </dt>
                  <dd className="num whitespace-nowrap text-[1.5rem] font-bold leading-none sm:text-[1.75rem] md:text-[2.125rem]">
                    {s.n}
                    <span className="ml-0.5 text-sm">{s.unit}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* 引き受ける仕事の帳簿。困りごと（各事業の challenges の先頭）から効く事業へ */}
          <div className="lg:col-span-6 xl:col-span-5">
            <p className="enter text-sm font-bold text-ink" style={{ "--d": "200ms" } as React.CSSProperties}>
              よくある困りごとと、引き受ける事業
            </p>
            <span aria-hidden className="ledger-rule mt-3 text-ink" style={{ "--d": "260ms" } as React.CSSProperties} />
            <table className="w-full border-collapse text-left [word-break:auto-phrase]">
              <caption className="sr-only">よくある困りごとと、引き受ける事業</caption>
              <thead>
                <tr className="ledger-row border-b border-ink text-[13px] text-slate" style={{ "--d": "320ms" } as React.CSSProperties}>
                  <th scope="col" className="py-2 pr-3 font-bold">困りごと</th>
                  <th scope="col" className="w-[38%] py-2 pl-3 font-bold">引き受ける事業</th>
                </tr>
              </thead>
              <tbody className="rule-close">
                {services.map((s, i) => (
                  <tr
                    key={s.slug}
                    className="ledger-row border-b border-line align-top last:border-b-0"
                    style={{ "--d": `${380 + i * 55}ms` } as React.CSSProperties}
                  >
                    <td className="py-3.5 pr-3 text-[14px] leading-[1.7] text-ink">{s.challenges[0]}</td>
                    <td className="py-3.5 pl-3 text-[14px] leading-[1.7]">
                      <Link href={`/services/${s.slug}`} className="link-u">
                        {s.name}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* このページの順番。本当に順番がある話なので番号を付ける。ヘッダーの下に止まり、読んでいる段を示す */}
      <StoryNav items={STORY} />

      {/* 1. 困りごと */}
      <StorySection
        id="problems"
        title="こんな状態が、続いていませんか"
        lead={`集客・経理と社内業務・補助金の3つの領域に、${services.length}つの事業があります。==困りごとから、効く事業を選べます==。`}
      >
        <BusinessMap />
        <p className="mt-8 text-sm leading-7 text-slate">
          <span className="font-bold text-ink">支援している業種:</span> {INDUSTRIES.join("・")}。ここに無い業種も全国対応です。
        </p>
      </StorySection>

      {/* 2. 止まる理由 */}
      <StorySection
        id="causes"
        tone="mist"
        title="止まる理由は、領域ごとに違う"
        lead="同じ「人が足りない」でも、集客・経理・補助金では止まる場所が違います。だから打ち手も分けて考えます。"
      >
        <ol className="border-b border-line-strong">
          {CAUSES.map((c) => (
            <li key={c.area} className="grid gap-3 border-t border-line-strong py-7 md:grid-cols-[9rem_1fr] md:gap-8">
              <p className="text-sm font-bold text-gold-deep">{c.area}</p>
              <div>
                <h3 className="text-xl font-bold leading-snug md:text-[1.375rem]">{c.title}</h3>
                <p className="mt-3 max-w-[40em] text-[15px] leading-[1.9] text-slate">
                  <Rich text={c.body} />
                </p>
                <Link href={`/services/${c.slug}`} className="link-u mt-3 inline-flex min-h-11 items-center text-sm">
                  {services.find((s) => s.slug === c.slug)?.name}のページを見る
                </Link>
              </div>
            </li>
          ))}
        </ol>

        {/* 集客の「探す場所」の違い */}
        <div className="mt-12">
          <h3 className="text-lg font-bold">検索・地図・AIで、対策はこう違う</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse bg-paper text-sm">
              <caption className="sr-only">SEO・MEO・AIOの比較表</caption>
              <thead>
                <tr className="border-y border-ink">
                  <th scope="col" className="w-36 p-4 text-left text-[13px] font-bold text-slate">比較項目</th>
                  <th scope="col" className="p-4 text-left">
                    <span className="font-data text-base font-bold">SEO</span>
                    <span className="block text-[13px] font-normal text-slate">従来の検索対策</span>
                  </th>
                  <th scope="col" className="p-4 text-left">
                    <span className="font-data text-base font-bold">MEO</span>
                    <span className="block text-[13px] font-normal text-slate">地図検索対策</span>
                  </th>
                  <th scope="col" className="border-x border-pulse/30 bg-pulse/5 p-4 text-left">
                    <span className="font-data text-base font-bold text-pulse">AIO</span>
                    <span className="block text-[13px] font-normal text-slate">AI検索対策</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-line">
                    <th scope="row" className="p-4 text-left text-[13px] font-bold text-slate">{row.label}</th>
                    <td className="p-4 text-slate">{row.seo}</td>
                    <td className="p-4 text-slate">{row.meo}</td>
                    <td className="border-x border-pulse/30 bg-pulse/5 p-4 font-bold text-ink">{row.aio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <Link href="/services/aio" className="link-u inline-flex min-h-11 items-center">AIO運用代行を見る</Link>
            <Link href="/services/meo" className="link-u inline-flex min-h-11 items-center">MEO運用代行を見る</Link>
            <a href={site.labUrl} target="_blank" rel="noopener" className="link-u inline-flex min-h-11 items-center">AI集客ラボ（運営メディア）↗</a>
          </p>
        </div>
      </StorySection>

      {/* 3. 当社のやり方 */}
      <StorySection
        id="services"
        title="数字で設計し、数字で報告する"
        lead="現場で積み上げた実践データを、誰でも再現できる仕組みへ。それがセブンセンシズの仕事です。"
        side={
          <Link href="/services" className="link-u inline-flex min-h-11 items-center text-sm">
            事業内容の一覧を見る
          </Link>
        }
      >
        <ul className="grid gap-8 md:grid-cols-3 md:gap-6">
          {PRINCIPLES.map((p) => (
            <li key={p.title} className="border-t-2 border-pulse pt-4">
              <h3 className="text-lg font-bold leading-snug">{p.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.85] text-slate">
                <Rich text={p.body} />
              </p>
            </li>
          ))}
        </ul>

        <h3 className="mt-16 text-lg font-bold">{services.length}つの事業</h3>
        <div className="mt-4 border-b border-line">
          {areas.map((a) => (
            <div key={a.group} className="grid gap-2 border-t border-ink py-5 md:grid-cols-[10rem_1fr] md:gap-6">
              <p className="text-sm font-bold">
                {a.name}
                <span className="block text-[13px] font-normal text-slate">{a.purpose}</span>
              </p>
              <ul>
                {services
                  .filter((s) => s.group === a.group)
                  .map((s) => (
                    <li key={s.slug} className="border-b border-line last:border-b-0">
                      <Link href={`/services/${s.slug}`} className="group grid gap-1 py-4 first:pt-0 md:grid-cols-[13rem_1fr] md:gap-6">
                        <span className="font-bold text-pulse underline decoration-1 underline-offset-[0.35em] group-hover:decoration-2">{s.name}</span>
                        <span className="text-[15px] leading-[1.8] text-slate">{s.short}</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </StorySection>

      {/* 開発・事業づくりの相談は、当社の顧問 YW のサイト（CONFLUX PARTNERS）へ */}
      <DevPartnerBand />

      {/* 4. 根拠 */}
      <StorySection
        id="numbers"
        title="成果は、数字で語る"
        lead="2019年から積み上げてきたMEO運用の現場データ。どの業種で、どんな施策が、どれだけ順位を動かすか——==この蓄積が全事業の土台==です。"
      >
        <NumberWall />

        <div id="cases" className="mt-16 scroll-mt-24">
          <h3 className="text-lg font-bold">数字が動いた、3つの現場</h3>
          <p className="mt-2 text-[15px] leading-[1.85] text-slate">
            規模も業種も違う3社。共通しているのは、施策を数字で設計し、数字で報告したことです。
          </p>
          <div className="mt-6 border-b border-line">
            {cases.map((cs) => (
              <article key={cs.industry} className="grid gap-4 border-t border-ink py-7 md:grid-cols-[11rem_1fr] md:gap-8">
                <div>
                  <p className="text-sm font-bold">{cs.industry}</p>
                  <Link href={`/services/${cs.slug}`} className="link-u mt-1 inline-flex min-h-9 items-center text-[13px]">
                    {cs.service}
                  </Link>
                </div>
                <div>
                  <h4 className="text-xl font-bold leading-snug">{cs.headline}</h4>
                  <dl className="mt-4 grid grid-cols-2 border-y border-line text-sm">
                    <div className="py-3 pr-4">
                      <dt className="text-[13px] font-bold text-slate">導入前</dt>
                      <dd className="mt-1 leading-7 text-slate">{cs.before}</dd>
                    </div>
                    <div className="border-l border-line py-3 pl-4">
                      <dt className="text-[13px] font-bold text-pulse">導入後</dt>
                      <dd className="mt-1 font-bold leading-7">{cs.after}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 leading-none">
                    <span className="num text-4xl font-bold">{cs.metric.value}</span>
                    <span className="ml-1 font-bold">{cs.metric.suffix}</span>
                    <span className="ml-3 text-[13px] text-slate">{cs.metric.label}</span>
                  </p>
                  <p className="mt-4 max-w-[40em] text-[15px] leading-[1.85] text-slate">{cs.body}</p>
                  {cs.voice && (
                    <figure className="mt-4 border-l-2 border-line-strong pl-4">
                      <blockquote className="text-sm leading-7">{cs.voice}</blockquote>
                      <figcaption className="mt-1 text-[13px] text-slate">{cs.industry} ご担当者様</figcaption>
                    </figure>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* 現場の写真（実写）と代表の言葉 */}
        <div id="field" className="mt-16 grid scroll-mt-24 gap-8 md:grid-cols-2 md:items-start">
          <figure>
            <Image
              src="/images/seminar-2.jpg"
              alt="セブンセンシズ代表によるGoogleビジネスプロフィール活用セミナーの登壇風景"
              width={700}
              height={525}
              sizes="(min-width: 768px) 40vw, 100vw"
              className="aspect-[4/3] w-full rounded-md object-cover"
            />
            <figcaption className="mt-2 text-[13px] text-slate">全国でのセミナー登壇の様子</figcaption>
          </figure>
          <div>
            <h3 className="text-xl font-bold leading-snug">机上ではなく、現場から。</h3>
            <p className="mt-3 text-[15px] leading-[1.9] text-slate">
              全国でのセミナー登壇や店舗支援の現場——通算3,200店舗と向き合ってきたのは、資料の中ではなく現場です。だから私たちの提案は、机上の空論になりません。
            </p>
            <figure className="mt-6 border-l-2 border-gold-bright pl-5">
              <blockquote className="text-base font-bold leading-8">
                「成功に必要なのは、プロの知見と、運を活かす提案。その両方を届けるのが、セブンセンシズです。」
              </blockquote>
              <figcaption className="mt-2 text-[13px] text-slate">代表取締役 {site.ceo}</figcaption>
            </figure>
            <Link href="/company" className="link-u mt-4 inline-flex min-h-11 items-center text-sm">
              代表メッセージ・会社概要を見る
            </Link>
          </div>
        </div>
      </StorySection>

      {/* 5. 料金と流れ */}
      <StorySection
        id="process"
        tone="mist"
        title="ご相談から成果まで、4つのステップ"
        lead="どのサービスも、いきなり契約から始まることはありません。まず現状を診断し、==効果の見込みを数字で確認==してから進めます。"
      >
        <FlowSteps
          steps={[
            { title: "無料相談", body: "課題と現状をオンラインで伺います。所要30〜60分です。" },
            { title: "診断・ご提案", body: "現状分析をもとに、施策の優先度と費用対効果をご提示します。" },
            { title: "実装・構築", body: "契約後、専任チームが設計から実装までを進めます。" },
            { title: "運用・改善", body: "月次レポートで成果を可視化し、改善を積み重ねます。" },
          ]}
        />

        <h3 className="mt-14 text-lg font-bold">料金の目安</h3>
        <p className="mt-2 text-[15px] leading-[1.85] text-slate">
          サービスと規模により異なります。掲載のない事業は、無料相談で現状を伺ったうえでご案内します。
        </p>
        <table className="mt-4 w-full border-collapse text-left text-sm">
          <caption className="sr-only">事業ごとの料金の目安</caption>
          <tbody className="border-y border-ink">
            {priced.map((s) => (
              <tr key={s.slug} className="border-b border-line-strong last:border-b-0">
                <th scope="row" className="w-[42%] py-4 pr-4 align-top font-bold">
                  <Link href={`/services/${s.slug}`} className="link-u">{s.name}</Link>
                </th>
                <td className="py-4 leading-7 text-slate">{s.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* お金の話。金の淡い面で区切る */}
        <div id="subsidy" className="mt-14 grid scroll-mt-24 gap-6 rounded-md border border-gold/30 bg-gold-tint p-6 md:grid-cols-[1fr_auto] md:items-end md:p-8" aria-labelledby="subsidy-heading">
          <div>
            <p className="text-sm font-bold text-gold-deep">AI導入補助金</p>
            <h3 id="subsidy-heading" className="mt-2 text-xl font-bold leading-snug md:text-2xl">
              受発注・会計ソフトなら、最大350万円の枠が使えます
            </h3>
            <p className="mt-3 max-w-[38em] text-[15px] leading-[1.9] text-slate">
              当社はAI導入補助金のベンダーとして、申請支援から導入・実績報告までを一貫対応。「制度が複雑で諦めていた」企業こそご相談ください。8問・3分の無料診断で、活用できる制度がすぐ分かります。
            </p>
          </div>
          <div className="flex flex-col gap-2 md:items-end">
            <Link href="/services/ai-subsidy" className="btn btn-secondary">
              補助金支援の詳細を見る
            </Link>
            <a href={site.lpUrl} target="_blank" rel="noopener" className="link-u inline-flex min-h-11 items-center text-sm">
              まず無料診断で確かめる（8問・3分）↗
            </a>
          </div>
        </div>
      </StorySection>

      {/* 6. 相談。いきなり相談が重い人のために、その場で終わるセルフチェックを先に置く */}
      <SelfCheckBand />

      {/* よくある質問 */}
      <section id="faq" className="scroll-mt-32 pb-20 md:pb-32" aria-labelledby="faq-heading">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 md:px-8 lg:grid-cols-12 lg:gap-12">
          <div className="border-t border-ink pt-6 md:pt-8 lg:col-span-4">
            <h2 id="faq-heading" className="text-[1.625rem] font-bold md:text-[2.25rem]">よくあるご質問</h2>
          </div>
          <div className="lg:col-span-8 lg:pt-0">
            <FaqList items={TOP_FAQ} />
          </div>
        </div>
      </section>

      {/* お知らせ */}
      <section id="news" className="scroll-mt-32 pb-20 md:pb-32" aria-labelledby="news-heading">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 md:px-8 lg:grid-cols-12 lg:gap-12">
          <div className="border-t border-ink pt-6 md:pt-8 lg:col-span-4">
            <h2 id="news-heading" className="text-[1.625rem] font-bold md:text-[2.25rem]">お知らせ</h2>
            <Link href="/news" className="link-u mt-4 inline-flex min-h-11 items-center text-sm">
              お知らせ一覧を見る
            </Link>
          </div>
          <ul className="border-b border-line lg:col-span-8">
            {news.map((n) => (
              <li key={n.slug} className="border-t border-line">
                <Link href={`/news/${n.slug}`} className="group grid gap-1 py-4 sm:grid-cols-[7.5rem_7rem_1fr] sm:items-baseline sm:gap-4">
                  <time dateTime={n.dateISO} className="num text-[13px] text-slate">{n.date}</time>
                  <span className="text-[13px] font-bold text-pulse">{n.category}</span>
                  <span className="text-[15px] font-bold group-hover:text-pulse group-hover:underline group-hover:underline-offset-4">{n.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

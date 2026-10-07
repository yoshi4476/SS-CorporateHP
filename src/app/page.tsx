import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SplitText from "@/components/SplitText";
import HeroVideo from "@/components/HeroVideo";

// 導入事例の写真（業種の場面のイメージ）
const CASE_PHOTO: Record<string, string> = {
  士業事務所: "/images/case-shigyou.webp",
  リフォーム業: "/images/case-reform.webp",
  製造業: "/images/case-seizou.webp",
};
import SenseNetwork from "@/components/SenseNetwork";
import GrowthChart from "@/components/GrowthChart";
import BusinessShowcase from "@/components/BusinessShowcase";
import SelfCheckBand from "@/components/SelfCheckBand";
import JsonLd from "@/components/JsonLd";
import { IndustryBars, GaugeDonut, RankTable } from "@/components/charts";
import { Reveal, CountUp } from "@/components/motion";
import { SectionHead, FlowSteps, FaqList, CtaBand } from "@/components/ui";
import { services } from "@/lib/services";
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

const MEGA_STATS: { value: number; suffix: string; label: string }[] = [
  { value: 3200, suffix: "社", label: "MEO運用 通算支援実績" },
  { value: 94, suffix: "%", label: "運用サービス契約継続率" },
  { value: 1.8, suffix: "倍", label: "マップ経由アクション平均改善" },
  { value: services.length, suffix: "事業", label: "AI×マーケの事業領域" },
  { value: 30, suffix: "%〜", label: "AI導入による工数削減目安" },
  { value: 350, suffix: "万円", label: "受発注・会計ソフトの補助上限" },
];

// 帯は事業データから作る。事業を増やせばここも自動で増える。
// ヒーロー下の帯。支援している業種を並べ、最後に「その他」を添える
const INDUSTRY_MARQUEE = [
  "歯科医院", "クリニック", "整骨院・接骨院", "介護", "不動産", "工務店・注文住宅", "リフォーム", "建設",
  "士業", "コンサル", "BtoB・SaaS", "IT企業", "製造業", "卸売業", "物流", "飲食店", "美容室", "小売",
  "ホテル・旅館", "フィットネス", "教室・スクール", "EC", "その他の業種も全国対応",
];

export default function Home() {
  const latestNews = news[0];
  return (
    <>
      <JsonLd data={faqSchema(TOP_FAQ)} />

      {/* ヒーロー: 全画面の実写動画（ある街の一日）。どの業種の、どの時間にも仕組みが働いている、という筋 */}
      <section className="relative flex min-h-svh flex-col overflow-hidden bg-ink text-white">
        <HeroVideo objectPosition="60% center" />
        {/* 読みやすさの覆い: 左（見出し）・上（ヘッダー）・下（業種の帯）だけを暗くし、中央の街は見せる */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgb(8 14 26 / 0.82) 0%, rgb(8 14 26 / 0.55) 38%, rgb(8 14 26 / 0.12) 70%, rgb(8 14 26 / 0.25) 100%), linear-gradient(180deg, rgb(8 14 26 / 0.55) 0%, transparent 22%, transparent 62%, rgb(8 14 26 / 0.75) 100%)",
          }}
        />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-5 pb-80 pt-24 md:pb-24 md:pt-28">
          <div className="w-full min-w-0 max-w-3xl">
            <span aria-hidden className="block h-1.5 w-16 rounded-full bg-gradient-to-r from-pulse to-aqua md:w-20" />
            {/* 集客も社内業務も補助金も、全部「人を増やさずに回す」ための手段なので、そこを見出しに出す。
                スマホは「集客も経理も回す。」が最長で折り返せない。320px でも1行に収まる値を画面幅から逆算している */}
            <h1 className="mt-6 text-[8vw] font-black leading-[1.24] tracking-tight [text-shadow:0_2px_30px_rgb(0_0_0/0.35)] sm:text-5xl md:mt-8 md:text-[2.9rem] lg:text-[3.9rem] xl:text-[4.3rem]">
              <SplitText text="人を増やさずに、" />
              <br />
              <SplitText text="集客も経理も回す。" className="text-aqua" startIndex={8} />
            </h1>
            <div>
              <p className="mt-6 max-w-lg text-sm leading-8 text-white/80 md:mt-8 md:leading-9 md:text-[0.95rem]">
                MEO運用通算3,200店舗で積んだ現場データと、AIによる自動化。
                <br className="hidden md:block" />
                集客・社内業務・補助金までをひとつのチームで引き受ける、大阪のAIコンサルティング会社です。
              </p>
            </div>
            <div>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center md:mt-10">
                <Link
                  href="/contact"
                  className="rounded-full bg-pulse px-10 py-4 text-center text-sm font-bold text-white shadow-glow transition-transform hover:-translate-y-0.5"
                >
                  無料相談を予約する
                </Link>
                <Link
                  href="/#selfcheck"
                  className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/35 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:border-aqua hover:text-aqua"
                >
                  まず無料で現在地を測る
                  <span className="font-data text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white/60">30秒</span>
                </Link>
              </div>
              {/* 目的から選ぶ入口。主力は AI検索・集客（AIO）なので先頭に大きく置く（2026-10-04）。
                  AIから来る人の着地もAIOのページが最多だった */}
              <div className="mt-7 grid max-w-lg gap-2 text-left">
                <Link
                  href="/services/aio"
                  className="group block rounded-2xl border border-aqua/60 bg-white/10 px-5 py-4 backdrop-blur-sm transition-colors hover:border-aqua hover:bg-white/15"
                >
                  <span className="font-data text-[0.62rem] font-bold uppercase tracking-[0.16em] text-aqua">Main</span>
                  <span className="mt-1 block text-base font-black">AI検索・集客（AIO・SEO）</span>
                  <span className="mt-1 block text-xs leading-6 text-white/75">ChatGPT や Google のAIの答えに、御社が選ばれる状態をつくる →</span>
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/services/keiri-bpo" className="rounded-xl border border-white/25 px-4 py-3 text-xs font-bold text-white/90 transition-colors hover:border-aqua hover:text-aqua">
                    経理BPO（経理の外注）→
                  </Link>
                  <Link href="/services/ai-subsidy" className="rounded-xl border border-white/25 px-4 py-3 text-xs font-bold text-white/90 transition-colors hover:border-aqua hover:text-aqua">
                    AI導入補助金の申請 →
                  </Link>
                </div>
              </div>
            </div>
            <div>
              <div className="mt-9 hidden max-w-lg grid-cols-3 gap-4 border-t border-white/20 pt-5 sm:grid">
                {[
                  { n: 3200, unit: "社", label: "MEO通算支援" },
                  { n: 350, unit: "万円", label: "補助上限(インボイス枠)" },
                  { n: services.length, unit: "事業", label: "一気通貫で支援" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="num text-2xl font-bold leading-none md:text-3xl">
                      <CountUp value={s.n} duration={1.6} />
                      <span className="ml-0.5 text-sm text-aqua">{s.unit}</span>
                    </p>
                    <p className="mt-2 text-[0.68rem] text-white/65">{s.label}</p>
                  </div>
                ))}
              </div>
              <Link
                href={`/news/${latestNews.slug}`}
                className="group mt-6 flex min-h-10 max-w-full items-center gap-3 text-xs text-white/70 transition-colors hover:text-aqua"
              >
                <span className="font-data shrink-0 font-bold uppercase tracking-[0.2em] text-aqua">News</span>
                <span className="num shrink-0">{latestNews.date}</span>
                <span className="min-w-0 flex-1 truncate font-medium text-white group-hover:text-aqua sm:max-w-72 sm:flex-none">
                  {latestNews.title}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* 支援している業種の帯。ここに無い業種も全国対応 */}
        <div className="relative z-10" aria-label="対応している業種">
          <div className="overflow-hidden border-t border-white/15 bg-ink/40 py-4 backdrop-blur-md">
            <div className="flex">
              <div className="animate-marquee flex shrink-0 items-center">
                {[...INDUSTRY_MARQUEE, ...INDUSTRY_MARQUEE].map((m, i) => (
                  <span key={i} aria-hidden={i >= INDUSTRY_MARQUEE.length} className="flex shrink-0 items-center whitespace-nowrap">
                    <span className="text-[0.86rem] font-bold tracking-wide text-white">{m}</span>
                    <span aria-hidden className="mx-7 h-1 w-1 rounded-full bg-aqua/70" />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ステートメント */}
      <section id="vision" className="relative scroll-mt-24 overflow-hidden py-24 md:py-36">
        <div className="relative mx-auto max-w-7xl px-5 text-center">
          <Reveal>
            <p className="mx-auto max-w-4xl text-2xl font-black leading-[1.8] md:text-5xl md:leading-[1.7]">
              成果は、<mark className="marker">数字</mark>で語る。
              <br />
              集客は、<span className="text-pulse">AI</span>で仕組みにする。
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mx-auto mt-10 max-w-2xl text-sm leading-9 text-slate md:text-base">
              私たちは「頑張ります」とは言いません。支援実績・継続率・改善率——すべての仕事を
              <mark className="marker">数字で設計し、数字で報告</mark>
              します。現場で積み上げた実践データを、誰でも再現できる仕組みへ。それがセブンセンシズの仕事です。
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <figure className="group relative mx-auto mt-14 aspect-[16/9] max-w-6xl overflow-hidden rounded-[2rem] shadow-lift md:mt-20 md:aspect-[21/9]">
              <Image
                src="/images/scene-vision.webp"
                alt="明るいオフィスで、施策を数字で話し合うチーム"
                fill
                sizes="(min-width: 1280px) 1152px, 100vw"
                className="object-cover object-[50%_40%] transition-transform duration-[1600ms] ease-out group-hover:scale-[1.03]"
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/5 to-transparent" />
              <figcaption className="absolute bottom-5 left-6 text-left text-white md:bottom-8 md:left-10">
                <span className="mt-2 block text-base font-bold md:text-2xl">現場のデータを、仕組みに。</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* 事業: 横スクロールレール */}
      <section id="services" className="scroll-mt-24 border-y border-line bg-mist" aria-labelledby="services-heading">
        <div className="mx-auto max-w-7xl px-5 pt-20 md:pt-28">
          <div className="grid items-center gap-10 md:grid-cols-[1.2fr_1fr]">
            <SectionHead
              title={`${services.length}つの事業が、ひとつにつながる`}
              lead={`戦略(AIコンサル)・実装(開発・制作)・集客(MEO・AIO×オウンドメディア)・資金(補助金)——==${services.length}つの事業をひとつのチームで一気通貫==に支援します。`}
            />
            <Reveal delay={0.1} className="mx-auto w-full max-w-xs md:max-w-md lg:max-w-lg">
              <SenseNetwork className="animate-float h-auto w-full" />
            </Reveal>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-5 pb-20 pt-12 md:pb-28 md:pt-14">
          <BusinessShowcase />
          <Reveal delay={0.2}>
            <Link
              href="/contact"
              className="group mt-4 flex flex-col items-start justify-between gap-6 overflow-hidden rounded-2xl bg-ink p-8 text-white md:flex-row md:items-center md:p-10"
            >
              <span>
                <span className="mt-3 block text-2xl font-black leading-snug md:text-3xl">
                  どの事業が合うか、無料で診断します。
                </span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-3 rounded-full bg-gold-bright px-7 py-3.5 text-sm font-bold text-ink transition-transform group-hover:-translate-y-0.5">
                相談してみる
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                  <path d="M2 7h9M8 3.5L11.5 7 8 10.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 数字の壁 */}
      <section id="numbers" className="relative scroll-mt-24 overflow-hidden bg-ink py-24 text-white md:py-36" aria-labelledby="numbers-heading">
        <div aria-hidden className="grid-field-dark absolute inset-0" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 70% at 85% 15%, rgb(28 63 124 / 0.4), transparent 60%), radial-gradient(ellipse 40% 50% at 8% 90%, rgb(116 199 214 / 0.12), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-5">
          <Reveal>
            <p aria-hidden className="eyebrow !text-aqua" />
            <h2 id="numbers-heading" className="mt-3 text-3xl font-bold md:text-5xl">
              成果は、数字で語る。
            </h2>
          </Reveal>
          <div className="mt-16 grid grid-cols-1 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
            {MEGA_STATS.map((s, i) => (
              <Reveal key={s.label} delay={(i % 3) * 0.1}>
                {/* 縦罫と単位を金にして、紺一色の面に温度を足す */}
                <div className="border-l-2 border-gold-bright/70 pl-6">
                  <p className="mega-num text-6xl text-white md:text-7xl lg:text-8xl">
                    <CountUp value={s.value} duration={1.4 + (i % 3) * 0.3} />
                    <span className="ml-1 text-3xl text-gold-bright md:text-4xl">{s.suffix}</span>
                  </p>
                  <p className="mt-4 text-xs leading-5 text-white/60 md:text-sm">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* データセクション */}
      <section id="data" className="relative scroll-mt-24 bg-paper py-24 md:py-32" aria-labelledby="data-heading">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            title="通算3,200店舗が生んだ、実践データ"
            lead="2019年から積み上げてきたMEO運用の現場データ。どの業種で、どんな施策が、どれだけ順位を動かすか——==この蓄積が全事業の土台==です。"
          />
          <div className="mt-12 grid items-start gap-6 lg:grid-cols-[1.4fr_1fr]">
            <Reveal className="rounded-2xl border border-line bg-raise p-6 shadow-card md:p-8">
              <GrowthChart />
            </Reveal>
            <div className="grid gap-6">
              <Reveal delay={0.1} className="rounded-2xl border border-line bg-raise p-6 shadow-card md:p-8">
                <IndustryBars />
              </Reveal>
            </div>
          </div>
          <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_1.4fr]">
            <Reveal delay={0.05} className="grid grid-cols-2 gap-6 rounded-2xl border border-line bg-raise p-6 shadow-card md:p-8">
              <GaugeDonut value={94} label="契約継続率" sub="運用サービス平均" />
              <GaugeDonut value={87} label="上位3位以内 到達率" sub="主要キーワード・90日" />
            </Reveal>
            <Reveal delay={0.12}>
              <RankTable />
            </Reveal>
          </div>
          <Reveal delay={0.15} className="mt-8 text-center">
            <Link href="/services/meo" className="tap gap-2 text-sm font-bold text-pulse underline-offset-4 hover:underline">
              MEO運用代行の詳細を見る
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                <path d="M2 7h9M8 3.5L11.5 7 8 10.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 無料セルフチェック (相談の手前の入口) */}
      <SelfCheckBand />

      {/* AIO / 検索対策の権威セクション */}
      <section id="aio" className="relative scroll-mt-24 overflow-hidden border-y border-line bg-mist py-24 md:py-32" aria-labelledby="aio-heading">
        <div className="relative mx-auto max-w-7xl px-5">
          <div className="grid items-center gap-10 md:grid-cols-[1.25fr_1fr]">
            <SectionHead
              title="検索対策の「第三の時代」を、先導する"
              lead="ユーザーはGoogleで調べる前に、ChatGPTに聞き始めています。SEO・MEOに続く第三の検索対策「AIO(AI最適化)」に、==いま着手する企業が次の集客を制します==。"
            />
            <Reveal delay={0.1}>
              <figure className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lift">
                <Image src="/images/scene-aio.webp" alt="スマートフォンでAIに質問する手元" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover object-[45%_center]" />
              </figure>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="mt-12 overflow-x-auto rounded-2xl border border-line shadow-card">
            <table className="w-full min-w-[680px] border-collapse bg-raise text-sm">
              <caption className="sr-only">SEO・MEO・AIOの比較表</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="w-40 p-5 text-left text-xs font-medium text-slate">
                    比較項目
                  </th>
                  <th scope="col" className="p-5 text-left">
                    <span className="font-data text-base font-bold text-slate">SEO</span>
                    <span className="mt-1 block text-xs font-normal text-slate">従来の検索対策</span>
                  </th>
                  <th scope="col" className="p-5 text-left">
                    <span className="font-data text-base font-bold text-ink">MEO</span>
                    <span className="mt-1 block text-xs font-normal text-slate">地図検索対策</span>
                  </th>
                  <th scope="col" className="bg-pulse/5 p-5 text-left">
                    <span className="font-data text-base font-bold text-pulse">AIO</span>
                    <span className="mt-1 block text-xs font-normal text-slate">AI検索対策 — いまここ</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-line last:border-0">
                    <th scope="row" className="p-5 text-left text-xs font-medium text-slate">
                      {row.label}
                    </th>
                    <td className="p-5 text-slate">{row.seo}</td>
                    <td className="p-5">{row.meo}</td>
                    <td className="bg-pulse/5 p-5 font-medium text-ink">{row.aio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Reveal delay={0.12}>
              <Link
                href="/services/aio"
                  className="rounded-full bg-pulse px-8 py-3.5 text-sm font-bold text-white shadow-card transition-transform hover:-translate-y-0.5"
              >
                AIO運用代行を見る
              </Link>
            </Reveal>
            <Reveal delay={0.18}>
              <Link
                href="/services/meo"
                  className="rounded-full border border-ink/20 px-8 py-3.5 text-sm font-bold text-ink transition-colors hover:border-pulse hover:text-pulse"
              >
                MEO運用代行を見る
              </Link>
            </Reveal>
            <Reveal delay={0.24}>
              <a
                href={site.labUrl}
                target="_blank"
                rel="noopener"
                  className="rounded-full border border-ink/20 px-8 py-3.5 text-sm font-bold text-ink transition-colors hover:border-pulse hover:text-pulse"
              >
                AI集客ラボ (運営メディア) ↗
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 現場写真 + 代表メッセージ */}
      <section id="field" className="relative scroll-mt-24 overflow-hidden bg-ink py-24 text-white md:py-32" aria-labelledby="field-heading">
        <div aria-hidden className="grid-field-dark absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-5">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <Reveal>
                <p aria-hidden className="eyebrow !text-aqua" />
                <h2 id="field-heading" className="mt-3 text-3xl font-bold md:text-5xl">
                  机上ではなく、現場から。
                </h2>
                <p className="mt-5 max-w-xl text-sm leading-8 text-white/65 md:text-base">
                  全国でのセミナー登壇や店舗支援の現場——通算3,200店舗と向き合ってきたのは、資料の中ではなく現場です。だから私たちの提案は、机上の空論になりません。
                </p>
              </Reveal>
              <Reveal delay={0.12}>
                <figure className="mt-8 border-l-2 border-aqua pl-6">
                  <blockquote className="text-base font-bold leading-9 md:text-lg">
                    「成功に必要なのは、プロの知見と、運を活かす提案。
                    <br />
                    その両方を届けるのが、セブンセンシズです。」
                  </blockquote>
                  <figcaption className="mt-3 text-xs text-white/50">
                    代表取締役 {site.ceo}
                  </figcaption>
                </figure>
              </Reveal>
              <Reveal delay={0.2}>
                <Link
                  href="/company"
                  className="tap mt-8 gap-2 text-sm font-bold text-aqua underline-offset-4 hover:underline"
                >
                  代表メッセージ・会社概要を見る
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                    <path d="M2 7h9M8 3.5L11.5 7 8 10.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                </Link>
              </Reveal>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Reveal className="col-span-2">
                <Image
                  src="/images/seminar-2.jpg"
                  alt="セブンセンシズ代表によるGoogleビジネスプロフィール活用セミナーの登壇風景"
                  width={700}
                  height={525}
                  className="aspect-[16/10] w-full rounded-2xl object-cover shadow-lift"
                />
              </Reveal>
              <Reveal delay={0.1}>
                <Image
                  src="/images/seminar-1.jpg"
                  alt="経営者向け勉強会で店舗集客を解説する様子"
                  width={700}
                  height={525}
                  className="aspect-square w-full rounded-2xl object-cover"
                />
              </Reveal>
              <Reveal delay={0.16}>
                <Image
                  src="/images/seminar-3.jpg"
                  alt="セミナーで質疑応答に応える代表"
                  width={700}
                  height={525}
                  className="aspect-square w-full rounded-2xl object-cover"
                />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 導入事例 */}
      <section id="cases" className="scroll-mt-24 border-t border-line bg-mist py-24 md:py-32" aria-labelledby="cases-heading">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            title="数字が動いた、3つの現場"
            lead="規模も業種も違う3社。共通しているのは、==施策を数字で設計し、数字で報告した==ことです。"
          />
          <p className="mt-3 text-[0.68rem] text-slate">※ 写真はイメージです（支援先の写真ではありません）。</p>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {cases.map((cs, i) => (
              <Reveal key={cs.industry} delay={(i % 3) * 0.09}>
                <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-raise shadow-card">
                  <figure className="relative aspect-[16/9] w-full">
                    <Image src={CASE_PHOTO[cs.industry] ?? "/images/case-seizou.webp"} alt={`${cs.industry}の現場のイメージ`} fill sizes="(min-width: 1024px) 400px, 100vw" className="object-cover" />
                  </figure>
                  <div className="flex flex-1 flex-col p-7 md:p-8">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-ink px-3 py-1 text-[0.62rem] font-bold text-white">
                      {cs.industry}
                    </span>
                    <Link href={`/services/${cs.slug}`} className="inline-flex min-h-9 items-center text-[0.66rem] font-bold text-pulse hover:underline">
                      {cs.service} →
                    </Link>
                  </div>
                  <h3 className="mt-5 text-lg font-black leading-relaxed md:text-xl">{cs.headline}</h3>

                  <div className="mt-6 flex items-center gap-3 rounded-2xl border border-line bg-mist/70 p-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate">導入前</p>
                      <p className="mt-1 text-xs font-medium leading-5 text-slate">{cs.before}</p>
                    </div>
                    <svg width="22" height="14" viewBox="0 0 34 20" aria-hidden className="shrink-0 text-pulse">
                      <path d="M2 10h24M20 4l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-pulse">導入後</p>
                      <p className="mt-1 text-xs font-bold leading-5 text-ink">{cs.after}</p>
                    </div>
                  </div>

                  <p className="mt-5 leading-none">
                    <span className="num text-4xl font-bold md:text-5xl">{cs.metric.value}</span>
                    <span className="ml-1 text-base font-bold text-pulse">{cs.metric.suffix}</span>
                    <span className="mt-2 block text-[0.65rem] text-slate">{cs.metric.label}</span>
                  </p>

                  <p className="mt-5 text-xs leading-7 text-slate">{cs.body}</p>

                  {cs.voice && (
                  <figure className="mt-auto border-t border-line pt-5">
                    <blockquote className="text-xs leading-7 text-ink">
                      <span className="font-data mr-1.5 text-base font-bold text-pulse">&ldquo;</span>
                      {cs.voice}
                    </blockquote>
                    <figcaption className="mt-2.5 text-[0.62rem] text-slate">— {cs.industry} ご担当者様</figcaption>
                  </figure>
                  )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 進め方 */}
      <section id="process" className="scroll-mt-24 py-24 md:py-32" aria-labelledby="process-heading">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid items-center gap-10 md:grid-cols-[1.25fr_1fr]">
            <SectionHead
              title="ご相談から成果まで、4つのステップ"
              lead="どのサービスも、いきなり契約から始まることはありません。まず現状を診断し、==効果の見込みを数字で確認==してから進めます。"
            />
            <Reveal delay={0.1}>
              <figure className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lift">
                <Image src="/images/scene-process.webp" alt="店舗の経営者と、施策の進め方を話し合う担当者" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
              </figure>
            </Reveal>
          </div>
          <div className="mt-12">
            <FlowSteps
              steps={[
                { title: "無料相談", body: "課題と現状をオンラインで伺います。所要30〜60分です。" },
                { title: "診断・ご提案", body: "現状分析をもとに、施策の優先度と費用対効果をご提示します。" },
                { title: "実装・構築", body: "契約後、専任チームが設計から実装までを進めます。" },
                { title: "運用・改善", body: "月次レポートで成果を可視化し、改善を積み重ねます。" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* 補助金バンド */}
      <section id="subsidy" className="scroll-mt-24 pb-24 md:pb-32" aria-labelledby="subsidy-heading">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal>
            {/* 白の面が2つ続いて単調になるうえ、内容もお金の話なので、
                この帯だけ金の淡い面にして視線を止める */}
            <div className="grid items-center gap-8 overflow-hidden rounded-3xl border border-gold/25 bg-gold-tint p-8 shadow-card md:grid-cols-[1.4fr_1fr] md:p-12">
              <div>
                <p className="eyebrow">AI導入補助金</p>
                <h2 id="subsidy-heading" className="mt-3 text-2xl font-bold md:text-4xl">
                  受発注・会計ソフトなら、
                  <br className="sm:hidden" />
                  <mark className="marker">最大350万円の枠</mark>が使えます
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-8 text-slate">
                  当社はAI導入補助金のベンダーとして、申請支援から導入・実績報告までを一貫対応。受発注ソフト・会計ソフトを対象とする枠なら補助上限は350万円です。「制度が複雑で諦めていた」企業こそご相談ください。8問・3分の無料診断で、活用できる制度がすぐ分かります。
                </p>
              </div>
              <div className="flex flex-col gap-3 md:items-end">
                <figure className="relative mb-2 aspect-[16/10] w-full overflow-hidden rounded-2xl shadow-card md:max-w-sm">
                  <Image src="/images/scene-subsidy.webp" alt="経営者と担当者が、申請書類を一緒に確かめる様子" fill sizes="(min-width: 768px) 24rem, 100vw" className="object-cover" />
                </figure>
                <Link
                  href="/services/ai-subsidy"
                  className="rounded-full bg-pulse px-10 py-5 text-center text-base font-bold text-white shadow-card transition-transform hover:-translate-y-0.5"
                >
                  補助金支援の詳細を見る
                </Link>
                <a
                  href={site.lpUrl}
                  target="_blank"
                  rel="noopener"
                  className="text-center text-xs font-bold text-pulse underline-offset-4 hover:underline"
                >
                  まず無料診断で確かめる（8問・3分） ↗
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* お知らせ */}
      <section id="news" className="scroll-mt-24 border-t border-line bg-mist py-16 md:py-20" aria-labelledby="news-heading">
        <div className="mx-auto max-w-5xl px-5">
          <SectionHead title="お知らせ" />
          <div className="mt-10 grid gap-3">
            {news.map((n, i) => (
              <Reveal key={n.slug} delay={i * 0.06}>
                <Link
                  href={`/news/${n.slug}`}
                  className="group flex flex-wrap items-center gap-x-4 gap-y-1 rounded-2xl border border-line bg-raise px-6 py-5 shadow-card transition-colors hover:border-pulse/40"
                >
                  <time dateTime={n.dateISO} className="num text-xs text-slate">
                    {n.date}
                  </time>
                  <span className="rounded-full bg-pulse/10 px-3 py-0.5 text-[0.65rem] font-bold text-pulse">
                    {n.category}
                  </span>
                  <span className="flex-1 basis-full text-sm font-medium group-hover:text-pulse sm:basis-auto">
                    {n.title}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15} className="mt-8 text-center">
            <Link href="/news" className="tap gap-2 text-sm font-bold text-pulse underline-offset-4 hover:underline">
              お知らせ一覧を見る
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                <path d="M2 7h9M8 3.5L11.5 7 8 10.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 py-16 md:py-24" aria-labelledby="faq-heading">
        {/* ほかの区画と同じ幅・同じ左端。見出しを左、質問を右に並べる（中央寄せの細い列だけ浮いていた） */}
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHead title="よくあるご質問" />
          </div>
          <div>
            <FaqList items={TOP_FAQ} />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

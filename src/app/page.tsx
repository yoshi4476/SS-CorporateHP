import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SplitText from "@/components/SplitText";
import Logo3D from "@/components/Logo3D";
import WaveText from "@/components/WaveText";
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
const MARQUEE = services.map((s) => ({ ja: s.name, en: s.en }));

export default function Home() {
  const latestNews = news[0];
  return (
    <>
      <JsonLd data={faqSchema(TOP_FAQ)} />

      {/* ヒーロー */}
      <section className="relative flex min-h-svh flex-col overflow-hidden pt-16 md:pt-20">
        <div aria-hidden className="grid-field absolute inset-0" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 42% 52% at 80% 28%, rgb(28 63 124 / 0.06), transparent 62%), radial-gradient(ellipse 30% 40% at 92% 72%, rgb(116 199 214 / 0.08), transparent 60%)",
          }}
        />
        {/* 背景写真は lg 以上だけ。狭い画面で薄く敷くと、写真でも背景でもない
            ぼんやりした影にしかならないため、下でひとつの写真ブロックとして出す */}
        <div aria-hidden className="absolute inset-0 hidden overflow-hidden lg:block">
          <Image
            src="/images/hero-office.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[72%_center]"
          />
          {/* ヘッダーは背景が透明なので、写真の上端を紙色に落としてナビを読めるようにする */}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-paper via-paper/75 to-transparent" />
        </div>

        {/* 3Dロゴ (1文字ずつ波打つ)。可読性ガードより上に置く。
            .logo3d 自身が display:flex を持つため hidden が効かない。
            表示の切り替えは素の div でくるんで行う。
            狭い画面は写真ブロックが下端まで埋まるので透かしは出さない。 */}
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
          <Logo3D className="absolute bottom-14 left-6 z-[5] whitespace-nowrap text-[9vw] opacity-[0.22]" />
        </div>

        {/* 左半分の可読性ガード。背景写真を紙色に落としてコピーを読ませる。
            写真を敷くのは lg 以上だけなので、ガードも lg 以上だけでよい */}
        <div
          aria-hidden
          className="absolute inset-0 hidden lg:block"
          style={{
            background:
              "linear-gradient(to right, rgb(251 252 253) 0%, rgb(251 252 253 / 0.94) 38%, rgb(251 252 253 / 0.5) 56%, transparent 72%)",
          }}
        />

        {/* HUD実績バー (右下固定) */}
        <dl className="absolute bottom-32 right-8 z-10 hidden w-[420px] grid-cols-3 gap-2 rounded-2xl border border-line bg-raise/75 p-4 shadow-card backdrop-blur-md lg:right-14 lg:grid">
          <div className="border-r border-line pr-2">
            <dt className="font-data text-[0.55rem] uppercase tracking-[0.2em] text-slate">Total Clients</dt>
            <dd className="num mt-1 text-2xl font-bold">
              <CountUp value={3200} duration={1.6} />
              <span className="ml-0.5 text-sm text-pulse">社</span>
            </dd>
            <dd className="text-[0.6rem] text-slate">MEO通算支援</dd>
          </div>
          <div className="border-r border-line pr-2">
            <dt className="font-data text-[0.55rem] uppercase tracking-[0.2em] text-slate">Subsidy</dt>
            <dd className="num mt-1 text-2xl font-bold">
              <CountUp value={90} duration={1.8} />
              <span className="ml-0.5 text-sm text-pulse">%+</span>
            </dd>
            <dd className="text-[0.6rem] text-slate">採択率・受発注/会計350万円</dd>
          </div>
          <div>
            <dt className="font-data text-[0.55rem] uppercase tracking-[0.2em] text-slate">Domains</dt>
            <dd className="num mt-1 text-2xl font-bold">
              <CountUp value={services.length} duration={2} />
              <span className="ml-0.5 text-sm text-pulse">事業</span>
            </dd>
            <dd className="text-[0.6rem] text-slate">一気通貫で支援</dd>
          </div>
        </dl>

        {/* 文言を上寄りに置き、下に空けた余白でウォーターマークを見せる */}
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-5 pb-14 pt-8 lg:pb-56 lg:pt-16">
          {/* 左: コピー。
              min-w-0 が無いと、折り返せない見出しがflexの幅を押し広げて画面外にはみ出す。
              w-full が無いとflexアイテムが内容幅に縮み、下の写真ブロックが右に余白を残す */}
          <div className="w-full min-w-0 max-w-3xl lg:w-auto">
            <Reveal>
              <span aria-hidden className="mb-5 block h-1.5 w-16 rounded-full bg-gradient-to-r from-pulse to-aqua md:mb-6 md:w-20" />
              <p className="eyebrow">Osaka / AI Consulting &amp; Digital Marketing</p>
            </Reveal>
            {/* 「AIの『答え』にする。」は8事業のうちAIOだけの主張で、
                初見では何をしてくれる会社か分からなかった。
                集客も社内業務も補助金も、全部「人を増やさずに回す」ための手段なので、
                そこを見出しに出す。
                スマホは「集客も経理も回す。」が最長で折り返せない。
                320px でも1行に収まる値を画面幅から逆算している */}
            <h1 className="mt-6 text-[8vw] font-black leading-[1.24] tracking-tight sm:text-5xl md:mt-8 md:text-[2.9rem] lg:text-[3.9rem] xl:text-[4.3rem]">
              <SplitText text="人を増やさずに、" />
              <br />
              <SplitText text="集客も経理も回す。" className="text-pulse" startIndex={8} />
            </h1>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-lg text-sm leading-8 text-slate md:mt-9 md:leading-9 md:text-[0.95rem]">
                MEO運用<mark className="marker">通算3,200店舗</mark>で積んだ現場データと、AIによる自動化。
                <br className="hidden md:block" />
                集客・社内業務・補助金までをひとつのチームで引き受ける、大阪のAIコンサルティング会社です。
              </p>
            </Reveal>
            {/* スマホ用の写真ブロック。薄い背景として敷くのをやめ、
                実績の数字と組んだ1枚にした。数字はPCのHUDと同じもので、
                これまでスマホでは非表示になっていた */}
            <Reveal delay={0.2}>
              {/* 幅が広がるほど縦も伸びてCTAが画面外へ出るため、横長に切り替える */}
              <figure className="relative mt-7 aspect-[5/4] overflow-hidden rounded-3xl sm:aspect-[16/9] lg:hidden">
                <Image
                  src="/images/hero-office.jpg"
                  alt="打ち合わせに向かう代表"
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-[66%_center]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgb(13 20 32 / 0.92) 0%, rgb(13 20 32 / 0.35) 42%, transparent 70%)" }}
                />
                <dl className="absolute inset-x-0 bottom-0 grid grid-cols-3 gap-1 px-4 pb-4 text-white">
                  {[
                    { n: 3200, unit: "社", label: "MEO通算支援" },
                    { n: 90, unit: "%+", label: "補助金 採択率" },
                    { n: services.length, unit: "事業", label: "一気通貫で支援" },
                  ].map((s, i) => (
                    <div key={s.label} className={i < 2 ? "border-r border-white/20 pr-1" : ""}>
                      <dd className="num text-xl font-bold leading-none">
                        <CountUp value={s.n} duration={1.6} />
                        <span className="ml-0.5 text-xs text-aqua">{s.unit}</span>
                      </dd>
                      <dd className="mt-1.5 text-[0.6rem] leading-tight text-white/70">{s.label}</dd>
                    </div>
                  ))}
                </dl>
              </figure>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center md:mt-10">
                <Link
                  href="/contact"
                  className="rounded-full bg-pulse px-10 py-4 text-center text-sm font-bold text-white shadow-glow transition-transform hover:-translate-y-0.5"
                >
                  無料相談を予約する
                </Link>
                {/* 相談はまだ重い人のための、費用も登録も要らない一歩。
                    「事業内容を見る」は下に一覧が続くので置いていた意味が薄かった */}
                <Link
                  href="/#selfcheck"
                  className="group inline-flex items-center justify-center gap-2 px-2 py-3 text-sm font-bold text-ink transition-colors hover:text-pulse"
                >
                  まず無料で現在地を測る
                  <span className="font-data text-[0.65rem] font-bold uppercase tracking-[0.14em] text-slate">30秒</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className="text-pulse transition-transform group-hover:translate-y-1">
                    <path d="M7 2v9M3.5 7.5L7 11l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <Link
                href={`/news/${latestNews.slug}`}
                className="group mt-8 flex max-w-full items-center gap-3 border-t border-line pt-5 text-xs text-slate transition-colors hover:text-pulse md:mt-12"
              >
                <span className="font-data shrink-0 font-bold uppercase tracking-[0.2em] text-pulse">News</span>
                <span className="num shrink-0">{latestNews.date}</span>
                <span className="min-w-0 flex-1 truncate font-medium text-ink group-hover:text-pulse sm:flex-none sm:max-w-72">
                  {latestNews.title}
                </span>
                <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden className="shrink-0 text-pulse transition-transform group-hover:translate-x-1">
                  <path d="M2 7h9M8 3.5L11.5 7 8 10.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </Link>
            </Reveal>
          </div>

        </div>

        {/* 事業名の帯: 傾けず、日本語と英語を対で並べる */}
        <div className="relative z-10" aria-hidden>
          <div className="overflow-hidden border-y border-line bg-raise/80 py-4 backdrop-blur-sm">
            <div className="flex">
              <div className="animate-marquee flex shrink-0 items-center">
                {[...MARQUEE, ...MARQUEE].map((m, i) => (
                  <span key={i} className="flex shrink-0 items-baseline whitespace-nowrap">
                    <span className="text-[0.82rem] font-bold tracking-wide text-ink">{m.ja}</span>
                    <span className="font-data ml-3 text-[0.6rem] uppercase tracking-[0.22em] text-slate">
                      {m.en}
                    </span>
                    <span aria-hidden className="mx-8 h-3 w-px bg-line-strong" />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ステートメント */}
      <section id="vision" className="relative scroll-mt-24 overflow-hidden py-24 md:py-36">
        <WaveText text="VISION" className="pointer-events-none absolute left-0 top-8 select-none text-[11vw] leading-none tracking-tighter opacity-20" />
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
        </div>
      </section>

      {/* 事業: 横スクロールレール */}
      <section id="services" className="scroll-mt-24 border-y border-line bg-mist" aria-labelledby="services-heading">
        <div className="mx-auto max-w-7xl px-5 pt-20 md:pt-28">
          <div className="grid items-center gap-10 md:grid-cols-[1.2fr_1fr]">
            <SectionHead
              en="Services"
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
                <span className="font-data block text-[0.62rem] uppercase tracking-[0.28em] text-aqua">
                  Free Consulting
                </span>
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
        <WaveText text="NUMBERS" tone="light" className="pointer-events-none absolute -top-1 right-0 select-none text-[11vw] leading-none tracking-tighter" />
        <div className="relative mx-auto max-w-7xl px-5">
          <Reveal>
            <p className="eyebrow !text-aqua">Numbers</p>
            <h2 id="numbers-heading" className="mt-3 text-3xl font-bold md:text-5xl">
              成果は、数字で語る。
            </h2>
          </Reveal>
          <dl className="mt-16 grid grid-cols-1 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
            {MEGA_STATS.map((s, i) => (
              <Reveal key={s.label} delay={(i % 3) * 0.1}>
                {/* 縦罫と単位を金にして、紺一色の面に温度を足す */}
                <div className="border-l-2 border-gold-bright/70 pl-6">
                  <dd className="mega-num text-6xl text-white md:text-7xl lg:text-8xl">
                    <CountUp value={s.value} duration={1.4 + (i % 3) * 0.3} />
                    <span className="ml-1 text-3xl text-gold-bright md:text-4xl">{s.suffix}</span>
                  </dd>
                  <dt className="mt-4 text-xs leading-5 text-white/60 md:text-sm">{s.label}</dt>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* データセクション */}
      <section id="data" className="relative scroll-mt-24 bg-paper py-24 md:py-32" aria-labelledby="data-heading">
        <span aria-hidden className="eyebrow-v absolute left-5 top-24 hidden xl:block">
          Data Driven
        </span>
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            en="Data"
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
        <WaveText text="SEO×MEO×AIO" className="pointer-events-none absolute right-0 top-4 select-none text-[8vw] leading-none tracking-tighter opacity-20" />
        <div className="relative mx-auto max-w-7xl px-5">
          <SectionHead
            en="SEO × MEO × AIO"
            title="検索対策の「第三の時代」を、先導する"
            lead="ユーザーはGoogleで調べる前に、ChatGPTに聞き始めています。SEO・MEOに続く第三の検索対策「AIO(AI最適化)」に、==いま着手する企業が次の集客を制します==。"
          />
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
                <p className="eyebrow !text-aqua">Field Work</p>
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
            en="Case Studies"
            title="数字が動いた、3つの現場"
            lead="規模も業種も違う3社。共通しているのは、==施策を数字で設計し、数字で報告した==ことです。"
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {cases.map((cs, i) => (
              <Reveal key={cs.industry} delay={(i % 3) * 0.09}>
                <article className="flex h-full flex-col rounded-3xl border border-line bg-raise p-7 shadow-card md:p-8">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-ink px-3 py-1 text-[0.62rem] font-bold text-white">
                      {cs.industry}
                    </span>
                    <Link href={`/services/${cs.slug}`} className="text-[0.66rem] font-bold text-pulse hover:underline">
                      {cs.service} →
                    </Link>
                  </div>
                  <h3 className="mt-5 text-lg font-black leading-relaxed md:text-xl">{cs.headline}</h3>

                  <div className="mt-6 flex items-center gap-3 rounded-2xl border border-line bg-mist/70 p-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.6rem] text-slate">Before</p>
                      <p className="mt-1 text-xs font-medium leading-5 text-slate">{cs.before}</p>
                    </div>
                    <svg width="22" height="14" viewBox="0 0 34 20" aria-hidden className="shrink-0 text-pulse">
                      <path d="M2 10h24M20 4l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.6rem] text-pulse">After</p>
                      <p className="mt-1 text-xs font-bold leading-5 text-ink">{cs.after}</p>
                    </div>
                  </div>

                  <p className="mt-5 leading-none">
                    <span className="num text-4xl font-bold md:text-5xl">{cs.metric.value}</span>
                    <span className="ml-1 text-base font-bold text-pulse">{cs.metric.suffix}</span>
                    <span className="mt-2 block text-[0.65rem] text-slate">{cs.metric.label}</span>
                  </p>

                  <p className="mt-5 text-xs leading-7 text-slate">{cs.body}</p>

                  <figure className="mt-auto border-t border-line pt-5">
                    <blockquote className="text-xs leading-7 text-ink">
                      <span className="font-data mr-1.5 text-base font-bold text-pulse">&ldquo;</span>
                      {cs.voice}
                    </blockquote>
                    <figcaption className="mt-2.5 text-[0.62rem] text-slate">— {cs.industry} ご担当者様</figcaption>
                  </figure>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 進め方 */}
      <section id="process" className="scroll-mt-24 py-24 md:py-32" aria-labelledby="process-heading">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            en="Process"
            title="ご相談から成果まで、4つのステップ"
            lead="どのサービスも、いきなり契約から始まることはありません。まず現状を診断し、==効果の見込みを数字で確認==してから進めます。"
          />
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
                <p className="eyebrow">Subsidy</p>
                <h2 id="subsidy-heading" className="mt-3 text-2xl font-bold md:text-4xl">
                  受発注・会計ソフトなら、
                  <br className="sm:hidden" />
                  <mark className="marker">最大350万円の枠</mark>が使えます
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-8 text-slate">
                  当社はAI導入補助金のベンダーとして、申請支援から導入・実績報告までを一貫対応。受発注ソフト・会計ソフトを対象とする枠なら補助上限は350万円です。採択通過率は90%以上、支援実績は50社以上。「制度が複雑で諦めていた」企業こそご相談ください。8問・3分の無料診断で、活用できる制度がすぐ分かります。
                </p>
              </div>
              <div className="flex flex-col gap-3 md:items-end">
                <Link
                  href="/services/ai-subsidy"
                  className="rounded-full bg-pulse px-8 py-4 text-center text-sm font-bold text-white shadow-card transition-transform hover:-translate-y-0.5"
                >
                  補助金支援の詳細を見る
                </Link>
                <a
                  href={site.lpUrl}
                  target="_blank"
                  rel="noopener"
                  className="rounded-full border border-ink/20 px-8 py-4 text-center text-sm font-bold text-ink transition-colors hover:border-pulse hover:text-pulse"
                >
                  無料診断LPを見る (8問・3分)
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* お知らせ */}
      <section id="news" className="scroll-mt-24 border-t border-line bg-mist py-24 md:py-28" aria-labelledby="news-heading">
        <div className="mx-auto max-w-5xl px-5">
          <SectionHead en="News" title="お知らせ" />
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
      <section id="faq" className="scroll-mt-24 py-24 md:py-32" aria-labelledby="faq-heading">
        <div className="mx-auto max-w-4xl px-5">
          <SectionHead en="FAQ" title="よくあるご質問" align="center" />
          <div className="mt-12">
            <FaqList items={TOP_FAQ} />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import JsonLd from "@/components/JsonLd";
import { Reveal } from "@/components/motion";
import { SectionHead, CtaBand } from "@/components/ui";
import { services } from "@/lib/services";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "会社概要",
  description:
    `セブンセンシズ株式会社の会社概要。代表挨拶・ミッション・会社情報。大阪市東成区を拠点にAIコンサルティング・MEO/AIO運用代行など${services.length}つの事業を展開しています。`,
  alternates: { canonical: "/company" },
};

const OVERVIEW: { label: string; value: React.ReactNode }[] = [
  { label: "会社名", value: `${site.name}(${site.nameEn})` },
  {
    // 経歴と執筆記事は AI集客ラボ の監修者ページに集約している。
    // 実リンクを張ることで、検索エンジンとAIが「同一人物」と確認できる根拠になる。
    label: "代表取締役",
    value: (
      <>
        {site.ceo}
        <a
          href="https://ai.7senses.co.jp/author/haraguchi/"
          target="_blank"
          rel="noopener"
          className="ml-3 text-xs text-pulse underline-offset-4 hover:underline"
        >
          経歴・執筆記事を見る
        </a>
      </>
    ),
  },
  { label: "設立", value: site.founded },
  { label: "資本金", value: site.capital },
  {
    // 同名の別法人 (株式会社セブンセンシズ / 東京都目黒区) と取り違えられないよう、
    // 人にも機械にも確認できる識別子を会社概要に明示する
    label: "法人番号",
    value: (
      <a
        href={`https://www.houjin-bangou.nta.go.jp/henkorireki-johoto.html?selHouzinNo=${site.corporateNumber}`}
        target="_blank"
        rel="noopener"
        className="num text-pulse underline-offset-4 hover:underline"
      >
        {site.corporateNumber} ↗
      </a>
    ),
  },
  { label: "所在地", value: `〒${site.postal} ${site.address}` },
  {
    label: "電話番号",
    value: (
      <a href={`tel:${site.tel.replaceAll("-", "")}`} className="num text-pulse underline-offset-4 hover:underline">
        {site.tel}
      </a>
    ),
  },
  { label: "営業時間", value: site.hours },
  { label: "取引銀行", value: site.banks },
  {
    label: "事業内容",
    value: (
      <ul className="grid gap-1.5">
        {services.map((s) => (
          <li key={s.slug}>{s.name}</li>
        ))}
      </ul>
    ),
  },
];

export default function CompanyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "トップ", path: "/" },
          { name: "会社概要", path: "/company" },
        ])}
      />

      <section className="relative overflow-hidden pt-16 md:pt-20">
        <div aria-hidden className="grid-field absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-12 md:pb-20 md:pt-20">
          <Reveal>
            <p className="eyebrow">Company</p>
            <h1 className="mt-4 text-3xl font-black md:text-5xl">会社概要</h1>
            <p className="mt-6 max-w-2xl text-sm leading-8 text-slate md:text-base">
              「{site.tagline}」。私たちは、テクノロジーの力で事業と暮らしをもっと快適にすることを使命に、大阪から全国の企業・店舗を支援しています。
            </p>
          </Reveal>
        </div>
      </section>

      {/* 代表挨拶 */}
      <section className="relative overflow-hidden bg-ink py-20 text-white md:py-28" aria-labelledby="message-heading">
        <div aria-hidden className="grid-field-dark absolute inset-0" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 70% at 85% 20%, rgb(37 99 235 / 0.3), transparent 60%)",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl items-end gap-10 px-5 md:grid-cols-[1.3fr_1fr]">
          <div className="pb-4">
            <Reveal>
              <p className="eyebrow !text-aqua">Message</p>
              <h2 id="message-heading" className="mt-3 text-2xl font-bold leading-relaxed md:text-4xl">
                「運」までも、
                <br />
                ご提案するコンサルティングを。
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8 grid max-w-xl gap-5 text-sm leading-9 text-white/70 md:text-base">
                <p>
                  社名の「セブンセンシズ」は、五感を超えた第六感——そのさらに先にある「第七感」に由来します。現場で磨かれた事業者の感覚を超えて、お客様の「運」となり得るご提案をしたい。その想いから、セブンセンシズ株式会社を設立しました。
                </p>
                <p>
                  松下幸之助は、成功する経営者の条件に「運」を挙げました。しかし運は、待つものではなく、正しい打ち手を積み重ねた先に舞い込むものです。プロフェッショナルの知見と、運を活かすご提案——その両方をお届けすることが、私たちの仕事です。
                </p>
                <p className="font-bold text-white">
                  店舗ビジネスの常識を、変えていく。
                </p>
              </div>
              <p className="mt-8 text-xs text-white/50">
                代表取締役 <span className="ml-2 text-base font-bold text-white">{site.ceo}</span>
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="relative mx-auto w-64 md:w-full md:max-w-sm">
            <div aria-hidden className="absolute inset-x-8 bottom-0 top-12 rounded-t-full bg-gradient-to-b from-pulse/40 to-aqua/10" />
            <Image
              src="/images/ceo-cutout.png"
              alt={`代表取締役 ${site.ceo}`}
              width={697}
              height={886}
              className="relative h-auto w-full drop-shadow-2xl"
              priority
            />
          </Reveal>
        </div>
      </section>

      {/* ミッション + 現場写真 */}
      <section className="py-20 md:py-28" aria-labelledby="mission-heading">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 lg:grid-cols-2">
          <div>
            <SectionHead
              en="Mission"
              title="現場の実績を、再現できる仕組みに。"
              lead="私たちの出発点は、店舗集客の現場です。通算3,200店舗のGoogleビジネスプロフィール運用で積み上げてきたのは、==業種×商圏ごとに「何をすれば数字が動くか」という実践データ==。この蓄積をAIと仕組みの力で磨き上げ、どんな企業でも再現できるサービスとして届けることが、セブンセンシズのミッションです。"
            />
            <Reveal delay={0.1}>
              <div className="mt-8 grid max-w-2xl gap-5 text-sm leading-9 text-slate md:text-base">
                <p>
                  MEOで培った「検索に選ばれる技術」は、AI検索時代の<mark className="marker">AIO運用代行</mark>へ。現場で目にしてきた業務の非効率は、AIコンサルティングとシステム開発へ。導入コストの壁は、AI導入補助金支援へ——{services.length}つの事業はすべて、現場の課題から逆算して生まれました。だからこそ私たちの提案は机上の空論にならず、<strong className="font-bold text-ink">明日から動く施策</strong>としてお渡しできます。
                </p>
                <p>
                  また、全国でのセミナー登壇やオウンドメディア「AI集客ラボ」を通じて、うまくいった打ち手も、失敗から学んだことも、隠さず発信しています。ノウハウを公開できるのは、<mark className="marker">自社で実践し続けている自信</mark>があるからです。当サイト自体も、構造化データやllms.txtを実装した「AIに引用されるサイト」の実験場になっています。
                </p>
              </div>
            </Reveal>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Reveal className="col-span-2 row-span-2">
              <Image
                src="/images/office-sign.jpg"
                alt="オフィス入口に掲げられた社名サイン"
                width={1536}
                height={1024}
                className="h-full w-full rounded-2xl object-cover shadow-card"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <Image
                src="/images/seminar-2.jpg"
                alt="セミナー会場の様子"
                width={700}
                height={525}
                className="aspect-square w-full rounded-2xl object-cover"
              />
            </Reveal>
            <Reveal delay={0.16}>
              <Image
                src="/images/seminar-3.jpg"
                alt="登壇中の代表"
                width={700}
                height={525}
                className="aspect-square w-full rounded-2xl object-cover"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 概要表 */}
      <section className="py-20 md:py-28" aria-labelledby="profile-heading">
        <div className="mx-auto max-w-5xl px-5">
          <SectionHead en="Profile" title="基本情報" />
          <Reveal delay={0.1} className="mt-10 overflow-hidden rounded-2xl border border-line shadow-card">
            <table className="w-full border-collapse bg-white text-sm">
              <tbody>
                {OVERVIEW.map((row) => (
                  <tr key={row.label} className="border-b border-line last:border-0">
                    <th
                      scope="row"
                      className="w-32 bg-mist/60 p-5 text-left align-top text-xs font-bold text-slate md:w-44 md:text-sm"
                    >
                      {row.label}
                    </th>
                    <td className="p-5 leading-7 text-ink">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 text-xs leading-6 text-slate">
              ご来社の際は、お手数ですが事前にお電話にてご連絡ください。
            </p>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

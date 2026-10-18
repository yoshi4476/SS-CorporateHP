import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { SectionHead, CtaBand, PageHead, StorySection } from "@/components/ui";
import { services, areas } from "@/lib/services";
import { pageMeta } from "@/lib/meta";
import { breadcrumbSchema } from "@/lib/schema";
import MapFacade from "@/components/MapFacade";
import { mapInfo, site } from "@/lib/site";
import { developer, developerOrg } from "@/lib/developer";

const meta = pageMeta({
  title: "会社概要｜大阪市東成区・2020年設立",
  // 「セブンセンシズ株式会社」の指名検索はトップページ (corp.7senses.co.jp) で
  // 受ける方針のため、この社名だけを先頭に置く書き出しは避け、
  // ページの役割 (会社概要) を先に示してから社名に触れる語順にする。
  description:
    `セブンセンシズ株式会社の会社概要です。代表挨拶・ミッション・会社情報を掲載しています。大阪市東成区を拠点に、経理BPO・AIコンサルティング・MEO/AIO運用代行・システム開発など${services.length}つの事業を展開しています。`,
  path: "/company",
});
// 役割（会社概要）を先に、正式名をその後に置く。末尾の「｜セブンセンシズ」は付けない（社名が2回並ぶ）
export const metadata: Metadata = { ...meta, title: { absolute: "会社概要｜セブンセンシズ株式会社（大阪市東成区・2020年設立）" } };

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
          className="link-u ml-3 text-[13px]"
        >
          経歴・執筆記事を見る
        </a>
      </>
    ),
  },
  {
    // 当社の顧問。プレスキットと同じ書き方にし、本人のサイト（開発・事業づくりの相談の窓口）へつなぐ
    label: "顧問",
    value: (
      <>
        {developer.name}（{developer.jobTitle}）。AIO 事業とシステム開発事業の責任者
        <a
          href={developerOrg.url}
          target="_blank"
          rel="noopener"
          className="link-u ml-3 inline-block py-1.5 text-[13px]"
        >
          {developerOrg.name} ↗
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
    // 7つを1列に並べるだけだと、何の事業がいくつあるのか見えなかった。トップの全体像の図と同じ3つの領域で束ね、各事業へリンクする
    label: "事業内容",
    value: (
      <dl className="grid gap-3">
        {areas.map((a) => (
          <div key={a.group}>
            <dt className="text-[13px] font-bold text-gold-deep">
              {a.name}
              <span className="ml-2 font-medium text-slate">{a.purpose}</span>
            </dt>
            <dd>
              <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                {services
                  .filter((s) => s.group === a.group)
                  .map((s) => (
                    <li key={s.slug}>
                      <Link href={`/services/${s.slug}`} className="text-pulse underline-offset-4 hover:underline">
                        {s.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
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

      <PageHead
        crumbs={[{ name: "トップ", href: "/" }, { name: "会社概要" }]}
        title="会社概要"
        lead={<>「{site.tagline}」。私たちは、テクノロジーの力で事業と暮らしをもっと快適にすることを使命に、大阪から全国の企業・店舗を支援しています。</>}
      />

      {/* 代表挨拶。代表の写真（実写）と言葉。以前は紺の面に光のぼかしと半円のグラデーションを敷いていた */}
      <section className="py-20 md:py-32" aria-labelledby="message-heading">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-12 lg:gap-12">
          <figure className="max-w-[18rem] sm:max-w-xs lg:col-span-4 lg:max-w-none">
            <div className="overflow-hidden rounded-md bg-mist">
              <Image
                src="/images/ceo-cutout.png"
                alt={`代表取締役 ${site.ceo}`}
                width={698}
                height={876}
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                className="h-auto w-full"
                priority
              />
            </div>
            <figcaption className="mt-3 flex items-baseline justify-between border-b border-line pb-3 text-sm">
              <span className="text-slate">代表取締役</span>
              <span className="text-lg font-bold">{site.ceo}</span>
            </figcaption>
          </figure>
          <div className="lg:col-span-8">
            <SectionHead id="message-heading" title="「運」までも、ご提案するコンサルティングを。" />
            <div className="mt-8 grid max-w-[40em] gap-6 text-base leading-[2] text-slate">
              <p>
                社名の「セブンセンシズ」は、五感を超えた第六感——そのさらに先にある「第七感」に由来します。現場で磨かれた事業者の感覚を超えて、お客様の「運」となり得るご提案をしたい。その想いから、セブンセンシズ株式会社を設立しました。
              </p>
              <p>
                松下幸之助は、成功する経営者の条件に「運」を挙げました。しかし運は、待つものではなく、正しい打ち手を積み重ねた先に舞い込むものです。プロフェッショナルの知見と、運を活かすご提案——その両方をお届けすることが、私たちの仕事です。
              </p>
              <p className="text-lg font-bold text-ink">店舗ビジネスの常識を、変えていく。</p>
            </div>
          </div>
        </div>
      </section>

      {/* ミッション + 現場写真（実写） */}
      <StorySection
        id="mission"
        tone="mist"
        title="現場の実績を、再現できる仕組みに。"
        lead="私たちの出発点は、店舗集客の現場です。通算3,200店舗のGoogleビジネスプロフィール運用で積み上げてきたのは、==業種×商圏ごとに「何をすれば数字が動くか」という実践データ==。この蓄積をAIと仕組みの力で磨き上げ、どんな企業でも再現できるサービスとして届けることが、セブンセンシズのミッションです。"
      >
        <div className="grid max-w-[42em] gap-6 text-base leading-[2] text-slate">
          <p>
            MEOで培った「検索に選ばれる技術」は、AI検索時代の<mark className="marker">AIO運用代行</mark>へ。現場で目にしてきた業務の非効率は、AIコンサルティングとシステム開発へ。導入コストの壁は、AI導入補助金支援へ——{services.length}つの事業はすべて、現場の課題から逆算して生まれました。だからこそ私たちの提案は机上の空論にならず、<strong className="font-bold text-ink">明日から動く施策</strong>としてお渡しできます。
          </p>
          <p>
            また、全国でのセミナー登壇やオウンドメディア「AI集客ラボ」を通じて、うまくいった打ち手も、失敗から学んだことも、隠さず発信しています。ノウハウを公開できるのは、<mark className="marker">自社で実践し続けている自信</mark>があるからです。当サイト自体も、構造化データやllms.txtを実装した「AIに引用されるサイト」の実験場になっています。
          </p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4">
          <figure className="col-span-2">
            <Image src="/images/seminar-2.jpg" alt="セミナー会場の様子" width={700} height={525} sizes="(min-width: 1024px) 60vw, 100vw" className="aspect-[16/9] w-full rounded-md object-cover" />
          </figure>
          <figure>
            <Image src="/images/seminar-3.jpg" alt="登壇中の代表" width={700} height={525} sizes="(min-width: 1024px) 30vw, 50vw" className="aspect-[4/3] w-full rounded-md object-cover" />
          </figure>
          <figure>
            <Image src="/images/seminar-1.jpg" alt="経営者向け勉強会で店舗集客を解説する様子" width={700} height={525} sizes="(min-width: 1024px) 30vw, 50vw" className="aspect-[4/3] w-full rounded-md object-cover" />
          </figure>
          <p className="col-span-2 text-[13px] text-slate">全国でのセミナー・勉強会の様子</p>
        </div>
      </StorySection>

      {/* 概要表 */}
      <StorySection id="profile" title="基本情報">
        <table className="w-full border-collapse text-[15px]">
          <caption className="sr-only">会社の基本情報</caption>
          <tbody className="rule-close border-t border-ink">
            {OVERVIEW.map((row) => (
              <tr key={row.label} className="border-b border-line last:border-b-0">
                <th scope="row" className="w-28 py-4 pr-4 text-left align-top text-sm font-bold text-slate md:w-40">
                  {row.label}
                </th>
                <td className="py-4 leading-7 text-ink [overflow-wrap:anywhere]">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </StorySection>

      {/* アクセス（地図は押したときだけ読む） */}
      <section id="access" className="scroll-mt-24 bg-mist py-20 md:py-32" aria-labelledby="access-heading">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <SectionHead id="access-heading" title="アクセス" />
            <p className="num mt-6 text-xl font-bold text-ink" aria-label="北緯34.6791度、東経135.5552度">
              34.6791<span className="ml-0.5 text-sm text-slate">°N</span>
              <span className="mx-2 font-normal text-line-strong">/</span>
              135.5552<span className="ml-0.5 text-sm text-slate">°E</span>
            </p>
            <dl className="mt-5 border-t border-line text-[15px]">
              {[
                ["所在地", <>〒{site.postal}<br />大阪府大阪市東成区神路1丁目7-4<br />コンフォートビル901・902</>],
                ["最寄り", mapInfo.station],
                ["受付", site.hours],
                [
                  "電話",
                  <a key="tel" href={`tel:${site.tel.replaceAll("-", "")}`} className="num font-bold text-pulse underline-offset-4 hover:underline">
                    {site.tel}
                  </a>,
                ],
              ].map(([label, value]) => (
                <div key={String(label)} className="grid grid-cols-[4.5em_1fr] gap-3 border-b border-line py-3">
                  <dt className="pt-0.5 text-sm font-bold text-slate">{label}</dt>
                  <dd className="leading-7 text-ink">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-sm leading-7 text-slate">
              ご来社の際は、お手数ですが事前にお電話にてご連絡ください。オンラインでのご相談も承っています。
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
              <a href={mapInfo.share} target="_blank" rel="noopener" className="btn btn-secondary">
                Googleマップで開く
              </a>
              <a href={mapInfo.route} target="_blank" rel="noopener" className="link-u inline-flex min-h-11 items-center text-sm">
                経路を調べる
              </a>
            </div>
          </div>
          <div className="lg:col-span-7">
            <MapFacade />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

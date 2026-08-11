import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { Reveal } from "@/components/motion";
import { CtaBand } from "@/components/ui";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description:
    "セブンセンシズ株式会社のプライバシーポリシー(個人情報保護方針)。個人情報の取得・利用目的・第三者提供・開示請求への対応について定めています。",
  alternates: { canonical: "/privacy" },
};

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "1. 基本方針",
    body: [
      `${site.name}(以下「当社」)は、個人情報の重要性を認識し、個人情報の保護に関する法律(個人情報保護法)および関連法令を遵守するとともに、以下のとおり個人情報を適切に取り扱います。`,
    ],
  },
  {
    title: "2. 個人情報の取得",
    body: [
      "当社は、お問い合わせフォーム・お電話・打ち合わせ等を通じて、氏名、会社名、電話番号、メールアドレス、ご相談内容などの個人情報を、適法かつ公正な手段により取得します。",
    ],
  },
  {
    title: "3. 利用目的",
    body: [
      "取得した個人情報は、次の目的の範囲内で利用します。(1) お問い合わせ・ご相談への対応 (2) サービスの提供・契約の履行 (3) サービスに関するご案内・ご連絡 (4) サービス品質の改善・分析。利用目的を変更する場合は、あらかじめご本人に通知または公表します。",
    ],
  },
  {
    title: "4. 第三者提供",
    body: [
      "当社は、法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供しません。",
    ],
  },
  {
    title: "5. 委託",
    body: [
      "利用目的の達成に必要な範囲で、個人情報の取り扱いを外部に委託する場合があります。その際は、適切な委託先を選定し、必要かつ適切な監督を行います。",
    ],
  },
  {
    title: "6. 安全管理措置",
    body: [
      "当社は、個人情報の漏えい・滅失・毀損の防止その他個人情報の安全管理のために、必要かつ適切な措置を講じます。",
    ],
  },
  {
    title: "7. アクセス解析ツールについて",
    body: [
      "当サイトでは、サービス向上のためGoogle社のアクセス解析ツール「Google アナリティクス」を利用しています。閲覧されたページや滞在時間などの情報がCookieを用いてGoogle社へ送信されますが、個人を特定する情報は含まれません。",
      "収集した情報は、サイトの改善およびご提供するサービスの品質向上の目的にのみ使用します。Cookieの利用は、ブラウザの設定またはGoogle社が提供する「Google アナリティクス オプトアウト アドオン」により無効にできます。",
      "Google社における情報の取り扱いについては、同社のプライバシーポリシーをご確認ください。",
    ],
  },
  {
    title: "8. 開示・訂正・削除等の請求",
    body: [
      "ご本人からの個人情報の開示・訂正・利用停止・削除等のご請求には、ご本人であることを確認のうえ、法令に従い速やかに対応します。下記の窓口までご連絡ください。",
    ],
  },
  {
    title: "9. 本ポリシーの改定",
    body: [
      "本ポリシーの内容は、法令の改正や運用の見直しに応じて、予告なく変更することがあります。変更後の内容は当サイトに掲載した時点から効力を生じます。",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "トップ", path: "/" },
          { name: "プライバシーポリシー", path: "/privacy" },
        ])}
      />
      <section className="relative overflow-hidden pt-16 md:pt-20">
        <div aria-hidden className="grid-field absolute inset-0" />
        <div className="relative mx-auto max-w-4xl px-5 pb-10 pt-12 md:pt-20">
          <Reveal>
            <p className="eyebrow">Privacy Policy</p>
            <h1 className="mt-4 text-3xl font-black md:text-5xl">プライバシーポリシー</h1>
            <p className="mt-6 text-sm leading-8 text-slate">
              {site.name}の個人情報保護方針です。
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-20 pt-4 md:pb-28">
        <div className="mx-auto grid max-w-4xl gap-8 px-5">
          {SECTIONS.map((s, i) => (
            <Reveal key={s.title} delay={Math.min(i * 0.04, 0.2)}>
              <section className="rounded-2xl border border-line bg-raise p-7 shadow-card">
                <h2 className="text-base font-bold md:text-lg">{s.title}</h2>
                {s.body.map((p, j) => (
                  <p key={j} className="mt-3 text-sm leading-8 text-slate">
                    {p}
                  </p>
                ))}
              </section>
            </Reveal>
          ))}
          <Reveal delay={0.2}>
            <section className="rounded-2xl border border-line bg-raise p-7 shadow-card">
              <h2 className="text-base font-bold md:text-lg">10. お問い合わせ窓口</h2>
              <p className="mt-3 text-sm leading-8 text-slate">
                {site.name}
                <br />
                〒{site.postal} {site.address}
                <br />
                TEL:{" "}
                <a href={`tel:${site.tel.replaceAll("-", "")}`} className="num text-pulse underline-offset-4 hover:underline">
                  {site.tel}
                </a>
                (受付時間: {site.hours})
                <br />
                または<Link href="/contact" className="text-pulse underline-offset-4 hover:underline">お問い合わせフォーム</Link>よりご連絡ください。
              </p>
              <p className="mt-5 text-xs text-faint">制定日: 2026年7月28日</p>
            </section>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

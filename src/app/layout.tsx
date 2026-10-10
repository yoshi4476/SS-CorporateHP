import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Effects from "@/components/Effects";
import JsonLd from "@/components/JsonLd";
import Tracking from "@/components/Tracking";
import FirstTouch from "@/components/FirstTouch";
import { organizationSchema } from "@/lib/schema";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

// 日本語のWebフォントは使わない。文字範囲ごとに60本以上・1MB超を読み、
// モバイルの表示が13秒かかっていた。端末のフォント（globals.css）で描く
// 数字・英字用の Space Grotesk はリポジトリに置いたファイルを使う（OFL）。
// next/font/google はビルドのたびに Google から取りに行き、取得に失敗すると
// デプロイごと落ちた（2026-09-29 の Actions）。外に取りに行かなければ落ちない
const grotesk = localFont({
  src: [
    { path: "./fonts/SpaceGrotesk-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/SpaceGrotesk-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    // 社名の検索で旧サイト（www.7senses.co.jp）が上に出ていたため、正式名を先頭に置く（2026-10-03）。
    // 以前は41字で末尾が切れていたので、表示幅（約32字）に収める。
    default: "セブンセンシズ株式会社｜大阪のAIコンサル・MEO運用代行",
    // 接尾辞に「株式会社」まで入れると、約32字の表示幅のうち12字が
    // 毎ページ社名で埋まる。社名の識別には「セブンセンシズ」で足りる。
    template: "%s｜セブンセンシズ",
  },
  description:
    "大阪のAIコンサルティング・デジタルマーケティング会社。AI導入支援、システム開発、MEO運用代行(通算3,200店舗)、AIO運用代行、オウンドメディア運用、HP/LP制作まで一気通貫で支援します。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: site.name,
    title: `${site.name}|AIコンサルティング・MEO/AIO運用代行・システム開発`,
    description: `MEO通算3,200店舗の実績。AIコンサルティングからAIO・システム開発まで、${services.length}つの事業で中小企業の成長を仕組み化します。`,
    images: [{ url: "/ogp.png", width: 1200, height: 630, alt: "セブンセンシズ株式会社 — 人を増やさずに、集客も経理も回す。" }],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${grotesk.variable} h-full antialiased`}
    >
      {/*
        Google Analytics 4。
        Search Console の所有権確認はホームページの <head> 内にスニペットがあることを
        条件にしているため、body ではなく head に直接出力する。
      */}
      <head>
        {/* イントロを出す回だけ、描画の前に画面を覆う。
            IntroLoader は JS が動いてから現れるため、それまでの一瞬だけ本編が見えていた。
            3秒で必ず外す保険つき（JSが落ちても黒いままにならない） */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(location.pathname==='/'&&!sessionStorage.getItem('ss-intro')&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&!matchMedia('(max-width: 900px)').matches){" +
              "document.documentElement.classList.add('ss-intro-pending');" +
              "setTimeout(function(){document.documentElement.classList.remove('ss-intro-pending')},3000);}}catch(e){}",
          }}
        />
        {site.ga4Id && (
          <>
            {/* 計測タグ(172KB)は描画の後に読む。それまでの出来事は dataLayer に溜まり、読み込み後にまとめて送られる */}
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${site.ga4Id}');window.addEventListener('load',function(){setTimeout(function(){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${site.ga4Id}';document.head.appendChild(s);},1200);});`,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-full">
        <JsonLd data={organizationSchema} />
        <Tracking />
        <FirstTouch />
        <Header />
        <Effects>
          <main>{children}</main>
          <Footer />
        </Effects>
      </body>
    </html>
  );
}

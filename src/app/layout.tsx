import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import PageTransition from "@/components/PageTransition";
import IntroLoader from "@/components/IntroLoader";
import JsonLd from "@/components/JsonLd";
import Tracking from "@/components/Tracking";
import { organizationSchema } from "@/lib/schema";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

// 日本語のWebフォントは使わない。文字範囲ごとに60本以上・1MB超を読み、
// モバイルの表示が13秒かかっていた。端末のフォント（globals.css）で描く
const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    // 41字あり、検索結果では末尾が切れていた。会社名を先に置くのは
    // 指名検索のためだが、後半が読まれないなら意味がない。
    default: "AIコンサルティング・MEO運用代行なら大阪のセブンセンシズ",
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
        <Header />
        <Cursor />
        <PageTransition />
        <IntroLoader />
        <SmoothScroll>
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}

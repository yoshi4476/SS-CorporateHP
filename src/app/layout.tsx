import type { Metadata } from "next";
import { Noto_Sans_JP, Space_Grotesk, Zen_Kaku_Gothic_New } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import PageTransition from "@/components/PageTransition";
import IntroLoader from "@/components/IntroLoader";
import JsonLd from "@/components/JsonLd";
import { organizationSchema } from "@/lib/schema";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

// 日本語フォントは1ウェイトあたり数百KBある。実際に描画されているウェイトだけ読む。
// (計測: 見出しは 700 と 900 のみ。500 はどこにも当たっていなかった)
const zen = Zen_Kaku_Gothic_New({
  variable: "--font-zen",
  weight: ["700", "900"],
  subsets: ["latin"],
  display: "swap",
});

const noto = Noto_Sans_JP({
  variable: "--font-noto",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}|AIコンサルティング・MEO/AIO運用代行・システム開発`,
    template: `%s|${site.name}`,
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
      className={`${zen.variable} ${noto.variable} ${grotesk.variable} h-full antialiased`}
    >
      {/*
        Google Analytics 4。
        Search Console の所有権確認はホームページの <head> 内にスニペットがあることを
        条件にしているため、body ではなく head に直接出力する。
      */}
      <head>
        {site.ga4Id && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${site.ga4Id}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${site.ga4Id}');`,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-full">
        <JsonLd data={organizationSchema} />
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

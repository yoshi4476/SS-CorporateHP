import type { Metadata } from "next";
import Script from "next/script";
import { Noto_Sans_JP, Space_Grotesk, Zen_Kaku_Gothic_New } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import TiltEffect from "@/components/TiltEffect";
import PageTransition from "@/components/PageTransition";
import IntroLoader from "@/components/IntroLoader";
import JsonLd from "@/components/JsonLd";
import { organizationSchema } from "@/lib/schema";
import { site } from "@/lib/site";

const zen = Zen_Kaku_Gothic_New({
  variable: "--font-zen",
  weight: ["500", "700", "900"],
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
  weight: ["400", "500", "700"],
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
    "大阪のAIコンサルティング・デジタルマーケティング会社。AI導入支援、システム開発、MEO運用代行(通算3,200社)、AIO運用代行、オウンドメディア運用、HP/LP制作まで一気通貫で支援します。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: site.name,
    title: `${site.name}|AIコンサルティング・MEO/AIO運用代行・システム開発`,
    description:
      "MEO通算3,200社の実績。AIコンサルティングからAIO・システム開発まで、6つの事業で中小企業の成長を仕組み化します。",
    images: [{ url: "/ogp.png", width: 1200, height: 630, alt: "セブンセンシズ株式会社 — あなたの会社を、AIの『答え』にする。" }],
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
      <body className="min-h-full">
        {/* Google Analytics 4。初期表示を妨げないよう操作可能になってから読み込む */}
        {site.ga4Id && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${site.ga4Id}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${site.ga4Id}');`}
            </Script>
          </>
        )}
        <JsonLd data={organizationSchema} />
        <Header />
        <Cursor />
        <TiltEffect />
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

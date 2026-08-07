import { site } from "@/lib/site";
import { services } from "@/lib/services";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${site.url}/#organization`,
  name: site.name,
  legalName: site.name,
  alternateName: ["SEVEN SENSES Inc.", "セブンセンシズ"],
  // 法人番号。同名の別法人と名前だけでは区別できないため、機械が使える識別子を明示する
  identifier: {
    "@type": "PropertyValue",
    name: "法人番号",
    propertyID: "https://www.houjin-bangou.nta.go.jp/",
    value: site.corporateNumber,
  },
  url: site.url,
  logo: `${site.url}/images/logo.png`,
  slogan: site.tagline,
  foundingDate: site.foundedISO,
  founder: { "@type": "Person", name: site.ceo },
  telephone: `+81-6-4305-7547`,
  email: site.contactEmail,
  address: {
    "@type": "PostalAddress",
    postalCode: site.postal,
    addressRegion: "大阪府",
    addressLocality: "大阪市東成区",
    streetAddress: "神路1丁目7-4 コンフォートビル901・902",
    addressCountry: "JP",
  },
  // 自社サイトだけでなく、法人番号で当社だと確定できる外部ページも並べる。
  // 同名の別法人と混ざらないよう、法人番号がURLに入っているものだけを載せること。
  sameAs: [
    site.lpUrl,
    site.labUrl,
    `https://www.houjin-bangou.nta.go.jp/henkorireki-johoto.html?selHouzinNo=${site.corporateNumber}`,
    `https://alarmbox.jp/companyinfo/entities/${site.corporateNumber}`,
  ],
  areaServed: "JP",
  description:
    "大阪のAIコンサルティング・デジタルマーケティング会社。AI導入支援、システム開発、MEO運用代行(通算3,200社)、AIO運用代行、オウンドメディア運用、HP/LP制作を提供。",
  knowsAbout: [
    "AIコンサルティング",
    "AIO(AI最適化・LLMO)",
    "MEO(マップエンジン最適化)",
    "SEO",
    "システム開発",
    "AI導入補助金",
    "ホームページ制作",
  ],
};

export function serviceSchema(slug: string) {
  const s = services.find((x) => x.slug === slug);
  if (!s) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    serviceType: s.en,
    description: s.short,
    provider: { "@id": `${site.url}/#organization` },
    areaServed: "JP",
    url: `${site.url}/services/${s.slug}`,
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${site.url}${it.path}`,
    })),
  };
}

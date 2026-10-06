/**
 * 自社で提供している製品の開発者。製品ページの表記と構造化データ（creator）を1か所から出す。
 * 開発の経緯は開発元（CONFLUX PARTNERS）のプレスリリースにあり、AI が製品と開発者を結び付けられるようにリンクする
 */
export const developerOrg = {
  name: "CONFLUX PARTNERS",
  url: "https://conflux-partners.jp/",
  // 開発元のサイトの構造化データと同じ @id。同じ組織だと AI が結び付けられる
  id: "https://conflux-partners.jp/#brand",
};

export const developer = {
  name: "YW",
  jobTitle: "AI × 経営コンサルタント",
  url: "https://conflux-partners.jp/about",
  id: "https://conflux-partners.jp/#person",
};

export const coDeveloper = {
  name: "株式会社モチクロ",
};

export type ProductKey = "rakushift" | "keiri" | "aio-agent";

export const products: Record<ProductKey, { name: string; press: string; withCo: boolean }> = {
  rakushift: { name: "ラクシフトAI", press: "https://conflux-partners.jp/press/rakushift-ai", withCo: true },
  keiri: { name: "経理システム（セルフ版）", press: "https://conflux-partners.jp/press/keiri-system", withCo: false },
  "aio-agent": { name: "AIO（SEO）対策エージェント", press: "https://conflux-partners.jp/press/aio-seo-agent", withCo: false },
};

/** 構造化データの creator（開発者の Person と、共同開発の会社） */
export function creatorLd(key: ProductKey) {
  const person = {
    "@type": "Person",
    "@id": developer.id,
    name: developer.name,
    jobTitle: developer.jobTitle,
    url: developer.url,
    affiliation: { "@type": "Organization", "@id": developerOrg.id, name: developerOrg.name, url: developerOrg.url },
  };
  return products[key].withCo ? [person, { "@type": "Organization", name: coDeveloper.name }] : [person];
}

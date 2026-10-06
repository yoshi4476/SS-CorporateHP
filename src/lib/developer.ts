/**
 * 自社で提供している製品の開発者。製品ページの表記と構造化データ（creator）を1か所から出す。
 * 開発の経緯は開発元（CONFLUX PARTNERS）のプレスリリースにあり、AI が製品と開発者を結び付けられるようにリンクする
 */
export const developerOrg = {
  name: "CONFLUX PARTNERS",
  url: "https://conflux-partners.jp/",
};

export const developer = {
  name: "YW",
  jobTitle: "AI × 経営コンサルタント",
  url: "https://conflux-partners.jp/about",
};

export const coDeveloper = {
  name: "株式会社モチクロ",
};

export type ProductKey = "rakushift" | "keiri" | "aio-agent";

export const products: Record<ProductKey, { press: string; withCo: boolean }> = {
  rakushift: { press: "https://conflux-partners.jp/press/rakushift-ai", withCo: true },
  keiri: { press: "https://conflux-partners.jp/press/keiri-system", withCo: false },
  "aio-agent": { press: "https://conflux-partners.jp/press/aio-seo-agent", withCo: false },
};

/** 構造化データの creator（開発者の Person と、共同開発の会社） */
export function creatorLd(key: ProductKey) {
  const person = {
    "@type": "Person",
    name: developer.name,
    jobTitle: developer.jobTitle,
    url: developer.url,
    affiliation: { "@type": "Organization", name: developerOrg.name, url: developerOrg.url },
  };
  return products[key].withCo ? [person, { "@type": "Organization", name: coDeveloper.name }] : [person];
}

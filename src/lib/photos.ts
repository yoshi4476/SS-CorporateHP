// 事業ページと業種紹介の写真。名前で引く（public/images/svc/ と public/images/ind/）。
// どれも生成したイメージ写真で、支援先の写真ではない。

/** 事業ごとの写真。1=ヒーロー（その事業の現場）、2=特長の横（任せた後の姿） */
export function svcPhoto(slug: string, n: 1 | 2) {
  return `/images/svc/${slug}-${n}.webp`;
}

// 業種名の言い方は事業ごとに揺れるので、含まれる語で写真を選ぶ。上から順に見る
const IND_RULES: [RegExp, string][] = [
  [/多店舗|複数店舗|多拠点/, "multistore"],
  [/医療|クリニック|整体/, "medical"],
  [/士業|コンサル/, "shigyou"],
  [/不動産|住宅|リフォーム|建設/, "realestate"],
  [/製造|卸/, "factory"],
  [/BtoB|SaaS|IT/, "btob"],
  [/飲食|美容|小売|店舗|サービス業/, "store"],
  [/創業|個人事業/, "startup"],
  [/経理|社員数|中小企業/, "sme"],
];

export function industryPhoto(name: string) {
  const hit = IND_RULES.find(([re]) => re.test(name));
  return `/images/ind/${hit ? hit[1] : "sme"}.webp`;
}

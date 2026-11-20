// HP/LP制作のページに置く、サイトの制作見本。
// 制作は当社の顧問の CONFLUX PARTNERS で、顧問先の例として載せる（2026-11-20 オーナー「コンフレックスが作成、顧問に入っているので例として掲示したい」）。
// お客様に向けてつくった見本で、掲載の許可を取っていないため社名は伏せる。見本のページも社名・人名・連絡先・ロゴを伏せ、noindex にしてある。
// 説明は見本のサイトに載っている内容だけで書き、成果の数字は書かない。写真は public/images/works/<id>-{720,1200}.webp

export type WebSample = {
  id: string;
  /** 業種と地域だけ（社名は書かない） */
  who: string;
  name: string;
  /** 見本のページ（このサイトの public/samples/ に置いた見本。前の claude.ai のアーティファクトは版を直すたびに共有をやり直す必要があった） */
  url: string;
  text: string;
};

export const webSamples: WebSample[] = [
  {
    id: "sample-artmake",
    who: "看護師向けの研修の主催者",
    name: "アートメイク研修のサイト",
    url: "/samples/artmake/",
    text: "韓国・釜山で学ぶ少人数制の研修を、3つのコースと受講の内容で伝え、LINEでの相談につなげます。",
  },
  {
    id: "sample-india-recruit",
    who: "東京の採用支援会社",
    name: "インド理系人材の新卒採用支援のサイト",
    url: "/samples/india-recruit/",
    text: "3つのサービスと課題別の解決策を伝え、採用の診断と資料のダウンロードにつなげます。",
  },
  {
    id: "sample-luxury-guide",
    who: "大阪のメディア運営会社",
    name: "ハイブランド図鑑のメディア",
    url: "/samples/luxury-guide/",
    text: "ブランドと定番モデルを、選び方の記事・実物の写真・中古価格のデータで紹介します（WordPress）。",
  },
  {
    id: "sample-kaitori",
    who: "大阪・心斎橋のブランド買取・質店",
    name: "ブランド買取・質店のサイト",
    url: "/samples/kaitori/",
    text: "いまの営業状況と、モデル別の買取相場のグラフを見せて、来店・電話・LINEでの査定につなげます。",
  },
  {
    id: "sample-seikotsuin",
    who: "堺市西区の鍼灸整骨院",
    name: "鍼灸整骨院のサイト",
    url: "/samples/seikotsuin/",
    text: "痛む場所を選べる3Dの人体模型、お悩みのセルフチェック、Web予約・Web問診を備えています。",
  },
  {
    id: "sample-realestate-satei",
    who: "愛知・西三河の不動産会社",
    name: "不動産の査定・売却のサイト",
    url: "/samples/realestate-satei/",
    text: "名前のいらないWeb査定と、売り方を選ぶ診断、お悩み別・市町村別の相場のページで、査定の相談につなげます。",
  },
  {
    id: "sample-yakiniku",
    who: "大阪・なんばと福島の焼肉店",
    name: "焼肉店のサイト",
    url: "/samples/yakiniku/",
    text: "季節ごとのコースと店舗別の予約を前に出し、目的から5店舗を選べる比較表を入れました。",
  },
];

export const site = {
  name: "セブンセンシズ株式会社",
  nameEn: "SEVEN SENSES Inc.",
  tagline: "Make your life more comfortable",
  // www は旧サイト (WordPress) へ戻すため、新サイトは corp を正とする。
  // canonical・sitemap.xml・OGP・JSON-LD すべてここを見ている。
  url: "https://corp.7senses.co.jp",
  lpUrl: "https://lp.7senses.co.jp/",
  labUrl: "https://ai.7senses.co.jp/",
  // 旧サイト (別業者が運用)。canonical には使わないが、同じ会社のものだと
  // 示すために sameAs へ載せる。示さないと、社名の検索で別の組織として
  // 評価が分かれる。3サイトで揃えること (ai は既に載せている)
  mainUrl: "https://www.7senses.co.jp/",
  // Google Analytics 4 の測定ID。空にすると計測タグを出力しない。
  ga4Id: "G-9NCYS5VPHY",
  tel: "06-4305-7547",
  hours: "9:00〜20:00(土・日・祝日を除く)",
  postal: "537-0003",
  address: "大阪府大阪市東成区神路1丁目7-4 コンフォートビル901・902",
  ceo: "原口 優",
  founded: "2020年3月10日",
  foundedISO: "2020-03-10",
  capital: "500万円",
  banks: "三井住友銀行 / GMOあおぞらネット銀行",
  // 国税庁の法人番号。同名の別法人 (株式会社セブンセンシズ / 東京都目黒区 /
  // 9120001168304) と機械的に区別できる唯一の識別子なので、構造化データにも載せる。
  corporateNumber: "3120001227825",
  contactEmail: "info.ai@7senses.co.jp",
  // お問い合わせの受信先 (Google Apps Script Webアプリ)。
  // 静的サイトのためブラウザから直接送信する = URLは公開される。
  // 迷惑投稿対策として、GAS側で formKey とハニーポットを検証している。
  gasEndpoint:
    "https://script.google.com/macros/s/AKfycbw9RRmWMJnR6lc9n4OmqOGECx4ZHKjdOpfPHFU88-2tQKxkoejbPvCLjr9Edc0Na1nu2w/exec",
  formKey: "7senses-corporate-2026",
};

// Googleマップの店舗情報。会社概要の地図・構造化データ（sameAs / hasMap）が見る
export const mapInfo = {
  share: "https://maps.app.goo.gl/GqS7DHHQSpyomZSQ9",
  cid: "https://www.google.com/maps?cid=815053100031552916",
  route: "https://www.google.com/maps/dir/?api=1&destination=34.6791137%2C135.555196",
  embed: "https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s%E3%82%BB%E3%83%96%E3%83%B3%E3%82%BB%E3%83%B3%E3%82%B7%E3%82%BA%E6%A0%AA%E5%BC%8F%E4%BC%9A%E7%A4%BE%20%E5%A4%A7%E9%98%AA%E5%B8%82%E6%9D%B1%E6%88%90%E5%8C%BA%E7%A5%9E%E8%B7%AF1%E4%B8%81%E7%9B%AE7-4%20%E3%82%B3%E3%83%B3%E3%83%95%E3%82%A9%E3%83%BC%E3%83%88%E3%83%93%E3%83%AB!6i17!3m1!1sja!5m1!1sja",
  lat: 34.6791137,
  lng: 135.555196,
  station: "Osaka Metro 中央線「深江橋」駅",
};

export type NewsItem = {
  slug: string;
  date: string; // YYYY.MM.DD
  dateISO: string;
  category: "お知らせ" | "制度" | "事業";
  title: string;
  body: string[];
};

// 日付は旧サイト掲載時の実日付
export const news: NewsItem[] = [
  {
    slug: "axis-security-pack",
    date: "2026.09.02",
    dateISO: "2026-09-02",
    category: "事業",
    title: "AXIS セキュリティパック 端末監視コースを採用しました。",
    body: [
      "セブンセンシズ株式会社は、「AXIS セキュリティパック 端末監視コース」を採用いたしました。",
      "あわせて当社は、AXISの代理店登録業者です。お客様へのお取り扱いについては、無料相談にてご案内しております。",
    ],
  },
  {
    slug: "scholarship-support",
    date: "2024.01.29",
    dateISO: "2024-01-29",
    category: "制度",
    title: "奨学金返還支援制度の導入を開始いたしました。",
    body: [
      "セブンセンシズ株式会社は、従業員の奨学金返還を会社が支援する「奨学金返還支援(代理返還)制度」を導入いたしました。",
      "本制度は、奨学金を返還しながら働く従業員の経済的負担を軽減し、安心して長く活躍できる環境を整えることを目的としています。対象となる従業員の奨学金返還額の一部を、会社が日本学生支援機構(JASSO)への代理返還により支援します。",
      "セブンセンシズは今後も、社員一人ひとりが能力を最大限発揮できる働きやすい職場づくりに取り組んでまいります。制度の詳細は、採用選考の過程でご説明いたします。",
    ],
  },
  {
    slug: "blog-open",
    date: "2023.11.20",
    dateISO: "2023-11-20",
    category: "お知らせ",
    title: "お知らせ・ブログを開設しました。",
    body: [
      "セブンセンシズ株式会社のお知らせ・ブログを開設しました。事業に関するお知らせや、店舗集客・AI活用に役立つ情報を発信してまいります。",
    ],
  },
];

export function getNews(slug: string) {
  return news.find((n) => n.slug === slug);
}

// AIO (AI検索最適化) の詳細データ。
// 出典: lp.7senses.co.jp/service/aio/ および ai.7senses.co.jp (AI集客ラボ)。2026年7月時点。

/** 用語の整理 */
export const glossary: { term: string; en: string; body: string }[] = [
  {
    term: "AIO",
    en: "AI Overview Optimization",
    body: "Google検索のAIによる回答 (AI Overview) に、自社情報が引用されるよう最適化する施策です。",
  },
  {
    term: "LLMO",
    en: "Large Language Model Optimization",
    body: "ChatGPTやPerplexity等のAIチャットの回答で、自社が引用・言及されるための最適化施策です。",
  },
  {
    term: "SEO",
    en: "Search Engine Optimization",
    body: "検索結果で上位表示されるための最適化施策。AI引用の前提条件となる土台です。",
  },
  {
    term: "MEO",
    en: "Map Engine Optimization",
    body: "Googleマップの検索結果で上位表示され、店舗が選ばれるための最適化施策です。",
  },
];

/** 技術層 / コンテンツ層の実装項目 */
export const layers: { label: string; en: string; items: string[] }[] = [
  {
    label: "技術層の実装",
    en: "Technical",
    items: [
      "FAQPage・Organization等の構造化データ設置",
      "llms.txt (AI向け案内ファイル) の配置",
      "robots.txt で GPTBot 等の主要AIクローラーを許可",
    ],
  },
  {
    label: "コンテンツ層の設計",
    en: "Content",
    items: [
      "結論を冒頭で断言する (AIが引用しやすい構成)",
      "一次情報を持つ (自社調査・実践データ)",
      "E-E-A-T要素を明示 (運営者・執筆者・実績の透明化)",
    ],
  },
];

/** SEOとAIOの違い */
export const seoVsAio: { axis: string; seo: string; aio: string }[] = [
  { axis: "目指す場所", seo: "検索結果ページの上位表示", aio: "AIが生成する回答文の中" },
  { axis: "評価するもの", seo: "検索エンジンのアルゴリズム", aio: "大規模言語モデル (LLM)" },
  { axis: "主な指標", seo: "検索順位・クリック数", aio: "引用・言及の割合、指名検索数" },
  { axis: "対策の中心", seo: "キーワード設計・被リンク・内部構造", aio: "構造化データ・一次情報・E-E-A-T" },
  { axis: "結果の見え方", seo: "10件のリンクが並ぶ", aio: "数社だけが名指しで引用される" },
];

/** 成果測定の指標 */
export const metrics: string[] = [
  "主要AI検索での引用・言及割合の定点観測",
  "指名検索数の推移",
  "AI経由と推定される流入数",
  "問い合わせ時の「認知経路」の確認",
];

/**
 * オウンドメディア運用。AIO運用代行に含まれる施策のひとつ。
 * 出典: ai.7senses.co.jp/lp/ (AI集客ラボ 集客支援サービス)。
 */
export const ownedMedia = {
  lead: "検索とAI検索の両方から選ばれるサイトへ。既存サイトの改善から、記事制作・情報設計・アクセス分析まで一括して支援します。",
  price: "個別お見積り",
  /** 支援内容 */
  scope: [
    "サイト構成・問い合わせ導線の改善",
    "SEOキーワード設計・記事制作",
    "実績・FAQなど信頼情報の追加",
    "AIに理解・引用されやすい情報整理",
    "GA4・Search Consoleによる分析・改善",
  ],
  /** 広告との違い */
  why: {
    title: "なぜオウンドメディアでリードが獲れるのか",
    // 青いカード上に置くため、マーカー (==) ではなく強調 (**) だけを使う
    body: "広告は止めた瞬間に流入もゼロになりますが、記事は公開した分だけ積み上がる**24時間働く営業資産**です。検索とAIの回答が毎日見込み客を連れてきて、売り込みではなく「役立つ情報」で信頼をつくってから問い合わせに至るため、**広告より質の高いリードが、広告費なしで増え続けます**。",
  },
  /** リード獲得までの4段階 */
  steps: [
    { title: "記事が疑問に答える", body: "月60本が見込み客の検索・質問を受け止める" },
    { title: "検索とAIで見つかる", body: "上位表示 + AI回答への引用 (AIO/LLMO) で接点を最大化" },
    { title: "診断・LPで検討が進む", body: "無料診断とLPが「相談したい」に育てる" },
    { title: "問い合わせが届く", body: "レポートで検証・改善し、獲得数を伸ばし続ける" },
  ],
  /** 記事本数などの実数 */
  facts: [
    { value: "60", suffix: "本/月", label: "記事投稿数", note: "毎日2本・品質審査つき" },
    { value: "1", suffix: "日", label: "月次レポート提出日", note: "毎月1日・PDF" },
    { value: "0", suffix: "円", label: "現状分析レポート", note: "契約前の費用は発生しません" },
  ],
} as const;

/** 料金プラン */
export const plans: {
  name: string;
  price: string;
  unit: string;
  body: string;
  term: string;
  featured?: boolean;
}[] = [
  {
    name: "AIOサイト診断",
    price: "無料",
    unit: "0円",
    body: "約30項目の診断 + 優先順位付き改善リスト + 報告会1回",
    term: "単発 (納期2週間)",
  },
  {
    name: "AIOコンサルティング",
    price: "15",
    unit: "万円〜/月 (税別)",
    body: "診断 + 被引用設計・実装 + 月次レポートと改善",
    term: "6ヶ月〜推奨",
    featured: true,
  },
  {
    name: "コンテンツ制作 追加",
    price: "個別",
    unit: "見積り",
    body: "一次情報・FAQ記事の代行制作",
    term: "都度",
  },
];

/** ゼロクリック検索の背景データ */
export const zeroClick = {
  rate: 58.5,
  source: "SparkToro調査 (米国)",
  note: "検索の58.5%がクリックされずに終わる時代。AIの回答内に登場できるかどうかが、露出を分けます。",
};

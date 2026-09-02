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
 * AIO運用代行の2つの入り口。どちらもAIO運用代行に含まれる。
 * 「今あるサイトを直す」のか「記事で流入をつくる」のかで、着手する場所が変わる。
 * 出典: ai.7senses.co.jp/lp/ (AI集客ラボ 集客支援サービス)。
 */
export const approaches: {
  key: string;
  name: string;
  en: string;
  role: string;
  catch: string;
  lead: string;
  forWhom: string;
  scope: string[];
  price: string;
  bonus?: string;
}[] = [
  {
    key: "owned-media",
    name: "オウンドメディア+LP運用",
    en: "Build",
    role: "記事を積み上げて、流入そのものをつくる",
    catch: "広告費に頼らない流入を、記事で積み上げる。",
    lead: "記事制作からレポート・改善まで、集客の仕組みを丸ごとお任せいただくプランです。社内の作業はほぼゼロで、資産型の集客が積み上がります。",
    forWhom: "広告を止めると、流入も止まってしまう",
    scope: [
      "オウンドメディア+LPの構築・運用一式",
      "サイト構成・問い合わせ導線の改善",
      "SEOキーワード設計・記事制作",
      "検索データ分析によるKW選定 (AI検索で引用されやすいコンテンツタイプまで分析)",
      "対策記事を月60本投稿 (毎日2本・品質審査つき)",
      "Python製の自動化エンジンによる記事生成・品質審査・公開",
      "Google Apps Scriptによるフォーム受信・通知・記録の自動化",
      "実績・FAQなど信頼情報の追加",
      "AIに理解・引用されやすい情報整理",
      "GA4・Search Consoleによる分析・改善",
      "月次コンサルレポート (毎月1日・PDF)",
      "レポートにもとづくサイト改善の実装まで",
    ],
    price: "個別お見積り",
    bonus: "MEOスタンダードが無料で付帯",
  },
  {
    key: "seo-aio",
    name: "SEO+AIO運用",
    en: "Improve",
    role: "今あるサイトを、選ばれる状態に直す",
    catch: "検索とAI検索の両方から選ばれるサイトへ。",
    lead: "既存サイトの改善から、記事制作・情報設計・アクセス分析まで一括して支援します。",
    forWhom: "サイトはあるのに、問い合わせが増えない",
    scope: [
      "サイト構成・問い合わせ導線の改善",
      "SEOキーワード設計・記事制作",
      "検索データ分析によるKW選定 (AI検索で引用されやすいコンテンツタイプまで分析)",
      "実績・FAQなど信頼情報の追加",
      "AIに理解・引用されやすい情報整理",
      "GA4・Search Consoleによる分析・改善",
      "月次コンサルレポート (毎月1日・PDF)",
    ],
    price: "個別お見積り",
  },
];

/** オウンドメディア運用の考え方と、リードが届くまでの流れ */
export const ownedMedia = {
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

/**
 * 運用で使うツール。
 * 出典: ai.7senses.co.jp/lp/ および ai.7senses.co.jp (AI集客ラボ)。
 */
export const tools: { name: string; role: string; detail: string }[] = [
  {
    name: "Google Analytics 4",
    role: "流入と行動の計測",
    detail: "AI経由と推定される流入から問い合わせまでの動きを追い、施策ごとの寄与を確認します。",
  },
  {
    name: "Google Search Console",
    role: "AI検索での表示の計測",
    detail: "生成AIレポートで、AI Overview経由の表示回数・クリックを実測します。検索順位の把握もここで行います。",
  },
  {
    name: "Googleビジネスプロフィール",
    role: "マップ集客の運用",
    detail: "NAP情報 (店名・住所・電話) の統一、口コミ返信、最新情報の投稿を実施します。",
  },
];

/**
 * 運用を回すために自社で組んでいる仕組み。
 * 手作業では月60本の記事投稿と品質担保が成立しないため、自動化を前提にしている。
 */
export const automation: { name: string; role: string; detail: string }[] = [
  {
    name: "Python",
    role: "記事の生成・品質審査・公開",
    detail:
      "キーワード設計から本文生成、品質審査、公開までを自動化エンジンとして自社開発しています。審査を通らなかった記事は公開されません。人が書く速度では届かない本数を、品質を落とさずに出し続けるための土台です。",
  },
  {
    name: "Google Apps Script",
    role: "フォーム受信・通知・記録の自動化",
    detail:
      "問い合わせの受信、担当者への通知、スプレッドシートへの記録を自動で処理します。サーバーを持たずに動くため、月額費用をかけずに運用でき、複数サイトの窓口を一つにまとめられます。",
  },
];

/** 引用状況を定点観測する対象 */
export const monitored: string[] = ["AI Overview", "ChatGPT", "Perplexity", "Gemini"];

/** 自社で開発・公開している無料診断ツール */
export const diagnostics: {
  name: string;
  spec: string;
  body: string;
  href: string;
}[] = [
  {
    name: "MEO診断",
    spec: "30秒・8問",
    body: "Googleマップ集客の整備度を100点満点で採点。マップの3枠に入るために足りないものがわかります。",
    href: "https://ai.7senses.co.jp/diagnosis/meo/",
  },
  {
    name: "AIO診断",
    spec: "30秒・8問",
    body: "AI検索 (AI Overview・ChatGPT) への対応度を100点満点で採点。AIに引用されるために足りないものがわかります。",
    href: "https://ai.7senses.co.jp/diagnosis/aio/",
  },
  {
    name: "サイト無料採点",
    spec: "URL入力だけ",
    body: "サイトの技術対応を12項目・100点満点で自動採点。AIクローラー許可や構造化データまでチェックします。",
    href: "https://ai.7senses.co.jp/site-audit/",
  },
];

/**
 * 料金プラン。金額は AI集客ラボ の集客支援サービス (ai.7senses.co.jp/lp/) に合わせています。
 * 一律料金にしていないのは、課題も商圏も違うため。無料の現状分析の結果をもとに見積もります。
 */
export const plans: {
  name: string;
  price: string;
  unit: string;
  body: string;
  term?: string;
  bonus?: string;
  featured?: boolean;
}[] = [
  {
    name: "AIOサイト診断",
    price: "無料",
    unit: "0円",
    body: "診断結果 + 優先順位をつけた改善リスト + 報告会1回。契約前に費用は発生しません。",
    term: "単発",
  },
  {
    name: "SEO+AIO運用",
    price: "個別",
    unit: "お見積り",
    body: "検索とAI検索の両方から見つかる状態へ。記事制作・構造化・計測レポートまで。",
  },
  {
    name: "おまかせパック",
    price: "個別",
    unit: "お見積り",
    body: "オウンドメディア+LPの構築・運用一式、記事60本/月、月次コンサルレポート、レポートにもとづくサイト改善の実装まで。",
    bonus: "MEOスタンダードが無料で付帯",
    featured: true,
  },
];

/** ゼロクリック検索の背景データ */
export const zeroClick = {
  rate: 58.5,
  source: "SparkToro調査 (米国)",
  note: "検索の58.5%がクリックされずに終わる時代。AIの回答内に登場できるかどうかが、露出を分けます。",
};

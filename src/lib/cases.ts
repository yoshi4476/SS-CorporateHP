// 導入事例。数値はいずれも実績値。
export type CaseStudy = {
  industry: string;
  service: string;
  slug: string;
  headline: string;
  before: string;
  after: string;
  metric: { value: string; suffix: string; label: string };
  /** お客様の声。ご本人が書いたか、内容を確認して掲載を許可したものだけを入れる（ステルスマーケティング規制） */
  voice?: string;
  body: string;
};

export const cases: CaseStudy[] = [
  {
    industry: "士業事務所",
    service: "AIO運用代行",
    slug: "aio",
    headline: "ChatGPT経由の相談が、0件から月4件に。",
    before: "AI検索での言及ゼロ",
    after: "AI経由 月4件の相談",
    metric: { value: "4", suffix: "件/月", label: "AI経由の新規相談" },
    body: "構造化データとllms.txtを実装し、専門領域の一次情報コンテンツを整備。AIが引用しやすい「結論を冒頭で断言する」構成に全記事を作り替えたことで、主要AIサービスでの被引用が発生し、そこからの新規相談につながりました。",
  },
  {
    industry: "リフォーム業",
    service: "MEO運用代行",
    slug: "meo",
    headline: "マップ経由の問い合わせが、月2件から月11件へ。",
    before: "月2件の問い合わせ",
    after: "月11件 (5.5倍)",
    metric: { value: "5.5", suffix: "倍", label: "マップ経由 問い合わせ数" },
    body: "商圏の競合状況を調査したうえでビジネスプロフィールを最適化。写真・投稿・口コミ返信をAIと専任スタッフのハイブリッドで高頻度に運用し、マップ経由のアクションを継続的に伸ばしました。",
  },
  {
    industry: "製造業",
    service: "AI導入補助金ベンダー",
    slug: "ai-subsidy",
    headline: "受発注・会計ソフトの導入に、350万円枠を活用。",
    before: "制度が複雑で断念していた",
    after: "受発注+会計ソフト導入 (350万円枠)",
    metric: { value: "350", suffix: "万円", label: "受発注・会計ソフトの補助上限" },
    body: "受発注ソフトと会計ソフトを対象とする350万円枠での申請に向けて、公募要領の読み込みと事業計画の整理を助言しました（申請書類はお客様が作成し、当社は内容の確認と助言を担当）。採択後のソフト導入・実績報告までベンダーとして一貫して伴走しました。",
  },
];

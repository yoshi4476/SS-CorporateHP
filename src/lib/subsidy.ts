// AI導入補助金 (IT導入補助金) の詳細データ。
// 出典: lp.7senses.co.jp (2026年7月時点の情報)。制度改定時は要更新。

export const subsidy = {
  fiscalYear: "令和8年度",
  asOf: "2026年7月時点",
  max: 350,
  modelCase: { total: 550, grant: 350, burden: 200 },
};

/** 応募要項: 対象になる事業者の4条件 */
export const eligibility: { label: string; detail: string }[] = [
  {
    label: "売上",
    detail: "法人は3,300万円以上 / 個人事業主は3,900万円以上",
  },
  {
    label: "納税",
    detail: "税金の滞納がないこと",
  },
  {
    label: "決算",
    detail: "決算を2期終えていること",
  },
  {
    label: "申請歴",
    detail: "直近4年以内にIT導入補助金の採択・交付を受けていないこと",
  },
];

/** 4フェーズのスキーム */
export const scheme: {
  step: string;
  title: string;
  period: string;
  body: string;
  client: string;
}[] = [
  {
    step: "01",
    title: "無料相談・適合確認",
    period: "Zoom 30分",
    body: "応募要項の4条件 (売上・納税・申請歴・決算期) への適合をその場で確認します。合わない場合は正直にお伝えします。",
    client: "Zoom 30分",
  },
  {
    step: "02",
    title: "準備・電子申請",
    period: "書類準備 + Zoom 1時間",
    body: "書類準備はチェックリストで並走。GビズID取得から電子申請まで、当社スタッフが1時間のZoomで同席します。",
    client: "書類集め + Zoom 1時間",
  },
  {
    step: "03",
    title: "採択・導入",
    period: "申請から約1ヶ月で合格発表",
    body: "合格発表後、契約・お支払いを経てシステムを納品。導入後の運用支援まで続けて対応します。",
    client: "ツール代金の一括前払い",
  },
  {
    step: "04",
    title: "実績報告・着金",
    period: "申請から通算 約2〜3ヶ月",
    body: "実績報告書の提出まで当社が伴走。事務局の承認後、補助金が貴社口座へ着金します (精算払い)。",
    client: "実績書類の提出",
  },
];

/** お金の流れ (クライアント視点) */
export const cashflow: { phase: string; flow: string; amount: string }[] = [
  { phase: "① 申請", flow: "貴社 → 国 (GビズIDで電子申請・国が審査)", amount: "0円" },
  {
    phase: "② 採択後の支払い",
    flow: "貴社 → 当社 (ツール代金の一括前払い・納品と運用開始)",
    amount: "550万円",
  },
  { phase: "③ 実績報告", flow: "貴社 → 国 (利用実績・経費の証拠書類を提出し補助額確定)", amount: "—" },
  { phase: "④ 補助金の着金", flow: "国 → 貴社口座 (精算払い・後払い)", amount: "最大350万円" },
];

// 写真の枠（2026-11-12 運用者「写真は減らさないで。前みたいに複数」）。
// 前回の直しで外した写真の場所に枠だけを置いておき、public/images/slots/<name>.webp を置いてビルドすると出る。
// ファイルが無い間は枠ごと出さない（空の枠は読み込み途中に見えるため）。古い写真（case-*.webp・scene-*.webp など）は
// 審査で落ちた作り方なので、同じ名前を使わず新しい名前にしている。
// ratio は枠の縦横比（横:縦）。写真はこの比で作る（切り抜きは中央）。

export type PhotoSlotDef = { ratio: string; place: string; alt: string };

export const PHOTO_SLOTS = {
  // トップ: 事業（主役の2つは大きく、ほかは小さく）
  "svc-keiri-bpo": { ratio: "16/9", place: "トップの事業・経理BPOのカードの上", alt: "経理の担当者が、届いた書類を処理している様子（イメージ）" },
  "svc-aio": { ratio: "16/9", place: "トップの事業・集客のカードの上（左）", alt: "AIの答えに自社の名前が出たのを確かめる店主（イメージ）" },
  "svc-meo": { ratio: "16/9", place: "トップの事業・集客のカードの上（右）", alt: "Googleマップを見て来た客を、店先で迎える店主（イメージ）" },
  "svc-ai-consulting": { ratio: "3/2", place: "トップの事業・そのほかの事業", alt: "現場の担当者に、AIの使い方を説明する様子（イメージ）" },
  "svc-web-production": { ratio: "3/2", place: "トップの事業・そのほかの事業", alt: "できあがったホームページを、スマートフォンで確かめる経営者（イメージ）" },
  "svc-system-development": { ratio: "3/2", place: "トップの事業・そのほかの事業", alt: "業務システムの画面で、受注を入力する担当者（イメージ）" },
  "svc-ai-subsidy": { ratio: "3/2", place: "トップの事業・そのほかの事業", alt: "補助金で入れた会計ソフトを、自分の事務所で使う経営者（イメージ）" },
  // トップ: 事例・進め方・補助金・セルフチェック
  "case-shigyou": { ratio: "16/9", place: "トップの事例・士業事務所のカードの上", alt: "士業事務所の現場のイメージ" },
  "case-reform": { ratio: "16/9", place: "トップの事例・リフォーム業のカードの上", alt: "リフォーム業の現場のイメージ" },
  "case-seizou": { ratio: "16/9", place: "トップの事例・製造業のカードの上", alt: "製造業の現場のイメージ" },
  "top-process": { ratio: "4/3", place: "トップの進め方の見出しの右", alt: "無料相談で、いまの状況を伺う担当者（イメージ）" },
  "top-subsidy": { ratio: "4/3", place: "トップの補助金の帯の右", alt: "補助金で入れた道具を、現場で使う経営者（イメージ）" },
  "top-selfcheck": { ratio: "4/3", place: "トップのセルフチェックの左（パソコンのみ）", alt: "事務所で、セルフチェックの結果を確かめる人（イメージ）" },
  // 経理BPO: 写真の帯2本
  "keiri-band-1": { ratio: "3/1", place: "経理BPOの「用途」と「比較」の間の帯", alt: "経理BPOを裏で支える仕事のイメージ" },
  "keiri-band-2": { ratio: "3/1", place: "経理BPOの「調査」と「費用の目安」の間の帯", alt: "経理の仕事が順に流れていく様子のイメージ" },
} satisfies Record<string, PhotoSlotDef>;

export type PhotoSlotName = keyof typeof PHOTO_SLOTS;

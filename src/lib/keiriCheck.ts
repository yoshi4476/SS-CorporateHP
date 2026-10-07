/**
 * 経理のセルフチェック（/tools/keiri-check）の問いと結果。
 *
 * 記事の読者の次の一歩が問い合わせしか無く、記事上のCTAは2期間とも0件だった（2026-10-05）。
 * その場で終わる5問を挟む。問いと根拠の言葉は、経理BPOの事業ページ（services.ts の useCase・
 * industries・insights・faq）と主題ページ（themes.ts）に書いてある判断軸だけから作る。
 * 新しい主張・数字・料金・効果の約束をここで足さない。
 *
 * クライアントでも読むため、node:fs を使うモジュール（blog.ts など）を import しない。
 */

export const TOOL_ID = "keiri-check";

export type Question = {
  id: string;
  q: string;
  /** 「はい」の意味が取りにくい問いの補足 */
  note?: string;
  /** 「はい」と答えたときに結果に出す根拠 */
  ifYes: string;
};

export const QUESTIONS: Question[] = [
  {
    id: "one-person",
    q: "経理の作業が、1人の担当者（または兼任の人）に集まっていますか？",
    ifYes: "経理が1人に集まっている間は問題が見えませんが、その人が休んだ月に締めが止まります。",
  },
  {
    id: "hiring",
    q: "求人を出しても人が来ない、または担当者が辞めたら経理が回らなくなりそうですか？",
    ifYes: "人を採る以外の手が要る状態です。採れたとしても、引き継ぎで止まることがあります。",
  },
  {
    id: "volume",
    q: "経理の仕事量は、専任の人を1人置くほどではありませんか？",
    ifYes: "1人分の仕事量に満たない業務は、人を置くより、外に出せる範囲を切り出したほうが早く片づきます。",
  },
  {
    id: "routine",
    q: "経理の作業の多くは、記帳・請求書の発行・支払データの作成・給与計算のように、手順が決まっていますか？",
    note: "与信・値引き・資金繰りのように、社内の事情を知らないと決められない判断が少ないなら「はい」です。",
    ifYes: "手順が決まっている作業は外で回せます。社内の事情が要る判断（与信・値引き・資金繰り）は社内に残します。",
  },
  {
    id: "law",
    q: "インボイス制度や電子帳簿保存法に沿った運用に、手が回っていないところがありますか？",
    ifYes: "電子で受け取った請求書を電子のまま保存できているか、支払前に登録番号を確かめる手順があるか。運用の抜けを洗い出すところから始められます。",
  },
];

export type ResultKey = "wide" | "part" | "inhouse";

export type Result = { key: ResultKey; title: string; body: string };

export const RESULTS: Record<ResultKey, Result> = {
  wide: {
    key: "wide",
    title: "外に出せる範囲が大きい",
    body: "人を採る以外の手が要る状態に、多くあてはまりました。記帳・請求・支払のように手順が決まっている作業から外に出し、社内の事情が要る判断だけを社内に残す形が考えられます。どこまで任せるかは会社ごとに違うため、まず誰が何に時間を使っているかを書き出すところから始めてください。",
  },
  part: {
    key: "part",
    title: "一部を切り出すと楽になる",
    body: "すべてを外に出す段階ではありませんが、負担が偏っているところがあります。全部を一度に任せると、判断が要る業務まで外に出て止まります。記帳だけ、請求書の発行だけのように、手順が決まっている作業を1つ切り出すところから考えられます。",
  },
  inhouse: {
    key: "inhouse",
    title: "今は社内で回せている",
    body: "いまは社内で回せている状態です。ただ、担当が1人に集まると、その人が休んだ月に締めが止まります。業務フローとマニュアルで仕事を見える形にしておくと、人が代わっても進め方が変わりません。",
  },
};

/** 「はい」の数で分ける。5問すべて同じ重みで、どれか1問で決まらないようにする */
export function resultOf(yes: number): ResultKey {
  if (yes >= 4) return "wide";
  if (yes >= 2) return "part";
  return "inhouse";
}

/** 結果ごとに次に読む記事（スラッグ）と主題ページ。実在しないものはページ側で外す */
export const NEXT_READS: Record<ResultKey, { posts: string[]; theme: string }> = {
  wide: {
    posts: ["keiri-gaichuu-handan-kijun", "keiri-marunage-dekiru-hani", "keiri-gaichuu-hikitsugi"],
    theme: "keiri-bpo",
  },
  part: {
    posts: ["kichodaiko-toha", "keiri-naisei-gaichuu-hikaku", "keiri-zokujinka-kaisho"],
    theme: "kicho",
  },
  inhouse: {
    posts: ["keiri-gyomu-flow-minaoshi", "keiri-manual-tsukurikata", "keiri-zokujinka-kaisho"],
    theme: "zokujin",
  },
};

/** 法対応に「はい」と答えた人には、結果の段階に関係なく法対応の記事も出す */
export const LAW_READ = "invoice-keiri-futan-keigen";

export type ReadLink = { href: string; title: string };

/** 来たページのパス（トップ・事業ページ・記事）。それ以外の値は計測に混ぜない */
export function fromPath(search: string): string {
  const v = new URLSearchParams(search).get("from") ?? "";
  return /^\/(?:(?:blog|services)\/[a-z0-9-]+)?$/.test(v) ? v : "";
}

/** 入口（InlineToolBox）で先に答えた1問目。?q1=1 / ?q1=0 */
export function firstAnswer(search: string): boolean | undefined {
  const v = new URLSearchParams(search).get("q1");
  return v === "1" ? true : v === "0" ? false : undefined;
}

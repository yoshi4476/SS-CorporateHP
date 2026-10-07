// URLを入れるだけのAIO診断。送るとAI集客ラボのLPが開き、その場で14項目を採点する。
// 以前は「申し込む」→問い合わせフォームで、結果を見る前に名前とメールを求めていたため
// 試す人がいなかった。先に結果を見せ、直し方を受け取るところで連絡先を聞く（LP側の流れ）。
// src はLPの問い合わせ記録に残り、コーポレートのどの場所から来たリードかを分ける。

const LP = "https://ai.7senses.co.jp/lp/";

export default function AioScan({ src, dark = false }: { src: string; dark?: boolean }) {
  return (
    <form action={LP} method="get" data-scan={src} className="w-full">
      <input type="hidden" name="src" value={src} />
      <label className={`block text-xs font-bold ${dark ? "text-white/80" : "text-ink"}`}>
        ホームページのURL
        <span className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            type="url"
            name="check"
            required
            inputMode="url"
            autoComplete="url"
            placeholder="https://example.co.jp"
            className={`min-w-0 flex-1 rounded-full border px-5 py-4 text-sm font-medium outline-none transition-colors focus:border-pulse ${
              dark ? "border-white/25 bg-white text-ink" : "border-line-strong bg-white text-ink"
            }`}
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-pulse px-7 py-4 text-sm font-bold text-white shadow-glow transition-transform hover:-translate-y-0.5"
          >
            30秒で無料診断する
          </button>
        </span>
      </label>
      <p className={`mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs ${dark ? "text-white/55" : "text-slate"}`}>
        <span>✓ 入力はURLだけ</span>
        <span>✓ 登録不要・その場で14項目を採点</span>
        <span>✓ 営業電話なし</span>
      </p>
    </form>
  );
}

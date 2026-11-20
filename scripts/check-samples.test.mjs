// check-samples.mjs の判定が、見られない見本を見逃さず、見られる見本を止めないかを確かめる。
//   node check-samples.test.mjs
process.env.CHECK_SAMPLES_NO_MAIN = "1";
const { judgeSample, missingLinks, NAMES } = await import("./check-samples.mjs");

let fails = 0;
const check = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) fails++;
  console.log(`${ok ? "OK" : "NG"}  ${name}${ok ? "" : `（得た ${JSON.stringify(got)} / 期待 ${JSON.stringify(want)}）`}`);
};
const page = '<meta name="robots" content="noindex,nofollow"><p>見本';
const h = (o = {}) => new Headers(o);
check("見られる見本は通す", judgeSample(200, h(), page), []);
check("404 は止める", judgeSample(404, h(), "").length > 0, true);
check("CSP が付いていたら止める", judgeSample(200, h({ "Content-Security-Policy": "default-src 'self'" }), page).length, 1);
check("別のページ（トップへの転送など）が返ったら止める", judgeSample(200, h(), "<title>トップ</title>").length, 1);
const all = NAMES.map((n) => `<a href="/samples/${n}/">`).join("");
check("7件のリンクがそろっていれば通す", missingLinks(all), []);
check("リンクが1件欠けたら、その名前を出す", missingLinks(all.replace('/samples/kaitori/', "/x/")), ["kaitori"]);
check("絶対の URL のリンクも数える", missingLinks(NAMES.map((n) => `https://a.jp/samples/${n}/`).join(" ")), []);
process.exit(fails ? 1 : 0);

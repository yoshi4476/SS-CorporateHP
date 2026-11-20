(() => {
  // ---- 4つの査定プラン：2軸図とカードの連動 ----
  const dots = document.querySelectorAll('.axis__dot');
  const cards = document.querySelectorAll('.plan[data-plan]');
  const activate = (key) => {
    dots.forEach((d) => d.classList.toggle('is-active', d.dataset.plan === key));
    cards.forEach((c) => c.classList.toggle('is-active', c.dataset.plan === key));
  };
  dots.forEach((d) => {
    d.addEventListener('mouseenter', () => activate(d.dataset.plan));
    d.addEventListener('focus', () => activate(d.dataset.plan));
    d.addEventListener('click', () => {
      activate(d.dataset.plan);
      document.querySelector(`.plan[data-plan="${d.dataset.plan}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });
  cards.forEach((c) => c.addEventListener('mouseenter', () => activate(c.dataset.plan)));

  // ---- 重点5市マップ ----
  // 出典：国土交通省「地価公示」2026年 住宅地の中央値（国土数値情報）。5年前比は各年の中央値どうしの比較
  const CITIES = {
    anjo: { name: '安城市', median: 169500, n: 22, five: 20.2, url: 'area/aichi/anjo/index.html' },
    kariya: { name: '刈谷市', median: 181500, n: 28, five: 21.8, url: 'area/aichi/kariya/index.html' },
    chiryu: { name: '知立市', median: 146000, n: 13, five: 25.9, url: 'area/aichi/chiryu/index.html' },
    takahama: { name: '高浜市', median: 88600, n: 12, five: 15.5, url: 'area/aichi/takahama/index.html' },
    hekinan: { name: '碧南市', median: 75900, n: 19, five: 5.6, url: 'area/aichi/hekinan/index.html' },
  };
  const panel = document.getElementById('map-panel');
  const tabs = document.querySelectorAll('.map-tabs button');
  const shapes = document.querySelectorAll('.mikawa-map .city');
  const showCity = (key) => {
    const c = CITIES[key];
    if (!c || !panel) return;
    shapes.forEach((s) => s.classList.toggle('is-active', s.dataset.city === key));
    document.querySelectorAll('.mikawa-map text').forEach((t) => t.classList.toggle('is-active', t.dataset.city === key));
    tabs.forEach((t) => t.setAttribute('aria-pressed', String(t.dataset.city === key)));
    panel.innerHTML = `
      <p class="eyebrow">AREA</p>
      <h3>${c.name}の不動産売却</h3>
      <dl>
        <dt>住宅地の地価（中央値）</dt><dd>1㎡ ${c.median.toLocaleString('ja-JP')}円</dd>
        <dt>坪あたり</dt><dd>約${Math.round(c.median * 3.30578 / 10000)}万円</dd>
        <dt>5年前と比べて</dt><dd>${c.five > 0 ? '+' : ''}${c.five}%</dd>
        <dt>調査地点</dt><dd>${c.n}地点</dd>
      </dl>
      <p class="note">出典：国土交通省「地価公示」2026年 住宅地（国土数値情報）</p>
      <a class="btn btn--ghost btn--block" href="${c.url}">${c.name}の相場と事例を見る</a>
      <a class="btn btn--cta btn--block" style="margin-top:10px" href="satei/web/index.html?addr=${encodeURIComponent(c.name)}&type=house">${c.name}の物件をWeb査定</a>`;
  };
  shapes.forEach((s) => {
    s.addEventListener('click', () => showCity(s.dataset.city));
    s.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showCity(s.dataset.city); } });
  });
  tabs.forEach((t) => t.addEventListener('click', () => showCity(t.dataset.city)));
  showCity('anjo');

  // ---- 訳アリ物件 売却方法診断 ----
  const diag = document.getElementById('diag');
  if (diag) {
    const Q = [
      { q: 'どんな物件ですか？', a: [['一戸建て', 0], ['土地・空き地', 0], ['連棟・長屋', 2], ['マンション', 0]] },
      { q: '建物の状態は？', a: [['住める状態', 0], ['雨漏り・シロアリがある', 2], ['長く空き家で傷んでいる', 2], ['建物はない', 0]] },
      { q: '法律・権利で気になることは？', a: [['特にない', 0], ['再建築不可と言われた', 3], ['共有名義・相続でもめている', 3], ['分からない', 1]] },
      { q: 'いつまでに売りたいですか？', a: [['すぐに現金化したい', 4], ['3か月以内', 1], ['高く売れるなら急がない', -2], ['まだ決めていない', 0]] },
    ];
    const RESULTS = {
      kaitori: { title: '「買取」がおすすめです', body: '不動産会社が直接買い取る方法です。<span class="marker">最短で即日の現金化も可能</span>で、傷みや残置物があってもそのままで大丈夫です。', plan: 'sokkin', planName: '即金査定' },
      hosho: { title: '「買取保証付き仲介」がおすすめです', body: 'まずは一般の買主さんに向けて売り出し、期限までに売れなければ買い取ります。<span class="marker">高く売るチャンスと、確実に売れる安心の両方</span>が得られます。', plan: 'iitoko', planName: 'いいとこ取り査定' },
      chukai: { title: '「仲介」で高値を目指せます', body: '時間をかけて広く買主を探す方法です。<span class="marker">相場より高く売れる可能性</span>があります。囲い込みはせず、定期報告書で進み具合をお知らせします。', plan: 'challenge', planName: 'チャレンジ査定' },
    };
    let step = 0; let score = 0; const history = [];
    const bar = diag.querySelector('.diag__progress i');
    const body = diag.querySelector('.diag__body');
    const draw = () => {
      bar.style.width = `${(step / Q.length) * 100}%`;
      if (step < Q.length) {
        const cur = Q[step];
        body.innerHTML = `<p class="diag__q" id="dq">Q${step + 1}. ${cur.q}</p>
          <div class="diag__opts" role="group" aria-labelledby="dq">${cur.a.map(([t, s]) => `<button type="button" data-s="${s}">${t}</button>`).join('')}</div>
          ${step ? '<button type="button" class="diag__back">← 1つ前に戻る</button>' : ''}`;
        body.querySelectorAll('[data-s]').forEach((b) => b.addEventListener('click', () => { history.push(+b.dataset.s); score += +b.dataset.s; step++; draw(); }));
        body.querySelector('.diag__back')?.addEventListener('click', () => { score -= history.pop(); step--; draw(); });
        body.querySelector('[data-s]').focus({ preventScroll: true });
      } else {
        const r = score >= 6 ? RESULTS.kaitori : score >= 2 ? RESULTS.hosho : RESULTS.chukai;
        body.innerHTML = `<div class="diag__result" tabindex="-1">
          <p class="eyebrow">診断結果</p><h4>${r.title}</h4><p>${r.body}</p>
          <p class="note">※かんたんな目安です。実際は物件を確認してご提案します。</p>
          <a class="btn btn--cta btn--block" href="satei/index.html?plan=${r.plan}#form">${r.planName}で無料相談する<span class="arrow" aria-hidden="true">→</span></a></div>
          <button type="button" class="diag__back">もう一度診断する</button>`;
        body.querySelector('.diag__result').focus({ preventScroll: true });
        body.querySelector('.diag__back').addEventListener('click', () => { step = 0; score = 0; history.length = 0; draw(); });
      }
    };
    draw();
  }
})();

const SKT_L = (() => {
  const lang = document.documentElement.lang || 'ja';
  const T = {
    ja: { now: (t) => `（日本時間 ${t} 現在）`, yen: (n) => `${Math.round(n).toLocaleString('ja-JP')}円`, man: (v) => `${(v / 10000).toLocaleString('ja-JP', { maximumFractionDigits: 1 })}万円`, few: (n) => `該当 ${n}件：実績が少ないため参考値を表示できません。条件を広げるか、店舗の無料査定で確認してください。`, hit: (n, a, b, m) => `該当 ${n}件：${a}〜${b}（中央値 ${m}）`, median: '買取中央値', retail: '国内定価', range: '幅', mid: '中央値', rate: '買取率', gold: '金（円/g）', pt: 'プラチナ（円/g）', cnt: (n) => `（${n}件）`, rateTip: (v) => `買取率 ${v}%`, play: '映像を再生', pause: '映像を一時停止', loc: 'ja-JP' },
    en: { now: (t) => `(as of ${t} JST)`, yen: (n) => `¥${Math.round(n).toLocaleString('en-US')}`, man: (v) => (v >= 1000000 ? `¥${(v / 1000000).toFixed(2)}M` : `¥${Math.round(v / 1000).toLocaleString('en-US')}K`), few: (n) => `${n} matching records: too few to show a reference range. Try widening the conditions, or ask the shop for a free appraisal.`, hit: (n, a, b, m) => `${n} matching records: ${a} – ${b} (median ${m})`, median: 'Median buying price', retail: 'Japan retail price', range: 'Range', mid: 'Median', rate: 'Buy-to-retail ratio', gold: 'Gold (JPY/g)', pt: 'Platinum (JPY/g)', cnt: (n) => ` (${n} records)`, rateTip: (v) => `Buy-to-retail ratio ${v}%`, play: 'Play video', pause: 'Pause video', loc: 'en-US' },
    'zh-Hans': { now: (t) => `（日本时间 ${t}）`, yen: (n) => `${Math.round(n).toLocaleString('zh-CN')}日元`, man: (v) => `${(v / 10000).toLocaleString('zh-CN', { maximumFractionDigits: 1 })}万日元`, few: (n) => `符合条件 ${n} 件：实例过少，无法显示参考范围。请放宽条件，或到店免费估价。`, hit: (n, a, b, m) => `符合条件 ${n} 件：${a}～${b}（中位数 ${m}）`, median: '回收价中位数', retail: '日本国内定价', range: '价格区间', mid: '中位数', rate: '回收率', gold: '黄金（日元/克）', pt: '铂金（日元/克）', cnt: (n) => `（${n}件）`, rateTip: (v) => `回收率 ${v}%`, play: '播放视频', pause: '暂停视频', loc: 'zh-CN' },
    ko: { now: (t) => `(일본 시간 ${t} 기준)`, yen: (n) => `${Math.round(n).toLocaleString('ko-KR')}엔`, man: (v) => `${(v / 10000).toLocaleString('ko-KR', { maximumFractionDigits: 1 })}만 엔`, few: (n) => `해당 ${n}건: 실적이 적어 참고 범위를 표시할 수 없습니다. 조건을 넓히거나 매장의 무료 감정을 이용해 주십시오.`, hit: (n, a, b, m) => `해당 ${n}건: ${a}~${b} (중앙값 ${m})`, median: '매입가 중앙값', retail: '일본 국내 정가', range: '범위', mid: '중앙값', rate: '매입률', gold: '금(엔/g)', pt: '플래티넘(엔/g)', cnt: (n) => ` (${n}건)`, rateTip: (v) => `매입률 ${v}%`, play: '영상 재생', pause: '영상 일시정지', loc: 'ko-KR' },
  };
  return T[lang] || T.ja;
})();
window.SKT_L = SKT_L;

(() => {
  const cfg = window.SKT || {};

  // ---- ナビ
  const toggle = document.querySelector('.nav-toggle');
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    document.body.classList.toggle('nav-open', !open);
  });

  // ---- 営業中判定（日本時間。0時をまたぐ営業は前日の枠で判定）
  const jstNow = () => {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Tokyo', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
      .formatToParts(new Date()).map((x) => [x.type, x.value]));
    return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday), min: Number(p.hour) * 60 + Number(p.minute), label: `${p.hour}:${p.minute}` };
  };
  const status = (hours) => {
    const { day, min } = jstNow();
    const prev = (day + 6) % 7;
    const open = (hours[day] || []).some(([o, c]) => min >= o && min < c) || (hours[prev] || []).some(([, c]) => c > 1440 && min < c - 1440);
    return open;
  };
  const renderOpen = () => {
    const now = jstNow();
    document.querySelectorAll('[data-now-label]').forEach((el) => { el.textContent = SKT_L.now(now.label); });
    document.querySelectorAll('[data-open-shop]').forEach((el) => {
      const shop = cfg.hours?.[el.dataset.openShop];
      if (!shop) return;
      const open = status(shop.hours);
      el.classList.toggle('is-open', open);
      el.classList.toggle('is-closed', !open);
      const L = { en: ['Open', 'Closed', ' (tentative)'], 'zh-Hans': ['营业中', '已打烊', '（暂定）'], ko: ['영업 중', '영업 종료', ' (잠정)'] }[document.documentElement.lang] || ['営業中', '営業時間外', '（仮）'];
      el.textContent = (open ? L[0] : L[1]) + (shop.confirmed ? '' : L[2]);
    });
    document.querySelectorAll('.hours-chart__row').forEach((r) => r.classList.toggle('is-today', Number(r.dataset.day) === now.day));
    document.querySelectorAll('.hours-chart__track').forEach((t) => t.style.setProperty('--now', `${(now.min / 1440) * 100}%`));
  };
  renderOpen();
  setInterval(renderOpen, 60000);

  // ---- 送客計測：GA4 イベント＋自前カウンタ（sendBeacon で遷移を妨げない）
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-track]');
    if (!a) return;
    const params = { shop: a.dataset.shop, placement: a.dataset.placement, page: cfg.page };
    if (typeof window.gtag === 'function') window.gtag('event', `click_${a.dataset.track}`, params);
    window.dataLayer?.push({ event: `click_${a.dataset.track}`, ...params });
    if (cfg.clickEndpoint && navigator.sendBeacon) {
      const fd = new FormData();
      fd.append('shop', a.dataset.shop);
      fd.append('kind', a.dataset.track);
      navigator.sendBeacon(cfg.clickEndpoint, fd);
    }
  });

  // ---- 相場シミュレーター（表示中の実績表を絞り込み、幅と中央値を再計算）
  const yen = SKT_L.yen;
  document.querySelectorAll('[data-simulator]').forEach((sim) => {
    const table = sim.parentElement.querySelector('[data-records]');
    const out = sim.querySelector('[data-sim-result]');
    const selects = sim.querySelectorAll('[data-filter]');
    const run = () => {
      const f = Object.fromEntries([...selects].map((s) => [s.dataset.filter, s.value]));
      const prices = [];
      table.querySelectorAll('tbody tr').forEach((tr) => {
        const ok = Object.entries(f).every(([k, v]) => !v || tr.dataset[k] === v);
        tr.hidden = !ok;
        if (ok) prices.push(Number(tr.dataset.price));
      });
      prices.sort((a, b) => a - b);
      if (prices.length < 2) {
        out.textContent = SKT_L.few(prices.length);
        return;
      }
      const mid = prices.length % 2 ? prices[(prices.length - 1) / 2] : (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2;
      out.textContent = SKT_L.hit(prices.length, yen(prices[0]), yen(prices.at(-1)), yen(mid));
    };
    selects.forEach((s) => s.addEventListener('change', run));
  });

  // ---- グラフ（表と同じ数値。Chart.js は必要なページだけ読み込み）
  if (!window.Chart) return;
  let css = getComputedStyle(document.documentElement);
  const c = (v) => css.getPropertyValue(v).trim();
  Chart.defaults.font.family = c('--font-sans');
  Chart.defaults.color = c('--muted');
  Chart.defaults.borderColor = c('--line');
  const man = (v) => (v == null ? '—' : SKT_L.man(v));
  const palette = [c('--c1'), c('--c2'), c('--c3'), c('--c4')];

  const builders = {
    trend: (d) => ({
      type: 'line',
      data: {
        labels: d.labels,
        datasets: [
          { label: SKT_L.median, data: d.median, borderColor: c('--c1'), backgroundColor: c('--c1'), tension: 0.3, pointRadius: 3, borderWidth: 2.5 },
          { label: SKT_L.retail, data: d.retail, borderColor: c('--c2'), backgroundColor: c('--c2'), stepped: true, borderDash: [6, 4], pointRadius: 0, borderWidth: 2 },
        ],
      },
      options: { scales: { y: { ticks: { callback: man } } }, plugins: { tooltip: { callbacks: { label: (x) => `${x.dataset.label}: ${man(x.raw)}${x.datasetIndex === 0 ? SKT_L.cnt(d.count[x.dataIndex]) : ''}` } } } },
    }),
    cond: (d) => ({
      type: 'bar',
      data: {
        labels: d.labels,
        datasets: [
          { label: SKT_L.range, data: d.labels.map((_, i) => [d.min[i], d.max[i]]), backgroundColor: c('--c1-soft'), borderRadius: 4, barPercentage: 0.7 },
          { label: SKT_L.mid, data: d.median, type: 'line', showLine: false, pointStyle: 'rectRot', pointRadius: 7, backgroundColor: c('--c1'), borderColor: c('--c1') },
        ],
      },
      options: { scales: { y: { beginAtZero: false, ticks: { callback: man } } }, plugins: { tooltip: { callbacks: { label: (x) => (Array.isArray(x.raw) ? `${SKT_L.range}: ${man(x.raw[0])} – ${man(x.raw[1])}` : `${SKT_L.mid}: ${man(x.raw)}`) } } } },
    }),
    rate: (d) => ({
      type: 'bar',
      data: { labels: d.labels, datasets: [{ label: SKT_L.rate, data: d.rate, backgroundColor: d.rate.map((v) => (v >= 100 ? c('--c1') : c('--c2'))), borderRadius: 4 }] },
      options: { indexAxis: 'y', scales: { x: { suggestedMin: 0, ticks: { callback: (v) => `${v}%` } } }, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (x) => SKT_L.rateTip(x.raw) } } } },
    }),
    metal: (d) => ({
      type: 'line',
      data: { labels: d.labels, datasets: [
        { label: SKT_L.gold, data: d.gold, borderColor: c('--c1'), backgroundColor: c('--c1'), yAxisID: 'y', pointRadius: 0, borderWidth: 2, tension: .3 },
        { label: SKT_L.pt, data: d.platinum, borderColor: c('--c2'), backgroundColor: c('--c2'), yAxisID: 'y1', pointRadius: 0, borderWidth: 2, tension: .3 },
      ] },
      options: { scales: { x: { ticks: { maxTicksLimit: 8 } }, y: { position: 'left', ticks: { callback: (v) => v.toLocaleString(SKT_L.loc) } }, y1: { position: 'right', grid: { drawOnChartArea: false }, ticks: { callback: (v) => v.toLocaleString(SKT_L.loc) } } } },
    }),
    multi: (d) => ({
      type: 'line',
      data: { labels: d.labels, datasets: d.series.map((s, i) => ({ label: s.name, data: s.data, borderColor: palette[i % 4], backgroundColor: palette[i % 4], tension: 0.3, spanGaps: true, pointRadius: 2.5, borderWidth: 2.5 })) },
      options: { scales: { y: { ticks: { callback: man } } }, plugins: { tooltip: { callbacks: { label: (x) => `${x.dataset.label}: ${man(x.raw)}` } } } },
    }),
  };

  // グラフは数点のみのため読み込み直後にまとめて描画（遅延描画だと素早いスクロールで描かれないことがある）
  document.querySelectorAll('canvas[data-chart]').forEach((cv) => {
    {
      css = getComputedStyle(cv);
      const conf = builders[cv.dataset.chart]?.(JSON.parse(cv.dataset.values));
      if (!conf) return;
      // 置かれた場所（黒背景など）の配色に合わせる
      Chart.defaults.color = c('--muted');
      Chart.defaults.borderColor = c('--line');
      conf.options = {
        responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
        ...conf.options,
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, usePointStyle: true } }, ...conf.options.plugins },
      };
      new Chart(cv, conf);
    }
  });
})();

// ---- 広告バナーのスライダー（前後ボタン＋自動送り。操作中・動きを減らす設定では止める）
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-rail]').forEach((rail) => {
    const track = rail.querySelector('[data-rail-track]');
    const step = (dir) => {
      const item = track.querySelector('.bn-rail__item');
      const w = item ? item.getBoundingClientRect().width + 12 : track.clientWidth;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      track.scrollTo({ left: dir > 0 && atEnd ? 0 : track.scrollLeft + dir * w, behavior: reduce ? 'auto' : 'smooth' });
    };
    rail.querySelector('[data-rail-prev]')?.addEventListener('click', () => step(-1));
    rail.querySelector('[data-rail-next]')?.addEventListener('click', () => step(1));
    if (reduce || track.scrollWidth <= track.clientWidth) return;
    let paused = false;
    ['pointerenter', 'focusin', 'touchstart'].forEach((e) => rail.addEventListener(e, () => { paused = true; }, { passive: true }));
    ['pointerleave', 'focusout'].forEach((e) => rail.addEventListener(e, () => { paused = false; }));
    setInterval(() => { if (!paused && !document.hidden) step(1); }, 5000);
  });
})();

// ---- LUX 演出（動きを減らす設定では控えめにする）
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ヘッダーの影
  const header = document.querySelector('.site-header');
  const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ヒーローのスライドショー
  const slides = document.querySelectorAll('.hero__slide');
  if (slides.length > 1 && !reduce) {
    let i = 0;
    setInterval(() => {
      slides[i].classList.remove('is-active');
      i = (i + 1) % slides.length;
      slides[i].classList.add('is-active');
    }, 6000);
  }

  // 金色のきらめき（キャンバス）
  const cv = document.querySelector('.hero__sparkle');
  if (cv && !reduce) {
    const ctx = cv.getContext('2d');
    let w, h, parts;
    const resize = () => {
      const r = cv.getBoundingClientRect();
      w = cv.width = r.width * devicePixelRatio;
      h = cv.height = r.height * devicePixelRatio;
      parts = Array.from({ length: Math.round((r.width * r.height) / 9000) }, () => ({
        x: Math.random() * w, y: Math.random() * h, r: (Math.random() * 1.6 + .4) * devicePixelRatio,
        s: Math.random() * .25 + .05, p: Math.random() * Math.PI * 2,
      }));
    };
    resize();
    window.addEventListener('resize', resize);
    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      for (const q of parts) {
        q.y -= q.s * devicePixelRatio;
        if (q.y < -10) { q.y = h + 10; q.x = Math.random() * w; }
        const a = (Math.sin(t / 700 + q.p) + 1) / 2;
        ctx.globalAlpha = a * .9;
        ctx.fillStyle = '#f3dca6';
        ctx.beginPath();
        ctx.arc(q.x, q.y, q.r, 0, Math.PI * 2);
        ctx.fill();
        if (a > .92) {
          ctx.globalAlpha = (a - .92) * 8;
          ctx.fillRect(q.x - q.r * 4, q.y - .5, q.r * 8, 1);
          ctx.fillRect(q.x - .5, q.y - q.r * 4, 1, q.r * 8);
        }
      }
      if (!document.hidden) requestAnimationFrame(draw); else setTimeout(() => requestAnimationFrame(draw), 500);
    };
    requestAnimationFrame(draw);
  }

  // 数値のカウントアップ・スクロールで現れる表示
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      const el = en.target;
      if (el.dataset.count) {
        const to = Number(el.dataset.count);
        if (reduce) return;
        const t0 = performance.now();
        const tick = (t) => {
          const k = Math.min(1, (t - t0) / 1400);
          el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))).toLocaleString(SKT_L.loc);
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      } else {
        el.classList.add('is-in');
      }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('[data-count], .reveal').forEach((el) => io.observe(el));
})();

// ---- 背景動画（PCのみ読み込み）と YouTube（押してから読み込み）
(() => {
  const v = document.querySelector('.hero__video');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (v && !reduce && window.innerWidth >= 768) {
    v.src = v.dataset.src;
    v.addEventListener('playing', () => v.closest('.hero')?.classList.add('hero--video'), { once: true });
    v.play().catch(() => {});
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-yt]');
    if (!b) return;
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${b.dataset.yt}?autoplay=1&rel=0`;
    f.title = b.getAttribute('aria-label') || 'YouTube';
    f.allow = 'autoplay; encrypted-media; picture-in-picture';
    f.allowFullscreen = true;
    b.replaceWith(f);
  });
})();

// ---- 静的プレビューではフォームを送信しない（WordPress本番環境では通常どおり送信）
document.querySelectorAll('form[data-static]').forEach((f) => {
  f.addEventListener('submit', (e) => {
    e.preventDefault();
    const n = f.querySelector('.cform__static');
    if (n) { n.hidden = false; n.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
  });
});

// ---- 下層ページ：スクロールで現れる演出（トップは atelier.js が担当）
(() => {
  if (document.querySelector('.at') || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const sels = ['.entry > h2', '.entry > .table-wrap', '.entry > figure', '.expert', '.shop-card', '.brand-grid > li', '.brand-gallery__grid > li', '.mag-card', '.souba-cards > li', '.kpis > li', '.chart-box', '.faq__item', '.steps > li', '.guide-cards > li', '.shop-cta', '.author-box', '.bn-rail', '.at-cta'];
  const els = [];
  sels.forEach((s) => document.querySelectorAll(s).forEach((el, k) => {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return; // 最初から見えている要素は隠さない
    el.classList.add('rv'); el.style.setProperty('--i', String(k % 6)); els.push(el);
  }));
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); e.target.classList.add('is-in'); } }), { rootMargin: '0px 0px -6% 0px' });
  els.forEach((el) => io.observe(el));
})();

// ---- LINE の友だち追加 QR コード
window.addEventListener('load', () => {
  if (typeof window.qrcode !== 'function') return;
  document.querySelectorAll('[data-qr]').forEach((el) => {
    const q = window.qrcode(0, 'M');
    q.addData(el.dataset.qr);
    q.make();
    el.innerHTML = q.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
  });
});

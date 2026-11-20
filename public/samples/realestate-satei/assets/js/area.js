// エリアページのグラフ（データは build_area_pages.py がページに埋め込む）
(() => {
  const el = document.getElementById('area-data');
  if (!el || !window.Chart) return;
  const d = JSON.parse(el.textContent);
  const ink = '#7d6530'; const grid = '#ece8df';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const man = (v) => `${(v / 10000).toLocaleString('ja-JP', { maximumFractionDigits: 1 })}万`;
  Chart.defaults.font.family = '"Noto Sans JP", sans-serif';
  Chart.defaults.color = '#5d6674';
  const years = Object.keys(d.trend);
  new Chart(document.getElementById('trend'), {
    type: 'line',
    data: { labels: years, datasets: [{ label: `${d.name} 住宅地の中央値（円/㎡）`, data: years.map((y) => d.trend[y]), borderColor: ink, backgroundColor: ink, tension: 0.25, pointRadius: 2 }] },
    options: { maintainAspectRatio: false, animation: { duration: reduce ? 0 : 900 }, plugins: { legend: { position: 'bottom' } }, scales: { x: { grid: { display: false } }, y: { grid: { color: grid }, ticks: { callback: man } } } },
  });
  const cmp = document.getElementById('compare');
  if (!cmp || !d.compare.length) return;
  new Chart(cmp, {
    type: 'bar',
    data: { labels: d.compare.map(([n]) => n), datasets: [{ label: '住宅地の中央値（円/㎡）', data: d.compare.map(([, v]) => v), backgroundColor: d.compare.map(([n]) => (n === d.self ? ink : '#c9c2b2')), borderRadius: 6, maxBarThickness: 48 }] },
    options: { maintainAspectRatio: false, animation: { duration: reduce ? 0 : 900 }, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => `${c.parsed.y.toLocaleString('ja-JP')}円/㎡` } } }, scales: { x: { grid: { display: false } }, y: { grid: { color: grid }, beginAtZero: true, ticks: { callback: man } } } },
  });
})();

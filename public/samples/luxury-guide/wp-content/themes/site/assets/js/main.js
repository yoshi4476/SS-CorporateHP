(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // メニュー
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('gnav');
  toggle?.addEventListener('click', () => toggle.setAttribute('aria-expanded', String(nav.classList.toggle('is-open'))));

  // スクロール: ヘッダーの影、トップへ戻る
  const head = document.querySelector('.site-head');
  const totop = document.querySelector('.totop');
  const onScroll = () => {
    head?.classList.toggle('is-scrolled', scrollY > 10);
    totop?.classList.toggle('is-show', scrollY > 600);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // 画面に入ったら表示・グラフのアニメーション・数字カウント
  const count = (el) => {
    const end = +el.dataset.count;
    if (reduce || !end) return;
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / 1200);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString('ja-JP');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      e.target.querySelectorAll?.('[data-count]').forEach(count);
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('[data-reveal], [data-anim], .kpi').forEach((el, i) => {
    if (el.matches('[data-reveal]')) el.style.setProperty('--rd', `${(i % 6) * 60}ms`);
    io.observe(el);
  });

  // 絞り込み: 選択を変えたら自動で適用
  document.querySelectorAll('[data-autosubmit]').forEach((f) => {
    f.addEventListener('change', (e) => { if (e.target.name !== 'q') f.requestSubmit(); });
  });

  // 商品写真ギャラリー
  document.querySelectorAll('[data-gallery]').forEach((g) => {
    const main = g.querySelector('[data-main]');
    const fig = g.querySelector('.pd__main');
    g.querySelectorAll('[data-src]').forEach((b) => b.addEventListener('click', () => {
      g.querySelectorAll('[data-src]').forEach((x) => x.removeAttribute('aria-current'));
      b.setAttribute('aria-current', 'true');
      main.style.opacity = 0;
      setTimeout(() => { main.src = b.dataset.src; main.style.opacity = 1; }, 150);
    }));
    main?.addEventListener('click', () => fig.classList.toggle('is-zoom'));
    fig?.addEventListener('mousemove', (e) => {
      if (!fig.classList.contains('is-zoom')) return;
      const r = fig.getBoundingClientRect();
      main.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
    });
  });

  // 紹介アイテムの絞り込み(ブランド × 種類)
  document.querySelectorAll('[data-aff]').forEach((box) => {
    const state = { brand: '', type: '' };
    const rows = [...box.querySelectorAll('tbody tr')];
    const out = box.querySelector('[data-aff-count]');
    box.querySelectorAll('[data-filter]').forEach((group) => group.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      group.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      state[group.dataset.filter] = b.dataset.v;
      let n = 0;
      rows.forEach((r) => {
        const on = (!state.brand || r.dataset.brand === state.brand) && (!state.type || r.dataset.type === state.type);
        r.hidden = !on;
        n += on;
      });
      if (out) out.textContent = n;
    }));
  });

  // URLコピー
  document.querySelectorAll('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); b.textContent = 'コピーしました'; } catch { b.textContent = 'コピーできませんでした'; }
  }));
})();

/* トップ：シネマ風スライドショー・時計・フィルムストリップ・スクロール演出 */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // オープニング：1セッションに1回だけ
  const intro = document.querySelector('[data-intro]');
  let introSeen = false;
  try { introSeen = sessionStorage.getItem('skt_intro') === '1'; sessionStorage.setItem('skt_intro', '1'); } catch (e) {}
  const introMs = intro && !introSeen && !reduce ? 900 : 0;
  if (intro) {
    if (!introMs) intro.classList.add('is-skip');
    else setTimeout(() => intro.classList.add('is-done'), introMs);
  }
  document.documentElement.style.setProperty('--intro', `${introMs}ms`);

  // 見出しを1文字ずつ
  document.querySelectorAll('[data-kin]').forEach((el, line) => {
    const t = el.textContent;
    el.textContent = '';
    [...t].forEach((c, k) => {
      const s = document.createElement('span');
      s.className = 'ch'; s.textContent = c;
      s.style.setProperty('--d', String(k + line * 6));
      s.style.setProperty('--base', `${(introMs + 200) / 1000}s`);
      el.appendChild(s);
    });
  });

  // ヒーローの文字は背景より遅れて動かす（奥行き）
  const copy = document.querySelector('.cine__copy');
  if (copy && !reduce) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => {
        const y = Math.min(Math.max(0, -copy.closest('.cine').getBoundingClientRect().top), 900);
        // 上方向へ抜ける（下の店舗表に重ならない）
        copy.style.transform = `translateY(${-y * 0.18}px)`;
        copy.style.opacity = String(Math.max(0, 1 - y / 520));
        ticking = false;
      });
    }, { passive: true });
  }

  // 現在時刻（日本時間）。コロンだけ静かに明滅させる
  const clock = document.querySelector('[data-clock]');
  const fmt = new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  const tick = () => {
    const [h, m] = fmt.format(new Date()).split(':');
    if (clock) clock.innerHTML = `${h}<span class="colon">:</span>${m}`;
    const kv = document.querySelector('[data-clock-kv]');
    if (kv) kv.innerHTML = `${h}<span class="colon">:</span>${m}`;
  };
  tick();
  setInterval(tick, 15000);

  // ブランドフィルム：画面の向きに合う動画を選ぶ
  const film = document.querySelector('.film');
  if (film) {
    const tall = window.matchMedia('(max-aspect-ratio: 4/5)').matches;
    film.poster = tall ? film.dataset.posterTall : film.dataset.posterWide;
    
    if (reduce) film.removeAttribute('autoplay'); else film.play().catch(() => {});
    const pb = document.querySelector('[data-film-pause]');
    const setState = (paused) => { pb?.setAttribute('aria-pressed', String(paused)); if (pb) { pb.textContent = paused ? '▶' : '❚❚'; pb.setAttribute('aria-label', paused ? (window.SKT_L ? SKT_L.play : '映像を再生') : (window.SKT_L ? SKT_L.pause : '映像を一時停止')); } };
    pb?.addEventListener('click', () => { if (film.paused) { film.play(); setState(false); } else { film.pause(); setState(true); } });
    if (reduce) setState(true);
  }

  // シネマ風スライドショー
  const cine = document.querySelector('[data-cine]');
  if (cine) {
    const slides = [...cine.querySelectorAll('.cine__slide')];
    const dots = [...cine.querySelectorAll('[data-cine-to]')];
    const pauseBtn = cine.querySelector('[data-cine-pause]');
    const DUR = 5500;
    let i = 0;
    let timer = null;
    let paused = reduce;
    cine.style.setProperty('--dur', `${DUR}ms`);
    const play = (s, on) => {
      const v = s.querySelector('video');
      if (!v) return;
      if (on) {
        if (!v.src) v.src = v.dataset.src;
        v.currentTime = 0;
        v.play().catch(() => {});
      } else v.pause();
    };
    const go = (n) => {
      i = (n + slides.length) % slides.length;
      const prev = cine.querySelector('.cine__slide.is-active');
      slides.forEach((s) => s.classList.remove('is-leaving'));
      if (prev && prev !== slides[i]) { prev.classList.remove('is-active'); prev.classList.add('is-leaving'); }
      slides.forEach((s, k) => {
        const on = k === i;
        if (on) { s.classList.remove('is-active'); void s.offsetWidth; s.classList.add('is-active'); }
        play(s, on);
        if (!on && s !== prev) s.classList.remove('is-active');
      });
      dots.forEach((d, k) => {
        d.classList.toggle('is-done', k < i);
        d.classList.remove('is-active');
        if (k === i) { void d.offsetWidth; d.classList.add('is-active'); }
      });
      clearTimeout(timer);
      if (!paused) timer = setTimeout(() => go(i + 1), DUR);
    };
    const setPaused = (p) => {
      paused = p;
      cine.classList.toggle('is-paused', p);
      pauseBtn?.setAttribute('aria-pressed', String(p));
      if (pauseBtn) pauseBtn.textContent = p ? '▶' : '❚❚';
      clearTimeout(timer);
      if (!p) timer = setTimeout(() => go(i + 1), DUR);
    };
    dots.forEach((d) => d.addEventListener('click', () => go(Number(d.dataset.cineTo))));
    pauseBtn?.addEventListener('click', () => setPaused(!paused));
    document.addEventListener('visibilitychange', () => { if (document.hidden) clearTimeout(timer); else if (!paused) timer = setTimeout(() => go(i + 1), DUR); });
    let x0 = null;
    cine.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') x0 = e.clientX; }, { passive: true });
    cine.addEventListener('pointerup', (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1));
    }, { passive: true });
    go(0);
    if (reduce) cine.classList.add('is-paused');
  }

  // 映像は表示されたら読み込む（スライド外の動画）
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    const v = e.target;
    v.src = v.dataset.src;
    if (!reduce) v.play().catch(() => {});
  }), { rootMargin: '200px' });
  document.querySelectorAll('.at video[data-src]:not(.cine__video)').forEach((v) => io.observe(v));

  // スクロールで現れる：まとまりごとに少しずつ遅らせる
  const groups = ['.at-head', '.at-list > div', '.at-shop', '.at-index__col', '.at-market tbody tr', '.at-options > a', '.at-ways > a', '.at-faq details', '.at-films > *', '.at-journal li', '.at-cta__shop', '.at-strip__item', '.at-two > div:first-child', '.at-final > *'];
  const targets = [];
  groups.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el, k) => {
      el.classList.add('rv');
      el.style.setProperty('--i', String(k % 6));
      targets.push(el);
    });
  });
  document.querySelectorAll('.at-h2').forEach((el) => el.classList.add('rv-line'));
  const rio = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    rio.unobserve(e.target);
    e.target.classList.add('is-in');
  }), { rootMargin: '0px 0px -8% 0px' });
  [...targets, ...document.querySelectorAll('.rv-line')].forEach((el) => rio.observe(el));

  // フィルムストリップ
  const track = document.querySelector('[data-strip]');
  if (!track) return;
  const step = (dir) => {
    const item = track.querySelector('.at-strip__item');
    const w = item ? item.getBoundingClientRect().width + 14 : 300;
    const end = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    track.scrollTo({ left: dir > 0 && end ? 0 : track.scrollLeft + dir * w, behavior: reduce ? 'auto' : 'smooth' });
  };
  document.querySelector('[data-strip-prev]')?.addEventListener('click', () => step(-1));
  document.querySelector('[data-strip-next]')?.addEventListener('click', () => step(1));
  if (reduce) return;
  let hold = false;
  ['pointerenter', 'focusin', 'touchstart'].forEach((ev) => track.addEventListener(ev, () => { hold = true; }, { passive: true }));
  ['pointerleave', 'focusout'].forEach((ev) => track.addEventListener(ev, () => { hold = false; }));
  setInterval(() => { if (!hold && !document.hidden) step(1); }, 4000);
})();

// ---- ロゴウォールのカテゴリ絞り込み
(() => {
  const tabs = document.querySelector('[data-wall-tabs]');
  const wall = document.querySelector('[data-wall]');
  if (!tabs || !wall) return;
  tabs.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-cat]');
    if (!b) return;
    tabs.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    wall.querySelectorAll('li').forEach((li) => { li.hidden = !!b.dataset.cat && li.dataset.cat !== 'all' && li.dataset.cat !== b.dataset.cat; });
  });
})();

// ---- 相場ダッシュボードのモデル切り替え
(() => {
  const dash = document.querySelector('[data-dash]');
  if (!dash) return;
  const tabs = [...dash.querySelectorAll('[data-dash-tab]')];
  const panels = [...dash.querySelectorAll('.dash__panel')];
  const show = (i) => {
    tabs.forEach((t, k) => t.setAttribute('aria-selected', String(k === i)));
    panels.forEach((p, k) => { p.hidden = k !== i; });
    const cv = panels[i].querySelector('canvas');
    const ch = window.Chart && cv && window.Chart.getChart(cv);
    if (ch) ch.resize();
  };
  tabs.forEach((t, i) => t.addEventListener('click', () => show(i)));
  dash.addEventListener('keydown', (e) => {
    const cur = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); const n = (cur + 1) % tabs.length; show(n); tabs[n].focus(); }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); const n = (cur - 1 + tabs.length) % tabs.length; show(n); tabs[n].focus(); }
  });
})();

// トップのバナースライダー（前後を複製して無限ループ・自動送り・スワイプ）
(() => {
  const root = document.querySelector('[data-kv-slider]');
  if (!root) return;
  const track = root.querySelector('[data-kv-track]');
  const real = [...track.children];
  const n = real.length;
  if (n < 2) return;
  const dots = [...root.querySelectorAll('[data-kv-dots] button')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clone = (el) => { const c = el.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.querySelectorAll('a,button').forEach((a) => a.setAttribute('tabindex', '-1')); return c; };
  // 左右に2枚ずつ複製しておくと、端でも前後のバナーが見える
  real.slice(-2).reverse().forEach((el) => track.prepend(clone(el)));
  real.slice(0, 2).forEach((el) => track.append(clone(el)));
  const all = [...track.children];
  let i = 0;
  const place = (anim) => {
    const el = all[i + 2];
    track.classList.toggle('is-anim', anim);
    track.style.transform = `translateX(${-(el.offsetLeft - (root.clientWidth - el.offsetWidth) / 2)}px)`;
    all.forEach((s) => s.classList.toggle('is-active', s === el));
    dots.forEach((d, k) => d.setAttribute('aria-current', String(k === ((i % n) + n) % n)));
  };
  const go = (to) => {
    // 連打で複製の外まで進まないよう、先に本物の位置へ戻してから動かす
    if (i >= n || i < 0) { const d = to - i; i = ((i % n) + n) % n; place(false); void track.offsetWidth; to = i + d; }
    i = to; place(true);
  };
  track.addEventListener('transitionend', (e) => {
    if (e.target !== track) return;
    if (i >= n || i < 0) { i = ((i % n) + n) % n; place(false); }
  });
  root.querySelector('[data-kv-prev]').addEventListener('click', () => { go(i - 1); restart(); });
  root.querySelector('[data-kv-next]').addEventListener('click', () => { go(i + 1); restart(); });
  dots.forEach((d, k) => d.addEventListener('click', () => { go(k); restart(); }));
  let timer = null;
  const restart = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => { if (!document.hidden) go(i + 1); }, 5000); };
  root.addEventListener('mouseenter', () => clearInterval(timer));
  root.addEventListener('mouseleave', restart);
  let x0 = null;
  root.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  root.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) { go(i + (dx < 0 ? 1 : -1)); restart(); }
  });
  addEventListener('resize', () => place(false));
  addEventListener('load', () => place(false));
  place(false);
  restart();
})();

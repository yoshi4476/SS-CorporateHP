(() => {
  const d = document, root = d.documentElement;
  root.classList.add('js');

  // 新しく開いたページは先頭から表示する。共有用の表示枠などで、前のページのスクロール位置が引き継がれることがあるため。
  // 戻る・進む・再読み込み、#付きのリンクはブラウザの位置に任せる。読み込み中に自分でスクロールし始めた人は動かさない
  const nav = performance.getEntriesByType ? performance.getEntriesByType('navigation')[0] : null;
  if (!location.hash && (!nav || nav.type === 'navigate')) {
    let touched = false;
    ['wheel', 'touchstart', 'keydown'].forEach((t) => addEventListener(t, () => { touched = true; }, { once: true, passive: true }));
    const toTop = () => { if (!touched && scrollY) scrollTo({ top: 0, left: 0, behavior: 'instant' }); };
    toTop();
    addEventListener('load', toTop, { once: true });
  }
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Webフォントは最初の描画のあとに有効にする（最初の表示をフォントの取得で待たせない）
  const ff = d.getElementById('ff');
  if (ff) requestAnimationFrame(() => setTimeout(() => { ff.media = 'all'; }, 0));

  // ---- 計測（GA4が有効なときだけ送る） ----
  const track = (name, params) => { if (typeof window.gtag === 'function') window.gtag('event', name, params || {}); };
  d.addEventListener('click', (e) => {
    const a = e.target.closest('[data-cta="line"]');
    if (a) track('line_click', { cta_location: a.dataset.ctaLoc || 'unknown', page_path: location.pathname });
  });

  // ---- オープニング：描き終えたロゴをヘッダーのロゴの位置へ移す ----
  const intro = d.getElementById('intro');
  if (intro && root.classList.contains('has-intro')) {
    let done = false;
    const finish = (skip) => {
      if (done) return;
      done = true;
      root.classList.add('intro-leave');
      if (skip) root.classList.add('intro-skip');
      const logo = intro.querySelector('.intro__logo');
      const target = d.querySelector('.site-header .logo img');
      if (!skip && logo && target) {
        const a = logo.getBoundingClientRect(), b = target.getBoundingClientRect();
        logo.style.transform = `translate(${b.left - a.left}px, ${b.top - a.top}px) scale(${b.width / a.width})`;
      }
      setTimeout(() => { root.classList.add('intro-done'); }, skip ? 0 : 900);
      setTimeout(() => { intro.remove(); }, skip ? 450 : 1300);
    };
    const timer = setTimeout(() => finish(false), 2150);
    const skipNow = () => { clearTimeout(timer); finish(true); };
    ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((ev) => addEventListener(ev, skipNow, { once: true, passive: true }));
  }

  // ---- ヘッダー ----
  const header = d.querySelector('.site-header');
  const sticky = d.querySelector('.sticky-cta');
  let lastY = 0, ticking = false;
  const onScroll = () => {
    const y = scrollY;
    header && header.classList.toggle('is-scrolled', y > 40);
    if (header && !root.classList.contains('menu-open')) header.classList.toggle('is-hidden', y > 600 && y > lastY + 4);
    if (y < lastY - 4) header && header.classList.remove('is-hidden');
    sticky && sticky.classList.toggle('is-shown', y > 520);
    lastY = y; ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  const menuBtn = d.querySelector('.menu-btn');
  const panel = d.getElementById('menu-panel');
  const setMenu = (open) => {
    root.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.querySelector('.sr-only').textContent = open ? 'メニューを閉じる' : 'メニューを開く';
    panel.inert = !open;
    if (open) panel.querySelector('a').focus({ preventScroll: true });
  };
  if (menuBtn && panel) {
    panel.inert = true;
    menuBtn.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
    panel.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    d.addEventListener('keydown', (e) => { if (e.key === 'Escape' && root.classList.contains('menu-open')) { setMenu(false); menuBtn.focus(); } });
    // 「戻る」で前のページに戻ったとき、メニューが開いたまま残らないようにする
    addEventListener('pageshow', (e) => { if (e.persisted) setMenu(false); });
  }

  // ---- トップ：カードの縁を回る金の光（画面に見えている間だけ動かす） ----
  if (!reduce && 'IntersectionObserver' in window) {
    const glow = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('is-live', e.isIntersecting)));
    d.querySelectorAll('.is-home .reason.bezel, .is-home .course-card > .bezel').forEach((el) => glow.observe(el));
  }

  // ---- 出現 ----
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      if (en.target.matches('[data-count]')) countUp(en.target);
      io.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  // 写真は画面に入る少し手前から出し始める（入ってから浮かび上がると、表示が遅く見えるため）
  const ioPhoto = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); ioPhoto.unobserve(en.target); } });
  }, { rootMargin: '0px 0px 15% 0px', threshold: 0 });
  const isPhoto = (el) => el.matches('.pgrid,.duo,[data-reveal="mask"]') || (el.matches('[data-reveal]') && el.querySelector('picture'));
  d.querySelectorAll('.hl').forEach((el) => io.observe(el));
  d.querySelectorAll('[data-reveal],[data-stagger],[data-count]').forEach((el) => { if (isPhoto(el)) { el.classList.add('is-photo'); ioPhoto.observe(el); } else io.observe(el); });

  function countUp(el) {
    const to = parseFloat(el.dataset.count);
    if (reduce || !to) { el.textContent = el.dataset.count; return; }
    const t0 = performance.now(), dur = 1600;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(to * e);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // ---- 3Dの傾き＋光の反射 ----
  if (fine && !reduce) {
    d.querySelectorAll('[data-tilt]').forEach((el) => {
      const max = parseFloat(el.dataset.tilt) || 6;
      let raf = 0;
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.classList.add('is-tilting');
          el.style.setProperty('--ry', ((x - 0.5) * max * 2).toFixed(2) + 'deg');
          el.style.setProperty('--rx', ((0.5 - y) * max * 2).toFixed(2) + 'deg');
          el.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
          el.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
        });
      });
      el.addEventListener('pointerleave', () => {
        cancelAnimationFrame(raf);
        el.classList.remove('is-tilting');
        el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg');
      });
    });
  }

  // ---- 金の粒子（ヒーローと最後の誘導） ----
  const dust = (canvas, density) => {
    if (reduce || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    let w = 0, h = 0, parts = [], running = false, raf = 0, mx = 0, my = 0;
    const colors = ['255,246,214', '239,227,163', '216,196,138', '169,211,227'];
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(240, (w * h) / density));
      parts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h, z: Math.random() * 0.9 + 0.1,
        r: Math.random() * 1.6 + 0.3, vy: -(Math.random() * 0.18 + 0.04), vx: (Math.random() - 0.5) * 0.08,
        tw: Math.random() * Math.PI * 2, ts: Math.random() * 0.03 + 0.008,
        c: colors[Math.random() < 0.82 ? Math.floor(Math.random() * 3) : 3],
      }));
    };
    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.y += p.vy * (0.6 + p.z); p.x += p.vx; p.tw += p.ts;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        const px = p.x + mx * 22 * p.z, py = p.y + my * 14 * p.z;
        const a = (Math.sin(p.tw) * 0.5 + 0.5) * 0.75 * p.z + 0.08;
        const rr = p.r * (0.6 + p.z);
        ctx.beginPath(); ctx.fillStyle = `rgba(${p.c},${a})`; ctx.arc(px, py, rr, 0, 6.283); ctx.fill();
        if (rr > 1.5 && a > 0.55) {
          ctx.strokeStyle = `rgba(${p.c},${a * 0.5})`; ctx.lineWidth = 0.6;
          ctx.beginPath(); ctx.moveTo(px - rr * 4, py); ctx.lineTo(px + rr * 4, py); ctx.moveTo(px, py - rr * 4); ctx.lineTo(px, py + rr * 4); ctx.stroke();
        }
      }
      raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!running && !d.hidden) { running = true; raf = requestAnimationFrame(frame); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    resize();
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 200); }, { passive: true });
    new IntersectionObserver(([en]) => (en.isIntersecting ? start() : stop())).observe(canvas);
    d.addEventListener('visibilitychange', () => (d.hidden ? stop() : start()));
    if (fine) canvas.parentElement.addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });
  };
  const idle = window.requestIdleCallback || ((f) => setTimeout(f, 300));
  // 表示が落ち着いてから粒子を動かす（最初の表示と操作の反応を優先）。スマホは数を減らす
  const small = innerWidth < 768 ? 2.2 : 1;
  addEventListener('load', () => setTimeout(() => idle(() => d.querySelectorAll('canvas[data-dust]').forEach((c) => dust(c, (parseFloat(c.dataset.dust) || 9000) * small))), 1200));

  // ---- またたく光（黒い節とヒーロー） ----
  if (!reduce) {
    const rnd = (a, b) => a + Math.random() * (b - a);
    d.querySelectorAll('.hero, .page-hero, .stats, .cta-final, .busan, main > .sec:not(.sec--paper)').forEach((sec) => {
      const r = sec.getBoundingClientRect();
      const n = Math.max(5, Math.min(sec.matches('.hero, .cta-final') ? 26 : 14, Math.round((r.width * Math.min(r.height, 1400)) / 60000)));
      const box = d.createElement('div');
      box.className = 'sparkles'; box.setAttribute('aria-hidden', 'true');
      for (let i = 0; i < n; i++) {
        const s = d.createElement('i');
        s.className = 'spk';
        s.style.cssText = `left:${rnd(2, 98)}%;top:${rnd(3, 97)}%;--s:${rnd(8, i % 5 === 0 ? 26 : 16)}px;--d:${rnd(2.6, 5.5)}s;--dl:${rnd(0, 6)}s;--o:${rnd(0.55, 1)}`;
        box.appendChild(s);
      }
      if (getComputedStyle(sec).position === 'static') sec.style.position = 'relative';
      sec.style.isolation = 'isolate';
      sec.prepend(box);
    });
  }

  // ---- コース診断 ----
  const quiz = d.querySelector('[data-quiz]');
  if (quiz) {
    const out = quiz.querySelector('.quiz__result');
    const data = JSON.parse(quiz.querySelector('script[type="application/json"]').textContent);
    quiz.addEventListener('change', () => {
      const f = new FormData(quiz.querySelector('form'));
      const q = f.get('qual'), exp = f.get('exp'), area = f.get('area');
      if (!q || !exp || !area) return;
      let key = '', note = '';
      if (q === 'dh') { key = 'lip'; note = '歯科衛生士の方は、リップコースが対象です（受講範囲は現在確認中のため、LINEで最新の状況をご案内します）。'; }
      else if (area === 'brow') { key = exp === 'yes' ? 'skillup' : 'lip'; note = exp === 'yes' ? '基礎課程を修了した方が、技法とデザインを深めるコースです。' : 'スキルアップコースは基礎課程の修了が条件です。未経験の方は、まずリップコースか頭皮コース（未経験プラン）から始められます。'; }
      else if (area === 'lip') { key = 'lip'; note = '未経験の方も受講できます。材料は運営側で用意します。'; }
      else { key = 'scalp'; note = exp === 'yes' ? '基礎課程を修了した方は「経験者プラン」が目安です。' : 'はじめての方は「未経験プラン」をお選びいただけます。'; }
      const c = data[key];
      out.classList.add('is-ready');
      out.innerHTML = `<p>おすすめのコース</p><strong>${c.name}<span class="small muted">（${c.days}）</span></strong><p>${note}</p><div class="quiz__actions"><a class="btn btn-line" href="${data.line}" data-cta="line" data-cta-loc="quiz_${key}" rel="noopener">LINEで相談する<span class="btn__icon" aria-hidden="true">${data.icon}</span></a><a class="btn btn-ghost" href="${c.url}">${c.name}を見る<span class="btn__icon" aria-hidden="true">${data.arrow}</span></a></div>`;
      track('course_quiz_complete', { course: key });
    });
  }

  // ---- タブ（頭皮コースの2プラン） ----
  d.querySelectorAll('.tabs').forEach((tabs) => {
    const btns = [...tabs.querySelectorAll('[role="tab"]')];
    const select = (b) => {
      btns.forEach((x) => {
        const on = x === b;
        x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1;
        d.getElementById(x.getAttribute('aria-controls')).hidden = !on;
      });
    };
    btns.forEach((b, i) => {
      b.addEventListener('click', () => select(b));
      b.addEventListener('keydown', (e) => {
        const k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (k) { const n = btns[(i + k + btns.length) % btns.length]; select(n); n.focus(); }
      });
    });
  });

  // ---- 早見表から、該当する質問を開いて移動 ----
  const openFaq = (hash) => { const t = hash && hash.startsWith('#faq-') && d.querySelector(hash); if (t && t.tagName === 'DETAILS') t.open = true; };
  openFaq(location.hash);
  d.addEventListener('click', (e) => { const a = e.target.closest('[data-open-faq]'); if (a) openFaq(a.getAttribute('href')); });

  // ---- お知らせの絞り込み ----
  const filter = d.querySelector('[data-filter]');
  if (filter) {
    const items = d.querySelectorAll('[data-cat]');
    filter.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      filter.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      items.forEach((it) => { it.hidden = b.dataset.value !== 'all' && it.dataset.cat !== b.dataset.value; });
    });
  }

  // ---- お問い合わせフォーム ----
  const form = d.querySelector('form[data-contact]');
  if (form) {
    form.querySelector('[name="_ts"]').value = String(Date.now());
    const qErr = new URLSearchParams(location.search).get('error');
    if (qErr) {
      const err = form.querySelector('.form-err');
      err.textContent = qErr === '1' ? '未入力の必須項目があります。ご確認ください。' : qErr === 'limit' ? '短い時間に続けて送信されたため、受け付けを一時的に止めています。しばらくしてから、または公式LINEからご連絡ください。' : '送信できませんでした。お手数ですが、公式LINEからご連絡ください。';
      err.classList.add('is-shown');
    }
    form.addEventListener('submit', (e) => {
      const err = form.querySelector('.form-err');
      if (!form.checkValidity()) { e.preventDefault(); err.classList.add('is-shown'); form.reportValidity(); return; }
      err.classList.remove('is-shown');
      track('generate_lead', { method: 'form', course: (new FormData(form)).get('course') || '' });
    });
  }
})();

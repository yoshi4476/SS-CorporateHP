/* サイト入場時の言語選択 (選んだ言語は Cookie m_lang に保存。検索エンジン向けの本文には影響しない) */
(() => {
  'use strict';
  const cfg = window.M_LANG || { lang: 'ja' };
  const current = cfg.lang;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;
  const setCookie = (l) => { document.cookie = `m_lang=${l};path=/;max-age=31536000;samesite=lax`; };

  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-set-lang]');
    if (a) setCookie(a.dataset.setLang);
  });

  const recommend = () => {
    for (const raw of navigator.languages || [navigator.language || 'en']) {
      const l = raw.toLowerCase();
      if (l.startsWith('ja')) return 'ja';
      if (l.startsWith('ko')) return 'ko';
      if (/^zh-(tw|hk|mo|hant)/.test(l)) return 'zh-tw';
      if (l.startsWith('zh')) return 'zh-cn';
      if (l.startsWith('en')) return 'en';
    }
    return 'en';
  };

  const loadCss = () => new Promise((resolve) => {
    if (!cfg.css || document.querySelector('link[data-gate-css]')) { resolve(); return; }
    const link = Object.assign(document.createElement('link'), { rel: 'stylesheet', href: cfg.css });
    link.dataset.gateCss = '';
    link.onload = link.onerror = resolve;
    document.head.append(link);
  });

  /* 文字を一文字ずつ滲ませて表示。改行は単語 (日中韓は文節) の切れ目だけで起きるようにまとめる */
  const chunks = (text, hreflang) => {
    if (/^(ja|zh)/.test(hreflang) && window.Intl && Intl.Segmenter) {
      const out = [];
      for (const { segment, isWordLike } of new Intl.Segmenter(hreflang, { granularity: 'word' }).segment(text)) {
        if (out.length && (!isWordLike || /^[぀-ゟ]{1,2}$/.test(segment)) && !/^\s+$/.test(segment)) out[out.length - 1] += segment;
        else out.push(segment);
      }
      return out;
    }
    return text.split(/(\s+)/);
  };
  const inkText = (el, text, hreflang) => {
    el.textContent = '';
    let c = 0;
    chunks(text, hreflang).forEach((w) => {
      if (/^\s*$/.test(w)) { el.append(w); return; }
      const word = document.createElement('span');
      word.className = 'gw';
      [...w].forEach((ch) => {
        const s = document.createElement('span');
        s.className = 'gc';
        s.style.setProperty('--c', c++);
        s.textContent = ch;
        word.append(s);
      });
      el.append(word);
    });
    el.setAttribute('aria-label', text);
  };

  /* 炭火の火の粉 (テーマが fx=embers を指定したとき) */
  const embers = (gate) => {
    const canvas = document.createElement('canvas');
    canvas.className = 'lang-gate__fx';
    canvas.setAttribute('aria-hidden', 'true');
    gate.prepend(canvas);
    const ctx = canvas.getContext('2d');
    let w, h, raf = 0;
    const size = () => { const d = Math.min(devicePixelRatio || 1, 2); w = innerWidth; h = innerHeight; canvas.width = w * d; canvas.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    size();
    addEventListener('resize', size);
    const spawn = (init) => ({ x: Math.random() * w, y: init ? Math.random() * h : h + 10, r: 0.6 + Math.random() * 1.8, vy: 0.4 + Math.random() * 1.1, vx: (Math.random() - 0.5) * 0.4, ph: Math.random() * 6.3, life: 0.5 + Math.random() * 0.5 });
    const parts = Array.from({ length: Math.round(Math.min(70, w / 18)) }, () => spawn(true));
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.ph += 0.05; p.y -= p.vy; p.x += p.vx + Math.sin(p.ph) * 0.35;
        if (p.y < -10) Object.assign(p, spawn(false));
        const fade = Math.min(1, p.y / (h * 0.9)) * p.life * (0.6 + 0.4 * Math.sin(p.ph * 2));
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        g.addColorStop(0, `rgba(255,190,110,${fade})`);
        g.addColorStop(0.35, `rgba(230,120,50,${fade * 0.5})`);
        g.addColorStop(1, 'rgba(200,80,30,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', size); };
  };

  const show = async () => {
    const tpl = document.getElementById('lang-gate-tpl');
    // ブラウザのセッション (タブ) ごとに最初の1回だけ表示。選択後やサイト内の移動では出さない
    let seen = false;
    try { seen = sessionStorage.getItem('m_gate') === '1'; } catch { /* プライベートモード等 */ }
    const reveal = () => document.documentElement.classList.remove('m-gate-wait');
    if (!tpl || seen) { reveal(); return; }
    try { sessionStorage.setItem('m_gate', '1'); } catch { /* noop */ }
    const data = JSON.parse(document.getElementById('lang-gate-data')?.textContent || '{}');
    await loadCss();
    const gate = tpl.content.firstElementChild.cloneNode(true);
    const rec = recommend();
    const links = [...gate.querySelectorAll('.lang-gate__list [data-set-lang]')];
    links.forEach((a) => a.classList.toggle('is-recommended', a.dataset.setLang === rec));
    const recLi = links.find((a) => a.dataset.setLang === rec)?.parentElement;
    if (recLi) recLi.parentElement.prepend(recLi);
    [...gate.querySelectorAll('.lang-gate__list li')].forEach((li, i) => li.style.setProperty('--i', i));
    if (cfg.fx) gate.classList.add('fx-' + cfg.fx);

    const bgs = [...gate.querySelectorAll('[data-bg]')];
    const hello = gate.querySelector('[data-hello]');
    const preview = gate.querySelector('[data-preview]');
    const tagline = gate.querySelector('[data-f="tagline"]');
    let active = null;
    let interacted = false; // 最初の自動フォーカスでは挨拶の巡回を止めない

    /* 言語にカーソル/フォーカス → プレビューをその言語に */
    const focusLang = (l) => {
      const d = data[l];
      if (!d || l === active) return;
      active = l;
      links.forEach((a) => a.classList.toggle('is-active', a.dataset.setLang === l));
      bgs.forEach((img) => img.classList.toggle('is-on', img.dataset.bg === l));
      preview.classList.remove('is-swap');
      void preview.offsetWidth;
      preview.classList.add('is-swap');
      preview.lang = d.hreflang;
      gate.querySelectorAll('[data-f]').forEach((el) => { if (el !== tagline) el.textContent = d[el.dataset.f] || ''; });
      inkText(tagline, d.tagline, d.hreflang);
      gate.querySelector('[data-gate-stay]').textContent = data[current].enter;
      gate.querySelectorAll('[data-peek]').forEach((a) => {
        const pk = d.peeks[a.dataset.peek];
        if (!pk) return;
        a.href = pk.url;
        a.dataset.setLang = l;
        a.querySelector('span').textContent = pk.label;
      });
      hello.textContent = d.greet;
      hello.lang = d.hreflang;
    };
    links.forEach((a) => {
      a.addEventListener('mouseenter', () => { stopCycle(); focusLang(a.dataset.setLang); });
      a.addEventListener('focus', () => { if (interacted) stopCycle(); focusLang(a.dataset.setLang); });
    });

    /* 挨拶を各言語で巡回 (操作されたら止める) */
    const order = Object.keys(data);
    let ci = order.indexOf(rec);
    let timer = 0;
    const stopCycle = () => { clearInterval(timer); timer = 0; };
    if (!reduced) {
      timer = setInterval(() => {
        ci = (ci + 1) % order.length;
        hello.classList.remove('is-swap'); void hello.offsetWidth; hello.classList.add('is-swap');
        hello.textContent = data[order[ci]].greet;
        hello.lang = data[order[ci]].hreflang;
      }, 1800);
    }

    /* カーソルを照らす光と、入口写真の立体的な傾き */
    let stopFx = () => {};
    if (!reduced && finePointer) {
      gate.addEventListener('pointermove', (e) => {
        gate.style.setProperty('--mx', e.clientX + 'px');
        gate.style.setProperty('--my', e.clientY + 'px');
      });
      gate.querySelectorAll('[data-peek]').forEach((card) => {
        card.addEventListener('pointermove', (e) => {
          const r = card.getBoundingClientRect();
          card.style.setProperty('--rx', ((e.clientY - r.top) / r.height - 0.5) * -10 + 'deg');
          card.style.setProperty('--ry', ((e.clientX - r.left) / r.width - 0.5) * 12 + 'deg');
        });
        card.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
      });
    }
    if (!reduced && cfg.fx === 'embers') stopFx = embers(gate);

    /* 選んだ瞬間: 押した位置から画面が染まってから移動 (先読み済みなので待ち時間は演出分のみ) */
    gate.addEventListener('click', (e) => {
      const a = e.target.closest('a[data-set-lang]');
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || reduced) return;
      e.preventDefault();
      setCookie(a.dataset.setLang);
      // 今いるページと同じ言語を選んだら読み直さずに閉じる
      if (new URL(a.href).pathname === location.pathname) { close(); return; }
      gate.style.setProperty('--cx', e.clientX + 'px');
      gate.style.setProperty('--cy', e.clientY + 'px');
      gate.classList.add('is-going');
      setTimeout(() => { location.href = a.href; }, 520);
    });

    /* 矢印キーで選択肢を移動 */
    gate.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
      const i = links.indexOf(document.activeElement);
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && i > -1) {
        e.preventDefault();
        links[(i + (e.key === 'ArrowDown' ? 1 : links.length - 1)) % links.length].focus();
      }
      if (e.key !== 'Tab') return;
      const f = [...gate.querySelectorAll('a, button')].filter((el) => el.offsetParent !== null);
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });

    const opener = document.activeElement;
    const close = () => {
      stopCycle();
      stopFx();
      setCookie(current);
      gate.classList.add('is-leaving');
      setTimeout(() => gate.remove(), reduced ? 0 : 600);
      document.body.style.overflow = '';
      opener && opener.focus && opener.focus();
    };
    gate.querySelector('[data-gate-stay]').addEventListener('click', close);

    document.body.append(gate);
    reveal();
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => gate.classList.add('is-in'));
    focusLang(rec);
    (links.find((a) => a.dataset.setLang === rec) || links[0]).focus({ preventScroll: true });
    interacted = true;
  };

  // オープニング演出があるページはその終了を待つ
  const start = () => (document.querySelector('[data-opening]') ? document.addEventListener('m:opening-done', show, { once: true }) : show());
  // 裏で先読み (prerender) されている間は表示せず、実際に開かれてから判定する
  const boot = () => (document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', start) : start());
  document.prerendering ? document.addEventListener('prerenderingchange', boot, { once: true }) : boot();
})();

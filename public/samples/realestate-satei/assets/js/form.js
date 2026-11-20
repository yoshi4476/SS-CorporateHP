(() => {
  const form = document.getElementById('satei-form');
  if (!form) return;

  const steps = [...form.querySelectorAll('.form-step')];
  const progressItems = document.querySelectorAll('.progress li');
  const bar = document.querySelector('.progress-bar i');
  let current = 0;

  const PLAN_NAMES = { sokkin: '即金査定', challenge: 'チャレンジ査定', iitoko: 'いいとこ取り査定', choto: 'ちょっと教えて査定' };
  const TYPE_NAMES = { house: '一戸建て', mansion: 'マンション', land: '土地' };

  // ---- Web査定・プランボタンからの引き継ぎ ----
  const params = new URLSearchParams(location.search);
  const plan = params.get('plan');
  if (plan && form.querySelector(`[name="plan"][value="${plan}"]`)) form.querySelector(`[name="plan"][value="${plan}"]`).checked = true;

  // 入口で選んだ目的から、売却理由を先に選んでおく
  try {
    const pur = JSON.parse(sessionStorage.getItem('hp_purpose') || 'null');
    if (pur?.reason && [...form.reason.options].some((o) => o.text === pur.reason)) form.reason.value = pur.reason;
  } catch (_) { /* 引き継げなくても入力できる */ }

  let carry = null;
  try { carry = JSON.parse(sessionStorage.getItem('hp_est') || 'null'); } catch (_) { carry = null; }
  if (carry) {
    const t = form.querySelector(`[name="ptype"][value="${carry.type}"]`);
    if (t) t.checked = true;
    if (carry.landArea) AreaInput.setSqm(form.landArea, carry.landArea, false);
    if (carry.bldgArea) AreaInput.setSqm(form.bldgArea, carry.bldgArea, false);
    (carry.wakeari || []).forEach((w) => { const c = form.querySelector(`[name="wakeari"][value="${w}"]`); if (c) c.checked = true; });
    const m = (carry.addr || '').match(/^(.{2,3}?[都道府県])(.*)$/);
    if (m) { form.pref.value = m[1]; form.city.value = m[2]; } else if (carry.addr) form.city.value = carry.addr;
    const box = document.getElementById('carry');
    if (box) {
      const price = carry.price ? `／Web査定 ${Math.round(carry.price.low / 10000).toLocaleString()}〜${Math.round(carry.price.high / 10000).toLocaleString()}万円` : '';
      box.textContent = `Web査定の内容を引き継ぎました：${carry.addr || ''}・${TYPE_NAMES[carry.type] || ''}${price}`;
      box.hidden = false;
    }
  }

  // ---- 郵便番号 → 住所（zipcloud：JSONP） ----
  const zip = form.zip;
  const zipMsg = document.getElementById('zip-msg');
  const lookupZip = () => {
    const code = zip.value.replace(/[^0-9]/g, '');
    if (code.length !== 7) return;
    const cb = `zipcb_${Date.now()}`;
    const s = document.createElement('script');
    window[cb] = (res) => {
      delete window[cb]; s.remove();
      const r = res && res.results && res.results[0];
      if (!r) { zipMsg.textContent = '住所が見つかりませんでした。手入力してください。'; return; }
      form.pref.value = r.address1;
      form.city.value = r.address2 + r.address3;
      zipMsg.textContent = `${r.address1}${r.address2}${r.address3} を入力しました。`;
      toggleOutside();
      form.street.focus();
    };
    s.src = `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${code}&callback=${cb}`;
    s.onerror = () => { zipMsg.textContent = '自動入力できませんでした。手入力してください。'; };
    document.body.appendChild(s);
  };
  zip.addEventListener('input', lookupZip);

  // ---- 愛知県外の分岐（第三者提供の同意） ----
  const outsideBox = document.getElementById('outside-notice');
  const thirdParty = document.getElementById('consent-third');
  const isOutside = () => form.pref.value && form.pref.value !== '愛知県';
  const toggleOutside = () => {
    const out = isOutside();
    outsideBox.hidden = !out;
    thirdParty.hidden = !out;
    form.agreeThird.required = out;
  };
  form.pref.addEventListener('change', toggleOutside);
  toggleOutside();

  // ---- 物件種別で面積欄を切替 ----
  const syncType = () => {
    const t = form.querySelector('[name="ptype"]:checked')?.value;
    document.getElementById('f-land').hidden = t === 'mansion';
    document.getElementById('f-bldg').hidden = t === 'land';
    document.getElementById('f-bldg-label').textContent = t === 'mansion' ? '専有面積' : '建物の広さ';
  };
  form.addEventListener('change', (e) => { if (e.target.name === 'ptype') syncType(); });
  syncType();

  // ---- 検証 ----
  const setError = (el, msg) => {
    const holder = el.closest('.field, fieldset, .consent');
    let m = holder.querySelector('.error-msg');
    if (!m) { m = document.createElement('p'); m.className = 'error-msg'; m.setAttribute('role', 'alert'); holder.appendChild(m); }
    m.textContent = msg;
    if (el.type !== 'radio') el.setAttribute('aria-invalid', 'true');
  };
  const clearErrors = (scope) => {
    scope.querySelectorAll('.error-msg').forEach((m) => m.remove());
    scope.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
  };
  const validate = (scope) => {
    clearErrors(scope);
    let firstBad = null;
    const radiosChecked = new Set();
    scope.querySelectorAll('[required]').forEach((el) => {
      if (el.closest('[hidden]')) return;
      let bad = false; let msg = '入力してください。';
      if (el.type === 'radio') {
        if (radiosChecked.has(el.name)) return;
        radiosChecked.add(el.name);
        bad = !scope.querySelector(`[name="${el.name}"]:checked`); msg = '選んでください。';
      } else if (el.type === 'checkbox') {
        bad = !el.checked; msg = '同意が必要です。';
      } else if (!el.value.trim()) {
        bad = true;
      } else if (el.type === 'tel' && !/^0\d{9,10}$/.test(el.value.replace(/[-ー－\s]/g, ''))) {
        bad = true; msg = '電話番号を確認してください（例：000-0000-0000）。';
      } else if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) {
        bad = true; msg = 'メールアドレスを確認してください。';
      }
      if (bad) { setError(el, msg); firstBad = firstBad || el; }
    });
    if (firstBad) firstBad.focus();
    return !firstBad;
  };

  // ---- ステップ移動 ----
  const show = (i, move = true) => {
    steps.forEach((s, n) => { s.hidden = n !== i; });
    progressItems.forEach((li, n) => {
      li.classList.toggle('is-done', n < i);
      li.classList.toggle('is-current', n === i);
      if (n === i) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    bar.style.width = `${((i + 1) / steps.length) * 100}%`;
    current = i;
    if (i === steps.length - 1) buildConfirm();
    if (!move) return;
    const h = steps[i].querySelector('h2');
    h.setAttribute('tabindex', '-1');
    h.focus({ preventScroll: true });
    document.getElementById('form').scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  form.addEventListener('click', (e) => {
    if (e.target.closest('[data-next]')) { if (validate(steps[current])) show(current + 1); }
    if (e.target.closest('[data-prev]')) show(current - 1);
  });

  const buildConfirm = () => {
    const p = form.querySelector('[name="plan"]:checked');
    const t = form.querySelector('[name="ptype"]:checked');
    document.getElementById('confirm-summary').textContent =
      `${PLAN_NAMES[p?.value] || ''}／${TYPE_NAMES[t?.value] || ''}／${form.pref.value}${form.city.value}`;
  };

  // 連絡方法に「メール」を選んだら、メールアドレスを必須にする
  const syncEmailRequired = () => {
    const byMail = form.querySelector('[name="contact"]:checked')?.value === 'メール';
    form.email.required = byMail;
    form.email.closest('.field').querySelector('label').lastElementChild.outerHTML = byMail ? '<span class="req">必須</span>' : '<span class="opt">任意</span>';
  };
  form.addEventListener('change', (e) => { if (e.target.name === 'contact') syncEmailRequired(); });
  syncEmailRequired();

  const sendError = document.createElement('p');
  sendError.className = 'error-msg';
  sendError.setAttribute('role', 'alert');
  sendError.hidden = true;
  form.querySelector('.form-step:last-of-type .form-nav').after(sendError);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate(steps[current])) return;
    const fd = new FormData(form);
    // 画面に出ていない欄（種類で切り替わる面積欄など）は送らない
    form.querySelectorAll('[hidden] [name]').forEach((el) => fd.delete(el.name));
    const body = Object.fromEntries([...fd.keys()].map((k) => [k, fd.get(k)]));
    // 面積は坪で入れられても㎡に直して送る
    for (const k of ['landArea', 'bldgArea']) if (k in body) body[k] = String(AreaInput.sqm(form[k]) || '');
    body.wakeari = fd.getAll('wakeari');
    body.agree = form.agree.checked;
    body.agreeThird = form.agreeThird.checked;
    body.webEstimate = carry;
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    sendError.hidden = true;
    try {
      // サーバーはローカル保存（data/leads）。本番は CRM／メール通知へ差し替え
      const res = await fetch('../api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || String(res.status));
    } catch (err) {
      btn.disabled = false;
      sendError.textContent = `送信できませんでした（${err.message}）。お手数ですが、お電話（000-0000-0000）またはLINEでご連絡ください。`;
      sendError.hidden = false;
      sendError.focus?.();
      return;
    }
    try {
      sessionStorage.setItem('hp_done', JSON.stringify({ plan: form.querySelector('[name="plan"]:checked')?.value, outside: isOutside() }));
      sessionStorage.removeItem('hp_est');
      sessionStorage.removeItem('hp_form_draft'); // 送信できたら途中保存を消す
    } catch (_) { /* 引き継げなくてもサンクスは表示できる */ }
    location.href = 'thanks.html';
  });

  // ---- 入力の途中保存（このタブを閉じるまで。送信すると消える）----
  const DRAFT = 'hp_form_draft';
  const saveDraft = () => {
    const d = {};
    form.querySelectorAll('input, select, textarea').forEach((el) => {
      if (!el.name || el.type === 'hidden' || el.name === 'website') return;
      if (el.type === 'radio') { if (el.checked) d[el.name] = el.value; } else if (el.type === 'checkbox') {
        if (el.name === 'wakeari') (d.wakeari ??= []).push(...(el.checked ? [el.value] : []));
        else d[el.name] = el.checked;
      } else d[el.name] = el.value;
    });
    d._step = current;
    try { sessionStorage.setItem(DRAFT, JSON.stringify(d)); } catch (_) { /* 保存できなくても入力は続けられる */ }
  };
  const restoreDraft = () => {
    let d = null;
    try { d = JSON.parse(sessionStorage.getItem(DRAFT) || 'null'); } catch (_) { d = null; }
    if (!d) return 0;
    Object.entries(d).forEach(([k, v]) => {
      if (k === '_step') return;
      if (k === 'wakeari') { form.querySelectorAll('[name="wakeari"]').forEach((c) => { c.checked = v.includes(c.value); }); return; }
      const els = form.querySelectorAll(`[name="${k}"]`);
      els.forEach((el) => {
        if (el.type === 'radio') el.checked = el.value === v;
        else if (el.type === 'checkbox') el.checked = Boolean(v);
        else el.value = v;
      });
    });
    toggleOutside();
    syncType();
    syncEmailRequired();
    return Math.min(d._step || 0, steps.length - 1);
  };
  form.addEventListener('input', saveDraft);
  form.addEventListener('change', saveDraft);

  // 途中保存は常に戻し、URLで査定プランが指定されていれば、そのプランを優先して最初のステップから
  const resumeStep = restoreDraft();
  const planRadio = plan && form.querySelector(`[name="plan"][value="${plan}"]`);
  if (planRadio) planRadio.checked = true;
  show(planRadio ? 0 : resumeStep, false);
})();

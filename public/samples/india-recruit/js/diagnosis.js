// 採用診断。設問はHTMLにあり、ここでは「1問1画面」と「結果判定」だけを担う。
(() => {
  const form = document.getElementById('dx-form');
  const steps = [...form.querySelectorAll('fieldset')];
  const backBtn = document.getElementById('dx-back');
  const nextBtn = document.getElementById('dx-next');
  const progress = document.querySelector('.dx-progress');
  const seg = progress.querySelector('.dx-seg');
  const count = document.getElementById('dx-count');
  const live = document.getElementById('dx-live');
  const resultEl = document.getElementById('dx-result');
  const dl = (window.dataLayer = window.dataLayer || []);
  let current = 0;
  let started = false;

  seg.innerHTML = steps.map(() => '<li></li>').join('');
  const segs = [...seg.children];
  const setSeg = (i) => segs.forEach((el, n) => { el.classList.toggle('is-done', n < i); el.classList.toggle('is-cur', n === i); });

  const answers = () => Object.fromEntries(new FormData(form));

  function show(i) {
    current = i;
    steps.forEach((s, n) => s.classList.toggle('is-current', n === i));
    backBtn.hidden = i === 0;
    nextBtn.hidden = false;
    setSeg(i);
    count.textContent = `${i + 1} / ${steps.length}`;
    live.textContent = `質問 ${i + 1} / ${steps.length}：${steps[i].querySelector('legend').lastChild.textContent}`;
    if (i > 0 || started) steps[i].querySelector('input, select').focus({ preventScroll: true });
  }

  function next() {
    if (current < steps.length - 1) show(current + 1);
    else finish();
  }

  // 自動で次へ進むのは、マウスや指で選んだときだけ（矢印キーで選び直している途中に進まないように）
  let viaPointer = false;
  form.addEventListener('pointerdown', () => { viaPointer = true; });
  form.addEventListener('keydown', () => { viaPointer = false; });

  const setError = (fs, msg) => {
    let err = fs.querySelector('.dx-err');
    if (!msg) { if (err) err.remove(); fs.removeAttribute('aria-describedby'); return; }
    if (!err) { err = document.createElement('p'); err.className = 'dx-err'; err.id = `dx-err-${fs.dataset.q}`; fs.append(err); }
    err.textContent = msg;
    fs.setAttribute('aria-describedby', err.id);
    live.textContent = msg;
  };

  form.addEventListener('change', (e) => {
    const fs = e.target.closest('fieldset');
    if (!started) { started = true; dl.push({ event: 'diagnosis_start' }); }
    dl.push({ event: 'diagnosis_answer', question: fs.dataset.q, answer: e.target.value });
    setError(fs, '');
    if (e.target.type === 'radio' && !fs.hasAttribute('data-manual') && viaPointer) setTimeout(next, 250);
  });

  nextBtn.addEventListener('click', () => {
    const fs = steps[current];
    if (!fs.querySelector('input:checked')) { setError(fs, '選択肢を1つ選んでください。'); fs.querySelector('input').focus(); return; }
    next();
  });
  backBtn.addEventListener('click', () => {
    dl.push({ event: 'diagnosis_back', question: steps[current].dataset.q });
    show(current - 1);
  });
  // 途中離脱の計測
  addEventListener('pagehide', () => {
    if (started && resultEl.hidden) dl.push({ event: 'diagnosis_abandon', question: steps[current].dataset.q });
  });

  // ---- 判定: 合計点ではなく「職種の合い方 × 時期 × 受け入れ体制」の組み合わせで決める ----
  function judge(a) {
    const fitJob = { design: 2, production: 2, quality: 2, it: 2, rnd: 2, other: 1, midcareer: 0 }[a.job];
    const fitJp = { daily: 2, grow: 2, business: 0 }[a.japanese];
    const fitIntern = { yes: 2, maybe: 1, no: 0 }[a.internship];
    const fit = fitJob + fitJp + fitIntern + 2; // 専攻はどれでも紹介対象のため一律2点
    const urgency = { '6m': 2, '1y': 2, '2y': 1, undecided: 0 }[a.timing];

    if (a.job === 'midcareer' || (a.japanese === 'business' && a.internship === 'no') || fit <= 4) return 'D';
    if (urgency <= 1) return 'C';
    if (a.experience === 'no') return 'B';
    return 'A';
  }

  const TYPES = {
    A: {
      label: 'タイプA：今すぐ相談',
      title: '〇〇〇〇を活用いただける可能性が高い状況です',
      summary: '職種や条件がインド理系人材と合いやすく、採用時期も近い状況です。採用時期から逆算すると、候補者紹介の準備を早めに始めるほど選択肢が広がります。',
      ctas: [['btn-primary btn-lg', '無料相談を予約する', 'consult', 'result_consult'], ['btn-ghost', 'サービス資料をダウンロード（無料）', 'download', 'result_download']],
      links: [['/service/candidates/', '候補者紹介の詳細'], ['/flow/', '導入の流れとスケジュール']],
    },
    B: {
      label: 'タイプB：準備して前進',
      title: '受け入れ準備を整えれば、十分に活用できる状況です',
      summary: '条件はインド理系人材と合いやすい一方、外国人社員の受け入れは初めての状況です。住まいや社内ルールなどの準備を先に進めておくと、入社後の立ち上がりがスムーズになります。',
      ctas: [['btn-primary btn-lg', '受け入れ準備の相談を予約する', 'consult_prep', 'result_consult_prep'], ['btn-ghost', '受け入れ準備チェックリストを受け取る', 'download_checklist', 'result_checklist']],
      links: [['/solutions/municipality/', 'はじめての受け入れの進め方'], ['/service/training/', '入社前トレーニングの内容']],
    },
    C: {
      label: 'タイプC：情報収集',
      title: 'まずはインド人材採用の全体像を知ることから',
      summary: '採用時期にまだ余裕がある、または検討を始めた段階です。今のうちに流れや費用の考え方を知っておくと、社内での検討を進めやすくなります。',
      ctas: [['btn-primary btn-lg', '詳細レポートと資料を受け取る', 'report', 'result_report'], ['btn-ghost', 'セミナーに申し込む', 'seminar', 'result_seminar']],
      links: [['/column/', 'インド人材・外国人採用のコラム'], ['/flow/', '導入の流れとスケジュール']],
    },
    D: {
      label: 'タイプD：別の進め方も',
      title: '今の条件なら、こんな進め方が考えられます',
      summary: '今の条件のままでは合いにくい部分がありますが、条件の一部を見直すと活用できるケースがあります。たとえば、新卒を育成する枠を1名設けたり、日本語の要件を職種ごとに見直したりする方法です。インド人材以外の選択肢も含めて、採用課題そのものをご相談いただけます。',
      ctas: [['btn-primary btn-lg', '「採用課題の整理」無料相談を予約する', 'consult_general', 'result_consult_general'], ['btn-ghost', '条件を見直して再診断する', 'retry', 'result_retry']],
      links: [['#dx-sec-4', '向いていないケースと代わりの進め方'], ['/cases/', '導入事例']],
    },
  };

  const COMMENTS = {
    issue: {
      applicants: '国内の応募が集まりにくい場合、インドの大学から直接候補者を探すことで、応募を待つ採用から探しに行く採用へ切り替えられます。',
      declined: '内定辞退の補充は時期が重要です。インドの大学の卒業時期に合わせると、国内の採用スケジュールとずらして候補者を探せます。',
      retention: '定着が課題の場合は、入社前のインターンとトレーニングで相互理解を深めておくことが、定着につなげる取り組みになります。',
      knowhow: '採用の進め方がわからない場合も、採用条件の整理から一緒に進められます。まずは職種と時期を決めるところから始めるのがおすすめです。',
      other: '貴社の課題に合わせて、相談の場で進め方を整理します。',
    },
    local: '地方の拠点では国内の理系新卒の応募が集まりにくい傾向があります。住まいや生活の立ち上げの準備を早めに検討しておくと安心です。',
    overseas: '海外展開の計画がある場合、日本で経験を積んだ人材が将来インド拠点との橋渡し役になることも考えられます。GCC設立の支援もご相談いただけます。',
    many: '複数名の採用では、同じ時期に入社する仲間がいることで、入社後に相談し合える環境をつくりやすくなります。',
    business: '入社時に業務レベルの日本語を求める場合は、職種ごとに本当に必要なレベルを見直すと、候補者の幅が広がります。',
  };

  function comments(a) {
    const list = [COMMENTS.issue[a.issue]];
    if (a.area === 'local') list.push(COMMENTS.local);
    if (a.overseas !== 'no') list.push(COMMENTS.overseas);
    if (a.headcount === '2-3' || a.headcount === '4+') list.push(COMMENTS.many);
    if (a.japanese === 'business') list.push(COMMENTS.business);
    return list.slice(0, 3);
  }

  function contactUrl(purpose, type, a) {
    const p = new URLSearchParams({ ...a, purpose, from: 'diagnosis', lead_type: type });
    return `/contact/?${p}`;
  }

  function finish() {
    const a = answers();
    const type = judge(a);
    const t = TYPES[type];
    try { sessionStorage.setItem('i2j_diagnosis', JSON.stringify({ ...a, lead_type: type })); } catch {}

    setSeg(steps.length);
    progress.classList.add('done');
    count.textContent = '完了';
    form.hidden = true;

    document.getElementById('dx-type').textContent = t.label;
    document.getElementById('dx-result-title').textContent = t.title;
    document.getElementById('dx-summary').textContent = t.summary;
    document.getElementById('dx-comments').replaceChildren(...comments(a).map((c) => Object.assign(document.createElement('li'), { textContent: c })));
    document.getElementById('dx-ctas').replaceChildren(...t.ctas.map(([cls, text, purpose, cta]) => {
      const el = document.createElement('a');
      el.className = `btn ${cls}`;
      el.textContent = text;
      el.dataset.cta = cta;
      el.href = purpose === 'retry' ? '#dx-app' : purpose === 'report' ? '#dx-lead' : contactUrl(purpose, type, a);
      if (purpose === 'retry') el.addEventListener('click', (e) => { e.preventDefault(); retry(); });
      return el;
    }));
    const links = document.getElementById('dx-links');
    links.replaceChildren('関連ページ：', ...t.links.flatMap(([href, text], i) => [i ? '／' : '', Object.assign(document.createElement('a'), { href, textContent: text })]));
    document.getElementById('lead-type').value = type;
    document.getElementById('lead-answers').value = JSON.stringify(a);

    resultEl.hidden = false;
    resultEl.focus();
    history.replaceState(null, '', `?result=${type}`);
    dl.push({ event: 'diagnosis_complete', lead_type: type });
  }

  function retry() {
    resultEl.hidden = true;
    form.hidden = false;
    progress.classList.remove('done');
    history.replaceState(null, '', location.pathname);
    dl.push({ event: 'diagnosis_retry' });
    show(0);
  }
  document.getElementById('dx-retry').addEventListener('click', retry);

  document.getElementById('dx-lead').addEventListener('submit', () => {
    dl.push({ event: 'diagnosis_report_submit', lead_type: document.getElementById('lead-type').value });
  });

  // トップで1問目（職種）を選んで来た場合は、答えた状態で2問目から始める
  const preJob = new URLSearchParams(location.search).get('job');
  const preInput = preJob && form.querySelector(`input[name="job"][value="${CSS.escape(preJob)}"]`);
  if (preInput) {
    preInput.checked = true;
    started = true;
    dl.push({ event: 'diagnosis_start', from: 'hero' });
    dl.push({ event: 'diagnosis_answer', question: 'job', answer: preJob });
    show(1);
  } else {
    show(0);
  }
})();

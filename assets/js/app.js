(() => {
  const SERIES = [
    { id: 'prima', name: 'Prima', cat: 'ploughs', peek: 'models/prima-70.jpg' },
    { id: 'rover', name: 'Rover', cat: 'ploughs', peek: 'field/rover-60-dust.jpg' },
    { id: 'voyager', name: 'Voyager', cat: 'ploughs', peek: 'field/voyager-c80-evening.jpg' },
    { id: 'explor', name: 'Explor', cat: 'discs', peek: 'models/explor-t90.jpg' },
    { id: 'discordon', name: 'Discordon', cat: 'discs', peek: 'field/discordon-t80.jpg' },
    { id: 'cover', name: 'Cover', cat: 'discs', peek: 'models/cover-xl-t80.jpg' },
    { id: 'normandie', name: 'Normandie+', cat: 'discs', peek: 'field/normandie-t80.jpg' },
    { id: 'occitan', name: 'Occitan', cat: 'discs', peek: 'field/occitan-60-aerial.jpg' },
    { id: 'helios', name: 'Helios', cat: 'tines', peek: 'models/helios-duo-t90.jpg' },
    { id: 'crossland', name: 'Crossland', cat: 'tines', peek: 'models/crossland-t80.jpg' },
    { id: 'tetra', name: 'Tetra', cat: 'tines', peek: 'models/tetra-60.jpg' },
  ];
  const CATS = ['ploughs', 'discs', 'tines'];
  const HERO = ['Voyager C80', 'Rover 60', 'Occitan T70', 'Voyager C80'];
  const STRIP = [
    ['voyager-hillside', 'Voyager'], ['normandie-t70-discs', 'Normandie+ T70'], ['rover-50-bodies', 'Rover 50'],
    ['occitan-t70-aerial', 'Occitan T70'], ['voyager-s70-turn', 'Voyager S70'], ['occitan-60-detail', 'Occitan 60'],
    ['discordon-t80-top', 'Discordon T80'], ['rover-70-detail', 'Rover 70'], ['normandie-t70-aerial', 'Normandie+ T70'],
    ['voyager-c60-furrow', 'Voyager C60'],
  ];
  const LEGAL = [
    'https://marketing.cellar-c2.services.clever-cloud.com/Legal_information/legal_notices.pdf',
    'https://marketing.cellar-c2.services.clever-cloud.com/Legal_information/eula.pdf',
    'https://marketing.cellar-c2.services.clever-cloud.com/Legal_information/personal_data_privacy_policy.pdf',
    'https://marketing.cellar-c2.services.clever-cloud.com/Legal_information/cookies_management_policy.pdf',
  ];
  const CONTACT_IMG = ['catalog-receive', 'gb-recontact', 'ask-quotation'];
  const HP_MIN = 50, HP_MAX = 600;

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);

  const state = { lang: 'sv', hp: 180, cat: 'all', series: null, query: '' };
  let T = I18N.sv;

  /* ---------- Language ---------- */
  function pickInitialLang() {
    const fromUrl = new URLSearchParams(location.search).get('lang');
    if (fromUrl && I18N[fromUrl]) return fromUrl;
    try { const saved = localStorage.getItem('gb-lang'); if (saved && I18N[saved]) return saved; } catch (e) {}
    return 'sv';
  }

  function setLang(lang) {
    state.lang = lang;
    T = I18N[lang];
    document.documentElement.lang = lang;
    document.title = T.title;
    $('meta[name="description"]').setAttribute('content', T.metaDesc);
    try { localStorage.setItem('gb-lang', lang); } catch (e) {}
    const url = new URL(location.href);
    url.searchParams.set('lang', lang);
    history.replaceState(null, '', url);

    $$('[data-i18n]').forEach((el) => { const v = get(T, el.dataset.i18n); if (typeof v === 'string') el.textContent = v; });
    $$('[data-i18n-placeholder]').forEach((el) => { el.placeholder = get(T, el.dataset.i18nPlaceholder); });

    $('#langCurrent').textContent = LANGS[lang].short;
    $('#hpUnit').textContent = T.hp;
    renderLangMenus();
    renderStats();
    renderCats();
    renderCards();
    renderRange();
    renderFeatures();
    renderNames();
    renderTypes();
    renderFooter();
    updateHeroCaption();
  }

  function renderLangMenus() {
    $('#langList').innerHTML = Object.entries(LANGS).map(([k, v]) =>
      `<li><button role="option" data-lang="${k}" aria-selected="${k === state.lang}">${v.label}<span class="mono">${v.short}</span></button></li>`).join('');
    $('#mnavLangs').innerHTML = Object.entries(LANGS).map(([k, v]) =>
      `<button data-lang="${k}" aria-pressed="${k === state.lang}">${v.short}</button>`).join('');
  }

  function initLangUI() {
    const btn = $('#langBtn'), list = $('#langList');
    const close = () => { list.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      list.hidden = !list.hidden;
      btn.setAttribute('aria-expanded', String(!list.hidden));
    });
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-lang]');
      if (b) { setLang(b.dataset.lang); }
      if (!e.target.closest('#lang')) close();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  /* ---------- Header / mobile nav ---------- */
  function initHeader() {
    const header = $('#header');
    const onScroll = () => header.classList.toggle('is-solid', scrollY > 40 || !$('#mobileNav').hidden);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    const burger = $('#burger'), mnav = $('#mobileNav');
    burger.addEventListener('click', () => {
      mnav.hidden = !mnav.hidden;
      burger.setAttribute('aria-expanded', String(!mnav.hidden));
      onScroll();
    });
    mnav.addEventListener('click', (e) => { if (e.target.closest('a')) { mnav.hidden = true; burger.setAttribute('aria-expanded', 'false'); onScroll(); } });
  }

  /* ---------- Hero slideshow (real photography) ---------- */
  let heroIdx = 0, heroTimer;
  const SLIDE_MS = 6000;
  function initHero() {
    const slides = $$('.hero__slide');
    const prog = $('#heroProgress');
    prog.style.setProperty('--slide-ms', SLIDE_MS + 'ms');
    prog.innerHTML = slides.map((_, i) => `<button aria-label="${i + 1}"></button>`).join('');
    const go = (i) => {
      slides[heroIdx].classList.remove('is-active');
      $$('button', prog)[heroIdx].classList.remove('is-active');
      heroIdx = (i + slides.length) % slides.length;
      slides[heroIdx].classList.add('is-active');
      const b = $$('button', prog)[heroIdx];
      void b.offsetWidth; // restart progress animation
      b.classList.add('is-active');
      updateHeroCaption();
      clearTimeout(heroTimer);
      heroTimer = setTimeout(() => go(heroIdx + 1), SLIDE_MS);
    };
    prog.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) go($$('button', prog).indexOf(b)); });
    go(0);
  }
  function updateHeroCaption() { $('#heroCaption').textContent = HERO[heroIdx] || ''; }

  /* ---------- Stats ---------- */
  function renderStats() {
    $('#stats').innerHTML = T.stats.map(([n, l]) => `<div class="stat"><b>${n}</b><span class="mono">${esc(l)}</span></div>`).join('');
  }

  /* ---------- Finder ---------- */
  function renderCats() {
    $('#catSeg').innerHTML = ['all', ...CATS].map((c) =>
      `<button role="tab" data-cat="${c}" aria-selected="${state.cat === c}">${esc(T.cats[c])}</button>`).join('');
  }

  function specLine(m) {
    if (!m.count) return null;
    return `${m.count} ${T.units[m.unit]}`;
  }

  function renderCards() {
    const hp = state.hp;
    const list = MODELS.filter((m) =>
      hp >= m.hp[0] && hp <= m.hp[1] &&
      (state.cat === 'all' || m.cat === state.cat) &&
      (!state.series || m.range === state.series));
    const seriesName = (id) => SERIES.find((s) => s.id === id).name;

    $('#cards').innerHTML = list.map((m, i) => {
      const left = ((m.hp[0] - HP_MIN) / (HP_MAX - HP_MIN)) * 100;
      const width = ((m.hp[1] - m.hp[0]) / (HP_MAX - HP_MIN)) * 100;
      const mark = ((hp - HP_MIN) / (HP_MAX - HP_MIN)) * 100;
      const spec = specLine(m);
      return `<article class="card" style="animation-delay:${Math.min(i, 12) * 30}ms">
        <div class="card__img"><img src="assets/img/models/${m.id}.jpg" alt="${esc(m.name)}" loading="lazy" width="500" height="333"></div>
        <div class="card__body">
          <span class="card__series mono">${esc(seriesName(m.range))} · ${esc(T.series[m.range][0])}</span>
          <h3 class="card__name">${esc(m.name)}</h3>
          <dl class="specs">
            <dt>${esc(T.finder.tractor)}</dt><dd>${m.hp[0]}–${m.hp[1]} ${T.hp}</dd>
            <dt>${esc(T.finder.width)}</dt><dd>${esc(m.width)}</dd>
            ${spec || m.mount ? `<dt>${esc(T.finder.config)}</dt><dd>${[m.mount && T.mount[m.mount], spec].filter(Boolean).map(esc).join(' · ')}</dd>` : ''}
          </dl>
          <div class="hpbar" aria-hidden="true"><i style="left:${left}%;width:${width}%"></i><b style="left:${mark}%"></b></div>
          <a class="card__ask" href="#contact" data-machine="${esc(m.name)}">${esc(T.finder.ask)} →</a>
        </div>
      </article>`;
    }).join('');

    $('#finderCount').textContent = T.finder.results(list.length);
    $('#finderNone').hidden = list.length > 0;
    const chip = $('#seriesChip');
    chip.hidden = !state.series;
    if (state.series) chip.innerHTML = `${esc(seriesName(state.series))} <span aria-hidden="true">✕</span><span class="sr">${esc(T.finder.clear)}</span>`;
  }

  function initFinder() {
    const input = $('#hp');
    const sync = () => {
      state.hp = +input.value;
      $('#hpVal').textContent = state.hp;
      $('.slider').style.setProperty('--p', ((state.hp - HP_MIN) / (HP_MAX - HP_MIN)) * 100 + '%');
    };
    let raf;
    input.addEventListener('input', () => {
      sync();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(renderCards);
    });
    sync();
    $('#catSeg').addEventListener('click', (e) => {
      const b = e.target.closest('[data-cat]');
      if (!b) return;
      state.cat = b.dataset.cat;
      state.series = null;
      renderCats(); renderCards();
    });
    $('#seriesChip').addEventListener('click', () => { state.series = null; renderCards(); });
    $('#cards').addEventListener('click', (e) => {
      const a = e.target.closest('[data-machine]');
      if (a) { $('#machineField').value = a.dataset.machine; setType(2); }
    });
  }

  function focusSeries(id) {
    const s = SERIES.find((x) => x.id === id);
    const models = MODELS.filter((m) => m.range === id);
    state.series = id;
    state.cat = s.cat;
    // keep the slider inside the series' power band so models show up
    const lo = Math.min(...models.map((m) => m.hp[0])), hi = Math.max(...models.map((m) => m.hp[1]));
    if (state.hp < lo || state.hp > hi) {
      state.hp = Math.round((lo + Math.min(hi, lo + 100)) / 2 / 5) * 5;
      $('#hp').value = state.hp;
      $('#hp').dispatchEvent(new Event('input'));
    }
    renderCats(); renderCards();
    $('#finder').scrollIntoView({ behavior: 'smooth' });
  }

  /* ---------- Gallery strip ---------- */
  function renderStrip() {
    const items = STRIP.map(([f, c]) =>
      `<figure><img src="assets/img/field/${f}.jpg" alt="${esc(c)}"><figcaption class="mono">${esc(c)}</figcaption></figure>`).join('');
    $('#strip').innerHTML = items + items.replace(/alt="[^"]*"/g, 'alt="" aria-hidden="true"');
  }

  /* ---------- Range ---------- */
  function renderRange() {
    let n = 0;
    $('#rangeList').innerHTML = CATS.map((c) => {
      const rows = SERIES.filter((s) => s.cat === c).map((s) => {
        n++;
        const ms = MODELS.filter((m) => m.range === s.id);
        const lo = Math.min(...ms.map((m) => m.hp[0])), hi = Math.max(...ms.map((m) => m.hp[1]));
        const [fn, desc] = T.series[s.id];
        const contain = s.peek.startsWith('models/') ? ' series__peek--contain' : '';
        return `<a class="series reveal" href="#finder" data-series="${s.id}">
          <span class="series__no mono">${String(n).padStart(2, '0')}</span>
          <div><h4 class="series__name">${esc(s.name)}</h4><span class="series__fn">${esc(fn)}</span></div>
          <p class="series__desc">${esc(desc)}</p>
          <div class="series__meta"><b>${lo}–${hi} ${T.hp}</b>${ms.length} ${esc(T.range.models)}</div>
          <span class="series__arrow" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M1 7h12M8 2l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></span>
          <div class="series__peek${contain}" aria-hidden="true"><img src="assets/img/${s.peek}" alt="" loading="lazy"></div>
        </a>`;
      }).join('');
      return `<div class="family"><div class="family__head"><h3>${esc(T.cats[c])}</h3><span class="mono">${SERIES.filter((s) => s.cat === c).length} / 11</span></div>${rows}</div>`;
    }).join('');
    observeReveals();
  }

  function initRange() {
    $('#rangeList').addEventListener('click', (e) => {
      const a = e.target.closest('[data-series]');
      if (!a) return;
      e.preventDefault();
      focusSeries(a.dataset.series);
    });
  }

  /* ---------- Heritage features ---------- */
  function renderFeatures() {
    $('#features').innerHTML = ['f1', 'f2', 'f3'].map((k) =>
      `<li><div><h3>${esc(T.heritage[k][0])}</h3><p>${esc(T.heritage[k][1])}</p></div></li>`).join('');
  }

  /* ---------- Old names lookup ---------- */
  const norm = (s) => s.toLowerCase().replace(/[\s,./()–-]+/g, '');
  function renderNames() {
    const q = norm(state.query);
    const rows = OLD_NAMES.filter(([o, n]) => !q || norm(o).includes(q) || norm(n).includes(q));
    const hl = (s) => {
      if (!state.query.trim()) return esc(s);
      const i = s.toLowerCase().indexOf(state.query.trim().toLowerCase());
      return i < 0 ? esc(s) : esc(s.slice(0, i)) + '<mark>' + esc(s.slice(i, i + state.query.trim().length)) + '</mark>' + esc(s.slice(i + state.query.trim().length));
    };
    $('#nameRows').innerHTML = rows.length
      ? rows.map(([o, n]) => `<div class="names__row" role="row"><span role="cell">${hl(o)}</span><b role="cell">${hl(n)}</b></div>`).join('')
      : `<p class="names__empty">${esc(T.names.empty)}</p>`;
  }
  function initNames() {
    $('#nameSearch').addEventListener('input', (e) => { state.query = e.target.value; renderNames(); });
  }

  /* ---------- Contact ---------- */
  let typeIdx = 2;
  function renderTypes() {
    $('#types').innerHTML = T.contact.types.map((t, i) =>
      `<label class="type"><input type="radio" name="type" value="${i}" ${i === typeIdx ? 'checked' : ''}>
        <span><img src="assets/img/contact/${CONTACT_IMG[i]}.jpg" alt="">${esc(t)}</span></label>`).join('');
  }
  function setType(i) { typeIdx = i; const r = $(`#types input[value="${i}"]`); if (r) r.checked = true; }

  function initContact() {
    $('#machineList').innerHTML = MODELS.map((m) => `<option value="${esc(m.name)}">`).join('');
    $('#types').addEventListener('change', (e) => { typeIdx = +e.target.value; });
    const form = $('#contactForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      $$('input[required]', form).forEach((inp) => {
        const bad = !inp.value.trim() || (inp.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value));
        inp.classList.toggle('is-invalid', bad);
        inp.setAttribute('aria-invalid', String(bad));
        if (bad && ok) { inp.focus(); ok = false; }
      });
      if (!ok) return;
      // Demo: no backend wired yet. Hook this up to the client's CRM / mail endpoint.
      form.reset();
      setType(2);
      $('#formOk').hidden = false;
    });
    form.addEventListener('input', (e) => { if (e.target.classList.contains('is-invalid') && e.target.value.trim()) e.target.classList.remove('is-invalid'); });
  }

  /* ---------- Footer ---------- */
  function renderFooter() {
    $('#footerSeries').innerHTML = SERIES.map((s) => `<li><a href="#finder" data-series="${s.id}">${esc(s.name)}</a></li>`).join('');
    $('#legal').innerHTML = T.footer.legal.map((l, i) => `<li><a href="${LEGAL[i]}">${esc(l)}</a></li>`).join('');
  }
  function initFooter() {
    $('#year').textContent = new Date().getFullYear();
    $('#footerSeries').addEventListener('click', (e) => {
      const a = e.target.closest('[data-series]');
      if (a) { e.preventDefault(); focusSeries(a.dataset.series); }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  let io;
  function observeReveals() {
    if (!('IntersectionObserver' in window)) { $$('.reveal').forEach((el) => el.classList.add('is-in')); return; }
    io = io || new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    $$('.reveal:not(.is-in)').forEach((el) => io.observe(el));
  }

  /* ---------- Boot ---------- */
  initLangUI();
  initHeader();
  initFinder();
  initRange();
  initNames();
  initContact();
  initFooter();
  renderStrip();
  setLang(pickInitialLang());
  initHero();
})();

(() => {
  /* ======================================================================
     Data
     ====================================================================== */
  const SERIES = [
    { id: 'prima', name: 'Prima', cat: 'ploughs', thumb: 'prima-70' },
    { id: 'rover', name: 'Rover', cat: 'ploughs', thumb: 'rover-70' },
    { id: 'voyager', name: 'Voyager', cat: 'ploughs', thumb: 'voyager-c80' },
    { id: 'explor', name: 'Explor', cat: 'discs', thumb: 'explor-t80' },
    { id: 'discordon', name: 'Discordon', cat: 'discs', thumb: 'discordon-t80' },
    { id: 'cover', name: 'Cover', cat: 'discs', thumb: 'cover-x-t70' },
    { id: 'normandie', name: 'Normandie+', cat: 'discs', thumb: 'normandieplus-t70' },
    { id: 'occitan', name: 'Occitan', cat: 'discs', thumb: 'occitan-t60' },
    { id: 'helios', name: 'Helios', cat: 'tines', thumb: 'helios-duo-t90' },
    { id: 'crossland', name: 'Crossland', cat: 'tines', thumb: 'crossland-t70' },
    { id: 'tetra', name: 'Tetra', cat: 'tines', thumb: 'tetra-60' },
  ];
  const CATS = ['ploughs', 'discs', 'tines'];
  const CAT_IMG = { ploughs: 'voyager', discs: 'occitan', tines: 'crossland' };
  const HP_MIN = 50, HP_MAX = 600;
  const LEGAL = [
    'https://marketing.cellar-c2.services.clever-cloud.com/Legal_information/legal_notices.pdf',
    'https://marketing.cellar-c2.services.clever-cloud.com/Legal_information/eula.pdf',
    'https://marketing.cellar-c2.services.clever-cloud.com/Legal_information/personal_data_privacy_policy.pdf',
    'https://marketing.cellar-c2.services.clever-cloud.com/Legal_information/cookies_management_policy.pdf',
  ];
  const DEFAULT_COUNTRY = { sv: 'SE', fr: 'FR', de: 'DE', en: '' };
  const MARKETING_MAIL = 'france.marketing@gb-group.co';
  const DOC_LANGS = ['en', 'fr', 'de', 'it'];
  const flag = (l) => `assets/img/flags/${l}.svg`;
  const EXTRA_COUNTRIES = ['SE', 'NO', 'DK', 'FI', 'NL', 'IE', 'CH', 'PT', 'GR', 'TR', 'BY', 'KZ'];

  const seriesById = Object.fromEntries(SERIES.map((s) => [s.id, s]));
  const modelById = Object.fromEntries(MODELS.map((m) => [m.id, m]));

  /* ======================================================================
     Helpers
     ====================================================================== */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const get = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
  const num = (n, d = 0) => n.toLocaleString(LOCALE[state.lang], { minimumFractionDigits: d, maximumFractionDigits: d });
  const LOCALE = { sv: 'sv-SE', en: 'en-GB', fr: 'fr-FR', de: 'de-DE' };

  const ICON = {
    arrow: '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    left: '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8H3M7 4L3 8l4 4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chev: '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M4.5 2.5L8 6l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    down: '<svg width="14" height="14" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5L6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    check: '<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 10.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    search: '<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M13.5 13.5L17 17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    pin: '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5a7 7 0 0 0-7 7c0 5.2 7 12 7 12s7-6.8 7-12a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="currentColor"/></svg>',
    phone: '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z" fill="currentColor"/></svg>',
    mail: '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18v14H3z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 6l9 7 9-7" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    route: '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l9 9-9 9-9-9z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 13v-2h5l-2-2m2 2l-2 2" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    locate: '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="currentColor"/><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 1v3M12 20v3M1 12h3M20 12h3" stroke="currentColor" stroke-width="2"/></svg>',
    book: '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5zM4 21.5A2.5 2.5 0 0 1 6.5 19H20v3H6.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    call: '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    quote: '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h9l5 5v15H6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M14 2v6h6M9 13h8M9 17h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    media: '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 9l5 3-5 3z" fill="currentColor"/></svg>',
    ext: '<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3H3v10h10v-3M9 2h5v5M14 2L7 9" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    download: '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    play: '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>',
    wrench: '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.1L3.5 17.2a1.8 1.8 0 0 0 2.5 2.5l5.8-5.8a4 4 0 0 0 5.1-5.4l-2.6 2.6-2.3-.4-.4-2.3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  };

  const state = { lang: 'en', hp: 180, cat: 'all', route: null };
  let T = I18N.en;

  const content = (id) => (window.CONTENT[state.lang === 'de' ? 'en' : state.lang] || window.CONTENT.en)[id];
  const seriesCover = (id) => {
    const c = window.CONTENT.en[id];
    return c.rangeBanner || (c.sections.find((s) => s.banner) || {}).banner || c.hero;
  };
  const hpRange = (ms) => [Math.min(...ms.map((m) => m.hp[0])), Math.max(...ms.map((m) => m.hp[1]))];
  const widthNums = (w) => w.replace(' m', '').split(' – ').map((v) => parseFloat(v.replace(',', '.')));
  const fmtWidth = (w) => { const [a, b] = widthNums(w); return b && b !== a ? `${num(a, 1)}–${num(b, 1)} m` : `${num(a, 1)} m`; };
  const excerpt = (t, n = 160) => { const p = t.split('\n')[0].trim(); return p.length > n ? `${p.slice(0, n).replace(/\s+\S*$/, '')}…` : p; };
  const modelsOf = (sid) => MODELS.filter((m) => m.range === sid);
  const configLine = (m) => [m.mount && T.mount[m.mount], m.count && `${m.count} ${T.units[m.unit]}`].filter(Boolean).join(' · ');
  const countryName = (() => {
    const cache = {};
    return (code) => {
      if (!code) return '';
      const k = state.lang + code;
      if (!cache[k]) { try { cache[k] = new Intl.DisplayNames([LOCALE[state.lang]], { type: 'region' }).of(code); } catch (e) { cache[k] = code; } }
      return cache[k];
    };
  })();

  /* ======================================================================
     Language
     ====================================================================== */
  function initialLang() {
    const q = new URLSearchParams(location.search).get('lang');
    if (q && I18N[q]) return q;
    try { const s = localStorage.getItem('gb-lang-v2'); if (s && I18N[s]) return s; } catch (e) {}
    return 'en';
  }

  function setLang(lang, rerender = true) {
    state.lang = lang;
    T = I18N[lang];
    document.documentElement.lang = lang;
    $('meta[name="description"]').content = T.metaDesc;
    try { localStorage.setItem('gb-lang-v2', lang); } catch (e) {}
    const url = new URL(location.href);
    url.searchParams.set('lang', lang);
    history.replaceState(null, '', url);
    $$('[data-i18n]').forEach((el) => { const v = get(T, el.dataset.i18n); if (typeof v === 'string') el.textContent = v; });
    $('#langCode').textContent = LANGS[lang].code;
    $('#langFlag').src = flag(lang);
    $('#langList').innerHTML = Object.entries(LANGS).map(([k, v]) => `
      <button class="lang-opt" data-lang="${k}" aria-current="${k === lang}">
        <img class="flag flag--lg" src="${flag(k)}" alt="" width="26" height="26">${esc(v.name)}<span class="lang-opt__code">${v.code}</span><span class="lang-opt__check">${ICON.check}</span>
      </button>`).join('');
    renderMega();
    renderSheet();
    renderFooter();
    syncConceptHeight();
    if (rerender) render();
  }

  /* ======================================================================
     Shell: header, mega menu, mobile sheet, footer
     ====================================================================== */
  const header = $('#header');
  function setSolid() {
    const noHero = document.body.classList.contains('no-hero');
    header.classList.toggle('is-solid', noHero || scrollY > 20);
  }

  function seriesItem(s) {
    const [lo, hi] = hpRange(modelsOf(s.id));
    return `<a class="mega__item" href="#/serie/${s.id}">
      <span class="mega__thumb"><img src="assets/img/models/${s.thumb}.jpg" alt="" loading="lazy"></span>
      <span><b>${esc(s.name)}</b><span>${esc(T.seriesFn[s.id])} · ${lo}–${hi} ${T.hp}</span></span>
    </a>`;
  }

  function renderMega() {
    $('#megaCols').innerHTML = CATS.map((c) => `
      <div class="mega__col">
        <h3>${esc(T.cats[c])}</h3>
        ${SERIES.filter((s) => s.cat === c).map(seriesItem).join('')}
      </div>`).join('') +
      `<a class="link-arrow mega__all" href="#/maskiner">${esc(T.nav.all)} ${ICON.arrow}</a>`;
  }

  function renderSheet() {
    $('#sheetBody').innerHTML = `
      <div class="sheet__group">
        <button class="sheet__title" aria-expanded="false" data-acc>${esc(T.nav.machines)} ${ICON.down}</button>
        <div class="sheet__list" hidden>
          ${SERIES.map(seriesItem).join('')}
          <a class="link-arrow" href="#/maskiner" style="padding:10px 0">${esc(T.nav.all)} ${ICON.arrow}</a>
        </div>
      </div>
      <div class="sheet__group"><a class="sheet__title" href="#/aterforsaljare">${esc(T.nav.dealers)}</a></div>
      <div class="sheet__group"><a class="sheet__title" href="#/kontakt">${esc(T.nav.contact)}</a></div>
      <div class="sheet__group"><a class="sheet__title" href="#/service">${esc(T.nav.services)}</a></div>
      <div class="sheet__langs">${Object.entries(LANGS).map(([k, v]) => `<button data-lang="${k}" aria-current="${k === state.lang}"><img class="flag" src="${flag(k)}" alt="" width="20" height="20">${v.code}</button>`).join('')}</div>
      <a class="btn btn--red btn--block" href="#/kontakt?typ=2">${esc(T.nav.quote)}</a>`;
  }

  function closeMenus(except) {
    if (except !== 'mega') { $('#mega').hidden = true; $('#megaBtn').setAttribute('aria-expanded', 'false'); }
    if (except !== 'lang') { $('#langMenu').hidden = true; $('#langBtn').setAttribute('aria-expanded', 'false'); }
    if (except !== 'sheet') { $('#sheet').hidden = true; $('#burger').setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }
    header.classList.toggle('is-open', !$('#mega').hidden || !$('#sheet').hidden);
  }

  function toggle(name, btn, panel) {
    const open = panel.hidden;
    closeMenus(name);
    panel.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    if (name === 'sheet') document.body.style.overflow = open ? 'hidden' : '';
    header.classList.toggle('is-open', !$('#mega').hidden || !$('#sheet').hidden);
  }

  function initShell() {
    addEventListener('scroll', setSolid, { passive: true });
    $('#megaBtn').addEventListener('click', () => toggle('mega', $('#megaBtn'), $('#mega')));
    $('#langBtn').addEventListener('click', () => toggle('lang', $('#langBtn'), $('#langMenu')));
    $('#burger').addEventListener('click', () => toggle('sheet', $('#burger'), $('#sheet')));

    // open the mega menu on hover for pointer devices
    let t;
    const nav = $('.nav');
    if (matchMedia('(hover: hover)').matches) {
      $('#megaBtn').addEventListener('mouseenter', () => { clearTimeout(t); t = setTimeout(() => { if ($('#mega').hidden) toggle('mega', $('#megaBtn'), $('#mega')); }, 120); });
      header.addEventListener('mouseleave', () => { clearTimeout(t); t = setTimeout(() => { if (!$('#mega').hidden) closeMenus(); }, 220); });
      header.addEventListener('mouseenter', () => clearTimeout(t));
      nav.addEventListener('mouseleave', () => clearTimeout(t));
    }

    document.addEventListener('click', (e) => {
      const l = e.target.closest('[data-lang]');
      if (l) { setLang(l.dataset.lang); closeMenus(); return; }
      const acc = e.target.closest('[data-acc]');
      if (acc) { const open = acc.getAttribute('aria-expanded') !== 'true'; acc.setAttribute('aria-expanded', String(open)); acc.nextElementSibling.hidden = !open; return; }
      if (e.target.closest('a[href]')) { closeMenus(); return; }
      if (!e.target.closest('.pop, .mega, #langBtn, #megaBtn, #burger, .sheet')) closeMenus();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenus(); });
    addEventListener('resize', syncConceptHeight);
  }

  function syncConceptHeight() {
    document.documentElement.style.setProperty('--concept-h', $('.concept').offsetHeight + 'px');
  }

  function renderFooter() {
    $('#footerCols').innerHTML = CATS.map((c) => `
      <div><h2>${esc(T.cats[c])}</h2><ul>${SERIES.filter((s) => s.cat === c).map((s) => `<li><a href="#/serie/${s.id}">${esc(s.name)}</a></li>`).join('')}</ul></div>`).join('') +
      `<div><h2>${esc(T.nav.services)}</h2><ul>
        <li><a href="#/service">${esc(T.service.title)}</a></li>
        <li><a href="#/aterforsaljare">${esc(T.nav.dealers)}</a></li>
        <li><a href="#/kontakt">${esc(T.nav.contact)}</a></li>
        <li><a href="#/service/manualer">${esc(T.service.sub.manuals.title)}</a></li>
        <li><a href="#/service/filmer">${esc(T.service.sub.videos.title)}</a></li>
        <li><a href="#/service/media">${esc(T.service.sub.media.title)}</a></li>
      </ul></div>`;
    $('#legal').innerHTML = T.footer.legal.map((l, i) => `<li><a href="${LEGAL[i]}">${esc(l)}</a></li>`).join('');
  }

  /* ======================================================================
     Router
     ====================================================================== */
  function parseRoute() {
    const raw = location.hash.replace(/^#/, '') || '/';
    const [path, qs] = raw.split('?');
    const parts = path.split('/').filter(Boolean);
    return { parts, query: new URLSearchParams(qs || '') };
  }

  const VIEWS = {
    '': viewHome,
    maskiner: viewMachines,
    serie: viewSeries,
    modell: viewModel,
    aterforsaljare: viewDealers,
    service: viewService,
    kontakt: viewContact,
  };

  let cleanup = null;
  function render() {
    const r = parseRoute();
    const key = r.parts[0] || '';
    const view = VIEWS[key] || viewNotFound;
    if (cleanup) { cleanup(); cleanup = null; }
    const app = $('#app');
    const out = view(r) || {};
    document.body.classList.toggle('no-hero', !out.hero);
    app.innerHTML = `<div class="page">${out.html || ''}</div>`;
    document.title = out.title ? `${out.title} – Grégoire Besson` : T.title;
    $('meta[name="description"]').content = out.desc || T.metaDesc;
    $$('.nav [data-route]').forEach((a) => a.classList.toggle('is-active', a.dataset.route === out.nav));
    $('#megaBtn').classList.toggle('is-active', out.nav === 'machines');
    setSolid();
    if (out.mount) cleanup = out.mount(app) || null;
    observeReveals();
  }

  function navigate() {
    const prev = state.route;
    state.route = location.hash;
    closeMenus();
    render();
    // keep scroll position when only the query changes on the same page
    const samePage = prev && prev.split('?')[0] === location.hash.split('?')[0];
    if (!samePage) scrollTo({ top: 0, behavior: 'instant' in document.documentElement.style ? 'instant' : 'auto' });
    $('#app').focus({ preventScroll: true });
  }

  /* ======================================================================
     Shared components
     ====================================================================== */
  function productCard(m, hp, i = 0) {
    const s = seriesById[m.range];
    const left = ((m.hp[0] - HP_MIN) / (HP_MAX - HP_MIN)) * 100;
    const width = ((m.hp[1] - m.hp[0]) / (HP_MAX - HP_MIN)) * 100;
    const mark = hp == null ? '' : `<b style="left:${((hp - HP_MIN) / (HP_MAX - HP_MIN)) * 100}%"></b>`;
    return `<a class="pcard is-enter" href="#/modell/${m.id}" style="animation-delay:${Math.min(i, 12) * 35}ms">
      <div class="pcard__img"><img src="assets/img/models/${m.id}.jpg" alt="${esc(m.name)}" loading="lazy" width="500" height="333"></div>
      <div class="pcard__body">
        <span class="pcard__series">${esc(s.name)} · ${esc(T.seriesFn[s.id])}</span>
        <h3 class="pcard__name">${esc(m.name)}</h3>
        <div class="pcard__specs"><span class="chip">${m.hp[0]}–${m.hp[1]} ${T.hp}</span><span class="chip">${esc(fmtWidth(m.width))}</span></div>
        <div class="hpbar" aria-hidden="true"><i style="left:${left}%;width:${width}%"></i>${mark}</div>
        <div class="pcard__go"><span>${esc(configLine(m))}</span><span class="pcard__arrow">${ICON.arrow}</span></div>
      </div>
    </a>`;
  }

  function finderHTML({ id, showAll }) {
    return `<div class="finder" id="${id}">
      <div class="finder__top">
        <div class="finder__readout">
          <div class="finder__label">${esc(T.finder.yourTractor)}</div>
          <div class="finder__value"><b data-hpval>${state.hp}</b><span>${T.hp}</span></div>
          <div class="finder__kw" data-kw>${num(Math.round(state.hp * 0.7355))} kW</div>
        </div>
        <div class="slider" data-slider>
          <div class="slider__track"></div>
          <input type="range" min="${HP_MIN}" max="${HP_MAX}" step="5" value="${state.hp}" aria-label="${esc(T.finder.yourTractor)}">
          <div class="slider__ticks">${[50, 150, 250, 350, 450, 600].map((v) => `<button type="button" data-tick="${v}">${v}</button>`).join('')}</div>
        </div>
      </div>
      <div class="finder__bar">
        <div class="seg" role="group">${['all', ...CATS].map((c) => `<button type="button" data-cat="${c}" aria-pressed="${state.cat === c}">${esc(T.cats[c])}</button>`).join('')}</div>
        <p class="finder__count" data-count aria-live="polite"></p>
      </div>
      <div class="finder__results" data-results></div>
      ${showAll ? `<div style="text-align:center;margin-top:28px"><a class="btn btn--line" data-showall href="#/maskiner">${esc(T.finder.viewAll)} ${ICON.arrow}</a></div>` : ''}
    </div>`;
  }

  function mountFinder(root, { limit, grouped } = {}) {
    const input = $('input[type=range]', root);
    const results = $('[data-results]', root);
    let raf;
    const draw = () => {
      const list = MODELS.filter((m) => state.hp >= m.hp[0] && state.hp <= m.hp[1] && (state.cat === 'all' || m.cat === state.cat));
      $('[data-count]', root).innerHTML = `<b>${list.length}</b> ${esc(T.finder.results(list.length).replace(/^\d+\s/, ''))}`;
      if (!list.length) { results.innerHTML = `<div class="empty">${esc(T.finder.none)}</div>`; return; }
      if (grouped) {
        results.innerHTML = SERIES.map((s) => {
          const ms = list.filter((m) => m.range === s.id);
          if (!ms.length) return '';
          return `<div style="margin-bottom:36px">
            <div class="section__head" style="margin-bottom:16px;align-items:center">
              <div><h2 class="h3">${esc(s.name)}</h2><p style="color:var(--muted);margin-top:4px">${esc(T.seriesFn[s.id])}</p></div>
              <a class="link-arrow" href="#/serie/${s.id}">${esc(T.series.see)} ${ICON.arrow}</a>
            </div>
            <div class="grid">${ms.map((m, i) => productCard(m, state.hp, i)).join('')}</div>
          </div>`;
        }).join('');
      } else {
        const shown = limit ? list.slice(0, limit) : list;
        results.innerHTML = `<div class="grid">${shown.map((m, i) => productCard(m, state.hp, i)).join('')}</div>`;
      }
      const all = $('[data-showall]', root);
      if (all) all.href = `#/maskiner?hk=${state.hp}${state.cat !== 'all' ? `&kat=${state.cat}` : ''}`;
    };
    const sync = () => {
      $('[data-hpval]', root).textContent = state.hp;
      $('[data-kw]', root).textContent = `${num(Math.round(state.hp * 0.7355))} kW`;
      $('[data-slider]', root).style.setProperty('--p', ((state.hp - HP_MIN) / (HP_MAX - HP_MIN)) * 100 + '%');
    };
    input.addEventListener('input', () => { state.hp = +input.value; sync(); cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); });
    root.addEventListener('click', (e) => {
      const tick = e.target.closest('[data-tick]');
      if (tick) { state.hp = +tick.dataset.tick; input.value = state.hp; sync(); draw(); }
      const c = e.target.closest('[data-cat]');
      if (c) { state.cat = c.dataset.cat; $$('[data-cat]', root).forEach((b) => b.setAttribute('aria-pressed', String(b === c))); draw(); }
    });
    sync(); draw();
  }

  /* ======================================================================
     Views
     ====================================================================== */
  function viewHome() {
    const h = T.home;
    const cats = CATS.map((c) => {
      const ss = SERIES.filter((s) => s.cat === c);
      const n = MODELS.filter((m) => m.cat === c).length;
      return `<div class="cat reveal">
        <img src="${seriesCover(CAT_IMG[c])}" alt="" loading="lazy">
        <span class="chip chip--glass cat__count">${n} ${esc(T.series.models.toLowerCase())}</span>
        <div class="cat__body">
          <h3>${esc(T.cats[c])}</h3>
          <p>${esc(T.catDesc[c])}</p>
          <div class="cat__chips">${ss.map((s) => `<a class="chip chip--glass" href="#/serie/${s.id}">${esc(s.name)}</a>`).join('')}</div>
        </div>
      </div>`;
    }).join('');

    const rail = SERIES.map((s) => {
      const ms = modelsOf(s.id);
      const [lo, hi] = hpRange(ms);
      return `<a class="scard" href="#/serie/${s.id}">
        <div class="scard__img"><img src="assets/img/models/${s.thumb}.jpg" alt="${esc(s.name)}" loading="lazy"></div>
        <div class="scard__body">
          <h3>${esc(s.name)}</h3>
          <p>${esc(T.seriesFn[s.id])}</p>
          <div class="scard__meta"><span class="chip">${lo}–${hi} ${T.hp}</span><span class="chip">${ms.length} ${esc(T.series.models.toLowerCase())}</span></div>
        </div>
      </a>`;
    }).join('');

    const topCountries = ['SE', 'FR', 'DE', 'PL', 'CA', 'IT'];
    return {
      hero: true,
      html: `
      <section class="hero">
        <img class="hero__img" src="assets/img/field/hero-home-1280.jpg" srcset="assets/img/field/hero-home-800.jpg 800w, assets/img/field/hero-home-1280.jpg 1280w, assets/img/field/hero-home-1920.jpg 1920w" sizes="100vw" alt="" width="1920" height="970" fetchpriority="high">
        <div class="hero__inner">
          <p class="eyebrow eyebrow--light">${esc(h.eyebrow)}</p>
          <h1 class="h1 hero__title">${esc(h.title)}</h1>
          <p class="hero__text">${esc(h.text)}</p>
          <div class="hero__ctas">
            <a class="btn btn--red" href="#/maskiner">${esc(h.ctaFind)} ${ICON.arrow}</a>
            <a class="btn btn--glass" href="#/aterforsaljare">${esc(h.ctaDealer)}</a>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="wrap">
          <div class="section__head reveal">
            <div><p class="eyebrow">${esc(h.finderEyebrow)}</p><h2 class="h2">${esc(h.finderTitle)}</h2><p class="lead">${esc(h.finderText)}</p></div>
          </div>
          <div class="reveal">${finderHTML({ id: 'homeFinder', showAll: true })}</div>
        </div>
      </section>

      <section class="section section--soft">
        <div class="wrap">
          <div class="section__head reveal"><div><p class="eyebrow">${esc(h.catsEyebrow)}</p><h2 class="h2">${esc(h.catsTitle)}</h2></div></div>
          <div class="cats">${cats}</div>
        </div>
      </section>

      <section class="section">
        <div class="wrap">
          <div class="section__head reveal">
            <div><p class="eyebrow">${esc(h.seriesEyebrow)}</p><h2 class="h2">${esc(h.seriesTitle)}</h2></div>
            <div class="rail-nav"><button type="button" data-rail="-1" aria-label="←">${ICON.left}</button><button type="button" data-rail="1" aria-label="→">${ICON.arrow}</button></div>
          </div>
          <div class="rail" id="rail">${rail}</div>
        </div>
      </section>

      <section class="section section--soft">
        <div class="wrap split">
          <div class="split__img reveal"><img src="${seriesCover('rover')}" alt="Rover" loading="lazy"><span class="chip chip--glass">Rover</span></div>
          <div class="split__text reveal">
            <p class="eyebrow">${esc(h.heritageEyebrow)}</p>
            <h2 class="h2">${esc(h.heritageTitle)}</h2>
            <p class="lead">${esc(h.heritageText)}</p>
            <div class="stats">${h.heritageStats.map(([n, l]) => `<div class="stat" style="background:#fff"><b>${esc(n)}</b><span>${esc(l)}</span></div>`).join('')}</div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="wrap">
          <div class="dteaser reveal">
            <div><p class="eyebrow eyebrow--light">${esc(h.dealerEyebrow)}</p><h2 class="h2">${esc(h.dealerTitle)}</h2><p>${esc(h.dealerText)}</p></div>
            <div>
              <form class="searchbar" id="dealerSearch">${ICON.search}<input name="q" placeholder="${esc(h.dealerPlaceholder)}" aria-label="${esc(h.dealerPlaceholder)}"><button class="btn btn--red btn--sm" type="submit">${esc(h.dealerBtn)}</button></form>
              <div class="dteaser__countries">${topCountries.map((c) => `<a class="chip" href="#/aterforsaljare?land=${c}">${esc(countryName(c))} · ${DEALERS.filter((d) => d[4] === c).length}</a>`).join('')}</div>
            </div>
          </div>
        </div>
      </section>

      <section class="section" style="padding-top:0">
        <div class="wrap">
          <div class="ctaband reveal">
            <div><h2 class="h2">${esc(h.ctaTitle)}</h2><p>${esc(h.ctaText)}</p></div>
            <a class="btn btn--white" href="#/kontakt">${esc(h.ctaBtn)} ${ICON.arrow}</a>
          </div>
        </div>
      </section>`,
      mount(app) {
        mountFinder($('#homeFinder', app), { limit: 8 });
        $('#dealerSearch', app).addEventListener('submit', (e) => {
          e.preventDefault();
          location.hash = `#/aterforsaljare?q=${encodeURIComponent(e.target.q.value.trim())}`;
        });
        app.addEventListener('click', (e) => {
          const b = e.target.closest('[data-rail]');
          if (b) { const r = $('#rail', app); r.scrollBy({ left: +b.dataset.rail * r.clientWidth * 0.8, behavior: 'smooth' }); }
        });
      },
    };
  }

  function viewMachines(r) {
    const hk = +r.query.get('hk');
    if (hk >= HP_MIN && hk <= HP_MAX) state.hp = hk;
    const kat = r.query.get('kat');
    if (kat && CATS.includes(kat)) state.cat = kat;
    return {
      nav: 'machines',
      title: T.machines.title,
      desc: T.machines.text,
      html: `
      <header class="phead">
        <div class="wrap">
          <nav class="crumbs"><a href="#/">Grégoire Besson</a>${ICON.chev}<span>${esc(T.nav.machines)}</span></nav>
          <p class="eyebrow">${esc(T.machines.eyebrow)}</p>
          <h1 class="h1">${esc(T.machines.title)}</h1>
          <p class="lead">${esc(T.machines.text)}</p>
        </div>
      </header>
      <section class="section" style="padding-top:40px">
        <div class="wrap">${finderHTML({ id: 'machFinder' })}</div>
      </section>
      ${namesHTML()}`,
      mount(app) {
        mountFinder($('#machFinder', app), { grouped: true });
        mountNames(app);
      },
    };
  }

  function namesHTML() {
    return `<section class="section section--soft" id="names">
        <div class="wrap names">
          <div><h2 class="h2">${esc(T.names.title)}</h2><p class="lead" style="margin-top:14px">${esc(T.names.text)}</p></div>
          <div>
            <label class="searchbar searchbar--line">${ICON.search}<input id="oldSearch" placeholder="${esc(T.names.placeholder)}" autocomplete="off" aria-label="${esc(T.names.title)}"></label>
            <div class="names__list" id="oldList"></div>
          </div>
        </div>
      </section>`;
  }

  function mountNames(app) {
    const list = $('#oldList', app);
    const norm = (t) => t.toLowerCase().replace(/[\s,./()–-]+/g, '');
    let q = '';
    const draw = () => {
      const v = q.trim();
      const rows = OLD_NAMES.filter(([o, n]) => !v || norm(o).includes(norm(v)) || norm(n).includes(norm(v)));
      const hl = (t) => { const i = v ? t.toLowerCase().indexOf(v.toLowerCase()) : -1; return i < 0 ? esc(t) : `${esc(t.slice(0, i))}<mark>${esc(t.slice(i, i + v.length))}</mark>${esc(t.slice(i + v.length))}`; };
      list.innerHTML = rows.length ? rows.map(([o, n]) => `<div class="names__row"><span>${hl(o)}</span>${ICON.arrow}<b>${hl(n)}</b></div>`).join('') : `<div class="names__row">${esc(T.names.empty)}</div>`;
    };
    $('#oldSearch', app).addEventListener('input', (e) => { q = e.target.value; draw(); });
    draw();
  }

  /* --- Service --- */
  const SUBPAGES = { manualer: viewManuals, filmer: viewVideos, media: viewMedia };

  function viewService(r) {
    const sub = r.parts[1];
    if (sub) return SUBPAGES[sub] ? SUBPAGES[sub](r) : viewNotFound();
    const S = T.service;
    const cards = [
      { href: '#/service/manualer', icon: ICON.wrench },
      { href: '#/service/filmer', icon: ICON.media },
      { href: '#/aterforsaljare', icon: ICON.pin },
      { href: '#/service/media', icon: ICON.book },
      { href: '#/kontakt', icon: ICON.call },
    ];
    return {
      nav: 'service',
      title: S.title,
      desc: S.text,
      html: `
      <header class="phead">
        <div class="wrap">
          <nav class="crumbs"><a href="#/">Grégoire Besson</a>${ICON.chev}<span>${esc(T.nav.services)}</span></nav>
          <p class="eyebrow">${esc(S.eyebrow)}</p>
          <h1 class="h1">${esc(S.title)}</h1>
          <p class="lead">${esc(S.text)}</p>
        </div>
      </header>
      <section class="section" style="padding-top:40px">
        <div class="wrap svc">
          ${S.cards.map(([t, d], i) => `<a class="svc__card reveal" href="${cards[i].href}">
              <span class="svc__icon">${cards[i].icon}</span>
              <span class="svc__text"><b>${esc(t)}</b><span>${esc(d)}</span></span>
              <span class="svc__go">${ICON.arrow}</span>
            </a>`).join('')}
        </div>
      </section>
      ${namesHTML()}`,
      mount(app) { mountNames(app); },
    };
  }

  function subHead(title, text) {
    return `<header class="phead">
        <div class="wrap">
          <nav class="crumbs"><a href="#/">Grégoire Besson</a>${ICON.chev}<a href="#/service">${esc(T.nav.services)}</a>${ICON.chev}<span>${esc(title)}</span></nav>
          <p class="eyebrow">${esc(T.service.eyebrow)}</p>
          <h1 class="h1">${esc(title)}</h1>
          <p class="lead">${esc(text)}</p>
        </div>
      </header>`;
  }

  // documents come in the languages Grégoire Besson publishes; Swedish visitors get English first
  function docLangs(d) {
    const pref = state.lang === 'sv' ? 'en' : state.lang;
    return [pref, ...DOC_LANGS.filter((l) => l !== pref)].filter((l) => d.files[l]);
  }
  const docsFor = (sid) => DOCS.filter((d) => d.series.includes(sid));
  const videosFor = (sid) => VIDEOS.filter((v) => v.series === sid);

  function docLinks(d) {
    const [first, ...rest] = docLangs(d);
    return `<div class="doc__dl">
        <a class="btn btn--red btn--sm" href="${d.files[first]}" target="_blank" rel="noopener">${ICON.download} PDF · ${first.toUpperCase()}</a>
        ${rest.map((l) => `<a class="doc__lang" href="${d.files[l]}" target="_blank" rel="noopener" aria-label="PDF ${l.toUpperCase()}">${l.toUpperCase()}</a>`).join('')}
      </div>`;
  }

  function docCard(d, title, text, img) {
    return `<article class="doc reveal">
        <div class="doc__img">${img ? `<img src="${img}" alt="" loading="lazy">` : `<img class="doc__logo" src="assets/img/logo/logo-h-red.svg" alt="">`}</div>
        <div class="doc__body">
          <h3>${esc(title)}</h3>
          ${text ? `<p>${esc(text)}</p>` : ''}
          ${docLinks(d)}
        </div>
      </article>`;
  }

  /* Manuals & spare parts */
  function viewManuals() {
    const M = T.service.sub.manuals;
    const parts = DOCS.find((d) => d.kind === 'parts');
    return {
      nav: 'service',
      title: M.title,
      desc: M.text,
      html: `
      ${subHead(M.title, M.text)}
      <section class="section" style="padding-top:40px">
        <div class="wrap manuals">
          <div>
            <label class="searchbar">${ICON.search}<input id="manSearch" placeholder="${esc(M.search)}" autocomplete="off" aria-label="${esc(M.search)}"></label>
            <div class="manuals__list" id="manList"></div>
          </div>
          <aside class="side">
            ${docCard(parts, M.partsTitle, M.partsText, 'assets/img/models/discordon-t80.jpg')}
            <a class="sidecard" href="#/kontakt?typ=3"><span class="sidecard__icon">${ICON.wrench}</span><div><b>${esc(M.request)}</b><span>${esc(T.contact.types[3])}</span></div></a>
            <p class="note" style="margin:0">${esc(M.launch)}</p>
          </aside>
        </div>
      </section>`,
      mount(app) {
        const list = $('#manList', app);
        const norm = (t) => t.toLowerCase().replace(/[\s,./()+–-]+/g, '');
        const draw = (q) => {
          const v = norm(q);
          // old names point at a current model name
          const viaOld = v ? OLD_NAMES.filter(([o]) => norm(o).includes(v)).map(([, n]) => norm(n)) : [];
          const rows = SERIES.map((s) => {
            const ms = modelsOf(s.id);
            const hitSeries = !v || norm(s.name).includes(v) || norm(T.seriesFn[s.id]).includes(v);
            const hits = v ? ms.filter((m) => norm(m.name).includes(v) || viaOld.some((n) => norm(m.name) === n || norm(m.name).startsWith(n))) : [];
            return { s, ms, hits, show: hitSeries || hits.length };
          }).filter((x) => x.show);
          list.innerHTML = rows.length ? rows.map(({ s, ms, hits }) => {
            const doc = docsFor(s.id)[0];
            const nv = videosFor(s.id).length;
            return `<article class="mcard">
              <img src="assets/img/models/${ms[0].id}.jpg" alt="" loading="lazy" width="500" height="333">
              <div class="mcard__body">
                <h2 class="h3">${esc(s.name)} <span>${esc(T.seriesFn[s.id])}</span></h2>
                <div class="mcard__models">${ms.map((m) => `<a class="chip ${hits.includes(m) ? 'chip--red' : ''}" href="#/kontakt?typ=3&maskin=${m.id}">${esc(m.name)}</a>`).join('')}</div>
                <div class="mcard__actions">
                  <a class="btn btn--red btn--sm" href="#/kontakt?typ=3&serie=${s.id}">${ICON.wrench} ${esc(M.request)}</a>
                  ${doc ? `<a class="btn btn--line btn--sm" href="${doc.files[docLangs(doc)[0]]}" target="_blank" rel="noopener">${ICON.download} ${esc(M.catalogue)} · ${docLangs(doc)[0].toUpperCase()}</a>` : ''}
                  ${nv ? `<a class="btn btn--line btn--sm" href="#/service/filmer?serie=${s.id}">${ICON.media} ${esc(M.videos)} (${nv})</a>` : ''}
                </div>
              </div>
            </article>`;
          }).join('') : `<div class="empty">${esc(M.empty)}</div>`;
        };
        $('#manSearch', app).addEventListener('input', (e) => draw(e.target.value));
        draw('');
      },
    };
  }

  /* Videos */
  const videoTitle = (t) => t.split(/\s+[-–|]\s+/).filter((x) => !/^gr[ée]goire[\s-]besson$/i.test(x.trim())).join(' · ');

  function videoCard(v) {
    const s = seriesById[v.series];
    return `<article class="vcard reveal" data-series="${v.series}">
        <button class="vcard__media" type="button" data-video="${v.id}" aria-label="${esc(T.service.sub.videos.play)}: ${esc(videoTitle(v.title))}">
          <img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="" loading="lazy" width="480" height="360">
          <span class="vcard__play">${ICON.play}</span>
        </button>
        <div class="vcard__body">
          ${s ? `<a class="chip chip--red" href="#/serie/${s.id}">${esc(s.name)}</a>` : ''}
          <h3>${esc(videoTitle(v.title))}</h3>
        </div>
      </article>`;
  }

  // swap the thumbnail for the player only when the visitor asks for it
  function mountVideos(root) {
    root.addEventListener('click', (e) => {
      const b = e.target.closest('[data-video]');
      if (!b) return;
      const f = document.createElement('iframe');
      f.src = `https://www.youtube-nocookie.com/embed/${b.dataset.video}?autoplay=1&rel=0`;
      f.title = b.getAttribute('aria-label');
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      f.className = 'vcard__frame';
      b.replaceWith(f);
    });
  }

  function viewVideos(r) {
    const V = T.service.sub.videos;
    const ids = SERIES.map((s) => s.id).filter((id) => videosFor(id).length);
    let cur = ids.includes(r.query.get('serie')) ? r.query.get('serie') : 'all';
    return {
      nav: 'service',
      title: V.title,
      desc: V.text,
      html: `
      ${subHead(V.title, V.text)}
      <section class="section" style="padding-top:40px">
        <div class="wrap">
          <div class="vbar">
            <div class="seg" role="group">${['all', ...ids].map((id) => `<button type="button" data-vs="${id}" aria-pressed="${cur === id}">${esc(id === 'all' ? V.all : seriesById[id].name)}</button>`).join('')}</div>
            <span class="finder__count" id="vCount"></span>
          </div>
          <div class="vgrid" id="vGrid"></div>
        </div>
      </section>`,
      mount(app) {
        const grid = $('#vGrid', app);
        const draw = () => {
          const vs = VIDEOS.filter((v) => cur === 'all' || v.series === cur);
          grid.innerHTML = vs.map(videoCard).join('');
          $('#vCount', app).innerHTML = `<b>${vs.length}</b> ${esc(V.count(vs.length).replace(/^\d+\s*/, ''))}`;
          observeReveals();
        };
        app.addEventListener('click', (e) => {
          const b = e.target.closest('[data-vs]');
          if (!b) return;
          cur = b.dataset.vs;
          $$('[data-vs]', app).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
          history.replaceState(null, '', cur === 'all' ? '#/service/filmer' : `#/service/filmer?serie=${cur}`);
          state.route = location.hash;
          draw();
        });
        mountVideos(app);
        draw();
      },
    };
  }

  /* Media & brochures */
  function viewMedia() {
    const D = T.service.sub.media;
    const one = (k) => DOCS.find((d) => d.kind === k);
    const cats = DOCS.filter((d) => d.kind === 'catalogue');
    const img = (d) => (d.series[0] ? `assets/img/models/${modelsOf(d.series[0])[0].id}.jpg` : '');
    const fns = (d) => [...new Set(d.series.map((id) => T.seriesFn[id]))].join(' · ');
    return {
      nav: 'service',
      title: D.title,
      desc: D.text,
      html: `
      ${subHead(D.title, D.text)}
      <section class="section" style="padding-top:40px">
        <div class="wrap">
          <h2 class="h3 media__h">${esc(D.essentials)}</h2>
          <div class="docs">
            ${docCard(one('price'), D.price, D.priceText, 'assets/img/models/voyager-c80.jpg')}
            ${docCard(one('range'), D.range, D.rangeText, 'assets/img/models/occitan-t60.jpg')}
            ${docCard(one('parts'), D.parts, D.partsText, 'assets/img/models/discordon-t80.jpg')}
          </div>
          <h2 class="h3 media__h">${esc(D.catalogues)}</h2>
          <div class="docs">
            ${cats.map((d) => docCard(d, d.name, fns(d), img(d))).join('')}
          </div>
          <a class="sidecard media__press" href="mailto:${MARKETING_MAIL}"><span class="sidecard__icon">${ICON.mail}</span><div><b>${esc(D.press)}</b><span>${esc(D.pressText)} ${MARKETING_MAIL}</span></div></a>
        </div>
      </section>`,
    };
  }

  // brochures and videos on each series page
  function seriesMediaHTML(sid) {
    const docs = docsFor(sid), vids = videosFor(sid);
    if (!docs.length && !vids.length) return '';
    const V = T.service.sub.videos;
    return `<section class="section" id="media">
        <div class="wrap">
          <div class="section__head reveal"><div><p class="eyebrow">${esc(seriesById[sid].name)}</p><h2 class="h2">${esc(vids.length ? V.title : T.service.sub.media.docs)}</h2></div>
            ${vids.length ? `<a class="link-arrow" href="#/service/filmer?serie=${sid}">${esc(V.more)} ${ICON.arrow}</a>` : ''}</div>
          ${vids.length ? `<div class="vgrid">${vids.slice(0, 3).map(videoCard).join('')}</div>` : ''}
          ${docs.map((d) => `<div class="sdoc reveal"><span class="doc__icon">${ICON.book}</span><div><b>${esc(T.service.sub.manuals.catalogue)} ${esc(d.name)}</b></div>${docLinks(d)}</div>`).join('')}
        </div>
      </section>`;
  }

  /* --- Series page --- */
  function classify(sec) {
    const f = sec.features;
    if (f.length && f.every((x) => !x.img && /^[«"“]/.test(x.text))) return 'reviews';
    if (f.length >= 3 && f.every((x) => !x.img && !x.title && x.text.length < 140)) return 'recap';
    if (f.length && f.length <= 4 && f.every((x) => x.img && (x.text || x.title)) && f.some((x) => x.text.length > 80)) return 'rows';
    if (f.length) return 'grid';
    return 'text';
  }

  function featureCard(f) {
    const long = f.text.length > 220;
    return `<article class="fcard">
      ${f.img ? `<div class="fcard__img"><img src="${f.img}" alt="${esc(f.title)}" loading="lazy"></div>` : ''}
      <div class="fcard__body">
        ${f.title ? `<h3>${esc(f.title)}</h3>` : ''}
        ${f.text ? `<p class="${long ? 'clamp' : ''}">${esc(f.text)}</p>` : ''}
        ${long ? `<button type="button" class="fcard__more" data-more>${esc(T.series.readMore)}</button>` : ''}
      </div>
    </article>`;
  }

  const VIDEO_BTN = /^(Watch the second video|Se den andra filmen|Regardez la deuxi|Voir la deuxi)/i;
  function sectionHTML(sec, idx) {
    sec = { ...sec, features: sec.features.filter((f) => !VIDEO_BTN.test(f.text)) };
    const kind = classify(sec);
    const head = (sec.title || sec.sub) ? `<div class="block__head reveal">${sec.title ? `<h2 class="h2">${esc(sec.title)}</h2>` : ''}${sec.sub ? `<p class="lead">${esc(sec.sub)}</p>` : ''}</div>` : '';
    const banner = sec.banner ? `<div class="block__banner reveal"><img src="${sec.banner}" alt="" loading="lazy"></div>` : '';
    let body = '';
    if (kind === 'rows') {
      body = `<div class="feat-alt">${sec.features.map((f, i) => `
        <div class="feat-row reveal">
          <div class="feat-row__img"><img src="${f.img}" alt="${esc(f.title)}" loading="lazy"></div>
          <div><span class="feat-num">${String(i + 1).padStart(2, '0')}</span>${f.title ? `<h3 class="h3">${esc(f.title)}</h3>` : ''}<p>${esc(f.text)}</p></div>
        </div>`).join('')}</div>`;
    } else if (kind === 'grid') {
      body = `<div class="feat-grid reveal">${sec.features.map(featureCard).join('')}</div>`;
    } else if (kind === 'reviews') {
      body = `<div class="reviews">${sec.features.map((f) => `
        <figure class="review reveal" style="margin:0">
          <p>${esc(f.text.replace(/^[«"“]\s*|\s*[»"”]$/g, ''))}</p>
          <footer><span class="review__avatar">${esc((f.title || '?').trim()[0])}</span>${esc(f.title)}</footer>
        </figure>`).join('')}</div>`;
    } else if (kind === 'recap') {
      body = `<ul class="recap reveal">${sec.features.map((f) => `<li>${ICON.check}<span>${esc(f.text)}</span></li>`).join('')}</ul>`;
    }
    if (kind === 'text' && !banner && !sec.sub) return '';
    const id = kind === 'reviews' ? 'reviews' : kind === 'recap' ? 'recap' : `sec-${idx}`;
    return `<section class="block" id="${id}" data-kind="${kind}"><div class="wrap">${banner}${head}${body}</div></section>`;
  }

  function viewSeries(r) {
    const sid = r.parts[1];
    const s = seriesById[sid];
    if (!s) return viewNotFound();
    const c = content(sid);
    const ms = modelsOf(sid);
    const [lo, hi] = hpRange(ms);
    const ws = ms.flatMap((m) => widthNums(m.width));
    const wlo = Math.min(...ws), whi = Math.max(...ws);
    const sections = c.sections.map(sectionHTML);
    const firstFeature = c.sections.findIndex((x) => ['rows', 'grid'].includes(classify(x)));
    const hasReviews = c.sections.some((x) => classify(x) === 'reviews');
    const hasRecap = c.sections.some((x) => classify(x) === 'recap');
    const hero = c.hero || seriesCover(sid);

    return {
      hero: true,
      nav: 'machines',
      title: `${s.name} – ${T.seriesFn[sid]}`,
      desc: c.intro,
      html: `
      <section class="shero">
        <img class="shero__img" src="${hero}" alt="">
        <div class="shero__inner">
          <nav class="crumbs"><a href="#/">Grégoire Besson</a>${ICON.chev}<a href="#/maskiner">${esc(T.nav.machines)}</a>${ICON.chev}<span>${esc(T.cats[s.cat])}</span></nav>
          <h1>${esc(s.name)}</h1>
          <p class="shero__fn">${esc(T.seriesFn[sid])}</p>
          <div class="shero__ctas">
            <a class="btn btn--red" href="#/kontakt?typ=2&serie=${sid}">${esc(T.series.quote)} ${ICON.arrow}</a>
            <a class="btn btn--glass" href="#/aterforsaljare">${esc(T.series.dealer)}</a>
          </div>
        </div>
      </section>

      <section class="overview">
        <div class="wrap overview__inner">
          <p class="overview__intro reveal">${esc(c.intro)}</p>
          <div class="kpis reveal">
            <div class="kpi"><span>${esc(T.series.power)}</span><b>${lo}–${hi} ${T.hp}</b></div>
            <div class="kpi"><span>${esc(T.series.width)}</span><b>${num(wlo, 1)}–${num(whi, 1)} m</b></div>
            <div class="kpi"><span>${esc(T.series.models)}</span><b>${ms.length}</b></div>
          </div>
        </div>
      </section>

      <nav class="subnav">
        <div class="wrap subnav__inner">
          <b>${esc(s.name)}</b>
          <a href="#models" data-jump="models" class="is-active">${esc(T.series.modelsTitle)}</a>
          ${firstFeature >= 0 ? `<a href="#sec-${firstFeature}" data-jump="sec-${firstFeature}">${esc(T.series.highlights)}</a>` : ''}
          ${hasReviews ? `<a href="#reviews" data-jump="reviews">${esc(T.series.reviews)}</a>` : ''}
          ${hasRecap ? `<a href="#recap" data-jump="recap">${esc(T.series.recap)}</a>` : ''}
          <a class="btn btn--red btn--sm" href="#/kontakt?typ=2&serie=${sid}">${esc(T.series.quote)}</a>
        </div>
      </nav>

      <section class="section" id="models">
        <div class="wrap">
          <div class="section__head reveal"><div><p class="eyebrow">${esc(T.series.modelsTitle)}</p><h2 class="h2" style="white-space:pre-line">${esc(c.rangeTitle || `${s.name} · ${ms.length} ${T.series.models.toLowerCase()}`)}</h2></div></div>
          <div class="grid">${ms.map((m, i) => productCard(m, null, i)).join('')}</div>
        </div>
      </section>

      ${T.series.contentNote ? `<div class="wrap"><p class="note">${esc(T.series.contentNote)}</p></div>` : ''}
      ${sections.join('')}
      ${seriesMediaHTML(sid)}

      <section class="section" style="padding-top:24px">
        <div class="wrap">
          <div class="ctaband reveal">
            <div><h2 class="h2">${esc(T.home.ctaTitle)}</h2><p>${esc(T.home.ctaText)}</p></div>
            <div style="display:flex;gap:10px;flex-wrap:wrap">
              <a class="btn btn--white" href="#/kontakt?typ=2&serie=${sid}">${esc(T.series.quote)} ${ICON.arrow}</a>
              <a class="btn btn--glass" href="#/kontakt?typ=0&serie=${sid}">${esc(T.series.brochure)}</a>
            </div>
          </div>
        </div>
      </section>`,
      mount(app) {
        app.addEventListener('click', (e) => {
          const j = e.target.closest('[data-jump]');
          if (j) { e.preventDefault(); const t = document.getElementById(j.dataset.jump); if (t) t.scrollIntoView({ behavior: 'smooth' }); }
          const more = e.target.closest('[data-more]');
          if (more) {
            const p = more.previousElementSibling;
            const open = p.classList.toggle('clamp');
            more.textContent = open ? T.series.readMore : T.series.readLess;
          }
        });
        // highlight the subnav item for the section in view
        const links = $$('.subnav [data-jump]', app);
        const targets = links.map((l) => document.getElementById(l.dataset.jump)).filter(Boolean);
        const io = new IntersectionObserver((entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) links.forEach((l) => l.classList.toggle('is-active', l.dataset.jump === en.target.id));
          });
        }, { rootMargin: '-40% 0px -55% 0px' });
        targets.forEach((t) => io.observe(t));
        mountVideos(app);
        return () => io.disconnect();
      },
    };
  }

  /* --- Model page --- */
  function viewModel(r) {
    const m = modelById[r.parts[1]];
    if (!m) return viewNotFound();
    const s = seriesById[m.range];
    const c = content(s.id);
    const kw = m.hp.map((v) => num(v * 0.7355, 0));
    const [wa, wb] = widthNums(m.width);
    const ft = [wa, wb].filter((v) => v != null && !Number.isNaN(v)).map((v) => num(v * 3.2808, 1));
    const others = modelsOf(s.id).filter((x) => x.id !== m.id);
    const hl = c.sections.filter((x) => ['rows', 'grid'].includes(classify(x))).flatMap((x) => x.features).filter((f) => f.title && f.text).slice(0, 3);
    return {
      nav: 'machines',
      title: m.name,
      desc: `${m.name} – ${T.seriesFn[s.id]}. ${m.hp[0]}–${m.hp[1]} ${T.hp}, ${fmtWidth(m.width)}${configLine(m) ? `, ${configLine(m)}` : ''}.`,
      html: `
      <header class="phead" style="padding-bottom:0;background:none">
        <div class="wrap"><nav class="crumbs"><a href="#/">Grégoire Besson</a>${ICON.chev}<a href="#/maskiner">${esc(T.nav.machines)}</a>${ICON.chev}<a href="#/serie/${s.id}">${esc(s.name)}</a>${ICON.chev}<span>${esc(m.name)}</span></nav></div>
      </header>
      <section class="section" style="padding-top:12px">
        <div class="wrap model">
          <div class="model__stage"><img src="assets/img/models/${m.id}.jpg" alt="${esc(m.name)}"></div>
          <div class="model__info">
            <a class="chip chip--red" href="#/serie/${s.id}">${esc(s.name)} · ${esc(T.seriesFn[s.id])}</a>
            <h1>${esc(m.name)}</h1>
            <p class="lead">${esc(c.intro.split('. ')[0].replace(/\.$/, ''))}.</p>
            <div class="spec">
              <div class="spec__row"><span>${esc(T.model.tractors)}</span><b>${m.hp[0]} → ${m.hp[1]} ${T.hp}<small>${kw[0]} → ${kw[1]} kW</small></b></div>
              <div class="spec__row"><span>${esc(T.model.width)}</span><b>${esc(fmtWidth(m.width).replace('–', ' → '))}<small>${ft.join(' → ')} ft</small></b></div>
              ${configLine(m) ? `<div class="spec__row"><span>${esc(T.model.config)}</span><b>${esc(configLine(m))}</b></div>` : ''}
            </div>
            <div class="model__ctas">
              <a class="btn btn--red" href="#/kontakt?typ=2&maskin=${m.id}">${esc(T.series.quote)}</a>
              <a class="btn btn--line" href="#/kontakt?typ=0&maskin=${m.id}">${esc(T.series.brochure)}</a>
            </div>
            <a class="link-arrow" href="#/aterforsaljare" style="margin-top:18px">${ICON.pin} ${esc(T.series.dealer)}</a>
            ${hl.length ? `<h2 class="h3" style="margin-top:40px">${esc(T.model.highlights)}</h2>
            <ul class="model__hl">${hl.map((f) => `<li><span style="color:var(--red)">${ICON.check}</span><div><b>${esc(f.title)}</b><span>${esc(excerpt(f.text))}</span></div></li>`).join('')}</ul>
            <a class="link-arrow" href="#/serie/${s.id}" style="margin-top:16px">${esc(T.model.seeAll)} ${ICON.arrow}</a>` : ''}
          </div>
        </div>
      </section>
      ${others.length ? `<section class="section section--soft">
        <div class="wrap">
          <div class="section__head"><h2 class="h2">${esc(T.model.others)}</h2><a class="link-arrow" href="#/serie/${s.id}">${esc(T.model.seeAll)} ${ICON.arrow}</a></div>
          <div class="grid">${others.map((o, i) => productCard(o, null, i)).join('')}</div>
        </div>
      </section>` : ''}`,
    };
  }

  /* --- Dealers --- */
  let leafletLoading = null;
  function loadLeaflet() {
    if (window.L) return Promise.resolve();
    if (leafletLoading) return leafletLoading;
    const base = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/';
    const css = document.createElement('link');
    css.rel = 'stylesheet'; css.href = base + 'leaflet.min.css';
    document.head.appendChild(css);
    leafletLoading = new Promise((resolve, reject) => {
      const js = document.createElement('script');
      js.src = base + 'leaflet.min.js'; js.onload = resolve; js.onerror = reject;
      document.head.appendChild(js);
    });
    return leafletLoading;
  }

  function viewDealers(r) {
    const q0 = r.query.get('q') || '';
    const land0 = r.query.has('land') ? r.query.get('land') : (q0 ? '' : DEFAULT_COUNTRY[state.lang]);
    const counts = {};
    DEALERS.forEach((d) => { counts[d[4]] = (counts[d[4]] || 0) + 1; });
    const countries = Object.keys(counts).sort((a, b) => countryName(a).localeCompare(countryName(b), LOCALE[state.lang]));
    return {
      nav: 'dealers',
      title: T.dealers.title,
      desc: T.dealers.text,
      html: `
      <header class="phead" style="padding-bottom:28px">
        <div class="wrap">
          <nav class="crumbs"><a href="#/">Grégoire Besson</a>${ICON.chev}<span>${esc(T.nav.dealers)}</span></nav>
          <h1 class="h1">${esc(T.dealers.title)}</h1>
          <p class="lead">${esc(T.dealers.text)}</p>
        </div>
      </header>
      <section style="padding:16px 0 0">
        <div class="wrap dealers">
          <div class="dealers__panel">
            <div class="dealers__controls">
              <label class="searchbar searchbar--line" style="padding-left:16px">${ICON.search}<input id="dq" value="${esc(q0)}" placeholder="${esc(T.dealers.search)}" autocomplete="off"></label>
              <div class="dealers__row">
                <div class="select"><select id="dland" aria-label="${esc(T.contact.country)}">
                  <option value="">${esc(T.dealers.allCountries)} (${DEALERS.length})</option>
                  ${countries.map((c) => `<option value="${c}" ${c === land0 ? 'selected' : ''}>${esc(countryName(c))} (${counts[c]})</option>`).join('')}
                </select></div>
                <button class="btn btn--line btn--sm" type="button" id="dnear" style="height:44px">${ICON.locate} ${esc(T.dealers.nearMe)}</button>
              </div>
              <p class="dealers__count" id="dcount" aria-live="polite"></p>
            </div>
            <div class="dealers__list" id="dlist"></div>
          </div>
          <div class="dealers__map" id="dmap"></div>
        </div>
      </section>`,
      mount(app) {
        let me = null, page = 1, map = null, layer = null, markers = [], current = [];
        const dist = (a, b, c, d) => { const R = 6371, r1 = (x) => x * Math.PI / 180; const dl = r1(c - a), dg = r1(d - b); const h = Math.sin(dl / 2) ** 2 + Math.cos(r1(a)) * Math.cos(r1(c)) * Math.sin(dg / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
        const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
        const card = (d, i) => {
          const [name, addr, zip, city, cc, lat, lng, phone, email] = d;
          const km = me ? `<span class="dcard__dist">${num(Math.round(dist(me[0], me[1], lat, lng)))} ${T.dealers.km}</span>` : '';
          return `<div class="dcard" data-i="${i}" role="button" tabindex="0">
            <div class="dcard__top"><b>${esc(name)}</b>${km}</div>
            <div class="dcard__addr">${esc([addr, `${zip} ${city}`.trim(), countryName(cc)].filter(Boolean).join(', '))}</div>
            <div class="dcard__actions">
              <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" rel="noopener">${ICON.route} ${esc(T.dealers.directions)}</a>
            </div>
            ${phone || email ? `<div class="dcard__rep"><span>${esc(T.dealers.rep)}</span>
              ${phone ? `<a href="tel:${phone.replace(/\s/g, '')}">${ICON.phone} ${esc(phone)}</a>` : ''}
              ${email ? `<a href="mailto:${esc(email)}">${ICON.mail} ${esc(email)}</a>` : ''}
            </div>` : ''}
          </div>`;
        };
        const filter = () => {
          const q = norm($('#dq', app).value.trim());
          const land = $('#dland', app).value;
          let list = DEALERS.filter((d) => (!land || d[4] === land) && (!q || norm(`${d[0]} ${d[1]} ${d[2]} ${d[3]}`).includes(q)));
          if (me) list = list.slice().sort((a, b) => dist(me[0], me[1], a[5], a[6]) - dist(me[0], me[1], b[5], b[6]));
          current = list;
          page = 1;
          drawList();
          drawMap(true);
        };
        const drawList = () => {
          const n = current.length;
          $('#dcount', app).textContent = T.dealers.results(n);
          const shown = current.slice(0, page * 40);
          $('#dlist', app).innerHTML = n
            ? shown.map((d) => card(d, DEALERS.indexOf(d))).join('') + (n > shown.length ? `<button class="btn btn--line btn--block dealers__more" id="dmore" type="button">${esc(T.dealers.more)} (${n - shown.length})</button>` : '')
            : `<div class="empty" style="margin:8px">${esc(T.dealers.none)}</div>`;
        };
        const drawMap = (fit) => {
          if (!map) return;
          layer.clearLayers();
          markers = [];
          current.forEach((d) => {
            const i = DEALERS.indexOf(d);
            const mk = L.circleMarker([d[5], d[6]], { radius: 6, weight: 2, color: '#fff', fillColor: '#e2001a', fillOpacity: 1 })
              .bindPopup(`<b>${esc(d[0])}</b><br>${esc([d[1], `${d[2]} ${d[3]}`.trim()].filter(Boolean).join(', '))}<br>${esc(countryName(d[4]))}`);
            mk.on('click', () => highlight(i, false));
            mk.addTo(layer);
            markers[i] = mk;
          });
          if (fit && current.length) {
            const b = L.latLngBounds(current.map((d) => [d[5], d[6]]));
            map.fitBounds(b.pad(0.15), { maxZoom: 10, animate: false });
          }
        };
        const highlight = (i, fly = true) => {
          $$('.dcard', app).forEach((c) => c.classList.toggle('is-active', +c.dataset.i === i));
          const el = $(`.dcard[data-i="${i}"]`, app);
          if (el && !fly) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          if (map && markers[i]) {
            if (fly) map.flyTo(markers[i].getLatLng(), Math.max(map.getZoom(), 11), { duration: 0.8 });
            markers[i].openPopup();
          }
        };
        const initMap = () => {
          if (!document.body.contains($('#dmap', app))) return;
          map = L.map($('#dmap', app), { zoomControl: true, scrollWheelZoom: true, preferCanvas: true }).setView([48.5, 10], 4);
          L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 19,
          }).addTo(map);
          layer = L.layerGroup().addTo(map);
          drawMap(true);
        };
        let t;
        $('#dq', app).addEventListener('input', () => { clearTimeout(t); t = setTimeout(filter, 150); });
        $('#dland', app).addEventListener('change', filter);
        $('#dnear', app).addEventListener('click', (e) => {
          const btn = e.currentTarget;
          if (!navigator.geolocation) return;
          btn.innerHTML = `${ICON.locate} ${esc(T.dealers.locating)}`;
          navigator.geolocation.getCurrentPosition((pos) => {
            me = [pos.coords.latitude, pos.coords.longitude];
            $('#dland', app).value = '';
            btn.innerHTML = `${ICON.locate} ${esc(T.dealers.nearMe)}`;
            filter();
            if (map && current[0]) map.flyTo([current[0][5], current[0][6]], 9);
          }, () => { btn.innerHTML = `${ICON.locate} ${esc(T.dealers.nearMe)}`; });
        });
        $('#dlist', app).addEventListener('click', (e) => {
          if (e.target.closest('a')) return;
          if (e.target.closest('#dmore')) { page++; drawList(); return; }
          const c = e.target.closest('.dcard');
          if (c) highlight(+c.dataset.i);
        });
        $('#dlist', app).addEventListener('keydown', (e) => {
          const c = e.target.closest('.dcard');
          if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); highlight(+c.dataset.i); }
        });
        filter();
        loadLeaflet().then(initMap).catch(() => {});
        return () => { if (map) { map.stop(); map.off(); map.remove(); map = null; } };
      },
    };
  }

  /* --- Contact --- */
  function viewContact(r) {
    const typ = r.query.has('typ') ? +r.query.get('typ') : null;
    const pre = r.query.get('maskin') ? modelById[r.query.get('maskin')]?.name : (r.query.get('serie') ? seriesById[r.query.get('serie')]?.name : '');
    const C = T.contact;
    const icons = [ICON.book, ICON.call, ICON.quote, ICON.wrench];
    const ccs = [...new Set([...DEALERS.map((d) => d[4]), ...EXTRA_COUNTRIES])].sort((a, b) => countryName(a).localeCompare(countryName(b), LOCALE[state.lang]));
    const defCC = DEFAULT_COUNTRY[state.lang] || '';
    const field = (name, label, type = 'text', req = true, ac = '') => `
      <div class="field" data-field="${name}">
        <input id="f-${name}" name="${name}" type="${type}" placeholder=" " ${req ? 'required' : ''} ${ac ? `autocomplete="${ac}"` : ''}>
        <label for="f-${name}">${esc(label)}${req ? ' *' : ''}</label>
      </div>`;
    return {
      nav: 'contact',
      title: C.title,
      desc: C.text,
      html: `
      <header class="phead">
        <div class="wrap">
          <nav class="crumbs"><a href="#/">Grégoire Besson</a>${ICON.chev}<span>${esc(T.nav.contact)}</span></nav>
          <p class="eyebrow">${esc(C.eyebrow)}</p>
          <h1 class="h1">${esc(C.title)}</h1>
          <p class="lead">${esc(C.text)}</p>
        </div>
      </header>
      <section class="section" style="padding-top:40px">
        <div class="wrap contact">
          <form class="form" id="cform" novalidate>
            <h2>${esc(C.want)}</h2>
            <div class="types" role="radiogroup">
              ${C.types.map((t, i) => `<label class="type"><input type="radio" name="type" value="${i}" ${typ === i ? 'checked' : ''}><span class="type__box"><span class="type__icon">${icons[i]}</span><b>${esc(t)}</b></span></label>`).join('')}
            </div>
            <p class="field__err" id="typeErr" hidden style="margin:-16px 0 20px">${esc(C.pick)}</p>
            <div class="fields">
              ${field('firstname', C.firstname, 'text', true, 'given-name')}
              ${field('lastname', C.lastname, 'text', true, 'family-name')}
              ${field('email', C.email, 'email', true, 'email')}
              ${field('phone', C.phone, 'tel', true, 'tel')}
              ${field('company', C.company, 'text', false, 'organization')}
              ${field('zip', C.zip, 'text', true, 'postal-code')}
              ${field('city', C.city, 'text', true, 'address-level2')}
              <div class="field field--select" data-field="country">
                <select id="f-country" name="country" required>
                  ${ccs.map((c) => `<option value="${c}" ${c === defCC ? 'selected' : ''}>${esc(countryName(c))}</option>`).join('')}
                </select><label for="f-country">${esc(C.country)} *</label>
              </div>
              <div class="field field--select field--wide" data-field="machine">
                <select id="f-machine" name="machine">
                  <option value="">${esc(C.machineAny)}</option>
                  ${SERIES.map((s) => `<optgroup label="${esc(s.name)} – ${esc(T.seriesFn[s.id])}">
                    <option value="${esc(s.name)}" ${pre === s.name ? 'selected' : ''}>${esc(s.name)} (${esc(T.series.see.toLowerCase())})</option>
                    ${modelsOf(s.id).map((m) => `<option ${pre === m.name ? 'selected' : ''}>${esc(m.name)}</option>`).join('')}
                  </optgroup>`).join('')}
                </select><label for="f-machine">${esc(C.machine)}</label>
              </div>
              <div class="field field--wide" data-field="message">
                <textarea id="f-message" name="message" placeholder=" "></textarea><label for="f-message">${esc(C.message)}</label>
              </div>
            </div>
            <label class="check" id="consent"><input type="checkbox" name="consent" required><span class="check__box">${ICON.check.replace('#fff', 'currentColor').replace('width="18" height="18"', 'width="14" height="14" style="color:#fff"')}</span><span>${esc(C.consent)}</span></label>
            <button class="btn btn--red btn--block" type="submit">${esc(C.send)} ${ICON.arrow}</button>
          </form>
          <aside class="side">
            <a class="sidecard sidecard--img" href="#/aterforsaljare"><img src="${seriesCover('voyager')}" alt="" loading="lazy"><div><b>${esc(C.sideDealer)}</b><span>${esc(C.sideDealerText)}</span></div></a>
            <a class="sidecard" href="#/service/media"><span class="sidecard__icon">${ICON.media}</span><div><b>${esc(C.sideMedia)}</b><span>${esc(C.sideMediaText)}</span></div></a>
            <div class="sidecard" style="flex-direction:column;align-items:flex-start"><b>${esc(C.sideFollow)}</b>${$('.footer .social').outerHTML}</div>
          </aside>
        </div>
      </section>`,
      mount(app) {
        const form = $('#cform', app);
        const err = (wrap, msg) => {
          wrap.classList.toggle('is-invalid', !!msg);
          let e = $('.field__err', wrap);
          if (msg) { if (!e) { e = document.createElement('span'); e.className = 'field__err'; wrap.appendChild(e); } e.textContent = msg; } else if (e) e.remove();
        };
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          let first = null;
          const type = form.type.value;
          $('#typeErr', app).hidden = type !== '';
          if (type === '') first = $('.type input', form);
          $$('[data-field]', form).forEach((w) => {
            const inp = $('input, select, textarea', w);
            if (!inp.required) return;
            let msg = '';
            if (!inp.value.trim()) msg = C.required;
            else if (inp.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value)) msg = C.invalidEmail;
            err(w, msg);
            if (msg && !first) first = inp;
          });
          const cons = form.consent.checked;
          $('#consent', app).classList.toggle('is-invalid', !cons);
          if (!cons && !first) first = form.consent;
          if (first) { first.focus(); first.closest('.field, .types, .check')?.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
          // Demo only: no backend is wired up. Connect this to the client's CRM / mail endpoint.
          form.innerHTML = `<div class="form__ok"><div class="form__ok-icon">${ICON.check.replace('width="18" height="18"', 'width="34" height="34"')}</div><h2 class="h3">${esc(C.sent)}</h2><p>${esc(C.sentText)}</p><a class="btn btn--line" href="#/kontakt?n=${Date.now()}">${esc(C.again)}</a></div>`;
          form.scrollIntoView({ block: 'center', behavior: 'smooth' });
        });
        form.addEventListener('input', (e) => {
          const w = e.target.closest('[data-field]');
          if (w && w.classList.contains('is-invalid') && e.target.value.trim()) err(w, '');
          if (e.target.name === 'type') $('#typeErr', app).hidden = true;
          if (e.target.name === 'consent') $('#consent', app).classList.remove('is-invalid');
        });
      },
    };
  }

  function viewNotFound() {
    return { html: `<header class="phead"><div class="wrap"><h1 class="h1">404</h1><p class="lead">${esc(T.notFound)}</p><a class="btn btn--red" href="#/" style="margin-top:24px">Grégoire Besson ${ICON.arrow}</a></div></header>` };
  }

  /* ======================================================================
     Reveal on scroll
     ====================================================================== */
  let io;
  function observeReveals() {
    const els = $$('.reveal:not(.is-in)');
    if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-in')); return; }
    io = io || new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -6% 0px' });
    els.forEach((el) => io.observe(el));
  }

  /* ======================================================================
     Boot
     ====================================================================== */
  $('#year').textContent = new Date().getFullYear();
  initShell();
  setLang(initialLang(), false);
  state.route = location.hash;
  addEventListener('hashchange', navigate);
  render();
})();

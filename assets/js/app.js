(() => {
  const SERIES = [
    { id: 'prima', name: 'Prima', cat: 'ploughs' },
    { id: 'rover', name: 'Rover', cat: 'ploughs' },
    { id: 'voyager', name: 'Voyager', cat: 'ploughs' },
    { id: 'explor', name: 'Explor', cat: 'discs' },
    { id: 'discordon', name: 'Discordon', cat: 'discs' },
    { id: 'cover', name: 'Cover', cat: 'discs' },
    { id: 'normandie', name: 'Normandie', cat: 'discs' },
    { id: 'occitan', name: 'Occitan', cat: 'discs' },
    { id: 'helios', name: 'Helios', cat: 'tines' },
    { id: 'crossland', name: 'Crossland', cat: 'tines' },
    { id: 'tetra', name: 'Tetra', cat: 'tines' },
  ];
  const CATS = ['ploughs', 'discs', 'tines'];
  const MENU_THUMB = { prima: 'prima-70', rover: 'rover-70', voyager: 'voyager-c80', explor: 'explor-t80', discordon: 'discordon-t80', cover: 'cover-x-t70', normandie: 'normandieplus-t70', occitan: 'occitan-t60', helios: 'helios-duo-t90', crossland: 'crossland-t70', tetra: 'tetra-60' };
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
  const fmt = (n, d = 2) => n.toFixed(d).replace('.', ',');

  const state = { lang: 'sv', min: HP_MIN, max: HP_MAX, cat: 'all', query: '', type: null };
  let T = I18N.sv;

  /* ---------- Language ---------- */
  function initialLang() {
    const q = new URLSearchParams(location.search).get('lang');
    if (q && I18N[q]) return q;
    try { const s = localStorage.getItem('gb-lang'); if (s && I18N[s]) return s; } catch (e) {}
    return 'sv';
  }

  function setLang(lang) {
    state.lang = lang;
    T = I18N[lang];
    document.documentElement.lang = lang;
    document.title = T.title;
    $('meta[name="description"]').content = T.metaDesc;
    try { localStorage.setItem('gb-lang', lang); } catch (e) {}
    const url = new URL(location.href);
    url.searchParams.set('lang', lang);
    history.replaceState(null, '', url);

    $$('[data-i18n]').forEach((el) => { const v = get(T, el.dataset.i18n); if (typeof v === 'string') el.textContent = v; });
    $$('[data-i18n-placeholder]').forEach((el) => { el.placeholder = get(T, el.dataset.i18nPlaceholder); });
    $('#langCurrent').textContent = LANGS[lang];
    $('#langList').innerHTML = Object.entries(LANGS).map(([k, v]) =>
      `<li><button data-lang="${k}" aria-current="${k === lang}">${v}</button></li>`).join('');

    renderMega();
    renderPills();
    renderRanges();
    renderSlider();
    renderCorr();
    renderTypes();
    renderFooter();
  }

  /* ---------- Dropdowns (top bar, nav) ---------- */
  function closeAll(except) {
    $$('[data-dd]').forEach((dd) => {
      if (dd === except) return;
      $('.dd__btn', dd).setAttribute('aria-expanded', 'false');
      $('.dd__menu', dd).hidden = true;
    });
  }
  function initDropdowns() {
    document.addEventListener('click', (e) => {
      const lang = e.target.closest('[data-lang]');
      if (lang) { setLang(lang.dataset.lang); closeAll(); return; }
      const btn = e.target.closest('.dd__btn');
      if (btn) {
        const dd = btn.closest('[data-dd]');
        const open = btn.getAttribute('aria-expanded') !== 'true';
        closeAll(dd);
        btn.setAttribute('aria-expanded', String(open));
        $('.dd__menu', dd).hidden = !open;
        return;
      }
      if (!e.target.closest('.dd__menu')) closeAll();
      if (e.target.closest('.dd__menu a')) { closeAll(); closeMobileNav(); }
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });
  }

  /* ---------- Navbar ---------- */
  function closeMobileNav() {
    $('#navMenu').classList.remove('is-open');
    $('#navToggle').setAttribute('aria-expanded', 'false');
  }
  function initNavbar() {
    const nav = $('#navbar');
    const onScroll = () => nav.classList.toggle('is-stuck', scrollY > 36);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    $('#navToggle').addEventListener('click', () => {
      const open = !$('#navMenu').classList.contains('is-open');
      $('#navMenu').classList.toggle('is-open', open);
      $('#navToggle').setAttribute('aria-expanded', String(open));
    });
    $('#navMenu').addEventListener('click', (e) => { if (e.target.closest('a.navlink')) closeMobileNav(); });
  }

  function renderMega() {
    $('#megaMenu').innerHTML = CATS.map((c) => `
      <div>
        <h3>${esc(T.cats[c])}</h3>
        <ul>${SERIES.filter((s) => s.cat === c).map((s) => `
          <li><a href="#range-${s.id}"><img src="assets/img/models/${MENU_THUMB[s.id]}.jpg" alt="" loading="lazy">
            <span><b>${esc(s.name)}</b><br>${esc(T.series[s.id])}</span></a></li>`).join('')}
        </ul>
      </div>`).join('');
  }

  /* ---------- Power selector (dual range, like the current site's 50–600 hp slider) ---------- */
  function renderSlider() {
    const pct = (v) => ((v - HP_MIN) / (HP_MAX - HP_MIN)) * 100;
    const a = pct(state.min), b = pct(state.max);
    $('#rangeFill').style.left = a + '%';
    $('#rangeFill').style.right = (100 - b) + '%';
    // labels sit under the thumbs; the track is inset by the thumb radius
    const place = (el, p, v) => { el.style.left = `calc(10px + (100% - 20px) * ${p / 100})`; el.textContent = `${v} ${T.hp}`; };
    place($('#labelMin'), a, state.min);
    place($('#labelMax'), b, state.max);
  }

  function initSlider() {
    const lo = $('#hpMin'), hi = $('#hpMax');
    const update = (e) => {
      let a = +lo.value, b = +hi.value;
      if (a > b - 25) { if (e.target === lo) a = b - 25; else b = a + 25; }
      lo.value = state.min = Math.max(HP_MIN, a);
      hi.value = state.max = Math.min(HP_MAX, b);
      // let the lower thumb win when both sit at the top end
      lo.style.zIndex = state.min > HP_MAX - 60 ? 3 : 1;
      renderSlider();
      filterProducts();
    };
    lo.addEventListener('input', update);
    hi.addEventListener('input', update);
    $('#catPills').addEventListener('click', (e) => {
      const b = e.target.closest('[data-cat]');
      if (!b) return;
      state.cat = b.dataset.cat;
      renderPills();
      filterProducts();
    });
  }

  function renderPills() {
    $('#catPills').innerHTML = ['all', ...CATS].map((c) =>
      `<button role="tab" data-cat="${c}" aria-selected="${state.cat === c}">${esc(T.cats[c])}</button>`).join('');
  }

  /* ---------- Ranges / product grid ---------- */
  function specShort(m) {
    return `${m.hp[0]}–${m.hp[1]} ${T.hp} · ${m.width}`;
  }

  function renderRanges() {
    $('#ranges').innerHTML = SERIES.map((s) => {
      const items = MODELS.filter((m) => m.range === s.id).map((m) => `
        <button class="product" data-model="${m.id}" data-cat="${m.cat}" data-lo="${m.hp[0]}" data-hi="${m.hp[1]}">
          <span class="product__img"><img src="assets/img/models/${m.id}.jpg" alt="" loading="lazy" width="500" height="333"></span>
          <span class="product__name">${esc(m.name)}</span>
          <span class="product__spec">${esc(specShort(m))}</span>
          <span class="product__more" aria-hidden="true">+</span>
        </button>`).join('');
      return `<section class="rangeblock" id="range-${s.id}" data-cat="${s.cat}">
        <h3 class="rangeblock__title">${esc(s.name)} <small>- ${esc(T.series[s.id])}</small></h3>
        <div class="grid">${items}</div>
      </section>`;
    }).join('');
    filterProducts();
  }

  function filterProducts() {
    let n = 0;
    $$('.rangeblock').forEach((block) => {
      let visible = 0;
      $$('.product', block).forEach((p) => {
        const ok = +p.dataset.hi >= state.min && +p.dataset.lo <= state.max && (state.cat === 'all' || p.dataset.cat === state.cat);
        p.hidden = !ok;
        if (ok) visible++;
      });
      block.hidden = visible === 0;
      n += visible;
    });
    $('#powerCount').innerHTML = `<b>${n}</b> ${esc(T.power.results(n).replace(/^\d+\s/, ''))}`;
    $('#rangesNone').hidden = n > 0;
  }

  /* ---------- Model modal ---------- */
  function openModel(id) {
    const m = MODELS.find((x) => x.id === id);
    const s = SERIES.find((x) => x.id === m.range);
    const kw = m.hp.map((v) => fmt(v * 0.7355));
    const widths = m.width.replace(' m', '').split(' – ').map((v) => parseFloat(v.replace(',', '.')));
    const ft = widths.map((v) => fmt(v * 3.2808)).join(' → ');
    const config = [m.mount && T.mount[m.mount], m.count && `${m.count} ${T.units[m.unit]}`].filter(Boolean).join(' · ');
    $('#modalBody').innerHTML = `
      <div class="modal__img"><img src="assets/img/models/${m.id}.jpg" alt="${esc(m.name)}"></div>
      <div class="modal__body">
        <button class="modal__close" data-close aria-label="${esc(T.model.close)}">×</button>
        <p class="modal__range">${esc(s.name)} - ${esc(T.series[s.id])}</p>
        <h2 class="modal__title" id="modalTitle">${esc(m.name)}</h2>
        <table class="spec">
          <tr><th>${esc(T.model.tractors)}</th><td>${m.hp[0]} → ${m.hp[1]} ${T.hp}<small>${kw[0]} → ${kw[1]} kW</small></td></tr>
          <tr><th>${esc(T.model.width)}</th><td>${esc(m.width.replace(' – ', ' → '))}<small>${ft} ft</small></td></tr>
          ${config ? `<tr><th>${esc(T.model.config)}</th><td>${esc(config)}</td></tr>` : ''}
        </table>
        <div class="modal__actions">
          <a class="btn btn--red" href="#contact" data-request="2" data-machine="${esc(m.name)}">${esc(T.model.quote)}</a>
          <a class="btn btn--grey" href="#contact" data-request="0" data-machine="${esc(m.name)}">${esc(T.model.brochure)}</a>
        </div>
      </div>`;
    $('#modal').showModal();
  }

  function initModal() {
    const modal = $('#modal');
    $('#ranges').addEventListener('click', (e) => {
      const p = e.target.closest('[data-model]');
      if (p) openModel(p.dataset.model);
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('[data-close]')) modal.close();
      const req = e.target.closest('[data-request]');
      if (req) {
        $('#machineField').value = req.dataset.machine;
        setType(+req.dataset.request);
        modal.close();
      }
    });
  }

  /* ---------- Correspondence ---------- */
  const norm = (s) => s.toLowerCase().replace(/[\s,./()–-]+/g, '');
  function renderCorr() {
    const q = state.query.trim();
    const rows = OLD_NAMES.filter(([o, n]) => !q || norm(o).includes(norm(q)) || norm(n).includes(norm(q)));
    const hl = (s) => {
      const i = q ? s.toLowerCase().indexOf(q.toLowerCase()) : -1;
      return i < 0 ? esc(s) : `${esc(s.slice(0, i))}<mark>${esc(s.slice(i, i + q.length))}</mark>${esc(s.slice(i + q.length))}`;
    };
    $('#corrRows').innerHTML = rows.length
      ? rows.map(([o, n]) => `<tr><td>${hl(o)}</td><td>${hl(n)}</td></tr>`).join('')
      : `<tr><td colspan="2">${esc(T.names.empty)}</td></tr>`;
    const open = $('#corrToggle').getAttribute('aria-expanded') === 'true';
    $('#corrToggle').firstElementChild.textContent = open ? T.names.hide : T.names.button;
  }
  function initCorr() {
    $('#corrToggle').addEventListener('click', () => {
      const btn = $('#corrToggle');
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      btn.lastElementChild.textContent = open ? '↑' : '↓';
      $('#corrPanel').hidden = !open;
      renderCorr();
      if (open) $('#corrSearch').focus();
    });
    $('#corrSearch').addEventListener('input', (e) => { state.query = e.target.value; renderCorr(); });
  }

  /* ---------- Request form ---------- */
  function renderTypes() {
    $('#types').innerHTML = T.contact.types.map((t, i) => `
      <label class="type">
        <input type="radio" name="type" value="${i}" ${state.type === i ? 'checked' : ''}>
        <span class="type__img"><img src="assets/img/contact/${CONTACT_IMG[i]}.jpg" alt=""></span>
        <span class="type__label">${esc(t)}</span>
        <span class="type__check" aria-hidden="true"></span>
      </label>`).join('');
  }
  function setType(i) {
    state.type = i;
    const r = $(`#types input[value="${i}"]`);
    if (r) r.checked = true;
    $('#typeError').hidden = true;
  }
  function initForm() {
    $('#machineList').innerHTML = MODELS.map((m) => `<option value="${esc(m.name)}">`).join('');
    $('#types').addEventListener('change', (e) => setType(+e.target.value));
    const form = $('#requestForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let first = null;
      $('#typeError').hidden = state.type !== null;
      if (state.type === null) first = $('#types input');
      $$('[required]', form).forEach((inp) => {
        const bad = !inp.value.trim() || (inp.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value));
        inp.classList.toggle('is-invalid', bad);
        inp.setAttribute('aria-invalid', String(bad));
        if (bad && !first) first = inp;
      });
      if (first) { first.focus(); return; }
      // Demo only: no backend is wired up yet. Connect this to the client's CRM / mail endpoint.
      form.reset();
      state.type = null;
      renderTypes();
      $('#requestOk').hidden = false;
    });
    form.addEventListener('input', (e) => { if (e.target.value && e.target.value.trim()) e.target.classList.remove('is-invalid'); });
  }

  /* ---------- Footer ---------- */
  function renderFooter() {
    $('#footerCols').innerHTML = CATS.map((c) => `
      <div>
        <h3>${esc(T.cats[c])}</h3>
        <ul>${SERIES.filter((s) => s.cat === c).map((s) =>
          `<li><a href="#range-${s.id}"><b>${esc(s.name)}</b> - ${esc(T.series[s.id])}</a></li>`).join('')}</ul>
      </div>`).join('') +
      `<div><a class="footer__media" href="https://marketing.gb-group.co/gregoire-besson">${esc(T.nav.media)}</a></div>`;
    $('#legal').innerHTML = T.footer.legal.map((l, i) => `<li><a href="${LEGAL[i]}">${esc(l)}</a></li>`).join('');
  }

  /* ---------- Jump links to a range reset filters so the range is visible ---------- */
  function initRangeLinks() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#range-"]');
      if (!a) return;
      state.min = HP_MIN; state.max = HP_MAX; state.cat = 'all';
      $('#hpMin').value = HP_MIN; $('#hpMax').value = HP_MAX;
      renderSlider(); renderPills(); filterProducts();
    });
  }

  /* ---------- Boot ---------- */
  $('#year').textContent = new Date().getFullYear();
  initDropdowns();
  initNavbar();
  initSlider();
  initModal();
  initCorr();
  initForm();
  initRangeLinks();
  setLang(initialLang());
})();

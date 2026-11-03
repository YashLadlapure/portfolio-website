/**
 * Turns src/content.js into page markup.
 */
export const TINTS = {
  haldi: '#A8701C', sindoor: '#B8432F', leaf: '#2F7A4F', indigo: '#2E3A8C', rani: '#9E2F62', paper: '#3A3631',
};

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const tint = (name) => TINTS[name] ?? name;
const pad = (n) => String(n).padStart(2, '0');

const icon = {
  out: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8.5 7H17v8.5"/></svg>',
  mouse: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="3.5" width="10" height="17" rx="5"/><path class="wheel" d="M12 7.5v3"/></svg>',
};

/* ── Hero ─────────────────────────────────────────────────── */
function hero(s) {
  const h = s.hero;
  return `
  <section class="hero" id="home" aria-label="Introduction">
    <div class="hero__track">
      <div class="hero__stage">
        <div class="hero__pins" aria-hidden="true">
          ${h.pins.map((p) => `<span class="pin3d"><b>${esc(p.label)}</b>${p.note ? `<i>${esc(p.note)}</i>` : ''}</span>`).join('')}
        </div>
        <div class="hero__copy">
          <p class="hero__hello">${esc(h.hello)}</p>
          <h1 class="hero__title">${h.lines.map((l) => `<span class="hero__line"><span>${esc(l)}</span></span>`).join('')}</h1>
          <p class="hero__sub">${esc(h.sub)}</p>
        </div>
        <a class="hero__cue" href="#story">${icon.mouse}${esc(h.cue)}</a>
        <div class="hero__fade" aria-hidden="true"></div>
      </div>
    </div>
  </section>`;
}

/* ── Story: words light up as you read ────────────────────── */
function story(s) {
  const st = s.story;
  // Split into words; [bracketed] phrases become marked groups.
  const html = st.text.split(/(\[[^\]]+\])/).map((chunk) => {
    if (chunk.startsWith('[')) {
      const words = chunk.slice(1, -1).split(' ').map((w) => `<span class="w">${esc(w)}</span>`).join(' ');
      return `<span class="mark">${words}<svg class="mark__ink" viewBox="0 0 200 16" preserveAspectRatio="none" aria-hidden="true"><path d="M3 10 C 60 4, 140 4, 197 8" /></svg></span>`;
    }
    return chunk.split(/(\s+)/).map((w) => (w.trim() ? `<span class="w">${esc(w)}</span>` : w)).join('');
  }).join('');
  return `
  <section class="story" id="story">
    <p class="story__label">${esc(st.label)}</p>
    <p class="story__text">${html}</p>
    <div class="story__notes">
      ${st.notes.map((n, i) => `
        <div class="note" style="--tint:${tint(n.tint)};--r:${[-1.5, 1, -0.8][i % 3]}deg" data-drag>
          <strong>${esc(n.title)}</strong><span>${esc(n.body)}</span>
        </div>`).join('')}
      
    </div>
  </section>`;
}

/* ── Journey: a tour through the 3D valley ────────────────── */
function journey(s) {
  const j = s.journey;
  const stops = j.stops;
  return `
  <section class="journey" id="journey" aria-labelledby="journey-title">
    <header class="section-head" data-reveal>
      <p class="section-head__label">The journey</p>
      <h2 class="section-head__title" id="journey-title">${esc(j.heading)}</h2>
      <p class="section-head__sub">${esc(j.sub)}</p>
    </header>
    <div class="journey__track" style="--stops:${stops.length}">
      <div class="journey__stage">
        <div class="journey__tags" aria-hidden="true">
          ${stops.map((x) => `<span class="tag3d" style="--tint:${tint(x.tint)}">${esc(x.place)}</span>`).join('')}
        </div>
        <article class="stop-card" aria-live="polite">
          <p class="stop-card__count"><span data-stop-n>01</span> / ${pad(stops.length)}</p>
          <p class="stop-card__where" data-stop-where></p>
          <h3 class="stop-card__title" data-stop-title></h3>
          <p class="stop-card__body" data-stop-body></p>
          <dl class="stop-card__stats" data-stop-stats></dl>
        </article>
        <div class="timeline" role="group" aria-label="Jump to a stop">
          ${stops.map((x, i) => `<button class="timeline__dot" type="button" data-jump="${i}" style="--tint:${tint(x.tint)}" aria-label="${esc(x.place)}, ${esc(x.when)}"></button>`).join('')}
          <span class="timeline__label" data-stop-label></span>
        </div>
      </div>
    </div>
  </section>`;
}

/* ── Work: a deck of cards ────────────────────────────────── */
function work(s) {
  const w = s.work;
  const n = w.items.length;
  return `
  <section class="work" id="work" aria-labelledby="work-title">
    <header class="section-head" data-reveal>
      <p class="section-head__label">Things I built</p>
      <h2 class="section-head__title" id="work-title">${esc(w.heading)}</h2>
      <p class="section-head__sub">${esc(w.sub)}</p>
    </header>
    <div class="deck" role="group" aria-label="Projects" data-reveal>
      ${w.items.map((it, i) => `
        <button class="card" type="button" data-card="${i}" aria-pressed="${i === 0}" style="--i:${i - (n - 1) / 2};--tint:${tint(it.tint)}">
          <span class="card__n">${pad(i + 1)}</span>
          <span class="card__name">${esc(it.name)}</span>
          <span class="card__tag">${esc(it.tag)}</span>
          <span class="card__stripe" aria-hidden="true"></span>
        </button>`).join('')}
    </div>
    <div class="deck__detail" aria-live="polite" data-reveal></div>
  </section>`;
}

export function workDetail(it) {
  const link = (href, label, cls) => (href ? `<a class="${cls}" href="${esc(href)}" target="_blank" rel="noopener">${label}${icon.out}</a>` : '');
  return `
    <h3 class="detail__name" style="--tint:${tint(it.tint)}">${esc(it.name)}</h3>
    <p class="detail__summary">${esc(it.summary)}</p>
    <ul class="chips">${it.stack.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
    ${it.links.live || it.links.code ? `<div class="actions">${link(it.links.live, 'Live', 'btn btn--solid')}${link(it.links.code, 'Code', 'btn')}</div>` : ''}`;
}

/* ── Stack: a keyboard ────────────────────────────────────── */
function stack(s) {
  const k = s.stack;
  return `
  <section class="stack" id="stack" aria-labelledby="stack-title">
    <header class="section-head" data-reveal>
      <p class="section-head__label">My stack</p>
      <h2 class="section-head__title" id="stack-title">${esc(k.heading)}</h2>
      <p class="section-head__sub">${esc(k.sub)}</p>
    </header>
    <div class="keyboard" data-reveal>
      <p class="keyboard__screen" aria-live="polite"><span class="keyboard__key" data-screen-key>ready</span><span data-screen-does>Hover or press any key.</span></p>
      ${k.rows.map((row) => `<div class="keyboard__row">${row.map((key) => `
        <button class="key${key.wide ? ' key--wide' : ''}" type="button" data-does="${esc(key.does)}"><span>${esc(key.key)}</span></button>`).join('')}</div>`).join('')}
    </div>
  </section>`;
}

/* ── Process: a pipeline ──────────────────────────────────── */
function processSection(s) {
  const p = s.process;
  return `
  <section class="process" id="process" aria-labelledby="process-title">
    <header class="section-head" data-reveal>
      <p class="section-head__label">How I work</p>
      <h2 class="section-head__title" id="process-title">${esc(p.heading)}</h2>
      <p class="section-head__sub">${esc(p.sub)}</p>
    </header>
    <div class="pipeline">
      <div class="pipeline__rail" aria-hidden="true"><span class="pipeline__fill"></span><span class="pipeline__packet"></span></div>
      <ol class="pipeline__steps">
        ${p.steps.map((st, i) => `
          <li class="step">
            <span class="step__node" aria-hidden="true">${pad(i + 1)}</span>
            <h3 class="step__name">${esc(st.name)}</h3>
            <p class="step__body">${esc(st.body)}</p>
          </li>`).join('')}
      </ol>
    </div>
  </section>`;
}

/* ── Contact ──────────────────────────────────────────────── */
export function shortcuts(s) {
  return [
    { key: 'M', label: 'Email', hint: s.email, href: `mailto:${s.email}` },
    { key: 'G', label: 'GitHub', hint: 'Code and projects', href: s.links.github },
    { key: 'L', label: 'LinkedIn', hint: 'Say hello', href: s.links.linkedin },
    { key: 'R', label: 'Résumé', hint: 'One page, one click', href: s.links.resume },
  ].filter((x) => x.href);
}

function contact(s) {
  const c = s.contact;
  const keys = shortcuts(s);
  return `
  <section class="contact" id="contact" aria-labelledby="contact-title">
    <h2 class="contact__title" id="contact-title" data-reveal>${esc(c.heading)}</h2>
    <p class="contact__sub" data-reveal>${esc(c.sub)}</p>
    <div class="shortcuts" data-reveal>
      ${keys.map((k) => `
        <a class="shortcut" href="${esc(k.href)}"${k.href.startsWith('mailto') ? '' : ' target="_blank" rel="noopener"'}>
          <kbd>${k.key}</kbd><span class="shortcut__label">${esc(k.label)}</span><span class="shortcut__hint">${esc(k.hint)}</span>
        </a>`).join('')}
    </div>
    <p class="contact__keys" data-reveal>Your keyboard works here too: press ${keys.map((k) => `<kbd>${k.key}</kbd>`).join(' ')}</p>
    <p class="contact__where" data-reveal>${esc(c.where)}</p>
    <footer class="footer">
      <p>© ${new Date().getFullYear()} ${esc(s.name)}</p>
      <p>Built by hand with Three.js and GSAP</p>
    </footer>
  </section>`;
}

/* ── Chrome: dock + status ────────────────────────────────── */
export function renderChrome(s) {
  const cta = s.links.resume
    ? `<a class="dock__cta" href="${esc(s.links.resume)}" target="_blank" rel="noopener">Résumé${icon.out}</a>`
    : `<a class="dock__cta" href="mailto:${esc(s.email)}">Email${icon.out}</a>`;
  return `
    <a class="mono" href="#home" aria-label="${esc(s.name)}, back to top">YL</a>
    <div class="corner">
      <p class="status"><span class="status__dot" aria-hidden="true"></span><span class="status__long">${esc(s.status)}</span><span class="status__short">Open to work</span></p>
      <button class="mode" type="button" aria-pressed="false" aria-label="Night mode">
        <span class="mode__track" aria-hidden="true">
          <svg class="mode__sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/></svg>
          <svg class="mode__moon" viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/></svg>
          <span class="mode__knob"></span>
        </span>
      </button>
    </div>
    <nav class="dock" aria-label="Sections">
      <span class="dock__glider" aria-hidden="true"></span>
      <a href="#home" class="dock__link dock__link--home">Home</a>
      <a href="#journey" class="dock__link">Journey</a>
      <a href="#work" class="dock__link">Work</a>
      <a href="#stack" class="dock__link">Stack</a>
      <a href="#contact" class="dock__link">Contact</a>
      ${cta}
    </nav>`;
}

export function renderPage(s) {
  return [hero(s), story(s), journey(s), work(s), stack(s), processSection(s), contact(s)].join('');
}

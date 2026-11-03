import './styles.css';
import { site } from './content.js';
import { startOcean } from './ocean.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── links from content.js ─────────────────────────────── */
$$('[data-email]').forEach((a) => { a.href = `mailto:${site.email}`; });
$$('[data-email-text]').forEach((el) => { el.textContent = site.email; });
$$('[data-resume]').forEach((a) => { a.href = site.resume; });
$$('[data-link]').forEach((a) => {
  const href = site.links[a.dataset.link];
  if (href) { a.href = href; a.hidden = false; }
});

/* ── stats, experience ─────────────────────────────────── */
$('#stats').innerHTML = site.stats.map((s) => `<div class="stat"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('');

$('#stops').innerHTML = site.journey.map((j) => `
  <article class="glass reveal stop${j.now ? ' stop--now' : ''}">
    <div class="stop__when"><span class="mono">${esc(j.when)}</span><span>${esc(j.where)}</span></div>
    <div class="stop__body">
      <h3>${esc(j.title)}</h3>
      <p>${esc(j.body)}</p>
      <div class="chips">${j.tags.map((t) => `<span class="chip sm">${esc(t)}</span>`).join('')}</div>
    </div>
  </article>`).join('');

/* ── stack picker ──────────────────────────────────────── */
const tools = new Map(site.tools.flatMap((g) => g.tools));
$('#groups').innerHTML = site.tools.map((g) => `
  <div class="group"><span class="label">${esc(g.name)}</span>
    <div class="chips">${g.tools.map(([k]) => `<button type="button" class="tile" aria-pressed="false" data-tool="${esc(k)}">${esc(k)}</button>`).join('')}</div>
  </div>`).join('');
const pickTool = (key) => {
  $$('[data-tool]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tool === key)));
  $('#tool-name').textContent = key;
  $('#tool-does').textContent = tools.get(key);
};
$('#groups').addEventListener('click', (e) => { const b = e.target.closest('[data-tool]'); if (b) pickTool(b.dataset.tool); });
pickTool(site.tools[0].tools[0][0]);

/* ── works: filters and expandable cards ───────────────── */
const cats = ['All', ...new Set(site.works.map((w) => w.cat))];
$('#filters').innerHTML = cats.map((c) => `<button type="button" class="pill liquid" aria-pressed="${c === 'All'}" data-cat="${esc(c)}">${esc(c)}</button>`).join('');
$('#works').innerHTML = site.works.map((w) => `
  <button type="button" class="card glass hue-${esc(w.hue)}" aria-expanded="false" data-cat="${esc(w.cat)}">
    <div class="preview"><div class="mono">${esc(w.preview)}</div></div>
    <div class="card__body">
      <div class="card__top"><span class="label">${esc(w.tag)}</span><span class="mono card__hint">Details +</span></div>
      <h3>${esc(w.name)}</h3>
      <p>${esc(w.short)}</p>
      <div class="card__more">
        <p>${esc(w.summary)}</p>
        <div class="chips">${w.stack.map((s) => `<span class="chip sm">${esc(s)}</span>`).join('')}</div>
      </div>
    </div>
  </button>`).join('');
const cards = $$('#works .card');
const setOpen = (card, open) => {
  card.setAttribute('aria-expanded', String(open));
  $('.card__hint', card).textContent = open ? 'Close' : 'Details +';
};
$('#filters').addEventListener('click', (e) => {
  const b = e.target.closest('[data-cat]'); if (!b) return;
  $$('#filters [data-cat]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  cards.forEach((c) => { c.hidden = b.dataset.cat !== 'All' && c.dataset.cat !== b.dataset.cat; setOpen(c, false); });
});
cards.forEach((card) => {
  card.addEventListener('click', () => {
    const open = card.getAttribute('aria-expanded') !== 'true';
    cards.forEach((c) => setOpen(c, c === card && open));
  });
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});

/* ── copy email ────────────────────────────────────────── */
$('#copy').addEventListener('click', async (e) => {
  const b = e.currentTarget;
  try { await navigator.clipboard.writeText(site.email); b.textContent = 'Copied ✓'; } catch { b.textContent = site.email; }
  setTimeout(() => { b.textContent = 'Copy address'; }, 1800);
});

/* ── ocean, scroll, top bar glider ─────────────────────── */
const ocean = startOcean($('.ocean canvas'), { reduced });
const shade = $('.ocean__shade');
const glider = $('.nav__glider');
const links = $$('.navlink');
const ids = ['profile', 'stack', 'journey', 'work', 'contact'];
let active = null;

const moveGlider = (link) => {
  if (!link) { glider.style.opacity = '0'; return; }
  glider.style.opacity = '1';
  glider.style.width = `${link.offsetWidth}px`;
  glider.style.transform = `translateX(${link.offsetLeft}px)`;
};

const onScroll = () => {
  const vh = innerHeight || 1;
  if (ocean) { ocean.scroll = Math.min(1, scrollY / vh); ocean.dirty = true; }
  shade.style.opacity = String(Math.min(1, scrollY / (vh * 1.4)) * 0.5);
  let now = null;
  for (const id of ids) if (document.getElementById(id).getBoundingClientRect().top < vh * 0.4) now = id;
  if (now !== active) {
    active = now;
    links.forEach((l) => l.classList.toggle('on', l.hash === `#${now}`));
    moveGlider(links.find((l) => l.hash === `#${now}`));
  }
};
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', () => { active = undefined; onScroll(); });
addEventListener('pointermove', (e) => { if (ocean) ocean.pointer = e.clientX / innerWidth - 0.5; }, { passive: true });
onScroll();

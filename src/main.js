import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { site } from './content.js';
import { renderPage, renderChrome, workDetail, shortcuts } from './render.js';
import { Frames } from './frames.js';
import './styles.css';

gsap.registerPlugin(ScrollTrigger);
// A slow frame (big images arriving) must not freeze the intro: let tweens catch up instead.
gsap.ticker.lagSmoothing(0);

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobileMQ = window.matchMedia('(max-width: 760px)');
const clamp01 = gsap.utils.clamp(0, 1);
const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };

// The story starts at the top: don't restore an old mid-flight scroll position on reload.
if (!location.hash && 'scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
}

document.getElementById('chrome').innerHTML = renderChrome(site);
document.getElementById('main').innerHTML = renderPage(site);

/* ═════════════════════════════════════════════════════════════
 *  THE RENDERED VALLEY (src/frames.js, images from blender/render_scene.py)
 *
 *  One fixed canvas sits behind the hero and the journey; the
 *  sections between them are opaque and simply cover it.
 *    • Hero track (~260vh, sticky stage): scroll progress picks the
 *      frame of Blender's camera fly-in, down to the MIT-WPU campus.
 *    • Journey track: each stop gets an equal share of the scroll; the
 *      first 65% cross-fades to the next still, the rest holds so the
 *      card can be read.
 * ═════════════════════════════════════════════════════════════ */
const layer = $('.world');
const stops = site.journey.stops;
const state = { frames: null, heroT: 0, hero: 0, journeyT: 0, journey: 0, active: -1, inJourney: false };
const heroCopy = $('.hero__copy'), heroCue = $('.hero__cue');
const pinEls = $$('.pin3d'), tagEls = $$('.tag3d');

Frames.create($('.world__canvas'), document.documentElement.dataset.theme)
  .then((frames) => { state.frames = frames; })
  .catch((err) => {
    console.warn('Renders unavailable; showing the plain background.', err);
    document.documentElement.classList.add('no-renders');
  });
window.addEventListener('resize', () => state.frames?.resize());

ScrollTrigger.create({
  trigger: '.hero__track', start: 'top top', end: 'bottom bottom',
  onUpdate: (self) => { state.heroT = self.progress; },
});
const journeyTrack = ScrollTrigger.create({
  trigger: '.journey__track', start: 'top top', end: 'bottom bottom',
  onUpdate: (self) => { state.journeyT = self.progress; },
});
// Which images the canvas shows: the journey's once its track reaches the viewport.
ScrollTrigger.create({
  trigger: '.journey__track', start: 'top bottom', end: 'bottom top',
  onToggle: (self) => { state.inJourney = self.isActive; },
});
const visibleIn = (el) => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < window.innerHeight; };

const card = {
  n: $('[data-stop-n]'), where: $('[data-stop-where]'), title: $('[data-stop-title]'),
  body: $('[data-stop-body]'), stats: $('[data-stop-stats]'), label: $('[data-stop-label]'), el: $('.stop-card'),
};
const dots = $$('.timeline__dot');

function showStop(i) {
  if (i === state.active) return;
  state.active = i;
  const s = stops[i];
  const fill = () => {
    card.n.textContent = String(i + 1).padStart(2, '0');
    card.where.textContent = `${s.place} · ${s.when}`;
    card.title.textContent = s.title;
    card.body.textContent = s.body;
    card.stats.innerHTML = (s.stats || []).map((x) => `<div><dt>${x.label}</dt><dd>${x.value}</dd></div>`).join('');
    card.el.style.setProperty('--tint', dots[i].style.getPropertyValue('--tint'));
    card.label.textContent = `${s.when} · ${s.place}`;
  };
  if (reduceMQ.matches) fill();
  else gsap.timeline()
    .to(card.el, { autoAlpha: 0, y: 12, duration: 0.18, ease: 'power2.in', onComplete: fill })
    .to(card.el, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'expo.out' });
  tagEls.forEach((t, j) => t.classList.toggle('is-active', j === i));
  dots.forEach((d, j) => { d.classList.toggle('is-active', j === i); d.toggleAttribute('aria-current', j === i); });
}
showStop(0);

/** Journey progress 0 → 1 to still position u (0 → stops-1) with a hold at each stop. */
function journeyU(p) {
  const u = p * (stops.length - 1);
  const k = Math.min(Math.floor(u), stops.length - 2), f = u - k;
  const move = clamp01(f / 0.65);
  return { u: k + move, stop: f > 0.65 ? k + 1 : k };
}

dots.forEach((d) => d.addEventListener('click', () => {
  const i = Number(d.dataset.jump);
  const y = journeyTrack.start + (journeyTrack.end - journeyTrack.start) * (i / (stops.length - 1));
  window.scrollTo({ top: y, behavior: reduceMQ.matches ? 'auto' : 'smooth' });
}));

function placeLabel(el, pos, opacity) {
  if (!pos || opacity <= 0.01) { el.style.opacity = 0; return; }
  el.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
  el.style.opacity = opacity;
}

/* ── Day / night ───────────────────────────────────────────────
 *  The theme (set before first paint in index.html) drives both the
 *  palette and which set of Blender renders is shown. */
const modeBtn = $('.mode');
const themeMeta = document.querySelector('meta[name="theme-color"]');
function applyTheme(theme, { save = false, instant = false } = {}) {
  document.documentElement.dataset.theme = theme;
  const night = theme === 'night';
  modeBtn.setAttribute('aria-pressed', String(night));
  themeMeta.content = night ? '#0E1120' : '#F1ECE3';
  state.frames?.setMode(theme, instant || reduceMQ.matches);
  if (save) try { localStorage.setItem('yl-theme', theme); } catch { /* private mode: fine */ }
}
applyTheme(document.documentElement.dataset.theme, { instant: true });
modeBtn.addEventListener('click', () => {
  applyTheme(document.documentElement.dataset.theme === 'night' ? 'day' : 'night', { save: true });
});
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  let saved = null;
  try { saved = localStorage.getItem('yl-theme'); } catch { /* ignore */ }
  if (!saved) applyTheme(e.matches ? 'night' : 'day');
});

/* ── The frame loop ────────────────────────────────────────── */
gsap.ticker.add((time, deltaMs) => {
  const dt = Math.min(deltaMs / 1000, 0.05);
  const k = reduceMQ.matches ? 1 : 1 - Math.exp(-dt * 6);

  state.hero += (state.heroT - state.hero) * k;
  heroCopy.style.opacity = 1 - smooth(0.02, 0.2, state.hero);
  heroCopy.style.transform = `translateY(${-state.hero * 120}px)`;
  heroCue.style.opacity = 1 - smooth(0, 0.08, state.hero);

  const { u, stop } = journeyU(state.journeyT);
  state.journey += (u - state.journey) * k;
  showStop(stop);

  const frames = state.frames;
  frames?.tick(dt);
  const show = visibleIn($('.hero__track')) || visibleIn($('.journey__track'));
  layer.style.visibility = show ? 'visible' : 'hidden';
  if (!frames || !show) return;

  // Labels are fixed to the viewport, so they only show while their own stage fills the screen.
  if (state.inJourney) {
    const pos = frames.drawStops(state.journey);
    const on = journeyTrack.isActive ? 1 : 0;
    pinEls.forEach((el) => placeLabel(el, null, 0));
    tagEls.forEach((el, i) => placeLabel(el, pos[i], on * (1 - Math.min(1, Math.abs(state.journey - i) / 0.9))));
  } else {
    const pos = frames.drawHero(state.hero);
    const on = smooth(0.06, 0.2, state.hero) * (1 - smooth(0.92, 1, state.heroT));
    site.hero.pins.forEach((pin, i) => placeLabel(pinEls[i], pos[pin.stop], on));
    tagEls.forEach((el) => placeLabel(el, null, 0));
  }
});

/* ═════════════════════════════════════════════════════════════
 *  3. WORK: the deck.
 * ═════════════════════════════════════════════════════════════ */
const cards = $$('.card');
const detail = $('.deck__detail');
function pick(i, animate = true) {
  cards.forEach((c, j) => c.setAttribute('aria-pressed', String(j === i)));
  const swap = () => { detail.innerHTML = workDetail(site.work.items[i]); };
  if (!animate || reduceMQ.matches) return swap();
  gsap.timeline()
    .to(detail, { autoAlpha: 0, y: 10, duration: 0.15, ease: 'power2.in', onComplete: swap })
    .to(detail, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'expo.out' });
}
cards.forEach((c, i) => c.addEventListener('click', () => pick(i)));
pick(0, false);

/* ═════════════════════════════════════════════════════════════
 *  4. STACK: the keyboard.
 * ═════════════════════════════════════════════════════════════ */
const screenKey = $('[data-screen-key]'), screenDoes = $('[data-screen-does]');
$$('.key').forEach((key) => {
  const show = () => { screenKey.textContent = key.textContent.trim(); screenDoes.textContent = key.dataset.does; };
  key.addEventListener('pointerenter', show);
  key.addEventListener('focus', show);
  key.addEventListener('click', () => {
    show();
    key.classList.remove('is-down');
    void key.offsetWidth; // restart the press animation
    key.classList.add('is-down');
  });
});

/* ═════════════════════════════════════════════════════════════
 *  5. Motion that only runs when motion is welcome.
 * ═════════════════════════════════════════════════════════════ */
const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)', () => {
  // Hero title rises line by line.
  gsap.from('.hero__line > span', { yPercent: 110, duration: 1.3, ease: 'expo.out', stagger: 0.12, delay: 0.2 });
  gsap.from(['.hero__hello', '.hero__sub', '.hero__cue'], { y: 18, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.1, delay: 0.5 });

  // Story: each word lights up as you read; marks draw themselves.
  const words = $$('.story .w');
  gsap.set(words, { opacity: 0.16 });
  const marks = $$('.mark__ink path');
  marks.forEach((p) => { const l = p.getTotalLength(); gsap.set(p, { strokeDasharray: l, strokeDashoffset: l }); });
  const tl = gsap.timeline({ scrollTrigger: { trigger: '.story__text', start: 'top 75%', end: 'bottom 45%', scrub: 0.6 } });
  tl.to(words, { opacity: 1, stagger: 1, duration: 1, ease: 'none' }, 0);
  $$('.mark').forEach((m, i) => {
    const last = words.indexOf($$('.w', m).at(-1));
    tl.to(marks[i], { strokeDashoffset: 0, duration: 4, ease: 'none' }, last);
  });

  // Process: the packet travels the pipeline and lights each step.
  const steps = $$('.step');
  gsap.timeline({
    scrollTrigger: {
      trigger: '.pipeline', start: 'top 70%', end: 'bottom 55%', scrub: 0.5,
      onUpdate: (self) => steps.forEach((s, i) => s.classList.toggle('is-lit', self.progress >= i / steps.length)),
    },
  })
    .fromTo('.pipeline', { '--p': 0 }, { '--p': 1, ease: 'none' });

  // Section reveals. Content stays visible without JS.
  gsap.set('[data-reveal]', { y: 36, autoAlpha: 0 });
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%', once: true,
    onEnter: (els) => gsap.to(els, { y: 0, autoAlpha: 1, duration: 1, ease: 'expo.out', stagger: 0.08, overwrite: true }),
  });
  return () => $$('.step').forEach((s) => s.classList.add('is-lit'));
});
if (reduceMQ.matches) $$('.step').forEach((s) => s.classList.add('is-lit'));

/* ── Draggable notes ───────────────────────────────────────── */
$$('[data-drag]').forEach((note) => {
  let sx = 0, sy = 0, dx = 0, dy = 0;
  note.addEventListener('pointerdown', (e) => {
    note.setPointerCapture(e.pointerId);
    sx = e.clientX - dx; sy = e.clientY - dy;
    note.classList.add('is-held');
  });
  note.addEventListener('pointermove', (e) => {
    if (!note.hasPointerCapture(e.pointerId)) return;
    dx = e.clientX - sx; dy = e.clientY - sy;
    note.style.translate = `${dx}px ${dy}px`;
  });
  const drop = () => note.classList.remove('is-held');
  note.addEventListener('pointerup', drop);
  note.addEventListener('pointercancel', drop);
});

/* ── Dock: the glider follows the section you're in ────────── */
const dockLinks = $$('.dock__link');
const glider = $('.dock__glider');
function glide(link) {
  dockLinks.forEach((l) => l.toggleAttribute('aria-current', l === link));
  if (!link || !link.offsetWidth) return;
  glider.style.width = `${link.offsetWidth}px`;
  glider.style.transform = `translateX(${link.offsetLeft}px)`;
}
const sectionFor = { home: 0, story: 0, journey: 1, work: 2, stack: 3, process: 3, contact: 4 };
Object.entries(sectionFor).forEach(([id, i]) => {
  ScrollTrigger.create({
    trigger: `#${id}`, start: 'top 50%', end: 'bottom 50%',
    onToggle: (self) => self.isActive && glide(dockLinks[i]),
  });
});
glide(dockLinks[0]);
window.addEventListener('resize', () => glide($('.dock__link[aria-current]')));

/* ── Keyboard shortcuts (contact) ──────────────────────────── */
const keyMap = Object.fromEntries(shortcuts(site).map((k) => [k.key.toLowerCase(), k.href]));
window.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
  if (e.target.closest('input, textarea, [contenteditable]')) return;
  const href = keyMap[e.key.toLowerCase()];
  if (!href) return;
  if (href.startsWith('mailto:')) window.location.href = href;
  else window.open(href, '_blank', 'noopener');
});

document.fonts?.ready.then(() => ScrollTrigger.refresh());

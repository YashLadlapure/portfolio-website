/**
 * ═════════════════════════════════════════════════════════════
 *  FRAMES: plays Blender's renders on one fixed canvas.
 *
 *  blender/render_scene.py renders the Pune valley twice, by day and by
 *  night, from identical cameras, and writes:
 *    renders/<mode>/hero/0000.webp …   the camera fly-in, one image per step
 *    renders/<mode>/stops/0.webp …     one still per journey stop
 *    renders/labels.json               where each landmark label sits in every image
 *
 *  Nothing is animated in 3D at runtime: scroll picks which rendered
 *  image is shown, neighbouring images are cross-faded so the fly-in
 *  reads smoothly, and switching mode dissolves one set into the other.
 * ═════════════════════════════════════════════════════════════
 */
const BASE = import.meta.env.BASE_URL;

export class Frames {
  static async create(canvas, mode) {
    const meta = await fetch(`${BASE}renders/labels.json`).then((r) => r.json());
    return new Frames(canvas, meta, mode);
  }

  constructor(canvas, meta, mode) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.meta = meta;
    this.sets = {};
    this.mode = mode;
    this.prev = null; // set being dissolved away
    this.mix = 1; // 0 → 1 while switching
    this.load(mode);
    this.resize();
  }

  /** Load a mode's images: stills and the first frame first, the fly-in streams in behind. */
  load(mode) {
    if (this.sets[mode]) return this.sets[mode];
    const { meta } = this;
    // Decode off the main thread before an image is ever drawn: drawing an undecoded
    // image decodes it synchronously and stalls every animation on the page.
    const img = (src) => {
      const i = new Image();
      i.src = src;
      i.decode().then(() => { i.ok = true; }, () => {});
      return i;
    };
    const dir = `${BASE}renders/${mode}`;
    const set = {
      hero: meta.hero.map(() => null),
      stops: meta.stops.map((_, i) => img(`${dir}/stops/${i}${meta.ext}`)),
    };
    set.hero[0] = img(`${dir}/hero/0000${meta.ext}`);
    const rest = meta.hero.map((_, i) => i).slice(1);
    const next = () => {
      const i = rest.shift();
      if (i === undefined) return;
      const im = img(`${dir}/hero/${String(i).padStart(4, '0')}${meta.ext}`);
      im.decode().then(next, next);
      set.hero[i] = im;
    };
    for (let k = 0; k < 4; k++) next(); // four parallel streams
    this.sets[mode] = set;
    return set;
  }

  setMode(mode, instant = false) {
    if (mode === this.mode) return;
    this.load(mode);
    this.prev = this.mode;
    this.mode = mode;
    this.mix = instant ? 1 : 0;
  }

  /** Advance the day/night dissolve. dt in seconds. */
  tick(dt) {
    if (this.mix < 1) this.mix = Math.min(1, this.mix + dt / 0.9);
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = Math.round(this.w * dpr);
    this.canvas.height = Math.round(this.h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // object-fit: cover for the render's aspect
    const [iw, ih] = this.meta.size;
    this.scale = Math.max(this.w / iw, this.h / ih);
    this.dx = (this.w - iw * this.scale) / 2;
    this.dy = (this.h - ih * this.scale) / 2;
    this.lastKey = null;
  }

  ready(im) { return Boolean(im?.ok); }

  /** Nearest loaded hero frame at or below i (so scrubbing never shows a hole). */
  heroFrame(set, i) {
    for (let j = i; j >= 0; j--) if (this.ready(set.hero[j])) return set.hero[j];
    return null;
  }

  /** Pick the two images for a moment in one set, with their cross-fade. */
  pair(set, kind, x) {
    const list = set[kind];
    const n = list.length;
    const i = Math.min(Math.floor(x), n - 2), t = Math.min(x - i, 1);
    const a = kind === 'hero' ? this.heroFrame(set, i) : (this.ready(list[i]) ? list[i] : null);
    const b = this.ready(list[i + 1]) ? list[i + 1] : null;
    return { a, b, t: kind === 'stops' ? t * t * (3 - 2 * t) : t, i };
  }

  paint(kind, x) {
    // Repaint only when something visible changed: the frame, the mode mix, the size,
    // or an image that has just finished decoding.
    const cur = this.sets[this.mode];
    const probe = this.pair(cur, kind, x);
    const key = [kind, x.toFixed(4), this.mode, this.prev, this.mix.toFixed(3), this.w, this.h, Boolean(probe.a), Boolean(probe.b)].join('|');
    if (key === this.lastKey) return probe;
    this.lastKey = key;
    const [iw, ih] = this.meta.size;
    const draw = (im, alpha) => {
      if (!im || alpha <= 0.001) return;
      this.ctx.globalAlpha = alpha;
      this.ctx.drawImage(im, this.dx, this.dy, iw * this.scale, ih * this.scale);
    };
    const layer = (set, alpha) => {
      const p = this.pair(set, kind, x);
      if (!p.a) return false;
      draw(p.a, alpha);
      if (p.b) draw(p.b, alpha * p.t);
      return p;
    };
    // While switching, the old mode stays underneath and the new one dissolves in over it.
    // Until the new mode's images arrive, the old mode simply stays visible.
    const ok = probe.a;
    if (!ok && this.prev) this.mix = 0; // hold the dissolve until the new mode's image is decoded
    this.ctx.clearRect(0, 0, this.w, this.h);
    if (this.prev && this.mix < 1) layer(this.sets[this.prev], 1);
    const p = ok ? layer(cur, this.mix) : probe;
    if (ok && this.mix >= 1) this.prev = null;
    this.ctx.globalAlpha = 1;
    return p;
  }

  /** Hero fly-in. p: 0 → 1. Returns label positions for this moment. */
  drawHero(p) {
    const x = p * (this.meta.hero.length - 1);
    const { i, t } = this.paint('hero', x);
    return this.labels(this.meta.hero[i], this.meta.hero[i + 1], t);
  }

  /** Journey. u: 0 → stops-1. Cross-fades between neighbouring stills. */
  drawStops(u) {
    const { i, t } = this.paint('stops', u);
    return this.labels(this.meta.stops[i], this.meta.stops[i + 1], t);
  }

  /** Interpolated label positions in CSS pixels (null where off-screen). */
  labels(A, B, t) {
    const [iw, ih] = this.meta.size;
    return A.map((a, i) => {
      const b = B?.[i] ?? a;
      if (!a && !b) return null;
      const p = !a ? b : !b ? a : [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
      return { x: this.dx + p[0] * iw * this.scale, y: this.dy + p[1] * ih * this.scale };
    });
  }
}

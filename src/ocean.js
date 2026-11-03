/**
 * The ocean behind the page: a WebGL2 fragment shader that raymarches layered
 * waves under a low dusk sun. Scroll progress tilts the camera down into the water;
 * the pointer turns it slightly. Falls back to the CSS gradient on .ocean.
 */
const VERT = `#version 300 es
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.0-1.0,0.0,1.0);}`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uR; uniform float uT; uniform float uP; uniform float uY;
out vec4 o;
#define DEPTH 1.0
const vec3 SUN = vec3(0.3876, 0.0461, 0.9206);
vec2 wdx(vec2 p, vec2 d, float f, float t){ float x = dot(d, p) * f + t; float w = exp(sin(x) - 1.0); return vec2(w, -w * cos(x)); }
float H(vec2 p, int n){
  float it = 0.0, f = 1.0, tm = 1.0, wg = 1.0, sv = 0.0, sw = 0.0;
  for (int i = 0; i < 32; i++) {
    if (i >= n) break;
    vec2 d = vec2(sin(it), cos(it));
    vec2 r = wdx(p, d, f, uT * tm);
    p += d * r.y * wg * 0.38;
    sv += r.x * wg; sw += wg;
    wg = mix(wg, 0.0, 0.2); f *= 1.18; tm *= 1.07; it += 1232.399963;
  }
  return sv / sw;
}
vec3 sky(vec3 d){
  float y = clamp(d.y, 0.0, 1.0);
  vec3 c = mix(vec3(0.98, 0.58, 0.38), vec3(0.20, 0.18, 0.36), smoothstep(0.0, 0.16, y));
  c = mix(c, vec3(0.03, 0.045, 0.11), smoothstep(0.12, 0.75, y));
  float s = max(dot(d, SUN), 0.0);
  c += vec3(1.0, 0.55, 0.3) * pow(s, 5.0) * 0.32;
  c += vec3(1.0, 0.72, 0.45) * pow(s, 80.0) * 0.7;
  c += vec3(1.0, 0.9, 0.75) * smoothstep(0.9994, 0.9997, s) * 5.0;
  return c;
}
vec3 nrm(vec2 p, float e){
  vec2 ex = vec2(e, 0.0);
  float h = H(p, 26) * DEPTH;
  vec3 a = vec3(p.x, h, p.y);
  return normalize(cross(a - vec3(p.x - e, H(p - ex, 26) * DEPTH, p.y), a - vec3(p.x, H(p + ex.yx, 26) * DEPTH, p.y + e)));
}
float march(vec3 s, vec3 e, vec3 ro){
  vec3 p = s; vec3 dir = normalize(e - s);
  for (int i = 0; i < 56; i++) {
    float h = H(p.xz, 10) * DEPTH - DEPTH;
    if (h + 0.01 > p.y) return distance(p, ro);
    p += dir * (p.y - h);
  }
  return distance(s, ro);
}
void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * uR) / uR.y;
  vec3 d = normalize(vec3(uv, 1.7));
  float c = cos(uP), s = sin(uP);
  d = vec3(d.x, d.y * c - d.z * s, d.y * s + d.z * c);
  float cy = cos(uY), sy = sin(uY);
  d = vec3(d.x * cy + d.z * sy, d.y, -d.x * sy + d.z * cy);
  vec3 ro = vec3(0.0, 3.0, uT * 0.5);
  vec3 col;
  if (d.y >= 0.0) { col = sky(d); }
  else {
    vec3 a = ro + d * ((0.0 - ro.y) / d.y);
    vec3 b = ro + d * ((-DEPTH - ro.y) / d.y);
    float dist = march(a, b, ro);
    vec3 p = ro + d * dist;
    vec3 n = nrm(p.xz, 0.01);
    n = mix(n, vec3(0.0, 1.0, 0.0), 0.8 * min(1.0, sqrt(dist * 0.01) * 1.1));
    float fr = 0.04 + 0.96 * pow(1.0 - max(dot(-d, n), 0.0), 5.0);
    vec3 r = reflect(d, n); r.y = abs(r.y);
    vec3 scat = vec3(0.006, 0.018, 0.04) + vec3(0.02, 0.06, 0.075) * (p.y + DEPTH) * 0.8;
    col = fr * sky(r) + (1.0 - fr) * scat;
    col = mix(col, sky(normalize(vec3(d.x, 0.0, d.z))), 1.0 - exp(-dist * 0.003));
  }
  col = 1.0 - exp(-col * 1.3);
  float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + uT) * 43758.5453);
  col += (g - 0.5) * (2.0 / 255.0);
  o = vec4(col, 1.0);
}`;

export function startOcean(canvas, { reduced }) {
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'high-performance' });
  if (!gl) { canvas.hidden = true; return null; }
  const shader = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.hidden = true; return null; }
  gl.useProgram(prog);
  gl.bindVertexArray(gl.createVertexArray());
  const u = Object.fromEntries(['uR', 'uT', 'uP', 'uY'].map((k) => [k, gl.getUniformLocation(prog, k)]));

  let q = 0.7; // render scale; lowered automatically on slow GPUs
  const size = () => {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const w = innerWidth * dpr * q, h = innerHeight * dpr * q;
    const k = Math.min(1, Math.sqrt(900000 / Math.max(1, w * h)));
    canvas.width = Math.max(1, Math.round(w * k));
    canvas.height = Math.max(1, Math.round(h * k));
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  size();

  const state = { scroll: 0, pointer: 0, dirty: true };
  let ps = 0, ym = 0, last = performance.now(), acc = 0, n = 0;
  const t0 = last;
  const frame = (now) => {
    requestAnimationFrame(frame);
    const dt = now - last; last = now;
    ps += (state.scroll - ps) * 0.07;
    ym += (state.pointer * 0.12 - ym) * 0.04;
    if (reduced && !state.dirty && Math.abs(state.scroll - ps) < 1e-3) return;
    acc += dt; n++;
    if (n === 40) {
      if (acc / n > 24 && q > 0.4) { q -= 0.1; size(); }
      acc = 0; n = 0;
    }
    gl.uniform2f(u.uR, canvas.width, canvas.height);
    gl.uniform1f(u.uT, reduced ? 12 : (now - t0) / 1000 + 12);
    gl.uniform1f(u.uP, 0.035 + ps * 0.5);
    gl.uniform1f(u.uY, reduced ? 0 : ym);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    state.dirty = false;
  };
  requestAnimationFrame(frame);
  addEventListener('resize', () => { size(); state.dirty = true; });
  return state;
}

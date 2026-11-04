(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={email:`yash.ladlapure@gmail.com`,resume:`Yash_Ladlapure_Resume.pdf`,links:{github:`https://github.com/YashLadlapure`,linkedin:`https://www.linkedin.com/in/yash-ladlapure`},stats:[{value:`5`,label:`projects built end to end`},{value:`3`,label:`lakehouse pipelines at my internship`},{value:`20+`,label:`data-quality checks written`},{value:`1`,label:`Springer paper co-authored`}],tools:[{name:`Languages`,tools:[[`Python`,`Pipelines from PostgreSQL into Parquet and Apache Iceberg at my internship, and the data generator behind the Supply Chain Command Center.`],[`SQL`,`Normalized data models, 24 KPI queries and more than 20 data-quality checks.`],[`TypeScript`,`InternSetu, end to end.`],[`JavaScript`,`Every front-end and Node back-end I have shipped.`],[`Java`,`Coursework and problem solving.`],[`C++`,`Coursework and problem solving.`]]},{name:`Web`,tools:[[`React`,`The Research Copilot and Meme Vault front-ends.`],[`Next.js`,`InternSetu’s app and routing.`],[`Node.js`,`REST APIs with JWT and session-based auth.`],[`Express`,`Back-ends for Research Copilot and Meme Vault.`],[`Django`,`Python web back-ends.`],[`GSAP`,`Scroll choreography for my creative web work.`],[`WebGL`,`The ocean behind this page, written as a fragment shader.`]]},{name:`Data`,tools:[[`PostgreSQL`,`InternSetu’s API, the nine-table supply-chain schema and the lakehouse source at my internship.`],[`Iceberg`,`The table format for my internship pipelines.`],[`Trino`,`Querying Iceberg tables in the lakehouse.`],[`pandas`,`Data wrangling and validation.`],[`Power BI`,`Reporting supply-chain KPIs: OTIF, fill rate, supplier scores and stock-out risk.`],[`MongoDB`,`Meme Vault’s data.`]]},{name:`Infra & AI`,tools:[[`Docker`,`A Compose lakehouse with PostgreSQL, MinIO, Hive Metastore and Trino.`],[`MinIO`,`Object storage for the local lakehouse.`],[`GitHub Actions`,`CI for my projects.`],[`Linux`,`Where most of it runs.`],[`Gemini API`,`Section refinement with validated structured output in Research Copilot.`],[`Blender`,`Procedural 3D scenes scripted in Python.`]]}],journey:[{when:`Jan 2027 →`,where:`Next`,now:!0,title:`Looking for my next team.`,body:`Free for a six-month internship from January to June 2027, and for full-time roles after I graduate in July 2027.`,tags:[`Software engineering`,`Data`,`AI`]},{when:`Jul 2026 – now`,where:`Pune`,title:`Software Engineer Intern · Augmented Transformations`,body:`Building Python and SQL pipelines that move PostgreSQL data into Parquet and Apache Iceberg, queried through Trino on a Docker Compose lakehouse. Three pipelines, five normalized data models and more than 20 data-quality checks so far.`,tags:[`Python`,`SQL`,`Iceberg`,`Trino`,`Docker`]},{when:`2026`,where:`BrainCon · Springer`,title:`Co-author, AyurGPT`,body:`An AI dietician agent that brings Ayurvedic principles together with modern nutritional science. Accepted at BrainCon, Springer Volume 2; publication in progress.`,tags:[`Research`,`LLMs`]},{when:`Aug 2023 – 2027`,where:`MIT-WPU, Pune`,title:`B.Tech, Computer Science and Engineering`,body:`MIT World Peace University, class of 2027. Where I started building: lab assignments by day, side projects by night.`,tags:[`Class of 2027`]}],works:[{id:`rc`,cat:`AI`,hue:`teal`,name:`Research Copilot`,tag:`AI · Full-stack`,short:`A manuscript checker for Springer LNCS and IEEE that shows its work.`,preview:`check   margins ........ pass
check   figure captions  2 issues
- Fig 1. results
+ Figure 1. Results`,summary:`Deterministic rule checks produce a severity-tagged compliance report first. Gemini then refines sections, and every change arrives as a side-by-side diff the author approves, with retries when the model’s output fails validation.`,stack:[`React`,`Vite`,`Node.js`,`Express`,`Gemini API`]},{id:`sc`,cat:`Data`,hue:`sky`,name:`Supply Chain Command Center`,tag:`Data · Analytics`,short:`One data model and one set of KPIs for a year of operations.`,preview:`tables   9
kpis     24 queries
checks   12 data-quality
report   OTIF · fill rate · risk`,summary:`Python generates a reproducible year of operations data, a nine-table PostgreSQL schema models it, and 24 KPI queries plus 12 data-quality checks feed a Power BI report on OTIF, fill rate, supplier scores and stock-out risk.`,stack:[`Python`,`PostgreSQL`,`SQL`,`Power BI`]},{id:`is`,cat:`Full-stack`,hue:`amber`,name:`InternSetu`,tag:`Full-stack platform`,short:`Internship discovery and a status board for every application.`,preview:`saved → applied → interview → offer
sources  aggregated
auth     session-based`,summary:`Listings aggregated from several sources, student profiles, and a status board for every application, served by a PostgreSQL-backed REST API with session-based auth.`,stack:[`Next.js`,`TypeScript`,`Node.js`,`PostgreSQL`,`Docker`]},{id:`mv`,cat:`Full-stack`,hue:`rose`,name:`Meme Vault`,tag:`MERN app`,short:`Upload, browse, like and share memes on an endless feed.`,preview:`POST /api/memes   201
GET  /api/feed?cursor=…
auth  JWT
cdn   Cloudinary`,summary:`JWT auth, REST APIs, Cloudinary-backed image delivery and an infinite-scroll feed, built on MongoDB, Express, React and Node.`,stack:[`React`,`Node.js`,`Express`,`MongoDB`,`Cloudinary`]},{id:`pf`,cat:`Creative`,hue:`violet`,name:`This portfolio`,tag:`Creative web`,short:`A live ocean under glass, rendered on your GPU as you scroll.`,preview:`float h = waves(p.xz, 12);
vec3 n = normal(p.xz);
col = fresnel * sky(r) + deep;`,summary:`The sea is a WebGL2 fragment shader: layered waves are raymarched every frame, lit by a low sun, and the camera tilts down into the water as you scroll. Glass panels float above it.`,stack:[`WebGL2`,`GLSL`,`JavaScript`,`CSS`]}]},t=`#version 300 es
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.0-1.0,0.0,1.0);}`,n=`#version 300 es
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
}`;function r(e,{reduced:r}){let i=e.getContext(`webgl2`,{antialias:!1,alpha:!1,powerPreference:`high-performance`});if(!i)return e.hidden=!0,null;let a=(e,t)=>{let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n},o=i.createProgram();if(i.attachShader(o,a(i.VERTEX_SHADER,t)),i.attachShader(o,a(i.FRAGMENT_SHADER,n)),i.linkProgram(o),!i.getProgramParameter(o,i.LINK_STATUS))return e.hidden=!0,null;i.useProgram(o),i.bindVertexArray(i.createVertexArray());let s=Object.fromEntries([`uR`,`uT`,`uP`,`uY`].map(e=>[e,i.getUniformLocation(o,e)])),c=.7,l=()=>{let t=Math.min(devicePixelRatio||1,1.5),n=innerWidth*t*c,r=innerHeight*t*c,a=Math.min(1,Math.sqrt(9e5/Math.max(1,n*r)));e.width=Math.max(1,Math.round(n*a)),e.height=Math.max(1,Math.round(r*a)),i.viewport(0,0,e.width,e.height)};l();let u={scroll:0,pointer:0,dirty:!0},d=0,f=0,p=performance.now(),m=0,h=0,g=p,_=t=>{requestAnimationFrame(_);let n=t-p;p=t,d+=(u.scroll-d)*.07,f+=(u.pointer*.12-f)*.04,r&&!u.dirty&&Math.abs(u.scroll-d)<.001||(m+=n,h++,h===40&&(m/h>24&&c>.4&&(c-=.1,l()),m=0,h=0),i.uniform2f(s.uR,e.width,e.height),i.uniform1f(s.uT,r?12:(t-g)/1e3+12),i.uniform1f(s.uP,.035+d*.5),i.uniform1f(s.uY,r?0:f),i.drawArrays(i.TRIANGLES,0,3),u.dirty=!1)};return requestAnimationFrame(_),addEventListener(`resize`,()=>{l(),u.dirty=!0}),u}var i=(e,t=document)=>t.querySelector(e),a=(e,t=document)=>[...t.querySelectorAll(e)],o=e=>String(e).replace(/[&<>"]/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`})[e]),s=matchMedia(`(prefers-reduced-motion: reduce)`).matches;a(`[data-email]`).forEach(t=>{t.href=`mailto:${e.email}`}),a(`[data-email-text]`).forEach(t=>{t.textContent=e.email}),a(`[data-resume]`).forEach(t=>{t.href=e.resume}),a(`[data-link]`).forEach(t=>{let n=e.links[t.dataset.link];n&&(t.href=n,t.hidden=!1)}),i(`#stats`).innerHTML=e.stats.map(e=>`<div class="stat"><b>${o(e.value)}</b><span>${o(e.label)}</span></div>`).join(``),i(`#stops`).innerHTML=e.journey.map(e=>`
  <article class="glass reveal stop${e.now?` stop--now`:``}">
    <div class="stop__when"><span class="mono">${o(e.when)}</span><span>${o(e.where)}</span></div>
    <div class="stop__body">
      <h3>${o(e.title)}</h3>
      <p>${o(e.body)}</p>
      <div class="chips">${e.tags.map(e=>`<span class="chip sm">${o(e)}</span>`).join(``)}</div>
    </div>
  </article>`).join(``);var c=new Map(e.tools.flatMap(e=>e.tools));i(`#groups`).innerHTML=e.tools.map(e=>`
  <div class="group"><span class="label">${o(e.name)}</span>
    <div class="chips">${e.tools.map(([e])=>`<button type="button" class="tile" aria-pressed="false" data-tool="${o(e)}">${o(e)}</button>`).join(``)}</div>
  </div>`).join(``);var l=e=>{a(`[data-tool]`).forEach(t=>t.setAttribute(`aria-pressed`,String(t.dataset.tool===e))),i(`#tool-name`).textContent=e,i(`#tool-does`).textContent=c.get(e)};i(`#groups`).addEventListener(`click`,e=>{let t=e.target.closest(`[data-tool]`);t&&l(t.dataset.tool)}),l(e.tools[0].tools[0][0]);var u=[`All`,...new Set(e.works.map(e=>e.cat))];i(`#filters`).innerHTML=u.map(e=>`<button type="button" class="pill liquid" aria-pressed="${e===`All`}" data-cat="${o(e)}">${o(e)}</button>`).join(``),i(`#works`).innerHTML=e.works.map(e=>`
  <button type="button" class="card glass hue-${o(e.hue)}" aria-expanded="false" data-cat="${o(e.cat)}">
    <div class="preview"><div class="mono">${o(e.preview)}</div></div>
    <div class="card__body">
      <div class="card__top"><span class="label">${o(e.tag)}</span><span class="mono card__hint">Details +</span></div>
      <h3>${o(e.name)}</h3>
      <p>${o(e.short)}</p>
      <div class="card__more">
        <p>${o(e.summary)}</p>
        <div class="chips">${e.stack.map(e=>`<span class="chip sm">${o(e)}</span>`).join(``)}</div>
      </div>
    </div>
  </button>`).join(``);var d=a(`#works .card`),f=(e,t)=>{e.setAttribute(`aria-expanded`,String(t)),i(`.card__hint`,e).textContent=t?`Close`:`Details +`};i(`#filters`).addEventListener(`click`,e=>{let t=e.target.closest(`[data-cat]`);t&&(a(`#filters [data-cat]`).forEach(e=>e.setAttribute(`aria-pressed`,String(e===t))),d.forEach(e=>{e.hidden=t.dataset.cat!==`All`&&e.dataset.cat!==t.dataset.cat,f(e,!1)}))}),d.forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`aria-expanded`)!==`true`;d.forEach(n=>f(n,n===e&&t))}),e.addEventListener(`pointermove`,t=>{let n=e.getBoundingClientRect();e.style.setProperty(`--mx`,`${t.clientX-n.left}px`),e.style.setProperty(`--my`,`${t.clientY-n.top}px`)})}),i(`#copy`).addEventListener(`click`,async t=>{let n=t.currentTarget;try{await navigator.clipboard.writeText(e.email),n.textContent=`Copied ✓`}catch{n.textContent=e.email}setTimeout(()=>{n.textContent=`Copy address`},1800)});var p=r(i(`.ocean canvas`),{reduced:s}),m=i(`.ocean__shade`),h=i(`.nav__glider`),g=a(`.navlink`),_=[`profile`,`stack`,`journey`,`work`,`contact`],v=null,y=e=>{e?(h.style.opacity=`1`,h.style.width=`${e.offsetWidth}px`,h.style.transform=`translateX(${e.offsetLeft}px)`):h.style.opacity=`0`},b=()=>{let e=innerHeight||1;p&&(p.scroll=Math.min(1,scrollY/e),p.dirty=!0),m.style.opacity=String(Math.min(1,scrollY/(e*1.4))*.5);let t=null;for(let n of _)document.getElementById(n).getBoundingClientRect().top<e*.4&&(t=n);t!==v&&(v=t,g.forEach(e=>e.classList.toggle(`on`,e.hash===`#${t}`)),y(g.find(e=>e.hash===`#${t}`)))};addEventListener(`scroll`,b,{passive:!0}),addEventListener(`resize`,()=>{v=void 0,b()}),addEventListener(`pointermove`,e=>{p&&(p.pointer=e.clientX/innerWidth-.5)},{passive:!0}),b();
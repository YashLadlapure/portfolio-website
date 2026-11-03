# Yash Ladlapure — portfolio

A one-page, scroll-driven portfolio built around a 3D model of a Pune valley, rendered in Blender.

| Section | What happens |
|---|---|
| **Hero** | A golden-hour render of the valley: hills, a river, the city and one landmark per journey stop. Scrolling plays Blender's camera fly-in frame by frame, down to the MIT-WPU campus. |
| **How I got here** | The paragraph lights up word by word as you read, with underlines drawing under key phrases. |
| **Journey** | Seven stops: MIT-WPU, side projects, Research Copilot, Supply Chain Command Center, AyurGPT, Augmented Transformations, and what's next. Each stop is a rendered still of its landmark, and a story card updates as you scroll. |
| **Work** | A fanned deck of project cards. Click one to turn it over. |
| **Stack** | Your tools as keycaps. Press one to see what you've done with it. |
| **How I work** | The internship pipeline: a marker travels the stages as you scroll. |
| **Contact** | Shortcut cards plus keyboard shortcuts: **M** email, **R** résumé, and **G / L** once your GitHub and LinkedIn links are set. |

The floating dock follows the section you're in. Its last button opens your résumé.

**Day and night.** The sun/moon toggle in the top-right corner switches the palette (warm stone by day, ink blue with amber at night) and dissolves between two sets of Blender renders of the same valley. It starts from the visitor's system setting and remembers their choice.

## Run it

Requires Node 20+.

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:5173.

## Build and deploy

```bash
npm run build
```

Deploy `dist/` to any static host. On Vercel or Netlify, use build command `npm run build` and output directory `dist`.

## The 3D: Blender

Everything 3D is made by **`blender/render_scene.py`**, with no downloaded models or images:
- **The valley:** terrain, a river, a street grid, about 500 buildings and about 2,600 trees.
- **The landmarks:** a domed campus, a hostel block, a colonnaded library, a warehouse with containers, a greenhouse, a glass office tower and a stone gateway.
- **The light:** a low golden-hour sun.

The script renders everything in EEVEE twice: by day (low golden sun, almost no lit windows) and by night (moonlight, about a quarter of the windows lit), from identical cameras. It writes the result to `public/renders/`:

```
public/renders/day/hero/0000.webp …    44-frame camera fly-in (1440×810)
public/renders/day/stops/0.webp …      one still per journey stop
public/renders/night/…                 the same, after dark
public/renders/labels.json             screen position of every landmark label (shared by both modes)
```

To change the scene (camera path, landmarks, colours, light), edit the script and re-render. Both modes take about 20–25 minutes:

```bash
blender -b --factory-startup --python blender/render_scene.py
```

Add `-- --preview` for a fast low-res check, `-- --only stops` / `-- --only hero` to render part of it, or `-- --mode day` / `-- --mode night` for one mode.

On the site, `src/frames.js` draws the renders on one fixed canvas. Scroll picks the frame, and neighbouring frames are cross-faded. Nothing in 3D moves on its own.

## Update your content

Everything a visitor reads is in **`src/content.js`**:

- **Links:** fill in `links.github` and `links.linkedin`. Empty links hide their buttons and shortcuts. The résumé is `public/Yash_Ladlapure_Resume.pdf`; replace that file to update it.
- **Journey stops:** stop *N* matches landmark *N* in `MARKS` in the Blender script.
- **Projects and keyboard keys:** edit the arrays directly.

## Code map

```
blender/render_scene.py  ← builds and renders the 3D valley
src/content.js           ← your content
src/frames.js            ← plays the renders on scroll
src/render.js            ← turns content.js into markup
src/main.js              ← GSAP ScrollTrigger: hero, journey, deck, keyboard, pipeline, dock
src/styles.css           ← day and night palettes, layout, responsive rules
```

## Accessibility and performance

- **Reduced motion:** no entrance or word-by-word animation and no smooth scrolling. Frames follow your scroll directly.
- All content is real HTML text, the render canvas is `aria-hidden`, and the story card is announced politely.
- **Loading:** each mode's renders total about 3 MB of WebP, and only the mode being viewed is downloaded (the other loads when someone switches). The first frame and the journey stills load first, and the rest stream in. If they can't load, a plain gradient takes their place.
- **Dependencies:** GSAP is the only runtime library.

## Credits

Fonts: Bricolage Grotesque and Anek Latin, via Google Fonts. Library: GSAP. The layout ideas (a fly-in hero, a journey with stops, a project deck, a toolkit and keyboard shortcuts) are inspired by portfolios showcased by ThreeUI and others; all visuals, code and copy here are original.

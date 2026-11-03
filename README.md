# Yash Ladlapure — portfolio

A one-page portfolio: a live WebGL ocean at dusk behind glass panels, with Apple-style liquid-glass buttons and top bar.

Sections: hero, profile, stats, stack picker, experience, filterable works, contact.

## Run it

Requires Node 20+.

```bash
npm install
```

```bash
npm run dev
```

## Build and deploy

```bash
npm run build
```

Deploy `dist/` to any static host. On Vercel: `npx vercel --prod` (build command `npm run build`, output `dist`).

## Update your content

Everything a visitor reads in lists lives in `src/content.js`: links (fill in `github` and `linkedin`; empty ones stay hidden), stats, stack tools, experience and works. Static copy (hero, bio, contact) is in `index.html`. Replace `public/yash.jpg` and `public/Yash_Ladlapure_Resume.pdf` to update the photo and résumé.

## Code map

```
index.html          ← page markup and the liquid-glass SVG lens
src/content.js      ← your content
src/ocean.js        ← the WebGL2 ocean shader; scroll tilts the camera into the water
src/main.js         ← renders lists, stack picker, works filter, top-bar glider
src/styles.css      ← glass, liquid glass, layout, responsive rules
design/             ← the design comp this site was built from
```

## Accessibility and performance

- Reduced motion: entrance animations stop and the ocean renders as a still.
- The shader lowers its render scale automatically on slow GPUs; without WebGL2 a CSS gradient takes its place.
- No runtime dependencies.

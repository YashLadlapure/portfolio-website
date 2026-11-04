/**
 * ─────────────────────────────────────────────────────────────
 *  CONTENT: edit this file to update the site.
 *  Links left as '' are hidden automatically.
 * ─────────────────────────────────────────────────────────────
 */

export const site = {
  email: 'yash.ladlapure@gmail.com',
  resume: 'Yash_Ladlapure_Resume.pdf', // lives in /public; swap the file to update it
  links: {
    github: 'https://github.com/YashLadlapure',
    linkedin: 'https://www.linkedin.com/in/yash-ladlapure',
  },

  stats: [
    { value: '5', label: 'projects built end to end' },
    { value: '3', label: 'lakehouse pipelines at my internship' },
    { value: '20+', label: 'data-quality checks written' },
    { value: '1', label: 'Springer paper co-authored' },
  ],

  // The "In my stack" picker: [tool, where I used it]
  tools: [
    { name: 'Languages', tools: [
      ['Python', 'Pipelines from PostgreSQL into Parquet and Apache Iceberg at my internship, and the data generator behind the Supply Chain Command Center.'],
      ['SQL', 'Normalized data models, 24 KPI queries and more than 20 data-quality checks.'],
      ['TypeScript', 'InternSetu, end to end.'],
      ['JavaScript', 'Every front-end and Node back-end I have shipped.'],
      ['Java', 'Coursework and problem solving.'],
      ['C++', 'Coursework and problem solving.'],
    ] },
    { name: 'Web', tools: [
      ['React', 'The Research Copilot and Meme Vault front-ends.'],
      ['Next.js', 'InternSetu’s app and routing.'],
      ['Node.js', 'REST APIs with JWT and session-based auth.'],
      ['Express', 'Back-ends for Research Copilot and Meme Vault.'],
      ['Django', 'Python web back-ends.'],
      ['GSAP', 'Scroll choreography for my creative web work.'],
      ['WebGL', 'The ocean behind this page, written as a fragment shader.'],
    ] },
    { name: 'Data', tools: [
      ['PostgreSQL', 'InternSetu’s API, the nine-table supply-chain schema and the lakehouse source at my internship.'],
      ['Iceberg', 'The table format for my internship pipelines.'],
      ['Trino', 'Querying Iceberg tables in the lakehouse.'],
      ['pandas', 'Data wrangling and validation.'],
      ['Power BI', 'Reporting supply-chain KPIs: OTIF, fill rate, supplier scores and stock-out risk.'],
      ['MongoDB', 'Meme Vault’s data.'],
    ] },
    { name: 'Infra & AI', tools: [
      ['Docker', 'A Compose lakehouse with PostgreSQL, MinIO, Hive Metastore and Trino.'],
      ['MinIO', 'Object storage for the local lakehouse.'],
      ['GitHub Actions', 'CI for my projects.'],
      ['Linux', 'Where most of it runs.'],
      ['Gemini API', 'Section refinement with validated structured output in Research Copilot.'],
      ['Blender', 'Procedural 3D scenes scripted in Python.'],
    ] },
  ],

  journey: [
    { when: 'Jan 2027 →', where: 'Next', now: true, title: 'Looking for my next team.',
      body: 'Free for a six-month internship from January to June 2027, and for full-time roles after I graduate in July 2027.', tags: ['Software engineering', 'Data', 'AI'] },
    { when: 'Jul 2026 – now', where: 'Pune', title: 'Software Engineer Intern · Augmented Transformations',
      body: 'Building Python and SQL pipelines that move PostgreSQL data into Parquet and Apache Iceberg, queried through Trino on a Docker Compose lakehouse. Three pipelines, five normalized data models and more than 20 data-quality checks so far.', tags: ['Python', 'SQL', 'Iceberg', 'Trino', 'Docker'] },
    { when: '2026', where: 'BrainCon · Springer', title: 'Co-author, AyurGPT',
      body: 'An AI dietician agent that brings Ayurvedic principles together with modern nutritional science. Accepted at BrainCon, Springer Volume 2; publication in progress.', tags: ['Research', 'LLMs'] },
    { when: 'Aug 2023 – 2027', where: 'MIT-WPU, Pune', title: 'B.Tech, Computer Science and Engineering',
      body: 'MIT World Peace University, class of 2027. Where I started building: lab assignments by day, side projects by night.', tags: ['Class of 2027'] },
  ],

  // cat must be one of the filter names in index.html; hue: amber | teal | violet | rose | sky
  works: [
    { id: 'rc', cat: 'AI', hue: 'teal', name: 'Research Copilot', tag: 'AI · Full-stack',
      short: 'A manuscript checker for Springer LNCS and IEEE that shows its work.',
      preview: 'check   margins ........ pass\ncheck   figure captions  2 issues\n- Fig 1. results\n+ Figure 1. Results',
      summary: 'Deterministic rule checks produce a severity-tagged compliance report first. Gemini then refines sections, and every change arrives as a side-by-side diff the author approves, with retries when the model’s output fails validation.',
      stack: ['React', 'Vite', 'Node.js', 'Express', 'Gemini API'] },
    { id: 'sc', cat: 'Data', hue: 'sky', name: 'Supply Chain Command Center', tag: 'Data · Analytics',
      short: 'One data model and one set of KPIs for a year of operations.',
      preview: 'tables   9\nkpis     24 queries\nchecks   12 data-quality\nreport   OTIF · fill rate · risk',
      summary: 'Python generates a reproducible year of operations data, a nine-table PostgreSQL schema models it, and 24 KPI queries plus 12 data-quality checks feed a Power BI report on OTIF, fill rate, supplier scores and stock-out risk.',
      stack: ['Python', 'PostgreSQL', 'SQL', 'Power BI'] },
    { id: 'is', cat: 'Full-stack', hue: 'amber', name: 'InternSetu', tag: 'Full-stack platform',
      short: 'Internship discovery and a status board for every application.',
      preview: 'saved → applied → interview → offer\nsources  aggregated\nauth     session-based',
      summary: 'Listings aggregated from several sources, student profiles, and a status board for every application, served by a PostgreSQL-backed REST API with session-based auth.',
      stack: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'] },
    { id: 'mv', cat: 'Full-stack', hue: 'rose', name: 'Meme Vault', tag: 'MERN app',
      short: 'Upload, browse, like and share memes on an endless feed.',
      preview: 'POST /api/memes   201\nGET  /api/feed?cursor=…\nauth  JWT\ncdn   Cloudinary',
      summary: 'JWT auth, REST APIs, Cloudinary-backed image delivery and an infinite-scroll feed, built on MongoDB, Express, React and Node.',
      stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Cloudinary'] },
    { id: 'pf', cat: 'Creative', hue: 'violet', name: 'This portfolio', tag: 'Creative web',
      short: 'A live ocean under glass, rendered on your GPU as you scroll.',
      preview: 'float h = waves(p.xz, 12);\nvec3 n = normal(p.xz);\ncol = fresnel * sky(r) + deep;',
      summary: 'The sea is a WebGL2 fragment shader: layered waves are raymarched every frame, lit by a low sun, and the camera tilts down into the water as you scroll. Glass panels float above it.',
      stack: ['WebGL2', 'GLSL', 'JavaScript', 'CSS'] },
  ],
};

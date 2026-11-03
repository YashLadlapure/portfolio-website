/**
 * ─────────────────────────────────────────────────────────────
 *  CONTENT: edit this file to update the site.
 *  Everything a visitor reads comes from here. No HTML needed.
 *
 *  Links left as '' are hidden automatically (buttons, keyboard
 *  shortcuts and cards), so fill them in when you have them.
 * ─────────────────────────────────────────────────────────────
 */

export const site = {
  name: 'Yash Santosh Ladlapure',
  firstName: 'Yash',
  email: 'yash.ladlapure@gmail.com',
  status: 'Open to internships · Jan 2027',

  links: {
    github: '',   // 'https://github.com/your-handle'
    linkedin: '', // 'https://www.linkedin.com/in/your-handle'
    resume: 'Yash_Ladlapure_Resume.pdf', // lives in /public; swap the file to update it
  },

  hero: {
    hello: 'hey, I’m Yash',
    lines: ['Data pipelines underneath.', 'Motion on top.'],
    sub: 'CS student at MIT-WPU, Pune. Software engineer intern who moves data at work and pixels on the web.',
    cue: 'scroll to descend',
    // Labels over landmarks in the rendered valley. `stop` = journey stop index (blender/render_scene.py MARKS).
    pins: [
      { label: 'MIT-WPU', note: '2023', stop: 0 },
      { label: 'Augmented Transformations', note: 'Now', stop: 5 },
      { label: 'Supply Chain Command Center', note: '', stop: 3 },
    ],
  },

  story: {
    label: 'How I got here',
    // Wrap phrases in [square brackets] to underline them as they light up.
    text: 'I moved to Pune to study computer science. Somewhere between lab assignments and side projects I got hooked on two things: making [data flow cleanly] and making [interfaces move]. Now I do both, pipelines at work and motion on the web.',
    notes: [
      { title: 'MIT-WPU', body: 'B.Tech CSE · Class of 2027', tint: 'haldi' },
      { title: 'Co-author', body: 'AyurGPT · BrainCon, Springer 2026', tint: 'paper' },
      { title: 'Intern', body: 'Augmented Transformations, Pune', tint: 'sindoor' },
    ],
  },

  /**
   * The journey through the 3D valley. Stops are visited in order as you
   * scroll; stop N sits at the Blender empty `stop_N` (blender/build_scene.py).
   */
  journey: {
    heading: 'From first commit to the lakehouse.',
    sub: 'Seven stops across Pune. Scroll to move between them.',
    stops: [
      {
        place: 'MIT-WPU, Pune', when: 'Aug 2023', tint: 'sindoor',
        title: 'B.Tech, Computer Science.',
        body: 'Started engineering at MIT World Peace University. Class of 2027.',
        stats: [{ value: '7.55', label: 'CGPA' }, { value: '2027', label: 'graduating' }],
      },
      {
        place: 'Side projects', when: 'Build season', tint: 'rani',
        title: 'First full-stack apps.',
        body: 'Meme Vault taught me auth, uploads and infinite scroll on a MERN stack. InternSetu went bigger: Next.js, TypeScript, PostgreSQL and Docker.',
      },
      {
        place: 'Research Copilot', when: 'Shipped', tint: 'leaf',
        title: 'AI that shows its work.',
        body: 'A manuscript checker for Springer LNCS and IEEE profiles. Rule checks first, Gemini second, and every change as a diff the author approves.',
        stats: [{ value: '2', label: 'conference profiles' }, { value: 'Vercel + Render', label: 'deployed on' }],
      },
      {
        place: 'Supply Chain Command Center', when: 'Analytics', tint: 'indigo',
        title: 'One model, one set of KPIs.',
        body: 'A year of reproducible operations data in PostgreSQL, reported through SQL and Power BI: OTIF, fill rate, supplier scores and stock-out risk.',
        stats: [{ value: '24', label: 'KPI queries' }, { value: '12', label: 'data-quality checks' }],
      },
      {
        place: 'BrainCon · Springer', when: '2026', tint: 'leaf',
        title: 'Co-authored AyurGPT.',
        body: 'An AI dietician agent that brings Ayurvedic principles together with modern nutritional science. Accepted at BrainCon, Springer Volume 2; publication in progress.',
      },
      {
        place: 'Augmented Transformations', when: 'Jul 2026 – now', tint: 'indigo',
        title: 'Software Engineer Intern.',
        body: 'Building Python/SQL pipelines from PostgreSQL into Parquet and Apache Iceberg, queried through Trino, on a Docker Compose lakehouse.',
        stats: [{ value: '3', label: 'pipelines' }, { value: '5', label: 'data models' }, { value: '20+', label: 'quality checks' }],
      },
      {
        place: 'Next stop', when: '2027', tint: 'haldi',
        title: 'Your team, maybe.',
        body: 'Free for a six-month internship from January to June 2027, and for full-time roles after I graduate in July 2027.',
      },
    ],
  },

  work: {
    heading: 'Work, dealt from the deck.',
    sub: 'Click a card to turn it over.',
    items: [
      {
        name: 'Research Copilot', tag: 'AI · Full-stack', tint: 'leaf',
        summary: 'An AI-assisted manuscript checker for Springer LNCS and IEEE conference profiles. Deterministic rule checks produce a severity-tagged compliance report; Gemini refines sections; retries and side-by-side diffs keep the author in control.',
        stack: ['React', 'Vite', 'Node.js', 'Express', 'Gemini API'],
        links: { live: '', code: '' },
      },
      {
        name: 'InternSetu', tag: 'Full-stack platform', tint: 'haldi',
        summary: 'Internship discovery and application tracking: listings aggregated from several sources, student profiles, and a status board for every application, on a PostgreSQL-backed REST API with session-based auth.',
        stack: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
        links: { live: '', code: '' },
      },
      {
        name: 'Supply Chain Command Center', tag: 'Data · Analytics', tint: 'indigo',
        summary: 'Python generates a reproducible year of operations data, a nine-table PostgreSQL schema models it, and 24 KPI queries plus 12 data-quality checks feed a Power BI report.',
        stack: ['Python', 'PostgreSQL', 'SQL', 'Power BI'],
        links: { live: '', code: '' },
      },
      {
        name: 'Meme Vault', tag: 'MERN app', tint: 'rani',
        summary: 'Upload, browse, like and share memes. JWT auth, REST APIs, Cloudinary-backed image delivery and an infinite-scroll feed.',
        stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Cloudinary'],
        links: { live: '', code: '' },
      },
      {
        name: 'This portfolio', tag: 'Creative web', tint: 'sindoor',
        summary: 'A Pune valley modelled and rendered in Blender from a Python script, then scrubbed frame by frame with GSAP ScrollTrigger as you scroll.',
        stack: ['Blender', 'Python', 'GSAP', 'Vite'],
        links: { live: '', code: '' },
      },
    ],
  },

  /** The keyboard. Each key: label, and one line on what you've done with it. */
  stack: {
    heading: 'My stack, as a keyboard.',
    sub: 'Press a key to see what I’ve done with it.',
    rows: [
      [
        { key: 'Python', does: 'Pipelines from PostgreSQL to Parquet and Iceberg; data generation for analytics projects.' },
        { key: 'SQL', does: 'Normalized data models, KPI queries and 20+ data-quality checks.' },
        { key: 'JavaScript', does: 'Every front-end and Node back-end I’ve shipped.' },
        { key: 'TypeScript', does: 'InternSetu, end to end.' },
        { key: 'Java', does: 'Coursework and problem solving.' },
        { key: 'C++', does: 'Coursework and problem solving.' },
      ],
      [
        { key: 'React', does: 'Research Copilot and Meme Vault front-ends.' },
        { key: 'Next.js', does: 'InternSetu’s app and routing.' },
        { key: 'Node.js', does: 'REST APIs with JWT and session auth.' },
        { key: 'Express', does: 'Back-ends for Research Copilot and Meme Vault.' },
        { key: 'Django', does: 'Python web back-ends.' },
        { key: 'GSAP', does: 'All the scroll choreography on this site.' },
      ],
      [
        { key: 'PostgreSQL', does: 'InternSetu’s API, the supply-chain schema, the internship lakehouse source.' },
        { key: 'MongoDB', does: 'Meme Vault’s data.' },
        { key: 'Docker', does: 'Containerized PostgreSQL, MinIO, Hive Metastore and Trino with Compose.' },
        { key: 'Trino', does: 'Querying Iceberg tables in the lakehouse.' },
        { key: 'Iceberg', does: 'Table format for the internship pipelines.' },
        { key: 'Blender', does: 'Modelled and rendered the valley on this page, procedurally in Python.' },
      ],
      [
        { key: 'Gemini', does: 'Section refinement with structured output validation in Research Copilot.' },
        { key: 'pandas', does: 'Data wrangling and validation.' },
        { key: 'MinIO', does: 'Object storage for the local lakehouse.' },
        { key: 'GitHub Actions', does: 'CI for my projects.', wide: true },
        { key: 'Linux', does: 'Where most of it runs.' },
      ],
    ],
  },

  process: {
    heading: 'How I build a pipeline.',
    sub: 'The lakehouse at my internship, step by step.',
    steps: [
      { name: 'Read the source', body: 'Profile the PostgreSQL tables before moving anything.' },
      { name: 'Model it', body: 'Five normalized models with foreign-key validation.' },
      { name: 'Check it', body: '20+ data-quality checks for schema and relationship issues.' },
      { name: 'Move it', body: 'Python/SQL jobs write Parquet and Apache Iceberg tables.' },
      { name: 'Serve it', body: 'Trino queries the tables; Docker Compose makes it reproducible.' },
      { name: 'Write it down', body: 'Validation and troubleshooting steps documented for the team.' },
    ],
  },

  contact: {
    heading: 'Let’s build something that keeps moving.',
    sub: 'Internships, projects, or just hello. My inbox is open.',
    where: 'Pune · open to Bangalore, Hyderabad, Mumbai and remote',
  },
};

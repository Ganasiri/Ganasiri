/**
 * Every piece of copy on the site lives in this file, so updating the
 * portfolio never means touching a component.
 *
 * Text wrapped in *asterisks* is set in the italic serif accent face.
 */

export type Link = { label: string; href: string }

export type Stat = { value: number; suffix?: string; label: string }

export type Service = { title: string; description: string; tags: string[] }

export type Project = {
  /** Short name shown large on the card. */
  title: string
  /** Full title, e.g. the paper's title. */
  subtitle: string
  kind: string
  /** Venue, year or status, e.g. "AIDE 2023" or "Paper in preparation". */
  meta: string
  summary: string
  /** The one number that sums the project up. */
  metric: { value: string; label: string }
  tools: string[]
  /** Image path inside /public, or an absolute URL. */
  image: string
  /** Optional link to a paper, demo or repository. */
  href?: string
}

export type Milestone = {
  /** Shown on the large rolling counter beside the timeline. */
  marker: string
  period: string
  title: string
  organisation: string
  description: string
}

export type SkillGroup = { title: string; items: string[] }

export const profile = {
  name: 'Ganasiri M M',
  /** Set huge across the hero, so keep it to one word. */
  displayName: 'Ganasiri',
  role: 'Product Analyst',
  /** Cycles after the role in the hero. */
  focus: ['Data Analytics', 'Artificial Intelligence', 'Data Science'],
  intro: 'I turn product data into decisions, and build AI that people can *trust*.',
  status: 'Product Analyst at Quest Alliance',
  location: 'Bengaluru, India',
  email: 'mmganasiri30@gmail.com',
  /** Profiles listed under "Elsewhere" in Contact; the block hides when empty. */
  links: [
    // { label: 'LinkedIn', href: 'https://www.linkedin.com/in/your-handle' },
  ] as Link[],
}

/** In-page navigation. Each id must match a section id. */
export const navigation = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]

export const about = {
  statement:
    'I combine data analysis, machine learning and Responsible AI evaluation to turn product and operational data into *decisions* leadership can act on.',
  paragraphs: [
    "I'm a Product Analyst at Quest Alliance in Bengaluru. My work runs from product analytics and A/B testing to sales forecasting, decision dashboards and AI products built from system design through to user testing.",
    'I studied Artificial Intelligence and Data Science at Global Academy of Technology. My research covers predictive modelling and explainable AI, with three papers so far, two of them as first author.',
    'Away from data, I led my college fashion team, helped organise the CIISCA IEEE conference and INTERACT 2025, won Western Group Dance prizes three years running and gave more than 400 hours to community volunteering.',
  ],
  stats: [
    { value: 95, suffix: '%', label: 'Engagement on a learning product, up from 74%' },
    { value: 37, suffix: '%', label: 'Less time to first action after onboarding changes' },
    { value: 40, suffix: '%', label: 'Higher humanness and RAI scores for a RAG assistant' },
    { value: 3, label: 'Research papers, two as first author' },
  ] satisfies Stat[],
}

export const servicesSection = {
  label: 'What I do',
  title: 'Where data meets *decisions*',
  blurb:
    'Four kinds of work I do most, from the first SQL query to an AI product people use every day.',
}

export const services: Service[] = [
  {
    title: 'Product analytics',
    description:
      'Analytics frameworks that follow a product from introduction to outcomes, built on SQL datasets, ETL pipelines, A/B test analysis and dashboards leadership can act on.',
    tags: ['SQL', 'A/B testing', 'Power BI', 'Superset'],
  },
  {
    title: 'Machine learning & forecasting',
    description:
      'Forecasting and classification models, from SARIMAX and LSTMs to neural networks and ensembles, benchmarked on real business and research data.',
    tags: ['TensorFlow', 'Keras', 'scikit-learn', 'XGBoost'],
  },
  {
    title: 'Responsible & explainable AI',
    description:
      'Evaluation baselines, golden datasets and guardrails for AI assistants, plus LIME and SHAP explanations that show why a model decided what it did.',
    tags: ['RAI evaluation', 'Golden datasets', 'LIME', 'SHAP'],
  },
  {
    title: 'AI product engineering',
    description:
      'Data models, software design documents and agent-driven workflows. On my latest product they cut delivery from three months to one.',
    tags: ['Agentic AI', 'RAG', 'FastAPI', 'Docker'],
  },
]

export const workSection = {
  label: 'Projects & research',
  title: 'Selected *work*',
  blurb: 'Products and papers across healthcare, marketing, drones and cloud services.',
}

export const projects: Project[] = [
  {
    title: 'GRACE',
    subtitle: 'Guided Response Assistant for Care and Empathy',
    kind: 'Healthcare platform',
    meta: 'Paper in preparation',
    summary:
      'Full-stack healthcare platform with OCR prescription digitisation, medication reminders and an AI chatbot. 480 ms average response under 100 concurrent users; 92% of pilot users rated it easy to use.',
    metric: { value: '91%+', label: 'OCR accuracy' },
    tools: ['Angular', 'FastAPI', 'MongoDB Atlas', 'EasyOCR', 'Docker'],
    image: '/work/grace.svg',
  },
  {
    title: 'Conversion forecasting',
    subtitle: 'Forecast Conversion in Digital Marketing Using Artificial Neural Network',
    kind: 'Research · First author',
    meta: 'INCIP 2026 · Accepted',
    summary:
      'A nine-layer neural network trained on 8,000 marketing records that beat Random Forest and Logistic Regression, with LIME surfacing the ten strongest conversion drivers.',
    metric: { value: '0.92', label: 'F1-score · AUC 0.91' },
    tools: ['Neural networks', 'LIME', 'Random Forest', 'Logistic Regression'],
    image: '/work/conversion.svg',
  },
  {
    title: 'Lung cancer prognosis',
    subtitle: 'Improved Lung Cancer Prognosis via Hyperparameter Tuning on ML Classification Algorithms',
    kind: 'Research · Co-author',
    meta: 'CODE-AI 2024 · MIT Bengaluru',
    summary:
      'Compared more than 15 classifiers, tuned a Random Forest to the top result and explained its predictions with LIME and SHAP.',
    metric: { value: '93.5%', label: 'Accuracy · 0.95 F1' },
    tools: ['Random Forest', 'Hyperparameter tuning', 'LIME', 'SHAP'],
    image: '/work/lung.svg',
    href: 'https://doi.org/10.1201/9781003587392-35',
  },
  {
    title: 'UAV flight modes',
    subtitle: 'UAV Flight-Mode Classification Using CNN Transfer Learning',
    kind: 'Research · First author',
    meta: 'AIDE 2023',
    summary:
      'VGG16 transfer learning on DroneRF signals lifted flight-mode accuracy over prior work from 46.8% to 87.3%, with 100% UAV detection and 88.6% accuracy across four UAV types.',
    metric: { value: '87.3%', label: 'Flight-mode accuracy' },
    tools: ['VGG16', 'Transfer learning', 'CNN', 'DroneRF'],
    image: '/work/uav.svg',
    href: 'https://doi.org/10.1063/5.0262989',
  },
  {
    title: 'Cloud storage selection',
    subtitle: 'Smart Cloud Storage Selection Using Fuzzy AHP and Fuzzy TOPSIS',
    kind: 'Decision science',
    meta: 'Unpublished study',
    summary:
      'Weighted six criteria with Fuzzy AHP, with security ranked highest, then ranked iCloud, Mega, Google Drive and OneDrive with Fuzzy TOPSIS. OneDrive came first.',
    metric: { value: '0.57', label: 'Top closeness coefficient' },
    tools: ['Fuzzy AHP', 'Fuzzy TOPSIS', 'Multi-criteria analysis'],
    image: '/work/cloud.svg',
  },
]

export const experienceSection = {
  label: 'Experience',
  title: 'Experience & *education*',
  blurb: 'From an AI and Data Science degree to analytics and AI products in production.',
}

/** Oldest first, so the timeline reads forward as you scroll. */
export const experience: Milestone[] = [
  {
    marker: '2021',
    period: '2021 – 2025',
    title: 'B.E. Artificial Intelligence & Data Science',
    organisation: 'Global Academy of Technology, Bengaluru',
    description:
      'Graduated with a CGPA of 8.29/10, with A+ grades in Predictive and Time Series Analysis, Big Data Analytics, Data Visualization with Tableau and Machine Learning II.',
  },
  {
    marker: '2024',
    period: 'Oct 2024 – Mar 2025',
    title: 'AI/ML & Data Science Intern',
    organisation: 'Bosch Limited',
    description:
      'Benchmarked SARIMAX, LSTM, neural-network and ensemble models for power-tools sales forecasting, and built a Power BI dashboard with automated Python reporting that cut decision-making time by 40%.',
  },
  {
    marker: 'Now',
    period: 'Jul 2025 – Present',
    title: 'Product Analyst',
    organisation: 'Quest Alliance, Bengaluru',
    description:
      'Built the product analytics framework, raised engagement on a learning product from 74% to 95%, set Responsible AI baselines for a RAG-based assistant and drove core development of an AI product for government-school teachers.',
  },
]

export const stackSection = {
  label: 'Toolbox',
  title: 'Tools I *reach* for',
  blurb: 'The languages, libraries and platforms behind the work above.',
}

/** Words that sweep across the screen as you scroll through the toolbox. */
export const marquee = [
  'Python',
  'SQL',
  'Power BI',
  'TensorFlow',
  'Tableau',
  'scikit-learn',
  'RAG',
  'XGBoost',
  'LIME',
  'SHAP',
  'Agentic AI',
  'FastAPI',
  'Keras',
  'Pandas',
  'LSTM',
  'Docker',
  'SARIMAX',
  'MongoDB',
]

export const skills: SkillGroup[] = [
  { title: 'Programming', items: ['Python', 'SQL', 'TypeScript'] },
  {
    title: 'Analytics & BI',
    items: ['Power BI', 'Tableau', 'Apache Superset', 'Pandas', 'Matplotlib', 'ETL pipelines', 'A/B testing'],
  },
  {
    title: 'Machine learning & AI',
    items: ['TensorFlow', 'Keras', 'scikit-learn', 'XGBoost', 'LSTM', 'SARIMAX', 'Transfer learning', 'RAG', 'Agentic AI'],
  },
  {
    title: 'Responsible AI',
    items: ['RAI evaluation', 'Golden Dataset evaluation', 'LIME', 'SHAP'],
  },
  {
    title: 'Engineering & tools',
    items: ['FastAPI', 'Angular', 'MySQL', 'MongoDB Atlas', 'Docker', 'GitHub Actions', 'Git', 'AI-assisted development'],
  },
]

export const certifications = [
  'Data Science for Engineers · NPTEL',
  'Machine Learning Foundations · Infosys Springboard',
  'Python Foundation · Infosys Springboard',
  'IBMZ Datathon',
]

export const contact = {
  label: 'Contact',
  title: "Let's turn data into *decisions*",
  blurb: 'Questions about a project, a role or a research idea? My inbox is open.',
  cta: 'Say hello',
}

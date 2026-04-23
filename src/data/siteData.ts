export type Article = {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
  region: string;
  featured?: boolean;
  archived?: boolean;
  topic?: string;
};

export type NavCategory = {
  name: string;
  slug: string;
  children?: { name: string; slug: string }[];
};

const paragraph = `London Post delivers sharp reporting, policy-focused analysis and long-form regional coverage for readers who want context, clarity and credibility. This placeholder article is intentionally long so you can test summary previews, read-more interactions and the bottom reading section without navigating away from the page. The structure is designed for your future API or CMS integration, whether you keep WordPress at the backend or move fully into your own MERN-based stack.`;

const detailed = `${paragraph}\n\nEditors can later swap this text for real article bodies, embedded media, pull quotes or newsletter sign-up components. The frontend keeps the experience smooth by loading the selected article inside the same page, then scrolling to a dedicated reading area. That gives you the editorial feel of a modern research magazine while preserving a fast category browsing experience for high-volume content pages.\n\nThis demo also supports featured stories, latest updates and archived articles. You can extend the dummy data model with slugs, SEO fields, tags, sponsorship metadata, podcasts, live video IDs and membership restrictions when connecting your backend.`;
export const moreMenu = [
  'Sports',
  'Interviews',
  'Art & Culture',
  'Hidden Histories',
  'Youth Voices',
  'Economy',
  'Defence',
  'Video',
  'Opinion',
  'Diplomatic Corner',
];
export const regionMenus: Record<string, string[]> = {
  asia:       ['East Asia', 'South Asia', 'Southeast Asia', 'Central Asia'],
  europe:     [],
  middleeast: [],
  oceania:    [],
  africa:     [],
  americas:   ['North America', 'Latin America & Caribbean', 'South America'],
  caucasus:   [],
  russia:     [],
};

export const navigation: NavCategory[] = [
  { name: 'Home', slug: '/' },
  {
    name: 'About Us',
    slug: '/about',
    children: [
      { name: 'Our Team', slug: '/about/team' },
      { name: 'Our Researchers', slug: '/about/researchers' },
      { name: 'What We Do', slug: '/about/what-we-do' },
    ],
  },
  { name: 'Contact Us', slug: '/contact' },
  { name: 'World', slug: '/regions' },
  { name: 'Live Podcast', slug: '/live' },
  { name: 'Mission & Vision', slug: '/mission-vision' },
  { name: 'Asia', slug: '/region/asia' },
  { name: 'Europe', slug: '/region/europe' },
  { name: 'Middle East', slug: '/region/middleeast' },
  { name: 'Americas', slug: '/region/americas' },
  {
    name: 'More',
    slug: '/more',
    children: [
      ...moreMenu.map((item) => ({
        name: item,
        slug: `/section/${item.toLowerCase().replace(/\s+/g, '-')}`,
      })),
   
    ],
  },
  { name: 'Membership', slug: '/membership' },
];

export const homeHero = {
  title: 'From strategy to statecraft: modern journalism built for global readers',
  subtitle: 'Feature a looping video, hero image or live stream here while preserving the premium editorial feel of your brand.',
  cta: 'Explore Latest Coverage',
};

const baseArticles: Article[] = [
  {
    id: 'a1',
    title: 'Strategic opportunity for Pakistan in Russian tourism amid global changes',
    subtitle: 'Travel diplomacy is emerging as a soft-power bridge across Eurasia.',
    content: detailed,
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=1200&q=80',
    author: 'Editorial Desk',
    date: 'March 27, 2026',
    category: 'Diplomacy',
    region: 'Asia',
    featured: true,
    topic: 'Trending News',
  },
  {
    id: 'a2',
    title: 'Kazakhstan constitutional reform discussed at UK Parliament roundtable',
    subtitle: 'Policy experts highlighted legal modernization and investor confidence.',
    content: detailed,
    image: 'https://images.unsplash.com/photo-1575320181282-9afab399332c?auto=format&fit=crop&w=1200&q=80',
    author: 'Staff Reporter',
    date: 'March 27, 2026',
    category: 'Analysis',
    region: 'Asia',
    topic: 'Latest Headlines',
  },
  {
    id: 'a3',
    title: 'The new iron curtain: how mineral corridors are reshaping security alliances',
    subtitle: 'Critical resources are rewriting defense and industrial policy.',
    content: detailed,
    image: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1200&q=80',
    author: 'Global Affairs Team',
    date: 'February 27, 2026',
    category: 'Defense News',
    region: 'Europe',
    archived: true,
    topic: 'Hot Topics',
  },
  {
    id: 'a4',
    title: 'Afghanistan’s enduring militant landscape: a brief overview',
    subtitle: 'A concise explainer on factions, cross-border pressure and policy choices.',
    content: detailed,
    image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80',
    author: 'Research Unit',
    date: 'February 27, 2026',
    category: 'World News',
    region: 'Asia',
    archived: true,
    topic: 'Hot Topics',
  },
  {
    id: 'a5',
    title: 'Oil edges up despite de-escalation talks as markets price uncertainty',
    subtitle: 'Traders continue to balance diplomacy with supply concerns.',
    content: detailed,
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    author: 'Market Watch',
    date: 'March 27, 2026',
    category: 'Economics',
    region: 'Middle East',
    topic: 'Trending News',
  },
  {
    id: 'a6',
    title: 'Latin America emerges as a new frontier for investment opportunities',
    subtitle: 'Regional infrastructure and digital corridors are drawing fresh capital.',
    content: detailed,
    image: 'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=1200&q=80',
    author: 'Ray Hanania',
    date: 'March 27, 2026',
    category: 'Economics',
    region: 'Americas',
    featured: true,
    topic: 'Latest Headlines',
  },
  {
    id: 'a7',
    title: 'Saudi POS spending holds firm as digital adoption widens across sectors',
    subtitle: 'Consumer behavior remains resilient in premium and convenience categories.',
    content: detailed,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    author: 'Business Desk',
    date: 'March 25, 2026',
    category: 'UK News',
    region: 'Middle East',
    topic: 'Trending News',
  },
  {
    id: 'a8',
    title: 'Global AI governance at a crossroads',
    subtitle: 'Researchers call for principles that match the speed of deployment.',
    content: detailed,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    author: 'Dr. Abdel-Hameed Nawar',
    date: 'March 22, 2026',
    category: 'Analysis',
    region: 'Europe',
    topic: 'Hot Topics',
  },
  {
    id: 'a9',
    title: 'Britain’s diplomatic reset and the future of European security dialogues',
    subtitle: 'A long-view analysis of trust, burden sharing and institutions.',
    content: detailed,
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    author: 'London Bureau',
    date: 'March 20, 2026',
    category: 'Diplomacy',
    region: 'United Kingdom',
    topic: 'Latest Headlines',
  },
  {
    id: 'a10',
    title: 'How membership-backed media can fund independent geopolitical reporting',
    subtitle: 'Sustainable media models increasingly rely on trust and community.',
    content: detailed,
    image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80',
    author: 'Publisher’s Note',
    date: 'March 18, 2026',
    category: 'Interviews',
    region: 'Europe',
    topic: 'Hot Topics',
  },
  {
    id: 'a11',
    title: 'Canada’s Arctic strategy enters a decisive decade',
    subtitle: 'Logistics, climate pressure and allied coordination are converging.',
    content: detailed,
    image: 'https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=1200&q=80',
    author: 'North America Desk',
    date: 'March 12, 2026',
    category: 'Defense News',
    region: 'Canada',
    topic: 'Trending News',
  },
  {
    id: 'a12',
    title: 'Interview: an inside view on cross-regional think tank collaboration',
    subtitle: 'Institutional partnerships are broadening the reach of policy debate.',
    content: detailed,
    image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=1200&q=80',
    author: 'Special Correspondent',
    date: 'March 10, 2026',
    category: 'Interviews',
    region: 'Americas',
    archived: true,
    topic: 'Latest Headlines',
  },
];
const countrySeed = [
  ...regionMenus.asia,
  ...regionMenus.europe,
  ...regionMenus.middleeast,
  ...regionMenus.oceania,
  ...regionMenus.africa,
  ...regionMenus.americas,
  ...regionMenus.caucasus,
  ...regionMenus.russia,
  'Middle East',
  'Oceania',
  'Caucasus',
  'Russia',
];

export const articles: Article[] = [
  ...baseArticles,
  ...countrySeed.flatMap((country, index) => {
    const cslug = country.toLowerCase();
    return [
      {
        id: `${cslug}-1`,
        title: `${country} policy outlook and strategic priorities for 2026`,
        subtitle: `A country-focused briefing with political and economic signals from ${country}.`,
        content: detailed,
        image: `https://picsum.photos/seed/${encodeURIComponent(cslug)}a/1200/800`,
        author: 'Regional Analysis Unit',
        date: 'March 15, 2026',
        category: index % 2 === 0 ? 'Analysis' : 'World News',
        region: country,
        featured: index % 4 === 0,
        topic: 'Latest Headlines',
      },
      {
        id: `${cslug}-2`,
        title: `${country} market brief: what investors and diplomats are watching`,
        subtitle: `Short-form market and diplomacy coverage designed for fast scanning.`,
        content: detailed,
        image: `https://picsum.photos/seed/${encodeURIComponent(cslug)}b/1200/800`,
        author: 'Economics Desk',
        date: 'March 04, 2026',
        category: 'Economics',
        region: country,
        archived: index % 3 === 0,
        topic: 'Trending News',
      },
    ];
  }),
  ...moreMenu.flatMap((section, index) => ({
    id: `section-${index}`,
    title: `${section}: editorial special for fast-moving global developments`,
    subtitle: 'Designed to demonstrate dedicated section pages with featured, latest and archived blocks.',
    content: detailed,
    image: `https://picsum.photos/seed/section-${index}/1200/800`,
    author: 'Section Editor',
    date: 'March 08, 2026',
    category: section,
    region: 'Global',
    featured: index % 2 === 0,
    archived: index % 3 === 0,
    topic: section,
  })),
];

export const stats = [
  { label: 'Monthly Readers', value: 850000 },
  { label: 'Published Briefings', value: 4200 },
  { label: 'Global Contributors', value: 140 },
  { label: 'Policy Events Hosted', value: 96 },
];

export const membershipPlans = [
  {
    name: 'Digital Reader',
    price: '$19/month',
    summary: 'For daily readers who want premium access and curated newsletters.',
    features: ['Unlimited premium stories', 'Daily briefing email', 'Podcast archive access', 'Community comments'],
    details: 'Best for independent professionals and readers following geopolitical developments every day.',
  },
  {
    name: 'Professional',
    price: '$49/month',
    summary: 'Built for analysts, diplomats, founders and public affairs teams.',
    features: ['Everything in Digital Reader', 'Research archive', 'Monthly webinar invites', 'Exportable reading lists'],
    details: 'Adds deeper research access and event privileges for professionals who rely on policy coverage.',
  },
  {
    name: 'Institutional',
    price: '$199/month',
    summary: 'A team-oriented package for think tanks, universities and organizations.',
    features: ['Up to 10 seats', 'Institutional reports', 'Partner visibility options', 'Dedicated account support'],
    details: 'Includes flexible access for teams, enhanced reporting and member services for organizations.',
  },
];

export const teamGroups = [
  {
    title: 'Executive Leadership',
    members: [
      ['Editor-in-Chief', 'Shapes editorial direction and standards across all desks.'],
      ['Managing Director', 'Oversees operations, publishing and strategic partnerships.'],
      ['Creative Director', 'Leads the design language, campaigns and visual identity.'],
    ],
  },
  {
    title: 'Editorial & Research',
    members: [
      ['Regional Editors', 'Coordinate coverage across Asia, Europe and the Americas.'],
      ['Senior Researchers', 'Produce long-form analysis, explainers and briefs.'],
      ['Investigations Unit', 'Develops in-depth stories and source-led reporting.'],
    ],
  },
  {
    title: 'Advisory Council',
    members: [
      ['Policy Advisors', 'Guide strategic depth and public affairs relevance.'],
      ['Academic Fellows', 'Bring specialist knowledge and cross-border perspectives.'],
      ['Industry Mentors', 'Support sustainable media, growth and partnerships.'],
    ],
  },
  {
    title: 'Audience & Growth',
    members: [
      ['Membership Lead', 'Designs subscriber journeys, events and retention programs.'],
      ['Partnerships Manager', 'Handles institutional tie-ups and sponsored opportunities.'],
      ['Community Producer', 'Builds engagement through newsletters, podcasts and events.'],
    ],
  },
];

export const researchers = [
  'Security and defense researchers',
  'Regional economy analysts',
  'Diplomacy and foreign policy fellows',
  'Energy and infrastructure specialists',
  'Technology governance contributors',
  'Media, narrative and influence experts',
];

export const whatWeDo = [
  'Publish premium analysis and breaking coverage on regions that matter.',
  'Connect journalism with policy insight through explainers, interviews and roundtables.',
  'Host live discussions, podcasts and member-only conversations with experts.',
  'Build a trusted archive of context-rich reporting for institutions and general readers.',
];

export const liveVideos = {
  current: {
    title: 'Live geopolitical briefing: regional flashpoints and diplomatic updates',
    youtubeId: 'M7lc1UVf-VE',
  },
  previous: [
    { title: 'Inside the diplomacy reset', date: 'March 24, 2026', youtubeId: 'ysz5S6PUM-U' },
    { title: 'Defense outlook weekly', date: 'March 17, 2026', youtubeId: 'aqz-KE-bpKQ' },
    { title: 'Middle East energy update', date: 'March 10, 2026', youtubeId: 'ScMzIvxBSi4' },
  ],
};

export const footerLinks = {
  Company: [
    { label: 'About Us', to: '/about/what-we-do' },
    { label: 'Our Team', to: '/about/team' },
    { label: 'Contact Us', to: '/contact' },
  ],
  Explore: [
    { label: 'Asia', to: '/region/asia' },
    { label: 'Europe', to: '/region/europe' },
    { label: 'Interviews', to: '/section/interviews' },
    { label: 'Membership', to: '/membership' },
  ],
  Legal: [
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'Terms & Conditions', to: '/terms-and-conditions' },
    { label: 'Disclaimer', to: '/disclaimer' },
  ],
};

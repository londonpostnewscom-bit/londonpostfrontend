import { Link } from 'react-router-dom';
import { SectionHeading } from '../components/SectionHeading';

// Replace these image paths with your actual asset filenames
import asiaImg      from '../assets/region-asia.jpg';
import europeImg    from '../assets/region-europe.jpg';
import middleeastImg from '../assets/region-middleeast.jpg';
import oceaniaImg   from '../assets/region-oceania.jpg';
import africaImg    from '../assets/region-africa.jpg';
import americasImg  from '../assets/region-americas.jpg';
import caucasusImg  from '../assets/region-caucasus.jpg';
import russiaImg    from '../assets/region-russia.jpg';

const REGIONS = [
  {
    title:       'Asia',
    slug:        '/region/asia',
    image:       asiaImg,
    description: 'East Asia, South Asia, Southeast Asia and Central Asia — the continent driving the next century.',
    tags:        ['East Asia', 'Central Asia', 'South Asia'],
    size:        'large',
  },
  {
    title:       'Middle East',
    slug:        '/region/middleeast',
    image:       middleeastImg,
    description: 'Energy, diplomacy and conflict at the crossroads of three continents.',
    tags:        ['Diplomacy', 'Energy', 'Security'],
    size:        'large',
  },
  {
    title:       'Europe',
    slug:        '/region/europe',
    image:       europeImg,
    description: 'Western, Eastern, Northern and Southern Europe — policy, security and economics.',
    tags:        ['Western Europe', 'Eastern Europe', 'NATO'],
    size:        'normal',
  },
  {
    title:       'Americas',
    slug:        '/region/americas',
    image:       americasImg,
    description: 'North America, Latin America and the Caribbean — trade, politics and development.',
    tags:        ['North America', 'Latin America'],
    size:        'normal',
  },
  {
    title:       'Africa',
    slug:        '/region/africa',
    image:       africaImg,
    description: 'North and Sub-Saharan Africa — resources, governance and regional alliances.',
    tags:        ['North Africa', 'South Africa'],
    size:        'normal',
  },
  {
    title:       'Russia',
    slug:        '/region/russia',
    image:       russiaImg,
    description: 'Strategic analysis and reporting on Russia\'s role in global affairs.',
    tags:        ['Foreign Policy', 'Defense', 'Energy'],
    size:        'normal',
  },
  {
    title:       'Caucasus',
    slug:        '/region/caucasus',
    image:       caucasusImg,
    description: 'Georgia, Armenia, Azerbaijan and the wider South Caucasus region.',
    tags:        ['South Caucasus', 'Geopolitics'],
    size:        'normal',
  },
  {
    title:       'Oceania',
    slug:        '/region/oceania',
    image:       oceaniaImg,
    description: 'Australia, New Zealand and the Pacific Islands — Indo-Pacific dynamics.',
    tags:        ['Indo-Pacific', 'Trade'],
    size:        'normal',
  },
];

export function RegionsLandingPage() {
  const [featured1, featured2, ...rest] = REGIONS;

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
      <SectionHeading
        eyebrow="Regions"
        title="Global coverage, region by region"
        description="Eight regional desks covering the world's most consequential political, economic and security developments."
      />

      {/* Top 2 featured — large cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {[featured1, featured2].map((region) => (
          <Link
            key={region.slug}
            to={region.slug}
            className="group relative overflow-hidden rounded-[2rem] shadow-md transition hover:-translate-y-1 hover:shadow-xl"
          >
            <img
              src={region.image}
              alt={region.title}
              className="h-80 w-full object-cover transition duration-500 group-hover:scale-105"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

            {/* Tags */}
            <div className="absolute left-5 top-5 flex flex-wrap gap-2">
              {region.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-7">
              <h3 className="text-3xl font-black text-white">{region.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/80">{region.description}</p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition group-hover:bg-white group-hover:text-slate-900">
                Browse Coverage
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Remaining 6 — smaller cards */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((region) => (
          <Link
            key={region.slug}
            to={region.slug}
            className="group relative overflow-hidden rounded-[2rem] shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <img
              src={region.image}
              alt={region.title}
              className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Tags */}
            <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
              {region.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="text-xl font-bold text-white">{region.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-white/75">{region.description}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 transition group-hover:text-white">
                Browse
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom strip */}
      <div className="mt-12 rounded-[2rem] bg-slate-900 px-8 py-8 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-accent">Coverage Network</p>
        <h3 className="mt-2 text-2xl font-black text-white">
          8 Regional Desks · 140+ Contributors · 850,000 Monthly Readers
        </h3>
        <p className="mt-3 text-sm text-slate-400">
          Every region is covered by dedicated researchers, analysts and correspondents based across the world.
        </p>
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cld } from '../utils/Cloudinary';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

type HeroSlide = {
  id:             string;
  title:          string;
  subtitle:       string;
  mediaType:      'image' | 'youtube';
  mediaUrl:       string;
  youtubeId:      string;
  ctaLink:        string;
  badgeText:      string;
  previewCaption: string;
  isArticle:      boolean;
  _sortDate:      number;
};

const MONTHS: Record<string, number> = {
  january:0, february:1, march:2, april:3, may:4, june:5,
  july:6, august:7, september:8, october:9, november:10, december:11,
};
function parseDate(input: string): number {
  if (!input) return 0;
  const s = input.trim();
  const native = new Date(s);
  if (!isNaN(native.getTime()) && /\d{4}/.test(s)) return native.getTime();
  const lower = s.toLowerCase();
  let m = lower.match(/([a-z]+)\D{0,3}(\d{1,2})\D{0,3}(\d{4})/);
  if (m && MONTHS[m[1]] !== undefined) return new Date(+m[3], MONTHS[m[1]], +m[2]).getTime();
  m = lower.match(/(\d{1,2})\D{0,3}([a-z]+)\D{0,3}(\d{4})/);
  if (m && MONTHS[m[2]] !== undefined) return new Date(+m[3], MONTHS[m[2]], +m[1]).getTime();
  return 0;
}

function mapArticle(a: any): HeroSlide {
  return {
    id: a._id || '',
    title: a.title || '',
    subtitle: a.subtitle || '',
    mediaType: a.videoId ? 'youtube' : 'image',
    mediaUrl: a.imageUrl || '',
    youtubeId: a.videoId || '',
    ctaLink: a.section === 'video' ? `/video/${a._id}` : `/article/${a._id}`,
    badgeText: a.category || 'Featured',
    previewCaption: [a.author, a.date].filter(Boolean).join(' · '),
    isArticle: true,
    _sortDate: a.dateValue ? new Date(a.dateValue).getTime() : parseDate(a.date),
  };
}

// De-duplicates by id (falling back to a normalized title match when an id
// is ever missing/blank) while preserving the incoming sort order. This is
// what stops the same article from landing in two hero slots when it shows
// up in both the region-articles and section-articles "world" responses.
function dedupeSlides(slides: HeroSlide[]): HeroSlide[] {
  const seen = new Set<string>();
  const out: HeroSlide[] = [];
  for (const slide of slides) {
    const key = slide.id ? `id:${slide.id}` : `title:${slide.title.trim().toLowerCase()}`;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(slide);
  }
  return out;
}

/* World hero = the 5 latest articles cross-posted to "world" from BOTH
   RegionArticle and SectionArticle, always freshest-first, de-duplicated
   so the same article can never occupy more than one slide. */
async function fetchWorldHeroes(): Promise<HeroSlide[]> {
  try {
    const [rr, sr] = await Promise.all([
      fetch(`${API_URL}/region-articles/home-section/world?limit=20`),
      fetch(`${API_URL}/section-articles/home/world?limit=20`),
    ]);
    const regionData: any[] = rr.ok ? await rr.json() : [];
    const sectionData: any[] = sr.ok ? await sr.json() : [];
    return dedupeSlides(
      [...regionData, ...sectionData]
        .map(mapArticle)
        .sort((a, b) => b._sortDate - a._sortDate)
    ).slice(0, 5);
  } catch { return []; }
}

async function fetchManualHeroes(): Promise<HeroSlide[]> {
  try {
    const r = await fetch(`${API_URL}/hero`);
    if (!r.ok) return [];
    const raw = await r.json();
    const list: any[] = Array.isArray(raw) ? raw : [raw];
    return dedupeSlides(list.filter(Boolean).map(h => ({
      id: h._id || '', title: h.title || '', subtitle: h.subtitle || '',
      mediaType: (h.mediaType === 'youtube' ? 'youtube' : 'image') as 'image' | 'youtube',
      mediaUrl: h.mediaUrl || '', youtubeId: h.youtubeId || '',
      ctaLink: h.ctaLink || '#', badgeText: h.badgeText || 'Featured',
      previewCaption: h.previewCaption || '', isArticle: false, _sortDate: 0,
    })));
  } catch { return []; }
}

export function Hero() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchWorldHeroes(), fetchManualHeroes()]).then(([world, manual]) => {
      setSlides(world.length ? world : manual);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setCurrent(c => (c + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (loading) return <div className="h-[520px] animate-pulse bg-slate-900" />;
  if (!slides.length) return null;
  const slide = slides[current];

  return (
    <section className="relative overflow-hidden bg-[#0c1726]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-blue-900/30 blur-[120px]" />
        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-indigo-900/20 blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            {slide.badgeText && (
              <span className="mb-5 inline-block rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.3em] text-amber-300">
                {slide.badgeText}
              </span>
            )}
            <h1 className="text-3xl font-black leading-tight text-white lg:text-[2.6rem] lg:leading-[1.1]">
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p className="mt-4 text-base leading-relaxed text-slate-300 lg:text-lg">{slide.subtitle}</p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={slide.ctaLink}
                className="rounded-full bg-amber-400 px-7 py-3 text-sm font-black text-slate-900 transition hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-400/20">
                Read More
              </Link>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-black/60">
              {slide.mediaType === 'youtube' && slide.youtubeId ? (
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${slide.youtubeId}?rel=0&modestbranding=1&mute=1`}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : slide.mediaUrl ? (
                // Cloudinary-optimized: hero media is the single largest
                // image on the whole homepage — worth the biggest win here.
                <img
                  src={cld(slide.mediaUrl, 1000)}
                  alt={slide.title}
                  className="w-full object-cover"
                  style={{ maxHeight: '440px', minHeight: '260px' }}
                />
              ) : (
                <div className="flex aspect-video items-center justify-center bg-slate-800">
                  <span className="text-sm text-slate-500">No media</span>
                </div>
              )}
              {slide.previewCaption && (
                <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 bg-black/70 px-4 py-2.5 backdrop-blur-sm">
                  <span className="rounded bg-red-600 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white">
                    {slide.isArticle ? 'Article' : 'Live Preview'}
                  </span>
                  <p className="truncate text-xs text-white/80">{slide.previewCaption}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {slides.length > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} aria-label={`Go to slide ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${i === current ? 'h-2.5 w-8 bg-amber-400' : 'h-2.5 w-2.5 bg-white/25 hover:bg-white/50'}`} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

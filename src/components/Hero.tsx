
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

// FIXED: this previously fired TWO separate requests —
// /region-articles/home-section/world AND /section-articles/home/world —
// but both routes call the exact same getHomeFeed('world', 20) helper
// server-side, which already merges RegionArticle + SectionArticle
// results internally. The two calls returned byte-for-byte identical
// ~2.9MB payloads; this was paying for that same expensive merge-and-sort
// twice for zero benefit. Only used now when Hero is rendered WITHOUT a
// worldArticles prop (i.e. standalone, outside HomePage's bundle fetch).
async function fetchWorldHeroes(): Promise<HeroSlide[]> {
  try {
    const r = await fetch(`${API_URL}/section-articles/home/world?limit=20`);
    const data: any[] = r.ok ? await r.json() : [];
    return dedupeSlides(
      data.map(mapArticle).sort((a, b) => b._sortDate - a._sortDate)
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

// `worldArticles`: when provided (HomePage now passes this straight from
// its own single /api/home-feed bundle fetch), Hero skips its own network
// call entirely — it just maps/sorts/dedupes the already-fetched raw
// docs. When omitted (Hero used standalone anywhere else), it falls back
// to fetching the data itself via the de-duplicated single call above.
export function Hero({ worldArticles }: { worldArticles?: any[] } = {}) {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const worldPromise: Promise<HeroSlide[]> = worldArticles
      ? Promise.resolve(
          dedupeSlides(worldArticles.map(mapArticle).sort((a, b) => b._sortDate - a._sortDate)).slice(0, 5)
        )
      : fetchWorldHeroes();

    Promise.all([worldPromise, fetchManualHeroes()]).then(([world, manual]) => {
      setSlides(world.length ? world : manual);
      setLoading(false);
    });
    // Intentionally runs once — HomePage only ever mounts Hero after its
    // own bundle fetch has already resolved, so worldArticles is stable
    // from the very first render in that usage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setCurrent(c => (c + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (loading) return <div className="h-[320px] animate-pulse bg-slate-900" />;
  if (!slides.length) return null;
  const slide = slides[current];

  return (
    <section className="relative overflow-hidden bg-[#0c1726]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-72 w-72 rounded-full bg-blue-900/30 blur-[100px]" />
        <div className="absolute -right-40 bottom-0 h-72 w-72 rounded-full bg-indigo-900/20 blur-[100px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-8 lg:px-6 lg:py-10">
        <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-10">
          <div className="order-2 lg:order-1">
            {slide.badgeText && (
              <span className="mb-3 inline-block rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-amber-300">
                {slide.badgeText}
              </span>
            )}
            <h1 className="text-xl font-black leading-snug text-white lg:text-[2rem] lg:leading-[1.2]">
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p className="mt-2.5 text-sm leading-relaxed text-slate-300 lg:text-base line-clamp-2">
                {slide.subtitle}
              </p>
            )}
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to={slide.ctaLink}
                className="rounded-full bg-amber-400 px-6 py-2.5 text-sm font-black text-slate-900 transition hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-400/20">
                Read More
              </Link>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-xl shadow-2xl shadow-black/60">
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
                <img
                  src={cld(slide.mediaUrl, 800)}
                  alt={slide.title}
                  className="w-full object-cover"
                  style={{ maxHeight: '300px', minHeight: '180px' }}
                />
              ) : (
                <div className="flex aspect-video items-center justify-center bg-slate-800">
                  <span className="text-sm text-slate-500">No media</span>
                </div>
              )}
              {slide.previewCaption && (
                <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 bg-black/70 px-3 py-2 backdrop-blur-sm">
                  <span className="rounded bg-red-600 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-white">
                    {slide.isArticle ? 'Article' : 'Live Preview'}
                  </span>
                  <p className="truncate text-[11px] text-white/80">{slide.previewCaption}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {slides.length > 1 && (
          <div className="mt-5 flex items-center justify-center gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} aria-label={`Go to slide ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${i === current ? 'h-2 w-6 bg-amber-400' : 'h-2 w-2 bg-white/25 hover:bg-white/50'}`} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

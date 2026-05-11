import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
};

/* ── fetch article-driven hero slides ── */
async function fetchArticleHeroes(): Promise<HeroSlide[]> {
  try {
    const [rr, sr] = await Promise.all([
      fetch(`${API_URL}/region-articles/home-section/hero?limit=5`),
      fetch(`${API_URL}/section-articles/home/hero?limit=5`),
    ]);
    const regionData:  any[] = rr.ok ? await rr.json() : [];
    const sectionData: any[] = sr.ok ? await sr.json() : [];

    return [...regionData, ...sectionData]
      .sort((a, b) => (a.homeSortOrder ?? 99) - (b.homeSortOrder ?? 99))
      .slice(0, 5)
      .map(a => ({
        id:             a._id || '',
        title:          a.title || '',
        subtitle:       a.subtitle || '',
        mediaType:      a.videoId ? 'youtube' : 'image',
        mediaUrl:       a.imageUrl || '',
        youtubeId:      a.videoId  || '',
        ctaLink:        `/article/${a._id}`,
        badgeText:      a.category || 'Featured',
        previewCaption: [a.author, a.date].filter(Boolean).join(' · '),
        isArticle:      true,
      }));
  } catch { return []; }
}

/* ── fallback: manually created heroes ── */
async function fetchManualHeroes(): Promise<HeroSlide[]> {
  try {
    const r = await fetch(`${API_URL}/hero`);
    if (!r.ok) return [];
    const raw = await r.json();
    const list: any[] = Array.isArray(raw) ? raw : [raw];
    return list.filter(Boolean).map(h => ({
      id:             h._id || '',
      title:          h.title || '',
      subtitle:       h.subtitle || '',
      mediaType:      (h.mediaType === 'youtube' ? 'youtube' : 'image') as 'image' | 'youtube',
      mediaUrl:       h.mediaUrl  || '',
      youtubeId:      h.youtubeId || '',
      ctaLink:        h.ctaLink   || '#',
      badgeText:      h.badgeText || 'Featured',
      previewCaption: h.previewCaption || '',
      isArticle:      false,
    }));
  } catch { return []; }
}

export function Hero() {
  const [slides, setSlides]   = useState<HeroSlide[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchArticleHeroes(), fetchManualHeroes()]).then(
      ([articleHeroes, manualHeroes]) => {
        // Article heroes take priority; fall back to manual if none
        setSlides(articleHeroes.length ? articleHeroes : manualHeroes);
        setLoading(false);
      }
    );
  }, []);

  // Auto-advance slides
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
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-blue-900/30 blur-[120px]" />
        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-indigo-900/20 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">

          {/* ── LEFT: text ── */}
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
              <p className="mt-4 text-base leading-relaxed text-slate-300 lg:text-lg">
                {slide.subtitle}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={slide.ctaLink}
                className="rounded-full bg-amber-400 px-7 py-3 text-sm font-black text-slate-900 transition hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-400/20"
              >
                Read More
              </Link>
            </div>
          </div>

          {/* ── RIGHT: media ── */}
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
                <img
                  src={slide.mediaUrl}
                  alt={slide.title}
                  className="w-full object-cover"
                  style={{ maxHeight: '440px', minHeight: '260px' }}
                />
              ) : (
                <div className="flex aspect-video items-center justify-center bg-slate-800">
                  <span className="text-sm text-slate-500">No media</span>
                </div>
              )}

              {/* Caption bar */}
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

        {/* ── Slide indicators ── */}
        {slides.length > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? 'h-2.5 w-8 bg-amber-400'
                    : 'h-2.5 w-2.5 bg-white/25 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

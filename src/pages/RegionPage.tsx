
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AdBanner } from '../components/AdBanner';
import { ArchivedFilter } from '../components/ArchivedFilter';
import { SectionHeading } from '../components/SectionHeading';
import { PaginatedArticles } from '../components/PaginatedArticles';
import { Article, articles as staticArticles, regionMenus } from '../data/siteData';
import { slugify } from '../utils/helpers';
import { bucketArticles } from '../utils/articleBuckets';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const REGION_META: Record<string, { label: string; description: string }> = {
  asia:       { label: 'Asia',        description: 'East Asia, South Asia, Southeast Asia and Central Asia.' },
  europe:     { label: 'Europe',      description: 'Western, Eastern, Northern and Southern Europe.' },
  middleeast: { label: 'Middle East', description: 'Energy, diplomacy and security across the Middle East.' },
  oceania:    { label: 'Oceania',     description: 'Australia, New Zealand and the Pacific Islands.' },
  africa:     { label: 'Africa',      description: 'North and Sub-Saharan Africa — governance and resources.' },
  americas:   { label: 'Americas',    description: 'North America, Latin America and the Caribbean.' },
  caucasus:   { label: 'Caucasus',    description: 'Armenia, Georgia and Azerbaijan — strategic and regional coverage.' },
  russia:     { label: 'Russia',      description: 'Strategic analysis and reporting on Russia.' },
};

const FEATURED_BATCH = 6;
const GRID_BATCH = 4;

// Per-(area + sub-category) in-memory cache — same pattern as
// SectionPage.tsx and HomePage.tsx. Navigating Region A → Home →
// Region A again (or switching between its category tabs and back)
// reuses this instantly instead of re-fetching and re-showing a
// loading state. Cleared naturally on a real page reload.
const regionCache = new Map<string, Article[]>();
function cacheKey(area: string, category: string | null) {
  return `${area}::${category || ''}`;
}

function apiToArticle(a: any): Article {
  return {
    id:       a._id || a.id || '',
    title:    a.title || '',
    subtitle: a.subtitle || '',
    content:  a.content || '',
    image:    a.imageUrl || a.image || '',
    author:   a.author || '',
    date:     a.date || '',
    category: a.category || '',
    region:   a.region || '',
    featured: a.isFeatured || false,
    archived: a.isArchived || false,
    topic:    a.category || '',
    ...(Array.isArray(a.hashtags) ? { hashtags: a.hashtags } : {}),
  } as Article;
}

/* ─── Loading skeleton — shown only while genuinely fetching for the
   first time; a cached revisit skips straight to real content. ─── */
function Shimmer({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200/70 ${className}`} />;
}
function RegionSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Shimmer className="mb-3 h-4 w-32" />
          <Shimmer className="mb-2 h-9 w-72" />
          <Shimmer className="h-4 w-96" />
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => <Shimmer key={i} className="h-9 w-24 rounded-full" />)}
        </div>
      </div>
      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr,300px]">
        <div className="grid gap-6 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <Shimmer key={i} className="h-64 w-full" />)}
        </div>
        <Shimmer className="hidden h-96 w-full xl:block" />
      </div>
    </div>
  );
}

export function RegionPage() {
  const { area = 'asia', country } = useParams();
  const meta = REGION_META[area] || { label: area, description: '' };
  const categories = (regionMenus as any)[area] || [];
  const hasCategories = categories.length > 0;
  const selectedCategory = categories.find((c: string) => slugify(c) === country) || null;

  const key = cacheKey(area, selectedCategory);
  const cached = regionCache.get(key);
  const [apiArticles, setApiArticles] = useState<Article[]>(cached || []);
  const [apiLoaded, setApiLoaded] = useState(!!cached);
  const [loading, setLoading] = useState(!cached);
  const [filteredArchived, setFilteredArchived] = useState<Article[]>([]);

  const [latestVisible, setLatestVisible] = useState(GRID_BATCH);
  const [featuredVisible, setFeaturedVisible] = useState(FEATURED_BATCH);
  const [archivedVisible, setArchivedVisible] = useState(GRID_BATCH);

  useEffect(() => {
    let cancelled = false;

    const hit = regionCache.get(key);
    if (hit) {
      setApiArticles(hit);
      setApiLoaded(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setApiLoaded(false);

    let url = `${API_URL}/region-articles/region/${area}`;
    if (selectedCategory) url += `?subCategory=${slugify(selectedCategory)}`;

    fetch(url)
      .then((r) => r.ok ? r.json() : [])
      .then((data) => {
        if (cancelled) return;
        const mapped = data.map(apiToArticle);
        regionCache.set(key, mapped);
        setApiArticles(mapped);
        setApiLoaded(true);
        setLoading(false);
      })
      .catch(() => { if (!cancelled) { setApiLoaded(true); setLoading(false); } });

    return () => { cancelled = true; };
  }, [area, selectedCategory, key]);

  useEffect(() => {
    setLatestVisible(GRID_BATCH);
    setFeaturedVisible(FEATURED_BATCH);
    setArchivedVisible(GRID_BATCH);
  }, [area, selectedCategory]);

  const staticMatch = useMemo(() => {
    if (selectedCategory) {
      return staticArticles.filter((a) => a.region.toLowerCase() === selectedCategory.toLowerCase());
    }
    return staticArticles.filter((a) =>
      a.region.toLowerCase() === meta.label.toLowerCase() ||
      a.region.toLowerCase() === area.toLowerCase() ||
      categories.some((c: string) => a.region.toLowerCase() === c.toLowerCase())
    );
  }, [selectedCategory, meta.label, area, categories]);

  // Static fallback only applies once the real fetch has finished and
  // genuinely came back empty — not during the loading window, which now
  // shows the skeleton instead of a flash of unrelated placeholder data.
  const sourceArticles = apiLoaded && apiArticles.length > 0 ? apiArticles : (apiLoaded ? staticMatch : []);

  // Date-driven buckets — see utils/articleBuckets.ts for the rules.
  // Recomputed only when the underlying article list actually changes,
  // so it can safely sit in effect dependency arrays below without
  // causing render-loop resets (the bug that broke "Load More" on the
  // Section page).
  const { latest: latestAll, featured: featuredAll, archived: archivedAll } = useMemo(
    () => bucketArticles(sourceArticles),
    [sourceArticles]
  );

  useEffect(() => {
    setFilteredArchived(archivedAll);
    setArchivedVisible(GRID_BATCH);
    // Intentionally scoped to navigation/data-load changes, not archivedAll
    // itself, so clicking "Load More" never gets reset by this effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [area, selectedCategory, apiLoaded]);

  const visibleLatest   = latestAll.slice(0, latestVisible);
  const visibleFeatured = featuredAll.slice(0, featuredVisible);
  const visibleArchived = filteredArchived.slice(0, archivedVisible);

  const canLoadMoreLatest   = latestVisible < latestAll.length;
  const canLoadMoreFeatured = featuredVisible < featuredAll.length;
  const canLoadMoreArchived = archivedVisible < filteredArchived.length;

  if (loading) {
    return <RegionSkeleton />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <SectionHeading
          eyebrow={selectedCategory ? `${meta.label} / ${selectedCategory}` : meta.label}
          title={selectedCategory ? `${selectedCategory} coverage` : `${meta.label} regional coverage`}
          description={meta.description}
        />

        {hasCategories && (
          <div className="flex flex-wrap gap-2 sm:flex-shrink-0 sm:justify-end sm:pt-1">
            <Link
              to={`/region/${area}`}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                !selectedCategory
                  ? 'bg-primary text-white'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-primary hover:text-primary'
              }`}
            >
              All
            </Link>

            {categories.map((cat: string) => (
              <Link
                key={cat}
                to={`/region/${area}/${slugify(cat)}`}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-primary text-white'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-primary hover:text-primary'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        )}
      </div>

      {selectedCategory && (
        <Link
          to={`/region/${area}`}
          className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Back to {meta.label}
        </Link>
      )}

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr,300px]">
        <div>
          {latestAll.length > 0 && (
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">Latest</p>
              <PaginatedArticles articles={visibleLatest} />

              {canLoadMoreLatest && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => setLatestVisible((v) => v + GRID_BATCH)}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>
          )}

          {featuredAll.length > 0 && (
            <div className="mt-10">
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">Featured — {new Date().getFullYear()}</p>
              <PaginatedArticles articles={visibleFeatured} />

              {canLoadMoreFeatured && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => setFeaturedVisible((v) => v + FEATURED_BATCH)}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="mt-10">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-black uppercase tracking-widest text-slate-500">Archived</p>
              <ArchivedFilter
                items={archivedAll}
                onChange={(items) => {
                  setFilteredArchived(items);
                  setArchivedVisible(GRID_BATCH);
                }}
              />
            </div>

            {filteredArchived.length > 0 ? (
              <>
                <PaginatedArticles articles={visibleArchived} />

                {canLoadMoreArchived && (
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={() => setArchivedVisible((v) => v + GRID_BATCH)}
                      className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-400">
                {archivedAll.length > 0
                  ? 'No archived articles match the selected filter.'
                  : 'Articles from previous years will appear here automatically.'}
              </p>
            )}
          </div>

          {latestAll.length === 0 && featuredAll.length === 0 && (
            <div className="rounded-[2rem] border-2 border-dashed border-slate-200 p-16 text-center text-slate-400">
              <p className="text-lg font-semibold">No articles yet for this region</p>
              <p className="mt-2 text-sm">Add from Admin → World / Regions → {meta.label}</p>
            </div>
          )}
        </div>

        <div className="hidden xl:block">
          <div className="sticky top-6">
            <AdBanner vertical />
          </div>
        </div>
      </div>
    </div>
  );
}

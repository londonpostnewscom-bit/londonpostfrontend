

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AdBanner } from '../components/AdBanner';
import { SectionHeading } from '../components/SectionHeading';
import { Article, articles as staticArticles } from '../data/siteData';
import { PaginatedArticles } from '../components/PaginatedArticles';
import { ArchivedFilter } from '../components/ArchivedFilter';
import { bucketArticles } from '../utils/articleBuckets';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const FEATURED_BATCH = 6;
const GRID_BATCH = 4;
const CROSS_POST_PAGES = ['world', 'editors-picks', 'in-focus'];

// The public nav builds each section link by auto-slugifying its label
// (lowercase, "&" -> "and", non-alphanumerics -> "-"). Most of the time
// that matches the section's actual stored value exactly. But a few
// sections in AdminAllPages.tsx were given a shorter/cleaner hand-picked
// `value` that does NOT match what auto-slugifying their `label` would
// produce — e.g. label "Art & Culture" auto-slugifies to
// "art-and-culture", but the real stored value is "art-culture". When
// that happens, the nav link and the admin's actual section value
// silently disagree, the fetch below finds zero articles, and the page
// looks empty even though articles genuinely exist. This maps every
// known mismatch back to the real section value.
const SLUG_ALIASES: Record<string, string> = {
  'art-and-culture': 'art-culture',
  'diplomatic-horizon': 'diplomatic-corner',
  'united-kingdom': 'uk',
  'editor-s-picks': 'editors-picks',
};

// Per-slug in-memory cache — same pattern as HomePage's homeFeedCache and
// ArticleDetailPage's articleCache. Lives for the browser tab session:
// navigating Section A → Home → Section A again reuses this instantly
// with no fetch and no loading flash. A real page reload (F5) clears it
// naturally since the module re-initializes.
const sectionCache = new Map<string, Article[]>();

function slugify(s: string) {
  return s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function apiToArticle(a: any): Article {
  return {
    id: a._id || a.id || '',
    title: a.title || '',
    subtitle: a.subtitle || '',
    content: a.content || '',
    image: a.imageUrl || a.image || '',
    author: a.author || '',
    date: a.date || '',
    category: a.category || '',
    region: a.region || '',
    featured: a.isFeatured || a.featured || false,
    archived: a.isArchived || a.archived || false,
    topic: a.category || '',
    ...(Array.isArray(a.hashtags) ? { hashtags: a.hashtags } : {}),
    ...(a.section ? { section: a.section } : {}),
    ...(a.videoId ? { videoId: a.videoId } : {}),
  } as Article;
}

function toTitle(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()).replace('And', '&');
}

/* ─── Loading skeleton — shown only while genuinely fetching for the
   first time; a cached revisit skips straight to real content. ─── */
function Shimmer({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200/70 ${className}`} />;
}
function SectionSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <Shimmer className="mb-3 h-4 w-32" />
      <Shimmer className="mb-2 h-9 w-72" />
      <Shimmer className="mb-10 h-4 w-96" />
      <div className="grid gap-8 xl:grid-cols-[1fr,300px]">
        <div className="grid gap-6 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <Shimmer key={i} className="h-64 w-full" />)}
        </div>
        <Shimmer className="hidden h-96 w-full xl:block" />
      </div>
    </div>
  );
}

export function SectionPage() {
  const { slug: rawSlug = '' } = useParams();
  // Use the alias-corrected slug for everything that talks to the backend
  // or matches static data; keep the raw slug only for the display title,
  // so a URL like /section/united-kingdom still shows "United Kingdom"
  // instead of the shorter canonical value's title-cased form ("Uk").
  const slug = SLUG_ALIASES[rawSlug] || rawSlug;
  const title = toTitle(rawSlug);

  const cached = sectionCache.get(slug);
  const [apiArticles, setApiArticles] = useState<Article[]>(cached || []);
  const [apiLoaded, setApiLoaded] = useState(!!cached);
  const [loading, setLoading] = useState(!cached);
  const [filteredArchived, setFilteredArchived] = useState<Article[]>([]);

  const [latestVisible, setLatestVisible] = useState(GRID_BATCH);
  const [featuredVisible, setFeaturedVisible] = useState(FEATURED_BATCH);
  const [archivedVisible, setArchivedVisible] = useState(GRID_BATCH);

  useEffect(() => {
    let cancelled = false;

    const hit = sectionCache.get(slug);
    if (hit) {
      setApiArticles(hit);
      setApiLoaded(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setApiLoaded(false);

    fetch(
      CROSS_POST_PAGES.includes(slug)
        ? `${API_URL}/section-articles/crosspost/${slug}`
        : `${API_URL}/section-articles/section/${slug}`
    )
      .then((r) => r.ok ? r.json() : [])
      .then((data) => {
        if (cancelled) return;
        const mapped = data.map(apiToArticle);
        sectionCache.set(slug, mapped);
        setApiArticles(mapped);
        setApiLoaded(true);
        setLoading(false);
      })
      .catch(() => { if (!cancelled) { setApiLoaded(true); setLoading(false); } });

    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    setLatestVisible(GRID_BATCH);
    setFeaturedVisible(FEATURED_BATCH);
    setArchivedVisible(GRID_BATCH);
  }, [slug]);

  const staticMatch = useMemo(() => {
    return staticArticles.filter((a) => slugify(a.category) === slug || slugify(a.topic || '') === slug);
  }, [slug]);

  // Static fallback data only ever applies AFTER the real fetch has
  // finished and genuinely came back empty — never during the loading
  // window itself. Previously this fell back to static/demo articles
  // while still loading, which could flash unrelated placeholder content
  // before the real data arrived; now that window shows the skeleton
  // instead, and only settles on static data as a true "nothing here yet"
  // fallback.
  const source = apiLoaded && apiArticles.length > 0 ? apiArticles : (apiLoaded ? staticMatch : []);

  // Date-driven buckets — see utils/articleBuckets.ts for the rules.
  // Memoized so it only changes when the article list actually changes,
  // which is what lets the effect below sit safely in a dependency array
  // instead of resetting "Load More" on every render (the previous bug).
  const { latest: latestAll, featured: featuredAll, archived: archivedAll } = useMemo(
    () => bucketArticles(source),
    [source]
  );

  const visibleLatest   = latestAll.slice(0, latestVisible);
  const visibleFeatured = featuredAll.slice(0, featuredVisible);
  const visibleArchived = filteredArchived.slice(0, archivedVisible);

  const canLoadMoreLatest   = latestVisible < latestAll.length;
  const canLoadMoreFeatured = featuredVisible < featuredAll.length;
  const canLoadMoreArchived = archivedVisible < filteredArchived.length;

  useEffect(() => {
    setFilteredArchived(archivedAll);
    setArchivedVisible(GRID_BATCH);
    // Scoped to slug + the (memoized, stable-until-real-change) archivedAll,
    // NOT a fresh array on every render — this is the fix for "Load More"
    // silently resetting itself.
  }, [slug, archivedAll]);

  if (loading) {
    return <SectionSkeleton />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <SectionHeading
        eyebrow={title}
        title={`${title} coverage`}
        description={`Latest articles, featured stories and archived content from the ${title} desk.`}
      />

      <div className="grid gap-8 xl:grid-cols-[1fr,300px]">
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
              <p className="text-lg font-semibold">No articles yet for {title}</p>
              <p className="mt-2 text-sm">Add articles from Admin → More Sections → {title}</p>
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

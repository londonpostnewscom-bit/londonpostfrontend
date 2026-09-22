import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdBanner } from '../components/AdBanner';
import { AuthorAvatar } from '../components/AuthorAvatar';
import { ArchivedFilter } from '../components/ArchivedFilter';
import { useAuthorPhotos } from '../hooks/useAuthorPhotos';
import { Article } from '../data/siteData';
import { PageSkeleton } from '../components/PageSkeleton';
import { parseArticleDate } from '../utils/articleBuckets';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let opinionCache: Article[] | null = null;

function toArticle(a: any): Article {
  return {
    id: a._id || a.id || '',
    title: a.title || '',
    subtitle: a.subtitle || '',
    content: a.content || '',
    image: '', // Opinion no longer uses cover images at all
    author: a.author || '',
    date: a.date || '',
    category: a.category || '',
    region: '',
    featured: a.isFeatured || false,
    archived: a.isArchived || false,
    topic: a.category || '',
    ...(Array.isArray(a.hashtags) ? { hashtags: a.hashtags } : {}),
    ...(a.section ? { section: a.section } : {}),
    ...(a.videoId ? { videoId: a.videoId } : {}),
  } as Article;
}

// FIXED: previously used `new Date(a.date).getTime()` directly, which
// silently disagrees with how every other page on the site orders
// articles (SectionPage/RegionPage/HomePage all go through the shared
// parseArticleDate helper via bucketArticles/effectiveTime). Any date
// string that native Date() can't parse cleanly (e.g. "21 July 2026" —
// day-first, which native Date() gets wrong or fails on) was silently
// sorting incorrectly here while sorting correctly everywhere else. Using
// the same parseArticleDate helper the rest of the site relies on keeps
// ordering consistent everywhere.
function byDateDesc(a: Article, b: Article) {
  const da = parseArticleDate(a.date);
  const db = parseArticleDate(b.date);
  const ta = da ? da.getTime() : -Infinity;
  const tb = db ? db.getTime() : -Infinity;
  return tb - ta;
}

function Byline({ article, size = 'md' }: { article: Article; size?: 'sm' | 'md' | 'lg' }) {
  const { get } = useAuthorPhotos();
  const isTeam = get(article.author)?.isTeamMember;
  return (
    <div className="flex items-center gap-3 min-w-0">
      <AuthorAvatar name={article.author} size={size} />
      <div className="min-w-0">
        <p className="truncate font-bold text-ink">
          {article.author}
        </p>
        <p className="text-xs text-slate-400">{article.date}</p>
      </div>
    </div>
  );
}

const GRID_BATCH = 6;
const ARCHIVED_BATCH = 4;

export function OpinionPage() {
  const [articles, setArticles] = useState<Article[]>(opinionCache || []);
  const [loading, setLoading] = useState(opinionCache === null);
  const [latestVisible, setLatestVisible] = useState(GRID_BATCH);
  const [archivedVisible, setArchivedVisible] = useState(ARCHIVED_BATCH);

  // Month/year-filtered view of the main (non-archived) list — same
  // filter component and pattern used for Archived on SectionPage/
  // RegionPage, applied here to the main list instead since Featured
  // and Latest were merged into one list.
  const [filteredLatest, setFilteredLatest] = useState<Article[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/section-articles/section/opinion`)
      .then((r) => r.ok ? r.json() : [])
      .then((data) => {
        const mapped = data.map(toArticle);
        opinionCache = mapped;
        setArticles(mapped);
      })
      .catch(() => { if (!opinionCache) setArticles([]); })
      .finally(() => setLoading(false));
  }, []);

  // All non-archived opinion pieces, properly date-sorted — this replaces
  // the old separate Featured + Latest lists (which showed near-identical
  // content twice) with a single list.
  const latestAll = useMemo(
    () => articles.filter((a) => !a.archived).sort(byDateDesc),
    [articles]
  );
  const archivedAll = useMemo(
    () => articles.filter((a) => a.archived).sort(byDateDesc),
    [articles]
  );

  // Reset the month/year filter (back to "show everything") whenever the
  // underlying article list actually changes — e.g. once the fetch
  // resolves — without this the filter would silently show stale/empty
  // results after data loads in.
  useEffect(() => {
    setFilteredLatest(latestAll);
    setLatestVisible(GRID_BATCH);
  }, [latestAll]);

  const visibleLatest = filteredLatest.slice(0, latestVisible);
  const visibleArchived = archivedAll.slice(0, archivedVisible);

  const canLoadMoreLatest = latestVisible < filteredLatest.length;
  const canLoadMoreArchived = archivedVisible < archivedAll.length;

  if (loading) return <PageSkeleton />;

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <div className="border-b border-slate-200 bg-slate-950 px-4 py-14 text-center text-white">
        <span className="inline-block rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.3em] text-white/70">
          Perspectives
        </span>
        <h1 className="mx-auto mt-5 max-w-2xl font-serif text-3xl font-black leading-tight sm:text-4xl">
          Opinion
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-white/50">
          Analysis and commentary from our editorial team and contributing voices.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
        <div className="grid min-w-0 gap-10 xl:grid-cols-[1fr,300px]">
          <div className="min-w-0">
            {latestAll.length > 0 && (
              <div>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
                    <span className="h-px w-6 bg-accent" /> Latest
                  </p>
                  <ArchivedFilter
                    items={latestAll}
                    onChange={(items) => {
                      setFilteredLatest(items);
                      setLatestVisible(GRID_BATCH);
                    }}
                  />
                </div>

                {visibleLatest.length > 0 ? (
                  <div className="grid min-w-0 gap-5 sm:grid-cols-2">
                    {visibleLatest.map((article) => (
                      <Link
                        key={article.id}
                        to={`/article/${article.id}`}
                        state={{ source: 'section' }}
                        className="group flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                          {article.category}
                        </span>
                        <h3 className="mt-2 line-clamp-3 break-words font-serif text-lg font-bold leading-snug text-ink transition group-hover:text-accent">
                          {article.title}
                        </h3>
                        {article.subtitle && (
                          <p className="mt-2 line-clamp-2 break-words text-sm text-slate-500">{article.subtitle}</p>
                        )}
                        <div className="mt-5 border-t border-slate-100 pt-4">
                          <Byline article={article} size="sm" />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-400">
                    No articles match the selected month/year.
                  </p>
                )}

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

            {archivedAll.length > 0 && (
              <div className="mt-14">
                <p className="mb-5 text-xs font-bold uppercase tracking-widest text-slate-400">Archived</p>
                <div className="space-y-2">
                  {visibleArchived.map((article) => (
                    <Link
                      key={article.id}
                      to={`/article/${article.id}`}
                      className="flex min-w-0 items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 transition hover:bg-slate-50"
                    >
                      <AuthorAvatar name={article.author} size="sm" />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                          {article.category}
                        </span>
                        <h3 className="mt-0.5 truncate font-bold text-ink">{article.title}</h3>
                        <p className="text-xs text-slate-400">{article.author} · {article.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                {canLoadMoreArchived && (
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={() => setArchivedVisible((v) => v + ARCHIVED_BATCH)}
                      className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </div>
            )}

            {articles.length === 0 && (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 p-16 text-center text-slate-400">
                <p className="text-lg font-semibold">No opinion pieces yet</p>
                <p className="mt-2 text-sm">Add articles from Admin → More Sections → Opinion</p>
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
    </div>
  );
}


import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdBanner } from '../components/AdBanner';
import { AuthorAvatar } from '../components/AuthorAvatar';
import { useAuthorPhotos } from '../hooks/useAuthorPhotos';
import { Article } from '../data/siteData';
import { PageSkeleton } from '../components/PageSkeleton';

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

function byDateDesc(a: Article, b: Article) {
  const dateA = new Date(a.date).getTime();
  const dateB = new Date(b.date).getTime();
  if (isNaN(dateA) && isNaN(dateB)) return 0;
  if (isNaN(dateA)) return 1;
  if (isNaN(dateB)) return -1;
  return dateB - dateA;
}

function Byline({ article, size = 'md' }: { article: Article; size?: 'sm' | 'md' | 'lg' }) {
  const { get } = useAuthorPhotos();
  const isTeam = get(article.author)?.isTeamMember;
  return (
    <div className="flex items-center gap-3">
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

const FEATURED_BATCH = 6;
const GRID_BATCH = 4;

export function OpinionPage() {
  const [articles, setArticles] = useState<Article[]>(opinionCache || []);
  const [loading, setLoading] = useState(opinionCache === null);
  const [featuredVisible, setFeaturedVisible] = useState(FEATURED_BATCH);
  const [latestVisible, setLatestVisible] = useState(GRID_BATCH);
  const [archivedVisible, setArchivedVisible] = useState(GRID_BATCH);

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

  const featuredAll = articles.filter((a) => a.featured && !a.archived).sort(byDateDesc);
  const latestAll = articles.filter((a) => !a.archived).sort(byDateDesc);
  const archivedAll = articles.filter((a) => a.archived).sort(byDateDesc);

  const visibleFeatured = featuredAll.slice(0, featuredVisible);
  const visibleLatest = latestAll.slice(0, latestVisible);
  const visibleArchived = archivedAll.slice(0, archivedVisible);

  const canLoadMoreFeatured = featuredVisible < featuredAll.length;
  const canLoadMoreLatest = latestVisible < latestAll.length;
  const canLoadMoreArchived = archivedVisible < archivedAll.length;

  if (loading) return <PageSkeleton />;

  return (
    <div className="min-h-screen bg-white">
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
        <div className="grid gap-10 xl:grid-cols-[1fr,300px]">
          <div>
            {visibleFeatured.length > 0 && (
              <div>
                <p className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
                  <span className="h-px w-6 bg-accent" /> Featured
                </p>
                <div className="grid gap-5">
                  {visibleFeatured.map((article) => (
                    <Link
                      key={article.id}
                      to={`/article/${article.id}`}
                      className="group block rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg sm:p-9"
                    >
                      <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent">
                        {article.category || 'Opinion'}
                      </span>
                      <h2 className="mt-3 font-serif text-2xl font-black leading-tight text-ink transition group-hover:text-accent sm:text-3xl">
                        {article.title}
                      </h2>
                      {article.subtitle && (
                        <p className="mt-3 text-base leading-relaxed text-slate-600">{article.subtitle}</p>
                      )}

                      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                        <Byline article={article} size="lg" />
                        <span className="hidden rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition group-hover:bg-primary group-hover:text-white sm:inline-flex">
                          Read Full Opinion
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

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

            {visibleLatest.length > 0 && (
              <div className="mt-14">
                <p className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
                  <span className="h-px w-6 bg-accent" /> Latest
                </p>
                <div className="grid gap-5 sm:grid-cols-2">
                  {visibleLatest.map((article) => (
                    <Link
                      key={article.id}
                      to={`/article/${article.id}`}
                      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                        {article.category}
                      </span>
                      <h3 className="mt-2 line-clamp-3 font-serif text-lg font-bold leading-snug text-ink transition group-hover:text-accent">
                        {article.title}
                      </h3>
                      {article.subtitle && (
                        <p className="mt-2 line-clamp-2 text-sm text-slate-500">{article.subtitle}</p>
                      )}
                      <div className="mt-5 border-t border-slate-100 pt-4">
                        <Byline article={article} size="sm" />
                      </div>
                    </Link>
                  ))}
                </div>

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

            {visibleArchived.length > 0 && (
              <div className="mt-14">
                <p className="mb-5 text-xs font-bold uppercase tracking-widest text-slate-400">Archived</p>
                <div className="space-y-2">
                  {visibleArchived.map((article) => (
                    <Link
                      key={article.id}
                      to={`/article/${article.id}`}
                      className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 transition hover:bg-slate-50"
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
                      onClick={() => setArchivedVisible((v) => v + GRID_BATCH)}
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

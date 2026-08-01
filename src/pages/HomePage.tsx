

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdBanner } from '../components/AdBanner';
import { ArticleCard } from '../components/ArticleCard';
import { Hero } from '../components/Hero';
import { Article, articles as staticArticles } from '../data/siteData';
import { PartnersMarquee } from '../components/PartnersMarquee';
import { cld } from '../utils/Cloudinary';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/* ─────────────────────────────────────────────────────────────────────
   In-memory cache — lives for as long as this JS module is loaded, i.e.
   the whole browser tab session. Navigating Home → Article → Home (SPA
   routing) reuses this instantly, no re-fetch, no loading flash. An
   actual page reload (F5) re-initializes the module, so the cache is
   naturally gone and a fresh fetch happens — exactly the "reload = fresh,
   navigating around = instant" behavior that was asked for.
   ───────────────────────────────────────────────────────────────────── */
type HomeFeedData = {
  uk: Article[]; ep: Article[]; inf: Article[]; intv: Article[];
  vid: any[]; op: Article[]; ca: Article[]; eu: Article[]; ru: Article[];
  dc: Article[]; tash: Article[]; tiif2026: Article[]; avi: Article[];
};
let homeFeedCache: HomeFeedData | null = null;

function toArticle(a: any): Article {
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
    featured: a.isFeatured || a.featured || false,
    topic:    a.category || '',
    ...(Array.isArray(a.hashtags) ? { hashtags: a.hashtags } : {}),
    ...(a.section ? { section: a.section } : {}),
    ...(a.videoId ? { videoId: a.videoId } : {}),
  } as Article;
}

async function fetchSectionHome(section: string, limit = 4): Promise<any[]> {
  try {
    const r = await fetch(`${API_URL}/section-articles/home/${section}?limit=${limit}`);
    if (!r.ok) return [];
    const data = await r.json();
    return section === 'video' ? data : data.map(toArticle);
  } catch { return []; }
}

async function fetchAllHomeFeeds(): Promise<HomeFeedData> {
  const [uk, ep, inf, intv, vid, op, ca, eu, ru, dc, tash, tiif2026, avi] = await Promise.all([
    fetchSectionHome('uk', 4),
    fetchSectionHome('editors-picks', 4),
    fetchSectionHome('in-focus', 4),
    fetchSectionHome('interviews'),
    fetchSectionHome('video', 4),
    fetchSectionHome('opinion'),
    fetchSectionHome('central-asia', 8),
    fetchSectionHome('europe-home', 4),
    fetchSectionHome('russia-home', 5),
    fetchSectionHome('diplomatic-corner', 8),
    fetchSectionHome('tashkent', 5),
    fetchSectionHome('tiif-2026', 5),
    fetchSectionHome('aviation', 5),
  ]);
  return { uk, ep, inf, intv, vid, op, ca, eu, ru, dc, tash, tiif2026, avi };
}

function getYtThumb(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

/* ─────────────────────────────────────────────────────────────────────
   Shared design system — ONE accent color (primary/accent), ONE dark
   tone, alternating light/soft backgrounds for rhythm. Every section
   below draws from this instead of picking its own hue.
   ───────────────────────────────────────────────────────────────────── */
const DARK_BG = 'bg-[#0b1220]';

function CenterHeader({
  title, action, dark = false,
}: {
  title: string; description: string; action?: React.ReactNode; dark?: boolean;
}) {
  return (
    <div className="mb-8 text-center">
      <h2 className={`text-3xl font-black lg:text-4xl ${dark ? 'text-white' : 'text-ink'}`}>{title}</h2>
      
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* Small uppercase category label used above headlines, the way BBC/CNN
   tag every story — only renders if the article actually has a category. */
function CategoryTag({ category, dark = false }: { category?: string; dark?: boolean }) {
  if (!category) return null;
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider ${dark ? 'text-accent' : 'text-primary'}`}>
      {category}
    </span>
  );
}

function CoverageLink({ to, label = 'All Coverage', dark = false }: { to: string; label?: string; dark?: boolean }) {
  return (
    <Link
      to={to}
      className={`inline-flex shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
        dark
          ? 'border-accent/40 text-accent hover:bg-accent hover:text-ink'
          : 'border-primary/30 text-primary hover:bg-primary hover:text-white'
      }`}
    >
      {label} →
    </Link>
  );
}

function ArrowCarousel({ items, renderCard }: { items: any[]; renderCard: (item: any) => React.ReactNode }) {
  const [page, setPage] = useState(0);
  const perPage = 4;
  const maxPage = Math.max(0, Math.ceil(items.length / perPage) - 1);
  const shown = items.slice(page * perPage, (page + 1) * perPage);
  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {shown.map((item, i) => <div key={i}>{renderCard(item)}</div>)}
      </div>
      {items.length > perPage && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 text-xl text-slate-600 transition hover:border-primary hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-30">←</button>
          <div className="flex gap-2">
            {Array.from({ length: maxPage + 1 }).map((_, i) => (
              <button key={i} onClick={() => setPage(i)}
                className={`h-2.5 rounded-full transition-all ${i === page ? 'w-7 bg-primary' : 'w-2.5 bg-slate-300 hover:bg-slate-400'}`} />
            ))}
          </div>
          <button onClick={() => setPage(p => Math.min(maxPage, p + 1))} disabled={page === maxPage}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 text-xl text-slate-600 transition hover:border-primary hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-30">→</button>
        </div>
      )}
    </div>
  );
}

/* ─── Skeleton loading state — shown only on a genuinely cold load
     (no in-memory cache yet). Keeps the page from looking blank/broken
     while the 13 parallel home-feed requests resolve. ─── */
function Shimmer({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200/70 ${className}`} />;
}

function HomeSkeleton() {
  return (
    <div className="space-y-16 py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Shimmer key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="grid gap-6 xl:grid-cols-[1.35fr,1fr]">
          <Shimmer className="h-80 w-full" />
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => <Shimmer key={i} className="h-24 w-full" />)}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Shimmer key={i} className="h-56 w-full" />)}
        </div>
      </div>
    </div>
  );
}

/* ─── Tashkent Section ─── */
function TashkentSection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;
  const lead = articles[0];
  const rest = articles.slice(1, 5);
  return (
    <section className={DARK_BG + ' py-14'}>
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-black text-white lg:text-5xl">Tashkent</h2>
            <p className="mt-2 max-w-xl text-slate-400">Latest news, diplomacy and developments from Tashkent.</p>
          </div>
          <div className="hidden sm:block"><CoverageLink to="/section/tashkent" dark /></div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr,1fr]">
          <Link to={`/article/${lead.id}`} className="group relative overflow-hidden rounded-2xl">
            <div className="aspect-[16/9] max-h-[360px] overflow-hidden">
              {lead.image
                ? <img src={cld(lead.image, 1200)} alt={lead.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                : <div className="h-full w-full bg-slate-800" />
              }
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-xl font-black text-white lg:text-2xl">{lead.title}</h3>
              {lead.subtitle && <p className="mt-1.5 text-sm text-white/70">{lead.subtitle}</p>}
              <p className="mt-2 text-xs text-white/50">{lead.author} · {lead.date}</p>
            </div>
          </Link>

          <div className="flex flex-col divide-y divide-white/10">
            {rest.map((article, i) => (
              <Link key={article.id} to={`/article/${article.id}`}
                className="group flex gap-4 py-4 first:pt-0 last:pb-0 transition hover:opacity-80">
                <span className="mt-1 shrink-0 text-2xl font-black text-accent/70 leading-none w-7">
                  {String(i + 2).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <CategoryTag category={article.category} dark />
                  <h3 className="mt-0.5 line-clamp-2 text-sm font-bold leading-snug text-white group-hover:text-accent transition">{article.title}</h3>
                  <p className="mt-1 text-xs text-slate-500">{article.author} · {article.date}</p>
                </div>
                {article.image && (
                  <img src={cld(article.image, 300)} alt={article.title} className="h-14 w-16 shrink-0 rounded-lg object-cover opacity-80" />
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6 sm:hidden text-center">
          <CoverageLink to="/section/tashkent" dark />
        </div>
      </div>
    </section>
  );
}

/* ─── TIIF-2026 Section ─── */
function TiifSection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;
  return (
    <section className={DARK_BG + ' py-14'}>
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <CenterHeader
          dark
          title="TIIF-2026"
          description="Tashkent International Investment Forum 2026 — exclusive coverage, analysis and highlights."
          action={<CoverageLink to="/section/tiif-2026" dark />}
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {articles[0] && (
            <Link to={`/article/${articles[0].id}`}
              className="group relative overflow-hidden rounded-[1.75rem] md:col-span-2 xl:col-span-1 xl:row-span-2">
              <div className="aspect-[4/5] overflow-hidden xl:h-full">
                {articles[0].image
                  ? <img src={cld(articles[0].image, 900)} alt={articles[0].title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  : <div className="h-full w-full bg-slate-800" />
                }
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="text-xl font-black text-white">{articles[0].title}</h3>
                {articles[0].subtitle && <p className="mt-1.5 text-sm text-white/70 line-clamp-2">{articles[0].subtitle}</p>}
                <p className="mt-3 text-xs text-white/50">{articles[0].author} · {articles[0].date}</p>
              </div>
            </Link>
          )}

          {articles.slice(1, 5).map((article) => (
            <Link key={article.id} to={`/article/${article.id}`}
              className="group flex gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/10">
              {article.image && (
                <div className="aspect-square h-20 shrink-0 overflow-hidden rounded-xl">
                  <img src={cld(article.image, 300)} alt={article.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <CategoryTag category={article.category} dark />
                <h3 className="mt-0.5 line-clamp-2 text-sm font-bold leading-snug text-white">{article.title}</h3>
                <p className="mt-1.5 text-xs text-slate-500">{article.author} · {article.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Aviation Section ─── */
function AviationSection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;
  const [main, ...rest] = articles;
  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-black text-ink lg:text-5xl">Aviation</h2>
            <p className="mt-2 max-w-xl text-slate-500">Airlines, airports, aerospace and industry developments.</p>
          </div>
          <div className="hidden sm:block"><CoverageLink to="/section/aviation" /></div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
          <Link to={`/article/${main.id}`}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <div className="aspect-[16/9] max-h-[360px] overflow-hidden">
              {main.image
                ? <img src={cld(main.image, 1200)} alt={main.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                : <div className="h-full w-full bg-slate-200" />
              }
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-xl font-black text-white lg:text-2xl">{main.title}</h3>
              {main.subtitle && <p className="mt-1.5 text-sm text-white/80">{main.subtitle}</p>}
              <p className="mt-2 text-xs text-white/60">{main.author} · {main.date}</p>
            </div>
          </Link>

          <div className="flex flex-col gap-3">
            {rest.slice(0, 4).map((article) => (
              <Link key={article.id} to={`/article/${article.id}`}
                className="group flex gap-3 overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                {article.image && (
                  <div className="h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                    <img src={cld(article.image, 300)} alt={article.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <CategoryTag category={article.category} />
                  <h3 className="mt-0.5 line-clamp-2 text-sm font-bold text-ink">{article.title}</h3>
                  <p className="mt-1 text-xs text-slate-400">{article.author} · {article.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Main HomePage ─────────────────────────────────────────────────── */

export function HomePage() {
  const staticUK      = useMemo(() => staticArticles.filter(a => a.region === 'United Kingdom').slice(0, 4), []);
  const staticEdPick  = useMemo(() => staticArticles.filter(a => a.featured).slice(0, 4), []);
  const staticFocus   = useMemo(() => staticArticles.filter(a => ['Analysis','Diplomacy'].includes(a.category)).slice(0, 4), []);
  const staticIntvw   = useMemo(() => staticArticles.filter(a => a.category === 'Interviews' || a.topic === 'Interviews').slice(0, 4), []);

  // Hydrate instantly from the in-memory cache if we have it (repeat SPA
  // visit) — otherwise start empty and show the skeleton while fetching.
  const [feed, setFeed] = useState<HomeFeedData | null>(homeFeedCache);
  const [homeLoaded, setHomeLoaded] = useState(homeFeedCache !== null);

  useEffect(() => {
    let cancelled = false;

    fetchAllHomeFeeds().then((data) => {
      if (cancelled) return;
      homeFeedCache = data;
      setFeed(data);
      setHomeLoaded(true);
    });

    return () => { cancelled = true; };
    // Runs on every mount — but if we already had cached data, the UI
    // above doesn't wait on it (homeLoaded was already true from cache),
    // this just quietly refreshes in the background.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!homeLoaded || !feed) {
    return (
      <div>
        <Hero />
        <HomeSkeleton />
      </div>
    );
  }

  const displayUK      = feed.uk.length      ? feed.uk      : staticUK;
  const displayEdPick  = feed.ep.length      ? feed.ep      : staticEdPick;
  const displayInFocus = feed.inf.length     ? feed.inf     : staticFocus;
  const displayIntvw   = feed.intv.length    ? feed.intv    : staticIntvw;
  const displayVideos  = feed.vid;
  const displayOpinion = feed.op;
  const displayCA      = feed.ca;
  const displayEurope  = feed.eu;
  const displayRussia  = feed.ru;
  const displayDiplo   = feed.dc;
  const displayTashkent = feed.tash;
  const displayTiif    = feed.tiif2026;
  const displayAviation = feed.avi;

  const featuredEditorsPick = displayEdPick[0] || null;
  const sideEditorsPicks    = displayEdPick.slice(1, 4);
  const russiaLead          = displayRussia[0] || null;
  const russiaSide          = displayRussia.slice(1, 5);

  return (
    <div>
      <Hero />

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <AdBanner identifier="homepage-banner-1" />
      </section>

      {displayUK.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
          <CenterHeader title="United Kingdom"
            description="Latest analysis, policy coverage and reporting from the United Kingdom." />
          <div className="grid gap-6 lg:grid-cols-[1fr,1fr,320px]">
            <div className="grid gap-6 md:grid-cols-2 lg:col-span-2">
              {displayUK.map(article => (
                <Link key={article.id} to={`/article/${article.id}`}
                  className="group block overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <img src={cld(article.image, 700)} alt={article.title}
                    className="h-48 w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="p-5">
                    <CategoryTag category={article.category} />
                    <h3 className="mt-1 text-lg font-bold leading-snug text-ink">{article.title}</h3>
                    <p className="mt-1.5 text-sm text-slate-600 line-clamp-2">{article.subtitle}</p>
                    <span className="mt-4 inline-block rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary transition group-hover:bg-primary group-hover:text-white">Read More</span>
                  </div>
                </Link>
              ))}
            </div>
            <AdBanner vertical identifier="homepage-banner-2" />
          </div>
        </section>
      )}

      {displayEdPick.length > 0 && featuredEditorsPick && (
        <section className="bg-soft py-14">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <CenterHeader title="Editor's Picks"
              description="Hand-selected stories from our editorial team — the most important reads this week." />
            <div className="grid gap-6 xl:grid-cols-[1.35fr,1fr]">
              <ArticleCard article={featuredEditorsPick} />
              <div className="flex flex-col gap-4">
                {sideEditorsPicks.map(article => (
                  <Link key={article.id} to={`/article/${article.id}`}
                    className="group flex gap-3 overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
                    <img src={cld(article.image, 300)} alt={article.title} className="h-24 w-28 flex-shrink-0 rounded-lg object-cover" />
                    <div className="flex min-w-0 flex-col justify-between py-0.5">
                      <div>
                        <CategoryTag category={article.category} />
                        <h3 className="mt-0.5 line-clamp-2 text-sm font-bold leading-snug text-ink">{article.title}</h3>
                        <p className="mt-1 text-xs text-slate-400">{article.author} · {article.date}</p>
                      </div>
                      <span className="mt-2 self-start text-sm font-semibold text-primary group-hover:underline">Read More →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="my-10 grid gap-6 lg:grid-cols-2">
              <AdBanner identifier="homepage-banner-3" />
              <AdBanner identifier="homepage-banner-4" />
            </div>
          </div>
        </section>
      )}

      {displayInFocus.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
          <CenterHeader title="In Focus"
            description="Deep dives and long-form analysis on the stories that demand closer attention." />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {displayInFocus.map(article => <ArticleCard key={article.id} article={article} />)}
          </div>
        </section>
      )}

      {displayIntvw.length > 0 && (
        <section className={DARK_BG + ' py-14'}>
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <CenterHeader dark title="Interviews"
              description="In-depth conversations with policymakers, analysts and global voices." />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {displayIntvw.map(article => (
                <Link key={article.id} to={`/article/${article.id}`} className="group relative overflow-hidden rounded-[1.75rem]">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img src={cld(article.image, 700)} alt={article.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="line-clamp-3 text-sm font-bold leading-snug text-white">{article.title}</h3>
                    <p className="mt-2 text-xs text-white/50">{article.author} · {article.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {displayVideos.length > 0 && (
        <section className={DARK_BG + ' py-14'}>
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <CenterHeader dark title="Watch & Learn"
              description="Video reports, documentary clips and analysis from our global team."
              action={<CoverageLink to="/section/video" label="All Videos" dark />}
            />
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {displayVideos.map((article: any) => {
                const thumb = article.imageUrl ? article.imageUrl : article.videoId ? getYtThumb(article.videoId) : '';
                const articleId = article._id || article.id || '';
                return (
                  <Link key={articleId} to={`/video/${articleId}`}
                    className="group overflow-hidden rounded-2xl bg-white/5 transition hover:-translate-y-1 hover:bg-white/10">
                    <div className="relative aspect-video overflow-hidden">
                      {thumb && <img src={cld(thumb, 700)} alt={article.title} className="h-full w-full object-cover transition group-hover:scale-105" />}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent shadow-lg">
                          <svg className="ml-0.5 h-5 w-5 text-ink" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent">
                        <svg className="ml-0.5 h-3 w-3 text-ink" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="line-clamp-2 text-sm font-bold text-white">{article.title}</h3>
                      <p className="mt-1 text-xs text-slate-400">{article.author} · {article.date}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {displayOpinion.length > 0 && (
        <section className="bg-soft py-14">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <CenterHeader title="Opinion"
              description="Perspectives from analysts, contributors and thought leaders."
              action={<CoverageLink to="/section/opinion" label="All Opinions" />}
            />
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {displayOpinion.map(article => (
                <Link key={article.id} to={`/article/${article.id}`}
                  className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
                  {article.image && (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img src={cld(article.image, 600)} alt={article.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <svg className="h-6 w-6 text-primary/40" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <h3 className="mt-2 line-clamp-3 flex-1 text-base font-bold leading-snug text-ink">{article.title}</h3>
                    <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                        {article.author?.charAt(0) || 'A'}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-ink">{article.author}</p>
                        <p className="text-xs text-slate-400">{article.date}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {displayCA.length > 0 && (
        <section className={DARK_BG + ' py-14'}>
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <CenterHeader dark title="Central Asia Coverage"
              description="Strategic reporting from Kazakhstan, Uzbekistan, Kyrgyzstan, Tajikistan and Turkmenistan."
              action={<CoverageLink to="/region/asia/central-asia" dark />}
            />
            <ArrowCarousel items={displayCA} renderCard={(article) => (
              <Link to={`/article/${article.id}`} className="group block overflow-hidden rounded-[1.75rem] bg-white/5 transition hover:-translate-y-1 hover:bg-white/10">
                {article.image && (
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={cld(article.image, 600)} alt={article.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                  </div>
                )}
                <div className="p-5">
                  <CategoryTag category={article.category} dark />
                  <h3 className="mt-0.5 line-clamp-2 text-sm font-bold text-white">{article.title}</h3>
                  <p className="mt-1 text-xs text-slate-400">{article.author} · {article.date}</p>
                </div>
              </Link>
            )} />
          </div>
        </section>
      )}

      {displayEurope.length > 0 && (
        <section className="bg-white py-14">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <CenterHeader title="Europe"
              description="Western, Eastern, Northern and Southern Europe — diplomacy, security and economics."
              action={<CoverageLink to="/region/europe" label="All Europe" />}
            />
            {displayEurope.length === 1 ? (
              <ArticleCard article={displayEurope[0]} />
            ) : (
              <div className="grid gap-6 lg:grid-cols-[1.3fr,1fr]">
                <Link to={`/article/${displayEurope[0].id}`} className="group relative overflow-hidden rounded-2xl shadow-md">
                  <div className="aspect-[16/9] max-h-[360px] overflow-hidden">
                    <img src={cld(displayEurope[0].image, 1200)} alt={displayEurope[0].title} className="h-full w-full object-cover transition group-hover:scale-105" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-black text-white lg:text-2xl">{displayEurope[0].title}</h3>
                    <p className="mt-1.5 text-sm text-white/70">{displayEurope[0].author} · {displayEurope[0].date}</p>
                  </div>
                </Link>
                <div className="flex flex-col gap-3">
                  {displayEurope.slice(1, 4).map(article => (
                    <Link key={article.id} to={`/article/${article.id}`}
                      className="group flex gap-3 overflow-hidden rounded-xl border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-soft">
                      {article.image && <img src={cld(article.image, 300)} alt={article.title} className="h-16 w-20 flex-shrink-0 rounded-lg object-cover" />}
                      <div className="min-w-0 flex-1">
                        <CategoryTag category={article.category} />
                        <h3 className="mt-0.5 line-clamp-2 text-sm font-bold text-ink">{article.title}</h3>
                        <p className="mt-1 text-xs text-slate-400">{article.author} · {article.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {displayRussia.length > 0 && russiaLead && (
        <section className="bg-soft py-14">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <CenterHeader title="Russia"
              description="Strategic reporting, politics, diplomacy and economic coverage from Russia."
              action={<CoverageLink to="/region/russia" label="All Russia" />}
            />
            <div className="grid gap-8 xl:grid-cols-[1.6fr,420px]">
              <Link to={`/article/${russiaLead.id}`} className="group block overflow-hidden rounded-xl bg-white shadow-sm">
                {russiaLead.image && (
                  <div className="aspect-[16/9] max-h-[320px] overflow-hidden">
                    <img src={cld(russiaLead.image, 1200)} alt={russiaLead.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                )}
                <div className="bg-ink px-6 py-4">
                  <p className="text-xs font-black uppercase tracking-wide text-white/80">By {russiaLead.author} · {russiaLead.date}</p>
                </div>
                <div className="px-6 py-6">
                  <CategoryTag category={russiaLead.category} />
                  <h3 className="mt-1 text-2xl font-bold leading-tight text-ink lg:text-[1.75rem]">{russiaLead.title}</h3>
                  {russiaLead.subtitle && <p className="mt-3 text-base text-slate-600">{russiaLead.subtitle}</p>}
                </div>
              </Link>
              <div className="rounded-xl bg-white p-6">
                <div className="space-y-5">
                  {russiaSide.map(article => (
                    <Link key={article.id} to={`/article/${article.id}`}
                      className="group flex gap-3 border-b border-slate-200 pb-5 last:border-b-0 last:pb-0">
                      {article.image && <img src={cld(article.image, 300)} alt={article.title} className="h-16 w-20 flex-shrink-0 rounded-lg object-cover" />}
                      <div className="min-w-0 flex-1">
                        <CategoryTag category={article.category} />
                        <h3 className="mt-0.5 line-clamp-2 text-base font-bold leading-snug text-ink group-hover:text-primary transition">{article.title}</h3>
                        <p className="mt-1 text-xs text-slate-400">{article.author} · {article.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Tashkent ── */}
      <TashkentSection articles={displayTashkent} />

      {/* ── TIIF-2026 ── */}
      <TiifSection articles={displayTiif} />

      {/* ── Aviation ── */}
      <AviationSection articles={displayAviation} />

      {displayDiplo.length > 0 && (
        <section className={DARK_BG + ' py-14'}>
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <CenterHeader dark title="Diplomatic Corner"
              description="In-depth diplomatic analysis, treaties, negotiations and foreign policy insights."
              action={<CoverageLink to="/section/diplomatic-corner" dark />}
            />
            <ArrowCarousel items={displayDiplo} renderCard={(article) => (
              <Link to={`/article/${article.id}`} className="group block overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/10">
                {article.image && (
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={cld(article.image, 600)} alt={article.title} className="h-full w-full object-cover opacity-90 transition group-hover:scale-105" />
                  </div>
                )}
                <div className="p-5">
                  <CategoryTag category={article.category} dark />
                  <h3 className="mt-0.5 line-clamp-2 text-sm font-bold text-white">{article.title}</h3>
                  <p className="mt-1 text-xs text-slate-400">{article.author} · {article.date}</p>
                </div>
              </Link>
            )} />
          </div>
        </section>
      )}

      <PartnersMarquee />
    </div>
  );
}

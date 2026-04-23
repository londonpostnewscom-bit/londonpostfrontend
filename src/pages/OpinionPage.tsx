// import { useEffect, useRef, useState } from 'react';
// import { AdBanner } from '../components/AdBanner';
// import { ArticleReader } from '../components/ArticleReader';
// import { SectionHeading } from '../components/SectionHeading';
// import { Article } from '../data/siteData';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// function toArticle(a: any): Article {
//   return {
//     id: a._id || a.id || '',
//     title: a.title || '',
//     subtitle: a.subtitle || '',
//     content: a.content || '',
//     image: a.imageUrl || '',
//     author: a.author || '',
//     date: a.date || '',
//     category: a.category || '',
//     region: '',
//     featured: a.isFeatured || false,
//     archived: a.isArchived || false,
//     topic: a.category || '',
//   };
// }

// function QuoteIcon() {
//   return (
//     <svg className="h-8 w-8 text-accent/40" fill="currentColor" viewBox="0 0 24 24">
//       <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
//     </svg>
//   );
// }

// export function OpinionPage() {
//   const [articles, setArticles] = useState<Article[]>([]);
//   const [loading,  setLoading]  = useState(true);
//   const [selected, setSelected] = useState<Article | null>(null);
//   const readerRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     fetch(`${API_URL}/section-articles/section/opinion`)
//       .then((r) => r.ok ? r.json() : [])
//       .then((data) => setArticles(data.map(toArticle)))
//       .catch(() => setArticles([]))
//       .finally(() => setLoading(false));
//   }, []);

//   const openArticle = (article: Article) => {
//     setSelected(article);
//     setTimeout(() => readerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
//   };

//   const featured = articles.filter((a) => a.featured && !a.archived).slice(0, 1);
//   const latest   = articles.filter((a) => !a.archived);
//   const archived = articles.filter((a) => a.archived).slice(0, 4);

//   const heroArticle = featured[0] || latest[0] || null;
//   const gridArticles = latest.filter((a) => a.id !== heroArticle?.id).slice(0, 6);

//   if (loading) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-amber-50">

//       {/* Page header */}
//       <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-16 text-center text-white">
//         <span className="inline-block rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">
//           Opinion
//         </span>
//         <h1 className="mt-4 text-5xl font-black tracking-tight">Voices & Views</h1>
//         <p className="mx-auto mt-4 max-w-xl text-slate-300">
//           Perspectives from analysts, contributors and thought leaders across the globe.
//         </p>
//       </div>

//       <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
//         <div className="grid gap-10 xl:grid-cols-[1fr,300px]">
//           <div>
//             {/* Hero Opinion Article */}
//             {heroArticle && (
//               <div
//                 className="group relative mb-10 cursor-pointer overflow-hidden rounded-[2rem] bg-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
//                 onClick={() => openArticle(heroArticle)}
//               >
//                 <div className="grid lg:grid-cols-[1fr,1.2fr]">
//                   <div className="flex flex-col justify-between p-8 lg:p-10">
//                     <div>
//                       <QuoteIcon />
//                       <span className="mt-4 inline-block text-xs font-bold uppercase tracking-widest text-accent">
//                         {heroArticle.category || 'Opinion'}
//                       </span>
//                       <h2 className="mt-3 text-2xl font-black leading-tight text-ink lg:text-3xl">
//                         {heroArticle.title}
//                       </h2>
//                       <p className="mt-4 text-slate-600 leading-relaxed">{heroArticle.subtitle}</p>
//                     </div>
//                     <div className="mt-8">
//                       <div className="flex items-center gap-3">
//                         <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold text-sm">
//                           {heroArticle.author.charAt(0)}
//                         </div>
//                         <div>
//                           <p className="font-semibold text-ink">{heroArticle.author}</p>
//                           <p className="text-xs text-slate-400">{heroArticle.date}</p>
//                         </div>
//                       </div>
//                       <button className="mt-5 rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white">
//                         Read Full Opinion
//                       </button>
//                     </div>
//                   </div>
//                   {heroArticle.image && (
//                     <div className="overflow-hidden">
//                       <img
//                         src={heroArticle.image}
//                         alt={heroArticle.title}
//                         className="h-full w-full object-cover transition duration-500 group-hover:scale-105 lg:rounded-r-[2rem]"
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Opinion Grid */}
//             {gridArticles.length > 0 && (
//               <div>
//                 <p className="mb-6 text-xs font-bold uppercase tracking-widest text-accent">All Opinions</p>
//                 <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
//                   {gridArticles.map((article) => (
//                     <div
//                       key={article.id}
//                       className="group cursor-pointer rounded-[1.75rem] border border-amber-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
//                       onClick={() => openArticle(article)}
//                     >
//                       <QuoteIcon />
//                       <span className="mt-3 inline-block text-[10px] font-bold uppercase tracking-widest text-accent">
//                         {article.category}
//                       </span>
//                       <h3 className="mt-2 line-clamp-3 text-base font-bold leading-snug text-ink">
//                         {article.title}
//                       </h3>
//                       <p className="mt-2 line-clamp-2 text-sm text-slate-500">{article.subtitle}</p>
//                       <div className="mt-4 flex items-center gap-2 border-t border-amber-100 pt-4">
//                         <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary text-xs font-bold text-white">
//                           {article.author.charAt(0)}
//                         </div>
//                         <div className="min-w-0">
//                           <p className="truncate text-xs font-semibold text-ink">{article.author}</p>
//                           <p className="text-xs text-slate-400">{article.date}</p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Archived */}
//             {archived.length > 0 && (
//               <div className="mt-12">
//                 <p className="mb-5 text-xs font-bold uppercase tracking-widest text-slate-400">Archived</p>
//                 <div className="space-y-3">
//                   {archived.map((article) => (
//                     <div
//                       key={article.id}
//                       className="flex cursor-pointer items-center gap-4 rounded-2xl border border-amber-100 bg-white p-4 transition hover:bg-amber-50"
//                       onClick={() => openArticle(article)}
//                     >
//                       {article.image && <img src={article.image} alt={article.title} className="h-14 w-20 flex-shrink-0 rounded-xl object-cover" />}
//                       <div className="min-w-0">
//                         <span className="text-[10px] font-bold uppercase tracking-widest text-accent">{article.category}</span>
//                         <h3 className="mt-0.5 truncate font-bold text-ink">{article.title}</h3>
//                         <p className="text-xs text-slate-400">{article.author} · {article.date}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {articles.length === 0 && (
//               <div className="rounded-[2rem] border-2 border-dashed border-amber-200 p-16 text-center text-amber-400">
//                 <p className="text-lg font-semibold">No opinion pieces yet</p>
//                 <p className="mt-2 text-sm">Add articles from Admin → More Sections → Opinion</p>
//               </div>
//             )}

//             {/* Article Reader */}
//             <section ref={readerRef} className="mt-16">
//               <ArticleReader article={selected} />
//             </section>
//           </div>

//           {/* Sidebar Ad */}
//           <div className="hidden xl:block">
//             <div className="sticky top-6">
//               <AdBanner vertical />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdBanner } from '../components/AdBanner';
import { Article } from '../data/siteData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function toArticle(a: any): Article {
  return {
    id: a._id || a.id || '',
    title: a.title || '',
    subtitle: a.subtitle || '',
    content: a.content || '',
    image: a.imageUrl || '',
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

function QuoteIcon() {
  return (
    <svg className="h-8 w-8 text-accent/40" fill="currentColor" viewBox="0 0 24 24">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
    </svg>
  );
}

const FEATURED_BATCH = 6;
const GRID_BATCH = 4;

export function OpinionPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredVisible, setFeaturedVisible] = useState(FEATURED_BATCH);
  const [latestVisible, setLatestVisible] = useState(GRID_BATCH);
  const [archivedVisible, setArchivedVisible] = useState(GRID_BATCH);

  useEffect(() => {
    fetch(`${API_URL}/section-articles/section/opinion`)
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setArticles(data.map(toArticle)))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  const featuredAll = articles.filter((a) => a.featured && !a.archived);
  const latestAll = articles.filter((a) => !a.archived);
  const archivedAll = articles.filter((a) => a.archived);

  const visibleFeatured = featuredAll.slice(0, featuredVisible);
  const visibleLatest = latestAll.slice(0, latestVisible);
  const visibleArchived = archivedAll.slice(0, archivedVisible);

  const canLoadMoreFeatured = featuredVisible < featuredAll.length;
  const canLoadMoreLatest = latestVisible < latestAll.length;
  const canLoadMoreArchived = archivedVisible < archivedAll.length;

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-16 text-center text-white">
        <span className="inline-block rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">
          Opinion
        </span>
        <h1 className="mt-4 text-5xl font-black tracking-tight">Voices & Views</h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-300">
          Perspectives from analysts, contributors and thought leaders across the globe.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <div className="grid gap-10 xl:grid-cols-[1fr,300px]">
          <div>
            {visibleFeatured.length > 0 && (
              <div>
                <p className="mb-6 text-xs font-bold uppercase tracking-widest text-accent">Featured</p>
                <div className="grid gap-6">
                  {visibleFeatured.map((article) => (
                    <Link
                      key={article.id}
                      to={`/article/${article.id}`}
                      className="group overflow-hidden rounded-[2rem] bg-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
                    >
                      <div className="grid lg:grid-cols-[1fr,1.2fr]">
                        <div className="flex flex-col justify-between p-8 lg:p-10">
                          <div>
                            <QuoteIcon />
                            <span className="mt-4 inline-block text-xs font-bold uppercase tracking-widest text-accent">
                              {article.category || 'Opinion'}
                            </span>
                            <h2 className="mt-3 text-2xl font-black leading-tight text-ink lg:text-3xl">
                              {article.title}
                            </h2>
                            <p className="mt-4 text-slate-600 leading-relaxed">{article.subtitle}</p>
                          </div>

                          <div className="mt-8">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary text-sm font-bold text-white">
                                {article.author.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-ink">{article.author}</p>
                                <p className="text-xs text-slate-400">{article.date}</p>
                              </div>
                            </div>

                            <span className="mt-5 inline-flex rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition group-hover:bg-primary group-hover:text-white">
                              Read Full Opinion
                            </span>
                          </div>
                        </div>

                        {article.image && (
                          <div className="overflow-hidden">
                            <img
                              src={article.image}
                              alt={article.title}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105 lg:rounded-r-[2rem]"
                            />
                          </div>
                        )}
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
              <div className="mt-12">
                <p className="mb-6 text-xs font-bold uppercase tracking-widest text-accent">Latest</p>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleLatest.map((article) => (
                    <Link
                      key={article.id}
                      to={`/article/${article.id}`}
                      className="group rounded-[1.75rem] border border-amber-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
                    >
                      <QuoteIcon />
                      <span className="mt-3 inline-block text-[10px] font-bold uppercase tracking-widest text-accent">
                        {article.category}
                      </span>
                      <h3 className="mt-2 line-clamp-3 text-base font-bold leading-snug text-ink">
                        {article.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-slate-500">{article.subtitle}</p>
                      <div className="mt-4 flex items-center gap-2 border-t border-amber-100 pt-4">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary text-xs font-bold text-white">
                          {article.author.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-ink">{article.author}</p>
                          <p className="text-xs text-slate-400">{article.date}</p>
                        </div>
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
              <div className="mt-12">
                <p className="mb-5 text-xs font-bold uppercase tracking-widest text-slate-400">Archived</p>
                <div className="space-y-3">
                  {visibleArchived.map((article) => (
                    <Link
                      key={article.id}
                      to={`/article/${article.id}`}
                      className="flex items-center gap-4 rounded-2xl border border-amber-100 bg-white p-4 transition hover:bg-amber-50"
                    >
                      {article.image && (
                        <img
                          src={article.image}
                          alt={article.title}
                          className="h-14 w-20 flex-shrink-0 rounded-xl object-cover"
                        />
                      )}
                      <div className="min-w-0">
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
              <div className="rounded-[2rem] border-2 border-dashed border-amber-200 p-16 text-center text-amber-400">
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
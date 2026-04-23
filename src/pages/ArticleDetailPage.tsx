

// import { useEffect, useState } from 'react';
// import { Link, useNavigate, useParams } from 'react-router-dom';
// import { AdBanner } from '../components/AdBanner';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// function isHTML(str: string) {
//   return /<[a-z][\s\S]*>/i.test(str) || /&lt;[a-z][\s\S]*&gt;/i.test(str);
// }

// function decodeAndStrip(html: string): string {
//   const ta = document.createElement('textarea');
//   ta.innerHTML = html;
//   const decoded = ta.value;
//   return decoded
//     .replace(/<script[\s\S]*?<\/script>/gi, '')
//     .replace(/<style[\s\S]*?<\/style>/gi, '')
//     .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
//     .replace(/\s*data-[a-z-]+=["'][^"']*["']/gi, '')
//     .replace(/\s*jsaction=["'][^"']*["']/gi, '')
//     .replace(/\s*jscontroller=["'][^"']*["']/gi, '')
//     .replace(/\s*jsname=["'][^"']*["']/gi, '')
//     .replace(/\s*class=["'][^"']*["']/gi, '')
//     .replace(/\s*style=["'][^"']*["']/gi, '');
// }

// function getKeywords(title: string): string[] {
//   const stop = new Set(['the','a','an','and','or','of','in','on','at','to','for','with','by','from','is','are','was','were','how','what','why','when','who','that','this','has','have','its','their']);
//   return title.toLowerCase()
//     .replace(/[^a-z0-9\s]/g, '')
//     .split(/\s+/)
//     .filter((w) => w.length > 3 && !stop.has(w));
// }

// function HashtagBox({ hashtags }: { hashtags?: string[] }) {
//   if (!Array.isArray(hashtags) || hashtags.length === 0) return null;

//   return (
//     <div className="mt-10 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
//       <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">Hashtags</p>
//       <div className="mt-4 flex flex-wrap gap-2.5">
//         {hashtags.map((tag) => (
//           <span
//             key={tag}
//             className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm"
//           >
//             #{tag}
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// }

// export function ArticleDetailPage() {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [article,  setArticle]  = useState<any>(null);
//   const [related,  setRelated]  = useState<any[]>([]);
//   const [loading,  setLoading]  = useState(true);
//   const [notFound, setNotFound] = useState(false);

//   useEffect(() => {
//     if (!id) return;
//     setLoading(true);
//     setArticle(null);
//     setRelated([]);
//     setNotFound(false);

//     const tryFetch = async () => {
//       let art: any = null;
//       let source = '';

//       try {
//         const r = await fetch(`${API_URL}/region-articles/${id}`);
//         if (r.ok) { art = await r.json(); source = 'region'; }
//       } catch {}

//       if (!art) {
//         try {
//           const r = await fetch(`${API_URL}/section-articles/${id}`);
//           if (r.ok) { art = await r.json(); source = 'section'; }
//         } catch {}
//       }

//       if (!art) { setNotFound(true); setLoading(false); return; }
//       setArticle(art);

//       try {
//         const keywords = getKeywords(art.title || '');
//         let allArticles: any[] = [];

//         if (source === 'region') {
//           const r = await fetch(`${API_URL}/region-articles/region/${art.region}`);
//           if (r.ok) allArticles = await r.json();
//         } else {
//           const r = await fetch(`${API_URL}/section-articles/section/${art.section}`);
//           if (r.ok) allArticles = await r.json();
//         }

//         const scored = allArticles
//           .filter((a: any) => (a._id || a.id) !== id && a.isActive !== false)
//           .map((a: any) => ({
//             ...a,
//             _score: getKeywords(a.title || '').filter((kw) => keywords.includes(kw)).length,
//           }))
//           .sort((a: any, b: any) => b._score - a._score)
//           .slice(0, 3);

//         if (scored.length < 2) {
//           const existing = new Set(scored.map((a: any) => a._id));
//           const extras = allArticles
//             .filter((a: any) => (a._id || a.id) !== id && !existing.has(a._id))
//             .slice(0, 3 - scored.length);
//           setRelated([...scored, ...extras]);
//         } else {
//           setRelated(scored);
//         }
//       } catch {}

//       setLoading(false);
//     };

//     tryFetch();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
//       </div>
//     );
//   }

//   if (notFound || !article) {
//     return (
//       <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
//         <p className="text-2xl font-bold text-ink">Article not found</p>
//         <button
//           onClick={() => navigate(-1)}
//           className="rounded-full bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary/90"
//         >
//           ← Go Back
//         </button>
//       </div>
//     );
//   }

//   const content = article.content || '';
//   const contentIsHtml = isHTML(content);
//   const safeContent = contentIsHtml ? decodeAndStrip(content) : content;
//   const isVideo = article.section === 'video' && article.videoId;

//   return (
//     <div>
//       {article.imageUrl && !isVideo && (
//         <div className="w-full">
//           <img
//             src={article.imageUrl}
//             alt={article.title}
//             className="w-full object-cover"
//             style={{ height: 'clamp(320px, 55vw, 620px)' }}
//           />
//         </div>
//       )}

//       <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
//         <div className="grid gap-10 xl:grid-cols-[1fr,300px]">
//           <div>
//             <button
//               onClick={() => navigate(-1)}
//               className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-primary hover:text-primary"
//             >
//               <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
//               </svg>
//               Back
//             </button>

//             {isVideo && (
//               <div className="mb-8 aspect-video w-full overflow-hidden rounded-2xl shadow-lg">
//                 <iframe
//                   src={`https://www.youtube.com/embed/${article.videoId}?rel=0&modestbranding=1`}
//                   title={article.title}
//                   className="h-full w-full"
//                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                   allowFullScreen
//                 />
//               </div>
//             )}

//             <div className="text-xs font-bold uppercase tracking-[0.35em] text-accent">
//               {article.category || article.section || ''}
//             </div>

//             <h1 className="mt-4 text-3xl font-black leading-tight text-ink lg:text-4xl">
//               {article.title}
//             </h1>

//             {article.subtitle && (
//               <p className="mt-3 text-lg text-slate-600">{article.subtitle}</p>
//             )}

//             <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-400">
//               <span>By <span className="font-semibold text-slate-600">{article.author}</span></span>
//               <span>·</span>
//               <span>{article.date}</span>
//               {(article.region || article.subCategory) && (
//                 <>
//                   <span>·</span>
//                   <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
//                     {article.subCategory || article.region}
//                   </span>
//                 </>
//               )}
//             </div>

//             <hr className="my-8 border-slate-100" />

//             {content && (
//               contentIsHtml ? (
//                 <div className="prose-article" dangerouslySetInnerHTML={{ __html: safeContent }} />
//               ) : (
//                 <div className="prose-article whitespace-pre-wrap text-slate-700 leading-relaxed">{safeContent}</div>
//               )
//             )}

//             <HashtagBox hashtags={article.hashtags} />

//             {related.length > 0 && (
//               <div className="mt-16">
//                 <div className="mb-6 flex items-center gap-3">
//                   <div className="h-px flex-1 bg-slate-200" />
//                   <p className="text-xs font-bold uppercase tracking-widest text-accent">Related Articles</p>
//                   <div className="h-px flex-1 bg-slate-200" />
//                 </div>

//                 <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
//                   {related.map((rel: any) => {
//                     const relId = rel._id || rel.id || '';
//                     const isRelVideo = rel.section === 'video';
//                     const linkTo = isRelVideo ? `/video/${relId}` : `/article/${relId}`;

//                     return (
//                       <Link
//                         key={relId}
//                         to={linkTo}
//                         className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
//                       >
//                         {rel.imageUrl && (
//                           <div className="aspect-[4/3] overflow-hidden">
//                             <img
//                               src={rel.imageUrl}
//                               alt={rel.title}
//                               className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
//                             />
//                           </div>
//                         )}

//                         <div className="p-5">
//                           <div className="text-xs font-bold uppercase tracking-[0.3em] text-accent">
//                             {rel.category}
//                           </div>
//                           <h3 className="mt-2 line-clamp-2 text-base font-bold text-ink">{rel.title}</h3>
//                           <p className="mt-1 text-xs text-slate-400">{rel.author} · {rel.date}</p>
//                         </div>
//                       </Link>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>

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
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AdBanner } from '../components/AdBanner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function isHTML(str: string) {
  return /<[a-z][\s\S]*>/i.test(str) || /&lt;[a-z][\s\S]*&gt;/i.test(str);
}

function decodeAndStrip(html: string) {
  const ta = document.createElement('textarea');
  ta.innerHTML = html;
  const decoded = ta.value;
  return decoded
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/\s*data-[a-z-]+=["'][^"']*["']/gi, '')
    .replace(/\s*jsaction=["'][^"']*["']/gi, '')
    .replace(/\s*jscontroller=["'][^"']*["']/gi, '')
    .replace(/\s*jsname=["'][^"']*["']/gi, '')
    .replace(/\s*class=["'][^"']*["']/gi, '')
    .replace(/\s*style=["'][^"']*["']/gi, '');
}

function getKeywords(title: string): string[] {
  const stop = new Set([
    'the','a','an','and','or','of','in','on','at','to','for','with','by','from',
    'is','are','was','were','how','what','why','when','who','that','this','has','have','its','their'
  ]);

  return title.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stop.has(w));
}

function HashtagBox({ hashtags }: { hashtags?: string[] }) {
  if (!Array.isArray(hashtags) || hashtags.length === 0) return null;

  return (
    <div className="mt-10 rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <div className="px-6 pt-6">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-slate-500">
          Hashtags
        </p>
      </div>

      <div className="p-6 pt-5">
        <div className="flex flex-wrap gap-3">
          {hashtags.map((tag, index) => {
            const isRed = index % 2 === 0;

            return (
              <span
                key={`${tag}-${index}`}
                className={
                  isRed
                    ? 'inline-flex items-center rounded-full border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-red-50 transition hover:-translate-y-0.5 hover:bg-red-50'
                    : 'inline-flex items-center rounded-full border border-primary/20 bg-white px-4 py-2.5 text-sm font-semibold text-primary shadow-sm ring-1 ring-primary/5 transition hover:-translate-y-0.5 hover:bg-primary/5'
                }
              >
                <span className="mr-1.5 text-[15px]">#</span>
                {tag}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setArticle(null);
    setRelated([]);
    setNotFound(false);

    const tryFetch = async () => {
      let art: any = null;
      let source = '';

      try {
        const r = await fetch(`${API_URL}/region-articles/${id}`);
        if (r.ok) {
          art = await r.json();
          source = 'region';
        }
      } catch {}

      if (!art) {
        try {
          const r = await fetch(`${API_URL}/section-articles/${id}`);
          if (r.ok) {
            art = await r.json();
            source = 'section';
          }
        } catch {}
      }

      if (!art) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setArticle(art);

      try {
        const keywords = getKeywords(art.title || '');
        let allArticles: any[] = [];

        if (source === 'region') {
          const r = await fetch(`${API_URL}/region-articles/region/${art.region}`);
          if (r.ok) allArticles = await r.json();
        } else {
          const r = await fetch(`${API_URL}/section-articles/section/${art.section}`);
          if (r.ok) allArticles = await r.json();
        }

        const scored = allArticles
          .filter((a: any) => (a._id || a.id) !== id && a.isActive !== false)
          .map((a: any) => ({
            ...a,
            _score: getKeywords(a.title || '').filter((kw) => keywords.includes(kw)).length,
          }))
          .sort((a: any, b: any) => b._score - a._score)
          .slice(0, 3);

        if (scored.length < 2) {
          const existing = new Set(scored.map((a: any) => a._id));
          const extras = allArticles
            .filter((a: any) => (a._id || a.id) !== id && !existing.has(a._id))
            .slice(0, 3 - scored.length);
          setRelated([...scored, ...extras]);
        } else {
          setRelated(scored);
        }
      } catch {}

      setLoading(false);
    };

    tryFetch();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-2xl font-bold text-ink">Article not found</p>
        <button
          onClick={() => navigate(-1)}
          className="rounded-full bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary/90"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  const content = article.content || '';
  const contentIsHtml = isHTML(content);
  const safeContent = contentIsHtml ? decodeAndStrip(content) : content;
  const isVideo = article.section === 'video' && article.videoId;

  return (
    <div>
      {article.imageUrl && !isVideo && (
        <div className="w-full">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full object-cover"
            style={{ height: 'clamp(320px, 55vw, 620px)' }}
          />
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <div className="grid gap-10 xl:grid-cols-[1fr,300px]">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-primary hover:text-primary"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Back
            </button>

            {isVideo && (
              <div className="mb-8 aspect-video w-full overflow-hidden rounded-2xl shadow-lg">
                <iframe
                  src={`https://www.youtube.com/embed/${article.videoId}?rel=0&modestbranding=1`}
                  title={article.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            <div className="text-xs font-bold uppercase tracking-[0.35em] text-accent">
              {article.category || article.section || ''}
            </div>

            <h1 className="mt-4 text-3xl font-black leading-tight text-ink lg:text-4xl">
              {article.title}
            </h1>

            {article.subtitle && (
              <p className="mt-3 text-lg text-slate-600">{article.subtitle}</p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-400">
              <span>By <span className="font-semibold text-slate-600">{article.author}</span></span>
              <span>·</span>
              <span>{article.date}</span>
              {(article.region || article.subCategory) && (
                <>
                  <span>·</span>
                  <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                    {article.subCategory || article.region}
                  </span>
                </>
              )}
            </div>

            <hr className="my-8 border-slate-100" />

            {content && (
              contentIsHtml ? (
                <div className="prose-article" dangerouslySetInnerHTML={{ __html: safeContent }} />
              ) : (
                <div className="prose-article whitespace-pre-wrap text-slate-700 leading-relaxed">{safeContent}</div>
              )
            )}

            <HashtagBox hashtags={article.hashtags} />

            {related.length > 0 && (
              <div className="mt-16">
                <div className="mb-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-200" />
                  <p className="text-xs font-bold uppercase tracking-widest text-accent">Related Articles</p>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {related.map((rel: any) => {
                    const relId = rel._id || rel.id || '';
                    const isRelVideo = rel.section === 'video';
                    const linkTo = isRelVideo ? `/video/${relId}` : `/article/${relId}`;

                    return (
                      <Link
                        key={relId}
                        to={linkTo}
                        className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
                      >
                        {rel.imageUrl && (
                          <div className="aspect-[4/3] overflow-hidden">
                            <img
                              src={rel.imageUrl}
                              alt={rel.title}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                          </div>
                        )}

                        <div className="p-5">
                          <div className="text-xs font-bold uppercase tracking-[0.3em] text-accent">
                            {rel.category}
                          </div>
                          <h3 className="mt-2 line-clamp-2 text-base font-bold text-ink">{rel.title}</h3>
                          <p className="mt-1 text-xs text-slate-400">{rel.author} · {rel.date}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
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
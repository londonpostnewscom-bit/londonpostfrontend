// import { useEffect, useState } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import { AdBanner } from '../components/AdBanner';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// function getThumb(videoId: string) {
//   return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
// }

// function isHTML(str: string) {
//   return /<[a-z][\s\S]*>/i.test(str);
// }

// // Shared keywords for related video matching
// function getKeywords(title: string): string[] {
//   const stopWords = new Set(['the','a','an','and','or','of','in','on','at','to','for','with','by','from','is','are','was','were','how','what','why','when','who','that','this','these','those','has','have','had','will','would','could','should']);
//   return title.toLowerCase()
//     .replace(/[^a-z0-9\s]/g, '')
//     .split(/\s+/)
//     .filter((w) => w.length > 3 && !stopWords.has(w));
// }

// export function VideoDetailPage() {
//   const { id } = useParams<{ id: string }>();
//   const [article,  setArticle]  = useState<any>(null);
//   const [related,  setRelated]  = useState<any[]>([]);
//   const [loading,  setLoading]  = useState(true);
//   const [notFound, setNotFound] = useState(false);

//   useEffect(() => {
//     if (!id) return;
//     setLoading(true);

//     Promise.all([
//       fetch(`${API_URL}/section-articles/${id}`).then((r) => r.ok ? r.json() : null),
//       fetch(`${API_URL}/section-articles/section/video`).then((r) => r.ok ? r.json() : []),
//     ]).then(([art, allVideos]) => {
//       if (!art) { setNotFound(true); setLoading(false); return; }
//       setArticle(art);

//       // Related: match by keywords in title
//       const keywords = getKeywords(art.title);
//       const scored = allVideos
//         .filter((v: any) => v._id !== art._id && v.isActive)
//         .map((v: any) => ({
//           ...v,
//           score: getKeywords(v.title).filter((kw) => keywords.includes(kw)).length,
//         }))
//         .filter((v: any) => v.score > 0)
//         .sort((a: any, b: any) => b.score - a.score)
//         .slice(0, 3);

//       // If not enough keyword matches, fill with recent videos
//       if (scored.length < 3) {
//         const existing = new Set(scored.map((v: any) => v._id));
//         const extras = allVideos
//           .filter((v: any) => v._id !== art._id && v.isActive && !existing.has(v._id))
//           .slice(0, 3 - scored.length);
//         setRelated([...scored, ...extras]);
//       } else {
//         setRelated(scored);
//       }
//       setLoading(false);
//     }).catch(() => { setNotFound(true); setLoading(false); });
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-slate-950">
//         <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
//       </div>
//     );
//   }

//   if (notFound || !article) {
//     return (
//       <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 text-white">
//         <p className="text-2xl font-bold">Video not found</p>
//         <Link to="/section/video" className="rounded-full bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700">
//           ← Back to Videos
//         </Link>
//       </div>
//     );
//   }

//   const contentIsHtml = isHTML(article.content || '');

//   return (
//     <div className="min-h-screen bg-slate-950 text-white">

//       {/* Video Embed */}
//       {article.videoId && (
//         <div className="relative w-full bg-black">
//           <div className="mx-auto max-w-5xl">
//             <div className="aspect-video w-full">
//               <iframe
//                 src={`https://www.youtube.com/embed/${article.videoId}?rel=0&modestbranding=1`}
//                 title={article.title}
//                 className="h-full w-full"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 allowFullScreen
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Content */}
//       <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
//         <div className="grid gap-10 xl:grid-cols-[1fr,300px]">
//           <div>
//             {/* Back link */}
//             <Link to="/section/video" className="inline-flex items-center gap-2 rounded-full border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-red-500 hover:text-white transition mb-6">
//               <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
//               </svg>
//               Back to Videos
//             </Link>

//             {/* Article header */}
//             <span className="inline-block rounded-full bg-red-600/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-red-400">
//               {article.category || 'Video'}
//             </span>
//             <h1 className="mt-4 text-3xl font-black leading-tight text-white lg:text-4xl">{article.title}</h1>
//             {article.subtitle && <p className="mt-3 text-lg text-slate-300">{article.subtitle}</p>}
//             <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-400">
//               <span>By <span className="font-semibold text-slate-200">{article.author}</span></span>
//               <span>·</span>
//               <span>{article.date}</span>
//             </div>

//             <hr className="my-8 border-slate-700" />

//             {/* Content */}
//             {article.content && (
//               contentIsHtml ? (
//                 <div
//                   className="prose-article text-slate-300 [&_h2]:text-white [&_h3]:text-white [&_b]:text-white [&_strong]:text-white [&_li]:text-slate-300"
//                   dangerouslySetInnerHTML={{ __html: article.content }}
//                 />
//               ) : (
//                 <p className="whitespace-pre-wrap text-slate-300 leading-relaxed">{article.content}</p>
//               )
//             )}

//             {/* Related Videos */}
//             {related.length > 0 && (
//               <div className="mt-14">
//                 <div className="mb-6 flex items-center gap-3">
//                   <div className="h-px flex-1 bg-slate-700" />
//                   <p className="text-xs font-bold uppercase tracking-widest text-red-400">Related Videos</p>
//                   <div className="h-px flex-1 bg-slate-700" />
//                 </div>
//                 <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
//                   {related.map((v: any) => (
//                     <Link
//                       key={v._id}
//                       to={`/video/${v._id}`}
//                       className="group overflow-hidden rounded-2xl bg-slate-800 transition hover:-translate-y-1 hover:bg-slate-700"
//                     >
//                       <div className="relative aspect-video overflow-hidden">
//                         <img
//                           src={v.imageUrl || getThumb(v.videoId)}
//                           alt={v.title}
//                           className="h-full w-full object-cover transition group-hover:scale-105"
//                         />
//                         <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition">
//                           <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600">
//                             <svg className="h-4 w-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="p-4">
//                         <h3 className="line-clamp-2 text-sm font-bold text-white">{v.title}</h3>
//                         <p className="mt-1 text-xs text-slate-400">{v.author} · {v.date}</p>
//                       </div>
//                     </Link>
//                   ))}
//                 </div>
//               </div>
//             )}
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
import { Link, useParams } from 'react-router-dom';
import { AdBanner } from '../components/AdBanner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getThumb(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

function isHTML(str: string) {
  return /<[a-z][\s\S]*>/i.test(str);
}

function getKeywords(title: string): string[] {
  const stopWords = new Set(['the','a','an','and','or','of','in','on','at','to','for','with','by','from','is','are','was','were','how','what','why','when','who','that','this','these','those','has','have','had','will','would','could','should']);
  return title.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopWords.has(w));
}

function HashtagBox({ hashtags }: { hashtags?: string[] }) {
  if (!Array.isArray(hashtags) || hashtags.length === 0) return null;

  return (
    <div className="mt-10 rounded-[1.5rem] border border-slate-700 bg-slate-900/70 p-5">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Hashtags</p>
      <div className="mt-4 flex flex-wrap gap-2.5">
        {hashtags.map((tag) => (
          <span
            key={tag}
            className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-200"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export function VideoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [article,  setArticle]  = useState<any>(null);
  const [related,  setRelated]  = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    Promise.all([
      fetch(`${API_URL}/section-articles/${id}`).then((r) => r.ok ? r.json() : null),
      fetch(`${API_URL}/section-articles/section/video`).then((r) => r.ok ? r.json() : []),
    ]).then(([art, allVideos]) => {
      if (!art) { setNotFound(true); setLoading(false); return; }
      setArticle(art);

      const keywords = getKeywords(art.title);
      const scored = allVideos
        .filter((v: any) => v._id !== art._id && v.isActive)
        .map((v: any) => ({
          ...v,
          score: getKeywords(v.title).filter((kw) => keywords.includes(kw)).length,
        }))
        .filter((v: any) => v.score > 0)
        .sort((a: any, b: any) => b.score - a.score)
        .slice(0, 3);

      if (scored.length < 3) {
        const existing = new Set(scored.map((v: any) => v._id));
        const extras = allVideos
          .filter((v: any) => v._id !== art._id && v.isActive && !existing.has(v._id))
          .slice(0, 3 - scored.length);
        setRelated([...scored, ...extras]);
      } else {
        setRelated(scored);
      }

      setLoading(false);
    }).catch(() => {
      setNotFound(true);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 text-white">
        <p className="text-2xl font-bold">Video not found</p>
        <Link to="/section/video" className="rounded-full bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700">
          ← Back to Videos
        </Link>
      </div>
    );
  }

  const contentIsHtml = isHTML(article.content || '');

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {article.videoId && (
        <div className="relative w-full bg-black">
          <div className="mx-auto max-w-5xl">
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${article.videoId}?rel=0&modestbranding=1`}
                title={article.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <div className="grid gap-10 xl:grid-cols-[1fr,300px]">
          <div>
            <Link to="/section/video" className="inline-flex items-center gap-2 rounded-full border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-red-500 hover:text-white transition mb-6">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Back to Videos
            </Link>

            <span className="inline-block rounded-full bg-red-600/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-red-400">
              {article.category || 'Video'}
            </span>

            <h1 className="mt-4 text-3xl font-black leading-tight text-white lg:text-4xl">{article.title}</h1>

            {article.subtitle && <p className="mt-3 text-lg text-slate-300">{article.subtitle}</p>}

            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-400">
              <span>By <span className="font-semibold text-slate-200">{article.author}</span></span>
              <span>·</span>
              <span>{article.date}</span>
            </div>

            <hr className="my-8 border-slate-700" />

            {article.content && (
              contentIsHtml ? (
                <div
                  className="prose-article text-slate-300 [&_h2]:text-white [&_h3]:text-white [&_b]:text-white [&_strong]:text-white [&_li]:text-slate-300"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              ) : (
                <p className="whitespace-pre-wrap text-slate-300 leading-relaxed">{article.content}</p>
              )
            )}

            <HashtagBox hashtags={article.hashtags} />

            {related.length > 0 && (
              <div className="mt-14">
                <div className="mb-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-700" />
                  <p className="text-xs font-bold uppercase tracking-widest text-red-400">Related Videos</p>
                  <div className="h-px flex-1 bg-slate-700" />
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((v: any) => (
                    <Link
                      key={v._id}
                      to={`/video/${v._id}`}
                      className="group overflow-hidden rounded-2xl bg-slate-800 transition hover:-translate-y-1 hover:bg-slate-700"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={v.imageUrl || getThumb(v.videoId)}
                          alt={v.title}
                          className="h-full w-full object-cover transition group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600">
                            <svg className="h-4 w-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                          </div>
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="line-clamp-2 text-sm font-bold text-white">{v.title}</h3>
                        <p className="mt-1 text-xs text-slate-400">{v.author} · {v.date}</p>
                      </div>
                    </Link>
                  ))}
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
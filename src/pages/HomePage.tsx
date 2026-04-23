
// // import { useMemo, useRef, useState, useEffect } from 'react';
// // import { AdBanner } from '../components/AdBanner';
// // import { ArticleCard } from '../components/ArticleCard';
// // import { ArticleReader } from '../components/ArticleReader';
// // import { CompactArticleCard } from '../components/CompactArticleCard';
// // import { Hero } from '../components/Hero';
// // import { SectionHeading } from '../components/SectionHeading';
// // import { Article, articles as staticArticles } from '../data/siteData';

// // const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// // function regionApiToArticle(a: any): Article {
// //   return {
// //     id: a._id || a.id || '',
// //     title: a.title || '',
// //     subtitle: a.subtitle || '',
// //     content: a.content || '',
// //     image: a.imageUrl || a.image || '',
// //     author: a.author || '',
// //     date: a.date || '',
// //     category: a.category || '',
// //     region: a.region || '',
// //     featured: a.isFeatured || a.featured || false,
// //     topic: a.category || '',
// //   };
// // }

// // async function fetchHomeSection(section: string): Promise<Article[]> {
// //   try {
// //     const r = await fetch(`${API_URL}/region-articles/home-section/${section}`);
// //     if (!r.ok) return [];
// //     return (await r.json()).map(regionApiToArticle);
// //   } catch {
// //     return [];
// //   }
// // }

// // async function fetchSectionHome(section: string): Promise<Article[]> {
// //   try {
// //     const r = await fetch(`${API_URL}/section-articles/home/${section}`);
// //     if (!r.ok) return [];
// //     return (await r.json()).map(regionApiToArticle);
// //   } catch {
// //     return [];
// //   }
// // }

// // export function HomePage() {
// //   const [selected, setSelected] = useState<Article | null>(null);
// //   const readerRef = useRef<HTMLDivElement | null>(null);

// //   // Static fallbacks
// //   const staticUK = useMemo(
// //     () => staticArticles.filter((a) => a.region === 'United Kingdom').slice(0, 4),
// //     [],
// //   );

// //   const staticEditorsPicks = useMemo(
// //     () => staticArticles.filter((a) => a.featured).slice(0, 4),
// //     [],
// //   );

// //   const staticInFocus = useMemo(
// //     () =>
// //       staticArticles
// //         .filter((a) => a.category === 'Analysis' || a.category === 'Diplomacy')
// //         .slice(0, 4),
// //     [],
// //   );

// //   const staticInterviews = useMemo(
// //     () =>
// //       staticArticles
// //         .filter((a) => a.category === 'Interviews' || a.topic === 'Interviews')
// //         .slice(0, 4),
// //     [],
// //   );

// //   // API data
// //   const [ukArticles, setUkArticles] = useState<Article[]>([]);
// //   const [editorsPicksArticles, setEditorsPicksArticles] = useState<Article[]>([]);
// //   const [inFocusArticles, setInFocusArticles] = useState<Article[]>([]);
// //   const [interviewArticles, setInterviewArticles] = useState<Article[]>([]);

// //   useEffect(() => {
// //     Promise.all([
// //       fetchHomeSection('uk'),
// //       fetchHomeSection('editors-picks'),
// //       fetchHomeSection('in-focus'),
// //       fetchSectionHome('interviews'),
// //     ]).then(([uk, ep, inf, interviews]) => {
// //       if (uk.length) setUkArticles(uk);
// //       if (ep.length) setEditorsPicksArticles(ep);
// //       if (inf.length) setInFocusArticles(inf);
// //       if (interviews.length) setInterviewArticles(interviews);
// //     });
// //   }, []);

// //   const displayUK = ukArticles.length ? ukArticles : staticUK;
// //   const displayEditorsPicks = editorsPicksArticles.length
// //     ? editorsPicksArticles
// //     : staticEditorsPicks;
// //   const displayInFocus = inFocusArticles.length ? inFocusArticles : staticInFocus;
// //   const displayInterviews = interviewArticles.length
// //     ? interviewArticles
// //     : staticInterviews;

// //   // Editor's Picks layout: 1 big left + 3 compact right
// //   const featuredEditorsPick = displayEditorsPicks[0] || null;
// //   const sideEditorsPicks = displayEditorsPicks.slice(1, 4);

// //   const openArticle = (article: Article) => {
// //     setSelected(article);
// //     setTimeout(() => {
// //       readerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
// //     }, 60);
// //   };

// //   return (
// //     <div>
// //       <Hero />

// //       {/* Banner 1 */}
// //       <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
// //         <AdBanner identifier="homepage-banner-1" />
// //       </section>

// //       {/* United Kingdom - styled like Hot Topics */}
// //       {displayUK.length > 0 && (
// //         <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
// //           <SectionHeading
// //             eyebrow="UK Coverage"
// //             title="United Kingdom"
// //             description="Latest analysis, policy coverage and reporting from the United Kingdom."
// //           />

// //           <div className="grid gap-6 lg:grid-cols-[1fr,1fr,320px]">
// //             <div className="grid gap-6 md:grid-cols-2 lg:col-span-2">
// //               {displayUK.map((article) => (
// //                 <div
// //                   key={article.id}
// //                   className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white"
// //                 >
// //                   <img
// //                     src={article.image}
// //                     alt={article.title}
// //                     className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
// //                   />

// //                   <div className="p-6">
// //                     <div className="text-xs font-bold uppercase tracking-[0.35em] text-accent">
// //                       {article.topic || article.category || 'UK Coverage'}
// //                     </div>

// //                     <h3 className="mt-3 text-2xl font-bold text-ink">
// //                       {article.title}
// //                     </h3>

// //                     <p className="mt-2 text-slate-600">{article.subtitle}</p>

// //                     <button
// //                       onClick={() => openArticle(article)}
// //                       className="mt-5 rounded-full border border-primary px-5 py-2.5 font-semibold text-primary transition hover:bg-primary hover:text-white"
// //                     >
// //                       Read More
// //                     </button>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>

// //             <AdBanner vertical identifier="homepage-banner-2" />
// //           </div>
// //         </section>
// //       )}

// //       {/* Editor's Picks - styled like Latest Headlines */}
// //     {/* Editor's Picks - styled like Latest Headlines */}
// // {displayEditorsPicks.length > 0 && featuredEditorsPick && (
// //   <section className="bg-soft py-16">
// //     <div className="mx-auto max-w-7xl px-4 lg:px-6">
// //       <SectionHeading
// //         eyebrow="Editorial"
// //         title="Editor's Picks"
// //         description="Hand-selected stories from our editorial team — the most important reads this week."
// //       />

// //       <div className="grid gap-6 xl:grid-cols-[1.35fr,1fr]">
// //         <ArticleCard
// //           article={featuredEditorsPick}
// //           onReadMore={openArticle}
// //         />

// //         {/* Right column — 3 horizontal cards */}
// //         <div className="flex flex-col gap-4">
// //           {sideEditorsPicks.map((article) => (
// //             <div
// //               key={article.id}
// //               className="flex gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
// //             >
// //               <img
// //                 src={article.image}
// //                 alt={article.title}
// //                 className="h-28 w-32 flex-shrink-0 rounded-xl object-cover"
// //               />
// //               <div className="flex min-w-0 flex-col justify-between py-0.5">
// //                 <div>
// //                   <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent">
// //                     {article.category}
// //                   </div>
// //                   <h3 className="mt-1.5 line-clamp-2 text-base font-bold leading-snug text-ink">
// //                     {article.title}
// //                   </h3>
// //                   <p className="mt-1.5 text-xs text-slate-400">
// //                     {article.author} · {article.date}
// //                   </p>
// //                 </div>
// //                 <button
// //                   onClick={() => openArticle(article)}
// //                   className="mt-2 self-start text-sm font-semibold text-primary hover:underline"
// //                 >
// //                   Read More →
// //                 </button>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //       <div className="my-10 grid gap-6 lg:grid-cols-2">
// //         <AdBanner identifier="homepage-banner-3" />
// //         <AdBanner identifier="homepage-banner-4" />
// //       </div>
// //     </div>
// //   </section>
// // )}
// //       {/* In Focus - styled like Trending News */}
// //       {displayInFocus.length > 0 && (
// //         <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
// //           <SectionHeading
// //             eyebrow="Analysis"
// //             title="In Focus"
// //             description="Deep dives and long-form analysis on the stories that demand closer attention."
// //           />

// //           <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
// //             {displayInFocus.map((article) => (
// //               <ArticleCard
// //                 key={article.id}
// //                 article={article}
// //                 onReadMore={openArticle}
// //               />
// //             ))}
// //           </div>
// //         </section>
// //       )}

// //       {/* Interviews */}
// //       {displayInterviews.length > 0 && (
// //         <section className="bg-slate-900 py-16">
// //           <div className="mx-auto max-w-7xl px-4 lg:px-6">
// //             <div className="mb-10 text-center">
// //               <span className="inline-block rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">
// //                 Conversations
// //               </span>
// //               <h2 className="mt-3 text-3xl font-black text-white">Interviews</h2>
// //               <p className="mx-auto mt-3 max-w-xl text-slate-400">
// //                 In-depth conversations with policymakers, analysts and global voices.
// //               </p>
// //             </div>

// //             <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
// //               {displayInterviews.map((article) => (
// //                 <div
// //                   key={article.id}
// //                   className="group relative cursor-pointer overflow-hidden rounded-[1.75rem]"
// //                   onClick={() => openArticle(article)}
// //                 >
// //                   <div className="aspect-[3/4] overflow-hidden">
// //                     <img
// //                       src={article.image}
// //                       alt={article.title}
// //                       className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
// //                     />
// //                   </div>

// //                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

// //                   <div className="absolute bottom-0 left-0 right-0 p-5">
// //                     <span className="inline-block rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-semibold text-accent">
// //                       Interview
// //                     </span>

// //                     <h3 className="mt-2 line-clamp-3 text-sm font-bold leading-snug text-white">
// //                       {article.title}
// //                     </h3>

// //                     <p className="mt-2 text-xs text-white/50">
// //                       {article.author} · {article.date}
// //                     </p>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </section>
// //       )}

// //       {/* Article Reader */}
// //       <section ref={readerRef} className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
// //         <SectionHeading
// //           eyebrow="Reading Experience"
// //           title="Read the full story without leaving the page"
// //           description="Click Read More on any article above and the full story opens here."
// //         />
// //         <ArticleReader article={selected} />
// //       </section>
// //     </div>
// //   );
// // }






// import { useEffect, useMemo, useRef, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { AdBanner } from '../components/AdBanner';
// import { ArticleCard } from '../components/ArticleCard';
// import { ArticleReader } from '../components/ArticleReader';
// import { CompactArticleCard } from '../components/CompactArticleCard';
// import { Hero } from '../components/Hero';
// import { SectionHeading } from '../components/SectionHeading';
// import { Article, articles as staticArticles } from '../data/siteData';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// function toArticle(a: any): Article {
//   return {
//     id:       a._id || a.id || '',
//     title:    a.title || '',
//     subtitle: a.subtitle || '',
//     content:  a.content || '',
//     image:    a.imageUrl || a.image || '',
//     author:   a.author || '',
//     date:     a.date || '',
//     category: a.category || '',
//     region:   a.region || '',
//     featured: a.isFeatured || a.featured || false,
//     topic:    a.category || '',
//   };
// }

// async function fetchRegionHome(section: string): Promise<Article[]> {
//   try {
//     const r = await fetch(`${API_URL}/region-articles/home-section/${section}`);
//     return r.ok ? (await r.json()).map(toArticle) : [];
//   } catch { return []; }
// }

// async function fetchSectionHome(section: string): Promise<any[]> {
//   try {
//     const r = await fetch(`${API_URL}/section-articles/home/${section}`);
//     if (!r.ok) return [];
//     const data = await r.json();
//     return section === 'video' ? data : data.map(toArticle);
//   } catch { return []; }
// }

// async function fetchSectionHomeTarget(target: string): Promise<Article[]> {
//   try {
//     const r = await fetch(`${API_URL}/section-articles/home-target/${target}`);
//     return r.ok ? (await r.json()).map(toArticle) : [];
//   } catch { return []; }
// }

// function getYtThumb(videoId: string) {
//   return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
// }

// export function HomePage() {
//   const [selected, setSelected] = useState<Article | null>(null);
//   const readerRef = useRef<HTMLDivElement | null>(null);

//   // Static fallbacks
//   const staticUK      = useMemo(() => staticArticles.filter((a) => a.region === 'United Kingdom').slice(0, 4), []);
//   const staticEdPick  = useMemo(() => staticArticles.filter((a) => a.featured).slice(0, 4), []);
//   const staticFocus   = useMemo(() => staticArticles.filter((a) => ['Analysis', 'Diplomacy'].includes(a.category)).slice(0, 4), []);
//   const staticIntvw   = useMemo(() => staticArticles.filter((a) => a.category === 'Interviews' || a.topic === 'Interviews').slice(0, 4), []);

//   const [ukArticles,     setUkArticles]     = useState<Article[]>([]);
//   const [edPick,         setEdPick]         = useState<Article[]>([]);
//   const [inFocus,        setInFocus]        = useState<Article[]>([]);
//   const [interviews,     setInterviews]     = useState<Article[]>([]);
//   const [videoArticles,  setVideoArticles]  = useState<any[]>([]);
//   const [opinionArticles, setOpinionArticles] = useState<Article[]>([]);

//   useEffect(() => {
//     Promise.all([
//       // Region-based home sections + section-article contributions
//       Promise.all([fetchRegionHome('uk'), fetchSectionHomeTarget('uk')]).then(([r, s]) => [...r, ...s].slice(0, 4)),
//       Promise.all([fetchRegionHome('editors-picks'), fetchSectionHomeTarget('editors-picks')]).then(([r, s]) => [...r, ...s].slice(0, 4)),
//       Promise.all([fetchRegionHome('in-focus'), fetchSectionHomeTarget('in-focus')]).then(([r, s]) => [...r, ...s].slice(0, 4)),
//       fetchSectionHome('interviews'),
//       fetchSectionHome('video'),
//       fetchSectionHome('opinion'),
//     ]).then(([uk, ep, inf, intv, vid, op]) => {
//       if (uk.length)   setUkArticles(uk);
//       if (ep.length)   setEdPick(ep);
//       if (inf.length)  setInFocus(inf);
//       if (intv.length) setInterviews(intv);
//       if (vid.length)  setVideoArticles(vid);
//       if (op.length)   setOpinionArticles(op);
//     });
//   }, []);

//   const displayUK       = ukArticles.length      ? ukArticles      : staticUK;
//   const displayEdPick   = edPick.length           ? edPick          : staticEdPick;
//   const displayInFocus  = inFocus.length          ? inFocus         : staticFocus;
//   const displayIntvw    = interviews.length       ? interviews      : staticIntvw;
//   const displayVideos   = videoArticles;
//   const displayOpinion  = opinionArticles;

//   const featuredEditorsPick = displayEdPick[0] || null;
//   const sideEditorsPicks    = displayEdPick.slice(1, 4);

//   const openArticle = (article: Article) => {
//     setSelected(article);
//     setTimeout(() => readerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
//   };

//   return (
//     <div>
//       <Hero />

//       {/* Banner 1 */}
//       <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
//         <AdBanner identifier="homepage-banner-1" />
//       </section>

//       {/* United Kingdom */}
//       {displayUK.length > 0 && (
//         <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
//           <SectionHeading eyebrow="UK Coverage" title="United Kingdom"
//             description="Latest analysis, policy coverage and reporting from the United Kingdom." />
//           <div className="grid gap-6 lg:grid-cols-[1fr,1fr,320px]">
//             <div className="grid gap-6 md:grid-cols-2 lg:col-span-2">
//               {displayUK.map((article) => (
//                 <div key={article.id} className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white">
//                   <img src={article.image} alt={article.title} className="h-64 w-full object-cover transition duration-500 group-hover:scale-105" />
//                   <div className="p-6">
//                     <div className="text-xs font-bold uppercase tracking-[0.35em] text-accent">{article.topic || article.category || 'UK Coverage'}</div>
//                     <h3 className="mt-3 text-2xl font-bold text-ink">{article.title}</h3>
//                     <p className="mt-2 text-slate-600">{article.subtitle}</p>
//                     <button onClick={() => openArticle(article)} className="mt-5 rounded-full border border-primary px-5 py-2.5 font-semibold text-primary transition hover:bg-primary hover:text-white">
//                       Read More
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <AdBanner vertical identifier="homepage-banner-2" />
//           </div>
//         </section>
//       )}

//       {/* Editor's Picks */}
//       {displayEdPick.length > 0 && featuredEditorsPick && (
//         <section className="bg-soft py-16">
//           <div className="mx-auto max-w-7xl px-4 lg:px-6">
//             <SectionHeading eyebrow="Editorial" title="Editor's Picks"
//               description="Hand-selected stories from our editorial team — the most important reads this week." />
//             <div className="grid gap-6 xl:grid-cols-[1.35fr,1fr]">
//               <ArticleCard article={featuredEditorsPick} onReadMore={openArticle} />
//               <div className="flex flex-col gap-4">
//                 {sideEditorsPicks.map((article) => (
//                   <div key={article.id} className="flex gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
//                     <img src={article.image} alt={article.title} className="h-28 w-32 flex-shrink-0 rounded-xl object-cover" />
//                     <div className="flex min-w-0 flex-col justify-between py-0.5">
//                       <div>
//                         <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent">{article.category}</div>
//                         <h3 className="mt-1.5 line-clamp-2 text-base font-bold leading-snug text-ink">{article.title}</h3>
//                         <p className="mt-1.5 text-xs text-slate-400">{article.author} · {article.date}</p>
//                       </div>
//                       <button onClick={() => openArticle(article)} className="mt-2 self-start text-sm font-semibold text-primary hover:underline">Read More →</button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="my-10 grid gap-6 lg:grid-cols-2">
//               <AdBanner identifier="homepage-banner-3" />
//               <AdBanner identifier="homepage-banner-4" />
//             </div>
//           </div>
//         </section>
//       )}

//       {/* In Focus */}
//       {displayInFocus.length > 0 && (
//         <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
//           <SectionHeading eyebrow="Analysis" title="In Focus"
//             description="Deep dives and long-form analysis on the stories that demand closer attention." />
//           <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
//             {displayInFocus.map((article) => <ArticleCard key={article.id} article={article} onReadMore={openArticle} />)}
//           </div>
//         </section>
//       )}

//       {/* Interviews */}
//       {displayIntvw.length > 0 && (
//         <section className="bg-slate-900 py-16">
//           <div className="mx-auto max-w-7xl px-4 lg:px-6">
//             <div className="mb-10 text-center">
//               <span className="inline-block rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">Conversations</span>
//               <h2 className="mt-3 text-3xl font-black text-white">Interviews</h2>
//               <p className="mx-auto mt-3 max-w-xl text-slate-400">In-depth conversations with policymakers, analysts and global voices.</p>
//             </div>
//             <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
//               {displayIntvw.map((article) => (
//                 <div key={article.id} className="group relative cursor-pointer overflow-hidden rounded-[1.75rem]" onClick={() => openArticle(article)}>
//                   <div className="aspect-[3/4] overflow-hidden">
//                     <img src={article.image} alt={article.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
//                   </div>
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
//                   <div className="absolute bottom-0 left-0 right-0 p-5">
//                     <span className="inline-block rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-semibold text-accent">Interview</span>
//                     <h3 className="mt-2 line-clamp-3 text-sm font-bold leading-snug text-white">{article.title}</h3>
//                     <p className="mt-2 text-xs text-white/50">{article.author} · {article.date}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Video Section */}
//       {displayVideos.length > 0 && (
//         <section className="bg-slate-950 py-16">
//           <div className="mx-auto max-w-7xl px-4 lg:px-6">
//             <div className="mb-8 flex items-end justify-between">
//               <div>
//                 <span className="inline-block rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">▶ Video</span>
//                 <h2 className="mt-3 text-3xl font-black text-white">Watch & Learn</h2>
//                 <p className="mt-2 text-slate-400">Video reports, documentary clips and analysis from our global team.</p>
//               </div>
//               <Link to="/section/video" className="hidden rounded-full border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-red-500 hover:text-white transition sm:block">
//                 All Videos →
//               </Link>
//             </div>
//             <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
//             {displayVideos.map((article: any) => {
//   // article is raw here — use imageUrl and videoId directly
//   const thumb = article.imageUrl
//     ? article.imageUrl
//     : article.videoId
//       ? getYtThumb(article.videoId)
//       : '';
//   const articleId = article._id || article.id || '';

//   return (
//     <Link
//       key={articleId}
//       to={`/video/${articleId}`}
//       className="group overflow-hidden rounded-2xl bg-slate-800 transition hover:-translate-y-1 hover:bg-slate-700"
//     >
//       <div className="relative aspect-video overflow-hidden">
//         {thumb && (
//           <img
//             src={thumb}
//             alt={article.title}
//             className="h-full w-full object-cover transition group-hover:scale-105"
//           />
//         )}
//         <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
//           <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 shadow-lg">
//             <svg className="h-5 w-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
//           </div>
//         </div>
//         <div className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600">
//           <svg className="h-3 w-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
//         </div>
//       </div>
//       <div className="p-4">
//         <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">{article.category}</span>
//         <h3 className="mt-1.5 line-clamp-2 text-sm font-bold text-white">{article.title}</h3>
//         <p className="mt-1 text-xs text-slate-400">{article.author} · {article.date}</p>
//       </div>
//     </Link>
//   );
// })}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Opinion Section */}
//       {displayOpinion.length > 0 && (
//         <section className="bg-amber-50 py-16">
//           <div className="mx-auto max-w-7xl px-4 lg:px-6">
//             <div className="mb-8 flex items-end justify-between">
//               <div>
//                 <span className="inline-block rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent">Opinion</span>
//                 <h2 className="mt-3 text-3xl font-black text-ink">Voices & Views</h2>
//                 <p className="mt-2 text-slate-600">Perspectives from analysts, contributors and thought leaders.</p>
//               </div>
//               <Link to="/section/opinion" className="hidden rounded-full border border-amber-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-amber-200 transition sm:block">
//                 All Opinions →
//               </Link>
//             </div>
//             <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
//               {displayOpinion.map((article) => (
//                 <div
//                   key={article.id}
//                   className="group cursor-pointer rounded-[1.75rem] border border-amber-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
//                   onClick={() => openArticle(article)}
//                 >
//                   <svg className="h-7 w-7 text-accent/40" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
//                   </svg>
//                   <span className="mt-3 inline-block text-[10px] font-bold uppercase tracking-widest text-accent">{article.category}</span>
//                   <h3 className="mt-2 line-clamp-3 text-base font-bold leading-snug text-ink">{article.title}</h3>
//                   <div className="mt-4 flex items-center gap-2 border-t border-amber-100 pt-4">
//                     <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary text-xs font-bold text-white">
//                       {article.author.charAt(0)}
//                     </div>
//                     <div className="min-w-0">
//                       <p className="truncate text-xs font-semibold text-ink">{article.author}</p>
//                       <p className="text-xs text-slate-400">{article.date}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Article Reader */}
//       <section ref={readerRef} className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
//         <SectionHeading eyebrow="Reading Experience" title="Read the full story without leaving the page"
//           description="Click Read More on any article above and the full story opens here." />
//         <ArticleReader article={selected} />
//       </section>
//     </div>
//   );
// }




// import { useEffect, useMemo, useRef, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { AdBanner } from '../components/AdBanner';
// import { ArticleCard } from '../components/ArticleCard';
// import { ArticleReader } from '../components/ArticleReader';
// import { CompactArticleCard } from '../components/CompactArticleCard';
// import { Hero } from '../components/Hero';
// import { SectionHeading } from '../components/SectionHeading';
// import { Article, articles as staticArticles } from '../data/siteData';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// function toArticle(a: any): Article {
//   return {
//     id:       a._id || a.id || '',
//     title:    a.title || '',
//     subtitle: a.subtitle || '',
//     content:  a.content || '',
//     image:    a.imageUrl || a.image || '',
//     author:   a.author || '',
//     date:     a.date || '',
//     category: a.category || '',
//     region:   a.region || '',
//     featured: a.isFeatured || a.featured || false,
//     topic:    a.category || '',
//   };
// }

// async function fetchRegionHome(section: string, limit = 4): Promise<Article[]> {
//   try {
//     const r = await fetch(`${API_URL}/region-articles/home-section/${section}?limit=${limit}`);
//     return r.ok ? (await r.json()).map(toArticle) : [];
//   } catch { return []; }
// }

// async function fetchSectionHome(section: string, limit = 4): Promise<any[]> {
//   try {
//     const r = await fetch(`${API_URL}/section-articles/home/${section}?limit=${limit}`);
//     if (!r.ok) return [];
//     const data = await r.json();
//     return section === 'video' ? data : data.map(toArticle);
//   } catch { return []; }
// }

// async function fetchSectionHomeTarget(target: string): Promise<Article[]> {
//   try {
//     const r = await fetch(`${API_URL}/section-articles/home-target/${target}`);
//     return r.ok ? (await r.json()).map(toArticle) : [];
//   } catch { return []; }
// }

// function getYtThumb(videoId: string) {
//   return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
// }

// // Arrow Carousel: shows 4 at a time with prev/next navigation
// function ArrowCarousel({
//   items,
//   renderCard,
// }: {
//   items: any[];
//   renderCard: (item: any) => React.ReactNode;
// }) {
//   const [page, setPage] = useState(0);
//   const perPage  = 4;
//   const maxPage  = Math.max(0, Math.ceil(items.length / perPage) - 1);
//   const shown    = items.slice(page * perPage, (page + 1) * perPage);

//   return (
//     <div>
//       <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
//         {shown.map((item, i) => <div key={i}>{renderCard(item)}</div>)}
//       </div>
//       {items.length > perPage && (
//         <div className="mt-8 flex items-center justify-center gap-4">
//           <button
//             onClick={() => setPage((p) => Math.max(0, p - 1))}
//             disabled={page === 0}
//             className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 text-xl text-slate-600 transition hover:border-primary hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
//           >
//             ←
//           </button>
//           <div className="flex gap-2">
//             {Array.from({ length: maxPage + 1 }).map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setPage(i)}
//                 className={`h-2.5 rounded-full transition-all ${i === page ? 'w-7 bg-primary' : 'w-2.5 bg-slate-300 hover:bg-slate-400'}`}
//               />
//             ))}
//           </div>
//           <button
//             onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
//             disabled={page === maxPage}
//             className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 text-xl text-slate-600 transition hover:border-primary hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
//           >
//             →
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export function HomePage() {
//   const navigate  = useNavigate();
//   const [selected, setSelected] = useState<Article | null>(null);
//   const readerRef = useRef<HTMLDivElement | null>(null);

//   // Static fallbacks
//   const staticUK     = useMemo(() => staticArticles.filter((a) => a.region === 'United Kingdom').slice(0, 4), []);
//   const staticEdPick = useMemo(() => staticArticles.filter((a) => a.featured).slice(0, 4), []);
//   const staticFocus  = useMemo(() => staticArticles.filter((a) => ['Analysis', 'Diplomacy'].includes(a.category)).slice(0, 4), []);
//   const staticIntvw  = useMemo(() => staticArticles.filter((a) => a.category === 'Interviews' || a.topic === 'Interviews').slice(0, 4), []);

//   const [ukArticles,      setUkArticles]      = useState<Article[]>([]);
//   const [edPick,          setEdPick]          = useState<Article[]>([]);
//   const [inFocus,         setInFocus]         = useState<Article[]>([]);
//   const [interviews,      setInterviews]      = useState<Article[]>([]);
//   const [videoArticles,   setVideoArticles]   = useState<any[]>([]);
//   const [opinionArticles, setOpinionArticles] = useState<Article[]>([]);
//   const [centralAsia,     setCentralAsia]     = useState<Article[]>([]);
//   const [europeArticles,  setEuropeArticles]  = useState<Article[]>([]);
//   const [diplomaticCorner, setDiplomaticCorner] = useState<Article[]>([]);

//   useEffect(() => {
//     Promise.all([
//       Promise.all([fetchRegionHome('uk'), fetchSectionHomeTarget('uk')]).then(([r, s]) => [...r, ...s].slice(0, 4)),
//       Promise.all([fetchRegionHome('editors-picks'), fetchSectionHomeTarget('editors-picks')]).then(([r, s]) => [...r, ...s].slice(0, 4)),
//       Promise.all([fetchRegionHome('in-focus'), fetchSectionHomeTarget('in-focus')]).then(([r, s]) => [...r, ...s].slice(0, 4)),
//       fetchSectionHome('interviews'),
//       fetchSectionHome('video', 4),
//       fetchSectionHome('opinion'),
//       fetchRegionHome('central-asia', 8),
//       fetchRegionHome('europe-home', 4),
//       fetchSectionHome('diplomatic-corner', 8),
//     ]).then(([uk, ep, inf, intv, vid, op, ca, eu, dc]) => {
//       if (uk.length)   setUkArticles(uk);
//       if (ep.length)   setEdPick(ep);
//       if (inf.length)  setInFocus(inf);
//       if (intv.length) setInterviews(intv);
//       if (vid.length)  setVideoArticles(vid);
//       if (op.length)   setOpinionArticles(op);
//       if (ca.length)   setCentralAsia(ca);
//       if (eu.length)   setEuropeArticles(eu);
//       if (dc.length)   setDiplomaticCorner(dc);
//     });
//   }, []);

//   const displayUK       = ukArticles.length     ? ukArticles     : staticUK;
//   const displayEdPick   = edPick.length          ? edPick         : staticEdPick;
//   const displayInFocus  = inFocus.length         ? inFocus        : staticFocus;
//   const displayIntvw    = interviews.length      ? interviews     : staticIntvw;
//   const displayVideos   = videoArticles;
//   const displayOpinion  = opinionArticles;
//   const displayCA       = centralAsia;
//   const displayEurope   = europeArticles;
//   const displayDiplo    = diplomaticCorner;

//   const featuredEditorsPick = displayEdPick[0] || null;
//   const sideEditorsPicks    = displayEdPick.slice(1, 4);

//   // For home page interviews — open same-page reader (preserved)
//   const openArticle = (article: Article) => {
//     setSelected(article);
//     setTimeout(() => readerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
//   };

//   return (
//     <div>
//       <Hero />

//       {/* Banner 1 */}
//       <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
//         <AdBanner identifier="homepage-banner-1" />
//       </section>

//       {/* United Kingdom */}
//       {displayUK.length > 0 && (
//         <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
//           <SectionHeading eyebrow="UK Coverage" title="United Kingdom"
//             description="Latest analysis, policy coverage and reporting from the United Kingdom." />
//           <div className="grid gap-6 lg:grid-cols-[1fr,1fr,320px]">
//             <div className="grid gap-6 md:grid-cols-2 lg:col-span-2">
//               {displayUK.map((article) => (
//                 <Link
//                   key={article.id}
//                   to={`/article/${article.id}`}
//                   className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white block"
//                 >
//                   <img src={article.image} alt={article.title}
//                     className="h-64 w-full object-cover transition duration-500 group-hover:scale-105" />
//                   <div className="p-6">
//                     <div className="text-xs font-bold uppercase tracking-[0.35em] text-accent">
//                       {article.topic || article.category || 'UK Coverage'}
//                     </div>
//                     <h3 className="mt-3 text-2xl font-bold text-ink">{article.title}</h3>
//                     <p className="mt-2 text-slate-600">{article.subtitle}</p>
//                     <span className="mt-5 inline-block rounded-full border border-primary px-5 py-2.5 font-semibold text-primary transition group-hover:bg-primary group-hover:text-white">
//                       Read More
//                     </span>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//             <AdBanner vertical identifier="homepage-banner-2" />
//           </div>
//         </section>
//       )}

//       {/* Editor's Picks */}
//       {displayEdPick.length > 0 && featuredEditorsPick && (
//         <section className="bg-soft py-16">
//           <div className="mx-auto max-w-7xl px-4 lg:px-6">
//             <SectionHeading eyebrow="Editorial" title="Editor's Picks"
//               description="Hand-selected stories from our editorial team — the most important reads this week." />
//             <div className="grid gap-6 xl:grid-cols-[1.35fr,1fr]">
//               <ArticleCard article={featuredEditorsPick} />
//               <div className="flex flex-col gap-4">
//                 {sideEditorsPicks.map((article) => (
//                   <Link
//                     key={article.id}
//                     to={`/article/${article.id}`}
//                     className="group flex gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
//                   >
//                     <img src={article.image} alt={article.title}
//                       className="h-28 w-32 flex-shrink-0 rounded-xl object-cover" />
//                     <div className="flex min-w-0 flex-col justify-between py-0.5">
//                       <div>
//                         <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent">{article.category}</div>
//                         <h3 className="mt-1.5 line-clamp-2 text-base font-bold leading-snug text-ink">{article.title}</h3>
//                         <p className="mt-1.5 text-xs text-slate-400">{article.author} · {article.date}</p>
//                       </div>
//                       <span className="mt-2 self-start text-sm font-semibold text-primary group-hover:underline">
//                         Read More →
//                       </span>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             </div>
//             <div className="my-10 grid gap-6 lg:grid-cols-2">
//               <AdBanner identifier="homepage-banner-3" />
//               <AdBanner identifier="homepage-banner-4" />
//             </div>
//           </div>
//         </section>
//       )}

//       {/* In Focus */}
//       {displayInFocus.length > 0 && (
//         <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
//           <SectionHeading eyebrow="Analysis" title="In Focus"
//             description="Deep dives and long-form analysis on the stories that demand closer attention." />
//           <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
//             {displayInFocus.map((article) => <ArticleCard key={article.id} article={article} />)}
//           </div>
//         </section>
//       )}

//       {/* Interviews */}
//       {displayIntvw.length > 0 && (
//         <section className="bg-slate-900 py-16">
//           <div className="mx-auto max-w-7xl px-4 lg:px-6">
//             <div className="mb-10 text-center">
//               <span className="inline-block rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">
//                 Conversations
//               </span>
//               <h2 className="mt-3 text-3xl font-black text-white">Interviews</h2>
//               <p className="mx-auto mt-3 max-w-xl text-slate-400">In-depth conversations with policymakers, analysts and global voices.</p>
//             </div>
//             <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
//               {displayIntvw.map((article) => (
//                 <Link
//                   key={article.id}
//                   to={`/article/${article.id}`}
//                   className="group relative overflow-hidden rounded-[1.75rem]"
//                 >
//                   <div className="aspect-[3/4] overflow-hidden">
//                     <img src={article.image} alt={article.title}
//                       className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
//                   </div>
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
//                   <div className="absolute bottom-0 left-0 right-0 p-5">
//                     <span className="inline-block rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-semibold text-accent">Interview</span>
//                     <h3 className="mt-2 line-clamp-3 text-sm font-bold leading-snug text-white">{article.title}</h3>
//                     <p className="mt-2 text-xs text-white/50">{article.author} · {article.date}</p>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Video Section */}
//       {displayVideos.length > 0 && (
//         <section className="bg-slate-950 py-16">
//           <div className="mx-auto max-w-7xl px-4 lg:px-6">
//             <div className="mb-8 flex items-end justify-between">
//               <div>
//                 <span className="inline-block rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">▶ Video</span>
//                 <h2 className="mt-3 text-3xl font-black text-white">Watch & Learn</h2>
//                 <p className="mt-2 text-slate-400">Video reports, documentary clips and analysis from our global team.</p>
//               </div>
//               <Link to="/section/video" className="hidden rounded-full border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-red-500 hover:text-white transition sm:block">
//                 All Videos →
//               </Link>
//             </div>
//             <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
//               {displayVideos.map((article: any) => {
//                 const thumb     = article.imageUrl ? article.imageUrl : article.videoId ? getYtThumb(article.videoId) : '';
//                 const articleId = article._id || article.id || '';
//                 return (
//                   <Link key={articleId} to={`/video/${articleId}`}
//                     className="group overflow-hidden rounded-2xl bg-slate-800 transition hover:-translate-y-1 hover:bg-slate-700">
//                     <div className="relative aspect-video overflow-hidden">
//                       {thumb && <img src={thumb} alt={article.title} className="h-full w-full object-cover transition group-hover:scale-105" />}
//                       <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
//                         <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 shadow-lg">
//                           <svg className="h-5 w-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
//                         </div>
//                       </div>
//                       <div className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600">
//                         <svg className="h-3 w-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
//                       </div>
//                     </div>
//                     <div className="p-4">
//                       <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">{article.category}</span>
//                       <h3 className="mt-1.5 line-clamp-2 text-sm font-bold text-white">{article.title}</h3>
//                       <p className="mt-1 text-xs text-slate-400">{article.author} · {article.date}</p>
//                     </div>
//                   </Link>
//                 );
//               })}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Opinion Section */}
//       {displayOpinion.length > 0 && (
//         <section className="bg-amber-50 py-16">
//           <div className="mx-auto max-w-7xl px-4 lg:px-6">
//             <div className="mb-8 flex items-end justify-between">
//               <div>
//                 <span className="inline-block rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent">Opinion</span>
                
//                 <p className="mt-2 text-slate-600">Perspectives from analysts, contributors and thought leaders.</p>
//               </div>
//               <Link to="/section/opinion" className="hidden rounded-full border border-amber-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-amber-200 transition sm:block">
//                 All Opinions →
//               </Link>
//             </div>
//             <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
//               {displayOpinion.map((article) => (
//                 <Link
//                   key={article.id}
//                   to={`/article/${article.id}`}
//                   className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-amber-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
//                 >
//                   {/* Show image if available */}
//                   {article.image && (
//                     <div className="aspect-[16/9] overflow-hidden">
//                       <img src={article.image} alt={article.title}
//                         className="h-full w-full object-cover transition group-hover:scale-105" />
//                     </div>
//                   )}
//                   <div className="flex flex-1 flex-col p-5">
//                     <svg className="h-6 w-6 text-accent/40" fill="currentColor" viewBox="0 0 24 24">
//                       <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
//                     </svg>
//                     <span className="mt-2 text-[10px] font-bold uppercase tracking-widest text-accent">{article.category}</span>
//                     <h3 className="mt-1.5 line-clamp-3 flex-1 text-base font-bold leading-snug text-ink">{article.title}</h3>
//                     <div className="mt-4 flex items-center gap-2 border-t border-amber-100 pt-3">
//                       <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary text-xs font-bold text-white">
//                         {article.author?.charAt(0) || 'A'}
//                       </div>
//                       <div className="min-w-0">
//                         <p className="truncate text-xs font-semibold text-ink">{article.author}</p>
//                         <p className="text-xs text-slate-400">{article.date}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Central Asia */}
//       {displayCA.length > 0 && (
//         <section className="bg-slate-800 py-16">
//           <div className="mx-auto max-w-7xl px-4 lg:px-6">
//             <div className="mb-8 flex items-end justify-between">
//               <div>
//                 <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white/80">
//                   Central Asia
//                 </span>
//                 <h2 className="mt-3 text-3xl font-black text-white">Central Asia Coverage</h2>
//                 <p className="mt-2 text-slate-400">Strategic reporting from Kazakhstan, Uzbekistan, Kyrgyzstan, Tajikistan and Turkmenistan.</p>
//               </div>
//               <Link to="/region/asia/central-asia"
//                 className="hidden rounded-full border border-slate-500 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-white hover:text-white transition sm:block">
//                 All Coverage →
//               </Link>
//             </div>
//             <ArrowCarousel
//               items={displayCA}
//               renderCard={(article) => (
//                 <Link
//                   to={`/article/${article.id}`}
//                   className="group block overflow-hidden rounded-[1.75rem] bg-slate-700 transition hover:-translate-y-1 hover:bg-slate-600"
//                 >
//                   {article.image && (
//                     <div className="aspect-[4/3] overflow-hidden">
//                       <img src={article.image} alt={article.title}
//                         className="h-full w-full object-cover transition group-hover:scale-105" />
//                     </div>
//                   )}
//                   <div className="p-5">
//                     <span className="text-[10px] font-bold uppercase tracking-widest text-accent">{article.category}</span>
//                     <h3 className="mt-1.5 line-clamp-2 text-sm font-bold text-white">{article.title}</h3>
//                     <p className="mt-1 text-xs text-slate-400">{article.author} · {article.date}</p>
//                   </div>
//                 </Link>
//               )}
//             />
//           </div>
//         </section>
//       )}

//       {/* Europe */}
//       {displayEurope.length > 0 && (
//         <section className="py-16 bg-white border-t border-b border-slate-100">
//           <div className="mx-auto max-w-7xl px-4 lg:px-6">
//             <div className="mb-8 flex items-end justify-between">
//               <div>
//                 <span className="inline-block rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
//                   Europe
//                 </span>
//                 <h2 className="mt-3 text-3xl font-black text-ink">Europe</h2>
//                 <p className="mt-2 text-slate-600">Western, Eastern, Northern and Southern Europe — diplomacy, security and economics.</p>
//               </div>
//               <Link to="/region/europe"
//                 className="hidden rounded-full border border-primary/30 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition sm:block">
//                 All Europe →
//               </Link>
//             </div>
//             {/* Magazine layout: large featured + 3 smaller */}
//             {displayEurope.length === 1 ? (
//               <ArticleCard article={displayEurope[0]} />
//             ) : (
//               <div className="grid gap-6 lg:grid-cols-[1.5fr,1fr]">
//                 <Link
//                   to={`/article/${displayEurope[0].id}`}
//                   className="group relative overflow-hidden rounded-[2rem] shadow-md"
//                 >
//                   <div className="aspect-[16/10] overflow-hidden">
//                     <img src={displayEurope[0].image} alt={displayEurope[0].title}
//                       className="h-full w-full object-cover transition group-hover:scale-105" />
//                   </div>
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
//                   <div className="absolute bottom-0 left-0 right-0 p-7">
//                     <span className="text-xs font-bold uppercase tracking-widest text-accent">{displayEurope[0].category}</span>
//                     <h3 className="mt-2 text-2xl font-black text-white lg:text-3xl">{displayEurope[0].title}</h3>
//                     <p className="mt-2 text-sm text-white/70">{displayEurope[0].author} · {displayEurope[0].date}</p>
//                   </div>
//                 </Link>
//                 <div className="flex flex-col gap-4">
//                   {displayEurope.slice(1, 4).map((article) => (
//                     <Link
//                       key={article.id}
//                       to={`/article/${article.id}`}
//                       className="group flex gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft"
//                     >
//                       {article.image && (
//                         <img src={article.image} alt={article.title}
//                           className="h-20 w-24 flex-shrink-0 rounded-xl object-cover" />
//                       )}
//                       <div className="min-w-0 flex-1">
//                         <span className="text-[10px] font-bold uppercase tracking-widest text-accent">{article.category}</span>
//                         <h3 className="mt-1 line-clamp-2 text-sm font-bold text-ink">{article.title}</h3>
//                         <p className="mt-1 text-xs text-slate-400">{article.author} · {article.date}</p>
//                       </div>
//                     </Link>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </section>
//       )}

//       {/* Diplomatic Corner */}
//       {displayDiplo.length > 0 && (
//         <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
//           <div className="mx-auto max-w-7xl px-4 lg:px-6">
//             <div className="mb-8 flex items-end justify-between">
//               <div>
//                 <span className="inline-block rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-400">
//                   🤝 Diplomatic Corner
//                 </span>
//                 <h2 className="mt-3 text-3xl font-black text-white">Diplomatic Corner</h2>
//                 <p className="mt-2 text-slate-400">In-depth diplomatic analysis, treaties, negotiations and foreign policy insights.</p>
//               </div>
//               <Link to="/section/diplomatic-corner"
//                 className="hidden rounded-full border border-amber-400/30 px-4 py-2 text-sm font-semibold text-amber-300 hover:bg-amber-400/20 transition sm:block">
//                 All Coverage →
//               </Link>
//             </div>
//             <ArrowCarousel
//               items={displayDiplo}
//               renderCard={(article) => (
//                 <Link
//                   to={`/article/${article.id}`}
//                   className="group block overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/10"
//                 >
//                   {article.image && (
//                     <div className="aspect-[4/3] overflow-hidden">
//                       <img src={article.image} alt={article.title}
//                         className="h-full w-full object-cover transition group-hover:scale-105 opacity-90" />
//                     </div>
//                   )}
//                   <div className="p-5">
//                     <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">{article.category}</span>
//                     <h3 className="mt-1.5 line-clamp-2 text-sm font-bold text-white">{article.title}</h3>
//                     <p className="mt-1 text-xs text-slate-400">{article.author} · {article.date}</p>
//                   </div>
//                 </Link>
//               )}
//             />
//           </div>
//         </section>
//       )}

//       {/* Article Reader — kept for backward compat with any same-page interactions */}
//       <section ref={readerRef} className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
//         <SectionHeading
//           eyebrow="Reading Experience"
//           title="Read the full story without leaving the page"
//           description="Click Read More on any article above and the full story opens here."
//         />
//         <ArticleReader article={selected} />
//       </section>
//     </div>
//   );
// }




import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdBanner } from '../components/AdBanner';
import { ArticleCard } from '../components/ArticleCard';
import { Hero } from '../components/Hero';
import { Article, articles as staticArticles } from '../data/siteData';
import { PartnersMarquee } from '../components/PartnersMarquee';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

async function fetchRegionHome(section: string, limit = 4): Promise<Article[]> {
  try {
    const r = await fetch(`${API_URL}/region-articles/home-section/${section}?limit=${limit}`);
    return r.ok ? (await r.json()).map(toArticle) : [];
  } catch {
    return [];
  }
}

async function fetchSectionHome(section: string, limit = 4): Promise<any[]> {
  try {
    const r = await fetch(`${API_URL}/section-articles/home/${section}?limit=${limit}`);
    if (!r.ok) return [];
    const data = await r.json();
    return section === 'video' ? data : data.map(toArticle);
  } catch {
    return [];
  }
}

async function fetchSectionHomeTarget(target: string): Promise<Article[]> {
  try {
    const r = await fetch(`${API_URL}/section-articles/home-target/${target}`);
    return r.ok ? (await r.json()).map(toArticle) : [];
  } catch {
    return [];
  }
}

function getYtThumb(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

function CenterHeader({
  eyebrow,
  title,
  description,
  action,
  titleClassName = '',
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  titleClassName?: string;
}) {
  return (
    <div className="mb-10 text-center">
      <span className="inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
        {eyebrow}
      </span>
      <h2 className={`mt-4 text-3xl font-black text-ink lg:text-4xl ${titleClassName}`}>{title}</h2>
      <p className="mx-auto mt-3 max-w-2xl text-slate-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

function ArrowCarousel({
  items,
  renderCard,
}: {
  items: any[];
  renderCard: (item: any) => React.ReactNode;
}) {
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
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 text-xl text-slate-600 transition hover:border-primary hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            ←
          </button>
          <div className="flex gap-2">
            {Array.from({ length: maxPage + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-2.5 rounded-full transition-all ${i === page ? 'w-7 bg-primary' : 'w-2.5 bg-slate-300 hover:bg-slate-400'}`}
              />
            ))}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
            disabled={page === maxPage}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 text-xl text-slate-600 transition hover:border-primary hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}

export function HomePage() {
  const staticUK = useMemo(() => staticArticles.filter((a) => a.region === 'United Kingdom').slice(0, 4), []);
  const staticEdPick = useMemo(() => staticArticles.filter((a) => a.featured).slice(0, 4), []);
  const staticFocus = useMemo(() => staticArticles.filter((a) => ['Analysis', 'Diplomacy'].includes(a.category)).slice(0, 4), []);
  const staticIntvw = useMemo(() => staticArticles.filter((a) => a.category === 'Interviews' || a.topic === 'Interviews').slice(0, 4), []);

  const [ukArticles, setUkArticles] = useState<Article[]>([]);
  const [edPick, setEdPick] = useState<Article[]>([]);
  const [inFocus, setInFocus] = useState<Article[]>([]);
  const [interviews, setInterviews] = useState<Article[]>([]);
  const [videoArticles, setVideoArticles] = useState<any[]>([]);
  const [opinionArticles, setOpinionArticles] = useState<Article[]>([]);
  const [centralAsia, setCentralAsia] = useState<Article[]>([]);
  const [europeArticles, setEuropeArticles] = useState<Article[]>([]);
  const [russiaArticles, setRussiaArticles] = useState<Article[]>([]);
  const [diplomaticCorner, setDiplomaticCorner] = useState<Article[]>([]);

  useEffect(() => {
    Promise.all([
      Promise.all([fetchRegionHome('uk'), fetchSectionHomeTarget('uk')]).then(([r, s]) => [...r, ...s].slice(0, 4)),
      Promise.all([fetchRegionHome('editors-picks'), fetchSectionHomeTarget('editors-picks')]).then(([r, s]) => [...r, ...s].slice(0, 4)),
      Promise.all([fetchRegionHome('in-focus'), fetchSectionHomeTarget('in-focus')]).then(([r, s]) => [...r, ...s].slice(0, 4)),
      fetchSectionHome('interviews'),
      fetchSectionHome('video', 4),
      fetchSectionHome('opinion'),
      fetchRegionHome('central-asia', 8),
      fetchRegionHome('europe-home', 4),
      fetchRegionHome('russia-home', 5),
      fetchSectionHome('diplomatic-corner', 8),
    ]).then(([uk, ep, inf, intv, vid, op, ca, eu, ru, dc]) => {
      if (uk.length) setUkArticles(uk);
      if (ep.length) setEdPick(ep);
      if (inf.length) setInFocus(inf);
      if (intv.length) setInterviews(intv);
      if (vid.length) setVideoArticles(vid);
      if (op.length) setOpinionArticles(op);
      if (ca.length) setCentralAsia(ca);
      if (eu.length) setEuropeArticles(eu);
      if (ru.length) setRussiaArticles(ru);
      if (dc.length) setDiplomaticCorner(dc);
    });
  }, []);

  const displayUK = ukArticles.length ? ukArticles : staticUK;
  const displayEdPick = edPick.length ? edPick : staticEdPick;
  const displayInFocus = inFocus.length ? inFocus : staticFocus;
  const displayIntvw = interviews.length ? interviews : staticIntvw;
  const displayVideos = videoArticles;
  const displayOpinion = opinionArticles;
  const displayCA = centralAsia;
  const displayEurope = europeArticles;
  const displayRussia = russiaArticles;
  const displayDiplo = diplomaticCorner;

  const featuredEditorsPick = displayEdPick[0] || null;
  const sideEditorsPicks = displayEdPick.slice(1, 4);

  const russiaLead = displayRussia[0] || null;
  const russiaSide = displayRussia.slice(1, 5);

  return (
    <div>
      <Hero />

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <AdBanner identifier="homepage-banner-1" />
      </section>

      {displayUK.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
          <CenterHeader
            eyebrow="UK Coverage"
            title="United Kingdom"
            description="Latest analysis, policy coverage and reporting from the United Kingdom."
          />

          <div className="grid gap-6 lg:grid-cols-[1fr,1fr,320px]">
            <div className="grid gap-6 md:grid-cols-2 lg:col-span-2">
              {displayUK.map((article) => (
                <Link
                  key={article.id}
                  to={`/article/${article.id}`}
                  className="group block overflow-hidden rounded-[2rem] border border-slate-200 bg-white"
                >
                  <img
                    src={article.image}
                    alt={article.title}
                    className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="p-6">
                    <div className="text-xs font-bold uppercase tracking-[0.35em] text-accent">
                      {article.topic || article.category || 'UK Coverage'}
                    </div>
                    <h3 className="mt-3 text-2xl font-bold text-ink">{article.title}</h3>
                    <p className="mt-2 text-slate-600">{article.subtitle}</p>
                    <span className="mt-5 inline-block rounded-full border border-primary px-5 py-2.5 font-semibold text-primary transition group-hover:bg-primary group-hover:text-white">
                      Read More
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <AdBanner vertical identifier="homepage-banner-2" />
          </div>
        </section>
      )}

      {displayEdPick.length > 0 && featuredEditorsPick && (
        <section className="bg-soft py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <CenterHeader
              eyebrow="Editorial"
              title="Editor's Picks"
              description="Hand-selected stories from our editorial team — the most important reads this week."
            />

            <div className="grid gap-6 xl:grid-cols-[1.35fr,1fr]">
              <ArticleCard article={featuredEditorsPick} />
              <div className="flex flex-col gap-4">
                {sideEditorsPicks.map((article) => (
                  <Link
                    key={article.id}
                    to={`/article/${article.id}`}
                    className="group flex gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
                  >
                    <img
                      src={article.image}
                      alt={article.title}
                      className="h-28 w-32 flex-shrink-0 rounded-xl object-cover"
                    />
                    <div className="flex min-w-0 flex-col justify-between py-0.5">
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent">{article.category}</div>
                        <h3 className="mt-1.5 line-clamp-2 text-base font-bold leading-snug text-ink">{article.title}</h3>
                        <p className="mt-1.5 text-xs text-slate-400">{article.author} · {article.date}</p>
                      </div>
                      <span className="mt-2 self-start text-sm font-semibold text-primary group-hover:underline">
                        Read More →
                      </span>
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
          <CenterHeader
            eyebrow="Analysis"
            title="In Focus"
            description="Deep dives and long-form analysis on the stories that demand closer attention."
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {displayInFocus.map((article) => <ArticleCard key={article.id} article={article} />)}
          </div>
        </section>
      )}

      {displayIntvw.length > 0 && (
        <section className="bg-slate-900 py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <div className="mb-10 text-center">
              <span className="inline-block rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">
                Conversations
              </span>
              <h2 className="mt-4 text-4xl font-black text-white lg:text-5xl">Interviews</h2>
              <p className="mx-auto mt-3 max-w-xl text-slate-400">
                In-depth conversations with policymakers, analysts and global voices.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {displayIntvw.map((article) => (
                <Link
                  key={article.id}
                  to={`/article/${article.id}`}
                  className="group relative overflow-hidden rounded-[1.75rem]"
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="inline-block rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-semibold text-accent">Interview</span>
                    <h3 className="mt-2 line-clamp-3 text-sm font-bold leading-snug text-white">{article.title}</h3>
                    <p className="mt-2 text-xs text-white/50">{article.author} · {article.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {displayVideos.length > 0 && (
        <section className="bg-slate-950 py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <CenterHeader
              eyebrow="▶ Video"
              title="Watch & Learn"
              titleClassName="text-white !text-5xl"
              description="Video reports, documentary clips and analysis from our global team."
              action={
                <Link
                  to="/section/video"
                  className="inline-flex rounded-full border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-red-500 hover:text-white"
                >
                  All Videos →
                </Link>
              }
            />

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {displayVideos.map((article: any) => {
                const thumb = article.imageUrl ? article.imageUrl : article.videoId ? getYtThumb(article.videoId) : '';
                const articleId = article._id || article.id || '';

                return (
                  <Link
                    key={articleId}
                    to={`/video/${articleId}`}
                    className="group overflow-hidden rounded-2xl bg-slate-800 transition hover:-translate-y-1 hover:bg-slate-700"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      {thumb && (
                        <img
                          src={thumb}
                          alt={article.title}
                          className="h-full w-full object-cover transition group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 shadow-lg">
                          <svg className="ml-0.5 h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600">
                        <svg className="ml-0.5 h-3 w-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    </div>
                    <div className="p-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">{article.category}</span>
                      <h3 className="mt-1.5 line-clamp-2 text-sm font-bold text-white">{article.title}</h3>
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
        <section className="bg-amber-50 py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <CenterHeader
              eyebrow="Opinion"
              title="Opinion"
              titleClassName="!text-5xl"
              description="Perspectives from analysts, contributors and thought leaders."
              action={
                <Link
                  to="/section/opinion"
                  className="inline-flex rounded-full border border-amber-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-amber-200"
                >
                  All Opinions →
                </Link>
              }
            />

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {displayOpinion.map((article) => (
                <Link
                  key={article.id}
                  to={`/article/${article.id}`}
                  className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-amber-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
                >
                  {article.image && (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <svg className="h-6 w-6 text-accent/40" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <span className="mt-2 text-[10px] font-bold uppercase tracking-widest text-accent">{article.category}</span>
                    <h3 className="mt-1.5 line-clamp-3 flex-1 text-base font-bold leading-snug text-ink">{article.title}</h3>
                    <div className="mt-4 flex items-center gap-2 border-t border-amber-100 pt-3">
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary text-xs font-bold text-white">
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
        <section className="bg-slate-800 py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <CenterHeader
              eyebrow="Central Asia"
              title="Central Asia Coverage"
              titleClassName="text-white"
              description="Strategic reporting from Kazakhstan, Uzbekistan, Kyrgyzstan, Tajikistan and Turkmenistan."
              action={
                <Link
                  to="/region/asia/central-asia"
                  className="inline-flex rounded-full border border-slate-500 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-white hover:text-white"
                >
                  All Coverage →
                </Link>
              }
            />

            <ArrowCarousel
              items={displayCA}
              renderCard={(article) => (
                <Link
                  to={`/article/${article.id}`}
                  className="group block overflow-hidden rounded-[1.75rem] bg-slate-700 transition hover:-translate-y-1 hover:bg-slate-600"
                >
                  {article.image && (
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={article.image} alt={article.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                    </div>
                  )}
                  <div className="p-5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent">{article.category}</span>
                    <h3 className="mt-1.5 line-clamp-2 text-sm font-bold text-white">{article.title}</h3>
                    <p className="mt-1 text-xs text-slate-400">{article.author} · {article.date}</p>
                  </div>
                </Link>
              )}
            />
          </div>
        </section>
      )}

      {displayEurope.length > 0 && (
        <section className="border-y border-slate-100 bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <CenterHeader
              eyebrow="Europe"
              title="Europe"
              description="Western, Eastern, Northern and Southern Europe — diplomacy, security and economics."
              action={
                <Link
                  to="/region/europe"
                  className="inline-flex rounded-full border border-primary/30 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                >
                  All Europe →
                </Link>
              }
            />

            {displayEurope.length === 1 ? (
              <ArticleCard article={displayEurope[0]} />
            ) : (
              <div className="grid gap-6 lg:grid-cols-[1.5fr,1fr]">
                <Link
                  to={`/article/${displayEurope[0].id}`}
                  className="group relative overflow-hidden rounded-[2rem] shadow-md"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={displayEurope[0].image}
                      alt={displayEurope[0].title}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-7">
                    <span className="text-xs font-bold uppercase tracking-widest text-accent">{displayEurope[0].category}</span>
                    <h3 className="mt-2 text-2xl font-black text-white lg:text-3xl">{displayEurope[0].title}</h3>
                    <p className="mt-2 text-sm text-white/70">{displayEurope[0].author} · {displayEurope[0].date}</p>
                  </div>
                </Link>

                <div className="flex flex-col gap-4">
                  {displayEurope.slice(1, 4).map((article) => (
                    <Link
                      key={article.id}
                      to={`/article/${article.id}`}
                      className="group flex gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft"
                    >
                      {article.image && (
                        <img src={article.image} alt={article.title} className="h-20 w-24 flex-shrink-0 rounded-xl object-cover" />
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-accent">{article.category}</span>
                        <h3 className="mt-1 line-clamp-2 text-sm font-bold text-ink">{article.title}</h3>
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
        <section className="bg-[#f6f7f2] py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <CenterHeader
              eyebrow="Russia"
              title="Russia"
              description="Strategic reporting, politics, diplomacy and economic coverage from Russia."
              action={
                <Link
                  to="/region/russia"
                  className="inline-flex rounded-full border border-primary/30 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                >
                  All Russia →
                </Link>
              }
            />

            <div className="grid gap-10 xl:grid-cols-[1.7fr,430px]">
              <Link
                to={`/article/${russiaLead.id}`}
                className="group block overflow-hidden bg-white shadow-sm"
              >
                {russiaLead.image && (
                  <div className="aspect-[16/8] overflow-hidden">
                    <img
                      src={russiaLead.image}
                      alt={russiaLead.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="bg-slate-700 px-8 py-5">
                  <p className="text-sm font-black uppercase tracking-wide text-white/80">
                    By {russiaLead.author} · {russiaLead.date}
                  </p>
                </div>
                <div className="px-8 py-8">
                  <h3 className="text-3xl font-medium leading-tight text-ink lg:text-4xl">
                    {russiaLead.title}
                  </h3>
                  {russiaLead.subtitle && (
                    <p className="mt-4 text-lg text-slate-600">{russiaLead.subtitle}</p>
                  )}
                </div>
              </Link>

              <div className="bg-[#eef1ea] p-8">
                <div className="space-y-8">
                  {russiaSide.map((article) => (
                    <Link
                      key={article.id}
                      to={`/article/${article.id}`}
                      className="group block border-b border-slate-300 pb-8 last:border-b-0 last:pb-0"
                    >
                      <div className="grid grid-cols-[1fr,120px] gap-5 items-start">
                        <div>
                          <div className="text-sm font-black uppercase tracking-wide text-accent">
                            {article.category || 'Russia'}
                          </div>
                          <h3 className="mt-2 text-[2rem] font-semibold leading-[1.05] text-ink group-hover:text-primary transition">
                            {article.title}
                          </h3>
                        </div>
                        {article.image && (
                          <img
                            src={article.image}
                            alt={article.title}
                            className="h-20 w-full object-cover"
                          />
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {displayDiplo.length > 0 && (
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <CenterHeader
              eyebrow="🤝 Diplomatic Corner"
              title="Diplomatic Corner"
              titleClassName="text-white"
              description="In-depth diplomatic analysis, treaties, negotiations and foreign policy insights."
              action={
                <Link
                  to="/section/diplomatic-corner"
                  className="inline-flex rounded-full border border-amber-400/30 px-4 py-2 text-sm font-semibold text-amber-300 transition hover:bg-amber-400/20"
                >
                  All Coverage →
                </Link>
              }
            />

            <ArrowCarousel
              items={displayDiplo}
              renderCard={(article) => (
                <Link
                  to={`/article/${article.id}`}
                  className="group block overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/10"
                >
                  {article.image && (
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="h-full w-full object-cover opacity-90 transition group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">{article.category}</span>
                    <h3 className="mt-1.5 line-clamp-2 text-sm font-bold text-white">{article.title}</h3>
                    <p className="mt-1 text-xs text-slate-400">{article.author} · {article.date}</p>
                  </div>
                </Link>
              )}
            />
          </div>
        </section>
      )}
      <PartnersMarquee />
    </div>
  );
}
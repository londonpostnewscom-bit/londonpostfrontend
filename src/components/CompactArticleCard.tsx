

// import { Link } from 'react-router-dom';
// import { Article } from '../data/siteData';

// export function CompactArticleCard({
//   article,
//   onReadMore,
// }: {
//   article: Article;
//   onReadMore?: (article: Article) => void;
// }) {
//   const content = (
//     <>
//       <div className="aspect-[4/3] overflow-hidden">
//         <img
//           src={article.image}
//           alt={article.title}
//           className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
//         />
//       </div>

//       <div className="flex flex-1 flex-col p-5">
//         <div className="text-xs font-bold uppercase tracking-[0.3em] text-accent">
//           {article.category}
//         </div>

//         <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-snug text-ink">
//           {article.title}
//         </h3>

//         <div className="mt-2 text-xs text-slate-500">
//           By {article.author} · {article.date}
//         </div>

//         <p className="mt-3 line-clamp-2 flex-1 text-sm text-slate-600">
//           {article.subtitle}
//         </p>

//         <span className="mt-4 self-start text-sm font-semibold text-primary group-hover:underline">
//           Read More →
//         </span>
//       </div>
//     </>
//   );

//   if (onReadMore) {
//     return (
//       <button
//         type="button"
//         onClick={() => onReadMore(article)}
//         className="group flex w-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
//       >
//         {content}
//       </button>
//     );
//   }

//   return (
//     <Link
//       to={`/article/${article.id}`}
//       className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
//     >
//       {content}
//     </Link>
//   );
// }


import { Link } from 'react-router-dom';
import { Article } from '../data/siteData';

export function CompactArticleCard({
  article,
}: {
  article: Article;
}) {
  const isVideo = (article as any).section === 'video' || (article as any).videoId;
  const linkTo = isVideo ? `/video/${article.id}` : `/article/${article.id}`;

  return (
    <Link
      to={linkTo}
      className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="text-xs font-bold uppercase tracking-[0.3em] text-accent">
          {article.category}
        </div>

        <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-snug text-ink">
          {article.title}
        </h3>

        <div className="mt-2 text-xs text-slate-500">
          By {article.author} · {article.date}
        </div>

        <p className="mt-3 line-clamp-2 flex-1 text-sm text-slate-600">
          {article.subtitle}
        </p>

        <span className="mt-4 self-start text-sm font-semibold text-primary group-hover:underline">
          Read More →
        </span>
      </div>
    </Link>
  );
}
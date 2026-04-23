// import { Article } from '../data/siteData';

// export function ArticleCard({ article, onReadMore }: { article: Article; onReadMore?: (article: Article) => void }) {
//   return (
//     <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
//       <img src={article.image} alt={article.title} className="h-56 w-full object-cover" />
//       <div className="p-6">
//         <div className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">{article.category}</div>
//         <h3 className="mt-3 text-2xl font-bold leading-tight text-ink">{article.title}</h3>
//         <p className="mt-3 text-slate-600">{article.subtitle}</p>
//         <div className="mt-4 text-sm text-slate-500">By {article.author} · {article.date}</div>
//         {onReadMore && (
//           <button onClick={() => onReadMore(article)} className="mt-5 rounded-full border border-primary px-5 py-2.5 font-semibold text-primary transition hover:bg-primary hover:text-white">
//             Read More
//           </button>
//         )}
//       </div>
//     </article>
//   );
// }


import { Link } from 'react-router-dom';
import { Article } from '../data/siteData';

export function ArticleCard({ article, onReadMore }: {
  article: Article;
  onReadMore?: (article: Article) => void;
}) {
  return (
    <Link
      to={`/article/${article.id}`}
      onClick={onReadMore ? () => onReadMore(article) : undefined}
      className="group block overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
    >
      <img
        src={article.image}
        alt={article.title}
        className="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
      />
      <div className="p-6">
        <div className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
          {article.category}
        </div>
        <h3 className="mt-3 text-2xl font-bold leading-tight text-ink">{article.title}</h3>
        <p className="mt-3 text-slate-600">{article.subtitle}</p>
        <div className="mt-4 text-sm text-slate-500">By {article.author} · {article.date}</div>
        <span className="mt-5 inline-block rounded-full border border-primary px-5 py-2.5 font-semibold text-primary transition group-hover:bg-primary group-hover:text-white">
          Read More
        </span>
      </div>
    </Link>
  );
}


// import { CompactArticleCard } from './CompactArticleCard';
// import { Article } from '../data/siteData';

// interface Props {
//   articles: Article[];
//   columns?: 1 | 2;
//   onReadMore?: (article: Article) => void;
// }

// export function PaginatedArticles({
//   articles,
//   columns = 2,
//   onReadMore,
// }: Props) {
//   if (articles.length === 0) return null;

//   return (
//     <div className={`grid gap-5 ${columns === 2 ? 'md:grid-cols-2' : ''}`}>
//       {articles.map((a) => (
//         <CompactArticleCard
//           key={a.id}
//           article={a}
//           onReadMore={onReadMore}
//         />
//       ))}
//     </div>
//   );
// }

import { CompactArticleCard } from './CompactArticleCard';
import { Article } from '../data/siteData';

interface Props {
  articles: Article[];
  columns?: 1 | 2;
}

export function PaginatedArticles({
  articles,
  columns = 2,
}: Props) {
  if (articles.length === 0) return null;

  return (
    <div className={`grid gap-5 ${columns === 2 ? 'md:grid-cols-2' : ''}`}>
      {articles.map((a) => (
        <CompactArticleCard key={a.id} article={a} />
      ))}
    </div>
  );
}
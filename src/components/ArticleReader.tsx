// import { Article } from '../data/siteData';

// function decodeAndStrip(html: string): string {
//   // First decode any escaped HTML entities
//   const textarea = document.createElement('textarea');
//   textarea.innerHTML = html;
//   const decoded = textarea.value;

//   // Then strip junk attributes and dangerous tags
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

// function looksLikeHtml(str: string): boolean {
//   // Check both normal and escaped HTML
//   return /<[a-z][\s\S]*>/i.test(str) || /&lt;[a-z][\s\S]*&gt;/i.test(str);
// }

// export function ArticleReader({ article }: { article: Article | null }) {
//   if (!article) {
//     return (
//       <div className="rounded-[2rem] border-2 border-dashed border-slate-200 p-16 text-center text-slate-400">
//         <p className="text-lg font-medium">Select an article to read it here</p>
//         <p className="mt-2 text-sm">
//           Click "Read More" on any card above and the full story will appear in this section.
//         </p>
//       </div>
//     );
//   }

//   const raw = article.content || '';
//   const safeContent = looksLikeHtml(raw) ? decodeAndStrip(raw) : raw;
//   const renderAsHtml = looksLikeHtml(raw);

//   return (
//     <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
//       {article.image && (
//         <img
//           src={article.image}
//           alt={article.title}
//           className="h-72 w-full object-cover lg:h-96"
//         />
//       )}
//       <div className="p-8 lg:p-12">
//         <div className="text-xs font-bold uppercase tracking-[0.35em] text-accent">
//           Reading Section
//         </div>
//         <h2 className="mt-4 text-3xl font-black leading-tight text-ink lg:text-4xl">
//           {article.title}
//         </h2>
//         {article.subtitle && (
//           <p className="mt-3 text-lg text-slate-600">{article.subtitle}</p>
//         )}
//         <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-400">
//           <span>
//             By <span className="font-semibold text-slate-600">{article.author}</span>
//           </span>
//           <span>·</span>
//           <span>{article.date}</span>
//           {article.category && (
//             <>
//               <span>·</span>
//               <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
//                 {article.category}
//               </span>
//             </>
//           )}
//         </div>

//         <hr className="my-8 border-slate-100" />

//         {renderAsHtml ? (
//           <div
//             className="prose-article"
//             dangerouslySetInnerHTML={{ __html: safeContent }}
//           />
//         ) : (
//           <div className="prose-article whitespace-pre-wrap">{safeContent}</div>
//         )}
//       </div>
//     </div>
//   );
// }
import { Article } from '../data/siteData';

function decodeAndStrip(html: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  const decoded = textarea.value;

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

function looksLikeHtml(str: string): boolean {
  return /<[a-z][\s\S]*>/i.test(str) || /&lt;[a-z][\s\S]*&gt;/i.test(str);
}

function HashtagBox({ hashtags }: { hashtags?: string[] }) {
  if (!Array.isArray(hashtags) || hashtags.length === 0) return null;

  return (
    <div className="mt-10 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">
        Hashtags
      </p>

      <div className="mt-4 flex flex-wrap gap-2.5">
        {hashtags.map((tag) => (
          <span
            key={tag}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ArticleReader({ article }: { article: Article | null }) {
  if (!article) {
    return (
      <div className="rounded-[2rem] border-2 border-dashed border-slate-200 p-16 text-center text-slate-400">
        <p className="text-lg font-medium">Select an article to read it here</p>
        <p className="mt-2 text-sm">
          Click "Read More" on any card above and the full story will appear in this section.
        </p>
      </div>
    );
  }

  const raw = article.content || '';
  const safeContent = looksLikeHtml(raw) ? decodeAndStrip(raw) : raw;
  const renderAsHtml = looksLikeHtml(raw);

  // supports hashtags even if Article type does not yet include it
  const hashtags = Array.isArray((article as any).hashtags) ? (article as any).hashtags : [];

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      {article.image && (
        <img
          src={article.image}
          alt={article.title}
          className="h-72 w-full object-cover lg:h-96"
        />
      )}

      <div className="p-8 lg:p-12">
        <div className="text-xs font-bold uppercase tracking-[0.35em] text-accent">
          Reading Section
        </div>

        <h2 className="mt-4 text-3xl font-black leading-tight text-ink lg:text-4xl">
          {article.title}
        </h2>

        {article.subtitle && (
          <p className="mt-3 text-lg text-slate-600">{article.subtitle}</p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <span>
            By <span className="font-semibold text-slate-600">{article.author}</span>
          </span>
          <span>·</span>
          <span>{article.date}</span>

          {article.category && (
            <>
              <span>·</span>
              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                {article.category}
              </span>
            </>
          )}
        </div>

        <hr className="my-8 border-slate-100" />

        {renderAsHtml ? (
          <div
            className="prose-article"
            dangerouslySetInnerHTML={{ __html: safeContent }}
          />
        ) : (
          <div className="prose-article whitespace-pre-wrap">{safeContent}</div>
        )}

        <HashtagBox hashtags={hashtags} />
      </div>
    </div>
  );
}
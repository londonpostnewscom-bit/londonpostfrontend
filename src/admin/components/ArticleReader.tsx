import { Article } from '../../data/siteData';

function isHTML(str: string) {
  return /<[a-z][\s\S]*>/i.test(str);
}

// Same allowed tags — strip junk on render too as a second safety layer
function stripJunk(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<img[^>]*youtube[^>]*>/gi, '')
    .replace(/data-[a-z-]+="[^"]*"/gi, '')
    .replace(/class="[^"]*"/gi, '')
    .replace(/style="[^"]*"/gi, '')
    .replace(/jsaction="[^"]*"/gi, '')
    .replace(/jscontroller="[^"]*"/gi, '')
    .replace(/jsname="[^"]*"/gi, '')
    .replace(/jsshadow[^>]*/gi, '');
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

  const contentIsHtml = isHTML(article.content || '');
  const safeContent = contentIsHtml ? stripJunk(article.content) : article.content;

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      {article.image && (
        <img src={article.image} alt={article.title} className="h-72 w-full object-cover lg:h-96" />
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
          <span>By <span className="font-semibold text-slate-600">{article.author}</span></span>
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

        {contentIsHtml ? (
          <div
            className="prose-article"
            dangerouslySetInnerHTML={{ __html: safeContent }}
          />
        ) : (
          <div className="prose-article whitespace-pre-wrap">{safeContent}</div>
        )}
      </div>
    </div>
  );
}
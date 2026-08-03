

import { Link } from 'react-router-dom';
import { Article } from '../data/siteData';
import { cld } from '../utils/Cloudinary';

/* Keep in sync with the TONE map in HomePage.tsx — duplicated locally
   so this card has no cross-file dependency and stays drop-in reusable.
   Every value is a complete literal Tailwind class (never built at
   runtime), so nothing gets dropped by the CSS scanner. */
type Tone = 'navy' | 'crimson' | 'gold' | 'lagoon' | 'azure';

const TONE: Record<Tone, {
  tick: string; text: string; groupHoverText: string; border: string; ribbon: string;
}> = {
  navy:    { tick: 'bg-primary', text: 'text-primary', groupHoverText: 'group-hover:text-primary', border: 'border-primary/15', ribbon: 'bg-primary' },
  crimson: { tick: 'bg-accent',  text: 'text-accent',  groupHoverText: 'group-hover:text-accent',  border: 'border-accent/15',  ribbon: 'bg-accent' },
  gold:    { tick: 'bg-gold',    text: 'text-gold',    groupHoverText: 'group-hover:text-gold',    border: 'border-gold/20',    ribbon: 'bg-gold' },
  lagoon:  { tick: 'bg-lagoon',  text: 'text-lagoon',  groupHoverText: 'group-hover:text-lagoon',  border: 'border-lagoon/20',  ribbon: 'bg-lagoon' },
  azure:   { tick: 'bg-azure',   text: 'text-azure',   groupHoverText: 'group-hover:text-azure',   border: 'border-azure/20',   ribbon: 'bg-azure' },
};

/**
 * Featured / stand-alone story card.
 * Used for: the #1 Editor's Pick, and any section that needs to show a
 * single article as a self-contained, premium unit (e.g. a fallback
 * "only one story available" case). Image sits at a fixed, moderate
 * aspect ratio so a lone card never balloons to fill unrelated space —
 * the card's height is dictated by its own content, never by a sibling.
 */
export function ArticleCard({ article, onReadMore, tone = 'crimson' }: {
  article: Article;
  onReadMore?: (article: Article) => void;
  tone?: Tone;
}) {
  const t = TONE[tone];
  return (
    <Link
      to={`/article/${article.id}`}
      onClick={onReadMore ? () => onReadMore(article) : undefined}
      className={`group flex h-full flex-col overflow-hidden rounded-xl border bg-white transition hover:-translate-y-1 hover:shadow-lg ${t.border}`}
    >
      <div className="relative overflow-hidden">
        <div className="aspect-[16/10]">
          {article.image
            ? <img src={cld(article.image, 900)} alt={article.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            : <div className="h-full w-full bg-slate-100" />}
        </div>
        <span className={`absolute left-5 top-5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white ${t.ribbon}`}>
          {article.category || 'Featured'}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold leading-tight text-ink lg:text-2xl">{article.title}</h3>
        {article.subtitle && <p className="mt-2.5 flex-1 text-sm text-slate-500 line-clamp-2">{article.subtitle}</p>}
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {article.author} · {article.date}
          </span>
          <span className={`inline-flex items-center gap-1.5 text-sm font-bold ${t.text} transition`}>
            Read <span className="transition group-hover:translate-x-1">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

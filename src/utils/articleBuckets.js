
import { Article } from '../data/siteData';

const MONTHS: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

// Mirrors the backend's utils/parseArticleDate.js so client-side ordering
// always agrees with server-side ordering, regardless of exact date format.
export function parseArticleDate(input?: string): Date | null {
  if (!input) return null;
  const s = input.trim();

  const native = new Date(s);
  if (!isNaN(native.getTime()) && /\d{4}/.test(s)) return native;

  const lower = s.toLowerCase();
  let m = lower.match(/([a-z]+)\D{0,3}(\d{1,2})\D{0,3}(\d{4})/);
  if (m && MONTHS[m[1]] !== undefined) return new Date(+m[3], MONTHS[m[1]], +m[2]);

  m = lower.match(/(\d{1,2})\D{0,3}([a-z]+)\D{0,3}(\d{4})/);
  if (m && MONTHS[m[2]] !== undefined) return new Date(+m[3], MONTHS[m[2]], +m[1]);

  return null;
}

export interface ArticleBuckets {
  latest: Article[];
  featured: Article[]; // this-year articles NOT already shown in `latest`
  archived: Article[];
}

export function bucketArticles(articles: Article[], now: Date = new Date()): ArticleBuckets {
  const currentYear = now.getFullYear();
  const windowStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // Manual override first: anything explicitly archived in the admin goes
  // straight to Archived, no date logic involved. Everything else falls
  // through to the automatic year/month rules below.
  const manuallyArchived = articles.filter(a => a.archived === true);
  const rest = articles.filter(a => a.archived !== true);

  const withDates = rest.map(a => ({ a, d: parseArticleDate(a.date) }));

  // Newest first. Undated articles sort last but are still shown (in
  // Featured) rather than silently disappearing.
  const sorted = [...withDates].sort((x, y) => {
    const tx = x.d ? x.d.getTime() : -Infinity;
    const ty = y.d ? y.d.getTime() : -Infinity;
    return ty - tx;
  });

  const thisYear: Article[] = [];
  const autoArchived: Article[] = [];

  for (const { a, d } of sorted) {
    if (d && d.getFullYear() < currentYear) autoArchived.push(a);
    else thisYear.push(a);
  }

  const latestIds = new Set<string>();
  const latest: Article[] = [];
  for (const { a, d } of sorted) {
    if (d && d.getFullYear() === currentYear && d >= windowStart) {
      latest.push(a);
      latestIds.add(a.id);
    }
  }

  const featured = thisYear.filter(a => !latestIds.has(a.id));

  // Manually archived articles are sorted newest-first alongside the
  // auto-archived (prior-year) ones so the Archived list stays consistent.
  const archivedSorted = [...manuallyArchived, ...autoArchived].sort((x, y) => {
    const dx = parseArticleDate(x.date);
    const dy = parseArticleDate(y.date);
    const tx = dx ? dx.getTime() : -Infinity;
    const ty = dy ? dy.getTime() : -Infinity;
    return ty - tx;
  });

  return { latest, featured, archived: archivedSorted };
}

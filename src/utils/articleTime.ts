// Articles created on/after this date get the new "date + time + Updated" line.
// Older articles keep showing their original typed date, unchanged.
// Set this to the day you deploy.
const NEW_FORMAT_FROM = new Date('2026-10-31T00:00:00');

// Updates within this many minutes of publishing are treated as typo fixes
// and don't show an "Updated" label.
const UPDATE_GRACE_MINUTES = 10;

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const fmtTime = (d: Date) =>
  d
    .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    .replace(/\s?(AM|PM)/i, (_m, p) => ' ' + p.toLowerCase()); // "2:29 pm"

const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); // "26 October 2026"

const dayLabel = (d: Date, now: Date) => (sameDay(d, now) ? 'Today' : fmtDate(d));

export function formatArticleTimes(article: {
  date?: string;
  createdAt?: string;
  updatedAt?: string;
}): { published: string; updated: string } {
  const created = article.createdAt ? new Date(article.createdAt) : null;

  // Old article (or missing timestamp): show the original date text as before.
   if (!created || isNaN(created.getTime()) || created < NEW_FORMAT_FROM) {
    const upd = article.updatedAt ? new Date(article.updatedAt) : null;
    const edited = !!upd && !isNaN(upd.getTime()) && upd >= NEW_FORMAT_FROM;
    return {
      published: article.date || '',
      updated: edited ? `Updated ${dayLabel(upd!, new Date())}, ${fmtTime(upd!)}` : '',
    };
  }

  const now = new Date();
  const published = `${dayLabel(created, now)}, ${fmtTime(created)}`;

  let updated = '';
  const upd = article.updatedAt ? new Date(article.updatedAt) : null;
  if (upd && !isNaN(upd.getTime())) {
    const minutes = (upd.getTime() - created.getTime()) / 60000;
    if (minutes > UPDATE_GRACE_MINUTES) {
      updated = sameDay(upd, created)
        ? `Updated at ${fmtTime(upd)}`
        : `Updated ${dayLabel(upd, now)}, ${fmtTime(upd)}`;
    }
  }

  return { published, updated };
}

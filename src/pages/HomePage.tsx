

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdBanner } from '../components/AdBanner';
import { Hero } from '../components/Hero';
import { Article, articles as staticArticles } from '../data/siteData';
import { PartnersMarquee } from '../components/PartnersMarquee';
import { cld } from '../utils/Cloudinary';
import { AuthorAvatar } from '../components/AuthorAvatar';
type Tone = 'navy' | 'crimson' | 'gold' | 'lagoon' | 'azure';

const TONE: Record<Tone, {
  text: string; textFaint: string; bg: string; tick: string;
  hoverText: string; hoverBorder: string; groupHoverText: string;
  border: string; borderMed: string; wash: string; washStrong: string;
}> = {
  navy: {
    text: 'text-primary', textFaint: 'text-primary/40', bg: 'bg-primary', tick: 'bg-primary',
    hoverText: 'hover:text-primary', hoverBorder: 'hover:border-primary/50', groupHoverText: 'group-hover:text-primary',
    border: 'border-primary/15', borderMed: 'border-primary/30', wash: 'bg-primary/[0.05]', washStrong: 'bg-primary/10',
  },
  crimson: {
    text: 'text-accent', textFaint: 'text-accent/40', bg: 'bg-accent', tick: 'bg-accent',
    hoverText: 'hover:text-accent', hoverBorder: 'hover:border-accent/50', groupHoverText: 'group-hover:text-accent',
    border: 'border-accent/15', borderMed: 'border-accent/30', wash: 'bg-accent/[0.04]', washStrong: 'bg-accent/10',
  },
  gold: {
    text: 'text-gold', textFaint: 'text-gold/40', bg: 'bg-gold', tick: 'bg-gold',
    hoverText: 'hover:text-gold', hoverBorder: 'hover:border-gold/50', groupHoverText: 'group-hover:text-gold',
    border: 'border-gold/20', borderMed: 'border-gold/30', wash: 'bg-gold/[0.05]', washStrong: 'bg-gold/10',
  },
  lagoon: {
    text: 'text-lagoon', textFaint: 'text-lagoon/40', bg: 'bg-lagoon', tick: 'bg-lagoon',
    hoverText: 'hover:text-lagoon', hoverBorder: 'hover:border-lagoon/50', groupHoverText: 'group-hover:text-lagoon',
    border: 'border-lagoon/20', borderMed: 'border-lagoon/30', wash: 'bg-lagoon/[0.06]', washStrong: 'bg-lagoon/10',
  },
  azure: {
    text: 'text-azure', textFaint: 'text-azure/40', bg: 'bg-azure', tick: 'bg-azure',
    hoverText: 'hover:text-azure', hoverBorder: 'hover:border-azure/50', groupHoverText: 'group-hover:text-azure',
    border: 'border-azure/20', borderMed: 'border-azure/30', wash: 'bg-azure/[0.04]', washStrong: 'bg-azure/10',
  },
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

type CaucasusFeed = { armenia: Article[]; georgia: Article[]; azerbaijan: Article[] };
type HomeFeedData = {
  uk: Article[]; ep: Article[]; inf: Article[]; intv: Article[];
  vid: any[]; op: Article[]; ca: Article[]; eu: Article[]; ru: Article[];
  dc: Article[]; tash: Article[]; cauc: CaucasusFeed; avi: Article[]; hh: Article[]; kur: Article[];
};
let homeFeedCache: HomeFeedData | null = null;

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

const MONTHS: Record<string, number> = {
  january:0, february:1, march:2, april:3, may:4, june:5,
  july:6, august:7, september:8, october:9, november:10, december:11,
};
function parseDate(input: string): number {
  if (!input) return 0;
  const s = input.trim();
  const native = new Date(s);
  if (!isNaN(native.getTime()) && /\d{4}/.test(s)) return native.getTime();
  const lower = s.toLowerCase();
  let m = lower.match(/([a-z]+)\D{0,3}(\d{1,2})\D{0,3}(\d{4})/);
  if (m && MONTHS[m[1]] !== undefined) return new Date(+m[3], MONTHS[m[1]], +m[2]).getTime();
  m = lower.match(/(\d{1,2})\D{0,3}([a-z]+)\D{0,3}(\d{4})/);
  if (m && MONTHS[m[2]] !== undefined) return new Date(+m[3], MONTHS[m[2]], +m[1]).getTime();
  return 0;
}

async function fetchSectionHome(section: string, limit = 4): Promise<any[]> {
  try {
    const r = await fetch(`${API_URL}/section-articles/home/${section}?limit=${limit}`);
    if (!r.ok) return [];
    const data = await r.json();
    return section === 'video' ? data : data.map(toArticle);
  } catch { return []; }
}

async function fetchRegionSubcategory(area: string, subCategory: string, limit = 4): Promise<Article[]> {
  try {
    const r = await fetch(`${API_URL}/region-articles/region/${area}?subCategory=${subCategory}`);
    if (!r.ok) return [];
    const data = await r.json();
    return data
      .map(toArticle)
      .sort((a: Article, b: Article) => parseDate(b.date) - parseDate(a.date))
      .slice(0, limit);
  } catch { return []; }
}

async function fetchAllHomeFeeds(): Promise<HomeFeedData> {
  const [uk, ep, inf, intv, vid, op, ca, eu, ru, dc, tash, armenia, georgia, azerbaijan, avi, hh, kur] = await Promise.all([
    fetchSectionHome('uk', 4),
    fetchSectionHome('editors-picks', 4),
    fetchSectionHome('in-focus', 4),
    fetchSectionHome('interviews'),
    fetchSectionHome('video', 4),
    fetchSectionHome('opinion'),
    fetchSectionHome('central-asia', 8),
    fetchSectionHome('europe-home', 4),
    fetchSectionHome('russia-home', 5),
    fetchSectionHome('diplomatic-corner', 8),
    fetchSectionHome('tashkent', 5),
    fetchRegionSubcategory('caucasus', 'armenia', 4),
    fetchRegionSubcategory('caucasus', 'georgia', 4),
    fetchRegionSubcategory('caucasus', 'azerbaijan', 4),
    fetchSectionHome('aviation', 5),
    fetchSectionHome('hidden-histories', 8),
    fetchSectionHome('kazakhstan-kurultai-elections-2026', 5),
  ]);
  return { uk, ep, inf, intv, vid, op, ca, eu, ru, dc, tash, cauc: { armenia, georgia, azerbaijan }, avi, hh, kur };
}

function getYtThumb(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

const DARK_BG = 'bg-ink';

function CenterHeader({
  title, description, action, dark = false, tone = 'crimson', titleTo,
}: {
  title: string; description?: string; action?: React.ReactNode; dark?: boolean; tone?: Tone; titleTo?: string;
}) {
  const t = TONE[tone];
  return (
    <div className="mb-10 text-center">
      <div className={`mx-auto h-[3px] w-9 rounded-full ${t.tick}`} />
      <h2 className={`mt-4 text-[1.75rem] font-extrabold tracking-tight lg:text-[2.25rem] ${dark ? 'text-white' : 'text-ink'}`}>
        {titleTo ? (
          <Link to={titleTo} className={`group inline-flex items-center gap-2 transition ${t.hoverText}`}>
            {title}
            <span className="text-[0.6em] opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100">→</span>
          </Link>
        ) : title}
      </h2>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

function SideHeader({
  title, action, dark = false, tone = 'gold', titleTo,
}: {
  title: string; action?: React.ReactNode; dark?: boolean; tone?: Tone; titleTo?: string;
}) {
  const t = TONE[tone];
  return (
    <div className={`mb-10 flex flex-wrap items-end justify-between gap-4 border-b pb-6 ${dark ? 'border-white/10' : 'border-slate-200'}`}>
      <div className="flex items-center gap-3">
        <span className={`h-9 w-[3px] rounded-full ${t.tick}`} />
        <h2 className={`text-[1.9rem] font-extrabold tracking-tight lg:text-4xl ${dark ? 'text-white' : 'text-ink'}`}>
          {titleTo ? (
            <Link to={titleTo} className={`group inline-flex items-center gap-2 transition ${t.hoverText}`}>
              {title}
              <span className="text-[0.55em] opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100">→</span>
            </Link>
          ) : title}
        </h2>
      </div>
      {action && <div className="hidden sm:block">{action}</div>}
    </div>
  );
}

function CategoryTag({ category, dark = false, tone = 'crimson' }: { category?: string; dark?: boolean; tone?: Tone }) {
  if (!category) return null;
  const t = TONE[tone];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] ${dark ? 'text-slate-300' : 'text-slate-500'}`}>
      <span className={`h-[3px] w-3 rounded-full ${t.tick}`} />
      {category}
    </span>
  );
}

function CoverageLink({ to, label = 'All Coverage', dark = false, tone = 'crimson' }: { to: string; label?: string; dark?: boolean; tone?: Tone }) {
  const t = TONE[tone];
  return (
    <Link
      to={to}
      className={`group inline-flex shrink-0 items-center gap-2 text-[13px] font-bold uppercase tracking-[0.1em] transition ${dark ? 'text-white' : 'text-ink'} ${t.hoverText}`}
    >
      {label}
      <span className="transition group-hover:translate-x-1">→</span>
    </Link>
  );
}

function ArrowCarousel({ items, renderCard, tone = 'crimson' }: { items: any[]; renderCard: (item: any) => React.ReactNode; tone?: Tone }) {
  const t = TONE[tone];
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
        <div className="mt-10 flex items-center justify-center gap-4">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-lg text-slate-400 transition ${t.hoverBorder} ${t.hoverText} disabled:cursor-not-allowed disabled:opacity-30`}>←</button>
          <div className="flex gap-2">
            {Array.from({ length: maxPage + 1 }).map((_, i) => (
              <button key={i} onClick={() => setPage(i)}
                className={`h-1.5 rounded-full transition-all ${i === page ? `w-6 ${t.bg}` : 'w-1.5 bg-slate-400/40 hover:bg-slate-400/70'}`} />
            ))}
          </div>
          <button onClick={() => setPage(p => Math.min(maxPage, p + 1))} disabled={page === maxPage}
            className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-lg text-slate-400 transition ${t.hoverBorder} ${t.hoverText} disabled:cursor-not-allowed disabled:opacity-30`}>→</button>
        </div>
      )}
    </div>
  );
}

function ListRow({
  article, tone = 'crimson', dark = false, index, showThumb = true, divider = true,
}: {
  article: Article; tone?: Tone; dark?: boolean; index?: number; showThumb?: boolean; divider?: boolean;
}) {
  const t = TONE[tone];
  return (
    <Link
      to={`/article/${article.id}`}
      className={`group flex gap-4 py-4 first:pt-0 last:pb-0 ${divider ? (dark ? 'border-white/10' : 'border-slate-200') : ''} ${divider ? 'border-b last:border-b-0' : ''}`}
    >
      {typeof index === 'number' && (
        <span className={`mt-0.5 shrink-0 w-6 text-lg font-extrabold leading-none ${t.textFaint}`}>
          {String(index).padStart(2, '0')}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <CategoryTag category={article.category} dark={dark} tone={tone} />
        <h3 className={`mt-1 line-clamp-2 text-sm font-bold leading-snug transition ${dark ? `text-white ${t.groupHoverText}` : `text-ink ${t.groupHoverText}`}`}>
          {article.title}
        </h3>
        <p className={`mt-1.5 text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{article.author} · {article.date}</p>
      </div>
      {showThumb && article.image && (
        <div className="h-16 w-20 shrink-0 overflow-hidden rounded-md">
          <img src={cld(article.image, 300)} alt={article.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        </div>
      )}
    </Link>
  );
}

function LeadHorizontalCard({
  article, tone = 'crimson', imageSide = 'left', imageWidth = 'sm:w-[42%]', big = false,
}: {
  article: Article; tone?: Tone; imageSide?: 'left' | 'right'; imageWidth?: string; big?: boolean;
}) {
  const t = TONE[tone];
  return (
    <Link
      to={`/article/${article.id}`}
      className={`group flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md sm:flex-row ${t.border} ${imageSide === 'right' ? 'sm:flex-row-reverse' : ''}`}
    >
      <div className={`relative shrink-0 overflow-hidden ${imageWidth}`}>
        <div className="aspect-[16/10] h-full w-full">
          {article.image
            ? <img src={cld(article.image, 900)} alt={article.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            : <div className="h-full min-h-[220px] w-full bg-slate-100" />}
        </div>
        <span className={`absolute top-0 h-full w-1 ${t.bg} ${imageSide === 'right' ? 'right-0' : 'left-0'}`} />
      </div>
      <div className="flex flex-1 flex-col justify-center p-6 lg:p-8">
        <CategoryTag category={article.category} tone={tone} />
        <h3 className={`mt-2 font-bold leading-tight text-ink ${big ? 'text-2xl lg:text-[1.75rem]' : 'text-xl'}`}>{article.title}</h3>
        {article.subtitle && <p className="mt-2.5 text-sm text-slate-500 line-clamp-2">{article.subtitle}</p>}
        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">{article.author} · {article.date}</p>
      </div>
    </Link>
  );
}

function Shimmer({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200/70 ${className}`} />;
}

function HomeSkeleton() {
  return (
    <div className="space-y-16 py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Shimmer key={i} className="h-64 w-full" />)}
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="grid gap-6 xl:grid-cols-[1.35fr,1fr]">
          <Shimmer className="h-80 w-full" />
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => <Shimmer key={i} className="h-24 w-full" />)}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Shimmer key={i} className="h-56 w-full" />)}
        </div>
      </div>
    </div>
  );
}

function UKSection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;
  const [lead, ...rest] = articles;
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
      <CenterHeader tone="navy" title="United Kingdom" titleTo="/section/uk"
        description="Latest analysis, policy coverage and reporting from the United Kingdom." />
      <div className="grid gap-8 lg:grid-cols-[1.6fr,1fr]">
        <LeadHorizontalCard article={lead} tone="navy" imageWidth="sm:w-1/2" big />
        <div className="flex flex-col rounded-xl border border-primary/15 bg-white px-6">
          <p className="border-b border-slate-200 pb-3 pt-5 text-[11px] font-black uppercase tracking-[0.14em] text-primary/60">Also Today</p>
          <div className="flex-1">
            {rest.slice(0, 3).map(article => (
              <ListRow key={article.id} article={article} tone="navy" />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8">
        <AdBanner identifier="homepage-banner-2" />
      </div>
    </section>
  );
}

function EditorsPicksSection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;
  const [top, ...rest] = articles;
  return (
    <section className="bg-soft py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <CenterHeader tone="gold" title="Editor's Picks" titleTo="/section/editors-picks"
          description="Hand-selected stories from our editorial team — the most important reads this week." />
        <div className="grid gap-6 xl:grid-cols-[1.35fr,1fr]">
          <Link to={`/article/${top.id}`} className="group relative overflow-hidden rounded-xl border border-gold/20 shadow-sm">
            <div className="aspect-[16/10] overflow-hidden">
              {top.image
                ? <img src={cld(top.image, 1200)} alt={top.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                : <div className="h-full w-full bg-slate-100" />}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <span className="pointer-events-none absolute -right-2 -top-6 select-none font-black text-white/10" style={{ fontSize: '9rem', lineHeight: 1 }}>01</span>
            <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
              <CategoryTag category={top.category} dark tone="gold" />
              <h3 className="mt-2 text-2xl font-bold leading-tight text-white lg:text-3xl">{top.title}</h3>
              {top.subtitle && <p className="mt-2 max-w-lg text-sm text-white/70 line-clamp-2">{top.subtitle}</p>}
              <p className="mt-3 text-xs text-white/50">{top.author} · {top.date}</p>
            </div>
          </Link>
          <div className="flex flex-col rounded-xl border border-gold/20 bg-white px-6">
            {rest.slice(0, 3).map((article, i) => (
              <ListRow key={article.id} article={article} tone="gold" index={i + 2} />
            ))}
          </div>
        </div>
        <div className="my-12 grid gap-6 lg:grid-cols-2">
          <AdBanner identifier="homepage-banner-3" />
          <AdBanner identifier="homepage-banner-4" />
        </div>
      </div>
    </section>
  );
}

function InFocusSection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;
  const [lead, ...rest] = articles;
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
      <CenterHeader tone="crimson" title="In Focus" titleTo="/section/in-focus"
        description="Deep dives and long-form analysis on the stories that demand closer attention." />
      <div className="grid gap-6 lg:grid-cols-3">
        <Link to={`/article/${lead.id}`} className="group relative overflow-hidden rounded-xl border border-accent/15 lg:col-span-2">
          <div className="aspect-[16/9] overflow-hidden lg:aspect-[16/10]">
            {lead.image
              ? <img src={cld(lead.image, 1200)} alt={lead.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              : <div className="h-full w-full bg-slate-100" />}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
          <span className="absolute left-6 top-6 rounded-full bg-accent px-3 py-1 text-[10.5px] font-black uppercase tracking-[0.14em] text-white">Dossier</span>
          <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
            <CategoryTag category={lead.category} dark tone="crimson" />
            <h3 className="mt-2 text-2xl font-bold leading-tight text-white lg:text-3xl">{lead.title}</h3>
            {lead.subtitle && <p className="mt-2 max-w-xl text-sm text-white/70 line-clamp-2">{lead.subtitle}</p>}
            <p className="mt-3 text-xs text-white/50">{lead.author} · {lead.date}</p>
          </div>
        </Link>
        <div className="flex flex-col justify-between gap-5">
          {rest.slice(0, 3).map((article, i) => (
            <Link key={article.id} to={`/article/${article.id}`}
              className="group flex flex-1 gap-4 rounded-lg border border-accent/10 bg-white p-4 transition hover:border-accent/30 hover:shadow-sm">
              <span className="shrink-0 pt-0.5 text-[11px] font-black tracking-widest text-accent/40">F.{String(i + 2).padStart(2, '0')}</span>
              <div className="min-w-0 flex-1">
                <CategoryTag category={article.category} tone="crimson" />
                <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-ink transition group-hover:text-accent">{article.title}</h3>
                <p className="mt-1.5 text-xs text-slate-400">{article.author} · {article.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlayGlyph({ className = 'h-5 w-5' }: { className?: string }) {
  return <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>;
}

function InterviewsSection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;
  return (
    <section className={DARK_BG + ' py-16'}>
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <CenterHeader dark tone="lagoon" title="Interviews" titleTo="/section/interviews"
          description="In-depth conversations with policymakers, analysts and global voices." />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {articles.map(article => (
            <Link key={article.id} to={`/article/${article.id}`} className="group relative overflow-hidden rounded-xl border border-lagoon/15">
              <div className="aspect-[3/4] overflow-hidden">
                {article.image
                  ? <img src={cld(article.image, 700)} alt={article.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  : <div className="h-full w-full bg-slate-800" />}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
              <span className="absolute left-4 top-4 font-serif text-4xl leading-none text-lagoon/60">&rdquo;</span>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <CategoryTag category={article.category} dark tone="lagoon" />
                <h3 className="mt-2 line-clamp-3 text-sm font-bold leading-snug text-white">{article.title}</h3>
                <p className="mt-2 text-xs text-lagoon/70">{article.author} · {article.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function VideoSection({ videos }: { videos: any[] }) {
  if (!videos.length) return null;
  const [feature, ...rest] = videos;
  const featureId = feature._id || feature.id || '';
  const featureThumb = feature.imageUrl || (feature.videoId ? getYtThumb(feature.videoId) : '');
  return (
    <section className={DARK_BG + ' py-16'}>
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <CenterHeader dark tone="crimson" title="Watch & Learn" titleTo="/section/video"
          description="Video reports, documentary clips and analysis from our global team."
        />
        <div className="grid gap-6 lg:grid-cols-[1.5fr,1fr]">
          <Link to={`/video/${featureId}`} className="group relative overflow-hidden rounded-xl border border-accent/20">
            <div className="aspect-video overflow-hidden">
              {featureThumb && <img src={cld(featureThumb, 1000)} alt={feature.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent shadow-lg transition group-hover:scale-110">
                <span className="ml-1 text-white"><PlayGlyph className="h-6 w-6" /></span>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6">
              <span className="rounded bg-accent px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">Featured</span>
              <h3 className="mt-2 text-xl font-bold text-white">{feature.title}</h3>
              <p className="mt-1.5 text-xs text-white/50">{feature.author} · {feature.date}</p>
            </div>
          </Link>
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">Watch Next</p>
            {rest.slice(0, 3).map((v: any) => {
              const id = v._id || v.id || '';
              const thumb = v.imageUrl || (v.videoId ? getYtThumb(v.videoId) : '');
              return (
                <Link key={id} to={`/video/${id}`} className="group flex gap-3 overflow-hidden rounded-lg border border-accent/15 bg-accent/[0.04] p-3 transition hover:bg-accent/[0.09]">
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md">
                    {thumb && <img src={cld(thumb, 300)} alt={v.title} className="h-full w-full object-cover" />}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <span className="text-white"><PlayGlyph className="h-4 w-4" /></span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-sm font-bold text-white">{v.title}</h3>
                    <p className="mt-1 text-xs text-slate-500">{v.author} · {v.date}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}





function OpinionSection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;
  return (
    <section className="bg-soft py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <CenterHeader tone="gold" title="Opinion" titleTo="/section/opinion"
          description="Perspectives from analysts, contributors and thought leaders."
        />
        <div className="mx-auto grid max-w-5xl divide-y divide-slate-200 sm:grid-cols-2 sm:divide-y-0">
          {articles.map((article, i) => (
            <Link key={article.id} to={`/article/${article.id}`}
              className={`group flex gap-4 py-6 sm:px-6 ${i % 2 === 0 ? 'sm:border-r sm:border-slate-200' : ''}`}>
              <AuthorAvatar name={article.author} size="md" />
              <div className="min-w-0 flex-1">
                <CategoryTag category={article.category} tone="gold" />
                <h3 className="mt-1.5 font-serif text-lg italic leading-snug text-ink transition group-hover:text-gold">{article.title}</h3>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{article.author} · {article.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CentralAsiaSection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;
  return (
    <section className={DARK_BG + ' py-16'}>
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <CenterHeader dark tone="lagoon" title="Central Asia Coverage" titleTo="/region/asia/central-asia"
          description="Strategic reporting from Kazakhstan, Uzbekistan, Kyrgyzstan, Tajikistan and Turkmenistan."
        />
        <ArrowCarousel tone="lagoon" items={articles} renderCard={(article: Article) => (
          <Link to={`/article/${article.id}`} className="group block overflow-hidden rounded-xl border-t-2 border-lagoon bg-lagoon/[0.06] transition hover:-translate-y-1 hover:bg-lagoon/[0.12]">
            {article.image && (
              <div className="aspect-[4/3] overflow-hidden">
                <img src={cld(article.image, 600)} alt={article.title} className="h-full w-full object-cover transition group-hover:scale-105" />
              </div>
            )}
            <div className="p-5">
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-lagoon">Dispatch</span>
              <h3 className="mt-1.5 line-clamp-2 text-sm font-bold text-white">{article.title}</h3>
              <p className="mt-1.5 text-xs text-slate-500">{article.author} · {article.date}</p>
            </div>
          </Link>
        )} />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SECTION — Kazakhstan "Kurultai" Elections 2026
   Concept: "Election Watch" — a formal, official-feeling briefing (navy,
   the same tone used for UK/Europe's structural sections) rather than
   the carousel/dispatch treatment right above it, so a reader can tell
   at a glance this is a distinct, event-specific desk and not just more
   Central Asia coverage. The lead card carries a ballot-badge instead
   of Central Asia's "Dispatch" tag or In Focus's "Dossier" stamp.
   ═══════════════════════════════════════════════════════════════════ */
function KurultaiSection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;
  const [lead, ...rest] = articles;
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <CenterHeader tone="navy" title="Kazakhstan 'Kurultai' Elections 2026" titleTo="/section/kazakhstan-kurultai-elections-2026"
          description="Full coverage of Kazakhstan's 2026 Kurultai elections — candidates, results and analysis."
        />
        <div className="grid gap-8 lg:grid-cols-[1.6fr,1fr]">
          <Link to={`/article/${lead.id}`} className="group relative overflow-hidden rounded-xl border border-primary/15">
            <div className="aspect-[16/9] overflow-hidden lg:aspect-[16/10]">
              {lead.image
                ? <img src={cld(lead.image, 1200)} alt={lead.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                : <div className="h-full w-full bg-slate-100" />}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
            <span className="absolute left-6 top-6 rounded-full bg-primary px-3 py-1 text-[10.5px] font-black uppercase tracking-[0.14em] text-white">
              🗳️ Election Watch
            </span>
            <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
              <CategoryTag category={lead.category} dark tone="navy" />
              <h3 className="mt-2 text-2xl font-bold leading-tight text-white lg:text-3xl">{lead.title}</h3>
              {lead.subtitle && <p className="mt-2 max-w-xl text-sm text-white/70 line-clamp-2">{lead.subtitle}</p>}
              <p className="mt-3 text-xs text-white/50">{lead.author} · {lead.date}</p>
            </div>
          </Link>
          <div className="flex flex-col rounded-xl border border-primary/15 bg-white px-6">
            <p className="border-b border-slate-200 pb-3 pt-5 text-[11px] font-black uppercase tracking-[0.14em] text-primary/60">More Election Coverage</p>
            <div className="flex-1">
              {rest.slice(0, 4).map(article => (
                <ListRow key={article.id} article={article} tone="navy" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EuropeSection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;
  const [lead, ...rest] = articles;
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <CenterHeader tone="navy" title="Europe" titleTo="/region/europe"
          description="Western, Eastern, Northern and Southern Europe — diplomacy, security and economics."
        />
        {rest.length === 0 ? (
          <LeadHorizontalCard article={lead} tone="navy" imageWidth="sm:w-1/2" big />
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-[1.5fr,1fr]">
            <LeadHorizontalCard article={lead} tone="navy" imageWidth="sm:w-[45%]" big />
            <div className="rounded-xl border border-primary/15 bg-white px-6">
              <p className="border-b border-slate-200 pb-3 pt-5 text-[11px] font-black uppercase tracking-[0.14em] text-primary/60">Briefing</p>
              {rest.slice(0, 4).map(article => (
                <ListRow key={article.id} article={article} tone="navy" showThumb={false} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function RussiaSection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;
  const [lead, ...rest] = articles;
  const side = rest.slice(0, 4);
  return (
    <section className="bg-soft py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <CenterHeader tone="crimson" title="Russia" titleTo="/region/russia"
          description="Strategic reporting, politics, diplomacy and economic coverage from Russia."
        />
        {side.length === 0 ? (
          <LeadHorizontalCard article={lead} tone="crimson" imageWidth="sm:w-1/2" big />
        ) : (
          <div className="grid items-start gap-8 xl:grid-cols-[1.6fr,420px]">
            <LeadHorizontalCard article={lead} tone="crimson" imageWidth="sm:w-[42%]" big />
            <div className="rounded-xl border border-accent/15 bg-white px-6">
              <p className="border-b border-slate-200 pb-3 pt-5 text-[11px] font-black uppercase tracking-[0.14em] text-accent/60">More From Russia</p>
              {side.map(article => (
                <ListRow key={article.id} article={article} tone="crimson" />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function TashkentSection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;
  const lead = articles[0];
  const rest = articles.slice(1, 5);
  const hasRest = rest.length > 0;

  const LeadCard = (
    <Link to={`/article/${lead.id}`} className="group relative block overflow-hidden rounded-xl">
      <div className={`overflow-hidden ${hasRest ? 'aspect-[16/9] max-h-[360px]' : 'aspect-[21/9] max-h-[420px]'}`}>
        {lead.image
          ? <img src={cld(lead.image, 1200)} alt={lead.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          : <div className="h-full w-full bg-slate-800" />
        }
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      <div className="absolute left-0 top-0 h-full w-1 bg-gold" />
      <div className={`absolute bottom-0 left-0 right-0 p-6 ${!hasRest ? 'lg:p-8' : ''}`}>
        <CategoryTag category={lead.category} dark tone="gold" />
        <h3 className={`mt-2 font-bold leading-tight text-white ${hasRest ? 'text-xl lg:text-2xl' : 'text-2xl lg:text-3xl max-w-2xl'}`}>{lead.title}</h3>
        {lead.subtitle && <p className={`mt-1.5 text-sm text-white/60 line-clamp-2 ${!hasRest ? 'max-w-xl' : ''}`}>{lead.subtitle}</p>}
        <p className="mt-2.5 text-xs text-white/40">{lead.author} · {lead.date}</p>
      </div>
    </Link>
  );

  return (
    <section className={DARK_BG + ' py-16'}>
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <SideHeader dark tone="gold" title="Tashkent" titleTo="/section/tashkent" action={<CoverageLink to="/section/tashkent" dark tone="gold" />} />

        {hasRest ? (
          <div className="grid gap-6 lg:grid-cols-[1.5fr,1fr]">
            {LeadCard}
            <div className="flex flex-col divide-y divide-white/10">
              {rest.map((article, i) => (
                <Link key={article.id} to={`/article/${article.id}`}
                  className="group flex gap-4 py-4 first:pt-0 last:pb-0 transition hover:opacity-80">
                  <span className="mt-1 shrink-0 text-xl font-extrabold text-gold/40 leading-none w-6">
                    {String(i + 2).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <CategoryTag category={article.category} dark tone="gold" />
                    <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-white group-hover:text-gold transition">{article.title}</h3>
                    <p className="mt-1.5 text-xs text-slate-500">{article.author} · {article.date}</p>
                  </div>
                  {article.image && (
                    <img src={cld(article.image, 300)} alt={article.title} className="h-14 w-16 shrink-0 rounded-md object-cover opacity-80" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        ) : LeadCard}

        <div className="mt-8 sm:hidden text-center">
        </div>
      </div>
    </section>
  );
}

function CaucasusSection({ armenia, georgia, azerbaijan }: { armenia: Article[]; georgia: Article[]; azerbaijan: Article[] }) {
  const countries = [
    { key: 'armenia', label: 'Armenia', articles: armenia, to: '/region/caucasus/armenia' },
    { key: 'georgia', label: 'Georgia', articles: georgia, to: '/region/caucasus/georgia' },
    { key: 'azerbaijan', label: 'Azerbaijan', articles: azerbaijan, to: '/region/caucasus/azerbaijan' },
  ].filter(c => c.articles.length > 0);

  if (countries.length === 0) return null;

  return (
    <section className={DARK_BG + ' py-16'}>
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <CenterHeader dark tone="lagoon" title="Caucasus Coverage" titleTo="/region/caucasus"
          description="Strategic reporting from Armenia, Georgia and Azerbaijan."
        />
        <div className={`grid gap-6 ${countries.length === 1 ? '' : countries.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
          {countries.map(c => (
            <div key={c.key} className="rounded-xl border border-lagoon/20 bg-lagoon/[0.05] px-5 py-5">
              <Link to={c.to} className="group mb-3 flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-lg font-extrabold text-white transition group-hover:text-lagoon">{c.label}</h3>
                <span className="text-lagoon transition group-hover:translate-x-1">→</span>
              </Link>
              <div className="flex flex-col">
                {c.articles.slice(0, 4).map(article => (
                  <ListRow key={article.id} article={article} tone="lagoon" dark />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AviationSection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;
  const [main, ...rest] = articles;
  const hasRest = rest.length > 0;

  const MainCard = (
    <Link to={`/article/${main.id}`}
      className="group relative block overflow-hidden rounded-xl border border-azure/20 shadow-sm">
      <div className={`overflow-hidden ${hasRest ? 'aspect-[16/9] max-h-[360px]' : 'aspect-[21/9] max-h-[420px]'}`}>
        {main.image
          ? <img src={cld(main.image, 1400)} alt={main.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          : <div className="h-full w-full bg-slate-200" />
        }
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div className={`absolute bottom-0 left-0 right-0 p-6 ${!hasRest ? 'lg:p-8' : ''}`}>
        <CategoryTag category={main.category} dark tone="azure" />
        <h3 className={`mt-2 font-bold leading-tight text-white ${hasRest ? 'text-xl lg:text-2xl' : 'text-2xl lg:text-3xl max-w-2xl'}`}>{main.title}</h3>
        {main.subtitle && <p className={`mt-1.5 text-sm text-white/75 ${!hasRest ? 'max-w-xl line-clamp-2' : ''}`}>{main.subtitle}</p>}
        <p className="mt-2.5 text-xs text-white/50">{main.author} · {main.date}</p>
      </div>
    </Link>
  );

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <SideHeader tone="azure" title="Aviation" titleTo="/section/aviation"  />

        {hasRest ? (
          <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
            {MainCard}
            <div className="flex flex-col gap-3">
              {rest.slice(0, 4).map((article) => (
                <Link key={article.id} to={`/article/${article.id}`}
                  className="group relative flex gap-3 overflow-hidden rounded-lg border border-dashed border-azure/30 bg-azure/[0.04] p-3 transition hover:-translate-y-0.5 hover:bg-azure/[0.08]">
                  {article.image && (
                    <div className="h-16 w-20 flex-shrink-0 overflow-hidden rounded-md">
                      <img src={cld(article.image, 300)} alt={article.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <CategoryTag category={article.category} tone="azure" />
                    <h3 className="mt-1 line-clamp-2 text-sm font-bold text-ink">{article.title}</h3>
                    <p className="mt-1 text-xs text-slate-400">{article.author} · {article.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : MainCard}
      </div>
    </section>
  );
}


function HiddenHistoriesSection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;
  return (
    <section className="bg-soft py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <CenterHeader tone="gold" title="Hidden Histories / Stories" titleTo="/section/hidden-histories"
          description="Untold stories and forgotten chapters resurfaced — the histories that shaped today, rediscovered."
        />
        <ArrowCarousel tone="gold" items={articles} renderCard={(article: Article) => (
          <Link to={`/article/${article.id}`}
            className="group relative block overflow-hidden rounded-xl border border-gold/25 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="relative aspect-[4/3] overflow-hidden">
              {article.image
                ? <img
                    src={cld(article.image, 600)}
                    alt={article.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    style={{ filter: 'sepia(0.18) contrast(1.02)' }}
                  />
                : <div className="h-full w-full bg-slate-100" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent" />
             
            </div>
            <div className="p-5">
              <CategoryTag category={article.category} tone="gold" />
              <h3 className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug text-ink">{article.title}</h3>
              <p className="mt-1.5 text-xs text-slate-400">{article.author} · {article.date}</p>
            </div>
          </Link>
        )} />
      </div>
    </section>
  );
}

function DiplomaticCornerSection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;
  return (
    <section className={DARK_BG + ' py-16'}>
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <CenterHeader dark tone="navy" title="Geopolitical Dispatch" titleTo="/section/geopolitical-dispatch"
          description="In-depth diplomatic analysis, treaties, negotiations and foreign policy insights."
        />
        <ArrowCarousel tone="navy" items={articles} renderCard={(article: Article) => (
          <Link to={`/article/${article.id}`} className="group block overflow-hidden rounded-xl border border-primary/25 bg-primary/[0.08] transition hover:-translate-y-1 hover:bg-primary/[0.15]">
            {article.image && (
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={cld(article.image, 600)} alt={article.title} className="h-full w-full object-cover opacity-90 transition group-hover:scale-105" />
                <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/70 bg-primary/70 text-[10px] font-black uppercase tracking-wide text-white backdrop-blur-sm">DC</span>
              </div>
            )}
            <div className="p-5">
              <CategoryTag category={article.category} dark tone="navy" />
              <h3 className="mt-1 line-clamp-2 text-sm font-bold text-white">{article.title}</h3>
              <p className="mt-1.5 text-xs text-slate-500">{article.author} · {article.date}</p>
            </div>
          </Link>
        )} />
      </div>
    </section>
  );
}

export function HomePage() {
  const staticUK      = useMemo(() => staticArticles.filter(a => a.region === 'United Kingdom').slice(0, 4), []);
  const staticEdPick  = useMemo(() => staticArticles.filter(a => a.featured).slice(0, 4), []);
  const staticIntvw   = useMemo(() => staticArticles.filter(a => a.category === 'Interviews' || a.topic === 'Interviews').slice(0, 4), []);

  const [feed, setFeed] = useState<HomeFeedData | null>(homeFeedCache);
  const [homeLoaded, setHomeLoaded] = useState(homeFeedCache !== null);

  useEffect(() => {
    let cancelled = false;
    fetchAllHomeFeeds().then((data) => {
      if (cancelled) return;
      homeFeedCache = data;
      setFeed(data);
      setHomeLoaded(true);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!homeLoaded || !feed) {
    return (
      <div>
        <Hero />
        <HomeSkeleton />
      </div>
    );
  }

  const displayUK       = feed.uk.length      ? feed.uk      : staticUK;
  const displayEdPick   = feed.ep.length      ? feed.ep      : staticEdPick;
  // In Focus intentionally has NO static/demo fallback — this section
  // should stay hidden (InFocusSection already returns null on an empty
  // array) until the admin publishes a real In Focus article, rather
  // than silently showing placeholder content that looks like real news.
  const displayInFocus  = feed.inf;
  const displayIntvw    = feed.intv.length    ? feed.intv    : staticIntvw;
  const displayVideos   = feed.vid;
  const displayOpinion  = feed.op;
  const displayCA       = feed.ca;
  const displayEurope   = feed.eu;
  const displayRussia   = feed.ru;
  const displayDiplo    = feed.dc;
  const displayTashkent = feed.tash;
  const displayCaucasus = feed.cauc;
  const displayAviation = feed.avi;
  const displayHiddenHistories = feed.hh;
  const displayKurultai = feed.kur;

  return (
    <div>
      <Hero />

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <AdBanner identifier="homepage-banner-1" />
      </section>

      <UKSection articles={displayUK} />
      <EditorsPicksSection articles={displayEdPick} />
      <InFocusSection articles={displayInFocus} />
      <InterviewsSection articles={displayIntvw} />
      <VideoSection videos={displayVideos} />
      <OpinionSection articles={displayOpinion} />
      <CentralAsiaSection articles={displayCA} />
      <KurultaiSection articles={displayKurultai} />
      <EuropeSection articles={displayEurope} />
      <RussiaSection articles={displayRussia} />

      <TashkentSection articles={displayTashkent} />
      <CaucasusSection armenia={displayCaucasus.armenia} georgia={displayCaucasus.georgia} azerbaijan={displayCaucasus.azerbaijan} />
      <AviationSection articles={displayAviation} />
      <HiddenHistoriesSection articles={displayHiddenHistories} />

      <DiplomaticCornerSection articles={displayDiplo} />

      <PartnersMarquee />
    </div>
  );
}

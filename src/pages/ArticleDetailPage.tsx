
import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AdBanner } from '../components/AdBanner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function isHTML(str: string) {
  return /<[a-z][\s\S]*>/i.test(str) || /&lt;[a-z][\s\S]*&gt;/i.test(str);
}

function decodeAndStrip(html: string) {
  const ta = document.createElement('textarea');
  ta.innerHTML = html;
  const decoded = ta.value;
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

function getKeywords(title: string): string[] {
  const stop = new Set([
    'the','a','an','and','or','of','in','on','at','to','for','with','by','from',
    'is','are','was','were','how','what','why','when','who','that','this','has','have','its','their'
  ]);
  return title.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stop.has(w));
}

function HashtagBox({ hashtags }: { hashtags?: string[] }) {
  if (!Array.isArray(hashtags) || hashtags.length === 0) return null;
  return (
    <div className="mt-10 rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <div className="px-6 pt-6">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-slate-500">Hashtags</p>
      </div>
      <div className="p-6 pt-5">
        <div className="flex flex-wrap gap-3">
          {hashtags.map((tag, index) => (
            <span key={`${tag}-${index}`}
              className={index % 2 === 0
                ? 'inline-flex items-center rounded-full border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-red-50 transition hover:-translate-y-0.5 hover:bg-red-50'
                : 'inline-flex items-center rounded-full border border-primary/20 bg-white px-4 py-2.5 text-sm font-semibold text-primary shadow-sm ring-1 ring-primary/5 transition hover:-translate-y-0.5 hover:bg-primary/5'
              }>
              <span className="mr-1.5 text-[15px]">#</span>{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function extractVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v');
    if (u.hostname === 'youtu.be') return u.pathname.slice(1);
  } catch {}
  return null;
}

function ArticleBlock({ block }: { block: { type: string; value?: string; url?: string; videoUrl?: string } }) {
  if (block.type === 'image' && block.url) {
    return (
      <figure className="my-8 w-full">
        <img
          src={block.url}
          alt=""
          className="w-full rounded-2xl shadow-sm"
          style={{ height: 'auto', display: 'block' }}
        />
      </figure>
    );
  }

  if (block.type === 'video' && block.videoUrl) {
    const vid = extractVideoId(block.videoUrl);
    if (vid) {
      return (
        <div className="my-8 aspect-video w-full overflow-hidden rounded-2xl shadow-lg">
          <iframe
            src={`https://www.youtube.com/embed/${vid}?rel=0&modestbranding=1`}
            title="Embedded video"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
    return (
      <div className="my-8 w-full overflow-hidden rounded-2xl shadow-lg">
        <video src={block.videoUrl} controls className="w-full rounded-2xl" />
      </div>
    );
  }

  if (block.type === 'text' && block.value) {
    const html = block.value;
    const safe = isHTML(html) ? decodeAndStrip(html) : html;
    return isHTML(html)
      ? <div className="prose-article" dangerouslySetInnerHTML={{ __html: safe }} />
      : <div className="prose-article whitespace-pre-wrap text-slate-700 leading-relaxed">{safe}</div>;
  }

  return null;
}

/* ── Share Sidebar ── */
function ShareSidebar({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(title || '');

  const shareLinks = [
    {
      label: 'WhatsApp',
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      color: '#25D366',
      hoverColor: '#1ebe57',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
    },
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: '#1877F2',
      hoverColor: '#1565d8',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      label: 'Instagram',
      href: `https://www.instagram.com/`,
      color: '#E1306C',
      hoverColor: '#c2185b',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
    },
    {
      label: 'X (Twitter)',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: '#000000',
      hoverColor: '#1a1a1a',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
        </svg>
      ),
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement('input');
      input.value = pageUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={sidebarRef} className="flex flex-col items-center gap-3">
      {/* Share trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        title="Share this article"
        style={{
          background: open
            ? 'linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)'
            : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          boxShadow: open
            ? '0 8px 24px rgba(192,57,43,0.35)'
            : '0 8px 24px rgba(0,0,0,0.18)',
        }}
        className="relative flex h-12 w-12 items-center justify-center rounded-full text-white transition-all duration-300 hover:scale-110 active:scale-95"
      >
        {open ? (
          /* X icon */
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          /* Share icon */
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        )}
        {/* Pulse ring when closed */}
        {!open && (
          <span className="absolute inset-0 rounded-full animate-ping bg-slate-400/20" style={{ animationDuration: '2s' }} />
        )}
      </button>

      {/* Label */}
      {!open && (
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Share</span>
      )}

      {/* Share options — animate in */}
      <div
        className="flex flex-col items-center gap-2 overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: open ? `${(shareLinks.length + 1) * 56}px` : '0px',
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(-8px)',
        }}
      >
        {shareLinks.map((s, i) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            title={`Share on ${s.label}`}
            style={{
              backgroundColor: s.color,
              transitionDelay: open ? `${i * 40}ms` : '0ms',
              boxShadow: `0 4px 12px ${s.color}55`,
            }}
            className="group relative flex h-11 w-11 items-center justify-center rounded-full text-white transition-all duration-200 hover:scale-110 hover:brightness-110 active:scale-95"
          >
            {s.icon}
            {/* Tooltip */}
            <span className="pointer-events-none absolute left-14 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              {s.label}
              <span className="absolute left-0 top-1/2 -translate-x-1.5 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
            </span>
          </a>
        ))}

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          title="Copy article link"
          className="group relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:scale-110 hover:border-primary hover:text-primary active:scale-95"
        >
          {copied ? (
            <svg className="h-4.5 w-4.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          )}
          <span className="pointer-events-none absolute left-14 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            {copied ? 'Copied!' : 'Copy Link'}
            <span className="absolute left-0 top-1/2 -translate-x-1.5 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
          </span>
        </button>
      </div>
    </div>
  );
}

export function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setArticle(null);
    setRelated([]);
    setNotFound(false);

    const tryFetch = async () => {
      let art: any = null;
      let source = '';

      try {
        const r = await fetch(`${API_URL}/region-articles/${id}`);
        if (r.ok) { art = await r.json(); source = 'region'; }
      } catch {}

      if (!art) {
        try {
          const r = await fetch(`${API_URL}/section-articles/${id}`);
          if (r.ok) { art = await r.json(); source = 'section'; }
        } catch {}
      }

      if (!art) { setNotFound(true); setLoading(false); return; }

      setArticle(art);

      try {
        const keywords = getKeywords(art.title || '');
        let allArticles: any[] = [];
        if (source === 'region') {
          const r = await fetch(`${API_URL}/region-articles/region/${art.region}`);
          if (r.ok) allArticles = await r.json();
        } else {
          const r = await fetch(`${API_URL}/section-articles/section/${art.section}`);
          if (r.ok) allArticles = await r.json();
        }
        const scored = allArticles
          .filter((a: any) => (a._id || a.id) !== id && a.isActive !== false)
          .map((a: any) => ({ ...a, _score: getKeywords(a.title || '').filter((kw) => keywords.includes(kw)).length }))
          .sort((a: any, b: any) => b._score - a._score)
          .slice(0, 3);
        if (scored.length < 2) {
          const existing = new Set(scored.map((a: any) => a._id));
          const extras = allArticles.filter((a: any) => (a._id || a.id) !== id && !existing.has(a._id)).slice(0, 3 - scored.length);
          setRelated([...scored, ...extras]);
        } else {
          setRelated(scored);
        }
      } catch {}

      setLoading(false);
    };

    tryFetch();
  }, [id]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );

  if (notFound || !article) return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-2xl font-bold text-ink">Article not found</p>
      <button onClick={() => navigate(-1)}
        className="rounded-full bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary/90">
        ← Go Back
      </button>
    </div>
  );

  const content = article.content || '';
  const isVideo = article.section === 'video' && article.videoId;
  const hasBlocks = Array.isArray(article.blocks) && article.blocks.length > 0;

  return (
    <div>
      {article.imageUrl && !isVideo && (
        <div className="w-full">
          <img src={article.imageUrl} alt={article.title}
            className="w-full object-cover"
            style={{ height: 'clamp(320px, 55vw, 620px)' }} />
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        {/*
          ── Layout:
          [share sidebar (hidden on mobile)] | [article content] | [ad banner (xl only)]
          On mobile: share buttons appear inline below the Back button
        */}
        <div className="grid gap-10 xl:grid-cols-[56px,1fr,300px]">

          {/* ── LEFT: Share Sidebar (desktop sticky) ── */}
          <div className="hidden xl:flex xl:flex-col xl:items-center">
            <div className="sticky top-24 pt-1">
              <ShareSidebar title={article.title || ''} />
            </div>
          </div>

          {/* ── MIDDLE: Article content ── */}
          <div>
            {/* Back button row */}
            <div className="mb-6 flex items-center gap-3">
              <button onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-primary hover:text-primary">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                Back
              </button>

              {/* Mobile share row (visible only on small screens) */}
              <div className="flex items-center gap-2 xl:hidden">
                <MobileShareBar title={article.title || ''} />
              </div>
            </div>

            {isVideo && (
              <div className="mb-8 aspect-video w-full overflow-hidden rounded-2xl shadow-lg">
                <iframe
                  src={`https://www.youtube.com/embed/${article.videoId}?rel=0&modestbranding=1`}
                  title={article.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen />
              </div>
            )}

            <div className="text-xs font-bold uppercase tracking-[0.35em] text-accent">
              {article.category || article.section || ''}
            </div>

            <h1 className="mt-4 text-3xl font-black leading-tight text-ink lg:text-4xl">
              {article.title}
            </h1>

            {article.subtitle && <p className="mt-3 text-lg text-slate-600">{article.subtitle}</p>}

            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-400">
              <span>By <span className="font-semibold text-slate-600">{article.author}</span></span>
              <span>·</span>
              <span>{article.date}</span>
              {(article.region || article.subCategory) && (
                <>
                  <span>·</span>
                  <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                    {article.subCategory || article.region}
                  </span>
                </>
              )}
            </div>

            <hr className="my-8 border-slate-100" />

            {hasBlocks ? (
              <div className="space-y-0">
                {article.blocks.map((block: any, i: number) => (
                  <ArticleBlock key={i} block={block} />
                ))}
              </div>
            ) : (
              content && (
                isHTML(content)
                  ? <div className="prose-article" dangerouslySetInnerHTML={{ __html: decodeAndStrip(content) }} />
                  : <div className="prose-article whitespace-pre-wrap text-slate-700 leading-relaxed">{content}</div>
              )
            )}

            <HashtagBox hashtags={article.hashtags} />

            {related.length > 0 && (
              <div className="mt-16">
                <div className="mb-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-200" />
                  <p className="text-xs font-bold uppercase tracking-widest text-accent">Related Articles</p>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {related.map((rel: any) => {
                    const relId = rel._id || rel.id || '';
                    const isRelVideo = rel.section === 'video';
                    const linkTo = isRelVideo ? `/video/${relId}` : `/article/${relId}`;
                    return (
                      <Link key={relId} to={linkTo}
                        className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
                        {rel.imageUrl && (
                          <div className="aspect-[4/3] overflow-hidden">
                            <img src={rel.imageUrl} alt={rel.title}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                          </div>
                        )}
                        <div className="p-5">
                          <div className="text-xs font-bold uppercase tracking-[0.3em] text-accent">{rel.category}</div>
                          <h3 className="mt-2 line-clamp-2 text-base font-bold text-ink">{rel.title}</h3>
                          <p className="mt-1 text-xs text-slate-400">{rel.author} · {rel.date}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Ad banner (xl only) ── */}
          <div className="hidden xl:block">
            <div className="sticky top-6">
              <AdBanner vertical />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ── Mobile inline share bar (shown below Back button on small screens) ── */
function MobileShareBar({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(title || '');

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(pageUrl); }
    catch {
      const inp = document.createElement('input');
      inp.value = pageUrl;
      document.body.appendChild(inp); inp.select(); document.execCommand('copy'); document.body.removeChild(inp);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Share:</span>
      <a href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`} target="_blank" rel="noopener noreferrer"
        className="flex h-8 w-8 items-center justify-center rounded-full text-white shadow-sm transition hover:scale-110"
        style={{ backgroundColor: '#25D366' }} title="WhatsApp">
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer"
        className="flex h-8 w-8 items-center justify-center rounded-full text-white shadow-sm transition hover:scale-110"
        style={{ backgroundColor: '#1877F2' }} title="Facebook">
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </a>
      <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"
        className="flex h-8 w-8 items-center justify-center rounded-full text-white shadow-sm transition hover:scale-110"
        style={{ backgroundColor: '#E1306C' }} title="Instagram">
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      </a>
      <a href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`} target="_blank" rel="noopener noreferrer"
        className="flex h-8 w-8 items-center justify-center rounded-full text-white shadow-sm transition hover:scale-110"
        style={{ backgroundColor: '#000' }} title="X (Twitter)">
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
        </svg>
      </a>
      <button onClick={handleCopy} title="Copy link"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:scale-110 hover:border-primary hover:text-primary">
        {copied
          ? <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          : <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
        }
      </button>
    </div>
  );
}

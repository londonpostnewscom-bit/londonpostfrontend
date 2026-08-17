import { useEffect, useState } from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { liveVideos } from '../data/siteData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

type LiveVideoItem = {
  id: string;
  title: string;
  videoId: string;
  date?: string;
};

type LiveFeed = {
  main: LiveVideoItem | null;
  previous: LiveVideoItem[];
};

let liveFeedCache: LiveFeed | null = null;

function toItem(a: any): LiveVideoItem {
  return {
    id: a._id || a.id || '',
    title: a.title || '',
    videoId: a.videoId || '',
    date: a.date || '',
  };
}

async function fetchLiveFeed(): Promise<LiveFeed> {
  try {
    const r = await fetch(`${API_URL}/live`);
    if (!r.ok) return { main: null, previous: [] };
    const data = await r.json();
    return {
      main: data.main ? toItem(data.main) : null,
      previous: Array.isArray(data.previous) ? data.previous.map(toItem) : [],
    };
  } catch {
    return { main: null, previous: [] };
  }
}

function ytThumb(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

function Shimmer({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200/70 ${className}`} />;
}

function LiveSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <Shimmer className="mx-auto mb-3 h-4 w-28" />
        <Shimmer className="mx-auto mb-2 h-9 w-96 max-w-full" />
      </div>
      <Shimmer className="aspect-video w-full" />
      <div className="mt-12">
        <Shimmer className="mb-6 h-8 w-56" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Shimmer key={i} className="aspect-video w-full" />)}
        </div>
      </div>
    </div>
  );
}

/* Play button overlay used on every archive card — a filled circle with
   a soft shadow, scaling slightly on hover so the whole card reads as
   clickable at a glance, not just "an image with text under it". */
function PlayGlyph({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PreviousVideoCard({ video }: { video: LiveVideoItem }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-video overflow-hidden bg-slate-900">
        {playing ? (
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button onClick={() => setPlaying(true)} className="block h-full w-full" aria-label={`Play ${video.title}`}>
            <img
              src={ytThumb(video.videoId)}
              alt={video.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg transition group-hover:scale-110">
                <PlayGlyph />
              </div>
            </div>
          </button>
        )}
      </div>
      <div className="p-5">
        {video.date && (
          <div className="text-[11px] font-black uppercase tracking-[0.25em] text-accent">{video.date}</div>
        )}
        <h4 className="mt-2 line-clamp-2 text-lg font-bold leading-snug text-ink">{video.title}</h4>
      </div>
    </div>
  );
}

export function LivePage() {
  const [feed, setFeed] = useState<LiveFeed | null>(liveFeedCache);
  const [loaded, setLoaded] = useState(liveFeedCache !== null);

  useEffect(() => {
    let cancelled = false;
    fetchLiveFeed().then((data) => {
      if (cancelled) return;
      liveFeedCache = data;
      setFeed(data);
      setLoaded(true);
    });
    return () => { cancelled = true; };
  }, []);

  if (!loaded || !feed) return <LiveSkeleton />;

  // Fall back to the static demo data only when the backend genuinely
  // has nothing set yet — never during loading, so there's no flash of
  // unrelated placeholder content before the real data arrives.
  const mainVideo = feed.main || {
    id: 'static-main',
    title: liveVideos.current.title,
    videoId: liveVideos.current.youtubeId,
  };
  const previousVideos = feed.previous.length > 0
    ? feed.previous
    : liveVideos.previous.map((v, i) => ({ id: `static-${i}`, title: v.title, videoId: v.youtubeId, date: v.date }));

  return (
    <div id="live" className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
      <SectionHeading
        eyebrow="Live Podcast"
        title="Live stream hub with previous episodes"
        description="Catch the current broadcast at the top, then browse the full archive of earlier conversations below."
      />

      {/* ── Main featured video ──────────────────────────────────────
          A single, unmistakably "featured" frame: pulsing LIVE badge,
          gradient border glow, and the video itself sitting inside one
          cohesive card rather than a plain bordered box. */}
      <div className="relative">
        <div className="pointer-events-none absolute -inset-1 rounded-[2.25rem] bg-gradient-to-r from-accent/30 via-primary/20 to-accent/30 blur-xl" />
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
          <div className="relative aspect-video w-full bg-slate-900">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${mainVideo.videoId}?autoplay=0`}
              title={mainVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <div className="flex flex-wrap items-start justify-between gap-4 p-6 lg:p-8">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-accent">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                Featured
              </span>
              <h2 className="mt-3 text-2xl font-black leading-tight text-ink lg:text-3xl">{mainVideo.title}</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Watch the current broadcast — this stays here even after a live stream ends, since the recording
                remains at the same link.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Previous videos archive ────────────────────────────────── */}
      {previousVideos.length > 0 && (
        <div className="mt-16">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-9 w-[3px] rounded-full bg-accent" />
            <h3 className="text-2xl font-extrabold tracking-tight text-ink lg:text-3xl">Previous Episodes</h3>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {previousVideos.map((video) => (
              <PreviousVideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

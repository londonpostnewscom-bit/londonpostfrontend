import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdBanner } from '../components/AdBanner';
import { SectionHeading } from '../components/SectionHeading';
import { articles as staticArticles } from '../data/siteData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getThumb(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

function toVideoArticle(a: any) {
  return {
    id:       a._id || a.id || '',
    title:    a.title || '',
    subtitle: a.subtitle || '',
    category: a.category || '',
    author:   a.author || '',
    date:     a.date || '',
    videoId:  a.videoId || '',
    imageUrl: a.imageUrl || '',
    isFeatured: a.isFeatured || false,
    isArchived: a.isArchived || false,
  };
}

function PlayIcon() {
  return (
    <svg className="h-5 w-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export function VideoPage() {
  const navigate  = useNavigate();
  const [videos,   setVideos]   = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/section-articles/section/video`)
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setVideos(data.map(toVideoArticle)))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, []);

  const featured = videos.filter((v) => v.isFeatured && !v.isArchived).slice(0, 1);
  const latest   = videos.filter((v) => !v.isArchived).slice(0, 8);
  const archived = videos.filter((v) => v.isArchived).slice(0, 4);

  const heroVideo = featured[0] || latest[0] || null;
  const gridVideos = latest.filter((v) => v.id !== heroVideo?.id);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Hero */}
      {heroVideo && (
        <div
          className="relative h-[60vh] min-h-[400px] cursor-pointer overflow-hidden"
          onClick={() => navigate(`/video/${heroVideo.id}`)}
        >
          <img
            src={heroVideo.imageUrl || getThumb(heroVideo.videoId)}
            alt={heroVideo.title}
            className="h-full w-full object-cover transition duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 to-transparent" />

          {/* Play button */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-80 hover:opacity-100 transition">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-600 shadow-[0_0_40px_rgba(239,68,68,0.5)]">
              <svg className="h-8 w-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 max-w-2xl p-8 lg:p-12">
            <span className="inline-block rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-widest">
              {heroVideo.isFeatured ? 'Featured' : 'Latest'} · {heroVideo.category}
            </span>
            <h1 className="mt-4 text-3xl font-black leading-tight text-white lg:text-4xl">{heroVideo.title}</h1>
            <p className="mt-3 text-slate-300">{heroVideo.subtitle}</p>
            <p className="mt-3 text-sm text-slate-400">{heroVideo.author} · {heroVideo.date}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <div className="grid gap-10 xl:grid-cols-[1fr,300px]">
          <div>
            {gridVideos.length > 0 && (
              <div>
                <p className="mb-6 text-xs font-bold uppercase tracking-widest text-red-400">Latest Videos</p>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {gridVideos.map((video) => (
                    <Link
                      key={video.id}
                      to={`/video/${video.id}`}
                      className="group overflow-hidden rounded-2xl bg-slate-800 transition hover:-translate-y-1 hover:bg-slate-700"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={video.imageUrl || getThumb(video.videoId)}
                          alt={video.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600">
                            <PlayIcon />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600">
                          <PlayIcon />
                        </div>
                      </div>
                      <div className="p-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">{video.category}</span>
                        <h3 className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug text-white">{video.title}</h3>
                        <p className="mt-2 text-xs text-slate-400">{video.author} · {video.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {archived.length > 0 && (
              <div className="mt-12">
                <p className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-500">Archived</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {archived.map((video) => (
                    <Link
                      key={video.id}
                      to={`/video/${video.id}`}
                      className="group flex gap-4 rounded-2xl bg-slate-800/60 p-3 transition hover:bg-slate-800"
                    >
                      <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-xl">
                        <img src={video.imageUrl || getThumb(video.videoId)} alt={video.title} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600/80">
                            <PlayIcon />
                          </div>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h3 className="line-clamp-2 text-sm font-semibold text-white">{video.title}</h3>
                        <p className="mt-1 text-xs text-slate-400">{video.author} · {video.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {videos.length === 0 && (
              <div className="rounded-2xl border-2 border-dashed border-slate-700 p-16 text-center">
                <p className="text-lg font-semibold text-slate-400">No videos yet</p>
                <p className="mt-2 text-sm text-slate-500">Add videos from Admin → More Sections → Video</p>
              </div>
            )}
          </div>

          {/* Sidebar Ad */}
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
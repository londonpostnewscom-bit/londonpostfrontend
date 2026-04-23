import { SectionHeading } from '../components/SectionHeading';
import { liveVideos } from '../data/siteData';

export function LivePage() {
  return (
    <div id="live" className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
      <SectionHeading eyebrow="Live Podcast" title="Live stream hub with previous episodes" description="Embed your active YouTube stream at the top, then keep an archive of earlier conversations below." />
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 shadow-soft">
        <iframe className="aspect-video w-full" src={`https://www.youtube.com/embed/${liveVideos.current.youtubeId}?autoplay=0`} title={liveVideos.current.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
        <div className="p-6">
          <h2 className="text-3xl font-bold text-ink">{liveVideos.current.title}</h2>
          <p className="mt-3 text-slate-600">Connect your live YouTube feed here. This demo already uses the exact type of layout you requested.</p>
        </div>
      </div>
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-ink">Previous Videos</h3>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {liveVideos.previous.map((video) => (
            <div key={video.title} className="overflow-hidden rounded-[2rem] border border-slate-200 shadow-sm">
              <iframe className="aspect-video w-full" src={`https://www.youtube.com/embed/${video.youtubeId}`} title={video.title} allowFullScreen />
              <div className="p-5">
                <div className="text-sm uppercase tracking-[0.3em] text-accent">{video.date}</div>
                <h4 className="mt-2 text-xl font-bold text-ink">{video.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

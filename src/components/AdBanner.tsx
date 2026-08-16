

import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function AdBanner({ vertical = false, identifier }: { vertical?: boolean; identifier?: string }) {
  const [banner, setBanner] = useState<any>(null);

  useEffect(() => {
    // FIXED: banner requests were coming back as HTTP 304 (Not Modified),
    // which tells the browser to reuse whatever response it already has
    // cached for this URL — including a cached response captured BEFORE
    // an admin uploaded a new image or activated the banner. That's why
    // the placeholder kept showing even after the backend genuinely had
    // fresh data: the browser never actually re-requested the real JSON
    // body. `cache: 'no-store'` forces every request to skip the HTTP
    // cache entirely and always hit the network for a live response.
    if (identifier) {
      // Specific homepage/article banner
      fetch(`${API_URL}/banners/${identifier}`, { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : null))
        .then(setBanner)
        .catch(() => {});
    } else if (vertical) {
      // Global all-pages banner
      fetch(`${API_URL}/page-banner`, { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : null))
        .then(setBanner)
        .catch(() => {});
    }
  }, [identifier, vertical]);

  const isVertical = banner?.isVertical ?? vertical;

  if (banner?.imageUrl && banner.isActive) {
    return (
      <a
        href={banner.linkUrl || '#'}
        target={banner.linkUrl?.startsWith('http') ? '_blank' : undefined}
        rel="noopener noreferrer"
        className={`block overflow-hidden rounded-[2rem] relative ${isVertical ? 'min-h-[420px]' : 'min-h-[120px]'}`}
      >
        <img src={banner.imageUrl} alt={banner.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">{banner.sponsorText}</p>
            <h3 className="text-lg font-bold text-white">{banner.title}</h3>
          </div>
        </div>
      </a>
    );
  }

  return (
    <div className={`rounded-[2rem] border border-dashed border-accent/40 bg-slate-50 ${isVertical ? 'min-h-[420px]' : 'min-h-[120px]'} grid place-items-center p-6 text-center`}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-accent">{banner?.sponsorText || 'Sponsored Space'}</p>
        <h3 className="mt-2 text-2xl font-bold text-ink">{banner?.title || 'Ad / Promotion Banner'}</h3>
        <p className="mt-2 max-w-xs text-sm text-slate-500">{banner?.description || 'Keep this area for direct ads, partnership placements or campaign visuals.'}</p>
      </div>
    </div>
  );
}

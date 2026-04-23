// import { homeHero } from '../data/siteData';

// export function Hero() {
//   return (
//     <section className="bg-slate-950 text-white">
//       <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-8 lg:grid-cols-[1.1fr,1fr] lg:px-6 lg:py-10">
//         <div className="space-y-6">
//           <div className="inline-flex rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">Leading global analysis and regional reporting</div>
//           <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">{homeHero.title}</h1>
//           <p className="max-w-2xl text-lg text-white/75">{homeHero.subtitle}</p>
//           <div className="flex flex-wrap gap-4">
//             <a href="#latest" className="rounded-full bg-accent px-6 py-3 font-semibold text-slate-950 transition hover:bg-accent/90">{homeHero.cta}</a>
//             <a href="#live" className="rounded-full border border-white/15 px-6 py-3 font-semibold text-white transition hover:bg-white/10">Watch Live Demo</a>
//           </div>
//         </div>
//         <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-soft">
//           <video className="h-[520px] w-full object-cover" autoPlay muted loop playsInline poster="https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80">
//             <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
//           </video>
//           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
//           <div className="absolute bottom-0 left-0 p-6">
//             <div className="inline-flex rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-[0.3em]">Live Preview</div>
//             <h2 className="mt-3 max-w-xl text-3xl font-bold">Your top hero can use a featured video, livestream or headline image.</h2>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }




// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { homeHero, liveVideos } from '../data/siteData';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// export function Hero() {
//   const [hero, setHero] = useState<any>(null);

//   useEffect(() => {
//     fetch(`${API_URL}/hero`)
//       .then((r) => r.ok ? r.json() : null)
//       .then(setHero)
//       .catch(() => {});
//   }, []);

//   const title = hero?.title || homeHero.title;
//   const subtitle = hero?.subtitle || homeHero.subtitle;
//   const ctaText = hero?.ctaText || homeHero.cta;
//   const ctaLink = hero?.ctaLink || '#latest';
//   const badgeText = hero?.badgeText || 'LIVE PREVIEW';
//   const caption = hero?.previewCaption || 'Your top hero can use a featured video, livestream or headline image.';
//   const mediaType = hero?.mediaType || 'youtube';
//   const youtubeId = hero?.youtubeId || liveVideos.current.youtubeId;

//   const renderMedia = () => {
//     if (mediaType === 'youtube') {
//       return (
//         <iframe
//           src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0`}
//           className="absolute inset-0 h-full w-full" allow="autoplay; encrypted-media"
//           allowFullScreen title="Hero media"
//         />
//       );
//     }
//     if (mediaType === 'video' && hero?.mediaUrl) {
//       return <video src={hero.mediaUrl} autoPlay muted loop className="absolute inset-0 h-full w-full object-cover" />;
//     }
//     if (mediaType === 'image' && hero?.mediaUrl) {
//       return <img src={hero.mediaUrl} alt="Hero" className="absolute inset-0 h-full w-full object-cover" />;
//     }
//     return null;
//   };

//   return (
//     <section className="bg-ink text-white">
//       <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-2 lg:gap-12 lg:px-6 lg:py-20">
//         <div className="flex flex-col justify-center">
//           <span className="inline-block w-fit rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">
//             Leading global analysis and regional reporting
//           </span>
//           <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight lg:text-5xl">{title}</h1>
//           <p className="mt-5 text-lg leading-relaxed text-white/65">{subtitle}</p>
//           <div className="mt-8 flex flex-wrap gap-3">
//             <Link to={ctaLink} className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">
//               {ctaText}
//             </Link>
//             <Link to="/live" className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
//               Watch Live Demo
//             </Link>
//           </div>
//         </div>

//         <div className="relative overflow-hidden rounded-3xl bg-white/5 shadow-2xl">
//           <div className="relative aspect-video overflow-hidden rounded-3xl">
//             {renderMedia()}
//           </div>
//           <div className="absolute bottom-4 left-4 right-4">
//             <div className="rounded-2xl bg-black/55 p-3 backdrop-blur-md">
//               <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-bold text-white">{badgeText}</span>
//               <p className="mt-1.5 text-sm leading-snug text-white/90">{caption}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { homeHero, liveVideos } from '../data/siteData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const ROTATION_MS = 10000;
const STORAGE_KEY = 'londonpost_hero_rotation_started_at';

type HeroItem = {
  _id?: string;
  mediaType?: 'youtube' | 'image';
  youtubeId?: string;
  mediaUrl?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  ctaText2?: string;
  ctaLink2?: string;
  badgeText?: string;
  previewCaption?: string;
  isActive?: boolean;
  order?: number;
};

export function Hero() {
  const [heroes, setHeroes] = useState<HeroItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/hero`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const safeData: HeroItem[] = Array.isArray(data) ? data : [];
        setHeroes(safeData);

        if (safeData.length > 0) {
          let startedAt = Number(localStorage.getItem(STORAGE_KEY) || 0);

          if (!startedAt) {
            startedAt = Date.now();
            localStorage.setItem(STORAGE_KEY, String(startedAt));
          }

          const index =
            Math.floor((Date.now() - startedAt) / ROTATION_MS) % safeData.length;

          setCurrentIndex(index);
        }
      })
      .catch(() => {
        setHeroes([]);
      });
  }, []);

  useEffect(() => {
    if (heroes.length <= 1) return;

    const interval = window.setInterval(() => {
      const startedAt = Number(localStorage.getItem(STORAGE_KEY) || Date.now());
      const nextIndex =
        Math.floor((Date.now() - startedAt) / ROTATION_MS) % heroes.length;

      setCurrentIndex((prev) => {
        if (prev !== nextIndex) {
          setPreviousIndex(prev);
          setIsAnimating(true);

          if (animationTimeoutRef.current) {
            window.clearTimeout(animationTimeoutRef.current);
          }

          animationTimeoutRef.current = window.setTimeout(() => {
            setPreviousIndex(null);
            setIsAnimating(false);
          }, 700);

          return nextIndex;
        }

        return prev;
      });
    }, 1000);

    return () => {
      window.clearInterval(interval);
      if (animationTimeoutRef.current) {
        window.clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [heroes]);

  const fallbackHero = useMemo<HeroItem>(
    () => ({
      title: homeHero.title,
      subtitle: homeHero.subtitle,
      ctaText: homeHero.cta,
      ctaLink: '#latest',
      ctaText2: 'Watch Live Demo',
      ctaLink2: '/live',
      badgeText: 'LIVE PREVIEW',
      previewCaption:
        'Your top hero can use a featured video, livestream or headline image.',
      mediaType: 'youtube',
      youtubeId: liveVideos.current.youtubeId,
    }),
    []
  );

  const activeHero: HeroItem = heroes[currentIndex] || fallbackHero;
  const outgoingHero: HeroItem | null =
    previousIndex !== null ? heroes[previousIndex] || null : null;

  const renderMedia = (hero: HeroItem) => {
    const mediaType = hero.mediaType || 'youtube';
    const youtubeId = hero.youtubeId || liveVideos.current.youtubeId;

    if (mediaType === 'youtube') {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0`}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Hero media"
        />
      );
    }

    if (mediaType === 'image' && hero.mediaUrl) {
      return (
        <img
          src={hero.mediaUrl}
          alt={hero.title || 'Hero'}
          className="absolute inset-0 h-full w-full object-cover"
        />
      );
    }

    return null;
  };

  const SlideText = ({
    hero,
    state,
  }: {
    hero: HeroItem;
    state: 'active' | 'outgoing';
  }) => {
    const title = hero.title || fallbackHero.title || '';
    const subtitle = hero.subtitle || fallbackHero.subtitle || '';
    const ctaText = hero.ctaText || fallbackHero.ctaText || 'Read more';
    const ctaLink = hero.ctaLink || fallbackHero.ctaLink || '#latest';
    const ctaText2 =
      hero.ctaText2 || fallbackHero.ctaText2 || 'Watch Live Demo';
    const ctaLink2 = hero.ctaLink2 || fallbackHero.ctaLink2 || '/live';

    return (
      <div
        className={`absolute inset-0 flex flex-col justify-center transition-all duration-700 ${
          state === 'active'
            ? 'translate-x-0 opacity-100'
            : '-translate-x-12 opacity-0 pointer-events-none'
        }`}
      >
        <span className="inline-block w-fit rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">
          Leading global analysis and regional reporting
        </span>

        <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight lg:text-5xl">
          {title}
        </h1>

        <p className="mt-5 text-lg leading-relaxed text-white/65">
          {subtitle}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={ctaLink}
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {ctaText}
          </Link>

          <Link
            to={ctaLink2}
            className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            {ctaText2}
          </Link>
        </div>
      </div>
    );
  };

  const SlideMedia = ({
    hero,
    state,
  }: {
    hero: HeroItem;
    state: 'active' | 'outgoing';
  }) => {
    const badgeText = hero.badgeText || fallbackHero.badgeText || 'LIVE PREVIEW';
    const caption =
      hero.previewCaption ||
      fallbackHero.previewCaption ||
      'Your top hero can use a featured image or livestream.';

    return (
      <div
        className={`absolute inset-0 transition-all duration-700 ${
          state === 'active'
            ? 'translate-x-0 opacity-100'
            : 'translate-x-12 opacity-0 pointer-events-none'
        }`}
      >
        <div className="relative aspect-video overflow-hidden rounded-3xl">
          {renderMedia(hero)}
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="rounded-2xl bg-black/55 p-3 backdrop-blur-md">
            <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-bold text-white">
              {badgeText}
            </span>
            <p className="mt-1.5 text-sm leading-snug text-white/90">
              {caption}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-2 lg:gap-12 lg:px-6 lg:py-20">
        <div className="relative min-h-[360px] overflow-hidden">
          {outgoingHero && isAnimating && (
            <SlideText hero={outgoingHero} state="outgoing" />
          )}
          <SlideText hero={activeHero} state="active" />
        </div>

        <div className="relative min-h-[420px] overflow-hidden rounded-3xl bg-white/5 shadow-2xl">
          {outgoingHero && isAnimating && (
            <SlideMedia hero={outgoingHero} state="outgoing" />
          )}
          <SlideMedia hero={activeHero} state="active" />
        </div>
      </div>
    </section>
  );
}
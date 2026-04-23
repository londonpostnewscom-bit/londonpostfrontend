import { SectionHeading } from '../components/SectionHeading';

export function MissionVisionPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 bg-hero-glow opacity-80" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 lg:grid-cols-2 lg:px-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-accent">Mission & Vision</p>
            <h1 className="mt-4 text-5xl font-black leading-tight">A bold editorial mission with a premium visual identity</h1>
            <p className="mt-6 max-w-2xl text-lg text-white/80">This page is intentionally more cinematic and elevated so it feels different from standard media websites. You can later swap in your own photography, statements and brand story.</p>
          </div>
          <div className="grid gap-6">
            <img src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80" alt="mission" className="h-72 w-full rounded-[2rem] object-cover shadow-soft" />
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
                <h3 className="text-2xl font-bold">Mission</h3>
                <p className="mt-3 text-white/80">To deliver insightful journalism that connects global events with policy, strategy and public understanding.</p>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
                <h3 className="text-2xl font-bold">Vision</h3>
                <p className="mt-3 text-white/80">To become the most trusted bridge between fast news, deep analysis and strategic conversation.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <SectionHeading eyebrow="Why It Matters" title="Designed to feel memorable, confident and future-ready" description="Below are flexible content blocks you can later adapt into values, editorial promises or founding principles." />
        <div className="grid gap-6 md:grid-cols-3">
          {['Independent perspective', 'Context before noise', 'Global reach with regional depth'].map((item) => (
            <div key={item} className="rounded-[2rem] border border-slate-200 p-8 shadow-sm">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-accent" />
              <h3 className="mt-6 text-2xl font-bold text-ink">{item}</h3>
              <p className="mt-3 text-slate-600">A placeholder narrative block that makes the page feel polished and premium while staying easy to edit later.</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

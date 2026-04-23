export function SectionHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="mb-8 max-w-3xl">
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">{eyebrow}</p>}
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-lg text-slate-600">{description}</p>}
    </div>
  );
}

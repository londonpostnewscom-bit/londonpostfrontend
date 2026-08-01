
function Box({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200/70 ${className}`} />;
}

/* Generic content page: header block + grid of cards. Fits Opinion,
   Section, Region, Video listing pages. */
export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <Box className="h-8 w-48" />
      <Box className="mt-3 h-4 w-96 max-w-full" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-slate-100">
            <Box className="h-44 w-full rounded-none" />
            <div className="space-y-2 p-4">
              <Box className="h-3 w-16" />
              <Box className="h-4 w-full" />
              <Box className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Article detail page: hero image + title block + body lines. */
export function ArticleSkeleton() {
  return (
    <div>
      <Box className="h-[360px] w-full rounded-none" />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Box className="h-3 w-24" />
        <Box className="mt-4 h-9 w-full" />
        <Box className="mt-2 h-9 w-2/3" />
        <Box className="mt-4 h-4 w-1/2" />
        <div className="mt-8 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Box key={i} className={`h-4 ${i % 3 === 2 ? 'w-3/4' : 'w-full'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

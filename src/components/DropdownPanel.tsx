import { Link } from 'react-router-dom';

export function DropdownPanel({
  open,
  title,
  description,
  items,
  onNavigate,
  onClose,
}: {
  open: boolean;
  title: string;
  description: string;
  items: { name: string; slug: string }[];
  onNavigate?: () => void;
  onClose?: () => void;
}) {
  return (
    <div
      className={`absolute left-1/2 top-full z-40 w-full -translate-x-1/2 px-4 pt-3 transition-all duration-200 xl:px-8 ${
        open
          ? 'pointer-events-auto visible translate-y-0 opacity-100'
          : 'pointer-events-none invisible translate-y-2 opacity-0'
      }`}
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.16)]">
          <div className="grid md:grid-cols-[360px,minmax(0,1fr)]">
            <div className="relative overflow-hidden bg-blue-900 p-8 text-white">
              <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_38%)]" />

              <div className="relative">
                <p className="text-xs uppercase tracking-[0.35em] text-blue-100">
                  Explore
                </p>

                <h3 className="mt-4 text-4xl font-bold leading-tight">{title}</h3>

                <p className="mt-4 max-w-xs text-base leading-7 text-white/85">
                  {description}
                </p>

                <div className="mt-8 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur-sm">
                  Tip: click any item to open the section.
                </div>
              </div>
            </div>

            <div className="max-h-[min(70vh,560px)] overflow-y-auto p-5 md:p-6">
              <div className="grid gap-4 md:grid-cols-2">
                {items.map((item) => (
                  <Link
                    key={item.slug}
                    to={item.slug}
                    onClick={onNavigate}
                    className="rounded-3xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
                  >
                    <div className="text-xl font-semibold text-slate-900">
                      {item.name}
                    </div>
                    <div className="mt-2 text-sm leading-6 text-slate-500">
                      Browse curated stories, featured articles and archived coverage.
                    </div>
                  </Link>
                ))}
              </div>

              {onClose && (
                <div className="mt-6 flex justify-end border-t border-slate-200 pt-5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="font-semibold text-slate-500 transition hover:text-slate-900"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
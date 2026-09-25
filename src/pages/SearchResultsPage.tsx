import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { cld } from '../utils/Cloudinary';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  author: string;
  date: string;
  category: string;
};

export function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (q.trim().length < 2) { setResults([]); setTotal(0); setPages(1); return; }
    setLoading(true);
    fetch(`${API_URL}/search/full?q=${encodeURIComponent(q)}&page=${page}&limit=20`)
      .then(res => res.ok ? res.json() : { results: [], total: 0, pages: 1 })
      .then(data => {
        setResults(data.results || []);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
      })
      .catch(() => { setResults([]); setTotal(0); setPages(1); })
      .finally(() => setLoading(false));
  }, [q, page]);

  const goToPage = (p: number) => {
    const clamped = Math.max(1, Math.min(pages, p));
    setSearchParams({ q, page: String(clamped) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">
        Search results for "{q}"
      </h1>
      {!loading && (
        <p className="mt-1 text-sm text-slate-500">{total} article{total !== 1 ? 's' : ''} found</p>
      )}

      {loading && <div className="py-16 text-center text-slate-400">Searching…</div>}

      {!loading && results.length === 0 && q.trim().length >= 2 && (
        <div className="mt-10 rounded-2xl border-2 border-dashed border-slate-200 p-14 text-center">
          <p className="font-semibold text-slate-500">No articles found</p>
          <p className="mt-1 text-sm text-slate-400">Try a different search term.</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="mt-6 space-y-4">
          {results.map(r => (
            <Link
              key={r.id}
              to={`/article/${r.id}`}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300"
            >
              {r.image ? (
                <img src={cld(r.image, 200)} alt="" className="h-20 w-28 flex-shrink-0 rounded-xl object-cover" />
              ) : (
                <div className="h-20 w-28 flex-shrink-0 rounded-xl bg-slate-100" />
              )}
              <div className="min-w-0 flex-1">
                {r.category && (
                  <p className="text-[10px] font-bold uppercase tracking-wide text-red-500">{r.category}</p>
                )}
                <p className="font-semibold text-slate-900">{r.title}</p>
                {r.subtitle && <p className="mt-0.5 line-clamp-2 text-sm text-slate-500">{r.subtitle}</p>}
                <p className="mt-1 text-xs text-slate-400">{r.author}{r.author && r.date && ' · '}{r.date}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="text-sm text-slate-500">Page {page} of {pages}</span>
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= pages}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

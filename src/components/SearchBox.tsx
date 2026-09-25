import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon } from './Icons';
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

const DEBOUNCE_MS = 300;

export function SearchBox({ variant = 'desktop' }: { variant?: 'desktop' | 'mobile' }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestQueryRef = useRef(0);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      setActiveIndex(-1);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const queryId = ++latestQueryRef.current;
      try {
        const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(q)}`);
        const data = res.ok ? await res.json() : [];
        if (queryId === latestQueryRef.current) {
          setResults(Array.isArray(data) ? data : []);
          setLoading(false);
          setActiveIndex(-1);
        }
      } catch {
        if (queryId === latestQueryRef.current) {
          setResults([]);
          setLoading(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const goToResult = (result: SearchResult) => {
    setOpen(false);
    setQuery('');
    setResults([]);
    navigate(`/article/${result.id}`);
  };

  const goToFullResults = () => {
    const q = query.trim();
    if (q.length < 2) return;
    setOpen(false);
    setQuery('');
    setResults([]);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) {
      if (e.key === 'Escape') {
        setOpen(false);
        (e.target as HTMLInputElement).blur();
      }
      return;
    }

    // "See all results" is one slot past the last real result.
    const maxIndex = results.length; // 0..length-1 = results, length = "see all"

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % (maxIndex + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? maxIndex : i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex === maxIndex) {
        goToFullResults();
      } else {
        const target = activeIndex >= 0 ? results[activeIndex] : results[0];
        if (target) goToResult(target);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      (e.target as HTMLInputElement).blur();
    }
  };

  const showDropdown = open && query.trim().length >= 2;

  const wrapperClass =
    variant === 'mobile'
      ? 'relative flex w-full items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-500 shadow-sm'
      : 'relative hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm lg:flex';

  return (
    <div ref={containerRef} className={variant === 'mobile' ? 'relative w-full' : 'relative'}>
      <label className={wrapperClass}>
        <SearchIcon className="h-4 w-4 shrink-0" />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search"
          className={variant === 'mobile' ? 'w-full bg-transparent outline-none' : 'w-32 bg-transparent outline-none xl:w-44'}
          role="combobox"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
        />
      </label>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
          {loading && (
            <div className="px-4 py-3 text-sm text-slate-400">Searching…</div>
          )}

          {!loading && results.length === 0 && (
            <div className="px-4 py-3 text-sm text-slate-400">No articles found for "{query.trim()}"</div>
          )}

          {!loading && results.map((r, i) => (
            <button
              key={r.id}
              type="button"
              onClick={() => goToResult(r)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                i === activeIndex ? 'bg-slate-50' : 'bg-white'
              } border-b border-slate-100`}
            >
              {r.image ? (
                <img
                  src={cld(r.image, 120)}
                  alt=""
                  className="h-12 w-16 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="h-12 w-16 shrink-0 rounded-lg bg-slate-100" />
              )}
              <div className="min-w-0 flex-1">
                {r.category && (
                  <p className="text-[10px] font-bold uppercase tracking-wide text-red-500">{r.category}</p>
                )}
                <p className="truncate text-sm font-semibold text-slate-900">{r.title}</p>
                <p className="mt-0.5 truncate text-xs text-slate-400">{r.author}{r.author && r.date && ' · '}{r.date}</p>
              </div>
            </button>
          ))}

          {!loading && results.length > 0 && (
            <button
              type="button"
              onClick={goToFullResults}
              onMouseEnter={() => setActiveIndex(results.length)}
              className={`block w-full px-4 py-3 text-center text-sm font-semibold text-red-600 transition ${
                activeIndex === results.length ? 'bg-slate-50' : 'bg-white'
              }`}
            >
              See all results for "{query.trim()}"
            </button>
          )}
        </div>
      )}
    </div>
  );
}

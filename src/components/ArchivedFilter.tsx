import { useEffect, useState } from 'react';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const YEARS = Array.from({ length: 27 }, (_, i) => String(2014 + i));

interface Props<T extends { date?: string }> {
  items: T[];
  onChange: (filtered: T[]) => void;
}

export function ArchivedFilter<T extends { date?: string }>({ items, onChange }: Props<T>) {
  const [month, setMonth] = useState('');
  const [year,  setYear]  = useState('');

  useEffect(() => {
    if (!month && !year) { onChange(items); return; }
    onChange(
      items.filter((a) => {
        const d = a.date || '';
        return (!month || d.includes(month)) && (!year || d.includes(year));
      })
    );
  }, [month, year, items.length]);

  const clear = () => { setMonth(''); setYear(''); };

  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <select
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-primary"
      >
        <option value="">All Months</option>
        {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>
      <select
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-primary"
      >
        <option value="">All Years</option>
        {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
      </select>
      {(month || year) && (
        <button
          onClick={clear}
          className="rounded-xl border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition"
        >
          Clear ✕
        </button>
      )}
      {(month || year) && (
        <span className="text-xs text-slate-400">
          Showing archived from {month || 'any month'} {year || 'any year'}
        </span>
      )}
    </div>
  );
}
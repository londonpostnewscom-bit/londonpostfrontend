// import { useState, useMemo } from 'react';

// const MONTHS = [
//   'January','February','March','April','May','June',
//   'July','August','September','October','November','December',
// ];
// const YEARS = Array.from({ length: 27 }, (_, i) => String(2014 + i));

// export function useAdminArticleFilter(articles: any[]) {
//   const [filterMonth, setFilterMonth] = useState('');
//   const [filterYear,  setFilterYear]  = useState('');
//   const [search,      setSearch]      = useState('');

//   const filtered = useMemo(() => {
//     return articles.filter((a) => {
//       const date = a.date || '';
//       const matchMonth = !filterMonth || date.includes(filterMonth);
//       const matchYear  = !filterYear  || date.includes(filterYear);
//       const matchSearch = !search || a.title?.toLowerCase().includes(search.toLowerCase()) ||
//         a.author?.toLowerCase().includes(search.toLowerCase()) ||
//         a.category?.toLowerCase().includes(search.toLowerCase());
//       return matchMonth && matchYear && matchSearch;
//     });
//   }, [articles, filterMonth, filterYear, search]);

//   const clearFilters = () => { setFilterMonth(''); setFilterYear(''); setSearch(''); };
//   const hasFilters   = !!(filterMonth || filterYear || search);

//   const FilterBar = () => (
//     <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
//       <div className="flex flex-wrap items-center gap-3">
//         <input
//           type="text"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Search by title, author, category..."
//           className="flex-1 min-w-[180px] rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
//         />
//         <select
//           value={filterMonth}
//           onChange={(e) => setFilterMonth(e.target.value)}
//           className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400"
//         >
//           <option value="">All Months</option>
//           {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
//         </select>
//         <select
//           value={filterYear}
//           onChange={(e) => setFilterYear(e.target.value)}
//           className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400"
//         >
//           <option value="">All Years</option>
//           {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
//         </select>
//         {hasFilters && (
//           <button
//             onClick={clearFilters}
//             className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100 transition"
//           >
//             Clear ✕
//           </button>
//         )}
//         <span className="text-xs text-gray-400">
//           {filtered.length} of {articles.length} article{articles.length !== 1 ? 's' : ''}
//         </span>
//       </div>
//     </div>
//   );

//   return { filtered, FilterBar, hasFilters };
// }

import { useState, useMemo } from 'react';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const YEARS = Array.from({ length: 27 }, (_, i) => String(2014 + i));

export function useAdminArticleFilter(articles: any[]) {
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const date = a.date || '';
      const q = search.toLowerCase();

      const matchMonth = !filterMonth || date.includes(filterMonth);
      const matchYear = !filterYear || date.includes(filterYear);
      const matchSearch =
        !search ||
        a.title?.toLowerCase().includes(q) ||
        a.author?.toLowerCase().includes(q) ||
        a.category?.toLowerCase().includes(q);

      return matchMonth && matchYear && matchSearch;
    });
  }, [articles, filterMonth, filterYear, search]);

  const clearFilters = () => {
    setFilterMonth('');
    setFilterYear('');
    setSearch('');
  };

  const hasFilters = !!(filterMonth || filterYear || search);

  const filterBar = (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, author, category..."
          className="flex-1 min-w-[180px] rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
        />

        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400"
        >
          <option value="">All Months</option>
          {MONTHS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400"
        >
          <option value="">All Years</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100 transition"
          >
            Clear ✕
          </button>
        )}

        <span className="text-xs text-gray-400">
          {filtered.length} of {articles.length} article{articles.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );

  return { filtered, filterBar, hasFilters };
}
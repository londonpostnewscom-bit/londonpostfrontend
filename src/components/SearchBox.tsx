import { SearchIcon } from './Icons';

export function SearchBox() {
  return (
    <label className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm lg:flex">
      <SearchIcon className="h-4 w-4" />
      <input placeholder="Search" className="w-32 bg-transparent outline-none xl:w-44" />
    </label>
  );
}

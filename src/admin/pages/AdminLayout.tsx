import { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import logo from '../../assets/londonpost.png';

const NAV_HOME = [
  { path: '/admin/hero',             label: 'Hero Section',       icon: '🎬', desc: 'Top banner video/image' },
  { path: '/admin/banners',          label: 'Ad Banners',         icon: '📢', desc: '4 homepage banners' },
  
];

const NAV_CONTENT = [
  { path: '/admin/all-pages', label: 'All Pages Handling', icon: '🗂️', desc: 'World & More sections unified' },
];

const NAV_OTHER = [
  { path: '/admin/membership',       label: 'Membership',          icon: '💳', desc: 'Plans & submissions' },
  { path: '/admin/page-banner',      label: 'Banner — All Pages',  icon: '🖼️',  desc: 'Right sidebar on every page' },
  { path: '/admin/contact-requests', label: 'Contact Requests',    icon: '📩', desc: 'Contact + header query form submissions' },
];

function NavLink({ item, active, onClick }: { item: any; active: boolean; onClick?: () => void }) {
  return (
    <Link
      to={item.path}
      onClick={onClick}
      className={[
        'group relative flex items-start gap-3 overflow-hidden rounded-2xl px-3.5 py-3 transition-all duration-200',
        active
          ? 'bg-gradient-to-r from-red-600 via-red-500 to-rose-500 text-white shadow-lg shadow-red-900/20'
          : 'text-slate-300 hover:bg-white/6 hover:text-white',
      ].join(' ')}
    >
      <span className={[
        'mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-base transition-all',
        active ? 'bg-white/18 text-white' : 'bg-white/5 text-slate-200 group-hover:bg-white/10',
      ].join(' ')}>
        {item.icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold leading-none">{item.label}</p>
        {item.desc && (
          <p className={['mt-1 truncate text-xs', active ? 'text-red-100/90' : 'text-slate-500 group-hover:text-slate-400'].join(' ')}>
            {item.desc}
          </p>
        )}
      </div>
      {active && <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-white/90" />}
    </Link>
  );
}

function Sidebar({ onClose }: { onClose?: () => void }) {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-full flex-col border-r border-slate-800 bg-[#081225] text-white">
      {/* Brand */}
      <div className="border-b border-white/10 bg-gradient-to-b from-[#969fae] to-[#091426] px-4 py-5">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
          <img src={logo} alt="LondonPost" className="h-14 w-auto max-w-full object-contain" />
          <div className="mt-4 border-t border-white/10 pt-3">
            <p className="text-lg font-extrabold tracking-tight text-white">Admin Panel</p>
            <p className="mt-1 text-xs font-medium text-slate-300">London Post newsroom control center</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-3 overflow-y-auto px-3 py-4 [scrollbar-width:thin] [scrollbar-color:#475569_transparent]">

        <div>
          <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">Homepage Sections</p>
          <div className="mt-1 space-y-1">
            {NAV_HOME.map(item => <NavLink key={item.path} item={item} active={isActive(item.path)} onClick={onClose} />)}
          </div>
        </div>

        <div className="mx-2 border-t border-white/10" />

        <div>
          <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">Content</p>
          <div className="mt-1 space-y-1">
            {NAV_CONTENT.map(item => <NavLink key={item.path} item={item} active={isActive(item.path)} onClick={onClose} />)}
          </div>
        </div>

        <div className="mx-2 border-t border-white/10" />

        <div>
          <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">Management</p>
          <div className="mt-1 space-y-1">
            {NAV_OTHER.map(item => <NavLink key={item.path} item={item} active={isActive(item.path)} onClick={onClose} />)}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 bg-gradient-to-t from-[#07101f] to-[#0a1427] p-4">
        <div className="mb-3 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3 backdrop-blur">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Signed in as</p>
          <p className="mt-1 truncate text-sm font-semibold text-white">{admin?.email}</p>
        </div>
        <button
          onClick={() => { logout(); navigate('/admin/login'); }}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-semibold text-slate-200 transition hover:border-red-400/40 hover:bg-red-600 hover:text-white"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export function AdminLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const allNav = [...NAV_HOME, ...NAV_CONTENT, ...NAV_OTHER];
  const active = allNav.find(n => n.path === location.pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <aside className="hidden w-[290px] flex-shrink-0 xl:block"><Sidebar /></aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-[290px] shadow-2xl"><Sidebar onClose={() => setMobileOpen(false)} /></aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="border-b border-slate-200 bg-white/95 px-4 py-3.5 backdrop-blur lg:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 xl:hidden">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold tracking-tight text-slate-800">{active?.label || 'Dashboard'}</h1>
              {(active as any)?.desc && <p className="hidden truncate text-sm text-slate-500 sm:block">{(active as any).desc}</p>}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6"><Outlet /></main>
      </div>
    </div>
  );
}

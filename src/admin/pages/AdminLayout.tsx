import { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import logo from '../../assets/londonpost.png';

const NAV_HOME = [
  { path: '/admin/banners', label: 'Ad Banners', icon: '📢', desc: '4 homepage banners' },
];

const NAV_CONTENT = [
  { path: '/admin/all-pages', label: 'All Pages Handling', icon: '🗂️', desc: 'World & More sections unified' },
  { path: '/admin/live', label: 'Live Podcast', icon: '🎙️', desc: 'Main stream & previous episodes' },
];

const NAV_OTHER = [
  { path: '/admin/membership', label: 'Membership', icon: '💳', desc: 'Plans & submissions' },
  { path: '/admin/page-banner', label: 'Banner — All Pages', icon: '🖼️', desc: 'Right sidebar on every page' },
  { path: '/admin/contact-requests', label: 'Contact Requests', icon: '📩', desc: 'Contact + header query form submissions' },
];

const GROUPS = [
  { label: 'Homepage', items: NAV_HOME },
  { label: 'Content', items: NAV_CONTENT },
  { label: 'Management', items: NAV_OTHER },
];

function NavLink({ item, active, onClick }: { item: any; active: boolean; onClick?: () => void }) {
  return (
    <Link
      to={item.path}
      onClick={onClick}
      className={[
        'group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 transition-all duration-200',
        active
          ? 'bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-md shadow-red-950/30'
          : 'text-slate-300 hover:bg-white/[0.06] hover:text-white',
      ].join(' ')}
    >
      <span className={[
        'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-[15px] transition-all duration-200',
        active
          ? 'bg-white/20 text-white'
          : 'bg-white/[0.04] text-slate-300 group-hover:bg-white/10 group-hover:scale-105',
      ].join(' ')}>
        {item.icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className={`truncate text-[13.5px] font-semibold leading-tight ${active ? 'text-white' : ''}`}>
          {item.label}
        </p>
        {item.desc && (
          <p className={[
            'mt-0.5 truncate text-[11px] leading-tight transition-colors',
            active ? 'text-white/75' : 'text-slate-500 group-hover:text-slate-400',
          ].join(' ')}>
            {item.desc}
          </p>
        )}
      </div>
      {active && (
        <span className="absolute right-3 flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/90" />
      )}
    </Link>
  );
}

function Sidebar({ onClose }: { onClose?: () => void }) {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const initial = (admin?.email || '?').trim().charAt(0).toUpperCase();

  return (
    <div className="flex h-full flex-col bg-[#070d1a] text-white">
      {/* Brand */}
      <div className="px-4 pb-5 pt-5">
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-transparent p-4">
          <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-red-600/20 blur-3xl" />
          <img src={logo} alt="LondonPost" className="h-11 w-auto max-w-full object-contain" />
          <div className="mt-4 flex items-center gap-2 border-t border-white/[0.08] pt-3">
            <span className="flex h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
            <div className="min-w-0">
              <p className="truncate text-[15px] font-bold leading-tight tracking-tight text-white">Admin Panel</p>
              <p className="truncate text-[11px] font-medium text-slate-400">Newsroom control center</p>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="min-h-0 flex-1 space-y-5 overflow-y-auto px-3 pb-4 [scrollbar-width:thin] [scrollbar-color:#334155_transparent]">
        {GROUPS.map((group, gi) => (
          <div key={group.label}>
            <p className="px-3 pb-1.5 text-[10.5px] font-bold uppercase tracking-[0.22em] text-slate-500">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map(item => (
                <NavLink key={item.path} item={item} active={isActive(item.path)} onClick={onClose} />
              ))}
            </div>
            {gi < GROUPS.length - 1 && <div className="mx-3 mt-4 border-t border-white/[0.06]" />}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/[0.08] p-3">
        <div className="mb-2 flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-sm font-bold text-white">
            {initial}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-medium uppercase tracking-wide text-slate-500">Signed in</p>
            <p className="truncate text-[13px] font-semibold text-white">{admin?.email}</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate('/admin/login'); }}
          className="group flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-[13px] font-semibold text-slate-300 transition-all duration-200 hover:border-red-500/40 hover:bg-red-600/90 hover:text-white"
        >
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
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
      {/* Desktop sidebar */}
      <aside className="hidden w-[272px] flex-shrink-0 border-r border-black/5 xl:block">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-[280px] shadow-2xl animate-in slide-in-from-left duration-200">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex-shrink-0 border-b border-slate-200 bg-white/90 px-4 py-3.5 backdrop-blur-md lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="flex-shrink-0 rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 xl:hidden"
              aria-label="Open menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {active?.icon && <span className="text-base leading-none">{active.icon}</span>}
                <h1 className="truncate text-[17px] font-bold tracking-tight text-slate-800">
                  {active?.label || 'Dashboard'}
                </h1>
              </div>
              {(active as any)?.desc && (
                <p className="hidden truncate text-[13px] text-slate-500 sm:block">{(active as any).desc}</p>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

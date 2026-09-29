import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Package, ShoppingCart, ClipboardCheck, ShieldAlert, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

function useSidebarLinks() {
  const { t } = useLanguage();
  return [
    { to: '/admin', label: t('dashboard'), icon: LayoutDashboard },
    { to: '/admin/users', label: t('users'), icon: Users },
    { to: '/admin/batches', label: t('batches'), icon: Package },
    { to: '/admin/marketplace', label: t('marketplace'), icon: ShoppingCart },
    { to: '/quality', label: t('qualityAssurance'), icon: ClipboardCheck },
  ];
}

function SidebarLink({ to, label, icon: Icon }) {
  const { pathname } = useLocation();
  const isActive = pathname === to;
  return (
    <Link
      to={to}
      className={`group flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
        isActive
          ? 'bg-burgundy text-warmIvory shadow-md shadow-burgundy/15 font-bold'
          : 'text-deepBrown/75 hover:bg-burntOrange/10 hover:text-burgundy'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} className={isActive ? 'text-honeyGold' : 'text-deepBrown/50 group-hover:text-burgundy'} />
        <span>{label}</span>
      </div>
      {isActive && <ChevronRight size={15} className="text-honeyGold/80" />}
    </Link>
  );
}

export default function AdminLayout({ children }) {
  const { t } = useLanguage();
  const SIDEBAR_LINKS = useSidebarLinks();
  const { pathname } = useLocation();

  return (
    <div className="max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 font-sans">
      <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-12rem)]">
        {/* Sidebar — desktop only */}
        <aside className="w-full lg:w-64 shrink-0 hidden lg:block">
          <div className="bento-card p-4 sticky top-24 space-y-4">
            <div className="px-3 py-2 border-b border-border/80">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-honeyGold animate-pulse"></span>
                <p className="text-[11px] font-bold uppercase tracking-wider text-burgundy font-mono">
                  {t('adminPanel')} • KVIC Portal
                </p>
              </div>
              <p className="text-xs text-deepBrown/60 mt-0.5">National Honey Registry</p>
            </div>

            <nav className="space-y-1">
              {SIDEBAR_LINKS.map(link => (
                <SidebarLink key={link.to} {...link} />
              ))}
            </nav>

            <div className="p-3.5 rounded-2xl bg-honeyGold/10 border border-honeyGold/20 mt-6">
              <div className="flex items-start gap-2.5">
                <ShieldAlert size={16} className="text-burgundy shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-deepBrown">KVIC Authority Mode</p>
                  <p className="text-[11px] text-deepBrown/70 leading-relaxed mt-0.5">
                    Immutable SHA-256 logs & APMC compliance enforcement active.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Mobile nav tabs */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-5 border-b border-border/60 scrollbar-none">
            {SIDEBAR_LINKS.map(link => {
              const isActive = pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-xs ${
                    isActive
                      ? 'bg-burgundy text-warmIvory'
                      : 'bg-warmIvory/80 border border-border text-deepBrown/70 hover:bg-warmIvory'
                  }`}
                >
                  <link.icon size={15} className={isActive ? 'text-honeyGold' : 'text-deepBrown/60'} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}

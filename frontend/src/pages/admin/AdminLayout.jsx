import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Package, ShoppingCart, ClipboardCheck } from 'lucide-react';
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
      className={`admin-sidebar-link ${isActive ? 'admin-sidebar-link-active' : ''}`}
    >
      <Icon size={18} />
      {label}
    </Link>
  );
}

export default function AdminLayout({ children }) {
  const { t } = useLanguage();
  const SIDEBAR_LINKS = useSidebarLinks();
  const { pathname } = useLocation();

  return (
    <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <div className="flex gap-6 min-h-[calc(100vh-12rem)]">
        {/* Sidebar — desktop only */}
        <aside className="admin-sidebar rounded-xl py-4">
          <p className="px-6 mb-4 text-[11px] font-bold uppercase tracking-widest text-textMuted">
            {t('adminPanel')}
          </p>
          <nav className="space-y-0.5">
            {SIDEBAR_LINKS.map(link => (
              <SidebarLink key={link.to} {...link} />
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Mobile nav tabs — shown on mobile */}
          <div className="md:hidden flex gap-1 overflow-x-auto pb-3 mb-5 border-b border-border/60">
            {SIDEBAR_LINKS.map(link => {
              const isActive = pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-surface border border-border text-textSecondary hover:bg-background'
                  }`}
                >
                  <link.icon size={15} />
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

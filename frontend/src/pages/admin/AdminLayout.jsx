import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Package, ShoppingCart } from 'lucide-react';

const SIDEBAR_LINKS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/batches', label: 'Batches', icon: Package },
  { to: '/admin/marketplace', label: 'Marketplace', icon: ShoppingCart },
];

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
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      <div className="flex gap-6 min-h-[calc(100vh-12rem)]">
        {/* Sidebar — desktop only */}
        <aside className="admin-sidebar rounded-xl py-4">
          <p className="px-6 mb-4 text-[11px] font-bold uppercase tracking-widest text-textMuted">
            Admin Panel
          </p>
          <nav className="space-y-0.5">
            {SIDEBAR_LINKS.map(link => (
              <SidebarLink key={link.to} {...link} />
            ))}
          </nav>
        </aside>

        {/* Mobile nav tabs — shown below sm */}
        <div className="md:hidden w-full">
          <div className="flex gap-1 overflow-x-auto pb-3 mb-4 border-b border-border/60">
            {SIDEBAR_LINKS.map(link => {
              const { pathname } = useLocation();
              const isActive = pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-primaryLight text-primary'
                      : 'text-textSecondary hover:bg-background'
                  }`}
                >
                  <link.icon size={15} />
                  {link.label}
                </Link>
              );
            })}
          </div>
          {children}
        </div>

        {/* Main content — desktop */}
        <main className="flex-1 hidden md:block">
          {children}
        </main>
      </div>
    </div>
  );
}

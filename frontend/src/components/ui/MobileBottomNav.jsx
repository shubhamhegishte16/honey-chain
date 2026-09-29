import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Home,
  Package,
  Store,
  TrendingUp,
  BookOpen,
  Cog,
  ShieldCheck,
  CheckCircle2,
  ShoppingCart,
  Truck,
  Bookmark,
  Users,
  Layers,
  Inbox,
  QrCode,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function MobileBottomNav() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const { pathname } = useLocation();

  if (!profile) return null;

  const farmerNav = [
    { to: '/farmer/dashboard', label: t('dashboard'), icon: Home, exact: true },
    { to: '/farmer/tracking', label: 'My Lots', icon: Package },
    { to: '/farmer/marketplace', label: 'Sell Honey', icon: Store },
    { to: '/farmer/market', label: t('mandiRatesLabel', 'Rates'), icon: TrendingUp },
    { to: '/learn', label: t('learn'), icon: BookOpen },
  ];

  const artisanNav = [
    { to: '/artisan', label: t('dashboard'), icon: Home, exact: true },
    { to: '/artisan/batches', label: t('workNav', 'Work'), icon: Package },
    { to: '/artisan/processing', label: t('processing'), icon: Cog },
    { to: '/artisan/quality', label: t('quality'), icon: ShieldCheck },
    { to: '/artisan/completed', label: t('completed'), icon: CheckCircle2 },
  ];

  const buyerNav = [
    { to: '/buyer/dashboard', label: t('dashboard'), icon: Home, exact: true },
    { to: '/buyer/marketplace', label: 'Buy Honey', icon: Store },
    { to: '/buyer/orders', label: t('myOrders'), icon: ShoppingCart },
    { to: '/buyer/tracking', label: t('tracking'), icon: Truck },
    { to: '/buyer/saved', label: t('savedNav'), icon: Bookmark },
  ];

  const processorNav = [
    { to: '/processor/dashboard', label: t('dashboard'), icon: LayoutDashboard, exact: true },
    { to: '/processor/requests', label: t('requestsNav', 'Requests'), icon: Inbox },
    { to: '/processor/active', label: t('activeNav', 'Active'), icon: Cog },
    { to: '/processor/passport', label: t('qrNav', 'QR / Passport'), icon: QrCode },
    { to: '/processor/history', label: t('historyNav', 'History'), icon: Layers },
  ];

  const adminNav = [
    { to: '/admin', label: t('dashboard'), icon: LayoutDashboard, exact: true },
    { to: '/admin/users', label: t('users'), icon: Users },
    { to: '/admin/batches', label: t('batches'), icon: Package },
    { to: '/admin/marketplace', label: t('marketplace'), icon: Store },
    { to: '/quality', label: t('quality'), icon: ShieldCheck },
  ];

  const items =
    profile.role === 'farmer' ? farmerNav
    : profile.role === 'artisan' ? artisanNav
    : profile.role === 'buyer' ? buyerNav
    : profile.role === 'processor' ? processorNav
    : profile.role === 'admin' ? adminNav
    : buyerNav;

  return (
    <nav
      aria-label="Mobile navigation"
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-warmIvory/95 backdrop-blur-xl border-t border-border/80 shadow-[0_-4px_20px_rgba(40,29,28,0.08)] px-2 py-1.5 flex items-center justify-around select-none safe-area-bottom font-sans"
    >
      {items.map(item => {
        const Icon = item.icon;
        const isActive = item.exact
          ? pathname === item.to || (item.to === '/' && (pathname === '/farmer/dashboard' || pathname === '/'))
          : pathname === item.to || (item.to !== '/' && pathname.startsWith(item.to));

        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-1 py-1 rounded-2xl transition-all duration-200 active:scale-95 ${
              isActive
                ? 'bg-burgundy text-warmIvory font-bold shadow-sm shadow-burgundy/20'
                : 'text-deepBrown/65 hover:text-burgundy'
            }`}
          >
            <Icon size={18} className={isActive ? 'text-honeyGold stroke-[2.4]' : 'text-deepBrown/70 stroke-[1.8]'} />
            <span className="text-[10px] tracking-tight mt-0.5 font-medium leading-none">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

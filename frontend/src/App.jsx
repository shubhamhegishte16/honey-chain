import { useState } from 'react';
import { Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, LogOut, MapPin, Menu, X } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { signOut } from './services/auth.service';
import Footer from './components/ui/Footer';
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import FarmerHome from './pages/farmer/FarmerHome';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import FarmerMarket from './pages/farmer/FarmerMarket';
import FarmerTracking from './pages/farmer/FarmerTracking';
import AddWoolBatch from './pages/farmer/AddWoolBatch';
import BatchDetails from './pages/farmer/BatchDetails';
import BatchQR from './pages/farmer/BatchQR';
import BatchTraceability from './pages/farmer/BatchTraceability';
import MarketplaceBrowser from './components/market/MarketplaceBrowser';
import MarketplaceExperience from './components/market/MarketplaceExperience';

import BuyerDashboard from './pages/buyer/BuyerDashboard';
import ListingDetails from './pages/buyer/ListingDetails';
import Checkout from './pages/buyer/Checkout';
import BuyerOrders from './pages/buyer/BuyerOrders';
import OrderDetails from './pages/buyer/OrderDetails';
import OrderTracking from './pages/buyer/OrderTracking';
import SavedWool from './pages/buyer/SavedWool';
import BuyerNotifications from './pages/buyer/BuyerNotifications';
import BuyerProfile from './pages/buyer/BuyerProfile';
import WoolPassport from './pages/buyer/WoolPassport';
import BuyerAnalytics from './pages/buyer/BuyerAnalytics';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import BatchManagement from './pages/admin/BatchManagement';
import MarketplaceManagement from './pages/admin/MarketplaceManagement';

import LearnLanding from './pages/learn/LearnLanding';
import ResourceListing from './pages/learn/ResourceListing';
import ResourceDetails from './pages/learn/ResourceDetails';

function NavLink({ to, children, onClick }) {
  const { pathname } = useLocation();
  const isActive = pathname === to || (to !== '/' && pathname.startsWith(to));
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
    >
      {children}
    </Link>
  );
}

function Layout({ children }) {
  const { profile } = useAuth();
  const nav = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const farmerLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/farmer/market', label: 'Prices' },
    { to: '/farmer/marketplace', label: 'Marketplace' },
    { to: '/farmer/tracking', label: 'Tracking' },
    { to: '/learn', label: 'Learn' },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/batches', label: 'Batches' },
    { to: '/admin/marketplace', label: 'Marketplace' },
  ];

  const buyerLinks = [
    { to: '/buyer/dashboard', label: 'Dashboard' },
    { to: '/buyer/marketplace', label: 'Find Wool' },
    { to: '/buyer/orders', label: 'My Orders' },
    { to: '/buyer/tracking', label: 'Tracking' },
    { to: '/buyer/analytics', label: 'Analytics' },
    { to: '/buyer/saved', label: 'Saved' },
  ];

  const links = profile?.role === 'admin' ? adminLinks
    : profile?.role === 'farmer' ? farmerLinks
    : profile?.role === 'buyer' ? buyerLinks
    : profile?.role === 'artisan' ? [{ to: '/', label: 'Marketplace' }, { to: '/learn', label: 'Learn' }]
    : buyerLinks;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-surface/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 font-bold text-primary text-lg tracking-tight shrink-0">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-white shadow-sm">
              <Leaf size={16} />
            </span>
            WoolConnect
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {links.map(l => (
              <NavLink key={l.to} to={l.to}>{l.label}</NavLink>
            ))}
          </nav>

          {/* Right side */}
          {profile && (
            <div className="flex items-center gap-3">
              {/* User info */}
              <div className="hidden md:flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-primaryLight text-primary text-xs font-bold">
                  {profile.name?.charAt(0)?.toUpperCase() || '?'}
                </span>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-textPrimary leading-tight">{profile.name}</p>
                  <p className="text-[11px] text-textMuted flex items-center gap-0.5"><MapPin size={10} />{profile.district || profile.state || 'India'}</p>
                </div>
              </div>

              <div className="hidden sm:block h-6 w-px bg-border" />

              {/* Logout */}
              <button
                aria-label="Log out"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                onClick={async () => { await signOut(); nav('/login'); }}
              >
                <LogOut size={15} />
                <span className="hidden lg:inline">Logout</span>
              </button>

              {/* Mobile hamburger */}
              <button
                className="sm:hidden grid h-9 w-9 place-items-center rounded-lg hover:bg-background transition-colors"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={20} className="text-textPrimary" />
              </button>
            </div>
          )}
          {!profile && (
             <div className="flex items-center gap-3">
               <span className="text-xs font-bold text-rose-500 bg-rose-100 px-2 py-1 rounded">Test Mode</span>
               <button className="sm:hidden grid h-9 w-9 place-items-center rounded-lg hover:bg-background transition-colors" onClick={() => setMobileOpen(true)}><Menu size={20} className="text-textPrimary" /></button>
             </div>
          )}
        </div>
      </header>

      {/* Mobile slide-in drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-surface shadow-card-lg animate-slide-in-right">
            <div className="flex items-center justify-between p-4 border-b border-border/60">
              <span className="font-bold text-primary flex items-center gap-2">
                <Leaf size={16} /> Menu
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-lg hover:bg-background"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {profile && (
              <div className="p-4 border-b border-border/60">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-primaryLight text-primary text-sm font-bold">
                    {profile.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-textPrimary">{profile.name}</p>
                    <p className="text-xs text-textMuted capitalize">{profile.role}</p>
                  </div>
                </div>
              </div>
            )}

            <nav className="p-3 space-y-0.5">
              {links.map(l => (
                <NavLink key={l.to} to={l.to} onClick={() => setMobileOpen(false)}>
                  {l.label}
                </NavLink>
              ))}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/60">
              <button
                onClick={async () => { setMobileOpen(false); await signOut(); nav('/login'); }}
                className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700"
              >
                <LogOut size={16} /> Log out
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main content */}
      <div className="flex-1">
        {children}
      </div>

      <Footer />
    </div>
  );
}

function Protected({ children, allowedRoles }) {
  // BYPASS LOGIN FOR TESTING
  return <Layout>{children}</Layout>;
}

function HomeRedirect() {
  const { profile, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
  if (!profile) return <LandingPage />;
  if (profile.role === 'admin') return <Navigate to="/admin" replace />;
  if (profile.role === 'farmer') return <Layout><FarmerDashboard /></Layout>;
  if (profile.role === 'buyer') return <Navigate to="/buyer/dashboard" replace />;
  return <Layout><MarketplaceExperience allowBuying={profile.role === 'buyer'} /></Layout>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/about" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Farmer Routes */}
      <Route path="/farmer/dashboard" element={<Protected allowedRoles={['farmer']}><FarmerDashboard /></Protected>} />
      <Route path="/farmer/market" element={<Protected allowedRoles={['farmer']}><FarmerMarket /></Protected>} />
      <Route path="/farmer/marketplace" element={<Protected allowedRoles={['farmer']}><MarketplaceExperience allowBuying /></Protected>} />
      <Route path="/farmer/tracking" element={<Protected allowedRoles={['farmer']}><FarmerTracking /></Protected>} />
      <Route path="/batches/add" element={<Protected allowedRoles={['farmer']}><AddWoolBatch /></Protected>} />
      <Route path="/batches/:id/details" element={<Protected allowedRoles={['farmer']}><BatchDetails /></Protected>} />
      <Route path="/batches/:id/qr" element={<Protected allowedRoles={['farmer']}><BatchQR /></Protected>} />
      <Route path="/batches/:id/traceability" element={<Protected allowedRoles={['farmer']}><BatchTraceability /></Protected>} />

      {/* Buyer Routes */}
      <Route path="/buyer/dashboard" element={<Protected allowedRoles={['buyer']}><BuyerDashboard /></Protected>} />
      <Route path="/buyer/marketplace" element={<Protected allowedRoles={['buyer']}><MarketplaceExperience allowBuying /></Protected>} />
      <Route path="/buyer/marketplace/:id" element={<Protected allowedRoles={['buyer']}><ListingDetails /></Protected>} />
      <Route path="/buyer/wool-passport/:id" element={<Protected allowedRoles={['buyer']}><WoolPassport /></Protected>} />
      <Route path="/buyer/checkout/:id" element={<Protected allowedRoles={['buyer']}><Checkout /></Protected>} />
      <Route path="/buyer/orders" element={<Protected allowedRoles={['buyer']}><BuyerOrders /></Protected>} />
      <Route path="/buyer/orders/:id" element={<Protected allowedRoles={['buyer']}><OrderDetails /></Protected>} />
      <Route path="/buyer/tracking" element={<Protected allowedRoles={['buyer']}><OrderTracking /></Protected>} />
      <Route path="/buyer/tracking/:id" element={<Protected allowedRoles={['buyer']}><OrderTracking /></Protected>} />
      <Route path="/buyer/saved" element={<Protected allowedRoles={['buyer']}><SavedWool /></Protected>} />
      <Route path="/buyer/notifications" element={<Protected allowedRoles={['buyer']}><BuyerNotifications /></Protected>} />
      <Route path="/buyer/profile" element={<Protected allowedRoles={['buyer']}><BuyerProfile /></Protected>} />
      <Route path="/buyer/analytics" element={<Protected allowedRoles={['buyer']}><BuyerAnalytics /></Protected>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<Protected allowedRoles={['admin']}><AdminLayout><AdminDashboard /></AdminLayout></Protected>} />
      <Route path="/admin/users" element={<Protected allowedRoles={['admin']}><AdminLayout><UserManagement /></AdminLayout></Protected>} />
      <Route path="/admin/batches" element={<Protected allowedRoles={['admin']}><AdminLayout><BatchManagement /></AdminLayout></Protected>} />
      <Route path="/admin/marketplace" element={<Protected allowedRoles={['admin']}><AdminLayout><MarketplaceManagement /></AdminLayout></Protected>} />

      {/* Learn / Training Routes */}
      <Route path="/learn" element={<Protected allowedRoles={['farmer', 'artisan', 'buyer', 'processor', 'admin']}><LearnLanding /></Protected>} />
      <Route path="/learn/category/:categoryName" element={<Protected allowedRoles={['farmer', 'artisan', 'buyer', 'processor', 'admin']}><ResourceListing /></Protected>} />
      <Route path="/learn/resource/:id" element={<Protected allowedRoles={['farmer', 'artisan', 'buyer', 'processor', 'admin']}><ResourceDetails /></Protected>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}


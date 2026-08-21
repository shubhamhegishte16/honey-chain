import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, LogOut, MapPin, Menu, X, Bell } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';
import { signOut } from './services/auth.service';
import Footer from './components/ui/Footer';
import LanguageGate from './components/ui/LanguageGate';
import LanguageSelector from './components/ui/LanguageSelector';
import MobileBottomNav from './components/ui/MobileBottomNav';
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
import FarmerProfile from './pages/farmer/FarmerProfile';
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

import ProcessorDashboard from './pages/processor/ProcessorDashboard';
import ProcessingRequests from './pages/processor/ProcessingRequests';
import IncomingBatches from './pages/processor/IncomingBatches';
import ActiveProcessing from './pages/processor/ActiveProcessing';
import ProcessingHistory from './pages/processor/ProcessingHistory';
import ProcessorBatchManagement from './pages/processor/BatchManagement';
import ProcessedProducts from './pages/processor/ProcessedProducts';
import ProcessorNotifications from './pages/processor/ProcessorNotifications';
import ProcessorProfile from './pages/processor/ProcessorProfile';
import ProcessorPassportScanner from './pages/processor/ProcessorPassportScanner';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import BatchManagement from './pages/admin/BatchManagement';
import MarketplaceManagement from './pages/admin/MarketplaceManagement';
import QualityCenter from './pages/quality/QualityCenter';

import LearnLanding from './pages/learn/LearnLanding';
import ResourceListing from './pages/learn/ResourceListing';
import ResourceDetails from './pages/learn/ResourceDetails';
import ProducerDirectory from './pages/learn/ProducerDirectory';

import ArtisanDashboard from './pages/artisan/ArtisanDashboard';
import ArtisanBatches from './pages/artisan/ArtisanBatches';
import ArtisanBatchDetails from './pages/artisan/ArtisanBatchDetails';
import ArtisanProcessing from './pages/artisan/ArtisanProcessing';
import ArtisanQuality from './pages/artisan/ArtisanQuality';
import ArtisanCompleted from './pages/artisan/ArtisanCompleted';

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
  const { t } = useLanguage();
  const nav = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);

  const farmerLinks = [
    { to: '/', label: t('dashboard') },
    { to: '/farmer/market', label: t('market') },
    { to: '/farmer/marketplace', label: t('marketplace') },
    { to: '/farmer/tracking', label: t('tracking') },
    { to: '/learn', label: t('learn') },
  ];

  const adminLinks = [
    { to: '/admin', label: t('dashboard') },
    { to: '/admin/users', label: t('users') },
    { to: '/admin/batches', label: t('batches') },
    { to: '/admin/marketplace', label: t('marketplace') },
    { to: '/quality', label: t('qualityAssurance') },
  ];

  const buyerLinks = [
    { to: '/buyer/dashboard', label: t('dashboard') },
    { to: '/buyer/marketplace', label: t('findWool') },
    { to: '/buyer/orders', label: t('myOrders') },
    { to: '/buyer/tracking', label: t('tracking') },
    { to: '/buyer/analytics', label: t('analyticsNav') },
    { to: '/buyer/saved', label: t('savedNav') },
  ];

  const artisanLinks = [
    { to: '/artisan', label: t('dashboard') },
    { to: '/artisan/batches', label: t('myWool') },
    { to: '/artisan/processing', label: t('processing') },
    { to: '/artisan/quality', label: t('quality') },
    { to: '/artisan/completed', label: t('completed') },
    { to: '/learn', label: t('helpNav') },
  ];

  const processorLinks = [
    { to: '/processor/dashboard', label: 'Dashboard' },
    { to: '/processor/requests', label: 'Processing Requests' },
    { to: '/processor/incoming', label: 'Incoming Batches' },
    { to: '/processor/active', label: 'Active Processing' },
    { to: '/processor/history', label: 'Processing History' },
    { to: '/processor/batches', label: 'Batch Management' },
    { to: '/processor/products', label: 'Processed Products' },
    { to: '/processor/passport', label: 'QR / Wool Passport' },
  ];

  const links = profile?.role === 'admin' ? adminLinks
    : profile?.role === 'farmer' ? farmerLinks
    : profile?.role === 'processor' ? processorLinks
    : profile?.role === 'buyer' ? buyerLinks
    : profile?.role === 'artisan' ? artisanLinks
    : buyerLinks;

  const getProfileLink = (role) => {
    switch(role) {
      case 'farmer': return '/farmer/profile';
      case 'processor': return '/processor/profile';
      case 'buyer': return '/buyer/profile';
      case 'artisan': return '/artisan/profile';
      default: return '/';
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-surface/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
          {/* Logo with official emblem */}
          <Link to="/" className="flex items-center gap-2.5 font-extrabold text-textPrimary text-lg sm:text-xl tracking-tight shrink-0 group">
            <img
              src="/logo.png"
              alt="WoolConnect"
              className="h-11 w-11 sm:h-13 sm:w-13 object-contain rounded-2xl shadow-xs transition-transform group-hover:scale-105"
            />
            <span className="leading-none text-xl sm:text-2xl font-black">
              Wool<span className="text-primary">Connect</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {links.map(l => (
              <NavLink key={l.to} to={l.to}>{l.label}</NavLink>
            ))}
          </nav>

          {/* Right side */}
          {profile ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Selector */}
              <div className="hidden sm:block">
                <LanguageSelector compact />
              </div>

              {/* User info - desktop */}
              <div className="hidden md:flex items-center gap-2">
                <Link to={getProfileLink(profile?.role)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-primaryLight text-primary text-xs font-bold">
                    {profile.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                  <div className="hidden lg:block">
                    <p className="text-xs font-bold text-textPrimary leading-tight">{profile.name}</p>
                    <p className="text-[10px] text-textMuted flex items-center gap-0.5"><MapPin size={9} />{profile.district || profile.state || 'India'}</p>
                  </div>
                </Link>
              </div>

              <div className="hidden sm:block h-5 w-px bg-border" />

              {/* Notification Dropdown (Shared for Mobile & Desktop) */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(prev => !prev)}
                  className="relative grid h-8 w-8 place-items-center rounded-full hover:bg-background transition-colors text-textSecondary"
                >
                  <Bell size={17} />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-surface animate-pulse"></span>
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-border bg-surface shadow-card-lg overflow-hidden z-50 animate-fade-in-down">
                    <div className="p-3 border-b border-border/60 flex justify-between items-center bg-background">
                      <span className="font-bold text-sm text-textPrimary">{t('notifications', 'Notifications')}</span>
                      <span className="text-[10px] uppercase font-bold text-primary cursor-pointer hover:underline" onClick={() => setShowNotifications(false)}>{t('markAllRead', 'Mark all read')}</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto p-2">
                      <div className="p-2 hover:bg-background rounded-xl cursor-pointer mb-1 transition-colors">
                        <p className="text-xs font-semibold text-textPrimary">System Update</p>
                        <p className="text-[10px] text-textSecondary line-clamp-2 mt-0.5">Welcome to WoolConnect! Your profile is ready.</p>
                        <p className="text-[9px] text-textMuted mt-1">Just now</p>
                      </div>
                      <div className="p-2 hover:bg-background rounded-xl cursor-pointer transition-colors">
                        <p className="text-xs font-semibold text-textPrimary">Market Alert</p>
                        <p className="text-[10px] text-textSecondary line-clamp-2 mt-0.5">New APMC Mandi rates have been updated for your state.</p>
                        <p className="text-[9px] text-textMuted mt-1">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Logout button - desktop */}
              <button
                aria-label="Log out"
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                onClick={async () => { await signOut(); nav('/login'); }}
              >
                <LogOut size={14} />
                <span className="hidden lg:inline">{t('logout')}</span>
              </button>

              {/* Mobile hamburger for drawer */}
              <button
                className="sm:hidden grid h-8 w-8 place-items-center rounded-xl bg-background border border-border/80 text-textPrimary"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <LanguageSelector compact />
              <Link to="/login" className="px-3 py-1.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primaryDark">
                {t('footerSignIn', 'Sign In')}
              </Link>
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
                <Leaf size={16} /> {t('more')}
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

            <nav className="p-3 flex flex-col space-y-1">
              {links.map(l => (
                <NavLink key={l.to} to={l.to} onClick={() => setMobileOpen(false)}>
                  {l.label}
                </NavLink>
              ))}
              
              <div className="my-3 border-t border-border/40"></div>
              
              <NavLink to={getProfileLink(profile?.role)} onClick={() => setMobileOpen(false)}>
                {t('profile', 'My Profile')}
              </NavLink>
              <NavLink to="#" onClick={() => setMobileOpen(false)}>
                {t('settings', 'Settings')}
              </NavLink>
              <NavLink to="/learn" onClick={() => setMobileOpen(false)}>
                {t('support', 'Help & Support')}
              </NavLink>
            </nav>

            <div className="px-4">
              <LanguageSelector compact />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/60">
              <button
                onClick={async () => { setMobileOpen(false); await signOut(); nav('/login'); }}
                className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700"
              >
                <LogOut size={16} /> {t('logout')}
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
      <MobileBottomNav />
    </div>
  );
}

function Protected({ children, allowedRoles }) {
  const { profile, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }
  if (!profile) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/" replace />;
  }
  return <LanguageGate active={Boolean(profile)}><Layout>{children}</Layout></LanguageGate>;
}

function HomeRedirect() {
  const { profile, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
  if (!profile) return <LandingPage />;
  if (profile.role === 'admin') return <LanguageGate active><Navigate to="/admin" replace /></LanguageGate>;
  if (profile.role === 'farmer') return <LanguageGate active><Layout><FarmerDashboard /></Layout></LanguageGate>;
  if (profile.role === 'buyer') return <LanguageGate active><Navigate to="/buyer/dashboard" replace /></LanguageGate>;
  if (profile.role === 'artisan') return <LanguageGate active><Navigate to="/artisan" replace /></LanguageGate>;
  if (profile.role === 'processor') return <LanguageGate active><Navigate to="/processor/dashboard" replace /></LanguageGate>;
  return <LanguageGate active><Layout><MarketplaceExperience allowBuying={profile.role === 'buyer'} /></Layout></LanguageGate>;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);

  useEffect(() => {
    // Show splash screen for 2 seconds, then fade out over 500ms
    const fadeTimer = setTimeout(() => setFadeSplash(true), 2000);
    const removeTimer = setTimeout(() => setShowSplash(false), 2500);
    return () => { clearTimeout(fadeTimer); clearTimeout(removeTimer); };
  }, []);

  return (
    <>
      {showSplash && (
        <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-surface transition-opacity duration-500 ${fadeSplash ? 'opacity-0' : 'opacity-100'}`}>
          <div className="flex flex-col items-center animate-scale-in">
            <img src="/logo.png" alt="WoolConnect" className="w-24 h-24 sm:w-32 sm:h-32 mb-4 drop-shadow-xl" />
            <h1 className="text-3xl font-black tracking-tight text-textPrimary animate-fade-in-up">
              Wool<span className="text-primary">Connect</span>
            </h1>
            <p className="text-primary mt-2 tracking-[0.2em] uppercase text-xs font-extrabold animate-fade-in-up delay-1">
              Farm to Fabric
            </p>
          </div>
        </div>
      )}
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
        <Route path="/farmer/profile" element={<Protected allowedRoles={['farmer']}><FarmerProfile /></Protected>} />

        {/* Artisan Routes */}
        <Route path="/artisan" element={<Protected allowedRoles={['artisan']}><ArtisanDashboard /></Protected>} />
        <Route path="/artisan/batches" element={<Protected allowedRoles={['artisan']}><ArtisanBatches /></Protected>} />
        <Route path="/artisan/batches/:id" element={<Protected allowedRoles={['artisan']}><ArtisanBatchDetails /></Protected>} />
        <Route path="/artisan/processing" element={<Protected allowedRoles={['artisan']}><ArtisanProcessing /></Protected>} />
        <Route path="/artisan/quality" element={<Protected allowedRoles={['artisan']}><ArtisanQuality /></Protected>} />
        <Route path="/artisan/completed" element={<Protected allowedRoles={['artisan']}><ArtisanCompleted /></Protected>} />

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

        {/* Processor Routes */}
        <Route path="/processor/dashboard" element={<Protected allowedRoles={['processor']}><ProcessorDashboard /></Protected>} />
        <Route path="/processor/requests" element={<Protected allowedRoles={['processor']}><ProcessingRequests /></Protected>} />
        <Route path="/processor/incoming" element={<Protected allowedRoles={['processor']}><IncomingBatches /></Protected>} />
        <Route path="/processor/active" element={<Protected allowedRoles={['processor']}><ActiveProcessing /></Protected>} />
        <Route path="/processor/history" element={<Protected allowedRoles={['processor']}><ProcessingHistory /></Protected>} />
        <Route path="/processor/batches" element={<Protected allowedRoles={['processor']}><ProcessorBatchManagement /></Protected>} />
        <Route path="/processor/products" element={<Protected allowedRoles={['processor']}><ProcessedProducts /></Protected>} />
        <Route path="/processor/passport" element={<Protected allowedRoles={['processor']}><ProcessorPassportScanner /></Protected>} />
        <Route path="/processor/passport/:id" element={<Protected allowedRoles={['processor']}><WoolPassport /></Protected>} />
        <Route path="/processor/notifications" element={<Protected allowedRoles={['processor']}><ProcessorNotifications /></Protected>} />
        <Route path="/processor/profile" element={<Protected allowedRoles={['processor']}><ProcessorProfile /></Protected>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Protected allowedRoles={['admin']}><AdminLayout><AdminDashboard /></AdminLayout></Protected>} />
        <Route path="/admin/users" element={<Protected allowedRoles={['admin']}><AdminLayout><UserManagement /></AdminLayout></Protected>} />
        <Route path="/admin/batches" element={<Protected allowedRoles={['admin']}><AdminLayout><BatchManagement /></AdminLayout></Protected>} />
        <Route path="/admin/marketplace" element={<Protected allowedRoles={['admin']}><AdminLayout><MarketplaceManagement /></AdminLayout></Protected>} />
        <Route path="/quality" element={<Protected allowedRoles={['admin']}><AdminLayout><QualityCenter /></AdminLayout></Protected>} />

        {/* Learn / Training Routes */}
        <Route path="/learn" element={<Protected allowedRoles={['farmer', 'artisan', 'buyer', 'processor', 'admin']}><LearnLanding /></Protected>} />
        <Route path="/learn/category/:categoryName" element={<Protected allowedRoles={['farmer', 'artisan', 'buyer', 'processor', 'admin']}><ResourceListing /></Protected>} />
        <Route path="/learn/resource/:id" element={<Protected allowedRoles={['farmer', 'artisan', 'buyer', 'processor', 'admin']}><ResourceDetails /></Protected>} />
        <Route path="/learn/producers" element={<Protected allowedRoles={['farmer', 'artisan', 'buyer', 'processor', 'admin']}><ProducerDirectory /></Protected>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
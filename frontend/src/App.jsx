import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, LogOut, MapPin, Menu, X, Bell, Sparkles } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';
import { signOut, setDemoUser } from './services/auth.service';
import { DEMO_PROFILES } from './services/mockData';
import Footer from './components/ui/Footer';
import LanguageGate from './components/ui/LanguageGate';
import LanguageSelector from './components/ui/LanguageSelector';
import MobileBottomNav from './components/ui/MobileBottomNav';
import ChatbotWidget from './components/ui/ChatbotWidget';
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

function HoneyChainFlowSwitcher() {
  const { profile, setProfileAfterAuth } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const switchRole = (roleKey, targetPath) => {
    const user = setDemoUser(roleKey);
    if (setProfileAfterAuth) setProfileAfterAuth(user);
    if (targetPath) navigate(targetPath);
  };

  return (
    <aside aria-label="HoneyChain Demo Navigation" className="bg-[#281D1C] text-white text-xs px-3.5 py-2 flex items-center justify-between z-50 shadow-md border-b border-[#F4B345]/20">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 max-w-[92rem] mx-auto w-full">
        <span className="font-bold uppercase tracking-wider text-[10px] bg-[#861C1C] text-[#F4B345] px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0 border border-[#F4B345]/30">
          <span className="text-xs">🍯</span> Honey Chain:
        </span>
        <button onClick={() => navigate('/')} className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${pathname === '/' || pathname === '/landing' ? 'bg-[#F4B345] text-[#281D1C] font-bold shadow-sm' : 'hover:bg-white/10 text-white/80'}`}>
          🌐 Public Landing
        </button>
        <button onClick={() => switchRole('farmer', '/farmer/dashboard')} className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${pathname.startsWith('/farmer') ? 'bg-[#F4B345] text-[#281D1C] font-bold shadow-sm' : 'hover:bg-white/10 text-white/80'}`}>
          🐝 Beekeeper Panel
        </button>
        <button onClick={() => switchRole('farmer', '/batches/add')} className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${pathname === '/batches/add' ? 'bg-[#F4B345] text-[#281D1C] font-bold shadow-sm' : 'hover:bg-white/10 text-white/80'}`}>
          ➕ Log Harvest
        </button>
        <button onClick={() => switchRole('farmer', '/farmer/tracking')} className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${pathname === '/farmer/tracking' ? 'bg-[#F4B345] text-[#281D1C] font-bold shadow-sm' : 'hover:bg-white/10 text-white/80'}`}>
          📦 Honey Lots
        </button>
        <button onClick={() => switchRole('quality', '/quality')} className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${pathname === '/quality' ? 'bg-[#F4B345] text-[#281D1C] font-bold shadow-sm' : 'hover:bg-white/10 text-white/80'}`}>
          🔬 KVIC Lab & AI Purity
        </button>
        <button onClick={() => switchRole('processor', '/processor/dashboard')} className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${pathname.startsWith('/processor') ? 'bg-[#F4B345] text-[#281D1C] font-bold shadow-sm' : 'hover:bg-white/10 text-white/80'}`}>
          🏭 Bottling Unit
        </button>
        <button onClick={() => switchRole('buyer', '/buyer/marketplace')} className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${pathname.startsWith('/buyer') && !pathname.includes('passport') ? 'bg-[#F4B345] text-[#281D1C] font-bold shadow-sm' : 'hover:bg-white/10 text-white/80'}`}>
          🛒 Buyer Marketplace
        </button>
        <button onClick={() => switchRole('admin', '/admin')} className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${pathname === '/admin' ? 'bg-[#F4B345] text-[#281D1C] font-bold shadow-sm' : 'hover:bg-white/10 text-white/80'}`}>
          🏛️ KVIC Mission
        </button>
        <button onClick={() => navigate('/buyer/honey-passport/HC-RJ-2026-000108')} className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${pathname.includes('passport') ? 'bg-[#F4B345] text-[#281D1C] font-bold shadow-sm' : 'hover:bg-white/10 text-white/80'}`}>
          📱 QR Passport Demo
        </button>
      </div>
      <div className="hidden xl:flex items-center gap-2 pl-3 text-[11px] shrink-0 font-medium text-[#FAF7EE]/80">
        <span>Active: <b className="capitalize underline text-[#F4B345] font-bold">{profile?.role || 'Visitor'}</b> ({profile?.name || 'Guest'})</span>
      </div>
    </aside>
  );
}

function Layout({ children }) {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const nav = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);

  const farmerLinks = [
    { to: '/farmer/dashboard', label: 'Dashboard' },
    { to: '/farmer/market', label: 'Honey Mandi' },
    { to: '/farmer/marketplace', label: 'Sell Honey' },
    { to: '/farmer/tracking', label: 'My Apiaries' },
    { to: '/learn', label: 'Beekeeping Guide' },
  ];

  const adminLinks = [
    { to: '/admin', label: 'National Dashboard' },
    { to: '/admin/users', label: 'Clusters & Beekeepers' },
    { to: '/admin/batches', label: 'Honey Lots' },
    { to: '/admin/marketplace', label: 'Procurement Rates' },
    { to: '/quality', label: 'KVIC Quality Lab' },
  ];

  const buyerLinks = [
    { to: '/buyer/dashboard', label: 'Dashboard' },
    { to: '/buyer/marketplace', label: 'Pure Honey Catalog' },
    { to: '/buyer/orders', label: 'My Orders' },
    { to: '/buyer/tracking', label: 'Consignment Tracking' },
    { to: '/buyer/analytics', label: 'Procurement Stats' },
    { to: '/buyer/saved', label: 'Saved Batches' },
  ];

  const artisanLinks = [
    { to: '/artisan', label: 'Cluster Dashboard' },
    { to: '/artisan/batches', label: 'Apiary Lots' },
    { to: '/artisan/processing', label: 'Centrifugation' },
    { to: '/artisan/quality', label: 'Purity Check' },
    { to: '/artisan/completed', label: 'Packed Barrels' },
    { to: '/learn', label: 'KVIC Manuals' },
  ];

  const processorLinks = [
    { to: '/processor/dashboard', label: 'Dashboard' },
    { to: '/processor/requests', label: 'Raw Honey Intake' },
    { to: '/processor/incoming', label: 'Incoming Lots' },
    { to: '/processor/active', label: 'Micro-Filtration' },
    { to: '/processor/history', label: 'Batch Logs' },
    { to: '/processor/batches', label: 'Bottling & QR' },
    { to: '/processor/products', label: 'Jar Products' },
    { to: '/processor/passport', label: 'QR Scanner' },
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
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#FAF7EE] text-[#281D1C]">
      {/* Floating Header */}
      <header className="sticky top-0 z-30 pt-2 sm:pt-3 px-3 sm:px-6">
        <div className="max-w-[92rem] mx-auto bg-white/85 backdrop-blur-md rounded-full border border-[#E8E3CF] shadow-card px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 font-extrabold text-[#281D1C] text-lg sm:text-xl tracking-tight shrink-0 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#F4B345] to-[#C06E30] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <span className="text-xl">🐝</span>
            </div>
            <div className="flex flex-col">
              <span className="leading-none text-lg sm:text-xl font-black font-serif text-[#281D1C]">
                Honey<span className="text-[#861C1C]"> Chain</span>
              </span>
              <span className="text-[10px] font-semibold text-[#C06E30] tracking-wider uppercase mt-0.5">
                Pure · Natural · Trusted
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <Link
              to="/"
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#5E524D] hover:text-[#861C1C] hover:bg-[#861C1C]/10 transition-colors flex items-center gap-1"
            >
              <span>🏠 Main Page</span>
            </Link>
            {links.map(l => (
              <NavLink key={l.to} to={l.to}>{l.label}</NavLink>
            ))}
          </nav>

          {/* Right side */}
          {profile ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Main Page Button for Quick Access */}
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF7EE] border border-[#E8E3CF] px-3.5 py-2 text-xs font-bold text-[#281D1C] hover:bg-white hover:border-[#D6CEB5] transition-all shadow-xs"
              >
                <span>🏠</span>
                <span className="hidden sm:inline">Main Page</span>
              </Link>

              {/* Trace Your Honey Pill CTA */}
              <Link 
                to="/buyer/honey-passport/HC-RJ-2026-000108"
                className="hidden lg:inline-flex items-center gap-2 rounded-full bg-[#F4B345] px-4 py-2 text-xs font-bold text-[#281D1C] shadow-gold hover:bg-[#F6C063] transition-all hover:scale-105"
              >
                <span>Trace Your Honey</span>
                <span>→</span>
              </Link>

              {/* Language Selector */}
              <div className="hidden sm:block">
                <LanguageSelector compact />
              </div>

              {/* User info */}
              <div className="hidden md:flex items-center gap-2">
                <Link to={getProfileLink(profile?.role)} className="flex items-center gap-2 hover:opacity-85 transition-opacity">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[#861C1C] text-white text-xs font-bold shadow-xs">
                    {profile.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                  <div className="hidden xl:block">
                    <p className="text-xs font-bold text-[#281D1C] leading-tight">{profile.name}</p>
                    <p className="text-[10px] text-[#9B918B] flex items-center gap-0.5"><MapPin size={9} />{profile.district || profile.state || 'India'}</p>
                  </div>
                </Link>
              </div>

              <div className="hidden sm:block h-5 w-px bg-[#E8E3CF]" />

              {/* Notification Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(prev => !prev)}
                  className="relative grid h-9 w-9 place-items-center rounded-full hover:bg-black/5 transition-colors text-[#5E524D]"
                  aria-label="Notifications"
                >
                  <Bell size={17} />
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#861C1C] border-2 border-white animate-pulse"></span>
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 rounded-3xl border border-[#E8E3CF] bg-white shadow-soft-lg overflow-hidden z-50 animate-fade-in-down p-2">
                    <div className="p-3 border-b border-[#E8E3CF]/60 flex justify-between items-center bg-[#FAF7EE] rounded-2xl">
                      <span className="font-bold text-sm text-[#281D1C] font-serif">{t('notifications', 'Notifications')}</span>
                      <span className="text-[10px] uppercase font-bold text-[#861C1C] cursor-pointer hover:underline" onClick={() => setShowNotifications(false)}>{t('markAllRead', 'Mark all read')}</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto p-1.5 space-y-1">
                      <div className="p-3 hover:bg-[#FAF7EE] rounded-2xl cursor-pointer transition-colors">
                        <p className="text-xs font-semibold text-[#281D1C]">Honey Chain Verification</p>
                        <p className="text-[11px] text-[#5E524D] line-clamp-2 mt-0.5">Welcome to Honey Chain. KVIC Apiary lot registry is active.</p>
                        <p className="text-[9px] text-[#9B918B] mt-1">Just now</p>
                      </div>
                      <div className="p-3 hover:bg-[#FAF7EE] rounded-2xl cursor-pointer transition-colors">
                        <p className="text-xs font-semibold text-[#281D1C]">Mandi Price Update</p>
                        <p className="text-[11px] text-[#5E524D] line-clamp-2 mt-0.5">Mustard Blossom honey APMC benchmark rose to ₹285/kg.</p>
                        <p className="text-[9px] text-[#9B918B] mt-1">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Logout button */}
              <button
                aria-label="Log out"
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-[#861C1C] hover:bg-[#861C1C]/10 transition-colors"
                onClick={async () => { await signOut(); nav('/login'); }}
              >
                <LogOut size={14} />
                <span className="hidden xl:inline">{t('logout')}</span>
              </button>

              {/* Mobile hamburger */}
              <button
                className="md:hidden grid h-9 w-9 place-items-center rounded-full bg-[#FAF7EE] border border-[#E8E3CF] text-[#281D1C]"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <LanguageSelector compact />
              <Link to="/login" className="px-4 py-2 rounded-full text-xs font-bold bg-[#861C1C] text-white hover:bg-[#6A1515] transition-all shadow-sm">
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
      <ChatbotWidget />
    </div>
  );
}

function Protected({ children, allowedRoles }) {
  const { profile, loading, setProfileAfterAuth } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  // Automatic demo profile assignment for direct localhost testing without backend
  const activeProfile = profile || (() => {
    const roleToUse = allowedRoles && allowedRoles.length > 0 ? allowedRoles[0] : 'farmer';
    const demo = setDemoUser(roleToUse);
    if (setProfileAfterAuth) setProfileAfterAuth(demo);
    return demo;
  })();

  // If role mismatch when visiting a direct link, auto-switch to required role for smooth testing
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(activeProfile.role)) {
    const roleToUse = allowedRoles[0];
    const demo = setDemoUser(roleToUse);
    if (setProfileAfterAuth) setProfileAfterAuth(demo);
    return <LanguageGate active><Layout>{children}</Layout></LanguageGate>;
  }

  return <LanguageGate active={Boolean(activeProfile)}><Layout>{children}</Layout></LanguageGate>;
}

function HomeRedirect() {
  // Always open the approved Landing Page first on root '/'
  return <LandingPage />;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);

  useEffect(() => {
    // Show splash screen briefly, then fade out
    const fadeTimer = setTimeout(() => setFadeSplash(true), 1200);
    const removeTimer = setTimeout(() => setShowSplash(false), 1600);
    return () => { clearTimeout(fadeTimer); clearTimeout(removeTimer); };
  }, []);

  return (
    <>
      {showSplash && (
        <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FAF7EE] transition-opacity duration-500 ${fadeSplash ? 'opacity-0' : 'opacity-100'}`}>
          <div className="flex flex-col items-center animate-scale-in">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-[#F4B345] to-[#C06E30] flex items-center justify-center text-white shadow-lg mb-4 text-4xl">
              🐝
            </div>
            <h1 className="text-3xl font-black font-serif tracking-tight text-[#281D1C]">
              Honey<span className="text-[#861C1C]">Chain</span>
            </h1>
            <p className="text-[#C06E30] mt-2 tracking-[0.2em] uppercase text-xs font-bold">
              Hive to Home • KVIC Honey Mission
            </p>
          </div>
        </div>
      )}
      <HoneyChainFlowSwitcher />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/about" element={<LandingPage />} />
        <Route path="/dashboard" element={<Protected allowedRoles={['farmer', 'buyer', 'processor', 'artisan', 'admin']}><FarmerDashboard /></Protected>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Public QR Consumer Passport Routes */}
        <Route path="/buyer/honey-passport/:id" element={<WoolPassport />} />
        <Route path="/buyer/wool-passport/:id" element={<WoolPassport />} />
        <Route path="/honey-passport/:id" element={<WoolPassport />} />
        <Route path="/passport/:id" element={<WoolPassport />} />

        {/* Beekeeper / Farmer Routes */}
        <Route path="/farmer/dashboard" element={<Protected allowedRoles={['farmer']}><FarmerDashboard /></Protected>} />
        <Route path="/farmer/market" element={<Protected allowedRoles={['farmer']}><FarmerMarket /></Protected>} />
        <Route path="/farmer/marketplace" element={<Protected allowedRoles={['farmer']}><MarketplaceExperience allowBuying /></Protected>} />
        <Route path="/farmer/tracking" element={<Protected allowedRoles={['farmer']}><FarmerTracking /></Protected>} />
        <Route path="/batches/add" element={<Protected allowedRoles={['farmer']}><AddWoolBatch /></Protected>} />
        <Route path="/batches/:id/details" element={<Protected allowedRoles={['farmer']}><BatchDetails /></Protected>} />
        <Route path="/batches/:id/qr" element={<Protected allowedRoles={['farmer']}><BatchQR /></Protected>} />
        <Route path="/batches/:id/traceability" element={<Protected allowedRoles={['farmer']}><BatchTraceability /></Protected>} />
        <Route path="/farmer/profile" element={<Protected allowedRoles={['farmer']}><FarmerProfile /></Protected>} />

        {/* Artisan / Cooperative Routes */}
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

        {/* Admin & Lab Routes */}
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
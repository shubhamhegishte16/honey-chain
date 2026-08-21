import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Leaf,
  ArrowRight,
  Sparkles,
  QrCode,
  TrendingUp,
  ShieldCheck,
  Award,
  CheckCircle2,
  MapPin,
  Package,
  Layers,
  Store,
  ChevronRight,
  ExternalLink,
  Menu,
  X,
  Building2,
  Factory,
  Palette,
  Sprout,
  Users,
  BarChart3,
  HelpCircle,
  Clock,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from '../components/ui/LanguageSelector';
import { getAllStatePrices } from '../services/market.service';

const WOOL_BREEDS = [
  {
    name: 'Chokla',
    origin: 'Rajasthan (Bikaner, Nagaur)',
    micron: '28 – 30 µm',
    yieldPct: '65 – 70%',
    uses: 'Fine carpets, blended apparel, blankets',
    tag: 'Indian Merino',
    tone: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    colorHex: '#3F6B3F',
  },
  {
    name: 'Patanwadi',
    origin: 'Gujarat (Kutch, Patan)',
    micron: '30 – 34 µm',
    yieldPct: '62 – 68%',
    uses: 'Traditional shawls, hosiery, knitwear',
    tag: 'Lustrous Fleece',
    tone: 'bg-sky-50 text-sky-800 border-sky-200',
    colorHex: '#3A6B8A',
  },
  {
    name: 'Gaddi / Merino',
    origin: 'Himachal & Jammu-Kashmir',
    micron: '21 – 25 µm',
    yieldPct: '72 – 78%',
    uses: 'Luxury pashmina blends, tweed, suits',
    tag: 'Mountain Soft',
    tone: 'bg-purple-50 text-purple-800 border-purple-200',
    colorHex: '#7C3AED',
  },
  {
    name: 'Magra',
    origin: 'Rajasthan (Bikaner, Churu)',
    micron: '32 – 36 µm',
    yieldPct: '60 – 65%',
    uses: 'Export-grade carpet yarn, felt art',
    tag: 'High Luster',
    tone: 'bg-amber-50 text-amber-900 border-amber-200',
    colorHex: '#B9793E',
  },
  {
    name: 'Deccani',
    origin: 'Maharashtra, Karnataka, Telangana',
    micron: '40 – 50 µm',
    yieldPct: '55 – 62%',
    uses: 'Traditional Gongadi & Kambal rugs, geotextiles',
    tag: 'Heritage Black/Brown',
    tone: 'bg-stone-100 text-stone-800 border-stone-300',
    colorHex: '#4A4A45',
  },
  {
    name: 'Marwari',
    origin: 'Rajasthan & North Gujarat',
    micron: '34 – 38 µm',
    yieldPct: '58 – 64%',
    uses: 'Durable floor carpets, military blankets',
    tag: 'Rugged Resilience',
    tone: 'bg-orange-50 text-orange-800 border-orange-200',
    colorHex: '#C25E2E',
  },
];

function getEcosystemRoles(t) {
  return [
    {
      id: 'farmer', icon: Sprout, title: t('roleFarmerTitle'), subtitle: t('roleFarmerSubtitle'),
      points: [t('roleFarmerPt1'), t('roleFarmerPt2'), t('roleFarmerPt3'), t('roleFarmerPt4')],
      cta: t('roleFarmerCta'), color: 'border-emerald-200 bg-emerald-50/40 text-emerald-800', accentColor: '#3F6B3F',
    },
    {
      id: 'buyer', icon: Building2, title: t('roleBuyerTitle'), subtitle: t('roleBuyerSubtitle'),
      points: [t('roleBuyerPt1'), t('roleBuyerPt2'), t('roleBuyerPt3'), t('roleBuyerPt4')],
      cta: t('roleBuyerCta'), color: 'border-sky-200 bg-sky-50/40 text-sky-800', accentColor: '#3A6B8A',
    },
    {
      id: 'processor', icon: Factory, title: t('roleProcessorTitle'), subtitle: t('roleProcessorSubtitle'),
      points: [t('roleProcessorPt1'), t('roleProcessorPt2'), t('roleProcessorPt3'), t('roleProcessorPt4')],
      cta: t('roleProcessorCta'), color: 'border-amber-200 bg-amber-50/40 text-amber-900', accentColor: '#B9793E',
    },
    {
      id: 'artisan', icon: Palette, title: t('roleArtisanTitle'), subtitle: t('roleArtisanSubtitle'),
      points: [t('roleArtisanPt1'), t('roleArtisanPt2'), t('roleArtisanPt3'), t('roleArtisanPt4')],
      cta: t('roleArtisanCta'), color: 'border-purple-200 bg-purple-50/40 text-purple-800', accentColor: '#7C3AED',
    },
  ];
}

function getFaqs(t) {
  return [
    { q: t('faq1Q'), a: t('faq1A') },
    { q: t('faq2Q'), a: t('faq2A') },
    { q: t('faq3Q'), a: t('faq3A') },
    { q: t('faq4Q'), a: t('faq4A') },
  ];
}

export default function LandingPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const ECOSYSTEM_ROLES = getEcosystemRoles(t);
  const FAQS = getFaqs(t);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prices, setPrices] = useState([]);
  const [selectedRole, setSelectedRole] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    getAllStatePrices().then(res => {
      if (!res.error && res.data?.length > 0) {
        setPrices(res.data);
      } else {
        // Fallback default mandi prices for impressive landing presentation
        setPrices([
          { state: 'Rajasthan', wool_type: 'Chokla Super White', price_per_kg: 285, change_percent: 3.4 },
          { state: 'Gujarat', wool_type: 'Patanwadi Lustre', price_per_kg: 215, change_percent: 1.8 },
          { state: 'Himachal Pradesh', wool_type: 'Gaddi Mountain Fleece', price_per_kg: 340, change_percent: 4.2 },
          { state: 'Jammu & Kashmir', wool_type: 'Merino Fine Grade', price_per_kg: 425, change_percent: 2.1 },
          { state: 'Maharashtra', wool_type: 'Deccani Coarse Black', price_per_kg: 145, change_percent: -0.8 },
          { state: 'Rajasthan', wool_type: 'Magra Carpet Special', price_per_kg: 230, change_percent: 1.2 },
          { state: 'Karnataka', wool_type: 'Bellary Natural Brown', price_per_kg: 160, change_percent: 0.9 },
        ]);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-textPrimary flex flex-col selection:bg-primaryLight selection:text-primary">
      {/* ─── Sticky Navbar ─── */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border/70 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 font-bold text-primary text-xl tracking-tight shrink-0">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-white shadow-md shadow-primary/20">
              <Leaf size={20} />
            </span>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-textPrimary leading-none">
                Wool<span className="text-primary">Connect</span>
              </span>
              <span className="text-[10px] font-semibold text-textMuted uppercase tracking-widest mt-0.5">
                {t('footerFarmToFabric2')}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <a href="#features" className="px-3.5 py-2 rounded-xl text-sm font-medium text-textSecondary hover:text-primary hover:bg-primaryLight/40 transition-colors">
              {t('navFeatures')}
            </a>
            <a href="#mandi-rates" className="px-3.5 py-2 rounded-xl text-sm font-medium text-textSecondary hover:text-primary hover:bg-primaryLight/40 transition-colors">
              {t('navMandiRates')}
            </a>
            <a href="#how-it-works" className="px-3.5 py-2 rounded-xl text-sm font-medium text-textSecondary hover:text-primary hover:bg-primaryLight/40 transition-colors">
              {t('navHowItWorks')}
            </a>
            <a href="#breeds" className="px-3.5 py-2 rounded-xl text-sm font-medium text-textSecondary hover:text-primary hover:bg-primaryLight/40 transition-colors">
              {t('navBreeds')}
            </a>
            <a href="#traceability" className="px-3.5 py-2 rounded-xl text-sm font-medium text-textSecondary hover:text-primary hover:bg-primaryLight/40 transition-colors">
              {t('navTraceability')}
            </a>
          </nav>

          {/* Right Action CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <LanguageSelector />
            {profile ? (
              <Link
                to={profile.role === 'admin' ? '/admin' : '/'}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm shadow-md hover:bg-primaryDark hover:shadow-lg transition-all"
              >
                <span>{t('goToDashboard')}</span>
                <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-textPrimary hover:text-primary hover:bg-primaryLight/50 transition-colors"
                >
                  {t('footerSignIn')}
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm shadow-sm hover:bg-primaryDark hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <span>{t('joinFree')}</span>
                  <ArrowRight size={15} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden grid h-10 w-10 place-items-center rounded-xl bg-background border border-border text-textPrimary hover:bg-primaryLight/40 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-border/80 bg-surface px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-xl">
            <nav className="flex flex-col space-y-1">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl text-sm font-semibold text-textSecondary hover:bg-primaryLight/50 hover:text-primary"
              >
                {t('navFeatures')}
              </a>
              <a
                href="#mandi-rates"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl text-sm font-semibold text-textSecondary hover:bg-primaryLight/50 hover:text-primary"
              >
                {t('navLiveMandiRates')}
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl text-sm font-semibold text-textSecondary hover:bg-primaryLight/50 hover:text-primary"
              >
                {t('navHowItWorks')}
              </a>
              <a
                href="#breeds"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl text-sm font-semibold text-textSecondary hover:bg-primaryLight/50 hover:text-primary"
              >
                {t('navBreeds')}
              </a>
              <a
                href="#traceability"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl text-sm font-semibold text-textSecondary hover:bg-primaryLight/50 hover:text-primary"
              >
                {t('navTraceability')}
              </a>
            </nav>

            <div className="pt-3 border-t border-border/60 flex flex-col gap-2">
              <LanguageSelector compact />
              {profile ? (
                <Link
                  to={profile.role === 'admin' ? '/admin' : '/'}
                  className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-center text-sm shadow-sm"
                >
                  {t('goToDashboard')}
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="w-full py-2.5 rounded-xl border border-border bg-surface text-textPrimary font-semibold text-center text-sm"
                  >
                    {t('footerSignIn')}
                  </Link>
                  <Link
                    to="/register"
                    className="w-full py-2.5 rounded-xl bg-primary text-white font-semibold text-center text-sm shadow-sm"
                  >
                    {t('joinFreeCreateAccount')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-32">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(63,107,63,0.14)_0%,rgba(185,121,62,0.06)_40%,transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 text-center lg:text-left">
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primaryLight/80 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
                <Sparkles size={14} className="text-accent" />
                <span>{t('nationalWoolPlatform')}</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-textPrimary leading-[1.12]">
                {t('heroHeadlinePre')} <br className="hidden sm:inline" />
                {t('heroHeadlinePost')} <span className="text-primary">{t('heroHeadlineHighlight')}</span>
              </h1>

              {/* Subtitle */}
              <p className="mt-5 text-base sm:text-lg text-textSecondary leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {t('heroSubtitle')}
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-primary text-white font-bold text-base shadow-lg shadow-primary/25 hover:bg-primaryDark hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
                >
                  <span>{t('startFreeToday')}</span>
                  <ArrowRight size={18} />
                </Link>

                <a
                  href="#mandi-rates"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-surface border border-border text-textPrimary font-semibold text-base shadow-sm hover:border-primary/40 hover:bg-primaryLight/20 transition-all"
                >
                  <TrendingUp size={18} className="text-primary" />
                  <span>{t('exploreMandiRates')}</span>
                </a>

                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3.5 text-sm font-semibold text-textSecondary hover:text-primary"
                >
                  <span>{t('demoSignIn')}</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-10 pt-8 border-t border-border/70 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-textSecondary">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-primary shrink-0" />
                  <span>{t('trustFreeForPastoralists')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <QrCode size={16} className="text-accent shrink-0" />
                  <span>{t('trustTamperProofQr')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-info shrink-0" />
                  <span>{t('trustApmcAligned')}</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Card Preview */}
            <div className="lg:col-span-5 relative">
              {/* Decorative floating badge */}
              <div className="hidden sm:flex absolute -top-6 -left-6 z-20 items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-surface border border-border shadow-card-hover animate-pulse-subtle">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-primaryLight text-primary">
                  <TrendingUp size={16} />
                </span>
                <div>
                  <p className="text-[11px] font-bold text-textMuted uppercase">{t('mandiBenchmark')}</p>
                  <p className="text-xs font-bold text-primary">{t('seasonalGain')}</p>
                </div>
              </div>

              {/* Main Visual Batch Card */}
              <div className="relative rounded-3xl bg-surface border border-border/80 p-6 sm:p-7 shadow-card-lg">
                {/* Card Top */}
                <div className="flex items-center justify-between pb-4 border-b border-border/60">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700 font-bold">
                      <Package size={20} />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-textMuted">{t('liveLotPassport')}</p>
                      <h3 className="font-bold text-textPrimary text-base">Batch #WC-2026-CHOKLA</h3>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300/60">
                    {t('verifiedLot')}
                  </span>
                </div>

                {/* Card Specs Grid */}
                <div className="grid grid-cols-3 gap-3 my-5">
                  <div className="p-3 rounded-2xl bg-background border border-border/70 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-textMuted">{t('weightLabel')}</p>
                    <p className="text-lg font-bold text-textPrimary mt-0.5">850 kg</p>
                    <span className="text-[10px] text-emerald-700 font-semibold">{t('springClip')}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-background border border-border/70 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-textMuted">{t('micronLabel')}</p>
                    <p className="text-lg font-bold text-primary mt-0.5">28.4 µm</p>
                    <span className="text-[10px] text-textSecondary">{t('choklaPure')}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-background border border-border/70 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-textMuted">{t('yieldLabel')}</p>
                    <p className="text-lg font-bold text-accent mt-0.5">68.5%</p>
                    <span className="text-[10px] text-textSecondary">{t('cleanFleece')}</span>
                  </div>
                </div>

                {/* Provenance Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-primaryLight/30 border border-primary/10">
                    <span className="text-textSecondary flex items-center gap-1.5">
                      <MapPin size={14} className="text-primary" /> {t('originFlock')}
                    </span>
                    <strong className="text-textPrimary">Bikaner Mandi, Rajasthan</strong>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-background border border-border/70">
                    <span className="text-textSecondary flex items-center gap-1.5">
                      <Clock size={14} className="text-textMuted" /> {t('shearedOn')}
                    </span>
                    <strong className="text-textPrimary">14 Aug 2026</strong>
                  </div>
                </div>

                {/* Simulated QR Action */}
                <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white border border-border shadow-sm">
                      <QrCode size={36} className="text-textPrimary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-textPrimary">{t('scanToVerify')}</p>
                      <p className="text-[11px] text-textSecondary">{t('digitalProvenancePassport')}</p>
                    </div>
                  </div>
                  <Link
                    to="/register"
                    className="px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primaryDark transition-colors shadow-sm shrink-0"
                  >
                    {t('viewPassportArrow')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Continuous Mandi Rate Ticker ─── */}
      <section id="mandi-rates" className="ticker-wrap bg-surface shadow-inner">
        <div className="ticker-move">
          {[...prices, ...prices].map((item, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-3 px-4 py-1 rounded-xl bg-background/80 border border-border/60 text-xs font-medium"
            >
              <span className="font-bold text-textPrimary">{item.state}</span>
              <span className="text-textSecondary">{item.wool_type}</span>
              <span className="font-bold text-primary">₹{item.price_per_kg}/kg</span>
              <span
                className={`inline-flex items-center text-[11px] font-bold ${
                  item.change_percent >= 0 ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {item.change_percent >= 0 ? `+${item.change_percent}%` : `${item.change_percent}%`}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Key Value Chain Pillars (Features) ─── */}
      <section id="features" className="py-16 sm:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary bg-primaryLight px-3 py-1.5 rounded-full mb-3">
              <Layers size={13} /> {t('integratedArchitecture')}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-textPrimary">
              {t('featuresHeadline')}
            </h2>
            <p className="mt-4 text-base text-textSecondary">
              {t('featuresSubtext')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="glass-card p-7 flex flex-col justify-between">
              <div>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 mb-5 shadow-sm">
                  <QrCode size={24} />
                </span>
                <h3 className="text-xl font-bold text-textPrimary">{t('feature1Title')}</h3>
                <p className="mt-3 text-sm text-textSecondary leading-relaxed">
                  {t('feature1Desc')}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/60 flex items-center gap-2 text-xs font-bold text-primary">
                <CheckCircle2 size={15} /> {t('feature1Tag')}
              </div>
            </div>

            {/* Feature 2 */}
            <div className="glass-card p-7 flex flex-col justify-between">
              <div>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-amber-800 mb-5 shadow-sm">
                  <TrendingUp size={24} />
                </span>
                <h3 className="text-xl font-bold text-textPrimary">{t('feature2Title')}</h3>
                <p className="mt-3 text-sm text-textSecondary leading-relaxed">
                  {t('feature2Desc')}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/60 flex items-center gap-2 text-xs font-bold text-accent">
                <CheckCircle2 size={15} /> {t('feature2Tag')}
              </div>
            </div>

            {/* Feature 3 */}
            <div className="glass-card p-7 flex flex-col justify-between">
              <div>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-50 text-sky-800 mb-5 shadow-sm">
                  <Store size={24} />
                </span>
                <h3 className="text-xl font-bold text-textPrimary">{t('feature3Title')}</h3>
                <p className="mt-3 text-sm text-textSecondary leading-relaxed">
                  {t('feature3Desc')}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/60 flex items-center gap-2 text-xs font-bold text-info">
                <CheckCircle2 size={15} /> {t('feature3Tag')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works Workflow ─── */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-surface border-y border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent bg-accentLight px-3 py-1.5 rounded-full mb-3">
              <Sparkles size={13} /> {t('stepByStepFlow')}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-textPrimary">
              {t('howItWorksHeadline')}
            </h2>
            <p className="mt-3 text-base text-textSecondary">
              {t('howItWorksSubtext')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-background border border-border flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-extrabold text-2xl text-primary font-mono">01</span>
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primaryLight text-primary">
                    <Sprout size={20} />
                  </span>
                </div>
                <h4 className="text-lg font-bold text-textPrimary">{t('step1Title')}</h4>
                <p className="mt-2 text-xs text-textSecondary leading-relaxed">
                  {t('step1Desc')}
                </p>
              </div>
              <div className="mt-5 text-[11px] font-semibold text-textMuted bg-surface p-2.5 rounded-xl border border-border/60">
                🏷️ {t('step1Tag').replace('🏷️ ', '')}
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-background border border-border flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-extrabold text-2xl text-accent font-mono">02</span>
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-accentLight text-accent">
                    <BarChart3 size={20} />
                  </span>
                </div>
                <h4 className="text-lg font-bold text-textPrimary">{t('step2Title')}</h4>
                <p className="mt-2 text-xs text-textSecondary leading-relaxed">
                  {t('step2Desc')}
                </p>
              </div>
              <div className="mt-5 text-[11px] font-semibold text-textMuted bg-surface p-2.5 rounded-xl border border-border/60">
                📊 {t('step2Tag').replace('📊 ', '')}
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-background border border-border flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-extrabold text-2xl text-info font-mono">03</span>
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-infoLight text-info">
                    <Factory size={20} />
                  </span>
                </div>
                <h4 className="text-lg font-bold text-textPrimary">{t('step3Title')}</h4>
                <p className="mt-2 text-xs text-textSecondary leading-relaxed">
                  {t('step3Desc')}
                </p>
              </div>
              <div className="mt-5 text-[11px] font-semibold text-textMuted bg-surface p-2.5 rounded-xl border border-border/60">
                🧪 {t('step3Tag').replace('🧪 ', '')}
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-3xl bg-background border border-border flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-extrabold text-2xl text-purple-700 font-mono">04</span>
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-purple-100 text-purple-700">
                    <Palette size={20} />
                  </span>
                </div>
                <h4 className="text-lg font-bold text-textPrimary">{t('step4Title')}</h4>
                <p className="mt-2 text-xs text-textSecondary leading-relaxed">
                  {t('step4Desc')}
                </p>
              </div>
              <div className="mt-5 text-[11px] font-semibold text-textMuted bg-surface p-2.5 rounded-xl border border-border/60">
                ✨ {t('step4Tag').replace('✨ ', '')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Indigenous Indian Wool Breeds Catalog ─── */}
      <section id="breeds" className="py-16 sm:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary bg-primaryLight px-3 py-1.5 rounded-full mb-2">
                <Leaf size={13} /> {t('naturalWealth')}
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-textPrimary">
                {t('breedsHeadline')}
              </h2>
              <p className="mt-2 text-sm text-textSecondary max-w-xl">
                {t('breedsSubtext')}
              </p>
            </div>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primaryDark self-start md:self-auto"
            >
              {t('browseAllLots')}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WOOL_BREEDS.map(breed => (
              <div
                key={breed.name}
                className="group rounded-3xl bg-surface border border-border/80 p-6 shadow-sm hover:shadow-card-hover hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${breed.tone}`}>
                      {breed.tag}
                    </span>
                    <span className="text-xs font-semibold text-textMuted flex items-center gap-1">
                      <MapPin size={12} /> {breed.origin.split(' ')[0]}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-textPrimary group-hover:text-primary transition-colors">
                    {breed.name}
                  </h3>
                  <p className="text-xs text-textMuted mt-0.5">{breed.origin}</p>

                  <div className="grid grid-cols-2 gap-2.5 my-4 p-3 rounded-2xl bg-background border border-border/60">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-textMuted">{t('fiberDiameter')}</p>
                      <p className="text-sm font-bold text-textPrimary">{breed.micron}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-textMuted">{t('cleanYield')}</p>
                      <p className="text-sm font-bold text-primary">{breed.yieldPct}</p>
                    </div>
                  </div>

                  <p className="text-xs text-textSecondary leading-relaxed">
                    <strong className="text-textPrimary font-semibold">{t('idealFor')}</strong> {breed.uses}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between text-xs">
                  <span className="text-textMuted font-medium">{t('traceableLotAvailability')}</span>
                  <span className="font-bold text-primary inline-flex items-center gap-1">
                    {t('availableLabel')} <Check size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Role-Based Portals (Stakeholder Explorer) ─── */}
      <section className="py-16 sm:py-24 bg-surface border-t border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary bg-primaryLight px-3 py-1.5 rounded-full mb-3">
              <Users size={13} /> {t('roleTailoredPortals')}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-textPrimary">
              {t('rolePortalsHeadline')}
            </h2>
            <p className="mt-3 text-base text-textSecondary">
              {t('rolePortalsSubtext')}
            </p>
          </div>

          {/* Role selector tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {ECOSYSTEM_ROLES.map((role, idx) => {
              const Icon = role.icon;
              const isSelected = selectedRole === idx;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(idx)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                    isSelected
                      ? 'bg-primary text-white shadow-md scale-105'
                      : 'bg-background border border-border text-textSecondary hover:border-primary/40'
                  }`}
                >
                  <Icon size={18} />
                  <span>{role.title}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Role Showcase Card */}
          {(() => {
            const role = ECOSYSTEM_ROLES[selectedRole];
            const Icon = role.icon;
            return (
              <div className="rounded-3xl bg-background border border-border p-6 sm:p-10 shadow-sm max-w-4xl mx-auto animate-fade-in">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/70">
                  <div className="flex items-center gap-3.5">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primaryLight text-primary">
                      <Icon size={24} />
                    </span>
                    <div>
                      <h3 className="text-2xl font-bold text-textPrimary">{role.title}</h3>
                      <p className="text-sm text-textSecondary mt-0.5">{role.subtitle}</p>
                    </div>
                  </div>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow hover:bg-primaryDark transition-all"
                  >
                    <span>{role.cta}</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {role.points.map((pt, i) => (
                    <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-surface border border-border/60">
                      <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm font-medium text-textPrimary leading-snug">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ─── Traceability Spotlight / Simulator ─── */}
      <section id="traceability" className="py-16 sm:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2.5rem] bg-gradient-to-br from-[#1b3d26] via-[#2a5035] to-[#3f6b3f] text-white p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
            {/* Background elements */}
            <div className="hero-orb orb-one opacity-25" />
            <div className="hero-orb orb-two opacity-20" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-emerald-200 border border-white/20 text-xs font-semibold backdrop-blur-md mb-6">
                  <ShieldCheck size={15} className="text-emerald-300" />
                  <span>{t('esgComplianceStandard')}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                  {t('everyThreadStoryPre')} <br />
                  <span className="text-emerald-200">{t('everyThreadStoryPost')}</span>
                </h2>

                <p className="mt-5 text-white/80 text-base sm:text-lg leading-relaxed max-w-xl">
                  {t('traceabilitySpotlightDesc')}
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-primary font-bold text-sm shadow-lg hover:bg-emerald-50 transition-all"
                  >
                    <span>{t('registerFlocksOrFacility')}</span>
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 border border-white/25 text-white font-semibold text-sm backdrop-blur hover:bg-white/20 transition-all"
                  >
                    <span>{t('tryPlatformDemo')}</span>
                  </Link>
                </div>
              </div>

              {/* QR Verification Box */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-sm rounded-3xl bg-surface text-textPrimary p-6 shadow-2xl border border-white/40 animate-pulse-subtle">
                  <div className="flex items-center justify-between pb-3 border-b border-border/60">
                    <span className="text-xs font-bold text-primary flex items-center gap-1.5 uppercase tracking-wide">
                      <Sparkles size={14} /> {t('traceabilityCheck')}
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                      {t('authenticLabel')}
                    </span>
                  </div>

                  <div className="my-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-background border border-border/80">
                    <QrCode size={140} className="text-textPrimary" />
                    <p className="text-[11px] text-textMuted font-mono mt-2">{t('lotNumber')}</p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-textSecondary">{t('producerLabelLower')}</span>
                      <span className="font-bold text-textPrimary">Ramesh Gurjar (Bikaner)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-textSecondary">{t('breedGradeLabel')}</span>
                      <span className="font-bold text-textPrimary">Chokla • Grade A (28.4µm)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-textSecondary">{t('scouringFacility')}</span>
                      <span className="font-bold text-textPrimary">Rajasthan State Scourers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Impact Statistics ─── */}
      <section className="py-14 bg-surface border-y border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-extrabold text-primary font-mono">10,000+</p>
              <p className="text-xs sm:text-sm font-semibold text-textSecondary mt-1">{t('pastoralistsConnected')}</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-extrabold text-accent font-mono">8 States</p>
              <p className="text-xs sm:text-sm font-semibold text-textSecondary mt-1">{t('mandiFeedsMonitored')}</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-extrabold text-info font-mono">50,000+ kg</p>
              <p className="text-xs sm:text-sm font-semibold text-textSecondary mt-1">{t('fleeceLotsTraced')}</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-700 font-mono">100%</p>
              <p className="text-xs sm:text-sm font-semibold text-textSecondary mt-1">{t('directValueToProducers')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ Section ─── */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary bg-primaryLight px-3 py-1.5 rounded-full mb-3">
              <HelpCircle size={13} /> {t('questionsAndAnswers')}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-textPrimary">
              {t('faqHeadline')}
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-surface border border-border/80 overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-bold text-sm sm:text-base text-textPrimary flex items-center justify-between gap-4 hover:text-primary transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronRight
                      size={18}
                      className={`text-textMuted transition-transform duration-200 ${
                        isOpen ? 'rotate-90 text-primary' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-textSecondary leading-relaxed border-t border-border/40 pt-3 animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Final High-Converting CTA Banner ─── */}
      <section className="py-16 bg-surface border-t border-border/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-primary to-primaryDark text-white p-8 sm:p-12 text-center shadow-xl relative overflow-hidden">
            <div className="hero-orb orb-two opacity-20" />
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {t('readyToElevate')}
            </h2>
            <p className="mt-3 text-white/85 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              {t('finalCtaDesc')}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-primary font-bold text-base shadow-md hover:bg-emerald-50 transition-all"
              >
                {t('createFreeAccount')}
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 border border-white/30 text-white font-semibold text-base hover:bg-white/20 transition-all"
              >
                {t('signInWithDemo')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Rich Footer ─── */}
      <footer className="mt-auto border-t border-border/80 bg-background text-textSecondary text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-border/70">
            {/* Col 1 */}
            <div className="space-y-3">
              <Link to="/" className="flex items-center gap-2 font-bold text-primary text-lg">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-white shadow-sm">
                  <Leaf size={16} />
                </span>
                WoolConnect
              </Link>
              <p className="text-textMuted text-xs leading-relaxed">
                {t('footerTagline')}
              </p>
            </div>

            {/* Col 2 */}
            <div>
              <p className="font-bold text-textPrimary uppercase tracking-wider text-xs mb-3">{t('footerStakeholders')}</p>
              <ul className="space-y-2">
                <li><Link to="/register" className="hover:text-primary transition-colors">{t('footerPastoralistsFarmers')}</Link></li>
                <li><Link to="/register" className="hover:text-primary transition-colors">{t('footerTextileMills')}</Link></li>
                <li><Link to="/register" className="hover:text-primary transition-colors">{t('footerScouringUnits')}</Link></li>
                <li><Link to="/register" className="hover:text-primary transition-colors">{t('footerArtisansWeavers')}</Link></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <p className="font-bold text-textPrimary uppercase tracking-wider text-xs mb-3">{t('footerKeyBreeds')}</p>
              <ul className="space-y-2">
                <li><span className="hover:text-primary cursor-default">Chokla (Rajasthan)</span></li>
                <li><span className="hover:text-primary cursor-default">Patanwadi (Gujarat)</span></li>
                <li><span className="hover:text-primary cursor-default">Gaddi / Merino (HP, J&K)</span></li>
                <li><span className="hover:text-primary cursor-default">Deccani (MH, KA, TG)</span></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <p className="font-bold text-textPrimary uppercase tracking-wider text-xs mb-3">{t('footerQuickLinks')}</p>
              <ul className="space-y-2">
                <li><Link to="/login" className="hover:text-primary transition-colors">{t('footerSignIn')}</Link></li>
                <li><Link to="/register" className="hover:text-primary transition-colors">{t('footerRegisterFree')}</Link></li>
                <li><a href="#mandi-rates" className="hover:text-primary transition-colors">{t('footerLiveMandiPrices')}</a></li>
                <li><a href="#traceability" className="hover:text-primary transition-colors">{t('footerQrPassport')}</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-textMuted">
            <p>© {new Date().getFullYear()} {t('footerCopyright')}</p>
            <p className="flex items-center gap-4">
              <span>{t('footerFarmToFabric2')}</span>
              <span>•</span>
              <span>{t('footerProvenance')}</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

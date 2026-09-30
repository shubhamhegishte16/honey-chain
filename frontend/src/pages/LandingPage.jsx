import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
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
  Play,
  Activity,
  Cpu,
  Search,
  ExternalLink,
  ChevronDown,
  Thermometer,
  Droplets,
  Volume2,
  Scale
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from '../components/ui/LanguageSelector';
import { getAllStatePrices } from '../services/market.service';

const HONEY_VARIETIES = [
  {
    name: 'Mustard Blossom',
    origin: 'Rajasthan (Bharatpur, Alwar) & Haryana',
    moisture: '17.8% Moisture',
    purity: 'Purity 99.4%',
    uses: 'Immunity booster, traditional wellness, creamed honey',
    tag: 'Quick Granulating Golden',
    accent: '#C06E30',
    image: '/honey-hero.jpg',
  },
  {
    name: 'Kashmir White Sidr',
    origin: 'Jammu & Kashmir (Pulwama, Tral Valley)',
    moisture: '16.9% Moisture',
    purity: 'Enzymes >32 DN',
    uses: 'Luxury export honey, medicinal therapeutic use',
    tag: 'Himalayan High Altitude',
    accent: '#861C1C',
    image: '/honey-harvest.jpg',
  },
  {
    name: 'Acacia / Kikar',
    origin: 'Punjab, Himachal & Uttarakhand Foothills',
    moisture: '18.2% Moisture',
    purity: 'High Fructose',
    uses: 'Natural sweetener, diabetic friendly, slow crystallization',
    tag: 'Crystal Clear Amber',
    accent: '#F4B345',
    image: '/smart-apiary.jpg',
  },
  {
    name: 'Muzaffarpur Shahi Lychee',
    origin: 'Bihar (Muzaffarpur, Vaishali Orchards)',
    moisture: '18.5% Moisture',
    purity: 'Pollen 92%',
    uses: 'Exotic fruit aroma, dessert drizzle, energy tonics',
    tag: 'Delicate Floral Aroma',
    accent: '#C06E30',
    image: '/honey-dipper.jpg',
  },
  {
    name: 'Wild Forest Multifloral',
    origin: 'Madhya Pradesh & Maharashtra Satpura Range',
    moisture: '18.8% Moisture',
    purity: 'Antioxidant Rich',
    uses: 'Ayurvedic formulations, cough & sore throat care',
    tag: 'Deep Dark Forest Amber',
    accent: '#281D1C',
    image: '/beekeeper-farmer.jpg',
  },
  {
    name: 'Jamun Blossom',
    origin: 'Uttar Pradesh (Saharanpur, Bareilly) & Punjab',
    moisture: '17.6% Moisture',
    purity: 'Low Glycemic',
    uses: 'Diabetic care, digestion booster, bitter-sweet tonic',
    tag: 'Black Plum Blossom',
    accent: '#861C1C',
    image: '/honey-lab.jpg',
  },
];

const JOURNEY_STAGES = [
  {
    id: 'hives',
    title: 'Hives',
    subtitle: 'Honey, hives, quality, future',
    icon: '🏠',
    image: '/smart-apiary.jpg',
    link: '/farmer/dashboard',
    accentColor: '#861C1C',
    badgeText: 'Smart IoT Hives',
    desc: 'Solar-powered hive sensors track brood temperature, weight gains, and colony acoustic health.'
  },
  {
    id: 'harvest',
    title: 'Harvest',
    subtitle: 'Collected with care, from nature',
    icon: '🌸',
    image: '/honey-harvest.jpg',
    link: '/batches/add',
    accentColor: '#C06E30',
    badgeText: 'Ethical Extraction',
    desc: 'Unheated raw comb extraction logged immediately with GPS coordinates and floral bloom tagging.'
  },
  {
    id: 'processing',
    title: 'Processing',
    subtitle: 'Purity through advanced methods',
    icon: '⚙️',
    image: '/honey-bottling.jpg',
    link: '/processor/dashboard',
    accentColor: '#F4B345',
    badgeText: 'Micro-Filtration',
    desc: 'Low-temperature settling tanks preserve active invertase and diastase enzymes without caramelization.'
  },
  {
    id: 'quality',
    title: 'Quality',
    subtitle: 'Tested for safety and authenticity',
    icon: '🛡️',
    image: '/honey-lab.jpg',
    link: '/quality',
    accentColor: '#861C1C',
    badgeText: 'NMR & Pollen DNA',
    desc: 'KVIC accredited testing confirms zero C3/C4 syrup adulteration and verifies pollen origin fingerprints.'
  },
  {
    id: 'bottling',
    title: 'Bottling',
    subtitle: 'Sealed for freshness',
    icon: '🧴',
    image: '/honey-hero.jpg',
    link: '/processor/batches',
    accentColor: '#C06E30',
    badgeText: 'Tamper Evident',
    desc: 'Automated hermetic sealing and cryptographically signed QR passport generation for every individual jar.'
  },
  {
    id: 'consumer',
    title: 'Consumer',
    subtitle: 'Real honey. Real trust.',
    icon: '👤',
    image: '/honey-blockchain.jpg',
    link: '/buyer/honey-passport/HC-RJ-2026-000108',
    accentColor: '#F4B345',
    badgeText: '100% Provenance',
    desc: 'Consumers scan the jar QR to inspect beekeeper story, lab test certificates, and blockchain hashes.'
  },
];

export default function LandingPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [searchBatchId, setSearchBatchId] = useState('');
  const [activeStage, setActiveStage] = useState(0);
  const [activeVariety, setActiveVariety] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);
  
  // Interactive IoT Beehive Telemetry State Simulator
  const [hiveTemp, setHiveTemp] = useState(34.8);
  const [hiveHumidity, setHiveHumidity] = useState(58);
  const [hiveFrequency, setHiveFrequency] = useState(245);
  const [hiveWeight, setHiveWeight] = useState(42.6);

  const [prices, setPrices] = useState([
    { state: 'Rajasthan', wool_type: 'Mustard Blossom Raw', price_per_kg: 285, change_percent: 3.4 },
    { state: 'Gujarat', wool_type: 'Kutch Wild Acacia Bloom', price_per_kg: 310, change_percent: 1.8 },
    { state: 'Himachal Pradesh', wool_type: 'Himalayan Multifloral Forest', price_per_kg: 440, change_percent: 4.2 },
    { state: 'Jammu & Kashmir', wool_type: 'Kashmir White Sidr', price_per_kg: 850, change_percent: 2.1 },
    { state: 'Maharashtra', wool_type: 'Mahabaleshwar Jamun Honey', price_per_kg: 425, change_percent: -0.8 },
    { state: 'Bihar', wool_type: 'Muzaffarpur Shahi Lychee', price_per_kg: 340, change_percent: 1.2 },
    { state: 'Karnataka', wool_type: 'Coorg Stingless Dammer Bee', price_per_kg: 1200, change_percent: 0.9 },
  ]);

  useEffect(() => {
    getAllStatePrices().then(res => {
      if (!res.error && res.data?.length > 0) {
        setPrices(res.data);
      }
    });
  }, []);

  const handleSearchPassport = (e) => {
    e.preventDefault();
    const id = searchBatchId.trim() || 'HC-RJ-2026-000108';
    navigate(`/buyer/honey-passport/${id}`);
  };

  const FAQS = [
    {
      q: 'How does Honey Chain guarantee 100% pure honey without adulteration?',
      a: 'Honey Chain combines IoT hive weight sensors, automated GPS harvest stamping, and multi-tier lab tests (NMR Spectroscopy, SMR, and C3/C4 isotopic analysis). Each batch hash is permanently committed to an immutable blockchain ledger before packaging.'
    },
    {
      q: 'Can consumers verify the exact beekeeper and apiary location?',
      a: 'Yes! Scanning the QR code on any Honey Chain certified jar opens the Digital Honey Passport, showing the beekeeper profile, apiary village in India, harvest date, floral bloom, and downloadable laboratory purity certificates.'
    },
    {
      q: 'How does this platform support beekeepers under KVIC Honey Mission?',
      a: 'Beekeepers receive transparent APMC Mandi benchmark pricing, instant fair payments directly from verified FMCG processors, AI-powered hive yield telemetry, and subsidized testing support.'
    },
    {
      q: 'What is the role of AI in the Honey Chain ecosystem?',
      a: 'AI models analyze acoustic colony frequencies to alert beekeepers before swarming or disease outbreaks, verify pollen microscopic images for authentic floral origin tagging, and detect sugar adulteration patterns during lab assays.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7EE] text-[#281D1C] flex flex-col font-sans selection:bg-[#F4B345]/40 selection:text-[#281D1C]">
      
      {/* ─── 1. APPROVED FLOATING ROUNDED NAVIGATION BAR ─── */}
      <header className="sticky top-0 z-50 pt-3 sm:pt-4 px-3 sm:px-6 lg:px-8">
        <div className="max-w-[92rem] mx-auto bg-[#FAF7EE]/90 backdrop-blur-md rounded-full border border-[#E8E3CF] shadow-card px-4 sm:px-7 h-16 sm:h-20 flex items-center justify-between gap-3 transition-all duration-300">
          
          {/* Brand Logo matching reference */}
          <Link to="/" className="flex items-center gap-3 font-extrabold text-[#281D1C] text-lg sm:text-xl tracking-tight shrink-0 group">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#F4B345] to-[#C06E30] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <span className="text-xl sm:text-2xl">🐝</span>
            </div>
            <div className="flex flex-col">
              <span className="leading-tight text-lg sm:text-2xl font-black font-serif text-[#281D1C]">
                Honey<span className="text-[#861C1C]"> Chain</span>
              </span>
              <span className="text-[10px] font-semibold text-[#5E524D] tracking-widest uppercase">
                Pure · Natural · Trusted
              </span>
            </div>
          </Link>

          {/* Center Navigation Links matching reference */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-[#FAF7EE]/80 border border-[#E8E3CF]/70 shadow-neomorph-inset">
            <Link to="/" className="px-5 py-2 rounded-full text-xs font-bold bg-[#861C1C] text-white shadow-sm transition-all">
              Home
            </Link>
            <a href="#about" className="px-4 py-2 rounded-full text-xs font-semibold text-[#5E524D] hover:text-[#281D1C] hover:bg-black/5 transition-colors">
              About
            </a>
            <a href="#features" className="px-4 py-2 rounded-full text-xs font-semibold text-[#5E524D] hover:text-[#281D1C] hover:bg-black/5 transition-colors">
              Features
            </a>
            <a href="#journey" className="px-4 py-2 rounded-full text-xs font-semibold text-[#5E524D] hover:text-[#281D1C] hover:bg-black/5 transition-colors">
              How It Works
            </a>
            <a href="#reviews" className="px-4 py-2 rounded-full text-xs font-semibold text-[#5E524D] hover:text-[#281D1C] hover:bg-black/5 transition-colors">
              Reviews
            </a>
            <Link to="/farmer/dashboard" className="px-4 py-2 rounded-full text-xs font-bold text-[#861C1C] hover:bg-[#861C1C]/10 transition-colors flex items-center gap-1">
              <span>Dashboard</span>
              <span className="text-[10px]">↗</span>
            </Link>
            <Link to="/login" className="px-4 py-2 rounded-full text-xs font-semibold text-[#5E524D] hover:text-[#281D1C] hover:bg-black/5 transition-colors">
              Login
            </Link>
          </nav>

          {/* Right Action: Trace Your Honey CTA & Language */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="hidden sm:block">
              <LanguageSelector compact />
            </div>

            <Link
              to="/buyer/honey-passport/HC-RJ-2026-000108"
              className="inline-flex items-center gap-2 rounded-full bg-[#F4B345] px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-bold text-[#281D1C] shadow-gold hover:bg-[#F6C063] transition-all hover:scale-105 active:scale-95"
            >
              <span>Trace Your Honey</span>
              <span className="text-base font-bold">→</span>
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden grid h-9 w-9 place-items-center rounded-full bg-[#FAF7EE] border border-[#E8E3CF] text-[#281D1C]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 p-4 rounded-3xl bg-[#FAF7EE] border border-[#E8E3CF] shadow-card-lg space-y-3 animate-fade-in">
            <nav className="flex flex-col space-y-1">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-full text-xs font-bold bg-[#861C1C] text-white">
                Home
              </Link>
              <Link to="/farmer/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-full text-xs font-bold text-[#861C1C] bg-[#861C1C]/10">
                Beekeeper Dashboard →
              </Link>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-full text-xs font-semibold text-[#5E524D]">
                About
              </a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-full text-xs font-semibold text-[#5E524D]">
                Features
              </a>
              <a href="#journey" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-full text-xs font-semibold text-[#5E524D]">
                Six-Stage Traceability
              </a>
              <Link to="/quality" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-full text-xs font-semibold text-[#5E524D]">
                KVIC Quality Lab
              </Link>
            </nav>
            <div className="pt-2 border-t border-[#E8E3CF] flex items-center justify-between">
              <LanguageSelector compact />
              <Link to="/login" className="px-4 py-2 rounded-full text-xs font-bold bg-[#861C1C] text-white">
                Sign In
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ─── 2. SPLIT HERO COMPOSITION (MATCHING APPROVED REFERENCE) ─── */}
      <section className="relative pt-6 sm:pt-10 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Subtle decorative background organic shape */}
        <div className="absolute top-12 left-0 w-96 h-96 bg-[#F4B345]/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2" />
        <div className="absolute top-1/3 right-0 w-[30rem] h-[30rem] bg-[#861C1C]/5 rounded-full blur-3xl pointer-events-none translate-x-1/3" />

        <div className="max-w-[92rem] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Hero Column: Editorial Typography & CTAs */}
            <div className="lg:col-span-6 flex flex-col justify-center text-left">
              
              {/* Eyebrow with burnt orange bar matching reference */}
              <div className="flex items-center gap-2.5 mb-4">
                <span className="h-0.5 w-7 bg-[#C06E30] rounded-full" />
                <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.25em] text-[#C06E30]">
                  BLOCKCHAIN • AI • IOT
                </span>
              </div>

              {/* Large Editorial Headline */}
              <h1 className="text-4xl sm:text-6xl xl:text-[4.2rem] font-bold text-[#281D1C] leading-[1.08] tracking-tight font-serif">
                Every drop <br />
                <span className="text-[#861C1C] italic font-normal">has a story.</span>
              </h1>

              {/* Subtitle */}
              <p className="mt-5 sm:mt-6 text-sm sm:text-base lg:text-lg text-[#5E524D] leading-relaxed max-w-xl">
                Honey Chain brings complete transparency to your honey — from the hive to your home. Trace, verify and trust with the power of blockchain, AI and IoT.
              </p>

              {/* Hero Action Buttons */}
              <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-3.5">
                <Link
                  to="/buyer/honey-passport/HC-RJ-2026-000108"
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#861C1C] px-7 py-3.5 text-xs sm:text-sm font-bold text-white shadow-burgundy hover:bg-[#6A1515] transition-all hover:scale-105 active:scale-95"
                >
                  <span>Trace Your Honey</span>
                  <span className="text-base font-bold">→</span>
                </Link>

                <Link
                  to="/farmer/dashboard"
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#F4B345] px-6 py-3.5 text-xs sm:text-sm font-bold text-[#281D1C] shadow-gold hover:bg-[#F6C063] transition-all hover:scale-105 active:scale-95"
                >
                  <span>Open Beekeeper Dashboard</span>
                  <span className="text-base font-bold">→</span>
                </Link>

                <button
                  onClick={() => setVideoModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-[#E8E3CF] px-4 py-3 text-xs sm:text-sm font-bold text-[#281D1C] shadow-soft hover:bg-white hover:border-[#D6CEB5] transition-all hover:scale-105 active:scale-95"
                >
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-[#281D1C] text-white text-[9px]">
                    <Play size={9} className="fill-current ml-0.5" />
                  </span>
                  <span>Watch Video</span>
                </button>
              </div>

              {/* Bottom Floating Pill Badge Card matching reference */}
              <div className="mt-8 sm:mt-12 inline-flex items-center gap-4 sm:gap-6 p-3 sm:p-4 rounded-3xl bg-[#FAF7EE] border border-[#E8E3CF] shadow-neomorph max-w-md">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#FEF6E4] text-[#C06E30] text-lg shrink-0 border border-[#F4B345]/30">
                    🐝
                  </div>
                  <div className="text-[11px] leading-tight">
                    <p className="font-bold text-[#281D1C]">Real Honey</p>
                    <p className="text-[#5E524D]">Real Farmers</p>
                    <p className="text-[#9B918B]">Real Stories</p>
                  </div>
                </div>

                <div className="h-9 w-px bg-[#E8E3CF]" />

                <div className="flex items-center gap-2.5">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F3F4EE] text-[#861C1C] text-sm shrink-0 border border-[#C8CBB8]">
                    🍃
                  </div>
                  <div className="text-[11px] leading-tight">
                    <p className="font-bold text-[#281D1C]">Powered by</p>
                    <p className="text-[#C06E30] font-semibold">Blockchain + AI + IoT</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Hero Column: Scenic Golden Honey Imagery + Frosted Verification Card */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-[2.5rem] overflow-hidden border border-[#E8E3CF] shadow-card-lg bg-[#FAF7EE] group">
                
                {/* High quality sunlit honey & mountains visual */}
                <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden">
                  <img
                    src="/honey-hero.jpg"
                    alt="Pure Golden Honey Jars and Honeycombs"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle warm overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#281D1C]/60 via-transparent to-black/10" />
                </div>

                {/* Frosted Glass Batch Verification Card (matching reference overlay) */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 max-w-[240px] sm:max-w-[270px] rounded-3xl bg-[#281D1C]/85 backdrop-blur-xl border border-white/20 p-4 sm:p-5 text-white shadow-card-lg animate-float-slow">
                  
                  {/* QR & Batch ID header */}
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-xl bg-white text-black shrink-0 shadow-sm">
                      <QrCode size={36} className="text-[#281D1C]" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-white/70 font-semibold">Batch ID</p>
                      <h4 className="text-xs sm:text-sm font-black font-mono tracking-tight text-[#F4B345]">HC2026-00124</h4>
                      <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2 py-0.5 text-[9px] font-bold text-emerald-300">
                        <Check size={9} />
                        <span>Authentic</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-white/60 mt-3 font-medium">Scan to verify provenance</p>

                  <div className="mt-3 pt-3 border-t border-white/10 space-y-2 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 flex items-center gap-1.5">
                        <MapPin size={12} className="text-[#F4B345]" /> Origin
                      </span>
                      <strong className="text-white font-semibold">Himachal Pradesh</strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white/70 flex items-center gap-1.5">
                        <Clock size={12} className="text-[#F4B345]" /> Harvest Date
                      </span>
                      <strong className="text-white font-semibold">12 Apr 2026</strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white/70 flex items-center gap-1.5">
                        <ShieldCheck size={12} className="text-emerald-400" /> Quality Grade
                      </span>
                      <strong className="text-emerald-300 font-bold">Premium NMR</strong>
                    </div>
                  </div>

                  <Link
                    to="/buyer/honey-passport/HC-RJ-2026-000108"
                    className="mt-3 block text-center w-full py-1.5 rounded-full bg-[#F4B345] text-[#281D1C] font-bold text-[10px] hover:bg-[#F6C063] transition-colors"
                  >
                    View Full Digital Passport →
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 3. APPROVED SIX-STAGE BENTO TRACEABILITY JOURNEY ─── */}
      <section id="journey" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[92rem] mx-auto">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C06E30]">
                SIX-STAGE PROVENANCE
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-[#281D1C] font-serif mt-1">
                From Pristine Hives to Your Table
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5E524D] max-w-md">
              Every drop is protected by cryptographic smart contracts, multi-parameter lab assays, and IoT hive health tracking.
            </p>
          </div>

          {/* 6 Bento Journey Cards matching reference */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {JOURNEY_STAGES.map((stage, idx) => (
              <div
                key={stage.id}
                className="group relative flex flex-col rounded-3xl overflow-hidden bg-white border border-[#E8E3CF] shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-[#D6CEB5] hover:-translate-y-1"
              >
                {/* Top Image with organic curved bottom cutout */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#FEF6E4]">
                  <img
                    src={stage.image}
                    alt={stage.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  
                  {/* Stage Number Badge */}
                  <span className="absolute top-2.5 left-2.5 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-black/60 text-[#F4B345] backdrop-blur-xs">
                    0{idx + 1}
                  </span>
                </div>

                {/* Floating Circle Icon */}
                <div className="relative -mt-6 px-4 flex justify-between items-end">
                  <div 
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-lg text-white shadow-md border-2 border-white"
                    style={{ backgroundColor: stage.accentColor }}
                  >
                    <span>{stage.icon}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 pt-2 flex flex-col flex-1">
                  <h3 className="text-base font-bold text-[#281D1C] font-serif group-hover:text-[#861C1C] transition-colors">
                    {stage.title}
                  </h3>
                  <p className="text-[11px] text-[#5E524D] mt-1 leading-snug">
                    {stage.subtitle}
                  </p>

                  <div className="mt-auto pt-3 flex items-center justify-between border-t border-[#E8E3CF]/60">
                    <span className="text-[10px] font-bold text-[#C06E30]">{stage.badgeText}</span>
                    <Link
                      to={stage.link}
                      className="grid h-7 w-7 place-items-center rounded-full bg-[#FAF7EE] text-[#281D1C] hover:bg-[#861C1C] hover:text-white transition-colors"
                      aria-label={stage.title}
                    >
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Script Flourish on Bottom Right matching reference */}
          <div className="mt-6 flex justify-end pr-2">
            <span className="font-serif italic text-sm sm:text-base text-[#861C1C] font-normal tracking-wide">
              Pure by Nature, Verified by Technology
            </span>
          </div>

        </div>
      </section>

      {/* ─── 4. LIVE HONEY MANDI BENCHMARK RATES TICKER & SEARCH ─── */}
      <section id="mandi-rates" className="py-8 bg-[#FAF7EE] border-y border-[#E8E3CF]">
        <div className="max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-[#FEF6E4] text-[#C06E30]">
                <TrendingUp size={16} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#281D1C]">
                APMC & KVIC Honey Mandi Benchmark Rates (Live Today)
              </span>
            </div>

            {/* Quick Batch Lookup Input */}
            <form onSubmit={handleSearchPassport} className="flex items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E8E3CF] shadow-soft flex-1 md:w-72">
                <Search size={14} className="text-[#9B918B]" />
                <input
                  type="text"
                  placeholder="Enter Batch ID (e.g. HC2026-00124)..."
                  value={searchBatchId}
                  onChange={(e) => setSearchBatchId(e.target.value)}
                  className="bg-transparent text-xs text-[#281D1C] outline-none w-full placeholder:text-[#9B918B]"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-full bg-[#861C1C] text-white text-xs font-bold shadow-burgundy hover:bg-[#6A1515] transition-all"
              >
                Verify
              </button>
            </form>
          </div>

          {/* Marquee ticker */}
          <div className="overflow-hidden whitespace-nowrap py-2 border border-[#E8E3CF] rounded-2xl bg-white shadow-soft">
            <div className="ticker-move flex gap-8 items-center text-xs">
              {prices.map((p, i) => (
                <div key={i} className="inline-flex items-center gap-2 px-3">
                  <span className="font-bold text-[#281D1C]">{p.state}:</span>
                  <span className="text-[#5E524D]">{p.wool_type}</span>
                  <strong className="text-[#861C1C] font-bold">₹{p.price_per_kg}/kg</strong>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${p.change_percent >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                    {p.change_percent >= 0 ? `+${p.change_percent}%` : `${p.change_percent}%`}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ─── 5. BENTO SHOWCASE: IOT TELEMETRY & AI PURITY LAB ─── */}
      <section id="features" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[92rem] mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C06E30]">
              INTELLIGENT AGRI-TECH
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#281D1C] font-serif mt-1">
              Smart Hives & AI Spectroscopy
            </h2>
            <p className="text-xs sm:text-sm text-[#5E524D] mt-2">
              Replacing manual guesswork with solar-powered continuous hive telemetry and NMR lab purity validation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Bento Card 1: Interactive IoT Smart Hive Telemetry (7 cols) */}
            <div className="lg:col-span-7 rounded-3xl bg-white border border-[#E8E3CF] p-6 sm:p-8 shadow-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#FEF6E4] text-[#C06E30]">
                      <Cpu size={20} />
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B918B]">Live Hardware Feed</span>
                      <h3 className="text-lg sm:text-xl font-bold font-serif text-[#281D1C]">Smart Beehive Telemetry Box #14</h3>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Online • Bharatpur Mustard Belt
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#5E524D] leading-relaxed mb-6">
                  Continuous multi-sensor monitoring of brood temperature, colony humidity, weight accretion during nectar flow, and acoustic frequency to forecast swarm triggers.
                </p>

                {/* 4 Sensor Telemetry Tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-[#FAF7EE] border border-[#E8E3CF] text-center">
                    <div className="flex items-center justify-center gap-1 text-[#C06E30] text-xs font-bold mb-1">
                      <Thermometer size={14} /> Temp
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-[#281D1C]">{hiveTemp}°C</p>
                    <span className="text-[10px] text-emerald-700 font-semibold">Optimal 34.5°C</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF7EE] border border-[#E8E3CF] text-center">
                    <div className="flex items-center justify-center gap-1 text-sky-700 text-xs font-bold mb-1">
                      <Droplets size={14} /> Humidity
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-[#281D1C]">{hiveHumidity}%</p>
                    <span className="text-[10px] text-emerald-700 font-semibold">Safe &lt;65%</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF7EE] border border-[#E8E3CF] text-center">
                    <div className="flex items-center justify-center gap-1 text-purple-700 text-xs font-bold mb-1">
                      <Volume2 size={14} /> Frequency
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-[#281D1C]">{hiveFrequency} Hz</p>
                    <span className="text-[10px] text-emerald-700 font-semibold">Normal Buzz</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF7EE] border border-[#E8E3CF] text-center">
                    <div className="flex items-center justify-center gap-1 text-amber-700 text-xs font-bold mb-1">
                      <Scale size={14} /> Comb Weight
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-[#861C1C]">{hiveWeight} kg</p>
                    <span className="text-[10px] text-[#C06E30] font-bold">+1.8 kg Today</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8E3CF] flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-[#5E524D]">
                  LoRaWAN + ESP32 solar telemetry transmits every 15 minutes to KVIC cloud.
                </span>
                <Link
                  to="/farmer/dashboard"
                  className="px-4 py-2 rounded-full bg-[#861C1C] text-white text-xs font-bold shadow-sm hover:bg-[#6A1515] transition-all"
                >
                  Open Beekeeper Console →
                </Link>
              </div>
            </div>

            {/* Bento Card 2: AI & NMR Laboratory Purity (5 cols) */}
            <div className="lg:col-span-5 rounded-3xl bg-[#281D1C] text-white p-6 sm:p-8 shadow-card flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#F4B345]/10 rounded-full blur-3xl pointer-events-none" />
              
              <div>
                <div className="flex items-center gap-2 mb-2 text-[#F4B345] text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck size={16} />
                  <span>KVIC Central Testing Lab</span>
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
                  NMR Fingerprinting & Adulteration Guard
                </h3>
                
                <p className="text-xs sm:text-sm text-white/80 mt-2 leading-relaxed">
                  Every honey batch undergoes 1H-NMR Nuclear Magnetic Resonance profile inspection to catch rice syrup, invert sugar, or C4 cane syrup additions.
                </p>

                <div className="mt-5 space-y-3">
                  <div className="p-3 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-between text-xs">
                    <span className="text-white/80">C3/C4 Isotopic Carbon Ratio</span>
                    <strong className="text-emerald-400 font-mono font-bold">-26.4 ‰ (100% Floral)</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-between text-xs">
                    <span className="text-white/80">Hydroxymethylfurfural (HMF)</span>
                    <strong className="text-[#F4B345] font-mono font-bold">11.2 mg/kg (Fresh Unheated)</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-between text-xs">
                    <span className="text-white/80">Pollen Density & Species DNA</span>
                    <strong className="text-white font-mono font-bold">94.8% Apis mellifera</strong>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between">
                <span className="text-[11px] text-white/70">FSSAI & BIS 494:2022 Compliant</span>
                <Link
                  to="/quality"
                  className="px-4 py-2 rounded-full bg-[#F4B345] text-[#281D1C] font-bold text-xs hover:bg-[#F6C063] transition-colors"
                >
                  Inspect Lab Portal →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 6. HONEY VARIETIES & FLORAL ORIGIN GEOGRAPHY BENTO ─── */}
      <section id="varieties" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF7EE]">
        <div className="max-w-[92rem] mx-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C06E30]">
                AUTHENTIC INDIAN FLORA
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#281D1C] font-serif mt-1">
                Monofloral Geographic Varieties
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5E524D] max-w-md">
              Distinct aroma profiles, pollen fingerprints, and crystallization traits directly mapped to regional bee flora belts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {HONEY_VARIETIES.map((v, i) => (
              <div
                key={i}
                className="group rounded-3xl bg-white border border-[#E8E3CF] overflow-hidden shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-[#D6CEB5] hover:-translate-y-1 flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#FEF6E4]">
                  <img
                    src={v.image}
                    alt={v.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#281D1C]/80 text-[#F4B345] text-[10px] font-bold backdrop-blur-xs">
                    {v.tag}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-[#281D1C] font-serif group-hover:text-[#861C1C] transition-colors">
                    {v.name}
                  </h3>
                  <p className="text-xs text-[#C06E30] font-semibold mt-1 flex items-center gap-1">
                    <MapPin size={13} /> {v.origin}
                  </p>

                  <p className="text-xs text-[#5E524D] mt-3 leading-relaxed">
                    {v.uses}
                  </p>

                  <div className="mt-auto pt-4 border-t border-[#E8E3CF] flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#281D1C]">{v.moisture}</span>
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      {v.purity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── 7. MULTI-STAKEHOLDER ECOSYSTEM BENTO ─── */}
      <section id="about" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-[#E8E3CF]">
        <div className="max-w-[92rem] mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C06E30]">
              COMPLETE SUPPLY CHAIN
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#281D1C] font-serif mt-1">
              Connecting Every Partner
            </h2>
            <p className="text-xs sm:text-sm text-[#5E524D] mt-2">
              From smallholder rural apiarists to nationwide FMCG brands and conscious consumers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Stakeholder 1 */}
            <div className="p-6 rounded-3xl bg-[#FAF7EE] border border-[#E8E3CF] flex flex-col justify-between transition-all hover:shadow-card hover:-translate-y-1">
              <div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#861C1C] text-white text-xl mb-4 shadow-sm">
                  🐝
                </div>
                <h3 className="text-lg font-bold font-serif text-[#281D1C]">Beekeepers</h3>
                <p className="text-xs text-[#5E524D] mt-2 leading-relaxed">
                  Log apiary boxes, view fair Mandi price alerts, and sell verified raw honey lots with zero intermediary cuts.
                </p>
              </div>
              <Link to="/farmer/dashboard" className="mt-5 text-xs font-bold text-[#861C1C] flex items-center gap-1 hover:gap-2 transition-all">
                Beekeeper Portal →
              </Link>
            </div>

            {/* Stakeholder 2 */}
            <div className="p-6 rounded-3xl bg-[#FAF7EE] border border-[#E8E3CF] flex flex-col justify-between transition-all hover:shadow-card hover:-translate-y-1">
              <div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#C06E30] text-white text-xl mb-4 shadow-sm">
                  🔬
                </div>
                <h3 className="text-lg font-bold font-serif text-[#281D1C]">Quality Labs</h3>
                <p className="text-xs text-[#5E524D] mt-2 leading-relaxed">
                  Run NMR & moisture tests, mint tamper-proof cryptographic certificates, and flag adulteration automatically.
                </p>
              </div>
              <Link to="/quality" className="mt-5 text-xs font-bold text-[#C06E30] flex items-center gap-1 hover:gap-2 transition-all">
                Lab Inspector Portal →
              </Link>
            </div>

            {/* Stakeholder 3 */}
            <div className="p-6 rounded-3xl bg-[#FAF7EE] border border-[#E8E3CF] flex flex-col justify-between transition-all hover:shadow-card hover:-translate-y-1">
              <div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#281D1C] text-white text-xl mb-4 shadow-sm">
                  🏭
                </div>
                <h3 className="text-lg font-bold font-serif text-[#281D1C]">Bottling Plants</h3>
                <p className="text-xs text-[#5E524D] mt-2 leading-relaxed">
                  Intake verified raw barrels, process at gentle temperatures, and generate unique QR batch serialization.
                </p>
              </div>
              <Link to="/processor/dashboard" className="mt-5 text-xs font-bold text-[#281D1C] flex items-center gap-1 hover:gap-2 transition-all">
                Bottling Facility Portal →
              </Link>
            </div>

            {/* Stakeholder 4 */}
            <div className="p-6 rounded-3xl bg-[#FAF7EE] border border-[#E8E3CF] flex flex-col justify-between transition-all hover:shadow-card hover:-translate-y-1">
              <div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#F4B345] text-[#281D1C] text-xl mb-4 shadow-sm">
                  🛒
                </div>
                <h3 className="text-lg font-bold font-serif text-[#281D1C]">FMCG Buyers</h3>
                <p className="text-xs text-[#5E524D] mt-2 leading-relaxed">
                  Direct procurement of Grade-A certified honey in bulk barrels or branded retail jars with complete provenance.
                </p>
              </div>
              <Link to="/buyer/marketplace" className="mt-5 text-xs font-bold text-[#C06E30] flex items-center gap-1 hover:gap-2 transition-all">
                Buyer Marketplace →
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ─── 8. FAQS ACCORDION ─── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C06E30]">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-3xl font-bold text-[#281D1C] font-serif mt-1">
              Everything You Need to Know
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white border border-[#E8E3CF] overflow-hidden shadow-soft transition-colors"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-sm sm:text-base text-[#281D1C] hover:text-[#861C1C] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-[#C06E30] transition-transform duration-200 ${activeFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {activeFaq === i && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-[#5E524D] leading-relaxed border-t border-[#E8E3CF]/60">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── 9. VIDEO DOCUMENTARY MODAL ─── */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl bg-[#281D1C] rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
            <div className="p-4 bg-[#1C1514] flex items-center justify-between text-white border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-lg">🐝</span>
                <span className="font-bold font-serif text-sm">Honey Chain: The Hive to Home Journey</span>
              </div>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X size={16} />
              </button>
            </div>
            <div className="aspect-video bg-black flex items-center justify-center relative">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Honey Chain Story"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4 bg-[#281D1C] text-xs text-white/80 flex items-center justify-between">
              <span>National Beekeeping & Honey Mission • KVIC / Ministry of MSME</span>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="px-4 py-1.5 rounded-full bg-[#F4B345] text-[#281D1C] font-bold"
              >
                Close Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 10. EDITORIAL FOOTER ─── */}
      <footer className="mt-auto bg-[#281D1C] text-white pt-12 pb-8 border-t border-white/10">
        <div className="max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/10">
            
            <div className="md:col-span-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#F4B345] to-[#C06E30] flex items-center justify-center text-white text-xl">
                  🐝
                </div>
                <div>
                  <h3 className="text-xl font-bold font-serif text-white">Honey Chain</h3>
                  <p className="text-[10px] text-[#F4B345] tracking-widest uppercase font-semibold">Pure · Natural · Trusted</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-white/70 leading-relaxed max-w-sm">
                Empowering Indian beekeepers with IoT telemetry, immutable blockchain provenance, and AI purity verification under the KVIC Honey Mission.
              </p>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F4B345] mb-3">Portals</h4>
              <ul className="space-y-2 text-xs text-white/80">
                <li><Link to="/farmer/dashboard" className="hover:text-[#F4B345]">Beekeeper Panel</Link></li>
                <li><Link to="/quality" className="hover:text-[#F4B345]">KVIC Lab Testing</Link></li>
                <li><Link to="/processor/dashboard" className="hover:text-[#F4B345]">Bottling Unit</Link></li>
                <li><Link to="/buyer/marketplace" className="hover:text-[#F4B345]">Buyer Mandi</Link></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F4B345] mb-3">Honey Flora</h4>
              <ul className="space-y-2 text-xs text-white/80">
                <li><a href="#varieties" className="hover:text-[#F4B345]">Mustard Bloom</a></li>
                <li><a href="#varieties" className="hover:text-[#F4B345]">Kashmir Sidr</a></li>
                <li><a href="#varieties" className="hover:text-[#F4B345]">Wild Forest</a></li>
                <li><a href="#varieties" className="hover:text-[#F4B345]">Shahi Lychee</a></li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F4B345] mb-3">Verification</h4>
              <p className="text-xs text-white/70 mb-3">
                Scan jar QR or query any batch ID to inspect the complete cryptographic audit trail.
              </p>
              <Link
                to="/buyer/honey-passport/HC-RJ-2026-000108"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#861C1C] text-white font-bold text-xs shadow-sm hover:bg-[#6A1515]"
              >
                <span>Sample Passport</span>
                <span>→</span>
              </Link>
            </div>

          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-3">
            <p>© {new Date().getFullYear()} Honey Chain • SIH26021 • KVIC Honey Mission & Ministry of MSME</p>
            <p className="font-serif italic text-white/80">Every drop has a story.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, MapPin, Search, ChevronDown, BookOpen, ArrowRight, X } from 'lucide-react';
import Card from '../../components/ui/Card';

// ─── Static state → region map ─────────────────────────────────────────────
export const STATE_REGIONS = {
  'Rajasthan':        ['Bikaner', 'Jaisalmer', 'Jodhpur', 'Nagaur', 'Pali'],
  'Gujarat':          ['Kutch', 'Banaskantha', 'Patan', 'Surendranagar'],
  'Maharashtra':      ['Ahmednagar', 'Sangli', 'Satara'],
  'Jammu & Kashmir':  ['Leh', 'Kargil', 'Srinagar', 'Anantnag'],
  'Himachal Pradesh': ['Kinnaur', 'Lahaul & Spiti', 'Kullu', 'Shimla'],
  'Uttarakhand':      ['Chamoli', 'Pithoragarh', 'Uttarkashi'],
  'Karnataka':        ['Bellary', 'Bijapur', 'Gadag'],
  'Telangana':        ['Mahbubnagar', 'Nalgonda', 'Warangal'],
};

// ─── Demo producer/artisan dataset ─────────────────────────────────────────
// NOTE: These are fictional sample profiles for the WoolConnect hackathon prototype.
const PRODUCERS = [
  // Rajasthan
  { id: 'p-001', name: 'Demo Wool Producer – Bikaner', type: 'Wool Producer', state: 'Rajasthan', region: 'Bikaner',
    specialization: 'Wool Quality & Storage', skills: ['Wool Grading', 'Wool Handling', 'Storage'],
    description: 'Demo profile for the WoolConnect prototype. Focuses on fine Chokla and Magra wool grading and safe monsoon storage.',
    trainingCategories: ['wool-quality', 'storage'] },
  { id: 'p-002', name: 'Demo Wool Artisan – Jaisalmer', type: 'Artisan', state: 'Rajasthan', region: 'Jaisalmer',
    specialization: 'Wool Products & Natural Dyeing', skills: ['Dyeing', 'Processing', 'Product Design'],
    description: 'Demo artisan profile. Creates hand-dyed woollen rugs using traditional desert botanical dyes.',
    trainingCategories: ['processing', 'selling'] },
  { id: 'p-003', name: 'Demo Wool Producer – Jodhpur', type: 'Wool Producer', state: 'Rajasthan', region: 'Jodhpur',
    specialization: 'Sheep Care & Shearing', skills: ['Sheep Care', 'Shearing', 'Wool Grading'],
    description: 'Demo profile focusing on humane shearing and pre-shearing sheep health management.',
    trainingCategories: ['sheep-care', 'shearing'] },
  { id: 'p-004', name: 'Demo Wool Seller – Nagaur', type: 'Wool Producer', state: 'Rajasthan', region: 'Nagaur',
    specialization: 'Digital Marketplace & Selling', skills: ['Digital Selling', 'QR Traceability', 'Pricing'],
    description: 'Demo profile. Sells raw Nali wool directly to mills via digital platforms.',
    trainingCategories: ['selling', 'wool-quality'] },
  { id: 'p-005', name: 'Demo Artisan – Pali', type: 'Artisan', state: 'Rajasthan', region: 'Pali',
    specialization: 'Weaving & Processing', skills: ['Wool Processing', 'Carding', 'Weaving'],
    description: 'Demo artisan profile. Specialises in hand-woven Pali wool blankets and scouring techniques.',
    trainingCategories: ['processing', 'wool-quality'] },

  // Gujarat
  { id: 'p-006', name: 'Demo Wool Producer – Kutch', type: 'Wool Producer', state: 'Gujarat', region: 'Kutch',
    specialization: 'Shearing & Wool Handling', skills: ['Shearing', 'Wool Handling', 'Storage'],
    description: 'Demo profile. Raises Patanwadi sheep in Kutch and practices clean shearing techniques.',
    trainingCategories: ['shearing', 'storage'] },
  { id: 'p-007', name: 'Demo Artisan – Banaskantha', type: 'Artisan', state: 'Gujarat', region: 'Banaskantha',
    specialization: 'Embroidery & Wool Crafts', skills: ['Processing', 'Dyeing', 'Product Design'],
    description: 'Demo artisan creating embroidered woollen products using Patanwadi fleece.',
    trainingCategories: ['processing', 'selling'] },
  { id: 'p-008', name: 'Demo Wool Producer – Patan', type: 'Wool Producer', state: 'Gujarat', region: 'Patan',
    specialization: 'Wool Grading & Storage', skills: ['Wool Grading', 'Storage', 'Wool Handling'],
    description: 'Demo profile. Maintains grade-A certified fleece with proper moisture storage protocols.',
    trainingCategories: ['wool-quality', 'storage'] },
  { id: 'p-009', name: 'Demo Artisan – Surendranagar', type: 'Artisan', state: 'Gujarat', region: 'Surendranagar',
    specialization: 'Natural Dyeing & Selling', skills: ['Dyeing', 'Digital Selling', 'Processing'],
    description: 'Demo artisan producing natural-dyed yarn and marketing directly to buyers online.',
    trainingCategories: ['processing', 'selling'] },

  // Maharashtra
  { id: 'p-010', name: 'Demo Wool Producer – Ahmednagar', type: 'Wool Producer', state: 'Maharashtra', region: 'Ahmednagar',
    specialization: 'Sheep Care & Shearing', skills: ['Sheep Care', 'Shearing', 'Wool Grading'],
    description: 'Demo profile. Deccani sheep farmer focusing on veterinary care and efficient shearing.',
    trainingCategories: ['sheep-care', 'shearing'] },
  { id: 'p-011', name: 'Demo Artisan – Sangli', type: 'Artisan', state: 'Maharashtra', region: 'Sangli',
    specialization: 'Woollen Textiles & Selling', skills: ['Processing', 'Wool Handling', 'Digital Selling'],
    description: 'Demo artisan profile. Processes raw Deccani fleece into handloom textiles sold online.',
    trainingCategories: ['processing', 'selling'] },
  { id: 'p-012', name: 'Demo Wool Producer – Satara', type: 'Wool Producer', state: 'Maharashtra', region: 'Satara',
    specialization: 'Storage & Quality', skills: ['Storage', 'Wool Grading', 'Wool Handling'],
    description: 'Demo profile. Prioritises post-monsoon wool storage and grade certification.',
    trainingCategories: ['storage', 'wool-quality'] },

  // Jammu & Kashmir
  { id: 'p-013', name: 'Demo Wool Producer – Leh', type: 'Wool Producer', state: 'Jammu & Kashmir', region: 'Leh',
    specialization: 'Pashmina & Wool Handling', skills: ['Wool Handling', 'Wool Grading', 'Shearing'],
    description: 'Demo profile. Herds Changthangi goats for Pashmina; also handles coarse Changra wool.',
    trainingCategories: ['wool-quality', 'shearing'] },
  { id: 'p-014', name: 'Demo Artisan – Kargil', type: 'Artisan', state: 'Jammu & Kashmir', region: 'Kargil',
    specialization: 'Ladakhi Wool Crafts', skills: ['Processing', 'Dyeing', 'Product Design'],
    description: 'Demo artisan profile. Produces traditional Ladakhi woollen products using local fleece.',
    trainingCategories: ['processing', 'selling'] },
  { id: 'p-015', name: 'Demo Wool Producer – Srinagar', type: 'Wool Producer', state: 'Jammu & Kashmir', region: 'Srinagar',
    specialization: 'Sheep Care & Selling', skills: ['Sheep Care', 'Digital Selling', 'Wool Grading'],
    description: 'Demo profile. Sells Kashmir wool directly to buyers using QR-based traceability.',
    trainingCategories: ['sheep-care', 'selling'] },
  { id: 'p-016', name: 'Demo Artisan – Anantnag', type: 'Artisan', state: 'Jammu & Kashmir', region: 'Anantnag',
    specialization: 'Kani Shawl Crafting', skills: ['Processing', 'Dyeing', 'Weaving'],
    description: 'Demo artisan creating Kani shawls with naturally dyed Kashmiri wool.',
    trainingCategories: ['processing', 'wool-quality'] },

  // Himachal Pradesh
  { id: 'p-017', name: 'Demo Wool Producer – Kinnaur', type: 'Wool Producer', state: 'Himachal Pradesh', region: 'Kinnaur',
    specialization: 'High-Altitude Sheep Care', skills: ['Sheep Care', 'Shearing', 'Storage'],
    description: 'Demo profile. Manages Rampur Bushair sheep at high altitude with seasonal shearing.',
    trainingCategories: ['sheep-care', 'shearing'] },
  { id: 'p-018', name: 'Demo Artisan – Lahaul & Spiti', type: 'Artisan', state: 'Himachal Pradesh', region: 'Lahaul & Spiti',
    specialization: 'Tribal Wool Textiles', skills: ['Processing', 'Dyeing', 'Product Design'],
    description: 'Demo artisan producing traditional Lahauli woollen garments.',
    trainingCategories: ['processing', 'selling'] },
  { id: 'p-019', name: 'Demo Artisan – Kullu', type: 'Artisan', state: 'Himachal Pradesh', region: 'Kullu',
    specialization: 'Kullu Shawls & Natural Dyeing', skills: ['Dyeing', 'Processing', 'Selling'],
    description: 'Demo artisan profile. Hand-spins and naturally dyes Kullu shawls from organic Himachali wool.',
    trainingCategories: ['processing', 'selling'] },
  { id: 'p-020', name: 'Demo Wool Producer – Shimla', type: 'Wool Producer', state: 'Himachal Pradesh', region: 'Shimla',
    specialization: 'Wool Quality & Grading', skills: ['Wool Grading', 'Shearing', 'Storage'],
    description: 'Demo profile. Sources and grades Angora and Gaddi wool near Shimla districts.',
    trainingCategories: ['wool-quality', 'storage'] },

  // Uttarakhand
  { id: 'p-021', name: 'Demo Wool Producer – Chamoli', type: 'Wool Producer', state: 'Uttarakhand', region: 'Chamoli',
    specialization: 'Sheep Care & Shearing', skills: ['Sheep Care', 'Shearing', 'Wool Handling'],
    description: 'Demo profile. Manages flocks in the Nanda Devi region with seasonal alpine grazing.',
    trainingCategories: ['sheep-care', 'shearing'] },
  { id: 'p-022', name: 'Demo Artisan – Pithoragarh', type: 'Artisan', state: 'Uttarakhand', region: 'Pithoragarh',
    specialization: 'Woollen Textiles & Dyeing', skills: ['Dyeing', 'Processing', 'Product Design'],
    description: 'Demo artisan creating Kumaoni woollen shawls and rugs from locally sourced fleece.',
    trainingCategories: ['processing', 'selling'] },
  { id: 'p-023', name: 'Demo Wool Producer – Uttarkashi', type: 'Wool Producer', state: 'Uttarakhand', region: 'Uttarkashi',
    specialization: 'Storage & Selling', skills: ['Storage', 'Digital Selling', 'Wool Grading'],
    description: 'Demo profile. Stores and grades alpine wool before digital market listing.',
    trainingCategories: ['storage', 'selling'] },

  // Karnataka
  { id: 'p-024', name: 'Demo Wool Producer – Bellary', type: 'Wool Producer', state: 'Karnataka', region: 'Bellary',
    specialization: 'Sheep Breeding & Shearing', skills: ['Sheep Care', 'Shearing', 'Wool Handling'],
    description: 'Demo profile. Breeds Bellary and Deccani cross sheep; focuses on clean shearing.',
    trainingCategories: ['sheep-care', 'shearing'] },
  { id: 'p-025', name: 'Demo Artisan – Bijapur', type: 'Artisan', state: 'Karnataka', region: 'Bijapur',
    specialization: 'Kasuti Embroidery & Wool', skills: ['Processing', 'Product Design', 'Selling'],
    description: 'Demo artisan weaving Kasuti-style embroidery into woollen textiles for premium markets.',
    trainingCategories: ['processing', 'selling'] },
  { id: 'p-026', name: 'Demo Wool Producer – Gadag', type: 'Wool Producer', state: 'Karnataka', region: 'Gadag',
    specialization: 'Wool Quality & Storage', skills: ['Wool Grading', 'Storage', 'Wool Handling'],
    description: 'Demo profile. Maintains Grade-A Deccani wool batches with proper baling and humidity control.',
    trainingCategories: ['wool-quality', 'storage'] },

  // Telangana
  { id: 'p-027', name: 'Demo Wool Producer – Mahbubnagar', type: 'Wool Producer', state: 'Telangana', region: 'Mahbubnagar',
    specialization: 'Sheep Care & Selling', skills: ['Sheep Care', 'Digital Selling', 'Wool Grading'],
    description: 'Demo profile. Nellore sheep farmer exploring digital wool selling platforms.',
    trainingCategories: ['sheep-care', 'selling'] },
  { id: 'p-028', name: 'Demo Artisan – Nalgonda', type: 'Artisan', state: 'Telangana', region: 'Nalgonda',
    specialization: 'Pochampally Wool Weaving', skills: ['Processing', 'Dyeing', 'Product Design'],
    description: 'Demo artisan weaving Pochampally-inspired ikat patterns using naturally dyed wool yarn.',
    trainingCategories: ['processing', 'wool-quality'] },
  { id: 'p-029', name: 'Demo Wool Producer – Warangal', type: 'Wool Producer', state: 'Telangana', region: 'Warangal',
    specialization: 'Storage & Processing', skills: ['Storage', 'Wool Processing', 'Shearing'],
    description: 'Demo profile. Stores and processes Telangana wool in a small family cooperative.',
    trainingCategories: ['storage', 'processing'] },
];

// ─── Training category display info ────────────────────────────────────────
const CATEGORY_INFO = {
  'sheep-care':  { label: 'Sheep Care',   color: 'bg-rose-50 text-rose-700 border-rose-200' },
  'shearing':    { label: 'Shearing',     color: 'bg-amber-50 text-amber-800 border-amber-200' },
  'wool-quality':{ label: 'Wool Quality', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  'storage':     { label: 'Storage',      color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  'processing':  { label: 'Processing',   color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  'selling':     { label: 'Selling',      color: 'bg-purple-50 text-purple-700 border-purple-200' },
};

// ─── Profile Detail Panel ──────────────────────────────────────────────────
function ProfilePanel({ producer, onClose, navigate }) {
  if (!producer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full sm:max-w-xl bg-surface rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh] sm:max-h-[85vh]">
        {/* Handle bar (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        <div className="p-6 sm:p-8">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-full bg-background hover:bg-border/40 transition-colors"
            aria-label="Close"
          >
            <X size={16} className="text-textMuted" />
          </button>

          {/* Type badge */}
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 ${
            producer.type === 'Artisan'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-emerald-100 text-emerald-700'
          }`}>
            {producer.type}
          </span>

          <h2 className="text-xl sm:text-2xl font-extrabold text-textPrimary leading-tight mb-1">
            {producer.name}
          </h2>

          <p className="flex items-center gap-1.5 text-sm text-textMuted font-medium mb-4">
            <MapPin size={14} />
            {producer.region}, {producer.state}
          </p>

          <div className="p-4 rounded-xl bg-background border border-border/60 mb-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-textMuted mb-1">Specialization</p>
            <p className="text-sm font-semibold text-textPrimary">{producer.specialization}</p>
          </div>

          <div className="mb-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-textMuted mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {producer.skills.map(skill => (
                <span key={skill} className="px-2.5 py-1 rounded-lg bg-background border border-border text-xs text-textSecondary font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <p className="text-sm text-textSecondary leading-relaxed mb-6">
            {producer.description}
          </p>

          {/* Recommended Training */}
          <div className="border-t border-border/60 pt-5">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={16} className="text-primary" />
              <p className="text-sm font-bold text-textPrimary">Recommended Training</p>
            </div>
            <p className="text-xs text-textMuted mb-3">
              Based on this profile's specialization and skills:
            </p>
            <div className="flex flex-wrap gap-2">
              {producer.trainingCategories.map(catKey => {
                const info = CATEGORY_INFO[catKey];
                if (!info) return null;
                return (
                  <button
                    key={catKey}
                    onClick={() => { onClose(); navigate(`/learn/category/${catKey}`); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${info.color} transition-all hover:-translate-y-0.5 hover:shadow-sm`}
                  >
                    <span>{info.label}</span>
                    <ArrowRight size={12} />
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-[10px] text-textMuted/60 mt-5 italic">
            * This is a sample/demo profile created for the WoolConnect hackathon prototype. Not a real person.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Producer Card ─────────────────────────────────────────────────────────
function ProducerCard({ producer, onViewDetails }) {
  return (
    <Card
      interactive={false}
      className="flex flex-col justify-between p-5 group"
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            producer.type === 'Artisan'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-emerald-100 text-emerald-700'
          }`}>
            {producer.type}
          </span>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-background border border-border text-textMuted text-sm font-bold">
            {producer.name.charAt(0)}
          </span>
        </div>

        <h3 className="text-base font-bold text-textPrimary leading-snug mb-1">
          {producer.name}
        </h3>

        <p className="flex items-center gap-1 text-xs text-textMuted font-medium mb-3">
          <MapPin size={12} />
          {producer.region}, {producer.state}
        </p>

        <div className="mb-3">
          <p className="text-[10px] text-textMuted uppercase tracking-wider font-semibold mb-1">Specialization</p>
          <p className="text-xs text-textSecondary font-medium">{producer.specialization}</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {producer.skills.slice(0, 3).map(skill => (
            <span key={skill} className="px-2 py-0.5 rounded-md bg-background border border-border/80 text-[11px] text-textMuted font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={() => onViewDetails(producer)}
        className="mt-5 w-full py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primaryDark transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
      >
        <span>View Details</span>
        <ArrowRight size={14} />
      </button>
    </Card>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function ProducerDirectory() {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducer, setSelectedProducer] = useState(null);

  const states = Object.keys(STATE_REGIONS);
  const regions = selectedState ? STATE_REGIONS[selectedState] : [];

  // Reset region when state changes
  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedRegion('');
  };

  const filtered = useMemo(() => {
    return PRODUCERS.filter(p => {
      if (selectedState && p.state !== selectedState) return false;
      if (selectedRegion && p.region !== selectedRegion) return false;
      if (selectedType && p.type !== selectedType) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.specialization.toLowerCase().includes(q) ||
          p.skills.some(s => s.toLowerCase().includes(q)) ||
          p.region.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedState, selectedRegion, selectedType, searchQuery]);

  const hasFilters = selectedState || selectedRegion || selectedType || searchQuery.trim();

  return (
    <>
      <main className="page-shell animate-enter">
        {/* Back */}
        <button
          onClick={() => navigate('/learn')}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-textSecondary hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Learn</span>
        </button>

        {/* Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2d3a6b] via-[#3b4d8a] to-[#4a5faa] text-white p-7 sm:p-10 shadow-xl mb-8">
          <div className="hero-orb orb-one opacity-15" />
          <div className="hero-orb orb-two opacity-10" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 border border-white/15 text-xs font-semibold backdrop-blur-md mb-4">
              <Users size={13} />
              <span>Regional Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              Producers & Artisans
            </h1>
            <p className="mt-2 text-sm sm:text-base text-white/80 max-w-xl leading-relaxed">
              Explore wool producers and artisans by state and region, and discover relevant training resources linked to their specializations.
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] bg-white/10 px-3 py-1.5 rounded-full text-blue-200 border border-white/10">
              ⚠️ Sample profiles for WoolConnect prototype — not real individuals
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-surface rounded-2xl border border-border/80 shadow-sm p-5 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative lg:col-span-1">
              <input
                type="text"
                placeholder="Search by name or skill…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-background text-textPrimary placeholder:text-textMuted text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary border border-border/60 transition-all"
              />
              <Search className="absolute left-3.5 top-3.5 text-textMuted" size={15} />
            </div>

            {/* State */}
            <div className="relative">
              <select
                value={selectedState}
                onChange={handleStateChange}
                className="w-full appearance-none px-4 py-3 rounded-xl bg-background text-textPrimary text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary border border-border/60 transition-all cursor-pointer pr-8"
              >
                <option value="">All States</option>
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={15} className="absolute right-3 top-3.5 text-textMuted pointer-events-none" />
            </div>

            {/* Region */}
            <div className="relative">
              <select
                value={selectedRegion}
                onChange={e => setSelectedRegion(e.target.value)}
                disabled={!selectedState}
                className="w-full appearance-none px-4 py-3 rounded-xl bg-background text-textPrimary text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary border border-border/60 transition-all cursor-pointer pr-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">All Regions</option>
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <ChevronDown size={15} className="absolute right-3 top-3.5 text-textMuted pointer-events-none" />
            </div>

            {/* Type */}
            <div className="relative">
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="w-full appearance-none px-4 py-3 rounded-xl bg-background text-textPrimary text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary border border-border/60 transition-all cursor-pointer pr-8"
              >
                <option value="">All Types</option>
                <option value="Wool Producer">Wool Producer</option>
                <option value="Artisan">Artisan</option>
              </select>
              <ChevronDown size={15} className="absolute right-3 top-3.5 text-textMuted pointer-events-none" />
            </div>
          </div>

          {/* Active filter chips + clear */}
          {hasFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border/60">
              <span className="text-xs text-textMuted font-medium">Active filters:</span>
              {selectedState && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  {selectedState}
                  <button onClick={() => { setSelectedState(''); setSelectedRegion(''); }} aria-label="Remove state filter"><X size={11} /></button>
                </span>
              )}
              {selectedRegion && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  {selectedRegion}
                  <button onClick={() => setSelectedRegion('')} aria-label="Remove region filter"><X size={11} /></button>
                </span>
              )}
              {selectedType && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  {selectedType}
                  <button onClick={() => setSelectedType('')} aria-label="Remove type filter"><X size={11} /></button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} aria-label="Clear search"><X size={11} /></button>
                </span>
              )}
              <button
                onClick={() => { setSelectedState(''); setSelectedRegion(''); setSelectedType(''); setSearchQuery(''); }}
                className="text-xs text-red-600 font-semibold hover:underline ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </section>

        {/* Results */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-semibold text-textSecondary">
              {filtered.length === 0 ? 'No profiles found' : `${filtered.length} profile${filtered.length !== 1 ? 's' : ''} found`}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-surface border border-border flex flex-col items-center">
              <span className="grid h-14 w-14 place-items-center rounded-3xl bg-blue-50 text-blue-600 mb-3">
                <Users size={28} />
              </span>
              <h3 className="font-bold text-base text-textPrimary">No profiles found</h3>
              <p className="text-xs sm:text-sm text-textSecondary max-w-sm mt-1 mb-4">
                Try adjusting your filters or search query to find wool producers and artisans.
              </p>
              {hasFilters && (
                <button
                  onClick={() => { setSelectedState(''); setSelectedRegion(''); setSelectedType(''); setSearchQuery(''); }}
                  className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl transition-colors shadow-sm hover:bg-primaryDark"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(producer => (
                <ProducerCard
                  key={producer.id}
                  producer={producer}
                  onViewDetails={setSelectedProducer}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Profile Detail Panel */}
      {selectedProducer && (
        <ProfilePanel
          producer={selectedProducer}
          onClose={() => setSelectedProducer(null)}
          navigate={navigate}
        />
      )}
    </>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BadgeIndianRupee, ClipboardPlus, MapPin, Package, Sparkles, Store, Waves } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import PriceCard from '../../components/market/DashboardPriceCard';
import BatchCard from '../../components/batch/DashboardBatchCard';
import { getBatchesByFarmer, getTotalInventory } from '../../services/batches.service';
import { getAllStatePrices } from '../../services/market.service';

const actions = [
  { label: 'Add a batch', copy: 'Record fresh wool', icon: ClipboardPlus, route: '/batches/add', tone: 'bg-primary text-white' },
  { label: 'Sell wool', copy: 'Browse the market', icon: Store, route: '/farmer/marketplace', tone: 'bg-accentLight text-accent' },
  { label: 'Track batches', copy: 'Follow every step', icon: Package, route: '/farmer/tracking', tone: 'bg-infoLight text-info' },
];

export default function FarmerDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [inventory, setInventory] = useState(null);
  const [price, setPrice] = useState(null);
  const [recentBatches, setRecentBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.id) return;
    setLoading(true);
    Promise.all([getTotalInventory(profile.id), getAllStatePrices(), getBatchesByFarmer(profile.id)])
      .then(([inventoryResult, priceResult, batchesResult]) => {
        if (!inventoryResult.error) setInventory(inventoryResult.data);
        if (!priceResult.error) setPrice(priceResult.data?.find(item => item.state === profile.state) || priceResult.data?.[0] || null);
        if (!batchesResult.error) setRecentBatches((batchesResult.data || []).slice(0, 4));
      })
      .finally(() => setLoading(false));
  }, [profile?.id, profile?.state]);

  return <main className="page-shell">
    <section className="hero-panel animate-enter">
      <div className="relative z-10 max-w-2xl">
        <div className="eyebrow"><Sparkles size={14}/> Your wool, clearly connected</div>
        <h1>Namaste, {profile?.name?.split(' ')[0] || 'Farmer'}.<br/><span>Grow value with every batch.</span></h1>
        <p className="hero-copy"><MapPin size={16}/>{profile?.district || 'Your district'}, {profile?.state || 'India'}</p>
        <div className="mt-7 flex flex-wrap gap-3"><button onClick={() => navigate('/batches/add')} className="hero-cta">Record wool <ArrowRight size={17}/></button><button onClick={() => navigate('/farmer/tracking')} className="hero-ghost">View tracking</button></div>
      </div><div className="hero-orb orb-one"/><div className="hero-orb orb-two"/><Waves className="hero-mark" strokeWidth={1}/>
    </section>
    <section className="dashboard-grid animate-enter delay-1">
      <Card className="metric-card border-0"><div className="metric-icon bg-primaryLight text-primary"><Package size={21}/></div><p>Available inventory</p><strong>{inventory !== null ? `${inventory.toLocaleString()} kg` : '—'}</strong><span>{loading ? 'Updating your inventory…' : 'Across active wool batches'}</span></Card>
      <Card className="metric-card border-0"><div className="metric-icon bg-accentLight text-accent"><BadgeIndianRupee size={21}/></div><p>Local market rate</p><strong>{price ? `₹${price.price_per_kg}` : '—'}<small>/kg</small></strong><span>{price?.wool_type || 'Latest mandi pricing'}</span></Card>
      {price && <PriceCard price={price.price_per_kg} changePercent={price.change_percent} woolType={price.wool_type} state={price.state}/>} 
    </section>
    <section className="mt-10 animate-enter delay-2"><div className="section-heading"><div><p className="eyebrow text-primary"><Sparkles size={14}/> Work smarter</p><h2>What would you like to do?</h2></div></div><div className="action-grid">{actions.map(({ label, copy, icon: Icon, route, tone }) => <button key={label} onClick={() => navigate(route)} className="action-card group"><span className={`action-icon ${tone}`}><Icon size={22}/></span><span><b>{label}</b><small>{copy}</small></span><ArrowRight className="action-arrow" size={18}/></button>)}</div></section>
    <section className="mt-12 animate-enter delay-3"><div className="section-heading"><div><p className="eyebrow text-primary"><Package size={14}/> Batch ledger</p><h2>Recent wool batches</h2></div><button onClick={() => navigate('/farmer/tracking')} className="text-link">View all <ArrowRight size={15}/></button></div>{!loading && recentBatches.length === 0 ? <Card className="empty-state"><Package size={28}/><h3>No batches yet</h3><p>Record your first wool batch and keep its story visible from farm to buyer.</p><button onClick={() => navigate('/batches/add')} className="text-link">Add a batch <ArrowRight size={15}/></button></Card> : <div className="grid gap-3">{recentBatches.map(batch => <BatchCard key={batch.id} batch={batch}/>)}</div>}</section>
  </main>;
}

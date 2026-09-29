import React, { useEffect, useState } from 'react';
import { getProcessedProducts } from '../../services/processor.service';
import { CheckCircle, Package, MapPin, Sparkles } from 'lucide-react';

export default function ProcessedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await getProcessedProducts();
      if (!res.error) setProducts(res.data);
      setLoading(false);
    }
    load();
  }, []);

  const getStatusBadge = (status) => {
    if (status === 'processed') return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase rounded-full flex items-center gap-1.5"><CheckCircle size={13}/> Ready / Bottled</span>;
    if (status === 'listed') return <span className="px-3 py-1 bg-sky-100 text-sky-800 text-[11px] font-bold uppercase rounded-full">Listed on Mandi</span>;
    if (status === 'sold') return <span className="px-3 py-1 bg-border text-deepBrown/70 text-[11px] font-bold uppercase rounded-full">Dispatched</span>;
    return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase rounded-full flex items-center gap-1.5"><CheckCircle size={13}/> {status}</span>;
  };

  return (
    <main className="max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 font-sans">
      <div className="bento-card p-6 md:p-8 mb-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-honeyGold/20 text-burgundy text-xs font-bold">
            <Sparkles size={13} className="text-honeyGold" />
            <span>Finished Goods Vault</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-deepBrown">
            Processed Honey Products
          </h1>
          <p className="text-sm text-deepBrown/70 max-w-xl">
            Certified bottled batches with tamper-evident QR seals ready for FMCG dispatch or consumer retail.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-burgundy border-t-transparent" />
        </div>
      ) : products.length === 0 ? (
        <div className="p-12 text-center bento-card">
          <Package size={36} className="mx-auto text-deepBrown/30 mb-3" />
          <p className="text-base font-bold text-deepBrown">No processed products found.</p>
          <p className="text-xs text-deepBrown/60 mt-1">Completed bottling runs will be archived and catalogued here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {products.map(prod => (
            <div key={prod.id} className="bento-card bento-card-hover p-5 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-mono font-bold text-sm text-burgundy">{prod.batchId}</p>
                <p className="text-xs text-deepBrown/80 mt-1">
                  Variety: <span className="font-bold text-deepBrown">{prod.type || 'Raw Blossom Honey'}</span> · <span className="font-mono font-bold text-burgundy">{prod.qty} kg</span> bottled
                </p>
                <p className="text-xs text-deepBrown/60 mt-0.5">Beekeeper: <span className="font-semibold text-deepBrown">{prod.farmerName}</span></p>
                <p className="text-xs text-deepBrown/60 mt-0.5 flex items-center gap-1">
                  <MapPin size={12} className="text-burntOrange"/> {prod.location} · Packed: {prod.date}
                </p>
              </div>
              <div className="flex flex-col sm:items-end gap-2 shrink-0">
                {getStatusBadge(prod.status)}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

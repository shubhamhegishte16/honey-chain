import React, { useEffect, useState } from 'react';
import { getProcessedProducts } from '../../services/processor.service';
import { CheckCircle, Package } from 'lucide-react';

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

  return (
    <main className="page-shell">
      <div className="section-heading mb-6">
        <div><p className="eyebrow text-primary"><Package size={13} /> Inventory</p><h1 className="text-2xl font-bold text-textPrimary">Processed Products</h1></div>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
      ) : products.length === 0 ? (
        <div className="p-8 text-center rounded-3xl bg-surface border border-border"><p className="text-sm text-textSecondary">No processed products found.</p></div>
      ) : (
        <div className="grid gap-4">
          {products.map(prod => (
            <div key={prod.id} className="p-5 rounded-2xl bg-surface border border-border shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="font-bold text-sm text-textPrimary">{prod.id}</p>
                <p className="text-xs text-textSecondary mt-1">Type: <span className="font-semibold">{prod.type}</span> • {prod.qty} kg</p>
                <p className="text-[11px] text-textMuted mt-1">Original Batch: {prod.originalId} • Date: {prod.date}</p>
              </div>
              <div className="flex flex-col sm:items-end gap-2">
                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase rounded-md flex items-center gap-1"><CheckCircle size={12}/> {prod.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

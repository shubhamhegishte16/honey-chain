import React, { useEffect, useState } from 'react';
import { getProcessedProducts } from '../../services/processor.service';
import { CheckCircle, Package, MapPin } from 'lucide-react';

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
    if (status === 'processed') return <span className="px-2 py-1 bg-teal-100 text-teal-800 text-[10px] font-bold uppercase rounded-md flex items-center gap-1"><CheckCircle size={12}/> Processed</span>;
    if (status === 'listed') return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-[10px] font-bold uppercase rounded-md">Listed</span>;
    if (status === 'sold') return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-[10px] font-bold uppercase rounded-md">Sold</span>;
    return <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase rounded-md flex items-center gap-1"><CheckCircle size={12}/> {status}</span>;
  };

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
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-textPrimary">{prod.batchId}</p>
                <p className="text-xs text-textSecondary mt-1">
                  Type: <span className="font-semibold">{prod.type}</span> · {prod.qty} kg
                </p>
                <p className="text-[11px] text-textMuted mt-0.5">Farmer: {prod.farmerName}</p>
                <p className="text-[11px] text-textMuted mt-0.5 flex items-center gap-1">
                  <MapPin size={10}/> {prod.location}
                </p>
                <p className="text-[11px] text-textMuted mt-0.5">Updated: {prod.date}</p>
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



import React, { useEffect, useState } from 'react';
import { getIncomingBatches } from '../../services/processor.service';
import { Package, CheckCircle, Truck } from 'lucide-react';

export default function IncomingBatches() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await getIncomingBatches();
      if (!res.error) setBatches(res.data);
      setLoading(false);
    }
    load();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'transit': return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-[10px] font-bold uppercase rounded-md flex items-center gap-1"><Truck size={12}/> In Transit</span>;
      case 'received': return <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase rounded-md flex items-center gap-1"><CheckCircle size={12}/> Received</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-[10px] font-bold uppercase rounded-md">{status}</span>;
    }
  };

  return (
    <main className="page-shell">
      <div className="section-heading mb-6">
        <div><p className="eyebrow text-primary"><Package size={13} /> Receiving</p><h1 className="text-2xl font-bold text-textPrimary">Incoming Batches</h1></div>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
      ) : batches.length === 0 ? (
        <div className="p-8 text-center rounded-3xl bg-surface border border-border"><p className="text-sm text-textSecondary">No incoming batches found.</p></div>
      ) : (
        <div className="grid gap-4">
          {batches.map(batch => (
            <div key={batch.id} className="p-5 rounded-2xl bg-surface border border-border shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="font-bold text-sm text-textPrimary">{batch.id}</p>
                <p className="text-xs text-textSecondary mt-1">Source: {batch.source} • Grade: {batch.grade} • {batch.quantity} kg</p>
                <p className="text-[11px] text-textMuted mt-1">Expected: {batch.date}</p>
              </div>
              <div className="flex flex-col sm:items-end gap-2">
                {getStatusBadge(batch.status)}
                {batch.status === 'transit' && (
                  <div className="mt-2">
                    <button className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primaryDark transition-colors">Mark as Received</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

import React, { useEffect, useState } from 'react';
import { getBatches } from '../../services/processor.service';
import { Network, Tag, MapPin } from 'lucide-react';

export default function BatchManagement() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await getBatches();
      if (!res.error) setBatches(res.data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <main className="page-shell">
      <div className="section-heading mb-6">
        <div><p className="eyebrow text-primary"><Network size={13} /> Lineage</p><h1 className="text-2xl font-bold text-textPrimary">Batch Management</h1></div>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
      ) : batches.length === 0 ? (
        <div className="p-8 text-center rounded-3xl bg-surface border border-border"><p className="text-sm text-textSecondary">No batches found.</p></div>
      ) : (
        <div className="grid gap-4">
          {batches.map(batch => (
            <div key={batch.id} className="p-5 rounded-2xl bg-surface border border-border shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-textPrimary flex items-center gap-2"><Tag size={14} className="text-primary"/> {batch.batchId}</p>
                <p className="text-xs text-textSecondary mt-1">
                  {batch.floralSource || batch.woolType || 'Raw Blossom Honey'} · Grade: {batch.grade} · {batch.qty} kg
                </p>
                <p className="text-[11px] text-textMuted mt-0.5">Beekeeper: {batch.owner}</p>
                <p className="text-[11px] text-textMuted mt-0.5 flex items-center gap-1">
                  <MapPin size={10}/> {batch.location}
                </p>
                <p className="text-[11px] text-textMuted mt-0.5">Updated: {batch.date}</p>
                {batch.children?.length > 0 && (
                  <div className="mt-3 p-3 bg-background rounded-xl border border-border/50">
                    <p className="text-[11px] font-bold text-textMuted uppercase mb-1">Child Batches</p>
                    <div className="flex gap-2 flex-wrap">
                      {batch.children.map(child => (
                        <span key={child} className="px-2 py-1 bg-white border border-border text-xs rounded-md shadow-sm">{child}</span>
                      ))}
                    </div>
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


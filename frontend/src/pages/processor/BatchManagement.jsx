import React, { useEffect, useState } from 'react';
import { getBatches } from '../../services/processor.service';
import { Network, Tag, MapPin, Sparkles } from 'lucide-react';

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
    <main className="max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 font-sans">
      <div className="bento-card p-6 md:p-8 mb-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-honeyGold/20 text-burgundy text-xs font-bold">
            <Sparkles size={13} className="text-honeyGold" />
            <span>Batch Lineage & Parent-Child Tree</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-deepBrown">
            Batch Management
          </h1>
          <p className="text-sm text-deepBrown/70 max-w-xl">
            Trace the split and blend lineage of bulk raw drums converted into retail consumer jars.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-burgundy border-t-transparent" />
        </div>
      ) : batches.length === 0 ? (
        <div className="p-12 text-center bento-card">
          <Network size={36} className="mx-auto text-deepBrown/30 mb-3" />
          <p className="text-base font-bold text-deepBrown">No batches found in plant registry.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {batches.map(batch => (
            <div key={batch.id} className="bento-card bento-card-hover p-5 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-mono font-bold text-sm text-burgundy flex items-center gap-2">
                  <Tag size={14} className="text-honeyGold"/> {batch.batchId}
                </p>
                <p className="text-xs text-deepBrown/80 mt-1">
                  Variety: <span className="font-bold text-deepBrown">{batch.floralSource || batch.woolType || 'Raw Blossom Honey'}</span> · Grade: <span className="font-semibold text-deepBrown">{batch.grade || 'A'}</span> · <span className="font-mono font-bold text-burgundy">{batch.qty} kg</span>
                </p>
                <p className="text-xs text-deepBrown/60 mt-0.5">Beekeeper: <span className="font-semibold text-deepBrown">{batch.owner}</span></p>
                <p className="text-xs text-deepBrown/60 mt-0.5 flex items-center gap-1">
                  <MapPin size={12} className="text-burntOrange"/> {batch.location} · Registered: {batch.date}
                </p>
                {batch.children?.length > 0 && (
                  <div className="mt-3 p-3 bg-warmIvory/60 rounded-2xl border border-border/70">
                    <p className="text-[11px] font-bold text-deepBrown/60 uppercase tracking-wider mb-1.5">Child Bottling Lots</p>
                    <div className="flex gap-2 flex-wrap">
                      {batch.children.map(child => (
                        <span key={child} className="px-2.5 py-1 bg-warmIvory border border-border text-xs font-mono font-bold text-burgundy rounded-xl shadow-xs">{child}</span>
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

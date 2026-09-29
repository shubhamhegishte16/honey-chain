import React, { useEffect, useState, useCallback } from 'react';
import { getActiveProcessing, updateProcessingRequestStatus } from '../../services/processor.service';
import { Activity, ArrowDown, Settings, CheckCircle, Sparkles } from 'lucide-react';

export default function ActiveProcessing() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getActiveProcessing();
    if (!res.error) setBatches(res.data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleComplete = async (requestId) => {
    setActionLoading(prev => ({ ...prev, [requestId]: true }));
    const res = await updateProcessingRequestStatus(requestId, 'completed');
    if (!res.error) {
      setBatches(prev => prev.filter(b => b.id !== requestId));
    }
    setActionLoading(prev => ({ ...prev, [requestId]: false }));
  };

  return (
    <main className="max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 font-sans">
      <div className="bento-card p-6 md:p-8 mb-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-honeyGold/20 text-burgundy text-xs font-bold">
            <Sparkles size={13} className="text-honeyGold" />
            <span>Honey Refining & Bottling Facility</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-deepBrown">
            Active Processing Workflow
          </h1>
          <p className="text-sm text-deepBrown/70 max-w-xl">
            Monitor micro-filtration, moisture dehumidification below 18%, and automated sterilized jar bottling lines.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-burgundy border-t-transparent" />
        </div>
      ) : batches.length === 0 ? (
        <div className="p-12 text-center bento-card">
          <Activity size={36} className="mx-auto text-deepBrown/30 mb-3" />
          <p className="text-base font-bold text-deepBrown">No active processing batches.</p>
          <p className="text-xs text-deepBrown/60 mt-1">Accept incoming extraction & bottling requests to begin batch refining.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {batches.map(batch => (
            <div key={batch.id} className="bento-card p-6 md:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-burgundy text-lg">Batch #{batch.batchIdDisplay}</span>
                    <span className="px-3 py-1 bg-honeyGold/20 text-burgundy text-xs font-bold rounded-full flex items-center gap-1">
                      <Settings size={13} className="animate-spin" /> {batch.stage}
                    </span>
                  </div>
                  <p className="text-xs text-deepBrown/70 mt-1">
                    <span className="font-bold text-deepBrown">{batch.floralSource || batch.woolType || 'Raw Blossom Honey'}</span> · <span className="font-mono font-bold text-burgundy">{batch.quantity} kg</span> · Beekeeper: <span className="font-semibold text-deepBrown">{batch.farmerName}</span>
                  </p>
                </div>
              </div>

              {/* Timeline Stages */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-warmIvory/60 p-6 rounded-3xl border border-border/70">
                {batch.stages.map((stage, i) => {
                  const hist = batch.history.find(h => h.stage === stage);
                  const status = hist ? hist.status : 'pending';
                  const isLast = i === batch.stages.length - 1;

                  return (
                    <React.Fragment key={stage}>
                      <div className="flex-1 min-w-0 flex flex-col items-center relative">
                        <div className={`grid h-11 w-11 place-items-center rounded-2xl border-2 z-10 font-bold transition-all ${
                          status === 'completed' 
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm' 
                            : status === 'active' 
                            ? 'bg-burgundy border-burgundy text-warmIvory ring-4 ring-honeyGold/30 shadow-md' 
                            : 'bg-warmIvory border-border text-deepBrown/40'
                        }`}>
                          {status === 'completed' ? <CheckCircle size={20} /> : <span className="text-xs">{i + 1}</span>}
                        </div>
                        <p className={`mt-2.5 text-xs font-bold text-center ${
                          status === 'completed' ? 'text-emerald-800' : status === 'active' ? 'text-burgundy' : 'text-deepBrown/50'
                        }`}>{stage}</p>
                        {hist && hist.out && (
                          <p className="text-[10px] text-deepBrown/60 font-mono mt-0.5">{hist.out} kg yield</p>
                        )}
                        {!isLast && (
                          <div className={`hidden md:block absolute top-5.5 left-[50%] right-[-50%] h-0.5 ${
                            status === 'completed' ? 'bg-emerald-500' : 'bg-border'
                          }`} />
                        )}
                      </div>
                      {!isLast && <div className="md:hidden flex justify-center py-1 text-border"><ArrowDown size={16} /></div>}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Complete Stage Action */}
              <div className="p-5 rounded-3xl bg-honeyGold/10 border border-honeyGold/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-sm text-deepBrown flex items-center gap-2">
                    <Activity size={16} className="text-burgundy" /> Advance Pipeline: {batch.stage}
                  </h3>
                  <p className="text-xs text-deepBrown/70 mt-0.5">
                    Request ID: <span className="font-mono font-semibold">{batch.requestId || batch.id}</span> · Beekeeper: <span className="font-semibold">{batch.farmerName}</span> · Volume: <span className="font-mono font-bold text-burgundy">{batch.quantity} kg</span>
                  </p>
                </div>
                <button
                  disabled={!!actionLoading[batch.id]}
                  onClick={() => handleComplete(batch.id)}
                  className="px-6 py-2.5 bg-burgundy text-warmIvory font-bold text-xs rounded-2xl hover:bg-burgundy/90 transition-all shadow-md shadow-burgundy/15 disabled:opacity-60 whitespace-nowrap"
                >
                  {actionLoading[batch.id] ? 'Publishing Block…' : 'Mark Stage Completed →'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

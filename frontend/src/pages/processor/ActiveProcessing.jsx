import React, { useEffect, useState } from 'react';
import { getActiveProcessing } from '../../services/processor.service';
import { Activity, ArrowDown, Settings } from 'lucide-react';

export default function ActiveProcessing() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await getActiveProcessing();
      if (!res.error) setBatches(res.data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <main className="page-shell">
      <div className="section-heading mb-6">
        <div><p className="eyebrow text-primary"><Activity size={13} /> Active</p><h1 className="text-2xl font-bold text-textPrimary">Processing Workflow</h1></div>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
      ) : batches.length === 0 ? (
        <div className="p-8 text-center rounded-3xl bg-surface border border-border"><p className="text-sm text-textSecondary">No active processing batches.</p></div>
      ) : (
        <div className="space-y-8">
          {batches.map(batch => (
            <div key={batch.id} className="p-6 rounded-3xl bg-surface border border-border shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-textPrimary">Batch {batch.id}</h2>
                  <p className="text-sm text-textSecondary mt-1">Starting Qty: {batch.originalQuantity} kg • Current Qty: {batch.quantity} kg</p>
                </div>
                <span className="px-3 py-1 bg-primaryLight text-primary text-xs font-bold uppercase rounded-md flex items-center gap-1">
                  <Settings size={14}/> {batch.stage}
                </span>
              </div>

              {/* Timeline */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-background p-6 rounded-2xl border border-border/50">
                {batch.stages.map((stage, i) => {
                  const hist = batch.history.find(h => h.stage === stage);
                  const status = hist ? hist.status : 'pending';
                  const isLast = i === batch.stages.length - 1;

                  return (
                    <React.Fragment key={stage}>
                      <div className="flex-1 min-w-0 flex flex-col items-center relative">
                        <div className={`grid h-10 w-10 place-items-center rounded-full border-2 z-10 ${status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' : status === 'active' ? 'bg-primary border-primary text-white ring-4 ring-primaryLight' : 'bg-surface border-border text-textMuted'}`}>
                          <span className="text-xs font-bold">{i + 1}</span>
                        </div>
                        <p className={`mt-2 text-xs font-bold text-center ${status === 'completed' ? 'text-emerald-700' : status === 'active' ? 'text-primary' : 'text-textMuted'}`}>{stage}</p>
                        {hist && hist.out && (
                          <p className="text-[10px] text-textSecondary text-center mt-0.5">{hist.out} kg</p>
                        )}
                        {!isLast && (
                           <div className={`hidden md:block absolute top-5 left-[50%] right-[-50%] h-0.5 ${status === 'completed' ? 'bg-emerald-500' : 'bg-border'}`} />
                        )}
                      </div>
                      {!isLast && <div className="md:hidden flex justify-center py-1 text-border"><ArrowDown size={16} /></div>}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Active Stage Form */}
              {batch.history.find(h => h.status === 'active') && (
                <div className="mt-6 p-5 rounded-2xl bg-primaryLight/30 border border-primary/20">
                  <h3 className="font-bold text-sm text-primary mb-4 flex items-center gap-2"><Activity size={16}/> Update Active Stage: {batch.stage}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-textSecondary mb-1.5">Input Quantity (kg)</label>
                      <input type="number" defaultValue={batch.quantity} className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-textSecondary mb-1.5">Output Quantity (kg)</label>
                      <input type="number" placeholder="Enter output..." className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-textSecondary mb-1.5">Operator</label>
                      <input type="text" placeholder="Operator name..." className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:border-primary" />
                    </div>
                    <div className="flex items-end">
                      <button className="w-full px-4 py-2 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primaryDark transition-colors shadow-sm">
                        Complete Stage
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

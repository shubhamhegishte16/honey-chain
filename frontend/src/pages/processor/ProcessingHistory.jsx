import React, { useEffect, useState } from 'react';
import { getProcessingHistory } from '../../services/processor.service';
import { Archive, CheckCircle } from 'lucide-react';

export default function ProcessingHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await getProcessingHistory();
      if (!res.error) setHistory(res.data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <main className="page-shell">
      <div className="section-heading mb-6">
        <div><p className="eyebrow text-primary"><Archive size={13} /> Log</p><h1 className="text-2xl font-bold text-textPrimary">Processing History</h1></div>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
      ) : history.length === 0 ? (
        <div className="p-8 text-center rounded-3xl bg-surface border border-border"><p className="text-sm text-textSecondary">No history found.</p></div>
      ) : (
        <div className="grid gap-4">
          {history.map(item => (
            <div key={item.id} className="p-5 rounded-2xl bg-surface border border-border shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="font-bold text-sm text-textPrimary">{item.id}</p>
                <p className="text-xs text-textSecondary mt-1">Original Qty: {item.originalQty} kg • Final Qty: {item.finalQty} kg</p>
                <p className="text-[11px] text-textMuted mt-1">Processed on: {item.date}</p>
              </div>
              <div className="flex flex-col sm:items-end gap-2">
                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase rounded-md flex items-center gap-1"><CheckCircle size={12}/> {item.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

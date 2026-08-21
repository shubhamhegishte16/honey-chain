import React, { useEffect, useState } from 'react';
import { getProcessingRequests } from '../../services/processor.service';
import { Inbox, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function ProcessingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await getProcessingRequests();
      if (!res.error) setRequests(res.data);
      setLoading(false);
    }
    load();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <span className="px-2 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase rounded-md flex items-center gap-1"><Clock size={12}/> Pending</span>;
      case 'accepted': return <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase rounded-md flex items-center gap-1"><CheckCircle size={12}/> Accepted</span>;
      case 'rejected': return <span className="px-2 py-1 bg-red-100 text-red-800 text-[10px] font-bold uppercase rounded-md flex items-center gap-1"><XCircle size={12}/> Rejected</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-[10px] font-bold uppercase rounded-md">{status}</span>;
    }
  };

  return (
    <main className="page-shell">
      <div className="section-heading mb-6">
        <div><p className="eyebrow text-primary"><Inbox size={13} /> Processing</p><h1 className="text-2xl font-bold text-textPrimary">Requests</h1></div>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
      ) : requests.length === 0 ? (
        <div className="p-8 text-center rounded-3xl bg-surface border border-border"><p className="text-sm text-textSecondary">No processing requests found.</p></div>
      ) : (
        <div className="grid gap-4">
          {requests.map(req => (
            <div key={req.id} className="p-5 rounded-2xl bg-surface border border-border shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="font-bold text-sm text-textPrimary">{req.id}</p>
                <p className="text-xs text-textSecondary mt-1">Source: {req.source} • Grade: {req.grade} • {req.quantity} kg</p>
                <p className="text-[11px] text-textMuted mt-1">Requested on: {req.date}</p>
              </div>
              <div className="flex flex-col sm:items-end gap-2">
                {getStatusBadge(req.status)}
                {req.status === 'pending' && (
                  <div className="flex gap-2 mt-2">
                    <button className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors">Accept</button>
                    <button className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors">Reject</button>
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

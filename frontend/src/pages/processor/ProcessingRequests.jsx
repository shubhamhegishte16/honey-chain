import React, { useEffect, useState, useCallback } from 'react';
import { getProcessingRequests, updateProcessingRequestStatus } from '../../services/processor.service';
import { Inbox, CheckCircle, XCircle, Clock, Activity, IndianRupee } from 'lucide-react';

export default function ProcessingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getProcessingRequests();
    if (!res.error) setRequests(res.data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleStatus = async (requestId, newStatus) => {
    setActionLoading(prev => ({ ...prev, [requestId]: newStatus }));
    const res = await updateProcessingRequestStatus(requestId, newStatus);
    if (!res.error) {
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: newStatus } : r));
    }
    setActionLoading(prev => ({ ...prev, [requestId]: null }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'requested': return <span className="px-2 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase rounded-md flex items-center gap-1"><Clock size={12}/> Requested</span>;
      case 'accepted':  return <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase rounded-md flex items-center gap-1"><CheckCircle size={12}/> Accepted</span>;
      case 'in_progress': return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-[10px] font-bold uppercase rounded-md flex items-center gap-1"><Activity size={12}/> In Progress</span>;
      case 'completed': return <span className="px-2 py-1 bg-teal-100 text-teal-800 text-[10px] font-bold uppercase rounded-md flex items-center gap-1"><CheckCircle size={12}/> Completed</span>;
      case 'rejected':  return <span className="px-2 py-1 bg-red-100 text-red-800 text-[10px] font-bold uppercase rounded-md flex items-center gap-1"><XCircle size={12}/> Rejected</span>;
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
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-textPrimary">{req.requestId || req.id}</p>
                <p className="text-xs text-textSecondary mt-1">
                  Batch: <span className="font-semibold">{req.batchIdDisplay}</span> · {req.floralSource || req.woolType || 'Raw Blossom Honey'} · {req.quantity} kg · Grade: {req.grade}
                </p>
                <p className="text-[11px] text-textMuted mt-0.5">
                  Beekeeper: {req.farmerName} · Service: {req.serviceType}
                </p>
                <p className="text-[11px] text-textMuted mt-0.5 flex items-center gap-1">
                  Requested: {req.date} · <IndianRupee size={10} className="inline" />{req.estimatedCost?.toLocaleString('en-IN') || '—'}
                </p>
                {req.notes && <p className="text-[11px] text-textMuted mt-0.5 italic">"{req.notes}"</p>}
              </div>
              <div className="flex flex-col sm:items-end gap-2 shrink-0">
                {getStatusBadge(req.status)}
                {req.status === 'requested' && (
                  <div className="flex gap-2 mt-2">
                    <button
                      disabled={!!actionLoading[req.id]}
                      onClick={() => handleStatus(req.id, 'accepted')}
                      className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-60"
                    >
                      {actionLoading[req.id] === 'accepted' ? '…' : 'Accept'}
                    </button>
                    <button
                      disabled={!!actionLoading[req.id]}
                      onClick={() => handleStatus(req.id, 'rejected')}
                      className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors disabled:opacity-60"
                    >
                      {actionLoading[req.id] === 'rejected' ? '…' : 'Reject'}
                    </button>
                  </div>
                )}
                {req.status === 'accepted' && (
                  <button
                    disabled={!!actionLoading[req.id]}
                    onClick={() => handleStatus(req.id, 'in_progress')}
                    className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 mt-2"
                  >
                    {actionLoading[req.id] === 'in_progress' ? '…' : 'Start Processing'}
                  </button>
                )}
                {req.status === 'in_progress' && (
                  <button
                    disabled={!!actionLoading[req.id]}
                    onClick={() => handleStatus(req.id, 'completed')}
                    className="px-3 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-60 mt-2"
                  >
                    {actionLoading[req.id] === 'completed' ? '…' : 'Mark Completed'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}




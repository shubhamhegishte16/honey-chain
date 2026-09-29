import React, { useEffect, useState, useCallback } from 'react';
import { getProcessingRequests, updateProcessingRequestStatus } from '../../services/processor.service';
import { Inbox, CheckCircle, XCircle, Clock, Activity, IndianRupee, Sparkles } from 'lucide-react';

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
      case 'requested': return <span className="px-3 py-1 bg-honeyGold/20 text-burgundy text-[11px] font-bold uppercase rounded-full flex items-center gap-1.5"><Clock size={13}/> Requested</span>;
      case 'accepted':  return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase rounded-full flex items-center gap-1.5"><CheckCircle size={13}/> Accepted</span>;
      case 'in_progress': return <span className="px-3 py-1 bg-sky-100 text-sky-800 text-[11px] font-bold uppercase rounded-full flex items-center gap-1.5"><Activity size={13}/> In Progress</span>;
      case 'completed': return <span className="px-3 py-1 bg-teal-100 text-teal-800 text-[11px] font-bold uppercase rounded-full flex items-center gap-1.5"><CheckCircle size={13}/> Completed</span>;
      case 'rejected':  return <span className="px-3 py-1 bg-rose-100 text-rose-800 text-[11px] font-bold uppercase rounded-full flex items-center gap-1.5"><XCircle size={13}/> Rejected</span>;
      default: return <span className="px-3 py-1 bg-warmIvory border border-border text-deepBrown text-[11px] font-bold uppercase rounded-full">{status}</span>;
    }
  };

  return (
    <main className="max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 font-sans">
      <div className="bento-card p-6 md:p-8 mb-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-honeyGold/20 text-burgundy text-xs font-bold">
            <Sparkles size={13} className="text-honeyGold" />
            <span>Apiary Service Contracting</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-deepBrown">
            Processing Requests
          </h1>
          <p className="text-sm text-deepBrown/70 max-w-xl">
            Contract requests from beekeepers for raw comb extraction, moisture filtration, quality assays, and sterilized jar bottling.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-burgundy border-t-transparent" />
        </div>
      ) : requests.length === 0 ? (
        <div className="p-12 text-center bento-card">
          <Inbox size={36} className="mx-auto text-deepBrown/30 mb-3" />
          <p className="text-base font-bold text-deepBrown">No processing requests found.</p>
          <p className="text-xs text-deepBrown/60 mt-1">Direct beekeeper requests for honey refinement will be listed here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map(req => (
            <div key={req.id} className="bento-card bento-card-hover p-5 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-mono font-bold text-sm text-burgundy">{req.requestId || req.id}</p>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-border text-deepBrown/70">Batch #{req.batchIdDisplay}</span>
                </div>
                <p className="text-xs text-deepBrown/80 mt-1">
                  <span className="font-bold text-deepBrown">{req.floralSource || req.woolType || 'Raw Blossom Honey'}</span> · <span className="font-mono font-bold text-burgundy">{req.quantity} kg</span> · Service: <span className="font-semibold text-deepBrown">{req.serviceType}</span>
                </p>
                <p className="text-xs text-deepBrown/60 mt-0.5">
                  Beekeeper: <span className="font-semibold text-deepBrown">{req.farmerName}</span> · Est. Quote: <span className="font-bold text-deepBrown">₹{req.estimatedCost?.toLocaleString('en-IN') || '—'}</span>
                </p>
                {req.notes && <p className="text-xs text-deepBrown/70 mt-1 italic bg-warmIvory/60 p-2 rounded-xl border border-border/60">"{req.notes}"</p>}
              </div>
              <div className="flex flex-col sm:items-end gap-2 shrink-0">
                {getStatusBadge(req.status)}
                {req.status === 'requested' && (
                  <div className="flex gap-2 mt-2">
                    <button
                      disabled={!!actionLoading[req.id]}
                      onClick={() => handleStatus(req.id, 'accepted')}
                      className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-2xl hover:bg-emerald-800 transition-all shadow-xs disabled:opacity-60"
                    >
                      {actionLoading[req.id] === 'accepted' ? '…' : 'Accept Request'}
                    </button>
                    <button
                      disabled={!!actionLoading[req.id]}
                      onClick={() => handleStatus(req.id, 'rejected')}
                      className="px-4 py-2 bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold rounded-2xl hover:bg-rose-100 transition-all disabled:opacity-60"
                    >
                      {actionLoading[req.id] === 'rejected' ? '…' : 'Decline'}
                    </button>
                  </div>
                )}
                {req.status === 'accepted' && (
                  <button
                    disabled={!!actionLoading[req.id]}
                    onClick={() => handleStatus(req.id, 'in_progress')}
                    className="px-5 py-2 bg-burgundy text-warmIvory text-xs font-bold rounded-2xl hover:bg-burgundy/90 transition-all shadow-md shadow-burgundy/15 disabled:opacity-60 mt-2"
                  >
                    {actionLoading[req.id] === 'in_progress' ? 'Starting…' : 'Begin Processing Pipeline'}
                  </button>
                )}
                {req.status === 'in_progress' && (
                  <button
                    disabled={!!actionLoading[req.id]}
                    onClick={() => handleStatus(req.id, 'completed')}
                    className="px-5 py-2 bg-emerald-700 text-white text-xs font-bold rounded-2xl hover:bg-emerald-800 transition-all shadow-xs disabled:opacity-60 mt-2"
                  >
                    {actionLoading[req.id] === 'completed' ? 'Updating…' : 'Mark All Stages Finished'}
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

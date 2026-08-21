import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Search, ArrowRight } from 'lucide-react';

export default function ProcessorPassportScanner() {
  const [batchId, setBatchId] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (batchId.trim()) {
      navigate(`/processor/passport/${batchId.trim()}`);
    }
  };

  return (
    <main className="page-shell">
      <div className="section-heading mb-6">
        <div><p className="eyebrow text-primary"><QrCode size={13} /> Traceability</p><h1 className="text-2xl font-bold text-textPrimary">Wool Passport</h1></div>
      </div>

      <div className="max-w-md mx-auto mt-12 p-8 rounded-3xl bg-surface border border-border shadow-card flex flex-col items-center text-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-primaryLight text-primary mb-6 shadow-sm">
          <QrCode size={32} />
        </span>
        <h2 className="text-xl font-bold text-textPrimary mb-2">Scan or Enter Batch ID</h2>
        <p className="text-sm text-textSecondary mb-8">View the complete Farm-to-Fabric journey of any wool batch.</p>

        <form onSubmit={handleSearch} className="w-full relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-textMuted">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            placeholder="e.g. WOL-MH-001"
            className="w-full pl-10 pr-12 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            required
          />
          <button
            type="submit"
            className="absolute inset-y-1 right-1 px-3 bg-primary text-white rounded-lg hover:bg-primaryDark transition-colors flex items-center"
            aria-label="Search"
          >
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </main>
  );
}

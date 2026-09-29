import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Search, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

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
    <main className="max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 font-sans">
      <div className="bento-card p-6 md:p-8 mb-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-honeyGold/20 text-burgundy text-xs font-bold">
            <Sparkles size={13} className="text-honeyGold" />
            <span>Cryptographic Merkle Audit</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-deepBrown">
            Honey Passport Scanner
          </h1>
          <p className="text-sm text-deepBrown/70 max-w-xl">
            Audit the immutable Hive-to-Home timeline, NMR purity tests, and beekeeper origin data.
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto mt-8 bento-card p-8 md:p-10 flex flex-col items-center text-center">
        <div className="grid h-20 w-20 place-items-center rounded-3xl bg-honeyGold/20 text-burgundy mb-6 shadow-md shadow-honeyGold/10">
          <QrCode size={38} className="text-burgundy" />
        </div>
        <h2 className="text-xl md:text-2xl font-serif font-bold text-deepBrown mb-2">Scan or Enter Batch ID</h2>
        <p className="text-xs text-deepBrown/70 mb-8 max-w-md">
          Instantly inspect blockchain transactions, IoT temperature & moisture logs, and NABL NMR certificate for any lot.
        </p>

        <form onSubmit={handleSearch} className="w-full relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-deepBrown/40">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            placeholder="e.g. HC2026-00124 or HNY-MH-001"
            className="w-full pl-11 pr-14 py-3.5 bg-warmIvory border border-border rounded-2xl text-xs font-mono text-deepBrown focus:outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/15 transition-all shadow-xs"
            required
          />
          <button
            type="submit"
            className="absolute inset-y-1.5 right-1.5 px-4 bg-burgundy text-warmIvory rounded-xl hover:bg-burgundy/90 transition-all flex items-center justify-center shadow-sm"
            aria-label="Search"
          >
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-6 flex items-center gap-2 text-[11px] text-deepBrown/60">
          <ShieldCheck size={14} className="text-emerald-700" />
          <span>Verified against Ethereum SHA-256 State Root</span>
        </div>
      </div>
    </main>
  );
}

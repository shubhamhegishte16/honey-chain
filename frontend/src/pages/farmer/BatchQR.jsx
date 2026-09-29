import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import {
  QrCode,
  ArrowLeft,
  Download,
  Printer,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { getBatchById } from '../../services/batches.service';
import { useLanguage } from '../../context/LanguageContext';

export default function BatchQR() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getBatchById(id).then(({ data }) => {
      setBatch(data);
      setLoading(false);
    });
  }, [id]);

  const batchIdentifier = batch?.batch_id || batch?.batchId || batch?.id || id;
  const qrValue = typeof window !== 'undefined'
    ? `${window.location.origin}/buyer/honey-passport/${batchIdentifier}`
    : `https://honeychain.org.in/passport/${batchIdentifier}`;

  function handleDownload() {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.download = `HoneyChain_QR_${batchIdentifier}.png`;
    a.href = url;
    a.click();
  }

  function handleCopyLink() {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(qrValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <main className="page-shell max-w-xl mx-auto">
      
      {/* Top Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to={batch ? `/batches/${batch._id || batch.id}/details` : '/farmer/tracking'}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5E524D] hover:text-[#281D1C] transition-colors group"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          <span>Back to Lot Details</span>
        </Link>

        <span className="text-xs text-[#861C1C] font-bold flex items-center gap-1 bg-[#FBEBEB] px-3 py-1 rounded-full border border-[#861C1C]/20">
          <ShieldCheck size={14} /> Cryptographic Passport QR
        </span>
      </div>

      <div className="rounded-3xl bg-white border border-[#E8E3CF] p-6 sm:p-10 shadow-card text-center animate-enter">
        
        <div className="mb-6">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FEF6E4] text-[#C06E30] mx-auto mb-3 text-xl shadow-xs">
            🍯
          </span>
          <h1 className="text-2xl font-bold font-serif text-[#281D1C]">Consumer Honey Passport QR</h1>
          <p className="text-xs sm:text-sm text-[#5E524D] mt-1 leading-relaxed max-w-md mx-auto">
            Print this high-resolution QR label for glass honey jars (250g, 500g, 1kg) or bulk storage barrels.
            Consumers scan to inspect verified flora, apiary GPS, and NMR lab certificates.
          </p>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#861C1C] border-t-transparent" />
          </div>
        ) : batch ? (
          <div className="space-y-6">
            
            {/* QR Container */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF7EE] border border-[#E8E3CF] inline-block shadow-neomorph mx-auto">
              <QRCodeCanvas
                value={qrValue}
                size={220}
                fgColor="#281D1C"
                bgColor="#FAF7EE"
                level="H"
                includeMargin={false}
              />
              <p className="font-mono font-bold text-sm text-[#281D1C] mt-4">
                {batch.batch_id || batch.batchId || batch.id}
              </p>
              <p className="text-xs text-[#C06E30] font-bold mt-0.5">
                {batch.floralSource || batch.wool_type || 'Mustard Blossom Raw Honey'} • {batch.quantity_kg || batch.quantityKg || 60} kg
              </p>
              <p className="text-[10px] text-[#9B918B] mt-1 font-semibold uppercase tracking-wider">
                KVIC Blockchain Genesis Block #0
              </p>
            </div>

            {/* Direct Passport Launch */}
            <div>
              <button
                onClick={() => navigate(`/buyer/honey-passport/${batchIdentifier}`)}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#861C1C] text-white font-bold text-xs sm:text-sm shadow-burgundy hover:bg-[#6A1515] transition-all hover:scale-105 active:scale-95"
              >
                <ExternalLink size={15} />
                <span>Open Digital Honey Passport (Live Demo)</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#E8E3CF] text-xs font-bold text-[#281D1C] hover:bg-[#FAF7EE] transition-all shadow-soft"
              >
                <Download size={14} className="text-[#C06E30]" />
                <span>Download PNG Label</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#E8E3CF] text-xs font-bold text-[#281D1C] hover:bg-[#FAF7EE] transition-all shadow-soft"
              >
                {copied ? <CheckCircle2 size={14} className="text-emerald-700" /> : <Copy size={14} className="text-[#861C1C]" />}
                <span>{copied ? 'Link Copied!' : 'Copy Passport URL'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#E8E3CF] text-xs font-bold text-[#281D1C] hover:bg-[#FAF7EE] transition-all shadow-soft"
              >
                <Printer size={14} className="text-[#C06E30]" />
                <span>Print QR Barcode</span>
              </button>
            </div>

          </div>
        ) : (
          <p className="text-sm text-[#861C1C]">Honey batch data not available.</p>
        )}

      </div>
    </main>
  );
}

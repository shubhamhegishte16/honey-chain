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
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
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
    <main className="page-shell max-w-xl mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <Link
          to={batch ? `/batches/${batch._id || batch.id}/details` : '/farmer/tracking'}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-textSecondary hover:text-primary transition-colors group"
        >
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Lot Details</span>
        </Link>

        <span className="text-xs text-primary font-bold flex items-center gap-1 bg-primaryLight px-2.5 py-1 rounded-full border border-primary/20">
          <ShieldCheck size={14} /> KVIC Honey Passport QR
        </span>
      </div>

      <div className="rounded-3xl bg-surface border border-border/80 p-6 sm:p-10 shadow-card text-center animate-enter">
        <div className="mb-6">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-amber-800 mx-auto mb-3 shadow-xs">
            <QrCode size={24} />
          </span>
          <h1 className="text-2xl font-black text-textPrimary">Consumer Honey Passport QR</h1>
          <p className="text-xs sm:text-sm text-textSecondary mt-1">
            Print this cryptographic label for honey jars (250g, 500g, 1kg) or bulk apiary barrels.
            Consumers scan to inspect verified flora, apiary GPS, and lab purity tests.
          </p>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : batch ? (
          <div className="space-y-6">
            {/* QR Frame Container */}
            <div className="p-6 rounded-3xl bg-amber-50/60 border border-amber-200 inline-block shadow-inner mx-auto">
              <QRCodeCanvas
                value={qrValue}
                size={220}
                fgColor="#78350F"
                bgColor="#FFFBEB"
                level="H"
                includeMargin={false}
              />
              <p className="font-mono font-black text-sm text-textPrimary mt-4">
                {batch.batch_id || batch.batchId || batch.id}
              </p>
              <p className="text-xs text-amber-800 font-semibold mt-0.5">
                {batch.floralSource || batch.wool_type || 'Mustard Blossom Raw Honey'} • {batch.quantity_kg || batch.quantityKg || 50} kg
              </p>
              <p className="text-[10px] text-textMuted mt-1">
                KVIC Blockchain Genesis Block #0
              </p>
            </div>

            {/* Direct Passport Launch for Localhost Testing */}
            <div className="pt-2">
              <button
                onClick={() => navigate(`/buyer/honey-passport/${batchIdentifier}`)}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold text-sm shadow-md hover:from-amber-700 hover:to-amber-800 transition-all active:scale-[0.99]"
              >
                <ExternalLink size={16} />
                <span>Open Digital Honey Passport (Live Demo)</span>
              </button>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-textPrimary hover:border-primary/50 hover:bg-background transition-all shadow-sm"
              >
                <Download size={14} className="text-primary" />
                <span>Download PNG Label</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-textPrimary hover:border-primary/50 hover:bg-background transition-all shadow-sm"
              >
                {copied ? <CheckCircle2 size={14} className="text-emerald-700" /> : <Copy size={14} className="text-primary" />}
                <span>{copied ? 'Link Copied!' : 'Copy Passport URL'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-textPrimary hover:border-primary/50 hover:bg-background transition-all shadow-sm"
              >
                <Printer size={14} className="text-primary" />
                <span>Print QR Barcode</span>
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-error">Honey batch data not available.</p>
        )}
      </div>
    </main>
  );
}

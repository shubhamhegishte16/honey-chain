import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import {
  QrCode,
  ArrowLeft,
  Download,
  Printer,
  Sparkles,
  Package,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { getBatchById } from '../../services/batches.service';

export default function BatchQR() {
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

  const qrValue = batch
    ? `https://woolconnect.in/trace/${batch.batch_id || batch.id}`
    : '';

  function handleDownload() {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.download = `QR_${batch?.batch_id || 'batch'}.png`;
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
    <main className="page-shell max-w-xl">
      <div className="mb-6 flex items-center justify-between">
        <Link
          to={batch ? `/batches/${batch._id || batch.id}/details` : '/farmer/tracking'}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-textSecondary hover:text-primary transition-colors group"
        >
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Batch Details</span>
        </Link>

        <span className="text-xs text-primary font-bold flex items-center gap-1">
          <ShieldCheck size={14} /> Tamper-Evident Passport
        </span>
      </div>

      <div className="rounded-3xl bg-surface border border-border/80 p-6 sm:p-10 shadow-card text-center animate-enter">
        <div className="mb-6">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primaryLight text-primary mx-auto mb-3">
            <QrCode size={24} />
          </span>
          <h1 className="text-2xl font-bold text-textPrimary">Lot QR Code Passport</h1>
          <p className="text-xs sm:text-sm text-textSecondary mt-1">
            Scan with any smartphone camera to inspect verified farm origin, micron grade, and chain of custody.
          </p>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : batch ? (
          <div className="space-y-6">
            {/* QR Frame Container */}
            <div className="p-6 rounded-3xl bg-background border border-border inline-block shadow-inner mx-auto">
              <QRCodeCanvas
                value={qrValue}
                size={220}
                fgColor="#1C3E27"
                bgColor="#FAF9F6"
                level="H"
                includeMargin={false}
              />
              <p className="font-mono font-bold text-sm text-textPrimary mt-4">
                {batch.batch_id}
              </p>
              <p className="text-[11px] text-textMuted font-medium mt-0.5">
                {batch.wool_type} • {batch.quantity_kg} kg
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-textPrimary hover:border-primary/50 hover:bg-background transition-all shadow-sm"
              >
                <Download size={14} className="text-primary" />
                <span>Download PNG</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-textPrimary hover:border-primary/50 hover:bg-background transition-all shadow-sm"
              >
                {copied ? <CheckCircle2 size={14} className="text-emerald-700" /> : <Copy size={14} className="text-primary" />}
                <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-textPrimary hover:border-primary/50 hover:bg-background transition-all shadow-sm"
              >
                <Printer size={14} className="text-primary" />
                <span>Print Tag</span>
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-error">Batch data not available.</p>
        )}
      </div>
    </main>
  );
}

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ClipboardPlus,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Calendar,
  Sparkles,
  Layers,
  Scale,
  FileText,
  CheckCircle2,
  Info
} from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { createHoneyBatch } from '../../services/batches.service';
import { INDIAN_STATES, DISTRICTS_BY_STATE, WOOL_TYPES } from '../../constants/states';

export default function AddHoneyBatch() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [form, setForm] = useState({
    floralSource: 'Mustard Blossom',
    quantity: '',
    harvestDate: new Date().toISOString().split('T')[0],
    state: profile?.state || 'Rajasthan',
    district: profile?.district || 'Bharatpur',
    farmLocation: '',
    notes: '',
    pricePerKg: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function update(field, value) {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'state') {
        const stateCode = INDIAN_STATES.find(s => s.name === value)?.code;
        const availableDistricts = stateCode ? DISTRICTS_BY_STATE[stateCode] || [] : [];
        next.district = availableDistricts[0] || '';
      }
      return next;
    });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }

  function validate() {
    const e = {};
    if (!form.floralSource) e.floralSource = 'Select floral nectar source';
    if (!form.quantity || isNaN(Number(form.quantity)) || Number(form.quantity) <= 0) {
      e.quantity = t('validQtyRequired', 'Enter a valid positive quantity in kg');
    }
    if (!form.harvestDate) e.harvestDate = 'Enter extraction date';
    if (!form.state) e.state = t('selectState', 'Select state');
    if (!form.district) e.district = t('selectDistrict', 'Select district');
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;
    setLoading(true);

    const { data, error } = await createHoneyBatch({
      farmerId: profile?.id,
      floralSource: form.floralSource,
      quantityKg: Number(form.quantity),
      harvestDate: form.harvestDate,
      state: form.state,
      district: form.district,
      farmLocation: form.farmLocation,
      notes: form.notes,
      pricePerKg: Number(form.pricePerKg) || 285,
      images: ['/honey-hero.jpg'],
    });

    setLoading(false);
    if (error) {
      setSubmitError(error.message || 'Failed to record honey harvest batch. Please try again.');
      return;
    }
    navigate(`/batches/${data.id || data._id}/details`, { replace: true });
  }

  const selectedStateObj = INDIAN_STATES.find(s => s.name === form.state);
  const stateCode = selectedStateObj?.code;
  const districts = stateCode ? DISTRICTS_BY_STATE[stateCode] || [] : [];

  return (
    <main className="page-shell max-w-3xl mx-auto">
      
      {/* Top Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/farmer/tracking"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5E524D] hover:text-[#281D1C] transition-colors group"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          <span>Back to Honey Lots</span>
        </Link>

        <span className="text-xs text-[#C06E30] font-bold flex items-center gap-1">
          <Sparkles size={13} /> Automated Cryptographic Genesis Block
        </span>
      </div>

      <div className="rounded-3xl bg-white border border-[#E8E3CF] p-6 sm:p-10 shadow-card animate-enter">
        
        <div className="mb-8 pb-5 border-b border-[#E8E3CF]">
          <span className="eyebrow"><ClipboardPlus size={13} /> KVIC Honey Mission Lot Registration</span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#281D1C] mt-1">
            Log Honey Extraction Batch
          </h1>
          <p className="text-xs sm:text-sm text-[#5E524D] mt-1 leading-relaxed">
            Record your apiary extraction details to create Genesis Block #0 and generate cryptographic QR codes for jar labeling.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          
          {/* Section 1: Floral Source */}
          <div>
            <label className="block font-bold text-xs sm:text-sm text-[#281D1C] mb-2.5">
              Floral Nectar Bloom Source <span className="text-[#861C1C] font-bold">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {WOOL_TYPES.map(breed => (
                <button
                  type="button"
                  key={breed}
                  onClick={() => update('floralSource', breed)}
                  className={`px-4 py-2 rounded-full border text-xs font-bold transition-all duration-150 ${
                    form.floralSource === breed
                      ? 'bg-[#861C1C] border-[#861C1C] text-white shadow-burgundy'
                      : 'bg-[#FAF7EE] border-[#E8E3CF] text-[#5E524D] hover:border-[#F4B345]'
                  }`}
                >
                  {breed}
                </button>
              ))}
            </div>
            {errors.floralSource && <p className="text-[#861C1C] text-xs mt-1.5 font-semibold">{errors.floralSource}</p>}
          </div>

          {/* Section 2: Weight & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                label="Extraction Weight (kg)"
                id="quantity"
                type="number"
                icon={Scale}
                value={form.quantity}
                onChange={e => update('quantity', e.target.value)}
                placeholder="e.g. 60"
                error={errors.quantity}
                required
              />
              <div className="flex items-center gap-1.5 -mt-2">
                <span className="text-[11px] text-[#9B918B] font-medium">Quick add:</span>
                {[30, 60, 120, 250].map(kg => (
                  <button
                    key={kg}
                    type="button"
                    onClick={() => update('quantity', String(kg))}
                    className="px-2.5 py-0.5 rounded-full bg-[#FAF7EE] border border-[#E8E3CF] text-[11px] font-bold text-[#5E524D] hover:border-[#F4B345] hover:text-[#281D1C]"
                  >
                    {kg} kg
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Extraction Date"
              id="harvestDate"
              type="date"
              icon={Calendar}
              value={form.harvestDate}
              onChange={e => update('harvestDate', e.target.value)}
              error={errors.harvestDate}
              required
            />
          </div>

          <div className="max-w-xs">
            <Input
              label="Expected Reserve Price (₹ / kg)"
              id="pricePerKg"
              type="number"
              icon={FileText}
              value={form.pricePerKg}
              onChange={e => update('pricePerKg', e.target.value)}
              placeholder="e.g. 285"
            />
          </div>

          {/* Section 3: Origin Location */}
          <div className="pt-4 border-t border-[#E8E3CF]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#C06E30] mb-3">
              Apiary Location
            </p>

            {/* State Pills */}
            <div className="mb-4">
              <label className="block font-bold text-xs text-[#281D1C] mb-2">
                State <span className="text-[#861C1C]">*</span>
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1 pb-1">
                {INDIAN_STATES.map(s => (
                  <button
                    type="button"
                    key={s.code}
                    onClick={() => update('state', s.name)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                      form.state === s.name
                        ? 'bg-[#861C1C] border-[#861C1C] text-white font-bold'
                        : 'bg-[#FAF7EE] border-[#E8E3CF] text-[#5E524D] hover:border-[#D6CEB5]'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
              {errors.state && <p className="text-[#861C1C] text-xs mt-1 font-semibold">{errors.state}</p>}
            </div>

            {/* District Pills */}
            {districts.length > 0 && (
              <div className="mb-4">
                <label className="block font-bold text-xs text-[#281D1C] mb-2">
                  District / Cluster <span className="text-[#861C1C]">*</span>
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1 pb-1">
                  {districts.map(d => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => update('district', d)}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full border text-xs transition-all ${
                        form.district === d
                          ? 'bg-[#C06E30] border-[#C06E30] text-white font-bold'
                          : 'bg-[#FAF7EE] border-[#E8E3CF] text-[#5E524D] hover:border-[#C06E30]'
                      }`}
                    >
                      <MapPin size={11} className="mr-1 opacity-70" />
                      {d}
                    </button>
                  ))}
                </div>
                {errors.district && <p className="text-[#861C1C] text-xs mt-1 font-semibold">{errors.district}</p>}
              </div>
            )}

            <Input
              label="Apiary Farm Location (Optional)"
              id="farmLocation"
              icon={MapPin}
              value={form.farmLocation}
              onChange={e => update('farmLocation', e.target.value)}
              placeholder="e.g. Apiary Box #1 to #25, Mustard Bloom Belt"
            />
          </div>

          {/* Section 4: Notes */}
          <div className="pt-2 border-t border-[#E8E3CF]">
            <Input
              label="Extraction Observations & Moisture Estimate (Optional)"
              id="notes"
              multiline
              value={form.notes}
              onChange={e => update('notes', e.target.value)}
              placeholder="e.g. Uncapped comb harvested at 17.5% moisture, unheated raw honey placed in food-grade sealed stainless drums."
            />
          </div>

          {submitError && (
            <div className="p-4 rounded-2xl bg-[#FBEBEB] border border-[#861C1C]/30 text-[#861C1C] text-xs font-semibold">
              {submitError}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#861C1C] text-white font-bold text-xs sm:text-sm shadow-burgundy hover:bg-[#6A1515] transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <ClipboardPlus size={16} />
              <span>{loading ? 'Minting Lot on Hash Ledger...' : 'Record Harvest & Generate QR Passport'}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/farmer/tracking')}
              className="w-full sm:w-auto px-5 py-3 rounded-full bg-white border border-[#E8E3CF] text-xs font-bold text-[#5E524D] hover:bg-[#FAF7EE]"
            >
              Cancel
            </button>
          </div>
        </form>

      </div>
    </main>
  );
}

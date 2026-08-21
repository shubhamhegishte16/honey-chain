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
} from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { createWoolBatch } from '../../services/batches.service';
import { INDIAN_STATES, DISTRICTS_BY_STATE, WOOL_TYPES } from '../../constants/states';

export default function AddWoolBatch() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [form, setForm] = useState({
    woolType: 'Chokla',
    quantity: '',
    shearingDate: new Date().toISOString().split('T')[0],
    state: profile?.state || 'Rajasthan',
    district: profile?.district || 'Bikaner',
    farmLocation: '',
    notes: '',
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
    if (!form.woolType) e.woolType = t('selectWoolBreed', 'Select wool breed');
    if (!form.quantity || isNaN(Number(form.quantity)) || Number(form.quantity) <= 0) {
      e.quantity = t('validQtyRequired', 'Enter a valid positive quantity in kg');
    }
    if (!form.shearingDate) e.shearingDate = t('shearingDateRequired', 'Enter shearing date');
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

    const { data, error } = await createWoolBatch({
      farmerId: profile?.id,
      woolType: form.woolType,
      quantityKg: Number(form.quantity),
      shearingDate: form.shearingDate,
      state: form.state,
      district: form.district,
      farmLocation: form.farmLocation,
      notes: form.notes,
      images: [],
    });

    setLoading(false);
    if (error) {
      setSubmitError(error.message || t('failedRecordBatch', 'Failed to record wool batch. Please try again.'));
      return;
    }
    navigate(`/batches/${data.id || data._id}/details`, { replace: true });
  }

  const selectedStateObj = INDIAN_STATES.find(s => s.name === form.state);
  const stateCode = selectedStateObj?.code;
  const districts = stateCode ? DISTRICTS_BY_STATE[stateCode] || [] : [];

  return (
    <main className="page-shell max-w-3xl">
      {/* Top Breadcrumbs / Back Link */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/farmer/tracking"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-textSecondary hover:text-primary transition-colors group"
        >
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
          <span>{t('backToBatches', 'Back to My Wool')}</span>
        </Link>

        <span className="text-xs text-textMuted font-medium flex items-center gap-1">
          <Sparkles size={12} className="text-primary" /> {t('automaticQrMinting', 'Automatic QR Passport Minting')}
        </span>
      </div>

      <div className="rounded-3xl bg-surface border border-border/80 p-6 sm:p-10 shadow-card animate-enter">
        <div className="mb-8">
          <div className="eyebrow text-primary mb-1">
            <ClipboardPlus size={13} /> {t('harvestRegistration', 'Harvest Registration')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-textPrimary">
            {t('recordNewWool', 'Record New Wool Batch')}
          </h1>
          <p className="text-xs sm:text-sm text-textSecondary mt-1">
            {t('logShearingLotDetails', 'Log your shearing lot details to generate an instant tamper-evident QR code and traceability passport.')}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Section 1: Wool Breed / Variety */}
          <div className="mb-6">
            <label className="block font-bold text-sm text-textPrimary mb-2.5">
              {t('woolBreedType', 'Wool Breed / Type')} <span className="text-primary font-bold">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {WOOL_TYPES.map(breed => (
                <button
                  type="button"
                  key={breed}
                  onClick={() => update('woolType', breed)}
                  className={`px-4 py-2 rounded-2xl border text-xs font-bold transition-all duration-150 ${
                    form.woolType === breed
                      ? 'bg-primary border-primary text-white shadow-sm scale-105'
                      : 'bg-background border-border/80 text-textSecondary hover:border-primary/40'
                  }`}
                >
                  {breed}
                </button>
              ))}
            </div>
            {errors.woolType && <p className="text-error text-xs mt-1.5">{errors.woolType}</p>}
          </div>

          {/* Section 2: Weight & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 mb-2">
            <div>
              <Input
                label={t('batchQuantityKg', 'Batch Quantity (kg)')}
                id="quantity"
                type="number"
                icon={Scale}
                value={form.quantity}
                onChange={e => update('quantity', e.target.value)}
                placeholder="e.g. 180"
                error={errors.quantity}
                required
              />
              <div className="flex items-center gap-1.5 -mt-2 mb-4">
                <span className="text-[11px] text-textMuted font-medium">{t('quickAdd', 'Quick add')}:</span>
                {[50, 100, 200, 500].map(kg => (
                  <button
                    key={kg}
                    type="button"
                    onClick={() => update('quantity', String(kg))}
                    className="px-2 py-0.5 rounded-lg bg-background border border-border text-[11px] font-semibold text-textSecondary hover:border-primary/40 hover:text-primary"
                  >
                    {kg} kg
                  </button>
                ))}
              </div>
            </div>

            <Input
              label={t('shearingDate', 'Shearing Date')}
              id="shearingDate"
              type="date"
              icon={Calendar}
              value={form.shearingDate}
              onChange={e => update('shearingDate', e.target.value)}
              error={errors.shearingDate}
              required
            />
          </div>

          {/* Section 3: Location */}
          <div className="pt-4 border-t border-border/60 mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-textMuted mb-3">
              {t('originLocation', 'Origin & Location')}
            </p>

            {/* State Pills */}
            <div className="mb-3">
              <label className="block font-semibold text-xs text-textSecondary uppercase tracking-wider mb-2">
                {t('state', 'State')} <span className="text-primary font-bold">*</span>
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1 pb-1">
                {INDIAN_STATES.map(s => (
                  <button
                    type="button"
                    key={s.code}
                    onClick={() => update('state', s.name)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-150 ${
                      form.state === s.name
                        ? 'bg-primary border-primary text-white shadow-sm scale-105'
                        : 'bg-background border-border/80 text-textSecondary hover:border-primary/40'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
              {errors.state && <p className="text-error text-xs mt-1">{errors.state}</p>}
            </div>

            {/* District Pills */}
            {districts.length > 0 && (
              <div className="mt-3 mb-4">
                <label className="block font-semibold text-xs text-textSecondary uppercase tracking-wider mb-2">
                  {t('district', 'District')} <span className="text-primary font-bold">*</span>
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1 pb-1">
                  {districts.map(d => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => update('district', d)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-150 ${
                        form.district === d
                          ? 'bg-accent border-accent text-white shadow-sm scale-105 font-bold'
                          : 'bg-background border-border/80 text-textSecondary hover:border-accent/50'
                      }`}
                    >
                      <MapPin size={11} className="inline mr-1 opacity-70" />
                      {d}
                    </button>
                  ))}
                </div>
                {errors.district && <p className="text-error text-xs mt-1">{errors.district}</p>}
              </div>
            )}

            <Input
              label={`${t('farmLocation', 'Farm / Shed Location')} (Optional)`}
              id="farmLocation"
              icon={MapPin}
              value={form.farmLocation}
              onChange={e => update('farmLocation', e.target.value)}
              placeholder="e.g. Kolayat Grazing Shed #2, Bikaner Highway"
            />
          </div>

          {/* Section 4: Notes */}
          <div className="pt-4 border-t border-border/60 mb-6">
            <Input
              label={t('notesAndObservations', 'Lot Notes & Quality Observations (Optional)')}
              id="notes"
              multiline
              value={form.notes}
              onChange={e => update('notes', e.target.value)}
              placeholder="e.g. Spring clip, low vegetation matter, natural pure white color, stored in dry ventilated shed."
            />
          </div>

          {submitError && (
            <div className="p-3.5 mb-5 rounded-xl bg-errorLight/70 border border-error/20 text-error text-xs font-medium animate-fade-in">
              {submitError}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Button
              title={t('submitWool', 'Save Wool & Generate QR')}
              type="submit"
              loading={loading}
              icon={ArrowRight}
              size="lg"
              className="shadow-md"
            />
            <Button
              title={t('cancel', 'Cancel')}
              variant="text"
              onClick={() => navigate('/farmer/tracking')}
              fullWidth={false}
              className="w-full sm:w-auto"
            />
          </div>
        </form>
      </div>
    </main>
  );
}

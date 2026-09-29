import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Building2,
  Factory,
  Palette,
  Sprout,
} from 'lucide-react';
import { signUp } from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { INDIAN_STATES, DISTRICTS_BY_STATE, ROLES } from '../../constants/states';

const ROLE_DETAILS = {
  farmer: {
    icon: Sprout,
    title: 'Beekeeper / Apiary Master',
    desc: 'Record honey harvest batches, inspect hive sensors & check APMC mandi rates.',
    color: 'text-burgundy',
  },
  buyer: {
    icon: Building2,
    title: 'FMCG Buyer / Brand',
    desc: 'Source NMR-certified honey lots with cryptographic QR provenance.',
    color: 'text-burntOrange',
  },
  processor: {
    icon: Factory,
    title: 'Bottling Unit / Processor',
    desc: 'Log micro-filtration, moisture assays, and retail packaging lines.',
    color: 'text-deepBrown',
  },
  artisan: {
    icon: Palette,
    title: 'Cooperative / Value Adder',
    desc: 'Honey SHG or cooperative managing community apiary extraction.',
    color: 'text-honeyGold',
  },
};

export default function Register() {
  const navigate = useNavigate();
  const { setProfileAfterAuth } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    state: 'Himachal Pradesh',
    district: 'Kangra',
    role: 'farmer',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
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
    if (!form.name.trim()) e.name = t('fullNameRequired', 'Full name is required');
    if (!form.mobile.trim() || form.mobile.replace(/\D/g, '').length < 10) {
      e.mobile = t('validMobileRequired', 'Enter a valid 10-digit mobile number');
    }
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
      e.email = t('validEmailRequired', 'Enter a valid email address');
    }
    if (!form.password || form.password.length < 6) {
      e.password = t('passwordLengthRequired', 'Password must be at least 6 characters');
    }
    return e;
  }

  async function handleRegister(e) {
    e.preventDefault();
    setSubmitError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (!agreeTerms) {
      setSubmitError(t('agreeTermsRequired', 'Please agree to terms and conditions'));
      return;
    }

    setLoading(true);
    const { data, error } = await signUp({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      mobile: form.mobile.replace(/\D/g, ''),
      state: form.state,
      district: form.district,
      role: form.role,
    });

    if (error) {
      setLoading(false);
      setSubmitError(error.message || t('registrationFailed', 'Registration failed.'));
      return;
    }

    await setProfileAfterAuth(data.user);
    setLoading(false);
    navigate('/');
  }

  const selectedStateObj = INDIAN_STATES.find(s => s.name === form.state);
  const districtList = selectedStateObj ? DISTRICTS_BY_STATE[selectedStateObj.code] || [] : [];

  return (
    <div className="min-h-screen w-full bg-warmIvory flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans">
      <div className="w-full max-w-5xl bento-card overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-xl border border-border">
        {/* Left Showcase */}
        <div className="lg:col-span-5 bg-gradient-to-br from-burgundy via-[#681414] to-deepBrown p-8 lg:p-10 text-warmIvory flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-warmIvory/80 hover:text-honeyGold text-xs font-bold uppercase tracking-wider transition-colors group"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
              Back to Honey Chain
            </Link>

            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-honeyGold text-deepBrown grid place-items-center shadow-md">
                <span className="font-serif font-black text-xl">HC</span>
              </div>
              <div>
                <span className="text-xl font-serif font-bold text-warmIvory block">
                  Honey<span className="text-honeyGold">Chain</span>
                </span>
                <span className="text-[11px] font-mono text-honeyGold/90 uppercase tracking-wider">Join National Network</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 py-6 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-honeyGold/20 text-honeyGold text-xs font-bold border border-honeyGold/30">
              <Sparkles size={13} />
              Multi-Stakeholder Onboarding
            </span>

            <h2 className="text-2xl font-serif font-bold text-warmIvory leading-tight">
              Direct Apiary Traceability for India's Honey Mission.
            </h2>

            <p className="text-xs text-warmIvory/80 leading-relaxed">
              Register your apiary, testing laboratory, bottling plant, or FMCG procurement team in under 2 minutes.
            </p>
          </div>

          <div className="relative z-10 pt-4 border-t border-warmIvory/20 flex items-center gap-2 text-[11px] text-warmIvory/70">
            <ShieldCheck size={14} className="text-honeyGold" />
            <span>KVIC & APMC Compliant Framework</span>
          </div>
        </div>

        {/* Right Form */}
        <div className="lg:col-span-7 p-8 lg:p-10 bg-warmIvory/70 overflow-y-auto max-h-[90vh]">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-serif font-bold text-deepBrown">Create Account</h1>
              <p className="text-xs text-deepBrown/70 mt-1">Select your ecosystem role and register</p>
            </div>

            {submitError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                {submitError}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-deepBrown uppercase tracking-wider">Select Your Role</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.entries(ROLE_DETAILS).map(([key, details]) => {
                    const isSelected = form.role === key;
                    const Icon = details.icon;
                    return (
                      <button
                        type="button"
                        key={key}
                        onClick={() => update('role', key)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-burgundy text-warmIvory border-burgundy shadow-md shadow-burgundy/15'
                            : 'bg-warmIvory border-border text-deepBrown hover:bg-burntOrange/10'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon size={16} className={isSelected ? 'text-honeyGold' : details.color} />
                          <span className="font-bold text-xs">{details.title.split('/')[0]}</span>
                        </div>
                        <p className={`text-[10px] leading-tight ${isSelected ? 'text-warmIvory/80' : 'text-deepBrown/60'}`}>
                          {details.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-deepBrown uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="e.g. Ramesh Thakur"
                    className="w-full px-3.5 py-2.5 bg-warmIvory border border-border rounded-2xl text-xs text-deepBrown focus:outline-none focus:border-burgundy"
                  />
                  {errors.name && <p className="text-[10px] text-rose-700 font-bold">{errors.name}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-deepBrown uppercase tracking-wider">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={form.mobile}
                    onChange={(e) => update('mobile', e.target.value)}
                    placeholder="9816044219"
                    className="w-full px-3.5 py-2.5 bg-warmIvory border border-border rounded-2xl text-xs text-deepBrown focus:outline-none focus:border-burgundy"
                  />
                  {errors.mobile && <p className="text-[10px] text-rose-700 font-bold">{errors.mobile}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-deepBrown uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="beekeeper@apiary.in"
                  className="w-full px-3.5 py-2.5 bg-warmIvory border border-border rounded-2xl text-xs text-deepBrown focus:outline-none focus:border-burgundy"
                />
                {errors.email && <p className="text-[10px] text-rose-700 font-bold">{errors.email}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-deepBrown uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-warmIvory border border-border rounded-2xl text-xs text-deepBrown focus:outline-none focus:border-burgundy"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-deepBrown/40"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="text-[10px] text-rose-700 font-bold">{errors.password}</p>}
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-deepBrown uppercase tracking-wider">State</label>
                  <select
                    value={form.state}
                    onChange={(e) => update('state', e.target.value)}
                    className="w-full px-3 py-2.5 bg-warmIvory border border-border rounded-2xl text-xs text-deepBrown focus:outline-none focus:border-burgundy"
                  >
                    {INDIAN_STATES.map(s => <option key={s.code} value={s.name}>{s.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-deepBrown uppercase tracking-wider">District</label>
                  <select
                    value={form.district}
                    onChange={(e) => update('district', e.target.value)}
                    className="w-full px-3 py-2.5 bg-warmIvory border border-border rounded-2xl text-xs text-deepBrown focus:outline-none focus:border-burgundy"
                  >
                    {districtList.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-burgundy text-warmIvory font-bold text-xs rounded-2xl hover:bg-burgundy/90 transition-all shadow-md shadow-burgundy/15 disabled:opacity-60"
                >
                  {loading ? 'Registering on Blockchain…' : 'Complete Registration →'}
                </button>
              </div>
            </form>

            <div className="pt-4 border-t border-border/80 text-center text-xs text-deepBrown/70">
              <span>Already registered? </span>
              <Link to="/login" className="font-bold text-burgundy hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Leaf,
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Building2,
  Factory,
  Palette,
  Sprout,
} from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { signUp } from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';
import { INDIAN_STATES, DISTRICTS_BY_STATE, ROLES } from '../../constants/states';

const ROLE_DETAILS = {
  farmer: {
    icon: Sprout,
    title: 'Farmer / Producer',
    desc: 'Pastoralist, sheep breeder, or wool grower recording batches & checking mandi prices.',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    color: 'text-emerald-600',
  },
  buyer: {
    icon: Building2,
    title: 'Buyer / Mill',
    desc: 'Textile mill, exporter, or yarn spinner sourcing verified lots with QR provenance.',
    badge: 'bg-sky-50 text-sky-700 border-sky-200',
    color: 'text-sky-600',
  },
  processor: {
    icon: Factory,
    title: 'Processor / Scourer',
    desc: 'Grading facility, scouring unit, or warehouse logging processing milestones.',
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    color: 'text-amber-700',
  },
  artisan: {
    icon: Palette,
    title: 'Artisan / Weaver',
    desc: 'Handloom weaver, carpet artisan, or designer using authentic desi wool.',
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    color: 'text-purple-600',
  },
};

export default function Register() {
  const navigate = useNavigate();
  const { setProfileAfterAuth } = useAuth();
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    state: 'Rajasthan',
    district: 'Bikaner',
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
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.mobile.trim() || form.mobile.replace(/\D/g, '').length < 10) {
      e.mobile = 'Enter a valid 10-digit mobile number';
    }
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
      e.email = 'Enter a valid email address';
    }
    if (!form.password || form.password.length < 6) {
      e.password = 'Password must be at least 6 characters';
    }
    if (!form.state) e.state = 'Please select your state';
    if (!form.district) e.district = 'Please select your district';
    if (!form.role) e.role = 'Please select your user type';
    if (!agreeTerms) e.terms = 'Please accept the terms to proceed';

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleRegister(e) {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;
    setLoading(true);

    const { data, error } = await signUp(form);
    if (error) {
      setLoading(false);
      setSubmitError(error.message || 'Registration failed. Please try again.');
      return;
    }
    await setProfileAfterAuth(data.user);
    setLoading(false);
    navigate('/');
  }

  const selectedStateObj = INDIAN_STATES.find(s => s.name === form.state);
  const stateCode = selectedStateObj?.code;
  const districts = stateCode ? DISTRICTS_BY_STATE[stateCode] || [] : [];

  return (
    <div className="auth-page-split min-h-screen">
      {/* Left Showcase Panel */}
      <div className="auth-showcase-panel">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1)_0%,transparent_60%)] pointer-events-none" />
        <div className="hero-orb orb-one opacity-25" />
        <div className="hero-orb orb-two opacity-20" />

        {/* Top Header */}
        <div className="relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white text-xs font-semibold uppercase tracking-wider mb-8 transition-colors group"
          >
            <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
            Back to WoolConnect Home
          </Link>

          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-primary shadow-lg">
              <Leaf size={22} />
            </span>
            <div>
              <span className="text-2xl font-bold tracking-tight text-white block">WoolConnect</span>
              <span className="text-xs font-medium text-emerald-200">National Wool Ecosystem Platform</span>
            </div>
          </div>
        </div>

        {/* Center Showcase Content */}
        <div className="relative z-10 my-auto py-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-md mb-4 border border-white/15">
            <Sparkles size={14} className="text-amber-300" />
            Join 10,000+ Verified Pastoralists & Buyers
          </div>

          <h2 className="text-3xl xl:text-4xl font-bold tracking-tight text-white leading-tight">
            One platform connecting <br />
            <span className="text-emerald-200">every step of the wool chain.</span>
          </h2>

          <p className="mt-4 text-white/80 text-sm leading-relaxed max-w-md">
            Whether you are recording your seasonal clip in Bikaner or procuring fine merino for luxury apparel in Bengaluru, WoolConnect delivers transparency and value.
          </p>

          <div className="mt-6 space-y-2.5 max-w-md">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 border border-white/10 text-xs text-white/90">
              <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
              <span>Instant QR passport generation for every wool lot</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 border border-white/10 text-xs text-white/90">
              <CheckCircle2 size={16} className="text-amber-300 shrink-0" />
              <span>Direct APMC mandi pricing & trend intelligence</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 border border-white/10 text-xs text-white/90">
              <CheckCircle2 size={16} className="text-sky-300 shrink-0" />
              <span>Zero intermediary commission for pastoralist producers</span>
            </div>
          </div>
        </div>

        {/* Bottom Trust Note */}
        <div className="relative z-10 pt-6 border-t border-white/15 flex items-center justify-between text-xs text-white/75">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-300 shrink-0" />
            <span>Encrypted data & privacy guaranteed</span>
          </div>
          <Link to="/login" className="text-emerald-200 hover:text-white font-semibold">
            Already registered? Log in →
          </Link>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="auth-form-container">
        {/* Mobile Header */}
        <div className="w-full max-w-xl flex items-center justify-between lg:hidden mb-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-primary text-base">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-white shadow-sm">
              <Leaf size={16} />
            </span>
            WoolConnect
          </Link>
          <Link
            to="/login"
            className="text-xs font-semibold text-primary hover:text-primaryDark flex items-center gap-1"
          >
            Sign In instead →
          </Link>
        </div>

        <div className="auth-card-modern animate-enter max-w-xl">
          {/* Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary bg-primaryLight px-2.5 py-1 rounded-full mb-2">
              <Sparkles size={12} /> Free Registration
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-textPrimary">Create Account</h1>
            <p className="text-sm text-textSecondary mt-1">
              Select your role and enter your details to join WoolConnect
            </p>
          </div>

          <form onSubmit={handleRegister} noValidate>
            {/* Step 1: Role Selector */}
            <div className="mb-6">
              <label className="block font-bold text-sm text-textPrimary mb-2.5">
                Select Your Role in the Wool Chain <span className="text-primary font-bold">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ROLES.map(role => {
                  const details = ROLE_DETAILS[role.value] || ROLE_DETAILS.farmer;
                  const Icon = details.icon;
                  const isSelected = form.role === role.value;

                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => update('role', role.value)}
                      className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? 'border-primary bg-primaryLight/40 ring-2 ring-primary/30 shadow-sm'
                          : 'border-border/80 bg-surface hover:border-primary/40 hover:bg-background'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`grid h-8 w-8 place-items-center rounded-xl text-sm ${
                              isSelected ? 'bg-primary text-white' : 'bg-primaryLight text-primary'
                            }`}
                          >
                            <Icon size={16} />
                          </span>
                          <span className="font-bold text-sm text-textPrimary">{role.label}</span>
                        </div>
                        {isSelected && (
                          <CheckCircle2 size={16} className="text-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-textSecondary leading-snug">{details.desc}</p>
                    </button>
                  );
                })}
              </div>
              {errors.role && <p className="text-error text-xs mt-1.5 font-medium">{errors.role}</p>}
            </div>

            {/* Step 2: Personal Details */}
            <div className="pt-4 border-t border-border/60 mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-textMuted mb-3">
                Personal & Contact Information
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <Input
                  label="Full Name"
                  id="name"
                  name="name"
                  icon={User}
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  placeholder="e.g. Ramesh Gurjar"
                  error={errors.name}
                  autoComplete="name"
                  required
                />

                <Input
                  label="Mobile Number"
                  type="tel"
                  id="mobile"
                  name="mobile"
                  icon={Phone}
                  value={form.mobile}
                  onChange={e => update('mobile', e.target.value)}
                  placeholder="10-digit mobile"
                  error={errors.mobile}
                  autoComplete="tel"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <Input
                  label="Email Address"
                  type="email"
                  id="email"
                  name="email"
                  icon={Mail}
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  placeholder="you@domain.com"
                  error={errors.email}
                  autoComplete="email"
                  required
                />

                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  icon={Lock}
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  placeholder="Min. 6 characters"
                  error={errors.password}
                  autoComplete="new-password"
                  required
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-textMuted hover:text-textPrimary p-1 focus:outline-none"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />
              </div>
            </div>

            {/* Step 3: Location Selection */}
            <div className="pt-4 border-t border-border/60 mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-textMuted mb-3">
                Location & Region
              </p>

              {/* State Pills */}
              <div className="mb-3">
                <label className="block font-semibold text-xs text-textSecondary uppercase tracking-wider mb-2">
                  State <span className="text-primary font-bold">*</span>
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
                          : 'bg-surface border-border/80 text-textSecondary hover:border-primary/40 hover:text-textPrimary'
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
                {errors.state && <p className="text-error text-xs mt-1 font-medium">{errors.state}</p>}
              </div>

              {/* District Pills */}
              {districts.length > 0 && (
                <div className="mt-3">
                  <label className="block font-semibold text-xs text-textSecondary uppercase tracking-wider mb-2">
                    District in {form.state} <span className="text-primary font-bold">*</span>
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
                            : 'bg-surface border-border/80 text-textSecondary hover:border-accent/50'
                        }`}
                      >
                        <MapPin size={11} className="inline mr-1 opacity-70" />
                        {d}
                      </button>
                    ))}
                  </div>
                  {errors.district && <p className="text-error text-xs mt-1 font-medium">{errors.district}</p>}
                </div>
              )}
            </div>

            {/* Terms checkbox */}
            <div className="mb-5">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-textSecondary select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer accent-primary shrink-0"
                />
                <span>
                  I agree to the WoolConnect{' '}
                  <span className="font-semibold text-textPrimary underline">Terms of Service</span> and{' '}
                  <span className="font-semibold text-textPrimary underline">Data Privacy Policy</span>.
                </span>
              </label>
              {errors.terms && <p className="text-error text-xs mt-1 font-medium">{errors.terms}</p>}
            </div>

            {/* Submit Error */}
            {submitError && (
              <div className="flex items-start gap-2.5 p-3.5 mb-5 rounded-xl bg-errorLight/70 border border-error/20 animate-fade-in">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-error shrink-0 mt-0.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-error text-xs font-medium leading-relaxed">{submitError}</p>
              </div>
            )}

            <Button
              title="Create Account & Enter Platform"
              type="submit"
              loading={loading}
              icon={ArrowRight}
              size="lg"
              className="mt-2 shadow-md hover:shadow-lg transition-all"
            />

            {/* Switch to login */}
            <div className="text-center mt-6 pt-5 border-t border-border/60">
              <p className="text-sm text-textSecondary">
                Already registered?{' '}
                <Link
                  to="/login"
                  className="font-bold text-primary hover:text-primaryDark transition-colors inline-flex items-center gap-1 group"
                >
                  Sign in here
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </p>
            </div>
          </form>
        </div>

        <p className="mt-8 text-center text-xs text-textMuted max-w-md">
          Zero signup fee. Instant access to live mandi rates, lot registration, and buyer networking.
        </p>
      </div>
    </div>
  );
}

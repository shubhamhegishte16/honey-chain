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
    desc: 'Pastoralist or wool grower recording batches & checking mandi prices.',
    color: 'text-emerald-600',
  },
  buyer: {
    icon: Building2,
    title: 'Buyer / Mill',
    desc: 'Mill, exporter, or spinner sourcing verified lots with QR provenance.',
    color: 'text-sky-600',
  },
  processor: {
    icon: Factory,
    title: 'Processor / Scourer',
    desc: 'Grading facility or warehouse logging processing milestones.',
    color: 'text-amber-700',
  },
  artisan: {
    icon: Palette,
    title: 'Artisan / Weaver',
    desc: 'Handloom weaver or designer using authentic desi wool.',
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
    <div className="min-h-screen w-full bg-background flex items-stretch justify-center">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row lg:shadow-2xl lg:my-auto lg:rounded-3xl lg:overflow-hidden lg:min-h-[640px]">
        {/* Left Showcase Panel */}
        <div className="auth-showcase-panel hidden lg:flex lg:w-[42%] lg:shrink-0 flex-col relative overflow-hidden p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1)_0%,transparent_60%)] pointer-events-none" />
          <div className="hero-orb orb-one opacity-25" />
          <div className="hero-orb orb-two opacity-20" />

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
              Whether you are recording your seasonal clip in Bikaner or procuring fine merino in Bengaluru, WoolConnect delivers transparency and value.
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
        <div className="flex-1 flex flex-col items-center bg-surface lg:bg-white px-4 py-8 sm:px-8 lg:px-12 overflow-y-auto">
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

          <div className="w-full max-w-xl">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Create Account</h1>
              <p className="text-sm text-textSecondary mt-1">
                Select your role and enter your details to join WoolConnect
              </p>
            </div>

            <form onSubmit={handleRegister} noValidate>
              {/* Role Selector — compact single-row pills instead of 4 large cards */}
              <div className="mb-5">
                <label className="block font-semibold text-xs text-textSecondary uppercase tracking-wider mb-2">
                  Your Role <span className="text-primary font-bold">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ROLES.map(role => {
                    const details = ROLE_DETAILS[role.value] || ROLE_DETAILS.farmer;
                    const Icon = details.icon;
                    const isSelected = form.role === role.value;

                    return (
                      <button
                        key={role.value}
                        type="button"
                        title={details.desc}
                        onClick={() => update('role', role.value)}
                        className={`p-2.5 rounded-xl border text-center transition-all duration-150 flex flex-col items-center gap-1.5 ${
                          isSelected
                            ? 'border-primary bg-primaryLight/40 ring-2 ring-primary/30 shadow-sm'
                            : 'border-border/80 bg-surface hover:border-primary/40 hover:bg-background'
                        }`}
                      >
                        <span
                          className={`grid h-8 w-8 place-items-center rounded-lg ${
                            isSelected ? 'bg-primary text-white' : 'bg-primaryLight text-primary'
                          }`}
                        >
                          <Icon size={15} />
                        </span>
                        <span className="font-semibold text-[11px] text-textPrimary leading-tight">
                          {role.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {errors.role && <p className="text-error text-xs mt-1.5 font-medium">{errors.role}</p>}
              </div>

              {/* Personal Details */}
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

              {/* Location — dropdowns instead of pill walls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 mb-5">
                <div>
                  <label htmlFor="state" className="block font-semibold text-xs text-textSecondary uppercase tracking-wider mb-1.5">
                    State <span className="text-primary font-bold">*</span>
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={form.state}
                    onChange={e => update('state', e.target.value)}
                    className="w-full rounded-xl border border-border/80 bg-surface px-3 py-2.5 text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  >
                    {INDIAN_STATES.map(s => (
                      <option key={s.code} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {errors.state && <p className="text-error text-xs mt-1 font-medium">{errors.state}</p>}
                </div>

                {districts.length > 0 && (
                  <div>
                    <label htmlFor="district" className="block font-semibold text-xs text-textSecondary uppercase tracking-wider mb-1.5">
                      District <span className="text-primary font-bold">*</span>
                    </label>
                    <select
                      id="district"
                      name="district"
                      value={form.district}
                      onChange={e => update('district', e.target.value)}
                      className="w-full rounded-xl border border-border/80 bg-surface px-3 py-2.5 text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    >
                      {districts.map(d => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
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
                className="mt-1 shadow-md hover:shadow-lg transition-all w-full"
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
    </div>
  );
}
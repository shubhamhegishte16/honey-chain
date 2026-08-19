import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Leaf,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  QrCode,
  TrendingUp,
  Award,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { signIn } from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';

const DEMO_ACCOUNTS = [
  {
    role: 'farmer',
    label: 'Farmer',
    email: 'ramesh.farmer@example.com',
    desc: 'Rajasthan Chokla Producer',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: '🌾',
  },
  {
    role: 'buyer',
    label: 'Buyer / Mill',
    email: 'anita.buyer@example.com',
    desc: 'Textile Sourcing Partner',
    badge: 'bg-sky-50 text-sky-700 border-sky-200',
    icon: '🏢',
  },
  {
    role: 'processor',
    label: 'Processor',
    email: 'karan.processor@example.com',
    desc: 'Grading & Scouring Facility',
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: '🏭',
  },
  {
    role: 'artisan',
    label: 'Artisan',
    email: 'meera.artisan@example.com',
    desc: 'Kullu Shawl Weaver',
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: '🎨',
  },
  {
    role: 'admin',
    label: 'Admin',
    email: 'admin@woolconnect.in',
    desc: 'Platform Administrator',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: '⚡',
  },
];

export default function Login() {
  const navigate = useNavigate();
  const { setProfileAfterAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    const { data, error: signInError } = await signIn({ email, password });
    if (signInError) {
      setLoading(false);
      setError(signInError.message || 'Login failed. Please check your credentials.');
      return;
    }
    await setProfileAfterAuth(data.user);
    setLoading(false);
    navigate('/');
  }

  function fillDemo(account) {
    setEmail(account.email);
    setPassword('password123');
    setSelectedDemo(account.role);
    setError('');
  }

  return (
    <div className="auth-page-split min-h-screen">
      {/* Left Showcase Panel (Desktop & Tablet) */}
      <div className="auth-showcase-panel">
        {/* Background decorative layers */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12)_0%,transparent_60%)] pointer-events-none" />
        <div className="hero-orb orb-one opacity-30" />
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
              <span className="text-xs font-medium text-emerald-200">India's Wool Traceability Network</span>
            </div>
          </div>
        </div>

        {/* Center Showcase Content */}
        <div className="relative z-10 my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-md mb-5 border border-white/15">
            <Sparkles size={14} className="text-amber-300" />
            Verified Pastoralist & Buyer Marketplace
          </div>

          <h2 className="text-3xl xl:text-4xl font-bold tracking-tight text-white leading-tight">
            Fair value for every fleece, <br />
            <span className="text-emerald-200">full provenance for every thread.</span>
          </h2>

          <p className="mt-4 text-white/80 text-sm xl:text-base leading-relaxed max-w-md">
            Connect directly with verified pastoralists, track lots with QR-verified digital passports, and stay ahead with real-time APMC mandi intelligence.
          </p>

          {/* Key Value Cards */}
          <div className="mt-8 grid grid-cols-2 gap-3 max-w-md">
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs mb-1">
                <QrCode size={16} /> QR Traceability
              </div>
              <p className="text-xs text-white/75">From sheep shearing flock to finished textiles.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs mb-1">
                <TrendingUp size={16} /> Mandi Rates
              </div>
              <p className="text-xs text-white/75">Live market prices across 8 major Indian states.</p>
            </div>
          </div>
        </div>

        {/* Bottom Trust Quote */}
        <div className="relative z-10 pt-6 border-t border-white/15 flex items-center justify-between text-xs text-white/75">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-300 shrink-0" />
            <span>Government & APMC standard aligned</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-white">
            <Award size={15} className="text-amber-300" />
            <span>ISO 9001 Compliant</span>
          </div>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="auth-form-container">
        {/* Mobile Top Navigation */}
        <div className="w-full max-w-md flex items-center justify-between lg:hidden mb-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-primary text-base">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-white shadow-sm">
              <Leaf size={16} />
            </span>
            WoolConnect
          </Link>
          <Link
            to="/"
            className="text-xs font-semibold text-textSecondary hover:text-primary flex items-center gap-1"
          >
            <ArrowLeft size={14} /> Back Home
          </Link>
        </div>

        <div className="auth-card-modern animate-enter max-w-md">
          {/* Header */}
          <div className="mb-6">
            <div className="inline-flex lg:hidden items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary bg-primaryLight px-2.5 py-1 rounded-full mb-3">
              <Sparkles size={12} /> Indian Wool Network
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Sign In</h1>
            <p className="text-sm text-textSecondary mt-1">
              Access your batches, mandi prices, and wool orders
            </p>
          </div>

          {/* Quick Demo Switcher */}
          <div className="mb-6 p-3.5 rounded-2xl bg-background/80 border border-border/80">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-textPrimary flex items-center gap-1.5 uppercase tracking-wide">
                <Sparkles size={13} className="text-accent" /> 1-Click Demo Login
              </span>
              <span className="text-[11px] text-textMuted font-medium">Click any role to autofill</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {DEMO_ACCOUNTS.map(account => {
                const isSelected = selectedDemo === account.role;
                return (
                  <button
                    key={account.role}
                    type="button"
                    onClick={() => fillDemo(account)}
                    className={`px-2 py-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all duration-200 ${
                      isSelected
                        ? `${account.badge} shadow-sm ring-2 ring-primary/30 scale-105 font-bold`
                        : 'bg-surface border-border/70 text-textSecondary hover:border-primary/40 hover:bg-primaryLight/30'
                    }`}
                    title={account.desc}
                  >
                    <span className="text-base leading-none">{account.icon}</span>
                    <span className="truncate text-[11px] capitalize">{account.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
            {selectedDemo && (
              <p className="mt-2 text-[11px] text-primary flex items-center gap-1 font-medium">
                <CheckCircle2 size={12} /> Auto-filled demo credentials for{' '}
                <strong className="capitalize">{selectedDemo}</strong>
              </p>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} noValidate>
            <Input
              label="Email Address"
              type="email"
              id="email"
              name="email"
              icon={Mail}
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                setSelectedDemo(null);
              }}
              placeholder="name@company.com"
              autoComplete="email"
              required
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              icon={Lock}
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                setSelectedDemo(null);
              }}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-textMuted hover:text-textPrimary p-1 transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs mb-5 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-textSecondary font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4 rounded-md cursor-pointer accent-primary"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => alert('For this demo platform, all demo passwords are: password123')}
                className="text-primary hover:text-primaryDark font-semibold transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Error Message */}
            {error && (
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
                <p className="text-error text-xs font-medium leading-relaxed">{error}</p>
              </div>
            )}

            <Button
              title="Sign In to Dashboard"
              type="submit"
              loading={loading}
              icon={ArrowRight}
              size="lg"
              className="mt-1 shadow-md hover:shadow-lg transition-all"
            />

            {/* Footer switch to register */}
            <div className="text-center mt-6 pt-5 border-t border-border/60">
              <p className="text-sm text-textSecondary">
                New to WoolConnect?{' '}
                <Link
                  to="/register"
                  className="font-bold text-primary hover:text-primaryDark transition-colors inline-flex items-center gap-1 group"
                >
                  Create an account
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Mobile bottom info */}
        <p className="mt-8 text-center text-xs text-textMuted max-w-sm">
          Secure, encrypted authentication aligned with Ministry of Textiles & APMC guidelines.
        </p>
      </div>
    </div>
  );
}

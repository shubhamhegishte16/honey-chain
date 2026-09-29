import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
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
  ArrowLeft,
} from 'lucide-react';
import { signIn } from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function Login() {
  const navigate = useNavigate();
  const { setProfileAfterAuth } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError(t('pleaseEnterEmailPass', 'Please enter your email and password.'));
      return;
    }
    setLoading(true);
    const { data, error: signInError } = await signIn({ email, password });
    if (signInError) {
      setLoading(false);
      setError(signInError.message || t('loginFailedCheck', 'Login failed. Please check your credentials.'));
      return;
    }
    await setProfileAfterAuth(data.user);
    setLoading(false);
    navigate('/');
  }

  return (
    <div className="min-h-screen w-full bg-warmIvory flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans">
      <div className="w-full max-w-5xl bento-card overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-xl border border-border">
        {/* Left Showcase Panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-burgundy via-[#681414] to-deepBrown p-8 lg:p-10 text-warmIvory flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-honeyGold/20 blur-2xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-burntOrange/20 blur-2xl pointer-events-none" />

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
                <span className="text-[11px] font-mono text-honeyGold/90 uppercase tracking-wider">SIH26021 • KVIC Portal</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 py-8 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-honeyGold/20 text-honeyGold text-xs font-bold border border-honeyGold/30">
              <Sparkles size={13} />
              National Blockchain Registry
            </span>

            <h2 className="text-2xl xl:text-3xl font-serif font-bold text-warmIvory leading-tight">
              Pure by Nature, <br />
              <span className="text-honeyGold">Verified by Technology.</span>
            </h2>

            <p className="text-xs text-warmIvory/80 leading-relaxed max-w-sm">
              Single-sign-on access for Apiary Beekeepers, Refiners, NABL Testing Labs, FMCG Buyers, and KVIC Auditors.
            </p>
          </div>

          <div className="relative z-10 pt-4 border-t border-warmIvory/20 flex items-center gap-2 text-[11px] text-warmIvory/70">
            <ShieldCheck size={14} className="text-honeyGold" />
            <span>256-bit Encrypted Session Security</span>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-center bg-warmIvory/70">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-serif font-bold text-deepBrown">Welcome Back</h1>
              <p className="text-xs text-deepBrown/70 mt-1">Sign in to your Honey Chain account</p>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold animate-enter">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-deepBrown uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-deepBrown/40" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="beekeeper@apiary.in"
                    className="w-full pl-11 pr-4 py-3 bg-warmIvory border border-border rounded-2xl text-xs text-deepBrown font-medium focus:outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/15 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-deepBrown uppercase tracking-wider">Password</label>
                  <Link to="/forgot-password" className="text-[11px] font-bold text-burgundy hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-deepBrown/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-11 pr-11 py-3 bg-warmIvory border border-border rounded-2xl text-xs text-deepBrown font-medium focus:outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-deepBrown/40 hover:text-deepBrown"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none text-deepBrown/80">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-burgundy focus:ring-burgundy"
                  />
                  <span>Remember my session</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-burgundy text-warmIvory font-bold text-xs rounded-2xl hover:bg-burgundy/90 transition-all shadow-md shadow-burgundy/15 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? 'Authenticating…' : 'Sign In to Portal →'}
              </button>
            </form>

            <div className="pt-4 border-t border-border/80 text-center text-xs text-deepBrown/70">
              <span>Don't have an account yet? </span>
              <Link to="/register" className="font-bold text-burgundy hover:underline">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
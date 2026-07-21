'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthContext } from '@/context/AuthContext';

function validateEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address.';
}
function validatePassword(v) {
  return v.length >= 8 ? '' : 'Password must be at least 8 characters.';
}
function validateName(v) {
  return v.trim().length >= 2 ? '' : 'Enter your full name.';
}

function EyeIcon({ visible }) {
  return visible ? (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
    </svg>
  );
}

function Field({ label, id, type = 'text', value, onChange, onBlur, error, touched, placeholder, rightSlot }) {
  const isValid = touched && !error && value;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={id}
          className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 pr-10 ${
            touched && error
              ? 'border-red-300 focus:ring-red-200 bg-red-50'
              : isValid
                ? 'border-green-400 focus:ring-green-200 bg-green-50'
                : 'border-gray-200 focus:ring-orange-200 focus:border-orange-400 bg-white'
          }`}
        />
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {rightSlot}
          {touched && error && (
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          )}
          {isValid && !rightSlot && (
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
            </svg>
          )}
        </div>
      </div>
      {touched && error && (
        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  );
}

function PasswordStrength({ password }) {
  if (!password) return null;
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500'];
  const textColors = ['', 'text-red-500', 'text-yellow-600', 'text-blue-600', 'text-green-600'];

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= score ? colors[score] : 'bg-gray-200'}`} />
        ))}
      </div>
      {score > 0 && (
        <p className={`text-xs font-medium ${textColors[score]}`}>{labels[score]} password</p>
      )}
    </div>
  );
}

function SocialButton({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] transition-all"
    >
      {icon}
      {label}
    </button>
  );
}

function SignInForm({ onSuccess }) {
  const { login } = useAuthContext();
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [remember, setRemember]   = useState(false);
  const [touched, setTouched]     = useState({});
  const [loading, setLoading]     = useState(false);
  const [serverError, setServerError] = useState('');

  const errors = {
    email: validateEmail(email),
    password: password.length === 0 ? 'Password is required.' : '',
  };
  const valid = !errors.email && !errors.password;

  function touch(field) {
    setTouched(t => ({ ...t, [field]: true }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!valid) return;
    setLoading(true);
    setServerError('');

    await new Promise(r => setTimeout(r, 900));

    const userData = {
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      email,
    };
    login(userData);
    setLoading(false);
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field
        label="Email address" id="email" type="email"
        value={email} onChange={e => setEmail(e.target.value)} onBlur={() => touch('email')}
        error={errors.email} touched={touched.email} placeholder="you@example.com"
      />
      <Field
        label="Password" id="password" type={showPw ? 'text' : 'password'}
        value={password} onChange={e => setPassword(e.target.value)} onBlur={() => touch('password')}
        error={errors.password} touched={touched.password} placeholder="Your password"
        rightSlot={
          <button type="button" onClick={() => setShowPw(v => !v)} className="text-gray-400 hover:text-gray-600 transition-colors">
            <EyeIcon visible={showPw} />
          </button>
        }
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
            className="w-4 h-4 rounded accent-orange-500" />
          <span className="text-sm text-gray-600">Remember me</span>
        </label>
        <Link href="/auth/reset-password" className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors">
          Forgot password?
        </Link>
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
          {serverError}
        </div>
      )}

      <button type="submit" disabled={loading}
        className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
        style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Signing in…
          </>
        ) : 'Sign In'}
      </button>
    </form>
  );
}

function RegisterForm({ onSuccess }) {
  const { register } = useAuthContext();
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [showCf, setShowCf]       = useState(false);
  const [touched, setTouched]     = useState({});
  const [loading, setLoading]     = useState(false);

  const errors = {
    name: validateName(name),
    email: validateEmail(email),
    password: validatePassword(password),
    confirm: confirm !== password ? 'Passwords do not match.' : '',
  };
  const valid = Object.values(errors).every(e => !e);

  function touch(field) {
    setTouched(t => ({ ...t, [field]: true }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirm: true });
    if (!valid) return;
    setLoading(true);

    await new Promise(r => setTimeout(r, 900));

    register({ name, email });
    setLoading(false);
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field
        label="Full name" id="name"
        value={name} onChange={e => setName(e.target.value)} onBlur={() => touch('name')}
        error={errors.name} touched={touched.name} placeholder="Alex Johnson"
      />
      <Field
        label="Email address" id="email" type="email"
        value={email} onChange={e => setEmail(e.target.value)} onBlur={() => touch('email')}
        error={errors.email} touched={touched.email} placeholder="you@example.com"
      />
      <div>
        <Field
          label="Password" id="password" type={showPw ? 'text' : 'password'}
          value={password} onChange={e => setPassword(e.target.value)} onBlur={() => touch('password')}
          error={errors.password} touched={touched.password} placeholder="Min. 8 characters"
          rightSlot={
            <button type="button" onClick={() => setShowPw(v => !v)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <EyeIcon visible={showPw} />
            </button>
          }
        />
        <PasswordStrength password={password} />
      </div>
      <Field
        label="Confirm password" id="confirm" type={showCf ? 'text' : 'password'}
        value={confirm} onChange={e => setConfirm(e.target.value)} onBlur={() => touch('confirm')}
        error={errors.confirm} touched={touched.confirm} placeholder="Repeat password"
        rightSlot={
          <button type="button" onClick={() => setShowCf(v => !v)} className="text-gray-400 hover:text-gray-600 transition-colors">
            <EyeIcon visible={showCf} />
          </button>
        }
      />

      <p className="text-xs text-gray-400">
        By creating an account you agree to our{' '}
        <Link href="/terms" className="text-orange-500 hover:underline">Terms of Service</Link>
        {' '}and{' '}
        <Link href="/privacy" className="text-orange-500 hover:underline">Privacy Policy</Link>.
      </p>

      <button type="submit" disabled={loading}
        className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
        style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Creating account…
          </>
        ) : 'Create Account'}
      </button>
    </form>
  );
}

function SuccessScreen({ mode, name, redirectTo }) {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => router.push(redirectTo || '/'), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">
        {mode === 'register' ? 'Welcome to GlobalTech!' : `Welcome back${name ? `, ${name.split(' ')[0]}` : ''}!`}
      </h2>
      <p className="text-sm text-gray-500">
        {mode === 'register' ? 'Your account is ready.' : 'You're signed in.'} Redirecting…
      </p>
      <div className="mt-4 w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full animate-[width_1.8s_linear]"
          style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)', animation: 'progress 1.8s linear forwards' }}>
        </div>
      </div>
      <style>{`@keyframes progress { from { width: 0% } to { width: 100% } }`}</style>
    </div>
  );
}

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthContext();

  const redirectTo = searchParams?.get('redirect') || '/';
  const initialMode = searchParams?.get('mode') === 'register' ? 'register' : 'login';

  const [mode, setMode]       = useState(initialMode);
  const [done, setDone]       = useState(false);
  const [doneUser, setDoneUser] = useState(null);

  useEffect(() => {
    if (user) router.replace(redirectTo);
  }, [user]);

  function handleSuccess() {
    const stored = localStorage.getItem('globaltech_user');
    try { setDoneUser(JSON.parse(stored)); } catch {}
    setDone(true);
  }

  if (done) {
    return <SuccessScreen mode={mode} name={doneUser?.name} redirectTo={redirectTo} />;
  }

  const googleIcon = (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );

  const appleIcon = (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">

        
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
              GT
            </div>
            <span className="text-xl font-bold text-gray-900">GlobalTech</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {mode === 'login'
              ? 'Welcome back — we missed you!'
              : 'Join millions of tech shoppers worldwide'}
          </p>
        </div>

        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            {[
              { key: 'login',    label: 'Sign In' },
              { key: 'register', label: 'Register' },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setMode(key)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  mode === key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}>
                {label}
              </button>
            ))}
          </div>

          
          <div className="space-y-2.5 mb-5">
            <SocialButton icon={googleIcon} label="Continue with Google" onClick={() => {}} />
            <SocialButton icon={appleIcon} label="Continue with Apple" onClick={() => {}} />
          </div>

          
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200"/>
            <span className="text-xs text-gray-400 font-medium">or continue with email</span>
            <div className="flex-1 h-px bg-gray-200"/>
          </div>

          
          {mode === 'login'
            ? <SignInForm onSuccess={handleSuccess} />
            : <RegisterForm onSuccess={handleSuccess} />
          }

          
          <p className="text-center text-sm text-gray-500 mt-5">
            {mode === 'login' ? (
              <>Don't have an account?{' '}
                <button onClick={() => setMode('register')} className="text-orange-500 hover:text-orange-600 font-semibold transition-colors">
                  Create one
                </button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button onClick={() => setMode('login')} className="text-orange-500 hover:text-orange-600 font-semibold transition-colors">
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>

        
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          {[
            { icon: '🎁', label: 'Exclusive deals' },
            { icon: '📦', label: 'Order tracking' },
            { icon: '↩️', label: 'Easy returns' },
          ].map(({ icon, label }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
              <div className="text-xl mb-1">{icon}</div>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
            </div>
          ))}
        </div>

        
        {redirectTo !== '/' && (
          <div className="mt-4 flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
            <svg className="w-4 h-4 text-orange-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p className="text-xs text-orange-700">
              Sign in to continue — you'll be redirected back to{' '}
              <span className="font-semibold">{redirectTo}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin"/>
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}

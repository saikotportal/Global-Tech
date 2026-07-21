'use client';
import { useState, useEffect } from 'react';
import { useCartContext } from '@/context/CartContext';
import { useToastContext } from '@/context/ToastContext';
import { useAuthContext } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCurrency } from '@/context/CurrencyContext';
import { validateCoupon, calcDiscount, couponFreesShipping } from '@/lib/coupons';

const STEPS = ['Shipping', 'Payment', 'Confirmation'];

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center mb-10">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                i < current ? 'bg-green-500 text-white' :
                i === current ? 'text-white' :
                'bg-gray-200 text-gray-500'
              }`}
              style={i === current ? { background: 'linear-gradient(135deg,#e8517a,#f4874b)' } : {}}
            >
              {i < current ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                </svg>
              ) : i + 1}
            </div>
            <span className={`text-xs mt-1 font-medium ${i === current ? 'text-orange-500' : i < current ? 'text-green-500' : 'text-gray-400'}`}>{step}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-20 h-0.5 mx-2 mb-5 transition-all duration-500 ${i < current ? 'bg-green-500' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function Spinner({ size = 8 }) {
  return (
    <svg className={`animate-spin w-${size} h-${size}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  );
}

const PROCESSING_STEPS = [
  { label: 'Verifying your order',       icon: '🔍', duration: 1200 },
  { label: 'Securing payment details',   icon: '🔒', duration: 1400 },
  { label: 'Confirming with merchant',   icon: '🏪', duration: 1100 },
  { label: 'Preparing your shipment',    icon: '📦', duration: 900  },
  { label: 'Order confirmed!',           icon: '✅', duration: 600  },
];

function PlacingOrderScreen({ onDone }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    let stepIndex = 0;
    function advance() {
      if (stepIndex >= PROCESSING_STEPS.length) { setTimeout(onDone, 600); return; }
      const step = PROCESSING_STEPS[stepIndex];
      setCurrentStep(stepIndex);
      setTimeout(() => {
        setCompletedSteps(prev => [...prev, stepIndex]);
        stepIndex++;
        advance();
      }, step.duration);
    }
    advance();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="relative w-28 h-28 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-gray-100"/>
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" fill="none" stroke="url(#grad)" strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 46}`}
            strokeDashoffset={`${2 * Math.PI * 46 * (1 - (completedSteps.length / PROCESSING_STEPS.length))}`}
            className="transition-all duration-700"
          />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e8517a"/>
              <stop offset="100%" stopColor="#f4874b"/>
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl transition-all duration-300">
            {completedSteps.length >= PROCESSING_STEPS.length ? '🎉' : PROCESSING_STEPS[currentStep]?.icon}
          </span>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-1">Placing your order…</h2>
      <p className="text-gray-400 text-sm mb-10">Please don't close this page</p>

      <div className="w-full max-w-sm space-y-3">
        {PROCESSING_STEPS.map((s, i) => {
          const done = completedSteps.includes(i);
          const active = currentStep === i && !done;
          return (
            <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-400 ${
              done ? 'bg-green-50' : active ? 'bg-orange-50 shadow-sm' : 'bg-gray-50'
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                done ? 'bg-green-500' : active ? '' : 'bg-gray-200'
              }`} style={active ? { background: 'linear-gradient(135deg,#e8517a,#f4874b)' } : {}}>
                {done ? (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                  </svg>
                ) : active ? <Spinner size={3} /> : <span className="w-2 h-2 rounded-full bg-gray-400 block"/>}
              </div>
              <span className={`text-sm font-medium transition-colors ${
                done ? 'text-green-700' : active ? 'text-orange-600' : 'text-gray-400'
              }`}>{s.label}</span>
              {active && <span className="ml-auto"><Spinner size={4} /></span>}
              {done && <span className="ml-auto text-green-400 text-xs font-semibold">Done</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AuthGate({ onContinueAsGuest }) {
  const router = useRouter();
  return (
    <div className="py-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">How would you like to continue?</h2>
      <p className="text-sm text-gray-500 mb-6">Sign in to track your order, earn rewards, and check out faster next time.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        
        <button
          onClick={() => router.push('/auth?redirect=/checkout')}
          className="group flex flex-col items-start p-5 rounded-2xl border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-all text-left"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all"
            style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <p className="font-semibold text-gray-800 text-sm mb-1">Sign in / Register</p>
          <p className="text-xs text-gray-500">Track orders, earn rewards & faster checkout</p>
        </button>

        
        <button
          onClick={onContinueAsGuest}
          className="group flex flex-col items-start p-5 rounded-2xl border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center mb-3 group-hover:bg-gray-300 transition-all">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <p className="font-semibold text-gray-800 text-sm mb-1">Continue as Guest</p>
          <p className="text-xs text-gray-500">Quick checkout, no account needed</p>
        </button>
      </div>

      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
        <span className="text-lg">🎁</span>
        <p className="text-xs text-blue-700">Members get exclusive promo codes, early access to deals, and free returns.</p>
      </div>
    </div>
  );
}

function PromoCodeField({ subtotal, appliedCoupon, appliedCode, onApply, onRemove }) {
  const [open, setOpen]       = useState(!!appliedCoupon);
  const [input, setInput]     = useState(appliedCode || '');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (appliedCode) { setInput(appliedCode); setOpen(true); }
  }, [appliedCode]);

  function handleApply() {
    setError('');
    setSuccess('');
    if (!input.trim()) { setError('Please enter a promo code.'); return; }
    setLoading(true);

    setTimeout(() => {
      const result = validateCoupon(input, subtotal);
      setLoading(false);
      if (result.valid) {
        setSuccess(result.coupon.label);
        onApply(result.code, result.coupon);
      } else {
        setError(result.error);
      }
    }, 600);
  }

  function handleRemove() {
    setInput('');
    setError('');
    setSuccess('');
    onRemove();
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') { e.preventDefault(); handleApply(); }
  }

  return (
    <div className="border-t pt-4 mt-2">
      
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"/>
          </svg>
          Have a promo code?
        </button>
      ) : (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"/>
            </svg>
            Promo Code
          </p>

          
          {appliedCoupon ? (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                </svg>
                <div>
                  <p className="text-sm font-semibold text-green-700">{appliedCode}</p>
                  <p className="text-xs text-green-600">{appliedCoupon.label}</p>
                </div>
              </div>
              <button
                onClick={handleRemove}
                className="text-gray-400 hover:text-red-400 transition-colors ml-2"
                title="Remove coupon"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => { setInput(e.target.value.toUpperCase()); setError(''); setSuccess(''); }}
                onKeyDown={handleKeyDown}
                placeholder="e.g. SAVE10"
                className={`flex-1 border rounded-xl px-3 py-2.5 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 transition ${
                  error ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-orange-300'
                }`}
              />
              <button
                onClick={handleApply}
                disabled={loading || !input.trim()}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90 active:scale-95 disabled:opacity-50 flex items-center gap-1.5 min-w-[80px] justify-center"
                style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}
              >
                {loading ? <Spinner size={4} /> : 'Apply'}
              </button>
            </div>
          )}

          
          {error && (
            <p className="flex items-center gap-1.5 text-xs text-red-600 animate-fade-in">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {error}
            </p>
          )}

          
          {!appliedCoupon && (
            <button onClick={() => { setOpen(false); setError(''); }} className="text-xs text-gray-400 hover:text-gray-500 transition-colors">
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ShippingStep({ data, onChange, onNext }) {
  const fields = [
    { id: 'firstName', label: 'First Name', half: true },
    { id: 'lastName',  label: 'Last Name',  half: true },
    { id: 'address',   label: 'Address',    half: false },
    { id: 'city',      label: 'City',       half: true },
    { id: 'zip',       label: 'ZIP Code',   half: true },
    { id: 'phone',     label: 'Phone',      half: false },
  ];

  const handleSubmit = (e) => { e.preventDefault(); onNext(); };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Shipping Information</h2>
      <div className="grid grid-cols-2 gap-4">
        {fields.map(({ id, label, half }) => (
          <div key={id} className={half ? '' : 'col-span-2'}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input type="text" required value={data[id] || ''} onChange={(e) => onChange(id, e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition" />
          </div>
        ))}
      </div>
      <div className="mt-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Option</label>
        {['Standard (3-5 days) — Free', 'Express (1-2 days) — $9.99', 'Same-day (Today) — $19.99'].map((opt) => (
          <label key={opt} className="flex items-center gap-3 mb-2 cursor-pointer p-3 rounded-xl border border-gray-200 hover:border-orange-300 transition">
            <input type="radio" name="delivery" value={opt} checked={data.delivery === opt}
              onChange={(e) => onChange('delivery', e.target.value)} className="accent-orange-500" />
            <span className="text-sm text-gray-700">{opt}</span>
          </label>
        ))}
      </div>
      <button type="submit" className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 mt-4"
        style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
        Continue to Payment →
      </button>
    </form>
  );
}

function PaymentStep({ onNext, onBack }) {
  const [method, setMethod] = useState('card');
  const handleSubmit = (e) => { e.preventDefault(); onNext(); };

  const METHODS = [
    { id: 'card', label: 'Credit Card', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
      </svg>
    )},
    { id: 'paypal', label: 'PayPal', icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
      </svg>
    )},
    { id: 'cod', label: 'Cash on Delivery', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
      </svg>
    )},
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment Method</h2>
      <div className="flex gap-3 mb-6">
        {METHODS.map(({ id, label, icon }) => (
          <button key={id} type="button" onClick={() => setMethod(id)}
            className={`flex-1 py-2.5 px-2 rounded-xl border text-sm font-medium transition flex flex-col items-center gap-1.5 ${
              method === id ? 'border-orange-400 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }`}>
            {icon}
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>

      {method === 'card' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
            <input type="text" placeholder="1234 5678 9012 3456" required
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
              <input type="text" placeholder="MM / YY" required
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
              <input type="text" placeholder="123" required
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
            <input type="text" required
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition" />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            <span className="text-xs text-gray-400">256-bit SSL encrypted · PCI DSS compliant</span>
          </div>
        </div>
      )}
      {method === 'paypal' && (
        <div className="text-center py-8 bg-blue-50 rounded-xl border border-blue-100">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
            </svg>
          </div>
          <p className="text-gray-600 text-sm mb-1 font-medium">Continue with PayPal</p>
          <p className="text-gray-400 text-xs">You'll be redirected to PayPal to complete your purchase securely.</p>
        </div>
      )}
      {method === 'cod' && (
        <div className="text-center py-8 bg-green-50 rounded-xl border border-green-100">
          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
          <p className="text-gray-600 text-sm font-medium mb-1">Pay on delivery</p>
          <p className="text-gray-400 text-xs">Cash or card accepted when your order arrives.</p>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <button type="button" onClick={onBack} className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition">
          ← Back
        </button>
        <button type="submit" className="flex-1 py-3 rounded-xl font-semibold text-white transition hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
          Place Order →
        </button>
      </div>
    </form>
  );
}

function ConfirmationStep({ shipping }) {
  const orderId = `GT-${Math.floor(100000 + Math.random() * 900000)}`;
  return (
    <div className="text-center py-6">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h2>
      <p className="text-gray-500 mb-6">Thank you for your purchase. Your order is on its way!</p>
      <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left max-w-sm mx-auto">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-500">Order number</span>
          <span className="font-bold text-orange-500">{orderId}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-500">Shipping to</span>
          <span className="font-medium">{shipping.city || 'Your address'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Delivery</span>
          <span className="font-medium">{(shipping.delivery || 'Standard (3-5 days)').split(' — ')[0]}</span>
        </div>
      </div>
      <p className="text-sm text-gray-400 mb-6">A confirmation email will be sent to your inbox.</p>
      <Link href="/" className="inline-block text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition"
        style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
        Continue Shopping
      </Link>
    </div>
  );
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCartContext();
  const { toast } = useToastContext();
  const { user } = useAuthContext();
  const { format } = useCurrency();
  const searchParams = useSearchParams();

  const [step, setStep]           = useState(0);
  const [guestMode, setGuestMode] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [shipping, setShipping]   = useState({ delivery: 'Standard (3-5 days) — Free' });

  const [appliedCode, setAppliedCode]     = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    const urlPromo = searchParams?.get('promo');
    if (urlPromo && !appliedCode) {
      const result = validateCoupon(urlPromo, subtotal);
      if (result.valid) {
        setAppliedCode(result.code);
        setAppliedCoupon(result.coupon);
        toast.success(`Promo code ${result.code} applied automatically! 🎉`);
      }
    }
  }, []);

  const shipping_cost = shipping.delivery?.includes('Express') ? 9.99
    : shipping.delivery?.includes('Same-day') ? 19.99 : 0;

  const discountAmt      = calcDiscount(appliedCoupon, subtotal);
  const shippingFree     = couponFreesShipping(appliedCoupon);
  const effectiveShipping = shippingFree ? 0 : shipping_cost;
  const tax              = (subtotal - discountAmt) * 0.08;
  const total            = subtotal - discountAmt + effectiveShipping + tax;

  const handleNext = () => {
    if (step === 1) { setProcessing(true); return; }
    setStep((s) => s + 1);
  };

  const handleProcessingDone = () => {
    clearCart();
    toast.success('Order placed successfully! 🎉');
    setProcessing(false);
    setStep(2);
  };

  const showAuthGate = !user && !guestMode && step === 0;

  if (items.length === 0 && step < 2) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Add some items before checking out.</p>
        <Link href="/products" className="text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
          style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>
        <StepIndicator current={step} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 min-h-96">
            {processing ? (
              <PlacingOrderScreen onDone={handleProcessingDone} />
            ) : (
              <>
                {step === 0 && showAuthGate && (
                  <AuthGate onContinueAsGuest={() => setGuestMode(true)} />
                )}
                {step === 0 && !showAuthGate && (
                  <ShippingStep
                    data={shipping}
                    onChange={(k, v) => setShipping((s) => ({ ...s, [k]: v }))}
                    onNext={handleNext}
                  />
                )}
                {step === 1 && <PaymentStep onNext={handleNext} onBack={() => setStep(0)} />}
                {step === 2 && <ConfirmationStep shipping={shipping} />}
              </>
            )}
          </div>

          
          {step < 2 && !processing && (
            <div className="bg-white rounded-2xl shadow-sm p-6 h-fit space-y-0">
              <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>

              
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-sm">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                      {item.image
                        ? <img src={item.image} alt={item.name} className="w-full h-full object-cover"/>
                        : <div className="w-full h-full bg-gray-100"/>
                      }
                    </div>
                    <span className="text-gray-600 truncate flex-1">{item.name} ×{item.qty}</span>
                    <span className="font-medium whitespace-nowrap">{format(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>

              
              <PromoCodeField
                subtotal={subtotal}
                appliedCoupon={appliedCoupon}
                appliedCode={appliedCode}
                onApply={(code, coupon) => {
                  setAppliedCode(code);
                  setAppliedCoupon(coupon);
                  toast.success(`${code} applied — ${coupon.label}`);
                }}
                onRemove={() => {
                  setAppliedCode('');
                  setAppliedCoupon(null);
                  toast.success('Promo code removed.');
                }}
              />

              
              <div className="border-t pt-4 mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span><span>{format(subtotal)}</span>
                </div>

                
                {appliedCoupon && discountAmt > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"/>
                      </svg>
                      Discount ({appliedCode})
                    </span>
                    <span>-{format(discountAmt)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span>
                    {shippingFree
                      ? <span className="text-green-500 font-medium">Free 🎉</span>
                      : effectiveShipping === 0
                        ? <span className="text-green-500">Free</span>
                        : format(effectiveShipping)
                    }
                  </span>
                </div>

                <div className="flex justify-between text-gray-500">
                  <span>Tax (8%)</span><span>{format(tax)}</span>
                </div>

                <div className="flex justify-between font-bold text-base border-t pt-3">
                  <span>Total</span>
                  <span className="text-orange-500">{format(total)}</span>
                </div>

                
                {(discountAmt > 0 || shippingFree) && (
                  <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2 mt-2">
                    <span className="text-base">🎉</span>
                    <p className="text-xs text-green-700 font-medium">
                      You're saving {format(discountAmt + (shippingFree ? shipping_cost : 0))} on this order!
                    </p>
                  </div>
                )}
              </div>

              
              {user && (
                <div className="mt-4 flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-xl px-3 py-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
                    {(user.name || user.email || 'U')[0].toUpperCase()}
                  </div>
                  <p className="text-xs text-orange-700 truncate">
                    Signed in as <span className="font-semibold">{user.name || user.email}</span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

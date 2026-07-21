'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const FAKE_ORDERS = {
  'GT-2024-881234': {
    status: 'delivered',
    product: 'iPhone 16 Pro Max – Natural Titanium',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=120&q=80',
    carrier: 'FedEx Priority',
    carrierCode: 'FX',
    weight: '0.48 kg',
    dimensions: '16 × 8 × 4 cm',
    service: 'Priority Overnight',
    origin: 'Los Angeles, CA',
    destination: 'New York, NY',
    estimatedDelivery: 'Delivered May 24, 2026',
    lastUpdate: 'May 24, 2026 – 11:42 AM',
    steps: [
      { status: 'delivered',    label: 'Delivered',          detail: 'Package delivered to front door',              date: 'May 24, 11:42 AM', done: true,    current: false },
      { status: 'out',          label: 'Out for Delivery',   detail: 'Package loaded onto delivery vehicle',         date: 'May 24, 7:15 AM',  done: true,    current: false },
      { status: 'hub',          label: 'Arrived at Hub',     detail: 'Arrived at FedEx facility – Newark, NJ',       date: 'May 23, 10:30 PM', done: true,    current: false },
      { status: 'transit',      label: 'In Transit',         detail: 'Departed Los Angeles sorting center',          date: 'May 22, 3:00 AM',  done: true,    current: false },
      { status: 'shipped',      label: 'Shipped',            detail: 'Package picked up by FedEx',                   date: 'May 21, 5:45 PM',  done: true,    current: false },
      { status: 'processing',   label: 'Processing',         detail: 'Order packed and ready for carrier pickup',    date: 'May 21, 2:10 PM',  done: true,    current: false },
      { status: 'placed',       label: 'Order Placed',       detail: 'Order confirmed – payment processed',          date: 'May 20, 9:03 AM',  done: true,    current: false },
    ],
  },
  'GT-2024-776655': {
    status: 'out_for_delivery',
    product: 'MacBook Pro 16" M4 Max – Space Black',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=120&q=80',
    carrier: 'UPS Next Day',
    carrierCode: 'UPS',
    weight: '2.15 kg',
    dimensions: '36 × 25 × 5 cm',
    service: 'UPS Next Day Air',
    origin: 'Memphis, TN',
    destination: 'Chicago, IL',
    estimatedDelivery: 'Today by 8:00 PM',
    lastUpdate: 'Today, 8:22 AM',
    steps: [
      { status: 'delivered',    label: 'Delivered',          detail: 'Awaiting delivery',                            date: 'Expected today',   done: false,   current: false },
      { status: 'out',          label: 'Out for Delivery',   detail: 'With driver – stop 14 of 22',                  date: 'Today, 8:22 AM',   done: true,    current: true  },
      { status: 'hub',          label: 'Arrived at Hub',     detail: 'Arrived at UPS facility – Chicago, IL',        date: 'Today, 5:50 AM',   done: true,    current: false },
      { status: 'transit',      label: 'In Transit',         detail: 'In transit through Louisville, KY hub',        date: 'May 30, 11:00 PM', done: true,    current: false },
      { status: 'shipped',      label: 'Shipped',            detail: 'Package picked up by UPS',                     date: 'May 30, 3:10 PM',  done: true,    current: false },
      { status: 'processing',   label: 'Processing',         detail: 'Warehouse packed and labelled',                date: 'May 30, 1:25 PM',  done: true,    current: false },
      { status: 'placed',       label: 'Order Placed',       detail: 'Order confirmed – payment processed',          date: 'May 29, 4:17 PM',  done: true,    current: false },
    ],
  },
  'GT-2024-990012': {
    status: 'in_transit',
    product: 'Sony WH-1000XM6 Headphones – Midnight Black',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&q=80',
    carrier: 'DHL Express',
    carrierCode: 'DHL',
    weight: '0.31 kg',
    dimensions: '22 × 18 × 9 cm',
    service: 'DHL Express Worldwide',
    origin: 'Frankfurt, Germany',
    destination: 'Austin, TX',
    estimatedDelivery: 'Jun 2, 2026',
    lastUpdate: 'May 31, 4:10 AM',
    steps: [
      { status: 'delivered',    label: 'Delivered',          detail: 'Awaiting delivery',                            date: 'Est. Jun 2',       done: false,   current: false },
      { status: 'out',          label: 'Out for Delivery',   detail: 'Not yet dispatched',                           date: '—',                done: false,   current: false },
      { status: 'hub',          label: 'Arrived at US Hub',  detail: 'Cleared customs – DFW hub, Texas',             date: 'May 31, 4:10 AM',  done: true,    current: true  },
      { status: 'transit',      label: 'In Transit',         detail: 'Departed Cincinnati DHL hub',                  date: 'May 30, 8:45 PM',  done: true,    current: false },
      { status: 'shipped',      label: 'Shipped',            detail: 'Loaded on aircraft – Frankfurt',               date: 'May 29, 11:20 PM', done: true,    current: false },
      { status: 'processing',   label: 'Processing',         detail: 'Packed at GlobalTech EU warehouse',            date: 'May 29, 6:40 PM',  done: true,    current: false },
      { status: 'placed',       label: 'Order Placed',       detail: 'Order confirmed – payment processed',          date: 'May 28, 2:55 PM',  done: true,    current: false },
    ],
  },
  'GT-2024-554488': {
    status: 'processing',
    product: 'Samsung 85" Neo QLED 8K TV',
    image: 'https://images.unsplash.com/photo-1571415060716-baff5f717c37?w=120&q=80',
    carrier: 'XPO Logistics (Freight)',
    carrierCode: 'XPO',
    weight: '52.4 kg',
    dimensions: '215 × 125 × 18 cm',
    service: 'White Glove Delivery',
    origin: 'Seattle, WA',
    destination: 'Miami, FL',
    estimatedDelivery: 'Jun 5–7, 2026',
    lastUpdate: 'May 31, 10:00 AM',
    steps: [
      { status: 'delivered',    label: 'Delivered',          detail: 'Awaiting delivery',                            date: 'Est. Jun 5–7',     done: false,   current: false },
      { status: 'out',          label: 'Out for Delivery',   detail: 'Not yet dispatched',                           date: '—',                done: false,   current: false },
      { status: 'hub',          label: 'In Transit',         detail: 'Not yet in transit',                           date: '—',                done: false,   current: false },
      { status: 'transit',      label: 'Picked Up',          detail: 'Not yet picked up',                            date: '—',                done: false,   current: false },
      { status: 'shipped',      label: 'Ready for Pickup',   detail: 'Awaiting XPO carrier pickup',                  date: 'May 31, 10:00 AM', done: true,    current: true  },
      { status: 'processing',   label: 'Processing',         detail: 'Item packed – white glove crating',            date: 'May 31, 9:15 AM',  done: true,    current: false },
      { status: 'placed',       label: 'Order Placed',       detail: 'Order confirmed – payment processed',          date: 'May 30, 6:32 PM',  done: true,    current: false },
    ],
  },
};

const SAMPLE_NUMBERS = ['GT-2024-881234', 'GT-2024-776655', 'GT-2024-990012', 'GT-2024-554488'];

const STATUS_CONFIG = {
  delivered:        { color: 'bg-green-500',  text: 'text-green-600',  bg: 'bg-green-50',  label: 'Delivered',         icon: '✓' },
  out_for_delivery: { color: 'bg-blue-500',   text: 'text-blue-600',   bg: 'bg-blue-50',   label: 'Out for Delivery',  icon: '🚚' },
  in_transit:       { color: 'bg-orange-500', text: 'text-orange-600', bg: 'bg-orange-50', label: 'In Transit',        icon: '✈️' },
  processing:       { color: 'bg-purple-500', text: 'text-purple-600', bg: 'bg-purple-50', label: 'Processing',        icon: '📦' },
};

const STEP_ICONS = {
  delivered:  '🏠',
  out:        '🚚',
  hub:        '🏭',
  transit:    '✈️',
  shipped:    '📮',
  processing: '📦',
  placed:     '🛒',
};

function ScanningLoader({ query }) {
  const [dots, setDots] = useState('');
  const [phase, setPhase] = useState(0);

  const phases = [
    'Connecting to carrier network',
    'Locating tracking number',
    'Fetching shipment data',
    'Loading delivery timeline',
  ];

  useEffect(() => {
    const d = setInterval(() => setDots((p) => p.length >= 3 ? '' : p + '.'), 400);
    const p = setInterval(() => setPhase((prev) => (prev + 1) % phases.length), 900);
    return () => { clearInterval(d); clearInterval(p); };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-8">
      
      <div className="relative w-40 h-40 flex items-center justify-center">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="absolute rounded-full border-2 border-orange-400"
            style={{
              width:  `${(i + 1) * 25}%`,
              height: `${(i + 1) * 25}%`,
              animation: `ping ${1.2 + i * 0.3}s cubic-bezier(0,0,0.2,1) ${i * 0.25}s infinite`,
              opacity: 0,
            }}
          />
        ))}
        
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, transparent 70%, rgba(244,135,75,0.6) 100%)',
            animation: 'spin 1.4s linear infinite',
          }}
        />
        
        <span className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg"
          style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
          📡
        </span>
      </div>

      
      <div className="text-center">
        <p className="text-xs text-gray-400 mb-1 font-mono uppercase tracking-widest">Tracking</p>
        <p className="font-mono font-bold text-dark-800 text-lg">{query}</p>
      </div>

      
      <div className="text-center">
        <p className="text-sm text-gray-500 font-medium min-h-[20px]">
          {phases[phase]}{dots}
        </p>
      </div>

      
      <div className="w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg,#e8517a,#f4874b)',
            animation: 'trackProgress 2.2s ease-in-out forwards',
          }}
        />
      </div>

      <style>{`
        @keyframes trackProgress {
          0%   { width: 0% }
          30%  { width: 35% }
          60%  { width: 68% }
          85%  { width: 88% }
          100% { width: 95% }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

function TrackingResult({ data, trackingNo }) {
  const cfg = STATUS_CONFIG[data.status];
  const doneSteps = data.steps.filter((s) => s.done).length;
  const progress = Math.round((doneSteps / data.steps.length) * 100);

  return (
    <div className="animate-slide-in-up space-y-6">

      
      <div className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden">
        <div className="p-5 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            
            <img
              src={data.image}
              alt={data.product}
              className="w-20 h-20 object-cover rounded-2xl border border-gray-100 flex-shrink-0 self-start"
              onError={(e) => { e.target.src = 'https://placehold.co/80x80/f5f5f5/999?text=GT'; }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-xs text-gray-400 font-mono mb-1">{trackingNo}</p>
                  <h2 className="font-bold text-dark-800 text-lg leading-snug">{data.product}</h2>
                </div>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${cfg.bg} ${cfg.text} flex-shrink-0`}>
                  {cfg.icon} {cfg.label}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">{data.carrier} · {data.service}</p>
              <p className="text-sm font-semibold text-orange-500 mt-1">{data.estimatedDelivery}</p>
            </div>
          </div>

          
          <div className="mt-6">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Order Placed</span>
              <span>Delivered</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#e8517a,#f4874b,#f5c518)' }}
              />
            </div>
            <p className="text-right text-xs text-gray-400 mt-1">{doneSteps}/{data.steps.length} steps complete</p>
          </div>
        </div>

        
        <div className="border-t border-gray-50 bg-gray-50/50 px-5 sm:px-8 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          {[
            { label: 'Origin',      value: data.origin },
            { label: 'Destination', value: data.destination },
            { label: 'Weight',      value: data.weight },
            { label: 'Last Update', value: data.lastUpdate },
          ].map((m) => (
            <div key={m.label}>
              <p className="text-xs text-gray-400 mb-0.5">{m.label}</p>
              <p className="font-semibold text-dark-800 text-xs sm:text-sm">{m.value}</p>
            </div>
          ))}
        </div>
      </div>

      
      <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-5 sm:p-8">
        <h3 className="font-bold text-dark-800 text-lg mb-6">Shipment Timeline</h3>
        <div className="relative">
          
          <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-gray-100" />

          <div className="space-y-1">
            {data.steps.map((step, i) => (
              <div
                key={i}
                className={`relative flex gap-4 py-3 px-2 rounded-2xl transition-all ${step.current ? 'bg-orange-50' : ''}`}
              >
                
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-base flex-shrink-0 border-2 transition-all ${
                  step.done
                    ? step.current
                      ? 'border-orange-400 bg-orange-400 shadow-brand'
                      : 'border-green-400 bg-green-50'
                    : 'border-gray-200 bg-white'
                }`}>
                  <span className={step.done ? '' : 'opacity-30'}>{STEP_ICONS[step.status]}</span>
                </div>

                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className={`font-semibold text-sm ${step.done ? 'text-dark-800' : 'text-gray-300'}`}>
                        {step.label}
                        {step.current && (
                          <span className="ml-2 text-xs font-bold text-orange-500 bg-orange-100 px-2 py-0.5 rounded-full">
                            CURRENT
                          </span>
                        )}
                      </p>
                      <p className={`text-xs mt-0.5 ${step.done ? 'text-gray-500' : 'text-gray-300'}`}>{step.detail}</p>
                    </div>
                    <span className={`text-xs flex-shrink-0 font-mono ${step.done ? 'text-gray-400' : 'text-gray-200'}`}>
                      {step.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      
      <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-5 sm:p-8">
        <h3 className="font-bold text-dark-800 text-lg mb-5">Package Details</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          {[
            { icon: '📦', label: 'Carrier',    value: data.carrier },
            { icon: '🔢', label: 'Tracking #', value: trackingNo },
            { icon: '⚡', label: 'Service',    value: data.service },
            { icon: '⚖️', label: 'Weight',     value: data.weight },
            { icon: '📐', label: 'Dimensions', value: data.dimensions },
            { icon: '📅', label: 'Est. Delivery', value: data.estimatedDelivery },
          ].map((d) => (
            <div key={d.label} className="bg-gray-50 rounded-2xl p-4">
              <span className="text-xl">{d.icon}</span>
              <p className="text-xs text-gray-400 mt-2 mb-0.5">{d.label}</p>
              <p className="font-semibold text-dark-800 text-sm leading-snug">{d.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotFound({ query }) {
  return (
    <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-10 text-center animate-fade-in">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="font-bold text-dark-800 text-xl mb-2">Tracking number not found</h3>
      <p className="text-gray-500 text-sm mb-1">We couldn't locate <span className="font-mono font-semibold text-dark-800">{query}</span></p>
      <p className="text-gray-400 text-sm">Please double-check the number from your order confirmation email.</p>
    </div>
  );
}

export default function TrackPage() {
  const [query,   setQuery]   = useState('');
  const [phase,   setPhase]   = useState('idle');
  const [result,  setResult]  = useState(null);
  const [tracked, setTracked] = useState('');
  const inputRef = useRef(null);

  function handleSearch(val) {
    const q = (val || query).trim().toUpperCase();
    if (!q) return;
    setTracked(q);
    setPhase('scanning');
    setResult(null);

    setTimeout(() => {
      const data = FAKE_ORDERS[q];
      if (data) { setResult(data); setPhase('result'); }
      else       { setPhase('notfound'); }
    }, 2400);
  }

  function handleReset() {
    setPhase('idle');
    setQuery('');
    setResult(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  return (
    <div className="container-custom py-10 sm:py-16 max-w-3xl">

      
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-dark-800 font-medium">Track Order</span>
      </nav>

      
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 text-3xl shadow-brand"
          style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
          🚚
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-dark-800 mb-3">Track Your Order</h1>
        <p className="text-gray-500 text-base max-w-md mx-auto">
          Enter your tracking number to get real-time updates on your shipment.
        </p>
      </div>

      
      <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-5 sm:p-8 mb-8">
        <label className="block text-sm font-semibold text-dark-800 mb-3">Tracking Number</label>
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="e.g. GT-2024-881234"
            className="flex-1 border-2 border-gray-200 focus:border-orange-400 rounded-xl px-4 py-3 text-sm outline-none font-mono transition-colors"
            disabled={phase === 'scanning'}
          />
          {phase === 'result' || phase === 'notfound' ? (
            <button
              onClick={handleReset}
              className="px-5 py-3 rounded-xl text-sm font-semibold border-2 border-gray-200 text-gray-600 hover:border-gray-300 transition-colors flex-shrink-0"
            >
              Reset
            </button>
          ) : (
            <button
              onClick={() => handleSearch()}
              disabled={phase === 'scanning' || !query.trim()}
              className="px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}
            >
              Track
            </button>
          )}
        </div>

        
        {phase === 'idle' && (
          <div className="mt-4">
            <p className="text-xs text-gray-400 mb-2">Try a sample tracking number:</p>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_NUMBERS.map((n) => (
                <button
                  key={n}
                  onClick={() => { setQuery(n); handleSearch(n); }}
                  className="text-xs font-mono bg-gray-50 hover:bg-orange-50 hover:text-orange-600 border border-gray-200 hover:border-orange-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      
      {phase === 'scanning'  && <ScanningLoader query={tracked} />}
      {phase === 'result'    && result && <TrackingResult data={result} trackingNo={tracked} />}
      {phase === 'notfound'  && <NotFound query={tracked} />}

      
      {phase === 'idle' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {[
            { icon: '⚡', title: 'Real-Time Updates', desc: 'Carrier data refreshed every 15 minutes' },
            { icon: '📧', title: 'Email Alerts',       desc: 'Get notified at each delivery milestone' },
            { icon: '📞', title: 'Need Help?',         desc: 'Chat or call our support team 24/7' },
          ].map((c) => (
            <div key={c.title} className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm">
              <span className="text-2xl">{c.icon}</span>
              <p className="font-semibold text-dark-800 text-sm mt-2 mb-1">{c.title}</p>
              <p className="text-xs text-gray-400">{c.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';
import { useState, useMemo } from 'react';
import { PRODUCTS, CATEGORIES } from '@/lib/products';


const REVENUE_30D = Array.from({ length: 30 }, (_, i) => {
  const d = new Date('2026-05-01');
  d.setDate(d.getDate() + i);
  const base = 15000 + Math.sin(i * 0.4) * 5000 + i * 300;
  return {
    date:    d.toISOString().slice(0, 10),
    label:   d.toLocaleDateString('en-US', { month:'short', day:'numeric' }),
    revenue: Math.round(base + (Math.random() - 0.4) * 4000),
    orders:  Math.round(base / 600 + (Math.random() - 0.4) * 8),
    visitors:Math.round(base / 80 + (Math.random() - 0.4) * 100),
  };
});

const REVENUE_7D  = REVENUE_30D.slice(-7);
const REVENUE_90D = Array.from({ length: 90 }, (_, i) => {
  const d = new Date('2026-03-01');
  d.setDate(d.getDate() + i);
  const base = 14000 + Math.sin(i * 0.15) * 6000 + i * 120;
  return {
    date:    d.toISOString().slice(0, 10),
    label:   i % 7 === 0 ? d.toLocaleDateString('en-US', { month:'short', day:'numeric' }) : '',
    revenue: Math.round(base + (Math.random() - 0.4) * 5000),
    orders:  Math.round(base / 550 + (Math.random() - 0.4) * 10),
    visitors:Math.round(base / 75 + (Math.random() - 0.4) * 120),
  };
});

const TOP_PRODUCTS = [
  { id: 7,  name: 'Sony WH-1000XM6',       revenue: 34300, units: 98,  category: 'Audio'    },
  { id: 3,  name: 'MacBook Pro 16" M4 Max', revenue: 29900, units: 12,  category: 'Laptops'  },
  { id: 31, name: 'Meta Quest 3S',          revenue: 28100, units: 94,  category: 'VR / AR'  },
  { id: 10, name: 'Xbox Series X 2TB',      revenue: 22200, units: 37,  category: 'Gaming'   },
  { id: 27, name: 'Apple Watch Ultra 3',    revenue: 20100, units: 25,  category: 'Wearables'},
  { id: 5,  name: 'LG C4 77" OLED 4K TV',  revenue: 18900, units: 11,  category: 'TVs'      },
  { id: 9,  name: 'PS5 Pro',               revenue: 17100, units: 25,  category: 'Gaming'   },
  { id: 25, name: 'DJI Mini 4 Pro',        revenue: 15800, units: 21,  category: 'Drones'   },
];

const CATEGORY_DATA = [
  { label: 'Laptops',     revenue: 68400, units: 34, color: '#e8517a' },
  { label: 'Phones',      revenue: 54200, units: 49, color: '#f4874b' },
  { label: 'TVs',         revenue: 48700, units: 27, color: '#f5c518' },
  { label: 'Gaming',      revenue: 42100, units: 89, color: '#4ade80' },
  { label: 'Audio',       revenue: 38900, units: 112,color: '#60a5fa' },
  { label: 'Cameras',     revenue: 31400, units: 8,  color: '#a78bfa' },
  { label: 'VR / AR',     revenue: 24800, units: 31, color: '#34d399' },
  { label: 'Smart Home',  revenue: 18100, units: 101,color: '#fb923c' },
];

const FUNNEL = [
  { label: 'Visitors',      value: 48200, pct: 100 },
  { label: 'Product Views', value: 21400, pct: 44  },
  { label: 'Add to Cart',   value: 7300,  pct: 15  },
  { label: 'Checkout',      value: 2900,  pct: 6   },
  { label: 'Purchased',     value: 1640,  pct: 3.4 },
];

const PERIODS = { '7d': REVENUE_7D, '30d': REVENUE_30D, '90d': REVENUE_90D };


function LineChart({ data, field, color, height = 120 }) {
  const vals = data.map(d => d[field]);
  const min  = Math.min(...vals);
  const max  = Math.max(...vals);
  const range = max - min || 1;
  const W = 600, H = height;
  const pts = data.map((d, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - ((d[field] - min) / range) * (H - 10) - 5,
    label: d.label,
    val: d[field],
  }));

  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${pts[pts.length-1].x} ${H} L 0 ${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={`grad-${field}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#grad-${field})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.filter((_, i) => data[i].label).map((p, i) => (
        <text key={i} x={p.x} y={H - 2} textAnchor="middle" fontSize="9" fill="#9ca3af">{data[pts.indexOf(p)]?.label || ''}</text>
      ))}
    </svg>
  );
}

function BarChart({ data, height = 100 }) {
  const max = Math.max(...data.map(d => d.revenue));
  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {data.map((d, i) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-0.5 group" title={`${d.label}: $${d.revenue.toLocaleString()}`}>
          <div
            className="w-full rounded-t transition-all duration-300"
            style={{
              height: `${(d.revenue / max) * (height - 18)}px`,
              background: d.color,
              opacity: 0.85,
            }}
          />
          <span className="text-[8px] text-gray-400 leading-tight text-center">{d.label.split(' ')[0]}</span>
        </div>
      ))}
    </div>
  );
}


export default function AnalyticsPage() {
  const [period, setPeriod] = useState('30d');
  const [metric, setMetric] = useState('revenue');

  const data = PERIODS[period];

  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
  const totalOrders  = data.reduce((s, d) => s + d.orders, 0);
  const totalVisitors= data.reduce((s, d) => s + d.visitors, 0);
  const avgOrder     = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;
  const conversion   = totalVisitors ? ((totalOrders / totalVisitors) * 100).toFixed(1) : 0;

  const METRIC_OPTIONS = [
    { key: 'revenue',  label: 'Revenue',  color: '#e8517a', fmt: v => `$${(v/1000).toFixed(0)}k` },
    { key: 'orders',   label: 'Orders',   color: '#60a5fa', fmt: v => v },
    { key: 'visitors', label: 'Visitors', color: '#34d399', fmt: v => `${(v/1000).toFixed(1)}k` },
  ];
  const activeMetric = METRIC_OPTIONS.find(m => m.key === metric);

  const topRevTotal = TOP_PRODUCTS[0]?.revenue || 1;

  return (
    <div className="p-4 md:p-6 space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Revenue, traffic, and conversion insights.</p>
        </div>
        <div className="flex gap-2">
          {Object.keys(PERIODS).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${period === p ? 'text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'}`}
              style={period === p ? { background: 'linear-gradient(135deg,#e8517a,#f4874b)' } : {}}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { icon: '💰', label: 'Revenue',     value: `$${(totalRevenue/1000).toFixed(0)}k`,   trend: +15, color: 'bg-pink-50'   },
          { icon: '🛒', label: 'Orders',      value: totalOrders,                              trend: +12, color: 'bg-blue-50'   },
          { icon: '👀', label: 'Visitors',    value: `${(totalVisitors/1000).toFixed(1)}k`,    trend: +8,  color: 'bg-green-50'  },
          { icon: '💵', label: 'Avg. Order',  value: `$${avgOrder}`,                           trend: +3,  color: 'bg-yellow-50' },
          { icon: '📈', label: 'Conversion',  value: `${conversion}%`,                         trend: +0.4,color: 'bg-purple-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base ${s.color} mb-3`}>{s.icon}</div>
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <div className="flex items-center justify-between mt-0.5">
              <p className="text-xs text-gray-500">{s.label}</p>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                ↑ {Math.abs(s.trend)}{typeof s.trend === 'number' && String(s.value).endsWith('%') ? 'pp' : '%'}
              </span>
            </div>
          </div>
        ))}
      </div>

      
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="font-semibold text-gray-900">Performance Over Time</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {activeMetric.fmt(data.reduce((s, d) => s + d[metric], 0))} total in the last {period}
            </p>
          </div>
          <div className="flex gap-2">
            {METRIC_OPTIONS.map(m => (
              <button
                key={m.key}
                onClick={() => setMetric(m.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${metric === m.key ? 'text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                style={metric === m.key ? { background: m.color } : {}}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
        <LineChart data={data} field={metric} color={activeMetric.color} height={130} />
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Top Products by Revenue</h2>
            <p className="text-xs text-gray-400 mt-0.5">Last {period}</p>
          </div>
          <div className="divide-y divide-gray-50">
            {TOP_PRODUCTS.map((p, i) => {
              const pct = (p.revenue / topRevTotal) * 100;
              return (
                <div key={p.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                  <span className="text-xs font-bold text-gray-400 w-4 text-center flex-shrink-0">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#e8517a,#f4874b)' }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 flex-shrink-0">{p.units} units</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-900">${p.revenue.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400">{p.category}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-1">Revenue by Category</h2>
          <p className="text-xs text-gray-400 mb-4">Last {period}</p>

          <BarChart data={CATEGORY_DATA} height={110} />

          <div className="mt-4 space-y-2">
            {CATEGORY_DATA.slice(0, 5).map(c => {
              const totalCatRev = CATEGORY_DATA.reduce((s, x) => s + x.revenue, 0);
              const pct = ((c.revenue / totalCatRev) * 100).toFixed(0);
              return (
                <div key={c.label} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.color }} />
                  <span className="text-xs text-gray-600 flex-1">{c.label}</span>
                  <span className="text-xs text-gray-400">{pct}%</span>
                  <span className="text-xs font-semibold text-gray-900">${(c.revenue/1000).toFixed(0)}k</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-gray-900 mb-1">Conversion Funnel</h2>
        <p className="text-xs text-gray-400 mb-5">Last {period} — visitors to purchases</p>

        <div className="flex flex-col gap-2">
          {FUNNEL.map((step, i) => (
            <div key={step.label} className="flex items-center gap-4">
              <div className="w-28 text-right flex-shrink-0">
                <p className="text-xs font-semibold text-gray-700">{step.label}</p>
              </div>
              <div className="flex-1 relative h-9 flex items-center">
                <div
                  className="h-full rounded-lg flex items-center justify-end pr-3 transition-all duration-500"
                  style={{
                    width: `${step.pct}%`,
                    background: i === 0
                      ? 'linear-gradient(90deg,#e8517a,#f4874b)'
                      : i === FUNNEL.length - 1
                      ? 'linear-gradient(90deg,#34d399,#059669)'
                      : `linear-gradient(90deg,#f4874b${Math.round(((FUNNEL.length - i) / FUNNEL.length) * 255).toString(16).padStart(2,'0')},#f4874b)`,
                    minWidth: '48px',
                  }}
                >
                  <span className="text-[10px] font-bold text-white">{step.pct}%</span>
                </div>
              </div>
              <div className="w-20 flex-shrink-0">
                <p className="text-xs font-bold text-gray-900">{step.value.toLocaleString()}</p>
                {i > 0 && (
                  <p className="text-[10px] text-red-400">
                    ↓ {(100 - (step.value / FUNNEL[i-1].value * 100)).toFixed(0)}% drop
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        
        <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm font-bold text-gray-900">3.4%</p>
            <p className="text-xs text-gray-500">Overall Conversion</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-900">$181</p>
            <p className="text-xs text-gray-500">Revenue / Visitor</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-900">22.5%</p>
            <p className="text-xs text-gray-500">Cart Abandon Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}

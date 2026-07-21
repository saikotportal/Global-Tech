'use client';
import { useState } from 'react';
import Link from 'next/link';
import { PRODUCTS, CATEGORIES } from '@/lib/products';
import { COUPONS } from '@/lib/coupons';

const MOCK_ORDERS = [
  { id: 'GT-10041', customer: 'Sarah Johnson',  email: 'sarah@email.com',  total: 2499, status: 'delivered',   date: '2026-05-30', items: 1, product: 'MacBook Pro 16" M4 Max' },
  { id: 'GT-10040', customer: 'James Liu',       email: 'james@email.com',   total: 1799, status: 'shipped',     date: '2026-05-30', items: 2, product: 'LG C4 77" OLED 4K TV' },
  { id: 'GT-10039', customer: 'Priya Sharma',    email: 'priya@email.com',   total: 699,  status: 'processing',  date: '2026-05-29', items: 1, product: 'PS5 Pro' },
  { id: 'GT-10038', customer: 'Carlos Rivera',   email: 'carlos@email.com',  total: 3499, status: 'delivered',   date: '2026-05-29', items: 1, product: 'Apple Vision Pro' },
  { id: 'GT-10037', customer: 'Emma Wilson',     email: 'emma@email.com',    total: 349,  status: 'delivered',   date: '2026-05-28', items: 1, product: 'Sony WH-1000XM6' },
  { id: 'GT-10036', customer: 'Mohammed Al-Farsi', email: 'mo@email.com',   total: 1899, status: 'cancelled',   date: '2026-05-28', items: 1, product: 'DJI Mavic 4 Pro' },
  { id: 'GT-10035', customer: 'Yuki Tanaka',     email: 'yuki@email.com',    total: 799,  status: 'shipped',     date: '2026-05-27', items: 1, product: 'Apple Watch Ultra 3' },
  { id: 'GT-10034', customer: 'Lisa Park',       email: 'lisa@email.com',    total: 599,  status: 'delivered',   date: '2026-05-27', items: 1, product: 'Xbox Series X 2TB' },
];

const REVENUE_WEEKLY = [
  { day: 'Mon', revenue: 12400, orders: 18 },
  { day: 'Tue', revenue: 18700, orders: 24 },
  { day: 'Wed', revenue: 15200, orders: 21 },
  { day: 'Thu', revenue: 22300, orders: 31 },
  { day: 'Fri', revenue: 28900, orders: 38 },
  { day: 'Sat', revenue: 34100, orders: 45 },
  { day: 'Sun', revenue: 19800, orders: 27 },
];

const CATEGORY_SALES = CATEGORIES.slice(0, 6).map((c, i) => ({
  ...c,
  sales: [5800, 4200, 3900, 3100, 2800, 2100][i],
  units: [32, 28, 19, 41, 15, 22][i],
}));

const STATUS_COLOR = {
  delivered:  { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500'  },
  shipped:    { bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-500'   },
  processing: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  cancelled:  { bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500'    },
};

function MiniBarChart({ data, height = 60 }) {
  const max = Math.max(...data.map(d => d.revenue));
  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {data.map((d, i) => (
        <div key={d.day} className="flex flex-col items-center gap-0.5 flex-1">
          <div
            className="w-full rounded-t transition-all duration-300 hover:opacity-80 cursor-default"
            style={{
              height: `${(d.revenue / max) * (height - 16)}px`,
              background: i === data.length - 1
                ? 'linear-gradient(180deg,#e8517a,#f4874b)'
                : 'linear-gradient(180deg,#f4874b44,#f4874b22)',
            }}
            title={`${d.day}: $${d.revenue.toLocaleString()}`}
          />
          <span className="text-[9px] text-gray-400">{d.day}</span>
        </div>
      ))}
    </div>
  );
}

function StatCard({ icon, label, value, sub, trend, color }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${color}`}>
          {icon}
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm font-medium text-gray-700 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [period, setPeriod] = useState('7d');

  const totalRevenue     = MOCK_ORDERS.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
  const totalOrders      = MOCK_ORDERS.length;
  const lowStockProducts = PRODUCTS.filter(p => p.stock > 0 && p.stock <= 5);
  const outOfStock       = PRODUCTS.filter(p => p.stock === 0);
  const weekRevenue      = REVENUE_WEEKLY.reduce((s, d) => s + d.revenue, 0);

  return (
    <div className="p-4 md:p-6 space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Welcome back — here's what's happening today.</p>
        </div>
        <div className="flex gap-2">
          {['7d','30d','90d'].map(p => (
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

      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="💰" label="Revenue (7d)"   value={`$${weekRevenue.toLocaleString()}`}  sub="vs $128k last week"   trend={15}  color="bg-orange-50" />
        <StatCard icon="🛒" label="Orders (7d)"    value="204"                                  sub="vs 176 last week"     trend={16}  color="bg-blue-50" />
        <StatCard icon="👥" label="New Customers"  value="48"                                   sub="vs 41 last week"      trend={17}  color="bg-purple-50" />
        <StatCard icon="📦" label="Products"       value={PRODUCTS.length}                      sub={`${outOfStock.length} out of stock`} trend={null} color="bg-green-50" />
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-900">Revenue This Week</h2>
              <p className="text-xs text-gray-400 mt-0.5">Daily breakdown</p>
            </div>
            <span className="text-lg font-bold text-gray-900">${weekRevenue.toLocaleString()}</span>
          </div>
          <MiniBarChart data={REVENUE_WEEKLY} height={90} />
          <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
            {REVENUE_WEEKLY.map(d => (
              <div key={d.day} className="text-center">
                <p className="text-xs font-semibold text-gray-700">{d.orders}</p>
                <p className="text-[10px] text-gray-400">orders</p>
              </div>
            ))}
          </div>
        </div>

        
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-1">Top Categories</h2>
          <p className="text-xs text-gray-400 mb-4">By revenue</p>
          <div className="space-y-3">
            {CATEGORY_SALES.map((cat, i) => {
              const maxSales = CATEGORY_SALES[0].sales;
              const pct = (cat.sales / maxSales) * 100;
              return (
                <div key={cat.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">{cat.emoji} {cat.label}</span>
                    <span className="text-xs font-bold text-gray-900">${cat.sales.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        background: i === 0
                          ? 'linear-gradient(90deg,#e8517a,#f4874b)'
                          : i === 1
                          ? 'linear-gradient(90deg,#f4874b,#f5c518)'
                          : '#e5e7eb',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs font-semibold hover:opacity-80 transition-opacity"
              style={{ color: '#f4874b' }}>View all →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {MOCK_ORDERS.slice(0, 6).map(order => {
              const st = STATUS_COLOR[order.status];
              return (
                <div key={order.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 truncate">{order.customer}</p>
                      <span className="text-xs text-gray-400 font-mono flex-shrink-0">{order.id}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{order.product}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-900">${order.total.toLocaleString()}</p>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${st.bg} ${st.text}`}>
                      <span className={`w-1 h-1 rounded-full ${st.dot}`} />
                      {order.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        
        <div className="space-y-4">
          
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900">⚠️ Low Stock</h2>
              <Link href="/admin/products" className="text-xs font-semibold" style={{ color:'#f4874b' }}>Fix →</Link>
            </div>
            <div className="space-y-2">
              {lowStockProducts.slice(0, 4).map(p => (
                <div key={p.id} className="flex items-center justify-between">
                  <p className="text-xs text-gray-700 truncate flex-1">{p.name}</p>
                  <span className={`text-xs font-bold ml-2 flex-shrink-0 ${p.stock <= 3 ? 'text-red-600' : 'text-yellow-600'}`}>
                    {p.stock} left
                  </span>
                </div>
              ))}
              {outOfStock.length > 0 && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-red-600 font-semibold">{outOfStock.length} products out of stock</p>
                </div>
              )}
            </div>
          </div>

          
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-3">Quick Stats</h2>
            <div className="space-y-2.5">
              {[
                { label: 'Avg. Order Value', value: `$${Math.round(totalRevenue / totalOrders).toLocaleString()}` },
                { label: 'Active Coupons',   value: Object.keys(COUPONS).length },
                { label: 'Total Products',   value: PRODUCTS.length },
                { label: 'Out of Stock',     value: outOfStock.length },
                { label: 'Conversion Rate',  value: '3.4%' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{s.label}</span>
                  <span className="text-xs font-bold text-gray-900">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

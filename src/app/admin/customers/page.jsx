'use client';
import { useState, useMemo } from 'react';

const MOCK_CUSTOMERS = [
  { id: 'C001', name: 'Sarah Johnson',    email: 'sarah@email.com',    phone: '+1 (212) 555-0101', joined: '2024-01-15', orders: 8,  totalSpent: 12480, status: 'active',  lastOrder: '2026-05-30', location: 'New York, NY',       avatar: 'SJ' },
  { id: 'C002', name: 'James Liu',        email: 'james@email.com',    phone: '+1 (415) 555-0142', joined: '2024-03-22', orders: 5,  totalSpent: 6340,  status: 'active',  lastOrder: '2026-05-30', location: 'San Francisco, CA',  avatar: 'JL' },
  { id: 'C003', name: 'Priya Sharma',     email: 'priya@email.com',    phone: '+1 (512) 555-0168', joined: '2024-06-10', orders: 3,  totalSpent: 2190,  status: 'active',  lastOrder: '2026-05-29', location: 'Austin, TX',         avatar: 'PS' },
  { id: 'C004', name: 'Carlos Rivera',    email: 'carlos@email.com',   phone: '+1 (305) 555-0133', joined: '2023-11-08', orders: 12, totalSpent: 21340, status: 'active',  lastOrder: '2026-05-29', location: 'Miami, FL',          avatar: 'CR' },
  { id: 'C005', name: 'Emma Wilson',      email: 'emma@email.com',     phone: '+1 (206) 555-0177', joined: '2024-02-14', orders: 6,  totalSpent: 4120,  status: 'active',  lastOrder: '2026-05-28', location: 'Seattle, WA',        avatar: 'EW' },
  { id: 'C006', name: 'Mohammed Al-Farsi',email: 'mo@email.com',       phone: '+1 (602) 555-0191', joined: '2024-08-01', orders: 2,  totalSpent: 3200,  status: 'blocked', lastOrder: '2026-05-28', location: 'Phoenix, AZ',        avatar: 'MA' },
  { id: 'C007', name: 'Yuki Tanaka',      email: 'yuki@email.com',     phone: '+1 (773) 555-0156', joined: '2023-09-19', orders: 9,  totalSpent: 8760,  status: 'active',  lastOrder: '2026-05-27', location: 'Chicago, IL',        avatar: 'YT' },
  { id: 'C008', name: 'Lisa Park',        email: 'lisa@email.com',     phone: '+1 (617) 555-0109', joined: '2024-04-05', orders: 4,  totalSpent: 2890,  status: 'active',  lastOrder: '2026-05-27', location: 'Boston, MA',         avatar: 'LP' },
  { id: 'C009', name: 'Tom Bradley',      email: 'tom@email.com',      phone: '+1 (720) 555-0122', joined: '2024-07-12', orders: 7,  totalSpent: 9100,  status: 'active',  lastOrder: '2026-05-26', location: 'Denver, CO',         avatar: 'TB' },
  { id: 'C010', name: 'Aisha Okafor',     email: 'aisha@email.com',    phone: '+1 (404) 555-0148', joined: '2023-12-20', orders: 3,  totalSpent: 4890,  status: 'active',  lastOrder: '2026-05-26', location: 'Atlanta, GA',        avatar: 'AO' },
  { id: 'C011', name: 'Raj Patel',        email: 'raj@email.com',      phone: '+1 (713) 555-0175', joined: '2024-05-30', orders: 11, totalSpent: 7240,  status: 'active',  lastOrder: '2026-05-25', location: 'Houston, TX',        avatar: 'RP' },
  { id: 'C012', name: 'Nina Volkova',     email: 'nina@email.com',     phone: '+1 (503) 555-0163', joined: '2023-08-14', orders: 15, totalSpent: 34200, status: 'active',  lastOrder: '2026-05-25', location: 'Portland, OR',       avatar: 'NV' },
  { id: 'C013', name: 'Ben Carter',       email: 'ben@email.com',      phone: '+1 (702) 555-0137', joined: '2024-09-03', orders: 1,  totalSpent: 299,   status: 'blocked', lastOrder: '2026-05-24', location: 'Las Vegas, NV',      avatar: 'BC' },
  { id: 'C014', name: 'Lena Schmidt',     email: 'lena@email.com',     phone: '+1 (612) 555-0184', joined: '2024-01-28', orders: 6,  totalSpent: 5120,  status: 'active',  lastOrder: '2026-05-24', location: 'Minneapolis, MN',    avatar: 'LS' },
  { id: 'C015', name: 'David Kim',        email: 'david@email.com',    phone: '+1 (619) 555-0119', joined: '2023-07-11', orders: 14, totalSpent: 28900, status: 'active',  lastOrder: '2026-05-23', location: 'San Diego, CA',      avatar: 'DK' },
];

const ORDER_HISTORY = {
  C001: [
    { id: 'GT-10041', date: '2026-05-30', product: 'MacBook Pro 16" M4 Max', total: 2499, status: 'delivered' },
    { id: 'GT-09921', date: '2026-04-12', product: 'Apple Watch Ultra 3',    total: 799,  status: 'delivered' },
    { id: 'GT-09800', date: '2026-03-05', product: 'AirPods Pro 3',          total: 249,  status: 'delivered' },
  ],
  C004: [
    { id: 'GT-10038', date: '2026-05-29', product: 'Apple Vision Pro',       total: 3499, status: 'delivered' },
    { id: 'GT-09940', date: '2026-04-20', product: 'iPhone 16 Pro Max',      total: 1199, status: 'delivered' },
    { id: 'GT-09780', date: '2026-02-14', product: 'Sony A7R V',             total: 3499, status: 'delivered' },
  ],
};

const STATUS_STYLES = {
  delivered:  { bg: 'bg-green-100',  text: 'text-green-700'  },
  shipped:    { bg: 'bg-blue-100',   text: 'text-blue-700'   },
  processing: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  cancelled:  { bg: 'bg-red-100',    text: 'text-red-700'    },
  refunded:   { bg: 'bg-purple-100', text: 'text-purple-700' },
};

const AVATAR_COLORS = [
  'from-pink-500 to-orange-400',
  'from-blue-500 to-cyan-400',
  'from-purple-500 to-pink-400',
  'from-green-500 to-teal-400',
  'from-orange-500 to-yellow-400',
  'from-indigo-500 to-blue-400',
];

function CustomerDetailModal({ customer, onClose, onToggleBlock }) {
  const orders = ORDER_HISTORY[customer.id] || [];
  const colorIdx = customer.id.charCodeAt(1) % AVATAR_COLORS.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col z-10">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg">Customer Details</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${AVATAR_COLORS[colorIdx]} flex items-center justify-center text-white font-bold text-xl flex-shrink-0`}>
              {customer.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-lg">{customer.name}</h3>
              <p className="text-sm text-gray-500">{customer.email}</p>
              <p className="text-sm text-gray-400">{customer.phone}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${customer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {customer.status}
            </span>
          </div>

          
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Total Orders', value: customer.orders },
              { label: 'Total Spent', value: `$${customer.totalSpent.toLocaleString()}` },
              { label: 'Avg. Order', value: `$${Math.round(customer.totalSpent / customer.orders).toLocaleString()}` },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            {[
              { label: 'Location', value: customer.location },
              { label: 'Member Since', value: new Date(customer.joined).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' }) },
              { label: 'Last Order', value: customer.lastOrder },
              { label: 'Customer ID', value: customer.id },
            ].map(row => (
              <div key={row.label} className="flex justify-between">
                <span className="text-xs text-gray-500">{row.label}</span>
                <span className="text-xs font-semibold text-gray-900">{row.value}</span>
              </div>
            ))}
          </div>

          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Order History</h4>
            {orders.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No detailed order history available</p>
            ) : (
              <div className="space-y-2">
                {orders.map(o => {
                  const st = STATUS_STYLES[o.status] || STATUS_STYLES.delivered;
                  return (
                    <div key={o.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{o.product}</p>
                        <p className="text-xs text-gray-400">{o.id} · {o.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">${o.total.toLocaleString()}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${st.bg} ${st.text}`}>{o.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => { onToggleBlock(customer.id); onClose(); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                customer.status === 'active'
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'bg-green-50 text-green-600 hover:bg-green-100'
              }`}
            >
              {customer.status === 'active' ? '🚫 Block Customer' : '✅ Unblock Customer'}
            </button>
            <a
              href={`mailto:${customer.email}`}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-center transition-all text-white"
              style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}
            >
              ✉️ Send Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('spent');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    let list = customers;
    if (filter !== 'all') list = list.filter(c => c.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
      );
    }
    if (sort === 'spent')  list = [...list].sort((a, b) => b.totalSpent - a.totalSpent);
    if (sort === 'orders') list = [...list].sort((a, b) => b.orders - a.orders);
    if (sort === 'recent') list = [...list].sort((a, b) => b.lastOrder.localeCompare(a.lastOrder));
    if (sort === 'name')   list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [customers, search, filter, sort]);

  const toggleBlock = (id) => {
    setCustomers(prev => prev.map(c =>
      c.id === id ? { ...c, status: c.status === 'active' ? 'blocked' : 'active' } : c
    ));
    if (selected?.id === id) {
      setSelected(prev => ({ ...prev, status: prev.status === 'active' ? 'blocked' : 'active' }));
    }
  };

  const AVATAR_COLORS_LIST = AVATAR_COLORS;
  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const activeCount  = customers.filter(c => c.status === 'active').length;
  const blockedCount = customers.filter(c => c.status === 'blocked').length;

  return (
    <div className="p-4 md:p-6 space-y-6">
      
      <div>
        <h1 className="text-xl font-bold text-gray-900">Customers</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your customer accounts and history.</p>
      </div>

      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: '👥', label: 'Total Customers', value: customers.length,              color: 'bg-blue-50'   },
          { icon: '✅', label: 'Active',           value: activeCount,                  color: 'bg-green-50'  },
          { icon: '🚫', label: 'Blocked',          value: blockedCount,                 color: 'bg-red-50'    },
          { icon: '💰', label: 'Total Revenue',    value: `$${(totalRevenue/1000).toFixed(0)}k`, color: 'bg-orange-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${s.color} mb-3`}>
              {s.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-100">
          
          <div className="relative flex-1 min-w-48">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search customers…"
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
            />
          </div>

          
          <div className="flex gap-1.5">
            {['all','active','blocked'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                  filter === f
                    ? 'text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={filter === f ? { background: 'linear-gradient(135deg,#e8517a,#f4874b)' } : {}}
              >
                {f}
              </button>
            ))}
          </div>

          
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 text-gray-600 bg-white"
          >
            <option value="spent">Sort: Highest Spend</option>
            <option value="orders">Sort: Most Orders</option>
            <option value="recent">Sort: Most Recent</option>
            <option value="name">Sort: Name A–Z</option>
          </select>

          <p className="text-xs text-gray-400 ml-auto">{filtered.length} customer{filtered.length !== 1 ? 's' : ''}</p>
        </div>

        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Location</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Spent</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c, i) => {
                const colorIdx = c.id.charCodeAt(1) % AVATAR_COLORS_LIST.length;
                return (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <button
                        onClick={() => setSelected(c)}
                        className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
                      >
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${AVATAR_COLORS_LIST[colorIdx]} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
                          {c.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{c.name}</p>
                          <p className="text-xs text-gray-400 truncate">{c.email}</p>
                        </div>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">{c.location}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">{c.orders}</td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900">${c.totalSpent.toLocaleString()}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelected(c)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => toggleBlock(c.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            c.status === 'active'
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-green-50 text-green-600 hover:bg-green-100'
                          }`}
                        >
                          {c.status === 'active' ? 'Block' : 'Unblock'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-3xl mb-2">👥</p>
              <p className="font-medium">No customers found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      
      {selected && (
        <CustomerDetailModal
          customer={selected}
          onClose={() => setSelected(null)}
          onToggleBlock={toggleBlock}
        />
      )}
    </div>
  );
}

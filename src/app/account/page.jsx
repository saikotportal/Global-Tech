'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthContext } from '@/context/AuthContext';
import { useToastContext } from '@/context/ToastContext';
import Modal from '@/components/ui/Modal';

const MOCK_ORDERS = [
  { id: 'GT-102938', date: '2025-05-20', status: 'Delivered',   total: 1199, items: ['iPhone 16 Pro Max'],       tracking: 'GT1029381234US', eta: 'Delivered May 23',  steps: ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'], currentStep: 4 },
  { id: 'GT-098712', date: '2025-05-10', status: 'Shipped',     total: 349,  items: ['Sony WH-1000XM6'],         tracking: 'GT0987122345US', eta: 'Est. arrival May 15', steps: ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'], currentStep: 2 },
  { id: 'GT-087341', date: '2025-04-28', status: 'Processing',  total: 2499, items: ['MacBook Pro 16" M4 Max'],  tracking: 'GT0873413456US', eta: 'Est. arrival May 5',  steps: ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'], currentStep: 1 },
];

function OrderTracker({ order }) {
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-500">Tracking: {order.tracking}</span>
        <span className="text-xs font-semibold text-orange-500">{order.eta}</span>
      </div>
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 right-0 top-3 h-0.5 bg-gray-200">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${(order.currentStep / (order.steps.length - 1)) * 100}%`, background: 'linear-gradient(135deg, #e8517a, #f4874b)' }}
          />
        </div>
        {order.steps.map((step, i) => (
          <div key={step} className="relative flex flex-col items-center gap-1.5 z-10">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                i <= order.currentStep
                  ? 'border-orange-400 text-white'
                  : 'border-gray-300 bg-white text-gray-300'
              }`}
              style={i <= order.currentStep ? { background: 'linear-gradient(135deg, #e8517a, #f4874b)' } : {}}
            >
              {i < order.currentStep ? '✓' : i === order.currentStep ? '●' : '○'}
            </div>
            <span className={`text-center leading-tight hidden sm:block ${i <= order.currentStep ? 'text-orange-500 font-semibold' : 'text-gray-400'}`} style={{ fontSize: '9px', maxWidth: '52px' }}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const MOCK_WISHLIST = [
  { id: 5,  name: 'LG C4 77" OLED 4K TV', price: 1799, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=120&q=80' },
  { id: 9,  name: 'PS5 Pro',              price: 699,  image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=120&q=80' },
  { id: 11, name: 'Sony A7R V',           price: 3499, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=120&q=80' },
];

const MOCK_ADDRESSES = [
  { id: 1, name: 'Home',   addr: '123 Main St, New York, NY 10001' },
  { id: 2, name: 'Office', addr: '456 5th Ave, New York, NY 10018' },
];

const STATUS_STYLES = {
  Delivered:  'bg-green-100 text-green-700',
  Shipped:    'bg-blue-100 text-blue-700',
  Processing: 'bg-yellow-100 text-yellow-700',
};

const BRAND_BTN = { background: 'linear-gradient(135deg, #e8517a, #f4874b)' };

function LoginModal({ isOpen, onClose, onLogin }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setForm({ name: '', email: '', password: '' });
      setError('');
    }
  }, [isOpen, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email.trim()) { setError('Email is required.'); return; }
    if (!form.password.trim()) { setError('Password is required.'); return; }
    if (mode === 'register' && !form.name.trim()) { setError('Full name is required.'); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 300));

    const userData = {
      name:  mode === 'register' ? form.name.trim() : (form.email.split('@')[0] || 'User'),
      email: form.email.trim(),
    };
    onLogin(userData);
    onClose();
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'login' ? 'Sign In' : 'Create Account'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="John Smith"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
          style={BRAND_BTN}
        >
          {loading && (
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          )}
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>

        {mode === 'login' && (
          <p className="text-xs text-center text-gray-400">
            Forgot your password?{' '}
            <button type="button" className="text-orange-500 hover:underline">Reset it here</button>
          </p>
        )}

        <div className="border-t border-gray-100 pt-3">
          <p className="text-sm text-center text-gray-500">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-orange-500 font-semibold hover:underline"
            >
              {mode === 'login' ? 'Register free' : 'Sign In'}
            </button>
          </p>
        </div>
      </form>
    </Modal>
  );
}

function AccountPageInner() {
  const searchParams = useSearchParams();
  const { user, login, logout } = useAuthContext();
  const { toast } = useToastContext();
  const [tab, setTab] = useState('dashboard');
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (!user || searchParams.get('login') === 'true') {
      setShowLogin(true);
    } else {
      setShowLogin(false);
    }
  }, [user, searchParams]);

  useEffect(() => {
    const urlTab = searchParams.get('tab');
    if (urlTab) setTab(urlTab);
  }, [searchParams]);

  const TABS = [
    { id: 'dashboard', label: '🏠 Dashboard' },
    { id: 'orders',    label: '📦 Orders' },
    { id: 'wishlist',  label: '❤️ Wishlist' },
    { id: 'addresses', label: '📍 Addresses' },
    { id: 'profile',   label: '⚙️ Settings' },
    { id: 'loyalty',   label: '👑 Rewards' },
  ];

  const handleLogin = (userData) => {
    login(userData);
    toast.success(`Welcome${userData.name ? ', ' + userData.name : ''}! You're signed in.`);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoginModal
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
        />
        <div className="text-center px-4">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-50 to-orange-50 flex items-center justify-center">
            <svg className="w-12 h-12 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Sign in to your account</h1>
          <p className="text-gray-500 mb-6 max-w-xs mx-auto">Access your orders, wishlist, and profile settings.</p>
          <button
            onClick={() => setShowLogin(true)}
            className="text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition"
            style={BRAND_BTN}
          >
            Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <LoginModal
        isOpen={showLogin && !user}
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
      />

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
            <p className="text-gray-500 text-sm">Welcome back, <span className="font-semibold text-orange-500">{user.name}</span>!</p>
          </div>
          <button
            onClick={() => { logout(); toast.info('Signed out successfully.'); }}
            className="text-sm text-red-500 hover:text-red-700 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition"
          >
            Sign Out
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          <div className="w-full lg:w-56 bg-white rounded-2xl shadow-sm p-3 h-fit">
            
            <div className="flex items-center gap-3 px-3 py-3 mb-3 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={BRAND_BTN}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-dark-800 truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
            {TABS.map(({ id, label }) => (
              id === 'loyalty'
                ? <Link
                    key={id}
                    href="/loyalty"
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition mb-1 block text-gray-600 hover:bg-gray-50"
                  >
                    {label}
                  </Link>
                : <button
                    key={id}
                    onClick={() => setTab(id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition mb-1 ${
                      tab === id ? 'text-white' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    style={tab === id ? BRAND_BTN : {}}
                  >
                    {label}
                  </button>
            ))}
          </div>

          
          <div className="flex-1 bg-white rounded-2xl shadow-sm p-6">

            {tab === 'dashboard' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Dashboard</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="rounded-xl p-4 text-center" style={{ background: 'linear-gradient(135deg,#fdf2f8,#fff7ed)' }}>
                    <div className="text-2xl font-bold text-orange-500">{MOCK_ORDERS.length}</div>
                    <div className="text-sm text-orange-400 mt-1">Total Orders</div>
                  </div>
                  <div className="bg-pink-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-pink-600">{MOCK_WISHLIST.length}</div>
                    <div className="text-sm text-pink-500 mt-1">Wishlist Items</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{MOCK_ADDRESSES.length}</div>
                    <div className="text-sm text-green-500 mt-1">Saved Addresses</div>
                  </div>
                </div>

                
                <div className="rounded-2xl p-5 mb-6 flex items-center justify-between gap-4" style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl flex-shrink-0">
                      👑
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg leading-tight">Gold Member</div>
                      <div className="text-purple-100 text-sm">2,450 points available</div>
                      <div className="mt-2 bg-white/20 rounded-full h-2 w-40">
                        <div className="bg-white rounded-full h-2" style={{ width: '62%' }} />
                      </div>
                      <div className="text-purple-200 text-xs mt-1">1,550 pts to Platinum</div>
                    </div>
                  </div>
                  <Link
                    href="/loyalty"
                    className="flex-shrink-0 bg-white text-purple-700 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-purple-50 transition"
                  >
                    View Rewards →
                  </Link>
                </div>
                <h3 className="font-semibold text-gray-700 mb-3">Recent Orders</h3>
                <div className="space-y-3">
                  {MOCK_ORDERS.slice(0, 2).map((o) => (
                    <div key={o.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                      <div>
                        <div className="font-medium text-sm text-gray-800">{o.id}</div>
                        <div className="text-xs text-gray-500">{o.items.join(', ')}</div>
                        <div className="text-xs text-orange-400 mt-0.5">{o.eta}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                        <span className="text-sm font-bold">${o.total.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'orders' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Order History</h2>
                <div className="space-y-4">
                  {MOCK_ORDERS.map((o) => (
                    <div key={o.id} className="border border-gray-200 rounded-xl p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-bold text-gray-800">{o.id}</div>
                          <div className="text-xs text-gray-500 mt-0.5">Placed on {o.date}</div>
                        </div>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">{o.items.join(', ')}</div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-800">${o.total.toLocaleString()}</span>
                        <button className="text-sm text-orange-500 hover:underline">View Details</button>
                      </div>
                      <OrderTracker order={o} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'wishlist' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-6">My Wishlist</h2>
                {MOCK_WISHLIST.length === 0 ? (
                  <div className="text-center text-gray-400 py-12">
                    <div className="text-4xl mb-3">❤️</div>
                    <p>Your wishlist is empty.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {MOCK_WISHLIST.map((p) => (
                      <div key={p.id} className="border border-gray-200 rounded-xl p-4 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-xl overflow-hidden mb-3 bg-gray-50">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover"
                            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/96x96/f5f5f5/999?text=Product`; }} />
                        </div>
                        <div className="text-sm font-semibold text-gray-800 mb-1">{p.name}</div>
                        <div className="font-bold mb-3" style={{ color: '#e8517a' }}>${p.price.toLocaleString()}</div>
                        <button
                          className="w-full text-white text-sm py-2 rounded-lg hover:opacity-90 transition"
                          style={BRAND_BTN}
                          onClick={() => toast.success(`${p.name} added to cart!`)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'addresses' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Saved Addresses</h2>
                <div className="space-y-4">
                  {MOCK_ADDRESSES.map((a) => (
                    <div key={a.id} className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-800 text-sm">{a.name}</div>
                        <div className="text-sm text-gray-500 mt-0.5">{a.addr}</div>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-xs text-orange-500 hover:underline">Edit</button>
                        <button className="text-xs text-red-500 hover:underline">Remove</button>
                      </div>
                    </div>
                  ))}
                  <button className="w-full border-2 border-dashed border-gray-300 rounded-xl py-4 text-gray-500 text-sm hover:border-orange-400 hover:text-orange-500 transition">
                    + Add New Address
                  </button>
                </div>
              </div>
            )}

            {tab === 'profile' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Profile Settings</h2>
                <div className="space-y-4 max-w-md">
                  {[
                    { label: 'Full Name',      defaultValue: user.name,  type: 'text' },
                    { label: 'Email Address',  defaultValue: user.email, type: 'email' },
                  ].map(({ label, defaultValue, type }) => (
                    <div key={label}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <input type={type} defaultValue={defaultValue}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input type="password" placeholder="Leave blank to keep current"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all" />
                  </div>
                  <button
                    onClick={() => toast.success('Profile updated!')}
                    className="text-white px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition"
                    style={BRAND_BTN}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 rounded-full border-4 border-orange-400 border-t-transparent"/></div>}>
      <AccountPageInner />
    </Suspense>
  );
}

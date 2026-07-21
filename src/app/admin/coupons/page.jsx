'use client';
import { useState, useMemo } from 'react';
import { COUPONS as INITIAL_COUPONS, calcDiscount } from '@/lib/coupons';

const seedCoupons = () =>
  Object.entries(INITIAL_COUPONS).map(([code, c], i) => ({
    code,
    type:      c.type,
    value:     c.value,
    minOrder:  c.minOrder,
    label:     c.label,
    uses:      [241, 87, 134, 62, 19][i] ?? 0,
    maxUses:   [500, 200, 300, 150, 50][i] ?? 100,
    active:    true,
    expires:   ['2026-12-31','2026-08-31','2026-07-15','2026-09-30','2026-06-30'][i] ?? '2026-12-31',
  }));

const EMPTY = {
  code: '', type: 'percent', value: '', minOrder: '', label: '',
  maxUses: '', expires: '', active: true,
};

const TYPE_META = {
  percent:  { label: 'Percentage Off', icon: '%',  color: 'bg-blue-100 text-blue-700'   },
  fixed:    { label: 'Fixed Amount',   icon: '$',  color: 'bg-green-100 text-green-700'  },
  shipping: { label: 'Free Shipping',  icon: '🚚', color: 'bg-purple-100 text-purple-700'},
};

function CouponModal({ coupon, onSave, onClose }) {
  const isEdit = !!coupon?.code && !coupon._new;
  const [form, setForm] = useState(
    coupon
      ? { ...coupon }
      : { ...EMPTY }
  );
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.code.trim()) e.code = 'Required';
    else if (!/^[A-Z0-9_-]{2,20}$/.test(form.code.toUpperCase())) e.code = 'Uppercase letters/numbers only, 2–20 chars';
    if (!form.label.trim()) e.label = 'Required';
    if (form.type !== 'shipping') {
      if (!form.value || isNaN(form.value) || +form.value <= 0) e.value = 'Valid value required';
      if (form.type === 'percent' && +form.value > 100) e.value = 'Max 100%';
    }
    if (!form.maxUses || isNaN(form.maxUses) || +form.maxUses < 1) e.maxUses = 'Must be ≥ 1';
    if (!form.expires) e.expires = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      ...form,
      code:     form.code.toUpperCase().trim(),
      value:    form.type === 'shipping' ? 0 : Number(form.value),
      minOrder: Number(form.minOrder) || 0,
      maxUses:  Number(form.maxUses),
      uses:     coupon?.uses ?? 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col z-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg">{isEdit ? 'Edit Coupon' : 'New Coupon'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Coupon Code *</label>
            <input
              value={form.code}
              onChange={e => set('code', e.target.value.toUpperCase())}
              disabled={isEdit}
              placeholder="e.g. SUMMER25"
              className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 font-mono tracking-widest uppercase ${errors.code ? 'border-red-400' : 'border-gray-200'} ${isEdit ? 'bg-gray-50 text-gray-500' : ''}`}
            />
            {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code}</p>}
          </div>

          
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Description *</label>
            <input
              value={form.label}
              onChange={e => set('label', e.target.value)}
              placeholder="e.g. 25% off your order"
              className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 ${errors.label ? 'border-red-400' : 'border-gray-200'}`}
            />
            {errors.label && <p className="text-xs text-red-500 mt-1">{errors.label}</p>}
          </div>

          
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Discount Type *</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(TYPE_META).map(([t, meta]) => (
                <button
                  key={t}
                  onClick={() => set('type', t)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    form.type === t
                      ? 'border-orange-300 text-white shadow-sm'
                      : 'border-gray-200 text-gray-600 hover:border-orange-200'
                  }`}
                  style={form.type === t ? { background: 'linear-gradient(135deg,#e8517a,#f4874b)' } : {}}
                >
                  {meta.icon} {meta.label}
                </button>
              ))}
            </div>
          </div>

          
          <div className="grid grid-cols-2 gap-3">
            {form.type !== 'shipping' && (
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  {form.type === 'percent' ? 'Discount %' : 'Amount ($)'} *
                </label>
                <input
                  type="number"
                  value={form.value}
                  onChange={e => set('value', e.target.value)}
                  placeholder={form.type === 'percent' ? '10' : '50'}
                  className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 ${errors.value ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.value && <p className="text-xs text-red-500 mt-1">{errors.value}</p>}
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Min. Order ($)</label>
              <input
                type="number"
                value={form.minOrder}
                onChange={e => set('minOrder', e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>
          </div>

          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Max Uses *</label>
              <input
                type="number"
                value={form.maxUses}
                onChange={e => set('maxUses', e.target.value)}
                placeholder="100"
                className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 ${errors.maxUses ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.maxUses && <p className="text-xs text-red-500 mt-1">{errors.maxUses}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Expires *</label>
              <input
                type="date"
                value={form.expires}
                onChange={e => set('expires', e.target.value)}
                className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 ${errors.expires ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.expires && <p className="text-xs text-red-500 mt-1">{errors.expires}</p>}
            </div>
          </div>

          
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">Active</p>
              <p className="text-xs text-gray-500">Customers can apply this code at checkout</p>
            </div>
            <button
              onClick={() => set('active', !form.active)}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.active ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.active ? 'translate-x-5' : ''}`} />
            </button>
          </div>
        </div>

        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}
          >
            {isEdit ? 'Save Changes' : 'Create Coupon'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState(seedCoupons);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = useMemo(() => {
    let list = coupons;
    if (typeFilter !== 'all') list = list.filter(c => c.type === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c => c.code.toLowerCase().includes(q) || c.label.toLowerCase().includes(q));
    }
    return list;
  }, [coupons, search, typeFilter]);

  const handleSave = (saved) => {
    setCoupons(prev => {
      const idx = prev.findIndex(c => c.code === saved.code);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [...prev, saved];
    });
    setEditing(null);
    setCreating(false);
  };

  const handleDelete = (code) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
    setDeleteConfirm(null);
  };

  const toggleActive = (code) => {
    setCoupons(prev => prev.map(c => c.code === code ? { ...c, active: !c.active } : c));
  };

  const totalUses = coupons.reduce((s, c) => s + c.uses, 0);
  const activeCoupons = coupons.filter(c => c.active).length;
  const expiringCount = coupons.filter(c => {
    const days = (new Date(c.expires) - new Date()) / 86400000;
    return days >= 0 && days <= 30;
  }).length;

  return (
    <div className="p-4 md:p-6 space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Coupons</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage discount codes and promotions.</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          New Coupon
        </button>
      </div>

      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: '🎟️', label: 'Total Coupons', value: coupons.length,  color: 'bg-purple-50' },
          { icon: '✅', label: 'Active',         value: activeCoupons,   color: 'bg-green-50'  },
          { icon: '⚡', label: 'Total Uses',     value: totalUses,       color: 'bg-blue-50'   },
          { icon: '⏰', label: 'Expiring Soon',  value: expiringCount,   color: 'bg-orange-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${s.color} mb-3`}>{s.icon}</div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-100">
          <div className="relative flex-1 min-w-40">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search coupons…"
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>

          <div className="flex gap-1.5">
            {['all','percent','fixed','shipping'].map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                  typeFilter === t ? 'text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={typeFilter === t ? { background: 'linear-gradient(135deg,#e8517a,#f4874b)' } : {}}
              >
                {t === 'all' ? 'All Types' : TYPE_META[t]?.label || t}
              </button>
            ))}
          </div>
        </div>

        
        <div className="p-4 grid gap-3">
          {filtered.map(c => {
            const meta = TYPE_META[c.type];
            const usePct = Math.min(100, Math.round((c.uses / c.maxUses) * 100));
            const daysLeft = Math.ceil((new Date(c.expires) - new Date()) / 86400000);
            const expired = daysLeft < 0;
            const expiringSoon = !expired && daysLeft <= 30;

            return (
              <div
                key={c.code}
                className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl border transition-all ${
                  c.active && !expired ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'
                }`}
              >
                
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold flex-shrink-0 ${meta.color}`}>
                    {meta.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-gray-900 tracking-widest text-sm">{c.code}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${meta.color}`}>{meta.label}</span>
                      {expired && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-700">Expired</span>}
                      {expiringSoon && !expired && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-yellow-100 text-yellow-700">Expiring soon</span>}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{c.label}</p>
                  </div>
                </div>

                
                <div className="flex gap-6 sm:gap-8 text-center sm:text-left flex-shrink-0">
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {c.type === 'percent' ? `${c.value}%` : c.type === 'fixed' ? `$${c.value}` : 'Free Ship'}
                    </p>
                    <p className="text-[10px] text-gray-400">Discount</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{c.uses}/{c.maxUses}</p>
                    <p className="text-[10px] text-gray-400">Uses</p>
                    <div className="h-1 w-16 bg-gray-200 rounded-full mt-1 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${usePct}%`, background: 'linear-gradient(90deg,#e8517a,#f4874b)' }} />
                    </div>
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${expired ? 'text-red-600' : expiringSoon ? 'text-yellow-600' : 'text-gray-900'}`}>
                      {expired ? 'Expired' : `${daysLeft}d`}
                    </p>
                    <p className="text-[10px] text-gray-400">Expires</p>
                  </div>
                </div>

                
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleActive(c.code)}
                    className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${c.active ? 'bg-green-500' : 'bg-gray-300'}`}
                    title={c.active ? 'Deactivate' : 'Activate'}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${c.active ? 'translate-x-5' : ''}`} />
                  </button>
                  <button
                    onClick={() => setEditing(c)}
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(c.code)}
                    className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-3xl mb-2">🎟️</p>
              <p className="font-medium">No coupons found</p>
            </div>
          )}
        </div>
      </div>

      
      {(editing || creating) && (
        <CouponModal
          coupon={editing}
          onSave={handleSave}
          onClose={() => { setEditing(null); setCreating(false); }}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm z-10 text-center">
            <p className="text-3xl mb-3">🗑️</p>
            <h3 className="font-bold text-gray-900 text-lg mb-1">Delete Coupon</h3>
            <p className="text-sm text-gray-500 mb-5">
              Delete <span className="font-mono font-bold text-gray-900">{deleteConfirm}</span>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

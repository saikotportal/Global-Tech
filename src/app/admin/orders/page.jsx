'use client';
import { useState, useMemo } from 'react';

const STATUSES = ['all', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

const STATUS_STYLES = {
  processing: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500', label: 'Processing' },
  shipped:    { bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-500',   label: 'Shipped'    },
  delivered:  { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500',  label: 'Delivered'  },
  cancelled:  { bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500',    label: 'Cancelled'  },
  refunded:   { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500', label: 'Refunded'   },
};

const MOCK_ORDERS = [
  { id:'GT-10041', customer:'Sarah Johnson',    email:'sarah@email.com',    total:2499, status:'delivered',  date:'2026-05-30', items:[{name:'MacBook Pro 16" M4 Max',qty:1,price:2499}],    shipping:'Express',  address:'123 Oak Ave, New York, NY 10001',    coupon:null,     payment:'Visa ···4242' },
  { id:'GT-10040', customer:'James Liu',         email:'james@email.com',    total:1799, status:'shipped',    date:'2026-05-30', items:[{name:'LG C4 77" OLED 4K TV',qty:1,price:1799}],       shipping:'Standard', address:'88 Main St, San Francisco, CA 94102', coupon:'SAVE10', payment:'Mastercard ···8822' },
  { id:'GT-10039', customer:'Priya Sharma',      email:'priya@email.com',    total:699,  status:'processing', date:'2026-05-29', items:[{name:'PS5 Pro',qty:1,price:699}],                     shipping:'Standard', address:'45 Park Rd, Austin, TX 78701',        coupon:null,     payment:'PayPal' },
  { id:'GT-10038', customer:'Carlos Rivera',     email:'carlos@email.com',   total:3499, status:'delivered',  date:'2026-05-29', items:[{name:'Apple Vision Pro',qty:1,price:3499}],           shipping:'Express',  address:'200 Elm St, Miami, FL 33101',         coupon:'GT100',  payment:'Amex ···3737' },
  { id:'GT-10037', customer:'Emma Wilson',       email:'emma@email.com',     total:349,  status:'delivered',  date:'2026-05-28', items:[{name:'Sony WH-1000XM6',qty:1,price:349}],             shipping:'Standard', address:'9 Rose Ln, Seattle, WA 98101',        coupon:null,     payment:'Visa ···1111' },
  { id:'GT-10036', customer:'Mohammed Al-Farsi', email:'mo@email.com',       total:1899, status:'cancelled',  date:'2026-05-28', items:[{name:'DJI Mavic 4 Pro',qty:1,price:1899}],            shipping:'Express',  address:'77 Palm Ave, Phoenix, AZ 85001',      coupon:'TECH50', payment:'Visa ···9900' },
  { id:'GT-10035', customer:'Yuki Tanaka',       email:'yuki@email.com',     total:799,  status:'shipped',    date:'2026-05-27', items:[{name:'Apple Watch Ultra 3',qty:1,price:799}],          shipping:'Standard', address:'34 Cherry Blvd, Chicago, IL 60601',   coupon:null,     payment:'Mastercard ···5566' },
  { id:'GT-10034', customer:'Lisa Park',         email:'lisa@email.com',     total:599,  status:'delivered',  date:'2026-05-27', items:[{name:'Xbox Series X 2TB',qty:1,price:599}],            shipping:'Standard', address:'12 Maple Dr, Boston, MA 02101',       coupon:null,     payment:'Visa ···7788' },
  { id:'GT-10033', customer:'Tom Bradley',       email:'tom@email.com',      total:1099, status:'delivered',  date:'2026-05-26', items:[{name:'DJI Air 3S',qty:1,price:1099}],                  shipping:'Express',  address:'56 Cedar St, Denver, CO 80201',       coupon:'FREESHIP', payment:'PayPal' },
  { id:'GT-10032', customer:'Aisha Okafor',      email:'aisha@email.com',    total:2199, status:'processing', date:'2026-05-26', items:[{name:'ASUS ROG Zephyrus G16',qty:1,price:2199}],       shipping:'Standard', address:'3 Birch Way, Atlanta, GA 30301',      coupon:null,     payment:'Visa ···4455' },
  { id:'GT-10031', customer:'Raj Patel',         email:'raj@email.com',      total:449,  status:'shipped',    date:'2026-05-25', items:[{name:'Nintendo Switch 2',qty:1,price:449}],             shipping:'Standard', address:'21 Lotus Rd, Houston, TX 77001',      coupon:null,     payment:'Mastercard ···3399' },
  { id:'GT-10030', customer:'Nina Volkova',      email:'nina@email.com',     total:4299, status:'delivered',  date:'2026-05-25', items:[{name:'Canon EOS R5 Mark II',qty:1,price:4299}],        shipping:'Express',  address:'8 Oak Pl, Portland, OR 97201',        coupon:'GT100',  payment:'Amex ···2828' },
  { id:'GT-10029', customer:'Ben Carter',        email:'ben@email.com',      total:299,  status:'refunded',   date:'2026-05-24', items:[{name:'Meta Quest 3S',qty:1,price:299}],                 shipping:'Standard', address:'15 Ash St, Las Vegas, NV 89101',      coupon:null,     payment:'Visa ···6677' },
  { id:'GT-10028', customer:'Lena Schmidt',      email:'lena@email.com',     total:999,  status:'delivered',  date:'2026-05-24', items:[{name:'Garmin Fenix 8 Sapphire',qty:1,price:999}],      shipping:'Express',  address:'77 Pine Ave, Minneapolis, MN 55401',  coupon:'SAVE10', payment:'Mastercard ···1234' },
  { id:'GT-10027', customer:'David Kim',         email:'david@email.com',    total:3499, status:'shipped',    date:'2026-05-23', items:[{name:'Sony A7R V',qty:1,price:3499}],                   shipping:'Express',  address:'5 Redwood Blvd, San Diego, CA 92101', coupon:null,     payment:'Visa ···5544' },
];

const NEXT_STATUS = {
  processing: 'shipped',
  shipped: 'delivered',
};

function OrderDetailModal({ order, onClose, onStatusChange }) {
  const st = STATUS_STYLES[order.status];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}/>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col z-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900">Order {order.id}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{order.date}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${st.bg} ${st.text}`}>
              <span className={`w-2 h-2 rounded-full ${st.dot}`}/>
              {st.label}
            </span>
            {NEXT_STATUS[order.status] && (
              <button
                onClick={() => onStatusChange(order.id, NEXT_STATUS[order.status])}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
                Mark as {NEXT_STATUS[order.status]} →
              </button>
            )}
          </div>

          
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Customer</p>
            <p className="font-semibold text-gray-900">{order.customer}</p>
            <p className="text-sm text-gray-500">{order.email}</p>
            <p className="text-sm text-gray-500 mt-1">{order.address}</p>
          </div>

          
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Items</p>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">${(item.price * item.qty).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Payment</p>
              <p className="text-sm font-medium text-gray-900">{order.payment}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Shipping</p>
              <p className="text-sm font-medium text-gray-900">{order.shipping}</p>
            </div>
          </div>

          
          <div className="flex justify-between items-center py-3 border-t border-gray-200">
            {order.coupon && <p className="text-xs text-green-600 font-semibold">🎟️ Coupon: {order.coupon}</p>}
            <p className="text-lg font-bold text-gray-900 ml-auto">Total: ${order.total.toLocaleString()}</p>
          </div>

          
          <div className="flex gap-3">
            {order.status === 'processing' && (
              <button onClick={() => { onStatusChange(order.id, 'cancelled'); onClose(); }}
                className="flex-1 px-4 py-2.5 border border-red-200 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors">
                Cancel Order
              </button>
            )}
            {order.status === 'delivered' && (
              <button onClick={() => { onStatusChange(order.id, 'refunded'); onClose(); }}
                className="flex-1 px-4 py-2.5 border border-purple-200 text-purple-600 rounded-xl text-sm font-semibold hover:bg-purple-50 transition-colors">
                Issue Refund
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrders() {
  const [orders, setOrders]       = useState(MOCK_ORDERS);
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState('all');
  const [selected, setSelected]   = useState(null);
  const [page, setPage]           = useState(1);
  const PER_PAGE = 10;

  const filtered = useMemo(() => {
    let list = [...orders];
    if (search) list = list.filter(o =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase())
    );
    if (statusFilter !== 'all') list = list.filter(o => o.status === statusFilter);
    return list;
  }, [orders, search, statusFilter]);

  const pageCount = Math.ceil(filtered.length / PER_PAGE);
  const paged     = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleStatusChange = (id, newStatus) => {
    setOrders(os => os.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const counts = useMemo(() => {
    const c = {};
    STATUSES.forEach(s => { c[s] = s === 'all' ? orders.length : orders.filter(o => o.status === s).length; });
    return c;
  }, [orders]);

  const totalRevenue = orders.filter(o => !['cancelled','refunded'].includes(o.status)).reduce((s,o) => s + o.total, 0);

  const inp = "border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white";

  return (
    <div className="p-4 md:p-6 space-y-5">
      
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500">{orders.length} total · ${totalRevenue.toLocaleString()} revenue</p>
        </div>
      </div>

      
      <div className="flex gap-2 flex-wrap">
        {STATUSES.map(s => {
          const st = s === 'all' ? null : STATUS_STYLES[s];
          const active = statusFilter === s;
          return (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(1); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                active
                  ? 'text-white border-transparent shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300'
              }`}
              style={active ? { background: 'linear-gradient(135deg,#e8517a,#f4874b)' } : {}}
            >
              {st && <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}/>}
              <span className="capitalize">{s}</span>
              <span className={`${active ? 'bg-white/25' : 'bg-gray-100'} px-1.5 py-0.5 rounded-full text-[10px] font-bold`}>
                {counts[s]}
              </span>
            </button>
          );
        })}
      </div>

      
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <input className={`${inp} w-full`} placeholder="🔍  Search by order ID, customer name or email..."
          value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
      </div>

      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Shipping</th>
                <th className="px-4 py-3"/>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paged.map(order => {
                const st = STATUS_STYLES[order.status];
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-mono font-semibold text-gray-900 text-xs">{order.id}</p>
                      <p className="text-xs text-gray-400 sm:hidden">{order.customer}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <p className="font-medium text-gray-900">{order.customer}</p>
                      <p className="text-xs text-gray-400">{order.email}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-gray-600 text-xs">{order.date}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-gray-900">${order.total.toLocaleString()}</p>
                      {order.coupon && <p className="text-[10px] text-green-600">🎟️ {order.coupon}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${st.bg} ${st.text}`}>
                        <span className={`w-1 h-1 rounded-full ${st.dot}`}/>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-gray-600">{order.shipping}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelected(order)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 hover:border-orange-400 hover:text-orange-500 transition-colors">
                          View
                        </button>
                        {NEXT_STATUS[order.status] && (
                          <button onClick={() => handleStatusChange(order.id, NEXT_STATUS[order.status])}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-80 hidden lg:inline-flex"
                            style={{ background:'linear-gradient(135deg,#e8517a,#f4874b)' }}>
                            → {NEXT_STATUS[order.status]}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    <p className="text-4xl mb-2">🛒</p>
                    <p className="font-medium">No orders found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        
        {pageCount > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">{(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE,filtered.length)} of {filtered.length}</p>
            <div className="flex gap-1">
              <button disabled={page===1} onClick={() => setPage(p=>p-1)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 disabled:opacity-40 hover:border-orange-400 transition-colors">←</button>
              {Array.from({length:pageCount},(_,i)=>(
                <button key={i+1} onClick={()=>setPage(i+1)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${page===i+1?'text-white':'border border-gray-200 hover:border-orange-400'}`}
                  style={page===i+1?{background:'linear-gradient(135deg,#e8517a,#f4874b)'}:{}}>
                  {i+1}
                </button>
              ))}
              <button disabled={page===pageCount} onClick={() => setPage(p=>p+1)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 disabled:opacity-40 hover:border-orange-400 transition-colors">→</button>
            </div>
          </div>
        )}
      </div>

      
      {selected && (
        <OrderDetailModal
          order={selected}
          onClose={() => setSelected(null)}
          onStatusChange={(id, st) => {
            handleStatusChange(id, st);
            setSelected(o => o.id === id ? { ...o, status: st } : o);
          }}
        />
      )}
    </div>
  );
}

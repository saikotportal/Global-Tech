'use client';
import { useState, useMemo } from 'react';
import { PRODUCTS as INITIAL_PRODUCTS, CATEGORIES, BRANDS } from '@/lib/products';

const BADGE_OPTIONS = ['New', 'Hot', 'Sale', 'Deal', null];

const STATUS_COLOR = {
  true:  { bg: 'bg-green-100', text: 'text-green-700', label: 'In Stock'    },
  false: { bg: 'bg-red-100',   text: 'text-red-700',   label: 'Out of Stock' },
};

const EMPTY_PRODUCT = {
  id: null, name: '', category: '', brand: '', price: '', originalPrice: '',
  rating: 4.5, reviews: 0, inStock: true, stock: 10, badge: null,
  tags: [], image: '', description: '',
};

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col z-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

function ProductForm({ product, onSave, onClose }) {
  const [form, setForm] = useState({ ...product });
  const [errors, setErrors] = useState({});

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())        e.name     = 'Required';
    if (!form.category)           e.category = 'Required';
    if (!form.brand)              e.brand    = 'Required';
    if (!form.price || isNaN(form.price) || +form.price <= 0) e.price = 'Valid price required';
    if (!form.image.trim())       e.image    = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      ...form,
      id:            form.id ?? Date.now(),
      price:         +form.price,
      originalPrice: form.originalPrice ? +form.originalPrice : +form.price,
      stock:         +form.stock,
      inStock:       +form.stock > 0,
    });
  };

  const Field = ({ label, error, children }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );

  const inp = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Product Name *" error={errors.name}>
          <input className={`${inp} ${errors.name ? 'border-red-400' : ''}`} value={form.name}
            onChange={e => set('name', e.target.value)} placeholder="e.g. iPhone 16 Pro Max" />
        </Field>
        <Field label="Brand *" error={errors.brand}>
          <select className={`${inp} ${errors.brand ? 'border-red-400' : ''}`} value={form.brand}
            onChange={e => set('brand', e.target.value)}>
            <option value="">Select brand</option>
            {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </Field>
        <Field label="Category *" error={errors.category}>
          <select className={`${inp} ${errors.category ? 'border-red-400' : ''}`} value={form.category}
            onChange={e => set('category', e.target.value)}>
            <option value="">Select category</option>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
          </select>
        </Field>
        <Field label="Badge">
          <select className={inp} value={form.badge ?? ''} onChange={e => set('badge', e.target.value || null)}>
            <option value="">No badge</option>
            {BADGE_OPTIONS.filter(Boolean).map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </Field>
        <Field label="Price (USD) *" error={errors.price}>
          <input className={`${inp} ${errors.price ? 'border-red-400' : ''}`} type="number" min="0" step="0.01"
            value={form.price} onChange={e => set('price', e.target.value)} placeholder="0.00" />
        </Field>
        <Field label="Original Price (USD)">
          <input className={inp} type="number" min="0" step="0.01"
            value={form.originalPrice} onChange={e => set('originalPrice', e.target.value)}
            placeholder="Leave blank if no discount" />
        </Field>
        <Field label="Stock Quantity">
          <input className={inp} type="number" min="0"
            value={form.stock} onChange={e => set('stock', e.target.value)} />
        </Field>
        <Field label="Rating">
          <input className={inp} type="number" min="1" max="5" step="0.1"
            value={form.rating} onChange={e => set('rating', +e.target.value)} />
        </Field>
      </div>

      <Field label="Image URL *" error={errors.image}>
        <input className={`${inp} ${errors.image ? 'border-red-400' : ''}`} value={form.image}
          onChange={e => set('image', e.target.value)} placeholder="https://..." />
      </Field>

      {form.image && (
        <div className="w-24 h-24 rounded-xl overflow-hidden border border-gray-200">
          <img src={form.image} alt="preview" className="w-full h-full object-cover"
            onError={e => { e.target.style.display = 'none'; }} />
        </div>
      )}

      <Field label="Description">
        <textarea className={`${inp} resize-none`} rows={3} value={form.description}
          onChange={e => set('description', e.target.value)}
          placeholder="Brief product description..." />
      </Field>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2">Tags</label>
        <div className="flex gap-3">
          {['flash-deals', 'new-arrival', 'best-seller'].map(tag => (
            <label key={tag} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" className="rounded" checked={form.tags.includes(tag)}
                onChange={e => set('tags', e.target.checked
                  ? [...form.tags, tag]
                  : form.tags.filter(t => t !== tag))} />
              {tag}
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <button onClick={onClose}
          className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button onClick={handleSave}
          className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
          {form.id ? 'Save Changes' : 'Add Product'}
        </button>
      </div>
    </div>
  );
}

export default function AdminProducts() {
  const [products, setProducts]   = useState(INITIAL_PRODUCTS);
  const [search,   setSearch]     = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [sort,     setSort]       = useState('id-desc');
  const [modal,    setModal]      = useState(null);
  const [delId,    setDelId]      = useState(null);
  const [page,     setPage]       = useState(1);
  const PER_PAGE = 12;

  const filtered = useMemo(() => {
    let list = [...products];
    if (search)      list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()));
    if (catFilter)   list = list.filter(p => p.category === catFilter);
    if (stockFilter === 'in')  list = list.filter(p => p.inStock && p.stock > 5);
    if (stockFilter === 'low') list = list.filter(p => p.inStock && p.stock <= 5);
    if (stockFilter === 'out') list = list.filter(p => !p.inStock || p.stock === 0);
    const [key, dir] = sort.split('-');
    list.sort((a, b) => {
      const av = a[key], bv = b[key];
      return dir === 'asc'
        ? (typeof av === 'string' ? av.localeCompare(bv) : av - bv)
        : (typeof bv === 'string' ? bv.localeCompare(av) : bv - av);
    });
    return list;
  }, [products, search, catFilter, stockFilter, sort]);

  const pageCount = Math.ceil(filtered.length / PER_PAGE);
  const paged     = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSave = (prod) => {
    if (prod.id && products.find(p => p.id === prod.id)) {
      setProducts(ps => ps.map(p => p.id === prod.id ? prod : p));
    } else {
      setProducts(ps => [...ps, prod]);
    }
    setModal(null);
  };

  const handleDelete = (id) => {
    setProducts(ps => ps.filter(p => p.id !== id));
    setDelId(null);
  };

  const handleStockChange = (id, delta) => {
    setProducts(ps => ps.map(p => {
      if (p.id !== id) return p;
      const newStock = Math.max(0, p.stock + delta);
      return { ...p, stock: newStock, inStock: newStock > 0 };
    }));
  };

  const inp = "border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white";

  return (
    <div className="p-4 md:p-6 space-y-5">
      
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">{products.length} total · {filtered.length} shown</p>
        </div>
        <button
          onClick={() => setModal('add')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
          + Add Product
        </button>
      </div>

      
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-3">
          <input className={`${inp} flex-1 min-w-48`} placeholder="🔍  Search products or brand..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          <select className={inp} value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1); }}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
          </select>
          <select className={inp} value={stockFilter} onChange={e => { setStockFilter(e.target.value); setPage(1); }}>
            <option value="">All Stock</option>
            <option value="in">In Stock</option>
            <option value="low">Low Stock (≤5)</option>
            <option value="out">Out of Stock</option>
          </select>
          <select className={inp} value={sort} onChange={e => setSort(e.target.value)}>
            <option value="id-desc">Newest First</option>
            <option value="id-asc">Oldest First</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
            <option value="name-asc">Name A–Z</option>
            <option value="stock-asc">Stock ↑</option>
          </select>
        </div>
      </div>

      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Badge</th>
                <th className="px-4 py-3"/>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paged.map(product => {
                const st = STATUS_COLOR[String(product.inStock && product.stock > 0)];
                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-gray-100"
                          onError={e => { e.target.src = 'https://via.placeholder.com/40'; }} />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate max-w-[160px]">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.brand} · #{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-gray-600 capitalize">{product.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">${product.price.toLocaleString()}</p>
                      {product.originalPrice > product.price && (
                        <p className="text-xs text-gray-400 line-through">${product.originalPrice.toLocaleString()}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => handleStockChange(product.id, -1)}
                          className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:border-orange-400 hover:text-orange-500 transition-colors text-xs font-bold">
                          −
                        </button>
                        <span className={`min-w-[28px] text-center text-sm font-bold ${product.stock <= 3 ? 'text-red-600' : product.stock <= 5 ? 'text-yellow-600' : 'text-gray-900'}`}>
                          {product.stock}
                        </span>
                        <button onClick={() => handleStockChange(product.id, 1)}
                          className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:border-orange-400 hover:text-orange-500 transition-colors text-xs font-bold">
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${st.bg} ${st.text}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {product.badge ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold text-white"
                          style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
                          {product.badge}
                        </span>
                      ) : <span className="text-gray-300 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setModal(product)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                        </button>
                        <button onClick={() => setDelId(product.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    <p className="text-4xl mb-2">📦</p>
                    <p className="font-medium">No products found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        
        {pageCount > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-1">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 disabled:opacity-40 hover:border-orange-400 hover:text-orange-500 transition-colors">
                ←
              </button>
              {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => {
                const p = i + 1;
                return (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${page === p ? 'text-white' : 'border border-gray-200 hover:border-orange-400 hover:text-orange-500'}`}
                    style={page === p ? { background: 'linear-gradient(135deg,#e8517a,#f4874b)' } : {}}>
                    {p}
                  </button>
                );
              })}
              <button disabled={page === pageCount} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 disabled:opacity-40 hover:border-orange-400 hover:text-orange-500 transition-colors">
                →
              </button>
            </div>
          </div>
        )}
      </div>

      
      {modal && (
        <Modal
          title={modal === 'add' ? 'Add New Product' : `Edit: ${modal.name}`}
          onClose={() => setModal(null)}
        >
          <ProductForm
            product={modal === 'add' ? EMPTY_PRODUCT : modal}
            onSave={handleSave}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}

      
      {delId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDelId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full z-10 text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Delete Product?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDelId(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDelete(delId)}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

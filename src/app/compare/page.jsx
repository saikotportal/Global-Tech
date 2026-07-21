'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { PRODUCTS, CATEGORIES } from '@/lib/products';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { calcDiscount } from '@/utils/helpers';

const MAX_COMPARE = 3;

function buildSpecs(product) {
  const specMap = {
    phones:        ['Display', 'Processor', 'Camera', 'Battery', 'Storage', 'OS', 'Connectivity'],
    laptops:       ['Display', 'Processor', 'RAM', 'Storage', 'GPU', 'Battery Life', 'OS'],
    tvs:           ['Screen Size', 'Resolution', 'Panel Type', 'HDR', 'Refresh Rate', 'Smart OS', 'HDMI Ports'],
    gaming:        ['Type', 'Storage', 'Resolution', 'Frame Rate', 'Online', 'Backwards Compat.', 'Release Year'],
    audio:         ['Type', 'ANC', 'Battery Life', 'Driver Size', 'Connectivity', 'Codec', 'Water Resist.'],
    cameras:       ['Sensor', 'Resolution', 'Video', 'Autofocus', 'IBIS', 'Battery', 'Weather Seal'],
    smartwatch:    ['Display', 'Case Size', 'Battery Life', 'GPS', 'Health Sensors', 'Water Resist.', 'OS'],
    drones:        ['Camera', 'Max Flight Time', 'Range', 'Obstacle Sensing', 'Weight', 'Wind Resistance', 'Video'],
    vr:            ['Display', 'Resolution', 'FOV', 'Tracking', 'Controllers', 'Battery', 'Platform'],
    networking:    ['Standard', 'Max Speed', 'Bands', 'Ports', 'Coverage', 'Security', 'Smart Features'],
    desktop:       ['CPU', 'GPU', 'RAM', 'Storage', 'Cooling', 'PSU', 'OS'],
    entertainment: ['Type', 'Resolution', 'Audio', 'Smart Features', 'Connectivity', 'Ports', 'Power'],
    'smart-home':  ['Type', 'Connectivity', 'Display', 'Hub Support', 'Voice Assist.', 'Smart Protocols', 'Power'],
  };

  const fakeValues = {
    phones: [
      ['6.7" OLED 120Hz',       '6.7" AMOLED 144Hz',     '6.3" LTPO OLED',        '6.82" AMOLED+'],
      ['A18 Pro',                'Snapdragon 8 Elite',     'Tensor G4',              'Snapdragon 8 Elite'],
      ['48MP + 48MP + 12MP',    '200MP + 12MP + 10MP',   '50MP + 48MP + 48MP',    '50MP + 50MP + 8MP'],
      ['4685 mAh',               '5000 mAh',               '4700 mAh',               '6000 mAh'],
      ['256GB / 1TB',            '256GB / 1TB',            '128GB / 256GB',          '256GB / 512GB'],
      ['iOS 18',                 'Android 15',             'Android 15',             'Android 15'],
      ['5G / Wi-Fi 7',           '5G / Wi-Fi 7',           '5G / Wi-Fi 7',           '5G / Wi-Fi 6E'],
    ],
    laptops: [
      ['16" Liquid Retina XDR', '15.6" 3.5K OLED Touch', '16" QHD+ 240Hz',        '14" 2.8K OLED 120Hz'],
      ['Apple M4 Max',           'Intel Core Ultra 9',    'AMD Ryzen 9 7945HX',    'Intel Core Ultra 7'],
      ['48 GB unified',          '32 GB DDR5',            '32 GB DDR5',             '32 GB LPDDR5x'],
      ['1 TB NVMe SSD',          '1 TB NVMe SSD',         '2 TB NVMe SSD',          '1 TB NVMe SSD'],
      ['Apple 40-core GPU',      'NVIDIA RTX 4070',       'NVIDIA RTX 4090',        'Intel Arc'],
      ['Up to 22 hrs',           'Up to 13 hrs',          'Up to 10 hrs',           'Up to 15 hrs'],
      ['macOS 15',               'Windows 11 Pro',        'Windows 11 Home',        'Windows 11 Pro'],
    ],
    audio: [
      ['Over-ear',               'Over-ear',               'In-ear',                 'Over-ear'],
      ['Industry-leading',       'World-class',            'Adaptive ANC',           'Hybrid ANC'],
      ['40 hrs',                 '24 hrs',                 '32 hrs',                 '30 hrs'],
      ['40mm',                   '40mm',                   '11mm',                   '40mm'],
      ['Bluetooth 5.3',          'Bluetooth 5.3',          'Bluetooth 5.3',          'Bluetooth 5.2'],
      ['LDAC / AAC',             'aptX Adaptive',          'aptX Adaptive',          'LDAC / SBC'],
      ['IPX4',                   'IPX4',                   'IP57',                   'IPX4'],
    ],
  };

  const keys = specMap[product.category] || specMap.phones;
  const vals = fakeValues[product.category] || fakeValues.phones;
  const idx  = (product.id - 1) % 4;

  return keys.map((key, i) => ({ key, value: vals[i]?.[idx] ?? '—' }));
}

function SlotPicker({ onSelect, exclude }) {
  const [search, setSearch] = useState('');
  const [cat,    setCat]    = useState('');

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => !exclude.includes(p.id));
    if (cat)    list = list.filter((p) => p.category === cat);
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    return list.slice(0, 20);
  }, [search, cat, exclude]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-col sm:flex-row">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search…"
          autoFocus
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400"
        />
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400 bg-white"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
        </select>
      </div>
      <div className="overflow-y-auto max-h-72 space-y-1 pr-1">
        {filtered.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">No products found</p>
        )}
        {filtered.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            className="w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-colors"
          >
            <img
              src={p.image}
              alt={p.name}
              className="w-10 h-10 object-cover rounded-lg flex-shrink-0 bg-gray-100"
              onError={(e) => { e.target.src = `https://placehold.co/40x40/f5f5f5/999?text=${p.brand[0]}`; }}
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-dark-800 truncate leading-snug">{p.name}</p>
              <p className="text-xs text-gray-400">{p.brand}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, onRemove }) {
  const { format } = useCurrency();
  const { addItem } = useCart();
  const { toast }   = useToast();
  const disc        = calcDiscount(product.originalPrice, product.price);

  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden relative">
      <button
        onClick={onRemove}
        className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/90 border border-gray-200 text-gray-400 hover:text-red-400 hover:border-red-200 flex items-center justify-center text-sm transition-colors shadow-sm"
      >✕</button>

      <Link href={`/products/${product.id}`}>
        <div className="h-40 bg-gray-50 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.src = `https://placehold.co/300x200/f5f5f5/999?text=${encodeURIComponent(product.brand)}`; }}
          />
        </div>
      </Link>

      <div className="p-4">
        <p className="text-xs text-gray-400 font-medium">{product.brand}</p>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-dark-800 text-sm leading-snug hover:text-orange-500 transition-colors mt-0.5 mb-2 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mb-2">
          <span className="text-yellow-400 text-xs">{'★'.repeat(Math.round(product.rating))}</span>
          <span className="text-xs text-gray-400">{product.rating}</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-dark-800">{format(product.price)}</span>
          {disc > 0 && <span className="text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full font-bold">-{disc}%</span>}
        </div>
        <button
          onClick={() => { addItem(product); toast.success(`${product.name} added!`); }}
          disabled={!product.inStock}
          className="w-full py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}
        >
          {product.inStock ? '🛒 Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}

function EmptySlot({ index, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-orange-300 transition-colors flex flex-col items-center justify-center gap-3 text-center group"
      style={{ minHeight: '264px' }}
    >
      <div className="w-12 h-12 rounded-xl border-2 border-dashed border-gray-300 group-hover:border-orange-400 flex items-center justify-center text-2xl text-gray-300 group-hover:text-orange-400 transition-colors">+</div>
      <p className="text-sm font-medium text-gray-400 group-hover:text-orange-500 transition-colors">Add product {index + 1}</p>
    </button>
  );
}

export default function ComparePage() {
  const [slots,   setSlots]   = useState([null, null, null]);
  const [picking, setPicking] = useState(null);

  const activeProducts = slots.filter(Boolean);

  const specRows = activeProducts.length > 0 ? buildSpecs(activeProducts[0]).map(s => s.key) : [];

  const specsByProduct = useMemo(() => {
    const map = {};
    activeProducts.forEach((p) => {
      const specs = buildSpecs(p);
      map[p.id] = {};
      specs.forEach(({ key, value }) => { map[p.id][key] = value; });
    });
    return map;
  }, [activeProducts.map(p => p.id).join(',')]);

  function selectProduct(p) {
    setSlots((prev) => {
      const next = [...prev];
      next[picking] = p;
      return next;
    });
    setPicking(null);
  }

  function removeSlot(i) {
    setSlots((prev) => { const next = [...prev]; next[i] = null; return next; });
  }

  const excludedIds = slots.filter(Boolean).map((p) => p.id);

  const gridCols = `140px repeat(${MAX_COMPARE}, 1fr)`;

  return (
    <div className="container-custom py-10 sm:py-14">

      
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-dark-800 font-medium">Compare Products</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-dark-800">Compare Products</h1>
        <p className="text-gray-500 text-sm mt-1">Add up to 3 products to compare side-by-side</p>
      </div>

      
      {picking !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setPicking(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-card-lg w-full max-w-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-dark-800 text-lg">Choose Product {picking + 1}</h3>
              <button onClick={() => setPicking(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <SlotPicker onSelect={selectProduct} exclude={excludedIds} />
          </div>
        </div>
      )}

      
      <div className="overflow-x-auto -mx-4 px-4">
        <div className="min-w-[560px]">

          
          <div className="grid gap-3 mb-0" style={{ gridTemplateColumns: gridCols }}>
            <div /> 
            {slots.map((product, i) => (
              <div key={i}>
                {product
                  ? <ProductCard product={product} onRemove={() => removeSlot(i)} />
                  : <EmptySlot index={i} onClick={() => setPicking(i)} />
                }
              </div>
            ))}
          </div>

          
          {activeProducts.length === 0 && (
            <div className="text-center py-16 mt-4">
              <div className="text-5xl mb-3">⚖️</div>
              <p className="font-semibold text-dark-800 mb-1">Select products to compare</p>
              <p className="text-sm text-gray-400">Click the + slots above to add products</p>
            </div>
          )}

          
          {specRows.length > 0 && (
            <div className="mt-3 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              {specRows.map((key, ri) => (
                <div
                  key={key}
                  className={`grid gap-0 ${ri % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                  style={{ gridTemplateColumns: gridCols }}
                >
                  
                  <div className="flex items-center px-4 py-3.5 border-r border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{key}</span>
                  </div>

                  
                  {slots.map((product, si) => (
                    <div
                      key={si}
                      className={`flex items-center px-4 py-3.5 text-sm text-dark-800 font-medium ${si < MAX_COMPARE - 1 ? 'border-r border-gray-100' : ''}`}
                    >
                      {product
                        ? (specsByProduct[product.id]?.[key] ?? '—')
                        : <span className="text-gray-200">—</span>
                      }
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

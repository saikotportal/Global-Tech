'use client';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PRODUCTS, CATEGORIES, BRANDS } from '@/lib/products';
import ProductCard from '@/components/products/ProductCard';

const SORT_OPTIONS = [
  { value: 'popular',  label: 'Most Popular' },
  { value: 'newest',   label: 'Newest' },
  { value: 'price-lo', label: 'Price: Low to High' },
  { value: 'price-hi', label: 'Price: High to Low' },
  { value: 'rating',   label: 'Top Rated' },
];

const CATEGORY_ICONS = {
  phones: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
      <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  ),
  laptops: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  tvs: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
      <rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="8 21 12 17 16 21"/>
    </svg>
  ),
  gaming: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
      <line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/>
      <circle cx="15" cy="11" r="1" fill="currentColor"/><circle cx="17" cy="13" r="1" fill="currentColor"/>
      <path d="M2 12C2 7 5.5 4 12 4s10 3 10 8-2 8-10 8S2 17 2 12z"/>
    </svg>
  ),
  cameras: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  ),
  drones: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  smartwatch: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
      <rect x="5" y="7" width="14" height="12" rx="3"/>
      <path d="M16 7V5a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2"/>
      <polyline points="12 10 12 13 14 13"/>
    </svg>
  ),
  vr: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
      <path d="M2 8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8z"/>
      <circle cx="8.5" cy="11" r="2"/><circle cx="15.5" cy="11" r="2"/>
      <path d="M10.5 11h3"/>
    </svg>
  ),
  networking: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
      <path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/>
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
      <circle cx="12" cy="20" r="1" fill="currentColor"/>
    </svg>
  ),
  desktop: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  ),
  entertainment: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  ),
  audio: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/>
      <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
    </svg>
  ),
  'smart-home': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
};

const BRAND_LOGOS = {
  Apple:     'https://logo.clearbit.com/apple.com',
  Samsung:   'https://logo.clearbit.com/samsung.com',
  Sony:      'https://logo.clearbit.com/sony.com',
  Dell:      'https://logo.clearbit.com/dell.com',
  LG:        'https://logo.clearbit.com/lg.com',
  Bose:      'https://logo.clearbit.com/bose.com',
  Microsoft: 'https://logo.clearbit.com/microsoft.com',
  Google:    'https://logo.clearbit.com/google.com',
  Amazon:    'https://logo.clearbit.com/amazon.com',
  DJI:       'https://logo.clearbit.com/dji.com',
  ASUS:      'https://logo.clearbit.com/asus.com',
  Lenovo:    'https://logo.clearbit.com/lenovo.com',
  OnePlus:   'https://logo.clearbit.com/oneplus.com',
  Canon:     'https://logo.clearbit.com/canon.com',
  Fujifilm:  'https://logo.clearbit.com/fujifilm.com',
  Garmin:    'https://logo.clearbit.com/garmin.com',
  Meta:      'https://logo.clearbit.com/meta.com',
  Nintendo:  'https://logo.clearbit.com/nintendo.com',
  TCL:       'https://logo.clearbit.com/tcl.com',
  'TP-Link': 'https://logo.clearbit.com/tp-link.com',
  Sonos:     'https://logo.clearbit.com/sonos.com',
};

function BrandButton({ brand, selected, onClick }) {
  const [imgErr, setImgErr] = useState(false);
  const logoUrl = BRAND_LOGOS[brand];

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2.5 ${
        selected ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      {logoUrl && !imgErr ? (
        <img
          src={logoUrl}
          alt={brand}
          className="w-5 h-5 object-contain rounded flex-shrink-0"
          onError={() => setImgErr(true)}
        />
      ) : (
        <span className="w-5 h-5 rounded bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
          {brand[0]}
        </span>
      )}
      {brand}
    </button>
  );
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const catParam   = searchParams.get('category') || '';
  const brandParam = searchParams.get('brand') || '';

  const [selectedCat,   setSelectedCat]   = useState(catParam);
  const [selectedBrand, setSelectedBrand] = useState(brandParam);
  const [sort,          setSort]          = useState('popular');
  const [minPrice,      setMinPrice]      = useState(0);
  const [maxPrice,      setMaxPrice]      = useState(5000);
  const [filtersOpen,   setFiltersOpen]   = useState(false);

  useEffect(() => { setSelectedCat(catParam); },   [catParam]);
  useEffect(() => { setSelectedBrand(brandParam); }, [brandParam]);

  const products = useMemo(() => {
    let list = [...PRODUCTS];
    if (selectedCat)   list = list.filter(p => p.category === selectedCat);
    if (selectedBrand) list = list.filter(p => p.brand === selectedBrand);
    list = list.filter(p => p.price >= minPrice && p.price <= maxPrice);
    switch (sort) {
      case 'price-lo': list.sort((a, b) => a.price - b.price); break;
      case 'price-hi': list.sort((a, b) => b.price - a.price); break;
      case 'rating':   list.sort((a, b) => b.rating - a.rating); break;
      case 'newest':   list.sort((a, b) => b.id - a.id); break;
      default:         list.sort((a, b) => b.reviews - a.reviews);
    }
    return list;
  }, [selectedCat, selectedBrand, sort, minPrice, maxPrice]);

  function clearFilters() {
    setSelectedCat(''); setSelectedBrand('');
    setMinPrice(0); setMaxPrice(5000);
  }

  const Sidebar = () => (
    <aside className="w-full lg:w-56 flex-shrink-0 space-y-6">

      
      <div>
        <h3 className="font-semibold text-dark-800 mb-3">Category</h3>
        <div className="space-y-0.5">
          <button
            onClick={() => setSelectedCat('')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!selectedCat ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            All Categories
          </button>
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2.5 ${selectedCat === c.id ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <span className={selectedCat === c.id ? 'text-orange-500' : 'text-gray-400'}>
                {CATEGORY_ICONS[c.id] || (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                  </svg>
                )}
              </span>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      
      <div>
        <h3 className="font-semibold text-dark-800 mb-3">Brand</h3>
        <div className="space-y-0.5">
          <button
            onClick={() => setSelectedBrand('')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!selectedBrand ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            All Brands
          </button>
          {BRANDS.map(b => (
            <BrandButton
              key={b}
              brand={b}
              selected={selectedBrand === b}
              onClick={() => setSelectedBrand(b)}
            />
          ))}
        </div>
      </div>

      
      <div>
        <h3 className="font-semibold text-dark-800 mb-3">Price Range</h3>
        <div className="flex items-center gap-2">
          <input type="number" value={minPrice} min={0} max={maxPrice}
            onChange={e => setMinPrice(Number(e.target.value))}
            className="input-field text-sm py-2 px-3 w-24" placeholder="Min" />
          <span className="text-gray-400">–</span>
          <input type="number" value={maxPrice} min={minPrice} max={10000}
            onChange={e => setMaxPrice(Number(e.target.value))}
            className="input-field text-sm py-2 px-3 w-24" placeholder="Max" />
        </div>
      </div>

      <button onClick={clearFilters} className="text-sm text-orange-500 hover:underline">
        Clear all filters
      </button>
    </aside>
  );

  return (
    <div className="container-custom py-8 sm:py-12">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="section-title">
            {selectedCat ? CATEGORIES.find(c => c.id === selectedCat)?.label || 'Products' : 'All Products'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} results</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-orange-400 transition-colors"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filters
          </button>
          <select value={sort} onChange={e => setSort(e.target.value)} className="input-field py-2 text-sm w-auto pr-8">
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {filtersOpen && (
        <div className="lg:hidden mb-6 p-4 bg-white rounded-2xl shadow-card border border-gray-100">
          <Sidebar />
        </div>
      )}

      <div className="flex gap-8">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <div className="flex-1 min-w-0">
          {products.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🔍</div>
              <p className="font-semibold text-lg text-dark-800 mb-2">No products found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { PRODUCTS, CATEGORIES } from '@/lib/products';
import ProductCard from '@/components/products/ProductCard';

const CATEGORY_META = {
  phones: {
    gradient: 'from-violet-950 via-purple-900 to-indigo-900',
    accent: '#a78bfa',
    accentLight: '#ede9fe',
    tagline: 'Stay connected. Stay ahead.',
    description: 'The latest flagships from Apple, Samsung, Google and more — 5G ready, camera-first, all-day battery.',
    highlights: ['5G Connectivity', 'Pro Cameras', 'All-Day Battery', 'Fast Charging'],
    guide: [
      { icon: '📸', title: 'Camera Quality', tip: 'Look for sensor size and aperture — bigger sensors capture more light in low conditions.' },
      { icon: '⚡', title: 'Processor', tip: 'A-series (Apple) and Snapdragon 8 Elite lead performance benchmarks this year.' },
      { icon: '🔋', title: 'Battery Life', tip: 'Aim for 4,500mAh+ for all-day use. Fast charging (65W+) cuts top-up time dramatically.' },
    ],
    emoji: '📱',
  },
  laptops: {
    gradient: 'from-slate-950 via-slate-900 to-zinc-900',
    accent: '#38bdf8',
    accentLight: '#e0f2fe',
    tagline: 'Power that moves with you.',
    description: 'Thin and light, pro workstations, gaming rigs. Find the laptop that matches how you work — and play.',
    highlights: ['M4 & Ultra 9', 'OLED Displays', 'Up to 64GB RAM', '20hr+ Battery'],
    guide: [
      { icon: '🧠', title: 'Processor', tip: 'Apple M4 dominates efficiency. Intel Ultra 9 wins for Windows compatibility and raw multi-core tasks.' },
      { icon: '🖥️', title: 'Display', tip: 'OLED panels offer deeper blacks and better colour accuracy — worth it for creatives.' },
      { icon: '💾', title: 'RAM & Storage', tip: '16GB RAM is the new baseline. Get 32GB if you run VMs or heavy creative apps.' },
    ],
    emoji: '💻',
  },
  tvs: {
    gradient: 'from-gray-950 via-neutral-900 to-stone-900',
    accent: '#fb923c',
    accentLight: '#ffedd5',
    tagline: 'Cinema. In your living room.',
    description: 'OLED, QLED, and Mini-LED in sizes from 55" to 98". Dolby Vision, 4K, 8K, and gaming-ready 144Hz panels.',
    highlights: ['4K & 8K', 'OLED & QLED', 'Dolby Vision IQ', '144Hz Gaming'],
    guide: [
      { icon: '🎨', title: 'Panel Type', tip: 'OLED = perfect blacks, infinite contrast. QLED = brighter highlights, better in sunlit rooms.' },
      { icon: '📐', title: 'Size', tip: 'For a 10ft viewing distance, a 75"–85" screen hits the sweet spot for immersion.' },
      { icon: '🎮', title: 'Gaming', tip: 'Look for HDMI 2.1, VRR, and 120Hz support to get the most from PS5 or Xbox Series X.' },
    ],
    emoji: '📺',
  },
  gaming: {
    gradient: 'from-green-950 via-emerald-950 to-teal-950',
    accent: '#4ade80',
    accentLight: '#dcfce7',
    tagline: 'Play bigger. Win harder.',
    description: 'Consoles, handhelds, and accessories. From casual to competitive — gear up for your next level.',
    highlights: ['4K @ 120fps', 'Ray Tracing', 'SSD Load Times', 'Game Pass Ready'],
    guide: [
      { icon: '🎯', title: 'Ecosystem', tip: 'PS5 Pro for exclusives. Xbox for Game Pass value. Switch 2 for portability and Nintendo IPs.' },
      { icon: '📺', title: 'Pair with a TV', tip: 'A 120Hz HDMI 2.1 TV or monitor unlocks the full frame-rate potential of next-gen consoles.' },
      { icon: '🕹️', title: 'Accessories', tip: 'A quality headset and extra controller make multiplayer sessions far more enjoyable.' },
    ],
    emoji: '🎮',
  },
  cameras: {
    gradient: 'from-amber-950 via-orange-950 to-red-950',
    accent: '#fbbf24',
    accentLight: '#fef3c7',
    tagline: 'Capture moments. Create art.',
    description: 'Mirrorless, DSLR, and compact cameras from Sony, Canon, Fujifilm and more. Built for photographers who demand more.',
    highlights: ['40MP+ Sensors', '8K Video', 'IBIS Stabilisation', 'AI Autofocus'],
    guide: [
      { icon: '🔭', title: 'Sensor Size', tip: 'Full-frame sensors produce the best low-light and depth-of-field control. APS-C is great for wildlife reach.' },
      { icon: '🎬', title: 'Video', tip: '4K is standard. 8K RAW is for the pros. Check for 10-bit colour for maximum colour grading flexibility.' },
      { icon: '🔌', title: 'Lens System', tip: 'Sony E-mount and Canon RF have the widest native lens selections in the mirrorless space.' },
    ],
    emoji: '📷',
  },
  drones: {
    gradient: 'from-sky-950 via-blue-950 to-cyan-950',
    accent: '#22d3ee',
    accentLight: '#cffafe',
    tagline: 'See the world from above.',
    description: 'DJI\'s full lineup — from beginner-friendly Mini drones to the pro-grade Mavic 4 Pro. Fly legally, fly confidently.',
    highlights: ['6K Video', '45-min Flight', 'Obstacle Sensing', 'Under 249g Options'],
    guide: [
      { icon: '⚖️', title: 'Weight Class', tip: 'Under 249g (DJI Mini 4 Pro) avoids registration requirements in most countries.' },
      { icon: '📷', title: 'Camera', tip: 'The 1-inch sensor on the Air 3S is the sweet spot between image quality and portability.' },
      { icon: '🛡️', title: 'DJI Care', tip: 'DJI\'s refresh programme covers fly-aways and water damage — worth it for new pilots.' },
    ],
    emoji: '🚁',
  },
  smartwatch: {
    gradient: 'from-rose-950 via-pink-950 to-fuchsia-950',
    accent: '#f472b6',
    accentLight: '#fce7f3',
    tagline: 'Wear your world on your wrist.',
    description: 'Apple Watch, Samsung Galaxy Watch, Garmin Fenix — fitness tracking, health monitoring, and smart notifications.',
    highlights: ['Health Sensors', 'GPS Tracking', 'ECG & SpO2', '14-day+ Battery'],
    guide: [
      { icon: '📱', title: 'Compatibility', tip: 'Apple Watch only works with iPhone. Samsung Galaxy Watch works best with Galaxy phones but supports Android broadly.' },
      { icon: '🏃', title: 'Fitness Focus', tip: 'Garmin leads for serious athletes. Apple Watch Ultra 3 is the best all-rounder for sports and health.' },
      { icon: '🔋', title: 'Battery', tip: 'Garmin Fenix 8 lasts up to 29 days. Apple Watch Ultra 3 lasts 2 days with heavy use.' },
    ],
    emoji: '⌚',
  },
  vr: {
    gradient: 'from-purple-950 via-violet-950 to-fuchsia-950',
    accent: '#c084fc',
    accentLight: '#f3e8ff',
    tagline: 'Step inside a new reality.',
    description: 'Apple Vision Pro, Meta Quest, and PlayStation VR2 — spatial computing, gaming, and immersive entertainment.',
    highlights: ['Mixed Reality', 'Eye Tracking', '4K per Eye', 'Standalone & Tethered'],
    guide: [
      { icon: '🖥️', title: 'Standalone vs Tethered', tip: 'Meta Quest 3S runs standalone. PSVR2 needs a PS5. Vision Pro is its own computing platform.' },
      { icon: '🎯', title: 'Use Case', tip: 'Gaming: Quest 3S or PSVR2. Productivity & spatial computing: Apple Vision Pro.' },
      { icon: '😌', title: 'Comfort', tip: 'Weight distribution matters more than raw weight. Look for adjustable straps and balanced designs.' },
    ],
    emoji: '🥽',
  },
  networking: {
    gradient: 'from-teal-950 via-cyan-950 to-sky-950',
    accent: '#2dd4bf',
    accentLight: '#ccfbf1',
    tagline: 'Blazing fast. Every corner.',
    description: 'Wi-Fi 7 routers and mesh systems. Zero dead zones, gaming traffic prioritisation, and future-proof speeds.',
    highlights: ['Wi-Fi 7', '10Gb Ports', 'Mesh Systems', 'Gaming QoS'],
    guide: [
      { icon: '📶', title: 'Wi-Fi Standard', tip: 'Wi-Fi 7 (802.11be) is the current standard, offering up to 9.4Gbps with lower latency than Wi-Fi 6E.' },
      { icon: '🏠', title: 'Router vs Mesh', tip: 'Single router is fine for apartments. For 3+ bedroom homes, a mesh system eliminates dead zones.' },
      { icon: '🎮', title: 'Gaming', tip: 'Wired ethernet still wins for competitive gaming. For Wi-Fi, look for QoS and 6GHz band support.' },
    ],
    emoji: '📡',
  },
  desktop: {
    gradient: 'from-zinc-950 via-slate-950 to-gray-950',
    accent: '#94a3b8',
    accentLight: '#f1f5f9',
    tagline: 'Unlimited power. Zero compromise.',
    description: 'Mac Studio, Alienware, ASUS ProArt — workstations and gaming desktops that leave laptops in the dust.',
    highlights: ['M4 Ultra', 'RTX 4090', '192GB RAM', 'Thunderbolt 4'],
    guide: [
      { icon: '🧠', title: 'CPU', tip: 'Apple M4 Ultra dominates efficiency per watt. Intel Core i9 / AMD Ryzen 9 for Windows-native software.' },
      { icon: '🎨', title: 'GPU', tip: 'RTX 4090 is the pinnacle for Windows gaming and AI/ML workloads. Apple\'s integrated GPU excels at creative tasks.' },
      { icon: '🔌', title: 'Expandability', tip: 'Consider PCIe slots, storage bays, and USB standards before buying — desktops should last 5+ years.' },
    ],
    emoji: '🖥️',
  },
  entertainment: {
    gradient: 'from-red-950 via-rose-950 to-orange-950',
    accent: '#fb7185',
    accentLight: '#ffe4e6',
    tagline: 'Sound. Vision. Experience.',
    description: 'Streaming boxes, soundbars, and projectors. Transform any room into a home theatre.',
    highlights: ['Dolby Atmos', '4K Laser', 'HDMI eARC', 'AirPlay & Cast'],
    guide: [
      { icon: '📦', title: 'Streaming Box', tip: 'Apple TV 4K is the gold standard. Chromecast with Google TV suits Android households.' },
      { icon: '🔊', title: 'Soundbar', tip: 'Dolby Atmos soundbars add height channels for overhead sound. Sonos Arc Ultra leads the category.' },
      { icon: '🎥', title: 'Projector', tip: 'Laser projectors last 20,000+ hours vs 2,000 for lamp-based. The LG CineBeam Q hits 4K at 500 lumens.' },
    ],
    emoji: '🎬',
  },
  audio: {
    gradient: 'from-indigo-950 via-blue-950 to-violet-950',
    accent: '#818cf8',
    accentLight: '#e0e7ff',
    tagline: 'Hear every detail.',
    description: 'Sony, Bose, and beyond. Noise-cancelling headphones, wireless earbuds, and hi-fi audio for every listener.',
    highlights: ['Industry ANC', 'Hi-Res Audio', '40hr Battery', 'Multipoint'],
    guide: [
      { icon: '🎧', title: 'ANC Quality', tip: 'Sony WH-1000XM6 and Bose QC Ultra both lead noise cancellation — the difference is sound signature preference.' },
      { icon: '🎵', title: 'Sound Quality', tip: 'Hi-Res Audio certification means the headphones can reproduce frequencies above the 20kHz human range limit.' },
      { icon: '🔗', title: 'Multipoint', tip: 'Multipoint lets you connect to two devices simultaneously — essential if you switch between phone and laptop.' },
    ],
    emoji: '🎧',
  },
  'smart-home': {
    gradient: 'from-lime-950 via-green-950 to-emerald-950',
    accent: '#86efac',
    accentLight: '#dcfce7',
    tagline: 'Your home. Smarter.',
    description: 'Amazon Echo, Google Nest, and Matter-compatible devices. Automate, monitor, and control your entire home.',
    highlights: ['Matter Protocol', 'Voice Control', 'AI Alerts', '4K Security'],
    guide: [
      { icon: '🏠', title: 'Ecosystem', tip: 'Alexa (Amazon), Google Home, and Apple HomeKit are the three main ecosystems. Matter bridges them all.' },
      { icon: '📷', title: 'Security', tip: 'Look for local storage options — cloud subscriptions add up. The Nest Doorbell 4K offers 24/7 recording.' },
      { icon: '🔗', title: 'Compatibility', tip: 'Devices with Matter certification will work across Alexa, Google, and HomeKit without locks-in.' },
    ],
    emoji: '🏠',
  },
};

const SORT_OPTIONS = [
  { value: 'popular',  label: 'Most Popular' },
  { value: 'price-lo', label: 'Price: Low → High' },
  { value: 'price-hi', label: 'Price: High → Low' },
  { value: 'rating',   label: 'Top Rated' },
  { value: 'discount', label: 'Biggest Discount' },
];

function StarRating({ rating, count }) {
  return (
    <span className="flex items-center gap-1">
      {[1,2,3,4,5].map(s => (
        <svg key={s} viewBox="0 0 12 12" className="w-3 h-3" fill={s <= Math.round(rating) ? '#f59e0b' : '#e5e7eb'}>
          <path d="M6 1l1.3 2.6L10 4l-2 1.9.5 2.7L6 7.3 3.5 8.6 4 5.9 2 4l2.7-.4z"/>
        </svg>
      ))}
      <span className="text-xs text-gray-400">({count?.toLocaleString()})</span>
    </span>
  );
}

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const category = CATEGORIES.find(c => c.id === slug);
  const meta = CATEGORY_META[slug] || {
    gradient: 'from-gray-950 via-gray-900 to-gray-800',
    accent: '#f4874b',
    accentLight: '#fff7ed',
    tagline: 'Explore our collection.',
    description: 'Browse all products in this category.',
    highlights: [],
    guide: [],
    emoji: '🛍️',
  };

  const allCategoryProducts = useMemo(
    () => PRODUCTS.filter(p => p.category === slug),
    [slug]
  );

  const brands = useMemo(
    () => [...new Set(allCategoryProducts.map(p => p.brand))].sort(),
    [allCategoryProducts]
  );

  const [sort, setSort] = useState('popular');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState('');

  const products = useMemo(() => {
    let list = [...allCategoryProducts];
    if (selectedBrand) list = list.filter(p => p.brand === selectedBrand);
    if (inStockOnly) list = list.filter(p => p.inStock);
    if (maxPrice) list = list.filter(p => p.price <= Number(maxPrice));
    switch (sort) {
      case 'price-lo': list.sort((a,b) => a.price - b.price); break;
      case 'price-hi': list.sort((a,b) => b.price - a.price); break;
      case 'rating':   list.sort((a,b) => b.rating - a.rating); break;
      case 'discount': list.sort((a,b) => (b.originalPrice - b.price) - (a.originalPrice - a.price)); break;
      default:         list.sort((a,b) => b.reviews - a.reviews);
    }
    return list;
  }, [allCategoryProducts, sort, selectedBrand, inStockOnly, maxPrice]);

  const topPick = products.find(p => p.inStock);
  const hasDeals = products.some(p => p.originalPrice > p.price);

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <p className="text-6xl">🔍</p>
        <h1 className="text-2xl font-bold text-gray-800">Category not found</h1>
        <Link href="/products" className="text-orange-500 hover:underline font-medium">Browse all products →</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      
      <section className={`relative bg-gradient-to-br ${meta.gradient} overflow-hidden`}>
        
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: meta.accent, filter: 'blur(80px)' }} />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-10"
          style={{ background: meta.accent, filter: 'blur(60px)' }} />
        
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative container-custom py-16 md:py-20">
          
          <nav className="flex items-center gap-2 text-xs mb-8 opacity-60">
            <Link href="/" className="text-white hover:opacity-100 transition-opacity">Home</Link>
            <span className="text-white/40">›</span>
            <Link href="/products" className="text-white hover:opacity-100 transition-opacity">Products</Link>
            <span className="text-white/40">›</span>
            <span className="text-white">{category.label}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
                style={{ background: `${meta.accent}22`, color: meta.accent, border: `1px solid ${meta.accent}44` }}>
                <span>{category.emoji}</span>
                <span>{allCategoryProducts.length} Products</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-3 leading-tight">
                {category.label}
              </h1>
              <p className="text-lg font-medium mb-2" style={{ color: meta.accent }}>{meta.tagline}</p>
              <p className="text-white/60 text-sm leading-relaxed">{meta.description}</p>
            </div>

            
            {meta.highlights.length > 0 && (
              <div className="flex flex-wrap gap-2 md:justify-end">
                {meta.highlights.map(h => (
                  <span key={h}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{ background: `${meta.accent}18`, color: meta.accent, border: `1px solid ${meta.accent}33` }}>
                    ✓ {h}
                  </span>
                ))}
              </div>
            )}
          </div>

          
          <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-white/10">
            <div>
              <p className="text-2xl font-bold text-white">{allCategoryProducts.length}</p>
              <p className="text-xs text-white/50">Products</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{brands.length}</p>
              <p className="text-xs text-white/50">Brands</p>
            </div>
            {hasDeals && (
              <div>
                <p className="text-2xl font-bold" style={{ color: meta.accent }}>
                  {products.filter(p => p.originalPrice > p.price).length}
                </p>
                <p className="text-xs text-white/50">On Sale</p>
              </div>
            )}
            <div>
              <p className="text-2xl font-bold text-white">
                ${Math.min(...allCategoryProducts.map(p => p.price)).toLocaleString()}
              </p>
              <p className="text-xs text-white/50">Starting from</p>
            </div>
          </div>
        </div>
      </section>

      
      {meta.guide.length > 0 && (
        <section className="bg-white border-b border-gray-100">
          <div className="container-custom py-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-5">
              Buying Guide
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {meta.guide.map((item) => (
                <div key={item.title} className="flex gap-3">
                  <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-sm text-gray-900 mb-1">{item.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      
      <div className="container-custom py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          
          <aside className="lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-card p-5 sticky top-24 space-y-6">
              <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">Filters</h3>

              
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Brand</p>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="brand"
                      checked={selectedBrand === ''}
                      onChange={() => setSelectedBrand('')}
                      className="accent-orange-500"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-orange-500 transition-colors">All Brands</span>
                  </label>
                  {brands.map(b => (
                    <label key={b} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="brand"
                        checked={selectedBrand === b}
                        onChange={() => setSelectedBrand(b)}
                        className="accent-orange-500"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-orange-500 transition-colors">{b}</span>
                    </label>
                  ))}
                </div>
              </div>

              
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Max Price</p>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input
                    type="number"
                    placeholder="Any"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': meta.accent }}
                  />
                </div>
              </div>

              
              <div>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <div
                    onClick={() => setInStockOnly(!inStockOnly)}
                    className={`w-10 h-5 rounded-full transition-all relative cursor-pointer ${inStockOnly ? 'bg-orange-500' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${inStockOnly ? 'left-5' : 'left-0.5'}`} />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">In Stock Only</span>
                </label>
              </div>

              
              {(selectedBrand || inStockOnly || maxPrice) && (
                <button
                  onClick={() => { setSelectedBrand(''); setInStockOnly(false); setMaxPrice(''); }}
                  className="w-full text-xs font-semibold text-orange-500 hover:text-orange-600 py-2 border border-orange-200 rounded-xl hover:bg-orange-50 transition-all"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </aside>

          
          <div className="flex-1 min-w-0">

            
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-900">{products.length}</span> products
                {selectedBrand && <span> · {selectedBrand}</span>}
              </p>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            
            {topPick && sort === 'popular' && !selectedBrand && (
              <Link href={`/products/${topPick.id}`}>
                <div className="relative mb-6 rounded-2xl overflow-hidden cursor-pointer group"
                  style={{ background: `linear-gradient(135deg, ${meta.accent}18, ${meta.accent}08)`, border: `1px solid ${meta.accent}33` }}>
                  <div className="flex items-center gap-4 p-4">
                    <img
                      src={topPick.image}
                      alt={topPick.name}
                      className="w-20 h-20 object-cover rounded-xl flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: meta.accent }}>
                        🏆 Editor's Top Pick
                      </span>
                      <h3 className="font-bold text-gray-900 text-sm mt-0.5 truncate">{topPick.name}</h3>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{topPick.description}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <StarRating rating={topPick.rating} count={topPick.reviews} />
                        <span className="font-bold text-sm text-gray-900">${topPick.price.toLocaleString()}</span>
                        {topPick.originalPrice > topPick.price && (
                          <span className="text-xs text-gray-400 line-through">${topPick.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-gray-400 group-hover:text-orange-500 transition-colors flex-shrink-0">
                      View →
                    </div>
                  </div>
                </div>
              </Link>
            )}

            
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <p className="text-5xl">🔍</p>
                <p className="font-semibold text-gray-700">No products match your filters</p>
                <button
                  onClick={() => { setSelectedBrand(''); setInStockOnly(false); setMaxPrice(''); }}
                  className="text-sm text-orange-500 hover:underline font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      
      <section className="bg-white border-t border-gray-100 py-12">
        <div className="container-custom">
          <h2 className="font-bold text-lg text-gray-900 mb-6">Browse Other Categories</h2>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.filter(c => c.id !== slug).map(c => (
              <Link
                key={c.id}
                href={`/categories/${c.id}`}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-gray-50 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 transition-all text-sm font-medium text-gray-700"
              >
                <span>{c.emoji}</span>
                <span>{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

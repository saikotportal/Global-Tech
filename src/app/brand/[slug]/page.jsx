'use client';

import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { PRODUCTS, CATEGORIES } from '@/lib/products';
import ProductCard from '@/components/products/ProductCard';

const BRAND_META = {
  Apple: {
    tagline: 'Think Different.',
    description: 'Apple designs products that seamlessly blend hardware, software, and services — creating experiences that are intuitive, powerful, and beautifully crafted. From iPhone to Mac, Apple Watch to Vision Pro.',
    accentColor: '#1d1d1f',
    heroGradient: 'from-zinc-900 via-neutral-800 to-stone-900',
    accentHex: '#f5f5f7',
    pillBg: 'rgba(255,255,255,0.1)',
    pillText: '#f5f5f7',
    founded: '1976',
    hq: 'Cupertino, CA',
    specialty: 'Premium Ecosystem',
    badge: '🍎',
  },
  Samsung: {
    tagline: 'Do What You Can\'t.',
    description: 'Samsung pushes the boundaries of what\'s possible with displays, mobile, home appliances, and semiconductors. A global leader in innovation across every screen in your life.',
    accentColor: '#1428A0',
    heroGradient: 'from-blue-950 via-indigo-950 to-slate-950',
    accentHex: '#4f9cf9',
    pillBg: 'rgba(79,156,249,0.15)',
    pillText: '#4f9cf9',
    founded: '1969',
    hq: 'Suwon, South Korea',
    specialty: 'Display Technology',
    badge: '⬡',
  },
  Sony: {
    tagline: 'Be Moved.',
    description: 'Sony\'s legacy spans cameras, audio, gaming, and televisions. Every product is crafted with the passion and precision that has made Sony a symbol of quality for over 75 years.',
    accentColor: '#000000',
    heroGradient: 'from-gray-950 via-gray-900 to-zinc-950',
    accentHex: '#ff6b35',
    pillBg: 'rgba(255,107,53,0.15)',
    pillText: '#ff6b35',
    founded: '1946',
    hq: 'Tokyo, Japan',
    specialty: 'Audio & Imaging',
    badge: '◈',
  },
  Dell: {
    tagline: 'Built for What\'s Next.',
    description: 'Dell Technologies empowers individuals and organizations to build their digital future. From XPS ultrabooks to Alienware gaming rigs, Dell powers the world\'s productivity.',
    accentColor: '#007DB8',
    heroGradient: 'from-cyan-950 via-sky-950 to-blue-950',
    accentHex: '#38bdf8',
    pillBg: 'rgba(56,189,248,0.15)',
    pillText: '#38bdf8',
    founded: '1984',
    hq: 'Round Rock, TX',
    specialty: 'Laptops & Workstations',
    badge: '◇',
  },
  LG: {
    tagline: 'Life\'s Good.',
    description: 'LG Electronics delivers innovation across TVs, audio, smart home and beyond. The creators of OLED display technology that defines modern home entertainment.',
    accentColor: '#A50034',
    heroGradient: 'from-red-950 via-rose-950 to-pink-950',
    accentHex: '#fb7185',
    pillBg: 'rgba(251,113,133,0.15)',
    pillText: '#fb7185',
    founded: '1958',
    hq: 'Seoul, South Korea',
    specialty: 'OLED Displays',
    badge: '◉',
  },
  Bose: {
    tagline: 'Better Sound Through Research.',
    description: 'Bose has pioneered audio innovation since 1964. From noise-cancelling headphones to premium speakers, every Bose product is engineered to move you with the power of sound.',
    accentColor: '#000000',
    heroGradient: 'from-neutral-950 via-stone-900 to-zinc-950',
    accentHex: '#d4af37',
    pillBg: 'rgba(212,175,55,0.15)',
    pillText: '#d4af37',
    founded: '1964',
    hq: 'Framingham, MA',
    specialty: 'Noise Cancellation',
    badge: '♪',
  },
  Microsoft: {
    tagline: 'Empowering Every Person.',
    description: 'Microsoft creates technology that empowers every person on the planet to achieve more — from Xbox gaming to Surface devices to the cloud services powering modern business.',
    accentColor: '#0078D4',
    heroGradient: 'from-blue-950 via-sky-950 to-indigo-950',
    accentHex: '#60a5fa',
    pillBg: 'rgba(96,165,250,0.15)',
    pillText: '#60a5fa',
    founded: '1975',
    hq: 'Redmond, WA',
    specialty: 'Gaming & Productivity',
    badge: '⊞',
  },
  Google: {
    tagline: 'Make Google Do It.',
    description: 'Google\'s hardware lineup brings its most advanced AI directly into your hands. Pixel phones with Google Tensor, Nest smart home devices, and more — all powered by Google intelligence.',
    accentColor: '#1a73e8',
    heroGradient: 'from-blue-950 via-indigo-950 to-violet-950',
    accentHex: '#818cf8',
    pillBg: 'rgba(129,140,248,0.15)',
    pillText: '#818cf8',
    founded: '1998',
    hq: 'Mountain View, CA',
    specialty: 'AI-Powered Devices',
    badge: 'G',
  },
  Amazon: {
    tagline: 'Work Hard. Have Fun. Make History.',
    description: 'Amazon\'s devices division brings the power of Alexa and AWS into everyday life. Echo smart speakers, eero mesh networking, and Fire TV streaming devices.',
    accentColor: '#FF9900',
    heroGradient: 'from-orange-950 via-amber-950 to-yellow-950',
    accentHex: '#fbbf24',
    pillBg: 'rgba(251,191,36,0.15)',
    pillText: '#fbbf24',
    founded: '1994',
    hq: 'Seattle, WA',
    specialty: 'Smart Home & Alexa',
    badge: '∞',
  },
  DJI: {
    tagline: 'The Future of Possible.',
    description: 'DJI is the world\'s leading drone manufacturer, pioneering aerial imaging technology. From beginner Mini drones to professional Mavic systems, DJI defines what\'s possible from above.',
    accentColor: '#1a1a1a',
    heroGradient: 'from-slate-950 via-gray-950 to-zinc-950',
    accentHex: '#22d3ee',
    pillBg: 'rgba(34,211,238,0.15)',
    pillText: '#22d3ee',
    founded: '2006',
    hq: 'Shenzhen, China',
    specialty: 'Aerial Imaging',
    badge: '✈',
  },
  ASUS: {
    tagline: 'In Search of Incredible.',
    description: 'ASUS designs and manufactures some of the world\'s most awarded computers, components, and peripherals. From ROG gaming powerhouses to ProArt creative workstations.',
    accentColor: '#1A1A2E',
    heroGradient: 'from-indigo-950 via-violet-950 to-purple-950',
    accentHex: '#a78bfa',
    pillBg: 'rgba(167,139,250,0.15)',
    pillText: '#a78bfa',
    founded: '1989',
    hq: 'Taipei, Taiwan',
    specialty: 'Gaming & Pro Creation',
    badge: '⚡',
  },
  Lenovo: {
    tagline: 'Smarter Technology for All.',
    description: 'Lenovo is the world\'s largest PC manufacturer, delivering ThinkPad business laptops, Legion gaming systems, and Yoga convertibles to over 180 countries.',
    accentColor: '#E2231A',
    heroGradient: 'from-red-950 via-rose-950 to-orange-950',
    accentHex: '#f87171',
    pillBg: 'rgba(248,113,113,0.15)',
    pillText: '#f87171',
    founded: '1984',
    hq: 'Beijing, China',
    specialty: 'Business Laptops',
    badge: '▣',
  },
  OnePlus: {
    tagline: 'Never Settle.',
    description: 'OnePlus was born from a quest to create the perfect smartphone — fast, clean, and premium without compromise. Flagship-tier performance at competitive prices.',
    accentColor: '#F5010C',
    heroGradient: 'from-red-950 via-rose-950 to-pink-950',
    accentHex: '#f43f5e',
    pillBg: 'rgba(244,63,94,0.15)',
    pillText: '#f43f5e',
    founded: '2013',
    hq: 'Shenzhen, China',
    specialty: 'Fast Charging',
    badge: '1+',
  },
  Canon: {
    tagline: 'Delighting You Always.',
    description: 'Canon has been at the forefront of imaging innovation since 1937. From EOS mirrorless cameras to professional cinema lenses, Canon captures the moments that matter most.',
    accentColor: '#CC0000',
    heroGradient: 'from-red-950 via-red-900 to-rose-950',
    accentHex: '#fca5a5',
    pillBg: 'rgba(252,165,165,0.15)',
    pillText: '#fca5a5',
    founded: '1937',
    hq: 'Tokyo, Japan',
    specialty: 'Imaging & Optics',
    badge: '⊙',
  },
  Fujifilm: {
    tagline: 'Value from Innovation.',
    description: 'Fujifilm combines decades of film heritage with modern digital innovation. The X-series and GFX cameras are beloved by photographers worldwide for their colour science and tactile controls.',
    accentColor: '#EE2E24',
    heroGradient: 'from-orange-950 via-amber-950 to-red-950',
    accentHex: '#fb923c',
    pillBg: 'rgba(251,146,60,0.15)',
    pillText: '#fb923c',
    founded: '1934',
    hq: 'Tokyo, Japan',
    specialty: 'Film Simulations',
    badge: '◫',
  },
  Garmin: {
    tagline: 'Beat Yesterday.',
    description: 'Garmin designs GPS-enabled wearables and navigation devices trusted by athletes, aviators, and adventurers worldwide. Built tough, calibrated precise, designed to last.',
    accentColor: '#007CC3',
    heroGradient: 'from-teal-950 via-cyan-950 to-sky-950',
    accentHex: '#2dd4bf',
    pillBg: 'rgba(45,212,191,0.15)',
    pillText: '#2dd4bf',
    founded: '1989',
    hq: 'Olathe, KS',
    specialty: 'GPS & Fitness',
    badge: '⊕',
  },
  Meta: {
    tagline: 'The Metaverse Awaits.',
    description: 'Meta is building the next computing platform through mixed and virtual reality. Quest headsets make immersive gaming, fitness, and social experiences accessible to everyone.',
    accentColor: '#0866FF',
    heroGradient: 'from-blue-950 via-violet-950 to-purple-950',
    accentHex: '#818cf8',
    pillBg: 'rgba(129,140,248,0.15)',
    pillText: '#818cf8',
    founded: '2004',
    hq: 'Menlo Park, CA',
    specialty: 'Virtual Reality',
    badge: '∞',
  },
  Nintendo: {
    tagline: 'Play Together. Anywhere.',
    description: 'Nintendo has brought joy to generations of players with beloved franchises and innovative hardware. The Switch 2 continues that tradition with portable-home gaming that\'s uniquely Nintendo.',
    accentColor: '#E4000F',
    heroGradient: 'from-red-950 via-rose-950 to-pink-950',
    accentHex: '#fb7185',
    pillBg: 'rgba(251,113,133,0.15)',
    pillText: '#fb7185',
    founded: '1889',
    hq: 'Kyoto, Japan',
    specialty: 'Portable Gaming',
    badge: '▶',
  },
  TCL: {
    tagline: 'Inspire Greatness.',
    description: 'TCL delivers premium display technology at accessible prices. Their Mini-LED and QLED televisions bring next-gen picture quality to everyday households worldwide.',
    accentColor: '#B22222',
    heroGradient: 'from-red-950 via-orange-950 to-amber-950',
    accentHex: '#fb923c',
    pillBg: 'rgba(251,146,60,0.15)',
    pillText: '#fb923c',
    founded: '1981',
    hq: 'Huizhou, China',
    specialty: 'Value TVs',
    badge: 'T',
  },
  'TP-Link': {
    tagline: 'Reliably Smart.',
    description: 'TP-Link is the world\'s leading provider of networking equipment. From home Wi-Fi routers to business networking solutions, TP-Link keeps the world connected reliably.',
    accentColor: '#1A7AC8',
    heroGradient: 'from-sky-950 via-blue-950 to-indigo-950',
    accentHex: '#38bdf8',
    pillBg: 'rgba(56,189,248,0.15)',
    pillText: '#38bdf8',
    founded: '1996',
    hq: 'Shenzhen, China',
    specialty: 'Home Networking',
    badge: '⊛',
  },
  Sonos: {
    tagline: 'Sound That Fills Your Home.',
    description: 'Sonos designs premium wireless audio systems that bring music to every room. Legendary sound quality with seamless multi-room streaming and smart home integration.',
    accentColor: '#000000',
    heroGradient: 'from-neutral-950 via-zinc-900 to-stone-950',
    accentHex: '#e2e8f0',
    pillBg: 'rgba(226,232,240,0.1)',
    pillText: '#e2e8f0',
    founded: '2002',
    hq: 'Santa Barbara, CA',
    specialty: 'Wireless Audio',
    badge: '◎',
  },
};

const SORT_OPTIONS = [
  { value: 'popular',  label: 'Most Popular' },
  { value: 'price-lo', label: 'Price: Low → High' },
  { value: 'price-hi', label: 'Price: High → Low' },
  { value: 'rating',   label: 'Top Rated' },
  { value: 'newest',   label: 'Newest' },
];

export default function BrandPage() {
  const params = useParams();
  const slug = decodeURIComponent(params?.slug || '');

  const allBrands = [...new Set(PRODUCTS.map(p => p.brand))];
  const brandName = allBrands.find(b => b.toLowerCase() === slug.toLowerCase()) || slug;
  const meta = BRAND_META[brandName] || {
    tagline: 'Quality Products.',
    description: `Explore all ${brandName} products available at GlobalTech.`,
    heroGradient: 'from-gray-950 via-gray-900 to-zinc-950',
    accentHex: '#f4874b',
    pillBg: 'rgba(244,135,75,0.15)',
    pillText: '#f4874b',
    founded: '—',
    hq: '—',
    specialty: '—',
    badge: '●',
  };

  const brandProducts = useMemo(
    () => PRODUCTS.filter(p => p.brand.toLowerCase() === slug.toLowerCase()),
    [slug]
  );

  const brandCategories = useMemo(() => {
    const catIds = [...new Set(brandProducts.map(p => p.category))];
    return CATEGORIES.filter(c => catIds.includes(c.id));
  }, [brandProducts]);

  const [activeCategory, setActiveCategory] = useState('all');
  const [sort, setSort] = useState('popular');

  const filteredProducts = useMemo(() => {
    let list = activeCategory === 'all'
      ? [...brandProducts]
      : brandProducts.filter(p => p.category === activeCategory);
    switch (sort) {
      case 'price-lo': list.sort((a, b) => a.price - b.price); break;
      case 'price-hi': list.sort((a, b) => b.price - a.price); break;
      case 'rating':   list.sort((a, b) => b.rating - a.rating); break;
      case 'newest':   list.sort((a, b) => (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0)); break;
      default:         list.sort((a, b) => b.reviews - a.reviews);
    }
    return list;
  }, [brandProducts, activeCategory, sort]);

  const avgRating = brandProducts.length
    ? (brandProducts.reduce((s, p) => s + p.rating, 0) / brandProducts.length).toFixed(1)
    : '—';
  const totalReviews = brandProducts.reduce((s, p) => s + p.reviews, 0);
  const lowestPrice = Math.min(...brandProducts.map(p => p.price));
  const inStockCount = brandProducts.filter(p => p.inStock).length;

  const otherBrands = allBrands.filter(b => b.toLowerCase() !== slug.toLowerCase()).slice(0, 12);

  if (!brandProducts.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <p className="text-6xl">🔍</p>
        <h1 className="text-2xl font-bold text-gray-800">Brand not found</h1>
        <Link href="/products" className="text-orange-500 hover:underline font-medium">Browse all products →</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      
      <section className={`relative bg-gradient-to-br ${meta.heroGradient} overflow-hidden`}>
        
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
          style={{ background: meta.accentHex, filter: 'blur(100px)' }} />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-10 pointer-events-none"
          style={{ background: meta.accentHex, filter: 'blur(60px)' }} />
        
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative container-custom py-16 md:py-20">
          
          <nav className="flex items-center gap-2 text-xs mb-10 opacity-50">
            <Link href="/" className="text-white hover:opacity-100 transition-opacity">Home</Link>
            <span className="text-white/40">›</span>
            <Link href="/products" className="text-white hover:opacity-100 transition-opacity">Products</Link>
            <span className="text-white/40">›</span>
            <span className="text-white">Brands</span>
            <span className="text-white/40">›</span>
            <span className="text-white">{brandName}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="max-w-2xl">
              
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center border overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.95)', borderColor: `${meta.accentHex}33` }}>
                  <img
                    src={`https://logo.clearbit.com/${brandName.toLowerCase().replace(/\s+/g,'')}.com`}
                    alt={brandName}
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <span className="hidden w-full h-full items-center justify-center text-2xl font-black"
                    style={{ color: meta.accentHex, background: meta.pillBg }}>
                    {brandName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: meta.accentHex }}>
                    Official Brand Store
                  </p>
                  <h1 className="text-4xl md:text-5xl font-display font-black text-white leading-none">
                    {brandName}
                  </h1>
                </div>
              </div>

              <p className="text-lg italic mb-3 font-medium" style={{ color: meta.accentHex }}>
                "{meta.tagline}"
              </p>
              <p className="text-white/60 text-sm leading-relaxed max-w-xl">
                {meta.description}
              </p>

              
              <div className="flex flex-wrap gap-2 mt-5">
                {[
                  { label: 'Founded', value: meta.founded },
                  { label: 'HQ', value: meta.hq },
                  { label: 'Known for', value: meta.specialty },
                ].map(item => (
                  <span key={item.label}
                    className="text-xs px-3 py-1.5 rounded-full font-medium"
                    style={{ background: meta.pillBg, color: meta.accentHex, border: `1px solid ${meta.accentHex}22` }}>
                    <span className="opacity-60">{item.label}: </span>{item.value}
                  </span>
                ))}
              </div>
            </div>

            
            <div className="grid grid-cols-2 gap-3 md:min-w-[240px]">
              {[
                { value: brandProducts.length, label: 'Products' },
                { value: `${avgRating}★`, label: 'Avg Rating' },
                { value: `${totalReviews.toLocaleString()}`, label: 'Reviews' },
                { value: `$${lowestPrice.toLocaleString()}+`, label: 'From' },
              ].map(s => (
                <div key={s.label}
                  className="rounded-2xl p-4 text-center"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="text-xl font-bold text-white">{s.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: meta.accentHex, opacity: 0.8 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="container-custom">
          <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-hide">
            <button
              onClick={() => setActiveCategory('all')}
              className={`flex-shrink-0 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                activeCategory === 'all'
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
              style={activeCategory === 'all' ? { background: `linear-gradient(135deg,#e8517a,#f4874b)` } : {}}
            >
              All ({brandProducts.length})
            </button>
            {brandCategories.map(cat => {
              const count = brandProducts.filter(p => p.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                    activeCategory === cat.id
                      ? 'text-white'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                  style={activeCategory === cat.id ? { background: `linear-gradient(135deg,#e8517a,#f4874b)` } : {}}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                  <span className="opacity-60 text-xs">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      
      <div className="container-custom py-10">
        
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> {brandName} products
            {activeCategory !== 'all' && (
              <span> in <span className="font-semibold text-gray-900">
                {brandCategories.find(c => c.id === activeCategory)?.label}
              </span></span>
            )}
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

        
        {inStockCount < brandProducts.length && (
          <div className="mb-5 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 px-4 py-3 rounded-xl">
            <span>⚠️</span>
            <span>{brandProducts.length - inStockCount} {brandName} product{brandProducts.length - inStockCount > 1 ? 's are' : ' is'} currently out of stock.</span>
          </div>
        )}

        
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <p className="text-5xl">📦</p>
            <p className="font-semibold text-gray-700">No products in this category yet</p>
            <button onClick={() => setActiveCategory('all')} className="text-sm text-orange-500 hover:underline font-medium">
              View all {brandName} products
            </button>
          </div>
        )}
      </div>

      
      <section className="bg-white border-t border-gray-100 py-12">
        <div className="container-custom">
          <h2 className="font-bold text-lg text-gray-900 mb-6">Browse Other Brands</h2>
          <div className="flex flex-wrap gap-3">
            {otherBrands.map(b => (
              <Link
                key={b}
                href={`/brand/${encodeURIComponent(b)}`}
                className="px-4 py-2 rounded-full border border-gray-200 bg-gray-50 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 transition-all text-sm font-medium text-gray-700"
              >
                {b}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

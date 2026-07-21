'use client';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { PRODUCTS } from '@/lib/products';
import ProductCard from '@/components/products/ProductCard';
import { calcDiscount } from '@/utils/helpers';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';

const FLASH_DEAL_IDS = [5, 15, 4, 10, 31, 25, 2, 8, 17, 20];

const PRICE_OVERRIDES = {
  5:  { price: 1299, originalPrice: 2499 },
  15: { price: 2799, originalPrice: 5499 },
  4:  { price: 1499, originalPrice: 2199 },
  10: { price: 449,  originalPrice: 699  },
  31: { price: 199,  originalPrice: 399  },
  25: { price: 549,  originalPrice: 959  },
  2:  { price: 899,  originalPrice: 1199 },
  8:  { price: 199,  originalPrice: 379  },
  17: { price: 599,  originalPrice: 899  },
  20: { price: 899,  originalPrice: 1599 },
};

const FLASH_DEALS = PRODUCTS
  .filter((p) => FLASH_DEAL_IDS.includes(p.id))
  .map((p) => ({ ...p, ...(PRICE_OVERRIDES[p.id] || {}), badge: 'Flash Deal' }))
  .sort((a, b) => {
    const da = calcDiscount(a.originalPrice, a.price);
    const db = calcDiscount(b.originalPrice, b.price);
    return db - da;
  });

function useCountdown(targetMs) {
  const [remaining, setRemaining] = useState(targetMs - Date.now());
  useEffect(() => {
    const t = setInterval(() => setRemaining(targetMs - Date.now()), 1000);
    return () => clearInterval(t);
  }, [targetMs]);

  const total = Math.max(0, remaining);
  const hrs   = Math.floor(total / 3_600_000);
  const mins  = Math.floor((total % 3_600_000) / 60_000);
  const secs  = Math.floor((total % 60_000) / 1_000);
  return { hrs, mins, secs, expired: total === 0 };
}

function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-display font-bold text-2xl text-white shadow-inner"
        style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-xs text-gray-500 mt-1 font-medium">{label}</span>
    </div>
  );
}

function HeroDeal({ product, endTime }) {
  const { format } = useCurrency();
  const { addItem } = useCart();
  const { toast }   = useToast();
  const { hrs, mins, secs } = useCountdown(endTime);
  const disc = calcDiscount(product.originalPrice, product.price);
  const saved = product.originalPrice - product.price;

  return (
    <div
      className="rounded-3xl overflow-hidden shadow-card-lg mb-12 relative"
      style={{ background: 'linear-gradient(135deg,#1a1a2e 0%,#252540 60%,#2a1a2e 100%)' }}
    >
      
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(#e8517a,transparent)' }} />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-15 blur-3xl"
        style={{ background: 'radial-gradient(#f4874b,transparent)' }} />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0">
        
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 bg-orange-400/10 border border-orange-400/30 px-3 py-1.5 rounded-full w-fit mb-5">
            ⚡ FLASH DEAL OF THE DAY
          </span>
          <p className="text-gray-400 text-sm font-medium mb-1">{product.brand}</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">{product.name}</h2>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">{product.description}</p>

          
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-4xl font-bold text-white">{format(product.price)}</span>
            <span className="text-xl text-gray-500 line-through">{format(product.originalPrice)}</span>
            <span className="text-sm font-bold text-green-400 bg-green-400/10 px-2.5 py-0.5 rounded-full">-{disc}%</span>
          </div>
          <p className="text-green-400 text-sm font-semibold mb-8">You save {format(saved)}!</p>

          
          <div className="mb-8">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3">Deal ends in</p>
            <div className="flex items-center gap-3">
              <CountdownUnit value={hrs}  label="HRS"  />
              <span className="text-2xl font-bold text-gray-500 pb-5">:</span>
              <CountdownUnit value={mins} label="MIN"  />
              <span className="text-2xl font-bold text-gray-500 pb-5">:</span>
              <CountdownUnit value={secs} label="SEC"  />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => { addItem(product); toast.success(`${product.name} added to cart!`); }}
              disabled={!product.inStock}
              className="px-8 py-3.5 rounded-xl font-semibold text-white transition-all hover:opacity-90 hover:shadow-brand active:scale-95 disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}
            >
              🛒 Add to Cart
            </button>
            <Link
              href={`/products/${product.id}`}
              className="px-8 py-3.5 rounded-xl font-semibold text-white border border-white/20 hover:bg-white/10 transition-colors text-center"
            >
              View Details
            </Link>
          </div>
        </div>

        
        <div className="relative h-64 lg:h-auto overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
            onError={(e) => { e.target.src = `https://placehold.co/600x400/252540/555?text=${encodeURIComponent(product.brand)}`; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-800/60 via-transparent to-transparent lg:bg-gradient-to-l" />
        </div>
      </div>
    </div>
  );
}

function DealCard({ product }) {
  const { format } = useCurrency();
  const { addItem } = useCart();
  const { toast }   = useToast();
  const disc  = calcDiscount(product.originalPrice, product.price);
  const stockPct = 20 + ((product.id * 17) % 60);

  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden group flex flex-col">
      <Link href={`/products/${product.id}`}>
        <div className="relative h-44 bg-gray-50 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.src = `https://placehold.co/300x200/f5f5f5/999?text=${encodeURIComponent(product.brand)}`; }}
          />
          <span className="absolute top-2 left-2 text-xs font-bold px-2.5 py-1 rounded-full text-white shadow"
            style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>⚡ -{disc}%</span>
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="font-bold text-gray-500 text-sm">Sold Out</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-gray-400 mb-0.5 font-medium">{product.brand}</p>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-sm text-dark-800 hover:text-orange-500 transition-colors line-clamp-2 mb-2 leading-snug">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-dark-800">{format(product.price)}</span>
          <span className="text-xs text-gray-400 line-through">{format(product.originalPrice)}</span>
        </div>

        
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Stock remaining</span>
            <span className={`font-semibold ${stockPct < 30 ? 'text-red-500' : 'text-gray-600'}`}>{stockPct}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${stockPct}%`,
                background: stockPct < 30
                  ? 'linear-gradient(90deg,#ef4444,#f87171)'
                  : 'linear-gradient(90deg,#22c55e,#86efac)',
              }}
            />
          </div>
          {stockPct < 30 && (
            <p className="text-xs text-red-500 font-semibold mt-1">🔥 Almost gone!</p>
          )}
        </div>

        <button
          onClick={() => { addItem(product); toast.success(`${product.name} added to cart!`); }}
          disabled={!product.inStock}
          className="mt-auto w-full py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90 hover:shadow-md active:scale-95 disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}
        >
          {product.inStock ? '🛒 Grab This Deal' : 'Sold Out'}
        </button>
      </div>
    </div>
  );
}

export default function DealsPage() {
  const endOfDay = useMemo(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 0);
    return d.getTime();
  }, []);

  const [sortBy, setSortBy] = useState('discount');

  const sortedDeals = useMemo(() => {
    const list = [...FLASH_DEALS];
    if (sortBy === 'discount') list.sort((a, b) => calcDiscount(b.originalPrice, b.price) - calcDiscount(a.originalPrice, a.price));
    if (sortBy === 'price-lo') list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-hi') list.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating')   list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [sortBy]);

  const heroDeal   = FLASH_DEALS[0];
  const otherDeals = sortedDeals.filter((p) => p.id !== heroDeal.id);

  return (
    <div className="container-custom py-10 sm:py-14">

      
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-dark-800 font-medium">Flash Deals</span>
      </nav>

      
      <HeroDeal product={heroDeal} endTime={endOfDay} />

      
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-dark-800 flex items-center gap-2">
            ⚡ All Flash Deals
            <span className="text-sm font-semibold bg-orange-100 text-orange-600 px-2.5 py-0.5 rounded-full">
              {otherDeals.length} deals
            </span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">Limited-time prices — reset daily at midnight</p>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400 bg-white"
        >
          <option value="discount">Biggest Discount</option>
          <option value="price-lo">Price: Low to High</option>
          <option value="price-hi">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 mb-16">
        {otherDeals.map((p) => <DealCard key={p.id} product={p} />)}
      </div>

      
      <div
        className="rounded-3xl p-8 sm:p-12 text-center text-white"
        style={{ background: 'linear-gradient(135deg,#e8517a 0%,#f4874b 50%,#f5c518 100%)' }}
      >
        <h3 className="font-display text-2xl sm:text-3xl font-bold mb-3">Never Miss a Deal</h3>
        <p className="text-white/80 mb-6 max-w-md mx-auto text-sm">
          Subscribe to our newsletter and get flash deals delivered to your inbox before they sell out.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-xl text-dark-800 text-sm outline-none focus:shadow-lg"
          />
          <button className="px-6 py-3 bg-dark-800 text-white rounded-xl text-sm font-semibold hover:bg-dark-700 transition-colors flex-shrink-0">
            Notify Me
          </button>
        </div>
      </div>
    </div>
  );
}

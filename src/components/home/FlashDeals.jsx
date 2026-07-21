'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getFlashDeals } from '@/lib/products';
import { calcDiscount } from '@/utils/helpers';
import { useCart } from '@/hooks/useCart';
import { useCurrency } from '@/context/CurrencyContext';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

function useCountdown(targetHours = 8) {
  const [time, setTime] = useState({ h: targetHours, m: 0, s: 0 });
  const prev = useRef({ h: targetHours, m: 0, s: 0 });
  const [changed, setChanged] = useState({ h: false, m: false, s: false });

  useEffect(() => {
    const t = setInterval(() => {
      setTime((p) => {
        let { h, m, s } = p;
        const next = s > 0 ? { h, m, s: s - 1 }
          : m > 0 ? { h, m: m - 1, s: 59 }
          : h > 0 ? { h: h - 1, m: 59, s: 59 }
          : { h: targetHours, m: 0, s: 0 };
        setChanged({ h: next.h !== p.h, m: next.m !== p.m, s: next.s !== p.s });
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  return { time, changed };
}

function DigitBlock({ value, ticked }) {
  const [key, setKey] = useState(0);
  useEffect(() => { if (ticked) setKey(k => k + 1); }, [ticked]);
  return (
    <div className="bg-dark-700 rounded-lg px-3 py-2 min-w-[52px] text-center overflow-hidden relative" style={{ height: '48px' }}>
      <span key={key} className="absolute inset-0 flex items-center justify-center font-mono font-bold text-2xl text-white digit-tick">
        {String(value).padStart(2, '0')}
      </span>
    </div>
  );
}

function DealCard({ product, index }) {
  const [ref, visible] = useScrollAnimation({ threshold: 0.08 });
  const disc = calcDiscount(product.originalPrice, product.price);
  const { addItem } = useCart();
  const { format } = useCurrency();

  return (
    <div ref={ref} className="bg-dark-800 rounded-2xl overflow-hidden group hover:-translate-y-2 transition-all duration-300 hover:shadow-brand-lg"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.5s ease ${index * 80}ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${index * 80}ms`,
      }}>
      <Link href={`/products/${product.id}`}>
        <div className="relative h-44 bg-dark-700 overflow-hidden">
          <img src={product.image} alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x300/252540/999?text=${encodeURIComponent(product.brand)}`; }} />
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">-{disc}%</span>
        </div>
      </Link>
      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-white text-sm leading-snug mb-2 hover:text-orange-400 transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-bold text-orange-400 text-lg">{format(product.price)}</span>
          <span className="text-gray-500 text-sm line-through">{format(product.originalPrice)}</span>
        </div>
        <div className="mb-3">
          <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-pink-500 to-orange-400 transition-all duration-1000" style={{ width: '62%' }} />
          </div>
          <p className="text-xs text-gray-500 mt-1">62% sold</p>
        </div>
        <button onClick={() => addItem(product)}
          className="w-full py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 shimmer-btn"
          style={{ background: 'linear-gradient(135deg, #e8517a, #f4874b)' }}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default function FlashDeals() {
  const deals = getFlashDeals();
  const { time, changed } = useCountdown(8);
  const [headerRef, headerVisible] = useScrollAnimation();

  return (
    <section className="bg-dark-900 py-14">
      <div className="container-custom">
        <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div style={{ transition: 'all 0.5s ease', opacity: headerVisible ? 1 : 0, transform: headerVisible ? 'translateY(0)' : 'translateY(16px)' }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">⚡</span>
              <h2 className="font-display text-3xl font-bold text-white section-underline" style={{ display: 'inline-block' }}>Flash Deals</h2>
            </div>
            <p className="text-gray-400 text-sm">Limited-time offers — grab them before they're gone</p>
          </div>
          
          <div className="flex items-center gap-1 text-white"
            style={{ transition: 'all 0.5s ease 0.2s', opacity: headerVisible ? 1 : 0, transform: headerVisible ? 'translateY(0)' : 'translateY(12px)' }}>
            <DigitBlock value={time.h} ticked={changed.h} />
            <span className="text-orange-400 font-bold text-2xl">:</span>
            <DigitBlock value={time.m} ticked={changed.m} />
            <span className="text-orange-400 font-bold text-2xl">:</span>
            <DigitBlock value={time.s} ticked={changed.s} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {deals.map((product, i) => <DealCard key={product.id} product={product} index={i} />)}
        </div>

        <div className="text-center mt-8">
          <Link href="/deals" className="btn-outline border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white">
            View All Flash Deals →
          </Link>
        </div>
      </div>
    </section>
  );
}

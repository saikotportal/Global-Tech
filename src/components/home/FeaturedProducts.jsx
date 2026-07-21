'use client';
import Link from 'next/link';
import { useState } from 'react';
import { getFeaturedProducts } from '@/lib/products';
import { calcDiscount } from '@/utils/helpers';
import { useCart } from '@/hooks/useCart';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const TABS = ['All', 'Phones', 'Laptops', 'TVs', 'Gaming'];

function ProductCard({ p, index }) {
  const [ref, visible] = useScrollAnimation({ threshold: 0.08 });
  const [hovered, setHovered] = useState(false);
  const { addItem } = useCart();
  const disc = calcDiscount(p.originalPrice, p.price);

  return (
    <div ref={ref} className="card group relative overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.94)',
        transition: `opacity 0.5s cubic-bezier(0.22,1,0.36,1) ${index * 70}ms, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${index * 70}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <Link href={`/products/${p.id}`}>
        <div className="relative h-44 sm:h-52 bg-gray-50 rounded-t-2xl overflow-hidden">
          <img src={p.image} alt={p.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
            style={{ transform: hovered ? 'scale(1.08)' : 'scale(1)' }}
            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x300/f5f5f5/999?text=${encodeURIComponent(p.brand)}`; }} />
          {p.badge && (
            <span className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full text-white"
              style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>{p.badge}</span>
          )}
          {disc > 0 && (
            <span className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full bg-green-500 text-white">-{disc}%</span>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 transition-all duration-300"
            style={{ transform: hovered ? 'translateY(0)' : 'translateY(100%)', opacity: hovered ? 1 : 0 }}>
            <button onClick={(e) => { e.preventDefault(); addItem(p); }}
              disabled={!p.inStock}
              className="w-full py-2.5 text-xs font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed shimmer-btn"
              style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
              {p.inStock ? '+ Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </Link>
      <div className="p-4">
        <p className="text-xs text-gray-400 mb-1">{p.brand}</p>
        <Link href={`/products/${p.id}`}>
          <h3 className="font-semibold text-sm text-dark-800 leading-snug hover:text-orange-500 transition-colors line-clamp-2 mb-2">{p.name}</h3>
        </Link>
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-yellow-400 text-xs">{'★'.repeat(Math.round(p.rating))}{'☆'.repeat(5 - Math.round(p.rating))}</div>
          <span className="text-xs text-gray-400">({p.reviews.toLocaleString()})</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-dark-800">${p.price}</span>
          {p.originalPrice > p.price && <span className="text-xs text-gray-400 line-through">${p.originalPrice}</span>}
        </div>
        
        <button onClick={() => addItem(p)} disabled={!p.inStock}
          className="w-full py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white sm:hidden"
          style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
          {p.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  const all = getFeaturedProducts();
  const [tab, setTab] = useState('All');
  const [titleRef, titleVisible] = useScrollAnimation();

  const filtered = tab === 'All' ? all : all.filter(p => p.category.toLowerCase().includes(tab.toLowerCase()));

  return (
    <section className="container-custom py-14">
      <div ref={titleRef} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div style={{ transition: 'all 0.5s ease', opacity: titleVisible ? 1 : 0, transform: titleVisible ? 'translateY(0)' : 'translateY(16px)' }}>
          <h2 className="section-title section-underline mb-1" style={{ display: 'inline-block' }}>Featured Products</h2>
          <p className="text-gray-500 text-sm mt-1">Bestsellers &amp; trending items</p>
        </div>
        <div className="flex gap-2 flex-wrap" style={{ transition: 'all 0.5s ease 0.15s', opacity: titleVisible ? 1 : 0, transform: titleVisible ? 'translateY(0)' : 'translateY(12px)' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${t === tab ? 'text-white shadow-brand scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'}`}
              style={t === tab ? { background: 'linear-gradient(135deg,#e8517a,#f4874b)' } : {}}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filtered.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
      </div>

      <div className="text-center mt-10">
        <Link href="/products" className="btn-primary shimmer-btn">View All Products →</Link>
      </div>
    </section>
  );
}

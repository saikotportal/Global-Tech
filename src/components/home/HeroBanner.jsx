'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const SLIDES = [
  {
    headline: 'iPhone 16 Pro Max',
    sub: 'A18 Pro chip. Titanium. The most powerful iPhone ever.',
    badge: 'Just Arrived',
    cta: 'Shop Now',
    href: '/products?category=phones',
    accent: '#e8517a',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80',
    saving: 'Save $100',
  },
  {
    headline: 'MacBook Pro M4',
    sub: 'Outrageous performance. All day battery. Built for pros.',
    badge: 'New Release',
    cta: 'Explore',
    href: '/products?category=laptops',
    accent: '#f4874b',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
    saving: 'Save $300',
  },
  {
    headline: 'LG C4 OLED 77"',
    sub: 'Cinematic picture quality. Perfect blacks. Infinite contrast.',
    badge: 'Flash Deal',
    cta: 'Get the Deal',
    href: '/products?category=tvs',
    accent: '#f5c518',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600&q=80',
    saving: 'Save $700',
  },
  {
    headline: 'PS5 Pro',
    sub: 'Play at 4K 120fps. The next generation is here.',
    badge: 'Bestseller',
    cta: 'Shop Gaming',
    href: '/products?category=gaming',
    accent: '#a855f7',
    image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=600&q=80',
    saving: 'Limited Stock',
  },
];

export default function HeroBanner() {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const t = setInterval(() => go((active + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, [active]);

  function go(idx) {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setActive(idx);
      setKey(k => k + 1);
      setAnimating(false);
    }, 300);
  }

  const slide = SLIDES[active];

  return (
    <section className="relative overflow-hidden bg-dark-900" style={{ minHeight: 520 }}>
      
      <div className="absolute inset-0 overflow-hidden">
        <div
          key={`bg-${active}`}
          className="absolute inset-0 ken-burns"
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.12,
            transition: 'opacity 0.6s ease',
          }}
        />
      </div>

      
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse 60% 80% at 70% 50%, ${slide.accent}22 0%, transparent 70%), #0f0f1a`,
        }}
      />

      
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      <div className="relative container-custom flex flex-col md:flex-row items-center gap-10 py-16 md:py-24">
        
        <div
          className="flex-1 text-white"
          style={{ opacity: animating ? 0 : 1, transform: animating ? 'translateY(12px)' : 'translateY(0)', transition: 'all .3s ease' }}
        >
          <span
            key={`badge-${key}`}
            className="hero-headline inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ background: `${slide.accent}33`, color: slide.accent, border: `1px solid ${slide.accent}55` }}
          >
            {slide.badge}
          </span>
          <h1 key={`h1-${key}`} className="hero-headline font-display text-4xl md:text-6xl font-bold leading-tight mb-4">
            {slide.headline}
          </h1>
          <p key={`sub-${key}`} className="hero-sub text-gray-400 text-lg mb-8 max-w-md">{slide.sub}</p>
          <div key={`cta-${key}`} className="hero-cta flex items-center gap-4 flex-wrap">
            <Link
              href={slide.href}
              className="shimmer-btn inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white transition-all hover:scale-105 hover:shadow-brand-lg"
              style={{ background: `linear-gradient(135deg, ${slide.accent}, #f4874b)` }}
            >
              {slide.cta} →
            </Link>
            <span className="text-sm font-semibold px-3 py-1.5 rounded-lg bg-white/10 text-white">
              {slide.saving}
            </span>
          </div>
          
          <div key={`dots-${key}`} className="hero-dots flex gap-2 mt-10">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{ width: i === active ? 28 : 8, background: i === active ? slide.accent : '#ffffff33' }}
              />
            ))}
          </div>
        </div>

        
        <div
          className="flex-shrink-0 flex items-center justify-center"
          style={{ opacity: animating ? 0 : 1, transform: animating ? 'scale(.9)' : 'scale(1)', transition: 'all .3s ease' }}
        >
          <div
            className="w-56 h-56 md:w-72 md:h-72 rounded-3xl overflow-hidden"
            style={{ border: `2px solid ${slide.accent}33`, boxShadow: `0 0 80px ${slide.accent}30` }}
          >
            <img
              src={slide.image}
              alt={slide.headline}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x400/1a1a2e/666?text=${encodeURIComponent(slide.headline)}`; }}
            />
          </div>
        </div>
      </div>

      
      <button
        onClick={() => go((active - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-110"
      >‹</button>
      <button
        onClick={() => go((active + 1) % SLIDES.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-110"
      >›</button>
    </section>
  );
}

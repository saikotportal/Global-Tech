'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const BRANDS = [
  { name: 'Apple',     slug: 'Apple',     logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
  { name: 'Samsung',   slug: 'Samsung',   logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' },
  { name: 'Sony',      slug: 'Sony',      logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg' },
  { name: 'Google',    slug: 'Google',    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
  { name: 'Microsoft', slug: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
  { name: 'LG',        slug: 'LG',        logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/LG_logo_%282015%29.svg' },
  { name: 'Dell',      slug: 'Dell',      logo: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg' },
  { name: 'Canon',     slug: 'Canon',     logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Canon_wordmark.svg' },
  { name: 'DJI',       slug: 'DJI',       logo: 'https://upload.wikimedia.org/wikipedia/commons/9/92/DJI_logo.svg' },
  { name: 'Bose',      slug: 'Bose',      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Bose_logo.svg' },
  { name: 'Lenovo',    slug: 'Lenovo',    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Lenovo_logo_2015.svg' },
  { name: 'ASUS',      slug: 'ASUS',      logo: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Asus_Logo.svg' },
];

const TRACK = [...BRANDS, ...BRANDS, ...BRANDS];

export default function BrandLogos() {
  const trackRef = useRef(null);
  const [sectionRef, visible] = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={sectionRef}
      className="border-y border-gray-100 py-10 bg-white overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <style>{`
        @keyframes scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        .brand-track {
          display: flex;
          width: max-content;
          animation: scroll-left 30s linear infinite;
          will-change: transform;
        }
        .brand-track:hover {
          animation-play-state: paused;
        }
        .brand-card img {
          filter: grayscale(1) opacity(0.45);
          transition: filter 0.35s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
        }
        .brand-card:hover img {
          filter: grayscale(0) opacity(1);
          transform: scale(1.15);
        }
      `}</style>

      <p
        className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-8"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s',
        }}
      >
        Top Brands
      </p>

      <div className="relative">
        
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, white, transparent)' }} />
        
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, white, transparent)' }} />

        <div ref={trackRef} className="brand-track">
          {TRACK.map((brand, i) => (
            <Link
              key={`${brand.slug}-${i}`}
              href={`/brand/${encodeURIComponent(brand.slug)}`}
              className="brand-card flex-shrink-0 flex flex-col items-center justify-center gap-2 mx-10 cursor-pointer"
              style={{
                opacity: visible ? 1 : 0,
                transition: `opacity 0.4s ease ${(i % BRANDS.length) * 40}ms`,
              }}
            >
              <div className="w-20 h-12 flex items-center justify-center">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

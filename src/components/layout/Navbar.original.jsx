'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';

const FEATURED_CATEGORIES = [
  {
    label: 'Desktop',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>
    ),
    href: '/products?category=desktop',
    sub: ['All-in-One PCs', 'Gaming Desktops', 'Mini PCs', 'Workstations', 'Desktop Accessories'],
  },
  {
    label: 'Drone',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
      </svg>
    ),
    href: '/products?category=drones',
    sub: ['DJI AIR', 'DJI Mavic', 'DJI Mini', 'Racing Drones', 'Drone Accessories'],
  },
  {
    label: 'Laptop',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l9-5-9-5-9 5 9 5z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
      </svg>
    ),
    href: '/products?category=laptops',
    sub: ['Gaming Laptops', 'Ultrabooks', 'MacBooks', '2-in-1 Laptops', 'Business Laptops'],
  },
  {
    label: 'TV',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>
    ),
    href: '/products?category=tvs',
    sub: ['Smart TVs', 'OLED TVs', 'QLED TVs', '4K TVs', '8K TVs'],
  },
  {
    label: 'Phone',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
      </svg>
    ),
    href: '/products?category=phones',
    sub: ['Smartphones', 'Tablets', 'Cases & Covers', 'Chargers', 'Screen Protectors'],
  },
  {
    label: 'Camera',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
    ),
    href: '/products?category=cameras',
    sub: ['DSLR Cameras', 'Mirrorless', 'Action Cameras', 'Security Cameras', 'Lenses'],
  },
  {
    label: 'VR (Virtual Reality)',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
      </svg>
    ),
    href: '/products?category=vr',
    sub: ['VR Headsets', 'AR Glasses', 'VR Controllers', 'VR Games', 'VR Accessories'],
  },
  {
    label: 'Smart Watch',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    href: '/products?category=smartwatch',
    sub: ['Apple Watch', 'Samsung Galaxy Watch', 'Fitness Trackers', 'Kids Watches', 'Watch Bands'],
  },
  {
    label: 'Gaming Console',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"/>
      </svg>
    ),
    href: '/products?category=gaming',
    sub: ['PlayStation 5', 'Xbox Series X', 'Nintendo Switch', 'Gaming Controllers', 'Gaming Headsets'],
  },
  {
    label: 'Router',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"/>
      </svg>
    ),
    href: '/products?category=networking',
    sub: ['WiFi Routers', 'Mesh Systems', 'Modems', 'Network Switches', 'Range Extenders'],
  },
  {
    label: 'Entertainment',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/>
      </svg>
    ),
    href: '/products?category=entertainment',
    sub: ['Streaming Devices', 'Projectors', 'Blu-ray Players', 'Soundbars', 'Media Players'],
  },
];

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/products', sub: ['All Products', 'New Arrivals', 'Best Sellers', 'Sale Items'] },
  { label: 'Product', href: '/products', sub: ['Featured Products', 'Flash Deals', 'Bundle Offers', 'Clearance'] },
  { label: 'Demo', href: '#', sub: ['Demo Store', 'Lookbook', 'Style Guide'] },
  { label: 'Blog', href: '#', sub: ['Tech News', 'Buying Guides', 'Reviews', 'How-To Tutorials'] },
  { label: 'Contact', href: '/contact' },
];

const ANNOUNCEMENT_MESSAGES = [
  '🚚 Free Shipping on all orders over $99',
  '🔥 Flash Sale — Up to 40% off gaming gear today only!',
  '🎁 Buy 2 Get 1 Free on all accessories this week',
  '📞 24/7 Support: 1-800-GLOBALTECH',
];

const CURRENCIES = [
  { code: 'USD', symbol: '$', flag: '🇺🇸' },
  { code: 'GBP', symbol: '£', flag: '🇬🇧' },
  { code: 'EUR', symbol: '€', flag: '🇪🇺' },
  { code: 'BDT', symbol: '৳', flag: '🇧🇩' },
];

const LANGUAGES = [
  { code: 'en', label: 'English (USD)' },
  { code: 'fr', label: 'Français (EUR)' },
  { code: 'de', label: 'Deutsch (EUR)' },
  { code: 'es', label: 'Español' },
];

const SOCIALS = [
  {
    href: 'https://twitter.com',
    icon: (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.261 5.636L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
      </svg>
    ),
  },
  {
    href: 'https://facebook.com',
    icon: (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    href: 'https://pinterest.com',
    icon: (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
      </svg>
    ),
  },
];

export default function Navbar() {
  const [scrolled,          setScrolled]         = useState(false);
  const [topBarVisible,     setTopBarVisible]    = useState(true);
  const [mobileOpen,        setMobileOpen]       = useState(false);
  const [categoryOpen,      setCategoryOpen]     = useState(false);
  const [hoveredCat,        setHoveredCat]       = useState(null);
  const [hoveredNav,        setHoveredNav]       = useState(null);
  const [searchQuery,       setSearchQuery]      = useState('');
  const [accountOpen,       setAccountOpen]      = useState(false);
  const [msgIndex,          setMsgIndex]         = useState(0);
  const [currencyOpen,      setCurrencyOpen]     = useState(false);
  const [langOpen,          setLangOpen]         = useState(false);
  const [selectedCurrency,  setSelectedCurrency] = useState(CURRENCIES[0]);
  const [selectedLang,      setSelectedLang]     = useState(LANGUAGES[0]);

  const lastScrollY  = useRef(0);
  const accountRef   = useRef(null);
  const currencyRef  = useRef(null);
  const langRef      = useRef(null);
  const categoryRef  = useRef(null);
  const navDropRef   = useRef(null);

  const { totalItems, openCart } = useCart();
  const { user, logout }         = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY.current;
      setScrolled(currentY > 20);
      if (currentY > 80) {
        if (diff > 4)       setTopBarVisible(false);
        else if (diff < -4) setTopBarVisible(true);
      } else {
        setTopBarVisible(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setMsgIndex(i => (i + 1) % ANNOUNCEMENT_MESSAGES.length), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (accountRef.current  && !accountRef.current.contains(e.target))  setAccountOpen(false);
      if (currencyRef.current && !currencyRef.current.contains(e.target)) setCurrencyOpen(false);
      if (langRef.current     && !langRef.current.contains(e.target))     setLangOpen(false);
      if (categoryRef.current && !categoryRef.current.contains(e.target)) { setCategoryOpen(false); setHoveredCat(null); }
      if (navDropRef.current  && !navDropRef.current.contains(e.target))  setHoveredNav(null);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <style>{`
        .navbar-card {
          background: #ffffff;
          box-shadow:
            0 1px 0 rgba(0,0,0,0.04),
            0 4px 24px rgba(0,0,0,0.07),
            0 1px 3px rgba(0,0,0,0.05);
        }
        .navbar-card-scrolled {
          box-shadow:
            0 2px 0 rgba(0,0,0,0.04),
            0 8px 32px rgba(0,0,0,0.12),
            0 2px 8px rgba(0,0,0,0.06);
        }
        .nav-search-bar {
          border: 1.5px solid #e5e7eb;
          border-radius: 6px;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .nav-search-bar:focus-within {
          border-color: #e8517a;
        }
        .search-btn {
          background: linear-gradient(135deg, #e8517a, #f4874b);
          color: white;
          padding: 0 18px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.02em;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: opacity 0.15s;
          white-space: nowrap;
        }
        .search-btn:hover { opacity: 0.92; }
        .featured-cat-btn {
          background: linear-gradient(135deg, #e8517a, #f4874b);
          color: white;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.01em;
          border: none;
          cursor: pointer;
          user-select: none;
          white-space: nowrap;
          flex-shrink: 0;
          transition: opacity 0.15s;
        }
        .featured-cat-btn:hover { opacity: 0.93; }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 10px 15px;
          font-size: 13.5px;
          font-weight: 600;
          color: #374151;
          white-space: nowrap;
          transition: color 0.15s, background 0.15s;
          border-radius: 0;
          position: relative;
        }
        .nav-link:hover, .nav-link.active {
          color: #e8517a;
          background: rgba(232,81,122,0.05);
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          right: 50%;
          height: 2px;
          background: linear-gradient(90deg, #e8517a, #f4874b);
          transition: left 0.2s, right 0.2s;
          border-radius: 2px 2px 0 0;
        }
        .nav-link:hover::after {
          left: 10px;
          right: 10px;
        }
        .phone-badge {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .phone-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e8517a, #f4874b);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .cart-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f9fafb;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          padding: 6px 14px 6px 10px;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .cart-pill:hover {
          border-color: #e8517a;
          background: rgba(232,81,122,0.04);
        }
        .cart-go-btn {
          background: linear-gradient(135deg, #e8517a, #f4874b);
          color: white;
          border: none;
          border-radius: 6px;
          padding: 7px 16px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: opacity 0.15s;
          text-transform: uppercase;
        }
        .cart-go-btn:hover { opacity: 0.9; }
        .topbar-social a {
          color: rgba(255,255,255,0.7);
          transition: color 0.15s;
          display: flex;
          align-items: center;
        }
        .topbar-social a:hover { color: #fff; }
        .dropdown-panel {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          z-index: 100;
          background: white;
          border-radius: 10px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
          border: 1px solid rgba(0,0,0,0.06);
          animation: dropIn 0.18s ease;
          overflow: hidden;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cat-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          z-index: 100;
          display: flex;
          animation: dropIn 0.18s ease;
          box-shadow: 0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 0 0 12px 12px;
          overflow: hidden;
        }
        .acct-dropdown {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          z-index: 100;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.13);
          border: 1px solid rgba(0,0,0,0.06);
          width: 200px;
          animation: dropIn 0.16s ease;
          overflow: hidden;
        }
      `}</style>

      <div className="sticky top-0 z-50">

        
        <div
          className="bg-gray-900 text-white text-xs overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: topBarVisible ? '34px' : '0px', opacity: topBarVisible ? 1 : 0 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[34px] flex items-center justify-between">
            
            <div className="flex items-center gap-3">
              <a href="mailto:support@globaltech.com"
                className="hidden sm:flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                support@globaltech.com
              </a>
              <div className="flex items-center gap-2 topbar-social ml-1">
                {SOCIALS.map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noreferrer">{s.icon}</a>
                ))}
              </div>
            </div>

            
            <div className="relative overflow-hidden flex-1 mx-4 h-[34px] flex items-center justify-center">
              {ANNOUNCEMENT_MESSAGES.map((msg, i) => (
                <span
                  key={i}
                  className="absolute inset-0 flex items-center justify-center transition-all duration-500 text-[11px] font-medium tracking-wide whitespace-nowrap"
                  style={{
                    opacity:   i === msgIndex ? 1 : 0,
                    transform: i === msgIndex ? 'translateY(0)' : i < msgIndex ? 'translateY(-100%)' : 'translateY(100%)',
                    color: 'rgba(255,255,255,0.88)',
                  }}
                >
                  {msg}
                </span>
              ))}
            </div>

            
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              <div className="relative" ref={currencyRef}>
                <button
                  onClick={() => { setCurrencyOpen(!currencyOpen); setLangOpen(false); }}
                  className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors px-2 py-1 rounded"
                >
                  <span>{selectedCurrency.flag}</span>
                  <span className="text-[11px]">{selectedCurrency.code}</span>
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                {currencyOpen && (
                  <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
                    {CURRENCIES.map((c) => (
                      <button key={c.code} onClick={() => { setSelectedCurrency(c); setCurrencyOpen(false); }}
                        className={`flex items-center gap-2 w-full px-3 py-1.5 text-xs text-left hover:bg-red-50 hover:text-red-500 transition-colors ${selectedCurrency.code === c.code ? 'text-red-500 font-semibold' : 'text-gray-700'}`}>
                        <span>{c.flag}</span><span>{c.code}</span><span className="text-gray-400">({c.symbol})</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-gray-700">|</span>
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => { setLangOpen(!langOpen); setCurrencyOpen(false); }}
                  className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors px-2 py-1 rounded"
                >
                  <span className="text-[11px]">{selectedLang.label}</span>
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
                    {LANGUAGES.map((l) => (
                      <button key={l.code} onClick={() => { setSelectedLang(l); setLangOpen(false); }}
                        className={`flex items-center gap-2 w-full px-3 py-1.5 text-xs text-left hover:bg-red-50 hover:text-red-500 transition-colors ${selectedLang.code === l.code ? 'text-red-500 font-semibold' : 'text-gray-700'}`}>
                        {l.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-gray-700">|</span>
              <Link href="/account" className="text-[11px] text-gray-400 hover:text-white transition-colors flex items-center gap-1 px-2 py-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                My Account
              </Link>
            </div>
          </div>
        </div>

        
        <header className={`navbar-card transition-all duration-300 ${scrolled ? 'navbar-card-scrolled' : ''}`}>

          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-5 py-3.5">

              
              <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                <img src="/logo.png" alt="GlobalTech" className="h-9 w-auto" />
              </Link>

              
              <div className="flex-1 max-w-xl hidden md:block">
                <div className="nav-search-bar flex">
                  <input
                    type="text"
                    placeholder="Search here..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') window.location.href = `/search?q=${searchQuery}`; }}
                    className="flex-1 px-4 py-2.5 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
                  />
                  <button
                    onClick={() => window.location.href = `/search?q=${searchQuery}`}
                    className="search-btn"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                  </button>
                </div>
              </div>

              
              <div className="hidden lg:flex phone-badge flex-shrink-0">
                <div className="phone-icon-wrap">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-[13px] font-bold text-gray-800 leading-tight">(+1) 800-456-2789</div>
                  <div className="text-[10px] text-gray-400 leading-tight">Mon-Fri: 8:30am–7:30pm; Sat–Sun: 9:30am–4:30pm</div>
                </div>
              </div>

              
              <div className="flex items-center gap-2 ml-auto flex-shrink-0">
                
                <Link href="/account?tab=wishlist" className="hidden md:flex flex-col items-center text-gray-500 hover:text-red-500 transition-colors p-1.5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </Link>

                
                {user ? (
                  <div className="hidden md:block relative" ref={accountRef}>
                    <button onClick={() => setAccountOpen(!accountOpen)}
                      className="flex flex-col items-center text-gray-500 hover:text-red-500 transition-colors p-1.5">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    </button>
                    {accountOpen && (
                      <div className="acct-dropdown">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-sm text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                        <Link href="/account" onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors">My Account</Link>
                        <Link href="/account?tab=orders" onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors">Orders</Link>
                        <Link href="/account?tab=wishlist" onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors">Wishlist</Link>
                        <div className="border-t border-gray-100">
                          <button onClick={() => { logout(); setAccountOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">Sign Out</button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/account?login=true" className="hidden md:flex flex-col items-center text-gray-500 hover:text-red-500 transition-colors p-1.5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </Link>
                )}

                
                <div className="hidden md:flex items-center gap-2">
                  <button onClick={openCart} className="cart-pill">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-[10px] text-gray-400 leading-tight">{totalItems} item{totalItems !== 1 ? 's' : ''}</div>
                      <div className="text-[13px] font-bold text-gray-800 leading-tight">
                        ${(totalItems * 0).toFixed(2)}
                      </div>
                    </div>
                    {totalItems > 0 && (
                      <span className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #e8517a, #f4874b)' }}>
                        {totalItems > 9 ? '9+' : totalItems}
                      </span>
                    )}
                  </button>
                  <button onClick={openCart} className="cart-go-btn">GO</button>
                </div>

                
                <button className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100" onClick={() => setMobileOpen(!mobileOpen)}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {mobileOpen
                      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                      : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
                  </svg>
                </button>
              </div>
            </div>

            
            <nav className="hidden md:flex items-center border-t border-gray-100">

              
              <div className="relative flex-shrink-0" ref={categoryRef}>
                <button
                  onClick={() => { setCategoryOpen(!categoryOpen); setHoveredCat(null); }}
                  className="featured-cat-btn"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 6h16M4 12h16M4 18h16"/>
                  </svg>
                  Featured Category
                  <svg
                    className="w-3 h-3 transition-transform duration-200 ml-1"
                    style={{ transform: categoryOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>

                {categoryOpen && (
                  <div className="cat-dropdown">
                    <ul className="bg-white w-52 py-2 flex-shrink-0">
                      {FEATURED_CATEGORIES.map((cat) => (
                        <li key={cat.label}>
                          <Link
                            href={cat.href}
                            className={`flex items-center justify-between gap-2 px-4 py-2.5 text-sm transition-colors ${hoveredCat === cat.label ? 'bg-red-50 text-red-500' : 'text-gray-700 hover:bg-red-50 hover:text-red-500'}`}
                            onMouseEnter={() => setHoveredCat(cat.label)}
                          >
                            <span className="flex items-center gap-2">
                              <span className={`transition-colors ${hoveredCat === cat.label ? 'text-red-400' : 'text-gray-400'}`}>{cat.icon}</span>
                              <span className="font-medium">{cat.label}</span>
                            </span>
                            {cat.sub && (
                              <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                              </svg>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    {hoveredCat && (() => {
                      const active = FEATURED_CATEGORIES.find(c => c.label === hoveredCat);
                      return active?.sub ? (
                        <div className="bg-gray-50 border-l border-gray-100 w-48 py-3 flex-shrink-0">
                          <p className="px-4 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{active.label}</p>
                          <ul>
                            {active.sub.map((item) => (
                              <li key={item}>
                                <Link
                                  href={`${active.href}&sub=${item.toLowerCase().replace(/\s+/g, '-')}`}
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors font-medium"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>

              
              <div className="flex items-center" ref={navDropRef}>
                {NAV_LINKS.map((link) => (
                  <div key={link.label} className="relative"
                    onMouseEnter={() => link.sub && setHoveredNav(link.label)}
                    onMouseLeave={() => setHoveredNav(null)}
                  >
                    <Link href={link.href} className="nav-link">
                      {link.label}
                      {link.sub && (
                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                        </svg>
                      )}
                    </Link>
                    {link.sub && hoveredNav === link.label && (
                      <div className="dropdown-panel min-w-max">
                        {link.sub.map((item) => (
                          <Link
                            key={item}
                            href={`${link.href}?tag=${item.toLowerCase().replace(/\s+/g, '-')}`}
                            className="flex items-center gap-2 px-5 py-2.5 text-sm text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors font-medium"
                          >
                            <span className="w-1 h-1 rounded-full bg-red-300 flex-shrink-0" />
                            {item}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              
              <Link href="/products?tag=flash-deals"
                className="ml-auto px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors whitespace-nowrap flex items-center gap-1.5 flex-shrink-0">
                ⚡ Flash Deals
              </Link>
            </nav>
          </div>
        </header>
      </div>

      
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-16 overflow-y-auto md:hidden">
          <div className="p-4">
            <div className="flex gap-3 mb-4 pb-4 border-b border-gray-100">
              <select value={selectedCurrency.code}
                onChange={(e) => setSelectedCurrency(CURRENCIES.find(c => c.code === e.target.value))}
                className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none">
                {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
              </select>
              <select value={selectedLang.code}
                onChange={(e) => setSelectedLang(LANGUAGES.find(l => l.code === e.target.value))}
                className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none">
                {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
              </select>
            </div>
            <div className="nav-search-bar flex mb-4">
              <input type="text" placeholder="Search products..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 text-sm outline-none bg-transparent" />
              <button onClick={() => { window.location.href = `/search?q=${searchQuery}`; setMobileOpen(false); }} className="search-btn">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </button>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Categories</p>
            {FEATURED_CATEGORIES.map((cat) => (
              <Link key={cat.label} href={cat.href} onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 py-3 text-gray-700 border-b border-gray-100 font-medium text-sm">
                <span className="text-gray-400">{cat.icon}</span>
                {cat.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2">
              <Link href="/account" onClick={() => setMobileOpen(false)}
                className="text-center py-3 border-2 border-red-400 rounded-xl text-sm font-semibold text-red-500">My Account</Link>
              <button onClick={openCart}
                className="py-3 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
                View Cart ({totalItems})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

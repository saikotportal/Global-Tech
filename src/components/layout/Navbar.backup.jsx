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
  { label: 'Home',       href: '/' },
  {
    label: 'Shop', href: '/products',
    sub: ['All Products', 'New Arrivals', 'Best Sellers', 'Sale Items'],
  },
  {
    label: 'Product', href: '/products',
    sub: ['Featured Products', 'Flash Deals', 'Bundle Offers', 'Clearance'],
  },
  {
    label: 'Demo', href: '#',
    sub: ['Demo Store', 'Lookbook', 'Style Guide'],
  },
  {
    label: 'Blog', href: '#',
    sub: ['Tech News', 'Buying Guides', 'Reviews', 'How-To Tutorials'],
  },
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
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
];

export default function Navbar() {
  const [scrolled,         setScrolled]        = useState(false);
  const [topBarVisible,    setTopBarVisible]   = useState(true);
  const [mobileOpen,       setMobileOpen]      = useState(false);
  const [categoryOpen,     setCategoryOpen]    = useState(false);
  const [hoveredCat,       setHoveredCat]      = useState(null);
  const [hoveredNav,       setHoveredNav]      = useState(null);
  const [searchQuery,      setSearchQuery]     = useState('');
  const [accountOpen,      setAccountOpen]     = useState(false);
  const [msgIndex,         setMsgIndex]        = useState(0);
  const [currencyOpen,     setCurrencyOpen]    = useState(false);
  const [langOpen,         setLangOpen]        = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);
  const [selectedLang,     setSelectedLang]   = useState(LANGUAGES[0]);

  const lastScrollY    = useRef(0);
  const accountRef     = useRef(null);
  const currencyRef    = useRef(null);
  const langRef        = useRef(null);
  const categoryRef    = useRef(null);
  const navDropRef     = useRef(null);

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
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setCategoryOpen(false);
        setHoveredCat(null);
      }
      if (navDropRef.current  && !navDropRef.current.contains(e.target))  setHoveredNav(null);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <div className="sticky top-0 z-50">

        
        <div
          className="bg-gray-900 text-white text-xs overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: topBarVisible ? '36px' : '0px', opacity: topBarVisible ? 1 : 0 }}
        >
          <div className="relative overflow-hidden h-9 flex items-center justify-center">
            {ANNOUNCEMENT_MESSAGES.map((msg, i) => (
              <span
                key={i}
                className="absolute inset-0 flex items-center justify-center transition-all duration-500 whitespace-nowrap text-xs font-medium tracking-wide"
                style={{
                  opacity:   i === msgIndex ? 1 : 0,
                  transform: i === msgIndex ? 'translateY(0)' : i < msgIndex ? 'translateY(-100%)' : 'translateY(100%)',
                }}
              >
                {msg}
              </span>
            ))}
          </div>
        </div>

        
        <header className={`bg-white transition-all duration-300 ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}>

          
          <div className="border-b border-gray-100">
            <div className="container-custom flex items-center h-9 gap-4 text-xs text-gray-500">
              <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
                <a href="mailto:support@globaltech.com" className="flex items-center gap-1.5 hover:text-orange-500 transition-colors">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  support@globaltech.com
                </a>
                <span className="text-gray-200">|</span>
                <a href="tel:+18004562789" className="flex items-center gap-1.5 hover:text-orange-500 transition-colors">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  (+1) 800-456-2789
                </a>
              </div>
              <div className="flex-1" />
              <div className="hidden md:flex items-center gap-3 flex-shrink-0">
                
                <div className="relative" ref={currencyRef}>
                  <button
                    onClick={() => { setCurrencyOpen(!currencyOpen); setLangOpen(false); }}
                    className="flex items-center gap-1 hover:text-orange-500 transition-colors py-1 px-1.5 rounded hover:bg-orange-50"
                  >
                    <span>{selectedCurrency.flag}</span>
                    <span>{selectedCurrency.code}</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>
                  {currencyOpen && (
                    <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
                      {CURRENCIES.map((c) => (
                        <button key={c.code} onClick={() => { setSelectedCurrency(c); setCurrencyOpen(false); }}
                          className={`flex items-center gap-2 w-full px-3 py-1.5 text-xs text-left hover:bg-orange-50 hover:text-orange-600 transition-colors ${selectedCurrency.code === c.code ? 'text-orange-500 font-semibold' : 'text-gray-700'}`}>
                          <span>{c.flag}</span><span>{c.code}</span><span className="text-gray-400">({c.symbol})</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-gray-200">|</span>
                
                <div className="relative" ref={langRef}>
                  <button
                    onClick={() => { setLangOpen(!langOpen); setCurrencyOpen(false); }}
                    className="flex items-center gap-1 hover:text-orange-500 transition-colors py-1 px-1.5 rounded hover:bg-orange-50"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
                    </svg>
                    <span>{selectedLang.label}</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>
                  {langOpen && (
                    <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
                      {LANGUAGES.map((l) => (
                        <button key={l.code} onClick={() => { setSelectedLang(l); setLangOpen(false); }}
                          className={`flex items-center gap-2 w-full px-3 py-1.5 text-xs text-left hover:bg-orange-50 hover:text-orange-600 transition-colors ${selectedLang.code === l.code ? 'text-orange-500 font-semibold' : 'text-gray-700'}`}>
                          {l.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-gray-200">|</span>
                <Link href="/about"   className="hover:text-orange-500 transition-colors">About</Link>
                <Link href="/contact" className="hover:text-orange-500 transition-colors">Contact</Link>
                <Link href="/faq"     className="hover:text-orange-500 transition-colors">FAQ</Link>
              </div>
            </div>
          </div>

          
          <div className="container-custom">
            <div className="flex items-center h-16 gap-4">
              <Link href="/" className="flex-shrink-0">
                <img src="/logo.png" alt="GlobalTech" className="h-10 w-auto" />
              </Link>
              <div className="flex-1 max-w-2xl hidden md:flex">
                <form
                  className="flex w-full border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-orange-400 transition-colors"
                  onSubmit={(e) => { e.preventDefault(); window.location.href = `/search?q=${searchQuery}`; }}
                >
                  <input
                    type="text"
                    placeholder="Search phones, laptops, TVs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-2.5 text-sm outline-none"
                  />
                  <button type="submit"
                    className="px-5 py-2.5 text-white text-sm font-medium transition-opacity hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #e8517a, #f4874b)' }}>
                    Search
                  </button>
                </form>
              </div>
              <div className="flex items-center gap-3 ml-auto">
                
                <Link href="/account?tab=wishlist" className="hidden md:flex flex-col items-center text-gray-600 hover:text-orange-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                  <span className="text-xs mt-0.5">Wishlist</span>
                </Link>
                
                {user ? (
                  <div className="hidden md:block relative" ref={accountRef}>
                    <button onClick={() => setAccountOpen(!accountOpen)}
                      className="flex flex-col items-center text-gray-600 hover:text-orange-500 transition-colors">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs mt-0.5">{user.name.split(' ')[0]}</span>
                    </button>
                    {accountOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="font-semibold text-sm text-dark-800">{user.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                        <Link href="/account" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors">My Account</Link>
                        <Link href="/account?tab=orders" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors">Orders</Link>
                        <Link href="/account?tab=wishlist" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors">Wishlist</Link>
                        <div className="border-t border-gray-100 mt-1">
                          <button onClick={() => { logout(); setAccountOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">Sign Out</button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/account?login=true" className="hidden md:flex flex-col items-center text-gray-600 hover:text-orange-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-xs mt-0.5">Account</span>
                  </Link>
                )}
                
                <button onClick={openCart} className="relative flex flex-col items-center text-gray-600 hover:text-orange-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-xs mt-0.5">Cart</span>
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-xs font-bold flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #e8517a, #f4874b)' }}>
                      {totalItems > 9 ? '9+' : totalItems}
                    </span>
                  )}
                </button>
                
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
                  className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-white flex-shrink-0 select-none"
                  style={{ background: 'linear-gradient(135deg, #e8517a, #f4874b)' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                  </svg>
                  Featured Category
                  <svg
                    className="w-3 h-3 transition-transform duration-200"
                    style={{ transform: categoryOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>

                
                {categoryOpen && (
                  <div className="absolute top-full left-0 z-50 flex shadow-2xl border border-gray-100 rounded-b-xl overflow-hidden"
                    style={{ minWidth: '200px' }}>

                    
                    <ul className="bg-white w-52 py-2 flex-shrink-0">
                      {FEATURED_CATEGORIES.map((cat) => (
                        <li key={cat.label}>
                          <Link
                            href={cat.href}
                            className={`flex items-center justify-between gap-2 px-4 py-2.5 text-sm transition-colors group ${hoveredCat === cat.label ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'}`}
                            onMouseEnter={() => setHoveredCat(cat.label)}
                          >
                            <span className="flex items-center gap-2">
                              <span className={`transition-colors ${hoveredCat === cat.label ? 'text-orange-500' : 'text-gray-400'}`}>
                                {cat.icon}
                              </span>
                              {cat.label}
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
                          <p className="px-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">{active.label}</p>
                          <ul>
                            {active.sub.map((item) => (
                              <li key={item}>
                                <Link
                                  href={`${active.href}&sub=${item.toLowerCase().replace(/\s+/g, '-')}`}
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                                >
                                  <span className="w-1 h-1 rounded-full bg-orange-400 flex-shrink-0" />
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
                    <Link
                      href={link.href}
                      className="flex items-center gap-1 px-4 py-3 text-sm font-medium text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-colors whitespace-nowrap"
                    >
                      {link.label}
                      {link.sub && (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                        </svg>
                      )}
                    </Link>
                    
                    {link.sub && hoveredNav === link.label && (
                      <div className="absolute top-full left-0 z-50 bg-white border border-gray-100 rounded-xl shadow-xl py-2 min-w-max">
                        {link.sub.map((item) => (
                          <Link
                            key={item}
                            href={`${link.href}?tag=${item.toLowerCase().replace(/\s+/g, '-')}`}
                            className="block px-5 py-2 text-sm text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                          >
                            {item}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              
              <Link href="/products?tag=flash-deals"
                className="ml-auto px-4 py-3 text-sm font-semibold text-orange-500 hover:bg-orange-50 transition-colors whitespace-nowrap flex items-center gap-1 flex-shrink-0">
                ⚡ Flash Deals
              </Link>
            </nav>
          </div>
        </header>
      </div>

      
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-16 overflow-y-auto md:hidden animate-fade-in">
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
            <form className="flex mb-4 border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-orange-400"
              onSubmit={(e) => { e.preventDefault(); window.location.href = `/search?q=${searchQuery}`; setMobileOpen(false); }}>
              <input type="text" placeholder="Search..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 text-sm outline-none" />
              <button type="submit" className="px-4 text-orange-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </button>
            </form>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Categories</p>
            {FEATURED_CATEGORIES.map((cat) => (
              <Link key={cat.label} href={cat.href} onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 py-3 text-gray-700 border-b border-gray-100 font-medium">
                <span className="text-gray-400">{cat.icon}</span>
                {cat.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2">
              <Link href="/account" onClick={() => setMobileOpen(false)} className="btn-outline text-center">My Account</Link>
              <button onClick={openCart} className="btn-primary">View Cart ({totalItems})</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

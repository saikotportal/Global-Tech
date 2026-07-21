'use client';

import Link from 'next/link';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const FOOTER_LINKS = {
  'Shop': [
    { label: 'Phones',              href: '/products?category=phones' },
    { label: 'Laptops',             href: '/products?category=laptops' },
    { label: 'TVs & Audio',         href: '/products?category=tvs' },
    { label: 'Gaming',              href: '/products?category=gaming' },
    { label: 'Cameras',             href: '/products?category=cameras' },
    { label: 'Smart Home',          href: '/products?category=smart-home' },
    { label: 'Flash Deals',         href: '/deals' },
    { label: 'Compare Products',    href: '/compare' },
  ],
  'Support': [
    { label: 'Support Hub',          href: '/support' },
    { label: 'Contact Us',           href: '/contact' },
    { label: 'FAQ',                  href: '/faq' },
    { label: 'Shipping Info',        href: '/shipping' },
    { label: 'Returns & Exchanges',  href: '/returns' },
    { label: 'Track Order',          href: '/track' },
    { label: 'Warranty',             href: '/faq' },
  ],
  'Company': [
    { label: 'About Us',            href: '/about' },
    { label: 'Careers',             href: '/about' },
    { label: 'Affiliates',          href: '/about' },
    { label: 'Sustainability',      href: '/about' },
    { label: 'Privacy Policy',      href: '/privacy-policy' },
    { label: 'Terms of Service',    href: '/terms-of-service' },
    { label: 'Cookie Policy',       href: '/cookie-policy' },
    { label: 'Sitemap',             href: '/sitemap' },
  ],
};

const SOCIALS = [
  { name: 'Twitter',   icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  { name: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
  { name: 'YouTube',   icon: 'M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z' },
  { name: 'Facebook',  icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
];

function AdminGate({ onClose }) {
  const [phase, setPhase] = useState('loading');
  const [pw, setPw] = useState('');
  const [shake, setShake] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => setPhase('password'), 2200);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pw === 'admin123') {
      router.push('/admin');
      onClose();
    } else {
      setShake(true);
      setPw('');
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.92)' }}>
      {phase === 'loading' ? (
        <div className="flex flex-col items-center gap-5">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-orange-500/20 animate-ping" />
            <div className="absolute inset-0 rounded-full border-4 border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-orange-400 text-xl font-bold">GT</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm tracking-widest uppercase animate-pulse">Accessing Admin</p>
        </div>
      ) : (
        <div className={`bg-gray-900 rounded-2xl p-8 w-full max-w-sm mx-4 border border-gray-800 shadow-2xl ${shake ? 'animate-bounce' : ''}`}>
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h2 className="text-white text-xl font-bold">Admin Access</h2>
            <p className="text-gray-500 text-sm mt-1">Enter your admin password to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              autoFocus
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors text-sm"
            />
            <button type="submit"
              className="w-full py-3 rounded-xl font-bold text-white text-sm transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
              Enter Admin Panel
            </button>
            <button type="button" onClick={onClose}
              className="w-full py-2 text-gray-500 hover:text-gray-300 text-sm transition-colors">
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function Footer() {
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [showGate, setShowGate] = useState(false);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef(null);

  const handleLogoClick = useCallback(() => {
    clickCountRef.current += 1;
    clearTimeout(clickTimerRef.current);
    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      setShowGate(true);
    } else {
      clickTimerRef.current = setTimeout(() => { clickCountRef.current = 0; }, 600);
    }
  }, []);

  const handleInquiry = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setInquiryName(''); setInquiryEmail(''); setInquiryMsg('');
  };

  return (
    <>
      {showGate && <AdminGate onClose={() => setShowGate(false)} />}

      <footer className="bg-dark-800 text-gray-400 mt-16">
        
        <div className="container-custom py-16">
          <div className="grid grid-cols-2 md:grid-cols-7 gap-8">

            
            <div className="col-span-2">
              <div className="mb-4 cursor-pointer select-none" onClick={handleLogoClick} title="">
                <img src="/logo.png" alt="GlobalTech" className="h-10 w-auto brightness-0 invert" />
              </div>
              <p className="text-sm leading-relaxed mb-5">
                Your one-stop destination for the latest technology. Shop the best phones, laptops, TVs, and more at unbeatable prices.
              </p>

              
              <a href="tel:+18004562789" className="flex items-center gap-3 group mb-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 leading-none mb-0.5">Call Us 24/7</p>
                  <p className="text-sm font-bold text-gray-300 group-hover:text-orange-400 transition-colors leading-none">+1 800-456-2789</p>
                </div>
              </a>

              
              <Link href="/stores"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white mb-5 transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #e8517a, #f4874b)' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Find a Store Near You
              </Link>

              
              <div className="flex gap-3">
                {SOCIALS.map((s) => (
                  <a key={s.name} href="#" aria-label={s.name}
                    className="w-9 h-9 rounded-lg bg-dark-700 flex items-center justify-center hover:bg-orange-500 transition-colors">
                    <svg className="w-4 h-4 fill-current text-gray-400 hover:text-white" viewBox="0 0 24 24">
                      <path d={s.icon}/>
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-white font-semibold mb-4">{title}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm hover:text-orange-400 transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            
            <div className="col-span-2">
              <h4 className="text-white font-semibold mb-4">Send an Inquiry</h4>
              {submitted ? (
                <div className="bg-green-900/40 border border-green-600 rounded-xl p-4 text-center">
                  <svg className="w-8 h-8 text-green-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <p className="text-green-400 text-sm font-semibold">Message sent!</p>
                  <p className="text-green-500/70 text-xs mt-1">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleInquiry} className="space-y-2.5">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={inquiryName}
                    onChange={e => setInquiryName(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={inquiryEmail}
                    onChange={e => setInquiryEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                  <textarea
                    placeholder="Your message or inquiry..."
                    value={inquiryMsg}
                    onChange={e => setInquiryMsg(e.target.value)}
                    required
                    rows={3}
                    className="w-full px-3 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                  />
                  <button type="submit"
                    className="w-full py-2.5 rounded-lg text-sm font-bold text-white transition-opacity hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #e8517a, #f4874b)' }}>
                    Send Inquiry →
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

        
        <div className="border-t border-dark-700">
          <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs">© {new Date().getFullYear()} GlobalTech Inc. All rights reserved. · Developed by <span style={{ color: "#f4874b", fontWeight: 700 }}>Saikot Islam Abir</span> |{' '}
              <Link href="/privacy-policy" className="hover:text-orange-400 transition-colors">Privacy Policy</Link>{' '}·{' '}
              <Link href="/terms-of-service" className="hover:text-orange-400 transition-colors">Terms</Link>{' '}·{' '}
              <Link href="/cookie-policy" className="hover:text-orange-400 transition-colors">Cookies</Link>
            </p>
            <div className="flex items-center gap-3 text-xs">
              <span>We accept:</span>
              {['Visa', 'Mastercard', 'PayPal', 'Amex', 'Apple Pay'].map((p) => (
                <span key={p} className="px-2 py-1 bg-dark-700 rounded text-gray-300 font-medium">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

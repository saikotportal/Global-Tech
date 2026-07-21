'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PromoPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('promo_popup_seen');
    if (!seen) {
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const close = () => {
    localStorage.setItem('promo_popup_seen', '1');
    setVisible(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDone(true);
    localStorage.setItem('promo_popup_seen', '1');
    setTimeout(() => setVisible(false), 2500);
  };

  if (!visible) return null;

  return (
    <>
      
      <div
        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
        style={{ animation: 'fadeIn 0.3s ease' }}
        onClick={close}
      />

      
      <div
        className="fixed z-[201] inset-0 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl pointer-events-auto"
          style={{ animation: 'popIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275)' }}
          onClick={e => e.stopPropagation()}
        >
          <style>{`
            @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
            @keyframes popIn  { from { opacity:0; transform:scale(0.85) translateY(20px) } to { opacity:1; transform:scale(1) translateY(0) } }
          `}</style>

          
          <button onClick={close}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-white transition-all shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          
          <div className="relative h-36 flex items-center justify-center overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 60%, #1a1a2e 100%)' }}>
            
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full opacity-30"
              style={{ background: 'radial-gradient(circle, #e8517a, transparent)' }} />
            <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, #f5c518, transparent)' }} />
            <div className="relative z-10 text-center px-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-2"
                style={{ background: 'rgba(232,81,122,0.25)', border: '1px solid rgba(232,81,122,0.5)', color: '#f4874b' }}>
                🎉 Welcome Offer — First Time Visitor
              </div>
              <p className="text-white text-4xl font-extrabold leading-none" style={{ fontFamily: 'var(--font-syne)' }}>
                15% <span style={{ background: 'linear-gradient(135deg,#e8517a,#f5c518)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>OFF</span>
              </p>
              <p className="text-gray-300 text-sm mt-1">your first order, today only</p>
            </div>
          </div>

          
          <div className="px-8 py-6">
            {done ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <p className="text-xl font-extrabold text-gray-900 mb-1">You're in! 🎉</p>
                <p className="text-gray-500 text-sm">Check your inbox for your exclusive code.</p>
              </div>
            ) : (
              <>
                <p className="text-gray-700 text-sm text-center mb-1">
                  Subscribe and unlock your discount code instantly.
                </p>
                <p className="text-center text-xs text-gray-400 mb-5">Join 200,000+ tech lovers. No spam, unsubscribe anytime.</p>

                <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
                  <input
                    type="email"
                    placeholder="Enter your email..."
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="flex-1 px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none focus:border-orange-400 transition-colors"
                  />
                  <button type="submit"
                    className="px-5 py-3 rounded-xl text-white text-sm font-bold flex-shrink-0 transition-opacity hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
                    Get Code
                  </button>
                </form>

                
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {[
                    { icon: '🚚', text: 'Free Shipping over $99' },
                    { icon: '↩️', text: '30-Day Returns' },
                    { icon: '🔒', text: 'Secure Checkout' },
                  ].map(p => (
                    <div key={p.text} className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl p-2.5 text-center">
                      <span className="text-lg">{p.icon}</span>
                      <span className="text-[10px] text-gray-500 font-medium leading-tight">{p.text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <Link href="/deals" onClick={close}
                    className="flex-1 py-3 rounded-xl text-center text-sm font-bold text-white transition-opacity hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
                    Shop Deals Now →
                  </Link>
                  <button onClick={close}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2 whitespace-nowrap">
                    No thanks
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

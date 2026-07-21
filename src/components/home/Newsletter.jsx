'use client';
import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone]   = useState(false);

  function submit(e) {
    e.preventDefault();
    if (!email) return;
    setDone(true);
  }

  return (
    <section className="py-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#e8517a 0%,#f4874b 50%,#f5c518 100%)' }}>
      
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />
      <div className="container-custom relative text-center">
        <p className="text-white/80 font-semibold uppercase tracking-widest text-sm mb-3">Stay in the loop</p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
          Get exclusive deals &amp; new arrivals
        </h2>
        <p className="text-white/80 mb-8 max-w-md mx-auto">
          Join 200,000+ tech lovers. Unsubscribe anytime.
        </p>

        {done ? (
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-8 py-4 rounded-2xl font-semibold text-lg">
            ✅ You're subscribed — welcome aboard!
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-5 py-3.5 rounded-xl outline-none text-dark-800 font-medium placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="px-7 py-3.5 rounded-xl font-bold bg-dark-900 text-white hover:bg-dark-800 transition-colors whitespace-nowrap"
            >
              Subscribe →
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

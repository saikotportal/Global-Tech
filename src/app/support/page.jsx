'use client';
import { useState } from 'react';
import Link from 'next/link';

const FAQS = [
  {
    category: '🛒 Orders & Shipping',
    items: [
      { q: 'How long does shipping take?', a: 'Standard shipping takes 3–5 business days. Express (1–2 days) and Same-Day delivery (select cities) are available at checkout.' },
      { q: 'Do you ship internationally?', a: 'Yes! We ship to 120+ countries. International orders typically take 7–14 business days. Customs fees may apply.' },
      { q: 'Can I track my order?', a: 'Yes. Once your order ships you\'ll receive a tracking link via email. You can also check status in your account under Order History.' },
      { q: 'Can I change or cancel my order?', a: 'Orders can be modified or cancelled within 1 hour of placing them. After that the order enters processing — contact support immediately.' },
    ],
  },
  {
    category: '↩️ Returns & Refunds',
    items: [
      { q: 'What is your return policy?', a: 'We accept returns within 30 days of delivery for most items in original condition with all packaging.' },
      { q: 'How do I start a return?', a: 'Log into your account, go to Order History, and click "Return Item". You\'ll receive a prepaid return label within 24 hours.' },
      { q: 'When will I get my refund?', a: 'Refunds are processed within 3–5 business days after we receive the item. It may take up to 10 days to appear on your statement.' },
    ],
  },
  {
    category: '💳 Payments',
    items: [
      { q: 'What payment methods do you accept?', a: 'Visa, Mastercard, Amex, PayPal, Apple Pay, Google Pay, and Cash on Delivery (select regions).' },
      { q: 'Is my payment information secure?', a: 'Yes. All payments are encrypted with 256-bit SSL and processed through PCI-DSS certified providers. We never store your full card number.' },
      { q: 'Do you offer buy now, pay later?', a: 'Yes — Klarna and Afterpay are available at checkout, letting you split into 4 interest-free installments.' },
    ],
  },
  {
    category: '📦 Products & Warranty',
    items: [
      { q: 'Are your products genuine?', a: 'Every product on GlobalTech is 100% authentic, sourced directly from authorized distributors and manufacturers.' },
      { q: 'What warranty do products come with?', a: 'All products include the manufacturer\'s standard warranty. We also offer extended GlobalTech Protection plans at checkout.' },
      { q: 'What if my item arrives damaged?', a: 'Contact us within 48 hours with photos of the damage. We\'ll arrange a replacement or full refund — no return needed in most cases.' },
    ],
  },
];

const CONTACT_CHANNELS = [
  { icon: '💬', label: 'Live Chat',     value: 'Start a chat now',              sub: '24/7 instant support',          action: '#' },
  { icon: '📧', label: 'Email',         value: 'support@globaltech.com',         sub: 'Replies within 2 hours',        action: 'mailto:support@globaltech.com' },
  { icon: '📞', label: 'Phone',         value: '+1 (800) 456-2789',              sub: 'Mon–Fri, 9am–6pm EST',          action: 'tel:+18004562789' },
  { icon: '📋', label: 'Submit Ticket', value: 'Track your support request',     sub: 'Response within 24 hours',      action: '#ticket' },
];

const QUICK_LINKS = [
  { icon: '📦', label: 'Track My Order',   href: '/track' },
  { icon: '↩️', label: 'Start a Return',   href: '/returns' },
  { icon: '👤', label: 'My Account',       href: '/account' },
  { icon: '🔍', label: 'Browse Products',  href: '/products' },
];

function AccordionItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition"
      >
        <span className="font-medium text-gray-800 text-sm">{q}</span>
        <span className={`text-xl text-gray-400 transition-transform duration-200 flex-shrink-0 ml-3 ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function SupportPage() {
  const [form, setForm]   = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent]   = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  const filteredFAQs = FAQS.map(section => ({
    ...section,
    items: section.items.filter(
      item =>
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(section =>
    (!activeCategory || section.category === activeCategory) &&
    section.items.length > 0
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      
      <div className="text-white py-16 px-4 text-center" style={{ background: 'linear-gradient(135deg, #e8517a, #f4874b)' }}>
        <h1 className="text-4xl font-bold mb-3">Support Hub</h1>
        <p className="text-white/80 mb-8 text-lg">How can we help you today?</p>
        <div className="max-w-xl mx-auto relative">
          <input
            type="text"
            placeholder="Search for help (e.g. track order, return, refund…)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl text-gray-800 text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">

        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {QUICK_LINKS.map(({ icon, label, href }) => (
            <Link
              key={label}
              href={href}
              className="bg-white rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition group"
            >
              <div className="text-3xl mb-2">{icon}</div>
              <div className="text-sm font-semibold text-gray-700 group-hover:text-orange-500 transition">{label}</div>
            </Link>
          ))}
        </div>

        
        <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {CONTACT_CHANNELS.map(({ icon, label, value, sub, action }) => (
            <a
              key={label}
              href={action}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col gap-2 group"
            >
              <div className="text-3xl">{icon}</div>
              <div className="font-semibold text-gray-800 text-sm group-hover:text-orange-500 transition">{label}</div>
              <div className="text-gray-600 text-sm">{value}</div>
              <div className="text-gray-400 text-xs">{sub}</div>
            </a>
          ))}
        </div>

        
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          
          <div className="lg:w-56 flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-900 mb-4">FAQ</h2>
            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition text-left ${!activeCategory ? 'text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                style={!activeCategory ? { background: 'linear-gradient(135deg, #e8517a, #f4874b)' } : {}}
              >
                All Topics
              </button>
              {FAQS.map(({ category }) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition text-left ${activeCategory === category ? 'text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                  style={activeCategory === category ? { background: 'linear-gradient(135deg, #e8517a, #f4874b)' } : {}}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          
          <div className="flex-1">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="text-4xl mb-3">🤷</div>
                <p className="font-medium">No results for "{search}"</p>
                <p className="text-sm mt-1">Try different keywords or contact us below.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {filteredFAQs.map(({ category, items }) => (
                  <div key={category}>
                    <h3 className="font-bold text-gray-700 mb-3">{category}</h3>
                    <div className="space-y-3">
                      {items.map(({ q, a }) => (
                        <AccordionItem key={q} q={q} a={a} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        
        <div id="ticket" className="bg-white rounded-2xl shadow-sm p-8 max-w-2xl mx-auto">
          {sent ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Ticket Submitted!</h2>
              <p className="text-gray-500">We'll get back to you within 24 hours.</p>
              <button
                onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                className="mt-6 text-orange-500 hover:underline text-sm"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-bold text-gray-800 mb-6">Submit a Support Ticket</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'name',  label: 'Your Name',     type: 'text' },
                    { id: 'email', label: 'Email Address',  type: 'email' },
                  ].map(({ id, label, type }) => (
                    <div key={id}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <input
                        type={type}
                        required
                        value={form[id]}
                        onChange={e => setForm({ ...form, [id]: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
                  style={{ background: 'linear-gradient(135deg, #e8517a, #f4874b)' }}
                >
                  Submit Ticket
                </button>
              </form>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

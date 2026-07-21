'use client';
import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-14">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Contact Us</h1>
          <p className="text-gray-500">Have a question or need help? We're here for you 24/7.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          <div className="bg-white rounded-2xl shadow-sm p-8">
            {sent ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">✅</div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Message Sent!</h2>
                <p className="text-gray-500">We'll get back to you within 24 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="mt-6 text-blue-600 hover:underline text-sm">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Send a Message</h2>
                {[
                  { id: 'name',    label: 'Your Name',     type: 'text' },
                  { id: 'email',   label: 'Email Address', type: 'email' },
                  { id: 'subject', label: 'Subject',       type: 'text' },
                ].map(({ id, label, type }) => (
                  <div key={id}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input type={type} required value={form[id]} onChange={(e) => setForm({ ...form, [id]: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                  Send Message
                </button>
              </form>
            )}
          </div>

          
          <div className="space-y-6">
            {[
              { icon: '📧', label: 'Email',          value: 'support@globaltech.com',    sub: 'Typically replies within 2 hours' },
              { icon: '📞', label: 'Phone',           value: '+1 (800) 555-0199',         sub: 'Mon–Fri, 9am–6pm EST' },
              { icon: '💬', label: 'Live Chat',       value: 'Available on every page',   sub: '24/7 instant support' },
              { icon: '📍', label: 'Headquarters',    value: '580 Market St, San Francisco, CA', sub: 'Not open for walk-ins' },
            ].map(({ icon, label, value, sub }) => (
              <div key={label} className="bg-white rounded-2xl shadow-sm p-5 flex items-start gap-4">
                <div className="text-3xl">{icon}</div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">{label}</div>
                  <div className="text-gray-700 text-sm mt-0.5">{value}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{sub}</div>
                </div>
              </div>
            ))}

            
            <div className="bg-gray-200 rounded-2xl h-52 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">🗺️</div>
                <p className="text-sm">Map — 580 Market St, San Francisco</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

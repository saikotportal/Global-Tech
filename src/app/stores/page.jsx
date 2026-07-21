'use client';

import { useState } from 'react';
import Link from 'next/link';

const STORES = [
  {
    id: 1,
    country: 'Bangladesh',
    flag: '🇧🇩',
    city: 'Dhaka',
    region: 'Dhaka Division',
    name: 'GlobalTech Dhaka Flagship',
    address: 'Level 4, Bashundhara City Shopping Complex, Panthapath, Dhaka 1215',
    phone: '+880 2-9611234',
    email: 'dhaka@globaltech.com',
    hours: 'Sat–Thu 10am–9pm, Fri 3pm–9pm',
    services: ['In-store Demo', 'Repair Center', 'Trade-In', 'Business Sales'],
    mapUrl: 'https://maps.google.com/?q=Bashundhara+City+Dhaka',
    featured: true,
  },
  {
    id: 2,
    country: 'Bangladesh',
    flag: '🇧🇩',
    city: 'Chittagong',
    region: 'Chattogram Division',
    name: 'GlobalTech Chittagong',
    address: 'Shop 12, Centrepoint Shopping Mall, GEC Circle, Chittagong 4100',
    phone: '+880 31-654321',
    email: 'chittagong@globaltech.com',
    hours: 'Daily 10am–9pm',
    services: ['In-store Demo', 'Trade-In', 'Online Pickup'],
    mapUrl: 'https://maps.google.com/?q=GEC+Circle+Chittagong',
    featured: false,
  },
  {
    id: 3,
    country: 'Bangladesh',
    flag: '🇧🇩',
    city: 'Sylhet',
    region: 'Sylhet Division',
    name: 'GlobalTech Sylhet',
    address: 'Ground Floor, Rikabi Bazar Tower, Zindabazar, Sylhet 3100',
    phone: '+880 821-712345',
    email: 'sylhet@globaltech.com',
    hours: 'Sat–Thu 10am–8pm',
    services: ['In-store Demo', 'Online Pickup'],
    mapUrl: 'https://maps.google.com/?q=Zindabazar+Sylhet',
    featured: false,
  },
  {
    id: 4,
    country: 'Bangladesh',
    flag: '🇧🇩',
    city: 'Rajshahi',
    region: 'Rajshahi Division',
    name: 'GlobalTech Rajshahi',
    address: 'Shop 6, Rajshahi New Market, Shaheb Bazar, Rajshahi 6000',
    phone: '+880 721-812456',
    email: 'rajshahi@globaltech.com',
    hours: 'Sat–Thu 10am–8pm',
    services: ['In-store Demo', 'Repair Center'],
    mapUrl: 'https://maps.google.com/?q=Saheb+Bazar+Rajshahi',
    featured: false,
  },
  {
    id: 5,
    country: 'Bangladesh',
    flag: '🇧🇩',
    city: 'Khulna',
    region: 'Khulna Division',
    name: 'GlobalTech Khulna',
    address: 'Floor 2, Khan A Sabur Road Plaza, KDA Avenue, Khulna 9100',
    phone: '+880 41-723456',
    email: 'khulna@globaltech.com',
    hours: 'Sat–Thu 10am–8pm',
    services: ['In-store Demo', 'Trade-In'],
    mapUrl: 'https://maps.google.com/?q=KDA+Avenue+Khulna',
    featured: false,
  },
  {
    id: 6,
    country: 'Bangladesh',
    flag: '🇧🇩',
    city: 'Cumilla',
    region: 'Chattogram Division',
    name: 'GlobalTech Cumilla',
    address: 'Shop 3, Kandirpar Tower, Cumilla 3500',
    phone: '+880 81-612345',
    email: 'cumilla@globaltech.com',
    hours: 'Sat–Thu 10am–8pm',
    services: ['In-store Demo', 'Online Pickup'],
    mapUrl: 'https://maps.google.com/?q=Kandirpar+Cumilla',
    featured: false,
  },
  {
    id: 7,
    country: 'United States',
    flag: '🇺🇸',
    city: 'New York',
    region: 'New York',
    name: 'GlobalTech New York',
    address: '520 Fifth Avenue, Midtown Manhattan, New York, NY 10036',
    phone: '+1 212-555-0190',
    email: 'newyork@globaltech.com',
    hours: 'Mon–Sat 9am–9pm, Sun 11am–7pm',
    services: ['In-store Demo', 'Repair Center', 'Trade-In', 'Business Sales', 'Online Pickup'],
    mapUrl: 'https://maps.google.com/?q=520+Fifth+Avenue+New+York',
    featured: true,
  },
  {
    id: 8,
    country: 'United Kingdom',
    flag: '🇬🇧',
    city: 'London',
    region: 'England',
    name: 'GlobalTech London',
    address: '14 Oxford Street, London W1D 1AU',
    phone: '+44 20-7946-0321',
    email: 'london@globaltech.com',
    hours: 'Mon–Sat 9am–8pm, Sun 12pm–6pm',
    services: ['In-store Demo', 'Repair Center', 'Trade-In', 'Online Pickup'],
    mapUrl: 'https://maps.google.com/?q=Oxford+Street+London',
    featured: true,
  },
  {
    id: 9,
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    city: 'Dubai',
    region: 'Dubai Emirate',
    name: 'GlobalTech Dubai Mall',
    address: 'Level 2, The Dubai Mall, Financial Centre Road, Dubai',
    phone: '+971 4-555-7890',
    email: 'dubai@globaltech.com',
    hours: 'Sun–Wed 10am–12am, Thu–Sat 10am–1am',
    services: ['In-store Demo', 'Trade-In', 'Business Sales', 'Online Pickup'],
    mapUrl: 'https://maps.google.com/?q=Dubai+Mall+UAE',
    featured: true,
  },
  {
    id: 10,
    country: 'Canada',
    flag: '🇨🇦',
    city: 'Toronto',
    region: 'Ontario',
    name: 'GlobalTech Toronto',
    address: '220 Yonge Street, Toronto, ON M5B 2H1',
    phone: '+1 416-555-0234',
    email: 'toronto@globaltech.com',
    hours: 'Mon–Sat 10am–9pm, Sun 11am–7pm',
    services: ['In-store Demo', 'Repair Center', 'Trade-In'],
    mapUrl: 'https://maps.google.com/?q=220+Yonge+Street+Toronto',
    featured: false,
  },
  {
    id: 11,
    country: 'Australia',
    flag: '🇦🇺',
    city: 'Sydney',
    region: 'New South Wales',
    name: 'GlobalTech Sydney',
    address: 'Shop G14, Westfield Sydney, 188 Pitt Street, Sydney NSW 2000',
    phone: '+61 2-9255-0123',
    email: 'sydney@globaltech.com',
    hours: 'Mon–Wed 9:30am–7pm, Thu–Fri 9:30am–9pm, Sat 9am–7pm, Sun 10am–6pm',
    services: ['In-store Demo', 'Repair Center', 'Online Pickup'],
    mapUrl: 'https://maps.google.com/?q=Westfield+Sydney+Pitt+Street',
    featured: false,
  },
  {
    id: 12,
    country: 'Singapore',
    flag: '🇸🇬',
    city: 'Singapore',
    region: 'Central Region',
    name: 'GlobalTech Orchard',
    address: '#03-14 ION Orchard, 2 Orchard Turn, Singapore 238801',
    phone: '+65 6555-0178',
    email: 'singapore@globaltech.com',
    hours: 'Daily 10am–10pm',
    services: ['In-store Demo', 'Trade-In', 'Business Sales', 'Online Pickup'],
    mapUrl: 'https://maps.google.com/?q=ION+Orchard+Singapore',
    featured: false,
  },
];

const SERVICE_ICONS = {
  'In-store Demo':  { icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'bg-blue-100 text-blue-600' },
  'Repair Center':  { icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', color: 'bg-orange-100 text-orange-600' },
  'Trade-In':       { icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', color: 'bg-green-100 text-green-600' },
  'Business Sales': { icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'bg-purple-100 text-purple-600' },
  'Online Pickup':  { icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4', color: 'bg-yellow-100 text-yellow-700' },
};

const ALL_COUNTRIES = ['All', ...Array.from(new Set(STORES.map(s => s.country)))];

export default function StoresPage() {
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = STORES.filter(s => {
    const matchCountry = selectedCountry === 'All' || s.country === selectedCountry;
    const q = search.toLowerCase();
    const matchSearch = !q || s.city.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.country.toLowerCase().includes(q) || s.address.toLowerCase().includes(q);
    return matchCountry && matchSearch;
  });

  const bdStores = filtered.filter(s => s.country === 'Bangladesh');
  const intlStores = filtered.filter(s => s.country !== 'Bangladesh');

  return (
    <main className="min-h-screen bg-gray-50">

      
      <section className="relative overflow-hidden py-20 text-white"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 50%, #1a1a2e 100%)' }}>
        
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #e8517a, transparent)' }} />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #f4874b, transparent)' }} />
        </div>
        <div className="container-custom relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'rgba(232,81,122,0.2)', border: '1px solid rgba(232,81,122,0.4)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            {STORES.length} Locations Worldwide
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ fontFamily: 'var(--font-syne)' }}>
            Find a <span style={{ background: 'linear-gradient(135deg,#e8517a,#f5c518)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>GlobalTech</span> Store
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Visit us in person for hands-on demos, expert advice, repairs, and more. Our stores are ready to help you find your next tech.
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex bg-white rounded-2xl overflow-hidden shadow-2xl">
              <input
                type="text"
                placeholder="Search city or store name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 px-5 py-4 text-gray-800 text-sm outline-none"
              />
              <button className="px-6 py-4 text-white font-semibold text-sm"
                style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      
      <section className="bg-white border-b border-gray-100">
        <div className="container-custom py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '12+', label: 'Store Locations', icon: '🏪' },
              { value: '8',   label: 'Countries',       icon: '🌍' },
              { value: '24/7', label: 'Online Support', icon: '💬' },
              { value: '50k+', label: 'Happy Customers', icon: '⭐' },
            ].map(stat => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-2xl font-extrabold text-gray-900">{stat.value}</span>
                <span className="text-xs text-gray-500 font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="container-custom pt-10 pb-2">
        <div className="flex flex-wrap gap-2">
          {ALL_COUNTRIES.map(country => (
            <button key={country}
              onClick={() => setSelectedCountry(country)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedCountry === country
                  ? 'text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-400 hover:text-orange-500'
              }`}
              style={selectedCountry === country ? { background: 'linear-gradient(135deg,#e8517a,#f4874b)' } : {}}>
              {country === 'All' ? '🌐 All Countries' : country}
            </button>
          ))}
        </div>
      </section>

      
      {bdStores.length > 0 && (
        <section className="container-custom py-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🇧🇩</span>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Bangladesh</h2>
              <p className="text-sm text-gray-500">{bdStores.length} store{bdStores.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {bdStores.map(store => <StoreCard key={store.id} store={store} />)}
          </div>
        </section>
      )}

      
      {intlStores.length > 0 && (
        <section className="container-custom py-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🌍</span>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">International</h2>
              <p className="text-sm text-gray-500">{intlStores.length} store{intlStores.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {intlStores.map(store => <StoreCard key={store.id} store={store} />)}
          </div>
        </section>
      )}

      {filtered.length === 0 && (
        <div className="container-custom py-20 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No stores found</h3>
          <p className="text-gray-400">Try a different city or country name.</p>
          <button onClick={() => { setSearch(''); setSelectedCountry('All'); }}
            className="mt-4 px-5 py-2.5 rounded-full text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
            Clear filters
          </button>
        </div>
      )}

      
      <section className="container-custom py-12">
        <div className="rounded-3xl p-10 text-center text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1a1a2e, #2d1b4e)' }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #e8517a, transparent)' }} />
          </div>
          <h3 className="text-2xl font-extrabold mb-2 relative z-10">Can't find a store near you?</h3>
          <p className="text-gray-400 mb-6 relative z-10">Shop online with free delivery, or reach our team for personalized support.</p>
          <div className="flex flex-wrap justify-center gap-3 relative z-10">
            <Link href="/products" className="px-6 py-3 rounded-full font-semibold text-white text-sm"
              style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
              Shop Online
            </Link>
            <Link href="/contact" className="px-6 py-3 rounded-full font-semibold text-sm border border-white/20 text-white hover:bg-white/10 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}

function StoreCard({ store }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
      store.featured ? 'border-orange-200 shadow-lg' : 'border-gray-100 shadow-sm hover:shadow-md'
    }`}>
      
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{store.flag}</span>
            <div>
              <h3 className="font-bold text-gray-900 text-base leading-tight">{store.name}</h3>
              <p className="text-xs text-gray-400">{store.city}, {store.country}</p>
            </div>
          </div>
          {store.featured && (
            <span className="flex-shrink-0 text-xs font-bold px-2 py-1 rounded-full text-white"
              style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
              ★ Featured
            </span>
          )}
        </div>

        
        <div className="flex items-start gap-2 mb-2">
          <svg className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <p className="text-xs text-gray-600 leading-relaxed">{store.address}</p>
        </div>

        
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p className="text-xs text-gray-600">{store.hours}</p>
        </div>

        
        <div className="flex flex-wrap gap-1.5 mb-4">
          {store.services.map(svc => {
            const style = SERVICE_ICONS[svc];
            return (
              <span key={svc} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${style?.color || 'bg-gray-100 text-gray-600'}`}>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={style?.icon || 'M5 13l4 4L19 7'}/>
                </svg>
                {svc}
              </span>
            );
          })}
        </div>

        
        <button onClick={() => setExpanded(!expanded)}
          className="text-xs text-orange-500 font-semibold hover:text-orange-600 transition-colors flex items-center gap-1">
          {expanded ? 'Show less' : 'Show contact details'}
          <svg className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        
        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
            <a href={`tel:${store.phone}`} className="flex items-center gap-2 text-xs text-gray-600 hover:text-orange-500 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              {store.phone}
            </a>
            <a href={`mailto:${store.email}`} className="flex items-center gap-2 text-xs text-gray-600 hover:text-orange-500 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              {store.email}
            </a>
          </div>
        )}
      </div>

      
      <div className="px-5 pb-5 flex gap-2">
        <a href={store.mapUrl} target="_blank" rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-gray-200 text-xs font-semibold text-gray-600 hover:border-orange-400 hover:text-orange-500 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
          </svg>
          Get Directions
        </a>
        <Link href="/contact"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
          Inquire
        </Link>
      </div>
    </div>
  );
}

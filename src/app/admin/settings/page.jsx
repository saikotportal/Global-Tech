'use client';
import { useState } from 'react';

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
];

const TIMEZONES = [
  'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Dubai',
  'Asia/Singapore', 'Asia/Tokyo', 'Australia/Sydney',
];

const DEFAULT_SETTINGS = {
  storeName:      'GlobalTech',
  storeEmail:     'hello@globaltech.store',
  storePhone:     '+1 (800) 555-0100',
  storeAddress:   '123 Innovation Drive, San Francisco, CA 94102',
  storeTagline:   'Premium Tech. Global Reach.',
  storeTimezone:  'America/New_York',
  storeLogo:      '',
  storeFavicon:   '',

  currency:       'USD',
  currencyPos:    'before',
  thousandsSep:   true,
  decimalPlaces:  2,

  announcementEnabled: true,
  announcementText:    '🚀 Free shipping on orders over $99 · Use code WELCOME20 for 20% off your first order',
  announcementColor:   '#e8517a',
  announcementTextColor: '#ffffff',
  announcementCloseable: true,

  freeShippingThreshold: 99,
  standardShippingCost:  9.99,
  expressShippingCost:   19.99,
  freeShippingEnabled:   true,
  expressShippingEnabled:true,
  shippingEstimateStd:   '3–5 business days',
  shippingEstimateExp:   '1–2 business days',

  taxEnabled:     true,
  taxRate:        8.875,
  taxIncluded:    false,

  metaTitle:      'GlobalTech — Premium Electronics Store',
  metaDescription:'Shop the latest tech products from top brands. Free shipping over $99.',

  socialInstagram: 'globaltech',
  socialTwitter:   'globaltechstore',
  socialFacebook:  'globaltechstore',
  socialYouTube:   'globaltech',
};

function Section({ title, description, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900">{title}</h2>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-start">
      <div className="sm:pt-2">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
      </div>
      <div className="sm:col-span-2">{children}</div>
    </div>
  );
}

function Input({ value, onChange, type = 'text', placeholder, prefix, suffix }) {
  return (
    <div className="relative flex items-center">
      {prefix && <span className="absolute left-3 text-sm text-gray-400 select-none">{prefix}</span>}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-12' : ''}`}
      />
      {suffix && <span className="absolute right-3 text-sm text-gray-400 select-none">{suffix}</span>}
    </div>
  );
}

function Toggle({ value, onChange, label }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-green-500' : 'bg-gray-300'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-5' : ''}`} />
      </button>
      {label && <span className="text-sm text-gray-600">{label}</span>}
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('store');

  const set = (key, val) => setSettings(s => ({ ...s, [key]: val }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const selectedCurrency = CURRENCIES.find(c => c.code === settings.currency);

  const TABS = [
    { id: 'store',       label: '🏪 Store',        },
    { id: 'currency',    label: '💱 Currency',      },
    { id: 'announcement',label: '📢 Announcement',  },
    { id: 'shipping',    label: '🚚 Shipping',       },
    { id: 'seo',         label: '🔍 SEO & Social',  },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">Configure your store preferences.</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 ${saved ? 'bg-green-500' : ''}`}
          style={!saved ? { background: 'linear-gradient(135deg,#e8517a,#f4874b)' } : {}}
        >
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === t.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      
      {activeTab === 'store' && (
        <>
          <Section title="Store Information" description="Basic details about your store">
            <Field label="Store Name" hint="Shown in the header and emails">
              <Input value={settings.storeName} onChange={v => set('storeName', v)} placeholder="GlobalTech" />
            </Field>
            <Field label="Tagline" hint="Short slogan shown in the footer">
              <Input value={settings.storeTagline} onChange={v => set('storeTagline', v)} placeholder="Premium Tech. Global Reach." />
            </Field>
            <Field label="Contact Email">
              <Input value={settings.storeEmail} onChange={v => set('storeEmail', v)} type="email" placeholder="hello@yourstore.com" />
            </Field>
            <Field label="Phone">
              <Input value={settings.storePhone} onChange={v => set('storePhone', v)} placeholder="+1 (800) 555-0100" />
            </Field>
            <Field label="Address" hint="Used on invoices and legal pages">
              <textarea
                value={settings.storeAddress}
                onChange={e => set('storeAddress', e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none"
                placeholder="123 Main St, City, State ZIP"
              />
            </Field>
            <Field label="Timezone">
              <select
                value={settings.storeTimezone}
                onChange={e => set('storeTimezone', e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
              >
                {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>)}
              </select>
            </Field>
          </Section>

          <Section title="Tax Settings" description="Configure sales tax calculation">
            <Field label="Enable Tax">
              <Toggle value={settings.taxEnabled} onChange={v => set('taxEnabled', v)} label="Collect sales tax at checkout" />
            </Field>
            {settings.taxEnabled && (
              <>
                <Field label="Tax Rate (%)" hint="Applied to all taxable items">
                  <Input value={settings.taxRate} onChange={v => set('taxRate', v)} type="number" suffix="%" placeholder="8.875" />
                </Field>
                <Field label="Tax Inclusive">
                  <Toggle value={settings.taxIncluded} onChange={v => set('taxIncluded', v)} label="Prices already include tax" />
                </Field>
              </>
            )}
          </Section>
        </>
      )}

      
      {activeTab === 'currency' && (
        <Section title="Currency Configuration" description="Set the default currency for your store">
          <Field label="Currency" hint="The primary currency for all prices">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CURRENCIES.map(c => (
                <button
                  key={c.code}
                  onClick={() => set('currency', c.code)}
                  className={`px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all text-left ${
                    settings.currency === c.code
                      ? 'border-orange-300 text-white shadow-sm'
                      : 'border-gray-200 text-gray-700 hover:border-orange-200 bg-white'
                  }`}
                  style={settings.currency === c.code ? { background: 'linear-gradient(135deg,#e8517a,#f4874b)' } : {}}
                >
                  <span className="text-base">{c.symbol}</span>
                  <span className="block text-xs mt-0.5 opacity-80">{c.code}</span>
                </button>
              ))}
            </div>
          </Field>

          <Field label="Symbol Position">
            <div className="flex gap-3">
              {[{ val:'before', label:'Before price ($99)' }, { val:'after', label:'After price (99$)' }].map(o => (
                <label key={o.val} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="currencyPos"
                    value={o.val}
                    checked={settings.currencyPos === o.val}
                    onChange={() => set('currencyPos', o.val)}
                    className="accent-orange-500"
                  />
                  <span className="text-sm text-gray-700">{o.label}</span>
                </label>
              ))}
            </div>
          </Field>

          <Field label="Thousands Separator">
            <Toggle value={settings.thousandsSep} onChange={v => set('thousandsSep', v)} label="Show comma separator (e.g. 1,299)" />
          </Field>

          <Field label="Decimal Places">
            <div className="flex gap-3">
              {[0, 1, 2].map(n => (
                <label key={n} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="decimal"
                    value={n}
                    checked={settings.decimalPlaces === n}
                    onChange={() => set('decimalPlaces', n)}
                    className="accent-orange-500"
                  />
                  <span className="text-sm text-gray-700">{n === 0 ? '0 (whole numbers)' : n === 1 ? '1 (9.9)' : '2 (9.99)'}</span>
                </label>
              ))}
            </div>
          </Field>

          
          <div className="bg-gray-50 rounded-xl p-4 mt-2">
            <p className="text-xs text-gray-500 mb-1">Preview</p>
            <p className="text-2xl font-bold text-gray-900">
              {settings.currencyPos === 'before' ? selectedCurrency?.symbol : ''}
              {settings.thousandsSep ? '1,299' : '1299'}
              {settings.decimalPlaces > 0 ? '.' + '0'.repeat(settings.decimalPlaces) : ''}
              {settings.currencyPos === 'after' ? selectedCurrency?.symbol : ''}
            </p>
            <p className="text-xs text-gray-400 mt-1">{selectedCurrency?.name}</p>
          </div>
        </Section>
      )}

      
      {activeTab === 'announcement' && (
        <Section title="Announcement Bar" description="A banner shown at the top of every page">
          <Field label="Enable Bar">
            <Toggle value={settings.announcementEnabled} onChange={v => set('announcementEnabled', v)} label="Show announcement bar to visitors" />
          </Field>

          {settings.announcementEnabled && (
            <>
              <Field label="Message" hint="Supports emoji · Use · to add separators">
                <textarea
                  value={settings.announcementText}
                  onChange={e => set('announcementText', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none"
                  placeholder="🚀 Free shipping on orders over $99"
                />
                <p className="text-xs text-gray-400 mt-1">{settings.announcementText.length} / 200 characters</p>
              </Field>

              <Field label="Background Color">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.announcementColor}
                    onChange={e => set('announcementColor', e.target.value)}
                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                  />
                  <Input value={settings.announcementColor} onChange={v => set('announcementColor', v)} placeholder="#e8517a" />
                </div>
              </Field>

              <Field label="Text Color">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.announcementTextColor}
                    onChange={e => set('announcementTextColor', e.target.value)}
                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                  />
                  <Input value={settings.announcementTextColor} onChange={v => set('announcementTextColor', v)} placeholder="#ffffff" />
                </div>
              </Field>

              <Field label="Dismissable">
                <Toggle value={settings.announcementCloseable} onChange={v => set('announcementCloseable', v)} label="Show a close button" />
              </Field>

              
              <Field label="Preview">
                <div
                  className="rounded-xl px-4 py-3 text-sm font-medium text-center relative"
                  style={{ background: settings.announcementColor, color: settings.announcementTextColor }}
                >
                  {settings.announcementText || 'Your announcement will appear here'}
                  {settings.announcementCloseable && (
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100">✕</button>
                  )}
                </div>
              </Field>
            </>
          )}
        </Section>
      )}

      
      {activeTab === 'shipping' && (
        <>
          <Section title="Free Shipping" description="Set the threshold for free shipping">
            <Field label="Enable Free Shipping">
              <Toggle value={settings.freeShippingEnabled} onChange={v => set('freeShippingEnabled', v)} label="Offer free shipping on qualifying orders" />
            </Field>
            {settings.freeShippingEnabled && (
              <>
                <Field label="Minimum Order Amount" hint="Orders above this amount qualify">
                  <Input value={settings.freeShippingThreshold} onChange={v => set('freeShippingThreshold', v)} type="number" prefix="$" placeholder="99" />
                </Field>
              </>
            )}
          </Section>

          <Section title="Shipping Rates" description="Configure standard and express shipping options">
            <Field label="Standard Shipping">
              <div className="space-y-2">
                <Input value={settings.standardShippingCost} onChange={v => set('standardShippingCost', v)} type="number" prefix="$" placeholder="9.99" />
                <Input value={settings.shippingEstimateStd} onChange={v => set('shippingEstimateStd', v)} placeholder="3–5 business days" />
              </div>
            </Field>

            <Field label="Express Shipping">
              <Toggle value={settings.expressShippingEnabled} onChange={v => set('expressShippingEnabled', v)} label="Offer express shipping" />
              {settings.expressShippingEnabled && (
                <div className="space-y-2 mt-3">
                  <Input value={settings.expressShippingCost} onChange={v => set('expressShippingCost', v)} type="number" prefix="$" placeholder="19.99" />
                  <Input value={settings.shippingEstimateExp} onChange={v => set('shippingEstimateExp', v)} placeholder="1–2 business days" />
                </div>
              )}
            </Field>
          </Section>

          
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">Shipping Summary</h3>
            <div className="space-y-2.5">
              {[
                { label: 'Free Shipping Threshold', value: settings.freeShippingEnabled ? `$${settings.freeShippingThreshold}+` : 'Disabled' },
                { label: 'Standard Rate', value: `$${settings.standardShippingCost}` },
                { label: 'Standard ETA', value: settings.shippingEstimateStd },
                { label: 'Express Rate', value: settings.expressShippingEnabled ? `$${settings.expressShippingCost}` : 'Disabled' },
                { label: 'Express ETA', value: settings.expressShippingEnabled ? settings.shippingEstimateExp : '—' },
              ].map(r => (
                <div key={r.label} className="flex justify-between">
                  <span className="text-sm text-gray-500">{r.label}</span>
                  <span className="text-sm font-semibold text-gray-900">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      
      {activeTab === 'seo' && (
        <>
          <Section title="SEO" description="Optimize your store for search engines">
            <Field label="Meta Title" hint="60 characters recommended">
              <Input value={settings.metaTitle} onChange={v => set('metaTitle', v)} placeholder="GlobalTech — Premium Electronics Store" />
              <p className="text-xs text-gray-400 mt-1">{settings.metaTitle.length} / 60 characters</p>
            </Field>
            <Field label="Meta Description" hint="160 characters recommended">
              <textarea
                value={settings.metaDescription}
                onChange={e => set('metaDescription', e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none"
                placeholder="Shop the latest tech products…"
              />
              <p className="text-xs text-gray-400 mt-1">{settings.metaDescription.length} / 160 characters</p>
            </Field>

            
            <Field label="Search Preview">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-blue-600 text-sm font-medium truncate">{settings.metaTitle || 'Page Title'}</p>
                <p className="text-green-700 text-xs mt-0.5">https://globaltech.store</p>
                <p className="text-gray-600 text-xs mt-1 line-clamp-2">{settings.metaDescription || 'Page description will appear here…'}</p>
              </div>
            </Field>
          </Section>

          <Section title="Social Media" description="Connect your social profiles">
            {[
              { key: 'socialInstagram', label: 'Instagram', prefix: '@', placeholder: 'globaltech' },
              { key: 'socialTwitter',   label: 'X / Twitter', prefix: '@', placeholder: 'globaltechstore' },
              { key: 'socialFacebook',  label: 'Facebook', prefix: 'fb.com/', placeholder: 'globaltechstore' },
              { key: 'socialYouTube',   label: 'YouTube', prefix: '@', placeholder: 'globaltech' },
            ].map(s => (
              <Field key={s.key} label={s.label}>
                <Input value={settings[s.key]} onChange={v => set(s.key, v)} prefix={s.prefix} placeholder={s.placeholder} />
              </Field>
            ))}
          </Section>
        </>
      )}

      
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          className={`px-8 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 ${saved ? 'bg-green-500' : ''}`}
          style={!saved ? { background: 'linear-gradient(135deg,#e8517a,#f4874b)' } : {}}
        >
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

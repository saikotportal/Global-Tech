'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/context/AuthContext';
import { useToastContext } from '@/context/ToastContext';

const TIERS = [
  {
    id: 'bronze',
    label: 'Bronze',
    icon: '🥉',
    min: 0,
    max: 999,
    color: '#cd7f32',
    bg: 'from-orange-950 via-amber-900 to-yellow-950',
    perks: ['1x points on all purchases', 'Birthday bonus points', 'Early sale access'],
  },
  {
    id: 'silver',
    label: 'Silver',
    icon: '🥈',
    min: 1000,
    max: 4999,
    color: '#9ca3af',
    bg: 'from-slate-800 via-gray-700 to-zinc-800',
    perks: ['1.5x points on all purchases', 'Free standard shipping', 'Priority support', 'Exclusive member deals'],
  },
  {
    id: 'gold',
    label: 'Gold',
    icon: '🥇',
    min: 5000,
    max: 14999,
    color: '#f59e0b',
    bg: 'from-yellow-900 via-amber-800 to-orange-900',
    perks: ['2x points on all purchases', 'Free express shipping', 'Dedicated account manager', 'Early product launches', 'Exclusive Gold events'],
  },
  {
    id: 'platinum',
    label: 'Platinum',
    icon: '💎',
    min: 15000,
    max: Infinity,
    color: '#818cf8',
    bg: 'from-violet-950 via-purple-900 to-indigo-950',
    perks: ['3x points on all purchases', 'Free overnight shipping', 'VIP concierge service', 'Private sales access', 'Annual gift', 'Lounge access at select stores'],
  },
];

const REWARDS = [
  { id: 1, label: '$5 off your next order',    points: 500,   icon: '🏷️', category: 'discount' },
  { id: 2, label: '$15 off your next order',   points: 1200,  icon: '🏷️', category: 'discount' },
  { id: 3, label: '$30 off your next order',   points: 2500,  icon: '🏷️', category: 'discount' },
  { id: 4, label: 'Free standard shipping',    points: 300,   icon: '🚚', category: 'shipping' },
  { id: 5, label: 'Free express shipping',     points: 600,   icon: '⚡', category: 'shipping' },
  { id: 6, label: 'Extended 2-year warranty',  points: 3000,  icon: '🛡️', category: 'service'  },
  { id: 7, label: 'Free tech setup service',   points: 2000,  icon: '🔧', category: 'service'  },
  { id: 8, label: 'Early access to new drops', points: 800,   icon: '🚀', category: 'access'   },
  { id: 9, label: '$100 off on orders $500+',  points: 7500,  icon: '💰', category: 'discount' },
];

const MOCK_HISTORY = [
  { id: 1, type: 'earn',   label: 'Purchase — iPhone 16 Pro Max',    points: +1199, date: 'May 20, 2026' },
  { id: 2, type: 'earn',   label: 'Purchase — Sony WH-1000XM6',      points: +349,  date: 'May 10, 2026' },
  { id: 3, type: 'redeem', label: 'Redeemed — $15 off order',        points: -1200, date: 'Apr 30, 2026' },
  { id: 4, type: 'earn',   label: 'Purchase — Dell XPS 15 OLED',     points: +1899, date: 'Apr 28, 2026' },
  { id: 5, type: 'earn',   label: 'Referral bonus — Alex M. joined', points: +500,  date: 'Apr 15, 2026' },
  { id: 6, type: 'earn',   label: 'Birthday bonus',                  points: +200,  date: 'Mar 12, 2026' },
  { id: 7, type: 'redeem', label: 'Redeemed — Free shipping',        points: -300,  date: 'Mar 01, 2026' },
  { id: 8, type: 'earn',   label: 'Purchase — LG C4 OLED TV',        points: +1799, date: 'Feb 14, 2026' },
];

const MOCK_POINTS = 4247;

function getTier(points) {
  return TIERS.slice().reverse().find(t => points >= t.min) || TIERS[0];
}

function ProgressBar({ value, max, color }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

export default function LoyaltyPage() {
  const { user } = useAuthContext();
  const { toast } = useToastContext?.() || { toast: { success: () => {}, error: () => {} } };

  const points = MOCK_POINTS;
  const currentTier = getTier(points);
  const nextTier = TIERS[TIERS.indexOf(currentTier) + 1] || null;
  const pointsToNext = nextTier ? nextTier.min - points : 0;

  const [activeTab, setActiveTab] = useState('overview');
  const [rewardFilter, setRewardFilter] = useState('all');
  const [redeemedIds, setRedeemedIds] = useState([]);
  const [referralCopied, setReferralCopied] = useState(false);

  const referralCode = useMemo(() => {
    const base = user?.name?.replace(/\s/g, '').toUpperCase() || 'GLOBALTECH';
    return `${base.slice(0, 6)}2026`;
  }, [user?.name]);

  const filteredRewards = rewardFilter === 'all'
    ? REWARDS
    : REWARDS.filter(r => r.category === rewardFilter);

  function handleRedeem(reward) {
    if (points < reward.points) {
      toast?.error?.(`You need ${(reward.points - points).toLocaleString()} more points`);
      return;
    }
    setRedeemedIds(ids => [...ids, reward.id]);
    toast?.success?.(`🎉 "${reward.label}" redeemed! Check your email for the code.`);
  }

  function handleCopyReferral() {
    navigator.clipboard.writeText(referralCode).catch(() => {});
    setReferralCopied(true);
    setTimeout(() => setReferralCopied(false), 2500);
    toast?.success?.('Referral code copied!');
  }

  const TABS = [
    { key: 'overview',  label: 'Overview'  },
    { key: 'rewards',   label: 'Redeem'    },
    { key: 'history',   label: 'History'   },
    { key: 'referral',  label: 'Refer & Earn' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      
      <section className={`relative bg-gradient-to-br ${currentTier.bg} overflow-hidden`}>
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10 pointer-events-none"
          style={{ background: currentTier.color, filter: 'blur(80px)' }} />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-10 pointer-events-none"
          style={{ background: currentTier.color, filter: 'blur(60px)' }} />
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative container-custom py-14 md:py-18">
          <nav className="flex items-center gap-2 text-xs mb-8 opacity-50">
            <Link href="/" className="text-white hover:opacity-100 transition-opacity">Home</Link>
            <span className="text-white/40">›</span>
            <Link href="/account" className="text-white hover:opacity-100 transition-opacity">Account</Link>
            <span className="text-white/40">›</span>
            <span className="text-white">Rewards</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{currentTier.icon}</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-60 text-white">GlobalTech Rewards</p>
                  <h1 className="text-3xl md:text-4xl font-display font-black text-white leading-tight">
                    {user ? `${user.name.split(' ')[0]}'s` : 'Your'} <span style={{ color: currentTier.color }}>{currentTier.label}</span> Status
                  </h1>
                </div>
              </div>
              <p className="text-white/60 text-sm max-w-md">
                Earn points on every purchase, redeem for discounts and perks, and unlock higher tiers for exclusive benefits.
              </p>
            </div>

            
            <div className="rounded-2xl p-6 min-w-[220px]"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-1">Available Points</p>
              <p className="text-5xl font-black text-white leading-none">{points.toLocaleString()}</p>
              <p className="text-xs mt-1" style={{ color: currentTier.color }}>
                ≈ ${(points * 0.01).toFixed(0)} in rewards value
              </p>

              {nextTier && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-white/50 mb-1.5">
                    <span>{currentTier.label}</span>
                    <span>{nextTier.label} in {pointsToNext.toLocaleString()} pts</span>
                  </div>
                  <ProgressBar value={points - currentTier.min} max={currentTier.max - currentTier.min} color={currentTier.color} />
                </div>
              )}
              {!nextTier && (
                <p className="text-xs mt-3 font-bold" style={{ color: currentTier.color }}>
                  ✦ Maximum tier achieved
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="container-custom">
          <div className="flex gap-1 overflow-x-auto py-1">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex-shrink-0 px-5 py-3 text-sm font-semibold rounded-xl transition-all ${
                  activeTab === t.key ? 'text-white' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
                style={activeTab === t.key ? { background: 'linear-gradient(135deg,#e8517a,#f4874b)' } : {}}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-custom py-10">

        
        {activeTab === 'overview' && (
          <div className="space-y-8">

            
            <div>
              <h2 className="font-bold text-lg text-gray-900 mb-5">How to Earn Points</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: '🛒', title: 'Shop', desc: 'Earn 1 point per $1 spent (up to 3x with Platinum tier)', pts: '+1–3 pts/$1' },
                  { icon: '👥', title: 'Refer Friends', desc: 'Get 500 points when a friend makes their first purchase', pts: '+500 pts' },
                  { icon: '⭐', title: 'Write Reviews', desc: 'Earn 50 points for every verified product review you submit', pts: '+50 pts' },
                  { icon: '🎂', title: 'Birthday Bonus', desc: 'We drop 200 bonus points into your account every birthday', pts: '+200 pts' },
                ].map(item => (
                  <div key={item.title} className="bg-white rounded-2xl shadow-card p-5 flex flex-col gap-3">
                    <span className="text-3xl">{item.icon}</span>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full self-start"
                      style={{ background: 'linear-gradient(135deg,#e8517a22,#f4874b22)', color: '#e8517a' }}>
                      {item.pts}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            
            <div>
              <h2 className="font-bold text-lg text-gray-900 mb-5">Membership Tiers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {TIERS.map(tier => {
                  const isCurrent = tier.id === currentTier.id;
                  return (
                    <div key={tier.id}
                      className={`rounded-2xl p-5 relative overflow-hidden transition-all ${isCurrent ? 'ring-2' : 'bg-white shadow-card'}`}
                      style={isCurrent
                        ? { background: `linear-gradient(135deg, ${tier.color}18, ${tier.color}08)`, ringColor: tier.color, border: `2px solid ${tier.color}44` }
                        : {}}>
                      {isCurrent && (
                        <span className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full text-white"
                          style={{ background: tier.color }}>
                          Current
                        </span>
                      )}
                      <div className="text-3xl mb-3">{tier.icon}</div>
                      <h3 className="font-black text-base text-gray-900 mb-1">{tier.label}</h3>
                      <p className="text-xs text-gray-400 mb-3">
                        {tier.max === Infinity ? `${tier.min.toLocaleString()}+ points` : `${tier.min.toLocaleString()} – ${tier.max.toLocaleString()} points`}
                      </p>
                      <ul className="space-y-1.5">
                        {tier.perks.map(perk => (
                          <li key={perk} className="flex items-start gap-1.5 text-xs text-gray-600">
                            <span className="mt-0.5 font-bold" style={{ color: tier.color }}>✓</span>
                            {perk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        
        {activeTab === 'rewards' && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h2 className="font-bold text-lg text-gray-900">Redeem Your Points</h2>
                <p className="text-sm text-gray-500 mt-0.5">You have <span className="font-bold text-gray-900">{points.toLocaleString()}</span> points available</p>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {['all', 'discount', 'shipping', 'service', 'access'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setRewardFilter(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                      rewardFilter === cat ? 'text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'
                    }`}
                    style={rewardFilter === cat ? { background: 'linear-gradient(135deg,#e8517a,#f4874b)' } : {}}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRewards.map(reward => {
                const canAfford = points >= reward.points;
                const redeemed = redeemedIds.includes(reward.id);
                return (
                  <div key={reward.id}
                    className={`bg-white rounded-2xl shadow-card p-5 flex flex-col gap-4 transition-all ${canAfford && !redeemed ? 'hover:shadow-card-lg' : 'opacity-70'}`}>
                    <div className="flex items-start justify-between">
                      <span className="text-3xl">{reward.icon}</span>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-50 text-orange-600">
                        {reward.points.toLocaleString()} pts
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-sm">{reward.label}</h3>
                      {!canAfford && (
                        <p className="text-xs text-gray-400 mt-1">
                          Need {(reward.points - points).toLocaleString()} more points
                        </p>
                      )}
                    </div>

                    
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, Math.round((points / reward.points) * 100))}%`,
                          background: canAfford ? 'linear-gradient(90deg,#e8517a,#f4874b)' : '#d1d5db'
                        }} />
                    </div>

                    <button
                      onClick={() => handleRedeem(reward)}
                      disabled={!canAfford || redeemed}
                      className="w-full py-2.5 rounded-xl text-sm font-bold transition-all disabled:cursor-not-allowed"
                      style={redeemed
                        ? { background: '#dcfce7', color: '#16a34a' }
                        : canAfford
                          ? { background: 'linear-gradient(135deg,#e8517a,#f4874b)', color: '#fff' }
                          : { background: '#f3f4f6', color: '#9ca3af' }
                      }
                    >
                      {redeemed ? '✓ Redeemed' : canAfford ? 'Redeem Now' : 'Not Enough Points'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        
        {activeTab === 'history' && (
          <div>
            <h2 className="font-bold text-lg text-gray-900 mb-6">Points History</h2>
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              {MOCK_HISTORY.map((item, i) => (
                <div key={item.id}
                  className={`flex items-center justify-between px-6 py-4 gap-4 ${i < MOCK_HISTORY.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                      item.type === 'earn' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                    }`}>
                      {item.type === 'earn' ? '↑' : '↓'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-400">{item.date}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold flex-shrink-0 ${item.points > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {item.points > 0 ? '+' : ''}{item.points.toLocaleString()} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        
        {activeTab === 'referral' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-card p-8 text-center mb-6">
              <span className="text-5xl block mb-4">🎁</span>
              <h2 className="font-black text-2xl text-gray-900 mb-2">Refer Friends, Earn Together</h2>
              <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
                Share your referral code. When a friend makes their first purchase, you both get <span className="font-bold text-orange-500">500 bonus points</span>.
              </p>

              
              <div className="flex items-center gap-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-4 mb-4">
                <span className="flex-1 font-mono font-black text-xl text-gray-900 tracking-widest">{referralCode}</span>
                <button
                  onClick={handleCopyReferral}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}
                >
                  {referralCopied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>

              <p className="text-xs text-gray-400">Or share via</p>
              <div className="flex justify-center gap-3 mt-3">
                {['Email', 'WhatsApp', 'Twitter'].map(m => (
                  <button key={m}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500 transition-all bg-white">
                    {m}
                  </button>
                ))}
              </div>
            </div>

            
            <div className="grid grid-cols-3 gap-4">
              {[
                { step: '1', icon: '📤', label: 'Share your code' },
                { step: '2', icon: '🛒', label: 'Friend purchases' },
                { step: '3', icon: '🎉', label: 'Both earn 500 pts' },
              ].map(s => (
                <div key={s.step} className="bg-white rounded-2xl shadow-card p-5 text-center">
                  <span className="text-3xl block mb-2">{s.icon}</span>
                  <p className="text-xs font-bold text-gray-900">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

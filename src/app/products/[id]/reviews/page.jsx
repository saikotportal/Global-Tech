'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/products';
import { useToast } from '@/hooks/useToast';

const FIRST_NAMES = ['Alex','Sarah','James','Emily','Marcus','Priya','Daniel','Sofia','Lucas','Aisha','Tom','Nina','Ryan','Mei','Chris'];
const LAST_INITIALS = ['M.','K.','R.','T.','L.','P.','W.','H.','B.','C.','D.','G.','N.','S.','V.'];
const TITLES = [
  'Absolutely worth every penny',
  'Exceeded my expectations',
  'Best purchase this year',
  'Solid upgrade from my old one',
  'Great value, minor quibbles',
  'Premium quality, premium price',
  'Couldn\'t be happier',
  'Impressive out of the box',
  'Almost perfect',
  'Highly recommend to everyone',
  'Delivers on every promise',
  'A serious step up in quality',
  'Some pros and cons',
  'Fantastic for everyday use',
  'Genuinely surprised how good this is',
];
const BODIES = [
  'The build quality is exceptional — every detail feels intentional. Setup was seamless and I was up and running in minutes. Battery life blew me away.',
  'After two weeks of heavy use, I can confidently say this is the best in its class. The performance is silky smooth and it handles everything I throw at it.',
  'Packaging was premium and the unboxing experience alone felt special. The device itself is even better. Camera quality is stunning in all lighting conditions.',
  'I was a bit hesitant about the price point but it absolutely justifies the cost. The speed difference from my old device is night and day.',
  'Solid product through and through. The only minor criticism is the learning curve, but once you\'re past that it\'s genuinely excellent.',
  'I\'ve tried several competitors and this one wins on build quality and reliability. The software integration is seamless.',
  'Fast, beautiful, and intuitive. My productivity has noticeably improved since switching to this. No regrets at all.',
  'The display quality is absolutely stunning. Colours are vivid and accurate. Battery comfortably lasts my whole day with heavy use.',
  'Three stars for the connectivity issues I experienced initially, but after the firmware update everything is perfect. Great product.',
  'My family has been fighting over who gets to use it. That\'s the best review I can give — everyone wants it.',
  'The attention to detail is remarkable. You can tell real thought went into every aspect of the user experience.',
  'Received it two days early, was already impressed before I even turned it on. Performance matches the hype completely.',
  'Pros: blazing fast, gorgeous design, excellent build. Cons: pricey accessories. Overall a 9/10.',
  'Daily driver for six months now with zero issues. Durable, reliable, and still feels fresh. A long-term keeper.',
  'Hands down one of the best gadgets I\'ve ever owned. Transformed how I work and play every single day.',
];
const DATES = ['1 day ago','2 days ago','3 days ago','5 days ago','1 week ago','10 days ago','2 weeks ago','3 weeks ago','1 month ago','6 weeks ago','2 months ago','3 months ago'];
const TAGS = [['Verified Purchase'],['Verified Purchase','Early Adopter'],['Verified Purchase'],['Top Reviewer'],['Verified Purchase','Long-term Owner'],['Verified Purchase'],[]];

function seededRand(seed) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return Math.abs(s) / 0x7fffffff; };
}

function generateReviews(productId, productRating, totalReviews) {
  const rand = seededRand(productId * 7919);
  const count = Math.min(totalReviews, 24);
  return Array.from({ length: count }, (_, i) => {
    const r = rand;
    const roll = r();
    let stars;
    if (roll < 0.05) stars = 1;
    else if (roll < 0.10) stars = 2;
    else if (roll < 0.20) stars = 3;
    else if (roll < 0.45) stars = 4;
    else stars = 5;

    return {
      id: i,
      name: `${FIRST_NAMES[Math.floor(r() * FIRST_NAMES.length)]} ${LAST_INITIALS[Math.floor(r() * LAST_INITIALS.length)]}`,
      stars,
      title: TITLES[Math.floor(r() * TITLES.length)],
      body: BODIES[Math.floor(r() * BODIES.length)],
      date: DATES[Math.floor(r() * DATES.length)],
      tags: TAGS[Math.floor(r() * TAGS.length)],
      helpful: Math.floor(r() * 60),
    };
  });
}

function StarRow({ filled, total = 5, size = 'md' }) {
  const cls = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: total }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className={cls} fill={i < filled ? '#f59e0b' : '#e5e7eb'}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </span>
  );
}

function InteractiveStar({ value, hover, onHover, onClick }) {
  return (
    <button
      type="button"
      onMouseEnter={() => onHover(value)}
      onMouseLeave={() => onHover(0)}
      onClick={() => onClick(value)}
      className="focus:outline-none"
    >
      <svg viewBox="0 0 20 20" className="w-8 h-8 transition-colors"
        fill={value <= hover ? '#f59e0b' : '#e5e7eb'}>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
    </button>
  );
}

export default function ReviewsPage({ params }) {
  const product = getProductById(params.id);
  if (!product) notFound();

  const { toast } = useToast();

  const allReviews = useMemo(
    () => generateReviews(product.id, product.rating, product.reviews),
    [product.id, product.rating, product.reviews]
  );

  const breakdown = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    allReviews.forEach(r => counts[r.stars - 1]++);
    return counts.reverse();
  }, [allReviews]);

  const [filterStar, setFilterStar] = useState(0);
  const [sort, setSort] = useState('recent');
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const filtered = useMemo(() => {
    let list = filterStar ? allReviews.filter(r => r.stars === filterStar) : [...allReviews];
    if (sort === 'highest') list.sort((a, b) => b.stars - a.stars);
    else if (sort === 'lowest') list.sort((a, b) => a.stars - b.stars);
    else if (sort === 'helpful') list.sort((a, b) => b.helpful - a.helpful);
    return list;
  }, [allReviews, filterStar, sort]);

  const paginated = filtered.slice(0, page * PER_PAGE);
  const hasMore = paginated.length < filtered.length;

  const [showForm, setShowForm] = useState(false);
  const [hoverStar, setHoverStar] = useState(0);
  const [formStars, setFormStars] = useState(0);
  const [formTitle, setFormTitle] = useState('');
  const [formBody, setFormBody] = useState('');
  const [formName, setFormName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (!formStars) { toast.error('Please select a star rating'); return; }
    if (!formTitle.trim()) { toast.error('Please add a review title'); return; }
    if (!formBody.trim() || formBody.length < 20) { toast.error('Review must be at least 20 characters'); return; }
    setSubmitted(true);
    setShowForm(false);
    toast.success('Review submitted! It will appear after moderation.');
    setFormStars(0); setFormTitle(''); setFormBody(''); setFormName('');
  }

  const pct = (count) => allReviews.length ? Math.round((count / allReviews.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-10">

        
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8 flex-wrap">
          <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-orange-500 transition-colors">Products</Link>
          <span>/</span>
          <Link href={`/products/${product.id}`} className="hover:text-orange-500 transition-colors truncate max-w-[160px]">{product.name}</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">Reviews</span>
        </nav>

        
        <Link href={`/products/${product.id}`}>
          <div className="flex items-center gap-4 bg-white rounded-2xl shadow-card p-4 mb-8 hover:shadow-card-lg transition-shadow group">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-xl flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
              onError={e => { e.target.src = `https://placehold.co/64x64/f5f5f5/999?text=${product.brand}`; }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-orange-500 font-semibold mb-0.5">{product.brand}</p>
              <h2 className="font-bold text-gray-900 truncate group-hover:text-orange-500 transition-colors">{product.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <StarRow filled={Math.round(product.rating)} size="sm" />
                <span className="text-sm font-semibold text-gray-800">{product.rating}</span>
                <span className="text-xs text-gray-400">· {product.reviews.toLocaleString()} reviews</span>
              </div>
            </div>
            <span className="text-xs text-gray-400 group-hover:text-orange-500 transition-colors flex-shrink-0">View product →</span>
          </div>
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">

          
          <aside className="lg:w-72 flex-shrink-0 space-y-5">

            
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="font-bold text-gray-900 mb-4">Overall Rating</h3>
              <div className="flex flex-col items-center py-4 border-b border-gray-100 mb-5">
                <p className="text-6xl font-black text-gray-900 leading-none">{product.rating}</p>
                <StarRow filled={Math.round(product.rating)} />
                <p className="text-xs text-gray-400 mt-2">{product.reviews.toLocaleString()} verified reviews</p>
              </div>

              
              <div className="space-y-2.5">
                {[5, 4, 3, 2, 1].map((star, i) => (
                  <button
                    key={star}
                    onClick={() => { setFilterStar(filterStar === star ? 0 : star); setPage(1); }}
                    className={`w-full flex items-center gap-2.5 group rounded-lg p-1 transition-all ${filterStar === star ? 'bg-orange-50' : 'hover:bg-gray-50'}`}
                  >
                    <span className="text-xs font-semibold text-gray-600 w-4">{star}</span>
                    <svg viewBox="0 0 12 12" className="w-3.5 h-3.5 flex-shrink-0" fill="#f59e0b">
                      <path d="M6 1l1.3 2.6L10 4l-2 1.9.5 2.7L6 7.3 3.5 8.6 4 5.9 2 4l2.7-.4z"/>
                    </svg>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct(breakdown[5 - star])}%`, background: 'linear-gradient(90deg,#e8517a,#f4874b)' }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-8 text-right">{breakdown[5 - star]}</span>
                  </button>
                ))}
              </div>
              {filterStar > 0 && (
                <button
                  onClick={() => { setFilterStar(0); setPage(1); }}
                  className="mt-4 w-full text-xs text-orange-500 hover:text-orange-600 font-semibold py-1.5 border border-orange-200 rounded-lg hover:bg-orange-50 transition-all"
                >
                  Clear filter
                </button>
              )}
            </div>

            
            {!submitted ? (
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h3 className="font-bold text-gray-900 mb-1">Share your experience</h3>
                <p className="text-xs text-gray-500 mb-4">Help others make the right choice.</p>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 active:scale-95"
                  style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}
                >
                  {showForm ? 'Cancel' : '✏️ Write a Review'}
                </button>

                {showForm && (
                  <div className="mt-5 space-y-4">
                    
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-2">Your Rating *</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <InteractiveStar
                            key={s}
                            value={s}
                            hover={hoverStar || formStars}
                            onHover={setHoverStar}
                            onClick={setFormStars}
                          />
                        ))}
                      </div>
                      {formStars > 0 && (
                        <p className="text-xs text-orange-500 mt-1 font-medium">
                          {['','Poor','Fair','Good','Great','Excellent'][formStars]}
                        </p>
                      )}
                    </div>

                    
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">Your Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Alex M."
                        value={formName}
                        onChange={e => setFormName(e.target.value)}
                        className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                    </div>

                    
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">Review Title *</label>
                      <input
                        type="text"
                        placeholder="Summarise your experience"
                        value={formTitle}
                        onChange={e => setFormTitle(e.target.value)}
                        className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                    </div>

                    
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">Your Review *</label>
                      <textarea
                        rows={4}
                        placeholder="What did you like or dislike? How is it in real use?"
                        value={formBody}
                        onChange={e => setFormBody(e.target.value)}
                        className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                      />
                      <p className="text-xs text-gray-400 mt-1">{formBody.length} / 20 min characters</p>
                    </div>

                    <button
                      onClick={handleSubmit}
                      className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}
                    >
                      Submit Review
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
                <p className="text-2xl mb-2">🎉</p>
                <p className="font-bold text-green-800 text-sm">Thank you for your review!</p>
                <p className="text-xs text-green-600 mt-1">It will appear after moderation.</p>
              </div>
            )}
          </aside>

          
          <div className="flex-1 min-w-0">

            
            <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
              <p className="text-sm text-gray-500">
                {filterStar
                  ? <><span className="font-semibold text-gray-900">{filtered.length}</span> reviews with {filterStar}★</>
                  : <><span className="font-semibold text-gray-900">{allReviews.length}</span> reviews</>
                }
              </p>
              <select
                value={sort}
                onChange={e => { setSort(e.target.value); setPage(1); }}
                className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
              >
                <option value="recent">Most Recent</option>
                <option value="helpful">Most Helpful</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
            </div>

            
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <p className="text-4xl">⭐</p>
                <p className="font-semibold text-gray-700">No {filterStar}★ reviews yet</p>
                <button onClick={() => setFilterStar(0)} className="text-sm text-orange-500 hover:underline font-medium">Show all reviews</button>
              </div>
            ) : (
              <div className="space-y-4">
                {paginated.map((review) => (
                  <div key={review.id} className="bg-white rounded-2xl shadow-card p-5 hover:shadow-card-lg transition-shadow">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        
                        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
                          style={{ background: `hsl(${(review.id * 47) % 360}, 65%, 55%)` }}>
                          {review.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900">{review.name}</p>
                          <p className="text-xs text-gray-400">{review.date}</p>
                        </div>
                      </div>
                      <StarRow filled={review.stars} size="sm" />
                    </div>

                    
                    {review.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {review.tags.map(tag => (
                          <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium border border-green-100">
                            ✓ {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <h4 className="font-bold text-gray-900 text-sm mb-1.5">"{review.title}"</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{review.body}</p>

                    
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                      <p className="text-xs text-gray-400">{review.helpful} people found this helpful</p>
                      <button className="text-xs text-gray-400 hover:text-orange-500 transition-colors font-medium">
                        👍 Helpful
                      </button>
                    </div>
                  </div>
                ))}

                
                {hasMore && (
                  <button
                    onClick={() => setPage(p => p + 1)}
                    className="w-full py-3 rounded-2xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50 transition-all"
                  >
                    Load more reviews ({filtered.length - paginated.length} remaining)
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

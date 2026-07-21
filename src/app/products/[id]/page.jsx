'use client';
import { useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProductById, PRODUCTS } from '@/lib/products';
import { useCurrency } from '@/context/CurrencyContext';
import { calcDiscount } from '@/utils/helpers';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/hooks/useToast';
import ProductCard from '@/components/products/ProductCard';

function BackInStockButton({ product }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (!email.includes('@')) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mb-5 px-4 py-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
        <span className="text-green-500 text-xl">✅</span>
        <div>
          <p className="text-green-700 font-semibold text-sm">You're on the list!</p>
          <p className="text-green-600 text-xs">We'll email {email} when {product.name} is back.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-5">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full py-3 rounded-xl font-semibold text-white text-sm hover:opacity-90 transition"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        >
          🔔 Notify Me When Back in Stock
        </button>
      ) : (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-3">
          <p className="text-sm font-semibold text-purple-800">Get notified when available</p>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-purple-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="flex-1 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              Notify Me
            </button>
            <button onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage({ params }) {
  const product = getProductById(params.id);
  if (!product) notFound();

  const router          = useRouter();
  const { addItem }     = useCart();
  const { format }      = useCurrency();
  const { toggle, isWishlisted } = useWishlist();
  const { toast }       = useToast();
  const wishlisted      = isWishlisted(product.id);

  const images = (product.images && product.images.length > 0)
    ? product.images
    : [product.image, product.image, product.image, product.image];

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [selectedIdx,   setSelectedIdx]   = useState(0);
  const [qty,  setQty]  = useState(1);
  const [tab,  setTab]  = useState('description');
  const [added, setAdded] = useState(false);

  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const disc    = calcDiscount(product.originalPrice, product.price);

  function handleSelectImage(src, idx) {
    setSelectedImage(src);
    setSelectedIdx(idx);
  }

  function handleAdd() {
    addItem({ ...product }, qty);
    toast.success(`${product.name} added to cart!`);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    addItem({ ...product }, qty);
    router.push('/checkout');
  }

  const TABS = [
    { key: 'description',    label: 'Description' },
    { key: 'specifications', label: 'Specifications' },
    { key: 'reviews',        label: 'Reviews' },
    { key: 'faq',            label: 'Q&A' },
  ];

  return (
    <div className="container-custom py-8 sm:py-12">
      
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8 flex-wrap">
        <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-orange-500 transition-colors">Products</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category}`} className="hover:text-orange-500 transition-colors capitalize">{product.category}</Link>
        <span>/</span>
        <span className="text-dark-800 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">

        
        <div className="space-y-4">
          
          <div className="aspect-square bg-gray-50 rounded-3xl shadow-card relative overflow-hidden">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover transition-opacity duration-200"
              onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x600/f5f5f5/999?text=${encodeURIComponent(product.brand)}`; }}
            />
            {disc > 0 && (
              <span className="absolute top-4 left-4 bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                -{disc}% OFF
              </span>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <span className="font-bold text-2xl text-gray-500">Out of Stock</span>
              </div>
            )}
          </div>

          
          <div className="grid grid-cols-4 gap-3">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => handleSelectImage(src, i)}
                className={`aspect-square bg-gray-50 rounded-xl overflow-hidden border-2 transition-all focus:outline-none ${
                  selectedIdx === i ? 'border-orange-400 shadow-md' : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img
                  src={src}
                  alt={`${product.name} view ${i + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/200x200/f5f5f5/999?text=${encodeURIComponent(product.brand)}`; }}
                />
              </button>
            ))}
          </div>
        </div>

        
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-4 mb-2">
            <span className="text-sm font-semibold text-orange-500 uppercase tracking-wide">{product.brand}</span>
            
            <button
              onClick={() => {
                toggle(product);
                toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️');
              }}
              className={`text-2xl transition-transform hover:scale-110 ${wishlisted ? 'text-red-500' : 'text-gray-300'}`}
              title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {wishlisted ? '❤️' : '🤍'}
            </button>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold text-dark-800 mb-3 leading-tight">{product.name}</h1>

          
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="flex text-yellow-400">{'★'.repeat(Math.round(product.rating))}</div>
            <span className="font-semibold text-dark-800">{product.rating}</span>
            <span className="text-gray-400 text-sm">({product.reviews.toLocaleString()} reviews)</span>
            <span className={`text-sm font-semibold ${product.inStock ? 'text-green-500' : 'text-red-500'}`}>
              {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
            </span>
          </div>

          
          {product.inStock && product.stock <= 10 && (
            <div className="flex items-center gap-2 mb-4 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl">
              <span className="text-lg">🔥</span>
              <span className="text-red-600 text-sm font-semibold">Only {product.stock} left in stock — order soon!</span>
            </div>
          )}

          
          {!product.inStock && <BackInStockButton product={product} />}

          
          <div className="flex items-baseline gap-3 mb-6 p-4 bg-orange-50 rounded-2xl">
            <span className="font-display text-4xl font-bold text-dark-800">{format(product.price)}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-xl text-gray-400 line-through">{format(product.originalPrice)}</span>
                <span className="text-green-600 font-semibold text-sm">You save {format(product.originalPrice - product.price)}</span>
              </>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: '🚚', label: 'Free Shipping', sub: 'Orders over $50' },
              { icon: '↩️', label: 'Easy Returns',  sub: '30-day policy' },
              { icon: '🛡️', label: 'Warranty',      sub: '1-year included' },
            ].map(item => (
              <div key={item.label} className="text-center p-3 bg-gray-50 rounded-xl">
                <div className="text-2xl mb-1">{item.icon}</div>
                <p className="text-xs font-semibold text-dark-800">{item.label}</p>
                <p className="text-xs text-gray-400">{item.sub}</p>
              </div>
            ))}
          </div>

          
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 font-bold text-lg text-gray-600">−</button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 font-bold text-lg text-gray-600">+</button>
            </div>
            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className="flex-1 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}
            >
              {added ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>
          </div>

          
          <button
            onClick={handleBuyNow}
            disabled={!product.inStock}
            className="w-full py-3 rounded-xl font-bold text-center border-2 border-dark-800 text-dark-800 hover:bg-dark-800 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Buy Now
          </button>
        </div>
      </div>

      
      <div className="mb-16">
        <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-5 py-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px ${
                tab === key ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:text-dark-800'
              }`}
            >{label}</button>
          ))}
        </div>

        <div className="prose max-w-none text-gray-600 leading-relaxed">
          {tab === 'description' && (
            <div>
              <p className="mb-4">{product.description}</p>
              <p>Experience the pinnacle of modern technology with the {product.name}. Engineered for performance, designed for everyday use, and built to last.</p>
              <ul className="mt-4 space-y-2 list-none p-0">
                {['Industry-leading performance', 'Premium build quality', 'Advanced camera system', 'All-day battery life', '5G connectivity'].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-green-500 font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {tab === 'specifications' && (
            <table className="w-full text-sm">
              <tbody>
                {[
                  ['Brand',        product.brand],
                  ['Model',        product.name],
                  ['Category',     product.category],
                  ['SKU',          `GT-${product.id.toString().padStart(5,'0')}`],
                  ['Rating',       `${product.rating}/5`],
                  ['Availability', product.inStock ? 'In Stock' : 'Out of Stock'],
                  ['Warranty',     '1 Year Manufacturer Warranty'],
                ].map(([k, v]) => (
                  <tr key={k} className="border-b border-gray-100">
                    <td className="py-3 font-semibold text-dark-800 w-40">{k}</td>
                    <td className="py-3 text-gray-600">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {tab === 'reviews' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-3xl font-bold text-gray-900">{product.rating}</span>
                  <span className="text-yellow-400 ml-2">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
                  <span className="text-sm text-gray-400 ml-2">({product.reviews.toLocaleString()} reviews)</span>
                </div>
                <Link
                  href={`/products/${product.id}/reviews`}
                  className="text-sm font-semibold text-white px-4 py-2 rounded-xl hover:opacity-90 transition"
                  style={{ background: 'linear-gradient(135deg, #e8517a, #f4874b)' }}
                >
                  Write a Review
                </Link>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Alex M.',  rating: 5, text: 'Absolutely love this product. Worth every penny!',                 date: '2 days ago'  },
                  { name: 'Sarah K.', rating: 5, text: "Best purchase I've made this year. Incredible quality.",           date: '1 week ago'  },
                  { name: 'James R.', rating: 4, text: 'Great product overall, minor quibbles aside. Highly recommended.', date: '2 weeks ago' },
                ].map(r => (
                  <div key={r.name} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-dark-800">{r.name}</span>
                      <span className="text-xs text-gray-400">{r.date}</span>
                    </div>
                    <div className="flex text-yellow-400 text-sm mb-2">{'★'.repeat(r.rating)}</div>
                    <p className="text-sm text-gray-600">{r.text}</p>
                  </div>
                ))}
              </div>
              <Link
                href={`/products/${product.id}/reviews`}
                className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-orange-200 text-orange-500 font-semibold text-sm hover:bg-orange-50 transition"
              >
                See All {product.reviews.toLocaleString()} Reviews →
              </Link>
            </div>
          )}
          {tab === 'faq' && (
            <div className="space-y-4">
              {[
                { q: 'Does it come with a charger?', a: 'Yes, a USB-C charger is included in the box.' },
                { q: 'Is there a warranty?',         a: 'Yes, comes with a 1-year manufacturer warranty plus optional extended coverage.' },
              ].map(({ q, a }) => (
                <div key={q} className="p-4 bg-gray-50 rounded-xl">
                  <p className="font-semibold text-dark-800 mb-1">Q: {q}</p>
                  <p className="text-sm text-gray-600">A: {a}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      
      {related.length > 0 && (
        <div>
          <h2 className="section-title mb-6">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { useCurrency } from '@/context/CurrencyContext';
import { calcDiscount } from '@/utils/helpers';

function WishlistCard({ product, onRemove }) {
  const { addItem }  = useCart();
  const { toast }    = useToast();
  const { format }   = useCurrency();
  const disc         = calcDiscount(product.originalPrice, product.price);

  function handleAdd() {
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  }

  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden group flex flex-col sm:flex-row gap-0 animate-fade-in">
      
      <Link href={`/products/${product.id}`} className="sm:w-48 flex-shrink-0">
        <div className="h-48 sm:h-full bg-gray-50 relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.src = `https://placehold.co/300x300/f5f5f5/999?text=${encodeURIComponent(product.brand)}`; }}
          />
          {disc > 0 && (
            <span className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full bg-green-500 text-white">
              -{disc}%
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="font-bold text-gray-500 text-sm">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      
      <div className="flex-1 p-5 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-1">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{product.brand}</p>
          <button
            onClick={onRemove}
            className="text-gray-300 hover:text-red-400 transition-colors text-lg flex-shrink-0"
            title="Remove from wishlist"
          >
            ✕
          </button>
        </div>

        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-dark-800 hover:text-orange-500 transition-colors leading-snug mb-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-gray-400 line-clamp-2 mb-3 flex-1">{product.description}</p>

        
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex text-yellow-400 text-xs">
            {[1,2,3,4,5].map((s) => (
              <span key={s} className={s <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-200'}>★</span>
            ))}
          </div>
          <span className="text-xs text-gray-400">{product.rating} ({product.reviews.toLocaleString()} reviews)</span>
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-bold text-dark-800 text-xl">{format(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through">{format(product.originalPrice)}</span>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}
          >
            {product.inStock ? '🛒 Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const { items, remove, clear } = useWishlist();
  const { addItem }  = useCart();
  const { toast }    = useToast();
  const [clearing, setClearing] = useState(false);

  function addAll() {
    const inStock = items.filter((p) => p.inStock);
    inStock.forEach((p) => addItem(p));
    toast.success(`${inStock.length} item${inStock.length !== 1 ? 's' : ''} added to cart!`);
  }

  function handleClear() {
    setClearing(true);
    setTimeout(() => { clear(); setClearing(false); }, 300);
  }

  return (
    <div className="container-custom py-10 sm:py-14">

      
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-dark-800 font-medium">Wishlist</span>
      </nav>

      
      <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-dark-800">My Wishlist</h1>
          <p className="text-gray-500 text-sm mt-1">
            {items.length === 0 ? 'Your wishlist is empty' : `${items.length} saved item${items.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        {items.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleClear}
              className="text-sm text-gray-400 hover:text-red-400 transition-colors"
            >
              Clear all
            </button>
            <button
              onClick={addAll}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-md"
              style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}
            >
              Add All to Cart
            </button>
          </div>
        )}
      </div>

      
      {items.length === 0 && (
        <div className="bg-white rounded-3xl shadow-card border border-gray-100 py-24 text-center">
          <div className="text-6xl mb-5">🤍</div>
          <h2 className="font-bold text-dark-800 text-xl mb-2">Nothing saved yet</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">
            Tap the heart icon on any product to save it here for later.
          </p>
          <Link
            href="/products"
            className="inline-block px-8 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-md"
            style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}
          >
            Browse Products
          </Link>
        </div>
      )}

      
      {items.length > 0 && (
        <div className={`space-y-4 transition-opacity duration-300 ${clearing ? 'opacity-0' : 'opacity-100'}`}>
          {items.map((product) => (
            <WishlistCard key={product.id} product={product} onRemove={() => remove(product.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

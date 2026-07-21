'use client';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { calcDiscount } from '@/utils/helpers';
import { useCurrency } from '@/context/CurrencyContext';
import { useWishlist } from '@/context/WishlistContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const { format } = useCurrency();
  const { toggle, isWishlisted } = useWishlist();
  const disc = calcDiscount(product.originalPrice, product.price);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="card group flex flex-col">
      <Link href={`/products/${product.id}`}>
        <div className="relative h-48 sm:h-56 bg-gray-50 rounded-t-2xl overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/400x300/f5f5f5/999?text=${encodeURIComponent(product.brand)}`;
            }}
          />
          {product.badge && (
            <span
              className="absolute top-2 left-2 text-xs font-bold px-2.5 py-1 rounded-full text-white shadow"
              style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}
            >
              {product.badge}
            </span>
          )}
          {disc > 0 && (
            <span className="absolute top-2 right-2 text-xs font-bold px-2.5 py-1 rounded-full bg-green-500 text-white shadow">
              -{disc}%
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="font-bold text-gray-500 text-sm tracking-wide">Out of Stock</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100">
            <span className="bg-white text-gray-800 text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg">
              Quick View
            </span>
          </div>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-1">
          <p className="text-xs text-gray-400 font-medium">{product.brand}</p>
          <button
            onClick={() => toggle(product)}
            className={`text-lg transition-all hover:scale-110 -mt-0.5 ${wishlisted ? 'text-red-500' : 'text-gray-300 hover:text-red-400'}`}
            title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {wishlisted ? '❤️' : '🤍'}
          </button>
        </div>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-sm text-dark-800 leading-snug hover:text-orange-500 transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-yellow-400 text-xs">
            {[1,2,3,4,5].map((s) => (
              <span key={s} className={s <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-200'}>★</span>
            ))}
          </div>
          <span className="text-xs text-gray-400">({product.reviews.toLocaleString()})</span>
        </div>
        <div className="flex items-center gap-2 mb-3 mt-auto">
          <span className="font-bold text-dark-800 text-base">{format(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">{format(product.originalPrice)}</span>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all hover:opacity-90 hover:shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-white"
          style={{ background: 'linear-gradient(135deg,#e8517a,#f4874b)' }}
        >
          {product.inStock ? '🛒 Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}


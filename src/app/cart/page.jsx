'use client';
import { useToast } from '@/hooks/useToast';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useCurrency } from '@/context/CurrencyContext';

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal, clearCart } = useCart();
  const { format } = useCurrency();

  const { toast }  = useToast();

  function handleRemove(item) {
    removeItem(item.id);
    toast.info(`${item.name} removed from cart`);
  }

  function handleClear() {
    clearCart();
    toast.info('Cart cleared');
  }

  const shipping = subtotal >= 50 ? 0 : 9.99;
  const tax      = subtotal * 0.08;
  const total    = subtotal + shipping + tax;

  if (items.length === 0) return (
    <div className="container-custom py-20 text-center">
      <div className="text-7xl mb-6">🛒</div>
      <h1 className="font-display text-3xl font-bold text-dark-800 mb-3">Your cart is empty</h1>
      <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
      <Link href="/products" className="btn-primary">Start Shopping →</Link>
    </div>
  );

  return (
    <div className="container-custom py-8 sm:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Shopping Cart <span className="text-gray-400 font-normal text-xl ml-2">({items.length} items)</span></h1>
        <button onClick={handleClear} className="text-sm text-red-400 hover:text-red-600 transition-colors">Clear cart</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="card p-4 sm:p-5 flex gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/200x200/f5f5f5/999?text=${encodeURIComponent(item.brand || 'Product')}`; }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-0.5">{item.brand}</p>
                <Link href={`/products/${item.id}`}>
                  <h3 className="font-semibold text-dark-800 hover:text-orange-500 transition-colors line-clamp-2 mb-1 text-sm sm:text-base">{item.name}</h3>
                </Link>
                {item.variant && <p className="text-xs text-gray-400 mb-2">{item.variant}</p>}
                <div className="flex items-center justify-between flex-wrap gap-3 mt-2">
                  <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 font-bold text-gray-600">−</button>
                    <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 font-bold text-gray-600">+</button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-dark-800">{format(item.price * item.qty)}</span>
                    <button onClick={() => handleRemove(item)} className="text-gray-300 hover:text-red-400 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl text-sm text-green-700">
            <span className="text-xl">🚚</span>
            {subtotal >= 50
              ? <span className="font-medium">You qualify for <strong>free shipping</strong>!</span>
              : <span>Add <strong>{format(50 - subtotal)}</strong> more for free shipping</span>
            }
          </div>

          <Link href="/products" className="inline-flex items-center gap-2 text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors">
            ← Continue Shopping
          </Link>
        </div>

        
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-display font-bold text-xl text-dark-800 mb-5">Order Summary</h2>

            
            <div className="flex gap-2 mb-5">
              <input type="text" placeholder="Coupon code" className="input-field py-2 text-sm flex-1" />
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition-colors">Apply</button>
            </div>

            <div className="space-y-3 mb-5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span><span>{format(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? 'Free' : format(shipping)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (8%)</span><span>{format(tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-dark-800 text-lg border-t pt-3">
                <span>Total</span><span>{format(total)}</span>
              </div>
            </div>

            <Link href="/checkout" className="btn-primary w-full text-center block mb-3">
              Proceed to Checkout →
            </Link>

            <div className="flex items-center justify-center gap-3 text-xs text-gray-400 mt-4">
              {['Visa', 'Mastercard', 'PayPal', 'Apple Pay'].map(p => (
                <span key={p} className="px-2 py-1 bg-gray-50 rounded font-medium">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

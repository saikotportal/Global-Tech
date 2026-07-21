'use client';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useCurrency } from '@/context/CurrencyContext';

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQty, subtotal } = useCart();
  const { format } = useCurrency();

  if (!isOpen) return null;

  return (
    <>
      
      <div
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        onClick={closeCart}
      />

      
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl animate-slide-in-right">
        
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-display text-xl font-bold text-dark-800">
            Your Cart
            <span className="ml-2 text-sm font-normal text-gray-500">({items.length} items)</span>
          </h2>
          <button
            onClick={closeCart}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-700 mb-2">Your cart is empty</h3>
              <p className="text-sm text-gray-400 mb-6">Start adding some amazing tech!</p>
              <button onClick={closeCart} className="btn-primary">Continue Shopping</button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {item.image
                    ? <img src={item.image} alt={item.name} className="w-full h-full object-cover"/>
                    : <span className="text-2xl">{item.emoji || '📦'}</span>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-dark-800 truncate">{item.name}</p>
                  {item.variant && <p className="text-xs text-gray-400">{item.variant}</p>}
                  <p className="font-bold text-orange-500 mt-1">{format(item.price)}</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                  <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 text-gray-600 font-bold"
                    >−</button>
                    <span className="w-6 text-center text-sm font-medium">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 text-gray-600 font-bold"
                    >+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        
        {items.length > 0 && (
          <div className="p-5 border-t border-gray-100 space-y-3">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>{format(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Shipping</span>
              <span className="text-green-500">Free</span>
            </div>
            <div className="flex justify-between font-bold text-dark-800 text-lg border-t pt-3">
              <span>Total</span>
              <span>{format(subtotal)}</span>
            </div>
            <Link href="/checkout" onClick={closeCart} className="btn-primary w-full text-center">
              Proceed to Checkout →
            </Link>
            <button onClick={closeCart} className="w-full text-sm text-gray-500 hover:text-orange-500 transition-colors py-1">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}

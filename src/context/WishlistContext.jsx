'use client';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('gt_wishlist');
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('gt_wishlist', JSON.stringify(items)); } catch {}
  }, [items]);

  const toggle = useCallback((product) => {
    setItems((prev) =>
      prev.find((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );
  }, []);

  const isWishlisted = useCallback((id) => items.some((p) => p.id === id), [items]);
  const remove = useCallback((id) => setItems((prev) => prev.filter((p) => p.id !== id)), []);
  const clear  = useCallback(() => setItems([]), []);

  return (
    <WishlistContext.Provider value={{ items, toggle, isWishlisted, remove, clear, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() { return useContext(WishlistContext); }

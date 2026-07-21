'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchProducts } from '@/lib/products';
import ProductCard from '@/components/products/ProductCard';

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [query, setQuery] = useState(q);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length === 0) {
      setResults([]);
    } else {
      setResults(searchProducts(trimmed));
    }
  }, [query]);

  useEffect(() => {
    if (q) setQuery(q);
  }, [q]);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Products</h1>

        
        <div className="relative mb-8 max-w-2xl">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search phones, laptops, TVs..."
            autoFocus
            className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl leading-none"
            >
              ×
            </button>
          )}
        </div>

        
        {query.trim() === '' ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg">Start typing to search products</p>
            <p className="text-sm mt-2">Try: "iPhone", "Sony", "laptops", "gaming"</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">😞</div>
            <p className="text-lg font-medium">No results for "{query}"</p>
            <p className="text-sm mt-2">Try a different search term or browse our categories.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">
              {results.length} result{results.length !== 1 ? 's' : ''} for "<span className="font-semibold text-gray-800">{query}</span>"
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}

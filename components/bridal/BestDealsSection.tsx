'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export default function BestDealsSection() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const res = await fetch('/api/products?sale=true&limit=8');
      const data = await res.json();
      
      if (data.success && data.products) {
        setDeals(data.products);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-500"></div>
            <p className="mt-4 text-text-secondary">Loading best deals...</p>
          </div>
        </div>
      </section>
    );
  }

  if (deals.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
            Best Deals
          </h2>
          <p className="text-text-secondary">Don't miss out on these amazing offers</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {deals.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/products?sale=true"
            className="inline-block bg-white text-text-primary border-2 border-text-primary px-8 py-3 rounded-none font-semibold hover:bg-text-primary hover:text-white transition-colors"
          >
            View All Deals
          </Link>
        </div>
      </div>
    </section>
  );
}

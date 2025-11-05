'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BridalHeroBanner from '@/components/bridal/BridalHeroBanner';
import CategoryIcons from '@/components/bridal/CategoryIcons';
import HighlightBoxes from '@/components/bridal/HighlightBoxes';
import BestDealsSection from '@/components/bridal/BestDealsSection';
import BrandsSection from '@/components/BrandsSection';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  const [popularProducts, setPopularProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularProducts();
  }, []);

  const fetchPopularProducts = async () => {
    try {
      const res = await fetch('/api/products?featured=true&limit=8');
      const data = await res.json();
      
      if (data.success && data.products) {
        setPopularProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching popular products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="bg-white">
        <BridalHeroBanner />
        <CategoryIcons />

        <section className="py-16 bg-background-section">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-medium tracking-wide text-text-primary mb-2.5">
                Popular Products
              </h2>
              <p className="text-text-secondary text-sm md:text-base">Bestselling items loved by our customers</p>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-500"></div>
                <p className="mt-4 text-text-secondary">Loading products...</p>
              </div>
            ) : popularProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {popularProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-text-secondary">No products available</p>
              </div>
            )}

            <div className="text-center mt-12">
              <Link
                href="/products"
                className="inline-block bg-white text-text-primary border-2 border-text-primary px-8 py-3 rounded-none font-semibold hover:bg-text-primary hover:text-white transition-colors"
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>

        <HighlightBoxes />
        <BrandsSection />
        <BestDealsSection />

        <section className="py-16 bg-background-secondary">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-center">
              <div className="space-y-3">
                <div className="text-5xl">🚚</div>
                <h3 className="font-medium tracking-wide text-base md:text-lg text-text-primary">Free Shipping</h3>
                <p className="text-text-secondary text-sm">On orders above ₹999</p>
              </div>
              <div className="space-y-3">
                <div className="text-5xl">✨</div>
                <h3 className="font-medium tracking-wide text-base md:text-lg text-text-primary">100% Authentic</h3>
                <p className="text-text-secondary text-sm">Genuine products guaranteed</p>
              </div>
              <div className="space-y-3">
                <div className="text-5xl">💝</div>
                <h3 className="font-medium tracking-wide text-base md:text-lg text-text-primary">Bridal Special</h3>
                <p className="text-text-secondary text-sm">Expert consultation available</p>
              </div>
              <div className="space-y-3">
                <div className="text-5xl">💬</div>
                <h3 className="font-medium tracking-wide text-base md:text-lg text-text-primary">24/7 Support</h3>
                <p className="text-text-secondary text-sm">We're here to help</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

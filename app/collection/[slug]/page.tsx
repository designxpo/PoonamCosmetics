'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

// Note: Using search-based fallback for collections as API doesn't accept `collection` yet.
export default function CollectionPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fallback: search by collection keyword in name/description
        const res = await fetch(`/api/products?search=${encodeURIComponent(slug)}&limit=40`);
        const data = await res.json();
        if (data.success) setProducts(data.products);
      } catch (e) {
        console.error('Failed to load collection products:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [slug]);

  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Top banner */}
        <section className="bg-background-secondary py-10">
          <div className="container mx-auto px-4">
            <nav className="text-sm text-text-secondary mb-2">
              <Link href="/" className="hover:text-primary-500">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-text-primary">Collection</span>
              <span className="mx-2">/</span>
              <span className="text-text-primary">{title}</span>
            </nav>
            <h1 className="text-2xl md:text-3xl font-medium tracking-wide text-text-primary">{title}</h1>
            <p className="text-text-secondary text-sm md:text-base mt-1">Handpicked items for {title}.</p>
          </div>
        </section>

        {/* Products grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-500"></div>
                <p className="mt-4 text-text-secondary">Loading products...</p>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-text-secondary">No products found for this collection.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

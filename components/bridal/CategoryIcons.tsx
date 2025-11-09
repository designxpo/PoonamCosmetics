'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function CategoryIcons() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      
      if (data.success && data.categories) {
        // Take only first 6 categories for display
        setCategories(data.categories.slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-background-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-500"></div>
            <p className="mt-4 text-text-secondary">Loading categories...</p>
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
            Shop by Categories
          </h2>
          <p className="text-text-secondary">Discover your perfect bridal look</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="flex flex-col items-center group cursor-pointer"
            >
              {category.image ? (
                <div className="relative w-24 h-24 md:w-28 md:h-28 flex items-center justify-center overflow-visible">
                  <span className="absolute inset-0 z-0 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                    background: 'radial-gradient(circle, rgba(255,183,148,0.25) 0%, rgba(255,183,148,0.10) 60%, transparent 100%)',
                    filter: 'blur(8px)'
                  }} />
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-contain z-10 transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

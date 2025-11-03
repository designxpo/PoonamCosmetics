'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollingBanner from '@/components/ScrollingBanner';
import HeroBannerCarousel, { BannerSlide } from '@/components/HeroBannerCarousel';
import FeaturedCollections, { FeaturedCollectionItem } from '@/components/FeaturedCollections';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  const [categories, setCategories] = useState<any[]>([]);
  const [banners, setBanners] = useState<BannerSlide[]>([]);
  const [featuredCollections, setFeaturedCollections] = useState<FeaturedCollectionItem[]>([]);
  const [activeTab, setActiveTab] = useState<'best-sellers' | 'new-arrivals' | 'sale'>('best-sellers');
  const [tabProducts, setTabProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchSectionProducts();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      const [categoriesRes, bannersRes, collectionsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/banners'),
        fetch('/api/featured-collections'),
      ]);

      const categoriesData = await categoriesRes.json();
      const bannersData = await bannersRes.json();
      const collectionsData = await collectionsRes.json();

      if (categoriesData.success) {
        setCategories(categoriesData.categories);
      }
      if (bannersData.success && bannersData.banners.length > 0) {
        // Map banners to BannerSlide format
        const mappedBanners: BannerSlide[] = bannersData.banners.map((banner: any) => ({
          id: banner._id,
          image: banner.image,
          title: banner.title,
          subtitle: banner.subtitle,
          description: banner.description,
          ctaText: banner.ctaText,
          ctaLink: banner.ctaLink,
          textPosition: banner.textPosition,
          textColor: banner.textColor,
          overlay: banner.overlay,
        }));
        setBanners(mappedBanners);
      } else {
        // Default banner if none exist in database
        setBanners([
          {
            id: 'default',
            image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1920&q=80',
            title: 'Care for Your Skin, Care for Your Beauty',
            subtitle: 'The Perfect Skincare',
            description: 'Make sure you use natural products that are designed for everyone',
            ctaText: 'Shop Now',
            ctaLink: '/products',
            textPosition: 'left',
            textColor: 'light',
            overlay: true,
          },
        ]);
      }
      if (collectionsData.success) {
        setFeaturedCollections(collectionsData.collections);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSectionProducts = async () => {
    try {
      const res = await fetch(`/api/product-sections?section=${activeTab}`);
      const data = await res.json();
      
      if (data.success && data.products) {
        setTabProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching section products:', error);
    }
  };

  // Category icons for "Our Picks for You"
  const categoryPicks = categories.slice(0, 6).map((cat: any, idx: number) => ({
    ...cat,
    icon: ['💆', '🧴', '💄', '🌿', '✨', '🧼'][idx] || '💄',
  }));

  return (
    <>
      <Header />
      <ScrollingBanner />
      <main className="bg-white">
        {/* Hero Banner Carousel */}
        <HeroBannerCarousel slides={banners} autoPlayInterval={5000} />

        {/* Our Picks for You */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Our Picks for You</h2>
              <p className="text-slate-600">Our products are designed for everyone</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {categoryPicks.map((category: any) => (
                <Link
                  key={category._id}
                  href={`/products?category=${category.slug}`}
                  className="flex flex-col items-center group"
                >
                  <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-slate-200 transition text-4xl">
                    {category.icon}
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Collections */}
        <FeaturedCollections collections={featuredCollections} />

        {/* Best Sellers / New Arrivals Tabs */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            {/* Tabs */}
            <div className="flex justify-center gap-8 mb-12">
              <button
                onClick={() => setActiveTab('best-sellers')}
                className={`text-xl font-bold pb-2 transition-colors ${
                  activeTab === 'best-sellers'
                    ? 'text-slate-900 border-b-2 border-slate-900'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Best Sellers
              </button>
              <button
                onClick={() => setActiveTab('new-arrivals')}
                className={`text-xl font-bold pb-2 transition-colors ${
                  activeTab === 'new-arrivals'
                    ? 'text-slate-900 border-b-2 border-slate-900'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                New Arrivals
              </button>
              <button
                onClick={() => setActiveTab('sale')}
                className={`text-xl font-bold pb-2 transition-colors ${
                  activeTab === 'sale'
                    ? 'text-slate-900 border-b-2 border-slate-900'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Sale
              </button>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-slate-900"></div>
                <p className="mt-4 text-slate-500">Loading products...</p>
              </div>
            ) : tabProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tabProducts.map((product: any) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-500">No products available</p>
              </div>
            )}

            {/* View All Button */}
            <div className="text-center mt-12">
              <Link
                href="/products"
                className="inline-block border-2 border-slate-900 text-slate-900 px-8 py-3 rounded-none font-medium hover:bg-slate-900 hover:text-white transition"
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter / Features Section */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl mb-4">🚚</div>
                <h3 className="font-bold text-lg mb-2">Free Shipping</h3>
                <p className="text-slate-600 text-sm">On orders above ₹999</p>
              </div>
              <div>
                <div className="text-4xl mb-4">✨</div>
                <h3 className="font-bold text-lg mb-2">100% Authentic</h3>
                <p className="text-slate-600 text-sm">Genuine products guaranteed</p>
              </div>
              <div>
                <div className="text-4xl mb-4">💬</div>
                <h3 className="font-bold text-lg mb-2">24/7 Support</h3>
                <p className="text-slate-600 text-sm">We're here to help</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

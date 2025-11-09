'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollingBanner from '@/components/ScrollingBanner';
import ProductCard from '@/components/ProductCard';
import PageHero from '@/components/PageHero';
import Link from 'next/link';
import { Product, Category } from '@/types';
import { FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [expandedSections, setExpandedSections] = useState({
    brand: true,
    category: true,
    price: true,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize filters from URL on mount
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const brandParam = searchParams.get('brand');
    const searchParam = searchParams.get('search');
    const sortParam = searchParams.get('sort');
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');

    if (categoryParam) {
      setSelectedCategories(categoryParam.split(','));
    }
    if (brandParam) {
      setSelectedBrand(brandParam);
    }
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    if (sortParam) {
      setSortBy(sortParam);
    }
    if (minPriceParam || maxPriceParam) {
      setPriceRange({
        min: minPriceParam ? parseInt(minPriceParam) : 0,
        max: maxPriceParam ? parseInt(maxPriceParam) : 5000,
      });
    }
    
    setInitialized(true);
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    if (initialized) {
      updateURL();
      fetchProducts();
    }
  }, [selectedCategories, selectedBrand, searchQuery, sortBy, priceRange, initialized]);

  const updateURL = () => {
    const params = new URLSearchParams();
    
    if (selectedCategories.length > 0) {
      params.set('category', selectedCategories.join(','));
    }
    if (selectedBrand) {
      params.set('brand', selectedBrand);
    }
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    if (sortBy !== 'createdAt') {
      params.set('sort', sortBy);
    }
    if (priceRange.min > 0) {
      params.set('minPrice', priceRange.min.toString());
    }
    if (priceRange.max < 5000) {
      params.set('maxPrice', priceRange.max.toString());
    }

    const queryString = params.toString();
    const newUrl = queryString ? `/products?${queryString}` : '/products';
    router.push(newUrl, { scroll: false });
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/brands');
      const data = await res.json();
      if (data.success) {
        setBrands(data.brands);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      // Multiple categories
      if (selectedCategories.length > 0) {
        params.append('category', selectedCategories.join(','));
      }
      
      // Brand filter
      if (selectedBrand) {
        params.append('brand', selectedBrand);
      }
      
      // Search query
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      // Sort
      params.append('sort', sortBy);
      
      // Price range
      if (priceRange.min > 0) {
        params.append('minPrice', priceRange.min.toString());
      }
      if (priceRange.max < 5000) {
        params.append('maxPrice', priceRange.max.toString());
      }

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categorySlug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categorySlug)
        ? prev.filter((c) => c !== categorySlug)
        : [...prev, categorySlug]
    );
  };

  const handleBrandSelect = (brandSlug: string) => {
    setSelectedBrand(brandSlug === selectedBrand ? '' : brandSlug);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrand('');
    setSearchQuery('');
    setSortBy('createdAt');
    setPriceRange({ min: 0, max: 5000 });
  };

  return (
    <>
      <Header />
      <ScrollingBanner />
  <main className="min-h-screen bg-primary-100 pb-20">
        {/* Hero Banner */}
        <PageHero
          page="products"
          defaultEyebrow="Collections"
          defaultTitle="Explore The Various Collection of Poonam"
          defaultDescription="Discover our curated selection of premium beauty products designed for everyone. Find your perfect match from our extensive collection."
        />

        {/* Breadcrumb */}
  <div className="bg-white border-b border-slate-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Link href="/" className="hover:text-primary-600">Home</Link>
              <span>/</span>
              <span className="text-slate-900 font-medium">Products</span>
            </div>
          </div>
        </div>

  <div className="container mx-auto px-4 py-8 bg-primary-100 rounded-xl shadow-lg">
          <div className="flex gap-8">
            {/* Sidebar Filters */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                {/* Brand Filter */}
                <div className="mb-6 pb-6 border-b border-slate-200">
                  <button
                    onClick={() => toggleSection('brand')}
                    className="flex items-center justify-between w-full mb-4 font-semibold text-slate-900"
                  >
                    <span>Brand</span>
                    {expandedSections.brand ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  {expandedSections.brand && (
                    <div className="space-y-3">
                      {brands.map((brand) => (
                        <label key={brand._id} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="brand"
                            checked={selectedBrand === brand.slug}
                            onChange={() => handleBrandSelect(brand.slug)}
                            className="w-4 h-4 border-slate-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-slate-600 group-hover:text-slate-900 flex items-center gap-2">
                            {brand.logo && (
                              <img src={brand.logo} alt={brand.name} className="w-6 h-6 object-contain" />
                            )}
                            {brand.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection('category')}
                    className="flex items-center justify-between w-full mb-4 font-semibold text-slate-900"
                  >
                    <span>Category</span>
                    {expandedSections.category ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  {expandedSections.category && (
                    <div className="space-y-3">
                      {categories.map((category) => (
                        <label key={category._id} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category.slug)}
                            onChange={() => toggleCategory(category.slug)}
                            className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-slate-600 group-hover:text-slate-900">
                            {category.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Range */}
                <div className="mb-6 pb-6 border-b border-slate-200">
                  <button
                    onClick={() => toggleSection('price')}
                    className="flex items-center justify-between w-full mb-4 font-semibold text-slate-900"
                  >
                    <span>Price</span>
                    {expandedSections.price ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  {expandedSections.price && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs text-slate-500">Minimum Price: ₹{priceRange.min}</label>
                        <input
                          type="range"
                          min="0"
                          max="5000"
                          step="100"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) })}
                          className="w-full accent-primary-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-slate-500">Maximum Price: ₹{priceRange.max}</label>
                        <input
                          type="range"
                          min="0"
                          max="5000"
                          step="100"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                          className="w-full accent-primary-600"
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm font-medium text-slate-700">
                        <span>₹{priceRange.min}</span>
                        <span>-</span>
                        <span>₹{priceRange.max}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Clear Filters */}
                {(selectedCategories.length > 0 || priceRange.min > 0 || priceRange.max < 5000 || searchQuery) && (
                  <button
                    onClick={clearFilters}
                    className="w-full py-2 px-4 border border-slate-300 rounded-full text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden btn-outline py-2 px-4"
                  >
                    Filters
                  </button>
                  <div className="flex items-center gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="createdAt">Newest First</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="name-asc">Name: A-Z</option>
                      <option value="name-desc">Name: Z-A</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="px-4 py-2 border border-slate-200 rounded-full text-sm w-48 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <span className="text-sm text-slate-500">
                    {products.length} items
                  </span>
                </div>
              </div>

              {/* Active Filters */}
              {(selectedCategories.length > 0 || selectedBrand || priceRange.min > 0 || priceRange.max < 5000) && (
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="text-sm font-medium text-slate-700">Active Filters:</span>
                  
                  {selectedBrand && (
                    <button
                      onClick={() => setSelectedBrand('')}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm flex items-center gap-2"
                    >
                      Brand: {brands.find(b => b.slug === selectedBrand)?.name}
                      <FiX size={14} />
                    </button>
                  )}
                  
                  {selectedCategories.map((categorySlug) => {
                    const category = categories.find(c => c.slug === categorySlug);
                    return (
                      <button
                        key={categorySlug}
                        onClick={() => toggleCategory(categorySlug)}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm hover:bg-primary-200 transition"
                      >
                        {category?.name}
                        <FiX size={14} />
                      </button>
                    );
                  })}
                  
                  {(priceRange.min > 0 || priceRange.max < 5000) && (
                    <button
                      onClick={() => setPriceRange({ min: 0, max: 5000 })}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm hover:bg-primary-200 transition"
                    >
                      ₹{priceRange.min} - ₹{priceRange.max}
                      <FiX size={14} />
                    </button>
                  )}
                  
                  <button
                    onClick={clearFilters}
                    className="text-sm text-slate-500 hover:text-slate-700"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* Products Grid */}
              {loading ? (
                <div className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-primary-600"></div>
                  <p className="mt-4 text-slate-500">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">📦</div>
                  <h2 className="text-2xl font-semibold mb-2 text-slate-800">No products found</h2>
                  <p className="text-slate-500">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <button onClick={() => setSidebarOpen(false)} className="p-2">
                  <FiX size={24} />
                </button>
              </div>

              {/* Mobile Brand Filter */}
              <div className="mb-6 pb-6 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-4">Brand</h3>
                <div className="space-y-3">
                  {brands.map((brand) => (
                    <label key={brand._id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="mobile-brand"
                        checked={selectedBrand === brand.slug}
                        onChange={() => handleBrandSelect(brand.slug)}
                        className="w-4 h-4 border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-slate-600 flex items-center gap-2">
                        {brand.logo && (
                          <img src={brand.logo} alt={brand.name} className="w-6 h-6 object-contain" />
                        )}
                        {brand.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mobile Category Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-slate-900 mb-4">Category</h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <label key={category._id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.slug)}
                        onChange={() => toggleCategory(category.slug)}
                        className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-slate-600">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mobile Price Filter */}
              <div className="mb-6 pb-6 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-4">Price</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs text-slate-500">Minimum Price: ₹{priceRange.min}</label>
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) })}
                      className="w-full accent-primary-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-500">Maximum Price: ₹{priceRange.max}</label>
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                      className="w-full accent-primary-600"
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm font-medium text-slate-700">
                    <span>₹{priceRange.min}</span>
                    <span>-</span>
                    <span>₹{priceRange.max}</span>
                  </div>
                </div>
              </div>

              {/* Mobile Action Buttons */}
              <div className="space-y-3">
                {(selectedCategories.length > 0 || priceRange.min > 0 || priceRange.max < 5000) && (
                  <button
                    onClick={() => {
                      clearFilters();
                      setSidebarOpen(false);
                    }}
                    className="w-full py-3 border border-slate-300 rounded-full text-sm font-medium text-slate-700"
                  >
                    Clear All Filters
                  </button>
                )}
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-full btn-primary py-3"
                >
                  Show {products.length} Results
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

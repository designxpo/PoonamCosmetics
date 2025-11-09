'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FiEye, FiRefreshCw } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';

export default function PreviewPage() {
  const [activeTab, setActiveTab] = useState<'banners' | 'plp' | 'pdp'>('banners');
  const [banners, setBanners] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (banners.length > 0) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [banners]);

  const fetchData = async () => {
    try {
      const [bannersRes, productsRes] = await Promise.all([
        fetch('/api/banners'),
        fetch('/api/products?limit=20'),
      ]);

      const bannersData = await bannersRes.json();
      const productsData = await productsRes.json();

      if (bannersData.success) {
        setBanners(bannersData.banners.filter((b: any) => b.isActive));
      }

      if (productsData.success) {
        setProducts(productsData.products);
        if (productsData.products.length > 0) {
          setSelectedProduct(productsData.products[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'banners' as const, label: 'Hero Banners', icon: '🎨' },
    { id: 'plp' as const, label: 'Product Grid (PLP)', icon: '🛍️' },
    { id: 'pdp' as const, label: 'Product Details (PDP)', icon: '📦' },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-slate-900"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Preview</h1>
            <p className="text-slate-600 mt-1">See how your content looks on the website</p>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-sm hover:bg-slate-800"
          >
            <FiRefreshCw size={18} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-slate-900 border-b-2 border-slate-900'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Hero Banners Preview */}
        {activeTab === 'banners' && (
          <div className="space-y-4">
            <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Homepage Hero Carousel</h2>
                <span className="text-sm text-slate-600">
                  {banners.length} Active Banner{banners.length !== 1 ? 's' : ''}
                </span>
              </div>

              {banners.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <p>No active banners found</p>
                  <Link href="/admin/banners" className="text-primary-600 mt-2 inline-block">
                    Add Banners
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Carousel Preview */}
                  <div className="relative h-[400px] bg-slate-100 rounded-sm overflow-hidden">
                    {banners.map((banner, index) => (
                      <div
                        key={banner._id}
                        className={`absolute inset-0 transition-opacity duration-500 ${
                          index === currentBannerIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <img
                          src={banner.image}
                          alt={banner.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                          <div className="text-center text-white px-4">
                            <h2 className="text-4xl font-bold mb-4">{banner.title}</h2>
                            <p className="text-xl mb-6">{banner.subtitle}</p>
                            {banner.ctaText && (
                              <button className="bg-white text-slate-900 px-8 py-3 rounded-sm font-semibold hover:bg-slate-100">
                                {banner.ctaText}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Carousel Indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {banners.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentBannerIndex(index)}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            index === currentBannerIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* All Banners List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {banners.map((banner, index) => (
                      <div key={banner._id} className="border border-slate-200 rounded-sm overflow-hidden">
                        <div className="relative h-40">
                          <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4 bg-slate-50">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-slate-900">{banner.title}</h3>
                            <span className="text-xs bg-slate-200 px-2 py-1 rounded-sm">#{index + 1}</span>
                          </div>
                          <p className="text-sm text-slate-600">{banner.subtitle}</p>
                          {banner.ctaText && (
                            <div className="mt-2 text-xs text-slate-500">
                              Button: <span className="font-medium">{banner.ctaText}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Product Listing Page (PLP) Preview */}
        {activeTab === 'plp' && (
          <div className="space-y-4">
            <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Product Grid View</h2>
                <span className="text-sm text-slate-600">
                  Showing {products.length} Product{products.length !== 1 ? 's' : ''}
                </span>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <p>No products found</p>
                  <Link href="/admin/products/new" className="text-primary-600 mt-2 inline-block">
                    Add Products
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.slice(0, 12).map((product) => (
                    <div
                      key={product._id}
                      className="group border border-slate-200 rounded-sm overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedProduct(product);
                        setActiveTab('pdp');
                      }}
                    >
                      <div className="relative h-64 bg-slate-100">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            No Image
                          </div>
                        )}
                        {product.featured && (
                          <span className="absolute top-2 left-2 bg-yellow-400 text-slate-900 text-xs font-bold px-2 py-1 rounded-sm">
                            Featured
                          </span>
                        )}
                        {product.stock === 0 && (
                          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-sm">
                            Out of Stock
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2 group-hover:text-primary-600">
                          {product.name}
                        </h3>
                        <p className="text-sm text-slate-600 mb-2 line-clamp-1">
                          {product.category?.name || 'Uncategorized'}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-slate-900">₹{product.price}</span>
                          {product.stock > 0 && product.stock < 10 && (
                            <span className="text-xs text-orange-600">Only {product.stock} left</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Product Detail Page (PDP) Preview */}
        {activeTab === 'pdp' && (
          <div className="space-y-4">
            <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Product Detail View</h2>
                <select
                  value={selectedProduct?._id || ''}
                  onChange={(e) => {
                    const product = products.find(p => p._id === e.target.value);
                    setSelectedProduct(product);
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-sm focus:ring-2 focus:ring-primary-500"
                >
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              {!selectedProduct ? (
                <div className="text-center py-12 text-slate-500">
                  <p>Select a product to preview</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Product Images */}
                  <div className="space-y-4">
                    <div className="relative h-[500px] bg-slate-100 rounded-sm overflow-hidden">
                      {selectedProduct.images?.[0] ? (
                        <img
                          src={selectedProduct.images[0]}
                          alt={selectedProduct.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          No Image
                        </div>
                      )}
                    </div>
                    {selectedProduct.images?.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {selectedProduct.images.slice(0, 4).map((img: string, index: number) => (
                          <div key={index} className="relative h-24 bg-slate-100 rounded-sm overflow-hidden border-2 border-slate-200 hover:border-slate-900 cursor-pointer">
                            <img src={img} alt={`${selectedProduct.name} ${index + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {selectedProduct.featured && (
                          <span className="bg-yellow-400 text-slate-900 text-xs font-bold px-2 py-1 rounded-sm">
                            Featured
                          </span>
                        )}
                        <span className="text-sm text-slate-600">{selectedProduct.category?.name}</span>
                      </div>
                      <h1 className="text-3xl font-bold text-slate-900 mb-2">{selectedProduct.name}</h1>
                      <div className="flex items-baseline gap-4 mb-4">
                        <span className="text-3xl font-bold text-slate-900">₹{selectedProduct.price}</span>
                      </div>
                    </div>

                    {/* Stock Status */}
                    <div>
                      {selectedProduct.stock === 0 ? (
                        <span className="inline-block bg-red-100 text-red-800 px-4 py-2 rounded-sm font-medium">
                          Out of Stock
                        </span>
                      ) : selectedProduct.stock < 10 ? (
                        <span className="inline-block bg-orange-100 text-orange-800 px-4 py-2 rounded-sm font-medium">
                          Only {selectedProduct.stock} left in stock
                        </span>
                      ) : (
                        <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-sm font-medium">
                          In Stock ({selectedProduct.stock} available)
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {selectedProduct.description && (
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Description</h3>
                        <p className="text-slate-600 leading-relaxed">{selectedProduct.description}</p>
                      </div>
                    )}

                    {/* Add to Cart Button */}
                    <div className="space-y-3">
                      <button
                        disabled={selectedProduct.stock === 0}
                        className={`w-full py-4 rounded-sm font-semibold text-lg transition-colors ${
                          selectedProduct.stock === 0
                            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        {selectedProduct.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                      <button className="w-full py-4 border-2 border-slate-900 text-slate-900 rounded-sm font-semibold text-lg hover:bg-slate-50">
                        Buy Now
                      </button>
                    </div>

                    {/* Product Meta */}
                    <div className="border-t border-slate-200 pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">SKU:</span>
                        <span className="text-slate-900 font-medium">{selectedProduct.slug}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Category:</span>
                        <span className="text-slate-900 font-medium">{selectedProduct.category?.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Status:</span>
                        <span className="text-slate-900 font-medium">
                          {selectedProduct.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
          <div className="flex items-start gap-3">
            <FiEye className="text-blue-600 mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Preview Information</h3>
              <p className="text-sm text-blue-700">
                This preview shows how your content appears on the live website. Changes made in the admin panel 
                will be reflected here after saving and refreshing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

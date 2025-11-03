'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { Product } from '@/types';
import AddToCartButton from '@/components/AddToCartButton';
import ProductCard from '@/components/ProductCard';
import { FiStar, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(
      `/api/products/${slug}`,
      { cache: 'no-store' }
    );
    
    if (!res.ok) return null;
    
    const data = await res.json();
    return data.success ? data.product : null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

async function getSimilarProducts(categoryId: string, currentProductId: string): Promise<Product[]> {
  try {
    // First try to get products from the same category
    const res = await fetch(
      `/api/products?limit=20`,
      { cache: 'no-store' }
    );
    
    if (!res.ok) return [];
    
    const data = await res.json();
    if (!data.success) return [];
    
    // Filter products by same category and exclude current product
    const sameCategoryProducts = data.products.filter((p: Product) => {
      const pCategoryId = typeof p.category === 'object' ? p.category._id : p.category;
      return pCategoryId === categoryId && p._id !== currentProductId;
    });
    
    // If we have enough products from same category, return them
    if (sameCategoryProducts.length >= 4) {
      return sameCategoryProducts.slice(0, 4);
    }
    
    // Otherwise, mix same category products with others
    const otherProducts = data.products.filter((p: Product) => {
      const pCategoryId = typeof p.category === 'object' ? p.category._id : p.category;
      return pCategoryId !== categoryId && p._id !== currentProductId;
    });
    
    // Combine same category products with others to make 4
    const combined = [...sameCategoryProducts, ...otherProducts];
    return combined.slice(0, 4);
    
  } catch (error) {
    console.error('Error fetching similar products:', error);
    return [];
  }
}

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    loadProductData();
  }, [params.slug]);

  const loadProductData = async () => {
    setLoading(true);
    setNotFoundError(false);
    const productData = await getProduct(params.slug);
    
    console.log('Product data received:', productData);
    
    if (!productData) {
      setNotFoundError(true);
      setLoading(false);
      return;
    }
    
    setProduct(productData);
    
    // Load similar products
    const categoryId = typeof productData.category === 'object' 
      ? productData.category._id 
      : productData.category;
    const similar = await getSimilarProducts(categoryId, productData._id);
    setSimilarProducts(similar);
    setLoading(false);
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-slate-50 pb-20">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-slate-900"></div>
              <p className="mt-4 text-slate-500">Loading product...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (notFoundError || !product) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-slate-50 pb-20">
          <div className="container mx-auto px-4 py-12">
            <div className="rounded-sm border border-white/60 bg-white/90 backdrop-blur p-16 shadow-xl text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-3xl font-bold mb-4 text-slate-900">Product Not Found</h2>
              <p className="text-slate-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
              <Link href="/products" className="btn-primary inline-block">
                Browse All Products
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 pb-20">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Link href="/" className="hover:text-primary-600">Home</Link>
              <span>/</span>
              <Link href="/products" className="hover:text-primary-600">Products</Link>
              <span>/</span>
              <span className="text-slate-900 font-medium">{product.name}</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Images */}
            <div>
              {/* Main Image */}
              <div className="relative aspect-square bg-slate-100 rounded-sm overflow-hidden mb-4 shadow-lg group">
                <Image
                  src={product.images[selectedImage] || '/placeholder.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority
                />
                {product.featured && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-block bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      SALE
                    </span>
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">Out of Stock</span>
                  </div>
                )}
              </div>
              
              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square bg-slate-100 rounded-sm overflow-hidden shadow cursor-pointer transition-all ${
                        selectedImage === index 
                          ? 'ring-2 ring-primary-600 ring-offset-2' 
                          : 'hover:ring-2 hover:ring-slate-300'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <p className="text-slate-600 text-sm uppercase tracking-[0.2em]">
                  {typeof product.category === 'object' ? product.category.name : 'Uncategorized'}
                </p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className={`w-4 h-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                  ))}
                  <span className="text-sm text-slate-600 ml-2">(4.5) 127 reviews</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-slate-900">{product.name}</h1>

              {/* Price */}
              <div className="flex items-center gap-4">
                <p className="text-5xl font-bold text-primary-600">₹{product.price.toFixed(2)}</p>
                {product.featured && (
                  <div className="flex flex-col">
                    <span className="text-slate-400 line-through text-xl">
                      ₹{(product.price * 1.4).toFixed(2)}
                    </span>
                    <span className="text-green-600 font-semibold text-sm">Save 30%</span>
                  </div>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  product.stock > 10 
                    ? 'bg-green-100 text-green-700' 
                    : product.stock > 0 
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {product.stock > 10 
                    ? `${product.stock} in stock` 
                    : product.stock > 0 
                    ? `Only ${product.stock} left!`
                    : 'Out of stock'}
                </span>
              </div>

              {/* Description */}
              <div className="rounded-none bg-slate-50 p-6">
                <h2 className="text-xl font-semibold mb-3 text-slate-900">About this product</h2>
                {product.description ? (
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">{product.description}</p>
                ) : (
                  <p className="text-slate-500 italic">No description available for this product.</p>
                )}
              </div>

              {/* Add to Cart */}
              <div className="pt-4">
                <AddToCartButton product={product} />
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200">
                <div className="flex items-start gap-3">
                  <div className="text-primary-600 mt-1">
                    <FiTruck size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Free Delivery</h4>
                    <p className="text-sm text-slate-600">On orders above ₹999</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-primary-600 mt-1">
                    <FiShield size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">100% Authentic</h4>
                    <p className="text-sm text-slate-600">Genuine products</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-primary-600 mt-1">
                    <FiRefreshCw size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Easy Returns</h4>
                    <p className="text-sm text-slate-600">7-day return policy</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-secondary-600 mt-1 text-2xl">
                    💬
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">WhatsApp Support</h4>
                    <p className="text-sm text-slate-600">24/7 assistance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Products Section */}
          {similarProducts.length > 0 && (
            <section className="mt-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    {typeof product.category === 'object' 
                      ? `More from ${product.category.name}` 
                      : 'You May Also Like'}
                  </h2>
                  <p className="text-slate-600">Discover similar products handpicked for you</p>
                </div>
                <Link 
                  href={`/products${typeof product.category === 'object' ? `?category=${product.category.slug}` : ''}`}
                  className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-2 group"
                >
                  <span>View All</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProducts.map((similarProduct) => (
                  <ProductCard key={similarProduct._id} product={similarProduct} />
                ))}
              </div>

              {/* Why Choose These Products */}
              <div className="mt-8 rounded-none bg-gradient-to-r from-primary-50 to-secondary-50 p-6 border border-primary-100">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">✨</div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Perfect Combinations</h3>
                    <p className="text-sm text-slate-600">
                      These products work beautifully together and are loved by customers who purchased {product.name}. 
                      Complete your beauty routine with our curated selections.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

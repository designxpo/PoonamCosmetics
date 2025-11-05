'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { FiStar, FiHeart, FiShoppingCart, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaFacebookF, FaPinterestP, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

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
  const addToCart = useCartStore((state) => state.addItem);
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'additional' | 'review'>('description');
  const [selectedColor, setSelectedColor] = useState<string>('Brown');
  const [selectedSize, setSelectedSize] = useState<string>('XXL');

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

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/placeholder.jpg',
      quantity: quantity,
      stock: product.stock,
    });
    toast.success(`${quantity} ${quantity > 1 ? 'items' : 'item'} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (product && quantity < product.stock) setQuantity(quantity + 1);
  };

  // Get colors from product or use defaults
  const colors = product?.pdpFeatures?.availableColors?.length 
    ? product.pdpFeatures.availableColors.map(color => {
        const colorMap: Record<string, string> = {
          'Brown': '#8B4513',
          'Green': '#2E8B57',
          'Red': '#DC143C',
          'Blue': '#4682B4',
          'Black': '#000000',
          'White': '#FFFFFF',
          'Pink': '#FFC0CB',
          'Purple': '#800080',
          'Orange': '#FF8C00',
          'Yellow': '#FFD700',
        };
        return { name: color, value: colorMap[color] || '#666666' };
      })
    : [
        { name: 'Brown', value: '#8B4513' },
        { name: 'Green', value: '#2E8B57' },
        { name: 'Red', value: '#DC143C' },
        { name: 'Blue', value: '#4682B4' },
      ];

  // Get sizes from product or use defaults
  const sizes = product?.pdpFeatures?.availableSizes?.length 
    ? product.pdpFeatures.availableSizes 
    : ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      name: 'Kristin Watson',
      verified: true,
      rating: 5.0,
      date: '1 month ago',
      title: 'Love It: My Recent Clothing Purchase',
      content: 'I recently picked up some new clothes and I have to say, I\'m loving them! From the fit to the fabric, everything about these pieces is just perfect. They\'re comfortable, stylish, and exactly what I was looking for.',
      images: ['/images/review-1.jpg', '/images/review-2.jpg', '/images/review-3.jpg'],
    },
    {
      id: 2,
      name: 'Bessie Cooper',
      verified: true,
      rating: 5.0,
      date: '2 month ago',
      title: 'Excellent Product, I like it!!',
      content: 'I recently treated myself to some new clothes, and I couldn\'t be happier with my purchase! The fit is spot-on, and the fabric feels amazing against my skin. These pieces are not only comfortable but incredibly stylish as well. They\'re exactly what I\'ve been searching for in my wardrobe',
      images: [],
    },
    {
      id: 3,
      name: 'Darlene Robertson',
      verified: true,
      rating: 5.0,
      date: '1 week ago',
      title: 'Great quality!',
      content: 'The quality is excellent and the design is beautiful. Highly recommend!',
      images: [],
    },
  ];

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
      <main className="min-h-screen bg-white pb-20">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-200">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Link href="/" className="hover:text-slate-900">Home</Link>
              <span>/</span>
              <Link href="/shop" className="hover:text-slate-900">Shop</Link>
              <span>/</span>
              <Link href="/category/coats" className="hover:text-slate-900">
                {typeof product.category === 'object' ? product.category.name : 'Coats'}
              </Link>
              <span>/</span>
              <span className="text-slate-900 font-medium">Product Details</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-6 mb-2">Product Details</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Images */}
            <div className="relative">
              {/* Main Image */}
              <div className="relative aspect-[3/4] bg-slate-100 rounded-none overflow-hidden mb-4">
                <Image
                  src={product.images[selectedImage] || '/placeholder.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Image Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(selectedImage === 0 ? product.images.length - 1 : selectedImage - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                    >
                      <FiChevronLeft className="w-6 h-6 text-slate-900" />
                    </button>
                    <button
                      onClick={() => setSelectedImage(selectedImage === product.images.length - 1 ? 0 : selectedImage + 1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                    >
                      <FiChevronRight className="w-6 h-6 text-slate-900" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-[3/4] bg-slate-100 rounded-none overflow-hidden cursor-pointer transition-all ${
                        selectedImage === index 
                          ? 'ring-2 ring-slate-900' 
                          : 'opacity-60 hover:opacity-100'
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
              {/* Category Label */}
              <div>
                <p className="text-slate-500 text-sm uppercase mb-2">
                  {typeof product.category === 'object' ? product.category.name : 'Coats'}
                </p>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">{product.name}</h2>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className={`w-4 h-4 ${i < 4 ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                  ))}
                </div>
                <span className="text-sm font-semibold text-slate-900">4.8 (245 Review)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <p className="text-4xl font-bold text-slate-900">₹{product.price.toFixed(2)}</p>
                {product.featured && (
                  <span className="text-xl text-slate-400 line-through">
                    ₹{(product.price * 1.4).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="text-slate-600 leading-relaxed">
                {product.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}
              </div>

              {/* Color Selection - Conditional */}
              {product.pdpFeatures?.showColorSelector && colors.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-slate-900 font-semibold">Color :</span>
                    <span className="text-slate-600">{selectedColor}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          selectedColor === color.name 
                            ? 'border-slate-900 scale-110' 
                            : 'border-slate-300 hover:border-slate-400'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection - Conditional */}
              {product.pdpFeatures?.showSizeSelector && sizes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900 font-semibold">Size :</span>
                      <span className="text-slate-600">{selectedSize}</span>
                    </div>
                    <button className="text-slate-600 text-sm underline hover:text-slate-900">
                      View Size Guide
                    </button>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-2 rounded-none border transition-all font-medium ${
                          selectedSize === size 
                          ? 'bg-amber-400 border-amber-400 text-slate-900' 
                          : 'bg-white border-slate-300 text-slate-700 hover:border-slate-900'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Clear / Stock Status */}
              <div className="flex items-center gap-4">
                <button className="text-slate-600 text-sm hover:text-slate-900 flex items-center gap-2">
                  <span>Clear</span>
                  <span className="text-slate-400">✕</span>
                </button>
                {product.stock > 0 && (
                  <span className="px-4 py-1 bg-green-50 text-green-700 text-sm rounded-full font-medium">
                    In Stock
                  </span>
                )}
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex items-center gap-4 pt-4">
                {/* Quantity Selector */}
                <div className="flex items-center border border-slate-300 rounded-none">
                  <button
                    onClick={decreaseQuantity}
                    className="px-4 py-3 hover:bg-slate-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="px-6 py-3 border-l border-r border-slate-300 font-semibold min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="px-4 py-3 hover:bg-slate-100 transition-colors"
                    disabled={product.stock <= quantity}
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-slate-900 text-white px-8 py-4 rounded-none font-semibold hover:bg-slate-800 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>

                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 bg-amber-400 text-slate-900 px-8 py-4 rounded-none font-semibold hover:bg-amber-500 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>

                {/* Wishlist Button */}
                <button className="p-4 border border-slate-300 rounded-none hover:bg-slate-50 transition-colors">
                  <FiHeart className="w-6 h-6 text-slate-700" />
                </button>
              </div>

              {/* Product Meta */}
              <div className="border-t border-slate-200 pt-6 space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-slate-900 min-w-[80px]">SKU :</span>
                  <span className="text-slate-600">CHIT9524SAAA</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-slate-900 min-w-[80px]">Tags :</span>
                  <span className="text-slate-600">
                    Woman, Coat, Fashion, Jacket
                  </span>
                </div>
                
                {/* Social Share - Conditional */}
                {product.pdpFeatures?.showSocialShare !== false && (
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-slate-900 min-w-[80px]">Share :</span>
                    <div className="flex items-center gap-3">
                      <button className="p-2 hover:bg-slate-100 rounded transition-colors">
                        <FaFacebookF className="w-4 h-4 text-slate-600" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded transition-colors">
                        <FaPinterestP className="w-4 h-4 text-slate-600" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded transition-colors">
                        <FaLinkedinIn className="w-4 h-4 text-slate-600" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded transition-colors">
                        <FaTwitter className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="border-t border-slate-200 mb-16">
            {/* Tab Navigation */}
            <div className="flex items-center gap-8 border-b border-slate-200">
              <button
                onClick={() => setActiveTab('description')}
                className={`py-4 px-2 font-medium transition-colors relative ${
                  activeTab === 'description' 
                    ? 'text-slate-900' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Description
                {activeTab === 'description' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />
                )}
              </button>
              
              {/* Additional Info Tab - Conditional */}
              {product.pdpFeatures?.showAdditionalInfo !== false && (
                <button
                  onClick={() => setActiveTab('additional')}
                  className={`py-4 px-2 font-medium transition-colors relative ${
                    activeTab === 'additional' 
                      ? 'text-slate-900' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Additional Information
                  {activeTab === 'additional' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />
                  )}
                </button>
              )}
              
              {/* Review Tab - Conditional */}
              {product.pdpFeatures?.showReviews !== false && (
                <button
                  onClick={() => setActiveTab('review')}
                  className={`py-4 px-2 font-medium transition-colors relative ${
                    activeTab === 'review' 
                      ? 'text-slate-900' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Review
                  {activeTab === 'review' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />
                  )}
                </button>
              )}
            </div>

            {/* Tab Content */}
            <div className="py-8">
              {activeTab === 'description' && (
                <div className="max-w-4xl">
                  <p className="text-slate-600 leading-relaxed mb-4">
                    {product.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'}
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                </div>
              )}

              {activeTab === 'additional' && product.pdpFeatures?.showAdditionalInfo !== false && (
                <div className="max-w-2xl">
                  <table className="w-full">
                    <tbody className="divide-y divide-slate-200">
                      {product.pdpFeatures?.customFeatures && product.pdpFeatures.customFeatures.length > 0 ? (
                        product.pdpFeatures.customFeatures.map((feature, index) => (
                          <tr key={index}>
                            <td className="py-3 text-slate-600 font-medium">{feature.label}</td>
                            <td className="py-3 text-slate-900">{feature.value}</td>
                          </tr>
                        ))
                      ) : (
                        <>
                          <tr>
                            <td className="py-3 text-slate-600 font-medium">Material</td>
                            <td className="py-3 text-slate-900">Premium Cotton Blend</td>
                          </tr>
                          <tr>
                            <td className="py-3 text-slate-600 font-medium">Weight</td>
                            <td className="py-3 text-slate-900">500g</td>
                          </tr>
                          <tr>
                            <td className="py-3 text-slate-600 font-medium">Dimensions</td>
                            <td className="py-3 text-slate-900">90 × 60 × 10 cm</td>
                          </tr>
                          <tr>
                            <td className="py-3 text-slate-600 font-medium">Care Instructions</td>
                            <td className="py-3 text-slate-900">Machine washable, tumble dry low</td>
                          </tr>
                          <tr>
                            <td className="py-3 text-slate-600 font-medium">Made In</td>
                            <td className="py-3 text-slate-900">India</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'review' && product.pdpFeatures?.showReviews !== false && (
                <div>
                  {/* Rating Summary */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Overall Rating */}
                    <div className="bg-slate-50 p-8 rounded-none text-center">
                      <div className="text-6xl font-bold text-slate-900 mb-2">4.8</div>
                      <div className="text-slate-600 mb-3">out of 5</div>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <div className="text-slate-500 text-sm">(107 Reviews)</div>
                    </div>

                    {/* Rating Breakdown */}
                    <div className="lg:col-span-2 space-y-3">
                      {[
                        { stars: 5, percentage: 85 },
                        { stars: 4, percentage: 10 },
                        { stars: 3, percentage: 3 },
                        { stars: 2, percentage: 1 },
                        { stars: 1, percentage: 1 },
                      ].map((item) => (
                        <div key={item.stars} className="flex items-center gap-4">
                          <span className="text-sm text-slate-600 min-w-[60px]">{item.stars} Star</span>
                          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-amber-400 rounded-full transition-all"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-slate-600 min-w-[40px] text-right">{item.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Review List */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-slate-900">Review List</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">Showing 1-4 of 24 results</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-6">
                      <p className="text-slate-600">Showing 1-4 of 24 results</p>
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-slate-600">Sort by :</label>
                        <select className="border border-slate-300 rounded px-3 py-1 text-sm">
                          <option>Newest</option>
                          <option>Highest Rating</option>
                          <option>Lowest Rating</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Individual Reviews */}
                  <div className="space-y-8">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-slate-200 pb-8 last:border-0">
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold flex-shrink-0">
                            {review.name.charAt(0)}
                          </div>

                          {/* Review Content */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-slate-900">{review.name}</span>
                                  {review.verified && (
                                    <span className="text-xs text-green-600">(Verified)</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                  <span>{review.date}</span>
                                </div>
                              </div>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <FiStar key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                ))}
                              </div>
                              <span className="text-sm font-semibold text-slate-900">{review.rating}</span>
                            </div>

                            {/* Review Title */}
                            <h4 className="font-semibold text-slate-900 mb-2">{review.title}</h4>

                            {/* Review Text */}
                            <p className="text-slate-600 leading-relaxed mb-4">{review.content}</p>

                            {/* Review Images */}
                            {review.images.length > 0 && (
                              <div className="flex items-center gap-3">
                                {review.images.map((img, idx) => (
                                  <div key={idx} className="relative w-20 h-20 bg-slate-100 rounded overflow-hidden">
                                    <Image
                                      src={img}
                                      alt={`Review image ${idx + 1}`}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

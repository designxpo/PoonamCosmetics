'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock > 0) {
      addItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images[0] || '/placeholder.jpg',
        stock: product.stock,
      });
      toast.success(`${product.name} added to cart!`);
    } else {
      toast.error('Product is out of stock!');
    }
  };

  // Mock rating (you can add this to your product schema later)
  const rating = 4.5;
  const reviewCount = Math.floor(Math.random() * 200) + 50;

  return (
    <div className="block group">
      <div className="bg-white rounded-lg overflow-hidden border border-stone-200 hover:shadow-xl transition-all duration-300">
        {/* Product Image */}
        <Link href={`/products/${product.slug}`} className="block relative aspect-square bg-stone-50 overflow-hidden">
          <Image
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Sale Badge */}
          {product.featured && (
            <div className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-4 py-1.5 tracking-wider">
              SALE
            </div>
          )}
          
          {/* Out of Stock Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
              <span className="text-stone-700 font-semibold text-sm">Out of Stock</span>
            </div>
          )}
        </Link>

        {/* Product Details */}
        <div className="p-4">
          {/* Category & Brand */}
          <Link href={`/products/${product.slug}`}>
            <div className="flex items-center gap-2 mb-1.5">
              <p className="text-xs text-stone-500">
                {typeof product.category === 'object' ? product.category.name : 'Cosmetics'}
              </p>
              {product.brand && typeof product.brand === 'object' && (
                <>
                  <span className="text-stone-300">•</span>
                  <div className="flex items-center gap-1">
                    {product.brand.logo && (
                      <img 
                        src={product.brand.logo} 
                        alt={product.brand.name} 
                        className="w-4 h-4 object-contain"
                      />
                    )}
                    <span className="text-xs text-stone-500">{product.brand.name}</span>
                  </div>
                </>
              )}
            </div>

            {/* Product Name */}
            <h3 className="text-base font-semibold text-stone-800 mb-2 line-clamp-2 group-hover:text-amber-700 transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  size={14}
                  className={i < Math.floor(rating) ? 'fill-amber-500 text-amber-500' : 'text-stone-300'}
                />
              ))}
              <span className="text-xs text-stone-500 ml-1">({reviewCount})</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl font-bold text-stone-900">₹{product.price}</span>
              {product.featured && (
                <span className="text-sm text-stone-400 line-through">₹{Math.floor(product.price * 1.4)}</span>
              )}
            </div>
          </Link>

          {/* Add to Cart Button - Always Visible */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-white text-stone-800 border-2 border-accent-500 py-2.5 rounded-none flex items-center justify-center gap-2 text-sm font-semibold disabled:bg-stone-200 disabled:border-stone-300 disabled:text-stone-400 disabled:cursor-not-allowed hover:bg-accent-500 hover:text-white hover:border-accent-500 transition-all duration-200"
          >
            <FiShoppingCart size={18} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}

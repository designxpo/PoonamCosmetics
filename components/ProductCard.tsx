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
    <Link href={`/products/${product.slug}`} className="block group">
      <div className="bg-white rounded-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Product Image */}
        <div className="relative aspect-square bg-slate-50 overflow-hidden">
          <Image
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Sale Badge */}
          {product.featured && (
            <div className="absolute top-3 left-3 bg-text-primary text-white text-xs font-semibold px-3 py-1 rounded-none">
              SALE
            </div>
          )}
          
          {/* Out of Stock Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <span className="text-slate-700 font-semibold text-sm">Out of Stock</span>
            </div>
          )}

          {/* Quick Add Button - Shows on Hover */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="absolute bottom-3 left-3 right-3 bg-white text-text-primary border-2 border-text-primary py-2 rounded-none opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium disabled:bg-secondary-400 disabled:cursor-not-allowed hover:bg-text-primary hover:text-white"
          >
            <FiShoppingCart size={16} />
            <span>Add to Cart</span>
          </button>
        </div>

        {/* Product Details */}
        <div className="p-4">
          {/* Category & Brand */}
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs text-slate-500">
              {typeof product.category === 'object' ? product.category.name : 'Cosmetics'}
            </p>
            {product.brand && typeof product.brand === 'object' && (
              <>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1">
                  {product.brand.logo && (
                    <img 
                      src={product.brand.logo} 
                      alt={product.brand.name} 
                      className="w-4 h-4 object-contain"
                    />
                  )}
                  <span className="text-xs text-slate-500">{product.brand.name}</span>
                </div>
              </>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-medium text-slate-900 mb-2 line-clamp-2 group-hover:text-slate-700">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                size={12}
                className={i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
              />
            ))}
            <span className="text-xs text-slate-500 ml-1">({reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-slate-900">₹{product.price}</span>
              {product.featured && (
                <span className="text-sm text-slate-400 line-through">₹{Math.floor(product.price * 1.4)}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

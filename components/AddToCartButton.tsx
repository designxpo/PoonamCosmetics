'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (product.stock > 0) {
      addItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images[0] || '/placeholder.jpg',
        stock: product.stock,
      });
      toast.success(`${quantity} ${product.name} added to cart!`);
      setQuantity(1);
    } else {
      toast.error('Product is out of stock!');
    }
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Quantity</label>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
            disabled={quantity <= 1}
          >
            <FiMinus size={20} />
          </button>
          <span className="text-2xl font-semibold w-12 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
            disabled={quantity >= product.stock}
          >
            <FiPlus size={20} />
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        className="w-full btn-primary flex items-center justify-center space-x-2 text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        <FiShoppingCart size={24} />
        <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
      </button>
    </div>
  );
}

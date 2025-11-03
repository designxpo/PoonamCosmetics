'use client';

import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';

export default function CartItem({ item }: { item: any }) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-sm shadow">
      <div className="relative w-20 h-20 flex-shrink-0">
        <Image
          src={item.image || '/placeholder.jpg'}
          alt={item.name}
          fill
          className="object-cover rounded"
        />
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-lg">{item.name}</h3>
        <p className="text-primary-600 font-bold">₹{item.price.toFixed(2)}</p>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
          className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          <FiMinus size={16} />
        </button>
        <span className="w-8 text-center font-semibold">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
          disabled={item.quantity >= item.stock}
          className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <FiPlus size={16} />
        </button>
      </div>

      <div className="text-right">
        <p className="font-bold text-lg">₹{(item.price * item.quantity).toFixed(2)}</p>
      </div>

      <button
        onClick={() => removeItem(item.productId)}
        className="text-red-500 hover:text-red-700 p-2"
      >
        <FiTrash2 size={20} />
      </button>
    </div>
  );
}

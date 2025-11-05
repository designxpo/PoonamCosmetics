'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api-client';

interface RatingDisplayProps {
  productId: string;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function RatingDisplay({
  productId,
  showCount = true,
  size = 'md',
  className = '',
}: RatingDisplayProps) {
  const [stats, setStats] = useState<{
    averageRating: number;
    totalReviews: number;
  } | null>(null);

  useEffect(() => {
    loadStats();
  }, [productId]);

  const loadStats = async () => {
    const response = await api.reviews.getStats(productId);
    if (response.success && response.data) {
      setStats((response.data as any).data);
    }
  };

  if (!stats || stats.totalReviews === 0) {
    return (
      <div className={`flex items-center gap-1 text-gray-400 ${className}`}>
        <span className="text-sm">No reviews yet</span>
      </div>
    );
  }

  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Stars */}
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.round(stats.averageRating);
          return (
            <svg
              key={star}
              className={`${sizes[size]} ${
                filled ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          );
        })}
      </div>

      {/* Rating Number */}
      <span className={`font-medium text-gray-900 ${textSizes[size]}`}>
        {stats.averageRating.toFixed(1)}
      </span>

      {/* Review Count */}
      {showCount && (
        <span className={`text-gray-500 ${textSizes[size]}`}>
          ({stats.totalReviews})
        </span>
      )}
    </div>
  );
}

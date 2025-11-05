'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api-client';

interface ReviewStatsProps {
  productId: string;
  className?: string;
}

interface Stats {
  averageRating: number;
  totalReviews: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export default function ReviewStats({ productId, className = '' }: ReviewStatsProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [productId]);

  const loadStats = async () => {
    setLoading(true);
    const response = await api.reviews.getStats(productId);
    if (response.success && response.data) {
      setStats((response.data as any).data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!stats || stats.totalReviews === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  const getPercentage = (count: number) => {
    return stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
  };

  return (
    <div className={`review-stats ${className}`}>
      {/* Average Rating */}
      <div className="flex items-center gap-6 mb-6 p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {stats.averageRating.toFixed(1)}
          </div>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-6 h-6 ${
                  star <= Math.round(stats.averageRating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
          <div className="text-sm text-gray-600">
            {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-12">
                <span className="text-sm font-medium text-gray-700">{rating}</span>
                <svg
                  className="w-4 h-4 text-yellow-400 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
                  style={{ width: `${getPercentage(stats.distribution[rating as keyof typeof stats.distribution])}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-12 text-right">
                {stats.distribution[rating as keyof typeof stats.distribution]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

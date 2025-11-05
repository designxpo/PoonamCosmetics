'use client';

import { useState } from 'react';
import ReviewStats from './ReviewStats';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';

interface ProductReviewsProps {
  productId: string;
  className?: string;
}

export default function ProductReviews({ productId, className = '' }: ProductReviewsProps) {
  const [activeTab, setActiveTab] = useState<'reviews' | 'write'>('reviews');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleReviewSuccess = () => {
    setActiveTab('reviews');
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className={`product-reviews ${className}`}>
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Customer Reviews & Ratings
        </h2>
        <p className="text-gray-600">
          Read what our customers have to say about this product
        </p>
      </div>

      {/* Review Statistics */}
      <ReviewStats productId={productId} className="mb-8" />

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex gap-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'reviews'
                ? 'border-pink-600 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Reviews
          </button>
          <button
            onClick={() => setActiveTab('write')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'write'
                ? 'border-pink-600 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Write a Review
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'reviews' ? (
          <ReviewList key={refreshKey} productId={productId} limit={10} />
        ) : (
          <div className="max-w-3xl">
            <ReviewForm productId={productId} onSuccess={handleReviewSuccess} />
          </div>
        )}
      </div>
    </div>
  );
}

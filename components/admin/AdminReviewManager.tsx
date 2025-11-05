'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api-client';

interface Review {
  _id: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
  status: 'pending' | 'approved' | 'rejected';
  user: {
    name: string;
    email: string;
  };
  product: {
    name: string;
    slug: string;
  };
  createdAt: string;
  adminResponse?: {
    message: string;
    respondedAt: string;
  };
}

export default function AdminReviewManager() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [responseText, setResponseText] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [filter]);

  const loadReviews = async () => {
    setLoading(true);
    const response = await api.reviews.getAll({
      status: filter,
      limit: 50,
      sort: '-createdAt',
    });

    if (response.success && response.data) {
      const data = response.data as any;
      setReviews(data.data || []);
    }
    setLoading(false);
  };

  const handleApprove = async (reviewId: string) => {
    setActionLoading(true);
    const response = await api.reviews.approve(reviewId);
    if (response.success) {
      loadReviews();
    }
    setActionLoading(false);
  };

  const handleReject = async (reviewId: string) => {
    setActionLoading(true);
    const response = await api.reviews.reject(reviewId);
    if (response.success) {
      loadReviews();
    }
    setActionLoading(false);
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    setActionLoading(true);
    const response = await api.reviews.delete(reviewId);
    if (response.success) {
      loadReviews();
      setSelectedReview(null);
    }
    setActionLoading(false);
  };

  const handleRespond = async (reviewId: string) => {
    if (!responseText.trim()) {
      alert('Please enter a response');
      return;
    }

    setActionLoading(true);
    const response = await api.reviews.respond(reviewId, responseText);
    if (response.success) {
      loadReviews();
      setSelectedReview(null);
      setResponseText('');
    }
    setActionLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="admin-review-manager">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Management</h1>
        <p className="text-gray-600">Manage customer reviews and ratings</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-6 py-3 font-medium text-sm capitalize transition-colors border-b-2 ${
              filter === status
                ? 'border-pink-600 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {status}
            {status === 'pending' && reviews.length > 0 && filter === 'pending' && (
              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                {reviews.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <svg
            className="animate-spin h-8 w-8 text-pink-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}

      {/* Reviews Grid */}
      {!loading && reviews.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 mx-auto text-gray-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No {filter} reviews</h3>
          <p className="text-gray-500">There are no {filter} reviews to display</p>
        </div>
      )}

      {!loading && reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Review Content */}
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(review.status)}`}>
                      {review.status}
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    {review.verified && (
                      <span className="text-xs text-green-600 font-medium">✓ Verified</span>
                    )}
                  </div>

                  {/* Product & User Info */}
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">{review.user.name}</span>
                      {' '}({review.user.email}) reviewed{' '}
                      <span className="font-medium text-gray-900">{review.product.name}</span>
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
                  </div>

                  {/* Review Content */}
                  <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                  <p className="text-gray-700 text-sm mb-3">{review.comment}</p>

                  {/* Admin Response */}
                  {review.adminResponse && (
                    <div className="mt-3 p-3 bg-pink-50 rounded border-l-4 border-pink-500">
                      <p className="text-xs font-semibold text-pink-900 mb-1">Your Response:</p>
                      <p className="text-sm text-pink-800">{review.adminResponse.message}</p>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span>👍 {review.helpful} helpful votes</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  {review.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(review._id)}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(review._id)}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  
                  {review.status === 'approved' && (
                    <button
                      onClick={() => setSelectedReview(review)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
                    >
                      Respond
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(review._id)}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded hover:bg-gray-700 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Response Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Respond to Review</h3>
            
            <div className="mb-4 p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-600 mb-2">
                <strong>{selectedReview.user.name}'s review:</strong>
              </p>
              <p className="text-sm font-semibold text-gray-900 mb-1">{selectedReview.title}</p>
              <p className="text-sm text-gray-700">{selectedReview.comment}</p>
            </div>

            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Enter your response to this review..."
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none mb-2"
            />
            <p className="text-xs text-gray-500 mb-4">{responseText.length}/500 characters</p>

            <div className="flex gap-3">
              <button
                onClick={() => handleRespond(selectedReview._id)}
                disabled={actionLoading || !responseText.trim()}
                className="px-6 py-2 bg-pink-600 text-white font-medium rounded hover:bg-pink-700 disabled:opacity-50"
              >
                {actionLoading ? 'Sending...' : 'Send Response'}
              </button>
              <button
                onClick={() => {
                  setSelectedReview(null);
                  setResponseText('');
                }}
                className="px-6 py-2 bg-gray-300 text-gray-700 font-medium rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

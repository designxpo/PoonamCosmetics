# 📝 Review System Documentation

Complete guide to the user review system for Poonam Cosmetics.

## Table of Contents
- [Overview](#overview)
- [Review Model](#review-model)
- [API Endpoints](#api-endpoints)
- [Usage Examples](#usage-examples)
- [Admin Review Management](#admin-review-management)
- [Frontend Integration](#frontend-integration)

---

## Overview

The review system allows authenticated users to:
- ✅ Rate products (1-5 stars)
- ✅ Write detailed reviews with title and comment
- ✅ Upload review images (up to 5)
- ✅ Mark other reviews as helpful
- ✅ Edit/delete their own reviews

Admins can:
- ✅ Approve/reject reviews
- ✅ Respond to reviews
- ✅ View all review statistics

### Key Features
- **One Review Per Product**: Each user can only review a product once
- **Review Moderation**: Reviews need approval before appearing publicly
- **Verified Purchases**: Reviews from users who purchased the product are marked as verified
- **Helpful Voting**: Users can mark reviews as helpful
- **Rating Statistics**: Automatic calculation of average ratings and distribution
- **Admin Responses**: Admins can respond to reviews

---

## Review Model

### Fields

```typescript
interface IReview {
  product: ObjectId;        // Product reference
  user: ObjectId;           // User reference
  rating: number;           // 1-5 stars
  title: string;            // Review title (max 100 chars)
  comment: string;          // Review comment (max 1000 chars)
  verified: boolean;        // Verified purchase badge
  helpful: number;          // Count of helpful votes
  helpfulBy: ObjectId[];    // Users who marked as helpful
  images: string[];         // User uploaded images (max 5)
  status: 'pending' | 'approved' | 'rejected';
  adminResponse?: {
    message: string;
    respondedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Indexes

```javascript
// Unique constraint: one review per user per product
{ product: 1, user: 1 } (unique)

// Query approved reviews by product
{ product: 1, status: 1, createdAt: -1 }
```

---

## API Endpoints

### 1. Get All Reviews

```http
GET /api/reviews
```

**Query Parameters:**
- `product` - Filter by product ID
- `user` - Filter by user ID
- `status` - Filter by status: `pending`, `approved`, `rejected`, `all` (default: `approved`)
- `rating` - Filter by rating (1-5)
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10)
- `sort` - Sort order: `-createdAt`, `helpful`, `rating` (default: `-createdAt`)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "product": {
        "_id": "...",
        "name": "Matte Red Lipstick",
        "slug": "matte-red-lipstick",
        "images": ["..."]
      },
      "user": {
        "_id": "...",
        "name": "Priya Sharma",
        "email": "priya@example.com"
      },
      "rating": 5,
      "title": "Absolutely love this product!",
      "comment": "This product exceeded my expectations...",
      "verified": true,
      "helpful": 12,
      "images": [],
      "status": "approved",
      "createdAt": "2025-11-05T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "pages": 5,
    "limit": 10
  }
}
```

### 2. Get Single Review

```http
GET /api/reviews/[id]
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "product": {...},
    "user": {...},
    "rating": 5,
    "title": "Great product!",
    "comment": "...",
    "verified": true,
    "helpful": 8,
    "status": "approved"
  }
}
```

### 3. Create Review (Authenticated)

```http
POST /api/reviews
```

**Request Body:**
```json
{
  "product": "690b71b5fed4a0fc19868f5b",
  "rating": 5,
  "title": "Amazing lipstick!",
  "comment": "This lipstick is incredible. The color is perfect and it lasts all day without fading.",
  "images": ["https://example.com/review-photo.jpg"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review submitted successfully. It will be visible after approval.",
  "data": {
    "_id": "...",
    "product": {...},
    "user": {...},
    "rating": 5,
    "status": "pending"
  }
}
```

**Error Cases:**
- `401` - Not authenticated
- `404` - Product not found
- `400` - Already reviewed this product

### 4. Update Review (Owner or Admin)

```http
PUT /api/reviews/[id]
```

**Request Body (User):**
```json
{
  "rating": 4,
  "title": "Updated title",
  "comment": "Updated comment",
  "images": ["..."]
}
```

**Request Body (Admin):**
```json
{
  "status": "approved",
  "adminResponse": "Thank you for your feedback!"
}
```

### 5. Delete Review (Owner or Admin)

```http
DELETE /api/reviews/[id]
```

**Response:**
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

### 6. Mark Review as Helpful (Authenticated)

```http
POST /api/reviews/[id]/helpful
```

**Response:**
```json
{
  "success": true,
  "message": "Review marked as helpful",
  "data": {
    "helpful": 13,
    "isMarkedByUser": true
  }
}
```

**Note:** This endpoint toggles helpful status. If already marked, it will unmark.

### 7. Get Product Review Statistics

```http
GET /api/reviews/stats/[productId]
```

**Response:**
```json
{
  "success": true,
  "data": {
    "averageRating": 4.5,
    "totalReviews": 23,
    "distribution": {
      "5": 15,
      "4": 5,
      "3": 2,
      "2": 1,
      "1": 0
    }
  }
}
```

---

## Usage Examples

### Frontend - Display Product Reviews

```typescript
import api from '@/lib/api-client';

// Get approved reviews for a product
const { data, error } = await api.reviews.getByProduct(
  productId,
  {
    status: 'approved',
    page: 1,
    limit: 10,
    sort: '-createdAt' // Latest first
  }
);

if (data) {
  const reviews = data.data;
  const pagination = data.pagination;
  
  // Display reviews...
}
```

### Frontend - Get Review Statistics

```typescript
// Get product rating stats
const { data } = await api.reviews.getStats(productId);

if (data) {
  const stats = data.data;
  console.log(`Average: ${stats.averageRating} ⭐`);
  console.log(`Total Reviews: ${stats.totalReviews}`);
  console.log(`5 stars: ${stats.distribution[5]}`);
}
```

### Frontend - Submit a Review

```typescript
// User submits a review
const { data, error } = await api.reviews.create({
  product: productId,
  rating: 5,
  title: "Excellent product!",
  comment: "I absolutely love this lipstick. The color is vibrant and it stays on all day.",
  images: [] // Optional
});

if (data) {
  alert(data.message); // "Review submitted successfully. It will be visible after approval."
} else {
  alert(error); // Handle error
}
```

### Frontend - Mark Review as Helpful

```typescript
// User clicks "Helpful" button
const { data } = await api.reviews.markHelpful(reviewId);

if (data) {
  console.log(`Helpful count: ${data.data.helpful}`);
  console.log(`Is marked: ${data.data.isMarkedByUser}`);
}
```

---

## Admin Review Management

### Approve a Review

```typescript
// Admin approves a pending review
await api.reviews.approve(reviewId);
```

### Reject a Review

```typescript
// Admin rejects a review
await api.reviews.reject(reviewId);
```

### Respond to a Review

```typescript
// Admin responds to a review
await api.reviews.respond(
  reviewId,
  "Thank you for your feedback! We're glad you loved the product."
);
```

### View Pending Reviews

```typescript
// Admin panel: Get all pending reviews
const { data } = await api.reviews.getAll({
  status: 'pending',
  page: 1,
  limit: 20
});

if (data) {
  const pendingReviews = data.data;
  // Display for admin approval...
}
```

---

## Frontend Integration

### Product Page Component

```tsx
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api-client';

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
    loadStats();
  }, [productId]);

  const loadReviews = async () => {
    const { data } = await api.reviews.getByProduct(productId, {
      status: 'approved',
      sort: '-createdAt',
      limit: 5
    });
    
    if (data) {
      setReviews(data.data);
    }
    setLoading(false);
  };

  const loadStats = async () => {
    const { data } = await api.reviews.getStats(productId);
    if (data) {
      setStats(data.data);
    }
  };

  const handleHelpful = async (reviewId) => {
    const { data } = await api.reviews.markHelpful(reviewId);
    if (data) {
      // Update UI
      loadReviews();
    }
  };

  if (loading) return <div>Loading reviews...</div>;

  return (
    <div className="reviews-section">
      {/* Rating Summary */}
      {stats && (
        <div className="rating-summary">
          <h3>Customer Reviews</h3>
          <div className="average-rating">
            <span className="rating">{stats.averageRating}</span>
            <span className="stars">{'⭐'.repeat(Math.round(stats.averageRating))}</span>
            <span className="total">{stats.totalReviews} reviews</span>
          </div>
          
          {/* Rating Distribution */}
          <div className="rating-distribution">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="rating-bar">
                <span>{rating} ⭐</span>
                <div className="bar">
                  <div 
                    className="fill" 
                    style={{ width: `${(stats.distribution[rating] / stats.totalReviews) * 100}%` }}
                  />
                </div>
                <span>{stats.distribution[rating]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review List */}
      <div className="review-list">
        {reviews.map(review => (
          <div key={review._id} className="review-card">
            <div className="review-header">
              <div className="user-info">
                <strong>{review.user.name}</strong>
                {review.verified && <span className="verified-badge">✓ Verified Purchase</span>}
              </div>
              <div className="rating">
                {'⭐'.repeat(review.rating)}
              </div>
            </div>
            
            <h4>{review.title}</h4>
            <p>{review.comment}</p>
            
            {review.images && review.images.length > 0 && (
              <div className="review-images">
                {review.images.map((img, i) => (
                  <img key={i} src={img} alt="Review" />
                ))}
              </div>
            )}
            
            <div className="review-footer">
              <button onClick={() => handleHelpful(review._id)}>
                👍 Helpful ({review.helpful})
              </button>
              <span className="date">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            {review.adminResponse && (
              <div className="admin-response">
                <strong>Response from Poonam Cosmetics:</strong>
                <p>{review.adminResponse.message}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Review Form Component

```tsx
'use client';

import { useState } from 'react';
import api from '@/lib/api-client';

export default function ReviewForm({ productId, onSuccess }) {
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const { data, error } = await api.reviews.create({
      product: productId,
      ...formData
    });

    if (data) {
      alert(data.message);
      setFormData({ rating: 5, title: '', comment: '' });
      onSuccess?.();
    } else {
      alert(error || 'Failed to submit review');
    }

    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h3>Write a Review</h3>
      
      <div className="form-group">
        <label>Rating</label>
        <div className="star-rating">
          {[5, 4, 3, 2, 1].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData({ ...formData, rating: star })}
              className={formData.rating >= star ? 'active' : ''}
            >
              ⭐
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Summarize your experience"
          required
          maxLength={100}
        />
      </div>

      <div className="form-group">
        <label>Review</label>
        <textarea
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          placeholder="Share your thoughts about this product"
          required
          maxLength={1000}
          rows={5}
        />
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
```

---

## Database Seeding

Run the seed script to populate sample reviews:

```bash
node scripts/seed-reviews.js
```

This will:
- Create 5 sample review users
- Generate 2-4 reviews per product
- Auto-approve all reviews (for demo)
- Update product review statistics
- Assign random helpful votes

---

## Best Practices

### For Users
1. ✅ Be honest and detailed in reviews
2. ✅ Include product photos if possible
3. ✅ Update review if experience changes
4. ✅ Mark helpful reviews to help others

### For Admins
1. ✅ Review all pending reviews daily
2. ✅ Respond to negative reviews professionally
3. ✅ Verify suspicious reviews
4. ✅ Monitor review quality and authenticity

### For Developers
1. ✅ Always check authentication before allowing review actions
2. ✅ Validate review data (rating 1-5, max lengths, etc.)
3. ✅ Update product stats after review changes
4. ✅ Implement rate limiting for review submission
5. ✅ Cache review statistics for better performance

---

## API Client Quick Reference

```typescript
import api from '@/lib/api-client';

// Get reviews
await api.reviews.getAll({ product: id, status: 'approved' });
await api.reviews.getByProduct(productId);
await api.reviews.getByUser(userId);
await api.reviews.getById(reviewId);
await api.reviews.getStats(productId);

// Create/Update/Delete
await api.reviews.create({ product, rating, title, comment });
await api.reviews.update(reviewId, data);
await api.reviews.delete(reviewId);

// Helpful voting
await api.reviews.markHelpful(reviewId);

// Admin actions
await api.reviews.approve(reviewId);
await api.reviews.reject(reviewId);
await api.reviews.respond(reviewId, message);
```

---

## Testing the System

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Seed sample reviews:**
   ```bash
   node scripts/seed-reviews.js
   ```

3. **Test endpoints:**
   - View reviews: `GET /api/reviews?product=<productId>`
   - Get stats: `GET /api/reviews/stats/<productId>`
   - Submit review: `POST /api/reviews` (requires auth)

4. **Login credentials:**
   - Admin: `admin@poonamcosmetics.com` / `admin123`
   - Review users: See seed script output for credentials

---

## Support

For questions or issues:
- Check the API documentation
- Review the model schema
- Test with sample data
- Contact development team

---

**Last Updated:** November 5, 2025

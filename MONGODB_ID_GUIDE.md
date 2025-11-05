# MongoDB ID Reference Guide

## 🎯 Understanding MongoDB IDs

MongoDB uses **ObjectId** as the default unique identifier for documents. ObjectIds are 12-byte values that look like this:
```
507f1f77bcf86cd799439011
```

---

## 📋 ID Types in Poonam Cosmetics

### 1. **Product IDs**
- **Field**: `_id` (ObjectId)
- **Alternative**: `slug` (string, unique)
- **Example**: `672a1b5c9d8e4f1a2b3c4d5e`

**When to use:**
- Use `slug` for URLs: `/products/red-lipstick`
- Use `_id` for internal operations, database queries

**API Routes:**
```
GET /api/products/[slug]          # By slug
PUT /api/products/[slug]          # By slug
DELETE /api/products/[slug]       # By slug
```

### 2. **Category IDs**
- **Field**: `_id` (ObjectId)
- **Alternative**: `slug` (string, unique)
- **Example**: `672a1b5c9d8e4f1a2b3c4d5f`

**API Routes:**
```
GET /api/categories/[id]          # By ID or slug
PUT /api/categories/[id]          # By ID or slug
DELETE /api/categories/[id]       # By ID or slug
```

### 3. **Brand IDs**
- **Field**: `_id` (ObjectId)
- **Alternative**: `slug` (string)
- **Example**: `672a1b5c9d8e4f1a2b3c4d60`

**API Routes:**
```
GET /api/admin/brands/[id]        # By ID only
PUT /api/admin/brands/[id]        # By ID only
DELETE /api/admin/brands/[id]     # By ID only
```

### 4. **Order IDs**
- **Field**: `_id` (ObjectId)
- **Alternative**: `orderNumber` (string, unique)
- **Example ID**: `672a1b5c9d8e4f1a2b3c4d61`
- **Example Order Number**: `ORD-1730823456789`

**API Routes:**
```
GET /api/orders?orderNumber=XXX&email=XXX   # By order number
GET /api/admin/orders/[id]                  # By ID
PUT /api/orders/[orderNumber]/cancel        # By order number
```

### 5. **User IDs**
- **Field**: `_id` (ObjectId)
- **Alternative**: `email` (string, unique)
- **Example**: `672a1b5c9d8e4f1a2b3c4d62`

### 6. **Banner IDs**
- **Field**: `_id` (ObjectId)
- **Example**: `672a1b5c9d8e4f1a2b3c4d63`

**API Routes:**
```
GET /api/banners/[id]
PUT /api/banners/[id]
DELETE /api/banners/[id]
```

### 7. **Page Banner IDs**
- **Field**: `_id` (ObjectId)
- **Alternative**: `page` (enum: 'products', 'about', 'contact')
- **Example**: `672a1b5c9d8e4f1a2b3c4d64`

**API Routes:**
```
GET /api/page-banners?page=products    # By page name
PUT /api/page-banners?page=products    # By page name
DELETE /api/page-banners?page=products # By page name
```

### 8. **Featured Collection IDs**
- **Field**: `_id` (ObjectId)
- **Example**: `672a1b5c9d8e4f1a2b3c4d65`

**API Routes:**
```
GET /api/featured-collections/[id]
PUT /api/featured-collections/[id]
DELETE /api/featured-collections/[id]
```

### 9. **Product Section IDs**
- **Field**: `_id` (ObjectId)
- **Example**: `672a1b5c9d8e4f1a2b3c4d66`

**API Routes:**
```
GET /api/product-sections/[id]
PUT /api/product-sections/[id]
DELETE /api/product-sections/[id]
```

---

## 🔍 How to Get IDs from MongoDB

### Method 1: Using MongoDB Compass
1. Open MongoDB Compass
2. Connect to your database
3. Navigate to your collection
4. Click on any document
5. Copy the `_id` value

### Method 2: Using API
```typescript
// Get all products and their IDs
const result = await api.products.getAll();
console.log(result.data.products.map(p => ({ id: p._id, name: p.name })));
```

### Method 3: Using Terminal/Scripts
```bash
# Run this script to get all product IDs
node scripts/get-product-ids.js
```

---

## 📝 Working with IDs in Frontend

### Fetching by ID
```typescript
import api from '@/lib/api-client';

// Get product by slug (recommended for URLs)
const product = await api.products.getBySlug('red-lipstick');

// Get category by ID
const category = await api.categories.getById('672a1b5c9d8e4f1a2b3c4d5f');

// Get order by order number (for users)
const order = await api.orders.getByOrderNumber('ORD-1730823456789', 'user@email.com');

// Get order by ID (for admin)
const order = await api.orders.getByIdAdmin('672a1b5c9d8e4f1a2b3c4d61');
```

### Updating by ID
```typescript
// Update product by slug
await api.products.update('red-lipstick', { price: 349 });

// Update category by ID
await api.categories.update('672a1b5c9d8e4f1a2b3c4d5f', { name: 'New Name' });

// Update banner by ID
await api.banners.update('672a1b5c9d8e4f1a2b3c4d63', { isActive: false });
```

### Deleting by ID
```typescript
// Delete product by slug
await api.products.delete('red-lipstick');

// Delete category by ID
await api.categories.delete('672a1b5c9d8e4f1a2b3c4d5f');

// Delete banner by ID
await api.banners.delete('672a1b5c9d8e4f1a2b3c4d63');
```

---

## 🗂️ ID Validation

### MongoDB ObjectId Format
- **Length**: 24 characters
- **Characters**: Hexadecimal (0-9, a-f)
- **Regex**: `/^[0-9a-fA-F]{24}$/`

### Validate ID in TypeScript
```typescript
function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// Usage
if (isValidObjectId('672a1b5c9d8e4f1a2b3c4d5f')) {
  // Valid MongoDB ObjectId
  const product = await api.products.getById(id);
} else {
  // Might be a slug
  const product = await api.products.getBySlug(id);
}
```

---

## 🎯 Best Practices

### 1. **Use Slugs for URLs**
✅ Good: `/products/red-lipstick`
❌ Bad: `/products/672a1b5c9d8e4f1a2b3c4d5e`

**Why?** SEO-friendly, human-readable, easier to share

### 2. **Use IDs for Internal Operations**
```typescript
// In admin panel, use IDs for operations
const deleteCategory = async (categoryId: string) => {
  await api.categories.delete(categoryId);
};

// In frontend URLs, use slugs
<Link href={`/products/${product.slug}`}>View Product</Link>
```

### 3. **Store IDs in Database References**
```typescript
// Order schema stores product IDs
{
  items: [{
    productId: '672a1b5c9d8e4f1a2b3c4d5e', // MongoDB ObjectId
    name: 'Red Lipstick',
    price: 299
  }]
}

// Featured Collection stores product IDs
{
  products: [
    '672a1b5c9d8e4f1a2b3c4d5e',
    '672a1b5c9d8e4f1a2b3c4d5f'
  ]
}
```

### 4. **Handle ID Not Found**
```typescript
const result = await api.products.getBySlug('non-existent');

if (!result.success) {
  // Handle 404 error
  console.error('Product not found');
  // Show error page or redirect
}
```

---

## 🔄 ID Relationships

### Product → Category
```typescript
{
  _id: '672a1b5c9d8e4f1a2b3c4d5e',
  name: 'Red Lipstick',
  category: 'lipstick', // Category slug, not ID
  // ...
}
```

### Order → Product
```typescript
{
  _id: '672a1b5c9d8e4f1a2b3c4d61',
  items: [{
    productId: '672a1b5c9d8e4f1a2b3c4d5e', // Product ID reference
    // ...
  }]
}
```

### Featured Collection → Products
```typescript
{
  _id: '672a1b5c9d8e4f1a2b3c4d65',
  products: [
    '672a1b5c9d8e4f1a2b3c4d5e', // Product IDs
    '672a1b5c9d8e4f1a2b3c4d5f'
  ]
}
```

---

## 📊 Common ID Operations

### Get All IDs from a Collection
```typescript
// Get all product IDs
const result = await api.products.getAll();
const productIds = result.data.products.map(p => p._id);
console.log('Product IDs:', productIds);
```

### Find by Multiple IDs
```typescript
// If you need to fetch multiple products by ID
const productIds = ['672a1b5c9d8e4f1a2b3c4d5e', '672a1b5c9d8e4f1a2b3c4d5f'];

// Note: You'll need to create a custom API endpoint for this
// Or fetch them one by one
const products = await Promise.all(
  productIds.map(id => api.products.getById(id))
);
```

### Check if ID Exists
```typescript
const checkProductExists = async (productId: string) => {
  const result = await api.products.getById(productId);
  return result.success;
};
```

---

## 🛠️ Helper Script to Get IDs

Create this script to easily get IDs from your database:

```javascript
// scripts/get-all-ids.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Brand from '../models/Brand.js';

dotenv.config({ path: '.env.local' });

async function getAllIds() {
  await mongoose.connect(process.env.MONGODB_URI);

  console.log('\n📦 PRODUCT IDS:');
  const products = await Product.find({}, '_id name slug');
  products.forEach(p => console.log(`${p.name} (${p.slug}): ${p._id}`));

  console.log('\n📂 CATEGORY IDS:');
  const categories = await Category.find({}, '_id name slug');
  categories.forEach(c => console.log(`${c.name} (${c.slug}): ${c._id}`));

  console.log('\n🏷️ BRAND IDS:');
  const brands = await Brand.find({}, '_id name slug');
  brands.forEach(b => console.log(`${b.name} (${b.slug}): ${b._id}`));

  await mongoose.connection.close();
}

getAllIds();
```

Run with:
```bash
node scripts/get-all-ids.js
```

---

## 🎓 Summary

| Resource | Primary ID | Alternative | Use Case |
|----------|-----------|-------------|----------|
| Product | `_id` | `slug` | URLs use slug, operations use ID |
| Category | `_id` | `slug` | URLs use slug, operations use ID |
| Brand | `_id` | `slug` | Operations use ID |
| Order | `_id` | `orderNumber` | Users use orderNumber, admin uses ID |
| User | `_id` | `email` | Authentication uses email |
| Banner | `_id` | - | Operations use ID |
| Page Banner | `_id` | `page` | Queries use page name |
| Collection | `_id` | - | Operations use ID |

**Key Takeaway**: Use slugs for user-facing URLs, use IDs for internal database operations! 🚀


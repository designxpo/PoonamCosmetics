# 🚀 API Usage Quick Start

## Step 1: View Your Data

Run this command to see all your IDs and data:
```bash
node scripts/get-all-ids.js
```

This will show you all products, categories, brands, orders, etc. with their IDs.

---

## Step 2: Basic Frontend Usage

### In Any Component:
```typescript
import api from '@/lib/api-client';

// Get all products
const products = await api.products.getAll();

// Get categories
const categories = await api.categories.getAll();

// Get brands
const brands = await api.brands.getAll();
```

---

## Step 3: Display Products on Homepage

```typescript
// app/page.tsx
import api from '@/lib/api-client';

export default async function HomePage() {
  const result = await api.products.getAll({ featured: true, limit: 8 });
  const products = result.success ? result.data.products : [];

  return (
    <div>
      <h2>Featured Products</h2>
      <div className="grid grid-cols-4 gap-4">
        {products.map(product => (
          <div key={product._id} className="product-card">
            <img src={product.images[0]} alt={product.name} />
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Step 4: Admin Panel - Manage Products

```typescript
'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api-client';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const result = await api.products.getAll();
    if (result.success) {
      setProducts(result.data.products);
    }
  };

  const handleDelete = async (slug) => {
    if (confirm('Delete this product?')) {
      const result = await api.products.delete(slug);
      if (result.success) {
        alert('Deleted!');
        loadProducts();
      }
    }
  };

  return (
    <div>
      <h2>Manage Products</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>₹{product.price}</td>
              <td>{product.category}</td>
              <td>
                <button onClick={() => handleDelete(product.slug)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## Step 5: Create New Product (Admin)

```typescript
'use client';
import { useState } from 'react';
import api from '@/lib/api-client';

export default function CreateProduct() {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: 0,
    category: 'lipstick',
    images: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await api.products.create(formData);
    
    if (result.success) {
      alert('Product created!');
      // Reset form or redirect
    } else {
      alert('Error: ' + result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Product Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
      <input
        type="text"
        placeholder="Slug"
        value={formData.slug}
        onChange={(e) => setFormData({...formData, slug: e.target.value})}
      />
      <input
        type="number"
        placeholder="Price"
        value={formData.price}
        onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
      />
      <button type="submit">Create Product</button>
    </form>
  );
}
```

---

## Step 6: Upload Images

```typescript
'use client';
import { useState } from 'react';
import api from '@/lib/api-client';

export default function ImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const result = await api.upload.uploadImage(file);
    
    if (result.success) {
      setImageUrl(result.data.url);
      alert('Image uploaded!');
    } else {
      alert('Upload failed: ' + result.error);
    }
    
    setUploading(false);
  };

  return (
    <div>
      <input 
        type="file" 
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      {imageUrl && <img src={imageUrl} alt="Uploaded" width="200" />}
    </div>
  );
}
```

---

## 📚 Need More Help?

Check these files:
- `API_ROUTES.md` - All available API endpoints
- `API_CLIENT_EXAMPLES.md` - More detailed examples
- `MONGODB_ID_GUIDE.md` - Working with IDs
- `INTEGRATION_SUMMARY.md` - Complete reference

---

## 🎯 Common Tasks

### Get Products by Category
```typescript
const result = await api.products.getAll({ category: 'lipstick' });
```

### Search Products
```typescript
const result = await api.products.getAll({ search: 'red' });
```

### Get Single Product
```typescript
const result = await api.products.getBySlug('red-lipstick');
```

### Update Product Price
```typescript
await api.products.update('red-lipstick', { price: 349 });
```

### Get User Orders
```typescript
const result = await api.orders.getUserOrders();
```

### Track Order (Guest)
```typescript
const result = await api.orders.getByOrderNumber('ORD-123', 'user@email.com');
```

---

## ✅ You're Ready!

Now you can:
- ✅ Fetch data from MongoDB
- ✅ Display products on your website
- ✅ Manage data in admin panel
- ✅ Upload images
- ✅ Handle orders

**Start by running:** `node scripts/get-all-ids.js` to see your data! 🚀

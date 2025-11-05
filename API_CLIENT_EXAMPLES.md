# API Client Usage Examples

## 📚 How to Use the API Client Library

Import the API client in your components:

```typescript
import api from '@/lib/api-client';
```

---

## 🛍️ Product Examples

### Fetch All Products
```typescript
'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api-client';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const result = await api.products.getAll({
        category: 'lipstick',
        limit: 20,
        page: 1
      });

      if (result.success) {
        setProducts(result.data.products);
      } else {
        console.error(result.error);
      }
      setLoading(false);
    }

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product._id}>{product.name}</div>
      ))}
    </div>
  );
}
```

### Fetch Single Product
```typescript
async function getProductDetails(slug: string) {
  const result = await api.products.getBySlug(slug);
  
  if (result.success) {
    return result.data.product;
  } else {
    console.error(result.error);
    return null;
  }
}
```

### Search Products
```typescript
const searchProducts = async (searchTerm: string) => {
  const result = await api.products.getAll({
    search: searchTerm,
    limit: 10
  });
  
  return result.success ? result.data.products : [];
};
```

### Create Product (Admin)
```typescript
const createProduct = async (productData: any) => {
  const result = await api.products.create({
    name: 'New Lipstick',
    slug: 'new-lipstick',
    description: 'Beautiful red lipstick',
    price: 299,
    category: 'lipstick',
    images: ['url1', 'url2'],
    featured: true,
    pdpFeatures: {
      showColorSelector: true,
      availableColors: ['Red', 'Pink', 'Purple'],
      showSizeSelector: false,
      availableSizes: [],
      showReviews: true,
      showSocialShare: true,
      showAdditionalInfo: true
    }
  });

  if (result.success) {
    console.log('Product created:', result.data.product);
    // Redirect or show success message
  } else {
    console.error('Error:', result.error);
  }
};
```

---

## 📂 Category Examples

### Fetch All Categories
```typescript
'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api-client';

export default function CategoryNav() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      const result = await api.categories.getAll();
      
      if (result.success) {
        setCategories(result.data.categories);
      }
    }

    fetchCategories();
  }, []);

  return (
    <nav>
      {categories.map(category => (
        <a key={category._id} href={`/products?category=${category.slug}`}>
          {category.name}
        </a>
      ))}
    </nav>
  );
}
```

### Create Category (Admin)
```typescript
const createCategory = async () => {
  const result = await api.categories.create({
    name: 'Eye Shadow',
    slug: 'eye-shadow',
    description: 'Beautiful eye shadow products',
    image: 'https://example.com/image.jpg'
  });

  if (result.success) {
    console.log('Category created:', result.data.category);
  }
};
```

---

## 🛒 Order Examples

### Create Order
```typescript
const placeOrder = async (cartItems: any[], userInfo: any) => {
  const orderData = {
    email: userInfo.email,
    phone: userInfo.phone,
    name: userInfo.name,
    items: cartItems.map(item => ({
      productId: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.images[0]
    })),
    totalAmount: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    shippingAddress: {
      street: userInfo.address.street,
      city: userInfo.address.city,
      state: userInfo.address.state,
      zip: userInfo.address.zip,
      country: 'India'
    },
    paymentMethod: 'COD'
  };

  const result = await api.orders.create(orderData);

  if (result.success) {
    console.log('Order placed:', result.data.order);
    // Clear cart, redirect to order confirmation
    return result.data.order;
  } else {
    console.error('Order failed:', result.error);
    return null;
  }
};
```

### Fetch User Orders
```typescript
'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api-client';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      const result = await api.orders.getUserOrders();
      
      if (result.success) {
        setOrders(result.data.orders);
      }
    }

    fetchOrders();
  }, []);

  return (
    <div>
      <h2>My Orders</h2>
      {orders.map(order => (
        <div key={order._id}>
          <p>Order #{order.orderNumber}</p>
          <p>Status: {order.status}</p>
          <p>Total: ₹{order.totalAmount}</p>
        </div>
      ))}
    </div>
  );
}
```

### Track Order (Guest)
```typescript
const trackOrder = async (orderNumber: string, email: string) => {
  const result = await api.orders.getByOrderNumber(orderNumber, email);
  
  if (result.success) {
    return result.data.order;
  } else {
    console.error('Order not found');
    return null;
  }
};
```

---

## 👤 User Examples

### Register User
```typescript
const handleRegister = async (formData: any) => {
  const result = await api.users.register({
    email: formData.email,
    password: formData.password,
    name: formData.name,
    phone: formData.phone
  });

  if (result.success) {
    console.log('User registered:', result.data.user);
    // Redirect to login or dashboard
  } else {
    console.error('Registration failed:', result.error);
  }
};
```

### Login User
```typescript
const handleLogin = async (email: string, password: string) => {
  const result = await api.users.login({ email, password });

  if (result.success) {
    console.log('Logged in:', result.data.user);
    // Store user in state, redirect
  } else {
    console.error('Login failed:', result.error);
  }
};
```

### Update Profile
```typescript
const updateProfile = async (userData: any) => {
  const result = await api.users.updateProfile({
    name: userData.name,
    phone: userData.phone,
    address: {
      street: userData.street,
      city: userData.city,
      state: userData.state,
      zip: userData.zip,
      country: 'India'
    }
  });

  if (result.success) {
    console.log('Profile updated:', result.data.user);
  }
};
```

---

## 🎨 Banner Examples

### Fetch Banners for Homepage
```typescript
'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api-client';

export default function HeroBanner() {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    async function fetchBanners() {
      const result = await api.banners.getAll();
      
      if (result.success) {
        setBanners(result.data.banners);
      }
    }

    fetchBanners();
  }, []);

  return (
    <div className="banner-slider">
      {banners.map(banner => (
        <div key={banner._id} className="banner-slide">
          <img src={banner.image} alt={banner.title} />
          <h2>{banner.title}</h2>
          {banner.subtitle && <p>{banner.subtitle}</p>}
        </div>
      ))}
    </div>
  );
}
```

### Fetch Page Banner
```typescript
const getPageBanner = async (page: 'products' | 'about' | 'contact') => {
  const result = await api.pageBanners.getByPage(page);
  
  if (result.success && result.data.banner) {
    return result.data.banner;
  }
  return null;
};
```

---

## 📤 Image Upload Example

### Upload Product Image
```typescript
'use client';
import { useState } from 'react';
import api from '@/lib/api-client';

export default function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const result = await api.upload.uploadImage(file);

    if (result.success) {
      setImageUrl(result.data.url);
      console.log('Image uploaded:', result.data.url);
    } else {
      console.error('Upload failed:', result.error);
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
      {imageUrl && <img src={imageUrl} alt="Uploaded" />}
    </div>
  );
}
```

---

## 🔄 With React Query (Recommended)

For better caching and state management, use with React Query:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api-client';

// Fetch products with caching
function useProducts(category?: string) {
  return useQuery({
    queryKey: ['products', category],
    queryFn: async () => {
      const result = await api.products.getAll({ category });
      if (!result.success) throw new Error(result.error);
      return result.data.products;
    },
  });
}

// Create product with automatic cache update
function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: any) => {
      const result = await api.products.create(productData);
      if (!result.success) throw new Error(result.error);
      return result.data.product;
    },
    onSuccess: () => {
      // Invalidate products cache
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Usage in component
function ProductManager() {
  const { data: products, isLoading } = useProducts('lipstick');
  const createProduct = useCreateProduct();

  const handleCreate = () => {
    createProduct.mutate({
      name: 'New Product',
      slug: 'new-product',
      // ... other fields
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {products?.map(product => (
        <div key={product._id}>{product.name}</div>
      ))}
      <button onClick={handleCreate}>Add Product</button>
    </div>
  );
}
```

---

## 🎯 Admin Panel Examples

### Manage Orders
```typescript
'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api-client';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async (status?: string) => {
    const result = await api.orders.getAllAdmin({ 
      status, 
      page: 1, 
      limit: 20 
    });
    
    if (result.success) {
      setOrders(result.data.orders);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const result = await api.orders.updateStatus(orderId, newStatus);
    
    if (result.success) {
      // Refresh orders list
      fetchOrders();
    }
  };

  return (
    <div>
      <h2>Manage Orders</h2>
      <select onChange={(e) => fetchOrders(e.target.value)}>
        <option value="">All Orders</option>
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
      </select>

      {orders.map(order => (
        <div key={order._id}>
          <p>Order #{order.orderNumber}</p>
          <select 
            value={order.status}
            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔒 Error Handling Best Practices

```typescript
import api from '@/lib/api-client';
import { toast } from 'react-hot-toast';

async function handleApiCall() {
  try {
    const result = await api.products.getAll();
    
    if (result.success) {
      // Handle success
      console.log('Data:', result.data);
    } else {
      // Handle error
      toast.error(result.error || 'Something went wrong');
    }
  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error:', error);
    toast.error('An unexpected error occurred');
  }
}
```

---

## 📝 TypeScript Types (Optional)

Create type definitions for better IDE support:

```typescript
// types/api.ts
export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  brand?: string;
  images: string[];
  featured: boolean;
  pdpFeatures?: {
    showColorSelector: boolean;
    availableColors: string[];
    showSizeSelector: boolean;
    availableSizes: string[];
    showReviews: boolean;
    showSocialShare: boolean;
    showAdditionalInfo: boolean;
    customFeatures: Array<{ label: string; value: string }>;
  };
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId?: string;
  email: string;
  phone: string;
  name: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentMethod: string;
  createdAt: string;
}

// Use in components
import { Product, Order } from '@/types/api';
import api from '@/lib/api-client';

const [products, setProducts] = useState<Product[]>([]);
```

---

This API client library provides a clean, type-safe way to interact with your MongoDB data from the frontend! 🚀

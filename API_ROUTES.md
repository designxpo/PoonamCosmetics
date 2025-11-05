# API Routes Documentation

## 📚 Complete API Reference for Poonam Cosmetics

### Base URL
- Local: `http://localhost:3000/api`
- Production: `https://yourdomain.com/api`

---

## 🔐 Authentication Routes

### Register User
```
POST /api/auth/register
Body: { email, password, name, phone? }
Response: { success, user, token }
```

### Login User
```
POST /api/auth/login
Body: { email, password }
Response: { success, user, token }
```

### Admin Login
```
POST /api/admin/login
Body: { email, password }
Response: { success, admin, token }
```

---

## 👤 User Routes

### Get User Profile
```
GET /api/user/profile
Headers: Cookie: token=<jwt_token>
Response: { success, user }
```

### Update User Profile
```
PUT /api/user/profile
Headers: Cookie: token=<jwt_token>
Body: { name, phone, address }
Response: { success, user }
```

### Get All Users (Admin)
```
GET /api/users
Headers: Cookie: token=<admin_token>
Response: { success, users }
```

---

## 🛍️ Product Routes

### Get All Products
```
GET /api/products
Query Params: 
  - search?: string
  - category?: string
  - brand?: string
  - featured?: boolean
  - limit?: number
  - page?: number
Response: { success, products, total, page, totalPages }
```

### Get Product by Slug
```
GET /api/products/[slug]
Response: { success, product }
```

### Create Product (Admin)
```
POST /api/products
Headers: Cookie: token=<admin_token>
Body: { 
  name, slug, description, price, 
  category, brand?, images[], 
  featured?, pdpFeatures? 
}
Response: { success, product }
```

### Update Product (Admin)
```
PUT /api/products/[slug]
Headers: Cookie: token=<admin_token>
Body: { name?, price?, description?, ... }
Response: { success, product }
```

### Delete Product (Admin)
```
DELETE /api/products/[slug]
Headers: Cookie: token=<admin_token>
Response: { success, message }
```

---

## 📂 Category Routes

### Get All Categories
```
GET /api/categories
Response: { success, categories }
```

### Get Category by ID or Slug
```
GET /api/categories/[id]
Response: { success, category }
```

### Create Category (Admin)
```
POST /api/categories
Headers: Cookie: token=<admin_token>
Body: { name, slug, description?, image? }
Response: { success, category }
```

### Update Category (Admin)
```
PUT /api/categories/[id]
Headers: Cookie: token=<admin_token>
Body: { name?, description?, ... }
Response: { success, category }
```

### Delete Category (Admin)
```
DELETE /api/categories/[id]
Headers: Cookie: token=<admin_token>
Response: { success, message }
```

---

## 🏷️ Brand Routes

### Get All Brands (Public)
```
GET /api/brands
Response: { success, brands }
```

### Get All Brands (Admin)
```
GET /api/admin/brands
Headers: Cookie: token=<admin_token>
Response: { success, brands }
```

### Get Brand by ID
```
GET /api/admin/brands/[id]
Headers: Cookie: token=<admin_token>
Response: { success, brand }
```

### Create Brand (Admin)
```
POST /api/admin/brands
Headers: Cookie: token=<admin_token>
Body: { name, slug, description?, logo?, website? }
Response: { success, brand }
```

### Update Brand (Admin)
```
PUT /api/admin/brands/[id]
Headers: Cookie: token=<admin_token>
Body: { name?, description?, logo?, ... }
Response: { success, brand }
```

### Delete Brand (Admin)
```
DELETE /api/admin/brands/[id]
Headers: Cookie: token=<admin_token>
Response: { success, message }
```

---

## 🛒 Order Routes

### Get User Orders
```
GET /api/orders
Headers: Cookie: token=<jwt_token>
Query: userId=<user_id>
Response: { success, orders }
```

### Get Order by Number (Guest)
```
GET /api/orders?orderNumber=<order_number>&email=<email>
Response: { success, order }
```

### Create Order
```
POST /api/orders
Body: { 
  userId?, email, phone, name,
  items: [{ productId, name, price, quantity, image }],
  totalAmount, shippingAddress, paymentMethod 
}
Response: { success, order }
```

### Get All Orders (Admin)
```
GET /api/admin/orders
Headers: Cookie: token=<admin_token>
Query: status?, page?, limit?
Response: { success, orders, total, page, totalPages }
```

### Get Order by ID (Admin)
```
GET /api/admin/orders/[id]
Headers: Cookie: token=<admin_token>
Response: { success, order }
```

### Update Order Status (Admin)
```
PUT /api/admin/orders/[id]
Headers: Cookie: token=<admin_token>
Body: { status }
Response: { success, order }
```

### Cancel Order (User)
```
PUT /api/orders/[orderNumber]/cancel
Headers: Cookie: token=<jwt_token>
Response: { success, order }
```

### Cancel Order (Guest)
```
PUT /api/orders/[orderNumber]/cancel-guest
Body: { email }
Response: { success, order }
```

---

## 🎨 Banner Routes

### Get Active Banners
```
GET /api/banners
Response: { success, banners }
```

### Get Banner by ID
```
GET /api/banners/[id]
Response: { success, banner }
```

### Create Banner (Admin)
```
POST /api/banners
Headers: Cookie: token=<admin_token>
Body: { 
  title, subtitle?, description?, 
  image, link?, buttonText?, 
  isActive, order 
}
Response: { success, banner }
```

### Update Banner (Admin)
```
PUT /api/banners/[id]
Headers: Cookie: token=<admin_token>
Body: { title?, isActive?, ... }
Response: { success, banner }
```

### Delete Banner (Admin)
```
DELETE /api/banners/[id]
Headers: Cookie: token=<admin_token>
Response: { success, message }
```

---

## 🎯 Page Banner Routes

### Get Page Banner
```
GET /api/page-banners?page=products|about|contact
Response: { success, banner }
```

### Get All Page Banners (Admin)
```
GET /api/page-banners
Headers: Cookie: token=<admin_token>
Response: { success, banners }
```

### Create Page Banner (Admin)
```
POST /api/page-banners
Headers: Cookie: token=<admin_token>
Body: { 
  page, eyebrow, title, description,
  backgroundImage?, gradientFrom?, 
  gradientVia?, gradientTo?, isActive 
}
Response: { success, banner }
```

### Update Page Banner (Admin)
```
PUT /api/page-banners?page=products|about|contact
Headers: Cookie: token=<admin_token>
Body: { eyebrow?, title?, description?, ... }
Response: { success, banner }
```

### Delete Page Banner (Admin)
```
DELETE /api/page-banners?page=products|about|contact
Headers: Cookie: token=<admin_token>
Response: { success, message }
```

---

## ⭐ Featured Collection Routes

### Get Active Featured Collections
```
GET /api/featured-collections
Response: { success, collections }
```

### Get Featured Collection by ID
```
GET /api/featured-collections/[id]
Response: { success, collection }
```

### Create Featured Collection (Admin)
```
POST /api/featured-collections
Headers: Cookie: token=<admin_token>
Body: { 
  name, description, 
  products: [productIds], 
  isActive, order 
}
Response: { success, collection }
```

### Update Featured Collection (Admin)
```
PUT /api/featured-collections/[id]
Headers: Cookie: token=<admin_token>
Body: { name?, products?, ... }
Response: { success, collection }
```

### Delete Featured Collection (Admin)
```
DELETE /api/featured-collections/[id]
Headers: Cookie: token=<admin_token>
Response: { success, message }
```

---

## 📦 Product Section Routes

### Get Active Product Sections
```
GET /api/product-sections
Response: { success, sections }
```

### Get Product Section by ID
```
GET /api/product-sections/[id]
Response: { success, section }
```

### Create Product Section (Admin)
```
POST /api/product-sections
Headers: Cookie: token=<admin_token>
Body: { 
  title, description?, 
  products: [productIds], 
  isActive, order 
}
Response: { success, section }
```

### Update Product Section (Admin)
```
PUT /api/product-sections/[id]
Headers: Cookie: token=<admin_token>
Body: { title?, products?, ... }
Response: { success, section }
```

### Delete Product Section (Admin)
```
DELETE /api/product-sections/[id]
Headers: Cookie: token=<admin_token>
Response: { success, message }
```

---

## ⚙️ Settings Routes

### Get Banner Settings
```
GET /api/banner-settings
Response: { success, banners }
```

### Create/Update Banner Settings (Admin)
```
POST /api/banner-settings
Headers: Cookie: token=<admin_token>
Body: { 
  banners: [{ 
    title, subtitle, description, 
    image, link, buttonText, isActive 
  }] 
}
Response: { success, settings }
```

---

## 📤 Upload Routes

### Upload Image
```
POST /api/upload
Headers: Cookie: token=<admin_token>
Content-Type: multipart/form-data
Body: FormData with 'file' field
Response: { success, url }
```

---

## 🔧 Setup Routes (Development)

### Setup Admin
```
POST /api/setup/admin
Body: { email, password, name }
Response: { success, admin }
```

### Make User Admin
```
POST /api/setup/make-admin
Body: { email }
Response: { success, user }
```

### Setup Brands
```
POST /api/setup/brands
Response: { success, brands }
```

---

## 📊 Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": "Optional error details"
}
```

---

## 🔑 Authentication

### Cookie-based Authentication
Most admin and user routes require authentication via HTTP-only cookie:
```
Cookie: token=<jwt_token>
```

### Token Format
JWT token contains:
```json
{
  "userId": "user_id",
  "email": "user@example.com",
  "role": "user|admin"
}
```

---

## 📝 Common Query Parameters

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term
- `category`: Filter by category slug
- `brand`: Filter by brand slug
- `status`: Filter by status
- `featured`: Filter featured items (true/false)

---

## 🚨 Error Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

---

## 📱 Usage Examples

### JavaScript/TypeScript
```typescript
// Get all products
const response = await fetch('/api/products?category=lipstick&limit=20');
const data = await response.json();

// Create product (admin)
const response = await fetch('/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Include cookies
  body: JSON.stringify({
    name: 'New Lipstick',
    slug: 'new-lipstick',
    price: 299,
    category: 'lipstick',
    images: ['url1', 'url2']
  })
});

// Get user orders
const response = await fetch('/api/orders', {
  credentials: 'include'
});
```

### cURL
```bash
# Get products
curl http://localhost:3000/api/products?category=lipstick

# Create product (admin)
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -b "token=<jwt_token>" \
  -d '{"name":"New Product","slug":"new-product","price":299}'

# Upload image
curl -X POST http://localhost:3000/api/upload \
  -b "token=<jwt_token>" \
  -F "file=@/path/to/image.jpg"
```

---

## 🔄 Rate Limiting

API is protected with rate limiting:
- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: Check `X-RateLimit-Remaining` header
- **Response**: 429 Too Many Requests when exceeded

---

## 🛡️ Security Features

- ✅ JWT Authentication
- ✅ HTTP-only Cookies
- ✅ Rate Limiting
- ✅ CORS Protection
- ✅ Input Validation
- ✅ XSS Protection
- ✅ CSRF Protection
- ✅ Security Headers

---

## 📚 Database Models

### Product
```typescript
{
  name: string
  slug: string (unique)
  description: string
  price: number
  category: string
  brand?: string
  images: string[]
  featured: boolean
  pdpFeatures?: {
    showColorSelector: boolean
    availableColors: string[]
    showSizeSelector: boolean
    availableSizes: string[]
    showReviews: boolean
    showSocialShare: boolean
    showAdditionalInfo: boolean
    customFeatures: [{ label, value }]
  }
}
```

### User
```typescript
{
  name: string
  email: string (unique)
  password: string (hashed)
  phone?: string
  role: 'user' | 'admin'
  address?: {
    street, city, state, zip, country
  }
}
```

### Order
```typescript
{
  orderNumber: string (unique)
  userId?: ObjectId
  email: string
  phone: string
  name: string
  items: [{
    productId: ObjectId
    name: string
    price: number
    quantity: number
    image: string
  }]
  totalAmount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: object
  paymentMethod: string
}
```

---

## 🎯 Next Steps

1. **Test Routes**: Use the examples to test each endpoint
2. **Error Handling**: Implement try-catch in client code
3. **Loading States**: Show spinners during API calls
4. **Caching**: Use React Query or SWR for data caching
5. **Optimistic Updates**: Update UI before server response

---

**Last Updated**: 2024  
**API Version**: 1.0.0  
**Documentation**: Complete

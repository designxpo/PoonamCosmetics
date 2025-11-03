# Product Sections Management

## Overview
The homepage product sections are now fully dynamic and manageable through APIs. This includes:
1. **Featured Collections** - 3 promotional cards with images
2. **Product Tabs** - Best Sellers, New Arrivals, and Sale sections

## 1. Featured Collections

### Features
- Display 3 promotional collection cards
- Customizable images, titles, subtitles, and links
- Hover effects with zoom animation
- Fallback to default collections if none exist

### API Endpoints

#### Get Featured Collections
```bash
GET /api/featured-collections
```

#### Create Featured Collection
```bash
POST /api/featured-collections
Content-Type: application/json

{
  "title": "Autumn Skincare",
  "subtitle": "Discover Now →",
  "image": "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80",
  "link": "/products?category=skincare",
  "backgroundColor": "slate-200",
  "isActive": true,
  "order": 0
}
```

### Sample Collections

**Collection 1: Autumn Skincare**
```bash
curl -X POST http://localhost:3000/api/featured-collections \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Autumn Skincare",
    "subtitle": "Discover Now →",
    "image": "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80",
    "link": "/products?category=skincare",
    "backgroundColor": "slate-200",
    "isActive": true,
    "order": 0
  }'
```

**Collection 2: Anti-aging Cream**
```bash
curl -X POST http://localhost:3000/api/featured-collections \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Anti-aging Cream",
    "subtitle": "Buy 1 Get 1 →",
    "image": "https://images.unsplash.com/photo-1556228852-80c3a083d0d5?auto=format&fit=crop&w=600&q=80",
    "link": "/products?category=face-creams",
    "backgroundColor": "slate-200",
    "isActive": true,
    "order": 1
  }'
```

**Collection 3: Sale**
```bash
curl -X POST http://localhost:3000/api/featured-collections \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sale Up To 40% Off",
    "subtitle": "Shop Sale →",
    "image": "https://images.unsplash.com/photo-1571875257727-256c39da42af?auto=format&fit=crop&w=600&q=80",
    "link": "/products",
    "backgroundColor": "green-100",
    "isActive": true,
    "order": 2
  }'
```

## 2. Product Sections (Tabs)

### Features
- Three product tabs: Best Sellers, New Arrivals, Sale
- Dynamic product assignment per section
- Automatic fallback to product queries if no specific products assigned
- Tab switching with smooth transitions

### Section Types
- `best-sellers` - Featured/popular products
- `new-arrivals` - Recently added products
- `sale` - Products on sale
- `featured` - Custom featured products

### API Endpoints

#### Get Section Products
```bash
GET /api/product-sections?section=best-sellers
```

#### Create/Update Product Section
```bash
POST /api/product-sections
Content-Type: application/json

{
  "name": "best-sellers",
  "title": "Best Sellers",
  "description": "Our most popular products",
  "productIds": ["product_id_1", "product_id_2", "product_id_3"],
  "isActive": true,
  "order": 0
}
```

### Setting Up Product Sections

**Step 1: Create Best Sellers Section**
```bash
curl -X POST http://localhost:3000/api/product-sections \
  -H "Content-Type: application/json" \
  -d '{
    "name": "best-sellers",
    "title": "Best Sellers",
    "description": "Most popular products",
    "productIds": [],
    "isActive": true,
    "order": 0
  }'
```

**Step 2: Create New Arrivals Section**
```bash
curl -X POST http://localhost:3000/api/product-sections \
  -H "Content-Type: application/json" \
  -d '{
    "name": "new-arrivals",
    "title": "New Arrivals",
    "description": "Latest products",
    "productIds": [],
    "isActive": true,
    "order": 1
  }'
```

**Step 3: Create Sale Section**
```bash
curl -X POST http://localhost:3000/api/product-sections \
  -H "Content-Type: application/json" \
  -d '{
    "name": "sale",
    "title": "Sale",
    "description": "Products on sale",
    "productIds": [],
    "isActive": true,
    "order": 2
  }'
```

### Assigning Specific Products to Sections

To display specific products in a section, update it with product IDs:

```bash
curl -X POST http://localhost:3000/api/product-sections \
  -H "Content-Type: application/json" \
  -d '{
    "name": "best-sellers",
    "title": "Best Sellers",
    "productIds": [
      "672f1234567890abcdef1234",
      "672f1234567890abcdef5678",
      "672f1234567890abcdef9012"
    ],
    "isActive": true,
    "order": 0
  }'
```

### Default Behavior

If `productIds` is empty or not provided, the API will automatically fetch products based on the section type:

- **best-sellers**: Products with `featured: true`
- **new-arrivals**: Products sorted by `createdAt` (newest first)
- **sale**: Products with `featured: true` (customize as needed)

## Database Models

### FeaturedCollection Model
```typescript
{
  title: String (required),
  subtitle: String (required),
  image: String (required),
  link: String (required),
  backgroundColor: String (default: 'slate-200'),
  isActive: Boolean (default: true),
  order: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### ProductSection Model
```typescript
{
  name: String (required, unique, enum: ['best-sellers', 'new-arrivals', 'sale', 'featured']),
  title: String (required),
  description: String,
  productIds: [String],
  isActive: Boolean (default: true),
  order: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

## Files Created/Modified

### New Files:
- `/models/FeaturedCollection.ts` - Featured collections model
- `/models/ProductSection.ts` - Product sections model
- `/app/api/featured-collections/route.ts` - Featured collections API
- `/app/api/product-sections/route.ts` - Product sections API
- `/components/FeaturedCollections.tsx` - Featured collections component

### Modified Files:
- `/app/page.tsx` - Updated to use dynamic sections

## Testing

### 1. Test Featured Collections
```bash
# Create collections
curl -X POST http://localhost:3000/api/featured-collections -H "Content-Type: application/json" -d '{"title":"Test Collection","subtitle":"Click Here","image":"https://placehold.co/600x400","link":"/products","order":0}'

# Fetch collections
curl http://localhost:3000/api/featured-collections
```

### 2. Test Product Sections
```bash
# Create section
curl -X POST http://localhost:3000/api/product-sections -H "Content-Type: application/json" -d '{"name":"best-sellers","title":"Best Sellers","productIds":[]}'

# Fetch section products
curl http://localhost:3000/api/product-sections?section=best-sellers
```

## Future Enhancements

- Admin dashboard for visual management
- Drag-and-drop product assignment
- A/B testing for sections
- Analytics tracking for clicks
- Seasonal section templates
- Bulk import/export functionality

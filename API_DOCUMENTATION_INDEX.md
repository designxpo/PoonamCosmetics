# 📚 API & Database Documentation Index

## 🎯 Quick Access

### Getting Started (Read This First!)
- **[API_QUICKSTART.md](./API_QUICKSTART.md)** - Start here! Basic examples to get you coding in 5 minutes

### Complete References
1. **[API_ROUTES.md](./API_ROUTES.md)** - Complete list of all API endpoints
2. **[API_CLIENT_EXAMPLES.md](./API_CLIENT_EXAMPLES.md)** - Detailed usage examples for frontend
3. **[MONGODB_ID_GUIDE.md](./MONGODB_ID_GUIDE.md)** - Understanding and working with MongoDB IDs
4. **[INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md)** - Complete overview of everything created

### Production Guides
5. **[PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)** - Pre-deployment checklist
6. **[PRODUCTION_README.md](./PRODUCTION_README.md)** - Deployment guide and setup

---

## 📖 What's Inside Each Guide

### 1. API_QUICKSTART.md
**Read Time: 5 minutes**
- View your data with helper script
- Basic frontend usage examples
- Display products on homepage
- Admin panel examples
- Upload images

**When to use:** Starting to use the API in your code

---

### 2. API_ROUTES.md
**Read Time: 15 minutes**
- Complete API endpoint reference
- Request/response formats
- Authentication requirements
- Query parameters
- Error codes
- cURL and JavaScript examples

**When to use:** Looking up specific API endpoints

**Quick Sections:**
- Authentication Routes (Register, Login)
- User Routes (Profile, Orders)
- Product Routes (CRUD operations)
- Category Routes
- Brand Routes
- Order Routes
- Banner Routes
- Page Banner Routes
- Featured Collection Routes
- Product Section Routes
- Settings Routes
- Upload Routes

---

### 3. API_CLIENT_EXAMPLES.md
**Read Time: 20 minutes**
- Detailed usage examples
- Product examples (fetch, create, search)
- Category examples
- Order examples (place, track, manage)
- User examples (register, login, profile)
- Banner examples
- Upload examples
- React Query integration
- Admin panel examples
- Error handling patterns
- TypeScript type definitions

**When to use:** Implementing specific features in your frontend

**Popular Examples:**
- Fetch all products with filters
- Create new product (admin)
- Place an order
- Track order (guest)
- Upload images
- Manage orders (admin)

---

### 4. MONGODB_ID_GUIDE.md
**Read Time: 10 minutes**
- Understanding MongoDB ObjectIds
- ID types in your system
- How to get IDs from database
- Working with IDs in frontend
- ID validation
- Best practices (slugs vs IDs)
- ID relationships
- Common ID operations
- Helper script to get all IDs

**When to use:** 
- Working with database IDs
- Debugging ID-related issues
- Understanding URL vs database identifiers

**Key Concepts:**
- Use slugs for URLs: `/products/red-lipstick`
- Use IDs for operations: `api.products.getById('672a...')`

---

### 5. INTEGRATION_SUMMARY.md
**Read Time: 15 minutes**
- Overview of all API routes created
- Complete API structure
- Frontend usage patterns
- Admin panel usage
- Website usage examples
- Order flow examples
- Display page banners
- Testing your setup
- Quick reference table

**When to use:**
- Getting overview of entire system
- Understanding architecture
- Reference during development

**Contains:**
- Public routes list
- User routes list
- Admin routes list
- Usage in admin panel
- Usage on website
- Complete order flow
- Quick reference table

---

### 6. PRODUCTION_CHECKLIST.md
**Read Time: 10 minutes**
- Environment variables checklist
- Security checklist
- Performance checklist
- Database setup
- Monitoring & logging
- Testing procedures
- SEO & meta tags
- Build & deploy commands
- Post-deployment tasks
- Performance targets
- Security best practices

**When to use:** Before deploying to production

**Sections:**
- ✅ Environment Variables
- ✅ Security
- ✅ Performance
- ✅ Database
- ✅ Monitoring & Logging
- ✅ Testing
- ✅ SEO & Meta
- ✅ Build & Deploy
- ✅ Post-Deployment

---

### 7. PRODUCTION_README.md
**Read Time: 20 minutes**
- Complete deployment guide
- Environment setup
- Production build steps
- Security features
- Performance optimizations
- Database management
- Deployment options (Vercel, Docker, AWS)
- Testing production build
- Troubleshooting
- Project structure
- Key features overview

**When to use:** 
- Deploying to production
- Setting up new environment
- Troubleshooting deployment issues

**Deployment Options:**
- Vercel (Recommended)
- Docker
- AWS/DigitalOcean

---

## 🔍 Find What You Need

### "I want to fetch products from MongoDB"
→ Start with **[API_QUICKSTART.md](./API_QUICKSTART.md)** Step 2-3

### "I need to know all available API endpoints"
→ Check **[API_ROUTES.md](./API_ROUTES.md)**

### "How do I create a product in admin panel?"
→ See **[API_CLIENT_EXAMPLES.md](./API_CLIENT_EXAMPLES.md)** - Product Examples

### "What are these MongoDB IDs?"
→ Read **[MONGODB_ID_GUIDE.md](./MONGODB_ID_GUIDE.md)**

### "How do I handle orders?"
→ Check **[INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md)** - Order Flow

### "I'm ready to deploy"
→ Follow **[PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)** then **[PRODUCTION_README.md](./PRODUCTION_README.md)**

### "I need a complete overview"
→ Read **[INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md)**

---

## 🛠️ Helper Scripts

### View All Data IDs
```bash
node scripts/get-all-ids.js
```
Shows all documents with their IDs from MongoDB.

### Create Database Indexes
```bash
node scripts/create-indexes.js
```
Creates performance indexes for production.

### Auto-Configure PDP Features
```bash
node scripts/auto-configure-pdp.js
```
Configures product detail page features for all products.

### Toggle Size Selectors
```bash
node scripts/toggle-size-selector.js
```
Enable/disable size selectors for specific products.

---

## 📦 What's in lib/api-client.ts

Centralized API client with methods for:
- ✅ Products (getAll, getBySlug, create, update, delete)
- ✅ Categories (getAll, getById, create, update, delete)
- ✅ Brands (getAll, getById, create, update, delete)
- ✅ Orders (getUserOrders, getByOrderNumber, create, cancel)
- ✅ Banners (getAll, getById, create, update, delete)
- ✅ Page Banners (getByPage, create, update, delete)
- ✅ Featured Collections (getAll, getById, create, update, delete)
- ✅ Product Sections (getAll, getById, create, update, delete)
- ✅ Users (register, login, getProfile, updateProfile)
- ✅ Admin (login, setup, makeAdmin)
- ✅ Upload (uploadImage)
- ✅ Settings (getBannerSettings, updateBannerSettings)

**Usage:**
```typescript
import api from '@/lib/api-client';

const products = await api.products.getAll();
```

---

## 🎯 Common Use Cases

### Display Products on Homepage
```typescript
const result = await api.products.getAll({ featured: true, limit: 8 });
```
📖 More details: **API_QUICKSTART.md** - Step 3

### Create Product (Admin)
```typescript
await api.products.create({ name: 'New Product', slug: 'new-product', ... });
```
📖 More details: **API_CLIENT_EXAMPLES.md** - Product Examples

### Get Category Products
```typescript
const result = await api.products.getAll({ category: 'lipstick' });
```
📖 More details: **API_ROUTES.md** - Product Routes

### Place Order
```typescript
await api.orders.create({ items: [...], email: '...', ... });
```
📖 More details: **INTEGRATION_SUMMARY.md** - Order Flow

### Upload Image
```typescript
await api.upload.uploadImage(fileObject);
```
📖 More details: **API_QUICKSTART.md** - Step 6

### Track Order (Guest)
```typescript
await api.orders.getByOrderNumber('ORD-123', 'user@email.com');
```
📖 More details: **API_CLIENT_EXAMPLES.md** - Order Examples

---

## 🚀 Getting Started Path

**For Beginners:**
1. Read **API_QUICKSTART.md** (5 min)
2. Run `node scripts/get-all-ids.js` to see your data
3. Try examples from **API_QUICKSTART.md**
4. Refer to **API_ROUTES.md** when needed

**For Developers:**
1. Read **INTEGRATION_SUMMARY.md** for overview
2. Use **API_CLIENT_EXAMPLES.md** for implementation
3. Reference **API_ROUTES.md** for endpoints
4. Check **MONGODB_ID_GUIDE.md** for ID usage

**For Deployment:**
1. Follow **PRODUCTION_CHECKLIST.md**
2. Read **PRODUCTION_README.md**
3. Run `node scripts/create-indexes.js`
4. Test all features before going live

---

## 📱 Support

### Issues with API?
- Check **API_ROUTES.md** for correct endpoint format
- Verify authentication in browser cookies
- Check MongoDB connection in `.env.local`

### Issues with IDs?
- Read **MONGODB_ID_GUIDE.md**
- Run `node scripts/get-all-ids.js` to verify IDs
- Remember: Use slugs for URLs, IDs for operations

### Issues with Deployment?
- Follow **PRODUCTION_CHECKLIST.md** step by step
- Check **PRODUCTION_README.md** troubleshooting section
- Verify all environment variables are set

---

## ✅ Quick Reference

| Documentation | Purpose | Read Time |
|--------------|---------|-----------|
| API_QUICKSTART.md | Get started fast | 5 min |
| API_ROUTES.md | Endpoint reference | 15 min |
| API_CLIENT_EXAMPLES.md | Detailed examples | 20 min |
| MONGODB_ID_GUIDE.md | Understanding IDs | 10 min |
| INTEGRATION_SUMMARY.md | Complete overview | 15 min |
| PRODUCTION_CHECKLIST.md | Pre-deployment | 10 min |
| PRODUCTION_README.md | Deployment guide | 20 min |

---

## 🎓 Learning Path

**Day 1:** Read API_QUICKSTART.md and try basic examples
**Day 2:** Explore API_CLIENT_EXAMPLES.md for your features
**Day 3:** Reference API_ROUTES.md as needed
**Week 2:** Read INTEGRATION_SUMMARY.md for architecture
**Before Launch:** Complete PRODUCTION_CHECKLIST.md
**Launch Day:** Follow PRODUCTION_README.md

---

**Happy Coding! 🚀**

*Last Updated: 2024*
*Documentation Version: 1.0.0*

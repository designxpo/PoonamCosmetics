# Product Upload Guide - Category Management

## 📋 Overview
This guide explains how to add products with proper categories so they appear on the correct category pages in your website.

---

## 🗂️ Understanding Categories

### Available Categories (from Navigation)
Your website has the following main categories that appear in the navigation:

1. **Cosmetics** - `/category/cosmetics`
2. **Skincare** - `/category/skincare`
3. **Haircare** - `/category/haircare`
4. **Fragrance** - `/category/fragrance`

---

## 🔧 How to Add Products with Categories

### Step 1: Access Admin Panel
1. Go to: `http://localhost:3001/admin/products`
2. Click **"Add Product"** button

### Step 2: Fill Product Information

#### Required Fields:
- ✅ **Product Name** - e.g., "Lakme Lipstick Red Velvet"
- ✅ **Price (₹)** - e.g., 499
- ✅ **Category** - Select from dropdown (IMPORTANT!)
- ✅ **At least 1 Image**

#### Optional Fields:
- **Description** - Detailed product information
- **Stock Quantity** - Number of items available
- **Brand** - Select brand if applicable
- **Featured** - Check to show on homepage
- **Active** - Check to make visible on website

### Step 3: Select Category

**CRITICAL:** Choose the correct category from the dropdown:

```
Example Mapping:
├── Lipstick, Foundation, Blush → Cosmetics
├── Face Wash, Moisturizer, Serum → Skincare
├── Shampoo, Conditioner, Hair Oil → Haircare
└── Perfume, Deodorant, Body Spray → Fragrance
```

### Step 4: Add Images
- Click **"Upload Image"** or paste image URL
- Recommended: At least 3-4 images
- First image becomes the main product image

### Step 5: Save Product
- Review preview on the right side
- Click **"Save Product"** button
- Product will be created and visible on website

---

## 📍 Where Products Appear

After adding a product with a category, it will automatically appear on:

### 1. Category Pages
**URL Format:** `/category/[category-slug]`

**Examples:**
- Product with "Cosmetics" → Shows on `/category/cosmetics`
- Product with "Skincare" → Shows on `/category/skincare`
- Product with "Haircare" → Shows on `/category/haircare`
- Product with "Fragrance" → Shows on `/category/fragrance`

### 2. Homepage (if Featured)
- Check the **"Featured"** checkbox
- Product appears in "Featured Products" section

### 3. Products Page
**URL:** `/products`
- Shows ALL active products
- Users can filter by category

### 4. Search Results
- Products appear when users search
- Searchable by name and description

### 5. Brand Pages (if brand assigned)
**URL Format:** `/brand/[brand-slug]`
- Only if you assign a brand to the product

---

## 🔍 How to Create New Categories

If you need to add a NEW category (e.g., "Men's Grooming"):

### Step 1: Create Category
1. Go to: `http://localhost:3001/admin/categories`
2. Click **"Add Category"**
3. Fill in:
   - **Name:** Men's Grooming
   - **Slug:** mens-grooming (auto-generated)
   - **Description:** Products for men's grooming needs
4. Check **"Active"** checkbox
5. Click **"Save"**

### Step 2: Add to Navigation (Optional)
To show in header navigation, edit:
- File: `/components/Header.tsx`
- Add to navigation array:
```tsx
{ name: "Men's Grooming", href: '/category/mens-grooming' }
```

### Step 3: Use New Category
- Now available in product upload dropdown
- Products assigned to this category will show on `/category/mens-grooming`

---

## 🎯 Best Practices

### 1. **Consistent Categorization**
```
✅ GOOD:
- "Lakme Lipstick" → Cosmetics
- "Mamaearth Face Wash" → Skincare
- "L'Oreal Shampoo" → Haircare

❌ BAD:
- "Lakme Lipstick" → Haircare (wrong category)
- Leaving category blank
```

### 2. **Complete Product Information**
- Always add description
- Add 3-4 high-quality images
- Set realistic stock quantity
- Choose appropriate brand

### 3. **Use Featured Products Wisely**
- Mark only 8-12 products as featured
- Choose best-sellers or new launches
- Update featured products regularly

### 4. **Keep Products Active**
- Check "Active" checkbox for visible products
- Uncheck to hide without deleting

---

## 🔄 Common Workflows

### Adding Bulk Products in Same Category

**Scenario:** Adding 20 lipsticks to Cosmetics category

1. Go to Add Product page
2. Fill first product completely
3. Save and return
4. Click "Add Product" again
5. Category dropdown remembers last selection
6. Repeat for each product

### Moving Product to Different Category

**Scenario:** Product in wrong category

1. Go to: `/admin/products`
2. Find the product
3. Click **Edit** (pencil icon)
4. Change Category dropdown
5. Save changes

---

## 📊 Checking Product Visibility

### 1. Check Admin Panel
```
Admin Panel → Products
- See all products with category
- Filter by category
- Check "Active" status
```

### 2. Check Frontend
```
Visit: /category/[category-name]
- Should see your product listed
- Verify image, price, name
- Test "Add to Cart"
```

### 3. Check Products Page
```
Visit: /products
- Use category filter sidebar
- Select your category
- Product should appear
```

---

## 🐛 Troubleshooting

### Problem: Product not showing on category page

**Solutions:**
1. ✅ Check product is **Active** (Edit product → Check Active checkbox)
2. ✅ Verify correct **Category** assigned
3. ✅ Ensure product has at least **1 image**
4. ✅ Check **Stock** > 0
5. ✅ Clear browser cache and refresh

### Problem: Category dropdown is empty

**Solutions:**
1. Go to `/admin/categories`
2. Check if categories exist
3. Ensure categories are **Active**
4. Refresh the add product page

### Problem: Products show on wrong category page

**Solution:**
1. Edit the product
2. Verify category selection
3. Save again

---

## 📝 Quick Reference

### Essential URLs

| Page | URL | Purpose |
|------|-----|---------|
| Add Product | `/admin/products/new` | Upload new product |
| Manage Products | `/admin/products` | View/Edit all products |
| Manage Categories | `/admin/categories` | Create/Edit categories |
| Manage Brands | `/admin/brands` | Create/Edit brands |
| Category Page | `/category/[slug]` | View products by category |
| All Products | `/products` | View all products |

### Category Structure

```
Website
├── Cosmetics
│   ├── Lipstick
│   ├── Foundation
│   ├── Eyeliner
│   └── Mascara
├── Skincare
│   ├── Face Wash
│   ├── Moisturizer
│   └── Serum
├── Haircare
│   ├── Shampoo
│   ├── Conditioner
│   └── Hair Oil
└── Fragrance
    ├── Perfume
    ├── Deodorant
    └── Body Spray
```

---

## ✨ Pro Tips

1. **Bulk Upload:** Consider creating products with similar details together
2. **SEO Optimization:** Write detailed descriptions with relevant keywords
3. **Image Quality:** Use high-resolution images (at least 800x800px)
4. **Pricing:** Use competitive pricing with .00 or .99 endings
5. **Featured Products:** Rotate featured products monthly for freshness
6. **Stock Management:** Keep stock updated to avoid overselling
7. **Brand Association:** Always assign brands for better filtering

---

## 🚀 Next Steps

After uploading products:

1. ✅ Visit category pages to verify products appear
2. ✅ Test "Add to Cart" functionality
3. ✅ Check product detail pages
4. ✅ Test search functionality
5. ✅ Verify mobile responsiveness
6. ✅ Share website with team for feedback

---

## 📞 Need Help?

If products still don't appear:
1. Check browser console for errors (F12)
2. Verify database connection
3. Check API responses in Network tab
4. Review terminal logs for server errors

---

**Last Updated:** November 5, 2025
**Version:** 1.0

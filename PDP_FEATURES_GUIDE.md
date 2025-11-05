# PDP Features Control Guide

## Overview
This guide explains how to control which features appear on each Product Details Page (PDP). You can now customize the PDP experience per product by enabling/disabling:
- Color selector
- Size selector
- Reviews section
- Social sharing buttons
- Additional information tab
- Custom product features

## Product Model Structure

Each product now has an optional `pdpFeatures` object with the following fields:

```javascript
pdpFeatures: {
  showColorSelector: false,        // Enable color selection
  availableColors: [],             // Array of color names
  showSizeSelector: false,         // Enable size selection
  availableSizes: [],              // Array of size values
  showReviews: true,               // Show review section (default: true)
  showSocialShare: true,           // Show social sharing buttons (default: true)
  showAdditionalInfo: true,        // Show additional info tab (default: true)
  customFeatures: []               // Custom product specifications
}
```

## How to Configure PDP Features

### Method 1: Using Admin Panel (When Creating/Editing Product)

When you add or edit a product in the admin panel, you'll need to include the `pdpFeatures` object in the product data.

### Method 2: Using MongoDB Directly

You can update products directly in MongoDB with PDP features:

```javascript
db.products.updateOne(
  { slug: "your-product-slug" },
  {
    $set: {
      pdpFeatures: {
        showColorSelector: true,
        availableColors: ["Red", "Blue", "Black", "White"],
        showSizeSelector: true,
        availableSizes: ["S", "M", "L", "XL"],
        showReviews: true,
        showSocialShare: true,
        showAdditionalInfo: true,
        customFeatures: [
          { label: "Material", value: "100% Cotton" },
          { label: "Weight", value: "250g" },
          { label: "Made In", value: "India" }
        ]
      }
    }
  }
)
```

### Method 3: Using API

Update product via API request:

```javascript
fetch('/api/products/your-product-id', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    pdpFeatures: {
      showColorSelector: true,
      availableColors: ["Brown", "Green", "Red", "Blue"],
      showSizeSelector: true,
      availableSizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
      showReviews: true,
      showSocialShare: true,
      showAdditionalInfo: true,
      customFeatures: []
    }
  })
})
```

## Feature Details

### 1. Color Selector

**Enable:** Set `showColorSelector: true`
**Configure:** Add color names to `availableColors` array

**Available Colors:**
- Brown, Green, Red, Blue
- Black, White, Pink, Purple
- Orange, Yellow

**Example:**
```javascript
pdpFeatures: {
  showColorSelector: true,
  availableColors: ["Red", "Blue", "Black"]
}
```

**Result:** Circular color swatches appear below the description with the selected colors.

---

### 2. Size Selector

**Enable:** Set `showSizeSelector: true`
**Configure:** Add size values to `availableSizes` array

**Common Sizes:**
- Clothing: S, M, L, XL, XXL, XXXL
- Shoes: 6, 7, 8, 9, 10, 11, 12
- Custom: Any text (e.g., "One Size", "Free Size")

**Example:**
```javascript
pdpFeatures: {
  showSizeSelector: true,
  availableSizes: ["S", "M", "L", "XL"]
}
```

**Result:** Size selection buttons appear with a "View Size Guide" link.

---

### 3. Reviews Section

**Enable:** Set `showReviews: true` (default)
**Disable:** Set `showReviews: false`

**Example:**
```javascript
pdpFeatures: {
  showReviews: false  // Hide reviews for this product
}
```

**Result:** Review tab and review section will be hidden from the PDP.

---

### 4. Social Sharing

**Enable:** Set `showSocialShare: true` (default)
**Disable:** Set `showSocialShare: false`

**Example:**
```javascript
pdpFeatures: {
  showSocialShare: false  // Hide social share buttons
}
```

**Result:** Social sharing buttons (Facebook, Pinterest, LinkedIn, Twitter) will be hidden.

---

### 5. Additional Information Tab

**Enable:** Set `showAdditionalInfo: true` (default)
**Disable:** Set `showAdditionalInfo: false`

**Example:**
```javascript
pdpFeatures: {
  showAdditionalInfo: false  // Hide additional info tab
}
```

**Result:** Additional Information tab will be hidden from the product tabs.

---

### 6. Custom Features (Additional Information Content)

**Configure:** Add objects to `customFeatures` array with `label` and `value` properties

**Example:**
```javascript
pdpFeatures: {
  customFeatures: [
    { label: "Material", value: "Premium Silk" },
    { label: "Pattern", value: "Floral" },
    { label: "Occasion", value: "Party Wear" },
    { label: "Care", value: "Dry Clean Only" },
    { label: "Country of Origin", value: "India" }
  ]
}
```

**Result:** These custom features will appear in the Additional Information tab as a table.

**Note:** If no custom features are provided, default product specifications will be shown.

---

## Complete Examples

### Example 1: Clothing Product (with colors and sizes)

```javascript
{
  name: "Cotton T-Shirt",
  slug: "cotton-t-shirt",
  description: "Comfortable cotton t-shirt for everyday wear",
  price: 599,
  category: "67890abcdef",
  images: ["/images/tshirt.jpg"],
  stock: 50,
  pdpFeatures: {
    showColorSelector: true,
    availableColors: ["White", "Black", "Blue", "Red"],
    showSizeSelector: true,
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    showReviews: true,
    showSocialShare: true,
    showAdditionalInfo: true,
    customFeatures: [
      { label: "Material", value: "100% Cotton" },
      { label: "Fit", value: "Regular Fit" },
      { label: "Neck Type", value: "Round Neck" },
      { label: "Sleeve Length", value: "Short Sleeve" },
      { label: "Pattern", value: "Solid" },
      { label: "Care Instructions", value: "Machine wash cold" }
    ]
  }
}
```

---

### Example 2: Cosmetic Product (no sizes, specific colors)

```javascript
{
  name: "Matte Lipstick",
  slug: "matte-lipstick",
  description: "Long-lasting matte finish lipstick",
  price: 349,
  category: "690b1bf1013ede022f8ac2cc",
  images: ["/images/lipstick.jpg"],
  stock: 100,
  pdpFeatures: {
    showColorSelector: true,
    availableColors: ["Red", "Pink", "Purple", "Orange"],
    showSizeSelector: false,  // No sizes for cosmetics
    showReviews: true,
    showSocialShare: true,
    showAdditionalInfo: true,
    customFeatures: [
      { label: "Type", value: "Matte" },
      { label: "Finish", value: "Matte" },
      { label: "Coverage", value: "Full" },
      { label: "Net Quantity", value: "3.5 g" },
      { label: "Shelf Life", value: "24 Months" },
      { label: "Application", value: "Apply directly to lips" }
    ]
  }
}
```

---

### Example 3: Skincare Product (no colors or sizes)

```javascript
{
  name: "Vitamin C Serum",
  slug: "vitamin-c-serum",
  description: "Brightening vitamin C serum for radiant skin",
  price: 799,
  category: "690b1bf1013ede022f8ac2ce",
  images: ["/images/serum.jpg"],
  stock: 75,
  pdpFeatures: {
    showColorSelector: false,  // No color variants
    availableColors: [],
    showSizeSelector: false,   // No size variants
    availableSizes: [],
    showReviews: true,
    showSocialShare: true,
    showAdditionalInfo: true,
    customFeatures: [
      { label: "Skin Type", value: "All Skin Types" },
      { label: "Concern", value: "Brightening, Anti-aging" },
      { label: "Key Ingredient", value: "15% Vitamin C" },
      { label: "Net Quantity", value: "30 ml" },
      { label: "Shelf Life", value: "12 Months" },
      { label: "Usage", value: "Apply 2-3 drops on clean face" }
    ]
  }
}
```

---

### Example 4: Minimal Product (reviews and social share disabled)

```javascript
{
  name: "Sample Product",
  slug: "sample-product",
  description: "A basic product with minimal PDP features",
  price: 199,
  category: "67890abcdef",
  images: ["/images/sample.jpg"],
  stock: 20,
  pdpFeatures: {
    showColorSelector: false,
    availableColors: [],
    showSizeSelector: false,
    availableSizes: [],
    showReviews: false,        // Hide reviews
    showSocialShare: false,    // Hide social sharing
    showAdditionalInfo: false  // Hide additional info tab
  }
}
```

---

## Quick Setup Script

Use this Node.js script to update multiple products at once:

```javascript
// update-pdp-features.js
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGODB_URI);

async function updateProductFeatures() {
  // Update clothing products
  await Product.updateMany(
    { category: "CLOTHING_CATEGORY_ID" },
    {
      $set: {
        "pdpFeatures.showColorSelector": true,
        "pdpFeatures.showSizeSelector": true,
        "pdpFeatures.availableSizes": ["S", "M", "L", "XL", "XXL"]
      }
    }
  );

  // Update cosmetics products
  await Product.updateMany(
    { category: "690b1bf1013ede022f8ac2cc" },
    {
      $set: {
        "pdpFeatures.showColorSelector": true,
        "pdpFeatures.showSizeSelector": false
      }
    }
  );

  // Update skincare products
  await Product.updateMany(
    { category: "690b1bf1013ede022f8ac2ce" },
    {
      $set: {
        "pdpFeatures.showColorSelector": false,
        "pdpFeatures.showSizeSelector": false
      }
    }
  );

  console.log('PDP features updated successfully!');
  mongoose.disconnect();
}

updateProductFeatures();
```

Run the script:
```bash
node update-pdp-features.js
```

---

## Default Behavior

If `pdpFeatures` is not specified or is empty:
- ✅ Reviews section: **SHOWN** (default: true)
- ✅ Social sharing: **SHOWN** (default: true)
- ✅ Additional Info tab: **SHOWN** (default: true)
- ❌ Color selector: **HIDDEN** (default: false)
- ❌ Size selector: **HIDDEN** (default: false)

---

## Testing Your Configuration

After updating a product, visit its PDP to verify:

1. **Check Color Selector:** 
   - Should only appear if `showColorSelector: true` and colors array has values
   
2. **Check Size Selector:**
   - Should only appear if `showSizeSelector: true` and sizes array has values

3. **Check Tabs:**
   - Description tab: Always visible
   - Additional Info tab: Hidden if `showAdditionalInfo: false`
   - Review tab: Hidden if `showReviews: false`

4. **Check Social Share:**
   - Share buttons: Hidden if `showSocialShare: false`

5. **Check Custom Features:**
   - Custom features appear in Additional Info tab if provided
   - Default specifications shown if no custom features

---

## Tips & Best Practices

1. **Clothing/Fashion:**
   - Enable both color and size selectors
   - Provide accurate size information
   - Add care instructions in custom features

2. **Cosmetics:**
   - Enable color selector for products with shades
   - No size selector needed
   - Add shelf life, ingredients, application tips

3. **Skincare:**
   - Usually no color or size selectors
   - Add skin type, concerns, usage instructions
   - Include key ingredients and benefits

4. **Haircare:**
   - Rarely need color/size selectors
   - Add hair type, volume, usage frequency
   - Include ingredients and shelf life

5. **Reviews:**
   - Keep enabled for most products
   - Disable only for special cases (e.g., sample products)

6. **Social Sharing:**
   - Keep enabled for better marketing
   - Disable only if privacy is a concern

---

## Troubleshooting

### Colors/Sizes not showing?
- Check `showColorSelector` or `showSizeSelector` is `true`
- Verify arrays have values: `availableColors` and `availableSizes`
- Make sure color names match supported colors (case-sensitive)

### Tabs not appearing?
- Check `showReviews` and `showAdditionalInfo` settings
- Verify `pdpFeatures` object is properly saved in database

### Custom features not showing?
- Ensure `showAdditionalInfo` is not `false`
- Check `customFeatures` array has objects with `label` and `value`
- Verify proper object structure: `{ label: "Name", value: "Value" }`

### Social buttons not hiding?
- Set `showSocialShare: false` (not just undefined)
- Clear browser cache after update

---

## MongoDB Query Examples

### Find products with color selector enabled:
```javascript
db.products.find({ "pdpFeatures.showColorSelector": true })
```

### Find products without PDP features:
```javascript
db.products.find({ pdpFeatures: { $exists: false } })
```

### Update single product:
```javascript
db.products.updateOne(
  { slug: "product-slug" },
  { $set: { "pdpFeatures.showReviews": false } }
)
```

### Add custom feature to existing product:
```javascript
db.products.updateOne(
  { slug: "product-slug" },
  { 
    $push: { 
      "pdpFeatures.customFeatures": { 
        label: "New Feature", 
        value: "New Value" 
      } 
    } 
  }
)
```

---

## Summary

The PDP features system gives you complete control over what appears on each product page. This allows you to:

✅ Show relevant options (colors/sizes) only for applicable products
✅ Hide unnecessary sections to keep pages clean
✅ Add custom product specifications per product
✅ Create different experiences for different product types
✅ Maintain consistency across product categories

For support or questions, refer to this guide or check the Product model and PDP page component.

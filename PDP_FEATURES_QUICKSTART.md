# Quick Start: PDP Features Control

## What's New?

You can now control which features appear on each product's detail page:
- ✅ Color selector (show/hide + choose colors)
- ✅ Size selector (show/hide + choose sizes)  
- ✅ Reviews section (show/hide)
- ✅ Social sharing buttons (show/hide)
- ✅ Additional info tab (show/hide)
- ✅ Custom product specifications

## Quick Setup

### Option 1: Use the Interactive Tool (Easiest)

Configure one product at a time with a simple Q&A interface:

```bash
node scripts/configure-product-pdp.js
```

Follow the prompts to:
1. Enter product slug (or type "list" to see all products)
2. Answer yes/no questions
3. Add colors, sizes, and custom features
4. Save configuration

### Option 2: Bulk Update by Category

Update all products in each category at once:

```bash
node scripts/add-pdp-features.js
```

This will automatically:
- Add color selector to cosmetics (Red, Pink, Purple, Orange, Brown)
- Add size selector to haircare (100ml, 200ml, 500ml) and fragrance (30ml, 50ml, 100ml)
- Keep skincare products simple (no colors or sizes)
- Configure appropriate custom features for each category

### Option 3: Manual Configuration

Update products directly in MongoDB or via API. See `PDP_FEATURES_GUIDE.md` for details.

## Examples

### Lipstick (with color options)
```javascript
pdpFeatures: {
  showColorSelector: true,
  availableColors: ["Red", "Pink", "Purple", "Orange"],
  showSizeSelector: false,
  showReviews: true,
  showSocialShare: true,
  showAdditionalInfo: true,
  customFeatures: [
    { label: "Type", value: "Matte Lipstick" },
    { label: "Finish", value: "Matte" },
    { label: "Net Quantity", value: "3.5 g" }
  ]
}
```

### Face Cream (no variants)
```javascript
pdpFeatures: {
  showColorSelector: false,
  showSizeSelector: false,
  showReviews: true,
  showSocialShare: true,
  showAdditionalInfo: true,
  customFeatures: [
    { label: "Skin Type", value: "All Skin Types" },
    { label: "Net Quantity", value: "50 g" }
  ]
}
```

### Shampoo (with volume options)
```javascript
pdpFeatures: {
  showColorSelector: false,
  showSizeSelector: true,
  availableSizes: ["100ml", "200ml", "500ml"],
  showReviews: true,
  showSocialShare: true,
  showAdditionalInfo: true,
  customFeatures: [
    { label: "Hair Type", value: "All Hair Types" },
    { label: "Usage", value: "Daily Use" }
  ]
}
```

## Available Colors

Black, White, Red, Blue, Green, Brown, Pink, Purple, Orange, Yellow

## Common Size Options

- **Clothing**: S, M, L, XL, XXL, XXXL
- **Liquids**: 30ml, 50ml, 100ml, 200ml, 500ml
- **Solids**: 50g, 100g, 250g
- **Shoes**: 6, 7, 8, 9, 10, 11, 12

## Testing

After configuration, visit your product page:
```
http://localhost:3000/products/your-product-slug
```

Check that:
- ✅ Colors appear (if enabled)
- ✅ Sizes appear (if enabled)
- ✅ Tabs show correctly (Description, Additional Info, Review)
- ✅ Social buttons show/hide as configured
- ✅ Custom features display in Additional Info tab

## Need Help?

See the complete guide: `PDP_FEATURES_GUIDE.md`

## Default Behavior

If no PDP features are configured:
- ❌ Color selector: Hidden
- ❌ Size selector: Hidden
- ✅ Reviews: Shown
- ✅ Social sharing: Shown
- ✅ Additional info: Shown with default content

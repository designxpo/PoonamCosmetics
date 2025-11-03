# Hero Banner Management

## Overview
The homepage now features a dynamic banner carousel that supports multiple slides with customizable CTAs, text positioning, and styling.

## Features
- **Multiple Banner Slides**: Upload and manage multiple banner images
- **Auto-play Carousel**: Automatic slide rotation with configurable interval
- **Manual Navigation**: Previous/Next arrows and dot indicators
- **Customizable Text**: Position text left, center, or right
- **Text Color Options**: Light or dark text for contrast
- **Optional Overlay**: Dark overlay for better text readability
- **Call-to-Action Buttons**: Add clickable CTAs with custom text and links

## Banner Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `title` | String | Yes | Main heading text |
| `subtitle` | String | No | Small text above title |
| `description` | String | No | Description text below title |
| `image` | String | Yes | Image URL |
| `ctaText` | String | No | Button text (e.g., "Shop Now") |
| `ctaLink` | String | No | Button link (e.g., "/products") |
| `textPosition` | String | No | "left", "center", or "right" (default: "left") |
| `textColor` | String | No | "light" or "dark" (default: "light") |
| `overlay` | Boolean | No | Dark overlay for readability (default: true) |
| `isActive` | Boolean | No | Show/hide banner (default: true) |
| `order` | Number | No | Display order (lower first) |

## Adding Banners via API

### Method 1: Using cURL

```bash
# Add a banner
curl -X POST http://localhost:3000/api/banners \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Summer Collection 2025",
    "subtitle": "New Arrivals",
    "description": "Discover our latest skincare products for the summer season",
    "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1920&q=80",
    "ctaText": "Shop Collection",
    "ctaLink": "/products",
    "textPosition": "left",
    "textColor": "light",
    "overlay": true,
    "isActive": true,
    "order": 1
  }'
```

### Method 2: Using MongoDB Compass or Studio

Connect to your MongoDB database and insert documents directly into the `banners` collection:

```javascript
{
  "title": "Care for Your Skin, Care for Your Beauty",
  "subtitle": "The Perfect Skincare",
  "description": "Make sure you use natural products that are designed for everyone",
  "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1920&q=80",
  "ctaText": "Shop Now",
  "ctaLink": "/products",
  "textPosition": "left",
  "textColor": "light",
  "overlay": true,
  "isActive": true,
  "order": 0
}
```

## Sample Banners

### Banner 1: Left-aligned with light text
```json
{
  "title": "Premium Skincare Collection",
  "subtitle": "New Arrivals",
  "description": "Discover our exclusive range of natural beauty products",
  "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1920&q=80",
  "ctaText": "Explore Now",
  "ctaLink": "/products",
  "textPosition": "left",
  "textColor": "light",
  "overlay": true,
  "isActive": true,
  "order": 0
}
```

### Banner 2: Center-aligned with light text
```json
{
  "title": "Beauty Meets Nature",
  "subtitle": "Special Offer",
  "description": "Get 20% off on all products this week",
  "image": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1920&q=80",
  "ctaText": "Shop Sale",
  "ctaLink": "/products",
  "textPosition": "center",
  "textColor": "light",
  "overlay": true,
  "isActive": true,
  "order": 1
}
```

### Banner 3: Right-aligned with dark text
```json
{
  "title": "Organic & Natural",
  "subtitle": "100% Pure",
  "description": "Experience the power of nature in every product",
  "image": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1920&q=80",
  "ctaText": "Learn More",
  "ctaLink": "/about",
  "textPosition": "right",
  "textColor": "dark",
  "overlay": false,
  "isActive": true,
  "order": 2
}
```

## Default Behavior

If no banners exist in the database, a default banner will be displayed with the original homepage content.

## Customization

### Change Auto-play Speed
Edit the `autoPlayInterval` prop in `/app/page.tsx`:
```tsx
<HeroBannerCarousel slides={banners} autoPlayInterval={7000} /> // 7 seconds
```

### Disable Auto-play
Click any navigation button (arrows or dots) to pause auto-play.

## Files Modified/Created

### New Files:
- `/components/HeroBannerCarousel.tsx` - Banner carousel component
- `/models/Banner.ts` - Banner database model
- `/app/api/banners/route.ts` - API endpoint for banners

### Modified Files:
- `/app/page.tsx` - Updated to use banner carousel

## Future Enhancements

Consider adding:
- Admin dashboard for banner management
- Image upload functionality
- A/B testing for banners
- Click tracking analytics
- Mobile-specific images
- Video banner support

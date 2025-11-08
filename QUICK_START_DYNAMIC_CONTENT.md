# Quick Start: Managing Dynamic Content

## 🎯 What Changed?
All hardcoded static text, menus, and images are now managed through the admin panel. No more editing code files!

## 📍 Where to Manage Content

### Admin Panel Location
```
/admin/dynamic-content
```

## 🔧 What You Can Manage

### 1️⃣ Highlight Boxes (Special Collections)
**What**: The 4 promotional boxes on homepage (e.g., "Bridal Chosen Makeup", "Limited Time Discount")
**Fields**:
- Title
- Description  
- Image URL
- Link destination
- Background gradient color
- Display order
- Active/Inactive status

### 2️⃣ Navigation Menu
**What**: Header menu items (Home, Bridal, Cosmetics, etc.)
**Fields**:
- Label (menu text)
- Link (href)
- Display order
- Active/Inactive status

### 3️⃣ Feature Boxes
**What**: Bottom section features (Free Shipping, 100% Authentic, etc.)
**Fields**:
- Icon (emoji)
- Title
- Description
- Display order
- Active/Inactive status

## 🚀 First Time Setup

### Option 1: Using Admin Panel (Recommended)
1. Login to admin panel
2. Go to `/admin/dynamic-content`
3. Click "Add New" in each tab
4. Fill in the form and save

### Option 2: Initialize with Defaults
Run this command once to populate default data:

```bash
# Local Development
curl -X POST http://localhost:3000/api/setup/dynamic-content

# Production
curl -X POST https://your-domain.vercel.app/api/setup/dynamic-content
```

**⚠️ Warning**: This will delete existing data and create defaults!

## 📝 How to Use Admin Panel

### Adding New Content
1. Select the appropriate tab (Highlights, Navigation, or Features)
2. Click **"Add New"** button
3. Fill in all required fields
4. Check "Active" checkbox to make it visible
5. Set order number (lower numbers appear first)
6. Click **"Save"**

### Editing Content
1. Click the **edit icon** (✏️) next to any item
2. Modify the fields
3. Click **"Save"**

### Hiding Content (Without Deleting)
- Click the **eye icon** to toggle Active/Inactive status
- Inactive items won't show on the website but remain in database

### Deleting Content
- Click the **trash icon** (🗑️)
- Confirm deletion

### Changing Display Order
- Edit the item and change the "Order" field
- Lower numbers appear first (Order 1 shows before Order 2)

## 🎨 Examples

### Example 1: Adding a New Menu Item
```
Tab: Navigation Menu
Label: "Sale"
Link: /products?sale=true
Order: 6
Active: ✓ Checked
```

### Example 2: Adding a Highlight Box
```
Tab: Highlight Boxes
Title: "Summer Sale 2024"
Description: "Up to 50% off selected items"
Image URL: https://images.unsplash.com/photo-xyz
Link: /products?sale=true
Background Gradient: from-yellow-100 to-orange-100
Order: 1
Active: ✓ Checked
```

### Example 3: Adding a Feature Box
```
Tab: Feature Boxes
Icon: 🎁
Title: "Gift Wrapping"
Description: "Free gift wrapping on all orders"
Order: 5
Active: ✓ Checked
```

## 🔄 Changes Reflect Immediately
- No need to restart the server
- No need to redeploy
- Just refresh the page to see changes

## 📱 Where Changes Appear

### Highlight Boxes
- Homepage → "Special Collections" section
- Grid of 4 image cards

### Navigation Menu  
- Desktop: Top navigation bar
- Mobile: Hamburger menu

### Feature Boxes
- Homepage → Bottom section (above footer)
- Grid of feature icons

## 🆘 Troubleshooting

### Content not showing?
1. Check if "Active" is checked ✓
2. Refresh the page with Ctrl+F5 (hard refresh)
3. Check browser console for errors (F12)

### Image not loading?
- Verify the image URL is correct and publicly accessible
- Use HTTPS URLs (not HTTP)
- Supported: Unsplash, Cloudinary, or any public image URL

### Order not working?
- Make sure order numbers are different
- Lower numbers = appear first
- Save and refresh page

## 🎓 Pro Tips

1. **Use meaningful order numbers**: Start with 10, 20, 30... leaves room to insert items later
2. **Test before activating**: Create item as Inactive, test, then activate
3. **Backup important content**: Take screenshots before making major changes
4. **Use high-quality images**: Minimum 600x600px for highlight boxes
5. **Keep descriptions short**: 1-2 lines max for better mobile display

## 📚 More Details
See `DYNAMIC_CONTENT_IMPLEMENTATION.md` for:
- Technical architecture
- API documentation
- Database schemas
- Advanced customization

---

**Need Help?** Check the main documentation or contact the development team.

# Page Banners Management System

## Overview
You can now manage custom hero banners for different pages (Products, About, Contact) from the admin panel.

## Features

### 1. **Admin Page Location**
- Navigate to: **Admin Panel → Page Banners**
- Accessible at: `/admin/page-banners`

### 2. **Customizable Elements**
For each page, you can customize:

- **Eyebrow Text**: Small uppercase text above the title (e.g., "Collections", "The Brand")
- **Title**: Main heading text
- **Description**: Supporting paragraph text
- **Background Image** (Optional): Upload a custom background image
- **Gradient Colors**: If no image is used, customize the gradient (From, Via, To colors)
- **Active Status**: Enable/disable the banner

### 3. **Supported Pages**
- **Products Page** (`/products`)
- **About Page** (`/about`)
- **Contact Page** (`/contact`)

### 4. **Default Banners**
Default banners are already initialized with the following content:

#### Products Page
- Eyebrow: "Collections"
- Title: "Explore The Various Collection of Poonam"
- Description: "Discover our curated selection of premium beauty products designed for everyone. Find your perfect match from our extensive collection."

#### About Page
- Eyebrow: "The Brand"
- Title: "Crafting Luxurious Beauty Rituals"
- Description: "We exist to empower every individual to feel runway-ready, every single day. Discover what makes Poonam Cosmetics the preferred choice for beauty enthusiasts."

#### Contact Page
- Eyebrow: "Contact"
- Title: "Let's Create Beauty Moments Together"
- Description: "Reach out to our concierge team for personalized recommendations, order support, or brand collaborations."

## How to Use

### Step 1: Access Admin Panel
1. Login to admin panel
2. Click on "Page Banners" in the sidebar menu

### Step 2: Select Page
Use the tabs at the top to switch between:
- Products Page
- About Page
- Contact Page

### Step 3: Customize Content
- Edit the eyebrow text, title, and description
- Optionally upload a background image
- Adjust gradient colors if not using an image
- Toggle active status on/off

### Step 4: Preview
- See a live preview of your changes on the right side
- The preview shows exactly how it will appear on the website

### Step 5: Save
- Click "Save Banner" button
- Changes will be reflected immediately on the website

## Technical Details

### API Endpoints
- `GET /api/page-banners` - Fetch all page banners (admin) or specific page banner
- `POST /api/page-banners` - Create new page banner
- `PUT /api/page-banners?page={page}` - Update existing page banner
- `DELETE /api/page-banners?page={page}` - Delete page banner

### Components Used
- **PageHero Component**: Reusable component that fetches and displays page banners
- **PageBanner Model**: MongoDB schema for storing banner data
- **Admin Page**: Full-featured admin interface with tabs and live preview

### Fallback Behavior
- If no custom banner is set or banner is inactive, default content is shown
- If database query fails, default content is shown (graceful degradation)
- Loading state shown while fetching data

## Example Use Cases

### 1. Seasonal Promotions
Update the Products page banner during sale seasons:
- Upload a festive background image
- Update title to "Festive Beauty Sale - Up to 50% Off"
- Update description with sale details

### 2. Brand Messaging
Customize the About page for special announcements:
- Change title to highlight awards or milestones
- Update description with recent achievements

### 3. Custom Styling
- Use background images instead of gradients for visual impact
- Adjust gradient colors to match brand themes
- Temporarily disable banners for A/B testing

## Notes
- Only one banner per page (unique constraint)
- All fields except background image are required
- Banners can be toggled active/inactive without deletion
- Preview updates in real-time as you type
- Images should be high quality (recommended 1920x400px minimum)

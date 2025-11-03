# Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- MongoDB installed (or MongoDB Atlas account)

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and update these values:
```env
MONGODB_URI=mongodb://localhost:27017/poonam-cosmetics
NEXT_PUBLIC_WHATSAPP_NUMBER=919999999999
JWT_SECRET=your-strong-secret-key
NEXTAUTH_SECRET=another-strong-secret-key
```

### 3. Start MongoDB (if using local installation)
```bash
# macOS
brew services start mongodb-community

# Or start manually
mongod --config /usr/local/etc/mongod.conf
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Create Admin Account
Open a new terminal and run:
```bash
curl -X POST http://localhost:3000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@poonamcosmetics.com",
    "password": "SecurePassword123",
    "name": "Admin User"
  }'
```

### 6. Access the Website
- **Customer Site**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

## Default Configuration
- Delivery Charge: ₹50
- Free Delivery Above: ₹999
- WhatsApp Number: Update in .env.local

## Quick Admin Tasks

1. **Add Categories**: Login to admin → Manage Categories
2. **Add Products**: Login to admin → Manage Products
3. **Update Settings**: Login to admin → Site Settings
4. **View Orders**: Check your WhatsApp messages

## Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
brew services list

# Restart MongoDB
brew services restart mongodb-community
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### TypeScript Errors
The TypeScript errors you see before installing dependencies are expected and will disappear after running `npm install`.

## Project Structure
- `/app` - Next.js pages and API routes
- `/components` - Reusable React components
- `/models` - MongoDB schemas
- `/lib` - Utility functions
- `/store` - State management (Zustand)
- `/public` - Static files

## Need Help?
See the full README.md for detailed documentation.

# Poonam Cosmetics - E-Commerce Website

A modern, full-stack e-commerce website built with Next.js 14, TypeScript, MongoDB, and WhatsApp integration for seamless order placement.

## 🌟 Features

### Customer Features
- 🛍️ Browse products by categories
- 🔍 Search functionality
- 🛒 Shopping cart with persistent storage
- 📱 Mobile-responsive design
- 💬 WhatsApp checkout (no payment gateway)
- 🚚 Delivery charge calculation with free delivery threshold
- ⭐ Featured products section

### Admin Features
- 📦 Product management (Add, Edit, Delete)
- 📂 Category management
- 🖼️ Multiple image upload per product
- 📊 Stock management
- ⚙️ Settings configuration
- 🔐 Secure admin authentication

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **State Management**: Zustand
- **Authentication**: JWT, bcryptjs
- **Icons**: React Icons
- **Notifications**: React Hot Toast

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas account)

## 🛠️ Installation

### 1. Clone the repository (or you already have the files)

```bash
cd /Users/scaletrix/Documents/Poonam_Cosmetics
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/poonam-cosmetics
# or use MongoDB Atlas: mongodb+srv://<username>:<password>@cluster.mongodb.net/poonam-cosmetics

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production
NEXTAUTH_URL=http://localhost:3000

# JWT Secret
JWT_SECRET=your-jwt-secret-here-change-this-in-production

# WhatsApp Configuration
NEXT_PUBLIC_WHATSAPP_NUMBER=919999999999
# Format: Country code + number (without + or spaces)

# Delivery Settings
NEXT_PUBLIC_DELIVERY_CHARGE=50
NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD=999

# Site Configuration
NEXT_PUBLIC_SITE_NAME=Poonam Cosmetics
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Set up MongoDB

**Option A: Local MongoDB**
```bash
# Make sure MongoDB is installed and running
brew services start mongodb-community
```

**Option B: MongoDB Atlas**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env.local`

### 5. Create the first admin user

After starting the development server, use the API to create an admin:

```bash
curl -X POST http://localhost:3000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@poonamcosmetics.com",
    "password": "YourSecurePassword123",
    "name": "Admin User"
  }'
```

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
poonam-cosmetics/
├── app/                        # Next.js 14 App Router
│   ├── api/                    # API Routes
│   │   ├── admin/              # Admin authentication
│   │   ├── categories/         # Category management
│   │   ├── products/           # Product management
│   │   └── settings/           # Site settings
│   ├── cart/                   # Shopping cart page
│   ├── products/               # Product pages
│   ├── admin/                  # Admin dashboard (to be created)
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Homepage
├── components/                 # Reusable React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   └── CartItem.tsx
├── lib/                        # Utility libraries
│   └── mongodb.ts              # MongoDB connection
├── models/                     # Mongoose models
│   ├── Admin.ts
│   ├── Category.ts
│   ├── Product.ts
│   └── Settings.ts
├── store/                      # State management
│   └── cartStore.ts            # Zustand cart store
├── types/                      # TypeScript types
│   └── index.ts
├── public/                     # Static files
├── .env.local.example          # Environment variables template
├── next.config.mjs             # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies

```

## 🎨 Customization

### Update WhatsApp Number
Edit `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local`

### Change Delivery Charges
Edit these values in `.env.local`:
- `NEXT_PUBLIC_DELIVERY_CHARGE`: Base delivery charge
- `NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD`: Minimum order for free delivery

### Customize Colors
Edit `tailwind.config.ts` to change primary and secondary colors.

## 📱 How to Use

### For Customers
1. Browse products on the homepage
2. Search or filter by category
3. Add products to cart
4. Review cart and enter optional contact information
5. Click "Order via WhatsApp" to send order details directly

### For Admins
1. Navigate to `/admin` (to be created)
2. Login with admin credentials
3. Manage products, categories, and settings
4. Monitor orders received via WhatsApp

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set all environment variables in your hosting platform:
- Use strong secrets for `JWT_SECRET` and `NEXTAUTH_SECRET`
- Update `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to your domain
- Use MongoDB Atlas for production database

## 🔒 Security Notes

- Change default JWT secrets before production
- Use HTTPS in production
- Implement rate limiting for API routes
- Add admin authentication middleware
- Validate all user inputs
- Use environment variables for sensitive data

## 📞 WhatsApp Integration

The checkout process redirects users to WhatsApp with a pre-filled message containing:
- Customer information (if provided)
- Product list with quantities and prices
- Subtotal
- Delivery charges
- Total amount

Format: `https://wa.me/{PHONE_NUMBER}?text={ENCODED_MESSAGE}`

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `brew services list`
- Check connection string in `.env.local`
- For Atlas, whitelist your IP address

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Image Loading Issues
- Ensure images are in `public/` folder
- Check Next.js image domains in `next.config.mjs`

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WhatsApp API](https://faq.whatsapp.com/general/chats/how-to-use-click-to-chat)

## 📝 License

This project is private and proprietary to Poonam Cosmetics.

## 🤝 Support

For issues or questions, contact: info@poonamcosmetics.com

---

Built with ❤️ for Poonam Cosmetics
# PoonamCosmetics

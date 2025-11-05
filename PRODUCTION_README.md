# Poonam Cosmetics - Production Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB database (Production cluster)
- Domain with SSL certificate
- Environment variables configured

### Environment Setup

Create `.env.local` with:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/poonam-cosmetics?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
NEXTAUTH_SECRET=your-nextauth-secret-min-32-chars
NEXTAUTH_URL=https://yourdomain.com

# Image Upload (if using Cloudinary)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (if configured)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## 📦 Production Build

```bash
# 1. Install dependencies
npm ci --production=false

# 2. Run production checklist
npm run build

# 3. Test locally
npm start

# 4. Create database indexes (first time only)
node scripts/create-indexes.js
```

## 🔐 Security Features

### ✅ Implemented
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Security Headers**: CSP, HSTS, X-Frame-Options, etc.
- **Environment Validation**: Checks required env vars on startup
- **Error Boundaries**: Graceful error handling
- **MongoDB Connection Pool**: Max 10, Min 2 connections
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds

### 🛡️ Security Headers
```
Content-Security-Policy
Strict-Transport-Security
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: off
```

## ⚡ Performance Optimizations

### Image Optimization
- **Formats**: AVIF, WebP fallback
- **Sizes**: Responsive images (640, 750, 828, 1080, 1200, 1920, 2048, 3840)
- **Domains**: Restricted to Cloudinary and Unsplash
- **Lazy Loading**: Automatic for all images

### Code Optimization
- **React Strict Mode**: Enabled
- **Console Removal**: Production builds remove console.log (keeps error/warn)
- **Compression**: Gzip enabled
- **Tree Shaking**: Dead code elimination

### Database Optimization
- **Indexes**: Created for all common queries
- **Connection Pooling**: Reuses connections
- **Timeouts**: Socket (45s), Server selection (5s)

## 📊 Monitoring

### Essential Metrics
1. **Response Time**: < 200ms for pages, < 500ms for API
2. **Error Rate**: < 0.1%
3. **Uptime**: > 99.9%
4. **Database Connections**: Monitor pool usage

### Recommended Tools
- **Error Tracking**: Sentry, LogRocket
- **Performance**: Vercel Analytics, Google PageSpeed
- **Uptime**: UptimeRobot, Pingdom
- **Database**: MongoDB Atlas monitoring

## 🗄️ Database Management

### Indexes
Run this script after first deployment:
```bash
node scripts/create-indexes.js
```

Creates indexes for:
- Product slug (unique)
- Category slug (unique)
- User email (unique)
- Order number (unique)
- Query optimization indexes

### Backup Strategy
1. Enable automated backups in MongoDB Atlas
2. Schedule: Daily backups, 7-day retention
3. Test restore procedure monthly

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

**Vercel Configuration:**
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`
- Framework: Next.js

### Option 2: Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
docker build -t poonam-cosmetics .
docker run -p 3000:3000 --env-file .env.local poonam-cosmetics
```

### Option 3: AWS/DigitalOcean

1. Setup Node.js server
2. Clone repository
3. Install dependencies
4. Build application
5. Setup PM2 for process management
6. Configure Nginx reverse proxy
7. Setup SSL with Let's Encrypt

```bash
# PM2 setup
npm install -g pm2
pm2 start npm --name "poonam-cosmetics" -- start
pm2 startup
pm2 save
```

## 🧪 Testing Production Build

```bash
# Build
npm run build

# Run production server locally
npm start

# Test checklist:
# ✓ Homepage loads
# ✓ Products page loads
# ✓ Product detail page loads
# ✓ Cart functionality works
# ✓ Login/register works
# ✓ Admin panel accessible
# ✓ Images load correctly
# ✓ API endpoints respond
```

## 📱 Mobile Testing

Test on:
- iOS Safari
- Android Chrome
- Different screen sizes (375px, 768px, 1024px, 1440px)

## 🔧 Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues
- Check MONGODB_URI format
- Verify IP whitelist in MongoDB Atlas
- Check connection pool limits

### Image Loading Issues
- Verify Cloudinary credentials
- Check image domains in next.config.mjs
- Review CSP headers in middleware.ts

### Rate Limiting Issues
- Adjust limits in lib/rateLimit.ts
- Consider Redis for multi-server setups

## 📚 Project Structure

```
poonam-cosmetics/
├── app/                    # Next.js 14 app directory
│   ├── admin/             # Admin panel
│   ├── products/          # Product pages
│   ├── cart/              # Shopping cart
│   └── api/               # API routes
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── ErrorBoundary.tsx # Error handling
│   └── ...
├── lib/                   # Utilities
│   ├── mongodb.ts        # Database connection
│   ├── rateLimit.ts      # Rate limiting
│   └── env.ts            # Environment validation
├── models/                # Mongoose models
├── scripts/               # Utility scripts
│   ├── create-indexes.js # Database indexes
│   └── ...
├── middleware.ts          # Security headers
└── next.config.mjs       # Next.js config
```

## 🎯 Key Features

### User Features
- Product browsing with filters
- Product detail pages with customizable features
- Shopping cart with persistent storage
- User authentication (register/login)
- Order management
- Responsive design

### Admin Features
- Product management (CRUD)
- Category management
- PDP feature customization per product
- Color/size selector controls
- Custom feature fields
- Image upload
- Order management

### PDP Customization
Each product can customize:
- Color selector (10 colors available)
- Size selector (custom sizes)
- Reviews section (show/hide)
- Social share buttons (show/hide)
- Additional information (show/hide)
- Custom features (key-value pairs)

## 📝 Scripts

```json
{
  "build": "next build",
  "start": "next start",
  "dev": "next dev",
  "lint": "next lint"
}
```

**Utility Scripts:**
- `scripts/create-indexes.js` - Create database indexes
- `scripts/auto-configure-pdp.js` - Auto-configure PDP features
- `scripts/toggle-size-selector.js` - Enable/disable size selectors

## 🔒 Admin Access

Default admin setup:
1. Register first user through UI
2. Manually set role to 'admin' in database:
```javascript
db.users.updateOne(
  { email: 'admin@poonamcosmetics.com' },
  { $set: { role: 'admin' } }
)
```
3. Access admin panel at `/admin/dashboard`

## 📞 Support

For production issues:
- Check logs in hosting platform
- Review MongoDB Atlas logs
- Check error tracking service (Sentry)
- Monitor uptime service alerts

## 🎉 Post-Deployment

✅ **Completed:**
- Security hardening
- Performance optimization
- Database indexing
- Error handling
- Rate limiting
- Environment validation

🔄 **Monitor:**
- Application errors
- Database performance
- API response times
- User experience metrics

📈 **Optimize:**
- Add Redis cache if needed
- Configure CDN for static assets
- Set up image optimization
- Implement search indexing

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Framework:** Next.js 14.2.33  
**Database:** MongoDB with Mongoose  
**Hosting:** Vercel / Self-hosted options

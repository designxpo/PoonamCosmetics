# Production Deployment Checklist

## ✅ Environment Variables
- [ ] Set `NODE_ENV=production`
- [ ] Configure `MONGODB_URI` with production database
- [ ] Set strong `JWT_SECRET` (min 32 characters)
- [ ] Set `NEXTAUTH_SECRET` (min 32 characters)
- [ ] Set `NEXTAUTH_URL` to production domain
- [ ] Configure image upload service (Cloudinary API keys)
- [ ] Set up email service credentials (if using)
- [ ] Configure payment gateway keys (if using)

## ✅ Security
- [x] Security headers configured (middleware.ts)
- [x] Rate limiting implemented
- [x] MongoDB connection pool configured
- [ ] HTTPS enabled on domain
- [ ] SSL certificate installed
- [ ] CORS configured properly
- [ ] Admin routes protected
- [ ] API routes validated
- [ ] Input sanitization enabled
- [ ] XSS protection enabled

## ✅ Performance
- [x] Image optimization configured
- [x] Console.log removed in production
- [x] Code compression enabled
- [ ] CDN configured for static assets
- [ ] Database indexes created
- [ ] Redis cache setup (optional)
- [ ] Cloudinary image optimization
- [ ] Next.js output standalone mode

## ✅ Database
- [ ] Production MongoDB cluster created
- [ ] Database indexes created for:
  - [ ] Product.slug
  - [ ] Category.slug
  - [ ] User.email
  - [ ] Order.userId
- [ ] Database backups configured
- [ ] Connection string secured
- [ ] Read replicas configured (optional)

## ✅ Monitoring & Logging
- [ ] Error tracking (Sentry/LogRocket)
- [ ] Performance monitoring (Vercel Analytics)
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Database monitoring
- [ ] Server logs configured
- [ ] Analytics (Google Analytics/Mixpanel)

## ✅ Testing
- [ ] All pages load correctly
- [ ] Authentication works
- [ ] Product CRUD operations
- [ ] Cart functionality
- [ ] Order placement
- [ ] Admin panel access
- [ ] Mobile responsiveness
- [ ] Cross-browser testing
- [ ] Load testing
- [ ] Payment flow (if applicable)

## ✅ SEO & Meta
- [ ] robots.txt configured
- [ ] sitemap.xml generated
- [ ] Meta tags on all pages
- [ ] Open Graph images
- [ ] Schema.org markup
- [ ] Google Search Console
- [ ] Analytics installed

## ✅ Build & Deploy
```bash
# 1. Install dependencies
npm install --production

# 2. Build the application
npm run build

# 3. Test production build locally
npm start

# 4. Deploy to hosting platform
# Vercel: vercel --prod
# Or follow your platform's deployment guide
```

## ✅ Post-Deployment
- [ ] Test production URL
- [ ] Verify SSL certificate
- [ ] Check all API endpoints
- [ ] Test admin login
- [ ] Test user registration/login
- [ ] Test product ordering flow
- [ ] Verify email notifications (if applicable)
- [ ] Test payment processing (if applicable)
- [ ] Monitor error logs
- [ ] Check performance metrics

## 🚀 Deployment Commands

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

### Environment Variables on Vercel
```bash
vercel env add MONGODB_URI production
vercel env add JWT_SECRET production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
```

### Manual Deployment
```bash
# Build
npm run build

# Start production server
npm start
```

## 📊 Performance Targets
- First Contentful Paint: < 1.8s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

## 🔒 Security Best Practices
1. Never commit .env files
2. Use strong passwords for admin
3. Enable 2FA for admin accounts
4. Regular security updates
5. Monitor suspicious activities
6. Regular database backups
7. Use HTTPS everywhere
8. Implement CSRF protection
9. Sanitize all user inputs
10. Keep dependencies updated

## 📝 Post-Launch Tasks
- [ ] Submit sitemap to Google
- [ ] Setup Google My Business
- [ ] Create social media accounts
- [ ] Setup customer support (WhatsApp Business)
- [ ] Create backup strategy
- [ ] Document deployment process
- [ ] Train admin users
- [ ] Create user manual
- [ ] Setup monitoring alerts
- [ ] Plan marketing campaigns

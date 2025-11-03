# Deployment Guide

## Deploying to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- MongoDB Atlas account (for production database)

### Steps

#### 1. Set up MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist all IP addresses (0.0.0.0/0) for Vercel
5. Get your connection string

#### 2. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - Poonam Cosmetics website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/poonam-cosmetics.git
git push -u origin main
```

#### 3. Deploy to Vercel
1. Go to [Vercel](https://vercel.com)
2. Click "Import Project"
3. Import your GitHub repository
4. Configure environment variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/poonam-cosmetics
NEXTAUTH_SECRET=generate-a-strong-random-string
NEXTAUTH_URL=https://your-domain.vercel.app
JWT_SECRET=another-strong-random-string
NEXT_PUBLIC_WHATSAPP_NUMBER=919999999999
NEXT_PUBLIC_DELIVERY_CHARGE=50
NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD=999
NEXT_PUBLIC_SITE_NAME=Poonam Cosmetics
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

5. Click "Deploy"

#### 4. Create Admin User
After deployment, create your admin user using the API:

```bash
curl -X POST https://your-domain.vercel.app/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@poonamcosmetics.com",
    "password": "YourSecurePassword123",
    "name": "Admin User"
  }'
```

## Alternative: Deploy to Netlify

### Steps
1. Build the project:
```bash
npm run build
```

2. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

3. Deploy:
```bash
netlify deploy --prod
```

4. Configure environment variables in Netlify dashboard

## Custom Domain Setup

### Vercel
1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Update Environment Variables
After setting up custom domain, update:
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_SITE_URL`

## Post-Deployment Checklist

- [ ] Database is accessible
- [ ] Admin user created
- [ ] Categories added
- [ ] Products added with images
- [ ] WhatsApp number configured
- [ ] Test checkout flow
- [ ] SSL certificate active (HTTPS)
- [ ] Custom domain configured (if applicable)
- [ ] Error logging set up

## Monitoring

### Set up Error Tracking
Consider adding error tracking services:
- [Sentry](https://sentry.io/)
- [LogRocket](https://logrocket.com/)

### Analytics
Add analytics to track user behavior:
- Google Analytics
- Vercel Analytics

## Security Best Practices

1. **Strong Secrets**: Use strong, randomly generated strings for JWT_SECRET and NEXTAUTH_SECRET
2. **HTTPS Only**: Ensure all traffic uses HTTPS
3. **Rate Limiting**: Consider adding rate limiting to API routes
4. **Input Validation**: All user inputs are validated
5. **MongoDB Atlas**: Use IP whitelisting when possible
6. **Regular Updates**: Keep dependencies updated

## Backup Strategy

### Database Backups
1. MongoDB Atlas provides automatic backups
2. Set up automated backup schedules
3. Test restore procedures regularly

### Code Backups
1. Keep GitHub repository updated
2. Tag releases for easy rollback
3. Document major changes

## Troubleshooting

### Build Errors
- Check all environment variables are set
- Ensure MongoDB connection string is correct
- Review build logs in Vercel dashboard

### Runtime Errors
- Check function logs in Vercel
- Verify database connectivity
- Test API endpoints individually

### Performance Issues
- Enable caching for static assets
- Optimize images using Next.js Image component
- Use serverless function optimization

## Scaling Considerations

### As your business grows:
1. Upgrade MongoDB Atlas tier
2. Add CDN for images (Cloudinary, Imgix)
3. Implement caching strategy
4. Consider dedicated hosting for high traffic

## Support

For deployment issues:
- Vercel Documentation: https://vercel.com/docs
- MongoDB Atlas Support: https://www.mongodb.com/docs/atlas/
- Next.js Deployment: https://nextjs.org/docs/deployment

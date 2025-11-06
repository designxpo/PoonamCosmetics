# MongoDB Atlas Setup for Vercel Deployment

## Critical: Whitelist Vercel's IP Addresses

The main deployment error you're seeing is:
```
MongooseServerSelectionError: Could not connect to any servers in your MongoDB Atlas cluster. 
One common reason is that you're trying to access the database from an IP that isn't whitelisted.
```

### Solution: Allow Access from Anywhere (Recommended for Vercel)

Since Vercel uses dynamic IPs, the easiest solution is to allow all IPs:

1. **Go to MongoDB Atlas Dashboard**
   - Visit: https://cloud.mongodb.com/

2. **Navigate to Network Access**
   - Click on "Network Access" in the left sidebar
   - Click "ADD IP ADDRESS" button

3. **Allow Access from Anywhere**
   - Click "ALLOW ACCESS FROM ANYWHERE" button
   - This will add `0.0.0.0/0` to your IP whitelist
   - Click "Confirm"

4. **Wait for Changes to Apply**
   - Changes may take 1-2 minutes to propagate

### Alternative: Whitelist Specific Vercel IPs (More Secure)

If you want more security, whitelist Vercel's IP ranges:

1. Get Vercel's IP addresses from: https://vercel.com/docs/concepts/edge-network/headers#x-real-ip
2. Add each IP range to MongoDB Atlas Network Access

### Environment Variables in Vercel

Make sure you've added these environment variables in your Vercel project settings:

1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add the following:

```
MONGODB_URI=mongodb+srv://poonam_cosmetics:BQ4OrBGU79f6sESw@poonamcosmetics.lae9u2d.mongodb.net/poonam-cosmetics
NEXTAUTH_SECRET=MibfxeIRgzDUNPZsR3HeVJv/GO7gEdOhU/UBtLmabRo=
JWT_SECRET=gA97DUGfTG1bnArK7SvZRXbP3i2suRFKrxdByJj/OoI=
NEXT_PUBLIC_WHATSAPP_NUMBER=919999999999
NEXT_PUBLIC_DELIVERY_CHARGE=50
NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD=999
NEXT_PUBLIC_SITE_NAME=Poonam Cosmetics
```

**Important:** Set these for "Production", "Preview", and "Development" environments.

### After Making Changes

1. Whitelist Vercel IPs in MongoDB Atlas
2. Wait 1-2 minutes
3. Redeploy your Vercel project:
   ```bash
   git push origin main
   ```
   Or trigger a redeploy in Vercel dashboard

## Deployment Checklist

- [ ] MongoDB Atlas Network Access allows 0.0.0.0/0
- [ ] All environment variables added to Vercel
- [ ] Environment variables set for all environments (Production, Preview, Development)
- [ ] Code pushed to GitHub
- [ ] Vercel deployment triggered

## Testing

After deployment, test these endpoints:
- Homepage: https://your-domain.vercel.app
- Products: https://your-domain.vercel.app/products
- Admin Login: https://your-domain.vercel.app/admin/login

If you still see errors, check Vercel deployment logs in the dashboard.

# Vercel Deployment Issues - Quick Fix Guide

## Current Errors

### 1. ❌ `/api/admin/login` - 401 Unauthorized
### 2. ❌ `/api/admin/orders` - 401 Unauthorized  
### 3. ❌ `/api/upload` - 500 Internal Server Error

---

## Fix #1: Admin Login 401 Error

### Problem
No admin user exists in your production MongoDB database.

### Solution: Create Admin User in Production Database

**Option A: Using MongoDB Compass or Atlas Web Interface**

1. Go to MongoDB Atlas: https://cloud.mongodb.com/
2. Click **Browse Collections**
3. Select your database: `poonam-cosmetics`
4. Select collection: `users`
5. Click **INSERT DOCUMENT**
6. Paste this JSON:

```json
{
  "name": "Admin",
  "email": "admin@poonamcosmetics.com",
  "password": "$2a$10$X7qzJ5vN8K9xZ1yQ2wR3.uoYvN8K9xZ1yQ2wR3.uoYvN8K9xZ1yQ2",
  "role": "admin",
  "createdAt": {"$date": "2025-11-08T00:00:00.000Z"},
  "updatedAt": {"$date": "2025-11-08T00:00:00.000Z"}
}
```

**Note**: This password is hashed. The actual password is: `admin123`

7. Click **Insert**

**Option B: Run Seed Script Against Production**

```bash
# Temporarily change MONGODB_URI in .env.local to production URI
# Then run:
node scripts/seed-database.js

# IMPORTANT: Change MONGODB_URI back to local after seeding!
```

### Test Admin Login

After creating the admin user:
1. Go to: https://poonamcosmetics.vercel.app/admin/login
2. Email: `admin@poonamcosmetics.com`
3. Password: `admin123`

---

## Fix #2: Image Upload 500 Error

### Problem
Cloudinary environment variables not set in Vercel.

### Solution: Add Cloudinary Configuration

#### Step 1: Get Cloudinary Credentials

If you haven't already:
1. Sign up: https://cloudinary.com/users/register_free
2. Go to Dashboard
3. Copy your credentials:
   - Cloud Name
   - API Key
   - API Secret

#### Step 2: Add to Vercel Environment Variables

1. Go to your Vercel project: https://vercel.com/dashboard
2. Click your project: **PoonamCosmetics**
3. Go to: **Settings** → **Environment Variables**
4. Add these 3 variables:

| Variable Name | Value | Environments |
|--------------|--------|---------------|
| `CLOUDINARY_CLOUD_NAME` | Your cloud name | ✅ All (Production, Preview, Development) |
| `CLOUDINARY_API_KEY` | Your API key | ✅ All |
| `CLOUDINARY_API_SECRET` | Your API secret | ✅ All |

5. Click **Save**
6. **Redeploy** your project (required for env vars to take effect)

#### Step 3: Redeploy

In Vercel dashboard:
1. Go to **Deployments** tab
2. Click the `⋯` menu on the latest deployment
3. Click **Redeploy**
4. Check **Use existing Build Cache**
5. Click **Redeploy**

---

## Fix #3: MongoDB IP Whitelist (If Still Having Connection Issues)

### Problem
Vercel IPs blocked by MongoDB Atlas.

### Solution

1. Go to MongoDB Atlas: https://cloud.mongodb.com/
2. Click **Network Access** (left sidebar)
3. Click **ADD IP ADDRESS**
4. Click **ALLOW ACCESS FROM ANYWHERE**
5. This adds `0.0.0.0/0`
6. Click **Confirm**
7. Wait 1-2 minutes for changes to apply

---

## Complete Vercel Environment Variables Checklist

Make sure ALL these are set in Vercel:

```bash
# MongoDB
MONGODB_URI=mongodb+srv://poonam_cosmetics:BQ4OrBGU79f6sESw@poonamcosmetics.lae9u2d.mongodb.net/poonam-cosmetics

# Auth Secrets
NEXTAUTH_SECRET=MibfxeIRgzDUNPZsR3HeVJv/GO7gEdOhU/UBtLmabRo=
JWT_SECRET=gA97DUGfTG1bnArK7SvZRXbP3i2suRFKrxdByJj/OoI=

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=919999999999

# Delivery
NEXT_PUBLIC_DELIVERY_CHARGE=50
NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD=999

# Site
NEXT_PUBLIC_SITE_NAME=Poonam Cosmetics
```

**Important**: Variables starting with `NEXT_PUBLIC_` should be set for ALL environments.

---

## Temporary Workaround for Image Uploads

If you can't set up Cloudinary immediately:

### Option 1: Use Image URLs Instead
- Upload images to imgbb.com, imgur.com, or similar
- Paste the direct URL in your admin panel

### Option 2: Use Demo Cloudinary (Testing Only)
The upload route will use demo credentials if Cloudinary env vars aren't set, but this is NOT suitable for production.

---

## Testing Your Deployment

After making all fixes:

### 1. Test Admin Login
```
URL: https://poonamcosmetics.vercel.app/admin/login
Email: admin@poonamcosmetics.com
Password: admin123
```

### 2. Test Image Upload
1. Login to admin
2. Go to Products → New Product
3. Try uploading an image
4. Should see Cloudinary URL if configured

### 3. Test Orders API
1. Login as admin
2. Go to Orders section
3. Should load without 401 errors

---

## Common Issues & Solutions

### Issue: "Invalid credentials" when logging in
- ✅ Make sure admin user exists in production database
- ✅ Email: `admin@poonamcosmetics.com`
- ✅ Password: `admin123`

### Issue: Upload still returns 500
- ✅ Check Cloudinary credentials are correct
- ✅ Redeploy after adding environment variables
- ✅ Check Vercel deployment logs for specific error

### Issue: MongoDB connection errors
- ✅ Whitelist 0.0.0.0/0 in MongoDB Atlas Network Access
- ✅ Verify MONGODB_URI is correct in Vercel
- ✅ Wait 1-2 minutes after changing network settings

### Issue: Environment variables not working
- ✅ Make sure you clicked "Save" in Vercel
- ✅ Redeploy after adding env vars (required!)
- ✅ Set for all environments (Production, Preview, Development)

---

## Verification Checklist

- [ ] MongoDB Atlas Network Access allows 0.0.0.0/0
- [ ] Admin user created in production database
- [ ] All environment variables added to Vercel
- [ ] Cloudinary account created and configured
- [ ] Redeployed after adding environment variables
- [ ] Tested admin login on production URL
- [ ] Tested image upload on production URL

---

## Need Help?

If issues persist:
1. Check Vercel deployment logs (Deployments → Click deployment → View Function Logs)
2. Check MongoDB Atlas monitoring (Charts → Real-time)
3. Test Cloudinary credentials in their dashboard

## Quick Commands

```bash
# Check if MongoDB is accessible
curl -X POST https://poonamcosmetics.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'

# Should return response (even if wrong credentials)
```

---

**Priority Order:**
1. 🔥 **First**: Whitelist IPs in MongoDB Atlas
2. 🔥 **Second**: Create admin user in production database  
3. 🔥 **Third**: Add Cloudinary environment variables
4. ✅ **Last**: Redeploy and test

Good luck! 🚀

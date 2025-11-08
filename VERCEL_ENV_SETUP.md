# Vercel Environment Variables Setup

## 🚨 **URGENT: Both APIs Failing on Vercel**

Your production site is experiencing multiple 500 errors:
- ❌ `/api/products` - Database connection failing
- ❌ `/api/upload` - Cloudinary not configured

**Root Cause**: Environment variables are not set on Vercel.

---

## ✅ **Required Environment Variables**

Copy these **EXACT** values to Vercel:

### 1. MongoDB Connection (Required for all database operations)
```bash
MONGODB_URI=mongodb+srv://poonam_cosmetics:BQ4OrBGU79f6sESw@poonamcosmetics.lae9u2d.mongodb.net/poonam-cosmetics
```

### 2. JWT Secret (Required for authentication)
```bash
JWT_SECRET=gA97DUGfTG1bnArK7SvZRXbP3i2suRFKrxdByJj/OoI=
```

### 3. NextAuth Configuration (Required for login)
```bash
NEXTAUTH_SECRET=MibfxeIRgzDUNPZsR3HeVJv/GO7gEdOhU/UBtLmabRo=
NEXTAUTH_URL=https://poonamcosmetics.vercel.app
```
⚠️ **Change URL to your actual Vercel domain**

### 4. Cloudinary Configuration (Required for image uploads)
```bash
CLOUDINARY_CLOUD_NAME=dksuiui4c
CLOUDINARY_API_KEY=291343154813766
CLOUDINARY_API_SECRET=_23V6o9ssL5wTQlkRU5TUARcysI
```

### 5. WhatsApp & Site Configuration (Optional but recommended)
```bash
NEXT_PUBLIC_WHATSAPP_NUMBER=919999999999
NEXT_PUBLIC_DELIVERY_CHARGE=50
NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD=999
NEXT_PUBLIC_SITE_NAME=Poonam Cosmetics
NEXT_PUBLIC_SITE_URL=https://poonamcosmetics.vercel.app
```
⚠️ **Update WhatsApp number and site URL**

---

## 📋 **Step-by-Step Setup** (5 Minutes)
1. Visit https://vercel.com
2. Login to your account
3. Select your project: **PoonamCosmetics**

### Step 2: Navigate to Settings
1. Click on **Settings** tab
2. Click on **Environment Variables** in the left sidebar

### Step 3: Add Each Variable
For each environment variable above:

1. **Key**: Enter the variable name (e.g., `CLOUDINARY_CLOUD_NAME`)
2. **Value**: Enter the variable value (e.g., `dksuiui4c`)
3. **Environment**: Select all three:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
4. Click **Save**

### Step 4: Redeploy
After adding all variables:
1. Go to **Deployments** tab
2. Click the three dots (...) next to the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

---

## Current Issue: Image Upload Failing

The error you're seeing:
```
POST /api/upload 500 (Internal Server Error)
```

**Cause**: Cloudinary environment variables are not set on Vercel.

**Solution**: Add the three Cloudinary variables listed above to Vercel, then redeploy.

---

## Vercel Environment Variables Checklist

### MongoDB Atlas Setup
- [ ] Whitelisted IP: `0.0.0.0/0` in MongoDB Atlas Network Access
- [ ] Created database user with read/write permissions
- [ ] Copied connection string to `MONGODB_URI`

### Cloudinary Setup
- [ ] Added `CLOUDINARY_CLOUD_NAME` to Vercel
- [ ] Added `CLOUDINARY_API_KEY` to Vercel
- [ ] Added `CLOUDINARY_API_SECRET` to Vercel

### JWT Secret
- [ ] Generated secure random string (minimum 32 characters)
- [ ] Added `JWT_SECRET` to Vercel

### Deployment
- [ ] All environment variables added
- [ ] Redeployed application
- [ ] Verified deployment successful
- [ ] Tested image upload functionality

---

## Testing After Setup

### 1. Test Image Upload
1. Login to admin panel: `https://your-domain.vercel.app/admin/login`
2. Go to Products section
3. Try uploading a product image
4. Should upload successfully to Cloudinary

### 2. Test Banners
1. Go to Banners section
2. Try uploading a banner image
3. Should upload successfully

### 3. Check Logs
If still having issues:
1. Go to Vercel Dashboard → Your Project
2. Click on **Deployments**
3. Click on the latest deployment
4. Click on **Functions** tab
5. Check logs for error messages

---

## Quick Copy-Paste Commands

### Generate JWT Secret (Run locally)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Your Cloudinary Credentials
```
CLOUDINARY_CLOUD_NAME=dksuiui4c
CLOUDINARY_API_KEY=291343154813766
CLOUDINARY_API_SECRET=_23V6o9ssL5wTQlkRU5TUARcysI
```

### MongoDB URI Format
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

---

## Common Issues

### Issue 1: "Cloudinary is not configured"
**Error Message**: 
```
Cloudinary is not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to environment variables.
```

**Solution**: 
- Add all three Cloudinary variables to Vercel
- Make sure variable names are exactly as shown (case-sensitive)
- Redeploy after adding

### Issue 2: "Authentication failed"
**Error Message**: 
```
Cloudinary authentication failed. Please check your API credentials.
```

**Solution**:
- Double-check the values copied correctly
- No extra spaces before/after values
- API Secret is the full value including special characters

### Issue 3: MongoDB Connection Fails
**Error Message**: 
```
MongooseServerSelectionError: Could not connect to any servers
```

**Solution**:
- Check MongoDB Atlas Network Access has `0.0.0.0/0` whitelisted
- Verify connection string is correct
- Check database user has proper permissions

### Issue 4: Changes Not Reflecting
**Solution**:
- Wait 1-2 minutes for Vercel to propagate changes
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Check correct deployment is active

---

## Video Tutorial (Optional)

If you prefer a visual guide, search YouTube for:
- "How to add environment variables to Vercel"
- "Setting up Cloudinary on Vercel"

---

## Need Help?

1. **Check Vercel Logs**: Most errors are visible in Vercel function logs
2. **MongoDB Atlas**: Ensure network access is properly configured
3. **Cloudinary Dashboard**: Verify credentials at https://cloudinary.com/console
4. **Environment Variables**: Double-check all values are copied correctly

---

**Status**: ⚠️ **ACTION REQUIRED**

Please add the Cloudinary environment variables to Vercel and redeploy to fix the image upload error.

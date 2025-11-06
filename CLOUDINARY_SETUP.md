# Cloudinary Setup for Image Uploads

## Why Cloudinary?

Vercel's serverless functions have a **read-only filesystem** (except `/tmp`). You cannot save uploaded images to `/public` folder on Vercel. **Cloudinary** is a free cloud storage service perfect for hosting images.

## Setup Steps

### 1. Create Free Cloudinary Account

1. Go to: https://cloudinary.com/users/register_free
2. Sign up for a free account
3. Verify your email

### 2. Get Your Credentials

After logging in, go to your **Dashboard**:

1. You'll see your **Account Details**:
   - **Cloud Name**: (e.g., `dpxxxxxqr`)
   - **API Key**: (e.g., `123456789012345`)
   - **API Secret**: (click "Show" to reveal)

2. Copy these three values

### 3. Add to Local Environment (`.env.local`)

Update your `.env.local` file:

```bash
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

Replace `your_cloud_name_here`, etc., with your actual Cloudinary credentials.

### 4. Add to Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add these three variables:

| Name | Value | Environments |
|------|-------|--------------|
| `CLOUDINARY_CLOUD_NAME` | Your cloud name | Production, Preview, Development |
| `CLOUDINARY_API_KEY` | Your API key | Production, Preview, Development |
| `CLOUDINARY_API_SECRET` | Your API secret | Production, Preview, Development |

4. Click **Save**

### 5. Restart Development Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## Free Tier Limits

Cloudinary's free tier includes:
- ✅ **25 GB storage**
- ✅ **25 GB bandwidth/month**
- ✅ **Unlimited transformations**
- ✅ **No credit card required**

Perfect for small to medium e-commerce sites!

## How It Works

When a user uploads an image:
1. Image is sent to your Next.js API (`/api/upload`)
2. API uploads image to Cloudinary
3. Cloudinary returns a secure URL
4. URL is saved in your MongoDB database
5. Images are served from Cloudinary's CDN (super fast!)

## Test Image Upload

After setup, try uploading a product image in the admin panel:
1. Go to: http://localhost:3000/admin/products/new
2. Click "Upload Image"
3. Select an image file
4. Check if it uploads successfully

## Folder Organization

Images are automatically organized in Cloudinary:
- All uploads go to: `poonam-cosmetics/` folder
- You can see them in your Cloudinary Media Library

## Troubleshooting

### Error: "Cannot find module 'cloudinary'"
```bash
npm install cloudinary
```

### Error: "Invalid credentials"
- Double-check your `CLOUDINARY_CLOUD_NAME`, `API_KEY`, and `API_SECRET`
- Make sure there are no extra spaces
- Restart your dev server after adding environment variables

### Images not uploading
1. Check Cloudinary dashboard → Settings → Security
2. Ensure "Enable unsigned uploading" is OFF (we use signed uploads)
3. Check browser console for errors

## Security Notes

⚠️ **Never commit `.env.local` to Git** - It contains your API secret!

Your `.gitignore` should include:
```
.env.local
.env*.local
```

## Alternative: Continue Using URLs

If you don't want to set up Cloudinary right now, you can still:
- Paste direct image URLs from other sources
- Use Unsplash URLs (https://images.unsplash.com/...)
- Upload to free services like imgbb.com and paste URLs

But for production, Cloudinary is highly recommended! 🚀

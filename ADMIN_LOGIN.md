# 🔐 Admin Login Instructions

## Admin Credentials

**Email:** `admin@poonamcosmetics.com`  
**Password:** `Admin@123`

---

## How to Access Admin Panel

### Method 1: Direct Admin Login
1. Go to: **http://localhost:3003/admin/login**
2. Enter the credentials above
3. Click "Sign In"
4. You'll be redirected to the admin dashboard

### Method 2: Via Admin Route
1. Go to: **http://localhost:3003/admin**
2. You'll be automatically redirected to the login page
3. Enter credentials and sign in

---

## Admin Panel Features

Once logged in, you can access:

- **Dashboard** (`/admin/dashboard`) - Overview with stats
- **Products** (`/admin/products`) - Manage products
- **Categories** (`/admin/categories`) - Manage categories
- **Orders** (`/admin/orders`) - View and manage orders
- **Banners** (`/admin/banners`) - Manage hero carousel
- **Collections** (`/admin/collections`) - Manage featured collections
- **Users** (`/admin/users`) - User management
- **Settings** (`/admin/settings`) - Site configuration

---

## Troubleshooting

### If you can't login:

1. **Clear browser cache and localStorage:**
   - Open DevTools (F12)
   - Go to Application > Storage > Clear site data
   - Refresh the page

2. **Verify admin exists in database:**
   ```bash
   node scripts/createAdmin.js
   ```
   This will show if admin exists or create a new one

3. **Check MongoDB connection:**
   - Ensure MongoDB is running
   - Verify .env.local has correct MONGODB_URI

4. **Check browser console for errors:**
   - Press F12 to open DevTools
   - Look for any red errors in Console tab

---

## Security Notes

⚠️ **Important:**
- This password is for development only
- Change it before going to production
- Never commit credentials to git
- Use strong passwords in production

---

## Additional Admin Accounts

To create additional admin accounts:

1. Run the create admin script:
   ```bash
   node scripts/createAdmin.js
   ```

2. Or use the API endpoint:
   ```bash
   curl -X POST http://localhost:3003/api/admin/register \
     -H "Content-Type: application/json" \
     -d '{"email":"admin2@example.com","password":"SecurePass123","name":"Admin Two"}'
   ```

---

## Logout

To logout from admin panel:
- Click the "Logout" button in the sidebar
- Or click your profile dropdown and select "Logout"

You'll be redirected back to the main website.

---

**Admin Panel URL:** http://localhost:3003/admin/login

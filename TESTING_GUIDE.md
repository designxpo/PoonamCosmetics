# Quick Start Guide - Testing Authentication System

## 🚀 Getting Started

### 1. Start the Development Server
```bash
npm run dev
```
Server will start on port **3002** (since 3000 and 3001 are occupied).

### 2. Set Environment Variables
Make sure `.env.local` has:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_for_jwt_tokens
```

### 3. Seed Database (if not already done)
```bash
node scripts/seedData.js
```
This creates 71 products across 6 categories.

---

## 🧪 Testing Scenarios

### Scenario 1: User Registration
1. Navigate to `http://localhost:3002/register`
2. Fill in the form:
   - **Name**: John Doe
   - **Email**: john@example.com
   - **Phone**: 9876543210
   - **Password**: test123
   - **Confirm Password**: test123
3. Click **"Create Account"**
4. Should see success toast and redirect to `/account`
5. Check Header - should see user avatar with "John" and dropdown menu

### Scenario 2: User Login
1. Navigate to `http://localhost:3002/login`
2. Enter credentials:
   - **Email**: john@example.com
   - **Password**: test123
3. Click **"Login"**
4. Should redirect to `/account` dashboard
5. Header should show user info

### Scenario 3: Account Dashboard
1. After login, you're at `/account`
2. Check **My Orders** tab:
   - Should show "No orders yet" (empty state)
   - Click "Start Shopping" to go to products
3. Check **Profile** tab:
   - Should display user information
   - Name, email, phone, address fields

### Scenario 4: Logout
**Desktop:**
1. Click on user avatar in header
2. Dropdown menu appears
3. Click **"Logout"**
4. Should see success toast
5. Redirected to home page
6. Header now shows "Login | Register"

**Mobile:**
1. Open mobile menu (hamburger icon)
2. Scroll to bottom
3. Click **"Logout"**
4. Should see success toast
5. Menu closes, redirected to home

### Scenario 5: Create Test Order (Manual)
To test order tracking, you need to create an order in MongoDB:

```javascript
// In MongoDB shell or Compass
db.orders.insertOne({
  orderNumber: "ORD1234567890",
  guestInfo: {
    name: "Guest User",
    email: "guest@example.com",
    phone: "9876543210"
  },
  items: [
    {
      product: ObjectId("product_id_here"), // Use a real product ID
      quantity: 2,
      price: 799
    }
  ],
  totalAmount: 1598,
  deliveryAddress: {
    street: "123 Main St",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001"
  },
  status: "confirmed",
  paymentMethod: "cod",
  trackingUpdates: [
    {
      status: "pending",
      message: "Order placed successfully",
      timestamp: new Date()
    },
    {
      status: "confirmed",
      message: "Order confirmed by seller",
      timestamp: new Date()
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Scenario 6: Guest Order Tracking
1. Navigate to `http://localhost:3002/track-order`
2. Enter order number: `ORD1234567890`
3. Click **"Track Order"**
4. Should see:
   - Order summary with status badge
   - Order items
   - Total amount
   - Delivery address
   - Tracking timeline with visual indicators

### Scenario 7: Protected Route
1. Open browser incognito/private mode
2. Try to access `http://localhost:3002/account`
3. Should redirect to `/login` (not authenticated)
4. Login first, then access `/account` successfully

### Scenario 8: Persistent Session
1. Login to the site
2. Close the browser completely
3. Reopen and visit `http://localhost:3002`
4. Header should still show user as logged in
5. Can access `/account` without logging in again
6. Session persists for 7 days (JWT expiry)

### Scenario 9: Mobile Menu
1. Resize browser to mobile width (< 1024px)
2. Click hamburger menu
3. **When logged in:**
   - Should see user info at top (avatar, name, email)
   - Navigation links
   - "My Orders" link
   - "My Profile" link
   - "Logout" button
4. **When logged out:**
   - Navigation links
   - "Login" link
   - "Register" link

### Scenario 10: User Avatar Dropdown
1. Login on desktop view
2. Click on user avatar (circular gradient with initial)
3. Dropdown menu appears with:
   - User info (name, email)
   - "My Orders" link
   - "My Profile" link
   - "Logout" button (red)
4. Click outside dropdown - should close
5. Click "My Orders" - goes to `/account` with orders tab
6. Click "My Profile" - goes to `/account` with profile tab

---

## 🎯 Verification Checklist

### Authentication Features
- [ ] User can register with valid details
- [ ] Email validation prevents duplicate accounts
- [ ] Password must be minimum 6 characters
- [ ] Password confirmation must match
- [ ] User can login with correct credentials
- [ ] Invalid credentials show error toast
- [ ] JWT token stored in localStorage
- [ ] Session persists after browser close
- [ ] User can logout successfully
- [ ] Logout clears localStorage
- [ ] Logout redirects to home page

### Header Component
- [ ] Desktop shows user avatar when logged in
- [ ] Desktop shows "Login | Register" when logged out
- [ ] User avatar shows first letter of name
- [ ] Clicking avatar opens dropdown menu
- [ ] Dropdown shows user info
- [ ] Dropdown has "My Orders" and "My Profile" links
- [ ] Dropdown has "Logout" button
- [ ] Clicking outside closes dropdown
- [ ] Mobile menu shows user info when logged in
- [ ] Mobile menu has auth links when logged out

### Account Dashboard
- [ ] Protected route redirects if not authenticated
- [ ] Sidebar shows user name and email
- [ ] "My Orders" tab shows order list or empty state
- [ ] "Profile" tab shows user information
- [ ] Order status badges show correct colors
- [ ] Order items display properly
- [ ] Empty state has "Start Shopping" button
- [ ] Logout button works from sidebar

### Order Tracking
- [ ] Guest can track order by order number
- [ ] Order summary displays correctly
- [ ] Status badge shows current status
- [ ] Order items list with images
- [ ] Total amount displayed
- [ ] Delivery address shown
- [ ] Tracking timeline visible
- [ ] Timeline has colored status circles
- [ ] Timeline shows status messages
- [ ] Timeline shows timestamps
- [ ] Status icons match status type

### Toast Notifications
- [ ] Registration success toast
- [ ] Registration error toast
- [ ] Login success toast
- [ ] Login error toast
- [ ] Logout success toast
- [ ] Order tracking error toast

### Responsive Design
- [ ] All pages responsive on mobile (< 768px)
- [ ] All pages responsive on tablet (768px - 1024px)
- [ ] All pages responsive on desktop (> 1024px)
- [ ] Mobile menu works properly
- [ ] Desktop dropdown works properly
- [ ] Forms are readable on all screen sizes

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
**Solution**: Check `MONGODB_URI` in `.env.local` is correct and MongoDB is running.

### Issue: "JWT_SECRET is not defined"
**Solution**: Add `JWT_SECRET=your_secret_key` to `.env.local` file.

### Issue: "Order number not found"
**Solution**: Make sure the order exists in database with exact order number.

### Issue: "User already exists"
**Solution**: Email is already registered. Use a different email or login instead.

### Issue: "Invalid credentials"
**Solution**: Check email and password are correct. Password is case-sensitive.

### Issue: "Token expired"
**Solution**: JWT token expires after 7 days. Logout and login again.

### Issue: "Redirect loop on /account"
**Solution**: Clear localStorage and cookies, then login again.

### Issue: "User avatar not showing"
**Solution**: User name should not be empty. Check user document in MongoDB.

### Issue: "Dropdown not closing"
**Solution**: Click outside the dropdown or press Escape key.

---

## 📱 Browser DevTools Testing

### Check LocalStorage
1. Open DevTools (F12)
2. Go to **Application** tab
3. Expand **Local Storage**
4. Click on your domain
5. Look for `auth-storage` key
6. Should see JSON with user data and token

### Check Network Requests
1. Open DevTools (F12)
2. Go to **Network** tab
3. Login or register
4. Look for API calls:
   - `POST /api/auth/login`
   - `POST /api/auth/register`
   - `GET /api/orders`
5. Check request/response payloads

### Check Console Errors
1. Open DevTools (F12)
2. Go to **Console** tab
3. Look for any errors (red messages)
4. Should be no errors during normal usage

---

## 🎨 Visual Verification

### Status Colors
- **Yellow**: Pending orders
- **Blue**: Confirmed orders
- **Purple**: Processing orders
- **Indigo**: Shipped orders
- **Green**: Delivered orders
- **Red**: Cancelled orders

### User Avatar
- Circular gradient background (pink to orange)
- White text with first letter of name
- Subtle shadow on hover
- Size: 32px (mobile), 40px (desktop)

### Dropdown Menu
- White background
- Rounded corners (12px)
- Subtle shadow
- Border: light gray
- Hover effect on items
- Logout button in red

### Timeline
- Colored circles for each status
- Vertical line connecting circles
- Status icons inside circles
- Timestamp on the right
- Message below icon

---

## 🚀 Next Testing Steps

After verifying authentication works:

1. **Test Checkout Flow**: Add items to cart and create orders
2. **Test Admin Features**: Create admin user and test order management
3. **Test Email/WhatsApp**: Send notifications for order updates
4. **Test Profile Edit**: Update user information
5. **Test Password Reset**: Forgot password and reset flow
6. **Test Wishlist**: Add products to wishlist
7. **Test Reviews**: Add product reviews

---

## 📞 Support

If you encounter any issues:
1. Check this guide first
2. Check browser console for errors
3. Check MongoDB connection
4. Verify environment variables
5. Clear localStorage and try again

---

**Happy Testing! 🎉**

*Last Updated: [Current Date]*
*Project: Poonam Cosmetics*

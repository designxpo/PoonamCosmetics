# Authentication-Required Checkout Flow

## Overview
Users must be logged in or create an account before placing orders. Guest checkout is not allowed.

## User Journey

### For New Users (Not Logged In)
1. User browses products and adds items to cart
2. User clicks "Proceed to Checkout" on cart page
3. System checks authentication status
4. If not authenticated:
   - Shows error toast: "Please login or create an account to place an order"
   - Redirects to `/login?redirect=/cart`
5. User can either:
   - **Login**: Enter credentials → Redirect back to `/cart`
   - **Register**: Click "Create one" link → Redirects to `/register?redirect=/cart` → Create account → Redirect back to `/cart`
6. User completes checkout with authenticated session

### For Existing Users (Logged In)
1. User browses products and adds items to cart
2. User clicks "Proceed to Checkout" on cart page
3. System validates authentication (passes)
4. User completes order details and places order
5. Order is created with user ID attached

## Implementation Details

### Cart Page (`/app/cart/page.tsx`)
```tsx
const handleCheckout = async () => {
  // Check if user is authenticated
  if (!isAuthenticated) {
    toast.error('Please login or create an account to place an order');
    router.push('/login?redirect=/cart');
    return;
  }
  
  // Continue with order creation...
}
```

### Login Page (`/app/login/page.tsx`)
- Reads `redirect` query parameter from URL
- After successful login, redirects to `redirect` URL or `/account` (default)
- "Create one" link preserves redirect parameter: `/register?redirect=/cart`

```tsx
const searchParams = useSearchParams();
const redirectUrl = searchParams.get('redirect') || '/account';

// After successful login
router.push(redirectUrl);
```

### Register Page (`/app/register/page.tsx`)
- Reads `redirect` query parameter from URL
- After successful registration, redirects to `redirect` URL or `/account` (default)
- "Sign in" link preserves redirect parameter: `/login?redirect=/cart`

```tsx
const searchParams = useSearchParams();
const redirectUrl = searchParams.get('redirect') || '/account';

// After successful registration
router.push(redirectUrl);
```

## Benefits

1. **Better Customer Tracking**: All orders linked to user accounts
2. **Order History**: Users can view their past orders
3. **Easier Support**: Customer support can access full order history
4. **Marketing**: Build customer database for promotions and newsletters
5. **Fraud Prevention**: Reduces risk of fraudulent orders
6. **User Experience**: Seamless return to checkout after authentication

## Technical Features

- ✅ Redirect parameter preserved across login/register navigation
- ✅ Toast notifications for clear user feedback
- ✅ Automatic redirection after successful authentication
- ✅ Smart link handling (only adds redirect param if not default)
- ✅ Protected order creation endpoint (requires JWT token)
- ✅ Session persistence with localStorage (Zustand)

## Edge Cases Handled

1. **Cart → Login → Register → Cart**: Redirect parameter preserved through entire flow
2. **Direct Access to Login/Register**: No redirect parameter, defaults to `/account`
3. **Empty Cart**: Checkout button disabled, no authentication check needed
4. **Session Expiry**: User redirected to login with current page as redirect URL

## Related Files

- `/app/cart/page.tsx` - Checkout authentication check
- `/app/login/page.tsx` - Login with redirect support
- `/app/register/page.tsx` - Registration with redirect support
- `/store/authStore.ts` - Authentication state management
- `/app/api/orders/route.ts` - Protected order creation endpoint

## Testing Checklist

- [ ] Guest user can browse and add to cart
- [ ] Checkout redirects to login with proper redirect URL
- [ ] Login redirects back to cart after success
- [ ] Register link on login page preserves redirect parameter
- [ ] Register redirects back to cart after account creation
- [ ] Login link on register page preserves redirect parameter
- [ ] Order creation requires valid JWT token
- [ ] Order is associated with correct user ID
- [ ] Session persists across page refreshes
- [ ] Error messages are clear and actionable

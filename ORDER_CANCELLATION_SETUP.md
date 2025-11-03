# Order Auto-Cancellation Setup

## Overview
Orders that are created when users click "Order via WhatsApp" but never confirmed will be automatically cancelled after 24 hours.

## How It Works

### 1. Order Creation Flow
When a user clicks "Order via WhatsApp":
1. An order is created in the database with status: **"pending"**
2. Order number is generated (e.g., `ORD1730620123456`)
3. WhatsApp message includes the order number
4. User is redirected to WhatsApp
5. Cart is cleared and user sees their order in "My Account"

### 2. Manual Cancellation
Users can cancel pending orders manually:
- Go to "My Account" → "My Orders"
- Find pending orders
- Click "Cancel Order" button
- Only works for orders with **"pending"** status

### 3. Auto-Cancellation (After 24 Hours)
Pending orders are automatically cancelled if not confirmed within 24 hours.

#### Setup Auto-Cancellation Cron Job:

**Option A: Using Vercel Cron Jobs (Recommended for Vercel deployment)**

1. Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/orders/auto-cancel",
    "schedule": "0 * * * *"
  }]
}
```

**Option B: Using External Cron Service (cron-job.org, EasyCron, etc.)**

1. Set up a cron job to call:
   ```
   POST https://your-domain.com/api/orders/auto-cancel
   ```

2. Add header:
   ```
   Authorization: Bearer your_cron_secret_here
   ```

3. Schedule: Every hour (`0 * * * *`)

**Option C: Using GitHub Actions**

1. Create `.github/workflows/auto-cancel-orders.yml`:
```yaml
name: Auto Cancel Pending Orders

on:
  schedule:
    - cron: '0 * * * *'  # Every hour
  workflow_dispatch:  # Manual trigger

jobs:
  cancel-orders:
    runs-on: ubuntu-latest
    steps:
      - name: Call Auto-Cancel API
        run: |
          curl -X POST https://your-domain.com/api/orders/auto-cancel \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

2. Add `CRON_SECRET` to GitHub repository secrets

## Environment Variables

Add to `.env.local`:

```env
# Cron Job Secret (for auto-cancel endpoint security)
CRON_SECRET=your_random_secret_key_here

# WhatsApp Business Number (for checkout)
NEXT_PUBLIC_WHATSAPP_NUMBER=919999999999
```

## Testing

### Test Manual Cancellation:
1. Add items to cart
2. Fill in customer details
3. Click "Order via WhatsApp"
4. Go to "My Account"
5. Click "Cancel Order" on the pending order
6. Status should change to "cancelled"

### Test Auto-Cancellation:
1. Create a test order
2. Manually update `createdAt` in MongoDB to 25 hours ago:
   ```javascript
   db.orders.updateOne(
     { orderNumber: "ORD1234567890" },
     { $set: { createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000) } }
   )
   ```
3. Call the auto-cancel API:
   ```bash
   curl -X POST http://localhost:3002/api/orders/auto-cancel \
     -H "Authorization: Bearer your_cron_secret"
   ```
4. Check order status - should be "cancelled"

## Order Status Flow

```
pending → confirmed → processing → shipped → delivered
   ↓
cancelled (can cancel anytime from pending status)
```

## Benefits

1. **Prevents Abandoned Orders**: Clears out orders where users opened WhatsApp but didn't send message
2. **Clean Order Management**: Only confirmed orders remain in "pending" status
3. **Better Analytics**: Accurate order conversion rates
4. **User Control**: Users can manually cancel if they change their mind

## Notes

- Only **"pending"** orders can be cancelled
- Orders older than 24 hours are auto-cancelled
- Cancelled orders remain in database for record-keeping
- Users can still view cancelled orders in "My Account"
- Admin can manually confirm orders via WhatsApp to change status from "pending" to "confirmed"

## Future Enhancements

1. Send email/SMS notification before auto-cancellation
2. Allow users to re-order cancelled items
3. Add grace period option in admin settings
4. Track cancellation reasons
5. WhatsApp webhook integration to auto-confirm orders

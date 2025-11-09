'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import CartItem from '@/components/CartItem';
import Link from 'next/link';
import { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { isAuthenticated, user, token } = useAuthStore();
  const router = useRouter();
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const deliveryCharge = 50;
  const freeDeliveryThreshold = 999;
  const subtotal = getTotalPrice();
  const deliveryFee = subtotal >= freeDeliveryThreshold ? 0 : deliveryCharge;
  const total = subtotal + deliveryFee;

  const handleCheckout = async () => {
    if (items.length === 0) return;

    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('Please login or create an account to place an order');
      router.push('/login?redirect=/cart');
      return;
    }

    // Check if user has required information
    if (!user?.name || !user?.phone || !user?.address?.street || !user?.address?.city || !user?.address?.state || !user?.address?.pincode) {
      toast.error('Please complete your delivery address in your account settings');
      router.push('/account?tab=profile');
      return;
    }

    setIsCreatingOrder(true);

    try {
      // Create pending order in database
      const orderData: any = {
        items: items.map(item => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          image: item.image
        })),
        totalAmount: total,
        deliveryAddress: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          pincode: user.address?.pincode || ''
        },
        paymentMethod: 'cod',
        status: 'pending',
        user: user._id
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || data.error || 'Failed to create order');
      }

      const order = data.order;

      // Build WhatsApp message with order number
      let message = `*New Order from Poonam Cosmetics*\n\n`;
      message += `*Order Number:* ${order.orderNumber}\n\n`;
      
      message += `*Customer Name:* ${user.name}\n`;
      message += `*Email:* ${user.email}\n`;
      message += `*Phone:* ${user.phone}\n`;
      message += `*Delivery Address:*\n`;
      message += `${user.address?.street}\n`;
      message += `${user.address?.city}, ${user.address?.state} - ${user.address?.pincode}\n`;
      message += `\n*Order Details:*\n`;
      
      items.forEach((item, index) => {
        message += `\n${index + 1}. ${item.name}\n`;
        message += `   Qty: ${item.quantity} × ₹${item.price.toFixed(2)} = ₹${(item.quantity * item.price).toFixed(2)}\n`;
      });

      message += `\n*Subtotal:* ₹${subtotal.toFixed(2)}`;
      message += `\n*Delivery Charge:* ₹${deliveryFee.toFixed(2)}`;
      if (deliveryFee === 0) {
        message += ` (Free Delivery!)`;
      }
      message += `\n*Total Amount:* ₹${total.toFixed(2)}`;
      message += `\n\n_Please confirm this order to proceed._`;

      const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999';
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      
      // Clear cart and redirect
      clearCart();
      toast.success('Order created! Redirecting to WhatsApp...');
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
      
      // Redirect to order tracking or account page
      setTimeout(() => {
        if (isAuthenticated) {
          router.push('/account');
        } else {
          router.push(`/track-order?orderNumber=${order.orderNumber}`);
        }
      }, 1000);

    } catch (error: any) {
      console.error('Error creating order:', error);
      toast.error(error.message || 'Failed to create order. Please try again.');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-primary-100 pb-20">
        <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="uppercase tracking-[0.3em] text-xs text-secondary-200">Your Cart</p>
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold max-w-3xl mx-auto">
              Shopping Cart
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-white/70">
              Review your selected items and complete your order via WhatsApp
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 -mt-12 relative z-10 bg-white py-12 rounded-xl shadow-lg">
        {items.length === 0 ? (
          <div className="rounded-sm border border-white/60 bg-white/90 backdrop-blur p-16 shadow-xl text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-slate-600 mb-8">Add some products to get started!</p>
            <Link href="/products" className="btn-primary inline-block">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <CartItem key={item.productId} item={item} />
              ))}
            </div>

            {/* Cart Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="rounded-sm border border-white/60 bg-white/90 backdrop-blur shadow-xl p-8 sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                {/* User Info Display */}
                {isAuthenticated && user && (
                  <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-sm">
                    <h3 className="font-semibold text-sm uppercase tracking-[0.2em] text-slate-700 mb-3">
                      Delivery Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-slate-500">Name:</span>
                        <span className="ml-2 text-slate-900 font-medium">{user.name}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Email:</span>
                        <span className="ml-2 text-slate-900 font-medium">{user.email}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Phone:</span>
                        <span className="ml-2 text-slate-900 font-medium">{user.phone || 'Not provided'}</span>
                      </div>
                      {user.address && user.address.street && (
                        <div className="pt-2 border-t border-slate-200">
                          <span className="text-slate-500 block mb-1">Delivery Address:</span>
                          <p className="text-slate-900 font-medium leading-relaxed">
                            {user.address.street}<br />
                            {user.address.city}, {user.address.state} - {user.address.pincode}
                          </p>
                        </div>
                      )}
                      {(!user.phone || !user.address?.street || !user.address?.city || !user.address?.state || !user.address?.pincode) && (
                        <div className="pt-2 border-t border-amber-200 bg-amber-50 -mx-4 -mb-4 mt-3 px-4 py-3">
                          <p className="text-xs text-amber-800">
                            ⚠️ Please complete your delivery address in{' '}
                            <Link href="/account?tab=profile" className="font-semibold">
                              account settings
                            </Link>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {!isAuthenticated && (
                  <div className="mb-6 bg-amber-50 p-4 rounded-sm border border-amber-200">
                    <p className="text-sm text-amber-800 mb-3">
                      Please login to place an order
                    </p>
                    <Link href="/login?redirect=/cart" className="btn-primary text-sm w-full block text-center">
                      Login / Sign Up
                    </Link>
                  </div>
                )}

                <div className="border-t border-slate-200 pt-4 space-y-3">
                  <div className="flex justify-between text-lg">
                    <span className="text-slate-600">Subtotal:</span>
                    <span className="font-semibold text-slate-900">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-slate-600">Delivery:</span>
                    <span className="font-semibold">
                      {deliveryFee === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹${deliveryFee.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  {subtotal < freeDeliveryThreshold && (
                    <p className="text-sm text-slate-600">
                      Add ₹{(freeDeliveryThreshold - subtotal).toFixed(2)} more for free delivery!
                    </p>
                  )}
                  <div className="border-t border-slate-200 pt-3 flex justify-between text-xl font-bold">
                    <span className="text-slate-900">Total:</span>
                    <span className="text-primary-600">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCreatingOrder || !isAuthenticated || !user?.name || !user?.phone || !user?.address?.street || !user?.address?.city || !user?.address?.state || !user?.address?.pincode}
                  className="w-full btn-primary mt-6 flex items-center justify-center space-x-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingOrder ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Creating Order...</span>
                    </>
                  ) : (
                    <>
                      <FaWhatsapp size={24} />
                      <span>Order via WhatsApp</span>
                    </>
                  )}
                </button>

                {isAuthenticated && (!user?.name || !user?.phone || !user?.address?.street || !user?.address?.city || !user?.address?.state || !user?.address?.pincode) && (
                  <p className="text-sm text-red-600 mt-2 text-center">
                    Please complete your delivery address to place orders
                  </p>
                )}

                {!isAuthenticated && (
                  <p className="text-sm text-amber-600 mt-2 text-center">
                    Please login to place an order
                  </p>
                )}

                <button
                  onClick={clearCart}
                  disabled={isCreatingOrder}
                  className="w-full mt-4 text-red-600 hover:text-red-700 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </main>
      <Footer />
    </>
  );
}

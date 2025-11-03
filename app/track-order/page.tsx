'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FiPackage, FiSearch, FiClock, FiCheck, FiTruck, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface Order {
  _id: string;
  orderNumber: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: string;
  createdAt: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  trackingUpdates: Array<{
    status: string;
    message: string;
    timestamp: string;
  }>;
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderNumber) {
      toast.error('Please enter an order number');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/orders?orderNumber=${orderNumber}`);
      const data = await res.json();

      if (data.success) {
        setOrder(data.order);
      } else {
        toast.error('Order not found');
        setOrder(null);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelGuestOrder = async (orderNum: string) => {
    if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/orders/${orderNum}/cancel-guest`, {
        method: 'PUT',
      });

      const data = await res.json();
      
      if (data.success) {
        toast.success('Order cancelled successfully');
        // Refresh order details
        const updatedRes = await fetch(`/api/orders?orderNumber=${orderNum}`);
        const updatedData = await updatedRes.json();
        if (updatedData.success) {
          setOrder(updatedData.order);
        }
      } else {
        toast.error(data.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      confirmed: 'bg-blue-100 text-blue-700 border-blue-300',
      processing: 'bg-purple-100 text-purple-700 border-purple-300',
      shipped: 'bg-indigo-100 text-indigo-700 border-indigo-300',
      delivered: 'bg-green-100 text-green-700 border-green-300',
      cancelled: 'bg-red-100 text-red-700 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, JSX.Element> = {
      pending: <FiClock className="w-6 h-6" />,
      confirmed: <FiCheck className="w-6 h-6" />,
      processing: <FiPackage className="w-6 h-6" />,
      shipped: <FiTruck className="w-6 h-6" />,
      delivered: <FiCheck className="w-6 h-6" />,
      cancelled: <FiX className="w-6 h-6" />,
    };
    return icons[status] || <FiClock className="w-6 h-6" />;
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 pb-20">
        <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="uppercase tracking-[0.3em] text-xs text-secondary-200">Track Order</p>
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold max-w-3xl mx-auto">
              Find Your Order
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-white/70">
              Enter your order number to track your delivery status
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 -mt-12 relative z-10">
          <div className="max-w-2xl mx-auto">
            {/* Search Form */}
            <div className="rounded-sm border border-white/60 bg-white/90 backdrop-blur shadow-xl p-8 mb-8">
              <form onSubmit={handleTrack} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 mb-2">
                    Order Number
                  </label>
                  <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-none border border-slate-200 bg-white text-slate-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                      placeholder="Enter your order number (e.g., ORD12345678901)"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Searching...' : 'Track Order'}
                </button>
              </form>
            </div>

            {/* Order Details */}
            {order && (
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="rounded-sm border border-white/60 bg-white/90 backdrop-blur shadow-xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Order #{order.orderNumber}</h2>
                      <p className="text-sm text-slate-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <span
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 text-sm font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="mb-6 pb-6 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-4">Order Items</h3>
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="text-slate-700">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-semibold text-slate-900">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold text-slate-900">Total Amount</span>
                    <span className="font-bold text-primary-600 text-2xl">
                      ₹{order.totalAmount.toFixed(2)}
                    </span>
                  </div>

                  {/* Delivery Address */}
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-2">Delivery Address</h3>
                    <p className="text-slate-600">
                      {order.deliveryAddress.street}<br />
                      {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
                    </p>
                  </div>

                  {/* Cancel Button for Pending Orders */}
                  {order.status === 'pending' && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <button
                        onClick={() => handleCancelGuestOrder(order.orderNumber)}
                        className="w-full bg-red-600 text-white px-6 py-3 rounded-sm font-semibold hover:bg-red-700 transition"
                      >
                        Cancel Order
                      </button>
                      <p className="text-sm text-slate-500 mt-2 text-center">
                        You can cancel this order if you haven't confirmed it via WhatsApp
                      </p>
                    </div>
                  )}
                </div>

                {/* Tracking Timeline */}
                <div className="rounded-sm border border-white/60 bg-white/90 backdrop-blur shadow-xl p-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Tracking History</h3>
                  <div className="space-y-6">
                    {order.trackingUpdates.map((update, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            idx === 0 ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {getStatusIcon(update.status)}
                          </div>
                          {idx < order.trackingUpdates.length - 1 && (
                            <div className="w-0.5 h-12 bg-slate-200 my-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <p className="font-semibold text-slate-900 capitalize">{update.status}</p>
                          <p className="text-sm text-slate-600 mt-1">{update.message}</p>
                          <p className="text-xs text-slate-400 mt-2">
                            {new Date(update.timestamp).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

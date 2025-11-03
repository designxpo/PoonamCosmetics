'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { FiPackage, FiUser, FiLogOut, FiClock, FiCheck, FiTruck, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface Order {
  _id: string;
  orderNumber: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image: string;
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

export default function AccountPage() {
  const router = useRouter();
  const { user, token, logout, isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  const handleCancelOrder = async (orderNumber: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const res = await fetch(`/api/orders/${orderNumber}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      
      if (data.success) {
        toast.success('Order cancelled successfully');
        // Refresh orders list
        fetchOrders();
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
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      processing: 'bg-purple-100 text-purple-700',
      shipped: 'bg-indigo-100 text-indigo-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, JSX.Element> = {
      pending: <FiClock className="w-5 h-5" />,
      confirmed: <FiCheck className="w-5 h-5" />,
      processing: <FiPackage className="w-5 h-5" />,
      shipped: <FiTruck className="w-5 h-5" />,
      delivered: <FiCheck className="w-5 h-5" />,
      cancelled: <FiX className="w-5 h-5" />,
    };
    return icons[status] || <FiClock className="w-5 h-5" />;
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 pb-20">
        <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="uppercase tracking-[0.3em] text-xs text-secondary-200">My Account</p>
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold max-w-3xl mx-auto">
              Welcome back, {user.name}!
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-white/70">
              Manage your orders, profile, and preferences
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 -mt-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="rounded-sm border border-white/60 bg-white/90 backdrop-blur shadow-xl p-6 sticky top-24">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <FiUser className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{user.name}</p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                </div>

                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition ${
                      activeTab === 'orders'
                        ? 'bg-primary-50 text-primary-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <FiPackage />
                    <span>My Orders</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition ${
                      activeTab === 'profile'
                        ? 'bg-primary-50 text-primary-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <FiUser />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-red-600 hover:bg-red-50 transition"
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div className="rounded-sm border border-white/60 bg-white/90 backdrop-blur shadow-xl p-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">My Orders</h2>
                    
                    {loading ? (
                      <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-slate-900"></div>
                        <p className="mt-4 text-slate-500">Loading orders...</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-12">
                        <FiPackage className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-600 mb-4">You haven't placed any orders yet</p>
                        <Link href="/products" className="btn-primary inline-block">
                          Start Shopping
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div
                            key={order._id}
                            className="rounded-none border border-slate-200 p-6 hover:shadow-lg transition"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <p className="font-semibold text-slate-900">Order #{order.orderNumber}</p>
                                <p className="text-sm text-slate-500">
                                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}
                                </p>
                              </div>
                              <span
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {getStatusIcon(order.status)}
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>

                            <div className="space-y-3 mb-4">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                  <div className="text-slate-600">
                                    {item.quantity}x {item.name}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                              <div>
                                <p className="text-sm text-slate-500">Total Amount</p>
                                <p className="text-lg font-bold text-slate-900">₹{order.totalAmount.toFixed(2)}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                {order.status === 'pending' && (
                                  <button
                                    onClick={() => handleCancelOrder(order.orderNumber)}
                                    className="text-red-600 hover:text-red-700 font-semibold text-sm"
                                  >
                                    Cancel Order
                                  </button>
                                )}
                                <Link
                                  href={`/track-order?orderNumber=${order.orderNumber}`}
                                  className="text-primary-600 hover:text-primary-700 font-semibold"
                                >
                                  Track Order →
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="rounded-sm border border-white/60 bg-white/90 backdrop-blur shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Profile Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-500 mb-2">Name</label>
                      <p className="text-lg text-slate-900">{user.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-500 mb-2">Email</label>
                      <p className="text-lg text-slate-900">{user.email}</p>
                    </div>
                    {user.phone && (
                      <div>
                        <label className="block text-sm font-semibold text-slate-500 mb-2">Phone</label>
                        <p className="text-lg text-slate-900">{user.phone}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

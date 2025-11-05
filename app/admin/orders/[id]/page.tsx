'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import { FiArrowLeft, FiPackage, FiUser, FiMapPin, FiClock, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

interface Order {
  _id: string;
  orderNumber: string;
  user?: {
    name: string;
    email: string;
    phone?: string;
  };
  guestInfo?: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    product: {
      _id: string;
      name: string;
      slug: string;
      images: string[];
    };
    quantity: number;
    price: number;
    name: string;
    image: string;
  }>;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  trackingNumber?: string;
  notes?: string;
  trackingUpdates: Array<{
    status: string;
    message: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function OrderDetailPage() {
  const { token } = useAuthStore();
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (token && orderId) {
      fetchOrder();
    }
  }, [orderId, token]);

  const fetchOrder = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setOrder(data.order);
        setStatus(data.order.status);
        setTrackingNumber(data.order.trackingNumber || '');
        setNotes(data.order.notes || '');
      } else {
        toast.error(data.error || 'Failed to load order');
        router.push('/admin/orders');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = async () => {
    if (!token) {
      toast.error('Please login to continue');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
          trackingNumber,
          notes,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Order updated successfully');
        setOrder(data.order);
      } else {
        toast.error(data.error || 'Failed to update order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-slate-900"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-slate-600">Order not found</p>
          <Link href="/admin/orders" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
            Back to Orders
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const customerInfo = order.user || order.guestInfo;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/orders"
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <FiArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Order #{order.orderNumber}</h1>
              <p className="text-slate-600 mt-1">
                Placed on {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {order.status.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <FiPackage />
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 pb-4 border-b border-slate-200 last:border-0">
                    <img
                      src={item.image || item.product?.images?.[0] || '/placeholder.png'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg border border-slate-200"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900">{item.name}</h3>
                      <p className="text-sm text-slate-600">Quantity: {item.quantity}</p>
                      <p className="text-sm font-medium text-slate-900">₹{item.price.toFixed(2)} each</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        ₹{(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200">
                <div className="flex justify-between text-lg font-bold text-slate-900">
                  <span>Total Amount</span>
                  <span>₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Tracking Updates */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <FiClock />
                Tracking History
              </h2>
              {order.trackingUpdates && order.trackingUpdates.length > 0 ? (
                <div className="space-y-4">
                  {order.trackingUpdates.map((update, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(update.status).replace('text', 'bg')}`}></div>
                        {index < order.trackingUpdates.length - 1 && (
                          <div className="w-0.5 h-full bg-slate-200 my-1"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-medium text-slate-900">{update.message}</p>
                        <p className="text-sm text-slate-600">
                          {new Date(update.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600">No tracking updates yet</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Update Order Status */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Update Order</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Admin Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes..."
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <button
                  onClick={handleUpdateOrder}
                  disabled={saving}
                  className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <FiSave />
                  {saving ? 'Saving...' : 'Update Order'}
                </button>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <FiUser />
                Customer
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-600">Name</p>
                  <p className="font-medium text-slate-900">{customerInfo?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="font-medium text-slate-900">{customerInfo?.email}</p>
                </div>
                {customerInfo?.phone && (
                  <div>
                    <p className="text-sm text-slate-600">Phone</p>
                    <p className="font-medium text-slate-900">{customerInfo.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-600">Payment Method</p>
                  <p className="font-medium text-slate-900">{order.paymentMethod.toUpperCase()}</p>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <FiMapPin />
                Delivery Address
              </h2>
              <div className="text-slate-900 leading-relaxed">
                <p>{order.deliveryAddress.street}</p>
                <p>{order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
                <p>{order.deliveryAddress.pincode}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

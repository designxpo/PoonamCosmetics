'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';

export default function AdminDashboard() {
  const { token } = useAuthStore();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const fetchDashboardData = async () => {
    if (!token) return;

    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch('/api/products?limit=1000'),
        fetch('/api/admin/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();

      if (productsData.success) {
        const lowStock = productsData.products.filter((p: any) => p.stock < 10).length;
        setStats(prev => ({
          ...prev,
          totalProducts: productsData.products.length,
          lowStockProducts: lowStock,
        }));
      }

      if (ordersData.success) {
        const pending = ordersData.orders?.filter((o: any) => o.status === 'pending').length || 0;
        const revenue = ordersData.orders?.filter((o: any) => o.status !== 'cancelled')
          .reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0) || 0;
        
        setStats(prev => ({
          ...prev,
          totalOrders: ordersData.orders?.length || 0,
          pendingOrders: pending,
          totalRevenue: revenue,
        }));

        setRecentOrders(ordersData.orders?.slice(0, 5) || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: FiPackage,
      color: 'bg-blue-500',
      link: '/admin/products',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: FiShoppingBag,
      color: 'bg-green-500',
      link: '/admin/orders',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: FiDollarSign,
      color: 'bg-orange-500',
      link: '/admin/orders',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: FiTrendingUp,
      color: 'bg-purple-500',
      link: '/admin/orders',
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-slate-900"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome to your admin panel</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <Link
              key={stat.title}
              href={stat.link}
              className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} text-white p-3 rounded-lg`}>
                  <stat.icon size={24} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Recent Orders</h2>
              <Link
                href="/admin/orders"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Order #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {order.customerInfo?.name || 'Guest'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900">
                        ₹{order.totalAmount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'processing' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/products"
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow text-center"
          >
            <FiPackage size={32} className="mx-auto text-slate-600 mb-3" />
            <h3 className="font-semibold text-slate-900">Manage Products</h3>
            <p className="text-sm text-slate-600 mt-1">Add, edit or delete products</p>
          </Link>
          <Link
            href="/admin/banners"
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow text-center"
          >
            <FiPackage size={32} className="mx-auto text-slate-600 mb-3" />
            <h3 className="font-semibold text-slate-900">Manage Banners</h3>
            <p className="text-sm text-slate-600 mt-1">Update homepage banners</p>
          </Link>
          <Link
            href="/admin/orders"
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow text-center"
          >
            <FiShoppingBag size={32} className="mx-auto text-slate-600 mb-3" />
            <h3 className="font-semibold text-slate-900">Process Orders</h3>
            <p className="text-sm text-slate-600 mt-1">View and manage orders</p>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}

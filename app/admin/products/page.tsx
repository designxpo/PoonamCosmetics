'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import Image from 'next/image';
import { FiEdit2, FiTrash2, FiPlus, FiPackage, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const [updatingBulk, setUpdatingBulk] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?limit=1000&showAll=true');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/products/${slug}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Product deleted successfully');
        fetchProducts();
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      toast.error('Error deleting product');
    }
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(product => product._id));
    }
  };

  const toggleSelectProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleBulkAction = async () => {
    if (selectedProducts.length === 0) {
      toast.error('Please select at least one product');
      return;
    }

    if (!bulkAction) {
      toast.error('Please select an action');
      return;
    }

    if (bulkAction === 'delete') {
      if (!confirm(`Are you sure you want to delete ${selectedProducts.length} product(s)?`)) {
        return;
      }
    }

    setUpdatingBulk(true);

    try {
      const response = await fetch('/api/products/bulk-update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productIds: selectedProducts,
          action: bulkAction,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Successfully ${bulkAction === 'delete' ? 'deleted' : 'updated'} ${data.modifiedCount} product(s)`);
        setSelectedProducts([]);
        setBulkAction('');
        fetchProducts();
      } else {
        toast.error(data.error || 'Failed to update products');
      }
    } catch (error) {
      console.error('Error updating products:', error);
      toast.error('Failed to update products');
    } finally {
      setUpdatingBulk(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category?._id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Products</h1>
            <p className="text-slate-600 mt-1">Manage your product inventory</p>
          </div>
          <Link href="/admin/products/new" className="btn-primary flex items-center space-x-2">
            <FiPlus />
            <span>Add Product</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-center gap-2">
                <FiCheck className="text-primary-600" size={20} />
                <span className="text-sm font-medium text-primary-900">
                  {selectedProducts.length} product(s) selected
                </span>
              </div>
              <div className="flex items-center gap-2 flex-1">
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select action</option>
                  <option value="activate">Mark as Active</option>
                  <option value="deactivate">Mark as Inactive</option>
                  <option value="feature">Mark as Featured</option>
                  <option value="unfeature">Remove from Featured</option>
                  <option value="delete">Delete Products</option>
                </select>
                <button
                  onClick={handleBulkAction}
                  disabled={!bulkAction || updatingBulk}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {updatingBulk ? 'Processing...' : 'Apply'}
                </button>
                <button
                  onClick={() => setSelectedProducts([])}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Table */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
            <FiPackage size={48} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No products found</h3>
            <p className="text-slate-600 mb-6">Start by adding your first product</p>
            <Link href="/admin/products/new" className="btn-primary inline-flex items-center space-x-2">
              <FiPlus />
              <span>Add Product</span>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={filteredProducts.length > 0 && selectedProducts.length === filteredProducts.length}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product._id)}
                          onChange={() => toggleSelectProduct(product._id)}
                          className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-16 w-16 relative bg-slate-100 rounded-lg overflow-hidden">
                          {product.images?.[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <FiPackage />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900">{product.name}</p>
                          <p className="text-sm text-slate-500">{product.slug}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {product.category?.name || 'Uncategorized'}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        ₹{product.price?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.stock === 0 ? 'bg-red-100 text-red-800' :
                          product.stock < 10 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/products/${product.slug}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.slug)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <p className="text-sm text-slate-600">Total Products</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{products.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <p className="text-sm text-slate-600">Active</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {products.filter(p => p.isActive).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <p className="text-sm text-slate-600">Low Stock</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">
              {products.filter(p => p.stock < 10 && p.stock > 0).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <p className="text-sm text-slate-600">Out of Stock</p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              {products.filter(p => p.stock === 0).length}
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUpload from '@/components/admin/ImageUpload';
import { FiEdit2, FiTrash2, FiPlus, FiPackage } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminCollections() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    link: '',
    order: 0,
    isActive: true,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/featured-collections');
      const data = await response.json();
      if (data.success) {
        setCollections(data.collections || []);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate image
    if (!formData.image) {
      toast.error('Please upload an image');
      return;
    }
    
    const url = editingId ? `/api/featured-collections/${editingId}` : '/api/featured-collections';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editingId ? 'Collection updated!' : 'Collection created!');
        fetchCollections();
        resetForm();
      } else {
        toast.error(data.error || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Failed to save collection');
    }
  };

  const handleEdit = (collection: any) => {
    setFormData({
      title: collection.title,
      description: collection.description,
      image: collection.image,
      link: collection.link,
      order: collection.order,
      isActive: collection.isActive,
    });
    setEditingId(collection._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) return;

    try {
      const response = await fetch(`/api/featured-collections/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Collection deleted!');
        fetchCollections();
      } else {
        toast.error(data.error || 'Failed to delete collection');
      }
    } catch (error) {
      toast.error('Failed to delete collection');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      link: '',
      order: 0,
      isActive: true,
    });
    setEditingId(null);
    setShowForm(false);
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Featured Collections</h1>
            <p className="text-slate-600 mt-1">Manage homepage featured collection cards (3 cards displayed)</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center space-x-2"
          >
            <FiPlus />
            <span>Add Collection</span>
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {editingId ? 'Edit Collection' : 'Create New Collection'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  required
                />
              </div>

              <div>
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  label="Collection Image"
                  required={false}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Link URL</label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="/products?category=skincare"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-3">
                <button type="submit" className="btn-primary">
                  {editingId ? 'Update' : 'Create'} Collection
                </button>
                <button type="button" onClick={resetForm} className="btn-outline">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.length === 0 ? (
            <div className="col-span-full bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
              <FiPackage size={48} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-600">No collections yet. Create your first collection!</p>
            </div>
          ) : (
            collections.map((collection) => (
              <div key={collection._id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="relative h-48 bg-slate-100">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() => handleEdit(collection)}
                      className="p-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg shadow-sm transition-colors"
                      title="Edit"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(collection._id)}
                      className="p-2 bg-white text-red-600 hover:bg-red-50 rounded-lg shadow-sm transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900">{collection.title}</h3>
                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">{collection.description}</p>
                  <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                    <span>Order: {collection.order}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      collection.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {collection.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

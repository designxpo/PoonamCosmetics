'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUpload from '@/components/admin/ImageUpload';
import { FiEdit2, FiTrash2, FiPlus, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminBanners() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    ctaText: '',
    ctaLink: '',
    order: 0,
    isActive: true,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners');
      const data = await response.json();
      if (data.success) {
        setBanners(data.banners || []);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
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
    
    const url = editingId ? `/api/banners/${editingId}` : '/api/banners';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editingId ? 'Banner updated!' : 'Banner created!');
        fetchBanners();
        resetForm();
      } else {
        toast.error(data.error || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Failed to save banner');
    }
  };

  const handleEdit = (banner: any) => {
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      image: banner.image,
      ctaText: banner.ctaText || '',
      ctaLink: banner.ctaLink || '',
      order: banner.order,
      isActive: banner.isActive,
    });
    setEditingId(banner._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Banner deleted!');
        fetchBanners();
      } else {
        toast.error(data.error || 'Failed to delete banner');
      }
    } catch (error) {
      toast.error('Failed to delete banner');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      image: '',
      ctaText: '',
      ctaLink: '',
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
            <h1 className="text-3xl font-bold text-slate-900">Hero Banners</h1>
            <p className="text-slate-600 mt-1">Manage homepage carousel banners</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center space-x-2"
          >
            <FiPlus />
            <span>Add Banner</span>
          </button>
        </div>

        {/* Form with Live Preview */}
        {showForm && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                {editingId ? 'Edit Banner' : 'Create New Banner'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  label="Banner Image"
                  required={false}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">CTA Text</label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Shop Now"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">CTA Link</label>
                  <input
                    type="text"
                    value={formData.ctaLink}
                    onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="/products"
                  />
                </div>
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
                  {editingId ? 'Update' : 'Create'} Banner
                </button>
                <button type="button" onClick={resetForm} className="btn-outline">
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Section */}
          <div className="space-y-6 lg:sticky lg:top-6">
            <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-900 mb-3">Live Preview</h3>
              
              {/* Banner Preview */}
              <div className="relative h-[300px] bg-slate-100 rounded-sm overflow-hidden">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt={formData.title || 'Banner preview'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <div className="text-center">
                      <FiImage size={48} className="mx-auto mb-2" />
                      <p className="text-sm">Upload an image to see preview</p>
                    </div>
                  </div>
                )}
                
                {/* Overlay with content */}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="text-center text-white px-4">
                    <h2 className="text-3xl font-bold mb-2">
                      {formData.title || 'Banner Title'}
                    </h2>
                    <p className="text-lg mb-4">
                      {formData.subtitle || 'Banner subtitle'}
                    </p>
                    {formData.ctaText && (
                      <button className="bg-white text-slate-900 px-6 py-2 rounded-sm font-semibold hover:bg-slate-100">
                        {formData.ctaText}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Preview Info */}
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Order:</span>
                  <span className="font-medium text-slate-900">#{formData.order}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Status:</span>
                  <span className={`font-medium ${formData.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {formData.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {formData.ctaLink && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Link:</span>
                    <span className="font-medium text-slate-900 truncate ml-2">{formData.ctaLink}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Banners List */}
        <div className="grid grid-cols-1 gap-4">
          {banners.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
              <FiImage size={48} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-600">No banners yet. Create your first banner!</p>
            </div>
          ) : (
            banners.map((banner) => (
              <div key={banner._id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-48 md:h-auto relative bg-slate-100">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900">{banner.title}</h3>
                        {banner.subtitle && (
                          <p className="text-slate-600 mt-1">{banner.subtitle}</p>
                        )}
                        <div className="flex gap-3 mt-3 text-sm text-slate-500">
                          {banner.ctaText && (
                            <span className="flex items-center">
                              <strong className="mr-1">CTA:</strong> {banner.ctaText}
                            </span>
                          )}
                          <span>Order: {banner.order}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            banner.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {banner.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(banner)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(banner._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
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

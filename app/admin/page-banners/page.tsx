'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUpload from '@/components/admin/ImageUpload';
import { FiSave, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface PageBannerData {
  page: 'products' | 'about' | 'contact';
  eyebrow: string;
  title: string;
  description: string;
  backgroundImage?: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  isActive: boolean;
}

const defaultBanners = {
  products: {
    page: 'products' as const,
    eyebrow: 'Collections',
    title: 'Explore The Various Collection of Poonam',
    description: 'Discover our curated selection of premium beauty products designed for everyone. Find your perfect match from our extensive collection.',
    gradientFrom: 'slate-900',
    gradientVia: 'slate-800',
    gradientTo: 'slate-900',
    isActive: true,
  },
  about: {
    page: 'about' as const,
    eyebrow: 'The Brand',
    title: 'Crafting Luxurious Beauty Rituals',
    description: 'We exist to empower every individual to feel runway-ready, every single day. Discover what makes Poonam Cosmetics the preferred choice for beauty enthusiasts.',
    gradientFrom: 'slate-900',
    gradientVia: 'slate-800',
    gradientTo: 'slate-900',
    isActive: true,
  },
  contact: {
    page: 'contact' as const,
    eyebrow: 'Contact',
    title: 'Let\'s Create Beauty Moments Together',
    description: 'Reach out to our concierge team for personalized recommendations, order support, or brand collaborations.',
    gradientFrom: 'slate-900',
    gradientVia: 'slate-800',
    gradientTo: 'slate-900',
    isActive: true,
  },
};

export default function PageBannersAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [banners, setBanners] = useState<Record<string, PageBannerData>>(defaultBanners);
  const [activeTab, setActiveTab] = useState<'products' | 'about' | 'contact'>('products');

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/page-banners');
      const data = await response.json();

      if (data.success && data.banners) {
        const bannersMap: Record<string, PageBannerData> = { ...defaultBanners };
        data.banners.forEach((banner: any) => {
          bannersMap[banner.page] = banner;
        });
        setBanners(bannersMap);
      }
    } catch (error) {
      console.error('Error fetching page banners:', error);
      toast.error('Failed to load page banners');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (page: 'products' | 'about' | 'contact', field: string, value: any) => {
    setBanners(prev => ({
      ...prev,
      [page]: {
        ...prev[page],
        [field]: value,
      },
    }));
  };

  const handleSave = async (page: 'products' | 'about' | 'contact') => {
    setSaving(page);
    try {
      const bannerData = banners[page];
      
      // Check if banner exists
      const checkResponse = await fetch(`/api/page-banners?page=${page}`);
      const checkData = await checkResponse.json();
      
      let response;
      if (checkData.banner) {
        // Update existing
        response = await fetch(`/api/page-banners?page=${page}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bannerData),
        });
      } else {
        // Create new
        response = await fetch('/api/page-banners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bannerData),
        });
      }

      const data = await response.json();

      if (data.success) {
        toast.success(`${page.charAt(0).toUpperCase() + page.slice(1)} page banner saved!`);
        fetchBanners(); // Refresh data
      } else {
        toast.error(data.error || 'Failed to save banner');
      }
    } catch (error) {
      console.error('Error saving banner:', error);
      toast.error('Failed to save banner');
    } finally {
      setSaving(null);
    }
  };

  const tabs = [
    { id: 'products' as const, label: 'Products Page' },
    { id: 'about' as const, label: 'About Page' },
    { id: 'contact' as const, label: 'Contact Page' },
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

  const currentBanner = banners[activeTab];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Page Banners</h1>
          <p className="text-slate-600 mt-1">Customize hero banners for different pages</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Page Banner
            </h2>

            <div className="space-y-6">
              {/* Active Status */}
              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={currentBanner.isActive}
                    onChange={(e) => handleUpdate(activeTab, 'isActive', e.target.checked)}
                    className="w-5 h-5 text-slate-900 rounded border-slate-300 focus:ring-slate-900"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    {currentBanner.isActive ? (
                      <span className="flex items-center gap-2">
                        <FiEye className="text-green-600" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <FiEyeOff className="text-slate-400" />
                        Inactive
                      </span>
                    )}
                  </span>
                </label>
              </div>

              {/* Eyebrow Text */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Eyebrow Text <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={currentBanner.eyebrow}
                  onChange={(e) => handleUpdate(activeTab, 'eyebrow', e.target.value)}
                  placeholder="e.g., Collections, The Brand, Contact"
                  className="w-full px-4 py-2 border border-slate-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
                <p className="text-xs text-slate-500 mt-1">Small uppercase text above the title</p>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={currentBanner.title}
                  onChange={(e) => handleUpdate(activeTab, 'title', e.target.value)}
                  placeholder="Main heading"
                  className="w-full px-4 py-2 border border-slate-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={currentBanner.description}
                  onChange={(e) => handleUpdate(activeTab, 'description', e.target.value)}
                  placeholder="Supporting text under the title"
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Background Image (Optional) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Background Image (Optional)
                </label>
                <ImageUpload
                  value=""
                  onChange={(url) => handleUpdate(activeTab, 'backgroundImage', url)}
                  label=""
                  required={false}
                />
                {currentBanner.backgroundImage && (
                  <div className="mt-2 relative">
                    <img
                      src={currentBanner.backgroundImage}
                      alt="Background"
                      className="w-full h-32 object-cover rounded-sm border border-slate-200"
                    />
                    <button
                      onClick={() => handleUpdate(activeTab, 'backgroundImage', '')}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}
                <p className="text-xs text-slate-500 mt-1">
                  If set, will be used instead of gradient background
                </p>
              </div>

              {/* Gradient Colors */}
              {!currentBanner.backgroundImage && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Gradient From
                    </label>
                    <input
                      type="text"
                      value={currentBanner.gradientFrom}
                      onChange={(e) => handleUpdate(activeTab, 'gradientFrom', e.target.value)}
                      placeholder="slate-900"
                      className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Gradient Via
                    </label>
                    <input
                      type="text"
                      value={currentBanner.gradientVia}
                      onChange={(e) => handleUpdate(activeTab, 'gradientVia', e.target.value)}
                      placeholder="slate-800"
                      className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Gradient To
                    </label>
                    <input
                      type="text"
                      value={currentBanner.gradientTo}
                      onChange={(e) => handleUpdate(activeTab, 'gradientTo', e.target.value)}
                      placeholder="slate-900"
                      className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Save Button */}
              <button
                onClick={() => handleSave(activeTab)}
                disabled={saving === activeTab}
                className="w-full px-6 py-3 bg-slate-900 text-white rounded-sm hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
              >
                <FiSave size={18} />
                {saving === activeTab ? 'Saving...' : 'Save Banner'}
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Preview</h2>
            
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <section
                className={`${
                  currentBanner.backgroundImage
                    ? 'bg-cover bg-center'
                    : `bg-gradient-to-r from-${currentBanner.gradientFrom} via-${currentBanner.gradientVia} to-${currentBanner.gradientTo}`
                } text-white py-20 relative`}
                style={
                  currentBanner.backgroundImage
                    ? { backgroundImage: `url(${currentBanner.backgroundImage})` }
                    : undefined
                }
              >
                {currentBanner.backgroundImage && (
                  <div className="absolute inset-0 bg-slate-900/50"></div>
                )}
                <div className="container mx-auto px-4 text-center relative z-10">
                  <p className="uppercase tracking-[0.3em] text-xs text-secondary-200">
                    {currentBanner.eyebrow}
                  </p>
                  <h1 className="mt-4 text-4xl md:text-5xl font-semibold max-w-3xl mx-auto">
                    {currentBanner.title}
                  </h1>
                  <p className="mt-6 max-w-2xl mx-auto text-white/70">
                    {currentBanner.description}
                  </p>
                </div>
              </section>
            </div>

            {!currentBanner.isActive && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ This banner is currently inactive and will not be displayed on the website.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

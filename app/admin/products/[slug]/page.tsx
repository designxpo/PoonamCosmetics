'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUpload from '@/components/admin/ImageUpload';
import { FiSave, FiArrowLeft, FiPlus, FiX, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    stock: '',
    featured: false,
    isActive: true,
    images: [] as string[],
    // PDP Features
    pdpFeatures: {
      showColorSelector: false,
      availableColors: [] as string[],
      showSizeSelector: false,
      availableSizes: [] as string[],
      showReviews: true,
      showSocialShare: true,
      showAdditionalInfo: true,
      customFeatures: [] as { label: string; value: string }[],
    },
  });

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${slug}`);
      const data = await res.json();
      
      if (data.success && data.product) {
        const product = data.product;
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price?.toString() || '',
          category: product.category?._id || product.category || '',
          brand: product.brand?._id || product.brand || '',
          stock: product.stock?.toString() || '0',
          featured: product.featured || false,
          isActive: product.isActive !== undefined ? product.isActive : true,
          images: product.images || [],
          pdpFeatures: {
            showColorSelector: product.pdpFeatures?.showColorSelector || false,
            availableColors: product.pdpFeatures?.availableColors || [],
            showSizeSelector: product.pdpFeatures?.showSizeSelector || false,
            availableSizes: product.pdpFeatures?.availableSizes || [],
            showReviews: product.pdpFeatures?.showReviews !== undefined ? product.pdpFeatures.showReviews : true,
            showSocialShare: product.pdpFeatures?.showSocialShare !== undefined ? product.pdpFeatures.showSocialShare : true,
            showAdditionalInfo: product.pdpFeatures?.showAdditionalInfo !== undefined ? product.pdpFeatures.showAdditionalInfo : true,
            customFeatures: product.pdpFeatures?.customFeatures || [],
          },
        });
      } else {
        toast.error('Product not found');
        router.push('/admin/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
      router.push('/admin/products');
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
      toast.error('Failed to load categories');
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/brands?showAll=true');
      const data = await res.json();
      if (data.success) {
        setBrands(data.brands);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddImage = (url: string) => {
    if (url.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url.trim()]
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.images.length === 0) {
      toast.error('Please add at least one product image');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`/api/products/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          brand: formData.brand || undefined,
          stock: parseInt(formData.stock) || 0,
          featured: formData.featured,
          isActive: formData.isActive,
          images: formData.images,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Product updated successfully!');
        router.push('/admin/products');
      } else {
        toast.error(data.error || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setSaving(false);
    }
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            <FiArrowLeft size={20} />
            <span>Back to Products</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Edit Product</h1>
            <p className="text-slate-600 mt-1">Update product information and see live preview</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="bg-white rounded-sm shadow-sm border border-slate-200 p-6 space-y-6">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter product description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-2">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-slate-300 rounded-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>

            {/* Stock */}
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-slate-700 mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-slate-300 rounded-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand */}
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-slate-700 mb-2">
              Brand (Optional)
            </label>
            <select
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">No Brand</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Product Images */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Product Images <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {/* Image Upload Component */}
              <ImageUpload
                value=""
                onChange={handleAddImage}
                label=""
                required={false}
              />

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Product ${index + 1}`}
                        className="w-full h-32 object-cover rounded-sm border border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiX size={16} />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 bg-slate-900 text-white text-xs px-2 py-1 rounded-sm">
                          Main Image
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* PDP Features Section */}
          <div className="border-t border-slate-200 pt-6 space-y-6">
            <h3 className="text-lg font-semibold text-slate-900">Product Page Features</h3>
            
            {/* Color Selector */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.pdpFeatures.showColorSelector}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    pdpFeatures: {
                      ...prev.pdpFeatures,
                      showColorSelector: e.target.checked,
                    }
                  }))}
                  className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-slate-700">Show Color Selector</span>
              </label>
              
              {formData.pdpFeatures.showColorSelector && (
                <div>
                  <label className="block text-sm text-slate-600 mb-2">Available Colors (select multiple)</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['Red', 'Pink', 'Purple', 'Orange', 'Brown', 'Black', 'White', 'Blue', 'Green', 'Yellow'].map(color => (
                      <label key={color} className="flex items-center gap-2 cursor-pointer text-sm">
                        <input
                          type="checkbox"
                          checked={formData.pdpFeatures.availableColors.includes(color)}
                          onChange={(e) => {
                            setFormData(prev => ({
                              ...prev,
                              pdpFeatures: {
                                ...prev.pdpFeatures,
                                availableColors: e.target.checked
                                  ? [...prev.pdpFeatures.availableColors, color]
                                  : prev.pdpFeatures.availableColors.filter(c => c !== color)
                              }
                            }));
                          }}
                          className="w-3 h-3"
                        />
                        <span>{color}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Size Selector */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.pdpFeatures.showSizeSelector}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    pdpFeatures: {
                      ...prev.pdpFeatures,
                      showSizeSelector: e.target.checked,
                    }
                  }))}
                  className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-slate-700">Show Size Selector</span>
              </label>
              
              {formData.pdpFeatures.showSizeSelector && (
                <div>
                  <label className="block text-sm text-slate-600 mb-2">
                    Available Sizes (comma-separated, e.g., S, M, L or 15ml, 30ml, 50ml)
                  </label>
                  <input
                    type="text"
                    value={formData.pdpFeatures.availableSizes.join(', ')}
                    onChange={(e) => {
                      const sizes = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                      setFormData(prev => ({
                        ...prev,
                        pdpFeatures: {
                          ...prev.pdpFeatures,
                          availableSizes: sizes
                        }
                      }));
                    }}
                    className="w-full px-4 py-2 border border-slate-300 rounded-sm focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., S, M, L, XL or 15ml, 30ml, 50ml"
                  />
                </div>
              )}
            </div>

            {/* Other Options */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.pdpFeatures.showReviews}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    pdpFeatures: {
                      ...prev.pdpFeatures,
                      showReviews: e.target.checked,
                    }
                  }))}
                  className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-slate-700">Show Reviews Section</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.pdpFeatures.showSocialShare}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    pdpFeatures: {
                      ...prev.pdpFeatures,
                      showSocialShare: e.target.checked,
                    }
                  }))}
                  className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-slate-700">Show Social Sharing Buttons</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.pdpFeatures.showAdditionalInfo}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    pdpFeatures: {
                      ...prev.pdpFeatures,
                      showAdditionalInfo: e.target.checked,
                    }
                  }))}
                  className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-slate-700">Show Additional Information Tab</span>
              </label>
            </div>

            {/* Custom Features */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Custom Product Features</label>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      pdpFeatures: {
                        ...prev.pdpFeatures,
                        customFeatures: [...prev.pdpFeatures.customFeatures, { label: '', value: '' }]
                      }
                    }));
                  }}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <FiPlus size={16} />
                  Add Feature
                </button>
              </div>
              
              {formData.pdpFeatures.customFeatures.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature.label}
                    onChange={(e) => {
                      const newFeatures = [...formData.pdpFeatures.customFeatures];
                      newFeatures[index].label = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        pdpFeatures: {
                          ...prev.pdpFeatures,
                          customFeatures: newFeatures
                        }
                      }));
                    }}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-sm text-sm"
                    placeholder="Label (e.g., Material)"
                  />
                  <input
                    type="text"
                    value={feature.value}
                    onChange={(e) => {
                      const newFeatures = [...formData.pdpFeatures.customFeatures];
                      newFeatures[index].value = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        pdpFeatures: {
                          ...prev.pdpFeatures,
                          customFeatures: newFeatures
                        }
                      }));
                    }}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-sm text-sm"
                    placeholder="Value (e.g., 100% Cotton)"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        pdpFeatures: {
                          ...prev.pdpFeatures,
                          customFeatures: prev.pdpFeatures.customFeatures.filter((_, i) => i !== index)
                        }
                      }));
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-sm"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              ))}
              
              {formData.pdpFeatures.customFeatures.length === 0 && (
                <p className="text-sm text-slate-500">
                  Add custom features like Material, Weight, Ingredients, etc.
                </p>
              )}
            </div>
          </div>

          {/* Featured & Active Status */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-slate-700">Featured Product</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-slate-700">Active</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-sm hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed font-medium"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Updating Product...</span>
                </>
              ) : (
                <>
                  <FiSave size={18} />
                  <span>Update Product</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-sm hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Live Preview Section */}
        <div className="lg:sticky lg:top-6 space-y-6">
          {/* Preview Header */}
          <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-2 text-slate-700">
              <FiEye size={20} />
              <h3 className="font-semibold">Live Preview</h3>
            </div>
          </div>

          {/* Product Card Preview (PLP Style) */}
          <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-4">
            <h4 className="text-sm font-semibold text-slate-600 mb-3">Product Card View</h4>
            <div className="border border-slate-200 rounded-sm overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-64 bg-slate-100">
                {formData.images?.[0] ? (
                  <img
                    src={formData.images[0]}
                    alt={formData.name || 'Product preview'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <FiPlus size={48} />
                  </div>
                )}
                {formData.featured && (
                  <span className="absolute top-2 left-2 bg-yellow-400 text-slate-900 text-xs font-bold px-2 py-1 rounded-sm">
                    Featured
                  </span>
                )}
                {formData.stock === '0' && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-sm">
                    Out of Stock
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2">
                  {formData.name || 'Product Name'}
                </h3>
                <p className="text-sm text-slate-600 mb-2">
                  {categories.find(c => c._id === formData.category)?.name || 'Category'}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-900">
                    ₹{formData.price || '0.00'}
                  </span>
                  {formData.stock && parseInt(formData.stock) > 0 && parseInt(formData.stock) < 10 && (
                    <span className="text-xs text-orange-600">Only {formData.stock} left</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Product Detail Preview (PDP Style) */}
          <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-4">
            <h4 className="text-sm font-semibold text-slate-600 mb-3">Product Detail View</h4>
            <div className="space-y-4">
              {/* Product Image */}
              <div className="relative h-48 bg-slate-100 rounded-sm overflow-hidden">
                {formData.images?.[0] ? (
                  <img
                    src={formData.images[0]}
                    alt={formData.name || 'Product preview'}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {formData.featured && (
                      <span className="bg-yellow-400 text-slate-900 text-xs font-bold px-2 py-1 rounded-sm">
                        Featured
                      </span>
                    )}
                    <span className="text-xs text-slate-600">
                      {categories.find(c => c._id === formData.category)?.name || 'Category'}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {formData.name || 'Product Name'}
                  </h2>
                  <p className="text-2xl font-bold text-slate-900 mt-2">
                    ₹{formData.price || '0.00'}
                  </p>
                </div>

                {/* Stock Status */}
                <div>
                  {formData.stock === '0' ? (
                    <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-sm text-xs font-medium">
                      Out of Stock
                    </span>
                  ) : parseInt(formData.stock || '0') < 10 ? (
                    <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-sm text-xs font-medium">
                      Only {formData.stock} left
                    </span>
                  ) : (
                    <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-sm text-xs font-medium">
                      In Stock
                    </span>
                  )}
                </div>

                {/* Description */}
                {formData.description && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">Description</h3>
                    <p className="text-sm text-slate-600 line-clamp-3">{formData.description}</p>
                  </div>
                )}

                {/* Add to Cart Button */}
                <button
                  type="button"
                  disabled={formData.stock === '0'}
                  className={`w-full py-2 rounded-sm font-semibold text-sm transition-colors ${
                    formData.stock === '0'
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-slate-900 text-white'
                  }`}
                >
                  {formData.stock === '0' ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>

          {/* Image Gallery Preview */}
          {formData.images.length > 1 && (
            <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-4">
              <h4 className="text-sm font-semibold text-slate-600 mb-3">Image Gallery</h4>
              <div className="grid grid-cols-3 gap-2">
                {formData.images.slice(0, 6).map((img, index) => (
                  <div key={index} className="relative h-20 bg-slate-100 rounded-sm overflow-hidden">
                    <img src={img} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                    {index === 0 && (
                      <span className="absolute bottom-1 left-1 bg-slate-900 text-white text-xs px-1 py-0.5 rounded-sm">
                        Main
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </AdminLayout>
  );
}

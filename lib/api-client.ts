/**
 * API Client Library
 * Centralized data fetching utilities for Poonam Cosmetics
 */

const API_BASE = '/api';

// Generic fetch wrapper with error handling
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for auth
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'An error occurred');
    }

    return { success: true, data };
  } catch (error: any) {
    console.error(`API Error [${endpoint}]:`, error);
    return { success: false, error: error.message };
  }
}

// ==================== PRODUCT API ====================

export const productApi = {
  // Get all products with filters
  getAll: async (params?: {
    search?: string;
    category?: string;
    brand?: string;
    featured?: boolean;
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.brand) searchParams.append('brand', params.brand);
    if (params?.featured !== undefined) searchParams.append('featured', String(params.featured));
    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.limit) searchParams.append('limit', String(params.limit));

    const query = searchParams.toString();
    return apiFetch(`/products${query ? `?${query}` : ''}`);
  },

  // Get single product by slug
  getBySlug: async (slug: string) => {
    return apiFetch(`/products/${slug}`);
  },

  // Create product (Admin)
  create: async (productData: any) => {
    return apiFetch('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  // Update product (Admin)
  update: async (slug: string, productData: any) => {
    return apiFetch(`/products/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  // Delete product (Admin)
  delete: async (slug: string) => {
    return apiFetch(`/products/${slug}`, {
      method: 'DELETE',
    });
  },
};

// ==================== CATEGORY API ====================

export const categoryApi = {
  // Get all categories
  getAll: async () => {
    return apiFetch('/categories');
  },

  // Get single category by ID or slug
  getById: async (id: string) => {
    return apiFetch(`/categories/${id}`);
  },

  // Create category (Admin)
  create: async (categoryData: any) => {
    return apiFetch('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  // Update category (Admin)
  update: async (id: string, categoryData: any) => {
    return apiFetch(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  },

  // Delete category (Admin)
  delete: async (id: string) => {
    return apiFetch(`/categories/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== BRAND API ====================

export const brandApi = {
  // Get all brands (public)
  getAll: async () => {
    return apiFetch('/brands');
  },

  // Get all brands (admin)
  getAllAdmin: async () => {
    return apiFetch('/admin/brands');
  },

  // Get single brand by ID
  getById: async (id: string) => {
    return apiFetch(`/admin/brands/${id}`);
  },

  // Create brand (Admin)
  create: async (brandData: any) => {
    return apiFetch('/admin/brands', {
      method: 'POST',
      body: JSON.stringify(brandData),
    });
  },

  // Update brand (Admin)
  update: async (id: string, brandData: any) => {
    return apiFetch(`/admin/brands/${id}`, {
      method: 'PUT',
      body: JSON.stringify(brandData),
    });
  },

  // Delete brand (Admin)
  delete: async (id: string) => {
    return apiFetch(`/admin/brands/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== ORDER API ====================

export const orderApi = {
  // Get user orders
  getUserOrders: async (userId?: string) => {
    const query = userId ? `?userId=${userId}` : '';
    return apiFetch(`/orders${query}`);
  },

  // Get order by order number (guest)
  getByOrderNumber: async (orderNumber: string, email: string) => {
    return apiFetch(`/orders?orderNumber=${orderNumber}&email=${email}`);
  },

  // Create order
  create: async (orderData: any) => {
    return apiFetch('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Cancel order (user)
  cancel: async (orderNumber: string) => {
    return apiFetch(`/orders/${orderNumber}/cancel`, {
      method: 'PUT',
    });
  },

  // Cancel order (guest)
  cancelGuest: async (orderNumber: string, email: string) => {
    return apiFetch(`/orders/${orderNumber}/cancel-guest`, {
      method: 'PUT',
      body: JSON.stringify({ email }),
    });
  },

  // Get all orders (Admin)
  getAllAdmin: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.limit) searchParams.append('limit', String(params.limit));

    const query = searchParams.toString();
    return apiFetch(`/admin/orders${query ? `?${query}` : ''}`);
  },

  // Get order by ID (Admin)
  getByIdAdmin: async (id: string) => {
    return apiFetch(`/admin/orders/${id}`);
  },

  // Update order status (Admin)
  updateStatus: async (id: string, status: string) => {
    return apiFetch(`/admin/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// ==================== BANNER API ====================

export const bannerApi = {
  // Get all active banners
  getAll: async () => {
    return apiFetch('/banners');
  },

  // Get banner by ID
  getById: async (id: string) => {
    return apiFetch(`/banners/${id}`);
  },

  // Create banner (Admin)
  create: async (bannerData: any) => {
    return apiFetch('/banners', {
      method: 'POST',
      body: JSON.stringify(bannerData),
    });
  },

  // Update banner (Admin)
  update: async (id: string, bannerData: any) => {
    return apiFetch(`/banners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bannerData),
    });
  },

  // Delete banner (Admin)
  delete: async (id: string) => {
    return apiFetch(`/banners/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== PAGE BANNER API ====================

export const pageBannerApi = {
  // Get page banner by page name
  getByPage: async (page: 'products' | 'about' | 'contact') => {
    return apiFetch(`/page-banners?page=${page}`);
  },

  // Get all page banners (Admin)
  getAll: async () => {
    return apiFetch('/page-banners');
  },

  // Create page banner (Admin)
  create: async (bannerData: any) => {
    return apiFetch('/page-banners', {
      method: 'POST',
      body: JSON.stringify(bannerData),
    });
  },

  // Update page banner (Admin)
  update: async (page: string, bannerData: any) => {
    return apiFetch(`/page-banners?page=${page}`, {
      method: 'PUT',
      body: JSON.stringify(bannerData),
    });
  },

  // Delete page banner (Admin)
  delete: async (page: string) => {
    return apiFetch(`/page-banners?page=${page}`, {
      method: 'DELETE',
    });
  },
};

// ==================== FEATURED COLLECTION API ====================

export const featuredCollectionApi = {
  // Get all active collections
  getAll: async () => {
    return apiFetch('/featured-collections');
  },

  // Get collection by ID
  getById: async (id: string) => {
    return apiFetch(`/featured-collections/${id}`);
  },

  // Create collection (Admin)
  create: async (collectionData: any) => {
    return apiFetch('/featured-collections', {
      method: 'POST',
      body: JSON.stringify(collectionData),
    });
  },

  // Update collection (Admin)
  update: async (id: string, collectionData: any) => {
    return apiFetch(`/featured-collections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(collectionData),
    });
  },

  // Delete collection (Admin)
  delete: async (id: string) => {
    return apiFetch(`/featured-collections/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== PRODUCT SECTION API ====================

export const productSectionApi = {
  // Get all active sections
  getAll: async () => {
    return apiFetch('/product-sections');
  },

  // Get section by ID
  getById: async (id: string) => {
    return apiFetch(`/product-sections/${id}`);
  },

  // Create section (Admin)
  create: async (sectionData: any) => {
    return apiFetch('/product-sections', {
      method: 'POST',
      body: JSON.stringify(sectionData),
    });
  },

  // Update section (Admin)
  update: async (id: string, sectionData: any) => {
    return apiFetch(`/product-sections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sectionData),
    });
  },

  // Delete section (Admin)
  delete: async (id: string) => {
    return apiFetch(`/product-sections/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== USER API ====================

export const userApi = {
  // Register user
  register: async (userData: { email: string; password: string; name: string; phone?: string }) => {
    return apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login user
  login: async (credentials: { email: string; password: string }) => {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Get user profile
  getProfile: async () => {
    return apiFetch('/user/profile');
  },

  // Update user profile
  updateProfile: async (userData: any) => {
    return apiFetch('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Get all users (Admin)
  getAll: async () => {
    return apiFetch('/users');
  },
};

// ==================== ADMIN API ====================

export const adminApi = {
  // Admin login
  login: async (credentials: { email: string; password: string }) => {
    return apiFetch('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Setup admin (development)
  setup: async (adminData: { email: string; password: string; name: string }) => {
    return apiFetch('/setup/admin', {
      method: 'POST',
      body: JSON.stringify(adminData),
    });
  },

  // Make user admin
  makeAdmin: async (email: string) => {
    return apiFetch('/setup/make-admin', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

// ==================== UPLOAD API ====================

export const uploadApi = {
  // Upload image
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      return { success: true, data };
    } catch (error: any) {
      console.error('Upload Error:', error);
      return { success: false, error: error.message };
    }
  },
};

// ==================== SETTINGS API ====================

export const settingsApi = {
  // Get banner settings
  getBannerSettings: async () => {
    return apiFetch('/banner-settings');
  },

  // Update banner settings (Admin)
  updateBannerSettings: async (settings: any) => {
    return apiFetch('/banner-settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  },

  // Delete banner settings (Admin)
  deleteBannerSettings: async () => {
    return apiFetch('/banner-settings', {
      method: 'DELETE',
    });
  },
};

// ==================== REVIEW API ====================

export const reviewApi = {
  // Get all reviews with filters
  getAll: async (params?: {
    product?: string;
    user?: string;
    status?: 'pending' | 'approved' | 'rejected' | 'all';
    rating?: number;
    page?: number;
    limit?: number;
    sort?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.product) searchParams.append('product', params.product);
    if (params?.user) searchParams.append('user', params.user);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.rating) searchParams.append('rating', String(params.rating));
    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.limit) searchParams.append('limit', String(params.limit));
    if (params?.sort) searchParams.append('sort', params.sort);

    const query = searchParams.toString();
    return apiFetch(`/reviews${query ? `?${query}` : ''}`);
  },

  // Get product reviews
  getByProduct: async (productId: string, params?: {
    status?: 'pending' | 'approved' | 'rejected' | 'all';
    page?: number;
    limit?: number;
    sort?: string;
  }) => {
    return reviewApi.getAll({ product: productId, ...params });
  },

  // Get user reviews
  getByUser: async (userId: string, params?: {
    status?: 'pending' | 'approved' | 'rejected' | 'all';
    page?: number;
    limit?: number;
  }) => {
    return reviewApi.getAll({ user: userId, ...params });
  },

  // Get single review by ID
  getById: async (id: string) => {
    return apiFetch(`/reviews/${id}`);
  },

  // Get review statistics for a product
  getStats: async (productId: string) => {
    return apiFetch(`/reviews/stats/${productId}`);
  },

  // Create review (Authenticated users)
  create: async (reviewData: {
    product: string;
    rating: number;
    title: string;
    comment: string;
    images?: string[];
  }) => {
    return apiFetch('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  // Update review (Owner or Admin)
  update: async (id: string, reviewData: any) => {
    return apiFetch(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  },

  // Delete review (Owner or Admin)
  delete: async (id: string) => {
    return apiFetch(`/reviews/${id}`, {
      method: 'DELETE',
    });
  },

  // Mark review as helpful (Authenticated users)
  markHelpful: async (id: string) => {
    return apiFetch(`/reviews/${id}/helpful`, {
      method: 'POST',
    });
  },

  // Admin: Approve review
  approve: async (id: string) => {
    return reviewApi.update(id, { status: 'approved' });
  },

  // Admin: Reject review
  reject: async (id: string) => {
    return reviewApi.update(id, { status: 'rejected' });
  },

  // Admin: Respond to review
  respond: async (id: string, message: string) => {
    return reviewApi.update(id, { adminResponse: message });
  },
};

// Export all APIs
export const api = {
  products: productApi,
  categories: categoryApi,
  brands: brandApi,
  orders: orderApi,
  banners: bannerApi,
  pageBanners: pageBannerApi,
  featuredCollections: featuredCollectionApi,
  productSections: productSectionApi,
  users: userApi,
  admin: adminApi,
  upload: uploadApi,
  settings: settingsApi,
  reviews: reviewApi,
};

export default api;

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import { 
  FiHome, 
  FiPackage, 
  FiShoppingBag, 
  FiUsers, 
  FiImage, 
  FiGrid, 
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiEye,
  FiTool
} from 'react-icons/fi';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!isAuthenticated || user?.role !== 'admin')) {
      router.push('/admin/login');
    }
  }, [mounted, isAuthenticated, user, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!mounted || !isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-cream">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-contrast-500 border-t-primary-500"></div>
      </div>
    );
  }

  const menuItems = [
    { name: 'Dashboard', icon: FiHome, path: '/admin/dashboard' },
    { name: 'Products', icon: FiPackage, path: '/admin/products' },
    { name: 'Categories', icon: FiGrid, path: '/admin/categories' },
    { name: 'Brands', icon: FiGrid, path: '/admin/brands' },
    { name: 'Orders', icon: FiShoppingBag, path: '/admin/orders' },
    { name: 'Banners', icon: FiImage, path: '/admin/banners' },
    { name: 'Page Banners', icon: FiImage, path: '/admin/page-banners' },
    { name: 'Collections', icon: FiImage, path: '/admin/collections' },
    { name: 'Users', icon: FiUsers, path: '/admin/users' },
    { name: 'Preview', icon: FiEye, path: '/admin/preview' },
    { name: 'Maintenance', icon: FiTool, path: '/admin/maintenance' },
    { name: 'Settings', icon: FiSettings, path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FBEAEB' }}>
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-contrast-50 rounded text-text-primary"
            >
              {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="relative h-8 w-32 md:h-10 md:w-40">
                <Image
                  src="/images/branding/logo.png"
                  alt="Poonam Cosmetics"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-xl font-bold hidden sm:inline" style={{ color: '#2F3C7E' }}>Admin</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-sm text-text-secondary hover:text-primary-500 transition-colors"
            >
              View Site
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-secondary">Hello, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="p-2 text-text-secondary hover:text-primary-500 hover:bg-contrast-50 rounded transition-colors"
                title="Logout"
              >
                <FiLogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-[57px] left-0 h-[calc(100vh-57px)] w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out z-30 shadow-xl ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Sidebar Logo/Header */}
          <div className="border-b border-contrast-500 p-4">
            <Link href="/admin/dashboard" onClick={() => setSidebarOpen(false)} className="flex flex-col items-center gap-2">
              <div className="relative h-12 w-48">
                <Image
                  src="/images/branding/logo.png"
                  alt="Poonam Cosmetics"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-sm font-semibold text-slate-600">Admin Dashboard</span>
            </Link>
          </div>
          
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 relative group
                    ${isActive 
                      ? 'text-white shadow-md' 
                      : 'text-text-primary hover:bg-slate-100'
                    }
                  `}
                  style={isActive ? { backgroundColor: '#2F3C7E' } : {}}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                  )}
                  
                  <item.icon size={20} className={isActive ? 'text-white' : ''} />
                  <span>{item.name}</span>
                  
                  {/* Hover effect */}
                  {!isActive && (
                    <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ backgroundColor: '#FBEAEB' }} />
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

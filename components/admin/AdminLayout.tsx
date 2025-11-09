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
    <div className="min-h-screen bg-stone-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-stone-100 transition-colors"
            >
              {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="relative h-8 w-32 md:h-10 md:w-40">
                <Image
                  src="/images/branding/logo.png"
                  alt="Poonam Cosmetics"
                  fill
                  sizes="(max-width: 768px) 128px, 160px"
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-xl font-semibold hidden sm:inline text-stone-800 tracking-wide">ADMIN</span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              target="_blank"
              className="text-sm text-stone-600 hover:text-stone-900 transition-colors uppercase tracking-wider font-medium"
            >
              View Site
            </Link>
            <div className="flex items-center gap-3 border-l border-stone-200 pl-6">
              <span className="text-sm text-stone-600 font-medium">Hello, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
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
          className={`fixed lg:sticky top-[73px] left-0 h-[calc(100vh-73px)] w-64 bg-stone-100 border-r border-stone-200 transform transition-transform duration-200 ease-in-out z-30 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 font-medium transition-all duration-200 relative group uppercase tracking-wider text-sm
                    ${isActive 
                      ? 'text-white bg-stone-700' 
                      : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200'
                    }
                  `}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: '#d4af37' }} />
                  )}
                  
                  <item.icon size={18} />
                  <span>{item.name}</span>
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
        <main className="flex-1 p-8 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}

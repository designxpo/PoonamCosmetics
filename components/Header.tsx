'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { FiShoppingCart, FiSearch, FiMenu, FiX, FiUser, FiLogOut, FiPackage } from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [navigationItems, setNavigationItems] = useState<any[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/';
  const { isAuthenticated, user, logout } = useAuthStore();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const linkBaseClasses = isHome
    ? 'block py-2 font-medium text-white/80 hover:text-white'
    : 'block py-2 font-medium text-text-primary hover:text-text-primary';
  const totalItems = useCartStore((state) => state.getTotalItems());

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    fetchNavigationItems();
  }, []);

  const fetchNavigationItems = async () => {
    try {
      const res = await fetch('/api/navigation');
      const data = await res.json();
      
      if (data.success && data.items) {
        setNavigationItems(data.items);
      }
    } catch (error) {
      console.error('Error fetching navigation:', error);
      // Set default navigation if fetch fails
      setNavigationItems([
        { label: 'Home', href: '/', order: 1 },
        { label: 'Bridal', href: '/collection/bridal', order: 2 },
        { label: 'Cosmetics', href: '/category/cosmetics', order: 3 },
        { label: 'Skincare', href: '/category/skincare', order: 4 },
        { label: 'Haircare', href: '/category/haircare', order: 5 },
        { label: 'Offers', href: '/products?sale=true', order: 6 },
        { label: 'Contact', href: '/contact', order: 7 },
      ]);
    }
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    toast.success('Logged out successfully');
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Upper Nav - Logo, Search, Account, Cart */}
      <div className="border-b border-border-light">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <div className="relative h-10 w-40 md:h-12 md:w-48">
                <Image
                  src="/images/branding/logo.png"
                  alt="Poonam Cosmetics"
                  fill
                  className="object-contain drop-shadow-xl"
                  priority
                />
              </div>
            </Link>

            {/* Right Side Actions - Search, Account, Cart */}
            <div className="flex items-center space-x-3 md:space-x-4">
            {/* Desktop Search Toggle */}
            <button
              className="hidden md:block text-text-primary hover:text-text-primary transition-colors"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Toggle search"
            >
              <FiSearch size={22} />
            </button>

            {/* Mobile Search Toggle */}
            <button
              className="md:hidden text-text-primary"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Toggle search"
            >
              <FiSearch size={24} />
            </button>

            {/* User Menu - Desktop */}
            {mounted && isAuthenticated ? (
              <div className="hidden md:block relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-text-primary hover:text-text-primary transition-colors"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 rounded-full bg-text-primary flex items-center justify-center text-white font-semibold border border-border-main">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="font-medium hidden lg:inline">{user?.name?.split(' ')[0]}</span>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-sm shadow-lg border border-contrast-500 py-2 z-50">
                    <div className="px-4 py-2 border-b border-contrast-500">
                      <p className="font-semibold text-text-primary truncate">{user?.name}</p>
                      <p className="text-xs text-text-secondary truncate">{user?.email}</p>
                    </div>
                    <Link
                      href="/account"
                      className="flex items-center space-x-3 px-4 py-2 text-text-primary hover:bg-contrast-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <FiPackage size={18} />
                      <span>My Orders</span>
                    </Link>
                    <Link
                      href="/account"
                      className="flex items-center space-x-3 px-4 py-2 text-text-primary hover:bg-contrast-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <FiUser size={18} />
                      <span>My Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FiLogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : mounted ? (
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <Link
                  href="/login"
                  className="text-text-primary hover:text-text-primary font-medium transition-colors"
                >
                  Login
                </Link>
                <span className="text-text-secondary">|</span>
                <Link
                  href="/register"
                  className="text-text-primary hover:text-text-primary font-medium transition-colors"
                >
                  Register
                </Link>
              </div>
            ) : null}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative text-text-primary hover:text-text-primary transition-colors"
              aria-label="Shopping cart"
            >
              <FiShoppingCart size={24} />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden text-text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            </div>
          </div>
        </div>
      </div>

      {/* Second Nav - Menu Items */}
      <div className="hidden lg:block bg-background-secondary">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-center">
            <ul className="flex items-center space-x-10 md:space-x-12 text-text-primary py-3.5 text-sm md:text-[15px] tracking-wide">
              {navigationItems.map((item) => (
                <li key={item._id}>
                  <Link href={item.href} className="font-normal transition-colors hover:text-text-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Search Bar - Dropdown */}
      {searchOpen && (
        <div className="pt-4 pb-2 px-4 border-t border-border-light">
          <form onSubmit={handleSearch}>
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                id="header-search"
                name="search"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-3 rounded-none focus:outline-none focus:ring-2 border border-border-main bg-white text-slate-800 placeholder-slate-400 focus:ring-text-primary focus:border-text-primary"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-none transition-colors bg-white text-text-primary border-2 border-text-primary hover:bg-text-primary hover:text-white"
                aria-label="Search"
              >
                <FiSearch size={18} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <nav className="lg:hidden pt-4 pb-2 border-t border-slate-100 mt-4">
          <ul className="space-y-3">
              {/* User Info - Mobile */}
              {mounted && isAuthenticated && user && (
                <li className="pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-none bg-text-primary flex items-center justify-center text-white font-semibold border border-border-main">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </li>
              )}

              {navigationItems.map((item) => (
                <li key={item._id}>
                  <Link
                    href={item.href}
                    className="block py-2 font-medium transition-colors text-slate-700 hover:text-text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              {/* Auth Links - Mobile */}
              {mounted && isAuthenticated ? (
                <>
                  <li className="pt-3 mt-3 border-t border-slate-100">
                    <Link
                      href="/account"
                      className="flex items-center space-x-3 py-2 font-medium transition-colors text-slate-700 hover:text-text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FiPackage size={18} />
                      <span>My Orders</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/account"
                      className="flex items-center space-x-3 py-2 font-medium transition-colors text-slate-700 hover:text-text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FiUser size={18} />
                      <span>My Profile</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center space-x-3 py-2 font-medium transition-colors text-red-600 hover:text-red-700"
                    >
                      <FiLogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </li>
                </>
              ) : mounted ? (
                <>
                  <li className="pt-3 mt-3 border-t border-slate-100">
                    <Link
                      href="/login"
                      className="flex items-center space-x-3 py-2 font-medium transition-colors text-slate-700 hover:text-text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FiUser size={18} />
                      <span>Login</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      className="flex items-center space-x-3 py-2 font-medium transition-colors text-slate-700 hover:text-text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FiUser size={18} />
                      <span>Register</span>
                    </Link>
                  </li>
                </>
              ) : null}
            </ul>
          </nav>
        )}
    </header>
  );
}

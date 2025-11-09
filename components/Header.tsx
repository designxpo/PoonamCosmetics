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
        { _id: '1', label: 'Home', href: '/', order: 1 },
        { _id: '2', label: 'Bridal', href: '/collection/bridal', order: 2 },
        { _id: '3', label: 'Cosmetics', href: '/category/cosmetics', order: 3 },
        { _id: '4', label: 'Skincare', href: '/category/skincare', order: 4 },
        { _id: '5', label: 'Haircare', href: '/category/haircare', order: 5 },
        { _id: '6', label: 'Offers', href: '/products?sale=true', order: 6 },
        { _id: '7', label: 'Contact', href: '/contact', order: 7 },
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
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-stone-200">
      {/* Top Info Bar */}
      <div className="bg-gradient-to-r from-stone-100 via-amber-50 to-stone-100 border-b border-stone-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2 text-xs">
            <div className="flex items-center gap-4 text-stone-700">
              <span className="hidden md:inline font-medium tracking-wider">PREMIUM JOY EXPERIENCE - 20% OFF EVERYTHING</span>
              <span className="md:hidden">20% OFF SALE</span>
            </div>
            <div className="flex items-center gap-4 text-stone-700">
              <span className="hidden sm:inline font-medium">📞 +91 99999 99999</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-5 relative">
          {/* Left - Hamburger Menu for Mobile */}
          <div className="flex-1 flex items-center">
            <button
              className="md:hidden text-stone-700 hover:text-stone-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>

          {/* Center - Logo */}
          <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative h-14 w-52 md:h-20 md:w-72">
              <Image
                src="/images/branding/logo_Header.png"
                alt="Poonam Cosmetics"
                fill
                sizes="(max-width: 768px) 208px, 288px"
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Right - Icons */}
          <div className="flex-1 flex items-center justify-end space-x-4 md:space-x-6">
            <button
              className="text-stone-700 hover:text-stone-900 transition-colors"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <FiSearch size={20} />
            </button>

            {/* User Menu */}
            {mounted && isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="text-stone-700 hover:text-stone-900 transition-colors"
                  aria-label="User menu"
                >
                  <FiUser size={20} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-sm shadow-lg border border-stone-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-stone-200">
                      <p className="font-semibold text-stone-900 truncate">{user?.name}</p>
                      <p className="text-xs text-stone-500 truncate">{user?.email}</p>
                    </div>
                    <Link
                      href="/account"
                      className="flex items-center space-x-3 px-4 py-2 text-stone-700 hover:bg-stone-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <FiPackage size={18} />
                      <span>My Orders</span>
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
              <Link
                href="/login"
                className="text-stone-700 hover:text-stone-900 transition-colors"
                aria-label="Login"
              >
                <FiUser size={20} />
              </Link>
            ) : null}

            <Link
              href="/cart"
              className="relative text-stone-700 hover:text-stone-900 transition-colors"
              aria-label="Shopping cart"
            >
              <FiShoppingCart size={20} />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Desktop Navigation Menu */}
        <nav className="hidden md:block border-t-2 border-stone-200 bg-gradient-to-b from-stone-50 to-white">
          <ul className="container mx-auto flex items-center justify-center gap-1 py-3.5 px-4">
            {navigationItems.length === 0 && (
              <li className="text-stone-400 text-xs">Loading...</li>
            )}
            {navigationItems.map((item) => (
              <li key={item._id}>
                <Link 
                  href={item.href} 
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-amber-700 hover:bg-stone-100 rounded-md tracking-[0.08em] uppercase transition-all duration-200"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-stone-200 shadow-lg z-50">
          <div className="container mx-auto px-4 py-6">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pr-24 border-b-2 border-stone-300 focus:border-amber-700 outline-none text-lg transition-colors"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-0 top-1/2 -translate-y-1/2 px-6 py-2 text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-stone-50 to-white border-t-2 border-stone-200 shadow-lg">
          <nav className="container mx-auto px-4 py-5">
            <ul className="space-y-1">
              {/* User Info - Mobile */}
              {mounted && isAuthenticated && user && (
                <li className="pb-3 mb-3 border-b border-stone-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-amber-700 flex items-center justify-center text-white font-semibold">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-stone-900">{user.name}</p>
                      <p className="text-xs text-stone-500">{user.email}</p>
                    </div>
                  </div>
                </li>
              )}

              {navigationItems.map((item) => (
                <li key={item._id}>
                  <Link
                    href={item.href}
                    className="block px-4 py-3 text-sm font-semibold text-stone-600 hover:text-amber-700 hover:bg-stone-50 rounded-lg uppercase tracking-wide transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              {/* Auth Links - Mobile */}
              {mounted && isAuthenticated ? (
                <>
                  <li className="pt-3 mt-3 border-t border-stone-200">
                    <Link
                      href="/account"
                      className="flex items-center space-x-3 py-2 text-stone-700 hover:text-stone-900 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FiPackage size={18} />
                      <span>My Orders</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center space-x-3 py-2 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <FiLogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </li>
                </>
              ) : mounted ? (
                <>
                  <li className="pt-3 mt-3 border-t border-stone-200">
                    <Link
                      href="/login"
                      className="flex items-center space-x-3 py-2 text-stone-700 hover:text-stone-900 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FiUser size={18} />
                      <span>Login</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      className="flex items-center space-x-3 py-2 text-stone-700 hover:text-stone-900 transition-colors"
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
        </div>
      )}
    </header>
  );
}

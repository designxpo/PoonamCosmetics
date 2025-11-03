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
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/';
  const { isAuthenticated, user, logout } = useAuthStore();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const linkBaseClasses = isHome
    ? 'block py-2 font-medium text-white/80 hover:text-white'
    : 'block py-2 font-medium text-slate-700 hover:text-primary-600';
  const totalItems = useCartStore((state) => state.getTotalItems());

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

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
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
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

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center flex-1 justify-center mx-8">
            <ul className="flex items-center space-x-8 text-slate-700">
              <li>
                <Link href="/" className="font-medium transition-colors hover:text-primary-600">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="font-medium transition-colors hover:text-primary-600">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="font-medium transition-colors hover:text-primary-600">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="font-medium transition-colors hover:text-primary-600">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Desktop Search Toggle */}
            <button
              className="hidden md:block text-slate-700 hover:text-primary-600 transition-colors"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Toggle search"
            >
              <FiSearch size={22} />
            </button>

            {/* Mobile Search Toggle */}
            <button
              className="md:hidden text-slate-700"
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
                  className="flex items-center space-x-2 text-slate-700 hover:text-primary-600 transition-colors"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="font-medium hidden lg:inline">{user?.name?.split(' ')[0]}</span>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-sm shadow-lg border border-slate-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-semibold text-slate-800 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <Link
                      href="/account"
                      className="flex items-center space-x-3 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <FiPackage size={18} />
                      <span>My Orders</span>
                    </Link>
                    <Link
                      href="/account"
                      className="flex items-center space-x-3 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
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
                  className="text-slate-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <span className="text-slate-400">|</span>
                <Link
                  href="/register"
                  className="text-slate-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Register
                </Link>
              </div>
            ) : null}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative text-slate-700 hover:text-primary-600 transition-colors"
              aria-label="Shopping cart"
            >
              <FiShoppingCart size={24} />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden text-slate-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Search Bar - Dropdown */}
        {searchOpen && (
          <div className="pt-4 pb-2">
            <form onSubmit={handleSearch}>
              <div className="relative max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-3 rounded-full focus:outline-none focus:ring-2 border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:ring-primary-400 focus:border-primary-400"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors bg-primary-600 text-white hover:bg-primary-700"
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
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white font-semibold">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </li>
              )}

              <li>
                <Link
                  href="/"
                  className="block py-2 font-medium transition-colors text-slate-700 hover:text-primary-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="block py-2 font-medium transition-colors text-slate-700 hover:text-primary-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="block py-2 font-medium transition-colors text-slate-700 hover:text-primary-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="block py-2 font-medium transition-colors text-slate-700 hover:text-primary-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>

              {/* Auth Links - Mobile */}
              {mounted && isAuthenticated ? (
                <>
                  <li className="pt-3 mt-3 border-t border-slate-100">
                    <Link
                      href="/account"
                      className="flex items-center space-x-3 py-2 font-medium transition-colors text-slate-700 hover:text-primary-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FiPackage size={18} />
                      <span>My Orders</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/account"
                      className="flex items-center space-x-3 py-2 font-medium transition-colors text-slate-700 hover:text-primary-600"
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
                      className="flex items-center space-x-3 py-2 font-medium transition-colors text-slate-700 hover:text-primary-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FiUser size={18} />
                      <span>Login</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      className="flex items-center space-x-3 py-2 font-medium transition-colors text-slate-700 hover:text-primary-600"
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
      </div>
    </header>
  );
}

'use client';

import { useState, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiUser, FiPhone } from 'react-icons/fi';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const redirectUrl = searchParams.get('redirect') || '/account';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        }),
      });

      const data = await res.json();

      if (data.success) {
        login(data.user, data.token);
        toast.success('Account created successfully!');
        router.push(redirectUrl);
      } else {
        toast.error(data.error || 'Registration failed');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 pb-20">
        <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="uppercase tracking-[0.3em] text-xs text-secondary-200">Join Us</p>
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold max-w-3xl mx-auto">
              Create Your Account
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-white/70">
              Join Poonam Cosmetics and get exclusive access to offers and order tracking
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 -mt-12 relative z-10">
          <div className="max-w-md mx-auto rounded-sm border border-white/60 bg-white/90 backdrop-blur shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-none border border-slate-200 bg-white text-sm text-slate-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-none border border-slate-200 bg-white text-sm text-slate-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-none border border-slate-200 bg-white text-sm text-slate-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full pl-12 pr-4 py-3 rounded-none border border-slate-200 bg-white text-sm text-slate-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    placeholder="Minimum 6 characters"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-none border border-slate-200 bg-white text-sm text-slate-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    placeholder="Re-enter password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>

              <div className="text-center pt-4">
                <p className="text-sm text-slate-600">
                  Already have an account?{' '}
                  <Link 
                    href={`/login${redirectUrl !== '/account' ? `?redirect=${redirectUrl}` : ''}`}
                    className="text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}

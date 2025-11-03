'use client';

import Link from 'next/link';
import { FaWhatsapp, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="relative mt-24 bg-slate-950 text-white">
      <div className="absolute inset-x-0 -top-6 mx-auto h-12 max-w-4xl rounded-full bg-gradient-to-r from-primary-500/40 via-secondary-500/40 to-primary-500/40 blur-3xl" />
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold tracking-wide">Poonam Cosmetics</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              A curated wardrobe of beauty essentials inspired by global fashion houses. Elevate your routine with formulations designed for modern icons.
            </p>
            <div className="flex items-center gap-3 text-white/50 text-sm">
              <span className="h-3 w-3 rounded-full bg-secondary-500" />
              <span>Made with passion in Mumbai • Est. 2020</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm uppercase tracking-[0.3em] text-white/60">Explore</h4>
            <ul className="mt-5 space-y-3 text-white/80 text-sm">
              <li>
                <Link href="/products" className="hover:text-secondary-300 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-secondary-300 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-secondary-300 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-secondary-300 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm uppercase tracking-[0.3em] text-white/60">Support</h4>
            <ul className="mt-5 space-y-3 text-white/80 text-sm">
              <li>
                <Link href="/shipping" className="hover:text-secondary-300 transition-colors">
                  Shipping & Tracking
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-secondary-300 transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-secondary-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-secondary-300 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-5">
            <h4 className="text-sm uppercase tracking-[0.3em] text-white/60">Stay in Vogue</h4>
            <p className="text-white/70 text-sm leading-relaxed">
              Join our insider list for early access to drops, backstage stories, and exclusive offers tailored for you.
            </p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-secondary-400/60"
              />
              <button type="submit" className="btn-secondary uppercase tracking-[0.3em] text-xs">
                Subscribe
              </button>
            </form>
            <div className="flex items-center gap-4 text-xl text-white/70">
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary-300 transition-colors"
              >
                <FaWhatsapp />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary-300 transition-colors"
              >
                <FaInstagram />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary-300 transition-colors"
              >
                <FaFacebook />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary-300 transition-colors"
              >
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-center text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Poonam Cosmetics. All rights reserved.</p>
          <div className="flex justify-center gap-6">
            <span>WhatsApp: +91 99999 99999</span>
            <span>Email: info@poonamcosmetics.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

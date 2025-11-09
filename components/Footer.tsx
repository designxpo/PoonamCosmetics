'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaWhatsapp, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-stone-100 text-stone-800 mt-20 border-t border-stone-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <div className="relative h-10 w-40 mb-4">
                <Image
                  src="/images/branding/logo.png"
                  alt="Poonam Cosmetics"
                  fill
                  sizes="(max-width: 768px) 128px, 160px"
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            <p className="text-stone-600 text-sm leading-relaxed">
              Your trusted destination for premium cosmetics and beauty products. Quality products at affordable prices.
            </p>
            <div className="flex items-center gap-1 text-stone-600 text-xs">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#d4af37' }} />
              <span>Made with ♥ in India</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-stone-800 font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-stone-600 hover:text-amber-700 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-stone-600 hover:text-amber-700 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-stone-600 hover:text-amber-700 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-stone-600 hover:text-amber-700 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-stone-800 font-semibold mb-4 text-sm uppercase tracking-wider">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shipping" className="text-stone-600 hover:text-amber-700 transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-stone-600 hover:text-amber-700 transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-stone-600 hover:text-amber-700 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-stone-600 hover:text-amber-700 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-stone-800 font-semibold mb-4 text-sm uppercase tracking-wider">Get In Touch</h4>
            <div className="space-y-3 text-sm">
              <p>
                <span className="block font-medium text-stone-800 mb-1">WhatsApp:</span>
                <a href="https://wa.me/919999999999" className="text-stone-600 hover:text-amber-700 transition-colors">
                  +91 99999 99999
                </a>
              </p>
              <p>
                <span className="block font-medium text-stone-800 mb-1">Email:</span>
                <a href="mailto:info@poonamcosmetics.com" className="text-stone-600 hover:text-amber-700 transition-colors">
                  info@poonamcosmetics.com
                </a>
              </p>
            </div>
            
            {/* Social Icons */}
            <div className="mt-5">
              <h5 className="text-stone-800 font-medium mb-3 text-sm">Follow Us</h5>
              <div className="flex items-center gap-3">
                <a
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-stone-200 hover:bg-green-500 hover:text-white text-stone-700 flex items-center justify-center transition-all"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp size={18} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-stone-200 hover:bg-pink-500 hover:text-white text-stone-700 flex items-center justify-center transition-all"
                  aria-label="Instagram"
                >
                  <FaInstagram size={18} />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-stone-200 hover:bg-blue-500 hover:text-white text-stone-700 flex items-center justify-center transition-all"
                  aria-label="Facebook"
                >
                  <FaFacebook size={18} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-stone-200 hover:bg-sky-500 hover:text-white text-stone-700 flex items-center justify-center transition-all"
                  aria-label="Twitter"
                >
                  <FaTwitter size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-stone-300">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-stone-600">
            <p>&copy; {new Date().getFullYear()} Poonam Cosmetics. All rights reserved.</p>
            <div className="flex gap-6 text-xs">
              <Link href="/privacy" className="hover:text-amber-700 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-amber-700 transition-colors">
                Terms
              </Link>
              <Link href="/sitemap" className="hover:text-amber-700 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

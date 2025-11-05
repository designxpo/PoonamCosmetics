'use client';

import Link from 'next/link';
import Image from 'next/image';

const highlights = [
  {
    title: 'Bridal Chosen Makeup',
    description: 'Handpicked premium products for brides',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
    link: '/collection/bridal-chosen',
    bgColor: 'from-pink-100 to-rose-100',
  },
  {
    title: 'Handcrafted Mehndi Cones',
    description: 'Traditional mehndi for your special day',
    image: 'https://images.unsplash.com/photo-1610873167013-4c098f9a9d5c?auto=format&fit=crop&w=600&q=80',
    link: '/category/mehndi',
    bgColor: 'from-amber-100 to-orange-100',
  },
  {
    title: 'Limited Time Discount',
    description: 'Up to 30% off on bridal packages',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80',
    link: '/products?sale=true',
    bgColor: 'from-red-100 to-pink-100',
  },
  {
    title: 'Royal Bridal Sets',
    description: 'Complete bridal makeup collections',
    image: 'https://images.unsplash.com/photo-1515688594390-b649af70d282?auto=format&fit=crop&w=600&q=80',
    link: '/collection/royal-bridal',
    bgColor: 'from-purple-100 to-indigo-100',
  },
];

export default function HighlightBoxes() {
  return (
    <section className="py-16 bg-background-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
            Special Collections
          </h2>
          <p className="text-text-secondary">Curated just for you</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 h-80"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-6 text-white">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-white/90 mb-4">{item.description}</p>
                <span className="inline-flex items-center text-sm font-semibold group-hover:translate-x-2 transition-transform">
                  Shop Now
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

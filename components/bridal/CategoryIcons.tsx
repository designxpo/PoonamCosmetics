'use client';

import Link from 'next/link';

const categories = [
  {
    name: 'Cosmetics',
    icon: '💄',
    slug: 'cosmetics',
  },
  {
    name: 'Bridal Makeup',
    icon: '👰',
    slug: 'bridal-makeup',
  },
  {
    name: 'Hair Accessories',
    icon: '💐',
    slug: 'hair-accessories',
  },
  {
    name: 'Skincare',
    icon: '🧴',
    slug: 'skincare',
  },
  {
    name: 'Mehndi',
    icon: '🎨',
    slug: 'mehndi',
  },
  {
    name: 'Jewelry',
    icon: '💍',
    slug: 'jewelry',
  },
];

export default function CategoryIcons() {
  return (
    <section className="py-16 bg-background-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
            Shop by Categories
          </h2>
          <p className="text-text-secondary">Discover your perfect bridal look</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white shadow-md flex items-center justify-center mb-3 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 text-4xl md:text-5xl">
                {category.icon}
              </div>
              <span className="text-sm md:text-base font-medium text-text-primary group-hover:text-text-primary transition-colors text-center">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';

export interface FeaturedCollectionItem {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  backgroundColor?: string;
}

interface FeaturedCollectionsProps {
  collections: FeaturedCollectionItem[];
}

export default function FeaturedCollections({ collections }: FeaturedCollectionsProps) {
  // Default collections if none provided
  const defaultCollections: FeaturedCollectionItem[] = [
    {
      _id: 'default-1',
      title: 'Autumn Skincare',
      subtitle: 'Discover Now →',
      image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80',
      link: '/products?category=skincare',
      backgroundColor: 'slate-200',
    },
    {
      _id: 'default-2',
      title: 'Anti-aging Cream',
      subtitle: 'Buy 1 Get 1 →',
      image: 'https://images.unsplash.com/photo-1556228852-80c3a083d0d5?auto=format&fit=crop&w=600&q=80',
      link: '/products?category=face-creams',
      backgroundColor: 'slate-200',
    },
    {
      _id: 'default-3',
      title: 'Sale Up To 40% Off',
      subtitle: 'Shop Sale →',
      image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?auto=format&fit=crop&w=600&q=80',
      link: '/products',
      backgroundColor: 'green-100',
    },
  ];

  const displayCollections = collections.length > 0 ? collections : defaultCollections;

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayCollections.map((collection) => (
            <Link
              key={collection._id}
              href={collection.link}
              className={`relative group overflow-hidden rounded-sm h-80 bg-${collection.backgroundColor || 'slate-200'}`}
            >
              <Image
                src={collection.image}
                alt={collection.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{collection.title}</h3>
                <p className="text-sm mb-3 opacity-90">{collection.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

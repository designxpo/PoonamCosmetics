'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  description?: string;
}

export default function BrandsSection() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/brands');
      if (response.ok) {
        const data = await response.json();
        setBrands(data.brands);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle brand card click
  const handleBrandClick = (slug: string) => {
    router.push(`/brand/${slug}`);
  };

  if (loading) {
    return (
      <section className="py-16 bg-background-main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-text-secondary">Loading brands...</div>
        </div>
      </section>
    );
  }

  if (brands.length === 0) {
    return null;
  }

  // Duplicate brands array to create seamless infinite scroll
  const duplicatedBrands = [...brands, ...brands, ...brands];

  return (
    <section className="py-16 bg-background-secondary overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Our Brands
          </h2>
          <p className="text-lg text-text-secondary">
            Shop from your favorite cosmetics brands
          </p>
        </div>

        {/* Infinite Scroll Container */}
        <div className="relative py-4">
          <div
            ref={scrollRef}
            className="overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className={`flex gap-6 items-center ${
                isPaused ? '' : 'animate-infinite-scroll'
              }`}
              style={{
                width: 'max-content',
              }}
            >
              {duplicatedBrands.map((brand, index) => (
                <div
                  key={`${brand._id}-${index}`}
                  onClick={() => handleBrandClick(brand.slug)}
                  className="flex-shrink-0 w-32 h-32 cursor-pointer group"
                >
                  <div className="w-full h-full bg-transparent rounded-full p-4 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 flex items-center justify-center">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gradient Overlays */}
          <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-background-secondary to-transparent pointer-events-none z-10"></div>
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-background-secondary to-transparent pointer-events-none z-10"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes infinite-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        .animate-infinite-scroll {
          animation: infinite-scroll 30s linear infinite;
        }
      `}</style>
    </section>
  );
}

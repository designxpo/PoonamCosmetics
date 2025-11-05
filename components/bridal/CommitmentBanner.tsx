'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function CommitmentBanner() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Image */}
          <div className="relative h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=80"
              alt="Bridal Beauty & Elegance"
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary">
              Our Commitment to Bridal Beauty & Elegance
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              At Poonam Cosmetics, we understand that your wedding day is the most special day of your life. 
              Our carefully curated collection of premium bridal cosmetics ensures you look absolutely stunning 
              on your big day. From traditional to contemporary looks, we have everything you need to create 
              your perfect bridal glow.
            </p>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <span className="text-text-primary text-2xl">✓</span>
                <p className="text-text-secondary">100% Authentic & Premium Quality Products</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-text-primary text-2xl">✓</span>
                <p className="text-text-secondary">Expert Bridal Makeup Consultation</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-text-primary text-2xl">✓</span>
                <p className="text-text-secondary">Long-lasting & Camera-ready Makeup</p>
              </div>
            </div>
            <Link
              href="/about"
              className="inline-block bg-white text-text-primary border-2 border-text-primary px-8 py-3 rounded-none font-semibold hover:bg-text-primary hover:text-white transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

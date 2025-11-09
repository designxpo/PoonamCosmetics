import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-primary-100 pb-24">
        <PageHero
          page="about"
          defaultEyebrow="The Brand"
          defaultTitle="Crafting Luxurious Beauty Rituals"
          defaultDescription="We exist to empower every individual to feel runway-ready, every single day. Discover what makes Poonam Cosmetics the preferred choice for beauty enthusiasts."
        />

        <section className="container mx-auto px-4 -mt-12 relative z-10 space-y-16 bg-white py-12 rounded-xl shadow-lg">
          {/* Story Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 rounded-sm border border-white/60 bg-white/90 backdrop-blur p-10 shadow-xl">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-secondary-500">Our Story</p>
              <h2 className="text-3xl font-semibold text-slate-900">
                From boutique studio to a nationwide beauty movement
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  Poonam Cosmetics was founded with a simple vision: to make premium beauty products accessible to everyone. We believe that everyone deserves to feel beautiful and confident.
                </p>
                <p>
                  Years of industry experience taught us that authenticity, transparency, and care are non-negotiable. Our curated shelves showcase products vetted for efficacy, innovation, and ethical sourcing.
                </p>
                <p>
                  Today, we collaborate with pioneering labs and artisans to deliver cosmeceutical-grade essentials, shipped with warmth and wrapped in luxury.
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-sm bg-gradient-to-br from-primary-500/10 via-secondary-500/10 to-primary-500/10 p-10">
              <Image
                src="https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=900&q=80"
                alt="Poonam Cosmetics studio"
                fill
                className="object-cover absolute inset-0 opacity-30"
              />
              <div className="relative z-10 h-full flex flex-col justify-between text-white">
                <div>
                  <p className="uppercase tracking-[0.3em] text-xs text-white/70">Philosophy</p>
                  <h3 className="mt-4 text-3xl font-semibold">
                    Quality • Trust • Beauty
                  </h3>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">
                  Every formulation passes through a rigorous five-step evaluation to ensure it delivers on radiance, longevity, and skin-kind ingredients.
                </p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div>
            <h2 className="text-center text-3xl font-semibold text-slate-900 mb-12">
              The pillars that guide every collection
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: '🎯',
                  title: 'Authenticity',
                  copy: 'Certified original products sourced directly from brand partners and authorized distributors.',
                },
                {
                  icon: '💝',
                  title: 'Customer First',
                  copy: 'Concierge-level guidance and aftercare to help you curate routines that fit your lifestyle.',
                },
                {
                  icon: '⚡',
                  title: 'Fast Delivery',
                  copy: '48-hour express dispatch across major cities with eco-conscious packaging.',
                },
              ].map((value) => (
                <div key={value.title} className="rounded-sm border border-slate-100 bg-white p-8 text-center shadow-lg">
                  <div className="text-5xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{value.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{value.copy}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="rounded-sm bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 text-white p-12 shadow-xl">
            <h2 className="text-3xl font-semibold text-center mb-10">Why choose Poonam Cosmetics?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: 'Wide Product Range',
                  copy: 'Makeup, skincare, haircare, and accessories curated from premium Indian and international labels.',
                },
                {
                  title: 'Competitive Prices',
                  copy: 'Luxury made accessible with transparent pricing, bundles, and loyalty exclusives.',
                },
                {
                  title: 'Express WhatsApp Ordering',
                  copy: 'Seamless checkout with personal stylists to recommend shades and routines in real-time.',
                },
                {
                  title: 'Expert Support',
                  copy: 'Certified beauty advisors available 7 days a week to answer regimen or ingredient queries.',
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">✅</div>
                  <div>
                    <h4 className="font-semibold mb-2 text-lg">{item.title}</h4>
                    <p className="text-white/80 text-sm leading-relaxed">{item.copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-semibold text-slate-900">Ready to elevate your vanity?</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Discover new arrivals, limited editions, and cult favourites—all handpicked to make every day feel like a fashion-week finale.
            </p>
            <a href="/products" className="btn-primary inline-block text-sm uppercase tracking-[0.3em]">
              Browse Products
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

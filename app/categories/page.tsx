import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/categories`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 pb-20">
        <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-20">
          <div className="container mx-auto px-4">
            <p className="uppercase tracking-[0.3em] text-xs text-secondary-200">Collections</p>
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold max-w-2xl">
              Shop curated categories crafted for every beauty ritual
            </h1>
            <p className="mt-6 max-w-2xl text-white/70">
              From runway-ready lip shades to restorative skincare, browse by category and build your personalized routine.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 -mt-12 relative z-10">
          {categories.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">📂</div>
              <h2 className="text-2xl font-semibold mb-4 text-slate-800">No categories yet</h2>
              <p className="text-slate-500">Categories will appear here once added by the admin</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {categories.map((category: any) => (
                <Link
                  key={category._id}
                  href={`/products?category=${category.slug}`}
                  className="group"
                >
                  <div className="rounded-sm overflow-hidden border border-white/60 bg-white/80 backdrop-blur shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                    {category.image ? (
                      <div className="relative h-48 bg-slate-100">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-primary-200 to-secondary-200 flex items-center justify-center">
                        <span className="text-6xl">✨</span>
                      </div>
                    )}
                    <div className="p-6 space-y-3">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Beauty</p>
                      <h3 className="text-xl font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-slate-500 text-sm line-clamp-2">{category.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-primary-600 text-sm font-semibold uppercase tracking-[0.3em]">
                        <span>Explore</span>
                        <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';

interface PageHeroProps {
  page: 'products' | 'about' | 'contact';
  defaultEyebrow: string;
  defaultTitle: string;
  defaultDescription: string;
}

interface PageBannerData {
  eyebrow: string;
  title: string;
  description: string;
  backgroundImage?: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  isActive: boolean;
}

export default function PageHero({ 
  page, 
  defaultEyebrow, 
  defaultTitle, 
  defaultDescription 
}: PageHeroProps) {
  const [banner, setBanner] = useState<PageBannerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanner();
  }, [page]);

  const fetchBanner = async () => {
    try {
      const response = await fetch(`/api/page-banners?page=${page}`);
      const data = await response.json();

      if (data.success && data.banner && data.banner.isActive) {
        setBanner(data.banner);
      }
    } catch (error) {
      console.error('Error fetching page banner:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-white/20 rounded w-32 mx-auto"></div>
            <div className="h-12 bg-white/20 rounded w-3/4 mx-auto"></div>
            <div className="h-6 bg-white/20 rounded w-2/3 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  // Use custom banner if available, otherwise use defaults
  const eyebrow = banner?.eyebrow || defaultEyebrow;
  const title = banner?.title || defaultTitle;
  const description = banner?.description || defaultDescription;
  const backgroundImage = banner?.backgroundImage;
  const gradientFrom = banner?.gradientFrom || 'slate-900';
  const gradientVia = banner?.gradientVia || 'slate-800';
  const gradientTo = banner?.gradientTo || 'slate-900';

  return (
    <section
      className={`${
        backgroundImage
          ? 'bg-cover bg-center'
          : `bg-gradient-to-r from-${gradientFrom} via-${gradientVia} to-${gradientTo}`
      } text-white py-20 relative`}
      style={
        backgroundImage
          ? { backgroundImage: `url(${backgroundImage})` }
          : undefined
      }
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-slate-900/50"></div>
      )}
      <div className="container mx-auto px-4 text-center relative z-10">
        <p className="uppercase tracking-[0.3em] text-xs text-secondary-200">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-4xl md:text-5xl font-semibold max-w-3xl mx-auto">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-white/70">
          {description}
        </p>
      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface BannerSettings {
  textColor: string;
  ctaBackgroundColor: string;
  ctaTextColor: string;
  ctaBorderColor: string;
  ctaHoverBackgroundColor: string;
  ctaHoverTextColor: string;
}

export default function BridalHeroBanner() {
  const [settings, setSettings] = useState<BannerSettings>({
    textColor: '#FFFFFF',
    ctaBackgroundColor: 'transparent',
    ctaTextColor: '#FFFFFF',
    ctaBorderColor: '#FFFFFF',
    ctaHoverBackgroundColor: '#FFFFFF',
    ctaHoverTextColor: '#000000',
  });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/banner-settings?section=bridal-hero');
      const data = await res.json();
      
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching banner settings:', error);
    }
  };

  return (
    <section className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80"
          alt="Bridal Glow Collection"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl">
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg"
            style={{ color: settings.textColor }}
          >
            Bridal Glow Collection
          </h1>
          <p 
            className="text-xl md:text-2xl mb-8 drop-shadow-md"
            style={{ color: settings.textColor }}
          >
            For Your Big Day
          </p>
          <Link
            href="/collection/bridal"
            className="inline-block px-8 py-4 rounded-none font-semibold text-lg border-2 transition-all duration-300"
            style={{
              backgroundColor: isHovered ? settings.ctaHoverBackgroundColor : settings.ctaBackgroundColor,
              color: isHovered ? settings.ctaHoverTextColor : settings.ctaTextColor,
              borderColor: settings.ctaBorderColor,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}

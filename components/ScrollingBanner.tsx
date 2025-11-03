'use client';

import { useEffect, useRef } from 'react';

interface ScrollingBannerProps {
  messages?: string[];
  bgColor?: string;
  textColor?: string;
  speed?: number;
}

export default function ScrollingBanner({
  messages = [
    '🎉 Free Shipping on Orders Above ₹999',
    '✨ New Arrivals Every Week',
    '💄 100% Authentic Products',
    '🎁 Special Offers on Festive Season',
    '⚡ Fast Delivery Across India',
  ],
  bgColor = 'bg-gradient-to-r from-primary-600 via-secondary-500 to-primary-600',
  textColor = 'text-white',
  speed = 30,
}: ScrollingBannerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    let animationId: number;
    let position = 0;

    const scroll = () => {
      position -= 1;
      const contentWidth = scrollElement.scrollWidth / 2;

      if (Math.abs(position) >= contentWidth) {
        position = 0;
      }

      scrollElement.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  const allMessages = [...messages, ...messages]; // Duplicate for seamless loop

  return (
    <div className={`${bgColor} ${textColor} py-2.5 overflow-hidden relative`}>
      <div
        ref={scrollRef}
        className="flex whitespace-nowrap"
        style={{ willChange: 'transform' }}
      >
        {allMessages.map((message, index) => (
          <span
            key={index}
            className="inline-flex items-center px-8 text-sm font-medium tracking-wide"
          >
            {message}
            <span className="mx-4 text-white/40">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}

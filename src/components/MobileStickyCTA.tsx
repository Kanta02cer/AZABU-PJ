import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * Mobile-only sticky CTA that appears at the bottom of the screen
 * after the user scrolls past the hero section.
 */
export function MobileStickyCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show the CTA after scrolling down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 w-full z-50 transition-transform duration-500 ease-in-out md:hidden ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-white/95 backdrop-blur-md border-t border-[#111111]/10 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <a
          href="#エントリー"
          className="flex items-center justify-center gap-2 w-full bg-[#FF6B00] text-white py-3 px-4 rounded-full font-bold shadow-[0_4px_15px_rgba(255,107,0,0.3)] hover:opacity-90 transition-opacity active:scale-[0.98]"
        >
          <i className="ri-mail-send-line text-lg"></i>
          <span>まずは相談する（1dayキャリア相談会）</span>
        </a>
      </div>
    </div>
  );
}

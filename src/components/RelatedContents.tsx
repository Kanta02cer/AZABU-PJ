import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatedSection } from './Animate';

export interface RelatedItem {
  id: string;
  title: string;
  thumbnail?: string;
  date: string;
  category?: string;
  excerpt?: string;
}

interface RelatedContentsProps {
  items: RelatedItem[];
  basePath: '/news' | '/column';
  title?: string;
}

export function RelatedContents({ items, basePath, title = "関連記事" }: RelatedContentsProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="mt-16 sm:mt-24 border-t border-black/10 pt-12 sm:pt-16">
      <AnimatedSection>
        <h3 className="text-xl sm:text-2xl font-bold text-[#111111] mb-8 sm:mb-10 text-center">
          {title}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {items.map((item) => (
            <Link
              to={`${basePath}/${item.id}`}
              key={item.id}
              className="group block"
            >
              <div className="relative overflow-hidden rounded-lg aspect-video mb-4">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-200 transition-colors duration-500">
                    <i className="ri-image-line text-3xl"></i>
                  </div>
                )}
                {item.category && (
                  <div className="absolute top-0 left-0 px-3 py-1 bg-[#FF6B00] text-white text-[10px] sm:text-xs font-bold tracking-widest uppercase">
                    {item.category}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs text-[#111111]/60 font-medium">
                  <i className="ri-calendar-line"></i>
                  <span>{item.date}</span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-[#111111] line-clamp-2 group-hover:text-[#FF6B00] transition-colors duration-300">
                  {item.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </AnimatedSection>
    </div>
  );
}

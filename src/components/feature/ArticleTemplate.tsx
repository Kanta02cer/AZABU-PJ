import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { RelatedContents } from '../RelatedContents';
import { SEO } from '../SEO';
import { AnimatedSection } from '../Animate';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect';

gsap.registerPlugin(ScrollTrigger);

interface ArticleTemplateProps {
  title: string;
  subtitle?: string;
  date: string;
  category: string;
  thumbnail: string;
  content: string;
  tags?: string[];
  relatedArticles?: Array<{
    id: string;
    title: string;
    thumbnail: string;
    category: string;
    date: string;
  }>;
  type: 'news' | 'column';
}

export default function ArticleTemplate({
  title,
  subtitle,
  date,
  category,
  thumbnail,
  content,
  tags = [],
  relatedArticles = [],
  type
}: ArticleTemplateProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const headerContainerRef = useRef<HTMLElement>(null);
  const headerImageWrapperRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [title]); // Added title to trigger scroll to top on route change

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Cinematic Parallax for the cover image
      if (headerImageWrapperRef.current && headerContainerRef.current) {
        gsap.to(headerImageWrapperRef.current, {
          yPercent: 30, // move down relative to container height
          ease: "none",
          scrollTrigger: {
            trigger: headerContainerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          }
        });
      }
    });

    // Reading progress bar logic
    const handleScroll = () => {
      if (!contentRef.current) return;
      const element = contentRef.current;
      const totalHeight = element.clientHeight;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const elementTop = element.offsetTop;
      
      let progress = 0;
      if (scrollY > elementTop) {
        progress = ((scrollY - elementTop) / (totalHeight - windowHeight)) * 100;
        progress = Math.min(100, Math.max(0, progress));
      }
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      ctx.revert();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "image": [
      thumbnail.startsWith('http') ? thumbnail : `https://azabuplus.jp${thumbnail}`
    ],
    "datePublished": date,
    "dateModified": date,
    "author": [{
        "@type": "Organization",
        "name": "AZABU+ Project",
        "url": "https://azabuplus.jp/"
      }]
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] relative">
      <SEO 
        title={`${title} - ${type === 'news' ? 'ニュース' : 'Regalis Journal'}`}
        description={subtitle || content.substring(0, 160).replace(/<[^>]*>?/gm, '')}
        ogImage={thumbnail}
        canonical={`https://azabuplus.jp/${type}/${title}`}
        articleSchema={articleSchema}
      />

      {/* Reading Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-[100]">
        <div 
          className="h-full bg-[#FF6B00] transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Cinematic Full Header */}
      <header ref={headerContainerRef} className="relative w-full h-[80vh] min-h-[600px] flex flex-col justify-end overflow-hidden">
        <div 
          ref={headerImageWrapperRef} 
          className="absolute top-[-10%] left-0 w-full h-[120%] z-0 origin-top"
        >
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover filter brightness-[0.4]"
          />
        </div>

        {/* Header Overlay Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pb-20 sm:pb-32">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-3 text-xs sm:text-sm text-white/50 mb-8 font-bold tracking-widest uppercase">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="shrink-0 text-white/30">/</span>
            <Link to={type === 'news' ? '/news' : '/column'} className="hover:text-white transition-colors">
              {type === 'news' ? 'Updates' : 'Journal'}
            </Link>
          </nav>

          <AnimatedSection animation="slide-up">
            <div className="flex items-center space-x-4 mb-6">
              <span className="inline-block px-4 py-1.5 bg-[#FF6B00] text-white text-xs font-bold uppercase tracking-widest shadow-xl">
                {category}
              </span>
              <time className="text-white/70 text-sm tracking-widest uppercase">{formatDate(date)}</time>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif text-white mb-8 leading-[1.2] drop-shadow-lg">
              {title}
            </h1>

            {subtitle && (
              <p className="text-xl sm:text-2xl text-white/80 leading-relaxed font-light max-w-3xl">
                {subtitle}
              </p>
            )}
          </AnimatedSection>
        </div>
      </header>

      {/* Article Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 -mt-16 sm:-mt-24 relative z-20 bg-[#FDFDFD]">
        
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-12 sm:mb-16 pt-8 sm:pt-12 border-t border-black/10">
            {tags.map((tag, i) => (
              <span key={i} className="px-4 py-1.5 bg-[#111111]/5 text-[#111111] text-xs font-bold tracking-widest uppercase hover:bg-[#111111] hover:text-white transition-colors">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div ref={contentRef}>
          <div 
            className="prose prose-lg md:prose-xl max-w-none article-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        {/* Editorial Styling overrides for markdown content */}
        <style>{`
          .article-content {
            color: #111111;
            font-family: 'Plus Jakarta Sans', 'Noto Sans JP', sans-serif;
            font-weight: 300;
          }
          .article-content h1, .article-content h2, .article-content h3 {
            font-family: 'Playfair Display', 'Noto Serif JP', serif;
            color: #111111;
            letter-spacing: 0.05em;
          }
          .article-content h2 {
            font-size: 2.5rem;
            margin-top: 4rem;
            margin-bottom: 2rem;
            font-weight: 400;
          }
          .article-content h3 {
            font-size: 1.75rem;
            margin-top: 3rem;
            margin-bottom: 1.5rem;
            font-weight: 600;
          }
          .article-content p {
            line-height: 2.2;
            margin-bottom: 2rem;
            font-size: 1.125rem;
            color: rgba(17, 17, 17, 0.85);
          }
          .article-content img {
            width: 100%;
            height: auto;
            margin: 4rem 0;
            border-radius: 4px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          }
          .article-content blockquote {
            border-left: none;
            padding: 3rem 2rem;
            margin: 4rem 0;
            text-align: center;
            position: relative;
            background: rgba(255,107,0, 0.03);
          }
          .article-content blockquote::before {
            content: '"';
            position: absolute;
            top: 2rem;
            left: 50%;
            transform: translateX(-50%);
            font-size: 6rem;
            color: rgba(255,107,0,0.2);
            font-family: 'Playfair Display', serif;
            line-height: 0;
          }
          .article-content blockquote p {
            font-family: 'Playfair Display', 'Noto Serif JP', serif;
            font-size: 1.5rem;
            color: #111111;
            font-style: italic;
            margin-bottom: 0;
            position: relative;
            z-index: 1;
            line-height: 1.8;
          }
          .article-content a {
            color: #FF6B00;
            text-decoration: none;
            border-bottom: 1px solid rgba(255,107,0,0.3);
            transition: border-color 0.3s ease;
          }
          .article-content a:hover {
            border-color: #FF6B00;
          }
          
          /* Special Elements from Original */
          .article-content .highlight-box {
            background: #111111;
            color: #FFF;
            padding: 3rem;
            margin: 4rem 0;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          }
          .article-content .highlight-box h3 {
            color: #FF6B00;
            margin-top: 0;
            font-family: 'Playfair Display', 'Noto Serif JP', serif;
          }
          .article-content .highlight-box p {
            color: rgba(255,255,255,0.8);
            margin-bottom: 0;
          }
        `}</style>

        {/* Share Buttons */}
        <div className="mt-20 pt-10 border-t border-[#111111]/10 flex flex-col items-center">
          <p className="font-serif text-[#111111] text-lg mb-6">Share this story</p>
          <div className="flex space-x-4">
            <button className="w-12 h-12 flex items-center justify-center border border-[#111111]/20 hover:border-[#FF6B00] hover:bg-[#FF6B00] text-[#111111] hover:text-white transition-all duration-300 rounded-full">
              <i className="ri-twitter-x-line text-lg"></i>
            </button>
            <button className="w-12 h-12 flex items-center justify-center border border-[#111111]/20 hover:border-[#FF6B00] hover:bg-[#FF6B00] text-[#111111] hover:text-white transition-all duration-300 rounded-full">
              <i className="ri-facebook-fill text-lg"></i>
            </button>
            <button className="w-12 h-12 flex items-center justify-center border border-[#111111]/20 hover:border-[#FF6B00] hover:bg-[#FF6B00] text-[#111111] hover:text-white transition-all duration-300 rounded-full">
              <i className="ri-line-fill text-lg"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      <div className="border-t border-[#111111]/5 py-20 bg-white">
        <RelatedContents 
          items={relatedArticles.map(article => ({
            ...article,
            excerpt: ''
          }))} 
          basePath={type === 'news' ? '/news' : '/column'} 
        />
      </div>

      {/* Back to List Button */}
      <div className="bg-[#111111] py-16 flex justify-center">
        <Link
          to={type === 'news' ? '/news' : '/column'}
          className="group relative inline-flex items-center gap-4 text-white font-bold tracking-[0.15em] uppercase hover:text-[#FF6B00] transition-colors"
        >
          <i className="ri-arrow-left-line text-2xl group-hover:-translate-x-2 transition-transform duration-500"></i>
          <span className="text-sm">Back to {type === 'news' ? 'Updates' : 'Journal'}</span>
        </Link>
      </div>
    </div>
  );
}

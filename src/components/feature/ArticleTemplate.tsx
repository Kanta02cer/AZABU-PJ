import { useEffect, useRef, useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  code?: string;
  content?: string;
  children?: React.ReactNode;
  tags?: string[];
  relatedArticles?: Array<{
    id: string;
    title: string;
    thumbnail: string;
    category: string;
    date: string;
  }>;
  prevArticle?: { id: string; title: string; type: 'news' | 'column' } | null;
  nextArticle?: { id: string; title: string; type: 'news' | 'column' } | null;
  type: 'news' | 'column';
}

export default function ArticleTemplate({
  title,
  subtitle,
  date,
  category,
  thumbnail,
  code,
  content,
  children,
  tags = [],
  relatedArticles = [],
  prevArticle,
  nextArticle,
  type
}: ArticleTemplateProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const headerContainerRef = useRef<HTMLElement>(null);
  const headerImageWrapperRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // TOC State
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');
  const location = useLocation();

  useEffect(() => {
    // Only scroll to top if there's no hash in the URL (not clicking a TOC link)
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [title, location.pathname, location.hash]); // Added title to trigger scroll to top on route change

  // Extract headings after content is rendered
  useEffect(() => {
    if (!contentRef.current) return;
    
    // Add IDs to h2 and h3 elements if they don't have them
    const headingElements = contentRef.current.querySelectorAll('h2, h3');
    const newHeadings: { id: string; text: string; level: number }[] = [];
    
    headingElements.forEach((el, index) => {
      const level = el.tagName.toLowerCase() === 'h2' ? 2 : 3;
      const text = el.textContent || '';
      // Create a URL-safe ID
      const id = el.id || `heading-${index}-${text.replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf-]/g, '')}`;
      
      if (!el.id) {
        el.id = id;
      }
      
      newHeadings.push({ id, text, level });
    });
    
    setHeadings(newHeadings);
    
    // Setup IntersectionObserver for scroll spy
    const observer = new IntersectionObserver(
      (entries) => {
        // Find all intersecting entries
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Use the first visible entry to update the active heading
          setActiveHeadingId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: '-10% 0px -80% 0px', // Trigger when heading is near the top of the viewport
        threshold: 0
      }
    );
    
    headingElements.forEach(el => observer.observe(el));
    
    return () => {
      headingElements.forEach(el => observer.unobserve(el));
      observer.disconnect();
    };
  }, [content]); // re-run when content changes

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
            <Link to="/azabu-press" className="hover:text-white transition-colors">
              AZABU+PRESS
            </Link>
          </nav>

          <AnimatedSection animation="slide-up">
            <div className="flex items-center space-x-4 mb-6">
              <span className="inline-block px-4 py-1.5 bg-[#FF6B00] text-white text-xs font-bold uppercase tracking-widest shadow-xl">
                {category}
              </span>
              <time className="text-white/70 text-sm tracking-widest uppercase">{formatDate(date)}</time>
              {code && (
                <span className="text-white/60 text-xs font-bold tracking-[0.25em] uppercase">
                  {code}
                </span>
              )}
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

      {/* Article Content Area with aside TOC */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 -mt-16 sm:-mt-24 relative z-20 flex flex-col md:flex-row gap-12 lg:gap-20">
        
        {/* Main Content Column */}
        <div className="w-full md:w-2/3 lg:w-3/4 bg-[#FDFDFD] relative">
          
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

        <div 
          ref={contentRef}
          className="prose prose-lg md:prose-xl max-w-none article-content"
        >
          {children || (content && <div dangerouslySetInnerHTML={{ __html: content }} />)}
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
          .article-content .qa-section {
            margin: 2rem 0;
            border-left: 3px solid #FF6B00;
            padding-left: 1.5rem;
          }
          .article-content .qa-question {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            margin-bottom: 0.75rem;
          }
          .article-content .qa-badge {
            flex-shrink: 0;
            width: 2rem;
            height: 2rem;
            background: #FF6B00;
            color: white;
            font-weight: 900;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
          }
          .article-content .qa-question h2 {
            font-size: 1.25rem;
            margin: 0;
            padding-top: 0.25rem;
            color: #111111;
          }
          .article-content .qa-answer p {
            background: rgba(255,107,0,0.04);
            padding: 1rem 1.25rem;
            border-radius: 4px;
            margin-bottom: 0;
            font-size: 1rem;
            line-height: 1.9;
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
        
        {/* Sidebar Column (TOC) */}
        {headings.length > 0 && (
          <aside className="hidden md:block w-1/3 lg:w-1/4 shrink-0">
            <div className="sticky top-32">
              <AnimatedSection animation="slide-up" delay={200}>
                <div className="bg-white p-6 shadow-sm border border-[#111111]/5 rounded-xl">
                  <h4 className="text-[#FF6B00] text-sm font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
                    <i className="ri-list-check"></i>
                    Table of Contents
                  </h4>
                  <ul className="space-y-3">
                    {headings.map((heading) => (
                      <li 
                        key={heading.id} 
                        className={`transition-all duration-300 ${
                          heading.level === 3 ? 'ml-4 text-sm mt-2' : 'text-base font-medium'
                        }`}
                      >
                        <a 
                          href={`#${heading.id}`}
                          className={`block py-1 border-l-2 pl-3 transition-colors duration-300 ${
                            activeHeadingId === heading.id
                              ? 'border-[#FF6B00] text-[#FF6B00]'
                              : 'border-transparent text-[#111111]/60 hover:text-[#111111] hover:border-[#111111]/30'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            const element = document.getElementById(heading.id);
                            if (element) {
                              const y = element.getBoundingClientRect().top + window.scrollY - 100;
                              window.scrollTo({ top: y, behavior: 'smooth' });
                              // Manually set active ID for immediate feedback
                              setActiveHeadingId(heading.id);
                              // Update URL hash without jumping
                              window.history.pushState(null, '', `#${heading.id}`);
                            }
                          }}
                        >
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            </div>
          </aside>
        )}
      </div>

      {/* Prev/Next Navigation */}
      {(prevArticle || nextArticle) && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20 mt-8 relative z-20">
          <div className="flex flex-col sm:flex-row justify-between items-stretch gap-4 border-t border-[#111111]/10 pt-12">
            {/* Prev Article */}
            <div className="flex-1 w-full sm:w-1/2">
              {prevArticle ? (
                <Link 
                  to={`/_post/${prevArticle.id}`}
                  className="group flex flex-col h-full p-6 rounded-xl border border-[#111111]/5 bg-white hover:border-[#FF6B00]/30 hover:shadow-lg transition-all duration-300"
                >
                  <span className="text-[#111111]/40 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                    <i className="ri-arrow-left-line group-hover:-translate-x-1 transition-transform"></i>
                    Previous
                  </span>
                  <h4 className="font-serif text-[#111111] leading-relaxed group-hover:text-[#FF6B00] transition-colors line-clamp-2">
                    {prevArticle.title}
                  </h4>
                </Link>
              ) : (
                <div className="h-full p-6 rounded-xl border border-transparent flex items-center justify-center bg-[#FDFDFD]"></div>
              )}
            </div>

            {/* Next Article */}
            <div className="flex-1 w-full sm:w-1/2">
              {nextArticle ? (
                <Link 
                  to={`/_post/${nextArticle.id}`}
                  className="group flex flex-col items-end text-right h-full p-6 rounded-xl border border-[#111111]/5 bg-white hover:border-[#FF6B00]/30 hover:shadow-lg transition-all duration-300"
                >
                  <span className="text-[#111111]/40 text-xs font-bold uppercase tracking-widest mb-3 flex items-center justify-end gap-2">
                    Next
                    <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
                  </span>
                  <h4 className="font-serif text-[#111111] leading-relaxed group-hover:text-[#FF6B00] transition-colors line-clamp-2">
                    {nextArticle.title}
                  </h4>
                </Link>
              ) : (
                <div className="h-full p-6 rounded-xl border border-transparent flex items-center justify-center bg-[#FDFDFD]"></div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Related Articles */}
      <div className="border-t border-[#111111]/5 py-20 bg-white">
        <AnimatedSection className="w-full max-w-4xl mx-auto px-4 sm:px-6 mb-24">
          <RelatedContents 
            items={relatedArticles.map(article => ({
              ...article,
              excerpt: ''
            }))} 
            basePath={type === 'news' ? '/news' : '/column'} 
          />
        </AnimatedSection>
      </div>

      {/* もっと見る Button */}
      <div className="bg-[#FDFDFD] py-16 flex justify-center items-center border-t border-black/10">
        <AnimatedSection className="text-center">
          <Link
            to="/azabu-press"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full border-2 border-[#1A2B4C] text-[#1A2B4C] text-sm sm:text-base font-bold hover:bg-[#1A2B4C] hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap group"
          >
            <span>もっと見る</span>
            <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform border-[#1A2B4C]"></i>
          </Link>
        </AnimatedSection>
      </div>

      {/* Homeに戻る Button */}
      <div className="bg-[#FDFDFD] py-16 flex flex-col items-center justify-center border-t border-black/10">
        <AnimatedSection className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full border-2 border-[#1A2B4C] text-[#1A2B4C] text-sm sm:text-base font-bold hover:bg-[#1A2B4C] hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap group"
          >
            <i className="ri-arrow-left-line group-hover:-translate-x-1 transition-transform"></i>
            <span>Homeに戻る</span>
          </Link>
        </AnimatedSection>
      </div>
    </div>
  );
}

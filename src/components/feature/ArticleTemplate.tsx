import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { RelatedContents } from '../RelatedContents';
import { SEO } from '../SEO';

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
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation();
  const { ref: relatedRef, isVisible: relatedVisible } = useScrollAnimation();

  useEffect(() => {
    window.scrollTo(0, 0);
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
    <div className="min-h-screen bg-white">
      <SEO 
        title={`${title} - ${type === 'news' ? 'ニュース' : 'コラム'}`}
        description={subtitle || content.substring(0, 160).replace(/<[^>]*>?/gm, '')}
        ogImage={thumbnail}
        canonical={`https://azabuplus.jp/${type}/${title}`}
        articleSchema={articleSchema}
      />
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-slate-600">
            <Link to="/" className="hover:text-[#FF6B00] transition-colors whitespace-nowrap">ホーム</Link>
            <span className="shrink-0">/</span>
            <Link to={type === 'news' ? '/news' : '/column'} className="hover:text-[#FF6B00] transition-colors whitespace-nowrap">
              {type === 'news' ? 'ニュース' : 'コラム'}
            </Link>
            <span className="shrink-0">/</span>
            <span className="text-slate-400 line-clamp-1">{title}</span>
          </nav>
        </div>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        <div
          ref={headerRef}
          className={`transition-all duration-1000 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Category & Date */}
          <div className="flex items-center space-x-4 mb-6">
            <span className={`inline-block px-4 py-1.5 text-white text-sm font-bold rounded-full ${
              type === 'news' ? 'bg-[#FF6B00]' : 'bg-[#1A1A2E]'
            }`}>
              {category}
            </span>
            <time className="text-slate-500 text-sm">{formatDate(date)}</time>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-black text-[#1A1A2E] mb-6 leading-tight">
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-lg text-slate-600 leading-relaxed mb-8 font-medium">
              {subtitle}
            </p>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full border border-slate-200">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Thumbnail */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-12 shadow-2xl">
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Article Content */}
        <div
          ref={contentRef}
          className={`transition-all duration-1000 delay-200 ${
            contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div 
            className="prose prose-lg max-w-none article-content"
            style={{
              '--tw-prose-headings': '#1A1A2E',
              '--tw-prose-body': '#334155',
              '--tw-prose-bullets': '#FF6B00',
              '--tw-prose-quote-borders': '#FF6B00',
            } as any}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        <style>{`
          .article-content h2 {
            font-size: 1.5rem;
            font-weight: 800;
            border-left: 4px solid #FF6B00;
            padding-left: 1rem;
            margin-top: 3rem;
            margin-bottom: 1.5rem;
          }
          .article-content h3 {
            font-size: 1.25rem;
            font-weight: 700;
            margin-top: 2rem;
            margin-bottom: 1rem;
          }
          .article-content p {
            line-height: 2;
            margin-bottom: 1.5rem;
          }
          .article-content blockquote {
            background: linear-gradient(135deg, #FAFAFA, #FFF8F0);
            border-left: 4px solid #FF6B00;
            padding: 2rem;
            border-radius: 1rem;
            font-style: italic;
            margin: 2rem 0;
          }
          .article-content .highlight-box {
            background: linear-gradient(135deg, #1A1A2E, #0F0F1A);
            color: #FFF;
            padding: 2.5rem;
            border-radius: 1.5rem;
            margin: 3rem 0;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          }
          .article-content .highlight-box h3 {
            color: #FF6B00;
            margin-top: 0;
          }
          .article-content .highlight-box p {
            color: rgba(255,255,255,0.8);
            margin-bottom: 0;
          }
          .article-content .qa-section {
            margin-bottom: 3rem;
          }
          .article-content .qa-question {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            margin-bottom: 1.5rem;
          }
          .article-content .qa-badge {
            flex-shrink: 0;
            width: 3rem;
            height: 3rem;
            background: linear-gradient(135deg, #FF6B00, #FF8C00);
            border-radius: 0.75rem;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 0.9rem;
            box-shadow: 0 4px 12px rgba(255,107,0,0.2);
          }
          .article-content .qa-question h2 {
            border-left: none;
            padding-left: 0;
            margin: 0;
            padding-top: 0.5rem;
            font-size: 1.25rem;
          }
          .article-content .qa-answer {
            margin-left: 4rem;
            padding-left: 1.5rem;
            border-left: 2px solid rgba(255,107,0,0.2);
          }
          @media (max-width: 640px) {
            .article-content .qa-answer {
              margin-left: 0;
              padding-left: 1.25rem;
              margin-top: 1rem;
            }
          }
        `}</style>

        {/* Share Buttons */}
        <div className="mt-16 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-600 mb-4">この記事をシェア</p>
          <div className="flex space-x-3">
            <button className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-[#FF6B00] text-slate-600 hover:text-white rounded-full transition-all duration-300">
              <i className="ri-twitter-x-line text-lg"></i>
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-[#FF6B00] text-slate-600 hover:text-white rounded-full transition-all duration-300">
              <i className="ri-facebook-fill text-lg"></i>
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-[#FF6B00] text-slate-600 hover:text-white rounded-full transition-all duration-300">
              <i className="ri-line-fill text-lg"></i>
            </button>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      <RelatedContents 
        items={relatedArticles.map(article => ({
          ...article,
          excerpt: ''
        }))} 
        basePath={type === 'news' ? '/news' : '/column'} 
      />

      {/* Back to List Button */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          to={type === 'news' ? '/news' : '/column'}
          className="inline-flex items-center space-x-2 text-[#1A2B4C] hover:text-[#FF6B00] font-medium transition-colors group"
        >
          <i className="ri-arrow-left-line text-xl group-hover:-translate-x-1 transition-transform"></i>
          <span>{type === 'news' ? 'ニュース' : 'コラム'}一覧に戻る</span>
        </Link>
      </div>
    </div>
  );
}

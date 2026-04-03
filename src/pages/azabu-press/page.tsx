import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { NewsSearchFilter } from '../../components/NewsSearchFilter';
import { SEO } from '../../components/SEO';
import { useFavorites } from '../../hooks/useFavorites';
import { Heart } from 'lucide-react';
import { AnimatedSection } from '../../components/Animate';
import { AdFeed } from '../../components/AdSense';
import { allPosts } from '../_post/posts';

type ArticleItem = {
  id: string;
  thumbnail: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  tags: string[];
  source: 'column' | 'news';
   /** 手動で人気記事として扱うフラグ */
  isFeatured?: boolean;
};

function ArticleCard({ 
  article, 
  index,
  isFavorited,
  onToggleFavorite,
  isFeatured = false
}: { 
  article: ArticleItem; 
  index: number;
  isFavorited: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  isFeatured?: boolean;
}) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Link path is unified under _post
  const linkPath = `/_post/${article.id}`;

  if (isFeatured) {
    return (
      <AnimatedSection animation="slide-up" className="w-full mb-16 sm:mb-24">
        <Link
          to={linkPath}
          className="group flex flex-col md:flex-row gap-8 lg:gap-16 items-center"
        >
          <div className="w-full md:w-3/5 lg:w-2/3 relative aspect-video overflow-hidden">
            <img
              src={article.thumbnail}
              alt={article.title}
              className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2">
              <span className="px-4 py-1.5 bg-[#111111] text-white text-xs font-bold tracking-widest uppercase">
                {article.category}
              </span>
              {article.source === 'news' && (
                <span className="px-3 py-1 bg-[#FF6B00] text-white text-[10px] font-bold tracking-widest uppercase">
                  NEWS
                </span>
              )}
            </div>
            <button
              onClick={onToggleFavorite}
              className={`absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
                isFavorited 
                  ? 'bg-[#FF6B00] text-white' 
                  : 'bg-white/90 backdrop-blur-md text-[#111111] hover:bg-[#FF6B00] hover:text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          </div>
          <div className="w-full md:w-2/5 lg:w-1/3 flex flex-col justify-center py-4">
            <time className="text-sm text-[#111111]/50 mb-4 tracking-[0.2em] uppercase block">
              {formatDate(article.date)}
            </time>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#111111] mb-6 leading-[1.3] group-hover:text-[#FF6B00] transition-colors">
              {article.title}
            </h2>
            <p className="text-[#111111]/70 text-base leading-loose line-clamp-4 mb-8">
              {article.excerpt}
            </p>
            <div className="flex items-center text-[#111111] font-bold text-sm tracking-[0.2em] group-hover:translate-x-2 transition-transform duration-500 uppercase">
              <div className="w-8 h-px bg-[#111111] mr-4 group-hover:w-12 transition-all duration-500"></div>
              <span>Read Story</span>
            </div>
          </div>
        </Link>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection animation="slide-up" delay={index > 0 ? (index % 3) * 150 : 0}>
      <Link
        to={linkPath}
        className="group block"
      >
        <div className="relative w-full aspect-video overflow-hidden mb-6">
          <img
            src={article.thumbnail}
            alt={article.title}
            className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[#111111] text-[10px] font-bold tracking-widest uppercase">
              {article.category}
            </span>
            {article.source === 'news' && (
              <span className="px-2 py-0.5 bg-[#FF6B00] text-white text-[9px] font-bold tracking-widest uppercase">
                NEWS
              </span>
            )}
          </div>
          <button
            onClick={onToggleFavorite}
            className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
              isFavorited 
                ? 'bg-[#FF6B00] text-white' 
                : 'bg-white/90 backdrop-blur-md text-[#111111] hover:bg-[#FF6B00] hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>
        <div>
          <time className="text-xs sm:text-sm text-[#111111]/50 mb-3 tracking-[0.2em] uppercase block">
            {formatDate(article.date)}
          </time>
          <h2 className="text-xl sm:text-2xl font-serif text-[#111111] mb-3 leading-snug group-hover:text-[#FF6B00] transition-colors line-clamp-3">
            {article.title}
          </h2>
          <p className="text-[#111111]/60 text-sm leading-relaxed line-clamp-2">
            {article.excerpt}
          </p>
        </div>
      </Link>
    </AnimatedSection>
  );
}

const INITIAL_COUNT = 12;
const LOAD_MORE_COUNT = 12;

export default function ColumnListPage() {
  const [activeCategory, setActiveCategory] = useState('すべて');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const { isFavorite, toggleFavorite } = useFavorites('press_favorites');

  // Merge columns and news into a single list, sorted by date (latest first)
  const allArticles: ArticleItem[] = useMemo(() => {
    const mapped: ArticleItem[] = allPosts.map((p) => ({
      id: p.id,
      thumbnail: p.thumbnail,
      category: p.category,
      date: p.date,
      title: p.title,
      excerpt: p.excerpt,
      tags: p.tags ?? [],
      source: p.type,
      isFeatured: p.isFeatured ?? p.isPopular ?? false,
    }));

    return mapped.sort((a, b) => {
      const dateA = new Date(a.date.replace(/\./g, '/'));
      const dateB = new Date(b.date.replace(/\./g, '/'));
      return dateB.getTime() - dateA.getTime();
    });
  }, []);

  const filteredArticles = useMemo(() => {
    return allArticles.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      let matchesCategory = activeCategory === 'すべて' || item.category === activeCategory;
      if (activeCategory === 'お気に入り') {
        matchesCategory = isFavorite(item.id);
      }
      if (activeCategory === 'NEWS') {
        matchesCategory = item.source === 'news';
      }
      if (activeCategory === 'COLUMN') {
        matchesCategory = item.source === 'column';
      }
      
      return matchesSearch && matchesCategory;
    });
  }, [allArticles, activeCategory, searchQuery, isFavorite]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(allArticles.map((a) => a.category)));
    return ['お気に入り', 'NEWS', 'COLUMN', ...cats.sort()];
  }, [allArticles]);

  // カテゴリ/検索変更時はリセット
  const handleCategoryChange = useCallback((cat: string) => {
    setActiveCategory(cat);
    setVisibleCount(INITIAL_COUNT);
  }, []);

  const handleSearchChange = useCallback((q: string) => {
    setSearchQuery(q);
    setVisibleCount(INITIAL_COUNT);
  }, []);

  // 人気記事（isFeatured）があればそれを先頭に。それ以外は最新順の先頭。
  const featuredPost = useMemo(() => {
    if (filteredArticles.length === 0) return null;
    const pinned = filteredArticles.find((a) => a.isFeatured);
    return pinned ?? filteredArticles[0];
  }, [filteredArticles]);

  const allStandardPosts = useMemo(() => {
    if (!featuredPost) return filteredArticles;
    return filteredArticles.filter((a) => a.id !== featuredPost.id);
  }, [filteredArticles, featuredPost]);

  const standardPosts = useMemo(
    () => allStandardPosts.slice(0, visibleCount),
    [allStandardPosts, visibleCount]
  );

  const hasMore = visibleCount < allStandardPosts.length;

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <SEO 
        title="AZABU+PRESS | AZABU+ Project"
        description="20代のエンジニア転職に役立つ知識。麻布台ヒルズでのキャリア、ITインフラ業界の動向、未経験からの資格取得まで幅広く解説。ニュースとコラムを一挙にお届け。"
        keywords="エンジニア転職,AZABU+PRESS,キャリア,インフラエンジニア,麻布台ヒルズ,ニュース,コラム"
      />
      
      {/* Editorial Hero Section */}
      <section className="pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FF6B00]/10 to-transparent transform -translate-y-1/2 -z-10" />
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <AnimatedSection animation="zoom">
            <p className="text-[#FF6B00] text-xs sm:text-sm tracking-[0.3em] font-bold uppercase mb-4 sm:mb-6">
              元外コン出身SIer採用担当が業界を超分析するデジタル専門誌
            </p>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif text-[#111111] mb-4 sm:mb-6 font-light">
              AZABU+PRESS
            </h1>
            <p className="text-[#111111]/50 text-sm sm:text-base tracking-widest max-w-xl mx-auto mb-6 sm:mb-8">
              ニュース・コラムの全記事アーカイブ
            </p>
            <div className="w-px h-16 sm:h-24 bg-gradient-to-b from-[#111111]/30 to-transparent mx-auto"></div>
          </AnimatedSection>
        </div>
      </section>

      {/* Filter Options */}
      <section className="pb-12 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <NewsSearchFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            placeholder="記事を検索..."
          />
        </div>
      </section>

      {/* Article Count */}
      <section className="py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-[#111111]/40 text-xs sm:text-sm tracking-widest uppercase">
            {filteredArticles.length} Articles Found
          </p>
        </div>
      </section>

      {/* Article Content Layout */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {filteredArticles.length > 0 ? (
            <>
              {/* Featured Post (100% width) */}
              {featuredPost && (
                <ArticleCard 
                  article={featuredPost} 
                  index={0}
                  isFeatured={true}
                  isFavorited={isFavorite(featuredPost.id)}
                  onToggleFavorite={(e) => {
                    e.preventDefault();
                    toggleFavorite(featuredPost.id);
                  }}
                />
              )}

              {/* Grid Posts — 6件ごとにインフィード広告を挿入 */}
              {standardPosts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                  {standardPosts.map((article, index) => (
                    <>
                      <ArticleCard
                        key={`${article.source}-${article.id}`}
                        article={article}
                        index={index + 1}
                        isFavorited={isFavorite(article.id)}
                        onToggleFavorite={(e) => {
                          e.preventDefault();
                          toggleFavorite(article.id);
                        }}
                      />
                      {/* 6件ごとにインフィード広告（col-span-full） */}
                      {(index + 1) % 6 === 0 && (
                        <AdFeed key={`ad-${index}`} slot="5555555555" />
                      )}
                    </>
                  ))}
                </div>
              )}
              {/* Load More ボタン */}
              {hasMore && (
                <div className="flex justify-center mt-16 col-span-full">
                  <button
                    onClick={() => setVisibleCount((c) => c + LOAD_MORE_COUNT)}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-[#FF6B00] text-[#FF6B00] text-sm font-bold hover:bg-[#FF6B00] hover:text-white transition-all duration-300 group"
                  >
                    <span>さらに読み込む（残り{allStandardPosts.length - visibleCount}件）</span>
                    <i className="ri-arrow-down-line group-hover:translate-y-1 transition-transform"></i>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-32 bg-white/50 border border-[#111111]/5">
              <p className="text-2xl font-serif text-[#111111] mb-4">記事が見つかりませんでした</p>
              <p className="text-[#111111]/50 tracking-widest uppercase text-sm mb-8">条件を変えて再度検索してみてください</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('すべて');
                  setVisibleCount(INITIAL_COUNT);
                }}
                className="text-xs font-bold tracking-[0.2em] uppercase text-[#FF6B00] hover:text-[#111111] transition-colors cursor-pointer"
              >
                フィルターをリセット
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Back to Home */}
      <section className="py-16 bg-[#FDFDFD] border-t border-black/10 flex flex-col items-center justify-center">
        <AnimatedSection className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full border-2 border-[#1A2B4C] text-[#1A2B4C] text-sm sm:text-base font-bold hover:bg-[#1A2B4C] hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap group"
          >
            <i className="ri-arrow-left-line group-hover:-translate-x-1 transition-transform"></i>
            <span>Homeに戻る</span>
          </Link>
        </AnimatedSection>
      </section>
    </div>
  );
}

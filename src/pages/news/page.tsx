import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { newsData } from '../../mocks/news';
import { SEO } from '../../components/SEO';
import { useFavorites } from '../../hooks/useFavorites';
import { Heart } from 'lucide-react';
import { AnimatedSection } from '../../components/Animate';

// ─── メインFeatureCard（横長・サムネイル大）────────────────────────────────
function FeaturedCard({
  news,
  isFavorited,
  onToggleFavorite,
}: {
  news: typeof newsData[0];
  isFavorited: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
}) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <AnimatedSection animation="slide-up" className="w-full mb-16 sm:mb-28">
      <Link
        to={`/news/${news.id}`}
        className="group relative flex flex-col lg:flex-row gap-0 border border-black/8 hover:border-[#FF6B00]/40 transition-colors duration-500 overflow-hidden bg-white shadow-sm hover:shadow-xl"
      >
        {/* Image */}
        <div className="relative w-full lg:w-[58%] aspect-[16/10] lg:aspect-auto lg:min-h-[480px] overflow-hidden flex-shrink-0">
          <img
            src={news.thumbnail}
            alt={news.title}
            className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-1000 ease-out"
            style={{ filter: 'brightness(0.92)' }}
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10 lg:to-white/60 pointer-events-none" />
          {/* Category badge */}
          <div className="absolute top-5 left-5 flex items-center gap-2">
            <span className="px-4 py-1.5 bg-[#FF6B00] text-white text-[10px] font-black tracking-[0.25em] uppercase shadow-lg">
              {news.category}
            </span>
            <span className="px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold tracking-widest">
              LATEST
            </span>
          </div>
          {/* Favorite button */}
          <button
            onClick={onToggleFavorite}
            className={`absolute top-5 right-5 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
              isFavorited
                ? 'bg-[#FF6B00] text-white shadow-lg'
                : 'bg-white/80 backdrop-blur-md text-[#111111] hover:bg-[#FF6B00] hover:text-white'
            }`}
            aria-label="お気に入り"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Text */}
        <div className="flex-1 flex flex-col justify-between p-8 sm:p-10 lg:p-12 bg-white">
          <div>
            {/* Issue / Date line */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-[#FF6B00]" />
              <time className="text-[11px] text-[#111111]/40 tracking-[0.3em] uppercase font-bold">
                {formatDate(news.date)}
              </time>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#111111] leading-[1.4] mb-6 group-hover:text-[#FF6B00] transition-colors duration-300">
              {news.title}
            </h2>

            {/* Decorative line */}
            <div className="w-16 h-px bg-black/10 mb-6" />

            {/* Excerpt */}
            <p className="text-[#111111]/65 text-base leading-loose line-clamp-4 mb-8">
              {news.excerpt}
            </p>
          </div>

          {/* Read more CTA */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-px bg-[#111111] group-hover:w-16 group-hover:bg-[#FF6B00] transition-all duration-500" />
            <span className="text-xs font-black tracking-[0.25em] text-[#111111] group-hover:text-[#FF6B00] transition-colors uppercase">
              Read Full Story
            </span>
            <i className="ri-arrow-right-line text-lg text-[#FF6B00] group-hover:translate-x-2 transition-transform duration-500" />
          </div>
        </div>
      </Link>
    </AnimatedSection>
  );
}

// ─── Standard Press Card ──────────────────────────────────────────────────────
function PressCard({
  news,
  index,
  isFavorited,
  onToggleFavorite,
}: {
  news: typeof newsData[0];
  index: number;
  isFavorited: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
}) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <AnimatedSection animation="slide-up" delay={index * 120}>
      <Link
        to={`/news/${news.id}`}
        className="group flex flex-col h-full border border-black/8 hover:border-[#FF6B00]/40 bg-white overflow-hidden transition-all duration-400 hover:shadow-lg"
      >
        {/* Thumbnail */}
        <div className="relative w-full aspect-[4/3] overflow-hidden flex-shrink-0">
          <img
            src={news.thumbnail}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            style={{ filter: 'brightness(0.94)' }}
          />
          {/* Category */}
          <div className="absolute top-0 left-0 px-3 py-1.5 bg-[#FF6B00] text-white text-[10px] font-black tracking-[0.2em] uppercase">
            {news.category}
          </div>
          {/* Favorite */}
          <button
            onClick={onToggleFavorite}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
              isFavorited
                ? 'bg-[#FF6B00] text-white'
                : 'bg-white/80 backdrop-blur-md text-[#111111] hover:bg-[#FF6B00] hover:text-white'
            }`}
            aria-label="お気に入り"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-6">
          <time className="text-[10px] text-[#111111]/40 tracking-[0.25em] uppercase font-bold mb-3 block">
            {formatDate(news.date)}
          </time>
          <h3 className="text-lg font-serif text-[#111111] leading-snug mb-3 group-hover:text-[#FF6B00] transition-colors line-clamp-3 flex-1">
            {news.title}
          </h3>
          <p className="text-sm text-[#111111]/55 leading-relaxed line-clamp-2 mb-5">
            {news.excerpt}
          </p>
          {/* Read more */}
          <div className="flex items-center gap-3 mt-auto">
            <div className="w-6 h-px bg-[#111111]/30 group-hover:w-10 group-hover:bg-[#FF6B00] transition-all duration-400" />
            <span className="text-[10px] font-black tracking-[0.2em] text-[#111111]/50 group-hover:text-[#FF6B00] transition-colors uppercase">
              Read More
            </span>
          </div>
        </div>
      </Link>
    </AnimatedSection>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function NewsListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { isFavorite, toggleFavorite } = useFavorites('news_favorites');

  const filteredNews = useMemo(() => {
    if (!searchQuery.trim()) return newsData;
    return newsData.filter(
      (news) =>
        news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const featuredNews = filteredNews.length > 0 ? filteredNews[0] : null;
  const standardNews = filteredNews.length > 1 ? filteredNews.slice(1) : [];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <SEO
        title="AZABU+PRESS | AZABU+ Project"
        description="元外資系コンサルタント出身・現役SIer採用担当によるIT業界の深層分析デジタル専門誌。未経験エンジニア転職の真実を届ける。"
        keywords="AZABU+PRESS,IT業界分析,エンジニア転職,SIer,インフラエンジニア"
      />

      {/* ─── PRESS MASTHEAD ──────────────────────────────────────────── */}
      <section className="relative pt-28 sm:pt-36 pb-10 sm:pb-16 px-4 sm:px-6 overflow-hidden bg-white border-b border-black/8">
        {/* Background grid lines (newspaper feel) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-[20%] w-px h-full bg-black/[0.04]" />
          <div className="absolute top-0 left-[40%] w-px h-full bg-black/[0.04]" />
          <div className="absolute top-0 left-[60%] w-px h-full bg-black/[0.04]" />
          <div className="absolute top-0 left-[80%] w-px h-full bg-black/[0.04]" />
        </div>

        <div className="max-w-7xl mx-auto">
          <AnimatedSection animation="zoom">
            {/* Eyebrow */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="flex-1 h-px bg-black/10 max-w-[120px]" />
              <p className="text-[#FF6B00] text-[10px] sm:text-xs tracking-[0.45em] font-black uppercase">
                Digital Press
              </p>
              <div className="flex-1 h-px bg-black/10 max-w-[120px]" />
            </div>

            {/* Masthead title */}
            <div className="text-center mb-4">
              <h1
                className="inline-block text-5xl sm:text-6xl md:text-8xl font-serif text-[#111111] lowercase tracking-tighter leading-none"
                style={{ letterSpacing: '-0.02em' }}
              >
                AZABU
                <span className="text-[#FF6B00]">+</span>
                PRESS
              </h1>
            </div>

            {/* Tagline line */}
            <p className="text-center text-xs sm:text-sm text-[#111111]/40 tracking-[0.25em] uppercase font-medium mb-8">
              元外コン出身 × 現役SIer採用担当 ―― IT業界を超分析する
            </p>

            {/* Date / Issue meta */}
            <div className="flex items-center justify-center gap-6 text-[10px] text-[#111111]/35 tracking-widest uppercase font-bold border-t border-b border-black/8 py-3">
              <span>Vol. {newsData.length}</span>
              <span className="w-1 h-1 rounded-full bg-black/20" />
              <span>{new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })}</span>
              <span className="w-1 h-1 rounded-full bg-black/20" />
              <span>Free Digital Edition</span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── SEARCH BAR ──────────────────────────────────────────────── */}
      <section className="bg-white border-b border-black/6 py-4 px-4 sm:px-6 sticky top-0 z-30 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-[#111111]/30 text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="記事を検索..."
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-[#F5F5F5] border border-black/6 text-[#111111] placeholder-[#111111]/30 focus:outline-none focus:border-[#FF6B00]/50 focus:bg-white transition-colors"
            />
          </div>
          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#111111]/40 hover:text-[#FF6B00] transition-colors uppercase"
          >
            <i className="ri-home-line" />
            <span>ホームへ</span>
          </Link>
        </div>
      </section>

      {/* ─── CONTENT ─────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {filteredNews.length > 0 ? (
            <>
              {/* Section label */}
              <div className="flex items-center gap-4 mb-10 sm:mb-14">
                <span className="text-[10px] font-black tracking-[0.3em] text-[#FF6B00] uppercase">
                  Feature Story
                </span>
                <div className="flex-1 h-px bg-black/8" />
              </div>

              {/* Featured */}
              {featuredNews && (
                <FeaturedCard
                  news={featuredNews}
                  isFavorited={isFavorite(featuredNews.id)}
                  onToggleFavorite={(e) => {
                    e.preventDefault();
                    toggleFavorite(featuredNews.id);
                  }}
                />
              )}

              {/* Section label for grid */}
              {standardNews.length > 0 && (
                <>
                  <div className="flex items-center gap-4 mb-10 sm:mb-14">
                    <span className="text-[10px] font-black tracking-[0.3em] text-[#111111]/40 uppercase">
                      Latest Releases
                    </span>
                    <div className="flex-1 h-px bg-black/8" />
                    <span className="text-[10px] text-[#111111]/30 font-bold">
                      {standardNews.length} 件
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {standardNews.map((news, index) => (
                      <PressCard
                        key={news.id}
                        news={news}
                        index={index}
                        isFavorited={isFavorite(news.id)}
                        onToggleFavorite={(e) => {
                          e.preventDefault();
                          toggleFavorite(news.id);
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            // Empty state
            <div className="text-center py-32 border border-[#111111]/6 bg-white">
              <i className="ri-newspaper-line text-5xl text-[#111111]/15 mb-6 block" />
              <p className="text-2xl font-serif text-[#111111] mb-3">No stories found.</p>
              <p className="text-sm text-[#111111]/40 tracking-widest uppercase mb-8">
                条件を変えて再度検索してみてください
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-black tracking-[0.2em] uppercase text-[#FF6B00] hover:text-[#111111] transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─── PRESS CTA BANNER ────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-[#111111] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-px h-full bg-white/5" />
          <div className="absolute top-0 left-2/4 w-px h-full bg-white/5" />
          <div className="absolute top-0 left-3/4 w-px h-full bg-white/5" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-white/40 text-xs tracking-[0.3em] uppercase font-bold mb-2">
              AZABU+PRESS × AZABU+ Project
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif text-white leading-snug">
              キャリアに迷ったら、<br className="sm:hidden" />
              <span className="text-[#FF6B00]">まず読む。</span>
            </h2>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link
              to="/"
              className="group inline-flex items-center gap-3 text-white font-bold tracking-[0.15em] uppercase hover:text-[#FF6B00] transition-colors"
            >
              <i className="ri-arrow-left-line text-xl group-hover:-translate-x-2 transition-transform duration-500" />
              <span className="text-sm">Back to Home</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

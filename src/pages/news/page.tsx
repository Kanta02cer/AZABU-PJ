import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { newsData } from '../../mocks/news';
import { NewsSearchFilter } from '../../components/NewsSearchFilter';
import { SEO } from '../../components/SEO';
import { useFavorites } from '../../hooks/useFavorites';
import { Heart } from 'lucide-react';

// カードコンポーネントを分離
function NewsCard({ 
  news, 
  index, 
  isFavorited, 
  onToggleFavorite 
}: { 
  news: typeof newsData[0]; 
  index: number;
  isFavorited: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
}) {
  const { ref, isVisible } = useScrollAnimation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Link
        to={`/news/${news.id}`}
        className="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100"
      >
        <div className="relative w-full aspect-video overflow-hidden">
          <img
            src={news.thumbnail}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-2">
            <span className="px-2.5 py-1 sm:px-4 sm:py-1.5 bg-[#FF6B00] text-white text-[10px] sm:text-xs font-black rounded-full shadow-lg uppercase tracking-wider">
              {news.category}
            </span>
          </div>
          <button
            onClick={onToggleFavorite}
            className={`absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              isFavorited 
                ? 'bg-[#FF6B00] text-white shadow-lg' 
                : 'bg-white/80 backdrop-blur-md text-slate-400 hover:text-[#FF6B00] hover:bg-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>
        <div className="p-4 sm:p-5 md:p-6">
          <time className="text-xs sm:text-sm text-slate-500 mb-2 sm:mb-3 block">
            {formatDate(news.date)}
          </time>
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#111111] mb-2 sm:mb-3 group-hover:text-[#FF6B00] transition-colors line-clamp-2">
            {news.title}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
            {news.excerpt}
          </p>
          <div className="mt-3 sm:mt-4 flex items-center text-[#FF6B00] font-medium text-xs sm:text-sm group-hover:translate-x-2 transition-transform">
            <span>続きを読む</span>
            <i className="ri-arrow-right-line ml-2"></i>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function NewsListPage() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const [activeCategory, setActiveCategory] = useState('すべて');
  const [searchQuery, setSearchQuery] = useState('');
  const { isFavorite, toggleFavorite } = useFavorites('news_favorites');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(newsData.map((news) => news.category)));
    return ['お気に入り', ...cats.sort()];
  }, []);

  const filteredNews = useMemo(() => {
    return newsData.filter((news) => {
      const matchesSearch =
        news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesCategory = activeCategory === 'すべて' || news.category === activeCategory;
      if (activeCategory === 'お気に入り') {
        matchesCategory = isFavorite(news.id);
      }
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, isFavorite]);

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="最新ニュース | AZABU+ Project"
        description="AZABU+ Projectの最新情報、イベント、各種お知らせ。東京・麻布台ヒルズでの20代エンジニア転職に関する情報を発信中。"
        keywords="AZABU+ Project,ニュース,麻布台ヒルズ,エンジニア転職"
      />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#111111] to-[#222222] py-14 sm:py-16 md:py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div
            ref={headerRef}
            className={`text-center transition-all duration-1000 ${
              headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
              最新ニュース
            </h1>
            <p className="text-base sm:text-lg text-slate-300">
              AZABU+ Projectの最新情報をお届けします
            </p>
          </div>
        </div>
      </section>

      {/* News List */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <NewsSearchFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {filteredNews.map((news, index) => (
                <NewsCard 
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
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <i className="ri-search-eye-line text-5xl text-slate-300 mb-4 block"></i>
              <p className="text-xl font-bold text-[#111111] mb-2">一致するニュースが見つかりません</p>
              <p className="text-slate-500">条件を変えて再度検索してみてください</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('すべて');
                }}
                className="mt-6 text-[#FF6B00] font-bold hover:underline"
              >
                検索条件をクリア
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Back to Home */}
      <section className="py-8 sm:py-10 md:py-12 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-[#111111] hover:text-[#FF6B00] font-medium transition-colors group text-sm sm:text-base"
          >
            <i className="ri-arrow-left-line text-lg sm:text-xl group-hover:-translate-x-1 transition-transform"></i>
            <span>ホームに戻る</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { columnsData } from '../../mocks/columns';
import { NewsSearchFilter } from '../../components/NewsSearchFilter';
import { SEO } from '../../components/SEO';
import { useFavorites } from '../../hooks/useFavorites';
import { Heart } from 'lucide-react';
import { AnimatedSection } from '../../components/Animate';

// Magazine Style Column Card
function ColumnCard({ 
  column, 
  index,
  isFavorited,
  onToggleFavorite,
  isFeatured = false
}: { 
  column: typeof columnsData[0]; 
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

  if (isFeatured) {
    return (
      <AnimatedSection animation="slide-up" className="w-full mb-16 sm:mb-24">
        <Link
          to={`/column/${column.id}`}
          className="group flex flex-col md:flex-row gap-8 lg:gap-16 items-center"
        >
          <div className="w-full md:w-3/5 lg:w-2/3 relative aspect-[4/3] md:aspect-auto md:h-[500px] overflow-hidden">
            <img
              src={column.thumbnail}
              alt={column.title}
              className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2">
              <span className="px-4 py-1.5 bg-[#111111] text-white text-xs font-bold tracking-widest uppercase">
                {column.category}
              </span>
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
              {formatDate(column.date)}
            </time>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#111111] mb-6 leading-[1.3] group-hover:text-[#FF6B00] transition-colors">
              {column.title}
            </h2>
            <p className="text-[#111111]/70 text-base leading-loose line-clamp-4 mb-8">
              {column.excerpt}
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
        to={`/column/${column.id}`}
        className="group block"
      >
        <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] overflow-hidden mb-6">
          <img
            src={column.thumbnail}
            alt={column.title}
            className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[#111111] text-[10px] font-bold tracking-widest uppercase">
              {column.category}
            </span>
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
            {formatDate(column.date)}
          </time>
          <h2 className="text-xl sm:text-2xl font-serif text-[#111111] mb-3 leading-snug group-hover:text-[#FF6B00] transition-colors line-clamp-3">
            {column.title}
          </h2>
          <p className="text-[#111111]/60 text-sm leading-relaxed line-clamp-2">
            {column.excerpt}
          </p>
        </div>
      </Link>
    </AnimatedSection>
  );
}

export default function ColumnListPage() {
  const [activeCategory, setActiveCategory] = useState('すべて');
  const [searchQuery, setSearchQuery] = useState('');
  const { isFavorite, toggleFavorite } = useFavorites('column_favorites');

  const filteredColumns = useMemo(() => {
    return columnsData.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      let matchesCategory = activeCategory === 'すべて' || item.category === activeCategory;
      if (activeCategory === 'お気に入り') {
        matchesCategory = isFavorite(item.id);
      }
      
      return matchesSearch && matchesCategory;
    });
  }, [activeCategory, searchQuery, isFavorite]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(columnsData.map((column) => column.category)));
    return ['お気に入り', ...cats.sort()];
  }, []);

  const featuredPost = filteredColumns.length > 0 ? filteredColumns[0] : null;
  const standardPosts = filteredColumns.length > 1 ? filteredColumns.slice(1) : [];

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <SEO 
        title="Regalis Journal | AZABU+ Project"
        description="20代のエンジニア転職に役立つ知識。麻布台ヒルズでのキャリア、ITインフラ業界の動向、未経験からの資格取得まで幅広く解説。"
        keywords="エンジニア転職,コラム,キャリア,インフラエンジニア,麻布台ヒルズ"
      />
      
      {/* Editorial Hero Section */}
      <section className="pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FF6B00]/10 to-transparent transform -translate-y-1/2 -z-10" />
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <AnimatedSection animation="zoom">
            <p className="text-[#FF6B00] text-xs sm:text-sm tracking-[0.3em] font-bold uppercase mb-4 sm:mb-6">
              キャリアとITの交差点
            </p>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif text-[#111111] mb-6 sm:mb-8 font-light lowercase">
              Journal
            </h1>
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
            onCategoryChange={setActiveCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="Search Journal..."
          />
        </div>
      </section>

      {/* Journal Content Layout */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {filteredColumns.length > 0 ? (
            <>
              {/* Featured Post (100% width) */}
              {featuredPost && (
                <ColumnCard 
                  column={featuredPost} 
                  index={0}
                  isFeatured={true}
                  isFavorited={isFavorite(featuredPost.id)}
                  onToggleFavorite={(e) => {
                    e.preventDefault();
                    toggleFavorite(featuredPost.id);
                  }}
                />
              )}

              {/* Grid Posts */}
              {standardPosts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                  {standardPosts.map((column, index) => (
                    <ColumnCard 
                      key={column.id} 
                      column={column} 
                      index={index + 1} 
                      isFavorited={isFavorite(column.id)}
                      onToggleFavorite={(e) => {
                        e.preventDefault();
                        toggleFavorite(column.id);
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-32 bg-white/50 border border-[#111111]/5">
              <p className="text-2xl font-serif text-[#111111] mb-4">No stories found.</p>
              <p className="text-[#111111]/50 tracking-widest uppercase text-sm mb-8">条件を変えて再度検索してみてください</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('すべて');
                }}
                className="text-xs font-bold tracking-[0.2em] uppercase text-[#FF6B00] hover:text-[#111111] transition-colors"
                style={{ cursor: "none" }}
              >
                Clear Search Restrictions
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Back to Home */}
      <section className="py-16 bg-[#111111] flex flex-col items-center justify-center">
        <Link
          to="/"
          className="group relative inline-flex items-center gap-4 text-white font-bold tracking-[0.15em] uppercase hover:text-[#FF6B00] transition-colors"
        >
          <i className="ri-arrow-left-line text-2xl group-hover:-translate-x-2 transition-transform duration-500"></i>
          <span className="text-sm">Back to Home</span>
        </Link>
      </section>
    </div>
  );
}

import { useMemo, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { allPosts } from '../_post/posts';
import { SEO } from '../../components/SEO';
import { AnimatedSection } from '../../components/Animate';
import { AdFeed } from '../../components/AdSense';

const ITEMS_PER_PAGE = 12;

export default function TagPage() {
  const { tag } = useParams<{ tag: string }>();
  const decodedTag = tag ? decodeURIComponent(tag) : '';
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const taggedPosts = useMemo(() => {
    if (!decodedTag) return [];
    return allPosts.filter((p) => p.tags?.includes(decodedTag));
  }, [decodedTag]);

  if (!decodedTag || taggedPosts.length === 0) {
    return <Navigate to="/azabu-press" replace />;
  }

  const visible = taggedPosts.slice(0, visibleCount);
  const hasMore = visibleCount < taggedPosts.length;

  const formatDate = (dateString: string) => {
    const d = new Date(dateString.replace(/\./g, '/'));
    return isNaN(d.getTime())
      ? dateString
      : d.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <SEO
        title={`「${decodedTag}」の記事一覧 | AZABU+PRESS`}
        description={`「${decodedTag}」タグが付いた記事一覧。インフラエンジニア転職・キャリアに役立つコンテンツをまとめています。`}
        canonical={`https://azabuplus.jp/tag/${encodeURIComponent(decodedTag)}`}
        keywords={`${decodedTag},エンジニア転職,インフラエンジニア,AZABU+`}
      />

      {/* Hero */}
      <section className="pt-32 sm:pt-40 pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <AnimatedSection animation="zoom">
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center gap-2 text-xs text-[#111111]/40 font-bold tracking-widest uppercase mb-8">
              <Link to="/" className="hover:text-[#FF6B00] transition-colors">Home</Link>
              <span>/</span>
              <Link to="/azabu-press" className="hover:text-[#FF6B00] transition-colors">AZABU+PRESS</Link>
              <span>/</span>
              <span className="text-[#FF6B00]">#{decodedTag}</span>
            </nav>

            <p className="text-[#FF6B00] text-xs sm:text-sm tracking-[0.3em] font-bold uppercase mb-4">
              TAG
            </p>
            <h1 className="text-5xl sm:text-7xl font-serif text-[#111111] mb-4 font-light">
              #{decodedTag}
            </h1>
            <p className="text-[#111111]/40 text-sm tracking-widest mt-4">
              {taggedPosts.length} Articles
            </p>
            <div className="w-px h-16 bg-gradient-to-b from-[#111111]/30 to-transparent mx-auto mt-8"></div>
          </AnimatedSection>
        </div>
      </section>

      {/* Article Grid */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {visible.map((post, index) => (
              <>
                <AnimatedSection
                  key={post.id}
                  animation="slide-up"
                  delay={(index % 3) * 100}
                >
                  <Link to={`/_post/${post.id}`} className="group block">
                    <div className="relative w-full aspect-video overflow-hidden mb-5 rounded-sm">
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        loading="lazy"
                        className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[#111111] text-[10px] font-bold tracking-widest uppercase">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <time className="text-xs text-[#111111]/50 mb-2 tracking-widest uppercase block">
                      {formatDate(post.date)}
                    </time>
                    <h2 className="text-lg sm:text-xl font-serif text-[#111111] mb-2 leading-snug group-hover:text-[#FF6B00] transition-colors line-clamp-3">
                      {post.title}
                    </h2>
                    <p className="text-[#111111]/60 text-sm leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                    {/* 関連タグ */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.map((t) => (
                          <span
                            key={t}
                            className={`text-[10px] font-bold px-2 py-0.5 tracking-widest uppercase ${
                              t === decodedTag
                                ? 'bg-[#FF6B00] text-white'
                                : 'bg-[#111111]/5 text-[#111111]/60'
                            }`}
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </AnimatedSection>
                {/* 6件ごとにインフィード広告 */}
                {(index + 1) % 6 === 0 && index + 1 < visible.length && (
                  <AdFeed key={`ad-${index}`} slot="5555555555" />
                )}
              </>
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center mt-16">
              <button
                onClick={() => setVisibleCount((c) => c + ITEMS_PER_PAGE)}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-[#FF6B00] text-[#FF6B00] text-sm font-bold hover:bg-[#FF6B00] hover:text-white transition-all duration-300 group"
              >
                <span>さらに読み込む</span>
                <i className="ri-arrow-down-line group-hover:translate-y-1 transition-transform"></i>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 他のタグへのナビゲーション */}
      <section className="border-t border-black/10 py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <AnimatedSection>
            <h3 className="text-xl font-serif text-[#111111] mb-8">関連するカテゴリー</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {Array.from(new Set(taggedPosts.flatMap((p) => p.tags ?? [])))
                .filter((t) => t !== decodedTag)
                .slice(0, 12)
                .map((t) => (
                  <Link
                    key={t}
                    to={`/tag/${encodeURIComponent(t)}`}
                    className="px-4 py-2 border border-[#111111]/10 text-xs font-bold tracking-widest uppercase text-[#111111]/60 hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors"
                  >
                    #{t}
                  </Link>
                ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Back */}
      <section className="py-16 bg-[#FDFDFD] border-t border-black/10 flex justify-center">
        <Link
          to="/azabu-press"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-[#1A2B4C] text-[#1A2B4C] text-sm font-bold hover:bg-[#1A2B4C] hover:text-white transition-all duration-300 group"
        >
          <i className="ri-arrow-left-line group-hover:-translate-x-1 transition-transform"></i>
          <span>全記事一覧へ</span>
        </Link>
      </section>
    </div>
  );
}

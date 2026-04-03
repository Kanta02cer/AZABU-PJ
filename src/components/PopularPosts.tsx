import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { allPosts } from '../pages/_post/posts';
import { getTopViewedIds } from '../hooks/usePageViews';

/**
 * 人気記事ウィジェット（サイドバー用）
 *
 * 表示優先順:
 *   1. LocalStorageのビュー数が多い記事
 *   2. isPopular / isFeatured フラグが立っている記事
 *   3. 最新記事（上記がない場合のフォールバック）
 */
export function PopularPosts({ currentId, count = 5 }: { currentId: string; count?: number }) {
  const posts = useMemo(() => {
    const topViewedIds = getTopViewedIds(count * 2);

    // ビューデータがある場合はそれを優先
    const byViews = topViewedIds
      .map((id) => allPosts.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => !!p && p.id !== currentId)
      .slice(0, count);

    if (byViews.length >= count) return byViews;

    // 不足分をisPopular/isFeatureのフラグ記事で補完
    const flagged = allPosts
      .filter((p) => p.id !== currentId && (p.isPopular || p.isFeatured))
      .filter((p) => !byViews.find((b) => b.id === p.id))
      .slice(0, count - byViews.length);

    const merged = [...byViews, ...flagged];
    if (merged.length >= count) return merged;

    // それでも足りなければ最新記事で補完
    const latest = allPosts
      .filter((p) => p.id !== currentId && !merged.find((m) => m.id === p.id))
      .slice(0, count - merged.length);

    return [...merged, ...latest];
  }, [currentId, count]);

  if (posts.length === 0) return null;

  return (
    <div className="bg-white p-6 shadow-sm border border-[#111111]/5 rounded-xl">
      <h4 className="text-[#FF6B00] text-sm font-bold tracking-widest uppercase mb-5 flex items-center gap-2">
        <i className="ri-fire-line"></i>
        人気記事
      </h4>
      <ul className="space-y-4">
        {posts.map((post, i) => (
          <li key={post.id}>
            <Link
              to={`/_post/${post.id}`}
              className="group flex items-start gap-3"
            >
              {/* Rank number */}
              <span className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-[#FF6B00]/10 text-[#FF6B00] text-xs font-bold mt-0.5">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm text-[#111111] font-medium line-clamp-2 group-hover:text-[#FF6B00] transition-colors leading-snug">
                  {post.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-widest">
                    {post.category}
                  </span>
                  <span className="text-[10px] text-[#111111]/40">{post.date}</span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-5 pt-4 border-t border-black/5">
        <Link
          to="/azabu-press"
          className="text-xs font-bold text-[#111111]/50 hover:text-[#FF6B00] tracking-widest uppercase flex items-center gap-1 transition-colors"
        >
          全記事を見る
          <i className="ri-arrow-right-line"></i>
        </Link>
      </div>
    </div>
  );
}

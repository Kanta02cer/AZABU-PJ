import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

type ArticleItem = {
  id: string;
  thumbnail: string;
  category: string;
  title: string;
};

type Props = {
  articles: ArticleItem[];
};

const SWIPE_THRESHOLD = 56;
const GAP = 20;
const CARD_MAX = 300;
const CARD_MIN = 260;

export function PriorityTop20Carousel({ articles }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const touchStartX = useRef<number | null>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [cardWidth, setCardWidth] = useState(CARD_MAX);

  const n = articles.length;
  const last = Math.max(0, n - 1);

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      setViewportWidth(w);
      setCardWidth(Math.min(Math.max(CARD_MIN, w - 48), CARD_MAX));
    });
    ro.observe(el);
    const w = el.clientWidth;
    setViewportWidth(w);
    setCardWidth(Math.min(Math.max(CARD_MIN, w - 48), CARD_MAX));
    return () => ro.disconnect();
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((i) => Math.min(last, i + 1));
  }, [last]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      }
    };
    const el = regionRef.current;
    if (!el) return;
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, [goPrev, goNext]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (dx < -SWIPE_THRESHOLD) goNext();
    else if (dx > SWIPE_THRESHOLD) goPrev();
  };

  const spring = reduceMotion
    ? { duration: 0.2 }
    : { type: 'spring' as const, stiffness: 320, damping: 34, mass: 0.85 };

  /** アクティブカードがビューポート中央に来るようトラックを移動 */
  const trackX =
    viewportWidth > 0
      ? viewportWidth / 2 - activeIndex * (cardWidth + GAP) - cardWidth / 2
      : 0;

  if (n === 0) return null;

  return (
    <div className="relative w-full select-none">
      <div
        ref={regionRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="まず読むべき優先記事"
        tabIndex={0}
        className="relative mx-auto max-w-6xl rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]/40 focus-visible:ring-offset-2"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          ref={viewportRef}
          className="relative min-h-[min(72vh,520px)] overflow-x-clip overflow-y-visible py-6 sm:min-h-[480px] sm:py-10 [perspective:1400px]"
          style={{ perspectiveOrigin: '50% 42%' }}
        >
          <motion.div
            className="flex flex-row items-center [transform-style:preserve-3d]"
            style={{ width: 'max-content', willChange: 'transform' }}
            animate={{ x: trackX }}
            transition={spring}
          >
            {articles.map((item, i) => {
              const d = i - activeIndex;
              const abs = Math.abs(d);
              const rotateY = d * -12;
              const scale = d === 0 ? 1 : abs === 1 ? 0.92 : abs === 2 ? 0.85 : 0.78;
              const z = -abs * 38;
              const opacity = abs > 4 ? 0.2 : 1 - abs * 0.1;

              return (
                <motion.div
                  key={item.id}
                  className="flex-shrink-0"
                  style={{
                    width: cardWidth,
                    marginRight: i < n - 1 ? GAP : 0,
                    transformStyle: 'preserve-3d',
                    zIndex: 50 - abs,
                  }}
                  animate={{ rotateY, scale, z, opacity }}
                  transition={spring}
                >
                  <Link
                    to={`/_post/${item.id}`}
                    className="group block h-full rounded-2xl border border-black/10 bg-white shadow-[0_18px_44px_-10px_rgba(0,0,0,0.28)] transition-shadow hover:shadow-[0_26px_56px_-6px_rgba(255,107,0,0.28)] hover:border-[#FF6B00]/35"
                    style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl">
                      <img
                        src={item.thumbnail}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="rounded-full bg-[#FF6B00] px-2.5 py-1 text-[11px] font-black text-white shadow-sm">
                          #{i + 1}
                        </span>
                        <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#111111]/80">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-b-2xl bg-white p-4 sm:p-5">
                      <h3 className="line-clamp-3 text-left text-sm font-bold leading-snug text-[#111111] group-hover:text-[#FF6B00] sm:text-base">
                        {item.title}
                      </h3>
                      <p className="mt-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#FF6B00]">
                        <span>記事を読む</span>
                        <i className="ri-arrow-right-line" />
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <div className="mt-1 flex flex-col items-center gap-4 sm:mt-2">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={goPrev}
              disabled={activeIndex <= 0}
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#1A2B4C]/25 text-[#1A2B4C] transition-all hover:border-[#FF6B00] hover:bg-[#FF6B00] hover:text-white disabled:pointer-events-none disabled:opacity-30"
              aria-label="前の記事へ"
            >
              <i className="ri-arrow-left-s-line text-xl" />
            </button>
            <div className="min-w-[5.5rem] text-center font-mono text-sm font-bold tabular-nums text-[#111111]">
              {String(activeIndex + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
            </div>
            <button
              type="button"
              onClick={goNext}
              disabled={activeIndex >= last}
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#1A2B4C]/25 text-[#1A2B4C] transition-all hover:border-[#FF6B00] hover:bg-[#FF6B00] hover:text-white disabled:pointer-events-none disabled:opacity-30"
              aria-label="次の記事へ"
            >
              <i className="ri-arrow-right-s-line text-xl" />
            </button>
          </div>

          <p className="text-center text-[11px] tracking-widest text-[#111111]/45">
            左右ボタン・スワイプ・キーボード（← →）で切り替え（自動スクロールなし）
          </p>

          <div
            className="flex max-w-full flex-wrap justify-center gap-1.5 px-2"
            role="tablist"
            aria-label="記事番号へジャンプ"
          >
            {articles.map((a, i) => (
              <button
                key={a.id}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                onClick={() => setActiveIndex(i)}
                className={`h-2 min-w-[6px] rounded-full transition-all ${
                  i === activeIndex
                    ? 'w-8 bg-[#FF6B00]'
                    : 'w-2 bg-[#111111]/15 hover:bg-[#111111]/35'
                }`}
                aria-label={`番号 ${i + 1} へ`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import {
  ADSENSE_LAZY_ROOT_MARGIN,
  ADSENSE_SLOTS,
} from '../config/adsense';

/**
 * AdSense ユニットコンポーネント
 *
 * スロットIDは `src/config/adsense.ts` および環境変数 `VITE_ADSENSE_SLOT_*` で管理。
 * 配置方針は ADSENSE_PLACEMENT_DESIGN.md を参照。
 *
 * 広告フォーマット種別:
 *   - "auto"        : レスポンシブ（推奨・デフォルト）
 *   - "fluid"       : インフィード（記事一覧に埋め込む）
 *   - "rectangle"   : 中長方形 (300x250)
 *   - "vertical"    : 縦長（サイドバー向け）
 *   - "horizontal"  : 横長バナー（記事上下）
 */

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

export type AdFormat = 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';

interface AdSenseProps {
  slot: string;
  format?: AdFormat;
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
  layout?: string;
  layoutKey?: string;
}

type LazyAdSenseProps = AdSenseProps & {
  /** プレースホルダー高さ（CLS 軽減） */
  minHeight?: number;
};

export function AdLabeledSlot({
  children,
  dense,
  className = '',
}: {
  children: React.ReactNode;
  dense?: boolean;
  className?: string;
}) {
  return (
    <aside
      className={`rounded-xl border border-black/[0.08] bg-[#FAFAFA]/90 ${dense ? 'px-2 py-2' : 'px-3 py-3'} ${className}`}
      role="complementary"
      aria-label="広告"
    >
      <p
        className={`text-center font-bold uppercase tracking-widest text-[#111111]/40 ${
          dense ? 'mb-1 text-[9px]' : 'mb-2 text-[10px]'
        }`}
      >
        スポンサー
      </p>
      {children}
    </aside>
  );
}

/**
 * 画面付近までスクロールしてからマウント（初期描画・LCP・CRO を優先）
 */
export function LazyAdSense({
  minHeight = 120,
  className = '',
  ...adProps
}: LazyAdSenseProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const root = ref.current;
    if (!root || visible) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: ADSENSE_LAZY_ROOT_MARGIN, threshold: 0 }
    );
    io.observe(root);
    return () => io.disconnect();
  }, [visible]);

  return (
    <div
      ref={ref}
      className={`adsense-lazy-root ${className}`}
      style={{ minHeight: visible ? undefined : minHeight }}
    >
      {visible ? <AdSense {...adProps} /> : null}
    </div>
  );
}

export function AdSense({
  slot,
  format = 'auto',
  responsive = true,
  style,
  className = '',
  layout,
  layoutKey,
}: AdSenseProps) {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    const el = insRef.current;
    if (!el) return;
    if (el.getAttribute('data-adsbygoogle-status')) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense のロード前など
    }
  }, []);

  return (
    <div className={`adsense-wrapper overflow-hidden ${className}`}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-1344710796174131"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
        {...(layout ? { 'data-ad-layout': layout } : {})}
        {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
      />
    </div>
  );
}

/** 記事: 本文前バナー（既定は設計上オフ。有効時のみ ArticleTemplate で表示） */
export function AdBannerTop({
  slot = ADSENSE_SLOTS.articleTop,
  lazy = true,
}: {
  slot?: string;
  lazy?: boolean;
}) {
  const ad = lazy ? (
    <LazyAdSense
      slot={slot}
      format="horizontal"
      responsive
      minHeight={100}
      style={{ minHeight: 90 }}
      className="w-full max-w-3xl"
    />
  ) : (
    <AdSense
      slot={slot}
      format="horizontal"
      responsive
      style={{ minHeight: 90 }}
      className="w-full max-w-3xl"
    />
  );
  return (
    <div className="my-8 flex justify-center">
      <AdLabeledSlot className="w-full max-w-3xl">{ad}</AdLabeledSlot>
    </div>
  );
}

/** 記事: 本文直後 */
export function AdBannerBottom({
  slot = ADSENSE_SLOTS.articleBottom,
  lazy = true,
}: {
  slot?: string;
  lazy?: boolean;
}) {
  const ad = lazy ? (
    <LazyAdSense
      slot={slot}
      format="auto"
      responsive
      minHeight={200}
      style={{ minHeight: 200 }}
      className="w-full max-w-3xl"
    />
  ) : (
    <AdSense
      slot={slot}
      format="auto"
      responsive
      style={{ minHeight: 200 }}
      className="w-full max-w-3xl"
    />
  );
  return (
    <div className="my-10 flex justify-center">
      <AdLabeledSlot className="w-full max-w-3xl">{ad}</AdLabeledSlot>
    </div>
  );
}

/** 記事末尾・関連下など */
export function AdInContent({
  slot = ADSENSE_SLOTS.articleInContent,
  lazy = true,
}: {
  slot?: string;
  lazy?: boolean;
}) {
  const ad = lazy ? (
    <LazyAdSense
      slot={slot}
      format="auto"
      responsive
      minHeight={220}
      style={{ minHeight: 250 }}
      className="w-full max-w-3xl"
    />
  ) : (
    <AdSense
      slot={slot}
      format="auto"
      responsive
      style={{ minHeight: 250 }}
      className="w-full max-w-3xl"
    />
  );
  return (
    <div className="my-12 flex justify-center">
      <AdLabeledSlot className="w-full max-w-3xl">{ad}</AdLabeledSlot>
    </div>
  );
}

/** サイドバー（TOC 下） */
export function AdSidebar({
  slot = ADSENSE_SLOTS.sidebar,
  lazy = true,
}: {
  slot?: string;
  lazy?: boolean;
}) {
  const ad = lazy ? (
    <LazyAdSense
      slot={slot}
      format="rectangle"
      responsive={false}
      minHeight={260}
      style={{ width: 300, height: 250 }}
      className="mx-auto"
    />
  ) : (
    <AdSense
      slot={slot}
      format="rectangle"
      responsive={false}
      style={{ width: 300, height: 250 }}
      className="mx-auto"
    />
  );
  return (
    <div className="mt-6">
      <AdLabeledSlot>{ad}</AdLabeledSlot>
    </div>
  );
}

/** 一覧グリッド用インフィード */
export function AdFeed({
  slot = ADSENSE_SLOTS.listingFeed,
  lazy = true,
}: {
  slot?: string;
  lazy?: boolean;
}) {
  const ad = lazy ? (
    <LazyAdSense
      slot={slot}
      format="fluid"
      layout="in-article"
      layoutKey="-6t+ed+2i-1n-4w"
      responsive
      minHeight={180}
      style={{ minHeight: 200 }}
      className="w-full"
    />
  ) : (
    <AdSense
      slot={slot}
      format="fluid"
      layout="in-article"
      layoutKey="-6t+ed+2i-1n-4w"
      responsive
      style={{ minHeight: 200 }}
      className="w-full"
    />
  );
  return (
    <div className="col-span-1 my-4 sm:col-span-2 lg:col-span-3">
      <AdLabeledSlot dense className="w-full">
        {ad}
      </AdLabeledSlot>
    </div>
  );
}

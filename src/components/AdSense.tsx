import { useEffect, useRef } from 'react';

/**
 * AdSense ユニットコンポーネント
 *
 * 使い方:
 *   <AdSense slot="XXXXXXXXXX" format="auto" />
 *
 * slot ID は Google AdSense ダッシュボード > 広告ユニット から取得してください。
 * 現在の publisher ID: ca-pub-1344710796174131
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
  /** AdSense 広告ユニットのスロットID (10桁の数字) */
  slot: string;
  format?: AdFormat;
  /** レスポンシブ対応するか (default: true) */
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
  /** インフィード広告のレイアウト指定 */
  layout?: string;
  /** レイアウトキー (fluid形式で使用) */
  layoutKey?: string;
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
    // adsbygoogle が既にこの要素を処理済みの場合はスキップ
    if (pushed.current) return;
    const el = insRef.current;
    if (!el) return;
    if (el.getAttribute('data-adsbygoogle-status')) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (e) {
      // AdSense のロード前など、エラーは無視
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

/**
 * 記事コンテンツ上部バナー（横長レスポンシブ）
 * → slot ID を AdSense ダッシュボードで "ディスプレイ広告" として作成して差し替えてください
 */
export function AdBannerTop({ slot = '1111111111' }: { slot?: string }) {
  return (
    <div className="my-8 flex justify-center">
      <AdSense
        slot={slot}
        format="horizontal"
        responsive
        style={{ minHeight: 90 }}
        className="w-full max-w-3xl"
      />
    </div>
  );
}

/**
 * 記事コンテンツ中部（レスポンシブ・インコンテンツ）
 */
export function AdInContent({ slot = '2222222222' }: { slot?: string }) {
  return (
    <div className="my-12 flex justify-center">
      <AdSense
        slot={slot}
        format="auto"
        responsive
        style={{ minHeight: 250 }}
        className="w-full max-w-3xl"
      />
    </div>
  );
}

/**
 * 記事コンテンツ下部（記事末・シェアボタン前）
 */
export function AdBannerBottom({ slot = '3333333333' }: { slot?: string }) {
  return (
    <div className="my-10 flex justify-center">
      <AdSense
        slot={slot}
        format="auto"
        responsive
        style={{ minHeight: 200 }}
        className="w-full max-w-3xl"
      />
    </div>
  );
}

/**
 * サイドバー広告（縦長・TOC下）
 */
export function AdSidebar({ slot = '4444444444' }: { slot?: string }) {
  return (
    <div className="mt-6">
      <AdSense
        slot={slot}
        format="rectangle"
        responsive={false}
        style={{ width: 300, height: 250 }}
        className="mx-auto"
      />
    </div>
  );
}

/**
 * 記事一覧ページ用インフィード広告（グリッド間に挿入）
 */
export function AdFeed({ slot = '5555555555' }: { slot?: string }) {
  return (
    <div className="col-span-1 sm:col-span-2 lg:col-span-3 my-4">
      <AdSense
        slot={slot}
        format="fluid"
        layout="in-article"
        layoutKey="-6t+ed+2i-1n-4w"
        responsive
        style={{ minHeight: 200 }}
        className="w-full"
      />
    </div>
  );
}

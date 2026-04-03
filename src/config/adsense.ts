/**
 * AdSense スロットと表示ポリシー（ADSENSE_PLACEMENT_DESIGN.md と同期）
 *
 * 本番では .env に実スロットIDを設定:
 *   VITE_ADSENSE_SLOT_ARTICLE_BOTTOM=1234567890
 * など
 */

const env = import.meta.env;

function slot(key: keyof ImportMetaEnv, fallback: string): string {
  const v = env[key];
  return typeof v === 'string' && v.length > 0 ? v : fallback;
}

/** 記事本文直前バナー（CROのため既定 false。A/B で true にできる） */
export const ADSENSE_ENABLE_ARTICLE_TOP =
  String(env.VITE_ADSENSE_ENABLE_ARTICLE_TOP || '').toLowerCase() === 'true';

/** 一覧・タグ: N 件ごとにインフィード 1 枠 */
export const ADSENSE_LISTING_FEED_EVERY = Math.max(
  4,
  Math.min(12, Number(env.VITE_ADSENSE_LISTING_FEED_EVERY) || 9)
);

/** 遅延ロード: ビューポート手前何 px でマウントするか */
export const ADSENSE_LAZY_ROOT_MARGIN = env.VITE_ADSENSE_LAZY_ROOT_MARGIN || '320px';

export const ADSENSE_SLOTS = {
  articleTop: slot('VITE_ADSENSE_SLOT_ARTICLE_TOP', '1111111111'),
  articleInContent: slot('VITE_ADSENSE_SLOT_IN_CONTENT', '2222222222'),
  articleBottom: slot('VITE_ADSENSE_SLOT_ARTICLE_BOTTOM', '3333333333'),
  sidebar: slot('VITE_ADSENSE_SLOT_SIDEBAR', '4444444444'),
  listingFeed: slot('VITE_ADSENSE_SLOT_LISTING_FEED', '5555555555'),
} as const;

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

/** 長文のみ: 本文中（最初の h2 直後） */
export const ADSENSE_ENABLE_MID_ARTICLE =
  String(env.VITE_ADSENSE_ENABLE_MID_ARTICLE || 'true').toLowerCase() !== 'false';

/** 本文中広告: 推定読了時間がこの分数以上のときのみ */
export const ADSENSE_MID_ARTICLE_MIN_READING_MINUTES = Math.max(
  1,
  Math.min(30, Number(env.VITE_ADSENSE_MID_ARTICLE_MIN_READING_MINUTES) || 8)
);

/** 本文中広告: h2 が最低この個数必要（1 = 最初の h2 直後に挿入可能） */
export const ADSENSE_MID_ARTICLE_MIN_H2 = Math.max(
  1,
  Math.min(10, Number(env.VITE_ADSENSE_MID_ARTICLE_MIN_H2) || 1)
);

/** 記事末アンカー（「もっと見る」下） */
export const ADSENSE_ENABLE_ANCHOR =
  String(env.VITE_ADSENSE_ENABLE_ANCHOR || 'true').toLowerCase() !== 'false';

export const ADSENSE_SLOTS = {
  articleTop: slot('VITE_ADSENSE_SLOT_ARTICLE_TOP', '1111111111'),
  articleInContent: slot('VITE_ADSENSE_SLOT_IN_CONTENT', '2222222222'),
  articleBottom: slot('VITE_ADSENSE_SLOT_ARTICLE_BOTTOM', '3333333333'),
  sidebar: slot('VITE_ADSENSE_SLOT_SIDEBAR', '4444444444'),
  listingFeed: slot('VITE_ADSENSE_SLOT_LISTING_FEED', '5555555555'),
  /** 本文中（長文・h2 あり） */
  articleMid: slot('VITE_ADSENSE_SLOT_ARTICLE_MID', '6666666666'),
  /** ページ下部アンカー */
  articleAnchor: slot('VITE_ADSENSE_SLOT_ARTICLE_ANCHOR', '7777777777'),
} as const;

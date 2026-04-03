import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AdArticleMid } from './AdSense';
import {
  ADSENSE_ENABLE_MID_ARTICLE,
  ADSENSE_MID_ARTICLE_MIN_H2,
  ADSENSE_MID_ARTICLE_MIN_READING_MINUTES,
} from '../config/adsense';

type Props = {
  contentRef: React.RefObject<HTMLElement | null>;
  readingTime: number;
  articleId: string;
};

/**
 * 長文かつ h2 がある記事で、最初の h2 の直後にスポンサー枠用ノードを挿入し、
 * AdArticleMid をポータル表示する（本文の流れを React の子としては分割しない）。
 */
export function ArticleMidAdPortal({ contentRef, readingTime, articleId }: Props) {
  const [host, setHost] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ADSENSE_ENABLE_MID_ARTICLE) {
      setHost(null);
      return;
    }
    if (readingTime < ADSENSE_MID_ARTICLE_MIN_READING_MINUTES) {
      setHost(null);
      return;
    }

    const root = contentRef.current;
    if (!root) {
      setHost(null);
      return;
    }

    root.querySelector('[data-article-mid-ad]')?.remove();

    const h2s = root.querySelectorAll('h2');
    if (h2s.length < ADSENSE_MID_ARTICLE_MIN_H2) {
      setHost(null);
      return;
    }

    const hostEl = document.createElement('div');
    hostEl.setAttribute('data-article-mid-ad', 'true');
    hostEl.className = 'article-mid-ad-host my-10 w-full max-w-none clear-both';

    const first = h2s[0];
    first.parentNode?.insertBefore(hostEl, first.nextSibling);
    setHost(hostEl);

    return () => {
      hostEl.remove();
      setHost(null);
    };
  }, [contentRef, readingTime, articleId]);

  if (!host) return null;
  return createPortal(<AdArticleMid />, host);
}

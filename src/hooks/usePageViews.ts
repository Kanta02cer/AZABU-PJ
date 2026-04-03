import { useEffect, useCallback } from 'react';

const STORAGE_KEY = 'azabu_page_views';

type ViewData = Record<string, number>;

function readViews(): ViewData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeViews(data: ViewData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // quota exceeded など
  }
}

/**
 * 記事ページのビュー数をLocalStorageで追跡するフック。
 * 記事コンポーネントのマウント時に自動でビューを記録する。
 *
 * @param articleId - 記事の一意なID（slug）
 */
export function usePageViews(articleId: string) {
  useEffect(() => {
    if (!articleId) return;
    const views = readViews();
    views[articleId] = (views[articleId] ?? 0) + 1;
    writeViews(views);
  }, [articleId]);
}

/**
 * ビュー数の多い記事IDを上位N件返す。
 * ビューデータが少ない場合は空配列を返す。
 */
export function getTopViewedIds(n: number = 5): string[] {
  const views = readViews();
  return Object.entries(views)
    .sort(([, a], [, b]) => b - a)
    .slice(0, n)
    .map(([id]) => id);
}

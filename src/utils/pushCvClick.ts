/**
 * Google Tag Manager（dataLayer）向けの CV クリックイベントを送る。
 * 既存の home / MobileStickyCTA と同じ event 名・キーに揃える。
 */
export function pushCvClick(buttonLocation: string, extra?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  const w = window as Window & { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({
    event: 'cv_click',
    button_location: buttonLocation,
    ...extra,
  });
}

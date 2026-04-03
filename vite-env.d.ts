/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADSENSE_SLOT_ARTICLE_TOP?: string;
  readonly VITE_ADSENSE_SLOT_IN_CONTENT?: string;
  readonly VITE_ADSENSE_SLOT_ARTICLE_BOTTOM?: string;
  readonly VITE_ADSENSE_SLOT_SIDEBAR?: string;
  readonly VITE_ADSENSE_SLOT_LISTING_FEED?: string;
  readonly VITE_ADSENSE_ENABLE_ARTICLE_TOP?: string;
  readonly VITE_ADSENSE_LISTING_FEED_EVERY?: string;
  readonly VITE_ADSENSE_LAZY_ROOT_MARGIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __BASE_PATH__: string;
declare const __IS_PREVIEW__: boolean;
declare const __READDY_PROJECT_ID__: string;
declare const __READDY_VERSION_ID__: string;
declare const __READDY_AI_DOMAIN__: string;
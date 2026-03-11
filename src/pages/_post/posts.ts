export type PostType = 'news' | 'column';

export interface PostMeta {
  id: string;
  code: string;
  type: PostType;
  thumbnail: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  tags?: string[];
  /** 手動で「人気／ピックアップ」記事として扱いたい場合に true にする */
  isFeatured?: boolean;
  isPopular?: boolean;
}

const modules = import.meta.glob('./*.tsx', { eager: true });

const DEFAULT_THUMBNAIL = __BASE_PATH__ + 'images/placeholder-press.svg';

function hashBase36(input: string): string {
  // Deterministic, stable across builds. Not cryptographic.
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = (h * 33) ^ input.charCodeAt(i);
  }
  return (h >>> 0).toString(36).toUpperCase();
}

function makeArticleCode(id: string, type: PostType): string {
  const prefix = type === 'news' ? 'APN' : 'APC';
  return `${prefix}-${hashBase36(id).slice(0, 6)}`;
}

const posts: PostMeta[] = Object.entries(modules).flatMap(([path, mod]) => {
  const anyMod = mod as any;
  const meta = anyMod.meta as (Omit<PostMeta, 'id' | 'code' | 'thumbnail'> & {
    thumbnail?: string;
    code?: string;
  }) | undefined;
  if (!meta) return [];

  const id = path.replace('./', '').replace('.tsx', '');
  const type = meta.type;
  const code = meta.code ?? makeArticleCode(id, type);
  const thumbnail = meta.thumbnail ?? DEFAULT_THUMBNAIL;

  return [
    {
      id,
      code,
      thumbnail,
      ...meta,
    },
  ];
});

// Sort by date (latest first). Dates are in "YYYY.MM.DD" format.
posts.sort((a, b) => {
  const normalize = (d: string) => new Date(d.replace(/\./g, '/')).getTime();
  return normalize(b.date) - normalize(a.date);
});

export const allPosts: PostMeta[] = posts;

export function getPostById(id: string): PostMeta | null {
  return posts.find((p) => p.id === id) ?? null;
}


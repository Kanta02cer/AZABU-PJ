import React from 'react';
import { Helmet } from 'react-helmet-async';

interface ArticleSchema {
  "@context": string;
  "@type": string;
  headline: string;
  image: string[];
  datePublished: string;
  dateModified: string;
  author: { "@type": string; name: string; url: string }[];
}

interface SEOProps {
  title?: string;
  description?: string;
  type?: string;
  url?: string;
  /** OGP用画像URL (og:image) */
  image?: string;
  /** ArticleTemplate から渡される画像 prop 名 (imageと同義) */
  ogImage?: string;
  /** カノニカルURL */
  canonical?: string;
  /** 検索キーワード */
  keywords?: string;
  /** Article 構造化データ */
  articleSchema?: ArticleSchema;
  /** BreadcrumbList 構造化データ */
  breadcrumbSchema?: Record<string, unknown>;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'AZABU+ Project',
  description = '20代のエンジニア転職なら麻布台ヒルズのAZABU+ Project。東京の東証プライム上場企業でインフラエンジニアとしてキャリアをスタート。未経験から年収350万円以上を保証。',
  type = 'website',
  url = 'https://azabuplus.jp',
  image,
  ogImage,
  canonical,
  keywords,
  articleSchema,
  breadcrumbSchema,
}) => {
  const siteName = 'AZABU+ Project';
  const fullTitle = title === siteName ? title : `${title} | ${siteName}`;
  const resolvedImage = ogImage || image || 'https://azabuplus.jp/og-image.jpg';
  const resolvedCanonical = canonical || url;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {resolvedCanonical && <link rel="canonical" href={resolvedCanonical} />}

      {/* OGP */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={resolvedCanonical} />
      <meta property="og:image" content={resolvedImage} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="ja_JP" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={resolvedImage} />

      {/* Article 構造化データ */}
      {articleSchema && (
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      )}
      {/* BreadcrumbList 構造化データ */}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
    </Helmet>
  );
};

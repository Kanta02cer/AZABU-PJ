import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  type?: string;
  url?: string;
  image?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Regalis Societas Tokyo',
  description = '日本の伝統と匠の技に裏打ちされた、世界に通用するモダンなラグジュアリーオーダースーツブランド。',
  type = 'website',
  url = 'https://azabuplus.jp',
  image = '/images/ogp.jpg',
}) => {
  const fullTitle = title === 'Regalis Societas Tokyo' ? title : `${title} | Regalis Societas Tokyo`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* OGP */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

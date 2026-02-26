import React from 'react';

interface SEOProps {
  /** The page title. Will be suffixed with "| AZABU+ Project" if not present. */
  title?: string;
  /** The meta description for search engines. */
  description?: string;
  /** Keywords for SEO, comma-separated. */
  keywords?: string;
  /** Open Graph title. */
  ogTitle?: string;
  /** Open Graph description. */
  ogDescription?: string;
  /** Open Graph image URL. */
  ogImage?: string;
  /** Canonical URL for the page. */
  canonical?: string;
  /** JSON-LD Article Schema Object */
  articleSchema?: Record<string, any>;
}

/**
 * Dynamic SEO component to manage head tags.
 * Use this on every page to ensure proper search engine optimization.
 */
export function SEO({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  canonical,
  articleSchema,
}: SEOProps) {
  React.useEffect(() => {
    // Handling Title
    if (title) {
      const siteName = 'AZABU+ Project';
      document.title = title.includes(siteName) ? title : `${title} | ${siteName}`;
    }

    const updateMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      let element = document.head.querySelector(`meta[${attr}="${name}"]`);
      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };

    if (description) updateMeta('description', description);
    if (keywords) updateMeta('keywords', keywords);
    
    // OG Tags
    if (ogTitle || title) updateMeta('og:title', ogTitle || title || '', 'property');
    if (ogDescription || description) updateMeta('og:description', ogDescription || description || '', 'property');
    if (ogImage) updateMeta('og:image', ogImage, 'property');
    updateMeta('og:type', 'website', 'property');
    
    // Canonical
    const currentUrl = canonical || window.location.href;
    updateMeta('og:url', currentUrl, 'property');

    // Twitter Card
    updateMeta('twitter:card', 'summary_large_image', 'name');
    if (ogTitle || title) updateMeta('twitter:title', ogTitle || title || '', 'name');
    if (ogDescription || description) updateMeta('twitter:description', ogDescription || description || '', 'name');
    if (ogImage) updateMeta('twitter:image', ogImage, 'name');
    
    // Canonical
    if (canonical) {
      let canonicalLink = document.head.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        canonicalLink.setAttribute('href', canonical);
      } else {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        canonicalLink.setAttribute('href', canonical);
        document.head.appendChild(canonicalLink);
      }
    }

    // JSON-LD Schema
    if (articleSchema) {
      let script = document.head.querySelector('script[type="application/ld+json"]');
      if (script) {
        script.innerHTML = JSON.stringify(articleSchema);
      } else {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.innerHTML = JSON.stringify(articleSchema);
        document.head.appendChild(script);
      }
    }

    // Cleanup logic (optional, but good practice for SPA routing)
    return () => {
      // document.title = 'AZABU+ Project'; // Keep previous title or default
    };
  }, [title, description, keywords, ogTitle, ogDescription, ogImage, canonical, articleSchema]);

  return null;
}

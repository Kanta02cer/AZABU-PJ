import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { resolve } from 'path';

import { newsData } from '../src/mocks/news.ts';
import { columnsData } from '../src/mocks/columns.ts';

const HOSTNAME = 'https://azabuplus-project.com';
const OUT_DIR = resolve(process.cwd(), 'public');
const SITEMAP_FILE = resolve(OUT_DIR, 'sitemap.xml');

async function generateSitemap() {
  console.log('Generating sitemap.xml...');

  const smStream = new SitemapStream({ hostname: HOSTNAME });
  const writeStream = createWriteStream(SITEMAP_FILE);

  // Pipe the stream to the file
  smStream.pipe(writeStream);

  // 1. Static Pages
  const staticPages = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/news', changefreq: 'weekly', priority: 0.8 },
    { url: '/column', changefreq: 'weekly', priority: 0.8 },
    { url: '/interviews', changefreq: 'monthly', priority: 0.7 },
  ];

  staticPages.forEach(page => smStream.write(page));

  // 2. Dynamic News Pages
  newsData.forEach(news => {
    smStream.write({
      url: `/news/${news.id}`,
      changefreq: 'monthly',
      priority: 0.6,
      // lastmod: news.date // if date is parseable to ISO
    });
  });

  // 3. Dynamic Column Pages
  columnsData.forEach(column => {
    smStream.write({
      url: `/column/${column.id}`,
      changefreq: 'monthly',
      priority: 0.6,
    });
  });

  // Signal end of stream
  smStream.end();

  try {
    const sitemapData = await streamToPromise(smStream);
    console.log(`✅ Sitemap created successfully at ${SITEMAP_FILE} (${sitemapData.length} bytes)`);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();

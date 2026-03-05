import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream, mkdirSync, copyFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';

import { newsData } from '../src/mocks/news.ts';
import { columnsData } from '../src/mocks/columns.ts';
import { interviewsData } from '../src/mocks/interviews.ts';

const HOSTNAME = 'https://azabuplus-project.com';
const PUBLIC_DIR = resolve(process.cwd(), 'public');
const SITEMAP_FILE_PUBLIC = resolve(PUBLIC_DIR, 'sitemap.xml');

// In postbuild, out directory already exists
const OUT_DIR = resolve(process.cwd(), 'out');
const SITEMAP_FILE_OUT = resolve(OUT_DIR, 'sitemap.xml');

async function generateSitemap() {
  console.log('Generating sitemap.xml and static route folders...');

  const smStream = new SitemapStream({ hostname: HOSTNAME });
  
  // Create streams for both public/ (for dev/repo) and out/ (for immediate deploy)
  const writeStreams = [];
  try {
    writeStreams.push(createWriteStream(SITEMAP_FILE_PUBLIC));
    if (existsSync(OUT_DIR)) {
      writeStreams.push(createWriteStream(SITEMAP_FILE_OUT));
    }
  } catch(e) {
    console.warn("Could not create write streams for sitemap", e);
  }

  writeStreams.forEach(ws => smStream.pipe(ws));

  const routes = [];

  // 1. Static Pages
  const staticPages = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/news', changefreq: 'weekly', priority: 0.8 },
    { url: '/column', changefreq: 'weekly', priority: 0.8 },
    { url: '/interviews', changefreq: 'monthly', priority: 0.7 },
  ];

  staticPages.forEach(page => {
    smStream.write(page);
    routes.push(page.url);
  });

  // 2. Dynamic News Pages
  newsData.forEach(news => {
    const url = `/news/${news.id}`;
    smStream.write({
      url,
      changefreq: 'monthly',
      priority: 0.6,
    });
    routes.push(url);
  });

  // 3. Dynamic Column Pages
  columnsData.forEach(column => {
    const url = `/column/${column.id}`;
    smStream.write({
      url,
      changefreq: 'monthly',
      priority: 0.6,
    });
    routes.push(url);
  });

  // 4. Dynamic Interview Pages
  interviewsData.forEach(interview => {
    const url = `/interview/${interview.id}`;
    smStream.write({
      url,
      changefreq: 'monthly',
      priority: 0.6,
    });
    routes.push(url);
  });

  // Signal end of stream
  smStream.end();

  try {
    const sitemapData = await streamToPromise(smStream);
    console.log(`✅ Sitemap created successfully (${sitemapData.length} bytes)`);
    
    // Create static folder structure to prevent 404s on GitHub Pages and other static hosts
    if (existsSync(OUT_DIR)) {
      const sourceHtml = join(OUT_DIR, 'index.html');
      if (existsSync(sourceHtml)) {
        let generatedCount = 0;
        routes.forEach(route => {
          if (route === '/' || route === '') return;
          
          // Remove leading slash for safe join
          const cleanRoute = route.startsWith('/') ? route.slice(1) : route;
          const routePath = join(OUT_DIR, cleanRoute);
          
          if (!existsSync(routePath)) {
            mkdirSync(routePath, { recursive: true });
          }
          
          const targetHtml = join(routePath, 'index.html');
          copyFileSync(sourceHtml, targetHtml);
          generatedCount++;
        });
        console.log(`✅ Generated static index.html files for ${generatedCount} routes to prevent 404 HTTP errors for SEO.`);
      } else {
        console.warn(`⚠️ Source index.html not found at ${sourceHtml}. Skipping static route generation.`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error generating sitemap or static routes:', error);
    process.exit(1);
  }
}

generateSitemap();

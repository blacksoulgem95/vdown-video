import type { APIRoute } from 'astro';
import db from '@/lib/db';

const PLATFORM_PAGES = [
  { loc: '/', changefreq: 'daily', priority: '1.0' },
  { loc: '/download/youtube', changefreq: 'weekly', priority: '0.9' },
  { loc: '/download/vimeo', changefreq: 'weekly', priority: '0.8' },
  { loc: '/download/facebook', changefreq: 'weekly', priority: '0.8' },
  { loc: '/download/instagram', changefreq: 'weekly', priority: '0.8' },
  { loc: '/download/tiktok', changefreq: 'weekly', priority: '0.8' },
  { loc: '/download/twitter', changefreq: 'weekly', priority: '0.8' },
  { loc: '/download/reddit', changefreq: 'weekly', priority: '0.8' },
  { loc: '/download/soundcloud', changefreq: 'weekly', priority: '0.8' },
  { loc: '/blog', changefreq: 'daily', priority: '0.8' },
];

const BASE_URL = process.env['BASE_URL'] ?? 'https://vdown.video';

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export const GET: APIRoute = async () => {
  const articles = db
    .prepare('SELECT slug, updated_at FROM articles WHERE published_at IS NOT NULL ORDER BY updated_at DESC')
    .all() as { slug: string; updated_at: number }[];

  const today = new Date().toISOString().slice(0, 10);

  const platformUrls = PLATFORM_PAGES.map((p) =>
    `  <url>
    <loc>${escapeXml(BASE_URL)}${escapeXml(p.loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`.trim(),
  );

  const articleUrls = articles.map((a) =>
    `  <url>
    <loc>${escapeXml(BASE_URL)}/blog/${escapeXml(a.slug)}</loc>
    <lastmod>${new Date(a.updated_at * 1000).toISOString().slice(0, 10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`.trim(),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...platformUrls, ...articleUrls].join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
};

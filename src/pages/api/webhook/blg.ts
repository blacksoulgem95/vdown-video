import type { APIRoute } from 'astro';
import db from '@/lib/db';

interface BLGArticle {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content_html?: string;
  content_markdown?: string;
  meta_description?: string;
  hero_image_url?: string;
  jsonLd?: unknown;
  faqJsonLd?: unknown;
  languageCode?: string;
  seedKeyword?: string;
  keywords?: string[];
  created_at?: string;
}

export const POST: APIRoute = async ({ request }) => {
  const secret = process.env['BABYLOVEGROWTH_WEBHOOK_SECRET'];
  if (secret) {
    const authHeader = request.headers.get('x-webhook-secret')
      ?? request.headers.get('authorization')?.replace('Bearer ', '');
    if (authHeader !== secret) {
      return json({ error: 'Unauthorized' }, 401);
    }
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const article = body as BLGArticle;

  if (!article.slug || !article.title) {
    return json({ error: 'Missing required fields: slug, title' }, 400);
  }

  db.prepare(
    `INSERT INTO articles
       (blg_id, slug, title, excerpt, content_html, content_markdown,
        meta_description, hero_image_url, json_ld, faq_json_ld,
        language_code, seed_keyword, keywords_json, published_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, unixepoch(), unixepoch())
     ON CONFLICT(slug) DO UPDATE SET
       title           = excluded.title,
       excerpt         = excluded.excerpt,
       content_html    = excluded.content_html,
       content_markdown= excluded.content_markdown,
       meta_description= excluded.meta_description,
       hero_image_url  = excluded.hero_image_url,
       json_ld         = excluded.json_ld,
       faq_json_ld     = excluded.faq_json_ld,
       language_code   = excluded.language_code,
       seed_keyword    = excluded.seed_keyword,
       keywords_json   = excluded.keywords_json,
       updated_at      = unixepoch()`,
  ).run(
    article.id ?? null,
    article.slug,
    article.title,
    article.excerpt ?? null,
    article.content_html ?? null,
    article.content_markdown ?? null,
    article.meta_description ?? null,
    article.hero_image_url ?? null,
    article.jsonLd ? JSON.stringify(article.jsonLd) : null,
    article.faqJsonLd ? JSON.stringify(article.faqJsonLd) : null,
    article.languageCode ?? 'en',
    article.seedKeyword ?? null,
    article.keywords ? JSON.stringify(article.keywords) : null,
  );

  return json({ ok: true, slug: article.slug });
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

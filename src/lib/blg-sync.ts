import db from '@/lib/db';

const BLG_API_BASE = 'https://api.babylovegrowth.ai/api/integrations/v1';
const PAGE_LIMIT = 50;

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

interface BLGResponse {
  data: BLGArticle[];
  meta?: { total?: number; page?: number; limit?: number };
}

function upsertArticle(article: BLGArticle): void {
  db.prepare(
    `INSERT INTO articles
       (blg_id, slug, title, excerpt, content_html, content_markdown,
        meta_description, hero_image_url, json_ld, faq_json_ld,
        language_code, seed_keyword, keywords_json, published_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, unixepoch(), unixepoch())
     ON CONFLICT(slug) DO UPDATE SET
       title            = excluded.title,
       excerpt          = excluded.excerpt,
       content_html     = excluded.content_html,
       content_markdown = excluded.content_markdown,
       meta_description = excluded.meta_description,
       hero_image_url   = excluded.hero_image_url,
       json_ld          = excluded.json_ld,
       faq_json_ld      = excluded.faq_json_ld,
       language_code    = excluded.language_code,
       seed_keyword     = excluded.seed_keyword,
       keywords_json    = excluded.keywords_json,
       updated_at       = unixepoch()`,
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
}

export async function syncArticlesFromBLG(force = false): Promise<number> {
  const apiKey = process.env['BABYLOVEGROWTH_API_KEY'];
  if (!apiKey) return 0;

  if (!force) {
    const existing = db.prepare('SELECT COUNT(*) as n FROM articles').get() as { n: number };
    if (existing.n > 0) return 0;
  }

  let page = 1;
  let fetched = 0;

  try {
    while (true) {
      const url = `${BLG_API_BASE}/articles?limit=${PAGE_LIMIT}&page=${page}`;
      const res = await fetch(url, {
        headers: { 'x-api-key': apiKey, 'Accept': 'application/json' },
      });

      if (!res.ok) {
        console.error(`[blg-sync] fetch failed: ${res.status} ${res.statusText}`);
        break;
      }

      const body = await res.json() as BLGResponse;
      const articles = body.data ?? [];

      if (articles.length === 0) break;

      for (const article of articles) {
        upsertArticle(article);
        fetched++;
      }

      if (articles.length < PAGE_LIMIT) break;
      page++;
    }

    console.log(`[blg-sync] seeded ${fetched} articles`);
  } catch (err) {
    console.error('[blg-sync] startup sync error:', err);
  }
  return fetched;
}

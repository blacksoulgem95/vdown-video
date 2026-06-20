import type { APIRoute } from 'astro';
import db from '@/lib/db';

export const POST: APIRoute = ({ params, redirect }) => {
  const { slug } = params;
  db.prepare('DELETE FROM articles WHERE slug = ?').run(slug);
  return redirect('/admin/blog?flash=Article+deleted.');
};

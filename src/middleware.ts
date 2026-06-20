import { defineMiddleware } from 'astro:middleware';
import { recoverStaleJobs } from '@/lib/queue';
import { startEvictionCron } from '@/lib/eviction';
import { syncArticlesFromBLG } from '@/lib/blg-sync';

let started = false;

const ADMIN_BYPASS = new Set(['/admin/login', '/admin/logout']);

export const onRequest = defineMiddleware(async (ctx, next) => {
  if (!started) {
    started = true;
    recoverStaleJobs();
    startEvictionCron();
    void syncArticlesFromBLG();
  }

  const { pathname } = ctx.url;
  if (pathname.startsWith('/admin') && !ADMIN_BYPASS.has(pathname)) {
    const adminPassword = process.env['ADMIN_PASSWORD'];

    // If no password configured, allow access without auth
    if (!adminPassword) return next();

    // Cookie auth (browser sessions)
    const cookieAuth = ctx.cookies.get('admin_auth')?.value;
    if (cookieAuth === 'authenticated') return next();

    // Bearer auth (API / curl) - use password as bearer token
    const bearer = ctx.request.headers.get('authorization')?.replace('Bearer ', '');
    if (bearer === adminPassword) return next();

    // HTML request → login page; API request → 401 JSON
    const acceptsHtml = ctx.request.headers.get('accept')?.includes('text/html') ?? true;
    if (acceptsHtml) {
      return ctx.redirect('/admin/login');
    }
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return next();
});

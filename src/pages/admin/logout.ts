import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ cookies, redirect }) => {
  cookies.delete('admin_auth', { path: '/' });
  return redirect('/admin/login');
};

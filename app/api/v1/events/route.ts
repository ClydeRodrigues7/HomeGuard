import { isAuthorized, readState, unauthorized, updateState } from '@/lib/api-store';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  if (!isAuthorized(request)) return unauthorized();
  const url = new URL(request.url);
  const since = url.searchParams.get('since');
  const state = await readState();
  const rows = since ? state.events.filter(event => { const d = new Date(event.time); return !Number.isNaN(d.valueOf()) && d >= new Date(since); }) : state.events;
  return Response.json({ data: rows });
}
export async function PUT(request: Request) {
  if (!isAuthorized(request)) return unauthorized();
  const body = await request.json().catch(() => null) as { data?: unknown } | null;
  if (!Array.isArray(body?.data) || body.data.some(row => !row || typeof row.id !== 'string' || typeof row.title !== 'string')) return Response.json({ error: 'data must be a valid event array.' }, { status: 400 });
  await updateState(state => { state.events = body.data as typeof state.events; });
  return Response.json({ saved: body.data.length });
}

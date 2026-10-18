import { isAuthorized, readState, unauthorized, updateState } from '@/lib/api-store';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  if (!isAuthorized(request)) return unauthorized();
  return Response.json({ data: (await readState()).devices });
}
export async function PUT(request: Request) {
  if (!isAuthorized(request)) return unauthorized();
  const body = await request.json().catch(() => null) as { data?: unknown } | null;
  if (!Array.isArray(body?.data) || body.data.some(row => !row || typeof row.id !== 'string' || typeof row.name !== 'string' || typeof row.ip !== 'string')) return Response.json({ error: 'data must be a valid device array.' }, { status: 400 });
  await updateState(state => { state.devices = body.data as typeof state.devices; });
  return Response.json({ saved: body.data.length });
}
export async function PATCH(request: Request) {
  if (!isAuthorized(request)) return unauthorized();
  const body = await request.json().catch(() => null) as { id?: string; name?: string; category?: string } | null;
  if (!body?.id || (body.name !== undefined && (typeof body.name !== 'string' || !body.name.trim())) || (body.category !== undefined && typeof body.category !== 'string')) return Response.json({ error: 'Provide a device id and valid fields.' }, { status: 400 });
  const device = await updateState(state => {
    const item = state.devices.find(row => row.id === body.id);
    if (!item) return null;
    if (body.name !== undefined) item.name = body.name.trim();
    if (body.category !== undefined) item.category = body.category;
    return item;
  });
  return device ? Response.json({ data: device }) : Response.json({ error: 'Device not found.' }, { status: 404 });
}
export async function DELETE(request: Request) {
  if (!isAuthorized(request)) return unauthorized();
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return Response.json({ error: 'Device id is required.' }, { status: 400 });
  const removed = await updateState(state => { const index = state.devices.findIndex(item => item.id === id); return index < 0 ? null : state.devices.splice(index, 1)[0]; });
  return removed ? Response.json({ data: removed }) : Response.json({ error: 'Device not found.' }, { status: 404 });
}

import { isAuthorized, readState, unauthorized, updateState } from '@/lib/api-store';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  if (!isAuthorized(request)) return unauthorized();
  return Response.json({ data: (await readState()).findings });
}
export async function PUT(request: Request) {
  if (!isAuthorized(request)) return unauthorized();
  const body = await request.json().catch(() => null) as { data?: unknown } | null;
  if (!Array.isArray(body?.data) || body.data.some(row => !row || typeof row.id !== 'string' || typeof row.title !== 'string')) return Response.json({ error: 'data must be a valid finding array.' }, { status: 400 });
  await updateState(state => { state.findings = body.data as typeof state.findings; });
  return Response.json({ saved: body.data.length });
}
export async function PATCH(request: Request) {
  if (!isAuthorized(request)) return unauthorized();
  const body = await request.json().catch(() => null) as { id?: string; status?: string } | null;
  const valid = ['open', 'in progress', 'resolved', 'accepted risk'];
  if (!body?.id || !body.status || !valid.includes(body.status)) return Response.json({ error: 'Provide a finding id and valid status.' }, { status: 400 });
  const finding = await updateState(state => {
    const item = state.findings.find(row => row.id === body.id);
    if (!item) return null;
    item.status = body.status as typeof item.status;
    state.events.unshift({ id: `api-${Date.now()}`, title: 'Finding status updated', device: item.device, time: new Date().toLocaleString(), severity: item.severity, description: `${item.title} status changed to ${item.status}.`, type: 'Finding status', source: 'API' } as (typeof state.events)[number]);
    return item;
  });
  return finding ? Response.json({ data: finding }) : Response.json({ error: 'Finding not found.' }, { status: 404 });
}

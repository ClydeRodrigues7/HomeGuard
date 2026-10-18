import { isAuthorized, readState, unauthorized } from '@/lib/api-store';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  if (!isAuthorized(request)) return unauthorized();
  const state = await readState();
  return Response.json({ name: 'HomeGuard API', version: 'v1', updatedAt: state.updatedAt, endpoints: ['/api/v1/devices', '/api/v1/findings', '/api/v1/events', '/api/v1/scan'], capabilities: { deviceInventory: true, findingManagement: true, activityFeed: true, scanRequests: true, liveNetworkDiscovery: false }, note: 'Inventory reflects saved records. Scans require an authorized monitoring agent.' });
}

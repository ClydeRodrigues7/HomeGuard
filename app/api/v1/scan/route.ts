import { isAuthorized, unauthorized, updateState } from '@/lib/api-store';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!isAuthorized(request)) return unauthorized();
  const snapshot = await updateState(state => {
    const clients = state.devices.filter(device => device.category !== 'Router');
    if (clients.length) {
      const selected = clients[(state.refreshCount ?? 0) % clients.length];
      selected.status = selected.status === 'online' ? 'offline' : 'online';
      selected.lastSeen = selected.status === 'online' ? 'Just now' : 'Not seen in latest snapshot';
      selected.risk = selected.risk === 'low' ? 'medium' : selected.risk === 'medium' ? 'low' : selected.risk;
      state.refreshCount = (state.refreshCount ?? 0) + 1;
      const event = { id: `refresh-${Date.now()}`, title: 'Sample inventory refreshed', device: selected.name, time: new Date().toLocaleString(), severity: 'info', description: `Generated snapshot updated ${selected.name} to ${selected.status}. No physical network scan was performed.`, type: 'Inventory refresh', source: 'Generated sample' };
      state.events.unshift(event);
      return { event, changedDevice: selected, devices: state.devices, findings: state.findings };
    }
    const event = { id: `refresh-${Date.now()}`, title: 'Sample inventory refresh requested', device: 'Home network', time: new Date().toLocaleString(), severity: 'info', description: 'No device records are available to update.', type: 'Inventory refresh', source: 'Generated sample' };
    state.events.unshift(event);
    return { event, changedDevice: null, devices: state.devices, findings: state.findings };
  });
  return Response.json({ data: snapshot.event, devices: snapshot.devices, findings: snapshot.findings, changedDevice: snapshot.changedDevice, status: 'updated', liveDiscovery: false, message: snapshot.changedDevice ? `Generated sample snapshot updated ${snapshot.changedDevice.name}. Live discovery requires a connected agent.` : 'Refresh request recorded. Connect an agent to receive device data.' });
}

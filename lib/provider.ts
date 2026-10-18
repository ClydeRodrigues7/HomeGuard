import type { Device, Event, Finding } from './initial-data';
/** Providers return observations only; they must never imply traffic links or verified threats without evidence. */
export interface HomeGuardProvider {
  readonly mode: 'sample' | 'agent';
  listDevices(propertyId: string): Promise<Device[]>;
  listFindings(propertyId: string): Promise<Finding[]>;
  listEvents(propertyId: string, since?: Date): Promise<Event[]>;
  startScan(propertyId: string, consent: { authorizedNetwork: true }): Promise<{ scanId: string; status: 'queued' | 'running' }>;
}
export interface AgentTelemetry { agentId: string; observedAt: string; devices: Array<{ macAddress?: string; ipAddress?: string; vendor?: string; category?: string; status: 'online'|'offline'|'unknown' }>; }
/** Implementations must authenticate the agent server-side and discard credentials from logs. */
export interface AgentIngestService { ingest(telemetry: AgentTelemetry, credential: string): Promise<{ accepted: number; rejected: number }>; }

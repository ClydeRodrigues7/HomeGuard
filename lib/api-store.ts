import { promises as fs } from 'node:fs';
import path from 'node:path';
import { initialDevices, initialEvents, initialFindings, type Device, type Event, type Finding } from './initial-data';

export type ApiState = { devices: Device[]; findings: Finding[]; events: Event[]; updatedAt: string; refreshCount?: number };
const filePath = path.join(process.cwd(), 'data', 'homeguard-state.json');
let queue: Promise<unknown> = Promise.resolve();

export async function readState(): Promise<ApiState> {
  try { return JSON.parse(await fs.readFile(filePath, 'utf8')) as ApiState; }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    const initial = { devices: initialDevices, findings: initialFindings, events: initialEvents, updatedAt: new Date().toISOString() };
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
}

export async function updateState<T>(update: (state: ApiState) => T | Promise<T>): Promise<T> {
  const task = queue.then(async () => {
    const state = await readState();
    const result = await update(state);
    state.updatedAt = new Date().toISOString();
    const tempPath = `${filePath}.${process.pid}.tmp`;
    await fs.writeFile(tempPath, JSON.stringify(state, null, 2), 'utf8');
    await fs.rename(tempPath, filePath);
    return result;
  });
  queue = task.catch(() => undefined);
  return task;
}

export function isAuthorized(request: Request): boolean {
  const apiKey = process.env.HOMEGUARD_API_KEY;
  const url = new URL(request.url);
  const host = request.headers.get('host')?.split(':')[0]?.toLowerCase();
  const loopback = host === 'localhost' || host === '127.0.0.1' || host === '::1';
  if (apiKey && request.headers.get('authorization') === `Bearer ${apiKey}`) return true;
  return loopback && (url.protocol === 'http:' || url.protocol === 'https:');
}

export function unauthorized() {
  return Response.json({ error: 'API key required. Set HOMEGUARD_API_KEY and send it as a Bearer token.' }, { status: 401 });
}


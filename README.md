# HomeGuard

HomeGuard is a smart home security visibility workspace for reviewing household device inventory, security findings, activity, and network organization. It includes a dark public landing page, a local dashboard, and a persistent JSON REST API.

## Run locally

Use Node.js 22 and npm. From the project folder, install the exact locked dependencies and start the development server:

```powershell
npm ci
npm run dev
```

Open <http://localhost:3000> for the landing page or <http://localhost:3000/dashboard> for the workspace. The UI uses saved sample inventory until an authorized monitoring agent is connected. The website cannot scan a LAN by itself.

To check the production build locally, run `npm run build` and then `npm start`. To check TypeScript, run `npm run typecheck`.

## REST API

- `GET /api/v1` — API version, capabilities, and endpoint list.
- `GET` and `PUT /api/v1/devices` — read or replace the inventory; `PATCH` renames/classifies by id; `DELETE /api/v1/devices?id=...` archives a record.
- `GET` and `PUT /api/v1/findings` — read or replace findings; `PATCH` updates status by id.
- `GET` and `PUT /api/v1/events` — read activity, optionally filtered with `?since=...`, or replace activity.
- `POST /api/v1/scan` — record an inventory refresh request. Actual discovery requires a connected agent.

API data persists in `data/homeguard-state.json`, created when the API is first used. The dashboard syncs device, finding, and activity changes to this store. Local loopback requests work without a token. Remote clients must use the configured token. For remote API clients, set a long random `HOMEGUARD_API_KEY` in the server environment and send `Authorization: Bearer <key>`. Never expose the key in browser code.

Example:

```sh
curl http://localhost:3000/api/v1/devices
```

## Workspace routes

- `/dashboard` — inventory metrics, security health, charts, and refresh request.
- `/devices` — searchable, filterable inventory, export, rename, and archive.
- `/security` — findings, severity filters, and finding status changes.
- `/network-map` — interactive inventory grouping around the detected gateway.
- `/activity` — searchable activity and CSV export.
- `/reports` — current-record summary and print-to-PDF.
- `/recommendations` — household security checklist.
- `/properties` — browser-local property and household workspace management.
- `/integrations` — REST API status and monitoring connection guidance.
- `/settings` — appearance, local preferences, record export, and reset.

## Data and security notes

The Prisma schema models organizations, memberships, properties, devices, findings, events, integrations, scans, and audit records for a future PostgreSQL deployment. Current REST data uses a local JSON file and does not yet use Prisma. Authentication, account recovery, server-enforced household roles, mail delivery, billing, and a monitoring agent require their respective providers. Findings describe observations only; unknown identity does not establish malicious activity, and unavailable firmware or traffic data is not inferred.

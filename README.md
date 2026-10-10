# Crossroads human dashboard

Next.js App Router, React and TypeScript. The dashboard shows the product catalogue and galleries, buyer requests and comparisons, negotiation history, approval queue, confirmed orders and workspace activity. Seller workspaces see their own negotiations and orders; buyer-only request views are absent.

Human reviewers inspect immutable terms, product evidence, changes from the previous offer, current validity and both approval states. Approval requires checking the exact-offer acknowledgement. The API rechecks the offer, policies and inventory when each approval arrives. A stale open dialog cannot approve a newer offer accidentally.

Catalogue editing, request creation, rule configuration and negotiation actions use the [CLI](https://github.com/iivko/crossroads-cli/blob/main/README.md). This dashboard's write proxy allows only browser login, logout and approval decisions.

## Run locally

Recommended: follow [backend Docker Compose setup](https://github.com/iivko/crossroads-backend/blob/main/README.md). The UI runs at http://localhost:3100.

For host development, start the API and worker separately, then:

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Node.js 24 is the tested runtime. `API_INTERNAL_URL` is a server-only runtime setting, defaulting to `http://127.0.0.1:8100`; Compose sets it to `http://api:8100`. No browser bearer token or storage secret is embedded in the build. Browser calls stay on the dashboard origin through `/api/v1/*`.

The API uses HttpOnly session cookies plus a CSRF cookie/header and an allowed Origin check. Configure `FRONTEND_URL` and `ALLOWED_ORIGINS` in the backend if changing the dashboard port. Keep agent credentials separate from human browser sessions.

## Checks

```sh
npm run typecheck
npm run format:check
npm run build
```

The Docker image runs Next.js's standalone server as a non-root user. For a temporary host production preview, `npm run start` serves the completed build; Docker uses the generated standalone `server.js` directly.

## Browser test

Start the full stack and seed data. Prepare one pending deal using `uv run python scripts/demo_agents.py` from `backend`, then:

```sh
npm test
```

The test uses `/usr/bin/google-chrome` by default. Set `CHROME_PATH` to a Chrome/Chromium executable if needed, and `FRONTEND_URL` if the dashboard is elsewhere. It logs in as both demo users, downloads visible gallery images, reviews exact terms, approves the same offer twice, and verifies the persisted order. **It creates a demo order and allocates 80 chairs**; run it only against a disposable or explicitly seeded demo environment. The backend unit/integration suite uses separate schemas and does not consume demo stock.

Screenshots and traces are written to ignored `test-results/`. Desktop and 390px mobile views are covered. The interface polls every five seconds and also has manual Refresh. No third-party analytics or external image services are used.

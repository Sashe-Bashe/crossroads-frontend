# Crossroads frontend

Independent Next.js, React, and TypeScript application for human-approved B2B
procurement. Requires **Node.js 24+**. This repository has its own dependencies,
lockfile, browser tests, and CI; it imports no code from the backend or MCP repos.

## Run

Start the marketplace backend separately on `http://localhost:4000`, then:

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open **http://localhost:3000**. The default API CORS configuration permits that
exact origin; if you use a different frontend address, update backend
`CORS_ORIGIN`. Set `NEXT_PUBLIC_API_URL` in `.env.local` to change the backend and
restart/rebuild the application. This variable is public configuration, never a
secret. Do not put real credentials in `NEXT_PUBLIC_*` variables.

## Try the workflow

1. Use the default **Human buyer / approver** identity. In Marketplace, choose a
   service and send an RFQ with budget, deadline, and measurable acceptance criteria.
   Choose a deadline comfortably in the future, such as two weeks from today.
2. Use **Switch identity → Human seller**. Open Requests for quote, select the
   request, and submit a quote. Its delivery duration must fit before the RFQ
   deadline; its expiration must also be in the future.
3. Switch back to the human buyer. Select the request and review the quote's order
   preview, including its exact scope, price, deadline, acceptance criteria, and terms.
4. Request human approval, approve the snapshot, then commit the order. These are
   separate actions. Approval alone does not place an order.
5. Switch to the seller, open Orders, and submit an HTTPS delivery link and notes.
6. Switch back to the buyer and explicitly accept delivery, or open a dispute.
   Both parties can read recorded dispute reasons on the order.

The **Delegated buyer agent** identity demonstrates restricted agent actions:
it can request approval and commit approved orders but cannot approve a purchase
or accept delivery. All permissions and state transitions are enforced by the
backend, including when callers bypass this UI.

The UI includes service search/filtering, an RFQ inbox and quote review, approval
inbox, order tracking, and organization audit history. It adapts to mobile screens.
It shows API errors and provides refresh/retry controls rather than falling back
to fake successful purchases when the backend is unavailable.

## Demo boundaries

The identity switcher uses public local-demo credentials. Tokens remain in memory
and reset when the page reloads. This is not production login or session handling.
Business verification is simulated. Payment states explicitly say
`simulated_pending` / `simulated_settled`; no funds move. Delivery references are
links, not uploaded files or automatically verified outputs. There is no admin,
payment-provider onboarding, listing editor, or dispute resolution screen yet.

Order attempts retain one idempotency key per organization/preview in browser
session storage, so a manual retry after a lost response reuses the original key.
The backend remains responsible for deduplication and approval consumption.
Other mutations are not automatically retried; refresh to inspect their outcome
after a connection failure before submitting them again.

## Build and verify

```sh
npm run typecheck
npm run build
npx playwright install chromium
npm test
# Or run all three checks:
npm run check
```

Browser tests intercept API requests, so this repository's CI runs independently
of backend source or a running backend. They cover mobile overflow and filtering,
full contract visibility during approval, absence of agent approval controls,
stable idempotency keys after a failed commit, and API unavailability. They do not
replace backend authorization tests. A real browser flow against the local backend
can be followed using the steps above.

If Chromium is already installed, optionally use
`PW_EXECUTABLE_PATH=/usr/bin/google-chrome npm test`. Test reports, traces, and
screenshots are generated under ignored `test-results/` and `playwright-report/`.

`npm run format` formats source/configuration files. Dependency versions are pinned
and recorded in `package-lock.json`. For compiled serving, run `npm run build`
followed by `npm start`; the application still targets the separate demo backend.

# neopact · Agent handoff

Version 1.0 · Hackathon working identity · 10 October 2026

Use this package to keep every contributor’s work recognizably neopact. The user confirmed the name; the visual direction in this package is proposed by the design agent.

## Copy into another agent’s task

```text
Build the requested neopact surface using the supplied neopact-brand-system package.
Read AGENT-HANDOFF.md, tokens/README.md, and COMPONENTS.md before editing. Use BRAND-GUIDE.md
for voice and logo rules, and visual-guide.html for examples. Follow the exact
precedence below. Use canonical SVG assets; never redraw or typeset the logo.
Use Manrope for interface text and IBM Plex Mono only for identifiers or technical
metadata, loading the bundled fonts. Consume the supplied tokens; do not invent
colors, radii, spacing scales, shadows, or semantic states. Preserve the existing
Next.js / React / TypeScript / native CSS stack unless the task says otherwise.
Make buyer/supplier scope, private limits, offer version, agent activity, human
approval, and demo-order status explicit wherever relevant. Lime is a brand
highlight, never a success signal. Use text and icons alongside status color.
Implement only the requested flow and backend-supported permissions. Do not imply
payments, fulfilment, autonomous execution, supplier verification, savings, or
production readiness that has not been verified. Finish by checking responsive
layout, keyboard/focus behavior, readable contrast, empty/error/loading states,
correct commercial values, and the exact scope of any approve action. Report
changed files and checks, and identify any remaining unsupported behavior.
```

## Exact precedence

Resolve conflicting design instructions in this order:

1. Latest explicit user instruction for the task.
2. Product permissions, schemas, and verified backend behavior; a design never grants permission or invents functionality.
3. This file’s identity, accessibility, and handoff invariants.
4. Machine-readable values in `tokens/` and canonical files in `assets/`.
5. `COMPONENTS.md` for component behavior and composition.
6. `BRAND-GUIDE.md` for brand use and writing.
7. `visual-guide.html` and `brand-board.png` as visual examples.

Higher-level system, developer, and repository instructions still apply. A screenshot does not override a token or product rule. If package files disagree, keep the higher-priority source and report the discrepancy; do not silently add a second style system.

## Fixed identity rules

- Brand name: **neopact**, lowercase in the logo and ordinary brand references.
- Main line: **Terms aligned. Business moving.**
- Supporting product line: **Your agents negotiate. Your business decides.** Use this as positioning, not proof that a specific integration is operating.
- Ink `#132F2B`; action `#244B43`; action hover `#183B34`; action active `#102E28`.
- Canvas `#F6F7F2`; paper `#FFFFFF`; muted text `#586963`; border `#D7DFD7`.
- Pact lime `#D9F26F` is a highlight with dark ink text. Never use it to mean approved, safe, successful, or verified.
- Manrope for interface and brand text; IBM Plex Mono for identifiers and technical metadata. Use tabular figures for comparable amounts where available.
- Use the 4px spacing grid. Controls: 6px radius; cards: 12px; hero panels: 16px; status labels: pill.
- Canonical mark: a split N made from two angular, interlocking agreement halves on a 64px grid. Do not alter the geometry.
- Never add gradients, glow, glass effects, new accent colors, decorative AI motifs, or a replacement logo to “improve” the package.

Do not describe this palette as conversion-optimized or proven to outperform alternatives. `PALETTE-RESEARCH.md` separates supporting evidence from hypotheses and defines how to test them.

## Stack and file integration

The current frontend is Next.js 16, React 19, TypeScript, native CSS, and Lucide icons. This package does not require a styling framework or component-library migration.

- Import `tokens/tokens.css` once from the application’s global stylesheet; consume its custom properties in components. Use `tokens/components.css` for the supplied component styles. The machine-readable token reference is `tokens/tokens.json`; see `tokens/README.md` for integration details.
- Serve `assets/fonts/` locally using the project’s existing font-loading approach or `next/font/local`. Manrope is variable; IBM Plex Mono is Regular. Retain the bundled OFL licenses; source details are in `assets/fonts/README.md`. Do not depend on a remote font request during the demo.
- Copy the required logo exports into the project’s public asset directory while preserving filenames. Use SVG for UI; PNG for slides, documents, and other raster-only destinations.
- Use the existing Lucide icon set with consistent stroke and optical sizing. Icons supplement labels for important actions and states.
- Keep design tokens separate from business state. A styling token is not a permission check.
- Use locale-aware display for commercial values; preserve the API’s currency, units, precision, and timestamps. Never recalculate agreed terms from display strings.

All package paths are relative to this folder. The release archive sits alongside it at `../neopact-brand-system.zip`.

## Product scope that agents must preserve

The current Crossroads repositories are the implementation context for neopact. The frontend displays products, requests, negotiation rooms, offers, approvals, orders, and activity. Its current browser writes are login, logout, approval, rejection, and private human negotiation instructions through “Negotiate more.” Catalogue editing, request creation, rule configuration, and agent negotiation actions remain CLI-driven. Sending guidance starts a fresh bounded round, invalidates the prior offer, and clears both approvals; the external agent must be connected to act.

Target customer flows may include request creation, supplier catalogue editing, private-rule controls, agent launch/retry/stop, onboarding, and notifications. Treat these as implementation work, not existing capabilities. A component example in this package does not establish that a target flow is built.

Every implementation must distinguish:

- **Eligibility:** a supplier meets the checked public requirements; this is not supplier verification.
- **Agent activity:** negotiation is running or has produced a proposal; this is not human approval.
- **Agent agreement:** terms are ready for review; no purchase is complete.
- **Human approval:** the named party approves one exact offer version. One party’s approval is not both parties’ approval.
- **Revised or expired offer:** earlier approvals cannot be presented as approval of changed terms.
- **Confirmed demo order:** the application recorded the agreed deal; this does not establish payment or delivery.

Show buyer and supplier approvals separately. Label private limits as visible only to the authorized workspace. Never expose the other party’s private commercial rules or competing suppliers’ conversations. Final permission checks remain on the server.

## Acceptance checks

Before handing off a screen, verify:

1. Canonical assets, bundled fonts, tokens, and correct logo clear space are used.
2. Keyboard navigation, visible focus, labels, and touch targets work; status meaning survives without color.
3. Text remains readable, including secondary text; focus and interactive boundaries are clear. Decorative border tokens alone may not be sufficient for an essential input boundary.
4. Loading, empty, error, expired-session, and disabled states explain what happens next without displaying false success.
5. Narrow layouts preserve prices, dates, versions, and actions; tables have a usable overflow or alternate layout.
6. Offer totals, currency, deposit, delivery, expiry, version, and party approvals match backend data.
7. Demo or simulated behavior is labeled where users make decisions; unsupported actions do not masquerade as working controls.

Do not add new tests merely to mirror CSS values. Use checks appropriate to the behavior actually changed.

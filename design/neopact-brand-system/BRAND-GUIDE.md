# neopact · Brand guide

Version 1.0 · Hackathon working identity · 10 October 2026

**Terms aligned. Business moving.**

neopact is a B2B marketplace concept for businesses negotiating commercial terms through buyer and supplier agents, within private limits and with human approval. The brand should make complex trade feel clear, deliberate, and under control.

## Position and personality

The immediate audience is business buyers, suppliers, and commercial approvers. The current demo uses chairs and office furniture. Keep the brand broad enough for other commercial categories; neither a narrower validated customer profile nor a freight-specific direction has been confirmed.

The personality is composed, precise, and cooperative. Explain what changed, what matters, and what the user can do next. Give terms and decisions more visual weight than agent theatrics.

The main brand line is **“Terms aligned. Business moving.”** The secondary product line is **“Your agents negotiate. Your business decides.”** Use the second line to describe the intended division of responsibility, while labeling actual demo/runtime behavior accurately.

Avoid claims such as “fully autonomous commerce,” “guaranteed savings,” “verified suppliers,” or “instant payment” unless the specific claim has independent product evidence.

## Name and logo

Write **neopact** in lowercase. Use a canonical logo file whenever the name serves as a brand signature; do not substitute typed text for the outlined wordmark.

The mark is a split N: two angular, interlocking agreement halves. It expresses separate interests forming a shared arrangement. The canonical construction uses a 64 × 64 grid, with the visible symbol spanning x=8–56 and y=8–56. Use the exported asset rather than reconstructing that grid in an application.

| Asset | Use |
|---|---|
| `assets/logos/neopact-logo-primary.svg` | Standard horizontal signature on light surfaces |
| `assets/logos/neopact-logo-reversed.svg` | Lime mark and white wordmark on dark surfaces |
| `assets/logos/neopact-logo-mono-dark.svg` | One-color dark reproduction |
| `assets/logos/neopact-logo-mono-light.svg` | One-color light reproduction |
| `assets/logos/neopact-mark-lime.svg` | Standalone brand mark on dark surfaces |
| `assets/logos/neopact-mark-ink.svg` | Standalone mark on light surfaces |
| `assets/logos/neopact-mark-white.svg` | Standalone white mark on dark surfaces |
| `assets/logos/neopact-stacked-primary.svg` | Narrow placements with sufficient vertical space |
| `assets/logos/neopact-wordmark-ink.svg` | Wordmark-only placements on light surfaces |
| `assets/logos/neopact-app-icon.png` | App/avatar square |
| `assets/logos/favicon.svg`, `assets/logos/favicon.ico` | Browser favicon |

Matching raster versions of the SVG signatures are in `assets/logos/png/`. Wordmarks are outlined and have no installed-font dependency.

Maintain clear space of at least **one quarter of the visible mark height** around a signature. At the canonical 64px grid size, the visible mark is 48px tall, so the minimum clear space is 12px. Intrinsic SVG padding is not a substitute for checking the surrounding layout.

Minimum digital sizes: full lockup **140px wide**; standalone mark **24px wide**. The favicon is the sole **16px** exception. Choose the standalone mark where a full signature cannot remain legible.

Keep proportions and colors intact. Do not rotate, stretch, outline, add effects, crop the symbol, place it over visually busy photography, or turn it into a status icon. Lime artwork needs a dark supporting surface; use the ink version on a light surface.

## Color

| Role | Value | Purpose |
|---|---|---|
| Ink | `#132F2B` | Main text, dark surfaces, logo |
| Action | `#244B43` | Primary controls and active navigation |
| Action hover | `#183B34` | Hover feedback |
| Action active | `#102E28` | Pressed feedback |
| Canvas | `#F6F7F2` | Application/page background |
| Paper | `#FFFFFF` | Reading and working surfaces |
| Muted | `#586963` | Supporting readable text |
| Border | `#D7DFD7` | Subtle dividers and decorative boundaries |
| Pact lime | `#D9F26F` | Selected brand highlights with dark ink text |

Use light surfaces for sustained reading and dense procurement work. Dark ink surfaces create emphasis in introductions or brand moments. Lime is a restrained identifier, not a default fill for every action.

**Lime never means success, approval, safety, or verification.** Use the semantic state tokens in `tokens/` for information, attention, success, and errors. Do not create additional status colors. Every status includes a readable label; add an icon where it improves recognition. Distinguish “Awaiting buyer approval,” “Awaiting supplier approval,” and “Both parties approved” with explicit text.

Check the resulting foreground/background pair when using a token. A low-contrast decorative border is not automatically suitable as the only visible boundary of a form control. Never lower text opacity just to make a screen feel quieter.

The palette is an evidence-informed starting point, not a proven conversion winner. See [`PALETTE-RESEARCH.md`](PALETTE-RESEARCH.md) for sources, limits, measured contrast, and a test plan.

## Typography, spacing, and shape

Use **Manrope** for headings, body text, navigation, labels, and controls. Use **IBM Plex Mono** sparingly for identifiers, versions, and technical metadata. The bundled fonts are Manrope Variable and IBM Plex Mono Regular; retain their OFL licenses. `assets/fonts/README.md` records official Google Fonts repository sources. Typography sizes, weights, and line heights come from `tokens/tokens.css` and `tokens/tokens.json`.

The canonical outlined wordmark was drawn from Manrope at weight 650 with −1.5% tracking. This describes its source; use the exported paths rather than reproducing it as live type.

Use sentence case for interface text. Keep headings short and distinguishable. Monetary values and comparable quantities should align predictably, using tabular figures where available. Monospace is not required for every number.

Spacing follows a **4px grid**. The standard corner radii are **6px for controls**, **12px for cards**, **16px for hero panels**, and **pill for statuses**. Keep large work surfaces simple; avoid nested cards that make a dense task harder to scan.

Respect the hierarchy of the task: page purpose, decision context, commercial terms, then supporting activity. Comparison tables, clear field groups, and consistent alignment should carry the interface. Use the component specifications in `COMPONENTS.md`.

## Imagery and icons

Use real, relevant product imagery with neutral backgrounds and consistent crops. Let users inspect a product without distorting its dimensions or obscuring details. Keep speculative marketing imagery separate from product evidence.

The existing application uses Lucide icons. Use that family consistently, accompanied by labels for important actions. Avoid robots, glowing brains, floating chrome objects, decorative network diagrams, and unrelated imagery that competes with the commercial task.

## Voice and interface copy

Write as a capable commercial colleague. Prefer direct verbs and concrete consequences. Explain the next action, without implying that the system can make a decision reserved for a person.

| Use | Avoid |
|---|---|
| “Review offer” | “Unlock your perfect deal” |
| “Approve offer v3” | “Make it happen” |
| “Awaiting supplier approval” | “Deal done” after one approval |
| “Budget exceeded by €240” | “This offer isn’t a fit” without a reason |
| “Your budget is private to your workspace” | “Complete privacy guaranteed” |
| “Offer expired. Request updated terms.” | “Something went wrong” |
| “Demo order confirmed” | “Payment complete” when no payment occurred |

Use realistic but clearly fictional example businesses. Commercial examples should include currency, quantity, delivery terms, deposit, expiry, and version when those affect the decision. Never invent social proof, customer names, certifications, savings percentages, or integration capabilities.

## Product truth and approval language

The agents can negotiate or produce a proposed agreement. Humans review the exact terms. Both businesses must approve the same version before the implemented order step. Updated terms require fresh review; an older approval cannot imply consent to a new offer.

Permissions and approvals are separate: a role may permit an action, while approval records consent to one offer. Visual access to a control never grants server permission.

Current demo orders do not process payment or fulfil delivery. The frontend primarily reviews backend records and supports browser login/logout, approval/rejection, and private human negotiation instructions through “Negotiate more.” Sending guidance starts a fresh bounded negotiation round, invalidates the previous offer, and clears both approvals; existing rules still apply, and the external agent must be connected to act on the instruction. Catalogue editing, request creation, rule configuration, and direct agent negotiation actions remain CLI-driven.

## Provenance

The user confirmed **neopact** as the name. This visual system is an assistant-proposed version 1 identity for the hackathon. Name and mark availability have not been assessed.

Product context is based on the reviewed frontend source and linked project repositories. These links identify the implementation context; the design package is not a fresh audit of every repository change:

- Current frontend: [crossroads-frontend](https://github.com/iivko/crossroads-frontend)
- Current backend: [crossroads-backend](https://github.com/iivko/crossroads-backend)
- Current agent CLI: [crossroads-cli](https://github.com/iivko/crossroads-cli)
- Earlier separate prototype: [agent-market](https://github.com/Sashe-Bashe/agent-market)

The earlier prototype’s completed workflows must not be presented as capabilities of the current repositories without verification. Freight and group purchasing were discussion hypotheses, not confirmed brand scope.

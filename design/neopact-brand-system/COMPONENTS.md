# Neopact component contract

Version 1.0.0 · Product: B2B agent procurement marketplace · Default theme: light

Read this with `BRAND-GUIDE.md` and `tokens/README.md`. This file specifies presentation and expected behavior for implementers; the CSS is a reference skin, not authorization or negotiation logic. Use lowercase **neopact** in the wordmark. Product copy may use **Neopact** in sentences. All chair names, prices, suppliers, RFQs and transaction outcomes in examples are **demo fixtures**, never evidence of actual trading.

## Implementation boundary

The handoff targets the current Next.js 16, React 19, TypeScript, plain CSS and Lucide stack. The frontend supports browser login/logout, approval/rejection, and private human negotiation instructions through “Negotiate more.” Catalogue editing, request creation, rule configuration, and agent negotiation actions remain CLI-driven. The components below include intended presentation patterns for future work; their existence in this guide or CSS does not mean every workflow is implemented. Do not invent a working endpoint or claim a successful write in a visual prototype.

## Foundations

- Use Manrope, with Arial and sans-serif fallbacks. Use IBM Plex Mono for IDs, versions and numeric emphasis, with monospace fallback. Do not make whole tables monospaced. Use tabular figures and explicit currency codes for prices.
- Type sizes: 12, 14, 16, 20, 24, 32, 48, 64px. Body 16/24, UI 14/19.6, metadata 12/16.8. Heading line height 1.2; display 1.1. Use 500–700 weights in the product. Reserve 64px for large brand messages.
- Spacing uses a 4px grid. Default control height 44px; compact dense desktop controls 36px only with sufficient separation. Form input text stays 16px. Lucide icons normally 16 or 20px; icon button target 44px.
- Corner radii: controls 6px, cards 12px, brand hero panels 16px. Pills are for static status badges. Circular timeline dots and spinners are glyphs, not container styling.
- Light canvas `#F6F7F2`, white cards, evergreen text. Evergreen fills mean an available primary action. Pact lime `#D9F26F` means brand emphasis, always with ink text; it never means approved, safe or successful. Use no gradients in the core system.
- Decorative dividers may use `#D7DFD7`. Controls and boundaries essential to recognition use `#788A81` or darker. A decorative divider alone must never communicate a state.
- Dark evergreen panels are for brand and summaries. Keep dense forms, negotiation and approvals on light surfaces. Use lime or white for actions inside dark brand panels; evergreen on evergreen is not a usable boundary.

## Buttons and links

Use native `<button>` for actions and `<a href>` for navigation. Labels name the action and object: **Create RFQ**, **Review offer v3**, **Approve offer v3**, **Request revision**. Avoid vague **Continue** when a commitment is being made.

| Variant | Default | Hover / active | Use |
|---|---|---|---|
| Primary | White on evergreen `#244B43` | `#183B34` / `#102E28` | One leading action in a region |
| Secondary | Evergreen on white, strong border | Subtle neutral / decorative border-color fill | Alternatives, back, edit |
| Quiet | Evergreen text, transparent | Subtle neutral / decorative border-color fill | Low priority utility |
| Danger | White on `#A43131` | `#882626` / `#882626` | Destructive operation with explicit object |
| Highlight | Ink on Pact lime | White / canvas | Sparse brand-panel CTA; not approval status |

All variants: visible 2px focus outline with 3px offset; disabled shows muted text on neutral fill without lowering opacity; loading retains width and visible verb such as **Submitting approval…**, sets `aria-busy="true"`, and blocks duplicate submissions in application code. Never put a spinner in place of the accessible name. `aria-disabled` needs event suppression in code; CSS alone does not disable a control. Use native `disabled` when the action is truly unavailable; explain why in adjacent text. Do not use tooltips as the only explanation.

Icon buttons need a specific accessible name (**Open offer actions for Northline**, not **More**). Space activates a button; Enter activates buttons and links. Links remain underlined in prose. Do not make disabled links imitate disabled buttons. A selected toggle needs `aria-pressed`; a button hover is not selection.

## Form controls

Use a persistent `<label>` associated by `for`/`id`. Put units and currencies in visible labels (**Maximum landed cost (EUR)**). Text inputs, selects and textareas use white fill, 1px strong border and 6px radius. Labels 14px bold; values 16px. Placeholder text is an example only, never the label. Preserve native select and date input affordances unless replacing their full keyboard behavior.

| State | Visual | Semantics / behavior |
|---|---|---|
| Default | Strong border | Persistent label and optional helper via `aria-describedby` |
| Hover | Evergreen border | No layout or value change |
| Focus | Visible evergreen ring | Retain normal border; avoid clipping in containers |
| Invalid | Red border and inline error | `aria-invalid="true"`; link the error ID; describe a correction |
| Disabled | Neutral fill, readable muted text | Native `disabled`; explain dependency visibly |
| Read-only | Canvas fill, text retained | Native `readonly`; selectable/copyable; say **Read only** if context is unclear |
| Required | **(required)** in label | Native `required`; asterisk is not the sole indicator |

Validate after blur or submit, not on every keystroke. On failed submit focus an error summary with links to invalid fields, then preserve all entered data. Example error: **Enter a maximum cost greater than 0 EUR.** Errors must not erase helper text about privacy. Checkbox/radio labels have 44px minimum interactive height, standard keyboard behavior and a programmatic group label through `fieldset`/`legend`. Numeric fields need explicit decimal and currency rules; never silently convert currencies.

## RFQ list and RFQ cards

Purpose: help a buyer scan purchase requests and sellers identify relevant opportunities. Required data: RFQ title, request ID, requested quantity and unit, category, delivery destination at authorized granularity, requested delivery date, status, offer count and last update. Show currency assumptions only when known. Never expose a buyer's private reservation ceiling in public RFQ detail, list, search snippet or card.

Use a semantic table for aligned desktop data; title is the primary link, with secondary actions separate. Do not nest buttons inside an all-clickable card. On narrow screens display labeled cards in the same information order. Selected rows show a checkbox and visible selected treatment, never only a tinted background. Sorting uses buttons in column headers and `aria-sort`; filters retain visible labels and a clear-all action. Empty state: **No RFQs yet** plus **Create RFQ**. No-results state: show active filters and **Clear filters**. Loading has a short status message and neutral static skeletons. Fetch failure states allow **Try again** without deleting prior results.

## Offer comparison

Use offers as columns and criteria as rows when comparing 2–4 offers. For larger sets start with a sortable list, then let users select offers to compare. All compared offers must relate to the same RFQ and show their version.

Required criteria: supplier, offer ID and version, unit price, quantity, minimum order quantity (MOQ), **landed cost** with currency and its freight/tax/duty breakdown or stated exclusions, lead time, delivery destination and terms, warranty, source/provenance with retrieval timestamp, and expiry date/time with zone. Where the agent has inferred a value, show **Estimated** and its basis. Missing data displays **Not provided**, never zero. A landed cost with exclusions must not be labeled **All-in**.

Show a **Demo fixture** marker in any fabricated comparison. A chair example can read **72 task chairs · Demo fixture**; do not present an invented vendor as verified. Explain recommendations using explicit criteria (**Lowest stated landed cost; delivery 5 days later**). Highlight the selected offer using an evergreen border and **Selected for review** text; never declare **Best** without a disclosed method. Do not use lime to imply commercial superiority or approval.

Keep row headers visible when feasible. On mobile retain semantic table headers inside a clearly labeled horizontally scrollable region, with a visible scroll cue, or provide complete offer cards with every label. A scrollable region needs a programmatic name and keyboard access if scrolling requires it. Do not hide warranty or cost assumptions to fit the viewport. Prices align to the right; text aligns to the start.

## Negotiation timeline

Use an ordered list. Every event shows actor (**Buyer agent**, **Seller agent**, **Buyer human**, **Seller human**), action, timestamp with zone, offer version and a concise change summary. Role and organization are visible text, not color alone. Distinguish agent-proposed terms from human-approved terms. Agent messages use a neutral treatment; human approvals use a named approval event. Users can open the complete relevant offer from each version event.

A revision event states what changed (**v3: quantity 72 → 80; expiry extended to 17:00 EEST**) and that earlier approvals no longer apply. Do not rewrite history when a new offer arrives. Announce new events through a polite live region without moving focus or force-scrolling users who are reviewing older events. Group historical events only behind an accessible **Show 6 earlier events** button. A paused or failed agent run gets a visible reason and a retry route if supported; never imply ongoing work when the run has stopped.

## Human approval panel

This is the highest-trust component. It must show the complete offer identity, **Offer v3**, material commercial terms, expiry, links to full terms and the two distinct parties. Keep both rows visible, for example:

- **Buyer approved · offer v3 · 14:32 EEST · buyer human**
- **Seller pending · offer v3**

Approval actions must bind to the exact offer version shown and the authorized human's party. Button: **Approve offer v3**. Supporting text states the immediate effect in plain language: **Your approval applies to this version. Both parties must approve the same unexpired version.** Buyer and seller agents may propose and negotiate; they cannot impersonate the two human approvals. The interface must not expose an approval control for the other party.

| Condition | Required presentation / behavior |
|---|---|
| Both pending | Two independent pending labels and one authorized party action |
| One approved | Show who approved which version; other party remains pending |
| Both approved, same valid version | **Agreement approved · v3** with both named approval records |
| Offer revised | **New offer v4 — approvals required again.** Current approvals reset; v3 approvals remain only in history |
| Offer expired | **Expired — request a new offer.** Approval unavailable; show exact expiry |
| Version changed during approval | Reject stale approval; show **Offer updated to v4. Review changes before approving.** |
| Unauthorized viewer | Show permitted status only; no usable approval action |
| Submission failure | Preserve reviewed terms and show the failure; do not optimistically mark approved |

Recheck version, expiry and permissions server-side when accepting approval. A pair of green badges is not an authorization mechanism. Prevent an approval action from accidentally submitting an older snapshot. Subsequent approval withdrawal, if supported by the product, must be a distinct recorded event and follow its actual backend rules.

**Completion does not imply payment.** Say **Both parties approved offer v3. Payment has not been processed.** Do not use **Paid**, **Purchased**, **Order placed**, or **Funds secured** unless a real system has separately confirmed that specific event. Keep any downstream payment or order step explicitly separate.

## Private reservation limits

Use the outlined private field with a lock icon and visible **Private · buyer side only** or **Private · seller side only** label. Buyer maximum and seller minimum belong in their own authorized workspace. Helper: **Used by your agent to evaluate offers. Never included in shared terms.** Show units, currency, saved state and an explicit edit action. A masked display must have a labeled **Show private limit** control and announce its state.

Privacy is enforced in data access, agent context, logs and APIs, not by CSS, masking or a lock symbol. Never send the other party's private limit to the browser; never copy it into shared chat, the comparison, exported offer terms, approval summaries or public analytics. Do not expose private bounds through suggested counteroffer copy. Screenshots and demo fixtures must use labeled invented limits. A role switch must not retain another party's private fields in client state or cached views.

## Global interaction and accessibility

Target WCAG 2.2 AA. Body text is at least 4.5:1; essential UI graphics, focus and control boundaries at least 3:1 on adjacent surfaces. Every status includes text; errors add explicit descriptions. Decorative icons are `aria-hidden`; meaningful standalone icons have accessible names. Heading levels reflect document structure. Landmarks include main and labeled navigation; use `aria-current="page"` for the active page.

Maintain DOM and focus order that matches visual order. All functions work with a keyboard; no hover-only actions. Menus support Escape and return focus to the trigger; dialogs have a name, a focus trap and focus restoration. Confirmations repeat the specific object/version. Long descriptions and private content do not belong in tooltips. Live status uses `role="status"`; blocking async errors may use `role="alert"` once, without repeated announcements.

Use 44px default controls and comfortable gaps. At 200% zoom preserve text and functionality. At 320 CSS px the page reflows without horizontal scrolling except the explicitly labeled comparison table. Small screen cards stack, approval party rows stack, and action groups wrap. Never hide one approval party or a material offer term at a breakpoint. Dense tables may retain a local horizontal scroller, with surrounding content reflowed.

Use 120ms hover and 180ms local state transitions; no ornamental loops or scroll-driven motion. Under `prefers-reduced-motion: reduce`, transitions and animations are removed; loading remains understandable through text. Honor forced colors with visible boundaries and outlines. Focus rings must remain visible on dark brand panels, where the ring changes to lime. Shadows are optional overlays only; do not use shadows to replace borders.

## Contrast verified from sRGB values

Calculated using WCAG relative luminance: convert each sRGB channel to linear (`c/12.92` for `c ≤ 0.04045`, otherwise `((c+0.055)/1.055)^2.4`), luminance `0.2126R + 0.7152G + 0.0722B`, ratio `(Llighter+0.05)/(Ldarker+0.05)`. Ratios below are rounded to two decimals; the calculation script preserves six decimals.

| Foreground / background | Ratio | Intended use |
|---|---:|---|
| Ink `#132F2B` / white | 14.29:1 | Primary text |
| Ink / canvas `#F6F7F2` | 13.28:1 | Main text |
| Muted `#586963` / white | 5.81:1 | Secondary text |
| Muted / canvas | 5.39:1 | Secondary text |
| White / action `#244B43` | 9.71:1 | Primary button |
| White / action hover `#183B34` | 12.25:1 | Hover button |
| White / action active `#102E28` | 14.55:1 | Pressed button |
| Ink / lime `#D9F26F` | 11.49:1 | Brand highlight |
| Strong border `#788A81` / white | 3.65:1 | Input boundaries |
| Strong border / canvas | 3.39:1 | Essential UI boundaries |
| Success `#1E563C` / `#E8F3EB` | 7.53:1 | Approved status |
| Pending `#78501A` / `#FFF1D6` | 6.35:1 | Awaiting action |
| Danger `#A43131` / `#FDEDED` | 6.05:1 | Error / rejection |
| Information `#235C88` / `#EAF2FA` | 6.28:1 | Information / demo label |
| Expired `#586963` / `#EEF1EC` | 5.10:1 | Expired / disabled text |
| Decorative line `#D7DFD7` / white | 1.36:1 | Decoration only; fails essential boundary minimum |
| Lime / white | 1.24:1 | Do not use as small text, focus or an essential icon on white |

Run `python3 tokens/contrast.py` to reproduce the measured pairs. These color calculations do not certify a finished application; inspect real focus, keyboard flow, states and rendered content before shipping.

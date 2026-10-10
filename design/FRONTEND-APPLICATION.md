# Applying neopact to the human workspace

This is an extension of the merged brand system, not a replacement identity. Scope: existing sign-in, dashboard, product evidence, negotiations, approvals and private guidance. Mode: Operate; sign-in also explains the product.

## Direction contract

THESIS: Make agent work legible to the business, with each summary leading to a real decision or record. Avoid decorative performance charts without underlying data.

OWN-WORLD: Inherit the merged neopact kit: Manrope, canonical SVGs, warm canvas, white working surfaces, evergreen controls and sparse lime brand emphasis. The business workspace remains light for reading detailed terms.

STORY: See what needs attention, inspect agent work, review exact terms, then make a deliberate decision. Private guidance stays separate from shared conversation; demo values and snapshot limits are explicit.

FIRST VIEWPORT: The existing sidebar frames a clear title and four clickable metrics. A current-state distribution and recent negotiation drilldowns follow. The review metric carries the strongest evergreen emphasis. Sign-in retains its split composition with the approved brand statement, workflow explanation and one primary sign-in action.

FORM: Inherited-direction exception. The user's confirmed request applies an already merged brand kit throughout the existing frontend and adds a local metrics section. `reference/new-work.md` section 3, “Extend an existing surface,” says to inherit world and composition without a concept tournament. No new visual world or whole new page was selected, and no concept seed or roll was run. This is recorded as an inherited extension, not fabricated seed provenance.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Quality bar

Quality bar: readable 14px working text and 12px metadata, 16px fields, 44px main controls, labeled semantic statuses, strong focus treatment, usable 390px layouts, local fonts, no external asset requests. Keep quantity, terms, exact versions, private/shared boundaries and both approval states intact.

## Research and implementation decisions

Research checked 10 October 2026. This is evidence-informed design, not measured conversion improvement.

- [SAP overview pages](https://help.sap.com/docs/abap_platform_new/468a97775123488ab3345a0c48cadd8f/c64ef8c6c65d4effbfd512e9c9aa5044.html) connect a business summary to actionable underlying records. Application: metric buttons and negotiation drilldowns, with a distinct role for each section.
- [SAP overview cards](https://www.sap.com/design-system/fiori-design-web/v1-108/page-types/floorplans/overview-page-ovp/overview-page-card) emphasize pertinent data, progressive disclosure and avoiding duplicated information. Application: state distribution next to a compact record list, followed by the existing review table.
- [NN/g: Visibility of System Status](https://www.nngroup.com/articles/visibility-system-status/) explains how feedback reduces uncertainty and lets people steer a workflow. Application: show the last successful refresh and a stale snapshot warning on failure; describe the backend's actual agent-turn state.
- [Shopify analytics overview](https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/overview-dashboard) demonstrates explicit metric scope and freshness. Application: label the current 100-record limit and demo order values. This is a design inference, not a claim that neopact has Shopify's reporting capabilities.

## Backend mapping

| Visible signal | Source and meaning |
| --- | --- |
| Active negotiations | Rooms in `negotiating` or `needs_revision` |
| Needs your review | Approval-stage rooms whose current offer has no approval from this workspace; inspect validity before authorizing |
| Demo orders / agreed value | Loaded order records and `offer.terms.total`, in EUR cents; no payment processed |
| Turn claimed | An active agent-turn lease; never a connection-health claim |
| Waiting for agent | Active negotiation with no current claim; never an offline assertion |
| Human review | `awaiting_approval`; display own vs counterparty approval status from approval records |
| Last updated | Client time of the last complete successful workspace refresh |

Closed rooms must not produce agent work alerts. Ordered rooms can become invalid after inventory allocation; that must not turn a completed order into an outstanding decision. Do not sum competing offers as pipeline revenue, infer durations from request creation, or expose the other business's private brief.

## Validation and measurement

The existing API, private guidance and conversation suites protect backend semantics. Added UI coverage checks brand identity, own-approval counts, bounded snapshot labels and sync failure/recovery. Visual review covers desktop and mobile login, overview and negotiation details using labeled synthetic fixtures.

After deployment, assess time to identify a waiting decision, successful sign-in, review completion, navigation errors and accidental approval attempts. Establish a baseline before comparing designs. Color alone does not establish conversion lift.

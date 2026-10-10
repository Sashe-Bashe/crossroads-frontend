# neopact

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Business buyers and sellers use the workspace to see agent negotiations, review product evidence and exact commercial terms, and decide whether to approve. The user requested a business-facing view of backend activity as part of applying the shared brand throughout the frontend.

## Product Purpose

Make agent-mediated B2B negotiations legible and keep the final purchasing decision with authorized people at both businesses.

## Capabilities and Constraints

Next.js, React, TypeScript, native CSS and Lucide. The existing dashboard has seven views, cookie authentication, workspace isolation, shared conversations, private needs and instructions, exact-offer approval and immutable demo orders. Catalogue and request creation remain CLI operations. Agent models run outside the dashboard.

The current backend records negotiation state, agent turn claims, proposals, human approval, needs evidence and audit events. A claim is a time-limited lease, not agent connection health. Both businesses must approve the same offer. Orders are demo records, not processed payments or fulfilment.

The current frontend loads up to 100 records per list; summary counts describe that snapshot. Never represent partial data as all-time totals. No supported backend metrics establish revenue, conversion, savings, uptime or agent connectivity.

## Brand Commitments

The shared neopact kit in `design/neopact-brand-system` is the established visual authority. Use its supplied logos, fonts and semantic tokens. Product name: neopact. Primary line: “Terms aligned. Business moving.” Supporting line: “Your agents negotiate. Your business decides.”

## Evidence on Hand

Latest inspected frontend: `7dadea27bf6b09d12e01d9900e7a73ef6a15377c`; backend: `130e5b8e3fa5c2298beb8db4346c64d70f9a7f56`, checked against GitHub on 10 October 2026. Existing mocked buyer/seller fixtures enable safe visual and behavioral testing. Preview data must be labeled synthetic.

## Product Principles

- Every summary should lead to the relevant decision or underlying record.
- Distinguish agent work, human review and confirmed demo orders.
- Preserve the boundary between shared terms and private business instructions.
- Explain stale data and limited scope rather than implying a live, complete picture.
- Visual improvements are conversion hypotheses until evaluated with real users.

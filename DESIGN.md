---
name: "neopact"
description: "The inherited neopact identity as implemented in the business workspace."
colors:
  canvas: "#F6F7F2"
  surface: "#FFFFFF"
  ink: "#132F2B"
  text: "#132F2B"
  text-muted: "#586963"
  text-inverse: "#FFFFFF"
  border: "#D7DFD7"
  border-control: "#788A81"
  action: "#244B43"
  action-hover: "#183B34"
  action-active: "#102E28"
  on-action: "#FFFFFF"
  highlight: "#D9F26F"
  on-highlight: "#132F2B"
  surface-subtle: "#EEF1EC"
  focus: "#244B43"
  success: "#1E563C"
  success-bg: "#E8F3EB"
  pending: "#78501A"
  pending-bg: "#FFF1D6"
  danger: "#A43131"
  danger-bg: "#FDEDED"
  info: "#235C88"
  info-bg: "#EAF2FA"
  expired: "#586963"
  expired-bg: "#EEF1EC"
  disabled: "#586963"
  disabled-bg: "#EEF1EC"
typography:
  display:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "clamp(40px, 4.25vw, 64px)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  working:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.5
  label:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
  technical:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  control: "6px"
  card: "12px"
  hero: "16px"
  pill: "999px"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.25rem"
  "6": "1.5rem"
  "8": "2rem"
  "10": "2.5rem"
  "12": "3rem"
  "16": "4rem"
components:
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "0.75rem 1rem"
  button-primary-hover:
    backgroundColor: "{colors.action-hover}"
  button-primary-active:
    backgroundColor: "{colors.action-active}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "0.75rem 1rem"
  button-text:
    textColor: "{colors.action}"
    padding: "0.25rem 0"
  button-icon:
    rounded: "{rounded.control}"
    size: "2.75rem"
    padding: "0.25rem"
  input-login:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "12px 16px"
  navigation:
    textColor: "{colors.text-muted}"
    rounded: "{rounded.control}"
    padding: "0.75rem"
  navigation-active:
    backgroundColor: "{colors.action}"
    textColor: "{colors.on-action}"
  badge-pending:
    backgroundColor: "{colors.pending-bg}"
    textColor: "{colors.pending}"
    rounded: "{rounded.pill}"
    padding: "0.25rem 0.5rem"
    typography: "{typography.label}"
  metric:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text}"
    rounded: "0"
    padding: "1.25rem 1.5rem"
  snapshot:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
---

# Design System: neopact

## Overview

**Creative North Star: "Terms aligned. Business moving."**

The inherited neopact system is composed, precise and cooperative. Warm canvas, white working surfaces and evergreen actions keep commercial terms readable; dark ink and sparse lime distinguish the brand introduction. The workspace gives commercial decisions priority through layout and restrained emphasis.

This document records the frontend extension, not a replacement visual world. Its authority remains the supplied brand kit and its precedence contract. It describes implemented patterns only; reference-kit examples do not establish application capabilities.

Evidence: `app/globals.css`, `app/login.css`, `app/workspace-pulse.css`, `app/layout.tsx`, `components/brand.tsx`, `components/workspace-pulse.tsx` and sampled dashboard markup. The inherited direction is recorded in `design/FRONTEND-APPLICATION.md`; durable brand constraints come from `PRODUCT.md` and `design/neopact-brand-system/AGENT-HANDOFF.md`. The kit's `tokens/tokens.json` remains the token source; this frontmatter is the implemented subset, not a second editable token authority.

**Key Characteristics:**
- Light surfaces for sustained business work.
- Locally loaded Manrope with restrained technical monospace.
- Canonical SVG identity, semantic status labels and deliberate human decisions.

## Colors

Warm neutrals support sustained reading; evergreen gives controls weight without turning the entire application dark.

### Primary
- **Evergreen action:** primary buttons, active navigation and snapshot actions; hover and active tokens supply feedback.
- **Ink:** main text and sign-in brand panel. The review metric uses action-colored text on the subtle neutral surface.

### Secondary
- **Pact lime:** selected words and canonical reversed brand artwork on the dark introduction, plus text selection with ink foreground.
- **Semantic states:** amber for pending review or revision, green for recorded demo orders, red for declined/error states, blue for information, muted neutral for expired/closed states. Status meaning always survives without hue.

### Neutral
- **Canvas:** page and inset distribution surface.
- **Surface:** white fields, cards and reading regions.
- **Surface subtle:** quiet utility fills and disabled backgrounds.
- **Muted text:** secondary readable detail.
- **Border:** dividers and passive boundaries. **Control border:** stronger field and secondary-button boundaries.

**The Lime Is Brand Rule.** Lime marks brand emphasis, never success, approval, safety or verification.

## Typography

**Display and body font:** Manrope, Arial, sans-serif. **Technical font:** IBM Plex Mono, monospace. `next/font/local` loads the bundled variable Manrope and regular Plex Mono, exposing `--font-manrope` and `--font-ibm-plex-mono`; application rules place these before the kit fallback stacks.

The type is compact and deliberate. The frontmatter records the sign-in display, default page headline, default section title, body, working row title, label and technical roles. Contextual section titles in the snapshot use semibold rather than the global bold. Other implemented steps include 16px subheads, 24px modal/product emphasis and 32px metric values with tabular numerals. Paragraphs can use 1.6 line height; interface rows use 1.4–1.5. Comparable amounts use tabular figures without turning the table into monospace.

The sign-in display contracts to `clamp(32px, 8.2vw, 48px)` on mobile; its authored line breaks remain visible. The form title uses `clamp(28px, 2.7vw, 40px)` and becomes 28px on mobile. These are sign-in composition treatments, not additional global type steps.

**The Working Text Rule.** Keep working text readable, use the metadata role for secondary detail, and preserve 16px field text.

## Layout

Spacing follows the inherited 4px rhythm; frontmatter includes only steps consumed by the application. The desktop shell has a fixed 240px sidebar, a 64px topbar and a content area capped at 1600px, with 32px top and 40px horizontal padding. At 1150px content padding becomes 32px/24px. At 760px navigation becomes a drawer and content padding becomes 24px/16px; the compact topbar uses the canonical 32px standalone mark. Below 400px the topbar utilities wrap; below 359px metrics become one column.

Metrics form a single open band with shared dividers: four columns, then two at 1150px. The offers awaiting approval table immediately follows. The supporting snapshot pairs a 0.7fr distribution with a 1.3fr record list; at 1050px it stacks and its legend becomes two columns. At 520px the legend returns to one column. Snapshot regions use 16px padding. Recent records pair title/supplier with status/next step on desktop, then stack these groups at 520px. Product cards shift to two columns at 1150px and one at 760px. Tables retain their scrollable reading regions.

Sign-in uses a dark/light split of 1.08fr to 1fr, then a vertical composition at 760px; the form is capped at 400px. Its workflow list and footer are suppressed on mobile while the core proposition and form remain.

## Elevation & Depth

Work surfaces are flat, distinguished by light fills and thin dividers. Dialogs use the inherited popover shadow (`0 8px 24px rgb(19 47 43 / 0.12)`) over a 48% ink backdrop. Do not promote this shadow to ordinary cards.

**The Flat Working Surfaces Rule.** Use borders and tonal separation for work surfaces; reserve the existing soft shadow for dialogs.

## Shapes

Controls have restrained corners; cards are softer and dialogs use the hero radius. Static status badges and legend dots use the pill token. These exact values are in frontmatter. Canonical angular logo geometry is an asset, not a shape recipe to redraw. Application signatures render at 160px, with the sign-in desktop signature at 185px. Preserve the kit minimum full lockup width of 140px, standalone mark width of 24px and clear space of at least one quarter of the visible mark height; only the favicon has a 16px exception.

## Components

### Buttons

Solid primary actions use evergreen and white; secondary actions use a strong border and white fill, shifting to subtle neutral on hover. Primary pressed feedback uses the action-active token. Buttons have a 44px minimum target, 14px bold text, 12px/16px padding and a 120ms transition. Text actions are semibold evergreen and underline on hover. Icon-only controls retain 44px targets and accessible labels. The quiet Refresh action shares the heading row; its text is hidden at the mobile breakpoint while the icon and accessible name remain. Disabled buttons use full-opacity muted text and neutral fill. Sign-in deliberately uses 52px minimum controls.

### Inputs / Fields

Fields use white, a strong one-pixel border, control radius and 16px text. Sign-in fields have 12px/16px padding; labels are persistent 14px semibold. Search puts the boundary around the full field group and uses `:focus-within`. Keyboard focus is a two-pixel evergreen outline offset by three pixels.

### Navigation

Sidebar items use 14px semibold text, 12px padding and 44px minimum height. Quiet items hover on subtle neutral; selected items use white on evergreen. The mobile drawer preserves this hierarchy and uses a dim ink backdrop. Selection and status counts remain readable labels.

### Status badges

Static badges pair semantic foreground and tint tokens with 12px semibold text, 4px/8px padding and pill corners. Pending review and revision share amber; negotiating/published share information blue; ordered/demo-confirmed share success green. Expired remains neutral. They are not controls.

### Cards / Containers

Metric buttons sit in one open strip, divided by shared one-pixel rules and no individual radius. Desktop padding is 20px/24px, with aligned outer edges; compact layouts use 16px. The review metric has subtle-neutral fill and semibold/bold action-colored text. Arrow affordances lead to the matching view. Comparable numbers use tabular figures. The snapshot remains one bordered container with a canvas distribution inset and white recent-record region. Its 8px segmented bar supports the exact count list.

### Negotiation snapshot

The segmented bar is backed by a labeled count list, so its color is supplementary. Recent negotiation records present the primary title, supporting supplier/detail, status and next-step copy in a consistent hierarchy. Whole record buttons lead to the source record; text actions lead to related views. Empty state copy retains the same hierarchy. Scope and refresh metadata remain visible because these are loaded-record snapshots, not all-time analytics.

### Commercial tables

Amounts, quantities and percentages use explicit numeric column classes, aligned right with tabular figures. Request identity can wrap within 200–320px; supplier metadata remains secondary. Rows use 16px vertical padding and retain visible actions. The overview uses a primary Review button, while list views use quiet row actions. The negotiation table is a keyboard-focusable scroll region; its action column stays available during horizontal scrolling. On mobile, the identity cell repeats the exact current total, deposit percentage and delivery date so terms are visible before scrolling. This duplicate summary is hidden from assistive technology; the original labeled table columns remain accessible.

### Brand and assets

`Brand` selects the canonical primary or reversed SVG. The light mobile topbar uses the canonical ink mark. Lucide supplies interface icons. Public brand assets are copies of the inherited kit; `public/brand/apple-touch-icon.png` is the sole shipping brand raster and has its canonical visual source in `design/neopact-brand-system/assets/logos/apple-touch-icon.png` at upstream commit `7dadea27bf6b09d12e01d9900e7a73ef6a15377c`. Impeccable provenance metadata was embedded after copying; no image generation or visual modification was performed. The favicon remains SVG. Kit source assets and font licenses remain intact.

### Motion and accessibility

Navigation transforms use 180ms; button, navigation and metric feedback use 120ms with the inherited standard easing. The reduced-motion query removes animation and transition. Forced colors adds explicit borders and system highlight focus/selection affordances. These behaviors belong to the reusable system.

## Do's and Don'ts

### Do:
- **Do** consume the existing semantic CSS variables and preserve local font loading.
- **Do** use canonical SVG signatures with their proportions and surrounding clear space intact.
- **Do** show readable status text alongside color and retain distinct party approval states.
- **Do** keep supplier and supporting metadata below the primary product title.
- **Do** preserve visible focus, readable disabled text, reduced motion and forced-color affordances.

### Don't:
- **Don't** use lime as an approval or success signal.
- **Don't** redraw, retype, stretch or add effects to the logo.
- **Don't** introduce gradients, glow, glass, decorative AI motifs or new accent colors.
- **Don't** turn backend turn claims into agent connection-health indicators or treat demo orders as payment.

Not canonized: dormant legacy eyebrow rules in the global stylesheet are not a reusable typography role. Incidental sign-in measurements outside the 4px rhythm remain local composition values, not new spacing tokens. The current refinement has a bounded desktop/mobile visual review and a separate research note in `design/CRAFT-RESEARCH.md`.

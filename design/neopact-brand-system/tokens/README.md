# Neopact tokens

The token source is `tokens.json`. It has three layers: raw **primitive** values, purposeful **semantic** aliases, and **component** aliases. Every token carries `$type`, `$value`, `$description` and `$extensions.neopact.cssVariable`. Brace values such as `{semantic.color.action}` are references. This is a simple typed interchange format inspired by design-token conventions; color, shadow and font values are CSS-ready strings, so transform them if a downstream tool requires structured DTCG color objects.

Use the semantic and component layers in application code. Do not put primitive colors or arbitrary spacing values directly in components. CSS variable prefix is `--np-`; primitives are explicitly prefixed `--np-p-`. JSON keys map to exact CSS names using the extension metadata rather than guessed naming.

```html
<link rel="stylesheet" href="./tokens/fonts.css">
<link rel="stylesheet" href="./tokens/tokens.css">
<link rel="stylesheet" href="./tokens/components.css">
<main class="np-ui">
  <section class="np-card">
    <h2>Review offer v3</h2>
    <p>Demo fixture · 72 task chairs</p>
    <button class="np-button" type="button">Approve offer v3</button>
  </section>
</main>
```

The markup above demonstrates styling, not a working approval flow. Follow `../COMPONENTS.md` for required approval behavior. Imports may instead go in the host app's CSS entry in the same order. `.np-ui` scopes typography and most general rules; the `np-*` classes are intentionally explicit. The CSS contains no JavaScript, remote requests or tracking. `fonts.css` declares local `@font-face` rules for the bundled Manrope variable and IBM Plex Mono regular files in `../assets/fonts/`; keep the accompanying OFL licenses. Import that file first, or configure equivalent local fonts in the host app (for example `next/font/local`). Do not add remote font requests. Arial and monospace provide functional fallbacks. Only regular IBM Plex Mono is supplied; prefer regular numeric text instead of synthetic bold mono.

| Purpose | Main CSS variables |
|---|---|
| Surface / text | `--np-color-canvas`, `--np-color-surface`, `--np-color-text`, `--np-color-text-muted` |
| Action | `--np-color-action`, `--np-color-action-hover`, `--np-color-action-active`, `--np-color-on-action` |
| Borders / focus | `--np-color-border` (decorative), `--np-color-border-control`, `--np-color-focus` |
| Brand | `--np-color-ink`, `--np-color-highlight`, `--np-color-on-highlight` |
| Status | `--np-color-success`, `--np-color-pending`, `--np-color-danger`, `--np-color-info`, `--np-color-expired`, and each `-bg` partner |
| Type | `--np-font-sans`, `--np-font-mono`, `--np-text-12/14/16/20/24/32/48/64`, `--np-weight-*`, `--np-line-*` |
| Space | `--np-space-0/1/2/3/4/5/6/8/10/12/16/20/24/32` (number × 4px at a 16px root) |
| Shape | `--np-radius-control`, `--np-radius-card`, `--np-radius-hero`, `--np-radius-pill` |
| Motion | `--np-duration-fast`, `--np-duration-normal`, `--np-easing-standard` |
| Components | `--np-button-*`, `--np-input-*`, `--np-card-*`, `--np-badge-*`, `--np-table-*`, `--np-panel-*` |

Slash notation in the table abbreviates independent tokens, not literal variable names. For example `--np-text-16` exists, while `--np-text-12/14` does not.

## Reference classes

- Layout/type: `np-ui`, `np-stack`, `np-row`, `np-muted`, `np-mono`, `np-amount`, `np-version`, `np-sr-only`.
- Actions: `np-button` with `--secondary`, `--quiet`, `--danger`, `--highlight`, `--icon` or `--compact` suffix classes. State selectors support `:disabled`, `aria-disabled`, `aria-busy`, `:hover`, `:active`, and `:focus-visible`.
- Fields: `np-field`, `np-label`, `np-input`, `np-select`, `np-textarea`, `np-helper`, `np-error`, `np-checkbox`, `np-radio`, `np-check-label`.
- Containers: `np-card`, `np-card--interactive`, `np-card--selected`, `np-table-region`, `np-table`, `np-numeric`.
- Status: `np-badge` with `--success`, `--pending`, `--danger`, `--info` or `--expired`. Badges are text status, not buttons. `np-notice` has `--pending` and `--danger` variants.
- Product: `np-timeline`, `np-approval`, `np-approval__parties`, `np-approval__party`, `np-private`, `np-private__label`, `np-empty`, `np-skeleton`, `np-spinner`.
- Brand: `np-brand-panel`, `np-brand-highlight`. Dark panels are a bounded brand treatment, not an alternate product theme.

Class modifiers use both classes, e.g. `class="np-badge np-badge--pending"`. The current stack uses Lucide. Keep icons in that consistent stroke family and provide suitable accessible names or `aria-hidden`. This pack adds no icon dependency.

## Updating and checking

Edit `tokens.json`, then run:

```sh
python3 tokens/generate.py
python3 tokens/contrast.py
```

These commands are relative to the brand-system directory and require Python 3 only. Generation validates references, cycles, type consistency and duplicate CSS names. Generated CSS is deterministic. Commit source JSON and generated CSS together. `components.css` is authored reference CSS; it is not regenerated. A major token rename or meaning change requires a major version; additive tokens are minor; corrective description or non-breaking value refinements are patch changes.

All approved foreground/background pairings are listed in `../COMPONENTS.md`. Lime is brand-only, never success. `#D7DFD7` is decorative only; controls use the stronger border token. Keep light product surfaces as the default and use `np-brand-panel` sparingly. Application authors still own semantics, responsive composition, role authorization, private data isolation, offer versioning and dual human approval correctness.

The intended host stack is Next.js 16 / React 19 / TypeScript with plain CSS and Lucide. No app dependencies or feature logic are supplied. The frontend supports browser login/logout, approval/rejection, and private human negotiation instructions through “Negotiate more.” Other workflow patterns must be implemented against verified capabilities.

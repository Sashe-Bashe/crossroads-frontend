# Palette evidence and conversion testing

Research reviewed 10 October 2026. Status: evidence-informed design hypothesis; not conversion-validated.

## The decision

Keep evergreen, warm white, and restrained lime as the version 1 identity. The palette fits the existing product direction and its principal text/action pairs have strong measured contrast. Neither of those facts proves it will outperform another palette. No Neopact traffic experiment or buyer/supplier research has been run for this package. A narrowly validated customer profile is also still missing.

The initial palette was selected through design judgment and existing-product context before this evidence review. This document records the subsequent reassessment explicitly.

## What research supports

| Evidence | What it supports | What it does not prove |
|---|---|---|
| Baymard's first-party button usability research says there is no universally ideal button color. Distinctive styling, prominence, placement, and meaningful wording work together. [Button design](https://baymard.com/blog/button-design) | Reserve a clear primary action style; avoid competing filled controls; explain the next step. | A particular Neopact hue produces a conversion lift. The research is primarily ecommerce, not agent-mediated B2B procurement. |
| Nielsen Norman Group's usability study identifies design quality, upfront disclosure, comprehensive/current information, and external connections as credibility factors. Color should suit the service and work with organization and imagery. [Trustworthiness in web design](https://www.nngroup.com/articles/trustworthy-design/) | Give landed cost, supplier identity, offer validity, private-policy scope, and approval consequences prominent, readable treatment. | Green alone creates trust; visual polish alone compensates for missing information. |
| A controlled study with over 200 participants found blue most trustworthy among four tested website schemes, but the color effect was limited. [Alberts & van der Geest, 2011](https://research.utwente.nl/en/publications/color-matters-color-as-trustworthiness-cue-in-web-sites/) | A restrained blue alternative is a reasonable test hypothesis. | Higher conversion, current B2B buying behavior, or direct conclusions about Neopact’s dark green. The outcome was perceived trust on finance, legal, and medical sites. |
| NN/g’s randomized eye-tracking study with 71 participants found weaker clickability cues increased target-finding time by 22% across the tested page pairs. [Original experiment](https://www.nngroup.com/articles/flat-ui-less-attention-cause-uncertainty/) | Make controls visibly interactive and easy to identify. | A 22% conversion effect, or a result caused by hue alone. The experiment changed multiple visual cues. |
| Two controlled advertising experiments (409 participants combined) found the tested blue–green analogous color combination tended to improve ad attitude and stated purchase intention. [Original study, 2021](https://doi.org/10.1016/j.elerap.2021.101100) | Color combinations and context can influence responses; a blue-based alternative is reasonable to investigate. | Actual purchases, enterprise procurement behavior, or superiority of these exact hex values. Banner-ad intentions are not marketplace conversion rates. |
| WCAG specifies minimum text contrast and requires alternatives to color-only meaning. [Contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum), [Use of color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) | Check actual foreground/background pairs; label approval, expiry, and error states. | A measured conversion gain or whole-product accessibility conformance. |

## What was measured in this kit

Ratios below were calculated from the actual sRGB values, with no transparency. The reproducible calculation and all 25 passing intended pairs are in `tokens/contrast.py` and `tokens/contrast-report.json`.

| Pair | Contrast | Application |
|---|---:|---|
| Ink `#132F2B` on canvas `#F6F7F2` | 13.28:1 | Main reading text |
| White `#FFFFFF` on action `#244B43` | 9.71:1 | Primary product buttons |
| Muted `#586963` on canvas | 5.39:1 | Supporting copy |
| Ink on lime `#D9F26F` | 11.49:1 | Brand emphasis on a lime fill |
| Lime on white | 1.24:1 | Not suitable for reading text or an essential graphic |

Contrast is only one accessibility check. Keyboard operation, focus, labels, resize/reflow, and assistive-technology behavior also depend on implementation.

## Conversion-oriented application rules

These are the design team's inference from the evidence, not measured Neopact effects:

- Keep business task surfaces predominantly light. Use evergreen fills for the main action and outline/text treatment for secondary actions.
- Use lime sparingly for brand emphasis on dark surfaces. Do not make a dense purchasing workspace compete with large decorative lime blocks. Do not use lime for approval/success.
- Give each decision context one obvious next action, such as “Review offer v3.” Do not optimize for accidental approvals or disguise a commitment behind a vague label.
- Keep actual total, currency, quantity, deposit, delivery timing, expiry, and both parties' exact-version approval states visible. A trust problem caused by missing terms is not a hue problem.
- Do not infer that a blue, red, or green winner from someone else's site will win here.

## A test that can answer the Neopact question

**Prototype stage:** test the same request and offer-review tasks with representative business buyers and suppliers. Begin with a small formative round, for example 5–8 people per role, to find navigation and comprehension issues. Ask people to identify total cost, private information, next action, and whether an order is already confirmed. This can find problems; it cannot establish a statistical conversion winner.

**Live stage:** compare the current evergreen treatment with a blue-based alternative while keeping layout, wording, content, pricing, typography, performance, and action prominence consistent. A whole-palette comparison measures the bundle. A button-color comparison must change only that button treatment. Keep these as separate experiments.

Suggested buyer primary outcome: qualified RFQs submitted per eligible visitor, once that workflow exists. Suggested supplier outcome: eligible offers submitted per eligible supplier. If the only live flow is offer review, use successful review completion and accurate state comprehension rather than treating every approval as success. Define qualification and event instrumentation before launching.

Randomize consistently at the visitor or organization level according to the actual journey. Choose the baseline, smallest worthwhile effect, sample size, analysis plan, and stopping rule before the test. Monitor validation errors, abandonment, accidental actions, cancellations, and comprehension as guardrails. Report uncertainty. Insufficient traffic yields an inconclusive result, not a winning color.

No experiment or user outreach has been launched. The released kit retains one canonical palette so hackathon agents implement a consistent identity while evidence is gathered.

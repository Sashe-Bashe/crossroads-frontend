#!/usr/bin/env python3
"""Reproduce Neopact WCAG sRGB contrast pairs with Python's standard library."""
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parent
PAIRS = [
    ('Primary text / white', '#132F2B', '#FFFFFF', 4.5),
    ('Primary text / canvas', '#132F2B', '#F6F7F2', 4.5),
    ('Muted text / white', '#586963', '#FFFFFF', 4.5),
    ('Muted text / canvas', '#586963', '#F6F7F2', 4.5),
    ('Primary button', '#FFFFFF', '#244B43', 4.5),
    ('Primary hover', '#FFFFFF', '#183B34', 4.5),
    ('Primary active', '#FFFFFF', '#102E28', 4.5),
    ('Secondary default', '#244B43', '#FFFFFF', 4.5),
    ('Secondary hover', '#244B43', '#EEF1EC', 4.5),
    ('Secondary active', '#244B43', '#D7DFD7', 4.5),
    ('Danger button', '#FFFFFF', '#A43131', 4.5),
    ('Danger hover and active', '#FFFFFF', '#882626', 4.5),
    ('Brand highlight', '#132F2B', '#D9F26F', 4.5),
    ('Control border / white', '#788A81', '#FFFFFF', 3.0),
    ('Control border / canvas', '#788A81', '#F6F7F2', 3.0),
    ('Focus / white', '#244B43', '#FFFFFF', 3.0),
    ('Focus / canvas', '#244B43', '#F6F7F2', 3.0),
    ('Focus / dark brand', '#D9F26F', '#132F2B', 3.0),
    ('Inverse text / dark brand', '#FFFFFF', '#132F2B', 4.5),
    ('Muted text / dark brand', '#D7DFD7', '#132F2B', 4.5),
    ('Success status', '#1E563C', '#E8F3EB', 4.5),
    ('Pending status', '#78501A', '#FFF1D6', 4.5),
    ('Danger status', '#A43131', '#FDEDED', 4.5),
    ('Information status', '#235C88', '#EAF2FA', 4.5),
    ('Expired and disabled text', '#586963', '#EEF1EC', 4.5),
    ('Decorative line only: unsuitable as essential boundary', '#D7DFD7', '#FFFFFF', None),
    ('Lime on white: unsuitable as text or essential graphic', '#D9F26F', '#FFFFFF', None),
]
def luminance(color):
    channels = [int(color[i:i+2], 16) / 255 for i in (1, 3, 5)]
    linear = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in channels]
    return sum(c * weight for c, weight in zip(linear, (0.2126, 0.7152, 0.0722)))
def main():
    rows = []
    for use, fg, bg, minimum in PAIRS:
        low, high = sorted((luminance(fg), luminance(bg)))
        ratio = (high + 0.05) / (low + 0.05)
        row = dict(use=use, foreground=fg, background=bg, ratio=round(ratio, 6), requiredMinimum=minimum, passes=ratio >= minimum if minimum else None)
        rows.append(row)
        print(f'{ratio:9.6f}:1  {use}')
    report = {'method': 'WCAG relative luminance from sRGB; float64 calculation, ratios rounded to 6 decimal places', 'pairs': rows}
    (ROOT / 'contrast-report.json').write_text(json.dumps(report, indent=2) + '\n')
    failures = [row for row in rows if row['passes'] is False]
    if failures:
        raise SystemExit(f'Failed approved pairs: {failures}')
    print(f'{sum(row["passes"] is True for row in rows)} approved pairs pass; 2 intentionally restricted pairs documented.')
if __name__ == '__main__':
    main()

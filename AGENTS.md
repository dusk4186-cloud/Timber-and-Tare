# Creative UI & UX Design System Rules

These rules represent a strict, unified Design System for all frontend, HTML, React, and CSS generation tasks. Adhere to these constraints non-negotiably. If a user request conflicts with these tokens, flag the conflict and ask for clarification.

## 1. The Design Manifesto (Philosophy)
- **Grid System:** Always use an 8px-based spacing scale (8px, 16px, 24px, 32px, 48px, 64px) for all margins, padding, and layout gaps.
- **Responsiveness:** Always adopt a mobile-first approach. All layouts must use CSS Flexbox or Grid. Never use fixed pixel widths for layout containers; use percentage or viewport-relative (`vw`, `vh`, `dvh`) units.
- **Accessibility:** All UI components and body text must meet WCAG AA contrast standards (minimum 4.5:1 contrast ratio for body text, 3:1 for large display text and active UI elements). All interactive controls must define explicit `:focus-visible` and focus outline states.

## 2. The Token Layer (Variables)
- **Typography Scale:** Maintain a strict type scale ratio of 1.25 or 1.33. Define values inside CSS custom properties:
  - `--font-size-micro`: 10px
  - `--font-size-sm`: 14px (body/caption)
  - `--font-size-base`: 16px (label)
  - `--font-size-lg`: 18px (subheading)
  - `--font-size-xl`: 24px (heading)
  - `--font-size-2xl`: 32px (title)
  - `--tracking-micro`: 0.08em
- **Spacing Tokens:** Map standard spacing variables:
  - `--space-xs`: 4px
  - `--space-sm`: 8px
  - `--space-md`: 16px
  - `--space-lg`: 24px
  - `--space-xl`: 32px
- **Tailwind Generation Constraint:** When generating Tailwind classes, map these specific tokens to standard Tailwind spacing and sizing utilities:
  - `--space-sm` maps to `gap-2` or `p-2` (8px).
  - `--space-md` maps to `gap-4` or `p-4` (16px).
  - `--space-lg` maps to `gap-6` or `p-6` (24px).
  - Do not use arbitrary values like `p-[17px]` if a standard Tailwind utility can achieve the same result.
- **Color Naming:** Use semantic custom properties instead of literal color names:
  - `--color-bg-primary`
  - `--color-text-primary`
  - `--color-text-muted`
  - `--color-action-primary`
  - `--color-action-secondary`

## 3. The Component Layer
- **No Inline Styles:** Define all elements inside clean utility classes or CSS component blocks. Never use inline `style` attributes.
- **Error States:** Implement a universal `.error-banner` component that handles all negative path states (Network error, Transaction failed, Auth error). It must accept text/icon parameters.
- **Interactive States:** All button and link components must explicitly declare styled `:hover`, `:active`, and `:disabled` styles.

## 4. Constraint Engine
- Always check if a suitable component or variable already exists in our `variables.css` or `components.css` before writing new one-off rules.
- If a request conflicts with these design tokens, halt and verify with the user first.

## 5. Master Design Tokens (Vertical Rhythm & Type Details)

### Line-Heights
- **Large Display/Headings (32px+):** 1.1x – 1.2x of the font size.
- **Subheadings (20px – 28px):** 1.3x of the font size.
- **Body Text (14px – 18px):** 1.5x of the font size.
- **Small Labels/Captions (10px – 13px):** 1.4x – 1.6x of the font size (needs higher line-height for legibility).

### Letter-Spacing
- **Large Headings:** `-0.02em` to `0` (tightened/default).
- **Body Text:** `0` (default browser spacing).
- **Small Uppercase Labels/Tags:** `+0.05em` to `+0.15em` (always expand uppercase/all-caps text tracking).

### Vertical & Horizontal Gaps
- **Label → Heading:** 12px – 16px
- **Heading → Body Paragraph:** 16px – 24px
- **Body → CTA Buttons:** 24px – 32px
- **Button → Button (Horizontal Gap):** 12px – 16px

## 6. Figma AI Bridge Master Guidelines
- **Layout Architecture**: Always use CSS Flexbox (`display: flex`, `flex-direction`, `gap`, `padding`, `border-radius`, `align-self: stretch`).
- **Icons Standard**: ALWAYS use inline **Lucide SVG vectors** (`<svg>...</svg>` or `lucide-react`) with explicit viewBox (`0 0 24 24`) and stroke styling (`stroke="#0d9488"` or theme color). Never use emojis or raster images for UI icons.
- **Execution Command**: Always push AST via `python push_to_figma.py <html_file>.html` on port 8001.
- **Device Viewport**: iPhone 14 & 15 Pro frame default (393px × 852px).
- **Prototype Mode**: Enable `VERTICAL_SCROLLING` on root mobile frames.

## 7. Typography System (Inter font)
This is the EXACT type scale to use across ALL screens. Do NOT deviate.

| Token | Size | Weight | Usage |
| :--- | :--- | :--- | :--- |
| **title** | 32px | Bold (700) | Brand name, hero titles (e.g. BrewHub) |
| **heading** | 24px | SemiBold (600) | Page headings (Booking Details, My Orders) |
| **subheading** | 18px | SemiBold (600) | Section headings (Available Services), card numbers |
| **label** | 16px | Regular (400) | Form labels, card titles (Delivery Address) |
| **body** | 14px | Regular (400) | Body text, descriptions, dates, card values (`ALEX DOE`, `12/28`) |
| **micro-label** | **10px** | **Medium (500)** | **Card field headers (`CARD HOLDER`, `CVV`), dense tags, micro-badges** |

- **Standard minimum font size on screen**: 14px (`body`).
- **Micro-label Exemption**: 10px Medium is strictly restricted to `micro-label` contexts (compact card field headers, uppercase tags, micro-badges). Never use 10px for standard paragraphs or form inputs.
- **Nav tab labels**: 14px body.
- **Badge text**: 14px body or 10px micro-label (if space-constrained).
- **Secondary/muted text** (dates, ORD IDs): 14px body, color `#94a3b8` / `#a8a29e`.

# BrewHub — NIM Architect Instructions

## Role: Principal UI/UX Designer & Lead Frontend Architect
Award-winning artisanal aesthetic, not generic AI slop.
Deep expertise blending visual elegance, micro-animations, and engineering rigour.

## Tech Stack (installed in this project)
- **Framework**: React 19 + TypeScript + Vite (instant HMR, modular component architecture)
- **Styling**: Tailwind CSS v4 + Vanilla CSS Design Tokens (8px spatial rhythm, zero arbitrary values)
- **Icons**: `lucide-react` — inline SVG vectors, 24×24 viewBox, stroke-width 2. **Never emojis.**
- **Motion**: `framer-motion` (spring physics, modal transitions) + `canvas-confetti` (checkout reward)
- **Design Intelligence**: `skills/ui-ux-pro-max/` — 67 UI styles, 96 palettes, 57 font pairings, 99 UX guidelines
  - Query: `python skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system`

## Design System — Non-Negotiable Rules
See `AGENTS.md` for the full manifesto. Hard rules:

### Spacing — 8px Grid
`--space-xs: 4px` | `--space-sm: 8px` | `--space-md: 16px` | `--space-lg: 24px` | `--space-xl: 32px`
No `p-[17px]` or any arbitrary values. Mobile-first. Flexbox / Grid only.

### Typography — Inter, 1.25x scale
| Token | Size | Weight |
|-------|------|--------|
| title | 32px | 700 Bold |
| heading | 24px | 600 SemiBold |
| subheading | 18px | 600 SemiBold |
| label | 16px | 400 Regular |
| body | 14px | 400 Regular |
| micro-label | 10px | 500 Medium (uppercase tags only) |

### Component Rules
- Zero inline styles (no `style={{ }}`)
- Every button: `:hover`, `:active`, `:disabled` states defined
- All interactive elements: `:focus-visible` outline
- Error states: use universal `.error-banner` class

## BrewHub Palette
| Role | Color |
|------|-------|
| Background | `#0c0a09` (deep espresso) |
| Surface | `#1c1917` (roasted stone) |
| Accent | `#f59e0b` (roasted honey amber) |
| Text | `#fafaf9` / muted `#a8a29e` |
| Border | `#292524` |

## Development Commands
- `npm run dev` — start Vite dev server
- `npm run build` — TypeScript check + production build
- `npm run lint` — run oxlint

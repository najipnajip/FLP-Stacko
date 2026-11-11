# Design Direction

## Product Read
Reading this as: **Facilitator web tool for MT Onboarding physical Stacko game**, for **facilitators and MT participants**, in an **energetic, high-contrast, physical-to-digital game-board visual language**.

## Design Dials
- **ENERGY: 2 (Balanced & Engaging)**: Professional facilitator clarity combined with game excitement. High-contrast cards visible across a room when projected.
- **RHYTHM: 1 (Focused & Structured)**: Clean, purposeful facilitator layout. Centered 45-card grid with fixed utility headers/bars and no decorative bloat.
- **MOTION: 2 (Tactile Transitions)**: Smooth 3D card-flip reveal for drawn numbers, quick modal pop-in for "Tower Falls", instant card state persistence.

## Palette & Hierarchy
- **Base Canvas:** Deep Teal (`#003539`) - calm, authoritative backdrop that reduces eye strain on laptop and projector.
- **Surface Elevation:** Deep Teal tint / Dark Cyan (`#002427`, `#05454a`) - structural containers, header bar, and modal overlay scrim.
- **Primary Accent / Available Card:** Lime Green (`#AFEE00`) - high visibility indicator for untouched blocks, active CTAs, and "Tower Falls" trigger.
- **Available Card Text / Dark Accent:** Deep Teal (`#003539`) - maximum contrast on Lime surfaces (> 10:1 ratio, exceeds WCAG AAA).
- **Opened / Used Card Surface:** Muted Teal / Deep Slate (`#082e31`, border `#0e4a4f`) with Muted Ice Text (`#88b2b5`) - clearly distinct from available cards at a distance.
- **High-Contrast Text:** Solid White (`#FFFFFF`) on Deep Teal canvas (> 12:1 ratio).
- **Special Question Accent:** Vibrantly highlighted card with distinct badge styling and lime glow/border.

## Typography
- **Primary Typeface:** Clean system sans-serif stack (`system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`) for crisp rendering on projectors and laptop screens without external font loading delays.
- **Card Numbers:** Bold, high-legibility display numbers designed to match physical block stencils.
- **Revealed Question Text:** Generous 1.5rem to 2.25rem scale with comfortable line height (1.4-1.5) for readability from several meters away.

## Interaction & Accessibility Rules
- Keyboard navigable (`Tab`, `Enter`, `Space`, `Escape` to close modals).
- Visible focus rings with high-contrast lime outline.
- All interactive controls have minimum 44px tap/click targets.
- No dead controls or fake stats.

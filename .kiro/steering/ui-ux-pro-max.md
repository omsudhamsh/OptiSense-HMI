---
inclusion: always
---

# UI/UX Pro Max — OptiSense HMI Design System

## Core Philosophy
Industrial-grade dark HMI with premium consumer-app polish. Every pixel earns its place.
Think: Bloomberg Terminal × Figma × Linear × Vercel Dashboard — but for factory floors.

## Design Tokens
- **Primary surface**: `#080C18` (near-black with blue undertone)
- **Card surface**: `#0D1424` (slightly lighter)
- **Elevated surface**: `#121B2E` (panels, modals)
- **Border**: `#1E2D45` (subtle blue-tinted border)
- **Accent (teal)**: `#00D4AA` — primary interactive, success, AI
- **ISA P1 (critical)**: `#FF2D2D` — brighter red for dark bg
- **ISA P2 (high)**: `#FF8C00`
- **ISA P3 (medium)**: `#FFD700`
- **ISA P4 (low)**: `#3B82F6`
- **Text primary**: `#F0F4FF`
- **Text secondary**: `#8B9CC8`
- **Text tertiary**: `#4A5A7A`

## Typography
- **Display**: Space Grotesk — headings, brand, KPI numbers
- **Body**: Inter — all prose, labels, descriptions
- **Mono**: JetBrains Mono — values, thresholds, timestamps, IDs

## Button System (CRITICAL — must be implemented)
Every button must have:
1. `cursor: pointer` explicitly set
2. Hover: background lightens + subtle scale(1.02) + box-shadow glow
3. Active: scale(0.97) press-down feel
4. Focus-visible: 2px teal outline offset 2px
5. Transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1)
6. Disabled: opacity-40, cursor-not-allowed, no hover effects

### Button Variants
- **Primary** (accent): `bg-accent text-surface-base` → hover: `bg-accent/90 shadow-[0_0_20px_rgba(0,212,170,0.35)]`
- **Secondary** (ghost): `border border-surface-border text-text-secondary` → hover: `border-accent/50 text-text-primary bg-accent/5`
- **Danger** (escalate): `border border-isa-p2/40 bg-isa-p2/10 text-isa-p2` → hover: `bg-isa-p2/20 shadow-[0_0_16px_rgba(255,140,0,0.25)]`
- **Critical** (P1 actions): `border border-isa-p1/40 bg-isa-p1/10 text-isa-p1` → hover: `bg-isa-p1/20 shadow-[0_0_16px_rgba(255,45,45,0.25)]`
- **Icon button**: `rounded-full p-2 text-text-tertiary` → hover: `bg-surface-elevated text-text-primary`

## Custom Cursor
- Default: custom SVG crosshair cursor (industrial feel)
- On buttons/interactive: custom pointer cursor with teal dot
- Implemented via CSS `cursor` property with SVG data URIs

## Micro-interactions
- Cards: `hover:translate-y-[-2px] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]`
- Sidebar items: left border accent slide-in on hover
- Status dots: CSS pulse animation for live/critical states
- Number counters: framer-motion spring animations
- Page transitions: opacity + translateY(8px) → (0)

## Layout Rules
- Sidebar: 240px fixed, never collapses on desktop
- Main content: flex-1, scrollable
- Detail panel: 400px slide-in from right
- Header: 64px fixed height
- Footer: 48px, persistent, contains policy links

## Glassmorphism
- Cards: `backdrop-blur-md bg-surface-card/60 border border-surface-border/60`
- Modals: `backdrop-blur-xl bg-surface-elevated/90`
- Header: `backdrop-blur-sm bg-surface-card/80`

## ISA-18.2 Color Coding
Always use severity colors consistently:
- P1 CRITICAL: red glow + pulse animation
- P2 HIGH: orange accent
- P3 MEDIUM: yellow accent  
- P4 LOW: blue accent
- Acknowledged: opacity-60, no glow

## Privacy & Legal Footer
Persistent footer in sidebar bottom AND main app footer:
- Privacy Policy
- Terms of Use
- Security
- ISA-18.2 Compliance
- Version badge

## Accessibility
- All interactive elements: focus-visible ring
- Color never sole indicator (always icon + text too)
- Min touch target: 44×44px
- ARIA labels on icon-only buttons
- Reduced motion: respect `prefers-reduced-motion`

export const C = {
  base: 'var(--color-surface-base)',
  card: 'var(--color-surface-card)',
  elevated: 'var(--color-surface-elevated)',
  border: 'var(--color-surface-border)',
  hover: 'var(--color-surface-hover)',

  accent: 'var(--color-accent)',
  accentDim: 'rgba(0,212,170,0.10)',
  accentBorder: 'rgba(0,212,170,0.22)',
  accentGlow: 'rgba(0,212,170,0.35)',

  p1: 'var(--color-isa-p1)',
  p1Dim: 'rgba(255,45,45,0.10)',
  p1Border: 'rgba(255,45,45,0.25)',
  p1Glow: 'rgba(255,45,45,0.30)',

  p2: 'var(--color-isa-p2)',
  p2Dim: 'rgba(255,140,0,0.10)',
  p2Border: 'rgba(255,140,0,0.25)',

  p3: 'var(--color-isa-p3)',
  p3Dim: 'rgba(255,215,0,0.10)',
  p3Border: 'rgba(255,215,0,0.25)',

  p4: 'var(--color-isa-p4)',
  p4Dim: 'rgba(59,130,246,0.10)',
  p4Border: 'rgba(59,130,246,0.25)',

  textPrimary: 'var(--color-text-primary)',
  textSecondary: 'var(--color-text-secondary)',
  textTertiary: 'var(--color-text-tertiary)',
}

export const SEVERITY = {
  CRITICAL:      { color: C.p1, dim: C.p1Dim, border: C.p1Border, glow: C.p1Glow },
  HIGH:          { color: C.p2, dim: C.p2Dim, border: C.p2Border, glow: 'none' },
  MEDIUM:        { color: C.p3, dim: C.p3Dim, border: C.p3Border, glow: 'none' },
  LOW:           { color: C.p4, dim: C.p4Dim, border: C.p4Border, glow: 'none' },
  INFORMATIONAL: { color: C.p4, dim: C.p4Dim, border: C.p4Border, glow: 'none' },
}

export const S = {
  card: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 14 },
  cardGlass: { background: 'rgba(10,14,26,0.80)', border: `1px solid rgba(30,45,69,0.80)`, borderRadius: 14, backdropFilter: 'blur(16px)' },
  elevated: { background: C.elevated, border: `1px solid ${C.border}`, borderRadius: 14 },
  modal: { background: 'rgba(5,7,13,0.98)', border: `1px solid rgba(30,45,69,0.90)`, borderRadius: 20, boxShadow: '0 40px 100px rgba(0,0,0,0.75)', backdropFilter: 'blur(32px)' },
  sectionLabel: { fontSize: 11, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: C.textTertiary, fontFamily: 'Inter, sans-serif' },
  divider: { height: 1, background: `linear-gradient(90deg, transparent, ${C.border}, transparent)` },
}

export const btn = {
  base: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 13, lineHeight: 1, borderRadius: 9, padding: '8px 14px', border: '1px solid transparent', transition: 'all 160ms cubic-bezier(0.4,0,0.2,1)', whiteSpace: 'nowrap', userSelect: 'none', minHeight: 34, cursor: 'pointer', outline: 'none' },
  primary: { background: C.accent, color: C.base, borderColor: C.accent, fontWeight: 600 },
  secondary: { background: 'transparent', color: C.textSecondary, borderColor: C.border },
  danger: { background: C.p2Dim, color: C.p2, borderColor: C.p2Border },
  critical: { background: C.p1Dim, color: C.p1, borderColor: C.p1Border },
  ghost: { background: 'transparent', color: C.textTertiary, borderColor: 'transparent', padding: 6, borderRadius: '50%', minHeight: 32, minWidth: 32 },
  sm: { fontSize: 12, padding: '5px 11px', minHeight: 28, borderRadius: 7 },
  lg: { fontSize: 14, padding: '11px 20px', minHeight: 42 },
}

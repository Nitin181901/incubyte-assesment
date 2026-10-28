/** Design tokens for ACME Pay — no component should hard-code these hex values. */

export const colors = {
  indigo: '#6366F1',
  violet: '#8B5CF6',
  pink: '#EC4899',
  cyan: '#06B6D4',
  teal: '#14B8A6',
  orange: '#F97316',
  coral: '#F43F5E',
  navy: '#0F172A',
  muted: '#64748B',
  white: '#FFFFFF',
  sidebarFrom: '#1E1B4B',
  sidebarTo: '#4C1D95',
  darkBg: '#0B1026',
  darkPaper: '#151A33',
}

export const gradients = {
  primary: `linear-gradient(135deg, ${colors.indigo} 0%, ${colors.violet} 100%)`,
  primaryHover: `linear-gradient(135deg, #5558E8 0%, #7C4FE0 100%)`,
  hero: `linear-gradient(135deg, ${colors.violet} 0%, ${colors.pink} 100%)`,
  sidebar: `linear-gradient(180deg, ${colors.sidebarFrom} 0%, ${colors.sidebarTo} 100%)`,
  textAccent: `linear-gradient(90deg, ${colors.indigo} 0%, ${colors.pink} 100%)`,
  barIndigo: `linear-gradient(180deg, ${colors.indigo} 0%, ${colors.violet} 100%)`,
  barTeal: `linear-gradient(90deg, ${colors.teal} 0%, ${colors.cyan} 100%)`,
}

export const glass = {
  light: {
    bg: 'rgba(255, 255, 255, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.55)',
    shadow: '0 10px 30px rgba(99, 102, 241, 0.12)',
    blur: '16px',
  },
  dark: {
    bg: 'rgba(21, 26, 51, 0.72)',
    border: '1px solid rgba(148, 163, 184, 0.18)',
    shadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
    blur: '16px',
  },
}

export const radii = {
  card: 24,
  control: 12,
  pill: 999,
}

export const layout = {
  sidebarWidth: 240,
  sidebarCollapsed: 76,
  contentMaxWidth: 1400,
  mobileBreakpoint: 900,
}

export const accentIcons = {
  headcount: colors.violet,
  payroll: colors.coral,
  median: colors.teal,
  average: colors.orange,
}

/** Stable department → soft pill color map */
export const departmentColors = {
  Engineering: { bg: 'rgba(99, 102, 241, 0.14)', fg: colors.indigo },
  Sales: { bg: 'rgba(249, 115, 22, 0.14)', fg: colors.orange },
  Marketing: { bg: 'rgba(236, 72, 153, 0.14)', fg: colors.pink },
  HR: { bg: 'rgba(20, 184, 166, 0.14)', fg: colors.teal },
  Finance: { bg: 'rgba(6, 182, 212, 0.14)', fg: colors.cyan },
  Operations: { bg: 'rgba(139, 92, 246, 0.14)', fg: colors.violet },
  Support: { bg: 'rgba(244, 63, 94, 0.12)', fg: colors.coral },
  Product: { bg: 'rgba(99, 102, 241, 0.12)', fg: '#4338CA' },
}

export const departmentFallback = { bg: 'rgba(100, 116, 139, 0.12)', fg: colors.muted }

export const THEME_STORAGE_KEY = 'acme-theme-mode'
export const SIDEBAR_STORAGE_KEY = 'acme-sidebar-collapsed'

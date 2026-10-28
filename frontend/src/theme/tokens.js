/** PayLens design tokens — components must use these (or theme.palette), not raw hex. */

export const colors = {
  primary: '#0D9488',
  primaryHover: '#0F766E',
  secondary: '#F59E0B',
  danger: '#DC2626',
  success: '#16A34A',
  slate950: '#0F172A',
  slate700: '#334155',
  slate500: '#64748B',
  slate200: '#E2E8F0',
  slate50: '#F8FAFC',
  darkBg: '#0B1220',
  darkPaper: '#111827',
  white: '#FFFFFF',
}

export const chart = {
  primary: colors.primary,
  secondary: colors.secondary,
  muted: colors.slate500,
  grid: colors.slate200,
}

export const radii = {
  card: 12,
  control: 8,
  pill: 999,
}

export const shadows = {
  card: '0 1px 2px rgba(15, 23, 42, 0.06)',
}

export const layout = {
  contentMaxWidth: 1400,
  mobileBreakpoint: 900,
}

/** Dot colors for department labels (not pastel pills). */
export const departmentDot = {
  Engineering: colors.primary,
  Sales: colors.secondary,
  Marketing: '#DB2777',
  HR: colors.success,
  Finance: '#2563EB',
  Operations: colors.slate700,
  Support: colors.danger,
  Product: '#7C3AED',
}

export const departmentDotFallback = colors.slate500

export const THEME_STORAGE_KEY = 'paylens-theme-mode'

/**
 * The API has no separate `level` field — seniority is encoded in `job_title`.
 * Map known titles (and a small heuristic fallback) to L1–L6 for display.
 */

const EXACT = {
  'Software Engineer I': 'L1',
  'Sales Executive': 'L1',
  'Marketing Coordinator': 'L1',
  'HR Coordinator': 'L1',
  'Operations Coordinator': 'L1',
  'Support Specialist': 'L1',
  'Software Engineer II': 'L2',
  'Marketing Specialist': 'L2',
  'HR Specialist': 'L2',
  'Operations Specialist': 'L2',
  'Support Engineer': 'L2',
  'Financial Analyst': 'L2',
  'Product Analyst': 'L2',
  'Account Manager': 'L3',
  'Marketing Manager': 'L3',
  'HR Manager': 'L3',
  'Operations Manager': 'L3',
  'Support Manager': 'L3',
  'Finance Manager': 'L3',
  'Product Manager': 'L3',
  'Software Engineer': 'L3',
  'Senior Software Engineer': 'L4',
  'Senior Account Manager': 'L4',
  'Senior Support Engineer': 'L4',
  'Senior Financial Analyst': 'L4',
  'Senior Product Manager': 'L4',
  'Staff Engineer': 'L5',
  'Sales Director': 'L6',
  'Marketing Director': 'L6',
  'HR Director': 'L6',
  'Finance Director': 'L6',
  'Operations Director': 'L6',
  'Director of Product': 'L6',
}

export function levelFromJobTitle(jobTitle) {
  const title = String(jobTitle || '').trim()
  if (!title) return '—'
  if (EXACT[title]) return EXACT[title]

  if (/\bDirector\b/i.test(title)) return 'L6'
  if (/\bStaff\b|\bPrincipal\b/i.test(title)) return 'L5'
  if (/\bSenior\b/i.test(title)) return 'L4'
  if (/\bManager\b/i.test(title)) return 'L3'
  if (/\bII\b|\b2\b/.test(title)) return 'L2'
  if (/\bI\b|\bJunior\b|\bCoordinator\b|\bAssociate\b/i.test(title)) return 'L1'
  return 'L3'
}

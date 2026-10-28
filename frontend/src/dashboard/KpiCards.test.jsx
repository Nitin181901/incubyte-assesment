import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ThemeModeProvider } from '../theme'
import KpiCards from './KpiCards'

describe('KpiCards', () => {
  it('renders compact KPI values from summary data', () => {
    render(
      <ThemeModeProvider>
        <KpiCards
          loading={false}
          error={null}
          data={{
            headcount: 10000,
            total_payroll_usd: 1200000000,
            avg: 90000,
            median: 85000,
            min: 20000,
            max: 350000,
          }}
        />
      </ThemeModeProvider>,
    )

    expect(screen.getByText('Headcount')).toBeInTheDocument()
    expect(screen.getByText('10,000')).toBeInTheDocument()
    expect(screen.getByText('Annual payroll USD')).toBeInTheDocument()
    expect(screen.getByText('$1.2B')).toBeInTheDocument()
    expect(screen.getByText('Median salary USD')).toBeInTheDocument()
    expect(screen.getByText('$85K')).toBeInTheDocument()
  })
})

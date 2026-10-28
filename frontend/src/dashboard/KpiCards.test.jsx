import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import KpiCards from './KpiCards'

describe('KpiCards', () => {
  it('renders compact KPI values from summary data', () => {
    render(
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
      />,
    )

    expect(screen.getByText('Headcount')).toBeInTheDocument()
    expect(screen.getByText('10,000')).toBeInTheDocument()
    expect(screen.getByText('Total payroll')).toBeInTheDocument()
    expect(screen.getByText('$1.2B')).toBeInTheDocument()
    expect(screen.getByText('Median')).toBeInTheDocument()
    expect(screen.getByText('$85K')).toBeInTheDocument()
  })
})

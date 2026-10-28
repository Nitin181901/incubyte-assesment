import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

vi.mock('recharts', async () => {
  const actual = await vi.importActual('recharts')
  return {
    ...actual,
    ResponsiveContainer: ({ children }) => (
      <div data-testid="recharts-responsive-container" style={{ width: 800, height: 400 }}>
        {children}
      </div>
    ),
  }
})

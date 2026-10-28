import '@testing-library/jest-dom/vitest'
import { createElement } from 'react'
import { vi } from 'vitest'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

vi.mock('recharts', async () => {
  const actual = await vi.importActual('recharts')
  return {
    ...actual,
    ResponsiveContainer: ({ children }) =>
      createElement(
        'div',
        {
          'data-testid': 'recharts-responsive-container',
          style: { width: 800, height: 400 },
        },
        children,
      ),
  }
})

import { useCallback, useEffect, useState } from 'react'
import { api } from '../backend/client'

export function useStatsResource(pathBuilder, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  const refresh = useCallback(() => setReloadKey((k) => k + 1), [])

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const path = typeof pathBuilder === 'function' ? pathBuilder() : pathBuilder
        const result = await api(path, { signal: controller.signal })
        if (!cancelled) setData(result)
      } catch (err) {
        if (cancelled || err.name === 'AbortError') return
        setError(err)
        setData(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey, ...deps])

  return { data, loading, error, refresh }
}

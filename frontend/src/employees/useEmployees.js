import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../backend/client'

const DEFAULTS = {
  q: '',
  country: '',
  department: '',
  job_title: '',
  min_salary_usd: '',
  max_salary_usd: '',
  sort: 'name',
  dir: 'asc',
  page: '1',
  per_page: '25',
}

function readParams(searchParams) {
  const next = { ...DEFAULTS }
  Object.keys(DEFAULTS).forEach((key) => {
    const value = searchParams.get(key)
    if (value != null && value !== '') next[key] = value
  })
  return next
}

function toSearchParams(filters) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value != null && String(value) !== '' && String(value) !== DEFAULTS[key]) {
      params.set(key, String(value))
    }
  })
  // Always keep page/per_page/sort visible when not default for shareable URLs
  if (filters.page && filters.page !== '1') params.set('page', filters.page)
  if (filters.per_page && filters.per_page !== '25') params.set('per_page', filters.per_page)
  if (filters.sort && filters.sort !== 'name') params.set('sort', filters.sort)
  if (filters.dir && filters.dir !== 'asc') params.set('dir', filters.dir)
  return params
}

export function useEmployees() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo(() => readParams(searchParams), [searchParams])

  const [data, setData] = useState([])
  const [meta, setMeta] = useState({ page: 1, per_page: 25, total: 0, total_pages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  const setFilters = useCallback(
    (patch, { resetPage = true } = {}) => {
      setSearchParams((prev) => {
        const current = readParams(prev)
        const next = {
          ...current,
          ...patch,
          ...(resetPage && patch.page == null ? { page: '1' } : {}),
        }
        return toSearchParams(next)
      })
    },
    [setSearchParams],
  )

  const clearFilters = useCallback(() => {
    setSearchParams(toSearchParams({ ...DEFAULTS }))
  }, [setSearchParams])

  const refresh = useCallback(() => setReloadKey((k) => k + 1), [])

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const query = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
          if (value != null && String(value) !== '') query.set(key, String(value))
        })
        const result = await api(`/employees?${query.toString()}`, { signal: controller.signal })
        if (cancelled) return
        setData(result.data || [])
        setMeta(result.meta || { page: 1, per_page: 25, total: 0, total_pages: 0 })
      } catch (err) {
        if (cancelled || err.name === 'AbortError') return
        setError(err)
        setData([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [filters, reloadKey])

  return {
    filters,
    setFilters,
    clearFilters,
    data,
    meta,
    loading,
    error,
    refresh,
  }
}

export function useMetaFilters() {
  const [meta, setMeta] = useState({ countries: [], departments: [], job_titles: [] })
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const [filters, countryList] = await Promise.all([
          api('/meta/filters'),
          api('/countries'),
        ])
        if (cancelled) return
        setMeta({
          countries: filters.countries || [],
          departments: filters.departments || [],
          job_titles: filters.job_titles || [],
        })
        setCountries(countryList.data || [])
      } catch {
        if (!cancelled) {
          setMeta({ countries: [], departments: [], job_titles: [] })
          setCountries([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { meta, countries, loading }
}

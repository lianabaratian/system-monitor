import { useCallback, useEffect, useRef, useState } from 'react'

export type RefreshInterval = 1000 | 5000 | 10000 | 'manual'

interface UseAutoRefreshResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refresh: () => void
}

export function useAutoRefresh<T>(
  fetcher: () => Promise<T>,
  interval: RefreshInterval,
): UseAutoRefreshResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetcherRef = useRef(fetcher)
  useEffect(() => {
    fetcherRef.current = fetcher
  }, [fetcher])

  const refresh = useCallback(async () => {
    try {
      setError(null)
      const result = await fetcherRef.current()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh() 
    if (interval === 'manual') return
    const id = setInterval(refresh, interval)
    return () => clearInterval(id) 
  }, [refresh, interval])

  return { data, loading, error, refresh }
}
import { useMemo, useState } from 'react'
import { useAutoRefresh, type RefreshInterval } from '../hooks/useAutoRefresh'
import { systemApi } from '../api/systemApi'
import { formatPercent } from '../utils/format'

type SortKey = 'pid' | 'name' | 'cpu' | 'memory'
type SortDir = 'asc' | 'desc'

const INTERVAL_OPTIONS: { label: string; value: RefreshInterval }[] = [
  { label: '1s', value: 1000 },
  { label: '5s', value: 5000 },
  { label: '10s', value: 10000 },
  { label: 'Manual', value: 'manual' },
]

export function ProcessList() {
  const [refreshInterval, setRefreshInterval] = useState<RefreshInterval>(5000)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('cpu')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const { data, loading, error, refresh } = useAutoRefresh(
    systemApi.getProcesses,
    refreshInterval,
  )

  const processes = useMemo(() => {
    const list = data ?? []
    const term = search.trim().toLowerCase()
    const filtered = term
      ? list.filter((p) => p.name.toLowerCase().includes(term))
      : list
    const dir = sortDir === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) =>
      sortKey === 'name'
        ? a.name.localeCompare(b.name) * dir
        : (a[sortKey] - b[sortKey]) * dir,
    )
  }, [data, search, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'name' || key === 'pid' ? 'asc' : 'desc')
    }
  }

  function onIntervalChange(value: string) {
    setRefreshInterval(value === 'manual' ? 'manual' : (Number(value) as RefreshInterval))
  }

  return (
    <section className="panel">
      <div className="panel__header">
        <h2 className="panel__title">Processes</h2>
        <div className="controls">
          <input
            className="search"
            type="text"
            placeholder="Filter by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Filter processes by name"
          />
          <label className="interval-control">
            Refresh:
            <select
              value={String(refreshInterval)}
              onChange={(e) => onIntervalChange(e.target.value)}
              aria-label="Refresh interval"
            >
              {INTERVAL_OPTIONS.map((opt) => (
                <option key={String(opt.value)} value={String(opt.value)}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <button className="refresh-btn" onClick={refresh}>
            Refresh now
          </button>
        </div>
      </div>

      {loading && <p className="state">Loading…</p>}
      {error && <p className="state state--error">{error}</p>}
      {data && (
        <>
          <p className="process-count">{processes.length} processes</p>
          <table className="process-table">
            <thead>
              <tr>
                <SortableHeader label="PID" k="pid" {...{ sortKey, sortDir, onSort: toggleSort }} />
                <SortableHeader label="Name" k="name" {...{ sortKey, sortDir, onSort: toggleSort }} />
                <SortableHeader label="CPU %" k="cpu" {...{ sortKey, sortDir, onSort: toggleSort }} />
                <SortableHeader label="Memory %" k="memory" {...{ sortKey, sortDir, onSort: toggleSort }} />
              </tr>
            </thead>
            <tbody>
              {processes.map((p) => (
                <tr key={p.pid}>
                  <td>{p.pid}</td>
                  <td>{p.name}</td>
                  <td>{formatPercent(p.cpu)}</td>
                  <td>{formatPercent(p.memory)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  )
}

interface SortableHeaderProps {
  label: string
  k: SortKey
  sortKey: SortKey
  sortDir: SortDir
  onSort: (k: SortKey) => void
}

function SortableHeader({ label, k, sortKey, sortDir, onSort }: SortableHeaderProps) {
  const active = sortKey === k
  return (
    <th
      className={active ? 'sortable active' : 'sortable'}
      onClick={() => onSort(k)}
      aria-sort={active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      {label}
      {active ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}
    </th>
  )
}
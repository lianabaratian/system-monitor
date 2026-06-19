import { useAutoRefresh, type RefreshInterval } from '../hooks/useAutoRefresh'
import { systemApi } from '../api/systemApi'
import { formatBytes, formatPercent } from '../utils/format'
import { UsageBar } from './UsageBar'

interface MemoryPanelProps {
  interval: RefreshInterval
}

export function MemoryPanel({ interval }: MemoryPanelProps) {
  const { data, loading, error } = useAutoRefresh(systemApi.getMemoryInfo, interval)

  return (
    <section className="panel">
      <h2 className="panel__title">Memory</h2>
      {loading && <p className="state">Loading…</p>}
      {error && <p className="state state--error">{error}</p>}
      {data && (
        <>
          <UsageBar percent={data.usedPercent} />
          <dl className="info-grid">
            <div><dt>Total</dt><dd>{formatBytes(data.total)}</dd></div>
            <div><dt>Used</dt><dd>{formatBytes(data.used)}</dd></div>
            <div><dt>Free</dt><dd>{formatBytes(data.free)}</dd></div>
            <div><dt>Usage</dt><dd>{formatPercent(data.usedPercent)}</dd></div>
          </dl>
        </>
      )}
    </section>
  )
}
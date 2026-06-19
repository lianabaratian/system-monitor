import { useAutoRefresh, type RefreshInterval } from '../hooks/useAutoRefresh'
import { systemApi } from '../api/systemApi'
import { formatBytes, formatPercent } from '../utils/format'
import { UsageBar } from './UsageBar'

interface DiskPanelProps {
  interval: RefreshInterval
}

export function DiskPanel({ interval }: DiskPanelProps) {
  const { data, loading, error } = useAutoRefresh(systemApi.getDiskInfo, interval)

  return (
    <section className="panel">
      <h2 className="panel__title">Disk</h2>
      {loading && <p className="state">Loading…</p>}
      {error && <p className="state state--error">{error}</p>}
      {data && data.length === 0 && <p className="state">No disks found.</p>}
      {data &&
        data.map((disk) => (
          <div key={disk.mount} className="disk-row">
            <div className="disk-row__header">
              <span className="disk-row__mount">{disk.mount}</span>
              <span className="disk-row__usage">{formatPercent(disk.usedPercent)}</span>
            </div>
            <UsageBar percent={disk.usedPercent} />
            <dl className="info-grid">
              <div><dt>Total</dt><dd>{formatBytes(disk.total)}</dd></div>
              <div><dt>Used</dt><dd>{formatBytes(disk.used)}</dd></div>
              <div><dt>Free</dt><dd>{formatBytes(disk.free)}</dd></div>
              <div><dt>Usage</dt><dd>{formatPercent(disk.usedPercent)}</dd></div>
            </dl>
          </div>
        ))}
    </section>
  )
}
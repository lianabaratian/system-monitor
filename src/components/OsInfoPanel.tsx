import { useAutoRefresh } from '../hooks/useAutoRefresh'
import { systemApi } from '../api/systemApi'

export function OsInfoPanel() {
  const { data, loading, error } = useAutoRefresh(systemApi.getOsInfo, 'manual')

  return (
    <section className="panel">
      <h2 className="panel__title">Operating System</h2>
      {loading && <p className="state">Loading…</p>}
      {error && <p className="state state--error">{error}</p>}
      {data && (
        <dl className="info-grid">
          <div><dt>OS</dt><dd>{data.distro}</dd></div>
          <div><dt>Version</dt><dd>{data.release}</dd></div>
          <div><dt>Platform</dt><dd>{data.platform}</dd></div>
          <div><dt>Architecture</dt><dd>{data.arch}</dd></div>
          <div><dt>Hostname</dt><dd>{data.hostname}</dd></div>
          <div><dt>User</dt><dd>{data.username ?? 'N/A'}</dd></div>
        </dl>
      )}
    </section>
  )
}
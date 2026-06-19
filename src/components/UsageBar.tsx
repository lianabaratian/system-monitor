interface UsageBarProps {
  percent: number
}

export function UsageBar({ percent }: UsageBarProps) {
  const clamped = Math.min(100, Math.max(0, percent))
  const level = clamped >= 85 ? 'high' : clamped >= 60 ? 'medium' : 'low'
  return (
    <div
      className="usage-bar"
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`usage-bar__fill usage-bar__fill--${level}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
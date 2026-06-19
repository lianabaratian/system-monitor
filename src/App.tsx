import { useState } from 'react'
import { OsInfoPanel } from './components/OsInfoPanel'
import { ProcessList } from './components/ProcessList'
import { MemoryPanel } from './components/MemoryPanel'
import { DiskPanel } from './components/DiskPanel'
import './App.css'

type View = 'system' | 'processes' | 'memory' | 'disk'

const NAV_ITEMS: { id: View; label: string }[] = [
  { id: 'system', label: 'System' },
  { id: 'processes', label: 'Processes' },
  { id: 'memory', label: 'Memory' },
  { id: 'disk', label: 'Disk' },
]

const LIVE_INTERVAL = 5000

function App() {
  const [view, setView] = useState<View>('system')

  return (
    <div className="app">
      <aside className="sidebar">
        <h1 className="sidebar__brand">System Monitor</h1>
        <nav className="sidebar__nav">
           {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${view === item.id ? 'nav-item--active' : ''}`}
              onClick={() => setView(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="content">
        {view === 'system' && <OsInfoPanel />}
        {view === 'processes' && <ProcessList />}
        {view === 'memory' && <MemoryPanel interval={LIVE_INTERVAL} />}
        {view === 'disk' && <DiskPanel interval={LIVE_INTERVAL} />}
      </main>
    </div>
  )
}

export default App